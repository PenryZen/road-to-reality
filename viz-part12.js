/* ============================================================
   viz-part12.js — 第三批挂载式小图（ch17–ch20）
   规格见 FIG-SPEC3.md：title 为空、H∈[220,320]、每张有交互
   ============================================================ */
VZ.define({

/* ==========================================================
   ch17 · 亚里士多德时空 vs 伽利略时空
   ========================================================== */
"f-ch17d": {
  title: "",
  hint: "切换两种宇宙观。<b>亚里士多德</b>：上下是宇宙给的绝对方向，重物天生落得快。<b>伽利略</b>：船舱里没有绝对的静止——从桅杆落下的球对船上人仍是直线下落，岸上人却看见抛物线。同一颗球，两套时空。",
  draw: function (stage) {
    var C = VZ.C;
    var ctl = VZ.box(stage, "viz-chips");
    var host = document.createElement("div");
    stage.appendChild(host);
    VZ.chips(ctl, ["亚里士多德：绝对上下", "伽利略：没有上下"], "亚里士多德：绝对上下", function (m) {
      host.innerHTML = "";
      if (m.indexOf("亚里") === 0) drawAri(host); else drawGal(host);
    });
    drawAri(host);

    function drawAri(host) {
      var svg = VZ.S(host, 760, 250, {});
      VZ.ln(svg, 70, 36, 70, 212, VZ.stroke({ stroke: C.ink2, "stroke-width": 1.2 }));
      VZ.path(svg, "M70 32l-5 9h10z", { fill: C.ink2 });
      VZ.txt(svg, 60, 46, "上", { size: 12, fill: C.dim, anchor: "end" });
      VZ.txt(svg, 60, 208, "下", { size: 12, fill: C.dim, anchor: "end" });
      VZ.ln(svg, 100, 212, 430, 212, VZ.stroke({ stroke: C.ink, "stroke-width": 2 }));
      VZ.txt(svg, 265, 236, "地面（宇宙的绝对下方）", { size: 11.5, fill: C.dim, anchor: "middle" });
      var heavy = VZ.circ(svg, 170, 60, 9, { fill: C.gold });
      var heavyT = VZ.txt(svg, 188, 66, "重石：天生快", { size: 12, fill: C.gold });
      var light = VZ.circ(svg, 320, 60, 5, { fill: C.ink2 });
      var lightT = VZ.txt(svg, 334, 64, "羽毛：天生慢", { size: 12, fill: C.ink2 });
      var card = VZ.card(svg, 470, 46, 264, 150, { stroke: "rgba(255,255,255,.12)" });
      VZ.txt(svg, 488, 72, "亚里士多德时空", { size: 14.5, fill: C.gold, weight: 700 });
      VZ.para(svg, 488, 96, "上下由宇宙指定；静止是一种绝对状态；物体各有『天然位置』，重的奔向下方更急。", { size: 12, per: 21, lh: 19 });
      VZ.txt(svg, 488, 182, "→ 下一级台阶：这套上下要被拆掉", { size: 11.5, fill: C.dim });
      VZ.raf(svg, function (t) {
        var fh = (t % 2.2) / 2.2, fl = (t % 5) / 5;
        var yh = 60 + 142 * VZ.ease(fh), yl = 60 + 142 * VZ.ease(fl);
        heavy.setAttribute("cy", yh); heavyT.setAttribute("y", yh - 4);
        light.setAttribute("cy", yl); lightT.setAttribute("y", yl + 4);
      });
    }

    function drawGal(host) {
      var svg = VZ.S(host, 760, 250, {});
      VZ.ln(svg, 30, 218, 730, 218, VZ.stroke({ stroke: C.ink, "stroke-width": 1.6 }));
      VZ.txt(svg, 40, 238, "岸上（『静止』只是说说而已）", { size: 11, fill: C.dim });
      var trail = VZ.path(svg, "", VZ.stroke({ stroke: C.mag, "stroke-width": 1.6, "stroke-dasharray": "2 3", opacity: .8 }));
      var ship = VZ.g(svg);
      VZ.ln(ship, -55, 0, 55, 0, VZ.stroke({ stroke: C.ink, "stroke-width": 2 }));
      VZ.ln(ship, 0, 0, 0, -150, VZ.stroke({ stroke: C.ink, "stroke-width": 2 }));
      VZ.txt(ship, 12, -140, "桅杆", { size: 11, fill: C.ink2 });
      var mastBase = VZ.circ(svg, 0, 0, 2, { fill: C.faint });
      var ball = VZ.circ(svg, 0, 0, 6, { fill: C.cyan });
      var shipG = VZ.g(svg);
      shipG.appendChild(ship);
      VZ.txt(svg, 30, 120, "船上人看：球沿桅杆笔直下落（虚线）", { size: 12, fill: C.cyan });
      VZ.txt(svg, 30, 140, "岸上人看：球走抛物线（红虚线）", { size: 12, fill: C.mag });
      VZ.txt(svg, 30, 164, "两人都对——没有谁『真的静止』", { size: 12.5, fill: C.gold, weight: 700 });
      var hist = [];
      VZ.raf(svg, function (t) {
        var T = 5.2, ph = t % T;
        var sx = 90 + ph * 100;
        var fall = VZ.clamp((ph - 0.6) / 1.7, 0, 1);
        var by = 62 + 140 * fall * fall;
        shipG.setAttribute("transform", "translate(" + sx + " 206)");
        if (ph < 0.6 || fall >= 1) { hist = []; }
        else { hist.push([sx, by]); if (hist.length > 90) hist.shift(); }
        ball.setAttribute("cx", sx); ball.setAttribute("cy", by);
        trail.setAttribute("d", hist.map(function (p, i) { return (i ? "L" : "M") + p[0].toFixed(1) + " " + p[1].toFixed(1); }).join(""));
      });
      VZ.path(svg, "M560 50H730", { stroke: C.faint, "stroke-width": .8, "stroke-dasharray": "3 6" });
      VZ.txt(svg, 560, 40, "伽利略：匀速运动无法被舱内实验察觉", { size: 11.5, fill: C.ink2 });
    }
  }
},

/* ==========================================================
   ch17 · 同时性的相对性（火车两端闪光）
   ========================================================== */
"f-ch17e": {
  title: "",
  hint: "两道闪电同时击中车头车尾——这是<b>站台</b>视角的事实。拖滑块给列车速度：光以同样速度奔向站台中点 M（同时到达），但车厢中点 M′ 在朝车头闪光迎上去——<b>它先遇到车头那道</b>。于是车上人下结论：车头先被击中。同时性，因人而异。",
  draw: function (stage) {
    var svg = VZ.S(stage, 760, 260, {});
    var C = VZ.C;
    var ox = 380, oy = 130, X1 = 250, X2 = 510, cspd = 120, L = X2 - ox;
    var slider = VZ.slider(stage, { label: "列车速度 v", value: 30, min: 0, max: 60, step: 1, format: function (v) { return (v / cspd).toFixed(2) + " c"; }, onInput: function () {} });
    var out = VZ.panel(stage, { "站台中点 M": "", "车厢中点 M′": "", "M′ 收到车头闪": "", "M′ 收到车尾闪": "" });

    VZ.ln(svg, 40, 236, 720, 236, VZ.stroke({ stroke: C.ink2, "stroke-width": 1.6 }));
    VZ.txt(svg, 716, 226, "x", { size: 11, fill: C.dim, anchor: "end" });
    var flash1 = VZ.txt(svg, X2, 96, "⚡ 车头闪光", { size: 12, fill: C.cyan, anchor: "middle" });
    var flash2 = VZ.txt(svg, X1, 96, "⚡ 车尾闪光", { size: 12, fill: C.mag, anchor: "middle" });
    var wave1 = VZ.circ(svg, X2, oy, 0, { stroke: C.cyan, "stroke-width": 1.6, fill: "none", "stroke-dasharray": "5 4" });
    var wave2 = VZ.circ(svg, X1, oy, 0, { stroke: C.mag, "stroke-width": 1.6, fill: "none", "stroke-dasharray": "5 4" });
    var train = VZ.g(svg);
    var mDot = VZ.circ(svg, ox, oy, 6, { fill: C.gold });
    var mT = VZ.txt(svg, ox, 170, "M 站台中点", { size: 11.5, fill: C.gold, anchor: "middle" });
    var mpDot = VZ.circ(svg, ox, 158, 6, { fill: C.green });
    var mpT = VZ.txt(svg, ox, 184, "M′ 车厢中点", { size: 11.5, fill: C.green, anchor: "middle" });

    VZ.raf(svg, function (t) {
      var v = parseFloat(slider.input.value);
      var T = (L + 60) / cspd + 0.35;
      var tc = (t % (T + 0.7));
      var r = cspd * tc;
      if (r > L + 55) { wave1.setAttribute("opacity", 0); wave2.setAttribute("opacity", 0); }
      else {
        wave1.setAttribute("opacity", 1); wave2.setAttribute("opacity", 1);
        wave1.setAttribute("r", r); wave2.setAttribute("r", r);
      }
      var xt = ox + v * tc;
      train.innerHTML = "";
      VZ.ln(train, X1 + v * tc, 118, X2 + v * tc, 118, VZ.stroke({ stroke: C.ink, "stroke-width": 2.4 }));
      VZ.ln(train, X1 + v * tc, 118, X1 + v * tc, 142, VZ.stroke({ stroke: C.ink, "stroke-width": 2.4 }));
      VZ.ln(train, X2 + v * tc, 118, X2 + v * tc, 142, VZ.stroke({ stroke: C.ink, "stroke-width": 2.4 }));
      VZ.ln(train, X1 + v * tc, 142, X2 + v * tc, 142, VZ.stroke({ stroke: C.ink, "stroke-width": 2.4, opacity: .5 }));
      mpDot.setAttribute("cx", xt);
      mpT.setAttribute("x", xt);
      var hitM = r >= L;
      var tFront = L / (cspd + v), tRear = L / Math.max(cspd - v, 1);
      var gotF = tc >= tFront && tFront <= T, gotR = tc >= tRear && tRear <= T;
      VZ.setPanel(out, {
        "站台中点 M": hitM ? "两道闪光同时到达 ✓" : "等待中…",
        "车厢中点 M′": v > 0 ? "先遇到车头闪光" : "与 M 相同（v=0）",
        "M′ 收到车头闪": gotF ? "已收到（t=" + tFront.toFixed(2) + "s）" : "…",
        "M′ 收到车尾闪": gotR ? "已收到（t=" + tRear.toFixed(2) + "s）" : "…"
      });
      mT.textContent = hitM ? "M：同时到达 ✓" : "M 站台中点";
    });
  }
},

/* ==========================================================
   ch17 · 光钟与时间膨胀
   ========================================================== */
"f-ch17f": {
  title: "",
  hint: "光钟：一枚光子在两面镜子间往返，<b>每往返一次算一滴答</b>。给右边的钟一个速度——光走的路变成了斜线，路程变长，而光速不变，所以<b>每滴答被拉长 γ 倍</b>：运动钟走得更慢。这不是钟的毛病，是时间本身。",
  draw: function (stage) {
    var svg = VZ.S(stage, 760, 260, {});
    var C = VZ.C;
    var slider = VZ.slider(stage, { label: "运动钟速度 v/c", value: 0.5, min: 0, max: 0.9, step: 0.01, format: function (v) { return v.toFixed(2); }, onInput: function () {} });
    var out = VZ.panel(stage, { "β = v/c": "0.50", "γ = 1/√(1−β²)": "", "运动钟 1 滴答": "" });

    /* 左：静止光钟 */
    function clock(x) {
      VZ.ln(svg, x - 30, 58, x + 30, 58, VZ.stroke({ stroke: C.ink, "stroke-width": 3 }));
      VZ.ln(svg, x - 30, 202, x + 30, 202, VZ.stroke({ stroke: C.ink, "stroke-width": 3 }));
    }
    clock(150);
    VZ.txt(svg, 150, 232, "静止光钟", { size: 12.5, fill: C.ink, anchor: "middle" });
    var ph1 = VZ.circ(svg, 150, 202, 4.5, { fill: C.cyan });
    var tick1 = VZ.circ(svg, 150, 202, 6, { stroke: C.cyan, fill: "none", "stroke-width": 1.2, opacity: 0 });

    /* 右：运动光钟 */
    var mgroup = VZ.g(svg);
    var mTop = VZ.ln(mgroup, -30, 58, 30, 58, VZ.stroke({ stroke: C.ink, "stroke-width": 3 }));
    var mBot = VZ.ln(mgroup, -30, 202, 30, 202, VZ.stroke({ stroke: C.ink, "stroke-width": 3 }));
    var ph2 = VZ.circ(mgroup, 0, 202, 4.5, { fill: C.mag });
    VZ.txt(svg, 545, 232, "运动光钟（滴答变慢）", { size: 12.5, fill: C.mag, anchor: "middle" });
    var trail = VZ.path(svg, "", VZ.stroke({ stroke: C.mag, "stroke-width": 1.3, opacity: .55, "stroke-dasharray": "3 3" }));
    var hist = [];

    var T0 = 1.3;
    VZ.raf(svg, function (t) {
      var b = parseFloat(slider.input.value);
      var gm = 1 / Math.sqrt(1 - b * b);
      VZ.setPanel(out, {
        "β = v/c": b.toFixed(2),
        "γ = 1/√(1−β²)": gm.toFixed(3),
        "运动钟 1 滴答": (gm * T0).toFixed(2) + " s（= 静钟 " + gm.toFixed(2) + " 滴答）"
      });
      /* 静止钟：垂直往返 */
      var u1 = (t % T0) / T0;
      var y1 = u1 < .5 ? 202 - 144 * (u1 * 2) : 58 + 144 * (u1 * 2 - 1);
      ph1.setAttribute("cy", y1);
      if (Math.abs(y1 - 58) < 3 || Math.abs(y1 - 202) < 3) {
        tick1.setAttribute("cx", 150); tick1.setAttribute("cy", y1); tick1.setAttribute("opacity", .8);
        tick1.setAttribute("r", 10 + 20 * ((t * 3) % 1));
      } else tick1.setAttribute("opacity", 0);

      /* 运动钟：斜向往返，周期 γT0 */
      var Tm = gm * T0;
      var cx = 430 + b * 90 * t;
      if (cx > 660) { cx = 430; hist = []; }
      var u2 = (t % Tm) / Tm;
      var y2 = u2 < .5 ? 202 - 144 * (u2 * 2) : 58 + 144 * (u2 * 2 - 1);
      mgroup.setAttribute("transform", "translate(" + cx + " 0)");
      ph2.setAttribute("cy", y2);
      hist.push([cx, y2]); if (hist.length > 46) hist.shift();
      trail.setAttribute("d", hist.map(function (p, i) { return (i ? "L" : "M") + p[0].toFixed(1) + " " + p[1].toFixed(1); }).join(""));
    });
  }
},

/* ==========================================================
   ch17 · 伽利略变换 vs 洛伦兹变换
   ========================================================== */
"f-ch17g": {
  title: "",
  hint: "同一个事件 E，两套变换给出两组新坐标。拖滑块加速度：<b>伽利略</b>的『同时线』永远是水平的——t 绝对；<b>洛伦兹</b>的同时线跟着速度倾斜（却不越过 45° 光线），x′ 轴也对称地翘起。光速不变，逼出了这套『剪刀』。",
  draw: function (stage) {
    var svg = VZ.S(stage, 760, 280, { grid: true });
    var C = VZ.C;
    var slider = VZ.slider(stage, { label: "速度 v/c", value: 0.4, min: 0, max: 0.7, step: 0.01, format: function (v) { return v.toFixed(2); }, onInput: function () { redraw(); } });
    var out = VZ.panel(stage, { "E 的新坐标（伽利略）": "", "E 的新坐标（洛伦兹）": "" });

    var U = 105; /* 1 时空单位 = 105px */
    /* E = (x,t) = (0.55, 0.78) */
    var EX = 0.55, ET = 0.78;

    function frame(ox, oy, label, lorentz) {
      VZ.txt(svg, ox - 10, oy + 40, label, { size: 14, fill: C.gold, weight: 700 });
      VZ.ln(svg, ox - 70, oy, ox + 130, oy, VZ.stroke({ stroke: C.ink2, "stroke-width": 1.4 }));
      VZ.ln(svg, ox, oy + 60, ox, oy - 150, VZ.stroke({ stroke: C.ink2, "stroke-width": 1.4 }));
      VZ.txt(svg, ox + 128, oy + 14, "x", { size: 11, fill: C.dim });
      VZ.txt(svg, ox + 8, oy - 146, "t", { size: 11, fill: C.dim });
      /* 45° 光线 */
      VZ.path(svg, "M" + (ox - 100) + " " + (oy + 100) + "L" + (ox + 100) + " " + (oy - 100), VZ.stroke({ stroke: C.cyan, "stroke-width": 1.1, opacity: .5, "stroke-dasharray": "4 4" }));
      VZ.path(svg, "M" + (ox - 100) + " " + (oy - 100) + "L" + (ox + 100) + " " + (oy + 100), VZ.stroke({ stroke: C.cyan, "stroke-width": 1.1, opacity: .5, "stroke-dasharray": "4 4" }));
      var g = VZ.g(svg);
      return { ox: ox, oy: oy, g: g };
    }
    var F1 = frame(140, 190, "伽利略变换", false);
    var F2 = frame(500, 190, "洛伦兹变换", true);

    var eDot1 = VZ.circ(svg, 0, 0, 6, { fill: C.gold });
    var eDot2 = VZ.circ(svg, 0, 0, 6, { fill: C.gold });
    var eT1 = VZ.txt(svg, 0, 0, "E", { size: 12, fill: C.gold, weight: 700 });
    var eT2 = VZ.txt(svg, 0, 0, "E", { size: 12, fill: C.gold, weight: 700 });

    var grid1 = VZ.g(svg), grid2 = VZ.g(svg);

    function drawGrid(F, lorentz, b) {
      F.g.innerHTML = "";
      /* x′ 轴（空间轴）与同时线 t′=const */
      var kx = lorentz ? b : 0;            /* x′ 轴斜率：t = kx·x */
      var kt = lorentz ? b : 0;            /* 同时线斜率：t = kt·x + c（伽利略为 0） */
      /* x′ 轴 */
      VZ.path(F.g, "M" + (F.ox - 95) + " " + (F.oy - 95 * kx) + "L" + (F.ox + 95) + " " + (F.oy + 95 * kx),
        VZ.stroke({ stroke: C.violet, "stroke-width": 2 }));
      if (lorentz) VZ.txt(F.g, F.ox + 82, F.oy + 95 * b - 10, "x′", { size: 11.5, fill: C.violet, weight: 700 });
      else VZ.txt(F.g, F.ox + 82, F.oy - 10, "x′ = x 轴不动", { size: 11, fill: C.violet });
      /* 同时线：过 E 的一条 + 两条参照 */
      [ET - 0.5, ET, ET + 0.5].forEach(function (t0) {
        var px = F.ox + EX * U, py = F.oy - t0 * U;
        VZ.path(F.g, "M" + (px - 80) + " " + (py + 80 * kt) + "L" + (px + 80) + " " + (py - 80 * kt),
          VZ.stroke({ stroke: t0 === ET ? C.mag : C.faint, "stroke-width": t0 === ET ? 2 : 1, opacity: t0 === ET ? .95 : .6, "stroke-dasharray": t0 === ET ? "none" : "5 5" }));
      });
      if (lorentz) VZ.txt(F.g, F.ox - 92, F.oy - ET * U + 80 * b + 24, "同时线倾斜！", { size: 11.5, fill: C.mag, weight: 700 });
      else VZ.txt(F.g, F.ox - 92, F.oy - ET * U + 24, "同时线仍水平", { size: 11.5, fill: C.ink2 });
    }

    function redraw() {
      var b = parseFloat(slider.input.value);
      drawGrid(F1, false, 0);
      drawGrid(F2, true, b);
      var p1x = F1.ox + EX * U, p1y = F1.oy - ET * U;
      eDot1.setAttribute("cx", p1x); eDot1.setAttribute("cy", p1y);
      eT1.setAttribute("x", p1x + 10); eT1.setAttribute("y", p1y - 8);
      var p2x = F2.ox + EX * U, p2y = F2.oy - ET * U;
      eDot2.setAttribute("cx", p2x); eDot2.setAttribute("cy", p2y);
      eT2.setAttribute("x", p2x + 10); eT2.setAttribute("y", p2y - 8);
      var gx = EX - b * 1.0, gt = 1.0; /* 伽利略取 t=1 的时刻比较 */
      var gm = 1 / Math.sqrt(1 - b * b);
      VZ.setPanel(out, {
        "E 的新坐标（伽利略）": "x′ = " + gx.toFixed(2) + "，t′ = t（不变）",
        "E 的新坐标（洛伦兹）": "x′ = " + (gm * (EX - b * ET)).toFixed(2) + "，t′ = " + (gm * (ET - b * EX)).toFixed(2)
      });
    }
    redraw();
  }
},

/* ==========================================================
   ch18 · 闵氏图上的双曲线校准
   ========================================================== */
"f-ch18d": {
  title: "",
  hint: "拖动金色事件点 E。所有落在同一条金色双曲线上的事件，与原点的<b>原时间隔 τ 相同</b>——双曲线就是闵氏时空的『等距离圆』。E 滑出光锥后，间隔变成类空的，校准线换成紫色双曲线，量的是固有距离 σ。",
  draw: function (stage) {
    var svg = VZ.S(stage, 760, 290, { grid: true });
    var C = VZ.C;
    var ox = 380, oy = 150, U = 88;
    var out = VZ.panel(stage, { "间隔类型": "", "原时 τ / 固有距离 σ": "", "s² = t²−x²": "" });

    VZ.ln(svg, ox - 190, oy, ox + 190, oy, VZ.stroke({ stroke: C.ink2, "stroke-width": 1.3 }));
    VZ.ln(svg, ox, oy + 120, ox, oy - 128, VZ.stroke({ stroke: C.ink2, "stroke-width": 1.3 }));
    VZ.txt(svg, ox + 184, oy + 16, "x", { size: 11, fill: C.dim });
    VZ.txt(svg, ox + 8, oy - 124, "t", { size: 11, fill: C.dim });
    VZ.path(svg, "M" + (ox - 130) + " " + (oy + 130) + "L" + (ox + 130) + " " + (oy - 130), VZ.stroke({ stroke: C.cyan, "stroke-width": 1.2, opacity: .55, "stroke-dasharray": "4 4" }));
    VZ.path(svg, "M" + (ox - 130) + " " + (oy - 130) + "L" + (ox + 130) + " " + (oy + 130), VZ.stroke({ stroke: C.cyan, "stroke-width": 1.2, opacity: .55, "stroke-dasharray": "4 4" }));
    VZ.txt(svg, ox + 134, oy - 128, "光锥 45°", { size: 11, fill: C.cyan });

    /* 参照校准双曲线（τ = 0.4 / 0.8，σ = 0.5 / 1.0） */
    function hyp(s, spacelike, a) {
      var d = "";
      for (var i = 0; i <= 60; i++) {
        var u = -1.35 + 2.7 * i / 60;
        var ch = Math.cosh(u), sh = Math.sinh(u);
        var X, T;
        if (spacelike) { X = s * ch; T = s * sh; } else { T = s * ch; X = s * sh; }
        var px = ox + X * U, py = oy - T * U;
        if (px < ox - 185 || px > ox + 185 || py < oy - 125 || py > oy + 118) continue;
        d += (d ? "L" : "M") + px.toFixed(1) + " " + py.toFixed(1);
      }
      if (d) VZ.path(svg, d, a);
    }
    hyp(0.4, false, VZ.stroke({ stroke: C.gold, "stroke-width": 1, opacity: .3, "stroke-dasharray": "4 5" }));
    hyp(0.8, false, VZ.stroke({ stroke: C.gold, "stroke-width": 1, opacity: .3, "stroke-dasharray": "4 5" }));
    hyp(0.5, true, VZ.stroke({ stroke: C.violet, "stroke-width": 1, opacity: .3, "stroke-dasharray": "4 5" }));
    hyp(1.0, true, VZ.stroke({ stroke: C.violet, "stroke-width": 1, opacity: .3, "stroke-dasharray": "4 5" }));

    var calib = VZ.path(svg, "", VZ.stroke({ stroke: C.gold, "stroke-width": 2.4 }));
    var eDot = VZ.circ(svg, ox + 0.45 * U, oy - 0.85 * U, 7, { fill: C.gold });
    var eRing = VZ.circ(svg, 0, 0, 13, { stroke: C.gold, fill: "none", "stroke-width": 1, opacity: .5 });
    var eT = VZ.txt(svg, 0, 0, "E", { size: 12.5, fill: C.gold, weight: 700 });
    var lineRay = VZ.path(svg, "", VZ.stroke({ stroke: C.gold, "stroke-width": 1, opacity: .5, "stroke-dasharray": "3 4" }));

    function px2unit(x, y) { return [(x - ox) / U, (oy - y) / U]; }
    function drawHyper(s, spacelike, col) {
      var d = "";
      for (var i = 0; i <= 80; i++) {
        var u = -1.5 + 3.0 * i / 80;
        var ch = Math.cosh(u), sh = Math.sinh(u);
        var X, T;
        if (spacelike) { X = s * ch; T = s * sh; } else { T = s * ch; X = s * sh; }
        var px = ox + X * U, py = oy - T * U;
        if (px < 14 || px > 746 || py < 14 || py > 276) continue;
        d += (d ? "L" : "M") + px.toFixed(1) + " " + py.toFixed(1);
      }
      calib.setAttribute("d", d);
      calib.setAttribute("stroke", col);
    }
    function update() {
      var ut = px2unit(eDot.getAttribute("cx") * 1, eDot.getAttribute("cy") * 1);
      var xv = +eDot.getAttribute("cx"), yv = +eDot.getAttribute("cy");
      var tu = (oy - yv) / U, xu = (xv - ox) / U;
      var s2 = tu * tu - xu * xu;
      eRing.setAttribute("cx", xv); eRing.setAttribute("cy", yv);
      eT.setAttribute("x", xv + 12); eT.setAttribute("y", yv - 8);
      lineRay.setAttribute("d", "M" + ox + " " + oy + "L" + xv + " " + yv);
      if (s2 > 0.003) {
        var tau = Math.sqrt(s2);
        drawHyper(tau, false, C.gold);
        VZ.setPanel(out, { "间隔类型": "类时（可因果相连）", "原时 τ / 固有距离 σ": "τ = " + tau.toFixed(2), "s² = t²−x²": "+" + s2.toFixed(2) });
      } else if (s2 < -0.003) {
        var sg = Math.sqrt(-s2);
        drawHyper(sg, true, C.violet);
        VZ.setPanel(out, { "间隔类型": "类空（绝无因果）", "原时 τ / 固有距离 σ": "σ = " + sg.toFixed(2), "s² = t²−x²": s2.toFixed(2) });
      } else {
        calib.setAttribute("d", "");
        VZ.setPanel(out, { "间隔类型": "类光（在光锥上）", "原时 τ / 固有距离 σ": "0", "s² = t²−x²": "0" });
      }
    }
    VZ.drag(svg, svg, 760, 290, function (x, y, phase) {
      if (phase === "start" && Math.hypot(x - +eDot.getAttribute("cx"), y - +eDot.getAttribute("cy")) > 60) return;
      eDot.setAttribute("cx", VZ.clamp(x, 40, 720));
      eDot.setAttribute("cy", VZ.clamp(y, 22, 268));
      update();
    });
    update();
  }
},

/* ==========================================================
   ch18 · 长度收缩
   ========================================================== */
"f-ch18e": {
  title: "",
  hint: "上面是静止的尺子（本征长度 L₀）。拖滑块让下面那把尺子动起来：在<b>站台系同时</b>测量它的两端，读数是 L₀/γ——运动方向上被压短。速度接近 c 时压得越狠；这不是视觉错觉，是『同时』依赖参考系的直接后果。",
  draw: function (stage) {
    var svg = VZ.S(stage, 760, 240, {});
    var C = VZ.C;
    var slider = VZ.slider(stage, { label: "速度 v/c", value: 0.6, min: 0, max: 0.95, step: 0.01, format: function (v) { return v.toFixed(2); }, onInput: function () { redraw(); } });
    var out = VZ.panel(stage, { "β": "", "γ": "", "测得长度 L = L₀/γ": "" });

    var L0 = 260, x0 = 90, yRest = 70, yMov = 165;
    /* 静止尺 */
    VZ.card(svg, x0, yRest - 14, L0, 28, { stroke: C.ink, fill: "rgba(255,255,255,.05)" });
    VZ.txt(svg, x0 + L0 / 2, yRest + 5, "静止尺  L₀（本征长度）", { size: 12, fill: C.ink, anchor: "middle" });
    for (var i = 0; i <= 8; i++) VZ.ln(svg, x0 + L0 * i / 8, yRest - 14, x0 + L0 * i / 8, yRest - 6, { stroke: C.ink2, "stroke-width": 1 });
    /* 测量基线 */
    VZ.txt(svg, 40, yMov + 5, "站台系同时测量 →", { size: 11.5, fill: C.dim });

    var movG = VZ.g(svg);
    var movBar = VZ.el("rect", { x: 0, y: yMov - 14, width: L0, height: 28, rx: 10, fill: "rgba(255,111,216,.10)", stroke: C.mag, "stroke-width": 1 }, movG);
    var ghost = VZ.card(svg, x0, yMov - 14, L0, 28, { stroke: C.faint, fill: "none", "stroke-dasharray": "4 4" });
    var ghostT = VZ.txt(svg, x0 + L0 / 2, yMov + 34, "虚线框 = 不收缩时的长度（参照）", { size: 11, fill: C.dim, anchor: "middle" });
    var mTop = VZ.ln(svg, 0, yMov - 24, 0, yMov + 18, VZ.stroke({ stroke: C.gold, "stroke-width": 1.4 }));
    var mBot = VZ.ln(svg, 0, yMov - 24, 0, yMov + 18, VZ.stroke({ stroke: C.gold, "stroke-width": 1.4 }));
    var mArr = VZ.txt(svg, 0, yMov - 30, "", { size: 11.5, fill: C.gold, anchor: "middle" });

    function redraw() {
      var b = parseFloat(slider.input.value);
      var gm = 1 / Math.sqrt(1 - b * b);
      var Lc = L0 / gm;
      movBar.setAttribute("width", Lc);
      movBar.setAttribute("x", 0);
      VZ.setPanel(out, { "β": b.toFixed(2), "γ": gm.toFixed(3), "测得长度 L = L₀/γ": (Lc / L0).toFixed(3) + " × L₀" });
    }
    VZ.raf(svg, function (t) {
      var b = parseFloat(slider.input.value);
      var gm = 1 / Math.sqrt(1 - b * b);
      var Lc = L0 / gm;
      var dx = 40 + (t * 30) % 380;
      if (dx + Lc > 740) dx = 740 - Lc;
      movG.setAttribute("transform", "translate(" + dx + " 0)");
      mTop.setAttribute("x1", dx); mTop.setAttribute("x2", dx);
      mBot.setAttribute("x1", dx + Lc); mBot.setAttribute("x2", dx + Lc);
      mArr.setAttribute("x", dx + Lc / 2);
      mArr.textContent = "L = " + (Lc / L0).toFixed(2) + " L₀";
    });
    redraw();
  }
},

/* ==========================================================
   ch18 · 天球与像差
   ========================================================== */
"f-ch18f": {
  title: "",
  hint: "左圈：静止时的星空，均匀分布在全天。拖滑块加速：像差公式把每颗星的方向往<b>运动前方（右侧）</b>挤——光好像变成『迎头雨』。速度接近 c 时，整个天球挤进前方一小片，背后几乎空了。",
  draw: function (stage) {
    var svg = VZ.S(stage, 760, 260, {});
    var C = VZ.C;
    var slider = VZ.slider(stage, { label: "速度 v/c", value: 0.5, min: 0, max: 0.95, step: 0.01, format: function (v) { return v.toFixed(2); }, onInput: function () { redraw(); } });
    var out = VZ.panel(stage, { "前方 ±30° 内星数": "", "背后 ±30° 内星数": "" });

    /* 确定性星表：26 颗，θ 从运动方向（右）起算 */
    var stars = [];
    for (var i = 0; i < 26; i++) {
      var h = Math.sin(i * 12.9898) * 43758.5453;
      var frac = h - Math.floor(h);
      stars.push(i * (2 * Math.PI / 26) + (frac - .5) * 0.21);
    }
    var cx1 = 190, cx2 = 560, cy = 140, R = 100;
    VZ.circ(svg, cx1, cy, R, { stroke: C.faint, "stroke-width": 1.2 });
    VZ.circ(svg, cx2, cy, R, { stroke: C.faint, "stroke-width": 1.2 });
    VZ.txt(svg, cx1, 34, "静止时的天球", { size: 13, fill: C.ink, anchor: "middle" });
    VZ.txt(svg, cx2, 34, "运动时的天球（像差）", { size: 13, fill: C.mag, anchor: "middle" });
    /* 运动方向箭头 */
    VZ.path(svg, "M" + (cx2 - 40) + " " + (cy + 128) + "L" + (cx2 + 40) + " " + (cy + 128), VZ.stroke({ stroke: C.gold, "stroke-width": 1.6 }));
    VZ.path(svg, "M" + (cx2 + 40) + " " + (cy + 128) + "l-9 -5v10z", { fill: C.gold });
    VZ.txt(svg, cx2, cy + 152, "运动方向 →", { size: 11.5, fill: C.gold, anchor: "middle" });

    var dots1 = [], dots2 = [], links = [];
    stars.forEach(function () {
      dots1.push(VZ.circ(svg, 0, 0, 3, { fill: C.cyan }));
      dots2.push(VZ.circ(svg, 0, 0, 3, { fill: C.gold }));
      links.push(VZ.ln(svg, 0, 0, 0, 0, { stroke: C.dim, "stroke-width": .7, opacity: .35, "stroke-dasharray": "2 3" }));
    });
    function pos(cx, th) { return [cx + R * Math.cos(th), cy - R * Math.sin(th)]; }
    function redraw() {
      var b = parseFloat(slider.input.value);
      var nF = 0, nB = 0;
      stars.forEach(function (th, i) {
        var p1 = pos(cx1, th);
        var cth = Math.cos(th), sth = Math.sin(th);
        var ct2 = (cth + b) / (1 + b * cth);
        var th2 = Math.acos(VZ.clamp(ct2, -1, 1)) * (sth < 0 ? -1 : 1);
        var p2 = pos(cx2, th2);
        dots1[i].setAttribute("cx", p1[0]); dots1[i].setAttribute("cy", p1[1]);
        dots2[i].setAttribute("cx", p2[0]); dots2[i].setAttribute("cy", p2[1]);
        links[i].setAttribute("x1", p1[0]); links[i].setAttribute("y1", p1[1]);
        links[i].setAttribute("x2", p2[0]); links[i].setAttribute("y2", p2[1]);
        var a2 = Math.abs(th2);
        if (a2 < Math.PI / 6 || a2 > 2 * Math.PI - Math.PI / 6) nF++;
        if (Math.abs(a2 - Math.PI) < Math.PI / 6) nB++;
      });
      VZ.setPanel(out, { "前方 ±30° 内星数": nF + " 颗（原来 " + count(0) + "）", "背后 ±30° 内星数": nB + " 颗（原来 " + count(Math.PI) + "）" });
    }
    function count(center) {
      var n = 0;
      stars.forEach(function (th) {
        var d = Math.abs(((th - center) % (2 * Math.PI) + 3 * Math.PI) % (2 * Math.PI) - Math.PI);
        if (d < Math.PI / 6) n++;
      });
      return n;
    }
    redraw();
  }
},

/* ==========================================================
   ch18 · E = mc²：质量是冻结的能量
   ========================================================== */
"f-ch18g": {
  title: "",
  hint: "选一对粒子，按<b>湮灭</b>：正反物质把全部静质量换成两颗光子。电子对释放 1.022 MeV，质子对释放近 2 GeV——同一套公式，只差一个 m。<b>质量不是别的，就是静止的能量。</b>",
  draw: function (stage) {
    var svg = VZ.S(stage, 760, 250, {});
    var C = VZ.C;
    var ctl = VZ.box(stage, "viz-chips");
    var row = VZ.box(stage, "viz-ctl");
    var out = VZ.panel(stage, { "释放能量": "", "相当于": "" });
    var kinds = { "电子对": 1.022, "μ子对": 211.4, "质子对": 1876.5 };
    var kind = "电子对";
    VZ.chips(ctl, Object.keys(kinds), kind, function (k) { kind = k; });
    VZ.btn(row, "湮灭！", function () { go(); });

    var cx = 380, cy = 118;
    var e1 = VZ.circ(svg, 150, cy, 9, { fill: C.cyan });
    var e2 = VZ.circ(svg, 610, cy, 9, { fill: C.mag });
    var t1 = VZ.txt(svg, 150, cy - 18, "e⁻", { size: 13, fill: C.cyan, anchor: "middle" });
    var t2 = VZ.txt(svg, 610, cy - 18, "e⁺", { size: 13, fill: C.mag, anchor: "middle" });
    var flash = VZ.circ(svg, cx, cy, 6, { fill: C.gold, opacity: 0 });
    var ph1 = VZ.path(svg, "", VZ.stroke({ stroke: C.gold, "stroke-width": 2 }));
    var ph2 = VZ.path(svg, "", VZ.stroke({ stroke: C.gold, "stroke-width": 2 }));
    var lbl = VZ.txt(svg, cx, 46, "E = mc²", { size: 21, fill: C.gold, anchor: "middle", weight: 700, "font-family": "Georgia,serif" });
    VZ.txt(svg, cx, 226, "两颗光子背靠背飞出，总能量 = 2mc²", { size: 12, fill: C.ink2, anchor: "middle" });

    function wave(x1, y1, x2, y2) {
      var n = 8, d = "M" + x1 + " " + y1;
      for (var i = 1; i <= n; i++) {
        var u = i / n, mx = x1 + (x2 - x1) * u, my = y1 + (y2 - y1) * u;
        d += "L" + mx.toFixed(1) + " " + (my + (i % 2 ? 6 : -6)).toFixed(1);
      }
      return d;
    }
    function go() {
      var MeV = kinds[kind];
      VZ.setPanel(out, { "释放能量": MeV.toFixed(1) + " MeV（= 2mc²）", "相当于": kind === "电子对" ? "2 × 511 keV 的伽马光" : "把静质量全部烧成光" });
      var t0 = null;
      VZ.raf(svg, function (t, ms) {
        if (t0 === null) t0 = t;
        var u = (t - t0) / 2.0;
        var g = Math.max(0, 1 - Math.abs(u - .28) * 6);
        flash.setAttribute("opacity", g * .95);
        flash.setAttribute("r", 8 + g * 26);
        var sep = VZ.clamp((u - .28) / .72, 0, 1);
        var x1 = cx - 230 * VZ.ease(sep), x2 = cx + 230 * VZ.ease(sep);
        e1.setAttribute("cx", VZ.lerp(150, cx, VZ.clamp(u / .28, 0, 1)));
        e2.setAttribute("cx", VZ.lerp(610, cx, VZ.clamp(u / .28, 0, 1)));
        t1.setAttribute("x", +e1.getAttribute("cx")); t2.setAttribute("x", +e2.getAttribute("cx"));
        e1.setAttribute("opacity", u < .28 ? 1 : 0);
        e2.setAttribute("opacity", u < .28 ? 1 : 0);
        t1.setAttribute("opacity", u < .28 ? 1 : 0);
        t2.setAttribute("opacity", u < .28 ? 1 : 0);
        ph1.setAttribute("d", sep > 0 ? wave(cx, cy, x1, cy - 60 * sep) : "");
        ph2.setAttribute("d", sep > 0 ? wave(cx, cy, x2, cy + 60 * sep) : "");
        ph1.setAttribute("opacity", sep > 0 ? 1 : 0);
        ph2.setAttribute("opacity", sep > 0 ? 1 : 0);
      });
    }
    VZ.setPanel(out, { "释放能量": "1.0 MeV（= 2mc²）", "相当于": "2 × 511 keV 的伽马光" });
  }
},

/* ==========================================================
   ch19 · 场的观念：点电荷的场线
   ========================================================== */
"f-ch19d": {
  title: "",
  hint: "紫球是固定电荷 +Q，青球是<b>可拖动</b>的负电荷。场线从 +Q 出发、扎进 −q：拖近时两球之间的线又密又直——场强；拖远时线松开——场弱。<b>场线疏密就是场的强弱</b>，这正是『场』这个观念的核心。",
  draw: function (stage) {
    var svg = VZ.S(stage, 760, 280, {});
    var C = VZ.C;
    var out = VZ.panel(stage, { "两球间距": "", "中间区域场强感觉": "" });
    var Q = [250, 140], q = [510, 140];
    var linesG = VZ.g(svg);
    var qDot = VZ.circ(svg, q[0], q[1], 9, { fill: C.cyan });
    var qT = VZ.txt(svg, q[0], q[1] - 16, "−q（拖我）", { size: 12, fill: C.cyan, anchor: "middle" });
    VZ.circ(svg, Q[0], Q[1], 11, { fill: C.violet });
    VZ.txt(svg, Q[0], Q[1] + 30, "+Q", { size: 13, fill: C.violet, anchor: "middle", weight: 700 });

    function field(x, y) {
      var dx1 = x - Q[0], dy1 = y - Q[1], r1 = Math.hypot(dx1, dy1) + 4;
      var dx2 = x - q[0], dy2 = y - q[1], r2 = Math.hypot(dx2, dy2) + 4;
      var f1 = 9000 / (r1 * r1), f2 = 9000 / (r2 * r2);
      return [f1 * dx1 / r1 - f2 * dx2 / r2, f1 * dy1 / r1 - f2 * dy2 / r2];
    }
    function draw() {
      linesG.innerHTML = "";
      var N = 18;
      for (var i = 0; i < N; i++) {
        var a = 2 * Math.PI * i / N;
        var x = Q[0] + 15 * Math.cos(a), y = Q[1] + 15 * Math.sin(a);
        var d = "M" + x.toFixed(1) + " " + y.toFixed(1);
        for (var s = 0; s < 150; s++) {
          var E = field(x, y), m = Math.hypot(E[0], E[1]) + 1e-6;
          x += E[0] / m * 6; y += E[1] / m * 6;
          d += "L" + x.toFixed(1) + " " + y.toFixed(1);
          if (x < 16 || x > 744 || y < 14 || y > 266) break;
          if (Math.hypot(x - q[0], y - q[1]) < 13) break;
        }
        VZ.path(linesG, d, VZ.stroke({ stroke: C.ink2, "stroke-width": 1.1, opacity: .6 }));
      }
      var dist = Math.hypot(Q[0] - q[0], Q[1] - q[1]);
      VZ.setPanel(out, {
        "两球间距": Math.round(dist) + " px",
        "中间区域场强感觉": dist < 180 ? "很密 → 强" : dist < 320 ? "中等" : "稀疏 → 弱"
      });
    }
    VZ.drag(svg, svg, 760, 280, function (x, y, phase) {
      if (Math.hypot(x - q[0], y - q[1]) > 60) return;
      q[0] = VZ.clamp(x, 40, 720); q[1] = VZ.clamp(y, 30, 250);
      qDot.setAttribute("cx", q[0]); qDot.setAttribute("cy", q[1]);
      qT.setAttribute("x", q[0]); qT.setAttribute("y", q[1] - 16);
      draw();
    });
    draw();
  }
},

/* ==========================================================
   ch19 · 麦克斯韦四行字，一行一行看
   ========================================================== */
"f-ch19e": {
  title: "",
  hint: "点击左边任意一行方程，右边画出它说的话：<b>高斯</b>——电荷吐出电场线；<b>无磁单极</b>——磁线永远闭合；<b>法拉第</b>——变化的磁场拧出电场；<b>安培–麦克斯韦</b>——电流或变化的电场都拧出磁场。最后一项是麦克斯韦补的，光就从这行里长出来。",
  draw: function (stage) {
    var svg = VZ.S(stage, 760, 290, {});
    var C = VZ.C;
    var rows = [
      { name: "∇·E = ρ/ε₀", sub: "高斯：电荷产生电场", c: C.cyan },
      { name: "∇·B = 0", sub: "无磁单极：磁线闭合", c: C.green },
      { name: "∇×E = −∂B/∂t", sub: "法拉第：变 B 生 E", c: C.gold },
      { name: "∇×B = μ₀j + μ₀ε₀∂E/∂t", sub: "安培–麦克斯韦：变 E 生 B", c: C.mag }
    ];
    var cards = [], dia = VZ.g(svg);
    rows.forEach(function (r, i) {
      var y = 24 + i * 62;
      var cg = VZ.g(svg, { style: "cursor:pointer" });
      VZ.card(cg, 20, y, 300, 52, { stroke: C.faint, fill: "rgba(255,255,255,.03)" });
      VZ.txt(cg, 34, y + 22, r.name, { size: 13.5, fill: r.c, weight: 700, "font-family": "Georgia,serif" });
      VZ.txt(cg, 34, y + 42, r.sub, { size: 11, fill: C.dim });
      cg.addEventListener("click", function () { pick(i); });
      cards.push(cg);
    });
    VZ.txt(svg, 20, 284, "点击一行 ↴", { size: 11, fill: C.dim });

    function pick(i) {
      cards.forEach(function (cg, j) {
        cg.querySelector("rect").setAttribute("stroke", j === i ? rows[j].c : C.faint);
        cg.querySelector("rect").setAttribute("fill", j === i ? "rgba(255,255,255,.08)" : "rgba(255,255,255,.03)");
      });
      dia.innerHTML = "";
      var cx = 545, cy = 145;
      if (i === 0) {
        VZ.circ(dia, cx, cy, 70, { stroke: C.faint, "stroke-width": 1, "stroke-dasharray": "5 5" });
        VZ.txt(dia, cx, cy + 88, "闭合面：流出的电场线 ∝ 里面的电荷", { size: 11.5, fill: C.ink2, anchor: "middle" });
        for (var k = 0; k < 12; k++) {
          var a = 2 * Math.PI * k / 12;
          VZ.path(dia, "M" + (cx + 12 * Math.cos(a)) + " " + (cy + 12 * Math.sin(a)) + "L" + (cx + 66 * Math.cos(a)) + " " + (cy + 66 * Math.sin(a)),
            VZ.stroke({ stroke: C.cyan, "stroke-width": 1.5 }));
          VZ.path(dia, "M" + (cx + 66 * Math.cos(a)) + " " + (cy + 66 * Math.sin(a)) + "l" + (-8 * Math.cos(a) + 4 * Math.sin(a)).toFixed(1) + " " + (-8 * Math.sin(a) - 4 * Math.cos(a)).toFixed(1) + "l" + (10 * Math.cos(a)).toFixed(1) + " " + (10 * Math.sin(a)).toFixed(1) + "z", { fill: C.cyan });
        }
        VZ.circ(dia, cx, cy, 11, { fill: C.violet });
      } else if (i === 1) {
        VZ.txt(dia, cx, cy + 118, "没有『磁荷』：线从 N 出必回 S，永远闭合", { size: 11.5, fill: C.ink2, anchor: "middle" });
        VZ.card(dia, cx - 90, cy - 16, 70, 32, { stroke: C.green, fill: "rgba(94,224,138,.08)" });
        VZ.txt(dia, cx - 55, cy + 4, "N", { size: 14, fill: C.green, anchor: "middle", weight: 700 });
        VZ.card(dia, cx + 20, cy - 16, 70, 32, { stroke: C.red, fill: "rgba(255,122,122,.08)" });
        VZ.txt(dia, cx + 55, cy + 4, "S", { size: 14, fill: C.red, anchor: "middle", weight: 700 });
        for (var m = 0; m < 3; m++) {
          var off = (m - 1) * 16;
          VZ.path(dia, "M" + (cx - 20) + " " + (cy + off) + "C" + (cx + 10) + " " + (cy + off - 40) + " " + (cx + 60) + " " + (cy + off - 40) + " " + (cx + 90) + " " + (cy + off) + "C" + (cx + 60) + " " + (cy + off + 46) + " " + (cx + 10) + " " + (cy + off + 46) + " " + (cx - 20) + " " + (cy + off),
            VZ.stroke({ stroke: C.green, "stroke-width": 1.3, opacity: .7 }));
        }
      } else if (i === 2) {
        VZ.txt(dia, cx, cy + 118, "磁铁上下移动 → 环里被拧出感应电流", { size: 11.5, fill: C.ink2, anchor: "middle" });
        var loop = VZ.ellipse ? null : null;
        VZ.circ(dia, cx, cy + 20, 55, { stroke: C.gold, "stroke-width": 2.4 });
        var mag = VZ.g(dia);
        VZ.card(mag, -26, -60, 52, 26, { stroke: C.green, fill: "rgba(94,224,138,.1)" });
        VZ.card(mag, -26, -34, 52, 26, { stroke: C.red, fill: "rgba(255,122,122,.1)" });
        VZ.txt(mag, 0, -43, "N", { size: 12, fill: C.green, anchor: "middle", weight: 700 });
        VZ.txt(mag, 0, -17, "S", { size: 12, fill: C.red, anchor: "middle", weight: 700 });
        var arrow = VZ.path(dia, "", VZ.stroke({ stroke: C.gold, "stroke-width": 2 }));
        VZ.raf(svg, function (t) {
          var dy = 55 * Math.sin(t * 1.6);
          mag.setAttribute("transform", "translate(" + cx + " " + (cy - 60 + dy) + ")");
          var v = Math.cos(t * 1.6);
          var a0 = t * (v > 0 ? 2.2 : -2.2);
          var d = "";
          for (var s = 0; s <= 24; s++) {
            var a = a0 + s / 24 * 2.4;
            d += (s ? "L" : "M") + (cx + 55 * Math.cos(a)).toFixed(1) + " " + (cy + 20 + 55 * Math.sin(a)).toFixed(1);
          }
          arrow.setAttribute("d", d);
          arrow.setAttribute("opacity", Math.abs(v) * .9);
        });
      } else {
        VZ.txt(dia, cx, cy + 118, "导线电流 + 板间变化的 E：两者都拧出磁场", { size: 11.5, fill: C.ink2, anchor: "middle" });
        VZ.ln(dia, cx - 110, cy, cx - 40, cy, VZ.stroke({ stroke: C.ink, "stroke-width": 2.4 }));
        VZ.ln(dia, cx + 40, cy, cx + 110, cy, VZ.stroke({ stroke: C.ink, "stroke-width": 2.4 }));
        VZ.ln(dia, cx - 40, cy - 34, cx - 40, cy + 34, VZ.stroke({ stroke: C.gold, "stroke-width": 4 }));
        VZ.ln(dia, cx + 40, cy - 34, cx + 40, cy + 34, VZ.stroke({ stroke: C.gold, "stroke-width": 4 }));
        VZ.txt(dia, cx - 48, cy - 42, "＋", { size: 12, fill: C.gold, anchor: "end" });
        VZ.txt(dia, cx + 48, cy - 42, "−", { size: 12, fill: C.gold });
        VZ.txt(dia, cx, cy + 52, "E", { size: 13, fill: C.gold, anchor: "middle", weight: 700 });
        VZ.circ(dia, cx - 150, cy, 22, { stroke: C.mag, "stroke-width": 1.4, "stroke-dasharray": "4 4" });
        VZ.circ(dia, cx + 150, cy, 22, { stroke: C.mag, "stroke-width": 1.4, "stroke-dasharray": "4 4" });
        VZ.txt(dia, cx - 150, cy + 36, "B", { size: 12, fill: C.mag, anchor: "middle", weight: 700 });
        VZ.txt(dia, cx + 150, cy + 36, "B", { size: 12, fill: C.mag, anchor: "middle", weight: 700 });
        VZ.travel(dia.ownerSVGElement || svg, "M" + (cx - 110) + " " + cy + "H" + (cx - 44), { color: C.cyan, dur: 1.4, count: 2, r: 3.5 });
        VZ.travel(dia.ownerSVGElement || svg, "M" + (cx + 44) + " " + cy + "H" + (cx + 110), { color: C.cyan, dur: 1.4, count: 2, r: 3.5 });
      }
    }
    pick(0);
  }
},

/* ==========================================================
   ch19 · 连续性方程：流出的 = 减少的
   ========================================================== */
"f-ch19f": {
  title: "",
  hint: "虚线框是一个『控制区』，里面数粒子。调<b>入流</b>和<b>出流</b>两个旋钮：账本永远成立——<b>流入 − 流出 = 区内粒子的增加率</b>。这就是连续性方程 ∂ρ/∂t + ∇·j = 0 的全部内容：荷不会凭空出现或消失。",
  draw: function (stage) {
    var svg = VZ.S(stage, 760, 250, {});
    var C = VZ.C;
    var sIn = VZ.slider(stage, { label: "入流 λ（个/秒）", value: 4, min: 0, max: 10, step: 0.5, format: function (v) { return v.toFixed(1); }, onInput: function () {} });
    var sOut = VZ.slider(stage, { label: "出流率 μ（每粒子每秒）", value: 0.35, min: 0.05, max: 1.2, step: 0.05, format: function (v) { return v.toFixed(2); }, onInput: function () {} });
    var out = VZ.panel(stage, { "区内 N": "", "流入 − 流出": "", "N 的变化率": "" });

    var bx0 = 260, bx1 = 560, by0 = 44, by1 = 214;
    VZ.el("rect", { x: bx0, y: by0, width: bx1 - bx0, height: by1 - by0, fill: "rgba(255,255,255,.03)", stroke: C.faint, "stroke-width": 1.2, "stroke-dasharray": "6 5" }, svg);
    VZ.txt(svg, (bx0 + bx1) / 2, by1 + 20, "控制区（数粒子）", { size: 11.5, fill: C.dim, anchor: "middle" });
    VZ.txt(svg, bx0 - 12, (by0 + by1) / 2, "→ 入口", { size: 11, fill: C.green, anchor: "end" });
    VZ.txt(svg, bx1 + 12, (by0 + by1) / 2, "出口 →", { size: 11, fill: C.red });
    var dotsG = VZ.g(svg);
    var dots = [], acc = 0;
    VZ.raf(svg, function (t, ms) {
      var dt = Math.min(ms, 60) / 1000;
      var lam = parseFloat(sIn.input.value), mu = parseFloat(sOut.input.value);
      acc += lam * dt;
      while (acc >= 1) {
        acc -= 1;
        if (dots.length < 80) dots.push({ x: bx0 + 6, y: by0 + 8 + Math.random() * (by1 - by0 - 16), el: null });
      }
      /* 出流：按 μ 每粒子每秒随机离开 */
      for (var i = dots.length - 1; i >= 0; i--) {
        if (Math.random() < mu * dt) { dots.splice(i, 1); continue; }
        dots[i].x += 26 * dt;
        if (dots[i].x > bx1 - 6) { dots.splice(i, 1); }
      }
      dotsG.innerHTML = "";
      dots.forEach(function (p) {
        VZ.circ(dotsG, p.x, p.y, 3.2, { fill: C.cyan, opacity: .85 });
      });
      var N = dots.length;
      var outflow = mu * N;
      var dn = lam - outflow;
      VZ.setPanel(out, {
        "区内 N": String(N),
        "流入 − 流出": lam.toFixed(1) + " − " + outflow.toFixed(1) + " = " + dn.toFixed(1) + " 个/秒",
        "N 的变化率": Math.abs(dn) < 1 ? "≈ 0（账本平衡）" : (dn > 0 ? "在增加" : "在减少")
      });
    });
  }
},

/* ==========================================================
   ch19 · 宇宙学常数 Λ
   ========================================================== */
"f-ch19g": {
  title: "",
  hint: "在爱因斯坦方程里加一项 Λ，宇宙的命运就变了。拖滑块：<b>Λ &gt; 0</b> 膨胀越滚越快（加速），<b>Λ = 0</b> 匀速滑行，<b>Λ &lt; 0</b> 膨胀被拉停、转身坍缩。1998 年观测发现我们的宇宙真的在加速——Λ 回来了。",
  draw: function (stage) {
    var svg = VZ.S(stage, 760, 260, {});
    var C = VZ.C;
    var slider = VZ.slider(stage, { label: "宇宙学常数 Λ", value: 0.6, min: -1, max: 2, step: 0.05, format: function (v) { return v.toFixed(2); }, onInput: function () { redraw(); } });
    var out = VZ.panel(stage, { "现在的膨胀": "", "趋势": "" });

    var cx0 = 70, cx1 = 400, cy0 = 40, cy1 = 216;
    VZ.ln(svg, cx0, cy1, cx1, cy1, VZ.stroke({ stroke: C.ink2, "stroke-width": 1.2 }));
    VZ.ln(svg, cx0, cy0, cx0, cy1, VZ.stroke({ stroke: C.ink2, "stroke-width": 1.2 }));
    VZ.txt(svg, cx1 - 4, cy1 + 18, "t →", { size: 11, fill: C.dim, anchor: "end" });
    VZ.txt(svg, cx0 - 8, cy0 + 8, "a(t)", { size: 11, fill: C.dim });
    VZ.txt(svg, cx0, cy1 + 18, "0", { size: 10, fill: C.dim });

    var curve = VZ.path(svg, "", VZ.stroke({ stroke: C.gold, "stroke-width": 2.2 }));
    var dot = VZ.circ(svg, 0, 0, 5.5, { fill: C.cyan });
    var uniG = VZ.g(svg);
    var uni = VZ.circ(uniG, 0, 0, 24, { stroke: C.cyan, "stroke-width": 1.6, fill: "rgba(79,227,240,.06)" });
    var uniT = VZ.txt(uniG, 0, 0, "宇宙", { size: 11, fill: C.cyan, anchor: "middle" });
    VZ.txt(svg, 575, 60, "一个正在演化的小宇宙", { size: 12, fill: C.ink2, anchor: "middle" });

    function solve(Lam) {
      var pts = [], a = 0.35, ad = 0.16, dt = 0.012;
      for (var t = 0; t <= 10; t += dt) {
        pts.push([t, a]);
        ad += (Lam / 3) * a * dt;
        a += ad * dt;
        if (a < 0.03) break;
        if (a > 3.4) break;
      }
      return pts;
    }
    var pts = [], ti = 0;
    function redraw() {
      var L = parseFloat(slider.input.value);
      pts = solve(L);
      var d = "";
      pts.forEach(function (p, i) {
        var px = cx0 + p[0] / 10 * (cx1 - cx0);
        var py = cy1 - VZ.clamp(p[1], 0, 3.2) / 3.2 * (cy1 - cy0);
        d += (i ? "L" : "M") + px.toFixed(1) + " " + py.toFixed(1);
      });
      curve.setAttribute("d", d);
      curve.setAttribute("stroke", L < -0.02 ? C.red : L > 0.02 ? C.gold : C.cyan);
      ti = 0;
    }
    VZ.raf(svg, function (t) {
      if (!pts.length) return;
      ti = (ti + 0.9 / 60) % 1;
      var idx = Math.floor(ti * (pts.length - 1));
      var p = pts[idx];
      dot.setAttribute("cx", cx0 + p[0] / 10 * (cx1 - cx0));
      dot.setAttribute("cy", cy1 - VZ.clamp(p[1], 0, 3.2) / 3.2 * (cy1 - cy0));
      uni.setAttribute("r", 10 + 26 * VZ.clamp(p[1], 0.05, 2.4) / 2.4);
      uniG.setAttribute("transform", "translate(575 150)");
      var adot = idx > 0 ? (p[1] - pts[idx - 1][1]) / 0.012 : 0;
      var L = parseFloat(slider.input.value);
      var trend = L > 0.02 ? "加速膨胀（越滚越快）" : L < -0.02 ? (adot > 0 ? "被拖慢的膨胀" : "转身坍缩") : "匀速滑行";
      VZ.setPanel(out, { "现在的膨胀": (adot >= 0 ? "膨胀中" : "收缩中"), "趋势": trend });
    });
    redraw();
  }
},

/* ==========================================================
   ch20 · 拉格朗日量 L = T − V 的此消彼长
   ========================================================== */
"f-ch20d": {
  title: "",
  hint: "碗里的球来回滚动（<b>拖它</b>可以改变振幅）。右边三根柱子实时记账：<b>V</b> 是势能（位置），<b>T</b> 是动能（速度），而拉格朗日量是<b>两者之差 L = T − V</b>——它一会儿正一会儿负，却决定着整条轨迹。",
  draw: function (stage) {
    var svg = VZ.S(stage, 760, 270, {});
    var C = VZ.C;
    var out = VZ.panel(stage, { "x": "", "V（势）": "", "T（动）": "", "L = T − V": "" });

    var ox = 200, oy = 200, sx = 70;   /* V = ½x²，x∈[−2,2] */
    VZ.ln(svg, ox - 165, oy, ox + 165, oy, VZ.stroke({ stroke: C.ink2, "stroke-width": 1.2 }));
    /* 势能曲线 */
    var d = "";
    for (var i = 0; i <= 60; i++) {
      var x = -2 + 4 * i / 60;
      var py = oy - 0.5 * x * x * 46;
      d += (i ? "L" : "M") + (ox + x * sx).toFixed(1) + " " + py.toFixed(1);
    }
    VZ.path(svg, d, VZ.stroke({ stroke: C.faint, "stroke-width": 1.6, opacity: .9 }));
    VZ.txt(svg, ox, oy + 24, "势能碗 V = ½x²（拖球改变振幅）", { size: 11.5, fill: C.dim, anchor: "middle" });
    var ball = VZ.circ(svg, ox, oy - 46, 9, { fill: C.gold });
    VZ.ln(svg, ox, oy, ox, oy - 46, { stroke: C.faint, "stroke-width": .8, "stroke-dasharray": "3 4" });

    /* 三根柱子 */
    var bx = 470, bw = 56, gap = 40, base = 236, scale = 78;
    var labels = [["V", C.cyan], ["T", C.gold], ["L", C.mag]];
    var bars = labels.map(function (lb, i) {
      var x = bx + i * (bw + gap);
      VZ.ln(svg, x - 8, base, x + bw + 8, base, { stroke: C.faint, "stroke-width": 1 });
      VZ.txt(svg, x + bw / 2, base + 20, lb[0], { size: 13, fill: lb[1], anchor: "middle", weight: 700 });
      return VZ.el("rect", { x: x, y: base, width: bw, height: 0, fill: lb[1], opacity: .8, rx: 4 }, svg);
    });
    var zeroLine = VZ.ln(svg, bx - 10, base - 39, bx + 3 * bw + 2 * gap + 10, base - 39, { stroke: C.dim, "stroke-width": .8, "stroke-dasharray": "3 4" });
    VZ.txt(svg, bx - 16, base - 36, "0", { size: 10, fill: C.dim, anchor: "end" });

    var A = 1.4, t0 = null, dragging = false;
    VZ.drag(svg, svg, 760, 270, function (x, y, phase) {
      if (phase === "start" && Math.hypot(x - +ball.getAttribute("cx"), y - +ball.getAttribute("cy")) > 44) return;
      dragging = phase !== "end";
      if (dragging) {
        var xu = VZ.clamp((x - ox) / sx, -2, 2);
        A = Math.max(0.2, Math.abs(xu));
        t0 = null;
        setBall(xu);
      }
    });
    function setBall(xu) {
      ball.setAttribute("cx", ox + xu * sx);
      ball.setAttribute("cy", oy - 0.5 * xu * xu * 46);
    }
    function barsFor(xu) {
      var V = 0.5 * xu * xu, v = Math.sqrt(Math.max(2 * (A * A / 2 - V), 0));
      var T = 0.5 * v * v;
      var L = T - V;
      var cap = base - 86;
      function setBar(b, h, neg) {
        h = Math.min(h, cap);
        b.setAttribute("height", h);
        b.setAttribute("y", base - h);
        b.setAttribute("opacity", neg ? .4 : .8);
      }
      setBar(bars[0], V * scale, false);
      setBar(bars[1], T * scale, false);
      setBar(bars[2], Math.abs(L) * scale, L < 0);
      VZ.setPanel(out, { "x": xu.toFixed(2), "V（势）": V.toFixed(2), "T（动）": T.toFixed(2), "L = T − V": L.toFixed(2) });
      return xu;
    }
    VZ.raf(svg, function (t) {
      if (dragging) return;
      if (t0 === null) t0 = t - Math.acos(VZ.clamp(+ball.getAttribute("cx") - ox, -1, 1) / sx / (A || 1)) / 1.6;
      var xu = A * Math.cos(1.6 * (t - t0));
      setBall(xu);
      barsFor(xu);
    });
    barsFor(A);
  }
},

/* ==========================================================
   ch20 · 勒让德变换：L ↔ H，斜率换坐标
   ========================================================== */
"f-ch20e": {
  title: "",
  hint: "勒让德变换是<b>换一套记账坐标</b>：左图 L(v) 曲线上某点的切线斜率 p = dL/dv，恰好成为右图 H(p) 曲线的横坐标；而切线的截距给出 −H。拖滑块移动切点——p 和 H 由 L 唯一决定，速度语言换成了动量语言。",
  draw: function (stage) {
    var svg = VZ.S(stage, 760, 250, {});
    var C = VZ.C;
    var slider = VZ.slider(stage, { label: "切点位置 v", value: 1.1, min: -2, max: 2, step: 0.01, format: function (v) { return v.toFixed(2); }, onInput: function () { redraw(); } });
    var out = VZ.panel(stage, { "p = dL/dv": "", "L(v)": "", "H(p) = pv − L": "" });

    function drawCurve(ox, oy, s, fun, col, xlabel) {
      var d = "";
      for (var i = 0; i <= 60; i++) {
        var u = -2 + 4 * i / 60;
        d += (i ? "L" : "M") + (ox + u * s).toFixed(1) + " " + (oy - fun(u) * s).toFixed(1);
      }
      VZ.path(svg, d, VZ.stroke({ stroke: col, "stroke-width": 2 }));
      VZ.ln(svg, ox - 165, oy, ox + 165, oy, VZ.stroke({ stroke: C.faint, "stroke-width": 1 }));
      VZ.ln(svg, ox, oy - 130, ox, oy + 24, VZ.stroke({ stroke: C.faint, "stroke-width": 1 }));
      VZ.txt(svg, ox + 155, oy + 18, xlabel, { size: 11.5, fill: C.dim });
    }
    VZ.txt(svg, 190, 30, "L(v) = ½v²（速度语言）", { size: 13, fill: C.cyan, anchor: "middle", weight: 700 });
    VZ.txt(svg, 570, 30, "H(p) = ½p²（动量语言）", { size: 13, fill: C.mag, anchor: "middle", weight: 700 });
    drawCurve(190, 175, 55, function (u) { return 0.5 * u * u; }, C.cyan, "v");
    drawCurve(570, 175, 55, function (u) { return 0.5 * u * u; }, C.mag, "p");

    var ptL = VZ.circ(svg, 0, 0, 6, { fill: C.gold });
    var tanL = VZ.path(svg, "", VZ.stroke({ stroke: C.gold, "stroke-width": 1.3, "stroke-dasharray": "5 4", opacity: .85 }));
    var ptR = VZ.circ(svg, 0, 0, 6, { fill: C.gold });
    var ptH = VZ.circ(svg, 0, 0, 6, { fill: C.gold, opacity: .9 });
    var vlbl = VZ.txt(svg, 0, 0, "v", { size: 12, fill: C.gold, weight: 700 });
    var plbl = VZ.txt(svg, 0, 0, "p", { size: 12, fill: C.gold, weight: 700 });

    function redraw() {
      var v = parseFloat(slider.input.value);
      var L = 0.5 * v * v, p = v;   /* dL/dv = v */
      var H = p * v - L;            /* = ½v² */
      var ox1 = 190, oy1 = 175, s = 55;
      ptL.setAttribute("cx", ox1 + v * s); ptL.setAttribute("cy", oy1 - L * s);
      vlbl.setAttribute("x", ox1 + v * s); vlbl.setAttribute("y", oy1 - L * s - 10);
      /* 切线：过切点，斜率 p（图上 y 向上为 L 正方向） */
      tanL.setAttribute("d", "M" + (ox1 + (v - 1.4) * s).toFixed(1) + " " + (oy1 - (L - p * 1.4) * s).toFixed(1) +
        "L" + (ox1 + (v + 1.4) * s).toFixed(1) + " " + (oy1 - (L + p * 1.4) * s).toFixed(1));
      ptR.setAttribute("cx", 570 + p * s); ptR.setAttribute("cy", 175);
      plbl.setAttribute("x", 570 + p * s); plbl.setAttribute("y", 168);
      ptH.setAttribute("cx", 570 + p * s); ptH.setAttribute("cy", 175 - H * s);
      VZ.setPanel(out, { "p = dL/dv": p.toFixed(2), "L(v)": L.toFixed(2), "H(p) = pv − L": H.toFixed(2) });
    }
    redraw();
  }
},

/* ==========================================================
   ch20 · 简正模式：两个耦合摆
   ========================================================== */
"f-ch20f": {
  title: "",
  hint: "两个摆由一根弹簧耦合。切到<b>同相</b>：一起摆，弹簧不伸缩，频率低；切到<b>反相</b>：弹簧被反复拉伸压缩，等于多了刚度，频率更高。任何复杂晃动都是这两种<b>简正模式</b>的叠加——这就是『小振动』的全部秘密。",
  draw: function (stage) {
    var svg = VZ.S(stage, 760, 260, {});
    var C = VZ.C;
    var ctl = VZ.box(stage, "viz-chips");
    var out = VZ.panel(stage, { "频率（相对）": "", "弹簧": "" });
    var host = document.createElement("div");
    VZ.chips(ctl, ["同相模式", "反相模式", "拍（两种叠加）"], "同相模式", function (m) { render(m); });

    var pivx = [280, 420], pivy = 52, len = 118, modes = null;
    var b1 = VZ.circ(svg, 0, 0, 10, { fill: C.cyan });
    var b2 = VZ.circ(svg, 0, 0, 10, { fill: C.gold });
    var arm1 = VZ.ln(svg, 0, 0, 0, 0, VZ.stroke({ stroke: C.ink2, "stroke-width": 1.6 }));
    var arm2 = VZ.ln(svg, 0, 0, 0, 0, VZ.stroke({ stroke: C.ink2, "stroke-width": 1.6 }));
    VZ.ln(svg, pivx[0] - 40, pivy - 14, pivx[0] + 40, pivy - 14, VZ.stroke({ stroke: C.ink, "stroke-width": 2.4 }));
    VZ.ln(svg, pivx[1] - 40, pivy - 14, pivx[1] + 40, pivy - 14, VZ.stroke({ stroke: C.ink, "stroke-width": 2.4 }));
    var spring = VZ.path(svg, "", VZ.stroke({ stroke: C.mag, "stroke-width": 1.6 }));
    var noteT = VZ.txt(svg, 350, 248, "", { size: 12.5, fill: C.ink2, anchor: "middle" });
    VZ.circ(svg, pivx[0], pivy, 3.5, { fill: C.ink });
    VZ.circ(svg, pivx[1], pivy, 3.5, { fill: C.ink });

    function render(m) {
      if (m === "同相模式") { modes = [1.0, 1.0, 1.0]; noteT.textContent = "同相：弹簧不伸缩 → 频率 ω（低）"; VZ.setPanel(out, { "频率（相对）": "ω = 1.00", "弹簧": "始终不伸缩" }); }
      else if (m === "反相模式") { modes = [-1.0, 1.0, 1.414]; noteT.textContent = "反相：弹簧反复拉压 → 频率更高 √2·ω"; VZ.setPanel(out, { "频率（相对）": "ω = 1.41", "弹簧": "拉伸 ↔ 压缩" }); }
      else { modes = [0, 0, 0]; noteT.textContent = "拍：两个频率接近的模式叠加，能量在两摆之间来回倒"; VZ.setPanel(out, { "频率（相对）": "ω₁=1.00 / ω₂=1.15", "弹簧": "缓慢吞吐能量" }); }
    }
    render("同相模式");
    VZ.raf(svg, function (t) {
      var th1, th2, A = 0.45;
      if (!modes) return;
      if (modes[2] === 1) { th1 = A * Math.cos(t * 1.8); th2 = modes[0] * A * Math.cos(t * 1.8); }
      else if (modes[2] === 1.414) { th1 = A * Math.cos(t * 1.8); th2 = -th1; }
      else { th1 = A * Math.cos(t * 1.8); th2 = A * Math.cos(t * 2.07); }
      var x1 = pivx[0] + len * Math.sin(th1), y1 = pivy + len * Math.cos(th1);
      var x2 = pivx[1] + len * Math.sin(th2), y2 = pivy + len * Math.cos(th2);
      arm1.setAttribute("x2", x1); arm1.setAttribute("y2", y1);
      arm2.setAttribute("x2", x2); arm2.setAttribute("y2", y2);
      b1.setAttribute("cx", x1); b1.setAttribute("cy", y1);
      b2.setAttribute("cx", x2); b2.setAttribute("cy", y2);
      /* 弹簧：锯齿线 */
      var n = 8, d = "M" + (x1 + 10) + " " + y1;
      for (var i = 1; i < n; i++) {
        var u = i / n;
        d += "L" + (x1 + 10 + (x2 - x1 - 20) * u).toFixed(1) + " " + (y1 + (i % 2 ? 9 : -9)).toFixed(1);
      }
      d += "L" + (x2 - 10) + " " + y2;
      spring.setAttribute("d", d);
      var stretch = Math.abs(x2 - x1 - (pivx[1] - pivx[0]));
      spring.setAttribute("opacity", modes && modes[2] === 1 ? .25 : .95);
    });
  }
},

/* ==========================================================
   ch20 · 为什么现代物理都写作用量：对称性 ↔ 守恒律
   ========================================================== */
"f-ch20g": {
  title: "",
  hint: "现代物理从作用量出发，是因为它把<b>对称性直接兑换成守恒律</b>（诺特定理）。点击左边任意一条对应：平移时间的理论能量守恒；平移空间动量守恒；转一转角动量守恒；换个相位电荷守恒。改理论 = 改对称性清单，守恒律自动跟着改。",
  draw: function (stage) {
    var svg = VZ.S(stage, 760, 290, {});
    var C = VZ.C;
    var rows = [
      { sym: "时间平移不变", law: "能量守恒", c: C.gold },
      { sym: "空间平移不变", law: "动量守恒", c: C.cyan },
      { sym: "空间旋转不变", law: "角动量守恒", c: C.green },
      { sym: "相位（规范）不变", law: "电荷守恒", c: C.mag }
    ];
    var cards = [], dia = VZ.g(svg);
    rows.forEach(function (r, i) {
      var y = 22 + i * 62;
      var cg = VZ.g(svg, { style: "cursor:pointer" });
      VZ.card(cg, 20, y, 296, 52, { stroke: C.faint, fill: "rgba(255,255,255,.03)" });
      VZ.txt(cg, 36, y + 22, r.sym, { size: 13, fill: r.c, weight: 700 });
      VZ.txt(cg, 36, y + 42, "⇒ " + r.law, { size: 12.5, fill: C.ink });
      cg.addEventListener("click", function () { pick(i); });
      cards.push(cg);
    });
    VZ.txt(svg, 20, 282, "点击一条对称性 ↴", { size: 11, fill: C.dim });
    var arrow = VZ.path(svg, "M330 145h30", VZ.stroke({ stroke: C.dim, "stroke-width": 1.4, "stroke-dasharray": "4 4" }));
    VZ.path(svg, "M360 145l-8 -4v8z", { fill: C.dim });

    function pick(i) {
      cards.forEach(function (cg, j) {
        cg.querySelector("rect").setAttribute("stroke", j === i ? rows[j].c : C.faint);
        cg.querySelector("rect").setAttribute("fill", j === i ? "rgba(255,255,255,.08)" : "rgba(255,255,255,.03)");
      });
      dia.innerHTML = "";
      var cx = 555, cy = 140;
      if (i === 0) {
        VZ.txt(dia, cx, 44, "今天关灯做实验 = 明天再做一遍", { size: 11.5, fill: C.ink2, anchor: "middle" });
        var p1 = VZ.circ(dia, cx, cy, 26, { stroke: C.gold, "stroke-width": 2 });
        var b = VZ.circ(dia, 0, 0, 5, { fill: C.gold });
        var E1 = VZ.txt(dia, cx, cy + 66, "", { size: 13, fill: C.gold, anchor: "middle", weight: 700 });
        VZ.raf(svg, function (t) {
          var a = t * 2;
          b.setAttribute("cx", cx + 26 * Math.cos(a)); b.setAttribute("cy", cy + 26 * Math.sin(a));
          E1.textContent = "E = " + (0.5 * 26 * 26).toFixed(0) + "（恒定，跟 t 无关）";
        });
      } else if (i === 1) {
        VZ.txt(dia, cx, 44, "换个地方做实验，结果一样", { size: 11.5, fill: C.ink2, anchor: "middle" });
        var r1 = VZ.circ(dia, cx - 60, cy, 10, { fill: C.cyan });
        var r2 = VZ.circ(dia, cx + 60, cy, 10, { fill: C.gold });
        var P = VZ.txt(dia, cx, cy + 66, "", { size: 13, fill: C.cyan, anchor: "middle", weight: 700 });
        var v1 = 60, v2 = -60;
        VZ.raf(svg, function (t, ms) {
          var dt = Math.min(ms, 60) / 1000;
          [r1, r2].forEach(function (r, k) {
            var v = k ? v2 : v1;
            var nx = +r.getAttribute("cx") + v * dt;
            if (nx > cx + 110 || nx < cx - 110) { r.setAttribute("cx", k ? cx + 110 : cx - 110); }
            else r.setAttribute("cx", nx);
          });
          P.textContent = "p总 = +" + (v1 / 10).toFixed(0) + " + " + (v2 / 10).toFixed(0) + " = 0（恒定）";
        });
      } else if (i === 2) {
        VZ.txt(dia, cx, 44, "转过 90° 再看，物理一样", { size: 11.5, fill: C.ink2, anchor: "middle" });
        var orb = VZ.circ(dia, cx, cy, 46, { stroke: C.faint, "stroke-width": 1, "stroke-dasharray": "4 4" });
        var s1 = VZ.circ(dia, 0, 0, 5, { fill: C.green });
        var s2 = VZ.circ(dia, 0, 0, 5, { fill: C.green, opacity: .4 });
        var L = VZ.txt(dia, cx, cy + 66, "", { size: 13, fill: C.green, anchor: "middle", weight: 700 });
        VZ.raf(svg, function (t) {
          var a = t * 1.6;
          s1.setAttribute("cx", cx + 46 * Math.cos(a)); s1.setAttribute("cy", cy + 46 * Math.sin(a));
          s2.setAttribute("cx", cx + 46 * Math.cos(a + Math.PI / 2)); s2.setAttribute("cy", cy + 46 * Math.sin(a + Math.PI / 2));
          L.textContent = "L = m·r·v = " + (46 * 1.6).toFixed(0) + "（旋转下不变）";
        });
      } else {
        VZ.txt(dia, cx, 44, "波函数乘个相位 e^{iθ}，观测不变", { size: 11.5, fill: C.ink2, anchor: "middle" });
        var net = VZ.txt(dia, cx, cy + 66, "", { size: 13, fill: C.mag, anchor: "middle", weight: 700 });
        var g1 = VZ.circ(dia, cx - 46, cy, 9, { fill: C.cyan });
        var g2 = VZ.circ(dia, cx + 46, cy, 9, { fill: C.red });
        VZ.txt(dia, cx - 46, cy + 4, "−", { size: 13, fill: C.deep, anchor: "middle", weight: 700 });
        VZ.txt(dia, cx + 46, cy + 4, "+", { size: 13, fill: C.deep, anchor: "middle", weight: 700 });
        var ring1 = VZ.circ(dia, cx - 46, cy, 14, { stroke: C.mag, fill: "none", "stroke-width": 1 });
        var ring2 = VZ.circ(dia, cx + 46, cy, 14, { stroke: C.mag, fill: "none", "stroke-width": 1 });
        VZ.raf(svg, function (t) {
          ring1.setAttribute("r", 12 + 4 * Math.sin(t * 3));
          ring2.setAttribute("r", 12 + 4 * Math.cos(t * 3));
          net.textContent = "Q净 = (+1) + (−1) = 0（相位变，Q 不变）";
        });
      }
    }
    pick(0);
  }
}

});
