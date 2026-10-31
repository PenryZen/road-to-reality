/* ============================================================
   viz-figs.js — 全书交互图示合集
   覆盖：6 张区域导论图 + 34 张章节图（ch01–ch34 全覆盖）
   由 viz-part1 / viz-a1 / viz-a2 / viz-b / viz-c 合并生成
   ============================================================ */

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

/* ============================================================
   viz-a1.js — 图示第二批（第 2、3、5、6、7 章）
   风格基准：viz-part1.js 的 f-ch01（点击 + 动画）/ f-ch04（chips + 拖拽）
    · 颜色一律取自 VZ.C
    · 深空底 + 象牙白钢笔线，重点用 cyan / mag / gold
    · 每张图至少一处动效（VZ.raf / VZ.travel）或交互（VZ.drag / VZ.slider / VZ.chips）
    · 中文字符串中不出现直双引号，引用一律用「」
   ============================================================ */
(function () {
  var C = VZ.C;
  var D = 180 / Math.PI;
  function fx(v, n) { return Number(v).toFixed(n === undefined ? 1 : n); }
  function clamp(x, a, b) { return x < a ? a : x > b ? b : x; }
  function dOf(pts, close) {
    var s = "";
    for (var i = 0; i < pts.length; i++) s += (i ? "L" : "M") + fx(pts[i][0], 1) + " " + fx(pts[i][1], 1);
    return s + (close ? "Z" : "");
  }

  /* ---------- 闭合 Catmull-Rom：采样 & 路径 ---------- */
  function crAt(p0, p1, p2, p3, t) {
    var t2 = t * t, t3 = t2 * t;
    function k(a, b, c, d) {
      return 0.5 * (2 * b + (-a + c) * t + (2 * a - 5 * b + 4 * c - d) * t2 + (-a + 3 * b - 3 * c + d) * t3);
    }
    return [k(p0[0], p1[0], p2[0], p3[0]), k(p0[1], p1[1], p2[1], p3[1])];
  }
  function sampleClosed(pts, per) {
    var n = pts.length, out = [];
    for (var i = 0; i < n; i++) {
      var p0 = pts[(i - 1 + n) % n], p1 = pts[i], p2 = pts[(i + 1) % n], p3 = pts[(i + 2) % n];
      for (var j = 0; j < per; j++) out.push(crAt(p0, p1, p2, p3, j / per));
    }
    return out;
  }
  function smoothClosed(pts) {
    var n = pts.length, d = "M" + fx(pts[0][0], 1) + " " + fx(pts[0][1], 1);
    for (var i = 0; i < n; i++) {
      var p0 = pts[(i - 1 + n) % n], p1 = pts[i], p2 = pts[(i + 1) % n], p3 = pts[(i + 2) % n];
      d += "C" + fx(p1[0] + (p2[0] - p0[0]) / 6, 1) + " " + fx(p1[1] + (p2[1] - p0[1]) / 6, 1) + " " +
        fx(p2[0] - (p3[0] - p1[0]) / 6, 1) + " " + fx(p2[1] - (p3[1] - p1[1]) / 6, 1) + " " +
        fx(p2[0], 1) + " " + fx(p2[1], 1);
    }
    return d + "Z";
  }
  function inPoly(pt, poly) {
    var x = pt[0], y = pt[1], c = false;
    for (var i = 0, j = poly.length - 1; i < poly.length; j = i++) {
      var xi = poly[i][0], yi = poly[i][1], xj = poly[j][0], yj = poly[j][1];
      if (((yi > y) !== (yj > y)) && (x < (xj - xi) * (y - yi) / (yj - yi) + xi)) c = !c;
    }
    return c;
  }

  /* ---------- 左：《通向实在之路》图示 ---------- */
  VZ.define({

/* ==========================================================
   第 2 章 · 庞加莱圆盘与平行公设
   ========================================================== */
"f-ch02": {
  title: "庞加莱圆盘：双曲三角形的内角和永远小于 180°",
  hint: "拖动圆盘里的<b>三个顶点</b>，或者拉滑杆把三角形整体缩小，盯住下方面板的读数：内角和始终 <b>小于 180°</b>，只有当三角形缩到几乎看不见时才趋近 180°。右边小图是平行公设的判决书——过直线外一点 P，双曲几何里有<b>无穷多条</b>直线不与 l 相交，欧氏几何里恰好 1 条，椭圆几何里一条也没有。<span class='hl'>平行公设证不出来，因为它根本不是定理，而是菜单上的一道选择题。</span>",
  legend: [["双曲三角形（测地线）", C.cyan], ["内角弧", C.gold], ["过 P 的平行线", C.mag], ["给定直线 l", C.ink]],
  draw: function (stage) {
    var W = 760, H = 440, svg = VZ.S(stage, W, H, { grid: true });
    var cx = 190, cy = 205, R = 163;

    /* ---- 圆盘与双曲极坐标网格 ---- */
    VZ.circ(svg, cx, cy, R, { fill: "rgba(255,255,255,.022)", stroke: C.ink2, "stroke-width": 1.6 });
    VZ.circ(svg, cx, cy, R + 5, { stroke: C.violet, "stroke-width": .8, opacity: .32 });
    [0.6, 1.2, 1.8, 2.4, 3.0].forEach(function (rho) {
      VZ.circ(svg, cx, cy, Math.tanh(rho / 2) * R, { stroke: C.faint, "stroke-width": .7, opacity: .5 });
    });
    for (var k = 0; k < 12; k++) {
      var a = k * Math.PI / 6;
      VZ.ln(svg, cx, cy, cx + R * Math.cos(a), cy + R * Math.sin(a), { stroke: C.faint, "stroke-width": .6, opacity: .3 });
    }
    VZ.txt(svg, cx, cy - R + 22, "庞加莱圆盘（边界 = 无穷远）", { size: 10.5, fill: C.dim, anchor: "middle" });

    /* ---- 三角形状态：[双曲半径 rho, 极角 theta] ---- */
    var V0 = [[1.45, -2.30], [1.55, 0.35], [1.28, 2.50]];
    var V = [[1.45, -2.30], [1.55, 0.35], [1.28, 2.50]];
    var sc = 1;
    var edge = [], vdot = [], aArc = [], aTxt = [], vtick = [];
    for (var i = 0; i < 3; i++) {
      edge.push(VZ.path(svg, "", VZ.stroke({ stroke: C.cyan, "stroke-width": 2.2 })));
      aArc.push(VZ.path(svg, "", VZ.stroke({ stroke: C.gold, "stroke-width": 1.5, opacity: .9 })));
      aTxt.push(VZ.txt(svg, 0, 0, "", { size: 11, fill: C.gold, anchor: "middle", weight: 700 }));
      vtick.push(VZ.circ(svg, 0, 0, 13, { stroke: C.gold, "stroke-width": 1, opacity: .3, "stroke-dasharray": "3 3" }));
      vdot.push(VZ.circ(svg, 0, 0, 7, { fill: C.gold, stroke: C.deep, "stroke-width": 1.5 }));
    }
    VZ.txt(svg, cx, cy + R + 24, "双曲距离 = log(QA·PB / QB·PA)", { size: 11.5, fill: C.ink2, anchor: "middle" });
    VZ.txt(svg, cx, cy + R + 42, "内角和 S = ∠A+∠B+∠C 恒小于 180°", { size: 11.5, fill: C.gold, anchor: "middle" });
    var sumTxt = VZ.txt(svg, cx, 34, "", { size: 14, fill: C.green, anchor: "middle", weight: 700 });

    /* 局部坐标（圆盘中心 = 原点）——geoArc / hyperTriangleAngles 都要求这个基准 */
    function local(i) { return VZ.poincare(V[i][0] * sc, V[i][1], R); }
    function abs(i) { var p = local(i); return [cx + p[0], cy + p[1]]; }
    function geoD(a, b) {
      var g = VZ.geoArc(a, b, R);
      var p1 = [cx + a[0], cy + a[1]], p2 = [cx + b[0], cy + b[1]];
      if (g.straight) return "M" + fx(p1[0], 1) + " " + fx(p1[1], 1) + "L" + fx(p2[0], 1) + " " + fx(p2[1], 1);
      return "M" + fx(p1[0], 1) + " " + fx(p1[1], 1) + "A" + fx(g.r, 1) + " " + fx(g.r, 1) + " 0 " + g.large + " " + g.sweep + " " +
        fx(p2[0], 1) + " " + fx(p2[1], 1);
    }
    function tanAt(a, b) {
      var arc = VZ.geoArc(a, b, R), dx, dy;
      if (arc.straight) { dx = b[0] - a[0]; dy = b[1] - a[1]; }
      else {
        dx = -(a[1] - arc.c[1]); dy = a[0] - arc.c[0];
        if (dx * (b[0] - a[0]) + dy * (b[1] - a[1]) < 0) { dx = -dx; dy = -dy; }
      }
      var L = Math.hypot(dx, dy) || 1;
      return [dx / L, dy / L];
    }
    /* 内角：双曲余弦定理（配合 VZ.hyperDist）。
       注：庞加莱圆盘是共形模型，这里的结果与切线方向的欧氏夹角一致。 */
    function hypAngles(P) {
      var d = [VZ.hyperDist(P[1], P[2], R), VZ.hyperDist(P[2], P[0], R), VZ.hyperDist(P[0], P[1], R)];
      var out = [];
      for (var i = 0; i < 3; i++) {
        var a = d[i], b = d[(i + 1) % 3], c = d[(i + 2) % 3];
        out.push(Math.acos(clamp((Math.cosh(b) * Math.cosh(c) - Math.cosh(a)) / (Math.sinh(b) * Math.sinh(c)), -1, 1)));
      }
      return { A: out, side: d };
    }
    function redraw(showSum) {
      var P = [local(0), local(1), local(2)];
      var Q = [abs(0), abs(1), abs(2)];
      for (var i = 0; i < 3; i++) edge[i].setAttribute("d", geoD(P[i], P[(i + 1) % 3]));
      var HA = hypAngles(P), A = HA.A, SD = HA.side;
      for (var m = 0; m < 3; m++) {
        var t1 = tanAt(P[m], P[(m + 1) % 3]), t2 = tanAt(P[m], P[(m + 2) % 3]);
        var a1 = Math.atan2(t1[1], t1[0]);
        var dd = Math.atan2(t2[1], t2[0]) - a1;
        while (dd > Math.PI) dd -= 2 * Math.PI; while (dd < -Math.PI) dd += 2 * Math.PI;
        var rr = 30, X1 = Q[m][0] + rr * Math.cos(a1), Y1 = Q[m][1] + rr * Math.sin(a1);
        aArc[m].setAttribute("d", "M" + fx(X1, 1) + " " + fx(Y1, 1) + "A" + rr + " " + rr + " 0 0 " + (dd > 0 ? 1 : 0) + " " +
          fx(Q[m][0] + rr * Math.cos(a1 + dd), 1) + " " + fx(Q[m][1] + rr * Math.sin(a1 + dd), 1));
        var bx = t1[0] + t2[0], by = t1[1] + t2[1];
        if (Math.hypot(bx, by) < .2) { bx = -P[m][0]; by = -P[m][1]; }
        var bl = Math.hypot(bx, by) || 1;
        aTxt[m].setAttribute("x", fx(Q[m][0] + bx / bl * 46, 1));
        aTxt[m].setAttribute("y", fx(Q[m][1] + by / bl * 46 + 3.5, 1));
        aTxt[m].textContent = fx(A[m] * D, 1) + "°";
        vdot[m].setAttribute("cx", fx(Q[m][0], 1)); vdot[m].setAttribute("cy", fx(Q[m][1], 1));
        vtick[m].setAttribute("cx", fx(Q[m][0], 1)); vtick[m].setAttribute("cy", fx(Q[m][1], 1));
      }
      var S = (A[0] + A[1] + A[2]) * D;
      if (showSum !== false) {
        sumTxt.textContent = "内角和 = " + fx(S, 1) + "°　（180° − S = " + fx(180 - S, 1) + "°）";
        sumTxt.setAttribute("fill", S < 179.9 ? C.green : C.gold);
        VZ.setPanel(pan, {
          "内角和 S": fx(S, 2) + "°",
          "缺陷 180°−S": fx(180 - S, 2) + "°",
          "∠A": fx(A[0] * D, 1) + "°",
          "∠B": fx(A[1] * D, 1) + "°",
          "∠C": fx(A[2] * D, 1) + "°",
          "边长（双曲）": fx(SD[0], 2) + " / " + fx(SD[1], 2) + " / " + fx(SD[2], 2)
        });
      }
    }

    /* ---- 拖拽顶点 ---- */
    var which = -1;
    VZ.drag(svg, svg, W, H, function (x, y, phase) {
      if (phase === "start") {
        which = -1;
        var best = 46;
        for (var i = 0; i < 3; i++) {
          var P = abs(i), dd = Math.hypot(x - P[0], y - P[1]);
          if (dd < best) { best = dd; which = i; }
        }
      }
      if (which < 0 || (x - cx) * (x - cx) + (y - cy) * (y - cy) > (R * 1.35) * (R * 1.35)) return;
      var dx = (x - cx) / R, dy = (y - cy) / R;
      var rr = Math.min(Math.hypot(dx, dy), 0.90);
      V[which][0] = clamp(2 * Math.atanh(rr), 0.12, 3.0) / sc;
      V[which][1] = Math.atan2(dy, dx);
      redraw();
    });

    /* ---- 右侧：三种几何对照 ---- */
    VZ.card(svg, 392, 28, 352, 128, { stroke: "rgba(255,255,255,.13)" });
    VZ.txt(svg, 406, 50, "平行公设：菜单上的三道菜", { size: 13.5, fill: C.ink, weight: 700 });
    [["欧氏几何", "内角和 = 180°", "过 P 恰有 1 条", C.ink2],
     ["双曲几何", "内角和 < 180°", "过 P 有无穷多条", C.cyan],
     ["椭圆几何", "内角和 > 180°", "过 P 一条也没有", C.violet]].forEach(function (row, i) {
      var yy = 76 + i * 26;
      VZ.circ(svg, 412, yy - 4, 4, { fill: row[3] });
      VZ.txt(svg, 424, yy, row[0], { size: 11.5, fill: row[3], weight: 700 });
      VZ.txt(svg, 500, yy, row[1], { size: 11.5, fill: C.ink2 });
      VZ.txt(svg, 736, yy, row[2], { size: 11.5, fill: C.dim, anchor: "end" });
    });

    /* ---- 右侧小图：过 P 的多条平行线 ---- */
    var ox = 534, oy = 274, sR = 90;
    VZ.circ(svg, ox, oy, sR, { fill: "rgba(255,255,255,.028)", stroke: C.ink2, "stroke-width": 1.3 });
    var u = [Math.cos(100 / D), Math.sin(100 / D)];
    VZ.ln(svg, ox - u[0] * sR, oy - u[1] * sR, ox + u[0] * sR, oy + u[1] * sR, { stroke: C.ink, "stroke-width": 2.4 });
    VZ.txt(svg, ox + u[0] * sR - 6, oy + u[1] * sR + 18, "直线 l", { size: 12, fill: C.ink, weight: 700, anchor: "end" });
    var rhoP = 1.15, thP = 30 / D;
    var Pp = [Math.tanh(rhoP / 2) * sR * Math.cos(thP), Math.tanh(rhoP / 2) * sR * Math.sin(thP)];

    function geoThrough(p, psi) {
      var n = [-Math.sin(psi), Math.cos(psi)];
      var den = 2 * (p[0] * n[0] + p[1] * n[1]);
      if (Math.abs(den) < 1e-9) return { straight: true, dir: [Math.cos(psi), Math.sin(psi)] };
      var s = (sR * sR - (p[0] * p[0] + p[1] * p[1])) / den;
      return { c: [p[0] + s * n[0], p[1] + s * n[1]], r: Math.abs(s) };
    }
    function hitsL(g) {
      var cu = (g.c[0] * u[0] + g.c[1] * u[1]);
      var perp = Math.abs(g.c[0] * (-u[1]) + g.c[1] * u[0]);
      if (perp > g.r) return false;
      var h = Math.sqrt(Math.max(g.r * g.r - perp * perp, 0));
      return Math.abs(cu - h) <= sR * 1.001 || Math.abs(cu + h) <= sR * 1.001;
    }
    function hitsLStraight(g) {
      var d = g.dir, det = d[0] * (-u[1]) - d[1] * (-u[0]);
      if (Math.abs(det) < 1e-9) return true;
      var t = (Pp[0] * (-u[1]) - Pp[1] * (-u[0])) / det;
      var X = [Pp[0] + d[0] * t, Pp[1] + d[1] * t];
      return Math.hypot(X[0], X[1]) <= sR;
    }
    function wrapPi(v) { while (v > Math.PI) v -= 2 * Math.PI; while (v < -Math.PI) v += 2 * Math.PI; return v; }
    /* 正交圆落在圆盘内的那段弧（局部坐标 → 绝对坐标路径） */
    function geoClip(g) {
      if (g.straight) {
        var pd = Pp[0] * g.dir[0] + Pp[1] * g.dir[1];
        var disc = pd * pd - (Pp[0] * Pp[0] + Pp[1] * Pp[1]) + sR * sR;
        var sq = Math.sqrt(Math.max(disc, 0));
        var E1 = [Pp[0] + g.dir[0] * (-pd - sq), Pp[1] + g.dir[1] * (-pd - sq)];
        var E2 = [Pp[0] + g.dir[0] * (-pd + sq), Pp[1] + g.dir[1] * (-pd + sq)];
        return "M" + fx(ox + E1[0], 1) + " " + fx(oy + E1[1], 1) + "L" + fx(ox + E2[0], 1) + " " + fx(oy + E2[1], 1);
      }
      var d = Math.hypot(g.c[0], g.c[1]) || 1e-6;
      var aa = (d * d + sR * sR - g.r * g.r) / (2 * d);
      var h = Math.sqrt(Math.max(sR * sR - aa * aa, 0));
      var ux = g.c[0] / d, uy = g.c[1] / d;
      var p1 = [ux * aa + uy * h, uy * aa - ux * h], p2 = [ux * aa - uy * h, uy * aa + ux * h];
      var a1 = Math.atan2(p1[1] - g.c[1], p1[0] - g.c[0]), a2 = Math.atan2(p2[1] - g.c[1], p2[0] - g.c[0]);
      var dlt = wrapPi(a2 - a1), mid = a1 + dlt / 2;
      var q = Math.hypot(g.c[0] + g.r * Math.cos(mid), g.c[1] + g.r * Math.sin(mid));
      var large = Math.abs(dlt) > Math.PI ? 1 : 0, sweep = dlt > 0 ? 1 : 0;
      if (q > sR) { large = 1 - large; sweep = 1 - sweep; }
      return "M" + fx(ox + p1[0], 1) + " " + fx(oy + p1[1], 1) + "A" + fx(g.r, 1) + " " + fx(g.r, 1) + " 0 " + large + " " + sweep + " " +
        fx(ox + p2[0], 1) + " " + fx(oy + p2[1], 1);
    }
    var miss = [];
    for (var ps = 0; ps < 180; ps += 5) {
      var psi = ps / D, g = geoThrough(Pp, psi);
      var hit = g.straight ? hitsLStraight(g) : hitsL(g);
      if (!hit) miss.push(psi);
    }
    miss.forEach(function (psi) {
      VZ.path(svg, geoClip(geoThrough(Pp, psi)), VZ.stroke({ stroke: C.mag, "stroke-width": 1, opacity: .26 }));
    });
    [0, Math.floor(miss.length / 2), miss.length - 1].forEach(function (idx, i) {
      var g = geoThrough(Pp, miss[clamp(idx, 0, miss.length - 1)]);
      VZ.path(svg, geoClip(g), VZ.stroke({ stroke: i === 1 ? C.cyan : C.mag, "stroke-width": 1.7, opacity: .95 }));
    });
    VZ.circ(svg, ox + Pp[0], oy + Pp[1], 6, { fill: C.gold, stroke: C.deep, "stroke-width": 1.5 });
    VZ.txt(svg, ox + Pp[0] + 10, oy + Pp[1] - 8, "P", { size: 12.5, fill: C.gold, weight: 700 });
    var fanTxt = VZ.txt(svg, ox, oy - sR - 12, "过 P 的整整一个扇面内，每一条都不与 l 相交", { size: 11.5, fill: C.mag, anchor: "middle", weight: 700 });
    /* 高亮线上的游标：扫过这一族平行线 */
    var sweepDot = VZ.circ(svg, ox, oy, 4.5, { fill: C.gold });
    var midG = geoThrough(Pp, miss[Math.floor(miss.length / 2)]);
    VZ.raf(svg, function (t) {
      var X, Y, ok;
      if (midG.straight) {
        var pd = Pp[0] * midG.dir[0] + Pp[1] * midG.dir[1];
        var sq = Math.sqrt(Math.max(pd * pd - (Pp[0] * Pp[0] + Pp[1] * Pp[1]) + sR * sR, 0));
        var tt = -pd + sq * Math.sin(t * .8);
        X = ox + Pp[0] + midG.dir[0] * tt; Y = oy + Pp[1] + midG.dir[1] * tt;
        ok = Math.hypot(X - ox, Y - oy) < sR;
      } else {
        var ang = Math.atan2(Pp[1] - midG.c[1], Pp[0] - midG.c[0]) + Math.PI * 2 * ((t * .13) % 1);
        X = ox + midG.c[0] + midG.r * Math.cos(ang); Y = oy + midG.c[1] + midG.r * Math.sin(ang);
        ok = Math.hypot(X - ox, Y - oy) < sR;
      }
      sweepDot.setAttribute("cx", fx(X, 1)); sweepDot.setAttribute("cy", fx(Y, 1));
      sweepDot.setAttribute("opacity", ok ? 1 : 0);
    });

    /* ---- 底部说明 ---- */
    VZ.txt(svg, 392, 392, "Saccheri 1733 想用归谬法干掉平行公设，反而造出了双曲几何。", { size: 10.5, fill: C.dim });
    VZ.txt(svg, 392, 408, "Gauss 私下承认却不敢发表；Bolyai 与 Lobachevski 各自独立公开；", { size: 10.5, fill: C.dim });
    VZ.txt(svg, 392, 424, "Beltrami 的伪球面给出了欧氏空间中的真实实现 —— 菜单先于点菜。", { size: 10.5, fill: C.violet });

    /* ---- 控件 ---- */
    var pan = VZ.panel(stage, { "内角和 S": "", "缺陷 180°−S": "", "∠A": "", "∠B": "", "∠C": "", "边长（双曲）": "" });
    var row = VZ.box(stage, "viz-ctl");
    VZ.slider(row, {
      label: "三角形整体缩放（双曲半径倍数）", min: 0.08, max: 1, step: 0.01, value: 1,
      format: function (v) { return v.toFixed(2); },
      onInput: function (v) { sc = v; redraw(); }
    });
    VZ.btn(row, "重置三角形", function () { V = [[V0[0][0], V0[0][1]], [V0[1][0], V0[1][1]], [V0[2][0], V0[2][1]]]; sc = 1; redraw(); });
    redraw();
  }
},

/* ==========================================================
   第 3 章 · 实数的构造：√2 归谬 + 戴德金分割
   ========================================================== */
"f-ch03": {
  title: "实数是被构造出来的：√2 的归谬与戴德金分割",
  hint: "点<b>「下一步」</b>（或直接点左边的正方形）把 √2 的归谬证明走完——假设 √2 = a/b 是既约分数，结果 a、b 同时为偶，与既约矛盾。右边拖动数轴上的黄金切割点，看一对有理数集合怎么「切」出一个实数：<b>左集没有最大元，右集没有最小元</b>，切口就是那个数。有理数能与自然数一一配对（可数），实数不能（不可数）——<span class='hl'>两者之间的「洞」多到不可数</span>。",
  legend: [["有理数刻度", C.cyan], ["切口 / 戴德金分割点", C.gold], ["无理数（√2）", C.red], ["左集 L / 右集 R", C.violet]],
  draw: function (stage) {
    var W = 760, H = 400, svg = VZ.S(stage, W, H, {});

    /* ---------- 左：√2 归谬 ---------- */
    var cardL = VZ.el("rect", { x: 20, y: 28, width: 348, height: 320, rx: 10, fill: "rgba(255,255,255,.035)", stroke: C.faint }, svg);
    VZ.txt(svg, 36, 52, "√2 的归谬证明", { size: 13.5, fill: C.cyan, weight: 700 });
    VZ.txt(svg, 348, 52, "点这里逐步推进 ▸", { size: 10, fill: C.dim, anchor: "end" });

    /* 正方形与对角线 */
    var sqX = 72, sqY = 78, sqS = 96;
    VZ.poly(svg, [[sqX, sqY + sqS], [sqX + sqS, sqY + sqS], [sqX + sqS, sqY], [sqX, sqY]], { close: true, stroke: C.ink2, "stroke-width": 1.8 });
    var diag = VZ.path(svg, "M" + sqX + " " + (sqY + sqS) + "L" + (sqX + sqS) + " " + sqY, VZ.stroke({ stroke: C.red, "stroke-width": 2.2 }));
    VZ.drawIn(diag, 1.1, .3);
    VZ.txt(svg, sqX + sqS / 2, sqY + sqS + 16, "边长 1", { size: 10.5, fill: C.dim, anchor: "middle" });
    VZ.txt(svg, sqX + sqS + 8, sqY + sqS / 2 + 4, "1", { size: 10.5, fill: C.dim });
    VZ.txt(svg, sqX + 22, sqY + 44, "√2", { size: 13, fill: C.red, weight: 700 });
    var sqHint = VZ.txt(svg, 196, 190, "对角线长 √2 —— 它不能写成任何两个整数之比", { size: 10.5, fill: C.gold, anchor: "middle" });

    var steps = [
      "① 设 √2 = a / b 为既约分数（a、b 没有公因子）",
      "② 两边平方：a² = 2b²，所以右边是偶数",
      "③ a² 为偶 ⇒ a 为偶（奇数的平方仍然是奇数）",
      "④ 写 a = 2c 代回：4c² = 2b² ⇒ b² = 2c² ⇒ b 也为偶",
      "⑤ a、b 同为偶，与「既约」矛盾 ⇒ √2 不是有理数"
    ];
    var sTxt = steps.map(function (s, i) {
      return VZ.txt(svg, 36, 212 + i * 25, s, { size: 11, fill: i === 4 ? C.gold : C.ink2 });
    });
    VZ.txt(svg, 36, 340, "这个证明对实数之比失效——正实数的严格递减序列不再必然终止。", { size: 10, fill: C.violet });
    var k = 0;
    function paint() {
      sTxt.forEach(function (t, i) {
        t.setAttribute("opacity", i <= k ? 1 : .16);
        t.setAttribute("fill", i === 4 ? C.gold : C.ink2);
      });
      sqHint.setAttribute("fill", k >= 3 ? C.gold : C.dim);
      diag.setAttribute("opacity", k >= 1 ? 1 : .45);
    }
    function next() { k = (k + 1) % (steps.length + 1); if (k === steps.length) k = 0; paint(); }
    paint();
    cardL.addEventListener("click", next);

    /* ---------- 右上：戴德金分割数轴 ---------- */
    VZ.card(svg, 388, 28, 356, 130, { stroke: "rgba(255,255,255,.13)" });
    VZ.txt(svg, 402, 50, "戴德金分割：切口就是那个实数", { size: 13.5, fill: C.gold, weight: 700 });
    var nx0 = 410, nx1 = 722, ny = 106, unit = (nx1 - nx0) / 2.4;
    var leftBand = VZ.path(svg, "", { fill: C.violet, opacity: .35 });
    var rightBand = VZ.path(svg, "", { fill: C.mag, opacity: .18 });
    VZ.ln(svg, nx0, ny, nx1, ny, { stroke: C.ink, "stroke-width": 1.8 });
    VZ.path(svg, "M" + nx1 + " " + ny + "l-7 -4v8z", { fill: C.ink });
    var rq = [];
    for (var q = 0; q <= 9; q++) {
      var xq = nx0 + q * 0.25 * unit;
      VZ.ln(svg, xq, ny - 5, xq, ny + 5, { stroke: C.cyan, "stroke-width": 1 });
      rq.push(xq);
    }
    [0, 0.5, 1, 1.5, 2].forEach(function (v) {
      var xv = nx0 + v * unit;
      VZ.txt(svg, xv, ny + 20, v === 0 ? "0" : (v === 0.5 ? "1/2" : (v === 1 ? "1" : (v === 1.5 ? "3/2" : "2"))), { size: 10.5, fill: C.cyan, anchor: "middle" });
    });
    var x2 = nx0 + Math.SQRT2 * unit;
    VZ.circ(svg, x2, ny, 5, { fill: C.red });
    VZ.txt(svg, x2, ny - 14, "√2 ≈ 1.41421356…", { size: 10.5, fill: C.red, anchor: "middle" });
    VZ.txt(svg, 402, 76, "左集 L：q < x", { size: 10.5, fill: C.violet });
    VZ.txt(svg, 730, 76, "右集 R：q ≥ x", { size: 10.5, fill: C.mag, anchor: "end" });
    var cutLine = VZ.path(svg, "", VZ.stroke({ stroke: C.gold, "stroke-width": 2 }));
    var cutDot = VZ.circ(svg, nx0, ny, 6.5, { fill: C.gold, stroke: C.deep, "stroke-width": 1.5 });
    var cutTxt = VZ.txt(svg, 402, 148, "", { size: 11, fill: C.gold });
    var cutV = Math.SQRT2;
    function setCut(v) {
      cutV = clamp(v, 0, 2.4);
      var X = nx0 + cutV * unit;
      cutLine.setAttribute("d", "M" + fx(X, 1) + " " + (ny - 16) + "V" + (ny + 12));
      cutDot.setAttribute("cx", fx(X, 1));
      leftBand.setAttribute("d", "M" + nx0 + " " + (ny - 4) + "H" + fx(X, 1) + "V" + (ny + 4) + "H" + nx0 + "Z");
      rightBand.setAttribute("d", "M" + fx(X, 1) + " " + (ny - 4) + "H" + nx1 + "V" + (ny + 4) + "H" + fx(X, 1) + "Z");
      var near = Math.abs(cutV - Math.SQRT2) < 0.004;
      cutTxt.textContent = "切口 x = " + cutV.toFixed(6) + (near ? "（√2）" : "") + "　L 无最大元 · R 无最小元";
      cutTxt.setAttribute("fill", near ? C.red : C.gold);
    }
    setCut(Math.SQRT2);
    var dragCut = false;
    VZ.drag(svg, svg, W, H, function (x, y, phase) {
      if (phase === "start") dragCut = (y > 72 && y < 132 && x > 396 && x < 736);
      if (!dragCut) return;
      setCut((x - nx0) / unit);
    });

    /* ---------- 右下：可数 vs 不可数 ---------- */
    VZ.card(svg, 388, 170, 164, 104, { stroke: "rgba(255,255,255,.12)" });
    VZ.txt(svg, 400, 192, "有理数可数", { size: 12.5, fill: C.cyan, weight: 700 });
    VZ.para(svg, 400, 212, "能与自然数一一配对。1/1, 1/2, 2/1, 3/1, … 之字形枚举可以走遍全部。", { size: 10.5, per: 15, lh: 16 });
    VZ.card(svg, 560, 170, 184, 104, { stroke: "rgba(255,255,255,.12)" });
    VZ.txt(svg, 572, 192, "实数不可数", { size: 12.5, fill: C.mag, weight: 700 });
    VZ.para(svg, 572, 212, "对角线论证：任何一张列表都能造出一个不在表里的实数。洞多到不可数。", { size: 10.5, per: 17, lh: 16 });
    var twinkle = [];
    for (var d = 0; d < 26; d++) twinkle.push(VZ.circ(svg, 574 + Math.random() * 156, 246 + Math.random() * 20, 1.6, { fill: C.mag, opacity: .2 }));
    VZ.raf(svg, function (t) {
      for (var i = 0; i < twinkle.length; i++) twinkle[i].setAttribute("opacity", .12 + .8 * Math.abs(Math.sin(t * .9 + i * 1.7)));
    });

    /* ---------- 右下：完备性与物理测量 ---------- */
    VZ.card(svg, 388, 282, 356, 66, { stroke: "rgba(255,255,255,.12)" });
    VZ.txt(svg, 400, 304, "完备性：任何有上界的非空集合都有最小上界。", { size: 11.5, fill: C.green });
    VZ.txt(svg, 400, 324, "极限、微分、积分能算下去，全靠这一条。", { size: 11, fill: C.ink2 });
    VZ.txt(svg, 400, 342, "物理测量只有有限精度 ┈▶ 理论却用实数全体（作者对此持保留）", { size: 11, fill: C.gold });
    VZ.travel(svg, "M" + nx0 + " " + ny + "H" + nx1, { color: C.gold, dur: 3.4, r: 3.5 });

    var pan = VZ.panel(stage, { "切点 x": "", "左集最大元": "无", "右集最小元": "无", "证明进度": "" });
    function sync() {
      VZ.setPanel(pan, {
        "切点 x": cutV.toFixed(6),
        "左集最大元": "无",
        "右集最小元": "无",
        "证明进度": (k + 1) + " / " + steps.length
      });
    }
    sync();
    var row = VZ.box(stage, "viz-ctl");
    VZ.btn(row, "下一步 ▸", function () { next(); sync(); });
    VZ.btn(row, "重来", function () { k = 0; paint(); sync(); });
  }
},

/* ==========================================================
   第 5 章 · 复对数的多值性
   ========================================================== */
"f-ch05": {
  title: "绕原点一圈，log z 的虚部就多出 2πi",
  hint: "拖动复数平面上的金色点 z 绕原点转动：它转回原处时，<b>函数值没有回来</b>——虚部每次累加 2πi。这不是计算误差，而是空间结构的直接后果：原点叫<b>分支点</b>，靠选主值只是权宜之计，真正的修法是把定义域扩大（第 8 章的黎曼面）。右下角用滑杆或快捷按钮改 b，看 a^b 的取值个数：<b>b 为整数只有 1 个，b = p/q 恰好 q 个（就是 n 次单位根）</b>。",
  legend: [["z 与射线", C.cyan], ["log z 的螺旋", C.mag], ["支割线", C.red], ["当前取值", C.gold]],
  draw: function (stage) {
    var W = 760, H = 440, svg = VZ.S(stage, W, H, { grid: true });
    var ox = 205, oy = 230, U = 60;
    var pan = VZ.panel(stage, {
      "z": "", "主值 arg z": "", "θ（已解绕）": "", "绕圈数 k": "", "log z 主值": "", "log z 的另一支": ""
    });

    /* ---------- 左：复平面 ---------- */
    VZ.ln(svg, 62, oy, 350, oy, { stroke: C.faint, "stroke-width": 1 });
    VZ.ln(svg, ox, 88, ox, 372, { stroke: C.faint, "stroke-width": 1 });
    VZ.txt(svg, 346, oy - 8, "Re", { size: 10.5, fill: C.dim, anchor: "end" });
    VZ.txt(svg, ox + 6, 98, "Im", { size: 10.5, fill: C.dim });
    VZ.circ(svg, ox, oy, U, { stroke: C.faint, "stroke-width": .8, "stroke-dasharray": "4 4" });
    VZ.circ(svg, ox, oy, 2 * U, { stroke: C.faint, "stroke-width": .8, "stroke-dasharray": "4 4", opacity: .6 });
    VZ.txt(svg, ox + U + 5, oy + 14, "|z|=1", { size: 9.5, fill: C.faint });
    VZ.txt(svg, ox + 2 * U + 5, oy + 14, "2", { size: 9.5, fill: C.faint });
    /* 支割线 */
    VZ.ln(svg, ox - 148, oy, ox - 6, oy, { stroke: C.red, "stroke-width": 2, "stroke-dasharray": "7 5", opacity: .85 });
    VZ.txt(svg, 68, oy - 10, "支割线 arg z = π", { size: 10.5, fill: C.red });
    VZ.txt(svg, ox - 20, oy + 20, "0（分支点）", { size: 10.5, fill: C.red, anchor: "end" });
    var trail = VZ.path(svg, "", VZ.stroke({ stroke: C.mag, "stroke-width": 1.4, opacity: .55 }));
    var ray = VZ.path(svg, "", VZ.stroke({ stroke: C.cyan, "stroke-width": 2 }));
    var zArc = VZ.path(svg, "", VZ.stroke({ stroke: C.gold, "stroke-width": 1.4, opacity: .8 }));
    var zDot = VZ.circ(svg, ox + U, oy, 7, { fill: C.gold, stroke: C.deep, "stroke-width": 1.5 });
    var zLbl = VZ.txt(svg, ox + U + 12, oy - 10, "z", { size: 12.5, fill: C.gold, weight: 700 });
    var hist = [], th = 0, rr = 1.55, prevA = 0;
    var wrapTxt = VZ.txt(svg, ox, 392, "", { size: 12.5, fill: C.gold, anchor: "middle", weight: 700 });
    wrapTxt.textContent = "绕原点一圈：z 回到原处，log z 的虚部多出 2πi";

    function wrap(v) { while (v > Math.PI) v -= 2 * Math.PI; while (v <= -Math.PI) v += 2 * Math.PI; return v; }
    function paintZ() {
      var X = ox + rr * U * Math.cos(th), Y = oy - rr * U * Math.sin(th);
      zDot.setAttribute("cx", X); zDot.setAttribute("cy", Y);
      zLbl.setAttribute("x", X + 12); zLbl.setAttribute("y", Y - 10);
      ray.setAttribute("d", "M" + ox + " " + oy + "L" + X + " " + Y);
      var a0 = wrap(th), d = th - a0;
      zArc.setAttribute("d", "M" + (ox + 26) + " " + oy + "A26 26 0 " + (Math.abs(d) > Math.PI ? 1 : 0) + " " + (d > 0 ? 0 : 1) + " " +
        fx(ox + 26 * Math.cos(th), 1) + " " + fx(oy - 26 * Math.sin(th), 1));
      hist.push([X, Y]); if (hist.length > 340) hist.shift();
      trail.setAttribute("d", hist.length > 1 ? dOf(hist) : "");
      var kk = Math.round((th - a0) / (2 * Math.PI));
      VZ.setPanel(pan, {
        "z": rr.toFixed(3) + "·e^(i·" + a0.toFixed(3) + ")",
        "主值 arg z": (a0 * D).toFixed(1) + "°",
        "θ（已解绕）": th.toFixed(3) + " rad",
        "绕圈数 k": String(kk),
        "log z 主值": Math.log(rr).toFixed(3) + " + " + a0.toFixed(3) + "i",
        "log z 的另一支": Math.log(rr).toFixed(3) + " + " + (a0 + 2 * Math.PI).toFixed(3) + "i"
      });
      /* 螺旋上的光点 */
      var tdisp = clamp(th, -3 * Math.PI, 3 * Math.PI);
      hDot.setAttribute("cx", hx(0)); hDot.setAttribute("cy", hy(tdisp));
      hDot2.setAttribute("cx", hx(0)); hDot2.setAttribute("cy", hy(tdisp + 2 * Math.PI));
      /* a^b 圆上的取值 */
      paintPowers();
    }
    var which = -1;
    VZ.drag(svg, svg, W, H, function (x, y, phase) {
      if (x < 30 || x > 384 || y < 82 || y > 378) return;
      var dx = (x - ox) / U, dy = -(y - oy) / U;
      var na = Math.atan2(dy, dx);
      if (phase === "start") { prevA = na; auto = false; return; }
      var dth = wrap(na - prevA);
      if (Math.abs(dth) > 1.2) dth = 0;
      th += dth; prevA = na;
      rr = clamp(Math.hypot(dx, dy), 0.25, 2.3);
      paintZ();
    });

    /* ---------- 右上：复对数的螺旋 ---------- */
    VZ.card(svg, 398, 28, 346, 200, { stroke: "rgba(255,255,255,.13)" });
    VZ.txt(svg, 414, 52, "log z = log r + iθ　多值，相邻取值差 2πi", { size: 13, fill: C.mag, weight: 700 });
    var hbx = 472, hby = 174, hk = 15;
    function hx(t) { return hbx + 40 * Math.cos(t); }
    function hy(t) { return hby - hk * (t / Math.PI); }
    var hd = "";
    for (var s = -3 * Math.PI; s <= 3 * Math.PI + 1e-6; s += 0.12) hd += (hd ? "L" : "M") + fx(hx(s), 1) + " " + fx(hy(s), 1);
    VZ.path(svg, hd, VZ.stroke({ stroke: C.mag, "stroke-width": 2.2, opacity: .9 }));
    [-1, 0, 1].forEach(function (kk) {
      var yy = hby - 2 * hk * kk;
      VZ.ln(svg, 414, yy, 512, yy, { stroke: C.faint, "stroke-width": .8, "stroke-dasharray": "4 4" });
      VZ.ln(svg, hbx, yy, hbx + 40, yy, { stroke: C.dim, "stroke-width": .9 });
      VZ.txt(svg, 522, yy + 4, "Im = " + (kk === 0 ? "0（主值）" : (kk > 0 ? "+2π（k = +1）" : "−2π（k = −1）")), { size: 10.5, fill: kk === 0 ? C.gold : C.dim });
    });
    VZ.txt(svg, 522, 221, "每绕一圈上升一层，可无限延伸", { size: 10.5, fill: C.ink2 });
    var hDot = VZ.circ(svg, hx(0), hy(0), 6.5, { fill: C.cyan, stroke: C.deep, "stroke-width": 1.4 });
    var hDot2 = VZ.circ(svg, hx(0), hy(0), 4.5, { fill: C.cyan, opacity: .35 });
    VZ.travel(svg, hd, { color: C.gold, dur: 4.2, r: 3.5 });

    /* ---------- 右下：a^b 的多值 ---------- */
    VZ.card(svg, 398, 240, 346, 180, { stroke: "rgba(255,255,255,.13)" });
    VZ.txt(svg, 414, 264, "a^b = exp(b·log a)：一般也多值", { size: 13, fill: C.cyan, weight: 700 });
    var pcx = 492, pcy = 338, pU = 38, B = 0.5;
    VZ.circ(svg, pcx, pcy, pU * 2, { stroke: C.faint, "stroke-width": .7, "stroke-dasharray": "3 4", opacity: .6 });
    VZ.ln(svg, pcx - 86, pcy, pcx + 86, pcy, { stroke: C.faint, "stroke-width": .8 });
    VZ.ln(svg, pcx, pcy - 86, pcx, pcy + 86, { stroke: C.faint, "stroke-width": .8 });
    var pDots = [], pArc = VZ.circ(svg, pcx, pcy, pU, { stroke: C.cyan, "stroke-width": 1, "stroke-dasharray": "4 4", opacity: .7 });
    for (var z2 = 0; z2 < 7; z2++) pDots.push(VZ.circ(svg, pcx, pcy, 5.5, { fill: C.gold, opacity: .9 }));
    var pMain = VZ.txt(svg, 580, 288, "", { size: 11.5, fill: C.gold, weight: 700 });
    var pNum = VZ.txt(svg, 580, 308, "", { size: 11, fill: C.cyan });
    VZ.para(svg, 580, 328, "取值 = 2^b·e^(2πikb)。b 为整数 → 只有 1 个值；b = p/q → 恰好 q 个值，即 n 次单位根（§5.5）；b 无理 → 在圆上稠密。", { size: 10.5, per: 16, lh: 15 });
    VZ.txt(svg, 580, 402, "i^i = e^(−π/2) ≈ 0.2079（一个纯实数）", { size: 10.5, fill: C.gold });
    var powerN = 7;
    function paintPowers() {
      var rad = pU * Math.pow(2, B - 1);
      if (rad > 84) rad = 84; if (rad < 8) rad = 8;
      pArc.setAttribute("r", rad);
      var cnt = 0, angs = [];
      for (var kk = -3; kk <= 3; kk++) {
        var ang = 2 * Math.PI * kk * B;
        angs.push(ang);
        pDots[kk + 3].setAttribute("cx", fx(pcx + rad * Math.cos(ang), 1));
        pDots[kk + 3].setAttribute("cy", fx(pcy - rad * Math.sin(ang), 1));
        pDots[kk + 3].setAttribute("opacity", Math.abs(kk) > 2 ? .28 : .92);
      }
      for (var i2 = 0; i2 < angs.length; i2++) {
        var u2 = ((angs[i2] % (2 * Math.PI)) + 2 * Math.PI) % (2 * Math.PI);
        var ok = true;
        for (var j2 = 0; j2 < i2; j2++) {
          var v2 = ((angs[j2] % (2 * Math.PI)) + 2 * Math.PI) % (2 * Math.PI);
          if (Math.abs(u2 - v2) < 1e-6 || Math.abs(Math.abs(u2 - v2) - 2 * Math.PI) < 1e-6) ok = false;
        }
        if (ok) cnt++;
      }
      pMain.textContent = "主值 2^b = " + Math.pow(2, B).toFixed(4);
      pNum.textContent = "b 在 7 个 k 上给出 " + cnt + " 个不同取值";
      pNum.setAttribute("fill", cnt === 1 ? C.green : C.cyan);
    }
    paintPowers();
    paintZ();

    /* 开场自动绕一圈：直观演示「z 回到原处，虚部已多出 2πi」；用户一拖即停 */
    var auto = true, lastMs = 0;
    VZ.raf(svg, function (t, ms) {
      var dt = Math.min((ms - lastMs) / 1000, 0.05); lastMs = ms;
      if (auto && dt > 0) { th += dt * 0.5; paintZ(); }
    });

    var row = VZ.box(stage, "viz-ctl");
    VZ.slider(row, {
      label: "复幂的指数 b", min: 0, max: 2.5, step: 0.01, value: 0.5,
      format: function (v) { return "b = " + v.toFixed(2); },
      onInput: function (v) { B = v; paintPowers(); }
    });
    var bSlider = null;
    VZ.chips(row, ["b = 1", "b = 2", "b = 1/2", "b = 1/3", "b = √2"], "b = 1/2", function (m) {
      B = m === "b = 1" ? 1 : m === "b = 2" ? 2 : m === "b = 1/2" ? 0.5 : m === "b = 1/3" ? 1 / 3 : Math.SQRT2;
      var inputs = row.querySelectorAll("input[type=range]");
      if (inputs.length) { inputs[0].value = B; }
      paintPowers();
    });
    paintZ();
  }
},

/* ==========================================================
   第 6 章 · 实变微积分
   ========================================================== */
"f-ch06": {
  title: "导数就是切线斜率；而 x|x| 只有一次可导",
  hint: "拖动曲线上的金色切点（或用滑杆），看青色切线跟着转：<b>f′(x) 就是这条切线的斜率</b>。左下角是 x|x| 在 0 处的特写：它的一阶导数存在（f′(0)=0，绿色水平线），但二阶导数在 0 处从 −2 跳到 +2——所以「两次可导」严格强于「一次可导」。右边两栏是本章的两个结论：<b>微分总能做，积分常常做不出来</b>（e^(−x²) 就没有初等原函数），而欧拉那套过严的函数现在复数里恰好成立。",
  legend: [["f(x) 与切线", C.cyan], ["切点与斜率三角", C.gold], ["f′(x) = 2|x|", C.mag], ["一阶切线（水平）", C.green]],
  draw: function (stage) {
    var W = 760, H = 440, svg = VZ.S(stage, W, H, { grid: true });

    /* ---------- 上：可拖动切点 ---------- */
    VZ.card(svg, 20, 28, 396, 236, { stroke: "rgba(255,255,255,.13)" });
    VZ.txt(svg, 36, 50, "拖动切点：导数 = 切线斜率", { size: 13.5, fill: C.cyan, weight: 700 });
    var rd = VZ.txt(svg, 36, 72, "", { size: 11.5, fill: C.gold });
    var ax = 218, ay = 170, U = 95;
    function fn(x) { return x * x * x / 3 - x; }
    function dfn(x) { return x * x - 1; }
    VZ.ln(svg, 48, ay, 390, ay, { stroke: C.faint, "stroke-width": 1 });
    VZ.ln(svg, ax, 100, ax, 244, { stroke: C.faint, "stroke-width": 1 });
    for (var gx = -1; gx <= 1; gx++) {
      VZ.ln(svg, ax + gx * U, 104, ax + gx * U, 240, { stroke: C.faint, "stroke-width": .6, opacity: .4 });
      if (gx) VZ.txt(svg, ax + gx * U, ay + 14, String(gx), { size: 9.5, fill: C.dim, anchor: "middle" });
    }
    VZ.txt(svg, 388, ay - 8, "x", { size: 10.5, fill: C.dim, anchor: "end" });
    VZ.txt(svg, ax + 6, 110, "y", { size: 10.5, fill: C.dim });
    var cd = "";
    for (var i = 0; i <= 160; i++) {
      var xv = -1.8 + 3.6 * i / 160;
      cd += (i ? "L" : "M") + fx(ax + xv * U, 1) + " " + fx(ay - fn(xv) * U, 1);
    }
    var curve = VZ.path(svg, cd, VZ.stroke({ stroke: C.cyan, "stroke-width": 2.2 }));
    VZ.travel(svg, cd, { color: C.gold, dur: 4.6, count: 2, r: 3.4 });
    var tanLine = VZ.path(svg, "", VZ.stroke({ stroke: C.cyan, "stroke-width": 1.6, opacity: .95, "stroke-dasharray": "6 4" }));
    var legX = VZ.path(svg, "", VZ.stroke({ stroke: C.green, "stroke-width": 1.6 }));
    var legY = VZ.path(svg, "", VZ.stroke({ stroke: C.gold, "stroke-width": 1.6 }));
    var legTxt = VZ.txt(svg, 0, 0, "", { size: 10.5, fill: C.gold });
    var vGuide = VZ.path(svg, "", VZ.stroke({ stroke: C.faint, "stroke-width": .9, "stroke-dasharray": "3 3" }));
    var tDot = VZ.circ(svg, ax, ay, 7, { fill: C.gold, stroke: C.deep, "stroke-width": 1.5 });
    var X0 = 48, X1 = 388, Y0 = 100, Y1 = 242;
    var xc = 0.55;
    function paintTan() {
      var px = ax + xc * U, py = ay - fn(xc) * U, sl = dfn(xc);
      tDot.setAttribute("cx", fx(px, 1)); tDot.setAttribute("cy", fx(py, 1));
      vGuide.setAttribute("d", "M" + fx(px, 1) + " " + fx(py, 1) + "V" + ay);
      var tmin = X0 - px, tmax = X1 - px;
      if (Math.abs(sl) > 1e-6) {
        var t1 = (py - Y1) / sl, t2 = (py - Y0) / sl;
        tmin = Math.max(tmin, Math.min(t1, t2)); tmax = Math.min(tmax, Math.max(t1, t2));
      } else { tmin = Math.max(tmin, 0); }
      tanLine.setAttribute("d", "M" + fx(px + tmin, 1) + " " + fx(py - sl * tmin, 1) + "L" + fx(px + tmax, 1) + " " + fx(py - sl * tmax, 1));
      /* Δx = 1 的斜率三角 */
      var ex = px + U, ey = py - sl * U;
      legX.setAttribute("d", "M" + fx(px, 1) + " " + fx(py, 1) + "L" + fx(ex, 1) + " " + fx(py, 1));
      legY.setAttribute("d", "M" + fx(ex, 1) + " " + fx(py, 1) + "L" + fx(ex, 1) + " " + fx(ey, 1));
      legTxt.setAttribute("x", fx(ex + 5, 1)); legTxt.setAttribute("y", fx((py + ey) / 2 + 3, 1));
      legTxt.textContent = "f′ = " + sl.toFixed(2);
      rd.textContent = "x = " + xc.toFixed(2) + "　f(x) = " + fn(xc).toFixed(3) + "　f′(x) = " + sl.toFixed(3) +
        (Math.abs(sl) < .05 ? "（切线水平：极值点）" : "");
      VZ.setPanel(pan, {
        "x": xc.toFixed(3),
        "f(x) = x³/3 − x": fn(xc).toFixed(4),
        "f′(x) = x² − 1": sl.toFixed(4),
        "切线斜率": sl.toFixed(4),
        "切线方程": "y = " + sl.toFixed(2) + "x " + (fn(xc) - sl * xc >= 0 ? "+ " : "− ") + Math.abs(fn(xc) - sl * xc).toFixed(2)
      });
    }
    var dragging = false;
    VZ.drag(svg, svg, W, H, function (x, y, phase) {
      if (phase === "start") dragging = (x > 30 && x < 400 && y > 84 && y < 258);
      if (!dragging) return;
      xc = clamp((x - ax) / U, -1.75, 1.75);
      paintTan();
    });

    /* ---------- 左下：x|x| 特写 ---------- */
    VZ.card(svg, 20, 272, 396, 136, { stroke: "rgba(255,255,255,.13)" });
    VZ.txt(svg, 36, 292, "x|x| 在 x = 0 处的特写", { size: 13, fill: C.gold, weight: 700 });
    var bx = 150, by = 366, ux = 90, uy = 38;
    VZ.ln(svg, 48, by, 244, by, { stroke: C.faint, "stroke-width": 1 });
    VZ.ln(svg, bx, 292, bx, 404, { stroke: C.faint, "stroke-width": 1 });
    var a1 = "", a2 = "";
    for (var j = 0; j <= 80; j++) {
      var xj = -1 + 2 * j / 80;
      a1 += (j ? "L" : "M") + fx(bx + xj * ux, 1) + " " + fx(by - xj * Math.abs(xj) * uy, 1);
    }
    VZ.path(svg, a1, VZ.stroke({ stroke: C.cyan, "stroke-width": 2.2 }));
    for (var j2 = 0; j2 <= 80; j2++) {
      var xk = -1 + 2 * j2 / 80;
      a2 += (j2 ? "L" : "M") + fx(bx + xk * ux, 1) + " " + fx(by - 2 * Math.abs(xk) * uy, 1);
    }
    VZ.path(svg, a2, VZ.stroke({ stroke: C.mag, "stroke-width": 1.6, "stroke-dasharray": "5 4" }));
    VZ.ln(svg, 48, by, 244, by, { stroke: C.green, "stroke-width": 2.5, opacity: .95 });
    VZ.txt(svg, 62, by - 8, "f′(0) = 0", { size: 10.5, fill: C.green });
    VZ.txt(svg, 62, 306, "f′ = 2|x|", { size: 10.5, fill: C.mag });
    VZ.txt(svg, bx, by + 14, "0", { size: 9.5, fill: C.dim, anchor: "middle" });
    VZ.txt(svg, 252, 306, "f 在 0 处一阶可导：f′(0) = 0", { size: 10.5, fill: C.green });
    VZ.txt(svg, 252, 324, "但 f″ 在 0 处从 −2 跳到 +2 ⇒ f″ 不存在", { size: 10.5, fill: C.mag });
    VZ.txt(svg, 252, 344, "两次可导 ⊊ 一次可导", { size: 11.5, fill: C.gold, weight: 700 });
    VZ.txt(svg, 252, 362, "x > 0 → f′ = +2x；x < 0 → f′ = −2x", { size: 10.5, fill: C.dim });
    VZ.txt(svg, 252, 382, "C¹ 光滑 = 连续可导，且导数也连续", { size: 10.5, fill: C.ink2 });

    /* ---------- 右栏 ---------- */
    VZ.card(svg, 428, 28, 316, 176, { stroke: "rgba(255,255,255,.13)" });
    VZ.txt(svg, 444, 52, "两代函数观", { size: 13.5, fill: C.violet, weight: 700 });
    VZ.para(svg, 444, 76, "欧拉：函数 = 由单一解析表达式给出。按这个标准，像 x|x| 这样分段定义的东西算不算函数，成了问题。", { size: 11, per: 24, lh: 17 });
    VZ.para(svg, 444, 130, "现代：函数 = 任意映射，可以极其病态。代价是函数变得无比庞杂；好处是「光滑」终于可以被精确定义。", { size: 11, per: 24, lh: 17 });
    VZ.para(svg, 444, 172, "欧拉的坚持指对了地方：把 x 换成 z 之后，「由一个表达式给出」与「复可微」几乎重合（第 7 章）。", { size: 11, per: 24, lh: 17, fill: C.gold });

    VZ.card(svg, 428, 216, 316, 192, { stroke: "rgba(255,255,255,.13)" });
    VZ.txt(svg, 444, 240, "微分容易，积分困难", { size: 13.5, fill: C.cyan, weight: 700 });
    VZ.para(svg, 444, 264, "微分是局部操作：和、积、商、复合、反函数各有公式，任何初等表达式都能按规则拆开求导。", { size: 11, per: 24, lh: 17 });
    VZ.para(svg, 444, 316, "积分是整体操作：e^(−x²) 就没有初等原函数——这正是正态分布要用 erf 这种特殊函数的原因。", { size: 11, per: 24, lh: 17, fill: C.mag });
    VZ.para(svg, 444, 368, "这个反差在第 7 章整个翻过来：复分析里积分反而成了更容易的一方。", { size: 11, per: 24, lh: 17, fill: C.gold });

    var pan = VZ.panel(stage, { "x": "", "f(x) = x³/3 − x": "", "f′(x) = x² − 1": "", "切线斜率": "", "切线方程": "" });
    var row = VZ.box(stage, "viz-ctl");
    VZ.slider(row, {
      label: "切点的 x 坐标", min: -1.75, max: 1.75, step: 0.01, value: 0.55,
      format: function (v) { return "x = " + v.toFixed(2); },
      onInput: function (v) { xc = v; paintTan(); }
    });
    paintTan();
  }
},

/* ==========================================================
   第 7 章 · 复变微积分：围道积分与柯西定理
   ========================================================== */
"f-ch07": {
  title: "围道可以随便变形，只要不跨过奇点",
  hint: "拖动四个<b>控制点</b>把围道捏成任意形状（拖围道内部可以整体搬走），盯住下方读数：只要奇点还在围道里，∮ dz/z 就一直是 <b>2πi</b>；一旦把它甩到外面，积分立刻塌成 <b>0</b>——这就是柯西定理。<span class='hl'>回路积分只由内部奇点的留数决定，跟路径的具体形状毫无关系。</span>这也正是实数里算不出的积分，在复数里变成一次代数计算的原因。",
  legend: [["围道（逆时针）", C.gold], ["未变形的圆", C.faint], ["奇点 1/z 的极点", C.red], ["流动方向", C.cyan]],
  draw: function (stage) {
    var W = 760, H = 440, svg = VZ.S(stage, W, H, { grid: true });
    var ox = 200, oy = 226;

    /* 平面 */
    VZ.ln(svg, 46, oy, 356, oy, { stroke: C.faint, "stroke-width": 1 });
    VZ.ln(svg, ox, 76, ox, 376, { stroke: C.faint, "stroke-width": 1 });
    VZ.txt(svg, 352, oy - 8, "Re", { size: 10.5, fill: C.dim, anchor: "end" });
    VZ.txt(svg, ox + 6, 86, "Im", { size: 10.5, fill: C.dim });
    VZ.txt(svg, 54, 96, "复平面", { size: 11, fill: C.dim });

    /* 奇点 */
    VZ.circ(svg, ox, oy, 13, { stroke: C.red, "stroke-width": 1, opacity: .45, "stroke-dasharray": "3 3" });
    VZ.circ(svg, ox, oy, 6, { fill: C.red });
    VZ.txt(svg, ox + 12, oy + 22, "奇点 1/z", { size: 11, fill: C.red });

    /* 未变形的参考圆 */
    VZ.circ(svg, ox, oy, 72, { stroke: C.faint, "stroke-width": 1, "stroke-dasharray": "5 5", opacity: .8 });
    VZ.txt(svg, ox - 76, oy - 78, "原始圆 |z| = 1", { size: 10, fill: C.dim, anchor: "middle" });

    /* 控制点（逆时针） */
    var R0 = 72, ctr = [ox, oy], Hp = [];
    for (var i = 0; i < 4; i++) {
      var a0 = Math.PI / 4 - i * Math.PI / 2;
      Hp.push([ox + R0 * Math.cos(a0), oy + R0 * Math.sin(a0)]);
    }
    var cPath = VZ.path(svg, smoothClosed(Hp), VZ.stroke({ stroke: C.gold, "stroke-width": 2.4, opacity: .95 }));
    var handles = Hp.map(function () {
      return VZ.circ(svg, 0, 0, 6.5, { fill: C.gold, stroke: C.deep, "stroke-width": 1.4 });
    });
    var flowDots = [];
    for (var f = 0; f < 5; f++) flowDots.push(VZ.circ(svg, 0, 0, 3.6, { fill: C.cyan, opacity: .9 }));
    var ctrHandle = VZ.circ(svg, ox, oy, 9, { fill: "none", stroke: C.violet, "stroke-width": 1.6, "stroke-dasharray": "3 3" });
    var flash = VZ.txt(svg, ox, 420, "", { size: 14, fill: C.gold, anchor: "middle", weight: 700 });
    var cntTxt = VZ.txt(svg, ox, 398, "", { size: 11.5, fill: C.ink2, anchor: "middle" });

    var inside = true, last = true, flashAt = -9, n0 = 0;
    function refresh(t) {
      cPath.setAttribute("d", smoothClosed(Hp));
      for (var i = 0; i < 4; i++) {
        handles[i].setAttribute("cx", fx(Hp[i][0], 1)); handles[i].setAttribute("cy", fx(Hp[i][1], 1));
      }
      var cxAvg = 0, cyAvg = 0;
      for (var j = 0; j < 4; j++) { cxAvg += Hp[j][0] / 4; cyAvg += Hp[j][1] / 4; }
      ctrHandle.setAttribute("cx", fx(cxAvg, 1)); ctrHandle.setAttribute("cy", fx(cyAvg, 1));
      var poly = sampleClosed(Hp, 26);
      inside = inPoly([ox, oy], poly);
      /* 流向光点 */
      var cum = [0];
      for (var s = 1; s <= poly.length; s++) {
        var A2 = poly[s - 1], B2 = poly[s % poly.length];
        cum.push(cum[s - 1] + Math.hypot(B2[0] - A2[0], B2[1] - A2[1]));
      }
      var tot = cum[poly.length];
      function at(u) {
        var L2 = ((u % 1) + 1) % 1 * tot, lo = 0, hi = cum.length - 1;
        while (lo < hi - 1) { var mid = (lo + hi) >> 1; if (cum[mid] <= L2) lo = mid; else hi = mid; }
        var seg = Math.max(cum[hi] - cum[lo], 1e-6), k2 = (L2 - cum[lo]) / seg;
        return [VZ.lerp(poly[lo][0], poly[hi][0], k2), VZ.lerp(poly[lo][1], poly[hi][1], k2)];
      }
      for (var m = 0; m < flowDots.length; m++) {
        var pt = at((t || 0) * 0.24 + m / flowDots.length);
        flowDots[m].setAttribute("cx", fx(pt[0], 1)); flowDots[m].setAttribute("cy", fx(pt[1], 1));
      }
      cPath.setAttribute("stroke", inside ? C.gold : C.violet);
      if (inside !== last) { flashAt = (t || 0); last = inside; }
      var el = (t || 0) - flashAt;
      if (el < 1.6) {
        flash.setAttribute("opacity", 1 - el / 1.6);
        flash.textContent = inside ? "奇点被套住 → 跳变 +2πi" : "奇点脱出 → 跳变 −2πi";
      } else flash.setAttribute("opacity", 0);
      cntTxt.textContent = inside
        ? "围道包住奇点：∮ dz/z = 2πi ≈ 6.2832i"
        : "围道没包住奇点：∮ dz/z = 0（可连续收缩成一点）";
      cntTxt.setAttribute("fill", inside ? C.gold : C.violet);
      VZ.setPanel(pan, {
        "绕数 n": inside ? "1" : "0",
        "∮ dz/z": inside ? "2πi ≈ 6.2832i" : "0",
        "积分是否随变形改变": inside ? "不改变（同一个值）" : "不改变（一直是 0）",
        "跨度类型": inside ? "围道跨过奇点" : "围道未跨过奇点",
        "可连续收缩为一点": inside ? "否（被奇点挡住）" : "是（积分仍为 0）"
      });
    }

    var mode = null, grab = [0, 0], orig = null;
    VZ.drag(svg, svg, W, H, function (x, y, phase) {
      if (phase === "start") {
        if (x > 380) { mode = null; return; }
        mode = null;
        var best = 30;
        for (var i = 0; i < 4; i++) {
          var dd = Math.hypot(x - Hp[i][0], y - Hp[i][1]);
          if (dd < best) { best = dd; mode = i; }
        }
        if (mode === null) {
          if (inPoly([x, y], sampleClosed(Hp, 20))) { mode = "move"; grab = [x, y]; orig = Hp.map(function (p) { return [p[0], p[1]]; }); }
          else return;
        }
      }
      if (mode === null) return;
      if (mode === "move") {
        var ddx = x - grab[0], ddy = y - grab[1];
        for (var j = 0; j < 4; j++) {
          Hp[j][0] = clamp(orig[j][0] + ddx, 56, 348);
          Hp[j][1] = clamp(orig[j][1] + ddy, 90, 366);
        }
      } else if (typeof mode === "number") {
        Hp[mode][0] = clamp(x, 56, 348);
        Hp[mode][1] = clamp(y, 90, 366);
      }
      refresh(n0);
    });

    /* ---------- 右栏 ---------- */
    VZ.card(svg, 392, 28, 352, 118, { stroke: "rgba(255,255,255,.13)" });
    VZ.txt(svg, 408, 52, "复可微为什么强得离谱", { size: 13.5, fill: C.cyan, weight: 700 });
    VZ.para(svg, 408, 74, "实可微：h 只从左右两边来 → 弱、局部。复可微：h 从无穷多个方向趋于 0，还要求极限同一个值 → 强、近乎刚性。", { size: 11, per: 27, lh: 17 });
    VZ.para(svg, 408, 122, "全纯 ⇔ 解析 ⇔ 有幂级数展开 ⇔ 无穷次可微：三件事其实是同一件事。", { size: 11, per: 27, lh: 17, fill: C.gold });

    VZ.card(svg, 392, 154, 352, 118, { stroke: "rgba(255,255,255,.13)" });
    VZ.txt(svg, 408, 178, "柯西定理 → 留数定理", { size: 13.5, fill: C.gold, weight: 700 });
    VZ.para(svg, 408, 200, "柯西定理：若 f 在回路内部处处全纯，则 ∮ f(z) dz = 0。推论：积分只依赖端点与拓扑，回路可任意变形、可拆分。", { size: 11, per: 27, lh: 17 });
    VZ.para(svg, 408, 248, "留数定理：∮ 被内部奇点的留数完全决定——实数里算不出的积分，在复数里变成一次代数计算。", { size: 11, per: 27, lh: 17, fill: C.mag });

    VZ.card(svg, 392, 280, 352, 128, { stroke: "rgba(255,255,255,.13)" });
    VZ.txt(svg, 408, 304, "解析延拓：收敛圆不是边界", { size: 13.5, fill: C.violet, weight: 700 });
    VZ.para(svg, 408, 326, "在圆边界附近另取一点重新展开，定义域被接力推出去。唯一性：两个全纯函数只要在一小片（有聚点）上一致，就在整个连通域上一致。", { size: 11, per: 27, lh: 17 });
    VZ.txt(svg, 408, 398, "Cauchy 1821 年发现这一切——那时 Euler 已去世 38 年。", { size: 10.5, fill: C.dim });

    var pan = VZ.panel(stage, { "绕数 n": "", "∮ dz/z": "", "积分是否随变形改变": "", "跨度类型": "", "可连续收缩为一点": "" });
    var row = VZ.box(stage, "viz-ctl");
    VZ.btn(row, "还原成正圆", function () {
      for (var j = 0; j < 4; j++) {
        var a1 = Math.PI / 4 - j * Math.PI / 2;
        Hp[j] = [ox + R0 * Math.cos(a1), oy + R0 * Math.sin(a1)];
      }
      refresh(n0);
    });
    VZ.btn(row, "把围道搬到奇点外", function () {
      for (var j = 0; j < 4; j++) {
        var a2 = Math.PI / 4 - j * Math.PI / 2;
        Hp[j] = [295 + 46 * Math.cos(a2), oy + 46 * Math.sin(a2)];
      }
      refresh(n0);
    });
    VZ.raf(svg, function (t) { n0 = t; refresh(t); });
    refresh(0);
  }
}

  });
})();

/* ============================================================
   viz-a2.js — 《通向实在之路》第 8–12 章交互图示
     f-ch08 黎曼球 · f-ch09 傅里叶分解 · f-ch10 柯西–黎曼方程
     f-ch11 四元数 · f-ch12 n 维流形
   颜色只用 VZ.C；中文字符串里不出现直双引号（引用一律用「」）。
   ============================================================ */
VZ.define({

/* ==========================================================
   第 8 章 · 黎曼球
   ========================================================== */
"f-ch08": {
  title: "黎曼球：复平面加上一个无穷远点，就收成一个紧致的球面",
  hint: "拖动球体可以转动经纬线框。金色的点沿子午线爬向北极 ∞，它在复平面上的像同时被推得越来越远——<b>∞ 不再是一个过程，而是球上一个普通的位置</b>。球面亏格 0（没有洞），环面亏格 1；g ≥ 2 时模参数有 3g − 3 个。<span class='hl'>第 9 章的频率分解、§18.5 的天球、第 22 章的自旋二态，用的是同一个球。</span>",
  legend: [["球面经纬线", VZ.C.dim], ["赤道与实/虚轴", VZ.C.ink2], ["爬向 ∞ 的点与它在平面上的像", VZ.C.gold], ["|z| = 1 与亏格 1 的环面", VZ.C.mag]],
  draw: function (stage) {
    var W = 760, H = 470, svg = VZ.S(stage, W, H, { grid: true });
    var C = VZ.C;
    var cx = 380, cy = 150, R = 88, pcy = cy + R;
    var prx = 350, pry = 52, kD = pry / prx, Rmax = prx / R;

    /* ---------------- 复平面（透视压扁的圆盘） ---------------- */
    VZ.el("ellipse", { cx: cx, cy: pcy, rx: prx, ry: pry, fill: "rgba(255,255,255,.03)", stroke: C.faint, "stroke-width": 1.1 }, svg);
    var g;
    for (g = -3.6; g <= 3.61; g += 0.6) {
      if (Math.abs(g) < 0.01) continue;
      var hy = Math.sqrt(Math.max(0, Rmax * Rmax - g * g)) * R * kD;
      VZ.ln(svg, cx + g * R, pcy - hy, cx + g * R, pcy + hy, { stroke: C.faint, "stroke-width": .6, opacity: .5 });
      var hx = Math.sqrt(Math.max(0, Rmax * Rmax - g * g)) * R;
      VZ.ln(svg, cx - hx, pcy - g * R * kD, cx + hx, pcy - g * R * kD, { stroke: C.faint, "stroke-width": .6, opacity: .5 });
    }
    VZ.ln(svg, cx - prx, pcy, cx + prx, pcy, { stroke: C.ink2, "stroke-width": 1.1, opacity: .55 });
    VZ.ln(svg, cx, pcy - pry, cx, pcy + pry, { stroke: C.ink2, "stroke-width": 1.1, opacity: .55 });
    VZ.el("ellipse", { cx: cx, cy: pcy, rx: R, ry: R * kD, fill: "none", stroke: C.mag, "stroke-width": 1.2, "stroke-dasharray": "5 4" }, svg);
    VZ.txt(svg, cx - R - 8, pcy - 16, "|z| = 1", { size: 11.5, fill: C.mag, anchor: "end" });
    VZ.txt(svg, cx - prx + 8, pcy - 9, "实轴 Re z", { size: 11, fill: C.dim });
    VZ.txt(svg, cx + 7, pcy - pry - 9, "虚轴 Im z", { size: 11, fill: C.dim });
    VZ.txt(svg, 246, 274, "复平面 ℂ（深度方向已压缩）", { size: 12, fill: C.ink2, anchor: "middle" });
    VZ.txt(svg, cx, pcy + 30, "（南极）", { size: 9.5, fill: C.gold, anchor: "middle" });

    /* 平面上的几个像点（与球面连线） */
    [0.5, 1.5, 2.5, -0.5, -1.5].forEach(function (X) {
      VZ.ln(svg, cx, cy - R, cx + X * R, pcy, { stroke: C.faint, "stroke-width": .9, opacity: .8 });
      VZ.circ(svg, cx + X * R, pcy, 3.4, { fill: C.ink2 });
      VZ.txt(svg, cx + X * R, pcy + 15, (X > 0 ? "z = " + X.toFixed(1) : "z = −" + Math.abs(X).toFixed(1)),
        { size: 10.5, fill: C.dim, anchor: "middle" });
    });
    var arV = VZ.arrowDef(svg, VZ.uid("av"), C.violet);
    VZ.path(svg, "M" + (cx + prx - 66) + " " + pcy + "L" + (cx + prx - 6) + " " + pcy,
      VZ.stroke({ stroke: C.violet, "stroke-width": 1.3, "stroke-dasharray": "5 4", opacity: .9, "marker-end": arV }));
    VZ.txt(svg, cx + prx - 10, pcy - 20, "→∞ = 北极 N", { size: 11, fill: C.violet, anchor: "end" });
    VZ.txt(svg, cx, 26, "平面上的整条边界都收到北极：直线与圆在球面上不再分家", { size: 11.5, fill: C.violet, anchor: "middle", opacity: .85 });

    /* ---------------- 球面（半透明玻璃球 + 经纬线框） ---------------- */
    VZ.el("ellipse", { cx: cx, cy: cy, rx: R, ry: R, fill: "rgba(16,10,42,.7)", stroke: C.faint, "stroke-width": 1 }, svg);
    VZ.el("ellipse", { cx: cx - R * 0.3, cy: cy - R * 0.34, rx: R * 0.5, ry: R * 0.42, fill: "rgba(255,255,255,.05)" }, svg);

    var yaw = 0.55, pitch = -0.4, lastDrag = -99, nowT = 0;
    function rot3(p) {
      var cyw = Math.cos(yaw), syw = Math.sin(yaw), cp = Math.cos(pitch), sp = Math.sin(pitch);
      var x1 = p[0] * cyw - p[1] * syw, y1 = p[0] * syw + p[1] * cyw, z1 = p[2];
      return [x1, y1 * cp - z1 * sp, y1 * sp + z1 * cp];
    }
    var descs = [];
    [0, 30, -30, 60, -60].forEach(function (la) { descs.push({ la: la * Math.PI / 180 }); });
    [0, 30, 60, 90, 120, 150].forEach(function (lo) { descs.push({ lo: lo * Math.PI / 180 }); });
    var wires = descs.map(function (d) {
      var eq = d.la === 0;
      return {
        d: d,
        front: VZ.path(svg, "", VZ.stroke({ stroke: eq ? C.ink2 : C.dim, "stroke-width": eq ? 1.6 : .9, opacity: .95 })),
        back: VZ.path(svg, "", VZ.stroke({ stroke: eq ? C.ink2 : C.dim, "stroke-width": eq ? 1 : .8, opacity: eq ? .45 : .28 }))
      };
    });
    function pt3(d, t) {
      if (d.la !== undefined) return [Math.cos(d.la) * Math.cos(t), Math.cos(d.la) * Math.sin(t), Math.sin(d.la)];
      return [Math.cos(t) * Math.cos(d.lo), Math.cos(t) * Math.sin(d.lo), Math.sin(t)];
    }
    function updateWire() {
      wires.forEach(function (w) {
        var df = "", db = "", lf = 0, lb = 0;
        for (var i = 0; i <= 44; i++) {
          var p = rot3(pt3(w.d, i / 44 * Math.PI * 2));
          var sx = (cx + R * p[0]).toFixed(1), sy = (cy - R * p[2]).toFixed(1);
          if (p[1] < 0) { df += (lf ? "L" : "M") + sx + " " + sy; lf = 1; lb = 0; }
          else { db += (lb ? "L" : "M") + sx + " " + sy; lb = 1; lf = 0; }
        }
        w.front.setAttribute("d", df); w.back.setAttribute("d", db);
      });
    }
    updateWire();
    VZ.txt(svg, cx - R - 8, cy + 4, "赤道", { size: 10.5, fill: C.ink2, anchor: "end" });
    VZ.txt(svg, cx - R - 8, cy + 18, "（拖动可转）", { size: 10, fill: C.dim, anchor: "end" });
    VZ.circ(svg, cx, cy - R, 4.5, { fill: C.gold });
    VZ.txt(svg, cx + 15, cy - R - 4, "∞（北极 N）", { size: 12.5, fill: C.gold, weight: 700 });

    /* ---------------- 爬向 ∞ 的点 ---------------- */
    var liveRay = VZ.path(svg, "", VZ.stroke({ stroke: C.gold, "stroke-width": 1.6, opacity: .9 }));
    var ball = VZ.circ(svg, cx + R, cy, 6.5, { fill: C.gold });
    var planeDot = VZ.circ(svg, cx + 2 * R, pcy, 5.5, { fill: C.gold });
    var zLbl = VZ.txt(svg, cx + 2 * R, pcy - 12, "", { size: 11.5, fill: C.gold, anchor: "middle" });
    function zOf(l) { return 2 * Math.cos(l) / (1 - Math.sin(l)); }
    var out = VZ.panel(stage, { "球上点的纬度": "", "平面上的像 |z|": "", "∞ 的位置": "北极 N（球上普通一点）" });
    function step(t) {
      var s = (t % 7.4) / 7.4;
      var lam = -1.05 + 1.69 * s;
      var X = zOf(lam);
      var bx = cx + R * Math.cos(lam), by = cy - R * Math.sin(lam);
      ball.setAttribute("cx", bx.toFixed(1)); ball.setAttribute("cy", by.toFixed(1));
      planeDot.setAttribute("cx", (cx + X * R).toFixed(1));
      planeDot.setAttribute("opacity", s > 0.985 ? 0.25 : 1);
      liveRay.setAttribute("d", "M" + cx + " " + (cy - R) + "L" + (cx + X * R).toFixed(1) + " " + pcy);
      var far = X * R > 230;
      zLbl.setAttribute("text-anchor", far ? "end" : "start");
      zLbl.setAttribute("x", (cx + X * R + (far ? -14 : 14)).toFixed(1));
      zLbl.setAttribute("y", (pcy - 14).toFixed(1));
      zLbl.textContent = "|z| = " + X.toFixed(2);
      VZ.setPanel(out, {
        "球上点的纬度": (lam * 180 / Math.PI).toFixed(0) + "°",
        "平面上的像 |z|": X.toFixed(2),
        "∞ 的位置": "北极 N（球上普通一点）"
      });
    }
    step(0);
    VZ.raf(svg, function (t, ms) {
      nowT = t;
      if (t - lastDrag > 2.6) { yaw += ms / 1000 * 0.11; updateWire(); }
      step(t);
    });

    /* ---------------- 拖动转球 ---------------- */
    var prev = null;
    VZ.drag(svg, svg, W, H, function (x, y, phase) {
      if (phase === "start") prev = [x, y];
      if ((phase === "start" || phase === "move") && prev) {
        yaw += (x - prev[0]) * 0.013;
        pitch = VZ.clamp(pitch + (y - prev[1]) * 0.013, -1.25, 1.25);
        prev = [x, y]; lastDrag = nowT; updateWire();
      }
      if (phase === "end") prev = null;
    });

    /* ---------------- 右侧卡片 ---------------- */
    VZ.card(svg, 24, 40, 250, 132, { stroke: "rgba(255,255,255,.13)" });
    VZ.txt(svg, 38, 64, "为什么要把 ∞ 收进来", { size: 13.5, fill: C.cyan, weight: 700 });
    VZ.para(svg, 38, 86, "无穷远从一个「过程」变成一个「位置」。直线与圆不再分家——在球面上它们都是圆；紧致性还保证任何无穷序列都有收敛子列。", { size: 11.5, per: 19, lh: 18 });

    VZ.card(svg, 486, 40, 250, 132, { stroke: "rgba(255,255,255,.13)" });
    VZ.txt(svg, 500, 64, "亏格 = 洞数", { size: 13.5, fill: C.mag, weight: 700 });
    VZ.para(svg, 500, 84, "球面 g = 0，环面 g = 1。\ng ≥ 2 时独立复结构参数\n有 3g − 3 个（弦论里的\n卡拉比–丘流形）。", { size: 11, per: 17, lh: 17 });
    VZ.el("ellipse", { cx: 692, cy: 120, rx: 30, ry: 18, fill: "none", stroke: C.mag, "stroke-width": 1.6 }, svg);
    VZ.el("ellipse", { cx: 692, cy: 120, rx: 13, ry: 7.5, fill: "none", stroke: C.mag, "stroke-width": 1.6 }, svg);
    VZ.path(svg, "M662 120A30 18 0 0 0 722 120", VZ.stroke({ stroke: C.mag, "stroke-width": 1, opacity: .45 }));
    VZ.txt(svg, 692, 156, "环面 g = 1", { size: 10, fill: C.dim, anchor: "middle" });

    VZ.card(svg, 24, 308, 348, 148, { stroke: "rgba(255,255,255,.13)" });
    VZ.txt(svg, 38, 332, "多值 → 单值：黎曼面", { size: 13.5, fill: C.gold, weight: 700 });
    VZ.para(svg, 38, 354, "√z：两层，绕原点一圈走到另一层，绕两圈才回到原值。\nlog z：无穷多层，每绕一圈虚部加 2πi。\n全纯映射（导数 ≠ 0）是共形的：保角、保定向。", { size: 11.5, per: 27, lh: 18 });

    VZ.card(svg, 384, 308, 352, 148, { stroke: "rgba(255,255,255,.13)" });
    VZ.txt(svg, 398, 332, "同一个球的四次出场", { size: 13.5, fill: C.violet, weight: 700 });
    VZ.para(svg, 398, 354, "第 8 章：复平面 + ∞。\n第 9 章：z = e^{iθ} 做频率分解（正负频率是同一点的两个方向）。\n§18.5：天球。§22：自旋 1/2 的二态系统。", { size: 11.5, per: 27, lh: 18 });
  }
},

/* ==========================================================
   第 9 章 · 傅里叶分解与超函数
   ========================================================== */
"f-ch09": {
  title: "傅里叶分解：一个波形 = 一串正弦，系数按 1/n 衰减",
  hint: "拖动滑杆把更多分量加进来，看方波/锯齿波怎么被一段段正弦拼出来。<b>系数按 1/n 衰减，所以这两个波形都不光滑、逼近也慢</b>——方波还只含奇次谐波，跳变处的振铃永远不会消失。下面那张小图是 §9.3：把 z = e^{iθ} 搬到黎曼球上看，正频率与负频率成了球上的两个方向，<span class='hl'>而解析函数只含一侧频率</span>。",
  legend: [["目标波形", VZ.C.ink2, "line"], ["前 N 项部分和", VZ.C.cyan, "line"], ["各个正弦分量", VZ.C.mag, "line"], ["扫描线（当前相位 θ）", VZ.C.gold]],
  draw: function (stage) {
    var C = VZ.C;
    var mode = "方波", N = 5, phase = 0;

    VZ.chips(VZ.box(stage), ["方波", "锯齿波"], "方波", function (m) { mode = m; });
    VZ.slider(stage, {
      label: "叠加前 N 个分量（滑杆）", min: 1, max: 25, step: 1, value: 5,
      format: function (v) { return v.toFixed(0) + " 项"; },
      onInput: function (v) { N = v; }
    });

    var cv = VZ.canvas(stage, 760, 300);
    var ctx = cv.ctx, W2 = 760, H2 = 300;
    function tar(th) { return mode === "方波" ? (Math.sin(th) >= 0 ? 1 : -1) : th / Math.PI; }
    function part(th, n) {
      var s = 0, i;
      if (mode === "方波") { for (i = 1; i <= n; i += 2) s += Math.sin(i * th) / i; return s * 4 / Math.PI; }
      for (i = 1; i <= n; i++) s += Math.pow(-1, i + 1) * Math.sin(i * th) / i; return s * 2 / Math.PI;
    }
    function comp(th, i) {
      return mode === "方波" ? Math.sin(i * th) / i * 4 / Math.PI : Math.pow(-1, i + 1) * Math.sin(i * th) / i * 2 / Math.PI;
    }
    var pal = [C.cyan, C.mag, C.gold, C.violet, C.green, C.blue];
    var x0 = 46, x1 = 722, mid = 106, amp = 58, base = 292;
    function PX(u) { return x0 + u * (x1 - x0); }
    function PY(v) { return mid - v * amp; }

    function drawWave() {
      ctx.clearRect(0, 0, W2, H2);
      ctx.setLineDash([]); ctx.globalAlpha = 1;
      ctx.strokeStyle = C.faint; ctx.lineWidth = 1;
      ctx.beginPath(); ctx.moveTo(x0, mid); ctx.lineTo(x1, mid); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(x0, 22); ctx.lineTo(x0, 190); ctx.stroke();
      ctx.font = '11px "PingFang SC","Songti SC",sans-serif';
      ctx.textAlign = "right"; ctx.fillStyle = C.dim;
      ctx.fillText("0", x0 - 7, mid + 4); ctx.fillText("+1", x0 - 7, mid - amp + 4); ctx.fillText("−1", x0 - 7, mid + amp + 4);
      ctx.textAlign = "center";
      ctx.fillText("−π", x0, 204); ctx.fillText("0", (x0 + x1) / 2, 204); ctx.fillText("π", x1, 204);
      ctx.textAlign = "left"; ctx.fillStyle = C.ink2;
      ctx.fillText(mode === "方波" ? "方波：4/π · Σ_{奇 k} sin(kθ)/k" : "锯齿波：(2/π) · Σ (−1)^{n+1} sin(nθ)/n", x0 + 6, 34);
      ctx.fillText("前 N = " + N + " 项的部分和", x1 - 176, 34);

      var NP = 400, i, u, th, j;
      /* 各分量 */
      for (j = 1; j <= Math.min(N, 6); j++) {
        if (mode === "方波" && j % 2 === 0) continue;
        ctx.setLineDash([]); ctx.strokeStyle = pal[(j - 1) % pal.length]; ctx.globalAlpha = .32; ctx.lineWidth = 1;
        ctx.beginPath();
        for (i = 0; i <= NP; i++) { u = i / NP; th = -Math.PI + u * 2 * Math.PI; var yc = PY(comp(th, j)); i ? ctx.lineTo(PX(u), yc) : ctx.moveTo(PX(u), yc); }
        ctx.stroke();
      }
      /* 目标波形 */
      ctx.setLineDash([7, 5]); ctx.strokeStyle = C.ink2; ctx.globalAlpha = .85; ctx.lineWidth = 1.6;
      ctx.beginPath();
      for (i = 0; i <= NP; i++) { u = i / NP; th = -Math.PI + u * 2 * Math.PI; var yt = PY(tar(th)); i ? ctx.lineTo(PX(u), yt) : ctx.moveTo(PX(u), yt); }
      ctx.stroke();
      /* 部分和 */
      ctx.setLineDash([]); ctx.strokeStyle = C.cyan; ctx.globalAlpha = 1; ctx.lineWidth = 2.4;
      ctx.beginPath();
      for (i = 0; i <= NP; i++) { u = i / NP; th = -Math.PI + u * 2 * Math.PI; var yp = PY(part(th, N)); i ? ctx.lineTo(PX(u), yp) : ctx.moveTo(PX(u), yp); }
      ctx.stroke();
      /* 扫描线 */
      var us = phase % 1, ths = -Math.PI + us * 2 * Math.PI;
      ctx.setLineDash([3, 4]); ctx.strokeStyle = C.gold; ctx.globalAlpha = .5; ctx.lineWidth = 1;
      ctx.beginPath(); ctx.moveTo(PX(us), 22); ctx.lineTo(PX(us), 190); ctx.stroke();
      ctx.setLineDash([]); ctx.globalAlpha = 1;
      ctx.fillStyle = C.ink2; ctx.beginPath(); ctx.arc(PX(us), PY(tar(ths)), 3.6, 0, 7); ctx.fill();
      ctx.fillStyle = C.gold; ctx.beginPath(); ctx.arc(PX(us), PY(part(ths, N)), 4.6, 0, 7); ctx.fill();
      /* 频谱 */
      ctx.fillStyle = C.ink2; ctx.textAlign = "left"; ctx.font = '11.5px "PingFang SC","Songti SC",sans-serif';
      ctx.fillText("系数谱（∝ 1/n）", x0, 234);
      ctx.fillStyle = C.dim; ctx.font = '10.5px "PingFang SC","Songti SC",sans-serif';
      ctx.fillText(mode === "方波" ? "偶数项为零 ⇒ 只画奇数柱" : "奇偶都保留", 524, 234);
      var bw = 16, gap = 12, sx0 = 168;
      for (i = 1; i <= 12; i++) {
        var bx = sx0 + (i - 1) * (bw + gap);
        var hgt = 74 / i;
        var on = (i <= N) && (mode === "方波" ? i % 2 === 1 : true);
        ctx.globalAlpha = on ? .9 : .16;
        ctx.fillStyle = on ? C.gold : C.ink2;
        ctx.fillRect(bx, base - hgt, bw, hgt);
        ctx.globalAlpha = .75; ctx.fillStyle = C.dim; ctx.textAlign = "center";
        ctx.font = '10px "PingFang SC","Songti SC",sans-serif';
        ctx.fillText(String(i), bx + bw / 2, base + 12);
      }
      ctx.textAlign = "left"; ctx.globalAlpha = 1; ctx.fillStyle = C.dim;
      ctx.font = '10.5px "PingFang SC","Songti SC",sans-serif';
      ctx.fillText("n", sx0 - 22, base + 12);
    }

    /* ---------------- 正 / 负频率（SVG） ---------------- */
    var svg = VZ.S(stage, 760, 240, {});
    var cx2 = 128, cy2 = 116, R2 = 68;
    VZ.circ(svg, cx2, cy2, R2, { stroke: C.faint, "stroke-width": 1.2 });
    VZ.ln(svg, cx2 - R2 - 22, cy2, cx2 + R2 + 22, cy2, { stroke: C.faint, "stroke-width": .8 });
    VZ.ln(svg, cx2, cy2 - R2 - 20, cx2, cy2 + R2 + 20, { stroke: C.faint, "stroke-width": .8 });
    VZ.circ(svg, cx2 + R2, cy2, 4, { fill: C.ink });
    VZ.txt(svg, cx2 + R2 + 6, cy2 + 14, "z = 1", { size: 10.5, fill: C.dim });
    function arc(a1, a2, color, lbl, la) {
      var p1 = [cx2 + R2 * Math.cos(a1), cy2 - R2 * Math.sin(a1)], p2 = [cx2 + R2 * Math.cos(a2), cy2 - R2 * Math.sin(a2)];
      var large = Math.abs(a2 - a1) > Math.PI ? 1 : 0, sweep = a2 > a1 ? 0 : 1;
      var ar = VZ.arrowDef(svg, VZ.uid("aa"), color);
      VZ.path(svg, "M" + p1[0].toFixed(1) + " " + p1[1].toFixed(1) + "A" + R2 + " " + R2 + " 0 " + large + " " + sweep + " " + p2[0].toFixed(1) + " " + p2[1].toFixed(1),
        VZ.stroke({ stroke: color, "stroke-width": 2, opacity: .95, "marker-end": ar }));
      VZ.txt(svg, cx2 + (R2 + 16) * Math.cos(la), cy2 - (R2 + 16) * Math.sin(la), lbl, { size: 11.5, fill: color, weight: 700, anchor: "middle" });
    }
    arc(0.35, 2.25, C.cyan, "z^n 正频率", 1.3);
    arc(-0.35, -2.25, C.mag, "z^−n 负频率", -1.3);
    VZ.txt(svg, cx2, cy2 + R2 + 36, "z = e^{iθ} 就是黎曼球的赤道", { size: 11, fill: C.violet, anchor: "middle" });
    VZ.txt(svg, cx2, 22, "§9.3 频率分解的几何含义", { size: 12.5, fill: C.ink, anchor: "middle", weight: 700 });

    VZ.card(svg, 250, 26, 486, 96, { stroke: "rgba(255,255,255,.13)" });
    VZ.txt(svg, 264, 50, "正频率与负频率：同一点的两个方向", { size: 13.5, fill: C.cyan, weight: 700 });
    VZ.para(svg, 264, 72, "项 z^n 与 z^−n 只是绕球面赤道走的两侧；而一整类重要的函数——解析函数——只含一侧的频率。这不是记账约定，而是函数在复平面上的解析性质。第 33 章扭量理论把这份分裂当成核心优势：在常规时空描述里它是别扭的。", { size: 11.5, per: 40, lh: 18 });

    VZ.card(svg, 250, 134, 486, 92, { stroke: "rgba(255,255,255,.13)" });
    VZ.txt(svg, 264, 158, "δ(x) 不是函数（§9.7）", { size: 13.5, fill: C.gold, weight: 700 });
    VZ.para(svg, 264, 180, "它在 0 处取不到有限值、积分却是 1。解法：分布——把 δ 定义为作用在测试函数上的泛函；或超函数——用解析函数在实轴两侧的边界值之差来刻画，与解析延拓的几何配合得更好。", { size: 11.5, per: 40, lh: 18 });

    var out = VZ.panel(stage, { "波型": mode, "叠加分量数 N": N, "部分和（θ = π/2）": "", "偏差 / 目标": "", "系数衰减": "~ 1/n（衰减慢 ⇒ 不光滑）" });
    VZ.raf(svg, function (t) {
      phase = (t * 0.17) % 1;
      drawWave();
      var ps = part(Math.PI / 2, N), ts = tar(Math.PI / 2);
      VZ.setPanel(out, {
        "波型": mode, "叠加分量数 N": String(N),
        "部分和（θ = π/2）": ps.toFixed(3),
        "偏差 / 目标": (ts >= 0 ? "+" : "−") + Math.abs(ts).toFixed(2) + " ⇒ 差 " + Math.abs(ps - ts).toFixed(3),
        "系数衰减": "~ 1/n（衰减慢 ⇒ 不光滑）"
      });
    });
    drawWave();
  }
},

/* ==========================================================
   第 10 章 · 柯西–黎曼方程
   ========================================================== */
"f-ch10": {
  title: "柯西–黎曼方程：方格在共形映射下依然是方的",
  hint: "拖动左图的金色探针，或在滑杆上改指数 k，看右图那片网格怎么被 f(z) = z^k 扭曲——<b>方格弯了、转了、放大了，但两条格线在交点处始终垂直</b>。这就是柯西–黎曼方程 ∂u/∂x = ∂v/∂y、∂u/∂y = −∂v/∂x 的几何含义：局部就是旋转加均匀伸缩。切到「反全纯」看角度符号翻过来：保角但反定向，它不满足 CR 方程。<span class='hl'>全纯 ⇔ 保定向的共形。</span>",
  legend: [["原像网格（z 平面）", VZ.C.ink2], ["像网格 w = f(z)", VZ.C.cyan], ["探针处的两条线段", VZ.C.gold], ["单位圆与分支点", VZ.C.mag]],
  draw: function (stage) {
    var W = 760, H = 460, svg = VZ.S(stage, W, H, { grid: true });
    var C = VZ.C;
    var holo = true, K = 2.0, S = 118;
    var LX = 190, LY = 190, RX = 570, RY = 190;
    var zc = [0.62, 0.34];

    function f(z) {
      var r = Math.hypot(z[0], z[1]), th = Math.atan2(z[1], z[0]);
      var rk = Math.pow(Math.max(r, 1e-9), K), a = K * th * (holo ? 1 : -1);
      return [rk * Math.cos(a), rk * Math.sin(a)];
    }
    function PX(z) { return [LX + z[0] * S, LY - z[1] * S]; }
    function WX(w) { return [RX + w[0] * S, RY - w[1] * S]; }

    /* ---------------- 面板边框与标签 ---------------- */
    VZ.card(svg, LX - 124, LY - 124, 248, 248, { stroke: C.faint, fill: "rgba(255,255,255,.02)" });
    VZ.card(svg, RX - 124, RY - 124, 248, 248, { stroke: C.faint, fill: "rgba(255,255,255,.02)" });
    VZ.txt(svg, LX, 54, "原像：z 平面的方格", { size: 12.5, fill: C.ink, anchor: "middle", weight: 700 });
    VZ.txt(svg, RX, 54, "像：w = f(z) 的网格", { size: 12.5, fill: C.cyan, anchor: "middle", weight: 700 });
    VZ.txt(svg, LX - 118, LY + 132, "1 个复维 = 2 个实维；网格沿实轴/虚轴等分", { size: 10.5, fill: C.dim });
    VZ.el("ellipse", { cx: RX, cy: RY, rx: S, ry: S, fill: "none", stroke: C.mag, "stroke-width": 1.1, "stroke-dasharray": "5 4" }, svg);
    VZ.txt(svg, RX + S + 4, RY - S - 4, "|w| = 1", { size: 10.5, fill: C.mag });
    VZ.circ(svg, RX, RY, 3.4, { fill: C.mag });
    VZ.txt(svg, RX + 8, RY + 16, "分支点 w = 0（f′ = 0，不共形）", { size: 10.5, fill: C.mag });

    /* ---------------- 网格 ---------------- */
    var cs = [-1, -0.75, -0.5, -0.25, 0, 0.25, 0.5, 0.75, 1];
    var NT = 48, lines = [];
    var clipR = VZ.uid("cl");
    var cpR = VZ.el("clipPath", { id: clipR }, VZ.el("defs", null, svg));
    VZ.el("rect", { x: RX - 122, y: RY - 122, width: 244, height: 244, rx: 8 }, cpR);
    var gridR = VZ.g(svg, { "clip-path": "url(#" + clipR + ")" });
    function addLine(pts) {
      return {
        pts: pts,
        lp: VZ.path(svg, "", VZ.stroke({ stroke: C.ink2, "stroke-width": 1, opacity: .5 })),
        rp: VZ.path(gridR, "", VZ.stroke({ stroke: C.cyan, "stroke-width": 1, opacity: .55 }))
      };
    }
    cs.forEach(function (c) {
      var vert = [], horz = [], i, t;
      for (i = 0; i <= NT; i++) { t = -1 + 2 * i / NT; vert.push([c, t]); horz.push([t, c]); }
      [vert, horz].forEach(function (ln) {
        var L = addLine(ln);
        if (Math.abs(c) < 0.001) { L.lp.setAttribute("stroke", C.ink2); L.lp.setAttribute("stroke-width", 1.5); L.lp.setAttribute("opacity", .8); L.rp.setAttribute("stroke", C.cyan); L.rp.setAttribute("stroke-width", 1.5); L.rp.setAttribute("opacity", .85); }
        lines.push(L);
      });
    });
    VZ.txt(svg, LX - 118, LY - 118, "Re z", { size: 10.5, fill: C.dim });
    VZ.txt(svg, LX + 6, LY - 112, "Im z", { size: 10.5, fill: C.dim });

    /* ---------------- 探针处的两条线段 ---------------- */
    var segX = VZ.path(svg, "", VZ.stroke({ stroke: C.gold, "stroke-width": 2.4 }));
    var segY = VZ.path(svg, "", VZ.stroke({ stroke: C.gold, "stroke-width": 2.4, "stroke-dasharray": "5 4" }));
    var dotL = VZ.circ(svg, 0, 0, 4.5, { fill: C.gold });
    var gImgX = VZ.path(svg, "", VZ.stroke({ stroke: C.gold, "stroke-width": 2.4 }));
    var gImgY = VZ.path(svg, "", VZ.stroke({ stroke: C.gold, "stroke-width": 2.4, "stroke-dasharray": "5 4" }));
    var dotR = VZ.circ(svg, 0, 0, 4.5, { fill: C.gold });
    var rightAng = VZ.path(svg, "", VZ.stroke({ stroke: C.green, "stroke-width": 1.6 }));
    var angLbl = VZ.txt(svg, 0, 0, "", { size: 11.5, fill: C.green, weight: 700 });
    var ringL = VZ.circ(svg, 0, 0, 9, { fill: "none", stroke: C.gold, "stroke-width": 1, opacity: .5, "stroke-dasharray": "3 3" });

    /* ---------------- 底部两张卡片 ---------------- */
    VZ.card(svg, 24, 330, 350, 118, { stroke: "rgba(255,255,255,.13)" });
    VZ.txt(svg, 38, 354, "柯西–黎曼方程（§10.5）", { size: 13.5, fill: C.cyan, weight: 700 });
    VZ.txt(svg, 38, 378, "∂u/∂x = ∂v/∂y   且   ∂u/∂y = −∂v/∂x", { size: 14, fill: C.ink, weight: 700 });
    VZ.para(svg, 38, 400, "条件等价于：这个线性映射是旋转加均匀伸缩，也就是共形。反定向的共形映射不满足 CR，因此不可能是全纯的。", { size: 11.5, per: 28, lh: 17 });

    VZ.card(svg, 390, 330, 346, 118, { stroke: "rgba(255,255,255,.13)" });
    VZ.txt(svg, 404, 354, "在探针处做数值检验", { size: 13.5, fill: C.gold, weight: 700 });
    var tA = VZ.txt(svg, 404, 378, "", { size: 12, fill: C.ink });
    var tB = VZ.txt(svg, 546, 378, "", { size: 12, fill: C.ink });
    var tC = VZ.txt(svg, 404, 398, "", { size: 12, fill: C.ink });
    var tD = VZ.txt(svg, 546, 398, "", { size: 12, fill: C.ink });
    var tE = VZ.txt(svg, 404, 418, "", { size: 12, fill: C.ink });
    var tF = VZ.txt(svg, 404, 440, "", { size: 12.5, fill: C.green, weight: 700 });

    var out = VZ.panel(stage, { "探针 z": "", "|z| 与 arg z": "", "像 w = f(z)": "", "|f′(z)|（局部伸缩）": "", "arg f′(z)（局部旋转）": "" });

    function redraw() {
      /* 网格 */
      lines.forEach(function (L) {
        var d1 = "", d2 = "", last = false;
        L.pts.forEach(function (p, i) {
          var a = PX(p), b = WX(f(p));
          d1 += (i ? "L" : "M") + a[0].toFixed(1) + " " + a[1].toFixed(1);
          var ins = Math.abs(b[0] - RX) < S * 1.04 && Math.abs(b[1] - RY) < S * 1.04;
          if (ins) d2 += (last ? "L" : "M") + b[0].toFixed(1) + " " + b[1].toFixed(1);
          last = ins;
        });
        L.lp.setAttribute("d", d1); L.rp.setAttribute("d", d2);
      });
      /* 局部线段长度：控制像不至于太大 */
      var gz = Math.hypot(zc[0], zc[1]);
      var dp = K * Math.pow(Math.max(gz, 1e-9), K - 1);
      var Lz = dp * 0.17 > 0.46 ? 0.46 / Math.max(dp, 1e-6) : 0.17;
      var p0 = PX(zc);
      segX.setAttribute("d", "M" + PX([zc[0] - Lz, zc[1]]).join(" ") + "L" + PX([zc[0] + Lz, zc[1]]).join(" "));
      segY.setAttribute("d", "M" + PX([zc[0], zc[1] - Lz]).join(" ") + "L" + PX([zc[0], zc[1] + Lz]).join(" "));
      dotL.setAttribute("cx", p0[0]); dotL.setAttribute("cy", p0[1]);
      ringL.setAttribute("cx", p0[0]); ringL.setAttribute("cy", p0[1]);
      /* 像：两条线段的像 */
      var iX = [], iY = [], i;
      for (i = -6; i <= 6; i++) {
        iX.push(WX(f([zc[0] + Lz * i / 6, zc[1]])));
        iY.push(WX(f([zc[0], zc[1] + Lz * i / 6])));
      }
      gImgX.setAttribute("d", iX.map(function (p, j) { return (j ? "L" : "M") + p[0].toFixed(1) + " " + p[1].toFixed(1); }).join(""));
      gImgY.setAttribute("d", iY.map(function (p, j) { return (j ? "L" : "M") + p[0].toFixed(1) + " " + p[1].toFixed(1); }).join(""));
      var wp = WX(f(zc));
      dotR.setAttribute("cx", wp[0]); dotR.setAttribute("cy", wp[1]);
      var wm = f([zc[0] - Lz, zc[1]]), wm2 = f([zc[0] + Lz, zc[1]]);
      var t1 = [wm2[0] - wm[0], wm2[1] - wm[1]];
      var qm = f([zc[0], zc[1] - Lz]), qm2 = f([zc[0], zc[1] + Lz]);
      var t2 = [qm2[0] - qm[0], qm2[1] - qm[1]];
      var n1 = Math.hypot(t1[0], t1[1]) || 1, n2 = Math.hypot(t2[0], t2[1]) || 1;
      var u1 = [t1[0] / n1 * 15, -t1[1] / n1 * 15], u2 = [t2[0] / n2 * 15, -t2[1] / n2 * 15];
      rightAng.setAttribute("d", "M" + (wp[0] + u1[0]).toFixed(1) + " " + (wp[1] + u1[1]).toFixed(1) +
        "L" + (wp[0] + u1[0] + u2[0]).toFixed(1) + " " + (wp[1] + u1[1] + u2[1]).toFixed(1) +
        "L" + (wp[0] + u2[0]).toFixed(1) + " " + (wp[1] + u2[1]).toFixed(1));
      var sgn = Math.atan2(t2[1] * t1[0] - t2[0] * t1[1], t2[0] * t1[0] + t2[1] * t1[1]) * 180 / Math.PI;
      angLbl.setAttribute("x", wp[0] + u1[0] + u2[0] + 6);
      angLbl.setAttribute("y", wp[1] + u1[1] + u2[1] + 4);
      angLbl.textContent = (sgn > 0 ? "+" : "−") + Math.abs(sgn).toFixed(1) + "°";
      angLbl.setAttribute("fill", Math.abs(Math.abs(sgn) - 90) < 1 ? C.green : C.red);
      /* CR 数值检验 */
      var h = 1e-4, uv = function (z) { var w = f(z); return [w[0], w[1]]; };
      var ux = (uv([zc[0] + h, zc[1]])[0] - uv([zc[0] - h, zc[1]])[0]) / (2 * h);
      var uy = (uv([zc[0], zc[1] + h])[0] - uv([zc[0], zc[1] - h])[0]) / (2 * h);
      var vx = (uv([zc[0] + h, zc[1]])[1] - uv([zc[0] - h, zc[1]])[1]) / (2 * h);
      var vy = (uv([zc[0], zc[1] + h])[1] - uv([zc[0], zc[1] - h])[1]) / (2 * h);
      tA.textContent = "∂u/∂x = " + ux.toFixed(3);
      tB.textContent = "∂v/∂y = " + vy.toFixed(3);
      tC.textContent = "∂u/∂y = " + uy.toFixed(3);
      tD.textContent = "−∂v/∂x = " + (-vx).toFixed(3);
      tE.textContent = "两线夹角 = " + Math.abs(sgn).toFixed(1) + "°（保角）";
      var ok = Math.abs(ux - vy) < 1e-3 && Math.abs(uy + vx) < 1e-3;
      tF.textContent = ok ? "两式都成立 ⇒ 满足 CR：这一支是全纯的（保角 + 保定向）"
        : "两式都不成立 ⇒ 反定向：保角，但不全纯";
      tF.setAttribute("fill", ok ? C.green : C.red);
      /* 面板 */
      var argv = Math.atan2(zc[1], zc[0]) * 180 / Math.PI;
      VZ.setPanel(out, {
        "探针 z": zc[0].toFixed(3) + (zc[1] >= 0 ? " + " : " − ") + Math.abs(zc[1]).toFixed(3) + "i",
        "|z| 与 arg z": gz.toFixed(3) + " ／ " + argv.toFixed(1) + "°",
        "像 w = f(z)": (f(zc)[0]).toFixed(3) + (f(zc)[1] >= 0 ? " + " : " − ") + Math.abs(f(zc)[1]).toFixed(3) + "i",
        "|f′(z)|（局部伸缩）": dp.toFixed(3),
        "arg f′(z)（局部旋转）": (Math.atan2(t1[1], t1[0]) * 180 / Math.PI).toFixed(1) + "°"
      });
    }

    VZ.slider(stage, {
      label: "映射指数 k（f(z) = z^k）", min: 0.3, max: 3, step: 0.05, value: 2,
      format: function (v) { return v.toFixed(2); },
      onInput: function (v) { K = v; redraw(); }
    });
    VZ.chips(VZ.box(stage), ["全纯 f(z) = z^k（保角 + 保定向）", "反全纯 f(z) = z̄^k（保角 + 反定向）"], "全纯 f(z) = z^k（保角 + 保定向）",
      function (m) { holo = m.indexOf("全纯") === 0 && m.indexOf("反全纯") !== 0; redraw(); });

    var dragging = false;
    VZ.drag(svg, svg, W, H, function (x, y, phase) {
      if (phase === "start") {
        var p = PX(zc);
        dragging = Math.hypot(x - p[0], y - p[1]) < 130 && x < 340;
      }
      if (!dragging) return;
      var nz = [(x - LX) / S, (LY - y) / S];
      var rr = Math.hypot(nz[0], nz[1]);
      if (rr < 0.24) { nz[0] *= 0.24 / rr; nz[1] *= 0.24 / rr; }
      if (rr > 0.98) { nz[0] *= 0.98 / rr; nz[1] *= 0.98 / rr; }
      zc = nz; redraw();
      if (phase === "end") dragging = false;
    });

    redraw();
  }
},

/* ==========================================================
   第 11 章 · 四元数（超复数）
   ========================================================== */
"f-ch11": {
  title: "四元数：丢掉交换律，换来三维旋转",
  hint: "点「先 i 后 j」或「先 j 后 i」，看同一个立方体沿两条路转出去，<b>最终朝向并不一样：ij = k，而 ji = −k</b>。拖动可以换观察角度，虚线轴架是另一种顺序的终点，用来对照。单位四元数 q = cos(θ/2) + sin(θ/2)·(单位轴) 与三维旋转一一对应，但 q 与 −q 是同一个旋转——这个半角就是第 22 章旋量「转 720° 才复原」的伏笔。<span class='hl'>可以放弃交换律，不能放弃结合律与分配律。</span>",
  legend: [["立方体与轴架（当前朝向）", VZ.C.ink2], ["i：绕 x 轴的四分之一转", VZ.C.cyan], ["j：绕 y 轴的四分之一转", VZ.C.mag], ["k = ij：绕 z 轴", VZ.C.gold], ["另一顺序的终点（虚线）", VZ.C.dim]],
  draw: function (stage) {
    var W = 760, H = 460, svg = VZ.S(stage, W, H, { grid: true });
    var C = VZ.C;
    function mul(A, B) { var R = [], i, j, k; for (i = 0; i < 3; i++) for (j = 0; j < 3; j++) { var s = 0; for (k = 0; k < 3; k++) s += A[i * 3 + k] * B[k * 3 + j]; R[i * 3 + j] = s; } return R; }
    function rotX(a) { var c = Math.cos(a), s = Math.sin(a); return [1, 0, 0, 0, c, -s, 0, s, c]; }
    function rotY(a) { var c = Math.cos(a), s = Math.sin(a); return [c, 0, s, 0, 1, 0, -s, 0, c]; }
    function app(M, v) { return [M[0] * v[0] + M[1] * v[1] + M[2] * v[2], M[3] * v[0] + M[4] * v[1] + M[5] * v[2], M[6] * v[0] + M[7] * v[1] + M[8] * v[2]]; }
    var HD = Math.PI / 2;
    var M_ij = mul(rotY(HD), rotX(HD));   /* 先 i 后 j */
    var M_ji = mul(rotX(HD), rotY(HD));   /* 先 j 后 i */
    function Mof(seq, t) {
      var t1 = VZ.clamp(2 * t, 0, 1), t2 = VZ.clamp(2 * t - 1, 0, 1);
      if (seq === "ij") return mul(rotY(HD * t2), rotX(HD * t1));
      return mul(rotX(HD * t2), rotY(HD * t1));
    }
    function axisAngle(M) {
      var tr = M[0] + M[4] + M[8], ang = Math.acos(VZ.clamp((tr - 1) / 2, -1, 1));
      if (Math.abs(ang) < 1e-4) return "等同不转（0°）";
      var s = Math.sin(ang), ax = [(M[7] - M[5]) / (2 * s), (M[2] - M[6]) / (2 * s), (M[1] - M[3]) / (2 * s)];
      var n = Math.hypot(ax[0], ax[1], ax[2]) || 1;
      return "轴 (" + (ax[0] / n).toFixed(2) + ", " + (ax[1] / n).toFixed(2) + ", " + (ax[2] / n).toFixed(2) + ")，转 " + (ang * 180 / Math.PI).toFixed(1) + "°";
    }

    var yaw = 0.62, pitch = -0.42, lastDrag = -99, nowT = 0;
    var OX = 252, OY = 222, SC = 52;
    function pr(v) {
      var cy = Math.cos(yaw), sy = Math.sin(yaw), cp = Math.cos(pitch), sp = Math.sin(pitch);
      var x1 = v[0] * cy - v[1] * sy, y1 = v[0] * sy + v[1] * cy, z1 = v[2];
      var y2 = y1 * cp - z1 * sp, z2 = y1 * sp + z1 * cp;
      return [OX + SC * x1, OY - SC * z2, y2];
    }
    var V8 = [], i;
    for (i = 0; i < 8; i++) V8.push([(i & 1 ? 1 : -1), (i & 2 ? 1 : -1), (i & 4 ? 1 : -1)]);
    var FACES = [[0, 1, 3, 2], [4, 5, 7, 6], [0, 1, 5, 4], [2, 3, 7, 6], [0, 2, 6, 4], [1, 3, 7, 5]];
    var faceEls = FACES.map(function () { return VZ.path(svg, "", VZ.stroke({ stroke: C.ink2, "stroke-width": 1.5, opacity: .85 })); });
    var AX = [[1.66, 0, 0], [0, 1.66, 0], [0, 0, 1.66]];
    var AXC = [C.cyan, C.mag, C.gold], AXN = ["i", "j", "k"];
    var axisEls = AX.map(function (dv, j) {
      return { v: dv, ln: VZ.path(svg, "", VZ.stroke({ stroke: AXC[j], "stroke-width": 2.2 })), lb: VZ.txt(svg, 0, 0, AXN[j], { size: 13.5, fill: AXC[j], weight: 700 }) };
    });
    var ghostEls = AX.map(function () { return VZ.path(svg, "", VZ.stroke({ stroke: C.violet, "stroke-width": 1.6, "stroke-dasharray": "4 4", opacity: .9 })); });
    var corner = VZ.circ(svg, 0, 0, 4.4, { fill: C.gold });
    var center = VZ.circ(svg, 0, 0, 3, { fill: C.dim });
    var ghostLbl = VZ.txt(svg, 0, 0, "另一顺序的终点", { size: 10.5, fill: C.violet });

    var seq = "ij", pt = 1;
    var out = VZ.panel(stage, { "当前顺序": "先 i 后 j", "四元数积": "ij = k（ji = −k）", "最终朝向": "", "另一顺序的终点": "" });
    var stepTxt = VZ.txt(svg, OX, 44, "", { size: 12, fill: C.gold, anchor: "middle" });
    function draw() {
      var M = Mof(seq, pt), Mg = (seq === "ij" ? M_ji : M_ij);
      faceEls.forEach(function (el, fi) {
        var pts = FACES[fi].map(function (idx) { return pr(app(M, V8[idx])); });
        var dep = (pts[0][2] + pts[1][2] + pts[2][2] + pts[3][2]) / 4;
        el.setAttribute("d", "M" + pts.map(function (p) { return p[0].toFixed(1) + " " + p[1].toFixed(1); }).join("L") + "Z");
        el.setAttribute("fill", dep < 0 ? "rgba(255,255,255,.11)" : "rgba(255,255,255,.025)");
        el.setAttribute("stroke-opacity", dep < 0 ? .95 : .5);
      });
      var o = pr([0, 0, 0]);
      center.setAttribute("cx", o[0]); center.setAttribute("cy", o[1]);
      axisEls.forEach(function (a) {
        var p = pr(app(M, a.v));
        a.ln.setAttribute("d", "M" + o[0].toFixed(1) + " " + o[1].toFixed(1) + "L" + p[0].toFixed(1) + " " + p[1].toFixed(1));
        a.lb.setAttribute("x", p[0] + (p[0] > o[0] ? 7 : -9));
        a.lb.setAttribute("y", p[1] + (p[1] > o[1] ? 14 : -6));
      });
      ghostEls.forEach(function (el, j) {
        var p = pr(app(Mg, AX[j]));
        el.setAttribute("d", "M" + o[0].toFixed(1) + " " + o[1].toFixed(1) + "L" + p[0].toFixed(1) + " " + p[1].toFixed(1));
      });
      var cp = pr(app(M, [1, 1, 1]));
      corner.setAttribute("cx", cp[0]); corner.setAttribute("cy", cp[1]);
      var gp = pr(app(Mg, [0, 0, 1.9]));
      ghostLbl.setAttribute("x", gp[0] + 6); ghostLbl.setAttribute("y", gp[1] - 6);
      stepTxt.textContent = pt < 0.5 ? "第 1 步：" + (seq === "ij" ? "绕 x 转 90°（乘 i）" : "绕 y 转 90°（乘 j）")
        : "第 2 步：" + (seq === "ij" ? "再绕 y 转 90°（乘 j）" : "再绕 x 转 90°（乘 i）");
      VZ.setPanel(out, {
        "当前顺序": seq === "ij" ? "先 i 后 j" : "先 j 后 i",
        "四元数积": seq === "ij" ? "ij = k" : "ji = −k",
        "最终朝向": axisAngle(M),
        "另一顺序的终点": axisAngle(Mg)
      });
    }
    draw();
    VZ.raf(svg, function (t, ms) {
      nowT = t;
      if (pt < 1) pt = Math.min(1, pt + ms / 1800);
      else if (t - lastDrag > 3) yaw += ms / 1000 * 0.1;
      draw();
    });
    VZ.drag(svg, svg, W, H, function (x, y, phase) {
      var prev = dragPrev;
      if (phase === "start") { dragPrev = [x, y]; return; }
      if (phase === "end") { dragPrev = null; lastDrag = nowT; return; }
      if (!prev) { dragPrev = [x, y]; return; }
      yaw += (x - prev[0]) * 0.013; pitch = VZ.clamp(pitch + (y - prev[1]) * 0.013, -1.2, 1.2);
      dragPrev = [x, y]; lastDrag = nowT; draw();
    });
    var dragPrev = null;

    var row = VZ.box(stage);
    VZ.btn(row, "先 i 后 j（再绕 y）", function () { seq = "ij"; pt = 0; });
    VZ.btn(row, "先 j 后 i（再绕 x）", function () { seq = "ji"; pt = 0; });
    VZ.btn(row, "复位（回原位）", function () { seq = "ij"; pt = 0; });

    VZ.card(svg, 404, 40, 332, 134, { stroke: "rgba(255,255,255,.13)" });
    VZ.txt(svg, 418, 64, "四元数的代数（§11.1–11.2）", { size: 13.5, fill: C.cyan, weight: 700 });
    VZ.txt(svg, 418, 88, "i² = j² = k² = ijk = −1", { size: 14.5, fill: C.ink, weight: 700 });
    VZ.para(svg, 418, 110, "ij = −ji、jk = −kj、ki = −ik：交换律被彻底放弃。加法交换、加法与乘法结合、分配律全部保留，于是得到一个环（作者顺带抱怨「环」这个名字取得不好）。", { size: 11.5, per: 28, lh: 17 });
    VZ.txt(svg, 418, 164, "麦克斯韦当年正是用四元数写下电磁理论的。", { size: 11, fill: C.dim });

    VZ.card(svg, 404, 186, 332, 134, { stroke: "rgba(255,255,255,.13)" });
    VZ.txt(svg, 418, 210, "单位四元数 ⇔ 三维旋转（§11.3–11.4）", { size: 13.5, fill: C.mag, weight: 700 });
    VZ.txt(svg, 418, 234, "q = cos(θ/2) + sin(θ/2)·(单位轴)", { size: 13, fill: C.ink, weight: 700 });
    VZ.para(svg, 418, 256, "复合旋转就是四元数乘法，代价是那个半角 θ/2——这悄悄埋下第 22 章旋量「转 720° 才回到原样」的伏笔。注意 q 与 −q 表示同一个旋转：这就是三维旋转群的双覆盖。", { size: 11.5, per: 28, lh: 17 });

    VZ.card(svg, 404, 332, 332, 108, { stroke: "rgba(255,255,255,.13)" });
    VZ.txt(svg, 418, 356, "再往前：克利福德与格拉斯曼（§11.5–11.6）", { size: 13.5, fill: C.gold, weight: 700 });
    VZ.para(svg, 418, 378, "克利福德代数 γ_aγ_b + γ_bγ_a = 2η_ab 能把波动算符开平方 ⇒ 狄拉克方程（§24.6）。\n格拉斯曼代数 ξ² = 0 且反交换 ⇒ 天然描述费米子（泡利不相容）。", { size: 11.5, per: 30, lh: 17 });

    VZ.txt(svg, OX, 352, "拖动换视角；金色小球是顶点 (1,1,1)", { size: 11, fill: C.dim, anchor: "middle" });
  }
},

/* ==========================================================
   第 12 章 · n 维流形
   ========================================================== */
"f-ch12": {
  title: "n 维流形：局部像 Rⁿ，卡与卡之间光滑地粘起来",
  hint: "点流形上不同颜色的坐标卡（或下面的按钮），看同一块区域在三张卡里被写成什么样子：<b>(x, y)、(r, θ)、(x + y, x − y)——坐标换了，说的还是同一件事</b>。卡与卡在重叠区域的转换必须光滑，物理定律不能依赖你选了哪张卡（第 14 章把它变成协变性要求）。下面的阶梯是外微分：d 把 p-形式送到 (p+1)-形式，<span class='hl'>而 d∘d = 0，这正是「边界的边界为空」</span>。",
  legend: [["流形 M（局部像 R²）", VZ.C.ink2], ["坐标卡 A / B / C", VZ.C.cyan], ["外微分链 d", VZ.C.gold], ["抽象指标：缩并 = 接线", VZ.C.mag]],
  draw: function (stage) {
    var W = 760, H = 500, svg = VZ.S(stage, W, H, { grid: true });
    var C = VZ.C;
    var MC = [185, 178], MR = 138;
    var gx0 = 366, gy0 = 76, gx1 = 722, gy1 = 262;

    /* ---------------- 流形 ---------------- */
    function blob(cx0, cy0, r, ph) {
      var d = "", i, a, rr;
      for (i = 0; i <= 84; i++) {
        a = i / 84 * Math.PI * 2;
        rr = r * (1 + 0.085 * Math.cos(3 * a + ph) + 0.045 * Math.sin(5 * a - ph));
        d += (i ? "L" : "M") + (cx0 + rr * Math.cos(a)).toFixed(1) + " " + (cy0 + rr * 0.82 * Math.sin(a)).toFixed(1);
      }
      return d + "Z";
    }
    var mG = VZ.grad(svg, VZ.uid("mg"), [[0, "rgba(60,45,150,.42)"], [1, "rgba(20,13,48,.28)"]], true);
    VZ.path(svg, blob(MC[0], MC[1], MR, 0.7), { fill: mG, stroke: C.ink2, "stroke-width": 1.6 });
    var k, w, yy, dline;
    for (k = -0.62; k <= 0.63; k += 0.31) {
      yy = MC[1] + k * MR * 0.82; w = Math.sqrt(Math.max(0, 1 - k * k)) * MR * 0.96;
      dline = "";
      for (var i2 = 0; i2 <= 30; i2++) {
        var xx = -w + 2 * w * i2 / 30;
        dline += (i2 ? "L" : "M") + (MC[0] + xx).toFixed(1) + " " + (yy + 5 * Math.sin(xx / w * 2.4)).toFixed(1);
      }
      VZ.path(svg, dline, VZ.stroke({ stroke: C.faint, "stroke-width": .7, opacity: .8 }));
    }
    for (k = -0.6; k <= 0.61; k += 0.3) {
      var xx2 = MC[0] + k * MR * 0.96, hh = Math.sqrt(Math.max(0, 1 - k * k)) * MR * 0.8;
      VZ.path(svg, "M" + xx2 + " " + (MC[1] - hh) + "Q" + (xx2 + 9) + " " + MC[1] + " " + xx2 + " " + (MC[1] + hh),
        VZ.stroke({ stroke: C.faint, "stroke-width": .7, opacity: .8 }));
    }
    VZ.txt(svg, MC[0], 52, "流形 M：每一点的邻域都同胚于 R² 的一小块", { size: 12.5, fill: C.ink, anchor: "middle", weight: 700 });
    VZ.txt(svg, MC[0], 312, "刚体的位形空间是 6 维：3 个平移 + 3 个旋转，而且它不是欧氏空间", { size: 11, fill: C.dim, anchor: "middle" });

    var CH = [
      { nm: "卡 A：(x, y) 直角坐标", col: C.cyan, grid: "square", axx: "x →", axy: "y ↑", sub: "x ∈ (−1, 1)，y ∈ (−1, 1)",
        note: "最普通的一张卡：局部与 R² 的一小块没有分别。", pt: "trans" },
      { nm: "卡 B：(r, θ) 极坐标", col: C.gold, grid: "polar", axx: "θ →（−π … π）", axy: "r ↑（0 … 2）", sub: "r ≥ 0，θ ∈ (−π, π]",
        note: "在原点附近 r 和 θ 都失效 ⇒ 这一小块要避开原点，换一张卡。", pt: "trans" },
      { nm: "卡 C：(u, v) = (x + y, x − y)", col: C.green, grid: "diag", axx: "u →", axy: "v ↑", sub: "u ∈ (−2, 2)，v ∈ (−2, 2)",
        note: "坐标轴斜过来，网格被剪成菱形——同一块区域，另一套读数。", pt: "trans" }
    ];
    var PATCH = [
      { cx: 150, cy: 128, rx: 60, ry: 40, rot: -18 },
      { cx: 234, cy: 168, rx: 56, ry: 38, rot: 14 },
      { cx: 166, cy: 232, rx: 52, ry: 34, rot: -8 }
    ];
    var patchEls = [];
    var sel = 0;
    PATCH.forEach(function (p, idx) {
      var gg = VZ.g(svg, { style: "cursor:pointer" });
      VZ.el("rect", { x: p.cx - p.rx - 10, y: p.cy - p.ry - 12, width: 2 * p.rx + 20, height: 2 * p.ry + 24, fill: "rgba(255,255,255,.001)" }, gg);
      var e = VZ.el("ellipse", { cx: p.cx, cy: p.cy, rx: p.rx, ry: p.ry, fill: "rgba(255,255,255,.05)", stroke: CH[idx].col, "stroke-width": 1.4, transform: "rotate(" + p.rot + " " + p.cx + " " + p.cy + ")" }, gg);
      VZ.txt(gg, p.cx, p.cy + 6, ["A", "B", "C"][idx], { size: 15, fill: CH[idx].col, anchor: "middle", weight: 700 });
      patchEls.push(e);
      gg.addEventListener("click", function () { select(idx); });
    });

    /* ---------------- 坐标卡面板 ---------------- */
    var cg = VZ.g(svg);
    function select(idx) {
      sel = idx;
      patchEls.forEach(function (e, j) {
        e.setAttribute("stroke-width", j === idx ? 2.8 : 1.3);
        e.setAttribute("fill", j === idx ? "rgba(255,255,255,.16)" : "rgba(255,255,255,.04)");
      });
      drawChart(idx);
      VZ.setPanel(out, {
        "当前坐标卡": CH[idx].nm,
        "卡内坐标范围": CH[idx].sub,
        "卡与卡的重叠区域": "转换函数必须光滑（C^∞）",
        "物理定律": "不依赖你选了哪张卡 ⇒ 协变性（第 14 章）"
      });
    }
    function drawChart(idx) {
      var ch = CH[idx];
      cg.innerHTML = "";
      VZ.el("rect", { x: 352, y: 46, width: 384, height: 264, rx: 12, fill: "rgba(255,255,255,.03)", stroke: C.faint }, cg);
      VZ.txt(cg, 368, 70, ch.nm, { size: 13.5, fill: ch.col, weight: 700 });
      VZ.txt(cg, 720, 70, "同一块区域的不同读数", { size: 10.5, fill: C.dim, anchor: "end" });
      var cid = VZ.uid("clip");
      var cp = VZ.el("clipPath", { id: cid }, VZ.el("defs", null, cg));
      VZ.el("rect", { x: gx0, y: gy0, width: gx1 - gx0, height: gy1 - gy0, rx: 8 }, cp);
      var gg = VZ.g(cg, { "clip-path": "url(#" + cid + ")" });
      VZ.el("rect", { x: gx0, y: gy0, width: gx1 - gx0, height: gy1 - gy0, rx: 8, fill: "rgba(10,6,28,.5)" }, gg);
      var s, x, y;
      if (ch.grid === "square") {
        for (x = gx0; x <= gx1; x += 32) VZ.ln(gg, x, gy0, x, gy1, { stroke: C.faint, "stroke-width": .7, opacity: .75 });
        for (y = gy0; y <= gy1; y += 32) VZ.ln(gg, gx0, y, gx1, y, { stroke: C.faint, "stroke-width": .7, opacity: .75 });
      } else if (ch.grid === "polar") {
        for (s = 44; s <= 180; s += 44) VZ.circ(gg, gx0 + 24, gy1 - 12, s, { stroke: C.faint, "stroke-width": .7, opacity: .75 });
        for (s = 0; s <= 8; s++) {
          var aa = -s * 11 * Math.PI / 180;
          VZ.ln(gg, gx0 + 24, gy1 - 12, gx0 + 24 + 300 * Math.cos(aa), gy1 - 12 - 300 * Math.sin(aa), { stroke: C.faint, "stroke-width": .7, opacity: .6 });
        }
        VZ.txt(gg, gx0 + 24 + 46, gy1 - 16, "r = 1", { size: 9.5, fill: C.dim });
        VZ.txt(gg, gx0 + 24 + 134, gy1 - 16, "r = 3", { size: 9.5, fill: C.dim });
      } else {
        for (s = -340; s <= 300; s += 30) {
          VZ.ln(gg, gx0, gy0 + s, gx1, gy0 + s + (gx1 - gx0), { stroke: C.faint, "stroke-width": .7, opacity: .6 });
          VZ.ln(gg, gx0, gy0 + s + (gx1 - gx0), gx1, gy0 + s, { stroke: C.faint, "stroke-width": .7, opacity: .6 });
        }
      }
      /* 该卡的坐标曲线 */
      VZ.txt(cg, 368, gy0 + 15, ch.axy, { size: 10.5, fill: ch.col });
      VZ.txt(cg, gx1 - 6, gy1 - 8, ch.axx, { size: 10.5, fill: ch.col, anchor: "end" });
      /* 区域在这张卡里的样子 */
      var ccx = (gx0 + gx1) / 2, ccy = (gy0 + gy1) / 2;
      if (idx === 0) {
        VZ.path(cg, blob(ccx, ccy, 74, 0.7), { fill: "rgba(79,227,240,.10)", stroke: ch.col, "stroke-width": 2 });
        VZ.txt(cg, ccx, ccy + 5, "同一块区域", { size: 11, fill: ch.col, anchor: "middle" });
      } else if (idx === 1) {
        VZ.el("rect", { x: ccx + 46, y: gy0 + 26, width: 84, height: gy1 - gy0 - 52, rx: 8, fill: "rgba(255,207,92,.10)", stroke: ch.col, "stroke-width": 2 }, cg);
        VZ.txt(cg, ccx + 88, ccy + 5, "同一块", { size: 11, fill: ch.col, anchor: "middle" });
        VZ.txt(cg, ccx + 88, ccy + 22, "区域", { size: 11, fill: ch.col, anchor: "middle" });
      } else {
        VZ.path(cg, "M" + ccx + " " + (ccy - 74) + "L" + (ccx + 96) + " " + ccy + "L" + ccx + " " + (ccy + 74) + "L" + (ccx - 96) + " " + ccy + "Z",
          { fill: "rgba(94,224,138,.10)", stroke: ch.col, "stroke-width": 2 });
        VZ.txt(cg, ccx, ccy + 5, "同一块区域", { size: 11, fill: ch.col, anchor: "middle" });
      }
      VZ.txt(cg, 368, 282, ch.note, { size: 10.5, fill: C.dim });
      VZ.txt(cg, 368, 298, "卡间转换：φ_B ∘ φ_A⁻¹ 光滑；恒等（同一张卡）与链式复合也光滑。", { size: 10.5, fill: C.violet });
    }

    /* ---------------- 外微分阶梯 ---------------- */
    VZ.card(svg, 340, 334, 396, 152, { stroke: "rgba(255,255,255,.13)" });
    VZ.txt(svg, 354, 358, "外微分：d 把 p-形式送到 (p+1)-形式", { size: 13, fill: C.gold, weight: 700 });
    var ND = [
      { x: 372, t: "Ω⁰", s: "函数 · 0-形式" },
      { x: 457, t: "Ω¹", s: "1-形式 ω_a" },
      { x: 542, t: "Ω²", s: "2-形式" },
      { x: 627, t: "Ω³", s: "3-形式" },
      { x: 712, t: "0", s: "没有更高的" }
    ];
    var arD = VZ.arrowDef(svg, VZ.uid("dd"), C.gold);
    ND.forEach(function (n, j) {
      VZ.circ(svg, n.x, 400, 22, { fill: "rgba(255,255,255,.04)", stroke: j === 4 ? C.dim : C.gold, "stroke-width": 1.6 });
      VZ.txt(svg, n.x, 405, n.t, { size: 13, fill: j === 4 ? C.dim : C.ink, anchor: "middle", weight: 700 });
      VZ.txt(svg, n.x, 438, n.s, { size: 9.5, fill: C.dim, anchor: "middle" });
      if (j < 4) {
        VZ.path(svg, "M" + (n.x + 25) + " 400L" + (ND[j + 1].x - 26) + " 400", VZ.stroke({ stroke: C.gold, "stroke-width": 1.6, opacity: .9, "marker-end": arD }));
        VZ.txt(svg, (n.x + ND[j + 1].x) / 2, 393, "d", { size: 12, fill: C.gold, anchor: "middle", weight: 700 });
      }
    });
    VZ.txt(svg, 538, 470, "d ∘ d = 0：边界的边界为空（第 19 章把麦克斯韦方程写成 dF = 0）", { size: 11.5, fill: C.gold, anchor: "middle" });
    var hop = VZ.circ(svg, 372, 400, 5, { fill: C.cyan });

    /* ---------------- 图示记号 ---------------- */
    VZ.card(svg, 24, 334, 300, 152, { stroke: "rgba(255,255,255,.13)" });
    VZ.txt(svg, 38, 358, "抽象指标：缩并 = 接线（§12.7–12.8）", { size: 13, fill: C.mag, weight: 700 });
    VZ.circ(svg, 76, 400, 8, { fill: "rgba(255,111,216,.15)", stroke: C.mag, "stroke-width": 1.6 });
    VZ.circ(svg, 206, 400, 8, { fill: "rgba(255,111,216,.15)", stroke: C.mag, "stroke-width": 1.6 });
    VZ.ln(svg, 84, 400, 198, 400, { stroke: C.mag, "stroke-width": 2 });
    VZ.txt(svg, 141, 392, "接线 = 缩并", { size: 10.5, fill: C.mag, anchor: "middle" });
    VZ.txt(svg, 76, 428, "u^a", { size: 13, fill: C.ink, anchor: "middle", weight: 700 });
    VZ.txt(svg, 206, 428, "v_a", { size: 13, fill: C.ink, anchor: "middle", weight: 700 });
    VZ.para(svg, 38, 452, "上下标只是位置标记：写下 u^a v_a 时根本不需要坐标系，协变性与不变性在记法层面就是显然的。", { size: 10.5, per: 30, lh: 15 });

    var out = VZ.panel(stage, { "当前坐标卡": "", "卡内坐标范围": "", "卡与卡的重叠区域": "", "物理定律": "" });
    VZ.chips(VZ.box(stage), ["卡 A：(x, y)", "卡 B：(r, θ)", "卡 C：(u, v)"], "卡 A：(x, y)", function (m) {
      select(m.charAt(2) === "A" ? 0 : (m.charAt(2) === "B" ? 1 : 2));
    });
    select(0);
    VZ.raf(svg, function (t) {
      var u = (t * 0.26) % 1;
      hop.setAttribute("cx", (372 + u * (712 - 372)).toFixed(1));
    });
  }
}

});

/* ============================================================
   viz-b.js — 图示第二批（第 13–24 章）
   与 viz-part1.js 同一套视觉语言：
   · 颜色一律取自 VZ.C；宽度一律 760；高度 240–520
   · 每张图至少一处动画或可交互；其中 8 张带真正的拖拽 / 滑杆
   ============================================================ */
VZ.define({

/* ==========================================================
   第 13 章 · 对称群
   ========================================================== */
"f-ch13": {
  title: "群与对称：乘 i 就是转 90°，转四次回到原位",
  hint: "点击左下四个小方块中的任意一个，正方形会转过去；拖动滑杆可以让它连续转。<b>四个旋转 i⁰ i¹ i² i³ 互相复合仍是其中之一，而且 i⁴ = 1</b>——这就是阶为 4 的循环群。<span class='hl'>群只在意操作如何复合，不在意元素长什么样。</span>",
  legend: [["当前元素（乘 iᵏ）", VZ.C.gold], ["四个旋转的定格位置", VZ.C.ink2], ["连续旋转（李群）", VZ.C.cyan]],
  draw: function (stage) {
    var W = 760, H = 420, svg = VZ.S(stage, W, H, { grid: true });
    var C = VZ.C;
    var cx = 156, cy = 196, R = 88;
    var names = ["1", "i", "−1", "−i"];

    VZ.ln(svg, cx - R - 30, cy, cx + R + 30, cy, { stroke: C.faint, "stroke-width": .8 });
    VZ.ln(svg, cx, cy - R - 30, cx, cy + R + 30, { stroke: C.faint, "stroke-width": .8 });
    VZ.circ(svg, cx, cy, R, { stroke: C.faint, "stroke-width": 1 });

    for (var k = 0; k < 4; k++) {
      var a = k * Math.PI / 2;
      var X = cx + R * Math.cos(a), Y = cy - R * Math.sin(a);
      VZ.circ(svg, X, Y, 4.5, { fill: C.ink2 });
      VZ.circ(svg, X, Y, 8.5, { stroke: C.ink2, "stroke-width": .8, opacity: .45, "stroke-dasharray": "2 3" });
      VZ.txt(svg, cx + (R + 24) * Math.cos(a), cy - (R + 24) * Math.sin(a) + 4, names[k],
        { size: 14, fill: C.ink, anchor: "middle", weight: 700 });
    }
    for (var m = 0; m < 4; m++) {
      var a1 = m * Math.PI / 2 + 0.2, a2 = (m + 1) * Math.PI / 2 - 0.2, rr = R - 17;
      VZ.path(svg, "M" + (cx + rr * Math.cos(a1)).toFixed(1) + " " + (cy - rr * Math.sin(a1)).toFixed(1) +
        "A" + rr + " " + rr + " 0 0 0 " + (cx + rr * Math.cos(a2)).toFixed(1) + " " + (cy - rr * Math.sin(a2)).toFixed(1),
        VZ.stroke({ stroke: C.faint, "stroke-width": 1, "stroke-dasharray": "3 4" }));
    }
    VZ.txt(svg, cx, cy + R + 40, "逆时针一格 = 乘 i", { size: 11.5, fill: C.dim, anchor: "middle" });

    /* 旋转中的正方形 */
    var sqFill = VZ.path(svg, "", { fill: "rgba(255,255,255,.05)", stroke: "none" });
    var sq = VZ.path(svg, "", VZ.stroke({ stroke: C.ink, "stroke-width": 2.2 }));
    var radLine = VZ.path(svg, "", VZ.stroke({ stroke: C.gold, "stroke-width": 2.4 }));
    var flag = VZ.path(svg, "", { fill: C.gold });
    var corner = VZ.circ(svg, 0, 0, 6.5, { fill: C.gold });

    /* 乘法表 iᵐ·iⁿ = i^((m+n) mod 4) */
    var tx = 344, ty = 64, cs = 44, hh = 26;
    VZ.txt(svg, tx, ty - 10, "乘法表  iᵐ · iⁿ = i^((m+n) mod 4)", { size: 12, fill: C.ink2 });
    var cellBg = [];
    for (var r = 0; r < 4; r++) {
      VZ.txt(svg, tx + 22, ty + hh + r * cs + cs / 2 + 5, names[r],
        { size: 13, fill: C.ink2, anchor: "middle", weight: 700 });
      for (var c = 0; c < 4; c++) {
        var X0 = tx + cs + c * cs, Y0 = ty + hh + r * cs;
        cellBg.push(VZ.el("rect", { x: X0, y: Y0, width: cs, height: cs, fill: "rgba(255,255,255,.03)", stroke: C.faint, "stroke-width": .8 }, svg));
        VZ.txt(svg, X0 + cs / 2, Y0 + cs / 2 + 5, names[(r + c) % 4],
          { size: 14, fill: C.ink, anchor: "middle" });
      }
    }
    for (var c2 = 0; c2 < 4; c2++) {
      VZ.txt(svg, tx + cs + c2 * cs + cs / 2, ty + hh - 8, names[c2],
        { size: 13, fill: C.ink2, anchor: "middle", weight: 700 });
    }
    VZ.txt(svg, tx + cs + 2 * cs, ty + hh + 4 * cs + 20, "行列各标一个旋转，格内是它们的复合",
      { size: 10.5, fill: C.dim, anchor: "middle" });

    /* 右侧公理卡片 */
    VZ.card(svg, 580, 64, 160, 220, { stroke: "rgba(255,255,255,.12)" });
    VZ.txt(svg, 592, 86, "群的三条公理", { size: 13, fill: C.cyan, weight: 700 });
    VZ.para(svg, 592, 106, "① 结合律\n   (ab)c = a(bc)\n② 单位元\n   1a = a1 = a\n③ 每个元有逆 a⁻¹", { size: 11, per: 13, lh: 16 });
    VZ.txt(svg, 592, 202, "允许翻面（复共轭 C）", { size: 11.5, fill: C.mag, weight: 700 });
    VZ.para(svg, 592, 222, "元素 4 → 8，且 Ci = i³C：乘法不再交换，这是非交换群最袖珍的样本。",
      { size: 10.5, per: 13, lh: 15 });

    /* 四个可点击的旋转 */
    var mins = [];
    for (var q = 0; q < 4; q++) {
      var gx = 52 + q * 80, gy = 344;
      var gg = VZ.g(svg, { style: "cursor:pointer" });
      VZ.el("rect", { x: gx - 24, y: gy - 24, width: 48, height: 48, fill: "rgba(255,255,255,.001)" }, gg);
      var dm = VZ.path(gg, "M" + (gx + 16) + " " + gy + "L" + gx + " " + (gy - 16) + "L" + (gx - 16) + " " + gy + "L" + gx + " " + (gy + 16) + "Z",
        VZ.stroke({ stroke: C.ink2, "stroke-width": 1.6 }));
      var dt = VZ.circ(gg, gx + 16 * Math.cos(q * Math.PI / 2), gy - 16 * Math.sin(q * Math.PI / 2), 4, { fill: C.gold });
      VZ.txt(gg, gx, gy + 38, names[q] + "  " + (q * 90) + "°", { size: 11.5, fill: C.dim, anchor: "middle" });
      mins.push({ dm: dm, dt: dt, q: q, gx: gx, gy: gy });
      (function (qq) {
        gg.addEventListener("click", function () { targetDeg = qq * 90; });
      })(q);
    }
    VZ.txt(svg, 344, 306, "点一个旋转，正方形会转过去", { size: 11, fill: C.gold });

    var thetaDeg = 0, targetDeg = 0;
    function redraw() {
      var th = thetaDeg * Math.PI / 180, pts = [];
      for (var i = 0; i < 4; i++) {
        var aa = i * Math.PI / 2 + th;
        pts.push([cx + R * Math.cos(aa), cy - R * Math.sin(aa)]);
      }
      var ds = "M" + pts.map(function (p) { return p[0].toFixed(1) + " " + p[1].toFixed(1); }).join("L") + "Z";
      sq.setAttribute("d", ds); sqFill.setAttribute("d", ds);
      radLine.setAttribute("d", "M" + cx + " " + cy + "L" + pts[0][0].toFixed(1) + " " + pts[0][1].toFixed(1));
      corner.setAttribute("cx", pts[0][0].toFixed(1)); corner.setAttribute("cy", pts[0][1].toFixed(1));
      var mx = pts[0][0] * .68 + pts[1][0] * .32, my = pts[0][1] * .68 + pts[1][1] * .32;
      var dx = pts[1][0] - pts[0][0], dy = pts[1][1] - pts[0][1], dl = Math.hypot(dx, dy) || 1;
      var ux = dx / dl, uy = dy / dl, nx = -uy, ny = ux, ss = 8;
      flag.setAttribute("d", "M" + (mx + ux * ss).toFixed(1) + " " + (my + uy * ss).toFixed(1) +
        "L" + (mx - ux * ss * .5 + nx * ss * .7).toFixed(1) + " " + (my - uy * ss * .5 + ny * ss * .7).toFixed(1) +
        "L" + (mx - ux * ss * .5 - nx * ss * .7).toFixed(1) + " " + (my - uy * ss * .5 - ny * ss * .7).toFixed(1) + "Z");
      var kk = ((Math.round(thetaDeg / 90) % 4) + 4) % 4;
      for (var r2 = 0; r2 < 4; r2++) for (var c3 = 0; c3 < 4; c3++) {
        var e = cellBg[r2 * 4 + c3];
        e.setAttribute("fill", "rgba(255,255,255,.03)");
        e.setAttribute("stroke", C.faint); e.setAttribute("stroke-width", .8);
      }
      for (var c4 = 0; c4 < 4; c4++) cellBg[kk * 4 + c4].setAttribute("fill", "rgba(255,207,92,.10)");
      cellBg[kk * 4 + 1].setAttribute("fill", "rgba(255,207,92,.30)");
      cellBg[kk * 4 + 1].setAttribute("stroke", C.gold);
      cellBg[kk * 4 + 1].setAttribute("stroke-width", 1.6);
      mins.forEach(function (mm) {
        mm.dm.setAttribute("stroke", mm.q === kk ? C.gold : C.ink2);
        mm.dm.setAttribute("stroke-width", mm.q === kk ? 2.4 : 1.6);
        mm.dt.setAttribute("cx", mm.gx + 16 * Math.cos(mm.q * Math.PI / 2));
        mm.dt.setAttribute("cy", mm.gy - 16 * Math.sin(mm.q * Math.PI / 2));
        mm.dt.setAttribute("r", mm.q === kk ? 5.5 : 4);
      });
      VZ.setPanel(out, {
        "当前元素": names[kk],
        "旋转角 θ": thetaDeg.toFixed(0) + "°",
        "再乘一次 i": names[(kk + 1) % 4]
      });
    }
    var out = VZ.panel(stage, { "当前元素": "1", "旋转角 θ": "0°", "再乘一次 i": "i" });
    VZ.slider(stage, {
      label: "连续旋转角度 θ（李群的连续参数）", min: 0, max: 360, step: 1, value: 0,
      format: function (v) { return v.toFixed(0) + "°"; },
      onInput: function (v) { targetDeg = v; thetaDeg = v; redraw(); }
    });
    VZ.raf(svg, function () {
      var d = targetDeg - thetaDeg;
      if (Math.abs(d) > 0.1) { thetaDeg += d * 0.18; redraw(); }
    });
    redraw();
  }
},

/* ==========================================================
   第 14 章 · 流形上的微积分（锥面版平行移动）
   ========================================================== */
"f-ch14": {
  title: "曲率 = 绕一圈回来方向对不上（把纸剪口卷成锥）",
  hint: "一张纸剪掉一个楔形再卷成锥：<b>让矢量沿锥面绕顶点走一圈，回到起点时它转过的角度恰好等于剪掉的那个缺口角 δ</b>。在右边拖动（或看它自己转）——底面一圈走完，幽灵箭头与实际箭头之间的夹角就是和乐。<span class='hl'>这个「回来对不上」的差额，就是曲率。</span>",
  legend: [["被平行搬运的矢量", VZ.C.cyan], ["出发时的方向（幽灵）", VZ.C.mag], ["剪口 / 和乐角 δ", VZ.C.gold]],
  draw: function (stage) {
    var W = 760, H = 420, svg = VZ.S(stage, W, H, { grid: true });
    var C = VZ.C;
    var DEL = 60 * Math.PI / 180;

    /* ---- 左：剪掉楔形的纸 ---- */
    var lx = 150, ly = 205, LR = 92;
    var a2 = Math.PI + DEL / 2, a3 = 3 * Math.PI - DEL / 2;
    var p2 = [lx + LR * Math.cos(a2), ly - LR * Math.sin(a2)];
    var p3 = [lx + LR * Math.cos(a3), ly - LR * Math.sin(a3)];
    VZ.path(svg, "M" + lx + " " + ly + "L" + p2[0].toFixed(1) + " " + p2[1].toFixed(1) +
      "A" + LR + " " + LR + " 0 1 0 " + p3[0].toFixed(1) + " " + p3[1].toFixed(1) + "Z",
      { fill: "rgba(255,255,255,.05)", stroke: C.ink2, "stroke-width": 1.4 });
    VZ.ln(svg, lx, ly, p2[0], p2[1], { stroke: C.gold, "stroke-width": 2.4 });
    VZ.ln(svg, lx, ly, p3[0], p3[1], { stroke: C.gold, "stroke-width": 2.4 });
    VZ.path(svg, "M" + (lx - 40) + " " + ly + "A40 40 0 0 1 " + (lx - 40 * Math.cos(DEL)) + " " + (ly - 40 * Math.sin(DEL)),
      VZ.stroke({ stroke: C.gold, "stroke-width": 1.2, "stroke-dasharray": "3 3" }));
    VZ.txt(svg, lx - 54, ly - 6, "δ", { size: 15, fill: C.gold, weight: 700, anchor: "end" });
    VZ.txt(svg, lx, ly - LR - 26, "平面：一张纸，剪掉一个楔形", { size: 12.5, fill: C.ink, anchor: "middle" });
    VZ.txt(svg, lx, ly + LR + 34, "剪口两边粘起来 →", { size: 11.5, fill: C.gold, anchor: "middle" });

    /* ---- 右：卷成的锥 ---- */
    var Bx = 500, By = 300, rx = 96, ry = 26, Ax = 500, Ay = 92;
    VZ.ln(svg, Ax, Ay, Bx - rx, By, { stroke: C.ink, "stroke-width": 1.8 });
    VZ.ln(svg, Ax, Ay, Bx + rx, By, { stroke: C.ink, "stroke-width": 1.8 });
    VZ.path(svg, "M" + (Bx - rx) + " " + By + "A" + rx + " " + ry + " 0 0 0 " + (Bx + rx) + " " + By,
      VZ.stroke({ stroke: C.ink2, "stroke-width": 1.6 }));
    VZ.path(svg, "M" + (Bx - rx) + " " + By + "A" + rx + " " + ry + " 0 0 1 " + (Bx + rx) + " " + By,
      VZ.stroke({ stroke: C.faint, "stroke-width": 1.2, "stroke-dasharray": "5 5" }));
    var seamX = Bx, seamY = By + ry;
    VZ.ln(svg, Ax, Ay, seamX, seamY, { stroke: C.gold, "stroke-width": 2.2, opacity: .9 });
    VZ.txt(svg, seamX + 8, seamY + 16, "接缝（两片剪口）", { size: 11, fill: C.gold });
    VZ.txt(svg, Ax, Ay - 20, "卷成锥：沿锥面走一圈", { size: 12.5, fill: C.ink, anchor: "middle" });
    VZ.txt(svg, Ax, Ay - 4, "顶点", { size: 10.5, fill: C.dim, anchor: "middle" });

    /* 动点 + 矢量 */
    var ghost = VZ.path(svg, "", VZ.stroke({ stroke: C.mag, "stroke-width": 2, "stroke-dasharray": "5 4", opacity: .85 }));
    var live = VZ.path(svg, "", VZ.stroke({ stroke: C.cyan, "stroke-width": 3 }));
    var liveHead = VZ.path(svg, "", { fill: C.cyan });
    var ghostHead = VZ.path(svg, "", { fill: C.mag, opacity: .55 });
    var dot = VZ.circ(svg, 0, 0, 6, { fill: C.cyan });
    var holArc = VZ.path(svg, "", VZ.stroke({ stroke: C.gold, "stroke-width": 1.6 }));
    var holTxt = VZ.txt(svg, 0, 0, "", { size: 12, fill: C.gold, weight: 700 });
    var phi = 0, auto = true, lastDrag = -99, tNow = 0;
    var PSI0 = -Math.PI / 2 - 0.45;

    function headPath(x, y, ang, len, w) {
      var hx = x + len * Math.cos(ang), hy = y + len * Math.sin(ang);
      var bx = hx - len * .3 * Math.cos(ang), by = hy - len * .3 * Math.sin(ang);
      var hw = w * 2.6;
      return "M" + hx.toFixed(1) + " " + hy.toFixed(1) +
        "L" + (bx - hw * Math.sin(ang)).toFixed(1) + " " + (by + hw * Math.cos(ang)).toFixed(1) +
        "L" + (bx + hw * Math.sin(ang)).toFixed(1) + " " + (by - hw * Math.cos(ang)).toFixed(1) + "Z";
    }
    function draw() {
      var P = [Bx + rx * Math.cos(phi), By + ry * Math.sin(phi)];
      var front = Math.sin(phi) > 0;
      var psi = PSI0 - DEL * (phi / (2 * Math.PI));
      var L = 40;
      live.setAttribute("d", "M" + P[0].toFixed(1) + " " + P[1].toFixed(1) + "L" +
        (P[0] + L * Math.cos(psi)).toFixed(1) + " " + (P[1] + L * Math.sin(psi)).toFixed(1));
      liveHead.setAttribute("d", headPath(P[0], P[1], psi, L, 4.2));
      ghost.setAttribute("d", "M" + P[0].toFixed(1) + " " + P[1].toFixed(1) + "L" +
        (P[0] + L * Math.cos(PSI0)).toFixed(1) + " " + (P[1] + L * Math.sin(PSI0)).toFixed(1));
      ghostHead.setAttribute("d", headPath(P[0], P[1], PSI0, L, 4.2));
      dot.setAttribute("cx", P[0].toFixed(1)); dot.setAttribute("cy", P[1].toFixed(1));
      dot.setAttribute("opacity", front ? 1 : .35);
      var turn = -DEL * (phi / (2 * Math.PI));
      var r0 = 26, sx = P[0] + r0 * Math.cos(PSI0), sy = P[1] + r0 * Math.sin(PSI0);
      var ex = P[0] + r0 * Math.cos(PSI0 + turn), ey = P[1] + r0 * Math.sin(PSI0 + turn);
      if (Math.abs(turn) > 0.06) {
        holArc.setAttribute("d", "M" + sx.toFixed(1) + " " + sy.toFixed(1) + "A" + r0 + " " + r0 + " 0 " +
          (Math.abs(turn) > Math.PI ? 1 : 0) + " " + (turn > 0 ? 1 : 0) + " " + ex.toFixed(1) + " " + ey.toFixed(1));
      } else holArc.setAttribute("d", "");
      holTxt.setAttribute("x", P[0] + r0 * Math.cos(PSI0 + turn / 2) - 8);
      holTxt.setAttribute("y", P[1] + r0 * Math.sin(PSI0 + turn / 2) - 8);
      holTxt.textContent = Math.abs(turn) < 0.06 ? "" : ("转过 " + (-turn * 180 / Math.PI).toFixed(0) + "°");
      VZ.setPanel(out, {
        "绕行进度": (phi / (2 * Math.PI) * 100).toFixed(0) + "%",
        "矢量已转过": (-turn * 180 / Math.PI).toFixed(1) + "°",
        "缺口角 δ": "60°"
      });
    }
    var out = VZ.panel(stage, { "绕行进度": "0%", "矢量已转过": "0.0°", "缺口角 δ": "60°" });
    VZ.drag(svg, svg, W, H, function (x, y, phase) {
      if (x < 300) return;
      if (phase === "start" || phase === "move") {
        phi = Math.atan2((y - By) / ry, (x - Bx) / rx);
        auto = false; lastDrag = tNow; draw();
      }
    });
    VZ.raf(svg, function (t, ms) {
      tNow = t;
      if (!auto && t - lastDrag > 3) auto = true;
      if (auto) { phi += ms / 1000 * 0.62; }
      draw();
    });
    draw();
  }
},

/* ==========================================================
   第 15 章 · 纤维丛与规范联络
   ========================================================== */
"f-ch15": {
  title: "纤维丛：底空间每点挂一根纤维，联络负责对齐",
  hint: "底空间是一条横轴，每个点上方挂一根纤维；截面的金色点表示「该点上纤维里的一个元素」。拖动滑杆让它沿底空间移动，看它如何被抬升成一条截面。右边的小图是同一件事套在一个闭环上：<b>绕一圈回来元素对不上——这就是丛曲率</b>。",
  legend: [["底空间 M", VZ.C.ink2], ["纤维 F", VZ.C.faint], ["截面（场）", VZ.C.cyan], ["联络对齐的元素", VZ.C.gold]],
  draw: function (stage) {
    var W = 760, H = 380, svg = VZ.S(stage, W, H, { grid: true });
    var C = VZ.C;
    var bx0 = 56, bx1 = 448, by = 300;
    var secY = function (x) { return by - (104 + 52 * Math.sin((x - bx0) / 62)); };

    VZ.ln(svg, bx0 - 6, by, bx1 + 6, by, { stroke: C.ink2, "stroke-width": 2 });
    VZ.arrowDef(svg, "ar15", C.ink2);
    VZ.txt(svg, bx1 + 8, by + 5, "底空间 M", { size: 11.5, fill: C.dim });

    var fxs = [];
    for (var x = bx0; x <= bx1 + 1; x += 65) fxs.push(x);
    fxs.forEach(function (fx) {
      VZ.ln(svg, fx, by, fx, 92, { stroke: C.faint, "stroke-width": 1 });
      VZ.path(svg, "M" + (fx - 4) + " 98l4 -8l4 8z", { fill: C.faint });
    });
    VZ.txt(svg, bx1, 84, "纤维 F", { size: 11.5, fill: C.dim, anchor: "end" });
    VZ.txt(svg, bx0 - 6, 84, "每点挂一根：π⁻¹(x)", { size: 11, fill: C.dim });

    var d = "";
    for (var xx = bx0; xx <= bx1; xx += 6) d += (xx === bx0 ? "M" : "L") + xx + " " + secY(xx).toFixed(1);
    VZ.path(svg, d, VZ.stroke({ stroke: C.cyan, "stroke-width": 2.4 }));
    fxs.forEach(function (fx) {
      VZ.circ(svg, fx, secY(fx), 4, { fill: C.cyan });
      VZ.ln(svg, fx, secY(fx), fx, by, { stroke: C.cyan, "stroke-width": .9, "stroke-dasharray": "2 3", opacity: .55 });
    });

    /* 联络：相邻纤维的对齐 */
    var gpx = fxs[2], gpy = secY(gpx), gnx = fxs[3], gny = secY(gnx);
    VZ.ln(svg, gpx, gpy, gnx, gny, { stroke: C.gold, "stroke-width": 3 });
    VZ.circ(svg, gpx, gpy, 6, { fill: C.gold });
    VZ.circ(svg, gnx, gny, 6, { fill: C.gold });
    VZ.txt(svg, (gpx + gnx) / 2, gpy - 12, "联络", { size: 12, fill: C.gold, anchor: "middle", weight: 700 });

    /* 抬升点：由滑杆控制 */
    var liftLine = VZ.ln(svg, bx0, by, bx0, 92, { stroke: C.gold, "stroke-width": 1, "stroke-dasharray": "3 3", opacity: .8 });
    var liftDot = VZ.circ(svg, bx0, secY(bx0), 7, { fill: C.gold });
    var liftBase = VZ.circ(svg, bx0, by, 4.5, { fill: C.gold });
    function setS(s) {
      var x = bx0 + s * (bx1 - bx0), y = secY(x);
      liftLine.setAttribute("x1", x); liftLine.setAttribute("x2", x);
      liftLine.setAttribute("y2", y);
      liftDot.setAttribute("cx", x); liftDot.setAttribute("cy", y);
      liftBase.setAttribute("cx", x); liftBase.setAttribute("cy", by);
    }
    setS(0.35);
    VZ.slider(stage, {
      label: "沿底空间的位置（抬升点）", min: 0, max: 1, step: 0.005, value: 0.35,
      format: function (v) { return v.toFixed(2); },
      onInput: function (v) { setS(v); }
    });

    /* 右侧：联络的说明 + 闭环（曲率） */
    VZ.card(svg, 476, 46, 264, 92, { stroke: "rgba(255,255,255,.12)" });
    VZ.txt(svg, 490, 70, "联络 = 告诉你相邻纤维怎么对齐", { size: 13, fill: C.gold, weight: 700 });
    VZ.para(svg, 490, 92, "有了它，才能把 A 点纤维里的元素搬到 B 点而不胡乱旋转；经典场就是丛的一个截面。",
      { size: 11.5, per: 21, lh: 18 });

    var ocx = 606, ocy = 250, orx = 74, ory = 26, DEL15 = 1.05;
    VZ.path(svg, "M" + (ocx - orx) + " " + ocy + "A" + orx + " " + ory + " 0 1 0 " + (ocx + orx) + " " + ocy + "A" + orx + " " + ory + " 0 1 0 " + (ocx - orx) + " " + ocy,
      VZ.stroke({ stroke: C.ink2, "stroke-width": 1.6 }));
    var hopDotO = VZ.circ(svg, ocx - orx, ocy, 5.5, { fill: C.cyan });
    for (var i2 = 0; i2 < 8; i2++) {
      var th = i2 / 8 * 2 * Math.PI;
      var px = ocx + orx * Math.cos(th), py = ocy + ory * Math.sin(th);
      var ux2 = Math.cos(th), uy2 = Math.sin(th) * (ory / orx);
      var nl = Math.hypot(ux2, uy2) || 1; ux2 /= nl; uy2 /= nl;
      var vAng = -Math.PI / 2 + DEL15 * i2 / 8;
      var ex = px + 26 * Math.cos(vAng), ey = py + 26 * Math.sin(vAng);
      VZ.ln(svg, px, py, px + 20 * ux2, py + 20 * uy2, { stroke: C.faint, "stroke-width": 1 });
      VZ.ln(svg, px, py, ex, ey, VZ.stroke({ stroke: (i2 === 0 ? C.mag : C.cyan), "stroke-width": i2 === 0 ? 2.4 : 1.8, opacity: i2 === 0 ? .9 : .55, "stroke-dasharray": i2 === 0 ? "4 3" : "none" }));
      VZ.circ(svg, px, py, 2.5, { fill: C.ink2 });
    }
    VZ.raf(svg, function (t) {
      var a = -Math.PI / 2 + t * 0.9;
      hopDotO.setAttribute("cx", ocx + orx * Math.cos(a));
      hopDotO.setAttribute("cy", ocy + ory * Math.sin(a));
    });
    VZ.txt(svg, ocx, ocy + ory + 44, "底空间绕一圈", { size: 11.5, fill: C.dim, anchor: "middle" });
    VZ.txt(svg, ocx, ocy + ory + 62, "回来时元素对不上 ⇒ 丛曲率", { size: 12, fill: C.mag, anchor: "middle", weight: 700 });
    VZ.txt(svg, ocx, ocy - ory - 40, "纤维元素被搬运一圈", { size: 11, fill: C.cyan, anchor: "middle" });

    /* 截面上的流动光点 */
    (function () {
      var gp = VZ.g(svg);
      var pp = VZ.path(gp, d, { stroke: "none", fill: "none" });
      var len = 0; try { len = pp.getTotalLength(); } catch (e) { return; }
      var s0 = pp.getPointAtLength(0);
      var dots = [VZ.circ(gp, s0.x, s0.y, 4, { fill: C.cyan })];
      VZ.raf(svg, function (t) {
        var u = ((t * 0.42) % 1);
        var pt = pp.getPointAtLength(u * len);
        dots[0].setAttribute("cx", pt.x); dots[0].setAttribute("cy", pt.y);
        dots[0].setAttribute("opacity", Math.sin(Math.PI * u) * .9 + .1);
      });
    })();
  }
},

/* ==========================================================
   第 16 章 · 无穷的阶梯
   ========================================================== */
"f-ch16": {
  title: "康托对角线 · 有限域 F_p：两种「数不过来」",
  hint: "左边：假设实数能排成一张清单，把对角线上的数字逐位取反，造出的新数<b>一定不在清单里</b>——所以实数比自然数多。右边：模素数 p 的整数只有 p 个等价类，加减乘除全在有限步内完成。点击 p = 2 / 3 / 5 / 7，看非零元在乘法下绕圈。",
  legend: [["对角线（逐位取反）", VZ.C.gold], ["构造出的新数", VZ.C.red], ["乘法的循环", VZ.C.cyan]],
  draw: function (stage) {
    var W = 760, H = 430, svg = VZ.S(stage, W, H, { grid: true });
    var C = VZ.C;
    var M = [
      [3, 1, 4, 1, 5, 9],
      [2, 7, 1, 8, 2, 8],
      [1, 4, 1, 4, 2, 1],
      [5, 0, 5, 0, 5, 0],
      [8, 2, 8, 8, 4, 3],
      [7, 1, 6, 5, 3, 9]
    ];
    var dx0 = 116, dy0 = 88, dw = 26, dh = 30;

    VZ.txt(svg, 44, 60, "康托对角线：逐位取反，造出一个不在清单里的数", { size: 12.5, fill: C.ink });
    var diagRects = [];
    for (var r = 0; r < 6; r++) {
      var y = dy0 + r * dh;
      VZ.txt(svg, dx0 - 22, y + 20, "r" + "₁₂₃₄₅₆"[r], { size: 12, fill: C.dim, anchor: "end" });
      VZ.txt(svg, dx0 - 8, y + 20, "0.", { size: 12, fill: C.ink2 });
      for (var c = 0; c < 6; c++) {
        var X = dx0 + c * dw;
        VZ.txt(svg, X + dw / 2, y + 20, String(M[r][c]), { size: 13, fill: r === c ? C.gold : C.ink2, anchor: "middle", weight: r === c ? 700 : 400 });
        if (r === c) diagRects.push(VZ.el("rect", { x: X - 1, y: y + 3, width: dw, height: 24, rx: 5, fill: "none", stroke: C.gold, "stroke-width": 1.2, opacity: .5 }, svg));
      }
    }
    var ny = dy0 + 6 * dh + 20;
    VZ.txt(svg, dx0 - 22, ny + 20, "d", { size: 13, fill: C.red, anchor: "end", weight: 700 });
    VZ.txt(svg, dx0 - 8, ny + 20, "0.", { size: 12, fill: C.red });
    var newTxts = [];
    for (var c2 = 0; c2 < 6; c2++) {
      var t = VZ.txt(svg, dx0 + c2 * dw + dw / 2, ny + 20, String((M[c2][c2] + 1) % 10),
        { size: 14, fill: C.red, anchor: "middle", weight: 700, opacity: 0 });
      newTxts.push(t);
    }
    var scanRect = VZ.el("rect", { x: dx0 - 1, y: dy0 + 3, width: dw, height: 24, rx: 5, fill: "rgba(255,207,92,.22)", stroke: C.gold, "stroke-width": 1.6 }, svg);
    VZ.txt(svg, 44, ny + 52, "它和第 k 行在第 k 位一定不同 ⇒ 清单漏掉了它 ⇒ 实数不可数", { size: 12, fill: C.ink2 });
    VZ.txt(svg, 44, ny + 74, "同一招的化身：哥德尔（不完全命题）· 图灵（停机问题）", { size: 11.5, fill: C.dim });

    /* ---- 右：有限域 ---- */
    var ccx = 618, ccy = 196, CR = 92;
    VZ.txt(svg, ccx, 56, "有限域 F_p：恰好 p 个等价类", { size: 12.5, fill: C.ink, anchor: "middle" });
    var p = 5, seq = [], pts = [];
    var chords = [];
    for (var ci = 0; ci < 7; ci++) chords.push(VZ.path(svg, "", VZ.stroke({ stroke: C.cyan, "stroke-width": 1.8, opacity: 0 })));
    var hopDot = VZ.circ(svg, ccx, ccy, 7, { fill: C.gold });
    var pBtns = [];
    var statTxt = VZ.txt(svg, ccx, ccy + CR + 22, "", { size: 10.5, fill: C.dim, anchor: "middle" });
    function rebuild(np) {
      p = np;
      var gmap = { 2: 1, 3: 2, 5: 2, 7: 3 }, g = gmap[p];
      seq = [1 % p];
      if (p > 2) { var v = g; while (v !== 1) { seq.push(v); v = (v * g) % p; } }
      pts = [];
      for (var i = 0; i < p; i++) {
        var a = -Math.PI / 2 + i * 2 * Math.PI / p;
        pts.push([ccx + CR * Math.cos(a), ccy + CR * Math.sin(a)]);
      }
      circG.innerHTML = "";
      for (var j = 0; j < p; j++) {
        VZ.circ(circG, pts[j][0], pts[j][1], 15, { fill: "rgba(12,8,32,.9)", stroke: C.faint, "stroke-width": 1 });
        VZ.txt(circG, pts[j][0], pts[j][1] + 5, String(j), { size: 12.5, fill: C.ink, anchor: "middle", weight: 700 });
      }
      statTxt.textContent = "非零元共 " + (p - 1) + " 个，在乘法下构成循环群";
      pBtns.forEach(function (b) {
        b.setAttribute("stroke", b.__p === p ? C.cyan : C.faint);
        b.setAttribute("stroke-width", b.__p === p ? 1.8 : .9);
      });
    }
    var circG = VZ.g(svg);
    var circP = VZ.circ(svg, ccx, ccy, CR, { stroke: C.faint, "stroke-width": 1.2 });
    for (var bi = 0; bi < 4; bi++) {
      var pv = [2, 3, 5, 7][bi], bxx = 546 + bi * 52;
      var bg2 = VZ.g(svg, { style: "cursor:pointer" });
      var br = VZ.el("rect", { x: bxx - 22, y: 328, width: 44, height: 30, rx: 8, fill: "rgba(255,255,255,.04)", stroke: C.faint, "stroke-width": .9 }, bg2);
      VZ.txt(bg2, bxx, 348, "p=" + pv, { size: 12, fill: C.ink, anchor: "middle" });
      br.__p = pv;
      pBtns.push(br);
      (function (vv) { bg2.addEventListener("click", function () { rebuild(vv); }); })(pv);
    }
    VZ.txt(svg, 618, 384, "所有算术都在有限步内完成 ⇒ 不需要无穷", { size: 11.5, fill: C.green, anchor: "middle" });

    VZ.raf(svg, function (t) {
      var ph = (t * 0.75) % 7;
      var idx = Math.min(5, Math.floor(ph));
      scanRect.setAttribute("y", dy0 + idx * dh + 3);
      newTxts.forEach(function (tt, i) { tt.setAttribute("opacity", i <= idx ? 1 : 0); });
      diagRects.forEach(function (rr2, i) { rr2.setAttribute("opacity", i === idx ? 1 : .4); });
      if (seq.length > 1) {
        var n = Math.floor(t / 0.62) % seq.length;
        var a = seq[n], b = seq[(n + 1) % seq.length];
        var pa = pts[a], pb = pts[b];
        for (var ci2 = 0; ci2 < chords.length; ci2++) {
          if (ci2 < n) {
            var s1 = seq[ci2], s2 = seq[ci2 + 1];
            chords[ci2].setAttribute("d", "M" + pts[s1][0] + " " + pts[s1][1] + "L" + pts[s2][0] + " " + pts[s2][1]);
            chords[ci2].setAttribute("opacity", 0.15 + 0.5 * (ci2 / seq.length));
          } else chords[ci2].setAttribute("opacity", 0);
        }
        hopDot.setAttribute("cx", pb[0]); hopDot.setAttribute("cy", pb[1]);
      }
    });
    rebuild(5);
  }
},

/* ==========================================================
   第 17 章 · 时空的四级台阶
   ========================================================== */
"f-ch17": {
  title: "时空的四级台阶：每上一级，就脱掉一点结构",
  hint: "点击任意一级台阶，看它<b>相对化了什么</b>：亚里士多德什么都不放手 → 伽利略扔掉绝对位置 → 卡当/牛顿把引力放进联络 → 闵可夫斯基连绝对时间也扔掉。右上角是光锥：<span class='hl'>剩下的绝对结构只有时空间隔与光锥，因果因此得保。</span>",
  legend: [["已相对化的结构", VZ.C.gold], ["仍保留的绝对结构", VZ.C.ink2], ["光锥（因果边界）", VZ.C.cyan]],
  draw: function (stage) {
    var W = 760, H = 440, svg = VZ.S(stage, W, H, { grid: true });
    var C = VZ.C;
    var steps = [
      { n: "① 亚里士多德", rel: "相对化：—", keep: "绝对位置 + 绝对时间",
        d: "空间有优先原点（地球中心），时间是 E¹，于是「绝对静止」有意义。位置与时间都被锁死。" },
      { n: "② 伽利略", rel: "相对化：绝对位置", keep: "仍保留绝对时间",
        d: "匀速直线运动的参考系彼此等价，「静止」失去绝对意义。但时间仍普适：所有人共用同一个时钟读数与同一个「现在」。" },
      { n: "③ 卡当 / 牛顿", rel: "相对化：引力 → 联络", keep: "仍有绝对时间切片",
        d: "四维几何：有绝对时间（存在同时性切片），有绝对空间结构，带一个无挠但有曲率的联络——引力已是几何，可时空仍然是「平」的。" },
      { n: "④ 闵可夫斯基", rel: "相对化：绝对时间", keep: "只剩间隔 + 光锥",
        d: "连绝对时间也扔掉：不存在切全宇宙的普适「现在」。同时性变成相对的，而因果由光锥接管。（第 ⑤ 级是广义相对论：时空本身成为动力学对象。）" }
    ];
    var bw = 118, gap = 18, base = 348, x0 = 30;
    var blocks = [];
    steps.forEach(function (s, i) {
      var x = x0 + i * (bw + gap), top = 292 - i * 48;
      var gg = VZ.g(svg, { style: "cursor:pointer" });
      VZ.el("rect", { x: x, y: top, width: bw, height: base - top, rx: 8, fill: "rgba(255,255,255,.045)", stroke: C.faint, "stroke-width": 1.1 }, gg);
      VZ.txt(gg, x + 24, top - 12, s.n, { size: 12, fill: C.ink, weight: 700 });
      VZ.txt(gg, x + bw / 2, top + 22, s.rel, { size: 10.5, fill: C.gold, anchor: "middle" });
      VZ.para(gg, x + bw / 2, top + 42, s.keep, { size: 10, per: 11, lh: 14, fill: C.ink2, anchor: "middle" });
      gg.addEventListener("click", function () { sel = i; });
      blocks.push({ g: gg, rect: gg.firstChild, x: x + 12, y: top - 8, i: i });
    });
    var ball = VZ.circ(svg, blocks[0].x, blocks[0].y, 8, { fill: C.gold, opacity: .95 });

    /* 光锥小图 */
    var ox = 662, oy = 168, cL = 76;
    VZ.ln(svg, ox - 92, oy, ox + 92, oy, { stroke: C.faint, "stroke-width": 1 });
    VZ.ln(svg, ox, oy - 92, ox, oy + 92, { stroke: C.faint, "stroke-width": 1 });
    VZ.poly(svg, [[ox, oy], [ox + cL, oy - cL], [ox - cL, oy - cL]], { fill: "rgba(79,227,240,.16)", close: true });
    VZ.poly(svg, [[ox, oy], [ox + cL, oy + cL], [ox - cL, oy + cL]], { fill: "rgba(79,227,240,.07)", close: true });
    VZ.path(svg, "M" + (ox - cL) + " " + (oy - cL) + "L" + ox + " " + oy + "L" + (ox + cL) + " " + (oy - cL), VZ.stroke({ stroke: C.cyan, "stroke-width": 1.5 }));
    VZ.txt(svg, ox + cL + 12, oy - cL + 4, "未来", { size: 10.5, fill: C.cyan, anchor: "end" });
    VZ.txt(svg, ox + cL + 12, oy + cL + 12, "过去", { size: 10.5, fill: C.cyan, opacity: .8, anchor: "end" });
    VZ.txt(svg, ox, oy - 100, "光锥：剩下的绝对结构", { size: 11, fill: C.cyan, anchor: "middle" });
    (function () {
      var tr = VZ.g(svg);
      var pp = VZ.path(tr, "M" + (ox - 70) + " " + (oy + 70) + "L" + (ox + 70) + " " + (oy - 70), { stroke: "none", fill: "none" });
      var d0 = pp.getPointAtLength(0);
      var dotA = VZ.circ(tr, d0.x, d0.y, 3.5, { fill: C.cyan });
      var len = 0; try { len = pp.getTotalLength(); } catch (e) { return; }
      VZ.raf(svg, function (t) {
        var u = (t * 0.5) % 1, q = pp.getPointAtLength(u * len);
        dotA.setAttribute("cx", q.x); dotA.setAttribute("cy", q.y);
        dotA.setAttribute("opacity", Math.sin(Math.PI * u) * .9 + .1);
      });
    })();

    /* 详情卡 */
    var dg = VZ.g(svg);
    VZ.el("rect", { x: 30, y: 360, width: 700, height: 72, rx: 10, fill: "rgba(255,255,255,.045)", stroke: C.faint, "stroke-width": 1 }, dg);
    var dTitle = VZ.txt(dg, 46, 384, "", { size: 13.5, fill: C.gold, weight: 700 });
    var dBody = VZ.g(dg);
    var sel = 0;
    function paint() {
      blocks.forEach(function (b) {
        b.rect.setAttribute("stroke", b.i === sel ? C.gold : C.faint);
        b.rect.setAttribute("stroke-width", b.i === sel ? 2.2 : 1.1);
        b.rect.setAttribute("fill", b.i === sel ? "rgba(255,207,92,.10)" : "rgba(255,255,255,.045)");
      });
      dTitle.textContent = steps[sel].n + " ｜ " + steps[sel].rel;
      dBody.innerHTML = "";
      VZ.para(dBody, 46, 406, steps[sel].d, { size: 11.5, per: 60, lh: 17 });
    }
    paint();
    VZ.raf(svg, function (t) {
      var tx = blocks[sel].x + bw / 2, ty = blocks[sel].y;
      var cx0 = parseFloat(ball.getAttribute("cx")), cy0 = parseFloat(ball.getAttribute("cy"));
      ball.setAttribute("cx", cx0 + (tx - cx0) * .12);
      ball.setAttribute("cy", cy0 + (ty - cy0) * .12);
      ball.setAttribute("r", 7 + Math.sin(t * 2.4) * 1.3);
      if (Math.abs(cx0 - tx) < .4) ball.setAttribute("cx", tx);
      if (Math.abs(cy0 - ty) < .4) ball.setAttribute("cy", ty);
    });
  }
},

/* ==========================================================
   第 18 章 · 闵可夫斯基几何
   ========================================================== */
"f-ch18": {
  title: "洛伦兹变换：坐标轴被夹剪，同时性与长度都变了",
  hint: "拖动滑杆改变参考系的速度 β。<b>t′ 轴与 x′ 轴一起向光锥线夹拢</b>：同时面倾斜（同时性是相对的），而静止长度 1 的杆在运动参考系里只量到 L′ = 1/γ。右边的小图是天球：从一点看出去的光线方向天然是一个黎曼球。",
  legend: [["本参考系 x / t", VZ.C.ink2], ["运动参考系 t′ / x′", VZ.C.cyan], ["光锥", VZ.C.gold], ["收缩后的杆 L′", VZ.C.mag]],
  draw: function (stage) {
    var W = 760, H = 440, svg = VZ.S(stage, W, H, { grid: true });
    var C = VZ.C;
    var ox = 170, oy = 322, U = 95;
    function px(xu) { return ox + xu * U; }
    function py(tu) { return oy - tu * U; }

    VZ.ln(svg, ox, oy, 470, oy, { stroke: C.ink2, "stroke-width": 1.2 });
    VZ.ln(svg, ox, oy, ox, 46, { stroke: C.ink2, "stroke-width": 1.2 });
    VZ.txt(svg, 476, oy + 4, "x", { size: 12, fill: C.dim });
    VZ.txt(svg, ox - 14, 44, "t", { size: 12, fill: C.dim });
    VZ.path(svg, "M" + ox + " " + py(2.85) + "L" + px(2.85) + " " + oy, VZ.stroke({ stroke: C.gold, "stroke-width": 1.8 }));
    VZ.path(svg, "M" + ox + " " + py(1.15) + "L" + px(-1.15) + " " + oy, VZ.stroke({ stroke: C.gold, "stroke-width": 1.8 }));
    VZ.txt(svg, px(2.5), py(2.75), "光锥 t = ±x", { size: 10.5, fill: C.gold });

    var tAxis = VZ.path(svg, "", VZ.stroke({ stroke: C.cyan, "stroke-width": 2.4 }));
    var xAxis = VZ.path(svg, "", VZ.stroke({ stroke: C.cyan, "stroke-width": 2.4 }));
    var sims = [];
    for (var i = 0; i < 4; i++) sims.push(VZ.path(svg, "", VZ.stroke({ stroke: C.cyan, "stroke-width": 1, opacity: .35, "stroke-dasharray": "4 5" })));
    var rodRest = VZ.path(svg, "", VZ.stroke({ stroke: C.ink, "stroke-width": 5 }));
    var rodMove = VZ.path(svg, "", VZ.stroke({ stroke: C.mag, "stroke-width": 5 }));
    var wlRest1 = VZ.path(svg, "", VZ.stroke({ stroke: C.faint, "stroke-width": 1, "stroke-dasharray": "3 4" }));
    var wlRest2 = VZ.path(svg, "", VZ.stroke({ stroke: C.faint, "stroke-width": 1, "stroke-dasharray": "3 4" }));
    var wlMove1 = VZ.path(svg, "", VZ.stroke({ stroke: C.faint, "stroke-width": 1, "stroke-dasharray": "3 4" }));
    var wlMove2 = VZ.path(svg, "", VZ.stroke({ stroke: C.faint, "stroke-width": 1, "stroke-dasharray": "3 4" }));
    var rodLbl = VZ.txt(svg, 0, 0, "", { size: 11.5, fill: C.mag, weight: 700 });
    var rodLbl2 = VZ.txt(svg, 0, 0, "", { size: 11, fill: C.ink2 });
    var tAxisLbl = VZ.txt(svg, 0, 0, "t′", { size: 12, fill: C.cyan, weight: 700 });
    var xAxisLbl = VZ.txt(svg, 0, 0, "x′", { size: 12, fill: C.cyan, weight: 700 });

    /* 天球 = 黎曼球 inset */
    var sxc = 620, syc = 150, sR = 70;
    VZ.circ(svg, sxc, syc, sR, { stroke: C.ink2, "stroke-width": 1.3 });
    VZ.path(svg, "M" + (sxc - sR) + " " + syc + "A" + sR + " " + (sR * .32) + " 0 0 0 " + (sxc + sR) + " " + syc, VZ.stroke({ stroke: C.faint, "stroke-width": .8 }));
    VZ.path(svg, "M" + (sxc - sR) + " " + syc + "A" + sR + " " + (sR * .32) + " 0 0 1 " + (sxc + sR) + " " + syc, VZ.stroke({ stroke: C.faint, "stroke-width": .8, "stroke-dasharray": "4 4" }));
    VZ.circ(svg, sxc, syc - sR, 3.5, { fill: C.ink });
    VZ.txt(svg, sxc, syc - sR - 8, "N（我所在处）", { size: 10, fill: C.dim, anchor: "middle" });
    var planeY = syc + sR + 34;
    VZ.path(svg, "M" + (sxc - 104) + " " + planeY + "A104 " + 24 + " 0 0 0 " + (sxc + 104) + " " + planeY, VZ.stroke({ stroke: C.gold, "stroke-width": 1.2, opacity: .8 }));
    VZ.path(svg, "M" + (sxc - 104) + " " + planeY + "A104 " + 24 + " 0 0 1 " + (sxc + 104) + " " + planeY, VZ.stroke({ stroke: C.gold, "stroke-width": 1, opacity: .35, "stroke-dasharray": "5 5" }));
    VZ.txt(svg, sxc, planeY + 40, "投影面 = 复平面", { size: 10.5, fill: C.gold, anchor: "middle" });
    VZ.txt(svg, sxc, 56, "天球 = 黎曼球", { size: 12.5, fill: C.ink, anchor: "middle", weight: 700 });
    VZ.txt(svg, sxc, 72, "光线方向天然带复结构", { size: 10.5, fill: C.dim, anchor: "middle" });
    var sphPt = VZ.circ(svg, sxc, syc, 4, { fill: C.cyan });
    var projPt = VZ.circ(svg, sxc, planeY, 4.5, { fill: C.gold });
    var projRay = VZ.path(svg, "", VZ.stroke({ stroke: C.gold, "stroke-width": 1.1, "stroke-dasharray": "3 3", opacity: .8 }));

    var beta = 0.5;
    var out = VZ.panel(stage, { "速度 β": "", "洛伦兹因子 γ": "", "运动系量到的杆长 L′ = 1/γ": "", "同时面斜率": "" });
    var BX0 = 62, BX1 = 460, BY0 = 52, BY1 = oy;
    function clipSeg(ax, ay, dx, dy) {
      var t0 = -1e9, t1 = 1e9;
      if (dx > 1e-6) { t0 = Math.max(t0, (BX0 - ax) / dx); t1 = Math.min(t1, (BX1 - ax) / dx); }
      else if (dx < -1e-6) { t0 = Math.max(t0, (BX1 - ax) / dx); t1 = Math.min(t1, (BX0 - ax) / dx); }
      if (dy > 1e-6) { t0 = Math.max(t0, (BY0 - ay) / dy); t1 = Math.min(t1, (BY1 - ay) / dy); }
      else if (dy < -1e-6) { t0 = Math.max(t0, (BY1 - ay) / dy); t1 = Math.min(t1, (BY0 - ay) / dy); }
      if (t1 <= t0) return null;
      return [[ax + dx * t0, ay + dy * t0], [ax + dx * t1, ay + dy * t1]];
    }
    function seg(c, col) {
      if (!c) return "";
      return "M" + c[0][0].toFixed(1) + " " + c[0][1].toFixed(1) + "L" + c[1][0].toFixed(1) + " " + c[1][1].toFixed(1);
    }
    function redraw() {
      var g = 1 / Math.sqrt(1 - beta * beta);
      var ct = clipSeg(ox, oy, beta * U, -U);
      var cx2 = clipSeg(ox, oy, U, -beta * U);
      tAxis.setAttribute("d", seg(ct));
      xAxis.setAttribute("d", seg(cx2));
      if (ct) { tAxisLbl.setAttribute("x", ct[1][0] + 6); tAxisLbl.setAttribute("y", ct[1][1] + 4); }
      if (cx2) { xAxisLbl.setAttribute("x", cx2[1][0] - 12); xAxisLbl.setAttribute("y", cx2[1][1] - 6); }
      for (var i = 0; i < 4; i++) {
        var t0 = 0.35 + i * 0.6;
        sims[i].setAttribute("d", seg(clipSeg(px(0), py(t0), U, -beta * U)));
      }
      var tR = 0.86, tM = 0.52;
      var yR = py(tR), yM = py(tM);
      rodRest.setAttribute("d", "M" + px(0) + " " + yR + "L" + px(1) + " " + yR);
      wlRest1.setAttribute("d", "M" + px(0) + " " + (yR - 66) + "L" + px(0) + " " + (yR + 40));
      wlRest2.setAttribute("d", "M" + px(1) + " " + (yR - 66) + "L" + px(1) + " " + (yR + 40));
      rodLbl2.setAttribute("x", px(0.5) - 6); rodLbl2.setAttribute("y", yR - 12);
      rodLbl2.textContent = "静止的杆 L = 1";
      var Lp = 1 / g;
      rodMove.setAttribute("d", "M" + px(0) + " " + yM + "L" + px(Lp) + " " + yM);
      var w1 = clipSeg(px(0), yM, beta * U, -U), w2 = clipSeg(px(Lp), yM, beta * U, -U);
      wlMove1.setAttribute("d", w1 ? "M" + w1[0][0].toFixed(1) + " " + w1[0][1].toFixed(1) + "L" + px(0) + " " + yM : "");
      wlMove2.setAttribute("d", w2 ? "M" + w2[0][0].toFixed(1) + " " + w2[0][1].toFixed(1) + "L" + px(Lp) + " " + yM : "");
      rodLbl.setAttribute("x", px(Lp) + 6); rodLbl.setAttribute("y", yM + 22);
      rodLbl.textContent = "L′ = " + Lp.toFixed(3);
      VZ.setPanel(out, {
        "速度 β": beta.toFixed(2),
        "洛伦兹因子 γ": g.toFixed(3),
        "运动系量到的杆长 L′ = 1/γ": Lp.toFixed(3),
        "同时面斜率": beta.toFixed(2) + "（随 β 一起变）"
      });
    }
    VZ.slider(stage, {
      label: "参考系速度 β = v/c", min: -0.95, max: 0.95, step: 0.01, value: 0.5,
      format: function (v) { return v.toFixed(2); },
      onInput: function (v) { beta = v; redraw(); }
    });
    var th0 = 0.4;
    VZ.raf(svg, function (t) {
      th0 = 0.45 + 0.75 * (0.5 + 0.5 * Math.sin(t * 0.7));
      var sp = [sxc + sR * Math.sin(th0) * Math.cos(0.6), syc - sR * Math.cos(th0) * 1.0];
      sphPt.setAttribute("cx", sp[0]); sphPt.setAttribute("cy", sp[1]);
      var N = [sxc, syc - sR];
      var s = (planeY - N[1]) / (sp[1] - N[1]);
      var qx = N[0] + s * (sp[0] - N[0]);
      projPt.setAttribute("cx", qx); projPt.setAttribute("cy", planeY);
      projRay.setAttribute("d", "M" + N[0] + " " + N[1] + "L" + qx + " " + planeY);
    });
    redraw();
  }
},

/* ==========================================================
   第 19 章 · 麦克斯韦与爱因斯坦的经典场
   ========================================================== */
"f-ch19": {
  title: "场即曲率：法拉第力线束在传播，能流沿坡印廷矢量走",
  hint: "规范势 A 的外微分给出场强 F = dA，所以<b>电磁场就是 U(1) 丛的曲率</b>；四条麦克斯韦方程写成微分形式只剩 dF = 0 与 d*F = J 两条。拖动滑杆改变频率，看电场（青）与磁场（品红）的波在跑动，金色箭头是能流 S = E × B。",
  legend: [["电场 E", VZ.C.cyan], ["磁场 B", VZ.C.mag], ["能流 S = E × B", VZ.C.gold]],
  draw: function (stage) {
    var W = 760, H = 400, svg = VZ.S(stage, W, H, { grid: true });
    var C = VZ.C;
    VZ.card(svg, 30, 18, 700, 76, { stroke: "rgba(255,255,255,.12)", fill: "rgba(79,227,240,.05)" });
    VZ.txt(svg, 46, 44, "F = dA（2-形式）= 电磁场强 = U(1) 丛的曲率", { size: 14, fill: C.cyan, weight: 700 });
    VZ.txt(svg, 46, 68, "麦克斯韦方程：四条 → 两条   dF = 0（自动成立，含无磁单极） ｜ d*F = J（有源方程）", { size: 11.5, fill: C.ink2 });
    VZ.txt(svg, 46, 86, "引力一侧：爱因斯坦张量（守恒）= 能动张量 T_ab；水星近日点额外进动 ≈ 43″/世纪", { size: 11, fill: C.dim });

    var x0 = 70, x1 = 700, yE = 168, yB = 300;
    VZ.ln(svg, x0 - 10, yE, x1 + 10, yE, { stroke: C.faint, "stroke-width": .9, "stroke-dasharray": "4 5" });
    VZ.ln(svg, x0 - 10, yB, x1 + 10, yB, { stroke: C.faint, "stroke-width": .9, "stroke-dasharray": "4 5" });
    VZ.txt(svg, x1 + 12, yE + 4, "E", { size: 12, fill: C.cyan });
    VZ.txt(svg, x1 + 12, yB + 4, "B", { size: 12, fill: C.mag });
    VZ.txt(svg, 40, 140, "传播方向 →", { size: 11, fill: C.dim });

    var k = 2 * Math.PI / 170, omega = 2.2;
    var eTicks = [];
    for (var x = x0; x <= x1; x += 18) eTicks.push({ x: x, shaft: VZ.ln(svg, x, yE, x, yE, VZ.stroke({ stroke: C.cyan, "stroke-width": 2.4 })) });
    var eEnv = VZ.path(svg, "", VZ.stroke({ stroke: C.cyan, "stroke-width": 1.4, opacity: .55 }));
    var bEnv = VZ.path(svg, "", VZ.stroke({ stroke: C.mag, "stroke-width": 2, opacity: .85 }));
    var sArrows = [];
    for (var i = 0; i < 9; i++) sArrows.push(VZ.path(svg, "", VZ.stroke({ stroke: C.gold, "stroke-width": 2.2, opacity: .9 })));
    var sLbl = VZ.txt(svg, x0 + 6, 236, "能流 S = E × B", { size: 11.5, fill: C.gold, weight: 700 });

    VZ.slider(stage, {
      label: "频率 ω", min: 0.8, max: 5, step: 0.1, value: 2.2,
      format: function (v) { return v.toFixed(1); },
      onInput: function (v) { omega = v; }
    });
    VZ.raf(svg, function (t) {
      var amp = 52, ampB = 34;
      var dEnv = "", dB = "";
      for (var j = 0; j < eTicks.length; j++) {
        var xx = eTicks[j].x, ph = k * (xx - x0) - t * omega, v = Math.sin(ph);
        eTicks[j].shaft.setAttribute("y1", yE); eTicks[j].shaft.setAttribute("y2", (yE - amp * v).toFixed(1));
        eTicks[j].shaft.setAttribute("opacity", (0.25 + 0.7 * Math.abs(v)).toFixed(2));
      }
      for (var q = 0; q <= 60; q++) {
        var xx2 = x0 + (x1 - x0) * q / 60, ph2 = k * (xx2 - x0) - t * omega;
        dEnv += (q ? "L" : "M") + xx2.toFixed(1) + " " + (yE - amp * Math.sin(ph2)).toFixed(1);
        dB += (q ? "L" : "M") + xx2.toFixed(1) + " " + (yB - ampB * Math.sin(ph2)).toFixed(1);
      }
      eEnv.setAttribute("d", dEnv); bEnv.setAttribute("d", dB);
      for (var a = 0; a < sArrows.length; a++) {
        var u = ((t * 130 + a * 68) % (x1 - x0 + 120));
        var ax0 = x0 - 60 + u;
        var amp2 = Math.sin(k * (ax0 - x0) - t * omega);
        sArrows[a].setAttribute("d", "M" + ax0.toFixed(1) + " " + (yE + 66) + "l18 0m0 0l-6 -4m6 4l-6 4");
        sArrows[a].setAttribute("opacity", (0.15 + 0.75 * Math.abs(amp2)).toFixed(2));
        sArrows[a].setAttribute("visibility", (ax0 > x0 - 10 && ax0 < x1 + 10) ? "visible" : "hidden");
      }
      sLbl.setAttribute("opacity", .9);
    });
    VZ.txt(svg, 380, 356, "金色箭头的大小随 |S| 变化：E 与 B 同相时能流最大", { size: 11, fill: C.dim, anchor: "middle" });
  }
},

/* ==========================================================
   第 20 章 · 拉格朗日与哈密顿（相空间辛流）
   ========================================================== */
"f-ch20": {
  title: "哈密顿力学 = 辛几何：相空间里这块面积永不改变",
  hint: "相空间（位置 q — 动量 p）里的每一撮点都随哈密顿流运动。<b>拖动画面，把一块初始「小块」放到相位图的不同位置</b>，看它怎么被拉伸、扭转——但辛面积（金色四边形的面积）始终不变。这就是刘维尔定理的几何版本，也是正则量子化的入口。",
  legend: [["哈密顿流", VZ.C.cyan], ["初始小块（参考）", VZ.C.faint], ["被搬运的小块（面积守恒）", VZ.C.gold]],
  draw: function (stage) {
    var W = 760, H = 400;
    var cv = VZ.canvas(stage, W, H);
    var ctx = cv.ctx;
    var CX = W / 2, CY = H / 2, SX = 88, SY = 84;
    function X(q) { return CX + q * SX; }
    function Y(p) { return CY - p * SY; }
    var ctrl = VZ.box(stage, "viz-ctl");
    VZ.btn(ctrl, "放回势阱中心", function () { reset(0, 0); });
    VZ.btn(ctrl, "放到分界线附近", function () { reset(2.35, 1.05); });
    var out = VZ.panel(stage, { "辛面积（守恒量）": "", "初始面积": "", "小块当前中心": "" });

    var N = 160, pts = [], corners = [], initArea = 0, c0 = [0, 0];

    function H(q, p) { return 0.5 * p * p + (1 - Math.cos(q)); }
    function reset(qc, pc) {
      c0 = [qc, pc];
      pts = [];
      for (var i = 0; i < N; i++) {
        var a = Math.random() * 2 * Math.PI, r = Math.sqrt(Math.random()) * 0.30;
        pts.push([qc + r * Math.cos(a), pc + r * Math.sin(a) * 0.62]);
      }
      var s = 0.26;
      corners = [[qc - s, pc - s * 0.62], [qc + s, pc - s * 0.62], [qc + s, pc + s * 0.62], [qc - s, pc + s * 0.62]];
      initArea = shoelace(corners);
    }
    function shoelace(c) {
      var a = 0;
      for (var i = 0; i < 4; i++) { var j = (i + 1) % 4; a += c[i][0] * c[j][1] - c[j][0] * c[i][1]; }
      return Math.abs(a / 2);
    }
    function step(dt) {
      function drag(a) {
        a[1] += -Math.sin(a[0]) * dt;
        a[0] += a[1] * dt;
      }
      for (var i = 0; i < pts.length; i++) drag(pts[i]);
      for (var k2 = 0; k2 < 4; k2++) drag(corners[k2]);
    }
    reset(2.35, 1.05);

    function grid() {
      ctx.clearRect(0, 0, W, H);
      ctx.fillStyle = "#0f0a24"; ctx.fillRect(0, 0, W, H);
      ctx.strokeStyle = "rgba(75,67,128,.5)"; ctx.lineWidth = 1;
      for (var q = -4; q <= 4; q += 1) { ctx.beginPath(); ctx.moveTo(X(q), 0); ctx.lineTo(X(q), H); ctx.stroke(); }
      for (var p = -2; p <= 2.5; p += 1) { ctx.beginPath(); ctx.moveTo(0, Y(p)); ctx.lineTo(W, Y(p)); ctx.stroke(); }
      ctx.strokeStyle = "#8d86bd"; ctx.lineWidth = 1.4;
      ctx.beginPath(); ctx.moveTo(0, Y(0)); ctx.lineTo(W, Y(0)); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(X(0), 0); ctx.lineTo(X(0), H); ctx.stroke();
      /* 分界线（separatrix） */
      ctx.strokeStyle = "rgba(255,122,122,.5)"; ctx.setLineDash([5, 5]); ctx.lineWidth = 1.4;
      for (var sgn = -1; sgn <= 1; sgn += 2) {
        ctx.beginPath();
        for (var qq = -4; qq <= 4; qq += 0.04) {
          var pp = sgn * 2 * Math.sqrt(Math.max(0, 1 + Math.cos(qq)));
          if (qq === -4) ctx.moveTo(X(qq), Y(pp)); else ctx.lineTo(X(qq), Y(pp));
        }
        ctx.stroke();
      }
      ctx.setLineDash([]);
      ctx.fillStyle = "#8d86bd"; ctx.font = "12px sans-serif";
      ctx.fillText("位置 q", W - 62, Y(0) - 8);
      ctx.fillText("动量 p", X(0) + 8, 18);
      ctx.fillStyle = "rgba(141,134,189,.85)";
      ctx.fillText("势阱 H = p²/2 + (1 − cos q)", 16, 22);
    }
    function paint() {
      grid();
      /* 初始小块轮廓 */
      ctx.strokeStyle = "rgba(75,67,128,.9)"; ctx.setLineDash([4, 4]); ctx.lineWidth = 1.4;
      ctx.beginPath();
      corners.forEach(function (c, i) { if (i === 0) ctx.moveTo(X(c[0]), Y(c[1])); else ctx.lineTo(X(c[0]), Y(c[1])); });
      ctx.closePath(); ctx.stroke(); ctx.setLineDash([]);
      /* 流点 */
      ctx.fillStyle = "rgba(79,227,240,.85)";
      pts.forEach(function (p) {
        var x = X(p[0]), y = Y(p[1]);
        if (x < -20 || x > W + 20 || y < -20 || y > H + 20) return;
        ctx.beginPath(); ctx.arc(x, y, 1.7, 0, 6.2832); ctx.fill();
      });
      /* 被搬运的小块（金色四边形） */
      ctx.fillStyle = "rgba(255,207,92,.20)";
      ctx.strokeStyle = "#ffcf5c"; ctx.lineWidth = 2;
      ctx.beginPath();
      corners.forEach(function (c, i) { if (i === 0) ctx.moveTo(X(c[0]), Y(c[1])); else ctx.lineTo(X(c[0]), Y(c[1])); });
      ctx.closePath(); ctx.fill(); ctx.stroke();
      corners.forEach(function (c) { ctx.beginPath(); ctx.arc(X(c[0]), Y(c[1]), 3.4, 0, 6.2832); ctx.fillStyle = "#ffcf5c"; ctx.fill(); });
      var ccx = corners.reduce(function (a, c) { return a + c[0]; }, 0) / 4;
      var ccy = corners.reduce(function (a, c) { return a + c[1]; }, 0) / 4;
      ctx.fillStyle = "#ffcf5c"; ctx.font = "12px sans-serif";
      ctx.fillText("辛面积 = " + shoelace(corners).toFixed(4), 16, H - 16);
      ctx.fillStyle = "rgba(141,134,189,.9)";
      ctx.fillText("初始面积 = " + initArea.toFixed(4), 240, H - 16);
      VZ.setPanel(out, {
        "辛面积（守恒量）": shoelace(corners).toFixed(4),
        "初始面积": initArea.toFixed(4),
        "小块当前中心": "(q " + ccx.toFixed(2) + ", p " + ccy.toFixed(2) + ")"
      });
    }
    VZ.raf(cv.cv, function (t, ms) {
      var dt = Math.min(ms / 1000, 0.033) * 1.15;
      step(dt);
      var bad = pts.some(function (p) { return !isFinite(p[0]) || !isFinite(p[1]) || Math.abs(p[1]) > 6 || Math.abs(p[0]) > 12; });
      if (bad) reset(c0[0], c0[1]);
      if (Math.abs(corners[0][1]) > 6 || Math.abs(corners[0][0]) > 12) reset(c0[0], c0[1]);
      paint();
    });
    function place(clientX, clientY) {
      var r = cv.cv.getBoundingClientRect();
      var x = (clientX - r.left) / r.width * W, y = (clientY - r.top) / r.height * H;
      var q = (x - CX) / SX, p = (CY - y) / SY;
      reset(Math.max(-3.6, Math.min(3.6, q)), Math.max(-2.1, Math.min(2.1, p)));
    }
    cv.cv.style.cursor = "crosshair";
    cv.cv.addEventListener("pointerdown", function (e) { e.preventDefault(); place(e.clientX, e.clientY); });
    cv.cv.addEventListener("pointermove", function (e) { if (e.buttons & 1) place(e.clientX, e.clientY); });
    paint();
  }
},

/* ==========================================================
   第 21 章 · 量子粒子（波包弥散）
   ========================================================== */
"f-ch21": {
  title: "量子粒子：非对易的代数，逼出会弥散的波包",
  hint: "位置与动量不是数而是算符，<b>xp − px = iħ</b>。于是位置空间里集中的波包，动量空间里必然展开——单位时间后它自己就会弥散。拖动滑杆把初始波包压窄：越窄，动量分布越宽，弥散得越快。这就是不确定性关系。",
  legend: [["Re ψ", VZ.C.gold], ["Im ψ", VZ.C.cyan], ["|ψ|²", VZ.C.mag]],
  draw: function (stage) {
    var W = 760, H = 400;
    var cv = VZ.canvas(stage, W, H);
    var ctx = cv.ctx;
    var s0 = 0.6, tNow = 0;
    var out = VZ.panel(stage, { "Δx（位置不确定度）": "", "Δp = ħ/(2Δx)": "", "Δx·Δp（恒为 ħ/2）": "", "波包峰值 √(σ₀/σ)": "" });
    VZ.slider(stage, {
      label: "初始波包宽度 σ₀（越小 → 动量越不确定）", min: 0.30, max: 1.60, step: 0.02, value: 0.6,
      format: function (v) { return v.toFixed(2); },
      onInput: function (v) { s0 = v; }
    });
    function px(x) { return 60 + (x + 6) / 12 * 660; }
    function draw() {
      ctx.clearRect(0, 0, W, H);
      ctx.fillStyle = "#0f0a24"; ctx.fillRect(0, 0, W, H);
      var tau = s0 * s0 * 2.4;
      var s = s0 * Math.sqrt(1 + Math.pow(tNow / tau, 2));
      var xc = -1.6 + ((tNow * 0.55) % 3.2);
      var k = 6.5, w = 3.4;
      /* 上：Re/Im */
      var cy = 118, A = 56;
      ctx.strokeStyle = "rgba(75,67,128,.6)"; ctx.lineWidth = 1;
      ctx.beginPath(); ctx.moveTo(48, cy); ctx.lineTo(724, cy); ctx.stroke();
      ctx.strokeStyle = "rgba(242,236,223,.28)"; ctx.setLineDash([4, 5]);
      ctx.beginPath();
      for (var q = 0; q <= 200; q++) {
        var x = -6 + 12 * q / 200;
        var e = Math.exp(-Math.pow(x - xc, 2) / (2 * s * s)) * Math.sqrt(s0 / s) * A;
        var yy = cy - e;
        if (q === 0) ctx.moveTo(px(x), yy); else ctx.lineTo(px(x), yy);
      }
      ctx.stroke(); ctx.setLineDash([]);
      ctx.strokeStyle = "#ffcf5c"; ctx.lineWidth = 1.6; ctx.beginPath();
      for (var q2 = 0; q2 <= 300; q2++) {
        var x2 = -6 + 12 * q2 / 300;
        var e2 = Math.exp(-Math.pow(x2 - xc, 2) / (2 * s * s)) * Math.sqrt(s0 / s) * A;
        var y2 = cy - e2 * Math.cos(k * (x2 - xc) - w * tNow);
        if (q2 === 0) ctx.moveTo(px(x2), y2); else ctx.lineTo(px(x2), y2);
      }
      ctx.stroke();
      ctx.strokeStyle = "#4fe3f0"; ctx.lineWidth = 1.3; ctx.beginPath();
      for (var q3 = 0; q3 <= 300; q3++) {
        var x3 = -6 + 12 * q3 / 300;
        var e3 = Math.exp(-Math.pow(x3 - xc, 2) / (2 * s * s)) * Math.sqrt(s0 / s) * A;
        var y3 = cy - e3 * Math.sin(k * (x3 - xc) - w * tNow);
        if (q3 === 0) ctx.moveTo(px(x3), y3); else ctx.lineTo(px(x3), y3);
      }
      ctx.stroke();
      ctx.fillStyle = "rgba(141,134,189,.9)"; ctx.font = "12px sans-serif";
      ctx.fillText("Re ψ（金）｜Im ψ（青）｜包络（虚）", 48, 30);
      ctx.fillText("xp − px = iħ", 620, 30);

      /* 下：|ψ|² */
      var base = 348, hgt = 96;
      ctx.strokeStyle = "rgba(75,67,128,.6)"; ctx.lineWidth = 1;
      ctx.beginPath(); ctx.moveTo(48, base); ctx.lineTo(724, base); ctx.stroke();
      ctx.fillStyle = "rgba(255,111,216,.22)";
      ctx.beginPath(); ctx.moveTo(px(-6), base);
      for (var q4 = 0; q4 <= 240; q4++) {
        var x4 = -6 + 12 * q4 / 240;
        var g = Math.exp(-Math.pow(x4 - xc, 2) / (s * s));
        ctx.lineTo(px(x4), base - g * hgt);
      }
      ctx.lineTo(px(6), base); ctx.closePath(); ctx.fill();
      ctx.strokeStyle = "#ff6fd8"; ctx.lineWidth = 2; ctx.beginPath();
      for (var q5 = 0; q5 <= 240; q5++) {
        var x5 = -6 + 12 * q5 / 240;
        var g2 = Math.exp(-Math.pow(x5 - xc, 2) / (s * s));
        if (q5 === 0) ctx.moveTo(px(x5), base - g2 * hgt); else ctx.lineTo(px(x5), base - g2 * hgt);
      }
      ctx.stroke();
      ctx.fillStyle = "rgba(141,134,189,.9)"; ctx.font = "12px sans-serif";
      ctx.fillText("|ψ|²（玻恩规则：测量结果 = |振幅|²）", 48, base + 26);
      ctx.fillText("t = " + tNow.toFixed(2), 690, base + 26);
      VZ.setPanel(out, {
        "Δx（位置不确定度）": s.toFixed(3),
        "Δp = ħ/(2Δx)": (0.5 / s).toFixed(3),
        "Δx·Δp（恒为 ħ/2）": "0.500",
        "波包峰值 √(σ₀/σ)": Math.sqrt(s0 / s).toFixed(3)
      });
    }
    VZ.raf(cv.cv, function (t) { tNow = t; draw(); });
    draw();
  }
},

/* ==========================================================
   第 22 章 · 量子代数、几何与自旋（U / R 与布洛赫球）
   ========================================================== */
"f-ch22": {
  title: "U 与 R 的二分，以及自旋态的布洛赫球",
  hint: "拖动球面上任意位置，改变自旋态 θ 与 φ：<b>|ψ⟩ = cos(θ/2)|0⟩ + e^{iφ} sin(θ/2)|1⟩</b>，右侧读出测量概率。右边两块是全书最深的裂缝：U（幺正演化，连续、确定、可逆）与 R（态缩减，跃变、随机、不可逆）——U 的线性意味着叠加永远不会自己消失，而 R 没有任何方程。",
  legend: [["自旋态矢量", VZ.C.gold], ["U：幺正演化", VZ.C.cyan], ["R：态缩减", VZ.C.mag]],
  draw: function (stage) {
    var W = 760, H = 500, svg = VZ.S(stage, W, H, { grid: true });
    var C = VZ.C;
    var cx = 208, cy = 252, R = 118, AL = 0.35;
    function proj(th, ph) {
      var u = Math.sin(th) * Math.cos(ph), v = Math.sin(th) * Math.sin(ph), w = Math.cos(th);
      return [cx + R * u, cy - R * (w * Math.cos(AL) + v * Math.sin(AL))];
    }
    VZ.circ(svg, cx, cy, R, { stroke: C.faint, "stroke-width": 1.2 });
    VZ.path(svg, "M" + (cx - R) + " " + cy + "A" + R + " " + (R * Math.sin(AL)) + " 0 0 0 " + (cx + R) + " " + cy, VZ.stroke({ stroke: C.faint, "stroke-width": .9 }));
    VZ.path(svg, "M" + (cx - R) + " " + cy + "A" + R + " " + (R * Math.sin(AL)) + " 0 0 1 " + (cx + R) + " " + cy, VZ.stroke({ stroke: C.faint, "stroke-width": .9, "stroke-dasharray": "4 4" }));
    [45, 90, 135].forEach(function (td) {
      var t1 = td * Math.PI / 180, d = "";
      for (var i = 0; i <= 60; i++) {
        var ph = i / 60 * 2 * Math.PI, p = proj(t1, ph);
        d += (i ? "L" : "M") + p[0].toFixed(1) + " " + p[1].toFixed(1);
      }
      VZ.path(svg, d, VZ.stroke({ stroke: C.faint, "stroke-width": .8, opacity: .75 }));
    });
    [45, 135].forEach(function (pd) {
      var ph = pd * Math.PI / 180, d = "";
      for (var i = 0; i <= 60; i++) {
        var th = i / 60 * Math.PI, p = proj(th, ph);
        d += (i ? "L" : "M") + p[0].toFixed(1) + " " + p[1].toFixed(1);
      }
      VZ.path(svg, d, VZ.stroke({ stroke: C.faint, "stroke-width": .8, opacity: .7 }));
    });
    var n0 = proj(0, 0), n1 = proj(Math.PI, 0);
    VZ.txt(svg, n0[0], n0[1] - 10, "|0⟩", { size: 13, fill: C.ink, anchor: "middle", weight: 700 });
    VZ.txt(svg, n1[0], n1[1] + 20, "|1⟩", { size: 13, fill: C.ink, anchor: "middle", weight: 700 });
    var eqR = proj(Math.PI / 2, 0);
    VZ.txt(svg, eqR[0] + 10, eqR[1] + 4, "x", { size: 11, fill: C.dim });
    VZ.txt(svg, cx + 10, cy - R * Math.cos(AL) - 4, "z", { size: 11, fill: C.dim });
    VZ.txt(svg, cx, 44, "自旋 1/2 的纯态 = 布洛赫球上的点", { size: 13, fill: C.ink, anchor: "middle", weight: 700 });
    VZ.txt(svg, cx, 62, "转 360° 只回到 −|ψ⟩，要 720° 才复原（旋量）", { size: 10.5, fill: C.dim, anchor: "middle" });

    var vec = VZ.path(svg, "", VZ.stroke({ stroke: C.gold, "stroke-width": 3 }));
    var head = VZ.path(svg, "", { fill: C.gold });
    var tip = VZ.circ(svg, 0, 0, 6, { fill: C.gold });
    var drop = VZ.path(svg, "", VZ.stroke({ stroke: C.gold, "stroke-width": 1, "stroke-dasharray": "3 3", opacity: .7 }));
    var th = 1.0, ph = 0.6;
    VZ.txt(svg, 40, 404, "测量概率", { size: 11.5, fill: C.ink2 });
    VZ.el("rect", { x: 40, y: 414, width: 150, height: 12, rx: 6, fill: "rgba(255,255,255,.05)", stroke: C.faint, "stroke-width": .8 }, svg);
    VZ.el("rect", { x: 40, y: 432, width: 150, height: 12, rx: 6, fill: "rgba(255,255,255,.05)", stroke: C.faint, "stroke-width": .8 }, svg);
    var bar0 = VZ.el("rect", { x: 40, y: 414, width: 150, height: 12, rx: 6, fill: "rgba(79,227,240,.7)" }, svg);
    var bar1 = VZ.el("rect", { x: 40, y: 432, width: 150, height: 12, rx: 6, fill: "rgba(255,207,92,.7)" }, svg);
    var bar0T = VZ.txt(svg, 198, 424, "", { size: 10.5, fill: C.cyan });
    var bar1T = VZ.txt(svg, 198, 442, "", { size: 10.5, fill: C.gold });
    function style() {
      var p = proj(th, ph);
      vec.setAttribute("d", "M" + cx + " " + cy + "L" + p[0].toFixed(1) + " " + p[1].toFixed(1));
      var ang = Math.atan2(p[1] - cy, p[0] - cx);
      var hx = p[0], hy = p[1], bx = hx - 12 * Math.cos(ang), by = hy - 12 * Math.sin(ang);
      head.setAttribute("d", "M" + hx + " " + hy + "L" + (bx - 5 * Math.sin(ang)) + " " + (by + 5 * Math.cos(ang)) +
        "L" + (bx + 5 * Math.sin(ang)) + " " + (by - 5 * Math.cos(ang)) + "Z");
      tip.setAttribute("cx", p[0]); tip.setAttribute("cy", p[1]);
      if (Math.abs(p[0] - cx) > 4) drop.setAttribute("d", "M" + p[0].toFixed(1) + " " + p[1].toFixed(1) + "L" + cx + " " + p[1].toFixed(1));
      else drop.setAttribute("d", "");
      var p0 = Math.cos(th / 2) * Math.cos(th / 2), p1 = Math.sin(th / 2) * Math.sin(th / 2);
      bar0.setAttribute("width", Math.max(0, 150 * p0)); bar1.setAttribute("width", Math.max(0, 150 * p1));
      bar0T.textContent = "P(0) = " + p0.toFixed(2);
      bar1T.textContent = "P(1) = " + p1.toFixed(2);
      VZ.setPanel(out, {
        "θ": (th * 180 / Math.PI).toFixed(1) + "°",
        "φ": (ph * 180 / Math.PI).toFixed(1) + "°",
        "|ψ⟩": "cos(θ/2)|0⟩ + e^{iφ} sin(θ/2)|1⟩",
        "P(0) = cos²(θ/2)": p0.toFixed(3),
        "P(1) = sin²(θ/2)": p1.toFixed(3)
      });
    }
    VZ.drag(svg, svg, W, H, function (x, y, phase) {
      if (x > 380) return;
      var u = (x - cx) / R, hh = (cy - y) / R;
      if (u * u + hh * hh > 1.15) return;
      var kk = Math.sqrt(Math.max(0, 1 - u * u - hh * hh));
      var Px = u, Py = hh * Math.sin(AL) - kk * Math.cos(AL), Pz = hh * Math.cos(AL) + kk * Math.sin(AL);
      th = Math.acos(VZ.clamp(Pz, -1, 1));
      ph = Math.atan2(Py, Px);
      style();
    });

    /* U / R 对比 */
    var uPath = VZ.path(svg, "", VZ.stroke({ stroke: C.cyan, "stroke-width": 2.4 }));
    var uDot = VZ.circ(svg, 0, 0, 4.5, { fill: C.cyan });
    var rPath = VZ.path(svg, "", VZ.stroke({ stroke: C.mag, "stroke-width": 2.4 }));
    var rJump = VZ.path(svg, "", VZ.stroke({ stroke: C.mag, "stroke-width": 1.2, "stroke-dasharray": "3 3", opacity: .8 }));
    VZ.card(svg, 400, 96, 330, 130, { stroke: "rgba(255,255,255,.12)" });
    VZ.txt(svg, 416, 120, "U｜幺正演化", { size: 14, fill: C.cyan, weight: 700 });
    VZ.txt(svg, 416, 138, "连续 · 确定 · 可逆 ｜ 薛定谔方程 iħ ∂|ψ⟩/∂t = H|ψ⟩", { size: 10.5, fill: C.dim });
    VZ.card(svg, 400, 244, 330, 130, { stroke: "rgba(255,255,255,.12)" });
    VZ.txt(svg, 416, 268, "R｜态缩减", { size: 14, fill: C.mag, weight: 700 });
    VZ.txt(svg, 416, 286, "跃变 · 概率 |振幅|² · 不可逆 ｜ 测量", { size: 10.5, fill: C.dim });
    VZ.txt(svg, 416, 412, "矛盾：U 里没有哪个结果会被选中；R 里没有方程", { size: 11.5, fill: C.gold, weight: 700 });
    VZ.txt(svg, 416, 432, "而 U 的线性意味着叠加永远不会自己消失（§22.2）", { size: 11, fill: C.ink2 });
    VZ.txt(svg, 416, 456, "自旋 1/2 的空间是黎曼球——第 8 章的球第三次出现在物理里", { size: 11, fill: C.violet });

    var rSeed = [];
    function regenR() { rSeed = []; for (var i = 0; i < 12; i++) rSeed.push(Math.random()); }
    regenR();
    var lastRe = 0;
    VZ.raf(svg, function (t) {
      var dU = "";
      for (var i = 0; i <= 46; i++) {
        var xx = 416 + i * 6.6, yy = 196 + 22 * Math.sin((xx - 416) * 0.09 - t * 2.1);
        dU += (i ? "L" : "M") + xx.toFixed(1) + " " + yy.toFixed(1);
      }
      uPath.setAttribute("d", dU);
      var udx = 416 + ((t * 60) % (46 * 6.6));
      uDot.setAttribute("cx", udx); uDot.setAttribute("cy", 196 + 22 * Math.sin((udx - 416) * 0.09 - t * 2.1));
      if (Math.floor(t / 1.1) !== lastRe) { regenR(); lastRe = Math.floor(t / 1.1); }
      var dR = "";
      for (var j = 0; j < 12; j++) {
        var x1 = 416 + j * 26, x2 = x1 + 26;
        var y1 = 348 - rSeed[j] * 40, y2 = 348 - rSeed[(j + 1) % 12] * 40;
        dR += "M" + x1 + " " + y1 + "L" + x2 + " " + y1 + "L" + x2 + " " + y2;
      }
      rPath.setAttribute("d", dR);
      var jIdx = Math.floor(t * 1.0) % 12;
      var jx = 416 + (jIdx + 1) * 26;
      rJump.setAttribute("d", "M" + jx + " " + (348 - rSeed[jIdx] * 40) + "V368");
    });
    var out = VZ.panel(stage, { "θ": "", "φ": "", "|ψ⟩": "", "P(0) = cos²(θ/2)": "", "P(1) = sin²(θ/2)": "" });
    style();
  }
},

/* ==========================================================
   第 23 章 · 纠缠的量子世界（贝尔不等式）
   ========================================================== */
"f-ch23": {
  title: "贝尔实验：量子关联越过局域隐变量的上限",
  hint: "拖动两个滑杆选两位观察者的测量角度 a 与 b。<b>量子力学的关联是 E = −cos(a − b)</b>，它给出的 CHSH 量最高可达 2√2 ≈ 2.828，而任何「每个粒子本来就带着确定答案」的局域隐变量理论都出不了 2。实验站在量子这一侧——所以「事先配好的密码本」被排除。",
  legend: [["量子关联 E = −cos(a−b)", VZ.C.cyan], ["局域隐变量上限 2", VZ.C.red], ["量子上限 2√2", VZ.C.green]],
  draw: function (stage) {
    var W = 760, H = 460, svg = VZ.S(stage, W, H, { grid: true });
    var C = VZ.C;
    var aDeg = 0, bDeg = 22.5;
    var sAx = 215, sAy = 235;
    var aX = 74, bX = 356;
    VZ.circ(svg, sAx, sAy, 15, { fill: "rgba(255,207,92,.18)", stroke: C.gold, "stroke-width": 1.6 });
    VZ.txt(svg, sAx, sAy + 5, "源", { size: 12, fill: C.gold, anchor: "middle", weight: 700 });
    VZ.txt(svg, sAx, sAy + 40, "纠缠对", { size: 11, fill: C.dim, anchor: "middle" });
    VZ.el("rect", { x: aX - 34, y: sAy - 46, width: 68, height: 92, rx: 8, fill: "rgba(255,255,255,.04)", stroke: C.faint, "stroke-width": 1 }, svg);
    VZ.el("rect", { x: bX - 34, y: sAy - 46, width: 68, height: 92, rx: 8, fill: "rgba(255,255,255,.04)", stroke: C.faint, "stroke-width": 1 }, svg);
    VZ.txt(svg, aX, sAy + 62, "A（爱丽丝）", { size: 11, fill: C.ink2, anchor: "middle" });
    VZ.txt(svg, bX, sAy + 62, "B（鲍勃）", { size: 11, fill: C.ink2, anchor: "middle" });
    VZ.path(svg, "M" + (sAx - 16) + " " + sAy + "H" + (aX + 36), VZ.stroke({ stroke: C.faint, "stroke-width": 1, "stroke-dasharray": "4 4" }));
    VZ.path(svg, "M" + (sAx + 16) + " " + sAy + "H" + (bX - 36), VZ.stroke({ stroke: C.faint, "stroke-width": 1, "stroke-dasharray": "4 4" }));
    var aNeedle = VZ.path(svg, "", VZ.stroke({ stroke: C.cyan, "stroke-width": 3 }));
    var bNeedle = VZ.path(svg, "", VZ.stroke({ stroke: C.mag, "stroke-width": 3 }));
    var aDial = VZ.circ(svg, aX, sAy, 30, { stroke: C.faint, "stroke-width": 1 });
    var bDial = VZ.circ(svg, bX, sAy, 30, { stroke: C.faint, "stroke-width": 1 });
    var eTxt = VZ.txt(svg, 215, 322, "", { size: 13, fill: C.cyan, anchor: "middle", weight: 700 });
    VZ.txt(svg, 215, 344, "Quanglement：纠缠里「不能用来传话」的那部分", { size: 10.5, fill: C.violet, anchor: "middle" });
    VZ.txt(svg, 215, 362, "传态必须借助经典信道，因此不能超光速", { size: 10.5, fill: C.dim, anchor: "middle" });
    (function () {
      function flow(d, col) {
        var gp = VZ.g(svg);
        var pp = VZ.path(gp, d, { stroke: "none", fill: "none" });
        var len = 0; try { len = pp.getTotalLength(); } catch (e) { return; }
        var q0 = pp.getPointAtLength(0);
        var dt = VZ.circ(gp, q0.x, q0.y, 3.5, { fill: col });
        VZ.raf(svg, function (t) {
          var u = (t * 0.6) % 1, q = pp.getPointAtLength(u * len);
          dt.setAttribute("cx", q.x); dt.setAttribute("cy", q.y);
          dt.setAttribute("opacity", Math.sin(Math.PI * u) * .9 + .1);
        });
      }
      flow("M" + (sAx - 16) + " " + sAy + "H" + (aX + 36), C.cyan);
      flow("M" + (sAx + 16) + " " + sAy + "H" + (bX - 36), C.mag);
    })();

    /* 右：CHSH 曲线 */
    var px0 = 448, px1 = 726, py0 = 396, py1 = 92;
    VZ.ln(svg, px0 - 8, py0, px1 + 8, py0, { stroke: C.faint, "stroke-width": 1 });
    VZ.ln(svg, px0, py1 - 14, px0, py0 + 6, { stroke: C.faint, "stroke-width": 1 });
    VZ.txt(svg, px1, py0 + 20, "角度差 t（度）", { size: 10.5, fill: C.dim, anchor: "end" });
    VZ.txt(svg, px0 - 6, py1 - 20, "CHSH 量 S", { size: 10.5, fill: C.dim, anchor: "start" });
    function SXOf(deg) { return px0 + deg / 90 * (px1 - px0 - 16); }
    function SYOf(s) { return py0 - (s - 1.6) / (3.0 - 1.6) * (py0 - py1); }
    [2, 2.828].forEach(function (lv, i) {
      VZ.ln(svg, px0, SYOf(lv), px1, SYOf(lv), { stroke: i ? C.green : C.red, "stroke-width": 1.6, "stroke-dasharray": "6 5" });
      VZ.txt(svg, px1 - 2, SYOf(lv) - 6, i ? "量子上限 2√2 ≈ 2.828" : "局域隐变量上限 2", { size: 10, fill: i ? C.green : C.red, anchor: "end" });
    });
    var curve = VZ.path(svg, "", VZ.stroke({ stroke: C.cyan, "stroke-width": 2.6 }));
    var marker = VZ.circ(svg, 0, 0, 6, { fill: C.gold });
    var drop = VZ.path(svg, "", VZ.stroke({ stroke: C.gold, "stroke-width": 1.2, "stroke-dasharray": "3 3" }));
    var sVal = VZ.txt(svg, px0 + 6, py1 + 4, "", { size: 11.5, fill: C.gold, weight: 700 });

    function schsh(deg) {
      var t = deg * Math.PI / 180;
      return Math.abs(2 * (Math.cos(t) + Math.sin(t)));
    }
    function redraw() {
      var d = "";
      for (var i = 0; i <= 90; i++) {
        var s = schsh(i);
        d += (i ? "L" : "M") + SXOf(i).toFixed(1) + " " + SYOf(s).toFixed(1);
      }
      curve.setAttribute("d", d);
      var dd = Math.abs(bDeg - aDeg) % 180;
      if (dd > 90) dd = 180 - dd;
      var sv = schsh(dd);
      marker.setAttribute("cx", SXOf(dd)); marker.setAttribute("cy", SYOf(sv));
      drop.setAttribute("d", "M" + SXOf(dd) + " " + SYOf(sv) + "V" + py0);
      sVal.textContent = "S(t) = " + sv.toFixed(3) + (sv > 2 ? "  ✓ 越过经典上限" : "  （未越过）");
      sVal.setAttribute("fill", sv > 2 ? C.green : C.red);
      var aR = aDeg * Math.PI / 180, bR = bDeg * Math.PI / 180;
      aNeedle.setAttribute("d", "M" + aX + " " + sAy + "L" + (aX + 28 * Math.cos(aR)) + " " + (sAy - 28 * Math.sin(aR)));
      bNeedle.setAttribute("d", "M" + bX + " " + sAy + "L" + (bX + 28 * Math.cos(bR)) + " " + (sAy - 28 * Math.sin(bR)));
      var E = -Math.cos((bDeg - aDeg) * Math.PI / 180);
      eTxt.textContent = "E(a,b) = −cos(a−b) = " + E.toFixed(3);
      VZ.setPanel(out, {
        "角度 a": aDeg.toFixed(1) + "°",
        "角度 b": bDeg.toFixed(1) + "°",
        "E = −cos(a−b)": E.toFixed(3),
        "CHSH 量 S": sv.toFixed(3),
        "判定": sv > 2 ? "越过 2：排除了局域隐变量" : "未越过 2"
      });
    }
    var out = VZ.panel(stage, { "角度 a": "", "角度 b": "", "E = −cos(a−b)": "", "CHSH 量 S": "", "判定": "" });
    VZ.slider(stage, {
      label: "爱丽丝的测量角度 a", min: 0, max: 360, step: 0.5, value: 0,
      format: function (v) { return v.toFixed(1) + "°"; },
      onInput: function (v) { aDeg = v; redraw(); }
    });
    VZ.slider(stage, {
      label: "鲍勃的测量角度 b", min: 0, max: 360, step: 0.5, value: 22.5,
      format: function (v) { return v.toFixed(1) + "°"; },
      onInput: function (v) { bDeg = v; redraw(); }
    });
    VZ.raf(svg, function (t) {
      marker.setAttribute("r", 5 + Math.sin(t * 3) * 1.6);
    });
    redraw();
  }
},

/* ==========================================================
   第 24 章 · 狄拉克电子与反粒子
   ========================================================== */
"f-ch24": {
  title: "把相对论能量关系开平方，负号那一支带来反物质",
  hint: "狄拉克要求方程对时间与空间都只含一阶导数：<b>i∂ψ/∂t = (α·p + βm)ψ</b>。要让平方回到 E² = p²c² + m²c⁴，系数只能是满足克利福德关系的矩阵——代价是负能解无法回避。点「打出一个电子」，看负能海里的空穴如何成为正电子。",
  legend: [["正能支 +E", VZ.C.cyan], ["负能支 −E", VZ.C.red], ["负能海（真空）", VZ.C.faint], ["空穴 = 正电子", VZ.C.gold]],
  draw: function (stage) {
    var W = 760, H = 460, svg = VZ.S(stage, W, H, { grid: true });
    var C = VZ.C;
    /* 顶部：开平方 */
    VZ.card(svg, 30, 20, 400, 66, { stroke: "rgba(255,255,255,.12)", fill: "rgba(79,227,240,.05)" });
    VZ.txt(svg, 46, 46, "E² = p²c² + m²c⁴", { size: 15, fill: C.ink, weight: 700 });
    var sqrtTxt = VZ.txt(svg, 190, 46, "开平方 →", { size: 13, fill: C.gold, opacity: 0, weight: 700 });
    var pmTxt = VZ.txt(svg, 272, 48, "E = ±√(p²c² + m²c⁴)", { size: 14, fill: C.gold, opacity: 0, weight: 700 });
    VZ.txt(svg, 46, 72, "要求时间与空间都只含一阶 ⇒ 系数必须满足克利福德关系 ⇒ 只能是矩阵", { size: 10.5, fill: C.dim });

    var ox = 230, oy = 250, US = 78, PS = 92;
    VZ.ln(svg, 60, oy, 415, oy, { stroke: C.faint, "stroke-width": 1 });
    VZ.ln(svg, ox, 118, ox, 400, { stroke: C.faint, "stroke-width": 1 });
    VZ.txt(svg, 420, oy + 4, "p", { size: 12, fill: C.dim });
    VZ.txt(svg, ox + 8, 112, "E", { size: 12, fill: C.dim });
    var upB = VZ.path(svg, "", VZ.stroke({ stroke: C.cyan, "stroke-width": 2.6 }));
    var dnB = VZ.path(svg, "", VZ.stroke({ stroke: C.red, "stroke-width": 2.6 }));
    var gapTxt = VZ.txt(svg, ox + 16, oy + 8, "质量间隙 2mc²", { size: 10.5, fill: C.gold });
    VZ.txt(svg, 250, 142, "+E：正能支", { size: 11.5, fill: C.cyan });
    VZ.txt(svg, 300, 392, "−E：负能支", { size: 11.5, fill: C.red });

    /* 右侧：负能海 */
    var sxx = 470, sww = 260, sy0 = 250, sy1 = 400;
    VZ.el("rect", { x: sxx, y: sy0, width: sww, height: sy1 - sy0, rx: 8, fill: "rgba(75,67,128,.25)", stroke: C.faint, "stroke-width": 1 }, svg);
    VZ.txt(svg, sxx + sww / 2, sy0 - 12, "负能海：真空 = 所有负能态被填满", { size: 11.5, fill: C.ink2, anchor: "middle" });
    var seaDots = [];
    for (var r0 = 0; r0 < 6; r0++) for (var c0 = 0; c0 < 9; c0++) {
      var dxx = sxx + 18 + c0 * 27, dyy = sy0 + 22 + r0 * 24;
      seaDots.push({ el: VZ.circ(svg, dxx, dyy, 4.2, { fill: C.ink2, opacity: .9 }), x: dxx, y: dyy });
    }
    var hole = VZ.circ(svg, 0, 0, 8, { stroke: C.gold, "stroke-width": 2.2, fill: "none", opacity: 0 });
    var holeLbl = VZ.txt(svg, 0, 0, "空穴 = 正电子（带正电）", { size: 11, fill: C.gold, opacity: 0 });
    var posi = VZ.circ(svg, 0, 0, 6, { fill: C.gold, opacity: 0 });
    VZ.txt(svg, sxx + sww / 2, sy1 + 22, "1932 年安德森在宇宙射线中发现正电子", { size: 11, fill: C.green, anchor: "middle" });
    VZ.txt(svg, sxx + sww / 2, sy1 + 40, "自旋 1/2 自动出现；要彻底摆脱负能解 ⇒ 粒子数可变 ⇒ 量子场", { size: 10.5, fill: C.dim, anchor: "middle" });
    VZ.txt(svg, 470, 210, "负能解无法回避，狄拉克的解读是：", { size: 11, fill: C.ink2 });

    var eject = false, ejectT = 0, holeIdx = 30, nextAt = 0.4;
    var ctl = VZ.box(stage, "viz-ctl");
    VZ.btn(ctl, "打出一个电子", function () { eject = true; ejectT = -1; holeIdx = 12 + Math.floor(Math.random() * 40); });

    /* 能量两支：先整条画出，之后由动画保持 */
    (function () {
      var du = "", dd2 = "";
      for (var i = 0; i <= 40; i++) {
        var pn = -1.55 + 3.1 * i / 40;
        var E = Math.sqrt(pn * pn + 0.62);
        du += (i ? "L" : "M") + (ox + pn * PS).toFixed(1) + " " + (oy - E * US).toFixed(1);
        dd2 += (i ? "L" : "M") + (ox + pn * PS).toFixed(1) + " " + (oy + E * US).toFixed(1);
      }
      upB.setAttribute("d", du); dnB.setAttribute("d", dd2);
      VZ.drawIn(upB, 1.4, 0.2);
      VZ.drawIn(dnB, 1.4, 0.55);
    })();

    VZ.raf(svg, function (t) {
      /* 开平方的动画 */
      sqrtTxt.setAttribute("opacity", VZ.clamp(t * 2.2, 0, 1));
      pmTxt.setAttribute("opacity", VZ.clamp(t * 2.2 - 0.5, 0, 1));

      /* 空穴与跃出的电子 */
      if (!eject && t > nextAt) { eject = true; ejectT = t; nextAt = t + 4.2; holeIdx = 12 + Math.floor(Math.random() * 40); }
      if (eject) {
        if (ejectT < 0) ejectT = t;
        var hd = seaDots[holeIdx], k2 = VZ.clamp((t - ejectT) / 1.8, 0, 2);
        var rise = k2 <= 1 ? VZ.ease(k2) : 1;
        posi.setAttribute("cx", hd.x); posi.setAttribute("cy", hd.y - rise * 120);
        posi.setAttribute("opacity", rise > 0.05 ? 1 - Math.max(0, k2 - 1.6) / 0.4 : 0);
        hole.setAttribute("cx", hd.x); hole.setAttribute("cy", hd.y);
        hole.setAttribute("opacity", k2 > 0.12 ? Math.min(1, (k2 - 0.12) * 3) : 0);
        hole.setAttribute("r", 8 + Math.sin(t * 4) * 1.6);
        holeLbl.setAttribute("x", hd.x > 590 ? hd.x - 12 : hd.x + 12);
        holeLbl.setAttribute("y", hd.y - 8);
        holeLbl.setAttribute("text-anchor", hd.x > 590 ? "end" : "start");
        holeLbl.setAttribute("opacity", k2 > 0.3 ? 1 : 0);
        hd.el.setAttribute("opacity", k2 > 0.1 ? Math.max(0, 1 - k2 * 2) * .9 : .9);
        if (k2 >= 2) { eject = false; hd.el.setAttribute("opacity", .9); posi.setAttribute("opacity", 0); hole.setAttribute("opacity", 0); holeLbl.setAttribute("opacity", 0); }
      }
    });
  }
}

});

/* ============================================================
   viz-c.js — 《通向实在之路》第 25–34 章图示（10 幅）
   工具与颜色全部来自 viz-core.js；样式基准见 viz-part1.js。
   ============================================================ */

/* 局部版 travel：光点初始就放在路径起点（避免 bbox 检查时停在画布外） */
function flow(svg, d, o) {
  o = o || {};
  var host = VZ.g(svg);
  var p = VZ.path(host, d, { stroke: "none", fill: "none" });
  var len = 0, p0 = { x: -999, y: -999 };
  try { len = p.getTotalLength(); p0 = p.getPointAtLength(0); } catch (e) { return; }
  if (p0.x < -900) return;
  var n = o.count || 1, dur = o.dur || 2.4, delay = o.delay || 0;
  var dots = [];
  for (var i = 0; i < n; i++) dots.push(VZ.circ(host, p0.x, p0.y, o.r || 4.5, { fill: o.color || VZ.C.cyan }));
  VZ.raf(svg, function (t) {
    var span = dur + delay;
    for (var k = 0; k < dots.length; k++) {
      var ph = ((t + delay - k * span / n) % span + span) % span;
      if (ph > dur) { dots[k].setAttribute("opacity", 0); continue; }
      var u = VZ.ease(ph / dur);
      var pt = p.getPointAtLength(u * len);
      dots[k].setAttribute("opacity", o.fade === false ? 1 : Math.sin(Math.PI * u) * .9 + .1);
      dots[k].setAttribute("cx", pt.x);
      dots[k].setAttribute("cy", pt.y);
    }
  });
}

VZ.define({

/* ==========================================================
   第 25 章 · 粒子物理标准模型（点击交互）
   ========================================================== */
"f-ch25": {
  title: "标准模型：SU(3) × SU(2) × U(1)，以及它自己没有回答的问题",
  hint: "点击任何一个粒子，看它属于哪个群的表示。这张清单是相对能量尺度而言的——夸克永不被单独观测到（禁闭）。而它自己远不是终点：<b>引力不在其中，参数靠实验输入，它只是可重整化而非有限</b>（§25.8）——这些缺口是后面几章的入口。",
  legend: [["夸克（带色 · SU(3)）", VZ.C.gold], ["轻子（无色）", VZ.C.cyan], ["规范玻色子", VZ.C.mag]],
  draw: function (stage) {
    var W = 760, H = 500, svg = VZ.S(stage, W, H, {});
    var C = VZ.C;
    var detail = null;

    /* ---------- 左：三代费米子 ---------- */
    VZ.txt(svg, 30, 32, "三代费米子（物质粒子）", { size: 15, fill: C.ink, weight: 700 });
    ["I", "II", "III"].forEach(function (gname, gi) {
      VZ.txt(svg, 120 + gi * 100, 56, "第 " + gname + " 代", { size: 11.5, fill: C.dim, anchor: "middle" });
    });
    var rows = [
      { syms: ["u", "c", "t"], name: "上型夸克", q: "+2/3", c: C.gold, d: "u、c、t：SU(3) 的色三重态 + SU(2) 的弱二重态；电荷 +2/3" },
      { syms: ["d", "s", "b"], name: "下型夸克", q: "−1/3", c: C.gold, d: "d、s、b：SU(3) 的色三重态 + SU(2) 的弱二重态；电荷 −1/3" },
      { syms: ["e", "μ", "τ"], name: "带电轻子", q: "−1", c: C.cyan, d: "e、μ、τ：无色（不参与强作用），SU(2) 弱二重态；电荷 −1" },
      { syms: ["ν", "ν", "ν"], name: "中微子", q: "0", c: C.cyan, d: "中微子：电中性，只参与弱作用——每代一枚" }
    ];
    var detailTxt;
    rows.forEach(function (r, ri) {
      var y = 64 + ri * 46;
      VZ.txt(svg, 62, y + 24, r.q, { size: 11, fill: C.dim, anchor: "end" });
      r.syms.forEach(function (sym, gi) {
        var x = 76 + gi * 100;
        var gg = VZ.g(svg, { style: "cursor:pointer" });
        VZ.card(gg, x, y, 88, 38, { stroke: r.c, sw: 1.1, fill: "rgba(255,255,255,.04)" });
        VZ.txt(gg, x + 44, y + 17, sym, { size: 15, fill: r.c, anchor: "middle", weight: 700 });
        VZ.txt(gg, x + 44, y + 31, r.name, { size: 9.5, fill: C.dim, anchor: "middle" });
        gg.addEventListener("click", function () {
          setDetail(r.d, r.c, gg);
        });
      });
    });
    VZ.para(svg, 30, 252, "夸克带三种「色」，但永不被单独观测到（禁闭）——「基本粒子」这张清单是相对能量尺度而言的。", { size: 11, per: 36, fill: C.dim });

    /* ---------- 右：规范玻色子 ---------- */
    VZ.txt(svg, 420, 32, "规范玻色子（力的传递者）", { size: 15, fill: C.ink, weight: 700 });
    VZ.txt(svg, 420, 60, "SU(3) × SU(2) × U(1)", { size: 17, fill: C.gold, weight: 700, "font-family": "Georgia,serif" });
    var bosons = [
      { s: "γ", n: "光子", g: "U(1)（低能剩下的部分）", d: "γ 光子：U(1) 的规范玻色子——电弱统一在低能下剩下的部分" },
      { s: "W± Z", n: "弱玻色子", g: "SU(2)（弱）", d: "W± 与 Z：SU(2) 的规范玻色子，负责弱相互作用" },
      { s: "g ×8", n: "胶子", g: "SU(3)（色）", d: "g 胶子共 8 枚：SU(3) 的规范玻色子，把夸克绑进强子（禁闭的来源）" },
      { s: "H", n: "希格斯", g: "希格斯机制破缺电弱对称", d: "希格斯：不是规范玻色子；希格斯机制把电弱对称破缺——电磁的 U(1) 是破缺后剩下的" }
    ];
    bosons.forEach(function (b, bi) {
      var y = 72 + bi * 38;
      var gg = VZ.g(svg, { style: "cursor:pointer" });
      VZ.card(gg, 420, y, 300, 32, { stroke: C.mag, sw: 1.1, fill: "rgba(255,255,255,.04)" });
      VZ.txt(gg, 436, y + 21, b.s, { size: 14, fill: C.mag, weight: 700 });
      VZ.txt(gg, 500, y + 21, b.g, { size: 11, fill: C.ink2 });
      gg.addEventListener("click", function () { setDetail(b.d, C.mag, gg); });
    });
    VZ.para(svg, 420, 232, "电弱统一 SU(2) × U(1)：高能下 γ、W、Z 同族；希格斯机制把它破缺到低能的 U(1)。", { size: 11, per: 28, fill: C.dim });

    /* ---------- 中：反射不对称（P 破坏） ---------- */
    VZ.card(svg, 20, 268, 720, 132, { stroke: "rgba(255,255,255,.12)" });
    VZ.txt(svg, 36, 290, "反射不对称：弱作用破坏宇称 P（1956 年之后被实验确认）", { size: 13.5, fill: C.ink, weight: 700 });
    VZ.txt(svg, 724, 290, "C、P、T 单个都可能被破坏；组合 CPT 牢固成立", { size: 10.5, fill: C.dim, anchor: "end" });
    /* 真实世界 */
    VZ.circ(svg, 140, 352, 11, { fill: "none", stroke: C.ink, "stroke-width": 2 });
    VZ.ln(svg, 118, 378, 118, 342, VZ.stroke({ stroke: C.ink2, "stroke-width": 1.6 }));
    VZ.path(svg, "M118 342l-5 9h10z", { fill: C.ink2 });
    VZ.txt(svg, 112, 390, "自旋", { size: 10, fill: C.dim, anchor: "middle" });
    VZ.path(svg, "M152 350L262 316", VZ.stroke({ stroke: C.cyan, "stroke-width": 2 }));
    VZ.path(svg, "M262 316l-11 -1l6 9z", { fill: C.cyan });
    flow(svg, "M152 350L262 316", { color: C.cyan, dur: 1.7, count: 2, r: 3.5 });
    VZ.txt(svg, 200, 336, "β 衰变的电子", { size: 10.5, fill: C.cyan });
    VZ.txt(svg, 190, 392, "真实世界：电子偏向与自旋相关的一侧", { size: 10.5, fill: C.ink2, anchor: "middle" });
    /* 镜子 */
    VZ.ln(svg, 340, 306, 340, 392, { stroke: C.dim, "stroke-width": 1.4, "stroke-dasharray": "7 6" });
    VZ.txt(svg, 348, 306, "镜子", { size: 10.5, fill: C.dim });
    /* 镜像世界 */
    VZ.circ(svg, 480, 352, 11, { fill: "none", stroke: C.ink, "stroke-width": 2 });
    VZ.ln(svg, 458, 378, 458, 342, VZ.stroke({ stroke: C.ink2, "stroke-width": 1.6, opacity: .6 }));
    VZ.path(svg, "M458 342l-5 9h10z", { fill: C.ink2, opacity: .6 });
    VZ.path(svg, "M492 350L602 384", VZ.stroke({ stroke: C.mag, "stroke-width": 2, "stroke-dasharray": "6 4" }));
    VZ.path(svg, "M602 384l-11 1l6 -9z", { fill: C.mag });
    flow(svg, "M492 350L602 384", { color: C.mag, dur: 1.7, count: 2, r: 3.5 });
    VZ.txt(svg, 560, 392, "镜像世界：偏向另一侧——与真实并不等价", { size: 10.5, fill: C.mag, anchor: "middle" });

    /* ---------- 底：标准模型之外 ---------- */
    VZ.card(svg, 20, 410, 720, 78, { stroke: "rgba(255,255,255,.12)", fill: "rgba(255,111,216,.05)" });
    VZ.txt(svg, 36, 432, "标准模型之外（本书的入口）", { size: 13.5, fill: C.mag, weight: 700 });
    VZ.txt(svg, 36, 456, "① 引力不在其中", { size: 12, fill: C.ink2 });
    VZ.txt(svg, 250, 456, "② 参数（质量、混合角）靠实验输入，而非理论导出", { size: 12, fill: C.ink2 });
    VZ.txt(svg, 560, 456, "③ 只是可重整化，不是有限（§26.9）", { size: 12, fill: C.ink2 });
    detailTxt = VZ.txt(svg, 36, 478, "点击任意粒子，查看它属于哪个群的表示", { size: 11.5, fill: C.dim });

    function setDetail(s, color, node) {
      detailTxt.textContent = s;
      detailTxt.setAttribute("fill", color);
      svg.querySelectorAll("rect").forEach(function (rc) {
        if (rc.getAttribute("sw-hl")) { rc.setAttribute("stroke-width", 1.1); rc.removeAttribute("sw-hl"); }
      });
      var rects = node.querySelectorAll("rect");
      if (rects.length) { rects[0].setAttribute("stroke-width", 2.4); rects[0].setAttribute("sw-hl", "1"); }
    }
    VZ.stagger(svg, "g", 40);
  }
},

/* ==========================================================
   第 26 章 · 量子场论（费曼图生长 + 重整化滑杆）
   ========================================================== */
"f-ch26": {
  title: "量子场论：费曼图是记账，重整化是把无穷大搬走",
  hint: "拖动滑杆增大截断 Λ：<b>发散部分被吸收进本来就由实验定值的参数里</b>，可观测预言保持有限——但理论本身仍只是可重整化，不是有限（§26.9）。另一件事：费曼图是微扰展开的记账方式，不是时空里真实发生的过程。",
  legend: [["被吸收的发散部分", VZ.C.red], ["有限的可观测预言", VZ.C.green], ["内线 = 一个积分", VZ.C.cyan]],
  draw: function (stage) {
    var W = 760, H = 490, svg = VZ.S(stage, W, H, { grid: true });
    var C = VZ.C;

    /* ---------- 左上：费曼图生长动画 ---------- */
    var v1 = [150, 110], v2 = [150, 210];
    var lines = [
      { d: "M44 210L" + v1[0] + " " + v1[1], c: C.ink, w: 2 },
      { d: "M44 110L" + v1[0] + " " + v1[1], c: C.ink, w: 2 },
      { d: "M" + v2[0] + " " + v2[1] + "L256 110", c: C.ink, w: 2 },
      { d: "M" + v2[0] + " " + v2[1] + "L256 210", c: C.ink, w: 2 }
    ];
    var wav = "M150 110";
    for (var i = 0; i < 8; i++) wav += " q" + (i % 2 ? -9 : 9) + " 6.25 0 12.5";
    lines.push({ d: wav, c: C.cyan, w: 2 });
    lines.forEach(function (L, i) {
      var p = VZ.path(svg, L.d, VZ.stroke({ stroke: L.c, "stroke-width": L.w }));
      VZ.drawIn(p, .8, i * .28);
    });
    [v1, v2].forEach(function (v, i) {
      var vc = VZ.circ(svg, v[0], v[1], 4.5, { fill: C.gold });
      vc.style.opacity = 0;
      vc.style.transition = "opacity .4s ease " + (1.15 + i * .28) + "s";
      requestAnimationFrame(function () { requestAnimationFrame(function () { vc.style.opacity = 1; }); });
    });
    VZ.txt(svg, 34, 226, "e⁻", { size: 12, fill: C.ink });
    VZ.txt(svg, 34, 104, "e⁺", { size: 12, fill: C.ink });
    VZ.txt(svg, 262, 104, "e⁺", { size: 12, fill: C.ink });
    VZ.txt(svg, 262, 226, "e⁻", { size: 12, fill: C.ink });
    VZ.txt(svg, 162, 96, "顶点", { size: 11, fill: C.gold });
    VZ.txt(svg, 166, 166, "内线 = 一个积分", { size: 11, fill: C.cyan });
    VZ.txt(svg, 40, 158, "外线", { size: 11, fill: C.dim });
    VZ.para(svg, 24, 258, "⚠ 费曼图 = 微扰展开的记账方式，不是时空里真实发生的过程。它完全由拉格朗日量决定。", { size: 11.5, per: 24, fill: C.gold });

    /* ---------- 右上：QFT 支点 ---------- */
    VZ.card(svg, 430, 24, 310, 128, { stroke: "rgba(255,255,255,.12)" });
    VZ.txt(svg, 446, 46, "QFT 的三个支点", { size: 13.5, fill: C.cyan, weight: 700 });
    VZ.para(svg, 446, 68, "产生 ⇄ 湮灭算符互不对易 ⇒ 粒子数可变；反粒子 = 配套的另一套算符——不需要「负能海」；真空 = 场的最低能态，可有替代真空。", { size: 11.5, per: 27, lh: 18 });

    /* ---------- 下：重整化流程 ---------- */
    VZ.txt(svg, 24, 330, "重整化：发散积分 → 截断 → 吸收 → 有限预言", { size: 14.5, fill: C.ink, weight: 700 });
    var boxes = [
      { x: 24, w: 160, t1: "发散积分", t2: "I(Λ) → ∞", c: C.red },
      { x: 216, w: 110, t1: "引入截断", t2: "Λ", c: C.ink2 },
      { x: 358, w: 180, t1: "吸收进 m₀、e₀", t2: "（本来就由实验定值）", c: C.gold },
      { x: 570, w: 166, t1: "可观测预言有限 ✓", t2: "QED：十位以上有效数字", c: C.green }
    ];
    boxes.forEach(function (b, bi) {
      VZ.card(svg, b.x, 344, b.w, 40, { stroke: b.c, sw: 1.2, fill: "rgba(255,255,255,.035)" });
      VZ.txt(svg, b.x + b.w / 2, 360, b.t1, { size: 11.5, fill: b.c, anchor: "middle", weight: 700 });
      VZ.txt(svg, b.x + b.w / 2, 376, b.t2, { size: 9.5, fill: C.dim, anchor: "middle" });
      if (bi < 3) {
        var x1 = b.x + b.w + 4, x2 = boxes[bi + 1].x - 4, ym = 364;
        VZ.ln(svg, x1, ym, x2, ym, { stroke: C.dim, "stroke-width": 1.2 });
        VZ.path(svg, "M" + x2 + " " + ym + "l-8 -4v8z", { fill: C.dim });
      }
    });

    /* 积分曲线 + 截断（左） */
    var gx = 30, gy = 404, gw = 340, gh = 46;
    VZ.ln(svg, gx, gy + gh, gx + gw, gy + gh, { stroke: C.faint, "stroke-width": 1 });
    var curve = [];
    for (var k = 0; k <= 60; k++) {
      var xx = gx + gw * k / 60;
      var yy = gy + gh - gh * (1 / (1 + k * 0.055)) * 0.96;
      curve.push([xx, yy]);
    }
    VZ.path(svg, curve.map(function (p, i2) { return (i2 ? "L" : "M") + p[0].toFixed(1) + " " + p[1].toFixed(1); }).join(""),
      VZ.stroke({ stroke: C.ink2, "stroke-width": 1.4 }));
    var cutLine = VZ.ln(svg, gx, gy, gx, gy + gh, VZ.stroke({ stroke: C.gold, "stroke-width": 1.6, "stroke-dasharray": "5 4" }));
    var areaFill = VZ.path(svg, "", { fill: C.red, opacity: .22 });
    VZ.txt(svg, gx, gy - 6, "被积函数示意（k 积分）", { size: 10.5, fill: C.dim });
    VZ.txt(svg, gx + gw, gy + gh + 14, "k →", { size: 10.5, fill: C.dim, anchor: "end" });

    /* 发散/有限双条（右） */
    var baseY = 450, barW = 56;
    var redBar = VZ.path(svg, "", { fill: C.red, opacity: .75 });
    var greenBar = VZ.path(svg, "", { fill: C.green, opacity: .75 });
    VZ.txt(svg, 500, baseY + 16, "发散部分", { size: 10.5, fill: C.red, anchor: "middle" });
    VZ.txt(svg, 500, baseY + 30, "被吸收进参数", { size: 9.5, fill: C.dim, anchor: "middle" });
    VZ.txt(svg, 636, baseY + 16, "可观测预言", { size: 10.5, fill: C.green, anchor: "middle" });
    VZ.txt(svg, 636, baseY + 30, "有限 · 与 Λ 无关", { size: 9.5, fill: C.dim, anchor: "middle" });
    var lamTxt = VZ.txt(svg, 744, 420, "", { size: 12, fill: C.gold, anchor: "end" });

    function update(lam) {
      var xc = gx + gw * (lam / 100);
      cutLine.setAttribute("x1", xc); cutLine.setAttribute("x2", xc);
      var pts = "M" + gx + " " + (gy + gh);
      for (var j = 0; j <= 60; j++) {
        var xx2 = gx + gw * j / 60;
        if (xx2 > xc) break;
        var yy2 = gy + gh - gh * (1 / (1 + j * 0.055)) * 0.96;
        pts += "L" + xx2.toFixed(1) + " " + yy2.toFixed(1);
      }
      pts += "L" + xc.toFixed(1) + " " + (gy + gh) + "Z";
      areaFill.setAttribute("d", pts);
      var rh = Math.log(lam) * 14;
      redBar.setAttribute("d", "M472 " + baseY + "v" + (-rh) + "h" + barW + "v" + rh + "Z");
      greenBar.setAttribute("d", "M608 " + baseY + "v-60h" + barW + "v60Z");
      lamTxt.textContent = "Λ = " + Math.round(lam);
      VZ.setPanel(out, {
        "截断 Λ": String(Math.round(lam)),
        "发散项 ∝ ln Λ": Math.log(lam).toFixed(2),
        "去向": "被吸收进 m₀、e₀（实验定值）",
        "可观测预言": "有限 ✓（理论仍非有限）"
      });
    }
    var out = VZ.panel(stage, { "截断 Λ": "", "发散项 ∝ ln Λ": "", "去向": "", "可观测预言": "" });
    var sl = VZ.slider(stage, { label: "截断 Λ", min: 2, max: 100, step: 1, value: 12, format: function (v) { return String(Math.round(v)); }, onInput: update });
    update(12);
  }
},

/* ==========================================================
   第 27 章 · 大爆炸与热力学第二定律（相格熵演示 + 黑洞熵）
   ========================================================== */
"f-ch27": {
  title: "第二定律推不出来——熵增的方向是初始条件给的",
  hint: "把滑杆推到最右（极低熵初始条件），粒子会自然抹平有序、熵稳定增长；推到最左（初始已近最大熵），<b>熵几乎不动——第二定律根本推不出来</b>（§27.5 标题就是「第二定律的推导——还是没有？」）。右下是那个反常的黑洞熵：S = kA/4，正比于面积而非体积。",
  legend: [["粒子（相格系统）", VZ.C.cyan], ["熵轨迹 S(t)", VZ.C.gold], ["黑洞熵 S = kA/4", VZ.C.mag]],
  draw: function (stage) {
    var W = 760, H = 470, svg = VZ.S(stage, W, H, {});
    var C = VZ.C;

    /* ---------- 左：相格系统 ---------- */
    VZ.card(svg, 20, 56, 380, 300, { stroke: C.faint });
    var GX = 32, GY = 70, GW = 356, GH = 272;
    for (var i = 0; i <= 7; i++) VZ.ln(svg, GX + GW * i / 7, GY, GX + GW * i / 7, GY + GH, { stroke: C.faint, "stroke-width": .6, opacity: .5 });
    for (var j = 0; j <= 4; j++) VZ.ln(svg, GX, GY + GH * j / 4, GX + GW, GY + GH * j / 4, { stroke: C.faint, "stroke-width": .6, opacity: .5 });
    var N = 56;
    var dots = [], dotsG = VZ.g(svg);
    for (var d = 0; d < N; d++) dots.push({ el: VZ.circ(dotsG, GX, GY, 3.2, { fill: C.cyan, opacity: .9 }), x: 0, y: 0 });
    function gauss() {
      var u = 0, v = 0;
      while (u === 0) u = Math.random(); while (v === 0) v = Math.random();
      return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
    }
    var order = 0.85, tCounter = 0, hist = [];
    function reset() {
      hist = []; tCounter = 0;
      var cx = GX + GW / 2, cy = GY + GH / 2;
      dots.forEach(function (p) {
        if (Math.random() < order) { p.x = cx + gauss() * 13; p.y = cy + gauss() * 11; }
        else { p.x = GX + Math.random() * GW; p.y = GY + Math.random() * GH; }
        p.x = VZ.clamp(p.x, GX + 4, GX + GW - 4);
        p.y = VZ.clamp(p.y, GY + 4, GY + GH - 4);
      });
      hist.push(entropy());
      drawTraj();
    }
    function entropy() {
      var bins = [];
      for (var b = 0; b < 28; b++) bins.push(0);
      dots.forEach(function (p) {
        var ci = VZ.clamp(Math.floor((p.x - GX) / GW * 7), 0, 6);
        var ri = VZ.clamp(Math.floor((p.y - GY) / GH * 4), 0, 3);
        bins[ri * 7 + ci] += 1;
      });
      var S = 0;
      bins.forEach(function (n) { if (n > 0) { var pr = n / N; S -= pr * Math.log(pr); } });
      return S / Math.log(28);
    }
    VZ.txt(svg, 32, 400, "左图：56 个粒子在相格里随机游走——看它如何抹平（或抹不平）初始的有序。", { size: 11, fill: C.dim });

    /* ---------- 右上：S(t) 轨迹 ---------- */
    VZ.card(svg, 420, 56, 320, 196, { stroke: C.faint });
    VZ.txt(svg, 436, 78, "熵 S 随时间的轨迹（相对值）", { size: 12, fill: C.ink2 });
    var PX = 440, PY = 92, PW = 284, PH = 138;
    VZ.ln(svg, PX, PY + PH, PX + PW, PY + PH, { stroke: C.faint });
    VZ.ln(svg, PX, PY, PX, PY + PH, { stroke: C.faint });
    VZ.txt(svg, PX + PW, PY + PH + 14, "时间 →", { size: 10, fill: C.dim, anchor: "end" });
    var traj = VZ.path(svg, "", VZ.stroke({ stroke: C.gold, "stroke-width": 2 }));
    var trajHead = VZ.circ(svg, PX, PY + PH, 3.5, { fill: C.gold });

    /* ---------- 右中：判词 ---------- */
    var verdictG = VZ.g(svg);

    /* ---------- 右下：§27.5 + 黑洞熵 ---------- */
    VZ.card(svg, 420, 322, 320, 64, { stroke: C.gold, sw: 1.2, fill: "rgba(255,207,92,.06)" });
    VZ.txt(svg, 436, 344, "§27.5「第二定律的推导——还是没有？」", { size: 12.5, fill: C.gold, weight: 700 });
    VZ.para(svg, 436, 362, "方向性只能来自初始条件：宇宙始于极低熵。这不是从定律推出的，是输进去的。", { size: 11, per: 27, lh: 16 });

    VZ.card(svg, 420, 396, 320, 66, { stroke: C.mag, sw: 1.2, fill: "rgba(255,111,216,.06)" });
    VZ.txt(svg, 436, 418, "黑洞熵  S = kA / 4", { size: 15, fill: C.mag, weight: 700, "font-family": "Georgia,serif" });
    VZ.para(svg, 436, 436, "与视界面积成正比而非体积（反常）；引力系统倾向聚集，「均匀」不是引力的高熵终态。", { size: 10.5, per: 31, lh: 14 });

    /* ---------- 演化循环 ---------- */
    function drawTraj() {
      var d = "";
      hist.forEach(function (v, i2) {
        var hx = PX + PW * i2 / 83, hy = PY + PH - v * PH;
        d += (i2 ? "L" : "M") + hx.toFixed(1) + " " + hy.toFixed(1);
      });
      traj.setAttribute("d", d);
      if (hist.length) {
        trajHead.setAttribute("cx", PX + PW * (hist.length - 1) / 83);
        trajHead.setAttribute("cy", PY + PH - hist[hist.length - 1] * PH);
      }
    }
    var frame = 0;
    VZ.raf(svg, function (t) {
      frame++;
      dots.forEach(function (p) {
        p.x += (Math.random() - .5) * 3.4;
        p.y += (Math.random() - .5) * 3.4;
        if (p.x < GX + 3) p.x = GX + 3; if (p.x > GX + GW - 3) p.x = GX + GW - 3;
        if (p.y < GY + 3) p.y = GY + 3; if (p.y > GY + GH - 3) p.y = GY + GH - 3;
        p.el.setAttribute("cx", p.x); p.el.setAttribute("cy", p.y);
      });
      if (frame === 1 || frame % 7 === 0) {
        hist.push(entropy()); if (hist.length > 84) hist.shift();
        drawTraj();
        var lowStart = order > 0.55;
        verdictG.innerHTML = "";
        var vg = VZ.g(svg);
        if (lowStart) {
          VZ.txt(vg, 436, 268, "从极低熵出发 ⇒ 熵自然增长。", { size: 12, fill: C.green, weight: 700 });
          VZ.para(vg, 436, 288, "但方向是初始条件给的：换一个高熵起点，同样的定律什么都不会给你。", { size: 11, per: 27, lh: 16, fill: C.ink2 });
        } else {
          VZ.txt(vg, 436, 268, "初始已近最大熵 ⇒ 熵几乎不再增长。", { size: 12, fill: C.red, weight: 700 });
          VZ.para(vg, 436, 288, "§27.5 的结论：时间对称的动力学推不出熵增——必须输入极低熵的起点。", { size: 11, per: 27, lh: 16, fill: C.ink2 });
        }
        if (verdictG.parentNode) verdictG.parentNode.removeChild(verdictG);
        verdictG = vg;
        VZ.setPanel(out, { "初始有序度": order.toFixed(2), "当前熵 S（相对）": (hist[hist.length - 1] || 0).toFixed(2) });
      }
    });

    var out = VZ.panel(stage, { "初始有序度": "", "当前熵 S（相对）": "" });
    VZ.slider(stage, {
      label: "初始有序度（左=已均匀 / 右=极低熵）", min: 0, max: 1, step: 0.01, value: 0.85,
      format: function (v) { return v.toFixed(2); },
      onInput: function (v) { order = v; reset(); }
    });
    VZ.btn(stage, "重置再演化", function () { reset(); });
    reset();
  }
},

/* ==========================================================
   第 28 章 · 早期宇宙的思辨（外尔曲率假说 + 分支图点击）
   ========================================================== */
"f-ch28": {
  title: "外尔曲率假说：用一个几何条件把起点钉在极低熵上",
  hint: "点击右侧任何一个分支看详情。作者自己押的是★外尔曲率假说：初始奇点处外尔 = 0 ⇒ 引力熵极小——而且它是<b>可检验</b>的猜想，不是不可证伪的故事。暴胀与人择在他这里是「可选项」，各有明确的批评。",
  legend: [["外尔 = 0（初始 · 光滑）", VZ.C.green], ["外尔巨大（终态 · 杂乱）", VZ.C.red], ["可检验的主干", VZ.C.cyan]],
  draw: function (stage) {
    var W = 760, H = 470, svg = VZ.S(stage, W, H, {});
    var C = VZ.C;

    /* ---------- 左：共形图对比 ---------- */
    VZ.card(svg, 20, 30, 350, 330, { stroke: C.faint });
    VZ.txt(svg, 36, 52, "两类奇点，两种几何（共形示意）", { size: 13.5, fill: C.ink, weight: 700 });
    /* 初始奇点：光滑线 */
    VZ.ln(svg, 60, 130, 330, 130, VZ.stroke({ stroke: C.green, "stroke-width": 2.6 }));
    VZ.poly(svg, [[60, 130], [120, 66], [270, 66], [330, 130]], { stroke: C.ink2, "stroke-width": 1.2, opacity: .7 });
    for (var ci = 0; ci < 4; ci++) {
      var cx2 = 105 + ci * 60;
      VZ.path(svg, "M" + cx2 + " " + 126 + "l9 -9M" + cx2 + " " + 126 + "l-9 -9", { stroke: C.faint, "stroke-width": 1, opacity: .8 });
    }
    VZ.txt(svg, 195, 152, "大爆炸奇点：外尔曲率 = 0（无杂质）", { size: 11.5, fill: C.green, anchor: "middle", weight: 700 });
    /* 熵箭头 */
    VZ.ln(svg, 195, 168, 195, 208, { stroke: C.gold, "stroke-width": 1.6 });
    VZ.path(svg, "M195 208l-6 -10h12z", { fill: C.gold });
    VZ.txt(svg, 207, 192, "熵随演化增长", { size: 10.5, fill: C.gold });
    /* 终态奇点：波浪线 */
    var wav = "M100 300";
    for (var w = 0; w < 10; w++) wav += "q7 " + (w % 2 ? 7 : -7) + " 14 0";
    VZ.path(svg, wav, VZ.stroke({ stroke: C.red, "stroke-width": 2.4 }));
    VZ.path(svg, "M70 320Q110 262 118 296M320 320Q280 262 272 296", VZ.stroke({ stroke: C.ink2, "stroke-width": 1.2, opacity: .7 }));
    for (var cj = 0; cj < 5; cj++) {
      var cx3 = 125 + cj * 32;
      VZ.path(svg, "M" + cx3 + " " + 306 + "l9 -9M" + cx3 + " " + 306 + "l-9 -9", { stroke: C.faint, "stroke-width": 1, opacity: .8 });
    }
    VZ.txt(svg, 195, 344, "黑洞 / 大挤压奇点：外尔曲率巨大（杂乱）", { size: 11.5, fill: C.red, anchor: "middle", weight: 700 });

    /* ---------- 右：分支图 ---------- */
    var branches = [
      { t: "自发对称破缺", s: "方程对称，真空不对称——超导是实例，不是思辨", c: C.green,
        d: "方程保持对称，但最低能态（真空）打破了对称。超导是最好的实例，所以这一条本身不是思辨（§28.1）。" },
      { t: "拓扑缺陷 · 磁单极过多", s: "不同区域各自选真空 ⇒ 交界处留下缺陷 ⇒ 暴胀的动机", c: C.ink2,
        d: "温度下降后不同区域各自选真空，交界处留下畴壁、弦、磁单极等缺陷。这类机制通常给出过多的磁单极，与观测不符——这正是暴胀的动机之一（§28.2–28.3）。" },
      { t: "暴胀 ⚠", s: "⚠ 需特殊初始条件 ⚠ 放大外尔曲率（方向相反）", c: C.gold,
        d: "暴胀用指数膨胀解释平坦、均匀与磁单极缺失。但 Penrose 的审查（§28.5）：① 启动暴胀本身需要特殊的初始条件——被解释的难题被假设了进去；② 暴胀会放大外尔曲率，使熵变大——与「极低熵起点」的方向相反。" },
      { t: "人择原理", s: "只有这样的参数才允许观测者——可启发，难作解释终点", c: C.violet,
        d: "我们观测到的参数之所以如此，是因为只有这样的参数才允许观测者存在。作者的评价：可以有启发，但很难作为解释的终点（§28.6）。" },
      { t: "★ 外尔曲率假说（§28.8）", s: "初始奇点外尔 = 0 ⇒ 引力熵极小 ⇒ 可检验", c: C.cyan, main: true,
        d: "黎曼曲率 = 里奇部分（由局部物质决定）+ 外尔部分（能自由传波的形状自由度）。假说：初始奇点处外尔 = 0 ⇒ 引力熵极小，正是第二定律需要的极低熵起点。它给出可检验的推论：起点附近引力波背景少；黑洞奇点与宇宙起点在几何上性质不同。" },
      { t: "Hartle–Hawking 无边界", s: "时间在起点变成空间方向；作者：未替代外尔假说", c: C.ink2,
        d: "用欧氏化的时空回避起点：时间在起点变成空间方向，「之前」没有意义。作者：它回避了奇点，但能否解决熵的问题并不清楚；他不认为它能替代外尔曲率假说的功能（§28.9）。" }
    ];
    VZ.txt(svg, 400, 52, "早期宇宙的思辨选项（点击看详情）", { size: 13.5, fill: C.ink, weight: 700 });
    var trunk = VZ.ln(svg, 416, 66, 416, 350, { stroke: C.faint, "stroke-width": 1.4 });
    flow(svg, "M416 66V350", { color: C.cyan, dur: 3.4, count: 2, r: 3 });
    var titleEls = [], detTitle, detBody;
    branches.forEach(function (b, bi) {
      var y = 66 + bi * 50;
      var gg = VZ.g(svg, { style: "cursor:pointer" });
      VZ.ln(gg, 416, y + 19, 436, y + 19, { stroke: b.c, "stroke-width": b.main ? 2.2 : 1.2 });
      VZ.card(gg, 436, y, 288, 40, { stroke: b.c, sw: b.main ? 1.8 : 1, fill: b.main ? "rgba(79,227,240,.07)" : "rgba(255,255,255,.035)" });
      VZ.txt(gg, 450, y + 17, b.t, { size: 12.5, fill: b.c, weight: 700 });
      VZ.txt(gg, 450, y + 32, b.s, { size: 9, fill: C.dim });
      gg.addEventListener("click", function () {
        detTitle.textContent = b.t;
        detTitle.setAttribute("fill", b.c);
        detBody.innerHTML = "";
        VZ.para(detBody, 36, 424, b.d, { size: 12, per: 56, lh: 18 });
        titleEls.forEach(function (t, ti) {
          t.setAttribute("stroke-width", ti === bi ? 2 : 1);
        });
      });
      titleEls.push(gg.querySelector("rect"));
    });

    /* ---------- 底：详情面板 ---------- */
    VZ.card(svg, 20, 380, 720, 78, { stroke: "rgba(255,255,255,.12)" });
    detTitle = VZ.txt(svg, 36, 404, "★ 外尔曲率假说（§28.8）", { size: 13.5, fill: C.cyan, weight: 700 });
    VZ.txt(svg, 724, 404, "点击上方分支切换", { size: 10, fill: C.dim, anchor: "end" });
    detBody = VZ.g(svg);
    VZ.para(detBody, 36, 424, branches[4].d, { size: 12, per: 56, lh: 18 });
    titleEls[4].setAttribute("stroke-width", 2);
  }
},

/* ==========================================================
   第 29 章 · 测量悖论（退相干滑杆 + FAPP）
   ========================================================== */
"f-ch29": {
  title: "退相干：相干项被环境抹掉——但 R 并没有被解决",
  hint: "拖动滑杆增大环境耦合强度 γ：密度矩阵的<b>非对角元（相干项）</b>衰减，布洛赫球上的矢量从球面（纯态）沉入球内（混合态）。但这是 <b>FAPP：只对一切实用目的有效</b>——它解释了「为什么看不到干涉」，没有解释「为什么只留下一个结果」（§29.6）。",
  legend: [["对角元 = 经典概率", VZ.C.gold], ["非对角元 = 相干项（衰减）", VZ.C.cyan], ["FAPP 判词", VZ.C.mag]],
  draw: function (stage) {
    var W = 760, H = 430, svg = VZ.S(stage, W, H, {});
    var C = VZ.C;

    /* ---------- 左：布洛赫球 ---------- */
    var bx = 140, by = 200, BR = 78;
    VZ.card(svg, 24, 56, 240, 300, { stroke: C.faint });
    VZ.txt(svg, 40, 78, "自旋 1/2 的布洛赫球", { size: 12.5, fill: C.ink, weight: 700 });
    VZ.circ(svg, bx, by, BR, { stroke: C.faint, "stroke-width": 1.2 });
    VZ.path(svg, "M" + (bx - BR) + " " + by + "A" + BR + " " + 20 + " 0 0 0 " + (bx + BR) + " " + by, { stroke: C.faint, "stroke-width": .8, "stroke-dasharray": "4 4" });
    VZ.path(svg, "M" + (bx - BR) + " " + by + "A" + BR + " " + 20 + " 0 0 1 " + (bx + BR) + " " + by, { stroke: C.faint, "stroke-width": .8, opacity: .5 });
    var vec = VZ.path(svg, "", VZ.stroke({ stroke: C.cyan, "stroke-width": 2.4 }));
    var tip = VZ.circ(svg, bx, by - BR, 5.5, { fill: C.cyan });
    VZ.txt(svg, bx, by + BR + 18, "纯态在球面 ⇒ 混合态沉入球内", { size: 10.5, fill: C.dim, anchor: "middle" });

    /* ---------- 中：密度矩阵 ---------- */
    VZ.card(svg, 284, 56, 220, 300, { stroke: C.faint });
    VZ.txt(svg, 300, 78, "密度矩阵 ρ", { size: 12.5, fill: C.ink, weight: 700 });
    var mx = 302, my = 92, mc = 92;
    var cells = [
      { x: mx, y: my, l: "ρ₁₁", c: C.gold },
      { x: mx + mc, y: my, l: "ρ₁₂", c: C.cyan, off: true },
      { x: mx, y: my + mc, l: "ρ₂₁", c: C.cyan, off: true },
      { x: mx + mc, y: my + mc, l: "ρ₂₂", c: C.gold }
    ];
    var offRects = [];
    cells.forEach(function (cl) {
      var r = VZ.el("rect", { x: cl.x, y: cl.y, width: mc - 4, height: mc - 4, rx: 10, fill: cl.c, stroke: cl.c, "stroke-width": 1.1 }, svg);
      r.setAttribute("opacity", cl.off ? .8 : .45);
      VZ.txt(svg, cl.x + (mc - 4) / 2, cl.y + (mc - 4) / 2 + 6, cl.l, { size: 16, fill: cl.off ? C.deep : C.ink, anchor: "middle", weight: 700 });
      if (cl.off) offRects.push(r);
    });
    VZ.para(svg, 300, 292, "对角元 = 经典概率（留下）；非对角元 = 相干项（被环境抹掉）。", { size: 10.5, per: 19, lh: 16, fill: C.ink2 });
    var cTxt = VZ.txt(svg, 300, 340, "", { size: 12, fill: C.cyan, weight: 700 });

    /* ---------- 右：FAPP 判词 ---------- */
    VZ.card(svg, 524, 56, 216, 300, { stroke: C.mag, sw: 1.2, fill: "rgba(255,111,216,.06)" });
    VZ.txt(svg, 540, 84, "FAPP", { size: 21, fill: C.mag, weight: 700, "font-family": "Georgia,serif" });
    VZ.txt(svg, 540, 104, "就一切实际目的而言", { size: 11.5, fill: C.mag });
    VZ.para(svg, 540, 128, "环境抹掉的是可观测的干涉，不是叠加本身。", { size: 11, per: 17, lh: 16 });
    VZ.para(svg, 540, 174, "同一个 ρ：既可以来自本来就是的混合态，也可以来自纠缠后的约化态——从 ρ 区分不出来。", { size: 11, per: 17, lh: 16, fill: C.ink2 });
    VZ.para(svg, 540, 236, "它没有从原理上把叠加变成一个确定态 ⇒ R 仍未被解决（§29.6）。", { size: 11, per: 17, lh: 16, fill: C.mag });

    /* ---------- 底：常规本体论清单 ---------- */
    VZ.card(svg, 24, 372, 716, 46, { stroke: "rgba(255,255,255,.1)" });
    VZ.para(svg, 40, 392, "常规本体论清点：哥本哈根——「测量」从未被定义 · 多世界/EWG——未解释 |ψ|² 概率 · 意识参与——推到更不清楚处 ⇒ 作者：必须认真考虑非常规方案（第 30 章）。", { size: 11, per: 62, lh: 16, fill: C.dim });

    /* ---------- 动力学：退相干 ---------- */
    var gamma = 0.5, tAcc = 0, coh = 1;
    var phaseEl = { t: 0 };
    VZ.raf(svg, function (dt, ms) {
      var dts = 1 / 60;
      tAcc += dts;
      coh = Math.max(0, Math.exp(-gamma * tAcc));
      var wob = Math.sin(tAcc * 1.1) * 0.35;
      var L = BR * coh, th = 0.85 + wob * coh;
      var tx = bx + L * Math.sin(th), ty = by - L * Math.cos(th);
      vec.setAttribute("d", "M" + bx + " " + by + "L" + tx.toFixed(1) + " " + ty.toFixed(1));
      tip.setAttribute("cx", tx); tip.setAttribute("cy", ty);
      tip.setAttribute("opacity", .3 + .7 * coh);
      offRects.forEach(function (r) { r.setAttribute("opacity", (0.8 * coh).toFixed(3)); });
      cTxt.textContent = "相干度 |ρ₁₂| = " + coh.toFixed(3);
      if (frameCount % 8 === 0) VZ.setPanel(out, { "环境耦合强度 γ": gamma.toFixed(2), "相干度 |ρ₁₂|": coh.toFixed(3), "状态": coh > .05 ? "叠加仍带着相位记忆" : "干涉已不可观测——但只有一个结果吗？" });
      frameCount++;
    });
    var frameCount = 0;
    var out = VZ.panel(stage, { "环境耦合强度 γ": "", "相干度 |ρ₁₂|": "", "状态": "" });
    VZ.slider(stage, {
      label: "环境耦合强度 γ", min: 0.05, max: 2.5, step: 0.01, value: 0.5,
      format: function (v) { return v.toFixed(2); },
      onInput: function (v) { gamma = v; }
    });
    VZ.btn(stage, "重置叠加（回到纯态）", function () { tAcc = 0; coh = 1; });
  }
},

/* ==========================================================
   第 30 章 · 引力导致的态缩减（OR 滑杆 + 坍缩动画）
   ========================================================== */
"f-ch30": {
  title: "薛定谔的肿块：质量够大，叠加自己缩减（OR）",
  hint: "拖动滑杆增大质量：当两分支的<b>引力自能差 E_G 达到 ħ/t 的量级</b>，叠加不再稳定，在有限时间内自发缩减——质量越大，缩得越快。这就是 OR 与标准量子力学可被实验区分的地方（FELIX 类桌面实验）。作者不宣称 OR 成立，他宣称的是它可检验。",
  legend: [["分支 A（将存活）", VZ.C.cyan], ["分支 B（将消失）", VZ.C.mag], ["E_G 阈值 ΔE_G ~ ħ/t", VZ.C.gold]],
  draw: function (stage) {
    var W = 760, H = 460, svg = VZ.S(stage, W, H, {});
    var C = VZ.C;

    /* ---------- 左：肿块叠加 ---------- */
    VZ.card(svg, 20, 26, 410, 280, { stroke: C.faint });
    VZ.txt(svg, 36, 48, "薛定谔的肿块：一个质量处于「A + B」的叠加", { size: 13, fill: C.ink, weight: 700 });
    var AX = 130, BXX = 320, AY = 150, R = 27;
    var blobA = VZ.circ(svg, AX, AY, R, { fill: C.cyan, opacity: .5, stroke: C.cyan, "stroke-width": 1.6 });
    var blobB = VZ.circ(svg, BXX, AY, R, { fill: C.mag, opacity: .5, stroke: C.mag, "stroke-width": 1.6 });
    VZ.txt(svg, AX, AY - R - 10, "位置 A", { size: 11.5, fill: C.cyan, anchor: "middle" });
    VZ.txt(svg, BXX, AY - R - 10, "位置 B", { size: 11.5, fill: C.mag, anchor: "middle" });
    [[AX, -1], [AX, 1], [BXX, -1], [BXX, 1]].forEach(function (f) {
      VZ.ln(svg, f[0] + f[1] * (R + 4), AY + R - 6, f[0] + f[1] * (R + 14), AY + R + 10, { stroke: C.faint, "stroke-width": 1 });
    });
    VZ.txt(svg, 225, AY + 4, "+", { size: 20, fill: C.ink2, anchor: "middle" });
    VZ.txt(svg, 225, AY + 26, "两分支携带不同的引力场", { size: 10.5, fill: C.dim, anchor: "middle" });
    /* E_G 量规 */
    VZ.txt(svg, 36, 236, "引力自能差 E_G", { size: 10.5, fill: C.dim });
    var THX = 60 + 0.52 * 340;
    VZ.ln(svg, 60, 262, 400, 262, { stroke: C.faint, "stroke-width": 1.2 });
    var egBar = VZ.path(svg, "", { fill: C.gold, opacity: .8 });
    VZ.ln(svg, THX, 246, THX, 270, VZ.stroke({ stroke: C.gold, "stroke-width": 1.6 }));
    VZ.txt(svg, THX, 240, "ΔE_G ~ ħ/t 阈值", { size: 10, fill: C.gold, anchor: "middle" });
    var statusTxt = VZ.txt(svg, 36, 292, "", { size: 12.5, weight: 700 });

    /* ---------- 左下：质量标尺 ---------- */
    VZ.card(svg, 20, 316, 410, 52, { stroke: "rgba(255,255,255,.1)" });
    VZ.ln(svg, 60, 344, 400, 344, { stroke: C.faint, "stroke-width": 1.2 });
    ["电子", "原子", "大分子", "尘埃颗粒（FELIX 类实验区）"].forEach(function (lb, li) {
      var xx = 60 + li * (340 / 3);
      VZ.circ(svg, xx, 344, 2.5, { fill: C.dim });
      VZ.txt(svg, xx, 360, lb, { size: 9.5, fill: C.dim, anchor: li === 3 ? "end" : "middle" });
    });

    /* ---------- 右：五张卡片 ---------- */
    var cards = [
      { y: 26, h: 60, c: C.violet, t: "线索", b: "态缩减 R 不可逆 ⇄ 宇宙学的时间不对称——作者猜测两者同源（§30.2）。" },
      { y: 96, h: 84, c: C.cyan, t: "★ OR（客观缩减）", b: "两分支携带不同的引力场 ⇒ 时空本身的差异让叠加不稳定 ⇒ 有限时间内自发缩减；质量越大，缩得越快（§30.10）。" },
      { y: 190, h: 66, c: C.gold, t: "与标准量子力学的分歧", b: "标准图景允许叠加永远保持（隔离够好）——这正是可实验区分之处。" },
      { y: 266, h: 60, c: C.ink2, t: "与爱因斯坦原理的冲突", b: "时空本身要不要也成为量子叠加的对象？这是本章最技术性的困难。" },
      { y: 336, h: 84, c: C.green, t: "FELIX：桌面实验", b: "用可操控的宏观质量检验这个时间尺度 ⇒ 哲学争论变成可测物理（§30.13）。作者不宣称 OR 已经成立——他宣称它可检验。" }
    ];
    cards.forEach(function (cd) {
      VZ.card(svg, 450, cd.y, 290, cd.h, { stroke: cd.c, sw: 1.1, fill: "rgba(255,255,255,.035)" });
      VZ.txt(svg, 464, cd.y + 19, cd.t, { size: 12.5, fill: cd.c, weight: 700 });
      VZ.para(svg, 464, cd.y + 36, cd.b, { size: 10.5, per: 26, lh: 14.5, fill: C.ink2 });
    });

    /* ---------- 动力学 ---------- */
    var mass = 0.4, EG = 0, mode = "super", phase = 0;
    var TH = 0.52;
    function applyMass(v) {
      mass = v; EG = v * v;
      mode = EG >= TH ? "collapse" : "super";
      phase = 0;
    }
    VZ.raf(svg, function () {
      phase += 1 / 60;
      if (mode === "super") {
        var pu = .38 + .22 * Math.sin(phase * 3.2);
        blobA.setAttribute("opacity", pu);
        blobB.setAttribute("opacity", .72 - pu);
        blobB.setAttribute("fill-opacity", 1); blobB.setAttribute("stroke-opacity", 1);
        blobB.setAttribute("r", R);
        statusTxt.textContent = "叠加保持——标准量子力学说隔离够好就能永远保持";
        statusTxt.setAttribute("fill", C.ink2);
        egBar.setAttribute("d", "M60 258v8h" + (EG * 340).toFixed(1) + "v-8Z");
      } else {
        var pr = VZ.clamp(phase / 2.2, 0, 1);
        blobA.setAttribute("opacity", VZ.lerp(.5, 1, pr));
        blobB.setAttribute("opacity", VZ.lerp(.5, .07, pr));
        blobB.setAttribute("r", R * (1 - .45 * pr));
        statusTxt.textContent = "叠加自发缩减！E_G 越过阈值——质量越大，缩得越快（t ≈ ħ/E_G）";
        statusTxt.setAttribute("fill", C.red);
        egBar.setAttribute("d", "M60 258v8h" + (EG * 340).toFixed(1) + "v-8Z");
      }
      if (frameC % 10 === 0) {
        VZ.setPanel(out, {
          "质量（相对）": mass.toFixed(2),
          "E_G（相对值）": EG.toFixed(2),
          "t ≈ ħ/E_G": EG > 0.01 ? (1 / EG).toFixed(1) + "（相对单位）" : "极长",
          "判定": mode === "super" ? "叠加保持" : "自发缩减"
        });
      }
      frameC++;
    });
    var frameC = 0;
    var out = VZ.panel(stage, { "质量（相对）": "", "E_G（相对值）": "", "t ≈ ħ/E_G": "", "判定": "" });
    VZ.slider(stage, {
      label: "质量 m（电子 → 尘埃颗粒）", min: 0.05, max: 1, step: 0.01, value: 0.4,
      format: function (v) { return v.toFixed(2); },
      onInput: applyMass
    });
    VZ.btn(stage, "回到小质量（电子区）", function () { sl.set(0.15); applyMass(0.15); });
    var sl = null;
    applyMass(0.4);
  }
},

/* ==========================================================
   第 31 章 · 弦论与额外维度（卡拉比–丘滑杆 + 保留清单点击）
   ========================================================== */
"f-ch31": {
  title: "卡拉比–丘紧化：10 维如何装进 4 维——以及作者的保留清单",
  hint: "拖动「模空间」滑杆，看卡拉比–丘流形的形变——紧化方式的选择极多，这正是「真空景观」让预言变得含糊的原因（§31.18）。右侧是作者的技术性保留清单（点击逐条展开）；对弦论的物理断言，他的说法是<b>要撒一大把盐</b>。",
  legend: [["6 维蜷缩（卡拉比–丘）", VZ.C.cyan], ["4 维延展时空", VZ.C.violet], ["有分量的结果", VZ.C.gold]],
  draw: function (stage) {
    var W = 760, H = 470, svg = VZ.S(stage, W, H, {});
    var C = VZ.C;
    var p = 0.35;

    /* ---------- 左：紧化漏斗 ---------- */
    VZ.card(svg, 20, 26, 390, 366, { stroke: C.faint });
    VZ.txt(svg, 205, 48, "10 维时空", { size: 12.5, fill: C.ink, anchor: "middle", weight: 700 });
    VZ.ln(svg, 205, 56, 205, 72, { stroke: C.dim, "stroke-width": 1.2 });
    function blobD(cx, cy, R, scale, ph) {
      var d = "";
      for (var i = 0; i <= 64; i++) {
        var th = i / 64 * Math.PI * 2;
        var r = R * scale * (1 + .22 * Math.sin(3 * th + ph * 2.1) + .12 * Math.sin(5 * th - ph * 1.4) + .06 * Math.sin(8 * th + ph));
        d += (i ? "L" : "M") + (cx + r * Math.cos(th)).toFixed(1) + " " + (cy + r * Math.sin(th) * .92).toFixed(1);
      }
      return d + "Z";
    }
    var bOuter = VZ.path(svg, "", VZ.stroke({ stroke: C.cyan, "stroke-width": 2 }));
    var bMid = VZ.path(svg, "", { stroke: C.violet, "stroke-width": 1.3, fill: "none", opacity: .8 });
    var bInner = VZ.path(svg, "", { stroke: C.ink2, "stroke-width": 1, fill: "none", opacity: .6 });
    var BCX = 205, BCY = 150, BR = 62;
    /* 漏斗线 */
    for (var f = -4; f <= 4; f++) {
      var fx = 205 + f * 13;
      var pth = VZ.path(svg, "M" + fx + " " + (BCY + 48) + "Q" + (205 + f * 46) + " 272 " + (205 + f * 37) + " 330", { stroke: C.violet, "stroke-width": 1, opacity: .45 });
      VZ.drawIn(pth, 1, .1 * Math.abs(f));
    }
    var plane = VZ.path(svg, "M55 330a150 24 0 0 0 300 0a150 24 0 0 0 -300 0", VZ.stroke({ stroke: C.violet, "stroke-width": 1.4, "stroke-dasharray": "6 4" }));
    VZ.txt(svg, 205, 372, "4 维延展时空（看得见的）", { size: 11.5, fill: C.violet, anchor: "middle" });
    VZ.ln(svg, 276, 120, 320, 100, { stroke: C.dim, "stroke-width": .9 });
    VZ.txt(svg, 400, 98, "6 维蜷缩成卡拉比–丘流形", { size: 11, fill: C.cyan, anchor: "end" });
    flow(svg, "M205 198Q250 272 242 330", { color: C.cyan, dur: 2.6, count: 2, r: 3 });
    function drawBlob() {
      bOuter.setAttribute("d", blobD(BCX, BCY, BR, 1, p));
      bMid.setAttribute("d", blobD(BCX, BCY, BR, .68, p + .5));
      bInner.setAttribute("d", blobD(BCX, BCY, BR, .4, p + 1.1));
    }
    drawBlob();

    /* 紧化说明 */
    VZ.card(svg, 20, 402, 390, 58, { stroke: "rgba(255,255,255,.1)" });
    VZ.para(svg, 34, 422, "紧化方式的选择极多 ⇒ 「真空景观」——如果什么都有可能，就什么都预言不了（§31.18）。作者追问：紧化本身需要多大的选择性？", { size: 10.5, per: 34, lh: 15 });

    /* ---------- 右：保留清单 ---------- */
    VZ.txt(svg, 430, 48, "要撒一大把盐：技术性保留清单（点击展开）", { size: 13, fill: C.mag, weight: 700 });
    var items = [
      { t: "有限性论证依赖未破缺的超对称（§31.13）", d: "弦论宣称不需要重整化。但论证依赖未破缺的超对称，而现实中超对称显然破缺（否则会有等质量的伴侣粒子）。破缺后是否保持有限，需要证据。" },
      { t: "许多紧化构型经典不稳定", d: "不少紧化在经典层面就会自己塌缩或跑掉。额外维度的尺寸与形状凭什么钉住？稳定性是实打实的问题。" },
      { t: "真空景观 ⇒ 预言含糊", d: "无数个可能真空——如果什么都有可能，它就什么都预言不了。「预言」这件事本身变得含糊。" },
      { t: "身份转移：强子模型 ⇒ 量子引力", d: "它起初是 1960 年代的强相互作用模型，被 QCD 取代；因含自旋 2 的无质量激发（引力子的性质）而改行做量子引力。身份是历史地转移过来的。" },
      { t: "超对称与额外维度至今无观测证据", d: "引力微子等伴侣粒子、额外维度都未观测到。在缺少观测判据时，把数学丰富当成物理成立，是把审美当成了证据。" }
    ];
    var rowRects = [], detTitle2, detBody2;
    items.forEach(function (it, ii) {
      var y = 58 + ii * 42;
      var gg = VZ.g(svg, { style: "cursor:pointer" });
      VZ.card(gg, 430, y, 310, 36, { stroke: C.faint, sw: 1, fill: "rgba(255,255,255,.035)" });
      VZ.circ(gg, 448, y + 18, 8, { fill: "none", stroke: C.mag, "stroke-width": 1.4 });
      VZ.txt(gg, 448, y + 22, String(ii + 1), { size: 10, fill: C.mag, anchor: "middle", weight: 700 });
      var tt = VZ.txt(gg, 466, y + 15, it.t, { size: 11, fill: C.ink, weight: 700 });
      if (it.t.length > 24) tt.textContent = it.t.slice(0, 24) + "…";
      VZ.txt(gg, 466, y + 29, "点击展开", { size: 9, fill: C.dim });
      gg.addEventListener("click", function () {
        detTitle2.textContent = it.t;
        detBody2.innerHTML = "";
        VZ.para(detBody2, 444, 336, it.d, { size: 11, per: 25, lh: 15.5 });
        rowRects.forEach(function (r, ri2) { r.setAttribute("stroke", ri2 === ii ? C.mag : C.faint); r.setAttribute("stroke-width", ri2 === ii ? 1.8 : 1); });
      });
      rowRects.push(gg.querySelector("rect"));
    });
    VZ.card(svg, 430, 272, 310, 34, { stroke: C.line, fill: "rgba(255,255,255,.02)" });
    detTitle2 = VZ.txt(svg, 444, 294, "", { size: 11.5, fill: C.mag, weight: 700 });
    VZ.card(svg, 430, 314, 310, 84, { stroke: C.faint });
    detBody2 = VZ.g(svg);

    /* ---------- 有分量的结果 ---------- */
    VZ.card(svg, 430, 406, 310, 54, { stroke: C.gold, sw: 1.2, fill: "rgba(255,207,92,.06)" });
    VZ.txt(svg, 444, 426, "有分量的结果（作者承认）", { size: 11.5, fill: C.gold, weight: 700 });
    VZ.para(svg, 444, 444, "黑洞熵微状态计数 ⇒ S = kA/4 · 全息原理 · D-膜", { size: 10.5, per: 30, fill: C.ink2 });

    VZ.slider(stage, {
      label: "模空间 · 形变参数", min: 0, max: 1, step: 0.01, value: 0.35,
      format: function (v) { return v.toFixed(2); },
      onInput: function (v) { p = v; drawBlob(); }
    });
    rowRects[0].setAttribute("stroke", C.mag);
    detTitle2.textContent = items[0].t;
    VZ.para(detBody2, 444, 336, items[0].d, { size: 11, per: 25, lh: 15.5 });
  }
},

/* ==========================================================
   第 32 章 · 圈量子引力（自旋网络：节点拖拽 + 自旋点击）
   ========================================================== */
"f-ch32": {
  title: "自旋网络：面积 = 被穿过边的自旋组合（离散谱）",
  hint: "拖动任意节点重排网络；点击面积片旁的自旋标签可切换 j。面积由被穿过边的自旋组合给出——<b>面积算子有离散谱</b>，这是「空间在最小尺度上可能离散」这一说法的来源（但注意：从框架内的数学结果跳到「自然必然如此」还需论证）。Ashtekar 变量的手征输入是这条路的技术前提。",
  legend: [["节点（可拖拽）", VZ.C.cyan], ["边标签 j（自旋）", VZ.C.gold], ["面积片（被边穿过）", VZ.C.violet]],
  draw: function (stage) {
    var W = 760, H = 440, svg = VZ.S(stage, W, H, {});
    var C = VZ.C;
    var SX = 275;

    VZ.card(svg, 20, 30, 430, 390, { stroke: C.faint });
    VZ.card(svg, SX - 10, 45, 20, 360, { stroke: C.violet, sw: 1.2, fill: "rgba(155,140,255,.08)" });
    VZ.txt(svg, SX, 58, "面积片", { size: 10, fill: C.violet, anchor: "middle" });

    var nodes = {
      A: { x: 85, y: 105 }, B: { x: 205, y: 82 }, C: { x: 355, y: 100 },
      D: { x: 125, y: 235 }, E: { x: 240, y: 190 }, F: { x: 365, y: 255 },
      G: { x: 150, y: 345 }, H: { x: 315, y: 355 }
    };
    var jName = function (j) { return j === .5 ? "1/2" : (j === 1 ? "1" : "3/2"); };
    var edges = [
      { a: "A", b: "B", j: .5 }, { a: "B", b: "C", j: 1, punch: true }, { a: "A", b: "D", j: .5 },
      { a: "B", b: "E", j: 1.5 }, { a: "C", b: "F", j: .5 }, { a: "D", b: "E", j: 1 },
      { a: "E", b: "F", j: .5, punch: true }, { a: "D", b: "G", j: 1.5 }, { a: "E", b: "H", j: 1 },
      { a: "G", b: "H", j: .5 }, { a: "C", b: "E", j: 1.5, punch: true }
    ];
    edges.forEach(function (e) {
      e.line = VZ.path(svg, "", VZ.stroke({ stroke: C.ink2, "stroke-width": 1.5 }));
      var na = nodes[e.a], nb = nodes[e.b];
      e.lbl = VZ.txt(svg, (na.x + nb.x) / 2, (na.y + nb.y) / 2 - 5, jName(e.j),
        { size: 10.5, fill: C.gold, anchor: "middle", weight: 700 });
      if (e.punch) {
        e.pg = VZ.g(svg, { style: "cursor:pointer" });
        e.pMark = VZ.circ(e.pg, -99, -99, 5, { fill: C.deep, stroke: C.violet, "stroke-width": 1.6 });
        e.pLbl = VZ.txt(e.pg, -99, -99, "", { size: 11, fill: C.gold, weight: 700 });
        e.pLbl.addEventListener("click", function () {
          e.j = e.j === .5 ? 1 : (e.j === 1 ? 1.5 : .5);
          update();
        });
      }
    });

    var areaTxt = VZ.txt(svg, 40, 402, "", { size: 12.5, fill: C.gold, weight: 700 });

    function update() {
      var sum = 0;
      edges.forEach(function (e) {
        var na = nodes[e.a], nb = nodes[e.b];
        e.line.setAttribute("d", "M" + na.x + " " + na.y + "L" + nb.x + " " + nb.y);
        if (e.punch) { e.lbl.setAttribute("opacity", 0); }
        else {
          e.lbl.setAttribute("x", (na.x + nb.x) / 2);
          e.lbl.setAttribute("y", (na.y + nb.y) / 2 - 5);
          e.lbl.textContent = jName(e.j);
        }
        if (e.punch) {
          var dx = nb.x - na.x;
          var t = dx !== 0 ? (SX - na.x) / dx : -1;
          if (t > .06 && t < .94) {
            var py = na.y + t * (nb.y - na.y);
            e.pMark.setAttribute("cx", SX); e.pMark.setAttribute("cy", py);
            e.pMark.setAttribute("opacity", 1);
            e.pLbl.setAttribute("x", SX + 13); e.pLbl.setAttribute("y", py + 4);
            e.pLbl.setAttribute("opacity", 1);
            e.pLbl.textContent = "j=" + jName(e.j);
            sum += Math.sqrt(e.j * (e.j + 1));
          } else {
            e.pMark.setAttribute("opacity", 0); e.pLbl.setAttribute("opacity", 0);
          }
        }
      });
      areaTxt.textContent = "A ∝ Σ√(j(j+1)) = " + sum.toFixed(3) + "（离散谱：只取分立值）";
    }
    update();

    Object.keys(nodes).forEach(function (k) {
      var n = nodes[k];
      var gg = VZ.g(svg, { style: "cursor:grab" });
      VZ.circ(gg, n.x, n.y, 9, { fill: C.deep, stroke: C.cyan, "stroke-width": 1.8 });
      VZ.circ(gg, n.x, n.y, 3, { fill: C.cyan });
      VZ.drag(svg, gg, W, H, function (x, y) {
        n.x = VZ.clamp(x, 42, 438); n.y = VZ.clamp(y, 62, 400);
        gg.firstChild.setAttribute("cx", n.x); gg.firstChild.setAttribute("cy", n.y);
        gg.lastChild.setAttribute("cx", n.x); gg.lastChild.setAttribute("cy", n.y);
        update();
      });
    });

    /* ---------- 右：四张卡片 ---------- */
    var cards = [
      { y: 40, h: 86, c: C.cyan, t: "Ashtekar 换变量（手征输入）", b: "不用度规，改用带手征（复值）的联络变量 ⇒ 约束的形式变得像杨–米尔斯场（第 15 章！）⇒ 可以借用成熟的规范场技术。" },
      { y: 136, h: 66, c: C.gold, t: "这条路为什么难", b: "一般协变性 ⇒ 坐标无意义，标准量子化程序不总正确；度规约束是非多项式的。" },
      { y: 212, h: 66, c: C.violet, t: "圈变量", b: "基本量子态 = 沿闭合回路的和乐 ⇒ 与纽结／链环不变量天然相关（第 13 章表示论）。" },
      { y: 288, h: 90, c: C.ink2, t: "现状（§32.7）", b: "框架明确 · 背景独立 · 有离散谱这类吸引人的结果；但半经典极限、物质耦合、可检验预言都还没解决。不加超对称、不加额外维度——诚实，但也还没有观测上的通行证。" }
    ];
    cards.forEach(function (cd) {
      VZ.card(svg, 470, cd.y, 270, cd.h, { stroke: cd.c, sw: 1.1, fill: "rgba(255,255,255,.035)" });
      VZ.txt(svg, 484, cd.y + 20, cd.t, { size: 12.5, fill: cd.c, weight: 700 });
      VZ.para(svg, 484, cd.y + 38, cd.b, { size: 10.5, per: 23, lh: 15, fill: C.ink2 });
    });

    edges.forEach(function (e, i) { VZ.drawIn(e.line, .6, i * .1); });
  }
},

/* ==========================================================
   第 33 章 · 扭量理论（chips 切换两种观点）
   ========================================================== */
"f-ch33": {
  title: "扭量 = 光线：把时空点拆成光线的集合",
  hint: "切换「时空观点 / 扭量观点」：在扭量图像里，<b>一条光线 → 扭量空间的一个点；一个时空点 → 一条线</b>。光线只依赖共形结构（角度）不依赖距离，所以扭量偏爱共形。最漂亮的回报：正/负频率分裂在扭量空间里几乎是自然的——它建立的正就是复结构。",
  legend: [["光线（.null 线）", VZ.C.cyan], ["时空点 P / 它的光线族", VZ.C.gold], ["扭量空间 PT", VZ.C.violet]],
  draw: function (stage) {
    var C = VZ.C;
    var host = document.createElement("div");
    var ctl = VZ.box(stage, "viz-chips");
    stage.appendChild(host);
    VZ.chips(ctl, ["时空观点：点 + 光锥", "扭量观点：光线是基本元素"], "时空观点：点 + 光锥", function (m) { render(m); });

    function bottomCards(svg) {
      VZ.card(svg, 20, 214, 340, 84, { stroke: C.cyan, sw: 1.2, fill: "rgba(79,227,240,.05)" });
      VZ.txt(svg, 36, 236, "★ 正/负频率分裂（第 9 章）", { size: 12.5, fill: C.cyan, weight: 700 });
      VZ.para(svg, 36, 254, "在时空描述里是件别扭的事；在扭量语言里几乎是自然的——它建立的正就是复结构。这是扭量最主要的数学优势之一。", { size: 10.5, per: 31, lh: 14.5 });
      VZ.card(svg, 375, 214, 365, 84, { stroke: C.gold, sw: 1.2, fill: "rgba(255,207,92,.05)" });
      VZ.txt(svg, 391, 236, "中心困难", { size: 12.5, fill: C.gold, weight: 700 });
      VZ.para(svg, 391, 254, "扭量最自然的栖息地是共形结构（角度）；真实时空不是共形平坦的 ⇒ 推广到完整广义相对论与粒子物理都很困难。", { size: 10.5, per: 33, lh: 14.5 });
      VZ.card(svg, 20, 306, 720, 62, { stroke: C.mag, sw: 1.2, fill: "rgba(255,111,216,.05)" });
      VZ.para(svg, 36, 326, "作者自评（§33.14）：非主流；有重要见解尚未到位；不预测近期突破——与评弦论用的是同一把尺子：区分数学自然性与物理证据。", { size: 11, per: 62, lh: 16, fill: C.ink2 });
    }

    function render(mode) {
      host.innerHTML = "";
      var W = 760, H = 380, svg = VZ.S(host, W, H, { grid: mode.indexOf("时空") === 0 });
      if (mode.indexOf("时空") === 0) {
        /* ---- 时空观点 ---- */
        var ox = 250, oy = 116;
        VZ.poly(svg, [[ox, oy], [ox + 92, oy - 92], [ox - 92, oy - 92]], { fill: C.cyan, opacity: .08, close: true });
        VZ.poly(svg, [[ox, oy], [ox + 92, oy + 92], [ox - 92, oy + 92]], { fill: C.cyan, opacity: .05, close: true });
        for (var gi = 0; gi < 4; gi++) {
          var dx = (gi - 1.5) * 30;
          VZ.ln(svg, ox + dx * .18, oy, ox + dx, oy - 92, { stroke: C.cyan, "stroke-width": 1.2, opacity: .55 });
          VZ.ln(svg, ox + dx * .18, oy, ox + dx, oy + 92, { stroke: C.cyan, "stroke-width": 1.2, opacity: .35 });
        }
        flow(svg, "M" + ox + " " + oy + "L" + (ox - 45) + " " + (oy - 92), { color: C.cyan, dur: 1.8, count: 2, r: 3 });
        flow(svg, "M" + ox + " " + oy + "L" + (ox + 45) + " " + (oy + 92), { color: C.cyan, dur: 1.8, count: 2, r: 3 });
        VZ.circ(svg, ox, oy, 6, { fill: C.gold });
        VZ.txt(svg, ox + 12, oy - 8, "时空点 P", { size: 11.5, fill: C.gold });
        VZ.txt(svg, ox - 96, oy - 96, "过 P 的所有光线（的集合）", { size: 10.5, fill: C.cyan });
        VZ.card(svg, 400, 24, 340, 178, { stroke: "rgba(255,255,255,.12)" });
        VZ.txt(svg, 416, 46, "扭量 = 光线", { size: 13.5, fill: C.cyan, weight: 700 });
        VZ.para(svg, 416, 66, "一条光线（方向 + 位置）→ 射影扭量空间 PT（复 3 维，第 15.6 节）里的一个点。", { size: 11.5, per: 27, lh: 17 });
        VZ.para(svg, 416, 106, "无质量粒子沿光线走 ⇒ 天然适合扭量描述；无质量场方程 → 层上同调；非线性引力子：完整（非线性）爱因斯坦方程可用扭量条件表达。", { size: 11.5, per: 27, lh: 17, fill: C.ink2 });
      } else {
        /* ---- 扭量观点 ---- */
        VZ.path(svg, "M40 110a170 88 0 0 0 340 0a170 88 0 0 0 -340 0", VZ.stroke({ stroke: C.violet, "stroke-width": 1.6, "stroke-dasharray": "7 5" }));
        VZ.txt(svg, 210, 40, "射影扭量空间 PT（复 3 维）", { size: 12, fill: C.violet, anchor: "middle", weight: 700 });
        var lp = "M110 150Q210 62 322 142";
        VZ.path(svg, lp, VZ.stroke({ stroke: C.cyan, "stroke-width": 2.2 }));
        flow(svg, lp, { color: C.cyan, dur: 2.6, count: 2, r: 3.5 });
        VZ.txt(svg, 210, 182, "L(P)：时空点 P 的光线族 = 一条线（黎曼球面）", { size: 10.5, fill: C.cyan, anchor: "middle" });
        VZ.circ(svg, 262, 96, 5, { fill: C.gold });
        VZ.txt(svg, 274, 94, "Z：一条光线", { size: 10.5, fill: C.gold });
        for (var di = 0; di < 5; di++) {
          VZ.circ(svg, 120 + di * 40, 132 - di * 6, 2.4, { fill: C.dim });
        }
        /* 对应关系 */
        VZ.card(svg, 400, 24, 340, 178, { stroke: "rgba(255,255,255,.12)" });
        VZ.txt(svg, 416, 46, "对应关系（双向）", { size: 13, fill: C.ink, weight: 700 });
        var dmd = "M470 116l30 -20l30 20l-30 20z";
        VZ.path(svg, dmd, VZ.stroke({ stroke: C.gold, "stroke-width": 1.6 }));
        VZ.circ(svg, 500, 116, 3.5, { fill: C.gold });
        VZ.txt(svg, 500, 152, "时空点 P", { size: 10.5, fill: C.gold, anchor: "middle" });
        VZ.path(svg, "M640 96a34 34 0 0 1 0 44", VZ.stroke({ stroke: C.cyan, "stroke-width": 1.6 }));
        VZ.txt(svg, 660, 124, "PT 中的线", { size: 10.5, fill: C.cyan, anchor: "middle" });
        VZ.ln(svg, 540, 110, 632, 100, { stroke: C.dim, "stroke-width": 1.1, "stroke-dasharray": "5 4" });
        VZ.ln(svg, 632, 132, 540, 124, { stroke: C.dim, "stroke-width": 1.1, "stroke-dasharray": "5 4" });
        VZ.txt(svg, 586, 94, "点 ↔ 线", { size: 10, fill: C.dim, anchor: "middle" });
        VZ.para(svg, 416, 166, "共形群 15 维；光线只依赖共形结构（角度），不依赖距离——时空点成为派生物。", { size: 11, per: 27, lh: 16, fill: C.ink2 });
      }
      bottomCards(svg);
    }
    render("时空观点：点 + 光锥");
  }
},

/* ==========================================================
   第 34 章 · 通向实在之路（全书地图 + 分类游戏）
   ========================================================== */
"f-ch34": {
  title: "通向实在之路：六个区域，一把判据，一场分类游戏",
  hint: "上面是全书的地图：六个区域走完，谜①（数学为何恰好合用）贯穿始终。下面做游戏：每个论断归入<b>实验事实 / 数学必然 / 审美判断</b>——这是 §34.3–34.4 那把尺子的练习：审美可以是发现的向导，但不能当作真理的凭证；对无新数据可查的理论，唯一判据是它依赖哪些尚未观测的假设。",
  draw: function (stage) {
    var W = 760, H = 214, svg = VZ.S(stage, W, H, {});
    var C = VZ.C;

    /* ---------- 六区域路径 ---------- */
    VZ.ln(svg, 40, 66, 560, 66, { stroke: C.faint, "stroke-width": 1.6 });
    var regions = ["一 两种真理", "二 复数", "三 流形·曲率", "四 时空", "五 量子", "六 量子引力"];
    regions.forEach(function (r, i) {
      var x = 70 + i * 88;
      VZ.circ(svg, x, 66, 5.5, { fill: C.deep, stroke: C.ink2, "stroke-width": 1.6 });
      VZ.txt(svg, x, 92, r, { size: 10.5, fill: C.ink2, anchor: "middle" });
    });
    flow(svg, "M40 66H560", { color: C.cyan, dur: 4.2, count: 2, r: 3.5 });
    VZ.path(svg, "M560 66h24", { stroke: C.faint, "stroke-width": 1.6 });
    VZ.card(svg, 592, 40, 148, 56, { stroke: C.gold, sw: 1.4, fill: "rgba(255,207,92,.06)" });
    VZ.para(svg, 604, 60, "★ 判据：审美可以是向导，不是凭证", { size: 10.5, per: 12, lh: 15, fill: C.gold, weight: 700 });

    /* ---------- 迷你三世界 ---------- */
    VZ.circ(svg, 120, 138, 17, { fill: "rgba(12,8,32,.9)", stroke: C.cyan, "stroke-width": 1.6 });
    VZ.txt(svg, 120, 136, "数学", { size: 9, fill: C.cyan, anchor: "middle" });
    VZ.txt(svg, 120, 146, "世界", { size: 9, fill: C.cyan, anchor: "middle" });
    VZ.circ(svg, 85, 182, 15, { fill: "rgba(12,8,32,.9)", stroke: C.gold, "stroke-width": 1.6 });
    VZ.txt(svg, 85, 186, "物理", { size: 9, fill: C.gold, anchor: "middle" });
    VZ.circ(svg, 158, 182, 15, { fill: "rgba(12,8,32,.9)", stroke: C.mag, "stroke-width": 1.6 });
    VZ.txt(svg, 158, 186, "心智", { size: 9, fill: C.mag, anchor: "middle" });
    VZ.ln(svg, 108, 152, 92, 169, { stroke: C.cyan, "stroke-width": 1.3 });
    VZ.circ(svg, 98, 160, 8, { fill: "rgba(10,6,28,.94)", stroke: C.cyan, "stroke-width": 1.2 });
    VZ.txt(svg, 98, 163.5, "①", { size: 9.5, fill: C.cyan, anchor: "middle" });
    VZ.ln(svg, 100, 182, 143, 182, { stroke: C.gold, "stroke-width": 1.1, "stroke-dasharray": "4 3", opacity: .6 });
    VZ.ln(svg, 153, 170, 128, 152, { stroke: C.mag, "stroke-width": 1.1, "stroke-dasharray": "4 3", opacity: .6 });
    VZ.para(svg, 196, 140, "谜①（数学为何恰好合用）贯穿全书；谜②③被明确留在书外——§34.7 回到它们的位置。", { size: 11, per: 22, lh: 16, fill: C.dim });
    VZ.card(svg, 440, 126, 300, 66, { stroke: "rgba(255,255,255,.12)" });
    VZ.para(svg, 456, 146, "20 世纪：相对论 · 量子力学 · 量子场论与标准模型——极其成功，也极其不完整（§34.1）；后半段越来越依赖数学一致性作为向导。", { size: 10.5, per: 27, lh: 15, fill: C.ink2 });

    /* ---------- 分类游戏（HTML） ---------- */
    var CATS = ["实验事实", "数学必然", "审美判断"];
    var CATC = [C.gold, C.cyan, C.mag];
    var QS = [
      { t: "量子电动力学的预言精度可达十位以上有效数字。", c: 0, w: "§26.9：可观测预言有限且精度惊人——这是实验事实。" },
      { t: "标准模型的参数（质量、混合角）要靠实验输入，理论本身导不出来。", c: 0, w: "§25.8 的缺口清单：这些数值目前只能测，不能推。" },
      { t: "自旋网络上，面积与体积算子具有离散谱。", c: 1, w: "§32.7：这是框架内的数学结果；跳到「自然必然如此」还需要额外论证。" },
      { t: "复幂级数的收敛半径等于到最近奇点的距离。", c: 1, w: "区域二的定理：一旦证明即永久成立，与观测无关。" },
      { t: "弦论的真空景观丰富，所以其中某个真空描述我们的宇宙。", c: 2, w: "§31.18：无观测证据；如果什么都有可能，就什么都预言不了。" },
      { t: "把光线当作几何的基本元素是自然的。", c: 2, w: "§33.14：自然性是信号，但作者对自己也只用同一把尺子——它不是证据。" }
    ];
    var ui = VZ.box(stage, "viz-ctl");
    var stBox = document.createElement("div");
    stBox.style.cssText = "padding:12px 14px;border:1px solid " + C.line + ";border-radius:10px;margin:10px 0;";
    ui.appendChild(stBox);
    var meta = document.createElement("div");
    meta.style.cssText = "font-size:12px;margin-bottom:6px;";
    stBox.appendChild(meta);
    var stmt = document.createElement("div");
    stmt.style.cssText = "font-size:15px;line-height:1.6;";
    stBox.appendChild(stmt);
    var row = document.createElement("div");
    row.style.cssText = "display:flex;gap:10px;margin:10px 0;";
    ui.appendChild(row);
    var fb = document.createElement("div");
    fb.style.cssText = "font-size:13px;line-height:1.6;min-height:40px;padding:8px 12px;border-radius:10px;border:1px solid " + C.faint + ";";
    ui.appendChild(fb);
    var nextBtn = VZ.btn(ui, "下一题 →", function () { idx = (idx + 1) % QS.length + (idx === QS.length - 1 ? 0 : 0); next(); });

    var idx = 0, score = 0, done = 0, locked = false;
    var btns = CATS.map(function (catName, ci) {
      var b = VZ.btn(row, catName, function () { answer(ci); });
      b.style.cssText = "flex:1;padding:9px 0;font-size:14px;border-radius:10px;cursor:pointer;border:1.5px solid " + CATC[ci] + ";background:rgba(255,255,255,.04);color:" + CATC[ci] + ";";
      return b;
    });
    function renderQ() {
      locked = false;
      meta.textContent = "第 " + (idx + 1) + " / " + QS.length + " 题 · 得分 " + score;
      meta.style.color = C.dim;
      stmt.textContent = "「" + QS[idx].t + "」——它属于哪一类？";
      stmt.style.color = C.ink;
      fb.textContent = "点击上方的分类按钮作答。";
      fb.style.color = C.dim;
      btns.forEach(function (b) { b.disabled = false; b.style.opacity = 1; });
    }
    function answer(ci) {
      if (locked) return;
      locked = true; done++;
      var q = QS[idx];
      var ok = ci === q.c;
      if (ok) score++;
      fb.innerHTML = (ok ? "✓ 判对了。" : "✗ 不是这一类。") + q.w + "（正确答案：" + CATS[q.c] + "）";
      fb.style.color = ok ? C.green : C.red;
      btns.forEach(function (b, bi) { b.disabled = true; b.style.opacity = bi === q.c ? 1 : .35; });
      if (idx === QS.length - 1) {
        setTimeout(function () {
          stmt.textContent = "游戏完成：得分 " + score + " / " + QS.length + "。" + (score >= 5 ? "你已经拿到了那把尺子。" : "再读一遍 §34.3–34.4：把数学陈述与关于自然的断言分开，把美与真分开。");
          stmt.style.color = C.gold;
        }, 600);
      }
    }
    function next() {
      if (idx < QS.length - 1) { idx++; renderQ(); }
      else { idx = 0; score = 0; done = 0; renderQ(); }
    }
    renderQ();
  }
}

});
