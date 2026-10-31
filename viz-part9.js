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
        "判定": atZero ? "保角性失效：角翻倍" : (Math.abs(outAng - 60) < 0.5 ? "共形：角一丝不变 ✓" : "过渡中")
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

});
