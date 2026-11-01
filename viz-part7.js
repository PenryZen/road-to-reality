/* viz-part7.js — 第六批新图（ch30–ch34，每章 2 张，共 10 张） */

/* ---------- 公共小工具 ---------- */
var SUP7 = { "0": "⁰", "1": "¹", "2": "²", "3": "³", "4": "⁴", "5": "⁵", "6": "⁶", "7": "⁷", "8": "⁸", "9": "⁹", "-": "⁻" };
function sup7(n) { return String(n).split("").map(function (c) { return SUP7[c] || c; }).join(""); }
function fmt107(x) {
  if (!isFinite(x)) return "∞";
  if (x === 0) return "0";
  var e = Math.floor(Math.log10(Math.abs(x)));
  var m = x / Math.pow(10, e);
  return m.toFixed(1) + "×10" + sup7(e);
}

VZ.define({

/* ============================================================
   ch30b · 霍金辐射：视界旁的虚粒子对，一逃一落
   ============================================================ */
"f-ch30b": {
  title: "霍金辐射：视界旁的虚粒子对，一逃一落",
  hint: "滑动质量再看动画：<b>黑洞越轻，温度越高，粒子对冒得越快</b>。太阳质量黑洞只有 <span class='hl'>6×10⁻⁸ K</span>——比宇宙微波背景还冷，蒸发完要 10⁶⁷ 年。原理：视界旁的虚粒子对被潮汐力撕开，落进去的一个带走负能量，黑洞于是慢慢「漏水」。",
  draw: function (stage) {
    var C = VZ.C, W = 760, H = 320;
    var svg = VZ.S(stage, W, H, { grid: true });
    var bx = 380, by = 520, br = 270;            /* 视界圆（圆心在画布外下方，顶端 y=250） */

    /* 视界圆顶：可见弧段 + 暗色内部 */
    var dy = by - H, dx = Math.sqrt(br * br - dy * dy);
    var dArc = "M" + (bx - dx) + " " + H + " A" + br + " " + br + " 0 0 1 " + (bx + dx) + " " + H;
    VZ.path(svg, dArc + " Z", { fill: C.deep, stroke: "none" });
    var glow = VZ.blurFilter(svg, VZ.uid("gl"), 6);
    VZ.path(svg, dArc, VZ.stroke({ stroke: C.gold, "stroke-width": 2.6, filter: glow }));
    VZ.txt(svg, bx + dx + 12, H - 10, "事件视界", { size: 12, fill: C.gold });
    VZ.txt(svg, bx, 292, "黑 洞", { size: 14, fill: C.gold, anchor: "middle", weight: 700 });

    /* 左上读数区 */
    var rd = VZ.g(svg);
    var M = 1;
    function render() {
      var T = 6.17e-8 / M;                        /* 霍金温度（K），T ∝ 1/M */
      var lg = 67 + 3 * Math.log10(M);            /* 蒸发年限 log10(年) */
      rd.innerHTML = "";
      VZ.txt(rd, 24, 38, "质量 M = " + M.toFixed(1) + " M☉", { size: 14, fill: C.ink, weight: 700 });
      /* 温度 = 6.17×10^e K */
      var eT = Math.floor(Math.log10(T)), mT = T / Math.pow(10, eT);
      var t1 = VZ.txt(rd, 24, 62, "霍金温度 T ≈ " + mT.toFixed(1) + "×10", { size: 13, fill: C.cyan });
      var s1 = VZ.el("tspan", { dy: -5, "font-size": 9 }, t1);
      s1.textContent = (eT < 0 ? "−" + (-eT) : "" + eT);
      var u1 = VZ.el("tspan", { dy: 5 }, t1); u1.textContent = " K";
      /* 蒸发时间 ≈ 10^lg 年 */
      var t2 = VZ.txt(rd, 24, 86, "蒸发时间 ≈ 10", { size: 13, fill: C.gold });
      var s2 = VZ.el("tspan", { dy: -5, "font-size": 9 }, t2);
      s2.textContent = sup7(Math.round(lg));
      var u2 = VZ.el("tspan", { dy: 5 }, t2); u2.textContent = " 年（∝ M³）";
      VZ.txt(rd, 24, 108, "（黑洞越轻 → 越热 → 蒸发越快）", { size: 11, fill: C.dim });
    }
    render();

    /* 粒子对动画 */
    var pairs = [], now = 0, spawnT = 0, interval = 0.4;
    function spawn() {
      var tt = (Math.random() - 0.5) * 1.0;
      var x = bx + br * Math.sin(tt), y = by - br * Math.cos(tt);
      var nx = Math.sin(tt), ny = -Math.cos(tt);
      var g = VZ.g(svg);
      var esc = VZ.circ(g, x, y, 4, { fill: C.cyan });
      var fal = VZ.circ(g, x, y, 4, { fill: C.mag });
      pairs.push({ g: g, esc: esc, fal: fal, x: x, y: y, nx: nx, ny: ny,
                   len: 150 + Math.random() * 80, t0: now });
    }
    VZ.raf(svg, function (t, dt) {
      now = t;
      spawnT += dt;
      if (spawnT > interval) { spawnT = 0; if (pairs.length < 14) spawn(); }
      for (var i = pairs.length - 1; i >= 0; i--) {
        var P = pairs[i], age = t - P.t0, dur = 1.7;
        if (age > dur) { P.g.remove(); pairs.splice(i, 1); continue; }
        var u = age / dur;
        P.esc.setAttribute("cx", P.x + P.nx * u * P.len);
        P.esc.setAttribute("cy", P.y + P.ny * u * P.len);
        P.esc.setAttribute("opacity", 1 - u * 0.6);
        P.fal.setAttribute("cx", P.x - P.nx * u * P.len * 0.14);
        P.fal.setAttribute("cy", P.y - P.ny * u * P.len * 0.14);
        P.fal.setAttribute("opacity", Math.max(0, 1 - u * 1.8));
      }
    });

    VZ.slider(stage, {
      label: "黑洞质量（M☉）", value: 1, min: 1, max: 60, step: 0.5,
      format: function (v) { return v.toFixed(1) + " M☉"; },
      onInput: function (v) {
        M = v;
        interval = VZ.clamp(0.25 + 0.11 * v, 0.3, 3);
        render();
      }
    });
    VZ.legend(stage, [["逃逸粒子 → 成为霍金辐射", C.cyan], ["落入粒子 → 黑洞质量减小", C.mag]]);
  }
},

/* ============================================================
   ch30c · 客观缩减（OR）：叠加越重，塌得越快
   ============================================================ */
"f-ch30c": {
  title: "客观缩减（OR）：叠加越重，塌得越快",
  hint: "滑动叠加块的质量：按 Penrose 的量级估算 <b>τ_OR ∝ (m_P/m)²</b>，<span class='hl'>普朗克质量（2.2×10⁻⁸ kg）处约 1 秒</span>。电子要 10⁴⁴ 秒（10³⁷ 年）——微观叠加因此永远稳定；滑到 10⁻⁶ kg（一粒沙）只剩 10⁻⁴ 秒，叠加根本来不及形成。左看坍缩动画，右看 τ 在时间轴上的位置。",
  draw: function (stage) {
    var C = VZ.C, W = 760, H = 330;
    var svg = VZ.S(stage, W, H, { grid: true });
    var mP = 2.176e-8;
    var lm = -30;                                 /* log10(m) kg */
    function lgTau() { return 2 * (Math.log10(mP) - lm); }   /* log10(τ) 秒 */

    /* ---------- 左：叠加与坍缩动画 ---------- */
    VZ.card(svg, 20, 46, 300, 236, { stroke: C.faint });
    VZ.txt(svg, 170, 72, "一个叠加态的命运", { size: 13, fill: C.ink, anchor: "middle", weight: 700 });
    var blurF = VZ.blurFilter(svg, VZ.uid("bl"), 9);
    var lumpL = VZ.el("ellipse", { cx: 134, cy: 172, rx: 36, ry: 48, fill: C.cyan, opacity: .38, filter: blurF }, svg);
    var lumpR = VZ.el("ellipse", { cx: 206, cy: 172, rx: 36, ry: 48, fill: C.mag, opacity: .38, filter: blurF }, svg);
    VZ.txt(svg, 134, 248, "这里", { size: 11, fill: C.cyan, anchor: "middle" });
    VZ.txt(svg, 206, 248, "或那里", { size: 11, fill: C.mag, anchor: "middle" });
    var cnt = VZ.txt(svg, 170, 270, "", { size: 11, fill: C.dim, anchor: "middle" });
    var p = 2, cycT = 0, cyc = 0;
    VZ.raf(svg, function (t, dt) {
      cycT += dt;
      if (cycT > p) { cycT -= p; cyc++; }
      var u = cycT / p, breathe = 1 + 0.06 * Math.sin(t * 5);
      var winnerLeft = (cyc % 2 === 0);
      var oBoth = u < 0.68 ? 0.38 : VZ.clamp(0.38 * (1 - (u - 0.68) / 0.18), 0, 0.38);
      var oWin = u < 0.86 ? 0 : VZ.clamp((u - 0.86) / 0.14, 0, 1) * 0.62;
      var win = winnerLeft ? lumpL : lumpR, lose = winnerLeft ? lumpR : lumpL;
      lumpL.setAttribute("rx", 36 * breathe); lumpR.setAttribute("rx", 36 * breathe);
      lumpL.setAttribute("opacity", lumpL === win ? Math.max(oBoth, oWin) : oBoth);
      lumpR.setAttribute("opacity", lumpR === win ? Math.max(oBoth, oWin) : oBoth);
      cnt.textContent = u < 0.68 ? "叠加中……（示意周期 " + p.toFixed(1) + " s）"
                       : u < 0.86 ? "引力自有主张——开始坍缩！" : "定域在「" + (winnerLeft ? "这里" : "那里") + "」";
    });

    /* ---------- 右：时间轴（log10 τ 从 -44 到 46） ---------- */
    VZ.card(svg, 340, 46, 400, 236, { stroke: C.faint });
    VZ.txt(svg, 540, 72, "τ_OR ≈ 1 s × (m_P/m)²", { size: 13.5, fill: C.ink, anchor: "middle", weight: 700 });
    var ax0 = 372, ax1 = 714, axY = 200;
    var v2x = function (v) { return ax0 + (v + 44) / 90 * (ax1 - ax0); };
    VZ.ln(svg, ax0 - 6, axY, ax1 + 6, axY, { stroke: C.ink2, "stroke-width": 1.4 });
    [-40, -30, -20, -10, 0, 10, 20, 30, 40].forEach(function (v) {
      var x = v2x(v);
      VZ.ln(svg, x, axY - 4, x, axY + 4, { stroke: C.ink2, "stroke-width": 1 });
      VZ.txt(svg, x, axY + 20, "10" + sup7(v), { size: 9.5, fill: C.dim, anchor: "middle" });
    });
    VZ.txt(svg, 543, axY + 38, "秒（对数轴）", { size: 10.5, fill: C.dim, anchor: "middle" });
    /* 三个参照刻度 */
    [[-43, "普朗克时间"], [17.6, "宇宙年龄"]].forEach(function (mk) {
      var x = v2x(mk[0]);
      VZ.ln(svg, x, axY - 22, x, axY, { stroke: C.violet, "stroke-width": 1, "stroke-dasharray": "3 3" });
      VZ.txt(svg, x, axY - 28, mk[1], { size: 9.5, fill: C.violet, anchor: "middle" });
    });
    /* 当前 τ 标记（平滑滑动） */
    var disp = lgTau();
    var tri = VZ.poly(svg, [[0, -10], [-6, 2], [6, 2]], { fill: C.gold, stroke: "none" });
    var tauLbl = VZ.txt(svg, 0, 0, "", { size: 12.5, fill: C.gold, anchor: "middle", weight: 700 });
    var tauLbl2 = VZ.txt(svg, 0, 0, "", { size: 11, fill: C.gold, anchor: "middle", opacity: .8 });
    VZ.raf(svg, function (t, dt) {
      disp += (lgTau() - disp) * Math.min(1, dt * 8);
      var x = v2x(VZ.clamp(disp, -44, 46));
      tri.setAttribute("points", [[x, axY - 10], [x - 6, axY + 2], [x + 6, axY + 2]]);
      var tauSec = Math.pow(10, disp);
      tauLbl.setAttribute("x", VZ.clamp(x, 480, 640));
      tauLbl.setAttribute("y", axY - 66);
      tauLbl.textContent = "τ = " + fmt107(tauSec) + " s";
      tauLbl2.setAttribute("x", VZ.clamp(x, 480, 640));
      tauLbl2.setAttribute("y", axY - 49);
      tauLbl2.textContent = disp > Math.log10(3.156e7) ? "（" + fmt107(tauSec / 3.156e7) + " 年）" : "（不到一秒）";
    });
    VZ.txt(svg, 356, 118, "m = m_P ⇒ τ ≈ 1 s", { size: 10.5, fill: C.green });

    VZ.slider(stage, {
      label: "叠加质量 m", value: -30, min: -30, max: -6, step: 0.05,
      format: function (v) { return fmt107(Math.pow(10, v)) + " kg"; },
      onInput: function (v) { lm = v; p = VZ.clamp(0.5 + (lgTau() + 4) / 50 * 3.3, 0.5, 3.8); }
    });
  }
},

/* ============================================================
   ch31b · 紧致化：一根水管，远看是线，近看是管
   ============================================================ */
"f-ch31b": {
  title: "紧致化：放大一根「线」，卷起的维度浮现",
  hint: "拖动缩放滑块：<b>远看一根线，近看一根管</b>。管子上每个点的完整坐标其实是（位置 φ 轴, 圈上角度）——横轴大到看不见、圈维小到看不见时，多出的一维就「藏」了起来。弦论说：多余的 6 维正是这样卷在普朗克尺度上，<span class='hl'>你看不见它，不等于它不在</span>。右侧圆圈就是那卷起来的一维。",
  draw: function (stage) {
    var C = VZ.C, W = 760, H = 320;
    var svg = VZ.S(stage, W, H, { grid: true });
    var cy = 150, x1 = 70, x2 = 500;

    /* 管体（半径随缩放变化） */
    var body = VZ.path(svg, "", { fill: C.blue, opacity: .13, stroke: "none" });
    var top = VZ.path(svg, "", VZ.stroke({ stroke: C.blue, "stroke-width": 2 }));
    var bot = VZ.path(svg, "", VZ.stroke({ stroke: C.blue, "stroke-width": 2 }));
    var capL = VZ.ellipse ? null : null;
    capL = VZ.el("ellipse", { fill: C.deep, stroke: C.blue, "stroke-width": 1.6 }, svg);
    var capR = VZ.el("ellipse", { fill: C.panel, stroke: C.blue, "stroke-width": 1.6 }, svg);
    var axis = VZ.ln(svg, x1, cy, x2, cy, { stroke: C.faint, "stroke-width": 1, "stroke-dasharray": "5 5" });

    /* 轴向流光：沿管跑的光点（自绘，初始位置在路径上） */
    var flowDots = [];
    for (var fi = 0; fi < 2; fi++)
      flowDots.push(VZ.circ(svg, x1 + (x2 - x1) * fi / 2, cy, 3.5, { fill: C.cyan }));

    /* 右：卷起维的截面圆 */
    var secX = 620;
    var secC = VZ.circ(svg, secX, cy, 2, VZ.stroke({ stroke: C.violet, "stroke-width": 1.6, "stroke-dasharray": "5 4" }));
    var orbit = VZ.circ(svg, secX, cy, 5, { fill: C.gold });
    var orbitArc = VZ.path(svg, "", VZ.stroke({ stroke: C.gold, "stroke-width": 1.2, opacity: .7 }));
    VZ.txt(svg, secX, cy - 64, "卷起的一维（截面）", { size: 11.5, fill: C.violet, anchor: "middle" });
    VZ.txt(svg, secX, cy + 74, "绕一圈 = 一个内部坐标 φ", { size: 10.5, fill: C.dim, anchor: "middle" });

    /* 状态标签（远看/近看） */
    var farLbl = VZ.txt(svg, 285, cy - 78, "远看：只是一条线", { size: 14, fill: C.ink2, anchor: "middle", weight: 700 });
    var nearLbl = VZ.txt(svg, 285, cy - 78, "近看：每个点都是一个圆——多出一维", { size: 14, fill: C.gold, anchor: "middle", weight: 700 });
    var phiTag = VZ.g(svg);
    VZ.txt(phiTag, 300, 96, "φ（圈向坐标）", { size: 10.5, fill: C.gold, anchor: "middle" });

    function rOf(s) { return VZ.clamp((s - 1) * 2.0, 0.6, 46); }
    function redraw(s) {
      var r = rOf(s);
      body.setAttribute("d", "M" + x1 + " " + (cy - r) + "L" + x2 + " " + (cy - r) + "L" + x2 + " " + (cy + r) + "L" + x1 + " " + (cy + r) + "Z");
      top.setAttribute("d", "M" + x1 + " " + (cy - r) + "L" + x2 + " " + (cy - r));
      bot.setAttribute("d", "M" + x1 + " " + (cy + r) + "L" + x2 + " " + (cy + r));
      capL.setAttribute("cx", x1); capL.setAttribute("cy", cy);
      capL.setAttribute("rx", Math.max(r * .35, 1)); capL.setAttribute("ry", Math.max(r, 1));
      capR.setAttribute("cx", x2); capR.setAttribute("cy", cy);
      capR.setAttribute("rx", Math.max(r * .35, 1)); capR.setAttribute("ry", Math.max(r, 1));
      secC.setAttribute("r", Math.max(r * .9, 1.2));
      farLbl.setAttribute("opacity", r < 5 ? 1 : 0);
      nearLbl.setAttribute("opacity", r >= 5 ? 1 : 0);
      phiTag.setAttribute("opacity", r >= 26 ? 1 : 0);
      axis.setAttribute("opacity", r < 5 ? 1 : .35);
    }

    var s = 1;
    redraw(s);
    VZ.raf(svg, function (t) {
      for (var k = 0; k < 2; k++) {
        var u = ((t / 3.2 + k / 2) % 1 + 1) % 1;
        flowDots[k].setAttribute("cx", x1 + (x2 - x1) * u);
        flowDots[k].setAttribute("cy", cy);
        flowDots[k].setAttribute("opacity", 0.35 + 0.55 * Math.sin(Math.PI * u));
      }
      var r = rOf(s);
      if (r < 1.5) { orbit.setAttribute("opacity", 0); orbitArc.setAttribute("opacity", 0); return; }
      var a = t * 1.6;
      orbit.setAttribute("opacity", 1);
      orbit.setAttribute("cx", secX + r * Math.cos(a));
      orbit.setAttribute("cy", cy - r * Math.sin(a));
      var sweep = (a % (2 * Math.PI) + 2 * Math.PI) % (2 * Math.PI);
      var large = sweep > Math.PI ? 1 : 0;
      orbitArc.setAttribute("opacity", .7);
      orbitArc.setAttribute("d", "M" + secX + " " + (cy - r) +
        "A" + r + " " + r + " 0 " + large + " 1 " + (secX + r * Math.cos(a)).toFixed(1) + " " + (cy - r * Math.sin(a)).toFixed(1));
    });

    VZ.slider(stage, {
      label: "缩放倍率", value: 1, min: 1, max: 24, step: 0.5,
      format: function (v) { return "×" + v.toFixed(0); },
      onInput: function (v) { s = v; redraw(v); }
    });
  }
},

/* ============================================================
   ch31c · 弦振动谱：激发数 N 就是粒子表的一行
   ============================================================ */
"f-ch31c": {
  title: "弦振动谱：一种振动 = 一种粒子",
  hint: "点击不同的激发数 N：<b>驻波形状变了，「粒子身份」也跟着变</b>。开弦的质量公式 m²c² = (N−1)/α′——N=1 恰好无质量（光子一类的规范玻色子），N=0 是个快子（正是这个病逼出了超对称），N≥2 是有质量粒子。弦论的大一统野心就在这儿：<span class='hl'>不是给每种粒子单独造一个，而是一根弦的不同音</span>。",
  draw: function (stage) {
    var C = VZ.C, W = 760, H = 320;
    var svg = VZ.S(stage, W, H, { grid: true });
    var x1 = 130, x2 = 560, cy = 148;
    var L = x2 - x1;

    /* 端点（狄利克雷条件：弦两端固定） */
    VZ.circ(svg, x1, cy, 5.5, { fill: C.ink2 });
    VZ.circ(svg, x2, cy, 5.5, { fill: C.ink2 });
    VZ.txt(svg, x1 - 12, cy + 4, "固定", { size: 10, fill: C.dim, anchor: "end" });
    VZ.txt(svg, x2 + 12, cy + 4, "固定", { size: 10, fill: C.dim });
    /* 参考直线 */
    VZ.ln(svg, x1, cy, x2, cy, { stroke: C.faint, "stroke-width": 1, "stroke-dasharray": "5 5" });

    var str = VZ.path(svg, "", VZ.stroke({ stroke: C.cyan, "stroke-width": 2.4 }));
    var nodesG = VZ.g(svg);          /* 波节标记 */
    var glow = VZ.blurFilter(svg, VZ.uid("gl"), 5);

    var out = VZ.panel(stage, { "激发数 N": "", "m²c²": "", "粒子身份": "" });
    var N = 1;
    function setN(n) {
      N = n;
      var ids = ["快子 m² < 0（这个病由超弦治好）", "无质量 · 规范玻色子（光子的角色）",
                 "有质量粒子 m ∝ 1/√α′", "有质量粒子 m ∝ √2/√α′", "有质量粒子 m ∝ √3/√α′"];
      VZ.setPanel(out, {
        "激发数 N": String(n),
        "m²c²": n === 0 ? "−1/α′" : (n === 1 ? "0" : (n - 1) + "/α′"),
        "粒子身份": ids[n]
      });
      /* 波节标记 */
      nodesG.innerHTML = "";
      for (var k = 1; k < n; k++) {
        var nx = x1 + L * k / n;
        VZ.circ(nodesG, nx, cy, 2.5, { fill: C.gold });
      }
    }
    setN(1);

    VZ.raf(svg, function (t) {
      var A = N === 0 ? 0 : VZ.clamp(52 / N, 12, 52);
      var ph = Math.cos(2 * Math.PI * 1.1 * t);
      var d = "";
      for (var i = 0; i <= 110; i++) {
        var u = i / 110;
        var x = x1 + L * u;
        var y = cy - A * Math.sin(Math.PI * N * u) * ph;
        d += (i ? "L" : "M") + x.toFixed(1) + " " + y.toFixed(1);
      }
      str.setAttribute("d", d);
      str.setAttribute("filter", N > 0 ? "url(#" + glow.id + ")" : "none");
    });

    VZ.chips(stage, ["N=0", "N=1", "N=2", "N=3", "N=4"], "N=1", function (m) { setN(parseInt(m.slice(2), 10)); });
    VZ.note(stage, "α′ 是弦标度（弦张力的倒数），它定下了唯一的质量单位——弦论里没有可调参数的自由。");
  }
},

/* ============================================================
   ch32b · 自旋网络：重耦合，内部边标签重排
   ============================================================ */
"f-ch32b": {
  title: "自旋网络：重耦合时，内部边的标签重排",
  hint: "点击中间的金色标签（或「重耦合」按钮）：内部边 j 在允许值 <b>0、1、2</b> 之间轮换——三角形条件 Δ(j₁,j₂,j) 与 Δ(j₃,j₄,j) 始终成立。j=0 时边可以整个删掉，两个顶点融成一个：<span class='hl'>空间的最小单元不是「点」，而是这张网的允许关系</span>。边越粗，自旋标签越大，对应的面积量子越大。",
  draw: function (stage) {
    var C = VZ.C, W = 760, H = 340;
    var svg = VZ.S(stage, W, H, { grid: true });
    var A = { x: 250, y: 168 }, B = { x: 510, y: 168 };
    var jvals = [1, 1, 1, 1];                     /* j1 j2（左侧外腿）j3 j4（右侧外腿） */
    var jIn = 1, allowed = [0, 1, 2];

    function edgeD(p, q, bow) {
      if (!bow) return "M" + p.x + " " + p.y + "L" + q.x + " " + q.y;
      var mx = (p.x + q.x) / 2, my = (p.y + q.y) / 2;
      var nx = -(q.y - p.y), ny = (q.x - p.x), nl = Math.hypot(nx, ny) || 1;
      return "M" + p.x + " " + p.y + "Q" + (mx + nx / nl * bow) + " " + (my + ny / nl * bow) + " " + q.x + " " + q.y;
    }
    function badge(x, y, label, col) {
      var g = VZ.g(svg);
      VZ.circ(g, x, y, 12, { fill: "rgba(10,6,28,.94)", stroke: col, "stroke-width": 1.5 });
      VZ.txt(g, x, y + 4.5, label, { size: 12, fill: col, anchor: "middle", weight: 700 });
      return g;
    }

    /* 四条外腿（固定） */
    var stubs = [
      { p: A, q: { x: 92, y: 66 }, lab: "j₁" }, { p: A, q: { x: 92, y: 272 }, lab: "j₂" },
      { p: B, q: { x: 668, y: 66 }, lab: "j₃" }, { p: B, q: { x: 668, y: 272 }, lab: "j₄" }
    ];
    stubs.forEach(function (s) {
      VZ.path(svg, edgeD(s.p, s.q, 0), VZ.stroke({ stroke: C.ink2, "stroke-width": 1.6 }));
      badge((s.p.x + s.q.x) / 2 - 26, (s.p.y + s.q.y) / 2 - 12, s.lab, C.ink2);
    });

    /* 内部边（可重耦合） */
    var innerPath = VZ.path(svg, "", VZ.stroke({ stroke: C.gold, "stroke-width": 3 }));
    var innerGlow = VZ.blurFilter(svg, VZ.uid("ig"), 4);
    var innerGlowPath = VZ.path(svg, "", VZ.stroke({ stroke: C.gold, "stroke-width": 3, opacity: .5, filter: innerGlow }));
    var jBadge = null, jx = 380, jy = 168;

    /* 顶点 */
    [A, B].forEach(function (n) {
      VZ.circ(svg, n.x, n.y, 17, { fill: C.panel, stroke: C.cyan, "stroke-width": 1.8 });
      VZ.txt(svg, n.x, n.y + 4, "v", { size: 12, fill: C.cyan, anchor: "middle", weight: 700 });
    });
    var pulse = VZ.circ(svg, A.x, A.y, 17, { stroke: C.gold, fill: "none", "stroke-width": 2, opacity: 0 });
    var pulse2 = VZ.circ(svg, B.x, B.y, 17, { stroke: C.gold, fill: "none", "stroke-width": 2, opacity: 0 });

    function redrawInner() {
      var bow = jIn === 0 ? 0 : (jIn - 1) * 20;
      var d = edgeD(A, B, bow);
      innerPath.setAttribute("d", d);
      innerGlowPath.setAttribute("d", d);
      var w = jIn === 0 ? 1.2 : 1.4 + jIn * 1.2;
      innerPath.setAttribute("stroke-width", w);
      innerPath.setAttribute("stroke-dasharray", jIn === 0 ? "4 5" : "none");
      if (jBadge) jBadge.remove();
      var dy = jIn === 2 ? -16 : 0;
      jBadge = badge(jx, jy + dy, "j=" + jIn, C.gold);
      jBadge.style.cursor = "pointer";
      jBadge.addEventListener("click", recouple);
    }
    function recouple() {
      var i = allowed.indexOf(jIn);
      jIn = allowed[(i + 1) % allowed.length];
      redrawInner();
      pulse.setAttribute("opacity", .9); pulse2.setAttribute("opacity", .9);
      VZ.setPanel(out, {
        "内部边 j": String(jIn),
        "Δ(j₁,j₂,j)": "Δ(1,1," + jIn + ") ✓",
        "Δ(j₃,j₄,j)": "Δ(1,1," + jIn + ") ✓",
        "面积（示意）": jIn === 0 ? "0（边可删，顶点融合）" : "∝ √(j(j+1))"
      });
    }
    redrawInner();
    VZ.raf(svg, function (t, dt) {
      [pulse, pulse2].forEach(function (p) {
        var o = parseFloat(p.getAttribute("opacity"));
        if (o > 0) {
          p.setAttribute("opacity", Math.max(0, o - dt * 1.4));
          p.setAttribute("r", 17 + (1 - o) * 14);
        }
      });
    });

    var out = VZ.panel(stage, { "内部边 j": "1", "Δ(j₁,j₂,j)": "Δ(1,1,1) ✓", "Δ(j₃,j₄,j)": "Δ(1,1,1) ✓", "面积（示意）": "∝ √(j(j+1))" });
    VZ.btn(stage, "重耦合", recouple);
    VZ.legend(stage, [["内部边（点击重耦合）", C.gold], ["外腿标签固定", C.ink2]]);
  }
},

/* ============================================================
   ch32c · 圈变量：拖一条闭合回路穿过自旋网，累计和乐相位
   ============================================================ */
"f-ch32c": {
  title: "圈变量：拖着回路量自旋网，相位一路累计",
  hint: "<b>拖动金色回路</b>在自旋网上移动：每「套住」一条边，就把它的自旋标签计入和乐（holonomy）。看右上的相位表盘——<span class='hl'>回来的矢量转了多少，只取决于回路绕过了哪些标签</span>，跟你走多快、走成什么形状都无关。这正是「引力 = 规范场」在圈表述里的长相。",
  draw: function (stage) {
    var C = VZ.C, W = 760, H = 360;
    var svg = VZ.S(stage, W, H, { grid: true });

    /* 自旋网：六边形 + 中心 */
    var nodes = [[380, 70], [552, 132], [552, 252], [380, 314], [208, 252], [208, 132], [380, 192]];
    var edges = [
      [0, 1, 2], [1, 2, 3], [2, 3, 2], [3, 4, 1], [4, 5, 2], [5, 0, 1],   /* 环 */
      [6, 0, 2], [6, 1, 1], [6, 2, 3], [6, 3, 1], [6, 4, 2], [6, 5, 1]    /* 辐条 */
    ];
    var edgeEls = [];
    edges.forEach(function (e) {
      var el = VZ.path(svg, "M" + nodes[e[0]][0] + " " + nodes[e[0]][1] + "L" + nodes[e[1]][0] + " " + nodes[e[1]][1],
        VZ.stroke({ stroke: C.ink2, "stroke-width": 1.6 }));
      edgeEls.push(el);
    });
    edges.forEach(function (e) {   /* 标签放在边中点附近（辐条偏移避免重叠） */
      var mx = (nodes[e[0]][0] + nodes[e[1]][0]) / 2, my = (nodes[e[0]][1] + nodes[e[1]][1]) / 2;
      if (e[0] === 6 || e[1] === 6) { mx += (mx - 380) * 0.22; my += (my - 192) * 0.22; }
      VZ.txt(svg, mx, my - 5, "j=" + e[2], { size: 9.5, fill: C.dim, anchor: "middle" });
    });
    nodes.forEach(function (n, i) {
      VZ.circ(svg, n[0], n[1], i === 6 ? 7 : 6, { fill: C.panel, stroke: C.cyan, "stroke-width": 1.6 });
    });

    /* 可拖回路 */
    var R = 62, cx = 260, cy = 120;
    var loop = VZ.circ(svg, cx, cy, R, VZ.stroke({ stroke: C.gold, "stroke-width": 2.6, "stroke-dasharray": "10 7" }));
    var loopGlow = VZ.circ(svg, cx, cy, R, VZ.stroke({ stroke: C.gold, "stroke-width": 6, opacity: .25 }));
    var hit = VZ.circ(svg, cx, cy, R, { fill: "rgba(255,255,255,.01)", stroke: "none" });

    /* 相位表盘 */
    var dial = VZ.g(svg);
    VZ.circ(dial, 696, 52, 30, { fill: "rgba(10,6,28,.9)", stroke: C.faint, "stroke-width": 1.2 });
    var needle = VZ.ln(dial, 696, 52, 696, 26, VZ.stroke({ stroke: C.gold, "stroke-width": 2.2 }));
    VZ.txt(svg, 696, 96, "holonomy 相位", { size: 9.5, fill: C.dim, anchor: "middle" });

    var readout = VZ.txt(svg, 24, 30, "", { size: 13.5, fill: C.ink, weight: 700 });
    var sub = VZ.txt(svg, 24, 50, "拖动金色回路", { size: 11.5, fill: C.dim });
    var dispAng = 0, targetAng = 0;

    function distSeg(px, py, x1, y1, x2, y2) {
      var dx = x2 - x1, dy = y2 - y1;
      var t = ((px - x1) * dx + (py - y1) * dy) / (dx * dx + dy * dy || 1);
      t = VZ.clamp(t, 0, 1);
      return Math.hypot(px - (x1 + t * dx), py - (y1 + t * dy));
    }
    function update() {
      loop.setAttribute("cx", cx); loop.setAttribute("cy", cy);
      loopGlow.setAttribute("cx", cx); loopGlow.setAttribute("cy", cy);
      hit.setAttribute("cx", cx); hit.setAttribute("cy", cy);
      var k = 0, sum = 0;
      edges.forEach(function (e, i) {
        var d = distSeg(cx, cy, nodes[e[0]][0], nodes[e[0]][1], nodes[e[1]][0], nodes[e[1]][1]);
        var inside = d < R;
        edgeEls[i].setAttribute("stroke", inside ? C.gold : C.ink2);
        edgeEls[i].setAttribute("stroke-width", inside ? 3 : 1.6);
        edgeEls[i].setAttribute("opacity", inside ? 1 : .55);
        if (inside) { k++; sum += e[2]; }
      });
      targetAng = (sum * 90) % 360;
      readout.textContent = "套住 " + k + " 条边 · Σj = " + sum + " · γ = Σj×90°";
      sub.textContent = "γ = exp(i·Σj·90°) → 表盘 " + targetAng + "°（示意：θ₀=90°/单位标签）";
    }
    update();

    VZ.drag(svg, hit, W, H, function (x, y, phase) {
      if (phase === "start" || phase === "move") {
        cx = VZ.clamp(x, 60, 700);
        cy = VZ.clamp(y, 56, 304);
        update();
      }
    });

    VZ.raf(svg, function (t, dt) {
      /* 回路虚线流动，指示绕行方向 */
      var off = (parseFloat(loop.getAttribute("stroke-dashoffset") || 0) - dt * 26) % 17;
      loop.setAttribute("stroke-dashoffset", off);
      loopGlow.setAttribute("stroke-dashoffset", off);
      /* 表盘指针平滑追踪 */
      var d = targetAng - dispAng;
      while (d > 180) d -= 360; while (d < -180) d += 360;
      dispAng += d * Math.min(1, dt * 7);
      var a = dispAng * Math.PI / 180;
      needle.setAttribute("x2", 696 + 26 * Math.sin(a));
      needle.setAttribute("y2", 52 - 26 * Math.cos(a));
    });

    VZ.legend(stage, [["被回路套住的边（计入相位）", C.gold], ["未套住的边", C.ink2]]);
  }
},

/* ============================================================
   ch33b · 扭量 = 光线：一族零线交汇成一个时空点
   ============================================================ */
"f-ch33b": {
  title: "扭量 = 光线：一束零线在扭量空间里是一条线",
  hint: "<b>拖动左边的事件点 P</b>、再用滑块旋转观察方向：过 P 的一族零线（光线历史）在左图交汇于一点，在右边的扭量空间里却<span class='hl'>排成一条直线</span>。倒过来读：扭量空间的一个点 = 时空的一条零线；扭量空间的一条线 = 时空的一个事件。扭量几何把「哪里」换成了「哪束光经过它」。",
  draw: function (stage) {
    var C = VZ.C, W = 760, H = 340;
    var svg = VZ.S(stage, W, H, { grid: true });

    /* 左：时空图（拖事件点） */
    VZ.card(svg, 22, 44, 330, 268, { stroke: C.faint });
    VZ.txt(svg, 36, 66, "时空：过 P 的一族零线", { size: 12.5, fill: C.ink, weight: 700 });
    var L0 = 22, T0 = 44, L1 = 352, T1 = 312;
    var P = { x: 187, y: 190 };
    var theta = 0;                      /* 观察方向（度） */
    var N = 12;
    var rayEls = [], dotEls = [];

    function raySeg(x0, y0, ang) {
      /* 与左卡片边界求交，返回穿过 P 的完整弦 [x1,y1,x2,y2] */
      var dx = Math.cos(ang), dy = -Math.sin(ang);
      function edgeT(sx, sy) {
        var ts = [];
        if (sx !== 0) { ts.push((L0 + 4 - x0) / sx, (L1 - 4 - x0) / sx); }
        if (sy !== 0) { ts.push((T0 + 4 - y0) / sy, (T1 - 4 - y0) / sy); }
        ts = ts.filter(function (t) { return t > 0; }).sort(function (a, b) { return a - b; });
        return ts[0] || 0;
      }
      var tA = edgeT(dx, dy), tB = edgeT(-dx, -dy);
      return [x0 - dx * tB, y0 - dy * tB, x0 + dx * tA, y0 + dy * tA];
    }
    for (var i = 0; i < N; i++) {
      rayEls.push(VZ.path(svg, "", VZ.stroke({ stroke: C.cyan, "stroke-width": i % 3 === 0 ? 1.8 : 1.1, opacity: .75, "stroke-dasharray": "10 6" })));
      dotEls.push(VZ.circ(svg, 0, 0, 4.2, { fill: C.cyan }));
    }
    var pGlow = VZ.blurFilter(svg, VZ.uid("pg"), 6);
    var pDot = VZ.circ(svg, P.x, P.y, 8, { fill: C.gold, filter: pGlow });
    var pHit = VZ.circ(svg, P.x, P.y, 16, { fill: "rgba(255,255,255,.01)", stroke: "none", cursor: "grab" });
    var pLbl = VZ.txt(svg, P.x + 14, P.y - 12, "事件 P", { size: 12, fill: C.gold, weight: 700 });

    /* 右：扭量空间 */
    VZ.card(svg, 408, 44, 330, 268, { stroke: C.faint });
    VZ.txt(svg, 422, 66, "扭量空间：一族零线 = 一条线", { size: 12.5, fill: C.ink, weight: 700 });
    var twLine = VZ.path(svg, "", VZ.stroke({ stroke: C.ink, "stroke-width": 2 }));
    var twLbl = VZ.txt(svg, 573, 300, "", { size: 10.5, fill: C.dim, anchor: "middle" });

    function redraw() {
      var th0 = theta * Math.PI / 180;
      var dirx = 1, diry = -0.38, dl = Math.hypot(dirx, diry);
      var lineC = { x: 573 + (P.x - 187) * 0.85, y: 186 + (P.y - 190) * 0.85 };
      for (var i = 0; i < N; i++) {
        var a = th0 + i * 2 * Math.PI / N;
        var s = raySeg(P.x, P.y, a);
        rayEls[i].setAttribute("d", "M" + s[0].toFixed(1) + " " + s[1].toFixed(1) + "L" + s[2].toFixed(1) + " " + s[3].toFixed(1));
        /* 右图：沿一条直线排布，观察方向决定滑移 */
        var off = (i - (N - 1) / 2) * 19 + (theta / 360) * 8;
        dotEls[i].setAttribute("cx", lineC.x + dirx / dl * off);
        dotEls[i].setAttribute("cy", lineC.y + diry / dl * off);
        dotEls[i].setAttribute("fill", i === 0 ? C.gold : C.cyan);
      }
      var half = 120;
      twLine.setAttribute("d", "M" + (lineC.x - dirx / dl * half).toFixed(1) + " " + (lineC.y - diry / dl * half).toFixed(1) +
        "L" + (lineC.x + dirx / dl * half).toFixed(1) + " " + (lineC.y + diry / dl * half).toFixed(1));
      twLbl.textContent = "这条线在 PT 里就「是」事件 P";
      pDot.setAttribute("cx", P.x); pDot.setAttribute("cy", P.y);
      pHit.setAttribute("cx", P.x); pHit.setAttribute("cy", P.y);
      pLbl.setAttribute("x", P.x + 14); pLbl.setAttribute("y", P.y - 12);
    }
    redraw();

    VZ.raf(svg, function (t, dt) {
      var off = (t * 30) % 12;
      for (var i = 0; i < N; i++) rayEls[i].setAttribute("stroke-dashoffset", -off);
    });
    VZ.drag(svg, pHit, W, H, function (x, y, phase) {
      if (phase === "start" || phase === "move") {
        P.x = VZ.clamp(x, 48, 326);
        P.y = VZ.clamp(y, 76, 286);
        redraw();
      }
    });
    VZ.slider(stage, {
      label: "观察方向 θ", value: 0, min: 0, max: 360, step: 1,
      format: function (v) { return v.toFixed(0) + "°"; },
      onInput: function (v) { theta = v; redraw(); }
    });
    VZ.legend(stage, [["零线（光线历史）", C.cyan], ["事件 P / 对应的整族光线", C.gold]]);
  }
},

/* ============================================================
   ch33c · 共形变换：反演之下圆仍是圆，角度分毫不变
   ============================================================ */
"f-ch33c": {
  title: "共形变换：圆仍是圆，角仍是角",
  hint: "<b>拖动蓝色圆</b>、再用滑块改反演半径 R：左边是原平面，右边是它经过反演 w = R²·(z−c)/|z−c|² 后的样子。<b>看两件事</b>：圆没有变成别的曲线（过反演中心的会展开成直线）；两圆的夹角 α <span class='hl'>读数前后一模一样</span>。保角不改长度——这正是扭量理论「只认角度、不认距离」的共形结构。",
  draw: function (stage) {
    var C = VZ.C, W = 760, H = 380;
    var svg = VZ.S(stage, W, H, { grid: true });
    var LX = 25, LY = 52, LW = 320, LH = 296;        /* 左盒 */
    var c = { x: 185, y: 205 };                       /* 反演中心 */
    var R = 90;

    function invX(p) {                                /* 左图坐标 → 右图坐标 */
      var dx = p.x - c.x, dy = p.y - c.y, d2 = dx * dx + dy * dy;
      if (d2 < 1e-6) return null;
      var k = R * R / d2;
      return { x: 415 + (c.x + dx * k - LX), y: LY + (c.y + dy * k - LY) };
    }
    function circleSamples(ctr, r, n) {
      var out = [];
      for (var i = 0; i <= n; i++) {
        var a = i / n * 2 * Math.PI;
        out.push({ x: ctr.x + r * Math.cos(a), y: ctr.y + r * Math.sin(a) });
      }
      return out;
    }
    function drawMapped(parent, samples, color, width, dash) {
      /* 采样点反演后画到右盒，越界点断笔 */
      var d = "", pen = false;
      for (var i = 0; i < samples.length; i++) {
        var q = invX(samples[i]);
        if (!q || q.x < 417 || q.x > 733 || q.y < LY + 2 || q.y > LY + LH - 2) { pen = false; continue; }
        d += (pen ? "L" : "M") + q.x.toFixed(1) + " " + q.y.toFixed(1);
        pen = true;
      }
      return VZ.path(parent, d, VZ.stroke({ stroke: color, "stroke-width": width, "stroke-dasharray": dash || "none" }));
    }

    /* 左盒固定场景：圆 B、直线 L、反演中心 c */
    var Bc = { x: 280, y: 150 }, Br = 65;
    var lineY = 318;
    var Ac = { x: 275, y: 255 }, Ar = 65;             /* 可拖 */
    VZ.ln(svg, LX, lineY, LX + LW, lineY, VZ.stroke({ stroke: C.green, "stroke-width": 1.8 }));
    VZ.txt(svg, LX + 6, lineY - 7, "直线（过 c 时会变成圆）", { size: 10, fill: C.green });
    var cCross = VZ.g(svg);
    VZ.ln(cCross, c.x - 7, c.y - 7, c.x + 7, c.y + 7, { stroke: C.mag, "stroke-width": 1.6 });
    VZ.ln(cCross, c.x - 7, c.y + 7, c.x + 7, c.y - 7, { stroke: C.mag, "stroke-width": 1.6 });
    VZ.txt(svg, c.x + 12, c.y + 4, "反演中心 c", { size: 10.5, fill: C.mag });
    var invCircle = VZ.circ(svg, c.x, c.y, R, { stroke: C.faint, "stroke-width": 1, "stroke-dasharray": "4 5" });

    var circA = VZ.path(svg, "", VZ.stroke({ stroke: C.blue, "stroke-width": 2.2 }));
    var circB = VZ.path(svg, "", VZ.stroke({ stroke: C.blue, "stroke-width": 2.2, opacity: .55 }));
    var hitA = VZ.circ(svg, Ac.x, Ac.y, 22, { fill: "rgba(255,255,255,.01)", stroke: "none" });
    var aLbl = VZ.txt(svg, Ac.x, Ac.y + Ar + 16, "拖我", { size: 10.5, fill: C.blue, anchor: "middle" });

    /* 右盒映射曲线 */
    var mA = null, mB = null, mL = null, qMarkL = null, qMarkR = null;
    var angLbl = VZ.txt(svg, 575, 372, "", { size: 13, fill: C.gold, anchor: "middle", weight: 700 });
    var angLblL = VZ.txt(svg, 0, 0, "", { size: 12, fill: C.gold, anchor: "middle", weight: 700 });

    function circIntersect(c1, r1, c2, r2) {
      var dx = c2.x - c1.x, dy = c2.y - c1.y, d = Math.hypot(dx, dy);
      if (d < Math.abs(r1 - r2) || d > r1 + r2 || d === 0) return null;
      var a = (r1 * r1 - r2 * r2 + d * d) / (2 * d);
      var h2 = r1 * r1 - a * a;
      if (h2 < 0) return null;
      var mx = c1.x + dx * a / d, my = c1.y + dy * a / d;
      var h = Math.sqrt(h2);
      return { x: mx - dy / d * h, y: my + dx / d * h };   /* 取一个交点 */
    }
    function tangAngle(c1, r1, c2, r2, q) {
      var t1 = { x: -(q.y - c1.y), y: q.x - c1.x };
      var t2 = { x: -(q.y - c2.y), y: q.x - c2.x };
      var cs = (t1.x * t2.x + t1.y * t2.y) / (Math.hypot(t1.x, t1.y) * Math.hypot(t2.x, t2.y));
      return Math.acos(VZ.clamp(cs, -1, 1)) * 180 / Math.PI;
    }

    function redraw() {
      invCircle.setAttribute("r", R);
      circA.setAttribute("d", ""); circB.setAttribute("d", "");
      var sA = circleSamples(Ac, Ar, 140), sB = circleSamples(Bc, Br, 140);
      circA.setAttribute("d", "M" + sA.map(function (p) { return p.x.toFixed(1) + " " + p.y.toFixed(1); }).join("L") + "Z");
      circB.setAttribute("d", "M" + sB.map(function (p) { return p.x.toFixed(1) + " " + p.y.toFixed(1); }).join("L") + "Z");
      if (mA) mA.remove(); if (mB) mB.remove(); if (mL) mL.remove();
      mA = drawMapped(svg, sA, C.blue, 2.2);
      mB = drawMapped(svg, sB, C.blue, 2.2, "none");
      /* 直线 → 映射（一般变成过 c 的圆） */
      var ls = [];
      for (var i = 0; i <= 90; i++) ls.push({ x: LX + LW * i / 90, y: lineY });
      mL = drawMapped(svg, ls, C.green, 1.8);

      hitA.setAttribute("cx", Ac.x); hitA.setAttribute("cy", Ac.y);
      aLbl.setAttribute("x", Ac.x); aLbl.setAttribute("y", Ac.y + Ar + 16);

      /* 交点与夹角 */
      if (qMarkL) qMarkL.remove(); if (qMarkR) qMarkR.remove();
      var q = circIntersect(Ac, Ar, Bc, Br);
      if (q) {
        qMarkL = VZ.circ(svg, q.x, q.y, 4.5, { fill: C.gold });
        var alpha = tangAngle(Ac, Ar, Bc, Br, q);
        /* 映射后的夹角：在 q 两侧各取邻近点，比较映射后的切向 */
        var e = 0.8;
        function mapTangent(ctr, r) {
          var a1 = Math.atan2(q.y - ctr.y, q.x - ctr.x);
          var p1 = { x: ctr.x + r * Math.cos(a1 - e / r), y: ctr.y + r * Math.sin(a1 - e / r) };
          var p2 = { x: ctr.x + r * Math.cos(a1 + e / r), y: ctr.y + r * Math.sin(a1 + e / r) };
          var w1 = invX(p1), w2 = invX(p2);
          return { x: w2.x - w1.x, y: w2.y - w1.y };
        }
        var tA = mapTangent(Ac, Ar), tB = mapTangent(Bc, Br);
        var cs = (tA.x * tB.x + tA.y * tB.y) / (Math.hypot(tA.x, tA.y) * Math.hypot(tB.x, tB.y));
        var beta = Math.acos(VZ.clamp(cs, -1, 1)) * 180 / Math.PI;
        var wq = invX(q);
        if (wq) qMarkR = VZ.circ(svg, wq.x, wq.y, 4.5, { fill: C.gold });
        angLbl.textContent = "夹角：反演前 α = " + alpha.toFixed(1) + "°　→　反演后 β = " + beta.toFixed(1) + "°（不变 ✓）";
        angLblL.setAttribute("x", q.x); angLblL.setAttribute("y", q.y - 12);
        angLblL.textContent = "α=" + alpha.toFixed(1) + "°";
      } else {
        angLbl.textContent = "两圆不相交——把蓝色圆拖近红圈试试";
        angLblL.textContent = "";
      }
    }
    redraw();

    VZ.drag(svg, hitA, W, H, function (x, y, phase) {
      if (phase === "start" || phase === "move") {
        var nx = VZ.clamp(x, LX + Ar * 0.5, LX + LW - Ar * 0.5);
        var ny = VZ.clamp(y, LY + Ar * 0.5, LY + LH - Ar * 0.5);
        var dc = Math.hypot(nx - c.x, ny - c.y);
        if (dc < 76) { nx = c.x + (nx - c.x) / dc * 76; ny = c.y + (ny - c.y) / dc * 76; }
        Ac.x = nx; Ac.y = ny;
        redraw();
      }
    });

    VZ.slider(stage, {
      label: "反演半径 R", value: 90, min: 50, max: 130, step: 1,
      format: function (v) { return v.toFixed(0); },
      onInput: function (v) { R = v; redraw(); }
    });
    VZ.legend(stage, [["左：原平面（拖蓝圆）", C.blue], ["右：反演后的像", C.blue], ["交点与夹角", C.gold]]);
  }
},

/* ============================================================
   ch34b · 三个世界，三个谜：点击谜题，高亮依赖链
   ============================================================ */
"f-ch34b": {
  title: "三个世界，三个谜——本书只碰谜①",
  hint: "点击下方 <b>谜①②③</b>：对应的两块世界亮起、其余暗下去，底部给出它的依赖链。<span class='hl'>谜③是谜①的前提</span>（心智不通达数学，谜①根本提不出来），而谜①是全书 1124 页的全部内容；谜②③作者明说自己不知道答案——它们是这本书的边界条件。",
  draw: function (stage) {
    var C = VZ.C, W = 760, H = 400;
    var svg = VZ.S(stage, W, H, { grid: true });
    var worlds = {
      plat: { x: 380, y: 92, r: 48, name: "柏拉图世界", sub: "永恒数学结构", c: C.cyan },
      phys: { x: 165, y: 258, r: 48, name: "物理世界", sub: "物质与时间", c: C.gold },
      mind: { x: 595, y: 258, r: 48, name: "心智世界", sub: "感受与理解", c: C.mag }
    };
    var mys = [
      { key: "①", a: "plat", b: "phys", label: "数学为何恰好描述物理？", c: C.cyan,
        chain: "谜③ ⟶ 谜① ⟶（本书到此为止）", detail: "数学凭审美自由发明，却精确到小数点后十几位地命中物理世界。这个谜有可操作的数学工具，所以全书 34 章只处理它。" },
      { key: "②", a: "phys", b: "mind", label: "物质如何产生心智？", c: C.gold,
        chain: "谜①（物理的数学结构）⟶ 谜② ⟶ ？", detail: "神经元电化学是物理的，「痛」与「红」却是主观的。作者 §34.6 明说：他不知道答案，只把它放在书的末尾作为提醒。" },
      { key: "③", a: "mind", b: "plat", label: "心智何以通达数学？", c: C.mag,
        chain: "谜③ ⟶（没有它，谜①连问题都提不出）", detail: "一个独立于我们又无限精确的世界，凭什么被我们理解？作者同样不解，但强调：没有谜③，数学与物理的对话无从谈起。" }
    ];

    /* 三条连线（弧） */
    mys.forEach(function (m) {
      var A = worlds[m.a], B = worlds[m.b];
      var mx = (A.x + B.x) / 2, my = (A.y + B.y) / 2;
      var nx = -(B.y - A.y), ny = (B.x - A.x), nl = Math.hypot(nx, ny);
      var cxp = mx + nx / nl * 30, cyp = my + ny / nl * 30;
      m.d = "M" + A.x + " " + A.y + "Q" + cxp + " " + cyp + " " + B.x + " " + B.y;
      m.edge = VZ.path(svg, m.d, VZ.stroke({ stroke: m.c, "stroke-width": 2, opacity: .5, "stroke-dasharray": "7 6" }));
    });
    /* 世界圆 */
    Object.keys(worlds).forEach(function (k) {
      var n = worlds[k];
      n.glowEl = VZ.circ(svg, n.x, n.y, n.r + 5, { fill: n.c, opacity: .16, filter: VZ.blurFilter(svg, VZ.uid("w"), 7) });
      var g = VZ.g(svg);
      n.body = VZ.circ(g, n.x, n.y, n.r, { fill: "rgba(12,8,32,.9)", stroke: n.c, "stroke-width": 1.8 });
      VZ.txt(g, n.x, n.y - 4, n.name, { size: 12.5, fill: n.c, anchor: "middle", weight: 700 });
      VZ.txt(g, n.x, n.y + 14, n.sub, { size: 10, fill: C.dim, anchor: "middle" });
    });

    /* 底部说明板 */
    var pb = VZ.g(svg);
    VZ.el("rect", { x: 20, y: 316, width: 720, height: 74, rx: 10, fill: "rgba(255,255,255,.045)", stroke: C.faint }, pb);
    var pT = VZ.txt(pb, 36, 338, "", { size: 13.5, fill: C.cyan, weight: 700 });
    var pD = VZ.g(pb);
    var pC = VZ.txt(pb, 704, 338, "", { size: 11, fill: C.dim, anchor: "end" });

    function show(m) {
      pT.textContent = "谜" + m.key + "　" + m.label;
      pT.setAttribute("fill", m.c);
      pC.textContent = "依赖链：" + m.chain;
      pD.innerHTML = "";
      VZ.para(pD, 36, 356, m.detail, { size: 11.5, per: 58, lh: 17 });
      mys.forEach(function (x) {
        var on = x === m;
        x.edge.setAttribute("opacity", on ? 1 : .12);
        x.edge.setAttribute("stroke-width", on ? 3.2 : 1.4);
      });
      var inA = m.a, inB = m.b;
      Object.keys(worlds).forEach(function (k) {
        var on = (k === inA || k === inB);
        worlds[k].body.setAttribute("opacity", on ? 1 : .25);
        worlds[k].glowEl.setAttribute("opacity", on ? .3 : .04);
      });
    }
    show(mys[0]);

    VZ.chips(stage, ["谜① 数学合用", "谜② 物质→心智", "谜③ 心智→数学"], "谜① 数学合用", function (s) {
      var m = mys[0];
      for (var i = 0; i < mys.length; i++) if (s.indexOf(mys[i].key) >= 0) m = mys[i];
      show(m);
    });
  }
},

/* ============================================================
   ch34c · 理论地图：四条路线与实验接触面
   ============================================================ */
"f-ch34c": {
  title: "理论地图：四条路线，离实验各有多远",
  hint: "点击任意一条路线（或下方选块）：<b>路的宽窄 = 它与实验接触面的大小</b>。标准模型贴着实验走；弦论、圈量子引力、扭量理论都还在半空——<span class='hl'>看它们各自的「标志性数字」，就知道为什么作者把检验说成唯一裁判</span>。",
  draw: function (stage) {
    var C = VZ.C, W = 760, H = 430;
    var svg = VZ.S(stage, W, H, { grid: true });
    var topY = 96, botY = 296;

    /* 顶：实验接触面；底：数学出发点 */
    VZ.ln(svg, 40, topY - 18, 720, topY - 18, VZ.stroke({ stroke: C.red, "stroke-width": 1.6, "stroke-dasharray": "9 6" }));
    VZ.txt(svg, 46, topY - 26, "实验接触面（唯一裁判）", { size: 11.5, fill: C.red, weight: 700 });
    VZ.ln(svg, 40, botY + 16, 720, botY + 16, { stroke: C.ink2, "stroke-width": 1.4 });
    VZ.txt(svg, 46, botY + 32, "数学出发点", { size: 11.5, fill: C.dim });

    var routes = [
      { name: "标准模型", x: 130, col: C.green, wb: 112, wt: 96, top: topY + 6,
        pro: "优势：与实验吻合到第 12 位有效数字，人类最精密的理论。",
        con: "短板：把引力排除在外；19 个参数只能靠测量代入。",
        num: "标志：电子 g−2 理论—实验吻合至 10⁻¹⁰ 量级" },
      { name: "弦论", x: 305, col: C.cyan, wb: 64, wt: 20, top: 232,
        pro: "优势：自然容纳引力与全部粒子，数学成果丰硕。",
        con: "短板：10⁵⁰⁰ 个真空解，至今没有一个可检验的新预言。",
        num: "标志：10⁵⁰⁰ —— 风景的尺寸" },
      { name: "圈量子引力", x: 465, col: C.violet, wb: 58, wt: 24, top: 216,
        pro: "优势：背景独立；面积、体积有最小量子。",
        con: "短板：与物质场衔接困难，半经典极限尚未完全恢复。",
        num: "标志：最小面积 ~10⁻⁷⁰ m²" },
      { name: "扭量理论", x: 628, col: C.mag, wb: 46, wt: 14, top: 252,
        pro: "优势：把无质量场变成几何；散射振幅计算因此焕新。",
        con: "短板：只覆盖共形平坦时空，真实引力难以纳入。",
        num: "标志：2003 年扭量弦点亮散射振幅" }
    ];

    var bodies = [];
    routes.forEach(function (r) {
      var d = "M" + (r.x - r.wb / 2) + " " + botY +
        "C" + (r.x - r.wb / 2) + " " + (botY + topY) / 2 + " " + (r.x - r.wt / 2) + " " + (botY + r.top) / 2 + " " + (r.x - r.wt / 2) + " " + r.top +
        "L" + (r.x + r.wt / 2) + " " + r.top +
        "C" + (r.x + r.wt / 2) + " " + (botY + r.top) / 2 + " " + (r.x + r.wb / 2) + " " + (botY + topY) / 2 + " " + (r.x + r.wb / 2) + " " + botY + "Z";
      var grad = VZ.grad(svg, VZ.uid("rg"), [["0", r.col, .05], ["1", r.col, .3]], true);
      var body = VZ.g(svg, { style: "cursor:pointer" });
      VZ.path(body, d, { fill: grad, stroke: r.col, "stroke-width": 1.6 });
      var nameY = r.wt >= 70 ? botY - 10 : r.top - 16;
      VZ.txt(body, r.x, nameY, r.name, { size: 12.5, fill: r.col, anchor: "middle", weight: 700 });
      /* 接触面宽度标记 */
      VZ.ln(body, r.x - r.wt / 2, r.top - 6, r.x + r.wt / 2, r.top - 6, VZ.stroke({ stroke: r.col, "stroke-width": 3 }));
      r.bodyG = body;
      body.addEventListener("click", function () { pick(r); });
      bodies.push(body);
    });

    /* 沿路向上的光点（自绘，避免越界初值） */
    var flows = [];
    routes.forEach(function (r) {
      var dot = VZ.circ(svg, r.x, botY, 3.6, { fill: r.col });
      flows.push({ r: r, dot: dot, ph: Math.random() });
    });
    VZ.raf(svg, function (t, dt) {
      flows.forEach(function (f) {
        f.ph = (f.ph + dt / 2.8) % 1;
        var y = botY + (f.r.top - botY) * f.ph;
        f.dot.setAttribute("cx", f.r.x);
        f.dot.setAttribute("cy", y);
        f.dot.setAttribute("opacity", .25 + .65 * Math.sin(Math.PI * f.ph));
      });
    });

    /* 信息板 */
    var pb = VZ.g(svg);
    VZ.el("rect", { x: 20, y: 336, width: 720, height: 84, rx: 10, fill: "rgba(255,255,255,.045)", stroke: C.faint }, pb);
    var pT = VZ.txt(pb, 36, 358, "", { size: 13, fill: C.green, weight: 700 });
    var pD = VZ.g(pb);
    function pick(r) {
      bodies.forEach(function (b, i) {
        var on = routes[i] === r;
        b.setAttribute("opacity", on ? 1 : .35);
      });
      pT.textContent = r.name;
      pT.setAttribute("fill", r.col);
      pD.innerHTML = "";
      VZ.para(pD, 36, 376, r.pro + "\n" + r.con + "\n" + r.num, { size: 11, per: 62, lh: 14.5 });
    }
    pick(routes[0]);
  }
}
});
