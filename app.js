/* 学习法远征 · 应用逻辑 */

var App = (function () {
  var S, cur = { view: "map", level: null, idx: 0, score: 0, total: 0, hintUsed: false, predicted: null, stage: null };
  var npcMode = "ask";   // ask = 只追问, review = 批改
  var curCtx = null;     // 当前题目上下文，供学伴批改

  /* ---------- 工具 ---------- */
  function $(id) { return document.getElementById(id); }
  function esc(s) {
    return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  }
  function shuffled(a) {
    var b = a.slice();
    for (var i = b.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var t = b[i]; b[i] = b[j]; b[j] = t;
    }
    return b;
  }
  function ring(pct, color) {
    var r = 18, c = 2 * Math.PI * r;
    var p = Math.max(0, Math.min(100, pct));
    return '<svg class="ring" viewBox="0 0 46 46">' +
      '<circle cx="23" cy="23" r="' + r + '" fill="none" stroke="#3a3168" stroke-width="5"/>' +
      '<circle cx="23" cy="23" r="' + r + '" fill="none" stroke="' + color + '" stroke-width="5" stroke-linecap="round" ' +
      'stroke-dasharray="' + (c * p / 100).toFixed(1) + ' ' + c.toFixed(1) + '" transform="rotate(-90 23 23)"/>' +
      '<text x="23" y="27" text-anchor="middle" font-size="11" fill="#ece9ff">' + p + '</text></svg>';
  }

  /* ---------- 视图切换 ---------- */
  function showView(v) {
    cur.view = v;
    if (v !== "level") { if (typeof TTS !== "undefined") TTS.stop(); hideSelMenu(); }
    ["map", "recall", "wall", "library", "companion", "level"].forEach(function (k) {
      var el = $("view-" + k);
      if (el) el.classList.toggle("hidden", k !== v);
    });
    document.querySelectorAll(".tab").forEach(function (t) {
      t.classList.toggle("active", t.dataset.view === v);
    });
    if (v === "map") renderMap();
    if (v === "recall") { renderRecall(); ensureMathForRecall(); }
    if (v === "wall") renderWall();
    if (v === "library") renderLibrary();
    if (v === "companion") renderCompanion();
    window.scrollTo(0, 0);
  }

  /* ---------- HUD ---------- */
  function renderHud() {
    $("hud-xp").textContent = S.xp;
    $("hud-lv").textContent = Engine.level();
    $("hud-streak").textContent = S.streak;
    $("hud-due").textContent = Engine.dueCards().length;
    $("hud-frag").textContent = S.fragments;
  }

  /* 关卡总页数（精读关 = 该章 step 数；教材关 = 4 页） */
  function levelPages(lv) {
    if (lv.type === "lesson") return 4;
    if (lv.type !== "read") return 0;
    var ch = (DATA.chapters || []).filter(function (x) { return x.id === lv.chapter; })[0];
    if (ch) return (ch.steps || []).length;
    /* 正文还没载入时，用按需加载清单里的步数，地图上的「读到 x/y」照样能显示 */
    var n = String(lv.chapter || "").replace(/^ch/, "");
    return (typeof LZ !== "undefined" && LZ.stepsOf(n)) || 0;
  }

  /* ---------- 地图 ---------- */
  function renderMap() {
    var html = "";
    DATA.regions.forEach(function (rg) {
      var lvs = DATA.levels.filter(function (l) { return l.r === rg.id; });
      html += '<div class="region"><h2>' + rg.name + '</h2><div class="rdesc">' + rg.desc + '</div>' +
        ring(Engine.regionMastery(rg.id), rg.color) +
        '<ul class="lvlist">';
      lvs.forEach(function (lv) {
        var rec = S.levels[lv.id];
        var lock = !Engine.unlocked(lv);
        /* 读到一半的章：在地图上直接标出进度，方便一眼看到哪儿没读完 */
        var pg = "", pages = levelPages(lv);
        if (!lock && !(rec && rec.done) && rec && rec.page > 0 && pages) {
          pg = '<span class="pg" title="接着上次读">读到 ' + (rec.page + 1) + "/" + pages + '</span>';
        }
        html += '<li class="lvitem ' + (lock ? "locked" : "") + " " + (rec && rec.done ? "done" : "") + '" data-lv="' + lv.id + '"' +
          (lock ? ' role="link" aria-disabled="true"' : ' role="button" tabindex="0"') + '>' +
          '<span class="lvname">' + lv.name + '</span>' + pg +
          (rec && rec.best ? '<span class="best">' + rec.best + '%</span>' : "") +
          /* 已通关的行有绿点与分数即可，不再重复一个「已通关」标签 */
          (rec && rec.done ? "" : '<span class="badge">' + (lock ? "未解锁" : "可挑战") + '</span>') + '</li>';
      });
      if (!lvs.length) html += '<li class="lvitem" style="cursor:default"><span class="lvname">闪卡训练区 · 去「今日复习」</span></li>';
      html += '</ul></div>';
    });
    $("map-grid").innerHTML = html;
    layoutMap();
    document.querySelectorAll(".lvitem[data-lv]").forEach(function (li) {
      li.onclick = function () {
        if (li.classList.contains("locked")) { toast("先通关上一关：顺序是设计变量，先编码后提取。"); return; }
        openLevel(li.dataset.lv);
      };
      /* 键盘可达：Tab 能走到每一关，Enter / 空格进入 */
      li.onkeydown = function (e) {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          li.click();
        }
      };
    });
  }

  /* 地图瀑布流：grid-auto-rows 是 8px 的「秒表刻度」，每张卡按实测高度占若干行，
     并显式放进当前最矮的那一列。只算行跨度而不指定列，仍会按行对齐，高矮差一大就留空洞。
     （不换回 CSS columns：WebKit 不会平衡多列。） */
  var MAP_ROW = 8, MAP_GAP = 16;
  function layoutMap() {
    var map = $("map-grid");
    /* 隐藏时（别的视图里 resize）量到的都是 0，直接跳过，回到地图会重新 renderMap */
    if (!map || !map.children.length || map.offsetParent === null) return;
    var cards = [].slice.call(map.children), i;
    /* 先复位成按内容高度，再量；顺序反了会量到被压扁的高度 */
    for (i = 0; i < cards.length; i++) {
      cards[i].style.gridColumn = "";
      cards[i].style.gridRow = "auto";
    }
    map.style.gridAutoRows = "auto";
    var hs = cards.map(function (c) { return c.getBoundingClientRect().height; });
    map.style.gridAutoRows = "";
    var cols = getComputedStyle(map).gridTemplateColumns.split(" ").filter(Boolean).length || 1;
    var rows = [];
    for (i = 0; i < cols; i++) rows.push(0);
    cards.forEach(function (c, k) {
      var span = Math.max(1, Math.ceil((hs[k] + MAP_GAP) / (MAP_ROW + MAP_GAP)));
      var col = 0;
      for (var j = 1; j < cols; j++) if (rows[j] < rows[col]) col = j;
      c.style.gridColumn = String(col + 1);
      c.style.gridRow = (rows[col] + 1) + " / span " + span;
      rows[col] += span;
    });
  }

  /* ---------- 今日复习（SM-2） ---------- */
  var rc = { queue: [], cur: null, shown: false };

  /* 复习页不走关卡的按需加载器，所以进页面时 KaTeX 往往还没取回来，
     卡片里的 $...$ 会当成纯文本吐出来。这里补取一次，回来后原地重画当前卡。 */
  function ensureMathForRecall() {
    if (typeof LZ === "undefined" || LZ.single()) return;
    if (typeof MT === "undefined" || MT.ready) return;
    LZ.ensureMath().then(function () {
      if (cur.view === "recall") paintCard();
    }).catch(function () {});
  }

  function renderRecall() {
    var due = Engine.dueCards();
    var nw = Engine.newCards();
    rc.queue = shuffled(due).concat(shuffled(nw)).slice(0, 30);
    rc.cur = null; rc.shown = false;
    var openN = Engine.openCardCount();
    var un = Engine.unlearnedCount();
    if (!openN) {
      /* 卡面已经把「去读一章」说清楚了，这里再重复一遍只会显得啰嗦 */
      $("queue-info").innerHTML = "出卡范围：0 章 · 0 张（读完一章后自动开始）";
    } else {
      $("queue-info").innerHTML =
        "到期卡 " + due.length + " 张 · 可领新卡 " + nw.length + " 张（每日上限 20）" +
        "　·　出卡范围：读完的 " + Object.keys(Engine.openedChapters()).length + " 章，共 " + openN + " 张" +
        (un ? "，还有 " + un + " 张没学" : "");
    }
    nextCard();
  }
  function nextCard() {
    if (!rc.queue.length) {
      var openN = Engine.openCardCount();
      if (!openN) {
        $("recall-front").innerHTML =
          '<span class="q">还没有可复习的卡</span>队列只从读完的章节里出卡。回地图读完第 1 章，' +
          "它的卡片才会进到这里 —— 先编码，再提取。";
      } else {
        $("recall-front").innerHTML =
          '<span class="q">今日队列清空</span>你已经把该复习的都取出来一遍了。<br>明天再来——间隔的意义就在于此。';
      }
      $("recall-back").classList.add("hidden");
      $("recall-grades").classList.add("hidden");
      $("recall-show").classList.add("hidden");
      $("recall-skip").classList.add("hidden");
      $("recall-meta").textContent = "";
      return;
    }
    rc.cur = rc.queue.shift();
    rc.shown = false;
    paintCard();
  }

  /* 画当前这张卡。抽出来是为了 KaTeX 取回后能原地重绘一次，
     而不必重建队列——否则用户已经答过的那几张会被重新排一遍。 */
  function paintCard() {
    if (!rc.cur) return;
    var st = S.cards[rc.cur.id];
    var learned = Engine.isLearned(rc.cur.id);

    $("recall-front").innerHTML = '<span class="q">' + md(rc.cur.t) + " · " + md(rc.cur.q) + '</span>';
    $("recall-back").innerHTML = '<div class="vivid">' + (rc.cur.vivid ? nl(rc.cur.vivid, true) : md(rc.cur.a)) + "</div>";
    $("recall-back").classList.add("hidden");
    $("recall-grades").classList.add("hidden");
    $("recall-show").classList.remove("hidden");
    $("recall-skip").classList.remove("hidden");

    if (!learned) {
      // 初见面：没学过就不许考，先读一遍完整讲解
      rc.firstLook = true;
      $("recall-back").classList.remove("hidden");
      $("recall-show").textContent = "我读过了，考考我";
      $("recall-meta").innerHTML = '<span class="tag-new">未学 · 初见面</span> 先读完上面的讲解，再进入自测——没编码就提取等于默写没学过的东西。';
      return;
    }

    rc.firstLook = false;
    $("recall-show").textContent = "显示答案";
    var left = st ? st.due - Engine.dayNum() : 0;
    $("recall-meta").innerHTML = (st && st.seen
      ? '<span class="tag-ok">已学</span> 已复习 ' + st.seen + " 次 · 当前间隔 " + st.iv + " 天 · EF " + st.ef.toFixed(2) +
        " · " + (left > 0 ? left + " 天后到期" : (left === 0 ? "今天到期" : "已到期 " + (-left) + " 天"))
      : '<span class="tag-ok">已学</span> 新卡 · 读完教材后首次进入调度');
    /* 重绘时若这张已经翻过面，保持翻开状态 */
    if (rc.shown) {
      $("recall-back").classList.remove("hidden");
      $("recall-grades").classList.remove("hidden");
      $("recall-show").classList.add("hidden");
    }
  }
  function bindRecall() {
    $("recall-show").onclick = function () {
      if (!rc.cur) return;
      if (rc.firstLook) {
        // 读完了 标记已学，重新以自测模式呈现同一张卡
        Engine.markLearned(rc.cur.id);
        S = Engine.state();
        rc.firstLook = false;
        $("recall-back").classList.add("hidden");
        $("recall-show").textContent = "显示答案";
        $("recall-meta").innerHTML = '<span class="tag-ok">已学</span> 现在凭回忆想一想答案，再翻面对照。';
        toast("已标记为学过，这张卡正式进入调度");
        renderHud();
        return;
      }
      rc.shown = true;
      $("recall-back").classList.remove("hidden");
      $("recall-grades").classList.remove("hidden");
      $("recall-show").classList.add("hidden");
    };
    $("recall-skip").onclick = function () { nextCard(); };
    document.querySelectorAll("#recall-grades .g").forEach(function (b) {
      b.onclick = function () {
        if (!rc.cur) return;
        var g = +b.dataset.g;
        var cid = rc.cur.id, cr = rc.cur.r;
        var isNew = !S.cards[cid] || !S.cards[cid].seen;
        var c = Engine.gradeCard(cid, g);
        if (isNew) Engine.markNewTaken();
        var xp = g >= 4 ? 6 : (g === 3 ? 4 : 2);
        Engine.awardXp(xp);
        Engine.logItem({ type: "card", id: cid, grade: g, r: cr });
        renderHud();
        var msg = g >= 3
          ? "已排期：间隔拉长到 " + c.iv + " 天后再来"
          : "答错回炉：连续次数归零，这张卡今天还会再出现";
        nextCard();
        toast(msg);
      };
    });
  }

  /* ---------- 关卡通用 ---------- */
  /* 按需加载：点进来立刻切页，正文/插图/图示在后台取，取完再渲染 */
  var levelToken = 0;

  function openLevel(id) {
    var lv = DATA.levels.filter(function (l) { return l.id === id; })[0];
    if (!lv) return;
    var token = ++levelToken;

    if (typeof LZ === "undefined" || LZ.single()) { enterLevel(lv, token); return; }

    showView("level");
    $("lv-tag").textContent = lv.method;
    $("lv-title").textContent = lv.name;
    $("lv-brief").textContent = "";
    $("lv-method").textContent = "共 " + lv.n + " 题 · 通关线 80%";
    $("lv-feedback").classList.add("hidden");
    $("lv-actions").innerHTML = "";
    var chap = lv.chapter ? String(lv.chapter).replace(/^ch/, "") : null;
    $("lv-stage").innerHTML =
      '<div class="lv-loading"><div class="lv-loading-t">正在载入' +
      (chap ? "第 " + chap + " 章" : "本关") + '…</div>' +
      '<div class="lv-loading-s">正文、原书插图与交互图按需取用，首次会下载本章内容，之后走浏览器缓存。</div></div>';
    progressReset();

    LZ.ensureLevel(lv).then(function () {
      if (token !== levelToken) return;      /* 期间用户已经返回或换了一关 */
      var late = !(window.MT && window.MT.ready);   /* 打开时 KaTeX 还没到 */
      enterLevel(lv, token);
      /* KaTeX 晚到时把当前这页重排一遍：只重排精读/教材这两类，
         答题关重排会把已经填的答案冲掉。 */
      if (late) LZ.ensureMath().then(function () {
        if (token !== levelToken) return;
        if (cur.stage && (cur.stage.kind === "read" || cur.stage.kind === "lesson")) renderStage();
      }).catch(function () { });
    }).catch(function (e) {
      if (token !== levelToken) return;
      $("lv-stage").innerHTML =
        '<div class="lv-loading bad"><div class="lv-loading-t">这一关没载入成功</div>' +
        '<div class="lv-loading-s">' + esc(String((e && e.message) || e)) + '</div>' +
        '<div class="row-btns"><button class="btn primary" id="lv-retry">重试</button></div></div>';
      var rb = $("lv-retry");
      if (rb) rb.onclick = function () { openLevel(id); };
    });
  }

  /* 超宽公式：整行放不下时只能横向滚动，读的时候像被切断。
     这里按实际宽度把字号收一收（最多收到 0.72），让它整行落地。
     缩得再小也没用的情况（极少）就留着滚动，总比截断强。 */
  function fitWideMath(root) {
    if (!root) return;
    var list = root.querySelectorAll(".mblk.mb-disp, .math-line");
    [].forEach.call(list, function (el) {
      el.style.fontSize = "";
      if (!el.clientWidth) return;
      var base = parseFloat(getComputedStyle(el).fontSize) || 16;
      var floor = base * 0.62;              /* 再小就没法读了，剩下的留给横向滚动 */
      for (var pass = 0; pass < 3; pass++) {
        if (el.scrollWidth <= el.clientWidth + 2) break;
        var cur = parseFloat(getComputedStyle(el).fontSize) || base;
        var want = Math.max(floor, cur * (el.clientWidth - 2) / el.scrollWidth);
        if (want >= cur - 0.05) break;      /* 已经到下限，别再来一轮 */
        el.style.fontSize = want.toFixed(2) + "px";
      }
    });
  }

  function progressReset() {
    var bar = $("lv-progress");
    if (bar) bar.style.width = "0%";
  }

  function enterLevel(lv, token) {
    /* 每次进关都重算「本章首次出现」，否则回头重读时点线全没了 */
    if (typeof EMPH !== "undefined") EMPH.reset(String(lv.chapter || "").replace(/^ch/, ""));
    cur.level = lv; cur.idx = 0; cur.score = 0; cur.hintUsed = false; cur.predicted = null; cur.noScore = false;
    cur.total = lv.n;
    cur.pageTotal = null;
    cur.resumed = 0;
    cur.stage = buildStage(lv);
    // 精读关与教材关按“页”推进：进度条走页数，得分仍按检查题数算（lv.n）
    if (cur.stage.kind === "lesson" || cur.stage.kind === "read") {
      cur.pageTotal = cur.stage.items.length || 1;
      /* 续读：直接回到上次读到的那一页。
         已通关的关从头开始（要把检查题重新走一遍，不是复习阅读）。 */
      var rec = S.levels[lv.id];
      var saved = (rec && rec.done) ? 0 : Engine.getPage(lv.id);
      saved = Math.max(0, Math.min(saved, Math.max(0, cur.stage.items.length - 1)));
      if (saved > 0) { cur.idx = saved; cur.resumed = saved; }
    }
    showView("level");
    $("lv-tag").textContent = lv.method;
    $("lv-title").textContent = lv.name;
    $("lv-brief").innerHTML = md(lv.brief);
    /* 上方已经有「方法」标签，这里只补量级信息，不重复同一句话 */
    $("lv-method").innerHTML = "共 " + lv.n + " 题 · 通关线 80%";
    renderStage();
  }

  function buildStage(lv) {
    if (lv.type === "lesson") {
      var ls = (DATA.lessons || []).filter(function (x) { return x.id === lv.lesson; })[0];
      if (!ls) return { kind: "encode", items: [] };
      return { kind: "lesson", lesson: ls, items: ["hook", "body", "number", "check"] };
    }
    if (lv.type === "encode") return { kind: "encode", items: shuffled(DATA.encoding).slice(0, lv.n) };
    if (lv.type === "read") {
      var ch = (DATA.chapters || []).filter(function (x) { return x.id === lv.chapter; })[0];
      if (!ch) return { kind: "read", chapter: { steps: [] }, items: [] };
      return { kind: "read", chapter: ch, items: ch.steps.slice() };
    }
    if (lv.type === "cards") {
      var pool = DATA.cards.filter(function (c) { return c.r === lv.r; });
      var taught = pool.filter(function (c) {
        return Engine.isLearned(c.id) && (!S.cards[c.id] || !S.cards[c.id].seen);
      });
      var taughtAny = pool.filter(function (c) { return Engine.isLearned(c.id); });
      var rest = pool.filter(function (c) { return !Engine.isLearned(c.id); });
      // 优先：已学过且还没进过调度的卡；不够则用已学过的卡；仍不够才补未学的（会走初见面）
      var items = taught.concat(taughtAny).slice(0, lv.n);
      if (items.length < lv.n) items = items.concat(shuffled(rest)).slice(0, lv.n);
      return { kind: "cards", items: items };
    }
    if (lv.type === "recall") {
      var rs = shuffled(DATA.recall).slice(0, lv.n);
      return { kind: "recall", items: rs };
    }
    if (lv.type === "feynman") return { kind: "feynman", items: shuffled(DATA.feynman).slice(0, lv.n) };
    if (lv.type === "boss") return { kind: "boss", items: shuffled(DATA.discriminate).slice(0, lv.n) };
    if (lv.type === "mistake") return { kind: "mistake", items: shuffled(DATA.mistake).slice(0, lv.n) };
    if (lv.type === "create") return { kind: "create", items: [DATA.bloomTask] };
    return { kind: "encode", items: [] };
  }

  function progress() {
    var denom = cur.pageTotal || cur.total;
    var p = 0;
    /* 按页推进的关（精读/教材）：人在第 k 页，进度就该到 k/n，而不是 (k-1)/n */
    if (cur.pageTotal) p = (Math.min(cur.idx + 1, denom) / denom) * 100;
    else if (denom) p = (cur.idx / denom) * 100;
    $("lv-progress").style.width = p + "%";
    paintScrub();
  }

  /* ---------- 翻页：往回也要有个按钮 ----------
     精读与教材都是按页推进的，退回上一页不该只能「返回地图」。
     goPage 是唯一入口：上一页按钮、滑轨点击、键盘都走它。 */
  function goPage(i) {
    var n = (cur.stage && cur.stage.items) ? cur.stage.items.length : 0;
    if (!n) return;
    i = Math.max(0, Math.min(n - 1, i));
    if (i === cur.idx) return;
    cur.idx = i;
    renderStage();
  }
  function prevBtn(id) {
    if (cur.idx <= 0) return "";
    return '<button class="btn ghost" id="' + (id || "rd-prev") + '">← 上一页</button>';
  }
  function bindPrev(id) {
    var b = $(id || "rd-prev");
    if (b) b.onclick = function () { goPage(cur.idx - 1); };
  }

  /* 页面标签：滑轨提示与刻度都靠它。小节名去掉「（续）」，同一节的后续页不重复标。 */
  var PAGE_T = { q: "出门检查", fig: "一图流", recap: "本节小结", link: "与前后章的接口",
                 core: "本章核心", sec: "本节", def: "术语", eg: "具体例子", ana: "打个比方",
                 derive: "推导", mis: "常见误区", hook: "钩子", body: "讲解", number: "一图流", check: "出门检查" };
  function pageLabel(it) {
    if (it === null || it === undefined) return "";
    if (typeof it === "string") return PAGE_T[it] || "";
    if (it.h) return String(it.h).replace(/（续）$/, "");
    return PAGE_T[it.t] || "";
  }
  function isSectionStart(it) {
    var lab = pageLabel(it);
    if (!lab) return false;
    if (/^\d/.test(lab)) return true;                     /* 5.1 / 5.2 / 5.3 … */
    return lab === "本章核心" || lab === "本节小结" || lab === "与前后章的接口";
  }
  function scrubItems() {
    if (!cur.stage) return null;
    if (cur.stage.kind !== "read" && cur.stage.kind !== "lesson") return null;
    return (cur.stage.items && cur.stage.items.length) ? cur.stage.items : null;
  }

  /* 刻度与无障碍状态：每次翻页由 progress() 调一次 */
  function paintScrub() {
    var sc = $("rd-scrub"), ticks = $("rd-ticks"), items = scrubItems();
    if (!sc) return;
    var n = items ? items.length : 0;
    sc.classList.toggle("static", !n);
    if (n) {
      sc.setAttribute("aria-valuemax", n);
      sc.setAttribute("aria-valuenow", cur.idx + 1);
      var lab = pageLabel(items[cur.idx]);
      sc.setAttribute("aria-valuetext", "第 " + (cur.idx + 1) + " 页，共 " + n + " 页" + (lab ? "：" + lab : ""));
    } else {
      sc.setAttribute("aria-valuenow", 1);
      sc.setAttribute("aria-valuetext", "");
    }
    if (ticks) {
      var html = "";
      /* 只在「小节起点」打刻度：「5.3 多值性…（续）」这类同节后续页不重复标，
         否则 49 页会插出十几根线，轨道变成刻度尺。 */
      for (var i = 1; i < n; i++) {
        if (isSectionStart(items[i]) && pageLabel(items[i]) !== pageLabel(items[i - 1])) {
          html += '<i class="rd-tick" style="left:' + (i / n * 100).toFixed(3) + '%"></i>';
        }
      }
      if (ticks.innerHTML !== html) ticks.innerHTML = html;
    }
  }

  /* 滑轨交互：悬停出提示、点击跳页、方向键翻页 */
  function initScrub() {
    var sc = $("rd-scrub"), tip = $("rd-tip"), seg = $("rd-seg"), cu = $("rd-cursor");
    if (!sc) return;
    function pageAt(clientX) {
      var items = scrubItems();
      if (!items) return -1;
      var r = sc.getBoundingClientRect();
      var t = (clientX - r.left) / Math.max(1, r.width);
      return Math.max(0, Math.min(items.length - 1, Math.floor(t * items.length)));
    }
    function show(clientX) {
      var items = scrubItems();
      if (!items) return;
      var i = pageAt(clientX), r = sc.getBoundingClientRect();
      var x = Math.max(0, Math.min(r.width, clientX - r.left));
      var lab = pageLabel(items[i]);
      tip.innerHTML = "<b>" + (i + 1) + " / " + items.length + "</b>" +
        (lab ? "<span>" + esc(lab) + "</span>" : "") +
        (i === cur.idx ? "<i>当前</i>" : "");
      /* 贴边时把提示框推回容器内，别溢出阅读列 */
      var half = tip.offsetWidth / 2;
      tip.style.left = Math.max(half + 2, Math.min(r.width - half - 2, x)) + "px";
      tip.classList.add("on");
      /* 预览块只做「游标光点」，不做「这一页的整段」：
         4 页的教材关一页就是 25%，整段高亮会变成第二根进度条。 */
      var bw = Math.min(100 / items.length, 9);
      seg.style.width = bw + "%";
      seg.style.left = Math.max(0, Math.min(100 - bw, (i + 0.5) * 100 / items.length - bw / 2)) + "%";
      seg.classList.add("on");
      cu.style.left = x + "px";
      cu.classList.add("on");
    }
    function hide() {
      tip.classList.remove("on");
      seg.classList.remove("on");
      cu.classList.remove("on");
    }
    sc.addEventListener("pointermove", function (e) { show(e.clientX); });
    sc.addEventListener("pointerleave", hide);
    sc.addEventListener("click", function (e) {
      if (!scrubItems()) return;
      var i = pageAt(e.clientX);
      if (i >= 0 && i !== cur.idx) { hide(); goPage(i); toast("到第 " + (i + 1) + " 页"); }
    });
    sc.addEventListener("keydown", function (e) {
      var items = scrubItems();
      if (!items) return;
      var k = e.key;
      if (k === "ArrowRight" || k === "ArrowDown") { e.preventDefault(); goPage(cur.idx + 1); }
      else if (k === "ArrowLeft" || k === "ArrowUp") { e.preventDefault(); goPage(cur.idx - 1); }
      else if (k === "Home") { e.preventDefault(); goPage(0); }
      else if (k === "End") { e.preventDefault(); goPage(items.length - 1); }
    });
  }

  function renderStage() {
    progress();
    var stg = cur.stage, act = $("lv-actions"), fb = $("lv-feedback");
    if (typeof TTS !== "undefined") TTS.stop();   /* 翻页即停，避免读串页 */
    hideSelMenu();
    fb.classList.add("hidden");
    act.innerHTML = "";
    if (cur.idx >= stg.items.length) { finishLevel(); return; }
    /* 逐页记忆：翻到哪一页就存哪一页，中途退出/关掉浏览器都从这页续读 */
    if (stg.kind === "read" || stg.kind === "lesson") Engine.setPage(cur.level.id, cur.idx);
    var it = stg.items[cur.idx];
    curCtx = it;
    if (stg.kind === "lesson") renderLesson(stg, it, act);
    else if (stg.kind === "read") renderRead(stg, it, act);
    else if (stg.kind === "encode") renderEncode(it, act);
    else if (stg.kind === "cards") renderLevelCard(it, act);
    else if (stg.kind === "recall") renderRecallQ(it, act);
    else if (stg.kind === "feynman") renderFeynman(it, act);
    else if (stg.kind === "boss") renderBoss(it, act);
    else if (stg.kind === "mistake") renderMistake(it, act);
    else if (stg.kind === "create") renderCreate(it, act);
    fitWideMath($("lv-stage"));
    npcContextBanner();
  }

  function confRow(cb) {
    var h = '<div class="conf-row"><span style="color:var(--dim);font-size:13px">先预测把握度：</span>';
    for (var i = 1; i <= 5; i++) h += '<button class="conf" data-p="' + i + '">' + i + "</button>";
    h += "</div>";
    setTimeout(function () {
      document.querySelectorAll(".conf").forEach(function (b) {
        b.onclick = function () {
          cur.predicted = +b.dataset.p;
          document.querySelectorAll(".conf").forEach(function (x) { x.classList.remove("sel"); });
          b.classList.add("sel");
          cb && cb();
        };
      });
    }, 0);
    return h;
  }

  function needPredict() {
    if (cur.predicted === null) { toast("先选把握度——元认知校准是这一关的一部分"); return true; }
    return false;
  }

  /* ---- 教材关：先读懂，再谈练 ---- */
  function nl(t, compact) { return (typeof MT !== "undefined") ? MT.lines(t, compact ? { compact: 1 } : null) : esc(t).replace(/\n/g, "<br>"); }
  function renderLesson(stg, step, act) {
    var ls = stg.lesson;
    var head = '<div class="lesson-step">教材 ' + (cur.idx + 1) + " / 4</div>";
    var body = "", btn = "";
    if (step === "hook") {
      body = "<h2>" + esc(ls.title) + "</h2>" +
        '<div class="material hook">' + md(ls.hook) + "</div>" +
        '<div class="essence">一句话本质：' + md(ls.essence) + "</div>";
      btn = '<button class="btn primary" id="ls-next">继续 →</button>';
    } else if (step === "body") {
      body = '<div class="blk"><div class="blk-t">生活类比</div>' + md(ls.analogy) + "</div>" +
        '<div class="blk"><div class="blk-t">具体例子</div>' + md(ls.example) + "</div>" +
        '<div class="blk"><div class="blk-t">常见误解</div>' + md(ls.counter) + "</div>";
      btn = '<button class="btn primary" id="ls-next">继续 →</button>';
    } else if (step === "number") {
      var regId = "f-reg-" + (cur.level && cur.level.r ? cur.level.r : "");
      var hasReg = typeof VZ !== "undefined" && VZ.has(regId);
      body = '<div class="blk"><div class="blk-t">一图流</div>' +
        (hasReg ? '<div class="figbox" id="ls-fig"></div>'
                : '<pre class="viz">' + esc(ls.visual) + "</pre>") + "</div>" +
        '<div class="blk"><div class="blk-t">关键数字</div>' + md(ls.number) + "</div>";
      btn = '<button class="btn primary" id="ls-next">做个小检查 →</button>';
    } else {
      body = '<div class="blk"><div class="blk-t">出门检查</div>' + md(ls.check.q) + "</div>" +
        '<div class="opts" id="opts"></div>';
      btn = "";
    }
    $("lv-stage").innerHTML = head + body;
    act.innerHTML = prevBtn("ls-prev") + btn;
    bindPrev("ls-prev");
    if (step === "number" && typeof VZ !== "undefined" && VZ.has(regId)) VZ.fig(regId, $("ls-fig"));
    if (step !== "check") {
      $("ls-next").onclick = function () { cur.idx++; renderStage(); };
    } else {
      var box = $("opts");
      ls.check.opts.forEach(function (o, i) {
        var b = document.createElement("button");
        b.className = "opt"; b.innerHTML = mdc(o);
        b.onclick = function () {
          var ok = i === ls.check.right;
          box.querySelectorAll(".opt").forEach(function (x, j) {
            if (j === ls.check.right) x.classList.add("right");
            else if (j === i) x.classList.add("wrong");
          });
          if (ok) cur.score++;
          Engine.awardXp(ok ? 6 : 2);
          Engine.logItem({ type: "lesson", id: ls.id, correct: ok });
          showFb(ok, (ok ? "读通了。" : "再想一下。") + mdc(ls.check.why));
          act.innerHTML = (ok ? "" : '<button class="btn" id="ls-reread">回去重看一遍</button>') +
            '<button class="btn primary" data-next="1">' + (ok ? "完成，解锁训练关" : "继续") + "</button>";
          var rb = $("ls-reread");
          if (rb) rb.onclick = function () {
            cur.idx = 0; cur.score = Math.max(0, cur.score - 1); renderStage();
          };
          bindNext(act);
          renderHud();
        };
        box.appendChild(b);
      });
    }
  }

  /* ---- 精读关：逐节讲授，读完才考 ---- */
  /* 学伴对话：保留换行 + 渲染模型返回的 $公式$ */
  function chatMD(s) {
    if (typeof MT !== "undefined" && MT.chat) return MT.chat(String(s));
    return esc(String(s)).replace(/\n/g, "<br>");
  }
  /* 文本渲染：公式走 MT（KaTeX）；MT 不可用时退回纯转义 */
  function md(s) {
    if (typeof MT !== "undefined") return MT.md(String(s));
    return esc(String(s))
      .replace(/\*\*([^*]+)\*\*/g, "<b>$1</b>")
      .replace(/`([^`]+)`/g, "<code>$1</code>");
  }
  /* 选项、判语这类窄容器：长公式不拆行，免得把一句话劈开 */
  function mdc(s) {
    if (typeof MT !== "undefined") return MT.md(String(s), { compact: 1 });
    return md(s);
  }
  function rdParas(t) {
    return String(t).split("\n").filter(function (s) { return s.trim(); })
      .map(function (s) {
        /* ASCII 示意图：原样保留，保住对齐 */
        if (typeof MT !== "undefined" && MT.isArtLine(s))
          return '<div class="rd-p viz-line">' + esc(s) + "</div>";
        /* 整行就是一个公式：排成块级，居中、可横向滚动 */
        if (typeof MT !== "undefined" && MT.isBlockMath(s))
          return '<div class="math-line">' + md(s) + "</div>";
        return '<p class="rd-p">' + md(s) + "</p>";
      }).join("");
  }
  /* 卡点拆解：notes=[{q,a}]；无 notes 时兼容旧的整段 plain 字段 */
  function notesHtml(it) {
    if (it.notes && it.notes.length) {
      return '<div class="blk notesblk" id="notesblk"><div class="blk-t">卡点拆解</div>' +
        it.notes.map(function (n) {
          return '<div class="note"><div class="note-q">' + md(n.q) + "</div>" +
            '<div class="note-a">' + md(n.a) + "</div></div>";
        }).join("") + "</div>";
    }
    if (it.plain && String(it.plain).trim()) {
      return '<div class="blk plainblk"><div class="blk-t">人话</div>' + rdParas(it.plain) + "</div>";
    }
    return "";
  }
  function stars(n) {    n = Math.max(1, Math.min(5, n || 1));
    return "★★★★★".slice(0, n) + "☆☆☆☆☆".slice(0, 5 - n);
  }
  var BLK_META = {
    core:   { cls: "hook",  icon: "" },
    sec:    { cls: "",      icon: "" },
    def:    { cls: "def",   icon: "" },
    ana:    { cls: "ana",   icon: "" },
    eg:     { cls: "eg",    icon: "" },
    derive: { cls: "der",   icon: "" },
    fig:    { cls: "",      icon: "" },
    mis:    { cls: "warn",  icon: "" },
    recap:  { cls: "recap", icon: "" },
    link:   { cls: "",      icon: "" }
  };
  /* 恢复提示条上的「从头开始」 */
  function bindRestart() {
    var rb = $("rd-restart");
    if (!rb) return;
    rb.onclick = function () {
      cur.idx = 0; cur.resumed = -1;
      Engine.setPage(cur.level.id, 0);
      renderStage();
    };
  }

  /* ---- 朗读工具条（引擎见 tts.js：浏览器语音 / tts-proxy.py 神经语音） ---- */
  function ttsBarHtml(it) {
    var second = "";
    if (it.t === "pair") {
      if (it.notes && it.notes.length) second = '<button class="btn small" id="tts-notes" aria-label="朗读卡点拆解">卡点</button>';
      else if (it.plain) second = '<button class="btn small" id="tts-plain" aria-label="朗读人话版讲解">人话</button>';
    }
    var reads = it.t === "pair"
      ? '<button class="btn small" id="tts-orig" aria-label="朗读原文译文">原文</button>' + second
      : '<button class="btn small" id="tts-page">本页</button>';
    return '<div class="ttsbar" id="ttsbar">' +
      '<span class="tts-l">朗读</span>' + reads +
      '<button class="btn small ghost" id="tts-stop" title="停止朗读" aria-label="停止朗读">停止</button>' +
      '<select id="tts-rate" class="tts-rate" title="朗读语速">' +
        '<option value="0.8">0.8×</option><option value="1">1×</option>' +
        '<option value="1.25">1.25×</option><option value="1.5">1.5×</option>' +
        '<option value="2">2×</option></select>' +
      '<button class="btn small ghost" id="tts-cfg-btn" title="语音设置：引擎、音色、音调" aria-label="语音设置">设置</button>' +
      '<span class="tts-note" id="tts-note"></span></div>' +
      '<div class="ttscfg" id="tts-cfg" style="display:none"></div>';
  }
  function ttsNote(s) { var n = $("tts-note"); if (n) n.textContent = s; }
  /* 朗读文本：跳过 KaTeX 公式与行内代码（读出来只会是一串符号） */
  function speechText(el) {
    var c = el.cloneNode(true);
    c.querySelectorAll(".katex, code").forEach(function (x) { x.remove(); });
    return c.textContent;
  }
  function bindTts(it) {
    var bar = $("ttsbar");
    if (!bar || typeof TTS === "undefined") return;
    TTS.onFail = function (msg) { toast(msg); };   /* 代理不可达时立刻提示 */
    var cfgEl = $("tts-cfg");
    var rateSel = $("tts-rate");
    if (!TTS.ok()) { ttsNote("浏览器不支持合成，可在「设置」里切到代理引擎"); }
    rateSel.value = String(TTS.getCfg().rate);
    rateSel.onchange = function () {
      TTS.setCfg({ rate: parseFloat(rateSel.value) });
      if (TTS.speaking()) toast("语速已存，翻页或重按朗读后生效");
    };
    $("tts-stop").onclick = function () { TTS.stop(); ttsNote(""); };
    /* 语音设置面板 */
    $("tts-cfg-btn").onclick = function () {
      if (cfgEl.style.display === "none") renderTtsCfg(cfgEl);
      else cfgEl.style.display = "none";
    };
    /* 收集一个区块里的文字段落（跳过 ASCII 示意图与公式） */
    function coll(rootSel) {
      var root = $("lv-stage").querySelector(rootSel);
      if (!root) return [];
      return [].slice.call(root.querySelectorAll(".rd-p"))
        .filter(function (e) { return !e.classList.contains("viz-line"); })
        .map(function (e) { return { el: e, text: speechText(e) }; })
        .filter(function (x) { return x.text.trim(); });
    }
    function play(items, tag) {
      TTS.speak(items, function (u, done, total) {
        ttsNote(u ? tag + " " + done + " / " + total : "");
      });
    }
    /* 卡点拆解：每条读「难点引用 + 解释」 */
    function collNotes() {
      var box = $("notesblk");
      if (!box) return [];
      return [].slice.call(box.querySelectorAll(".note")).map(function (el) {
        var q = el.querySelector(".note-q"), a = el.querySelector(".note-a");
        return { el: el, text: (q ? q.textContent : "") + "。" + (a ? a.textContent : "") };
      }).filter(function (x) { return x.text.trim(); });
    }
    if (it.t === "pair") {
      $("tts-orig").onclick = function () { play(coll(".origblk"), "原文"); };
      var nb = $("tts-notes");
      if (nb) nb.onclick = function () { play(collNotes(), "卡点"); };
      var pb = $("tts-plain");
      if (pb) pb.onclick = function () { play(coll(".plainblk"), "人话"); };
    } else if (it.text) {
      $("tts-page").onclick = function () { play(coll(".blk"), "本页"); };
    }
  }
  /* ---- 语音设置面板 ---- */
  function renderTtsCfg(box) {
    var c = TTS.getCfg();
    box.innerHTML =
      '<div class="ttscfg-t">语音设置</div>' +
      '<label>引擎 <select id="tts-engine">' +
        '<option value="auto"' + (c.engine === "auto" ? " selected" : "") + '>自动（推荐 · 有神经语音就用）</option>' +
        '<option value="proxy"' + (c.engine === "proxy" ? " selected" : "") + '>神经语音 · 微软晓晓（音质最好）</option>' +
        '<option value="online"' + (c.engine === "online" ? " selected" : "") + '>在线语音 · 备选（音质一般）</option>' +
        '<option value="browser"' + (c.engine === "browser" ? " selected" : "") + '>系统语音（完全离线）</option>' +
      '</select></label>' +
      '<div id="tts-voice-row"><label>音色 <select id="tts-voice"></select></label></div>' +
      '<label id="tts-pitch-row">音调 <input type="range" id="tts-pitch" min="0.8" max="1.4" step="0.05" value="' + c.pitch + '">' +
        '<span id="tts-pitch-v">' + c.pitch.toFixed(2) + "</span></label>" +
      '<div class="ttscfg-tip" id="tts-proxy-tip"></div>' +
      '<div class="ttscfg-tip" id="tts-engine-tip"></div>';
    box.style.display = "block";
    var engSel = box.querySelector("#tts-engine");
    var voiceSel = box.querySelector("#tts-voice");
    var tip = box.querySelector("#tts-proxy-tip");
    var etip = box.querySelector("#tts-engine-tip");
    var pitchRow = box.querySelector("#tts-pitch-row");

    function oneVoice(label) {
      var o = document.createElement("option");
      o.value = ""; o.textContent = label;
      voiceSel.appendChild(o);
    }
    function fillVoices(engine) {
      voiceSel.innerHTML = "";
      tip.innerHTML = "";
      etip.innerHTML = "";
      pitchRow.style.display = "";
      if (engine === "auto" || engine === "online") {
        oneVoice(engine === "auto" ? "自动选择" : "在线语音 · 女声");
        pitchRow.style.display = "none";
        etip.textContent = engine === "auto"
          ? "有神经语音就用晓晓，没有才退到在线语音或系统语音，不用你操心。"
          : "备选方案：页面直连在线合成语音，零安装，但音质一般且需要联网。";
        if (engine === "auto") {
          TTS.listProxyVoices(function (ok) {
            tip.textContent = ok ? "检测到晓晓神经语音，正在使用" : "本地神经语音服务没在跑，当前用在线语音顶上";
            tip.className = "ttscfg-tip" + (ok ? " ok" : "");
          });
        }
      } else if (engine === "browser") {
        etip.textContent = synthHint();
        TTS.listBrowserVoices().forEach(function (v) {
          var o = document.createElement("option");
          o.value = v.id; o.textContent = v.label;
          if (v.id === c.voice) o.selected = true;
          voiceSel.appendChild(o);
        });
      } else {
        pitchRow.style.display = "";
        tip.textContent = "正在连接代理…";
        TTS.listProxyVoices(function (ok, data) {
          if (!ok) {
            tip.innerHTML = "";
            tip.append("本地神经语音服务没在运行。双击项目里的「朗读服务.command」装一次，之后开机自动在、不用再管。");
            var rb = document.createElement("button");
            rb.className = "btn small ghost"; rb.textContent = "重试";
            rb.style.marginTop = "6px";
            rb.onclick = function () { fillVoices("proxy"); };
            tip.appendChild(rb);
            return;
          }
          tip.textContent = "代理已连接";
          data.forEach(function (v) {
            var o = document.createElement("option");
            o.value = v.id; o.textContent = v.label;
            if (v.id === c.pvoice) o.selected = true;
            voiceSel.appendChild(o);
          });
        });
      }
    }
    function synthHint() {
      var vs = TTS.listBrowserVoices();
      var hasEnh = vs.some(function (v) { return /增强/.test(v.label); });
      return hasEnh ? "使用系统语音，完全离线。" :
        "系统只有紧凑版语音，音质一般。可在「系统设置 辅助功能 朗读内容 系统声音 管理声音」下载中文增强语音。";
    }
    fillVoices(c.engine);
    engSel.onchange = function () {
      TTS.setCfg({ engine: engSel.value });
      c = TTS.getCfg();
      fillVoices(engSel.value);
    };
    voiceSel.onchange = function () {
      if (engSel.value === "proxy") TTS.setCfg({ pvoice: voiceSel.value });
      else if (voiceSel.value) TTS.setCfg({ voice: voiceSel.value });
      if (voiceSel.value) toast("音色已存，重按朗读后生效");
    };
    var pitch = box.querySelector("#tts-pitch");
    pitch.oninput = function () {
      box.querySelector("#tts-pitch-v").textContent = (+pitch.value).toFixed(2);
    };
    pitch.onchange = function () { TTS.setCfg({ pitch: parseFloat(pitch.value) }); };
  }
  function renderRead(stg, it, act) {
    var ch = stg.chapter;
    var first = stg.items.indexOf(it) === 0;
    var figId = (it && it.fig) || ("f-ch" + String(ch.n).padStart(2, "0"));
    var hasFig = typeof VZ !== "undefined" && VZ.has(figId);
    var head = '<div class="lesson-step">第 ' + ch.n + " 章 · 讲授 " + (cur.idx + 1) + " / " + stg.items.length + "</div>";
    if (cur.resumed > 0 && cur.idx === cur.resumed) {
      head += '<div class="resumebar"><b>接着上次往下读</b>：已跳回第 ' + (cur.idx + 1) + " / " + stg.items.length +
        ' 页，阅读进度自动保存，随时退回地图都行' +
        '<button class="btn small ghost" id="rd-restart">从头开始</button></div>';
    }
    if (first) {
      head += "<h2>第 " + ch.n + " 章 · " + esc(ch.title) + "</h2>";
      if (ch.aim) head += '<div class="material hook">' + md(ch.aim) + "</div>";
      head += '<div class="chmeta">'
        + '<span class="pill">难度 ' + stars(ch.diff) + "</span>"
        + (ch.en ? '<span class="pill">' + esc(ch.en) + "</span>" : "")
        + (ch.teaches ? '<span class="pill">关联闪卡 ' + ch.teaches.length + " 张</span>" : "")
        + "</div>";
      if (ch.need) head += '<div class="needbox"><b>前置</b>：' + md(ch.need) + "</div>";
      head += '<div class="emph-legend">' +
        '<span><em class="term first">术语</em>本章概念，首次出现带点线</span>' +
        '<span><em class="key">重点</em>定义、结论与卡点</span>' +
        '<span><em class="turn">然而</em>转折处，作者在纠偏</span></div>';
      if (ch.aims && ch.aims.length) {
        head += '<div class="goalbox"><div class="goal-t">学完这一章，你能</div><ul>'
          + ch.aims.map(function (a) { return "<li>" + md(a) + "</li>"; }).join("") + "</ul></div>";
      }
    }
    var body = "", btn = prevBtn("rd-prev") + '<button class="btn primary" id="rd-next">继续 →</button>';
    if (it.t === "q") {
      body = '<div class="blk"><div class="blk-t">出门检查</div>' + md(it.q) + "</div>" +
        '<div class="opts" id="opts"></div>';
      /* 检查页也留一个回看上一页的入口——答不上来时最需要翻回去 */
      btn = prevBtn("rd-prev");
    } else if (it.t === "fig") {
      body = '<div class="blk"><div class="blk-t">' + esc(it.h) + "</div>" +
        (hasFig ? '<div class="figbox" id="rd-fig"></div>'
                : '<pre class="viz">' + esc(it.text) + "</pre>") + "</div>";
    } else if (it.t === "pair") {
      /* 原文（忠实中译，已润色）+ 卡点拆解（只讲难处，无难点则不出块） */
      /* 小节标签：原文卡默认不显示 it.h，读者容易丢掉「这一页在讲哪一节」 */
      body = (it.h ? '<div class="rd-kicker">' + esc(it.h) + "</div>" : "") +
        '<div class="origblk"><div class="orig-t">原文</div>' + rdParas(it.orig) + "</div>" +
        /* 可交互图紧跟原文：正文刚提到「图 5.9 展示了…」就能动手。
           排在卡点拆解与原书插图之后的话，首屏根本看不到（实测 1585px 处）。 */
        (it.fig ? '<div class="figbox fig-inline" id="rd-fig-inline"></div>' : "") +
        notesHtml(it);
      /* 原书插图 */
      var _bf = (typeof DATA !== "undefined" && DATA.bookFigs) || {};
      var _bc = (typeof DATA !== "undefined" && DATA.bookFigCaps) || {};
      (it.imgs || []).forEach(function (num) {
        var f = _bf[num];
        if (!f) return;
        /* 有中文图注就用中文（公式走 KaTeX），没有就退回英文原文 */
        var zh = _bc[num] || "";
        var cap = zh ? md(zh) : esc(f.cap);
        var label = zh ? "图 " + num : "原书图 " + num;
        body += '<figure class="bookfig"><img src="' + f.src + '" alt="' + (zh ? esc(zh) : "原书图 " + num) + '">' +
          '<figcaption><b>' + label + "</b> · " + cap + "</figcaption></figure>";
      });
    } else {
      var m = BLK_META[it.t] || { cls: "", icon: "" };
      body = '<div class="blk' + (m.cls ? " " + m.cls : "") + '">' +
        '<div class="blk-t">' + (m.icon ? m.icon + " " : "") + esc(it.h) + "</div>" +
        rdParas(it.text) + "</div>";
      if (it.t === "link") btn = prevBtn("rd-prev") + '<button class="btn primary" id="rd-next">做本章检查 →</button>';
      /* 挂载式小图：讲解步骤正文下方直接嵌一张交互图 */
      if (it.fig) body += '<div class="figbox fig-inline" id="rd-fig-inline"></div>';
    }
    var stageHtml = head + body;
    if ((it.t === "pair" || it.text) && it.t !== "q" && it.t !== "fig") stageHtml += ttsBarHtml(it);
    $("lv-stage").innerHTML = stageHtml;
    /* 两层强调：术语（「…」）与卡点句（下方拆解引用的那句） */
    if (typeof EMPH !== "undefined") EMPH.apply($("lv-stage"), ch.n, it.notes || []);
    act.innerHTML = btn;
    bindRestart();
    bindTts(it);
    bindPrev("rd-prev");
    if (it.t === "fig" && hasFig) VZ.fig(figId, $("rd-fig"));
    else if (it.fig) {
      var fbox = $("rd-fig-inline");
      if (typeof VZ !== "undefined" && VZ.has(it.fig)) VZ.fig(it.fig, fbox);
      else if (fbox) fbox.innerHTML = '<div class="viz-missing">这张交互图没载入（多半是浏览器缓存了旧脚本）——刷新一下就好。</div>';
    }
    if (it.t !== "q") {
      $("rd-next").onclick = function () { cur.idx++; renderStage(); };
      return;
    }
    var box = $("opts");
    it.opts.forEach(function (o, i) {
      var b = document.createElement("button");
      b.className = "opt"; b.innerHTML = mdc(o);
      b.onclick = function () {
        if (needPredict()) return;
        var ok = i === it.right;
        box.querySelectorAll(".opt").forEach(function (x, j) {
          if (j === it.right) x.classList.add("right");
          else if (j === i) x.classList.add("wrong");
        });
        if (ok) cur.score++;
        Engine.awardXp(ok ? 6 : 2);
        Engine.logItem({ type: "read", id: ch.id, predict: cur.predicted, correct: ok });
        showFb(ok, "<b>" + (ok ? "读通了" : "再想一下") + "</b>：" + mdc(it.why));
        var more = cur.idx + 1 < stg.items.length;
        act.innerHTML = '<button class="btn primary" data-next="1">' + (more ? "下一题" : "完成本章") + "</button>";
        bindNext(act);
        renderHud();
      };
      box.appendChild(b);
    });
    $("lv-stage").insertAdjacentHTML("afterbegin", confRow());
  }

  /* ---- 编码关 ---- */
  function renderEncode(it, act) {
    $("lv-stage").innerHTML =
      '<div class="material">' + md(it.material) + "</div>" +
      "<h2>" + md(it.q) + "</h2>" +
      '<div class="opts" id="opts"></div>';
    var box = $("opts");
    it.opts.forEach(function (o, i) {
      var d = document.createElement("button");
      d.className = "opt"; d.innerHTML = mdc(o);
      d.onclick = function () {
        if (needPredict()) return;
        var ok = i === it.right;
        box.querySelectorAll(".opt").forEach(function (x, j) {
          if (j === it.right) x.classList.add("right");
          else if (j === i) x.classList.add("wrong");
        });
        if (ok) cur.score++;
        Engine.logItem({ type: "encode", id: it.id, predict: cur.predicted, correct: ok });
        Engine.awardXp(ok ? 8 : 3);
        showFb(ok, "<b>" + (ok ? "对了" : "再想") + "</b>：" + mdc(it.why));
        act.innerHTML = '<button class="btn primary" data-next="1">下一题</button>';
        bindNext(act);
        renderHud();
      };
      box.appendChild(d);
    });
    $("lv-stage").insertAdjacentHTML("afterbegin", confRow());
  }

  /* ---- 关卡内闪卡 ---- */
  function renderLevelCard(it, act) {
    var learned = Engine.isLearned(it.id);
    var metaHtml = learned
      ? '<span class="tag-ok">已学</span> 凭回忆想一想，再翻面对照评分'
      : '<span class="tag-new">未学 · 初见面</span> 先把这张卡的讲解读一遍——读完才会进入自测';
    $("lv-stage").innerHTML =
      '<div class="card-box"><div class="card-face"><span class="q">' + md(it.t) + "</span>" + md(it.q) + "</div>" +
      '<div class="card-face ' + (learned ? "hidden" : "") + ' vivid" id="lv-back">' +
        (it.vivid ? nl(it.vivid, true) : md(it.a)) + "</div>" +
      '<div class="card-meta" id="lv-cardmeta">' + metaHtml + "</div></div>" +
      '<div class="grade-row hidden" id="lv-grades">' +
      '<button class="g g1" data-g="1">忘记</button><button class="g g3" data-g="3">困难</button>' +
      '<button class="g g4" data-g="4">良好</button><button class="g g5" data-g="5">轻松</button></div>';
    act.innerHTML = '<button class="btn primary" id="lv-show">' + (learned ? "显示答案" : "我读过了，考考我") + "</button>";
    $("lv-show").onclick = function () {
      if (!learned) {
        Engine.markLearned(it.id);
        S = Engine.state();
        learned = true;
        $("lv-back").classList.add("hidden");
        $("lv-cardmeta").innerHTML = '<span class="tag-ok">已学</span> 凭回忆想一想，再翻面对照评分';
        act.innerHTML = '<button class="btn primary" id="lv-show">显示答案</button>';
        $("lv-show").onclick = function () {
          $("lv-back").classList.remove("hidden");
          $("lv-grades").classList.remove("hidden");
          act.innerHTML = "";
        };
        toast("已标记为学过，现在凭回忆想一想");
        renderHud();
        return;
      }
      $("lv-back").classList.remove("hidden");
      $("lv-grades").classList.remove("hidden");
      act.innerHTML = "";
    };
    document.querySelectorAll("#lv-grades .g").forEach(function (b) {
      b.onclick = function () {
        var g = +b.dataset.g;
        var c = Engine.gradeCard(it.id, g);
        if (g >= 3) cur.score++;
        Engine.awardXp(g >= 4 ? 7 : (g === 3 ? 5 : 2));
        Engine.logItem({ type: "card", id: it.id, grade: g, r: it.r });
        showFb(g >= 3, g >= 3
          ? "进入调度：间隔 <b>" + c.iv + "</b> 天后再来，EF " + c.ef.toFixed(2)
          : "回炉：连续次数归零，这张卡今天还会再出现。");
        act.innerHTML = '<button class="btn primary" data-next="1">下一张</button>';
        bindNext(act);
        renderHud();
      };
    });
  }

  /* ---- 主动回忆关 ---- */
  function renderRecallQ(it, act) {
    $("lv-stage").innerHTML =
      "<h2>" + md(it.q) + "</h2>" +
      '<div class="pill hot">闭卷 · 不许翻材料</div>' +
      '<textarea class="ans" id="ans" placeholder="凭回忆写出你的答案…"></textarea>' +
      confRow();
    act.innerHTML = '<button class="btn ghost" id="use-hint">给个提示（扣 50%）</button>' +
      '<button class="btn ghost" id="use-learn">我还没学过，先讲一遍（本题不计分）</button>' +
      '<button class="btn primary" id="submit">提交</button>';
    $("use-hint").onclick = function () {
      cur.hintUsed = true;
      showFb(false, "提示：<b>" + md(it.tip) + "</b>　（已扣分：提示会消除提取难度）");
      if (!act.querySelector("[data-next]")) {
        act.insertAdjacentHTML("beforeend", '<button class="btn ghost" data-next="1">跳过这题</button>');
        bindNext(act);
      }
    };
    $("use-learn").onclick = function () {
      cur.hintUsed = true;
      cur.noScore = true;
      var L = DATA.lessons.filter(function (x) { return x.r === it.r; })[0];
      showFb(false,
        "<b>先读懂它：</b><br>" + md((L && L.essence) || "先回到教材关过一遍这个概念。") +
        "<br><br><b>类比：</b>" + md((L && L.analogy) || "") +
        "<br><br><b>例子：</b>" + md((L && L.example) || "") +
        "<br><br><b>关键数字：</b>" + md((L && L.number) || "") +
        "<br><br>本题不再计分——先编码，再提取，顺序不能反。<br>建议你回到教材关，把这个概念完整过一遍。");
      if (!act.querySelector("[data-next]")) {
        act.insertAdjacentHTML("beforeend", '<button class="btn ghost" data-next="1">跳过这题</button>');
        bindNext(act);
      }
    };
    $("submit").onclick = function () {
      if (needPredict()) return;
      var v = ($("ans").value || "").trim();
      if (v.length < 4) { toast("至少写几个字——空白等于没有提取"); return; }
      var hit = 0;
      it.keys.forEach(function (k) { if (v.indexOf(k) >= 0) hit++; });
      var ratio = hit / it.keys.length;
      var ok = ratio >= 0.6;
      var gain = ok ? (cur.hintUsed ? 5 : 10) : (cur.hintUsed ? 1 : 3);
      if (cur.noScore) { gain = 2; }
      else if (ok && !cur.hintUsed) cur.score++;
      else if (ok && cur.hintUsed) cur.score += 0.5;
      Engine.awardXp(gain);
      Engine.logItem({ type: "recall", id: it.id, predict: cur.predicted, correct: ok, r: it.r });
      var missed = it.keys.filter(function (k) { return v.indexOf(k) < 0; });
      showFb(ok,
        (ok ? "提取成功，命中 " + hit + "/" + it.keys.length + " 个关键词。" : "提取不完整，命中 " + hit + "/" + it.keys.length + "。") +
        (missed.length ? " 漏掉的关键点：<span class='kwd'>" + esc(missed.join("、")) + "</span>。" : "") +
        "<br><br>参考要点：" + md(it.a) +
        (curCtx && curCtx.vivid ? "" : ""));
      act.innerHTML = '<button class="btn primary" data-next="1">下一题</button>';
      bindNext(act);
      renderHud();
    };
  }

  /* ---- 费曼关 ---- */
  var CATS = DATA.bossCats || [];
  var DCAT = DATA.bossCatMap || {};

  function renderFeynman(it, act) {
    $("lv-stage").innerHTML =
      '<div class="pill hot">听众：' + md(it.audience) + "</div>" +
      "<h2>请讲解：" + md(it.topic) + "</h2>" +
      '<textarea class="ans" id="ans" placeholder="用最简单的语言讲一遍，别用术语…"></textarea>' +
      '<p class="hint">判定通过：不少于 60 字、不含术语、至少有一个例子。讲不通的地方就是你的漏洞。</p>';
    act.innerHTML = '<button class="btn primary" id="submit">讲给学伴听</button>';
    $("submit").onclick = function () {
      var v = ($("ans").value || "").trim();
      if (v.length < 10) { toast("讲得太少了，至少试着说一段"); return; }
      var pool = it.jargon.concat(JARGON_ALL).filter(function (w, i, a) { return a.indexOf(w) === i; });
      var jargons = pool.filter(function (w) { return v.indexOf(w) >= 0; });
      var hasEg = /比如|例如|举个例子|打个比方|像是|比如说/.test(v);
      var ok = v.length >= 60 && jargons.length === 0 && hasEg;
      var lines = [];
      if (v.length < 60) lines.push("· 讲得太短了（" + v.length + " 字）——讲不下去的地方，通常就是你自己没想清楚的地方。");
      if (jargons.length) lines.push("· 你用了术语：<span class='kwd'>" + esc(jargons.join("、")) + "</span>。换成大白话，或换成一个类比。");
      if (!hasEg) lines.push("· 还没有例子。给听众一个具体情境，他才能真的懂。");
      if (ok) lines.push("· 讲通了：够长、没术语、有例子。这就是费曼法的完成态。");
      else {
        var pl = it.prompts[Math.floor(Math.random() * it.prompts.length)];
        lines.push("· 学伴追问：<b>" + md(pl) + "</b>");
      }
      if (ok) cur.score++;
      Engine.awardXp(ok ? 14 : 5);
      Engine.logItem({ type: "feynman", id: it.id, predict: cur.predicted, correct: ok });
      showFb(ok, lines.join("<br>"));
      act.innerHTML = (ok ? "" : '<button class="btn" id="retry">修改后再讲一次</button>') +
        '<button class="btn primary" data-next="1">' + (ok ? "下一题" : "跳过这题") + "</button>";
      var rt = $("retry");
      if (rt) rt.onclick = function () { $("lv-feedback").classList.add("hidden"); renderStage(); };
      bindNext(act);
      renderHud();
    };
  }

  /* ---- 交错 BOSS 关 ---- */
  function renderBoss(it, act) {
    var cat = DCAT[it.id];
    $("lv-stage").innerHTML =
      '<div class="boss-mix">' + CATS.map(function (c, i) {
        return '<span class="pill' + (i === cat ? " hot" : "") + '">' + c + "</span>";
      }).join("") + "</div>" +
      '<div class="material">' + md(it.scene) + "</div>" +
      "<h2>第一步 · 先判别：这属于哪一类问题？</h2>" +
      '<div class="opts" id="cat-opts"></div>' +
      '<div id="step2" class="hidden"><h2>第二步 · 该用哪种做法？</h2><div class="opts" id="act-opts"></div></div>';
    var cbox = $("cat-opts");
    CATS.forEach(function (c, i) {
      var b = document.createElement("button");
      b.className = "opt"; b.innerHTML = md(c);
      b.onclick = function () {
        var ok = i === cat;
        cbox.querySelectorAll(".opt").forEach(function (x, j) {
          if (j === cat) x.classList.add("right"); else if (j === i) x.classList.add("wrong");
        });
        if (!ok) {
          Engine.logItem({ type: "boss", id: it.id, mtype: "条件误判", predict: cur.predicted, correct: false });
          showFb(false, "判别错了：这是<b>" + CATS[cat] + "</b>问题。交错练习的价值就在这第一步——先选对规则，再动手。");
          $("step2").classList.remove("hidden");
        } else {
          showFb(true, "判别正确。现在选具体做法。");
          $("step2").classList.remove("hidden");
        }
      };
      cbox.appendChild(b);
    });
    var abox = $("act-opts");
    it.opts.forEach(function (o, i) {
      var b = document.createElement("button");
      b.className = "opt"; b.innerHTML = mdc(o);
      b.onclick = function () {
        var ok = i === it.right;
        abox.querySelectorAll(".opt").forEach(function (x, j) {
          if (j === it.right) x.classList.add("right"); else if (j === i) x.classList.add("wrong");
        });
        if (ok) cur.score++;
        Engine.awardXp(ok ? 12 : 4);
        Engine.logItem({ type: "boss", id: it.id, predict: cur.predicted, correct: ok, mtype: ok ? null : "规则误用" });
        showFb(ok, "<b>" + (ok ? "BOSS 命中" : "被 BOSS 打回") + "</b>：" + mdc(it.why));
        act.innerHTML = '<button class="btn primary" data-next="1">下一题</button>';
        bindNext(act);
        renderHud();
      };
      abox.appendChild(b);
    });
    $("lv-stage").insertAdjacentHTML("afterbegin", confRow());
  }

  /* ---- 错因归因关 ---- */
  function renderMistake(it, act) {
    $("lv-stage").innerHTML =
      '<div class="material">' + md(it.ans) + "</div>" +
      "<h2>这个错误属于哪一类？</h2>" +
      '<div class="opts" id="opts"></div>';
    var box = $("opts");
    it.opts.forEach(function (o, i) {
      var b = document.createElement("button");
      b.className = "opt"; b.innerHTML = mdc(o);
      b.onclick = function () {
        var ok = i === it.right;
        box.querySelectorAll(".opt").forEach(function (x, j) {
          if (j === it.right) x.classList.add("right");
          else if (j === i) x.classList.add("wrong");
        });
        if (ok) cur.score++;
        Engine.awardXp(ok ? 9 : 3);
        Engine.logItem({ type: "mistake", id: it.id, predict: cur.predicted, correct: ok, mtype: it.opts[it.right] });
        showFb(ok, "<b>" + it.opts[it.right] + "</b>：" + mdc(it.why));
        act.innerHTML = '<button class="btn primary" data-next="1">下一题</button>';
        bindNext(act);
        renderHud();
      };
      box.appendChild(b);
    });
    $("lv-stage").insertAdjacentHTML("afterbegin", confRow());
  }

  /* ---- 创作关 ---- */
  function renderCreate(it, act) {
    var list = it.checks.map(function (c) { return "· " + c.label; }).join("<br>");
    $("lv-stage").innerHTML =
      "<h2>" + md(it.title) + "</h2>" +
      '<div class="material">' + md(it.brief) + "</div>" +
      "<h2>六项硬指标</h2><p style='font-size:13px;color:var(--dim)'>" + list + "</p>" +
      '<textarea class="ans" id="ans" placeholder="例如：主题=考研英语阅读。第1天编码…第3天闭卷复述…第7天迁移练习…先独立作答再由AI批改…"></textarea>';
    act.innerHTML = '<button class="btn primary" id="submit">提交方案</button>';
    $("submit").onclick = function () {
      var v = ($("ans").value || "").trim();
      if (v.length < 30) { toast("至少写 30 字，方案要能执行"); return; }
      var hit = [], miss = [];
      it.checks.forEach(function (c) {
        var got = c.keys.some(function (k) { return v.indexOf(k) >= 0; });
        (got ? hit : miss).push(c.label);
      });
      var ok = hit.length >= 4;
      if (ok) cur.score++;
      Engine.awardXp(ok ? 20 : 6);
      Engine.logItem({ type: "create", predict: cur.predicted, correct: ok });
      showFb(ok,
        "达成 " + hit.length + "/6：<br>· " + hit.join("<br>· ") +
        (miss.length ? "<br><br>缺口：<span class='kwd'>" + miss.join("、") + "</span>。" : "") +
        (ok ? "<br><br>方案成立。下一步：把它抄进你的日历——设计得再好，不在时间轴上发生就等于没有。" : ""));
      act.innerHTML = (ok ? "" : '<button class="btn" id="retry">改写一版</button>') +
        '<button class="btn primary" data-next="1">' + (ok ? "完成" : "先这样") + "</button>";
      var rt = $("retry");
      if (rt) rt.onclick = function () { $("lv-feedback").classList.add("hidden"); renderStage(); };
      bindNext(act);
      renderHud();
    };
  }

  function bindNext(act) {
    var b = act.querySelector("[data-next]");
    if (b) b.onclick = function () {
      cur.idx++; cur.predicted = null; cur.hintUsed = false; cur.noScore = false;
      renderStage();
    };
  }

  function showFb(ok, html) {
    var fb = $("lv-feedback");
    fb.className = "feedback " + (ok ? "good" : "bad");
    fb.innerHTML = html;
    fb.classList.remove("hidden");
    fb.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }

  function finishLevel() {
    var lv = cur.level;
    var rec = Engine.setLevelResult(lv.id, cur.score, cur.total);
    /* 整章走完、结算过：页码归零，下次进来从头读 */
    Engine.setPage(lv.id, 0);
    var pct = Math.round((cur.score / cur.total) * 100);
    var calib = Engine.calibration();
    $("lv-stage").innerHTML =
      "<h2>关卡结算</h2>" +
      '<div class="material">得分 <b>' + cur.score + " / " + cur.total + "</b>（" + pct + "%）· 通关线 80%<br>" +
      (rec.done ? "已通关，解锁下一区域。" : "未达 80%，同一类卡壳点还会再出现——这正是复盘阶段要处理的。") +
      "<br>历史最佳：" + rec.best + "% · 尝试次数：" + rec.tries +
      (calib.n ? "<br>当前校准误差：<b>" + calib.err.toFixed(2) + "</b>（样本 " + calib.n + "）" : "") +
      "</div>" +
      "<h2>这一关训练的是</h2><p style='font-size:13px;color:var(--dim)'>" + md(lv.method) +
      "。回到地图，下一关会把刚才提取出来的内容推进到下一阶段。</p>";
    $("lv-actions").innerHTML = '<button class="btn primary" id="back-map">返回地图</button>' +
      '<button class="btn" id="go-due">去今日复习</button>';
    $("back-map").onclick = function () { showView("map"); };
    $("go-due").onclick = function () { showView("recall"); };
    $("lv-progress").style.width = "100%";
    renderHud();
  }

  /* ---------- 复盘墙 ---------- */
  function renderWall() {
    var rh = "";
    DATA.regions.forEach(function (rg) {
      rh += '<div class="ring-cell">' + ring(Engine.regionMastery(rg.id), rg.color) +
        "<span>" + rg.name + "</span></div>";
    });
    $("mastery-rings").innerHTML = rh;

    var m = Engine.mistakeStats();
    var max = Math.max(1, Math.max.apply(null, Object.keys(m).map(function (k) { return m[k]; })));
    $("mistake-bars").innerHTML = Object.keys(m).map(function (k) {
      return '<div class="bar"><div class="lb"><span>' + k + "</span><span>" + m[k] + "</span></div>" +
        '<div class="tr"><div class="fl" style="width:' + (m[k] / max * 100) + '%"></div></div></div>';
    }).join("");

    var c = Engine.calibration();
    $("calib").innerHTML = c.n
      ? '<div class="big">' + c.err.toFixed(2) + '</div><div class="sm">样本 ' + c.n + " 题 · 0 为完全校准</div>"
      : '<div class="sm">还没有带预测的记录。去做带「把握度」的关卡。</div>';

    var days = [];
    for (var i = 13; i >= 0; i--) {
      var d = new Date(); d.setHours(0, 0, 0, 0); d.setDate(d.getDate() - i);
      var key = d.getFullYear() + "-" + (d.getMonth() + 1) + "-" + d.getDate();
      days.push(S.days.indexOf(key) >= 0);
    }
    $("streak-cal").innerHTML = days.map(function (on) { return "<i class='" + (on ? "on" : "") + "'></i>"; }).join("");

    $("achv").innerHTML = (DATA.achievements || []).map(function (a) {
      var got = S.achievements.indexOf(a.id) >= 0;
      return '<span class="' + (got ? "got" : "") + '" title="' + esc(a.desc) + '">' + (got ? "" : "") + a.name + "</span>";
    }).join("");
  }

  /* ---------- 方法图鉴 ---------- */
  var libFilter = "all";
  var TIERS = { 1: "第一梯队 · 无条件优先", 2: "第二梯队 · 基础扎实后叠加", 3: "辅助 · 只做配角", 4: "误传 · 当反面教材" };
  function renderLibrary() {
    var list = (DATA.methods || []).filter(function (m) {
      return libFilter === "all" || String(m.tier) === libFilter;
    });
    $("lib-grid").innerHTML = list.map(function (m) {
      return '<div class="mcard t' + m.tier + '">' +
        "<h2><span>" + esc(m.name) + '</span><span class="rate">' + esc(m.rate) + "</span></h2>" +
        '<div class="tiername">' + TIERS[m.tier] + "</div>" +
        '<div class="num">效应量 / 数字：' + md(m.d) + "</div>" +
        '<div class="why">' + md(m.principle) + "</div>" +
        "<ol>" + m.steps.map(function (x) { return "<li>" + md(x) + "</li>"; }).join("") + "</ol>" +
        '<div class="mis">误用：' + md(m.misuse) + "</div></div>";
    }).join("");
    document.querySelectorAll("#lib-filter .btn").forEach(function (b) {
      b.classList.toggle("primary", b.dataset.f === libFilter);
      b.onclick = function () { libFilter = b.dataset.f; renderLibrary(); };
    });
  }

  /* ---------- 提示词 ---------- */
  function renderPrompts() {
    $("prompt-grid").innerHTML = (DATA.prompts || []).map(function (p, i) {
      return '<div class="pcard"><h3>' + esc(p.m) + '</h3><div class="role">AI 角色：' + esc(p.role) + "</div>" +
        "<pre>" + esc(p.p) + "</pre>" +
        '<div class="row-btns" style="margin-top:0">' +
        '<button class="btn small" data-copy="' + i + '">复制提示词</button>' +
        '<button class="btn small primary" data-ask="' + i + '">让学伴照此执行</button>' +
        "</div></div>";
    }).join("");
    document.querySelectorAll("[data-copy]").forEach(function (b) {
      b.onclick = function () {
        var txt = DATA.prompts[+b.dataset.copy].p;
        copy(txt);
        b.textContent = "已复制 ✓";
        setTimeout(function () { b.textContent = "复制提示词"; }, 1600);
      };
    });
    document.querySelectorAll("[data-ask]").forEach(function (b) {
      b.onclick = function () {
        var p = DATA.prompts[+b.dataset.ask];
        var inp = $("npc-input");
        if (!inp) return;
        inp.value = p.p + "\n\n【我这次的输入】";
        $("npc").classList.add("open");
        inp.focus();
        inp.setSelectionRange(inp.value.length, inp.value.length);
        toast(LLM.ready() ? "提示词已放进学伴输入框，补上你的内容再发送" : "提示词已放入；建议先在「模型设置」里接上模型");
      };
    });
  }
  function copy(txt) {
    try {
      var ta = document.createElement("textarea");
      ta.value = txt; document.body.appendChild(ta); ta.select();
      document.execCommand("copy"); document.body.removeChild(ta);
      toast("已复制到剪贴板");
    } catch (e) { toast("复制失败，请手动选择文本"); }
  }

  /* ---------- NPC 学伴 ---------- */
  var npcMode = "ask";
  var npcHistory = [];      /* 真实发给模型的多轮历史 */
  var npcBusy = false;
  var npcCtl = null;        /* 用于中止流式 */
  var npcReasonEl = null;

  var NPC_MODES = {
    ask: {
      label: "只追问",
      tip: "不给你答案，只按苏格拉底式追问往下钻。讲不下去的地方，就是没想清楚的地方。",
      sys: [
        "你是《通向实在之路》（Roger Penrose, The Road to Reality, 1124 页 / 34 章）的共读学伴。",
        "当前模式：只追问。你的唯一任务是让读者自己想清楚，绝对不要给出答案、结论或关键概念的解释。",
        "做法：① 从读者这段话里找出最含糊的一处，追问它的确切含义；",
        "② 若他用了专业术语（如「流形」「规范曲率」「退相干」），要求他换成大白话或给出自己的例子；",
        "③ 若他在陈述而没有理由，追问「为什么」与「前提是什么」；",
        "④ 若他讲得不错，就追问边界条件（把条件反过来，结论还成立吗）。",
        "每次回复只问 1–2 个问题，40–120 字，语气像认真的同门师兄，不用客套话，不要复述他的话。",
        "如果读者直接索要答案，用一句反问把他挡回去。"
      ].join("\n")
    },
    review: {
      label: "批改",
      tip: "对照本题关键点评价你的作答，逐条指出缺失，再给一句追问。",
      sys: [
        "你是《通向实在之路》的共读学伴。当前模式：批改。",
        "读者刚做了一道题目并给出作答，你的任务是严格而具体地批改：",
        "① 先一句话给出总体判断（对在哪里、错在哪里）；",
        "② 逐条对照「本题关键点」列出他覆盖了哪些、缺了哪些（缺的要点名）；",
        "③ 指出任何一个用得不准确的名词或跳跃的推理；",
        "④ 最后给一句追问，指向他还没想透的地方。",
        "150–300 字，直接说，不要恭维。发现他答错时，可以给出正确方向，但让他自己补完细节。",
        "不要编造页码或引文——记不准就只说章节主题。"
      ].join("\n")
    },
    chat: {
      label: "自由问答",
      tip: "可以直接提问，学伴会回答；但答案仍需你自己复述一遍才算学会。",
      sys: [
        "你是《通向实在之路》（Penrose）的共读助教，读者正在逐章精读这本书。当前模式：自由问答。",
        "回答要求：① 直接回答问题，可以给出完整解释与必要的公式；",
        "② 尽量指出该内容对应的章节（例如「第 22 章讲 U 与 R 的分裂」），但不要编造页码或引文，记不准就明说不确定；",
        "③ 若问题涉及作者本人的立场（如他对弦论物理地位、对退相干的态度），明确说明这是 Penrose 的观点而非学界共识；",
        "④ 讲完概念后，用一个反问确认读者是否真的理解。",
        "篇幅按问题复杂度定，一般 200–400 字。中文作答，公式用纯文本写清楚。"
      ].join("\n")
    }
  };

  /* 从当前关卡/题目里提取给模型的上下文 */
  function npcContext() {
    if (!cur.level) return null;
    var it = curCtx || {};
    var ask = it.q || it.topic || it.h || it.title || it.text || it.prompt || "";
    var keys = it.keys || it.must || null;
    var ans = it.a || it.answer || "";
    if (typeof ask !== "string") ask = "";
    if (keys && !Array.isArray(keys)) keys = null;
    return {
      level: cur.level.name,
      type: cur.level.type,
      method: cur.level.method || "",
      ask: ask.replace(/\s+/g, " ").slice(0, 320),
      keys: keys,
      answer: typeof ans === "string" ? ans.replace(/\s+/g, " ").slice(0, 240) : ""
    };
  }

  function npcSysPrompt() {
    var parts = [NPC_MODES[npcMode].sys];
    var c = npcContext();
    if (c) {
      var block = ["", "【读者当前所处的关卡】", "关卡：" + c.level + (c.method ? "（训练方法：" + c.method + "）" : "")];
      if (c.ask) block.push("题目：" + c.ask);
      if (c.keys && c.keys.length) block.push("本题关键点（批改时逐条对照）：" + c.keys.join("、"));
      parts.push(block.join("\n"));
    }
    parts.push("", "【全局纪律】读者在学习一套以「主动回忆 + 间隔重复」为核心的方法。" +
      "你的价值在于逼他提取，而不是替他输入。除非当前模式允许，否则不要主动把答案讲完。");
    return parts.join("\n");
  }

  function npcContextBanner() {
    var el = $("npc-ctx");
    if (!el) return;
    var c = npcContext();
    if (!c) { el.classList.remove("on"); el.innerHTML = ""; return; }
    var t = "<b>" + md(c.level) + "</b>";
    if (c.ask) t += " · " + md(c.ask.slice(0, 78)) + (c.ask.length > 78 ? "…" : "");
    el.innerHTML = t;
    el.classList.add("on");
  }

  function npcStatus() {
    var badge = $("npc-badge"), dot = $("npc-dot"), tip = $("npc-tip");
    if (!badge) return;
    var cfg = LLM.getCfg();
    if (LLM.ready()) {
      badge.textContent = cfg.model || "已配置";
      badge.className = "npc-badge ok";
      if (dot) dot.style.background = "var(--ok)";
      if (tip) tip.textContent = "已接入 " + cfg.model + "（" + LLM.preset(cfg.preset).label + "）。" + NPC_MODES[npcMode].tip;
    } else {
      badge.textContent = "未配置";
      badge.className = "npc-badge bad";
      if (dot) dot.style.background = "var(--bad)";
      if (tip) tip.textContent = "未接模型（缺 " + LLM.missing().join("、") + "），当前用内置规则追问。点「设置」填写 API 即可接入你自己的模型。";
    }
  }

  /* ---- 学伴面板：分屏展开 ----
     浮窗 320px 在 PC 上看推导时经常憋屈。点标题栏的「⤢」把面板铺到右侧整屏高，
     正文区自动让出等宽，形成左右分屏；偏好存本地，下次打开还是分屏。 */
  var SPLIT_KEY = "rtr_npc_split_v1";
  var npcSplitWant = false;

  function npcSplitWidth() {
    var w = window.innerWidth || 1200;
    return Math.max(340, Math.min(Math.round(w * 0.44), 660));
  }
  function npcSplitOn() { return document.body.classList.contains("npc-split"); }

  function applyNpcSplit() {
    var narrow = window.matchMedia("(max-width:900px)").matches;
    var on = npcSplitWant && !narrow;      // 手机上分屏没意义，自动降级成浮窗
    document.body.classList.toggle("npc-split", on);
    $("npc").classList.toggle("full", on);
    if (on) $("npc").classList.add("open");
    document.documentElement.style.setProperty("--npc-split", npcSplitWidth() + "px");
    var b = $("npc-expand");
    if (b) {
      b.textContent = on ? "⤡" : "⤢";
      b.title = on ? "收起：学伴回到右下角浮窗" : "展开为分屏：学伴铺在右侧，和网页并排看";
      b.setAttribute("aria-label", on ? "收起学伴面板" : "展开学伴面板为分屏");
    }
    /* 分屏会改正文宽度，瀑布流的列数跟着变，得重排地图 */
    if (cur.view === "map" && typeof layoutMap === "function") layoutMap();
  }
  function setNpcSplit(v) {
    npcSplitWant = !!v;
    applyNpcSplit();
    try { localStorage.setItem(SPLIT_KEY, npcSplitWant ? "1" : "0"); } catch (e) {}
    toast(npcSplitWant && npcSplitOn()
      ? "学伴已铺到右侧 · 按 Esc 或点「⤡」收起"
      : (npcSplitWant ? "屏幕太窄，暂用浮窗模式" : "学伴已收回右下角"));
  }

  function initNpc() {
    $("npc-toggle").onclick = function () {
      if (npcSplitOn()) return;            /* 分屏下标题栏不再折叠，避免点错收起 */
      $("npc").classList.toggle("open");
    };
    var exp = $("npc-expand");
    if (exp) exp.onclick = function (e) {
      if (e && e.stopPropagation) e.stopPropagation();
      setNpcSplit(!npcSplitWant);
    };
    try { npcSplitWant = localStorage.getItem(SPLIT_KEY) === "1"; } catch (e) { npcSplitWant = false; }
    applyNpcSplit();
    window.addEventListener("resize", function () { applyNpcSplit(); });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && npcSplitOn()) setNpcSplit(false);
    });
    $("npc-ask").onclick = askNpc;
    $("npc-stop").onclick = stopNpc;
    $("npc-clear").onclick = function () {
      npcHistory = [];
      $("npc-chat").innerHTML = "";
      greetingNpc();
    };
    $("npc-export").onclick = exportChat;
    $("npc-config").onclick = function () {
      showView("companion");
      setTimeout(function () { var b = $("llm-base"); if (b) b.focus(); }, 60);
    };
    $("npc-input").onkeydown = function (e) {
      if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) { e.preventDefault(); askNpc(); }
    };
    document.querySelectorAll("#npc-modes .btn").forEach(function (b) {
      b.onclick = function () { setNpcMode(b.dataset.mode); };
    });
    setNpcMode("ask", true);
    greetingNpc();
  }

  function setNpcMode(m, silent) {
    npcMode = NPC_MODES[m] ? m : "ask";
    document.querySelectorAll("#npc-modes .btn").forEach(function (b) {
      b.classList.toggle("on", b.dataset.mode === npcMode);
    });
    npcStatus();
    if (!silent) toast("模式：" + NPC_MODES[npcMode].label + " — " + NPC_MODES[npcMode].tip);
  }

  function greetingNpc() {
    var g;
    if (LLM.ready()) {
      g = "已接入 " + LLM.getCfg().model + "。我在。规则是：你先写答案，我只追问，不替你补充。" +
        "想让我批改，切到「批改」；想直接提问，切到「自由问答」。";
    } else {
      g = "我在（当前用内置规则追问）。我没有接上大模型，只会按几条固定规则追问你。" +
        "想让我真正听懂你在说什么，点下面的「设置」，填一个 API 就能接上你自己的模型。";
    }
    say("sys", g);
  }

  function say(who, txt) {
    var c = $("npc-chat");
    var d = document.createElement("div");
    d.className = who; d.textContent = txt;
    c.appendChild(d); c.scrollTop = c.scrollHeight;
    return d;
  }

  function pushHistory(role, content) {
    npcHistory.push({ role: role, content: content });
    if (npcHistory.length > 16) npcHistory = npcHistory.slice(npcHistory.length - 16);
  }

  function builtinReply(v) {
    return npcMode === "review" ? reviewMode(v) : askMode(v);
  }

  function askNpc() {
    if (npcBusy) { toast("学伴正在回复，等它说完或点「停止」"); return; }
    var v = ($("npc-input").value || "").trim();
    if (!v) { toast("先写下你自己的答案"); return; }
    say("me", v);
    $("npc-input").value = "";
    pushHistory("user", v);
    npcContextBanner();

    if (!LLM.ready()) {
      var r = builtinReply(v);
      setTimeout(function () {
        say("ai", r);
        pushHistory("assistant", r);
      }, 240);
      npcStatus();
      return;
    }
    callModel();
  }

  /* 从断点续写：把已有回答留在上下文里，追加一句指令再请求一次 */
  function continueReply() {
    if (npcBusy) { toast("学伴还在回复，等它说完"); return; }
    say("me", "（接着写）");
    pushHistory("user", "接着上面那段没写完的回答继续写，从断点处接上，不要重复已经写过的内容，也不要重新开头。");
    npcContextBanner();
    callModel();
  }

  function callModel() {
    npcBusy = true;
    $("npc-ask").disabled = true;
    npcCtl = new AbortController();

    var wrap = document.createElement("div");
    wrap.className = "ai";
    var body = document.createElement("span");
    body.className = "busy";
    wrap.appendChild(body);
    $("npc-chat").appendChild(wrap);

    npcReasonEl = null;
    var cfg = LLM.getCfg();
    var msgs = [{ role: "system", content: npcSysPrompt() }].concat(npcHistory);

    /* 逐 token 写 DOM 会让长回答明显卡顿：攒到每一帧画一次 */
    var accText = "", accReason = "", raf = 0;
    function schedule() {
      if (raf) return;
      raf = requestAnimationFrame(function () {
        raf = 0;
        if (accReason && npcReasonEl) npcReasonEl.textContent = accReason;
        body.textContent = accText;
        var c = $("npc-chat");
        if (c) c.scrollTop = c.scrollHeight;
      });
    }
    function settle() {
      if (raf) { cancelAnimationFrame(raf); raf = 0; }
    }

    LLM.chat(msgs, {
      stream: cfg.stream,
      signal: npcCtl.signal,
      onReasoning: function (s) {
        accReason += s;
        if (!cfg.showReasoning) return;
        if (!npcReasonEl) {
          var d = document.createElement("details");
          d.className = "reason";
          d.innerHTML = "<summary>思考过程</summary><div></div>";
          wrap.insertBefore(d, body);
          npcReasonEl = d.querySelector("div");
        }
        schedule();
      },
      onDelta: function (s) {
        accText += s;
        schedule();
      }
    }).then(function (res) {
      settle();
      body.classList.remove("busy");
      var replyText = accText || res.text || "";
      if (!replyText && res.reasoning) {
        replyText = "（模型只返回了思考过程，没有正文。可在设置里关掉「展开思考过程」，或把「最大输出 tokens」调大再试。）";
      }
      if (replyText) body.innerHTML = chatMD(replyText);
      pushHistory("assistant", res.text || accText || "");

      var meta = [];
      var u = res.usage;
      if (u) {
        var pin = u.prompt_tokens || 0, pout = u.completion_tokens || 0;
        var tot = u.total_tokens || (pin + pout);
        if (tot) meta.push("输入 " + pin + " + 输出 " + pout + " = " + tot + " tokens");
        else meta.push("用量字段：" + JSON.stringify(u).slice(0, 60));
      }
      if (res.ms) meta.push((res.ms / 1000).toFixed(1) + "s");
      if (meta.length) {
        var m = document.createElement("div");
        m.className = "sys"; m.textContent = meta.join(" · ");
        wrap.appendChild(m);
      }

      /* 没写完的三种情形都要说出来，别让用户以为模型就这脾气 */
      function notDoneNote(msg) {
        var tb = document.createElement("div");
        tb.className = "trunc";
        tb.textContent = msg;
        var more = document.createElement("button");
        more.className = "btn small";
        more.textContent = "接着写";
        more.onclick = function () { tb.remove(); continueReply(); };
        tb.appendChild(more);
        wrap.appendChild(tb);
      }
      if (res.truncated) {
        notDoneNote((res.finishReason === "content_filter"
          ? "回答被内容策略中止"
          : "回答撞到输出上限（" + (cfg.maxTokens || 4096) + " tokens），话没说完") +
          "。可以点右按钮接着写，或去「设置 → 最大输出 tokens」调大。");
      } else if (res.interrupted) {
        notDoneNote("上游没有正常收尾（没收到结束标记），上面是已经收到的部分。多半是网络闪断或服务端在生成中被打断，点右按钮可以让它接着写完。");
      }
      $("npc-chat").scrollTop = $("npc-chat").scrollHeight;
      npcContextBanner();
    }).catch(function (e) {
      settle();
      body.classList.remove("busy");
      var partial = accText || body.textContent || "";
      /* 已生成的内容一律保留——中途出错不等于前面的字作废 */
      if (partial) body.innerHTML = chatMD(partial);
      else if (wrap.contains(body)) wrap.removeChild(body);

      if (e && e.kind === "aborted") {
        pushHistory("assistant", partial);
        var st = document.createElement("div");
        st.className = "sys";
        st.textContent = partial ? "已停止（以上是已生成的部分）" : "已停止";
        wrap.appendChild(st);
        $("npc-chat").scrollTop = $("npc-chat").scrollHeight;
        return;
      }
      var err = document.createElement("div");
      err.className = "err";
      err.textContent = (partial ? "回答中断，上面 " + partial.length + " 字已保留。\n" : "") + friendlyError(e);
      wrap.appendChild(err);
      $("npc-chat").scrollTop = $("npc-chat").scrollHeight;
    }).finally(function () {
      npcBusy = false;
      npcCtl = null;
      $("npc-ask").disabled = false;
    });
  }

  function friendlyError(e) {
    var kind = (e && e.kind) || "unknown";
    var head = {
      auth: "密钥无效或权限不足。",
      ratelimit: "请求被限流或额度用尽。",
      notfound: "接口或模型名不存在。",
      badrequest: "请求参数被拒绝。",
      cors: "连不上目标地址（多为跨域拦截）。",
      timeout: "请求超时。",
      config: "还没配置好。",
      server: "上游服务出错。",
      parse: "返回内容无法解析。",
      aborted: "已停止。"
    }[kind] || "请求失败。";
    var tail = "";
    if (kind === "cors") tail = " 解法：运行本仓库的 ds-proxy.py，把 Base URL 改成 http://127.0.0.1:8787/v1。";
    if (kind === "auth") tail = " 去控制台重新生成一个 key。";
    if (kind === "config") tail = " 点「设置」补齐即可。";
    return head + " " + ((e && e.message) || "") + tail;
  }

  function stopNpc() {
    if (npcCtl) { npcCtl.abort(); toast("已停止"); }
    else toast("当前没有正在进行的回复");
  }

  function exportChat() {
    var c = $("npc-chat");
    if (!c || !c.children.length) { toast("还没有对话"); return; }
    var lines = ["# AI 学伴对话记录", "", "模式：" + NPC_MODES[npcMode].label + "　导出时间：" + new Date().toLocaleString(), ""];
    Array.prototype.forEach.call(c.children, function (d) {
      if (d.classList.contains("me")) lines.push("**我**：" + d.textContent, "");
      else if (d.classList.contains("ai")) lines.push("**学伴**：" + d.textContent, "");
      else if (d.classList.contains("sys")) lines.push("> " + d.textContent, "");
    });
    download("学伴对话-" + Date.now() + ".md", lines.join("\n"), "text/markdown;charset=utf-8");
  }

  /* 未接模型时的内置规则（兜底） */
  var JARGON_ALL = DATA.jargon || [];
  function askMode(v) {
    var j = JARGON_ALL.filter(function (w) { return v.indexOf(w) >= 0; });
    if (v.length < 40) return "就这么点？再讲细一点。讲不下去的地方，往往就是你没想清楚的地方。";
    if (j.length) return "你说到的「" + j[0] + "」是什么意思？换成大白话，或者举个你自己的例子。";
    if (!/比如|例如|举个例子|打个比方|像是|比如说/.test(v)) return "懂了点，但能给我一个具体例子吗？没有例子我很难确认你是不是真懂。";
    if (!/为什么|因为|所以|原因在于/.test(v)) return "那为什么呢？它成立的理由是什么，前提又是什么？";
    return "好像说通了。那我问最后一个：如果把这个条件反过来，结论还成立吗？";
  }
  function reviewMode(v) {
    var lines = [];
    if (v.length < 40) lines.push("长度偏短，细节不足。");
    var j = JARGON_ALL.filter(function (w) { return v.indexOf(w) >= 0; });
    if (j.length) lines.push("术语未落地：" + j.join("、") + "——先解释它们，再继续。");
    if (!/比如|例如|举个例子/.test(v)) lines.push("缺少具体例子。");
    if (!/\d/.test(v)) lines.push("没有数字：涉及效应量与参数时，请给出具体数值并注明来源。");
    if (curCtx && curCtx.keys) {
      var miss = curCtx.keys.filter(function (k) { return v.indexOf(k) < 0; });
      if (miss.length) lines.push("对照本题关键点，缺失：" + miss.join("、") + "。");
      else lines.push("本题关键点已覆盖。");
    }
    lines.push("记住：我给的反馈不算你的产出——合上这段，重写一遍才算完成。");
    return lines.join(" ");
  }

  /* ---------- 模型设置面板 ---------- */
  function renderCompanion() {
    renderPrompts();
    renderLLMPanel();
  }

  function renderLLMPanel() {
    var cfg = LLM.getCfg();
    var sel = $("llm-preset");
    sel.innerHTML = LLM.presetList().map(function (p) {
      return '<option value="' + p.id + '">' + esc(p.label) + "</option>";
    }).join("");
    sel.value = cfg.preset;

    $("llm-base").value = cfg.base || "";
    $("llm-key").value = cfg.key || "";
    $("llm-model").value = cfg.model || "";
    $("llm-temp").value = cfg.temperature;
    $("llm-temp-v").textContent = Number(cfg.temperature).toFixed(1);
    $("llm-maxtok").value = cfg.maxTokens || 4096;
    $("llm-timeout").value = cfg.timeout;
    $("llm-stream").checked = !!cfg.stream;
    $("llm-reason").checked = !!cfg.showReasoning;

    applyPresetNote(cfg.preset);
    refreshLLMStatus();
  }

  function applyPresetNote(id) {
    var p = LLM.preset(id);
    $("llm-preset-note").innerHTML = "<b>" + esc(p.label) + "</b>：" + esc(p.note || "");
    var dl = $("llm-modellist");
    dl.innerHTML = (p.models || []).map(function (m) { return '<option value="' + esc(m) + '">'; }).join("");
  }

  function readForm() {
    return {
      preset: $("llm-preset").value,
      base: $("llm-base").value.trim(),
      key: $("llm-key").value.trim(),
      model: $("llm-model").value.trim(),
      temperature: parseFloat($("llm-temp").value) || 0,
      maxTokens: Math.max(256, parseInt($("llm-maxtok").value, 10) || 4096),
      timeout: parseInt($("llm-timeout").value, 10) || 120,
      stream: $("llm-stream").checked,
      showReasoning: $("llm-reason").checked
    };
  }

  function refreshLLMStatus() {
    var el = $("llm-status");
    if (!el) return;
    if (LLM.ready()) { el.textContent = "已配置"; el.className = "pill ok"; }
    else { el.textContent = "缺 " + LLM.missing().join("、"); el.className = "pill warn"; }
    npcStatus();
  }

  function llmResult(msg, cls) {
    var el = $("llm-result");
    el.className = "llm-result " + (cls || "");
    el.innerHTML = msg;
    el.classList.remove("hidden");
  }

  function initLLMPanel() {
    $("llm-preset").onchange = function () {
      var id = $("llm-preset").value;
      var p = LLM.preset(id);
      if (p.base) $("llm-base").value = p.base;
      if (p.models && p.models.length) $("llm-model").value = p.models[0];
      applyPresetNote(id);
    };
    $("llm-temp").oninput = function () { $("llm-temp-v").textContent = Number($("llm-temp").value).toFixed(1); };
    $("llm-key-eye").onclick = function () {
      var k = $("llm-key");
      var show = k.type === "password";
      k.type = show ? "text" : "password";
      $("llm-key-eye").textContent = show ? "隐藏" : "显示";
    };
    $("llm-save").onclick = function () {
      LLM.setCfg(readForm());
      refreshLLMStatus();
      llmResult("设置已保存到本机浏览器（localStorage）。密钥只会在你发起对话时直接发往上面填的 Base URL。", "ok");
      toast("设置已保存");
    };
    $("llm-test").onclick = function () {
      LLM.setCfg(readForm());
      refreshLLMStatus();
      var btn = $("llm-test");
      btn.disabled = true;
      llmResult("正在连接 " + esc($("llm-base").value.trim()) + " …", "busy");
      LLM.test().then(function (r) {
        btn.disabled = false;
        if (r.ok) {
          var extra = r.usage && r.usage.total_tokens ? "（用量 " + r.usage.total_tokens + " tokens）" : "";
          llmResult("连接成功，用时 " + (r.ms / 1000).toFixed(2) + " 秒，模型「" + esc(r.model) + "」正常应答" + extra +
            "。<br>模型回：" + esc(r.reply || "(空)"), "ok");
        } else {
          llmResult("失败（" + esc(r.kind) + "）<br>" + esc(r.message) + "<br><br>" +
            (r.kind === "cors"
              ? "这是典型的浏览器跨域拦截。解法：在本机运行 <code>python3 ds-proxy.py --upstream " + esc(LLM.joinURL($("llm-base").value.trim(), "")) + " --key 你的key</code>，然后把 Base URL 改成 <code>http://127.0.0.1:8787/v1</code>，Key 留空。"
              : "检查 Base URL（末尾是否少 /v1）、Key 与模型名。可先用「拉取列表」确认服务端有哪些模型。"),
            "bad");
        }
      });
    };
    $("llm-fetch-models").onclick = function () {
      LLM.setCfg(readForm());
      var btn = $("llm-fetch-models");
      btn.disabled = true;
      llmResult("正在向 " + esc(LLM.joinURL($("llm-base").value.trim(), "/models")) + " 请求模型列表…", "busy");
      LLM.models().then(function (r) {
        btn.disabled = false;
        if (r.ok && r.models.length) {
          $("llm-modellist").innerHTML = r.models.map(function (m) { return '<option value="' + esc(m) + '">'; }).join("");
          llmResult("拉到 " + r.models.length + " 个模型，已填入候选列表（点模型名输入框会下拉）。<br>例如：" +
            r.models.slice(0, 8).map(esc).join("、"), "ok");
        } else if (r.ok) {
          llmResult("服务端返回成功，但没有模型条目。", "bad");
        } else {
          llmResult("拉取失败：" + esc(r.message) + "<br>部分服务不实现 /models，这不影响对话——手写模型名即可。", "bad");
        }
      });
    };
    $("llm-reset").onclick = function () {
      LLM.resetCfg();
      renderLLMPanel();
      llmResult("已恢复默认（DeepSeek 官方）。", "ok");
    };
    $("llm-clear").onclick = function () {
      LLM.setCfg({ key: "" });
      $("llm-key").value = "";
      refreshLLMStatus();
      llmResult("密钥已从本机浏览器清除。", "ok");
    };
    $("llm-proxy").onclick = function () {
      var body = window.__DS_PROXY_SRC__;
      if (body) {
        download("ds-proxy.py", body, "text/x-python;charset=utf-8");
        llmResult("已下载 ds-proxy.py。用法：<br><code>python3 ds-proxy.py --upstream https://api.deepseek.com --key sk-你的key</code><br>" +
          "然后把 Base URL 改成 <code>http://127.0.0.1:8787/v1</code>，Key 留空，模型名照旧。", "ok");
      } else {
        llmResult("代理脚本在项目目录 <code>road-to-reality/ds-proxy.py</code>；单文件版未内嵌源码，请从项目目录取用。", "busy");
      }
    };
  }

  /* ---------- 导出 ---------- */
  function download(name, content, type) {
    var blob = new Blob([content], { type: type || "text/plain;charset=utf-8" });
    var a = document.createElement("a");
    a.href = URL.createObjectURL(blob); a.download = name;
    document.body.appendChild(a); a.click();
    setTimeout(function () { URL.revokeObjectURL(a.href); document.body.removeChild(a); }, 100);
  }

  /* ---------- Toast ---------- */
  var toastTimer = null;
  function toast(msg) {
    var t = $("toast");
    if (!t) {
      t = document.createElement("div");
      t.id = "toast";
      t.style.cssText = "position:fixed;left:50%;bottom:80px;transform:translateX(-50%);background:#241a52;border:1px solid #3a2b7a;color:#ece9ff;padding:10px 16px;border-radius:10px;z-index:99;font-size:13px;max-width:80vw;text-align:center;box-shadow:0 8px 30px rgba(0,0,0,.5)";
      document.body.appendChild(t);
    }
    t.textContent = msg;
    t.style.display = "block";
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { t.style.display = "none"; }, 2600);
  }

  /* ---------- 划词快捷提问 ---------- */
  var SEL_TPLS = [
    { icon: "", label: "什么意思", q: "这段话在说什么？用大白话逐点解释，并点出其中的关键术语。" },
    { icon: "", label: "举个例子", q: "针对这段内容举一个贴近生活的具体例子，并说明例子和原文说法的对应关系。" },
    { icon: "", label: "前后关联", q: "这段内容和《通向实在之路》前面章节的哪些概念有关联？指出关联并简要说明。" },
    { icon: "", label: "为什么成立", q: "这段话里的结论为什么成立？给出理由或推导思路；如果只是陈述事实，请解释它的物理或数学依据。" },
    { icon: "", label: "考考我", q: "根据这段内容出 1 道简答题考我，先不要给答案；等我作答后你再判断对错并点评。" },
    { icon: "", label: "挑毛病", q: "这段话里有没有表述含糊、容易误解或值得商榷的地方？指出来并澄清。" }
  ];
  function curSelContext() {
    var ch = cur.stage && cur.stage.chapter;
    var parts = [];
    if (ch) parts.push("第 " + ch.n + " 章 · " + ch.title);
    if (curCtx && curCtx.h) parts.push(String(curCtx.h));
    return parts.join(" · ");
  }
  function hideSelMenu() {
    var m = document.getElementById("selmenu");
    if (m) m.classList.remove("on");
  }
  function quickAsk(selText, ti) {
    if (!selText) return;
    var ctxLine = curSelContext();
    var ctx = "【出处】我在《通向实在之路》精读中划选了这段文字" + (ctxLine ? "（" + ctxLine + "）" : "");
    setNpcMode("chat", true);   /* 快捷提问走「自由问答」：先给解释，结尾照样反问检验 */
    var inp = $("npc-input");
    if (!inp) return;
    if (ti >= 0) {
      inp.value = ctx + "\n\n【划选原文】\n" + selText + "\n\n【我的问题】" + SEL_TPLS[ti].q;
      $("npc").classList.add("open");
      askNpc();
    } else {
      /* 自定义：只把原文放好，让用户补自己的问题 */
      inp.value = ctx + "\n\n【划选原文】\n" + selText + "\n\n【我的问题】";
      $("npc").classList.add("open");
      inp.focus();
      inp.setSelectionRange(inp.value.length, inp.value.length);
      toast("划选原文已就位，补上你的问题再发送");
    }
  }
  function initSelMenu() {
    var m = document.createElement("div");
    m.id = "selmenu"; m.className = "selmenu";
    m.innerHTML = '<div class="selmenu-t">对划选的文字提问</div>' +
      SEL_TPLS.map(function (t, i) {
        return '<button class="selmenu-i" data-i="' + i + '">' + t.icon + " " + t.label + "</button>";
      }).join("") +
      '<button class="selmenu-i" data-i="-1">自定义提问</button>';
    document.body.appendChild(m);
    m.addEventListener("mousedown", function (e) { e.preventDefault(); });  /* 防点菜单丢选区 */
    m.addEventListener("click", function (e) {
      var b = e.target.closest(".selmenu-i");
      if (!b) return;
      var s = window.getSelection();
      var txt = s && !s.isCollapsed ? s.toString().trim() : "";
      m.classList.remove("on");
      quickAsk(txt, +b.dataset.i);
    });
    document.addEventListener("mouseup", function (e) {
      if (m.contains(e.target)) return;
      setTimeout(function () {
        var s = window.getSelection();
        var txt = s && !s.isCollapsed ? s.toString().trim() : "";
        if (!txt || txt.length < 2) { m.classList.remove("on"); return; }
        var node = s.anchorNode;
        var el = node ? (node.nodeType === 3 ? node.parentElement : node) : null;
        if (!el || !el.closest || !el.closest("#lv-stage")) { m.classList.remove("on"); return; }
        var r = s.getRangeAt(0).getBoundingClientRect();
        if (!r || (!r.width && !r.height)) { m.classList.remove("on"); return; }
        m.style.left = Math.max(8, Math.min(r.left, window.innerWidth - 220)) + "px";
        m.style.top = (r.bottom + window.scrollY + 8) + "px";
        m.classList.add("on");
      }, 10);
    });
    document.addEventListener("selectionchange", function () {
      var s = window.getSelection();
      if (!s || s.isCollapsed || !s.toString().trim()) m.classList.remove("on");
    });
    document.addEventListener("scroll", function () { m.classList.remove("on"); }, true);
    document.addEventListener("keydown", function (e) { if (e.key === "Escape") m.classList.remove("on"); });
  }

  /* ---------- 阅读模式（大字号排版，持久化） ---------- */
  var READ_KEY = "rtr_readmode_v1";
  function applyReadMode() {
    var on = false;
    try { on = localStorage.getItem(READ_KEY) === "1"; } catch (e) {}
    document.body.classList.toggle("readmode", on);
    var b = $("readmode-toggle");
    if (b) b.textContent = on ? "阅读模式：开" : "阅读模式：关";
  }
  function bindReadMode() {
    var b = $("readmode-toggle");
    if (!b) return;
    applyReadMode();
    b.onclick = function () {
      var on = !document.body.classList.contains("readmode");
      try { localStorage.setItem(READ_KEY, on ? "1" : "0"); } catch (e) {}
      applyReadMode();
      /* 阅读模式把正文放大，之前收过的超宽公式要按新宽度重算 */
      fitWideMath($("lv-stage"));
      toast(on ? "阅读模式已开：大字号、宽行距，重按可切回" : "已切回标准排版");
    };
  }

  /* ---------- 启动 ---------- */
  function init() {
    S = Engine.load();
    Engine.touchDay();
    S = Engine.state();
    renderHud();
    bindRecall();
    initLLMPanel();
    initNpc();
    initSelMenu();
    bindReadMode();
    initScrub();
    document.querySelectorAll(".tab").forEach(function (t) {
      t.onclick = function () { showView(t.dataset.view); };
    });
    $("level-back").onclick = function () { showView("map"); };
    $("exp-csv").onclick = function () { download("learn_os_anki.csv", Engine.exportCsv(), "text/csv;charset=utf-8"); };
    $("exp-json").onclick = function () { download("learn_os_log.json", Engine.exportJson(), "application/json"); };
    $("exp-reset").onclick = function () {
      if (confirm("确定清空全部进度？此操作不可撤销。")) { Engine.reset(); S = Engine.state(); renderHud(); renderWall(); }
    };
    showView("map");
    /* 地图瀑布流靠实测高度：换宽度、字体回来后行高变化，都得重算一次 */
    var mapRt = null;
    window.addEventListener("resize", function () {
      clearTimeout(mapRt);
      mapRt = setTimeout(function () { layoutMap(); fitWideMath($("lv-stage")); }, 160);
    });
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(function () { layoutMap(); });
    }
    /* 不再在地图上预取 2MB 楷体：它一开工就把带宽占住，正文反而要排队。
       现在字体是在「正文到位之后」才开始取（见 lazy.js ensureLevel）。 */
  }

  return {
    init: init, toast: toast, showView: showView,
    _debug: { npcSysPrompt: npcSysPrompt, npcContext: npcContext, setNpcMode: setNpcMode }
  };
})();

document.addEventListener("DOMContentLoaded", App.init);