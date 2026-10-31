/* ============================================================
   viz-part16.js — 第三批挂载式小图（ch33–ch34，共 8 张）
   规格：FIG-SPEC3 — title 为空、画布 H∈[220,320]、嵌在讲解步骤下方
   ============================================================ */
VZ.define({

/* ==========================================================
   f-ch33d · 零线（挂 ch33.2 「哪束光经过它」）
   ========================================================== */
"f-ch33d": {
  title: "",
  hint: "<b>拖动金色事件 P</b>：穿过它的两条 45° 直线就是零线（光线的世界线）。读数显示 x±t 恰好不变——扭量理论的第一步，就是不再记「事件在哪」，改记「哪些零线穿过它」。",
  draw: function (stage) {
    var W = 760, H = 280, svg = VZ.S(stage, W, H, { grid: true });
    var C = VZ.C;
    var ox = 380, oy = 148, U = 110;

    VZ.ln(svg, 60, oy, 700, oy, { stroke: C.faint, "stroke-width": 1 });
    VZ.ln(svg, ox, 28, ox, 262, { stroke: C.faint, "stroke-width": 1 });
    VZ.txt(svg, 694, oy - 8, "空间 x", { size: 11, fill: C.dim, anchor: "end" });
    VZ.txt(svg, ox + 8, 38, "时间 t", { size: 11, fill: C.dim });

    /* 一族背景零线（45°） */
    for (var k = -3; k <= 3; k++) {
      if (k === 0) continue;
      var c = k * U;
      var x1 = ox + c - 190, y1 = oy - 190, x2 = ox + c + 190, y2 = oy + 190;
      VZ.path(svg, "M" + VZ.clamp(x1, 56, 704) + " " + VZ.clamp(y1, 26, 262) +
                   "L" + VZ.clamp(x2, 56, 704) + " " + VZ.clamp(y2, 26, 262),
        { stroke: C.faint, "stroke-width": .7, opacity: .55 });
      var d2 = k * U;
      VZ.path(svg, "M" + VZ.clamp(ox + d2 - 190, 56, 704) + " " + VZ.clamp(oy + 190, 26, 262) +
                   "L" + VZ.clamp(ox + d2 + 190, 56, 704) + " " + VZ.clamp(oy - 190, 26, 262),
        { stroke: C.faint, "stroke-width": .7, opacity: .35 });
    }

    /* 一些世界线：类时（可相遇）/ 类空（永不相遇） */
    VZ.path(svg, "M" + (ox + 34) + " 258L" + (ox + 34) + " 38", VZ.stroke({ stroke: C.ink, "stroke-width": 1.6 }));
    VZ.txt(svg, ox + 42, 48, "观察者世界线（类时）", { size: 10.5, fill: C.ink2 });
    VZ.ln(svg, ox - 150, oy + 40, ox + 150, oy + 40, { stroke: C.red, "stroke-width": 1.3, "stroke-dasharray": "5 4" });
    VZ.txt(svg, ox + 156, oy + 44, "类空：只有零线才可能连接", { size: 10.5, fill: C.red });

    /* 可拖事件 P 与两条零线 */
    var P = [ox + 62, oy - 74];
    var nA = VZ.path(svg, "", VZ.stroke({ stroke: C.cyan, "stroke-width": 2.2 }));
    var nB = VZ.path(svg, "", VZ.stroke({ stroke: C.mag, "stroke-width": 2.2 }));
    var pDot = VZ.circ(svg, P[0], P[1], 7, { fill: C.gold });
    VZ.circ(svg, 0, 0, 15, { fill: "none", stroke: C.gold, "stroke-width": 1, opacity: .4, "stroke-dasharray": "3 3" });
    var pRing = svg.lastChild;
    var lbl = VZ.txt(svg, 66, 44, "", { size: 13, fill: C.gold, weight: 700 });

    function nullD(px, py, sign) {
      /* 45° 线：x - t = c（sign=+1）或 x + t = c（sign=-1），t 向上为正 */
      var cc = px - sign * (oy - py);
      var a = { x1: 0, y1: 0, x2: 0, y2: 0 };
      var yTop = 26, yBot = 262;
      var xTop = sign > 0 ? cc + (oy - yTop) : cc - (oy - yTop);
      var xBot = sign > 0 ? cc + (oy - yBot) : cc - (oy - yBot);
      return "M" + VZ.clamp(xTop, 56, 704) + " " + yTop + "L" + VZ.clamp(xBot, 56, 704) + " " + yBot;
    }
    function redraw() {
      pDot.setAttribute("cx", P[0]); pDot.setAttribute("cy", P[1]);
      pRing.setAttribute("cx", P[0]); pRing.setAttribute("cy", P[1]);
      nA.setAttribute("d", nullD(P[0], P[1], 1));
      nB.setAttribute("d", nullD(P[0], P[1], -1));
      var c1 = (P[0] - ox) / U, c2 = (P[1] - oy) / U;
      lbl.textContent = "穿过 P 的零线：x − t = " + (c1 + c2).toFixed(2) + "u　x + t = " + (c1 - c2).toFixed(2) + "u";
      VZ.setPanel(info, {
        "事件 P": ((P[0] - ox) / U).toFixed(2) + " , " + ((P[1] - oy) / U).toFixed(2) + " u",
        "零线族": "x±t = 常数（45°）",
        "左行 / 右行": "两条，方向恰好反向"
      });
    }
    var info = VZ.panel(stage, { "事件 P": "", "零线族": "", "左行 / 右行": "" });
    var dragging = false;
    VZ.drag(svg, svg, W, H, function (x, y, phase) {
      if (phase === "start") dragging = Math.hypot(x - P[0], y - P[1]) < 46;
      if (!dragging) return;
      P[0] = VZ.clamp(x, 70, 690); P[1] = VZ.clamp(y, 40, 250);
      redraw();
    });
    redraw();
  }
},

/* ==========================================================
   f-ch33e · 正 / 负频率分裂（挂 ch33.7）
   ========================================================== */
"f-ch33e": {
  title: "",
  hint: "<b>拖动滑块移动水平围道</b>：围道只圈住 +ω₀ 时，左边只剩右旋的正频率分量（下半平面解析的那一半）。实信号 = 正负两半之和；扭量理论里，这两半分别住在扭量空间的上、下半。<span class='hl'>傅里叶变换把场一分为二，这一刀就是正/负频率分裂。</span>",
  draw: function (stage) {
    var W = 760, H = 300, svg = VZ.S(stage, W, H, { grid: true });
    var C = VZ.C;
    var w0 = 3.1;

    /* 左：时间域信号 = 正频半 + 负频半 */
    var lx = 56, ly = 44, lw = 320, lh = 176, mid = ly + lh / 2;
    VZ.card(svg, lx, ly, lw, lh, { stroke: C.faint });
    VZ.ln(svg, lx, mid, lx + lw, mid, { stroke: C.faint, "stroke-width": .8 });
    VZ.txt(svg, lx + 8, ly + 18, "时间域 f(t) = (正频半) + (负频半)", { size: 11.5, fill: C.ink });
    var dAll = VZ.path(svg, "", VZ.stroke({ stroke: C.ink, "stroke-width": 1.6 }));
    var dPos = VZ.path(svg, "", VZ.stroke({ stroke: C.cyan, "stroke-width": 1.4, opacity: .9 }));
    var dNeg = VZ.path(svg, "", VZ.stroke({ stroke: C.mag, "stroke-width": 1.4, opacity: .9 }));
    VZ.txt(svg, lx + 30, ly + lh + 16, "正频率半", { size: 11, fill: C.cyan });
    VZ.txt(svg, lx + 130, ly + lh + 16, "负频率半", { size: 11, fill: C.mag });

    /* 右：复 ω 平面与围道 */
    var ox = 560, oy = 132;
    VZ.ln(svg, ox - 110, oy, ox + 110, oy, { stroke: C.ink2, "stroke-width": 1.2 });
    VZ.ln(svg, ox, oy - 84, ox, oy + 84, { stroke: C.faint, "stroke-width": 1 });
    VZ.txt(svg, ox + 112, oy + 4, "Re ω", { size: 11, fill: C.dim });
    VZ.txt(svg, ox + 6, oy - 88, "Im ω", { size: 11, fill: C.dim });
    var pPlus = VZ.circ(svg, ox + 56, oy, 6.5, { fill: C.cyan });
    var pMinus = VZ.circ(svg, ox - 56, oy, 6.5, { fill: C.mag });
    VZ.txt(svg, ox + 56, oy + 22, "+ω₀", { size: 11, fill: C.cyan, anchor: "middle" });
    VZ.txt(svg, ox - 56, oy + 22, "−ω₀", { size: 11, fill: C.mag, anchor: "middle" });
    VZ.txt(svg, ox + 62, oy - 8, "下半解析=正频", { size: 9.5, fill: C.cyan });
    VZ.txt(svg, ox - 62, oy - 8, "上半解析=负频", { size: 9.5, fill: C.mag, anchor: "end" });
    var contour = VZ.path(svg, "", VZ.stroke({ stroke: C.gold, "stroke-width": 1.8, "stroke-dasharray": "7 4" }));
    var cLbl = VZ.txt(svg, ox - 108, 0, "围道 Im ω = h", { size: 11, fill: C.gold });
    var shade = VZ.path(svg, "", { fill: C.gold, opacity: .07 });
    var h = -22;

    var info = VZ.panel(stage, { "围道高度 h": "", "围道内极点": "", "围道内是": "" });
    var slider = VZ.slider(stage, { label: "分割围道 Im ω = h", value: -22, min: -80, max: 80, step: 1,
      onInput: function (v) { h = v; redraw(); } });

    function redraw() {
      contour.setAttribute("d", "M" + (ox - 108) + " " + (oy - h) + "H" + (ox + 108));
      cLbl.setAttribute("y", oy - h + (h >= 0 ? 16 : -8));
      shade.setAttribute("d", "M" + (ox - 108) + " " + (oy - h) + "H" + (ox + 108) +
        "V" + (oy + 84) + "H" + (ox - 108) + "Z");
      var inPos = -h < 0;   /* +ω0 在围道下方 ⇔ h>0 */
      var inNeg = -h < 0;   /* 同一判定域：下半平面 */
      var below = h > 0;
      VZ.setPanel(info, {
        "围道高度 h": h.toFixed(0),
        "围道内极点": below ? "+ω₀" : "（无）",
        "围道内是": below ? "正频率部分（下半平面）" : "负频率部分（上半平面）"
      });
    }
    redraw();

    VZ.raf(svg, function (t) {
      var all = "", pos = "", neg = "";
      for (var i = 0; i <= 80; i++) {
        var tt = i / 80 * 2.6 + t * .9;
        var x = lx + 14 + i / 80 * (lw - 28);
        all += (i ? "L" : "M") + x.toFixed(1) + " " + (mid - 58 * Math.cos(w0 * tt) * Math.exp(-tt * .12)).toFixed(1);
        pos += (i ? "L" : "M") + x.toFixed(1) + " " + (mid - 46 * Math.cos(w0 * tt) * Math.exp(-tt * .12)).toFixed(1);
        neg += (i ? "L" : "M") + x.toFixed(1) + " " + (mid + 24 - 46 * Math.cos(w0 * tt) * Math.exp(-tt * .12)).toFixed(1);
      }
      dAll.setAttribute("d", all);
      dPos.setAttribute("d", pos);
      dNeg.setAttribute("d", neg);
      var below = h > 0;
      dPos.setAttribute("opacity", below ? .95 : .18);
      dNeg.setAttribute("opacity", below ? .18 : .95);
    });
  }
},

/* ==========================================================
   f-ch33f · 非线性引力子构造（挂 ch33.8 中心困难）
   ========================================================== */
"f-ch33f": {
  title: "",
  hint: "<b>拖动滑块加大扰动强度 ε</b>：左边平直时空的网格被弯成引力波，右边扭量空间作相应的变形。非线性引力子的要点是：变形后的空间<span class='hl'>仍然自动满足真空场方程</span>——扭量构造把「解方程」变成了「选变形」。",
  draw: function (stage) {
    var W = 760, H = 300, svg = VZ.S(stage, W, H, { grid: true });
    var C = VZ.C;
    var eps = 0.5;

    /* 左：时空侧网格 g = η + ε·h */
    var lx = 40, ly = 52, lw = 300, lh = 170;
    VZ.card(svg, lx, ly, lw, lh, { stroke: C.faint });
    VZ.txt(svg, lx + 10, ly + 20, "时空侧：g = η + ε·h", { size: 12, fill: C.ink, weight: 700 });
    var gridG = VZ.g(svg);
    var NX = 9, NY = 5;
    function warp(x, y) {
      var cx = lx + lw / 2, cy = ly + lh / 2;
      var dx = x - cx, dy = y - cy;
      var k = Math.exp(-(dx * dx + dy * dy) / 5600);
      return [x + eps * 16 * k * dy / 40, y + eps * 20 * k * Math.sin(dx / 26)];
    }
    var gridEls = [];
    for (var i = 0; i <= NX; i++) gridEls.push({ p: VZ.path(gridG, "", VZ.stroke({ stroke: C.ink2, "stroke-width": 1 })), kind: "v", i: i });
    for (var j = 0; j <= NY; j++) gridEls.push({ p: VZ.path(gridG, "", VZ.stroke({ stroke: C.cyan, "stroke-width": 1, opacity: .8 })), kind: "h", j: j });
    function drawGrid() {
      gridEls.forEach(function (E) {
        var d = "";
        if (E.kind === "v") {
          var x = lx + 16 + E.i * (lw - 32) / NX;
          for (var s = 0; s <= 16; s++) {
            var y = ly + 26 + s * (lh - 40) / 16;
            var w = warp(x, y);
            d += (s ? "L" : "M") + w[0].toFixed(1) + " " + w[1].toFixed(1);
          }
        } else {
          var y0 = ly + 26 + E.j * (lh - 40) / NY;
          for (var s2 = 0; s2 <= 24; s2++) {
            var x0 = lx + 16 + s2 * (lw - 32) / 24;
            var w2 = warp(x0, y0);
            d += (s2 ? "L" : "M") + w2[0].toFixed(1) + " " + w2[1].toFixed(1);
          }
        }
        E.p.setAttribute("d", d);
      });
    }
    drawGrid();

    /* 中：双向箭头 */
    var ar = VZ.arrowDef(svg, VZ.uid("ar"), C.gold);
    VZ.ln(svg, 352, 130, 408, 130, { stroke: C.gold, "stroke-width": 1.6, "marker-end": ar });
    VZ.ln(svg, 408, 160, 352, 160, { stroke: C.gold, "stroke-width": 1.6, "marker-end": ar });
    VZ.txt(svg, 380, 118, "变形对应", { size: 10.5, fill: C.gold, anchor: "middle" });

    /* 右：扭量侧——变形的扭量空间（边界轮廓仍闭合） */
    var rx = 420, ry = 52, rw = 300, rh = 170;
    VZ.card(svg, rx, ry, rw, rh, { stroke: C.faint });
    VZ.txt(svg, rx + 10, ry + 20, "扭量侧：变形的扭量空间", { size: 12, fill: C.mag, weight: 700 });
    var blob = VZ.path(svg, "", VZ.stroke({ stroke: C.mag, "stroke-width": 1.8 }));
    var blobD = "";
    function drawBlob() {
      var d = "", cx = rx + rw / 2, cy = ry + rh / 2 + 8;
      for (var a = 0; a <= 32; a++) {
        var th = a / 32 * Math.PI * 2;
        var rr = 52 + eps * 13 * Math.sin(3 * th) + eps * 6 * Math.cos(2 * th);
        var x = cx + rr * Math.cos(th) * 1.15, y = cy + rr * Math.sin(th) * .72;
        d += (a ? "L" : "M") + x.toFixed(1) + " " + y.toFixed(1);
      }
      blobD = d + "Z";
      blob.setAttribute("d", blobD);
    }
    drawBlob();
    VZ.txt(svg, rx + rw / 2, ry + rh - 12, "变形后的扭量空间 PT_ε", { size: 10.5, fill: C.ink2, anchor: "middle" });

    /* 读数与滑块 */
    var info = VZ.panel(stage, { "扰动强度 ε": "", "真空方程残差": "", "构造方式": "" });
    var slider = VZ.slider(stage, { label: "扰动强度 ε", value: 0.5, min: 0, max: 1, step: 0.01,
      onInput: function (v) { eps = v; drawGrid(); drawBlob(); upd(); } });
    function upd() {
      VZ.setPanel(info, {
        "扰动强度 ε": eps.toFixed(2),
        "真空方程残差": "≈ 0 ✓（自动满足）",
        "构造方式": "扭量空间变形 → 时空解"
      });
    }
    upd();

    /* 光点沿变形边界流动：表示「编码在边界上」 */
    VZ.raf(svg, function (t) {
      var cx = rx + rw / 2, cy = ry + rh / 2 + 8;
      var th = t * .8;
      var rr = 52 + eps * 13 * Math.sin(3 * th) + eps * 6 * Math.cos(2 * th);
      var x = cx + rr * Math.cos(th) * 1.15, y = cy + rr * Math.sin(th) * .72;
      dot.setAttribute("cx", x); dot.setAttribute("cy", y);
    });
    var dot = VZ.circ(svg, rx + rw / 2, ry + rh / 2, 4, { fill: C.gold });
  }
},

/* ==========================================================
   f-ch33g · 扭量与粒子物理：无质量场的编码流程（挂 ch33.5）
   ========================================================== */
"f-ch33g": {
  title: "",
  hint: "<b>点「下一步」</b>走完编码流程：无质量粒子的动量与螺旋度 → 打包成一个扭量 Z → 场变成扭量空间里的全纯上同调类 → 边界值落回时空成为无质量场。<span class='hl'>螺旋度为零质量条件的性质，在扭量空间里是白送的。</span>",
  draw: function (stage) {
    var W = 760, H = 260, svg = VZ.S(stage, W, H, {});
    var C = VZ.C;
    var steps = [
      { t: "① 无质量粒子", d: "四维动量 p 满足 p·p = 0（零动量），附螺旋度 s。", c: C.cyan,
        det: "时空里的一切从一颗无质量粒子出发：p·p=0 是「零」的含义，s ∈ ½ℤ 是它的手性。" },
      { t: "② 打包成扭量", d: "Z = (ω, π)：动量 π 编为上分量，位置 ω 编为下分量。", c: C.gold,
        det: "扭量 Z 把动量与位置打成一体：扭量空间 PT 是 CP³ 里去掉一个 CP¹ 的区域，零性自动成立。" },
      { t: "③ 全纯场 = 上同调类", d: "无质量场 ↔ H¹(PT⁺) 中的全纯数据，与 p 的分量无关。", c: C.mag,
        det: "场方程（波动/狄拉克/麦克斯韦）翻译成「全纯 + 上同调」：扭量空间里没有微分方程，只有解析条件。" },
      { t: "④ 边界值 = 时空场", d: "沿每个时空点对应的 CP¹ 取轮廓积分，得到 Φ(x)。", c: C.green,
        det: "积分核 f(ω,π) 沿 CP¹ 回收，落回时空就是一个自动解方程的无质量场——编码完成。" }
    ];
    var bx = 36, bw = 164, gap = 24, by = 56, bh = 78;
    var boxes = [], arrowId = VZ.arrowDef(svg, VZ.uid("ar"), C.ink2);
    steps.forEach(function (st, i) {
      var x = bx + i * (bw + gap);
      var g = VZ.g(svg);
      VZ.card(g, x, by, bw, bh, { stroke: C.faint, fill: "rgba(255,255,255,.035)" });
      VZ.txt(g, x + 12, by + 24, st.t, { size: 13, fill: st.c, weight: 700 });
      VZ.para(g, x + 12, by + 44, st.d, { size: 10.5, per: 15, lh: 15, fill: C.ink2 });
      boxes.push(g);
      if (i < 3) {
        var ax = x + bw;
        VZ.ln(svg, ax + 3, by + bh / 2, ax + gap - 3, by + bh / 2, { stroke: C.ink2, "stroke-width": 1.4, "marker-end": arrowId, opacity: .7 });
      }
    });

    /* 下方说明卡 */
    var dy = 152;
    VZ.card(svg, 36, dy, 688, 62, { stroke: "rgba(255,255,255,.12)", fill: "rgba(255,255,255,.04)" });
    var dTitle = VZ.txt(svg, 52, dy + 24, "", { size: 13, weight: 700 });
    var dBody = VZ.txt(svg, 52, dy + 46, "", { size: 11.5, fill: C.ink2 });

    var row = VZ.box(stage, "viz-ctl");
    var cur = 0;
    var flow = [];
    function show(k) {
      cur = k;
      dTitle.textContent = steps[k].det.split("：")[0];
      dTitle.setAttribute("fill", steps[k].c);
      dBody.textContent = steps[k].det.slice(steps[k].det.indexOf("：") + 1);
      flow.forEach(function (f) { f.remove(); });
      flow = [];
      boxes.forEach(function (b, i) {
        var r = b.querySelector("rect");
        r.setAttribute("stroke", i <= k ? steps[i].c : C.faint);
        r.setAttribute("stroke-width", i === k ? 2.2 : 1);
        r.setAttribute("fill", i === k ? "rgba(255,255,255,.09)" : "rgba(255,255,255,.035)");
      });
      for (var i = 0; i <= k; i++) {
        var x = bx + i * (bw + gap);
        if (i > 0) {
          var d = "M" + (x - gap + 2) + " " + (by + bh / 2) + "H" + (x - 4);
          var stop = VZ.travel(svg, d, { color: steps[i].c, dur: 1.1, count: 1, r: 3 });
          flow.push({ remove: stop });
        }
      }
    }
    VZ.btn(row, "← 上一步", function () { show(Math.max(0, cur - 1)); });
    VZ.btn(row, "下一步 →", function () { show(Math.min(3, cur + 1)); });
    VZ.btn(row, "重播", function () { show(0); });
    show(0);
  }
},

/* ==========================================================
   f-ch34d · 两大支柱的不相容（挂 ch34.1）
   ========================================================== */
"f-ch34d": {
  title: "",
  hint: "<b>点击下方三个冲突按钮</b>：每次都会高亮量子支柱与时空支柱各自伸出的依赖线，以及它们相撞的那一点。<span class='hl'>两根支柱各自极成功，但它们的公理在正中央互相矛盾——这就是第 34 章开场的那道缝。</span>",
  draw: function (stage) {
    var W = 760, H = 300, svg = VZ.S(stage, W, H, {});
    var C = VZ.C;

    /* 左右两根支柱 */
    function pillar(x, title, color, items) {
      VZ.txt(svg, x + 90, 34, title, { size: 14, fill: color, weight: 700, anchor: "middle" });
      var out = [];
      items.forEach(function (s, i) {
        var y = 52 + i * 46;
        VZ.card(svg, x, y, 180, 38, { stroke: color, sw: 1, fill: "rgba(255,255,255,.04)" });
        VZ.txt(svg, x + 90, y + 24, s, { size: 11.5, fill: C.ink, anchor: "middle" });
        out.push([x + 180, y + 19, s]);
      });
      return out;
    }
    var Q = pillar(30, "量子支柱", C.cyan, ["线性叠加 U", "不确定关系", "固定的平直背景"]);
    var G = pillar(550, "时空支柱", C.gold, ["动力学弯曲度规", "广义协变", "奇点定理"]);

    /* 三个冲突点 */
    var clashes = [
      { y: 84, label: "叠加原理 × 弯曲时空", c: C.red,
        det: "叠加态的「环境」本身没有定义：几何该处于哪个构形的叠加？量子线性 U 与几何的非线性自洽互不让步。" },
      { y: 152, label: "奇点 × 量子场论失效", c: C.red,
        det: "广义相对论预言自己的失效点：奇点处曲率发散，QFT 需要的背景在那里不复存在。两根支柱在此同时断裂。" },
      { y: 220, label: "大爆炸初态 × 不可推知", c: C.red,
        det: "初态的熵极低（〈10^(10^123) 分之一），这不是任何一方公理的推论——初始条件悬在两套理论之间。" }
    ];
    var linkQ = [], linkG = [], clashEls = [];
    clashes.forEach(function (cl) {
      linkQ.push(VZ.path(svg, "", VZ.stroke({ stroke: C.cyan, "stroke-width": 1.3, opacity: .25, "stroke-dasharray": "5 4" })));
      linkG.push(VZ.path(svg, "", VZ.stroke({ stroke: C.gold, "stroke-width": 1.3, opacity: .25, "stroke-dasharray": "5 4" })));
      var g = VZ.g(svg, { style: "cursor:pointer" });
      VZ.circ(g, 380, cl.y, 15, { fill: "rgba(10,6,28,.94)", stroke: C.faint, "stroke-width": 1.5 });
      VZ.txt(g, 380, cl.y + 5, "✕", { size: 13, fill: C.faint, anchor: "middle", weight: 700 });
      clashEls.push(g);
      g.addEventListener("click", function () { pick(cl); });
    });

    /* 说明面板 */
    var dy = 252;
    VZ.card(svg, 30, dy, 700, 40, { stroke: "rgba(255,255,255,.12)", fill: "rgba(255,255,255,.04)" });
    var dTxt = VZ.txt(svg, 46, dy + 25, "点击中央的 ✕ 或下方按钮，查看一个具体的冲突点", { size: 12, fill: C.ink2 });

    function pick(cl) {
      var k = clashes.indexOf(cl);
      /* 高亮：量子侧取相应依赖、时空侧取相应依赖 */
      var qSrc = [Q[0], Q[0], Q[2]][k], gSrc = [G[0], G[2], G[0]][k];
      linkQ.forEach(function (L, i) {
        var on = i === k;
        L.setAttribute("d", "M" + qSrc[0] + " " + qSrc[1] + "C" + (qSrc[0] + 60) + " " + qSrc[1] + " " + (330) + " " + clashes[i].y + " 363 " + clashes[i].y);
        L.setAttribute("opacity", on ? .95 : .16);
        L.setAttribute("stroke-width", on ? 2.2 : 1.2);
      });
      linkG.forEach(function (L, i) {
        var on = i === k;
        L.setAttribute("d", "M" + gSrc[0] + " " + gSrc[1] + "C" + (gSrc[0] - 60) + " " + gSrc[1] + " " + (430) + " " + clashes[i].y + " 397 " + clashes[i].y);
        L.setAttribute("opacity", on ? .95 : .16);
        L.setAttribute("stroke-width", on ? 2.2 : 1.2);
      });
      clashEls.forEach(function (g, i) {
        var c = g.querySelector("circle"), t = g.querySelector("text");
        c.setAttribute("stroke", i === k ? clashes[k].c : C.faint);
        c.setAttribute("stroke-width", i === k ? 2.4 : 1.5);
        t.setAttribute("fill", i === k ? clashes[k].c : C.faint);
      });
      dTxt.textContent = clashes[k].label + " —— " + clashes[k].det.slice(0, 52) + "…";
      dTxt.setAttribute("fill", C.ink);
    }

    var row = VZ.box(stage, "viz-ctl");
    clashes.forEach(function (cl) {
      VZ.btn(row, cl.label.split(" × ")[0] + " × " + cl.label.split(" × ")[1], function () { pick(cl); });
    });
    pick(clashes[0]);
  }
},

/* ==========================================================
   f-ch34e · 数学驱动 vs 实验驱动（挂 ch34.2）
   ========================================================== */
"f-ch34e": {
  title: "",
  hint: "<b>点击时间线上的任意里程碑</b>：上看数学驱动的路线（先有美，后找实验），下看实验驱动的路线（先有异常，后造理论）。<span class='hl'>两条路线都赢过、也都输过——作者要说的正是：没有一把尺子能事先告诉你走哪条。</span>",
  draw: function (stage) {
    var W = 760, H = 300, svg = VZ.S(stage, W, H, {});
    var C = VZ.C;
    var lanes = [
      { y: 84, c: C.cyan, name: "数学驱动 · 先有定理，后找实验",
        pts: [["1854", "黎曼几何", "为几何而几何；60 年后成了广义相对论的语言。"],
              ["1954", "杨–米尔斯", "从对称性硬造出的理论；20 年后才接上实验。"],
              ["1980s", "弦论", "自洽又优美；至今没有拿到一张实验牌照。"]],
        x0: 90, x1: 700 },
      { y: 196, c: C.gold, name: "实验驱动 · 先有异常，后造理论",
        pts: [["1887", "以太漂移", "迈克耳孙–莫雷的零结果，逼出狭义相对论。"],
              ["1900", "黑体辐射", "紫外灾难的谱线，逼出量子假说。"],
              ["2012", "希格斯粒子", "48 年前的预言被 LHC 兑现——实验路线的典范。"]],
        x0: 90, x1: 700 }
    ];
    var nodes = [];
    lanes.forEach(function (L) {
      VZ.txt(svg, L.x0 - 6, L.y - 30, L.name, { size: 12.5, fill: L.c, weight: 700 });
      VZ.ln(svg, L.x0, L.y, L.x1, L.y, { stroke: C.faint, "stroke-width": 1.4 });
      var mv = VZ.circ(svg, L.x0, L.y, 2.8, { fill: L.c, opacity: .85 });
      VZ.raf(svg, function (t) {
        var u = (t / 6) % 1;
        mv.setAttribute("cx", L.x0 + (L.x1 - L.x0) * u);
      });
      L.pts.forEach(function (p, i) {
        var x = L.x0 + (L.x1 - L.x0) * (0.18 + 0.32 * i);
        var g = VZ.g(svg, { style: "cursor:pointer" });
        VZ.circ(g, x, L.y, 7, { fill: L.c });
        VZ.txt(g, x, L.y + (L.y === 84 ? -16 : 22), p[0] + " " + p[1], { size: 11, fill: C.ink, anchor: "middle" });
        nodes.push({ g: g, lane: L, p: p, x: x, y: L.y, c: L.c });
        g.addEventListener("click", function () { pick(nodes[nodes.length - 1]); });
      });
    });

    /* 详情面板 */
    var dy = 234;
    VZ.card(svg, 30, dy, 700, 52, { stroke: "rgba(255,255,255,.12)", fill: "rgba(255,255,255,.04)" });
    var dT = VZ.txt(svg, 46, dy + 21, "", { size: 12.5, weight: 700 });
    var dB = VZ.txt(svg, 46, dy + 42, "点击任一里程碑，看它属于哪条路线、以及它后来的命运", { size: 11.5, fill: C.ink2 });

    function pick(N) {
      dT.textContent = N.p[0] + " · " + N.p[1] + "（" + (N.lane.y === 84 ? "数学驱动" : "实验驱动") + "）";
      dT.setAttribute("fill", N.c);
      dB.textContent = N.p[2];
      nodes.forEach(function (n) {
        var c = n.g.querySelector("circle");
        var on = n === N;
        c.setAttribute("r", on ? 10 : 7);
        c.setAttribute("fill", on ? C.ink : n.c);
      });
    }
    pick(nodes[0]);
  }
},

/* ==========================================================
   f-ch34f · 时尚在物理学中的作用（挂 ch34.3）
   ========================================================== */
"f-ch34f": {
  title: "",
  hint: "<b>拖动年份滑块</b>扫过 1985–2026：弦论方向的研究者数量一路爬升，而下方「实验验证」一栏始终是零。<span class='hl'>菜单上排第一的菜未必最好吃——研究者数量衡量的是时尚，不是真理。</span>",
  draw: function (stage) {
    var W = 760, H = 280, svg = VZ.S(stage, W, H, {});
    var C = VZ.C;
    var x0 = 70, x1 = 700, y0 = 40, y1 = 210, yr0 = 1985, yr1 = 2026;
    var data = [[1985, 60], [1988, 260], [1991, 700], [1995, 1900], [1998, 2400], [2002, 3200], [2006, 4200], [2010, 5000], [2014, 4400], [2018, 3900], [2022, 3400], [2026, 3100]];
    var ymax = 5200;

    function X(yr) { return x0 + (x1 - x0) * (yr - yr0) / (yr1 - yr0); }
    function Y(v) { return y1 - (y1 - y0) * v / ymax; }

    /* 网格与轴 */
    [0, 2500, 5000].forEach(function (v) {
      VZ.ln(svg, x0, Y(v), x1, Y(v), { stroke: C.faint, "stroke-width": .7, "stroke-dasharray": "3 5" });
      VZ.txt(svg, x0 - 8, Y(v) + 4, String(v), { size: 10, fill: C.dim, anchor: "end" });
    });
    [1985, 1995, 2005, 2015, 2026].forEach(function (yr) {
      VZ.txt(svg, X(yr), y1 + 16, String(yr), { size: 10, fill: C.dim, anchor: "middle" });
    });

    /* 面积与曲线 */
    var dArea = "M" + X(data[0][0]) + " " + y1;
    data.forEach(function (d) { dArea += "L" + X(d[0]).toFixed(1) + " " + Y(d[1]).toFixed(1); });
    dArea += "L" + X(data[data.length - 1][0]) + " " + y1 + "Z";
    VZ.path(svg, dArea, { fill: C.violet, opacity: .14 });
    var dLine = data.map(function (d, i) { return (i ? "L" : "M") + X(d[0]).toFixed(1) + " " + Y(d[1]).toFixed(1); }).join("");
    VZ.path(svg, dLine, VZ.stroke({ stroke: C.violet, "stroke-width": 2.2 }));

    /* 事件标记 */
    var events = [[1985, "第一次超弦革命"], [1995, "第二次革命 · M 理论"], [2012, "希格斯（别的理论）被验证"]];
    events.forEach(function (e) {
      VZ.ln(svg, X(e[0]), y0, X(e[0]), y1, { stroke: e[0] === 2012 ? C.gold : C.faint, "stroke-width": .8, "stroke-dasharray": "4 4" });
      VZ.txt(svg, X(e[0]) + 4, y0 + 10, e[1], { size: 9.5, fill: e[0] === 2012 ? C.gold : C.dim });
    });

    /* 游标 */
    var cur = VZ.ln(svg, x0, y0, x0, y1, { stroke: C.ink, "stroke-width": 1.2, opacity: .8 });
    var curDot = VZ.circ(svg, x0, Y(60), 5, { fill: C.ink });
    function interp(yr) {
      for (var i = 0; i < data.length - 1; i++) {
        if (yr >= data[i][0] && yr <= data[i + 1][0]) {
          var u = (yr - data[i][0]) / (data[i + 1][0] - data[i][0]);
          return VZ.lerp(data[i][1], data[i + 1][1], u);
        }
      }
      return data[data.length - 1][1];
    }
    var info = VZ.panel(stage, { "年份": "", "弦论方向研究者（估）": "", "已获实验验证的预言": "" });
    VZ.slider(stage, { label: "年份", value: 1985, min: yr0, max: yr1, step: 1, format: function (v) { return String(Math.round(v)); },
      onInput: function (v) {
        var xx = X(v), vv = interp(v);
        cur.setAttribute("x1", xx); cur.setAttribute("x2", xx);
        curDot.setAttribute("cx", xx); curDot.setAttribute("cy", Y(vv));
        VZ.setPanel(info, { "年份": String(Math.round(v)), "弦论方向研究者（估）": Math.round(vv) + " 人", "已获实验验证的预言": "0 条" });
      } });
    VZ.setPanel(info, { "年份": "1985", "弦论方向研究者（估）": "60 人", "已获实验验证的预言": "0 条" });
  }
},

/* ==========================================================
   f-ch34g · 一个成功理论的三张牌照（挂 ch34.8 美与奇迹）
   ========================================================== */
"f-ch34g": {
  title: "",
  hint: "<b>依次点击三张牌照</b>：自洽、与旧理论衔接、可检验——每点一张盖一个章，三张集齐才会出现「奇迹」。任何一张缺席，理论都只是「候选」；弦论目前卡在第三张上。",
  draw: function (stage) {
    var W = 760, H = 300, svg = VZ.S(stage, W, H, {});
    var C = VZ.C;
    var cards = [
      { t: "牌照① 自洽", c: C.cyan, x: 40,
        det: "数学上不能自相矛盾：量子化不破坏幺正性，反常必须相消。这一关淘汰了大多数漂亮的猜想。" },
      { t: "牌照② 与旧理论衔接", c: C.gold, x: 280,
        det: "对应原理：低速时回到牛顿，弱场时回到广义相对论，ħ→0 时回到经典。新理论必须把旧理论作为极限包含进来。" },
      { t: "牌照③ 可检验", c: C.green, x: 520,
        det: "能给出可被实验判死的预言。这是最严酷的一关：做不到，理论就永远停留在数学的美学层面。" }
    ];
    var stamped = [false, false, false];
    var cardEls = [], stampEls = [];

    cards.forEach(function (cd, i) {
      var g = VZ.g(svg, { style: "cursor:pointer" });
      VZ.card(g, cd.x, 44, 200, 110, { stroke: cd.c, sw: 1.4, fill: "rgba(255,255,255,.045)" });
      VZ.txt(g, cd.x + 100, 76, cd.t, { size: 13.5, fill: cd.c, weight: 700, anchor: "middle" });
      VZ.para(g, cd.x + 16, 94, cd.det.split("：")[0] + "：" + cd.det.slice(cd.det.indexOf("：") + 1, cd.det.indexOf("：") + 21) + "…", { size: 10, per: 19, lh: 14 });
      var st = VZ.txt(g, cd.x + 100, 140, "", { size: 20, fill: cd.c, anchor: "middle", weight: 700 });
      stampEls.push(st);
      cardEls.push({ g: g, cd: cd });
      g.addEventListener("click", function () { click(i); });
    });

    /* 详情面板 */
    var dT = VZ.txt(svg, 40, 190, "点击一张牌照，看它考什么", { size: 13, weight: 700, fill: C.ink });
    var dB = VZ.txt(svg, 40, 212, "三张牌照都盖满，才轮得到「奇迹」这个词。", { size: 11.5, fill: C.ink2 });

    /* 奇迹横幅 */
    var banner = VZ.g(svg, { opacity: 0 });
    VZ.card(banner, 200, 234, 360, 48, { stroke: C.gold, sw: 2, fill: "rgba(255,207,92,.10)" });
    VZ.txt(banner, 380, 264, "✦ 奇迹：三张牌照集齐，理论才算立住了 ✦", { size: 14.5, fill: C.gold, weight: 700, anchor: "middle" });

    function click(i) {
      stamped[i] = true;
      stampEls[i].textContent = "✓ 已颁发";
      dT.textContent = cards[i].t;
      dT.setAttribute("fill", cards[i].c);
      dB.textContent = cards[i].det;
      if (stamped.every(function (s) { return s; })) {
        banner.setAttribute("opacity", 1);
        dT.textContent = "奇迹（miracle）";
        dT.setAttribute("fill", C.gold);
        dB.textContent = "三关都过时，物理学家才敢说「这不是巧合」——广义相对论就是靠这个字拿到的。";
      }
      cardEls[i].g.querySelector("rect").setAttribute("stroke-width", 2.4);
    }
    var row = VZ.box(stage, "viz-ctl");
    VZ.btn(row, "重置", function () {
      stamped = [false, false, false];
      stampEls.forEach(function (s) { s.textContent = ""; });
      cardEls.forEach(function (e) { e.g.querySelector("rect").setAttribute("stroke-width", 1.4); });
      banner.setAttribute("opacity", 0);
      dT.textContent = "点击一张牌照，看它考什么";
      dT.setAttribute("fill", C.ink);
      dB.textContent = "三张牌照都盖满，才轮得到「奇迹」这个词。";
    });
  }
}

});
