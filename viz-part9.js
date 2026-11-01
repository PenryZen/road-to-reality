/* ============================================================
   viz-part9.js — 第三批挂载式小图（ch5–ch8，每章 4 张 d/e/f/g）
   挂载图：title 为空，画布高 220–320，嵌在讲解步骤正文下方。
   ============================================================ */
VZ.define({

/* ==========================================================
   f-ch05d · 单位圆上的 e^{iθ}（挂：一步步推出 e^{iθ}=cosθ+isinθ）
   ========================================================== */
"f-ch05d": {
  title: "",
  hint: "滑动 <b>θ</b>，看点在单位圆上转圈。右边直角三角形的三条边就是实部 cos θ 与虚部 sin θ 的来源——<span class='hl'>e^{iθ} 不是新东西，它就是「角度为 θ 的单位复数」的另一种写法。</span>",
  draw: function (stage) {
    var W = 760, H = 290, svg = VZ.S(stage, W, H, { grid: true });
    var C = VZ.C;
    var cx = 185, cy = 148, R = 92;
    VZ.circ(svg, cx, cy, R, { stroke: C.faint, "stroke-width": 1 });
    VZ.ln(svg, cx - R - 26, cy, cx + R + 26, cy, { stroke: C.faint, "stroke-width": .8 });
    VZ.ln(svg, cx, cy - R - 24, cx, cy + R + 24, { stroke: C.faint, "stroke-width": .8 });
    VZ.txt(svg, cx + R + 28, cy + 4, "Re", { size: 11, fill: C.dim });
    VZ.txt(svg, cx + 6, cy - R - 14, "Im", { size: 11, fill: C.dim });
    [1, -1].forEach(function (s) {
      VZ.circ(svg, cx + s * R, cy, 2.4, { fill: C.dim });
      VZ.circ(svg, cx, cy + s * R, 2.4, { fill: C.dim });
    });
    VZ.txt(svg, cx + R + 4, cy - 8, "1", { size: 11, fill: C.dim });

    var ray = VZ.path(svg, "", VZ.stroke({ stroke: C.gold, "stroke-width": 2 }));
    var cosL = VZ.path(svg, "", VZ.stroke({ stroke: C.cyan, "stroke-width": 3 }));
    var sinL = VZ.path(svg, "", VZ.stroke({ stroke: C.mag, "stroke-width": 3 }));
    var dot = VZ.circ(svg, cx + R, cy, 6.5, { fill: C.gold });
    var arc = VZ.path(svg, "", VZ.stroke({ stroke: C.gold, "stroke-width": 1.2, opacity: .7, "stroke-dasharray": "3 3" }));
    var lbl = VZ.txt(svg, 0, 0, "e^{iθ}", { size: 13, fill: C.gold, weight: 700 });

    var info = VZ.panel(stage, { "θ": "", "e^{iθ}": "", "cos θ（实部）": "", "sin θ（虚部）": "" });
    function redraw(th) {
      var x = cx + R * Math.cos(th), y = cy - R * Math.sin(th);
      var cre = Math.cos(th), cim = Math.sin(th);
      ray.setAttribute("d", "M" + cx + " " + cy + "L" + x + " " + y);
      cosL.setAttribute("d", "M" + cx + " " + cy + "L" + x + " " + cy);
      sinL.setAttribute("d", "M" + x + " " + cy + "L" + x + " " + y);
      dot.setAttribute("cx", x); dot.setAttribute("cy", y);
      var rr = 26;
      if (Math.abs(th % (2 * Math.PI)) > 0.05) {
        var sx = th > 0 ? 1 : 0;
        arc.setAttribute("d", "M" + (cx + rr) + " " + cy + "A" + rr + " " + rr + " 0 0 " + sx + " " +
          (cx + rr * Math.cos(th)) + " " + (cy - rr * Math.sin(th)));
      } else arc.setAttribute("d", "");
      lbl.setAttribute("x", VZ.clamp(x + (Math.cos(th) >= 0 ? 10 : -10), 30, 350));
      lbl.setAttribute("y", y + (Math.sin(th) >= 0 ? -10 : 20));
      lbl.setAttribute("text-anchor", Math.cos(th) >= 0 ? "start" : "end");
      VZ.setPanel(info, {
        "θ": th.toFixed(2) + " rad",
        "e^{iθ}": cre.toFixed(3) + (cim >= 0 ? " + " : " − ") + Math.abs(cim).toFixed(3) + " i",
        "cos θ（实部）": cre.toFixed(3),
        "sin θ（虚部）": cim.toFixed(3)
      });
    }
    VZ.slider(stage, { label: "θ", value: 0.9, min: 0, max: 4 * Math.PI, step: 0.01,
      format: function (v) { return v.toFixed(2) + " rad"; },
      onInput: redraw });
    redraw(0.9);
  }
},

/* ==========================================================
   f-ch05e · 棣莫弗定理（挂：5.3 乘方是反复旋转）
   ========================================================== */
"f-ch05e": {
  title: "",
  hint: "滑动 <b>n</b>：把同一个角 θ = 2π/n 自乘 n 次，顶点 z, z², …, zⁿ 恰好铺成一个正 n 边形，最后落回 1。<span class='hl'>乘 n 次方 = 角转 n 倍</span>，这就是棣莫弗定理 (cos θ + i sin θ)ⁿ = cos nθ + i sin nθ。",
  draw: function (stage) {
    var W = 760, H = 300, svg = VZ.S(stage, W, H, { grid: true });
    var C = VZ.C;
    var cx = 220, cy = 152, R = 100;
    VZ.circ(svg, cx, cy, R, { stroke: C.faint, "stroke-width": 1 });
    VZ.ln(svg, cx - R - 24, cy, cx + R + 24, cy, { stroke: C.faint, "stroke-width": .8 });
    VZ.ln(svg, cx, cy - R - 22, cx, cy + R + 22, { stroke: C.faint, "stroke-width": .8 });

    var pg = VZ.g(svg);
    var info = VZ.panel(stage, { "n": "", "θ = 2π/n": "", "(cosθ+isinθ)ⁿ": "" });
    function redraw(n) {
      pg.innerHTML = "";
      var th = 2 * Math.PI / n;
      var pts = [];
      for (var k = 1; k <= n; k++) {
        var a = th * k;
        pts.push([cx + R * Math.cos(a), cy - R * Math.sin(a)]);
      }
      VZ.poly(pg, pts, VZ.stroke({ stroke: C.cyan, "stroke-width": 1.6, opacity: .9 }));
      pts.forEach(function (p, i) {
        VZ.circ(pg, p[0], p[1], 4.5, { fill: i === n - 1 ? C.gold : C.cyan });
      });
      VZ.circ(pg, cx, cy, 4, { fill: C.ink });
      var pLast = pts[n - 1];
      VZ.txt(pg, pLast[0] + 14, pLast[1] - 6, "zⁿ = 1", { size: 12, fill: C.gold, weight: 700 });
      var pFirst = pts[0];
      VZ.txt(pg, pFirst[0] + (Math.cos(th) >= 0 ? 10 : -12), pFirst[1] + (Math.sin(th) >= 0 ? -8 : 16),
        "z", { size: 12, fill: C.cyan, weight: 700 });
      var rr = 30;
      VZ.path(pg, "M" + (cx + rr) + " " + cy + "A" + rr + " " + rr + " 0 0 1 " + (cx + rr * Math.cos(th)) + " " + (cy - rr * Math.sin(th)),
        VZ.stroke({ stroke: C.gold, "stroke-width": 1.2, "stroke-dasharray": "3 3" }));
      VZ.txt(pg, cx + rr + 12, cy - 12, "θ", { size: 11.5, fill: C.gold });
      VZ.setPanel(info, {
        "n": String(n),
        "θ = 2π/n": (360 / n).toFixed(1) + "°",
        "(cosθ+isinθ)ⁿ": "cos 2π + i sin 2π = 1"
      });
    }
    VZ.slider(stage, { label: "n（乘方次数）", value: 5, min: 3, max: 12, step: 1, onInput: redraw });
    redraw(5);
  }
},

/* ==========================================================
   f-ch05f · 1 的 n 次根（挂：1 的三个立方根，均匀铺在单位圆上）
   ========================================================== */
"f-ch05f": {
  title: "",
  hint: "滑动 <b>n</b>，解方程 zⁿ = 1：n 个根<span class='hl'>永远均匀分布在单位圆上</span>，相邻两个隔 2π/n。没有哪个根更「优先」——这种由对称强制给出的<span class='hl'>离散结构</span>，正是第 16 章量子数离散性的雏形。",
  draw: function (stage) {
    var W = 760, H = 300, svg = VZ.S(stage, W, H, { grid: true });
    var C = VZ.C;
    var cx = 220, cy = 152, R = 100;
    VZ.circ(svg, cx, cy, R, { stroke: C.faint, "stroke-width": 1 });
    VZ.ln(svg, cx - R - 24, cy, cx + R + 24, cy, { stroke: C.faint, "stroke-width": .8 });
    VZ.ln(svg, cx, cy - R - 22, cx, cy + R + 22, { stroke: C.faint, "stroke-width": .8 });
    VZ.txt(svg, cx + R + 6, cy - 8, "1", { size: 11, fill: C.dim });

    var pg = VZ.g(svg);
    var info = VZ.panel(stage, { "方程": "", "根的个数": "", "相邻间隔": "" });
    function redraw(n) {
      pg.innerHTML = "";
      var pts = [];
      for (var k = 0; k < n; k++) {
        var a = 2 * Math.PI * k / n;
        pts.push([cx + R * Math.cos(a), cy - R * Math.sin(a)]);
      }
      VZ.poly(pg, pts.concat([pts[0]]), VZ.stroke({ stroke: C.violet, "stroke-width": 1.5, opacity: .85 }));
      pts.forEach(function (p, k) {
        VZ.circ(pg, p[0], p[1], 5, { fill: k === 0 ? C.gold : C.violet });
        var lx = cx + (R + 20) * Math.cos(2 * Math.PI * k / n);
        var ly = cy - (R + 20) * Math.sin(2 * Math.PI * k / n);
        if (n <= 6 || k % 2 === 0)
          VZ.txt(pg, lx, ly + 4, k === 0 ? "1" : (k === 1 ? "ω" : "ω^" + k), { size: 10.5, fill: C.ink2, anchor: "middle" });
      });
      var a2 = 2 * Math.PI / n, rr = 24;
      VZ.path(pg, "M" + (cx + rr) + " " + cy + "A" + rr + " " + rr + " 0 0 1 " + (cx + rr * Math.cos(a2)) + " " + (cy - rr * Math.sin(a2)),
        VZ.stroke({ stroke: C.gold, "stroke-width": 1.2, "stroke-dasharray": "3 3" }));
      VZ.txt(pg, cx + rr + 10, cy - 14, "2π/n", { size: 10.5, fill: C.gold });
      VZ.setPanel(info, {
        "方程": "zⁿ = 1（n = " + n + "）",
        "根的个数": String(n) + " 个",
        "相邻间隔": "2π/" + n + " ≈ " + (360 / n).toFixed(1) + "°"
      });
    }
    VZ.slider(stage, { label: "n", value: 3, min: 2, max: 9, step: 1, onInput: redraw });
    redraw(3);
  }
},

/* ==========================================================
   f-ch05g · i^i 的无穷多个实数值（挂：i^i 是一个实数，而且有无穷多个）
   ========================================================== */
"f-ch05g": {
  title: "",
  hint: "滑动 <b>k</b>：log i 有无穷多个值 i(π/2 + 2πk)，每个值给出一个 i^i = e^{−(π/2+2πk)}。<span class='hl'>它们全是实数</span>，沿数轴向 0 挤过去——复幂的多值不是玄学，只是 log 的多值换了个地方现身。",
  draw: function (stage) {
    var W = 760, H = 290, svg = VZ.S(stage, W, H, { grid: true });
    var C = VZ.C;

    /* 左：log i 的无穷多值（竖排虚轴） */
    var lx = 160, topY = 60, gapY = 26;
    VZ.ln(svg, lx, 44, lx, 250, { stroke: C.faint, "stroke-width": .8 });
    VZ.txt(svg, lx + 8, 50, "虚轴", { size: 11, fill: C.dim });
    VZ.circ(svg, lx, topY + 3 * gapY, 4, { fill: C.ink2 });
    VZ.txt(svg, lx - 14, topY + 3 * gapY + 4, "π/2 · i", { size: 11, fill: C.ink2, anchor: "end" });
    var logDots = [];
    for (var k = 0; k <= 5; k++) {
      var y = topY + (3 - k) * gapY;
      logDots.push(VZ.circ(svg, lx, y, 5, { fill: k === 0 ? C.gold : C.violet, opacity: k === 0 ? 1 : .5 }));
      if (k > 0) VZ.txt(svg, lx - 14, y + 4, "+" + (2 * k) + "πi", { size: 10.5, fill: C.violet, anchor: "end", opacity: .8 });
    }
    VZ.txt(svg, lx, 272, "log i 的无穷多个值", { size: 12, fill: C.ink2, anchor: "middle" });

    /* 中：箭头 e^· */
    var ar = VZ.arrowDef(svg, VZ.uid("ar"), C.ink2);
    VZ.path(svg, "M218 148H300", VZ.stroke({ stroke: C.ink2, "stroke-width": 1.4, "stroke-dasharray": "5 4", "marker-end": ar }));
    VZ.txt(svg, 258, 136, "取 e^…", { size: 11.5, fill: C.ink2, anchor: "middle" });

    /* 右：实轴上的 i^i 值（对数刻度） */
    var rx0 = 330, rx1 = 720, ry = 148;
    VZ.ln(svg, rx0, ry, rx1, ry, { stroke: C.faint, "stroke-width": .8 });
    VZ.txt(svg, rx1 - 4, ry - 10, "实轴（对数刻度）", { size: 11, fill: C.dim, anchor: "end" });
    function xpos(v) { /* v ∈ (0,1]，log10 ∈ (-∞,0] 映射 */
      var lg = Math.log10(Math.max(v, 1e-9));
      return rx0 + (lg + 9) / 9 * (rx1 - rx0);
    }
    [1, 0.1, 0.01].forEach(function (v) {
      var xx = xpos(v);
      VZ.ln(svg, xx, ry - 4, xx, ry + 4, { stroke: C.faint });
      VZ.txt(svg, xx, ry + 18, String(v), { size: 10, fill: C.dim, anchor: "middle" });
    });
    var valDots = [], valLbls = [];
    for (var k2 = 0; k2 <= 5; k2++) {
      var val = Math.exp(-(Math.PI / 2 + 2 * Math.PI * k2));
      var xx2 = xpos(val);
      valDots.push(VZ.circ(svg, xx2, ry, 6, { fill: k2 === 0 ? C.gold : C.violet, opacity: k2 === 0 ? 1 : .55 }));
      valLbls.push(VZ.txt(svg, xx2, ry - 16 - (k2 % 2) * 16, "", { size: 11, fill: C.ink2, anchor: "middle" }));
    }
    VZ.txt(svg, (rx0 + rx1) / 2, 272, "i^i 的无穷多个值：全是实数，一个比一个小", { size: 12, fill: C.ink2, anchor: "middle" });

    var info = VZ.panel(stage, { "k": "", "log i 的取值": "", "i^i = e^{−(π/2+2πk)}": "" });
    function pick(k) {
      for (var i = 0; i <= 5; i++) {
        logDots[i].setAttribute("opacity", i === k ? 1 : .45);
        logDots[i].setAttribute("r", i === k ? 7 : 5);
        valDots[i].setAttribute("opacity", i === k ? 1 : .45);
        valDots[i].setAttribute("r", i === k ? 8 : 6);
        var val = Math.exp(-(Math.PI / 2 + 2 * Math.PI * i));
        valLbls[i].setAttribute("opacity", i === k ? 1 : 0);
        valLbls[i].textContent = i === k ? (i === 0 ? "0.2079" : val.toExponential(2)) : "";
      }
      VZ.setPanel(info, {
        "k": String(k),
        "log i 的取值": "(π/2 + " + (2 * k) + "π) i",
        "i^i = e^{−(π/2+2πk)}": k === 0 ? "0.20788" : Math.exp(-(Math.PI / 2 + 2 * Math.PI * k)).toExponential(3)
      });
    }
    VZ.slider(stage, { label: "k", value: 0, min: 0, max: 5, step: 1, onInput: pick });
    pick(0);
  }
},

/* ==========================================================
   f-ch06d · 导数的线性近似（挂：术语：导数与切线）
   ========================================================== */
"f-ch06d": {
  title: "",
  hint: "拖动金色点选 <b>x₀</b>：切线在 x₀ 附近贴着曲线，绿色竖条=误差小（贴得住），红色=误差大（贴不住）。<span class='hl'>「可微」的全部含义就是：每一点都能配一条这样贴得上去的直线。</span>",
  draw: function (stage) {
    var W = 760, H = 310, svg = VZ.S(stage, W, H, { grid: true });
    var C = VZ.C;
    var ox = 60, oy = 158, sx = 110, sy = 62;  /* x∈[-3,3] → 像素, y 缩放 */
    function X(x) { return ox + (x + 3) * sx; }
    function Y(y) { return oy - y * sy; }
    function Yc(y) { return VZ.clamp(oy - y * sy, 24, 292); }
    function f(x) { return 1.25 * Math.sin(x) + 0.22 * x * x - 0.55; }
    function df(x) { return 1.25 * Math.cos(x) + 0.44 * x; }
    function df(x) { return 1.25 * Math.cos(x) + 0.44 * x; }
    VZ.ln(svg, ox - 14, oy, ox + 690, oy, { stroke: C.faint, "stroke-width": .8 });
    VZ.txt(svg, ox + 672, oy + 16, "x", { size: 11, fill: C.dim });
    var curve = VZ.path(svg, "", VZ.stroke({ stroke: C.ink, "stroke-width": 2 }));
    var d1 = "";
    for (var i = 0; i <= 120; i++) {
      var x = -3 + 6 * i / 120;
      d1 += (i ? "L" : "M") + X(x).toFixed(1) + " " + Y(f(x)).toFixed(1);
    }
    curve.setAttribute("d", d1);

    var bars = VZ.g(svg);
    var tan = VZ.path(svg, "", VZ.stroke({ stroke: C.cyan, "stroke-width": 1.8 }));
    var dot = VZ.circ(svg, 0, 0, 7, { fill: C.gold });
    var lbl = VZ.txt(svg, 0, 0, "x₀", { size: 12.5, fill: C.gold, weight: 700 });
    var x0 = 0.8;
    var EPS = 0.12;
    function redraw() {
      var f0 = f(x0), m = df(x0);
      tan.setAttribute("d", "M" + X(-3) + " " + Yc(f0 + m * (-3 - x0)).toFixed(1) +
        "L" + X(3) + " " + Yc(f0 + m * (3 - x0)).toFixed(1));
      dot.setAttribute("cx", X(x0)); dot.setAttribute("cy", Y(f0));
      lbl.setAttribute("x", X(x0) + 4); lbl.setAttribute("y", Y(f0) - 14);
      bars.innerHTML = "";
      for (var i = 0; i <= 40; i++) {
        var x = -2.9 + 5.8 * i / 40;
        var e = Math.abs(f(x) - (f0 + m * (x - x0)));
        VZ.ln(bars, X(x), Y(f(x)), X(x), Yc(f0 + m * (x - x0)),
          { stroke: e < EPS ? C.green : C.red, "stroke-width": 2.4, opacity: e < EPS ? .8 : .5 });
      }
      VZ.setPanel(info, {
        "x₀": x0.toFixed(2),
        "切线斜率 f′(x₀)": m.toFixed(3),
        "切线": "T(x) = f(x₀) + f′(x₀)(x−x₀)",
        "贴近范围": "|f − T| < " + EPS
      });
    }
    VZ.drag(svg, svg, W, H, function (x, y, phase) {
      if (phase === "start" || phase === "move") {
        x0 = VZ.clamp((x - ox) / sx - 3, -2.85, 2.85);
        redraw();
      }
    });
    var info = VZ.panel(stage, { "x₀": "", "切线斜率 f′(x₀)": "", "切线": "", "贴近范围": "" });
    redraw();
  }
},

/* ==========================================================
   f-ch06e · 二阶导与凹凸性（挂：6.3 高阶导数：加速度是速度的变化率）
   ========================================================== */
"f-ch06e": {
  title: "",
  hint: "拖动金色点：f′ 的正负告诉你函数<span class='hl'>往哪边爬</span>，f″ 的正负告诉你它<span class='hl'>往哪边弯</span>——切线颜色随凹凸变色。拐点 x=0 处弯曲方向交换，极值 ±1 处 f′ 变号。",
  draw: function (stage) {
    var W = 760, H = 310, svg = VZ.S(stage, W, H, { grid: true });
    var C = VZ.C;
    var ox = 60, oy = 160, sx = 118, sy = 34;
    function X(x) { return ox + (x + 2.6) * sx; }
    function Y(y) { return oy - y * sy; }
    function Yc(y) { return VZ.clamp(oy - y * sy, 24, 292); }
    function f(x) { return x * x * x - 3 * x; }
    function df(x) { return 3 * x * x - 3; }
    function d2f(x) { return 6 * x; }
    /* 凹（f''>0，x>0）凸（f''<0，x<0）背景 */
    VZ.el("rect", { x: X(0), y: 24, width: X(2.6) - X(0), height: 262, fill: C.green, opacity: .06 }, svg);
    VZ.el("rect", { x: X(-2.6), y: 24, width: X(0) - X(-2.6), height: 262, fill: C.mag, opacity: .06 }, svg);
    VZ.ln(svg, X(0), 24, X(0), 286, { stroke: C.violet, "stroke-width": 1, "stroke-dasharray": "5 4" });
    VZ.txt(svg, X(0) + 6, 36, "拐点 f″=0", { size: 11, fill: C.violet });
    VZ.ln(svg, ox - 14, oy, ox + 664, oy, { stroke: C.faint, "stroke-width": .8 });
    var curve = VZ.path(svg, "", VZ.stroke({ stroke: C.ink, "stroke-width": 2 }));
    var d1 = "";
    for (var i = 0; i <= 120; i++) {
      var x = -2.2 + 4.4 * i / 120;
      d1 += (i ? "L" : "M") + X(x).toFixed(1) + " " + Y(f(x)).toFixed(1);
    }
    curve.setAttribute("d", d1);
    /* 极值点 */
    [[-1, "极大"], [1, "极小"]].forEach(function (p) {
      VZ.circ(svg, X(p[0]), Y(f(p[0])), 4.5, { fill: C.gold });
      VZ.txt(svg, X(p[0]), Y(f(p[0])) + (p[0] < 0 ? -12 : 20), p[1], { size: 10.5, fill: C.gold, anchor: "middle" });
    });
    var tan = VZ.path(svg, "", VZ.stroke({ stroke: C.cyan, "stroke-width": 1.8 }));
    var dot = VZ.circ(svg, 0, 0, 7, { fill: C.gold });
    var x0 = -1.8;
    var info = VZ.panel(stage, { "x₀": "", "f′(x₀)（升/降）": "", "f″(x₀)（凹/凸）": "" });
    function redraw() {
      var f0 = f(x0), m = df(x0), m2 = d2f(x0);
      var col = m2 >= 0 ? C.green : C.mag;
      tan.setAttribute("d", "M" + X(x0 - 1.2) + " " + Yc(f0 + m * (-1.2)).toFixed(1) +
        "L" + X(x0 + 1.2) + " " + Yc(f0 + m * 1.2).toFixed(1));
      tan.setAttribute("stroke", col);
      dot.setAttribute("cx", X(x0)); dot.setAttribute("cy", Y(f0));
      VZ.setPanel(info, {
        "x₀": x0.toFixed(2),
        "f′(x₀)（升/降）": m.toFixed(2) + (m > 0.02 ? " ↑上升" : m < -0.02 ? " ↓下降" : " —驻点"),
        "f″(x₀)（凹/凸）": m2.toFixed(2) + (m2 >= 0 ? " 凹（向上弯）" : " 凸（向下弯）")
      });
    }
    VZ.drag(svg, svg, W, H, function (x, y, phase) {
      if (phase === "start" || phase === "move") {
        x0 = VZ.clamp((x - ox) / sx - 2.6, -2.5, 2.5);
        redraw();
      }
    });
    redraw();
    VZ.legend(stage, [["凹（f″>0）", C.green], ["凸（f″<0）", C.mag]]);
  }
},

/* ==========================================================
   f-ch06f · 积分 = 面积（挂：用两种办法算同一块面积）
   ========================================================== */
"f-ch06f": {
  title: "",
  hint: "拖动两个金色手柄改变积分区间 [a, b]：阴影面积实时变化，而它<span class='hl'>恰好等于 F(b) − F(a)</span>——「算面积」和「代入原函数相减」是同一件事，这就是微积分基本定理。",
  draw: function (stage) {
    var W = 760, H = 300, svg = VZ.S(stage, W, H, { grid: true });
    var C = VZ.C;
    var ox = 70, oy = 235, sx = 145, sy = 34;  /* x∈[0,4.4] */
    function X(x) { return ox + x * sx; }
    function Y(y) { return oy - y * sy; }
    function f(x) { return 2 + 1.25 * Math.sin(1.25 * x); }
    function F(x) { return 2 * x - (1.25 / 1.25) * Math.cos(1.25 * x); }
    VZ.ln(svg, ox - 16, oy, ox + 680, oy, { stroke: C.faint, "stroke-width": .8 });
    VZ.txt(svg, ox + 660, oy + 16, "x", { size: 11, fill: C.dim });
    var curve = VZ.path(svg, "", VZ.stroke({ stroke: C.ink, "stroke-width": 2 }));
    var d1 = "";
    for (var i = 0; i <= 140; i++) {
      var x = 4.4 * i / 140;
      d1 += (i ? "L" : "M") + X(x).toFixed(1) + " " + Y(f(x)).toFixed(1);
    }
    curve.setAttribute("d", d1);
    var area = VZ.path(svg, "", { fill: C.cyan, opacity: .18, stroke: "none" });
    var hA = VZ.circ(svg, 0, 0, 8, { fill: C.gold });
    var hB = VZ.circ(svg, 0, 0, 8, { fill: C.gold });
    var la = VZ.txt(svg, 0, 0, "a", { size: 13, fill: C.gold, weight: 700, anchor: "middle" });
    var lb = VZ.txt(svg, 0, 0, "b", { size: 13, fill: C.gold, weight: 700, anchor: "middle" });
    var a = 0.7, b = 3.2;
    var info = VZ.panel(stage, { "区间 [a, b]": "", "面积 ∫ᵃᵇ f dx": "", "F(b) − F(a)": "" });
    function redraw() {
      var d = "M" + X(a) + " " + oy;
      for (var i = 0; i <= 60; i++) {
        var x = a + (b - a) * i / 60;
        d += "L" + X(x).toFixed(1) + " " + Y(f(x)).toFixed(1);
      }
      d += "L" + X(b) + " " + oy + "Z";
      area.setAttribute("d", d);
      hA.setAttribute("cx", X(a)); hA.setAttribute("cy", oy);
      hB.setAttribute("cx", X(b)); hB.setAttribute("cy", oy);
      la.setAttribute("x", X(a)); la.setAttribute("y", oy + 22);
      lb.setAttribute("x", X(b)); lb.setAttribute("y", oy + 22);
      var S = 0, n = 120;
      for (var k = 0; k <= n; k++) {
        var w = (k === 0 || k === n) ? 0.5 : 1;
        S += w * f(a + (b - a) * k / n);
      }
      S *= (b - a) / n;
      VZ.setPanel(info, {
        "区间 [a, b]": "[" + a.toFixed(2) + ", " + b.toFixed(2) + "]",
        "面积 ∫ᵃᵇ f dx": S.toFixed(4),
        "F(b) − F(a)": (F(b) - F(a)).toFixed(4)
      });
    }
    var dragging = null;
    VZ.drag(svg, svg, W, H, function (x, y, phase) {
      if (phase === "start") {
        dragging = Math.abs(x - X(a)) < Math.abs(x - X(b)) ? "a" : "b";
      }
      if (phase === "move" || phase === "start") {
        var v = VZ.clamp((x - ox) / sx, 0, 4.4);
        if (dragging === "a") a = Math.min(v, b - 0.15); else b = Math.max(v, a + 0.15);
        redraw();
      }
      if (phase === "end") dragging = null;
    });
    redraw();
  }
},

/* ==========================================================
   f-ch06g · e^x：自己的导数（挂：欧拉的函数观）
   ========================================================== */
"f-ch06g": {
  title: "",
  hint: "拖动金色点：切线的斜率读数<span class='hl'>永远等于曲线自己的高度</span>。助记三角形里「升 = 高」——增长多快，取决于已经有多少。这就是 e^x 在整本书里反复登场的原因：它是最听自己话的函数。",
  draw: function (stage) {
    var W = 760, H = 300, svg = VZ.S(stage, W, H, { grid: true });
    var C = VZ.C;
    var ox = 70, oy = 250, sx = 150, sy = 42;  /* x∈[-2.5,1.8], y∈[0,5] */
    function X(x) { return ox + (x + 2.5) * sx; }
    function Y(y) { return oy - y * sy; }
    VZ.ln(svg, ox - 16, oy, ox + 680, oy, { stroke: C.faint, "stroke-width": .8 });
    VZ.ln(svg, ox, oy + 10, ox, 30, { stroke: C.faint, "stroke-width": .8 });
    VZ.txt(svg, ox + 664, oy + 16, "x", { size: 11, fill: C.dim });
    /* 呼吸的 f'(x) 重影：与 e^x 完全重合 */
    var ghost = VZ.path(svg, "", VZ.stroke({ stroke: C.mag, "stroke-width": 5, opacity: .18 }));
    VZ.raf(svg, function (t) { ghost.setAttribute("opacity", .12 + .12 * (0.5 + 0.5 * Math.sin(t * 2.2))); });
    var curve = VZ.path(svg, "", VZ.stroke({ stroke: C.cyan, "stroke-width": 2 }));
    var dc = "", dg = "";
    for (var i = 0; i <= 130; i++) {
      var x = -2.5 + 4.3 * i / 130;
      var cmd = i ? "L" : "M";
      dc += cmd + X(x).toFixed(1) + " " + Y(Math.exp(x)).toFixed(1);
      dg += cmd + X(x).toFixed(1) + " " + Y(Math.exp(x)).toFixed(1);
    }
    curve.setAttribute("d", dc);
    ghost.setAttribute("d", dg);
    var tan = VZ.path(svg, "", VZ.stroke({ stroke: C.gold, "stroke-width": 1.8 }));
    var tri = VZ.path(svg, "", VZ.stroke({ stroke: C.gold, "stroke-width": 1.2, "stroke-dasharray": "4 3" }));
    var dot = VZ.circ(svg, 0, 0, 7, { fill: C.gold });
    var x0 = 0.2;
    var info = VZ.panel(stage, { "x₀": "", "高度 e^{x₀}": "", "切线斜率（=高度）": "" });
    function redraw() {
      var f0 = Math.exp(x0);
      tan.setAttribute("d", "M" + X(x0 - 1.1) + " " + Y(f0 * (1 - 1.1)).toFixed(1) +
        "L" + X(x0 + 0.9) + " " + Y(f0 * (1 + 0.9)).toFixed(1));
      /* 斜率三角形：横走 1，竖走 = f0 */
      tri.setAttribute("d", "M" + X(x0) + " " + Y(f0) + "L" + X(x0 + 1) + " " + Y(f0) + "L" + X(x0 + 1) + " " + Y(f0 * 2));
      dot.setAttribute("cx", X(x0)); dot.setAttribute("cy", Y(f0));
      VZ.setPanel(info, {
        "x₀": x0.toFixed(2),
        "高度 e^{x₀}": f0.toFixed(4),
        "切线斜率（=高度）": f0.toFixed(4)
      });
    }
    VZ.drag(svg, svg, W, H, function (x, y, phase) {
      if (phase === "start" || phase === "move") {
        x0 = VZ.clamp((x - ox) / sx - 2.5, -2.4, 1.6);
        redraw();
      }
    });
    redraw();
    VZ.legend(stage, [["e^x", C.cyan, "line"], ["它的导数（重合）", C.mag, "line"], ["当前点", C.gold]]);
  }
},

/* ==========================================================
   f-ch07d · 柯西–黎曼：两个偏导互相咬合（挂：一步步推出柯西–黎曼方程）
   ========================================================== */
"f-ch07d": {
  title: "",
  hint: "拖动金色点 z（以 f(z)=z² 为例）：向东挪一小步看到的像（青箭头）与向北挪一小步看到的像（品红箭头）<span class='hl'>永远等长且差 90°</span>——这就是柯西–黎曼方程 u_x=v_y、u_y=−v_x 的几何内容：两个偏导不是独立的，它们是同一个旋转伸缩的两半。",
  draw: function (stage) {
    var W = 760, H = 290, svg = VZ.S(stage, W, H, { grid: true });
    var C = VZ.C;
    var ar1 = VZ.arrowDef(svg, VZ.uid("a1"), C.cyan);
    var ar2 = VZ.arrowDef(svg, VZ.uid("a2"), C.mag);
    function plane(x0, name) {
      var cx = x0 + 140, cy = 148, U = 68;
      VZ.ln(svg, cx - 128, cy, cx + 128, cy, { stroke: C.faint, "stroke-width": .8 });
      VZ.ln(svg, cx, cy - 108, cx, cy + 108, { stroke: C.faint, "stroke-width": .8 });
      VZ.txt(svg, cx + 118, cy - 100, name, { size: 12.5, fill: C.ink2, weight: 700 });
      VZ.txt(svg, cx + 128, cy + 14, "Re", { size: 10, fill: C.dim });
      return { cx: cx, cy: cy, U: U };
    }
    var P = plane(0, "z 平面（输入）");
    var Q = plane(370, "w = z² 平面（输出）");
    var dot = VZ.circ(svg, P.cx, P.cy, 7, { fill: C.gold });
    var zlbl = VZ.txt(svg, P.cx + 12, P.cy - 10, "z", { size: 13, fill: C.gold, weight: 700 });
    var wdot = VZ.circ(svg, 0, 0, 7, { fill: C.gold });
    var eax = VZ.path(svg, "", VZ.stroke({ stroke: C.cyan, "stroke-width": 2.2, "marker-end": ar1 }));
    var nay = VZ.path(svg, "", VZ.stroke({ stroke: C.mag, "stroke-width": 2.2, "marker-end": ar2 }));
    var oax = VZ.path(svg, "", VZ.stroke({ stroke: C.cyan, "stroke-width": 2.2, "marker-end": ar1 }));
    var oay = VZ.path(svg, "", VZ.stroke({ stroke: C.mag, "stroke-width": 2.2, "marker-end": ar2 }));
    VZ.txt(svg, P.cx - 92, P.cy - 96, "东进 → 像这样动", { size: 10.5, fill: C.cyan });
    VZ.txt(svg, P.cx - 92, P.cy + 104, "北进 → 像这样动", { size: 10.5, fill: C.mag });
    var info = VZ.panel(stage, { "z": "", "u_x 与 v_y": "", "u_y 与 v_x": "", "判定": "" });
    function update(px, py) {
      var zx = VZ.clamp((px - P.cx) / P.U, -1.55, 1.55);
      var zy = VZ.clamp(-(py - P.cy) / P.U, -1.45, 1.45);
      var wx = zx * zx - zy * zy, wy = 2 * zx * zy;
      dot.setAttribute("cx", P.cx + zx * P.U); dot.setAttribute("cy", P.cy - zy * P.U);
      zlbl.setAttribute("x", P.cx + zx * P.U + 12); zlbl.setAttribute("y", P.cy - zy * P.U - 10);
      wdot.setAttribute("cx", Q.cx + wx * Q.U); wdot.setAttribute("cy", Q.cy - wy * Q.U);
      /* 输入端：单位试探箭头 */
      var L1 = 40;
      eax.setAttribute("d", "M" + (P.cx + zx * P.U) + " " + (P.cy - zy * P.U) + "l" + L1 + " 0");
      nay.setAttribute("d", "M" + (P.cx + zx * P.U) + " " + (P.cy - zy * P.U) + "l0 " + (-L1));
      /* 输出端：像箭头 = 2z（东）与 2zi（北），长度封顶 */
      var L2 = VZ.clamp(2 * Math.hypot(zx, zy) * Q.U * 0.5, 18, 62);
      var a1 = Math.atan2(2 * zy, 2 * zx), a2 = a1 + Math.PI / 2;
      var wpx = Q.cx + wx * Q.U, wpy = Q.cy - wy * Q.U;
      oax.setAttribute("d", "M" + wpx + " " + wpy + "l" + (L2 * Math.cos(a1)).toFixed(1) + " " + (-L2 * Math.sin(a1)).toFixed(1));
      oay.setAttribute("d", "M" + wpx + " " + wpy + "l" + (L2 * Math.cos(a2)).toFixed(1) + " " + (-L2 * Math.sin(a2)).toFixed(1));
      var ux = 2 * zx, vy = 2 * zx, uy = -2 * zy, vx = 2 * zy;
      VZ.setPanel(info, {
        "z": zx.toFixed(2) + (zy >= 0 ? " + " : " − ") + Math.abs(zy).toFixed(2) + " i",
        "u_x 与 v_y": ux.toFixed(2) + "  =  " + vy.toFixed(2) + "  ✓",
        "u_y 与 v_x": uy.toFixed(2) + "  =  −(" + vx.toFixed(2) + ")  ✓",
        "判定": "柯西–黎曼成立 → 全纯"
      });
    }
    VZ.drag(svg, svg, W, H, function (x, y, phase) {
      if (phase === "start" || phase === "move") update(x, y);
    });
    update(P.cx + 0.7 * P.U, P.cy - 0.5 * P.U);
    VZ.legend(stage, [["向东偏导 ∂f/∂x", C.cyan], ["向北偏导 ∂f/∂y", C.mag]]);
  }
},

/* ==========================================================
   f-ch07e · 全纯映射把圆变圆（挂：术语：全纯函数）
   ========================================================== */
"f-ch07e": {
  title: "",
  hint: "拖动金色圆心移动输入圆（w = 1/z）：<span class='hl'>不管怎么挪，像永远还是圆</span>——除非圆扫过原点，那时像变成直线（圆的极限情形）。这种「不撕不皱、圆变圆」的刚性，就是全纯函数是橡皮图章的代数面孔。",
  draw: function (stage) {
    var W = 760, H = 300, svg = VZ.S(stage, W, H, { grid: true });
    var C = VZ.C;
    function plane(x0, name) {
      var cx = x0 + 150, cy = 152, U = 78;
      VZ.ln(svg, cx - 140, cy, cx + 140, cy, { stroke: C.faint, "stroke-width": .8 });
      VZ.ln(svg, cx, cy - 118, cx, cy + 118, { stroke: C.faint, "stroke-width": .8 });
      VZ.txt(svg, cx + 120, cy - 104, name, { size: 12.5, fill: C.ink2, weight: 700 });
      return { cx: cx, cy: cy, U: U };
    }
    var P = plane(10, "z 平面");
    var Q = plane(380, "w = 1/z 平面");
    VZ.circ(svg, P.cx, P.cy, 5, { fill: C.ink2 });
    VZ.circ(svg, Q.cx, Q.cy, 5, { fill: C.ink2 });
    VZ.txt(svg, P.cx + 8, P.cy - 8, "0", { size: 10.5, fill: C.dim });
    VZ.txt(svg, Q.cx + 8, Q.cy - 8, "0", { size: 10.5, fill: C.dim });
    VZ.circ(svg, Q.cx, Q.cy, 7, { fill: "none", stroke: C.red, "stroke-width": 1.4 });
    VZ.txt(svg, Q.cx + 12, Q.cy + 4, "极点", { size: 10.5, fill: C.red });
    var inC = VZ.circ(svg, 0, 0, 0, VZ.stroke({ stroke: C.gold, "stroke-width": 2 }));
    var outP = VZ.path(svg, "", VZ.stroke({ stroke: C.cyan, "stroke-width": 2 }));
    var hDot = VZ.circ(svg, 0, 0, 7, { fill: C.gold });
    var cc = { x: 0.55, y: 0.4 }, r = 0.5;
    var info = VZ.panel(stage, { "输入圆 |z−c| = r": "", "像的形状": "", "像圆心 / 像半径": "" });
    function redraw() {
      var px = P.cx + cc.x * P.U, py = P.cy - cc.y * P.U;
      inC.setAttribute("cx", px); inC.setAttribute("cy", py);
      inC.setAttribute("r", r * P.U);
      hDot.setAttribute("cx", px); hDot.setAttribute("cy", py);
      var D = cc.x * cc.x + cc.y * cc.y - r * r;
      if (Math.abs(D) < 0.03) {  /* 圆过原点 → 像是直线 */
        outP.setAttribute("opacity", 1);
        var th = Math.atan2(cc.y, cc.x);
        /* 直线 Re(cw)=1/2：距原点 1/(2|c|)，法向 c 方向 */
        var dpx = (1 / (2 * Math.hypot(cc.x, cc.y))) * Q.U;
        var nx2 = Math.cos(th), ny2 = Math.sin(th);
        var px2 = Q.cx + dpx * nx2, py2 = Q.cy - dpx * ny2;
        var dx2 = -ny2, dy2 = nx2, L2 = 200;
        outP.setAttribute("d", "M" + (px2 - dx2 * L2).toFixed(1) + " " + (py2 + dy2 * L2).toFixed(1) +
          "L" + (px2 + dx2 * L2).toFixed(1) + " " + (py2 - dy2 * L2).toFixed(1));
        VZ.setPanel(info, { "输入圆 |z−c| = r": "c = " + cc.x.toFixed(2) + "+" + cc.y.toFixed(2) + "i,  r = " + r.toFixed(2),
          "像的形状": "直线（圆过原点）", "像圆心 / 像半径": "∞" });
        return;
      }
      /* 像是圆：采样后只画视口内的弧段，避免画出画布 */
      outP.setAttribute("opacity", 1);
      var ox2 = cc.x / D, oy2 = -cc.y / D;
      var rr2 = r / Math.abs(D);
      var cx2 = Q.cx + ox2 * Q.U, cy2 = Q.cy - oy2 * Q.U, rp = rr2 * Q.U;
      var d = "", pen = false;
      for (var s = 0; s <= 128; s++) {
        var a = 2 * Math.PI * s / 128;
        var sx2 = cx2 + rp * Math.cos(a), sy2 = cy2 + rp * Math.sin(a);
        if (sx2 > -20 && sx2 < 780 && sy2 > -20 && sy2 < 320) {
          d += (pen ? "L" : "M") + sx2.toFixed(1) + " " + sy2.toFixed(1);
          pen = true;
        } else pen = false;
      }
      outP.setAttribute("d", d);
      VZ.setPanel(info, { "输入圆 |z−c| = r": "c = " + cc.x.toFixed(2) + "+" + cc.y.toFixed(2) + "i,  r = " + r.toFixed(2),
        "像的形状": "还是圆！", "像圆心 / 像半径": (ox2).toFixed(2) + "+" + (oy2).toFixed(2) + "i  /  " + rr2.toFixed(2) });
    }
    VZ.drag(svg, svg, W, H, function (x, y, phase) {
      if (phase === "start" || phase === "move") {
        cc.x = VZ.clamp((x - P.cx) / P.U, -1.5, 1.5);
        cc.y = VZ.clamp(-(y - P.cy) / P.U, -1.35, 1.35);
        redraw();
      }
    });
    VZ.slider(stage, { label: "半径 r", value: 0.5, min: 0.2, max: 0.95, step: 0.01,
      format: function (v) { return v.toFixed(2); }, onInput: function (v) { r = v; redraw(); } });
    redraw();
  }
},

/* ==========================================================
   f-ch07f · 极点附近 1/z 的行为（挂：围道积分与留数）
   ========================================================== */
"f-ch07f": {
  title: "",
  hint: "拖动金色点逼近原点的红叉：|w| = 1/|z| <span class='hl'>冲向无穷</span>，顶上的量条会替你「量」住它。留数定理只用到了这个爆炸场中最简单的一层——绕极点一圈，w 的辐角恰好转一圈。",
  draw: function (stage) {
    var W = 760, H = 280, svg = VZ.S(stage, W, H, { grid: true });
    var C = VZ.C;
    var cx = 210, cy = 140, U = 62;
    VZ.ln(svg, cx - 150, cy, cx + 150, cy, { stroke: C.faint, "stroke-width": .8 });
    VZ.ln(svg, cx, cy - 112, cx, cy + 112, { stroke: C.faint, "stroke-width": .8 });
    [0.25, 0.5, 1].forEach(function (rv) {
      VZ.circ(svg, cx, cy, rv * U, { stroke: C.faint, "stroke-width": .8, "stroke-dasharray": "3 4" });
      VZ.txt(svg, cx + rv * U + 4, cy - 4, String(rv), { size: 9.5, fill: C.dim });
    });
    VZ.path(svg, "M" + (cx - 7) + " " + (cy - 7) + "l14 14M" + (cx - 7) + " " + (cy + 7) + "l14 -14", VZ.stroke({ stroke: C.red, "stroke-width": 2.4 }));
    VZ.txt(svg, cx + 12, cy - 12, "极点 z=0", { size: 11, fill: C.red });
    var zx = 0.9, zy = 0.45;
    var dot = VZ.circ(svg, 0, 0, 7, { fill: C.gold });
    var ray = VZ.path(svg, "", VZ.stroke({ stroke: C.gold, "stroke-width": 1.2, opacity: .6, "stroke-dasharray": "4 3" }));
    var zlbl = VZ.txt(svg, 0, 0, "z", { size: 13, fill: C.gold, weight: 700 });
    /* 量条 */
    var bx = 480, by = 74, bw = 230, bh = 26;
    VZ.card(svg, bx - 12, by - 34, bw + 24, 92, { stroke: "rgba(255,255,255,.12)" });
    VZ.txt(svg, bx, by - 14, "|w| = 1/|z|（封顶 50）", { size: 11.5, fill: C.ink2 });
    VZ.card(svg, bx, by, bw, bh, { stroke: C.faint, fill: "rgba(255,255,255,.05)" });
    var bar = VZ.el("rect", { x: bx, y: by, width: 10, height: bh, fill: C.red }, svg);
    var wArrow = VZ.path(svg, "", VZ.stroke({ stroke: C.cyan, "stroke-width": 2 }));
    var wDot = VZ.circ(svg, 0, 0, 6, { fill: C.cyan });
    var qx = 210 + 340, qy = 140 + 42;
    VZ.txt(svg, qx + 4, qy - 96, "w = 1/z 平面", { size: 11.5, fill: C.ink2 });
    VZ.ln(svg, qx - 40, qy, qx + 100, qy, { stroke: C.faint, "stroke-width": .8 });
    VZ.ln(svg, qx, qy - 84, qx, qy + 84, { stroke: C.faint, "stroke-width": .8 });
    var info = VZ.panel(stage, { "z": "", "w = 1/z": "", "|w| = 1/|z|": "" });
    function redraw() {
      var r = Math.hypot(zx, zy), th = Math.atan2(zy, zx);
      dot.setAttribute("cx", cx + zx * U); dot.setAttribute("cy", cy - zy * U);
      zlbl.setAttribute("x", cx + zx * U + 10);
      zlbl.setAttribute("y", cy - zy * U - 8);
      ray.setAttribute("d", "M" + cx + " " + cy + "L" + (cx + zx * U) + " " + (cy - zy * U));
      var wr = 1 / Math.max(r, 0.08), wth = -th;
      var cap = Math.min(wr, 1.6);
      wDot.setAttribute("cx", qx + cap * 52 * Math.cos(wth)); wDot.setAttribute("cy", qy - cap * 52 * Math.sin(wth));
      wArrow.setAttribute("d", "M" + qx + " " + qy + "L" + (qx + cap * 52 * Math.cos(wth)).toFixed(1) + " " + (qy - cap * 52 * Math.sin(wth)).toFixed(1));
      bar.setAttribute("width", VZ.clamp(wr / 50, 0.01, 1) * bw);
      bar.setAttribute("fill", wr > 8 ? C.red : wr > 2.5 ? C.gold : C.green);
      VZ.setPanel(info, {
        "z": zx.toFixed(2) + (zy >= 0 ? " + " : " − ") + Math.abs(zy).toFixed(2) + " i   (|z| = " + r.toFixed(3) + ")",
        "w = 1/z": (wr * Math.cos(wth)).toFixed(3) + (wr * Math.sin(wth) >= 0 ? " + " : " − ") + Math.abs(wr * Math.sin(wth)).toFixed(3) + " i",
        "|w| = 1/|z|": wr.toFixed(2) + (wr > 8 ? "  ← 爆炸中" : "")
      });
    }
    VZ.drag(svg, svg, W, H, function (x, y, phase) {
      if (phase === "start" || phase === "move") {
        var nx = (x - cx) / U, ny = -(y - cy) / U;
        var rr = Math.hypot(nx, ny);
        if (rr < 0.18) { nx *= 0.18 / rr; ny *= 0.18 / rr; }
        if (rr > 2.2) { nx *= 2.2 / rr; ny *= 2.2 / rr; }
        zx = nx; zy = ny;
        redraw();
      }
    });
    redraw();
  }
},

/* ==========================================================
   f-ch07g · 收敛半径 1 与收敛半径 ∞（挂：收敛半径 1 和收敛半径无穷）
   ========================================================== */
"f-ch07g": {
  title: "",
  hint: "拖动金色点，同一个点在两个函数里试幂级数（各取 14 项）：左边 1/(1+z²) 的泰勒级数<span class='hl'>出圈即发散</span>（圈由奇点 ±i 卡死）；右边 e^z 的级数<span class='hl'>处处收敛</span>，半径无穷。误差读数会实时告诉你谁灵谁不灵。",
  draw: function (stage) {
    var W = 760, H = 300, svg = VZ.S(stage, W, H, { grid: true });
    var C = VZ.C;
    function plane(x0, name, sub) {
      var cx = x0 + 170, cy = 140, U = 88;
      VZ.ln(svg, cx - 150, cy, cx + 150, cy, { stroke: C.faint, "stroke-width": .8 });
      VZ.ln(svg, cx, cy - 108, cx, cy + 108, { stroke: C.faint, "stroke-width": .8 });
      VZ.txt(svg, cx + 128, cy - 96, name, { size: 12.5, fill: C.ink2, weight: 700 });
      VZ.txt(svg, cx - 146, cy + 122, sub, { size: 10.5, fill: C.dim });
      return { cx: cx, cy: cy, U: U };
    }
    var P = plane(20, "1/(1+z²)", "收敛半径 1：被奇点 ±i 卡死");
    var Q = plane(390, "e^z", "收敛半径 ∞：处处收敛");
    VZ.circ(svg, P.cx, P.cy, P.U, { stroke: C.gold, "stroke-width": 1.4, "stroke-dasharray": "6 5" });
    VZ.circ(svg, P.cx, P.cy - P.U, 5.5, { fill: C.red });
    VZ.circ(svg, P.cx, P.cy + P.U, 5.5, { fill: C.red });
    VZ.txt(svg, P.cx + 10, P.cy - P.U + 4, "i", { size: 11, fill: C.red });
    VZ.txt(svg, P.cx + 10, P.cy + P.U + 4, "−i", { size: 11, fill: C.red });
    VZ.txt(svg, P.cx - P.U - 26, P.cy + 14, "|z|=1", { size: 10, fill: C.gold, anchor: "end" });
    var d1 = VZ.circ(svg, 0, 0, 7, { fill: C.gold });
    var d2 = VZ.circ(svg, 0, 0, 7, { fill: C.gold });
    var info = VZ.panel(stage, { "z": "", "左边误差 |S₁₄ − f|": "", "右边误差 |S₁₄ − e^z|": "" });
    function partial(zx, zy, isExp) {
      var sr = 0, si = 0;
      if (!isExp) {
        /* 1/(1+z²) = Σ_{k=0..6} (−1)^k z^{2k}（14 阶） */
        var pr = 1, pi = 0;
        for (var k = 0; k < 7; k++) {
          var sgn = (k % 2) ? -1 : 1;
          sr += sgn * pr; si += sgn * pi;
          var nr = pr * zx - pi * zy, ni = pr * zy + pi * zx;
          pr = nr * zx - ni * zy; pi = nr * zy + ni * zx;
        }
      } else {
        /* e^z = Σ_{k=0..13} z^k / k! */
        var tr = 1, ti = 0, fk = 1;
        for (var k2 = 0; k2 < 14; k2++) {
          if (k2 > 0) fk *= k2;
          sr += tr / fk; si += ti / fk;
          var nr2 = tr * zx - ti * zy, ni2 = tr * zy + ti * zx;
          tr = nr2; ti = ni2;
        }
      }
      return [sr, si];
    }
    function redraw(zx, zy) {
      var r = Math.hypot(zx, zy);
      if (r > 1.55) { zx *= 1.55 / r; zy *= 1.55 / r; r = 1.55; }
      d1.setAttribute("cx", P.cx + zx * P.U); d1.setAttribute("cy", P.cy - zy * P.U);
      d2.setAttribute("cx", Q.cx + zx * Q.U); d2.setAttribute("cy", Q.cy - zy * Q.U);
      var s1 = partial(zx, zy, false), s2 = partial(zx, zy, true);
      var ar = zx * zx - zy * zy, ai = 2 * zx * zy;
      var br = 1 + ar, bi = ai;
      var dd = br * br + bi * bi;
      var f1r = br / dd, f1i = -bi / dd;
      var e1 = Math.hypot(s1[0] - f1r, s1[1] - f1i);
      var er = Math.exp(zx) * Math.cos(zy), ei = Math.exp(zx) * Math.sin(zy);
      var e2 = Math.hypot(s2[0] - er, s2[1] - ei);
      VZ.setPanel(info, {
        "z": zx.toFixed(2) + (zy >= 0 ? " + " : " − ") + Math.abs(zy).toFixed(2) + " i   (|z| = " + r.toFixed(2) + ")",
        "左边误差 |S₁₄ − f|": e1 < 0.02 ? e1.toExponential(2) + "  ✓ 收敛" : e1.toExponential(2) + (r > 1 ? "  ✗ 出圈发散" : "  边缘吃紧"),
        "右边误差 |S₁₄ − e^z|": e2.toExponential(2) + "  ✓ 处处收敛"
      });
    }
    var zx = 0.55, zy = 0.45;
    VZ.drag(svg, svg, W, H, function (x, y, phase) {
      if (phase === "start" || phase === "move") {
        zx = VZ.clamp((x - P.cx) / P.U, -1.55, 1.55);
        zy = VZ.clamp(-(y - P.cy) / P.U, -1.15, 1.15);
        redraw(zx, zy);
      }
    });
    redraw(0.55, 0.45);
  }
},

/* ==========================================================
   f-ch08d · √z 的螺旋停车场（挂：打个比方：两层停车楼的坡道）
   ========================================================== */
"f-ch08d": {
  title: "",
  hint: "滑动 <b>θ</b> 让点绕原点转：俯视图里每转一圈回到同一处，侧视图里却<span class='hl'>爬上了另一层</span>——√z 的值恰好翻一个符号。黎曼面把这两层粘成一座停车楼，函数在楼上处处单值。",
  draw: function (stage) {
    var W = 760, H = 310, svg = VZ.S(stage, W, H, { grid: true });
    var C = VZ.C;
    var THMAX = 4 * Math.PI;
    /* 俯视图（左上） */
    var cx = 150, cy = 108, R = 70;
    VZ.circ(svg, cx, cy, R, { stroke: C.faint, "stroke-width": 1 });
    VZ.ln(svg, cx - R - 20, cy, cx + R + 20, cy, { stroke: C.faint, "stroke-width": .8 });
    VZ.txt(svg, cx, cy + R + 34, "俯视：z 每圈回到原地", { size: 11.5, fill: C.ink2, anchor: "middle" });
    var topDot = VZ.circ(svg, cx + R, cy, 6, { fill: C.gold });
    /* 侧视螺旋（右） */
    var hx0 = 300, hx1 = 700, hy0 = 240, amp = 34, perH = 46;
    var helix = "";
    for (var i = 0; i <= 160; i++) {
      var th = THMAX * i / 160;
      var hx = hx0 + (hx1 - hx0) * th / THMAX;
      var hy = hy0 - th * perH / (2 * Math.PI) + amp * Math.sin(th);
      helix += (i ? "L" : "M") + hx.toFixed(1) + " " + hy.toFixed(1);
    }
    VZ.path(svg, helix, VZ.stroke({ stroke: C.violet, "stroke-width": 1.8, opacity: .9 }));
    [0, 1, 2, 3, 4].forEach(function (n) {
      var ty = hy0 - n * perH;
      if (ty > 30) VZ.txt(svg, hx0 - 12, ty + 4, "第 " + n + " 层", { size: 10.5, fill: C.dim, anchor: "end" });
    });
    VZ.txt(svg, (hx0 + hx1) / 2, 282, "侧视：坡道盘旋而上（θ 从 0 到 4π）", { size: 11.5, fill: C.ink2, anchor: "middle" });
    var hDot = VZ.circ(svg, 0, 0, 6.5, { fill: C.gold });
    var info = VZ.panel(stage, { "θ（转过的角度）": "", "√z = e^{iθ/2}": "", "现在在第几层": "" });
    function redraw(th) {
      topDot.setAttribute("cx", cx + R * Math.cos(th));
      topDot.setAttribute("cy", cy - R * Math.sin(th));
      var hx = hx0 + (hx1 - hx0) * th / THMAX;
      var hy = hy0 - th * perH / (2 * Math.PI) + amp * Math.sin(th);
      hDot.setAttribute("cx", hx); hDot.setAttribute("cy", hy);
      var half = th / 2;
      VZ.setPanel(info, {
        "θ（转过的角度）": th.toFixed(2) + " rad（" + (th / (2 * Math.PI)).toFixed(2) + " 圈）",
        "√z = e^{iθ/2}": Math.cos(half).toFixed(3) + (Math.sin(half) >= 0 ? " + " : " − ") + Math.abs(Math.sin(half)).toFixed(3) + " i",
        "现在在第几层": String(Math.floor(th / (2 * Math.PI) + 1e-9))
      });
    }
    VZ.slider(stage, { label: "θ", value: 0, min: 0, max: THMAX, step: 0.01,
      format: function (v) { return (v / Math.PI).toFixed(2) + " π"; }, onInput: redraw });
    redraw(0);
  }
},

/* ==========================================================
   f-ch08e · w = z²：绕两圈才回来（挂：一步步看清：为什么绕两圈才回来）
   ========================================================== */
"f-ch08e": {
  title: "",
  hint: "滑动 <b>φ</b>（w 的辐角）：右边的 w 每绕一圈，左边的 z 只走半圈、落到 −z（另一张叶上）；<span class='hl'>w 要绕两圈，z 才转满一圈回到起点</span>——这就是「绕两圈才回来」的全部原因。",
  draw: function (stage) {
    var W = 760, H = 300, svg = VZ.S(stage, W, H, { grid: true });
    var C = VZ.C;
    function plane(x0, name) {
      var cx = x0 + 160, cy = 140, U = 84;
      VZ.circ(svg, cx, cy, U, { stroke: C.faint, "stroke-width": 1 });
      VZ.ln(svg, cx - U - 22, cy, cx + U + 22, cy, { stroke: C.faint, "stroke-width": .8 });
      VZ.txt(svg, cx + 120, cy - 92, name, { size: 12.5, fill: C.ink2, weight: 700 });
      return { cx: cx, cy: cy, U: U };
    }
    var P = plane(20, "z（平方根 · 两层叶）");
    var Q = plane(390, "w = z²（单层）");
    /* 两片半透明叶 */
    VZ.path(svg, "M" + P.cx + " " + P.cy + "A" + P.U + " " + P.U + " 0 0 1 " + (P.cx - P.U) + " " + P.cy + "Z", { fill: C.cyan, opacity: .12 });
    VZ.path(svg, "M" + P.cx + " " + P.cy + "A" + P.U + " " + P.U + " 0 0 1 " + (P.cx + P.U) + " " + P.cy + "Z", { fill: C.mag, opacity: .12 });
    VZ.txt(svg, P.cx - P.U / 2, P.cy - 12, "叶 2", { size: 10.5, fill: C.mag, anchor: "middle" });
    VZ.txt(svg, P.cx + P.U / 2, P.cy + 22, "叶 1", { size: 10.5, fill: C.cyan, anchor: "middle" });
    var zDot = VZ.circ(svg, 0, 0, 7, { fill: C.gold });
    var wDot = VZ.circ(svg, 0, 0, 7, { fill: C.gold });
    var trace = VZ.path(svg, "", VZ.stroke({ stroke: C.gold, "stroke-width": 2.4, opacity: .85 }));
    var info = VZ.panel(stage, { "φ（w 的辐角）": "", "z = e^{iφ/2}": "", "w 绕一圈后 z": "" });
    var PHMAX = 4 * Math.PI;
    function redraw(ph) {
      var half = ph / 2;
      var zx = Math.cos(half), zy = Math.sin(half);
      zDot.setAttribute("cx", P.cx + P.U * zx); zDot.setAttribute("cy", P.cy - P.U * zy);
      zDot.setAttribute("fill", (ph % (4 * Math.PI)) < 2 * Math.PI ? C.cyan : C.mag);
      wDot.setAttribute("cx", Q.cx + Q.U * Math.cos(ph));
      wDot.setAttribute("cy", Q.cy - Q.U * Math.sin(ph));
      /* z 走过的轨迹（半圈一段） */
      var d = "";
      var steps = 40;
      for (var i = 0; i <= steps; i++) {
        var a = half * i / steps;
        d += (i ? "L" : "M") + (P.cx + P.U * Math.cos(a)).toFixed(1) + " " + (P.cy - P.U * Math.sin(a)).toFixed(1);
      }
      trace.setAttribute("d", d);
      VZ.setPanel(info, {
        "φ（w 的辐角）": (ph / Math.PI).toFixed(2) + " π",
        "z = e^{iφ/2}": zx.toFixed(3) + (zy >= 0 ? " + " : " − ") + Math.abs(zy).toFixed(3) + " i",
        "w 绕一圈后 z": "z → −z（换到另一叶）"
      });
    }
    VZ.slider(stage, { label: "φ", value: 0, min: 0, max: PHMAX, step: 0.01,
      format: function (v) { return (v / Math.PI).toFixed(2) + " π"; }, onInput: redraw });
    redraw(0);
  }
},

/* ==========================================================
   f-ch08f · 共形映射保角（挂：8.5 共形映射：角度一丝不变）
   ========================================================== */
"f-ch08f": {
  title: "",
  hint: "拖动金色顶点（别拖到原点）：两条 60° 的射线经 w = z² 映射后，<span class='hl'>夹角读数分毫不变</span>——这就是「共形」。但把顶点拖近原点，读数开始翻倍：临界点处保角性失效，z² 在那里把一切角度翻倍。",
  draw: function (stage) {
    var W = 760, H = 310, svg = VZ.S(stage, W, H, { grid: true });
    var C = VZ.C;
    function plane(x0, name) {
      var cx = x0 + 160, cy = 150, U = 72;
      VZ.ln(svg, cx - 140, cy, cx + 140, cy, { stroke: C.faint, "stroke-width": .8 });
      VZ.ln(svg, cx, cy - 122, cx, cy + 122, { stroke: C.faint, "stroke-width": .8 });
      VZ.txt(svg, cx + 118, cy - 108, name, { size: 12.5, fill: C.ink2, weight: 700 });
      return { cx: cx, cy: cy, U: U };
    }
    var P = plane(10, "z 平面");
    var Q = plane(390, "w = z² 平面");
    var rayA = VZ.path(svg, "", VZ.stroke({ stroke: C.cyan, "stroke-width": 2 }));
    var rayB = VZ.path(svg, "", VZ.stroke({ stroke: C.mag, "stroke-width": 2 }));
    var imA = VZ.path(svg, "", VZ.stroke({ stroke: C.cyan, "stroke-width": 2 }));
    var imB = VZ.path(svg, "", VZ.stroke({ stroke: C.mag, "stroke-width": 2 }));
    var dot = VZ.circ(svg, 0, 0, 7, { fill: C.gold });
    var arc1 = VZ.path(svg, "", VZ.stroke({ stroke: C.gold, "stroke-width": 1.3 }));
    var arc2 = VZ.path(svg, "", VZ.stroke({ stroke: C.gold, "stroke-width": 1.3 }));
    var ZERO = Math.PI / 6;  /* 两射线方向 ±30° */
    var info = VZ.panel(stage, { "顶点 z": "", "输入夹角": "", "输出夹角": "", "判定": "" });
    function update(px, py) {
      var zx = (px - P.cx) / P.U, zy = -(py - P.cy) / P.U;
      var r = Math.hypot(zx, zy);
      if (r < 0.05) { zx = 0; zy = 0; }   /* 吸附到临界点 */
      else if (r > 1.5) { zx *= 1.5 / r; zy *= 1.5 / r; }
      var base = Math.atan2(zy, zx);
      dot.setAttribute("cx", P.cx + zx * P.U); dot.setAttribute("cy", P.cy - zy * P.U);
      var ptsA = [], ptsB = [];
      for (var i = 0; i <= 30; i++) {
        var t = 1.9 * i / 30;
        var xA = zx + t * Math.cos(base + ZERO), yA = zy + t * Math.sin(base + ZERO);
        var xB = zx + t * Math.cos(base - ZERO), yB = zy + t * Math.sin(base - ZERO);
        ptsA.push([xA, yA]); ptsB.push([xB, yB]);
      }
      function rayPath(pts) {
        var d = "";
        for (var i2 = 0; i2 < pts.length; i2++) {
          if (Math.hypot(pts[i2][0], pts[i2][1]) > 1.9) break;
          d += (i2 ? "L" : "M") + (P.cx + pts[i2][0] * P.U).toFixed(1) + " " + (P.cy - pts[i2][1] * P.U).toFixed(1);
        }
        return d;
      }
      rayA.setAttribute("d", rayPath(ptsA));
      rayB.setAttribute("d", rayPath(ptsB));
      function imPath(pts) {
        var d = "";
        for (var i3 = 0; i3 < pts.length; i3++) {
          var wr = pts[i3][0] * pts[i3][0] - pts[i3][1] * pts[i3][1];
          var wi = 2 * pts[i3][0] * pts[i3][1];
          if (Math.abs(wr) > 1.85 || Math.abs(wi) > 1.55) break;
          d += (i3 ? "L" : "M") + (Q.cx + wr * Q.U).toFixed(1) + " " + (Q.cy - wi * Q.U).toFixed(1);
        }
        return d;
      }
      imA.setAttribute("d", imPath(ptsA));
      imB.setAttribute("d", imPath(ptsB));
      /* 输出端夹角：数值上取像曲线起始段的方向（相邻采样点，够贴近切线） */
      function imDir(pts) {
        var w1 = [pts[0][0] * pts[0][0] - pts[0][1] * pts[0][1], 2 * pts[0][0] * pts[0][1]];
        var w2 = [pts[1][0] * pts[1][0] - pts[1][1] * pts[1][1], 2 * pts[1][0] * pts[1][1]];
        return Math.atan2(w2[1] - w1[1], w2[0] - w1[0]);
      }
      var a1 = imDir(ptsA), a2 = imDir(ptsB);
      var outAng = Math.abs(a1 - a2) * 180 / Math.PI;
      if (outAng > 180) outAng = 360 - outAng;
      var wx = zx * zx - zy * zy, wy = 2 * zx * zy;
      var wpx = Q.cx + wx * Q.U, wpy = Q.cy - wy * Q.U;
      arc1.setAttribute("d", "M" + (wpx + 26 * Math.cos(a1)).toFixed(1) + " " + (wpy - 26 * Math.sin(a1)).toFixed(1) +
        "A26 26 0 0 1 " + (wpx + 26 * Math.cos(a2)).toFixed(1) + " " + (wpy - 26 * Math.sin(a2)).toFixed(1));
      arc2.setAttribute("d", "M" + (P.cx + zx * P.U + 22 * Math.cos(base + ZERO)).toFixed(1) + " " + (P.cy - zy * P.U - 22 * Math.sin(base + ZERO)).toFixed(1) +
        "A22 22 0 0 0 " + (P.cx + zx * P.U + 22 * Math.cos(base - ZERO)).toFixed(1) + " " + (P.cy - zy * P.U - 22 * Math.sin(base - ZERO)).toFixed(1));
      var atZero = (zx === 0 && zy === 0);
      VZ.setPanel(info, {
        "顶点 z": atZero ? "0（临界点）" : zx.toFixed(2) + (zy >= 0 ? " + " : " − ") + Math.abs(zy).toFixed(2) + " i",
        "输入夹角": "60.0°",
        "输出夹角": outAng.toFixed(1) + "°",
        "判定": atZero ? "保角性失效：角翻倍" : (Math.abs(outAng - 60) < 1 ? "共形：角几乎不变 ✓" : "有限大小的角略走样（共形只管无穷小）")
      });
    }
    var ix = P.cx + 0.95 * P.U * Math.cos(-0.9), iy = P.cy - 0.95 * P.U * Math.sin(-0.9);
    VZ.drag(svg, svg, W, H, function (x, y, phase) {
      if (phase === "start" || phase === "move") update(x, y);
    });
    update(ix, iy);
  }
},

/* ==========================================================
   f-ch08g · 黎曼映射定理（挂：8.7 没有洞，就都能揉成圆盘）
   ========================================================== */
"f-ch08g": {
  title: "",
  hint: "选一个单连通区域，点「揉成圆盘」：边界被平滑压到单位圆上，<span class='hl'>对应点沿同一条辐角线一起走</span>。黎曼映射定理说：只要没有洞，任何这样的区域都能这样揉成圆盘——而且映射可以共形。",
  draw: function (stage) {
    var W = 760, H = 300, svg = VZ.S(stage, W, H, { grid: true });
    var C = VZ.C;
    var shapes = {
      "星形": function (th) { return 1 + 0.38 * Math.cos(5 * th); },
      "圆角方块": function (th) { return 1 / Math.max(Math.abs(Math.cos(th)), Math.abs(Math.sin(th))) * 0.82; },
      "花瓣": function (th) { return 1 + 0.32 * Math.cos(3 * th) - 0.12 * Math.sin(2 * th); }
    };
    var cur = "星形", prog = 0;
    var cx = 380, cy = 146, R = 108;
    VZ.circ(svg, cx, cy, R, { stroke: C.faint, "stroke-width": 1, "stroke-dasharray": "6 5" });
    var spokes = VZ.g(svg);
    var region = VZ.path(svg, "", VZ.stroke({ stroke: C.cyan, "stroke-width": 2.2 }));
    var fillP = VZ.path(svg, "", { fill: C.cyan, opacity: .1, stroke: "none" });
    var dotsG = VZ.g(svg);
    var NPT = 90, SPK = 8;
    function shapeR(th) { return shapes[cur](th); }
    function draw() {
      var e = VZ.ease(prog);
      var dOuter = "", dFill = "";
      for (var i = 0; i <= NPT; i++) {
        var th = 2 * Math.PI * i / NPT;
        var rr = (shapeR(th) * (1 - e) + e) * R;
        dOuter += (i ? "L" : "M") + (cx + rr * Math.cos(th)).toFixed(1) + " " + (cy - rr * Math.sin(th)).toFixed(1);
        dFill += (i ? "L" : "M") + (cx + rr * Math.cos(th)).toFixed(1) + " " + (cy - rr * Math.sin(th)).toFixed(1);
      }
      region.setAttribute("d", dOuter + "Z");
      fillP.setAttribute("d", dFill + "Z");
      dotsG.innerHTML = "";
      spokes.innerHTML = "";
      for (var k = 0; k < SPK; k++) {
        var th2 = 2 * Math.PI * k / SPK + 0.35;
        var r1 = shapeR(th2) * (1 - e) * R;
        VZ.ln(spokes, cx + r1 * Math.cos(th2), cy - r1 * Math.sin(th2),
          cx + R * Math.cos(th2), cy - R * Math.sin(th2),
          { stroke: C.gold, "stroke-width": 1, "stroke-dasharray": "3 3", opacity: .8 });
        VZ.circ(dotsG, cx + r1 * Math.cos(th2), cy - r1 * Math.sin(th2), 4, { fill: C.gold });
        VZ.circ(dotsG, cx + R * Math.cos(th2), cy - R * Math.sin(th2), 4, { fill: C.gold });
      }
    }
    draw();
    var stop = null, prog = 0, target = 0;
    VZ.btn(stage, "揉成圆盘", function () { target = 1; go(); });
    VZ.btn(stage, "变回去", function () { target = 0; go(); });
    function go() {
      if (stop) return;
      stop = VZ.raf(svg, function (tSec, dt) {
        var dir = target > prog ? 1 : -1;
        prog = prog + dir * (dt / 1000) / 1.4;
        if ((dir > 0 && prog >= target) || (dir < 0 && prog <= target)) {
          prog = target; draw(); stop(); stop = null; return;
        }
        draw();
      });
    }
    VZ.chips(stage, Object.keys(shapes), cur, function (k) { cur = k; prog = 0; draw(); });
  }
}
,
/* ==========================================================
   08h · log z 的螺旋黎曼面：每绕一圈只升高一层
   ========================================================== */
"f-ch08h": {
  title: "log z 的螺旋黎曼面：绕一圈只升一层，永远不必回头",
  hint: "拖动可以转视角——这是一条真正的<b>螺旋坡道</b>，不是一个平面。转 <b>绕行角 θ</b>：金点沿坡道往上爬，脚下平面里的影子始终跟着同一个 z 转圈。<span class='hl'>点「压平」把楼压回地面</span>：三层重叠成一圈，平面上的 log 就成了多值。",
  draw: function (stage) {
    var W = 760, H = 412, C = VZ.C, TAU = Math.PI * 2;
    var deg = 560, flat = 1, target = 1;
    var H0 = 1.05;                       /* 每圈升高 */
    var api = VZ.stage3(stage, W, H, paint, { yaw: -0.95, pitch: -0.30, dist: 3.7 });

    function P(r, a) { return [r * Math.cos(a), r * Math.sin(a), flat * H0 * a / TAU]; }

    function paint(ctx, w, h, fr) {
      var proj = fr.proj;
      ctx.clearRect(0, 0, w, h);

      /* 地面网格 */
      for (var g = -1.5; g <= 1.5001; g += 0.5) {
        VZ.m3wire(ctx, [[g, -1.5, 0], [g, 1.5, 0]], proj, C.faint, .7);
        VZ.m3wire(ctx, [[-1.5, g, 0], [1.5, g, 0]], proj, C.faint, .7);
      }
      var circ = [];
      for (var i = 0; i <= 64; i++) { var a0 = i / 64 * TAU; circ.push([Math.cos(a0), Math.sin(a0), 0]); }
      VZ.m3wire(ctx, circ, proj, C.ink2, 1.3);

      /* 螺旋面：沿 θ 分成 3 圈，每圈一个色相 */
      var NT = 170, NR = 3, r0 = 0.98, r1 = 1.34, quads = [];
      for (var i2 = 0; i2 < NT; i2++) {
        var a = i2 / NT * 3 * TAU, b = (i2 + 1) / NT * 3 * TAU;
        var lay = Math.floor(a / TAU);
        for (var j = 0; j < NR; j++) {
          var ra = r0 + (r1 - r0) * j / NR, rb = r0 + (r1 - r0) * (j + 1) / NR;
          var p1 = P(ra, a), p2 = P(rb, a), p3 = P(rb, b), p4 = P(ra, b);
          var q1 = proj(p1), q2 = proj(p2), q3 = proj(p3), q4 = proj(p4);
          var dep = (q1[2] + q2[2] + q3[2] + q4[2]) / 4;
          var lum = 40 + 16 * (j / NR) + 8 * Math.min(1, flat);
          quads.push({ d: dep, pts: [q1, q2, q3, q4], col: "hsl(" + (184 + lay * 30) + ",72%," + lum.toFixed(0) + "%)" });
        }
      }
      quads.sort(function (A, B) { return B.d - A.d; });
      for (var k = 0; k < quads.length; k++) VZ.m3fill(ctx, quads[k].pts, quads[k].col, "rgba(0,0,0,.10)", .35);

      /* 竖直高度轴 */
      var axTop = flat * H0 * 3;
      VZ.m3wire(ctx, [[0, 0, 0], [0, 0, axTop + .12]], proj, C.violet, 1.2, [3, 4]);
      var gp = proj([-1.62, -1.62, 0]);
      ctx.fillStyle = C.dim;
      ctx.font = "11px -apple-system,PingFang SC,sans-serif";
      ctx.fillText("z 平面（地面）", gp[0] - 6, gp[1] + 14);

      /* 当前点、影子、连线 */
      var aNow = deg * Math.PI / 180;
      var pNow = P(1.16, aNow), sNow = [pNow[0], pNow[1], 0];
      VZ.m3wire(ctx, [[pNow[0], pNow[1], 0], pNow], proj, C.gold, 1, [3, 4]);
      VZ.m3sphere(ctx, sNow, proj, 3.6, "rgba(255,207,92,.55)", null);
      VZ.m3sphere(ctx, pNow, proj, 7, C.gold, C.deep);

      /* 标注 */
      ctx.fillStyle = C.dim;
      ctx.font = "11px -apple-system,PingFang SC,sans-serif";
      ctx.fillText("z 平面（影子落在这里）", 14, h - 30);
      ctx.fillStyle = C.violet;
      ctx.fillText("↑ Im log z：每转一圈升一层", 14, h - 12);
      ctx.fillStyle = "rgba(255,255,255,.35)";
      ctx.font = "10.5px -apple-system,PingFang SC,sans-serif";
      ctx.fillText("拖动旋转 · 滚轮缩放", w - 150, 18);
    }

    var ctl = VZ.box(stage, "viz-ctl");
    var pan = VZ.panel(stage, { "绕行角 θ": "", "所在楼层": "", "Im log z": "", "平面上的 z": "" });
    var say = VZ.note(stage, "");

    var sld = VZ.slider(ctl, {
      label: "绕行角 θ", min: 0, max: 1080, step: 10, value: deg,
      format: function (v) { return v + "°"; },
      onInput: function (v) { deg = v; refresh(); }
    });
    VZ.btn(ctl, "压平成复平面", function () { target = 0; });
    VZ.btn(ctl, "立成螺旋面", function () { target = 1; });
    VZ.btn(ctl, "再绕一圈 +360°", function () {
      deg = deg + 360 > 1080 ? 0 : deg + 360; sld.set(deg); refresh();
    });

    function refresh() {
      api.redraw();
      var k = Math.floor(deg / 360 + 1e-9), ang = Math.round(deg % 360);
      VZ.setPanel(pan, {
        "绕行角 θ": (deg / 360).toFixed(2) + " 圈（" + deg + "°）",
        "所在楼层": "第 " + k + " 层",
        "Im log z": (deg / 180).toFixed(2) + "π",
        "平面上的 z": "∠" + ang + "°"
      });
      say.innerHTML = flat > .85
        ? "坡道是<b>叠加</b>的：绕一圈回来 z 没变、<b>层数 +1</b>，所以 log 在平面上必然多值；把每一层都造出来，函数才处处单值。"
        : "<b>压平状态</b>：三层楼叠成一圈，只剩单位圆还留着痕迹 —— 同一个 z 对应 ln|z| + θi + 2πki（k ∈ ℤ），单值化失败。";
    }

    VZ.raf(stage, function () {
      if (Math.abs(flat - target) > .004) {
        flat += (target - flat) * .16;
        refresh();
      }
    });
    refresh();
  }
},

"f-ch08i": {
  title: "全纯映射的局部旋转与缩放：小方块永远还是正方形",
  hint: "拖左边的<b>金点</b>换位置，或换函数看：右边小方块<b>始终是正方形</b>，只是被转了 arg f′、缩放了 |f′| 倍。<span class='hl'>形状不动、尺度随位置变</span>——这就是「共形」的局部含义。越靠近 f′ = 0 的临界点，方块越小、转角越失效。",
  draw: function (stage) {
    var W = 760, H = 404, svg = VZ.S(stage, W, H, { grid: true });
    var C = VZ.C;
    var LX = 190, LY = 196, RX = 562, RY = 196, S = 72;
    var HS = 0.3;
    var fname = "z2";
    var z0 = { re: 1.02, im: 0.7 };

    function f(z) {
      if (fname === "z2") return { re: z.re * z.re - z.im * z.im, im: 2 * z.re * z.im };
      var d = z.re * z.re + z.im * z.im;
      return { re: z.re / d, im: -z.im / d };
    }
    function df(z) {
      if (fname === "z2") return { re: 2 * z.re, im: 2 * z.im };
      var d = z.re * z.re + z.im * z.im, dd = d * d;
      return { re: (z.im * z.im - z.re * z.re) / dd, im: 2 * z.re * z.im / dd };
    }
    function clampZ(z) {
      var r = Math.sqrt(z.re * z.re + z.im * z.im);
      var lo = fname === "z2" ? 0.4 : 0.7, hi = 1.24;
      if (r < 1e-6) return { re: lo, im: 0 };
      var rr = Math.min(hi, Math.max(lo, r));
      return { re: z.re / r * rr, im: z.im / r * rr };
    }

    function panel(cx, cy, label) {
      VZ.card(svg, cx - 160, cy - 152, 320, 306, { stroke: C.faint, rx: 12 });
      VZ.txt(svg, cx - 148, cy - 132, label, { size: 11.5, fill: C.dim });
      VZ.ln(svg, cx - 150, cy, cx + 150, cy, { stroke: C.ink2, "stroke-width": 1, opacity: .5 });
      VZ.ln(svg, cx, cy + 140, cx, cy - 140, { stroke: C.ink2, "stroke-width": 1, opacity: .5 });
      VZ.txt(svg, cx + 148, cy - 7, "Re", { size: 10, fill: C.dim, anchor: "end" });
      VZ.txt(svg, cx - 6, cy - 142, "Im", { size: 10, fill: C.dim, anchor: "end" });
    }
    panel(LX, LY, "z 平面");
    panel(RX, RY, "w = f(z) 平面");

    var gi;
    for (gi = -2; gi <= 2.0001; gi += 0.5) {
      if (Math.abs(gi) < 1e-6) continue;
      VZ.ln(svg, LX - 150, LY - gi * S, LX + 150, LY - gi * S, { stroke: C.faint, "stroke-width": .7, opacity: .45 });
      VZ.ln(svg, LX + gi * S, LY - 140, LX + gi * S, LY + 140, { stroke: C.faint, "stroke-width": .7, opacity: .45 });
    }

    var rightPaths = [];
    for (gi = 0; gi < 14; gi++) rightPaths.push(VZ.path(svg, "", { stroke: C.faint, "stroke-width": .8, opacity: .5 }));

    function sqPts(zc, px, py) {
      var h = HS / 2, out = [], cs = [[-h, -h], [h, -h], [h, h], [-h, h]];
      for (var i = 0; i < 4; i++) out.push([px + (zc.re + cs[i][0]) * S, py - (zc.im + cs[i][1]) * S]);
      return out;
    }
    function dOf(pts) {
      return "M" + pts.map(function (p) { return p[0].toFixed(1) + " " + p[1].toFixed(1); }).join("L") + "Z";
    }
    var sqL = VZ.path(svg, "", { fill: "rgba(79,227,240,.16)", stroke: C.cyan, "stroke-width": 1.8 });
    var dotL = VZ.circ(svg, LX, LY, 5.5, { fill: C.gold, stroke: C.deep, "stroke-width": 1.5 });
    var sqR = VZ.path(svg, "", { fill: "rgba(255,207,92,.18)", stroke: C.gold, "stroke-width": 1.8 });
    var dotR = VZ.circ(svg, RX, RY, 4.5, { fill: C.ink, stroke: "none", opacity: .9 });

    var hit = VZ.el("rect", { x: LX - 160, y: LY - 152, width: 320, height: 306,
      fill: "rgba(0,0,0,0.001)", stroke: "none" }, svg);
    VZ.drag(svg, hit, W, H, function (x, y) {
      z0 = clampZ({ re: (x - LX) / S, im: (LY - y) / S });
      redraw();
      syncR();
    });

    var ctl = VZ.box(stage, "viz-ctl");
    var pan = VZ.panel(stage, { "拖点 z": "", "|f′|（缩放）": "", "arg f′（旋转）": "", "面积倍数": "" });
    var say = VZ.note(stage, "");

    function redraw() {
      sqL.setAttribute("d", dOf(sqPts(z0, LX, LY)));
      dotL.setAttribute("cx", (LX + z0.re * S).toFixed(1));
      dotL.setAttribute("cy", (LY - z0.im * S).toFixed(1));

      var k = 0, v, t, z, w, p, d, pen;
      for (v = -2; v <= 2.0001; v += 0.5) {
        for (var mode = 0; mode < 2; mode++) {
          d = ""; pen = false;
          for (t = -2.0; t <= 2.001; t += 0.05) {
            z = mode === 0 ? { re: v, im: t } : { re: t, im: v };
            if (Math.abs(z.re) + Math.abs(z.im) < 0.14) { pen = false; continue; }
            w = f(z);
            if (!isFinite(w.re) || !isFinite(w.im)) { pen = false; continue; }
            if (Math.sqrt(w.re * w.re + w.im * w.im) > 2.14) { pen = false; continue; }
            p = [RX + w.re * S, RY - w.im * S];
            d += (pen ? "L" : "M") + p[0].toFixed(1) + " " + p[1].toFixed(1);
            pen = true;
          }
          if (rightPaths[k]) rightPaths[k].setAttribute("d", d);
          k++;
        }
      }

      var h = HS / 2, cs = [[-h, -h], [h, -h], [h, h], [-h, h]], pts = [], i;
      for (i = 0; i < 4; i++) {
        var m = f({ re: z0.re + cs[i][0], im: z0.im + cs[i][1] });
        pts.push([RX + m.re * S, RY - m.im * S]);
      }
      sqR.setAttribute("d", dOf(pts));
      var fc = f(z0);
      dotR.setAttribute("cx", (RX + fc.re * S).toFixed(1));
      dotR.setAttribute("cy", (RY - fc.im * S).toFixed(1));

      var dd = df(z0), mod = Math.sqrt(dd.re * dd.re + dd.im * dd.im);
      var arg = Math.atan2(dd.im, dd.re) * 180 / Math.PI;
      VZ.setPanel(pan, {
        "拖点 z": z0.re.toFixed(2) + (z0.im >= 0 ? " + " : " − ") + Math.abs(z0.im).toFixed(2) + "i",
        "|f′|（缩放）": mod.toFixed(2),
        "arg f′（旋转）": arg.toFixed(0) + "°",
        "面积倍数": "×" + (mod * mod).toFixed(2)
      });
      say.innerHTML = mod < 0.15
        ? "<b style='color:#ff7a7a'>临界点附近：|f′| → 0</b>，方块被压得几乎看不见，原像里的转角也不再守规矩 —— 保角性正是在这里失效。"
        : "右边小方块<b>边长比仍是 1 : 1</b>、内角仍是 90°：转了、也缩放了，<b>形状却没变</b>。无穷小的图形只被「相似变换」搬动，这就是共形。";
    }

    function syncR() {
      var r = Math.sqrt(z0.re * z0.re + z0.im * z0.im) / 1.24 * 100;
      if (sld) sld.set(Math.round(r));
    }

    VZ.chips(ctl, ["w = z²", "w = 1/z"], "w = z²", function (it) {
      fname = it === "w = z²" ? "z2" : "inv";
      z0 = clampZ(z0); redraw(); syncR();
    });
    var sld = VZ.slider(ctl, {
      label: "距原点半径 r（方位角不变）", min: 0, max: 100, step: 1, value: 80,
      format: function (v) { return (v / 100 * 1.24).toFixed(2); },
      onInput: function (v) {
        var r = v / 100 * 1.24;
        var a = Math.atan2(z0.im, z0.re);
        z0 = clampZ({ re: r * Math.cos(a), im: r * Math.sin(a) });
        redraw();
      }
    });

    redraw();
    syncR();
  }
}
,
/* ==========================================================
   08j · 环面的模 τ：换个平行四边形，就换一个环面
   ========================================================== */
"f-ch08j": {
  title: "环面的模 τ：平行四边形怎么粘成环面，τ 就怎么定住形状",
  hint: "拖两个滑块改 <b>τ = a + bi</b>：把平行四边形两组对边分别粘起来（<b>金边对金边、品红对品红</b>）就得到环面。<span class='hl'>τ 是复数，改它就是在改环面的形状</span>；而 τ、τ+1、−1/τ 描述的是同一个环面，所以真正独立的「形状参数」只剩一小块区域。",
  draw: function (stage) {
    var W = 760, H = 404, svg = VZ.S(stage, W, H, { grid: true });
    var C = VZ.C;
    var ox = 132, oy = 322, U = 140;
    var a = 0.3, b = 1.0;

    function px(re, im) { return [ox + re * U, oy - im * U]; }

    /* ---------- 左：平行四边形 ---------- */
    VZ.card(svg, 26, 60, 342, 296, { stroke: C.faint, rx: 12 });
    VZ.txt(svg, 44, 84, "基本区域：复平面上的平行四边形", { size: 11.5, fill: C.dim });

    VZ.ln(svg, 48, oy, 356, oy, { stroke: C.ink2, "stroke-width": 1, opacity: .4 });
    VZ.ln(svg, ox, oy + 20, ox, 116, { stroke: C.ink2, "stroke-width": 1, opacity: .4 });
    VZ.txt(svg, 354, oy + 16, "Re", { size: 10, fill: C.dim, anchor: "end" });
    VZ.txt(svg, ox - 6, 120, "Im", { size: 10, fill: C.dim, anchor: "end" });

    var face = VZ.path(svg, "", { fill: "rgba(155,140,255,.13)", stroke: C.violet, "stroke-width": 1.4 });
    var eA1 = VZ.path(svg, "", { stroke: C.gold, "stroke-width": 2.8, "stroke-linecap": "round" });
    var eA2 = VZ.path(svg, "", { stroke: C.gold, "stroke-width": 2.8, "stroke-linecap": "round", "stroke-dasharray": "8 5" });
    var eB1 = VZ.path(svg, "", { stroke: C.mag, "stroke-width": 2.4, "stroke-linecap": "round" });
    var eB2 = VZ.path(svg, "", { stroke: C.mag, "stroke-width": 2.4, "stroke-linecap": "round", "stroke-dasharray": "8 5" });
    var arr1 = VZ.path(svg, "", { fill: C.gold, stroke: "none" });
    var arr2 = VZ.path(svg, "", { fill: C.gold, stroke: "none", opacity: .75 });
    var arr3 = VZ.path(svg, "", { fill: C.mag, stroke: "none" });
    var arr4 = VZ.path(svg, "", { fill: C.mag, stroke: "none", opacity: .75 });

    var lb0 = VZ.txt(svg, 0, 0, "0", { size: 11.5, fill: C.dim, anchor: "middle" });
    var lb1 = VZ.txt(svg, 0, 0, "1", { size: 11.5, fill: C.dim, anchor: "middle" });
    var lbT = VZ.txt(svg, 0, 0, "τ", { size: 13, fill: C.violet, anchor: "middle", weight: 700 });
    var lbT1 = VZ.txt(svg, 0, 0, "1+τ", { size: 13, fill: C.violet, anchor: "middle", weight: 700 });

    VZ.txt(svg, 26, 378, "金边（实线）对粘成 a 圈，品红边（虚线）对粘成 b 圈", { size: 10.5, fill: C.dim });

    /* ---------- 右：环面 ---------- */
    var tx = 572, ty = 196;
    VZ.txt(svg, tx, 84, "粘好的环面（拓扑上就是甜甜圈）", { size: 11.5, fill: C.dim, anchor: "middle" });
    VZ.el("ellipse", { cx: tx, cy: ty, rx: 112, ry: 52, fill: "rgba(155,140,255,.16)", stroke: C.ink2, "stroke-width": 1.3 }, svg);
    VZ.el("ellipse", { cx: tx, cy: ty, rx: 45, ry: 17, fill: C.deep, stroke: C.ink2, "stroke-width": 1.3 }, svg);
    VZ.el("ellipse", { cx: tx, cy: ty, rx: 112, ry: 52, fill: "none", stroke: C.gold, "stroke-width": 1.8, "stroke-dasharray": "7 5" }, svg);
    VZ.el("ellipse", { cx: tx, cy: ty - 34, rx: 13, ry: 10, fill: C.deep, stroke: C.mag, "stroke-width": 2 }, svg);
    VZ.txt(svg, tx, 128, "b 圈：绕管一周", { size: 10.5, fill: C.mag, anchor: "middle" });
    VZ.txt(svg, tx, 272, "a 圈：绕洞一周", { size: 10.5, fill: C.gold, anchor: "middle" });

    var ctl = VZ.box(stage, "viz-ctl");
    var pan = VZ.panel(stage, { "τ": "", "基本区域面积": "", "网格形状": "", "亏格（洞数）": "" });
    var say = VZ.note(stage, "");

    function tri(p1, p2) {
      var mx = (p1[0] + p2[0]) / 2, my = (p1[1] + p2[1]) / 2;
      var dx = p2[0] - p1[0], dy = p2[1] - p1[1], L = Math.hypot(dx, dy) || 1;
      dx /= L; dy /= L;
      var nx = -dy, ny = dx;
      return "M" + (mx + dx * 7).toFixed(1) + " " + (my + dy * 7).toFixed(1)
        + "L" + (mx - dx * 5 + nx * 5).toFixed(1) + " " + (my - dy * 5 + ny * 5).toFixed(1)
        + "L" + (mx - dx * 5 - nx * 5).toFixed(1) + " " + (my - dy * 5 - ny * 5).toFixed(1) + "Z";
    }
    function seg(p1, p2) { return "M" + p1[0].toFixed(1) + " " + p1[1].toFixed(1) + "L" + p2[0].toFixed(1) + " " + p2[1].toFixed(1); }

    function redraw() {
      var O = px(0, 0), A = px(1, 0), B = px(1 + a, b), Cv = px(a, b);
      face.setAttribute("d", "M" + O[0].toFixed(1) + " " + O[1].toFixed(1)
        + "L" + A[0].toFixed(1) + " " + A[1].toFixed(1)
        + "L" + B[0].toFixed(1) + " " + B[1].toFixed(1)
        + "L" + Cv[0].toFixed(1) + " " + Cv[1].toFixed(1) + "Z");
      eA1.setAttribute("d", seg(O, A));
      eA2.setAttribute("d", seg(Cv, B));
      eB1.setAttribute("d", seg(O, Cv));
      eB2.setAttribute("d", seg(A, B));
      arr1.setAttribute("d", tri(O, A));
      arr2.setAttribute("d", tri(Cv, B));
      arr3.setAttribute("d", tri(O, Cv));
      arr4.setAttribute("d", tri(A, B));

      lb0.setAttribute("x", (O[0] - 14).toFixed(1)); lb0.setAttribute("y", (O[1] + 17).toFixed(1));
      lb1.setAttribute("x", (A[0] + 14).toFixed(1)); lb1.setAttribute("y", (A[1] + 17).toFixed(1));
      lbT.setAttribute("x", Math.max(58, Cv[0] - 18).toFixed(1)); lbT.setAttribute("y", (Cv[1] - 9).toFixed(1));
      lbT1.setAttribute("x", (B[0] + 19).toFixed(1)); lbT1.setAttribute("y", (B[1] - 9).toFixed(1));

      var rect = Math.abs(a) < 0.03;
      VZ.setPanel(pan, {
        "τ": a.toFixed(2) + (b >= 0 ? " + " : " − ") + Math.abs(b).toFixed(2) + "i",
        "基本区域面积": b.toFixed(2),
        "网格形状": rect ? "矩形（两方向垂直）" : "斜的（a ≠ 0）",
        "亏格（洞数）": "1（永远不变）"
      });
      say.innerHTML = rect
        ? "a = 0 时两个方向垂直，环面最「正」；τ = i 时基本区域是正方形，那是所有环面里最对称的一个。"
        : "改 a 只是把平行四边形<b>推斜</b>：洞数还是 1，但环面的「形状」变了 —— 这就是<b>模参数</b>与拓扑的分工。";
    }

    var sRe = VZ.slider(ctl, {
      label: "Re τ", min: -0.4, max: 0.4, step: 0.05, value: a,
      format: function (v) { return v.toFixed(2); },
      onInput: function (v) { a = v; redraw(); }
    });
    var sIm = VZ.slider(ctl, {
      label: "Im τ（必须 > 0）", min: 0.35, max: 1.25, step: 0.05, value: b,
      format: function (v) { return v.toFixed(2); },
      onInput: function (v) { b = v; redraw(); }
    });
    VZ.btn(ctl, "τ = i（正方形）", function () { a = 0; b = 1; sRe.set(0); sIm.set(1); redraw(); });
    VZ.btn(ctl, "τ = 0.4 + 0.9i（斜的）", function () { a = 0.4; b = 0.9; sRe.set(0.4); sIm.set(0.9); redraw(); });
    redraw();
  }
}
,
/* ==========================================================
   07h · 柯西公式：边界上的一圈值，决定内部一点的值
   ========================================================== */
"f-ch07h": {
  title: "柯西公式：圆周上那一圈值的加权平均，正好等于内部一点的值",
  hint: "拖<b>金点 p</b> 在圈内走：右边那团点（圆周上每个采样点的贡献）永远以 <b>f(p)</b> 为中心。<span class='hl'>内部一点的值不是独立的，而是边界值的加权平均</span>；把 p 拖到圈外，平均值立刻塌成 0 —— 这就是柯西定理的另一面。",
  draw: function (stage) {
    var W = 760, H = 336, svg = VZ.S(stage, W, H, { grid: true });
    var C = VZ.C;
    var LX = 188, LY = 176, A = 1.2, R = A * 92;     /* 围道：半径 1.2 的圆 */
    var RX = 566, RY = 176, S = 92;                   /* 右图：w 平面，1 单位 = 92px */
    var N = 20;
    var p = { re: 0.42, im: -0.34 };

    function f(z) {                                   /* f(z) = 1/(2 − z)，在 |z| ≤ 1.2 内全纯 */
      var dr = 2 - z.re, di = -z.im, dd = dr * dr + di * di;
      return { re: dr / dd, im: -di / dd };
    }

    /* ---------- 左：围道与采样 ---------- */
    VZ.txt(svg, LX, 54, "围道 C：|z| = 1.2", { size: 11.5, fill: C.dim, anchor: "middle" });
    VZ.circ(svg, LX, LY, R, { fill: "rgba(79,227,240,.05)", stroke: C.cyan, "stroke-width": 1.8 });
    VZ.ln(svg, LX - R - 24, LY, LX + R + 24, LY, { stroke: C.faint, "stroke-width": .8 });
    VZ.ln(svg, LX, LY - R - 24, LX, LY + R + 24, { stroke: C.faint, "stroke-width": .8 });

    var dots = [], spokes = [];
    for (var i = 0; i < 64; i++) {
      spokes.push(VZ.ln(svg, LX, LY, LX, LY, { stroke: C.faint, "stroke-width": .6, opacity: .5 }));
      dots.push(VZ.circ(svg, LX, LY, 2.6, { fill: C.cyan, opacity: .85 }));
    }
    var pDot = VZ.circ(svg, LX, LY, 7, { fill: C.gold, stroke: C.deep, "stroke-width": 2 });
    var pLbl = VZ.txt(svg, 0, 0, "p", { size: 12.5, fill: C.gold, weight: 700 });

    /* ---------- 右：w 平面上的贡献团 ---------- */
    VZ.txt(svg, RX, 54, "逐项累加的平均值：越加越往 f(p) 收敛", { size: 11.5, fill: C.dim, anchor: "middle" });
    VZ.ln(svg, RX - 150, RY, RX + 150, RY, { stroke: C.faint, "stroke-width": .8 });
    VZ.ln(svg, RX, RY - 130, RX, RY + 130, { stroke: C.faint, "stroke-width": .8 });
    var trail = VZ.path(svg, "", { fill: "none", stroke: C.violet, "stroke-width": 1.2, opacity: .55 });
    var dotsR = [];
    for (var j = 0; j < 64; j++) dotsR.push(VZ.circ(svg, RX, RY, 2.2, { fill: C.violet, opacity: .8 }));
    var sumArrow = VZ.path(svg, "", { stroke: C.gold, "stroke-width": 2.6, "stroke-linecap": "round" });
    var sumDot = VZ.circ(svg, RX, RY, 6, { fill: C.gold });
    var exact = VZ.circ(svg, RX, RY, 9, { fill: "none", stroke: C.mag, "stroke-width": 2, "stroke-dasharray": "4 3" });
    var exactT = VZ.txt(svg, 0, 0, "f(p)", { size: 11, fill: C.mag });

    var ctl = VZ.box(stage, "viz-ctl");
    var pan = VZ.panel(stage, { "f(p) 精确值": "", "离散平均（N 个采样）": "", "误差": "", "p 的位置": "" });
    var say = VZ.note(stage, "");

    function toPx(z) { return [RX + z.re * S, RY - z.im * S]; }

    function redraw() {
      var zp = { re: p.re, im: p.im };
      var sum = { re: 0, im: 0 }, shown = 0, dTrail = "", pen = false;
      for (var i = 0; i < 64; i++) {
        var on = i < N;
        var th = i / N * Math.PI * 2;
        var zk = { re: A * Math.cos(th), im: A * Math.sin(th) };
        if (!on) {
          spokes[i].setAttribute("opacity", 0); dots[i].setAttribute("opacity", 0);
          dotsR[i].setAttribute("opacity", 0);
          continue;
        }
        var px = LX + zk.re * 92, py = LY - zk.im * 92;
        dots[i].setAttribute("cx", px); dots[i].setAttribute("cy", py);
        dots[i].setAttribute("opacity", .9);
        spokes[i].setAttribute("x1", px); spokes[i].setAttribute("y1", py);
        spokes[i].setAttribute("x2", LX + p.re * 92); spokes[i].setAttribute("y2", LY - p.im * 92);
        spokes[i].setAttribute("opacity", .45);

        /* 贡献项：(1/N)·f(z)·z/(z−p) */
        var fz = f(zk);
        var dr = zk.re - p.re, di = zk.im - p.im, dd = dr * dr + di * di;
        if (dd < 1e-6) dd = 1e-6;
        /* z/(z−p) = z·conj(z−p)/|z−p|² */
        var qr = (zk.re * dr + zk.im * di) / dd, qi = (zk.im * dr - zk.re * di) / dd;
        var tr = fz.re * qr - fz.im * qi, ti = fz.re * qi + fz.im * qr;   /* 这一项的「整份」贡献 */
        sum.re += tr; sum.im += ti; shown++;
        var avg = { re: sum.re / shown, im: sum.im / shown };              /* 逐项平均，正是柯西和 */
        var pt = toPx(avg);
        pt[0] = Math.max(RX - 148, Math.min(RX + 148, pt[0]));
        pt[1] = Math.max(RY - 128, Math.min(RY + 128, pt[1]));
        dotsR[i].setAttribute("cx", pt[0].toFixed(1));
        dotsR[i].setAttribute("cy", pt[1].toFixed(1));
        dotsR[i].setAttribute("opacity", .28 + .55 * (i / N));
        dTrail += (pen ? "L" : "M") + pt[0].toFixed(1) + " " + pt[1].toFixed(1);
        pen = true;
      }
      pDot.setAttribute("cx", LX + p.re * 92);
      pDot.setAttribute("cy", LY - p.im * 92);
      pLbl.setAttribute("x", LX + p.re * 92 + 12);
      pLbl.setAttribute("y", LY - p.im * 92 - 10);

      trail.setAttribute("d", dTrail);
      var sp = toPx({ re: sum.re / Math.max(1, shown), im: sum.im / Math.max(1, shown) });
      sumDot.setAttribute("cx", sp[0]); sumDot.setAttribute("cy", sp[1]);
      sumArrow.setAttribute("d", "M" + RX + " " + RY + "L" + sp[0].toFixed(1) + " " + sp[1].toFixed(1));

      var exactV = f(zp);
      var ep = toPx(exactV);
      exact.setAttribute("cx", ep[0]); exact.setAttribute("cy", ep[1]);
      exactT.setAttribute("x", ep[0] + 13); exactT.setAttribute("y", ep[1] - 8);

      var avgF = { re: sum.re / Math.max(1, shown), im: sum.im / Math.max(1, shown) };
      var err = Math.hypot(avgF.re - exactV.re, avgF.im - exactV.im);
      var inside = Math.hypot(p.re, p.im) < A;
      VZ.setPanel(pan, {
        "f(p) 精确值": exactV.re.toFixed(3) + (exactV.im >= 0 ? " + " : " − ") + Math.abs(exactV.im).toFixed(3) + "i",
        "离散平均（N 个采样）": avgF.re.toFixed(3) + (avgF.im >= 0 ? " + " : " − ") + Math.abs(avgF.im).toFixed(3) + "i",
        "误差": err.toFixed(3) + (err < 0.06 ? "  ✓ 收敛" : ""),
        "p 的位置": inside ? "圈内：公式成立" : "圈外：平均塌成 0"
      });
      say.innerHTML = inside
        ? "p 在圈内：把圆周上的 <b>f(z)</b> 按权重 <b>1/(z−p)</b> 平均，结果正好是被围住那点的函数值。紫色轨迹就是平均值逐步收敛的过程，末端的金点压在洋红圈 f(p) 上。"
        : "p 已经跑到<b>圈外</b>：同样的加权平均现在给出 <b>0</b> —— 这就是柯西定理：奇点不在圈里，积分就什么也捞不到。";
    }

    var hit = VZ.el("rect", { x: LX - R - 30, y: LY - R - 30, width: 2 * R + 60, height: 2 * R + 60,
      fill: "rgba(0,0,0,0.001)", stroke: "none" }, svg);
    var off = [0, 0];
    VZ.drag(svg, hit, W, H, function (x, y, phase) {
      if (phase === "start") off = [p.re - (x - LX) / 92, p.im - (LY - y) / 92];
      p.re = (x - LX) / 92 + off[0];
      p.im = (LY - y) / 92 + off[1];
      var r = Math.hypot(p.re, p.im);
      if (r > 1.55) { p.re *= 1.55 / r; p.im *= 1.55 / r; }
      redraw();
    });

    var sld = VZ.slider(ctl, {
      label: "圆周上的采样点数 N", min: 4, max: 64, step: 2, value: N,
      format: function (v) { return v.toFixed(0) + " 点"; },
      onInput: function (v) { N = v; redraw(); }
    });
    VZ.btn(ctl, "p 放回圆心", function () { p.re = 0; p.im = 0; redraw(); });
    VZ.btn(ctl, "把 p 拖到圈外", function () { p.re = 1.45; p.im = 0.2; redraw(); });
    redraw();
  }
}
,
/* ==========================================================
   07i · 圆盘链：一块块重叠着把函数往前接
   ========================================================== */
"f-ch07i": {
  title: "圆盘链：沿路径一块块接着铺，每一块的系数都被重叠区锁死",
  hint: "点<b>下一步</b>看圆盘怎么接力：新圆盘的半径＝到最近奇点的距离，它<b>永远吞不掉奇点</b>，所以总与上一块重叠。<span class='hl'>重叠区里两套幂级数必须给出同一个值</span>——恒等定理保证接法唯一。换<b>上半弧 / 下半弧</b>比一比：log z 差 2πi，而 1/(1+z²) 一模一样。",
  draw: function (stage) {
    var W = 760, H = 398, svg = VZ.S(stage, W, H, { grid: true });
    var C = VZ.C;
    var LX = 193, LY = 214, S = 66;          /* 左：z 平面 */
    var RX = 567, RY = 214;                  /* 右：值平面 */
    var RAD = 1.4;                           /* 路径落在半径 1.4 的圆上 */
    var func = "log", pname = "上半弧";
    var k = 0, playing = false, accT = null;
    var disks = [], vals = [], path = [], ths = [];

    function arcPts(a0, a1, n) {
      var o = [];
      for (var i = 0; i <= n; i++) {
        var a = a0 + (a1 - a0) * i / n;
        o.push([RAD * Math.cos(a), RAD * Math.sin(a)]);
      }
      return o;
    }
    var PATHS = {
      "上半弧": { pts: arcPts(0, Math.PI, 72), desc: "θ 走 +π，终点 z = −1.4" },
      "下半弧": { pts: arcPts(0, -Math.PI, 72), desc: "θ 走 −π，终点还是 z = −1.4" },
      "绕一圈": { pts: arcPts(0, 2 * Math.PI, 108), desc: "绕满 2π，回到 z = 1.4" },
      "绕两圈": { pts: arcPts(0, 4 * Math.PI, 180), desc: "绕 4π，又回到 z = 1.4" }
    };
    var FNS = { "log z": "log", "√z": "sqrt", "∛z": "cbrt", "1/(1+z²)": "rat" };

    function sings() { return func === "rat" ? [[0, 1], [0, -1]] : [[0, 0]]; }
    function distSing(p) {
      var best = 1e9, S0 = sings();
      for (var i = 0; i < S0.length; i++) best = Math.min(best, Math.hypot(p.x - S0[i][0], p.y - S0[i][1]));
      return best;
    }
    function valueAt(x, y, th) {
      var r = Math.max(1e-6, Math.hypot(x, y));
      if (func === "log") return { re: Math.log(r), im: th };
      if (func === "sqrt") return { re: Math.sqrt(r) * Math.cos(th / 2), im: Math.sqrt(r) * Math.sin(th / 2) };
      if (func === "cbrt") return { re: Math.pow(r, 1 / 3) * Math.cos(th / 3), im: Math.pow(r, 1 / 3) * Math.sin(th / 3) };
      var a = 1 + x * x - y * y, b = 2 * x * y, m = a * a + b * b;
      return { re: a / m, im: -b / m };
    }

    function build() {
      path = PATHS[pname].pts.map(function (p) { return { x: p[0], y: p[1] }; });
      ths = [];
      var th = Math.atan2(path[0].y, path[0].x), prev = th;
      ths.push(th);
      for (var i = 1; i < path.length; i++) {
        var a = Math.atan2(path[i].y, path[i].x), d = a - prev;
        while (d > Math.PI) d -= 2 * Math.PI;
        while (d < -Math.PI) d += 2 * Math.PI;
        th += d; prev = a; ths.push(th);
      }
      disks = [];
      var i = 0, guard = 0;
      while (guard++ < 200) {
        var p = path[i], d0 = distSing(p);
        if (d0 < 0.05) break;
        var R = Math.min(d0 * 0.92, 1.15);
        disks.push({ x: p.x, y: p.y, R: R, i: i });
        if (disks.length >= 22 || i >= path.length - 1) break;
        var acc = 0;
        while (i < path.length - 1 && acc < 0.72 * R) {
          acc += Math.hypot(path[i + 1].x - path[i].x, path[i + 1].y - path[i].y);
          i++;
        }
      }
      vals = disks.map(function (D) { return valueAt(D.x, D.y, ths[D.i]); });
      if (k > disks.length - 1) k = Math.max(0, disks.length - 1);
    }

    /* ---------- 左：z 平面 ---------- */
    var gL = VZ.g(svg), gR = VZ.g(svg);
    VZ.card(svg, 16, 50, 356, 320, { stroke: C.faint });
    VZ.card(svg, 388, 50, 358, 320, { stroke: C.faint });
    VZ.txt(svg, 28, 74, "z 平面：圆盘沿着路径一块块铺过去", { size: 11.5, fill: C.dim });
    VZ.txt(svg, 400, 74, "值平面：这串圆盘把 f 带到哪里", { size: 11.5, fill: C.dim });
    VZ.txt(svg, 28, 366, "✕ = 奇点　□ = 起点 z₀　绿点 = 重叠区", { size: 10, fill: C.dim });

    function P2(x, y) { return [LX + x * S, LY - y * S]; }

    function drawL() {
      gL.innerHTML = "";
      var g;
      for (g = -2; g <= 2; g++) {
        if (g === 0) continue;
        VZ.ln(gL, LX - 175, LY - g * S, LX + 175, LY - g * S, { stroke: C.faint, "stroke-width": .6, opacity: .35 });
        VZ.ln(gL, LX + g * S, LY - 150, LX + g * S, LY + 150, { stroke: C.faint, "stroke-width": .6, opacity: .35 });
      }
      VZ.ln(gL, LX - 175, LY, LX + 175, LY, { stroke: C.ink2, "stroke-width": 1, opacity: .4 });
      VZ.ln(gL, LX, LY - 150, LX, LY + 150, { stroke: C.ink2, "stroke-width": 1, opacity: .4 });

      /* 路径 */
      var d = "";
      path.forEach(function (p, i) {
        var q = P2(p.x, p.y);
        d += (i ? "L" : "M") + q[0].toFixed(1) + " " + q[1].toFixed(1);
      });
      VZ.path(gL, d, { fill: "none", stroke: C.cyan, "stroke-width": 2, opacity: .55 });

      /* 奇点 */
      sings().forEach(function (s) {
        var q = P2(s[0], s[1]);
        VZ.path(gL, "M" + (q[0] - 6) + " " + (q[1] - 6) + "L" + (q[0] + 6) + " " + (q[1] + 6)
          + "M" + (q[0] + 6) + " " + (q[1] - 6) + "L" + (q[0] - 6) + " " + (q[1] + 6),
          { stroke: C.mag, "stroke-width": 2.4, "stroke-linecap": "round" });
      });

      /* 圆盘：未来极淡，已过淡青，当前紫 */
      disks.forEach(function (D, i) {
        var q = P2(D.x, D.y), r = D.R * S;
        if (i > k) return;
        var isCur = i === k;
        VZ.circ(gL, q[0], q[1], r, {
          fill: isCur ? "rgba(155,140,255,.14)" : "rgba(79,227,240,.06)",
          stroke: isCur ? C.violet : C.cyan,
          "stroke-width": isCur ? 2.4 : .8,
          opacity: isCur ? 1 : .32
        });
        if (!isCur) VZ.circ(gL, q[0], q[1], 2.6, { fill: C.cyan, opacity: .6 });
      });

      /* 重叠区：当前圆盘与上一块的交叠中点 */
      if (k > 0) {
        var A = disks[k - 1], B = disks[k];
        var mx = (A.x + B.x) / 2, my = (A.y + B.y) / 2, q2 = P2(mx, my);
        var dd = Math.hypot(A.x - B.x, A.y - B.y);
        VZ.circ(gL, q2[0], q2[1], 4.5, { fill: C.green, stroke: C.deep, "stroke-width": 1.5 });
        VZ.txt(gL, q2[0] - 9, q2[1] - 7, "重叠 ✓", { size: 9.5, fill: C.green, anchor: "end" });
      }

      /* 起点 */
      var q0 = P2(path[0].x, path[0].y);
      VZ.el("rect", { x: q0[0] - 5, y: q0[1] - 5, width: 10, height: 10, fill: C.gold, stroke: C.deep, "stroke-width": 1.5 }, gL);
      VZ.txt(gL, q0[0] + 10, q0[1] + 15, "z₀", { size: 10, fill: C.gold });
    }

    /* ---------- 右：值平面 ---------- */
    function drawR() {
      gR.innerHTML = "";
      if (!vals.length) return;
      var xs = vals.map(function (v) { return v.re; }), ys = vals.map(function (v) { return v.im; });
      var x0 = Math.min.apply(null, xs), x1 = Math.max.apply(null, xs);
      var y0 = Math.min.apply(null, ys), y1 = Math.max.apply(null, ys);
      var px = Math.max(0.25, (x1 - x0) * 0.28), py = Math.max(0.25, (y1 - y0) * 0.28);
      x0 -= px; x1 += px; y0 -= py; y1 += py;
      var s = Math.min(320 / (x1 - x0), 260 / (y1 - y0));
      var cx = (x0 + x1) / 2, cy = (y0 + y1) / 2;
      function M(v) { return [RX + (v.re - cx) * s, RY - (v.im - cy) * s]; }

      VZ.ln(gR, 400, RY, 734, RY, { stroke: C.faint, "stroke-width": .8 });
      VZ.ln(gR, RX, 62, RX, 360, { stroke: C.faint, "stroke-width": .8 });
      VZ.txt(gR, 730, RY - 8, "Re f", { size: 9.5, fill: C.dim, anchor: "end" });
      VZ.txt(gR, RX + 7, 350, "Im f", { size: 9.5, fill: C.dim });

      var d = "";
      vals.forEach(function (v, i) {
        if (i > k) return;
        var q = M(v);
        d += (i ? "L" : "M") + q[0].toFixed(1) + " " + q[1].toFixed(1);
      });
      if (d) VZ.path(gR, d, { fill: "none", stroke: C.violet, "stroke-width": 1.6, "stroke-dasharray": "5 4", opacity: .8 });

      vals.forEach(function (v, i) {
        if (i > k) return;
        var q = M(v);
        VZ.circ(gR, q[0], q[1], i === k ? 6 : 3, {
          fill: i === k ? C.violet : C.ink2,
          stroke: i === k ? C.deep : "none", "stroke-width": 1.5
        });
      });
      var qs = M(vals[0]);
      VZ.circ(gR, qs[0], qs[1], 8, { fill: "none", stroke: C.gold, "stroke-width": 2 });
      VZ.txt(gR, qs[0] + 11, qs[1] - 8, "起点值 f(z₀)", { size: 9.5, fill: C.gold });
      if (k > 0) {
        var qk = M(vals[k]);
        VZ.txt(gR, qk[0] + 10, qk[1] + 15, "f = " + fmt(vals[k]), { size: 10, fill: C.violet });
      }
    }

    function fmt(v) {
      return v.re.toFixed(2) + (v.im >= 0 ? " + " : " − ") + Math.abs(v.im).toFixed(2) + "i";
    }

    /* ---------- 面板 ---------- */
    var ctl = VZ.box(stage, "viz-ctl");
    var pan = VZ.panel(stage, { "圆盘": "", "圆心 c": "", "半径 R": "", "f(c)": "", "累计 Δθ": "", "绕数": "" });
    var say = VZ.note(stage, "");

    function update() {
      drawL(); drawR();
      var N = disks.length;
      if (!N) {
        VZ.setPanel(pan, { "圆盘": "0 / 0", "圆心 c": "—", "半径 R": "—", "f(c)": "—", "累计 Δθ": "—", "绕数": "—" });
        return;
      }
      var D = disks[k], V = vals[k];
      var thNow = ths[D.i], th0 = ths[0], dtheta = thNow - th0;
      var wind = dtheta / (2 * Math.PI);
      VZ.setPanel(pan, {
        "圆盘": (k + 1) + " / " + N,
        "圆心 c": D.x.toFixed(2) + (D.y >= 0 ? " + " : " − ") + Math.abs(D.y).toFixed(2) + "i",
        "半径 R": D.R.toFixed(2) + "（到最近奇点 ×0.92）",
        "f(c)": fmt(V),
        "累计 Δθ": dtheta.toFixed(2) + "（" + (dtheta / Math.PI).toFixed(2) + "π）",
        "绕数": Math.abs(wind) < 1e-6 ? "0" : wind.toFixed(2)
      });
      var last = (k === N - 1);
      var msg;
      if (k === 0) {
        msg = "起始函数元素：在 z₀ = 1.4 附近给定 <b>" + nameOf(func) + "</b> 的一个分支（一个幂级数 + 它的收敛圆）。这是<b>你先给的</b>，不是路径给的。";
      } else if (!last) {
        msg = "第 " + k + " 步：新圆盘半径 = 到最近奇点的 0.92 倍，所以它<b>永远吞不掉奇点</b>，必然与上一块重叠。重叠区里两套级数取值相同 ⇒ 恒等定理 ⇒ 新系数<b>被唯一锁死</b>。";
      } else {
        var v0 = vals[0], vk = vals[N - 1];
        var dRe = vk.re - v0.re, dIm = vk.im - v0.im;
        var same = Math.hypot(dRe, dIm) < 1e-6;
        if (func === "rat") {
          msg = "走完全程：路径绕了 <b>" + wind.toFixed(2) + " 圈</b>，但 1/(1+z²) 是<b>单值函数</b> —— "
            + (same ? "终点值与起点<b>分毫不差</b>，绕多少圈都一样。" : "终点值与起点一致（差值在舍入误差内）。")
            + "「路径绕数」和「函数多值」是两回事：单值函数根本不理会你绕了几圈。";
        } else if (same) {
          msg = "走完全程：绕了 " + wind.toFixed(2) + " 圈，正好是支点阶数的整数倍，<b>回到原来那一叶</b>，值与起点相同。";
        } else {
          var kind = func === "log" ? "多出 <b>2πi × " + wind.toFixed(2) + "</b>（换了一叶）"
            : func === "sqrt" ? "差 <b>一个符号</b>（换到另一张叶）"
            : "差 <b>一个三次单位根</b>（换到另一张叶）";
          msg = "走完全程：绕了 <b>" + wind.toFixed(2) + " 圈</b>，终点值 " + fmt(vk) + " 比起点 " + kind
            + "。注意：<b>每一步的接法仍然是唯一的</b>，变的是「路怎么绕」——这正是解析延拓「定下路径后无选择」的含义。";
        }
      }
      say.innerHTML = msg;
    }
    function nameOf(f) {
      return f === "log" ? "log z" : f === "sqrt" ? "√z" : f === "cbrt" ? "∛z" : "1/(1+z²)";
    }

    /* ---------- 控件 ---------- */
    var bPrev = VZ.btn(ctl, "◀ 上一步", function () { if (k > 0) { k--; update(); } });
    var bNext = VZ.btn(ctl, "下一步 ▶", function () { if (k < disks.length - 1) { k++; update(); } });
    var bPlay = VZ.btn(ctl, "▶ 逐块播放", function () {
      if (playing) { playing = false; bPlay.textContent = "▶ 逐块播放"; return; }
      if (k >= disks.length - 1) k = 0;
      playing = true; accT = null; bPlay.textContent = "⏸ 暂停"; update();
    });

    VZ.chips(ctl, ["log z", "√z", "∛z", "1/(1+z²)"], "log z", function (it) {
      func = FNS[it]; k = 0; build(); update();
    });
    VZ.chips(ctl, ["上半弧", "下半弧", "绕一圈", "绕两圈"], "上半弧", function (it) {
      pname = it; k = 0; build(); update();
    });

    VZ.raf(stage, function (sec) {
      if (!playing) return;
      if (accT === null) { accT = sec; return; }
      if (sec - accT < 0.55) return;
      accT = sec;
      if (k < disks.length - 1) { k++; update(); }
      else { playing = false; bPlay.textContent = "▶ 逐块播放"; }
    });

    build();
    update();
  }
},

"f-ch08k": {
  title: "两叶黎曼面：两张平板，沿三条缝粘起来",
  hint: "√(1−z³) 有三个支点 1、ω、ω²，外加 ∞。把两张平板上下叠着、沿<b>三条红缝</b>粘住，就得到它的黎曼面。<b>绕支点走一圈</b>：金点从上面那张<b>掉到下面那张</b>——这就是变号；绕两圈才回来。<span class='hl'>绕两圈才认账 ⇒ 全是 2 阶支点 ⇒ 只要两层</span>。拖动可转视角。",
  draw: function (stage) {
    var W = 760, H = 424, C = VZ.C, TAU = Math.PI * 2;
    var RMAX = 1.62, GAP = 1.52;          /* 两张板的半间距 */
    var BPS = [
      { k: "绕 z = 1", c: [1, 0], r: 0.40 },
      { k: "绕 z = ω", c: [-0.5, 0.866], r: 0.40 },
      { k: "绕 z = ω²", c: [-0.5, -0.866], r: 0.40 },
      { k: "绕 ∞", c: [0, 0], r: 1.42 }
    ];
    var bi = 0, loops = 0;
    var zc = [1.40, 0.0], wv = [1, 0], trail = [];
    var run = null, cache = null, lastYaw = null, lastPitch = null, lastZoom = null;
    var sgn = 1;                          /* 当前在哪张板：+1 上、−1 下 */

    function cube(z) { return [z[0] * z[0] * z[0] - 3 * z[0] * z[1] * z[1], 3 * z[0] * z[0] * z[1] - z[1] * z[1] * z[1]]; }
    function calcW(z) {
      var q = cube(z), vr = 1 - q[0], vi = -q[1];
      var m = Math.sqrt(Math.hypot(vr, vi)), a = Math.atan2(vi, vr) / 2;
      return [m * Math.cos(a), m * Math.sin(a)];
    }
    function hueOf(w) { return ((Math.atan2(w[1], w[0]) / TAU * 360) + 360) % 360; }

    function setZ(z) {
      zc = z;
      var cand = calcW(z);
      if (wv && cand[0] * wv[0] + cand[1] * wv[1] < 0) cand = [-cand[0], -cand[1]];
      wv = cand;
      sgn = cand[1] >= 0 || (cand[1] === 0 && cand[0] >= 0) ? 1 : -1;
      /* 用幅角判断在哪一叶：上半平面(0<arg<π)在上叶 */
      var a = Math.atan2(wv[1], wv[0]);
      sgn = (a > 0) ? 1 : -1;
      trail.push({ z: [z[0], z[1]], s: sgn });
      if (trail.length > 900) trail.shift();
    }

    function buildMesh() {
      var quads = [], NR = 7, NT = 58;
      for (var s = 0; s < 2; s++) {
        var zz = s === 0 ? GAP : -GAP;
        for (var i = 0; i < NR; i++) {
          for (var j = 0; j < NT; j++) {
            var r0 = (i + 0.05) / NR * RMAX, r1 = (i + 1.02) / NR * RMAX;
            var a0 = j / NT * TAU, a1 = (j + 1) / NT * TAU;
            var cs = [[r0, a0], [r1, a0], [r1, a1], [r0, a1]], pts = [], ws = [0, 0];
            for (var k = 0; k < 4; k++) {
              var rr = cs[k][0], aa = cs[k][1];
              var z = [rr * Math.cos(aa), rr * Math.sin(aa)];
              var ww = calcW(z);
              if (s === 1) ww = [-ww[0], -ww[1]];
              ws[0] += ww[0]; ws[1] += ww[1];
              pts.push([z[0], z[1], zz]);
            }
            var hue = hueOf(ws);
            var col = s === 0 ? "hsl(" + hue.toFixed(0) + ",62%,46%)" : "hsl(" + hue.toFixed(0) + ",24%,20%)";
            quads.push({ p: pts, col: col });
          }
        }
      }
      return quads;
    }

    function paint(ctx, w, h, fr) {
      var proj = fr.proj;
      if (!wv) wv = calcW(zc);
      ctx.clearRect(0, 0, w, h);
      var st = fr.st || { yaw: 0, pitch: 0, zoom: 1 };
      var mesh = buildMesh();                     /* 小网格，直接每帧重建 */

      /* 三条粘合缝（单位圆上的三段弧） */
      function seam(zOff) {
        for (var s = 0; s < 3; s++) {
          var a0 = s * TAU / 3, a1 = (s + 1) * TAU / 3, pts = [];
          for (var t = 0; t <= 18; t++) {
            var a = a0 + (a1 - a0) * t / 18;
            pts.push([Math.cos(a), Math.sin(a), zOff]);
          }
          VZ.m3wire(ctx, pts, proj, "rgba(255,122,122,.95)", 2.2);
        }
      }
      seam(GAP); seam(-GAP);

      /* 板面：按深度排序 */
      var drawn = mesh.map(function (q) {
        var ps = q.p.map(function (p) { return proj(p); });
        return { d: (ps[0][2] + ps[1][2] + ps[2][2] + ps[3][2]) / 4, pts: ps, col: q.col };
      });
      drawn.sort(function (A, B) { return B.d - A.d; });
      for (var i2 = 0; i2 < drawn.length; i2++) VZ.m3fill(ctx, drawn[i2].pts, drawn[i2].col, "rgba(0,0,0,.16)", .4);

      /* 支点：两张板在这里被粘住 —— 画一根竖线 */
      for (var m = 0; m < 3; m++) {
        var c0 = BPS[m].c;
        VZ.m3wire(ctx, [[c0[0], c0[1], GAP], [c0[0], c0[1], -GAP]], proj, "rgba(255,122,122,.95)", 2.4);
        VZ.m3sphere(ctx, [c0[0], c0[1], GAP], proj, 4, (m === bi) ? "#ffd166" : C.red, C.deep);
        VZ.m3sphere(ctx, [c0[0], c0[1], -GAP], proj, 4, (m === bi) ? "#ffd166" : C.red, C.deep);
      }

      /* 轨迹（画在当前那张板所在的高度附近） */
      if (trail.length > 1) {
        ctx.strokeStyle = "rgba(255,207,92,.9)"; ctx.lineWidth = 2.2;
        var pen = false;
        ctx.beginPath();
        for (var t2 = 0; t2 < trail.length; t2++) {
          var p3 = trail[t2], zz = p3.s * GAP;
          var q4 = proj([p3.z[0], p3.z[1], zz]);
          if (t2 && trail[t2 - 1].s !== p3.s) pen = false;      /* 换叶处断笔 */
          if (pen) ctx.lineTo(q4[0], q4[1]); else { ctx.moveTo(q4[0], q4[1]); pen = true; }
        }
        ctx.stroke();
      }

      /* 当前点：两张板上各有一个（±w），亮的是现在这个 */
      var up = proj([zc[0], zc[1], GAP]), dn = proj([zc[0], zc[1], -GAP]);
      var act = sgn > 0 ? up : dn, oth = sgn > 0 ? dn : up;
      ctx.beginPath(); ctx.arc(oth[0], oth[1], 4.5, 0, TAU);
      ctx.fillStyle = "rgba(200,195,230,.55)"; ctx.fill();
      VZ.m3wire(ctx, [[zc[0], zc[1], GAP], [zc[0], zc[1], -GAP]], proj, "rgba(255,207,92,.45)", 1.2, [3, 4]);
      ctx.beginPath(); ctx.arc(act[0], act[1], 7.5, 0, TAU);
      ctx.fillStyle = C.gold; ctx.fill();
      ctx.strokeStyle = C.deep; ctx.lineWidth = 2; ctx.stroke();

      var lbU = proj([0, 0, GAP]), lbD = proj([0, 0, -GAP]);
      ctx.font = "bold 11px -apple-system,PingFang SC,sans-serif";
      ctx.fillStyle = "rgba(255,255,255,.55)"; ctx.fillText("上叶", lbU[0] - 12, lbU[1] - 6);
      ctx.fillStyle = "rgba(255,255,255,.34)"; ctx.fillText("下叶", lbD[0] + 14, lbD[1] + 12);
      ctx.font = "11px -apple-system,PingFang SC,sans-serif";
      ctx.fillStyle = C.dim;
      ctx.fillText("两张平板 = 两叶；红缝 = 粘合处（跨过去就换叶）", 14, h - 32);
      ctx.fillStyle = C.violet;
      ctx.fillText("∞ 在四周边缘（第四个支点）", 14, h - 13);
      ctx.fillStyle = "rgba(255,255,255,.32)";
      ctx.font = "10.5px -apple-system,PingFang SC,sans-serif";
      ctx.fillText("拖动旋转 · 滚轮缩放", w - 138, 18);
    }

    var api = VZ.stage3(stage, W, H, paint, { yaw: -0.5, pitch: -0.36, dist: 5.6 });

    var ctl = VZ.box(stage, "viz-ctl");
    var pan = VZ.panel(stage, { "当前 z": "", "w = √(1−z³)": "", "|w|": "", "绕行": "", "落在哪一叶": "" });
    var say = VZ.note(stage, "");

    function refresh() {
      api.redraw();
      VZ.setPanel(pan, {
        "当前 z": zc[0].toFixed(3) + (zc[1] >= 0 ? " + " : " − ") + Math.abs(zc[1]).toFixed(3) + "i",
        "w = √(1−z³)": wv[0].toFixed(3) + (wv[1] >= 0 ? " + " : " − ") + Math.abs(wv[1]).toFixed(3) + "i",
        "|w|": Math.hypot(wv[0], wv[1]).toFixed(3),
        "绕行": loops + " 圈",
        "落在哪一叶": sgn > 0 ? "上叶（arg w > 0）" : "下叶（arg w < 0）"
      });
      say.innerHTML = loops === 0
        ? "点「绕一圈」：金点绕支点走一圈，注意它会在<b>半圈处从上面那张板掉到下面那张</b>——那就是 w 变号。"
        : loops === 1
          ? "绕完 <b>1 圈</b>：w 变成 <b>−w₀</b>，金点落到<b>另一张板</b>上（就是「变号」）。再绕一圈就该回来了。"
          : "绕完 <b>2 圈</b>：w 走满 2π，<b>回到原来那张板、回到原值</b>。绕两圈才认账 ⇒ <b>2 阶支点</b> ⇒ 两层就够。";
    }

    VZ.chips(ctl, ["绕 z = 1", "绕 z = ω", "绕 z = ω²", "绕 ∞"], "绕 z = 1", function (it) {
      bi = ["绕 z = 1", "绕 z = ω", "绕 z = ω²", "绕 ∞"].indexOf(it);
      reset();
    });
    VZ.btn(ctl, "▶ 绕一圈（→ 变号）", function () { start(1); });
    VZ.btn(ctl, "▶ 绕两圈（→ 回来）", function () { start(2); });
    VZ.btn(ctl, "↺ 重置", function () { reset(); });

    function reset() {
      var B = BPS[bi], s0 = [B.c[0] + B.r, B.c[1]];
      wv = calcW(s0); trail = []; loops = 0; run = null;
      setZ(s0); refresh();
    }
    function start(n) { reset(); run = { n: n, t0: null, dur: 2400 * n }; }

    VZ.raf(stage, function (sec, ms) {
      if (!run) return;
      if (run.t0 === null) { run.t0 = ms; return; }
      var p = Math.min(1, (ms - run.t0) / run.dur);
      var B = BPS[bi], th = p * run.n * TAU;
      setZ([B.c[0] + B.r * Math.cos(th), B.c[1] + B.r * Math.sin(th)]);
      if (p >= 1) { loops = run.n; run = null; refresh(); return; }
      if ((run.tick = (run.tick || 0) + 1) % 3 === 0) refresh(); else api.redraw();
    });

    reset();
  }
},

"f-ch08l": {
  title: "黎曼球与球极投影：球面上的圆，落到平面上还是圆",
  hint: "拖动<b>旋转视角</b>。金点 <b>P</b> 在球面上，从<b>南极 S</b> 拉一条直线打到赤道平面，交点就是它的复数 z（<b>南极代表 z = ∞</b>，北极代表 z = 0）。<span class='hl'>点「纬线走一圈」</span>——平面上的像画出一个<b>圆</b>；点「经线走一圈」——像画成一条<b>直线</b>。这就是球极投影「把球面上的圆映成平面上的圆（或直线）」。",
  draw: function (stage) {
    var W = 760, H = 420, C = VZ.C, TAU = Math.PI * 2;
    var R = 1.55;
    var th = 62 * Math.PI / 180, ph = 28 * Math.PI / 180;
    var demo = null;          /* {mode:"lat"|"mer", t, pts:[], cur} */
    var api = VZ.stage3(stage, W, H, paint, { yaw: -0.62, pitch: -0.36, dist: 4.6 });

    /* 球面坐标：th 自北极起算 */
    function sph(t, p) {
      var st = Math.sin(t);
      return [R * st * Math.cos(p), R * st * Math.sin(p), R * Math.cos(t)];
    }
    /* 从南极 (0,0,-R) 出发投到赤道平面 z=0 */
    function toPlane(pt) {
      var t = 1 / (1 + pt[2] / R);
      return [pt[0] * t, pt[1] * t, 0];
    }

    function paint(ctx, w, h, fr) {
      var proj = fr.proj;
      ctx.clearRect(0, 0, w, h);

      /* ---- 赤道平面（= z 平面）的坐标轴 ---- */
      VZ.m3wire(ctx, [[-2.0, 0, 0], [2.0, 0, 0]], proj, C.faint, 1, [4, 4]);
      VZ.m3wire(ctx, [[0, -2.0, 0], [0, 2.0, 0]], proj, C.faint, 1, [4, 4]);
      var ax = proj([2.05, 0, 0]);
      ctx.fillStyle = C.dim;
      ctx.font = "11px -apple-system,PingFang SC,sans-serif";
      ctx.fillText("Re z", ax[0] + 4, ax[1] + 4);
      var ay = proj([0, 2.05, 0]);
      ctx.fillText("Im z", ay[0] - 26, ay[1] - 4);

      /* ---- 球体线框：经纬网，按深度排序 ---- */
      var segs = [];
      var NT = 40, NP = 32;
      for (var i = 0; i < NT; i++) {
        var t1 = i / NT * Math.PI, t2 = (i + 1) / NT * Math.PI;
        for (var j = 0; j < NP; j++) {
          var p1 = j / NP * TAU, p2 = (j + 1) / NP * TAU;
          var a = sph(t1, p1), b = sph(t2, p1), c2 = sph(t2, p2), d = sph(t1, p2);
          var mid = [(a[0] + c2[0]) / 2, (a[1] + c2[1]) / 2, (a[2] + c2[2]) / 2];
          segs.push({ pts: [a, b, c2, d], z: fr.rot(mid)[2], lat: true });
        }
      }
      segs.sort(function (A, B) { return B.z - A.z; });
      for (var s = 0; s < segs.length; s++) {
        var g = segs[s];
        var near = (g.z < 0);
        VZ.m3wire(ctx, g.pts, proj, near ? "rgba(201,194,230,.55)" : "rgba(75,67,128,.85)", near ? 1.1 : .8);
      }

      /* ---- 赤道圈加粗 + 两极 ---- */
      var eq = [];
      for (var q = 0; q <= 72; q++) eq.push(sph(Math.PI / 2, q / 72 * TAU));
      VZ.m3wire(ctx, eq, proj, C.ink2, 1.9);
      VZ.m3sphere(ctx, [0, 0, R], proj, 4, C.cyan, null);
      VZ.m3sphere(ctx, [0, 0, -R], proj, 4.5, C.gold, null);
      /* 标签用引导线拉到球外，避免压住经纬网 */
      var nOut = proj([0.62, 0, R + 0.30]), sOut = proj([-0.55, 0, -R - 0.30]);
      var nAnchor = proj([0, 0, R]), sAnchor = proj([0, 0, -R]);
      VZ.m3wire(ctx, [nAnchor, nOut], proj, "rgba(79,227,240,.6)", 1);
      VZ.m3wire(ctx, [sAnchor, sOut], proj, "rgba(255,207,92,.6)", 1);
      ctx.font = "bold 11px -apple-system,PingFang SC,sans-serif";
      ctx.fillStyle = C.cyan;
      ctx.fillText("北极 N", nOut[0] + 6, nOut[1] - 3);
      ctx.fillText("z = 0", nOut[0] + 6, nOut[1] + 11);
      ctx.fillStyle = C.gold;
      ctx.fillText("南极 S", sOut[0] - 46, sOut[1] + 4);
      ctx.fillText("z = ∞", sOut[0] - 40, sOut[1] + 18);

      /* ---- 投影射线 S → P → z ---- */
      var P = sph(th, ph);
      var zpl = toPlane(P);
      VZ.m3wire(ctx, [[0, 0, -R], P], proj, "rgba(255,207,92,.55)", 1.1, [5, 4]);
      VZ.m3wire(ctx, [P, zpl], proj, C.gold, 1.7);

      /* ---- 演示轨迹（球面 + 平面像） ---- */
      if (demo && demo.pts.length > 1) {
        for (var d2 = 0; d2 < demo.pts.length; d2++) {
          var q1 = proj(demo.pts[d2]), q2 = proj(demo.imgs[d2]);
          if (d2) {
            VZ.m3wire(ctx, [demo.pts[d2 - 1], demo.pts[d2]], proj, C.cyan, 2.2);
            VZ.m3wire(ctx, [demo.imgs[d2 - 1], demo.imgs[d2]], proj, C.mag, 2.2);
          }
        }
      }

      /* ---- 当前点 ---- */
      VZ.m3sphere(ctx, P, proj, 5.4, C.gold, C.deep);
      var pp = proj(P);
      ctx.fillStyle = C.gold;
      ctx.font = "bold 11px -apple-system,PingFang SC,sans-serif";
      ctx.fillText("P", pp[0] + 8, pp[1] - 6);
      VZ.m3sphere(ctx, zpl, proj, 5.6, C.mag, C.deep);
      var zp = proj(zpl);
      ctx.fillStyle = C.mag;
      ctx.font = "bold 11px -apple-system,PingFang SC,sans-serif";
      ctx.fillText("z", zp[0] + 8, zp[1] + 4);

      /* ---- 说明 ---- */
      ctx.fillStyle = "rgba(255,255,255,.34)";
      ctx.font = "10.5px -apple-system,PingFang SC,sans-serif";
      ctx.fillText("拖动旋转 · 滚轮缩放", w - 148, 18);
      ctx.fillStyle = C.dim;
      ctx.fillText("赤道平面就是 z 平面", 14, h - 12);
    }

    var ctl = VZ.box(stage, "viz-ctl");
    var pan = VZ.panel(stage, { "球面点 P": "", "极角 θ（自北极）": "", "平面上的像 z": "", "|z| = R·tan(θ/2)": "", "演示": "" });
    var say = VZ.note(stage, "");

    var sTh = VZ.slider(ctl, {
      label: "极角 θ", min: 6, max: 174, step: 1, value: 62,
      format: function (v) { return v + "°"; },
      onInput: function (v) { th = v * Math.PI / 180; demo = null; refresh(); }
    });
    var sPh = VZ.slider(ctl, {
      label: "经度 φ", min: 0, max: 360, step: 1, value: 28,
      format: function (v) { return v + "°"; },
      onInput: function (v) { ph = v * Math.PI / 180; demo = null; refresh(); }
    });
    VZ.btn(ctl, "纬线走一圈", function () { startDemo("lat"); });
    VZ.btn(ctl, "经线走一圈", function () { startDemo("mer"); });
    VZ.btn(ctl, "复位", function () { demo = null; th = 62 * Math.PI / 180; ph = 28 * Math.PI / 180; sTh.set(62); sPh.set(28); refresh(); });

    function startDemo(mode) {
      demo = { mode: mode, t: 0, pts: [], imgs: [] };
      th = mode === "lat" ? 62 * Math.PI / 180 : 30 * Math.PI / 180;
      ph = 0;
      sTh.set(Math.round(th * 180 / Math.PI));
      sPh.set(0);
      refresh();
    }

    function refresh() {
      api.redraw();
      var P = sph(th, ph);
      var zpl = toPlane(P);
      var zr = Math.hypot(zpl[0], zpl[1]);
      var zc = zr < 1e-9 ? "0" : (zpl[0] >= 0 ? zpl[0].toFixed(3) : zpl[0].toFixed(3));
      var zi = zr < 1e-9 ? "0" : Math.abs(zpl[1]).toFixed(3);
      VZ.setPanel(pan, {
        "球面点 P": "θ = " + Math.round(th * 180 / Math.PI) + "°,  φ = " + Math.round(ph * 180 / Math.PI) + "°",
        "极角 θ（自北极）": (th * 180 / Math.PI).toFixed(1) + "°",
        "平面上的像 z": zc + (zpl[1] >= 0 ? " + " : " − ") + zi + "i",
        "|z| = R·tan(θ/2)": zr.toFixed(3),
        "演示": demo ? (demo.mode === "lat" ? "纬线走一圈 → 像画出一个圆" : "经线走一圈 → 像画成一条直线") : "—"
      });
      say.innerHTML = demo
        ? (demo.mode === "lat"
            ? "纬线是<b>不含 S 的圆</b>，投到平面上仍是<b>圆</b>——这是球极投影的漂亮性质。"
            : "经线<b>含投影点 S</b>，投到平面上退化成一条<b>直线</b>；反过来看，直线就是「无穷大的圆」。")
        : "球极投影：<b>从南极 S 拉直线</b>打到赤道平面。球面上除了 S 与 N 之外，每点都对应唯一的复数 z。<span class='hl'>球面上的圆一律映成平面上的圆或直线</span>——这就让黎曼球上的双线性变换变得极其干净。";
    }

    /* 演示动画 */
    var lastT = null;
    VZ.raf(stage, function (sec, ms) {
      if (!demo) { lastT = null; return; }
      if (lastT === null) lastT = ms;
      var step = (ms - lastT) / 1000;
      var spd = 1.15;
      demo.t += step * spd;
      if (demo.t >= 1) {
        demo.t = 1;
        if (demo.mode === "mer") {
          /* 经线走完 */
        }
      }
      var ang = demo.t * TAU;
      if (demo.mode === "lat") {
        ph = ang;
        th = 62 * Math.PI / 180;
      } else {
        /* 经线：绕 S 所在的子午圈，θ 从 6° 到 174° 再回来 */
        var u = demo.t * 2;
        var sgn = u <= 1 ? 1 : -1;
        var uu = u <= 1 ? u : 2 - u;
        th = (6 + 168 * uu) * Math.PI / 180;
        ph = 0;
      }
      var P = sph(th, ph);
      demo.pts.push(P);
      demo.imgs.push(toPlane(P));
      if (demo.pts.length > 400) { demo.pts.shift(); demo.imgs.shift(); }
      sPh.set(Math.round(ph * 180 / Math.PI) % 360);
      sTh.set(Math.round(th * 180 / Math.PI));
      refresh();
    });

    refresh();
  }
},

"f-ch08m": {
  title: "亏格 = 数柄：球面 0 个、环面 1 个、双环面 2 个",
  hint: "拖动<b>旋转视角</b>，看清每只曲面有几条<b>柄</b>。亏格 g 是曲面在<b>连续形变</b>（不剪开、不粘合）下不变的那个数——<span class='hl'>球面 0、环面 1、椒盐卷饼 3</span>。球面和环面之间隔着一副拓扑手术刀，<b>永远变不成彼此</b>。",
  draw: function (stage) {
    var W = 760, H = 400, C = VZ.C, TAU = Math.PI * 2;
    var cur = "环面";

    /* ---------- 三种曲面的参数化 ---------- */
    function surfSphere(u, v) {
      var t = u * Math.PI, p = v * TAU;
      var st = Math.sin(t);
      return [1.28 * st * Math.cos(p), 1.28 * st * Math.sin(p), 1.28 * Math.cos(t)];
    }
    function surfTorus(u, v) {
      var t = u * TAU, p = v * TAU;
      var R = 1.16, r = 0.46;
      return [(R + r * Math.cos(p)) * Math.cos(t), (R + r * Math.cos(p)) * Math.sin(t), r * Math.sin(p)];
    }
    /* 双环面：沿 Gerono 双纽线（在 xy 平面）扫一根管——路径在原点自交，两个瓣各有一个洞 */
    function surfDouble(u, v) {
      var t = u * TAU, p = v * TAU;
      var A = 1.30;
      var px = A * Math.cos(t), py = A * Math.sin(t) * Math.cos(t);
      var dx = -A * Math.sin(t), dy = A * (Math.cos(t) * Math.cos(t) - Math.sin(t) * Math.sin(t));
      var len = Math.hypot(dx, dy) || 1;
      var nx = -dy / len, ny = dx / len;      /* 平面内法向 */
      var r = 0.24;
      return [px + r * Math.cos(p) * nx, py + r * Math.cos(p) * ny, r * Math.sin(p)];
    }
    /* 双环面两个洞的轴心（供标注） */
    function doubleHoles() {
      var A = 1.30, out = [];
      [[Math.PI / 4, 1], [Math.PI * 1.25, -1]].forEach(function (h) {
        var t = h[0];
        var px = A * Math.cos(t), py = A * Math.sin(t) * Math.cos(t);
        out.push({ c: [px, py, 0], s: h[1] });
      });
      return out;
    }
    var FNS = { "球面": surfSphere, "环面": surfTorus, "双环面": surfDouble };
    var GEN = { "球面": 0, "环面": 1, "双环面": 2 };
    var DESC = {
      "球面": "亏格 0：一只没有柄的球。整个曲面只有一个洞——不，是<b>零个洞</b>。",
      "环面": "亏格 1：一只甜甜圈，一只马克杯，一个把手。洞的个数 = 1。",
      "双环面": "亏格 2：<b>两只柄</b>（金色虚线标出两个洞的轴）。椒盐卷饼表面是亏格 3，公式 m = 3g − 3 在 g = 0, 1 时失效。"
    };

    function build(fn, proj) {
      var NU = 64, NV = 34, quads = [];
      for (var i = 0; i < NU; i++) {
        for (var j = 0; j < NV; j++) {
          var u1 = i / NU, u2 = (i + 1) / NU, v1 = j / NV, v2 = (j + 1) / NV;
          var a = fn(u1, v1), b = fn(u2, v1), c = fn(u2, v2), d = fn(u1, v2);
          var q1 = proj(a), q2 = proj(b), q3 = proj(c), q4 = proj(d);
          var dep = (q1[2] + q2[2] + q3[2] + q4[2]) / 4;
          /* 法向光照 */
          var e1 = [b[0] - a[0], b[1] - a[1], b[2] - a[2]];
          var e2 = [d[0] - a[0], d[1] - a[1], d[2] - a[2]];
          var nx = e1[1] * e2[2] - e1[2] * e2[1];
          var ny = e1[2] * e2[0] - e1[0] * e2[2];
          var nz = e1[0] * e2[1] - e1[1] * e2[0];
          var nl = Math.hypot(nx, ny, nz) || 1;
          var L = [0.34, -0.42, 0.84], Ln = Math.hypot(L[0], L[1], L[2]);
          var dot = (nx * L[0] + ny * L[1] + nz * L[2]) / (nl * Ln);
          var lum = Math.max(0.26, Math.min(0.92, 0.44 + 0.52 * dot));
          quads.push({ d: dep, pts: [q1, q2, q3, q4], lum: lum });
        }
      }
      quads.sort(function (A, B) { return B.d - A.d; });
      return quads;
    }

    var api = VZ.stage3(stage, W, H, paint, { yaw: -0.62, pitch: -0.34, dist: 4.2 });

    function paint(ctx, w, h, fr) {
      var proj = fr.proj;
      ctx.clearRect(0, 0, w, h);
      var fn = FNS[cur];

      /* 地面参考圆 */
      var ground = [];
      for (var i = 0; i <= 64; i++) { var a = i / 64 * TAU; ground.push([1.85 * Math.cos(a), 1.85 * Math.sin(a), -1.45]); }
      VZ.m3wire(ctx, ground, proj, "rgba(75,67,128,.7)", 1, [4, 5]);

      var quads = build(fn, proj);
      for (var k = 0; k < quads.length; k++) {
        var L = Math.round(quads[k].lum * 100);
        VZ.m3fill(ctx, quads[k].pts,
          "rgb(" + Math.round(52 + 172 * quads[k].lum) + "," +
          Math.round(44 + 128 * quads[k].lum) + "," +
          Math.round(88 + 132 * quads[k].lum) + ")",
          "rgba(0,0,0,.14)", .4);
      }

      /* 双环面：把两个洞的轴心标出来 */
      if (cur === "双环面") {
        var hs = doubleHoles();
        for (var hi = 0; hi < hs.length; hi++) {
          var hc = hs[hi].c;
          var q0 = proj([hc[0], hc[1], 0]), q1 = proj([hc[0], hc[1], 0.62 * hs[hi].s]);
          VZ.m3wire(ctx, [[hc[0], hc[1], 0], [hc[0], hc[1], 0.62 * hs[hi].s]], proj, C.gold, 1.5, [3, 3]);
          VZ.m3sphere(ctx, [hc[0], hc[1], 0], proj, 3.4, C.gold, null);
        }
      }

      /* 轮廓高亮 */
      ctx.fillStyle = "rgba(255,255,255,.34)";
      ctx.font = "10.5px -apple-system,PingFang SC,sans-serif";
      ctx.fillText("拖动旋转 · 滚轮缩放", w - 148, 18);
      ctx.fillStyle = C.dim;
      ctx.fillText(cur + "：亏格 g = " + GEN[cur], 14, h - 12);
    }

    var ctl = VZ.box(stage, "viz-ctl");
    var pan = VZ.panel(stage, { "曲面": "", "亏格 g": "", "柄的个数": "", "拓扑分类": "" });
    var say = VZ.note(stage, "");

    VZ.chips(ctl, Object.keys(FNS), cur, function (k) { cur = k; refresh(); });

    function refresh() {
      api.redraw();
      VZ.setPanel(pan, {
        "曲面": cur,
        "亏格 g": String(GEN[cur]),
        "柄的个数": GEN[cur] === 0 ? "0 个" : GEN[cur] + " 个",
        "拓扑分类": GEN[cur] === 0 ? "球面类" : GEN[cur] === 1 ? "环面类" : "亏格 2 类"
      });
      say.innerHTML = DESC[cur] + " 亏格是<b>拓扑</b>不变量：只要不剪开、不粘合，g 永远不变。"
    }
    refresh();
  }
},

"f-ch08n": {
  title: "黎曼映射定理：把带拐角的区域揉成单位圆盘",
  hint: "拖动<b>旋转视角</b>，拖进度条看左边的区域被<b>揉成</b>圆盘——金色辐条是<b>同一条射线上的点成群移动</b>。<span class='hl'>不管边界多难看（带拐角、不可微都行），只要没有洞，就一定存在这样的共形映射</span>；指定三个边界点，映射就被唯一钉死。",
  draw: function (stage) {
    var W = 760, H = 400, C = VZ.C, TAU = Math.PI * 2;
    var shape = "带拐角", prog = 0;
    var SHAPES = {
      "带拐角": function (th) { return 1 + 0.34 * Math.cos(5 * th) + 0.10 * Math.abs(Math.sin(2.5 * th)); },
      "凹口": function (th) { return 1 - 0.42 * Math.exp(-Math.pow((th - 0.9) / 0.42, 2)); },
      "花瓣": function (th) { return 1 + 0.30 * Math.cos(3 * th) - 0.12 * Math.sin(2 * th); }
    };
    var ZL = 0, ZR = 1.55;
    var api = VZ.stage3(stage, W, H, paint, { yaw: -0.55, pitch: -0.50, dist: 4.9 });

    /* 变形后的半径：原形状与圆的插值 */
    function rad(th, e) { return SHAPES[shape](th) * (1 - e) + 1 * e; }

    function paint(ctx, w, h, fr) {
      var proj = fr.proj;
      ctx.clearRect(0, 0, w, h);
      var e = VZ.ease(prog);
      var cxL = -1.75, cxR = 1.95, cy = 0, R = 1.02;

      /* ---- 地面：正在被揉的区域 ---- */
      var NG = 5, NA = 72;
      for (var gi = 0; gi <= NG; gi++) {
        var pts = [];
        for (var ti = 0; ti <= NA; ti++) {
          var th = ti / NA * TAU, rr = rad(th, e) * R * (1 - gi / NG) * 0.999;
          pts.push([cxL + rr * Math.cos(th), cy + rr * Math.sin(th), ZL]);
        }
        VZ.m3wire(ctx, pts, proj, "rgba(79,227,240,.40)", 1);
      }
      for (var g3 = 0; g3 <= 8; g3++) {
        var line = [], th2 = g3 / 8 * TAU;
        for (var ri = 0; ri <= 10; ri++) {
          var rr2 = rad(th2, e) * R * (ri / 10) * 0.999;
          line.push([cxL + rr2 * Math.cos(th2), cy + rr2 * Math.sin(th2), ZL]);
        }
        VZ.m3wire(ctx, line, proj, "rgba(79,227,240,.26)", 1);
      }
      var outline = [];
      for (var oi = 0; oi <= 96; oi++) {
        var th3 = oi / 96 * TAU, r3 = rad(th3, e) * R;
        outline.push([cxL + r3 * Math.cos(th3), cy + r3 * Math.sin(th3), ZL]);
      }
      VZ.m3wire(ctx, outline, proj, C.cyan, 2.2);

      /* ---- 上层：单位圆盘 ---- */
      var disk = [];
      for (var di = 0; di <= 72; di++) {
        var th4 = di / 72 * TAU;
        disk.push([cxR + R * Math.cos(th4), cy + R * Math.sin(th4), ZR]);
      }
      VZ.m3wire(ctx, disk, proj, C.mag, 2.2);
      for (var dg = 0; dg <= 4; dg++) {
        var dl = [];
        for (var dj = 0; dj <= 72; dj++) {
          var th5 = dj / 72 * TAU, rr5 = R * (1 - dg / 4) * 0.999;
          dl.push([cxR + rr5 * Math.cos(th5), cy + rr5 * Math.sin(th5), ZR]);
        }
        VZ.m3wire(ctx, dl, proj, "rgba(255,111,216,.28)", 1);
      }

      /* ---- 映射「膜」：同角度的点成群对应 ---- */
      var NS = 12;
      for (var si = 0; si < NS; si++) {
        var th6 = si / NS * TAU;
        var rA = rad(th6, e) * R, rB = R;
        var strip = [];
        for (var ui = 0; ui <= 6; ui++) {
          var u = ui / 6;
          var rr3 = (rA * (1 - u) + rB * u) * 0.999;
          strip.push([cxL + (cxR - cxL) * u + rr3 * Math.cos(th6),
                      cy + rr3 * Math.sin(th6),
                      ZL + (ZR - ZL) * u]);
        }
        VZ.m3wire(ctx, strip, proj, "rgba(255,207,92,.50)", 1.2);
        VZ.m3sphere(ctx, [cxL + rA * Math.cos(th6), cy + rA * Math.sin(th6), ZL], proj, 3.0, C.gold, null);
        VZ.m3sphere(ctx, [cxR + rB * Math.cos(th6), cy + rB * Math.sin(th6), ZR], proj, 3.0, C.gold, null);
      }

      /* ---- 三个被指定的点（唯一性） ---- */
      var TH3 = [0, TAU / 3, 2 * TAU / 3];
      for (var ti2 = 0; ti2 < 3; ti2++) {
        var t7 = TH3[ti2], ra = rad(t7, e) * R;
        var pa = [cxL + ra * Math.cos(t7), cy + ra * Math.sin(t7), ZL];
        var pb = [cxR + R * Math.cos(t7), cy + R * Math.sin(t7), ZR];
        VZ.m3sphere(ctx, pa, proj, 4.4, C.violet, C.deep);
        VZ.m3sphere(ctx, pb, proj, 4.4, C.violet, C.deep);
        VZ.m3wire(ctx, [pa, pb], proj, "rgba(155,140,255,.42)", 1, [3, 4]);
      }

      /* ---- 屏幕固定图例（不随投影，避免压线） ---- */
      ctx.font = "11px -apple-system,PingFang SC,sans-serif";
      var lx = 14, ly = h - 92;
      var legend = [
        [C.cyan, "地面：原区域"],
        [C.mag, "上层：单位圆盘"],
        [C.gold, "同一辐角线上成群对应"],
        [C.violet, "指定的三点"]
      ];
      for (var li = 0; li < legend.length; li++) {
        ctx.fillStyle = legend[li][0];
        ctx.fillRect(lx, ly - 8, 9, 9);
        ctx.fillStyle = "rgba(242,236,223,.70)";
        ctx.fillText(legend[li][1], lx + 15, ly);
        ly += 17;
      }
      ctx.fillStyle = "rgba(255,255,255,.34)";
      ctx.font = "10.5px -apple-system,PingFang SC,sans-serif";
      ctx.fillText("拖动旋转 · 滚轮缩放", w - 148, 18);
    }

    var ctl = VZ.box(stage, "viz-ctl");
    var pan = VZ.panel(stage, { "区域形状": "", "揉成圆盘进度": "", "边界光滑度": "", "有洞吗": "" });
    var say = VZ.note(stage, "");

    var sld = VZ.slider(ctl, {
      label: "揉成圆盘进度", min: 0, max: 1, step: 0.01, value: prog,
      format: function (v) { return Math.round(v * 100) + "%"; },
      onInput: function (v) { prog = v; refresh(); }
    });
    VZ.chips(ctl, Object.keys(SHAPES), shape, function (k) { shape = k; prog = 0; sld.set(0); refresh(); });
    VZ.btn(ctl, "看动画", function () {
      var t0 = null;
      var stop = VZ.raf(stage, function (sec, ms) {
        if (t0 === null) t0 = ms;
        var u = Math.min(1, (ms - t0) / 1600);
        prog = prog >= 0.999 ? 0 : VZ.ease(u);
        sld.set(Math.round(prog * 100) / 100);
        refresh();
        if (u >= 1) stop();
      });
    });
    VZ.btn(ctl, "复位", function () { prog = 0; sld.set(0); refresh(); });

    function refresh() {
      api.redraw();
      VZ.setPanel(pan, {
        "区域形状": shape,
        "揉成圆盘进度": Math.round(prog * 100) + "%",
        "边界光滑度": prog < 0.35 ? "原样（带尖角）" : prog < 0.75 ? "过渡中" : "已圆滑",
        "有洞吗": "没有（单连通）"
      });
      say.innerHTML = "黎曼映射定理：<b>任何</b>由一条不自交闭曲线围成的区域，都存在一个<b>全纯映射</b>把它送到单位圆盘——"
        + "边界带拐角、不可微都没关系（只要求曲线是 Jordan 曲线）。"
        + (prog > 0.9 ? "<br><b>注意</b>：金色辐条上的点始终<b>沿同一条辐角线</b>整体移动，所以角点被抹平了——"
            + "映射是共形的：<b>无穷小形状不变</b>，但有限大小的角会变。" : "");
    }
    refresh();
  }
},

"f-ch08o": {
  title: "共形：无穷小的圆只被旋转放大，绝不压扁",
  hint: "拖动<b>旋转视角</b>。左平面上一族<b>无穷小圆</b>，经映射后在右平面<b>仍然是圆</b>；而<b>有限大小的图形</b>（金色方块）被明显<b>走样</b>了。<span class='hl'>共形只管无穷小尺度</span>——曲线的<b>夹角</b>在变换下分毫不差，这就是全纯性的几何刻画。",
  draw: function (stage) {
    var W = 760, H = 400, C = VZ.C, TAU = Math.PI * 2;
    var mode = "z²（非线性）";
    var cL = [-0.35, 0.25];        /* 局部中心（z 平面局部坐标） */
    var R0 = 0.95;                /* 局部坐标显示范围 */
    var cxL = -2.05, cxR = 2.15;  /* 两个平面在屏幕上的中心 */
    var SCALE = { "z²（非线性）": 1, "e^z（指数）": 1, "1/z（反演）": 0.22 };
    var api = VZ.stage3(stage, W, H, paint, { yaw: -0.16, pitch: -0.40, dist: 4.6 });

    /* ---------- 映射 ---------- */
    function fz(z) {
      if (mode === "z²（非线性）") {
        return [z[0] * z[0] - z[1] * z[1], 2 * z[0] * z[1]];
      }
      if (mode === "e^z（指数）") {
        var m = Math.exp(z[0]);
        return [m * Math.cos(z[1]), m * Math.sin(z[1])];
      }
      /* w = 1/z */
      var d = z[0] * z[0] + z[1] * z[1];
      if (d < 1e-9) d = 1e-9;
      return [z[0] / d, -z[1] / d];
    }
    function fDeriv(z) {
      if (mode === "z²（非线性）") return [2 * z[0], 2 * z[1]];
      if (mode === "e^z（指数）") return [Math.exp(z[0]) * Math.cos(z[1]), Math.exp(z[0]) * Math.sin(z[1])];
      var d = z[0] * z[0] + z[1] * z[1];
      if (d < 1e-9) d = 1e-9;
      return [(z[1] * z[1] - z[0] * z[0]) / (d * d), -2 * z[0] * z[1] / (d * d)];
    }
    /* 局部尺度：把 w 平面画在右边的合适大小 */
    function wScale(z) {
      var d = fDeriv(z);
      var m = Math.hypot(d[0], d[1]);
      return m > 1e-6 ? Math.min(1.6, m) : 1.6;
    }
    function toL(z) { return [cxL + z[0] * R0, z[1] * R0, 0]; }
    function toR(z) {
      var w = fz(z), w0 = fz(cL), k = R0 * (SCALE[mode] || 1);
      return [cxR + (w[0] - w0[0]) * k, (w[1] - w0[1]) * k, 0];
    }

    function paint(ctx, w, h, fr) {
      var proj = fr.proj;
      ctx.clearRect(0, 0, w, h);

      /* ---- 两个平面的网格 ---- */
      for (var g = -3; g <= 3; g++) {
        VZ.m3wire(ctx, [[cxL - 1.7, g * 0.5, 0], [cxL + 1.7, g * 0.5, 0]], proj, "rgba(75,67,128,.75)", .7);
        VZ.m3wire(ctx, [[cxL + g * 0.5, -1.7, 0], [cxL + g * 0.5, 1.7, 0]], proj, "rgba(75,67,128,.75)", .7);
        VZ.m3wire(ctx, [[cxR - 1.7, g * 0.5, 0], [cxR + 1.7, g * 0.5, 0]], proj, "rgba(75,67,128,.75)", .7);
        VZ.m3wire(ctx, [[cxR + g * 0.5, -1.7, 0], [cxR + g * 0.5, 1.7, 0]], proj, "rgba(75,67,128,.75)", .7);
      }

      /* ---- 无穷小圆：绕局部中心的一族 ---- */
      var NA = 44, eps = 0.075;
      for (var i = 0; i < 6; i++) {
        var ang = i / 6 * TAU;
        var cc = [cL[0] + 0.46 * Math.cos(ang), cL[1] + 0.46 * Math.sin(ang)];
        var lp = [], rp = [];
        for (var t1 = 0; t1 <= NA; t1++) {
          var a1 = t1 / NA * TAU;
          var z1 = [cc[0] + eps * Math.cos(a1), cc[1] + eps * Math.sin(a1)];
          lp.push(toL(z1));
          rp.push(toR(z1));
        }
        lp.push(lp[0]); rp.push(rp[0]);
        VZ.m3wire(ctx, lp, proj, C.cyan, 1.5);
        VZ.m3wire(ctx, rp, proj, C.cyan, 1.5);
        VZ.m3wire(ctx, [toL(cc), toR(cc)], proj, "rgba(79,227,240,.30)", 1, [3, 4]);
      }

      /* ---- 有限大小的图形：金方块及其像 ---- */
      var sq = [], im = [];
      for (var q = 0; q <= 4; q++) {
        var aa = q / 4 * TAU + Math.PI / 4;
        var z = [cL[0] + 0.52 * Math.cos(aa), cL[1] + 0.52 * Math.sin(aa)];
        sq.push(toL(z));
        im.push(toR(z));
      }
      sq.push(sq[0]); im.push(im[0]);
      VZ.m3wire(ctx, sq, proj, C.gold, 2);
      VZ.m3wire(ctx, im, proj, C.gold, 2);

      /* ---- 夹角：两条射线，两边夹角相同 ---- */
      var a1 = 0.55, a2 = 1.32;
      [a1, a2].forEach(function (an) {
        var pL = [cL[0] + 0.92 * Math.cos(an), cL[1] + 0.92 * Math.sin(an)];
        VZ.m3wire(ctx, [toL(cL), toL(pL)], proj, C.mag, 1.8);
        VZ.m3wire(ctx, [toR(cL), toR(pL)], proj, C.mag, 1.8);
      });

      /* ---- 中心点 ---- */
      VZ.m3sphere(ctx, toL(cL), proj, 4.6, C.cyan, C.deep);
      VZ.m3sphere(ctx, toR(cL), proj, 4.6, C.cyan, C.deep);

      /* ---- 标注 ---- */
      ctx.font = "11px -apple-system,PingFang SC,sans-serif";
      ctx.fillStyle = C.cyan;
      var la = proj([cxL, 1.55, 0]);
      ctx.fillText("z 平面", la[0] - 14, la[1] - 4);
      ctx.fillStyle = C.violet;
      var lb = proj([cxR, 1.55, 0]);
      ctx.fillText("w 平面", lb[0] - 14, lb[1] - 4);
      ctx.fillStyle = "rgba(255,255,255,.34)";
      ctx.font = "10.5px -apple-system,PingFang SC,sans-serif";
      ctx.fillText("拖动旋转 · 滚轮缩放", w - 148, 18);
      ctx.fillStyle = C.dim;
      ctx.fillText("青 = 无穷小圆（仍是圆）　金 = 有限图形（走样）　品红 = 夹角（两边相同）", 14, h - 12);
    }

    var ctl = VZ.box(stage, "viz-ctl");
    var pan = VZ.panel(stage, { "映射": "", "局部放大 |f′(c)|": "", "局部旋转 arg f′(c)": "", "无穷小圆": "", "有限图形": "" });
    var say = VZ.note(stage, "");

    VZ.chips(ctl, ["z²（非线性）", "e^z（指数）", "1/z（反演）"], mode, function (k) { mode = k; refresh(); });

    function refresh() {
      api.redraw();
      var d = fDeriv(cL), m = Math.hypot(d[0], d[1]);
      var arg = Math.round(Math.atan2(d[1], d[0]) * 180 / Math.PI);
      VZ.setPanel(pan, {
        "映射": "w = " + mode.replace("（非线性）", "").replace("（指数）", "").replace("（反演）", ""),
        "局部放大 |f′(c)|": m.toFixed(3) + " 倍",
        "局部旋转 arg f′(c)": arg + "°",
        "无穷小圆": "仍是圆（放大 " + m.toFixed(2) + " 倍、转 " + arg + "°）",
        "有限图形": "走样了（被拉伸/压扁）"
      });
      say.innerHTML = "全纯映射在<b>无穷小极限</b>下就是<b>旋转 + 均匀放大</b>：小圆仍是圆，<b>夹角分毫不差</b>。"
        + "<br>但<b>有限大小</b>的图形会走样——金色的方块被拉歪了。<b>共形 = 保角</b>，这就是全纯性的几何刻画。"
        + "<br><b>提示</b>：切到「1/z」再点靠近原点的位置，能看到「无穷小圆仍在、整体被翻到无穷远」的反差。";
    }
    refresh();
  }
},

"f-ch08p": {
  title: "螺旋坡道 ≡ 缺一点的球面：补上那一点，就成了球",
  hint: "拖动<b>旋转视角</b>。左边是 log z 的<b>螺旋坡道</b>——一条盘旋上升的带，绕原点一圈就升一层；右边是它<b>等价</b>的那张球面，上面<b>缺了北极那一点</b>（金色虚线圈）。<span class='hl'>按「补上这一点」，球面就完整了</span>——螺旋坡道与「缺一点的球面」其实是同一张东西。",
  draw: function (stage) {
    var W = 760, H = 400, C = VZ.C, TAU = Math.PI * 2;
    var filled = false;
    var api = VZ.stage3(stage, W, H, paint, { yaw: -0.52, pitch: -0.30, dist: 5.0 });

    function paint(ctx, w, h, fr) {
      var proj = fr.proj;
      ctx.clearRect(0, 0, w, h);

      /* ================= 左：螺旋坡道（窄带螺旋） ================= */
      var cxr = -2.05, R0 = 0.86, R1 = 1.24, HZ = 1.30, NLAY = 3;
      var GAP = 0.55;
      /* 地面 */
      for (var g = -2; g <= 2.0001; g += 0.5) {
        VZ.m3wire(ctx, [[cxr + g * 0.5, -1.5, 0], [cxr + g * 0.5, 1.5, 0]], proj, "rgba(75,67,128,.55)", .7);
        VZ.m3wire(ctx, [[cxr - 1.5, g * 0.5, 0], [cxr + 1.5, g * 0.5, 0]], proj, "rgba(75,67,128,.55)", .7);
      }
      var unit = [];
      for (var u = 0; u <= 72; u++) unit.push([cxr + Math.cos(u / 72 * TAU), Math.sin(u / 72 * TAU), 0]);
      VZ.m3wire(ctx, unit, proj, C.ink2, 1.3);

      /* 螺旋带：沿 θ 升层，带子在半径上有宽度 */
      var NB = 3, NR = 3, quads = [];
      var NT2 = 190;
      for (var i2 = 0; i2 < NT2; i2++) {
        var th = i2 / NT2 * NLAY * TAU, th2 = (i2 + 1) / NT2 * NLAY * TAU;
        var l1 = Math.floor(th / TAU), l2 = Math.floor(th2 / TAU);
        /* 带子在半径方向上周期性收窄 → 显出「螺旋坡道」的踏面 */
        for (var j2 = 0; j2 < NR; j2++) {
          var ra = R0 + (R1 - R0) * j2 / NR, rb = R0 + (R1 - R0) * (j2 + 1) / NR;
          var p1 = [cxr + ra * Math.cos(th), ra * Math.sin(th), l1 * HZ];
          var p2 = [cxr + rb * Math.cos(th), rb * Math.sin(th), l1 * HZ];
          var p3 = [cxr + rb * Math.cos(th2), rb * Math.sin(th2), l2 * HZ];
          var p4 = [cxr + ra * Math.cos(th2), ra * Math.sin(th2), l2 * HZ];
          var q1 = proj(p1), q2 = proj(p2), q3 = proj(p3), q4 = proj(p4);
          var dep = (q1[2] + q2[2] + q3[2] + q4[2]) / 4;
          var hue = 184 + l1 * 30;
          quads.push({ d: dep, pts: [q1, q2, q3, q4], col: "hsl(" + hue + ",68%," + (36 + 13 * (j2 + 1) / NR).toFixed(0) + "%)" });
        }
      }
      quads.sort(function (A, B) { return B.d - A.d; });
      for (var k = 0; k < quads.length; k++) VZ.m3fill(ctx, quads[k].pts, quads[k].col, "rgba(0,0,0,.12)", .35);
      /* 层间竖直连接（螺旋的坡） */
      for (var L = 1; L < NLAY; L++) {
        var aa = L * TAU - (NLAY - 1) * GAP, bb = aa + GAP;
        var ramp = [];
        for (var t = 0; t <= 8; t++) {
          var a3 = aa + (bb - aa) * t / 8;
          ramp.push([cxr + (R0 + R1) / 2 * Math.cos(a3), (R0 + R1) / 2 * Math.sin(a3), L * HZ]);
        }
        VZ.m3wire(ctx, ramp, proj, "hsl(300,62%,62%)", 3.2);
      }
      /* 白线：绕一圈升一层 */
      var spiral = [];
      for (var t4 = 0; t4 <= 160; t4++) {
        var tt = t4 / 160 * NLAY * TAU;
        spiral.push([cxr + (R0 + R1) / 2 * Math.cos(tt - (NLAY - 1) * GAP),
                     (R0 + R1) / 2 * Math.sin(tt - (NLAY - 1) * GAP),
                     Math.floor(tt / TAU) * HZ]);
      }
      VZ.m3wire(ctx, spiral, proj, "rgba(255,255,255,.72)", 1.8);

      /* ================= 右：球面（缺一点 / 补上） ================= */
      var R = 1.22, cxs = 2.10;
      var NT = 30, NP = 28, segs = [];
      for (var i = 0; i < NT; i++) {
        var t1 = i / NT * Math.PI, t2 = (i + 1) / NT * Math.PI;
        for (var j = 0; j < NP; j++) {
          var p1 = j / NP * TAU, p2 = (j + 1) / NP * TAU;
          function sp(tt2, pp) {
            var st = Math.sin(tt2);
            return [cxs + R * st * Math.cos(pp), R * st * Math.sin(pp), R * Math.cos(tt2)];
          }
          if (t1 < 0.16 && !filled) continue;
          var a = sp(t1, p1), b = sp(t2, p1), c2 = sp(t2, p2), d2 = sp(t1, p2);
          var mid = [(a[0] + c2[0]) / 2, (a[1] + c2[1]) / 2, (a[2] + c2[2]) / 2];
          segs.push({ pts: [a, b, c2, d2], z: fr.rot(mid)[2] });
        }
      }
      segs.sort(function (A, B) { return B.z - A.z; });
      for (var s2 = 0; s2 < segs.length; s2++) {
        var near = segs[s2].z < 0;
        VZ.m3wire(ctx, segs[s2].pts, proj, near ? "rgba(201,194,230,.50)" : "rgba(75,67,128,.9)", near ? 1 : .75);
      }
      var eq = [];
      for (var q = 0; q <= 72; q++) { var a4 = q / 72 * TAU; eq.push([cxs + R * Math.cos(a4), R * Math.sin(a4), 0]); }
      VZ.m3wire(ctx, eq, proj, C.ink2, 1.8);

      /* 缺的那一点 / 补上的点 */
      var np = [cxs, 0, R];
      if (!filled) {
        var ring = [];
        for (var k2 = 0; k2 <= 40; k2++) {
          var aa2 = k2 / 40 * TAU, rr = 0.28;
          ring.push([cxs + rr * Math.cos(aa2), rr * Math.sin(aa2), R + 0.02]);
        }
        VZ.m3wire(ctx, ring, proj, C.gold, 2, [4, 3]);
        VZ.m3sphere(ctx, np, proj, 4.4, C.gold, null);
        var lp = proj(np);
        ctx.fillStyle = C.gold;
        ctx.font = "bold 11px -apple-system,PingFang SC,sans-serif";
        ctx.fillText("缺这一点", lp[0] + 9, lp[1] - 6);
      } else {
        VZ.m3sphere(ctx, np, proj, 4.4, C.green, null);
        var lp2 = proj(np);
        ctx.fillStyle = C.green;
        ctx.font = "bold 11px -apple-system,PingFang SC,sans-serif";
        ctx.fillText("补上 → 完整的球面", lp2[0] + 9, lp2[1] - 6);
      }

      /* ================= 标签 ================= */
      ctx.font = "11px -apple-system,PingFang SC,sans-serif";
      var la = proj([cxr, -1.55, 0]);
      ctx.fillStyle = C.cyan;
      ctx.fillText("螺旋坡道（log z）", la[0] - 54, la[1] + 16);
      var lb = proj([cxs, -1.45, 0]);
      ctx.fillStyle = C.violet;
      ctx.fillText("缺一点的球面", lb[0] - 44, lb[1] + 16);
      ctx.fillStyle = "rgba(255,255,255,.34)";
      ctx.font = "10.5px -apple-system,PingFang SC,sans-serif";
      ctx.fillText("拖动旋转 · 滚轮缩放", w - 148, 18);
      ctx.fillStyle = C.dim;
      ctx.fillText("白线：绕原点一圈升一层　品红：层与层之间的坡", 14, h - 12);
    }

    var ctl = VZ.box(stage, "viz-ctl");
    var pan = VZ.panel(stage, { "对象": "", "洞的个数": "", "紧致吗": "", "结论": "" });
    var say = VZ.note(stage, "");

    VZ.btn(ctl, "补上这一点", function () { filled = true; refresh(); });
    VZ.btn(ctl, "挖掉这一点", function () { filled = false; refresh(); });

    function refresh() {
      api.redraw();
      VZ.setPanel(pan, {
        "对象": "螺旋坡道 ≡ 缺一点的球面",
        "洞的个数": filled ? "0 个（已补）" : "1 个（北极那一点）",
        "紧致吗": filled ? "紧致（闭曲面）" : "非紧致",
        "结论": filled ? "补上后与球面同胚" : "log z 的无穷阶支点在无穷远"
      });
      say.innerHTML = "log z 的螺旋坡道由<b>两类补丁交替</b>粘成：(a) 挖掉非负实轴的平面、(b) 挖掉负实轴的平面，一上一下轮流粘。"
        + "<br>绕原点一圈就<b>升一层</b>。这张坡道其实<b>等价于缺了北极一点的球面</b>——原点与无穷远那<b>两个无穷阶支点</b>，"
        + "在紧致化时<b>合并成同一个点</b>，补上它就得到完整的球面。";
    }
    refresh();
  }
},

"f-ch08q": {
  title: "黎曼球 = 两张坐标补丁：z 平面 + w 平面",
  hint: "拖动<b>旋转视角</b>。<b>青色半张</b>是 z 坐标补丁，<b>品红半张</b>是 w 坐标补丁，它们沿赤道粘在一起，拼成整张球面。<span class='hl'>北极只有 z 坐标（那里 w = ∞），南极只有 w 坐标（那里 z = ∞）</span>——两极各缺一块，这两块就是「∞」。",
  draw: function (stage) {
    var W = 760, H = 400, C = VZ.C, TAU = Math.PI * 2;
    var split = 0;               /* 0 = 两补丁并排展示；1 = 合拢成球 */
    var api = VZ.stage3(stage, W, H, paint, { yaw: -0.42, pitch: -0.30, dist: 4.6 });

    function paint(ctx, w, h, fr) {
      var proj = fr.proj;
      ctx.clearRect(0, 0, w, h);
      var e = VZ.ease(split);
      var R = 1.28;

      /* 补丁：z 补丁盖住上半球，w 补丁盖住下半球（各缺一个极冠） */
      function patch(t0, t1, ph0, ph1, col, alpha) {
        var segs = [];
        var NT = 26, NP = 30;
        for (var i = 0; i < NT; i++) {
          var a = t0 + (t1 - t0) * i / NT, b = t0 + (t1 - t0) * (i + 1) / NT;
          for (var j = 0; j < NP; j++) {
            var p1 = ph0 + (ph1 - ph0) * j / NP, p2 = ph0 + (ph1 - ph0) * (j + 1) / NP;
            function sp(t, p) {
              var st = Math.sin(t);
              return [R * st * Math.cos(p), R * st * Math.sin(p), R * Math.cos(t)];
            }
            var A = sp(a, p1), B = sp(b, p1), Cc = sp(b, p2), D = sp(a, p2);
            var mid = [(A[0] + Cc[0]) / 2, (A[1] + Cc[1]) / 2, (A[2] + Cc[2]) / 2];
            segs.push({ pts: [A, B, Cc, D], z: fr.rot(mid)[2], col: col, alpha: alpha });
          }
        }
        segs.sort(function (A, B) { return B.z - A.z; });
        for (var k = 0; k < segs.length; k++) {
          var near = segs[k].z < 0;
          VZ.m3wire(ctx, segs[k].pts, proj,
            near ? segs[k].col : segs[k].col.replace(/[\d.]+\)$/, "0.45)"),
            near ? 1.1 : .8);
        }
      }

      /* 未合拢时：两张补丁左右分开 */
      var off = (1 - e) * 1.75;
      /* z 补丁（上半球 + 略过赤道） */
      patch(0.16, Math.PI / 2 + 0.001, 0, TAU, "rgba(79,227,240," + (0.30 + 0.5 * e) + ")", 1);
      /* w 补丁（下半球） */
      patch(Math.PI / 2 - 0.001, Math.PI - 0.16, 0, TAU, "rgba(255,111,216," + (0.30 + 0.5 * e) + ")", 1);

      /* 赤道（两补丁的接缝） */
      var eq = [];
      for (var q = 0; q <= 80; q++) {
        var aa = q / 80 * TAU;
        eq.push([R * Math.cos(aa), R * Math.sin(aa), 0]);
      }
      VZ.m3wire(ctx, eq, proj, C.ink, 1.6);
      /* 两极 */
      VZ.m3sphere(ctx, [0, 0, R], proj, 4.4, C.cyan, null);
      VZ.m3sphere(ctx, [0, 0, -R], proj, 4.4, C.mag, null);

      /* 标注（引线拉到球外） */
      var nOut = proj([0.55, 0, R + 0.26]), sOut = proj([-0.5, 0, -R - 0.26]);
      VZ.m3wire(ctx, [[0, 0, R], [0.55, 0, R + 0.26]], proj, "rgba(79,227,240,.6)", 1);
      VZ.m3wire(ctx, [[0, 0, -R], [-0.5, 0, -R - 0.26]], proj, "rgba(255,111,216,.6)", 1);
      ctx.font = "bold 11px -apple-system,PingFang SC,sans-serif";
      ctx.fillStyle = C.cyan;
      ctx.fillText("北极：只有 z（w = ∞）", nOut[0] + 7, nOut[1] - 4);
      ctx.fillStyle = C.mag;
      ctx.fillText("南极：只有 w（z = ∞）", sOut[0] - 92, sOut[1] + 14);

      /* 图例 */
      ctx.font = "11px -apple-system,PingFang SC,sans-serif";
      var lx = 14, ly = 22;
      var legend = [
        [C.cyan, "z 坐标补丁（z 平面）"],
        [C.mag, "w 坐标补丁（w = 1/z）"],
        [C.ink, "赤道：两补丁的接缝"]
      ];
      for (var li = 0; li < legend.length; li++) {
        ctx.fillStyle = legend[li][0];
        ctx.fillRect(lx, ly - 8, 9, 9);
        ctx.fillStyle = "rgba(242,236,223,.72)";
        ctx.fillText(legend[li][1], lx + 15, ly);
        ly += 17;
      }
      ctx.fillStyle = "rgba(255,255,255,.34)";
      ctx.font = "10.5px -apple-system,PingFang SC,sans-serif";
      ctx.fillText("拖动旋转 · 滚轮缩放", w - 148, 18);
      ctx.fillStyle = C.dim;
      ctx.fillText(e > 0.5 ? "两片补丁合拢 —— 就是一张完整的球面" : "两片补丁沿赤道粘合的过程", 14, h - 12);
    }

    var ctl = VZ.box(stage, "viz-ctl");
    var pan = VZ.panel(stage, { "两片补丁": "", "接缝": "", "北极 N": "", "南极 S": "", "结构": "" });
    var say = VZ.note(stage, "");

    var sld = VZ.slider(ctl, {
      label: "合拢程度", min: 0, max: 1, step: 0.01, value: 0,
      format: function (v) { return Math.round(v * 100) + "%"; },
      onInput: function (v) { split = v; refresh(); }
    });
    VZ.btn(ctl, "合拢成球", function () { split = 1; sld.set(1); refresh(); });
    VZ.btn(ctl, "分开看", function () { split = 0; sld.set(0); refresh(); });

    function refresh() {
      api.redraw();
      VZ.setPanel(pan, {
        "两片补丁": "z 平面（青） + w 平面（品红）",
        "接缝": "赤道（实轴那条大圆）",
        "北极 N": "只有 z 坐标（w = ∞）",
        "南极 S": "只有 w 坐标（z = ∞）",
        "结构": split > 0.5 ? "已合拢成球面" : "分开的两片"
      });
      say.innerHTML = "在复平面上添一个「∞」是不够的——∞ 附近也要求<b>无缝</b>结构。"
        + "<br>办法是把球面看成<b>两张坐标补丁</b>：一张 z 平面、一张 w 平面，沿<b>赤道</b>粘起来。"
        + "<br>球面上除两极外，每点<b>同时有 z 和 w 两个坐标</b>（由 w = 1/z 相连）；"
        + "<b>北极只有 z</b>（w 是无穷大），<b>南极只有 w</b>（z 是无穷大）。";
    }
    refresh();
  }
},

"f-ch08r": {
  title: "亏格 1 也不够：τ 决定环面的胖瘦",
  hint: "拖动<b>绕行角 τ</b>或直接拖滑块。左边平行四边形（顶点 0、1、1+τ、τ）的<b>对边两两粘合</b>，粘出来就是环面；τ 一变，环面就变样。<span class='hl'>拓扑相同（都是环面、亏格 1），共形却不等价</span>——τ 是亏格 1 唯一的那一个复模。",
  draw: function (stage) {
    var W = 760, H = 400, C = VZ.C, TAU = Math.PI * 2;
    var tau = { re: 0.0, im: 1.0 };
    var api = VZ.stage3(stage, W, H, paint, { yaw: -0.34, pitch: -0.46, dist: 4.9 });

    function paint(ctx, w, h, fr) {
      var proj = fr.proj;
      ctx.clearRect(0, 0, w, h);

      /* ================= 左：平行四边形（z 平面） ================= */
      var cxL = -2.15, S = 1.05;
      var P0 = [cxL, 0, 0];
      var P1 = [cxL + 1 * S, 0, 0];
      var PT = [cxL + tau.re * S, tau.im * S, 0];
      var P2 = [cxL + (1 + tau.re) * S, tau.im * S, 0];
      /* 网格线 */
      var NL = 8;
      for (var i = 1; i < NL; i++) {
        var t = i / NL;
        VZ.m3wire(ctx, [[P0[0] + (P1[0] - P0[0]) * t, P0[1] + (P1[1] - P0[1]) * t, 0],
                       [P2[0] + (PT[0] - P2[0]) * t, P2[1] + (PT[1] - P2[1]) * t, 0]], proj, "rgba(79,227,240,.35)", .8);
        VZ.m3wire(ctx, [[P0[0] + (PT[0] - P0[0]) * t, P0[1] + (PT[1] - P0[1]) * t, 0],
                       [P1[0] + (P2[0] - P1[0]) * t, P1[1] + (P2[1] - P1[1]) * t, 0]], proj, "rgba(79,227,240,.35)", .8);
      }
      /* 边 */
      VZ.m3wire(ctx, [P0, P1], proj, C.cyan, 2.4);
      VZ.m3wire(ctx, [P1, P2], proj, "rgba(255,111,216,.9)", 2.4);
      VZ.m3wire(ctx, [P2, PT], proj, C.cyan, 2.4);
      VZ.m3wire(ctx, [PT, P0], proj, "rgba(255,111,216,.9)", 2.4);
      /* 顶点标签 */
      var lbl = [[P0, "0", 6, 14], [P1, "1", 6, 12], [PT, "τ", 8, -6], [P2, "1+τ", 6, -8]];
      for (var li = 0; li < lbl.length; li++) {
        var q = proj(lbl[li][0]);
        ctx.fillStyle = C.gold;
        ctx.font = "bold 12px -apple-system,PingFang SC,sans-serif";
        ctx.fillText(lbl[li][1], q[0] + lbl[li][2], q[1] + lbl[li][3]);
      }
      /* 粘合标记：写在画面左上角图例区，不压图形 */
      ctx.font = "10.5px -apple-system,PingFang SC,sans-serif";
      ctx.fillStyle = C.cyan;
      ctx.fillText("青色边 ↔ 对边粘合", 14, h - 32);
      ctx.fillStyle = C.mag;
      ctx.fillText("品红边 ↔ 对边粘合", 14, h - 16);

      /* ================= 右：粘成的环面 ================= */
      var cxR = 2.35;
      /* 环面由平行四边形卷起：主半径与管半径由 τ 的实虚部决定 */
      var a = Math.hypot(tau.re, tau.im);
      var ang = Math.atan2(tau.im, tau.re);
      /* τ 越「小」，环面越细长；τ ≈ i 时最圆 */
      var Rr = 0.62 + 0.40 * Math.min(1.6, a);      /* 主半径 */
      var rr = 0.14 + 0.30 * Math.min(1.4, a) * 0.6;/* 管半径 */
      var twist = ang;
      var NU = 60, NV = 22, quads = [];
      for (var i2 = 0; i2 < NU; i2++) {
        var t1 = i2 / NU * TAU, t2 = (i2 + 1) / NU * TAU;
        for (var j = 0; j < NV; j++) {
          var p1 = j / NV * TAU, p2 = (j + 1) / NV * TAU;
          function tp(tt, pp) {
            /* 环面上一点：主圆 + 截面圆；截面按 τ 的方向拉伸 */
            var lx = rr * Math.cos(pp), ly = rr * Math.sin(pp);
            var lz = lx * Math.sin(twist) * 0.55;
            var lxx = lx * Math.cos(twist);
            return [cxR + (Rr + lxx) * Math.cos(tt), (Rr + lxx) * Math.sin(tt), lz + ly * 0.8];
          }
          var A = tp(t1, p1), B = tp(t2, p1), Cc = tp(t2, p2), D = tp(t1, p2);
          var q1 = proj(A), q2 = proj(B), q3 = proj(Cc), q4 = proj(D);
          var dep = (q1[2] + q2[2] + q3[2] + q4[2]) / 4;
          var e1 = [B[0] - A[0], B[1] - A[1], B[2] - A[2]];
          var e2 = [D[0] - A[0], D[1] - A[1], D[2] - A[2]];
          var nx = e1[1] * e2[2] - e1[2] * e2[1], ny = e1[2] * e2[0] - e1[0] * e2[2], nz = e1[0] * e2[1] - e1[1] * e2[0];
          var nl = Math.hypot(nx, ny, nz) || 1;
          var L = [0.34, -0.42, 0.84], Ln = Math.hypot(L[0], L[1], L[2]);
          var dot = (nx * L[0] + ny * L[1] + nz * L[2]) / (nl * Ln);
          var lum = Math.max(0.26, Math.min(0.92, 0.44 + 0.52 * dot));
          quads.push({ d: dep, pts: [q1, q2, q3, q4], lum: lum });
        }
      }
      quads.sort(function (A, B) { return B.d - A.d; });
      for (var k = 0; k < quads.length; k++) {
        var L2 = quads[k].lum;
        VZ.m3fill(ctx, quads[k].pts,
          "rgb(" + Math.round(48 + 190 * L2) + "," + Math.round(40 + 120 * L2) + "," + Math.round(86 + 140 * L2) + ")",
          "rgba(0,0,0,.14)", .4);
      }

      /* 标注 */
      ctx.font = "11px -apple-system,PingFang SC,sans-serif";
      var la = proj([cxL, -1.55, 0]);
      ctx.fillStyle = C.cyan;
      ctx.fillText("平行四边形", la[0] - 34, la[1] + 16);
      var lb = proj([cxR, -1.5, 0]);
      ctx.fillStyle = C.violet;
      ctx.fillText("粘成的环面", lb[0] - 34, lb[1] + 16);
      ctx.fillStyle = "rgba(255,255,255,.34)";
      ctx.font = "10.5px -apple-system,PingFang SC,sans-serif";
      ctx.fillText("拖动旋转 · 滚轮缩放", w - 148, 18);
      ctx.fillStyle = C.dim;
      ctx.fillStyle = C.dim;
      ctx.fillText("τ 是亏格 1 唯一的复模：τ 变了，这张环面就与原来那张不等价", 150, h - 16);
    }

    var ctl = VZ.box(stage, "viz-ctl");
    var pan = VZ.panel(stage, { "τ =": "", "|τ|": "", "arg τ": "", "环面形状": "", "共形等价吗": "" });
    var say = VZ.note(stage, "");

    var sRe = VZ.slider(ctl, {
      label: "Re τ", min: -0.6, max: 1.6, step: 0.05, value: tau.re,
      format: function (v) { return v.toFixed(2); },
      onInput: function (v) { tau.re = v; refresh(); }
    });
    var sIm = VZ.slider(ctl, {
      label: "Im τ（必须 > 0）", min: 0.18, max: 1.8, step: 0.05, value: tau.im,
      format: function (v) { return v.toFixed(2); },
      onInput: function (v) { tau.im = v; refresh(); }
    });
    VZ.btn(ctl, "τ = i（正方）", function () { tau.re = 0; tau.im = 1; sRe.set(0); sIm.set(1); refresh(); });
    VZ.btn(ctl, "τ = 0.15i（细长如绳）", function () { tau.re = 0; tau.im = 0.18; sRe.set(0); sIm.set(0.18); refresh(); });
    VZ.btn(ctl, "τ = 0.5 + 1.2i（斜的）", function () { tau.re = 0.5; tau.im = 1.2; sRe.set(0.5); sIm.set(1.2); refresh(); });

    function refresh() {
      api.redraw();
      var m = Math.hypot(tau.re, tau.im);
      var ar = Math.round(Math.atan2(tau.im, tau.re) * 180 / Math.PI);
      var shapeTxt = m < 0.5 ? "很细长，像一根绳子" : (Math.abs(tau.re) < 0.25 ? "接近正方，最「圆」" : "偏斜的环面");
      VZ.setPanel(pan, {
        "τ =": tau.re.toFixed(2) + " + " + tau.im.toFixed(2) + "i",
        "|τ|": m.toFixed(3),
        "arg τ": ar + "°",
        "环面形状": shapeTxt,
        "共形等价吗": "只有 τ 的离散等价（1+τ、−τ、1/τ）才行"
      });
      say.innerHTML = "亏格只定<b>拓扑</b>，定不住<b>形状</b>。环面（亏格 1）由平行四边形 <b>0、1、1+τ、τ</b> 对边粘合得到——"
        + "<br>τ 取不同值，粘出来就是<b>不同的</b>环面：τ 极小时细长如绳，τ ≈ i 时又胖又圆。<b>它们之间不存在共形等价</b>。"
        + "<br>亏格 1 只有 τ 这<b>一个</b>复模；亏格 2 有三个；亏格 g &gt; 2 时复模个数是 <b>m = 3g − 3</b>。";
    }
    refresh();
  }
}

});
