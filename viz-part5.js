/* ============================================================
   viz-part5.js — 第二批新图（ch19–ch24，每章 b/c 两张）
   风格基准：viz-part1.js 的 f-ch01 / f-ch04
   ============================================================ */
VZ.define({

/* ==========================================================
   ch19b · 平面电磁波：E、B 正交振荡（滑频率）
   ========================================================== */
"f-ch19b": {
  title: "平面电磁波：E 与 B 互相垂直，手拉手以光速前进",
  hint: "拖动滑杆改<b>频率</b>：波长跟着变、波形跑得有快有慢，但 E 与 B 始终<b>同相位、互相垂直</b>，且都垂直于传播方向。 " + "麦克斯韦方程组的直接推论：<span class='hl'>变化的电场生出磁场，变化的磁场又生出电场</span>——这条自续的链条不需要介质，在真空里以 c = ω/k ≈ 3×10⁸ m/s 传播。频率可以从无线电一路滑到 γ 射线，波速不变。",
  draw: function (stage) {
    var W = 760, H = 330, svg = VZ.S(stage, W, H, { grid: true });
    var C = VZ.C;
    var axY = 160, x0 = 60, x1 = 700, lam = 150;
    var k = 2 * Math.PI / lam, omega = 2.2;

    /* 传播轴 */
    var ar = VZ.arrowDef(svg, VZ.uid("ar"), C.ink2);
    VZ.ln(svg, x0 - 10, axY, x1 + 8, axY, { stroke: C.faint, "stroke-width": 1, "marker-end": ar });
    VZ.txt(svg, x1 + 4, axY + 20, "传播方向 c", { size: 11.5, fill: C.ink2, anchor: "end" });

    /* E 曲线（竖直振荡，青色）与 B 曲线（水平振荡，品红） */
    var ePath = VZ.path(svg, "", VZ.stroke({ stroke: C.cyan, "stroke-width": 2.2 }));
    var bPath = VZ.path(svg, "", VZ.stroke({ stroke: C.mag, "stroke-width": 2.2 }));
    /* 每个波长处画一组 E/B 箭头 */
    var eArrs = [], bArrs = [], NP = 9;
    for (var i = 0; i < NP; i++) {
      eArrs.push(VZ.ln(svg, 0, 0, 0, 0, VZ.stroke({ stroke: C.cyan, "stroke-width": 1.6, opacity: .8 })));
      bArrs.push(VZ.ln(svg, 0, 0, 0, 0, VZ.stroke({ stroke: C.mag, "stroke-width": 1.6, opacity: .8 })));
    }
    var eDots = [], bDots = [];
    for (var j = 0; j < NP; j++) {
      eDots.push(VZ.circ(svg, 0, 0, 3, { fill: C.cyan }));
      bDots.push(VZ.circ(svg, 0, 0, 3, { fill: C.mag }));
    }
    var labelE = VZ.txt(svg, x0 + 6, 46, "E（竖直）", { size: 13, fill: C.cyan, weight: 700 });
    var labelB = VZ.txt(svg, x0 + 6, 274, "B（水平，垂直纸面方向以横向偏移表示）", { size: 12, fill: C.mag });

    var tPhase = 0;
    function waveY(x, t) { return Math.sin(k * (x - x0) - omega * t); }
    VZ.raf(svg, function (t, ms) {
      tPhase += ms / 1000;
      var de = "", db = "";
      for (var x = x0; x <= x1; x += 4) {
        var s = waveY(x, tPhase);
        de += (de ? "L" : "M") + x + " " + (axY - s * 62).toFixed(1);
        db += (db ? "L" : "M") + (x + s * 40).toFixed(1) + " " + (axY + 78 - s * 16).toFixed(1);
      }
      ePath.setAttribute("d", de);
      bPath.setAttribute("d", db);
      for (var i = 0; i < NP; i++) {
        var xx = x0 + 36 + i * (x1 - x0 - 72) / (NP - 1);
        var s2 = waveY(xx, tPhase);
        eArrs[i].setAttribute("x1", xx); eArrs[i].setAttribute("y1", axY);
        eArrs[i].setAttribute("x2", xx); eArrs[i].setAttribute("y2", axY - s2 * 48);
        eDots[i].setAttribute("cx", xx); eDots[i].setAttribute("cy", axY - s2 * 48);
        bArrs[i].setAttribute("x1", xx); bArrs[i].setAttribute("y1", axY + 78);
        bArrs[i].setAttribute("x2", xx + s2 * 34); bArrs[i].setAttribute("y2", axY + 78);
        bDots[i].setAttribute("cx", xx + s2 * 34); bDots[i].setAttribute("cy", axY + 78);
      }
      info && VZ.setPanel(info, { "频率": freq + "（相对单位）", "波长": (2 * Math.PI / k).toFixed(0) + " px", "波速 c = ω/k": "3×10⁸ m/s（恒定）" });
    });

    var info = VZ.panel(stage, { "频率": "", "波长": "", "波速 c = ω/k": "" });
    VZ.slider(stage, {
      label: "频率 ω", value: 2.2, min: 0.6, max: 6, step: 0.1,
      format: function (v) { return v.toFixed(1); },
      onInput: function (v) { omega = v; k = 2 * Math.PI / (45 + 130 * (6 - v) / 5.4); }
    });
    VZ.legend(stage, [["E 场（竖直振荡）", C.cyan], ["B 场（水平振荡）", C.mag]]);
  }
},

/* ==========================================================
   ch19c · 光线掠日偏折（拖 impact parameter，1.75″ 标注）
   ========================================================== */
"f-ch19c": {
  title: "引力让光线拐弯：越贴着太阳掠过，偏得越多",
  hint: "<b>上下拖动光线</b>改变掠日距离 b：贴着日面（b = R☉）时广义相对论给出 <span class='hl'>α = 1.75″</span>，正是 1919 年爱丁顿日食队测量出的那个数。 " + "偏折角 α = 4GM/(c²b)，是牛顿「微粒说」预言值（0.87″）的整整两倍——这两个数的差别，就是时空弯曲与「引力是一种力」的分水岭。图中偏折角度已放大以便观察，读数是真实值。",
  draw: function (stage) {
    var W = 760, H = 320, svg = VZ.S(stage, W, H, { grid: true });
    var C = VZ.C;
    var cx = 300, cy = 170, R = 46;
    var b = R; /* impact parameter（px） */

    /* 太阳 */
    var glow = VZ.blurFilter(svg, VZ.uid("gl"), 10);
    VZ.circ(svg, cx, cy, R + 6, { fill: C.gold, opacity: .16, filter: glow });
    VZ.circ(svg, cx, cy, R, { fill: C.gold, opacity: .18, stroke: C.gold, "stroke-width": 1.6 });
    for (var i = 0; i < 12; i++) {
      var a = i * Math.PI / 6;
      VZ.ln(svg, cx + (R + 10) * Math.cos(a), cy + (R + 10) * Math.sin(a),
        cx + (R + 20) * Math.cos(a), cy + (R + 20) * Math.sin(a),
        { stroke: C.gold, "stroke-width": 1.2, opacity: .5 });
    }
    VZ.txt(svg, cx, cy + R + 36, "太阳", { size: 12.5, fill: C.gold, anchor: "middle" });
    /* 日面半径参考圈（b = R☉） */
    VZ.circ(svg, cx, cy, R, { stroke: C.ink2, "stroke-width": .8, "stroke-dasharray": "4 4", opacity: .55 });
    var rLbl = VZ.txt(svg, cx - R - 12, cy - R * .55, "b = R☉", { size: 10.5, fill: C.ink2, anchor: "end" });

    /* 光线：入射直线 + 偏折出射线 */
    var inPath = VZ.path(svg, "", VZ.stroke({ stroke: C.cyan, "stroke-width": 2 }));
    var outPath = VZ.path(svg, "", VZ.stroke({ stroke: C.cyan, "stroke-width": 2 }));
    var photon = VZ.circ(svg, 30, 124, 5, { fill: C.ink });
    var bLine = VZ.path(svg, "", VZ.stroke({ stroke: C.violet, "stroke-width": 1, "stroke-dasharray": "3 4", opacity: .8 }));
    var bTag = VZ.txt(svg, 0, 0, "", { size: 11, fill: C.violet });
    var hitRing = VZ.circ(svg, cx, cy - b, 9, { stroke: C.gold, "stroke-width": 1.4, fill: "none" });
    var aLbl = VZ.txt(svg, 0, 0, "", { size: 12.5, fill: C.gold, weight: 700 });
    VZ.txt(svg, 34, 44, "遥远星光", { size: 11.5, fill: C.cyan });
    VZ.txt(svg, 726, 292, "观测者", { size: 11.5, fill: C.cyan, anchor: "end" });

    function redraw() {
      var py = cy - b;
      var aSec = 1.75 * R / b;              /* 真实偏折角（角秒） */
      var aVis = aSec * 14 * Math.PI / 180; /* 视觉放大 14 倍 */
      inPath.setAttribute("d", "M30 " + py + "L" + cx + " " + py);
      var L = (W - 16 - cx) / Math.cos(aVis);
      var ex = cx + L * Math.cos(aVis), ey = py + L * Math.sin(aVis);
      outPath.setAttribute("d", "M" + cx + " " + py + "L" + ex.toFixed(1) + " " + ey.toFixed(1));
      hitRing.setAttribute("cx", cx); hitRing.setAttribute("cy", py);
      bLine.setAttribute("d", "M" + cx + " " + cy + "L" + cx + " " + py);
      bTag.setAttribute("x", cx + 8); bTag.setAttribute("y", (cy - b / 2 + 4).toFixed(1));
      bTag.textContent = "b = " + (b / R).toFixed(2) + " R☉";
      aLbl.setAttribute("x", Math.min(ex - 60, 700)); aLbl.setAttribute("y", Math.max(ey - 14, 24));
      aLbl.textContent = "α = " + aSec.toFixed(2) + "″";
      hitRing.setAttribute("stroke", Math.abs(b - R) < 5 ? C.red : C.gold);
      VZ.setPanel(info, {
        "掠日距离 b": (b / R).toFixed(2) + " R☉",
        "偏折角 α（广义相对论）": aSec.toFixed(2) + "″",
        "牛顿值 α/2": (aSec / 2).toFixed(2) + "″",
        "备注": Math.abs(b - R) < 5 ? "★ 日面切线：1.75″（1919 实测）" : "—"
      });
      return { py: py, aVis: aVis };
    }
    var info = VZ.panel(stage, { "掠日距离 b": "", "偏折角 α（广义相对论）": "", "牛顿值 α/2": "", "备注": "—" });

    /* 光子沿当前路径跑 */
    var geo = redraw();
    VZ.raf(svg, function (t) {
      var per = 3.2, u = (t % per) / per;
      var x, y;
      if (u < 0.45) { var v1 = u / 0.45; x = VZ.lerp(30, cx, v1); y = geo.py; }
      else {
        var v2 = (u - 0.45) / 0.55;
        var L = (W - 16 - cx) / Math.cos(geo.aVis);
        x = cx + VZ.lerp(0, L, v2) * Math.cos(geo.aVis);
        y = geo.py + VZ.lerp(0, L, v2) * Math.sin(geo.aVis);
      }
      photon.setAttribute("cx", x); photon.setAttribute("cy", y);
    });

    /* 拖拽：上下移动改变 b */
    VZ.drag(svg, svg, W, H, function (x, y, phase) {
      if (phase === "move" || phase === "start") {
        var nb = VZ.clamp(cy - y, 52, 126);
        if (Math.abs(nb - b) > 0.5 || phase === "start") { b = nb; geo = redraw(); }
      }
    });
  }
},

/* ==========================================================
   ch20b · 最小作用量：拖中间控制点，S 在真实轨迹处最小
   ========================================================== */
"f-ch20b": {
  title: "最小作用量原理：自然界挑 S 最小的那条路",
  hint: "<b>拖动中间的空心手柄</b>把路径掰弯：作用量 S 的读数跟着变。<span class='hl'>只有当路径贴上绿色抛物线时 S 才最小</span>——那条线正是牛顿力学算出的真实轨迹。 " + "费曼的诠释：粒子其实「试探」了所有路径，但只有驻定路径的相位互相加强。整个拉格朗日力学就是把「找这条线」变成一个求极值问题。",
  draw: function (stage) {
    var W = 760, H = 360, svg = VZ.S(stage, W, H, { grid: true });
    var C = VZ.C;
    var A = [70, 80], B = [690, 270];   /* 固定端点 */
    var M = [380, 150];                 /* 可拖控制点 */
    var T = 2, g = 9.8;

    /* 真实轨迹：固定时间下连接 A、B 的抛物线（y 向下为正） */
    function yTrue(t) {
      var v0 = (B[1] - A[1] + 0.5 * g * T * T) / T;
      return A[1] + v0 * t - 0.5 * g * t * t;
    }
    var truePts = [];
    for (var i = 0; i <= 60; i++) truePts.push([VZ.lerp(A[0], B[0], i / 60), yTrue(T * i / 60)]);
    VZ.path(svg, truePts.map(function (p, j) { return (j ? "L" : "M") + p[0].toFixed(1) + " " + p[1].toFixed(1); }).join(""),
      VZ.stroke({ stroke: C.green, "stroke-width": 2, "stroke-dasharray": "7 5", opacity: .85 }));
    VZ.txt(svg, B[0] - 8, B[1] + 30, "绿色：真实轨迹（牛顿力学）", { size: 11.5, fill: C.green, anchor: "end" });

    VZ.circ(svg, A[0], A[1], 7, { fill: C.cyan });
    VZ.txt(svg, A[0] - 2, A[1] - 16, "起点 A", { size: 12, fill: C.cyan });
    VZ.circ(svg, B[0], B[1], 7, { fill: C.cyan });
    VZ.txt(svg, B[0] - 46, B[1] - 16, "终点 B（固定）", { size: 12, fill: C.cyan });

    /* 作用量：S = ∫(½v² + g·y)dt 的数值积分（差一个常数，不影响极值点） */
    function action(ctrl) {
      var S = 0, N = 120, prev = [A[0], A[1]];
      for (var k = 1; k <= N; k++) {
        var u = k / N;
        var x = (1 - u) * (1 - u) * A[0] + 2 * (1 - u) * u * ctrl[0] + u * u * B[0];
        var y = (1 - u) * (1 - u) * A[1] + 2 * (1 - u) * u * ctrl[1] + u * u * B[1];
        var vx = (x - prev[0]) / (T / N), vy = (y - prev[1]) / (T / N);
        S += (0.5 * (vx * vx + vy * vy) + g * y) * (T / N);
        prev = [x, y];
      }
      return S;
    }
    var Smin = action([2 * truePts[30][0] - 0.25 * (A[0] + B[0]), 2 * truePts[30][1] - 0.25 * (A[1] + B[1])]);

    var curPath = VZ.path(svg, "", VZ.stroke({ stroke: C.gold, "stroke-width": 2.2 }));
    var handle = VZ.circ(svg, M[0], M[1], 9, { fill: C.deep, stroke: C.gold, "stroke-width": 2.4 });
    var handleGlow = VZ.circ(svg, M[0], M[1], 15, { stroke: C.gold, "stroke-width": 1, opacity: .4, "stroke-dasharray": "3 3" });
    var msg = VZ.txt(svg, 380, 336, "", { size: 13.5, fill: C.gold, anchor: "middle", weight: 700 });

    function redraw() {
      var d = "M" + A[0] + " " + A[1] + "Q" + M[0] + " " + M[1] + " " + B[0] + " " + B[1];
      curPath.setAttribute("d", d);
      handle.setAttribute("cx", M[0]); handle.setAttribute("cy", M[1]);
      handleGlow.setAttribute("cx", M[0]); handleGlow.setAttribute("cy", M[1]);
      var dS = action(M) - Smin;
      var pct = dS / Math.abs(Smin) * 100;
      if (pct < 0.8) {
        msg.textContent = "★ S 已最小：这就是自然界真正走的那条路";
        msg.setAttribute("fill", C.green);
      } else {
        msg.textContent = "S − S_min = +" + dS.toFixed(0) + "（比真实轨迹多 " + pct.toFixed(0) + "%）";
        msg.setAttribute("fill", C.gold);
      }
      VZ.setPanel(info, { "作用量 S": (Smin + dS).toFixed(0), "S_min（真实轨迹）": Smin.toFixed(0), "路径形状": pct < 0.8 ? "抛物线 ✓" : "被拖弯了" });
    }
    var info = VZ.panel(stage, { "作用量 S": "", "S_min（真实轨迹）": "", "路径形状": "" });

    var fly = VZ.circ(svg, A[0], A[1], 4.5, { fill: C.gold, opacity: .9 });
    redraw();
    VZ.raf(svg, function (t) {
      var u = (t % 2.2) / 2.2, iu = 1 - u;
      var x = iu * iu * A[0] + 2 * iu * u * M[0] + u * u * B[0];
      var y = iu * iu * A[1] + 2 * iu * u * M[1] + u * u * B[1];
      fly.setAttribute("cx", x); fly.setAttribute("cy", y);
    });
    VZ.drag(svg, svg, W, H, function (x, y, phase) {
      if (phase === "start" && Math.hypot(x - M[0], y - M[1]) > 60) return;
      if (phase === "start" || phase === "move") {
        M[0] = VZ.clamp(x, 140, 620); M[1] = VZ.clamp(y, 40, 320);
        redraw();
      }
    });
  }
},

/* ==========================================================
   ch20c · 单摆相图：拖初始条件，看椭圆轨道与越顶旋转
   ========================================================== */
"f-ch20c": {
  title: "单摆的相空间：能量低走闭合椭圆，能量高翻过顶点",
  hint: "在<b>右边相图里任意点一下或拖动</b>，设定摆的初始状态 (θ, ω)：能量低于分离线时轨道是闭合的——摆永远来回摆；越过分离线，轨道变成波浪线——<span class='hl'>摆开始整圈旋转，再也回不来</span>。 " + "左边的单摆与右边的相点严格同步。哈密顿力学的核心图景：运动 = 相空间里沿能量等高线流动，绝跨不上别的等高线。",
  draw: function (stage) {
    var W = 760, H = 350, svg = VZ.S(stage, W, H, { grid: true });
    var C = VZ.C;
    var ox = 500, oy = 175, sx = 220 / (3 * Math.PI), sy = 130 / 2.6;
    function px(th) { return ox + th * sx; }
    function py(w) { return oy - w * sy; }

    /* 相图坐标轴 */
    var ar1 = VZ.arrowDef(svg, VZ.uid("ar"), C.ink2), ar2 = VZ.arrowDef(svg, VZ.uid("ar"), C.ink2);
    VZ.ln(svg, ox - 232, oy, ox + 240, oy, { stroke: C.faint, "stroke-width": 1, "marker-end": ar1 });
    VZ.ln(svg, ox, oy - 142, ox, oy + 148, { stroke: C.faint, "stroke-width": 1, "marker-end": ar2 });
    VZ.txt(svg, ox + 236, oy + 18, "θ", { size: 12.5, fill: C.dim });
    VZ.txt(svg, ox + 10, oy - 134, "ω", { size: 12.5, fill: C.dim });
    [-2 * Math.PI, -Math.PI, 0, Math.PI, 2 * Math.PI].forEach(function (th) {
      VZ.txt(svg, px(th), oy + 16, th === 0 ? "0" : (th > 0 ? "" : "−") + Math.abs(th / Math.PI) + "π", { size: 10, fill: C.dim, anchor: "middle" });
    });

    /* 分离线（E = 2ω₀²）与若干能量轨道 */
    function orbitPath(E) {
      var d = "", th;
      if (E < 2) {
        var thMax = Math.acos(1 - E); /* cosθ_min = 1−E */
        for (var i = 0; i <= 80; i++) {
          th = -thMax + 2 * thMax * i / 80;
          var w = Math.sqrt(Math.max(E - 2 * (1 - Math.cos(th)), 0));
          d += (i ? "L" : "M") + px(th).toFixed(1) + " " + py(w).toFixed(1);
        }
        for (var j = 80; j >= 0; j--) {
          th = -thMax + 2 * thMax * j / 80;
          var w2 = -Math.sqrt(Math.max(E - 2 * (1 - Math.cos(th)), 0));
          d += "L" + px(th).toFixed(1) + " " + py(w2).toFixed(1);
        }
      } else {
        var wTop = Math.sqrt(E - 0);
        for (var k2 = 0; k2 <= 160; k2++) {
          th = -3 * Math.PI + 6 * Math.PI * k2 / 160;
          var w3 = Math.sqrt(Math.max(E - 2 * (1 - Math.cos(th)), 0));
          d += (k2 ? "L" : "M") + px(th).toFixed(1) + " " + py(w3).toFixed(1);
        }
        for (var k3 = 160; k3 >= 0; k3--) {
          th = -3 * Math.PI + 6 * Math.PI * k3 / 160;
          var w4 = -Math.sqrt(Math.max(E - 2 * (1 - Math.cos(th)), 0));
          d += "L" + px(th).toFixed(1) + " " + py(w4).toFixed(1);
        }
      }
      return d + "Z";
    }
    [0.5, 1.0, 1.6].forEach(function (E) {
      VZ.path(svg, orbitPath(E), { stroke: C.faint, "stroke-width": 1, fill: "none", opacity: .8 });
    });
    [2.6, 3.4].forEach(function (E) {
      VZ.path(svg, orbitPath(E), { stroke: C.faint, "stroke-width": 1, fill: "none", opacity: .8 });
    });
    VZ.path(svg, orbitPath(2), VZ.stroke({ stroke: C.red, "stroke-width": 1.6, "stroke-dasharray": "6 4", opacity: .9 }));
    VZ.txt(svg, ox - 4, oy - 108, "分离线 E = 2", { size: 11, fill: C.red });

    /* 左侧单摆 */
    var pvx = 150, pvy = 56, PL = 116;
    VZ.circ(svg, pvx, pvy, 4, { fill: C.ink2 });
    var rod = VZ.ln(svg, pvx, pvy, pvx, pvy + PL, VZ.stroke({ stroke: C.ink, "stroke-width": 2 }));
    var bob = VZ.circ(svg, pvx, pvy + PL, 11, { fill: C.gold });
    var bobTrail = VZ.path(svg, "", VZ.stroke({ stroke: C.gold, "stroke-width": 1, opacity: .35, "stroke-dasharray": "3 4" }));

    /* 相点与轨迹 */
    var pDot = VZ.circ(svg, ox, oy, 6, { fill: C.cyan });
    var trailEl = VZ.path(svg, "", VZ.stroke({ stroke: C.cyan, "stroke-width": 1.2, opacity: .6 }));

    var th = 2.2, w = 0, trail = [];
    function setInit(TH, W_) { th = TH; w = W_; trail = []; bobTrail.setAttribute("d", ""); trailEl.setAttribute("d", ""); }
    function energy() { return 0.5 * w * w + 2 * (1 - Math.cos(th)); }
    var info = VZ.panel(stage, { "能量 E": "", "运动状态": "" });
    function upd() {
      var p = [px(th), py(w)];
      pDot.setAttribute("cx", p[0]); pDot.setAttribute("cy", p[1]);
      bob.setAttribute("cx", pvx + PL * Math.sin(th));
      bob.setAttribute("cy", pvy + PL * Math.cos(th));
      rod.setAttribute("x2", pvx + PL * Math.sin(th)); rod.setAttribute("y2", pvy + PL * Math.cos(th));
      var E = energy(), regime = E < 2 ? "摆动（闭合轨道）" : E > 2 ? "旋转（越过顶点）" : "恰在分离线上";
      VZ.setPanel(info, { "能量 E": E.toFixed(2), "运动状态": regime });
      return p;
    }
    upd();
    VZ.raf(svg, function (t, ms) {
      var dt = Math.min(ms / 1000, 0.05);
      for (var s = 0; s < 4; s++) {
        w += -Math.sin(th) * dt / 4;
        th += w * dt / 4;
      }
      if (th > 3 * Math.PI) th -= 6 * Math.PI;
      if (th < -3 * Math.PI) th += 6 * Math.PI;
      var p = upd();
      trail.push(p[0].toFixed(1) + " " + p[1].toFixed(1));
      if (trail.length > 260) trail.shift();
      trailEl.setAttribute("d", "M" + trail.join("L"));
      bobTrail.setAttribute("d", trail.reduce(function (acc, q) {
        var xy = q.split(" ");
        var bx = pvx + PL * Math.sin((+xy[0] - ox) / sx);
        var by = pvy + PL * Math.cos((+xy[0] - ox) / sx);
        return acc + (acc ? "L" : "M") + bx.toFixed(1) + " " + by.toFixed(1);
      }, ""));
    });

    /* 拖动设定初始状态 */
    VZ.drag(svg, svg, W, H, function (x, y, phase) {
      if (x < ox - 240) return;
      if (phase === "start" || phase === "move") {
        setInit(VZ.clamp((x - ox) / sx, -3 * Math.PI, 3 * Math.PI), VZ.clamp((oy - y) / sy, -2.5, 2.5));
      }
    });
    VZ.txt(svg, 40, 330, "在相图上拖动 = 给摆一个新的初始状态", { size: 12, fill: C.ink2 });
  }
},

/* ==========================================================
   ch21b · 双缝干涉：滑波长 / 缝距，条纹间距实时变
   ========================================================== */
"f-ch21b": {
  title: "双缝干涉：条纹间距 Δy = λL/d",
  hint: "拖两个滑杆改<b>波长 λ</b> 与<b>缝距 d</b>：λ 变长或 d 变小，条纹都变稀。<span class='hl'>间距严格按 Δy = λL/d 变化（L = 2 m，读数是真实毫米值）</span>。 " + "注意右屏上的落点是<b>一颗一颗随机累积</b>的——单个电子不可预测，但千千万万次之后条纹必然浮现。这正是 |ψ|² 的含义：概率决定统计，不决定个体。",
  draw: function (stage) {
    var W = 760, H = 340, svg = VZ.S(stage, W, H, { grid: true });
    var C = VZ.C;
    var srcX = 60, wallX = 300, scrX = 640, top = 36, bot = 268, midY = (top + bot) / 2;
    var L = 2000, lam = 550, dUm = 200; /* nm, μm, mm */
    var kPx = 4;   /* 屏上 1 mm = 4 px */
    var ySpan = (bot - top) / 2 / kPx; /* ±29 mm */

    /* 电子源与双缝 */
    VZ.card(svg, 24, midY - 26, 56, 52, { stroke: C.faint });
    VZ.txt(svg, 52, midY - 34, "电子源", { size: 11.5, fill: C.ink, anchor: "middle" });
    var dPx = dUm * 0.35;
    function slits() {
      svg.querySelectorAll(".slitbar").forEach(function (n) { n.remove(); });
      var gap = dPx / 2;
      VZ.ln(svg, wallX, top, wallX, midY - gap - 12, { stroke: C.ink, "stroke-width": 4, class: "slitbar" });
      VZ.ln(svg, wallX, midY - gap + 12, wallX, midY + gap - 12, { stroke: C.ink, "stroke-width": 4, class: "slitbar" });
      VZ.ln(svg, wallX, midY + gap + 12, wallX, bot, { stroke: C.ink, "stroke-width": 4, class: "slitbar" });
    }
    slits();
    VZ.txt(svg, wallX - 10, top - 6, "双缝（间距可调）", { size: 11.5, fill: C.ink, anchor: "end" });
    VZ.ln(svg, scrX, top, scrX, bot, { stroke: C.ink2, "stroke-width": 3 });
    VZ.txt(svg, scrX - 6, bot + 18, "屏", { size: 12, fill: C.ink2, anchor: "end" });

    /* 屏上强度分布（真实物理：I = cos²(πd y / λL)） */
    function intensity(yMm) {
      var phase = Math.PI * dUm * yMm / (2 * lam); /* λ nm, d μm, y mm, L=2m */
      return Math.pow(Math.cos(phase), 2);
    }
    var pat = VZ.g(svg), hits = VZ.g(svg);
    function drawPattern() {
      while (pat.firstChild) pat.removeChild(pat.firstChild);
      for (var y = top; y <= bot; y += 2) {
        var I = intensity((y - midY) / kPx);
        VZ.ln(pat, scrX + 4, y, scrX + 4 + 38 * I, y, { stroke: C.gold, "stroke-width": 2, opacity: .3 + .65 * I });
      }
      /* 中央亮纹到相邻亮纹的标注 */
      var dyMm = 2 * lam / dUm;
      var y1 = midY, y2 = midY - dyMm * kPx;
      if (y2 > top + 8) {
        VZ.ln(pat, scrX - 14, y1, scrX - 14, y2, VZ.stroke({ stroke: C.green, "stroke-width": 1.2 }));
        VZ.txt(pat, scrX - 20, (y1 + y2) / 2 + 4, "Δy", { size: 11, fill: C.green, anchor: "end" });
      }
    }
    drawPattern();

    /* 到达电子：按强度采样，随机累积 */
    var counts = { n: 0 };
    VZ.raf(svg, function (t, ms) {
      var n = Math.floor(t * 16);
      while (counts.n < n) {
        counts.n++;
        var yMm = (Math.random() * 2 - 1) * ySpan;
        if (Math.random() < intensity(yMm)) {
          VZ.circ(hits, scrX + 48 + Math.random() * 10, midY + yMm * kPx, 1.8, { fill: C.gold });
          if (hits.childNodes.length > 380) hits.removeChild(hits.firstChild);
        }
      }
    });

    var info = VZ.panel(stage, { "波长 λ": "", "缝距 d": "", "条纹间距 Δy = λL/d": "" });
    function updInfo() {
      VZ.setPanel(info, {
        "波长 λ": lam + " nm",
        "缝距 d": dUm + " μm",
        "条纹间距 Δy = λL/d": (2 * lam / dUm).toFixed(2) + " mm"
      });
    }
    updInfo();
    VZ.slider(stage, {
      label: "波长 λ", value: 550, min: 400, max: 700, step: 10,
      format: function (v) { return v + " nm"; },
      onInput: function (v) { lam = v; drawPattern(); updInfo(); }
    });
    VZ.slider(stage, {
      label: "缝距 d", value: 200, min: 60, max: 500, step: 10,
      format: function (v) { return v + " μm"; },
      onInput: function (v) { dUm = v; dPx = v * 0.35; slits(); drawPattern(); updInfo(); }
    });
    var beam = VZ.circ(svg, 52, midY, 3.5, { fill: C.cyan, opacity: .9 });
    VZ.raf(svg, function (t) {
      var u = (t % 1.4) / 1.4;
      beam.setAttribute("cx", VZ.lerp(52, wallX - 6, u));
    });
  }
},

/* ==========================================================
   ch21c · 不确定性：滑波包宽度 σ，σ·Δp ≥ ħ/2
   ========================================================== */
"f-ch21c": {
  title: "不确定性原理：波包越窄，动量越散",
  hint: "拖滑杆把位置波包<b>压窄或拉宽</b>：左图的 ψ(x) 变窄时，右图的动量分布必然变宽——<span class='hl'>乘积 σ·Δp 永远卡在 ħ/2</span>（高斯波包恰好取等号）。 " + "这不是仪器不够好：位置与动量是同一 波函数的两种傅里叶描述，压缩一个必然撑大另一个。傅里叶变换的数学，就是这条「天条」的来源。",
  draw: function (stage) {
    var W = 760, H = 320, svg = VZ.S(stage, W, H, { grid: true });
    var C = VZ.C;
    var HBAR = 1.054571817e-34;
    var sigma = 1.0; /* nm */

    /* 左图：位置空间 */
    var lx = 60, lw = 300, ly = 40, lh = 200, lcy = ly + lh / 2;
    VZ.card(svg, lx, ly, lw, lh, { stroke: C.faint });
    VZ.ln(svg, lx + 12, lcy, lx + lw - 12, lcy, { stroke: C.faint, "stroke-width": .8 });
    VZ.txt(svg, lx + lw / 2, ly + lh + 20, "位置空间 ψ(x)（横轴 ±8 nm）", { size: 11.5, fill: C.ink2, anchor: "middle" });
    var env = VZ.path(svg, "", VZ.stroke({ stroke: C.cyan, "stroke-width": 2 }));
    var env2 = VZ.path(svg, "", VZ.stroke({ stroke: C.cyan, "stroke-width": 1.2, opacity: .5 }));
    var wave = VZ.path(svg, "", VZ.stroke({ stroke: C.ink2, "stroke-width": 1, opacity: .75 }));
    var sBarL = VZ.ln(svg, 0, 0, 0, 0, VZ.stroke({ stroke: C.gold, "stroke-width": 1.4, "stroke-dasharray": "4 3" }));
    var sBarR = VZ.ln(svg, 0, 0, 0, 0, VZ.stroke({ stroke: C.gold, "stroke-width": 1.4, "stroke-dasharray": "4 3" }));
    var sTagL = VZ.txt(svg, 0, ly + 18, "σ", { size: 12, fill: C.gold, anchor: "middle" });
    function xScale(nm) { return lcx + nm / 8 * (lw / 2 - 12); }
    var lcx = lx + lw / 2;

    /* 右图：动量空间 */
    var rx = 430, rw = 290, ry = 40, rh = 200, rcx = rx + rw / 2, rcy = ry + rh / 2;
    VZ.card(svg, rx, ry, rw, rh, { stroke: C.faint });
    VZ.ln(svg, rx + 12, rcy, rx + rw - 12, rcy, { stroke: C.faint, "stroke-width": .8 });
    VZ.txt(svg, rx + rw / 2, ry + rh + 20, "动量空间 φ(p)（横轴 ±2.5×10⁻²⁵）", { size: 11.5, fill: C.ink2, anchor: "middle" });
    var pDist = VZ.path(svg, "", { stroke: C.mag, "stroke-width": 2, fill: "none" });
    var pFill = VZ.path(svg, "", { fill: C.mag, opacity: .14, stroke: "none" });
    function pScale(pv) { return rcx + pv / 2.5 * (rw / 2 - 12); } /* pv 单位 10⁻²⁵ */

    function redraw() {
      var sNm = sigma;
      /* 左：包络与载波 */
      var de = "", de2 = "", dw = "";
      for (var i = 0; i <= 120; i++) {
        var nx = -8 + 16 * i / 120;
        var val = Math.exp(-nx * nx / (2 * sNm * sNm));
        var X = xScale(nx);
        de += (i ? "L" : "M") + X.toFixed(1) + " " + (lcy - val * 84).toFixed(1);
        de2 += (i ? "L" : "M") + X.toFixed(1) + " " + (lcy + val * 84).toFixed(1);
        dw += (i ? "L" : "M") + X.toFixed(1) + " " + (lcy - val * Math.cos(nx * 7.2 - ph) * 84).toFixed(1);
      }
      env.setAttribute("d", de); env2.setAttribute("d", de2); wave.setAttribute("d", dw);
      var sPx = sNm / 8 * (lw / 2 - 12);
      [sBarL, sBarR].forEach(function (bar, idx) {
        var X = lcx + (idx ? sPx : -sPx);
        bar.setAttribute("x1", X); bar.setAttribute("x2", X);
        bar.setAttribute("y1", lcy - 96); bar.setAttribute("y2", lcy + 96);
      });
      sTagL.setAttribute("x", lcx);
      /* 右：动量分布，宽 = ħ/(2σ) */
      var dp = HBAR / (2 * sNm * 1e-9) / 1e-25; /* 单位 10⁻²⁵ */
      var dpd = "", dpf = "";
      for (var j = 0; j <= 100; j++) {
        var pv = -2.5 + 5 * j / 100;
        var g = Math.exp(-pv * pv / (2 * dp * dp));
        var XX = pScale(pv), YY = rcy - g * 84;
        dpd += (j ? "L" : "M") + XX.toFixed(1) + " " + YY.toFixed(1);
        dpf += (j ? "L" : "M") + XX.toFixed(1) + " " + YY.toFixed(1);
      }
      pDist.setAttribute("d", dpd);
      pFill.setAttribute("d", dpf + "L" + (rx + rw - 12) + " " + rcy + "L" + (rx + 12) + " " + rcy + "Z");
      VZ.setPanel(info, {
        "位置不确定度 σ": sNm.toFixed(2) + " nm",
        "动量不确定度 Δp = ħ/(2σ)": dp.toFixed(3) + "×10⁻²⁵ kg·m/s",
        "乘积 σ·Δp": "ħ/2 = " + (HBAR / 2 * 1e34).toFixed(2) + "×10⁻³⁴ J·s（恒定）"
      });
    }
    var ph = 0;
    var info = VZ.panel(stage, { "位置不确定度 σ": "", "动量不确定度 Δp = ħ/(2σ)": "", "乘积 σ·Δp": "" });
    VZ.raf(svg, function (t, ms) { ph += ms / 1000 * 6; redraw(); });
    redraw();

    VZ.slider(stage, {
      label: "波包宽度 σ", value: 1.0, min: 0.4, max: 3, step: 0.05,
      format: function (v) { return v.toFixed(2) + " nm"; },
      onInput: function (v) { sigma = v; }
    });
    VZ.legend(stage, [["ψ(x) 包络", C.cyan], ["载波（相位在动）", C.ink2, "line"], ["动量分布 φ(p)", C.mag]]);
  }
},

/* ==========================================================
   ch22b · 布洛赫球：拖态矢量，读出 |ψ⟩ 系数
   ========================================================== */
"f-ch22b": {
  title: "布洛赫球：每个二态量子态都是球面上的一点",
  hint: "<b>在球面上拖动</b>那个态矢量：极角 θ 与方位角 φ 一变，右边的 |ψ⟩ 系数跟着变。<span class='hl'>北极端对应 |0⟩、南极对应 |1⟩，赤道上是两份各半的叠加</span>。 " + "注意一个细节：态只差一个整体相位时物理上完全等价，所以布洛赫球是「相位约定之后」的地图——它把二维复希尔伯特空间压成一个真正的球面。",
  draw: function (stage) {
    var W = 760, H = 360, svg = VZ.S(stage, W, H, { grid: true });
    var C = VZ.C;
    var cx = 210, cy = 185, R = 118;

    /* 球体轮廓与经纬 */
    var sph = VZ.grad(svg, VZ.uid("bs"), [[0, "#2a2260"], [1, "#161036"]], true);
    VZ.circ(svg, cx, cy, R, { fill: sph, stroke: C.faint, "stroke-width": 1.2 });
    VZ.path(svg, "M" + (cx - R) + " " + cy + "A" + R + " " + (R * .32) + " 0 0 0 " + (cx + R) + " " + cy, { stroke: C.faint, "stroke-width": .9, opacity: .7 });
    VZ.path(svg, "M" + (cx - R) + " " + cy + "A" + R + " " + (R * .32) + " 0 0 1 " + (cx + R) + " " + cy, { stroke: C.faint, "stroke-width": .9, opacity: .35 });
    VZ.ln(svg, cx, cy - R - 14, cx, cy + R + 14, { stroke: C.faint, "stroke-width": .9, "stroke-dasharray": "4 4" });
    VZ.txt(svg, cx + 8, cy - R - 4, "|0⟩", { size: 12.5, fill: C.cyan, weight: 700 });
    VZ.txt(svg, cx + 8, cy + R + 10, "|1⟩", { size: 12.5, fill: C.mag, weight: 700 });
    VZ.txt(svg, cx - R - 8, cy - 8, "赤道", { size: 10.5, fill: C.dim, anchor: "end" });

    /* 态矢量 */
    var theta = 1.1, phi = 0.6;
    var vec = VZ.path(svg, "", VZ.stroke({ stroke: C.gold, "stroke-width": 3 }));
    var tip = VZ.circ(svg, 0, 0, 8, { fill: C.gold });
    var tipRing = VZ.circ(svg, 0, 0, 14, { stroke: C.gold, "stroke-width": 1, opacity: .5, "stroke-dasharray": "3 3" });
    var eqDot = VZ.circ(svg, 0, 0, 3.5, { fill: C.ink2, opacity: .8 });
    var dropLn = VZ.path(svg, "", VZ.stroke({ stroke: C.ink2, "stroke-width": 1, "stroke-dasharray": "3 4", opacity: .6 }));
    var arcPhi = VZ.path(svg, "", VZ.stroke({ stroke: C.violet, "stroke-width": 1.2, opacity: .8 }));

    function proj(th, ph) {
      var st = Math.sin(th), x = R * st * Math.cos(ph), z = R * Math.cos(th);
      var depth = R * st * Math.sin(ph);
      return { x: cx + x, y: cy - z, depth: depth, st: st, z: z };
    }
    var dragging = false;
    function draw() {
      var p = proj(theta, phi);
      vec.setAttribute("d", "M" + cx + " " + cy + "L" + p.x.toFixed(1) + " " + p.y.toFixed(1));
      tip.setAttribute("cx", p.x); tip.setAttribute("cy", p.y);
      tip.setAttribute("r", 8 - p.depth / R * 2.5);
      tipRing.setAttribute("cx", p.x); tipRing.setAttribute("cy", p.y);
      eqDot.setAttribute("cx", cx + p.st * R * Math.cos(phi));
      eqDot.setAttribute("cy", cy);
      dropLn.setAttribute("d", "M" + p.x.toFixed(1) + " " + p.y.toFixed(1) + "L" + (cx + p.st * R * Math.cos(phi)).toFixed(1) + " " + cy);
      var e0 = Math.cos(theta / 2), s1 = Math.sin(theta / 2);
      var coef = s1 < 1e-4 ? "" : (s1 * Math.cos(phi) >= 0 ? " + " : " − ") + s1.toFixed(2) + "e^" + (Math.abs(Math.sin(phi)) < 1e-4 && Math.cos(phi) > 0 ? "i0" : "i" + ((phi % (2 * Math.PI)) * 180 / Math.PI).toFixed(0) + "°");
      psiTxt.textContent = "|ψ⟩ = " + e0.toFixed(2) + "|0⟩" + coef;
      var p1 = s1 * s1;
      bar0.setAttribute("width", (1 - p1) * 200);
      bar1.setAttribute("width", p1 * 200);
      bar1.setAttribute("x", bar0x + (1 - p1) * 200);
      VZ.setPanel(info, {
        "极角 θ": (theta * 180 / Math.PI).toFixed(0) + "°",
        "方位角 φ": (((phi % (2 * Math.PI)) + 2 * Math.PI) % (2 * Math.PI) * 180 / Math.PI).toFixed(0) + "°",
        "P(测得 |1⟩)": (p1 * 100).toFixed(1) + "%"
      });
    }

    /* 右侧读出 */
    VZ.card(svg, 400, 60, 330, 130, { stroke: "rgba(255,255,255,.12)" });
    var psiTxt = VZ.txt(svg, 420, 92, "", { size: 14.5, fill: C.ink, weight: 700 });
    VZ.txt(svg, 420, 118, "测量得到 |1⟩ 的概率：", { size: 12, fill: C.ink2 });
    var bar0x = 420;
    var bar0 = VZ.path(svg, "M" + bar0x + " 138h200", VZ.stroke({ stroke: C.cyan, "stroke-width": 9, opacity: .8 }));
    var bar1 = VZ.path(svg, "", VZ.stroke({ stroke: C.mag, "stroke-width": 9, opacity: .85 }));
    VZ.txt(svg, 420, 172, "横条：左 |0⟩ 概率 / 右 |1⟩ 概率", { size: 10.5, fill: C.dim });
    var info = VZ.panel(stage, { "极角 θ": "", "方位角 φ": "", "P(测得 |1⟩)": "" });

    draw();
    /* 空闲时方位角缓慢进动（拖动时暂停） */
    VZ.raf(svg, function (t, ms) {
      if (!dragging) { phi += ms / 1000 * 0.35; draw(); }
    });
    VZ.drag(svg, svg, W, H, function (x, y, phase) {
      if (phase === "start" && Math.hypot(x - cx, y - cy) > R + 40) return;
      if (phase === "start") dragging = true;
      if (phase === "end") { dragging = false; return; }
      var dx = x - cx, up = cy - y;
      theta = VZ.clamp(Math.acos(VZ.clamp(up / R, -1, 1)), 0.02, Math.PI - 0.02);
      var st = Math.sin(theta), ct = Math.cos(phi);
      if (st > 1e-3) {
        var c = VZ.clamp(dx / (R * st), -1, 1);
        var cand = [Math.acos(c), -Math.acos(c) + 2 * Math.PI];
        var cur = ((phi % (2 * Math.PI)) + 2 * Math.PI) % (2 * Math.PI);
        var best = cand[0], bd = Math.abs(cand[0] - cur);
        if (Math.abs(cand[1] - cur) < bd) best = cand[1];
        /* 平滑过渡：取与当前 phi 最近的等价角 */
        var k = Math.round((phi - best) / (2 * Math.PI));
        phi = best + k * 2 * Math.PI;
      }
      draw();
    });
  }
},

/* ==========================================================
   ch22c · 自旋 1/2：转 360° 变 −ψ（红圈），720° 才复位
   ========================================================== */
"f-ch22c": {
  title: "自旋 1/2：转一圈回来的是「负的自己」",
  hint: "拖滑杆（或点「自动转」）让自旋态绕 z 轴转：<b>转到 360° 时箭头明明回到原方向，态却整体乘了 −1</b>——红圈亮起；要转到 720° 才真正还原成 +ψ。 " + "1975 年中子干涉实验真的验证了这一点。几何上转一圈、量子相位上转半圈：这就是<span class='hl'>旋量（spinor）</span>的标志，也是第 22 章那个「手指压杯子转两圈」小实验的数学版本。",
  draw: function (stage) {
    var W = 760, H = 340, svg = VZ.S(stage, W, H, { grid: true });
    var C = VZ.C;
    var cx = 220, cy = 168, R = 96;
    var alpha = 0, playing = false;

    /* 转盘 */
    VZ.circ(svg, cx, cy, R, { fill: "rgba(255,255,255,.03)", stroke: C.faint, "stroke-width": 1.2 });
    for (var i = 0; i < 8; i++) {
      var a = i * Math.PI / 4;
      VZ.ln(svg, cx + (R - 8) * Math.cos(a), cy + (R - 8) * Math.sin(a),
        cx + R * Math.cos(a), cy + R * Math.sin(a), { stroke: C.faint, "stroke-width": 1.2 });
    }
    VZ.txt(svg, cx, cy - R - 14, "绕 z 轴旋转（俯视）", { size: 12, fill: C.ink2, anchor: "middle" });
    VZ.txt(svg, cx - R - 4, cy + 4, "0°", { size: 10.5, fill: C.dim, anchor: "end" });

    /* 360° 红圈（−ψ 区域）与 720° 绿圈（复位） */
    var negRing = VZ.circ(svg, cx, cy, R + 12, { stroke: C.red, "stroke-width": 2.4, opacity: 0 });
    var negTag = VZ.txt(svg, cx, cy - R - 36, "", { size: 13.5, fill: C.red, anchor: "middle", weight: 700 });
    VZ.circ(svg, cx, cy, R + 12, { stroke: C.green, "stroke-width": 1, opacity: .25, "stroke-dasharray": "3 4" });
    VZ.txt(svg, cx + R + 18, cy - R * .72, "720°：+ψ（复位）", { size: 11, fill: C.green });
    VZ.txt(svg, cx + R + 18, cy - R * .45, "红圈 = −ψ 世界", { size: 11, fill: C.red });

    /* 箭头（几何方向每 360° 复位；颜色随相位符号变） */
    var arr = VZ.path(svg, "", VZ.stroke({ stroke: C.gold, "stroke-width": 3.2 }));
    var head = VZ.path(svg, "", { fill: C.gold });
    var phaseArc = VZ.path(svg, "", VZ.stroke({ stroke: C.violet, "stroke-width": 2, opacity: .85 }));
    VZ.circ(svg, cx, cy, 5, { fill: C.ink });

    function draw() {
      var a = (alpha % 720) * Math.PI / 180;
      var ex = cx + (R - 18) * Math.cos(-a), ey = cy + (R - 18) * Math.sin(-a);
      arr.setAttribute("d", "M" + cx + " " + cy + "L" + ex.toFixed(1) + " " + ey.toFixed(1));
      var ux = Math.cos(-a), uy = -Math.sin(-a);
      head.setAttribute("d", "M" + (ex + 10 * ux).toFixed(1) + " " + (ey + 10 * uy).toFixed(1) +
        "L" + (ex - 4 * uy).toFixed(1) + " " + (ey + 4 * ux).toFixed(1) +
        "L" + (ex + 4 * uy).toFixed(1) + " " + (ey - 4 * ux).toFixed(1) + "z");
      var isNeg = (alpha % 720) >= 360;
      var col = isNeg ? C.red : C.gold;
      arr.setAttribute("stroke", col); head.setAttribute("fill", col);
      negRing.setAttribute("opacity", isNeg ? .85 : 0);
      negTag.textContent = isNeg ? "−ψ（整体差一个负号！）" : (alpha % 720) === 0 && alpha > 0 ? "+ψ 已复位" : "";
      /* 相位弧：α/2（旋量转半圈角） */
      var half = (alpha % 720) * Math.PI / 360;
      var big = half > Math.PI ? 1 : 0;
      phaseArc.setAttribute("d", "M" + cx + " " + (cy - 34) + "A34 34 0 " + big + " 0 " +
        (cx + 34 * Math.sin(half)).toFixed(1) + " " + (cy - 34 * Math.cos(half)).toFixed(1));
      var cph = Math.cos(half), sph = Math.sin(half);
      VZ.setPanel(info, {
        "旋转角 α": (alpha % 720).toFixed(0) + "°",
        "几何方向": (alpha % 360).toFixed(0) + "°（同出发时）",
        "量子相位 e^{iα/2}": isNeg ? "−1（实部 " + cph.toFixed(2) + "）" : "+" + (Math.abs(sph) < 1e-3 && cph > 0 ? "1" : "（实部 " + cph.toFixed(2) + "）"),
        "态": isNeg ? "−ψ" : "+ψ"
      });
    }
    var info = VZ.panel(stage, { "旋转角 α": "", "几何方向": "", "量子相位 e^{iα/2}": "", "态": "+ψ" });
    draw();

    var sl = VZ.slider(stage, {
      label: "旋转角 α", value: 0, min: 0, max: 720, step: 5,
      format: function (v) { return v.toFixed(0) + "°"; },
      onInput: function (v) { alpha = v; playing = false; draw(); }
    });
    var btn = VZ.btn(stage, "自动转 720°", function () { playing = true; });
    VZ.raf(svg, function (t, ms) {
      if (!playing) return;
      alpha = (alpha + ms / 1000 * 180) % 725;
      if (alpha > 720) alpha = 0;
      sl.set(alpha);
      draw();
    });
  }
},

/* ==========================================================
   ch23b · Bell 不等式：量子关联冲破经典边界
   ========================================================== */
"f-ch23b": {
  title: "贝尔不等式：量子关联越过了经典的天花板",
  hint: "拖滑杆改<b>测量角差 θ</b>，竖直游标在两条曲线上取值：金色是任何「定域隐变量」模型的天花板 |E| ≤ 1 − 2θ/π，青色是量子纠缠的真实关联 |E| = |cos θ|。<span class='hl'>两线之间的阴影带就是违反区</span>——实验（1982 年阿斯佩等）毫不含糊地落在青线上。 " + "著名的 CHSH 组合把违反量化为 2√2 &gt; 2：这不是技术误差，而是「开箱前答案早已写好」的世界观的死刑判决。",
  draw: function (stage) {
    var W = 760, H = 330, svg = VZ.S(stage, W, H, { grid: true });
    var C = VZ.C;
    var lx = 70, ly = 30, lw = 620, lh = 220, ox = lx + lw / 2, oy = ly + lh / 2;
    var sX = (lw / 2 - 20) / Math.PI, sY = lh / 2 - 26;

    /* 坐标轴 */
    VZ.ln(svg, lx + 10, oy, lx + lw - 6, oy, { stroke: C.faint, "stroke-width": 1 });
    VZ.ln(svg, ox, ly + 6, ox, ly + lh - 6, { stroke: C.faint, "stroke-width": 1 });
    [0, Math.PI / 2, Math.PI].forEach(function (th, i) {
      VZ.txt(svg, ox + th * sX, oy + 16, ["0", "90°", "180°"][i], { size: 10.5, fill: C.dim, anchor: "middle" });
    });
    VZ.txt(svg, lx + 12, ly + 18, "关联度 E", { size: 11.5, fill: C.dim });
    VZ.txt(svg, lx + lw - 10, oy - 8, "θ（测量角差）", { size: 11, fill: C.dim, anchor: "end" });

    /* 违反区：经典上限线与量子关联线之间的空隙（0→π 一次填充，在 0、π/2、π 三处收窄） */
    (function () {
      var pts = [], th;
      for (th = 0.01; th <= Math.PI - 0.01; th += Math.PI / 120) pts.push([ox + th * sX, oy - (1 - 2 * th / Math.PI) * sY]);
      for (th = Math.PI - 0.01; th >= 0.01; th -= Math.PI / 120) pts.push([ox + th * sX, oy - Math.cos(th) * sY]);
      VZ.poly(svg, pts, { fill: C.red, opacity: .13, stroke: "none", close: true });
    })();
    VZ.txt(svg, ox + sX * 0.28, ly + 44, "违反区", { size: 12, fill: C.red, weight: 700 });
    VZ.txt(svg, ox + sX * 1.55, oy - 18, "违反区", { size: 12, fill: C.red, weight: 700 });

    /* 两条曲线 */
    var dq = "", dc = "";
    for (var i = 0; i <= 180; i++) {
      var th = Math.PI * i / 180;
      dq += (i ? "L" : "M") + (ox + th * sX).toFixed(1) + " " + (oy - Math.cos(th) * sY).toFixed(1);
      dc += (i ? "L" : "M") + (ox + th * sX).toFixed(1) + " " + (oy - (1 - 2 * th / Math.PI) * sY).toFixed(1);
    }
    VZ.path(svg, dq, VZ.stroke({ stroke: C.cyan, "stroke-width": 2.4 }));
    VZ.path(svg, dc, VZ.stroke({ stroke: C.gold, "stroke-width": 2, "stroke-dasharray": "7 5" }));

    /* 游标 */
    var th0 = 60 * Math.PI / 180;
    var cursor = VZ.ln(svg, 0, ly + 6, 0, ly + lh - 6, VZ.stroke({ stroke: C.ink, "stroke-width": 1.2, "stroke-dasharray": "4 4", opacity: .8 }));
    var dotQ = VZ.circ(svg, 0, 0, 6, { fill: C.cyan });
    var dotC = VZ.circ(svg, 0, 0, 5, { fill: C.gold });
    var labQ = VZ.txt(svg, 0, 0, "量子", { size: 11, fill: C.cyan });
    var labC = VZ.txt(svg, 0, 0, "经典上限", { size: 11, fill: C.gold, anchor: "end" });
    function drawCursor() {
      var X = ox + th0 * sX;
      cursor.setAttribute("x1", X); cursor.setAttribute("x2", X);
      var yq = oy - Math.cos(th0) * sY, yc = oy - (1 - 2 * th0 / Math.PI) * sY;
      dotQ.setAttribute("cx", X); dotQ.setAttribute("cy", yq);
      dotC.setAttribute("cx", X); dotC.setAttribute("cy", yc);
      labQ.setAttribute("x", X + 8); labQ.setAttribute("y", yq - 8);
      labC.setAttribute("x", X - 8); labC.setAttribute("y", yc - 8);
      var eq = Math.abs(Math.abs(Math.cos(th0)) - (1 - 2 * th0 / Math.PI)) < 0.02;
      VZ.setPanel(info, {
        "测量角差 θ": (th0 * 180 / Math.PI).toFixed(0) + "°",
        "量子关联 |cos θ|": Math.abs(Math.cos(th0)).toFixed(3),
        "经典上限 1−2θ/π": (1 - 2 * th0 / Math.PI).toFixed(3),
        "判定": eq ? "恰在边界" : (Math.abs(Math.cos(th0)) > Math.abs(1 - 2 * th0 / Math.PI) ? "★ 违反贝尔不等式" : "经典模型应付得来")
      });
    }
    var info = VZ.panel(stage, { "测量角差 θ": "", "量子关联 |cos θ|": "", "经典上限 1−2θ/π": "", "判定": "" });
    drawCursor();
    var scanning = false;
    VZ.btn(stage, "自动扫描 θ", function () { scanning = !scanning; });
    VZ.slider(stage, {
      label: "测量角差 θ", value: 60, min: 0, max: 180, step: 1,
      format: function (v) { return v.toFixed(0) + "°"; },
      onInput: function (v) { th0 = v * Math.PI / 180; scanning = false; drawCursor(); }
    });
    VZ.raf(svg, function (t, ms) {
      if (!scanning) return;
      th0 = (th0 + ms / 1000 * 0.5) % Math.PI;
      drawCursor();
    });
  }
},

/* ==========================================================
   ch23c · 手套 vs 纠缠：开箱前已有答案，还是测量时才生成？
   ========================================================== */
"f-ch23c": {
  title: "分寄的手套与纠缠自旋：统计一比就见分晓",
  hint: "点上方选块改<b>测量角差 θ</b>，两边同时掷 200 对粒子：左边是「开箱前左右已定」的手套模型，右边是量子纠缠（P<sub>同</sub> = sin²(θ/2)）。<span class='hl'>θ = 45° 或 135° 时两边统计明显分道扬镳</span>——手套永远追不上量子。 " + "手套比喻在 θ=0° 和 180° 时完美奏效，贝尔的功绩是找到了中间角度这个「照妖镜」：真实世界站在量子那边。",
  draw: function (stage) {
    var W = 760, H = 350, svg = VZ.S(stage, W, H, { grid: true });
    var C = VZ.C;
    var theta = 45, N = { a: 0, b: 0 }, same = { a: 0, b: 0 };
    var pSameC = function (th) { return th / 180; };        /* 手套（经典） */
    var pSameQ = function (th) { return Math.pow(Math.sin(th * Math.PI / 360), 2); }; /* 量子 sin²(θ/2) */

    function card(x, title, sub, col) {
      VZ.card(svg, x, 36, 330, 236, { stroke: C.faint });
      VZ.txt(svg, x + 18, 64, title, { size: 14, fill: col, weight: 700 });
      VZ.para(svg, x + 18, 86, sub, { size: 11.5, per: 25, lh: 17 });
    }
    card(28, "手套模型（经典关联）", "每对手套在装盒那一刻左/右就已确定；打开盒子只是读出早已写好的答案。", C.gold);
    card(402, "量子纠缠（真实实验）", "每个粒子在被测量之前连答案都还没有；结果是测量瞬间生成的，却严格相关。", C.cyan);

    /* 每边：结果条 + 计数 */
    var barA = VZ.path(svg, "", VZ.stroke({ stroke: C.green, "stroke-width": 18, opacity: .85 }));
    var barB = VZ.path(svg, "", VZ.stroke({ stroke: C.green, "stroke-width": 18, opacity: .85 }));
    var barA2 = VZ.path(svg, "", VZ.stroke({ stroke: C.mag, "stroke-width": 18, opacity: .85 }));
    var barB2 = VZ.path(svg, "", VZ.stroke({ stroke: C.mag, "stroke-width": 18, opacity: .85 }));
    var cntA = VZ.txt(svg, 0, 0, "", { size: 11.5, fill: C.ink2 });
    var cntB = VZ.txt(svg, 0, 0, "", { size: 11.5, fill: C.ink2 });
    VZ.txt(svg, 46, 258, "■ 同（绿）   ■ 反（品红）", { size: 11, fill: C.dim });
    VZ.txt(svg, 420, 258, "■ 同（绿）   ■ 反（品红）", { size: 11, fill: C.dim });

    function drawBars() {
      function one(barG, barM, x, n, s) {
        var w = 240, f = n ? s / n : 0.5;
        barG.setAttribute("d", "M" + x + " 216h" + (f * w).toFixed(1));
        barM.setAttribute("d", "M" + (x + f * w).toFixed(1) + " 216h" + ((1 - f) * w).toFixed(1));
      }
      one(barA, barA2, 56, N.a, same.a);
      one(barB, barB2, 430, N.b, same.b);
      cntA.setAttribute("x", 56); cntA.setAttribute("y", 196);
      cntB.setAttribute("x", 430); cntB.setAttribute("y", 196);
      cntA.textContent = N.a ? "抽样 " + N.a + " 对，相同占 " + (100 * same.a / N.a).toFixed(1) + "%（理论 " + (100 * pSameC(theta)).toFixed(1) + "%）" : "抽样中…";
      cntB.textContent = N.b ? "抽样 " + N.b + " 对，相同占 " + (100 * same.b / N.b).toFixed(1) + "%（理论 " + (100 * pSameQ(theta)).toFixed(1) + "%）" : "抽样中…";
      VZ.setPanel(info, {
        "测量角差 θ": theta + "°",
        "手套 P(结果相同)": (100 * pSameC(theta)).toFixed(1) + "%",
        "量子 P(结果相同)": (100 * pSameQ(theta)).toFixed(1) + "%",
        "差距": (100 * Math.abs(pSameQ(theta) - pSameC(theta))).toFixed(1) + " 个百分点"
      });
    }
    var info = VZ.panel(stage, { "测量角差 θ": "", "手套 P(结果相同)": "", "量子 P(结果相同)": "", "差距": "" });

    var acc = 0;
    VZ.raf(svg, function (t, ms) {
      acc += ms;
      var budget = Math.min(Math.floor(acc / 16), 6);
      acc -= budget * 16;
      for (var i = 0; i < budget; i++) {
        if (N.a < 400) { N.a++; if (Math.random() < pSameC(theta)) same.a++; }
        if (N.b < 400) { N.b++; if (Math.random() < pSameQ(theta)) same.b++; }
      }
      drawBars();
    });
    drawBars();

    VZ.chips(stage, ["0°", "45°", "90°", "135°", "180°"], "45°", function (s) {
      theta = parseInt(s, 10);
      N.a = N.b = 0; same.a = same.b = 0;
      drawBars();
    });
  }
},

/* ==========================================================
   ch24b · 相对论能量双支曲线：拖 p，正负两支各取一点
   ========================================================== */
"f-ch24b": {
  title: "E² = p²c² + m²c⁴：一条双曲线，正负两支能量",
  hint: "<b>左右拖动</b>改变动量 p：金色点在上支（粒子），品红点在下支（负能解）。质量缝隙 2mc² = 1.022 MeV 把两支隔开——<span class='hl'>狄拉克无法扔掉下面那支，只好请它变成反粒子</span>。 " + "试找 p = 4/3 mc：读出 v = 0.8c、γ = 5/3。能量永不掉进缝隙里，除非一次性跳过它——那正是电子对产生的门槛。",
  draw: function (stage) {
    var W = 760, H = 340, svg = VZ.S(stage, W, H, { grid: true });
    var C = VZ.C;
    var ox = 380, oy = 172, sX = 74, sY = 34; /* p∈±4.6, E∈±4.6 */
    function X(p) { return ox + p * sX; }
    function Y(E) { return oy - E * sY; }

    /* 坐标轴 */
    var ar1 = VZ.arrowDef(svg, VZ.uid("ar"), C.ink2), ar2 = VZ.arrowDef(svg, VZ.uid("ar"), C.ink2);
    VZ.ln(svg, 40, oy, 724, oy, { stroke: C.faint, "stroke-width": 1, "marker-end": ar1 });
    VZ.ln(svg, ox, 316, ox, 26, { stroke: C.faint, "stroke-width": 1, "marker-end": ar2 });
    VZ.txt(svg, 716, oy + 18, "p / mc", { size: 11.5, fill: C.dim });
    VZ.txt(svg, ox + 8, 36, "E / mc²", { size: 11.5, fill: C.dim });
    [1, 2, 3, 4].forEach(function (n) {
      VZ.txt(svg, X(n) + 2, oy + 14, String(n), { size: 10, fill: C.dim });
      VZ.txt(svg, X(-n) - 2, oy + 14, "−" + n, { size: 10, fill: C.dim, anchor: "end" });
      VZ.txt(svg, ox + 6, Y(n) + 4, String(n), { size: 10, fill: C.dim });
      VZ.txt(svg, ox + 6, Y(-n) + 4, "−" + n, { size: 10, fill: C.dim });
    });

    /* 双曲线两支 */
    var dUp = "", dDn = "";
    for (var i = 0; i <= 200; i++) {
      var p = -4.6 + 9.2 * i / 200, E = Math.sqrt(1 + p * p);
      dUp += (i ? "L" : "M") + X(p).toFixed(1) + " " + Y(E).toFixed(1);
      dDn += (i ? "L" : "M") + X(p).toFixed(1) + " " + Y(-E).toFixed(1);
    }
    VZ.path(svg, dUp, VZ.stroke({ stroke: C.gold, "stroke-width": 2.4 }));
    VZ.path(svg, dDn, VZ.stroke({ stroke: C.mag, "stroke-width": 2.4, "stroke-dasharray": "8 5" }));
    VZ.txt(svg, X(3.1), Y(Math.sqrt(1 + 9.6)) - 12, "正能支（粒子）", { size: 12, fill: C.gold });
    VZ.txt(svg, X(3.1), Y(-Math.sqrt(1 + 9.6)) + 22, "负能支（→ 反粒子）", { size: 12, fill: C.mag });

    /* 质量缝隙 */
    VZ.ln(svg, ox - 8, Y(1), ox - 8, Y(-1), VZ.stroke({ stroke: C.red, "stroke-width": 2.4 }));
    VZ.txt(svg, ox - 16, oy + 4, "2mc² = 1.022 MeV", { size: 11, fill: C.red, anchor: "end" });

    /* 可拖点 */
    var pv = 1.2, dragged = false;
    var dotU = VZ.circ(svg, 0, 0, 7, { fill: C.gold });
    var dotD = VZ.circ(svg, 0, 0, 7, { fill: C.mag });
    var vLine = VZ.path(svg, "", VZ.stroke({ stroke: C.ink2, "stroke-width": 1, "stroke-dasharray": "3 4", opacity: .7 }));
    var info = VZ.panel(stage, { "p / mc": "", "E₊ / mc²": "", "E₋ / mc²": "", "v / c": "", "γ": "" });
    function draw() {
      var E = Math.sqrt(1 + pv * pv), gam = E, v = pv / E;
      dotU.setAttribute("cx", X(pv)); dotU.setAttribute("cy", Y(E));
      dotD.setAttribute("cx", X(pv)); dotD.setAttribute("cy", Y(-E));
      vLine.setAttribute("d", "M" + X(pv) + " " + (Y(E) + 10) + "L" + X(pv) + " " + (Y(-E) - 10));
      VZ.setPanel(info, {
        "p / mc": pv.toFixed(2),
        "E₊ / mc²": "+" + E.toFixed(3),
        "E₋ / mc²": "−" + E.toFixed(3),
        "v / c": v.toFixed(3),
        "γ": gam.toFixed(3)
      });
    }
    draw();
    VZ.raf(svg, function (t) {
      if (dragged) return;
      pv = 1.4 * Math.sin(t * 0.7);
      draw();
    });
    VZ.drag(svg, svg, W, H, function (x, y, phase) {
      if (phase === "start") dragged = true;
      pv = VZ.clamp((x - ox) / sX, -4.5, 4.5);
      draw();
    });
  }
},

/* ==========================================================
   ch24c · 狄拉克锯齿：电子一边前进一边高频抖动
   ========================================================== */
"f-ch24c": {
  title: "Zitterbewegung：正负能分量的干涉让电子「发抖」",
  hint: "拖滑杆改<b>动量 p</b>：电子一边向右漂移，一边叠加一个极高频的锯齿抖动。<span class='hl'>p 越大抖动越小、频率越高</span>——这正是正能支与负能支干涉的痕迹（振幅 ∝ 1/(1+p²)，频率 ∝ 2mc²/ħ）。 " + "瞬时速度可以超过光速，但每半个周期正负相抵，平均速度严格等于 v = p/E &lt; c。这朵「数学火花」后来在馒头态、石墨烯和冷原子实验里留下了真实的影子。",
  draw: function (stage) {
    var W = 760, H = 320, svg = VZ.S(stage, W, H, { grid: true });
    var C = VZ.C;
    var midY = 160, x0 = 40, x1 = 720;
    var p = 1.0;

    /* 平均漂移线 */
    var drift = VZ.path(svg, "", VZ.stroke({ stroke: C.gold, "stroke-width": 1.4, "stroke-dasharray": "7 6", opacity: .75 }));
    drift.setAttribute("d", "M" + x0 + " " + midY + "H" + x1);
    VZ.txt(svg, x1 - 6, midY - 12, "平均漂移 v̄ = p/E", { size: 11.5, fill: C.gold, anchor: "end" });
    VZ.txt(svg, x0 + 4, midY - 12, "电子的真实位置", { size: 11.5, fill: C.cyan });
    var ar = VZ.arrowDef(svg, VZ.uid("ar"), C.ink2);
    VZ.ln(svg, x0 - 6, midY, x1 + 10, midY, { stroke: C.faint, "stroke-width": .8, opacity: .4, "marker-end": ar });

    var dot = VZ.circ(svg, x0, midY, 6.5, { fill: C.cyan });
    var glow = VZ.circ(svg, x0, midY, 12, { fill: C.cyan, opacity: .25 });
    var trace = VZ.path(svg, "", VZ.stroke({ stroke: C.cyan, "stroke-width": 1.2, opacity: .55 }));

    var info = VZ.panel(stage, { "动量 p / mc": "", "平均速度 v / c": "", "ZB 振幅（相对）": "", "ZB 角频率 ω = 2E/ħ": "" });
    function upd() {
      var E = Math.sqrt(1 + p * p), v = p / E, amp = 1 / (1 + p * p), om = 4 * E;
      VZ.setPanel(info, {
        "动量 p / mc": p.toFixed(2),
        "平均速度 v / c": v.toFixed(3),
        "ZB 振幅（相对）": amp.toFixed(3),
        "ZB 角频率 ω = 2E/ħ": (om).toFixed(1) + "（相对）"
      });
      return { v: v, amp: amp, om: om };
    }
    var par = upd();

    var t0 = 0, trail = [];
    VZ.raf(svg, function (t, ms) {
      t0 += ms / 1000;
      var span = (x1 - x0 - 20) / par.v; /* 视野内走过的时间 */
      var tt = t0 % 9;                   /* 周期性回卷，轨迹重画 */
      var xs = x0 + 10 + par.v * tt * 74;
      if (tt * par.v * 74 < 8) trail = [];
      var ys = midY - par.amp * 60 * Math.sin(par.om * tt) * Math.exp(-tt * 0.15);
      dot.setAttribute("cx", xs); dot.setAttribute("cy", ys);
      glow.setAttribute("cx", xs); glow.setAttribute("cy", ys);
      trail.push(xs.toFixed(1) + " " + ys.toFixed(1));
      if (trail.length > 420) trail.shift();
      trace.setAttribute("d", "M" + trail.join("L"));
    });

    VZ.slider(stage, {
      label: "动量 p", value: 1.0, min: 0.2, max: 4, step: 0.05,
      format: function (v) { return v.toFixed(2) + " mc"; },
      onInput: function (v) { p = v; par = upd(); trail = []; }
    });
    VZ.legend(stage, [["电子真实位置（含抖动）", C.cyan], ["平均漂移", C.gold, "line"]]);
  }
}

});
