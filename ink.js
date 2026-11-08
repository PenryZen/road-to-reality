/* ============================================================
   ink.js —— 手写批注层（Wacom / 触控笔 / 鼠标）
   ------------------------------------------------------------
   坐标方案（v2，2026-11 重做）
   笔迹不再按「页宽/页高」归一化——那是错的：正文一重排，
   页高就变，整页墨迹被纵向拉长或压扁，字和墨对不上。

   现在每一笔被切成若干「段」，每段钉在一个**锚点**上：
     · t 锚：某个文字节点 + 第几个字（caret 位置）。改窗口宽、
            字体迟到、公式重排，墨迹跟着那个字走。
     · e 锚：某个元素 + 归一化偏移。盖在插图、图盒、交互图上时用。
     · s 锚：整页归一化兜底（旧数据 / 页面上什么都没有时）。
   段内各点存「相对锚点原点的像素偏移」，所以锚点一动，整段平移。

   其余设计不变：
   1. 浏览器里 Wacom 就是标准 pointer，事件里直接带 pressure / tilt。
   2. 存 IndexedDB（localStorage 5MB 撑不住几十页涂画）。
   3. 关闭时 canvas 是 pointer-events:none，不拦选择文字与拖滑轨。
   ============================================================ */
(function (root) {
  "use strict";

  var DB_NAME = "rtr-ink", DB_VER = 1, STORE = "pages";
  var REF_W = 780;               /* 线宽按 780px 栏宽定标 */
  var RE_X = 110, RE_Y = 46;     /* 离锚点太远就换锚，别让一段跨半个屏幕 */
  var JUMP = 48;                 /* 相邻点跳这么远 = 版面变了，断开笔画 */
  var JUMP_C = 200;              /* 换锚造成的接缝：位置本该连着，放宽 */

  var db = null, dbReady = null;
  var state = {
    on: false, tool: "p", color: "#3ee8f0", scale: 1,
    stage: null, key: "", canvas: null, ctx: null,
    strokes: [], redo: [], drawing: null,
    W: 0, H: 0, dpr: 1, ver: 0, ro: null, raf: 0, saveTimer: 0
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

  /* ---------- 锚点：DOM 路径（跳过画笔层本身，路径才不会被画布挤歪） ---------- */
  function isInk(n) { return n.nodeType === 1 && n.id === "ink-layer"; }
  function childAt(p, i) {
    var k = 0;
    for (var c = p.firstChild; c; c = c.nextSibling) {
      if (isInk(c)) continue;
      if (k === i) return c;
      k++;
    }
    return null;
  }
  function pathOf(node) {
    var out = [], n = node, rootEl = state.stage;
    while (n && n !== rootEl) {
      var par = n.parentNode;
      if (!par) return null;
      var k = 0, hit = -1;
      for (var c = par.firstChild; c; c = c.nextSibling) {
        if (isInk(c)) continue;
        if (c === n) { hit = k; break; }
        k++;
      }
      if (hit < 0) return null;
      out.unshift(hit);
      n = par;
    }
    return n === rootEl ? out : null;
  }
  function nodeAt(path) {
    var n = state.stage;
    for (var i = 0; i < path.length && n; i++) n = childAt(n, path[i]);
    return n || null;
  }

  /* 命中测试：先问「光标下是哪个字」，问不到再退到元素 */
  function caretAt(x, y) {
    if (document.caretRangeFromPoint) {
      var r = document.caretRangeFromPoint(x, y);
      return r && r.startContainer ? r : null;
    }
    if (document.caretPositionFromPoint) {
      var p = document.caretPositionFromPoint(x, y);
      if (!p) return null;
      var rg = document.createRange();
      rg.setStart(p.offsetNode, p.offset);
      rg.collapse(true);
      return rg;
    }
    return null;
  }

  /* 块内字符偏移：比「第几个子节点」稳——KaTeX 重排、span 被替换都不影响。
     块取到段落级：行内包裹（span/em/strong…）继续往上找，别把锚点钉在碎元素上 */
  var INLINE = /^(SPAN|EM|STRONG|B|I|U|S|SMALL|CODE|A|SUP|SUB|MARK|BDI|FONT|VAR|KBD|SAMP|ABBR|Q|CITE|TIME)$/;
  function blockOf(node) {
    var e = node.parentNode;
    while (e && e.nodeType !== 1) e = e.parentNode;
    while (e && e.parentNode && e.parentNode.nodeType === 1 && INLINE.test(e.nodeName)) e = e.parentNode;
    return e && state.stage && state.stage.contains(e) ? e : null;
  }
  function textWalker(block) {
    return document.createTreeWalker(block, NodeFilter.SHOW_TEXT, null);
  }
  function charOffsetIn(block, node, off) {
    var w = textWalker(block), n, acc = 0;
    while ((n = w.nextNode())) {
      if (n === node) return acc + off;
      acc += (n.nodeValue || "").length;
    }
    return -1;
  }
  function textNodeAt(block, idx) {
    var w = textWalker(block), n, acc = 0, L;
    while ((n = w.nextNode())) {
      L = (n.nodeValue || "").length;
      if (idx <= acc + L) return { node: n, off: idx - acc };
      acc += L;
    }
    return null;
  }
  function fingerprint(n) {
    var s = (n.textContent || "").replace(/\s+/g, " ").trim();
    return s ? s.slice(0, 12) : "";
  }
  function blockNode(a) {
    var n = nodeAt(a.n || []);
    if (n && n.nodeType === 1) {
      if (!a.g || n.nodeName === a.g) {
        if (!a.x || (n.textContent || "").indexOf(a.x) >= 0) return n;
      }
    }
    /* 路径和指纹都对不上（页面被重建 / 节点被插入）→ 按「标签 + 文本指纹 +
       长度最接近」把块找回来。只按 indexOf 会先命中外层容器，墨迹就整段跑偏。 */
    if (a.g && a.x) {
      var cand = state.stage.querySelectorAll(a.g), i, t, best = null, bd = 1e9, d;
      for (i = 0; i < cand.length; i++) {
        t = cand[i].textContent || "";
        if (t.indexOf(a.x) < 0) continue;
        d = a.len ? Math.abs(t.length - a.len) : 0;
        if (d < bd) { bd = d; best = cand[i]; }
      }
      if (best && bd <= Math.max(6, (a.len || 1) * 0.25)) return best;
    }
    return null;
  }

  function anchorAt(x, y) {
    if (!state.stage) return null;
    var c = state.canvas, prev = c.style.pointerEvents;
    var el = null, rng = null;
    c.style.pointerEvents = "none";                 /* 让 elementFromPoint 穿过画布 */
    try {
      rng = caretAt(x, y);
      el = document.elementFromPoint(x, y);
    } finally {
      c.style.pointerEvents = prev;
    }
    /* 文字锚：钉到「哪个块 + 块内第几个字」。caretRangeFromPoint 在图片附近会
       跳到很远的文字上，那种锚点指不住，所以要求离光标不远 */
    if (rng && rng.startContainer && rng.startContainer.nodeType === 3 &&
        state.stage.contains(rng.startContainer)) {
      var tc = rng.getBoundingClientRect();
      if (tc && (Math.abs(tc.left - x) < 200 && Math.abs(tc.top - y) < 120)) {
        var bk = blockOf(rng.startContainer);
        if (bk) {
          var off = charOffsetIn(bk, rng.startContainer, rng.startOffset);
          var br = bk.getBoundingClientRect();
          if (off >= 0 && br.width && br.height) {
            return {
              k: "t", n: pathOf(bk), o: off, len: (bk.textContent || "").length,
              g: bk.nodeName, x: fingerprint(bk),
              u: Math.round(Math.max(0, Math.min(1, (x - br.left) / br.width)) * 1e3) / 1e3,
              v: Math.round(Math.max(0, Math.min(1, (y - br.top) / br.height)) * 1e3) / 1e3
            };
          }
        }
      }
    }
    if (el && el !== c && state.stage.contains(el)) {
      var r = el.getBoundingClientRect();
      var ep = pathOf(el);
      if (ep && r.width && r.height) {
        return { k: "e", n: ep, g: el.nodeName, x: fingerprint(el),
                 u: Math.round((x - r.left) / r.width * 1e3) / 1e3,
                 v: Math.round((y - r.top) / r.height * 1e3) / 1e3 };
      }
    }
    return null;
  }

  /* 锚点 → 原点（client 坐标） */
  function anchorOrigin(a) {
    if (!a) return null;
    if (a.k === "s") return { x: a.u * state.W, y: a.v * state.H };
    var n = blockNode(a);
    if (!n) return null;

    if (a.k === "t") {
      /* 文字没被改过 → 精确到字；被改过（懒加载公式重排）→ 退回块内比例位置 */
      if ((n.textContent || "").length === a.len) {
        var t = textNodeAt(n, a.o | 0);
        if (t) {
          var len = (t.node.nodeValue || "").length;
          var rg = document.createRange();
          rg.setStart(t.node, t.off);
          rg.setEnd(t.node, Math.min(len, t.off + 1));
          var rc = rg.getBoundingClientRect();
          if (rc && (rc.width || rc.height)) return { x: rc.left, y: rc.top };
        }
      }
      var br = n.getBoundingClientRect();
      if (br.width && br.height) return { x: br.left + a.u * br.width, y: br.top + a.v * br.height };
      return null;
    }

    var er = n.getBoundingClientRect();
    if (!er.width || !er.height) return null;
    return { x: er.left + a.u * er.width, y: er.top + a.v * er.height };
  }

  /* 段原点（舞台局部坐标，跟滚动无关；布局一变 ver++ 就重算） */
  function segOrigin(g, sr) {
    if (g._v === state.ver && g._o !== undefined) return g._o;
    var c = anchorOrigin(g.a);
    g._v = state.ver;
    g._o = c ? { x: c.x - sr.left, y: c.y - sr.top } : null;
    return g._o;
  }

  /* ---------- 几何：Catmull-Rom 平滑 + 变宽描边 ---------- */
  function smoothPx(pts, step) {
    if (pts.length < 2) return pts.slice();
    var out = [], i, k, t, t2, t3, a, b, c, d, n, dd;
    for (i = 0; i < pts.length - 1; i++) {
      a = pts[i > 0 ? i - 1 : 0];
      b = pts[i];
      c = pts[i + 1];
      d = pts[i + 2 < pts.length ? i + 2 : pts.length - 1];
      dd = Math.sqrt((c.x - b.x) * (c.x - b.x) + (c.y - b.y) * (c.y - b.y));
      n = Math.max(2, Math.min(20, Math.round(dd / step)));
      for (k = 0; k < n; k++) {
        t = k / n; t2 = t * t; t3 = t2 * t;
        out.push({
          x: 0.5 * ((2 * b.x) + (-a.x + c.x) * t + (2 * a.x - 5 * b.x + 4 * c.x - d.x) * t2 + (-a.x + 3 * b.x - 3 * c.x + d.x) * t3),
          y: 0.5 * ((2 * b.y) + (-a.y + c.y) * t + (2 * a.y - 5 * b.y + 4 * c.y - d.y) * t2 + (-a.y + 3 * b.y - 3 * c.y + d.y) * t3),
          p: b.p + (c.p - b.p) * t
        });
      }
    }
    out.push(pts[pts.length - 1]);
    return out;
  }

  function strokePath(ctx, pts, base) {
    var sm = smoothPx(pts, 1.6);
    if (!sm.length) return;
    if (sm.length === 1) {
      ctx.beginPath();
      ctx.arc(sm[0].x, sm[0].y, Math.max(0.6, base / 2), 0, 6.2832);
      ctx.fill();
      return;
    }
    var i, n, x1, y1, dx, dy, len, nx, ny, w;
    var L = [], R = [], prev, next;
    for (i = 0; i < sm.length; i++) {
      n = sm[i];
      prev = sm[i > 0 ? i - 1 : 0];
      next = sm[i + 1 < sm.length ? i + 1 : sm.length - 1];
      dx = next.x - prev.x; dy = next.y - prev.y;
      len = Math.sqrt(dx * dx + dy * dy) || 1;
      nx = -dy / len; ny = dx / len;
      w = base * (0.22 + 0.78 * (n.p === undefined ? 0.5 : n.p)) / 2;
      L.push([n.x + nx * w, n.y + ny * w]);
      R.push([n.x - nx * w, n.y - ny * w]);
    }
    ctx.beginPath();
    ctx.moveTo(L[0][0], L[0][1]);
    for (i = 1; i < L.length; i++) ctx.lineTo(L[i][0], L[i][1]);
    for (i = R.length - 1; i >= 0; i--) ctx.lineTo(R[i][0], R[i][1]);
    ctx.closePath();
    ctx.fill();
  }

  /* 把一笔的所有段摊成若干条折线（换锚/换行处断开） */
  function strokeGroups(s, sr) {
    var groups = [], cur = null, last = null, i, j, g, o, pt;
    for (i = 0; i < s.seg.length; i++) {
      g = s.seg[i];
      o = segOrigin(g, sr);
      if (!o) { cur = null; continue; }
      for (j = 0; j < g.p.length; j += 3) {
        pt = { x: o.x + g.p[j], y: o.y + g.p[j + 1], p: g.p[j + 2] };
        var lim = g.c ? JUMP_C : JUMP;
        if (last && (Math.abs(pt.x - last.x) > lim || Math.abs(pt.y - last.y) > lim)) cur = null;
        if (!cur) { cur = []; groups.push(cur); }
        cur.push(pt);
        last = pt;
      }
    }
    return groups;
  }

  function render() {
    var c = state.canvas, ctx = state.ctx;
    if (!c || !ctx) return;
    var sr = state.stage.getBoundingClientRect();
    var cr = c.getBoundingClientRect();
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, c.width, c.height);
    ctx.setTransform(state.dpr, 0, 0, state.dpr, 0, 0);
    ctx.translate(sr.left - cr.left, sr.top - cr.top);   /* 之后一律用舞台局部坐标 */
    var all = state.strokes.concat(state.drawing ? [state.drawing] : []);
    for (var i = 0; i < all.length; i++) {
      var s = all[i];
      if (!s.seg || !s.seg.length) continue;
      var base = s.w * (state.W / REF_W);
      var gs = strokeGroups(s, sr);
      ctx.save();
      if (s.t === "e") { ctx.globalCompositeOperation = "destination-out"; ctx.fillStyle = "#000"; }
      else {
        ctx.globalCompositeOperation = "source-over";
        ctx.fillStyle = s.c;
        ctx.globalAlpha = s.t === "h" ? 0.26 : 1;
      }
      for (var k = 0; k < gs.length; k++) strokePath(ctx, gs[k], base);
      ctx.restore();
    }
    ctx.setTransform(1, 0, 0, 1, 0, 0);
  }

  /* ---------- 尺寸 ---------- */
  function bump() { state.ver = (state.ver | 0) + 1; }

  function resize() {
    var st = state.stage, c = state.canvas;
    if (!st || !c) return;
    var W = st.clientWidth;
    if (!W) return;
    /* 画布自己是 stage 的绝对定位子元素，会把 stage 的 scrollHeight 撑大——
       不先摘掉它，高度只会越长越高（旧版就是这么把墨迹越推越远的）。 */
    var seenH = null, mk = c.style.display;
    if (mk !== "none") { c.style.display = "none"; seenH = 1; }
    var H = Math.max(st.scrollHeight, st.offsetHeight);
    if (seenH) c.style.display = mk;
    if (!H) return;
    var dpr = Math.min(root.devicePixelRatio || 1, 2);
    if (W !== state.W || H !== state.H || dpr !== state.dpr) {
      state.W = W; state.H = H; state.dpr = dpr;
      c.width = Math.round(W * dpr); c.height = Math.round(H * dpr);
      c.style.width = W + "px"; c.style.height = H + "px";
      bump();
    }
    render();
    /* 布局刚变时 scrollHeight 可能还是旧的，下一帧再核一次 */
    if (!state.raf) {
      state.raf = root.requestAnimationFrame(function () {
        state.raf = 0;
        var st2 = state.stage, c2 = state.canvas;
        if (!st2 || !c2) return;
        var mk2 = c2.style.display, H2;
        c2.style.display = "none";
        H2 = Math.max(st2.scrollHeight, st2.offsetHeight);
        c2.style.display = mk2;
        if (st2.clientWidth && H2 && (st2.clientWidth !== state.W || H2 !== state.H)) resize();
      });
    }
  }

  /* ---------- 存取 ---------- */
  function pack() {
    return { v: 2, strokes: state.strokes.map(function (s) {
      return { t: s.t, c: s.c, w: s.w, seg: s.seg.map(function (g) {
        var p = [], i;
        for (i = 0; i < g.p.length; i++) p.push(Math.round(g.p[i] * 10) / 10);
        var o = { a: g.a, p: p };
        if (g.c) o.c = 1;
        return o;
      }) };
    }) };
  }

  function unpack(o) {
    if (!o || !o.strokes) return [];
    if (!state.W || !state.H) return [];     /* 没排版就没有坐标基准，宁可不画 */
    var out = [];
    for (var i = 0; i < o.strokes.length; i++) {
      var s = o.strokes[i];
      if (s.seg) { out.push({ t: s.t, c: s.c, w: s.w, seg: s.seg }); continue; }
      /* v1：归一化坐标。先转成 s 锚（页归一化），再由 upgrade() 尽量升成文字锚 */
      if (!s.pts || s.pts.length < 3) continue;
      var x0 = s.pts[0], y0 = s.pts[1];
      var g2 = { a: { k: "s", u: x0, v: y0 }, p: [] };
      for (var j = 0; j + 2 < s.pts.length; j += 3) {
        g2.p.push((s.pts[j] - x0) * state.W, (s.pts[j + 1] - y0) * state.H, s.pts[j + 2]);
      }
      out.push({ t: s.t, c: s.c, w: s.w, seg: [g2], _legacy: true });
    }
    return out;
  }

  /* 旧数据兜底升级：把整笔按当前版面重新钉到它盖住的文字上，之后就不再漂 */
  function upgrade(list) {
    if (!state.W || !state.canvas) return false;
    var sr = state.stage.getBoundingClientRect(), done = 0;
    for (var i = 0; i < list.length; i++) {
      var s = list[i];
      if (!s._legacy) continue;
      delete s._legacy;
      var g = s.seg[0];
      var o = { x: sr.left + g.a.u * state.W, y: sr.top + g.a.v * state.H };
      var a = anchorAt(o.x, o.y), ao = a && anchorOrigin(a);
      if (!a || !ao) continue;
      var ddx = o.x - ao.x, ddy = o.y - ao.y;
      for (var j = 0; j < g.p.length; j += 3) { g.p[j] += ddx; g.p[j + 1] += ddy; }
      g.a = a;
      delete g._o; delete g._v;
      done++;
    }
    return done > 0;
  }

  function save() {
    if (!state.key) return;
    clearTimeout(state.saveTimer);
    state.saveTimer = setTimeout(function () { idbPut(state.key, pack()); }, 320);
  }
  function saveNow() {
    if (!state.key) return;
    clearTimeout(state.saveTimer);
    idbPut(state.key, pack());
  }

  /* ---------- 绘制交互 ---------- */
  function press(e) {
    /* 只有真正的笔才信 pressure；鼠标/手指恒为 0.5，否则线会抖 */
    if (e.pointerType === "pen" && e.pressure > 0) return e.pressure;
    return 0.5;
  }

  function begin(e) {
    if (!state.on || e.button > 0) return;
    e.preventDefault();
    try { state.canvas.setPointerCapture && state.canvas.setPointerCapture(e.pointerId); } catch (err) {}
    var x = e.clientX, y = e.clientY;
    var a = anchorAt(x, y), o = a && anchorOrigin(a);
    if (!a || !o) {
      a = { k: "s", u: x / Math.max(1, state.W), v: y / Math.max(1, state.H) };
      o = { x: x, y: y };
    }
    var g = { a: a, p: [x - o.x, y - o.y, press(e)], _live: o };
    state.drawing = { t: state.tool, c: state.color, w: widthFor(), seg: [g] };
    render();
  }

  function move(e) {
    if (!state.drawing) return;
    e.preventDefault();
    /* getCoalescedEvents 在部分环境（合成事件 / 旧版 WebKit）返回空数组 */
    var evs = e.getCoalescedEvents ? e.getCoalescedEvents() : null;
    if (!evs || !evs.length) evs = [e];
    var d = state.drawing, i, g, o, dx, dy, lx, ly, na, no, px, py;
    for (i = 0; i < evs.length; i++) {
      px = evs[i].clientX; py = evs[i].clientY;
      g = d.seg[d.seg.length - 1];
      o = g._live;
      dx = px - o.x; dy = py - o.y;
      if (g.p.length >= 3) {
        lx = g.p[g.p.length - 3]; ly = g.p[g.p.length - 2];
        if (Math.abs(dx - lx) < 0.9 && Math.abs(dy - ly) < 0.9) continue;    /* 抽稀 */
      }
      /* 走远了就换锚：让每一段都贴近自己盖住的那行字 */
      if (Math.abs(dx) > RE_X || Math.abs(dy) > RE_Y) {
        na = anchorAt(px, py);
        no = na && anchorOrigin(na);
        if (na && no) {
          d.seg.push({ a: na, c: 1, p: [px - no.x, py - no.y, press(evs[i])], _live: no });
          continue;
        }
      }
      g.p.push(dx, dy, press(evs[i]));
    }
    render();
  }

  function end(e) {
    if (!state.drawing) return;
    e && e.preventDefault && e.preventDefault();
    var s = state.drawing;
    state.drawing = null;
    if (s.seg.length && s.seg.some(function (g) { return g.p.length >= 3; })) {
      s.seg.forEach(function (g) { delete g._live; });
      state.strokes.push(s);
      state.redo.length = 0;
      save();
      render();
      syncTools();
    } else { render(); }
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
    var changed = state.key !== key;
    if (changed) {
      saveNow();                       /* 上一页没落盘的先存 */
      state.key = key;
      state.strokes = []; state.redo.length = 0; state.drawing = null;
      bump();
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
      if (!state.ro) state.ro = new ResizeObserver(function () { resize(); });
      state.ro.disconnect();
      state.ro.observe(stageEl);      /* 页高随插图/公式/折叠变化时自己跟上 */
    }
    bump();      /* 每次挂载都是新 DOM（renderStage 重建），缓存的锚点位置必须作废 */
    resize();
    if (changed && key) {
      var k = key;
      idbGet(k).then(function (o) {
        if (state.key !== k) return;
        state.strokes = unpack(o);
        bump();
        if (upgrade(state.strokes)) save();      /* 旧数据换成文字锚，一劳永逸 */
        render();
        syncTools();
      });
    }
    setTimeout(resize, 260);          /* 图片/公式晚到时页高会变，追两次 */
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
    setOn: setOn,
    invalidate: function () { bump(); render(); },
    _dbg: function () { return state; }
  };
})(window);
