/* ============================================================
   viz-part14.js — 第三批挂载式小图（ch25–ch28，每章 4 张）
   规格：FIG-SPEC3 — title 留空、H∈[220,320]、嵌在讲解步骤下方
   ============================================================ */
VZ.define({

/* ==========================================================
   ch25-d · 三代费米子：同一套模式复印三遍
   ========================================================== */
"f-ch25d": {
  title: "",
  hint: "点击<b>第一 / 二 / 三代</b>，看表格逐列高亮：每一代都是同一套复印——一个带电轻子、一个中微子、一个上型夸克、一个下型夸克，只是质量逐代暴涨。<span class='hl'>标准模型没有解释为什么恰好是三代</span>——这是它最著名的『缺页』之一。",
  draw: function (stage) {
    var W = 760, H = 272, svg = VZ.S(stage, W, H, {});
    var C = VZ.C;
    var gens = [
      { name: "第一代", c: C.cyan, lepton: ["电子 e⁻", "0.511 MeV"], nu: ["中微子 νₑ", "≈ 0"], up: ["上夸克 u", "≈ 2.2 MeV"], dn: ["下夸克 d", "≈ 4.7 MeV"] },
      { name: "第二代", c: C.gold, lepton: ["μ 子", "105.7 MeV"], nu: ["中微子 ν_μ", "≈ 0"], up: ["粲夸克 c", "≈ 1.27 GeV"], dn: ["奇夸克 s", "≈ 95 MeV"] },
      { name: "第三代", c: C.mag, lepton: ["τ 子", "1777 MeV"], nu: ["中微子 ν_τ", "≈ 0"], up: ["顶夸克 t", "≈ 173 GeV"], dn: ["底夸克 b", "≈ 4.2 GeV"] }
    ];
    var rows = [
      { key: "lepton", label: "带电轻子", icon: "e" },
      { key: "nu", label: "中微子", icon: "ν" },
      { key: "up", label: "上型夸克 (⅔)", icon: "Q" },
      { key: "dn", label: "下型夸克 (−⅓)", icon: "q" }
    ];
    var colX = [300, 460, 620], rowY = [78, 128, 178, 228];
    /* 左侧行标签 */
    rows.forEach(function (r, i) {
      VZ.txt(svg, 40, rowY[i] - 4, r.label, { size: 12.5, fill: C.ink2 });
      VZ.txt(svg, 40, rowY[i] + 14, r.icon + "  自旋 ½", { size: 10.5, fill: C.dim });
    });
    /* 列头 */
    var heads = [];
    gens.forEach(function (gn, j) {
      var h = VZ.g(svg, { style: "cursor:pointer" });
      VZ.card(h, colX[j] - 62, 28, 124, 34, { rx: 8 });
      VZ.txt(h, colX[j], 50, gn.name, { size: 14, fill: gn.c, anchor: "middle", weight: 700 });
      heads.push(h);
      h.addEventListener("click", function () { pick(j); });
    });
    /* 单元格 */
    var cells = [];
    gens.forEach(function (gn, j) {
      var col = [];
      rows.forEach(function (r, i) {
        var gg = VZ.g(svg);
        VZ.card(gg, colX[j] - 70, rowY[i] - 26, 140, 44, { rx: 9 });
        var nm = VZ.txt(gg, colX[j], rowY[i] - 6, "", { size: 12.5, fill: C.ink, anchor: "middle", weight: 700 });
        var ms = VZ.txt(gg, colX[j], rowY[i] + 11, "", { size: 10.5, fill: C.dim, anchor: "middle" });
        col.push({ g: gg, nm: nm, ms: ms });
      });
      cells.push(col);
    });
    /* 复印箭头 */
    VZ.path(svg, "M366 158H394M526 158H554", { stroke: C.faint, "stroke-width": 1.2, "stroke-dasharray": "4 4" });
    VZ.txt(svg, 760 - 18, 264, "同一模式 × 3", { size: 10.5, fill: C.dim, anchor: "end" });
    function pick(j) {
      gens.forEach(function (gn, k) {
        heads[k].querySelector("rect").setAttribute("stroke", k === j ? gn.c : C.faint);
        heads[k].querySelector("rect").setAttribute("stroke-width", k === j ? 2 : 1);
        heads[k].querySelector("rect").setAttribute("fill", k === j ? "rgba(255,255,255,.06)" : "rgba(255,255,255,.02)");
        rows.forEach(function (r, i) {
          var cell = cells[k][i];
          cell.nm.textContent = gn[r.key][0];
          cell.ms.textContent = gn[r.key][1];
          cell.nm.setAttribute("fill", k === j ? C.ink : C.ink2);
          cell.g.setAttribute("opacity", k === j ? 1 : 0.32);
        });
      });
      var m = ["0.5 MeV → 106 MeV → 1777 MeV（重 3477 倍）",
               "2.2 MeV → 1270 MeV → 173000 MeV（重 78000 倍）",
               "4.7 MeV → 95 MeV → 4180 MeV（重 890 倍）"][j === 0 ? 1 : j === 1 ? 0 : 2];
      ro.innerHTML = "<b>" + gens[j].name + "</b>　" +
        "质量逐代暴涨：" + (j === 0 ? "夸克（上型）" : j === 1 ? "轻子（带电）" : "轻子（带电）") + " " + m;
    }
    var ro = VZ.readout(stage);
    pick(0);
  }
},

/* ==========================================================
   ch25-e · C / P / T：弱作用把镜子打破了
   ========================================================== */
"f-ch25e": {
  title: "",
  hint: "切换 <b>C / P / T / CPT</b> 四种变换，看镜像世界的衰变还像不像真的：单独的 C、单独的 P 都被弱作用破坏，连 CP 也略有破坏——但三者<b>连乘 CPT 严格成立</b>，这是局域量子场论最深的一条地基。",
  draw: function (stage) {
    var W = 760, H = 296, svg = VZ.S(stage, W, H, {});
    var C = VZ.C;
    var ctl = VZ.box(stage, "viz-chips");
    var ro = VZ.readout(stage);
    /* 场景：钴核 β 衰变，电子偏好某个方向射出（左手性） */
    function scene(cx, cy, opts) {
      var gg = VZ.g(svg);
      /* 核 */
      VZ.circ(gg, cx, cy, 16, { fill: "rgba(255,255,255,.05)", stroke: C.ink2, "stroke-width": 1.6 });
      VZ.txt(gg, cx, cy + 4, "Co", { size: 11, fill: C.ink2, anchor: "middle" });
      /* 出射电子 */
      var dx = opts.flip ? -1 : 1;
      var ex = cx + 78 * dx;
      VZ.path(gg, "M" + (cx + 18 * dx) + " " + cy + "L" + ex + " " + cy, { stroke: opts.anti ? C.mag : C.cyan, "stroke-width": 2.4 });
      VZ.path(gg, "M" + ex + " " + cy + "l" + (-9 * dx) + " -5v10z", { fill: opts.anti ? C.mag : C.cyan });
      VZ.txt(gg, ex + 12 * dx, cy - 10, opts.anti ? "正电子 e⁺" : "电子 e⁻", { size: 11.5, fill: opts.anti ? C.mag : C.cyan, anchor: opts.flip ? "start" : "end" });
      /* 自旋箭头（弧） */
      var sr = 13, sx = ex + 20 * dx;
      VZ.path(gg, "M" + sx + " " + (cy - sr) + "A" + sr + " " + sr + " 0 1 " + (opts.spinFlip ? 0 : 1) + " " + sx + " " + (cy + sr), VZ.stroke({ stroke: C.gold, "stroke-width": 1.6 }));
      var hd = opts.spinFlip ? -1 : 1;
      VZ.path(gg, "M" + sx + " " + (cy + sr) + "l5 " + (3 * hd) + "l-9 2z", { fill: C.gold });
      VZ.txt(gg, sx + 16, cy + 4, "自旋", { size: 10.5, fill: C.gold });
      /* 左/右手性标记 */
      VZ.txt(gg, cx, cy + 44, opts.hand === "L" ? "左手性（左手螺旋）" : "右手性（右手螺旋）", { size: 11, fill: opts.hand === "L" ? C.cyan : C.violet, anchor: "middle" });
      return gg;
    }
    var verdict = VZ.txt(svg, 380, 30, "", { size: 13.5, fill: C.gold, anchor: "middle", weight: 700 });
    var detail = VZ.g(svg);
    var leftCard = VZ.card(svg, 60, 58, 300, 170, { stroke: C.faint });
    var rightCard = VZ.card(svg, 400, 58, 300, 170, { stroke: C.faint });
    VZ.txt(svg, 210, 82, "我们的世界", { size: 13, fill: C.ink, anchor: "middle", weight: 700 });
    var rTitle = VZ.txt(svg, 550, 82, "", { size: 13, fill: C.ink, anchor: "middle", weight: 700 });
    var lScene = null, rScene = null;
    var modes = {
      "原过程": function () {
        return { rt: "原过程（β 衰变）", rf: { flip: false, anti: false, hand: "L", spinFlip: false }, verdict: "电子几乎全是左手性的——这就是吴健雄实验", ok: true,
          d: "钴-60 β 衰变中，电子优先沿与核自旋相反的方向飞出。镜像里电子本该换边，但自旋不换——<b>自然界能区分左右</b>。" };
      },
      "C（电荷反演）": function () {
        return { rt: "C 变换后的世界", rf: { flip: false, anti: true, hand: "L", spinFlip: false }, verdict: "✗ C 被破坏：镜像里是左手正电子，从未观测到", ok: false,
          d: "把所有粒子换成反粒子：电子变正电子。可观测到的正电子几乎全是<b>右手性</b>的——C 变换后的世界不像我们的世界。" };
      },
      "P（镜像）": function () {
        return { rt: "P 变换后的世界", rf: { flip: true, anti: false, hand: "R", spinFlip: true }, verdict: "✗ P 被破坏：镜中电子换边、自旋不换", ok: false,
          d: "照镜子：位置反了（电子飞向另一边），但自旋轴方向不变，于是镜中的电子成了右手性——<b>这种衰变在自然界不存在</b>。" };
      },
      "T（时间反演）": function () {
        return { rt: "T 变换后的世界", rf: { flip: false, anti: false, hand: "L", spinFlip: false }, verdict: "△ T 也有微小破缺（K 介子实验，2012 直接证据）", ok: null,
          d: "把录像倒放：微观上正反过程几乎对称，但在 K 介子与 B 介子实验里测到了微小的 T 破缺——这正是宇宙中物质多于反物质的候选解释之一。" };
      },
      "CPT（三者连乘）": function () {
        return { rt: "CPT 变换后的世界", rf: { flip: true, anti: true, hand: "R", spinFlip: true }, verdict: "✓ CPT 严格成立：局域洛伦兹场论的铁律", ok: true,
          d: "电荷反演 + 镜像 + 时间倒流一起做，物理定律恢复原样。任何违反 CPT 的观测都会动摇整个量子场论——至今零证据。" };
      }
    };
    var chipItems = Object.keys(modes);
    VZ.chips(ctl, chipItems, "原过程", function (m) { render(m); });
    function render(m) {
      var M = modes[m]();
      if (lScene) lScene.remove(); if (rScene) rScene.remove();
      lScene = scene(210, 158, { flip: false, anti: false, hand: "L", spinFlip: false });
      rScene = scene(550, 158, M.rf);
      rTitle.textContent = M.rt;
      verdict.textContent = M.verdict;
      verdict.setAttribute("fill", M.ok === true ? C.green : M.ok === false ? C.red : C.gold);
      detail.innerHTML = "";
      VZ.para(detail, 60, 252, M.d, { size: 12, per: 56, lh: 17 });
    }
    render("原过程");
  }
},

/* ==========================================================
   ch25-f · 希格斯糖浆：质量来自阻力
   ========================================================== */
"f-ch25f": {
  title: "",
  hint: "滑块调<b>耦合强度 g</b>（或点粒子预设）：与希格斯场耦合越强，粒子穿场时被『拖拽』得越厉害——被拖拽，就是我们所说的<b>有质量</b>。光子 g=0，径直穿过去，所以光子没有质量。",
  draw: function (stage) {
    var W = 760, H = 252, svg = VZ.S(stage, W, H, {});
    var C = VZ.C;
    /* 糖浆区 */
    VZ.card(svg, 150, 40, 560, 150, { stroke: "rgba(255,255,255,.1)", fill: "rgba(155,140,255,.06)" });
    VZ.txt(svg, 430, 30, "希格斯场（布满空间的『糖浆』）", { size: 12, fill: C.violet, anchor: "middle" });
    var dots = VZ.g(svg);
    for (var i = 0; i < 90; i++) {
      VZ.circ(dots, 158 + (i % 18) * 31, 52 + Math.floor(i / 18) * 34 + (i % 3) * 8, 2.2, { fill: C.violet, opacity: .38 });
    }
    var chipHost = VZ.box(stage, "viz-chips");
    var sHost = VZ.box(stage, "viz-ctl");
    var ro = VZ.readout(stage);
    var trail = VZ.path(svg, "", VZ.stroke({ stroke: C.gold, "stroke-width": 1.6, opacity: .8 }));
    var dot = VZ.circ(svg, 0, 0, 8, { fill: C.gold });
    var g = 1, px = 150, py = 115, hist = [];
    VZ.slider(sHost, { label: "耦合强度 g", value: 1, min: 0, max: 3, step: 0.05, format: function (v) { return v.toFixed(2); }, onInput: function (v) { g = v; } });
    VZ.chips(chipHost, ["光子 g=0", "电子 g≈1", "顶夸克 g≈3"], "电子 g≈1", function (m) {
      g = m.indexOf("光子") === 0 ? 0 : m.indexOf("顶") === 0 ? 3 : 1;
      sl.set(g); ro.innerHTML = "";
    });
    var sl = { set: function () {} };
    var sliders = stage.querySelectorAll("input[type=range]");
    if (sliders.length) {
      var inp = sliders[sliders.length - 1];
      sl.set = function (v) { inp.value = v; inp.dispatchEvent(new Event("input")); };
    }
    var lbl = VZ.txt(svg, 40, 220, "", { size: 12.5, fill: C.gold });
    VZ.raf(svg, function (t, ms) {
      var dt = Math.min(ms, 50) / 1000;
      var speed = 300 / (1 + 2.6 * g);
      px += speed * dt;
      if (px > 700) { px = 150; hist = []; }
      py = 115 + (g > 0 ? Math.sin(t * (2 + g * 3)) * g * 5 : 0);
      dot.setAttribute("cx", px); dot.setAttribute("cy", py);
      hist.push([px, py]); if (hist.length > 60) hist.shift();
      trail.setAttribute("d", hist.map(function (p, i) { return (i ? "L" : "M") + p[0].toFixed(1) + " " + p[1].toFixed(1); }).join(""));
      lbl.textContent = g < 0.03 ? "m = 0：无阻力，永远以光速穿行"
        : "被糖浆拖住 → 表现为有质量：m ∝ g　（当前 g = " + g.toFixed(2) + "）";
    });
  }
},

/* ==========================================================
   ch25-g · 色荷：三种颜色只许拼成无色
   ========================================================== */
"f-ch25g": {
  title: "",
  hint: "<b>点击每个夸克</b>循环它的色荷（红绿蓝 / 反红反绿反蓝）。只有拼出『无色』的组合才被允许作为自由粒子存在——这就是禁令：红+绿+蓝=白（重子），红+反红=白（介子），任何有色组合永远被关在强子里。",
  draw: function (stage) {
    var W = 760, H = 262, svg = VZ.S(stage, W, H, {});
    var C = VZ.C;
    var colors = [
      { name: "红", anti: "反红", col: C.red, antiCol: C.cyan },
      { name: "绿", anti: "反绿", col: C.green, antiCol: C.mag },
      { name: "蓝", anti: "反蓝", col: C.blue, antiCol: C.gold }
    ];
    var state = [0, 1, 2]; /* 初始：红绿蓝 */
    var pos = [[300, 100], [460, 100], [380, 200]];
    var qs = [];
    var ro = VZ.readout(stage);
    var verdict = VZ.txt(svg, 380, 44, "", { size: 14, fill: C.green, anchor: "middle", weight: 700 });
    /* 连接弹簧线 */
    var links = VZ.g(svg);
    VZ.path(links, "M300 100L460 100M300 100L380 200M460 100L380 200", VZ.stroke({ stroke: C.faint, "stroke-width": 1.4, "stroke-dasharray": "6 5" }));
    VZ.txt(svg, 380, 92, "胶子不断交换色荷", { size: 10.5, fill: C.dim, anchor: "middle" });
    VZ.txt(svg, 380, 168, "胶子也带色荷（8 种）", { size: 10.5, fill: C.dim, anchor: "middle" });
    pos.forEach(function (p, i) {
      var gg = VZ.g(svg, { style: "cursor:pointer" });
      VZ.circ(gg, p[0], p[1], 22, { fill: "rgba(255,255,255,.04)" });
      var ball = VZ.circ(gg, p[0], p[1], 15, { fill: "none", "stroke-width": 3.5 });
      var lbl = VZ.txt(gg, p[0], p[1] + 40, "", { size: 11.5, anchor: "middle", weight: 700 });
      var tag = VZ.txt(gg, p[0], p[1] - 30, "q" + (i + 1), { size: 11, fill: C.dim, anchor: "middle" });
      qs.push({ g: gg, ball: ball, lbl: lbl });
      gg.addEventListener("click", function () {
        state[i] = (state[i] + 1) % 6;
        redraw();
      });
    });
    function redraw() {
      var names = state.map(function (s) {
        var c = colors[s % 3];
        return s < 3 ? c.name : c.anti;
      });
      qs.forEach(function (q, i) {
        var c = colors[state[i] % 3];
        var col = state[i] < 3 ? c.col : c.antiCol;
        q.ball.setAttribute("stroke", col);
        q.ball.setAttribute("fill", col + "22");
        q.lbl.textContent = names[i];
        q.lbl.setAttribute("fill", col);
      });
      var sorted = names.slice().sort().join("+");
      var white = (sorted === "反红+反绿+反蓝" || sorted === "红+绿+蓝");
      verdict.textContent = white ? "✓ 无色（白）→ 允许作为自由强子存在" : "✗ 有色 → 被禁令禁止：永远束缚在强子内部";
      verdict.setAttribute("fill", white ? C.green : C.red);
      ro.innerHTML = white
        ? "<b>色中性组合</b>：三种色荷相加为零，就像 RGB 三原色叠成白光。质子、中子都是这种 u/d 夸克的『白色』组合。"
        : "<b>禁令生效</b>：总色荷 ≠ 0 的组合无法孤立存在。夸克永远凑成白色集体——这叫『色禁闭』，也是强作用力最难缠的性质。";
    }
    redraw();
  }
},

/* ==========================================================
   ch26-d · 场的激发 = 粒子：一排耦合振子
   ========================================================== */
"f-ch26d": {
  title: "",
  hint: "<b>点击画面任意位置</b>，在那附近激起一列波包——它会像粒子一样整体传播、保持形状。量子场论的断言：<span class='hl'>这个波包的一份量子，就是一个电子（或光子）</span>。粒子不是小球，是场的一次有限能量激发。",
  draw: function (stage) {
    var W = 760, H = 264, svg = VZ.S(stage, W, H, {});
    var C = VZ.C;
    var N = 40, x0 = 40, dx = (W - 80) / (N - 1), y0 = 128;
    var y = [], v = [];
    for (var i = 0; i < N; i++) { y.push(0); v.push(0); }
    /* 基线 */
    VZ.ln(svg, x0 - 6, y0, x0 + (N - 1) * dx + 6, y0, { stroke: C.faint, "stroke-width": 1 });
    /* 场的底座格点 */
    for (var k = 0; k < N; k++) VZ.ln(svg, x0 + k * dx, y0, x0 + k * dx, y0 - 8, { stroke: C.faint, "stroke-width": .7, opacity: .5 });
    VZ.txt(svg, 40, 44, "量子场 = 无穷多个相互耦合的谐振子（图中画 40 个）", { size: 12, fill: C.ink2 });
    var balls = [], stems = [];
    for (var k2 = 0; k2 < N; k2++) {
      stems.push(VZ.ln(svg, x0 + k2 * dx, y0, x0 + k2 * dx, y0, { stroke: C.ink2, "stroke-width": 1 }));
      balls.push(VZ.circ(svg, x0 + k2 * dx, y0, 3.6, { fill: C.ink2 }));
    }
    var pulse = VZ.circ(svg, 380, 128, 7, { fill: "none", stroke: C.gold, "stroke-width": 1.6, opacity: 0 });
    var energyTxt = VZ.txt(svg, 40, 238, "能量 = 0（基态：真空）", { size: 12.5, fill: C.dim });
    var excited = false;
    VZ.drag(svg, svg, W, H, function (x, ym, phase) {
      if (phase !== "start") return;
      var i0 = Math.round((x - x0) / dx);
      for (var j = 0; j < N; j++) {
        var d = (j - i0) / 2.2;
        v[j] += 46 * Math.exp(-d * d / 2);
      }
      excited = true;
    });
    var acc = 0;
    VZ.raf(svg, function (t, ms) {
      var dt = Math.min(ms, 40) / 1000;
      /* 耦合振子链：离散波动方程 */
      var E = 0;
      for (var j = 0; j < N; j++) {
        var yl = j > 0 ? y[j - 1] : y[j], yr = j < N - 1 ? y[j + 1] : y[j];
        var a = 260 * (yl + yr - 2 * y[j]) - 0.15 * v[j];
        v[j] += a * dt; E += 0.5 * v[j] * v[j];
      }
      var peak = 0, px2 = 0, pk = 0;
      for (var j2 = 0; j2 < N; j2++) {
        y[j2] += v[j2] * dt;
        y[j2] = VZ.clamp(y[j2], -86, 86);
        var py2 = y0 - y[j2];
        stems[j2].setAttribute("y2", py2);
        balls[j2].setAttribute("cy", py2);
        if (Math.abs(y[j2]) > peak) { peak = Math.abs(y[j2]); px2 = x0 + j2 * dx; pk = j2; }
      }
      E += 0.5 * 260 * y.reduce(function (s, yy, idx) {
        var yl = idx > 0 ? y[idx - 1] : yy;
        return s + (yy - yl) * (yy - yl);
      }, 0);
      if (peak > 4) {
        pulse.setAttribute("cx", px2);
        pulse.setAttribute("cy", y0 - y[pk]);
        pulse.setAttribute("opacity", 0.85);
      } else {
        pulse.setAttribute("opacity", 0);
      }
      energyTxt.textContent = excited
        ? "激发态：一份有限能量在链上传播——这就是『一个粒子』"
        : "能量 = 0（基态：真空）——点击画面注入一份能量";
      energyTxt.setAttribute("fill", excited ? C.gold : C.dim);
    });
  }
},

/* ==========================================================
   ch26-e · 费曼图顶点计费：阶数越高贡献越小
   ========================================================== */
"f-ch26e": {
  title: "",
  hint: "滑块增加<b>虚光子交换的圈数</b>，看图上的顶点如何翻倍、右侧条形如何暴跌：每个顶点记一笔 α≈1/137 的『账』。微扰论能成立，全靠<span class='hl'>高阶图小得可以忽略</span>——若耦合是 1 而不是 1/137，这套算法就整个垮掉。",
  draw: function (stage) {
    var W = 760, H = 268, svg = VZ.S(stage, W, H, {});
    var C = VZ.C;
    var ctl = VZ.box(stage, "viz-ctl");
    var ro = VZ.readout(stage);
    var loops = 1;
    VZ.slider(ctl, { label: "圈数（每圈 +2 顶点）", value: 1, min: 0, max: 4, step: 1, format: function (v) { return String(v); }, onInput: function (v) { loops = v; redraw(); } });
    var dg = VZ.g(svg);
    var barG = VZ.g(svg);
    VZ.txt(svg, 380, 28, "电子自能：每多一个圈，多记两笔 α 的账", { size: 12.5, fill: C.ink2, anchor: "middle" });
    var V = 2 * loops + 2; /* 顶点数 */
    var amp = Math.pow(1 / 137, V / 2);
    /* 画费曼图：电子线 + 虚光子弧 */
    dg.innerHTML = "";
    var lx = 70, rx2 = 330, ey = 140;
    VZ.path(dg, "M" + lx + " " + ey + "H" + rx2, { stroke: C.cyan, "stroke-width": 2.6 });
    VZ.txt(dg, lx + 4, ey + 20, "电子线", { size: 11, fill: C.cyan });
    var verts = [];
    for (var i = 0; i <= loops; i++) {
      verts.push(lx + 60 + i * ((rx2 - 120) / Math.max(loops, 1)));
    }
    verts.forEach(function (vx, i) {
      VZ.circ(dg, vx, ey, 4.5, { fill: C.gold });
      if (i < verts.length - 1) {
        var mx = (vx + verts[i + 1]) / 2, span = verts[i + 1] - vx;
        VZ.path(dg, "M" + vx + " " + ey + "C" + vx + " " + (ey - span * .8) + " " + verts[i + 1] + " " + (ey - span * .8) + " " + verts[i + 1] + " " + ey, VZ.stroke({ stroke: C.mag, "stroke-width": 1.8, "stroke-dasharray": "6 4" }));
      }
    });
    VZ.txt(dg, (lx + rx2) / 2, 66, "虚光子（内线，圈数 = " + loops + "）", { size: 11.5, fill: C.mag, anchor: "middle" });
    /* 相对贡献条形（对数刻度） */
    var bx = 430, bw = 280, by = 60, bh = 160;
    VZ.card(svg, bx - 16, 46, bw + 30, 190, { stroke: C.faint });
    VZ.txt(svg, bx - 6, 66, "相对贡献（对数尺）", { size: 12, fill: C.ink });
    for (var L = 0; L <= 4; L++) {
      var v2 = 2 * L + 2, a2 = Math.pow(1 / 137, v2 / 2);
      var hgt = Math.max(4, (Math.log(a2) / Math.log(1 / 137)) * -1 * (bh / 8));
      hgt = VZ.clamp((8 - v2) / 8, 0.04, 1) * bh;
      var active = L === loops;
      VZ.card(barG, bx + 8 + L * 56, by + bh - hgt, 40, hgt, { fill: active ? "rgba(255,207,92,.28)" : "rgba(255,255,255,.04)", stroke: active ? C.gold : C.faint, sw: active ? 1.6 : 1 });
      VZ.txt(barG, bx + 28 + L * 56, by + bh - hgt - 6, a2 < 1e-7 ? a2.toExponential(0) : a2.toPrecision(2), { size: active ? 10.5 : 9.5, fill: active ? C.gold : C.dim, anchor: "middle" });
      VZ.txt(barG, bx + 28 + L * 56, by + bh + 14, v2 + " 顶点", { size: 10.5, fill: active ? C.gold : C.dim, anchor: "middle" });
    }
    function redraw() {
      var V = 2 * loops + 2;
      var amp = Math.pow(1 / 137, V / 2);
      barG.querySelectorAll("rect").forEach(function (r, idx) {
        var active = idx === loops;
        r.setAttribute("stroke", active ? C.gold : C.faint);
        r.setAttribute("stroke-width", active ? 1.6 : 1);
        r.setAttribute("fill", active ? "rgba(255,207,92,.28)" : "rgba(255,255,255,.04)");
      });
      ro.innerHTML = "<b>" + V + " 个顶点</b> → 振幅 ∝ α^{" + (V / 2) + "} = " + (amp < 1e-5 ? amp.toExponential(2) : amp.toPrecision(3)) +
        (loops === 0 ? "　树图级：最大贡献" : "　仅为主图的 " + (amp * 137).toExponential(1) + " 倍 α 量级修正");
    }
    redraw();
  }
},

/* ==========================================================
   ch26-f · 真空涨落：借能量，限时还
   ========================================================== */
"f-ch26f": {
  title: "",
  hint: "真空不是空的：正反粒子对不断<b>凭空借能量诞生、又迅速湮灭还债</b>。滑块调『借的能量 ΔE』——借得越多，<span class='hl'>允许存在的时间 Δt≈ħ/ΔE 就越短</span>。这是不确定性原理对真空的许可证制度。",
  draw: function (stage) {
    var W = 760, H = 248, svg = VZ.S(stage, W, H, {});
    var C = VZ.C;
    var ctl = VZ.box(stage, "viz-ctl");
    var ro = VZ.readout(stage);
    var dE = 0.5;
    VZ.slider(ctl, { label: "借的能量 ΔE（单位 ħ/普朗克时间）", value: 0.5, min: 0.2, max: 3, step: 0.1, format: function (v) { return v.toFixed(1); }, onInput: function (v) { dE = v; } });
    /* 真空底 */
    VZ.card(svg, 30, 46, 700, 150, { stroke: "rgba(255,255,255,.08)", fill: "rgba(255,255,255,.015)" });
    VZ.txt(svg, 46, 68, "真空 |0⟩", { size: 12, fill: C.dim });
    var pairs = [];
    function spawn() {
      pairs.push({
        x: 90 + Math.random() * 580, y: 80 + Math.random() * 90,
        ph: 0, T: 1.6 / dE, maxd: 16 + dE * 8
      });
    }
    spawn(); spawn(); spawn();
    var dtTxt = VZ.txt(svg, 380, 224, "", { size: 13, fill: C.gold, anchor: "middle", weight: 700 });
    VZ.raf(svg, function (t, ms) {
      var dt = Math.min(ms, 50) / 1000;
      if (pairs.length < 5 && Math.random() < 0.05) spawn();
      for (var i = pairs.length - 1; i >= 0; i--) {
        var P = pairs[i];
        P.ph += dt / P.T;
        if (P.el === undefined) {
          P.g = VZ.g(svg);
          P.e1 = VZ.circ(P.g, 0, 0, 5.5, { fill: C.cyan });
          P.e2 = VZ.circ(P.g, 0, 0, 5.5, { fill: C.mag });
          P.ln = VZ.ln(P.g, 0, 0, 0, 0, { stroke: C.ink2, "stroke-width": 1, "stroke-dasharray": "3 3" });
        }
        if (P.ph >= 1) { P.g.remove(); pairs.splice(i, 1); continue; }
        var s = Math.sin(Math.PI * P.ph);
        var d = s * P.maxd;
        P.e1.setAttribute("cx", P.x - d); P.e1.setAttribute("cy", P.y - d * .5);
        P.e2.setAttribute("cx", P.x + d); P.e2.setAttribute("cy", P.y + d * .5);
        P.ln.setAttribute("x1", P.x - d); P.ln.setAttribute("y1", P.y - d * .5);
        P.ln.setAttribute("x2", P.x + d); P.ln.setAttribute("y2", P.y + d * .5);
        P.g.setAttribute("opacity", Math.sin(Math.PI * P.ph));
      }
      dtTxt.textContent = "ΔE·Δt ≲ ħ　→　当前借 ΔE=" + dE.toFixed(1) + "，允许存在 Δt ≈ " + (1 / dE).toFixed(2) + "（相对单位）";
    });
    ro.innerHTML = "<b>看什么</b>：调大 ΔE，粒子对出现得更『猛』但消失得更快——宇宙银行不发放长期贷款。卡西米尔效应与兰姆位移，就是这些虚拟粒子留下的真实账单。";
  }
},

/* ==========================================================
   ch26-g · 路径积分：所有路径求和，经典路径最亮
   ========================================================== */
"f-ch26g": {
  title: "",
  hint: "滑块推向<b>经典极限</b>：相位快速相消，偏离最小的那条路径（驻定相位）越来越亮，其余路径互相抵消——<span class='hl'>牛顿的『最小作用量轨迹』，只是量子求和后幸存的那一条</span>。",
  draw: function (stage) {
    var W = 760, H = 262, svg = VZ.S(stage, W, H, {});
    var C = VZ.C;
    var ctl = VZ.box(stage, "viz-ctl");
    var ro = VZ.readout(stage);
    var A = [90, 148], B = [670, 148];
    VZ.circ(svg, A[0], A[1], 6, { fill: C.cyan });
    VZ.circ(svg, B[0], B[1], 6, { fill: C.cyan });
    VZ.txt(svg, A[0] - 14, A[1] + 4, "A", { size: 13, fill: C.cyan, anchor: "end", weight: 700 });
    VZ.txt(svg, B[0] + 14, B[1] + 4, "B", { size: 13, fill: C.cyan, weight: 700 });
    /* 生成随机路径族 */
    var paths = [];
    var seedR = (function () { var s = 42; return function () { s = (s * 16807) % 2147483647; return (s - 1) / 2147483646; }; })();
    for (var i = 0; i < 64; i++) {
      var amp2 = 14 + seedR() * 95;
      var freq = 0.6 + seedR() * 2.2;
      var ph = seedR() * Math.PI * 2;
      var pts = [];
      for (var j = 0; j <= 40; j++) {
        var u = j / 40;
        var xx = A[0] + (B[0] - A[0]) * u;
        var yy = A[1] + (B[1] - A[1]) * u - Math.sin(u * Math.PI) * amp2 * Math.sin(u * Math.PI * freq + ph);
        pts.push([xx, yy]);
      }
      var wgt = Math.exp(-Math.pow(amp2 / 60, 2));
      var el = VZ.path(svg, pts.map(function (p, k) { return (k ? "L" : "M") + p[0].toFixed(1) + " " + p[1].toFixed(1); }).join(""), VZ.stroke({ stroke: C.violet, "stroke-width": 1 }));
      paths.push({ el: el, w: wgt });
    }
    var classical = VZ.path(svg, "M" + A[0] + " " + A[1] + "L" + B[0] + " " + B[1], VZ.stroke({ stroke: C.gold, "stroke-width": 2.6 }));
    /* 流光：自绘，初始位置就在路径上（避免初始越界） */
    var beam = VZ.g(svg);
    var bd = [];
    for (var bi = 0; bi < 2; bi++) bd.push(VZ.circ(beam, A[0], A[1], 4, { fill: C.gold }));
    VZ.raf(svg, function (t) {
      bd.forEach(function (d, i) {
        var u = VZ.ease(((t / 2.8) - i * 0.5) % 1 < 0 ? ((t / 2.8) - i * 0.5) % 1 + 1 : ((t / 2.8) - i * 0.5) % 1);
        d.setAttribute("cx", A[0] + (B[0] - A[0]) * u);
        d.setAttribute("cy", A[1] + (B[1] - A[1]) * u);
        d.setAttribute("opacity", Math.sin(Math.PI * u));
      });
    });
    VZ.txt(svg, 380, 40, "e^{iS/ħ}：每条路径贡献一个相位，求和", { size: 12, fill: C.ink2, anchor: "middle" });
    var cur = 0;
    VZ.slider(ctl, { label: "经典极限（ħ → 0）", value: 0, min: 0, max: 1, step: 0.01, format: function (v) { return (v * 100).toFixed(0) + "%"; }, onInput: function (v) { cur = v; apply(); } });
    function apply() {
      paths.forEach(function (P) {
        P.el.setAttribute("opacity", P.w * (1 - cur * 0.97) * 0.75);
      });
      classical.setAttribute("opacity", 0.3 + cur * 0.7);
      classical.setAttribute("stroke-width", 1.6 + cur * 1.6);
      ro.innerHTML = cur < 0.05
        ? "<b>宏观尺度看：</b>千万条路径都在贡献，振幅互相干涉叠加。"
        : cur > 0.9
          ? "<b>经典极限：</b>只有作用量驻定的路径不被相消——这就是牛顿力学。"
          : "<b>相消进行中：</b>偏离驻定路径的相位振荡剧烈，贡献互相抵消（" + (cur * 100).toFixed(0) + "%）。";
    }
    apply();
  }
},

/* ==========================================================
   ch27-d · 微观态计数：高熵为什么压倒性地多
   ========================================================== */
"f-ch27d": {
  title: "",
  hint: "滑块增加量子数 n：把 n 个量子分到左右两个格子里，数每一种『左 k 个 / 右 n−k 个』的分配方式数 C(n,k)。分布迅速在中点隆起尖峰——<span class='hl'>均衡态不是被偏好，只是它的实现方式多到压倒一切</span>。",
  draw: function (stage) {
    var W = 760, H = 268, svg = VZ.S(stage, W, H, {});
    var C = VZ.C;
    var ctl = VZ.box(stage, "viz-ctl");
    var ro = VZ.readout(stage);
    var n = 4;
    VZ.slider(ctl, { label: "量子数 n", value: 4, min: 2, max: 16, step: 1, format: function (v) { return String(v); }, onInput: function (v) { n = v; redraw(); } });
    var bars = VZ.g(svg);
    VZ.txt(svg, 380, 30, "C(n, k)：n 个量子中恰好 k 个落在左格子的方式数", { size: 12.5, fill: C.ink2, anchor: "middle" });
    var bx = 70, bw = 620, by = 58, bh = 150;
    VZ.ln(svg, bx, by + bh, bx + bw, by + bh, { stroke: C.faint, "stroke-width": 1.2 });
    function comb(a, b) { var r = 1; for (var i = 0; i < b; i++) r = r * (a - i) / (i + 1); return r; }
    function redraw() {
      bars.innerHTML = "";
      var counts = [];
      for (var k = 0; k <= n; k++) counts.push(comb(n, k));
      var mx = counts[Math.floor(n / 2)];
      var step = bw / (n + 1);
      counts.forEach(function (c, k) {
        var hgt = Math.max(2, c / mx * bh);
        var mid = Math.abs(k - n / 2) < 0.51;
        VZ.card(bars, bx + step * (k + 0.5) - 11, by + bh - hgt, 22, hgt,
          { fill: mid ? "rgba(255,207,92,.32)" : "rgba(155,140,255,.22)", stroke: mid ? C.gold : C.violet, sw: mid ? 1.6 : 1, rx: 3 });
        if (n <= 10 || k % 2 === 0) VZ.txt(bars, bx + step * (k + 0.5), by + bh + 15, String(k), { size: 10, fill: C.dim, anchor: "middle" });
        if (mid) VZ.txt(bars, bx + step * (k + 0.5), by + bh - hgt - 7, comb(n, k) > 9999 ? comb(n, k).toExponential(1) : String(Math.round(comb(n, k))),
          { size: 10.5, fill: C.gold, anchor: "middle" });
      });
      VZ.txt(bars, bx - 10, by + bh + 15, "k=左格", { size: 10, fill: C.dim, anchor: "end" });
      var total = Math.pow(2, n);
      var peak = comb(n, Math.floor(n / 2)) / total;
      ro.innerHTML = "<b>n=" + n + "</b>：总微观态数 2<sup>" + n + "</sup> = " + (total > 1e6 ? total.toExponential(0) : total) +
        "；仅均衡附近的状态就占 " + (peak * 100).toFixed(1) + "%。n 越大，尖峰越窄越陡——回到低熵的概率指数级趋近于零。";
    }
    redraw();
  }
},

/* ==========================================================
   ch27-e · 热力学箭头：杯子不会自己复原
   ========================================================== */
"f-ch27e": {
  title: "",
  hint: "点击<b>倒放</b>：每一块碎片都老老实实沿反方向运动——微观上没有一条定律被违反，可你一看就知道『这不是自然发生的』。<span class='hl'>时间之箭不在运动方程里，在熵的统计里</span>：碎开的方式远多于复原的方式。",
  draw: function (stage) {
    var W = 760, H = 252, svg = VZ.S(stage, W, H, {});
    var C = VZ.C;
    var ctl = VZ.box(stage, "viz-ctl");
    var ro = VZ.readout(stage);
    var btn = VZ.btn(ctl, "▶ 倒放");
    /* 地面 */
    VZ.ln(svg, 40, 200, 720, 200, { stroke: C.faint, "stroke-width": 1.5 });
    VZ.txt(svg, 700, 216, "地面", { size: 10.5, fill: C.dim, anchor: "end" });
    /* 6 块碎片：正放=完整杯子，倒放=撒了一地 */
    var shards = [];
    for (var i = 0; i < 6; i++) {
      var seedA = (i * 73 % 41) / 41, seedB = (i * 137 % 89) / 89;
      shards.push({
        xa: 330 + i * 18, ya: 172 - i * 0, h: 34, w: 14,
        xs: 150 + i * 105 + seedA * 30, rot: (seedB - 0.5) * 130,
        ang: (seedA - 0.5) * 0.5
      });
    }
    var pieces = shards.map(function (s) {
      return VZ.path(svg, "", { fill: "rgba(255,255,255,.10)", stroke: C.ink2, "stroke-width": 1.4 });
    });
    var cupLine = VZ.path(svg, "", VZ.stroke({ stroke: C.ink2, "stroke-width": 1.4, opacity: .8 }));
    var dir = -1, s = 0; /* -1: 整→碎（自然）; +1: 碎→整（倒放） */
    var entTxt = VZ.txt(svg, 380, 44, "", { size: 13.5, anchor: "middle", weight: 700 });
    var arrowTxt = VZ.txt(svg, 380, 232, "", { size: 12, anchor: "middle" });
    function draw(s) {
      shards.forEach(function (sh, i) {
        var x = sh.xa + (sh.xs - sh.xa) * s;
        var y = sh.ya + (184 - sh.ya) * s;
        var a = sh.ang * (1 - s) + sh.rot * s;
        var r = sh.w / 2, h2 = sh.h / 2;
        var cA = Math.cos(a * Math.PI / 180), sA = Math.sin(a * Math.PI / 180);
        function pt(dx, dy) { return (x + dx * cA - dy * sA).toFixed(1) + " " + (y + dx * sA + dy * cA).toFixed(1); }
        pieces[i].setAttribute("d", "M" + pt(-r, -h2) + "L" + pt(r, -h2) + "L" + pt(r * .6, h2) + "L" + pt(-r * .8, h2) + "Z");
      });
      /* 完整杯子的轮廓提示（s 小时可见） */
      cupLine.setAttribute("d", s < 0.15
        ? "M330 155V178h118v-23M448 160q22 2 22 12t-22 12"
        : "");
      cupLine.setAttribute("opacity", Math.max(0, 1 - s * 7) * .9);
    }
    btn.onclick = function () { dir = -dir; btn.textContent = dir < 0 ? "▶ 倒放" : "◀ 正放（自然方向）"; };
    VZ.raf(svg, function (t, ms) {
      s += dir * Math.min(ms, 50) / 1000 * 0.28;
      if (s > 1) { s = 1; dir = 1; btn.textContent = "◀ 正放（自然方向）"; }
      if (s < 0) { s = 0; dir = -1; btn.textContent = "▶ 倒放"; }
      draw(s);
      var S = Math.round(10 + s * 90);
      entTxt.textContent = "熵 S ≈ " + S;
      entTxt.setAttribute("fill", s > 0.5 ? C.red : C.green);
      arrowTxt.textContent = dir < 0 ? "时间箭头 →：熵增方向（自然界唯一方向）"
        : "录像倒放：微观运动全部合法，宏观上概率 ≈ 1/10⁹⁰⁰⁰";
      arrowTxt.setAttribute("fill", dir < 0 ? C.gold : C.violet);
    });
    draw(0);
    ro.innerHTML = "<b>试什么</b>：来回切换正放/倒放，问自己——既然每块碎片的轨迹都可以倒着走，为什么宇宙里只见杯碎不见杯合？答案就是左边的 S：碎开的微观态数目碾压复原的微观态数目。";
  }
},

/* ==========================================================
   ch27-f · 事件视界：哪些光线能逃出
   ========================================================== */
"f-ch27f": {
  title: "",
  hint: "滑块调光线的<b>瞄准参数 b</b>（从左边平行的入射高度），点『发射光线』：b 大的光被弯折后逃走，b 小的光一头栽进视界再也出不来——<span class='hl'>视界不是一堵墙，是『所有逃逸路径都不存在』的分界</span>。",
  draw: function (stage) {
    var W = 760, H = 300, svg = VZ.S(stage, W, H, {});
    var C = VZ.C;
    var ctl = VZ.box(stage, "viz-ctl");
    var ro = VZ.readout(stage);
    var b = 70;
    var bh = VZ.slider(ctl, { label: "瞄准参数 b", value: 70, min: 20, max: 160, step: 1, format: function (v2) { return v2 + " px"; }, onInput: function (v2) { b = v2; clearTrail(); } });
    var go = VZ.btn(ctl, "发射光线");
    var cx = 430, cy = 158, rh = 46;
    /* 黑洞 */
    VZ.circ(svg, cx, cy, rh + 8, { fill: "#000", opacity: .55 });
    VZ.circ(svg, cx, cy, rh, { fill: "#000", stroke: C.gold, "stroke-width": 2 });
    VZ.txt(svg, cx, cy + rh + 22, "事件视界 rₛ", { size: 11.5, fill: C.gold, anchor: "middle" });
    VZ.txt(svg, cx, 36, "光从左侧平行射入", { size: 12, fill: C.ink2, anchor: "middle" });
    var startDot = VZ.circ(svg, 40, cy - b, 5, { fill: C.cyan });
    var trail = VZ.path(svg, "", VZ.stroke({ stroke: C.green, "stroke-width": 2 }));
    var verdict = VZ.txt(svg, 380, 282, "", { size: 13.5, anchor: "middle", weight: 700 });
    var pts = [], fate = null, k = 0;
    function clearTrail() { trail.setAttribute("d", ""); trail.setAttribute("stroke", C.green); verdict.textContent = ""; pts = []; k = 0; startDot.setAttribute("cy", cy - b); }
    function simulate() {
      clearTrail();
      var GM = 4.6e6, v = 260, dt = 0.02;
      var x = 40, y = cy - b, vx = v, vy = 0;
      pts = [[x, y]]; fate = "escape";
      for (var i = 0; i < 4200; i++) {
        var dx = cx - x, dy = cy - y, r2 = dx * dx + dy * dy, r = Math.sqrt(r2);
        if (r < rh) { fate = "captured"; break; }
        var acc = GM / r2;
        vx += acc * dx / r * dt; vy += acc * dy / r * dt;
        x += vx * dt; y += vy * dt;
        pts.push([x, y]);
        if (x > 750 || y < 20 || y > 292) break;
      }
      if (fate === "escape" && x <= 750) fate = "orbit";
    }
    go.onclick = function () { simulate(); };
    VZ.raf(svg, function () {
      if (!pts.length) return;
      if (k < pts.length - 1) k += 3;
      var seg = pts.slice(0, Math.floor(k));
      if (seg.length > 1) trail.setAttribute("d", seg.map(function (p, i) { return (i ? "L" : "M") + p[0].toFixed(1) + " " + p[1].toFixed(1); }).join(""));
      if (k >= pts.length - 1) {
        var col = fate === "captured" ? C.red : C.green;
        trail.setAttribute("stroke", col);
        verdict.textContent = fate === "captured"
          ? "✗ 被俘获：b = " + b + " 太小，光线穿过视界，一去不返"
          : "✓ 逃逸：b = " + b + " 的光被引力甩弯，但逃出去了";
        verdict.setAttribute("fill", col);
      }
    });
    ro.innerHTML = "<b>临界瞄准参数</b> b꜀ ≈ 2.6 rₛ（史瓦西黑洞）：b > b꜀ 散射逃逸，b < b꜀ 被俘获。外部观察者永远看不到光线『到达』视界——它只是越来越慢、越来越红。";
    startDot.setAttribute("cy", cy - b);
  }
},

/* ==========================================================
   ch27-g · 共形图解宇宙史：压缩后的时间线
   ========================================================== */
"f-ch27g": {
  title: "",
  hint: "在菱形中轴上<b>上下拖动金点</b>：共形图把 138 亿年按光的传播压缩到一张图上，对角线是光锥。看右侧读数切换地质期——<span class='hl'>越靠近底部顶点，相同高度覆盖的时间越呈指数暴增</span>。",
  draw: function (stage) {
    var W = 760, H = 300, svg = VZ.S(stage, W, H, {});
    var C = VZ.C;
    var ro = VZ.readout(stage);
    var top = [380, 56], bot = [380, 276], lf = [212, 166], rt = [548, 166];
    /* 菱形边界：斜线=光锥 */
    VZ.path(svg, "M" + bot[0] + " " + bot[1] + "L" + rt[0] + " " + rt[1] + "L" + top[0] + " " + top[1] + "L" + lf[0] + " " + lf[1] + "Z", VZ.stroke({ stroke: C.ink2, "stroke-width": 1.8 }));
    VZ.txt(svg, 560, 120, "将来光锥", { size: 10.5, fill: C.dim });
    VZ.txt(svg, 560, 214, "过去光锥", { size: 10.5, fill: C.dim });
    VZ.txt(svg, 380, 296, "大爆炸（过去奇点）", { size: 11.5, fill: C.red, anchor: "middle" });
    VZ.txt(svg, 380, 48, "无穷远 / 无穷未来", { size: 11.5, fill: C.cyan, anchor: "middle" });
    /* 中轴 */
    VZ.ln(svg, 380, bot[1], 380, top[1], { stroke: C.faint, "stroke-width": 1.2, "stroke-dasharray": "5 5" });
    /* 时代色带 */
    var eras = [
      { u0: 0.00, u1: 0.08, name: "普朗克时期 + 暴胀", c: C.mag, d: "10⁻⁴³ 秒内：量子引力主导；暴胀把宇宙吹大 e⁶⁰ 倍，把空间抹平、把磁单极稀释。" },
      { u0: 0.08, u1: 0.32, name: "辐射主导", c: C.gold, d: "核合成造出氦；38 万年后光子退耦，留下 CMB——我们能看到的最古老的光。" },
      { u0: 0.32, u1: 0.62, name: "物质主导", c: C.cyan, d: "引力接管：第一代恒星点亮，星系并合，行星与化学在二代三代恒星灰烬中出现。" },
      { u0: 0.62, u1: 0.88, name: "现在（暗能量主导）", c: C.green, d: "约 50 亿年前膨胀转为加速。此时此地：你正在读一张把自己也算进去的图。" },
      { u0: 0.88, u1: 1.00, name: "遥远未来", c: C.violet, d: "星系退行到视界之外，恒星燃尽。共形图的『无穷远』也许并不是终点（见第 33 章）。" }
    ];
    var marker = VZ.circ(svg, 380, 276, 8, { fill: C.gold, stroke: "#0f0a24", "stroke-width": 2, style: "cursor:grab" });
    var eraTitle = VZ.txt(svg, 596, 96, "", { size: 13.5, fill: C.gold, weight: 700, anchor: "middle" });
    var eraBody = VZ.g(svg);
    var band = VZ.el("rect", { x: 374, y: 276, width: 12, height: 0, fill: "rgba(255,207,92,.18)" }, svg);
    function setU(y) {
      var u = VZ.clamp((bot[1] - y) / (bot[1] - top[1]), 0, 1);
      marker.setAttribute("cy", bot[1] - u * (bot[1] - top[1]));
      band.setAttribute("y", marker.getAttribute("cy"));
      band.setAttribute("height", bot[1] - parseFloat(marker.getAttribute("cy")));
      var e = eras.filter(function (x) { return u >= x.u0 && u < x.u1; })[0] || eras[eras.length - 1];
      eraTitle.textContent = e.name;
      eraTitle.setAttribute("fill", e.c);
      eraBody.innerHTML = "";
      VZ.para(eraBody, 500, 118, e.d, { size: 12, per: 21, lh: 18 });
    }
    VZ.drag(svg, svg, W, H, function (x, y, phase) {
      if (phase === "start" && Math.abs(x - 380) > 120) return;
      setU(y);
    });
    setU(210);
    ro.innerHTML = "<b>怎么读</b>：竖直方向是共形时间，水平方向是空间。光永远走 45° 斜线——这就是为什么『现在』我们所见的大爆炸其实是底部顶点，而不是一条横线。";
  }
},

/* ==========================================================
   ch28-d · 磁单极问题：暴胀把疤痕稀释到看不见
   ========================================================== */
"f-ch28d": {
  title: "",
  hint: "滑块增加<b>暴胀 e-fold 数 N</b>：空间按 e^N 膨胀，磁单极（早期相变留下的点状疤痕）数目不变，密度却按 e^{-3N} 暴跌——N=60 之后，<span class='hl'>整个可观测宇宙摊不上一个磁单极</span>。这就是暴胀的第一张成绩单。",
  draw: function (stage) {
    var W = 760, H = 262, svg = VZ.S(stage, W, H, {});
    var C = VZ.C;
    var ctl = VZ.box(stage, "viz-ctl");
    var ro = VZ.readout(stage);
    var N = 0;
    VZ.slider(ctl, { label: "暴胀 e-fold 数 N", value: 0, min: 0, max: 60, step: 1, format: function (v) { return v + "（空间 ×e^" + v + "）"; }, onInput: function (v) { N = v; redraw(); } });
    var cx = 380, cy = 138;
    var frame = VZ.el("rect", { x: 60, y: 30, width: 640, height: 216, rx: 10, fill: "rgba(255,255,255,.02)", stroke: C.faint, "stroke-width": 1 }, svg);
    var fr = VZ.g(svg);
    var mono = [];
    var seed = 7;
    for (var i = 0; i < 26; i++) {
      seed = (seed * 16807) % 2147483647;
      var u1 = (seed % 1000) / 1000;
      seed = (seed * 16807) % 2147483647;
      var u2 = (seed % 1000) / 1000;
      mono.push([0.06 + u1 * 0.88, 0.08 + u2 * 0.84]);
    }
    var dots = mono.map(function () { return VZ.circ(fr, 0, 0, 5, { fill: C.red }); });
    var lbl = VZ.txt(svg, 380, 260, "", { size: 11.5, fill: C.dim, anchor: "middle" });
    function redraw() {
      /* 观测框随宇宙一起长大：N=0 → 200px；N=60 → 640px */
      var fw = 200 + (640 - 200) * (1 - Math.exp(-N / 22)) / (1 - Math.exp(-60 / 22));
      var fh = fw * 0.62; if (fh > 200) fh = 200;
      var x0 = cx - fw / 2, y0 = cy - fh / 2;
      frame.setAttribute("x", x0); frame.setAttribute("y", y0);
      frame.setAttribute("width", fw); frame.setAttribute("height", fh);
      dots.forEach(function (d, i) {
        d.setAttribute("cx", x0 + mono[i][0] * fw);
        d.setAttribute("cy", y0 + mono[i][1] * fh);
        d.setAttribute("opacity", VZ.clamp(1.6 - fw / 500, 0.15, 1));
      });
      var dil = (1.30 * N).toFixed(1);
      lbl.textContent = N < 5 ? "暴胀前：磁单极应在每个视界里都有——可我们一个也没找到"
        : "密度被稀释 10^" + dil + " 倍　（ρ ∝ e^(−3N)）";
      ro.innerHTML = "<b>N = " + N + "</b>：磁单极密度 ↓ 10<sup>" + dil + "</sup>。" +
        (N >= 55 ? "视界里平均 << 1 个——与观测（零磁单极）一致，磁单极问题被溶解。" : "继续加大 N，看密度如何跌破可观测下限（需要约 60 个 e-fold）。");
    }
    redraw();
  }
},

/* ==========================================================
   ch28-e · 平直性问题：Ω 被暴胀压扁
   ========================================================== */
"f-ch28e": {
  title: "",
  hint: "纵轴是<b>偏离平直的程度 |Ω−1|</b>（对数尺）。不暴胀：|Ω−1| 只会随膨胀长大——想让它今天 ≈0.01，普朗克时刻必须调到 10⁻⁶⁰，60 位小数。有暴胀：<span class='hl'>60 个 e-fold 自动把它压扁 60 个数量级</span>，这就是『暴胀是台压平机』。",
  draw: function (stage) {
    var W = 760, H = 272, svg = VZ.S(stage, W, H, { grid: true });
    var C = VZ.C;
    var ctl = VZ.box(stage, "viz-ctl");
    var ro = VZ.readout(stage);
    var bx = 90, by = 40, bw = 420, bh = 190;
    /* 坐标轴：x = e-fold N (0..60)，y = log10|Ω−1| (+5 .. −65) */
    VZ.ln(svg, bx, by, bx, by + bh, { stroke: C.faint, "stroke-width": 1.2 });
    VZ.ln(svg, bx, by + bh, bx + bw, by + bh, { stroke: C.faint, "stroke-width": 1.2 });
    VZ.txt(svg, bx + bw / 2, by + bh + 22, "暴胀 e-fold 数 N", { size: 11.5, fill: C.dim, anchor: "middle" });
    [[0, "1"], [-20, "10⁻²⁰"], [-40, "10⁻⁴⁰"], [-60, "10⁻⁶⁰"]].forEach(function (t) {
      var yy = by + (5 - t[0]) / 70 * bh;
      VZ.txt(svg, bx - 8, yy + 4, t[1], { size: 10, fill: C.dim, anchor: "end" });
      VZ.ln(svg, bx, yy, bx + bw, yy, { stroke: C.faint, "stroke-width": .6, opacity: .5 });
    });
    function Y(lg) { return by + (5 - lg) / 70 * bh; }
    function X(n) { return bx + n / 60 * bw; }
    /* 红线：无暴胀——偏离随时间增长 */
    VZ.path(svg, "M" + X(0) + " " + Y(0) + "L" + X(60) + " " + Y(2.5), VZ.stroke({ stroke: C.red, "stroke-width": 2 }));
    VZ.txt(svg, X(46), Y(2.5) - 8, "不暴胀：|Ω−1| 只会长大", { size: 11, fill: C.red });
    /* 虚线：需要的初始微调 */
    VZ.ln(svg, bx, Y(-60), bx + bw, Y(-60), { stroke: C.gold, "stroke-width": 1.2, "stroke-dasharray": "6 5" });
    VZ.txt(svg, bx + bw - 6, Y(-60) - 6, "要在今天得到平宇宙，无暴胀时需把初始值调到 1/10⁶⁰", { size: 10.5, fill: C.gold, anchor: "end" });
    /* 绿线：暴胀——每 e-fold 压一个数量级 */
    VZ.path(svg, "M" + X(0) + " " + Y(0) + "L" + X(60) + " " + Y(-60), VZ.stroke({ stroke: C.green, "stroke-width": 2.4 }));
    VZ.txt(svg, X(24), Y(-40) + 16, "暴胀：N 个 e-fold → 压平 10^N 倍", { size: 11, fill: C.green });
    var mk = VZ.circ(svg, X(0), Y(0), 6.5, { fill: C.ink, stroke: C.green, "stroke-width": 2 });
    VZ.slider(ctl, { label: "已进行的 e-fold 数", value: 0, min: 0, max: 60, step: 1, format: function (v) { return String(v); }, onInput: function (v) {
      mk.setAttribute("cx", X(v)); mk.setAttribute("cy", Y(-v));
      var om = Math.pow(10, -v);
      ro.innerHTML = "<b>N = " + v + "</b>：|Ω−1| = 10<sup>" + (-v) + "</sup>" + (v >= 58 ? "　——已经比任何仪器能测的都平。暴胀一停，宇宙『冻结』在 Ω=1 附近。" : "　（不暴胀的宇宙此刻的偏离还在变大，红线朝上走）");
    } });
    ro.innerHTML = "<b>读图</b>：绿线每走 1 格 e-fold，纵轴就下降 1 个数量级；红线是『什么都不做』的对照。宇宙今天测得 |Ω−1| ≈ 0.001 —— 无暴胀时这是天文数字级的巧合，暴胀时是免费赠品。";
  }
},

/* ==========================================================
   ch28-f · 人择原理：一种解释，还是一种逃避
   ========================================================== */
"f-ch28f": {
  title: "",
  hint: "点击三张观点卡：<b>弱人择</b>说这是选择效应，<b>强人择</b>说这能做出预言，<b>彭罗斯</b>则泼冷水。这章没有标准答案——分歧在于<span class='hl'>『我们存在』这个事实，到底能算多少证据</span>。",
  draw: function (stage) {
    var W = 760, H = 262, svg = VZ.S(stage, W, H, {});
    var C = VZ.C;
    var ro = VZ.readout(stage);
    var cards = [
      { x: 30, c: C.cyan, name: "弱人择原理", tag: "选择效应", body: "我们当然只能出现在允许观察者诞生的宇宙里——就像中奖者不该惊讶自己中奖。它不解释宇宙为什么这样，只提醒你别把幸存者偏差当规律。" },
      { x: 265, c: C.gold, name: "强人择原理", tag: "可作预言？", body: "如果存在多元宇宙，物理常数各处不同，那么『常数恰好的生命』就成了一种统计选择。Weinberg 曾据此预言宇宙常数应为小的正值——后来暗能量的发现算它一次部分得分。" },
      { x: 500, c: C.red, name: "彭罗斯的冷水", tag: "近乎不可证伪", body: "他的人择推选论证难以给出可检验的独特预言，容易滑向『怎么都行』。他自己的方案是外尔曲率假说与共形循环宇宙：大爆炸的低熵必须被解释，而不是被观测者身份搪塞过去。" }
    ];
    var els = [];
    cards.forEach(function (cd) {
      var gg = VZ.g(svg, { style: "cursor:pointer" });
      VZ.card(gg, cd.x, 46, 220, 120, { stroke: C.faint, rx: 12 });
      VZ.txt(gg, cd.x + 110, 74, cd.name, { size: 13.5, fill: cd.c, anchor: "middle", weight: 700 });
      VZ.txt(gg, cd.x + 110, 94, cd.tag, { size: 10.5, fill: C.dim, anchor: "middle" });
      VZ.para(gg, cd.x + 14, 112, cd.body.slice(0, 42) + "…", { size: 10.5, per: 18, lh: 15, fill: C.ink2 });
      els.push(gg);
      gg.addEventListener("click", function () { pick(cd); });
    });
    var dTitle = VZ.txt(svg, 30, 196, "", { size: 13.5, weight: 700 });
    var dBody = VZ.g(svg);
    function pick(cd) {
      els.forEach(function (g, i) {
        g.querySelector("rect").setAttribute("stroke", cards[i] === cd ? cards[i].c : C.faint);
        g.querySelector("rect").setAttribute("stroke-width", cards[i] === cd ? 2 : 1);
      });
      dTitle.textContent = cd.name + " — " + cd.tag;
      dTitle.setAttribute("fill", cd.c);
      dBody.innerHTML = "";
      VZ.para(dBody, 30, 216, cd.body, { size: 12, per: 57, lh: 17 });
    }
    pick(cards[0]);
  }
},

/* ==========================================================
   ch28-g · Hartle–Hawking 无边界：时间在原点变成空间
   ========================================================== */
"f-ch28g": {
  title: "",
  hint: "滑块把宇宙的『起点』从<b>尖锥（有边界：大爆炸奇点）</b>连续形变为<b>光滑圆帽（无边界）</b>。在圆帽里，靠近原点处时间轴悄悄转成空间方向——<span class='hl'>『时间开始之前』不再是一个合法的问题，就像问北极点以北是什么</span>。",
  draw: function (stage) {
    var W = 760, H = 288, svg = VZ.S(stage, W, H, {});
    var C = VZ.C;
    var ctl = VZ.box(stage, "viz-ctl");
    var ro = VZ.readout(stage);
    var k = 0;
    var cx = 300, eqY = 112, R = 100;
    VZ.slider(ctl, { label: "无边界形变（0=奇点锥，1=光滑圆帽）", value: 0, min: 0, max: 1, step: 0.01, format: function (v) { return (v * 100).toFixed(0) + "%"; }, onInput: function (v) { k = v; redraw(); } });
    /* 上半球固定 */
    var outline = VZ.path(svg, "", VZ.stroke({ stroke: C.ink, "stroke-width": 2.2 }));
    var meris = [];
    for (var m = 0; m < 3; m++) meris.push(VZ.path(svg, "", VZ.stroke({ stroke: C.faint, "stroke-width": .8, opacity: .7 })));
    var capGlow = VZ.path(svg, "", VZ.stroke({ stroke: C.mag, "stroke-width": 2.6, opacity: 0 }));
    function profR(t) {
      /* t∈[0,1]：从赤道端走向最低点（右半边），返回 {x,y} 相对 (cx,eqY) */
      var cone = { x: R * (1 - t), y: 138 * t };
      var cap = { x: R * Math.cos(t * Math.PI / 2), y: 96 * Math.sin(t * Math.PI / 2) };
      return { x: VZ.lerp(cone.x, cap.x, k), y: VZ.lerp(cone.y, cap.y, k) };
    }
    function redraw() {
      var top = [cx, eqY - R];
      var d = "M" + (cx - R) + " " + eqY + "A" + R + " " + R + " 0 0 1 " + (cx + R) + " " + eqY;
      /* 右半边下行 */
      for (var i = 1; i <= 24; i++) {
        var p = profR(i / 24);
        d += "L" + (cx + p.x).toFixed(1) + " " + (eqY + p.y).toFixed(1);
      }
      /* 左半边上行（镜像） */
      for (var i2 = 24; i2 >= 0; i2--) {
        var p2 = profR(i2 / 24);
        d += "L" + (cx - p2.x).toFixed(1) + " " + (eqY + p2.y).toFixed(1);
      }
      outline.setAttribute("d", d + "Z");
      /* 纬线 */
      for (var L = 0; L < 3; L++) {
        var tt = 0.3 + L * 0.24;
        var p3 = profR(tt);
        var yv = eqY + p3.y;
        var wide = Math.max(2, p3.x);
        meris[L].setAttribute("d", "M" + (cx - wide) + " " + yv + "Q" + cx + " " + (yv + 10 + wide * .16) + " " + (cx + wide) + " " + yv);
        meris[L].setAttribute("opacity", 0.55);
      }
      capGlow.setAttribute("d", d + "Z");
      capGlow.setAttribute("opacity", k * 0.9);
    }
    redraw();
    /* 标注 */
    VZ.txt(svg, cx, 40, "时间 ↑", { size: 11.5, fill: C.cyan, anchor: "middle" });
    VZ.txt(svg, cx - R - 34, eqY + 4, "空间", { size: 11.5, fill: C.dim });
    var coneLbl = VZ.txt(svg, cx, eqY + 168, "大爆炸奇点（边界）", { size: 11.5, fill: C.red, anchor: "middle" });
    var capLbl = VZ.txt(svg, cx, eqY + 128, "原点光滑：时间轴在此转入空间方向", { size: 11.5, fill: C.mag, anchor: "middle", opacity: 0 });
    /* 右侧说明卡 */
    VZ.card(svg, 470, 70, 250, 150, { stroke: "rgba(255,255,255,.12)" });
    VZ.txt(svg, 490, 96, "无边界提议（1983）", { size: 13.5, fill: C.mag, weight: 700 });
    VZ.para(svg, 490, 118, "把时间在原点旋转 90° 变成空间方向，宇宙就成为一个没有边界、也不需要『起始条件』的闭合四维球——量子宇宙学的初始条件由理论自身给出。", { size: 11.5, per: 20, lh: 17 });
    function refresh() {
      coneLbl.setAttribute("opacity", Math.max(0, 1 - k * 2));
      capLbl.setAttribute("opacity", VZ.clamp(k * 2 - 0.5, 0, 1));
    }
    refresh();
    ro.innerHTML = "<b>试什么</b>：把滑块推到 100%，奇点消失、圆帽封口。彭罗斯的保留意见：无边界提议在数学上优美，但它对今天可观测量的预言仍不够独特——这正是第 28 章争论的核心。";
  }
}

});
