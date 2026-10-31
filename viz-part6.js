/* ==========================================================
   viz-part6.js — 第 6 批新图（ch25–ch29）
   ========================================================== */
VZ.define({

/* ==========================================================
   25b · 粒子家族：对数质量阶梯（点击看电荷/自旋）
   ========================================================== */
"f-ch25b": {
  title: "粒子家族：一条对数质量阶梯",
  hint: "点击任意条形，看它的<b>电荷</b>与<b>自旋</b>——横轴是对数，每跨一大格质量 ×10。看两点：① 质量横跨 11 个量级，从 0.511 MeV 的电子到 172.8 GeV 的顶夸克；② 光子、胶子严格为零，而 W、Z、希格斯很重——<span class='hl'>这与它们和希格斯场耦合的强弱一一对应</span>。",
  legend: [["轻子", VZ.C.cyan], ["夸克", VZ.C.mag], ["规范玻色子", VZ.C.gold], ["希格斯 / 组合粒子", VZ.C.violet]],
  draw: function (stage) {
    var W = 760, H = 410, svg = VZ.S(stage, W, H, { grid: true });
    var C = VZ.C;
    var rows = [
      { n: "光子 γ",   m: 0,       q: "0",    s: "1",   g: "—",    fam: "规范玻色子", c: C.gold },
      { n: "胶子 g",   m: 0,       q: "0",    s: "1",   g: "—",    fam: "规范玻色子", c: C.gold },
      { n: "电子 e⁻",  m: 0.511,   q: "−1",   s: "1/2", g: "第一代", fam: "轻子", c: C.cyan },
      { n: "上夸克 u", m: 2.2,     q: "+2/3", s: "1/2", g: "第一代", fam: "夸克", c: C.mag },
      { n: "下夸克 d", m: 4.7,     q: "−1/3", s: "1/2", g: "第一代", fam: "夸克", c: C.mag },
      { n: "奇夸克 s", m: 93,      q: "−1/3", s: "1/2", g: "第二代", fam: "夸克", c: C.mag },
      { n: "μ 子",     m: 105.7,   q: "−1",   s: "1/2", g: "第二代", fam: "轻子", c: C.cyan },
      { n: "质子 p",   m: 938.3,   q: "+1",   s: "1/2", g: "—",    fam: "组合粒子 uud", c: C.violet },
      { n: "粲夸克 c", m: 1275,    q: "+2/3", s: "1/2", g: "第二代", fam: "夸克", c: C.mag },
      { n: "τ 子",     m: 1776.9,  q: "−1",   s: "1/2", g: "第三代", fam: "轻子", c: C.cyan },
      { n: "底夸克 b", m: 4180,    q: "−1/3", s: "1/2", g: "第三代", fam: "夸克", c: C.mag },
      { n: "W 玻色子", m: 80379,   q: "±1",   s: "1",   g: "—",    fam: "规范玻色子", c: C.gold },
      { n: "Z 玻色子", m: 91188,   q: "0",    s: "1",   g: "—",    fam: "规范玻色子", c: C.gold },
      { n: "希格斯 H", m: 125100,  q: "0",    s: "0",   g: "—",    fam: "标量玻色子", c: C.violet },
      { n: "顶夸克 t", m: 172760,  q: "+2/3", s: "1/2", g: "第三代", fam: "夸克", c: C.mag }
    ];
    var y0 = 46, rowH = 22, barH = 12, x0 = 150, xw = 480;
    function mpx(m) { return x0 + (Math.log10(m) + 0.3) * xw / 5.6; }
    function fmt(m) {
      if (m >= 10000) return (m / 1000).toFixed(1) + " GeV";
      if (m >= 1000) return m.toFixed(0) + " MeV";
      return m + " MeV";
    }
    /* 信息行 */
    var info = VZ.txt(svg, 20, 26, "← 点击任意条形：显示电荷 / 自旋 / 所属代", { size: 13, fill: C.gold, weight: 700 });
    /* 坐标轴 */
    var axisY = y0 + rows.length * rowH + 10;
    VZ.ln(svg, x0, axisY, x0 + xw, axisY, { stroke: C.ink2, "stroke-width": 1.2 });
    [[1, "1 MeV"], [10, "10"], [100, "100"], [1000, "1 GeV"], [10000, "10"], [100000, "100 GeV"]].forEach(function (tk) {
      var px = mpx(tk[0]);
      VZ.ln(svg, px, axisY, px, axisY + 5, { stroke: C.ink2, "stroke-width": 1 });
      VZ.txt(svg, px, axisY + 19, tk[1], { size: 10, fill: C.dim, anchor: "middle" });
    });
    VZ.txt(svg, x0 + xw, axisY + 19, "对数刻度", { size: 10, fill: C.dim, anchor: "end" });
    /* 条形 */
    rows.forEach(function (r, i) {
      var y = y0 + i * rowH;
      var gg = VZ.g(svg, { style: "cursor:pointer" });
      VZ.txt(gg, x0 - 12, y + barH - 1, r.n, { size: 11.5, fill: C.ink, anchor: "end" });
      var bar;
      if (r.m === 0) {
        VZ.ln(gg, x0, y + barH / 2, x0 + 24, y + barH / 2, VZ.stroke({ stroke: r.c, "stroke-width": 1.4, "stroke-dasharray": "3 3" }));
        VZ.circ(gg, x0, y + barH / 2, 3.4, { fill: C.deep, stroke: r.c, "stroke-width": 1.5 });
        VZ.txt(gg, x0 + 32, y + barH - 1, "0（严格无质量）", { size: 11, fill: r.c });
      } else {
        var bw = mpx(r.m) - x0;
        bar = VZ.el("rect", { x: x0, y: y, width: bw, height: barH, rx: 3, fill: r.c, opacity: .82, stroke: r.c, "stroke-width": 1 }, gg);
        VZ.txt(gg, x0 + bw + 8, y + barH - 1, fmt(r.m), { size: 11, fill: C.ink2 });
      }
      var hit = VZ.el("rect", { x: 10, y: y - 4, width: W - 24, height: rowH - 2, fill: "rgba(0,0,0,0)" }, gg);
      hit.addEventListener("click", function () {
        info.textContent = r.n + "　·　电荷 " + r.q + "　·　自旋 " + r.s + "　·　" + r.g + "　·　" + r.fam;
        info.setAttribute("fill", r.c);
        rows.forEach(function (rr) {
          var b = rr._bar; if (b) b.setAttribute("stroke-width", 1);
        });
        if (bar) bar.setAttribute("stroke-width", 2.5);
        r._bar = bar;
      });
      r._bar = bar;
    });
  }
},

/* ==========================================================
   25c · 相互作用顶点拼装（荷守恒检查）
   ========================================================== */
"f-ch25c": {
  title: "拼一个标准模型顶点：每种荷都必须对上账",
  hint: "用选块为三条腿各挑一种粒子，下面实时记账：<b>电荷</b>必须严格守恒，<span class='hl'>胶子只连在夸克之间</span>（轻子没有颜色），γ/Z 不改变粒子种类而 W⁺/W⁻ 专门改。拼不出合法顶点时账本会变红——先试着拼一个 d → u + W⁻。",
  draw: function (stage) {
    var W = 760, H = 300, svg = VZ.S(stage, W, H, { grid: true });
    var C = VZ.C;
    var F = { "e⁻": -1, "ν": 0, "u": 2 / 3, "d": -1 / 3 };
    var B = { "γ": 0, "Z": 0, "g": 0, "W⁺": 1, "W⁻": -1 };
    var state = { fin: "d", fout: "u", bos: "W⁻" };
    var vx = 300, vy = 140;
    /* 腿 */
    VZ.ln(svg, 120, vy, vx, vy, VZ.stroke({ stroke: C.cyan, "stroke-width": 2.2, "marker-end": VZ.arrowDef(svg, VZ.uid("a"), C.cyan) }));
    VZ.ln(svg, vx, vy, 470, 62, VZ.stroke({ stroke: C.cyan, "stroke-width": 2.2, "marker-end": VZ.arrowDef(svg, VZ.uid("a"), C.cyan) }));
    function wavy(x1, y1, x2, y2, amp, per) {
      var dx = x2 - x1, dy = y2 - y1, L = Math.hypot(dx, dy), nx = -dy / L, ny = dx / L;
      var n = Math.max(2, Math.round(L / per)), d = "M" + x1 + " " + y1;
      for (var i = 0; i < n; i++) {
        var t1 = (i + 0.5) / n, t2 = (i + 1) / n, s = (i % 2 ? -1 : 1);
        d += "Q" + (x1 + dx * t1 + nx * amp * s).toFixed(1) + " " + (y1 + dy * t1 + ny * amp * s).toFixed(1) +
             " " + (x1 + dx * t2).toFixed(1) + " " + (y1 + dy * t2).toFixed(1);
      }
      return d;
    }
    var bosPath = VZ.path(svg, "", VZ.stroke({ stroke: C.mag, "stroke-width": 2 }));
    VZ.circ(svg, vx, vy, 5, { fill: C.ink });
    VZ.txt(svg, vx, vy - 18, "顶点", { size: 11, fill: C.dim, anchor: "middle" });
    var lblIn = VZ.txt(svg, 118, vy + 24, "", { size: 13, fill: C.cyan, anchor: "middle", weight: 700 });
    var lblOut = VZ.txt(svg, 480, 54, "", { size: 13, fill: C.cyan, weight: 700 });
    var lblBos = VZ.txt(svg, 480, 232, "", { size: 13, fill: C.mag, weight: 700 });
    VZ.txt(svg, 60, vy + 44, "入射费米子", { size: 10.5, fill: C.dim });
    VZ.txt(svg, 480, 38, "出射费米子", { size: 10.5, fill: C.dim });
    VZ.txt(svg, 480, 250, "出射玻色子", { size: 10.5, fill: C.dim });
    /* 控件 */
    var ctl = VZ.box(stage, "viz-ctl");
    function chipRow(label, items, get, set) {
      var d = document.createElement("div");
      d.style.margin = "2px 0";
      var b = document.createElement("b");
      b.textContent = label + "　";
      b.style.fontSize = "12px"; b.style.color = "#8d86bd";
      d.appendChild(b);
      var wrap = VZ.chips(d, items, get(), function (v) { set(v); update(); });
      d._wrap = wrap;
      ctl.appendChild(d);
      return d;
    }
    var r1 = chipRow("入射费米子", ["e⁻", "ν", "u", "d"], function () { return state.fin; }, function (v) { state.fin = v; });
    var r2 = chipRow("出射费米子", ["e⁻", "ν", "u", "d"], function () { return state.fout; }, function (v) { state.fout = v; });
    var r3 = chipRow("玻色子", ["γ", "Z", "g", "W⁺", "W⁻"], function () { return state.bos; }, function (v) { state.bos = v; });
    function pickChip(row, name) {
      Array.prototype.forEach.call(row._wrap.querySelectorAll(".viz-chip"), function (x) {
        if (x.textContent === name && !x.classList.contains("on")) x.click();
      });
    }
    var out = VZ.panel(ctl, { "电荷": "", "色荷": "", "味": "", "判定": "" });
    var btnRow = VZ.box(stage, "viz-ctl");
    VZ.btn(btnRow, "随机拼一个合法顶点", function () {
      var ok = [["e⁻", "e⁻", "γ"], ["e⁻", "ν", "W⁻"], ["d", "u", "W⁻"], ["u", "d", "W⁺"], ["u", "u", "g"], ["d", "d", "g"]];
      var p = ok[Math.floor(Math.random() * ok.length)];
      pickChip(r1, p[0]); pickChip(r2, p[1]); pickChip(r3, p[2]);
      update();
    });
    function update() {
      lblIn.textContent = state.fin + "（Q=" + fmtQ(F[state.fin]) + "）";
      lblOut.textContent = state.fout + "（Q=" + fmtQ(F[state.fout]) + "）";
      lblBos.textContent = state.bos + "（Q=" + fmtQ(B[state.bos]) + "）";
      bosPath.setAttribute("d", wavy(vx, vy, 470, 226, 7, 16));
      var dq = F[state.fin] - F[state.fout] - B[state.bos];
      var qOK = Math.abs(dq) < 1e-9;
      var colTXT, colOK = true;
      if (state.bos === "g") {
        var qIn = (state.fin === "u" || state.fin === "d");
        var qOut = (state.fout === "u" || state.fout === "d");
        if (qIn && qOut) colTXT = "✓ 夸克↔夸克，色差由胶子带走";
        else { colTXT = "✗ 轻子没有颜色，不挂胶子"; colOK = false; }
      } else colTXT = "—（此顶点不涉及色荷）";
      var flav;
      if (state.bos === "γ" || state.bos === "Z") {
        flav = (state.fin === state.fout) ? "✓ γ/Z 不改粒子种类" : "⚠ γ/Z 两端必须同一种费米子";
      } else if (state.bos === "g") {
        flav = (state.fin === state.fout) ? "（同一味）" : "⚠ 胶子不改味";
      } else flav = "✓ W⁺/W⁻ 专门负责改味";
      var good = qOK && colOK && (state.bos === "g" ? true : true) && flav.indexOf("✗") < 0;
      VZ.setPanel(out, {
        "电荷": qOK ? "✓ 守恒" : "✗ 差 " + fmtQ(dq),
        "色荷": colTXT,
        "味": flav,
        "判定": good ? "标准模型允许 ✓" : "这个顶点不存在 ✗"
      });
      out.style.borderColor = good ? "rgba(94,224,138,.55)" : "rgba(255,122,122,.55)";
    }
    function fmtQ(v) {
      if (Math.abs(v + 1) < 1e-9) return "−1";
      if (Math.abs(v - 1) < 1e-9) return "+1";
      if (Math.abs(v) < 1e-9) return "0";
      if (Math.abs(v - 2 / 3) < 1e-9) return "+2/3";
      if (Math.abs(v + 1 / 3) < 1e-9) return "−1/3";
      if (Math.abs(v + 2 / 3) < 1e-9) return "−2/3";
      if (Math.abs(v - 1 / 3) < 1e-9) return "+1/3";
      return v.toFixed(2);
    }
    update();
  }
},

/* ==========================================================
   26b · 产生/湮灭算符：能级楼梯
   ========================================================== */
"f-ch26b": {
  title: "a† 与 a：在谐振子楼梯上加一粒、减一粒",
  hint: "点 <b>a†</b> 往阱里加一个量子，点 <b>a</b> 拿走一个。看两点：① 每级台阶严格等高 ħω，所以能量读数总差同样的量；② a 作用到真空 |0⟩ 时无路可走——<span class='hl'>a|0⟩=0 不是「负一个粒子」，而是这条楼梯根本没有更低的台阶</span>。粒子的「场」就是无数座这样的楼梯。",
  draw: function (stage) {
    var W = 760, H = 360, svg = VZ.S(stage, W, H, { grid: true });
    var C = VZ.C;
    var NMAX = 7, d = 28, yBase = 316;
    var cx = 230;
    function yN(n) { return yBase - (n + 0.5) * d; }
    function halfW(n) { return Math.sqrt((yBase - yN(n)) / 0.0042); }
    /* 抛物势 */
    var pd = "";
    for (var i = 0; i <= 60; i++) {
      var x = -230 + 460 * i / 60;
      pd += (i ? "L" : "M") + (cx + x).toFixed(1) + " " + (yBase - 0.0042 * x * x).toFixed(1);
    }
    VZ.path(svg, pd, VZ.stroke({ stroke: C.ink2, "stroke-width": 1.8 }));
    VZ.txt(svg, cx + 236, yBase - 60, "V(x)", { size: 12, fill: C.ink2 });
    VZ.txt(svg, cx, yBase + 26, "位置 x（一个谐振子 = 场的一种振动模式）", { size: 11, fill: C.dim, anchor: "middle" });
    /* 台阶 */
    var rungs = [];
    for (var n = 0; n <= NMAX; n++) {
      var hw = halfW(n);
      rungs.push(VZ.ln(svg, cx - hw, yN(n), cx + hw, yN(n), { stroke: C.faint, "stroke-width": 1.4 }));
      VZ.txt(svg, cx + hw + 8, yN(n) + 4, "n=" + n, { size: 10, fill: C.dim });
    }
    /* 粒子点 */
    var dotG = VZ.g(svg);
    var dots = [];
    function popIn(c) {
      var t0 = performance.now();
      var kill = VZ.raf(svg, function () {
        var u = (performance.now() - t0) / 220;
        if (u >= 1) { c.setAttribute("r", 5.5); kill(); return; }
        c.setAttribute("r", 5.5 * (0.2 + 0.8 * VZ.ease(u)));
      });
    }
    function render(n, anim) {
      dotG.innerHTML = "";
      dots = [];
      for (var k = 0; k < n; k++) {
        var c = VZ.circ(dotG, cx - (n - 1) * 11 + k * 22, yN(n) - 8, anim && k === n - 1 ? 0.1 : 5.5, { fill: C.cyan, stroke: C.deep, "stroke-width": 1 });
        if (anim && k === n - 1) popIn(c);
      }
      for (var j = 0; j <= NMAX; j++) {
        rungs[j].setAttribute("stroke", j === n ? C.cyan : C.faint);
        rungs[j].setAttribute("stroke-width", j === n ? 2.2 : 1.4);
      }
      panel && VZ.setPanel(panel, {
        "当前态": "|" + n + "⟩（含 " + n + " 个量子）",
        "能量": "E = (n+½)ħω = " + (n + 0.5) + " ħω",
        "算符规矩": "a†|n⟩ = √(n+1)|" + (n + 1) + "⟩　a|n⟩ = √n|" + Math.max(n - 1, 0) + "⟩"
      });
    }
    var ctl = VZ.box(stage, "viz-ctl");
    var flash = VZ.note(stage, "");
    var panel = VZ.panel(ctl, { "当前态": "", "能量": "", "算符规矩": "" });
    var btnRow = VZ.box(stage, "viz-ctl");
    var bCreate = VZ.btn(btnRow, "a† 产生：加一粒", function () {
      if (nCur >= NMAX) { flash.innerHTML = "⚠ 到楼梯顶了——真实谐振子没有天花板，这里只是画不下"; return; }
      nCur++; render(nCur, true);
    }, "viz-btn");
    var bKill = VZ.btn(btnRow, "a 湮灭：减一粒", function () {
      if (nCur === 0) { flash.innerHTML = "<b>a|0⟩ = 0</b>：真空没有粒子可湮灭——楼梯底下没有负台阶"; return; }
      nCur--; render(nCur, true);
    }, "viz-btn");
    var nCur = 2;
    render(nCur, false);
  }
},

/* ==========================================================
   26c · 重整化跑动：耦合常数随标度 μ 变化
   ========================================================== */
"f-ch26c": {
  title: "耦合常数不是常数：拖动标度 μ 看它跑动",
  hint: "拖动滑块改变探测尺度 μ。<b>上图 QCD</b>：夸克靠得越近（μ 越大）色荷越弱——「渐近自由」；往低能走，α_s 急剧膨胀，在 Λ_QCD 附近撞上<span class='hl'>朗道极值</span>，微扰论失效、夸克被禁闭。<b>下图 QED</b>：真空把电荷屏蔽起来，μ 越大裸电荷露得越多，α 缓慢变强。",
  draw: function (stage) {
    var W = 760, H = 430, svg = VZ.S(stage, W, H, { grid: true });
    var C = VZ.C;
    var logLam = Math.log10(0.09);          /* Λ_QCD ≈ 0.09 GeV */
    var vmin = -0.92, vmax = 2.3;
    /* —— 上图：QCD —— */
    var p1 = { x0: 70, x1: 720, y0: 34, y1: 186, amax: 2.2 };
    function xm(v, p) { return p.x0 + (v - vmin) / (vmax - vmin) * (p.x1 - p.x0); }
    function aS(v) {
      var l = (v - logLam) * Math.LN10;
      if (l <= 0.02) return Infinity;
      return 6 * Math.PI / (23 * l);
    }
    function ym1(a) { return p1.y1 - VZ.clamp(a, 0, p1.amax) / p1.amax * (p1.y1 - p1.y0); }
    VZ.ln(svg, p1.x0, p1.y1, p1.x1, p1.y1, { stroke: C.ink2, "stroke-width": 1.2 });
    VZ.ln(svg, p1.x0, p1.y0, p1.x0, p1.y1, { stroke: C.ink2, "stroke-width": 1.2 });
    var d1 = "";
    for (var i = 0; i <= 200; i++) {
      var v = vmin + (vmax - vmin) * i / 200, a = aS(v);
      if (a > p1.amax) { if (d1) break; continue; }
      d1 += (d1 ? "L" : "M") + xm(v, p1).toFixed(1) + " " + ym1(a).toFixed(1);
    }
    VZ.path(svg, d1, VZ.stroke({ stroke: C.cyan, "stroke-width": 2.2 }));
    /* 朗道极值 */
    var lp = xm(logLam, p1);
    VZ.ln(svg, lp, p1.y0, lp, p1.y1, { stroke: C.red, "stroke-width": 1.6, "stroke-dasharray": "6 4" });
    VZ.txt(svg, lp + 8, p1.y0 + 14, "朗道极值 μ=Λ_QCD ≈ 0.09 GeV", { size: 11, fill: C.red, weight: 700 });
    /* Z 基准线 */
    var vz = Math.log10(91.2);
    VZ.ln(svg, xm(vz, p1), p1.y0, xm(vz, p1), p1.y1, { stroke: C.faint, "stroke-width": 1, "stroke-dasharray": "3 4" });
    VZ.txt(svg, xm(vz, p1) + 6, p1.y0 + 30, "m_Z", { size: 10.5, fill: C.dim });
    [0.2, 1, 10, 100].forEach(function (g) {
      var px = xm(Math.log10(g), p1);
      VZ.ln(svg, px, p1.y1, px, p1.y1 + 5, { stroke: C.ink2, "stroke-width": 1 });
      VZ.txt(svg, px, p1.y1 + 18, g + " GeV", { size: 10, fill: C.dim, anchor: "middle" });
    });
    VZ.txt(svg, p1.x0 + 6, p1.y0 - 8, "强耦合 α_s(μ)（QCD：能量越高越弱）", { size: 12, fill: C.cyan, weight: 700 });
    /* —— 下图：QED —— */
    var p2 = { x0: 70, x1: 720, y0: 268, y1: 372 };
    var a0 = 1 / 137.036;
    function aEM(v) {
      var mu = Math.pow(10, v);
      return a0 / (1 - (2 * a0 / (3 * Math.PI)) * Math.log(mu / 0.511));
    }
    var lo = 7.2, hi = 7.6;
    function ym2(a) { return p2.y1 - (a * 1000 - lo) / (hi - lo) * (p2.y1 - p2.y0); }
    VZ.ln(svg, p2.x0, p2.y1, p2.x1, p2.y1, { stroke: C.ink2, "stroke-width": 1.2 });
    VZ.ln(svg, p2.x0, p2.y0, p2.x0, p2.y1, { stroke: C.ink2, "stroke-width": 1.2 });
    var d2 = "";
    for (var j = 0; j <= 200; j++) {
      var v2 = Math.log10(0.511) + (vmax - Math.log10(0.511)) * j / 200;
      d2 += (j ? "L" : "M") + xm(v2, p2).toFixed(1) + " " + ym2(aEM(v2)).toFixed(1);
    }
    VZ.path(svg, d2, VZ.stroke({ stroke: C.gold, "stroke-width": 2.2 }));
    VZ.txt(svg, p2.x0 + 6, p2.y0 - 8, "电磁耦合 α(μ)（QED：真空屏蔽被掀开，缓慢变强）", { size: 12, fill: C.gold, weight: 700 });
    VZ.txt(svg, p2.x0 - 8, (p2.y0 + p2.y1) / 2, "α×10³", { size: 10.5, fill: C.dim, anchor: "middle" });
    /* 标记点 */
    var mk1 = VZ.circ(svg, 0, 0, 5.5, { fill: C.cyan, stroke: C.deep, "stroke-width": 1.2 });
    var mk2 = VZ.circ(svg, 0, 0, 5.5, { fill: C.gold, stroke: C.deep, "stroke-width": 1.2 });
    var vline = VZ.ln(svg, 0, p1.y0, 0, p2.y1, { stroke: C.ink, "stroke-width": 1, "stroke-dasharray": "4 4", opacity: .5 });
    /* 控件 */
    var ctl = VZ.box(stage, "viz-ctl");
    var out = VZ.panel(ctl, { "标度 μ": "", "α_s(μ)": "", "α(μ)": "" });
    var sl = VZ.slider(ctl, {
      label: "标度 μ（对数）", value: 1.96, min: vmin, max: vmax, step: 0.005,
      format: function (v) { var mu = Math.pow(10, v); return (mu < 1 ? mu.toFixed(2) : mu.toFixed(1)) + " GeV"; },
      onInput: function (v) { set(v); }
    });
    function set(v) {
      var a1 = aS(v), a2v = aEM(v);
      mk1.setAttribute("cx", xm(v, p1)); mk1.setAttribute("cy", ym1(a1));
      mk2.setAttribute("cx", xm(v, p2)); mk2.setAttribute("cy", ym2(a2v));
      vline.setAttribute("x1", xm(v, p1)); vline.setAttribute("x2", xm(v, p1));
      VZ.setPanel(out, {
        "标度 μ": Math.pow(10, v).toFixed(2) + " GeV",
        "α_s(μ)": a1 > 2 ? "≈ " + a1.toFixed(1) + "（微扰失效！）" : a1.toFixed(3),
        "α(μ)": "1/" + (1 / a2v).toFixed(1)
      });
    }
    set(1.96);
  }
},

/* ==========================================================
   27b · 气体扩散：不可逆与熵读数
   ========================================================== */
"f-ch27b": {
  title: "把气体关进半边盒子：它回不去了",
  hint: "全部粒子从左半边出发，随机游走会自动把它们摊满全盒——<b>熵读数从 0 爬向 ln 2 ≈ 0.693</b>。点「重演」再来一遍：走向平衡的是压倒性多数，而<span class='hl'>从没见过它自发缩回半边</span>。第二定律不是一条力，是「均匀构型数远多于聚拢构型数」这道算术。",
  draw: function (stage) {
    var W = 760, H = 340, svg = VZ.S(stage, W, H, { grid: true });
    var C = VZ.C;
    var bx0 = 110, bx1 = 650, by0 = 56, by1 = 250, mid = 380, gapA = 118, gapB = 188;
    var N = 40, ps = [];
    function reset() {
      ps = [];
      for (var i = 0; i < N; i++) ps.push({
        x: bx0 + 8 + Math.random() * (mid - bx0 - 20),
        y: by0 + 8 + Math.random() * (by1 - by0 - 16),
        vx: (Math.random() - .5) * 90, vy: (Math.random() - .5) * 90
      });
    }
    reset();
    var dots = [], dotG = VZ.g(svg);
    for (var i = 0; i < N; i++) dots.push(VZ.circ(dotG, ps[i].x, ps[i].y, 4, { fill: C.gold }));
    VZ.card(svg, bx0, by0, bx1 - bx0, by1 - by0, { fill: "rgba(255,255,255,.03)", stroke: C.ink2, sw: 1.4 });
    /* 中隔板（留缺口） */
    VZ.ln(svg, mid, by0, mid, by0 + gapA, VZ.stroke({ stroke: C.ink, "stroke-width": 2.4 }));
    VZ.ln(svg, mid, by0 + gapB, mid, by1, VZ.stroke({ stroke: C.ink, "stroke-width": 2.4 }));
    VZ.txt(svg, mid, by0 - 10, "缺口", { size: 10, fill: C.dim, anchor: "middle" });
    VZ.txt(svg, (bx0 + mid) / 2, by1 + 22, "左半边（初始）", { size: 11, fill: C.dim, anchor: "middle" });
    VZ.txt(svg, (mid + bx1) / 2, by1 + 22, "右半边", { size: 11, fill: C.dim, anchor: "middle" });
    var dots = [];
    /* 熵条 */
    var barX = 60, barW = 640, barY = 296;
    VZ.txt(svg, barX, barY - 8, "熵 S / Nk（0 → ln 2 ≈ 0.693）", { size: 11, fill: C.dim });
    var barBg = VZ.el("rect", { x: barX, y: barY, width: barW, height: 12, rx: 6, fill: "rgba(255,255,255,.07)", stroke: C.faint }, svg);
    var barFg = VZ.el("rect", { x: barX, y: barY, width: 0, height: 12, rx: 6, fill: C.green }, svg);
    var sTxt = VZ.txt(svg, barX + barW + 8, barY + 10, "", { size: 11.5, fill: C.green, weight: 700 });
    var cntTxt = VZ.txt(svg, 20, by0 + 16, "", { size: 12, fill: C.ink, weight: 700 });
    var ctl = VZ.box(stage, "viz-ctl");
    var flash = VZ.note(stage, "");
    VZ.btn(ctl, "↻ 重演（全部塞回左半边）", function () {
      reset();
      flash.innerHTML = "重置完成：宏观态回到「聚在左边」——现在看它往哪个方向演化。";
    });
    var last = performance.now();
    VZ.raf(svg, function (t, dt) {
      var step = Math.min(dt, 50) / 1000;
      for (var i = 0; i < N; i++) {
        var p = ps[i];
        /* 抖动：随机游走 */
        p.vx += (Math.random() - .5) * 260 * step * 6;
        p.vy += (Math.random() - .5) * 260 * step * 6;
        var sp = Math.hypot(p.vx, p.vy);
        if (sp > 130) { p.vx *= 130 / sp; p.vy *= 130 / sp; }
        p.x += p.vx * step; p.y += p.vy * step;
        /* 边界反弹 */
        if (p.x < bx0 + 4) { p.x = bx0 + 4; p.vx = Math.abs(p.vx); }
        if (p.x > bx1 - 4) { p.x = bx1 - 4; p.vx = -Math.abs(p.vx); }
        if (p.y < by0 + 4) { p.y = by0 + 4; p.vy = Math.abs(p.vy); }
        if (p.y > by1 - 4) { p.y = by1 - 4; p.vy = -Math.abs(p.vy); }
        /* 中隔板：只在缺口通行 */
        if (Math.abs(p.x - mid) < 5 && (p.y < by0 + gapA || p.y > by0 + gapB)) {
          if (p.vx > 0) p.x = mid - 5; else p.x = mid + 5;
          p.vx = -p.vx;
        }
        dots[i].setAttribute("cx", p.x);
        dots[i].setAttribute("cy", p.y);
      }
      var nL = 0;
      for (var j = 0; j < N; j++) if (ps[j].x < mid) nL++;
      var q = nL / N;
      var S = (q > 0 && q < 1) ? -(q * Math.log(q) + (1 - q) * Math.log(1 - q)) : 0;
      barFg.setAttribute("width", barW * S / Math.LN2);
      sTxt.textContent = S.toFixed(3);
      cntTxt.textContent = "左 " + nL + " · 右 " + (N - nL);
    });
  }
},

/* ==========================================================
   27c · 黑洞熵：长在面积上，不是体积里
   ========================================================== */
"f-ch27c": {
  title: "黑洞熵 S_BH = k·c³A/4Għ：拖半径，看两条曲线谁赢",
  hint: "在图上<b>左右拖动</b>改变视界半径 r。常识猜熵 ∝ 体积（r³，蓝线），而贝肯斯坦–霍金公式给的是 ∝ 面积（r²，金线）——<span class='hl'>黑洞的信息容量按「表面格数」计数，这正是全息原理的起点</span>。读数里 S_BH 用真实公式对太阳质量量级黑洞算出：一个太阳质量的黑洞约 10⁷⁷ k。",
  draw: function (stage) {
    var W = 760, H = 400, svg = VZ.S(stage, W, H, { grid: true });
    var C = VZ.C;
    var rmin = 1, rmax = 30;
    var p = { x0: 70, x1: 700, y0: 52, y1: 316 };
    function xm(r) { return p.x0 + (Math.log10(r) - 0) / Math.log10(rmax) * (p.x1 - p.x0); }
    function ym(s) { return p.y1 - Math.log10(s) / 4.0 * (p.y1 - p.y0); }
    /* 坐标 */
    VZ.ln(svg, p.x0, p.y1, p.x1, p.y1, { stroke: C.ink2, "stroke-width": 1.2 });
    VZ.ln(svg, p.x0, p.y0, p.x0, p.y1, { stroke: C.ink2, "stroke-width": 1.2 });
    [1, 3, 10, 30].forEach(function (r) {
      var px = xm(r);
      VZ.ln(svg, px, p.y1, px, p.y1 + 5, { stroke: C.ink2, "stroke-width": 1 });
      VZ.txt(svg, px, p.y1 + 19, r + " km", { size: 10.5, fill: C.dim, anchor: "middle" });
    });
    VZ.txt(svg, p.x0 - 10, (p.y0 + p.y1) / 2, "log₁₀ S（以 k 计）", { size: 11, fill: C.dim, anchor: "middle" });
    [1, 10, 100, 1000].forEach(function (s) {
      VZ.ln(svg, p.x0, ym(s), p.x1, ym(s), { stroke: C.faint, "stroke-width": .7, opacity: .5 });
      VZ.txt(svg, p.x0 - 6, ym(s) + 4, "10^" + Math.round(Math.log10(s)), { size: 9.5, fill: C.faint, anchor: "end" });
    });
    /* 两条曲线（对数-对数下是斜率不同的直线；相对单位：面积=r²，体积=r³/10，交点 r=10） */
    var dA = "M" + xm(rmin) + " " + ym(rmin * rmin) + "L" + xm(rmax) + " " + ym(rmax * rmax);
    var dV = "M" + xm(rmin) + " " + ym(rmin * rmin * rmin / 10) + "L" + xm(rmax) + " " + ym(rmax * rmax * rmax / 10);
    VZ.path(svg, dV, VZ.stroke({ stroke: C.blue, "stroke-width": 2, "stroke-dasharray": "8 5" }));
    VZ.path(svg, dA, VZ.stroke({ stroke: C.gold, "stroke-width": 2.6 }));
    VZ.txt(svg, xm(30) - 10, ym(rmax * rmax) - 12, "面积熵 S_BH ∝ r²", { size: 12, fill: C.gold, weight: 700, anchor: "end" });
    VZ.txt(svg, xm(30) - 10, ym(rmax * rmax * rmax / 10) + 20, "直觉预期 ∝ 体积 r³", { size: 12, fill: C.blue, anchor: "end" });
    /* 交点 r=10 */
    VZ.ln(svg, xm(10), ym(1), xm(10), ym(2700), { stroke: C.faint, "stroke-width": .9, "stroke-dasharray": "3 4" });
    VZ.txt(svg, xm(10) + 6, ym(1) - 8, "交点只是归一化；趋势才是重点", { size: 10, fill: C.dim });
    /* 拖动标记 */
    var mkA = VZ.circ(svg, 0, 0, 6, { fill: C.gold, stroke: C.deep, "stroke-width": 1.2 });
    var mkV = VZ.circ(svg, 0, 0, 6, { fill: C.blue, stroke: C.deep, "stroke-width": 1.2 });
    var vline = VZ.ln(svg, 0, p.y0, 0, p.y1, { stroke: C.ink, "stroke-width": 1, opacity: .55, "stroke-dasharray": "4 4" });
    var hit = VZ.el("rect", { x: p.x0, y: p.y0, width: p.x1 - p.x0, height: p.y1 - p.y0, fill: "rgba(0,0,0,0)", style: "cursor:ew-resize" }, svg);
    var ctl = VZ.box(stage, "viz-ctl");
    var out = VZ.panel(ctl, { "视界半径 r": "", "对应质量 M": "", "S_BH（真实公式）": "", "体积熵（同归一化）": "" });
    function setR(r) {
      r = VZ.clamp(r, rmin, rmax);
      mkA.setAttribute("cx", xm(r)); mkA.setAttribute("cy", ym(r * r));
      mkV.setAttribute("cx", xm(r)); mkV.setAttribute("cy", ym(r * r * r / 10));
      vline.setAttribute("x1", xm(r)); vline.setAttribute("x2", xm(r));
      var mSun = r / 2.95;
      var fmtE = function (x) {
        var e = Math.floor(Math.log10(x * 1e77));
        return (x * 1e77 / Math.pow(10, e)).toFixed(2) + "×10^" + e + " k";
      };
      VZ.setPanel(out, {
        "视界半径 r": r.toFixed(1) + " km",
        "对应质量 M": mSun.toFixed(2) + " M☉（r_s = 2GM/c²）",
        "S_BH（真实公式）": fmtE(Math.pow(r / 2.95, 2)),
        "体积熵（同归一化）": Math.pow(r / 10, 3).toFixed(2) + "（相对单位）"
      });
    }
    VZ.drag(svg, hit, W, H, function (x, y, ph) {
      if (ph === "move" || ph === "start") {
        var r = Math.pow(10, (x - p.x0) / (p.x1 - p.x0) * Math.log10(rmax));
        setR(r);
      }
    });
    setR(10);
  }
},

/* ==========================================================
   28b · 暴胀 vs 标准大爆炸：a(t) 双曲线
   ========================================================== */
"f-ch28b": {
  title: "暴胀把宇宙拉了多远：滑 e-fold 数看 a(t)",
  hint: "双对数坐标下，标准大爆炸（辐射主导，a∝t^½）是一条<b>斜率 ½ 的直线</b>；暴胀则是先在 10⁻³⁶→10⁻³² 秒里<span class='hl'>近乎垂直地窜升 e^N 倍</span>，再接回正常膨胀。拖滑块加大 N：那段近乎垂直的墙越高，如今可观测宇宙里的均匀区域就被拽得越大——这正是暴胀抹平原初皱纹、稀释磁单极的方式。",
  draw: function (stage) {
    var W = 760, H = 420, svg = VZ.S(stage, W, H, { grid: true });
    var C = VZ.C;
    var t0 = 1e-36, tEnd = 1e-32;
    var p = { x0: 66, x1: 720, y0: 40, y1: 340 };
    var vmin = Math.log10(t0) - 0.4, vmax = 0, umax = 45;
    function xm(v) { return p.x0 + (v - vmin) / (vmax - vmin) * (p.x1 - p.x0); }
    function ym(u) { return p.y1 - u / umax * (p.y1 - p.y0); }
    /* 坐标 */
    VZ.ln(svg, p.x0, p.y1, p.x1, p.y1, { stroke: C.ink2, "stroke-width": 1.2 });
    VZ.ln(svg, p.x0, p.y0, p.x0, p.y1, { stroke: C.ink2, "stroke-width": 1.2 });
    [1e-36, 1e-32, 1e-24, 1e-12, 1].forEach(function (t) {
      var v = Math.log10(t), px = xm(v);
      if (px < p.x0 || px > p.x1) return;
      VZ.ln(svg, px, p.y1, px, p.y1 + 5, { stroke: C.ink2, "stroke-width": 1 });
      var lab = t === 1 ? "1 s" : "10^" + Math.round(v) + " s";
      VZ.txt(svg, px, p.y1 + 19, lab, { size: 10, fill: C.dim, anchor: "middle" });
    });
    [0, 15, 30, 45].forEach(function (u) {
      VZ.ln(svg, p.x0, ym(u), p.x1, ym(u), { stroke: C.faint, "stroke-width": .7, opacity: .5 });
      VZ.txt(svg, p.x0 - 6, ym(u) + 4, "10^" + u, { size: 9.5, fill: C.faint, anchor: "end" });
    });
    VZ.txt(svg, p.x0 - 12, (p.y0 + p.y1) / 2, "尺度因子 a", { size: 11, fill: C.dim, anchor: "middle" });
    VZ.txt(svg, (p.x0 + p.x1) / 2, p.y1 + 36, "时间 t（对数）", { size: 11, fill: C.dim, anchor: "middle" });
    /* 暴胀窗口底色 */
    VZ.el("rect", { x: xm(Math.log10(t0)), y: p.y0, width: xm(Math.log10(tEnd)) - xm(Math.log10(t0)), height: p.y1 - p.y0, fill: C.violet, opacity: .08 }, svg);
    VZ.txt(svg, xm(Math.log10(tEnd)) + 8, p.y0 + 14, "← 暴胀窗口：约 10⁻³⁶ → 10⁻³² 秒", { size: 10.5, fill: C.violet });
    /* 标准大爆炸曲线 */
    var dS = "";
    for (var i = 0; i <= 80; i++) {
      var v = vmin + (vmax - vmin) * i / 80;
      var u = 0.5 * (v - Math.log10(t0));
      if (u > umax) break;
      dS += (dS ? "L" : "M") + xm(v).toFixed(1) + " " + ym(u).toFixed(1);
    }
    VZ.path(svg, dS, VZ.stroke({ stroke: C.gold, "stroke-width": 2, "stroke-dasharray": "8 5" }));
    VZ.txt(svg, p.x1 - 8, ym(0.5 * (vmax - Math.log10(t0))) - 10, "标准大爆炸 a∝t^½", { size: 12, fill: C.gold, weight: 700, anchor: "end" });
    /* 暴胀曲线（随 N 重画） */
    var infPath = VZ.path(svg, "", VZ.stroke({ stroke: C.cyan, "stroke-width": 2.6 }));
    var lblN = VZ.txt(svg, 0, 0, "", { size: 12, fill: C.cyan, weight: 700 });
    function drawInf(N) {
      var d = "", first = true;
      for (var j = 0; j <= 100; j++) {
        var u = umax * j / 100;
        var t;
        if (u < N) t = t0 + (tEnd - t0) * u / N;
        else t = tEnd * Math.pow(10, (u - N * 0.4343 - 0.5 * Math.log10(tEnd)) / 0.5);
        var v2 = Math.log10(t);
        if (v2 < vmin || v2 > vmax) continue;
        d += (first ? "M" : "L") + xm(v2).toFixed(1) + " " + ym(u).toFixed(1);
        first = false;
      }
      infPath.setAttribute("d", d);
      lblN.setAttribute("x", xm(Math.log10(tEnd)) + 14);
      lblN.setAttribute("y", VZ.clamp(ym(N) - 12, p.y0 + 14, p.y1 - 16));
      lblN.textContent = "暴胀：先窜升 e^" + N + " ≈ 10^" + (0.4343 * N).toFixed(0) + " 倍";
    }
    /* 控件 */
    var ctl = VZ.box(stage, "viz-ctl");
    VZ.slider(ctl, {
      label: "e-fold 数 N（暴胀持续几个 e 倍）", value: 60, min: 20, max: 80, step: 1,
      format: function (v) { return "N = " + v + "（a 涨 10^" + (0.4343 * v).toFixed(0) + " 倍）"; },
      onInput: drawInf
    });
    drawInf(60);
  }
},

/* ==========================================================
   28c · 铅笔倒下：对称的定律，不对称的解
   ========================================================== */
"f-ch28c": {
  title: "立在笔尖上的铅笔：定律对称，解不对称",
  hint: "铅笔竖直时，物理定律对一切方向一视同仁——但这个平衡<b>不稳定</b>。点「推倒」：它总会倒下去，而<span class='hl'>倒向哪个方位是纯随机的</span>，每次都在罗盘上留下一个新落点。多推几次：对称的方程不会替它选方向，是「解」自己掷了骰子——这就是自发对称破缺。",
  draw: function (stage) {
    var W = 760, H = 360, svg = VZ.S(stage, W, H, { grid: true });
    var C = VZ.C;
    var cx = 200, cy = 190, R = 118, plen = 96;
    /* 罗盘 */
    VZ.circ(svg, cx, cy, R, { stroke: C.faint, "stroke-width": 1.2 });
    VZ.circ(svg, cx, cy, R * 0.55, { stroke: C.faint, "stroke-width": .8, "stroke-dasharray": "3 5" });
    VZ.circ(svg, cx, cy, 4, { fill: C.ink2 });
    for (var a = 0; a < 12; a++) {
      var ra = a * Math.PI / 6;
      VZ.ln(svg, cx + Math.cos(ra) * R, cy + Math.sin(ra) * R, cx + Math.cos(ra) * (R - 7), cy + Math.sin(ra) * (R - 7), { stroke: C.faint, "stroke-width": 1 });
    }
    VZ.txt(svg, cx, cy - R - 12, "竖直 = 不稳定平衡", { size: 11, fill: C.dim, anchor: "middle" });
    var tickG = VZ.g(svg);
    /* 铅笔（不用组变换，直接改坐标） */
    var pencilLine = VZ.ln(svg, cx, cy, cx, cy - plen, VZ.stroke({ stroke: C.gold, "stroke-width": 5, opacity: .95 }));
    var tipLine = VZ.ln(svg, cx, cy - plen, cx, cy - plen - 9, VZ.stroke({ stroke: C.gold, "stroke-width": 2 }));
    var tipPoly = VZ.poly(svg, [[-4 + cx, cy - plen + 2], [4 + cx, cy - plen + 2], [cx, cy - plen - 12]], { fill: C.gold, stroke: C.gold, "stroke-width": 1 });
    var angTxt = VZ.txt(svg, cx, cy + R + 26, "点击「推倒」，或直接点罗盘", { size: 12, fill: C.ink2, anchor: "middle" });
    /* 右侧解释 */
    VZ.card(svg, 380, 46, 350, 258, { stroke: C.faint });
    var ex = VZ.g(svg);
    VZ.para(ex, 400, 74, "定律：方程在旋转下完全对称，\n竖直解对任何方位角都成立。\n\n但它不稳定——铅笔「必须」倒下。\n倒向是随机的：每倒一次，\n世界就随机选定一个方向。\n\n磁场方向、宇宙的初始褶皱、\n希格斯场的取向，同此一理。", { size: 12.5, per: 26, lh: 21 });
    VZ.txt(svg, 400, 258, "落点计数：0 次", { size: 12, fill: C.violet, weight: 700 });
    var cntTxt = svg.querySelectorAll("text");
    cntTxt = cntTxt[cntTxt.length - 1];
    /* 交互 */
    var falling = false, wob = 0;
    var ctl = VZ.box(stage, "viz-ctl");
    VZ.btn(ctl, "推倒！", function () { topple(); });
    function setPencil(ang) {
      var tx = cx + Math.cos(ang) * plen, ty = cy + Math.sin(ang) * plen;
      pencilLine.setAttribute("x2", tx); pencilLine.setAttribute("y2", ty);
      /* 笔尖小三角，沿杆方向 */
      var px = Math.cos(ang), py = Math.sin(ang), nx = -py, ny = px;
      tipPoly.setAttribute("points",
        (tx - 10 * px + 4 * nx).toFixed(1) + " " + (ty - 10 * py + 4 * ny).toFixed(1) + "," +
        (tx - 10 * px - 4 * nx).toFixed(1) + " " + (ty - 10 * py - 4 * ny).toFixed(1) + "," +
        (tx + 5 * px).toFixed(1) + " " + (ty + 5 * py).toFixed(1));
      tipLine.setAttribute("x1", tx - 8 * px); tipLine.setAttribute("y1", ty - 8 * py);
      tipLine.setAttribute("x2", tx + 5 * px); tipLine.setAttribute("y2", ty + 5 * py);
    }
    setPencil(-Math.PI / 2);
    var stopWob = VZ.raf(svg, function (t) {
      if (!falling) {
        wob = Math.sin(t * 5.2) * 0.028;
        setPencil(-Math.PI / 2 + wob);
      }
    });
    function topple() {
      if (falling) return;
      falling = true;
      var phi = Math.random() * Math.PI * 2;             /* 落点方位 */
      var delta = phi + Math.PI / 2;                     /* 从竖直转过的角 */
      while (delta > Math.PI) delta -= 2 * Math.PI;      /* 取 ≤180° 的倒法 */
      var t0 = performance.now(), dur = 620;
      (function anim() {
        var u = (performance.now() - t0) / dur;
        if (u >= 1) {
          setPencil(phi);
          landMark(phi);
          angTxt.textContent = "落点方位 φ = " + Math.round(phi * 180 / Math.PI + 360) % 360 + "°（随机）";
          setTimeout(function () { falling = false; }, 420);
          return;
        }
        /* 加速下落（重力矩） */
        setPencil(-Math.PI / 2 + delta * u * u);
        requestAnimationFrame(anim);
      })();
    }
    var nFall = 0;
    function landMark(phi) {
      nFall++;
      cntTxt.textContent = "落点计数：" + nFall + " 次";
      var r1 = R - 2;
      VZ.ln(tickG, cx + Math.cos(phi) * (r1 - 10), cy + Math.sin(phi) * (r1 - 10), cx + Math.cos(phi) * r1, cy + Math.sin(phi) * r1,
        VZ.stroke({ stroke: C.violet, "stroke-width": 2.4 }));
      VZ.travel(svg, "M" + cx + " " + cy + "L" + (cx + Math.cos(phi) * plen) + " " + (cy + Math.sin(phi) * plen),
        { color: C.violet, dur: .5, count: 1, r: 3 });
    }
    var hit = VZ.circ(svg, cx, cy, R, { fill: "rgba(0,0,0,0)" });
    hit.addEventListener("click", topple);
  }
},

/* ==========================================================
   29b · 布洛赫球：纯态在球面，混态在球内
   ========================================================== */
"f-ch29b": {
  title: "布洛赫球里的混态：把态矢量拖进球的内部",
  hint: "<b>拖动亮点</b>：在球面上时它是纯态 |ψ⟩（Tr ρ²=1，能干涉）；往球心里拖，它变成混态——一个经典概率混合（Tr ρ²<1）；拖到球心就是最大混态 I/2（完全不掺量子性）。<span class='hl'>球内点没有对应的方向矢，这正是密度矩阵比态矢量更一般的原因</span>。",
  draw: function (stage) {
    var W = 760, H = 360, svg = VZ.S(stage, W, H, { grid: true });
    var C = VZ.C;
    var cx = 250, cy = 182, R = 128;
    /* 球 */
    VZ.circ(svg, cx, cy, R, { stroke: C.ink2, "stroke-width": 1.6 });
    VZ.el("ellipse", { cx: cx, cy: cy, rx: R, ry: R * 0.3, fill: "none", stroke: C.faint, "stroke-width": 1, "stroke-dasharray": "5 5" }, svg);
    VZ.ln(svg, cx, cy - R, cx, cy + R, { stroke: C.faint, "stroke-width": 1, "stroke-dasharray": "4 5" });
    VZ.txt(svg, cx, cy - R - 12, "|0⟩", { size: 14, fill: C.ink, anchor: "middle", weight: 700 });
    VZ.txt(svg, cx, cy + R + 24, "|1⟩", { size: 14, fill: C.ink, anchor: "middle", weight: 700 });
    VZ.txt(svg, cx + R + 14, cy + 5, "|+⟩", { size: 13, fill: C.dim });
    VZ.txt(svg, cx + R * 0.72, cy - R * 0.66, "球面 = 纯态", { size: 11, fill: C.cyan });
    VZ.txt(svg, cx + 10, cy + 34, "球内 = 混态", { size: 11, fill: C.mag });
    VZ.txt(svg, cx, cy + 22, "球心 = I/2", { size: 10.5, fill: C.dim, anchor: "middle" });
    /* 态矢与点 */
    var ray = VZ.ln(svg, cx, cy, cx, cy - R, { stroke: C.ink, "stroke-width": 1.2, "stroke-dasharray": "4 4", opacity: .7 });
    var pt = VZ.circ(svg, cx, cy - R, 8, { fill: C.cyan, stroke: C.deep, "stroke-width": 1.5 });
    var glow = VZ.blurFilter(svg, VZ.uid("gl"), 6);
    var halo = VZ.circ(svg, cx, cy - R, 12, { fill: C.cyan, opacity: .35, filter: glow });
    /* 控件 */
    var out = VZ.panel(stage, { "布洛赫矢量 |r|": "", "纯度 Tr ρ²": "", "性质": "" });
    function setPt(x, z) {   /* Bloch x（水平）、z（竖直），r ≤ 1 */
      var r = Math.hypot(x, z);
      if (r > 1) { x /= r; z /= r; r = 1; }
      var px = cx + x * R, py = cy - z * R;
      pt.setAttribute("cx", px); pt.setAttribute("cy", py);
      halo.setAttribute("cx", px); halo.setAttribute("cy", py);
      ray.setAttribute("x2", px); ray.setAttribute("y2", py);
      var pur = (1 + r * r) / 2;
      var kind = r > 0.999 ? "纯态（球面上，可干涉）" : (r < 0.02 ? "最大混态 I/2（球心）" : "混态（球内，经典混合）");
      VZ.setPanel(out, {
        "布洛赫矢量 |r|": r.toFixed(3),
        "纯度 Tr ρ²": pur.toFixed(3),
        "性质": kind
      });
      var c = r > 0.999 ? C.cyan : (r < 0.02 ? C.dim : C.mag);
      pt.setAttribute("fill", c); halo.setAttribute("fill", c);
    }
    var hit = VZ.circ(svg, cx, cy, R + 16, { fill: "rgba(0,0,0,0)", style: "cursor:grab" });
    VZ.drag(svg, hit, W, H, function (x, y) {
      setPt((x - cx) / R, -(y - cy) / R);
    });
    setPt(0.62, 0.5);
    /* 右侧说明 */
    VZ.card(svg, 470, 60, 262, 216, { stroke: C.faint });
    var ex = VZ.g(svg);
    VZ.para(ex, 490, 88, "ρ = ½(I + r⃗·σ⃗)\n\n纯态：|r| = 1，Tr ρ² = 1\n混态：|r| < 1，Tr ρ² < 1\n\n测量一次把纯态拉回球面；\n环境纠缠把它拽向球心。", { size: 12.5, per: 20, lh: 21 });
  }
},

/* ==========================================================
   29c · 退相干：环境碰撞率抹平干涉条纹
   ========================================================== */
"f-ch29c": {
  title: "退相干：环境碰撞越频繁，条纹消失得越快",
  hint: "干涉条纹的<b>可见度</b>按 V = e^(−Γt) 衰减，Γ 是与环境碰撞的速率。拖滑块加大 Γ：条纹在更短时间内被抹成均匀灰——<span class='hl'>不是「观测者看了」，而是一粒灰尘每秒撞 10²⁰ 次空气分子，相位信息早就漏进环境里了</span>。这就是为什么宏观叠加从不被看见（FAPP）。",
  draw: function (stage) {
    var W = 760, H = 400, svg = VZ.S(stage, W, H, { grid: true });
    var C = VZ.C;
    var T = 6;                       /* 演示时间窗（秒） */
    var NBAR = 46, bx0 = 70, bx1 = 700, bw = (bx1 - bx0) / NBAR;
    var base = 150, hmax = 92;
    var gam = 0.6, tNow = 0;
    /* 条纹条 */
    var bars = [];
    var barG = VZ.g(svg);
    for (var i = 0; i < NBAR; i++) {
      bars.push(VZ.el("rect", { x: bx0 + i * bw + 1.5, y: 0, width: bw - 3, height: 10, rx: 2, fill: C.cyan }, barG));
    }
    VZ.ln(svg, bx0, base, bx1, base, { stroke: C.ink2, "stroke-width": 1 });
    VZ.txt(svg, bx0, base + 20, "屏幕位置 →", { size: 10.5, fill: C.dim });
    var vTxt = VZ.txt(svg, bx1, base - 106, "", { size: 12.5, fill: C.gold, weight: 700, anchor: "end" });
    /* 可见度曲线 */
    var cy0 = 350, cx0 = 70, cx1 = 700, cy1 = 252;
    VZ.ln(svg, cx0, cy0, cx1, cy0, { stroke: C.ink2, "stroke-width": 1 });
    VZ.ln(svg, cx0, cy1, cx0, cy0, { stroke: C.ink2, "stroke-width": 1 });
    var vCurve = VZ.path(svg, "", VZ.stroke({ stroke: C.gold, "stroke-width": 2 }));
    var vDot = VZ.circ(svg, cx0, cy0, 5.5, { fill: C.gold, stroke: C.deep, "stroke-width": 1 });
    VZ.txt(svg, cx0 + 4, cy1 - 8, "可见度 V(t) = e^(−Γt)", { size: 11, fill: C.gold });
    VZ.txt(svg, cx1 + 6, cy0 + 4, "t", { size: 11, fill: C.dim });
    /* 控件 */
    var ctl = VZ.box(stage, "viz-ctl");
    var flash = VZ.note(stage, "");
    VZ.slider(ctl, {
      label: "环境碰撞率 Γ", value: 0.6, min: 0.1, max: 2, step: 0.05,
      format: function (v) { return v.toFixed(2) + " /s（特征退相干时间 " + (1 / v).toFixed(1) + " s）"; },
      onInput: function (v) { gam = v; drawCurve(); }
    });
    VZ.btn(ctl, "↻ 从 t=0 重播", function () { tNow = 0; });
    function drawCurve() {
      var d = "";
      for (var j = 0; j <= 80; j++) {
        var t = T * j / 80;
        var V = Math.exp(-gam * t);
        d += (j ? "L" : "M") + (cx0 + t / T * (cx1 - cx0)).toFixed(1) + " " + (cy0 - V * (cy0 - cy1)).toFixed(1);
      }
      vCurve.setAttribute("d", d);
    }
    drawCurve();
    var last = performance.now();
    VZ.raf(svg, function (t, dt) {
      tNow += Math.min(dt, 60) / 1000;
      if (tNow > T) tNow = 0;
      var V = Math.exp(-gam * tNow);
      for (var i = 0; i < NBAR; i++) {
        var ph = i / NBAR * Math.PI * 6;
        var I = 0.18 + 0.82 * (0.5 + 0.5 * V * Math.cos(ph));
        var h = I * hmax;
        bars[i].setAttribute("y", base - h);
        bars[i].setAttribute("height", h);
        bars[i].setAttribute("opacity", 0.35 + 0.65 * I);
      }
      vTxt.textContent = "可见度 V = " + V.toFixed(3) + (V < 0.05 ? "　（条纹已死：经典世界）" : "");
      vDot.setAttribute("cx", cx0 + tNow / T * (cx1 - cx0));
      vDot.setAttribute("cy", cy0 - V * (cy0 - cy1));
    });
  }
}

});
