/* viz-part8.js — 第三批挂载式小图（ch1–ch4，每章 4 张 d/e/f/g） */

/* 本地流光：与 VZ.travel 相同，但光点初始就落在路径起点（避免测量时停在 -99,-99 被算溢出） */
function flow(svg, d, o) {
  o = o || {};
  var hp = VZ.path(svg, d, { stroke: "none", fill: "none" });
  var len = 0;
  try { len = hp.getTotalLength(); } catch (e) { return; }
  var n = o.count || 1, dur = o.dur || 2.4, delay = o.delay || 0, span = dur + delay;
  var dots = [];
  for (var i = 0; i < n; i++) {
    var p0 = hp.getPointAtLength(0);
    dots.push(VZ.circ(svg, p0.x, p0.y, o.r || 4, { fill: o.color || VZ.C.cyan }));
  }
  VZ.raf(svg, function (t) {
    for (var i = 0; i < n; i++) {
      var ph = ((t + delay - i * span / n) % span + span) % span;
      if (ph > dur) { dots[i].setAttribute("opacity", 0); continue; }
      var u = VZ.ease(ph / dur);
      var p = hp.getPointAtLength(u * len);
      dots[i].setAttribute("opacity", Math.sin(Math.PI * u) * .9 + .1);
      dots[i].setAttribute("cx", p.x);
      dots[i].setAttribute("cy", p.y);
    }
  });
}

/* 把 geoArc 生成的路径（圆心在原点的局部坐标）平移到全局坐标 */
function shiftD(d, dx, dy) {
  var m = d.match(/^M(-?[\d.eE+-]+) (-?[\d.eE+-]+)(A|L)([\d.eE+-]+) ([\d.eE+-]+) 0 ([01]) ([01]) (-?[\d.eE+-]+) (-?[\d.eE+-]+)$/);
  if (m && m[3] === "A") {
    return "M" + (+m[1] + dx) + " " + (+m[2] + dy) + "A" + m[4] + " " + m[5] + " 0 " + m[6] + " " + m[7] + " " + (+m[8] + dx) + " " + (+m[9] + dy);
  }
  m = d.match(/^M(-?[\d.eE+-]+) (-?[\d.eE+-]+)L(-?[\d.eE+-]+) (-?[\d.eE+-]+)$/);
  if (m) return "M" + (+m[1] + dx) + " " + (+m[2] + dy) + "L" + (+m[3] + dx) + " " + (+m[4] + dy);
  return d;
}

VZ.define({
/* ==========================================================
   f-ch01d · 数学证明的链式结构（点击任一步看依赖传递）
   ========================================================== */
"f-ch01d": {
  title: "",
  hint: "<b>点击任意一步</b>，假装你开始怀疑它——看它之前的步骤稳如磐石，它之后的整条链全部变红崩塌。<span class='hl'>这就是数学真理与科学经验在结构上的区别：数学的每一条都吊在整个链条上，一环可疑，环环可疑。</span>",
  draw: function (stage) {
    var W = 760, H = 240, svg = VZ.S(stage, W, H, { grid: true });
    var C = VZ.C;
    var names = ["公理", "引理 A", "引理 B", "定理", "推论"];
    var subs = ["不证自明", "由公理直接得出", "由引理 A 得出", "由两个引理合成", "定理的直接后果"];
    var bw = 124, bh = 58, gap = (W - 40 - 5 * bw) / 4, by = 92;
    var boxes = [], arrows = [];
    var statusTxt = VZ.txt(svg, W / 2, 200, "", { size: 13.5, fill: C.ink2, anchor: "middle" });

    names.forEach(function (nm, i) {
      var x = 20 + i * (bw + gap);
      var gg = VZ.g(svg, { style: "cursor:pointer" });
      VZ.card(gg, x, by, bw, bh, { stroke: C.green, sw: 1.8, fill: "rgba(94,224,138,.07)" });
      VZ.txt(gg, x + bw / 2, by + 25, nm, { size: 14.5, fill: C.green, anchor: "middle", weight: 700 });
      VZ.txt(gg, x + bw / 2, by + 44, subs[i], { size: 10, fill: C.dim, anchor: "middle" });
      VZ.txt(gg, x + bw / 2, by - 10, "步骤 " + (i + 1), { size: 10.5, fill: C.dim, anchor: "middle" });
      boxes.push({ x: x, gg: gg, node: gg.firstChild });
      if (i < 4) {
        var d = "M" + (x + bw + 4) + " " + (by + bh / 2) + "L" + (x + bw + gap - 4) + " " + (by + bh / 2);
        VZ.path(svg, d, VZ.stroke({ stroke: C.green, "stroke-width": 1.6, opacity: .7 }));
        flow(svg, d, { color: C.green, dur: 1.6, r: 3.2 });
      }
    });

    function pick(i) {
      boxes.forEach(function (b, j) {
        var ok = j < i, self = j === i;
        b.node.setAttribute("stroke", self ? C.gold : ok ? C.green : C.red);
        b.node.setAttribute("stroke-width", self ? 2.6 : 1.6);
        b.node.setAttribute("stroke-dasharray", ok || self ? "none" : "6 5");
        b.node.setAttribute("fill", self ? "rgba(255,207,92,.12)" : ok ? "rgba(94,224,138,.07)" : "rgba(255,122,122,.06)");
        b.gg.children[1].setAttribute("fill", self ? C.gold : ok ? C.green : C.red);
        b.gg.children[2].setAttribute("fill", ok || self ? C.dim : "rgba(255,122,122,.75)");
      });
      if (i === 0) statusTxt.textContent = "你怀疑的是公理本身：整条链从头塌起——所以公理必须经得起千百年的审视。";
      else statusTxt.textContent = "怀疑步骤 " + (i + 1) + "：" + i + " 步仍然站稳，后面 " + (5 - i) + " 步全部随之失效。";
      statusTxt.setAttribute("fill", i === 0 ? C.gold : C.ink2);
    }
    boxes.forEach(function (b, i) { b.gg.addEventListener("click", function () { pick(i); }); });
    pick(4);
  }
},

/* ==========================================================
   f-ch01e · 归纳法为什么不可靠（天鹅计数动画）
   ========================================================== */
"f-ch01e": {
  title: "",
  hint: "<b>反复点「再观察一只」</b>：每只天鹅都是白的，「所有天鹅都是白的」看似越来越牢——直到某一只。<span class='hl'>归纳的证据可以无限累积，却永远差一步「下一步也是白的」；这就是科学真理与数学证明的种类的差别。</span>",
  draw: function (stage) {
    var W = 760, H = 240, svg = VZ.S(stage, W, H, { grid: true });
    var C = VZ.C;
    var n = 0, BLACK_AT = 9;
    var title = VZ.txt(svg, W / 2, 36, "「所有天鹅都是白的」", { size: 16, fill: C.ink, anchor: "middle", weight: 700 });
    var counter = VZ.txt(svg, W / 2, 62, "尚未观察", { size: 13, fill: C.cyan, anchor: "middle" });
    var verdict = VZ.txt(svg, W / 2, 196, "证据在累积……但结论仍然只是猜测", { size: 12.5, fill: C.dim, anchor: "middle" });
    var row = VZ.g(svg);
    var ctl = VZ.box(stage, "viz-ctl");

    function swan(x, y, white) {
      var gg = VZ.g(row);
      VZ.path(gg, "M" + x + " " + y + "q10 -12 22 -8q10 3 8 12q-2 8 -14 9l-18 0q-6 -1 -6 -6q0 -5 8 -7z",
        { fill: white ? C.ink : C.panel, stroke: white ? "none" : C.red, "stroke-width": white ? 0 : 1.5 });
      VZ.path(gg, "M" + (x + 18) + " " + (y - 6) + "q4 -12 -3 -16q-5 -3 -5 3", { stroke: white ? C.ink : C.red, "stroke-width": 2.4 });
      VZ.circ(gg, x + 11, y - 20, 2.4, { fill: white ? C.ink : C.red });
      return gg;
    }
    var btn;
    function addOne() {
      n++;
      var x = 74 + ((n - 1) % 9) * 74, y = n <= 9 ? 128 : 168;
      swan(x, y, n < BLACK_AT);
      if (n < BLACK_AT) {
        counter.textContent = "已观察 " + n + " 只 —— 全是白的";
        verdict.textContent = "证据在累积……但结论仍然只是猜测";
        verdict.setAttribute("fill", C.dim);
      } else {
        counter.textContent = "第 " + n + " 只：黑的。";
        counter.setAttribute("fill", C.red);
        verdict.textContent = "一个反例就足以推翻全部归纳证据 —— 而再多的证据也凑不成一个证明。";
        verdict.setAttribute("fill", C.red);
        btn.setAttribute("disabled", "true");
        btn.style.opacity = .45;
      }
    }
    btn = VZ.btn(ctl, "再观察一只天鹅", addOne);
    VZ.txt(svg, W / 2, 222, "对照：数学那边，一步证明顶得上一万只天鹅。", { size: 11.5, fill: C.dim, anchor: "middle" });
    addOne(); addOne(); addOne();
  }
},

/* ==========================================================
   f-ch01f · 「数学为什么有效」的三派立场对比
   ========================================================== */
"f-ch01f": {
  title: "",
  hint: "<b>切换三派立场</b>，看每一派把数学世界画成什么样子：只是纸上的记号？心智造出来的？还是独立存在、等我们去发现的另一个世界？<span class='hl'>柏拉图主义之所以胜出，是因为它最诚实地面对「数学为什么精确得可怕」这件事。</span>",
  draw: function (stage) {
    var W = 760, H = 260, svg = VZ.S(stage, W, H, { grid: true });
    var C = VZ.C;
    var layer = VZ.g(svg);
    var ctl = VZ.box(stage, "viz-ctl");
    var cap = VZ.txt(svg, W / 2, 232, "", { size: 13, fill: C.ink2, anchor: "middle" });

    function world(x, y, r, label, color, opts) {
      opts = opts || {};
      if (opts.glow) VZ.circ(layer, x, y, r + 6, { fill: color, opacity: .14, filter: VZ.blurFilter(svg, VZ.uid("bl"), 6) });
      VZ.circ(layer, x, y, r, {
        fill: opts.ghost ? "rgba(255,255,255,.02)" : "rgba(12,8,32,.9)",
        stroke: color, "stroke-width": opts.ghost ? 1 : 1.8,
        "stroke-dasharray": opts.ghost ? "5 6" : "none",
        opacity: opts.ghost ? .5 : 1
      });
      VZ.txt(layer, x, y + 4, label, { size: 12, fill: color, anchor: "middle", weight: 700 });
    }

    var MODES = {
      "唯名论": function () {
        world(250, 128, 44, "数学世界", C.dim, { ghost: true });
        world(520, 128, 44, "心智世界", C.mag);
        VZ.circ(layer, 385, 128, 26, { fill: "rgba(255,255,255,.05)", stroke: C.gold, "stroke-width": 1.4 });
        VZ.txt(layer, 385, 124, "纸上", { size: 10, fill: C.gold, anchor: "middle" });
        VZ.txt(layer, 385, 138, "记号", { size: 10, fill: C.gold, anchor: "middle" });
        cap.textContent = "根本没有「数学世界」——数学只是我们发明的简写记号，别当真。";
      },
      "构造主义": function () {
        world(250, 128, 44, "数学世界", C.cyan);
        world(520, 128, 44, "心智世界", C.mag);
        var d = "M476 128L296 128";
        VZ.path(layer, d, VZ.stroke({ stroke: C.gold, "stroke-width": 2 }));
        flow(layer, d, { color: C.gold, dur: 1.6, r: 4 });
        VZ.txt(layer, 386, 114, "构造", { size: 11, fill: C.gold, anchor: "middle" });
        cap.textContent = "数学是人造的：心智一步步构造出来，构造不出来的就不算数。";
      },
      "柏拉图主义": function () {
        world(250, 128, 48, "数学世界", C.cyan, { glow: true });
        world(520, 128, 44, "心智世界", C.mag);
        var d = "M472 120L302 120";
        VZ.path(layer, d, VZ.stroke({ stroke: C.green, "stroke-width": 2, "stroke-dasharray": "1 0" }));
        flow(layer, d, { color: C.green, dur: 1.5, r: 4 });
        var d2 = "M302 140L472 140";
        VZ.path(layer, d2, VZ.stroke({ stroke: C.gold, "stroke-width": 2 }));
        flow(layer, d2, { color: C.gold, dur: 1.9, r: 4 });
        VZ.txt(layer, 386, 108, "看见", { size: 10.5, fill: C.green, anchor: "middle" });
        VZ.txt(layer, 386, 158, "描绘", { size: 10.5, fill: C.gold, anchor: "middle" });
        cap.textContent = "数学世界独立存在于时间空间之外；我们不去发明它，只能去发现它。";
      }
    };
    function render(m) { layer.innerHTML = ""; MODES[m](); }
    VZ.chips(ctl, ["唯名论", "构造主义", "柏拉图主义"], "柏拉图主义", render);
    render("柏拉图主义");
  }
},

/* ==========================================================
   f-ch01g · 三个世界的「接触」疑问（横向循环链）
   ========================================================== */
"f-ch01g": {
  title: "",
  hint: "<b>点击任意一条接触箭头</b>：两个世界明明性质完全不同，凭什么能碰上？<span class='hl'>三个接触各是一个深谜；本书 34 章只处理第一个，后两个作者明说自己不知道答案。</span>",
  draw: function (stage) {
    var W = 760, H = 240, svg = VZ.S(stage, W, H, { grid: true });
    var C = VZ.C;
    var worlds = [
      { x: 140, y: 92, name: "柏拉图世界", sub: "永恒的数学真理", c: C.cyan },
      { x: 380, y: 92, name: "物理世界", sub: "真实运转的宇宙", c: C.gold },
      { x: 620, y: 92, name: "心智世界", sub: "会感受会理解", c: C.mag }
    ];
    var links = [
      { a: 0, b: 1, key: "谜①", q: "数学为什么恰好能精确描述物理？", detail: "数学家凭审美自由发明的东西，居然精确到小数点后十几位地管着宇宙。", c: C.cyan },
      { a: 1, b: 2, key: "谜②", q: "物质如何产生主观感受？", detail: "神经元的电化学是物理的，「痛」和「红」却是主观的。作者：不知道。", c: C.gold },
      { a: 2, b: 0, key: "谜③", q: "心智凭什么通达柏拉图世界？", detail: "我们凭什么理解一个独立于我们、无限精确的世界？作者：也不知道。", c: C.mag }
    ];
    worlds.forEach(function (wd) {
      VZ.circ(svg, wd.x, wd.y, 40, { fill: "rgba(12,8,32,.9)", stroke: wd.c, "stroke-width": 1.8 });
      VZ.txt(svg, wd.x, wd.y - 3, wd.name.slice(0, 3), { size: 12, fill: wd.c, anchor: "middle", weight: 700 });
      VZ.txt(svg, wd.x, wd.y + 13, wd.name.slice(3), { size: 12, fill: wd.c, anchor: "middle", weight: 700 });
      VZ.txt(svg, wd.x, wd.y + 58, wd.sub, { size: 10.5, fill: C.dim, anchor: "middle" });
    });
    var ar1 = VZ.arrowDef(svg, VZ.uid("ar"), C.ink2);
    links.forEach(function (L) {
      var A = worlds[L.a], B = worlds[L.b];
      var d, arc = false;
      if (L.a === 0 && L.b === 1) d = "M188 92L332 92";
      else if (L.a === 1 && L.b === 2) d = "M428 92L572 92";
      else { d = "M588 122Q380 176 172 122"; arc = true; }
      VZ.path(svg, d, VZ.stroke({ stroke: L.c, "stroke-width": 2, opacity: .55, "stroke-dasharray": arc ? "7 6" : "none", "marker-end": ar1 }));
      flow(svg, d, { color: L.c, dur: 2.2, r: 3.6 });
      var lx = (A.x + B.x) / 2, ly = arc ? 168 : 78;
      var gg = VZ.g(svg, { style: "cursor:pointer" });
      VZ.circ(gg, lx, ly, 19, { fill: "rgba(10,6,28,.94)", stroke: L.c, "stroke-width": 1.5 });
      VZ.txt(gg, lx, ly + 5, L.key, { size: 12.5, fill: L.c, anchor: "middle", weight: 700 });
      var hit = gg;
      gg.addEventListener("click", function () { show(L, hit); });
      L.gg = gg;
    });
    var qTxt = VZ.txt(svg, 20, 210, "", { size: 13.5, fill: C.ink, weight: 700 });
    var dTxt = VZ.txt(svg, 20, 230, "", { size: 12, fill: C.ink2 });
    function show(L, hit) {
      qTxt.textContent = L.key + "  " + L.q;
      qTxt.setAttribute("fill", L.c);
      dTxt.textContent = L.detail;
      links.forEach(function (x) {
        var cc = x.gg.firstChild;
        cc.setAttribute("stroke-width", x === L ? 3 : 1.5);
      });
    }
    show(links[0], links[0].gg);
  }
},

/* ==========================================================
   f-ch02d · 欧几里得五条公设，逐条点亮
   ========================================================== */
"f-ch02d": {
  title: "",
  hint: "<b>点击左边五块「地砖」</b>逐条查看每条公设说了什么、画出来长什么样。前四条人人服气；<span class='hl'>第五条的措辞里有「无限延长之后」——正是这四个字，埋下了两千年后非欧几何的种子。</span>",
  draw: function (stage) {
    var W = 760, H = 280, svg = VZ.S(stage, W, H, { grid: true });
    var C = VZ.C;
    var posts = [
      "① 两点连一线", "② 线段可延长", "③ 圆心半径作圆", "④ 直角都相等", "⑤ 平行公设"
    ];
    var names = ["任意两点确定一条直线", "线段可以无限延长", "任意圆心与半径确定一个圆", "所有直角彼此全等", "同旁内角和小于两直角时，两直线在该侧相交"];
    var danger = [false, false, false, false, true];
    var layer = VZ.g(svg);
    var cap = VZ.txt(svg, 490, 250, "", { size: 12, fill: C.ink2, anchor: "middle" });
    var brickY = 60;

    function drawPost(k) {
      layer.innerHTML = "";
      VZ.txt(layer, 490, 40, names[k], { size: 12.5, fill: C.gold, anchor: "middle" });
      var mx = 490, my = 145;
      if (k === 0) {
        VZ.circ(layer, mx - 70, my + 20, 4, { fill: C.cyan });
        VZ.circ(layer, mx + 70, my - 20, 4, { fill: C.cyan });
        var d = "M" + (mx - 70) + " " + (my + 20) + "L" + (mx + 70) + " " + (my - 20);
        VZ.path(layer, d, VZ.stroke({ stroke: C.ink, "stroke-width": 2 }));
        flow(layer, d, { color: C.ink, dur: 1.4, r: 3.5 });
        VZ.txt(layer, mx - 70, my + 38, "A", { size: 12, fill: C.cyan, anchor: "middle" });
        VZ.txt(layer, mx + 70, my - 32, "B", { size: 12, fill: C.cyan, anchor: "middle" });
      } else if (k === 1) {
        var d2 = "M" + (mx - 160) + " " + my + "L" + (mx - 30) + " " + my;
        VZ.path(layer, d2, VZ.stroke({ stroke: C.ink, "stroke-width": 2 }));
        VZ.path(layer, "M" + (mx - 30) + " " + my + "L" + (mx + 170) + " " + my,
          VZ.stroke({ stroke: C.cyan, "stroke-width": 2, "stroke-dasharray": "8 6" }));
        VZ.txt(layer, mx + 170, my - 10, "……一直延长下去", { size: 11, fill: C.cyan });
      } else if (k === 2) {
        VZ.circ(layer, mx, my, 62, { stroke: C.cyan, "stroke-width": 2 });
        VZ.circ(layer, mx, my, 2.5, { fill: C.gold });
        VZ.ln(layer, mx, my, mx + 62 * Math.cos(-.7), my + 62 * Math.sin(-.7), { stroke: C.gold, "stroke-width": 1.2, "stroke-dasharray": "4 3" });
        VZ.txt(layer, mx + 10, my + 18, "r", { size: 12, fill: C.gold });
        VZ.txt(layer, mx, my - 72, "圆心", { size: 11, fill: C.gold, anchor: "middle" });
      } else if (k === 3) {
        [[-90, 0], [60, 0]].forEach(function (o, idx) {
          var x = mx + o[0], y = my + o[1];
          VZ.ln(layer, x - 40, y + 26, x + 40, y + 26, { stroke: C.ink, "stroke-width": 2 });
          VZ.ln(layer, x - 40, y + 26, x - 40 + 48 * Math.cos(.5), y + 26 - 48 * Math.sin(.5), { stroke: C.ink, "stroke-width": 2 });
          VZ.path(layer, "M" + (x - 22) + " " + (y + 26) + "A22 22 0 0 0 " + (x - 40 + 22 * Math.cos(.5)) + " " + (y + 26 - 22 * Math.sin(.5)),
            VZ.stroke({ stroke: C.cyan, "stroke-width": 1.6 }));
          VZ.txt(layer, x - 14, y + 18, "90°", { size: 10.5, fill: C.cyan });
        });
        VZ.txt(layer, mx + 60, my + 40, "＝ 完全一样", { size: 12, fill: C.ink2 });
      } else {
        VZ.ln(layer, mx - 160, my + 40, mx + 160, my - 20, { stroke: C.ink, "stroke-width": 2 });
        VZ.ln(layer, mx - 160, my - 20, mx + 160, my + 44, { stroke: C.ink, "stroke-width": 2 });
        VZ.ln(layer, mx - 130, my - 32, mx - 130, my + 56, { stroke: C.gold, "stroke-width": 1.3 });
        VZ.path(layer, "M" + (mx - 130) + " " + (my + 18) + "A18 18 0 0 0 " + (mx - 112) + " " + (my + 26.6), VZ.stroke({ stroke: C.cyan, "stroke-width": 1.4 }));
        VZ.path(layer, "M" + (mx - 130) + " " + (my + 4) + "A18 18 0 0 1 " + (mx - 112) + " " + (my - 12.4), VZ.stroke({ stroke: C.cyan, "stroke-width": 1.4 }));
        VZ.txt(layer, mx - 104, my + 30, "α", { size: 12, fill: C.cyan });
        VZ.txt(layer, mx - 104, my + 2, "β", { size: 12, fill: C.cyan });
        VZ.txt(layer, mx - 122, my + 72, "α+β < 180°", { size: 12, fill: C.gold });
        VZ.txt(layer, mx + 150, my - 32, "在远处相交！", { size: 12, fill: C.red, anchor: "end" });
      }
      if (danger[k]) {
        VZ.txt(layer, 490, 62, "⚠ 措辞里藏着「无限延长」——它管的是无穷远处", { size: 11, fill: C.red, anchor: "middle" });
      }
    }
    var ctl = VZ.box(stage, "viz-ctl");
    VZ.chips(ctl, posts, posts[4], function (s) { drawPost(posts.indexOf(s)); });
    drawPost(4);
  }
},

/* ==========================================================
   f-ch02e · 球面三角形：拖顶点，内角和超过 180°
   ========================================================== */
"f-ch02e": {
  title: "",
  hint: "<b>拖动球面上的三个顶点</b>。三个顶点互相拉远、三角形撑满半球时，内角和逼近 <b>270°</b>——三个角全是直角；缩成一小块时又退回 180°。<span class='hl'>「三角形内角和 = 180°」不是真理，只是平直空间的特权。</span>",
  draw: function (stage) {
    var W = 760, H = 300, svg = VZ.S(stage, W, H, { grid: true });
    var C = VZ.C;
    var cx = 205, cy = 158, R = 112;
    VZ.circ(svg, cx, cy, R, { fill: "rgba(255,255,255,.03)", stroke: C.faint, "stroke-width": 1.2 });
    VZ.ln(svg, cx - R, cy, cx + R, cy, { stroke: C.faint, "stroke-width": .8, "stroke-dasharray": "4 4" });
    VZ.txt(svg, cx, cy + R + 18, "（正交投影：只见正面半球，背面弧线变暗）", { size: 10, fill: C.dim, anchor: "middle" });

    /* 单位球向量：屏幕 x→py，屏幕 y→pz，深度为 px（正面 px≤0） */
    function toVec(sx, sy) {
      var py = (sx - cx) / R, pz = (cy - sy) / R;
      var q = py * py + pz * pz;
      if (q > 0.96) { var s = Math.sqrt(0.96 / q); py *= s; pz *= s; }
      return [-Math.sqrt(Math.max(1 - py * py - pz * pz, 0)), py, pz]; /* [px,py,pz] */
    }
    function scr(v) { return [cx + R * v[1], cy - R * v[2]]; }

    var verts = [toVec(cx - 78, cy - 58), toVec(cx + 88, cy - 30), toVec(cx + 5, cy + 88)];
    var names = ["A", "B", "C"], vcols = [C.cyan, C.gold, C.mag];
    var arcPaths = [], arcSegs = [];
    for (var i = 0; i < 3; i++) arcPaths.push(VZ.path(svg, "", VZ.stroke({ stroke: C.green, "stroke-width": 2.2, opacity: .9 })));
    var fills = VZ.path(svg, "", { fill: "rgba(94,224,138,.10)", stroke: "none" });
    svg.insertBefore(fills, arcPaths[0]);

    function norm(v) { var l = Math.hypot(v[0], v[1], v[2]); return [v[0] / l, v[1] / l, v[2] / l]; }
    function angleAt(P, Q, S) {
      var d1 = Q[0] * P[0] + Q[1] * P[1] + Q[2] * P[2];
      var t1 = [Q[0] - d1 * P[0], Q[1] - d1 * P[1], Q[2] - d1 * P[2]];
      var l1 = Math.hypot(t1[0], t1[1], t1[2]);
      if (l1 < 1e-6) t1 = [1, 0, 0]; else { t1[0] /= l1; t1[1] /= l1; t1[2] /= l1; }
      var d2 = S[0] * P[0] + S[1] * P[1] + S[2] * P[2];
      var t2 = [S[0] - d2 * P[0], S[1] - d2 * P[1], S[2] - d2 * P[2]];
      var l2 = Math.hypot(t2[0], t2[1], t2[2]);
      if (l2 < 1e-6) t2 = [0, 1, 0]; else { t2[0] /= l2; t2[1] /= l2; t2[2] /= l2; }
      return Math.acos(VZ.clamp(t1[0] * t2[0] + t1[1] * t2[1] + t1[2] * t2[2], -1, 1));
    }
    function slerp(a, b, t) {
      var w = VZ.clamp(a[0] * b[0] + a[1] * b[1] + a[2] * b[2], -1, 1), om = Math.acos(w);
      if (om < 1e-6) return a.slice();
      var s1 = Math.sin((1 - t) * om) / Math.sin(om), s2 = Math.sin(t * om) / Math.sin(om);
      return [a[0] * s1 + b[0] * s2, a[1] * s1 + b[1] * s2, a[2] * s1 + b[2] * s2];
    }

    var angTxt = [], sumTxt = VZ.txt(svg, 420, 60, "", { size: 20, fill: C.gold, weight: 700 });
    VZ.txt(svg, 420, 34, "球面三角形内角和", { size: 12.5, fill: C.dim });
    for (var k = 0; k < 3; k++) angTxt.push(VZ.txt(svg, 420, 96 + k * 30, "", { size: 13.5, fill: vcols[k] }));
    var refLine = VZ.ln(svg, 420, 212, 700, 212, { stroke: C.faint, "stroke-width": 1 });
    VZ.txt(svg, 420, 230, "180°", { size: 10.5, fill: C.dim });
    VZ.txt(svg, 700, 230, "270°+", { size: 10.5, fill: C.dim, anchor: "end" });
    var sumDot = VZ.circ(svg, 420, 212, 7, { fill: C.gold });
    var flatMark = VZ.ln(svg, 420, 202, 420, 222, { stroke: C.ink2, "stroke-width": 1.6 });

    function redraw() {
      /* 内角 */
      var angs = [
        angleAt(verts[0], verts[1], verts[2]),
        angleAt(verts[1], verts[2], verts[0]),
        angleAt(verts[2], verts[0], verts[1])
      ];
      var sum = angs[0] + angs[1] + angs[2];
      /* 弧线（大圆） */
      var fillPts = [];
      for (var e = 0; e < 3; e++) {
        var A = verts[e], B = verts[(e + 1) % 3], d = "";
        for (var s = 0; s <= 26; s++) {
          var v = slerp(A, B, s / 26), p = scr(v);
          d += (s ? "L" : "M") + p[0].toFixed(1) + " " + p[1].toFixed(1);
          if (e === 0) fillPts.push(p);
        }
        arcPaths[e].setAttribute("d", d);
        arcPaths[e].setAttribute("opacity", (A[0] > 0.05 && B[0] > 0.05) ? .3 : .9);
      }
      fills.setAttribute("d", "M" + fillPts.map(function (p) { return p[0].toFixed(1) + " " + p[1].toFixed(1); }).join("L") + "Z");
      /* 顶点手柄 */
      for (var v2 = 0; v2 < 3; v2++) {
        var p2 = scr(verts[v2]);
        handles[v2].setAttribute("cx", p2[0]); handles[v2].setAttribute("cy", p2[1]);
        labs[v2].setAttribute("x", p2[0] + (p2[0] > cx ? 16 : -16));
        labs[v2].setAttribute("y", p2[1] - 10);
      }
      for (var a = 0; a < 3; a++)
        angTxt[a].textContent = "角 " + names[a] + " = " + (angs[a] * 180 / Math.PI).toFixed(1) + "°";
      sumTxt.textContent = (sum * 180 / Math.PI).toFixed(1) + "°";
      sumTxt.setAttribute("fill", sum * 180 / Math.PI > 181 ? C.gold : C.green);
      var u = VZ.clamp((sum * 180 / Math.PI - 180) / 90, 0, 1.2);
      sumDot.setAttribute("cx", 420 + u * 280);
      sumDot.setAttribute("fill", sum * 180 / Math.PI > 181 ? C.gold : C.green);
    }

    var handles = [], labs = [];
    for (var h = 0; h < 3; h++) {
      labs.push(VZ.txt(svg, 0, 0, names[h], { size: 13, fill: vcols[h], weight: 700, anchor: "middle" }));
      handles.push(VZ.circ(svg, 0, 0, 9, { fill: "rgba(12,8,32,.9)", stroke: vcols[h], "stroke-width": 2.2, style: "cursor:grab" }));
    }
    for (var h2 = 0; h2 < 3; h2++) (function (idx) {
      VZ.drag(svg, handles[idx], W, H, function (x, y, ph) {
        if (ph === "move" || ph === "start") { verts[idx] = toVec(x, y); redraw(); }
      });
    })(h2);
    redraw();
    VZ.txt(svg, 420, 258, "顶点拉得越开，球面的正弯曲把角「撑」得越大。", { size: 11.5, fill: C.dim });
  }
},

/* ==========================================================
   f-ch02f · 双曲三角形：越大内角和越小（庞加莱圆盘）
   ========================================================== */
"f-ch02f": {
  title: "",
  hint: "<b>把三个顶点往圆盘边缘拖</b>：在双曲世界（庞加莱圆盘）里，三角形越大，内角和越<b>小</b>——缩到圆心附近时回到 180°，撑到边界时可以远低于 100°。<span class='hl'>双曲三角形的内角和 = 180° − 面积：面积直接从角度里扣掉。</span>",
  draw: function (stage) {
    var W = 760, H = 290, svg = VZ.S(stage, W, H, { grid: true });
    var C = VZ.C;
    var cx = 195, cy = 150, R = 110;
    VZ.circ(svg, cx, cy, R, { fill: "rgba(255,255,255,.03)", stroke: C.faint, "stroke-width": 1.2 });
    VZ.txt(svg, cx, cy - R - 12, "庞加莱圆盘（边界在无穷远）", { size: 11, fill: C.dim, anchor: "middle" });

    var dg = VZ.g(svg, {});
    var verts = [[-38, 30], [44, 26], [0, -44]];
    var names = ["A", "B", "C"], vcols = [C.cyan, C.gold, C.mag];
    var arcs = [], handles = [], labs = [];
    var fillP = VZ.path(dg, "", { fill: "rgba(155,140,255,.12)", stroke: "none" });
    for (var i = 0; i < 3; i++) arcs.push(VZ.path(dg, "", VZ.stroke({ stroke: C.violet, "stroke-width": 2 })));
    VZ.txt(svg, 400, 44, "双曲三角形内角和", { size: 12.5, fill: C.dim });
    var sumTxt = VZ.txt(svg, 400, 74, "", { size: 22, fill: C.violet, weight: 700 });
    var angTxt = [];
    for (var k = 0; k < 3; k++) angTxt.push(VZ.txt(svg, 400, 108 + k * 27, "", { size: 13, fill: vcols[k] }));
    /* 标尺：0°..180° */
    var bx = 400, bw2 = 300, by2 = 228;
    VZ.ln(svg, bx, by2, bx + bw2, by2, { stroke: C.faint, "stroke-width": 1.2 });
    VZ.txt(svg, bx, by2 + 16, "0°", { size: 10.5, fill: C.dim });
    VZ.txt(svg, bx + bw2 / 2, by2 + 16, "90°", { size: 10.5, fill: C.dim, anchor: "middle" });
    VZ.txt(svg, bx + bw2, by2 + 16, "180°（欧氏）", { size: 10.5, fill: C.dim, anchor: "end" });
    VZ.ln(svg, bx + bw2, by2 - 9, bx + bw2, by2 + 9, { stroke: C.ink2, "stroke-width": 1.5 });
    var dot = VZ.circ(svg, bx + bw2, by2, 7, { fill: C.violet });

    function G(p) { return [cx + p[0], cy + p[1]]; }
    function redraw() {
      var P = [verts[0], verts[1], verts[2]];
      var angs = VZ.hyperTriangleAngles(P[0], P[1], P[2], R);
      var sum = angs[0] + angs[1] + angs[2];
      fillP.setAttribute("d", "M" + P.map(function (p) { var q = G(p); return q[0] + " " + q[1]; }).join("L") + "Z");
      for (var e = 0; e < 3; e++)
        arcs[e].setAttribute("d", shiftD(VZ.geoArc(P[e], P[(e + 1) % 3], R).d, cx, cy));
      for (var v = 0; v < 3; v++) {
        var q = G(P[v]);
        handles[v].setAttribute("cx", q[0]); handles[v].setAttribute("cy", q[1]);
        labs[v].setAttribute("x", q[0] + (P[v][0] > 0 ? 17 : -17));
        labs[v].setAttribute("y", q[1] - 9);
      }
      for (var a = 0; a < 3; a++)
        angTxt[a].textContent = "角 " + names[a] + " = " + (angs[a] * 180 / Math.PI).toFixed(1) + "°";
      sumTxt.textContent = (sum * 180 / Math.PI).toFixed(1) + "°";
      dot.setAttribute("cx", bx + bw2 * VZ.clamp(sum * 180 / Math.PI / 180, 0, 1));
    }
    for (var h = 0; h < 3; h++) {
      labs.push(VZ.txt(dg, 0, 0, names[h], { size: 13, fill: vcols[h], weight: 700, anchor: "middle" }));
      handles.push(VZ.circ(dg, 0, 0, 9, { fill: "rgba(12,8,32,.9)", stroke: vcols[h], "stroke-width": 2.2, style: "cursor:grab" }));
    }
    for (var h2 = 0; h2 < 3; h2++) (function (idx) {
      VZ.drag(svg, handles[idx], W, H, function (x, y) {
        var lx = x - cx, ly = y - cy, r = Math.hypot(lx, ly);
        if (r > R * 0.92) { lx *= R * 0.92 / r; ly *= R * 0.92 / r; }
        verts[idx] = [lx, ly];
        redraw();
      });
    })(h2);
    redraw();
    VZ.txt(svg, 400, 262, "同一个三角形：缩小到圆心附近 → 逼近 180°；推向边界 → 掉向 0°。", { size: 11.5, fill: C.dim });
  }
},

/* ==========================================================
   f-ch02g · 三种几何对比表盘（欧氏 / 球面 / 双曲）
   ========================================================== */
"f-ch02g": {
  title: "",
  hint: "<b>切换三种几何</b>，同一份「事实卡」立刻换内容：曲率的符号、三角形内角和、过直线外一点的平行线条数。<span class='hl'>几何不是一个，是一份菜单——物理空间点哪一道，是实验说了算。</span>",
  draw: function (stage) {
    var W = 760, H = 280, svg = VZ.S(stage, W, H, { grid: true });
    var C = VZ.C;
    var layer = VZ.g(svg);
    var ctl = VZ.box(stage, "viz-ctl");
    var MODES = {
      "欧氏几何": function () {
        VZ.card(layer, 250, 60, 260, 170, { stroke: C.faint });
        VZ.poly(layer, [[310, 190], [450, 190], [380, 90]], VZ.stroke({ stroke: C.cyan, "stroke-width": 2 }));
        VZ.ln(layer, 250, 250, 510, 250, { stroke: C.ink, "stroke-width": 1.6 });
        VZ.ln(layer, 250, 214, 510, 214, { stroke: C.ink2, "stroke-width": 1.6 });
        VZ.txt(layer, 518, 236, "两直线，处处等距", { size: 11, fill: C.dim });
        VZ.txt(layer, 380, 78, "曲率 0", { size: 13, fill: C.cyan, anchor: "middle", weight: 700 });
      },
      "球面几何": function () {
        VZ.circ(layer, 380, 148, 84, { fill: "rgba(255,255,255,.03)", stroke: C.faint, "stroke-width": 1.2 });
        VZ.path(layer, "M310 190Q380 232 450 190", VZ.stroke({ stroke: C.gold, "stroke-width": 2 }));
        VZ.path(layer, "M310 190Q330 110 380 80", VZ.stroke({ stroke: C.gold, "stroke-width": 2 }));
        VZ.path(layer, "M450 190Q430 110 380 80", VZ.stroke({ stroke: C.gold, "stroke-width": 2 }));
        VZ.path(layer, "M300 172Q380 214 460 172", VZ.stroke({ stroke: C.ink2, "stroke-width": 1.3, "stroke-dasharray": "6 5" }));
        VZ.txt(layer, 380, 52, "曲率 +（正弯曲）", { size: 13, fill: C.gold, anchor: "middle", weight: 700 });
        VZ.txt(layer, 380, 250, "「平行线」不存在：任何大圆都相交", { size: 11, fill: C.dim, anchor: "middle" });
      },
      "双曲几何": function () {
        var R = 88;
        VZ.circ(layer, 380, 148, R, { fill: "rgba(255,255,255,.03)", stroke: C.faint, "stroke-width": 1.2 });
        VZ.path(layer, shiftD(VZ.geoArc([-60, 55], [60, 55], R).d, 380, 148), VZ.stroke({ stroke: C.violet, "stroke-width": 2 }));
        VZ.path(layer, shiftD(VZ.geoArc([-60, 55], [-12, -68], R).d, 380, 148), VZ.stroke({ stroke: C.violet, "stroke-width": 2 }));
        VZ.path(layer, shiftD(VZ.geoArc([60, 55], [-12, -68], R).d, 380, 148), VZ.stroke({ stroke: C.violet, "stroke-width": 2 }));
        VZ.ln(layer, 380 - R, 148, 380 + R, 148, { stroke: C.ink2, "stroke-width": 1.2, "stroke-dasharray": "6 5" });
        VZ.txt(layer, 380, 44, "曲率 −（负弯曲）", { size: 13, fill: C.violet, anchor: "middle", weight: 700 });
        VZ.txt(layer, 380, 250, "过线外一点：无穷多条平行线", { size: 11, fill: C.dim, anchor: "middle" });
      }
    };
    var FACTS = {
      "欧氏几何": { "曲率": "k = 0（平直）", "三角形内角和": "= 180°，与大小无关", "平行线": "恰好 1 条", "圆周率 / 周长": "= 2π，正好" },
      "球面几何": { "曲率": "k > 0（正）", "三角形内角和": "> 180°，越大越超", "平行线": "0 条（都相交）", "圆周率 / 周长": "< 2π" },
      "双曲几何": { "曲率": "k < 0（负）", "三角形内角和": "< 180°，越大越缺", "平行线": "无穷多条", "圆周率 / 周长": "> 2π" }
    };
    var pan = null;
    function render(m) {
      layer.innerHTML = "";
      MODES[m]();
      if (pan) pan.remove();
      pan = VZ.panel(stage, FACTS[m]);
    }
    VZ.chips(ctl, ["欧氏几何", "球面几何", "双曲几何"], "欧氏几何", render);
    render("欧氏几何");
  }
},

/* ==========================================================
   f-ch03d · 毕达哥拉斯灾难：√2 无理性的反证流程（步进）
   ========================================================== */
"f-ch03d": {
  title: "",
  hint: "<b>点「下一步」走完整个反证</b>：假设 √2 能写成分数 → 推出 m 是偶数 → 再推出 n 也是偶数 → 与「已约成最简」正面相撞。<span class='hl'>反证法不直接攻击结论，而是让假设自己咬自己一口——这一口咬穿了毕达哥拉斯学派的地基。</span>",
  draw: function (stage) {
    var W = 760, H = 280, svg = VZ.S(stage, W, H, { grid: true });
    var C = VZ.C;
    /* 左：边长 1 的正方形与对角线 */
    var sq = 120, sx = 90, sy = 92;
    VZ.card(svg, sx, sy, sq, sq, { stroke: C.ink2, sw: 1.8 });
    VZ.ln(svg, sx, sy, sx + sq, sy + sq, { stroke: C.cyan, "stroke-width": 2.2 });
    flow(svg, "M" + sx + " " + sy + "L" + (sx + sq) + " " + (sy + sq), { color: C.cyan, dur: 1.8, r: 3.5 });
    VZ.txt(svg, sx + sq / 2, sy - 10, "1", { size: 12, fill: C.ink2, anchor: "middle" });
    VZ.txt(svg, sx - 14, sy + sq / 2 + 4, "1", { size: 12, fill: C.ink2, anchor: "middle" });
    VZ.txt(svg, sx + sq / 2 + 26, sy + sq / 2 - 8, "√2 = ?", { size: 13, fill: C.cyan });
    var dTxt = VZ.txt(svg, sx + 60, 258, "假设它是个分数……", { size: 11.5, fill: C.dim, anchor: "middle" });

    /* 右：步骤文本 */
    var steps = [
      { t: "第 0 步：从一块地砖出发", d: "边长为 1 的正方形，对角线的长度按勾股定理是 √2。这个长度真实存在——地砖上画得出来。" },
      { t: "第 1 步：假设", d: "假设 √2 = m / n，其中 m、n 是整数，并且已经约到最简（没有公因数）。" },
      { t: "第 2 步：m 必须是偶数", d: "两边平方：m² = 2n²。所以 m² 是偶数，而奇数的平方是奇数 → m 必须是偶数。记 m = 2k。" },
      { t: "第 3 步：n 也必须是偶数", d: "代入：(2k)² = 2n² → 4k² = 2n² → n² = 2k²。同样的推理 → n 也是偶数。" },
      { t: "第 4 步：矛盾！", d: "m、n 都是偶数 → 都有因数 2，可第 1 步明明说已约成最简。假设自相矛盾 → √2 写不成任何分数。" }
    ];
    var k = 0;
    var tTxt = VZ.txt(svg, 300, 56, steps[0].t, { size: 14.5, fill: C.gold, weight: 700 });
    var d2 = VZ.g(svg);
    var dots = [];
    for (var i = 0; i < 5; i++) {
      dots.push(VZ.circ(svg, 300 + i * 34, 250, 6, { fill: C.faint, style: "cursor:pointer" }));
      (function (idx) {
        dots[idx].addEventListener("click", function () { go(idx); });
      })(i);
    }
    function go(n) {
      k = VZ.clamp(n, 0, 4);
      tTxt.textContent = steps[k].t;
      tTxt.setAttribute("fill", k === 4 ? C.red : C.gold);
      d2.innerHTML = "";
      VZ.para(d2, 300, 84, steps[k].d, { size: 13, per: 33, lh: 23 });
      dTxt.textContent = k < 4 ? "假设它是个分数……" : "分数世界里根本放不下这条对角线。";
      dTxt.setAttribute("fill", k === 4 ? C.red : C.dim);
      for (var j = 0; j < 5; j++) {
        dots[j].setAttribute("fill", j <= k ? (k === 4 ? C.red : C.gold) : C.faint);
      }
    }
    var ctl = VZ.box(stage, "viz-ctl");
    VZ.btn(ctl, "上一步", function () { go(k - 1); });
    VZ.btn(ctl, "下一步", function () { go(k + 1); });
    go(0);
  }
},

/* ==========================================================
   f-ch03e · 完备性：从数轴上挖掉一个点，缝隙永远缝不上
   ========================================================== */
"f-ch03e": {
  title: "",
  hint: "<b>拖动滑块选一个位置</b>（默认 √2），看上下两条线：上面是整条数轴，下面是放大 60 倍的局部。有理数密得没有缝隙，可你选中的那个点就是不在——<span class='hl'>挖掉它，两边的关系全断了：左边没有最靠右的数，右边没有最靠左的数。这就是「不完备」的样子。</span>",
  draw: function (stage) {
    var W = 760, H = 280, svg = VZ.S(stage, W, H, { grid: true });
    var C = VZ.C;
    var X0 = Math.SQRT2; /* 当前被挖掉的值 */

    /* 顶部：全景数轴（值域 1..2） */
    function X(v) { return 80 + (v - 1) * 600; }
    VZ.ln(svg, 60, 84, 700, 84, { stroke: C.ink2, "stroke-width": 1.4 });
    VZ.txt(svg, X(1), 106, "1", { size: 11, fill: C.dim, anchor: "middle" });
    VZ.txt(svg, X(2), 106, "2", { size: 11, fill: C.dim, anchor: "middle" });
    for (var q = 1; q <= 10; q++) for (var p = Math.ceil(q); p <= 2 * q; p++) {
      var v = p / q;
      VZ.circ(svg, X(v), 84, 2.4, { fill: C.dim, opacity: .8 });
    }
    var holeTop = VZ.circ(svg, X(X0), 84, 6, { fill: "none", stroke: C.red, "stroke-width": 2, "stroke-dasharray": "3 3" });
    VZ.txt(svg, 700, 106, "有理数（密密麻麻）", { size: 10.5, fill: C.dim, anchor: "end" });

    /* 底部：放大 60 倍 */
    VZ.card(svg, 40, 140, 680, 104, { stroke: C.faint });
    VZ.ln(svg, 60, 192, 700, 192, { stroke: C.ink2, "stroke-width": 1.4 });
    VZ.txt(svg, 52, 158, "局部放大 ×60（窗口宽 ≈ 0.02）", { size: 11, fill: C.gold });
    var zoomG = VZ.g(svg);
    function Z(v) { return 380 + (v - X0) * 30000 / 60; } /* ×60 */
    var holeZoom = VZ.circ(svg, 380, 192, 6, { fill: "none", stroke: C.red, "stroke-width": 2 });
    var nearTxt = VZ.txt(svg, 700, 230, "", { size: 11.5, fill: C.ink2, anchor: "end" });
    VZ.raf(svg, function (t) {
      holeZoom.setAttribute("r", 6 + 2 * Math.sin(t * 3.2));
    });

    function redrawZoom() {
      zoomG.innerHTML = "";
      var winW = 640 / (30000 / 60); /* 窗口内的值域宽 */
      var lo = X0 - winW / 2, hi = X0 + winW / 2;
      var cnt = 0;
      for (var q2 = 1; q2 <= 60; q2++) {
        for (var p2 = Math.ceil(lo * q2); p2 <= hi * q2; p2++) {
          var v2 = p2 / q2;
          if (v2 < lo || v2 > hi) continue;
          VZ.circ(zoomG, Z(v2), 192, 2.6, { fill: C.dim, opacity: .85 });
          cnt++;
        }
      }
      holeZoom.setAttribute("cx", 380);
      var best = 0, bd = 1e9;
      for (var q3 = 1; q3 <= 200; q3++) {
        var p3 = Math.round(X0 * q3);
        var d3 = Math.abs(p3 / q3 - X0);
        if (d3 < bd) { bd = d3; best = p3 / q3; }
      }
      nearTxt.textContent = "窗口内有 " + cnt + " 个有理数，但离挖掉点最近的也有距离 " + bd.toFixed(5);
    }
    var lbl = VZ.txt(svg, 700, 60, "", { size: 12, fill: C.red, anchor: "end" });
    function setX(v) {
      X0 = v;
      holeTop.setAttribute("cx", X(v));
      lbl.textContent = "挖掉 x = " + (Math.abs(v - Math.SQRT2) < 1e-9 ? "√2" : v.toFixed(3));
      redrawZoom();
    }
    var ctl = VZ.box(stage, "viz-ctl");
    var sl = VZ.slider(ctl, { label: "挖掉的位置", value: X0, min: 1.05, max: 1.95, step: 0.001,
      format: function (v) { return v.toFixed(3); }, onInput: setX });
    VZ.btn(ctl, "回到 √2", function () { setX(Math.SQRT2); sl.set(Math.SQRT2); });
    setX(X0);
  }
},

/* ==========================================================
   f-ch03f · 给有理数排队：自然数 ↔ 有理数的一一对应
   ========================================================== */
"f-ch03f": {
  title: "",
  hint: "<b>反复点「数下一个」</b>：按对角线给全部正有理数排队，遇到已经出现过的值（如 2/2 = 1/1）就跳过。<span class='hl'>队伍永远数不完，但每个有理数都排在确定的位置上——有理数居然和自然数一样多。而实数不能这样排队，这正是下一幕的出发点。</span>",
  draw: function (stage) {
    var W = 760, H = 290, svg = VZ.S(stage, W, H, { grid: true });
    var C = VZ.C;
    var MAXM = 9, MAXN = 5, cw = 68, ch = 40, gx = 60, gy = 78;
    var r, c;

    function gcd(a, b) { return b ? gcd(b, a % b) : a; }
    /* 对角线枚举：s = m+n 从小到大 */
    var order = [];
    for (var s = 2; s <= MAXM + MAXN; s++)
      for (var m = 1; m <= MAXM; m++) {
        var n = s - m;
        if (n >= 1 && n <= MAXN) order.push([m, n, gcd(m, n) === 1]);
      }
    var k = 0;
    var counter = VZ.txt(svg, 20, 40, "", { size: 14.5, fill: C.gold, weight: 700 });
    var skipTxt = VZ.txt(svg, 740, 40, "", { size: 11.5, fill: C.red, anchor: "end" });
    var trail = VZ.path(svg, "", VZ.stroke({ stroke: C.faint, "stroke-width": 1.4, "stroke-dasharray": "5 5" }));
    var hl = VZ.circ(svg, 0, 0, 22, { fill: "none", stroke: C.cyan, "stroke-width": 2.4 });
    VZ.raf(svg, function (t) {
      hl.setAttribute("r", 22 + 2.5 * Math.sin(t * 4));
    });

    function cell(m, n) { return [gx + (m - 1) * cw + cw / 2, gy + (n - 1) * ch + ch / 2]; }
    /* 画网格 */
    var cellsG = VZ.g(svg);
    for (var n2 = 1; n2 <= MAXN; n2++) for (var m2 = 1; m2 <= MAXM; m2++) {
      var p = cell(m2, n2);
      var g = gcd(m2, n2);
      var prim = g === 1;
      VZ.card(cellsG, p[0] - 30, p[1] - 16, 60, 32, { rx: 8, stroke: prim ? C.faint : "rgba(77,67,128,.4)", sw: 1 });
      VZ.txt(cellsG, p[0], p[1] - 3, m2 + "/" + n2, { size: 12, fill: prim ? C.ink2 : "rgba(141,134,189,.5)", anchor: "middle", weight: prim ? 700 : 400 });
      if (!prim) VZ.txt(cellsG, p[0], p[1] + 11, "= " + (m2 / g) + "/" + (n2 / g), { size: 8.5, fill: "rgba(255,122,122,.6)", anchor: "middle" });
    }
    for (var n3 = 1; n3 <= MAXN; n3++) VZ.txt(svg, gx - 34, gy + (n3 - 1) * ch + ch / 2 + 4, "n=" + n3, { size: 10.5, fill: C.dim });
    for (var m3 = 1; m3 <= MAXM; m3++) VZ.txt(svg, gx + (m3 - 1) * cw + cw / 2, gy - 12, "m=" + m3, { size: 10.5, fill: C.dim, anchor: "middle" });

    var pts = [];
    function step() {
      if (k >= order.length) { k = 0; pts = []; trail.setAttribute("d", ""); }
      var cur = order[k], p = cell(cur[0], cur[1]);
      pts.push(p[0] + " " + p[1]);
      trail.setAttribute("d", "M" + pts.join("L"));
      hl.setAttribute("cx", p[0]); hl.setAttribute("cy", p[1]);
      if (cur[2]) {
        counter.textContent = "第 " + (k + 1) + " 个自然数 ↔ " + cur[0] + "/" + cur[1];
        skipTxt.textContent = "";
      } else {
        var gg = cur[0] / gcd(cur[0], cur[1]), nn = cur[1] / gcd(cur[0], cur[1]);
        counter.textContent = "第 " + (k + 1) + " 个 ↔ " + cur[0] + "/" + cur[1] + "（跳过）";
        skipTxt.textContent = cur[0] + "/" + cur[1] + " = " + gg + "/" + nn + "，已经数过";
      }
      k++;
    }
    var ctl = VZ.box(stage, "viz-ctl");
    VZ.btn(ctl, "数下一个", step);
    VZ.btn(ctl, "自动数到底", function () {
      var stop = VZ.raf(svg, function (t, dt) {
        step();
        if (k >= order.length) stop();
      });
    });
    VZ.txt(svg, 20, 262, "分母 n 从上往下、分子 m 从左往右；对角线扫过去，一个有理数都漏不掉。", { size: 11, fill: C.dim });
    step(); step(); step();
  }
},

/* ==========================================================
   f-ch03g · 物理量真的是实数吗：卡尺给的是区间，不是点
   ========================================================== */
"f-ch03g": {
  title: "",
  hint: "<b>拖动滑块移动卡尺</b>去量一根「真长恰好是 √2 cm」的小棒。读数只能到 0.01——下面放大 400 倍就能看到：<span class='hl'>不管卡尺多精密，它交出的永远是一个区间；「物理量是实数轴上的一个点」是一个漂亮但无法验证的理想化。</span>",
  draw: function (stage) {
    var W = 760, H = 280, svg = VZ.S(stage, W, H, { grid: true });
    var C = VZ.C;
    var TRUE = Math.SQRT2;
    function X(v) { return 80 + (v - 1) * 600; } /* 主尺：1.0..2.0 */

    /* 主尺 */
    VZ.ln(svg, 70, 70, 690, 70, { stroke: C.ink2, "stroke-width": 2 });
    for (var t = 10; t <= 20.001; t += 0.1) {
      var maj = Math.round(t * 10) % 10 === 0;
      VZ.ln(svg, X(t / 10), 70, X(t / 10), maj ? 58 : 64, { stroke: C.ink2, "stroke-width": maj ? 1.4 : .8 });
      if (maj) VZ.txt(svg, X(t / 10), 48, (t / 10).toFixed(1), { size: 10.5, fill: C.dim, anchor: "middle" });
    }
    var jaw = VZ.g(svg);
    VZ.ln(jaw, 0, 44, 0, 96, { stroke: C.cyan, "stroke-width": 3 });
    VZ.ln(jaw, -14, 50, 0, 50, { stroke: C.cyan, "stroke-width": 3 });
    VZ.ln(jaw, -14, 90, 0, 90, { stroke: C.cyan, "stroke-width": 3 });
    VZ.txt(svg, 70, 118, "← 卡口（拖滑块移动）", { size: 10.5, fill: C.dim });

    /* 放大带：真值 ±0.03，放大 400 倍 */
    var zx = 380, zscale = 600 / 0.06; /* px per unit */
    function Z(v) { return zx + (v - TRUE) * zscale; }
    VZ.card(svg, 40, 150, 680, 86, { stroke: C.faint });
    VZ.ln(svg, 60, 196, 700, 196, { stroke: C.faint, "stroke-width": 1 });
    VZ.txt(svg, 52, 168, "放大 ×400（窗口宽 0.06 cm）", { size: 11, fill: C.gold });
    /* 刻度 */
    for (var tk = Math.ceil((TRUE - 0.031) * 100) / 100; tk <= TRUE + 0.031; tk += 0.01) {
      VZ.ln(svg, Z(tk), 190, Z(tk), 202, { stroke: C.dim, "stroke-width": .9 });
      VZ.txt(svg, Z(tk), 216, tk.toFixed(2), { size: 9, fill: C.dim, anchor: "middle" });
    }
    /* 真值点（脉动） */
    var truePt = VZ.circ(svg, Z(TRUE), 196, 6, { fill: C.gold });
    VZ.txt(svg, Z(TRUE) + 10, 178, "真值 √2（只是模型的假设）", { size: 10.5, fill: C.gold });
    VZ.raf(svg, function (t) { truePt.setAttribute("r", 5.5 + 1.8 * Math.sin(t * 3.4)); });
    /* 测量区间 */
    var intL = VZ.ln(svg, 0, 178, 0, 214, { stroke: C.red, "stroke-width": 2 });
    var intR = VZ.ln(svg, 0, 178, 0, 214, { stroke: C.red, "stroke-width": 2 });
    var intT = VZ.ln(svg, 0, 178, 0, 178, { stroke: C.red, "stroke-width": 2, "stroke-dasharray": "4 4" });
    var intB = VZ.ln(svg, 0, 214, 0, 214, { stroke: C.red, "stroke-width": 2, "stroke-dasharray": "4 4" });
    var readout = VZ.panel(stage, { "卡尺读数": "", "真值（理想化）": "", "读数误差": "" });

    function measure(m) {
      m = Math.round(m * 100) / 100; /* 卡尺只认 0.01 */
      jaw.setAttribute("transform", "translate(" + X(m) + " 0)");
      var half = 0.005 * zscale;
      var inside = Math.abs(m - TRUE) < 0.031;
      var x1 = Z(m) - half, x2 = Z(m) + half;
      if (x1 < 45) x1 = 45; if (x2 > 715) x2 = 715;
      [intL, intR, intT, intB].forEach(function (l) { l.setAttribute("opacity", inside ? 1 : .25); });
      intL.setAttribute("x1", x1); intL.setAttribute("x2", x1);
      intR.setAttribute("x1", x2); intR.setAttribute("x2", x2);
      intT.setAttribute("x1", x1); intT.setAttribute("x2", x2);
      intB.setAttribute("x1", x1); intB.setAttribute("x2", x2);
      VZ.setPanel(readout, {
        "卡尺读数": m.toFixed(2) + " cm",
        "真值（理想化）": "√2 = 1.41421356…",
        "读数误差": (Math.abs(m - TRUE) < 0.005 ? "≈ 0（本例恰好）" : Math.abs(m - TRUE).toFixed(3) + " cm")
      });
    }
    var ctl = VZ.box(stage, "viz-ctl");
    var sl = VZ.slider(ctl, { label: "卡口位置", value: 1.41, min: 1.2, max: 1.7, step: 0.001,
      format: function (v) { return v.toFixed(3); }, onInput: measure });
    VZ.btn(ctl, "对准读数 1.41", function () { measure(1.41); sl.set(1.41); });
    measure(1.41);
  }
},

/* ==========================================================
   f-ch04d · 四次扩数：解 x²=−1 为什么非要有 i
   ========================================================== */
"f-ch04d": {
  title: "",
  hint: "<b>点「下一步扩数」</b>：每一步都是被一个解不出的方程逼出来的——减法逼出负数，除法逼出分数，√2 逼出无理数，最后 <b>x² = −1</b> 逼出 i，数轴被撑成一个平面。<span class='hl'>每一次「这算什么数」的不适，换来的是一次功能的跃升。</span>",
  draw: function (stage) {
    var W = 760, H = 300, svg = VZ.S(stage, W, H, { grid: true });
    var C = VZ.C;
    var cx = 380, cy = 165, U = 105;
    var layer = VZ.g(svg);
    var eqTxt = VZ.txt(svg, W / 2, 44, "", { size: 14.5, fill: C.gold, anchor: "middle", weight: 700 });
    var noteTxt = VZ.txt(svg, W / 2, 258, "", { size: 12.5, fill: C.ink2, anchor: "middle" });
    var axisH = 0; /* 虚轴生长因子 */
    var stopRaf = null;

    function line(a, b) { return "M" + (cx - a * U) + " " + cy + "L" + (cx + b * U) + " " + cy; }
    function drawBase() {
      VZ.ln(layer, cx - 330, cy, cx + 330, cy, { stroke: C.ink2, "stroke-width": 1.6 });
      VZ.txt(layer, cx + 344, cy + 4, "0 →", { size: 11, fill: C.dim });
      for (var i = -3; i <= 3; i++) if (i) VZ.txt(layer, cx + i * U, cy + 22, String(i), { size: 11, fill: C.dim, anchor: "middle" });
    }
    function dot(x, lab, col) {
      VZ.circ(layer, cx + x * U, cy, 4.5, { fill: col || C.cyan });
      if (lab) VZ.txt(layer, cx + x * U, cy - 14, lab, { size: 11, fill: col || C.cyan, anchor: "middle" });
    }
    var STEPS = [
      { name: "自然数 N", eq: "2 − 3 = ？在自然数里无解", note: "只有 0,1,2,3…，减不出头。为了 2−3 有意义，扩。",
        eqc: C.red, draw: function () { drawBase(); [1, 2, 3].forEach(function (i) { dot(i, null, C.ink2); }); dot(0, "0", C.ink2); } },
      { name: "整数 Z", eq: "2 ÷ 3 = ？在整数里无解", note: "负数登场：数轴向两边无限延伸。可 2÷3 还是没有位置。",
        eqc: C.red, draw: function () { drawBase(); for (var i = -3; i <= 3; i++) dot(i, null, C.ink2); } },
      { name: "有理数 Q", eq: "√2 = ？在有理数里无解", note: "分数把数轴填得密不透风——可 √2 处偏偏是一个洞。",
        eqc: C.red, draw: function () {
          drawBase();
          for (var q = 1; q <= 7; q++) for (var p = Math.ceil(-3.2 * q); p <= 3.2 * q; p++) {
            var v = p / q; if (Math.abs(v) <= 3.15) VZ.circ(layer, cx + v * U, cy, 1.6, { fill: C.dim, opacity: .55 });
          }
          VZ.circ(layer, cx + Math.SQRT2 * U, cy, 6, { fill: "none", stroke: C.gold, "stroke-width": 2, "stroke-dasharray": "3 3" });
          VZ.txt(layer, cx + Math.SQRT2 * U, cy - 18, "√2 的洞", { size: 11, fill: C.gold, anchor: "middle" });
        } },
      { name: "实数 R", eq: "x² = −1 在实数里无解", note: "数轴现在完整了：每个点都有数。可没有任何实数平方后是负的——数轴到头了。",
        eqc: C.red, draw: function () { drawBase(); dot(Math.SQRT2, "√2", C.gold); dot(-1, null, C.ink2); dot(1, null, C.ink2); } },
      { name: "复数 C", eq: "i² = −1  ✓ 一劳永逸", note: "给 0 竖起一根垂直方向，i 就住在上面。数轴变成平面——代数基本定理：从此多项式方程不再缺根。",
        eqc: C.green, draw: function () {
          drawBase();
          dot(Math.SQRT2, "√2", C.gold);
          var g2 = U * axisH;
          if (g2 > 1) {
            VZ.ln(layer, cx, cy - g2, cx, cy + g2, { stroke: C.mag, "stroke-width": 1.6 });
            VZ.txt(layer, cx + 10, cy - g2 + 4, "虚轴", { size: 11, fill: C.mag });
            dot(0, "i", C.mag);
            VZ.circ(layer, cx, cy, U, { stroke: C.faint, "stroke-width": .8, "stroke-dasharray": "4 4", opacity: .7 });
          }
        } }
    ];
    var k = 0;
    function go(n) {
      k = VZ.clamp(n, 0, 4);
      if (stopRaf) { stopRaf(); stopRaf = null; }
      axisH = 0;
      layer.innerHTML = "";
      var st = STEPS[k];
      st.draw();
      if (k === 4) {
        stopRaf = VZ.raf(svg, function (t, dt) {
          axisH = Math.min(1.6, axisH + dt * 1.1);
          layer.innerHTML = "";
          st.draw();
          if (axisH >= 1.6 && stopRaf) { stopRaf(); stopRaf = null; }
        });
      }
      eqTxt.textContent = "【" + st.name + "】" + st.eq;
      eqTxt.setAttribute("fill", st.eqc);
      noteTxt.textContent = st.note;
      for (var i = 0; i < 5; i++) stepDots[i].setAttribute("fill", i <= k ? C.gold : C.faint);
    }
    var stepDots = [];
    for (var i = 0; i < 5; i++) stepDots.push(VZ.circ(svg, cx - 68 + i * 34, 286, 6, { fill: C.faint }));
    var ctl = VZ.box(stage, "viz-ctl");
    VZ.btn(ctl, "上一步", function () { go(k - 1); });
    VZ.btn(ctl, "下一步扩数", function () { go(k + 1); });
    go(0);
  }
},

/* ==========================================================
   f-ch04e · 单位圆上的 e^{iθ}：一个滑块转出全部复数几何
   ========================================================== */
"f-ch04e": {
  title: "",
  hint: "<b>拖动 θ 滑块</b>让点沿单位圆转：横坐标永远是 cos θ、纵坐标永远是 sin θ，所以 <b>e^{iθ} = cos θ + i sin θ</b>。<span class='hl'>转到 θ = 2π 时精确回到 1——欧拉公式 e^{2πi} = 1 说的就是「转一整圈 = 乘 1」，这也是第 8 章黎曼球面的伏笔。</span>",
  draw: function (stage) {
    var W = 760, H = 280, svg = VZ.S(stage, W, H, { grid: true });
    var C = VZ.C;
    var cx = 235, cy = 150, U = 92;
    VZ.ln(svg, cx - 200, cy, cx + 200, cy, { stroke: C.faint, "stroke-width": 1 });
    VZ.ln(svg, cx, cy - 128, cx, cy + 128, { stroke: C.faint, "stroke-width": 1 });
    VZ.circ(svg, cx, cy, U, { stroke: C.cyan, "stroke-width": 1.6 });
    VZ.txt(svg, cx + 204, cy + 4, "实轴", { size: 11, fill: C.dim });
    VZ.txt(svg, cx + 8, cy - 132, "虚轴", { size: 11, fill: C.dim });
    VZ.txt(svg, cx + U - 16, cy + 18, "1", { size: 12, fill: C.dim });
    VZ.txt(svg, cx - 8, cy - U + 18, "i", { size: 12, fill: C.dim });

    var pt = VZ.circ(svg, cx + U, cy, 8, { fill: C.gold });
    var spoke = VZ.ln(svg, cx, cy, cx + U, cy, { stroke: C.gold, "stroke-width": 2 });
    var projH = VZ.ln(svg, cx + U, cy, cx + U, cy, { stroke: C.mag, "stroke-width": 1.6, "stroke-dasharray": "5 4" });
    var projV = VZ.ln(svg, cx + U, cy, cx + U, cy, { stroke: C.cyan, "stroke-width": 1.6, "stroke-dasharray": "5 4" });
    var arcP = VZ.path(svg, "", VZ.stroke({ stroke: C.green, "stroke-width": 2 }));
    var angTxt = VZ.txt(svg, cx + 46, cy + 40, "", { size: 12, fill: C.green });
    var readout = VZ.panel(stage, { "θ": "", "e^{iθ}": "", "cos θ": "", "sin θ": "" });

    function setTh(th) {
      var px = cx + U * Math.cos(th), py = cy - U * Math.sin(th);
      pt.setAttribute("cx", px); pt.setAttribute("cy", py);
      spoke.setAttribute("x2", px); spoke.setAttribute("y2", py);
      projH.setAttribute("x1", px); projH.setAttribute("y1", py);
      projH.setAttribute("x2", px); projH.setAttribute("y2", cy);
      projV.setAttribute("x1", px); projV.setAttribute("y1", py);
      projV.setAttribute("x2", cx); projV.setAttribute("y2", py);
      var sw = th > Math.PI ? 1 : 0;
      arcP.setAttribute("d", "M" + (cx + 30) + " " + cy + "A30 30 0 " + sw + " 1 " + (cx + 30 * Math.cos(th)).toFixed(2) + " " + (cy - 30 * Math.sin(th)).toFixed(2));
      angTxt.setAttribute("x", cx + 46 * Math.cos(th / 2));
      angTxt.setAttribute("y", cy + 46 * Math.sin(th / 2) + 4);
      angTxt.textContent = "θ";
      VZ.setPanel(readout, {
        "θ": (th * 180 / Math.PI).toFixed(1) + "°",
        "e^{iθ}": Math.cos(th).toFixed(3) + " + " + Math.sin(th).toFixed(3) + "i",
        "cos θ": Math.cos(th).toFixed(3),
        "sin θ": Math.sin(th).toFixed(3)
      });
    }
    var ctl = VZ.box(stage, "viz-ctl");
    VZ.slider(ctl, { label: "θ（弧度）", value: 1, min: 0, max: 6.2832, step: 0.001,
      format: function (v) { return v.toFixed(2); }, onInput: setTh });
    var row = VZ.box(stage, "viz-ctl");
    VZ.btn(row, "θ = π/2", function () { setTh(Math.PI / 2); });
    VZ.btn(row, "θ = π", function () { setTh(Math.PI); });
    VZ.btn(row, "θ = 2π（回到 1）", function () { setTh(2 * Math.PI); });
    setTh(1);
  }
},

/* ==========================================================
   f-ch04f · 幂级数部分和：sin / cos 是这样被「算出来」的
   ========================================================== */
"f-ch04f": {
  title: "",
  hint: "<b>切换 sin / cos，再拖「项数 N」</b>：每多加一项，多项式就多贴住一段真曲线。与 1/(1+x²) 不同，sin 和 cos 的幂级数<b>处处收敛</b>——因为它们在复平面上没有奇点。<span class='hl'>阶乘在分母里压阵，再大的 x 也会被驯服。</span>",
  draw: function (stage) {
    var W = 760, H = 280, svg = VZ.S(stage, W, H, { grid: true });
    var C = VZ.C;
    var px0 = 40, px1 = 730, pyC = 142, pyS = 40; /* x 映射与 y 缩放 */
    function PX(x) { return px0 + (x + 6.8) / 13.6 * (px1 - px0); }
    function PY(y) { return pyC - VZ.clamp(y, -2.6, 2.6) * pyS; }

    VZ.ln(svg, px0, pyC, px1, pyC, { stroke: C.faint, "stroke-width": 1 });
    [[-6.283, "-2π"], [6.283, "2π"], [-3.142, "-π"], [3.142, "π"]].forEach(function (tk) {
      VZ.ln(svg, PX(tk[0]), pyC - 4, PX(tk[0]), pyC + 4, { stroke: C.faint, "stroke-width": 1 });
      VZ.txt(svg, PX(tk[0]), pyC + 20, tk[1], { size: 10, fill: C.dim, anchor: "middle" });
    });
    VZ.ln(svg, px0, PY(2.6), px1, PY(2.6), { stroke: C.faint, "stroke-width": .7, "stroke-dasharray": "3 5" });
    VZ.ln(svg, px0, PY(-2.6), px1, PY(-2.6), { stroke: C.faint, "stroke-width": .7, "stroke-dasharray": "3 5" });

    var truth = VZ.path(svg, "", VZ.stroke({ stroke: C.green, "stroke-width": 1.8, opacity: .8, "stroke-dasharray": "6 4" }));
    var part = VZ.path(svg, "", VZ.stroke({ stroke: C.cyan, "stroke-width": 2.2 }));
    var mode = "sin", N = 3;
    function fact(n) { var r = 1; for (var i = 2; i <= n; i++) r *= i; return r; }
    function partial(x) {
      var s = 0;
      if (mode === "sin") { for (var k = 1; k <= N; k++) s += Math.pow(-1, k + 1) * Math.pow(x, 2 * k - 1) / fact(2 * k - 1); }
      else { for (var k2 = 0; k2 < N; k2++) s += Math.pow(-1, k2) * Math.pow(x, 2 * k2) / fact(2 * k2); }
      return s;
    }
    var trueFn = mode === "sin" ? Math.sin : Math.cos;
    function redraw() {
      var dt = "", dp = "";
      trueFn = mode === "sin" ? Math.sin : Math.cos;
      for (var i = 0; i <= 220; i++) {
        var x = -6.8 + 13.6 * i / 220;
        dt += (i ? "L" : "M") + PX(x).toFixed(1) + " " + PY(trueFn(x)).toFixed(1);
        dp += (i ? "L" : "M") + PX(x).toFixed(1) + " " + PY(partial(x)).toFixed(1);
      }
      truth.setAttribute("d", dt);
      part.setAttribute("d", dp);
      lbl.textContent = mode === "sin"
        ? "sin x ≈ x − x³/3! + … （前 " + N + " 项）"
        : "cos x ≈ 1 − x²/2! + … （前 " + N + " 项）";
    }
    var lbl = VZ.txt(svg, W / 2, 34, "", { size: 13, fill: C.ink2, anchor: "middle" });
    var ctl = VZ.box(stage, "viz-ctl");
    VZ.chips(ctl, ["sin x", "cos x"], "sin x", function (m) { mode = m.split(" ")[0]; N = Math.max(1, N); redraw(); });
    VZ.slider(ctl, { label: "项数 N", value: 3, min: 1, max: 9, step: 1, onInput: function (v) { N = v; redraw(); } });
    redraw();
  }
},

/* ==========================================================
   f-ch04g · 共轭与模：拖 z，看镜像与 z·z̄ = |z|²
   ========================================================== */
"f-ch04g": {
  title: "",
  hint: "<b>拖动青色点 z</b>：粉色点 z̄ 永远是它关于实轴的镜像（虚部变号）。金色圆是半径 |z|——注意到 <b>z·z̄ = |z|² 永远是个正实数</b>吗？<span class='hl'>这就是复数除法「把分母变实」的机关：乘上共轭，模平方落回实轴。</span>",
  draw: function (stage) {
    var W = 760, H = 280, svg = VZ.S(stage, W, H, { grid: true });
    var C = VZ.C;
    var cx = 235, cy = 140, U = 78;
    VZ.ln(svg, cx - 200, cy, cx + 200, cy, { stroke: C.ink2, "stroke-width": 1.4 });
    VZ.ln(svg, cx, cy - 120, cx, cy + 120, { stroke: C.ink2, "stroke-width": 1.4 });
    VZ.txt(svg, cx + 206, cy + 4, "实轴 = 镜面", { size: 11, fill: C.dim });
    VZ.txt(svg, cx + 8, cy - 124, "虚轴", { size: 11, fill: C.dim });
    [1, 2].forEach(function (k) {
      VZ.circ(svg, cx + k * U, cy, 2, { fill: C.faint });
      VZ.circ(svg, cx - k * U, cy, 2, { fill: C.faint });
      VZ.circ(svg, cx, cy + k * U, 2, { fill: C.faint });
      VZ.circ(svg, cx, cy - k * U, 2, { fill: C.faint });
      VZ.txt(svg, cx + k * U - 6, cy + 16, String(k), { size: 10, fill: C.dim });
    });

    var circMod = VZ.circ(svg, cx, cy, U, { stroke: C.gold, "stroke-width": 1.4, "stroke-dasharray": "5 5" });
    var lineZ = VZ.ln(svg, cx, cy, cx + U * .6, cy - U * .6, { stroke: C.cyan, "stroke-width": 2 });
    var lineB = VZ.ln(svg, cx, cy, cx + U * .6, cy + U * .6, { stroke: C.mag, "stroke-width": 2 });
    var mirrorD = VZ.ln(svg, cx + U * .6, cy - U * .6, cx + U * .6, cy + U * .6, { stroke: C.ink2, "stroke-width": 1, "stroke-dasharray": "3 4", opacity: .7 });
    var hz = VZ.circ(svg, cx + U * .6, cy - U * .6, 9, { fill: "rgba(12,8,32,.9)", stroke: C.cyan, "stroke-width": 2.4, style: "cursor:grab" });
    var hb = VZ.circ(svg, cx + U * .6, cy + U * .6, 7, { fill: C.mag, opacity: .9 });
    var labZ = VZ.txt(svg, 0, 0, "z", { size: 13, fill: C.cyan, weight: 700, anchor: "middle" });
    var labB = VZ.txt(svg, 0, 0, "z̄", { size: 13, fill: C.mag, weight: 700, anchor: "middle" });
    var readout = VZ.panel(stage, { "z": "", "z̄": "", "z·z̄": "", "|z|": "" });
    var re = .6, im = -.62;

    function redraw() {
      var X = cx + re * U, Y = cy - im * U;
      var Xb = cx + re * U, Yb = cy + im * U;
      hz.setAttribute("cx", X); hz.setAttribute("cy", Y);
      hb.setAttribute("cx", Xb); hb.setAttribute("cy", Yb);
      lineZ.setAttribute("x2", X); lineZ.setAttribute("y2", Y);
      lineB.setAttribute("x2", Xb); lineB.setAttribute("y2", Yb);
      mirrorD.setAttribute("x1", X); mirrorD.setAttribute("y1", Y);
      mirrorD.setAttribute("x2", Xb); mirrorD.setAttribute("y2", Yb);
      var m = Math.hypot(re, im);
      circMod.setAttribute("r", m * U);
      labZ.setAttribute("x", X + (re >= 0 ? 16 : -16));
      labZ.setAttribute("y", Y - 10);
      labB.setAttribute("x", Xb + (re >= 0 ? 16 : -16));
      labB.setAttribute("y", Yb + 20);
      VZ.setPanel(readout, {
        "z": re.toFixed(2) + (im >= 0 ? " + " : " − ") + Math.abs(im).toFixed(2) + "i",
        "z̄": re.toFixed(2) + (im <= 0 ? " + " : " − ") + Math.abs(im).toFixed(2) + "i",
        "z·z̄": (re * re + im * im).toFixed(3) + "（正实数！）",
        "|z|": m.toFixed(3)
      });
    }
    VZ.drag(svg, hz, W, H, function (x, y) {
      re = VZ.clamp((x - cx) / U, -2.4, 2.4);
      im = VZ.clamp(-(y - cy) / U, -1.4, 1.4);
      redraw();
    });
    redraw();
    VZ.txt(svg, 430, 232, "虚部变号 = 沿实轴照镜子；乘法里则是模相乘、角反号。", { size: 11.5, fill: C.dim });
  }
},

});
