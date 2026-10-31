/* ============================================================
   LLM · 学习站的大模型客户端
   ------------------------------------------------------------
   支持三类后端，全部走 OpenAI 兼容协议（POST {base}/chat/completions）：
     1. DeepSeek 官方        https://api.deepseek.com/v1
     2. 本地/自建的 OpenAI 兼容服务（Ollama、LM Studio、vLLM、one-api…）
     3. 本仓库自带的本地代理 ds-proxy.py（解决浏览器跨域 + 隐藏 key）

   配置只存本机 localStorage，只发往用户填写的 Base URL，不经任何第三方。
   若浏览器直连被跨域策略拦截，错误对象会带 kind="cors"，界面给出代理方案。
   ============================================================ */
var LLM = (function () {
  "use strict";

  var CFG_KEY = "rtr_llm_cfg_v1";

  /* ---------- 预设 ---------- */
  var PRESETS = {
    deepseek: {
      label: "DeepSeek 官方",
      base: "https://api.deepseek.com/v1",
      models: ["deepseek-v4-pro", "deepseek-v4-flash"],
      needKey: true,
      note: "key 在 platform.deepseek.com 申请（模型名 deepseek-chat / deepseek-reasoner 已于 2026-07-24 弃用）。"
    },
    ollama: {
      label: "本地 Ollama",
      base: "http://127.0.0.1:11434/v1",
      models: [],
      needKey: false,
      note: "先 ollama serve，再 ollama pull 一个模型（如 qwen3:8b）。key 随便填或留空。"
    },
    lmstudio: {
      label: "本地 LM Studio",
      base: "http://127.0.0.1:1234/v1",
      models: [],
      needKey: false,
      note: "在 LM Studio 里打开 Local Server（默认 1234 端口），key 随便填或留空。"
    },
    proxy: {
      label: "本地代理（本仓库 ds-proxy.py）",
      base: "http://127.0.0.1:8787/v1",
      models: ["deepseek-v4-pro", "deepseek-v4-flash"],
      needKey: false,
      note: "先运行 ds-proxy.py，再把 Base URL 指向它。API Key 可以留空——推荐把 key 只写在代理端启动命令里，这样密钥不进浏览器。这条路径不受浏览器跨域限制。"
    },
    custom: {
      label: "自定义 OpenAI 兼容",
      base: "",
      models: [],
      needKey: true,
      note: "Base URL 填到版本段为止，例如 https://your-host/v1 或 https://your-host/openai/v1，不要带 /chat/completions。"
    }
  };

  /* ---------- 配置读写 ---------- */
  var DEFAULTS = {
    preset: "deepseek",
    base: PRESETS.deepseek.base,
    key: "",
    model: "deepseek-v4-pro",
    temperature: 0.7,
    /* 1024 对思考模型远远不够：reasoning 先吃掉一大半，正文写半句就断。
       4096 是大多数场景的安全值，设置面板里可以再调。 */
    maxTokens: 4096,
    stream: true,
    showReasoning: true,
    timeout: 120
  };

  function loadCfg() {
    var cfg = {};
    Object.keys(DEFAULTS).forEach(function (k) { cfg[k] = DEFAULTS[k]; });
    try {
      var raw = localStorage.getItem(CFG_KEY);
      if (raw) {
        var j = JSON.parse(raw);
        Object.keys(DEFAULTS).forEach(function (k) {
          if (j[k] !== undefined && j[k] !== null) cfg[k] = j[k];
        });
      }
    } catch (e) { /* 配置损坏则回落到默认值 */ }
    return cfg;
  }

  function saveCfg(cfg) {
    try { localStorage.setItem(CFG_KEY, JSON.stringify(cfg)); return true; }
    catch (e) { return false; }
  }

  function clearCfg() {
    try { localStorage.removeItem(CFG_KEY); } catch (e) { }
  }

  var cfg = loadCfg();

  function getCfg() { return JSON.parse(JSON.stringify(cfg)); }
  function setCfg(patch) {
    Object.keys(patch).forEach(function (k) { cfg[k] = patch[k]; });
    saveCfg(cfg);
    return getCfg();
  }
  function resetCfg() {
    cfg = JSON.parse(JSON.stringify(DEFAULTS));
    saveCfg(cfg);
    return getCfg();
  }
  function preset(id) { return PRESETS[id] || PRESETS.custom; }
  function presetList() {
    return Object.keys(PRESETS).map(function (k) {
      return { id: k, label: PRESETS[k].label, note: PRESETS[k].note, base: PRESETS[k].base, models: PRESETS[k].models, needKey: PRESETS[k].needKey };
    });
  }

  /* 指向本机（或局域网自建）的地址通常不需要 key：key 多半在服务端/代理端 */
  function isLocalURL(u) {
    return /^https?:\/\/(127\.0\.0\.1|localhost|\[::1\]|0\.0\.0\.0|10\.|192\.168\.|172\.(1[6-9]|2\d|3[01])\.)/i.test(String(u || "").trim());
  }

  /* 是否已具备发起对话的最低条件 */
  function ready() {
    if (!cfg.base || !cfg.model) return false;
    var p = preset(cfg.preset);
    if (p.needKey && !cfg.key && !isLocalURL(cfg.base)) return false;
    return true;
  }
  function missing() {
    var miss = [];
    if (!cfg.base) miss.push("Base URL");
    if (!cfg.model) miss.push("模型名");
    var p = preset(cfg.preset);
    if (p.needKey && !cfg.key && !isLocalURL(cfg.base)) miss.push("API Key");
    return miss;
  }

  /* ---------- URL 与错误 ---------- */
  function joinURL(base, tail) {
    var b = String(base || "").trim().replace(/\/+$/, "");
    /* 用户若把完整 endpoint 粘进来，容错处理 */
    b = b.replace(/\/chat\/completions$/, "");
    return b + tail;
  }
  function endpoint(path) { return joinURL(cfg.base, path); }

  function UpstreamError(message, kind, status, body) {
    var e = new Error(message);
    e.kind = kind || "unknown";
    e.status = status || 0;
    e.body = body || "";
    return e;
  }

  function describeNetworkFailure() {
    return "无法连接到 " + cfg.base +
      "。常见原因：① 目标地址写错或服务没启动；② 浏览器跨域（CORS）拦截——绝大多数云端 API 与部分本地服务会拦，" +
      "启用本仓库自带的 ds-proxy.py 本地代理即可绕过（代理固定监听 127.0.0.1:8787，把 Base URL 指过去）；" +
      "③ 页面是 https 而接口是 http（混合内容），改用本地单文件打开或统一协议。";
  }

  function classify(resp, bodyText, model) {
    var status = resp.status;
    var detail = "";
    try {
      var j = JSON.parse(bodyText);
      detail = (j.error && (j.error.message || j.error.type)) || j.message || "";
    } catch (e) { detail = bodyText ? bodyText.slice(0, 200) : ""; }

    if (status === 401 || status === 403) {
      return UpstreamError("鉴权失败（HTTP " + status + "）：API Key 无效、过期或权限不足。" + (detail ? " 服务端说：" + detail : ""), "auth", status, bodyText);
    }
    if (status === 404) {
      return UpstreamError("接口或模型不存在（HTTP 404）。检查 Base URL 是否多写/少写了 /v1，以及模型名「" + model + "」是否存在。" + (detail ? " 服务端说：" + detail : ""), "notfound", status, bodyText);
    }
    if (status === 429) {
      return UpstreamError("被限流（HTTP 429）：请求过快或额度用尽。" + (detail ? " 服务端说：" + detail : ""), "ratelimit", status, bodyText);
    }
    if (status === 400 || status === 422) {
      return UpstreamError("请求被拒绝（HTTP " + status + "）：通常是模型名或参数不合法。" + (detail ? " 服务端说：" : "") + detail, "badrequest", status, bodyText);
    }
    if (status >= 500) {
      return UpstreamError("上游服务错误（HTTP " + status + "），稍后重试。" + (detail ? " 服务端说：" : "") + detail, "server", status, bodyText);
    }
    return UpstreamError("请求失败（HTTP " + status + "）。" + detail, "http", status, bodyText);
  }

  /* ---------- 请求体 ---------- */
  function buildBody(messages, opts) {
    opts = opts || {};
    var body = {
      model: opts.model || cfg.model,
      messages: messages,
      temperature: opts.temperature !== undefined ? opts.temperature : cfg.temperature,
      stream: !!opts.stream
    };
    var mt = opts.maxTokens !== undefined ? opts.maxTokens : cfg.maxTokens;
    if (mt && mt > 0) body.max_tokens = mt;
    if (opts.extra) Object.keys(opts.extra).forEach(function (k) { body[k] = opts.extra[k]; });
    return body;
  }

  function headers() {
    var h = { "Content-Type": "application/json" };
    /* 本地服务常要求一个非空 Authorization，填什么值都行 */
    h.Authorization = "Bearer " + (cfg.key || "not-needed");
    return h;
  }

  /*
     超时守卫：不是「总共只给你 N 秒」，而是「多久没动静才放弃」。
     长回答 + 思考链常常超过一分钟，用总时长计时会把它拦腰砍断；
     空闲计时则在数据持续到达时不断续期，只有当流真的卡住时才触发。

     firstMs：从发出请求到第一块数据的容忍时间
     idleMs ：已经开始收数据后，两块数据之间的容忍时间
     返回值里的 bump() 每收到一块数据调用一次。
  */
  function timeoutCtl(firstMs, external, idleMs) {
    var ctl = new AbortController();
    idleMs = idleMs || firstMs;
    var why = "";          /* "timeout" | "idle" | "external" */
    var timer = null;
    function arm(ms, reason) {
      clearTimeout(timer);
      timer = setTimeout(function () { why = reason; ctl.abort(reason); }, ms);
    }
    arm(firstMs, "timeout");
    var onExt = null;
    if (external) {
      if (external.aborted) { why = "external"; ctl.abort("external"); }
      else {
        onExt = function () { why = "external"; ctl.abort("external"); };
        external.addEventListener("abort", onExt);
      }
    }
    return {
      signal: ctl.signal,
      bump: function () { if (!why) arm(idleMs, "idle"); },
      idleMs: function () { return idleMs; },
      firstMs: function () { return firstMs; },
      abortedBy: function () { return why || "timeout"; },
      timedOutIdle: function () { return why === "idle"; },
      done: function () { clearTimeout(timer); if (external && onExt) external.removeEventListener("abort", onExt); }
    };
  }

  /* ---------- SSE 解析 ---------- */
  /* 把一段 SSE 文本喂给回调；返回未消费的残留 */
  function feedSSE(buffer, handlers) {
    var idx;
    while ((idx = buffer.indexOf("\n")) >= 0) {
      var line = buffer.slice(0, idx);
      buffer = buffer.slice(idx + 1);
      line = line.replace(/\r$/, "").trim();
      if (!line) continue;
      if (line.charAt(0) === ":") continue;                 /* 注释/心跳 */
      if (line.indexOf("data:") !== 0) continue;
      var payload = line.slice(5).trim();
      if (payload === "[DONE]") { handlers.done(); continue; }
      var j;
      try { j = JSON.parse(payload); } catch (e) { continue; }
      var ch = (j.choices || [])[0] || {};
      var d = ch.delta || ch.message || {};
      if (d.reasoning_content) handlers.reasoning(d.reasoning_content);
      if (d.content) handlers.content(d.content);
      if (j.usage) handlers.usage(j.usage);
      if (ch.finish_reason) handlers.finish(ch.finish_reason);
    }
    return buffer;
  }

  /* ---------- 主调用 ---------- */
  /*
     LLM.chat(messages, {
       stream: 是否流式（默认取配置）
       onDelta(text)        正文增量
       onReasoning(text)    思维链增量（DeepSeek 思考模式 / QwQ 等）
       onFirst()            首个 token 到达
       onDone(result)       完成：{text, reasoning, usage, ms, model}
     }) → Promise<result>
     失败时 reject 一个带 kind 字段的 Error
   */
  function chat(messages, opts) {
    opts = opts || {};
    var useStream = opts.stream !== undefined ? !!opts.stream : !!cfg.stream;
    var url = endpoint("/chat/completions");
    var body = buildBody(messages, { model: opts.model, temperature: opts.temperature, maxTokens: opts.maxTokens, stream: useStream, extra: opts.extra });
    var waitMs = (opts.timeout || cfg.timeout || 120) * 1000;
    /* 数据一旦开始流动，就不再按总时长砍，改成「45 秒没新内容才放弃」 */
    var t = timeoutCtl(waitMs, opts.signal, Math.min(waitMs, 45000));
    var t0 = Date.now();
    var acc = { text: "", reasoning: "", usage: null, model: body.model, ms: 0,
                finishReason: "", truncated: false, interrupted: false };
    var first = true;

    if (!cfg.base) return Promise.reject(UpstreamError("尚未配置 Base URL，请先在「AI 学伴 → 模型设置」里填写。", "config", 0, ""));
    if (!body.model) return Promise.reject(UpstreamError("尚未配置模型名。", "config", 0, ""));

    return fetch(url, {
      method: "POST",
      headers: headers(),
      body: JSON.stringify(body),
      signal: t.signal
    }).then(function (resp) {
      if (!resp.ok) {
        return resp.text().then(function (txt) { throw classify(resp, txt, body.model); });
      }
      var ctype = resp.headers.get("content-type") || "";

      /* 服务端忽略 stream 参数，直接回了整段 JSON */
      if (!useStream || (ctype.indexOf("text/event-stream") < 0 && ctype.indexOf("application/json") >= 0)) {
        return resp.text().then(function (txt) {
          var j = null;
          try { j = JSON.parse(txt); } catch (e) {
            /* 可能是没有 SSE 包装的流；按 SSE 再试一次 */
            var r = { text: "", reasoning: "", usage: null, model: body.model, ms: 0, finishReason: "", truncated: false };
            feedSSE(txt + "\n", {
              content: function (s) { r.text += s; if (opts.onDelta) opts.onDelta(s); },
              reasoning: function (s) { r.reasoning += s; if (opts.onReasoning) opts.onReasoning(s); },
              usage: function (u) { r.usage = u; },
              finish: function (fr) { r.finishReason = fr; if (fr === "length" || fr === "content_filter") r.truncated = true; },
              done: function () { }
            });
            if (!r.text && !r.reasoning) throw UpstreamError("服务端返回了无法解析的内容：" + txt.slice(0, 180), "parse", resp.status, txt);
            r.ms = Date.now() - t0;
            if (opts.onDone) opts.onDone(r);
            return r;
          }
          var choice = (j.choices || [])[0] || {};
          var msg = choice.message || {};
          acc.text = msg.content || "";
          acc.reasoning = msg.reasoning_content || "";
          acc.usage = j.usage || null;
          acc.finishReason = choice.finish_reason || "";
          if (acc.finishReason === "length" || acc.finishReason === "content_filter") acc.truncated = true;
          if (acc.reasoning && opts.onReasoning) opts.onReasoning(acc.reasoning);
          if (acc.text && opts.onDelta) opts.onDelta(acc.text);
          acc.ms = Date.now() - t0;
          if (opts.onFirst) opts.onFirst();
          if (opts.onDone) opts.onDone(acc);
          return acc;
        });
      }

      /* 真正的流式 */
      if (!resp.body || !resp.body.getReader) {
        return resp.text().then(function (txt) {
          acc.text = txt;
          if (opts.onDelta) opts.onDelta(txt);
          acc.ms = Date.now() - t0;
          if (opts.onDone) opts.onDone(acc);
          return acc;
        });
      }

      var reader = resp.body.getReader();
      var dec = new TextDecoder("utf-8");
      var buf = "";
      var finished = false;
      var sawDone = false;      /* 收到过 [DONE] 才算上游正常收尾 */

      var h = {
        content: function (s) {
          if (first) { first = false; if (opts.onFirst) opts.onFirst(); }
          acc.text += s;
          if (opts.onDelta) opts.onDelta(s);
        },
        reasoning: function (s) {
          if (first) { first = false; if (opts.onFirst) opts.onFirst(); }
          acc.reasoning += s;
          if (opts.onReasoning) opts.onReasoning(s);
        },
        usage: function (u) { acc.usage = u; },
        finish: function (fr) {
          acc.finishReason = fr;
          /* length = 撞到 max_tokens；content_filter = 被内容策略掐断 */
          if (fr === "length" || fr === "content_filter") acc.truncated = true;
        },
        done: function () { finished = true; sawDone = true; }
      };

      function pump() {
        return reader.read().then(function (r) {
          if (r.done) {
            if (buf.trim()) feedSSE(buf + "\n", h);
            finished = true;
            /* 连接被干净地关掉时，浏览器只给 done=true，不会报错。
               正常收尾一定带 [DONE] 或 finish_reason；两者都没有，就是上游半路掐断了。 */
            if (!sawDone && !acc.finishReason) acc.interrupted = true;
            acc.ms = Date.now() - t0;
            if (opts.onDone) opts.onDone(acc);
            return acc;
          }
          t.bump();
          buf += dec.decode(r.value, { stream: true });
          buf = feedSSE(buf, h);
          return pump();
        });
      }
      return pump();
    }).catch(function (e) {
      if (e && e.name === "AbortError") {
        if (t.abortedBy() === "external") throw UpstreamError("已停止。", "aborted", 0, "");
        if (t.timedOutIdle()) {
          throw UpstreamError("连接中途断了：已经 " + Math.round(t.idleMs() / 1000) + " 秒没有收到任何新内容。已生成的部分保留在上面。", "timeout", 0, "");
        }
        throw UpstreamError("请求超时：等了 " + Math.round(t.firstMs() / 1000) + " 秒还没开始返回内容。本地大模型首次加载较慢，可在设置里调大超时。", "timeout", 0, "");
      }
      if (e && e.kind) throw e;
      throw UpstreamError(describeNetworkFailure() + "（底层报错：" + (e && e.message ? e.message : e) + "）", "cors", 0, "");
    }).finally(function () { t.done(); });
  }

  /* ---------- 连通性测试 ---------- */
  function test() {
    var t0 = Date.now();
    return chat([{ role: "user", content: "ping" }], { stream: false, maxTokens: 8, timeout: 30 })
      .then(function (r) {
        return { ok: true, ms: Date.now() - t0, reply: (r.text || "").slice(0, 60), model: r.model, usage: r.usage };
      })
      .catch(function (e) {
        return { ok: false, ms: Date.now() - t0, kind: e.kind || "unknown", message: e.message };
      });
  }

  /* ---------- 模型列表 ---------- */
  function models() {
    var url = endpoint("/models");
    var t = timeoutCtl(15000);
    return fetch(url, { headers: headers(), signal: t.signal })
      .then(function (r) {
        if (!r.ok) return r.text().then(function (txt) { throw classify(r, txt, ""); });
        return r.json();
      })
      .then(function (j) {
        var arr = (j.data || j.models || []).map(function (m) {
          return typeof m === "string" ? m : (m.id || m.name || "");
        }).filter(Boolean);
        return { ok: true, models: arr };
      })
      .catch(function (e) {
        if (e && e.name === "AbortError") e = UpstreamError("拉取模型列表超时。", "timeout", 0, "");
        return { ok: false, message: e.message || String(e), kind: e.kind || "cors" };
      })
      .finally(function () { t.done(); });
  }

  return {
    PRESETS: PRESETS,
    presetList: presetList, preset: preset,
    getCfg: getCfg, setCfg: setCfg, resetCfg: resetCfg, clearCfg: clearCfg,
    ready: ready, missing: missing, isLocalURL: isLocalURL,
    chat: chat, test: test, models: models,
    endpoint: endpoint, joinURL: joinURL,
    UpstreamError: UpstreamError
  };
})();
