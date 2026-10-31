/* viz-part4.js — 第四批新图（ch13–ch18） */
VZ.define({

/* ==========================================================
   第 13 章 b · 群乘法表：点两个操作，看合成结果
   ========================================================== */
"f-ch13b": {
  title: "群乘法表：两个动作合成一个动作",
  hint: "正方形的 8 个对称动作构成一个群。点右侧乘法表的<b>任意一格</b>：行是先做的操作，列是后做的操作，格子给出合成后的那一个动作——左边的小方块会先走行操作、再走列操作，金色标记点跟着跑。试试「先转 90° 再翻转」和「先翻转再转 90°」是不是同一个动作？<span class='hl'>不相等——顺序有关系，这正是群的乘法一般不可交换。</span>",
  draw: function (stage) {
    var W = 760, H = 430, svg = VZ.S(stage, W, H, { grid: true });
    var C = VZ.C;

    /* 8 个操作：perm[i] = 原第 i 号角（A=0,B=1,C=2,D=3）去到的位置
       位置编号：0=左上 1=右上 2=右下 3=左下 */
    var ops = [
      { n: "e",    p: [0, 1, 2, 3], full: "不动（单位元）" },
      { n: "r",    p: [1, 2, 3, 0], full: "顺时针转 90°" },
      { n: "r²",   p: [2, 3, 0, 1], full: "转 180°" },
      { n: "r³",   p: [3, 0, 1, 2], full: "顺时针转 270°" },
      { n: "s",    p: [1, 0, 3, 2], full: "左右翻转" },
      { n: "rs",   p: [0, 3, 2, 1], full: "先转 90° 再翻转" },
      { n: "r²s",  p: [3, 2, 1, 0], full: "先转 180° 再翻转" },
      { n: "r³s",  p: [2, 1, 0, 3], full: "先转 270° 再翻转" }
    ];
    function apply(perm, op) { var out = []; for (var i = 0; i < 4; i++) out.push(op.p[perm[i]]); return out; }
    function nameOf(perm) {
      for (var k = 0; k < ops.length; k++) {
        var same = true;
        for (var i = 0; i < 4; i++) if (ops[k].p[i] !== perm[i]) same = false;
        if (same) return k;
      }
      return 0;
    }

    /* ---- 左边：正方形演示 ---- */
    var cx = 168, cy = 196, U = 62;
    var posOf = [[-1, -1], [1, -1], [1, 1], [-1, 1]];
    function xy(idx) { return [cx + posOf[idx][0] * U, cy + posOf[idx][1] * U]; }
    var gSq = VZ.g(svg);
    var sqPoly = VZ.poly(gSq, [xy(0), xy(1), xy(2), xy(3)], VZ.stroke({ stroke: C.ink, "stroke-width": 2 }));
    var cornerCols = [C.cyan, C.mag, C.gold, C.green];
    var cornerDots = [], cornerLabs = [];
    for (var i = 0; i < 4; i++) {
      cornerDots.push(VZ.circ(gSq, 0, 0, 5.5, { fill: cornerCols[i] }));
      cornerLabs.push(VZ.txt(gSq, 0, 0, "ABCD"[i], { size: 13, fill: cornerCols[i], anchor: "middle", weight: 700 }));
    }
    var trail = VZ.path(svg, "M0 0", VZ.stroke({ stroke: C.gold, "stroke-width": 2.4, opacity: .9, "stroke-dasharray": "1 0" }));
    var marker = VZ.circ(svg, 0, 0, 7, { fill: C.gold, stroke: C.deep, "stroke-width": 2 });
    VZ.txt(svg, cx, cy - U - 34, "正方形的 8 个对称动作", { size: 13.5, fill: C.ink, anchor: "middle", weight: 700 });
    var readout1 = VZ.txt(svg, cx, cy + U + 44, "", { size: 13, fill: C.gold, anchor: "middle", weight: 700 });

    /* ---- 右边：乘法表 ---- */
    var TX = 398, TY = 58, CS = 37;
    VZ.txt(svg, TX + 40, TY - 34, "乘法表（行 = 先做，列 = 后做）", { size: 13, fill: C.ink, weight: 700 });
    VZ.txt(svg, TX + 40 + 4 * CS, TY - 16, "后做 →", { size: 11, fill: C.dim, anchor: "middle" });
    var cellRects = [];
    var headFill = "rgba(255,255,255,.05)";
    for (var ri = 0; ri < 8; ri++) {
      for (var cj = 0; cj < 8; cj++) {
        (function (ri, cj) {
          var x = TX + cj * CS, y = TY + ri * CS;
          var comp = nameOf(apply(ops[ri].p, ops[cj]));
          var gg = VZ.g(svg, { style: "cursor:pointer" });
          var rc = VZ.el("rect", { x: x, y: y, width: CS - 2, height: CS - 2, rx: 5, fill: "rgba(255,255,255,.03)", stroke: C.faint, "stroke-width": .8 }, gg);
          VZ.txt(gg, x + CS / 2 - 1, y + CS / 2 + 4.5, ops[comp].n, { size: 11.5, fill: C.ink2, anchor: "middle" });
          gg.addEventListener("click", function () { select(ri, cj); });
          cellRects.push({ gg: gg, rc: rc, ri: ri, cj: cj, comp: comp });
        })(ri, cj);
      }
    }
    /* 行表头（先做） */
    for (var ri2 = 0; ri2 < 8; ri2++) {
      var hy = TY + ri2 * CS + CS / 2;
      VZ.txt(svg, TX - 10, hy + 4, ops[ri2].n, { size: 11.5, fill: C.dim, anchor: "end", weight: 700 });
      VZ.el("rect", { x: TX - 34, y: TY + ri2 * CS + 2, width: 4, height: CS - 6, rx: 2, fill: C.cyan, opacity: 0 }, svg).setAttribute("id", "rowbar" + ri2);
    }
    /* 列表头（后做） */
    for (var cj2 = 0; cj2 < 8; cj2++) {
      var hx = TX + cj2 * CS + CS / 2 - 1;
      VZ.txt(svg, hx, TY - 6, ops[cj2].n, { size: 11.5, fill: C.dim, anchor: "middle", weight: 700 });
      VZ.el("rect", { x: TX + cj2 * CS + 2, y: TY - 22, width: CS - 6, height: 4, rx: 2, fill: C.mag, opacity: 0 }, svg).setAttribute("id", "colbar" + cj2);
    }

    /* 动画状态 */
    var anim = null;
    function select(ri, cj) {
      var p1 = apply([0, 1, 2, 3], ops[ri]);
      var p2 = apply(p1, ops[cj]);
      /* 高亮 */
      for (var k = 0; k < cellRects.length; k++) {
        var c = cellRects[k], sel = (c.ri === ri && c.cj === cj);
        c.rc.setAttribute("fill", sel ? "rgba(255,207,92,.22)" : "rgba(255,255,255,.03)");
        c.rc.setAttribute("stroke", sel ? C.gold : C.faint);
        c.rc.setAttribute("stroke-width", sel ? 2 : .8);
        c.gg.querySelector("text").setAttribute("fill", sel ? C.gold : C.ink2);
      }
      for (var r2 = 0; r2 < 8; r2++) svg.querySelector("#rowbar" + r2).setAttribute("opacity", r2 === ri ? .9 : 0);
      for (var c2 = 0; c2 < 8; c2++) svg.querySelector("#colbar" + c2).setAttribute("opacity", c2 === cj ? .9 : 0);
      /* 轨迹：A 从单位元位置 → 行操作后 → 列操作后 */
      var a0 = xy(0), a1 = xy(p1[0]), a2 = xy(p2[0]);
      anim = { t0: performance.now(), p0: a0, p1: a1, p2: a2, done: false };
      /* 更新左边的方块为最终状态 */
      var pts = [];
      for (var i3 = 0; i3 < 4; i3++) pts.push(xy(p2[i3]));
      sqPoly.setAttribute("points", pts.map(function (q) { return q.join(" "); }).join(" "));
      for (var j3 = 0; j3 < 4; j3++) {
        cornerDots[j3].setAttribute("cx", pts[j3][0]); cornerDots[j3].setAttribute("cy", pts[j3][1]);
        cornerLabs[j3].setAttribute("x", pts[j3][0] + posOf[p2[j3]][0] * 16);
        cornerLabs[j3].setAttribute("y", pts[j3][1] + posOf[p2[j3]][1] * 16 + 4);
      }
      readout1.textContent = "合成结果：" + ops[nameOf(p2)].n + "（" + ops[nameOf(p2)].full + "）";
    }

    VZ.raf(svg, function () {
      if (!anim) return;
      var u = VZ.clamp((performance.now() - anim.t0) / 1600, 0, 1);
      var pt;
      if (u < .5) {
        var e1 = VZ.ease(u * 2);
        pt = [VZ.lerp(anim.p0[0], anim.p1[0], e1), VZ.lerp(anim.p0[1], anim.p1[1], e1)];
      } else {
        var e2 = VZ.ease((u - .5) * 2);
        pt = [VZ.lerp(anim.p1[0], anim.p2[0], e2), VZ.lerp(anim.p1[1], anim.p2[1], e2)];
      }
      marker.setAttribute("cx", pt[0]); marker.setAttribute("cy", pt[1]);
      trail.setAttribute("d", "M" + anim.p0.join(" ") + "L" + anim.p1.join(" ") + "L" + anim.p2.join(" "));
      trail.setAttribute("opacity", u < 1 ? .9 : .35);
    });

    select(1, 4);  /* 默认：先转 90°，再翻转 */
  }
},

/* ==========================================================
   第 13 章 c · 矩阵作用：拖矩阵元，看空间怎么被揉变形
   ========================================================== */
"f-ch13c": {
  title: "矩阵是一台变形机：正方形 → 平行四边形",
  hint: "拖动四个滑块改变 2×2 矩阵的矩阵元。看单位正方形被压成什么平行四边形；<b>行列式就是这个平行四边形的（带符号）面积</b>——负值说明空间被镜像翻转了。当两个特征值是实数时，图上会出现绿色的<b>特征方向</b>：沿这个方向的向量只被拉伸、不被掰弯。把矩阵调回 a=1,b=0,c=0,d=1 比一比。<span class='hl'>行列式为 0 时整个平面被压扁成一条线——变换不可逆。</span>",
  draw: function (stage) {
    var W = 760, H = 360, svg = VZ.S(stage, W, H, { grid: true });
    var C = VZ.C;
    var ox = 235, oy = 178, U = 40;
    var M = [1, 0, 0, 1];  /* a b c d */

    /* 坐标轴 */
    VZ.ln(svg, ox - 200, oy, ox + 200, oy, { stroke: C.faint, "stroke-width": 1 });
    VZ.ln(svg, ox, oy - 160, ox, oy + 160, { stroke: C.faint, "stroke-width": 1 });
    VZ.txt(svg, ox + 204, oy + 4, "x", { size: 11, fill: C.dim });
    VZ.txt(svg, ox + 6, oy - 164, "y", { size: 11, fill: C.dim });

    var arC = VZ.arrowDef(svg, VZ.uid("ar"), C.cyan);
    var arG = VZ.arrowDef(svg, VZ.uid("ar"), C.gold);
    var sqP = VZ.poly(svg, [[ox, oy], [ox + U, oy], [ox + U, oy - U], [ox, oy - U]], { fill: "rgba(79,227,240,.14)", stroke: C.cyan, "stroke-width": 1.6, "stroke-dasharray": "5 4" });
    var paP = VZ.poly(svg, [[ox, oy], [ox + U, oy], [ox + U, oy - U], [ox, oy - U]], { fill: "rgba(255,207,92,.20)", stroke: C.gold, "stroke-width": 2.2 });
    var vec1 = VZ.path(svg, "M0 0", VZ.stroke({ stroke: C.cyan, "stroke-width": 2, "marker-end": arC }));
    var vec2 = VZ.path(svg, "M0 0", VZ.stroke({ stroke: C.gold, "stroke-width": 2, "marker-end": arG }));
    var eig1 = VZ.path(svg, "M0 0", VZ.stroke({ stroke: C.green, "stroke-width": 2.2, opacity: .95 }));
    var eig2 = VZ.path(svg, "M0 0", VZ.stroke({ stroke: C.violet, "stroke-width": 2.2, opacity: .95 }));
    var eigL1 = VZ.txt(svg, 0, 0, "", { size: 11.5, fill: C.green, weight: 700 });
    var eigL2 = VZ.txt(svg, 0, 0, "", { size: 11.5, fill: C.violet, weight: 700 });
    var scaleNote = VZ.txt(svg, 20, 340, "", { size: 10.5, fill: C.dim });

    var panel = VZ.panel(stage, { "矩阵 M": "", "det M = 面积": "", "特征值": "", "特征方向": "" });
    var ctr = VZ.box(stage, "viz-ctl");
    var sliders = [];
    var names = ["a（xˆ→x 分量）", "b（yˆ→x 分量）", "c（xˆ→y 分量）", "d（yˆ→y 分量）"];
    for (var si = 0; si < 4; si++) {
      (function (i) {
        sliders.push(VZ.slider(ctr, { label: names[i], value: M[i], min: -2.5, max: 2.5, step: 0.05,
          format: function (v) { return v.toFixed(2); },
          onInput: function (v) { M[i] = v; redraw(); } }));
      })(si);
    }
    var row = VZ.box(stage, "viz-ctl");
    VZ.btn(row, "回到单位阵", function () { M = [1, 0, 0, 1]; sync(); redraw(); });
    VZ.btn(row, "纯旋转 90°", function () { M = [0, -1, 1, 0]; sync(); redraw(); });
    VZ.btn(row, "压扁（det=0）", function () { M = [1.4, 0.7, 2, 1]; sync(); redraw(); });
    VZ.btn(row, "镜像翻转", function () { M = [-1, 0, 0, 1]; sync(); redraw(); });

    function sync() { for (var i = 0; i < 4; i++) { sliders[i].input.value = M[i]; sliders[i].readout.textContent = M[i].toFixed(2); } }
    function toS(x, y) { return [ox + x * U * fit, oy - y * U * fit]; }
    var fit = 1;

    function redraw() {
      var a = M[0], b = M[1], c = M[2], d = M[3];
      /* e1=(1,0)→(a,c)，e2=(0,1)→(b,d) */
      var e1 = [a, c], e2 = [b, d];
      var quad = [[0, 0], e1, [a + b, c + d], e2];
      var ext = 0;
      quad.forEach(function (q) { ext = Math.max(ext, Math.abs(q[0]), Math.abs(q[1])); });
      fit = VZ.clamp(190 / (U * ext), 0.22, 1.6);
      var pts = quad.map(function (q) { return toS(q[0], q[1]); });
      paP.setAttribute("points", pts.map(function (q) { return q.join(" "); }).join(" "));
      var uq = [[0, 0], [1, 0], [1, 1], [0, 1]].map(function (q) { return toS(q[0], q[1]); });
      sqP.setAttribute("points", uq.map(function (q) { return q.join(" "); }).join(" "));
      var s1 = toS(e1[0], e1[1]), s2 = toS(e2[0], e2[1]);
      vec1.setAttribute("d", "M" + ox + " " + oy + "L" + s1[0] + " " + s1[1]);
      vec2.setAttribute("d", "M" + ox + " " + oy + "L" + s2[0] + " " + s2[1]);

      /* 特征值 / 特征方向 */
      var tr = a + d, det = a * d - b * c;
      var disc = tr * tr - 4 * det;
      if (disc >= 0 && !(Math.abs(det) < 1e-9 && Math.abs(tr) < 1e-9)) {
        var l1 = (tr + Math.sqrt(disc)) / 2, l2 = (tr - Math.sqrt(disc)) / 2;
        var dirs = [];
        [[l1, eig1, eigL1], [l2, eig2, eigL2]].forEach(function (pair) {
          var lam = pair[0], pl = pair[1], lb = pair[2];
          /* (a−λ)x + b y = 0 → 方向 (b, λ−a)，退化时用 (λ−d, c) */
          var vx = b, vy = lam - a;
          if (Math.abs(vx) < 1e-8 && Math.abs(vy) < 1e-8) { vx = lam - d; vy = c; }
          var n = Math.hypot(vx, vy);
          if (n < 1e-8) { pl.setAttribute("d", "M0 0"); lb.textContent = ""; return; }
          vx /= n; vy /= n;
          var L = 150;
          var pA = toS(vx * L / U / fit, vy * L / U / fit), pB = toS(-vx * L / U / fit, -vy * L / U / fit);
          pl.setAttribute("d", "M" + pB[0].toFixed(1) + " " + pB[1].toFixed(1) + "L" + pA[0].toFixed(1) + " " + pA[1].toFixed(1));
          pl.setAttribute("opacity", .95);
          lb.textContent = "λ=" + lam.toFixed(2);
          lb.setAttribute("x", pA[0] - 4); lb.setAttribute("y", pA[1] - 6);
          lb.setAttribute("opacity", 1);
          dirs.push(lam.toFixed(2));
        });
        VZ.setPanel(panel, { "矩阵 M": fmt(), "det M = 面积": det.toFixed(2) + (det < 0 ? "（定向翻转）" : ""), "特征值": l1.toFixed(2) + " 与 " + l2.toFixed(2), "特征方向": "两个实方向（绿色/紫色直线）" });
      } else {
        eig1.setAttribute("d", "M0 0"); eig2.setAttribute("d", "M0 0");
        eigL1.textContent = ""; eigL2.textContent = "";
        eigL1.setAttribute("opacity", 0); eigL2.setAttribute("opacity", 0);
        eig1.setAttribute("opacity", 0); eig2.setAttribute("opacity", 0);
        var re = tr / 2, im = Math.sqrt(Math.max(-disc, 0)) / 2;
        VZ.setPanel(panel, { "矩阵 M": fmt(), "det M = 面积": det.toFixed(2) + (det < 0 ? "（定向翻转）" : ""), "特征值": re.toFixed(2) + (im >= 0 ? " + " : " − ") + Math.abs(im).toFixed(2) + "i", "特征方向": "无实方向（含旋转成分）" });
      }
      scaleNote.textContent = "显示缩放 " + fit.toFixed(2) + "×";
    }
    function fmt() {
      return "[[" + M[0].toFixed(2) + ", " + M[1].toFixed(2) + "], [" + M[2].toFixed(2) + ", " + M[3].toFixed(2) + "]]";
    }
    redraw();
  }
},

/* ==========================================================
   第 14 章 b · 球面平行移动：绕纬线一圈，箭头转了 2πcosφ
   ========================================================== */
"f-ch14b": {
  title: "平行搬运一圈：球面记住了你走过的路",
  hint: "拖动滑块改变纬圈的<b>极角 φ</b>（离北极多远），看一支箭头被「始终平行于自己」地沿纬圈搬运。箭头转一圈回到出发点时，相对出发方向转过了 <b>2π·cosφ</b>：φ 小（北极附近）几乎转满一整圈，φ=90°（赤道）一点也不转。<span class='hl'>这条差角不是搬运规则出错，而是球面本身弯了——曲率就这样被「平行」暴露出来。</span>",
  draw: function (stage) {
    var W = 760, H = 400, svg = VZ.S(stage, W, H, { grid: true });
    var C = VZ.C;
    var cx = 240, cy = 208, R = 148, al = 0.42;  /* al：视线俯角（弧度） */

    /* 球轮廓与赤道 */
    VZ.circ(svg, cx, cy, R, { stroke: C.ink2, "stroke-width": 1.6, fill: "rgba(255,255,255,.03)" });
    function proj(phi, th) {
      var sx = cx + R * Math.sin(phi) * Math.cos(th);
      var sy = cy - R * (Math.cos(phi) * Math.cos(al) - Math.sin(phi) * Math.sin(al) * Math.sin(th));
      var front = Math.sin(phi) * Math.sin(al) * Math.sin(th) + Math.cos(phi) * Math.cos(al) >= 0;
      return [sx, sy, front];
    }
    var eqD = "";
    for (var i = 0; i <= 72; i++) {
      var th = i / 72 * 2 * Math.PI;
      var p = proj(Math.PI / 2, th);
      eqD += (i ? "L" : "M") + p[0].toFixed(1) + " " + p[1].toFixed(1);
    }
    VZ.path(svg, eqD, VZ.stroke({ stroke: C.faint, "stroke-width": 1.2 }));
    VZ.txt(svg, cx, cy + R + 26, "赤道（φ=90°）：转角 0", { size: 11, fill: C.dim, anchor: "middle" });
    /* 自转轴 */
    var np = proj(0.02, 0), sp = [cx, cy + R * Math.cos(al)];
    VZ.ln(svg, np[0], np[1] - 14, sp[0], sp[1] + 8, { stroke: C.faint, "stroke-width": 1, "stroke-dasharray": "3 4" });
    VZ.txt(svg, np[0] + 8, np[1] - 12, "N", { size: 11, fill: C.dim });

    /* 纬圈（随滑块重画） */
    var latG = VZ.g(svg);
    var latLab = VZ.txt(svg, 0, 0, "", { size: 11.5, fill: C.cyan });
    /* 箭头与参考方向 */
    var vecG = VZ.g(svg);
    var vecLn = VZ.path(vecG, "M0 0", VZ.stroke({ stroke: C.gold, "stroke-width": 2.6 }));
    var refLn = VZ.path(vecG, "M0 0", VZ.stroke({ stroke: C.dim, "stroke-width": 1.4, "stroke-dasharray": "4 4", opacity: .8 }));
    var dot = VZ.circ(svg, 0, 0, 6, { fill: C.gold, stroke: C.deep, "stroke-width": 1.5 });
    var trailP = VZ.path(svg, "M0 0", VZ.stroke({ stroke: C.gold, "stroke-width": 1.2, opacity: .45 }));

    var phi = 0.55;  /* 极角（弧度） */
    var panel = VZ.panel(stage, { "极角 φ": "", "纬度": "", "绕圈转角 2π·cosφ": "", "结论": "" });
    var ctl = VZ.box(stage, "viz-ctl");
    var slider = VZ.slider(ctl, { label: "极角 φ（0=北极，90°=赤道）", value: phi, min: 0.08, max: 1.5, step: 0.01,
      format: function (v) { return (v * 180 / Math.PI).toFixed(0) + "°"; },
      onInput: function (v) { phi = v; drawLat(); } });

    function drawLat() {
      latG.innerHTML = "";
      var a = R * Math.sin(phi), b = R * Math.sin(phi) * Math.sin(al), lcy = cy - R * Math.cos(phi) * Math.cos(al);
      var dF = "", dB = "";
      for (var i = 0; i <= 72; i++) {
        var th = i / 72 * 2 * Math.PI;
        var x = cx + a * Math.cos(th), y = lcy + b * Math.sin(th);
        var front = Math.sin(th) > 0;
        var seg = (front ? (dF ? "L" : "M") : (dB ? "L" : "M")) + x.toFixed(1) + " " + y.toFixed(1);
        if (front) dF += seg; else dB += seg;
      }
      VZ.path(latG, dB, VZ.stroke({ stroke: C.cyan, "stroke-width": 1.2, opacity: .4, "stroke-dasharray": "4 4" }));
      VZ.path(latG, dF, VZ.stroke({ stroke: C.cyan, "stroke-width": 1.8 }));
      latLab.setAttribute("x", cx + a + 10); latLab.setAttribute("y", lcy - 6);
      latLab.textContent = "纬圈 φ=" + (phi * 180 / Math.PI).toFixed(0) + "°";
      var ang = 2 * Math.PI * Math.cos(phi);
      VZ.setPanel(panel, {
        "极角 φ": (phi * 180 / Math.PI).toFixed(0) + "°",
        "纬度": (90 - phi * 180 / Math.PI).toFixed(0) + "°",
        "绕圈转角 2π·cosφ": (ang * 180 / Math.PI).toFixed(1) + "°",
        "结论": Math.abs(ang) < 0.05 ? "赤道附近：几乎不转" : (Math.abs(ang - 2 * Math.PI) < 0.05 ? "北极附近：几乎转满一圈" : "差角 = 围住的那块球面弯了多少")
      });
    }
    drawLat();

    /* 箭头沿纬圈运动：方向 = 当地切向 + 累计差角 */
    var t0 = performance.now();
    VZ.raf(svg, function () {
      var T = (performance.now() - t0) / 1000;
      var th = (T * 0.6) % (2 * Math.PI);
      var a = R * Math.sin(phi), b = R * Math.sin(phi) * Math.sin(al), lcy = cy - R * Math.cos(phi) * Math.cos(al);
      var x = cx + a * Math.cos(th), y = lcy + b * Math.sin(th);
      /* 椭圆切向 */
      var tx = -a * Math.sin(th), ty = b * Math.cos(th);
      var tang = Math.atan2(ty, tx);
      /* 累计转角（相对出发方向差 drift = th·cosφ） */
      var drift = th * Math.cos(phi);
      var ang = tang + drift;
      var L = 46;
      vecLn.setAttribute("d", "M" + x.toFixed(1) + " " + y.toFixed(1) + "L" + (x + L * Math.cos(ang)).toFixed(1) + " " + (y + L * Math.sin(ang)).toFixed(1));
      refLn.setAttribute("d", "M" + x.toFixed(1) + " " + y.toFixed(1) + "L" + (x + L * Math.cos(tang)).toFixed(1) + " " + (y + L * Math.sin(tang)).toFixed(1));
      dot.setAttribute("cx", x); dot.setAttribute("cy", y);
      /* 轨迹（只画当前一圈） */
      var d = "";
      for (var i = 0; i <= 72; i++) {
        var u = th * i / 72;
        var xx = cx + a * Math.cos(u), yy = lcy + b * Math.sin(u);
        d += (i ? "L" : "M") + xx.toFixed(1) + " " + yy.toFixed(1);
      }
      trailP.setAttribute("d", d);
      trailP.setAttribute("opacity", .3);
    });
  }
},

/* ==========================================================
   第 14 章 c · 测地线：拖两个点，看球面上的「直线」
   ========================================================== */
"f-ch14c": {
  title: "球面上的直线是大圆：拖两个点试试",
  hint: "拖动<b>青色与金色两个手柄</b>（它们钉在球面上），过两点的测地线——大圆——实时重画。正面是实线，转到球背面的是虚线。无论你把两点拖到哪里，这条线总是球面上能画出的最大圆：飞机航线走北极附近的大弧而不是贴着地图直线，就是这个原因。<span class='hl'>测地线 = 自己始终平行于自己的曲线；在球面上，它把「直线」的概念让给了大圆。</span>",
  draw: function (stage) {
    var W = 760, H = 400, svg = VZ.S(stage, W, H, { grid: true });
    var C = VZ.C;
    var cx = 270, cy = 202, R = 152, al = 0.45;

    function proj(P) {
      return [cx + P[0] * R, cy - (P[2] * Math.cos(al) - P[1] * Math.sin(al)) * R];
    }
    function front(P) { return P[1] * Math.sin(al) + P[2] * Math.cos(al) >= 0; }
    function unproj(sx, sy) {
      var X = VZ.clamp((sx - cx) / R, -0.98, 0.98);
      var U = VZ.clamp((cy - sy) / R, -0.98, 0.98);
      var len = Math.hypot(X, U);
      if (len > 0.999) { X *= 0.999 / len; U *= 0.999 / len; }
      var Wv = Math.sqrt(Math.max(1 - X * X - U * U, 0.001));
      return [X, Wv * Math.cos(al) - U * Math.sin(al), U * Math.cos(al) + Wv * Math.sin(al)];
    }
    function norm(v) { var n = Math.hypot(v[0], v[1], v[2]); return [v[0] / n, v[1] / n, v[2] / n]; }
    function cross(a, b) { return [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]]; }

    /* 球轮廓 + 赤道参考 */
    VZ.circ(svg, cx, cy, R, { stroke: C.ink2, "stroke-width": 1.6, fill: "rgba(255,255,255,.03)" });
    var eqF = "", eqB = "";
    for (var i = 0; i <= 96; i++) {
      var th = i / 96 * 2 * Math.PI;
      var P = [Math.cos(th), Math.sin(th), 0];
      var s = proj(P);
      if (front(P)) eqF += (eqF ? "L" : "M") + s[0].toFixed(1) + " " + s[1].toFixed(1);
      else eqB += (eqB ? "L" : "M") + s[0].toFixed(1) + " " + s[1].toFixed(1);
    }
    VZ.path(svg, eqB, VZ.stroke({ stroke: C.faint, "stroke-width": 1, "stroke-dasharray": "4 4" }));
    VZ.path(svg, eqF, VZ.stroke({ stroke: C.faint, "stroke-width": 1.1 }));
    VZ.txt(svg, cx, cy + R + 24, "灰色：赤道（一条现成的大圆）", { size: 11, fill: C.dim, anchor: "middle" });

    var gcF = VZ.path(svg, "M0 0", VZ.stroke({ stroke: C.cyan, "stroke-width": 2.4 }));
    var gcB = VZ.path(svg, "M0 0", VZ.stroke({ stroke: C.cyan, "stroke-width": 1.3, "stroke-dasharray": "5 5", opacity: .5 }));
    var chord = VZ.path(svg, "M0 0", VZ.stroke({ stroke: C.dim, "stroke-width": 1, "stroke-dasharray": "2 4", opacity: .7 }));

    var pts = [norm([0.55, 0.35, 0.75]), norm([0.72, -0.55, 0.35])];
    var handles = [];
    [C.cyan, C.gold].forEach(function (col, k) {
      var h = VZ.g(svg);
      VZ.circ(h, 0, 0, 15, { fill: col, opacity: .16 });
      var dcore = VZ.circ(h, 0, 0, 7, { fill: col, stroke: C.deep, "stroke-width": 1.6 });
      handles.push({ g: h, col: col, core: dcore, lab: null });
      VZ.drag(svg, h, W, H, function (x, y, ph) {
        if (ph === "start" || ph === "move") { pts[k] = unproj(x, y); redraw(); }
      });
    });
    var labA = VZ.txt(svg, 0, 0, "起点 A", { size: 11.5, fill: C.cyan, weight: 700 });
    var labB = VZ.txt(svg, 0, 0, "终点 B", { size: 11.5, fill: C.gold, weight: 700 });
    handles[0].lab = labA; handles[1].lab = labB;

    var panel = VZ.panel(stage, { "A（经度, 纬度）": "", "B（经度, 纬度）": "", "两点夹角（球面距）": "", "提醒": "" });

    function redraw() {
      var A = pts[0], B = pts[1];
      var n = cross(A, B);
      var nn = Math.hypot(n[0], n[1], n[2]);
      var dF = "", dB = "";
      if (nn > 1e-6) {
        var v = norm(cross(norm(n), A));
        for (var i = 0; i <= 120; i++) {
          var th = i / 120 * 2 * Math.PI;
          var P = norm([A[0] * Math.cos(th) + v[0] * Math.sin(th), A[1] * Math.cos(th) + v[1] * Math.sin(th), A[2] * Math.cos(th) + v[2] * Math.sin(th)]);
          var s = proj(P);
          if (front(P)) dF += (dF ? "L" : "M") + s[0].toFixed(1) + " " + s[1].toFixed(1);
          else dB += (dB ? "L" : "M") + s[0].toFixed(1) + " " + s[1].toFixed(1);
        }
      }
      gcF.setAttribute("d", dF || "M0 0"); gcB.setAttribute("d", dB || "M0 0");
      var sA = proj(A), sB = proj(B);
      chord.setAttribute("d", "M" + sA[0].toFixed(1) + " " + sA[1].toFixed(1) + "L" + sB[0].toFixed(1) + " " + sB[1].toFixed(1));
      handles.forEach(function (h, k) {
        var s = proj(pts[k]);
        h.g.setAttribute("transform", "translate(" + s[0] + "," + s[1] + ")");
        h.lab.setAttribute("x", s[0] + (k === 0 ? -20 : 12)); h.lab.setAttribute("y", s[1] - 14);
      });
      function ll(P) {
        var lat = Math.asin(VZ.clamp(P[2], -1, 1)) * 180 / Math.PI;
        var lon = Math.atan2(P[1], P[0]) * 180 / Math.PI;
        return lon.toFixed(0) + "°, " + lat.toFixed(0) + "°";
      }
      var dot = VZ.clamp(A[0] * B[0] + A[1] * B[1] + A[2] * B[2], -1, 1);
      VZ.setPanel(panel, {
        "A（经度, 纬度）": ll(A), "B（经度, 纬度）": ll(B),
        "两点夹角（球面距）": (Math.acos(dot) * 180 / Math.PI).toFixed(1) + "°",
        "提醒": nn < 1e-6 ? "对径点：有无穷多大圆通过" : "实线在正面，虚线绕到背面"
      });
    }
    redraw();

    /* 一粒光点沿大圆巡游 */
    var runDot = VZ.circ(svg, 0, 0, 4.5, { fill: C.cyan, opacity: .95 });
    var t0 = performance.now();
    VZ.raf(svg, function () {
      var T = (performance.now() - t0) / 1000;
      var A = pts[0], B = pts[1];
      var n = cross(A, B);
      if (Math.hypot(n[0], n[1], n[2]) < 1e-6) { runDot.setAttribute("opacity", 0); return; }
      var v = norm(cross(norm(n), A));
      var th = (T * 0.9) % (2 * Math.PI);
      var P = norm([A[0] * Math.cos(th) + v[0] * Math.sin(th), A[1] * Math.cos(th) + v[1] * Math.sin(th), A[2] * Math.cos(th) + v[2] * Math.sin(th)]);
      var s = proj(P);
      runDot.setAttribute("cx", s[0]); runDot.setAttribute("cy", s[1]);
      runDot.setAttribute("opacity", front(P) ? .95 : .3);
    });
  }
},

/* ==========================================================
   第 15 章 b · 莫比乌斯带：蚂蚁绕两圈才回到家
   ========================================================== */
"f-ch15b": {
  title: "莫比乌斯带：一只蚂蚁绕两圈才回到家",
  hint: "一只蚂蚁沿带子中线出发（金色）。<b>绕一整圈</b>它回到了出发点的正上方——却发现自己在「另一面」（变青色），连脚下的法向都翻了个方向；<b>再绕一圈</b>才真正回到起点。拖速度滑块、点「重新出发」反复看。<span class='hl'>这个面没有正面反面之分——「侧面」要绕两圈才定义得出来，这就是不可定向曲面。</span>",
  draw: function (stage) {
    var W = 760, H = 400, svg = VZ.S(stage, W, H, { grid: true });
    var C = VZ.C;
    var cx = 380, cy = 205, R = 100, w2 = 46;

    /* 世界坐标 → 屏幕（斜投影） */
    function prj(P) { return [cx + P[0] - P[1] * 0.30, cy - P[2] * 0.95 + P[1] * 0.40]; }
    function bandPt(t, u) {
      var rr = R + u * w2 * Math.cos(t / 2);
      return [rr * Math.cos(t), rr * Math.sin(t), u * w2 * Math.sin(t / 2)];
    }

    /* 静态画带子：按深度排序的四边形片段 */
    (function drawBand() {
      var segs = [];
      var N = 84;
      for (var i = 0; i < N; i++) {
        var t0 = i / N * 2 * Math.PI, t1 = (i + 1) / N * 2 * Math.PI;
        var c = bandPt((t0 + t1) / 2, 0);
        segs.push({ i: i, depth: c[1], c: c, t: (t0 + t1) / 2 });
      }
      segs.sort(function (a, b) { return b.depth - a.depth; });
      var bandG = VZ.g(svg);
      segs.forEach(function (s) {
        var q = [bandPt(s.i / N * 2 * Math.PI, -1), bandPt((s.i + 1) / N * 2 * Math.PI, -1),
                 bandPt((s.i + 1) / N * 2 * Math.PI, 1), bandPt(s.i / N * 2 * Math.PI, 1)];
        var sp = q.map(prj);
        /* 屏幕定向决定看到的“面” */
        var area = (sp[1][0] - sp[0][0]) * (sp[1][1] + sp[0][1]) +
                   (sp[2][0] - sp[1][0]) * (sp[2][1] + sp[1][1]) +
                   (sp[3][0] - sp[2][0]) * (sp[3][1] + sp[2][1]) +
                   (sp[0][0] - sp[3][0]) * (sp[0][1] + sp[3][1]);
        var front = area < 0;
        var fill = front ? "rgba(255,207,92,.34)" : "rgba(79,227,240,.30)";
        var edge = front ? "rgba(255,207,92,.85)" : "rgba(79,227,240,.8)";
        VZ.poly(bandG, sp, { fill: fill, stroke: edge, "stroke-width": .8 });
      });
      /* 中线 */
      var d = "";
      for (var k = 0; k <= 120; k++) {
        var tt = k / 120 * 2 * Math.PI;
        var p = prj(bandPt(tt, 0));
        d += (k ? "L" : "M") + p[0].toFixed(1) + " " + p[1].toFixed(1);
      }
      VZ.path(bandG, d, VZ.stroke({ stroke: C.ink2, "stroke-width": 1, "stroke-dasharray": "3 4", opacity: .6 }));
    })();

    /* 蚂蚁与法向箭头 */
    var arN = VZ.arrowDef(svg, VZ.uid("ar"), C.green);
    var ant = VZ.circ(svg, 0, 0, 7, { fill: C.gold, stroke: C.deep, "stroke-width": 2 });
    var nrm = VZ.path(svg, "M0 0", VZ.stroke({ stroke: C.green, "stroke-width": 2, "marker-end": arN }));
    var trail = VZ.path(svg, "M0 0", VZ.stroke({ stroke: C.gold, "stroke-width": 1.6, opacity: .55 }));
    var trailPts = [];

    var panel = VZ.panel(stage, { "圈数进度": "", "蚂蚁在": "", "法向": "", "回到原位需要": "" });
    var ctl = VZ.box(stage, "viz-ctl");
    var speed = 1.1;
    VZ.slider(ctl, { label: "爬行速度", value: speed, min: 0.2, max: 3, step: 0.1,
      format: function (v) { return v.toFixed(1) + "×"; }, onInput: function (v) { speed = v; } });
    var btnRow = VZ.box(stage, "viz-ctl");
    var paused = false;
    VZ.btn(btnRow, "暂停 / 继续", function () { paused = !paused; });
    VZ.btn(btnRow, "重新出发", function () { prog = 0; trailPts = []; trail.setAttribute("d", "M0 0"); });

    var prog = 0;  /* 0..2（单位：圈） */
    var last = performance.now();
    VZ.raf(svg, function () {
      var now = performance.now();
      if (!paused) prog = (prog + (now - last) / 1000 * speed / 6) % 2;
      last = now;
      var t = prog * 2 * Math.PI;
      var u = prog < 1 ? 0.93 : -0.93;
      var P = bandPt(t, u);
      var s = prj(P);
      ant.setAttribute("cx", s[0]); ant.setAttribute("cy", s[1]);
      ant.setAttribute("fill", prog < 1 ? C.gold : C.cyan);
      /* 法向 u 方向 */
      var nP = [Math.cos(t / 2) * Math.cos(t), Math.cos(t / 2) * Math.sin(t), Math.sin(t / 2)];
      var s2 = prj([P[0] + nP[0] * 30, P[1] + nP[1] * 30, P[2] + nP[2] * 30]);
      nrm.setAttribute("d", "M" + s[0].toFixed(1) + " " + s[1].toFixed(1) + "L" + s2[0].toFixed(1) + " " + s2[1].toFixed(1));
      nrm.setAttribute("opacity", .9);
      /* 轨迹 */
      trailPts.push(s);
      if (trailPts.length > 150) trailPts.shift();
      var d = "";
      trailPts.forEach(function (q, i) { d += (i ? "L" : "M") + q[0].toFixed(1) + " " + q[1].toFixed(1); });
      trail.setAttribute("d", d || "M0 0");
      trail.setAttribute("stroke", prog < 1 ? C.gold : C.cyan);
      var lap = prog < 1 ? "第 1 圈（" + (prog * 100).toFixed(0) + "%）" : "第 2 圈（" + ((prog - 1) * 100).toFixed(0) + "%）";
      VZ.setPanel(panel, {
        "圈数进度": lap,
        "蚂蚁在": prog < 1 ? "出发的那一面（金）" : (Math.abs(prog - 1) < 0.02 ? "刚翻到另一面（青）" : "另一面（青）"),
        "法向": Math.cos(t / 2) >= 0 ? "指向上方" : "已经翻转",
        "回到原位需要": "两圈 —— 单侧曲面"
      });
    });
  }
},

/* ==========================================================
   第 15 章 c · 联络与和乐：绕一圈回来，差一个角
   ========================================================== */
"f-ch15c": {
  title: "和乐：矢量绕丛上一圈，回来差一个角",
  hint: "拖<b>曲率 K</b> 与<b>回路半径 r</b> 两个滑块，看金色矢量被平行搬运绕圆一圈。空间平了（K=0）它原样回家；空间弯了，它回来时转过 <b>Δθ = K·面积 = K·πr²</b>——右下小表盘实时累计这个角。傅科摆绕地球一圈差的就是这类角。<span class='hl'>「差角」是曲率的直接读数：和乐把看不见的联络变成了看得见的转动。</span>",
  draw: function (stage) {
    var W = 760, H = 400, svg = VZ.S(stage, W, H, { grid: true });
    var C = VZ.C;
    var ox = 300, oy = 195;

    var ring = VZ.circ(svg, ox, oy, 70, { stroke: C.cyan, "stroke-width": 2 });
    var ringLab = VZ.txt(svg, ox, oy - 96, "", { size: 12, fill: C.cyan, anchor: "middle" });
    /* 参考方向（初始方向，竖直向上） */
    var refLn = VZ.ln(svg, ox, oy, ox, oy - 150, { stroke: C.dim, "stroke-width": 1.2, "stroke-dasharray": "5 5" });
    VZ.txt(svg, ox + 6, oy - 152, "出发方向", { size: 11, fill: C.dim });
    var vecLn = VZ.path(svg, "M0 0", VZ.stroke({ stroke: C.gold, "stroke-width": 2.8 }));
    var dot = VZ.circ(svg, ox, oy - 70, 6, { fill: C.gold, stroke: C.deep, "stroke-width": 1.5 });
    var glow = VZ.circ(svg, ox, oy - 70, 10, { fill: C.gold, opacity: 0 });

    /* 右下小表盘：累计差角 */
    var dx = 648, dy = 300, dr = 52;
    VZ.circ(svg, dx, dy, dr, { stroke: C.faint, "stroke-width": 1.2, fill: "rgba(255,255,255,.04)" });
    [0, 90, 180, 270].forEach(function (a) {
      var r1 = a * Math.PI / 180;
      VZ.ln(svg, dx + (dr - 8) * Math.sin(r1), dy - (dr - 8) * Math.cos(r1), dx + dr * Math.sin(r1), dy - dr * Math.cos(r1), { stroke: C.dim, "stroke-width": 1 });
    });
    VZ.txt(svg, dx, dy - dr - 8, "累计差角", { size: 11, fill: C.dim, anchor: "middle" });
    var needle = VZ.ln(svg, dx, dy, dx, dy - dr + 8, { stroke: C.gold, "stroke-width": 2.4 });
    var dialVal = VZ.txt(svg, dx, dy + 22, "", { size: 12, fill: C.gold, anchor: "middle", weight: 700 });

    /* 曲面剖面小图（随 K 变） */
    var secG = VZ.g(svg);
    var secLab = VZ.txt(svg, 0, 0, "", { size: 11.5, fill: C.ink2, anchor: "middle" });

    var K = 0.5, r = 70;
    var panel = VZ.panel(stage, { "曲率 K": "", "回路半径 r": "", "围住面积 πr²": "", "和乐差角 Δθ = K·A": "" });
    var ctl = VZ.box(stage, "viz-ctl");
    VZ.slider(ctl, { label: "曲率 K（−1 鞍点 ～ +1 球面）", value: K, min: -1, max: 1, step: 0.02,
      format: function (v) { return v.toFixed(2); }, onInput: function (v) { K = v; upd(); } });
    VZ.slider(ctl, { label: "回路半径 r", value: r, min: 24, max: 96, step: 1,
      format: function (v) { return v.toFixed(0) + " px"; }, onInput: function (v) { r = v; upd(); } });

    function upd() {
      ring.setAttribute("r", r);
      ringLab.textContent = "回路 r=" + r.toFixed(0);
      ringLab.setAttribute("y", oy - r - 14);
      /* 剖面：K>0 拱、K=0 平、K<0 鞍 */
      secG.innerHTML = "";
      var sx = 648, sy2 = 150, half = 56;
      var d = "M" + (sx - half) + " " + sy2;
      for (var i = 0; i <= 24; i++) {
        var u = -1 + 2 * i / 24;
        var z = -K * u * u * 26;
        d += "L" + (sx + u * half).toFixed(1) + " " + (sy2 + z).toFixed(1);
      }
      VZ.path(secG, d, VZ.stroke({ stroke: C.violet, "stroke-width": 2 }));
      VZ.ln(secG, sx - half - 6, sy2 + 14, sx + half + 6, sy2 + 14, { stroke: C.faint, "stroke-width": 1, "stroke-dasharray": "3 3" });
      secLab.setAttribute("x", sx); secLab.setAttribute("y", sy2 - 44 - K * 26);
      secLab.textContent = K > 0.05 ? "球面状（正曲率）" : K < -0.05 ? "马鞍状（负曲率）" : "平的";
      var A = Math.PI * (r / 100) * (r / 100) * 100;  /* 以 px² 计，r 单位 px */
      var dth = K * Math.PI * Math.pow(r / 100, 2) * 2;  /* 展示尺度：K=1,r=100px → 2π */
      VZ.setPanel(panel, {
        "曲率 K": K.toFixed(2),
        "回路半径 r": r.toFixed(0),
        "围住面积 πr²": (Math.PI * r * r).toFixed(0) + " px²",
        "和乐差角 Δθ = K·A": (dth * 180 / Math.PI).toFixed(1) + "°"
      });
    }
    upd();

    /* 矢量沿回路运动：转角 = K·A·(θ/2π) */
    var t0 = performance.now();
    var lapStart = 0, flashed = false;
    VZ.raf(svg, function () {
      var T = (performance.now() - t0) / 1000;
      var th = (T * 0.7) % (2 * Math.PI);
      var x = ox + r * Math.cos(th - Math.PI / 2), y = oy + r * Math.sin(th - Math.PI / 2);
      dot.setAttribute("cx", x); dot.setAttribute("cy", y);
      var A2 = Math.PI * Math.pow(r / 100, 2);
      var drift = K * A2 * th;  /* 与 panel 同尺度：整圈 = K·πr²·2/100²? 保持一致 */
      drift = K * Math.PI * Math.pow(r / 100, 2) * 2 * (th / (2 * Math.PI));
      var L = 52;
      vecLn.setAttribute("d", "M" + x.toFixed(1) + " " + y.toFixed(1) +
        "L" + (x + L * Math.sin(drift)).toFixed(1) + " " + (y - L * Math.cos(drift)).toFixed(1));
      /* 表盘 */
      var full = K * Math.PI * Math.pow(r / 100, 2) * 2;
      var acc = full * (th / (2 * Math.PI));
      needle.setAttribute("x2", dx + (dr - 10) * Math.sin(acc)); needle.setAttribute("y2", dy - (dr - 10) * Math.cos(acc));
      dialVal.textContent = ((acc * 180 / Math.PI) % 360).toFixed(0) + "°";
      /* 回到出发点的瞬间闪光 */
      if (th < 0.08 && !flashed) {
        flashed = true;
        glow.setAttribute("cx", x); glow.setAttribute("cy", y); glow.setAttribute("opacity", .5);
        var g0 = performance.now();
        var fade = function () {
          var u2 = (performance.now() - g0) / 600;
          if (u2 >= 1) glow.setAttribute("opacity", 0);
          else { glow.setAttribute("opacity", .5 * (1 - u2)); requestAnimationFrame(fade); }
        };
        requestAnimationFrame(fade);
      }
      if (th > 0.3) flashed = false;
    });
  }
},

/* ==========================================================
   第 16 章 b · 康托对角线：逐位挖出一个漏网之数
   ========================================================== */
"f-ch16b": {
  title: "康托对角线：亲手造一个不在列表里的数",
  hint: "点<b>「下一步」</b>（或开自动播放）：第 k 步盯住列表第 k 行的第 k 位（红圈），把它改成别的数字，填进底部新数 y 的第 k 位。走完 6 步你会发现：y 与列表里<b>每一个</b>数都至少有一位不同——不管列表多长、哪怕已列出无穷多个实数。<span class='hl'>实数不可能被一一列全：这就是「不可数」。</span>",
  draw: function (stage) {
    var W = 760, H = 380, svg = VZ.S(stage, W, H, { grid: true });
    var C = VZ.C;
    var rows = [
      { n: "x₁", src: "π/10",   d: "314159265358" },
      { n: "x₂", src: "e/10",   d: "271828182845" },
      { n: "x₃", src: "√2/10",  d: "141421356237" },
      { n: "x₄", src: "(φ−1)",  d: "618033988749" },
      { n: "x₅", src: "ln2",    d: "693147180559" },
      { n: "x₆", src: "γ",      d: "577215664901" }
    ];
    var N = rows.length, D = 12;
    var X0 = 118, Y0 = 74, CW = 40, RH = 32;

    VZ.txt(svg, X0, Y0 - 26, "假设有人宣称：下面这张表列出了 [0,1] 里的全部实数", { size: 13, fill: C.ink, weight: 700 });
    VZ.txt(svg, X0 + 34, Y0 + 8, "0.", { size: 13, fill: C.dim });
    for (var j = 0; j < D; j++) VZ.txt(svg, X0 + 62 + j * CW, Y0 + 8, "第" + (j + 1) + "位", { size: 9.5, fill: C.dim, anchor: "middle" });

    var cellEls = [];
    rows.forEach(function (r, i) {
      var y = Y0 + 40 + i * RH;
      VZ.txt(svg, X0 - 12, y + 5, r.n, { size: 12.5, fill: C.ink2, anchor: "end", weight: 700 });
      VZ.txt(svg, X0 - 12, y + 18, r.src, { size: 9, fill: C.dim, anchor: "end" });
      VZ.txt(svg, X0 + 34, y + 5, "0.", { size: 13, fill: C.dim });
      var line = [];
      for (var j = 0; j < D; j++) {
        var t = VZ.txt(svg, X0 + 62 + j * CW, y + 5, r.d[j], { size: 13.5, fill: C.ink2, anchor: "middle" });
        line.push(t);
      }
      cellEls.push(line);
    });

    /* 底部：正在构造的 y */
    var yRow = Y0 + 40 + N * RH + 34;
    VZ.ln(svg, X0 - 40, yRow - 22, X0 + 52 + D * CW, yRow - 22, { stroke: C.faint, "stroke-width": 1 });
    VZ.txt(svg, X0 - 12, yRow + 5, "y", { size: 13.5, fill: C.gold, anchor: "end", weight: 700 });
    VZ.txt(svg, X0 + 34, yRow + 5, "0.", { size: 13, fill: C.dim });
    var yCells = [];
    for (var j2 = 0; j2 < D; j2++) {
      yCells.push(VZ.txt(svg, X0 + 62 + j2 * CW, yRow + 5, "·", { size: 13.5, fill: C.gold, anchor: "middle", weight: 700 }));
    }
    var yRing = VZ.circ(svg, 0, 0, 12, { fill: "none", stroke: C.red, "stroke-width": 2.2 });
    yRing.setAttribute("opacity", 0);

    var msg = VZ.txt(svg, X0, yRow + 44, "点「下一步」开始", { size: 13.5, fill: C.ink, weight: 700 });
    var sub = VZ.txt(svg, X0, yRow + 66, "", { size: 11.5, fill: C.dim });

    var ctl = VZ.box(stage, "viz-ctl");
    var step = 0, auto = null;
    function setStep(k) {
      step = k;
      yRing.setAttribute("opacity", 0);
      rows.forEach(function (r, i) {
        cellEls[i].forEach(function (t, j) {
          var onDiag = (j === i && i < k);
          t.setAttribute("fill", onDiag ? C.red : (i < k ? C.faint : C.ink2));
          t.setAttribute("font-weight", onDiag ? 700 : 400);
        });
      });
      yCells.forEach(function (t, j) {
        if (j < k) {
          var d = (parseInt(rows[j].d[j], 10) + 1) % 10;
          t.textContent = String(d);
          t.setAttribute("fill", C.gold);
        } else { t.textContent = "·"; t.setAttribute("fill", C.gold); }
      });
      if (k > 0 && k <= N) {
        var t2 = cellEls[k - 1][k - 1];
        yRing.setAttribute("cx", X0 + 62 + (k - 1) * CW);
        yRing.setAttribute("cy", Y0 + 40 + (k - 1) * RH - 1);
        yRing.setAttribute("opacity", 1);
        var d2 = parseInt(rows[k - 1].d[k - 1], 10);
        msg.textContent = "第 " + k + " 步：第 " + k + " 行第 " + k + " 位是 " + d2 + " → 把 y 的第 " + k + " 位定为 " + ((d2 + 1) % 10);
        sub.textContent = "y 与 x" + "₁₂₃₄₅₆"[k - 1] + " 在第 " + k + " 位必然不同";
      }
      if (k > N) {
        msg.textContent = "y = 0." + yCells.map(function (t) { return t.textContent; }).join("") + "：它与表中每一个数都不同！";
        sub.textContent = "所以任何列表都漏掉实数——[0,1] 不可数。反过来（用二进制）也能造出超越数。";
      }
    }
    function next() { if (step <= N) setStep(step + 1); }
    VZ.btn(ctl, "下一步", next);
    VZ.btn(ctl, "重来", function () { stopAuto(); setStep(0); });
    var autoBtn = VZ.btn(ctl, "自动播放", function () {
      if (auto) { stopAuto(); return; }
      setStep(0);
      autoBtn.textContent = "停止自动";
      auto = setInterval(function () {
        if (step > N) { stopAuto(); return; }
        next();
      }, 1100);
    });
    function stopAuto() { if (auto) { clearInterval(auto); auto = null; autoBtn.textContent = "自动播放"; } }
    setStep(0);
  }
},

/* ==========================================================
   第 16 章 c · 模 p 乘法表：逆元何时存在
   ========================================================== */
"f-ch16c": {
  title: "模 p 时钟算术：什么时候人人都有逆元",
  hint: "拖滑块换模数 p，表里是 a×b mod p 的结果（0 不参加）。<b>金色格子 = 乘积为 1</b>，即该行找到逆元。p = 2,3,5,7,11,13（素数）时每行恰有一个金格：每个非零元都可逆，Z_p 是<b>有限域</b>；换成 p = 4、6 等合数，马上出现标红的行——比如 mod 6 里 2×3=0，2 永远乘不出 1。<span class='hl'>「每个非零元可逆」恰好等价于「p 是素数」。</span>",
  draw: function (stage) {
    var W = 760, H = 400, svg = VZ.S(stage, W, H, { grid: true });
    var C = VZ.C;
    var tableG = VZ.g(svg);

    var panel = VZ.panel(stage, { "模数 p": "", "p 是否素数": "", "有逆元的元素": "", "结论": "" });
    var ctl = VZ.box(stage, "viz-ctl");
    var p = 5;
    VZ.slider(ctl, { label: "模数 p（2–13）", value: p, min: 2, max: 13, step: 1,
      format: function (v) { return String(v); }, onInput: function (v) { p = Math.round(v); draw(); } });
    var hlRow = 2;  /* 默认关注第 2 行 */

    function isPrime(n) {
      if (n < 2) return false;
      for (var i = 2; i * i <= n; i++) if (n % i === 0) return false;
      return true;
    }

    function draw() {
      tableG.innerHTML = "";
      var n = p - 1;
      var CS = Math.min(44, Math.floor(560 / n));
      var TX = 96, TY = 96;
      var invCount = 0, badRows = [];
      var rowHit = [];
      for (var a = 1; a <= n; a++) {
        var hasInv = false;
        for (var b = 1; b <= n; b++) {
          (function (a, b) {
            var x = TX + (b - 1) * CS, y = TY + (a - 1) * CS;
            var v = (a * b) % p;
            var isOne = v === 1;
            var gg = VZ.g(tableG, { style: "cursor:pointer" });
            var rc = VZ.el("rect", {
              x: x, y: y, width: CS - 2, height: CS - 2, rx: 4,
              fill: isOne ? "rgba(255,207,92,.30)" : "rgba(255,255,255,.03)",
              stroke: isOne ? C.gold : C.faint, "stroke-width": isOne ? 1.8 : .7
            }, gg);
            var tx = VZ.txt(gg, x + CS / 2 - 1, y + CS / 2 + 4, String(v), {
              size: Math.min(13, CS * 0.34), anchor: "middle",
              fill: isOne ? C.gold : C.ink2, weight: isOne ? 700 : 400
            });
            if (a === hlRow || b === hlRow) {
              rc.setAttribute("stroke", C.cyan); rc.setAttribute("stroke-width", 1.4);
              tx.setAttribute("fill", isOne ? C.gold : C.cyan);
            }
            gg.addEventListener("click", function () { hlRow = a; draw(); });
          })(a, b);
          if ((a * b) % p === 1) hasInv = true;
        }
        /* 行表头 */
        var hy = TY + (a - 1) * CS + CS / 2 + 4;
        var ht = VZ.txt(tableG, TX - 12, hy, String(a), { size: 12, anchor: "end", weight: 700, fill: C.ink2 });
        if (!hasInv) {
          badRows.push(a);
          VZ.txt(tableG, TX - 20, hy, "×", { size: 13, anchor: "end", fill: C.red, weight: 700 });
          ht.setAttribute("fill", C.red);
        } else invCount++;
        /* 列表头 */
        VZ.txt(tableG, TX + (a - 1) * CS + CS / 2 - 1, TY - 8, String(a), { size: 12, anchor: "middle", weight: 700, fill: C.ink2 });
      }
      VZ.txt(tableG, TX - 46, TY + n * CS / 2 - 22, "a × b mod " + p, { size: 11, fill: C.dim });
      VZ.txt(tableG, TX + n * CS / 2, TY - 30, "b →", { size: 11, fill: C.dim });
      var prime = isPrime(p);
      VZ.setPanel(panel, {
        "模数 p": String(p),
        "p 是否素数": prime ? "是" : "否（" + (function () { for (var i = 2; i < p; i++) if (p % i === 0) return i + "×" + (p / i); return ""; })() + "）",
        "有逆元的元素": invCount + " / " + n + " 个",
        "结论": prime ? "每行恰有一个 1 → Z" + p + " 是有限域" : "第 " + badRows.join("、") + " 行没有逆元 → 不是域"
      });
    }
    draw();
  }
},

/* ==========================================================
   第 17 章 b · 光锥：拖一个事件点，看它能不能被影响
   ========================================================== */
"f-ch17b": {
  title: "光锥：时空里一张看不见的通行证",
  hint: "<b>拖动金色事件点 P</b>。它在原点事件 O 的光锥内（上=未来、下=过去）时，O 与 P 之间可以有因果联系——飞行器、信件、光线都行；一旦拖进左右两块红色区域（类空），Δs²<0，<b>任何信号都到不了</b>，除非你跑得比光快。贴着 45° 斜线走的就是光本身。读数里盯住 Δs² 的正负号。<span class='hl'>「这里能不能影响那里」不取决于距离，只取决于光锥。</span>",
  draw: function (stage) {
    var W = 760, H = 400, svg = VZ.S(stage, W, H, { grid: true });
    var C = VZ.C;
    var ox = 350, oy = 205, U = 108;  /* U：1 单位（ct=1 或 x=1）的像素 */

    function sx(x) { return ox + x * U; }
    function sy(ct) { return oy - ct * U; }

    /* 三个区域 */
    var R2 = 250, T2 = 180;
    VZ.poly(svg, [[ox, oy], [sx(R2 / U), sy(T2 / U)], [sx(-R2 / U), sy(T2 / U)]], { fill: "rgba(94,224,138,.10)", stroke: "none" });
    VZ.poly(svg, [[ox, oy], [sx(R2 / U), sy(-T2 / U)], [sx(-R2 / U), sy(-T2 / U)]], { fill: "rgba(155,140,255,.10)", stroke: "none" });
    VZ.poly(svg, [[ox, oy], [sx(R2 / U), sy(T2 / U)], [sx(R2 / U), sy(-T2 / U)]], { fill: "rgba(255,122,122,.10)", stroke: "none" });
    VZ.poly(svg, [[ox, oy], [sx(-R2 / U), sy(T2 / U)], [sx(-R2 / U), sy(-T2 / U)]], { fill: "rgba(255,122,122,.10)", stroke: "none" });

    /* 光锥线 */
    [1, -1].forEach(function (s) {
      VZ.ln(svg, ox, oy, sx(s * R2 / U), sy(T2 / U), { stroke: C.cyan, "stroke-width": 1.8 });
      VZ.ln(svg, ox, oy, sx(s * R2 / U), sy(-T2 / U), { stroke: C.cyan, "stroke-width": 1.8, opacity: .6 });
    });
    /* 轴 */
    VZ.ln(svg, ox - R2, oy, ox + R2, oy, { stroke: C.faint, "stroke-width": 1 });
    VZ.ln(svg, ox, oy - T2, ox, oy + T2, { stroke: C.faint, "stroke-width": 1 });
    VZ.txt(svg, ox + R2 - 6, oy - 8, "空间 x", { size: 11, fill: C.dim, anchor: "end" });
    VZ.txt(svg, ox + 8, oy - T2 + 14, "时间 ct", { size: 11, fill: C.dim });
    VZ.txt(svg, ox + 18, oy - T2 + 40, "未来（能被 O 影响）", { size: 11.5, fill: C.green });
    VZ.txt(svg, ox + 18, oy + T2 - 12, "过去（能影响 O）", { size: 11.5, fill: C.violet });
    VZ.txt(svg, ox - R2 + 10, oy - 60, "类空", { size: 12, fill: C.red, weight: 700 });
    VZ.txt(svg, ox - R2 + 10, oy - 44, "信号不可达", { size: 10.5, fill: C.red });
    VZ.txt(svg, ox + R2 - 10, oy - 60, "类空", { size: 12, fill: C.red, weight: 700, anchor: "end" });
    VZ.txt(svg, ox + R2 - 10, oy - 44, "信号不可达", { size: 10.5, fill: C.red, anchor: "end" });
    VZ.txt(svg, ox - 6, oy + 16, "O", { size: 13, fill: C.ink, anchor: "end", weight: 700 });
    VZ.circ(svg, ox, oy, 4, { fill: C.ink });

    /* 连线 + 事件点 */
    var link = VZ.path(svg, "M0 0", VZ.stroke({ stroke: C.green, "stroke-width": 2, "stroke-dasharray": "6 4" }));
    var handle = VZ.g(svg);
    VZ.circ(handle, 0, 0, 16, { fill: C.gold, opacity: .18 });
    VZ.circ(handle, 0, 0, 7.5, { fill: C.gold, stroke: C.deep, "stroke-width": 2 });
    var P = { x: 0.45, ct: 1.0 };  /* 单位坐标 */

    var panel = VZ.panel(stage, { "事件 P (x, ct)": "", "间隔 Δs² = (ct)² − x²": "", "因果分类": "", "O 能给 P 送信吗": "" });
    VZ.drag(svg, handle, W, H, function (x, y, ph) {
      if (ph === "start" || ph === "move") {
        P.x = VZ.clamp((x - ox) / U, -2.1, 2.1);
        P.ct = VZ.clamp((oy - y) / U, -1.55, 1.55);
        upd();
      }
    });

    function upd() {
      var s2 = P.ct * P.ct - P.x * P.x;
      var cls, msg, col;
      if (Math.abs(s2) < 0.022) { cls = "类光（贴着光锥）"; msg = "只有光自己能走到"; col = C.cyan; }
      else if (s2 > 0) { cls = P.ct > 0 ? "未来类时" : "过去类时"; msg = P.ct > 0 ? "能——飞船与电报都行" : "能——它已经影响了 O"; col = P.ct > 0 ? C.green : C.violet; }
      else { cls = "类空"; msg = "不能——需要超光速信号"; col = C.red; }
      link.setAttribute("d", "M" + ox + " " + oy + "L" + sx(P.x).toFixed(1) + " " + sy(P.ct).toFixed(1));
      link.setAttribute("stroke", col);
      handle.setAttribute("transform", "translate(" + sx(P.x) + "," + sy(P.ct) + ")");
      VZ.setPanel(panel, {
        "事件 P (x, ct)": "( " + P.x.toFixed(2) + ", " + P.ct.toFixed(2) + " )",
        "间隔 Δs² = (ct)² − x²": s2.toFixed(2) + (s2 > 0.022 ? "（正）" : s2 < -0.022 ? "（负）" : "（零）"),
        "因果分类": cls,
        "O 能给 P 送信吗": msg
      });
    }
    upd();

    /* 光脉冲沿 45° 线往外流 */
    var pulseD = [];
    [[1, 1], [-1, 1]].forEach(function (s) {
      pulseD.push(VZ.circ(svg, ox, oy, 3.5, { fill: C.cyan, opacity: .9 }));
      VZ.path(svg, "M" + ox + " " + oy + "L" + sx(1.72 * s[0]) + " " + sy(-1.72 * s[1]), { stroke: "none", fill: "none" });
    });
    var tP0 = performance.now();
    VZ.raf(svg, function () {
      var u = ((performance.now() - tP0) / 2600) % 1;
      pulseD.forEach(function (d, i) {
        var s = i === 0 ? 1 : -1;
        var r = u * 1.72;
        d.setAttribute("cx", sx(r * s)); d.setAttribute("cy", sy(-r));
        d.setAttribute("opacity", Math.sin(Math.PI * u) * .9 + .1);
      });
    });
  }
},

/* ==========================================================
   第 17 章 c · 等效原理：自由落体的电梯里，引力消失了
   ========================================================== */
"f-ch17c": {
  title: "等效原理：自由落体 = 引力消失",
  hint: "先用选块切「地面电梯」，再点<b>「松手放下小球」</b>：小球加速砸向地板。切到「缆绳断了：自由落体」再松手：<b>小球悬浮在半空</b>——它和电梯一起下落，谁也不追上谁。电梯里的你看不出两种情形有任何区别。<span class='hl'>这就是等效原理：引力的效应可以被「换个参照系」整个抹掉，所以引力不是一种力，而是时空的几何。</span>",
  draw: function (stage) {
    var W = 760, H = 400, svg = VZ.S(stage, W, H, { grid: true });
    var C = VZ.C;
    var host = document.createElement("div");
    var ctl = VZ.box(stage, "viz-chips");
    stage.appendChild(host);
    VZ.chips(ctl, ["地面静止的电梯", "缆绳断了：自由落体"], "地面静止的电梯", function (m) { setMode(m); });

    var panel = VZ.panel(stage, { "情形": "", "小球会": "", "电梯里的人感觉": "", "这句话的另一面": "" });
    var btnRow = VZ.box(stage, "viz-ctl");
    VZ.btn(btnRow, "松手放下小球", function () { ball.rel = true; });

    var mode = "地面静止的电梯";
    var ball = { rel: false, y: 0, v: 0 };     /* y：相对释放点的下落位移 */
    var scroll = 0;
    var gSVG = VZ.g(svg);

    function setMode(m) {
      mode = m; ball.rel = false; ball.y = 0; ball.v = 0; scroll = 0;
      render();
      VZ.setPanel(panel, {
        "情形": m,
        "小球会": m.indexOf("自由") >= 0 ? "悬浮在原地（相对电梯）" : "加速落向地板",
        "电梯里的人感觉": m.indexOf("自由") >= 0 ? "失重：引力似乎消失了" : "正常：脚下有支撑力",
        "这句话的另一面": m.indexOf("自由") >= 0 ? "电梯加速下沉 ≈ 外面有引力" : "电梯被托住 ≈ 引力还在"
      });
    }

    function render() {
      gSVG.innerHTML = "";
      var ex = 300, ey = 60, ew = 160, eh = 250;   /* 电梯箱 */
      var falling = mode.indexOf("自由") >= 0;
      /* 外部标尺（下落时向上滚） */
      for (var i = -2; i < 12; i++) {
        var yy = ey + i * 40 + (falling ? scroll % 40 : 0);
        if (yy < ey - 40 || yy > ey + eh + 40) continue;
        VZ.ln(gSVG, ex - 34, yy, ex - 14, yy, { stroke: C.faint, "stroke-width": 1.4 });
        VZ.ln(gSVG, ex + ew + 14, yy, ex + ew + 34, yy, { stroke: C.faint, "stroke-width": 1.4 });
      }
      if (falling) VZ.txt(gSVG, ex - 46, ey + 8, "标尺向上掠过", { size: 10, fill: C.dim });
      /* 电梯箱 */
      VZ.el("rect", { x: ex, y: ey, width: ew, height: eh, rx: 8, fill: "rgba(255,255,255,.05)", stroke: C.ink2, "stroke-width": 2 }, gSVG);
      VZ.txt(gSVG, ex + ew / 2, ey - 12, falling ? "自由落体（a = g，向下）" : "静止在地面上", { size: 12, fill: falling ? C.gold : C.ink2, anchor: "middle", weight: 700 });
      /* 人（简笔） */
      var px = ex + 52, py = ey + eh - 26;
      VZ.circ(gSVG, px, py - 42, 9, { stroke: C.ink2, "stroke-width": 1.8, fill: "none" });
      VZ.ln(gSVG, px, py - 33, px, py - 10, { stroke: C.ink2, "stroke-width": 1.8 });
      VZ.ln(gSVG, px, py - 10, px - 10, py, { stroke: C.ink2, "stroke-width": 1.8 });
      VZ.ln(gSVG, px, py - 10, px + 10, py, { stroke: C.ink2, "stroke-width": 1.8 });
      VZ.ln(gSVG, px - 12, py - 26, px + 12, py - 26, { stroke: C.ink2, "stroke-width": 1.8 });
      /* 释放点标记 + 小球 */
      var dropY0 = ey + 62;
      var fy = ex + ew - 52;
      VZ.ln(gSVG, fy - 26, dropY0, fy + 26, dropY0, { stroke: C.faint, "stroke-width": 1, "stroke-dasharray": "3 4" });
      VZ.txt(gSVG, fy + 30, dropY0 + 4, "释放点", { size: 9.5, fill: C.dim });
      var byy = dropY0 + ball.y + (falling && ball.rel ? Math.sin(performance.now() / 700) * 2.5 : 0);
      VZ.circ(gSVG, fy, Math.min(byy, ey + eh - 12), 8.5, { fill: C.gold, stroke: C.deep, "stroke-width": 1.6 });
      /* 力箭头与说明 */
      var ax = ex + ew / 2;
      if (!falling) {
        VZ.txt(gSVG, ax, ey + 30, "g", { size: 13, fill: C.red, anchor: "middle", weight: 700 });
        VZ.ln(gSVG, ax, ey + 38, ax, ey + 74, { stroke: C.red, "stroke-width": 2.2 });
      } else {
        VZ.txt(gSVG, ax, ey + 30, "a = g：内外加速度一样", { size: 11, fill: C.gold, anchor: "middle" });
      }
    }

    var last = performance.now();
    VZ.raf(svg, function () {
      var now = performance.now();
      var dt = Math.min((now - last) / 1000, 0.05); last = now;
      var falling = mode.indexOf("自由") >= 0;
      if (falling) {
        scroll += 130 * dt;
      } else if (ball.rel && ball.y < 155) {
        ball.v += 340 * dt; ball.y += ball.v * dt;
        if (ball.y >= 155) { ball.y = 155; ball.v = 0; }
      }
      render();
    });
    setMode("地面静止的电梯");
  }
},

/* ==========================================================
   第 18 章 b · 双生子佯谬：滑速度，看 γ 因子怎么吃掉时间
   ========================================================== */
"f-ch18b": {
  title: "双生子佯谬：动的那只钟真的慢了",
  hint: "拖动滑块改飞船速度 β = v/c。右边的运动光钟里，光必须走<b>更长的斜线</b>才能追上镜子，而光速不变——所以它一个来回要花 γ 倍的时间：<b>γ = 1/√(1−β²)</b>。β=0.8 时 γ≈1.667，飞船上的钟只剩地球的 0.6 倍速。看读数：12 光年的旅程，地球弟弟等了 15 年，飞船哥哥只老 9 岁。<span class='hl'>重逢时年龄差是真的——不是错觉，不是钟坏了，是时间本身。</span>",
  draw: function (stage) {
    var W = 760, H = 400, svg = VZ.S(stage, W, H, { grid: true });
    var C = VZ.C;

    /* 静止光钟（地球） */
    var ax = 165, ay = 210, mL = 120;
    VZ.ln(svg, ax - 26, ay - mL / 2, ax + 26, ay - mL / 2, { stroke: C.ink2, "stroke-width": 3 });
    VZ.ln(svg, ax - 26, ay + mL / 2, ax + 26, ay + mL / 2, { stroke: C.ink2, "stroke-width": 3 });
    VZ.txt(svg, ax, ay - mL / 2 - 14, "地球的钟（静止光钟）", { size: 12, fill: C.green, anchor: "middle", weight: 700 });
    VZ.txt(svg, ax, ay + mL / 2 + 24, "光上下直来直去", { size: 10.5, fill: C.dim, anchor: "middle" });
    var dotA = VZ.circ(svg, ax, ay, 5, { fill: C.green });

    /* 运动光钟（飞船） */
    var bx = 430, by = 210;
    VZ.txt(svg, bx + 40, by - mL / 2 - 14, "飞船的钟（运动光钟）", { size: 12, fill: C.gold, anchor: "middle", weight: 700 });
    var zig = VZ.path(svg, "M0 0", VZ.stroke({ stroke: C.faint, "stroke-width": 1, "stroke-dasharray": "4 4" }));
    VZ.ln(svg, bx - 26, by - mL / 2, bx + 26, by - mL / 2, { stroke: C.ink2, "stroke-width": 3 });
    VZ.ln(svg, bx - 26, by + mL / 2, bx + 26, by + mL / 2, { stroke: C.ink2, "stroke-width": 3 });
    VZ.txt(svg, bx + 40, by + mL / 2 + 24, "光走斜线：路更长，钟更慢", { size: 10.5, fill: C.dim, anchor: "middle" });
    var dotB = VZ.circ(svg, bx, by, 5, { fill: C.gold });
    var ship = VZ.poly(svg, [[370, 298], [456, 298], [440, 284], [386, 284]], VZ.stroke({ stroke: C.gold, "stroke-width": 1.6, opacity: .7 }));

    var beta = 0.8;
    var panel = VZ.panel(stage, { "速度 β = v/c": "", "γ = 1/√(1−β²)": "", "船上 1 年 = 地球": "", "12 光年旅程（去程）": "" });
    var ctl = VZ.box(stage, "viz-ctl");
    VZ.slider(ctl, { label: "飞船速度 β（0–0.95）", value: beta, min: 0, max: 0.95, step: 0.01,
      format: function (v) { return v.toFixed(2) + " c"; }, onInput: function (v) { beta = v; upd(); } });
    VZ.btn(ctl, "β = 0.8（γ = 1.667）", function () { beta = 0.8; sync(); upd(); });

    function sync() {
      var sl = ctl.querySelector("input"); if (sl) sl.value = beta;
      var i2 = ctl.querySelector("i"); if (i2) i2.textContent = beta.toFixed(2) + " c";
    }
    function upd() {
      var g = 1 / Math.sqrt(1 - beta * beta);
      /* 锯齿路径：半周期横移 = β·mL/2 */
      var dx = beta * mL / 2;
      zig.setAttribute("d", "M" + bx + " " + (by + mL / 2) +
        "L" + (bx + dx) + " " + (by - mL / 2) + "L" + (bx + 2 * dx) + " " + (by + mL / 2) +
        "L" + (bx + 3 * dx) + " " + (by - mL / 2));
      ship.setAttribute("points", [[bx - 60, by + 88], [bx + 26, by + 88], [bx + 10, by + 74], [bx - 44, by + 74]].map(function (q) { return q.join(" "); }).join(" "));
      VZ.setPanel(panel, {
        "速度 β = v/c": beta.toFixed(2),
        "γ = 1/√(1−β²)": g.toFixed(3),
        "船上 1 年 = 地球": g.toFixed(3) + " 年（船钟慢 " + ((1 - 1 / g) * 100).toFixed(0) + "%）",
        "12 光年旅程（去程）": "地球 " + (12 / Math.max(beta, 0.01)).toFixed(1) + " 年 / 飞船 " + (12 / Math.max(beta, 0.01) / g).toFixed(1) + " 年"
      });
    }
    upd();

    /* 两只光钟的光子：运动钟每拍耗时 γ 倍 */
    var t0 = performance.now();
    VZ.raf(svg, function () {
      var T = (performance.now() - t0) / 1000;
      var g = 1 / Math.sqrt(1 - beta * beta);
      var uA = (T / 2) % 1;
      dotA.setAttribute("cy", ay - mL / 2 + mL * (uA < .5 ? uA * 2 : 2 - uA * 2));
      var uB = (T / (2 * g)) % 1;
      var tri = uB < .5 ? uB * 2 : 2 - uB * 2;   /* 0..1..0 */
      var dx = beta * mL / 2;
      dotB.setAttribute("cx", bx + dx * tri);
      dotB.setAttribute("cy", by - mL / 2 + mL * tri);
    });
  }
},

/* ==========================================================
   第 18 章 c · 速度加成：0.9c + 0.9c ≠ 1.8c
   ========================================================== */
"f-ch18c": {
  title: "速度加成：两个 0.9c 叠起来也只有 0.994c",
  hint: "拖两个滑块，设 A 相对地面、B 相对 A 的速度。红色读数是<b>牛顿算法</b> u+v——它会冲过 1c 甚至冲到 1.8c；金色读数用相对论公式 <b>w = (u+v)/(1+uv/c²)</b>，永远被压在光速红线之下。点「0.9c + 0.9c」看最经典的一幕：牛顿说 1.8c，相对论说 0.994c。<span class='hl'>分母 1+uv/c² 就是宇宙的限速器——速度越接近光，它惩罚得越狠。</span>",
  draw: function (stage) {
    var W = 760, H = 380, svg = VZ.S(stage, W, H, { grid: true });
    var C = VZ.C;

    /* 速度轴：0 → 2c */
    var x0 = 70, x1 = 690, ay = 150;
    VZ.ln(svg, x0, ay, x1, ay, { stroke: C.ink2, "stroke-width": 1.6 });
    for (var k = 0; k <= 2; k += 0.5) {
      var xx = x0 + (x1 - x0) * k / 2;
      VZ.ln(svg, xx, ay - 6, xx, ay + 6, { stroke: C.ink2, "stroke-width": 1.2 });
      VZ.txt(svg, xx, ay + 24, k.toFixed(1) + "c", { size: 10.5, fill: C.dim, anchor: "middle" });
    }
    var cxLine = x0 + (x1 - x0) / 2;
    VZ.ln(svg, cxLine, ay - 66, cxLine, ay + 40, { stroke: C.red, "stroke-width": 2 });
    VZ.txt(svg, cxLine + 6, ay - 58, "光速 c：不可逾越", { size: 11, fill: C.red, weight: 700 });
    /* 超速禁区 */
    VZ.el("rect", { x: cxLine, y: ay - 44, width: x1 - cxLine, height: 88, rx: 6, fill: "rgba(255,122,122,.08)", stroke: "none" }, svg);

    var mkN = VZ.g(svg);
    VZ.circ(mkN, 0, 0, 7, { fill: C.red });
    var mkNLab = VZ.txt(svg, 0, 0, "牛顿 u+v", { size: 11, fill: C.red, anchor: "middle", weight: 700 });
    var mkR = VZ.g(svg);
    VZ.circ(mkR, 0, 0, 7, { fill: C.gold });
    var mkRLab = VZ.txt(svg, 0, 0, "相对论", { size: 11, fill: C.gold, anchor: "middle", weight: 700 });

    /* 两艘小飞船示意 */
    VZ.txt(svg, 100, 60, "地面系：A 船速度 u →", { size: 12, fill: C.cyan });
    VZ.txt(svg, 100, 86, "A 船系：B 船速度 v →", { size: 12, fill: C.violet });

    var panel = VZ.panel(stage, { "u": "", "v": "", "牛顿叠加 u+v": "", "相对论 w=(u+v)/(1+uv/c²)": "" });
    var ctl = VZ.box(stage, "viz-ctl");
    var u = 0.9, v = 0.9;
    var sU = VZ.slider(ctl, { label: "u（A 相对地面）", value: u, min: -0.99, max: 0.99, step: 0.01,
      format: function (x) { return x.toFixed(2) + " c"; }, onInput: function (x) { u = x; upd(); } });
    var sV = VZ.slider(ctl, { label: "v（B 相对 A）", value: v, min: -0.99, max: 0.99, step: 0.01,
      format: function (x) { return x.toFixed(2) + " c"; }, onInput: function (x) { v = x; upd(); } });
    var row2 = VZ.box(stage, "viz-ctl");
    VZ.btn(row2, "0.9c + 0.9c", function () { u = 0.9; v = 0.9; sync(); upd(); });
    VZ.btn(row2, "0.5c + 0.5c", function () { u = 0.5; v = 0.5; sync(); upd(); });
    VZ.btn(row2, "0.99c + 0.99c", function () { u = 0.99; v = 0.99; sync(); upd(); });

    function sync() {
      sU.input.value = u; sV.input.value = v;
      sU.readout.textContent = u.toFixed(2) + " c"; sV.readout.textContent = v.toFixed(2) + " c";
    }
    function upd() {
      var wN = u + v;
      var wR = (u + v) / (1 + u * v);
      var pxN = x0 + (x1 - x0) * VZ.clamp(wN, 0, 2) / 2;
      var pxR = x0 + (x1 - x0) * Math.max(wR, 0) / 2;
      mkN.firstChild.setAttribute("cx", pxN); mkN.firstChild.setAttribute("cy", ay - 22);
      mkNLab.setAttribute("x", pxN); mkNLab.setAttribute("y", ay - 40);
      mkNLab.textContent = "牛顿 u+v = " + wN.toFixed(3) + "c" + (wN > 1 ? " ✗ 超光速！" : "");
      mkR.firstChild.setAttribute("cx", pxR); mkR.firstChild.setAttribute("cy", ay + 34);
      mkRLab.setAttribute("x", pxR); mkRLab.setAttribute("y", ay + 58);
      mkRLab.textContent = "相对论 w = " + wR.toFixed(3) + "c ✓";
      VZ.setPanel(panel, {
        "u": u.toFixed(2) + " c", "v": v.toFixed(2) + " c",
        "牛顿叠加 u+v": wN.toFixed(4) + " c" + (wN > 1 ? "（不可能）" : ""),
        "相对论 w=(u+v)/(1+uv/c²)": wR.toFixed(4) + " c"
      });
    }
    upd();
  }
},

});
