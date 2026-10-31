/* ============================================================
   viz-part15.js — 第三批挂载式小图（ch29–ch32，各 4 张）
   规格见 FIG-SPEC3.md：title 留空，画布高 220–320，
   每张至少一处交互，嵌在讲解步骤正文下方。
   ============================================================ */

/* 本地流光辅助：与 VZ.travel 相同效果，但光点初始就在路径上，
   避免「首帧未运行时元素停在画布外」的 overflow 假警告。 */
function flow(parent, d, opts) {
  opts = opts || {};
  var C = VZ.C;
  var p = VZ.path(parent, d, { stroke: "none", fill: "none" });
  var len = p.getTotalLength();
  var n = opts.count || 1, dur = opts.dur || 2.4, delay = opts.delay || 0;
  var p0 = p.getPointAtLength(0);
  var dots = [];
  for (var i = 0; i < n; i++) {
    dots.push(VZ.circ(parent, p0.x, p0.y, opts.r || 3.5, { fill: opts.color || C.cyan, opacity: 0 }));
  }
  VZ.raf(parent, function (t) {
    var span = dur + delay;
    for (var i = 0; i < n; i++) {
      var ph = ((t + delay - i * span / n) % span + span) % span;
      if (ph > dur) { dots[i].setAttribute("opacity", 0); continue; }
      var u = VZ.ease(ph / dur);
      var pt = p.getPointAtLength(u * len);
      dots[i].setAttribute("opacity", Math.sin(Math.PI * u) * 0.9 + 0.1);
      dots[i].setAttribute("cx", pt.x);
      dots[i].setAttribute("cy", pt.y);
    }
  });
  return p;
}

VZ.define({

/* ==========================================================
   ch29d · 密度矩阵的两种读法（系综 vs 单系统）
   挂载：29.2 def 术语一：密度矩阵
   ========================================================== */
"f-ch29d": {
  title: "",
  hint: "点击切换两种诠释：<b>系综读法</b>说 70/30 是我们对『一堆系统』的无知；<b>单系统读法</b>说这一个系统自己就不确定。看右边——两种读法给出<b>一模一样的密度矩阵</b>。这就是 29.2 的要点：数学分不出它们，所以密度矩阵解决不了测量问题。",
  draw: function (stage) {
    var C = VZ.C;
    var ctl = VZ.box(stage, "viz-ctl");
    VZ.chips(ctl, ["系综读法", "单系统读法"], "系综读法", function (m) { render(m); });
    var W = 760, H = 290, svg = VZ.S(stage, W, H, { grid: true });

    /* 右侧：同一个密度矩阵（两种读法下不变） */
    var mx = 480, my = 60, cw = 62, ch = 62;
    VZ.txt(svg, mx + cw, my - 16, "同一个 ρ，两种含义", { size: 13, fill: C.gold, anchor: "middle", weight: 700 });
    var cells = [["0.70", C.cyan], ["0", C.faint], ["0", C.faint], ["0.30", C.mag]];
    cells.forEach(function (c, i) {
      var x = mx + (i % 2) * cw, y = my + Math.floor(i / 2) * ch;
      VZ.card(svg, x, y, cw, ch, { stroke: c[1], fill: "rgba(255,255,255,.04)", sw: 1.4 });
      VZ.txt(svg, x + cw / 2, y + ch / 2 + 5, c[0], { size: 16, fill: c[1] === C.faint ? C.dim : c[1], anchor: "middle", weight: 700 });
    });
    VZ.txt(svg, mx + cw, my + 2 * ch + 22, "ρ = diag(0.70, 0.30)", { size: 12.5, fill: C.ink2, anchor: "middle" });
    var cap = VZ.txt(svg, mx + cw, my + 2 * ch + 46, "", { size: 12, fill: C.ink2, anchor: "middle" });

    /* 左侧：随诠释切换的画面 */
    var left = VZ.g(svg);
    var cx0 = 230, cy0 = 145;
    var zAx = VZ.path(left, "M" + cx0 + " " + (cy0 + 90) + "L" + cx0 + " " + (cy0 - 100), VZ.stroke({ stroke: C.faint, "stroke-width": 1 }));
    function arrow(parent, x, y, L, color, w, op) {
      VZ.path(parent, "M" + x + " " + (y - L) + "L" + x + " " + y, VZ.stroke({ stroke: color, "stroke-width": w || 2.4, opacity: op === undefined ? 1 : op }));
      VZ.path(parent, "M" + x + " " + (y - L) + "l-5 9h10z", { fill: color, opacity: op === undefined ? 1 : op });
    }
    var blurId = VZ.blurFilter(svg, VZ.uid("bl"), 5);
    function render(mode) {
      left.innerHTML = "";
      if (mode === "系综读法") {
        for (var i = 0; i < 10; i++) {
          var x = cx0 - 150 + (i % 5) * 52, y = cy0 - 60 + Math.floor(i / 5) * 128;
          var up = i < 7;
          VZ.circ(left, x, y, 17, { stroke: up ? C.cyan : C.mag, "stroke-width": 1.2, opacity: .8 });
          arrow(left, x, y + 11, 20, up ? C.cyan : C.mag, 2);
          VZ.txt(left, x, y + 34, up ? "↑" : "↓", { size: 11, fill: up ? C.cyan : C.mag, anchor: "middle" });
        }
        VZ.txt(left, cx0 - 26, 34, "10 个系统：7 朝上、3 朝下", { size: 13, fill: C.cyan, anchor: "middle", weight: 700 });
        cap.textContent = "概率 = 我们不知道哪个是哪个（无知度）";
        VZ.para(left, mx, my + 2 * ch + 66, "矩阵只记录比例：它对『每个系统其实朝哪』保持沉默。", { size: 12, per: 18, fill: C.dim });
      } else {
        var gl = VZ.g(left);
        VZ.circ(gl, cx0, cy0, 58, { fill: "rgba(255,255,255,.05)", stroke: C.faint, "stroke-width": 1 });
        var a1 = arrow(gl, cx0, cy0 + 34, 62, C.cyan, 3, .5);
        var a2 = arrow(gl, cx0, cy0 - 24, 62, C.mag, 3, .5);
        VZ.circ(gl, cx0, cy0, 70, { fill: "none", stroke: C.ink2, "stroke-width": 1, opacity: .5, filter: blurId });
        VZ.txt(left, cx0 - 4, 34, "一个系统：自己就不确定", { size: 13, fill: C.mag, anchor: "middle", weight: 700 });
        cap.textContent = "概率 = 自然本身的属性，不只是无知";
        VZ.para(left, mx, my + 2 * ch + 66, "同一个矩阵被当作『单个系统的真实状态』——但哪个读法对，矩阵不说。", { size: 12, per: 18, fill: C.dim });
      }
    }
    render("系综读法");
  }
},

/* ==========================================================
   ch29e · U 与 R 的时间不对称
   挂载：29.1 sec U 与 R：两个互不相容的过程
   ========================================================== */
"f-ch29e": {
  title: "",
  hint: "点击 <b>时间倒流</b>：U 过程正放倒放都是合法物理——波包散开再聚拢，丝毫不违和；R 过程倒放会出现『由一个点长出波』，从未有人见过。<span class='hl'>U 可逆、R 不可逆——这就是两过程互不相容的最直白证据。</span>",
  draw: function (stage) {
    var C = VZ.C;
    var ctl = VZ.box(stage, "viz-ctl");
    var W = 760, H = 300, svg = VZ.S(stage, W, H, { grid: true });
    var dir = 1;
    VZ.btn(ctl, "⏪ 时间倒流", function () { dir = -dir; });

    function lane(y, name, color) {
      VZ.ln(svg, 60, y, 700, y, { stroke: C.faint, "stroke-width": 1 });
      VZ.txt(svg, 56, y - 8, name, { size: 13, fill: color, weight: 700 });
    }
    lane(95, "U 幺正演化（确定 · 线性 · 可逆）", C.cyan);
    lane(230, "R 态缩减（随机 · 非线性）", C.mag);

    var measX = 560;
    VZ.ln(svg, measX, 178, measX, 282, { stroke: C.ink2, "stroke-width": 2.4 });
    VZ.txt(svg, measX, 296, "测量装置", { size: 11.5, fill: C.ink2, anchor: "middle" });

    /* U：高斯波包，随位置展宽/收窄（时间对称） */
    var uG = VZ.g(svg);
    var uW1 = VZ.path(uG, "", VZ.stroke({ stroke: C.cyan, "stroke-width": 2 }));
    var uW2 = VZ.path(uG, "", VZ.stroke({ stroke: C.cyan, "stroke-width": 1.2, opacity: .45, "stroke-dasharray": "4 4" }));
    var uDir = VZ.txt(svg, 700, 70, "", { size: 12, fill: C.cyan, anchor: "end" });
    /* R：波包前进，到测量线处塌成一点 */
    var rG = VZ.g(svg);
    var rW = VZ.path(rG, "", VZ.stroke({ stroke: C.mag, "stroke-width": 2 }));
    var rDot = VZ.circ(rG, measX, 230, 6, { fill: C.gold });
    var rMsg = VZ.txt(svg, 380, 262, "", { size: 12.5, fill: C.red, anchor: "middle" });
    var ph = 0, collapsed = false, spotY = 214;
    VZ.raf(svg, function (t, ms) {
      ph += dir * ms / 1000;
      /* U 波包：位置往返，宽度与行进方向对称 */
      var ux = 150 + 240 * (0.5 + 0.5 * Math.sin(ph * .7));
      var spread = 6 + 26 * Math.abs(Math.cos(ph * .7));
      function gauss(x0, amp, w) {
        var d = "";
        for (var i = 0; i <= 40; i++) {
          var x = 60 + i * (640 / 40);
          var g = amp * Math.exp(-Math.pow(x - x0, 2) / (2 * w * w));
          d += (i ? "L" : "M") + x.toFixed(1) + " " + (95 - g).toFixed(1);
        }
        return d;
      }
      uW1.setAttribute("d", gauss(ux, 52, spread));
      uW2.setAttribute("d", gauss(ux, 30, spread * 1.8));
      uDir.textContent = dir > 0 ? "→ 正放：波包散开" : "← 倒放：波包聚拢（同样合法）";

      /* R 过程 */
      var rx = 150 + 420 * (((ph * .35) % 2 + 2) % 2 < 1 ? ((ph * .35) % 2) : (2 - ((ph * .35) % 2)));
      var done = rx >= measX - 4;
      if (done && !collapsed) collapsed = true;
      if (!done && rx < 300) collapsed = false;
      if (!collapsed) {
        rDot.setAttribute("opacity", 0);
        var d2 = "";
        for (var i2 = 0; i2 <= 40; i2++) {
          var x2 = 60 + i2 * (640 / 40);
          var g2 = 44 * Math.exp(-Math.pow(x2 - rx, 2) / 900);
          d2 += (i2 ? "L" : "M") + x2.toFixed(1) + " " + (230 - g2).toFixed(1);
        }
        rW.setAttribute("d", d2);
        rW.setAttribute("opacity", 1);
        rMsg.textContent = "";
      } else {
        rW.setAttribute("opacity", 0);
        rDot.setAttribute("cx", measX);
        rDot.setAttribute("cy", spotY);
        rDot.setAttribute("opacity", 1);
        rMsg.textContent = dir > 0 ? "R 正放：一点随机落定 ✓" : "R 倒放：由一点长出波包？✗ 不存在这样的物理";
      }
    });
  }
},

/* ==========================================================
   ch29f · FAPP：噪声多大时「实际上等于」坍缩
   挂载：29.5 sec 退相干：FAPP 是什么，不是什么
   ========================================================== */
"f-ch29f": {
  title: "",
  hint: "拖动 <b>环境碰撞率 γ</b>：条纹可见度 V 沿指数曲线往下掉。再拖 <b>你的分辨阈值</b>：一旦 V 低于阈值，屏幕上已经看不见任何条纹——<b>FAPP（为一切实用目的）等价于已坍缩</b>。但注意：这只是『看不见』，态本身从未真的缩减。",
  draw: function (stage) {
    var C = VZ.C;
    var ctl = VZ.box(stage, "viz-ctl");
    var W = 760, H = 300, svg = VZ.S(stage, W, H, { grid: true });
    var sGamma = VZ.slider(ctl, { label: "环境碰撞率 γ", value: 0.3, min: 0, max: 1, step: 0.01, format: function (v) { return (v * 100).toFixed(0) + "%"; }, onInput: function () { redraw(); } });
    var sThr = VZ.slider(ctl, { label: "你的分辨阈值 V_min", value: 0.08, min: 0.01, max: 0.3, step: 0.005, format: function (v) { return (v * 100).toFixed(1) + "%"; }, onInput: function () { redraw(); } });

    /* 右上：V(γ) 曲线 */
    var px0 = 470, px1 = 730, py0 = 40, py1 = 240;
    VZ.ln(svg, px0, py1, px1, py1, { stroke: C.faint });
    VZ.ln(svg, px0, py0, px0, py1, { stroke: C.faint });
    VZ.txt(svg, px1, py1 + 16, "γ", { size: 11, fill: C.dim, anchor: "end" });
    VZ.txt(svg, px0 - 6, py0 + 4, "V", { size: 11, fill: C.dim, anchor: "end" });
    var curve = VZ.path(svg, "", VZ.stroke({ stroke: C.violet, "stroke-width": 2 }));
    (function () {
      var d = "";
      for (var i = 0; i <= 60; i++) {
        var g = i / 60, V = Math.exp(-4.5 * g);
        d += (i ? "L" : "M") + (px0 + g * (px1 - px0)).toFixed(1) + " " + (py1 - V * (py1 - py0)).toFixed(1);
      }
      curve.setAttribute("d", d);
    })();
    var thrLine = VZ.path(svg, "", VZ.stroke({ stroke: C.gold, "stroke-width": 1.2, "stroke-dasharray": "5 4" }));
    var mk = VZ.circ(svg, 0, 0, 6, { fill: C.cyan });
    var verdict = VZ.txt(svg, (px0 + px1) / 2, py1 + 40, "", { size: 13, fill: C.green, anchor: "middle", weight: 700 });

    /* 左：屏幕条纹（可见度随 γ 变） */
    var sx = 60, sy = 60, sw = 340, sh = 180;
    VZ.card(svg, sx, sy, sw, sh, { stroke: C.faint });
    VZ.txt(svg, sx, sy - 10, "干涉条纹（想象中的双缝屏）", { size: 12, fill: C.ink2 });
    var stripes = VZ.g(svg);
    for (var i = 0; i < 17; i++) {
      VZ.ln(stripes, sx + 16 + i * 19, sy + 14, sx + 16 + i * 19, sy + sh - 14, { stroke: C.gold, "stroke-width": 7, "stroke-linecap": "round", opacity: 1 });
    }
    var fog = VZ.el("rect", { x: sx, y: sy, width: sw, height: sh, rx: 10, fill: "rgba(15,10,36,0)" }, svg);
    var fTxt = VZ.txt(svg, sx + sw / 2, sy + sh + 22, "", { size: 13, fill: C.gold, anchor: "middle", weight: 700 });
    function redraw() {
      var g = sGamma.input ? parseFloat(sGamma.input.value) : 0.3;
      var thr = parseFloat(sThr.input.value);
      var V = Math.exp(-4.5 * g);
      mk.setAttribute("cx", px0 + g * (px1 - px0));
      mk.setAttribute("cy", py1 - V * (py1 - py0));
      thrLine.setAttribute("d", "M" + px0 + " " + (py1 - thr * (py1 - py0)) + "H" + px1);
      stripes.setAttribute("opacity", V);
      fog.setAttribute("fill", "rgba(15,10,36," + (1 - V) * 0.9 + ")");
      var fapp = V < thr;
      verdict.textContent = "V = " + (V * 100).toFixed(1) + "%  ·  " + (fapp ? "低于阈值 → FAPP 已坍缩" : "条纹仍可见 → 叠加仍在");
      verdict.setAttribute("fill", fapp ? C.red : C.green);
      fTxt.textContent = fapp ? "你只看到均匀亮带——FAPP：等于坍缩" : "条纹清晰可见";
      fTxt.setAttribute("fill", fapp ? C.red : C.gold);
    }
    redraw();
  }
},

/* ==========================================================
   ch29g · 薛定谔猫的两种结局（分支图）
   挂载：29.4 sec 薛定谔猫，以及那条线该划在哪里
   ========================================================== */
"f-ch29g": {
  title: "",
  hint: "切换两种本体论，看同一棵分支树：<b>常规 QM</b> 里分支永远分下去，『活猫分支』与『死猫分支』同样真实；<b>OR 客观缩减</b>里，叠加积累到真实时间 τ 后<b>随机只留一支</b>，其余变虚。那条线划在哪里，就是测量问题本身。",
  draw: function (stage) {
    var C = VZ.C;
    var ctl = VZ.box(stage, "viz-ctl");
    var W = 760, H = 300, svg = VZ.S(stage, W, H, { grid: true });
    VZ.chips(ctl, ["常规 QM：分支共存", "OR：随机只留一支"], "常规 QM：分支共存", function (m) { render(m); });

    var levels = [1, 2, 4, 8];
    var xs = [80, 260, 440, 620];
    var ys = [];
    levels.forEach(function (n, li) {
      var row = [];
      for (var i = 0; i < n; i++) row.push(150 + (i - (n - 1) / 2) * (200 / (n - 1 || 1)));
      ys.push(row);
    });
    var tree = VZ.g(svg);
    var fx = VZ.g(svg);
    var edges = [];
    levels.forEach(function (n, li) {
      if (li === 0) return;
      for (var i = 0; i < n; i++) {
        var p = Math.floor(i / 2);
        var d = "M" + xs[li - 1] + " " + ys[li - 1][p] + "C" + ((xs[li - 1] + xs[li]) / 2) + " " + ys[li - 1][p] + " " + ((xs[li - 1] + xs[li]) / 2) + " " + ys[li][i] + " " + xs[li] + " " + ys[li][i];
        var alive = ys[li][i] < 150;
        edges.push({ li: li, i: i, d: d, alive: alive });
      }
    });
    var cap = VZ.txt(svg, 380, 286, "", { size: 13, fill: C.ink2, anchor: "middle" });
    var orX = 530;
    function render(mode) {
      tree.innerHTML = "";
      fx.innerHTML = "";
      var orMode = mode.indexOf("OR") === 0;
      var keepAlive = Math.random() < 0.5;
      edges.forEach(function (e) {
        var cut = orMode && e.li >= 3 && e.alive !== keepAlive;
        VZ.path(tree, e.d, VZ.stroke({
          stroke: cut ? C.faint : (e.alive ? C.cyan : C.mag),
          "stroke-width": cut ? 1 : (e.li >= 3 ? 2 : 1.6),
          opacity: cut ? .5 : (e.li >= 3 ? .9 : .7),
          "stroke-dasharray": cut ? "4 4" : "none"
        }));
        if (!cut && e.li === 3) flow(fx, e.d, { color: e.alive ? C.cyan : C.mag, dur: 2.4, count: 1, r: 3 });
      });
      for (var li = 0; li < 4; li++) {
        ys[li].forEach(function (y, i) {
          var isLeaf = li === 3;
          var cut = orMode && isLeaf && ((y < 150) !== keepAlive);
          VZ.circ(tree, xs[li], y, isLeaf ? 6 : 4, { fill: cut ? C.faint : (y < 150 ? C.cyan : C.mag), opacity: cut ? .6 : 1 });
          if (isLeaf && !cut) {
            VZ.txt(tree, xs[li] + 14, y - 8, y < 150 ? "活猫" : "死猫", { size: 11, fill: y < 150 ? C.cyan : C.mag });
            VZ.txt(tree, xs[li] + 14, y + 8, orMode ? "✓ 唯一真实" : "✓ 同样真实", { size: 10, fill: C.ink2 });
          }
        });
      }
      if (orMode) {
        VZ.ln(fx, orX, 30, orX, 274, { stroke: C.red, "stroke-width": 1.6, "stroke-dasharray": "7 5" });
        VZ.txt(fx, orX + 8, 44, "OR 线：τ ≈ 后随机留一支", { size: 11.5, fill: C.red });
        cap.textContent = "活的分支与死的分支只活到 OR 线为止——线划在哪，由质量与引力决定";
      } else {
        cap.textContent = "没有任何一条线：两个分支都在『世界』里，宏观叠加永远演化下去";
      }
    }
    render("常规 QM：分支共存");
  }
},

/* ==========================================================
   ch30d · 黑洞蒸发变热（正反馈 → 最后一爆）
   挂载：30.3 sec 霍金温度，以及它为什么反比于质量
   ========================================================== */
"f-ch30d": {
  title: "",
  hint: "看蒸发全程：质量越小温度越高，温度越高辐射越快——<b>正反馈</b>，所以曲线越跑越快。沿曲线滑动的点最后冲进右下角：<span class='hl'>小黑洞不是安静地消失，而是以一阵高能爆发收场</span>。点击「重演蒸发」再看一遍。",
  draw: function (stage) {
    var C = VZ.C;
    var ctl = VZ.box(stage, "viz-ctl");
    var W = 760, H = 300, svg = VZ.S(stage, W, H, { grid: true });
    VZ.btn(ctl, "↻ 重演蒸发", function () { restart(); });
    var out = VZ.panel(stage, { "质量 M": "", "霍金温度 T": "", "进程": "" });

    var x0 = 90, x1 = 690, y0 = 50, y1 = 240;
    function X(lm) { return x0 + (31 - lm) / 21 * (x1 - x0); }
    function Y(lt) { return y1 - (lt + 8) / 21.5 * (y1 - y0); }
    function lT(lm) { return 23.1 - lm; }

    VZ.ln(svg, x0 - 14, y1, x1 + 20, y1, { stroke: C.faint });
    VZ.ln(svg, x0 - 14, y0 - 10, x0 - 14, y1, { stroke: C.faint });
    VZ.txt(svg, x1 + 24, y1 + 4, "时间 →", { size: 11, fill: C.dim });
    VZ.txt(svg, x0 - 18, y0 - 4, "log T", { size: 11, fill: C.dim, anchor: "end" });
    VZ.txt(svg, X(31), y1 + 16, "10³¹ kg", { size: 10.5, fill: C.dim, anchor: "middle" });
    VZ.txt(svg, X(10), y1 + 16, "10¹⁰ kg", { size: 10.5, fill: C.dim, anchor: "middle" });

    var d = "M" + X(31) + " " + Y(lT(31)) + "L" + X(10) + " " + Y(lT(10));
    VZ.path(svg, d, VZ.stroke({ stroke: C.gold, "stroke-width": 1.6, opacity: .8 }));
    VZ.txt(svg, X(20) + 10, Y(lT(20)) - 12, "T ∝ 1/M：越蒸发越热", { size: 12, fill: C.gold });

    var mk = VZ.circ(svg, X(31), Y(lT(31)), 7, { fill: C.cyan });
    var halo = VZ.circ(svg, X(31), Y(lT(31)), 14, { stroke: C.cyan, "stroke-width": 1, opacity: .5 });
    var burst = VZ.g(svg);
    var endTxt = VZ.txt(svg, x1 - 60, y0 + 16, "", { size: 12.5, fill: C.red, anchor: "middle", weight: 700 });

    var s = 0, done = false;
    function restart() {
      s = 0; done = false;
      burst.innerHTML = "";
      endTxt.textContent = "";
    }
    VZ.raf(svg, function (t, ms) {
      if (done) return;
      s += (ms / 1000) * (0.35 + s * 0.28);
      var lm = 31 - Math.min(s, 21);
      var lt = lT(lm);
      mk.setAttribute("cx", X(lm)); mk.setAttribute("cy", Y(lt));
      var hot = (lt + 8) / 21.5;
      var col = hot < .4 ? C.cyan : hot < .75 ? C.gold : C.red;
      mk.setAttribute("fill", col);
      halo.setAttribute("cx", X(lm)); halo.setAttribute("cy", Y(lt));
      halo.setAttribute("stroke", col);
      VZ.setPanel(out, {
        "质量 M": "10^" + lm.toFixed(1) + " kg",
        "霍金温度 T": "10^" + lt.toFixed(1) + " K",
        "进程": hot < .4 ? "缓慢霍金蒸发" : hot < .75 ? "明显升温，辐射加速" : "失控：即将爆炸"
      });
      if (lm <= 10.001) {
        done = true;
        var bx = X(10), by = Y(lT(10));
        for (var k = 0; k < 9; k++) {
          var a = k / 9 * Math.PI * 2;
          VZ.ln(burst, bx, by, bx + 30 * Math.cos(a), by + 30 * Math.sin(a), VZ.stroke({ stroke: C.red, "stroke-width": 2 }));
        }
        VZ.circ(burst, bx, by, 9, { fill: C.gold });
        endTxt.textContent = "最后一瞬：以一阵高能粒子暴结束";
        VZ.setPanel(out, { "质量 M": "0", "霍金温度 T": "—", "进程": "蒸发完毕（爆炸）" });
      }
    });
  }
},

/* ==========================================================
   ch30e · 负能轨道：彭罗斯过程（拖分裂点）
   挂载：30.2 sec 真空不是空的：霍金辐射怎么来
   ========================================================== */
"f-ch30e": {
  title: "",
  hint: "拖动金色<b>分裂点</b>：物体一分为二，一片带着<b>负能量</b>坠入黑洞（黑洞反而变瘦），另一片带着比原来<b>更多</b>的能量逃走。分裂点越靠近黑洞，能提取的能量越多——霍金辐射里落入的那个虚粒子，干的正是这件事。",
  draw: function (stage) {
    var C = VZ.C;
    var W = 760, H = 300, svg = VZ.S(stage, W, H, { grid: true });
    var out = VZ.panel(stage, { "落入片段能量": "", "逃逸片段能量": "", "黑洞质量": "" });
    var bx = 180, by = 160, br = 52;

    VZ.circ(svg, bx, by, br + 34, { fill: "rgba(255,207,92,.07)", stroke: C.gold, "stroke-width": 1.2, "stroke-dasharray": "6 5" });
    VZ.txt(svg, bx - 40, by - 96, "能层（ergosphere）", { size: 11, fill: C.gold });
    VZ.circ(svg, bx, by, br, { fill: "#080518", stroke: C.ink2, "stroke-width": 2 });
    VZ.txt(svg, bx, by + 4, "黑洞", { size: 12.5, fill: C.ink2, anchor: "middle" });

    var S = [660, 44];
    VZ.circ(svg, S[0], S[1], 6, { fill: C.ink });
    VZ.txt(svg, S[0] - 8, S[1] - 10, "入射物体 E", { size: 11.5, fill: C.ink, anchor: "end" });

    var P = [430, 92];
    var gIn = VZ.g(svg), gNeg = VZ.g(svg), gOut = VZ.g(svg), gHit = VZ.g(svg, { style: "cursor:grab" });
    VZ.circ(gHit, P[0], P[1], 24, { fill: "rgba(255,255,255,0)" });
    var pDot = VZ.circ(gHit, P[0], P[1], 8, { fill: C.gold, stroke: C.deep, "stroke-width": 1.5 });
    var lbl = VZ.txt(svg, 0, 0, "", { size: 11.5, fill: C.gold, anchor: "middle" });

    function redraw() {
      gIn.innerHTML = ""; gNeg.innerHTML = ""; gOut.innerHTML = "";
      VZ.path(gIn, "M" + S[0] + " " + S[1] + "Q" + ((S[0] + P[0]) / 2) + " " + ((S[1] + P[1]) / 2 - 24) + " " + P[0] + " " + P[1], VZ.stroke({ stroke: C.ink, "stroke-width": 1.6, opacity: .8 }));
      VZ.path(gNeg, "M" + P[0] + " " + P[1] + "Q" + ((P[0] + bx) / 2 + 20) + " " + ((P[1] + by) / 2 + 26) + " " + (bx + br * 0.7) + " " + (by + br * 0.55), VZ.stroke({ stroke: C.red, "stroke-width": 2 }));
      VZ.path(gNeg, "M" + (bx + br * 0.7 + 9) + " " + (by + br * 0.55 - 2) + "l-12 -3l4 11z", { fill: C.red });
      VZ.path(gOut, "M" + P[0] + " " + P[1] + "Q" + ((P[0] + 700) / 2) + " " + (P[1] - 40) + " " + 716 + " " + (P[1] - 46), VZ.stroke({ stroke: C.green, "stroke-width": 2 }));
      VZ.path(gOut, "M716 " + (P[1] - 46) + "l-11 -6l2 12z", { fill: C.green });
      var dd = Math.hypot(P[0] - bx, P[1] - by);
      var frac = VZ.clamp((200 - dd) / 200, 0, 1) * 0.6;
      pDot.setAttribute("cx", P[0]); pDot.setAttribute("cy", P[1]);
      lbl.setAttribute("x", P[0]); lbl.setAttribute("y", P[1] - 18);
      lbl.textContent = "在这里分裂";
      VZ.setPanel(out, {
        "落入片段能量": "−" + frac.toFixed(2) + " E（负能）",
        "逃逸片段能量": "+" + (1 + frac).toFixed(2) + " E",
        "黑洞质量": frac > 0.02 ? "减小 ✻" : "不变"
      });
    }
    VZ.drag(svg, gHit, W, H, function (x, y) {
      P[0] = VZ.clamp(x, 260, 620);
      P[1] = VZ.clamp(y, 46, 190);
      redraw();
    });
    redraw();
  }
},

/* ==========================================================
   ch30f · 等效原理 vs OR：自由落体叠加态「该不该塌」
   挂载：30.6 sec 与等效原理的冲突
   ========================================================== */
"f-ch30f": {
  title: "",
  hint: "切换视角：<b>自由下落的电梯</b>里，等效原理说引力『消失』了，叠加没有理由塌；<b>地面实验室</b>里，两个分支的引力场不同，OR 说积累到 τ 就会自发缩减。<span class='hl'>同一个态、同样的物理，换个参考系答案就反过来了——这就是 OR 顶撞等效原理的地方。</span>",
  draw: function (stage) {
    var C = VZ.C;
    var ctl = VZ.box(stage, "viz-ctl");
    var W = 760, H = 300, svg = VZ.S(stage, W, H, { grid: true });
    VZ.chips(ctl, ["自由下落的电梯", "地面实验室"], "自由下落的电梯", function (m) { render(m); });

    var ex = 200, ey = 92, ew = 200, eh = 150;
    var scene = VZ.g(svg);
    var capT = VZ.txt(svg, 380, 272, "", { size: 12.5, fill: C.green, anchor: "middle" });
    var capT2 = VZ.txt(svg, 380, 291, "", { size: 11.5, fill: C.ink2, anchor: "middle" });

    function elevator(g, falling, yoff) {
      var yy = ey + yoff;
      VZ.card(g, ex, yy, ew, eh, { stroke: C.ink2, fill: "rgba(255,255,255,.03)", sw: 1.8 });
      VZ.txt(g, ex + ew / 2, yy - 8, falling ? "电梯 · 自由下落" : "电梯 · 静置于地面", { size: 12, fill: C.ink2, anchor: "middle" });
      if (!falling) {
        for (var i = 0; i < 9; i++) VZ.ln(g, ex - 44 + i * 36, yy + eh + 26, ex - 44 + i * 36 + 18, yy + eh + 12, { stroke: C.faint, "stroke-width": 1.4 });
        VZ.ln(g, ex - 50, yy + eh + 26, ex + ew + 50, yy + eh + 26, { stroke: C.ink2, "stroke-width": 2 });
        for (var k = 0; k < 3; k++) {
          var ax = ex + 40 + k * 60;
          VZ.ln(g, ax, yy + 34, ax, yy + 66, VZ.stroke({ stroke: C.red, "stroke-width": 1.4, opacity: .7, "stroke-dasharray": "4 3" }));
          VZ.path(g, "M" + ax + " " + (yy + 66) + "l-4 -8h8z", { fill: C.red, opacity: .7 });
        }
      }
      /* 电子的叠加：双箭头 + 干涉条纹 */
      var cx2 = ex + ew / 2, cy2 = yy + 52;
      VZ.path(g, "M" + cx2 + " " + (cy2 + 20) + "L" + cx2 + " " + (cy2 - 14), VZ.stroke({ stroke: C.cyan, "stroke-width": 2.6, opacity: .95 }));
      VZ.path(g, "M" + cx2 + " " + (cy2 - 14) + "l-5 8h10z", { fill: C.cyan });
      VZ.path(g, "M" + cx2 + " " + (cy2 - 14) + "L" + cx2 + " " + (cy2 + 20), VZ.stroke({ stroke: C.mag, "stroke-width": 2.6, opacity: .45, "stroke-dasharray": "5 4" }));
      VZ.txt(g, cx2 + 12, cy2 + 6, "|↑⟩+|↓⟩", { size: 12, fill: C.ink });
      return cy2;
    }

    var stripes = VZ.g(svg);
    function drawStripes(g, y, visible, phase) {
      var sx0 = ex + 26, sx1 = ex + ew - 26;
      for (var i = 0; i < 14; i++) {
        var xx = sx0 + i * (sx1 - sx0) / 13;
        var on = visible ? (i % 2 === 0 ? 1 : .25) : .55;
        VZ.ln(g, xx, y + 40, xx, y + 78, { stroke: C.gold, "stroke-width": 6, "stroke-linecap": "round", opacity: on });
      }
      VZ.txt(g, ex + ew / 2, y + 96, visible ? "干涉条纹：叠加仍在" : "均匀亮带：已缩减成一支", { size: 11.5, fill: visible ? C.gold : C.red, anchor: "middle" });
    }
    function render(mode) {
      scene.innerHTML = ""; stripes.innerHTML = "";
      var falling = mode.indexOf("自由") === 0;
      var yo = falling ? 0 : 0;
      var cy2 = elevator(scene, falling, yo);
      drawStripes(scene, cy2, falling);
      if (falling) {
        capT.textContent = "等效原理：下落中引力『消失』——两个分支的物理一模一样，叠加没有理由塌";
        capT.setAttribute("fill", C.green);
        capT2.textContent = "任何局部实验都看不出自己在下落——等效原理在这里毫发无损";
        flow(scene, "M" + ex + " " + ey + "V" + (ey + eh), { color: C.cyan, dur: 1.6, count: 1, r: 3 });
      } else {
        capT.textContent = "OR：两个分支的引力场不同——质量差积累 τ ≈ ħ/ΔE 后自发缩减";
        capT.setAttribute("fill", C.gold);
        capT2.textContent = "可等效原理坚持『支撑着的电梯与下落电梯物理等价』——矛盾就在这";
      }
    }
    render("自由下落的电梯");
  }
},

/* ==========================================================
   ch30g · 早期宇宙涨落起源（OR 掷骰 → 均匀频谱）
   挂载：30.7 sec 怎么检验：桌面实验与早期宇宙
   ========================================================== */
"f-ch30g": {
  title: "",
  hint: "点击 <b>重演</b>：早期宇宙的各块区域同时处于多种密度历史的叠加（左格闪烁）→ OR 在每块独立『掷骰』缩减 → 冻结成一帧具体的密度涨落，其频谱是<b>均匀的</b>（右侧平线）——这批涨落就是星系与 CMB 冷热斑的种子。",
  draw: function (stage) {
    var C = VZ.C;
    var ctl = VZ.box(stage, "viz-ctl");
    var W = 760, H = 290, svg = VZ.S(stage, W, H, { grid: true });
    VZ.btn(ctl, "↻ 重演：叠加 → 缩减", function () { restart(); });

    var gx = 70, gy = 70, cw = 62, chh = 52, gap = 10;
    var cells = [],amps=[],phs=[],frozen=[];
    for (var i = 0; i < 12; i++) {
      var r = Math.floor(i / 4), c = i % 4;
      amps.push(.3 + Math.random() * .7);
      phs.push(Math.random() * Math.PI * 2);
      frozen.push(Math.random());
    }
    var cellG = VZ.g(svg);
    for (var i2 = 0; i2 < 12; i2++) {
      var r2 = Math.floor(i2 / 4), c2 = i2 % 4;
      cells.push(VZ.el("rect", { x: gx + c2 * (cw + gap), y: gy + r2 * (chh + gap), width: cw, height: chh, rx: 8, fill: C.cyan, opacity: .5 }, cellG));
    }
    VZ.txt(svg, gx + 2 * cw + gap / 2, gy - 12, "宇宙各块的密度（叠加中）", { size: 12, fill: C.ink2, anchor: "middle" });

    /* 右：频谱 */
    var px0 = 470, px1 = 720, py0 = 80, py1 = 230;
    VZ.ln(svg, px0, py1, px1, py1, { stroke: C.faint });
    VZ.ln(svg, px0, py0 - 16, px0, py1, { stroke: C.faint });
    VZ.txt(svg, px1, py1 + 16, "空间尺度", { size: 11, fill: C.dim, anchor: "end" });
    VZ.txt(svg, px0 - 6, py0 - 12, "涨落幅度", { size: 11, fill: C.dim, anchor: "end" });
    var spec = VZ.g(svg);
    var specTxt = VZ.txt(svg, (px0 + px1) / 2, py0 - 26, "", { size: 12.5, fill: C.cyan, anchor: "middle", weight: 700 });

    var t0 = 0, state = "sup";
    function restart() { state = "sup"; t0 = 0; spec.innerHTML = ""; specTxt.textContent = ""; }
    VZ.raf(svg, function (t, ms) {
      t0 += ms / 1000;
      if (state === "sup") {
        for (var i = 0; i < 12; i++) {
          var a = .5 + .5 * Math.sin(t0 * 5 + phs[i]);
          var col = a > .5 ? C.cyan : C.mag;
          cells[i].setAttribute("fill", col);
          cells[i].setAttribute("opacity", .25 + .55 * a);
        }
        if (t0 > 2.6) {
          state = "done";
          specTxt.textContent = "频谱：幅度与尺度无关（均匀）";
          for (var k = 0; k <= 20; k++) {
            var xx = px0 + k * (px1 - px0) / 20;
            VZ.circ(spec, xx, py1 - 70 - (frozen[k % 12] - .5) * 14, 3.4, { fill: C.cyan });
          }
          VZ.ln(spec, px0, py1 - 70, px1, py1 - 70, VZ.stroke({ stroke: C.cyan, "stroke-width": 1.4, opacity: .55 }));
        }
      } else {
        for (var j = 0; j < 12; j++) {
          var f = frozen[j];
          cells[j].setAttribute("fill", f > .55 ? C.green : f > .3 ? C.blue : C.violet);
          cells[j].setAttribute("opacity", .35 + .6 * f);
        }
      }
    });
  }
},

/* ==========================================================
   ch31d · 超对称伙伴配对（自旋差 1/2）
   挂载：31.1 sec 每个粒子都有一个影子伙伴
   ========================================================== */
"f-ch31d": {
  title: "",
  hint: "点击左边任一粒子：<b>每个已知粒子都配一个影子伙伴</b>，唯一区别是<b>自旋差 1/2</b>——玻色子配费米子、费米子配玻色子。正是这批影子伙伴的贡献，成对抵消掉了 31.2 里那个大得离谱的修正。",
  draw: function (stage) {
    var C = VZ.C;
    var ctl = VZ.box(stage, "viz-ctl");
    var W = 760, H = 280, svg = VZ.S(stage, W, H, {});
    var pairs = [
      ["光子", "自旋 1（玻色子）", "光微子", "自旋 1/2（费米子）"],
      ["电子", "自旋 1/2（费米子）", "超电子", "自旋 0（玻色子）"],
      ["夸克", "自旋 1/2（费米子）", "超夸克", "自旋 0（玻色子）"],
      ["胶子", "自旋 1（玻色子）", "胶微子", "自旋 1/2（费米子）"],
      ["引力子", "自旋 2（玻色子）", "引力微子", "自旋 3/2（费米子）"]
    ];
    VZ.chips(ctl, pairs.map(function (p) { return p[0]; }), "光子", function (m) { render(m); });
    var lx = 235, rx = 525, y0 = 78, dy = 40;
    VZ.txt(svg, lx, y0 - 26, "已知粒子", { size: 13, fill: C.cyan, anchor: "middle", weight: 700 });
    VZ.txt(svg, rx, y0 - 26, "影子伙伴（从未被看到）", { size: 13, fill: C.mag, anchor: "middle", weight: 700 });
    var gAll = VZ.g(svg);
    var gHi = VZ.g(svg);
    var midTxt = VZ.txt(gHi, (lx + rx) / 2, y0 - 4, "", { size: 12.5, fill: C.gold, anchor: "middle", weight: 700 });
    pairs.forEach(function (p, i) {
      var y = y0 + i * dy;
      VZ.ln(gAll, lx + 40, y, rx - 46, y, { stroke: C.faint, "stroke-width": 1 });
      VZ.circ(gAll, lx, y, 5, { fill: C.cyan });
      VZ.circ(gAll, rx, y, 5, { fill: C.mag });
      VZ.txt(gAll, lx - 14, y + 4, p[0], { size: 13, fill: C.cyan, anchor: "end" });
      VZ.txt(gAll, lx + 12, y - 8, p[1], { size: 9.5, fill: C.dim });
      VZ.txt(gAll, rx + 14, y + 4, p[2], { size: 13, fill: C.mag });
      VZ.txt(gAll, rx + 12, y - 8, p[3], { size: 9.5, fill: C.dim });
    });
    function render(name) {
      gHi.innerHTML = "";
      var i = pairs.map(function (p) { return p[0]; }).indexOf(name);
      if (i < 0) i = 0;
      var y = y0 + i * dy;
      VZ.ln(gHi, lx + 8, y, rx - 8, y, VZ.stroke({ stroke: C.gold, "stroke-width": 2.6 }));
      VZ.circ(gHi, lx, y, 10, { stroke: C.gold, "stroke-width": 1.6, fill: "none" });
      VZ.circ(gHi, rx, y, 10, { stroke: C.gold, "stroke-width": 1.6, fill: "none" });
      midTxt.setAttribute("y", y - 12);
      midTxt.textContent = "⇌ 自旋差恰好 1/2，其余量子数全同";
      flow(gHi, "M" + (lx + 8) + " " + y + "H" + (rx - 8), { color: C.gold, dur: 1.8, count: 1, r: 3.5 });
    }
    render("光子");
  }
},

/* ==========================================================
   ch31e · 手调参数问题（标准模型的旋钮面板）
   挂载：31.2 sec 影子伙伴怎么修掉那个大得离谱的修正
   ========================================================== */
"f-ch31e": {
  title: "",
  hint: "点击任意一个<b>旋钮</b>：它的值由实验测出，理论只负责『照抄』——<b>没人解释它为什么是这个数</b>。标准模型这样的旋钮有 20 多个；这正是弦论等『万有理论』想一口气解释掉的东西。",
  draw: function (stage) {
    var C = VZ.C;
    var ctl = VZ.box(stage, "viz-ctl");
    var knobs = [
      ["电子质量", "0.511 MeV"], ["μ 子质量", "105.7 MeV"], ["τ 子质量", "1.777 GeV"],
      ["上夸克", "≈2.2 MeV"], ["下夸克", "≈4.7 MeV"], ["奇夸克", "≈95 MeV"],
      ["粲夸克", "1.27 GeV"], ["底夸克", "4.18 GeV"], ["顶夸克", "173 GeV"],
      ["精细结构常数", "1/137.036"], ["强耦合 αs", "0.118"], ["弱混合角", "sin²θW=0.231"],
      ["CP 破坏相位", "≈68°"], ["中微子质量", "<0.1 eV"], ["宇宙学常数", "≈10⁻¹²⁰"]
    ];
    for (var r = 0; r < 3; r++) {
      VZ.chips(ctl, knobs.slice(r * 5, r * 5 + 5).map(function (k) { return k[0]; }),
        r === 0 ? "电子质量" : null,
        function (m) { render(m); });
    }
    var W = 760, H = 270, svg = VZ.S(stage, W, H, {});
    var out = VZ.panel(stage, { "旋钮": "", "当前值": "", "地位": "" });

    /* 表盘 */
    var cx = 170, cy = 205, rr = 108;
    VZ.path(svg, "M" + (cx - rr) + " " + cy + "A" + rr + " " + rr + " 0 0 1 " + (cx + rr) + " " + cy, VZ.stroke({ stroke: C.faint, "stroke-width": 1.6 }));
    for (var k = 0; k <= 8; k++) {
      var a = Math.PI - k / 8 * Math.PI;
      VZ.ln(svg, cx + (rr - 10) * Math.cos(a), cy - (rr - 10) * Math.sin(a), cx + rr * Math.cos(a), cy - rr * Math.sin(a), { stroke: C.faint, "stroke-width": 1.2 });
    }
    VZ.txt(svg, cx - rr - 4, cy + 16, "0", { size: 10, fill: C.dim, anchor: "middle" });
    VZ.txt(svg, cx + rr + 4, cy + 16, "大", { size: 10, fill: C.dim, anchor: "middle" });
    var needle = VZ.path(svg, "M" + cx + " " + cy + "L" + (cx - rr * .8) + " " + cy, VZ.stroke({ stroke: C.gold, "stroke-width": 2.4 }));
    VZ.circ(svg, cx, cy, 6, { fill: C.gold });

    var dT1 = VZ.txt(svg, 430, 78, "", { size: 17, fill: C.cyan, weight: 700 });
    var dT2 = VZ.txt(svg, 430, 108, "", { size: 15, fill: C.gold, weight: 700 });
    VZ.para(svg, 430, 136, "『它是多少』靠测量填进去——理论本身\n对这个数值一言不发，也没有任何内部理由\n要求它必须如此。", { size: 12.5, per: 24, lh: 19, fill: C.ink2 });
    var why = VZ.txt(svg, 430, 216, "", { size: 12, fill: C.mag });

    var cur = 0, target = 0;
    function render(name) {
      var i = knobs.map(function (k) { return k[0]; }).indexOf(name);
      if (i < 0) i = 0;
      target = i / (knobs.length - 1);
      VZ.setPanel(out, { "旋钮": knobs[i][0], "当前值": knobs[i][1], "地位": "第 " + (i + 1) + " 个 / 20+ 个手调参数" });
      dT1.textContent = knobs[i][0];
      dT2.textContent = knobs[i][1];
      why.textContent = "没人解释为什么 —— 实验说多少就是多少";
    }
    VZ.raf(svg, function (t, ms) {
      cur += (target - cur) * Math.min(1, ms / 180);
      var a = Math.PI - cur * Math.PI;
      needle.setAttribute("d", "M" + cx + " " + cy + "L" + (cx + rr * .8 * Math.cos(a)).toFixed(1) + " " + (cy - rr * .8 * Math.sin(a)).toFixed(1));
    });
    render("电子质量");
  }
},

/* ==========================================================
   ch31f · 卡拉比–丘空间：6 维卷曲的样子
   挂载：31.6 sec 卡拉比–丘空间，与一片 10⁵⁰⁰ 的风景
   ========================================================== */
"f-ch31f": {
  title: "",
  hint: "拖动滑块<b>旋转</b>这个卷曲空间：额外的 6 个维不是消失，而是卷成这样一个处处有洞、本身没有边界的小流形——它的<b>拓扑</b>（有几个洞、怎么卷）决定了我们看到哪些粒子、每种粒子带多少荷。<span class='hl'>几何在这里直接变成物理。</span>",
  draw: function (stage) {
    var C = VZ.C;
    var ctl = VZ.box(stage, "viz-ctl");
    var W = 760, H = 300, svg = VZ.S(stage, W, H, { grid: true });
    VZ.slider(ctl, { label: "旋转", value: 0.6, min: 0, max: 6.28, step: 0.01, format: function (v) { return (v * 57.3).toFixed(0) + "°"; }, onInput: function (v) { redraw(v); } });
    var cx = 250, cy = 155;
    var g1 = VZ.g(svg), g2 = VZ.g(svg);
    var NU = 14, NV = 11, N1 = 36;
    function pt(u, v, th) {
      var rr = 38 * (1 + 0.38 * Math.cos(3 * v + 2 * u));
      var R = 78;
      var x = (R + rr * Math.cos(v)) * Math.cos(u);
      var y = (R + rr * Math.cos(v)) * Math.sin(u);
      var z = rr * Math.sin(v) + 10 * Math.sin(2 * u);
      var X = x * Math.cos(th) - y * Math.sin(th);
      var Yd = x * Math.sin(th) + y * Math.cos(th);
      return [cx + X, cy - z * 0.8 + Yd * 0.34, Yd - z];
    }
    function polyline(g, pts, color, op) {
      var d = "";
      for (var i = 0; i < pts.length; i++) d += (i ? "L" : "M") + pts[i][0].toFixed(1) + " " + pts[i][1].toFixed(1);
      VZ.path(g, d, VZ.stroke({ stroke: color, "stroke-width": 1.1, opacity: op }));
    }
    function redraw(th) {
      g1.innerHTML = ""; g2.innerHTML = "";
      for (var i = 0; i < NU; i++) {
        var u = i / NU * Math.PI * 2, pts = [];
        for (var k = 0; k <= N1; k++) pts.push(pt(u, k / N1 * Math.PI * 2, th));
        polyline(g1, pts, C.violet, .55);
      }
      for (var j = 0; j < NV; j++) {
        var v = j / NV * Math.PI * 2, pts2 = [];
        for (var k2 = 0; k2 <= N1 + 6; k2++) pts2.push(pt(k2 / (N1 + 6) * Math.PI * 2, v, th));
        polyline(g2, pts2, C.cyan, .5);
      }
    }
    redraw(0.6);

    /* 右侧说明 */
    VZ.card(svg, 470, 60, 260, 170, { stroke: "rgba(255,255,255,.12)" });
    VZ.txt(svg, 488, 88, "卷起来的 6 个维", { size: 14, fill: C.cyan, weight: 700 });
    VZ.para(svg, 488, 110, "每一点的周围都挂着这样一个\n小空间（约普朗克尺度）。\n它的『洞』的排布方式 = 粒子家族数；\n它的尺寸与形状 = 各耦合常数。\n同一根弦在不同洞里振动，\n听起来就是不同的粒子。", { size: 12, per: 21, lh: 18.5 });
  }
},

/* ==========================================================
   ch31g · 膜与开弦：引力为什么能漏出去
   挂载：31.4 sec 弦的身世，与「振动音阶就是粒子表」
   ========================================================== */
"f-ch31g": {
  title: "",
  hint: "拖动<b>开弦的两个端点</b>：不管怎么拖，它们始终粘在膜上——电子、夸克、光子都是这样的开弦，所以物质逃不出我们的膜。再拖<b>闭弦（那个圈）</b>：它没有端点，可以整根离开膜。<span class='hl'>引力子是闭弦——这就是引力能『漏』进高维体空间的原因。</span>",
  draw: function (stage) {
    var C = VZ.C;
    var W = 760, H = 310, svg = VZ.S(stage, W, H, { grid: true });
    var A = [80, 218], B = [350, 156], D = [290, 282];
    var v1 = [B[0] - A[0], B[1] - A[1]], v2 = [D[0] - A[0], D[1] - A[1]];
    var det = v1[0] * v2[1] - v1[1] * v2[0];

    /* 膜 */
    var brane = VZ.g(svg);
    VZ.poly(brane, [A, B, [B[0] + v2[0], B[1] + v2[1]], D], { fill: "rgba(106,168,255,.10)", stroke: C.blue, "stroke-width": 1.8, close: true });
    for (var i = 1; i < 5; i++) {
      var s = i / 5;
      VZ.ln(brane, A[0] + v1[0] * s, A[1] + v1[1] * s, D[0] + v1[0] * s, D[1] + v1[1] * s, { stroke: C.blue, "stroke-width": .7, opacity: .4 });
      VZ.ln(brane, A[0] + v2[0] * s, A[1] + v2[1] * s, B[0] + v2[0] * s, B[1] + v2[1] * s, { stroke: C.blue, "stroke-width": .7, opacity: .4 });
    }
    VZ.txt(brane, A[0] + 8, A[1] + 22, "我们的膜（3+1 维世界）", { size: 12, fill: C.blue, weight: 700 });

    /* 开弦：两端钉在膜上 */
    function st2xy(s, t) { return [A[0] + v1[0] * s + v2[0] * t, A[1] + v1[1] * s + v2[1] * t]; }
    var E1 = { s: .38, t: .34 }, E2 = { s: .78, t: .22 };
    var osG = VZ.g(svg);
    var h1 = VZ.circ(osG, 0, 0, 11, { fill: "rgba(255,255,255,0)" });
    var h2 = VZ.circ(osG, 0, 0, 11, { fill: "rgba(255,255,255,0)" });
    var e1 = VZ.circ(osG, 0, 0, 6, { fill: C.cyan, stroke: C.deep, "stroke-width": 1.2 });
    var e2 = VZ.circ(osG, 0, 0, 6, { fill: C.cyan, stroke: C.deep, "stroke-width": 1.2 });
    var openArc = VZ.path(osG, "", VZ.stroke({ stroke: C.cyan, "stroke-width": 2.4 }));
    function drawOpen() {
      var p1 = st2xy(E1.s, E1.t), p2 = st2xy(E2.s, E2.t);
      var mx = (p1[0] + p2[0]) / 2, my = (p1[1] + p2[1]) / 2 - 46;
      openArc.setAttribute("d", "M" + p1[0].toFixed(1) + " " + p1[1].toFixed(1) + "Q" + mx.toFixed(1) + " " + my.toFixed(1) + " " + p2[0].toFixed(1) + " " + p2[1].toFixed(1));
      [e1, h1].forEach(function (n) { n.setAttribute("cx", p1[0]); n.setAttribute("cy", p1[1]); });
      [e2, h2].forEach(function (n) { n.setAttribute("cx", p2[0]); n.setAttribute("cy", p2[1]); });
    }
    drawOpen();
    VZ.drag(svg, h1, 760, 310, function (x, y) { var st = inv(x, y); E1.s = st[0]; E1.t = st[1]; drawOpen(); });
    VZ.drag(svg, h2, 760, 310, function (x, y) { var st = inv(x, y); E2.s = st[0]; E2.t = st[1]; drawOpen(); });
    VZ.txt(osG, st2xy(E1.s, E1.t)[0] - 16, st2xy(E1.s, E1.t)[1] + 30, "开弦（物质）", { size: 11.5, fill: C.cyan });

    /* 逆变换：屏幕坐标 → 膜参数 */
    function inv(x, y) {
      var dx = x - A[0], dy = y - A[1];
      var s = (dx * v2[1] - dy * v2[0]) / det;
      var t = (dy * v1[0] - dx * v1[1]) / det;
      return [VZ.clamp(s, .06, .94), VZ.clamp(t, .06, .94)];
    }

    /* 闭弦：可自由拖离膜 */
    var csG = VZ.g(svg);
    var closedG = VZ.g(csG);
    var cPos = [610, 130];
    VZ.path(closedG, "M" + (cPos[0] - 26) + " " + cPos[1] + "a26 17 0 1 0 52 0a26 17 0 1 0 -52 0", VZ.stroke({ stroke: C.mag, "stroke-width": 2.4 }));
    var cHit = VZ.circ(csG, cPos[0], cPos[1], 30, { fill: "rgba(255,255,255,0)" });
    var cLbl = VZ.txt(csG, cPos[0] + 34, cPos[1] - 12, "闭弦（引力）", { size: 11.5, fill: C.mag });
    VZ.drag(svg, cHit, 760, 310, function (x, y) {
      cPos[0] = VZ.clamp(x, 400, 730); cPos[1] = VZ.clamp(y, 36, 280);
      closedG.setAttribute("transform", "translate(" + (cPos[0] - 610) + " " + (cPos[1] - 130) + ")");
      cHit.setAttribute("cx", cPos[0]); cHit.setAttribute("cy", cPos[1]);
      cLbl.setAttribute("x", cPos[0] + 34); cLbl.setAttribute("y", cPos[1] - 12);
      var off = cPos[1] < 120;
      cLbl.textContent = off ? "闭弦：离开膜 → 引力漏进体空间" : "闭弦（引力）：没有端点，可离膜";
    });

    VZ.txt(svg, 380, 302, "开弦两端被『钉』在膜上 · 闭弦整根自由——高维体空间里只有引力能游走", { size: 12, fill: C.ink2, anchor: "middle" });
  }
},

/* ==========================================================
   ch32d · 约束系统量子化：Ĥ|ψ⟩ = 0，没有绝对时间
   挂载：32.2 sec 标准程序：切开时空，写出一条不动的方程
   ========================================================== */
"f-ch32d": {
  title: "",
  hint: "切换两种量子化：<b>通常量子力学</b>有一个外部时钟 t，波函数沿它演化；<b>量子宇宙学</b>里整个宇宙没有『外面』——演化方程塌缩成一条<b>约束</b> Ĥ|ψ⟩=0，波函数哪里都不动。<span class='hl'>时间不再被给出，只能从系统内部的关系里读出来。</span>",
  draw: function (stage) {
    var C = VZ.C;
    var ctl = VZ.box(stage, "viz-ctl");
    var W = 760, H = 280, svg = VZ.S(stage, W, H, { grid: true });
    VZ.chips(ctl, ["通常量子力学", "量子宇宙学"], "通常量子力学", function (m) { render(m); });

    var cardL = VZ.g(svg), cardR = VZ.g(svg);
    var boxL = VZ.el("rect", { x: 40, y: 44, width: 320, height: 170, rx: 10, fill: "rgba(255,255,255,.035)", stroke: C.cyan, "stroke-width": 2 }, cardL);
    var boxR = VZ.el("rect", { x: 400, y: 44, width: 320, height: 170, rx: 10, fill: "rgba(255,255,255,.035)", stroke: C.faint, "stroke-width": 1 }, cardR);
    var cap = VZ.txt(svg, 380, 268, "", { size: 12.5, fill: C.ink2, anchor: "middle" });
    function wave(g, x0, y0, w, frozen, phase) {
      var d = "";
      for (var i = 0; i <= 48; i++) {
        var x = x0 + i * w / 48;
        var env = Math.exp(-Math.pow(i - 24, 2) / 300);
        var v = Math.sin(i * .55 + phase) * 26 * env;
        d += (i ? "L" : "M") + x.toFixed(1) + " " + (y0 + v).toFixed(1);
      }
      var p = VZ.path(g, d, VZ.stroke({ stroke: C.cyan, "stroke-width": 2 }));
      return p;
    }
    var ph = 0;
    var pL = wave(cardL, 60, 120, 280, false, 0);
    wave(cardR, 430, 120, 280, true, 0);
    function frame(white) {
      boxL.setAttribute("stroke", white === "L" ? C.cyan : C.faint);
      boxL.setAttribute("stroke-width", white === "L" ? 2 : 1);
      boxR.setAttribute("stroke", white === "R" ? C.mag : C.faint);
      boxR.setAttribute("stroke-width", white === "R" ? 2 : 1);
    }
    /* 左卡固定内容 */
    VZ.txt(cardL, 200, 68, "|ψ(t)⟩ 沿时间演化", { size: 13, fill: C.cyan, anchor: "middle", weight: 700 });
    VZ.ln(cardL, 60, 176, 340, 176, { stroke: C.ink2, "stroke-width": 1.2 });
    VZ.path(cardL, "M340 176l-9 -4v8z", { fill: C.ink2 });
    VZ.txt(cardL, 322, 194, "t（外部时钟）", { size: 11, fill: C.dim, anchor: "end" });
    VZ.txt(cardL, 200, 206, "iħ ∂|ψ⟩/∂t = Ĥ|ψ⟩", { size: 13.5, fill: C.ink, anchor: "middle", "font-family": "Georgia,serif" });
    /* 右卡固定内容 */
    VZ.txt(cardR, 560, 68, "Ĥ|ψ⟩ = 0：波函数不动", { size: 13, fill: C.mag, anchor: "middle", weight: 700 });
    VZ.txt(cardR, 560, 206, "惠勒–德威特方程（约束，不是演化）", { size: 12.5, fill: C.ink, anchor: "middle" });
    VZ.txt(cardR, 560, 100, "没有 t ——『变化』本身成了内部关系", { size: 11.5, fill: C.dim, anchor: "middle" });
    function render(mode) {
      var cosmo = mode.indexOf("量子宇宙") === 0;
      frame(cosmo ? "R" : "L");
      cap.textContent = cosmo
        ? "整个宇宙没有『外面』可对照时钟——方程退化成约束，时间必须从内部读出"
        : "t 是外部给定的参数，理论以外的钟；只要系统足够小，这样做完全合法";
    }
    VZ.raf(svg, function (t, ms) {
      ph += ms / 220;
      pL.setAttribute("d", (function () {
        var d = "";
        for (var i = 0; i <= 48; i++) {
          var x = 60 + i * 280 / 48;
          var env = Math.exp(-Math.pow(i - 24, 2) / 300);
          var v = Math.sin(i * .55 + ph) * 26 * env;
          d += (i ? "L" : "M") + x.toFixed(1) + " " + (120 + v).toFixed(1);
        }
        return d;
      })());
    });
    render("通常量子力学");
  }
},

/* ==========================================================
   ch32e · Ashtekar 变量的手征性
   挂载：32.3 sec Ashtekar 的一招：不换问题，换变量
   ========================================================== */
"f-ch32e": {
  title: "",
  hint: "点开 <b>手征拆分</b>：任何自旋联络都能拆成自对偶与反自对偶两半。Ashtekar 的狠招是——<b>只解自对偶那一半</b>（带 ħ 的手征项）。变量从度规的 10 个实分量换成复的 6+6，方程变成多项式，圈量化才因此走得动。",
  draw: function (stage) {
    var C = VZ.C;
    var ctl = VZ.box(stage, "viz-ctl");
    var W = 760, H = 280, svg = VZ.S(stage, W, H, { grid: true });
    VZ.btn(ctl, "拆分手征（self-dual split）", function () { splitOn = !splitOn; redraw(); });
    var splitOn = false;

    /* 左：度规变量 */
    VZ.card(svg, 46, 52, 250, 176, { stroke: C.faint });
    VZ.txt(svg, 171, 78, "通常做法：度规 g_ab", { size: 13, fill: C.ink2, anchor: "middle", weight: 700 });
    for (var r = 0; r < 4; r++) for (var c = 0; c < 4; c++) {
      var on = r <= c;
      VZ.card(svg, 96 + c * 38, 96 + r * 26, 32, 20, { stroke: on ? C.ink2 : C.faint, fill: on ? "rgba(255,255,255,.06)" : "none", sw: 1 });
    }
    VZ.txt(svg, 171, 216, "10 个实分量 · 方程非多项式", { size: 11.5, fill: C.dim, anchor: "middle" });

    /* 右：Ashtekar 拆分 */
    VZ.card(svg, 372, 52, 344, 176, { stroke: C.faint });
    VZ.txt(svg, 544, 78, "Ashtekar：自旋联络 A + 三元组 E", { size: 13, fill: C.cyan, anchor: "middle", weight: 700 });
    var nodeG = VZ.g(svg);
    VZ.card(nodeG, 396, 106, 96, 44, { stroke: C.cyan, fill: "rgba(79,227,240,.08)", sw: 1.4 });
    VZ.txt(nodeG, 444, 133, "联络 A", { size: 12.5, fill: C.cyan, anchor: "middle" });
    var hi = VZ.g(svg), lo = VZ.g(svg);
    function redraw() {
      hi.innerHTML = ""; lo.innerHTML = "";
      if (splitOn) {
        VZ.path(hi, "M492 128C540 110 560 104 606 100", VZ.stroke({ stroke: C.cyan, "stroke-width": 2.2 }));
        VZ.card(hi, 606, 84, 92, 40, { stroke: C.cyan, fill: "rgba(79,227,240,.12)", sw: 1.6 });
        VZ.txt(hi, 652, 109, "自对偶 A⁺", { size: 12.5, fill: C.cyan, anchor: "middle" });
        VZ.path(lo, "M492 134C540 156 560 162 606 166", VZ.stroke({ stroke: C.faint, "stroke-width": 1.4, "stroke-dasharray": "5 4" }));
        VZ.card(lo, 606, 150, 92, 40, { stroke: C.faint, fill: "none", sw: 1 });
        VZ.txt(lo, 652, 175, "反自对偶 A⁻", { size: 12, fill: C.dim, anchor: "middle" });
        VZ.txt(lo, 548, 96, "只解这一半（复的、手征的）", { size: 11, fill: C.gold });
      } else {
        VZ.path(hi, "M492 128H640", VZ.stroke({ stroke: C.ink2, "stroke-width": 1.6, "stroke-dasharray": "6 4" }));
        VZ.txt(hi, 566, 116, "点这里看拆分 →", { size: 11.5, fill: C.dim, anchor: "middle" });
      }
    }
    redraw();
    VZ.txt(svg, 544, 216, "复 6+6 分量 · 方程变成多项式", { size: 11.5, fill: C.dim, anchor: "middle" });
  }
},

/* ==========================================================
   ch32f · 面积量子化：读数只能落在谱上
   挂载：32.6 eg 具体例子：最小的面积有多大
   ========================================================== */
"f-ch32f": {
  title: "",
  hint: "自旋网络的每条边穿过面时留一个<b>刺穿点</b>，贡献一份面积 8πγℓₚ²√(j(j+1))。拖动 <b>自旋标签 j</b>、点击<b>加刺穿点</b>：读数永远只能落在<b>离散的谱</b>上——中间值不存在。最小非零面积约 10⁻⁶⁶ cm²，这就是『最小的面积』。",
  draw: function (stage) {
    var C = VZ.C;
    var ctl = VZ.box(stage, "viz-ctl");
    var W = 760, H = 300, svg = VZ.S(stage, W, H, { grid: true });
    var out = VZ.panel(stage, { "自旋标签 j": "", "单点面积": "", "总面积": "" });
    var sJ = VZ.slider(ctl, { label: "自旋标签 j", value: 1, min: 0.5, max: 6, step: 0.5, format: function (v) { return v + "（单位 ħ）"; }, onInput: function () { redraw(); } });
    VZ.btn(ctl, "＋ 加一个刺穿点", function () { nP = nP >= 5 ? 1 : nP + 1; redraw(); });
    var nP = 2;

    /* 面（竖立的墙）+ 自旋网边穿过来 */
    var wx = 150, wy0 = 40, wy1 = 250, skew = 60;
    VZ.poly(svg, [[wx, wy0], [wx + 120, wy0], [wx + 120 + skew, wy1], [wx + skew, wy1]], { fill: "rgba(155,140,255,.07)", stroke: C.violet, "stroke-width": 1.8, close: true });
    VZ.txt(svg, wx + 90, wy0 - 8, "一个面（2 维）", { size: 12, fill: C.violet, anchor: "middle" });
    var punc = [];
    var jYs = [78, 122, 166, 210, 244];
    var puncG = VZ.g(svg);
    function redraw() {
      puncG.innerHTML = "";
      punc = jYs.slice(0, nP);
      var j = parseFloat(sJ.input.value);
      var a1 = 8 * Math.PI * Math.sqrt(j * (j + 1));
      punc.forEach(function (yy, i) {
        var xx = wx + 60 + skew * (yy - wy0) / (wy1 - wy0);
        /* 穿过面的自旋网边 */
        VZ.path(puncG, "M" + (xx - 90) + " " + (yy - 26) + "C" + (xx - 40) + " " + (yy - 34) + " " + (xx - 30) + " " + (yy - 6) + " " + xx + " " + yy + "C" + (xx + 30) + " " + (yy + 6) + " " + (xx + 46) + " " + (yy - 20) + " " + (xx + 96) + " " + (yy - 30), VZ.stroke({ stroke: C.cyan, "stroke-width": 1.5, opacity: .75 }));
        VZ.circ(puncG, xx, yy, 7, { fill: C.gold, stroke: C.deep, "stroke-width": 1.2 });
        VZ.txt(puncG, xx + 12, yy - 10, "j=" + j, { size: 10.5, fill: C.gold });
      });
      /* 右侧谱线 */
      VZ.setPanel(out, {
        "自旋标签 j": j,
        "单点面积": a1.toFixed(1) + " ℓₚ²",
        "总面积": (nP * a1).toFixed(1) + " ℓₚ²（" + nP + " 点）"
      });
      specMk.setAttribute("cx", specX(a1));
      specMk.setAttribute("cy", sy);
      specMkTxt.setAttribute("x", specX(a1));
      specMkTxt.textContent = a1.toFixed(1);
      nG.innerHTML = "";
      VZ.txt(nG, 470, 250, "面积读数是离散的：连续区间里除了谱点全是禁地", { size: 11.5, fill: C.dim });
    }
    /* 谱梯 */
    var sx0 = 470, sx1 = 720, sy = 208;
    function specX(a) { return sx0 + VZ.clamp(a, 0, 160) / 160 * (sx1 - sx0); }
    VZ.ln(svg, sx0, sy, sx1, sy, { stroke: C.faint, "stroke-width": 1.2 });
    VZ.txt(svg, sx0, sy + 34, "允许的面积谱（ℓₚ²）：", { size: 11, fill: C.dim });
    var specMk = VZ.circ(svg, 0, 0, 6, { fill: C.gold });
    var specMkTxt = VZ.txt(svg, 0, sy - 14, "", { size: 11, fill: C.gold, anchor: "middle" });
    var nG = VZ.g(svg);
    [0.5, 1, 1.5, 2, 2.5, 3, 3.5, 4].forEach(function (jv) {
      var a = 8 * Math.PI * Math.sqrt(jv * (jv + 1));
      var xx = specX(a);
      VZ.ln(svg, xx, sy - 6, xx, sy + 6, { stroke: C.cyan, "stroke-width": 1.8 });
      VZ.txt(svg, xx, sy + 20, jv, { size: 9.5, fill: C.dim, anchor: "middle" });
    });
    redraw();
  }
},

/* ==========================================================
   ch32g · 背景无关性：没有舞台，只有舞者
   挂载：32.7 sec 背景独立、半经典极限
   ========================================================== */
"f-ch32g": {
  title: "",
  hint: "切换两种世界观：<b>通常 QFT</b> 先搭好固定的时空舞台，场是舞台上的演员；<b>圈量子引力</b>里没有舞台——空间本身就是这张会动的自旋网，<b>『在哪里』只能由网上的关系定义</b>。背景独立 = 舞台也是舞者。",
  draw: function (stage) {
    var C = VZ.C;
    var ctl = VZ.box(stage, "viz-ctl");
    var W = 760, H = 280, svg = VZ.S(stage, W, H, { grid: true });
    VZ.chips(ctl, ["通常量子场论", "圈量子引力"], "通常量子场论", function (m) { render(m); });

    var gGrid = VZ.g(svg), gField = VZ.g(svg), gNet = VZ.g(svg);
    var cap = VZ.txt(svg, 380, 266, "", { size: 12.5, fill: C.ink2, anchor: "middle" });
    /* 通常 QFT：固定网格 + 场 */
    for (var i = 0; i <= 12; i++) VZ.ln(gGrid, 80 + i * 50, 46, 80 + i * 50, 216, { stroke: C.faint, "stroke-width": .7, opacity: .7 });
    for (var j = 0; j <= 6; j++) VZ.ln(gGrid, 80, 46 + j * 28.3, 680, 46 + j * 28.3, { stroke: C.faint, "stroke-width": .7, opacity: .7 });
    VZ.txt(gGrid, 682, 60, "x", { size: 11, fill: C.dim });
    VZ.txt(gGrid, 92, 40, "t", { size: 11, fill: C.dim });
    VZ.txt(gGrid, 380, 236, "固定的时空舞台（背景）", { size: 11.5, fill: C.dim, anchor: "middle" });
    var fieldP = VZ.path(gField, "", VZ.stroke({ stroke: C.gold, "stroke-width": 2.2 }));
    VZ.txt(gField, 300, 92, "场（演员）", { size: 11.5, fill: C.gold });
    VZ.raf(svg, function (t) {
      var d = "";
      for (var i = 0; i <= 60; i++) {
        var x = 80 + i * 10;
        var v = Math.sin(i * .5 - t * 3) * 14 * Math.exp(-Math.pow(i - 30, 2) / 400);
        d += (i ? "L" : "M") + x + " " + (130 + v).toFixed(1);
      }
      fieldP.setAttribute("d", d);
    });
    /* 圈量子引力：自旋网本身在动 */
    var nodes = [];
    for (var k = 0; k < 13; k++) nodes.push({ bx: 150 + (k % 5) * 110 + (Math.floor(k / 5) % 2) * 40, by: 70 + Math.floor(k / 5) * 62, j: (k % 3) + 1, ph: k * 1.7 });
    var links = [[0, 1], [1, 2], [2, 3], [3, 4], [0, 5], [1, 6], [2, 7], [3, 8], [4, 9], [5, 6], [6, 7], [7, 8], [8, 9], [5, 10], [6, 11], [7, 12], [10, 11], [11, 12]];
    var linkPs = links.map(function (L) { return VZ.path(gNet, "", VZ.stroke({ stroke: C.cyan, "stroke-width": 1.4, opacity: .7 })); });
    var nodeCs = nodes.map(function (n) { return VZ.circ(gNet, n.bx, n.by, 6, { fill: C.deep, stroke: C.cyan, "stroke-width": 1.8 }); });
    nodes.forEach(function (n, i2) { VZ.txt(gNet, n.bx + 10, n.by - 8, "j=" + n.j, { size: 9.5, fill: C.cyan }); });
    VZ.raf(svg, function (t) {
      if (mode2 !== "LQG") return;
      nodes.forEach(function (n, i) {
        n.x = n.bx + Math.sin(t * 1.1 + n.ph) * 9;
        n.y = n.by + Math.cos(t * 0.9 + n.ph * 1.3) * 7;
        nodeCs[i].setAttribute("cx", n.x); nodeCs[i].setAttribute("cy", n.y);
      });
      links.forEach(function (L, i3) {
        var a = nodes[L[0]], b = nodes[L[1]];
        linkPs[i3].setAttribute("d", "M" + a.x.toFixed(1) + " " + a.y.toFixed(1) + "L" + b.x.toFixed(1) + " " + b.y.toFixed(1));
      });
    });
    var mode2 = "QFT";
    function render(m) {
      mode2 = m.indexOf("圈") === 0 ? "LQG" : "QFT";
      gGrid.setAttribute("opacity", mode2 === "QFT" ? 1 : .08);
      gField.setAttribute("opacity", mode2 === "QFT" ? 1 : .06);
      gNet.setAttribute("opacity", mode2 === "LQG" ? 1 : 0);
      cap.textContent = mode2 === "QFT"
        ? "时空先给定，场住在里面——背景是先决条件"
        : "没有先决的舞台：自旋网自己就是空间，节点体积、边面积都量子化";
    }
    render("通常量子场论");
  }
}

});
