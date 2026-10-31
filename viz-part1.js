/* ============================================================
   viz-part1.js — 图示第一批
   含：6 个区域导图 + 两个章节范例（f-ch01 / f-ch04）
   这两个范例同时是后续章节图示的**样式基准**：
   · 一律用 VZ.C 里的颜色，不写死色值
   · 深空底、象牙白钢笔线；重点用 cyan / mag / gold
   · 每张图至少有一处动效或可拖拽交互
   ============================================================ */
VZ.define({

/* ==========================================================
   区域一 · 数学真理 vs 物理真理
   ========================================================== */
"f-reg-math": {
  title: "区域一导图 · 两种真理，两套判决程序",
  hint: "左边那条链一旦接通就<b>永久成立</b>；右边那条链永远接不通——它随时可能被新证据推翻。全书后面每一步都依赖这个区别。 " + "整本书只处理<span class='hl'>第一个谜</span>：为什么柏拉图式的数学世界，偏偏与物理世界严丝合缝？谜②（物质如何产生心智）与谜③（心智何以通达数学）作者明确说他不解——而它们决定了这本书的边界。",
  draw: function (stage) {
    var W = 760, H = 300, svg = VZ.S(stage, W, H, {});
    var C = VZ.C;
    var arrow = VZ.arrowDef(svg, VZ.uid("ar"), C.ink2);

    function chain(x, title, color, steps, loopBack) {
      VZ.txt(svg, x, 30, title, { size: 17, fill: color, weight: 700 });
      var y = 58, bw = 300, bh = 40, gap = 22;
      steps.forEach(function (s, i) {
        var yy = y + i * (bh + gap);
        VZ.card(svg, x, yy, bw, bh, { stroke: "rgba(255,255,255,.14)", fill: "rgba(255,255,255,.045)" });
        VZ.txt(svg, x + 14, yy + 25, s[0], { size: 13.5, fill: C.ink });
        if (s[1]) VZ.txt(svg, x + bw - 12, yy + 25, s[1], { size: 11.5, fill: color, anchor: "end" });
      });
      var p = VZ.path(svg, "M" + (x + bw / 2) + " " + (y + bh) + "V" + (y + (steps.length - 1) * (bh + gap)), VZ.stroke({ stroke: color, "stroke-width": 1.4, "stroke-dasharray": "5 5", opacity: .75 }));
      VZ.travel(svg, "M" + (x + bw / 2) + " " + (y + bh) + "V" + (y + (steps.length - 1) * (bh + gap)), { color: color, dur: 2.6, count: 2, r: 4 });
      if (loopBack) {
        var x2 = x + bw + 22, yTop = y + 20, yBot = y + (steps.length - 1) * (bh + gap) + 20;
        VZ.path(svg, "M" + (x + bw) + " " + yBot + "h34V" + yTop + "h-34", VZ.stroke({ stroke: color, "stroke-width": 1.4, "stroke-dasharray": "5 5", opacity: .75 }));
        VZ.path(svg, "M" + (x + bw + 22) + " " + yTop + "l-8 -5v10z", { fill: color });
        VZ.travel(svg, "M" + (x + bw) + " " + yBot + "h34V" + yTop + "h-34", { color: color, dur: 2.2, count: 1, r: 4 });
      }
    }

    chain(30, "数学真理 · 判决靠证明", C.cyan, [
      ["公理与定义", "起点"],
      ["演绎推理", "保真传递"],
      ["定理成立", "永久"],
      ["一个反例", "整条链作废"]
    ], false);

    chain(430, "物理真理 · 判决靠实验", C.gold, [
      ["观测异常", "起点"],
      ["猜测性理论", "可错"],
      ["实验判决", "迄今未推翻"],
      ["新观测", "回到起点"]
    ], true);

    VZ.path(svg, "M30 286H730", { stroke: C.faint, "stroke-width": .8, "stroke-dasharray": "3 6" });
  }
},

/* ==========================================================
   区域二 · 复数的几何
   ========================================================== */
"f-reg-complex": {
  title: "区域二导图 · 一次乘法，就是一次旋转加伸缩",
  hint: "拖动右边的滑杆改变 <b>x</b>，看 1/(1+x²) 的幂级数在哪一点开始失效——失效的原因是复平面上有个奇点，而你在实数轴上根本看不见它。 " + "函数 1/(1+x²) 在实数轴上处处良好，没有一点毛病；可它的幂级数却只在 |x|&lt;1 收敛。<span class='hl'>答案不在实数轴上看得到的地方</span>——是复平面上的 ±i 在作祟。区域二的整条弧线就是为了让你习惯「到复数里去问」。",
  draw: function (stage) {
    var W = 760, H = 280, svg = VZ.S(stage, W, H, { grid: true });
    var C = VZ.C;

    /* 左：单位圆上的旋转 */
    var cx = 190, cy = 150, R = 96;
    VZ.circ(svg, cx, cy, R, { stroke: C.faint, "stroke-width": 1 });
    VZ.ln(svg, cx - R - 22, cy, cx + R + 22, cy, { stroke: C.faint, "stroke-width": .8 });
    VZ.ln(svg, cx, cy - R - 22, cx, cy + R + 22, { stroke: C.faint, "stroke-width": .8 });
    VZ.txt(svg, cx + R + 26, cy + 4, "Re", { size: 11, fill: C.dim });
    VZ.txt(svg, cx + 6, cy - R - 14, "Im", { size: 11, fill: C.dim });
    var zDot = VZ.circ(svg, cx + R, cy, 6, { fill: C.cyan });
    var zLine = VZ.path(svg, "M" + cx + " " + cy + "L" + (cx + R) + " " + cy, VZ.stroke({ stroke: C.cyan, "stroke-width": 2 }));
    var trail = VZ.path(svg, "", VZ.stroke({ stroke: C.mag, "stroke-width": 1.4, opacity: .5, "stroke-dasharray": "4 4" }));
    var zLbl = VZ.txt(svg, cx + R + 10, cy - 8, "z", { size: 13, fill: C.cyan, weight: 700 });
    VZ.txt(svg, cx, cy + R + 40, "乘 i → 转 90°，模不变", { size: 12.5, fill: C.ink2, anchor: "middle" });
    var hist = [];
    VZ.raf(svg, function (t) {
      var th = t * 0.9;
      var x = cx + R * Math.cos(th), y = cy - R * Math.sin(th);
      zDot.setAttribute("cx", x); zDot.setAttribute("cy", y);
      zLine.setAttribute("d", "M" + cx + " " + cy + "L" + x + " " + y);
      zLbl.setAttribute("x", x + 10); zLbl.setAttribute("y", y - 8);
      hist.push([x, y]); if (hist.length > 70) hist.shift();
      trail.setAttribute("d", hist.map(function (p, i) { return (i ? "L" : "M") + p[0].toFixed(1) + " " + p[1].toFixed(1); }).join(""));
      var z2 = { x: cx + R * Math.cos(2 * th), y: cy - R * Math.sin(2 * th) };
      fz2.setAttribute("cx", z2.x); fz2.setAttribute("cy", z2.y);
    });
    var fz2 = VZ.circ(svg, cx - R, cy, 5, { fill: C.mag, opacity: .85 });
    VZ.txt(svg, cx - 40, cy - R - 40, "z² 转得是两倍角", { size: 11.5, fill: C.mag });

    /* 右：收敛圆 */
    var ox = 500, oy = 150, R2 = 74;
    VZ.circ(svg, ox, oy, R2, { stroke: C.gold, "stroke-width": 1.4, "stroke-dasharray": "5 5" });
    VZ.ln(svg, ox - 130, oy, ox + 130, oy, { stroke: C.ink2, "stroke-width": 1.2 });
    VZ.ln(svg, ox, oy - 110, ox, oy + 110, { stroke: C.ink2, "stroke-width": 1.2 });
    VZ.txt(svg, ox + 134, oy + 4, "实轴（你能看见的世界）", { size: 11, fill: C.dim });
    var pole1 = VZ.circ(svg, ox, oy - R2, 6, { fill: C.red });
    var pole2 = VZ.circ(svg, ox, oy + R2, 6, { fill: C.red });
    VZ.txt(svg, ox + 10, oy - R2 + 4, "奇点 i", { size: 11.5, fill: C.red });
    VZ.txt(svg, ox + 10, oy + R2 + 4, "奇点 −i", { size: 11.5, fill: C.red });
    VZ.txt(svg, ox - R2, oy + 20, "|x|=1", { size: 11, fill: C.gold, anchor: "end" });
    var seg = VZ.path(svg, "M" + (ox - R2) + " " + oy + "h" + (2 * R2), VZ.stroke({ stroke: C.green, "stroke-width": 4, opacity: .8 }));
    var pReadout = VZ.txt(svg, ox, oy + R2 + 40, "收敛", { size: 13, fill: C.green, anchor: "middle", weight: 700 });
    var xMark = VZ.circ(svg, ox, oy, 7, { fill: C.ink });
    VZ.txt(svg, ox, oy - 116, "1/(1+x²) 的幂级数", { size: 12.5, fill: C.ink, anchor: "middle" });
    VZ.raf(svg, function (t) {
      var xv = 1.65 * Math.sin(t * 0.8);
      xMark.setAttribute("cx", ox + xv * R2);
      var ok = Math.abs(xv) < 1;
      pReadout.textContent = ok ? "收敛（|x| < 1）" : "发散（|x| > 1）";
      pReadout.setAttribute("fill", ok ? C.green : C.red);
      seg.setAttribute("opacity", ok ? .85 : .25);
    });
  }
},

/* ==========================================================
   区域三 · 流形、联络与曲率
   ========================================================== */
"f-reg-manifold": {
  title: "区域三导图 · 曲率 = 绕一圈回来后方向对不上",
  hint: "球面上把一个箭头沿闭路径<b>平行搬运</b>一圈，回来时它转过的角度就是所围区域的高斯曲率总量。流形本身没有天然的「平行」——必须先给一个联络。 " + "第 14 章是全书的技术枢纽：<span class='hl'>流形上没有天然的微分</span>。必须先额外给一个联络（connection），才谈得上「把矢量搬到隔壁点」。这也是为什么第 15 章的规范场能直接长在这个框架上——纤维丛的联络，就是物理学家口中的规范势。",
  draw: function (stage) {
    var W = 760, H = 300, svg = VZ.S(stage, W, H, { grid: true });
    var C = VZ.C;
    var cx = 230, cy = 155, R = 100;

    /* 球面（正投影） */
    var sph = VZ.grad(svg, VZ.uid("sp"), [[0, "#2a2260"], [1, "#161036"]], true);
    VZ.circ(svg, cx, cy, R, { fill: sph, stroke: C.faint, "stroke-width": 1.2 });
    for (var la = -60; la <= 60; la += 30) {
      var yy = cy - R * Math.sin(la * Math.PI / 180), rr = R * Math.cos(la * Math.PI / 180);
      VZ.path(svg, "M" + (cx - rr) + " " + yy + "A" + rr + " " + (rr * .22) + " 0 0 0 " + (cx + rr) + " " + yy, { stroke: C.faint, "stroke-width": .7, opacity: .65 });
      VZ.path(svg, "M" + (cx - rr) + " " + yy + "A" + rr + " " + (rr * .22) + " 0 0 1 " + (cx + rr) + " " + yy, { stroke: C.faint, "stroke-width": .7, opacity: .3 });
    }
    for (var lo = -60; lo <= 60; lo += 30) {
      var rx2 = R * Math.abs(Math.cos(lo * Math.PI / 180)) * 0.86;
      VZ.path(svg, "M" + cx + " " + (cy - R) + "C" + (cx + rx2) + " " + (cy - R / 2) + " " + (cx + rx2) + " " + (cy + R / 2) + " " + cx + " " + (cy + R), { stroke: C.faint, "stroke-width": .7, opacity: .45 });
      VZ.path(svg, "M" + cx + " " + (cy - R) + "C" + (cx - rx2) + " " + (cy - R / 2) + " " + (cx - rx2) + " " + (cy + R / 2) + " " + cx + " " + (cy + R), { stroke: C.faint, "stroke-width": .7, opacity: .45 });
      VZ.path(svg, "M" + (cx - R) + " " + cy + "C" + (cx - R / 2) + " " + (cy - rx2 * .28) + " " + (cx + R / 2) + " " + (cy - rx2 * .28) + " " + (cx + R) + " " + cy, { stroke: C.faint, "stroke-width": .6, opacity: .3 });
    }

    /* 闭合回路（球面上的纬线圈） */
    var ly = cy - 26, lr = R * Math.cos(Math.asin(26 / R)) * 0.98;
    VZ.path(svg, "M" + (cx - lr) + " " + ly + "A" + lr + " " + (lr * .3) + " 0 0 0 " + (cx + lr) + " " + ly + "A" + lr + " " + (lr * .3) + " 0 0 0 " + (cx - lr) + " " + ly, VZ.stroke({ stroke: C.mag, "stroke-width": 2, "stroke-dasharray": "7 5" }));

    /* 出发时的方向（幽灵箭头，用来对比） */
    VZ.path(svg, "M" + (cx - lr) + " " + ly + "L" + (cx - lr) + " " + (ly - 40), VZ.stroke({ stroke: C.ink, "stroke-width": 2, opacity: .38, "stroke-dasharray": "4 4" }));
    VZ.txt(svg, cx - lr - 8, ly - 46, "出发方向", { size: 11, fill: C.ink2, anchor: "middle", opacity: .7 });

    /* 搬运中的矢量：绕行一周后转过一个和乐角，回不到原方向 */
    var HOLO = 1.15;
    var vg = VZ.g(svg);
    var vec = VZ.path(vg, "", VZ.stroke({ stroke: C.cyan, "stroke-width": 2.8 }));
    var head = VZ.path(vg, "", { fill: C.cyan });
    VZ.raf(svg, function (t) {
      var th = (t * 0.62) % (Math.PI * 2);
      var px = cx + lr * Math.cos(-th), py = ly + (lr * .3) * Math.sin(-th);
      var ang = -Math.PI / 2 + HOLO * (th / (Math.PI * 2));
      var L = 38;
      var hx = px + L * Math.cos(ang), hy = py + L * Math.sin(ang);
      vec.setAttribute("d", "M" + px + " " + py + "L" + hx + " " + hy);
      head.setAttribute("d", "M" + (hx + 8 * Math.cos(ang)) + " " + (hy + 8 * Math.sin(ang)) +
        "l" + (-10 * Math.cos(ang) - 4.5 * Math.sin(ang)) + " " + (-10 * Math.sin(ang) + 4.5 * Math.cos(ang)) +
        "l" + (-10 * Math.cos(ang) + 4.5 * Math.sin(ang)) + " " + (-10 * Math.sin(ang) - 4.5 * Math.cos(ang)) + "z");
    });
    /* 和乐角的扇形示意 */
    VZ.path(svg, "M" + (cx - lr) + " " + ly + "m0 -46A46 46 0 0 1 " + (cx - lr + 46 * Math.sin(HOLO)) + " " + (ly - 46 * Math.cos(HOLO)),
      VZ.stroke({ stroke: C.mag, "stroke-width": 1.2, opacity: .8 }));
    VZ.txt(svg, cx - lr + 52, ly - 44, "和乐角", { size: 11, fill: C.mag });

    /* 右侧说明块 */
    VZ.card(svg, 400, 40, 330, 108, { stroke: "rgba(255,255,255,.12)" });
    VZ.txt(svg, 416, 64, "和乐（holonomy）", { size: 14.5, fill: C.mag, weight: 700 });
    VZ.para(svg, 416, 86, "回到起点时方向与出发时的夹角。它不为零，正是曲率存在的直接证据；它为零，才是「平坦」。", { size: 12.5, per: 25, lh: 20 });
    VZ.card(svg, 400, 162, 330, 108, { stroke: "rgba(255,255,255,.12)" });
    VZ.txt(svg, 416, 186, "先后顺序", { size: 14.5, fill: C.cyan, weight: 700 });
    VZ.para(svg, 416, 208, "流形 → 丛 → 联络 → 平行移动 → 和乐 → 曲率 → 度规给出距离与角度。顺序不能倒。", { size: 12.5, per: 25, lh: 20 });
  }
},

/* ==========================================================
   区域四 · 时空结构
   ========================================================== */
"f-reg-spacetime": {
  title: "区域四导图 · 光锥是你唯一能说话的边界",
  hint: "把鼠标移到图上拖动，观察事件 A 的<b>将来光锥</b>：锥内的世界线才可能与 A 有因果联系，锥外的事件与 A 无关——不管技术多先进。 " + "第 17 章把时空结构拆成四级台阶：亚里士多德（绝对静止）→ 伽利略（相对匀速）→ 牛顿/卡当（绝对时间 + 引力作为一种力）→ 闵可夫斯基（时空合一，光锥定因果）。<span class='hl'>拖动 A 试试</span>——光锥不是比喻，它是逻辑边界：锥外的事件与原点绝对无关，与技术水平无关。",
  draw: function (stage) {
    var W = 760, H = 320, svg = VZ.S(stage, W, H, { grid: true });
    var C = VZ.C;
    var ox = 380, oy = 168, S = 1;

    VZ.ln(svg, 40, oy, 720, oy, { stroke: C.faint, "stroke-width": 1 });
    VZ.ln(svg, ox, 26, ox, 300, { stroke: C.faint, "stroke-width": 1 });
    VZ.txt(svg, 704, oy - 8, "空间 x", { size: 11, fill: C.dim, anchor: "end" });
    VZ.txt(svg, ox + 8, 34, "时间 t", { size: 11, fill: C.dim });

    /* 光锥 */
    var cone = VZ.grad(svg, VZ.uid("cn"), [[0, C.cyan, .30], [1, C.cyan, .02]], true);
    VZ.poly(svg, [[ox, oy], [ox + 150, oy - 150], [ox - 150, oy - 150]], { fill: cone, close: true });
    VZ.poly(svg, [[ox, oy], [ox + 150, oy + 150], [ox - 150, oy + 150]], { fill: cone, opacity: .45, close: true });
    VZ.path(svg, "M" + (ox - 150) + " " + (oy - 150) + "L" + ox + " " + oy + "L" + (ox + 150) + " " + (oy - 150), VZ.stroke({ stroke: C.cyan, "stroke-width": 1.8 }));
    VZ.path(svg, "M" + (ox - 150) + " " + (oy + 150) + "L" + ox + " " + oy + "L" + (ox + 150) + " " + (oy + 150), VZ.stroke({ stroke: C.cyan, "stroke-width": 1.4, opacity: .55 }));
    VZ.txt(svg, ox + 158, oy - 152, "将来光锥", { size: 11.5, fill: C.cyan });
    VZ.txt(svg, ox + 158, oy + 158, "过去光锥", { size: 11.5, fill: C.cyan, opacity: .6 });

    /* A 与 B：A 在锥内、B 在锥外（A 可拖动） */
    var A = [ox - 26, oy - 58], B = [ox + 118, oy - 138];
    var aDot = VZ.circ(svg, A[0], A[1], 7, { fill: C.gold });
    var aLbl = VZ.txt(svg, A[0] - 12, A[1] - 10, "A（我发了一束光）", { size: 11.5, fill: C.gold, anchor: "end" });
    var bDot = VZ.circ(svg, B[0], B[1], 6, { fill: C.red });
    var bLbl = VZ.txt(svg, B[0] + 10, B[1] - 10, "B（与 A 无因果）", { size: 11.5, fill: C.red });
    VZ.circ(svg, A[0], A[1], 16, { stroke: C.gold, "stroke-width": 1, opacity: .4, "stroke-dasharray": "3 3" });

    /* 世界线（惯性粒子） */
    VZ.path(svg, "M" + (ox - 40) + " 296L" + (ox + 8) + " 34", VZ.stroke({ stroke: C.ink, "stroke-width": 2 }));
    VZ.txt(svg, ox + 14, 44, "惯性世界线", { size: 11, fill: C.ink2 });
    /* 加速世界线（双曲） */
    VZ.path(svg, "M" + (ox - 30) + " 300Q" + (ox + 60) + " " + oy + " " + (ox - 30) + " 36", VZ.stroke({ stroke: C.violet, "stroke-width": 2, "stroke-dasharray": "6 4" }));
    VZ.txt(svg, ox + 74, 116, "匀加速者", { size: 11, fill: C.violet });

    VZ.travel(svg, "M" + (ox - 40) + " 296L" + (ox + 8) + " 34", { color: C.ink, dur: 3.6, r: 4 });
    VZ.travel(svg, "M" + (ox - 150) + " " + (oy + 150) + "L" + (ox + 150) + " " + (oy - 150), { color: C.cyan, dur: 2.4, r: 3.5 });

    /* 拖拽 A 观察因果 */
    var hTxt = VZ.txt(svg, 40, oy - 132, "拖动金色点 A，看它相对光锥的位置", { size: 12.5, fill: C.gold });
    var ray = VZ.path(svg, "", VZ.stroke({ stroke: C.gold, "stroke-width": 1.2, "stroke-dasharray": "4 4", opacity: .75 }));
    var reach = VZ.circ(svg, A[0], A[1], 4, { fill: "none", stroke: C.gold, "stroke-width": 1, opacity: .5 });
    var dragging = null;
    VZ.drag(svg, svg, W, H, function (x, y, phase) {
      if (phase === "start") {
        var dA = Math.hypot(x - A[0], y - A[1]), dB = Math.hypot(x - B[0], y - B[1]);
        dragging = (Math.min(dA, dB) > 52) ? null : (dA < dB ? "A" : "B");
      }
      if (!dragging) return;
      var P = dragging === "A" ? A : B;
      P[0] = VZ.clamp(x, 46, 714); P[1] = VZ.clamp(y, 30, 296);
      if (dragging === "A") {
        aDot.setAttribute("cx", A[0]); aDot.setAttribute("cy", A[1]);
        aLbl.setAttribute("x", A[0] - 12); aLbl.setAttribute("y", A[1] - 10);
        reach.setAttribute("cx", A[0]); reach.setAttribute("cy", A[1]);
      } else {
        bDot.setAttribute("cx", B[0]); bDot.setAttribute("cy", B[1]);
        bLbl.setAttribute("x", B[0] + 10); bLbl.setAttribute("y", B[1] - 10);
      }
      /* 因果判定：只看 A */
      var dx = A[0] - ox, dy = A[1] - oy;
      var inside = Math.abs(dx) <= Math.abs(dy);           /* 在光锥内（含锥面）*/
      var future = dy < 0;
      hTxt.textContent = (inside && future)
        ? "A 在将来光锥内 → 与原点事件有因果联系"
        : inside ? "A 在过去光锥内 → 可能是原点事件的因"
          : "A 已滑出光锥 → 与原点事件完全无因果";
      hTxt.setAttribute("fill", inside ? C.green : C.red);
      ray.setAttribute("d", inside ? "M" + ox + " " + oy + "L" + A[0] + " " + A[1] : "");
      VZ.setPanel(info, { "A 相对原点": (inside ? "类时" : "类空"), "判定": inside ? "可有因果" : "绝无因果", "光锥张角": "45°" });
      if (phase === "end") dragging = null;
    });
    var info = VZ.panel(stage, { "A 相对原点": "类时", "判定": "可有因果", "光锥张角": "45°" });
    /* B 的说明：B 无法被拖出光锥（它本来就在外面） */
  }
},

/* ==========================================================
   区域五 · 量子世界
   ========================================================== */
"f-reg-quantum": {
  title: "区域五导图 · 波函数是整体的，而 R 不在 U 里",
  hint: "两条缝的波前互相干涉，屏幕上逐渐累积出条纹。但请注意：<b>单个电子的落点无法预测</b>，能预测的只是概率分布——这就是 |ψ|²，也是全书最深的裂缝所在。 " + "第 21–26 章的骨架：<span class='hl'>U（幺正演化，确定、线性、可逆）</span>与 <span class='hl'>R（态缩减，随机、非线性）</span>。第 22 章的 §22.2 直接把矛盾摆在标题里——U 的线性对 R 构成严重问题。第 29–30 章他给出自己的猜想：引力可能才是 R 的来源。",
  draw: function (stage) {
    var W = 760, H = 330, svg = VZ.S(stage, W, H, {});
    var C = VZ.C;
    var wallX = 260, screenX = 660, top = 40, bot = 290, midY = (top + bot) / 2;

    VZ.card(svg, 20, top, 150, bot - top, { stroke: C.faint });
    VZ.txt(svg, 95, top + 22, "电子源", { size: 13, fill: C.ink, anchor: "middle" });
    VZ.travel(svg, "M95 " + midY + "H" + (wallX - 4), { color: C.cyan, dur: 1.6, count: 3, r: 3.5 });

    VZ.ln(svg, wallX, top, wallX, midY - 34, { stroke: C.ink, "stroke-width": 4 });
    VZ.ln(svg, wallX, midY - 18, wallX, midY + 18, { stroke: C.ink, "stroke-width": 4 });
    VZ.ln(svg, wallX, midY + 34, wallX, bot, { stroke: C.ink, "stroke-width": 4 });
    VZ.txt(svg, wallX - 8, top - 8, "双缝", { size: 12.5, fill: C.ink, anchor: "end" });

    VZ.ln(svg, screenX, top, screenX, bot, { stroke: C.ink2, "stroke-width": 3 });
    VZ.txt(svg, screenX + 10, top + 16, "屏幕", { size: 12.5, fill: C.ink2 });

    /* 两条缝发出的同心波前 */
    var s1 = [wallX, midY - 26], s2 = [wallX, midY + 26];
    var waves = [];
    for (var k = 0; k < 3; k++) {
      waves.push(VZ.circ(svg, s1[0], s1[1], 10, { stroke: C.cyan, "stroke-width": 1, opacity: .5 }));
      waves.push(VZ.circ(svg, s2[0], s2[1], 10, { stroke: C.mag, "stroke-width": 1, opacity: .5 }));
    }
    VZ.raf(svg, function (t) {
      waves.forEach(function (w, i) {
        var s = i % 2 === 0 ? s1 : s2;
        var ph = ((t * 46 + i * 30) % 130);
        var spread = 1 + ph / 130 * 6;
        var rr = ph * 0.62 * spread;
        w.setAttribute("r", rr);
        w.setAttribute("cx", s[0] + rr * 0.55);
        w.setAttribute("cy", s[1]);
        w.setAttribute("opacity", VZ.clamp(0.55 * (1 - ph / 130), 0, 1));
      });
    });

    /* 屏幕上的干涉图样 */
    var d = 26, lam = 22, L = screenX - wallX;
    var patt = VZ.g(svg);
    for (var yy = top; yy < bot; yy += 2) {
      var t1 = Math.hypot(screenX - s1[0], yy - s1[1]), t2 = Math.hypot(screenX - s2[0], yy - s2[1]);
      var I = Math.pow(Math.cos(Math.PI * (t1 - t2) / lam), 2);
      VZ.ln(patt, screenX + 4, yy, screenX + 4 + 34 * I + 1, yy, { stroke: C.gold, "stroke-width": 2, opacity: .35 + .6 * I });
    }
    var hits = VZ.g(svg);
    var counts = {};
    VZ.raf(svg, function (t, ms) {
      var n = Math.floor(t * 14);
      while (counts.n === undefined || counts.n < n) {
        counts.n = (counts.n || 0) + 1;
        var y = top + Math.random() * (bot - top);
        var tt1 = Math.hypot(screenX - s1[0], y - s1[1]), tt2 = Math.hypot(screenX - s2[0], y - s2[1]);
        var p = Math.pow(Math.cos(Math.PI * (tt1 - tt2) / lam), 2);
        if (Math.random() < p) {
          VZ.circ(hits, screenX + 6 + Math.random() * 6, y, 1.8, { fill: C.gold });
          if (hits.childNodes.length > 420) hits.removeChild(hits.firstChild);
        }
      }
    });

    VZ.card(svg, 20, bot + 6, 720, 30, { stroke: "rgba(255,255,255,.1)" });
    VZ.txt(svg, 32, bot + 26, "落后 28 格", { size: 12, fill: C.dim });
    VZ.txt(svg, 380, bot + 26, "条纹间距 ≈ λL/d", { size: 12, fill: C.gold, anchor: "middle" });
  }
},

/* ==========================================================
   区域六 · 量子引力
   ========================================================== */
"f-reg-gravity": {
  title: "区域六导图 · 黑洞蒸发的熵，写在面积上",
  hint: "共形图中的对角线是无穷远，波浪线是奇点，虚线是视界。霍金辐射让黑洞缓慢蒸发——而它的熵 <b>S = kA/4</b> 正比于<b>面积</b>而非体积，这是全书通向全息原理的线索。 " + "第 27–34 章是全书最没有定论的部分，也是作者投入最多的部分。读这几章的正确姿势不是记结论，而是<span class='hl'>分清哪些是已被实验支持的，哪些是他个人的审美判断</span>——第 34 章 §34.3 专门讨论「时尚在物理理论中的作用」，就是提醒你这件事。",
  draw: function (stage) {
    var W = 760, H = 340, svg = VZ.S(stage, W, H, {});
    var C = VZ.C;
    var cx = 240, oy = 180, half = 132;

    /* 共形图：两个三角（过去/将来零无穷） */
    VZ.path(svg, "M" + (cx - half) + " " + (oy - half) + "L" + cx + " " + oy + "L" + (cx + half) + " " + (oy - half), VZ.stroke({ stroke: C.ink2, "stroke-width": 2 }));
    VZ.path(svg, "M" + (cx - half) + " " + (oy + half) + "L" + cx + " " + oy + "L" + (cx + half) + " " + (oy + half), VZ.stroke({ stroke: C.ink2, "stroke-width": 2 }));
    VZ.txt(svg, cx, 34, "无穷远（共形边界）", { size: 11.5, fill: C.dim, anchor: "middle" });

    /* 奇点：波浪线 */
    var wav = "M" + (cx - 48) + " " + (oy - 62);
    for (var i = 0; i < 10; i++) wav += "q6 " + (i % 2 ? 7 : -7) + " 12 0";
    VZ.path(svg, wav, VZ.stroke({ stroke: C.red, "stroke-width": 2.4 }));
    VZ.txt(svg, cx - 52, oy - 70, "奇点", { size: 11.5, fill: C.red, anchor: "end" });

    /* 视界 */
    VZ.path(svg, "M" + (cx - 52) + " " + (oy - 50) + "L" + (cx - 52) + " " + (oy + 62), VZ.stroke({ stroke: C.gold, "stroke-width": 1.6, "stroke-dasharray": "6 5" }));
    VZ.path(svg, "M" + (cx + 52) + " " + (oy - 50) + "L" + (cx + 52) + " " + (oy + 62), VZ.stroke({ stroke: C.gold, "stroke-width": 1.6, "stroke-dasharray": "6 5" }));
    VZ.txt(svg, cx + 58, oy + 10, "事件视界", { size: 11.5, fill: C.gold });

    /* 坍缩物质 */
    VZ.path(svg, "M" + (cx - 140) + " " + (oy + 130) + "L" + (cx - 40) + " " + (oy - 46) + "L" + (cx + 40) + " " + (oy - 46) + "L" + (cx + 140) + " " + (oy + 130), VZ.stroke({ stroke: C.violet, "stroke-width": 1.6, opacity: .8 }));
    VZ.txt(svg, cx - 150, oy + 142, "坍缩物质", { size: 11, fill: C.violet, anchor: "middle" });

    /* 霍金辐射 */
    for (var r = 0; r < 7; r++) {
      (function (r) {
        var p = VZ.path(svg, "M" + (cx + 56 + r * 4) + " " + (oy + 30 - r * 6) + "Q" + (cx + 110 + r * 22) + " " + (oy - 30 - r * 8) + " " + (cx + 150) + " " + (oy - 66 - r * 8), VZ.stroke({ stroke: C.cyan, "stroke-width": 1.3, opacity: .6, "stroke-dasharray": "3 4" }));
        VZ.travel(svg, "M" + (cx + 56 + r * 4) + " " + (oy + 30 - r * 6) + "Q" + (cx + 110 + r * 22) + " " + (oy - 30 - r * 8) + " " + (cx + 150) + " " + (oy - 66 - r * 8), { color: C.cyan, dur: 2.2, delay: r * .34, count: 1, r: 3 });
      })(r);
    }
    VZ.txt(svg, cx + 152, oy - 120, "霍金辐射", { size: 11.5, fill: C.cyan });

    /* 右侧：熵公式 */
    VZ.card(svg, 430, 60, 300, 96, { stroke: "rgba(255,255,255,.13)", fill: "rgba(255,214,92,.06)" });
    VZ.txt(svg, 448, 92, "S = k·A / 4", { size: 24, fill: C.gold, weight: 700, "font-family": "Georgia,serif" });
    VZ.para(svg, 448, 118, "熵正比于视界面积，而不是正比于体积。这一条把引力和信息论缝在了一起。", { size: 12.5, per: 23, lh: 19 });

    VZ.card(svg, 430, 172, 300, 96, { stroke: "rgba(255,255,255,.12)" });
    VZ.txt(svg, 448, 196, "作者的三个自评", { size: 13.5, fill: C.mag, weight: 700 });
    VZ.para(svg, 448, 216, "弦论：要撒一大把盐；圈变量：自旋网络是最扎实的部分；扭量：明确非主流，但他认为方向对。", { size: 12, per: 24, lh: 18 });
  }
},

/* ==========================================================
   第 1 章 · 三个世界与三个深谜（可交互）
   ========================================================== */
"f-ch01": {
  title: "三个世界，三个谜——这本书只碰第一个",
  hint: "点击任意一条连线或任意一个世界，看它对应的谜是什么。谜①是全书 1124 页的全部内容；谜②③作者说他不解，但它们是这本书的边界条件。 " + "§1.4 的说法是：三个世界之间存在三个深谜，而本书<b>只处理第一个</b>。为什么？因为只有第一个谜有可操作的数学工具；后两个谜他反复强调自己「不知道答案」。这也是为什么全书最后一章的标题不是答案，而是一个问句——<span class='hl'>What is reality?</span>",
  draw: function (stage) {
    var W = 760, H = 500, svg = VZ.S(stage, W, H, { grid: true });
    var C = VZ.C;
    var nodes = {
      plat: { x: 380, y: 84, r: 54, name: "柏拉图数学世界", sub: "永恒 · 精确 · 无时间", c: C.cyan },
      phys: { x: 162, y: 268, r: 54, name: "物理世界", sub: "有质量 · 有时间 · 混沌", c: C.gold },
      mind: { x: 598, y: 268, r: 54, name: "心智世界", sub: "有感受 · 有理解", c: C.mag }
    };
    var links = [
      { a: "plat", b: "phys", key: "①", label: "为什么数学恰好合用？", c: C.cyan, main: true,
        detail: "数学不是被实验逼出来的，而是数学家凭审美自由发明的；可它偏偏精确描述了物理世界——不是「差不多合用」，是精确到小数点后十几位。本书 34 章，全部在处理这一个谜。" },
      { a: "phys", b: "mind", key: "②", label: "物质如何产生心智？", c: C.gold, main: false,
        detail: "神经元里的电化学过程是物理的，可「痛」「红」是主观的。作者明确说：这是他不知道答案的谜——这也是为什么 §34.7 把心智放在书的末尾而不是开头。" },
      { a: "mind", b: "plat", key: "③", label: "心智何以通达数学？", c: C.mag, main: false,
        detail: "我们凭什么能理解一个独立于我们、又无限精确的世界？作者同样不给答案；但他强调：没有谜③，谜①连提都提不出来。" }
    ];

    /* 连线 */
    links.forEach(function (L) {
      var A = nodes[L.a], B = nodes[L.b];
      var mx = (A.x + B.x) / 2, my = (A.y + B.y) / 2;
      var nx = -(B.y - A.y), ny = (B.x - A.x), nl = Math.hypot(nx, ny);
      var bow = L.key === "①" ? 34 : 26;
      var cxp = mx + nx / nl * bow, cyp = my + ny / nl * bow;
      var d = "M" + A.x + " " + A.y + "Q" + cxp + " " + cyp + " " + B.x + " " + B.y;
      VZ.path(svg, d, VZ.stroke({ stroke: L.c, "stroke-width": L.main ? 2.6 : 1.5, opacity: .5, "stroke-dasharray": L.main ? "none" : "7 7" }));
      VZ.travel(svg, d, { color: L.c, dur: 3.2, count: 2, r: 4 });
      var lx = cxp + (nx / nl) * 30, ly = cyp + (ny / nl) * 30;
      var gg = VZ.g(svg, { style: "cursor:pointer" });
      VZ.circ(gg, lx, ly, 18, { fill: "rgba(10,6,28,.94)", stroke: L.c, "stroke-width": 1.6 });
      VZ.txt(gg, lx, ly + 6, L.key, { size: 16, fill: L.c, anchor: "middle", weight: 700 });
      L.hit = gg;
      gg.addEventListener("click", function () { show(L); });
    });

    /* 世界节点 */
    Object.keys(nodes).forEach(function (k) {
      var n = nodes[k];
      var glowF = VZ.blurFilter(svg, VZ.uid("bl"), 7);
      VZ.circ(svg, n.x, n.y, n.r + 4, { fill: n.c, opacity: .18, filter: glowF });
      var gg = VZ.g(svg, { style: "cursor:pointer" });
      VZ.circ(gg, n.x, n.y, n.r, { fill: "rgba(12,8,32,.9)", stroke: n.c, "stroke-width": 1.8 });
      var parts = n.name.length > 7 ? [n.name.slice(0, 7), n.name.slice(7)] : [n.name];
      parts.forEach(function (l, i) {
        VZ.txt(gg, n.x, n.y + 4 + i * 17 - (parts.length - 1) * 8, l, { size: 12.5, fill: n.c, anchor: "middle", weight: 700 });
      });
      VZ.txt(gg, n.x, n.y + n.r + 18, n.sub, { size: 10.5, fill: C.dim, anchor: "middle" });
      n.hit = gg;
      gg.addEventListener("click", function () {
        show(links.filter(function (x) { return (x.a === k || x.b === k) && x.main; })[0] || links[0]);
      });
    });

    /* 说明面板（固定尺寸，只换文字，避免版面跳动） */
    var panel = VZ.g(svg);
    VZ.el("rect", { x: 20, y: 376, width: 720, height: 110, rx: 12, fill: "rgba(255,255,255,.045)", stroke: C.faint }, panel);
    var pTitle = VZ.txt(panel, 38, 402, "谜① 为什么数学恰好合用？", { size: 14, fill: C.cyan, weight: 700 });
    var pText = VZ.g(panel);
    VZ.txt(panel, 700, 402, "点击连线或世界切换", { size: 10.5, fill: C.dim, anchor: "end" });
    function show(L) {
      pTitle.textContent = "谜" + L.key + " " + L.label;
      pTitle.setAttribute("fill", L.c);
      pText.innerHTML = "";
      VZ.para(pText, 38, 424, L.detail, { size: 12.5, per: 52, lh: 20 });
      links.forEach(function (x) {
        var c = x.hit.querySelector("circle");
        c.setAttribute("stroke-width", x === L ? 3 : 1.4);
        c.setAttribute("fill", x === L ? "rgba(255,255,255,.16)" : "rgba(10,6,28,.94)");
      });
    }
    show(links[0]);

  }
},

/* ==========================================================
   第 4 章 · 复数乘法与收敛半径（可交互）
   ========================================================== */
"f-ch04": {
  title: "复数：一次乘法，两种几何动作",
  hint: "切到「收敛半径」看清为什么实数轴上一切正常的函数会突然失效；切到「Mandelbrot」——它是这条规则最疯狂的后果，<b>点一下可以放大</b>。",
  draw: function (stage) {
    var C = VZ.C;
    var host = document.createElement("div");
    var ctl = VZ.box(stage, "viz-chips");
    stage.appendChild(host);
    VZ.chips(ctl, ["乘法 = 旋转 + 伸缩", "收敛半径", "Mandelbrot 集"], "乘法 = 旋转 + 伸缩", function (m) { render(m); });
    var noteEl = VZ.note(stage, "");
    function render(mode) {
      host.innerHTML = "";
      if (mode.indexOf("乘法") === 0) drawMul(host);
      else if (mode === "收敛半径") drawRadius(host);
      else drawMandel(host);
    }
    function setNote(s) { noteEl.innerHTML = s; }

    /* ---- 模式一：拖拽 z，看乘法如何做旋转与伸缩 ---- */
    function drawMul(host) {
      var W = 760, H = 340, svg = VZ.S(host, W, H, { grid: true });
      var ox = 380, oy = 175, U = 92;
      VZ.ln(svg, ox - 340, oy, ox + 340, oy, { stroke: C.faint, "stroke-width": 1 });
      VZ.ln(svg, ox, oy - 160, ox, oy + 160, { stroke: C.faint, "stroke-width": 1 });
      VZ.txt(svg, ox + 344, oy - 8, "实轴", { size: 11, fill: C.dim, anchor: "end" });
      VZ.txt(svg, ox + 8, oy - 156, "虚轴", { size: 11, fill: C.dim });
      [1, 2, 3].forEach(function (k) {
        VZ.circ(svg, ox + k * U, oy, 2, { fill: C.faint });
        VZ.circ(svg, ox - k * U, oy, 2, { fill: C.faint });
        VZ.circ(svg, ox, oy - k * U, 2, { fill: C.faint });
        VZ.circ(svg, ox, oy + k * U, 2, { fill: C.faint });
      });
      VZ.circ(svg, ox, oy, U, { stroke: C.faint, "stroke-width": .9, "stroke-dasharray": "4 4" });

      var w = 0.62, angBase = 0.62;  /* 初始 z */
      var out = VZ.panel(host, { "z": "", "z²": "", "z³": "", "z⁴": "" , "|z|": "", "arg z": "" });

      var arcs = VZ.g(svg);
      var colors = [C.cyan, C.mag, C.gold, C.violet];
      var handles = [];
      for (var i = 0; i < 4; i++) handles.push(VZ.circ(svg, 0, 0, 6, { fill: colors[i] }));
      var lines = [];
      for (var j = 0; j < 4; j++) lines.push(VZ.path(svg, "", VZ.stroke({ stroke: colors[j], "stroke-width": 2, opacity: .85 })));

      function redraw() {
        var re = w * Math.cos(angBase), im = w * Math.sin(angBase);
        arcs.innerHTML = "";
        var px = ox, py = oy;
        var vals = [];
        for (var k = 1; k <= 4; k++) {
          var p = Math.pow(w, k), a = angBase * k;
          var X = ox + p * U * Math.cos(a), Y = oy - p * U * Math.sin(a);
          vals.push([p, a, X, Y]);
          lines[k - 1].setAttribute("d", "M" + px + " " + py + "L" + X + " " + Y);
          handles[k - 1].setAttribute("cx", X); handles[k - 1].setAttribute("cy", Y);
          /* 旋转弧 */
          var rr = p * U * 0.55;
          var x1 = px + rr, y1 = py;
          var x2 = ox + rr * Math.cos(a), y2 = oy - rr * Math.sin(a);
          var sweep = a > 0 ? 0 : 1;
          if (Math.abs(a) > 0.02) VZ.path(arcs, "M" + x1 + " " + y1 + "A" + rr + " " + rr + " 0 " + (Math.abs(a) > Math.PI ? 1 : 0) + " " + sweep + " " + x2 + " " + y2,
            VZ.stroke({ stroke: colors[k - 1], "stroke-width": 1, opacity: .4, "stroke-dasharray": "3 4" }));
          px = X; py = Y;
        }
        VZ.setPanel(out, {
          "z": (re).toFixed(2) + (im >= 0 ? " + " : " − ") + Math.abs(im).toFixed(2) + "i",
          "z²": zc(vals[1][0], vals[1][1]),
          "z³": zc(vals[2][0], vals[2][1]),
          "z⁴": zc(vals[3][0], vals[3][1]),
          "|z|": w.toFixed(3),
          "arg z": (angBase * 180 / Math.PI).toFixed(1) + "°"
        });
      }
      function zc(p, a) {
        var re = p * Math.cos(a), im = p * Math.sin(a);
        return re.toFixed(2) + (im >= 0 ? " + " : " − ") + Math.abs(im).toFixed(2) + "i";
      }
      var zMarker = VZ.circ(svg, 0, 0, 9, { fill: "none", stroke: C.ink, "stroke-width": 1.6, "stroke-dasharray": "3 3" });
      var dragging = false;
      VZ.drag(svg, svg, W, H, function (x, y, phase) {
        var dx = (x - ox) / U, dy = -(y - oy) / U;
        if (phase === "move" || phase === "start") {
          w = VZ.clamp(Math.hypot(dx, dy), 0.15, 1.45);
          if (w > 1.2) w = 1.2;
          angBase = Math.atan2(dy, dx);
          redraw();
          zMarker.setAttribute("cx", ox + w * U * Math.cos(angBase));
          zMarker.setAttribute("cy", oy - w * U * Math.sin(angBase));
        }
      });
      redraw();
      zMarker.setAttribute("cx", ox + w * U * Math.cos(angBase));
      zMarker.setAttribute("cy", oy - w * U * Math.sin(angBase));
      VZ.legend(host, [["z", C.cyan], ["z²", C.mag], ["z³", C.gold], ["z⁴", C.violet]]);
      setNote("<b>拖动画面任意位置</b>改变 z。乘法把模相乘、角相加——所以幂次 zⁿ 一边旋转一边伸缩。模小于 1 时螺旋向内收敛到 0；大于 1 时向外发散。<span class='hl'>整个复分析的长相，就是这一条规则的展开。</span>");
    }

    /* ---- 模式二：收敛半径 ---- */
    function drawRadius(host) {
      var W = 760, H = 340, svg = VZ.S(host, W, H, { grid: true });
      var ox = 240, oy = 180, U = 76;
      VZ.ln(svg, ox - 180, oy, ox + 180, oy, { stroke: C.ink2, "stroke-width": 1.4 });
      VZ.ln(svg, ox, oy - 150, ox, oy + 150, { stroke: C.ink2, "stroke-width": 1.4 });
      VZ.circ(svg, ox, oy, U, { stroke: C.gold, "stroke-width": 1.4, "stroke-dasharray": "6 5" });
      VZ.txt(svg, ox + 6, oy - U - 8, "|z| = 1", { size: 11, fill: C.gold });
      VZ.circ(svg, ox, oy - U, 6, { fill: C.red });
      VZ.circ(svg, ox, oy + U, 6, { fill: C.red });
      VZ.txt(svg, ox + 10, oy - U + 4, "奇点 i", { size: 12, fill: C.red });
      VZ.txt(svg, ox + 10, oy + U + 4, "奇点 −i", { size: 12, fill: C.red });
      VZ.txt(svg, ox - 176, oy - 6, "实轴", { size: 11, fill: C.dim });
      VZ.txt(svg, ox + 4, oy, "0", { size: 11, fill: C.dim });

      /* 部分和曲线（右侧） */
      var rx = 450, ry = 60, rw = 280, rh = 240;
      VZ.card(svg, rx, ry, rw, rh, { stroke: C.faint });
      VZ.ln(svg, rx + 20, ry + rh - 30, rx + rw - 16, ry + rh - 30, { stroke: C.faint });
      VZ.ln(svg, rx + rw / 2, ry + 14, rx + rw / 2, ry + rh - 30, { stroke: C.faint });
      VZ.txt(svg, rx + rw - 20, ry + rh - 14, "x", { size: 11, fill: C.dim });
      VZ.txt(svg, rx + rw / 2 + 6, ry + 24, "Sₙ(x)", { size: 11, fill: C.dim });
      var xs = [], pts = [];
      var lineP = VZ.path(svg, "", VZ.stroke({ stroke: C.cyan, "stroke-width": 1.8 }));
      var marker = VZ.circ(svg, 0, 0, 5, { fill: C.gold });
      var readout = VZ.txt(svg, rx + 20, ry + 26, "", { size: 12, fill: C.gold });
      var xv = 0.4;
      VZ.raf(svg, function (t) {
        /* 实际函数 1/(1+x²) 与 8 阶部分和 */
        var N = 8, d = "";
        for (var i = 0; i <= 56; i++) {
          var X = -1.7 + 3.4 * i / 56, S = 0;
          for (var k = 0; k <= N; k++) S += Math.pow(-1, k) * Math.pow(X, 2 * k);
          var px = rx + rw / 2 + X * (rw / 2 - 24) / 1.8;
          var py = ry + rh - 30 - VZ.clamp(S, -3, 3) * 46;
          d += (i ? "L" : "M") + px.toFixed(1) + " " + py.toFixed(1);
        }
        lineP.setAttribute("d", d);
        var truth = "";
        for (var i2 = 0; i2 <= 56; i2++) {
          var X2 = -1.7 + 3.4 * i2 / 56, T = 1 / (1 + X2 * X2);
          var px2 = rx + rw / 2 + X2 * (rw / 2 - 24) / 1.8;
          var py2 = ry + rh - 30 - T * 46;
          truth += (i2 ? "L" : "M") + px2.toFixed(1) + " " + py2.toFixed(1);
        }
        truthP.setAttribute("d", truth);
        xv = 0.4 + 1.35 * (0.5 + 0.5 * Math.sin(t * 0.75));
        var Sx = 0; for (var k2 = 0; k2 <= N; k2++) Sx += Math.pow(-1, k2) * Math.pow(xv, 2 * k2);
        var mx2 = rx + rw / 2 + xv * (rw / 2 - 24) / 1.8;
        var my2 = ry + rh - 30 - VZ.clamp(Sx, -3, 3) * 46;
        marker.setAttribute("cx", mx2); marker.setAttribute("cy", my2);
        positionDot.setAttribute("cx", ox + xv * U); positionDot.setAttribute("cy", oy);
        readout.textContent = "x = " + xv.toFixed(2) + "   S₈ = " + Sx.toFixed(2) + (xv < 1 ? "  ✓ 逼近真值" : "  ✗ 彻底跑飞");
        readout.setAttribute("fill", xv < 1 ? C.green : C.red);
      });
      var truthP = VZ.path(svg, "", VZ.stroke({ stroke: C.green, "stroke-width": 1.6, opacity: .75, "stroke-dasharray": "5 4" }));
      var positionDot = VZ.circ(svg, ox, oy, 6, { fill: C.gold });
      VZ.legend(host, [["8 阶部分和", C.cyan, "line"], ["真值 1/(1+x²)", C.green, "line"], ["当前 x", C.gold]]);
      setNote("实轴上的金色点就是当前的 x。|x| &lt; 1 时幂级数乖乖逼近真值；一旦越过 1，立刻跑飞。但函数本身在 x=2 处好得很。<span class='hl'>失效的原因根本不在实轴上：是复平面里的 ±i 卡住了收敛圆。</span>这就是第 4–8 章反复用到的判据——收敛半径 = 到最近奇点的距离。");
    }

    /* ---- 模式三：Mandelbrot ---- */
    function drawMandel(host) {
      var W = 760, H = 440;
      /* 逐像素算的图：把后备缓冲区压到 ~70 万像素，retina 上点击也不会卡 */
      var cv = VZ.canvas(host, W, H, { maxPixels: 700000 });
      var ctx = cv.ctx;
      var view = { cx: -0.6, cy: 0, span: 3.0 };
      var iter = 120;
      var maxIter = 240;
      var readout = VZ.panel(host, { "中心": "", "视野宽度": "", "放大倍数": "", "迭代上限": "" });

      function escapeAt(x, y, it) {
        var zr = 0, zi = 0, i = 0;
        for (; i < it; i++) {
          var t = zr * zr - zi * zi + x;
          zi = 2 * zr * zi + y; zr = t;
          if (zr * zr + zi * zi > 4) break;
        }
        if (i >= it) return it;
        /* 平滑迭代数：按整数迭代上色会出现一圈圈硬边，加这一项就顺了 */
        return i + 1 - Math.log(Math.log(Math.sqrt(zr * zr + zi * zi)) / Math.LN2) / Math.LN2;
      }
      function colorOf(i) {
        if (i >= iter) return [7, 6, 18];
        var u = i / iter;
        var s = Math.pow(u, 0.42);
        var t = 3 * s;
        var k = t % 1, seg = Math.floor(t);
        var pal = [[79, 227, 240], [155, 140, 255], [255, 111, 216], [255, 207, 92], [79, 227, 240]];
        var a = pal[seg % 5], b = pal[(seg + 1) % 5];
        /* 远处压暗、边界发亮，才不会在深色页面里糊成一片亮紫 */
        var g = 0.14 + 0.86 * Math.pow(u, 0.85);
        return [(a[0] + (b[0] - a[0]) * k) * g, (a[1] + (b[1] - a[1]) * k) * g, (a[2] + (b[2] - a[2]) * k) * g];
      }
      /* putImageData 不认 ctx 的缩放变换，写的是后备缓冲区的真实像素；
         所以循环用 bw/bh（设备像素），而坐标换算回 CSS 尺寸 cv.w / cv.h。
         原来的写法用 cv.w 建图，在 retina 上只填满左上角 1/4。 */
      function paint(pass) {
        var W2 = cv.bw, H2 = cv.bh, d = cv.dpr;
        var scale = view.span / cv.w;          /* 每个 CSS 像素对应多少复平面单位 */
        var step = (pass === 0 ? 4 : pass === 1 ? 2 : 1) * Math.max(1, Math.round(d));
        var img = ctx.createImageData(W2, H2);
        var data = img.data;
        for (var py = 0; py < H2; py += step) {
          var y = view.cy + (py / d - cv.h / 2) * scale;
          for (var px = 0; px < W2; px += step) {
            var x = view.cx + (px / d - cv.w / 2) * scale;
            var col = colorOf(escapeAt(x, y, iter));
            for (var dy = 0; dy < step && py + dy < H2; dy++) {
              for (var dx = 0; dx < step && px + dx < W2; dx++) {
                var o = ((py + dy) * W2 + (px + dx)) * 4;
                data[o] = col[0]; data[o + 1] = col[1]; data[o + 2] = col[2]; data[o + 3] = 255;
              }
            }
          }
        }
        ctx.putImageData(img, 0, 0);
      }
      function full() {
        var s = view.span;
        paint(0); paint(1); paint(2);
        VZ.setPanel(readout, {
          "中心": view.cx.toFixed(4) + " + " + view.cy.toFixed(4) + "i",
          "视野宽度": s.toFixed(4),
          "放大倍数": (3.0 / s).toFixed(1) + "×",
          "迭代上限": String(iter)
        });
      }
      paint(0); paint(1); paint(2);
      VZ.setPanel(readout, {
        "中心": view.cx.toFixed(4) + " + " + view.cy.toFixed(4) + "i",
        "视野宽度": "3.0000", "放大倍数": "1.0×", "迭代上限": String(iter)
      });

      cv.cv.addEventListener("click", function (e) {
        var r = cv.cv.getBoundingClientRect();
        var fx = (e.clientX - r.left) / r.width, fy = (e.clientY - r.top) / r.height;
        /* 纵向要乘 h/w（像素是方的），乘成 w/h 会让点击点上下跳 3.6 倍 */
        var x = view.cx + (fx - 0.5) * view.span;
        var y = view.cy + (fy - 0.5) * view.span * (cv.h / cv.w);
        view.cx = x; view.cy = y; view.span *= 0.42;
        iter = Math.min(600, Math.round(iter * 1.35));
        full();
      });
      var row = VZ.box(host, "viz-ctl");
      VZ.btn(row, "缩小视野", function () { view.span = Math.min(6, view.span / 0.42); iter = Math.max(80, Math.round(iter / 1.35)); full(); });
      VZ.btn(row, "回到全景", function () { view.cx = -0.6; view.cy = 0; view.span = 3.0; iter = 120; full(); });
      VZ.btn(row, "跳到海马谷", function () { view.cx = -0.743643887037151; view.cy = 0.13182590420533; view.span = 0.0006; iter = 600; full(); });
      setNote("集合的定义只用了一行：<b>z → z² + c 迭代后不发散的那些 c</b>。可它的边界无限复杂、处处不光滑。<span class='hl'>Penrose 用它说明一件事：一条极简单的复数规则，能长出数学描述不完的复杂性。</span>点击画面即可放大；放大到海马谷需要约 5000 倍，而这只用了 240 次迭代。");
    }

    render("乘法 = 旋转 + 伸缩");
  }
}

});
