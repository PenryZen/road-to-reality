/* viz-part2.js — 第二批新图（ch2–ch7，每章 2 张） */
VZ.define({

/* ==========================================================
   第 2 章 · b：毕达哥拉斯面积恒等式（拖顶点）
   ========================================================== */
"f-ch02b": {
  title: "毕达哥拉斯面积恒等式：拖动顶点，两块小面积之和纹丝等于大块",
  hint: "<b>拖动橙色和品红的两个手柄</b>改变两条直角边。看什么：三个正方形的面积数字怎么变。试什么：把三角形拖得又扁又长、再拖成等腰。结论：<span class='hl'>无论形状怎么变，a² + b² 每一次都精确等于 c²</span>——这不是近似，是恒等式，所以它能当几何的地基。",
  draw: function (stage) {
    var W = 760, H = 430, svg = VZ.S(stage, W, H, { grid: true });
    var C = VZ.C;
    var OX = 360, OY = 180;
    var AMAX = 175, BMAX = 175, SUMMAX = 235, MINT = 50;
    var a = 130, b = 105;

    var out = VZ.panel(stage, { "直角边 a": "", "直角边 b": "", "斜边 c": "", "a² + b²": "", "c²": "", "验证": "" });

    var sqA = VZ.g(svg), sqB = VZ.g(svg), sqC = VZ.g(svg), triG = VZ.g(svg), lbl = VZ.g(svg);
    var rA = VZ.el("rect", { fill: C.cyan, "fill-opacity": .13, stroke: C.cyan, "stroke-width": 1.6 }, sqA);
    var rB = VZ.el("rect", { fill: C.mag, "fill-opacity": .13, stroke: C.mag, "stroke-width": 1.6 }, sqB);
    var pC = VZ.el("path", { fill: C.gold, "fill-opacity": .13, stroke: C.gold, "stroke-width": 1.6 }, sqC);
    var tri = VZ.el("path", { fill: "rgba(255,255,255,.05)", stroke: C.ink, "stroke-width": 2.2 }, triG);
    var raMark = VZ.el("path", { fill: "none", stroke: C.ink2, "stroke-width": 1.2 }, triG);

    var hA = VZ.circ(svg, 0, 0, 9, { fill: C.deep, stroke: C.cyan, "stroke-width": 2.4, style: "cursor:grab" });
    var hB = VZ.circ(svg, 0, 0, 9, { fill: C.deep, stroke: C.mag, "stroke-width": 2.4, style: "cursor:grab" });
    var hitA = VZ.circ(svg, 0, 0, 22, { fill: "rgba(0,0,0,0)", style: "cursor:grab" });
    var hitB = VZ.circ(svg, 0, 0, 22, { fill: "rgba(0,0,0,0)", style: "cursor:grab" });

    var tA2 = VZ.txt(lbl, 0, 0, "", { size: 13, fill: C.cyan, anchor: "middle", weight: 700 });
    var tB2 = VZ.txt(lbl, 0, 0, "", { size: 13, fill: C.mag, anchor: "middle", weight: 700 });
    var tC2 = VZ.txt(lbl, 0, 0, "", { size: 14, fill: C.gold, anchor: "middle", weight: 700 });
    var tA = VZ.txt(lbl, 0, 0, "a", { size: 12, fill: C.cyan, anchor: "middle" });
    var tB = VZ.txt(lbl, 0, 0, "b", { size: 12, fill: C.mag, anchor: "middle" });
    var tC = VZ.txt(lbl, 0, 0, "c", { size: 12, fill: C.gold, anchor: "middle" });

    function redraw() {
      var Ax = OX + a, Ay = OY, Bx = OX, By = OY + b;
      rA.setAttribute("x", OX); rA.setAttribute("y", OY - a);
      rA.setAttribute("width", a); rA.setAttribute("height", a);
      rB.setAttribute("x", OX - b); rB.setAttribute("y", OY);
      rB.setAttribute("width", b); rB.setAttribute("height", b);
      var c = Math.sqrt(a * a + b * b);
      pC.setAttribute("d", "M" + Ax + " " + Ay + "L" + Bx + " " + By +
        "L" + (Bx + b) + " " + (By + a) + "L" + (Ax + b) + " " + (Ay + a) + "Z");
      tri.setAttribute("d", "M" + OX + " " + OY + "L" + Ax + " " + Ay + "L" + Bx + " " + By + "Z");
      raMark.setAttribute("d", "M" + (OX + 14) + " " + OY + "L" + (OX + 14) + " " + (OY + 14) + "L" + OX + " " + (OY + 14));
      hA.setAttribute("cx", Ax); hA.setAttribute("cy", Ay);
      hB.setAttribute("cx", Bx); hB.setAttribute("cy", By);
      hitA.setAttribute("cx", Ax); hitA.setAttribute("cy", Ay);
      hitB.setAttribute("cx", Bx); hitB.setAttribute("cy", By);
      tA2.setAttribute("x", OX + a / 2); tA2.setAttribute("y", OY - a / 2 + 5);
      tA2.textContent = "a² = " + (a * a);
      tB2.setAttribute("x", OX - b / 2); tB2.setAttribute("y", OY + b / 2 + 5);
      tB2.textContent = "b² = " + (b * b);
      tC2.setAttribute("x", OX + (a + b) / 2); tC2.setAttribute("y", OY + (a + b) / 2 + 5);
      tC2.textContent = "c² = " + Math.round(c * c);
      tA.setAttribute("x", OX + a / 2); tA.setAttribute("y", OY + 18);
      tB.setAttribute("x", OX - 14); tB.setAttribute("y", OY + b / 2 + 4);
      var mx = OX + a / 2 + (b / c) * 20, my = OY + b / 2 + (a / c) * 20;
      tC.setAttribute("x", mx); tC.setAttribute("y", my + 4);
      VZ.setPanel(out, {
        "直角边 a": a + " px",
        "直角边 b": b + " px",
        "斜边 c": c.toFixed(2),
        "a² + b²": (a * a + b * b).toFixed(0),
        "c²": (c * c).toFixed(0),
        "验证": "相等 ✓（分毫不差）"
      });
    }
    redraw();

    VZ.drag(svg, hitA, W, H, function (x, y, ph) {
      if (ph === "start" || ph === "move") {
        a = VZ.clamp(Math.round(x - OX), MINT, AMAX);
        if (a + b > SUMMAX) a = SUMMAX - b;
        redraw();
      }
    });
    VZ.drag(svg, hitB, W, H, function (x, y, ph) {
      if (ph === "start" || ph === "move") {
        b = VZ.clamp(Math.round(y - OY), MINT, BMAX);
        if (a + b > SUMMAX) b = SUMMAX - a;
        redraw();
      }
    });
    var runDot = VZ.circ(svg, OX + a / 2, OY + b / 2, 4.5, { fill: C.gold });
    VZ.raf(svg, function (t) {
      var u = (Math.sin(t * 1.4) + 1) / 2;
      runDot.setAttribute("cx", OX + a * u);
      runDot.setAttribute("cy", OY + b * u);
      runDot.setAttribute("opacity", .9);
    });
    VZ.legend(stage, [["a²（蓝）", C.cyan], ["b²（品红）", C.mag], ["c²（金）", C.gold]]);
  }
},

/* ==========================================================
   第 2 章 · c：庞加莱圆盘测地线（拖两点）
   ========================================================== */
"f-ch02c": {
  title: "庞加莱圆盘：圆盘里的「直线」长什么样",
  hint: "<b>拖动 P 和 Q 两个点</b>，青色曲线是这个世界里的「直线」（测地线），紫色虚线是我们 outsiders 眼中的欧氏直线段。试着把两点都拖到圆盘边缘附近、朝同一个方向——看青色弧如何<span class='hl'>鼓向圆心</span>。读数里双曲距离远大于欧氏距离：越靠近边缘，每一步「实际」走过的路越长，所以边缘永远走不到。",
  draw: function (stage) {
    var W = 760, H = 380, svg = VZ.S(stage, W, H, { grid: true });
    var C = VZ.C;
    var CX = 250, CY = 190, R = 150;
    /* geoArc / hyperDist 假定圆盘以原点为中心：传入局部坐标，
       得到的路径 d 再手动加 (CX,CY) 偏移（getBBox 检查不认分组 transform） */
    function geoD(p1, p2) {
      var g = VZ.geoArc(p1, p2, R);
      var n = g.d.match(/-?\d+\.?\d*(?:e-?\d+)?/g).map(Number);
      if (g.straight) return "M" + (n[0] + CX) + " " + (n[1] + CY) + "L" + (n[2] + CX) + " " + (n[3] + CY);
      return "M" + (n[0] + CX) + " " + (n[1] + CY) + "A" + n[2] + " " + n[3] + " 0 " + n[5] + " " + n[6] + " " + (n[7] + CX) + " " + (n[8] + CY);
    }
    function sx(p) { return [CX + p[0], CY + p[1]]; }

    VZ.circ(svg, CX, CY, R, { fill: "rgba(28,20,64,.5)", stroke: C.ink2, "stroke-width": 1.8 });
    /* 背景测地线网：都过边界、与边界正交（避开对径点对） */
    [[15, 140], [75, 200], [140, 265], [210, 335], [290, 45]].forEach(function (pr) {
      var a1 = pr[0] * Math.PI / 180, a2 = pr[1] * Math.PI / 180;
      var d = geoD([R * Math.cos(a1), R * Math.sin(a1)], [R * Math.cos(a2), R * Math.sin(a2)]);
      VZ.path(svg, d, VZ.stroke({ stroke: C.faint, "stroke-width": 1, opacity: .6 }));
    });
    VZ.txt(svg, CX, CY - R - 12, "边界 = 「无穷远」", { size: 12, fill: C.dim, anchor: "middle" });
    VZ.circ(svg, CX, CY, 2.5, { fill: C.dim });

    var P = [-72, -38], Q = [64, 66];
    var geo = VZ.path(svg, "", VZ.stroke({ stroke: C.cyan, "stroke-width": 2.4 }));
    var chord = VZ.path(svg, "", VZ.stroke({ stroke: C.violet, "stroke-width": 1.4, "stroke-dasharray": "6 5", opacity: .85 }));
    var runner = VZ.circ(svg, CX + (P[0] + Q[0]) / 2, CY + (P[1] + Q[1]) / 2, 5.5, { fill: C.gold });

    function mkHandle(pt, col, name) {
      var s0 = sx(pt);
      var vis = VZ.circ(svg, s0[0], s0[1], 7.5, { fill: C.deep, stroke: col, "stroke-width": 2.4 });
      var lb = VZ.txt(svg, s0[0] + 13, s0[1] - 10, name, { size: 13, fill: col, weight: 700 });
      var hit = VZ.circ(svg, s0[0], s0[1], 22, { fill: "rgba(0,0,0,0)" });
      return { vis: vis, lb: lb, hit: hit };
    }
    var hP = mkHandle(P, C.cyan, "P"), hQ = mkHandle(Q, C.green, "Q");

    var out = VZ.panel(stage, { "欧氏距离 |PQ|": "", "双曲距离 d(P,Q)": "", "越靠边缘": "", "说明": "" });

    function clampInside(p) {
      var r = Math.hypot(p[0], p[1]);
      if (r > R - 9) { var s = (R - 9) / r; p = [p[0] * s, p[1] * s]; }
      return p;
    }
    function redraw() {
      P = clampInside(P); Q = clampInside(Q);
      geo.setAttribute("d", geoD(P, Q));
      var sP = sx(P), sQ = sx(Q);
      chord.setAttribute("d", "M" + sP[0] + " " + sP[1] + "L" + sQ[0] + " " + sQ[1]);
      [hP, hQ].forEach(function (h, i) {
        var p = sx(i === 0 ? P : Q);
        h.vis.setAttribute("cx", p[0]); h.vis.setAttribute("cy", p[1]);
        h.lb.setAttribute("x", p[0] + 13); h.lb.setAttribute("y", p[1] - 10);
        h.hit.setAttribute("cx", p[0]); h.hit.setAttribute("cy", p[1]);
      });
      var dE = Math.hypot(P[0] - Q[0], P[1] - Q[1]);
      var dH = VZ.hyperDist(P, Q, R);
      if (!isFinite(dH) || dH > 60) dH = 60;
      VZ.setPanel(out, {
        "欧氏距离 |PQ|": dE.toFixed(1) + " px（" + (dE / R).toFixed(2) + " 个盘半径）",
        "双曲距离 d(P,Q)": dH.toFixed(2),
        "越靠边缘": dE < R * 0.4 ? "靠近圆心：双曲 ≈ 欧氏比例" : "同样的屏幕距离，双曲距离急剧变长",
        "说明": "双曲距离没有上界：边界在有限远处，距离却无穷大"
      });
    }
    redraw();

    VZ.onDragRange(svg, hP.hit, function (x, y) { P = clampInside([x - CX, y - CY]); redraw(); });
    VZ.onDragRange(svg, hQ.hit, function (x, y) { Q = clampInside([x - CX, y - CY]); redraw(); });

    /* 金色小球沿当前测地线往返走：拖动时它实时跟着新路径走 */
    VZ.raf(svg, function (t) {
      var len = 0;
      try { len = geo.getTotalLength(); } catch (e) { return; }
      if (len < 1) return;
      var u = (Math.sin(t * 0.9) + 1) / 2;
      var pt = geo.getPointAtLength(u * len);
      runner.setAttribute("cx", pt.x); runner.setAttribute("cy", pt.y);
    });

    VZ.legend(stage, [["测地线（圆盘的直线）", C.cyan, "line"], ["欧氏直线段（外侧视角）", C.violet, "line"], ["沿线行走的光点", C.gold]]);
  }
},

/* ==========================================================
   第 3 章 · b：√2 的无理性——逼近它，永远差一点
   ========================================================== */
"f-ch03b": {
  title: "逼近 √2：分数可以靠得无限近，却永远到不了",
  hint: "<b>拖动「分母 n」滑块</b>，看最好的分数逼近 m/n 怎么围着 √2 打转。看什么：上面数轴上青色刻度离金色 √2 有多近；下面散点图里误差一路走低。再盯住 <b>m² − 2n²</b>：它可以等于 1、等于 −1……但<span class='hl'>永远不等于 0</span>——这正是「√2 写不成分数」的算术核心。试试连分数的最佳逼近 1、2、5、12、29、70。",
  draw: function (stage) {
    var W = 760, H = 400, svg = VZ.S(stage, W, H, { grid: true });
    var C = VZ.C;
    var SQRT2 = Math.SQRT2;
    var n = 7;

    var ctl = VZ.box(stage, "viz-ctl");
    var sl = VZ.slider(ctl, {
      label: "分母 n", value: n, min: 1, max: 80, step: 1,
      format: function (v) { return String(v); },
      onInput: function (v) { n = Math.round(v); redraw(); }
    });
    var chips = VZ.box(stage, "viz-ctl");
    VZ.chips(chips, ["最佳逼近 1", "2", "5", "12", "29", "70"], "最佳逼近 1", function (s) {
      var v = parseInt(s.replace(/[^0-9]/g, ""), 10) || 1;
      n = v; sl.set(v); redraw();
    });
    var out = VZ.panel(stage, { "分数 m/n": "", "m": "", "m² − 2n²": "", "|√2 − m/n|": "", "结论": "" });

    /* 数轴（上） */
    var LX = 60, RX = 480, LY = 108;
    var axis = VZ.ln(svg, LX, LY, RX, LY, { stroke: C.ink2, "stroke-width": 1.6 });
    var sqTick = VZ.path(svg, "M0 0", VZ.stroke({ stroke: C.gold, "stroke-width": 2.4 }));
    var sqLbl = VZ.txt(svg, 0, 0, "√2 = 1.41421356…", { size: 12.5, fill: C.gold, anchor: "end" });
    var fracTick = VZ.path(svg, "M0 0", VZ.stroke({ stroke: C.cyan, "stroke-width": 2.4 }));
    var fracLbl = VZ.txt(svg, 0, 0, "", { size: 12.5, fill: C.cyan, anchor: "middle", weight: 700 });
    var errLbl = VZ.txt(svg, 270, LY + 34, "", { size: 12, fill: C.ink2, anchor: "middle" });
    var errBar = VZ.path(svg, "M0 0", VZ.stroke({ stroke: C.red, "stroke-width": 1.6 }));

    /* 误差散点（下） */
    var GX = 60, GY = 210, GW = 640, GH = 150;
    VZ.card(svg, GX, GY, GW, GH, { stroke: C.faint });
    VZ.txt(svg, GX + 12, GY + 20, "每个分母 n 的逼近误差 |√2 − m/n|（对数尺度，越低越好）", { size: 11.5, fill: C.dim });
    var dots = VZ.g(svg);
    var curDot = VZ.circ(svg, 0, 0, 6, { fill: C.gold, stroke: C.deep, "stroke-width": 1.5 });
    var gAxis = VZ.ln(svg, GX + 40, GY + GH - 24, GX + GW - 16, GY + GH - 24, { stroke: C.faint, "stroke-width": 1 });
    VZ.txt(svg, GX + GW - 16, GY + GH - 8, "n = 80", { size: 10.5, fill: C.dim, anchor: "end" });
    VZ.txt(svg, GX + 40, GY + GH - 8, "n = 1", { size: 10.5, fill: C.dim });

    function errOf(k) { return Math.abs(SQRT2 - Math.round(SQRT2 * k) / k); }
    function scatter() {
      dots.innerHTML = "";
      for (var k = 1; k <= 80; k++) {
        var e = errOf(k);
        var ly = Math.log10(Math.max(e, 1e-4));
        var px = GX + 40 + (k - 1) / 79 * (GW - 56);
        var py = GY + GH - 24 - (ly + 3.2) / 3.2 * (GH - 58);
        VZ.circ(dots, px, py, 2.4, { fill: k === n ? C.gold : C.dim, opacity: k === n ? 1 : .75 });
      }
    }
    function redraw() {
      var m = Math.round(SQRT2 * n);
      var v = m / n, err = Math.abs(SQRT2 - v);
      var half = Math.max(0.0045, err * 1.45);
      var x0 = LX, x1 = RX;
      function px(val) { return x0 + (val - (SQRT2 - half)) / (2 * half) * (x1 - x0); }
      var xsq = px(SQRT2), xfr = px(v);
      sqTick.setAttribute("d", "M" + xsq + " " + (LY - 13) + "L" + xsq + " " + (LY + 13));
      sqLbl.setAttribute("x", Math.min(xsq - 10, RX)); sqLbl.setAttribute("y", LY - 44);
      fracTick.setAttribute("d", "M" + xfr + " " + (LY - 9) + "L" + xfr + " " + (LY + 9));
      fracLbl.setAttribute("x", VZ.clamp(xfr, LX + 40, RX - 40)); fracLbl.setAttribute("y", LY + 32);
      fracLbl.textContent = m + "/" + n + " = " + v.toFixed(6);
      var y1 = LY - 16, y2 = LY + 16, xa = Math.min(xsq, xfr), xb = Math.max(xsq, xfr);
      if (xb - xa < 2) { xa = xsq - 1; xb = xsq + 1; }
      errBar.setAttribute("d", "M" + xa + " " + y1 + "L" + xa + " " + y2 + "M" + xb + " " + y1 + "L" + xb + " " + y2 + "M" + xa + " " + (y1 + y2) / 2 + "L" + xb + " " + (y1 + y2) / 2);
      errLbl.setAttribute("y", LY - 24);
      errLbl.setAttribute("x", (xa + xb) / 2);
      errLbl.setAttribute("text-anchor", "middle");
      errLbl.textContent = "相差 " + err.toFixed(6);
      var D = m * m - 2 * n * n;
      scatter();
      curDot.setAttribute("cx", GX + 40 + (n - 1) / 79 * (GW - 56));
      var ly2 = Math.log10(Math.max(err, 1e-4));
      curDot.setAttribute("cy", GY + GH - 24 - (ly2 + 3.2) / 3.2 * (GH - 58));
      VZ.setPanel(out, {
        "分数 m/n": m + " / " + n + " = " + v.toFixed(6),
        "m": m + "（m² = " + m * m + "）",
        "m² − 2n²": D + (D === 0 ? "" : "  ≠ 0"),
        "|√2 − m/n|": err.toExponential(3),
        "结论": D === 0 ? "不可能发生" : "靠得更近了，但 m² 仍不是 2n²"
      });
    }
    redraw();

    /* 金色 √2 刻度轻微脉动 */
    VZ.raf(svg, function (t) {
      sqTick.setAttribute("opacity", .72 + .28 * Math.sin(t * 2.2));
    });
  }
},

/* ==========================================================
   第 3 章 · c：戴德金分割——在数轴上切一刀
   ========================================================== */
"f-ch03c": {
  title: "戴德金分割：这一刀切在数上，还是切在空隙上",
  hint: "<b>拖动数轴上的分割点</b>（或点「跳到 √2」）。蓝色是左集 A，金色是右集 B，小圆点是分母不超过 8 的有理数。看结论一栏：<span class='hl'>刀口落在有理数上，A 就有个最大元——这刀没带来新东西；刀口落在空隙里，A、B 两边都没有端点——这个分割本身就是一个新数</span>。实数就是这么造出来的：不需要「无穷小数」的直觉，只需要集合。",
  draw: function (stage) {
    var W = 760, H = 330, svg = VZ.S(stage, W, H, { grid: true });
    var C = VZ.C;
    var X0 = 50, X1 = 710, VMIN = 0, VMAX = 3, LY = 140;
    function vx(v) { return X0 + (v - VMIN) / (VMAX - VMIN) * (X1 - X0); }
    function xv(x) { return VMIN + (x - X0) / (X1 - X0) * (VMAX - VMIN); }

    var alpha = 1.4142135623730951;
    var snapped = false, snapAt = 0;

    var segA = VZ.ln(svg, X0, LY, X1, LY, { stroke: C.cyan, "stroke-width": 4, opacity: .8 });
    var segB = VZ.ln(svg, X0, LY, X1, LY, { stroke: C.gold, "stroke-width": 4, opacity: .8 });
    /* 刻度 */
    for (var k = 0; k <= 3; k++) {
      VZ.ln(svg, vx(k), LY - 6, vx(k), LY + 6, { stroke: C.ink2, "stroke-width": 1.2 });
      VZ.txt(svg, vx(k), LY + 24, String(k), { size: 11, fill: C.dim, anchor: "middle" });
    }
    /* 有理数样本：分母 8 */
    var ratG = VZ.g(svg);
    var ratVals = [];
    for (var j = 1; j < 24; j++) ratVals.push(j / 8);
    var cutLine = VZ.ln(svg, 0, LY - 46, 0, LY + 46, { stroke: C.red, "stroke-width": 2 });
    var handle = VZ.circ(svg, 0, LY, 10, { fill: C.deep, stroke: C.red, "stroke-width": 2.6, style: "cursor:grab" });
    var hit = VZ.circ(svg, 0, LY, 30, { fill: "rgba(0,0,0,0)", style: "cursor:grab" });
    var cutLbl = VZ.txt(svg, 0, LY - 56, "", { size: 12.5, fill: C.red, anchor: "middle", weight: 700 });
    var lblA = VZ.txt(svg, 0, LY - 30, "A = { x : x < α }", { size: 12.5, fill: C.cyan, anchor: "end" });
    var lblB = VZ.txt(svg, 0, LY + 44, "B = { x : x > α }", { size: 12.5, fill: C.gold });

    var out = VZ.panel(stage, { "分割点 α": "", "A（左集）": "", "B（右集）": "", "A 的最大元": "", "B 的最小元": "", "结论": "" });

    function redraw() {
      /* 吸附：0.035 内视为切在有理数上 */
      snapped = false; snapAt = 0;
      for (var i = 0; i < ratVals.length; i++) {
        if (Math.abs(alpha - ratVals[i]) < 0.035) { snapped = true; snapAt = ratVals[i]; alpha = snapAt; break; }
      }
      var xc = vx(alpha);
      segA.setAttribute("x2", xc);
      segB.setAttribute("x1", xc);
      cutLine.setAttribute("x1", xc); cutLine.setAttribute("x2", xc);
      handle.setAttribute("cx", xc);
      hit.setAttribute("cx", xc);
      cutLbl.setAttribute("x", VZ.clamp(xc, X0 + 70, X1 - 70));
      cutLbl.textContent = snapped ? ("α = " + snapAt + "（有理数）") : "α = " + alpha.toFixed(6) + "…（空隙）";
      lblA.setAttribute("x", Math.max(xc - 12, X0 + 130));
      lblB.setAttribute("x", xc + 12);
      ratG.innerHTML = "";
      ratVals.forEach(function (r) {
        var onLeft = r < alpha - 1e-9;
        VZ.circ(ratG, vx(r), LY, 3.6, { fill: onLeft ? C.cyan : C.gold, stroke: C.deep, "stroke-width": .8 });
      });
      var isSqrt2 = !snapped && Math.abs(alpha - Math.SQRT2) < 1e-9;
      VZ.setPanel(out, {
        "分割点 α": snapped ? String(snapAt) : (isSqrt2 ? "√2 = 1.41421356…" : alpha.toFixed(6) + "…"),
        "A（左集）": "{ x : x < α }",
        "B（右集）": "{ x : x > α }",
        "A 的最大元": snapped ? String(snapAt) : "不存在",
        "B 的最小元": snapped ? String(snapAt) : "不存在",
        "结论": snapped
          ? "切在老数上：两边有端点，没有产生新东西"
          : "两边都没有端点 → 这个分割定义了一个新数（无理数）"
      });
    }
    redraw();

    VZ.onDragRange(svg, hit, function (x) {
      alpha = VZ.clamp(xv(x), 0.08, 2.92);
      redraw();
    });
    var row = VZ.box(stage, "viz-ctl");
    VZ.btn(row, "跳到 √2", function () { alpha = Math.SQRT2; redraw(); });
    VZ.btn(row, "跳到 3/2", function () { alpha = 1.5; redraw(); });
    VZ.btn(row, "跳到 0.618…", function () { alpha = (Math.sqrt(5) - 1) / 2; redraw(); });

    /* 刀口脉动 */
    VZ.raf(svg, function (t) {
      handle.setAttribute("r", 9 + 1.6 * Math.sin(t * 3));
    });
  }
},

/* ==========================================================
   第 4 章 · b：幂级数与收敛半径（拖 z，看两种命运）
   ========================================================== */
"f-ch04b": {
  title: "收敛半径：拖动 z，跨过 |z|=1 的那一刻级数变脸",
  hint: "<b>拖动左图的 z 点</b>，右图实时画出部分和 S₀ → S₁ → S₂ → … 的行走轨迹。|z| &lt; 1 时轨迹是一条盘向真值 1/(1−z) 的收敛螺线；一旦把 z 拖出金色收敛圆，轨迹立刻<span class='hl'>甩出发散</span>。看什么：失效点和函数本身的毛病毫无关系——1/(1−z) 在实轴上处处正常，真正的「病灶」是复平面里 z=1 这个奇点，它规定了收敛半径 = 1。",
  draw: function (stage) {
    var W = 760, H = 390, svg = VZ.S(stage, W, H, { grid: true });
    var C = VZ.C;
    var LX = 195, LY = 195, U = 105;
    var RX = 565, RY = 195, RU = 52;

    function zPt(z) { return [LX + z[0] * U, LY - z[1] * U]; }
    function sPt(z) { return [RX + z[0] * RU, RY - z[1] * RU]; }

    /* 左：z 平面 */
    VZ.ln(svg, LX - 165, LY, LX + 165, LY, { stroke: C.faint, "stroke-width": 1 });
    VZ.ln(svg, LX, LY - 165, LX, LY + 165, { stroke: C.faint, "stroke-width": 1 });
    VZ.circ(svg, LX, LY, U, { stroke: C.gold, "stroke-width": 1.6, "stroke-dasharray": "6 5" });
    VZ.txt(svg, LX - 8, LY - U - 8, "收敛圆 |z| = 1", { size: 11.5, fill: C.gold, anchor: "end" });
    VZ.txt(svg, LX + U + 8, LY + 16, "奇点 z = 1", { size: 11.5, fill: C.red });
    VZ.circ(svg, LX + U, LY, 5.5, { fill: C.red });
    VZ.txt(svg, LX - 150, LY + 150, "拖我", { size: 10.5, fill: C.dim });
    VZ.txt(svg, LX + 150, LY - 152, "z 平面", { size: 11, fill: C.dim, anchor: "end" });

    /* 右：部分和轨道 */
    VZ.ln(svg, RX - 168, RY, RX + 168, RY, { stroke: C.faint, "stroke-width": 1 });
    VZ.ln(svg, RX, RY - 168, RX, RY + 168, { stroke: C.faint, "stroke-width": 1 });
    VZ.txt(svg, RX + 160, RY - 152, "部分和 Sₙ", { size: 11, fill: C.dim, anchor: "end" });

    var orbit = VZ.path(svg, "", VZ.stroke({ stroke: C.cyan, "stroke-width": 1.9 }));
    var dotsG = VZ.g(svg);
    var truthM = VZ.circ(svg, 0, 0, 6, { fill: C.green, stroke: C.deep, "stroke-width": 1.4 });
    var truthL = VZ.txt(svg, 0, 0, "", { size: 11.5, fill: C.green, anchor: "start" });
    var zMark = VZ.circ(svg, 0, 0, 8, { fill: C.deep, stroke: C.cyan, "stroke-width": 2.4, style: "cursor:grab" });
    var zHit = VZ.circ(svg, 0, 0, 26, { fill: "rgba(0,0,0,0)", style: "cursor:grab" });

    var out = VZ.panel(stage, { "z": "", "|z|": "", "状态": "", "S₂₈ ≈": "", "真值 1/(1−z)": "" });

    var z = [0.62, 0.45];
    function redraw() {
      var r = Math.hypot(z[0], z[1]);
      var inside = r < 0.999;
      var p = zPt(z);
      zMark.setAttribute("cx", p[0]); zMark.setAttribute("cy", p[1]);
      zHit.setAttribute("cx", p[0]); zHit.setAttribute("cy", p[1]);
      dotsG.innerHTML = "";
      var sx = 0, sy = 0, d = "M" + sPt([0, 0])[0] + " " + sPt([0, 0])[1];
      var cur = [1, 0], flew = false;
      for (var k = 1; k <= 28; k++) {
        var nv = [cur[0] * z[0] - cur[1] * z[1], cur[0] * z[1] + cur[1] * z[0]];
        cur = nv;
        sx += cur[0]; sy += cur[1];
        var sp = sPt([sx, sy]);
        if (Math.abs(sp[0] - RX) > 162 || Math.abs(sp[1] - RY) > 162) { flew = true; break; }
        d += "L" + sp[0].toFixed(1) + " " + sp[1].toFixed(1);
        VZ.circ(dotsG, sp[0], sp[1], 2.4, { fill: C.cyan, opacity: .85 });
      }
      orbit.setAttribute("d", d);
      if (inside && Math.abs(1 - z[0]) + Math.abs(z[1]) > 0.05) {
        var den = (1 - z[0]) * (1 - z[0]) + z[1] * z[1];
        var tv = [(1 - z[0]) / den, z[1] / den];
        var tp = sPt(tv);
        if (Math.abs(tp[0] - RX) < 160 && Math.abs(tp[1] - RY) < 160) {
          truthM.setAttribute("cx", tp[0]); truthM.setAttribute("cy", tp[1]);
          truthM.setAttribute("opacity", 1);
          truthL.setAttribute("x", tp[0] + 9); truthL.setAttribute("y", tp[1] + 4);
          truthL.setAttribute("opacity", 1);
        } else { truthM.setAttribute("opacity", 0); truthL.setAttribute("opacity", 0); }
      } else { truthM.setAttribute("opacity", 0); truthL.setAttribute("opacity", 0); }
      var s28 = "（轨迹甩出画面）";
      if (!flew) s28 = sx.toFixed(3) + (sy >= 0 ? " + " : " − ") + Math.abs(sy).toFixed(3) + "i";
      VZ.setPanel(out, {
        "z": z[0].toFixed(3) + (z[1] >= 0 ? " + " : " − ") + Math.abs(z[1]).toFixed(3) + "i",
        "|z|": r.toFixed(3),
        "状态": inside ? "收敛（收敛圆内）" : "发散（越过收敛圆）",
        "S₂₈ ≈": s28,
        "真值 1/(1−z)": inside ? "见绿点" : "级数已失效"
      });
      orbit.setAttribute("stroke", inside ? C.cyan : C.red);
    }
    redraw();

    VZ.onDragRange(svg, zHit, function (x, y) {
      var dx = (x - LX) / U, dy = -(y - LY) / U;
      var r = Math.hypot(dx, dy);
      if (r > 1.5) { dx *= 1.5 / r; dy *= 1.5 / r; }
      z = [dx, dy];
      redraw();
    });
    VZ.legend(stage, [["部分和轨道 S₀→S₂₈", C.cyan, "line"], ["收敛圆 |z|=1", C.gold, "line"], ["奇点 z=1", C.red], ["真值 1/(1−z)", C.green]]);
  }
},

/* ==========================================================
   第 4 章 · c：曼德博集合（canvas 渲染 + 点击放大）
   ========================================================== */
"f-ch04c": {
  title: "曼德博集合：一条规则 z → z² + c，点击放大边界",
  hint: "<b>点击画面任意位置</b>，视野平滑放大到那里，迭代精度自动加深。看什么：放大多少倍，边界依然细节无穷——自相似、处处不光滑。这条规则简单到只有一行，却是<span class='hl'>数学上「描述不完」的复杂性的实例</span>：它的边界维数大于 1，没法用有限条公式写尽。点「回到全景」随时重来。",
  draw: function (stage) {
    var W = 760, H = 400;
    /* 逐像素算的图：后备缓冲区压到 ~70 万像素，动画才跟得上手 */
    var cv = VZ.canvas(stage, W, H, { maxPixels: 700000 });
    var ctx = cv.ctx;
    var view = { cx: -0.6, cy: 0, span: 3.0 };
    var iter = 110;
    var zooming = false;
    var out = VZ.panel(stage, { "中心": "", "视野宽度": "", "放大倍数": "", "迭代数": "" });

    var PAL = [[79, 227, 240], [155, 140, 255], [255, 207, 92], [255, 111, 216], [79, 227, 240]];
    function escapeAt(x, y, it) {
      var zr = 0, zi = 0, i = 0;
      for (; i < it; i++) {
        var t = zr * zr - zi * zi + x;
        zi = 2 * zr * zi + y; zr = t;
        if (zr * zr + zi * zi > 16) break;
      }
      if (i >= it) return [it, 0, 0];
      var mu = i + 1 - Math.log(Math.log(zr * zr + zi * zi) / 2) / Math.LN2;
      return [i, mu, 1];
    }
    function colorOf(e) {
      if (!e[2]) return [7, 6, 18];
      var u = Math.min(1, e[1] / iter);
      var s = Math.pow(u, 0.45) * 4;
      var k = s % 1, seg = Math.floor(s) % 4;
      var a = PAL[seg], b = PAL[seg + 1];
      /* 远处压暗、贴着边界才发亮：否则整个画框是一片亮紫，跟站点的深空底打架 */
      var g = 0.14 + 0.86 * Math.pow(u, 0.85);
      return [(a[0] + (b[0] - a[0]) * k) * g, (a[1] + (b[1] - a[1]) * k) * g, (a[2] + (b[2] - a[2]) * k) * g];
    }
    /* putImageData 不认 ctx 的缩放变换，写的是后备缓冲区的真实像素：
       循环用 bw/bh（设备像素），坐标换算回 CSS 尺寸 cv.w / cv.h。
       用 cv.w 建图的话，retina 上只填满左上角 1/4。 */
    function paint(step) {
      var W2 = cv.bw, H2 = cv.bh, d = cv.dpr;
      var scale = view.span / cv.w;
      var k = step * Math.max(1, Math.round(d));
      var img = ctx.createImageData(W2, H2);
      var data = img.data;
      for (var py = 0; py < H2; py += k) {
        for (var px = 0; px < W2; px += k) {
          var x = view.cx + (px / d - cv.w / 2) * scale;
          var y = view.cy + (py / d - cv.h / 2) * scale;
          var col = colorOf(escapeAt(x, y, iter));
          for (var dy = 0; dy < k && py + dy < H2; dy++) {
            for (var dx = 0; dx < k && px + dx < W2; dx++) {
              var o = ((py + dy) * W2 + (px + dx)) * 4;
              data[o] = col[0]; data[o + 1] = col[1]; data[o + 2] = col[2]; data[o + 3] = 255;
            }
          }
        }
      }
      ctx.putImageData(img, 0, 0);
    }
    function info() {
      VZ.setPanel(out, {
        "中心": view.cx.toFixed(5) + " + " + view.cy.toFixed(5) + "i",
        "视野宽度": view.span.toFixed(5),
        "放大倍数": (3.0 / view.span).toFixed(1) + "×",
        "迭代数": String(iter)
      });
    }
    function full() { paint(4); paint(2); paint(1); info(); }
    full();

    cv.cv.addEventListener("click", function (e) {
      if (zooming) return;
      var r = cv.cv.getBoundingClientRect();
      var fx = (e.clientX - r.left) / r.width, fy = (e.clientY - r.top) / r.height;
      var tx = view.cx + (fx - 0.5) * view.span;
      var ty = view.cy + (fy - 0.5) * view.span * (cv.h / cv.w);
      zooming = true;
      var s0 = view.span, c0x = view.cx, c0y = view.cy;
      var t0 = null, done = false, stop = null;
      stop = VZ.raf(cv.cv, function (t) {
        if (done) return;
        if (t0 === null) t0 = t;
        var u = VZ.ease(VZ.clamp((t - t0) / 0.9, 0, 1));
        view.cx = c0x + (tx - c0x) * u;
        view.cy = c0y + (ty - c0y) * u;
        view.span = s0 * Math.pow(0.38, u);
        iter = Math.min(420, Math.round(110 * Math.pow(3.0 / view.span, 0.42)));
        paint(4);
        info();
        if (u >= 1) {
          paint(2); paint(1); zooming = false; done = true;
          if (stop) stop();          /* 动画停了就把 rAF 关掉，别每帧空转 */
        }
      });
    });
    var row = VZ.box(stage, "viz-ctl");
    VZ.btn(row, "回到全景", function () { if (!zooming) { view.cx = -0.6; view.cy = 0; view.span = 3.0; iter = 110; full(); } });
    VZ.btn(row, "跳到海马谷", function () {
      if (zooming) return;
      view.cx = -0.743643887037151; view.cy = 0.13182590420533; view.span = 0.0006; iter = 420; full();
    });
  }
},

/* ==========================================================
   第 5 章 · b：复数乘法 = 模相乘、角相加（拖 a、b）
   ========================================================== */
"f-ch05b": {
  title: "复数乘法：模相乘，幅角相加",
  hint: "<b>分别拖动 a（青）和 b（品红）</b>，金色箭头是乘积 a·b。看什么：金色箭头的长度是不是 |a|×|b|，它的角度是不是 a 的角「加上」b 的角。试着把 a、b 都拖到 45° 附近——乘积转到 90°；再让 a·b 落在单位圆外或圆内，体会模的放大与缩小。<span class='hl'>乘法在复平面上 = 旋转 + 伸缩，一条规则两种动作。</span>",
  draw: function (stage) {
    var W = 760, H = 390, svg = VZ.S(stage, W, H, { grid: true });
    var C = VZ.C;
    var OX = 255, OY = 200, U = 58;

    VZ.ln(svg, OX - 175, OY, OX + 175, OY, { stroke: C.faint, "stroke-width": 1 });
    VZ.ln(svg, OX, OY - 175, OX, OY + 175, { stroke: C.faint, "stroke-width": 1 });
    VZ.circ(svg, OX, OY, U, { stroke: C.faint, "stroke-width": .9, "stroke-dasharray": "4 4" });
    VZ.txt(svg, OX + U + 6, OY - 6, "1", { size: 10.5, fill: C.dim });
    VZ.txt(svg, OX + 170, OY - 8, "实轴", { size: 11, fill: C.dim, anchor: "end" });

    function pt(z) { return [OX + z[0] * U, OY - z[1] * U]; }
    /* 极坐标弧：a0 → a1（数学方向，逆时针为正），半径 r */
    function arcD(r, a0, a1) {
      var d = a1 - a0;
      while (d > Math.PI) d -= 2 * Math.PI;
      while (d < -Math.PI) d += 2 * Math.PI;
      if (Math.abs(d) < 0.03) return "";
      var large = Math.abs(d) > Math.PI ? 1 : 0;
      var sweep = d > 0 ? 0 : 1;
      var x1 = OX + r * Math.cos(a0), y1 = OY - r * Math.sin(a0);
      var x2 = OX + r * Math.cos(a1), y2 = OY - r * Math.sin(a1);
      return "M" + x1 + " " + y1 + "A" + r + " " + r + " 0 " + large + " " + sweep + " " + x2 + " " + y2;
    }

    var arA = VZ.path(svg, "", VZ.stroke({ stroke: C.cyan, "stroke-width": 1.4, "stroke-dasharray": "3 4", opacity: .9 }));
    var arB = VZ.path(svg, "", VZ.stroke({ stroke: C.mag, "stroke-width": 1.4, "stroke-dasharray": "3 4", opacity: .9 }));
    var arP = VZ.path(svg, "", VZ.stroke({ stroke: C.gold, "stroke-width": 1.6, opacity: .9 }));
    var lnA = VZ.path(svg, "", VZ.stroke({ stroke: C.cyan, "stroke-width": 2.2 }));
    var lnB = VZ.path(svg, "", VZ.stroke({ stroke: C.mag, "stroke-width": 2.2 }));
    var lnP = VZ.path(svg, "", VZ.stroke({ stroke: C.gold, "stroke-width": 3 }));
    var dA = VZ.circ(svg, 0, 0, 8, { fill: C.deep, stroke: C.cyan, "stroke-width": 2.4, style: "cursor:grab" });
    var dB = VZ.circ(svg, 0, 0, 8, { fill: C.deep, stroke: C.mag, "stroke-width": 2.4, style: "cursor:grab" });
    var dP = VZ.circ(svg, 0, 0, 6, { fill: C.gold, stroke: C.deep, "stroke-width": 1.4 });
    var hA = VZ.circ(svg, 0, 0, 26, { fill: "rgba(0,0,0,0)", style: "cursor:grab" });
    var hB = VZ.circ(svg, 0, 0, 26, { fill: "rgba(0,0,0,0)", style: "cursor:grab" });
    var lA = VZ.txt(svg, 0, 0, "a", { size: 13, fill: C.cyan, weight: 700, anchor: "middle" });
    var lB = VZ.txt(svg, 0, 0, "b", { size: 13, fill: C.mag, weight: 700, anchor: "middle" });
    var lP = VZ.txt(svg, 0, 0, "a·b", { size: 13, fill: C.gold, weight: 700, anchor: "middle" });

    var a = [0.95, 0.55], b = [0.55, 0.85];
    var out = VZ.panel(stage, { "|a|": "", "|b|": "", "|a||b|": "", "|a·b|": "", "arg a + arg b": "", "arg a·b": "" });

    function clampMod(z) {
      var r = Math.hypot(z[0], z[1]);
      if (r < 0.35) { z[0] *= 0.35 / (r || 1); z[1] *= 0.35 / (r || 1); }
      if (r > 1.7) { z[0] *= 1.7 / r; z[1] *= 1.7 / r; }
      return z;
    }
    function redraw() {
      a = clampMod(a); b = clampMod(b);
      var p = [a[0] * b[0] - a[1] * b[1], a[0] * b[1] + a[1] * b[0]];
      var A = a[1] >= 0 ? Math.acos(VZ.clamp(a[0] / Math.hypot(a[0], a[1]), -1, 1)) : -Math.acos(VZ.clamp(a[0] / Math.hypot(a[0], a[1]), -1, 1));
      var B = b[1] >= 0 ? Math.acos(VZ.clamp(b[0] / Math.hypot(b[0], b[1]), -1, 1)) : -Math.acos(VZ.clamp(b[0] / Math.hypot(b[0], b[1]), -1, 1));
      arA.setAttribute("d", arcD(26, 0, A));
      arB.setAttribute("d", arcD(42, 0, B));
      arP.setAttribute("d", arcD(56, 0, A + B));
      var pa = pt(a), pb = pt(b), pp = pt(p);
      lnA.setAttribute("d", "M" + OX + " " + OY + "L" + pa[0] + " " + pa[1]);
      lnB.setAttribute("d", "M" + OX + " " + OY + "L" + pb[0] + " " + pb[1]);
      lnP.setAttribute("d", "M" + OX + " " + OY + "L" + pp[0] + " " + pp[1]);
      dA.setAttribute("cx", pa[0]); dA.setAttribute("cy", pa[1]);
      dB.setAttribute("cx", pb[0]); dB.setAttribute("cy", pb[1]);
      dP.setAttribute("cx", pp[0]); dP.setAttribute("cy", pp[1]);
      hA.setAttribute("cx", pa[0]); hA.setAttribute("cy", pa[1]);
      hB.setAttribute("cx", pb[0]); hB.setAttribute("cy", pb[1]);
      lA.setAttribute("x", pa[0] + (pa[0] > OX ? -16 : 16)); lA.setAttribute("y", pa[1] - 10);
      lB.setAttribute("x", pb[0] + (pb[0] > OX ? -16 : 16)); lB.setAttribute("y", pb[1] - 10);
      lP.setAttribute("x", pp[0] + (pp[0] > OX ? 14 : -14));
      lP.setAttribute("y", pp[1] + 22);
      lP.setAttribute("text-anchor", pp[0] > OX ? "start" : "end");
      var ra = Math.hypot(a[0], a[1]), rb = Math.hypot(b[0], b[1]), rp = Math.hypot(p[0], p[1]);
      var deg = function (x) { return (x * 180 / Math.PI).toFixed(1) + "°"; };
      VZ.setPanel(out, {
        "|a|": ra.toFixed(3), "|b|": rb.toFixed(3),
        "|a||b|": (ra * rb).toFixed(3), "|a·b|": rp.toFixed(3),
        "arg a + arg b": deg(A + B), "arg a·b": deg(Math.atan2(p[1], p[0]))
      });
    }
    redraw();
    VZ.onDragRange(svg, hA, function (x, y) { a = clampMod([(x - OX) / U, -(y - OY) / U]); redraw(); });
    VZ.onDragRange(svg, hB, function (x, y) { b = clampMod([(x - OX) / U, -(y - OY) / U]); redraw(); });
    VZ.legend(stage, [["a", C.cyan], ["b", C.mag], ["a·b（模相乘、角相加）", C.gold]]);
  }
},

/* ==========================================================
   第 5 章 · c：复对数多值——转一圈，螺旋爬一层
   ========================================================== */
"f-ch05c": {
  title: "log 的多值性：每绕支点一圈，值沿螺旋挪一层 2πi",
  hint: "<b>拖动左图单位圆上的 z 点</b>（不拖时它会自己慢慢转）。右图是 log z 的「多层停车场」：横着转一圈，虚部 iθ 竖着爬一层。盯住五个金点——它们是同一个 z 的五个 log 值 <span class='hl'>i(θ + 2πk)，k = −2…2</span>：彼此都差 2πi，永远合不成一个单值。这就是「对数是螺旋楼梯，不是一根柱子」。",
  draw: function (stage) {
    var W = 760, H = 400, svg = VZ.S(stage, W, H, { grid: true });
    var C = VZ.C;
    var CX = 160, CY = 210, R = 105;
    var HX = 545, HY0 = 195, LAYER = 40, AMP = 24, HR = 118;
    var theta = 0.8, dragging = false, spin = true;

    /* 左：单位圆 + 可拖 z */
    VZ.circ(svg, CX, CY, R, { stroke: C.ink2, "stroke-width": 1.6 });
    VZ.ln(svg, CX - R - 22, CY, CX + R + 22, CY, { stroke: C.faint, "stroke-width": 1 });
    VZ.txt(svg, CX + R + 26, CY + 4, "z=1", { size: 10.5, fill: C.dim });
    VZ.circ(svg, CX, CY, 2.5, { fill: C.dim });
    VZ.txt(svg, CX, CY - R - 14, "单位圆上拖动 z（|z|=1，ln|z|=0）", { size: 11.5, fill: C.dim, anchor: "middle" });
    var zDot = VZ.circ(svg, 0, 0, 9, { fill: C.deep, stroke: C.cyan, "stroke-width": 2.6, style: "cursor:grab" });
    var zHit = VZ.circ(svg, 0, 0, 30, { fill: "rgba(0,0,0,0)", style: "cursor:grab" });
    var angArc = VZ.path(svg, "", VZ.stroke({ stroke: C.cyan, "stroke-width": 1.6, opacity: .8 }));

    /* 右：螺旋楼梯 */
    VZ.txt(svg, 20, 24, "log z 的五个值（同一点，五层楼）", { size: 12, fill: C.ink2, anchor: "start" });
    var helixD = "";
    for (var i = 0; i <= 260; i++) {
      var t = -4.3 * Math.PI + i / 260 * (10.6 * Math.PI);
      var x = HX + HR * Math.cos(t);
      var y = HY0 - (t / (2 * Math.PI)) * LAYER + AMP * Math.sin(t);
      helixD += (i ? "L" : "M") + x.toFixed(1) + " " + y.toFixed(1);
    }
    VZ.path(svg, helixD, VZ.stroke({ stroke: C.ink2, "stroke-width": 1.3, opacity: .55 }));
    for (var k = -2; k <= 2; k++) {
      VZ.txt(svg, HX - HR - 12, HY0 - k * LAYER + 4, (k > 0 ? "+" : "") + (k * 2) + "πi", { size: 10.5, fill: C.dim, anchor: "end" });
    }
    var valDots = [], valLbls = [];
    var names = ["i(θ−4π)", "i(θ−2π)", "iθ", "i(θ+2π)", "i(θ+4π)"];
    for (var k2 = -2; k2 <= 2; k2++) {
      valDots.push(VZ.circ(svg, 0, 0, 6, { fill: C.gold, stroke: C.deep, "stroke-width": 1.2 }));
      valLbls.push(VZ.txt(svg, 0, 0, names[k2 + 2], { size: 10.5, fill: C.gold }));
    }
    var out = VZ.panel(stage, { "θ（主值）": "", "log z，k=0": "", "k = −2": "", "k = +2": "", "规律": "" });

    function redraw() {
      var zx = CX + R * Math.cos(theta), zy = CY - R * Math.sin(theta);
      zDot.setAttribute("cx", zx); zDot.setAttribute("cy", zy);
      zHit.setAttribute("cx", zx); zHit.setAttribute("cy", zy);
      angArc.setAttribute("d", theta > 0.04
        ? "M" + (CX + 24) + " " + CY + "A24 24 0 " + (theta > Math.PI ? 1 : 0) + " 0 " + (CX + 24 * Math.cos(theta)) + " " + (CY - 24 * Math.sin(theta))
        : "");
      for (var k = -2; k <= 2; k++) {
        var t = theta + k * 2 * Math.PI;
        var x = HX + HR * Math.cos(t);
        var y = HY0 - (t / (2 * Math.PI)) * LAYER + AMP * Math.sin(t);
        valDots[k + 2].setAttribute("cx", x); valDots[k + 2].setAttribute("cy", y);
        var lb = valLbls[k + 2];
        lb.setAttribute("x", x + (Math.cos(t) > 0.25 ? -12 : 12));
        lb.setAttribute("y", y + 4);
        lb.setAttribute("anchor", Math.cos(t) > 0.25 ? "end" : "start");
      }
      var deg = (theta * 180 / Math.PI).toFixed(1);
      function val(kk) {
        var v = theta + kk * 2 * Math.PI;
        return v >= 0 ? "i × " + v.toFixed(3) : "− i × " + Math.abs(v).toFixed(3);
      }
      VZ.setPanel(out, {
        "θ（主值）": deg + "°",
        "log z，k=0": val(0),
        "k = −2": val(-2),
        "k = +2": val(2),
        "规律": "相邻两层恰好差 2πi"
      });
    }
    redraw();

    VZ.onDragRange(svg, zHit, function (x, y) {
      dragging = true;
      theta = Math.atan2(-(y - CY), x - CX);
      if (theta < 0) theta += 2 * Math.PI;
      redraw();
    });
    var row = VZ.box(stage, "viz-ctl");
    var spinBtn = VZ.btn(row, "自动旋转：开", function () {
      spin = !spin;
      spinBtn.textContent = spin ? "自动旋转：开" : "自动旋转：关";
    });
    VZ.raf(svg, function (t, dt) {
      if (!dragging && spin) {
        theta = (theta + (dt / 1000) * 0.4) % (2 * Math.PI);
        redraw();
      }
      dragging = false;
    });
    VZ.legend(stage, [["z 的位置", C.cyan], ["log z 的五个值", C.gold], ["螺旋：虚部随圈数上升", C.ink2, "line"]]);
  }
},

/* ==========================================================
   第 6 章 · b：割线 → 切线（拖 h 压过去）
   ========================================================== */
"f-ch06b": {
  title: "割线压成切线：瞬时变化率是平均变化率的极限",
  hint: "<b>拖动「间隔 h」滑块</b>（或点「h → 0 动画」），品红点 B 沿曲线滑向青色点 A，割线跟着转动。看什么：右下读数里割线斜率一格一格逼近 f′(a)，差值一路缩到 0。也可以<b>拖动 A 点</b>换位置再试一遍。结论：<span class='hl'>导数不是什么神秘瞬间，而是把「平均」压到极限后剩下的那个确定斜率。</span>",
  draw: function (stage) {
    var W = 760, H = 380, svg = VZ.S(stage, W, H, { grid: true });
    var C = VZ.C;
    function f(x) { return x * x * x / 6 - x + 2; }
    function fp(x) { return x * x / 2 - 1; }
    function px(x) { return 50 + (x + 3.3) * (680 / 7); }
    function py(y) { return 340 - (y + 1) * (300 / 8); }
    function xv(x) { return -3.3 + (x - 50) * (7 / 680); }

    var a = 0.6, h = 1.0;

    /* 曲线 */
    var d = "";
    for (var i = 0; i <= 120; i++) {
      var x = -3.3 + i / 120 * 7;
      d += (i ? "L" : "M") + px(x).toFixed(1) + " " + py(f(x)).toFixed(1);
    }
    VZ.path(svg, d, VZ.stroke({ stroke: C.ink, "stroke-width": 2.2 }));
    VZ.ln(svg, px(-3.3), py(-1), px(3.7), py(-1), { stroke: C.faint, "stroke-width": 1 });
    VZ.txt(svg, px(3.7), py(-1) - 8, "x", { size: 11, fill: C.dim, anchor: "end" });

    /* 线段裁剪到数据框 x∈[−3.35,3.75] y∈[−1.2,7.6] */
    function clipSeg(x1, y1, x2, y2) {
      var XA = -3.35, XB = 3.75, YA = -1.2, YB = 7.6, t0 = 0, t1 = 1;
      var p = [[-(x2 - x1), x1 - XA], [x2 - x1, XB - x1], [-(y2 - y1), y1 - YA], [y2 - y1, YB - y1]];
      for (var q = 0; q < 4; q++) {
        var pp = p[q][0], qq = p[q][1];
        if (pp === 0) { if (qq < 0) return null; continue; }
        var r = qq / pp;
        if (pp < 0) { if (r > t1) return null; if (r > t0) t0 = r; }
        else { if (r < t0) return null; if (r < t1) t1 = r; }
      }
      return [x1 + (x2 - x1) * t0, y1 + (y2 - y1) * t0, x1 + (x2 - x1) * t1, y1 + (y2 - y1) * t1];
    }
    function lineD(x0, y0, slope) {
      var s = clipSeg(x0, y0, x0 + 4, y0 + 4 * slope);
      if (!s) return "";
      return "M" + px(s[0]).toFixed(1) + " " + py(s[1]).toFixed(1) + "L" + px(s[2]).toFixed(1) + " " + py(s[3]).toFixed(1);
    }

    var secD = VZ.path(svg, "", VZ.stroke({ stroke: C.mag, "stroke-width": 2 }));
    var tanD = VZ.path(svg, "", VZ.stroke({ stroke: C.gold, "stroke-width": 1.8, "stroke-dasharray": "7 5" }));
    var pA = VZ.circ(svg, 0, 0, 8, { fill: C.deep, stroke: C.cyan, "stroke-width": 2.6, style: "cursor:grab" });
    var pB = VZ.circ(svg, 0, 0, 7, { fill: C.deep, stroke: C.mag, "stroke-width": 2.4 });
    var hA = VZ.circ(svg, 0, 0, 28, { fill: "rgba(0,0,0,0)", style: "cursor:grab" });
    var lA = VZ.txt(svg, 0, 0, "A", { size: 13, fill: C.cyan, weight: 700, anchor: "middle" });
    var lB = VZ.txt(svg, 0, 0, "B", { size: 13, fill: C.mag, weight: 700, anchor: "middle" });

    var ctl = VZ.box(stage, "viz-ctl");
    var sl = VZ.slider(ctl, {
      label: "间隔 h", value: 1.0, min: 0.02, max: 1.6, step: 0.01,
      format: function (v) { return v.toFixed(2); },
      onInput: function (v) { h = v; anim = false; redraw(); }
    });
    VZ.btn(ctl, "h → 0 动画", function () {
      anim = true; var t0 = null, h0 = Math.max(h, 0.05), dead = false;
      VZ.raf(svg, function (t) {
        if (dead) return;
        if (!anim) { dead = true; return; }
        if (t0 === null) t0 = t;
        var u = VZ.ease(VZ.clamp((t - t0) / 1.2, 0, 1));
        h = h0 * Math.pow(0.02 / h0, u);
        sl.set(h);
        redraw();
        if (u >= 1) { anim = false; dead = true; }
      });
    });
    var out = VZ.panel(stage, { "点 a": "", "间隔 h": "", "割线斜率": "", "f′(a) 切线斜率": "", "差": "" });

    function redraw() {
      var ya = f(a), yb = f(a + h);
      var s = (yb - ya) / h;
      secD.setAttribute("d", lineD(a, ya, s));
      tanD.setAttribute("d", lineD(a, ya, fp(a)));
      pA.setAttribute("cx", px(a)); pA.setAttribute("cy", py(ya));
      pB.setAttribute("cx", px(a + h)); pB.setAttribute("cy", py(yb));
      hA.setAttribute("cx", px(a)); hA.setAttribute("cy", py(ya));
      lA.setAttribute("x", px(a) - 4); lA.setAttribute("y", py(ya) - 14);
      lB.setAttribute("x", px(a + h) + 10); lB.setAttribute("y", py(yb) - 8);
      VZ.setPanel(out, {
        "点 a": a.toFixed(2),
        "间隔 h": h.toFixed(2),
        "割线斜率": s.toFixed(4),
        "f′(a) 切线斜率": fp(a).toFixed(4),
        "差": Math.abs(s - fp(a)).toFixed(4)
      });
    }
    redraw();
    VZ.onDragRange(svg, hA, function (x) {
      a = VZ.clamp(xv(x), -3.1, 3.4);
      if (a + h > 3.6) a = 3.6 - h;
      redraw();
    });
    VZ.legend(stage, [["割线（随 h 变化）", C.mag, "line"], ["切线（目标）", C.gold, "line"], ["点 A（可拖）", C.cyan]]);
  }
},

/* ==========================================================
   第 6 章 · c：光滑性等级 C⁰ / C¹ / C²
   ========================================================== */
"f-ch06c": {
  title: "光滑性是一级一级的：C⁰、C¹、C² 摸起来不一样",
  hint: "<b>用上面的选块切换三条曲线</b>，亮点会自己沿曲线来回走，箭头是它的「速度方向」。看 0 处的检查线：<span class='hl'>C⁰ 在 0 有折角（一阶导数跳 ±0.8）；C¹ 折角磨平了，但二阶导数在 0 两边差一个符号（转弯率突变）；C² 连这个也没有了。</span>每升一级，就多磨平一层「突变」——读数面板里左右极限一目了然。",
  draw: function (stage) {
    var W = 760, H = 400, svg = VZ.S(stage, W, H, { grid: true });
    var C = VZ.C;
    function px(x) { return 80 + (x + 3) * 100; }
    function py(y) { return 330 - (y + 2.2) * 43.75; }

    var FNS = [
      { name: "C⁰ 有折角", f: function (x) { return 0.8 * Math.abs(x); }, f1: function (x) { return x > 0 ? 0.8 : -0.8; }, f2: null, c: C.mag,
        diag: "0 处一阶导数跳变（−0.8 → +0.8）：有折角，不可导" },
      { name: "C¹ 曲率跳", f: function (x) { return 0.35 * x * Math.abs(x); }, f1: function (x) { return 0.7 * Math.abs(x); }, f2: function (x) { return x > 0 ? 0.7 : -0.7; }, c: C.violet,
        diag: "一阶导连续（→ 0），二阶导在 0 两侧 ±0.7 跳变" },
      { name: "C² 光滑", f: function (x) { return x * x * x / 9; }, f1: function (x) { return x * x / 3; }, f2: function (x) { return 2 * x / 3; }, c: C.cyan,
        diag: "二阶导也连续：0 附近没有任何突变" }
    ];
    var sel = 0;

    VZ.ln(svg, 60, py(-2.2), 740, py(-2.2), { stroke: C.faint, "stroke-width": 1 });
    VZ.ln(svg, px(0), 40, px(0), 356, { stroke: C.ink2, "stroke-width": 1, "stroke-dasharray": "5 5" });
    VZ.txt(svg, px(0) + 6, 52, "检查点 x=0", { size: 11, fill: C.ink2 });

    var curvePaths = [], dotTrail = [];
    FNS.forEach(function (F, i) {
      var d = "";
      for (var j = 0; j <= 140; j++) {
        var x = -3 + j / 140 * 6;
        d += (j ? "L" : "M") + px(x).toFixed(1) + " " + py(F.f(x)).toFixed(1);
      }
      curvePaths.push(VZ.path(svg, d, VZ.stroke({ stroke: F.c, "stroke-width": i === 0 ? 2.4 : 1.6, opacity: i === 0 ? 1 : .3 })));
    });
    var tracer = VZ.circ(svg, 0, 0, 7, { fill: C.deep, stroke: C.ink, "stroke-width": 2.4 });
    var arrow = VZ.el("marker", { id: "ar6c", viewBox: "0 0 10 10", refX: 8, refY: 5, markerWidth: 5.5, markerHeight: 5.5, orient: "auto-start-reverse" }, svg.querySelector("defs") || VZ.el("defs", null, svg));
    VZ.el("path", { d: "M0 1L9 5L0 9z", fill: C.gold }, arrow);
    var vel = VZ.path(svg, "", VZ.stroke({ stroke: C.gold, "stroke-width": 2.4 }));

    var chipsBox = VZ.box(stage, "viz-ctl");
    VZ.chips(chipsBox, FNS.map(function (F) { return F.name; }), FNS[0].name, function (nm) {
      sel = FNS.map(function (F) { return F.name; }).indexOf(nm);
      restyle();
    });
    var out = VZ.panel(stage, { "f′ 在 0⁻ / 0⁺": "", "f″ 在 0⁻ / 0⁺": "", "诊断": "" });

    function restyle() {
      FNS.forEach(function (F, i) {
        curvePaths[i].setAttribute("opacity", i === sel ? 1 : .28);
        curvePaths[i].setAttribute("stroke-width", i === sel ? 2.6 : 1.6);
      });
      var F = FNS[sel];
      var l1 = F.f1(-0.001).toFixed(2) + " / " + F.f1(0.001).toFixed(2);
      var l2 = F.f2 ? (F.f2(-0.001).toFixed(2) + " / " + F.f2(0.001).toFixed(2)) : "不存在 / 不存在";
      VZ.setPanel(out, { "f′ 在 0⁻ / 0⁺": l1, "f″ 在 0⁻ / 0⁺": l2, "诊断": F.diag });
      tracer.setAttribute("stroke", F.c);
    }
    restyle();

    VZ.raf(svg, function (t) {
      var u = (Math.sin(t * 0.55) + 1) / 2;
      var x = -3 + 6 * u;
      var F = FNS[sel];
      var y = F.f(x);
      tracer.setAttribute("cx", px(x)); tracer.setAttribute("cy", py(y));
      var m = F.f1(x);
      var ang = Math.atan2(-m * 43.75 / 100, 1);
      var L = 44;
      vel.setAttribute("d", "M" + px(x) + " " + py(y) + "L" + (px(x) + L * Math.cos(ang)) + " " + (py(y) + L * Math.sin(ang)));
    });
  }
},

/* ==========================================================
   第 7 章 · b：围道积分（拖围道，让奇点进进出出）
   ========================================================== */
"f-ch07b": {
  title: "围道积分：奇点在圈里，值就是 2πi；在圈外，就是 0",
  hint: "<b>拖动五个顶点</b>改变闭合围道，积分值是真实数值算出来的（对 1/z 逐段采样求和）。把奇点 z=0 <b>围进圈里</b>：读数跳到 0.000 + 6.283i = 2πi；把它<b>挤到圈外</b>：读数掉回 0。无论围道形状怎么扭，只有「圈里有没有奇点」这一个事实决定结果——<span class='hl'>这就是柯西定理与留数的全部内容。</span>试试「反转方向」，值会变成 −2πi。",
  draw: function (stage) {
    var W = 760, H = 390, svg = VZ.S(stage, W, H, { grid: true });
    var C = VZ.C;
    var CX = 380, CY = 192, U = 64;
    function pt(z) { return [CX + z[0] * U, CY - z[1] * U]; }
    function zv(p) { return [(p[0] - CX) / U, -(p[1] - CY) / U]; }

    VZ.ln(svg, 30, CY, 730, CY, { stroke: C.faint, "stroke-width": 1 });
    VZ.ln(svg, CX, 20, CX, 366, { stroke: C.faint, "stroke-width": 1 });

    var verts = [[1.6, 0], [0.494, 1.522], [-1.294, 0.941], [-1.294, -0.941], [0.494, -1.522]];

    var poly = VZ.el("path", { fill: C.gold, "fill-opacity": .08, stroke: C.ink, "stroke-width": 2.2 }, svg);
    var singPulse = VZ.circ(svg, CX, CY, 8, { fill: C.red, opacity: .35 });
    VZ.circ(svg, CX, CY, 4.5, { fill: C.red });
    VZ.txt(svg, CX + 12, CY - 10, "奇点 z = 0（1/z 的极点）", { size: 11.5, fill: C.red });

    var handles = [], hits = [];
    verts.forEach(function (v, i) {
      handles.push(VZ.circ(svg, 0, 0, 8, { fill: C.deep, stroke: C.cyan, "stroke-width": 2.4, style: "cursor:grab" }));
      hits.push(VZ.circ(svg, 0, 0, 24, { fill: "rgba(0,0,0,0)", style: "cursor:grab" }));
    });

    var out = VZ.panel(stage, { "∮ dz/z ≈": "", "对照": "", "奇点在": "", "结论": "" });

    function clampV(z) {
      var r = Math.hypot(z[0], z[1]);
      if (r < 0.34) { z[0] *= 0.34 / (r || 1); z[1] *= 0.34 / (r || 1); }
      if (r > 3.3) { z[0] *= 3.3 / r; z[1] *= 3.3 / r; }
      return z;
    }
    function integral() {
      var sre = 0, sim = 0;
      for (var i = 0; i < verts.length; i++) {
        var p = verts[i], q = verts[(i + 1) % verts.length];
        var N = 260, dre = q[0] - p[0], dim = q[1] - p[1], dt = 1 / N;
        for (var j = 0; j < N; j++) {
          var t = (j + 0.5) * dt;
          var zre = p[0] + dre * t, zim = p[1] + dim * t;
          var den = zre * zre + zim * zim;
          /* dz / z = (dx + i dy)(x − i y)/|z|² → 实部 (dx·x + dy·y)/|z|²，虚部 (dy·x − dx·y)/|z|² */
          sre += (dre * zre + dim * zim) / den * dt;
          sim += (dim * zre - dre * zim) / den * dt;
        }
      }
      return [sre, sim];
    }
    function redraw() {
      var d = "";
      verts.forEach(function (v, i) {
        var p = pt(v);
        d += (i ? "L" : "M") + p[0].toFixed(1) + " " + p[1].toFixed(1);
      });
      poly.setAttribute("d", d + "Z");
      verts.forEach(function (v, i) {
        var p = pt(v);
        handles[i].setAttribute("cx", p[0]); handles[i].setAttribute("cy", p[1]);
        hits[i].setAttribute("cx", p[0]); hits[i].setAttribute("cy", p[1]);
      });
      var I = integral();
      var inside = Math.abs(I[1]) > Math.PI;
      var vtxt = I[0].toFixed(4) + (I[1] >= 0 ? " + " : " − ") + Math.abs(I[1]).toFixed(4) + "i";
      VZ.setPanel(out, {
        "∮ dz/z ≈": vtxt,
        "对照": inside ? "2πi = 0.0000 + 6.2832i" : "0",
        "奇点在": inside ? "圈 内" : "圈 外",
        "结论": inside ? "只由留数决定：2πi×1" : "全纯区域里绕一圈：颗粒无收"
      });
    }
    redraw();

    verts.forEach(function (v0, i) {
      VZ.onDragRange(svg, hits[i], function (x, y) {
        verts[i] = clampV(zv([x, y]));
        redraw();
      });
    });
    var row = VZ.box(stage, "viz-ctl");
    VZ.btn(row, "反转方向", function () { verts.reverse(); redraw(); });
    VZ.btn(row, "恢复圆形围道", function () {
      verts.length = 0;
      for (var k = 0; k < 5; k++) {
        var ang = k * 2 * Math.PI / 5;
        verts.push([1.6 * Math.cos(ang), 1.6 * Math.sin(ang)]);
      }
      redraw();
    });

    /* 两颗光点沿围道巡行 */
    var runner1 = VZ.circ(svg, 0, 0, 4.5, { fill: C.gold });
    var runner2 = VZ.circ(svg, 0, 0, 4.5, { fill: C.cyan });
    VZ.raf(svg, function (t) {
      var n = verts.length, per = 5.0;
      [runner1, runner2].forEach(function (r, idx) {
        var u = ((t / per + idx * 0.5) % 1) * n;
        var i = Math.floor(u) % n, fseg = u - Math.floor(u);
        var p = verts[i], q = verts[(i + 1) % n];
        r.setAttribute("cx", pt([p[0] + (q[0] - p[0]) * fseg])[0]);
        r.setAttribute("cy", pt([0, p[1] + (q[1] - p[1]) * fseg])[1]);
      });
      singPulse.setAttribute("r", 7 + 2.5 * Math.sin(t * 3));
    });
    VZ.legend(stage, [["围道（拖顶点）", C.ink, "line"], ["奇点 z=0", C.red], ["巡行光点", C.gold]]);
  }
},

/* ==========================================================
   第 7 章 · c：解析延拓——两条路，差一个符号
   ========================================================== */
"f-ch07c": {
  title: "解析延拓 √z：同一个终点，两条路给出相差 −1 的两个值",
  hint: "<b>拖动左图圆周上的终点 z</b>（或点「转到 z=−1」）。从起点 z=1（√z=+1）出发：青路逆时针走，品红路顺时针走，两条路终点相同。但右图 w=√z 平面上，两个终点值<span class='hl'>永远位于单位圆的两端——相差一个 −1</span>。原因：每条路绕支点 z=0 的圈数不同，幅角被除以 2 之后差了 π。多值函数的「分支」，就是这样被路径的历史锁定的。",
  draw: function (stage) {
    var W = 760, H = 390, svg = VZ.S(stage, W, H, { grid: true });
    var C = VZ.C;
    var CX = 270, CY = 195, R = 132;
    var WX = 590, WY = 195, WR = 110;
    var theta = Math.PI;

    /* 左：z 平面 */
    VZ.circ(svg, CX, CY, R, { stroke: C.ink2, "stroke-width": 1.6 });
    VZ.circ(svg, CX, CY, 3, { fill: C.violet });
    VZ.txt(svg, CX + 10, CY + 16, "支点 z=0", { size: 11, fill: C.violet });
    VZ.circ(svg, CX + R, CY, 7, { fill: C.gold, stroke: C.deep, "stroke-width": 1.5 });
    VZ.txt(svg, CX + R - 6, CY - 16, "起点 z=1", { size: 11.5, fill: C.gold, anchor: "end" });

    var pathA = VZ.path(svg, "", VZ.stroke({ stroke: C.cyan, "stroke-width": 2.4 }));
    var pathB = VZ.path(svg, "", VZ.stroke({ stroke: C.mag, "stroke-width": 2.4 }));
    var tMark = VZ.circ(svg, 0, 0, 8, { fill: C.deep, stroke: C.ink, "stroke-width": 2.4, style: "cursor:grab" });
    var tHit = VZ.circ(svg, 0, 0, 28, { fill: "rgba(0,0,0,0)", style: "cursor:grab" });
    var tLbl = VZ.txt(svg, 0, 0, "z", { size: 13, fill: C.ink, weight: 700, anchor: "middle" });

    /* 右：w = √z 平面 */
    VZ.txt(svg, WX, 40, "w = √z 平面", { size: 12, fill: C.ink2, anchor: "middle" });
    VZ.circ(svg, WX, WY, WR, { stroke: C.faint, "stroke-width": 1.2 });
    VZ.ln(svg, WX - WR - 14, WY, WX + WR + 14, WY, { stroke: C.faint, "stroke-width": 1 });
    VZ.ln(svg, WX, WY - WR - 14, WX, WY + WR + 14, { stroke: C.faint, "stroke-width": 1 });
    VZ.txt(svg, WX + WR + 20, WY + 4, "Re", { size: 10.5, fill: C.dim });
    VZ.txt(svg, WX + 6, WY - WR - 18, "Im", { size: 10.5, fill: C.dim });
    var diam = VZ.ln(svg, 0, 0, 0, 0, { stroke: C.faint, "stroke-width": 1.2, "stroke-dasharray": "4 4" });
    var wA = VZ.circ(svg, 0, 0, 8, { fill: C.deep, stroke: C.cyan, "stroke-width": 2.6 });
    var wB = VZ.circ(svg, 0, 0, 8, { fill: C.deep, stroke: C.mag, "stroke-width": 2.6 });
    var wAl = VZ.txt(svg, 0, 0, "", { size: 11.5, fill: C.cyan, anchor: "start", weight: 700 });
    var wBl = VZ.txt(svg, 0, 0, "", { size: 11.5, fill: C.mag, anchor: "start", weight: 700 });

    var out = VZ.panel(stage, { "终点 z": "", "青路（逆时针）√z": "", "品红路（顺时针）√z": "", "两条路的关系": "" });

    var ptsA = [], ptsB = [];
    function build() {
      ptsA = []; ptsB = [];
      var n = 100;
      for (var i = 0; i <= n; i++) {
        var s1 = theta * i / n;
        ptsA.push([CX + R * Math.cos(s1), CY - R * Math.sin(s1)]);
        var s2 = -2 * Math.PI + theta * i / n;
        ptsB.push([CX + R * Math.cos(s2), CY - R * Math.sin(s2)]);
      }
      var d1 = "", d2 = "";
      ptsA.forEach(function (p, i) { d1 += (i ? "L" : "M") + p[0].toFixed(1) + " " + p[1].toFixed(1); });
      ptsB.forEach(function (p, i) { d2 += (i ? "L" : "M") + p[0].toFixed(1) + " " + p[1].toFixed(1); });
      pathA.setAttribute("d", d1);
      pathB.setAttribute("d", d2);
    }
    function redraw() {
      build();
      var t = [CX + R * Math.cos(theta), CY - R * Math.sin(theta)];
      tMark.setAttribute("cx", t[0]); tMark.setAttribute("cy", t[1]);
      tHit.setAttribute("cx", t[0]); tHit.setAttribute("cy", t[1]);
      tLbl.setAttribute("x", t[0] + (Math.cos(theta) > 0 ? 18 : -18));
      tLbl.setAttribute("y", t[1] + 5);
      var h = theta / 2;
      var wApt = [WX + WR * Math.cos(h), WY - WR * Math.sin(h)];
      var wBpt = [WX - WR * Math.cos(h), WY + WR * Math.sin(h)];
      diam.setAttribute("x1", wApt[0]); diam.setAttribute("y1", wApt[1]);
      diam.setAttribute("x2", wBpt[0]); diam.setAttribute("y2", wBpt[1]);
      wA.setAttribute("cx", wApt[0]); wA.setAttribute("cy", wApt[1]);
      wB.setAttribute("cx", wBpt[0]); wB.setAttribute("cy", wBpt[1]);
      var va = Math.cos(h).toFixed(3) + (Math.sin(h) >= 0 ? " + " : " − ") + Math.abs(Math.sin(h)).toFixed(3) + "i";
      wAl.setAttribute("x", wApt[0] + (Math.cos(h) > 0 ? 12 : -12));
      wAl.setAttribute("y", wApt[1] + (Math.sin(h) >= 0 ? -16 : 20));
      wAl.setAttribute("anchor", Math.cos(h) > 0 ? "start" : "end");
      wAl.textContent = va;
      wBl.setAttribute("x", wBpt[0] + (Math.cos(h) > 0 ? -12 : 12));
      wBl.setAttribute("y", wBpt[1] + (Math.sin(h) >= 0 ? 22 : -14));
      wBl.setAttribute("anchor", Math.cos(h) > 0 ? "end" : "start");
      wBl.textContent = "−(" + va + ")";
      var zc = Math.cos(theta).toFixed(3), zs = Math.sin(theta).toFixed(3);
      VZ.setPanel(out, {
        "终点 z": zc + (parseFloat(zs) >= 0 ? " + " : " − ") + Math.abs(zs) + "i",
        "青路（逆时针）√z": va,
        "品红路（顺时针）√z": "−(" + va + ")",
        "两条路的关系": "恒差因子 e^{iπ} = −1"
      });
    }
    redraw();

    /* 拖终点：累计展开角，避免跨 ±π 跳变 */
    var prevA = null;
    VZ.onDragRange(svg, tHit, function (x, y) {
      var ang = Math.atan2(-(y - CY), x - CX);
      if (prevA === null) prevA = ang;
      var d = ang - prevA;
      while (d > Math.PI) d -= 2 * Math.PI;
      while (d < -Math.PI) d += 2 * Math.PI;
      prevA = ang;
      theta = VZ.clamp(theta + d, 0.06, 2 * Math.PI - 0.06);
      redraw();
    });
    var row = VZ.box(stage, "viz-ctl");
    VZ.btn(row, "转到 z=−1（经典例子）", function () { theta = Math.PI; prevA = null; redraw(); });
    VZ.btn(row, "转到 z=i", function () { theta = Math.PI / 2; prevA = null; redraw(); });

    /* 两颗光点沿两条路走 */
    var rA = VZ.circ(svg, 0, 0, 4.5, { fill: C.cyan });
    var rB = VZ.circ(svg, 0, 0, 4.5, { fill: C.mag });
    VZ.raf(svg, function (t) {
      var u = (t / 3.2) % 1;
      var i1 = Math.min(ptsA.length - 2, Math.floor(u * (ptsA.length - 1)));
      var f1 = u * (ptsA.length - 1) - i1;
      if (ptsA.length) {
        rA.setAttribute("cx", ptsA[i1][0] + (ptsA[i1 + 1][0] - ptsA[i1][0]) * f1);
        rA.setAttribute("cy", ptsA[i1][1] + (ptsA[i1 + 1][1] - ptsA[i1][1]) * f1);
        var j = ptsB.length - 2 - i1;
        rB.setAttribute("cx", ptsB[j][0] + (ptsB[j + 1][0] - ptsB[j][0]) * f1);
        rB.setAttribute("cy", ptsB[j][1] + (ptsB[j + 1][1] - ptsB[j][1]) * f1);
      }
    });
    VZ.legend(stage, [["逆时针路径", C.cyan, "line"], ["顺时针路径", C.mag, "line"], ["√z 的两个值（w 平面）", C.gold]]);
  }
},

/* ==========================================================
   第 5 章 · n 次方根：n 个答案把圆周等分
   —— 插在 5.3「b^(1/n) 有 n 个不同的复数答案」那一页
   ========================================================== */
"f-ch05roots": {
  title: "n 次方根：n 个答案把圆周等分",
  hint: "<b>拖动金色的 z</b>（或拖下面的滑杆），看它的 n 个根怎么跟着转。按「播放」重演一遍：先让 n 种角度写法叠在同一点，再一起除以 n，它们就散开成等分点。<b>点任意一个根</b>，图上会画出 w → w² → … → wⁿ 的螺旋——它一定绕回 z。把 n 拉到 12：点变密了，但相邻两点的夹角永远是 360°/n。",
  legend: [["z（被开方数）", VZ.C.gold], ["n 个根", VZ.C.cyan], ["选中的根与验证螺旋", VZ.C.violet]],
  draw: function (stage) {
    var C = VZ.C;
    /* 窄屏（手机）换一套版面：只留复平面，尺寸按视口重算，
       否则 760 宽的图在 330px 容器里缩到 43%，字全糊成一片。 */
    var NARROW = stage.clientWidth > 0 && stage.clientWidth < 560;
    var W = NARROW ? 400 : 760, H = NARROW ? 386 : 410;
    var svg = VZ.S(stage, W, H, {});
    var ox = NARROW ? W / 2 : 252, oy = NARROW ? H / 2 : 205;
    var U = NARROW ? 56 : 74, MAXR = 2.2, R = MAXR * U;
    var S = { n: 4, r: 1, th: 0, anim: 1, playing: false, ver: null, hover: -1 };
    var SUB = { "0": "₀", "1": "₁", "2": "₂", "3": "₃", "4": "₄", "5": "₅", "6": "₆", "7": "₇", "8": "₈", "9": "₉" };
    function sub(k) {
      return String(k).split("").map(function (c) { return SUB[c] || c; }).join("");
    }
    function fx(v) { return Math.round(v * 100) / 100; }
    function P(rad, deg) {
      var a = deg * Math.PI / 180;
      return [ox + rad * U * Math.cos(a), oy - rad * U * Math.sin(a)];
    }
    /* 角度弧：直接采样成折线，跨越 0°/360° 也不会画反 */
    function arcD(rad, a0, a1) {
      var d = a1 - a0, steps = Math.max(2, Math.ceil(Math.abs(d) / 3)), s = "", i, p;
      for (i = 0; i <= steps; i++) {
        p = P(rad, a0 + d * i / steps);
        s += (i ? "L" : "M") + fx(p[0]) + " " + fx(p[1]);
      }
      return s;
    }
    function num(v, dg) {
      var t = (Math.abs(v) < 5e-3 ? 0 : v).toFixed(dg === undefined ? 2 : dg);
      return t.replace(/\.?0+$/, "") || "0";
    }
    function alg(rad, deg) {
      var a = rad * Math.cos(deg * Math.PI / 180), b = rad * Math.sin(deg * Math.PI / 180);
      if (Math.abs(b) < 5e-3) return num(a);
      var bs = Math.abs(Math.abs(b) - 1) < 5e-3 ? "" : num(Math.abs(b));   /* 系数为 1 时不写 1 */
      if (Math.abs(a) < 5e-3) return (b > 0 ? "" : "−") + bs + "i";
      return num(a) + (b > 0 ? " + " : " − ") + bs + "i";
    }

    /* ---------- 静态：同心圆 / 刻度环 / 坐标轴 ---------- */
    var i, a, p;
    for (var rr = 0.5; rr < MAXR - 0.05; rr += 0.5) {
      VZ.circ(svg, ox, oy, rr * U, { stroke: C.faint, "stroke-width": 0.8, opacity: 0.5 });
    }
    VZ.circ(svg, ox, oy, R, { stroke: C.faint, "stroke-width": 1.2, opacity: 0.9 });
    for (i = 0; i < 24; i++) {
      a = i * 15 * Math.PI / 180;
      var big = i % 3 === 0, r1 = R - (big ? 9 : 4.5);
      VZ.ln(svg, ox + r1 * Math.cos(a), oy - r1 * Math.sin(a), ox + R * Math.cos(a), oy - R * Math.sin(a),
        { stroke: big ? C.ink2 : C.faint, "stroke-width": big ? 1.2 : 0.8, opacity: big ? 0.55 : 0.4 });
    }
    /* 角度数字只标 45° 的四个斜位：正上下左右留给 Re/Im 与根标签 */
    [45, 135, 225, 315].forEach(function (deg) {
      p = P(MAXR + 0.14, deg);
      VZ.txt(svg, p[0], p[1] + 3.5, deg + "°", { size: 10, fill: C.dim, anchor: "middle" });
    });
    VZ.ln(svg, ox - R - 12, oy, ox + R + 12, oy, { stroke: C.faint, "stroke-width": 1 });
    VZ.ln(svg, ox, oy - R - 12, ox, oy + R + 12, { stroke: C.faint, "stroke-width": 1 });
    VZ.txt(svg, ox + R + 13, oy + 15, "Re", { size: 10.5, fill: C.dim, anchor: "end" });
    VZ.txt(svg, ox + 9, oy - R - 6, "Im", { size: 10.5, fill: C.dim });
    VZ.circ(svg, ox, oy, U, { stroke: C.ink2, "stroke-width": 1, "stroke-dasharray": "4 4", opacity: 0.3 });

    /* ---------- 动态层 ---------- */
    var poly = VZ.path(svg, "", VZ.stroke({ stroke: C.violet, "stroke-width": 1.2, "stroke-dasharray": "5 4", opacity: 0.5 }));
    var pool = [], verDots = [];
    for (i = 0; i < 12; i++) {
      var g = VZ.g(svg);
      var halo = VZ.circ(g, 0, 0, 15, { fill: "rgba(0,0,0,0)", style: "cursor:pointer" });
      var dot = VZ.circ(g, 0, 0, 6.5, { fill: C.cyan, stroke: C.deep, "stroke-width": 1.4 });
      var lbl = VZ.txt(g, 0, 0, "", { size: 11, fill: C.cyan, weight: 700, anchor: "middle" });
      (function (k, h) {
        h.addEventListener("pointerenter", function () { S.hover = k; });
        h.addEventListener("pointerleave", function () { if (S.hover === k) S.hover = -1; });
        h.addEventListener("click", function () { verify(k); });
      })(i, halo);
      pool.push({ g: g, halo: halo, dot: dot, lbl: lbl });
      verDots.push(VZ.circ(svg, -99, -99, 4.5, { fill: C.violet, stroke: C.deep, "stroke-width": 1, display: "none" }));
    }
    /* 验证轨迹画在根点之上：|z|=1 时它会贴着根所在的圆走，压在下面等于看不见 */
    var verPath = VZ.path(svg, "", VZ.stroke({ stroke: C.violet, "stroke-width": 2, opacity: 0.85 }));
    var wRing = VZ.circ(svg, ox, oy, U, { stroke: C.cyan, "stroke-width": 1, "stroke-dasharray": "3 5", opacity: 0, "fill": "none" });
    var zRay = VZ.path(svg, "", VZ.stroke({ stroke: C.gold, "stroke-width": 1.6, opacity: 0.5 }));
    var zArc = VZ.path(svg, "", VZ.stroke({ stroke: C.gold, "stroke-width": 2, opacity: 0.7 }));
    var zDot = VZ.circ(svg, ox + U, oy, 9, { fill: "none", stroke: C.gold, "stroke-width": 2.6 });
    var zLbl = VZ.txt(svg, 0, 0, "z", { size: 12.5, fill: C.gold, weight: 700 });
    var stackLbl = VZ.txt(svg, 0, 0, "", { size: 11, fill: C.gold, weight: 700, anchor: "middle", display: "none" });
    var zHalo = VZ.circ(svg, ox + U, oy, 20, { fill: "rgba(0,0,0,0)", style: "cursor:grab" });
    var runner = VZ.circ(svg, -99, -99, 5.5, { fill: C.gold, stroke: C.deep, "stroke-width": 1.4, display: "none" });

    /* ---------- 右侧读数（SVG 内，跟着 n 变） ---------- */
    var tN = null, tNd = null, tF = null, tK = null, tGap = null, tMod = null, tSame = null, tSame2 = null;
    if (!NARROW) {
    tN = VZ.txt(svg, 512, 92, "", { size: 25, fill: C.ink, weight: 700 });
    var tNd = VZ.txt(svg, 512, 116, "", { size: 11.5, fill: C.dim });
    var tF = VZ.txt(svg, 512, 156, "wₖ = |z|^(1/n) · e^(i(θ+360°k)/n)", { size: 11, fill: C.ink2 });
    var tK = VZ.txt(svg, 512, 176, "k = 0, 1, …, n − 1", { size: 10.5, fill: C.dim });
    var tGap = VZ.txt(svg, 512, 216, "", { size: 12.5, fill: C.cyan, weight: 700 });
    var tMod = VZ.txt(svg, 512, 238, "", { size: 12.5, fill: C.cyan });
    var tSame = VZ.txt(svg, 512, 276, "n 个根全在同一个圆上，", { size: 11, fill: C.dim });
    tSame2 = VZ.txt(svg, 512, 292, "连起来是正 n 边形", { size: 11, fill: C.dim });
    }

    /* ---------- 读数面板 + 控件 ---------- */
    var msg = VZ.note(stage, "");
    var slides = document.createElement("div");
    slides.style.cssText = "display:grid;grid-template-columns:repeat(auto-fit,minmax(190px,1fr));gap:0 18px;margin-top:4px";
    stage.appendChild(slides);
    var sN = VZ.slider(slides, {
      label: "n（开几次方）", min: 2, max: 12, step: 1, value: S.n,
      format: function (v) { return Math.round(v) + " 次"; },
      onInput: function (v) { S.n = Math.round(v); S.ver = null; S.anim = 1; S.playing = false; sync(); }
    });
    var sR = VZ.slider(slides, {
      label: "|z| 模长", min: 0.3, max: 2.1, step: 0.01, value: S.r,
      format: function (v) { return v.toFixed(2); },
      onInput: function (v) { S.r = v; S.ver = null; sync(); }
    });
    var sT = VZ.slider(slides, {
      label: "θ 辐角", min: 0, max: 360, step: 1, value: S.th,
      format: function (v) { return Math.round(v) + "°"; },
      onInput: function (v) { S.th = v; S.ver = null; sync(); }
    });

    var preRow = document.createElement("div");
    preRow.className = "viz-chips";
    preRow.style.marginTop = "2px";
    stage.appendChild(preRow);
    var PRESETS = [
      ["1 的平方根", 2, 1, 0], ["1 的立方根", 3, 1, 0], ["1 的四次方根", 4, 1, 0],
      ["i 的平方根", 2, 1, 90], ["−1 的立方根", 3, 1, 180], ["(1+i) 的平方根", 2, Math.SQRT2, 45]
    ];
    PRESETS.forEach(function (ps) {
      var b = document.createElement("button");
      b.className = "viz-chip";
      b.textContent = ps[0];
      b.onclick = function () {
        preRow.querySelectorAll(".viz-chip").forEach(function (x) { x.classList.remove("on"); });
        b.classList.add("on");
        S.n = ps[1]; S.r = ps[2]; S.th = ps[3]; S.ver = null; S.anim = 0; S.playing = true;
        sN.set(S.n); sR.set(S.r); sT.set(S.th);
        sync();
      };
      preRow.appendChild(b);
    });

    var row = document.createElement("div");
    row.style.cssText = "display:flex;flex-wrap:wrap;gap:8px;margin-top:10px";
    stage.appendChild(row);
    VZ.btn(row, "播放：角度 ÷ n", function () {
      S.anim = 0; S.playing = true; S.ver = null;
      preRow.querySelectorAll(".viz-chip").forEach(function (x) { x.classList.remove("on"); });
      sync();
    });
    VZ.btn(row, "验证 wⁿ = z", function () { verify(0); });
    VZ.btn(row, "重置", function () {
      S.n = 4; S.r = 1; S.th = 0; S.anim = 1; S.playing = false; S.ver = null;
      sN.set(S.n); sR.set(S.r); sT.set(S.th);
      preRow.querySelectorAll(".viz-chip").forEach(function (x) { x.classList.remove("on"); });
      sync();
    });

    var chipsBox = document.createElement("div");
    chipsBox.className = "viz-chips";
    chipsBox.style.marginTop = "8px";
    stage.appendChild(chipsBox);

    var pan = VZ.panel(stage, {
      "z": "", "每个根的模 |z|^(1/n)": "", "相邻两点夹角 360°/n": "", "选中的根": ""
    });

    /* ---------- 交互 ---------- */
    VZ.onDragRange(svg, zHalo, function (x, y) {
      var dx = (x - ox) / U, dy = -(y - oy) / U;
      var rad = Math.min(2.1, Math.max(0.3, Math.hypot(dx, dy)));
      var deg = Math.atan2(dy, dx) * 180 / Math.PI;
      S.r = rad; S.th = (deg + 360) % 360; S.ver = null; S.playing = false;
      sR.set(S.r); sT.set(S.th);
      preRow.querySelectorAll(".viz-chip").forEach(function (x2) { x2.classList.remove("on"); });
      sync();
    });
    function verify(k) {
      S.ver = { k: Math.max(0, Math.min(S.n - 1, k)), p: 0 };
      S.anim = 1; S.playing = false; S.hover = k;
      sync();
    }

    /* ---------- 绘制 ---------- */
    function eased(anim) {
      var a0 = 0.18, b0 = 0.8;
      if (anim <= a0) return 0;
      if (anim >= b0) return 1;
      return VZ.ease((anim - a0) / (b0 - a0));
    }
    function paint() {
      var e = eased(S.anim), k, q, st, en, ang, rad, pts = [];
      var zpx = P(S.r, S.th);
      for (k = 0; k < S.n; k++) {
        st = S.th + 360 * k; en = st / S.n;
        ang = st + (en - st) * e;
        rad = Math.pow(S.r, 1 + e * (1 / S.n - 1));
        q = P(rad, ang);
        pts.push(q);
        var o = pool[k], sel = S.ver && S.ver.k === k, hot = S.hover === k;
        o.g.setAttribute("display", "");
        o.halo.setAttribute("cx", q[0]); o.halo.setAttribute("cy", q[1]);
        o.dot.setAttribute("cx", q[0]); o.dot.setAttribute("cy", q[1]);
        o.dot.setAttribute("r", (hot || sel) ? 8.5 : 6.5);
        o.dot.setAttribute("fill", sel ? C.violet : C.cyan);
        var showLbl = (S.n <= 8 && e > 0.92) || hot || sel;
        o.lbl.setAttribute("display", showLbl ? "" : "none");
        if (showLbl) {
          /* 根与 z 重合时（例如 1 的四次方根），标签翻到内侧，别和 z 的金环叠在一起 */
          var off = Math.hypot(q[0] - zpx[0], q[1] - zpx[1]) < 16 ? -26 : 21;
          var lp = P(rad + off / U, ang);
          o.lbl.setAttribute("x", lp[0]); o.lbl.setAttribute("y", lp[1] + 4);
          o.lbl.setAttribute("fill", sel ? C.violet : C.cyan);
          o.lbl.textContent = "w" + sub(k);
        }
      }
      for (k = S.n; k < 12; k++) pool[k].g.setAttribute("display", "none");

      if (e > 0.62) {
        var d = "";
        for (k = 0; k < S.n; k++) d += (k ? "L" : "M") + fx(pts[k][0]) + " " + fx(pts[k][1]);
        poly.setAttribute("d", d + "Z");
        poly.setAttribute("opacity", Math.min(0.5, (e - 0.62) / 0.38 * 0.5));
      } else {
        poly.setAttribute("d", "");
      }

      /* 根所在的圆：|z|^(1/n)，随动画收拢 */
      var wRad = Math.pow(S.r, 1 + e * (1 / S.n - 1));
      wRing.setAttribute("r", wRad * U);
      var sameAsUnit = Math.abs(S.r * Math.pow(S.r, 1 / S.n - 1) - 1) < 0.02;
      wRing.setAttribute("opacity", (e > 0.55 && !sameAsUnit) ? (e - 0.55) / 0.45 * 0.45 : 0);

      var zp = P(S.r, S.th);
      if (e < 0.02 && S.anim < 0.18) {
        stackLbl.setAttribute("display", "");
        stackLbl.setAttribute("x", zp[0]);
        stackLbl.setAttribute("y", zp[1] - 20 - S.n * 1.2);
        stackLbl.textContent = "×" + S.n + " 种角度写法叠在这里";
      } else {
        stackLbl.setAttribute("display", "none");
      }

      zDot.setAttribute("cx", zp[0]); zDot.setAttribute("cy", zp[1]);
      zHalo.setAttribute("cx", zp[0]); zHalo.setAttribute("cy", zp[1]);
      zRay.setAttribute("d", "M" + ox + " " + oy + "L" + fx(zp[0]) + " " + fx(zp[1]));
      zArc.setAttribute("d", S.th > 2 ? arcD(0.4, 0, S.th) : "");
      zLbl.setAttribute("x", zp[0]);
      zLbl.setAttribute("y", zp[1] + 21);
      zLbl.setAttribute("text-anchor", "middle");

      /* 验证螺旋：w^1 → w^n */
      if (S.ver) {
        var vk = S.ver.k, vp = S.ver.p, cnt = 0, s, j;
        var rn = Math.pow(S.r, 1 / S.n), phi = (S.th + 360 * vk) / S.n;
        var jEnd = 1 + vp * (S.n - 1);
        var dd = "";
        for (s = 0; s <= 1.0001; s += 0.01) {
          j = 1 + s * (jEnd - 1);
          q = P(Math.pow(rn, j), phi * j);
          dd += (s ? "L" : "M") + fx(q[0]) + " " + fx(q[1]);
        }
        verPath.setAttribute("d", dd);
        for (j = 1; j <= S.n; j++) {
          if (j > jEnd + 0.001) break;
          q = P(Math.pow(rn, j), phi * j);
          var vd = verDots[cnt++];
          vd.setAttribute("cx", q[0]); vd.setAttribute("cy", q[1]);
          vd.setAttribute("r", j === S.n ? 7 : 4.5);
          vd.setAttribute("fill", j === S.n ? C.gold : C.violet);
          vd.setAttribute("display", "");
        }
        for (; cnt < 12; cnt++) verDots[cnt].setAttribute("display", "none");
        var jn = 1 + vp * (S.n - 1);
        var rq = P(Math.pow(rn, jn), phi * jn);
        runner.setAttribute("cx", rq[0]); runner.setAttribute("cy", rq[1]);
        runner.setAttribute("display", "");
      } else {
        verPath.setAttribute("d", "");
        runner.setAttribute("display", "none");
        for (k = 0; k < 12; k++) verDots[k].setAttribute("display", "none");
      }
    }

    /* ---------- 文案与读数 ---------- */
    function msgHtml() {
      if (S.ver) {
        var vk = S.ver.k, j = Math.min(S.n, 1 + Math.floor(S.ver.p * (S.n - 1) + 0.0001));
        return "把 <b>w" + sub(vk) + "</b> 一次次乘自己：角度每次加 " + num((S.th + 360 * vk) / S.n, 1) +
          "°，半径每次乘 " + num(Math.pow(S.r, 1 / S.n), 3) + "。乘到第 <b>" + S.n +
          "</b> 次正好转回 z —— 这就是「" + S.n + " 个根」的全部含义。（当前 j = " + j + "）";
      }
      if (S.anim < 0.18) {
        return "z 只有一个位置，但角度可以写成 <b>θ</b>、<b>θ+360°</b>、<b>θ+720°</b>……共 <b>" + S.n +
          "</b> 种。转整圈不算换位置，所以这 " + S.n + " 种写法都合法，此刻它们叠在同一点。";
      }
      if (S.anim < 0.8) {
        return "把每种写法的角度<b>同时除以 " + S.n + "</b>：(θ + 360°·k) / " + S.n +
          "。原本差着整圈的写法，除以 " + S.n + " 后只差 <b>360°/" + S.n + " = " +
          num(360 / S.n, 1) + "°</b> —— 它们分开了。";
      }
      return "落定：<b>" + S.n + " 个点</b>均匀分布，模长都是 |z|^(1/" + S.n + ") = " +
        num(Math.pow(S.r, 1 / S.n), 3) + "，相邻两点永远隔 <b>" + num(360 / S.n, 1) +
        "°</b>。k 取到 " + S.n + " 就绕回原处，所以答案不多不少正好 " + S.n + " 个。";
    }
    var lastN = -1, chipEls = [];
    function sync() {
      msg.innerHTML = msgHtml();
      if (tN) {
        tN.textContent = "n = " + S.n;
        tNd.textContent = "个根，把圆周等分";
        tGap.textContent = "相邻夹角 " + num(360 / S.n, 1) + "°";
        tMod.textContent = "模长都是 " + num(Math.pow(S.r, 1 / S.n), 3);
      }
      VZ.setPanel(pan, {
        "z": alg(S.r, S.th) + "　∠" + num(S.th, 1) + "°",
        "每个根的模 |z|^(1/n)": num(Math.pow(S.r, 1 / S.n), 3),
        "相邻两点夹角 360°/n": num(360 / S.n, 1) + "°",
        "选中的根": S.ver ? ("w" + sub(S.ver.k) + " = " + alg(Math.pow(S.r, 1 / S.n), (S.th + 360 * S.ver.k) / S.n)) : "—（点一下任意根）"
      });
      if (lastN !== S.n) {
        chipsBox.innerHTML = "";
        chipEls = [];
        for (var k = 0; k < S.n; k++) {
          var b = document.createElement("button");
          b.className = "viz-chip";
          (function (kk) {
            b.onclick = function () {
              chipsBox.querySelectorAll(".viz-chip").forEach(function (x) { x.classList.remove("on"); });
              b.classList.add("on");
              verify(kk);
            };
          })(k);
          chipsBox.appendChild(b);
          chipEls.push(b);
        }
        lastN = S.n;
      }
      for (var j = 0; j < S.n; j++) {
        var c = chipEls[j];
        c.textContent = "w" + sub(j) + " = " + alg(Math.pow(S.r, 1 / S.n), (S.th + 360 * j) / S.n);
        c.classList.toggle("on", !!(S.ver && S.ver.k === j));
      }
      paint();
    }

    var lastT = 0;
    VZ.raf(svg, function (t) {
      var dt = lastT ? Math.min(0.05, t - lastT) : 0;
      lastT = t;
      var dirty = false;
      if (S.playing) {
        S.anim += dt / 2.6;
        if (S.anim >= 1) { S.anim = 1; S.playing = false; }
        dirty = true;
      }
      if (S.ver && S.ver.p < 1) {
        S.ver.p += dt / 1.8;
        if (S.ver.p >= 1) S.ver.p = 1;
        dirty = true;
      }
      if (dirty) { msg.innerHTML = msgHtml(); paint(); }
    });

    sync();
    /* 进页面先演一遍「叠合 → 除以 n」，比静态图更说明问题 */
    setTimeout(function () { S.anim = 0; S.playing = true; }, 420);
  }
},

/* ==========================================================
   第 5 章 · 复数幂 w^z：每多绕一圈 2πi，就乘上同一个 M
   —— 插在 5.4「复数幂」那一页（正文正好提到图 5.9「两条等角螺线的交点」）
   ========================================================== */
"f-ch05wz": {
  title: "复数幂的一整串值：落在一进一出的两条等角螺线上",
  hint: "拖 <b>x</b>（z 的实部）、<b>y</b>（虚部）看这串值怎么变。<b>关键只有一句</b>：每多绕一圈 2πi，值就乘上同一个复数 <b>M = e^(2πiz)</b>——模按等比、幅角按等差，画出来就是等角螺线。试三个极端：<b>y = 0</b> 全落在一个圆上、<b>x = 0</b> 全落在一条射线上、<b>z = 2</b> 只剩一个值。切到「对数极坐标」，螺线被拉直成一条直线——那就是「等比 + 等差」的直接后果。",
  draw: function (stage) {
    var C = VZ.C, TAU = Math.PI * 2;
    /* 窄屏换一套版面：760 宽的图在 330px 容器里会被缩到 43%，字全糊。
       直接按容器实宽建画布，坐标与像素 1:1。 */
    var sw = stage.clientWidth || 0;
    var NARROW = sw > 0 && sw < 560;
    var W = NARROW ? Math.round(Math.max(300, sw - 2)) : 600;
    var H = NARROW ? 320 : 405;
    var A = { mod: 1.6, arg: 1.2 };                 /* 底固定：换底只挪 v₀，不改步长 */
    var LA = Math.log(A.mod);
    var S = { x: 0.18, y: 0.05, K: 5, u: 0, ph: 0, playing: false, logv: false, tab: 1 };
    var cv, ctx, cx, cy, playBtn;

    /* ---------- 数学 ---------- */
    function v0() {                                  /* e^{z·log w}，log w = ln|w| + i·arg w */
      return { r: Math.exp(S.x * LA - S.y * A.arg), th: S.x * A.arg + S.y * LA };
    }
    function Mval() { return { mod: Math.exp(-TAU * S.y), arg: TAU * S.x }; }
    function at(t) {                                 /* 第 t 步：v₀ · M^t */
      var v = v0(), m = Mval();
      return { r: v.r * Math.pow(m.mod, t), th: v.th + t * m.arg };
    }
    function xy(p, s) { return [cx + p.r * s * Math.cos(p.th), cy - p.r * s * Math.sin(p.th)]; }
    function num(v, d) { return (Math.abs(v) < 5e-4 ? 0 : v).toFixed(d); }
    function inwardDir() { return Mval().mod < 1; }  /* |M|<1 → k 越大越靠里 */

    /* 一步乘多大，决定一个线性的画框里能装几步：
       |M|=0.15 时 1、0.15、0.022… 三步就跨了两个数量级，硬画只会挤成一团。
       所以按「40 倍框」反算最多画几步，面板里如实告诉读者。 */
    var REACH = 40;
    function Keff() {
      var lm = Math.log(Mval().mod);
      if (Math.abs(lm) < 1e-6) return S.K;           /* 共圆：多少步都落在同一圆上 */
      return Math.max(1, Math.min(S.K, Math.floor(Math.log(REACH) / Math.abs(lm))));
    }

    /* ---------- ① 复平面：一串值，一进一出 ---------- */
    function paintSeries() {
      ctx.clearRect(0, 0, W, H);
      var k, Ke = Keff(), mx = v0().r;
      for (k = -Ke; k <= Ke; k++) mx = Math.max(mx, at(k).r);
      mx = Math.min(mx, v0().r * REACH);             /* 框封顶，别为远处的点把别的全压没 */
      var s = Math.min(W, H) / 2 / (mx * 1.18);
      var diag = Math.hypot(W, H) * 0.46;
      var inward = inwardDir();

      ctx.save();
      ctx.strokeStyle = "rgba(255,255,255,.09)"; ctx.lineWidth = 1;
      ctx.beginPath(); ctx.arc(cx, cy, s, 0, TAU); ctx.stroke();
      ctx.setLineDash([4, 5]);
      ctx.strokeStyle = "rgba(62,232,240,.26)";
      ctx.beginPath(); ctx.arc(cx, cy, v0().r * s, 0, TAU); ctx.stroke();
      ctx.setLineDash([]);
      ctx.strokeStyle = "rgba(255,255,255,.12)";
      ctx.beginPath(); ctx.moveTo(0, cy); ctx.lineTo(W, cy);
      ctx.moveTo(cx, 0); ctx.lineTo(cx, H); ctx.stroke();
      ctx.restore();

      /* 两支：t<0 与 t>0，一进一出；同一个 M，只是方向相反 */
      /* 末端多走一段，让螺线「跑出画框」——半空断掉会像图画错了 */
      [[-Ke - 1.1, -0.001], [0.001, Ke + 1.1]].forEach(function (b) {
        var isIn = (b[0] > 0) === inward;
        ctx.save();
        ctx.strokeStyle = isIn ? "rgba(62,232,240,.6)" : "rgba(255,95,210,.55)";
        ctx.lineWidth = 1.8;
        ctx.beginPath();
        var pen = false, i, N = 240;
        for (i = 0; i <= N; i++) {
          var t = b[0] + (b[1] - b[0]) * i / N;
          var p = at(t), q = xy(p, s);
          if (p.r * s > diag) { pen = false; continue; }
          if (!pen) { ctx.moveTo(q[0], q[1]); pen = true; } else ctx.lineTo(q[0], q[1]);
        }
        ctx.stroke(); ctx.restore();
      });

      /* 整数步上的值 */
      var pts = [];
      for (k = -Ke; k <= Ke; k++) {
        var p = at(k);
        if (p.r * s > diag) continue;
        var q = xy(p, s), isIn = (k > 0) === inward;
        pts.push([k, q, p.r]);
        ctx.beginPath(); ctx.arc(q[0], q[1], k === 0 ? 7 : 4, 0, TAU);
        ctx.fillStyle = k === 0 ? C.gold : (isIn ? C.cyan : C.mag);
        ctx.fill();
      }
      /* 标签单开一轮，从 v₀ 往外打；被压住的直接跳过
         —— 模按等比缩，内圈几个点必然挤在一起，硬打就是一团糊字 */
      var placed = [];
      [0, 1, -1, 2, -2, 3, -3].forEach(function (kk) {
        var hit = pts.filter(function (a) { return a[0] === kk; })[0];
        if (!hit) return;
        var qq = hit[1];
        /* 内圈（模已缩到 v₀ 的 0.72 以下）不标：它们本来就挤成一团，
           标签只会压在点上。往外那一支才是需要读步数的地方。 */
        if (kk !== 0 && hit[2] < 0.72 * v0().r) return;
        if (placed.some(function (pp) { return Math.hypot(pp[0] - qq[0], pp[1] - qq[1]) < 30; })) return;
        placed.push(qq);
        ctx.fillStyle = "rgba(238,234,255,.78)";
        ctx.font = "11px -apple-system,'PingFang SC',sans-serif";
        ctx.fillText(kk === 0 ? "v₀" : "k=" + kk, qq[0] + 9, qq[1] - 7);
      });

      /* 播放中的当前点 */
      if (S.playing) {
        var cur = at(S.u), cq = xy(cur, s);
        if (cur.r * s <= diag) {
          ctx.beginPath(); ctx.arc(cq[0], cq[1], 9, 0, TAU);
          ctx.strokeStyle = C.green; ctx.lineWidth = 2; ctx.stroke();
          ctx.beginPath(); ctx.arc(cq[0], cq[1], 3.5, 0, TAU);
          ctx.fillStyle = C.green; ctx.fill();
        }
      }
      ctx.fillStyle = "rgba(154,147,198,.92)";
      ctx.font = "11px -apple-system,'PingFang SC',sans-serif";
      var sameR = Math.abs(Mval().mod - 1) < 1e-3;
      /* 图例压一条底板：螺线常常从底部穿过去，纯文字会被线压住看不清 */
      ctx.fillStyle = "rgba(11,7,26,.74)";
      ctx.fillRect(0, H - 26, W, 26);
      ctx.fillText(sameR
                     ? (NARROW ? "金 = v₀　|M| = 1：全在同一个圆上"
                               : "金 = v₀（k = 0 主值）　|M| = 1：只转不缩，所有值落在这个圆上")
                     : (NARROW ? "金 = v₀　青 = 向里收　品红 = 往外散"
                               : "金 = v₀（k = 0 主值）　青 = 向里收的一支　品红 = 往外散的一支"),
                   12, H - 12);
      if (Ke < S.K) {
        ctx.fillText("画框只装得下 ±" + Ke + " 步：|M| 每步变 " + num(Mval().mod, 2) + " 倍",
                     12, 16);
      }
    }

    /* ---------- ①b 对数极坐标：螺线被拉直成直线 ---------- */
    function paintLog() {
      ctx.clearRect(0, 0, W, H);
      var m = Mval(), v = v0(), k, Ke = Keff();
      /* 端点直接取真实点，不在「退化时补一段」——x=0 时它本来就该是竖直线 */
      var lo = at(-(Ke + 0.5)), hi = at(Ke + 0.5);
      var thMin = Math.min(lo.th, hi.th, v.th), thMax = Math.max(lo.th, hi.th, v.th);
      var lnMin = Math.log(Math.min(lo.r, hi.r, v.r)), lnMax = Math.log(Math.max(lo.r, hi.r, v.r));
      if (thMax - thMin < 0.8) { var t0 = (thMin + thMax) / 2; thMin = t0 - 0.4; thMax = t0 + 0.4; }
      if (lnMax - lnMin < 0.8) { var l0 = (lnMin + lnMax) / 2; lnMin = l0 - 0.4; lnMax = l0 + 0.4; }
      var padL = 34, padR = 14, padT = 22, padB = 30;
      var X = function (t) { return padL + (t - thMin) / (thMax - thMin) * (W - padL - padR); };
      var Y = function (r) { return H - padB - (r - lnMin) / (lnMax - lnMin) * (H - padT - padB); };

      ctx.save();
      /* 每 2π 一根竖虚线 = 绕原点转一圈 */
      ctx.strokeStyle = "rgba(255,255,255,.07)"; ctx.lineWidth = 1;
      var k0 = Math.ceil(thMin / TAU), k1 = Math.floor(thMax / TAU);
      for (k = k0; k <= k1; k++) {
        ctx.setLineDash([3, 5]);
        ctx.beginPath(); ctx.moveTo(X(k * TAU), padT); ctx.lineTo(X(k * TAU), H - padB); ctx.stroke();
        ctx.setLineDash([]);
        if (!NARROW && k1 - k0 <= 8) {
          ctx.fillStyle = "rgba(154,147,198,.65)";
          ctx.font = "10px -apple-system,sans-serif";
          ctx.fillText(k === 0 ? "θ=0" : k + "·2π", X(k * TAU) - 12, H - padB + 13);
        }
      }
      ctx.strokeStyle = "rgba(255,255,255,.16)";
      ctx.beginPath(); ctx.moveTo(padL, padT); ctx.lineTo(padL, H - padB); ctx.lineTo(W - padR, H - padB); ctx.stroke();

      /* 直线：斜率 dρ/dθ = −y/x */
      ctx.strokeStyle = "rgba(155,140,255,.9)"; ctx.lineWidth = 2;
      ctx.beginPath(); ctx.moveTo(X(lo.th), Y(Math.log(lo.r))); ctx.lineTo(X(hi.th), Y(Math.log(hi.r))); ctx.stroke();
      for (k = -Ke; k <= Ke; k++) {
        var p = at(k);
        ctx.beginPath(); ctx.arc(X(p.th), Y(Math.log(p.r)), k === 0 ? 6 : 3.6, 0, TAU);
        ctx.fillStyle = k === 0 ? C.gold : C.violet; ctx.fill();
      }
      ctx.restore();

      ctx.fillStyle = "rgba(154,147,198,.92)";
      ctx.font = "11px -apple-system,'PingFang SC',sans-serif";
      ctx.fillText(NARROW ? "横 θ 纵 ln|v|，虚线隔 2π" : "横轴 θ（幅角）　纵轴 ln|v|　虚线间隔 2π = 绕原点一圈",
                   padL + 2, padT - 7);
    }

    /* ---------- ② 两族螺线：交点就是全部取值（图 5.9） ---------- */
    function paintGrid() {
      ctx.clearRect(0, 0, W, H);
      var al = LA, be = A.arg, STEP = 0.55, N = NARROW ? 2 : 3, EXT = 1.1;
      var val = function (x_, y_) { return { r: Math.exp(x_ * al - y_ * be), th: x_ * be + y_ * al }; };
      var m, n, mx = 1e-9;
      for (m = -N; m <= N; m++) for (n = -N; n <= N; n++) mx = Math.max(mx, val(m * STEP, n * STEP).r);
      /* 网格的半径跨度能到几十倍（近原点的格点必然挤成一坨），
         按 6 倍定标：中段两族线展开看得清，超出的枝干脆跑出画框。 */
      var s = Math.min(W, H) / 2 / (Math.min(mx, 6) * 1.08), diag = Math.hypot(W, H) * 0.46;
      var curM = Math.round(S.x / STEP), curN = Math.round(S.y / STEP);

      ctx.save();
      ctx.strokeStyle = "rgba(255,255,255,.12)";
      ctx.beginPath(); ctx.moveTo(0, cy); ctx.lineTo(W, cy);
      ctx.moveTo(cx, 0); ctx.lineTo(cx, H); ctx.stroke();
      ctx.restore();

      var line = function (fixed, vertical, hot, hue) {
        ctx.save();
        ctx.strokeStyle = "hsla(" + hue + ",70%,66%," + (hot ? ".95" : ".26") + ")";
        ctx.lineWidth = hot ? 2.2 : 1.2;
        ctx.beginPath();
        var pen = false, i, N2 = 200;
        for (i = 0; i <= N2; i++) {
          var u = -EXT + 2 * EXT * i / N2;
          var p = vertical ? val(fixed, u) : val(u, fixed);
          var q = xy(p, s);
          if (p.r * s > diag) { pen = false; continue; }
          if (!pen) { ctx.moveTo(q[0], q[1]); pen = true; } else ctx.lineTo(q[0], q[1]);
        }
        ctx.stroke(); ctx.restore();
      };
      /* 青族 = 竖线的像（虚部↑ → 收向原点）；金族 = 横线的像（实部↑ → 向外发散） */
      for (m = -N; m <= N; m++) line(m * STEP, true, m === curM, 187);
      for (n = -N; n <= N; n++) line(n * STEP, false, n === curN, 42);

      for (m = -N; m <= N; m++) for (n = -N; n <= N; n++) {
        var v = val(m * STEP, n * STEP);
        if (v.r * s > diag) continue;
        var q2 = xy(v, s);
        ctx.beginPath(); ctx.arc(q2[0], q2[1], 2.6, 0, TAU);
        ctx.fillStyle = "rgba(238,234,255,.95)"; ctx.fill();
      }

      ctx.fillStyle = "rgba(11,7,26,.74)";
      ctx.fillRect(0, H - 42, W, 42);
      ctx.fillStyle = "rgba(154,147,198,.92)";
      ctx.font = "11px -apple-system,'PingFang SC',sans-serif";
      ctx.fillText(NARROW ? "青 = 向里收　金 = 往外散"
                          : "青族 = 竖线的像（虚部↑，收向原点）　金族 = 横线的像（实部↑，向外发散）",
                   12, H - 26);
      ctx.fillText("白点 = 两族交点 = 各个格点上的取值", 12, H - 10);
    }

    function paint() {
      if (S.tab === 2) paintGrid();
      else if (S.logv) paintLog();
      else paintSeries();
    }

    /* ---------- 控件 ---------- */
    var tabRow = document.createElement("div");
    tabRow.className = "viz-chips";
    tabRow.style.cssText = "margin:0 0 8px";
    stage.appendChild(tabRow);
    [["① 同一串值", 1], ["② 两族螺线 · 交点即取值", 2]].forEach(function (t) {
      var b = document.createElement("button");
      b.className = "viz-chip" + (S.tab === t[1] ? " on" : "");
      b.textContent = t[0];
      b.onclick = function () {
        S.tab = t[1]; S.playing = false; S.u = 0; S.ph = 0;
        tabRow.querySelectorAll(".viz-chip").forEach(function (x) { x.classList.remove("on"); });
        b.classList.add("on");
        stopPlay();
        logBtn.classList.toggle("on", false); S.logv = false;
        sync();
      };
      tabRow.appendChild(b);
    });

    cv = VZ.canvas(stage, W, H, { maxDpr: 2 });
    ctx = cv.ctx; cx = W / 2; cy = H / 2;

    var slides = document.createElement("div");
    slides.style.cssText = "display:grid;grid-template-columns:repeat(auto-fit,minmax(190px,1fr));gap:0 18px;margin-top:4px";
    stage.appendChild(slides);
    var sX = VZ.slider(slides, {
      label: "x = Re z", min: -1.5, max: 1.5, step: 0.01, value: S.x,
      format: function (v) { return v.toFixed(2); },
      onInput: function (v) { S.x = v; S.playing = false; S.u = 0; S.ph = 0; stopPlay(); sync(); }
    });
    var sY = VZ.slider(slides, {
      label: "y = Im z", min: -0.8, max: 0.8, step: 0.01, value: S.y,
      format: function (v) { return v.toFixed(2); },
      onInput: function (v) { S.y = v; S.playing = false; S.u = 0; S.ph = 0; stopPlay(); sync(); }
    });
    VZ.slider(slides, {
      label: "步数 K", min: 2, max: 8, step: 1, value: S.K,
      format: function (v) { return Math.round(v) + " 步"; },
      onInput: function (v) { S.K = Math.round(v); sync(); }
    });

    var preRow = document.createElement("div");
    preRow.className = "viz-chips";
    preRow.style.marginTop = "2px";
    stage.appendChild(preRow);
    [["一般情形", 0.18, 0.05], ["缩小得猛（y = 0.3）", 0.18, 0.30], ["y = 0：共圆", 0.35, 0], ["x = 0：共射线", 0, 0.18], ["z = 2：单值", 2, 0]].forEach(function (p) {
      var b = document.createElement("button");
      b.className = "viz-chip";
      b.textContent = p[0];
      b.onclick = function () {
        S.x = p[1]; S.y = p[2]; S.playing = false; S.u = 0; S.ph = 0;
        sX.set(S.x); sY.set(S.y);
        preRow.querySelectorAll(".viz-chip").forEach(function (x) { x.classList.remove("on"); });
        b.classList.add("on");
        stopPlay(); sync();
      };
      preRow.appendChild(b);
    });

    var row = document.createElement("div");
    row.style.cssText = "display:flex;flex-wrap:wrap;gap:8px;margin-top:10px";
    stage.appendChild(row);
    function stopPlay() {
      S.playing = false;
      if (playBtn) { playBtn.textContent = "播放：一步步乘 M"; playBtn.classList.remove("on"); }
    }
    playBtn = VZ.btn(row, "播放：一步步乘 M", function () {
      S.playing = !S.playing;
      if (S.playing) { S.tab = 1; S.logv = false; S.u = 0; S.ph = 0; logBtn.classList.remove("on"); }
      playBtn.textContent = S.playing ? "暂停" : "播放：一步步乘 M";
      playBtn.classList.toggle("on", S.playing);
      sync();
    });
    var logBtn = VZ.btn(row, "对数极坐标", function () {
      S.logv = !S.logv;
      if (S.logv) S.tab = 1;
      this.classList.toggle("on", S.logv);
      sync();
    });
    var resetBtn = VZ.btn(row, "回到 k = 0", function () {
      stopPlay(); S.u = 0; S.ph = 0; sync();
    });

    var msg = VZ.note(stage, "");
    var pan = VZ.panel(stage, {
      "|M| = e^(−2πy)": "", "arg M = 2πx": "", "v₀ 的模": "", "v₀ 的幅角": "", "此刻": ""
    });

    function noteHtml() {
      if (S.tab === 2) {
        return "把 z′ 在一个小方格上逐点取遍，再整体映射过去：<b>竖线</b>的像收向原点，<b>横线</b>的像向外发散，" +
          "两族交点就是各格点上的取值——格点越密，交点越接近「全部取值」。图 5.9 画的就是这张网。";
      }
      var m = Mval();
      if (S.logv) {
        return "换成对数极坐标（横轴幅角 θ、纵轴 ln|v|）后：等比缩放变成<b>匀速下降</b>，等差转动变成<b>匀速右移</b>，" +
          "所以那串点必定落在<b>一条直线</b>上。直线斜率 dρ/dθ = −y/x = <b>" +
          (Math.abs(S.x) < 5e-3 ? "∞（竖直：只缩不转）" : num(-S.y / S.x, 2)) + "</b>。";
      }
      if (Math.abs(S.y) < 5e-3 && Math.abs(S.x) < 5e-3) return "<b>M ≈ 1</b>：乘了等于没乘，一串值几乎重合。";
      if (Math.abs(S.y) < 5e-3 && Math.abs(S.x - Math.round(S.x)) < 1e-6)
        return "<b>z 是整数 → M = e^(2πi·n) = 1</b>：转的正好是整圈，乘了等于没乘，整串值退化成<b>一个点</b>——这时复幂是单值的。";
      if (Math.abs(S.y) < 5e-3) return "<b>y = 0 → |M| = 1</b>：只转不缩，所有值落在<b>同一个圆</b>上。";
      if (Math.abs(S.x) < 5e-3) return "<b>x = 0 → arg M = 0</b>：只缩不转，所有值落在<b>同一条射线</b>上。";
      return "每走一步：模 ×<b>" + num(m.mod, 2) + "</b>，幅角 +<b>" + num(m.arg, 1) + "</b> 弧度（" +
        num(m.arg * 180 / Math.PI, 0) + "°）。同一个动作重复 " + Keff() + " 次，就盘出一条等角螺线；" +
        "反方向做同一件事，得到往里收的另一支。";
    }
    function sync() {
      msg.innerHTML = noteHtml();
      var m = Mval(), v = v0();
      VZ.setPanel(pan, {
        "|M| = e^(−2πy)": num(m.mod, 4),
        "arg M = 2πx": num(m.arg, 3) + " rad" +
          (Math.abs(m.arg % TAU) < 0.02 ? "（整圈）" : ""),
        "v₀ 的模": num(v.r, 3),
        "v₀ 的幅角": num(v.th, 3) + " rad",
        "此刻": S.playing ? ("k = " + num(S.u, 2))
              : (S.tab === 2 ? "网格像" : (Keff() < S.K ? "可见 ±" + Keff() + " 步" : "k = −" + S.K + " … " + S.K))
      });
      paint();
    }

    /* 播放：0 → K 走一趟，再从 v₀ 出发反着走到 −K */
    var lastT = 0;
    VZ.raf(cv.cv, function (t) {
      var dt = lastT ? Math.min(0.05, t - lastT) : 0;
      lastT = t;
      if (!S.playing) return;
      var Ke = Keff();
      S.ph += dt * 1.5;
      if (S.ph > 2 * Ke) S.ph = 0;
      S.u = S.ph <= Ke ? S.ph : -(S.ph - Ke);
      paint();
    });

    sync();
    /* 进页面先自己走一遍：先看见「同一个动作被重复」 */
    setTimeout(function () {
      if (S.tab === 1 && !S.logv) {
        S.playing = true; S.u = 0; S.ph = 0;
        playBtn.textContent = "暂停"; playBtn.classList.add("on");
      }
    }, 500);
  }
}

});
