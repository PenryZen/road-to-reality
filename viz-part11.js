/* ============================================================
   viz-part11.js — 第三批挂载式小图（ch13–ch16，每章 4 张）
   挂载图规格见 FIG-SPEC3.md：title 为空、H∈[220,320]、嵌在步骤下方
   ============================================================ */
VZ.define({

/* ----------------------------------------------------------
   f-ch13d · 结合律成立，交换律不保证（挂：术语：群）
   ---------------------------------------------------------- */
"f-ch13d": {
  title: "",
  hint: "选一个动作 A，看三条动作用的两种算法：(AB)C 与 A(BC) 最后落在<b>同一个</b>正方形（结合律）；再看右边，AB 与 BA 落在<b>不同</b>的正方形上——群不承诺交换律。",
  draw: function (stage) {
    var W = 760, H = 290, svg = VZ.S(stage, W, H, { grid: true });
    var C = VZ.C;
    /* D4 元素用 2×2 正交矩阵表示；op 作用：M' = op·M */
    var ROT = [[0, -1], [1, 0]], FLIP = [[-1, 0], [0, 1]];
    function mm(A, B) {
      var R = [[0, 0], [0, 0]];
      for (var i = 0; i < 2; i++) for (var j = 0; j < 2; j++)
        R[i][j] = A[i][0] * B[0][j] + A[i][1] * B[1][j];
      return R;
    }
    function applyOp(M, op) { return mm(op, M); }

    var S = 58;
    function cell(cx, cy, M, ring) {
      var gg = VZ.g(svg, {});
      VZ.el("rect", { x: cx - S / 2, y: cy - S / 2, width: S, height: S, rx: 6,
        fill: "rgba(79,227,240,.05)", stroke: ring || C.ink2, "stroke-width": 1.6 }, gg);
      var a = M[0][0], b = M[1][0], c = M[0][1], d = M[1][1];
      var tg = VZ.g(gg, { transform: "matrix(" + a + " " + b + " " + c + " " + d + " " + cx + " " + cy + ")" });
      VZ.txt(tg, -S / 2 + 20, -S / 2 + 24, "L", { size: 22, fill: C.gold, weight: 700, anchor: "middle" });
      VZ.circ(tg, -S / 2 + 10, -S / 2 + 10, 3.4, { fill: C.cyan });
      return gg;
    }
    function arrow(x1, y, x2, label, lc) {
      VZ.ln(svg, x1, y, x2, y, VZ.stroke({ stroke: lc || C.dim, "stroke-width": 1.4, "marker-end": AR }));
      VZ.txt(svg, (x1 + x2) / 2, y - 9, label, { size: 12.5, fill: lc || C.ink, anchor: "middle", weight: 700 });
    }
    var AR = VZ.arrowDef(svg, VZ.uid("ar"), C.dim);

    VZ.txt(svg, 40, 36, "结合律：先算哪个括号，结果相同", { size: 13.5, fill: C.ink, weight: 700 });
    VZ.txt(svg, 478, 36, "交换律？群不保证", { size: 13.5, fill: C.ink, weight: 700 });

    var laneY = 108;
    var cs = [];
    /* 左车道四个格子：恒等 → A → AB → ABC */
    var xs = [72, 182, 292, 402];
    var gap = 110;
    /* 右车道：AB 与 BA */
    var rx = [560, 680];

    var chipsRow = VZ.box(stage, "viz-chips");
    var curA = "A=旋转90°";
    function ops() {
      var A = curA.indexOf("旋转") >= 0 ? ROT : FLIP;
      var B = A === ROT ? FLIP : ROT;
      return [A, B, ROT];
    }
    function redraw() {
      cs.forEach(function (x) { x.remove(); });
      cs = [];
      var O = ops(), A = O[0], B = O[1], Cc = O[2];
      var I = [[1, 0], [0, 1]];
      var M0 = I, M1 = applyOp(M0, A), M2 = applyOp(M1, B), M3 = applyOp(M2, Cc);
      cs.push(cell(xs[0], laneY, M0));
      cs.push(cell(xs[1], laneY, M1));
      cs.push(cell(xs[2], laneY, M2));
      cs.push(cell(xs[3], laneY, M3, C.green));
      arrow(xs[0] + S / 2 + 6, laneY, xs[1] - S / 2 - 8, "A");
      arrow(xs[1] + S / 2 + 6, laneY, xs[2] - S / 2 - 8, "B");
      arrow(xs[2] + S / 2 + 6, laneY, xs[3] - S / 2 - 8, "C");
      VZ.txt(svg, (xs[1] + xs[2]) / 2, laneY + S / 2 + 24, "(AB) 先算 → 再 C", { size: 11.5, fill: C.dim, anchor: "middle" });
      VZ.txt(svg, (xs[1] + xs[2]) / 2, laneY + S / 2 + 42, "A → 再算 (BC)", { size: 11.5, fill: C.dim, anchor: "middle" });
      VZ.txt(svg, 237, laneY - S / 2 - 14, "✓ (AB)C = A(BC)　对一切 A、B、C 成立", { size: 12.5, fill: C.green, anchor: "middle", weight: 700 });

      var AB = applyOp(applyOp(I, A), B), BA = applyOp(applyOp(I, B), A);
      cs.push(cell(rx[0], laneY, AB, C.red));
      cs.push(cell(rx[1], laneY, BA, C.red));
      VZ.txt(svg, rx[0], laneY + S / 2 + 24, "AB", { size: 12.5, fill: C.red, anchor: "middle", weight: 700 });
      VZ.txt(svg, rx[1], laneY + S / 2 + 24, "BA", { size: 12.5, fill: C.red, anchor: "middle", weight: 700 });
      VZ.txt(svg, (rx[0] + rx[1]) / 2, laneY, "≠", { size: 22, fill: C.red, anchor: "middle", weight: 700 });
      VZ.txt(svg, (rx[0] + rx[1]) / 2, laneY + S / 2 + 42, "（此例中差 90°）", { size: 11.5, fill: C.dim, anchor: "middle" });

      /* 逐格浮现 */
      cs.forEach(function (x, i) {
        x.style.opacity = 0;
        x.style.transition = "opacity .3s ease " + (i * 55) + "ms";
        requestAnimationFrame(function () { requestAnimationFrame(function () { x.style.opacity = 1; }); });
      });
    }
    VZ.chips(chipsRow, ["A=旋转90°", "A=翻转"], curA, function (m) { curA = m; redraw(); });
    redraw();
  }
},

/* ----------------------------------------------------------
   f-ch13e · 正多边形的对称群 Dn（挂：13.1 从一个正方形开始）
   ---------------------------------------------------------- */
"f-ch13e": {
  title: "",
  hint: "选一个正多边形，点「旋转一格」或「镜像翻转」：每按一次，多边形都<b>与自己重合</b>——这些动作就是它的对称群 Dₙ，共 2n 个。顶点字母换了位置，但整个图形分毫不差。",
  draw: function (stage) {
    var W = 760, H = 300, svg = VZ.S(stage, W, H);
    var C = VZ.C;
    var cx = 205, cy = 155, R = 92;
    var names = { 3: "正三角形", 4: "正方形", 5: "正五边形" };
    var N = 4, theta = 0, flip = 1;
    var pg = VZ.g(svg, {});
    var lbl = ["A", "B", "C", "D", "E", "F"];

    function renderPoly() {
      pg.innerHTML = "";
      var th = theta * Math.PI / 180, c = Math.cos(th), sn = Math.sin(th);
      function T(v) { /* 旋转 + 镜像（绝对坐标） */
        return [cx + flip * c * v[0] - sn * v[1], cy + flip * sn * v[0] + c * v[1]];
      }
      var vs = [];
      for (var i = 0; i < N; i++) {
        var a = -Math.PI / 2 + i * 2 * Math.PI / N;
        vs.push([R * Math.cos(a), R * Math.sin(a)]);
      }
      var pts = vs.map(T);
      VZ.poly(pg, pts, VZ.stroke({ stroke: C.ink, "stroke-width": 2, close: true, fill: "rgba(79,227,240,.07)" }));
      for (var j = 0; j < N; j++) {
        VZ.circ(pg, pts[j][0], pts[j][1], 4, { fill: C.cyan });
        var lx = cx + (pts[j][0] - cx) * 1.24, ly = cy + (pts[j][1] - cy) * 1.24;
        VZ.txt(pg, lx, ly + 4, lbl[j], { size: 12, fill: C.gold, anchor: "middle", weight: 700 });
      }
      /* 手性标记「L」：镜像后会左右翻转（绝对坐标画） */
      var Lpts = [[0, 0], [0, 26], [0, 15], [13, 15], [13, 0]].map(function (v) {
        return T([v[0] - 6.5, -v[1] + 13]);
      });
      VZ.poly(pg, Lpts, VZ.stroke({ stroke: C.mag, "stroke-width": 2.2 }));
    }
    renderPoly();
    VZ.circ(svg, cx, cy, R + 26, { stroke: C.faint, "stroke-width": .9, "stroke-dasharray": "4 5" });

    /* 右侧信息卡 */
    VZ.card(svg, 400, 42, 330, 216, { stroke: C.faint });
    var t1 = VZ.txt(svg, 424, 76, "正方形的对称群 D₄", { size: 15, fill: C.cyan, weight: 700 });
    var info = VZ.g(svg);
    function setInfo(n) {
      var sub = n === 3 ? "₃" : n === 4 ? "₄" : "₅";
      t1.textContent = names[n] + " 的对称群 D" + sub;
      info.innerHTML = "";
      VZ.para(info, 424, 106, "旋转 " + n + " 个：转 0°、360°/" + n + "、… 都回到自己", { size: 12.5, per: 24 });
      VZ.para(info, 424, 134, "翻转 " + n + " 个：沿每条对称轴做镜像", { size: 12.5, per: 24 });
      VZ.txt(info, 424, 172, "共 2 × " + n + " = " + 2 * n + " 个动作", { size: 14, fill: C.gold, weight: 700 });
      VZ.para(info, 424, 200, "每个动作都把多边形变回自己，只是顶点换了座位——「不变」的是整个图形。", { size: 12, per: 24, fill: C.dim });
    }
    setInfo(4);

    /* 动画补间 */
    var anim = null;
    function tween(toTheta, toFlip) {
      if (anim) return;
      var t0 = theta, f0 = flip, start = performance.now();
      anim = VZ.raf(svg, function () {
        var u = VZ.clamp((performance.now() - start) / 450, 0, 1);
        var e = VZ.ease(u);
        theta = VZ.lerp(t0, toTheta, e);
        flip = VZ.lerp(f0, toFlip, e);
        renderPoly();
        if (u >= 1) { theta = toTheta; flip = toFlip; renderPoly(); anim = null; if (toFlip === -1 && f0 === 1) { flip = 1; } }
      });
    }
    var ctl = VZ.box(stage, "viz-chips");
    var chips = VZ.chips(ctl, ["正三角形", "正方形", "正五边形"], "正方形", function (m) {
      if (anim) return;
      N = m === "正三角形" ? 3 : m === "正方形" ? 4 : 5;
      theta = 0; flip = 1; renderPoly(); setInfo(N);
    });
    var btns = VZ.box(stage, "viz-chips");
    VZ.btn(btns, "旋转一格", function () { if (!anim) tween(theta + 360 / N, flip); });
    VZ.btn(btns, "镜像翻转", function () { if (!anim) tween(theta, -flip); });
  }
},

/* ----------------------------------------------------------
   f-ch13f · 子群与陪集：把时钟切成三份（挂：13.2 子群与单群）
   ---------------------------------------------------------- */
"f-ch13f": {
  title: "",
  hint: "时钟加法 ℤ₁₂ 里挑出子群 H = {0,3,6,9}（金色）。点不同陪集：H+k 就是把 H 整体平移 k 格。三个陪集<b>不重不漏</b>盖住 12 个数——拉格朗日：子群大小 × 陪集个数 = 群的大小。",
  draw: function (stage) {
    var W = 760, H = 300, svg = VZ.S(stage, W, H);
    var C = VZ.C;
    var cx = 200, cy = 160, R = 108;
    var Hsub = [0, 3, 6, 9];
    var cosetColors = { 0: C.gold, 1: C.cyan, 2: C.mag };
    function cosetOf(n) { return n % 3; }
    var dots = [];
    for (var i = 0; i < 12; i++) {
      var a = -Math.PI / 2 + i * Math.PI / 6;
      var x = cx + R * Math.cos(a), y = cy + R * Math.sin(a);
      dots.push({ n: i, x: x, y: y });
    }
    /* 子群内部 3 格一跳的箭头 */
    for (var j = 0; j < 4; j++) {
      var p1 = dots[Hsub[j]], p2 = dots[Hsub[(j + 1) % 4]];
      var a1 = Math.atan2(p1.y - cy, p1.x - cx), a2 = Math.atan2(p2.y - cy, p2.x - cx);
      var mid = (a1 + a2) / 2, rr = R - 26;
      VZ.path(svg, "M" + p1.x + " " + p1.y + "A" + rr + " " + rr + " 0 0 1 " + p2.x + " " + p2.y,
        VZ.stroke({ stroke: C.gold, "stroke-width": 1.3, opacity: .55, "stroke-dasharray": "5 5" }));
    }
    VZ.circ(svg, cx, cy, R, { stroke: C.faint, "stroke-width": 1.1 });
    VZ.txt(svg, cx, cy + 4, "ℤ₁₂", { size: 15, fill: C.dim, anchor: "middle" });

    var hl = VZ.g(svg, {});
    function drawCoset(k, dimOthers) {
      hl.innerHTML = "";
      dots.forEach(function (d) {
        var inC = cosetOf(d.n) === k;
        var inH = Hsub.indexOf(d.n) >= 0;
        var col = inH ? C.gold : cosetColors[cosetOf(d.n)];
        var op = dimOthers && !inC ? .18 : 1;
        VZ.circ(hl, d.x, d.y, inC ? 9 : 6.5, { fill: "rgba(15,10,36,.9)", stroke: col, "stroke-width": inC ? 2.4 : 1.4, opacity: op });
        VZ.txt(hl, d.x, d.y + 4, d.n, { size: inC ? 12 : 11, fill: inC ? col : C.dim, anchor: "middle", weight: inC ? 700 : 400, opacity: op });
      });
    }
    drawCoset(0, true);

    /* 右侧说明 */
    VZ.card(svg, 388, 40, 344, 224, { stroke: C.faint });
    VZ.txt(svg, 410, 70, "子群 H = {0, 3, 6, 9}", { size: 14, fill: C.gold, weight: 700 });
    var info = VZ.g(svg);
    function setInfo(k) {
      info.innerHTML = "";
      var members = [0, 1, 2].map(function (i) { return (Hsub[i] + k) % 12; });
      VZ.para(info, 410, 100, "陪集 H+" + k + " = {" + members.join("，") + "}", { size: 13, fill: C.ink, per: 26 });
      VZ.para(info, 410, 128, "把 H 的每个数加 k（时钟加法），得到一个新的陪集。三个陪集互不相交，并起来恰好是全部 12 个数。", { size: 12, per: 27, fill: C.dim });
      VZ.txt(info, 410, 196, "|H| × 陪集数 = 4 × 3 = 12", { size: 13.5, fill: C.cyan, weight: 700 });
      VZ.para(info, 410, 220, "这条整除关系对任何有限群都成立（拉格朗日定理）。", { size: 11.5, per: 27, fill: C.dim });
    }
    setInfo(0);

    var cur = 0, timer = null;
    var ctl = VZ.box(stage, "viz-chips");
    VZ.chips(ctl, ["H+0", "H+1", "H+2"], "H+0", function (m) {
      stopAuto();
      cur = parseInt(m.slice(2));
      drawCoset(cur, true); setInfo(cur);
    });
    var btns = VZ.box(stage, "viz-chips");
    VZ.btn(btns, "自动轮播", function () {
      if (timer) { stopAuto(); return; }
      timer = VZ.raf(svg, function (t) {
        var k = Math.floor(t / 1.1) % 3;
        if (k !== cur) { cur = k; drawCoset(cur, true); setInfo(cur); }
      });
    });
    function stopAuto() { if (timer) { timer(); timer = null; } }
  }
},

/* ----------------------------------------------------------
   f-ch13g · 离散群 vs 李群：台阶与斜坡（挂：13.4 连续的群）
   ---------------------------------------------------------- */
"f-ch13g": {
  title: "",
  hint: "拖动滑块转一个角度 θ：左边 C₄ 只有 4 个允许的位置，指针被迫「吸附」；右边 SO(2) 里任何角度都合法。李群 = 元素连续成一条曲线的群——它的无穷小影子叫李代数。",
  draw: function (stage) {
    var W = 760, H = 290, svg = VZ.S(stage, W, H);
    var C = VZ.C;
    var L = { x: 185, y: 150, r: 88 }, Rr = { x: 575, y: 150, r: 88 };
    var AR = VZ.arrowDef(svg, VZ.uid("ar"), C.cyan);

    [L, Rr].forEach(function (d, i) {
      VZ.circ(svg, d.x, d.y, d.r, { stroke: i ? C.cyan : C.gold, "stroke-width": 1.6 });
      VZ.circ(svg, d.x, d.y, 3, { fill: C.dim });
    });
    /* 左盘：4 个离散格点 */
    for (var i = 0; i < 4; i++) {
      var a = -Math.PI / 2 + i * Math.PI / 2;
      VZ.circ(svg, L.x + L.r * Math.cos(a), L.y + L.r * Math.sin(a), 5.5, { fill: C.gold });
    }
    VZ.txt(svg, L.x, L.y + L.r + 30, "C₄：4 个元素（离散）", { size: 13, fill: C.gold, anchor: "middle", weight: 700 });
    VZ.txt(svg, Rr.x, Rr.y + Rr.r + 30, "SO(2)：无穷多元素（连续）", { size: 13, fill: C.cyan, anchor: "middle", weight: 700 });

    var spkL = VZ.ln(svg, L.x, L.y, L.x, L.y - L.r, VZ.stroke({ stroke: C.gold, "stroke-width": 2.4, "marker-end": AR }));
    var spkR = VZ.ln(svg, Rr.x, Rr.y, Rr.x, Rr.y - Rr.r, VZ.stroke({ stroke: C.cyan, "stroke-width": 2.4, "marker-end": AR }));
    var lblL = VZ.txt(svg, L.x, L.y - L.r - 14, "", { size: 11.5, fill: C.gold, anchor: "middle", weight: 700 });
    var lblR = VZ.txt(svg, Rr.x, Rr.y - Rr.r - 14, "", { size: 11.5, fill: C.cyan, anchor: "middle", weight: 700 });

    var theta = 30;
    function update() {
      var snapped = Math.round(theta / 90) * 90;
      var aL = -Math.PI / 2 + snapped * Math.PI / 180;
      spkL.setAttribute("x2", L.x + L.r * Math.cos(aL));
      spkL.setAttribute("y2", L.y + L.r * Math.sin(aL));
      lblL.textContent = "θ=" + Math.round(theta) + "° → 吸附 " + ((snapped % 360) + 360) % 360 + "°";
      var aR = -Math.PI / 2 + theta * Math.PI / 180;
      spkR.setAttribute("x2", Rr.x + Rr.r * Math.cos(aR));
      spkR.setAttribute("y2", Rr.y + Rr.r * Math.sin(aR));
      lblR.textContent = "θ=" + Math.round(theta) + "°，任意角都行";
    }
    update();
    var ctl = VZ.box(stage, "viz-chips");
    var sl = VZ.slider(ctl, { label: "旋转角 θ", value: 30, min: 0, max: 360, step: 1, onInput: function (v) { stop(); theta = v; update(); }, format: function (v) { return v + "°"; } });
    var btns = VZ.box(stage, "viz-chips");
    var spin = null;
    VZ.btn(btns, "自动旋转", function () {
      if (spin) { stop(); return; }
      spin = VZ.raf(svg, function (t, dt) {
        theta = (theta + dt * 0.04) % 360; sl.set(Math.round(theta)); update();
      });
    });
    function stop() { if (spin) { spin(); spin = null; } }
  }
},

/* ----------------------------------------------------------
   f-ch14d · 协变导数：基向量自己在转（挂：术语：协变导数）
   ---------------------------------------------------------- */
"f-ch14d": {
  title: "",
  hint: "沿圆周拖动点 P：向量 v 的<b>分量</b> (a,b) 始终不变（∂v = 0），但坐标架 t̂、n̂ 跟着 P 一起转了 φ。协变导数 ∇v 就是把「基的转动」补回来的那种导数——补上之后才发现 v 其实一直在变。",
  draw: function (stage) {
    var W = 760, H = 300, svg = VZ.S(stage, W, H);
    var C = VZ.C;
    var cx = 235, cy = 165, R = 118;
    var ARg = VZ.arrowDef(svg, VZ.uid("ar"), C.gold);
    var ARc = VZ.arrowDef(svg, VZ.uid("ar"), C.cyan);
    var ARv = VZ.arrowDef(svg, VZ.uid("ar"), C.ink);
    VZ.circ(svg, cx, cy, R, { stroke: C.faint, "stroke-width": 1.2 });
    VZ.circ(svg, cx, cy, 3, { fill: C.dim });

    var gDyn = VZ.g(svg, {});
    var a = 1.25, b = 0.55, U = 46;
    var phi = 25;
    function update() {
      gDyn.innerHTML = "";
      var rad = phi * Math.PI / 180;
      var px = cx + R * Math.cos(rad), py = cy + R * Math.sin(rad);
      var tx = -Math.sin(rad), ty = Math.cos(rad);      /* 切向基 */
      var nx = Math.cos(rad), ny = Math.sin(rad);       /* 法向基 */
      /* 基向量 */
      VZ.ln(gDyn, px, py, px + tx * U, py + ty * U, VZ.stroke({ stroke: C.gold, "stroke-width": 2, "marker-end": ARg }));
      VZ.ln(gDyn, px, py, px + nx * U, py + ny * U, VZ.stroke({ stroke: C.gold, "stroke-width": 2, "stroke-dasharray": "5 4", "marker-end": ARg }));
      VZ.txt(gDyn, px + tx * (U + 12), py + ty * (U + 12) + 4, "t̂", { size: 12, fill: C.gold });
      VZ.txt(gDyn, px + nx * (U + 12), py + ny * (U + 12) + 4, "n̂", { size: 12, fill: C.gold });
      /* v = a·t̂ + b·n̂：分量不变，但随基一起转 */
      var vx = a * tx + b * nx, vy = a * ty + b * ny;
      VZ.ln(gDyn, px, py, px + vx * U, py + vy * U, VZ.stroke({ stroke: C.ink, "stroke-width": 2.6, "marker-end": ARv }));
      /* 幽灵：φ=0 时的 v 方向（固定方向对照） */
      var vx0 = a * 0 + b * 1, vy0 = a * 1 + b * 0;
      VZ.ln(gDyn, px, py, px + vx0 * U, py + vy0 * U, VZ.stroke({ stroke: C.dim, "stroke-width": 1.3, "stroke-dasharray": "4 5" }));
      VZ.circ(gDyn, px, py, 5, { fill: C.cyan });
      /* 基转角弧 */
      if (phi > 6 && phi < 354) {
        var sweep = phi % 360 > 180 ? 0 : 1;
        VZ.path(gDyn, "M" + (px + U * 0.5) + " " + py + "A" + U * 0.5 + " " + U * 0.5 + " 0 0 " + sweep + " " + (px + U * 0.5 * Math.cos(rad)) + " " + (py + U * 0.5 * Math.sin(rad)),
          VZ.stroke({ stroke: C.mag, "stroke-width": 1.3, opacity: .8 }));
      }
      VZ.txt(gDyn, px + 10, py - 12, "v", { size: 14, fill: C.ink, weight: 700 });
      VZ.txt(gDyn, px - 14, py + 22, "P", { size: 12, fill: C.cyan });
    }
    update();

    /* 右侧公式卡 */
    VZ.card(svg, 440, 42, 292, 220, { stroke: C.faint });
    var info = VZ.g(svg);
    function setInfo() {
      info.innerHTML = "";
      VZ.txt(info, 462, 74, "∂v（普通偏导）= 0", { size: 13.5, fill: C.green, weight: 700 });
      VZ.para(info, 462, 96, "只盯着分量 (a, b) = (" + a.toFixed(2) + ", " + b.toFixed(2) + ")：一步都没动。", { size: 12, per: 22, fill: C.dim });
      VZ.txt(info, 462, 140, "∇v（协变导数）≠ 0", { size: 13.5, fill: C.mag, weight: 700 });
      VZ.para(info, 462, 162, "分量之外还要补基的转动项（Γ 系数）：基已经转了 " + Math.round(phi) + "°，v 在空间里其实跟着转了同样的角。", { size: 12, per: 22, fill: C.dim });
      VZ.txt(info, 462, 226, "∇ᵤv = ∂ᵤv − Γᵏᵢⱼ uⁱ vʲ eₖ", { size: 13, fill: C.ink2, anchor: "start" });
    }
    setInfo();

    var ctl = VZ.box(stage, "viz-chips");
    VZ.slider(ctl, { label: "P 的位置 φ", value: 25, min: 0, max: 359, step: 1,
      onInput: function (v) { phi = v; update(); setInfo(); },
      format: function (v) { return v + "°"; } });
  }
},

/* ----------------------------------------------------------
   f-ch14e · 曲率转方向，挠率错位置（挂：14.4 曲率与挠率）
   ---------------------------------------------------------- */
"f-ch14e": {
  title: "",
  hint: "各让一支箭头沿回路走一圈：<b>左</b>（纯曲率）回来时方向转了一个角——绕圈的「方向差」就是曲率；<b>右</b>（纯挠率）方向没变，落点却<b>平移错开</b>了——挠率把回路拧成螺丝。",
  draw: function (stage) {
    var W = 760, H = 300, svg = VZ.S(stage, W, H);
    var C = VZ.C;
    var AR = VZ.arrowDef(svg, VZ.uid("ar"), C.cyan);
    var AR2 = VZ.arrowDef(svg, VZ.uid("ar"), C.gold);
    var ARm = VZ.arrowDef(svg, VZ.uid("ar"), C.mag);
    var Lc = { x: 205, y: 150, r: 92 }, Rc = { x: 560, y: 150, r: 92 };
    VZ.circ(svg, Lc.x, Lc.y, Lc.r, { stroke: C.faint, "stroke-width": 1.2 });
    VZ.circ(svg, Rc.x, Rc.y, Rc.r, { stroke: C.faint, "stroke-width": 1.2 });
    VZ.txt(svg, Lc.x, Lc.y + Lc.r + 34, "曲率：方向差 ≠ 0", { size: 13, fill: C.cyan, anchor: "middle", weight: 700 });
    VZ.txt(svg, Rc.x, Rc.y + Rc.r + 34, "挠率：位置差 ≠ 0", { size: 13, fill: C.gold, anchor: "middle", weight: 700 });

    /* 起点（两盘同在顶部） */
    var sL = { x: Lc.x, y: Lc.y - Lc.r }, sR = { x: Rc.x, y: Rc.y - Rc.r };
    VZ.circ(svg, sL.x, sL.y, 4, { fill: C.ink });
    VZ.circ(svg, sR.x, sR.y, 4, { fill: C.ink });
    VZ.txt(svg, sL.x + 12, sL.y - 6, "出发点", { size: 11, fill: C.dim });
    VZ.txt(svg, sR.x + 12, sR.y - 6, "出发点", { size: 11, fill: C.dim });

    /* 左：行进箭头方向持续转动（每圈多转 150°） */
    var curL = VZ.ln(svg, sL.x, sL.y, sL.x, sL.y - 34, VZ.stroke({ stroke: C.cyan, "stroke-width": 2.4, "marker-end": AR }));
    var ghostL = VZ.ln(svg, sL.x, sL.y, sL.x, sL.y - 34, VZ.stroke({ stroke: C.dim, "stroke-width": 1.2, "stroke-dasharray": "4 4" }));
    var dotL = VZ.circ(svg, sL.x, sL.y, 4.5, { fill: C.cyan });
    /* 右：方向不变，圆心随圈数平移错开（漂移圆一起画出来） */
    var dynR = VZ.g(svg, {});
    var curR = VZ.ln(svg, sR.x, sR.y, sR.x, sR.y - 34, VZ.stroke({ stroke: C.gold, "stroke-width": 2.4, "marker-end": AR2 }));
    var dotR = VZ.circ(svg, sR.x, sR.y, 4.5, { fill: C.gold });

    var playing = true, phase = 0;
    var ROT_PER_LAP = 150 * Math.PI / 180, SHIFT = 58;
    var btns = VZ.box(stage, "viz-chips");
    VZ.btn(btns, "暂停 / 继续", function () { playing = !playing; });
    VZ.raf(svg, function (t, dt) {
      if (playing) phase = (phase + dt * 0.00035) % 2;
      var u = phase;                 /* 圈内进度 0..2（两圈演示） */
      var lap = Math.floor(u);       /* 已完成的圈数 0/1 */
      var fr = u - lap;              /* 圈内分数 */
      /* 左盘 */
      var aL = -Math.PI / 2 + fr * 2 * Math.PI;
      var pL = { x: Lc.x + Lc.r * Math.cos(aL), y: Lc.y + Lc.r * Math.sin(aL) };
      dotL.setAttribute("cx", pL.x); dotL.setAttribute("cy", pL.y);
      var angL = -Math.PI / 2 + (u * 2 * Math.PI + u * ROT_PER_LAP);
      curL.setAttribute("x1", pL.x); curL.setAttribute("y1", pL.y);
      curL.setAttribute("x2", pL.x + 34 * Math.cos(angL));
      curL.setAttribute("y2", pL.y + 34 * Math.sin(angL));
      ghostL.setAttribute("x2", sL.x); ghostL.setAttribute("y2", sL.y - 34);
      /* 右盘：圆心向右漂移，回路整体跟着平移 */
      var off = (lap + fr) * SHIFT * 0.5;
      var cR = { x: Rc.x + off, y: Rc.y };
      dynR.innerHTML = "";
      VZ.circ(dynR, cR.x, cR.y, Rc.r, VZ.stroke({ stroke: C.gold, "stroke-width": 1.1, opacity: .55 }));
      VZ.circ(dynR, cR.x, cR.y - Rc.r, 4, { fill: C.gold, opacity: .8 });
      if (off > 6) {
        VZ.ln(dynR, sR.x, sR.y - 16, cR.x, sR.y - 16, VZ.stroke({ stroke: C.mag, "stroke-width": 1.4, "marker-end": ARm }));
        VZ.txt(dynR, (sR.x + cR.x) / 2, sR.y - 24, "落点错开 " + off.toFixed(0), { size: 11, fill: C.mag, anchor: "middle" });
      }
      var aR = -Math.PI / 2 + fr * 2 * Math.PI;
      var pR = { x: cR.x + Rc.r * Math.cos(aR), y: cR.y + Rc.r * Math.sin(aR) };
      dotR.setAttribute("cx", pR.x); dotR.setAttribute("cy", pR.y);
      curR.setAttribute("x1", pR.x); curR.setAttribute("y1", pR.y);
      curR.setAttribute("x2", pR.x); curR.setAttribute("y2", pR.y - 34);
    });
  }
},

/* ----------------------------------------------------------
   f-ch14f · 测地偏差：两条近邻测地线（挂：一步步推导 球面三角形）
   ---------------------------------------------------------- */
"f-ch14f": {
  title: "",
  hint: "从北极同时发射两条初始方向几乎相同的测地线，拖滑块改初始夹角：<b>球面</b>上它们一路汇聚（正曲率），平面上间距不变（零曲率），马鞍面上互相跑散（负曲率）。间距怎么变，曲率就怎么符号。",
  draw: function (stage) {
    var W = 760, H = 300, svg = VZ.S(stage, W, H);
    var C = VZ.C;
    var cx = 250, cy = 152, R = 118;
    var AR = VZ.arrowDef(svg, VZ.uid("ar"), C.mag);
    var dyn = VZ.g(svg, {});
    var mode = "球面（正曲率）", lam = 22;

    function drawStatic() {
      VZ.circ(svg, cx, cy, R, { stroke: C.faint, "stroke-width": 1.2 });
      VZ.circ(svg, cx, cy, 2.5, { fill: C.dim });
      VZ.circ(svg, cx, cy - R, 4, { fill: C.ink });
      VZ.txt(svg, cx, cy - R - 10, "北极：同时出发", { size: 11, fill: C.dim, anchor: "middle" });
    }
    drawStatic();

    function redraw() {
      dyn.innerHTML = "";
      var s = Math.sin(lam * Math.PI / 180);
      var lats = [-60, -30, 0, 30, 60];
      function pt(lat, side) {
        var rad = lat * Math.PI / 180;
        var y = cy - R * Math.sin(rad);
        var sn = Math.sin(rad), cs = Math.cos(rad);
        var x;
        if (mode.indexOf("球面") === 0) x = cx + side * R * cs * s;                       /* 经线：两极相会 */
        else if (mode.indexOf("平面") === 0) x = cx + side * R * s;                       /* 平行直线：间距不变 */
        else x = cx + side * R * s * (0.2 + 1.5 * sn * sn);                               /* 马鞍：越走越散 */
        return { x: x, y: y };
      }
      [-1, 1].forEach(function (side) {
        var d = "";
        for (var i = 0; i <= 40; i++) {
          var lat = -90 + 180 * i / 40;
          var p = pt(lat, side);
          d += (i ? "L" : "M") + p.x.toFixed(1) + " " + p.y.toFixed(1);
        }
        VZ.path(dyn, d, VZ.stroke({ stroke: C.cyan, "stroke-width": 2 }));
      });
      /* 间距标注 */
      lats.forEach(function (lat) {
        var p1 = pt(lat, -1), p2 = pt(lat, 1);
        VZ.ln(dyn, p1.x, p1.y, p2.x, p2.y, VZ.stroke({ stroke: C.mag, "stroke-width": 1.1, "marker-end": AR, "marker-start": AR, opacity: .85 }));
      });
      var eq1 = pt(0, -1), eq2 = pt(0, 1);
      var tail = mode.indexOf("球面") === 0 ? "两极处相会 → 汇聚" :
                 mode.indexOf("平面") === 0 ? "处处平行 → 平直" : "越走越宽 → 跑散";
      VZ.txt(dyn, cx, cy + R + 26, "间距 " + (eq2.x - eq1.x).toFixed(0) + "：" + tail,
        { size: 11.5, fill: C.mag, anchor: "middle" });
    }
    redraw();

    /* 右侧说明 */
    VZ.card(svg, 440, 42, 292, 222, { stroke: C.faint });
    var info = VZ.g(svg);
    function setInfo() {
      info.innerHTML = "";
      var col = mode.indexOf("球面") === 0 ? C.cyan : mode.indexOf("平面") === 0 ? C.ink2 : C.gold;
      var K = mode.indexOf("球面") === 0 ? "K > 0" : mode.indexOf("平面") === 0 ? "K = 0" : "K < 0";
      VZ.txt(info, 462, 74, mode, { size: 13.5, fill: col, weight: 700 });
      VZ.para(info, 462, 100, "两条近邻测地线的间距 d(s) 满足测地偏差方程：d″ + K·d ≈ 0。", { size: 12, per: 22, fill: C.dim });
      VZ.txt(info, 462, 148, K, { size: 15, fill: col, weight: 700 });
      VZ.para(info, 462, 172, mode.indexOf("球面") === 0 ? "K>0：解是振荡的 → 测地线反复汇聚（经线在两极相会）。" :
        mode.indexOf("平面") === 0 ? "K=0：间距恒定 → 平行线永远平行。" :
        "K<0：解指数发散 → 邻线越走越远（双曲面）。", { size: 12, per: 22, fill: C.dim });
    }
    setInfo();

    var ctl = VZ.box(stage, "viz-chips");
    VZ.chips(ctl, ["球面（正曲率）", "平面（零曲率）", "马鞍（负曲率）"], mode, function (m) { mode = m; redraw(); setInfo(); });
    var ctl2 = VZ.box(stage, "viz-chips");
    VZ.slider(ctl2, { label: "初始夹角", value: 22, min: 6, max: 44, step: 1,
      onInput: function (v) { lam = v; redraw(); }, format: function (v) { return v + "°"; } });
  }
},

/* ----------------------------------------------------------
   f-ch14g · 李导数：沿向量场拖拽图形（挂：14.6 李导数）
   ---------------------------------------------------------- */
"f-ch14g": {
  title: "",
  hint: "选一个向量场，拖滑块让时间流起来：小方块被场「拖」着变形——旋转场拧它、剪切场搓它、膨胀场撑它。李导数 ℒ_X 度量的正是这种<b>沿场拖动时的变形速度</b>，全程不需要联络。",
  draw: function (stage) {
    var W = 760, H = 300, svg = VZ.S(stage, W, H, { grid: true });
    var C = VZ.C;
    var cx = 300, cy = 152, hw = 62;
    var AR = VZ.arrowDef(svg, VZ.uid("ar"), C.faint);
    var dyn = VZ.g(svg, {});
    var field = "旋转场", t = 0.4;

    function flow(p, tt) {
      var x = p[0] - cx, y = p[1] - cy;
      if (field === "旋转场") {
        var a = tt * 1.2, c = Math.cos(a), s = Math.sin(a);
        return [cx + x * c - y * s, cy + x * s + y * c];
      }
      if (field === "剪切场") return [cx + x + tt * 90 * (y / 150), cy + y];
      return [cx + x * (1 + tt * 0.7), cy + y * (1 + tt * 0.7)];
    }
    var corners = [[cx - hw, cy - hw], [cx + hw, cy - hw], [cx + hw, cy + hw], [cx - hw, cy + hw]];
    /* 原方块（虚线） */
    VZ.poly(svg, corners, VZ.stroke({ stroke: C.dim, "stroke-width": 1.2, "stroke-dasharray": "5 5", close: true }));

    function redraw() {
      dyn.innerHTML = "";
      var pts = corners.map(function (p) { return flow(p, t); });
      VZ.poly(dyn, pts, VZ.stroke({ stroke: C.cyan, "stroke-width": 2.4, close: true, fill: "rgba(79,227,240,.08)" }));
      pts.forEach(function (p) { VZ.circ(dyn, p[0], p[1], 3.6, { fill: C.cyan }); });
      /* 场箭头 */
      for (var gx = 90; gx <= 510; gx += 70) for (var gy = 60; gy <= 250; gy += 64) {
        var v = [0, 0], p0 = [gx, gy];
        if (field === "旋转场") { v = [-(gy - cy), gx - cx]; var n = Math.hypot(v[0], v[1]) || 1; v = [v[0] / n * 16, v[1] / n * 16]; }
        else if (field === "剪切场") v = [(gy - cy) / 150 * 16, 0];
        else { v = [(gx - cx) / 150 * 13, (gy - cy) / 150 * 13]; }
        VZ.ln(dyn, gx - v[0] / 2, gy - v[1] / 2, gx + v[0] / 2, gy + v[1] / 2,
          VZ.stroke({ stroke: C.faint, "stroke-width": 1, "marker-end": AR, opacity: .8 }));
      }
    }
    redraw();

    VZ.card(svg, 600, 42, 130, 222, { stroke: C.faint });
    var info = VZ.g(svg);
    function setInfo() {
      info.innerHTML = "";
      VZ.txt(info, 665, 74, field, { size: 13, fill: C.ink, anchor: "middle", weight: 700 });
      VZ.para(info, 620, 104, "ℒ_X T = d/dt ( 拖 t 步后的 T ) |ₜ₌₀", { size: 11.5, per: 15, fill: C.ink2, anchor: "middle" });
      VZ.para(info, 620, 150, field === "旋转场" ? "转了个角度，边长不变。" : field === "剪切场" ? "上下错动，面积不变。" : "整体撑大，面积变大。", { size: 12, per: 14, fill: C.dim, anchor: "middle" });
    }
    setInfo();

    var ctl = VZ.box(stage, "viz-chips");
    VZ.chips(ctl, ["旋转场", "剪切场", "膨胀场"], field, function (m) { field = m; redraw(); setInfo(); });
    var ctl2 = VZ.box(stage, "viz-chips");
    VZ.slider(ctl2, { label: "沿场拖动 t", value: 0.4, min: 0, max: 1, step: 0.01,
      onInput: function (v) { t = v; redraw(); }, format: function (v) { return v.toFixed(2); } });
  }
},

/* ----------------------------------------------------------
   f-ch15d · 截面与毛球定理（挂：术语：截面）
   ---------------------------------------------------------- */
"f-ch15d": {
  title: "",
  hint: "截面 = 在每一点光滑地挑一根「毛发」。切到「全覆盖」：绕来绕去总有一处毛发打架（红点＝奇点，毛球定理）；切到「赤道带」：少盖一圈，立刻能梳得整整齐齐——连续截面未必存在，这正是丛的奥妙。",
  draw: function (stage) {
    var W = 760, H = 300, svg = VZ.S(stage, W, H);
    var C = VZ.C;
    var cx = 280, cy = 152, R = 116;
    VZ.circ(svg, cx, cy, R, { stroke: C.faint, "stroke-width": 1.3 });
    VZ.path(svg, "M" + (cx - R) + " " + cy + "A" + R + " " + (R * 0.32) + " 0 0 0 " + (cx + R) + " " + cy,
      { stroke: C.faint, "stroke-width": .8, "stroke-dasharray": "4 5", fill: "none" });
    var mode = "全覆盖（必有奇点）";
    var dyn = VZ.g(svg, {});
    var A = [0.55, -0.42, 0.72]; /* 奇点轴（斜着指向观察者） */
    function norm(v) { var n = Math.hypot(v[0], v[1], v[2]) || 1; return [v[0] / n, v[1] / n, v[2] / n]; }
    function cross(u, v) {
      return [u[1] * v[2] - u[2] * v[1], u[2] * v[0] - u[0] * v[2], u[0] * v[1] - u[1] * v[0]];
    }
    var pts = [];
    for (var la = -75; la <= 75; la += 25) for (var lo = 0; lo < 360; lo += 20) {
      var rl = la * Math.PI / 180, ro = lo * Math.PI / 180;
      var P = [Math.cos(rl) * Math.sin(ro), Math.sin(rl), Math.cos(rl) * Math.cos(ro)];
      pts.push({ P: P, front: P[2] > -0.05, ph: lo * 0.4 + la });
    }
    function redraw(tsec) {
      dyn.innerHTML = "";
      pts.forEach(function (q) {
        var x = cx + q.P[0] * R, y = cy - q.P[1] * R;
        var dir, sing = false;
        if (mode.indexOf("全覆盖") === 0) {
          var cr = cross(A, q.P);
          var n = Math.hypot(cr[0], cr[1], cr[2]);
          if (n < 0.22) { sing = true; }
          dir = n > 1e-4 ? [cr[0] / n, cr[1] / n] : [1, 0];
        } else {
          if (Math.abs(q.P[1]) > 0.42) {
            if (q.front) VZ.circ(dyn, x, y, 1.6, { fill: C.faint, opacity: .5 });
            return;
          }
          var rl2 = Math.asin(VZ.clamp(q.P[1], -1, 1));
          var ro2 = Math.atan2(q.P[0], q.P[2]);
          dir = [-Math.sin(ro2), 0]; /* 纬线切向（水平） */
        }
        var wig = 0.22 * Math.sin(tsec * 2 + q.ph);
        var cs = Math.cos(wig), sn = Math.sin(wig);
        var dx = dir[0] * cs - dir[1] * sn, dy = dir[0] * sn + dir[1] * cs;
        var L2 = 17;
        VZ.ln(dyn, x, y, x + dx * L2, y + dy * L2,
          VZ.stroke({ stroke: sing ? C.red : (q.front ? C.cyan : C.dim), "stroke-width": q.front ? 1.6 : 1, opacity: q.front ? .95 : .3 }));
        if (sing && q.front) VZ.circ(dyn, x, y, 5, { fill: "none", stroke: C.red, "stroke-width": 2 });
        else if (q.front) VZ.circ(dyn, x, y, 1.8, { fill: C.ink2 });
      });
    }
    redraw(0);
    VZ.raf(svg, function (t) { redraw(t); });

    /* 右侧说明 */
    VZ.card(svg, 478, 42, 254, 224, { stroke: C.faint });
    var info = VZ.g(svg);
    function setInfo() {
      info.innerHTML = "";
      if (mode.indexOf("全覆盖") === 0) {
        VZ.txt(info, 498, 74, "毛球定理", { size: 14, fill: C.red, weight: 700 });
        VZ.para(info, 498, 100, "球面上处处非零的连续切向量场不存在：梳到总有一处冒出「旋涡」（红点）。", { size: 12, per: 20, fill: C.dim });
        VZ.txt(info, 498, 178, "截面不存在！", { size: 13.5, fill: C.red, weight: 700 });
        VZ.para(info, 498, 202, "这就是头发为什么梳不平地球。", { size: 12, per: 20, fill: C.dim });
      } else {
        VZ.txt(info, 498, 74, "赤道带上的截面", { size: 14, fill: C.green, weight: 700 });
        VZ.para(info, 498, 100, "只在带内取截面：毛发全部水平，光滑连续，没有奇点。", { size: 12, per: 20, fill: C.dim });
        VZ.txt(info, 498, 178, "截面存在 ✓", { size: 13.5, fill: C.green, weight: 700 });
        VZ.para(info, 498, 202, "收缩底空间， obstruction 消失。", { size: 12, per: 20, fill: C.dim });
      }
    }
    setInfo();
    var ctl = VZ.box(stage, "viz-chips");
    VZ.chips(ctl, ["全覆盖（必有奇点）", "赤道带（光滑截面）"], mode, function (m) { mode = m; setInfo(); });
  }
},

/* ----------------------------------------------------------
   f-ch15e · 切丛：圆柱 vs 莫比乌斯（挂：15.4 丛的大家族）
   ---------------------------------------------------------- */
"f-ch15e": {
  title: "",
  hint: "底空间是一个圆，每点上方竖一根「纤维」。切到莫比乌斯：纤维沿着底圆<b>慢慢拧转</b>，绕一整圈后翻了 180°。拖滑块沿底圆走：平凡丛（圆柱）纤维回原位，扭曲丛（莫比乌斯）回不来。",
  draw: function (stage) {
    var W = 760, H = 300, svg = VZ.S(stage, W, H);
    var C = VZ.C;
    var cx = 380, cy = 208, rx = 118, ry = 30, FH = 108, HW = 27;
    var mode = "平凡丛（圆柱）", s = 0.12;
    var dyn = VZ.g(svg, {});

    function base(a) { return [cx + rx * Math.cos(a), cy + ry * Math.sin(a)]; }
    function wDir(a) { /* 纤维方向：圆柱竖直；莫比乌斯沿底圆逐渐拧转，一圈翻 180° */
      if (mode.indexOf("圆柱") >= 0) return [0, -1];
      var tw = a;
      return [Math.sin(tw) * 0.55, -(1 - 0.28 * Math.abs(Math.sin(tw)))];
    }
    function tip(a) {
      var b = base(a), w = wDir(a);
      return [b[0] + w[0] * FH, b[1] + w[1] * FH];
    }
    function redraw() {
      dyn.innerHTML = "";
      /* 底圆 */
      VZ.el("ellipse", { cx: cx, cy: cy, rx: rx, ry: ry, fill: "rgba(255,207,92,.06)", stroke: C.gold, "stroke-width": 1.6 }, dyn);
      /* 纤维 */
      var NN = 44;
      for (var i = 0; i < NN; i++) {
        var a = i / NN * 2 * Math.PI;
        var b = base(a), tp = tip(a);
        VZ.ln(dyn, b[0], b[1], tp[0], tp[1], VZ.stroke({ stroke: C.ink2, "stroke-width": .8, opacity: .38 }));
      }
      /* 上缘曲线 */
      var dTop = "";
      for (var j = 0; j <= 60; j++) {
        var a2 = j / 60 * 2 * Math.PI, tp2 = tip(a2);
        dTop += (j ? "L" : "M") + tp2[0].toFixed(1) + " " + tp2[1].toFixed(1);
      }
      VZ.path(dyn, dTop, VZ.stroke({ stroke: C.dim, "stroke-width": 1, opacity: .7 }));
      /* 高亮当前纤维 */
      var aH = s * 2 * Math.PI;
      var bH = base(aH), tH = tip(aH);
      VZ.ln(dyn, bH[0], bH[1], tH[0], tH[1], VZ.stroke({ stroke: C.cyan, "stroke-width": 2.6 }));
      VZ.circ(dyn, bH[0], bH[1], 4.5, { fill: C.cyan });
      VZ.circ(dyn, tH[0], tH[1], 4, { fill: C.cyan });
      VZ.txt(dyn, tH[0] + 10, tH[1] - 6, "纤维", { size: 11, fill: C.cyan });
    }
    redraw();

    /* 右侧说明 */
    VZ.card(svg, 560, 42, 172, 224, { stroke: C.faint });
    var info = VZ.g(svg);
    function setInfo() {
      info.innerHTML = "";
      var mob = mode.indexOf("莫比乌斯") >= 0;
      var ang = mob ? Math.round(s * 180) : 0;
      VZ.txt(info, 646, 74, mob ? "莫比乌斯丛" : "平凡丛（圆柱）", { size: 13.5, fill: mob ? C.mag : C.cyan, anchor: "middle", weight: 700 });
      VZ.para(info, 578, 102, mob ? "绕底圆一圈，纤维扭转 " + ang + "°——取向翻不回去，这就是扭曲丛。" :
        "绕底圆一圈，纤维方向始终竖直，回到原位：丛「不扭」。", { size: 12, per: 16 });
      VZ.txt(info, 646, 190, "纤维转角 " + ang + "°", { size: 14, fill: mob ? C.mag : C.cyan, anchor: "middle", weight: 700 });
      VZ.para(info, 578, 214, "丛的整体样子（圆柱 vs 莫比乌斯）不只看纤维和底座，还要看「怎么粘」。", { size: 11.5, per: 16, fill: C.dim });
    }
    setInfo();

    var ctl = VZ.box(stage, "viz-chips");
    VZ.chips(ctl, ["平凡丛（圆柱）", "扭曲丛（莫比乌斯）"], mode, function (m) { mode = m; redraw(); setInfo(); });
    var ctl2 = VZ.box(stage, "viz-chips");
    VZ.slider(ctl2, { label: "沿底圆走 s", value: 0.12, min: 0, max: 1, step: 0.005,
      onInput: function (v) { s = v; redraw(); setInfo(); }, format: function (v) { return Math.round(v * 360) + "°"; } });
  }
},

/* ----------------------------------------------------------
   f-ch15f · 规范变换：整体免费，局部要联络（挂：15.6 规范联络与和乐）
   ---------------------------------------------------------- */
"f-ch15f": {
  title: "",
  hint: "一排箭头是场 ψ 的相位。切「整体变换」：所有箭头转<b>同一个</b>角，物理完全不变（全局对称免费）；切「局部变换」：每点转<b>各自的</b>角——相邻箭头的差不再约定成一致，必须有联络（规范场）来补上这个差。",
  draw: function (stage) {
    var W = 760, H = 290, svg = VZ.S(stage, W, H);
    var C = VZ.C;
    var y0 = 138, NP = 9, X0 = 88, DX = 73;
    var ARa = VZ.arrowDef(svg, VZ.uid("ar"), C.cyan);
    var ARb = VZ.arrowDef(svg, VZ.uid("ar"), C.dim);
    var ARm = VZ.arrowDef(svg, VZ.uid("ar"), C.mag);
    var dyn = VZ.g(svg, {});
    var mode = "整体变换", amp = 60;

    VZ.ln(svg, 40, y0, 720, y0, { stroke: C.faint, "stroke-width": 1 });
    VZ.txt(svg, 40, y0 + 24, "底空间（一条线上的点）", { size: 11, fill: C.dim });

    function gAt(i) {
      if (mode.indexOf("整体") === 0) return amp;
      return amp * Math.sin(i / (NP - 1) * Math.PI * 1.5);
    }
    function redraw() {
      dyn.innerHTML = "";
      for (var i = 0; i < NP; i++) {
        var x = X0 + i * DX;
        VZ.circ(dyn, x, y0, 3.5, { fill: C.ink2 });
        /* 原箭头（竖直向上，淡） */
        VZ.ln(dyn, x, y0, x, y0 - 30, VZ.stroke({ stroke: C.dim, "stroke-width": 1.1, "stroke-dasharray": "4 4", "marker-end": ARb, opacity: .55 }));
        /* 变换后的箭头 */
        var g = gAt(i) * Math.PI / 180;
        var dx = Math.sin(g), dy = -Math.cos(g);
        VZ.ln(dyn, x, y0, x + dx * 40, y0 + dy * 40, VZ.stroke({ stroke: C.cyan, "stroke-width": 2.2, "marker-end": ARa }));
        if (Math.abs(gAt(i)) > 8) {
          var rr = 26, sweep = g > 0 ? 1 : 0;
          VZ.path(dyn, "M" + x + " " + (y0 - rr) + "A" + rr + " " + rr + " 0 0 " + sweep + " " + (x + Math.sin(g) * rr) + " " + (y0 - Math.cos(g) * rr),
            VZ.stroke({ stroke: C.mag, "stroke-width": 1, opacity: .8 }));
        }
      }
    }
    redraw();

    VZ.card(svg, 470, 40, 262, 60, { stroke: C.faint });
    var msg = VZ.txt(svg, 486, 66, "", { size: 12.5, weight: 700 });
    VZ.txt(svg, 486, 86, "", { size: 11, fill: C.dim });
    function setMsg() {
      if (mode.indexOf("整体") === 0) {
        msg.textContent = "每点都转 " + Math.round(amp) + "°：处处一致 → 物理不变 ✓";
        msg.setAttribute("fill", C.green);
      } else {
        msg.textContent = "每点各自转（最大 ±" + Math.round(amp) + "°）→ 需要联络补偿";
        msg.setAttribute("fill", C.mag);
      }
    }
    setMsg();

    var ctl = VZ.box(stage, "viz-chips");
    VZ.chips(ctl, ["整体变换", "局部变换"], mode, function (m) { mode = m; redraw(); setMsg(); });
    var ctl2 = VZ.box(stage, "viz-chips");
    VZ.slider(ctl2, { label: "变换幅度", value: 60, min: 0, max: 150, step: 1,
      onInput: function (v) { amp = v; redraw(); setMsg(); }, format: function (v) { return v + "°"; } });
  }
},

/* ----------------------------------------------------------
   f-ch15g · 射影空间：对径点认同（挂：15.5 射影空间）
   ---------------------------------------------------------- */
"f-ch15g": {
  title: "",
  hint: "球面上每对对径点 p 与 −p 被「粘」成同一个点，这就是射影空间 RP²。拖滑块让小球沿赤道走：走满 180° 时它到达对径点——在 RP² 里这已经<b>回到出发点</b>；转满 360° 只相当于绕 RP² 两圈。",
  draw: function (stage) {
    var W = 760, H = 290, svg = VZ.S(stage, W, H);
    var C = VZ.C;
    var cx = 250, cy = 150, R = 112, ry = 44;
    VZ.circ(svg, cx, cy, R, { stroke: C.faint, "stroke-width": 1.3 });
    VZ.el("ellipse", { cx: cx, cy: cy, rx: R, ry: ry, fill: "none", stroke: C.dim, "stroke-width": 1, "stroke-dasharray": "5 5" }, svg);
    VZ.txt(svg, cx, cy - R - 12, "球面：赤道上的行走路线", { size: 11.5, fill: C.dim, anchor: "middle" });

    var dyn = VZ.g(svg, {});
    var theta = 20;
    function redraw() {
      dyn.innerHTML = "";
      var a = theta * Math.PI / 180;
      var p = [cx + R * Math.cos(a), cy + ry * Math.sin(a)];
      var q = [cx - R * Math.cos(a), cy - ry * Math.sin(a)];
      /* 对径连线 */
      VZ.ln(dyn, p[0], p[1], q[0], q[1], { stroke: C.mag, "stroke-width": 1, "stroke-dasharray": "3 4", opacity: .7 });
      /* 起点标记 */
      VZ.circ(dyn, cx + R, cy, 8, { fill: "none", stroke: C.green, "stroke-width": 1.8 });
      VZ.txt(dyn, cx + R + 14, cy - 8, "出发点 [p]", { size: 11, fill: C.green });
      /* 行迹 */
      var d = "";
      var steps = Math.max(2, Math.floor(theta / 3));
      for (var i = 0; i <= steps; i++) {
        var aa = i / steps * a;
        d += (i ? "L" : "M") + (cx + R * Math.cos(aa)).toFixed(1) + " " + (cy + ry * Math.sin(aa)).toFixed(1);
      }
      VZ.path(dyn, d, VZ.stroke({ stroke: C.cyan, "stroke-width": 2 }));
      /* 当前点与对径点 */
      VZ.circ(dyn, p[0], p[1], 5.5, { fill: C.gold });
      VZ.circ(dyn, q[0], q[1], 5.5, { fill: "rgba(15,10,36,.9)", stroke: C.gold, "stroke-width": 2 });
      VZ.txt(dyn, p[0] + 10, p[1] - 8, "p", { size: 12.5, fill: C.gold, weight: 700 });
      VZ.txt(dyn, q[0] + 10, q[1] + 14, "−p", { size: 12.5, fill: C.gold, weight: 700 });
      if (theta >= 178) {
        VZ.txt(dyn, cx, cy + ry + 34, "★ 已回到同一点 [p]（RP² 一圈 = 球面半圈）", { size: 12.5, fill: C.green, anchor: "middle", weight: 700 });
      }
    }
    redraw();

    /* 右侧粘合说明 */
    VZ.card(svg, 452, 42, 280, 222, { stroke: C.faint });
    var info = VZ.g(svg);
    function setInfo() {
      info.innerHTML = "";
      VZ.txt(info, 474, 74, "粘合规则：p ~ −p", { size: 13.5, fill: C.mag, weight: 700 });
      VZ.para(info, 474, 100, "「方向」比「位置」更重要：指东的箭头和指西的箭头是同一条直线、同一个光斑。", { size: 12, per: 21, fill: C.dim });
      VZ.txt(info, 474, 156, "球面走了 " + Math.round(theta) + "°", { size: 13, fill: C.gold, weight: 700 });
      VZ.txt(info, 474, 180, "RP² 行程 = " + Math.round(theta % 180) + "°", { size: 13, fill: C.cyan, weight: 700 });
      VZ.para(info, 474, 206, "对径点粘合让 RP² 变得不可定向——在上面走一圈，左右会翻转。", { size: 12, per: 21, fill: C.dim });
    }
    setInfo();

    var ctl = VZ.box(stage, "viz-chips");
    VZ.slider(ctl, { label: "行走角 θ", value: 20, min: 0, max: 360, step: 1,
      onInput: function (v) { theta = v; redraw(); setInfo(); }, format: function (v) { return v + "°"; } });
  }
},

/* ----------------------------------------------------------
   f-ch16d · 希尔伯特旅馆（挂：打个比方：希尔伯特旅馆）
   ---------------------------------------------------------- */
"f-ch16d": {
  title: "",
  hint: "旅馆无穷层、每层都住满了。点「来了一位新客」：请 1 号房客搬去 2 号、2 号搬去 3 号……1 号房空出。点「来了无穷多位」：全体搬去偶数号房，奇数房全空。可数无穷「客满」永远不碍事。",
  draw: function (stage) {
    var W = 760, H = 220, svg = VZ.S(stage, W, H);
    var C = VZ.C;
    var N = 9, BW = 66, BH = 62, X0 = 32, GAP = 11, Y0 = 56;
    var occupied = [];
    for (var i = 1; i <= N; i++) occupied.push(i);
    var guests = [];
    occupied.forEach(function (r) {
      var c = VZ.circ(svg, 0, Y0 + BH / 2, 9, { fill: C.cyan });
      guests.push({ room: r, el: c });
    });
    /* 房间框 */
    for (var r = 1; r <= N; r++) {
      var x = X0 + (r - 1) * (BW + GAP);
      VZ.card(svg, x, Y0, BW, BH, { stroke: C.faint });
      VZ.txt(svg, x + BW / 2, Y0 + 18, r + " 号", { size: 11, fill: C.dim, anchor: "middle" });
    }
    VZ.txt(svg, X0, Y0 - 16, "房间（只画出前 9 间，其实有无穷间……）", { size: 11.5, fill: C.dim });
    var msg = VZ.txt(svg, X0, Y0 + BH + 40, "客满：1–9 号全部有客", { size: 13.5, fill: C.ink, weight: 700 });

    function roomX(r) { return X0 + (r - 1) * (BW + GAP) + BW / 2; }
    function place(g, r, animate) {
      var from = parseFloat(g.el.getAttribute("cx")) || roomX(g.room);
      var to = roomX(r);
      g.room = r;
      if (!animate) { g.el.setAttribute("cx", to); g.el.setAttribute("opacity", 1); return; }
      var start = performance.now();
      VZ.raf(svg, function () {
        var u = VZ.clamp((performance.now() - start) / 550, 0, 1);
        var e = VZ.ease(u);
        g.el.setAttribute("cx", VZ.lerp(from, to, e));
        g.el.setAttribute("opacity", r > N ? VZ.clamp(1.4 - u, 0, 1) : 1);
        return u >= 1;
      });
    }
    function sync() {
      var full = occupied.filter(function (r) { return r <= N; }).length;
      msg.textContent = full === N ? "客满：1–9 号全部有客" :
        "腾出 " + (N - full) + " 间空房（奇数号房全空）——「客满」拦不住无穷";
      msg.setAttribute("fill", full === N ? C.ink : C.green);
    }
    guests.forEach(function (g) { g.el.setAttribute("cx", roomX(g.room)); });

    var ctl = VZ.box(stage, "viz-chips");
    VZ.btn(ctl, "来了一位新客", function () {
      guests.forEach(function (g) { place(g, g.room + 1, true); });
      guests.push({ room: 1, el: (function () {
        var c = VZ.circ(svg, roomX(1), Y0 + BH / 2, 9, { fill: C.gold, opacity: 0 });
        var st = performance.now();
        VZ.raf(svg, function () { var u = VZ.clamp((performance.now() - st) / 700, 0, 1); c.setAttribute("opacity", u); return u >= 1; });
        return c;
      })() });
      sync();
    });
    VZ.btn(ctl, "来了无穷多位新客", function () {
      guests.forEach(function (g) { place(g, g.room * 2, true); });
      sync();
    });
    VZ.btn(ctl, "住满重来", function () {
      guests.forEach(function (g) { g.el.remove(); });
      guests = [];
      for (var k = 1; k <= N; k++) {
        var c = VZ.circ(svg, roomX(k), Y0 + BH / 2, 9, { fill: C.cyan, opacity: 0 });
        guests.push({ room: k, el: c });
        (function (c2) { var st = performance.now(); VZ.raf(svg, function () { var u = VZ.clamp((performance.now() - st) / 400, 0, 1); c2.setAttribute("opacity", u); return u >= 1; }); })(c);
      }
      sync();
    });
  }
},

/* ----------------------------------------------------------
   f-ch16e · 对角扫描：把有理数排成一队（挂：术语：可数与不可数）
   ---------------------------------------------------------- */
"f-ch16e": {
  title: "",
  hint: "点「下一站」沿对角线扫描 n/d 表（只停在最简分数上）：每个正有理数<b>恰好被访问一次</b>——所以有理数能排成一列无穷队，与自然数一样多（可数）。队永远排不完，但「排不完」和「数不清」是两回事。",
  draw: function (stage) {
    var W = 760, H = 300, svg = VZ.S(stage, W, H);
    var C = VZ.C;
    var GS = 5, CW = 62, CH = 40, X0 = 74, Y0 = 62;
    function gcd(a, b) { return b ? gcd(b, a % b) : a; }
    var cells = {};
    for (var d = 1; d <= GS; d++) for (var n = 1; n <= GS; n++) cells[n + "/" + d] = { n: n, d: d };
    /* 行/列标签 */
    for (var i = 1; i <= GS; i++) {
      VZ.txt(svg, X0 + (i - 1) * CW + CW / 2, Y0 - 10, "n=" + i, { size: 10.5, fill: C.dim, anchor: "middle" });
      VZ.txt(svg, X0 - 12, Y0 + (i - 1) * CH + CH / 2 + 4, "d=" + i, { size: 10.5, fill: C.dim, anchor: "end" });
    }
    for (var d2 = 1; d2 <= GS; d2++) for (var n2 = 1; n2 <= GS; n2++) {
      var x = X0 + (n2 - 1) * CW, y = Y0 + (d2 - 1) * CH;
      var red = gcd(n2, d2) === 1;
      VZ.card(svg, x + 3, y + 3, CW - 6, CH - 6, { rx: 6, stroke: C.faint, fill: red ? "rgba(79,227,240,.05)" : "rgba(255,255,255,.02)" });
      VZ.txt(svg, x + CW / 2, y + CH / 2 + 4, n2 + "/" + d2, { size: 12, fill: red ? C.ink2 : C.faint, anchor: "middle" });
    }
    /* 枚举序列（只含表内最简分数） */
    var order = [];
    for (var s = 2; s <= 2 * GS; s++) for (var nn = 1; nn < s; nn++) {
      var dd = s - nn;
      if (nn <= GS && dd <= GS && gcd(nn, dd) === 1) order.push([nn, dd]);
    }
    var hl = VZ.g(svg, {});
    var idx = -1;
    var readout = VZ.txt(svg, 470, 60, "", { size: 13.5, fill: C.gold, weight: 700 });
    var sub = VZ.txt(svg, 470, 84, "", { size: 11.5, fill: C.dim });
    var trail = VZ.g(svg, {});
    function show() {
      hl.innerHTML = "";
      if (idx >= 0) {
        var pr = order[idx];
        var x = X0 + (pr[0] - 1) * CW, y = Y0 + (pr[1] - 1) * CH;
        VZ.card(hl, x + 3, y + 3, CW - 6, CH - 6, { rx: 6, stroke: C.gold, "stroke-width": 2, fill: "rgba(255,207,92,.14)" });
        VZ.txt(hl, x + CW / 2, y + CH / 2 + 4, pr[0] + "/" + pr[1], { size: 12, fill: C.gold, anchor: "middle", weight: 700 });
      }
      readout.textContent = idx < 0 ? "按「下一站」开始排队" :
        "第 " + (idx + 1) + " 站 → " + order[idx][0] + "/" + order[idx][1];
      sub.textContent = idx + 1 >= order.length ? "（表内走完；表无穷大，队永远排不完）" : "队列里没有重复、没有遗漏";
    }
    show();
    var timer = null;
    var ctl = VZ.box(stage, "viz-chips");
    VZ.btn(ctl, "下一站", function () {
      stop();
      idx = (idx + 1) % order.length;
      show();
    });
    VZ.btn(ctl, "自动扫描", function () {
      if (timer) { stop(); return; }
      timer = VZ.raf(svg, function (t) {
        var k = Math.floor(t / 0.55);
        if (k !== idx) { idx = k % order.length; show(); }
      });
    });
    VZ.btn(ctl, "重来", function () { stop(); idx = -1; trail.innerHTML = ""; show(); });
    function stop() { if (timer) { timer(); timer = null; } }
  }
},

/* ----------------------------------------------------------
   f-ch16f · 无穷的层级：ℵ₀ 与连续统（挂：比方 两层楼之间没有楼梯）
   ---------------------------------------------------------- */
"f-ch16f": {
  title: "",
  hint: "点三个层级：自然数与有理数虽然一个稀一个密，却都能排成一队（ℵ₀）；实数线是<b>连续</b>的一片，严格更多（对角线证明）。每个集合取幂集都会跳上更高一层——无穷有无穷多个「楼层」，且相邻两层之间没有楼梯。",
  draw: function (stage) {
    var W = 760, H = 300, svg = VZ.S(stage, W, H);
    var C = VZ.C;
    var X0 = 150, X1 = 700;
    var level = "有理数 ℚ（一样多！）";
    var layers = [
      { y: 78,  label: "ℕ 自然数", card: "ℵ₀", color: C.gold },
      { y: 158, label: "ℚ 有理数", card: "ℵ₀", color: C.cyan },
      { y: 238, label: "ℝ 实数",   card: "2^ℵ₀", color: C.mag }
    ];
    var dyn = VZ.g(svg, {});
    function redraw() {
      dyn.innerHTML = "";
      layers.forEach(function (L, li) {
        var on = level.indexOf(L.label.slice(0, 2)) === 0;
        var op = on ? 1 : .25;
        if (li < 2) {
          var nDots = li === 0 ? 28 : 56;
          var dx = (X1 - X0) / (nDots - 1);
          for (var i = 0; i < nDots; i++) {
            VZ.circ(dyn, X0 + i * dx, L.y, li === 0 ? 3.2 : 2, { fill: L.color, opacity: op });
          }
        } else {
          VZ.card(dyn, X0, L.y - 5, X1 - X0, 10, { rx: 5, fill: L.color, stroke: L.color });
          dyn.lastChild && dyn.lastChild.setAttribute("opacity", op * .85);
        }
        VZ.txt(dyn, X0 - 18, L.y + 5, L.label, { size: 13, fill: L.color, anchor: "end", weight: 700, opacity: op });
        VZ.txt(dyn, X1 + 16, L.y + 5, L.card, { size: 13, fill: L.color, weight: 700, opacity: op });
      });
      /* 层级箭头 */
      var ARl = VZ.arrowDef(svg, VZ.uid("arl"), C.dim);
      for (var k = 0; k < 2; k++) {
        VZ.ln(dyn, X0 - 60, layers[k].y - 12, X0 - 60, layers[k + 1].y - 34,
          VZ.stroke({ stroke: C.dim, "stroke-width": 1.2, "marker-end": ARl, opacity: .7 }));
      }
      VZ.txt(dyn, X0 - 74, (layers[0].y + layers[1].y) / 2 + 4, "一样多", { size: 10.5, fill: C.dim, anchor: "end" });
      VZ.txt(dyn, X0 - 74, (layers[1].y + layers[2].y) / 2 + 4, "严格更多", { size: 10.5, fill: C.dim, anchor: "end" });
    }
    redraw();

    VZ.card(svg, 560, 42, 0, 0, { stroke: "none" });
    var msg = VZ.txt(svg, 150, 288, "", { size: 12, fill: C.dim });
    function setMsg() {
      if (level.indexOf("ℕ") === 0) msg.textContent = "ℕ = {0,1,2,…}：一切无穷的起点，基数 ℵ₀。";
      else if (level.indexOf("ℚ") === 0) msg.textContent = "ℚ 看似密密麻麻，却能排队数清——与 ℕ 一样多，还是 ℵ₀。";
      else msg.textContent = "ℝ 是连续统：康托对角线证明它比 ℵ₀ 严格地多（2^ℵ₀）。";
    }
    setMsg();
    var ctl = VZ.box(stage, "viz-chips");
    VZ.chips(ctl, ["ℕ 自然数", "ℚ 有理数", "ℝ 实数"], "ℚ 有理数", function (m) {
      level = m === "ℕ 自然数" ? "ℕ 自然数" : m === "ℚ 有理数" ? "ℚ 有理数（一样多！）" : "ℝ 实数";
      redraw(); setMsg();
    });
  }
},

/* ----------------------------------------------------------
   f-ch16g · 哥德尔编码：公式变成数字（挂：16.6 哥德尔与图灵）
   ---------------------------------------------------------- */
"f-ch16g": {
  title: "",
  hint: "给每个符号编个号（0=1, s=2, +=3, ==4），公式就变成一串质数幂的乘积 G。点「换一个公式」：不同公式必得不同数字，且能逆推回公式——数学从此可以<b>谈论数学自己</b>，这正是哥德尔证明的起点。",
  draw: function (stage) {
    var W = 760, H = 260, svg = VZ.S(stage, W, H);
    var C = VZ.C;
    var codes = { "0": 1, "s": 2, "+": 3, "=": 4 };
    var formulas = [
      ["0", "=", "0"],
      ["s", "0", "=", "s", "0"],
      ["s", "0", "+", "0", "=", "s", "0"]
    ];
    var fi = 0;
    var dyn = VZ.g(svg, {});
    var info = VZ.g(svg);
    function isPrime(n) { for (var i = 2; i * i <= n; i++) if (n % i === 0) return false; return n > 1; }
    function primes(k) { var out = [], n = 2; while (out.length < k) { if (isPrime(n)) out.push(n); n++; } return out; }
    function redraw() {
      dyn.innerHTML = ""; info.innerHTML = "";
      var f = formulas[fi];
      var ps = primes(f.length);
      var G = 1;
      var BW = Math.min(86, Math.floor(700 / f.length));
      var x0 = 380 - f.length * BW / 2;
      f.forEach(function (sym, i) {
        var x = x0 + i * BW;
        VZ.card(dyn, x + 4, 46, BW - 8, 46, { rx: 8, stroke: C.ink2, fill: "rgba(255,255,255,.04)" });
        VZ.txt(dyn, x + BW / 2, 70, sym, { size: 17, fill: C.ink, anchor: "middle", weight: 700 });
        VZ.txt(dyn, x + BW / 2, 110, ps[i] + "^" + codes[sym], { size: 11.5, fill: C.cyan, anchor: "middle" });
        if (i < f.length - 1) VZ.txt(dyn, x + BW, 84, "×", { size: 13, fill: C.dim, anchor: "middle" });
        G *= Math.pow(ps[i], codes[sym]);
      });
      VZ.ln(dyn, 380, 122, 380, 148, VZ.stroke({ stroke: C.dim, "stroke-width": 1.2, "marker-end": VZ.arrowDef(svg, VZ.uid("gg"), C.dim) }));
      VZ.txt(info, 380, 176, "G = " + G.toLocaleString("en-US"), { size: 17, fill: C.gold, anchor: "middle", weight: 700 });
      VZ.txt(info, 380, 202, "公式 №" + (fi + 1) + " ⇄ 数字 " + G, { size: 11.5, fill: C.dim, anchor: "middle" });
      VZ.para(info, 380, 228, "一条公式 ↔ 一个唯一的自然数：关于公式的陈述，本身就成了关于数字的陈述。", { size: 12, per: 46, fill: C.dim, anchor: "middle" });
      /* 逐块浮现 */
      Array.prototype.forEach.call(dyn.childNodes, function (nd, i) {
        nd.style.opacity = 0;
        nd.style.transition = "opacity .3s ease " + (i * 28) + "ms";
        requestAnimationFrame(function () { requestAnimationFrame(function () { nd.style.opacity = 1; }); });
      });
    }
    redraw();
    var ctl = VZ.box(stage, "viz-chips");
    VZ.btn(ctl, "换一个公式", function () { fi = (fi + 1) % formulas.length; redraw(); });
  }
}

});
