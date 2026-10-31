/* viz-part3.js — 第二批新图（ch8–ch12，每章 2 张） */
VZ.define({

/* ==========================================================
   ch8-b · 球极投影：拖球面上的点，看平面落点（北极→∞）
   ========================================================== */
"f-ch08b": {
  title: "球极投影：从北极把球面「拍平」成一张平面",
  hint: "<b>拖动球面上的亮点</b>（沿球面移动），看投影线如何始终从北极出发、穿过这一点落到赤道平面上。把点拖近北极：平面落点会一路冲出画布——这就是<span class='hl'>北极对应「无穷远点」</span>；拖到南极，落点正好回到原点。读数里 |OQ|/R 就是落点到原点的距离（以球半径为单位）。",
  draw: function (stage) {
    var W = 760, H = 340, svg = VZ.S(stage, W, H, { grid: true });
    var C = VZ.C;
    var cx = 175, cy = 190, R = 108;
    var NX = cx, NY = cy - R;

    /* 球面轮廓与经纬参考 */
    VZ.circ(svg, cx, cy, R, VZ.stroke({ stroke: C.ink, "stroke-width": 2 }));
    VZ.path(svg, "M" + (cx - R) + " " + cy + "A" + R + " " + (R * 0.30) + " 0 0 0 " + (cx + R) + " " + cy,
      VZ.stroke({ stroke: C.faint, "stroke-width": 1 }));
    VZ.path(svg, "M" + (cx - R) + " " + cy + "A" + R + " " + (R * 0.30) + " 0 0 1 " + (cx + R) + " " + cy,
      VZ.stroke({ stroke: C.ink2, "stroke-width": 1, "stroke-dasharray": "4 4", opacity: .6 }));
    [0.5].forEach(function (f) {
      var rr = R * Math.sqrt(1 - f * f);
      VZ.path(svg, "M" + (cx - rr) + " " + (cy - R * f) + "A" + rr + " " + (rr * 0.30) + " 0 0 0 " + (cx + rr) + " " + (cy - R * f),
        VZ.stroke({ stroke: C.faint, "stroke-width": .9 }));
    });
    /* 平面：过球心的赤道平面（侧视图为一条线） */
    VZ.ln(svg, 330, cy, 745, cy, VZ.stroke({ stroke: C.ink2, "stroke-width": 1.6 }));
    for (var k = 1; k <= 4; k++) {
      VZ.ln(svg, cx + k * R, cy - 4, cx + k * R, cy + 4, VZ.stroke({ stroke: C.faint, "stroke-width": 1 }));
      VZ.txt(svg, cx + k * R, cy + 18, k + "R", { size: 10, fill: C.dim, anchor: "middle" });
    }
    VZ.txt(svg, 745, cy - 10, "赤道平面 z = 0", { size: 11.5, fill: C.ink2, anchor: "end" });
    VZ.txt(svg, cx, NY - 14, "北极 N（投影原点）", { size: 11.5, fill: C.gold, anchor: "middle" });
    VZ.circ(svg, NX, NY, 4, { fill: C.gold });
    VZ.txt(svg, cx - R - 6, cy + 30, "南极", { size: 10.5, fill: C.dim, anchor: "middle" });

    var out = VZ.panel(stage, { "纬度角 φ（离北极）": "—", "平面落点 |OQ| / R": "—", "状态": "" });

    /* 动态元素：投影线、球面点、平面落点 */
    var ray = VZ.ln(svg, NX, NY, NX, NY, VZ.stroke({ stroke: C.gold, "stroke-width": 1.3, opacity: .8 }));
    var pDot = VZ.circ(svg, cx, cy, 8, { fill: C.cyan, stroke: C.deep, "stroke-width": 2, style: "cursor:grab" });
    var pGlow = VZ.circ(svg, cx, cy, 14, { fill: C.cyan, opacity: .25 });
    var qDot = VZ.circ(svg, 0, 0, 6, { fill: C.mag });
    var qGlow = VZ.circ(svg, 0, 0, 12, { fill: C.mag, opacity: .25 });
    var infTxt = VZ.txt(svg, 742, cy - 34, "→ ∞", { size: 20, fill: C.mag, anchor: "end", weight: 700 });
    infTxt.setAttribute("opacity", 0);
    var qLbl = VZ.txt(svg, 0, 0, "Q", { size: 13, fill: C.mag, anchor: "middle", weight: 700 });

    var phi = 1.05, side = 1;   /* phi：离北极的极角 */
    function place() {
      var px = cx + side * R * Math.sin(phi), py = cy - R * Math.cos(phi);
      var d = R / Math.tan(phi / 2);
      var qx = cx + side * d, over = false;
      if (Math.abs(d) > 400) { over = true; qx = cx + side * 400; }
      ray.setAttribute("x2", qx); ray.setAttribute("y2", cy);
      pDot.setAttribute("cx", px); pDot.setAttribute("cy", py);
      pGlow.setAttribute("cx", px); pGlow.setAttribute("cy", py);
      qDot.setAttribute("cx", qx); qDot.setAttribute("cy", cy);
      qGlow.setAttribute("cx", qx); qGlow.setAttribute("cy", cy);
      qLbl.setAttribute("x", qx); qLbl.setAttribute("y", cy - 12);
      infTxt.setAttribute("opacity", over ? 1 : 0);
      qDot.setAttribute("opacity", over ? 0 : 1);
      qGlow.setAttribute("opacity", over ? 0 : .25);
      qLbl.setAttribute("opacity", over ? 0 : 1);
      VZ.setPanel(out, {
        "纬度角 φ（离北极）": (phi * 180 / Math.PI).toFixed(1) + "°",
        "平面落点 |OQ| / R": over ? "→ ∞（超出画布）" : (1 / Math.tan(phi / 2)).toFixed(3),
        "状态": over ? "接近北极：落点奔向无穷远" : (phi > 2.6 ? "接近南极：落点回到原点" : "拖动亮点试试")
      });
    }
    VZ.drag(svg, pDot, W, H, function (x, y, phase) {
      if (phase === "end") return;
      var dx = x - cx, dy = y - cy;
      var len = Math.max(Math.hypot(dx, dy), 12);
      phi = VZ.clamp(Math.acos(VZ.clamp(-dy / len, -1, 1)), 0.045, Math.PI - 0.02);
      if (Math.abs(dx) > 6) side = dx > 0 ? 1 : -1;
      place();
    });
    VZ.raf(svg, function (t) {
      var s = 0.6 + 0.4 * Math.sin(t * 3);
      pGlow.setAttribute("r", 12 + 4 * s);
      qGlow.setAttribute("r", 10 + 3 * s);
    });
    place();
  }
},

/* ==========================================================
   ch8-c · 亏格：捏一捏，马克杯连续形变成甜甜圈
   ========================================================== */
"f-ch08c": {
  title: "亏格：捏一捏，马克杯连续捏成甜甜圈",
  hint: "点<b>「捏一捏」</b>看连续形变全过程，或直接拖滑块。杯身慢慢鼓成环面，把手上的洞滑到正中央——全程既没撕开也没粘合，所以<span class='hl'>洞的个数始终是 1</span>。拓扑学只数洞、不管形状：亏格 g = 1 的东西都是同一样子。",
  draw: function (stage) {
    var W = 760, H = 330, svg = VZ.S(stage, W, H, { grid: true });
    var C = VZ.C;
    var cx = 380, cy = 178;

    /* 极角轮廓：t=0 马克杯（方杯身 + 把手鼓包），t=1 甜甜圈（椭圆环） */
    function rMug(th) {
      var co = Math.cos(th), si = Math.sin(th);
      var rw = 118 / Math.max(Math.abs(co), 1e-6), rh = 88 / Math.max(Math.abs(si), 1e-6);
      var r = Math.min(rw, rh);
      var d0 = Math.abs(Math.atan2(Math.sin(th), Math.cos(th)));  /* 到右侧把手方向的角距 */
      r += 62 * Math.exp(-(d0 * d0) / (2 * 0.30 * 0.30));
      return r;
    }
    function rTorus(th) {
      var rx = 150, ry = 100;
      return 1 / Math.sqrt(Math.pow(Math.cos(th) / rx, 2) + Math.pow(Math.sin(th) / ry, 2));
    }
    var body = VZ.path(svg, "", { fill: "rgba(155,140,255,.10)", stroke: C.ink, "stroke-width": 2, "fill-rule": "evenodd" });
    var hole = VZ.path(svg, "", { fill: C.deep, stroke: C.gold, "stroke-width": 1.8, "stroke-dasharray": "6 5" });
    var holeLbl = VZ.txt(svg, 0, 0, "洞 ×1", { size: 12, fill: C.gold, anchor: "middle", weight: 700 });
    var stateLbl = VZ.txt(svg, cx, 46, "", { size: 15, fill: C.violet, anchor: "middle", weight: 700 });

    function draw(t) {
      var e = VZ.ease(VZ.clamp(t, 0, 1));
      var pts = [];
      for (var i = 0; i <= 84; i++) {
        var th = i / 84 * 2 * Math.PI;
        var r = VZ.lerp(rMug(th), rTorus(th), e);
        var x = cx + r * Math.cos(th), y = cy + r * Math.sin(th);
        pts.push((i ? "L" : "M") + x.toFixed(1) + " " + y.toFixed(1));
      }
      body.setAttribute("d", pts.join("") + "Z");
      var hx = VZ.lerp(150, 0, e), hy = VZ.lerp(4, 0, e);
      var hrx = VZ.lerp(26, 62, e), hry = VZ.lerp(44, 30, e);
      hole.setAttribute("d", "M" + (cx + hx - hrx) + " " + (cy + hy) +
        "A" + hrx + " " + hry + " 0 1 0 " + (cx + hx + hrx) + " " + (cy + hy) +
        "A" + hrx + " " + hry + " 0 1 0 " + (cx + hx - hrx) + " " + (cy + hy) + "Z");
      holeLbl.setAttribute("x", cx + hx); holeLbl.setAttribute("y", cy + hy + 4);
      stateLbl.textContent = t < 0.08 ? "马克杯" : t > 0.92 ? "甜甜圈" : "连续形变中……（没有剪开，没有粘合）";
    }

    var out = VZ.panel(stage, { "形变进度 t": "0.00", "洞的个数（亏格）": "1（恒定）", "结论": "拓扑等价" });

    var t = 0, tween = null;
    var sl = VZ.slider(stage, { label: "形变进度 t", value: 0, min: 0, max: 1, step: 0.01,
      format: function (v) { return v.toFixed(2); },
      onInput: function (v) { tween = null; t = v; draw(t); VZ.setPanel(out, { "形变进度 t": t.toFixed(2) }); } });
    VZ.btn(stage, "捏一捏", function () {
      tween = { from: t, to: t < 0.5 ? 1 : 0, t0: performance.now(), dur: 1700 };
    });
    VZ.raf(svg, function (now) {
      if (!tween) return;
      var u = VZ.clamp((now - tween.t0) / tween.dur, 0, 1);
      t = VZ.lerp(tween.from, tween.to, VZ.ease(u));
      sl.set(parseFloat(t.toFixed(2)));
      draw(t);
      VZ.setPanel(out, { "形变进度 t": t.toFixed(2) });
      if (u >= 1) tween = null;
    });
    draw(0);
  }
},

/* ==========================================================
   ch9-b · 傅里叶合成：滑项数 1–15，逐级逼近方波
   ========================================================== */
"f-ch09b": {
  title: "傅里叶合成：一根一根推起方波的推子",
  hint: "<b>拖动滑块</b>把正弦推子从 1 根加到 15 根（只取奇次谐波，系数 4/π·1/n），看折线如何一步步贴上方波。注意跳变点旁那撮<b>始终压不下去的尖角</b>—— Gibbs 现象，过冲永远约 9%：<span class='hl'>有限项傅里叶级数可以无限逼近，但尖角不会消失</span>。",
  draw: function (stage) {
    var W = 760, H = 300, svg = VZ.S(stage, W, H, { grid: true });
    var C = VZ.C;
    var x0 = 60, x1 = 740, yc = 152, amp = 88;
    function X(u) { return x0 + (u / (4 * Math.PI)) * (x1 - x0); }   /* u ∈ [0, 4π]，两个周期 */
    function sq(u) { var m = u % (2 * Math.PI); return (m < 0 ? m + 2 * Math.PI : m) < Math.PI ? 1 : -1; }

    /* 坐标与目标方波 */
    VZ.ln(svg, x0, yc, x1, yc, VZ.stroke({ stroke: C.faint, "stroke-width": 1 }));
    VZ.txt(svg, x0 - 8, yc + 4, "0", { size: 10.5, fill: C.dim, anchor: "end" });
    VZ.path(svg, (function () {
      var d = "M" + x0 + " " + (yc - amp);
      for (var p = 0; p < 4; p++) {
        var a = X(p * Math.PI), b = X((p + 1) * Math.PI);
        d += "L" + a + " " + (p % 2 ? yc + amp : yc - amp) + "L" + b + " " + (p % 2 ? yc + amp : yc - amp);
      }
      return d + "L" + x1 + " " + (yc + amp);
    })(), VZ.stroke({ stroke: C.dim, "stroke-width": 1.4, "stroke-dasharray": "6 5", opacity: .8 }));
    VZ.txt(svg, x0 + 4, yc - amp - 8, "目标：方波", { size: 11, fill: C.dim });
    VZ.txt(svg, x1, yc + amp + 20, "x", { size: 11, fill: C.dim, anchor: "end" });

    var curve = VZ.path(svg, "", VZ.stroke({ stroke: C.cyan, "stroke-width": 2.2 }));
    var dot = VZ.circ(svg, x0, yc - amp, 4.5, { fill: C.cyan });
    var overLn = VZ.ln(svg, 0, 0, 0, 0, VZ.stroke({ stroke: C.mag, "stroke-width": 1.2, "stroke-dasharray": "3 3" }));
    var overTxt = VZ.txt(svg, 0, 0, "", { size: 11, fill: C.mag, anchor: "middle" });

    var out = VZ.panel(stage, { "项数 N": "1", "最高谐波 n": "1", "过冲峰值 (1 + …%)": "—", "Gibbs 极限": "≈ 8.95%" });

    function partial(u, N) {
      var s = 0;
      for (var k = 1; k <= N; k++) { var n = 2 * k - 1; s += Math.sin(n * u) / n; }
      return (4 / Math.PI) * s;
    }
    function draw(N) {
      var d = "", peak = 0;
      for (var i = 0; i <= 560; i++) {
        var u = i / 560 * 4 * Math.PI;
        var v = partial(u, N);
        peak = Math.max(peak, Math.abs(v));
        d += (i ? "L" : "M") + X(u).toFixed(1) + " " + (yc - v * amp).toFixed(1);
      }
      curve.setAttribute("d", d);
      overLn.setAttribute("x1", X(Math.PI)); overLn.setAttribute("x2", X(Math.PI));
      overLn.setAttribute("y1", yc - amp); overLn.setAttribute("y2", yc - peak * amp);
      overTxt.setAttribute("x", X(Math.PI) + 56); overTxt.setAttribute("y", yc - peak * amp - 6);
      overTxt.textContent = "过冲峰值 +" + ((peak - 1) * 100).toFixed(1) + "%";
      VZ.setPanel(out, { "项数 N": N, "最高谐波 n": (2 * N - 1), "过冲峰值 (1 + …%)": (peak - 1 >= 0 ? "+" : "") + ((peak - 1) * 100).toFixed(1) + "%" });
    }
    var curN = 1;
    VZ.slider(stage, { label: "正弦项数 N", value: 1, min: 1, max: 15, step: 1,
      onInput: function (v) { curN = Math.round(v); draw(curN); } });
    draw(1);
    VZ.raf(svg, function (t) {
      var u = (t * 1.1) % (4 * Math.PI);
      dot.setAttribute("cx", X(u));
      dot.setAttribute("cy", yc - partial(u, curN) * amp);
    });
  }
},

/* ==========================================================
   ch9-c · δ 函数：把脉冲挤窄挤高，面积恒为 1
   ========================================================== */
"f-ch09c": {
  title: "δ 函数：越挤越窄、越挤越高，面积始终是 1",
  hint: "<b>拖动滑块</b>把高斯脉冲的宽度 ε 从 1.2 压到 0.05：峰高按 1/(ε√2π) 涨上去，但下面盖住的面积<span class='hl'>永远是 1.000</span>——这就是「不完全的函数」，只在乎它跟别的函数乘起来积分。金色虚线是检验函数 φ，读数里 ∫δφ 的值随 ε→0 逼向 φ(0)：δ 一次「测量」就把 φ 在原点的值抽出来。",
  draw: function (stage) {
    var W = 760, H = 300, svg = VZ.S(stage, W, H, { grid: true });
    var C = VZ.C;
    var x0 = 50, x1 = 750, yc = 235, sx = 87.5;   /* x ∈ [−4, 4] */
    function X(x) { return x0 + (x + 4) / 8 * (x1 - x0); }
    var HMAX = 200;
    function phi(x) { return Math.exp(-x * x / 2); }

    VZ.ln(svg, x0, yc, x1, yc, VZ.stroke({ stroke: C.faint, "stroke-width": 1 }));
    [-4, -2, 0, 2, 4].forEach(function (v) {
      VZ.txt(svg, X(v), yc + 16, v === 0 ? "0" : (v > 0 ? "+" + v : "" + v), { size: 10.5, fill: C.dim, anchor: "middle" });
    });
    VZ.txt(svg, x1, yc + 32, "x", { size: 11, fill: C.dim, anchor: "end" });
    VZ.txt(svg, x0 + 6, 34, "检验函数 φ(x)（金）· 脉冲（青）", { size: 11, fill: C.dim });

    var area = VZ.path(svg, "", { fill: C.cyan, opacity: .16, stroke: "none" });
    var pulse = VZ.path(svg, "", VZ.stroke({ stroke: C.cyan, "stroke-width": 2 }));
    var ph = VZ.path(svg, "", VZ.stroke({ stroke: C.gold, "stroke-width": 1.4, "stroke-dasharray": "5 4", opacity: .9 }));
    var dotP = VZ.circ(svg, 0, 0, 4, { fill: C.gold });
    var areaLbl = VZ.txt(svg, 0, 0, "", { size: 13, fill: C.cyan, anchor: "middle", weight: 700 });

    var out = VZ.panel(stage, { "宽度 ε": "0.40", "峰高 1/(ε√2π)": "—", "数值面积 ∫δ dx": "1.000", "∫ δ·φ dx → φ(0) = 1.000": "—" });

    function draw(sig) {
      var hmax = 1 / (sig * Math.sqrt(2 * Math.PI));
      var k = Math.min(1, HMAX / (hmax * 2.6));
      function Y(y) { return yc - y * k * 100; }
      var dA = "M" + X(-4) + " " + yc, dC = "";
      var A = 0, P = 0;
      for (var i = 0; i <= 640; i++) {
        var x = -4 + i / 640 * 8;
        var g = Math.exp(-x * x / (2 * sig * sig)) / (sig * Math.sqrt(2 * Math.PI));
        var pr = g * phi(x);
        if (i) { A += (prevG + g) / 2 * (8 / 640); P += (prevP + pr) / 2 * (8 / 640); }
        var prevG = g, prevP = pr;
        var cmd = "L" + X(x).toFixed(1) + " " + Y(g).toFixed(1);
        dA += cmd; dC += (i ? cmd : "M" + X(x).toFixed(1) + " " + Y(g).toFixed(1));
      }
      dA += "L" + X(4) + " " + yc + "Z";
      area.setAttribute("d", dA); pulse.setAttribute("d", dC);
      var dph = "";
      for (var j = 0; j <= 320; j++) {
        var x2 = -4 + j / 320 * 8;
        dph += (j ? "L" : "M") + X(x2).toFixed(1) + " " + Y(phi(x2)).toFixed(1);
      }
      ph.setAttribute("d", dph);
      dotP.setAttribute("cx", X(0)); dotP.setAttribute("cy", Y(1));
      areaLbl.setAttribute("x", X(0)); areaLbl.setAttribute("y", Math.max(yc - hmax * k * 100 - 14, 20));
      areaLbl.textContent = "面积 = " + A.toFixed(3);
      VZ.setPanel(out, { "宽度 ε": sig.toFixed(2), "峰高 1/(ε√2π)": hmax.toFixed(2),
        "数值面积 ∫δ dx": A.toFixed(3), "∫ δ·φ dx → φ(0) = 1.000": P.toFixed(3) });
    }
    VZ.slider(stage, { label: "脉冲宽度 ε", value: 0.4, min: 0.05, max: 1.2, step: 0.01,
      format: function (v) { return v.toFixed(2); },
      onInput: function (v) { draw(v); } });
    draw(0.4);
    VZ.raf(svg, function (t) {
      var s = 0.65 + 0.35 * Math.sin(t * 3.2);
      areaLbl.setAttribute("opacity", 0.75 + 0.25 * s);
    });
  }
},

/* ==========================================================
   ch10-b · 曲面上的度规：山坡把网格拉伸，g 系数读数变
   ========================================================== */
"f-ch10b": {
  title: "度规：山坡把平坦网格拉伸成什么样",
  hint: "左边是地图（参数域），右边是同一张网格铺在<b>高斯山坡</b>上的样子。<b>拖动地图上的点</b>：右上角放大镜里画出这一点的单位小方格在曲面上被拉成的平行四边形，g 系数实时变。坡顶附近 |∇h| 大，方格被拉得最长——<span class='hl'>度规 g 就是把「地图距离」换算成「曲面距离」的那本汇率表</span>。",
  draw: function (stage) {
    var W = 760, H = 360, svg = VZ.S(stage, W, H, { grid: true });
    var C = VZ.C;
    var A = 1.0;
    function h(x, y) { return A * Math.exp(-((x - 0.5) * (x - 0.5) + (y - 0.5) * (y - 0.5)) / (2 * 0.16)); }
    function hx(x, y) { return (h(x + 1e-4, y) - h(x - 1e-4, y)) / 2e-4; }
    function hy(x, y) { return (h(x, y + 1e-4) - h(x, y - 1e-4)) / 2e-4; }

    VZ.txt(svg, 170, 70, "地图（参数域 0–1）", { size: 12.5, fill: C.ink2, anchor: "middle", weight: 700 });
    VZ.txt(svg, 560, 34, "铺在山坡上的同一张网格", { size: 12.5, fill: C.ink2, anchor: "middle", weight: 700 });
    VZ.card(svg, 596, 52, 148, 128, { fill: "rgba(255,255,255,.04)" });
    VZ.txt(svg, 670, 70, "放大镜：局部小方格", { size: 10.5, fill: C.dim, anchor: "middle" });

    /* 地图：左下角方块 */
    var mx = 60, my = 100, ms = 200;
    for (var i = 0; i <= 8; i++) {
      VZ.ln(svg, mx + i * ms / 8, my, mx + i * ms / 8, my + ms, { stroke: C.faint, "stroke-width": .8 });
      VZ.ln(svg, mx, my + i * ms / 8, mx + ms, my + i * ms / 8, { stroke: C.faint, "stroke-width": .8 });
    }
    VZ.el("rect", { x: mx, y: my, width: ms, height: ms, fill: "none", stroke: C.ink2, "stroke-width": 1.4 }, svg);

    /* 斜投影 */
    function pr(x, y, z) { return [560 + (x - y) * 105, 318 - (x + y) * 36 - z * 118]; }
    function drawSurf() {
      sg.innerHTML = "";
      for (var i2 = 0; i2 <= 10; i2++) {
        var d1 = "", d2 = "";
        for (var j = 0; j <= 40; j++) {
          var u = j / 40;
          var p1 = pr(u, i2 / 10, h(u, i2 / 10));
          d1 += (j ? "L" : "M") + p1[0].toFixed(1) + " " + p1[1].toFixed(1);
          var p2 = pr(i2 / 10, u, h(i2 / 10, u));
          d2 += (j ? "L" : "M") + p2[0].toFixed(1) + " " + p2[1].toFixed(1);
        }
        VZ.path(sg, d1, VZ.stroke({ stroke: C.violet, "stroke-width": .9, opacity: .55 }));
        VZ.path(sg, d2, VZ.stroke({ stroke: C.blue, "stroke-width": .9, opacity: .55 }));
      }
      var c1 = pr(0, 0, 0), c2 = pr(1, 0, 0), c3 = pr(1, 1, 0), c4 = pr(0, 1, 0);
      VZ.poly(sg, [c1, c2, c3, c4], { stroke: C.faint, "stroke-width": 1, close: true });
    }
    var sg = VZ.g(svg);
    drawSurf();

    var mk = VZ.circ(svg, 0, 0, 7, { fill: C.gold, stroke: C.deep, "stroke-width": 2, style: "cursor:grab" });
    var mkGlow = VZ.circ(svg, 0, 0, 13, { fill: C.gold, opacity: .25 });
    var mkS = VZ.circ(svg, 0, 0, 5, { fill: C.gold });
    var cell = VZ.path(svg, "", { fill: "rgba(255,207,92,.14)", stroke: C.gold, "stroke-width": 1.8 });
    var e1a = VZ.ln(svg, 0, 0, 0, 0, VZ.stroke({ stroke: C.cyan, "stroke-width": 2 }));
    var e2a = VZ.ln(svg, 0, 0, 0, 0, VZ.stroke({ stroke: C.mag, "stroke-width": 2 }));

    var out = VZ.panel(stage, { "g_xx = 1 + h_x²": "—", "g_xy = h_x·h_y": "—", "g_yy = 1 + h_y²": "—", "面积因子 √det g": "—" });

    var P = { x: 0.5, y: 0.32 };
    function drawCell() {
      var gx = hx(P.x, P.y), gy = hy(P.x, P.y);
      var gxx = 1 + gx * gx, gxy = gx * gy, gyy = 1 + gy * gy;
      var det = gxx * gyy - gxy * gxy;
      /* 地图上的点 */
      mk.setAttribute("cx", mx + P.x * ms); mk.setAttribute("cy", my + P.y * ms);
      mkGlow.setAttribute("cx", mx + P.x * ms); mkGlow.setAttribute("cy", my + P.y * ms);
      /* 曲面上的点 */
      var ps = pr(P.x, P.y, h(P.x, P.y));
      mkS.setAttribute("cx", ps[0]); mkS.setAttribute("cy", ps[1]);
      /* 放大镜里的切向小方格：边向量 (1,0,hx)、(0,1,hy) */
      var ccx = 670, ccy = 128, sc = 44;
      var a = [sc, -gx * sc], b = [gy * sc, -sc];
      var o = [ccx - sc * 0.5 - gy * sc * 0.5, ccy + gx * sc * 0.5 + sc * 0.5 - 10];
      cell.setAttribute("d", "M" + o[0] + " " + o[1] + "L" + (o[0] + a[0]) + " " + (o[1] + a[1]) +
        "L" + (o[0] + a[0] + b[0]) + " " + (o[1] + a[1] + b[1]) + "L" + (o[0] + b[0]) + " " + (o[1] + b[1]) + "Z");
      e1a.setAttribute("x1", o[0]); e1a.setAttribute("y1", o[1]);
      e1a.setAttribute("x2", o[0] + a[0]); e1a.setAttribute("y2", o[1] + a[1]);
      e2a.setAttribute("x1", o[0]); e2a.setAttribute("y1", o[1]);
      e2a.setAttribute("x2", o[0] + b[0]); e2a.setAttribute("y2", o[1] + b[1]);
      VZ.setPanel(out, { "g_xx = 1 + h_x²": gxx.toFixed(3), "g_xy = h_x·h_y": gxy.toFixed(3),
        "g_yy = 1 + h_y²": gyy.toFixed(3), "面积因子 √det g": Math.sqrt(Math.max(det, 0)).toFixed(3) });
    }
    VZ.drag(svg, mk, W, H, function (x, y, phase) {
      if (phase === "end") return;
      P.x = VZ.clamp((x - mx) / ms, 0.02, 0.98);
      P.y = VZ.clamp((y - my) / ms, 0.02, 0.98);
      drawCell();
    });
    VZ.slider(stage, { label: "山坡高度 A", value: 1.0, min: 0, max: 1.4, step: 0.05,
      format: function (v) { return v.toFixed(2); },
      onInput: function (v) { A = v; drawSurf(); drawCell(); } });
    drawCell();
    VZ.raf(svg, function (t) { mkGlow.setAttribute("r", 12 + 4 * Math.sin(t * 3)); });
    VZ.legend(stage, [["x 方向网格", C.violet], ["y 方向网格", C.blue], ["拖动点", C.gold]]);
  }
},

/* ==========================================================
   ch10-c · 柯西–黎曼：全纯映射保角 vs 非全纯撕裂网格
   ========================================================== */
"f-ch10c": {
  title: "柯西–黎曼：保角的网格与被撕坏的网格",
  hint: "<b>拖动左边方格里的小点</b>，看它经映射落到右边哪里、局部两根箭头的夹角变成多少。切到 <b>w = z²</b>：网格处处弯曲却处处保持直角——这就是保角；切到<b>撕裂映射</b>（只差一个系数，柯西–黎曼方程就不满足）：网格被撕斜，夹角读数随位置乱变。<span class='hl'>全纯 = 保角，这正是柯西–黎曼方程的几何内容。</span>",
  draw: function (stage) {
    var W = 760, H = 330, svg = VZ.S(stage, W, H, { grid: true });
    var C = VZ.C;
    var dx0 = 55, dy0 = 88, ds = 220;       /* 定义域 [-1,1]² */
    var icx = 545, icy = 172, isc = 64;     /* 值域 */
    function DX(x) { return dx0 + (x + 1) / 2 * ds; }
    function DY(y) { return dy0 + (1 - y) / 2 * ds; }
    function IX(u) { return icx + u * isc; }
    function IY(v) { return icy - v * isc; }

    var mode = { f: null, name: "" };
    var modes = {
      "w = z²（全纯·保角）": {
        f: function (x, y) { return [x * x - y * y, 2 * x * y]; },
        J: function (x, y) { return [[2 * x, -2 * y], [2 * y, 2 * x]]; }
      },
      "撕裂映射（非全纯）": {
        f: function (x, y) { return [x * x - y * y, 3 * x * y]; },
        J: function (x, y) { return [[2 * x, -2 * y], [3 * y, 3 * x]]; }
      }
    };

    VZ.txt(svg, dx0 + ds / 2, 66, "定义域 z 平面", { size: 12.5, fill: C.ink2, anchor: "middle", weight: 700 });
    VZ.txt(svg, icx, 66, "值域 w 平面", { size: 12.5, fill: C.ink2, anchor: "middle", weight: 700 });
    VZ.el("rect", { x: dx0, y: dy0, width: ds, height: ds, fill: "none", stroke: C.ink2, "stroke-width": 1.4 }, svg);
    /* 值域参考框 [-2,2]² */
    VZ.el("rect", { x: IX(-2), y: IY(2), width: 4 * isc, height: 4 * isc, fill: "none", stroke: C.faint, "stroke-width": 1 }, svg);

    var gridG = VZ.g(svg);
    function drawGrid() {
      gridG.innerHTML = "";
      var col = mode.name.indexOf("全纯") >= 0 ? C.violet : C.red;
      for (var i = 0; i <= 8; i++) {
        var c = -1 + i / 4, d1 = "", d2 = "";
        for (var j = 0; j <= 40; j++) {
          var t = -1 + j / 20;
          var p1 = mode.f(c, t), p2 = mode.f(t, c);
          d1 += (j ? "L" : "M") + IX(p1[0]).toFixed(1) + " " + IY(p1[1]).toFixed(1);
          d2 += (j ? "L" : "M") + IX(p2[0]).toFixed(1) + " " + IY(p2[1]).toFixed(1);
        }
        VZ.path(gridG, d1, VZ.stroke({ stroke: col, "stroke-width": .9, opacity: .5 }));
        VZ.path(gridG, d2, VZ.stroke({ stroke: col, "stroke-width": .9, opacity: .5 }));
      }
    }

    var mk = VZ.circ(svg, 0, 0, 7, { fill: C.gold, stroke: C.deep, "stroke-width": 2, style: "cursor:grab" });
    var mkGlow = VZ.circ(svg, 0, 0, 13, { fill: C.gold, opacity: .25 });
    var mkI = VZ.circ(svg, 0, 0, 5, { fill: C.gold });
    var v1 = VZ.ln(svg, 0, 0, 0, 0, VZ.stroke({ stroke: C.cyan, "stroke-width": 2.4 }));
    var v2 = VZ.ln(svg, 0, 0, 0, 0, VZ.stroke({ stroke: C.mag, "stroke-width": 2.4 }));
    var angArc = VZ.path(svg, "", VZ.stroke({ stroke: C.gold, "stroke-width": 1.2 }));
    var angTxt = VZ.txt(svg, 0, 0, "", { size: 13, fill: C.gold, anchor: "middle", weight: 700 });

    var out = VZ.panel(stage, { "局部夹角": "—", "柯西–黎曼方程": "—", "判定": "—" });
    var P = { x: 0.55, y: 0.4 };

    function drawPt() {
      var im = mode.f(P.x, P.y);
      mk.setAttribute("cx", DX(P.x)); mk.setAttribute("cy", DY(P.y));
      mkGlow.setAttribute("cx", DX(P.x)); mkGlow.setAttribute("cy", DY(P.y));
      mkI.setAttribute("cx", IX(im[0])); mkI.setAttribute("cy", IY(im[1]));
      var J = mode.J(P.x, P.y);
      var e1 = [J[0][0], J[1][0]], e2 = [J[0][1], J[1][1]];   /* dx 与 dy 两方向 */
      var n1 = Math.hypot(e1[0], e1[1]) || 1e-9, n2 = Math.hypot(e2[0], e2[1]) || 1e-9;
      var sc = 34;
      v1.setAttribute("x1", IX(im[0])); v1.setAttribute("y1", IY(im[1]));
      v1.setAttribute("x2", IX(im[0]) + e1[0] / n1 * sc); v1.setAttribute("y2", IY(im[1]) - e1[1] / n1 * sc);
      v2.setAttribute("x1", IX(im[0])); v2.setAttribute("y1", IY(im[1]));
      v2.setAttribute("x2", IX(im[0]) + e2[0] / n2 * sc); v2.setAttribute("y2", IY(im[1]) - e2[1] / n2 * sc);
      var ang = Math.acos(VZ.clamp((e1[0] * e2[0] + e1[1] * e2[1]) / (n1 * n2), -1, 1)) * 180 / Math.PI;
      var a1 = Math.atan2(-(e1[1]), e1[0]), a2 = Math.atan2(-(e2[1]), e2[0]);
      var dth = a2 - a1; while (dth > Math.PI) dth -= 2 * Math.PI; while (dth < -Math.PI) dth += 2 * Math.PI;
      var r = 16;
      angArc.setAttribute("d", "M" + (IX(im[0]) + r * Math.cos(a1)) + " " + (IY(im[1]) + r * Math.sin(a1)) +
        "A" + r + " " + r + " 0 0 " + (dth > 0 ? 1 : 0) + " " + (IX(im[0]) + r * Math.cos(a2)) + " " + (IY(im[1]) + r * Math.sin(a2)));
      angTxt.setAttribute("x", IX(im[0]) + 46); angTxt.setAttribute("y", IY(im[1]) - 24);
      angTxt.textContent = ang.toFixed(1) + "°";
      var ok = Math.abs(ang - 90) < 0.5;
      VZ.setPanel(out, {
        "局部夹角": ang.toFixed(1) + "°",
        "柯西–黎曼方程": ok ? "满足" : "不满足",
        "判定": ok ? "保角：网格只弯不撕" : "角度被撕坏"
      });
    }
    VZ.drag(svg, mk, W, H, function (x, y, phase) {
      if (phase === "end") return;
      P.x = VZ.clamp((x - dx0) / ds * 2 - 1, -1, 1);
      P.y = VZ.clamp(1 - (y - dy0) / ds * 2, -1, 1);
      drawPt();
    });
    VZ.chips(stage, Object.keys(modes), Object.keys(modes)[0], function (k) {
      mode.f = modes[k].f; mode.J = modes[k].J; mode.name = k;
      drawGrid(); drawPt();
    });
    mode.f = modes[Object.keys(modes)[0]].f; mode.J = modes[Object.keys(modes)[0]].J; mode.name = Object.keys(modes)[0];
    drawGrid(); drawPt();
    VZ.raf(svg, function (t) { mkGlow.setAttribute("r", 12 + 4 * Math.sin(t * 3)); });
  }
},

/* ==========================================================
   ch11-b · 四元数旋转：q = (cos θ/2, sin θ/2·n) 转动小球
   ========================================================== */
"f-ch11b": {
  title: "四元数旋转：一半的角度，720° 才回到 q 本身",
  hint: "<b>拖动小球上的金点</b>选初始向量，再<b>拖角度滑块</b>：单位四元数 q = (cos θ/2, sin θ/2·n) 把它绕白轴旋转。注意看读数——<b>θ = 360° 时向量已回原位，但 q 变成了 −q</b>（各分量变号）；要转满 <span class='hl'>720° 四元数才完全还原</span>，这就是电子「转两圈才握手」的代数原因。",
  draw: function (stage) {
    var W = 760, H = 360, svg = VZ.S(stage, W, H, { grid: true });
    var C = VZ.C;
    var cx = 225, cy = 188, R = 122, tilt = 0.45;
    var cb = Math.cos(tilt), sb = Math.sin(tilt);
    function pr(v) { var y = v[1] * cb + v[2] * sb; return [cx + v[0] * R, cy - y * R, v[1] * sb - v[2] * cb]; }

    VZ.circ(svg, cx, cy, R, VZ.stroke({ stroke: C.ink, "stroke-width": 2 }));
    VZ.ellipse ? null : null;
    /* 赤道与两条经线（参考网格） */
    VZ.path(svg, (function () {
      var d = ""; for (var i = 0; i <= 60; i++) { var a = i / 60 * 2 * Math.PI; var p = pr([Math.cos(a), Math.sin(a), 0]); d += (i ? "L" : "M") + p[0].toFixed(1) + " " + p[1].toFixed(1); } return d + "Z";
    })(), VZ.stroke({ stroke: C.faint, "stroke-width": .9 }));
    VZ.path(svg, (function () {
      var d = ""; for (var i = 0; i <= 40; i++) { var a = i / 40 * Math.PI - Math.PI / 2; var p = pr([Math.cos(a), 0, Math.sin(a)]); d += (i ? "L" : "M") + p[0].toFixed(1) + " " + p[1].toFixed(1); } return d;
    })(), VZ.stroke({ stroke: C.faint, "stroke-width": .9 }));

    var out = VZ.panel(stage, { "θ": "0°", "q = (w, xi, yj, zk)": "—", "向量位置": "已回原位", "q 是否还原": "—" });

    var axes = { "绕 x 轴": [1, 0, 0], "绕 y 轴": [0, 1, 0], "绕 z 轴": [0, 0, 1] };
    var axis = axes["绕 x 轴"];
    var axisLn = VZ.ln(svg, 0, 0, 0, 0, VZ.stroke({ stroke: C.ink2, "stroke-width": 1.3, "stroke-dasharray": "6 4" }));
    var trail = VZ.path(svg, "", VZ.stroke({ stroke: C.cyan, "stroke-width": 1.6, opacity: .55 }));
    var vec = VZ.ln(svg, 0, 0, 0, 0, VZ.stroke({ stroke: C.gold, "stroke-width": 2.8 }));
    var tip = VZ.circ(svg, 0, 0, 8, { fill: C.gold, stroke: C.deep, "stroke-width": 2, style: "cursor:grab" });
    var tipGlow = VZ.circ(svg, 0, 0, 14, { fill: C.gold, opacity: .22 });

    function qRot(v, axis, th) {   /* v' = q v q*，q=(cos th/2, sin th/2 axis) */
      var w = Math.cos(th / 2), s = Math.sin(th / 2);
      var u = [axis[0] * s, axis[1] * s, axis[2] * s];
      var cr1 = [u[1] * v[2] - u[2] * v[1], u[2] * v[0] - u[0] * v[2], u[0] * v[1] - u[1] * v[0]];
      var cr2 = [u[1] * cr1[2] - u[2] * cr1[1], u[2] * cr1[0] - u[0] * cr1[2], u[0] * cr1[1] - u[1] * cr1[0]];
      return [v[0] + 2 * w * cr1[0] + 2 * cr2[0], v[1] + 2 * w * cr1[1] + 2 * cr2[1], v[2] + 2 * w * cr1[2] + 2 * cr2[2]];
    }
    var v0 = [0.62, 0.55, 0.56];
    (function () { var n = Math.hypot(v0[0], v0[1], v0[2]); v0 = v0.map(function (x) { return x / n; }); })();

    var th = 0;
    function draw() {
      var v = qRot(v0, axis, th);
      var pa = pr(v0), pb = pr(v);
      vec.setAttribute("x1", cx); vec.setAttribute("y1", cy);
      vec.setAttribute("x2", pb[0]); vec.setAttribute("y2", pb[1]);
      tip.setAttribute("cx", pb[0]); tip.setAttribute("cy", pb[1]);
      tipGlow.setAttribute("cx", pb[0]); tipGlow.setAttribute("cy", pb[1]);
      var na = pr(axis.map(function (x) { return x; }));
      var pA = pr([-axis[0], -axis[1], -axis[2]]), pB = pr([axis[0], axis[1], axis[2]]);
      axisLn.setAttribute("x1", pA[0]); axisLn.setAttribute("y1", pA[1]);
      axisLn.setAttribute("x2", pB[0]); axisLn.setAttribute("y2", pB[1]);
      var d = "";
      for (var i = 0; i <= 72; i++) {
        var t2 = i / 72 * th;
        var p = pr(qRot(v0, axis, t2));
        d += (i ? "L" : "M") + p[0].toFixed(1) + " " + p[1].toFixed(1);
      }
      trail.setAttribute("d", d);
      var w = Math.cos(th * Math.PI / 360), s = Math.sin(th * Math.PI / 360);
      var qv = axis.map(function (x) { return x * s; });
      var back = Math.abs(th % 720) < 1e-6 || Math.abs(th % 720 - 720) < 1e-6;
      var vecBack = Math.abs(th % 360) < 1e-6 || Math.abs(th % 360 - 360) < 1e-6;
      VZ.setPanel(out, {
        "θ": Math.round(th) + "°",
        "q = (w, xi, yj, zk)": "(" + w.toFixed(2) + ", " + qv[0].toFixed(2) + "i, " + qv[1].toFixed(2) + "j, " + qv[2].toFixed(2) + "k)",
        "向量位置": vecBack ? "已回原位" : "转动中",
        "q 是否还原": back ? "还原（720°）" : (vecBack ? "没还原：q = −q₀" : "没有")
      });
    }
    VZ.drag(svg, tip, W, H, function (x, y, phase) {
      if (phase === "end") return;
      var dx = (x - cx) / R, dy = -(y - cy) / R;      /* 屏幕方向近似映射回三维（够选初始方向） */
      var n = Math.hypot(dx, dy);
      if (n > 1) { dx /= n; dy /= n; }
      var vy = dy * cb;
      v0 = [dx, vy, Math.sqrt(Math.max(1 - dx * dx - vy * vy, 0.02))];
      var n2 = Math.hypot(v0[0], v0[1], v0[2]); v0 = v0.map(function (q) { return q / n2; });
      draw();
    });
    VZ.chips(stage, Object.keys(axes), "绕 x 轴", function (k) { axis = axes[k]; draw(); });
    VZ.slider(stage, { label: "旋转角 θ", value: 0, min: 0, max: 720, step: 1,
      format: function (v) { return Math.round(v) + "°"; },
      onInput: function (v) { th = v; draw(); } });
    draw();
    VZ.raf(svg, function (t) { tipGlow.setAttribute("r", 13 + 3 * Math.sin(t * 3)); });
  }
},

/* ==========================================================
   ch11-c · 外积反交换：交换 a、b 顺序，法向翻转
   ========================================================== */
"f-ch11c": {
  title: "外积反交换：a×b 与 b×a，只差一个方向",
  hint: "<b>拖动 a、b 两个箭头的端点</b>改变它们的长短与夹角，再点上面的<b>选块交换顺序</b>：平行四边形面积 |a×b| = |a||b|sinθ 不变，但法向箭头<span class='hl'>从指向上（⊗变⊙）翻转成指向下</span>——红色出纸面、蓝色入纸面。这就是 a×b = −b×a：反交换性是「有向面积」的本性。",
  draw: function (stage) {
    var W = 760, H = 320, svg = VZ.S(stage, W, H, { grid: true });
    var C = VZ.C;
    var ox = 290, oy = 178;
    var a = [95, -55], b = [-30, -110];

    VZ.ln(svg, 60, oy, 520, oy, { stroke: C.faint, "stroke-width": 1 });
    VZ.ln(svg, ox, 60, ox, 300, { stroke: C.faint, "stroke-width": 1 });
    VZ.txt(svg, 520, oy + 16, "x", { size: 11, fill: C.dim });
    VZ.txt(svg, ox + 8, 62, "y", { size: 11, fill: C.dim });
    VZ.txt(svg, ox - 10, oy + 16, "O", { size: 11, fill: C.dim, anchor: "end" });

    var para = VZ.path(svg, "", { fill: "rgba(255,207,92,.13)", stroke: "none" });
    var la = VZ.ln(svg, ox, oy, 0, 0, VZ.stroke({ stroke: C.cyan, "stroke-width": 2.6 }));
    var lb = VZ.ln(svg, ox, oy, 0, 0, VZ.stroke({ stroke: C.gold, "stroke-width": 2.6 }));
    var lblA = VZ.txt(svg, 0, 0, "a", { size: 15, fill: C.cyan, weight: 700, anchor: "middle" });
    var lblB = VZ.txt(svg, 0, 0, "b", { size: 15, fill: C.gold, weight: 700, anchor: "middle" });
    var arc = VZ.path(svg, "", VZ.stroke({ stroke: C.ink2, "stroke-width": 1.2 }));
    var arcT = VZ.txt(svg, 0, 0, "", { size: 11, fill: C.ink2, anchor: "middle" });

    /* 法向指示盘 */
    VZ.circ(svg, 636, 130, 52, { fill: "rgba(255,255,255,.04)", stroke: C.faint, "stroke-width": 1.2 });
    var nDot = VZ.circ(svg, 636, 130, 9, { fill: C.red });
    var nCross = VZ.g(svg);
    VZ.ln(nCross, 636 - 12, 130 - 12, 636 + 12, 130 + 12, VZ.stroke({ stroke: C.blue, "stroke-width": 4 }));
    VZ.ln(nCross, 636 - 12, 130 + 12, 636 + 12, 130 - 12, VZ.stroke({ stroke: C.blue, "stroke-width": 4 }));
    var nLbl = VZ.txt(svg, 636, 202, "", { size: 12.5, fill: C.red, anchor: "middle", weight: 700 });
    var nArr = VZ.ln(svg, 636, 176, 636, 240, VZ.stroke({ stroke: C.red, "stroke-width": 2.6 }));
    var nArrT = VZ.txt(svg, 648, 232, "|a×b|", { size: 11, fill: C.dim });

    var out = VZ.panel(stage, { "顺序": "a×b", "|a||b|sinθ": "—", "方向": "垂直纸面向外（⊙）", "关系": "a×b = −b×a" });

    var order = 1;   /* 1: a×b，-1: b×a */
    function draw() {
      var px = order === 1 ? a : b, py = order === 1 ? b : a;   /* 叉乘的两个因子（顺序） */
      var cross = a[0] * b[1] - a[1] * b[0];
      var area = Math.abs(cross);
      para.setAttribute("d", "M" + ox + " " + oy + "L" + (ox + a[0]) + " " + (oy + a[1]) +
        "L" + (ox + a[0] + b[0]) + " " + (oy + a[1] + b[1]) + "L" + (ox + b[0]) + " " + (oy + b[1]) + "Z");
      la.setAttribute("x2", ox + a[0]); la.setAttribute("y2", oy + a[1]);
      lb.setAttribute("x2", ox + b[0]); lb.setAttribute("y2", oy + b[1]);
      lblA.setAttribute("x", ox + a[0] + (a[0] > 0 ? 14 : -14)); lblA.setAttribute("y", oy + a[1] + 4);
      lblB.setAttribute("x", ox + b[0] + (b[0] > 0 ? 14 : -14)); lblB.setAttribute("y", oy + b[1] + 4);
      var na = Math.hypot(a[0], a[1]), nb = Math.hypot(b[0], b[1]);
      var ang = Math.acos(VZ.clamp((a[0] * b[0] + a[1] * b[1]) / (na * nb || 1e-9), -1, 1));
      var aA = Math.atan2(a[1], a[0]), aB = Math.atan2(b[1], b[0]);
      var dth = aB - aA; while (dth > Math.PI) dth -= 2 * Math.PI; while (dth < -Math.PI) dth += 2 * Math.PI;
      var r = 30;
      arc.setAttribute("d", "M" + (ox + r * Math.cos(aA)) + " " + (oy + r * Math.sin(aA)) +
        "A" + r + " " + r + " 0 0 " + (dth > 0 ? 1 : 0) + " " + (ox + r * Math.cos(aB)) + " " + (oy + r * Math.sin(aB)));
      arcT.setAttribute("x", ox + 52 * Math.cos((aA + aB) / 2)); arcT.setAttribute("y", oy + 52 * Math.sin((aA + aB) / 2) + 4);
      arcT.textContent = "θ = " + (ang * 180 / Math.PI).toFixed(0) + "°";
      var up = cross * order > 0;
      nDot.setAttribute("opacity", up ? 1 : 0);
      nCross.setAttribute("opacity", up ? 0 : 1);
      nLbl.textContent = up ? "法向：指向读者（⊙）" : "法向：指离读者（⊗）";
      nLbl.setAttribute("fill", up ? C.red : C.blue);
      nArr.setAttribute("stroke", up ? C.red : C.blue);
      var L = VZ.clamp(area * 0.14, 8, 56);
      nArr.setAttribute("y1", up ? 176 + L : 176); nArr.setAttribute("y2", up ? 176 : 176 + L);
      VZ.setPanel(out, {
        "顺序": order === 1 ? "a×b" : "b×a",
        "|a||b|sinθ": area.toFixed(0) + "（面积不变）",
        "方向": up ? "垂直纸面向外（⊙）" : "垂直纸面向里（⊗）",
        "关系": "a×b = −b×a"
      });
    }
    function mkHandle(vec, col) {
      var h = VZ.circ(svg, 0, 0, 9, { fill: col, stroke: C.deep, "stroke-width": 2, opacity: 0, style: "cursor:grab" });
      var hit = VZ.circ(svg, 0, 0, 22, { fill: "rgba(0,0,0,0)", style: "cursor:grab" });
      function mv() {
        h.setAttribute("cx", ox + vec[0]); h.setAttribute("cy", oy + vec[1]);
        hit.setAttribute("cx", ox + vec[0]); hit.setAttribute("cy", oy + vec[1]);
        h.setAttribute("opacity", 1);
      }
      VZ.drag(svg, hit, W, H, function (x, y, phase) {
        if (phase === "end") return;
        vec[0] = VZ.clamp(x - ox, -215, 215); vec[1] = VZ.clamp(y - oy, -110, 115);
        if (Math.hypot(vec[0], vec[1]) < 14) vec[1] = vec[1] >= 0 ? 14 : -14;
        mv(); draw();
      });
      mv();
    }
    mkHandle(a, C.cyan); mkHandle(b, C.gold);
    VZ.chips(stage, ["a×b（先 a 后 b）", "b×a（先 b 后 a）"], "a×b（先 a 后 b）", function (k) {
      order = k.charAt(0) === "b" ? -1 : 1; draw();
    });
    draw();
    VZ.raf(svg, function (t) {
      nDot.setAttribute("r", 8 + 1.6 * Math.sin(t * 3));
    });
  }
},

/* ==========================================================
   ch12-b · 流形与图册：两张坐标卡，重叠区高亮
   ========================================================== */
"f-ch12b": {
  title: "图册：一个地球仪，两张互相重叠的地图",
  hint: "<b>拖动球面上的金点</b>，再<b>点击两张地图卡</b>切换当前坐标卡。北卡只管北边、南卡只管南边，中间金色的<b>重叠带</b>里两张卡都有坐标——读数里同一点有两套数，切换时看它怎么换算。<span class='hl'>流形没有全局地图，靠「一叠互相重叠的卡」拼出整个空间</span>；把点拖进某张卡的盲区，那张卡会变灰。",
  draw: function (stage) {
    var W = 760, H = 340, svg = VZ.S(stage, W, H, { grid: true });
    var C = VZ.C;
    var cx = 380, cy = 172, R = 118;
    var OV = 0.32;   /* 重叠带半高（以 R 计） */

    VZ.circ(svg, cx, cy, R, VZ.stroke({ stroke: C.ink, "stroke-width": 2 }));
    [-0.6, -0.2, 0.2, 0.6].forEach(function (f) {
      var rr = R * Math.sqrt(1 - f * f);
      VZ.path(svg, "M" + (cx - rr) + " " + (cy - R * f) + "A" + rr + " " + (rr * 0.28) + " 0 0 0 " + (cx + rr) + " " + (cy - R * f),
        VZ.stroke({ stroke: C.faint, "stroke-width": .9 }));
    });
    /* 重叠带 */
    var ovTop = cy - R * OV, ovBot = cy + R * OV;
    VZ.el("rect", { x: cx - R, y: ovTop, width: 2 * R, height: ovBot - ovTop, fill: "rgba(255,207,92,.12)" }, svg);
    VZ.ln(svg, cx - R, ovTop, cx + R, ovTop, VZ.stroke({ stroke: C.gold, "stroke-width": 1, "stroke-dasharray": "5 4" }));
    VZ.ln(svg, cx - R, ovBot, cx + R, ovBot, VZ.stroke({ stroke: C.gold, "stroke-width": 1, "stroke-dasharray": "5 4" }));
    VZ.txt(svg, cx + R + 8, (ovTop + ovBot) / 2 + 4, "重叠带", { size: 11, fill: C.gold });

    /* 两张地图卡（SVG 内可点击） */
    function card(x, name, sub, col, covers) {
      var gclick = VZ.g(svg, { style: "cursor:pointer" });
      var bg = VZ.el("rect", { x: x, y: 96, width: 128, height: 92, rx: 10, fill: "rgba(255,255,255,.045)", stroke: col, "stroke-width": 1.6 }, gclick);
      VZ.txt(gclick, x + 64, 122, name, { size: 14, fill: col, anchor: "middle", weight: 700 });
      VZ.txt(gclick, x + 64, 142, sub, { size: 10.5, fill: C.dim, anchor: "middle" });
      var cov = VZ.txt(gclick, x + 64, 164, "", { size: 10.5, fill: C.ink2, anchor: "middle" });
      return { g: gclick, bg: bg, cov: cov, covers: covers };
    }
    var cN = card(64, "北卡 U₁", "平面投影 (u, v)", C.cyan, function (y) { return y > -OV; });
    var cS = card(568, "南卡 U₂", "平面投影 (u′, v′)", C.mag, function (y) { return y < OV; });

    var mk = VZ.circ(svg, 0, 0, 8, { fill: C.gold, stroke: C.deep, "stroke-width": 2, style: "cursor:grab" });
    var mkGlow = VZ.circ(svg, 0, 0, 14, { fill: C.gold, opacity: .25 });
    var mkB = VZ.circ(svg, 0, 0, 4, { fill: C.deep });

    var out = VZ.panel(stage, { "P 的纬度 y/R": "—", "北卡 U₁ 坐标 (u, v)": "—", "南卡 U₂ 坐标 (u′, v′)": "—", "当前卡": "北卡 U₁" });

    var P = { x: 0.35, y: -0.18 };   /* 以 R 为单位的球面坐标（正面） */
    var active = cN;
    function setActive(c) {
      active = c;
      cN.bg.setAttribute("stroke-width", c === cN ? 3 : 1.2);
      cS.bg.setAttribute("stroke-width", c === cS ? 3 : 1.2);
      draw();
    }
    function fmt(v) { return (v >= 0 ? "+" : "−") + Math.abs(v).toFixed(2); }
    function draw() {
      var px = cx + P.x * R, py = cy - P.y * R;
      mk.setAttribute("cx", px); mk.setAttribute("cy", py);
      mkGlow.setAttribute("cx", px); mkGlow.setAttribute("cy", py);
      mkB.setAttribute("cx", px); mkB.setAttribute("cy", py);
      var inN = P.y > -OV, inS = P.y < OV;
      [cN, cS].forEach(function (c) {
        var inC = c.covers(P.y);
        c.bg.setAttribute("opacity", inC ? 1 : .35);
        c.cov.textContent = inC ? "包含此点 ✓" : "盲区：不含此点";
        c.cov.setAttribute("fill", inC ? C.ink2 : C.red);
      });
      var u1 = fmt(P.x / (1 + P.y + 1.4)), v1 = fmt(P.y);
      var u2 = fmt(P.x / (1.4 - P.y)), v2 = fmt(P.y);
      VZ.setPanel(out, {
        "P 的纬度 y/R": fmt(P.y),
        "北卡 U₁ 坐标 (u, v)": inN ? "(" + u1 + ", " + v1 + ")" : "不在卡内",
        "南卡 U₂ 坐标 (u′, v′)": inS ? "(" + u2 + ", " + v2 + ")" : "不在卡内",
        "当前卡": active === cN ? "北卡 U₁" : "南卡 U₂"
      });
    }
    VZ.drag(svg, mk, W, H, function (x, y, phase) {
      if (phase === "end") return;
      var dx = (x - cx) / R, dy = -(y - cy) / R;
      var n = Math.hypot(dx, dy);
      if (n > 0.98) { dx *= 0.98 / n; dy *= 0.98 / n; }
      if (n < 0.06) { dx = 0.06; dy = 0; }
      P.x = dx; P.y = dy;
      draw();
    });
    cN.g.addEventListener("click", function () { setActive(cN); });
    cS.g.addEventListener("click", function () { setActive(cS); });
    setActive(cN);
    VZ.raf(svg, function (t) { mkGlow.setAttribute("r", 13 + 3.5 * Math.sin(t * 3)); });
    VZ.legend(stage, [["北卡覆盖", C.cyan], ["南卡覆盖", C.mag], ["重叠带（两套坐标都有效）", C.gold]]);
  }
},

/* ==========================================================
   ch12-c · 外微分：dω = d(df) = 0，绕方块边界一圈正负相消
   ========================================================== */
"f-ch12c": {
  title: "外微分：绕方块一圈，相邻两边正好相消",
  hint: "取 ω = d(xy) = y dx + x dy。<b>拖动方块</b>在平面里移动、<b>拖滑块</b>改大小：四条边的积分读数各自在变，但<span class='hl'>Σ 恒等于 0</span>——每条边记的都是同一个函数 xy 的增量，绕一圈回来增量必为零。这就是 d² = 0 的第一种长相：相邻边相消；拼成大区域后，内部公共边全部成对抵消，只剩下真正的边界。",
  draw: function (stage) {
    var W = 760, H = 340, svg = VZ.S(stage, W, H, { grid: true });
    var C = VZ.C;
    var cx = 330, cy = 175, half = 62;

    VZ.ln(svg, 40, cy, 620, cy, { stroke: C.faint, "stroke-width": 1 });
    VZ.ln(svg, cx, 40, cx, 315, { stroke: C.faint, "stroke-width": 1 });
    VZ.txt(svg, 624, cy + 4, "x", { size: 11, fill: C.dim });
    VZ.txt(svg, cx + 6, 44, "y", { size: 11, fill: C.dim });
    VZ.txt(svg, 44, 52, "ω = y dx + x dy（= d(xy)，恰当形式）", { size: 12, fill: C.ink2 });

    function fv(x, y) { return { dx: y, dy: x }; }   /* ω 在 (x,y) 的分量（以方块中心为原点） */

    var sqG = VZ.g(svg);
    var edges = [
      { name: "下", ori: +1, ax: "x" },
      { name: "右", ori: +1, ax: "y" },
      { name: "上", ori: -1, ax: "x" },
      { name: "左", ori: -1, ax: "y" }
    ];
    var edgeArrows = [], edgeLbls = [];
    edges.forEach(function (e, i) {
      edgeArrows.push(VZ.g(sqG));
      edgeLbls.push(VZ.txt(sqG, 0, 0, "", { size: 12.5, fill: C.ink, anchor: "middle", weight: 700 }));
    });
    var corner = VZ.circ(svg, 0, 0, 9, { fill: C.gold, stroke: C.deep, "stroke-width": 2, style: "cursor:grab", opacity: 0 });
    var hit = VZ.circ(svg, 0, 0, 40, { fill: "rgba(0,0,0,0)", style: "cursor:grab" });

    var out = VZ.panel(stage, { "I_下": "—", "I_右": "—", "I_上": "—", "I_左": "—", "Σ = I_下+I_右+I_上+I_左": "0.000" });

    function draw() {
      sqG.innerHTML = "";
      edgeArrows = []; edgeLbls = [];
      edges.forEach(function () {
        edgeArrows.push(VZ.g(sqG));
        edgeLbls.push(VZ.txt(sqG, 0, 0, "", { size: 12.5, fill: C.ink, anchor: "middle", weight: 700 }));
      });
      /* 方块 */
      VZ.el("rect", { x: cx - half, y: cy - half, width: 2 * half, height: 2 * half, fill: "rgba(155,140,255,.06)", stroke: C.ink, "stroke-width": 1.8 }, sqG);
      VZ.txt(sqG, cx, cy + 5, "□", { size: 16, fill: C.dim, anchor: "middle" });
      var vals = [];
      edges.forEach(function (e, i) {
        var I = 0, N = 7;
        for (var k = 0; k < N; k++) {
          var t = (k + 0.5) / N * 2 - 1;         /* 沿边参数 [-1,1] */
          var px, py, dxlen, dylen, mx, my;
          if (e.ax === "x") {
            px = t; py = (e.name === "下" ? -1 : 1);
            dxlen = e.ori * 2 / N; dylen = 0;
            mx = cx + t * half; my = cy + py * half;
          } else {
            py = t; px = (e.name === "右" ? 1 : -1);
            dxlen = 0; dylen = e.ori * 2 / N;
            mx = cx + px * half; my = cy - t * half;
          }
          var w = fv(px * half, py * half);
          var comp = e.ax === "x" ? w.dx : w.dy;
          var contrib = (comp * dxlen + comp * dylen) * half;
          I += contrib;
          var L = VZ.clamp(Math.abs(comp) * 7, 5, 26) * Math.sign(comp * (e.ax === "x" ? e.ori : -e.ori) || 1);
          var col = contrib >= 0 ? C.cyan : C.mag;
          if (e.ax === "x") VZ.ln(edgeArrows[i], mx - L / 2, my, mx + L / 2, my, VZ.stroke({ stroke: col, "stroke-width": 2.4 }));
          else VZ.ln(edgeArrows[i], mx, my + L / 2, mx, my - L / 2, VZ.stroke({ stroke: col, "stroke-width": 2.4 }));
        }
        vals.push(I);
        if (e.ax === "x") edgeLbls[i].setAttribute("y", e.name === "下" ? cy + half + 22 : cy - half - 12);
        else { edgeLbls[i].setAttribute("x", e.name === "右" ? cx + half + 40 : cx - half - 40); edgeLbls[i].setAttribute("y", cy + 4); }
        if (e.ax === "x") edgeLbls[i].setAttribute("x", cx);
      });
      edges.forEach(function (e, i) {
        edgeLbls[i].textContent = e.name + " " + (vals[i] >= 0 ? "+" : "−") + Math.abs(vals[i]).toFixed(0);
        edgeLbls[i].setAttribute("fill", vals[i] >= 0 ? C.cyan : C.mag);
      });
      var sum = vals.reduce(function (s, v) { return s + v; }, 0);
      VZ.setPanel(out, {
        "I_下": vals[0].toFixed(1), "I_右": vals[1].toFixed(1),
        "I_上": vals[2].toFixed(1), "I_左": vals[3].toFixed(1),
        "Σ = I_下+I_右+I_上+I_左": sum.toFixed(1) + "（恒为 0）"
      });
      corner.setAttribute("cx", cx); corner.setAttribute("cy", cy);
      hit.setAttribute("cx", cx); hit.setAttribute("cy", cy);
    }
    VZ.drag(svg, hit, W, H, function (x, y, phase) {
      if (phase === "end") return;
      cx = VZ.clamp(x, 135, 565); cy = VZ.clamp(y, 100, 258);
      draw();
    });
    VZ.slider(stage, { label: "方块半边长", value: 62, min: 26, max: 95, step: 1,
      onInput: function (v) { half = Math.round(v); draw(); } });
    draw();
    VZ.raf(svg, function (t) {
      corner.setAttribute("opacity", 0.5 + 0.5 * Math.sin(t * 3));
    });
    VZ.legend(stage, [["沿边正向（贡献为正）", C.cyan], ["逆边正向（贡献为负）", C.mag], ["拖动方块的把手", C.gold]]);
  }
}

});
