/* ============================================================
   ink.js —— 手写批注层（Wacom / 触控笔 / 鼠标）
   ------------------------------------------------------------
   设计要点：
   1. 浏览器里 Wacom 就是标准 pointer，事件里直接带 pressure / tilt，
      不需要任何厂商 SDK。用 pointerType==='pen' 判断压感是否可信。
   2. 笔迹存「归一化坐标」（0–1）+ 压力值，窗口改宽、字号变化都不错位。
   3. 存 IndexedDB（localStorage 5MB 撑不住几十页涂画，且不能污染核心存档）。
   4. 关闭时 canvas 是 pointer-events:none，不干扰选择文字、拖滑轨、点折叠。
   ============================================================ */
(function (root) {
  "use strict";

  var DB_NAME = "rtr-ink", DB_VER = 1, STORE = "pages";
  var REF_W = 780;              /* 线宽基准宽度：按 780px 栏宽定标 */
  var TOOLS = { p: "pen", h: "hif", e: "era" };

  var db = null, dbReady = null;
  var state = {
    on: false, tool: "p", color: "#3ee8f0", scale: 1,
    stage: null, key: "", canvas: null, ctx: null,
    strokes: [], redo: [], drawing: null,
    W: 0, H: 0, dpr: 1, ro: null, saveTimer: 0
  };

  /* ---------- IndexedDB ---------- */
  function openDB() {
    if (dbReady) return dbReady;
    dbReady = new Promise(function (res) {
      try {
        var r = indexedDB.open(DB_NAME, DB_VER);
        r.onupgradeneeded = function () {
          var d = r.result;
          if (!d.objectStoreNames.contains(STORE)) d.createObjectStore(STORE);
        };
        r.onsuccess = function () { db = r.result; res(db); };
        r.onerror = function () { res(null); };        /* 隐私模式 / 禁用时优雅退化 */
      } catch (e) { res(null); }
    });
    return dbReady;
  }
  function idbGet(key) {
    return openDB().then(function (d) {
      if (!d) return null;
      return new Promise(function (res) {
        try {
          var q = d.transaction(STORE, "readonly").objectStore(STORE).get(key);
          q.onsuccess = function () { res(q.result || null); };
          q.onerror = function () { res(null); };
        } catch (e) { res(null); }
      });
    });
  }
  function idbPut(key, val) {
    return openDB().then(function (d) {
      if (!d) return;
      try { d.transaction(STORE, "readwrite").objectStore(STORE).put(val, key); } catch (e) {}
    });
  }

  /* ---------- 几何：Catmull-Rom 平滑 + 变宽描边 ---------- */
  function smooth(pts, step) {
    /* pts: [{x,y,p}] 归一化。返回加密后的采样点 */
    if (pts.length < 2) return pts.slice();
    var out = [], i, t, a, b, c, d, x, y, p;
    for (i = 0; i < pts.length - 1; i++) {
      a = pts[i > 0 ? i - 1 : 0];
      b = pts[i];
      c = pts[i + 1];
      d = pts[i + 2 < pts.length ? i + 2 : pts.length - 1];
      for (t = 0; t < 1; t += step) {
        var t2 = t * t, t3 = t2 * t;
        x = 0.5 * ((2 * b.x) + (-a.x + c.x) * t + (2 * a.x - 5 * b.x + 4 * c.x - d.x) * t2 + (-a.x + 3 * b.x - 3 * c.x + d.x) * t3);
        y = 0.5 * ((2 * b.y) + (-a.y + c.y) * t + (2 * a.y - 5 * b.y + 4 * c.y - d.y) * t2 + (-a.y + 3 * b.y - 3 * c.y + d.y) * t3);
        p = b.p + (c.p - b.p) * t;
        out.push({ x: x, y: y, p: p });
      }
    }
    out.push(pts[pts.length - 1]);
    return out;
  }

  function strokePath(ctx, s, W, H) {
    var pts = smooth(s.pts, 0.18);
    if (!pts.length) return;
    var k = s.t === "h" ? 1 : 1;                /* 线宽倍率 */
    var base = s.w * (W / REF_W) * k;
    var i, n, x1, y1, x2, y2, dx, dy, len, nx, ny, w;
    var L = [], R = [];
    for (i = 0; i < pts.length; i++) {
      n = pts[i];
      var prev = pts[i > 0 ? i - 1 : 0], next = pts[i + 1 < pts.length ? i + 1 : pts.length - 1];
      dx = (next.x - prev.x) * W; dy = (next.y - prev.y) * H;
      len = Math.sqrt(dx * dx + dy * dy) || 1;
      nx = -dy / len; ny = dx / len;
      w = base * (0.22 + 0.78 * (n.p === undefined ? 0.5 : n.p)) / 2;
      x1 = n.x * W; y1 = n.y * H;
      L.push([x1 + nx * w, y1 + ny * w]);
      R.push([x1 - nx * w, y1 - ny * w]);
    }
    ctx.beginPath();
    ctx.moveTo(L[0][0], L[0][1]);
    for (i = 1; i < L.length; i++) ctx.lineTo(L[i][0], L[i][1]);
    for (i = R.length - 1; i >= 0; i--) ctx.lineTo(R[i][0], R[i][1]);
    ctx.closePath();
    ctx.fill();
    /* 单点时补一个圆，否则点不出墨 */
    if (pts.length === 1) {
      ctx.beginPath();
      ctx.arc(pts[0].x * W, pts[0].y * H, Math.max(0.6, base / 2), 0, 6.2832);
      ctx.fill();
    }
  }

  function render() {
    var c = state.canvas, ctx = state.ctx;
    if (!c || !ctx) return;
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, c.width, c.height);
    ctx.setTransform(state.dpr, 0, 0, state.dpr, 0, 0);
    var all = state.strokes.concat(state.drawing ? [state.drawing] : []);
    for (var i = 0; i < all.length; i++) {
      var s = all[i];
      ctx.save();
      if (s.t === "e") { ctx.globalCompositeOperation = "destination-out"; ctx.fillStyle = "#000"; }
      else { ctx.globalCompositeOperation = "source-over"; ctx.fillStyle = s.c; ctx.globalAlpha = s.t === "h" ? 0.26 : 1; }
      strokePath(ctx, s, state.W, state.H);
      ctx.restore();
    }
  }

  /* ---------- 尺寸 ---------- */
  function resize() {
    var st = state.stage, c = state.canvas;
    if (!st || !c) return;
    var W = st.clientWidth, H = st.scrollHeight;
    if (!W || !H) return;
    var dpr = Math.min(root.devicePixelRatio || 1, 2);
    state.W = W; state.H = H; state.dpr = dpr;
    c.width = Math.round(W * dpr); c.height = Math.round(H * dpr);
    c.style.width = W + "px"; c.style.height = H + "px";
    render();
  }

  /* ---------- 存储 ---------- */
  function pack() {
    return { v: 1, strokes: state.strokes.map(function (s) {
      var pts = [];
      for (var i = 0; i < s.pts.length; i++) {
        pts.push(Math.round(s.pts[i].x * 1e4) / 1e4, Math.round(s.pts[i].y * 1e4) / 1e4, Math.round((s.pts[i].p || 0.5) * 100) / 100);
      }
      return { t: s.t, c: s.c, w: s.w, pts: pts };
    }) };
  }
  function unpack(o) {
    if (!o || !o.strokes) return [];
    return o.strokes.map(function (s) {
      var pts = [];
      for (var i = 0; i + 2 < s.pts.length + 1; i += 3) pts.push({ x: s.pts[i], y: s.pts[i + 1], p: s.pts[i + 2] });
      return { t: s.t, c: s.c, w: s.w, pts: pts };
    });
  }
  function save() {
    if (!state.key) return;
    clearTimeout(state.saveTimer);
    state.saveTimer = setTimeout(function () {
      idbPut(state.key, pack());
    }, 320);
  }
  function saveNow() {
    if (!state.key) return;
    clearTimeout(state.saveTimer);
    idbPut(state.key, pack());
  }

  /* ---------- 绘制交互 ---------- */
  function pos(e) {
    var r = state.canvas.getBoundingClientRect();
    var x = (e.clientX - r.left) / (r.width || 1);
    var y = (e.clientY - r.top) / (r.height || 1);
    return { x: Math.max(0, Math.min(1, x)), y: Math.max(0, Math.min(1, y)), p: press(e) };
  }
  function press(e) {
    /* 只有真正的笔才信 pressure；鼠标恒为 0.5，手滑会抖 */
    if (e.pointerType === "pen" && e.pressure > 0 && e.pressure !== 0.5) return e.pressure;
    if (e.pointerType === "pen" && e.pressure > 0) return e.pressure;
    return 0.5;
  }

  function begin(e) {
    if (!state.on || e.button > 0) return;
    e.preventDefault();
    try { state.canvas.setPointerCapture && state.canvas.setPointerCapture(e.pointerId); } catch (err) {}
    state.drawing = { t: state.tool, c: state.color, w: widthFor(), pts: [pos(e)] };
    render();
  }
  function move(e) {
    if (!state.drawing) return;
    e.preventDefault();
    /* getCoalescedEvents 在部分环境（合成事件 / 旧版 WebKit）返回空数组，
       此时必须退回事件本身，否则整条笔画只剩一个点 */
    var evs = e.getCoalescedEvents ? e.getCoalescedEvents() : null;
    if (!evs || !evs.length) evs = [e];
    for (var i = 0; i < evs.length; i++) {
      var pt = pos(evs[i]);
      var last = state.drawing.pts[state.drawing.pts.length - 1];
      if (Math.abs(pt.x - last.x) * state.W < 0.8 && Math.abs(pt.y - last.y) * state.H < 0.8) continue;
      state.drawing.pts.push(pt);
    }
    render();
  }
  function end(e) {
    if (!state.drawing) return;
    e && e.preventDefault && e.preventDefault();
    var s = state.drawing;
    state.drawing = null;
    if (s.pts.length >= 1) {
      state.strokes.push(s);
      state.redo.length = 0;
      save();
      render();
      syncTools();
    }
  }
  function widthFor() {
    var k = state.scale || 1;
    if (state.tool === "h") return 32 * k;     /* 荧光笔：满压约 16px 宽 */
    if (state.tool === "e") return 36 * k;     /* 橡皮：约 18px */
    return 5.2 * k;                            /* 毛笔：满压约 2.6px，最细约 0.6px */
  }

  /* ---------- 外部接口 ---------- */
  function attach(stageEl, key) {
    state.stage = stageEl;
    if (!stageEl) return;
    if (state.key !== key) {
      saveNow();
      state.key = key;
      state.strokes = []; state.redo.length = 0; state.drawing = null;
      idbGet(key).then(function (o) { state.strokes = unpack(o); render(); syncTools(); });
    }
    if (!state.canvas || state.canvas.parentNode !== stageEl) {
      var c = document.createElement("canvas");
      c.id = "ink-layer";
      c.className = "ink-layer";
      stageEl.appendChild(c);
      state.canvas = c;
      state.ctx = c.getContext("2d");
      c.style.pointerEvents = state.on ? "auto" : "none";
      c.addEventListener("pointerdown", begin);
      c.addEventListener("pointermove", move);
      c.addEventListener("pointerup", end);
      c.addEventListener("pointercancel", end);
      c.addEventListener("pointerleave", function (e) { if (state.drawing) end(e); });
      c.addEventListener("contextmenu", function (e) { if (state.on) e.preventDefault(); });
      if (!state.ro) {
        state.ro = new ResizeObserver(function () { resize(); });
      }
      state.ro.disconnect();
      state.ro.observe(stageEl);
    }
    resize();
    /* 图片/公式晚到时页高会变，追两次 */
    setTimeout(resize, 260);
    setTimeout(resize, 900);
  }

  function setOn(v) {
    state.on = !!v;
    document.body.classList.toggle("ink-on", state.on);
    if (state.canvas) state.canvas.style.pointerEvents = state.on ? "auto" : "none";
    if (!state.on) { state.drawing = null; render(); }
    syncTools();
  }

  function setTool(t) { state.tool = t; syncTools(); }
  function setColor(c) { state.color = c; state.tool = state.tool === "e" ? "p" : state.tool; syncTools(); }

  function undo() {
    if (!state.strokes.length) return;
    state.redo.push(state.strokes.pop()); save(); render(); syncTools();
  }
  function redo() {
    if (!state.redo.length) return;
    state.strokes.push(state.redo.pop()); save(); render(); syncTools();
  }
  function clearPage() {
    if (!state.strokes.length) return;
    if (!confirm("清空本页所有笔迹？")) return;
    state.redo = state.strokes.slice();
    state.strokes = [];
    save(); render(); syncTools();
  }

  /* ---------- 工具条 ---------- */
  var UI = null;
  function buildUI() {
    if (UI) return UI;
    var box = document.createElement("div");
    box.className = "ink-bar";
    box.innerHTML =
      '<button class="ink-fab" id="ink-fab" title="批注模式（快捷键 N）">✎</button>' +
      '<div class="ink-tools" id="ink-tools">' +
        '<button data-tool="p" title="毛笔（快捷键 P）">笔</button>' +
        '<button data-tool="h" title="荧光笔（快捷键 H）">荧</button>' +
        '<button data-tool="e" title="橡皮（快捷键 E）">擦</button>' +
        '<span class="ink-sep"></span>' +
        '<button data-color="#3ee8f0" class="ink-c" style="--c:#3ee8f0" title="青"></button>' +
        '<button data-color="#ffd166" class="ink-c" style="--c:#ffd166" title="金"></button>' +
        '<button data-color="#ff7ad9" class="ink-c" style="--c:#ff7ad9" title="品红"></button>' +
        '<button data-color="#e8e4ff" class="ink-c" style="--c:#e8e4ff" title="白"></button>' +
        '<span class="ink-sep"></span>' +
        '<button id="ink-undo" title="撤销（⌘Z）">↶</button>' +
        '<button id="ink-redo" title="重做（⇧⌘Z）">↷</button>' +
        '<button id="ink-clear" title="清空本页">清</button>' +
      "</div>";
    document.body.appendChild(box);
    UI = box;

    box.querySelector("#ink-fab").onclick = function () { setOn(!state.on); };
    box.querySelectorAll("[data-tool]").forEach(function (b) {
      b.onclick = function () { setTool(b.dataset.tool); };
    });
    box.querySelectorAll("[data-color]").forEach(function (b) {
      b.onclick = function () { setColor(b.dataset.color); };
    });
    box.querySelector("#ink-undo").onclick = undo;
    box.querySelector("#ink-redo").onclick = redo;
    box.querySelector("#ink-clear").onclick = clearPage;
    return box;
  }

  function syncTools() {
    if (!UI) return;
    UI.classList.toggle("on", state.on);
    var f = UI.querySelector("#ink-fab");
    if (f) f.classList.toggle("active", state.on);
    UI.querySelectorAll("[data-tool]").forEach(function (b) {
      b.classList.toggle("sel", b.dataset.tool === state.tool);
    });
    UI.querySelectorAll("[data-color]").forEach(function (b) {
      b.classList.toggle("sel", b.dataset.color === state.color);
    });
    var u = UI.querySelector("#ink-undo"), r = UI.querySelector("#ink-redo");
    if (u) u.disabled = !state.strokes.length;
    if (r) r.disabled = !state.redo.length;
  }

  /* 快捷键：N 开关；P/H/E 换笔；⌘Z / ⇧⌘Z；Esc 退出 */
  document.addEventListener("keydown", function (e) {
    var tag = (e.target && e.target.tagName) || "";
    if (/INPUT|TEXTAREA/.test(tag) || (e.target && e.target.isContentEditable)) return;
    var k = e.key.toLowerCase();
    if ((e.metaKey || e.ctrlKey) && k === "z") {
      if (!state.on) return;
      e.preventDefault();
      if (e.shiftKey) redo(); else undo();
      return;
    }
    if (e.metaKey || e.ctrlKey || e.altKey) return;
    if (k === "n") { e.preventDefault(); setOn(!state.on); }
    else if (k === "p" && state.on) setTool("p");
    else if (k === "h" && state.on) setTool("h");
    else if (k === "e" && state.on) setTool("e");
    else if (k === "[" && state.on) { state.scale = Math.max(0.5, +(state.scale - 0.15).toFixed(2)); }
    else if (k === "]" && state.on) { state.scale = Math.min(3, +(state.scale + 0.15).toFixed(2)); }
    else if (k === "escape" && state.on) setOn(false);
  });

  root.addEventListener("resize", function () { if (state.stage) resize(); });
  root.addEventListener("beforeunload", saveNow);

  root.INK = {
    init: function () { buildUI(); openDB(); },
    attach: attach,
    flush: saveNow,
    on: function () { return state.on; },
    setOn: setOn
  };
})(window);
