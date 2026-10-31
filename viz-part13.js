/* ============================================================
   viz-part13.js — 第三批挂载式小图（ch21–ch24，每章 4 张）
   挂载图：title 为空，画布高 220–320，嵌在讲解步骤正文下方。
   ============================================================ */
VZ.define({

/* ------------------------------------------------------------
   f-ch21d · 位置×动量不可交换：先平移后调制 vs 先调制后平移
   ------------------------------------------------------------ */
"f-ch21d": {
  title: "",
  hint: "拖动滑杆改变平移量 <b>a</b>，对比两条曲线：包络完全一样，载波的<b>相位</b>却差了 k·a。两次操作的先后顺序只差一个相位因子 e<sup>−ika</sup>——这正是对易子 [M(k), T(a)] ≠ 0 的全部内容，而它就是不确定性关系的种子。",
  draw: function (stage) {
    var W = 760, H = 300, svg = VZ.S(stage, W, H, { grid: true });
    var C = VZ.C;
    var x0 = 150, sig = 26, k0 = 0.32, amp = 30;
    var rows = [
      { top: 30,  label: "先平移 T(a)，再调制 M(k)", c: C.cyan },
      { top: 172, label: "先调制 M(k)，再平移 T(a)", c: C.mag }
    ];
    var ar = VZ.arrowDef(svg, VZ.uid("ar"), C.ink2);
    rows.forEach(function (r) {
      VZ.txt(svg, 60, r.top + 12, r.label, { size: 12.5, fill: r.c, weight: 700 });
      /* 包络（虚线）与波形 */
      r.env = VZ.path(svg, "", VZ.stroke({ stroke: r.c, "stroke-width": 1, opacity: .4, "stroke-dasharray": "4 4" }));
      r.wave = VZ.path(svg, "", VZ.stroke({ stroke: r.c, "stroke-width": 1.8 }));
      r.mid = r.top + 62;
      VZ.ln(svg, 40, r.mid, 530, r.mid, { stroke: C.faint, "stroke-width": .8 });
    });
    function gauss(x, mu) { var d = (x - mu) / sig; return Math.exp(-d * d / 2); }
    function redraw(a) {
      rows.forEach(function (r, i) {
        var mu = x0 + a, phase0 = (i === 0) ? 0 : -k0 * a;
        var de = "", dw = "";
        for (var x = 42; x <= 528; x += 3) {
          var genv = gauss(x, mu);
          var y = r.mid - amp * genv;
          de += (x === 42 ? "M" : "L") + x + " " + y.toFixed(1);
          var wv = genv * Math.cos(k0 * x + phase0);
          var yw = r.mid - amp * 0.92 * wv;
          dw += (x === 42 ? "M" : "L") + x + " " + yw.toFixed(1);
        }
        r.env.setAttribute("d", de);
        r.wave.setAttribute("d", dw);
      });
      VZ.setPanel(info, {
        "平移量 a": a.toFixed(0) + " px",
        "相位差 Δφ = k·a": (k0 * a).toFixed(2) + " rad",
        "结论": "包络相同，只差相位 e^(−ika)"
      });
    }
    var info = VZ.panel(stage, { "平移量 a": "", "相位差 Δφ = k·a": "", "结论": "" });
    var sa = VZ.slider(stage, { label: "平移量 a", value: 40, min: 0, max: 90, step: 1, onInput: redraw });
    redraw(40);
    VZ.txt(svg, 560, 60, "T(a)：把波包整体右移", { size: 12, fill: C.ink2 });
    VZ.txt(svg, 560, 82, "M(k)：乘上平面波 e^(ikx)", { size: 12, fill: C.ink2 });
    VZ.card(svg, 556, 100, 184, 74, { stroke: "rgba(255,255,255,.13)" });
    VZ.txt(svg, 572, 124, "M·T ≠ T·M", { size: 17, fill: C.gold, weight: 700, "font-family": "Georgia,serif" });
    VZ.para(svg, 572, 144, "[M,T] = (1 − e^{−ika})·MT，非零 → 不确定性。", { size: 11.5, per: 15, lh: 17 });
  }
},

/* ------------------------------------------------------------
   f-ch21e · 薛定谔方程的演化：高斯波包展宽 + 群速度
   ------------------------------------------------------------ */
"f-ch21e": {
  title: "",
  hint: "按<b>播放/暂停</b>，看一个自由高斯波包怎么按 iħ∂ψ/∂t = Hψ 演化：中心以群速度 v 前进，宽度按 σ(t) = σ₀√(1+(t/τ)²) 展宽。<b>σ₀ 越小展宽越快</b>——动量越不确定，位置就守不住。",
  draw: function (stage) {
    var W = 760, H = 280, svg = VZ.S(stage, W, H, { grid: true });
    var C = VZ.C;
    var midY = 150, amp = 78, baseX = 90, vX = 34;
    VZ.ln(svg, 40, midY, 720, midY, { stroke: C.faint, "stroke-width": .8 });
    VZ.txt(svg, 714, midY - 10, "x", { size: 11, fill: C.dim, anchor: "end" });
    var fill = VZ.grad(svg, VZ.uid("wp"), [[0, C.cyan, .38], [1, C.cyan, .05]], true);
    var area = VZ.path(svg, "", { fill: fill, stroke: "none" });
    var curve = VZ.path(svg, "", VZ.stroke({ stroke: C.cyan, "stroke-width": 1.6 }));
    var cDot = VZ.circ(svg, 0, midY, 4.5, { fill: C.gold });
    var tRead = VZ.txt(svg, 620, 46, "", { size: 13, fill: C.gold, weight: 700 });
    var sRead = VZ.txt(svg, 620, 68, "", { size: 12, fill: C.ink2 });
    var paused = false, s0 = 30, tt = 0;
    function sigNow(t, s0v) { var tau = 0.9 + s0v * s0v / 260; return s0v * Math.sqrt(1 + (t / tau) * (t / tau)); }
    function draw(t) {
      var mu = baseX + vX * t;
      var sg = sigNow(t, s0);
      var da = "", dc = "";
      for (var x = 40; x <= 700; x += 3) {
        var d = (x - mu) / sg;
        var p = Math.exp(-d * d / 2);
        var ya = midY - amp * p;
        da += (x === 40 ? "M" : "L") + x + " " + ya.toFixed(1) + "L" + x + " " + (midY + amp * p).toFixed(1);
        dc += (x === 40 ? "M" : "L") + x + " " + (midY - amp * p * Math.cos(0.16 * (x - mu) + 0)).toFixed(1);
      }
      area.setAttribute("d", da + "Z");
      curve.setAttribute("d", dc);
      cDot.setAttribute("cx", mu);
      tRead.textContent = "t = " + t.toFixed(2);
      sRead.textContent = "Δx(t) = " + sg.toFixed(1) + "  （初始 σ₀ = " + s0.toFixed(0) + "）";
    }
    var sl = VZ.slider(stage, { label: "初始宽度 σ₀（越窄展宽越快）", value: 30, min: 12, max: 60, step: 1,
      onInput: function (v) { s0 = v; if (paused) draw(tt); } });
    var bb = VZ.btn(stage, "暂停", function () { paused = !paused; bb.textContent = paused ? "播放" : "暂停"; });
    VZ.raf(svg, function (t) {
      if (paused) return;
      tt = (t * 0.55) % 7;
      draw(tt);
    });
    VZ.txt(svg, 46, 46, "iħ ∂ψ/∂t = Hψ", { size: 17, fill: C.ink, "font-family": "Georgia,serif", weight: 700 });
    VZ.txt(svg, 46, 68, "决定论的 U 演化：形状可算，落点不可算", { size: 11.5, fill: C.dim });
  }
},

/* ------------------------------------------------------------
   f-ch21f · 概率流：一处增另一处减，总和恒为 1
   ------------------------------------------------------------ */
"f-ch21f": {
  title: "",
  hint: "拖动时间滑杆，看波包穿过虚线分界：左区概率<b>减少</b>多少，右区就<b>增加</b>多少，总和始终是 1——这就是连续性方程 ∂ρ/∂t + ∂j/∂x = 0。概率不是凭空冒出，而是<b>流</b>过去的。",
  draw: function (stage) {
    var W = 760, H = 260, svg = VZ.S(stage, W, H, { grid: true });
    var C = VZ.C;
    var midY = 108, amp = 62, div = 400;
    VZ.ln(svg, 40, midY, 720, midY, { stroke: C.faint, "stroke-width": .8 });
    VZ.ln(svg, div, 34, div, 200, { stroke: C.gold, "stroke-width": 1.3, "stroke-dasharray": "6 5" });
    VZ.txt(svg, div + 6, 46, "分界", { size: 11, fill: C.gold });
    VZ.txt(svg, 120, 40, "左区概率", { size: 11.5, fill: C.cyan });
    VZ.txt(svg, 560, 40, "右区概率", { size: 11.5, fill: C.mag });
    var fillL = VZ.grad(svg, VZ.uid("fl"), [[0, C.cyan, .4], [1, C.cyan, .05]], true);
    var fillR = VZ.grad(svg, VZ.uid("fr"), [[0, C.mag, .4], [1, C.mag, .05]], true);
    var areaL = VZ.path(svg, "", { fill: fillL, stroke: "none" });
    var areaR = VZ.path(svg, "", { fill: fillR, stroke: "none" });
    var curve = VZ.path(svg, "", VZ.stroke({ stroke: C.ink, "stroke-width": 1.5 }));
    var ar = VZ.arrowDef(svg, VZ.uid("ar"), C.gold);
    var flux = VZ.path(svg, "M" + (div - 34) + " " + 74 + "H" + (div + 34), { stroke: C.gold, "stroke-width": 2, "marker-end": ar, opacity: .9 });
    VZ.txt(svg, div, 66, "概率流 j", { size: 10.5, fill: C.gold, anchor: "middle" });
    /* 底部双柱 */
    var barY = 214, barH = 34;
    var barL = VZ.path(svg, "", { fill: C.cyan, opacity: .75 });
    var barR = VZ.path(svg, "", { fill: C.mag, opacity: .75 });
    var sumTxt = VZ.txt(svg, 620, barY + 23, "", { size: 13, fill: C.green, weight: 700 });
    function rho(x, t) {
      var mu = 150 + 62 * t, sg = 34 + 7 * t;
      var d = (x - mu) / sg;
      return Math.exp(-d * d);
    }
    function draw(t) {
      var da = "M40 " + midY, dc = "";
      var iL = 0, iR = 0;
      for (var x = 40; x <= 700; x += 4) {
        var p = rho(x, t);
        var w = 4 * p;
        if (x < div) { iL += p * 4; da += "L" + x + " " + (midY - amp * p).toFixed(1) + "L" + x + " " + midY; }
        else { iR += p * 4; }
        dc += (x === 40 ? "M" : "L") + x + " " + (midY - amp * p).toFixed(1);
      }
      areaL.setAttribute("d", da + "Z");
      areaR.setAttribute("d", dc + "L700 " + midY + "L" + div + " " + midY + "Z");
      areaR.setAttribute("fill", fillR);
      curve.setAttribute("d", dc);
      var tot = iL + iR, fl = iL / tot, fr = iR / tot, maxW = 200;
      barL.setAttribute("d", "M70 " + barY + "h" + (maxW * fl).toFixed(1) + "v" + barH + "H70Z");
      barR.setAttribute("d", "M470 " + barY + "h" + (maxW * fr).toFixed(1) + "v" + barH + "H470Z");
      sumTxt.textContent = "P左 + P右 = " + (fl + fr).toFixed(3);
    }
    VZ.slider(stage, { label: "时间 t", value: 0, min: 0, max: 7, step: 0.05, onInput: draw });
    draw(0);
    VZ.txt(svg, 70, barY - 6, "P左", { size: 11, fill: C.cyan });
    VZ.txt(svg, 470, barY - 6, "P右", { size: 11, fill: C.mag });
  }
},

/* ------------------------------------------------------------
   f-ch21g · 位置表象 vs 动量表象：同一个态的两套坐标
   ------------------------------------------------------------ */
"f-ch21g": {
  title: "",
  hint: "拖动<b>动量 p₀</b>：右图的峰移动，左图的 |ψ(x)|² 却纹丝不动（动量藏在相位里，位置表象看不见）。拖动<b>宽度 σ</b>：两边一胖一瘦，σ<sub>x</sub>·σ<sub>p</sub> 恒等于 ħ/2——傅里叶变换的两面。",
  draw: function (stage) {
    var W = 760, H = 280, svg = VZ.S(stage, W, H, { grid: true });
    var C = VZ.C;
    var midY = 130, amp = 74;
    function panel(x0, title, color) {
      VZ.ln(svg, x0 - 130, midY, x0 + 130, midY, { stroke: C.faint, "stroke-width": .8 });
      VZ.txt(svg, x0, 34, title, { size: 13, fill: color, weight: 700, anchor: "middle" });
    }
    panel(190, "位置表象  |ψ(x)|²", C.cyan);
    panel(570, "动量表象  |φ(p)|²", C.mag);
    var curL = VZ.path(svg, "", VZ.stroke({ stroke: C.cyan, "stroke-width": 1.7 }));
    var curR = VZ.path(svg, "", VZ.stroke({ stroke: C.mag, "stroke-width": 1.7 }));
    var peak = VZ.circ(svg, 570, midY - amp, 5, { fill: C.gold });
    function draw(sig, p0) {
      var dL = "", dR = "";
      for (var i = 0; i <= 80; i++) {
        var u = -130 + 260 * i / 80;
        var yL = midY - amp * Math.exp(-(u * u) / (2 * (60 * sig) * (60 * sig)));
        dL += (i ? "L" : "M") + (190 + u).toFixed(1) + " " + yL.toFixed(1);
        var uR = u - p0 * 52;
        var sg2 = 52 / (2 * sig);
        var yR = midY - amp * Math.exp(-(uR * uR) / (2 * sg2 * sg2));
        dR += (i ? "L" : "M") + (570 + u).toFixed(1) + " " + yR.toFixed(1);
      }
      curL.setAttribute("d", dL);
      curR.setAttribute("d", dR);
      peak.setAttribute("cx", 570 + p0 * 52);
      VZ.setPanel(info, {
        "σx（位置宽度）": (sig).toFixed(2),
        "σp（动量宽度）": (1 / (2 * sig)).toFixed(2),
        "σx · σp": "0.500 = ħ/2 ✓"
      });
    }
    var info = VZ.panel(stage, { "σx（位置宽度）": "", "σp（动量宽度）": "", "σx · σp": "" });
    VZ.slider(stage, { label: "平均动量 p₀", value: 0, min: -2, max: 2, step: 0.05, onInput: function (v) { draw(sigVal, v); p0Val = v; } });
    VZ.slider(stage, { label: "位置宽度 σ（无量纲）", value: 1, min: 0.35, max: 2.2, step: 0.05, onInput: function (v) { draw(v, p0Val); sigVal = v; } });
    var sigVal = 1, p0Val = 0;
    draw(1, 0);
    VZ.txt(svg, 190, midY + 22, "峰不动：p₀ 只改相位 e^{ip₀x}", { size: 11, fill: C.dim, anchor: "middle" });
    VZ.txt(svg, 570, midY + 22, "峰随 p₀ 平移，宽度反比变窄", { size: 11, fill: C.dim, anchor: "middle" });
  }
},

/* ------------------------------------------------------------
   f-ch22d · YES/NO 测量：一次提问，一次坍缩
   ------------------------------------------------------------ */
"f-ch22d": {
  title: "",
  hint: "拖动滑杆制备态 |ψ⟩ 的方向，点<b>测量</b>：以 cos²(θ−α) 的概率得到 YES（态跳到测量轴上），否则 NO（跳到垂直方向）。YES/NO 是厄米算子仅有的两个本征值——测量就是在问一个封闭问题。",
  draw: function (stage) {
    var W = 760, H = 300, svg = VZ.S(stage, W, H, {});
    var C = VZ.C;
    var cx = 200, cy = 152, R = 92;
    var alpha = -32 * Math.PI / 180;
    VZ.circ(svg, cx, cy, R, { stroke: C.faint, "stroke-width": 1.2 });
    VZ.circ(svg, cx, cy, R, { fill: "rgba(255,255,255,.03)", stroke: "none" });
    function axLine(ang, color, dash, label) {
      var dx = Math.cos(ang) * R, dy = -Math.sin(ang) * R;
      VZ.ln(svg, cx - dx, cy - dy, cx + dx, cy + dy, { stroke: color, "stroke-width": 1.6, "stroke-dasharray": dash || "none" });
      VZ.txt(svg, cx + dx * 1.16, cy + dy * 1.16 + 4, label, { size: 12, fill: color, anchor: "middle", weight: 700 });
    }
    axLine(alpha, C.cyan, "none", "a（测量轴）");
    axLine(alpha + Math.PI / 2, C.violet, "4 4", "a⊥");
    var st = { th: 70 * Math.PI / 180 };
    var arrow = VZ.path(svg, "", VZ.stroke({ stroke: C.gold, "stroke-width": 2.6 }));
    var head = VZ.path(svg, "", { fill: C.gold });
    var lbl = VZ.txt(svg, 0, 0, "|ψ⟩", { size: 12.5, fill: C.gold, weight: 700, anchor: "middle" });
    function drawArrow() {
      var dx = Math.cos(st.th) * R, dy = -Math.sin(st.th) * R;
      arrow.setAttribute("d", "M" + cx + " " + cy + "L" + (cx + dx) + " " + (cy + dy));
      var hx = cx + dx, hy = cy + dy, ux = dx / R, uy = dy / R;
      head.setAttribute("d", "M" + hx + " " + hy + "l" + (-9 * ux + 5 * uy) + " " + (-9 * uy - 5 * ux) + "L" + (hx - 2 * ux) + " " + (hy - 2 * uy) + "L" + (hx - 9 * ux - 5 * uy) + " " + (hy - 9 * uy + 5 * ux) + "z");
      lbl.setAttribute("x", cx + dx * 1.22); lbl.setAttribute("y", cy + dy * 1.22 + 4);
    }
    drawArrow();
    var info = VZ.panel(stage, { "P(YES) = cos²(θ−α)": "", "YES 次数": "0", "NO 次数": "0" });
    var nY = 0, nN = 0, busy = false;
    VZ.slider(stage, { label: "制备态方向 θ（度）", value: 70, min: 0, max: 360, step: 1,
      onInput: function (v) { if (busy) return; st.th = v * Math.PI / 180; updP(); drawArrow(); } });
    function updP() {
      var d = (st.th - alpha) * 180 / Math.PI;
      VZ.setPanel(info, { "P(YES) = cos²(θ−α)": Math.pow(Math.cos(st.th - alpha), 2).toFixed(3) + "（θ−α = " + (((st.th - alpha) * 180 / Math.PI + 360) % 360).toFixed(0) + "°）", "YES 次数": String(nY), "NO 次数": String(nN) });
    }
    updP();
    VZ.btn(stage, "测量！", function () {
      if (busy) return;
      busy = true;
      var yes = Math.random() < Math.pow(Math.cos(st.th - alpha), 2);
      if (yes) nY++; else nN++;
      var target = yes ? alpha : alpha + Math.PI / 2;
      var from = st.th, t0 = null;
      var stop = VZ.raf(svg, function (t, ms) {
        if (t0 === null) t0 = t;
        var u = Math.min((t - t0) / 0.45, 1);
        var e = VZ.ease(u);
        var d = target - from;
        st.th = from + d * e;
        drawArrow();
        if (u >= 1) { busy = false; stop(); updP(); }
      });
    });
    VZ.card(svg, 430, 60, 300, 90, { stroke: "rgba(255,255,255,.13)" });
    VZ.para(svg, 448, 88, "YES → 态坍缩到轴 a 上；NO → 坍缩到垂直方向。两条路都改变态：问一个问题，就打扰一次系统。", { size: 12.5, per: 22, lh: 19 });
    VZ.txt(svg, 448, 178, "连续按「测量」：YES 之后永远 YES", { size: 11.5, fill: C.dim });
  }
},

/* ------------------------------------------------------------
   f-ch22e · 态的叠加系数：α²+β²=1 的圆约束
   ------------------------------------------------------------ */
"f-ch22e": {
  title: "",
  hint: "|ψ⟩ = α|↑⟩ + β|↓⟩。拖动 α，β 被<b>自动补成 √(1−α²)</b>——归一化把两个自由度压成一个单位圆，只能沿圆周移动，不能随便往里飞。切 β 的符号看看：相位不同，态就不同。",
  draw: function (stage) {
    var W = 760, H = 260, svg = VZ.S(stage, W, H, {});
    var C = VZ.C;
    var cx = 170, cy = 128, R = 84;
    VZ.circ(svg, cx, cy, R, { stroke: C.faint, "stroke-width": 1.2 });
    VZ.ln(svg, cx - R - 24, cy, cx + R + 24, cy, { stroke: C.faint, "stroke-width": .8 });
    VZ.ln(svg, cx, cy - R - 20, cx, cy + R + 20, { stroke: C.faint, "stroke-width": .8 });
    VZ.txt(svg, cx + R + 28, cy + 4, "|↑⟩", { size: 11.5, fill: C.dim });
    VZ.txt(svg, cx - R - 26, cy + 4, "−|↑⟩", { size: 11.5, fill: C.dim, anchor: "end" });
    VZ.txt(svg, cx, cy + R + 34, "α|↑⟩ ⊕ β|↓⟩（归一化圆）", { size: 11.5, fill: C.dim, anchor: "middle" });
    var dot = VZ.circ(svg, cx, cy, 7, { fill: C.gold });
    var vline = VZ.path(svg, "", VZ.stroke({ stroke: C.gold, "stroke-width": 2.2 }));
    var arcP = VZ.path(svg, "", VZ.stroke({ stroke: C.gold, "stroke-width": 1, opacity: .5, "stroke-dasharray": "3 4" }));
    function draw(a, sgn) {
      var b = sgn * Math.sqrt(Math.max(1 - a * a, 0));
      var x = cx + a * R, y = cy - b * R;
      dot.setAttribute("cx", x); dot.setAttribute("cy", y);
      vline.setAttribute("d", "M" + cx + " " + cy + "L" + x.toFixed(1) + " " + y.toFixed(1));
      var th = Math.atan2(b, a);
      var large = Math.abs(th) > Math.PI ? 1 : 0;
      arcP.setAttribute("d", "M" + (cx + R) + " " + cy + "A" + R + " " + R + " 0 " + large + " " + (th < 0 ? 1 : 0) + " " + x.toFixed(1) + " " + y.toFixed(1));
      VZ.setPanel(info, {
        "α = cos χ": a.toFixed(3),
        "β = ±sin χ": b.toFixed(3),
        "|α|² + |β|²": (a * a + b * b).toFixed(3) + " = 1 ✓",
        "P(↑) : P(↓)": (a * a).toFixed(2) + " : " + (b * b).toFixed(2)
      });
    }
    var info = VZ.panel(stage, { "α = cos χ": "", "β = ±sin χ": "", "|α|² + |β|²": "", "P(↑) : P(↓)": "" });
    var sgn = 1, curA = 0.6;
    VZ.slider(stage, { label: "α（β 自动归一化）", value: 0.6, min: -1, max: 1, step: 0.01, onInput: function (v) { curA = v; draw(v, sgn); } });
    VZ.chips(stage, ["β 取 +", "β 取 −"], "β 取 +", function (m) { sgn = (m === "β 取 +") ? 1 : -1; draw(curA, sgn); });
    VZ.txt(svg, 470, 60, "两个复系数本是 4 个实数", { size: 12, fill: C.ink2 });
    VZ.para(svg, 470, 82, "归一化去掉 1 个，整体相位再去掉 1 个——只剩一个角度 χ。球面而非圆盘：态住在希尔伯特空间的「方向」上。", { size: 12, per: 21, lh: 18 });
  }
},

/* ------------------------------------------------------------
   f-ch22f · 零测量与测量顺序：没看到结果，态照样变了
   ------------------------------------------------------------ */
"f-ch22f": {
  title: "",
  hint: "从 |↑⟩ 出发，选一个顺序连按<b>走一步</b>：每次测量沿 A 或 B 轴问 YES/NO，NO 时什么都没「看到」，态却跳到了垂直方向（零测量）。两个轴不对易——<b>换一个顺序，走出来的末态分布就不一样</b>。",
  draw: function (stage) {
    var W = 760, H = 300, svg = VZ.S(stage, W, H, {});
    var C = VZ.C;
    var cx = 185, cy = 152, R = 92;
    var A = 90 * Math.PI / 180, B = 28 * Math.PI / 180;
    VZ.circ(svg, cx, cy, R, { stroke: C.faint, "stroke-width": 1.2 });
    VZ.circ(svg, cx, cy, R, { fill: "rgba(255,255,255,.03)", stroke: "none" });
    function axLine(ang, color, label) {
      var dx = Math.cos(ang) * R, dy = -Math.sin(ang) * R;
      VZ.ln(svg, cx - dx, cy - dy, cx + dx, cy + dy, { stroke: color, "stroke-width": 1.5 });
      VZ.txt(svg, cx + dx * 1.17, cy + dy * 1.17 + 4, label, { size: 12, fill: color, anchor: "middle", weight: 700 });
    }
    axLine(A, C.cyan, "A");
    axLine(B, C.mag, "B");
    var st = { th: A };
    var arrow = VZ.path(svg, "", VZ.stroke({ stroke: C.gold, "stroke-width": 2.6 }));
    function drawArrow() {
      var dx = Math.cos(st.th) * R, dy = -Math.sin(st.th) * R;
      arrow.setAttribute("d", "M" + cx + " " + cy + "L" + (cx + dx) + " " + (cy + dy));
    }
    drawArrow();
    var order = "先 A 后 B";
    VZ.chips(stage, ["先 A 后 B", "先 B 后 A"], order, function (m) { order = m; reset(); });
    var seq = order === "先 A 后 B" ? [A, B] : [B, A];
    var stepIdx = 0;
    var info = VZ.panel(stage, { "第几步": "0 / 2", "刚发生的": "—", "当前态": "|↑⟩（A 轴）" });
    function reset() {
      seq = order === "先 A 后 B" ? [A, B] : [B, A];
      stepIdx = 0; st.th = A; drawArrow();
      VZ.setPanel(info, { "第几步": "0 / 2", "刚发生的": "—", "当前态": "|↑⟩（A 轴）" });
    }
    VZ.btn(stage, "走一步（测量）", function () {
      if (stepIdx >= 2) return;
      var ax = seq[stepIdx];
      var yes = Math.random() < Math.pow(Math.cos(st.th - ax), 2);
      st.th = yes ? ax : ax + Math.PI / 2;
      drawArrow();
      stepIdx++;
      VZ.setPanel(info, {
        "第几步": stepIdx + " / 2",
        "刚发生的": (stepIdx === 1 ? "测 A" : "测 B") + " → " + (yes ? "YES：跳到轴上" : "NO：零测量，跳到垂直方向"),
        "当前态": "与轴夹角 " + Math.round(Math.abs(((st.th - (stepIdx === 1 ? A : B)) * 180 / Math.PI + 360) % 360)) + "°"
      });
    });
    VZ.btn(stage, "重置", reset);
    VZ.card(svg, 420, 60, 310, 120, { stroke: "rgba(255,255,255,.13)" });
    VZ.txt(svg, 438, 86, "顺序为什么重要", { size: 13.5, fill: C.gold, weight: 700 });
    VZ.para(svg, 438, 108, "A、B 不对易：测 A 再测 B，与测 B 再测 A 走出的末态不同。而「NO」没有让你看到任何读数，态却一样被投影——R 过程不挑是否有人看。", { size: 12, per: 23, lh: 18 });
    VZ.txt(svg, 438, 202, "多走几轮、多换几次顺序，对比末态。", { size: 11.5, fill: C.dim });
  }
},

/* ------------------------------------------------------------
   f-ch22g · 球谐函数的样子：滑 l、m 看节线
   ------------------------------------------------------------ */
"f-ch22g": {
  title: "",
  hint: "拖动 <b>l</b> 与 <b>m</b>，看球谐函数 Y(l,m) 的截面：极向节线有 l−m 条（虚线纬线），再加上 m 条经向节线。l 就是总角动量，m 是它的一个分量——球谐函数是「转多快、绕哪转」的字母表。",
  draw: function (stage) {
    var W = 760, H = 300, svg = VZ.S(stage, W, H, { grid: true });
    var C = VZ.C;
    var cx = 200, cy = 152, R = 104;
    function legendre(l) { /* P_l(x) 系数数组，低次在前：(n+1)P_{n+1}=(2n+1)xP_n−nP_{n−1} */
      var pm1 = [1];
      if (l === 0) return pm1;
      var pm = [0, 1];
      for (var n = 1; n < l; n++) {
        var pk = new Array(n + 2).fill(0);
        for (var i = 0; i <= n; i++) pk[i + 1] += (2 * n + 1) / (n + 1) * pm[i];
        for (var j = 0; j <= n - 1; j++) pk[j] -= n / (n + 1) * pm1[j];
        pm1 = pm; pm = pk;
      }
      return pm;
    }
    function assoc(l, m, x) { /* P_l^m(x) */
      var c = legendre(l);
      for (var d = 0; d < m; d++) { /* 求导 m 次 */
        var nc = new Array(c.length - 1);
        for (var i = 1; i < c.length; i++) nc[i - 1] = c[i] * i;
        c = nc.length ? nc : [0];
      }
      var v = 0, pow = 1;
      var f = Math.pow(Math.max(1 - x * x, 0), m / 2);
      for (var j = 0; j < c.length; j++) { v += c[j] * pow; pow *= x; }
      return ((m % 2) ? -1 : 1) * f * v;
    }
    function nodes(l, m) { /* 极向节线（纬线）个数 = l - m */
      var out = [];
      for (var i = 0; i < 400; i++) {
        var t = Math.PI * (i + 0.5) / 400;
        var y1 = assoc(l, m, Math.cos(t)), y2 = assoc(l, m, Math.cos(Math.PI * (i + 1.5) / 400));
        if (y1 === 0) out.push(t);
        else if (y1 * y2 < 0) out.push(Math.PI * (i + 1) / 400);
      }
      return out;
    }
    VZ.circ(svg, cx, cy, R, { stroke: C.faint, "stroke-width": 1 });
    VZ.ln(svg, cx - R - 14, cy, cx + R + 14, cy, { stroke: C.faint, "stroke-width": .7 });
    VZ.txt(svg, cx + R + 18, cy + 4, "赤道", { size: 10, fill: C.dim });
    VZ.txt(svg, cx, cy - R - 14, "北极 θ=0", { size: 10.5, fill: C.dim, anchor: "middle" });
    var shape = VZ.path(svg, "", { fill: "rgba(79,227,240,.22)", stroke: C.cyan, "stroke-width": 1.8 });
    var nodal = VZ.g(svg);
    var cur = { l: 1, m: 0 };
    function draw() {
      var l = cur.l, m = Math.min(cur.m, l);
      var maxV = 0, vals = [];
      for (var i = 0; i <= 240; i++) {
        var th = Math.PI * i / 240;
        var v = Math.abs(assoc(l, m, Math.cos(th)));
        vals.push(v); if (v > maxV) maxV = v;
      }
      var d = "";
      for (var i2 = 0; i2 <= 480; i2++) {
        var phi = i2 / 480 * Math.PI * 2;          /* 从北极顺时针绕一圈 */
        var th = phi <= Math.PI ? phi : Math.PI * 2 - phi;
        var u = Math.round(th / Math.PI * 240);
        var rr = R * (0.12 + 0.88 * (maxV ? vals[u] / maxV : 0));
        var X = cx + rr * Math.sin(phi), Y = cy - rr * Math.cos(phi);
        d += (i2 ? "L" : "M") + X.toFixed(1) + " " + Y.toFixed(1);
      }
      shape.setAttribute("d", d + "Z");
      nodal.innerHTML = "";
      nodes(l, m).forEach(function (tn) {
        var ry = R * Math.cos(tn), rx = R * Math.sin(tn);
        VZ.ln(nodal, cx - rx, cy - ry, cx + rx, cy - ry, { stroke: C.mag, "stroke-width": 1.2, "stroke-dasharray": "5 4", opacity: .85 });
      });
      VZ.setPanel(info, {
        "l（总角动量）": String(l),
        "m（分量）": String(m),
        "极向节线": (l - m) + " 条纬线（品红虚线）",
        "经向节线": m + " 条（绕轴才看得到）"
      });
    }
    var info = VZ.panel(stage, { "l（总角动量）": "", "m（分量）": "", "极向节线": "", "经向节线": "" });
    VZ.slider(stage, { label: "l", value: 1, min: 0, max: 4, step: 1, onInput: function (v) { cur.l = v; draw(); } });
    VZ.slider(stage, { label: "m", value: 0, min: 0, max: 4, step: 1, onInput: function (v) { cur.m = v; draw(); } });
    draw();
    VZ.card(svg, 430, 58, 300, 118, { stroke: "rgba(255,255,255,.13)" });
    VZ.txt(svg, 448, 84, "Y(l,m)(θ,φ) ∝ P(l,m)(cosθ)·e^{imφ}", { size: 13, fill: C.cyan, "font-family": "Georgia,serif" });
    VZ.para(svg, 448, 108, "图是含 θ 部分的截面：离圆心的距离 ∝ |Y|。品红虚线 = |Y|=0 的纬线。自旋 l 的粒子要转一整圈族才回到自己——马约拉纳用这些节线编码自旋方向。", { size: 12, per: 23, lh: 18 });
  }
},

/* ------------------------------------------------------------
   f-ch23d · 纠缠态不可写成乘积：怎么调都差一口气
   ------------------------------------------------------------ */
"f-ch23d": {
  title: "",
  hint: "左边是纠缠目标 |Ψ⟩ = (|↑↓⟩+|↓↑⟩)/√2：概率只在对角。右边是你用滑杆调的<b>乘积态</b>（甲的态 × 乙的态）：它的联合概率永远是两边各自概率的乘积，对角一旦有了，反对角就消不掉。<b>差距读数永远压不到 0</b>——这就是「纠缠」的定义。",
  draw: function (stage) {
    var W = 760, H = 280, svg = VZ.S(stage, W, H, {});
    var C = VZ.C;
    function grid(x0, y0, cell, title, color) {
      VZ.txt(svg, x0 + cell, y0 - 12, title, { size: 12.5, fill: color, weight: 700, anchor: "middle" });
      VZ.txt(svg, x0 - 12, y0 + cell * 0.5 + 4, "甲↑", { size: 10.5, fill: C.dim, anchor: "end" });
      VZ.txt(svg, x0 - 12, y0 + cell * 1.5 + 4, "甲↓", { size: 10.5, fill: C.dim, anchor: "end" });
      VZ.txt(svg, x0 + cell * 0.5, y0 - 2, "乙↑", { size: 10.5, fill: C.dim, anchor: "middle" });
      VZ.txt(svg, x0 + cell * 1.5, y0 - 2, "乙↓", { size: 10.5, fill: C.dim, anchor: "middle" });
      var cells = [];
      for (var i = 0; i < 2; i++) for (var j = 0; j < 2; j++) {
        var r = VZ.path(svg, "", {});
        r._x = x0 + j * cell; r._y = y0 + i * cell;
        cells.push(r);
        VZ.ln(svg, x0 + j * cell, y0 + i * cell, x0 + (j + 1) * cell, y0 + i * cell, { stroke: C.faint, "stroke-width": .8 });
        VZ.ln(svg, x0 + j * cell, y0 + i * cell, x0 + j * cell, y0 + (i + 1) * cell, { stroke: C.faint, "stroke-width": .8 });
      }
      VZ.ln(svg, x0 + 2 * cell, y0, x0 + 2 * cell, y0 + 2 * cell, { stroke: C.faint, "stroke-width": .8 });
      VZ.ln(svg, x0, y0 + 2 * cell, x0 + 2 * cell, y0 + 2 * cell, { stroke: C.faint, "stroke-width": .8 });
      return cells;
    }
    var cell = 62;
    var gt = grid(150, 60, cell, "纠缠目标（拆不开）", C.gold);
    var gp = grid(500, 60, cell, "你调的乘积态", C.cyan);
    function setCells(cells, P) {
      cells.forEach(function (r, k) {
        var p = P[k];
        r.setAttribute("d", "M" + r._x + " " + r._y + "h" + cell + "v" + cell + "H" + r._x + "Z");
        r.setAttribute("fill", p > 0.005 ? "rgba(255,207,92," + (0.15 + 0.75 * p * 2).toFixed(2) + ")" : "rgba(255,255,255,.04)");
        if (r._t) r._t.remove();
        var t = VZ.txt(svg, r._x + cell / 2, r._y + cell / 2 + 4, p > 0.005 ? p.toFixed(2) : "0", { size: 11.5, fill: p > 0.005 ? C.ink : C.dim, anchor: "middle" });
        r._t = t;
      });
    }
    var target = [0, 0.5, 0.5, 0];
    setCells(gt, target);
    var info = VZ.panel(stage, { "乘积态参数": "", "差距（总变差）": "" });
    function draw(theta, phi) {
      var pa = [Math.cos(theta) * Math.cos(theta), Math.sin(theta) * Math.sin(theta)];
      var pb = [Math.cos(phi) * Math.cos(phi), Math.sin(phi) * Math.sin(phi)];
      var P = [pa[0] * pb[0], pa[0] * pb[1], pa[1] * pb[0], pa[1] * pb[1]];
      setCells(gp, P);
      var tv = 0;
      for (var k = 0; k < 4; k++) tv += Math.abs(P[k] - target[k]);
      tv /= 2;
      VZ.setPanel(info, {
        "乘积态参数": "甲角 " + (theta * 180 / Math.PI).toFixed(0) + "°，乙角 " + (phi * 180 / Math.PI).toFixed(0) + "°",
        "差距（总变差）": tv.toFixed(3) + (tv < 0.001 ? "（可分解）" : " > 0：拆不开")
      });
    }
    VZ.slider(stage, { label: "甲的极角 θ", value: 45, min: 0, max: 90, step: 1, onInput: function (v) { th = v * Math.PI / 180; draw(th, ph); } });
    VZ.slider(stage, { label: "乙的极角 φ", value: 45, min: 0, max: 90, step: 1, onInput: function (v) { ph = v * Math.PI / 180; draw(th, ph); } });
    var th = Math.PI / 4, ph = Math.PI / 4;
    draw(th, ph);
    VZ.txt(svg, 330, 120, "对比", { size: 13, fill: C.gold, weight: 700, anchor: "middle" });
    VZ.txt(svg, 330, 142, "↓", { size: 13, fill: C.gold, anchor: "middle" });
  }
},

/* ------------------------------------------------------------
   f-ch23e · GHZ：三粒子全有全无，一次判决定生死
   ------------------------------------------------------------ */
"f-ch23e": {
  title: "",
  hint: "GHZ 态 (|000⟩+|111⟩)/√2：选一种测量组合，点<b>测一轮</b>——每个粒子随机给 ±，但<b>三个乘积永远等于固定值</b>（全有全无）。经典定值论在 XYY×YXY×YYX 上要求 +1，量子却给 −1：一轮实验就能判决，不用统计。",
  draw: function (stage) {
    var W = 760, H = 300, svg = VZ.S(stage, W, H, {});
    var C = VZ.C;
    var ps = [[330, 66], [220, 66], [440, 66]];
    var names = ["甲", "乙", "丙"];
    VZ.card(svg, 120, 128, 520, 46, { stroke: C.faint, fill: "rgba(255,255,255,.04)" });
    var stateTxt = VZ.txt(svg, 380, 157, "|GHZ⟩ = (|000⟩ + |111⟩)/√2", { size: 15, fill: C.gold, weight: 700, anchor: "middle", "font-family": "Georgia,serif" });
    var dots = ps.map(function (p, i) {
      var d = VZ.circ(svg, p[0], p[1], 16, { fill: "rgba(12,8,32,.9)", stroke: C.cyan, "stroke-width": 1.6 });
      VZ.txt(svg, p[0], p[1] + 5, names[i], { size: 12, fill: C.cyan, anchor: "middle", weight: 700 });
      VZ.ln(svg, p[0], p[1] + 18, p[0], p[1] + 34, { stroke: C.faint, "stroke-width": .9, "stroke-dasharray": "3 3" });
      return d;
    });
    var res = ps.map(function (p, i) {
      return VZ.txt(svg, p[0], p[1] + 52, "−", { size: 19, fill: C.dim, anchor: "middle", weight: 700 });
    });
    var prodTxt = VZ.txt(svg, 620, 120, "乘积：—", { size: 13.5, fill: C.ink2, weight: 700 });
    var combo = "XYY";
    VZ.chips(stage, ["XXX", "XYY", "YXY", "YYX"], combo, function (m) { combo = m; reset(); });
    var info = VZ.panel(stage, { "本轮组合": "", "量子预言的乘积": "", "经典定值论要求": "", "已测轮数": "0" });
    var nRounds = 0;
    function expect(c) { return c === "XXX" ? "+1" : "−1"; }
    function drawInfo() {
      VZ.setPanel(info, {
        "本轮组合": combo,
        "量子预言的乘积": expect(combo),
        "经典定值论要求": "XXX +1 且 XYY·YXY·YYX = +1（矛盾！）",
        "已测轮数": String(nRounds)
      });
    }
    function reset() {
      nRounds = 0;
      res.forEach(function (r) { r.textContent = "−"; r.setAttribute("fill", C.dim); });
      prodTxt.textContent = "乘积：—";
      drawInfo();
    }
    VZ.btn(stage, "测一轮", function () {
      var o = [];
      for (var i = 0; i < 3; i++) o.push(Math.random() < 0.5 ? 1 : -1);
      if (combo === "XXX") o[2] = o[0] * o[1];        /* 乘积 +1 */
      else o[2] = -o[0] * o[1];                        /* 乘积 −1 */
      var pr = o[0] * o[1] * o[2];
      res.forEach(function (r, i) {
        r.textContent = o[i] > 0 ? "+1" : "−1";
        r.setAttribute("fill", o[i] > 0 ? C.cyan : C.mag);
      });
      prodTxt.textContent = "乘积：" + (pr > 0 ? "+1 ✓" : "−1 ✓");
      prodTxt.setAttribute("fill", C.green);
      nRounds++;
      drawInfo();
    });
    reset();
    VZ.card(svg, 440, 180, 290, 96, { stroke: "rgba(255,255,255,.13)" });
    VZ.para(svg, 458, 204, "若每个粒子出厂就带好 ±x、±y 的答案，四个乘积方程相乘得 x²y²z² = +1；量子力学却让右边是 −1。<b>没有隐变量可藏</b>——这就是全有全无。", { size: 12, per: 22, lh: 18 });
  }
},

/* ------------------------------------------------------------
   f-ch23f · 量子隐形传态：四步流程，点击步进
   ------------------------------------------------------------ */
"f-ch23f": {
  title: "",
  hint: "连按<b>下一步</b>走完四步：①纠缠对分发 → ②Alice 做 Bell 测量（得到 4 选 1 的随机结果）→ ③只发 2 个经典比特 → ④Bob 做对应修正，|ψ⟩ 在他那边复活。注意：<b>|ψ⟩ 从未穿过中间的信道</b>，而原始副本已被测量毁掉。",
  draw: function (stage) {
    var W = 760, H = 300, svg = VZ.S(stage, W, H, {});
    var C = VZ.C;
    var alice = [140, 150], bob = [620, 150];
    var bellRes = ["Φ⁻", "Ψ⁺", "Ψ⁻", "Φ⁺"][Math.floor(Math.random() * 4)];
    var corr = { "Φ⁺": "I", "Φ⁻": "Z", "Ψ⁺": "X", "Ψ⁻": "X·Z" }[bellRes];
    function person(x, name, color) {
      VZ.circ(svg, x, 150, 30, { fill: "rgba(12,8,32,.9)", stroke: color, "stroke-width": 1.8 });
      VZ.txt(svg, x, 146, name, { size: 13.5, fill: color, anchor: "middle", weight: 700 });
      VZ.txt(svg, x, 200, "", { size: 11, fill: C.dim, anchor: "middle" });
    }
    person(alice[0], "Alice", C.cyan);
    person(bob[0], "Bob", C.mag);
    VZ.txt(svg, alice[0], 205, "持有：|ψ⟩（要传的态）", { size: 11, fill: C.dim, anchor: "middle" });
    VZ.txt(svg, bob[0], 205, "持有：纠缠对的另一半", { size: 11, fill: C.dim, anchor: "middle" });
    /* 量子通道（纠缠对）与经典通道 */
    var ent = "M" + (alice[0] + 34) + " 132C280 92 480 92 " + (bob[0] - 34) + " 132";
    VZ.path(svg, ent, VZ.stroke({ stroke: C.violet, "stroke-width": 1.6, "stroke-dasharray": "7 5" }));
    VZ.txt(svg, 380, 88, "量子通道（纠缠对）", { size: 11, fill: C.violet, anchor: "middle" });
    var cls = "M" + (alice[0] + 34) + " 178H" + (bob[0] - 34);
    VZ.path(svg, cls, VZ.stroke({ stroke: C.gold, "stroke-width": 1.4, "stroke-dasharray": "4 4", opacity: .55 }));
    VZ.txt(svg, 380, 196, "经典信道（≤2 比特）", { size: 11, fill: C.gold, anchor: "middle" });
    /* 四个阶段标签 */
    var stages = ["① 纠缠分发", "② Bell 测量", "③ 发 2 bit", "④ Bob 修正"];
    var sTxt = stages.map(function (s, i) {
      return VZ.txt(svg, 110 + i * 150, 252, s, { size: 12.5, fill: C.dim, anchor: "middle", weight: 700 });
    });
    var msg = VZ.txt(svg, 380, 286, "按「下一步」开始", { size: 13, fill: C.ink2, anchor: "middle" });
    var psi = VZ.circ(svg, alice[0], 118, 9, { fill: C.gold });
    var psiLbl = VZ.txt(svg, alice[0] + 14, 116, "|ψ⟩", { size: 11.5, fill: C.gold, weight: 700 });
    var stopT = null;
    function setStage(n) {
      sTxt.forEach(function (t, i) { t.setAttribute("fill", i < n ? C.green : (i === n ? C.gold : C.dim)); });
    }
    var step = 0;
    VZ.btn(stage, "下一步", function () {
      if (stopT) { stopT(); stopT = null; }
      if (step === 0) {
        stopT = VZ.travel(svg, ent, { color: C.violet, dur: 1.6, count: 2, r: 4 });
        msg.textContent = "纠缠对被分成两半，Alice、Bob 各拿一个";
        setStage(0);
      } else if (step === 1) {
        msg.textContent = "Alice 对 |ψ⟩ 和自己那半做 Bell 测量 → 结果：" + bellRes + "（随机 4 选 1），|ψ⟩ 在她这里消失";
        psi.setAttribute("fill", "none"); psi.setAttribute("stroke", C.dim); psiLbl.setAttribute("fill", C.dim);
        setStage(1);
      } else if (step === 2) {
        stopT = VZ.travel(svg, cls, { color: C.gold, dur: 1.4, count: 2, r: 4 });
        msg.textContent = "Alice 把「" + bellRes + "」用 2 个经典比特发给 Bob——不含任何量子信息";
        setStage(2);
      } else if (step === 3) {
        msg.textContent = "Bob 做 " + corr + " 修正 → 他的粒子成为 |ψ⟩。传的是态，不是物质；量子部分零传输。";
        var bd = VZ.circ(svg, bob[0], 118, 9, { fill: C.gold });
        VZ.txt(svg, bob[0] + 14, 116, "|ψ⟩ ✓", { size: 11.5, fill: C.gold, weight: 700 });
        setStage(3);
      }
      step = Math.min(step + 1, 4);
    });
    VZ.btn(stage, "重开一轮", function () {
      if (stopT) { stopT(); stopT = null; }
      step = 0; bellRes = ["Φ⁻", "Ψ⁺", "Ψ⁻", "Φ⁺"][Math.floor(Math.random() * 4)];
      corr = { "Φ⁺": "I", "Φ⁻": "Z", "Ψ⁺": "X", "Ψ⁻": "X·Z" }[bellRes];
      psi.setAttribute("fill", C.gold); psi.setAttribute("stroke", "none"); psiLbl.setAttribute("fill", C.gold);
      stage.querySelectorAll("circle").forEach(function (c) { if (c.getAttribute("cx") == bob[0] && c.getAttribute("cy") == 118 && c.getAttribute("r") == 9) c.remove(); });
      setStage(-1);
      msg.textContent = "按「下一步」开始（Bell 结果每轮重新随机）";
    });
  }
},

/* ------------------------------------------------------------
   f-ch23g · 交换对称性：两个全同粒子互换，波函数变不变号
   ------------------------------------------------------------ */
"f-ch23g": {
  title: "",
  hint: "在方块里<b>拖动金点</b>（x₁ 在横轴、x₂ 在纵轴）：右边同时显示交换前后两个位置的取值。对称组合 ψ_S 交换后<b>完全不变</b>（玻色子），反对称组合 ψ_A 恰好<b>变号</b>（费米子）——把点拖到对角线上，ψ_A 恒为零：这就是泡利不相容。",
  draw: function (stage) {
    var W = 760, H = 280, svg = VZ.S(stage, W, H, { grid: true });
    var C = VZ.C;
    var sq = { x: 60, y: 46, s: 190 };
    var x1c = 60, x2c = 200, wA = 34;   /* 两个单粒子波包中心（方框坐标） */
    function phi(x, c) { var d = (x - c) / wA; return Math.exp(-d * d / 2); }
    VZ.card(svg, sq.x, sq.y, sq.s, sq.s, { stroke: C.faint, fill: "rgba(255,255,255,.03)" });
    VZ.ln(svg, sq.x, sq.y + sq.s, sq.x + sq.s, sq.y, { stroke: C.mag, "stroke-width": 1.2, "stroke-dasharray": "6 4" });
    VZ.txt(svg, sq.x + sq.s - 6, sq.y + 18, "x₁ = x₂（对角）", { size: 10.5, fill: C.mag, anchor: "end" });
    VZ.txt(svg, sq.x + sq.s / 2, sq.y + sq.s + 18, "x₁（第一个粒子）", { size: 11, fill: C.dim, anchor: "middle" });
    VZ.txt(svg, sq.x - 10, sq.y - 8, "x₂↑", { size: 11, fill: C.dim });
    var dot = VZ.circ(svg, 0, 0, 7, { fill: C.gold, stroke: C.ink, "stroke-width": 1 });
    var ghost = VZ.circ(svg, 0, 0, 7, { fill: "none", stroke: C.gold, "stroke-width": 1.2, "stroke-dasharray": "3 3", opacity: .7 });
    VZ.txt(svg, 0, 0, "", { size: 0 });
    var info = VZ.panel(stage, { "点 (x₁,x₂)": "", "ψ_S 交换前 → 后": "", "ψ_A 交换前 → 后": "", "结论": "" });
    function P(x1, x2) { return [sq.x + x1 / 100 * sq.s, sq.y + sq.s - x2 / 100 * sq.s]; }
    function draw(x1, x2) {
      var a = phi(x1, x1c), b = phi(x1, x2c);
      var c = phi(x2, x1c), d = phi(x2, x2c);
      var S12 = a * d + c * b, S21 = c * b + a * d;
      var A12 = a * d - c * b, A21 = c * b - a * d;
      var p = P(x1, x2), q = P(x2, x1);
      dot.setAttribute("cx", p[0]); dot.setAttribute("cy", p[1]);
      ghost.setAttribute("cx", q[0]); ghost.setAttribute("cy", q[1]);
      function fmt(v) { return (v >= 0 ? " +" : " −") + Math.abs(v).toFixed(3); }
      VZ.setPanel(info, {
        "点 (x₁,x₂)": x1.toFixed(0) + " , " + x2.toFixed(0),
        "ψ_S 交换前 → 后": fmt(S12) + " → " + fmt(S21) + "（不变 ✓）",
        "ψ_A 交换前 → 后": fmt(A12) + " → " + fmt(A21) + "（变号 ✓）",
        "结论": Math.abs(x1 - x2) < 4 ? "对角线上 ψ_A = 0：两个费米子不能同状态" : (S12 >= 0 ? "玻色子爱扎堆（对角增强）" : "")
      });
    }
    VZ.drag(svg, svg, W, H, function (x, y) {
      var x1 = VZ.clamp((x - sq.x) / sq.s * 100, 0, 100);
      var x2 = VZ.clamp((sq.y + sq.s - y) / sq.s * 100, 0, 100);
      draw(x1, x2);
    });
    draw(28, 72);
    VZ.card(svg, 470, 40, 270, 96, { stroke: "rgba(94,224,138,.35)", fill: "rgba(94,224,138,.05)" });
    VZ.txt(svg, 488, 64, "玻色子：ψ(1,2) = +ψ(2,1)", { size: 12.5, fill: C.green, weight: 700 });
    VZ.para(svg, 488, 86, "可以挤同一个态 → 激光、玻色–爱因斯坦凝聚都靠它。", { size: 11.5, per: 19, lh: 17 });
    VZ.card(svg, 470, 152, 270, 96, { stroke: "rgba(255,122,122,.35)", fill: "rgba(255,122,122,.05)" });
    VZ.txt(svg, 488, 176, "费米子：ψ(1,2) = −ψ(2,1)", { size: 12.5, fill: C.red, weight: 700 });
    VZ.para(svg, 488, 198, "同态必为零 → 泡利不相容，元素周期表由此而来。", { size: 11.5, per: 19, lh: 17 });
  }
},

/* ------------------------------------------------------------
   f-ch24d · 负能海与空穴：挖一个洞，就是正电子
   ------------------------------------------------------------ */
"f-ch24d": {
  title: "",
  hint: "狄拉克的图景：负能级被电子<b>填满</b>成海，平时什么也看不见。按<b>激发一个电子</b>：一个电子跳过 2mc² 的禁带升入正能级，海里留下的<b>空穴</b>行为像一个带正电的新粒子——正电子。按重置放回。",
  draw: function (stage) {
    var W = 760, H = 300, svg = VZ.S(stage, W, H, {});
    var C = VZ.C;
    var yPos = 74, yNeg = 196, seaBot = 262, ex = 120;
    VZ.ln(svg, 60, yPos, 560, yPos, { stroke: C.cyan, "stroke-width": 1.4, "stroke-dasharray": "6 4" });
    VZ.txt(svg, 566, yPos + 4, "E = +mc²（空着）", { size: 11.5, fill: C.cyan });
    VZ.ln(svg, 60, yNeg, 560, yNeg, { stroke: C.violet, "stroke-width": 1.4, "stroke-dasharray": "6 4" });
    VZ.txt(svg, 566, yNeg + 4, "E = −mc²", { size: 11.5, fill: C.violet });
    VZ.card(svg, 60, yNeg + 6, 500, seaBot - yNeg - 6, { stroke: "none", fill: "rgba(155,140,255,.14)" });
    VZ.txt(svg, 310, yNeg + (seaBot - yNeg) / 2 + 44, "负能海：全部填满 → 观察不到", { size: 11.5, fill: C.ink2, anchor: "middle" });
    /* 禁带标注 */
    VZ.ln(svg, 620, yPos, 620, yNeg, { stroke: C.gold, "stroke-width": 1.2 });
    VZ.ln(svg, 614, yPos, 626, yPos, { stroke: C.gold, "stroke-width": 1.2 });
    VZ.ln(svg, 614, yNeg, 626, yNeg, { stroke: C.gold, "stroke-width": 1.2 });
    VZ.txt(svg, 630, (yPos + yNeg) / 2 + 4, "禁带 2mc²", { size: 11.5, fill: C.gold });
    /* 海里的电子（小点阵） */
    var sea = VZ.g(svg);
    var exPts = [];
    for (var r = 0; r < 3; r++) for (var c = 0; c < 12; c++) {
      var px = 84 + c * 42 + (r % 2) * 12, py = yNeg + 22 + r * 15;
      exPts.push(VZ.circ(sea, px, py, 3.4, { fill: C.violet, opacity: .85 }));
    }
    /* 跳上去的电子与空穴 */
    var jumper = VZ.circ(svg, 0, 0, 5, { fill: C.cyan, opacity: 0 });
    var hole = VZ.circ(svg, 0, 0, 6.5, { fill: C.deep, stroke: C.gold, "stroke-width": 2, opacity: 0 });
    var holeLbl = VZ.txt(svg, 0, 0, "空穴 = 正电子", { size: 11, fill: C.gold, weight: 700, opacity: 0 });
    var jumpLbl = VZ.txt(svg, 0, 0, "E > 0 的电子", { size: 11, fill: C.cyan, opacity: 0 });
    function tween(setP, dur, done) {
      var t0 = null;
      return VZ.raf(svg, function (t) {
        if (t0 === null) t0 = t;
        var u = Math.min((t - t0) / dur, 1);
        setP(VZ.ease(u));
        if (u >= 1 && done) { done(); }
      });
    }
    var idx = 5;
    VZ.btn(stage, "激发一个电子", function () {
      var src = exPts[idx % exPts.length]; idx++;
      var sx = +src.getAttribute("cx"), sy = +src.getAttribute("cy");
      var tx = 300 + (idx % 5) * 60, ty = yPos - 26;
      src.setAttribute("opacity", 0);
      hole.setAttribute("cx", sx); hole.setAttribute("cy", sy); hole.setAttribute("opacity", 1);
      holeLbl.setAttribute("x", sx - 60); holeLbl.setAttribute("y", sy + 4); holeLbl.setAttribute("opacity", 1);
      jumper.setAttribute("opacity", 1);
      var h0 = sx, done1 = false;
      tween(function (u) {
        jumper.setAttribute("cx", h0 + (tx - h0) * u);
        jumper.setAttribute("cy", sy + (ty - sy) * u - Math.sin(u * Math.PI) * 26);
        jumpLbl.setAttribute("x", jumper.getAttribute("cx") - 46);
        jumpLbl.setAttribute("y", ty - 14);
        jumpLbl.setAttribute("opacity", 1);
      }, 1.1, function () {
        /* 空穴随后向右漂移 */
        var hx0 = sx;
        tween(function (u) {
          hole.setAttribute("cx", hx0 + 120 * u);
          holeLbl.setAttribute("x", hx0 + 120 * u - 60);
        }, 1.6);
      });
    });
    VZ.btn(stage, "重置（填回海里）", function () {
      exPts.forEach(function (p) { p.setAttribute("opacity", .85); });
      jumper.setAttribute("opacity", 0); hole.setAttribute("opacity", 0);
      holeLbl.setAttribute("opacity", 0); jumpLbl.setAttribute("opacity", 0);
    });
    VZ.card(svg, 60, 22, 500, 30, { stroke: "none", fill: "rgba(255,255,255,.04)" });
    VZ.txt(svg, 74, 42, "1931 年狄拉克从这里预言正电子；1932 年安德森在云室里找到它。", { size: 11.5, fill: C.dim });
  }
},

/* ------------------------------------------------------------
   f-ch24e · 非相对论极限：c 拉大，修正项消失
   ------------------------------------------------------------ */
"f-ch24e": {
  title: "",
  hint: "把 E = √(p²c²+m²c⁴) − mc² 展开：E ≈ p²/2m <b>−</b> p⁴/8m³c² + …。拖大 <b>c</b>：红线（精确）贴向金线（薛定谔），偏差读数一路缩到 0——低速世界里，狄拉克方程就「变成」了薛定谔方程。",
  draw: function (stage) {
    var W = 760, H = 280, svg = VZ.S(stage, W, H, { grid: true });
    var C = VZ.C;
    var ox = 90, oy = 210, pw = 560, ph = 150, pMax = 2.4, yMax = 2.0;
    VZ.ln(svg, ox, oy, ox + pw, oy, { stroke: C.faint, "stroke-width": .9 });
    VZ.ln(svg, ox, oy - ph, ox, oy, { stroke: C.faint, "stroke-width": .9 });
    VZ.txt(svg, ox + pw - 4, oy + 18, "动量 p", { size: 11, fill: C.dim, anchor: "end" });
    VZ.txt(svg, ox - 8, oy - ph - 6, "E − mc²", { size: 11, fill: C.dim, anchor: "end" });
    var exact = VZ.path(svg, "", VZ.stroke({ stroke: C.red, "stroke-width": 2 }));
    var nr = VZ.path(svg, "", VZ.stroke({ stroke: C.gold, "stroke-width": 1.6, "stroke-dasharray": "7 5" }));
    var vline = VZ.ln(svg, 0, oy - ph, 0, oy, { stroke: C.faint, "stroke-width": .8, "stroke-dasharray": "3 4" });
    var dEx = VZ.circ(svg, 0, 0, 4.5, { fill: C.red });
    var dNr = VZ.circ(svg, 0, 0, 4.5, { fill: C.gold });
    function X(p) { return ox + p / pMax * pw; }
    function Y(e) { return oy - VZ.clamp(e / yMax, 0, 1.02) * ph; }
    var cc = 6, pm = 1.0;
    function drawAll() {
      var de = "", dn = "";
      for (var i = 0; i <= 100; i++) {
        var p = pMax * i / 100;
        var e = Math.sqrt(p * p * cc * cc + Math.pow(cc * cc, 2)) - cc * cc;
        de += (i ? "L" : "M") + X(p).toFixed(1) + " " + Y(e).toFixed(1);
        dn += (i ? "L" : "M") + X(p).toFixed(1) + " " + Y(p * p / 2).toFixed(1);
      }
      exact.setAttribute("d", de);
      nr.setAttribute("d", dn);
      drawMark();
    }
    function drawMark() {
      var p = pm;
      var e = Math.sqrt(p * p * cc * cc + Math.pow(cc * cc, 2)) - cc * cc;
      var eNR = p * p / 2;
      vline.setAttribute("x1", X(p)); vline.setAttribute("x2", X(p));
      dEx.setAttribute("cx", X(p)); dEx.setAttribute("cy", Y(e));
      dNr.setAttribute("cx", X(p)); dNr.setAttribute("cy", Y(eNR));
      var rel = eNR > 1e-9 ? Math.abs(e - eNR) / eNR * 100 : 0;
      VZ.setPanel(info, {
        "c（光速，单位任意）": cc.toFixed(1),
        "p = 1.0 处 E − mc²": e.toFixed(3),
        "薛定谔给 p²/2m": eNR.toFixed(3),
        "相对偏差": rel < 0.05 ? rel.toFixed(3) + "% ≈ 0 ✓" : rel.toFixed(1) + "%"
      });
    }
    var info = VZ.panel(stage, { "c（光速，单位任意）": "", "p = 1.0 处 E − mc²": "", "薛定谔给 p²/2m": "", "相对偏差": "" });
    VZ.slider(stage, { label: "光速 c（拉大 = 低能极限）", value: 6, min: 0.8, max: 12, step: 0.1, onInput: function (v) { cc = v; drawAll(); } });
    VZ.slider(stage, { label: "考察点 p", value: 1, min: 0.2, max: 2.4, step: 0.05, onInput: function (v) { pm = v; drawMark(); } });
    drawAll();
    VZ.txt(svg, ox + 8, oy - ph - 6, "红线：精确 E(p)；金虚线：薛定谔 p²/2m", { size: 11, fill: C.ink2 });
  }
},

/* ------------------------------------------------------------
   f-ch24f · 自旋是白送的：2 分量不够，4 分量刚好
   ------------------------------------------------------------ */
"f-ch24f": {
  title: "",
  hint: "切换两种尝试：狄拉克要的是「一次微分的一次方程」，于是需要 β 与三个 α 两两反对易。<b>2 分量</b>：σx、σy、σz 已经占满 2×2 矩阵的空间，β 挤不进去（红叉）；<b>4 分量</b>：刚好够，而且哈密顿量里自动长出 σ·B 项——自旋没要求，方程白送。",
  draw: function (stage) {
    var W = 760, H = 300, svg = VZ.S(stage, W, H, {});
    var C = VZ.C;
    var mode = "4 分量（狄拉克）";
    var spinor = VZ.g(svg);
    var comps = [];
    for (var i = 0; i < 4; i++) {
      comps.push({ box: VZ.el("rect", { x: 120, y: 60 + i * 50, width: 150, height: 40, rx: 10, fill: "rgba(255,255,255,.035)", stroke: C.faint, "stroke-width": 1 }, spinor), lab: VZ.txt(spinor, 132, 84 + i * 50, "", { size: 12.5, fill: C.ink }), ph: VZ.path(spinor, "", VZ.stroke({ stroke: i < 2 ? C.cyan : C.mag, "stroke-width": 1.8 })) });
    }
    var title = VZ.txt(svg, 120, 44, "", { size: 14, fill: C.gold, weight: 700 });
    var verdict = VZ.txt(svg, 120, 286, "", { size: 13, fill: C.red, weight: 700 });
    function layComps(n) {
      for (var i = 0; i < 4; i++) {
        var on = i < n;
        comps[i].box.setAttribute("opacity", on ? 1 : 0.15);
        comps[i].lab.setAttribute("opacity", on ? 1 : 0.15);
        comps[i].lab.textContent = on ? "ψ" + ["₁", "₂", "₃", "₄"][i] : "";
        comps[i].ph.setAttribute("opacity", on ? 1 : 0);
      }
    }
    function chips3(x, y, labels, oks, color) {
      labels.forEach(function (s, i) {
        VZ.card(svg, x + i * 92, y, 80, 40, { stroke: oks[i] ? "rgba(94,224,138,.5)" : "rgba(255,122,122,.6)", fill: oks[i] ? "rgba(94,224,138,.07)" : "rgba(255,122,122,.07)" });
        VZ.txt(svg, x + i * 92 + 40, y + 18, s, { size: 12.5, fill: color, anchor: "middle", weight: 700 });
        VZ.txt(svg, x + i * 92 + 40, y + 34, oks[i] ? "✓ 反对易" : "✗ 放不下", { size: 10, fill: oks[i] ? C.green : C.red, anchor: "middle" });
      });
    }
    function draw() {
      if (mode.indexOf("2") === 0) {
        title.textContent = "尝试：2 分量旋量 ψ = (ψ₁, ψ₂)ᵀ";
        layComps(2);
        chips3(330, 60, ["α₁=σx", "α₂=σy", "α₃=σz"], [true, true, true], C.cyan);
        chips3(330, 130, ["β = ?", "σx·σy·σz", "再无第四个"], [false, false, false], C.red);
        verdict.setAttribute("fill", C.red);
        verdict.textContent = "✗ 2×2 矩阵最多 3 个两两反对易，β 无处安放——2 分量方案失败";
      } else {
        title.textContent = "狄拉克：4 分量 ψ = (ψ₁,ψ₂,ψ₃,ψ₄)ᵀ";
        layComps(4);
        chips3(330, 60, ["α₁", "α₂", "α₃"], [true, true, true], C.cyan);
        chips3(330, 130, ["β", "全对易关系 ✓", "方程自洽"], [true, true, true], C.green);
        verdict.setAttribute("fill", C.green);
        verdict.textContent = "✓ 4×4 刚好容下 α₁α₂α₃β；哈密顿量自动出现 σ·B 项 → 自旋是白送的";
      }
    }
    VZ.chips(stage, ["2 分量（不够）", "4 分量（狄拉克）"], mode, function (m) { mode = m; draw(); });
    VZ.raf(svg, function (t) {
      for (var i = 0; i < 4; i++) {
        var on = i < (mode.indexOf("2") === 0 ? 2 : 4);
        if (!on) continue;
        var cx0 = 262, cy0 = 80 + i * 50;
        var ang = t * (i < 2 ? 2.2 : -2.2) + i;
        comps[i].ph.setAttribute("d", "M" + cx0 + " " + cy0 + "L" + (cx0 + 16 * Math.cos(ang)).toFixed(1) + " " + (cy0 - 16 * Math.sin(ang)).toFixed(1));
      }
    });
    draw();
    VZ.card(svg, 330, 200, 400, 56, { stroke: "rgba(255,255,255,.13)" });
    VZ.para(svg, 348, 222, "上半两个分量转一个方向（粒子），下半两个转另一个方向（反粒子）——4 分量结构同时装下了自旋和反粒子两份礼物。", { size: 11.5, per: 31, lh: 17 });
  }
},

/* ------------------------------------------------------------
   f-ch24g · 反粒子时间线：从平方根到云室
   ------------------------------------------------------------ */
"f-ch24g": {
  title: "",
  hint: "点击时间轴上的节点：1928 年方程先写出，1931 年正电子被<b>预言</b>，1932 年才在云室里被<b>看见</b>——数学跑在了实验前面整整四年。之后反质子、反氢原子逐一到位。",
  draw: function (stage) {
    var W = 760, H = 260, svg = VZ.S(stage, W, H, {});
    var C = VZ.C;
    var y = 118, x0 = 70, x1 = 700;
    VZ.ln(svg, x0, y, x1, y, { stroke: C.ink2, "stroke-width": 2 });
    var ar = VZ.arrowDef(svg, VZ.uid("ar"), C.ink2);
    VZ.path(svg, "M" + x1 + " " + y + "h-1", { stroke: C.ink2, "stroke-width": 2, "marker-end": ar });
    var events = [
      { yr: "1928", x: 120, c: C.cyan, t: "狄拉克写下方程", d: "为了给 E²=p²c²+m²c⁴ 开平方，方程被迫多出一组负能解——作者后来说，这是「物理学家做过的最可怕的赌注」之一。" },
      { yr: "1931", x: 265, c: C.violet, t: "预言正电子", d: "负能海挖掉一个空穴，行为就像一个带正电的粒子。狄拉克正式预言：存在一种质量与电子相同、电荷相反的粒子。" },
      { yr: "1932.8", x: 420, c: C.gold, t: "安德森的云室", d: "宇宙线在云室里留下一条被磁场弯向「错」方向的径迹——正电子。预言到发现只隔了 14 个月，诺贝尔奖 1936 年到手。" },
      { yr: "1955", x: 545, c: C.mag, t: "反质子", d: "伯克利 Bevatron 加速器按同样的配方找到反质子。每一种费米子都有反粒子，成了标准模型的铁律。" },
      { yr: "1995", x: 665, c: C.green, t: "反氢原子", d: "CERN 把反质子和正电子凑成反氢原子。反物质从纸上走到了实验室，尽管只有几个原子、纳秒级的寿命。" }
    ];
    var cur = events[2];
    var glow = VZ.circ(svg, 0, 0, 22, { fill: "none", stroke: C.gold, "stroke-width": 1.6, opacity: .9 });
    var nodes = events.map(function (ev) {
      var g = VZ.g(svg, { style: "cursor:pointer" });
      VZ.circ(g, ev.x, y, 11, { fill: "rgba(12,8,32,.95)", stroke: ev.c, "stroke-width": 2 });
      VZ.txt(g, ev.x, y + 4.5, "●", { size: 8, fill: ev.c, anchor: "middle" });
      var above = ev.yr !== "1932.8";
      VZ.ln(g, ev.x, y + (above ? -11 : 11), ev.x, y + (above ? -30 : 30), { stroke: ev.c, "stroke-width": 1, opacity: .6 });
      VZ.txt(g, ev.x, y + (above ? -38 : 44), ev.yr, { size: 12, fill: ev.c, anchor: "middle", weight: 700 });
      VZ.txt(g, ev.x, y + (above ? -52 : 58), ev.t, { size: 10.5, fill: C.dim, anchor: "middle" });
      g.addEventListener("click", function () { show(ev); });
      return g;
    });
    VZ.txt(svg, 380, 36, "反物质：先被算出来，再被看见", { size: 14, fill: C.ink, anchor: "middle", weight: 700 });
    VZ.card(svg, 60, 176, 640, 66, { stroke: "rgba(255,255,255,.13)", fill: "rgba(255,207,92,.05)" });
    var dT = VZ.txt(svg, 78, 198, "", { size: 13, fill: C.gold, weight: 700 });
    var dP = VZ.g(svg);
    function show(ev) {
      cur = ev;
      dT.textContent = ev.yr + " · " + ev.t;
      dP.innerHTML = "";
      VZ.para(dP, 78, 220, ev.d, { size: 12, per: 52, lh: 17 });
      glow.setAttribute("cx", ev.x); glow.setAttribute("cy", y);
      glow.setAttribute("stroke", ev.c);
    }
    show(cur);
    VZ.raf(svg, function (t) {
      glow.setAttribute("r", 18 + 4 * Math.sin(t * 2.4));
      glow.setAttribute("opacity", 0.55 + 0.3 * Math.sin(t * 2.4));
    });
  }
}

});
