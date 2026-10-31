/* viz-part10.js — 第三批挂载式小图（ch9–ch12，每章 4 张 d/e/f/g） */
VZ.define({

/* ========================================================
   ch9 · d  正交性：不同频率相乘，积分为零
   ======================================================== */
"f-ch09d": {
  title: "",
  hint: "拖动滑块换频率 n，扫动的亮线在实时累加 sin 3x·sin nx 的面积：n ≠ 3 时正负面积正好抵消、积分恒为 0，只有 n = 3 时跳到 π。<span class='hl'>这就是傅里叶系数公式能「挑出单一频率」的正交性。</span>",
  draw: function (stage) {
    var W = 760, H = 260, svg = VZ.S(stage, W, H, { grid: true });
    var C = VZ.C, M = 3;
    var x0 = 64, x1 = 470, yc = 126, A = 76;
    var n = 1, N = 420;
    var pts = [], cum = [];

    VZ.ln(svg, x0 - 10, yc, x1 + 16, yc, { stroke: C.faint, "stroke-width": 1 });
    [1, 2].forEach(function (k) {
      VZ.txt(svg, x0 - 16, yc - k * A / 2 + 4, String(k), { size: 10, fill: C.dim, anchor: "end" });
      VZ.txt(svg, x0 - 16, yc + k * A / 2 + 4, "−" + k, { size: 10, fill: C.dim, anchor: "end" });
    });
    VZ.txt(svg, x0 - 16, yc + 4, "0", { size: 10, fill: C.dim, anchor: "end" });
    VZ.txt(svg, (x0 + x1) / 2, 246, "x：0 → 2π", { size: 11, fill: C.dim, anchor: "middle" });

    var areaP = VZ.path(svg, "", { fill: C.cyan, "fill-opacity": .17, stroke: "none" });
    var areaN = VZ.path(svg, "", { fill: C.mag, "fill-opacity": .15, stroke: "none" });
    var curve = VZ.path(svg, "", VZ.stroke({ stroke: C.cyan, "stroke-width": 2 }));
    var sweep = VZ.ln(svg, x0, 36, x0, 216, { stroke: C.gold, "stroke-width": 1.3, "stroke-dasharray": "4 3" });
    var dot = VZ.circ(svg, x0, yc, 5, { fill: C.gold });

    /* 右侧读数卡 */
    VZ.card(svg, 510, 44, 224, 156, { stroke: C.faint });
    VZ.txt(svg, 622, 72, "∫₀²π sin " + M + "x · sin nx dx", { size: 14, fill: C.gold, anchor: "middle" });
    VZ.txt(svg, 622, 74, "", { size: 1, fill: C.gold, anchor: "middle" });
    var big = VZ.txt(svg, 622, 122, "…", { size: 30, fill: C.ink, anchor: "middle", weight: 700 });
    var fin = VZ.txt(svg, 622, 152, "", { size: 13, fill: C.dim, anchor: "middle" });
    VZ.txt(svg, 622, 182, "n = m 时才不为零", { size: 12, fill: C.dim, anchor: "middle" });

    var out = VZ.panel(stage, { "对比频率 n": "1", "固定频率 m": String(M), "扫过比例": "0 %" });

    function rebuild() {
      pts = []; cum = [0];
      var prev = 0;
      for (var i = 0; i <= N; i++) {
        var x = 2 * Math.PI * i / N;
        var v = Math.sin(M * x) * Math.sin(n * x);
        var px = x0 + (x1 - x0) * i / N;
        pts.push([px, yc - v * A, v]);
        if (i > 0) {
          var dx = 2 * Math.PI / N;
          cum.push(cum[i - 1] + 0.5 * (v + prev) * dx);
        }
        prev = v;
      }
      /* 正负面积分块填色 */
      function runPoly(sign) {
        var d = "", run = null;
        function flush() {
          if (run && run.length > 1) {
            d += "M" + run[0][0] + " " + yc;
            run.forEach(function (p) { d += "L" + p[0] + " " + p[1]; });
            d += "L" + run[run.length - 1][0] + " " + yc + "Z";
          }
          run = null;
        }
        pts.forEach(function (p) {
          if ((sign > 0 && p[2] >= 0) || (sign < 0 && p[2] < 0)) { (run = run || []).push(p); }
          else flush();
        });
        flush();
        return d;
      }
      areaP.setAttribute("d", runPoly(1));
      areaN.setAttribute("d", runPoly(-1));
      curve.setAttribute("d", pts.map(function (p, i) { return (i ? "L" : "M") + p[0] + " " + p[1]; }).join(""));
      out.querySelector && null;
      VZ.setPanel(out, { "对比频率 n": String(n), "固定频率 m": String(M) });
      fin.textContent = "n ≠ " + M + " → 0     n = " + M + " → π";
      big.setAttribute("fill", n === M ? C.gold : C.cyan);
    }
    rebuild();

    VZ.slider(stage, { label: "对比频率 n", value: 1, min: 1, max: 6, step: 1,
      onInput: function (v) { n = v; rebuild(); } });

    var stop = VZ.raf(svg, function (t) {
      var u = (t / 4.5) % 1;
      var fi = u * N, i0 = Math.floor(fi), fr = fi - i0;
      var i1 = Math.min(i0 + 1, N);
      var px = VZ.lerp(pts[i0][0], pts[i1][0], fr);
      var py = VZ.lerp(pts[i0][1], pts[i1][1], fr);
      var val = VZ.lerp(cum[i0], cum[i1], fr);
      sweep.setAttribute("x1", px); sweep.setAttribute("x2", px);
      dot.setAttribute("cx", px); dot.setAttribute("cy", py);
      big.textContent = val.toFixed(3) + (n === M ? " → π" : " → 0");
      VZ.setPanel(out, { "扫过比例": Math.round(u * 100) + " %" });
    });
    void stop;
  }
},

/* ========================================================
   ch9 · e  调音台：左边时域波形，右边频域推子
   ======================================================== */
"f-ch09e": {
  title: "",
  hint: "右边的三根<b>推子</b>就是频域：每根控制一个纯音（1 倍频 / 2 倍频 / 3 倍频）的音量。<b>拖动推子</b>，左边的时域波形立刻变形——任何周期信号都可以看成这样一排纯音的叠加，傅里叶级数做的就是在「波形」与「推子表」之间来回翻译。",
  draw: function (stage) {
    var W = 760, H = 250, svg = VZ.S(stage, W, H, { grid: true });
    var C = VZ.C;
    var x0 = 50, x1 = 470, yc = 120, A = 78;
    var amp = [0.85, 0.35, 0.18];
    var cols = [C.cyan, C.gold, C.mag];

    VZ.ln(svg, x0 - 10, yc, x1 + 14, yc, { stroke: C.faint, "stroke-width": 1 });
    VZ.txt(svg, (x0 + x1) / 2, 236, "时域：一个周期内的波形", { size: 12, fill: C.dim, anchor: "middle" });
    VZ.txt(svg, 610, 236, "频域：推子表", { size: 12, fill: C.dim, anchor: "middle" });

    var wave = VZ.path(svg, "", VZ.stroke({ stroke: C.ink, "stroke-width": 2 }));

    /* 推子 */
    var yTop = 42, yBot = 198;
    var handles = [], valTxts = [];
    for (var k = 0; k < 3; k++) {
      var fx = 540 + k * 62;
      VZ.ln(svg, fx, yTop, fx, yBot, { stroke: C.faint, "stroke-width": 4, "stroke-linecap": "round" });
      VZ.ln(svg, fx - 9, yBot, fx + 9, yBot, { stroke: C.dim, "stroke-width": 1.4 });
      var h = VZ.circ(svg, fx, yBot - amp[k] * (yBot - yTop), 10,
        { fill: cols[k], stroke: C.deep, "stroke-width": 2, style: "cursor:grab" });
      handles.push(h);
      VZ.txt(svg, fx, yBot + 18, String(k + 1) + " 倍频", { size: 11, fill: C.dim, anchor: "middle" });
      var vt = VZ.txt(svg, fx, yTop - 10, amp[k].toFixed(2), { size: 11, fill: cols[k], anchor: "middle", weight: 700 });
      valTxts.push(vt);
      (function (idx, handle) {
        VZ.drag(svg, handle, W, H, function (x, y, ph) {
          if (ph === "move" || ph === "start") {
            var yy = VZ.clamp(y, yTop, yBot);
            amp[idx] = (yBot - yy) / (yBot - yTop);
            handle.setAttribute("cy", yy);
            valTxts[idx].textContent = amp[idx].toFixed(2);
          }
        });
      })(k, h);
    }

    var out = VZ.panel(stage, { "a₁": "0.85", "a₂": "0.35", "a₃": "0.18" });
    function syncPanel() {
      VZ.setPanel(out, { "a₁": amp[0].toFixed(2), "a₂": amp[1].toFixed(2), "a₃": amp[2].toFixed(2) });
    }

    var ph = 0;
    VZ.raf(svg, function (t, dt) {
      void t;
      ph += dt * 1.1;
      var d = "";
      for (var i = 0; i <= 200; i++) {
        var u = i / 200;
        var v = 0;
        for (var j = 0; j < 3; j++) v += amp[j] * Math.sin(2 * Math.PI * (j + 1) * u - ph * (0.8 + j * 0.45));
        var px = x0 + (x1 - x0) * u, py = yc - v * A;
        d += (i ? "L" : "M") + px.toFixed(1) + " " + py.toFixed(1);
      }
      wave.setAttribute("d", d);
    });
    handles.forEach(function (h, i) {
      var obs = new MutationObserver(syncPanel);
      obs.observe(h, { attributes: true, attributeFilter: ["cy"] });
    });
  }
},

/* ========================================================
   ch9 · f  热传导：高温分布的各傅里叶模以不同速度衰减
   ======================================================== */
"f-ch09f": {
  title: "",
  hint: "这是傅里叶当年研究的热传导：环上一块<b>高温区</b>随时间抹平。右边的频谱条显示每个模的振幅——<b>n 越大衰减越快</b>（速率 ∝ n²），所以尖峰很快变圆滑。<b>拖「锐度」</b>把热源捏得越尖，高频推子起初就越高，衰减得也越狠。",
  draw: function (stage) {
    var W = 760, H = 260, svg = VZ.S(stage, W, H, { grid: true });
    var C = VZ.C;
    var x0 = 56, x1 = 440, yc = 120, A = 80;
    var b0 = 480, bw = 290, by = 200;
    var NM = 8, sig = 0.35, t = 0;
    var aC = [], aS = [];

    VZ.ln(svg, x0 - 8, yc, x1 + 10, yc, { stroke: C.faint, "stroke-width": 1 });
    VZ.txt(svg, (x0 + x1) / 2, 248, "环上的温度分布 T(x, t)", { size: 12, fill: C.dim, anchor: "middle" });
    VZ.txt(svg, b0 + bw / 2, 248, "频谱：各模振幅（越黄衰减越快）", { size: 12, fill: C.dim, anchor: "middle" });

    var curve = VZ.path(svg, "", VZ.stroke({ stroke: C.gold, "stroke-width": 2 }));
    var heatFill = VZ.path(svg, "", { fill: C.gold, "fill-opacity": .13, stroke: "none" });
    var bars = [], barTxts = [];
    var modeCols = [C.cyan, C.cyan, C.ink2, C.ink2, C.gold, C.gold, C.red, C.red];
    for (var k = 0; k < NM; k++) {
      var bx = b0 + (k + 0.5) * (bw / NM);
      var r = VZ.el("rect", { x: bx - 11, y: by, width: 22, height: 0, rx: 3, fill: modeCols[k], opacity: .85 }, svg);
      bars.push(r);
      barTxts.push(VZ.txt(svg, bx, by + 14, String(k + 1), { size: 10, fill: C.dim, anchor: "middle" }));
    }
    VZ.ln(svg, b0, by, b0 + bw, by, { stroke: C.faint, "stroke-width": 1 });

    var out = VZ.panel(stage, { "时间 t": "0.0", "热源宽度 σ": "0.35", "最高温": "1.00" });

    function coeffs() {
      aC = []; aS = [];
      var NS = 240;
      for (var m = 1; m <= NM; m++) {
        var sc = 0, ss = 0;
        for (var i = 0; i < NS; i++) {
          var x = 2 * Math.PI * i / NS;
          var T0 = Math.exp(-Math.pow(x - Math.PI * 0.72, 2) / (2 * sig * sig));
          sc += T0 * Math.cos(m * x); ss += T0 * Math.sin(m * x);
        }
        aC.push(sc / NS * 2); aS.push(ss / NS * 2);
      }
    }
    function T(x) {
      var v = aC[0] * 0; /* 常数项不画（衰减最慢但只是抬高基线） */
      for (var m = 1; m <= NM; m++) {
        var e = Math.exp(-m * m * t * 0.09);
        v += e * (aC[m - 1] * Math.cos(m * x) + aS[m - 1] * Math.sin(m * x));
      }
      return v;
    }
    function redraw() {
      var d = "", mx = -1e9;
      for (var i = 0; i <= 200; i++) {
        var x = 2 * Math.PI * i / 200;
        var v = T(x);
        if (v > mx) mx = v;
        var px = x0 + (x1 - x0) * i / 200, py = yc - v * A;
        d += (i ? "L" : "M") + px.toFixed(1) + " " + py.toFixed(1);
      }
      curve.setAttribute("d", d);
      heatFill.setAttribute("d", d + "L" + x1 + " " + yc + "L" + x0 + " " + yc + "Z");
      for (var m = 0; m < NM; m++) {
        var mag = Math.hypot(aC[m], aS[m]) * Math.exp(-(m + 1) * (m + 1) * t * 0.09);
        var hgt = VZ.clamp(mag * A * 0.85, 0, 108);
        bars[m].setAttribute("y", by - hgt);
        bars[m].setAttribute("height", hgt);
      }
      VZ.setPanel(out, { "时间 t": t.toFixed(1), "热源宽度 σ": sig.toFixed(2), "最高温": Math.max(mx, 0).toFixed(2) });
    }
    coeffs(); redraw();

    VZ.slider(stage, { label: "热源锐度（σ 越小越尖）", value: 0.35, min: 0.15, max: 0.8, step: 0.01,
      format: function (v) { return v.toFixed(2); },
      onInput: function (v) { sig = v; t = 0; coeffs(); redraw(); } });
    VZ.btn(stage, "重新加热（t = 0）", function () { t = 0; redraw(); });

    VZ.raf(svg, function (tt, dt) {
      void tt;
      t += dt * 0.55;
      if (t > 12) t = 0;
      redraw();
    });
  }
},

/* ========================================================
   ch9 · g  超函数思想：台阶的导数是 δ
   ======================================================== */
"f-ch09g": {
  title: "",
  hint: "把 <b>ε 滑小</b>：上图的光滑斜坡越来越陡，逼近一个不连续的台阶；下图的导数随之变成一记又高又窄的脉冲，逼近 δ 函数——但峰下面积<b>始终等于 1</b>。<span class='hl'>超函数的态度：不纠结「台阶在跳变点导数不存在」，直接说它的导数就是 δ。</span>",
  draw: function (stage) {
    var W = 760, H = 290, svg = VZ.S(stage, W, H);
    var C = VZ.C;
    var x0 = 70, x1 = 470;
    var fTop = 40, fBot = 118;      /* 上图 f 值域 0..1 */
    var dTop = 158, dBot = 262;     /* 下图 f' 值域 0..vmax */
    var eps = 0.28, VMAX = 0.5 / 0.04;

    /* 上图框 */
    VZ.ln(svg, x0, fBot, x1, fBot, { stroke: C.faint, "stroke-width": 1 });
    VZ.txt(svg, x0 - 12, fTop + 8, "1", { size: 10, fill: C.dim, anchor: "end" });
    VZ.txt(svg, x0 - 12, fBot + 4, "0", { size: 10, fill: C.dim, anchor: "end" });
    VZ.txt(svg, (x0 + x1) / 2, fBot + 20, "台阶函数 f(x) = ½(1 + tanh x/ε)", { size: 12, fill: C.dim, anchor: "middle" });
    VZ.txt(svg, 620, fTop + 14, "函数 f：光滑 → 台阶", { size: 12.5, fill: C.ink2, anchor: "middle" });
    /* 下图框 */
    VZ.ln(svg, x0, dBot, x1, dBot, { stroke: C.faint, "stroke-width": 1 });
    VZ.txt(svg, (x0 + x1) / 2, dBot + 20, "导数 f′(x)：脉冲 → δ", { size: 12, fill: C.dim, anchor: "middle" });
    VZ.txt(svg, 620, dTop + 12, "导数 f′：钟形 → δ", { size: 12.5, fill: C.ink2, anchor: "middle" });

    var fCurve = VZ.path(svg, "", VZ.stroke({ stroke: C.cyan, "stroke-width": 2 }));
    var dCurve = VZ.path(svg, "", VZ.stroke({ stroke: C.gold, "stroke-width": 2 }));
    var dFill = VZ.path(svg, "", { fill: C.gold, "fill-opacity": .22, stroke: "none" });
    var peakLn = VZ.ln(svg, x0, dBot, x0, dBot, { stroke: C.red, "stroke-width": 1, "stroke-dasharray": "3 3" });
    var peakTxt = VZ.txt(svg, 0, 0, "", { size: 11, fill: C.red });

    VZ.txt(svg, 620, 92, "面积 ∫f′ dx = 1", { size: 15, fill: C.gold, anchor: "middle", weight: 700 });
    VZ.txt(svg, 620, 116, "与 ε 无关，恒等于 1", { size: 11.5, fill: C.dim, anchor: "middle" });
    VZ.txt(svg, 620, 210, "ε → 0 时", { size: 12.5, fill: C.ink2, anchor: "middle" });
    VZ.txt(svg, 620, 232, "f′ 变成 δ：高度 ∞、", { size: 12.5, fill: C.gold, anchor: "middle" });
    VZ.txt(svg, 620, 250, "宽度 0、面积 1", { size: 12.5, fill: C.gold, anchor: "middle" });

    var out = VZ.panel(stage, { "宽度 ε": "0.28", "峰高 1/2ε": "1.79", "面积": "1.000" });

    function redraw() {
      var df = "", dd = "";
      var pkX = 0, pkV = 0;
      for (var i = 0; i <= 240; i++) {
        var x = -4 + 8 * i / 240;
        var px = x0 + (x1 - x0) * i / 240;
        var f = 0.5 * (1 + Math.tanh(x / eps));
        var dfx = 0.5 / eps / Math.pow(Math.cosh(x / eps), 2);
        if (dfx > pkV) { pkV = dfx; pkX = px; }
        df += (i ? "L" : "M") + px.toFixed(1) + " " + (fBot - f * (fBot - fTop)).toFixed(1);
        dd += (i ? "L" : "M") + px.toFixed(1) + " " + (dBot - VZ.clamp(dfx / VMAX, 0, 1) * (dBot - dTop)).toFixed(1);
      }
      fCurve.setAttribute("d", df);
      dCurve.setAttribute("d", dd);
      dFill.setAttribute("d", dd + "L" + x1 + " " + dBot + "L" + x0 + " " + dBot + "Z");
      peakLn.setAttribute("x1", pkX); peakLn.setAttribute("x2", pkX);
      peakLn.setAttribute("y1", dBot - pkV / VMAX * (dBot - dTop));
      peakTxt.setAttribute("x", VZ.clamp(pkX + 8, x0, x1 - 70));
      peakTxt.setAttribute("y", dBot - pkV / VMAX * (dBot - dTop) - 6);
      peakTxt.textContent = "峰高 " + pkV.toFixed(2);
      VZ.setPanel(out, { "宽度 ε": eps.toFixed(2), "峰高 1/2ε": (0.5 / eps).toFixed(2), "面积": "1.000" });
    }
    redraw();

    VZ.slider(stage, { label: "坡宽 ε（越小越陡）", value: 0.28, min: 0.04, max: 0.7, step: 0.01,
      format: function (v) { return v.toFixed(2); },
      onInput: function (v) { eps = v; redraw(); } });
  }
},

/* ========================================================
   ch10 · d  切向量与参数化：拖动曲线上的点看切线
   ======================================================== */
"f-ch10d": {
  title: "",
  hint: "椭圆由参数 t 给出：r(t) = (a cos t, b sin t)。<b>拖动亮点</b>（它平时自己沿 t 增大的方向流动），青色箭头就是切向量 r′(t)。<span class='hl'>注意速率读数：同样是「匀速转 t」，空间里的移动却时快时慢——切向量的长短由参数化方式决定。</span>",
  draw: function (stage) {
    var W = 760, H = 250, svg = VZ.S(stage, W, H, { grid: true });
    var C = VZ.C;
    var cx = 340, cy = 122, a = 250, b = 86;
    var t = 0.7, auto = true, resumeAt = 0;

    var arC = VZ.arrowDef(svg, VZ.uid("ar"), C.cyan);
    var arG = VZ.arrowDef(svg, VZ.uid("ar"), C.gold);

    /* 椭圆 */
    var d = "";
    for (var i = 0; i <= 120; i++) {
      var u = 2 * Math.PI * i / 120;
      d += (i ? "L" : "M") + (cx + a * Math.cos(u)).toFixed(1) + " " + (cy - b * Math.sin(u)).toFixed(1);
    }
    VZ.path(svg, d, VZ.stroke({ stroke: C.ink2, "stroke-width": 1.6, opacity: .8 }));
    /* t 标尺刻度 */
    for (var k = 0; k < 12; k++) {
      var u2 = 2 * Math.PI * k / 12;
      VZ.ln(svg, cx + (a - 5) * Math.cos(u2), cy - (b - 5) * Math.sin(u2),
        cx + (a + 5) * Math.cos(u2), cy - (b + 5) * Math.sin(u2),
        { stroke: C.faint, "stroke-width": 1 });
    }
    VZ.txt(svg, cx + a + 26, cy - b + 4, "t = 0", { size: 11, fill: C.dim });
    VZ.txt(svg, cx - 46, cy - b - 14, "t = π/2", { size: 11, fill: C.dim });

    var tangent = VZ.ln(svg, 0, 0, 0, 0, VZ.stroke({ stroke: C.cyan, "stroke-width": 2.4, "marker-end": arC }));
    var vel = VZ.ln(svg, 0, 0, 0, 0, VZ.stroke({ stroke: C.gold, "stroke-width": 1.6, "stroke-dasharray": "5 4", "marker-end": arG }));
    var handle = VZ.circ(svg, 0, 0, 8, { fill: C.cyan, stroke: C.deep, "stroke-width": 2, style: "cursor:grab" });
    var halo = VZ.circ(svg, 0, 0, 13, { stroke: C.cyan, "stroke-width": 1, fill: "none", opacity: .5 });

    var out = VZ.panel(stage, { "参数 t": "0.70", "切向 r′(t)": "", "速率 |r′|": "", "切线方向": "" });

    function pos(tt) { return [cx + a * Math.cos(tt), cy - b * Math.sin(tt)]; }
    function dpos(tt) { return [-a * Math.sin(tt), -b * Math.cos(tt)]; } /* 屏幕（y 向下） */
    function redraw() {
      var p = pos(t), v = dpos(t);
      var L = Math.hypot(v[0], v[1]);
      var ux = v[0] / L, uy = v[1] / L;
      handle.setAttribute("cx", p[0]); handle.setAttribute("cy", p[1]);
      halo.setAttribute("cx", p[0]); halo.setAttribute("cy", p[1]);
      tangent.setAttribute("x1", p[0]); tangent.setAttribute("y1", p[1]);
      tangent.setAttribute("x2", p[0] + ux * 74); tangent.setAttribute("y2", p[1] + uy * 74);
      var vm = Math.hypot(a * Math.sin(t), b * Math.cos(t));
      var vlen = 16 + Math.min(vm, 160) * 0.4;
      vel.setAttribute("x1", p[0]); vel.setAttribute("y1", p[1]);
      vel.setAttribute("x2", p[0] + ux * vlen); vel.setAttribute("y2", p[1] + uy * vlen);
      var deg = ((Math.atan2(uy, ux) * 180 / Math.PI) + 360) % 360;
      VZ.setPanel(out, {
        "参数 t": t.toFixed(2),
        "切向 r′(t)": "x:" + (-a * Math.sin(t)).toFixed(0) + " y:" + (b * Math.cos(t)).toFixed(0),
        "速率 |r′|": vm.toFixed(2),
        "切线方向": deg.toFixed(0) + "°"
      });
    }
    redraw();

    VZ.drag(svg, svg, W, H, function (x, y, ph) {
      if (ph === "start") { auto = false; }
      if (ph === "move" || ph === "start") {
        t = Math.atan2(-(y - cy) / b, (x - cx) / a);
        if (t < 0) t += 2 * Math.PI;
        redraw();
      }
      if (ph === "end") { auto = true; resumeAt = performance.now() / 1000 + 1.6; }
    });

    VZ.raf(svg, function (now, dt) {
      if (auto && now > resumeAt) { t = (t + dt * 0.45) % (2 * Math.PI); redraw(); }
    });
  }
},

/* ========================================================
   ch10 · e  曲面上两个坐标方向的夹角
   ======================================================== */
"f-ch10e": {
  title: "",
  hint: "左下小图是<b>参数域</b>：拖动白点选位置 (x, y)。右边是相应的山坡曲面，山面上画出了该点的两个坐标切向量——沿 x 方向（青）与沿 y 方向（品红）。<span class='hl'>平面上这两个方向本成直角，一到曲面上夹角就变了：读数就是曲面的第一基本形式在测量的东西。</span>",
  draw: function (stage) {
    var W = 760, H = 300, svg = VZ.S(stage, W, H);
    var C = VZ.C;
    var S = 88, CX = 440, CY = 178;
    var D = 1.2;
    var px = 0.35, py = -0.25;
    function f(x, y) { return 0.55 * Math.sin(1.4 * x) * Math.cos(1.2 * y) + 0.15 * x; }
    function fx(x, y) { return 0.55 * 1.4 * Math.cos(1.4 * x) * Math.cos(1.2 * y) + 0.15; }
    function fy(x, y) { return -0.55 * 1.2 * Math.sin(1.4 * x) * Math.sin(1.2 * y); }
    function proj(x, y, z) { return [CX + (x - 0.5 * y) * S, CY + (0.30 * y - 0.85 * z) * S]; }

    var arC = VZ.arrowDef(svg, VZ.uid("ar"), C.cyan);
    var arM = VZ.arrowDef(svg, VZ.uid("ar"), C.mag);

    /* 曲面网格 */
    var surf = VZ.g(svg);
    function sLine(pts, col, w) {
      var d = pts.map(function (p, i) { return (i ? "L" : "M") + p[0].toFixed(1) + " " + p[1].toFixed(1); }).join("");
      VZ.path(surf, d, VZ.stroke({ stroke: col, "stroke-width": w || 1 }));
    }
    for (var i = 0; i <= 8; i++) {
      var u = -D + 2 * D * i / 8, row = [];
      for (var j = 0; j <= 40; j++) {
        var v = -D + 2 * D * j / 40;
        row.push(proj(u, v, f(u, v)));
      }
      sLine(row, C.line, 1);
      var col2 = [];
      for (var j2 = 0; j2 <= 40; j2++) {
        var v2 = -D + 2 * D * j2 / 40;
        col2.push(proj(v2, u, f(v2, u)));
      }
      sLine(col2, C.line, 1);
    }

    /* 参数域小图 */
    var mx0 = 52, my0 = 168, ms = 46;  /* 92px 见方 */
    VZ.card(svg, mx0 - 8, my0 - 8, 2 * ms + 16, 2 * ms + 16, { stroke: C.faint });
    VZ.txt(svg, mx0 + ms, my0 + 2 * ms + 26, "参数域 (x, y)", { size: 11, fill: C.dim, anchor: "middle" });
    VZ.ln(svg, mx0, my0 + ms, mx0 + 2 * ms, my0 + ms, { stroke: C.faint, "stroke-width": .8 });
    VZ.ln(svg, mx0 + ms, my0, mx0 + ms, my0 + 2 * ms, { stroke: C.faint, "stroke-width": .8 });
    var probe = VZ.circ(svg, 0, 0, 7, { fill: C.ink, stroke: C.deep, "stroke-width": 2, style: "cursor:grab" });
    var vLine = VZ.ln(svg, 0, 0, 0, 0, { stroke: C.cyan, "stroke-width": 1, "stroke-dasharray": "3 3" });
    var hLine = VZ.ln(svg, 0, 0, 0, 0, { stroke: C.mag, "stroke-width": 1, "stroke-dasharray": "3 3" });

    var tuArrow = VZ.ln(svg, 0, 0, 0, 0, VZ.stroke({ stroke: C.cyan, "stroke-width": 2.6, "marker-end": arC }));
    var tvArrow = VZ.ln(svg, 0, 0, 0, 0, VZ.stroke({ stroke: C.mag, "stroke-width": 2.6, "marker-end": arM }));
    var pdot = VZ.circ(svg, 0, 0, 5, { fill: C.ink });

    var out = VZ.panel(stage, { "位置 (x, y)": "", "∂r/∂x 方向角": "", "∂r/∂y 方向角": "", "两方向夹角": "" });

    function redraw() {
      var z = f(px, py), gx = fx(px, py), gy = fy(px, py);
      /* 小图探针 */
      probe.setAttribute("cx", mx0 + (px + D) / (2 * D) * 2 * ms);
      probe.setAttribute("cy", my0 + (D - py) / (2 * D) * 2 * ms);
      vLine.setAttribute("x1", mx0); vLine.setAttribute("x2", mx0 + 2 * ms);
      vLine.setAttribute("y1", probe.getAttribute("cy")); vLine.setAttribute("y2", probe.getAttribute("cy"));
      hLine.setAttribute("y1", my0); hLine.setAttribute("y2", my0 + 2 * ms);
      hLine.setAttribute("x1", probe.getAttribute("cx")); hLine.setAttribute("x2", probe.getAttribute("cx"));
      /* 曲面上的切向量（取域内步长 0.45 的差商方向） */
      var p0 = proj(px, py, z);
      var L = 0.5;
      var pU = proj(px + L, py, z + gx * L);
      var pV = proj(px, py + L, z + gy * L);
      pdot.setAttribute("cx", p0[0]); pdot.setAttribute("cy", p0[1]);
      tuArrow.setAttribute("x1", p0[0]); tuArrow.setAttribute("y1", p0[1]);
      tuArrow.setAttribute("x2", pU[0]); tuArrow.setAttribute("y2", pU[1]);
      tvArrow.setAttribute("x1", p0[0]); tvArrow.setAttribute("y1", p0[1]);
      tvArrow.setAttribute("x2", pV[0]); tvArrow.setAttribute("y2", pV[1]);
      var cosang = (1 + gx * gy) / Math.sqrt((1 + gx * gx) * (1 + gy * gy));
      var ang = Math.acos(VZ.clamp(cosang, -1, 1)) * 180 / Math.PI;
      var aU = Math.atan2(pU[1] - p0[1], pU[0] - p0[0]) * 180 / Math.PI;
      var aV = Math.atan2(pV[1] - p0[1], pV[0] - p0[0]) * 180 / Math.PI;
      VZ.setPanel(out, {
        "位置 (x, y)": px.toFixed(2) + ", " + py.toFixed(2),
        "∂r/∂x 方向角": aU.toFixed(1) + "°",
        "∂r/∂y 方向角": aV.toFixed(1) + "°",
        "两方向夹角": ang.toFixed(1) + "°"
      });
    }
    redraw();

    VZ.drag(svg, svg, W, H, function (x, y) {
      var nx = (x - mx0) / (2 * ms) * 2 * D - D;
      var ny = D - (y - my0) / (2 * ms) * 2 * D;
      if (nx > -D - 0.4 && nx < D + 0.4 && ny > -D - 0.4 && ny < D + 0.4) {
        px = VZ.clamp(nx, -D, D); py = VZ.clamp(ny, -D, D);
        redraw();
      }
    });
  }
},

/* ========================================================
   ch10 · f  向量场：每一点插一支箭头
   ======================================================== */
"f-ch10f": {
  title: "",
  hint: "向量场 = 空间每一点都插着一支箭头。<b>切下场型</b>看三种典型的场：旋转、径向、螺旋；再<b>拖动白色探针</b>，大箭头给出探针所在点的场向量与大小。<span class='hl'>场是「每点一个向量」的整体指派，箭头林立只是它的采样画像。</span>",
  draw: function (stage) {
    var W = 760, H = 250, svg = VZ.S(stage, W, H, { grid: true });
    var C = VZ.C;
    var CX = 380, CY = 122, SX = 112, SY = 68;
    var mode = "旋转场";

    function F(x, y) {
      if (mode === "旋转场") return [-y * 0.7, x * 0.7];
      if (mode === "径向场") return [x * 0.4, y * 0.4];
      return [(-y + x * 0.55) * 0.45, (x + y * 0.55) * 0.45];
    }
    function scr(x, y) { return [CX + x * SX, CY - y * SY]; }

    var ar = VZ.arrowDef(svg, VZ.uid("ar"), C.ink2);
    var arBig = VZ.arrowDef(svg, VZ.uid("ar"), C.gold);
    var field = VZ.g(svg, { opacity: .75 });

    function drawField() {
      field.innerHTML = "";
      for (var ix = 0; ix < 15; ix++) {
        for (var iy = 0; iy < 7; iy++) {
          var x = -2.8 + ix * 0.4, y = -1.2 + iy * 0.4;
          var v = F(x, y);
          var m = Math.hypot(v[0], v[1]);
          if (m < 1e-4) continue;
          var L = 5 + Math.min(m, 1.6) * 12;
          var p = scr(x, y);
          var p2 = scr(x + v[0] / m * (L / SX) * 0.98, y + v[1] / m * (L / SY) * 0.98);
          VZ.ln(field, p[0], p[1], p2[0], p2[1],
            VZ.stroke({ stroke: C.ink2, "stroke-width": 1.3, opacity: .8, "marker-end": ar }));
        }
      }
    }
    drawField();

    var probe = VZ.circ(svg, 0, 0, 6.5, { fill: C.ink, stroke: C.deep, "stroke-width": 2, style: "cursor:grab" });
    var bigA = VZ.ln(svg, 0, 0, 0, 0, VZ.stroke({ stroke: C.gold, "stroke-width": 3, "marker-end": arBig }));
    var pxv = 0.6, pyv = 0.3;

    var out = VZ.panel(stage, { "场点 (x, y)": "", "场向量 F": "", "|F|": "" });
    function redrawProbe() {
      var p = scr(pxv, pyv);
      probe.setAttribute("cx", p[0]); probe.setAttribute("cy", p[1]);
      var v = F(pxv, pyv), m = Math.hypot(v[0], v[1]);
      var L = 10 + Math.min(m, 1.6) * 26;
      var dx = v[0] * SX, dy = -v[1] * SY, dm = Math.hypot(dx, dy) || 1;
      bigA.setAttribute("x1", p[0]); bigA.setAttribute("y1", p[1]);
      bigA.setAttribute("x2", p[0] + dx / dm * L);
      bigA.setAttribute("y2", p[1] + dy / dm * L);
      VZ.setPanel(out, {
        "场点 (x, y)": pxv.toFixed(2) + ", " + pyv.toFixed(2),
        "场向量 F": v[0].toFixed(2) + ", " + v[1].toFixed(2),
        "|F|": m.toFixed(3)
      });
    }
    redrawProbe();

    VZ.drag(svg, svg, W, H, function (x, y) {
      pxv = VZ.clamp((x - CX) / SX, -2.9, 2.9);
      pyv = VZ.clamp((CY - y) / SY, -1.35, 1.35);
      redrawProbe();
    });

    VZ.chips(stage, ["旋转场", "径向场", "螺旋场"], mode, function (m2) {
      mode = m2; drawField(); redrawProbe();
    });
  }
},

/* ========================================================
   ch10 · g  1-形式作用在路径上：数等高线穿越
   ======================================================== */
"f-ch10g": {
  title: "",
  hint: "1-形式 df 作用在路径上 = <b>沿途数等高线</b>。终点 B 可以<b>拖到任意位置</b>：直线路径①与绕弯路径②形状完全不同，但两者的等高线<b>穿越数始终相同</b>，且恰好由两端的高度差 f(B) − f(A) 决定——这就是 df 沿闭路径积分为零、积分与路径无关的根源。",
  draw: function (stage) {
    var W = 760, H = 280, svg = VZ.S(stage, W, H, { grid: true });
    var C = VZ.C;
    var CX = 330, CY = 140, SX = 78, SY = 56;
    function f(x, y) { return 0.32 * x * x + y * y; }
    function scr(x, y) { return [CX + x * SX, CY - y * SY]; }
    var A = [0.5, 0.3], B = [2.4, 1.1];
    var levels = [0.5, 1.5, 2.5, 3.5, 4.5];

    levels.forEach(function (c) {
      var d = "", N = 90;
      for (var i = 0; i <= N; i++) {
        var th = 2 * Math.PI * i / N;
        var x = Math.sqrt(c / 0.32) * Math.cos(th);
        var xq = VZ.clamp(x, -3.4, 3.4);
        var y = Math.sqrt(Math.max(c - 0.32 * xq * xq, 0)) * (Math.sin(th) >= 0 ? 1 : -1);
        var p = scr(xq, y);
        d += (i ? "L" : "M") + p[0].toFixed(1) + " " + p[1].toFixed(1);
      }
      VZ.path(svg, d, VZ.stroke({ stroke: C.faint, "stroke-width": 1.2 }));
      var lp = scr(Math.sqrt(c / 0.32), 0);
      VZ.txt(svg, VZ.clamp(lp[0], 60, 640) + 4, lp[1] - 4, String(c), { size: 10, fill: C.dim });
    });

    var ar1 = VZ.arrowDef(svg, VZ.uid("ar"), C.cyan);
    var ar2 = VZ.arrowDef(svg, VZ.uid("ar"), C.mag);
    var p1 = VZ.ln(svg, 0, 0, 0, 0, VZ.stroke({ stroke: C.cyan, "stroke-width": 2.2, "marker-end": ar1 }));
    var p2 = VZ.path(svg, "", VZ.stroke({ stroke: C.mag, "stroke-width": 2.2, "marker-end": ar2 }));
    var aDot = VZ.circ(svg, 0, 0, 6, { fill: C.gold });
    var bDot = VZ.circ(svg, 0, 0, 8, { fill: C.ink, stroke: C.deep, "stroke-width": 2, style: "cursor:grab" });

    var out = VZ.panel(stage, { "路径① 穿越数": "", "路径② 穿越数": "", "f(B) − f(A)": "", "B 点高度 f(B)": "" });

    function bez(t2) {
      var mx = (A[0] + B[0]) / 2, my = (A[1] + B[1]) / 2;
      var dx = B[0] - A[0], dy = B[1] - A[1], dl = Math.hypot(dx, dy) || 1;
      var cxp = mx - dy / dl * 1.5, cyp = my + dx / dl * 1.5;
      var u = 1 - t2;
      return [u * u * A[0] + 2 * u * t2 * cxp + t2 * t2 * B[0],
              u * u * A[1] + 2 * u * t2 * cyp + t2 * t2 * B[1]];
    }
    function crossings(sample) {
      var cnt = 0;
      levels.forEach(function (c) {
        var prev = f.apply(null, sample(0)) - c;
        for (var i = 1; i <= 240; i++) {
          var cur = f.apply(null, sample(i / 240)) - c;
          if (prev === 0) prev = cur;
          else if (prev * cur < 0) { cnt++; prev = cur; }
          else prev = cur;
        }
      });
      return cnt;
    }
    function redraw() {
      var s1 = scr(A[0], A[1]), s2 = scr(B[0], B[1]);
      aDot.setAttribute("cx", s1[0]); aDot.setAttribute("cy", s1[1]);
      bDot.setAttribute("cx", s2[0]); bDot.setAttribute("cy", s2[1]);
      var aTxt = svg.querySelectorAll("text");
      p1.setAttribute("x1", s1[0]); p1.setAttribute("y1", s1[1]);
      p1.setAttribute("x2", s2[0]); p1.setAttribute("y2", s2[1]);
      var bd = "";
      for (var i = 0; i <= 60; i++) {
        var q = bez(i / 60), p = scr(q[0], q[1]);
        bd += (i ? "L" : "M") + p[0].toFixed(1) + " " + p[1].toFixed(1);
      }
      p2.setAttribute("d", bd);
      var n1 = crossings(function (u) { return [A[0] + (B[0] - A[0]) * u, A[1] + (B[1] - A[1]) * u]; });
      var n2 = crossings(bez);
      VZ.setPanel(out, {
        "路径① 穿越数": String(n1),
        "路径② 穿越数": String(n2),
        "f(B) − f(A)": (f(B[0], B[1]) - f(A[0], A[1])).toFixed(2),
        "B 点高度 f(B)": f(B[0], B[1]).toFixed(2)
      });
    }
    redraw();
    var aT = VZ.txt(svg, scr(A[0], A[1])[0] - 18, scr(A[0], A[1])[1] + 4, "A", { size: 13, fill: C.gold, weight: 700 });
    var bT = VZ.txt(svg, 0, 0, "B", { size: 13, fill: C.ink, weight: 700 });

    VZ.drag(svg, svg, W, H, function (x, y) {
      B = [VZ.clamp((x - CX) / SX, -3.2, 3.2), VZ.clamp((CY - y) / SY, -1.9, 1.9)];
      bDot.setAttribute("cx", scr(B[0], B[1])[0]);
      bDot.setAttribute("cy", scr(B[0], B[1])[1]);
      bT.setAttribute("x", scr(B[0], B[1])[0] + 10);
      bT.setAttribute("y", scr(B[0], B[1])[1] + 4);
      redraw();
    });
    bT.setAttribute("x", scr(B[0], B[1])[0] + 10);
    bT.setAttribute("y", scr(B[0], B[1])[1] + 4);

    /* 沿两条路径流动的小点（随拖拽实时跟随当前路径） */
    var sA = scr(A[0], A[1]);
    var dot1 = VZ.circ(svg, sA[0], sA[1], 4, { fill: C.cyan });
    var dot2 = VZ.circ(svg, sA[0], sA[1], 4, { fill: C.mag });
    VZ.raf(svg, function (t) {
      var u = (t / 2.4) % 1;
      var q1 = [A[0] + (B[0] - A[0]) * u, A[1] + (B[1] - A[1]) * u];
      var p1s = scr(q1[0], q1[1]);
      dot1.setAttribute("cx", p1s[0]); dot1.setAttribute("cy", p1s[1]);
      var q2 = bez(u), p2s = scr(q2[0], q2[1]);
      dot2.setAttribute("cx", p2s[0]); dot2.setAttribute("cy", p2s[1]);
    });
  }
},

/* ========================================================
   ch11 · d  四元数乘法轮盘：i→j→k→i
   ======================================================== */
"f-ch11d": {
  title: "",
  hint: "四元数乘法表可以画成一个<b>轮盘</b>：顺着箭头（i→j→k→i）相乘得正——点 <b>i×j</b>、<b>j×k</b>、<b>k×i</b> 看绿色弧；逆着箭头相乘得负——点 <b>j×i</b> 等看红色弧；自己乘自己得 −1。<span class='hl'>转一圈回到自身，正是「三次 90° 旋转回到 −1」这套非交换代数的全部秘密。</span>",
  draw: function (stage) {
    var W = 760, H = 250, svg = VZ.S(stage, W, H, { grid: true });
    var C = VZ.C;
    var cx = 250, cy = 122, R = 84;
    var nodes = [
      { name: "i", ang: -90, c: C.cyan },
      { name: "j", ang: 30, c: C.gold },
      { name: "k", ang: 150, c: C.mag }
    ];
    function pt(ang, r) { return [cx + r * Math.cos(ang * Math.PI / 180), cy + r * Math.sin(ang * Math.PI / 180)]; }

    /* 顺时针弧（正向）与逆时针弧（负向） */
    var cwArcs = [], ccwArcs = [];
    function arcD(a1, a2, r, cw) {
      var p1 = pt(a1, r), p2 = pt(a2, r);
      var large = (Math.abs(a2 - a1) > 180) ? 1 : 0;
      var sweep = cw ? 1 : 0;
      return "M" + p1[0].toFixed(1) + " " + p1[1].toFixed(1) +
        "A" + r + " " + r + " 0 " + large + " " + sweep + " " + p2[0].toFixed(1) + " " + p2[1].toFixed(1);
    }
    for (var s = 0; s < 3; s++) {
      var a1 = nodes[s].ang, a2 = nodes[(s + 1) % 3].ang;
      if (a2 < a1) a2 += 360;
      cwArcs.push(VZ.path(svg, arcD(a1, a2, R + 12, true),
        VZ.stroke({ stroke: C.green, "stroke-width": 2.2, opacity: .85 })));
      var b1 = nodes[s].ang, b2 = nodes[(s + 1) % 3].ang;
      if (b2 < b1) b2 += 360;
      ccwArcs.push(VZ.path(svg, arcD(b1, b2, R - 26, false),
        VZ.stroke({ stroke: C.red, "stroke-width": 2.2, opacity: .85, "stroke-dasharray": "6 5" })));
    }
    VZ.txt(svg, cx, cy - R + 34, "×+", { size: 13, fill: C.green, anchor: "middle", weight: 700 });
    VZ.txt(svg, cx, cy + R - 26, "×−", { size: 13, fill: C.red, anchor: "middle", weight: 700 });

    nodes.forEach(function (n) {
      var p = pt(n.ang, R);
      VZ.circ(svg, p[0], p[1], 17, { fill: "rgba(12,8,32,.95)", stroke: n.c, "stroke-width": 2 });
      VZ.txt(svg, p[0], p[1] + 6, n.name, { size: 17, fill: n.c, anchor: "middle", weight: 700 });
    });

    var resTxt = VZ.txt(svg, 250, 116, "i × j = +k", { size: 19, fill: C.ink, anchor: "middle", weight: 700 });
    var subTxt = VZ.txt(svg, 250, 140, "点右侧选一个乘法", { size: 11.5, fill: C.dim, anchor: "middle" });

    /* 中心与右侧说明 */
    VZ.txt(svg, 580, 52, "顺箭头 ⇒ +，逆箭头 ⇒ −", { size: 12.5, fill: C.ink2, anchor: "middle" });
    VZ.txt(svg, 580, 76, "i² = j² = k² = −1", { size: 13, fill: C.violet, anchor: "middle", weight: 700 });

    function hi(kind, idx, txt, col) {
      cwArcs.forEach(function (a2, i) { a2.setAttribute("stroke-width", (kind === "cw" && i === idx) ? 4.5 : 2.2); a2.setAttribute("opacity", (kind === "cw" && i === idx) ? 1 : .5); });
      ccwArcs.forEach(function (a2, i) { a2.setAttribute("stroke-width", (kind === "ccw" && i === idx) ? 4.5 : 2.2); a2.setAttribute("opacity", (kind === "ccw" && i === idx) ? 1 : .5); });
      resTxt.textContent = txt;
      resTxt.setAttribute("fill", col);
    }
    var pairs = [
      ["i×j", "cw", 0, "i × j = +k", C.green],
      ["j×k", "cw", 1, "j × k = +i", C.green],
      ["k×i", "cw", 2, "k × i = +j", C.green],
      ["j×i", "ccw", 0, "j × i = −k", C.red],
      ["k×j", "ccw", 1, "k × j = −i", C.red],
      ["i×k", "ccw", 2, "i × k = −j", C.red],
      ["i×i", "sq", 0, "i × i = −1", C.violet],
      ["j×j", "sq", 1, "j × j = −1", C.violet],
      ["k×k", "sq", 2, "k × k = −1", C.violet]
    ];
    VZ.chips(stage, pairs.map(function (p2) { return p2[0]; }), "i×j", function (m) {
      var p2 = pairs.filter(function (q) { return q[0] === m; })[0];
      if (p2[1] === "sq") {
        cwArcs.forEach(function (a2) { a2.setAttribute("stroke-width", 2.2); a2.setAttribute("opacity", .5); });
        ccwArcs.forEach(function (a2) { a2.setAttribute("stroke-width", 2.2); a2.setAttribute("opacity", .5); });
        resTxt.textContent = p2[3]; resTxt.setAttribute("fill", C.violet);
        subTxt.textContent = "自己乘自己：转两个 90°，得 −1";
      } else {
        hi(p2[1], p2[2], p2[3], p2[4]);
        subTxt.textContent = p2[1] === "cw" ? "顺着箭头转 → 得正" : "逆着箭头转 → 得负";
      }
    });
    hi("cw", 0, "i × j = +k", C.green);
  }
},

/* ========================================================
   ch11 · e  slerp：两姿态之间的最短旋转
   ======================================================== */
"f-ch11e": {
  title: "",
  hint: "姿态 A（10°）转到姿态 B（250°）：差 240°，但<b>最短旋转是反向的 120°</b>。<b>拖动 t</b>（或点「播放」）：左边的姿势沿最短弧转，右边的单位四元数在圆上同步走<b>较短的那段弧</b>。<span class='hl'>动画插值为什么必须用 slerp 而不是 lerp——看虚线那条「绕远」的路就明白了。</span>",
  draw: function (stage) {
    var W = 760, H = 270, svg = VZ.S(stage, W, H, { grid: true });
    var C = VZ.C;
    var TH1 = 10, TH2 = 250;
    var dTH = ((TH2 - TH1) % 360 + 540) % 360 - 180;   /* 最短差：−120 */
    var t = 0, playing = false;

    /* 左：姿态 */
    var fx = 230, fy = 138;
    var arC = VZ.arrowDef(svg, VZ.uid("ar"), C.cyan);
    var arG = VZ.arrowDef(svg, VZ.uid("ar"), C.gold);
    VZ.circ(svg, fx, fy, 96, { stroke: C.faint, "stroke-width": 1, "stroke-dasharray": "4 5", fill: "none" });
    var axX = VZ.ln(svg, 0, 0, 0, 0, VZ.stroke({ stroke: C.cyan, "stroke-width": 2.8, "marker-end": arC }));
    var axY = VZ.ln(svg, 0, 0, 0, 0, VZ.stroke({ stroke: C.gold, "stroke-width": 2.8, "marker-end": arG }));
    var aDotA = VZ.circ(svg, 0, 0, 5, { fill: C.ink });
    VZ.txt(svg, fx, fy + 118, "姿态：物体坐标架", { size: 12, fill: C.dim, anchor: "middle" });
    var angTxt = VZ.txt(svg, fx, fy - 110, "", { size: 14, fill: C.ink, anchor: "middle", weight: 700 });

    /* 右：四元数圆 */
    var qx = 580, qy = 138, qr = 62;
    VZ.circ(svg, qx, qy, qr, { stroke: C.ink2, "stroke-width": 1.4, fill: "none" });
    function qpt(phi) { return [qx + qr * Math.cos(phi), qy - qr * Math.sin(phi)]; }
    var phi1 = TH1 / 2 * Math.PI / 180, phi2 = TH2 / 2 * Math.PI / 180;
    /* 长弧（虚线，绕远） */
    var longD = "", N = 80;
    var longSpan = 2 * Math.PI - Math.abs(dTH / 2 * Math.PI / 180) * 2; /* 剩下的劣弧长 */
    for (var i = 0; i <= N; i++) {
      var ph = phi1 + (phi2 - phi1) * i / N + (dTH < 0 ? 2 * Math.PI : -2 * Math.PI) * 0;
      /* 直接画「另一条路」：从 phi1 反向转到 phi2 的等价角 */
      var phi2x = phi2 + (dTH < 0 ? 2 * Math.PI : -2 * Math.PI);
      var phx = phi1 + (phi2x - phi1) * i / N;
      var p = qpt(phx);
      longD += (i ? "L" : "M") + p[0].toFixed(1) + " " + p[1].toFixed(1);
    }
    VZ.path(svg, longD, VZ.stroke({ stroke: C.dim, "stroke-width": 1.2, "stroke-dasharray": "4 4", opacity: .55 }));
    /* 短弧（实线，被 slerp 选中的路） */
    var shortD = "";
    for (var j = 0; j <= N; j++) {
      var ph2 = phi1 + (dTH / 2 * Math.PI / 180) * j / N;
      var p2 = qpt(ph2);
      shortD += (j ? "L" : "M") + p2[0].toFixed(1) + " " + p2[1].toFixed(1);
    }
    VZ.path(svg, shortD, VZ.stroke({ stroke: C.cyan, "stroke-width": 3 }));
    var q1p = qpt(phi1), q2p = qpt(phi2);
    VZ.circ(svg, q1p[0], q1p[1], 6, { fill: C.cyan });
    VZ.circ(svg, q2p[0], q2p[1], 6, { fill: C.gold });
    VZ.txt(svg, q1p[0] + 14, q1p[1] - 6, "q₁", { size: 13, fill: C.cyan, weight: 700 });
    VZ.txt(svg, q2p[0] + 14, q2p[1] - 6, "q₂", { size: 13, fill: C.gold, weight: 700 });
    var qNow = VZ.circ(svg, 0, 0, 7, { fill: C.ink, stroke: C.deep, "stroke-width": 2 });
    VZ.txt(svg, qx, qy + qr + 22, "单位四元数圆（角度 = 姿态角的一半）", { size: 11.5, fill: C.dim, anchor: "middle" });
    VZ.txt(svg, qx, 34, "slerp 走短弧（青），不走虚线远路", { size: 12, fill: C.ink2, anchor: "middle" });

    var out = VZ.panel(stage, { "插值 t": "0.00", "姿态角 θ": "10°", "四元数角 θ/2": "5°", "走了多远": "0°" });

    function redraw() {
      var th = TH1 + dTH * t;
      var rx = Math.cos(th * Math.PI / 180), ry = Math.sin(th * Math.PI / 180);
      axX.setAttribute("x1", fx); axX.setAttribute("y1", fy);
      axX.setAttribute("x2", fx + rx * 84); axX.setAttribute("y2", fy - ry * 84);
      axY.setAttribute("x1", fx); axY.setAttribute("y1", fy);
      axY.setAttribute("x2", fx - ry * 68); axY.setAttribute("y2", fy - rx * 68);
      aDotA.setAttribute("cx", fx); aDotA.setAttribute("cy", fy);
      var qphi = phi1 + (dTH / 2 * Math.PI / 180) * t;
      var qp = qpt(qphi);
      qNow.setAttribute("cx", qp[0]); qNow.setAttribute("cy", qp[1]);
      angTxt.textContent = θfmt(th);
      VZ.setPanel(out, {
        "插值 t": t.toFixed(2),
        "姿态角 θ": (((th % 360) + 360) % 360).toFixed(0) + "°",
        "四元数角 θ/2": (((qphi * 180 / Math.PI) % 360 + 360) % 360).toFixed(0) + "°",
        "走了多远": (dTH * t).toFixed(0) + "°"
      });
    }
    function θfmt(v) { return "θ = " + (((v % 360) + 360) % 360).toFixed(0) + "°"; }
    redraw();

    VZ.slider(stage, { label: "插值 t", value: 0, min: 0, max: 1, step: 0.01,
      format: function (v) { return v.toFixed(2); },
      onInput: function (v) { t = v; playing = false; redraw(); } });
    var playBtn = VZ.btn(stage, "播放", function () {
      playing = !playing;
      playBtn.textContent = playing ? "暂停" : "播放";
    });

    VZ.raf(svg, function (tt, dt) {
      if (!playing) return;
      t += dt * 0.28;
      if (t > 1) { t = 0; }
      redraw();
    });
  }
},

/* ========================================================
   ch11 · f  几何积 = 内积（数） + 外积（有向面）
   ======================================================== */
"f-ch11f": {
  title: "",
  hint: "克利福德几何积把两种乘法焊在一起：<b>拖动 a、b 两个箭头端点</b>——点积 a·b 是个纯数（两向量越「对齐」越大），楔积 a∧b 是一块<b>有向的平行四边形</b>（紫色面，反向时面积变负）。<span class='hl'>ab = a·b + a∧b：一半是内积的遗产，一半是外积的反交换，合起来才是完整的几何乘法。</span>",
  draw: function (stage) {
    var W = 760, H = 260, svg = VZ.S(stage, W, H, { grid: true });
    var C = VZ.C;
    var ox = 235, oy = 130, RL = 95;
    var a = [72, -34], b = [30, 62];   /* 屏幕（y 向下） */

    var hA = VZ.circ(svg, 0, 0, 8, { fill: C.cyan, stroke: C.deep, "stroke-width": 2, style: "cursor:grab" });
    var hB = VZ.circ(svg, 0, 0, 8, { fill: C.gold, stroke: C.deep, "stroke-width": 2, style: "cursor:grab" });
    var para = VZ.path(svg, "", { fill: C.violet, "fill-opacity": .22, stroke: C.violet, "stroke-width": 1.2 });
    var lnA = VZ.ln(svg, 0, 0, 0, 0, VZ.stroke({ stroke: C.cyan, "stroke-width": 2.6 }));
    var lnB = VZ.ln(svg, 0, 0, 0, 0, VZ.stroke({ stroke: C.gold, "stroke-width": 2.6 }));
    var dsh1 = VZ.ln(svg, 0, 0, 0, 0, { stroke: C.violet, "stroke-width": 1, "stroke-dasharray": "4 4" });
    var dsh2 = VZ.ln(svg, 0, 0, 0, 0, { stroke: C.violet, "stroke-width": 1, "stroke-dasharray": "4 4" });
    VZ.circ(svg, ox, oy, 3, { fill: C.dim });

    /* 右侧公式卡 */
    VZ.card(svg, 470, 34, 264, 186, { stroke: C.faint });
    VZ.txt(svg, 602, 64, "几何积  ab = a·b + a∧b", { size: 15, fill: C.ink, anchor: "middle", weight: 700 });
    VZ.txt(svg, 602, 96, "a·b：标量部分（数）", { size: 12.5, fill: C.cyan, anchor: "middle" });
    VZ.txt(svg, 602, 120, "a∧b：双标量部分（有向面）", { size: 12.5, fill: C.violet, anchor: "middle" });
    VZ.txt(svg, 602, 152, "交换次序：ba = a·b − a∧b", { size: 12.5, fill: C.ink2, anchor: "middle" });
    VZ.txt(svg, 602, 182, "对易 ⇒ 面反号，数不变", { size: 11.5, fill: C.dim, anchor: "middle" });

    var out = VZ.panel(stage, { "a·b（标量）": "", "a∧b（有向面积）": "", "夹角": "" });

    function redraw() {
      var va = [a[0], -a[1]], vb = [b[0], -b[1]];   /* 数学 y 向上 */
      hA.setAttribute("cx", ox + a[0]); hA.setAttribute("cy", oy + a[1]);
      hB.setAttribute("cx", ox + b[0]); hB.setAttribute("cy", oy + b[1]);
      lnA.setAttribute("x1", ox); lnA.setAttribute("y1", oy);
      lnA.setAttribute("x2", ox + a[0]); lnA.setAttribute("y2", oy + a[1]);
      lnB.setAttribute("x1", ox); lnB.setAttribute("y1", oy);
      lnB.setAttribute("x2", ox + b[0]); lnB.setAttribute("y2", oy + b[1]);
      var s = (ox + a[0]) + " " + (oy + a[1]);
      para.setAttribute("d", "M" + ox + " " + oy + "L" + s +
        "L" + (ox + a[0] + b[0]) + " " + (oy + a[1] + b[1]) +
        "L" + (ox + b[0]) + " " + (oy + b[1]) + "Z");
      dsh1.setAttribute("x1", ox + a[0]); dsh1.setAttribute("y1", oy + a[1]);
      dsh1.setAttribute("x2", ox + a[0] + b[0]); dsh1.setAttribute("y2", oy + a[1] + b[1]);
      dsh2.setAttribute("x1", ox + b[0]); dsh2.setAttribute("y2", oy + b[1]);
      dsh2.setAttribute("x2", ox + a[0] + b[0]); dsh2.setAttribute("y2", oy + a[1] + b[1]);
      var dot = va[0] * vb[0] + va[1] * vb[1];
      var wedge = va[0] * vb[1] - va[1] * vb[0];
      var ang = Math.acos(VZ.clamp(dot / (Math.hypot(va[0], va[1]) * Math.hypot(vb[0], vb[1]) || 1), -1, 1)) * 180 / Math.PI;
      VZ.setPanel(out, {
        "a·b（标量）": dot.toFixed(0) + " px²",
        "a∧b（有向面积）": (wedge > 0 ? "+" : "") + wedge.toFixed(0) + " px²",
        "夹角": ang.toFixed(1) + "°"
      });
    }
    redraw();

    function mkDrag(handle, vec) {
      VZ.drag(svg, handle, W, H, function (x, y) {
        var dx = x - ox, dy = y - oy;
        var m = Math.hypot(dx, dy) || 1;
        var r = Math.min(m, RL);
        vec[0] = dx / m * r; vec[1] = dy / m * r;
        redraw();
      });
    }
    mkDrag(hA, a); mkDrag(hB, b);
  }
},

/* ========================================================
   ch11 · g  标架旋转与手性：左手系照不进右手系
   ======================================================== */
"f-ch11g": {
  title: "",
  hint: "左边是标准<b>右手系</b>（x×y = +z）。右边是它的镜子像——<b>左手系</b>。<b>拖滑块旋转</b>右边的标架：无论转到什么角度，它的叉积箭头始终指 −z，与左边永远差一个镜像。<span class='hl'>手性是旋转动不了的性质——这正是宇称、也是四元数与实矩阵都替你「转」不出来的东西。</span>",
  draw: function (stage) {
    var W = 760, H = 250, svg = VZ.S(stage, W, H);
    var C = VZ.C;
    var rot = 0;

    function frame(gx, gy, mirrored, title) {
      var ex0 = [0.86, 0.30], ey0 = [-0.86, 0.30], ez = [0, -1];
      var arX = VZ.arrowDef(svg, VZ.uid("ar"), C.cyan);
      var arY = VZ.arrowDef(svg, VZ.uid("ar"), C.gold);
      var arZ = VZ.arrowDef(svg, VZ.uid("ar"), C.mag);
      var arX2 = VZ.arrowDef(svg, VZ.uid("ar"), C.cyan);
      var arY2 = VZ.arrowDef(svg, VZ.uid("ar"), C.gold);
      var lnX = VZ.ln(svg, 0, 0, 0, 0, VZ.stroke({ stroke: C.cyan, "stroke-width": 2.6, "marker-end": arX }));
      var lnY = VZ.ln(svg, 0, 0, 0, 0, VZ.stroke({ stroke: C.gold, "stroke-width": 2.6, "marker-end": arY }));
      VZ.ln(svg, gx, gy, gx, gy - 74, VZ.stroke({ stroke: C.mag, "stroke-width": 2.6, "marker-end": arZ }));
      var lnX2 = VZ.ln(svg, 0, 0, 0, 0, VZ.stroke({ stroke: C.cyan, "stroke-width": 1.2, opacity: .4, "marker-end": arX2 }));
      var lnY2 = VZ.ln(svg, 0, 0, 0, 0, VZ.stroke({ stroke: C.gold, "stroke-width": 1.2, opacity: .4, "marker-end": arY2 }));
      var xp = VZ.txt(svg, 0, 0, "x", { size: 13, fill: C.cyan, weight: 700 });
      var yp = VZ.txt(svg, 0, 0, "y", { size: 13, fill: C.gold, weight: 700 });
      VZ.circ(svg, gx, gy, 3.5, { fill: C.dim });
      VZ.txt(svg, gx, gy + 96, title, { size: 13, fill: C.ink2, anchor: "middle" });
      function redrawFrame() {
        var c = Math.cos(rot * Math.PI / 180), s = Math.sin(rot * Math.PI / 180);
        var ex = [c * ex0[0] + s * ey0[0], c * ex0[1] + s * ey0[1]];
        var ey = [-s * ex0[0] + c * ey0[0], -s * ex0[1] + c * ey0[1]];
        if (mirrored) { ex[0] = -ex[0]; ex[1] = -ex[1]; }
        var L1 = 62, L2 = 38;
        lnX.setAttribute("x1", gx); lnX.setAttribute("y1", gy);
        lnX.setAttribute("x2", gx + ex[0] * L1); lnX.setAttribute("y2", gy + ex[1] * L1);
        lnY.setAttribute("x1", gx); lnY.setAttribute("y1", gy);
        lnY.setAttribute("x2", gx + ey[0] * L1); lnY.setAttribute("y2", gy + ey[1] * L1);
        lnX2.setAttribute("x1", gx); lnX2.setAttribute("y1", gy);
        lnX2.setAttribute("x2", gx + ex[0] * L1 * -0.999); lnX2.setAttribute("y2", gy + ex[1] * L1 * -0.999);
        lnY2.setAttribute("x1", gx); lnY2.setAttribute("y1", gy);
        lnY2.setAttribute("x2", gx + ey[0] * L1 * -0.999); lnY2.setAttribute("y2", gy + ey[1] * L1 * -0.999);
        xp.setAttribute("x", gx + ex[0] * (L1 + 14)); xp.setAttribute("y", gy + ex[1] * (L1 + 14) + 5);
        yp.setAttribute("x", gx + ey[0] * (L1 + 14)); yp.setAttribute("y", gy + ey[1] * (L1 + 14) + 5);
      }
      return { redrawFrame: redrawFrame };
    }

    var fr = frame(230, 120, false, "右手系");
    var fr2 = frame(530, 120, true, "左手系（镜子里的像）");
    /* 叉积指示箭头：右手系 +z（绿，朝上），左手系 −z（红，朝下） */
    var arUp = VZ.arrowDef(svg, VZ.uid("ar"), C.green);
    var arDn = VZ.arrowDef(svg, VZ.uid("ar"), C.red);
    VZ.ln(svg, 288, 172, 288, 132, VZ.stroke({ stroke: C.green, "stroke-width": 2.4, "marker-end": arUp }));
    VZ.txt(svg, 298, 148, "x×y", { size: 11.5, fill: C.green });
    VZ.ln(svg, 588, 132, 588, 172, VZ.stroke({ stroke: C.red, "stroke-width": 2.4, "marker-end": arDn }));
    VZ.txt(svg, 598, 158, "x×y", { size: 11.5, fill: C.red });
    VZ.txt(svg, 230, 44, "z 轴垂直纸面向外", { size: 11, fill: C.dim, anchor: "middle" });

    var out = VZ.panel(stage, { "旋转角": "0°", "右手系 x×y": "+z（不变）", "左手系 x×y": "−z（不变）" });

    VZ.slider(stage, { label: "旋转右手边的标架", value: 0, min: 0, max: 360, step: 1,
      format: function (v) { return v.toFixed(0) + "°"; },
      onInput: function (v) {
        rot = v;
        fr2.redrawFrame();
        VZ.setPanel(out, { "旋转角": v.toFixed(0) + "°" });
      } });
    fr.redrawFrame(); fr2.redrawFrame();
  }
},

/* ========================================================
   ch12 · d  维度直觉：0 → 1 → 2 → 3
   ======================================================== */
"f-ch12d": {
  title: "",
  hint: "点「播放」或直接点<b>维数选块</b>：一个点 → 线 → 面 → 体，每升一维，确定一个位置所需的<b>坐标数目就多一个</b>。<span class='hl'>「n 维」并没有多神秘：就是需要 n 个独立的数才能说清「你在哪儿」。</span>",
  draw: function (stage) {
    var W = 760, H = 270, svg = VZ.S(stage, W, H, { grid: true });
    var C = VZ.C;
    var dim = 0, playing = true, acc = 0;
    var g = VZ.g(svg);
    var names = [
      ["0 维 · 点", "不需要任何坐标：位置只有一个"],
      ["1 维 · 线", "1 个坐标（沿线的距离）定住一个点"],
      ["2 维 · 面", "2 个坐标（行、列）定住一个点"],
      ["3 维 · 体", "3 个坐标（长、宽、高）定住一个点"]
    ];

    function build() {
      g.innerHTML = "";
      var cx = 380, cy = 128;
      if (dim === 0) {
        VZ.circ(g, cx, cy, 7, { fill: C.gold });
      } else if (dim === 1) {
        VZ.ln(g, cx - 210, cy, cx + 210, cy, VZ.stroke({ stroke: C.cyan, "stroke-width": 2.4 }));
        for (var i = 0; i <= 10; i++) VZ.circ(g, cx - 210 + i * 42, cy, 4, { fill: C.cyan });
      } else if (dim === 2) {
        var s2 = 200;
        for (var j = 0; j <= 5; j++) {
          VZ.ln(g, cx - s2 / 2, cy - s2 / 2 + j * s2 / 5, cx + s2 / 2, cy - s2 / 2 + j * s2 / 5, { stroke: C.faint, "stroke-width": 1 });
          VZ.ln(g, cx - s2 / 2 + j * s2 / 5, cy - s2 / 2, cx - s2 / 2 + j * s2 / 5, cy + s2 / 2, { stroke: C.faint, "stroke-width": 1 });
        }
        VZ.el("rect", { x: cx - s2 / 2, y: cy - s2 / 2, width: s2, height: s2, fill: "none", stroke: C.cyan, "stroke-width": 2.4 }, g);
        VZ.circ(g, cx + 40, cy + 26, 6, { fill: C.gold });
        VZ.txt(g, cx + 52, cy + 30, "(2 个数)", { size: 11, fill: C.gold });
      } else {
        var s3 = 150, dx = 52, dy = -34;
        var x0 = cx - s3 / 2, y0 = cy - s3 / 2 + 14;
        VZ.el("rect", { x: x0, y: y0, width: s3, height: s3, fill: "none", stroke: C.cyan, "stroke-width": 2.2 }, g);
        VZ.el("rect", { x: x0 + dx, y: y0 + dy, width: s3, height: s3, fill: "none", stroke: C.gold, "stroke-width": 1.8, opacity: .85 }, g);
        [[0, 0], [s3, 0], [0, s3], [s3, s3]].forEach(function (p2) {
          VZ.ln(g, x0 + p2[0], y0 + p2[1], x0 + p2[0] + dx, y0 + p2[1] + dy, { stroke: C.ink2, "stroke-width": 1.4 });
        });
        VZ.circ(g, x0 + 100 + dx * 0.6, y0 + 100 + dy * 0.6, 6, { fill: C.mag });
        VZ.txt(g, x0 + 112 + dx * 0.6, y0 + 104 + dy * 0.6, "(3 个数)", { size: 11, fill: C.mag });
      }
      VZ.txt(g, cx, 240, names[dim][0], { size: 16, fill: C.ink, anchor: "middle", weight: 700 });
      VZ.txt(g, cx, 262, names[dim][1], { size: 12.5, fill: C.dim, anchor: "middle" });
      VZ.stagger(g, "circle,line,rect,text", 40);
    }
    build();

    var playBtn = VZ.btn(stage, "暂停", function () {
      playing = !playing;
      playBtn.textContent = playing ? "暂停" : "播放";
    });
    VZ.chips(stage, ["0 维", "1 维", "2 维", "3 维"], "0 维", function (m) {
      playing = false; playBtn.textContent = "播放";
      dim = parseInt(m, 10) || 0;
      build();
    });

    VZ.raf(svg, function (t, dt) {
      if (!playing) return;
      acc += dt;
      if (acc > 1.7) { acc = 0; dim = (dim + 1) % 4; build(); }
    });
  }
},

/* ========================================================
   ch12 · e  爱因斯坦求和约定：一上一下，成对求和
   ======================================================== */
"f-ch12e": {
  title: "",
  hint: "点下面的<b>例子按钮</b>：上式是老实的写法，下式是爱因斯坦的缩写——<b>同一个指标一上一下成对出现，就默认对它求和</b>（金色高亮）。最后一个反例里 i 同侧出现，只取分量、<b>不求和</b>（红色）。",
  draw: function (stage) {
    var W = 760, H = 235, svg = VZ.S(stage, W, H);
    var C = VZ.C;
    var GOLD = C.gold, RED = C.red;

    /* 分段排版：seg = [文本, 颜色, dy, size, weight] */
    var layer = VZ.g(svg);
    function drawSeq(segs, x, y, size) {
      var cur = x;
      segs.forEach(function (sg) {
        VZ.txt(layer, cur, y + (sg[2] || 0), sg[0],
          { size: sg[3] || size, fill: sg[1] || C.ink, weight: sg[4] || 400 });
        var w = 0;
        for (var i = 0; i < sg[0].length; i++) w += (/[\x00-\xff]/.test(sg[0][i]) ? 0.58 : 1) * (sg[3] || size);
        cur += w + 1;
      });
      return cur;
    }
    function sub(t2) { return [t2, GOLD, 5, 12]; }
    function sup(t2) { return [t2, GOLD, -9, 12]; }
    function base(t2, col) { return [t2, col || C.ink, 0, 20]; }

    var exs = [
      { name: "aᵢ bⁱ —— 内积", sum: "i",
        full: [base("c  =  "), base("Σ", C.cyan, 0, 22), sub("i"), base("  a"), sub("i"), base(" b"), sup("i")],
        ein: [base("c  =  "), base("a"), sub("i"), base(" b"), sup("i")],
        note: "i 成对（一下一上）→ 求和：c = a₁b¹ + a₂b² + …" },
      { name: "gᵢⱼ xⁱ xʲ —— 长度²", sum: "ij",
        full: [base("s  =  "), base("Σ", C.cyan, 0, 22), sub("i"), base("Σ", C.cyan, 0, 22), sub("j"), base("  g"), sub("i"), sub("j"), base(" x"), sup("i"), base(" x"), sup("j")],
        ein: [base("s  =  "), base("g"), sub("i"), sub("j"), base(" x"), sup("i"), base(" x"), sup("j")],
        note: "i、j 各自成对 → 双重求和（度规缩短向量）" },
      { name: "∂ᵢ vⁱ —— 散度", sum: "i",
        full: [base("div v  =  "), base("Σ", C.cyan, 0, 22), sub("i"), base("  ∂"), sub("i"), base(" v"), sup("i")],
        ein: [base("div v  =  "), base("∂"), sub("i"), base(" v"), sup("i")],
        note: "i 成对 → 求和：div v = ∂₁v¹ + ∂₂v² + ∂₃v³" },
      { name: "xⁱ + yⁱ —— 反例：不求和", sum: "",
        full: [base("z"), sup("i"), base("  =  "), base("x"), sup("i"), base(" + "), base("y"), sup("i")],
        ein: [base("z"), sup("i"), base("  =  "), base("x"), sup("i"), base(" + "), base("y"), sup("i")],
        note: "i 只出现、没有配对（自由指标）→ 逐分量等式，不求和", bad: true }
    ];
    var cur = 0;
    function render() {
      var e = exs[cur];
      var good = !e.bad;
      var colI = good ? GOLD : RED;
      layer.innerHTML = "";
      function paint(segs) {
        segs.forEach(function (sg) {
          if (sg[0].length === 1 && /[ij]/.test(sg[0])) sg[1] = colI;
          else if (sg[0] === "Σ") sg[1] = C.cyan;
        });
        return segs;
      }
      drawSeq(paint(e.full.slice()), 190, 62, 20);
      drawSeq(paint(e.ein.slice()), 190, 130, 20);
      VZ.txt(layer, 70, 62, "显式", { size: 13, fill: C.dim });
      VZ.txt(layer, 70, 130, "缩写", { size: 13, fill: C.dim });
      VZ.txt(layer, 190, 176, good ? "金色 = 哑标（求和）" : "红色 = 自由指标（不求和）", { size: 12, fill: good ? GOLD : RED });
    }

    VZ.txt(svg, 380, 26, "同一个指标「一上一下」成对出现 ⇒ 求和", { size: 14, fill: C.ink2, anchor: "middle", weight: 700 });
    render();
    var noteEl = VZ.note(stage, exs[0].note);

    VZ.chips(stage, exs.map(function (e) { return e.name; }), exs[0].name, function (m) {
      cur = exs.findIndex ? exs.findIndex(function (e) { return e.name === m; }) : 0;
      for (var i = 0; i < exs.length; i++) if (exs[i].name === m) cur = i;
      render();
      noteEl.textContent = exs[cur].note;
    });
  }
},

/* ========================================================
   ch12 · f  梯度下降：球沿最陡方向滚
   ======================================================== */
"f-ch12f": {
  title: "",
  hint: "球总是沿<b>负梯度</b>（下坡最陡方向）迈步：<b>点「走一步」</b>或开「自动」，看它滚进谷底。<b>步长 η 滑大</b>试试——步子太大会跨过谷底来回震荡，太小则挪得慢。<span class='hl'>梯度 ∇f 指向上坡，是最陡上升方向；学习率与收敛的拉锯，全在这条曲线上。</span>",
  draw: function (stage) {
    var W = 760, H = 260, svg = VZ.S(stage, W, H, { grid: true });
    var C = VZ.C;
    var x0 = 56, x1 = 700, yB = 212, yT = 42;
    var XMAX = 10;
    function f(x) { return 0.55 + 0.45 * Math.sin(1.25 * x + 0.6) + 0.075 * x; }
    function df(x) { var h = 1e-3; return (f(x + h) - f(x - h)) / (2 * h); }
    function sx(x) { return x0 + (x1 - x0) * x / XMAX; }
    function sy(v) { return yB - v * 92; }
    var eta = 0.25, x = 1.2, steps = 0, trail = [];
    var auto = false, acc = 0;

    var dCurve = "";
    for (var i = 0; i <= 240; i++) {
      var xx = XMAX * i / 240;
      dCurve += (i ? "L" : "M") + sx(xx).toFixed(1) + " " + sy(f(xx)).toFixed(1);
    }
    VZ.path(svg, dCurve, VZ.stroke({ stroke: C.ink2, "stroke-width": 1.8 }));
    VZ.ln(svg, x0, yB, x1, yB, { stroke: C.faint, "stroke-width": 1 });

    var arG = VZ.arrowDef(svg, VZ.uid("ar"), C.green);
    var ball = VZ.circ(svg, 0, 0, 8, { fill: C.gold, stroke: C.deep, "stroke-width": 2 });
    var dirA = VZ.ln(svg, 0, 0, 0, 0, VZ.stroke({ stroke: C.green, "stroke-width": 2.4, "marker-end": arG }));
    var trailG = VZ.g(svg, { opacity: .5 });

    var out = VZ.panel(stage, { "x": "1.20", "f(x)": "", "f′(x)": "", "步数": "0" });

    function redraw() {
      ball.setAttribute("cx", sx(x)); ball.setAttribute("cy", sy(f(x)));
      var g = df(x);
      var s = g > 0 ? -1 : 1;
      dirA.setAttribute("x1", sx(x)); dirA.setAttribute("y1", sy(f(x)) - 16);
      dirA.setAttribute("x2", sx(x) + s * 34); dirA.setAttribute("y2", sy(f(x)) - 16);
      VZ.setPanel(out, {
        "x": x.toFixed(2), "f(x)": f(x).toFixed(3),
        "f′(x)": g.toFixed(3), "步数": String(steps)
      });
    }
    function step() {
      trail.push([x, f(x)]);
      if (trail.length > 26) trail.shift();
      trailG.innerHTML = "";
      trail.forEach(function (p2, i) {
        VZ.circ(trailG, sx(p2[0]), sy(p2[1]), 2.5, { fill: C.gold, opacity: (i / trail.length) * .8 });
      });
      x = VZ.clamp(x - eta * df(x), 0, XMAX);
      steps++;
      redraw();
    }
    redraw();

    VZ.slider(stage, { label: "步长 η", value: 0.25, min: 0.02, max: 1.1, step: 0.01,
      format: function (v) { return v.toFixed(2); },
      onInput: function (v) { eta = v; } });
    VZ.btn(stage, "走一步", step);
    var autoBtn = VZ.btn(stage, "自动下坡", function () {
      auto = !auto; autoBtn.textContent = auto ? "暂停" : "自动下坡";
    });
    VZ.btn(stage, "重置", function () {
      x = 1.2; steps = 0; trail = []; trailG.innerHTML = "";
      auto = false; autoBtn.textContent = "自动下坡";
      redraw();
    });
    VZ.raf(svg, function (t, dt) {
      void t;
      if (!auto) return;
      acc += dt;
      if (acc > 0.28) { acc = 0; step(); }
    });
  }
},

/* ========================================================
   ch12 · g  体积元与雅可比：小方块被坐标映射捏成多大
   ======================================================== */
"f-ch12g": {
  title: "",
  hint: "左边是参数域 (u, v)，白色小方块是这里的「单位体积元」；右边是同一个方块经过映射 F 之后的像。<b>拖动白点</b>：像有时被撑大（绿色、|det J| > 1），有时被压扁（红色、|det J| < 1）。<span class='hl'>积分里的 dx dy 从来不是摆设——雅可比行列式正是体积元在换坐标时的伸缩率。</span>",
  draw: function (stage) {
    var W = 760, H = 280, svg = VZ.S(stage, W, H, { grid: true });
    var C = VZ.C;
    var A = 0.7;
    function F(u, v) { return [u + A * Math.sin(v), v + A * Math.sin(u)]; }
    function detJ(u, v) { return 1 - A * A * Math.cos(u) * Math.cos(v); }

    /* 左：参数域 */
    var u0 = 64, v0 = 56, us = 52;   /* [0,3]² → 156px */
    var P = [1.5, 1.2], s = 0.42;
    VZ.card(svg, u0 - 10, v0 - 10, 3 * us + 20, 3 * us + 20, { stroke: C.faint });
    VZ.txt(svg, u0 + 1.5 * us, v0 + 3 * us + 26, "参数域 (u, v)", { size: 12, fill: C.dim, anchor: "middle" });
    for (var i = 0; i <= 3; i++) {
      VZ.ln(svg, u0, v0 + i * us, u0 + 3 * us, v0 + i * us, { stroke: C.faint, "stroke-width": .8 });
      VZ.ln(svg, u0 + i * us, v0, u0 + i * us, v0 + 3 * us, { stroke: C.faint, "stroke-width": .8 });
    }
    var hit = VZ.el("rect", { x: u0 - 10, y: v0 - 10, width: 3 * us + 20, height: 3 * us + 20, fill: "transparent", style: "cursor:grab" }, svg);
    var sqL = VZ.el("rect", { x: 0, y: 0, width: 0, height: 0, fill: C.ink, "fill-opacity": .15, stroke: C.ink, "stroke-width": 1.6 }, svg);
    var pd = VZ.circ(svg, 0, 0, 5.5, { fill: C.ink, stroke: C.deep, "stroke-width": 2 });

    /* 右：映射后的平面 */
    var mx0 = 330, my0 = 244, ms2 = 56;   /* [0,4]² → 224px，y 向下翻 */
    function scr2(p) { return [mx0 + p[0] * ms2, my0 - p[1] * ms2]; }
    VZ.txt(svg, mx0 + 2 * ms2, my0 + 24, "映射后：dx dy 变成 |det J| du dv", { size: 12, fill: C.dim, anchor: "middle" });
    /* 背景变形网格 */
    for (var k = 0; k <= 6; k++) {
      var d1 = "", d2 = "";
      for (var j = 0; j <= 40; j++) {
        var uu = 3 * j / 40;
        var p1 = scr2(F(uu, 3 * k / 6));
        var p2 = scr2(F(3 * k / 6, uu));
        d1 += (j ? "L" : "M") + p1[0].toFixed(1) + " " + p1[1].toFixed(1);
        d2 += (j ? "L" : "M") + p2[0].toFixed(1) + " " + p2[1].toFixed(1);
      }
      VZ.path(svg, d1, { stroke: C.faint, "stroke-width": .7, fill: "none", opacity: .8 });
      VZ.path(svg, d2, { stroke: C.faint, "stroke-width": .7, fill: "none", opacity: .8 });
    }
    var img = VZ.path(svg, "", { fill: C.cyan, "fill-opacity": .2, stroke: C.cyan, "stroke-width": 1.8 });

    var out = VZ.panel(stage, { "方块位置 (u, v)": "", "|det J| 面积比": "", "结论": "" });

    function redraw() {
      var lo = [VZ.clamp(P[0] - s / 2, 0, 3 - s), VZ.clamp(P[1] - s / 2, 0, 3 - s)];
      P = [lo[0] + s / 2, lo[1] + s / 2];
      sqL.setAttribute("x", u0 + lo[0] * us);
      sqL.setAttribute("y", v0 + (3 - lo[1] - s) * us);
      sqL.setAttribute("width", s * us);
      sqL.setAttribute("height", s * us);
      var pc = [u0 + P[0] * us, v0 + (3 - P[1]) * us];
      pd.setAttribute("cx", pc[0]); pd.setAttribute("cy", pc[1]);
      /* 像方块：边界采样 */
      var d = "", N = 10;
      var corners = [
        [lo[0], lo[1]], [lo[0] + s, lo[1]],
        [lo[0] + s, lo[1] + s], [lo[0], lo[1] + s]
      ];
      for (var e2 = 0; e2 < 4; e2++) {
        var c1 = corners[e2], c2 = corners[(e2 + 1) % 4];
        for (var q2 = 0; q2 <= N; q2++) {
          var uu2 = c1[0] + (c2[0] - c1[0]) * q2 / N;
          var vv2 = c1[1] + (c2[1] - c1[1]) * q2 / N;
          var pp = scr2(F(uu2, vv2));
          d += (e2 === 0 && q2 === 0 ? "M" : "L") + pp[0].toFixed(1) + " " + pp[1].toFixed(1);
        }
      }
      img.setAttribute("d", d + "Z");
      var dt = detJ(P[0], P[1]);
      img.setAttribute("fill", dt >= 1 ? C.green : C.red);
      img.setAttribute("stroke", dt >= 1 ? C.green : C.red);
      img.setAttribute("fill-opacity", .2);
      VZ.setPanel(out, {
        "方块位置 (u, v)": P[0].toFixed(2) + ", " + P[1].toFixed(2),
        "|det J| 面积比": dt.toFixed(3),
        "结论": dt >= 1 ? "局部被放大（撑开）" : "局部被压缩（捏扁）"
      });
    }
    redraw();

    VZ.drag(svg, hit, W, H, function (x, y) {
      P = [VZ.clamp((x - u0) / us, 0.3, 2.7), VZ.clamp(3 - (y - v0) / us, 0.3, 2.7)];
      redraw();
    });
  }
},

});
