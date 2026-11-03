/* ============================================================
   viz-plain.js — 「人话层」专用实验图
   这些图不在正文的交互图序列里，只被人话层的「试一试」引用。
   风格与站内一致（暗底 + 钢笔线），但配色取暖橙，跟人话层的暖调呼应。
   ============================================================ */
VZ.define({

/* ------------------------------------------------------------
   PL1 · 1/z 把圆映成圆
   左：z 平面上一个可拖动的圆；右：它在 w 平面上的像。
   圆不经过原点 → 像还是圆；一旦碰到原点 → 像绷成一条直线。
   ------------------------------------------------------------ */
"f-pl-inv-circle": {
  title: "",
  hint: "拖动<b>左边的圆心</b>，看右边变成什么。圆心离原点越远，像就越小——这就是「半径变倒数」。",
  draw: function (stage) {
    var W = 720, H = 300, C = VZ.C;
    var cv = VZ.canvas(stage, W, H, { maxDpr: 2 });
    var g = cv.ctx;
    var cen = [0.78, 0.32], R = 0.55, zoomR = 1;

    /* 复数工具 */
    function inv(z) {
      var d = z[0] * z[0] + z[1] * z[1];
      if (d < 1e-12) d = 1e-12;
      return [z[0] / d, -z[1] / d];
    }
    /* 采样一个圆 → 映到 w 平面 */
    function mapCircle(c, r, n) {
      var out = [];
      for (var k = 0; k <= n; k++) {
        var t = k / n * Math.PI * 2;
        var z = [c[0] + r * Math.cos(t), c[1] + r * Math.sin(t)];
        var w = inv(z);
        if (Math.hypot(w[0], w[1]) > 60) return null;
        out.push(w);
      }
      return out;
    }
    /* 最小二乘拟合圆：(x²+y²) = A·x + B·y + C */
    function fitCircle(pts) {
      var n = pts.length, Sx = 0, Sy = 0, Sxx = 0, Syy = 0, Sxy = 0, Sz = 0, Szx = 0, Szy = 0;
      for (var i = 0; i < n; i++) {
        var x = pts[i][0], y = pts[i][1], z = x * x + y * y;
        Sx += x; Sy += y; Sxx += x * x; Syy += y * y; Sxy += x * y; Sz += z; Szx += z * x; Szy += z * y;
      }
      /* 解三元一次方程组 */
      var A = [[Sxx, Sxy, Sx, Szx], [Sxy, Syy, Sy, Szy], [Sx, Sy, n, Sz]];
      for (var r = 0; r < 3; r++) {
        var piv = r;
        for (var k = r + 1; k < 3; k++) if (Math.abs(A[k][r]) > Math.abs(A[piv][r])) piv = k;
        if (Math.abs(A[piv][r]) < 1e-14) return null;
        var tmp = A[r]; A[r] = A[piv]; A[piv] = tmp;
        for (var k2 = r + 1; k2 < 3; k2++) {
          var f = A[k2][r] / A[r][r];
          for (var j = r; j < 4; j++) A[k2][j] -= f * A[r][j];
        }
      }
      var s = [A[0][3] / A[0][0], A[1][3] / A[1][1], A[2][3] / A[2][2]];
      var ccx = s[0] / 2, ccy = s[1] / 2;
      var rr2 = ccx * ccx + ccy * ccy - s[2];
      if (rr2 <= 0) return null;
      var r2 = Math.sqrt(rr2);
      /* 拟合偏差：各点到拟合圆的距离最大偏差 */
      var dev = 0;
      for (var i2 = 0; i2 < n; i2++) {
        var d = Math.hypot(pts[i2][0] - ccx, pts[i2][1] - ccy);
        dev = Math.max(dev, Math.abs(d - r2));
      }
      return { c: [ccx, ccy], r: r2, dev: dev };
    }

    var PW = W / 2, S0 = Math.min(PW, H) / 2 / 3.0;
    /* 右栏的缩放要让「像」大致落在栏内：像的半径 ≈ R/|cen|²-|R|²|，
       先按这个估一个基准倍率，再用用户的「右栏放大」去调。 */
    function baseScale() {
      var d = cen[0] * cen[0] + cen[1] * cen[1] - R * R;
      if (Math.abs(d) < 1e-6) d = 1e-6;
      var rIm = R / Math.abs(d);
      var want = Math.min(PW, H) / 2 / 3.1 / Math.max(0.15, rIm);
      return Math.min(S0 * 1.6, Math.max(S0 * 0.18, want));
    }
    function P1(z) { return [PW * 0.5 + z[0] * S0, H / 2 - z[1] * S0]; }
    function P2(z) {
      var k = baseScale() * zoomR;
      return [PW + PW * 0.5 + z[0] * k, H / 2 - z[1] * k];
    }

    function grid(x0, w, S, cx, cy) {
      g.save();
      g.beginPath(); g.rect(x0, 0, w, H); g.clip();
      g.strokeStyle = "rgba(75,67,128,.55)"; g.lineWidth = 1;
      for (var i = -8; i <= 8; i++) {
        var px = cx + i * 0.5 * S;
        if (px < x0 + 1 || px > x0 + w - 1) continue;
        g.beginPath(); g.moveTo(px, 0); g.lineTo(px, H); g.stroke();
      }
      for (var j = -6; j <= 6; j++) {
        var py = cy - j * 0.5 * S;
        if (py < 1 || py > H - 1) continue;
        g.beginPath(); g.moveTo(x0, py); g.lineTo(x0 + w, py); g.stroke();
      }
      g.restore();
    }

    function draw() {
      g.clearRect(0, 0, W, H);
      g.fillStyle = C.deep; g.fillRect(0, 0, W, H);
      var cx1 = PW * 0.5, cy = H / 2, cx2 = PW + PW * 0.5;

      grid(0, PW, S0, cx1, cy);
      grid(PW, PW, baseScale() * zoomR, cx2, cy);

      /* 左：原圆 */
      var p = P1(cen);
      g.beginPath(); g.arc(p[0], p[1], R * S0, 0, Math.PI * 2);
      g.strokeStyle = C.gold; g.lineWidth = 2.6; g.stroke();
      g.beginPath(); g.arc(p[0], p[1], 4.5, 0, Math.PI * 2); g.fillStyle = C.gold; g.fill();
      /* 单位圆参照（虚线）：读本里说「圆心离原点越远，像就越小」，
         有了这条虚线才看得出「半径变倒数」 */
      var o1 = P1([0, 0]);
      g.setLineDash([5, 4]);
      g.beginPath(); g.arc(o1[0], o1[1], S0, 0, Math.PI * 2);
      g.strokeStyle = "rgba(255,207,92,.35)"; g.lineWidth = 1.4; g.stroke();
      g.setLineDash([]);
      g.beginPath(); g.arc(o1[0], o1[1], 4, 0, Math.PI * 2); g.fillStyle = C.red; g.fill();
      g.fillStyle = "rgba(255,207,92,.55)";
      g.font = "10px -apple-system,PingFang SC,sans-serif";
      g.fillText("单位圆", o1[0] + S0 + 5, o1[1] - 5);

      /* 右：像 */
      var pts = mapCircle(cen, R, 240);
      var through = Math.abs(Math.hypot(cen[0], cen[1]) - R) < 0.035;
      if (pts) {
        if (through) {
          /* 退化成直线：直接画采样点连成的线 */
          g.beginPath();
          for (var i = 0; i < pts.length; i++) {
            var q = P2(pts[i]);
            i ? g.lineTo(q[0], q[1]) : g.moveTo(q[0], q[1]);
          }
          g.strokeStyle = C.red; g.lineWidth = 3; g.stroke();
        } else {
          var fc = fitCircle(pts);
          if (fc) {
            var qc = P2(fc.c);
            g.beginPath(); g.arc(qc[0], qc[1], fc.r * baseScale() * zoomR, 0, Math.PI * 2);
            g.strokeStyle = C.green; g.lineWidth = 3; g.stroke();
            g.beginPath(); g.arc(qc[0], qc[1], 4, 0, Math.PI * 2); g.fillStyle = C.green; g.fill();
          }
        }
      }
      var o2 = P2([0, 0]);
      var k2 = baseScale() * zoomR;
      g.setLineDash([5, 4]);
      g.beginPath(); g.arc(o2[0], o2[1], k2, 0, Math.PI * 2);
      g.strokeStyle = "rgba(255,207,92,.35)"; g.lineWidth = 1.4; g.stroke();
      g.setLineDash([]);
      g.beginPath(); g.arc(o2[0], o2[1], 4, 0, Math.PI * 2); g.fillStyle = C.red; g.fill();

      g.font = "11px -apple-system,PingFang SC,sans-serif";
      g.fillStyle = C.dim;
      g.fillText("z 平面（拖动圆心）", 10, 18);
      g.fillText("w 平面（像）", PW + 10, 18);
      g.fillStyle = through ? C.red : C.green;
      g.fillText(through ? "像绷直了 —— 直线" : "像仍然是圆", PW + 10, H - 12);
    }

    /* 拖拽左边的圆心 */
    var dragging = false;
    function toZ(e) {
      var r = cv.cv.getBoundingClientRect();
      var sx = (e.clientX - r.left) / r.width * W;
      var sy = (e.clientY - r.top) / r.height * H;
      return [(sx - PW * 0.5) / S0, -(sy - H / 2) / S0];
    }
    cv.cv.addEventListener("pointerdown", function (e) {
      var r = cv.cv.getBoundingClientRect();
      if ((e.clientX - r.left) / r.width * W > PW) return;   /* 只在左栏拖 */
      dragging = true; cen = toZ(e); draw(); cv.cv.setPointerCapture && cv.cv.setPointerCapture(e.pointerId);
    });
    cv.cv.addEventListener("pointermove", function (e) {
      if (!dragging) return;
      cen = toZ(e); draw();
    });
    cv.cv.addEventListener("pointerup", function () { dragging = false; });

    var out = VZ.panel(stage, { "原圆圆心": "", "半径": "", "像": "", "说明": "" });
    function refresh() {
      draw();
      var d = Math.hypot(cen[0], cen[1]);
      var through = Math.abs(d - R) < 0.035;
      var pts = mapCircle(cen, R, 240);
      var fc = pts && !through ? fitCircle(pts) : null;
      VZ.setPanel(out, {
        "原圆圆心": "(" + cen[0].toFixed(2) + ", " + cen[1].toFixed(2) + ")",
        "半径": R.toFixed(2),
        "像": through ? "一条直线" : (fc ? "圆，半径 " + fc.r.toFixed(3) : "—"),
        "说明": through
          ? "圆碰到了原点 → 1/z 把它拉成了直线"
          : (d > R ? "圆心离原点 " + d.toFixed(2) + " > 半径 → 不含原点 → 像仍是圆"
                   : "原点已在圆内 → 像仍是圆")
      });
    }

    var ctl = VZ.box(stage, "viz-ctl");
    VZ.slider(ctl, {
      label: "右栏放大", min: 0.25, max: 4, step: 0.05, value: zoomR,
      format: function (v) { return "×" + v.toFixed(2); },
      onInput: function (v) { zoomR = v; refresh(); }
    });
    VZ.btn(ctl, "推到原点去", function () {
      var d = Math.hypot(cen[0], cen[1]) || 1;
      cen = [cen[0] / d * R, cen[1] / d * R]; refresh();
    });
    VZ.btn(ctl, "换个位置", function () {
      var a = Math.random() * Math.PI * 2, r = 0.7 + Math.random() * 0.9;
      cen = [r * Math.cos(a), r * Math.sin(a)]; refresh();
    });
    VZ.btn(ctl, "复位", function () { cen = [0.78, 0.32]; zoomR = 1; refresh(); });

    refresh();
  }
},

/* ------------------------------------------------------------
   PL2 · 反演：z → 1/z̄（半径变倒数，角度不变）
   ------------------------------------------------------------ */
"f-pl-inversion": {
  title: "",
  hint: "拖动<b>橙点</b>。它与紫点（1/z̄）始终在<b>同一条射线上</b>，只是远近翻了个个儿——这就是「反演」。",
  draw: function (stage) {
    var W = 720, H = 300, C = VZ.C;
    var cv = VZ.canvas(stage, W, H, { maxDpr: 2 });
    var g = cv.ctx;
    var z = [1.45, 0.55], zoom = 1;

    function invz(p) {
      var d = p[0] * p[0] + p[1] * p[1];
      if (d < 1e-9) d = 1e-9;
      return [p[0] / d, p[1] / d];     /* 1/z̄：角度不变 */
    }
    var S = Math.min(W, H) / 2 / 2.4 * zoom;
    function P(p) { return [W / 2 + p[0] * S, H / 2 - p[1] * S]; }

    function draw() {
      g.clearRect(0, 0, W, H);
      g.fillStyle = C.deep; g.fillRect(0, 0, W, H);
      /* 网格 */
      g.strokeStyle = "rgba(75,67,128,.55)"; g.lineWidth = 1;
      for (var i = -8; i <= 8; i++) {
        var px = W / 2 + i * 0.5 * S;
        if (px > 1 && px < W - 1) { g.beginPath(); g.moveTo(px, 0); g.lineTo(px, H); g.stroke(); }
      }
      for (var j = -6; j <= 6; j++) {
        var py = H / 2 - j * 0.5 * S;
        if (py > 1 && py < H - 1) { g.beginPath(); g.moveTo(0, py); g.lineTo(W, py); g.stroke(); }
      }
      var o = P([0, 0]);
      /* 单位圆 */
      g.beginPath(); g.arc(o[0], o[1], S, 0, Math.PI * 2);
      g.strokeStyle = C.gold; g.lineWidth = 2.2; g.stroke();
      g.fillStyle = C.gold; g.font = "11px -apple-system,PingFang SC,sans-serif";
      g.fillText("单位圆（反演的镜）", o[0] + S + 6, o[1] - 6);

      var zi = invz(z);
      var pa = P(z), pb = P(zi);
      /* 同一条射线 */
      g.setLineDash([4, 3]);
      g.beginPath(); g.moveTo(o[0], o[1]);
      g.lineTo(o[0] + (pa[0] - o[0]) * 2.6, o[1] + (pa[1] - o[1]) * 2.6);
      g.strokeStyle = "rgba(255,207,92,.4)"; g.lineWidth = 1.4; g.stroke();
      g.setLineDash([]);
      g.beginPath(); g.moveTo(o[0], o[1]); g.lineTo(pa[0], pa[1]);
      g.strokeStyle = C.gold; g.lineWidth = 1.8; g.stroke();
      g.beginPath(); g.moveTo(o[0], o[1]); g.lineTo(pb[0], pb[1]);
      g.strokeStyle = C.violet; g.lineWidth = 1.8; g.stroke();

      /* z 点 */
      g.beginPath(); g.arc(pa[0], pa[1], 7, 0, Math.PI * 2);
      g.fillStyle = C.gold; g.fill(); g.strokeStyle = C.deep; g.lineWidth = 2; g.stroke();
      g.fillStyle = C.gold; g.fillText("z", pa[0] + 11, pa[1] - 7);
      /* 1/z̄ 点 */
      g.beginPath(); g.arc(pb[0], pb[1], 7, 0, Math.PI * 2);
      g.fillStyle = C.violet; g.fill(); g.strokeStyle = C.deep; g.lineWidth = 2; g.stroke();
      g.fillStyle = C.violet; g.fillText("1/z̄", pb[0] + 11, pb[1] - 7);

      g.fillStyle = "rgba(255,255,255,.34)";
      g.font = "10.5px -apple-system,PingFang SC,sans-serif";
      g.fillText("拖动橙点", 12, H - 12);
    }

    var dragging = false;
    function toZ(e) {
      var r = cv.cv.getBoundingClientRect();
      var sx = (e.clientX - r.left) / r.width * W;
      var sy = (e.clientY - r.top) / r.height * H;
      return [(sx - W / 2) / S, -(sy - H / 2) / S];
    }
    cv.cv.addEventListener("pointerdown", function (e) {
      dragging = true; z = toZ(e); draw();
      cv.cv.setPointerCapture && cv.cv.setPointerCapture(e.pointerId);
    });
    cv.cv.addEventListener("pointermove", function (e) {
      if (!dragging) return;
      var p = toZ(e);
      if (Math.hypot(p[0], p[1]) > 0.08) z = p;
      draw();
    });
    cv.cv.addEventListener("pointerup", function () { dragging = false; });

    var out = VZ.panel(stage, { "z": "", "|z|": "", "1/z̄": "", "|1/z̄|": "", "结论": "" });
    function refresh() {
      draw();
      var r = Math.hypot(z[0], z[1]);
      var zi = invz(z);
      VZ.setPanel(out, {
        "z": "(" + z[0].toFixed(3) + ", " + z[1].toFixed(3) + ")",
        "|z|": r.toFixed(3),
        "1/z̄": "(" + zi[0].toFixed(3) + ", " + zi[1].toFixed(3) + ")",
        "|1/z̄|": (1 / r).toFixed(3),
        "结论": "半径变倒数（" + r.toFixed(2) + " → " + (1 / r).toFixed(2) + "），角度一点不变"
      });
    }
    var ctl = VZ.box(stage, "viz-ctl");
    VZ.slider(ctl, {
      label: "放大", min: 0.3, max: 4, step: 0.05, value: zoom,
      format: function (v) { return "×" + v.toFixed(2); },
      onInput: function (v) { zoom = v; refresh(); }
    });
    VZ.btn(ctl, "复位", function () { z = [1.45, 0.55]; zoom = 1; refresh(); });
    refresh();
  }
},

/* ------------------------------------------------------------
   PL3 · 默比乌斯变换：两头各缺哪个点
   ------------------------------------------------------------ */
"f-pl-mobius": {
  title: "",
  hint: "换几种变换看看：左边永远有<b>一个红点</b>（z₀ = −d/c，代入它 w 就冲到 ∞），右边永远有<b>一个蓝点</b>（a/c，是 z = ∞ 送过来的）。<b>这两个坑是互补的</b>——把 ∞ 收进来，两边同时补上。",
  draw: function (stage) {
    var W = 720, H = 300, C = VZ.C;
    var cv = VZ.canvas(stage, W, H, { maxDpr: 2 });
    var g = cv.ctx;
    var PRESETS = {
      "w = 1/z": { a: [0, 0], b: [1, 0], c: [1, 0], d: [0, 0] },
      "w = 2z+1": { a: [2, 0], b: [1, 0], c: [0, 0], d: [1, 0] },
      "凯莱 (z−1)/(iz+i)": { a: [1, 0], b: [-1, 0], c: [0, 1], d: [0, 1] },
      "一般复系数": { a: [1, 0.5], b: [2, -1], c: [0.5, 0.2], d: [1, -0.3] }
    };
    var cur = "w = 1/z", zoom = 1;

    function cmul(p, q) { return [p[0] * q[0] - p[1] * q[1], p[0] * q[1] + p[1] * q[0]]; }
    function cdiv(p, q) {
      var d = q[0] * q[0] + q[1] * q[1];
      if (d < 1e-12) d = 1e-12;
      return [(p[0] * q[0] + p[1] * q[1]) / d, (p[1] * q[0] - p[0] * q[1]) / d];
    }
    function cadd(p, q) { return [p[0] + q[0], p[1] + q[1]]; }
    function mob(z) {
      var P = PRESETS[cur];
      var num = cadd(cmul(P.a, z), P.b);
      var den = cadd(cmul(P.c, z), P.d);
      if (den[0] * den[0] + den[1] * den[1] < 1e-14) return null;
      return cdiv(num, den);
    }
    function pts(c, r, n) {
      var o = [];
      for (var k = 0; k <= n; k++) {
        var t = k / n * Math.PI * 2;
        var w = mob([c[0] + r * Math.cos(t), c[1] + r * Math.sin(t)]);
        if (!w || Math.hypot(w[0], w[1]) > 40) return null;
        o.push(w);
      }
      return o;
    }

    var PW = W / 2, S0 = Math.min(PW, H) / 2 / 3.0;
    /* 右栏基准倍率：让像大致落在栏内（默比乌斯没有简单闭式，用采样估） */
    function baseScale() {
      var PR = PRESETS[cur];
      var hasC = Math.hypot(PR.c[0], PR.c[1]) > 1e-9;
      var cen = hasC ? cdiv([-PR.d[0], -PR.d[1]], PR.c) : [0, 0];
      var ps = pts(cen, 0.55, 60);
      if (!ps) return S0 * 0.4;
      var mx = 0;
      for (var i = 0; i < ps.length; i++) mx = Math.max(mx, Math.hypot(ps[i][0], ps[i][1]));
      if (mx < 1e-6) mx = 1;
      return Math.min(S0 * 1.4, Math.max(S0 * 0.12, Math.min(PW, H) / 2 / 3.2 / mx));
    }
    function P1(z) { return [PW * 0.5 + z[0] * S0, H / 2 - z[1] * S0]; }
    function P2(z) {
      var k = baseScale() * zoom;
      return [PW + PW * 0.5 + z[0] * k, H / 2 - z[1] * k];
    }

    function grid(x0, w, S, cx, cy) {
      g.save(); g.beginPath(); g.rect(x0, 0, w, H); g.clip();
      g.strokeStyle = "rgba(75,67,128,.55)"; g.lineWidth = 1;
      for (var i = -8; i <= 8; i++) {
        var px = cx + i * 0.5 * S;
        if (px > x0 + 1 && px < x0 + w - 1) { g.beginPath(); g.moveTo(px, 0); g.lineTo(px, H); g.stroke(); }
      }
      for (var j = -6; j <= 6; j++) {
        var py = cy - j * 0.5 * S;
        if (py > 1 && py < H - 1) { g.beginPath(); g.moveTo(x0, py); g.lineTo(x0 + w, py); g.stroke(); }
      }
      g.restore();
    }

    function draw() {
      g.clearRect(0, 0, W, H);
      g.fillStyle = C.deep; g.fillRect(0, 0, W, H);
      var cx1 = PW * 0.5, cy = H / 2, cx2 = PW + PW * 0.5;
      grid(0, PW, S0, cx1, cy);
      grid(PW, PW, baseScale() * zoom, cx2, cy);

      var PR = PRESETS[cur];
      var hasC = Math.hypot(PR.c[0], PR.c[1]) > 1e-9;
      var z0 = hasC ? cdiv([-PR.d[0], -PR.d[1]], PR.c) : null;
      var wi = hasC ? cdiv(PR.a, PR.c) : null;

      /* 左：一个圆 + 红点 z₀ */
      var cen = z0 || [0, 0];
      var pc = P1(cen);
      g.beginPath(); g.arc(pc[0], pc[1], 0.55 * S0, 0, Math.PI * 2);
      g.strokeStyle = C.gold; g.lineWidth = 2.4; g.stroke();
      if (z0) {
        var pz = P1(z0);
        /* z₀ 与原点重合时（w = 1/z 的情形）把标签挪开，别压在原点标记上 */
        var atOrigin = Math.hypot(z0[0], z0[1]) < 1e-6;
        var lx = pz[0] + (atOrigin ? 12 : 10), ly = pz[1] + (atOrigin ? 20 : -7);
        g.beginPath(); g.arc(pz[0], pz[1], 7, 0, Math.PI * 2);
        g.fillStyle = C.red; g.fill(); g.strokeStyle = C.deep; g.lineWidth = 2; g.stroke();
        g.fillStyle = C.red; g.font = "10.5px -apple-system,PingFang SC,sans-serif";
        g.fillText("z₀ = −d/c", lx, ly);
      }
      var o1 = P1([0, 0]);
      g.beginPath(); g.arc(o1[0], o1[1], 4, 0, Math.PI * 2); g.fillStyle = C.ink; g.fill();

      /* 右：像 + 蓝点 a/c */
      var ps = pts(cen, 0.55, 200);
      if (ps) {
        g.beginPath();
        for (var i = 0; i < ps.length; i++) {
          var q = P2(ps[i]);
          i ? g.lineTo(q[0], q[1]) : g.moveTo(q[0], q[1]);
        }
        g.strokeStyle = C.green; g.lineWidth = 2.6; g.stroke();
      }
      if (wi) {
        var pw2 = P2(wi);
        g.beginPath(); g.arc(pw2[0], pw2[1], 7, 0, Math.PI * 2);
        g.fillStyle = C.cyan; g.fill(); g.strokeStyle = C.deep; g.lineWidth = 2; g.stroke();
        g.fillStyle = C.cyan; g.font = "10.5px -apple-system,PingFang SC,sans-serif";
        /* 标签放在点的左下方，避开绿圆的轮廓 */
        g.fillText("a/c（来自 z=∞）", pw2[0] - 18, pw2[1] + 26);
      }
      var o2 = P2([0, 0]);
      g.beginPath(); g.arc(o2[0], o2[1], 4, 0, Math.PI * 2); g.fillStyle = C.ink; g.fill();

      g.font = "11px -apple-system,PingFang SC,sans-serif";
      g.fillStyle = C.dim;
      g.fillText("z 平面", 10, 18);
      g.fillText("w 平面", PW + 10, 18);
    }

    var out = VZ.panel(stage, { "变换": "", "ad − bc": "", "被挖掉的 z": "", "被挖掉的 w": "", "验算": "" });
    function refresh() {
      draw();
      var P = PRESETS[cur];
      var det = P.a[0] * P.d[0] + P.a[1] * P.d[1] - (P.b[0] * P.c[0] + P.b[1] * P.c[1]);
      var hasC = Math.hypot(P.c[0], P.c[1]) > 1e-9;
      var z0 = hasC ? cdiv([-P.d[0], -P.d[1]], P.c) : null;
      var wi = hasC ? cdiv(P.a, P.c) : null;
      var probe = "—";
      if (z0) {
        var w = mob([z0[0] + 1e-7, z0[1]]);
        probe = w ? "代入 z₀+10⁻⁷ → |w| = " + Math.hypot(w[0], w[1]).toExponential(1) + "（真的冲到 ∞ 了）" : "→ ∞";
      } else {
        var w2 = mob([1e7, 0]);
        probe = w2 ? "z = 10⁷ → w = " + w2[0].toFixed(3) + " + " + w2[1].toFixed(3) + "i" : "→ ∞";
      }
      var z0txt = z0 ? (Math.hypot(z0[0], z0[1]) < 1e-6 ? "0（就是原点）" : fmtC(z0)) + "　代入它 w → ∞" : "∞（c = 0）";
      var witxt = wi ? (Math.hypot(wi[0], wi[1]) < 1e-6 ? "0（就是原点）" : fmtC(wi)) + "　z = ∞ 送过来的" : "∞";
      VZ.setPanel(out, {
        "变换": cur,
        "系数": "w = (" + fmtC(P.a) + "z + " + fmtC(P.b) + ") / (" + fmtC(P.c) + "z + " + fmtC(P.d) + ")",
        "ad − bc": det.toFixed(3) + (Math.abs(det) < 1e-9 ? "（退化！恒等于常数）" : "（非退化，可逆）"),
        "被挖掉的 z": z0txt,
        "被挖掉的 w": witxt,
        "验算": probe
      });
    }
    function fmtC(p) {
      var r = p[0], i = p[1];
      return (Math.abs(i) < 1e-9) ? r.toFixed(2)
        : (r.toFixed(2) + (i >= 0 ? " + " : " − ") + Math.abs(i).toFixed(2) + "i");
    }

    var ctl = VZ.box(stage, "viz-ctl");
    VZ.chips(ctl, Object.keys(PRESETS), cur, function (k) { cur = k; refresh(); });
    VZ.slider(ctl, {
      label: "右栏放大", min: 0.25, max: 4, step: 0.05, value: zoom,
      format: function (v) { return "×" + v.toFixed(2); },
      onInput: function (v) { zoom = v; refresh(); }
    });
    refresh();
  }
},

/* ------------------------------------------------------------
   PL4 · 切开 vs 盖楼：两种处理多值的办法并排看
   左：沿正实轴切一刀，缝上的点从此没有定义。
   右：把这条缝接起来，绕原点一圈就升一层。
   ------------------------------------------------------------ */
"f-pl-slice": {
  title: "",
  hint: "左边是老办法：沿正实轴切一刀，<b>缝上的点从此没有定义</b>。右边是黎曼的办法：把这条缝<b>接上</b>——绕原点一圈升一层。拖「绕行角 θ」，看金点怎么爬楼：<span class='hl'>同一个 z 到了不同的层，就有了不同的 log 值</span>。",
  draw: function (stage) {
    var W = 720, H = 300, C = VZ.C, TAU = Math.PI * 2;
    var svg = VZ.S(stage, W, H, { bg: C.deep });
    var theta = 0.85;

    /* ---------- 左：切开 ---------- */
    var cx = 158, cy = 156, R = 88;
    var gl = VZ.g(svg);
    VZ.txt(gl, cx - R, 24, "老办法：切开", { size: 13, fill: "rgba(242,236,223,.86)", weight: "bold" });
    VZ.circ(gl, cx, cy, R, { fill: "rgba(79,227,240,.05)", stroke: "rgba(201,194,230,.45)", "stroke-width": 1.4 });
    VZ.ln(gl, cx - R - 16, cy, cx + R + 20, cy, { stroke: "rgba(201,194,230,.35)", "stroke-width": 1 });
    VZ.ln(gl, cx, cy - R - 14, cx, cy + R + 14, { stroke: "rgba(201,194,230,.35)", "stroke-width": 1 });
    VZ.txt(gl, cx + R + 20, cy + 16, "Re", { size: 10.5, fill: C.dim });
    VZ.txt(gl, cx + 5, cy - R - 18, "Im", { size: 10.5, fill: C.dim });
    /* 切缝的两条边 */
    VZ.ln(gl, cx - 3, cy - 3.5, cx + R + 14, cy - 3.5, { stroke: C.red, "stroke-width": 2.4 });
    VZ.ln(gl, cx - 3, cy + 3.5, cx + R + 14, cy + 3.5, { stroke: C.red, "stroke-width": 2.4 });
    VZ.txt(gl, cx + 12, cy - 9, "切缝", { size: 10.5, fill: C.red, weight: "bold" });
    /* 缝上打一个叉：这地方「没有定义」 */
    var xc = cx + 42;
    VZ.ln(gl, xc - 5, cy - 5, xc + 5, cy + 5, { stroke: C.red, "stroke-width": 2 });
    VZ.ln(gl, xc - 5, cy + 5, xc + 5, cy - 5, { stroke: C.red, "stroke-width": 2 });
    VZ.txt(gl, cx - R, cy + R + 24, "缝上的点：没有定义", { size: 12.5, fill: "rgba(242,236,223,.78)" });

    /* ---------- 右：盖楼 ---------- */
    var hx = 528, hy = 218, rx = 82, ry = 22, rise = 66;
    var gr = VZ.g(svg);
    VZ.txt(gr, hx - rx, 24, "新办法：盖楼", { size: 13, fill: "rgba(242,236,223,.86)", weight: "bold" });
    /* 楼梯井中轴 */
    VZ.ln(gr, hx, hy - rise * 2 - 30, hx, hy + 16, { stroke: "rgba(139,140,181,.35)", "stroke-width": 1, "stroke-dasharray": "3 4" });

    function helixP(t) {
      return [hx + rx * Math.cos(t), hy - ry * Math.sin(t) - (rise / TAU) * t];
    }
    var pts = [], i;
    for (i = 0; i <= 240; i++) pts.push(helixP(i / 240 * TAU * 2));
    VZ.poly(gr, pts, { stroke: C.ink, "stroke-width": 2.2, fill: "none", "stroke-linejoin": "round" });
    /* 每圈的「地板」：把同一圈的点用淡线连一下，像坡道的台阶 */
    for (var k = 0; k < 2; k++) {
      var f = [], t0 = k * TAU;
      for (i = 0; i <= 60; i++) {
        var t = t0 + i / 60 * TAU;
        var p = helixP(t);
        f.push([p[0], p[1] + 8]);
      }
      VZ.poly(gr, f, { stroke: "rgba(242,236,223,.20)", "stroke-width": 1, fill: "none" });
    }
    /* 层标 */
    for (i = 0; i < 3; i++) {
      var lp = helixP(i * TAU);
      VZ.circ(gr, lp[0], lp[1], 3.2, { fill: C.gold });
      VZ.txt(gr, lp[0] + 10, lp[1] - 4, "第 " + i + " 层", { size: 11, fill: "rgba(255,207,92,.85)" });
    }
    /* 金点（当前所在层）：一条虚线垂到它落脚的那一层，看得更清楚 */
    var dot = VZ.circ(gr, 0, 0, 6.5, { fill: C.gold, stroke: C.deep, "stroke-width": 2 });
    var drop = VZ.ln(gr, 0, 0, 0, 0, { stroke: "rgba(255,207,92,.45)", "stroke-width": 1.2, "stroke-dasharray": "3 3" });

    /* ---------- 中间的连接提示 ---------- */
    VZ.path(svg, "M" + (cx + R + 30) + " " + (cy - 30) + "L" + (hx - rx + 8) + " " + (hy - 10), {
      stroke: "rgba(255,176,138,.55)", "stroke-width": 1.6, fill: "none", "stroke-dasharray": "5 4"
    });
    VZ.txt(svg, cx + R + 34, cy - 38, "把缝的两边接起来", { size: 11.5, fill: "rgba(255,176,138,.9)" });

    var ctl = VZ.box(stage, "viz-ctl");
    var pan = VZ.panel(stage, { "绕行角 θ": "", "当前层": "", "同一个 z": "", "log z 的值": "" });
    VZ.slider(ctl, {
      label: "绕行角 θ", min: 0, max: 360, step: 1, value: theta * 180 / Math.PI,
      format: function (v) { return Math.round(v) + "°"; },
      onInput: function (v) { theta = v * Math.PI / 180; refresh(); }
    });
    VZ.btn(ctl, "绕满一圈", function () { theta = theta + TAU; refresh(); });
    VZ.btn(ctl, "复位", function () { theta = 0.85; refresh(); });

    function refresh() {
      var t = theta % TAU;
      var p = helixP(theta);
      var lp = helixP(Math.floor(theta / TAU) * TAU);
      dot.setAttribute("cx", p[0]); dot.setAttribute("cy", p[1]);
      drop.setAttribute("x1", p[0]); drop.setAttribute("y1", p[1]);
      drop.setAttribute("x2", lp[0]); drop.setAttribute("y2", lp[1]);
      var zx = Math.cos(t), zy = Math.sin(t);
      VZ.setPanel(pan, {
        "绕行角 θ": Math.round(theta * 180 / Math.PI) + "°",
        "当前层": "第 " + (Math.floor(theta / TAU) + 1) + " 层",
        "同一个 z": "z = cos θ + i sin θ = " + zx.toFixed(3) + " + " + zy.toFixed(3) + "i",
        "log z 的值": "iθ = " + (theta * 180 / Math.PI).toFixed(0) + "°（弧度 " + theta.toFixed(3) + "）"
      });
    }
    refresh();
  }
},

/* ------------------------------------------------------------
   PL5 · 流形：局部看起来都是平的
   一个起伏的曲面网格 + 放大滑块。放大到足够近，网格就是平的。
   ------------------------------------------------------------ */
"f-pl-local": {
  title: "",
  hint: "拖「放大倍数」：<b>远看</b>是一张起伏的曲面，<b>近看</b>它就摊成了一张平平的网。这就是流形的定义——<span class='hl'>每一点附近都能摊平</span>，哪怕整张面弯成一团。",
  draw: function (stage) {
    var W = 720, H = 320, C = VZ.C;
    var cv = VZ.canvas(stage, W, H, { maxDpr: 2 });
    var g = cv.ctx;
    var zoom = 1;

    function h(x, y) { return 0.62 * Math.sin(1.05 * x) * Math.cos(0.92 * y); }

    function draw() {
      g.clearRect(0, 0, W, H);
      g.fillStyle = C.deep; g.fillRect(0, 0, W, H);
      var cx = W / 2, cy = H / 2 + 18;
      var S = 40;                       /* 投影尺度 */
      var win = 3.0 / zoom;             /* 视野半宽 */
      var N = 13, M = 26;

      function px(x, y) {
        var hh = h(x, y);
        return [cx + (x - y) * S, cy + (x + y) * S * 0.46 - hh * S * 0.62];
      }

      /* 网格：两组线都画，靠画家算法排序 */
      var segs = [];
      var i, j;
      for (i = 0; i < N; i++) {
        var u = -win + 2 * win * i / (N - 1);
        for (j = 0; j < M - 1; j++) {
          var v0 = -win + 2 * win * j / (M - 1), v1 = -win + 2 * win * (j + 1) / (M - 1);
          var A = px(u, v0), B = px(u, v1);
          segs.push({ a: A, b: B, z: (u + v0) / 2, t: 0 });
        }
      }
      for (j = 0; j < N; j++) {
        var v = -win + 2 * win * j / (N - 1);
        for (i = 0; i < M - 1; i++) {
          var u0 = -win + 2 * win * i / (M - 1), u1 = -win + 2 * win * (i + 1) / (M - 1);
          var A2 = px(u0, v), B2 = px(u1, v);
          segs.push({ a: A2, b: B2, z: (u0 + v) / 2, t: 1 });
        }
      }
      segs.sort(function (A, B) { return A.z - B.z; });
      for (var k = 0; k < segs.length; k++) {
        var s = segs[k];
        var near = s.z < 0;
        g.beginPath();
        g.moveTo(s.a[0], s.a[1]); g.lineTo(s.b[0], s.b[1]);
        g.strokeStyle = s.t === 0
          ? (near ? "rgba(79,227,240,.42)" : "rgba(79,227,240,.16)")
          : (near ? "rgba(255,111,216,.38)" : "rgba(255,111,216,.14)");
        g.lineWidth = near ? 1.5 : 1;
        g.stroke();
      }
      /* 中心点（局部摊平的那个点） */
      var c0 = px(0, 0);
      g.beginPath(); g.arc(c0[0], c0[1], 6, 0, 6.2832);
      g.fillStyle = C.gold; g.fill();
      g.strokeStyle = C.deep; g.lineWidth = 2; g.stroke();

      /* 视野内最大起伏 */
      var mx = 0;
      for (i = 0; i <= 20; i++) for (j = 0; j <= 20; j++) {
        var x = -win + 2 * win * i / 20, y = -win + 2 * win * j / 20;
        mx = Math.max(mx, Math.abs(h(x, y)));
      }
      g.font = "11px -apple-system,PingFang SC,sans-serif";
      g.fillStyle = C.dim;
      g.fillText("视野：整个曲面  →  中心的一小块", 12, 20);
      g.fillStyle = mx < 0.18 ? C.green : (mx < 0.42 ? C.gold : C.red);
      g.fillText("视野内最大起伏 ≈ " + mx.toFixed(3), 12, H - 14);
      g.fillStyle = mx < 0.18 ? C.green : C.dim;
      g.fillText(mx < 0.18 ? "已经看起来是平的了" : "还看得出弯", 178, H - 14);
    }

    var ctl = VZ.box(stage, "viz-ctl");
    var pan = VZ.panel(stage, { "放大倍数": "", "视野大小": "", "看起来": "" });
    VZ.slider(ctl, {
      label: "放大倍数", min: 1, max: 14, step: 0.1, value: zoom,
      format: function (v) { return "×" + v.toFixed(1); },
      onInput: function (v) { zoom = v; refresh(); }
    });
    VZ.btn(ctl, "拉到最近", function () { zoom = 14; refresh(); });
    VZ.btn(ctl, "复位", function () { zoom = 1; refresh(); });

    function refresh() {
      draw();
      var win = 3.0 / zoom;
      var mx = 0, i, j;
      for (i = 0; i <= 20; i++) for (j = 0; j <= 20; j++) {
        var x = -win + 2 * win * i / 20, y = -win + 2 * win * j / 20;
        mx = Math.max(mx, Math.abs(h(x, y)));
      }
      VZ.setPanel(pan, {
        "放大倍数": "×" + zoom.toFixed(1),
        "视野大小": "边长 " + (2 * win).toFixed(2) + "（整个曲面是 6）",
        "看起来": mx < 0.18 ? "平的 —— 局部就是一张平面" : (mx < 0.42 ? "快平了" : "还是弯的")
      });
    }
    refresh();
  }
},

/* ------------------------------------------------------------
   PL6 · w = az + b：平移、旋转、缩放
   唯一一类「把整个平面搬到整个平面、不翻面、还保共形」的映射。
   ------------------------------------------------------------ */
"f-pl-linear": {
  title: "",
  hint: "拖三个滑块：<b>平移 b</b>、<b>旋转 θ</b>、<b>放大 a</b>。左边的单位圆与两条半径映到右边——<span class='hl'>圆还是圆，直线还是直线，夹角一分不差</span>。这类映射是全纯的，而且只有它能把整个平面搬到整个平面。",
  draw: function (stage) {
    var W = 720, H = 300, C = VZ.C;
    var cv = VZ.canvas(stage, W, H, { maxDpr: 2 });
    var g = cv.ctx;
    var th = 0.55, sc = 1.25, tx = 0.55, ty = 0.15;

    function map(x, y) {
      var c = Math.cos(th), s = Math.sin(th);
      return [sc * (c * x - s * y) + tx, sc * (s * x + c * y) + ty];
    }
    var PW = W / 2;
    var S = Math.min(PW, H) / 2 / 2.55;

    function P1(x, y) { return [PW * 0.5 + x * S, H / 2 - y * S]; }
    function P2(x, y) { var q = map(x, y); return [PW + PW * 0.5 + q[0] * S, H / 2 - q[1] * S]; }

    function axes(P, x0, x1) {
      g.save();
      g.beginPath(); g.rect(x0, 0, x1 - x0, H); g.clip();
      g.strokeStyle = "rgba(75,67,128,.55)"; g.lineWidth = 1;
      var i;
      for (i = -8; i <= 8; i++) {
        var x = i * 0.5;
        var a = P(x, -2.2), b = P(x, 2.2);
        g.beginPath(); g.moveTo(a[0], a[1]); g.lineTo(b[0], b[1]); g.stroke();
      }
      for (i = -5; i <= 5; i++) {
        var y = i * 0.5;
        var a2 = P(-2.4, y), b2 = P(2.4, y);
        g.beginPath(); g.moveTo(a2[0], a2[1]); g.lineTo(b2[0], b2[1]); g.stroke();
      }
      g.restore();
    }

    function draw() {
      g.clearRect(0, 0, W, H);
      g.fillStyle = C.deep; g.fillRect(0, 0, W, H);
      /* 两栏各自裁剪：右栏的网格是斜的，不能压到左栏 */
      g.save();
      g.beginPath(); g.rect(0, 0, PW, H); g.clip();
      axes(P1, 0, PW);
      g.restore();
      g.save();
      g.beginPath(); g.rect(PW, 0, PW, H); g.clip();
      axes(P2, PW, W);
      g.restore();
      /* 分栏线 */
      g.strokeStyle = "rgba(75,67,128,.55)"; g.lineWidth = 1;
      g.beginPath(); g.moveTo(PW, 8); g.lineTo(PW, H - 8); g.stroke();

      /* 原图形：单位圆 + 两条半径 */
      var seg = [], i;
      for (i = 0; i <= 64; i++) {
        var t = i / 64 * Math.PI * 2;
        seg.push([Math.cos(t), Math.sin(t)]);
      }
      function shape(P, col, lw) {
        g.beginPath();
        for (var i = 0; i < seg.length; i++) {
          var p = P(seg[i][0], seg[i][1]);
          i ? g.lineTo(p[0], p[1]) : g.moveTo(p[0], p[1]);
        }
        g.closePath();
        g.strokeStyle = col; g.lineWidth = lw; g.stroke();
        /* 两条半径：一条实轴、一条虚轴，映射后夹角应保持 90° */
        var o = P(0, 0), e1 = P(1, 0), e2 = P(0, 1);
        g.beginPath(); g.moveTo(o[0], o[1]); g.lineTo(e1[0], e1[1]);
        g.strokeStyle = col; g.lineWidth = lw * .85; g.stroke();
        g.beginPath(); g.moveTo(o[0], o[1]); g.lineTo(e2[0], e2[1]);
        g.strokeStyle = col; g.lineWidth = lw * .85; g.stroke();
        g.beginPath(); g.arc(o[0], o[1], 4, 0, 6.2832); g.fillStyle = col; g.fill();
      }
      shape(P1, C.gold, 2.4);
      shape(P2, C.green, 2.6);

      g.font = "11px -apple-system,PingFang SC,sans-serif";
      g.fillStyle = C.dim;
      g.fillText("z 平面", 10, 18);
      g.fillText("w 平面（w = az + b）", PW + 10, 18);
      g.fillStyle = C.gold;
      g.fillText("单位圆 + 两条半径", 10, H - 12);
      g.fillStyle = C.green;
      g.fillText("像：圆仍是圆，直线仍是直线", PW + 10, H - 12);
    }

    var ctl = VZ.box(stage, "viz-ctl");
    var pan = VZ.panel(stage, { "变换": "", "夹角": "", "单位圆的像": "", "结论": "" });
    VZ.slider(ctl, {
      label: "旋转 θ", min: -3.14, max: 3.14, step: 0.01, value: th,
      format: function (v) { return (v * 180 / Math.PI).toFixed(0) + "°"; },
      onInput: function (v) { th = v; refresh(); }
    });
    VZ.slider(ctl, {
      label: "放大 a", min: 0.2, max: 2.5, step: 0.01, value: sc,
      format: function (v) { return "×" + v.toFixed(2); },
      onInput: function (v) { sc = v; refresh(); }
    });
    VZ.slider(ctl, {
      label: "平移 b（实部）", min: -1.5, max: 1.5, step: 0.01, value: tx,
      format: function (v) { return v.toFixed(2); },
      onInput: function (v) { tx = v; refresh(); }
    });
    VZ.btn(ctl, "复位", function () { th = 0.55; sc = 1.25; tx = 0.55; ty = 0.15; refresh(); });

    function refresh() {
      draw();
      var c = Math.cos(th), s = Math.sin(th);
      VZ.setPanel(pan, {
        "变换": "w = " + sc.toFixed(2) + "·e^{i" + (th * 180 / Math.PI).toFixed(0) + "°}·z + (" + tx.toFixed(2) + ", " + ty.toFixed(2) + ")",
        "夹角": "90° → 90°（一分不差）",
        "单位圆的像": "圆心 (" + tx.toFixed(2) + ", " + ty.toFixed(2) + ")，半径 " + sc.toFixed(2),
        "结论": "旋转 + 放大 + 平移：保角、保定向、还保圆"
      });
    }
    refresh();
  }
},

/* ------------------------------------------------------------
   PL7 · 球面上的实轴与单位圆：转 90° 就换个身份
   ------------------------------------------------------------ */
"f-pl-rot": {
  title: "",
  hint: "拖「自转角 φ」把球转起来：<b>金圈</b>是实轴（连同 ∞ 一起的那条大圆），<b>青圈</b>是单位圆。转到 <b>90°</b> 时，金圈正好压在青圈上——<span class='hl'>在球面上，「哪条线叫实轴」只是你把球怎么转的问题</span>。",
  draw: function (stage) {
    var W = 760, H = 380, C = VZ.C, TAU = Math.PI * 2;
    var phi = 0;
    var api = VZ.stage3(stage, W, H, paint, { yaw: -0.55, pitch: 0.42, dist: 5.0 });

    function paint(ctx, w, h, fr) {
      var proj = fr.proj, R = 1.24;
      ctx.clearRect(0, 0, w, h);
      function sph(t, p) {
        var st = Math.sin(t);
        return [R * st * Math.cos(p), R * st * Math.sin(p), R * Math.cos(t)];
      }
      /* 球面网格 */
      var i, j, pts;
      for (i = 1; i < 7; i++) {
        var t = i / 7 * Math.PI;
        pts = [];
        for (j = 0; j <= 72; j++) pts.push(sph(t, j / 72 * TAU));
        VZ.m3wire(ctx, pts, proj, "rgba(201,194,230,.20)", 1);
      }
      for (j = 0; j < 10; j++) {
        var p = j / 10 * TAU;
        pts = [];
        for (i = 0; i <= 40; i++) pts.push(sph(i / 40 * Math.PI, p));
        VZ.m3wire(ctx, pts, proj, "rgba(201,194,230,.16)", 1);
      }
      /* 单位圆（赤道）——画成虚线：转到 90° 时金圈压上来，
         虚线还露在缝里，一眼看出「两者是同一条大圆」 */
      pts = [];
      for (i = 0; i <= 96; i++) { var a = i / 96 * TAU; pts.push([R * Math.cos(a), R * Math.sin(a), 0]); }
      /* 实轴大圆：绕 x 轴自转 φ
         实轴 = 过两极大圆（在 xz 平面里）；单位圆 = 赤道（在 xy 平面里）。
         绕 x 轴转 90°，xz 平面恰好转到 xy 平面 —— 实轴就压到单位圆上了。
         （绕 y 轴转是错的：那只是把这条大圆在自己平面里转，转多少都对不上。） */
      pts = [];
      for (i = 0; i <= 96; i++) {
        var b = i / 96 * TAU;
        pts.push([R * Math.sin(b), -R * Math.cos(b) * Math.sin(phi), R * Math.cos(b) * Math.cos(phi)]);
      }
      VZ.m3wire(ctx, pts, proj, C.gold, 3.2);
      /* 赤道画在金圈之上（虚线），重合时也看得见 */
      pts = [];
      for (i = 0; i <= 96; i++) { var a2 = i / 96 * TAU; pts.push([R * Math.cos(a2), R * Math.sin(a2), 0]); }
      VZ.m3wire(ctx, pts, proj, C.cyan, 2.2, [7, 6]);
      /* 两极 */
      VZ.m3sphere(ctx, [0, 0, R], proj, 5, C.cyan, null);
      VZ.m3sphere(ctx, [0, 0, -R], proj, 5, C.mag, null);
      /* 只在极点旁写 N / S，长说明交给左上角的图例——贴着球心写长字必打架 */
      var n0 = proj([0, 0, R * 1.06]), s0 = proj([0, 0, -R * 1.06]);
      ctx.font = "bold 12px -apple-system,PingFang SC,sans-serif";
      ctx.fillStyle = C.cyan;
      ctx.fillText("N", n0[0] + 9, n0[1] + 4);
      ctx.fillStyle = C.mag;
      ctx.fillText("S", s0[0] + 9, s0[1] + 4);
      /* 图例（放左上角，永远不与球上的东西打架） */
      ctx.font = "12px -apple-system,PingFang SC,sans-serif";
      var lx = 14, ly = 26;
      var legend = [
        [C.gold, "实轴（连同 ∞ 的一条大圆）"],
        [C.cyan, "单位圆（赤道，虚线）"],
        [C.cyan, "N：z = ∞"],
        [C.mag, "S：z = 0"]
      ];
      for (var li = 0; li < legend.length; li++) {
        if (li < 2) {
          ctx.fillStyle = legend[li][0];
          ctx.fillRect(lx, ly - 8, 14, 3);
        } else {
          ctx.beginPath(); ctx.arc(lx + 7, ly - 6, 4.5, 0, 6.2832);
          ctx.fillStyle = legend[li][0]; ctx.fill();
        }
        ctx.fillStyle = "rgba(242,236,223,.72)";
        ctx.fillText(legend[li][1], lx + 22, ly);
        ly += 19;
      }
      /* 状态 */
      ctx.font = "11px -apple-system,PingFang SC,sans-serif";
      ctx.fillStyle = "rgba(255,255,255,.34)";
      ctx.fillText("拖动旋转视角 · 滚轮缩放", w - 150, 18);
      var deg = (phi * 180 / Math.PI) % 360;
      ctx.fillStyle = Math.abs(deg - 90) < 2 ? C.green : C.dim;
      ctx.fillText(Math.abs(deg - 90) < 2
        ? "金圈已经压在青圈上 —— 实轴与单位圆平权"
        : "自转 " + deg.toFixed(0) + "°（转到 90° 就重合）", 14, h - 12);
    }

    var ctl = VZ.box(stage, "viz-ctl");
    var pan = VZ.panel(stage, { "自转角 φ": "", "实轴": "", "单位圆": "", "结论": "" });
    var sld = VZ.slider(ctl, {
      label: "自转角 φ", min: 0, max: 360, step: 1, value: 0,
      format: function (v) { return v.toFixed(0) + "°"; },
      onInput: function (v) { phi = v * Math.PI / 180; refresh(); }
    });
    VZ.btn(ctl, "转到 90°", function () { phi = Math.PI / 2; sld.set(90); refresh(); });
    VZ.btn(ctl, "复位", function () { phi = 0; sld.set(0); refresh(); });

    function refresh() {
      api.redraw();
      var deg = (phi * 180 / Math.PI) % 360;
      VZ.setPanel(pan, {
        "自转角 φ": deg.toFixed(0) + "°",
        "实轴": "球上的一条大圆（含 ∞）",
        "单位圆": "赤道，也是球上的一条大圆（虚线）",
        "结论": Math.abs(deg - 90) < 2
          ? "两者重合 —— 球面上没有「哪条更根本」"
          : "转 90° 就能把实轴搬成单位圆"
      });
    }
    refresh();
  }
},

/* ------------------------------------------------------------
   PL8 · 3g − 3：复模的个数与自变换的自由度
   ------------------------------------------------------------ */
"f-pl-moduli": {
  title: "",
  hint: "拖「亏格 g」：<b>金点</b>是复模（形状参数）的个数，<b>紫点</b>是连续自变换需要的复参数个数。<span class='hl'>两者的差永远是 3g − 3</span>——亏格 0 和 1 也不例外，只是那时候复模不再按 3g−3 数。",
  draw: function (stage) {
    var W = 720, H = 300, C = VZ.C;
    var svg = VZ.S(stage, W, H, { bg: C.deep });
    var g0 = 2;

    function mv(g) {
      if (g === 0) return { m: 0, s: 3 };
      if (g === 1) return { m: 1, s: 1 };
      return { m: 3 * g - 3, s: 0 };
    }

    var rowM = VZ.g(svg), rowS = VZ.g(svg);
    function clear(g) { while (g.firstChild) g.removeChild(g.firstChild); }
    function render() {
      clear(rowM); clear(rowS);
      var d = mv(g0);
      VZ.txt(rowM, 18, 88, "复模（形状参数）m = " + d.m, { size: 13, fill: "rgba(255,207,92,.95)" });
      VZ.txt(rowS, 18, 168, "自变换自由度 s = " + d.s, { size: 13, fill: "rgba(155,140,255,.95)" });
      var i;
      for (i = 0; i < d.m; i++) VZ.circ(rowM, 250 + i * 21, 83, 7, { fill: C.gold });
      for (i = 0; i < d.s; i++) VZ.circ(rowS, 250 + i * 21, 163, 7, { fill: C.violet });
      if (d.m === 0) VZ.txt(rowM, 250, 88, "（没有——球面没有形状可言）", { size: 12, fill: "rgba(255,207,92,.6)" });
      if (d.s === 0) VZ.txt(rowS, 250, 168, "（没有——自变换只有离散的）", { size: 12, fill: "rgba(155,140,255,.6)" });
      /* 结论 */
      VZ.txt(svg, 18, 46, "亏格 g = " + g0, { size: 17, fill: "rgba(242,236,223,.92)", weight: "bold" });
      VZ.txt(svg, 18, 224, "m − s = " + (d.m - d.s) + "　=　3g − 3 = " + (3 * g0 - 3),
        { size: 17, fill: C.green, weight: "bold" });
      VZ.txt(svg, 18, 252, g0 === 2 ? "g = 2 就有三个复模（双曲平面上的一片）"
        : (g0 === 1 ? "g = 1 只剩一个复模 τ（环面的胖瘦）"
        : (g0 === 0 ? "g = 0 是球面：没有形状参数，自变换却最自由"
        : "g ≥ 2：复模个数按 3g − 3 数")),
        { size: 12.5, fill: "rgba(242,236,223,.72)" });
      VZ.txt(svg, 18, 274, "公式 m − s = 3g − 3 对 g = 0, 1 照样成立；只是那时 m 不等于 3g − 3",
        { size: 11.5, fill: "rgba(255,255,255,.34)" });
    }

    var ctl = VZ.box(stage, "viz-ctl");
    var pan = VZ.panel(stage, { "亏格 g": "", "复模 m": "", "自由度 s": "", "m − s": "" });
    var sld = VZ.slider(ctl, {
      label: "亏格 g", min: 0, max: 8, step: 1, value: g0,
      format: function (v) { return v.toFixed(0); },
      onInput: function (v) { g0 = v; refresh(); }
    });
    var chipWrap = VZ.chips(ctl, ["0 球面", "1 环面", "2 双环面", "3 椒盐卷饼"], "2 双环面", function (k) {
      g0 = parseInt(k.charAt(0), 10); sld.set(g0); refresh();
    });

    function refresh() {
      render();
      var d = mv(g0);
      /* 滑块动了，芯片的高亮要跟上，别停在旧的那一个 */
      Array.prototype.forEach.call(chipWrap.querySelectorAll(".viz-chip"), function (b, i) {
        if (i === g0) b.classList.add("on"); else b.classList.remove("on");
      });
      VZ.setPanel(pan, {
        "亏格 g": g0.toFixed(0),
        "复模 m": d.m.toFixed(0),
        "自由度 s": d.s.toFixed(0),
        "m − s": (d.m - d.s) + " = 3g − 3 = " + (3 * g0 - 3)
      });
    }
    refresh();
  }
},

/* ------------------------------------------------------------
   PL9 · 茹科夫斯基变换：w = ½(z + 1/z) 把圆拉成机翼
   z 平面上取一个「过 z = −1 的圆」：圆心在 −a，半径 1 − a。
   它经过 z = −1（那里 1/z 冲到 ∞），像的尾缘因此收成一道尖。
   ------------------------------------------------------------ */
"f-pl-joukowski": {
  title: "",
  hint: "拖<b>金点</b>看它在机翼上的像；拖「圆心离原点的距离 a」改变机翼的胖瘦。<span class='hl'>圆经过 z = −1</span>（那里 1/z 冲到 ∞），机翼的尾缘因此收成一道尖；a 越小，机翼越薄。",
  draw: function (stage) {
    var W = 720, H = 330, C = VZ.C, TAU = Math.PI * 2;
    var cv = VZ.canvas(stage, W, H, { maxDpr: 2 });
    var g = cv.ctx;
    var a = 0.15, tt = 2.1;

    var PW = W / 2;
    var SL = 132;                       /* 左栏比例 */
    var OX = -1.35, OY = 0;             /* 左栏视野起点 */
    function P1(x, y) { return [24 + (x - OX) * SL, H / 2 - (y - OY) * SL]; }

    /* 右栏：按像的实际外接框等比摆放，机翼永远在栏内居中 */
    var SR = 100, EX = null;
    function jouk(zx, zy) {
      var d = zx * zx + zy * zy;
      return [0.5 * (zx + zx / d), 0.5 * (zy - zy / d)];
    }
    function imgExtent() {
      var c = -a, r = 1 - a;
      var x0 = 1e9, x1 = -1e9, y0 = 1e9, y1 = -1e9;
      for (var i = 0; i <= 360; i++) {
        var t = i / 360 * TAU;
        var zx = c + r * Math.cos(t), zy = r * Math.sin(t);
        var w = jouk(zx, zy);
        x0 = Math.min(x0, w[0]); x1 = Math.max(x1, w[0]);
        y0 = Math.min(y0, w[1]); y1 = Math.max(y1, w[1]);
      }
      return { x0: x0, x1: x1, y0: y0, y1: y1, w: x1 - x0, h: y1 - y0 };
    }
    function setSR() {
      var e = imgExtent();
      SR = Math.min((PW - 70) / Math.max(1e-4, e.w), (H - 90) / Math.max(1e-4, e.h));
      EX = e;
    }
    function P2(x, y) {
      var e = EX;
      var ccx = (e.x0 + e.x1) / 2, ccy = (e.y0 + e.y1) / 2;
      return [PW + PW / 2 + (x - ccx) * SR, H / 2 - (y - ccy) * SR];
    }

    function draw() {
      g.clearRect(0, 0, W, H);
      g.fillStyle = C.deep; g.fillRect(0, 0, W, H);
      var c = -a, r = 1 - a;

      /* 左栏网格 */
      g.save();
      g.beginPath(); g.rect(0, 0, PW, H); g.clip();
      g.strokeStyle = "rgba(75,67,128,.45)"; g.lineWidth = 1;
      var i;
      for (i = -6; i <= 4; i++) {
        var p1 = P1(i * 0.25, -1.1), p2 = P1(i * 0.25, 1.1);
        g.beginPath(); g.moveTo(p1[0], p1[1]); g.lineTo(p2[0], p2[1]); g.stroke();
      }
      for (i = -4; i <= 4; i++) {
        var p3 = P1(-1.35, i * 0.25), p4 = P1(0.7, i * 0.25);
        g.beginPath(); g.moveTo(p3[0], p3[1]); g.lineTo(p4[0], p4[1]); g.stroke();
      }
      g.restore();
      /* 右栏网格（跟着变换一起转） */
      g.save();
      g.beginPath(); g.rect(PW, 0, PW, H); g.clip();
      g.strokeStyle = "rgba(75,67,128,.38)"; g.lineWidth = 1;
      for (i = -8; i <= 4; i++) {
        var q1 = P2(i * 0.25, -1.1), q2 = P2(i * 0.25, 1.1);
        g.beginPath(); g.moveTo(q1[0], q1[1]); g.lineTo(q2[0], q2[1]); g.stroke();
      }
      for (i = -4; i <= 4; i++) {
        var q3 = P2(-2, i * 0.25), q4 = P2(2, i * 0.25);
        g.beginPath(); g.moveTo(q3[0], q3[1]); g.lineTo(q4[0], q4[1]); g.stroke();
      }
      g.restore();
      /* 分栏线 */
      g.strokeStyle = "rgba(75,67,128,.55)"; g.lineWidth = 1;
      g.beginPath(); g.moveTo(PW, 8); g.lineTo(PW, H - 8); g.stroke();

      /* 左：过 −1 的圆 */
      var pc = P1(c, 0);
      g.beginPath(); g.arc(pc[0], pc[1], r * SL, 0, TAU);
      g.strokeStyle = C.gold; g.lineWidth = 2.6; g.stroke();
      /* 原点 */
      var po = P1(0, 0);
      g.beginPath(); g.arc(po[0], po[1], 4, 0, TAU); g.fillStyle = C.ink; g.fill();
      /* z = −1（尾缘的来源） */
      var pm = P1(-1, 0);
      g.beginPath(); g.arc(pm[0], pm[1], 5.5, 0, TAU);
      g.fillStyle = C.red; g.fill(); g.strokeStyle = C.deep; g.lineWidth = 2; g.stroke();
      g.font = "10.5px -apple-system,PingFang SC,sans-serif";
      g.fillStyle = C.red;
      /* 标签右对齐到红点左边 10px：写死偏移会把「1」压在点底下 */
      g.fillText("z = −1", pm[0] - 12 - g.measureText("z = −1").width, pm[1] + 22);

      /* 右：机翼 */
      g.beginPath();
      for (i = 0; i <= 360; i++) {
        var t = i / 360 * TAU;
        var zx = c + r * Math.cos(t), zy = r * Math.sin(t);
        var w = jouk(zx, zy);
        var q = P2(w[0], w[1]);
        i ? g.lineTo(q[0], q[1]) : g.moveTo(q[0], q[1]);
      }
      g.closePath();
      g.strokeStyle = C.green; g.lineWidth = 2.8; g.stroke();
      g.fillStyle = "rgba(94,224,138,.10)"; g.fill();
      /* 尾缘（尖，w = −1）与前缘（圆头，w 的最大实部） */
      var te = P2(-1, 0);
      g.beginPath(); g.arc(te[0], te[1], 4, 0, TAU); g.fillStyle = C.red; g.fill();
      g.fillStyle = C.red; g.fillText("尾缘", te[0] - 30, te[1] + 4);
      var le = P2(EX.x1, (EX.y0 + EX.y1) / 2);
      g.fillStyle = "rgba(94,224,138,.9)"; g.fillText("前缘", le[0] + 8, le[1] + 4);

      /* 金点与其像 */
      var zx2 = c + r * Math.cos(tt), zy2 = r * Math.sin(tt);
      var pp = P1(zx2, zy2);
      g.beginPath(); g.arc(pp[0], pp[1], 7, 0, TAU);
      g.fillStyle = C.gold; g.fill(); g.strokeStyle = C.deep; g.lineWidth = 2; g.stroke();
      var w2 = jouk(zx2, zy2);
      var pq = P2(w2[0], w2[1]);
      g.beginPath(); g.arc(pq[0], pq[1], 7, 0, TAU);
      g.fillStyle = C.gold; g.fill(); g.strokeStyle = C.deep; g.lineWidth = 2; g.stroke();

      g.font = "11px -apple-system,PingFang SC,sans-serif";
      g.fillStyle = C.dim;
      g.fillText("z 平面：过 −1 的圆", 10, 18);
      g.fillText("w 平面：机翼截面", PW + 10, 18);
      g.fillStyle = "rgba(255,255,255,.34)";
      g.fillText("拖金点看它在机翼上的像", 10, H - 12);
    }

    var dragging = false;
    function pickT(e) {
      var r = cv.cv.getBoundingClientRect();
      var sx = (e.clientX - r.left) / r.width * W;
      var sy = (e.clientY - r.top) / r.height * H;
      var c = -a, rr = 1 - a;
      var zx = (sx - 24) / SL + OX, zy = -(sy - H / 2) / SL + OY;
      tt = Math.atan2(zy, zx - c);
      refresh();
    }
    cv.cv.addEventListener("pointerdown", function (e) {
      var r = cv.cv.getBoundingClientRect();
      if ((e.clientX - r.left) / r.width * W > PW) return;
      dragging = true; pickT(e);
      cv.cv.setPointerCapture && cv.cv.setPointerCapture(e.pointerId);
    });
    cv.cv.addEventListener("pointermove", function (e) { if (dragging) pickT(e); });
    cv.cv.addEventListener("pointerup", function () { dragging = false; });

    var ctl = VZ.box(stage, "viz-ctl");
    var pan = VZ.panel(stage, { "圆的参数 a": "", "弦长": "", "最大厚度": "", "拖动点": "" });
    VZ.slider(ctl, {
      label: "圆心离原点 a", min: 0.06, max: 0.45, step: 0.005, value: a,
      format: function (v) { return "a = " + v.toFixed(3); },
      onInput: function (v) { a = v; setSR(); refresh(); }
    });
    VZ.btn(ctl, "复位", function () { a = 0.15; tt = 2.1; setSR(); refresh(); });

    function refresh() {
      draw();
      var e = imgExtent();
      var c = -a, r = 1 - a;
      var zx = c + r * Math.cos(tt), zy = r * Math.sin(tt);
      var w = jouk(zx, zy);
      VZ.setPanel(pan, {
        "圆的参数 a": "a = " + a.toFixed(3) + "（半径 " + r.toFixed(3) + "，过 z = −1）",
        "弦长": e.w.toFixed(4),
        "最大厚度": e.h.toFixed(4),
        "拖动点": "z = " + zx.toFixed(3) + " + " + zy.toFixed(3) + "i　→　w = " + w[0].toFixed(3) + " + " + w[1].toFixed(3) + "i"
      });
    }
    setSR();
    refresh();
  }
},

/* ------------------------------------------------------------
   PL10 · 正频率：半边频谱为零
   §9.5 那一页的第一件事。左：f(χ) 的实部/虚部；右：|g(p)|。
   拖 ω 看峰始终落在 p = −ω，p > 0 那一侧永远是空的。
   ------------------------------------------------------------ */
"f-pl-freqspec": {
  title: "",
  hint: "",
  draw: function (stage) {
    var C = VZ.C;
    var nar = (stage.clientWidth || 720) < 560;
    var W = nar ? 460 : 720, H = nar ? 430 : 300;
    var cv = VZ.canvas(stage, W, H, { maxDpr: 2 });
    var g = cv.ctx;
    var SIG = 2, om = 3, sign = -1;
    var A = nar ? { x: 0, y: 0, w: W, h: H / 2 - 12 } : { x: 0, y: 0, w: W / 2, h: H };
    var B = nar ? { x: 0, y: H / 2 + 6, w: W, h: H / 2 - 12 } : { x: W / 2, y: 0, w: W / 2, h: H };
    var F = "10.5px -apple-system,PingFang SC,sans-serif";

    function draw() {
      g.clearRect(0, 0, W, H);
      var S = Math.min(A.w, A.h) / 2 / 6.2;
      var ax = A.x + A.w / 2, ay = A.y + A.h / 2;
      var bx = B.x + B.w / 2, by = B.y + B.h / 2;
      var i, x, y, px, py;

      /* 左：f(χ) */
      g.beginPath(); g.moveTo(A.x, ay); g.lineTo(A.x + A.w, ay);
      g.strokeStyle = "rgba(255,255,255,.12)"; g.lineWidth = 1; g.stroke();
      g.beginPath();
      for (i = 0; i <= 420; i++) {
        x = -5.5 + 11 * i / 420;
        y = sign * Math.sin(om * x) * Math.exp(-x * x / (2 * SIG * SIG));
        px = ax + x * S; py = ay - y * S;
        i ? g.lineTo(px, py) : g.moveTo(px, py);
      }
      g.setLineDash([4, 3]); g.strokeStyle = "rgba(255,207,92,.42)"; g.lineWidth = 1.6; g.stroke();
      g.setLineDash([]);
      g.beginPath();
      for (i = 0; i <= 420; i++) {
        x = -5.5 + 11 * i / 420;
        y = Math.cos(sign * om * x) * Math.exp(-x * x / (2 * SIG * SIG));
        px = ax + x * S; py = ay - y * S;
        i ? g.lineTo(px, py) : g.moveTo(px, py);
      }
      g.strokeStyle = C.gold; g.lineWidth = 2.2; g.stroke();

      g.font = F; g.textAlign = "left"; g.textBaseline = "alphabetic";
      g.fillStyle = C.dim;
      g.fillText("f(χ)　实部 / 虚部", A.x + 10, A.y + 18);
      g.fillStyle = C.gold;
      g.fillText("e^" + (sign < 0 ? "−" : "+") + "i·" + om.toFixed(1) + "·χ · 高斯包络", A.x + 10, A.y + 34);

      /* 右：|g(p)|，p>0 用底色标出来 */
      var p0 = sign * om;
      g.fillStyle = "rgba(255,122,122,.13)";
      g.fillRect(bx, B.y, B.x + B.w - bx, B.h);
      g.beginPath(); g.moveTo(B.x, by); g.lineTo(B.x + B.w, by);
      g.strokeStyle = "rgba(255,255,255,.12)"; g.lineWidth = 1; g.stroke();
      function gf(p) { return SIG * Math.exp(-SIG * SIG * (p - p0) * (p - p0) / 2); }
      g.beginPath();
      for (i = 0; i <= 420; i++) {
        var p = -6.2 + 12.4 * i / 420;
        px = bx + p * S; py = by - gf(p) * S;
        i ? g.lineTo(px, py) : g.moveTo(px, py);
      }
      g.strokeStyle = C.cyan; g.lineWidth = 2.6; g.stroke();
      var pkx = bx + p0 * S, pky = by - gf(p0) * S;
      g.beginPath(); g.setLineDash([3, 3]);
      g.moveTo(pkx, by); g.lineTo(pkx, pky);
      g.strokeStyle = "rgba(79,227,240,.45)"; g.lineWidth = 1.2; g.stroke();
      g.setLineDash([]);
      g.beginPath(); g.arc(pkx, pky, 5, 0, Math.PI * 2);
      g.fillStyle = C.cyan; g.fill();
      g.strokeStyle = C.deep; g.lineWidth = 2; g.stroke();
      g.font = F; g.fillStyle = C.cyan;
      g.fillText("p = " + p0.toFixed(2), pkx + (p0 < 0 ? -58 : 10), pky - 10);
      g.fillStyle = C.dim;
      g.fillText("|g(p)|", B.x + 10, B.y + 18);
      g.fillStyle = "rgba(255,122,122,.9)";
      g.fillText("p > 0：定义要求这里恒为 0", B.x + B.w - 168, B.y + B.h - 10);
    }

    var ctl = VZ.box(stage, "viz-ctl");
    var pan = VZ.panel(stage, { "峰落在": "", "p>0 一侧": "", "结论": "" });
    VZ.chips(ctl, ["e^(−iωχ)　彭罗斯", "e^(+iωχ)　另一套"], "e^(−iωχ)　彭罗斯", function (k) {
      sign = k.charAt(2) === "−" ? -1 : 1; draw(); refresh();
    });
    VZ.slider(ctl, {
      label: "ω", min: 0.5, max: 5, step: 0.1, value: om,
      format: function (v) { return v.toFixed(1); },
      onInput: function (v) { om = v; draw(); refresh(); }
    });
    function refresh() {
      var p0 = sign * om;
      var res = Math.max(SIG * Math.exp(-SIG * SIG * (0.001 - p0) * (0.001 - p0) / 2),
                         SIG * Math.exp(-SIG * SIG * (6 - p0) * (6 - p0) / 2));
      VZ.setPanel(pan, {
        "峰落在": "p = " + p0.toFixed(2) + "（= " + (sign < 0 ? "−" : "+") + "ω）",
        "p>0 一侧": "|g| 最大只有 " + res.toExponential(1),
        "结论": sign < 0 ? "两句话是同一件事" : "换了约定，峰翻面，仍等价"
      });
    }
    draw(); refresh();
  }
},

/* ------------------------------------------------------------
   PL11 · 「正」说的是能量，不是 p
   拖 E：p = −E/ħ 跟着翻号，而「正频率」这个称呼也跟着跑到另一边。
   ------------------------------------------------------------ */
"f-pl-freqenergy": {
  title: "",
  hint: "",
  draw: function (stage) {
    var C = VZ.C;
    var nar = (stage.clientWidth || 720) < 560;
    var W = nar ? 460 : 720, H = nar ? 250 : 240;
    var cv = VZ.canvas(stage, W, H, { maxDpr: 2 });
    var g = cv.ctx;
    var E = 2, F = "11px -apple-system,PingFang SC,sans-serif";
    var cy = H * 0.56;

    function draw() {
      g.clearRect(0, 0, W, H);
      var S = Math.min(W, H) / 2 / 3.4, cx = W / 2, p = -E;
      g.beginPath(); g.moveTo(16, cy); g.lineTo(W - 16, cy);
      g.strokeStyle = "rgba(255,255,255,.16)"; g.lineWidth = 1.4; g.stroke();
      var px = cx + p * S;
      g.beginPath(); g.moveTo(cx, cy); g.lineTo(px, cy);
      g.strokeStyle = p < 0 ? C.green : C.red; g.lineWidth = 3.2; g.stroke();
      var d = p < 0 ? -1 : 1;
      g.beginPath(); g.moveTo(px, cy); g.lineTo(px - d * 9, cy - 6); g.lineTo(px - d * 9, cy + 6);
      g.closePath(); g.fillStyle = p < 0 ? C.green : C.red; g.fill();
      g.beginPath(); g.arc(px, cy, 6.5, 0, Math.PI * 2);
      g.fillStyle = p < 0 ? C.green : C.red; g.fill();
      g.strokeStyle = C.deep; g.lineWidth = 2.2; g.stroke();
      g.font = F; g.textAlign = "left";
      g.fillStyle = p < 0 ? C.green : C.red;
      g.fillText("p = " + p.toFixed(2), px + (p < 0 ? -56 : 12), cy - 14);
      g.fillStyle = C.dim; g.fillText("0", cx - 3, cy + 18);
      g.fillStyle = C.ink;
      g.fillText("能量 E = " + E.toFixed(1) + (E >= 0 ? "　正能量" : "　负能量"), 14, 22);
      g.fillStyle = p < 0 ? C.green : C.red;
      g.fillText("p = −E/ħ = " + p.toFixed(2) + (p < 0 ? "　→ 正频率" : "　→ 负频率"), 14, 42);
      g.fillStyle = C.dim; g.font = "10px -apple-system,PingFang SC,sans-serif";
      g.fillText("ψ(t) = ψ(0)·e^(−iEt/ħ)　写成标准形 e^(ipχ)　⇒　p = −E/ħ", 14, H - 12);
    }

    var ctl = VZ.box(stage, "viz-ctl");
    var s = VZ.slider(ctl, {
      label: "能量 E", min: -3, max: 3, step: 0.1, value: E,
      format: function (v) { return v.toFixed(1); },
      onInput: function (v) { E = v; draw(); refresh(); }
    });
    VZ.btn(ctl, "回到 E = +2", function () { E = 2; s.set(2); draw(); refresh(); });
    var pan = VZ.panel(stage, { "能量": "", "p = −E/ħ": "", "叫法": "" });
    function refresh() {
      var p = -E;
      VZ.setPanel(pan, {
        "能量": "E = " + E.toFixed(2) + "（ħ = 1）",
        "p = −E/ħ": "p = " + p.toFixed(2),
        "叫法": p < 0 ? "正频率（p<0，但能量是正的）" : "负频率（p>0，能量却是负的）"
      });
    }
    draw(); refresh();
  }
},

/* ------------------------------------------------------------
   PL12 · χ 平面 ↔ 黎曼球：实圆把球劈成两半
   左：复平面（上半/下半着色）；右：球面上那条「实圆」。
   注意：正交投影下，分界是**朝向镜头的那半大圆弧**，不是椭圆的里外。
   ------------------------------------------------------------ */
"f-pl-freqhalf": {
  title: "",
  hint: "",
  draw: function (stage) {
    var C = VZ.C;
    var nar = (stage.clientWidth || 720) < 560;
    var W = nar ? 460 : 720, H = nar ? 520 : 330;
    var cv = VZ.canvas(stage, W, H, { maxDpr: 2 });
    var g = cv.ctx;
    var TH = 55 * Math.PI / 180, eta = 0;
    var A = nar ? { x: 0, y: 0, w: W, h: H / 2 - 10 } : { x: 0, y: 0, w: W / 2, h: H };
    var B = nar ? { x: 0, y: H / 2 + 6, w: W, h: H / 2 - 10 } : { x: W / 2, y: 0, w: W / 2, h: H };
    var F = "10.5px -apple-system,PingFang SC,sans-serif";

    function proj(X, Y, Z, R, cx, cy) {
      var Zp = Y * Math.sin(TH) + Z * Math.cos(TH);
      return [cx + X * R, cy - Zp * R];
    }
    function depth(X, Y, Z) { return Y * Math.cos(TH) - Z * Math.sin(TH); }

    function draw() {
      g.clearRect(0, 0, W, H);
      var i;

      /* ---- 左：χ 复平面 ---- */
      var S = Math.min(A.w, A.h) / 2 / 2.2;
      var ax = A.x + A.w / 2, ay = A.y + A.h / 2;
      g.save(); g.beginPath(); g.rect(A.x, A.y, A.w, A.h); g.clip();
      g.fillStyle = "rgba(255,122,122,.15)"; g.fillRect(A.x, A.y, A.w, A.h / 2);
      g.fillStyle = "rgba(106,168,255,.17)"; g.fillRect(A.x, ay, A.w, A.h / 2);
      g.beginPath(); g.moveTo(A.x, ay); g.lineTo(A.x + A.w, ay);
      g.strokeStyle = "rgba(255,207,92,.55)"; g.lineWidth = 2; g.stroke();
      var px = ax + 0.6 * S, py = ay - eta * S;
      g.beginPath(); g.moveTo(ax, ay); g.lineTo(px, py);
      g.strokeStyle = "rgba(242,236,223,.35)"; g.lineWidth = 1.2; g.stroke();
      g.beginPath(); g.arc(px, py, 7, 0, Math.PI * 2);
      g.fillStyle = eta < 0 ? C.blue : (eta > 0 ? C.red : C.gold); g.fill();
      g.strokeStyle = C.deep; g.lineWidth = 2; g.stroke();
      g.font = F; g.textAlign = "left";
      g.fillStyle = C.dim;
      g.fillText("χ 复平面", A.x + 10, A.y + 18);
      g.fillStyle = "rgba(255,122,122,.85)";
      g.fillText("Im χ > 0", A.x + 10, A.y + 34);
      g.fillStyle = "rgba(106,168,255,.9)";
      g.fillText("Im χ < 0（「外侧」）", A.x + 10, A.y + A.h - 10);
      g.fillStyle = "rgba(255,207,92,.9)";
      g.fillText("实轴 + ∞ = 实圆", A.x + 10, ay - 9);
      g.fillStyle = C.ink;
      g.fillText("χ = 0.6" + (eta >= 0 ? "+" : "−") + Math.abs(eta).toFixed(2) + "i", px + 11, py - 9);
      g.restore();

      /* ---- 右：黎曼球 ---- */
      var R = Math.min(B.w, B.h) * (nar ? 0.30 : 0.34);
      var cx = B.x + B.w / 2, cy = B.y + B.h / 2;
      var cst = Math.cos(TH);
      var front = [], k, t;
      for (k = 0; k <= 72; k++) {
        t = Math.PI + k / 72 * Math.PI;
        front.push([cx + Math.cos(t) * R, cy - Math.sin(t) * cst * R]);
      }
      /* 上侧半球（默认淡；点落在这一半时点亮） */
      g.beginPath(); g.moveTo(front[0][0], front[0][1]);
      for (k = 0; k < front.length; k++) g.lineTo(front[k][0], front[k][1]);
      g.arc(cx, cy, R, 0, Math.PI, true); g.closePath();
      g.fillStyle = eta > 0 ? "rgba(255,122,122,.28)" : "rgba(255,122,122,.09)"; g.fill();
      /* 下侧（外侧）半球 */
      g.beginPath(); g.moveTo(front[0][0], front[0][1]);
      for (k = 0; k < front.length; k++) g.lineTo(front[k][0], front[k][1]);
      g.arc(cx, cy, R, 0, Math.PI, false); g.closePath();
      g.fillStyle = eta < 0 ? "rgba(106,168,255,.32)" : "rgba(106,168,255,.11)"; g.fill();
      /* 经纬网 */
      g.save(); g.beginPath(); g.arc(cx, cy, R, 0, Math.PI * 2); g.clip();
      g.strokeStyle = "rgba(75,67,128,.85)"; g.lineWidth = 1;
      var b, l, pt, sb, cb;
      for (b = -1; b <= 1; b++) {
        sb = Math.sin(b * Math.PI / 4); cb = Math.cos(b * Math.PI / 4);
        g.beginPath();
        for (k = 0; k <= 60; k++) {
          l = k / 60 * Math.PI * 2;
          pt = proj(cb * Math.cos(l), sb, cb * Math.sin(l), R, cx, cy);
          k ? g.lineTo(pt[0], pt[1]) : g.moveTo(pt[0], pt[1]);
        }
        g.stroke();
      }
      for (k = 0; k < 4; k++) {
        l = k / 4 * Math.PI * 2;
        g.beginPath();
        for (i = 0; i <= 40; i++) {
          b = -Math.PI / 2 + i / 40 * Math.PI;
          pt = proj(Math.cos(b) * Math.cos(l), Math.sin(b), Math.cos(b) * Math.sin(l), R, cx, cy);
          i ? g.lineTo(pt[0], pt[1]) : g.moveTo(pt[0], pt[1]);
        }
        g.stroke();
      }
      g.restore();
      g.beginPath(); g.arc(cx, cy, R, 0, Math.PI * 2);
      g.strokeStyle = "rgba(242,236,223,.28)"; g.lineWidth = 1.5; g.stroke();
      /* 实圆：背面虚线，正面粗实线 */
      g.setLineDash([4, 3]); g.beginPath();
      for (k = 0; k <= 72; k++) {
        t = k / 72 * Math.PI;
        pt = proj(Math.cos(t), 0, Math.sin(t), R, cx, cy);
        k ? g.lineTo(pt[0], pt[1]) : g.moveTo(pt[0], pt[1]);
      }
      g.strokeStyle = "rgba(255,207,92,.32)"; g.lineWidth = 1.5; g.stroke();
      g.setLineDash([]);
      g.beginPath();
      for (k = 0; k < front.length; k++) front[k][0] && g.lineTo(front[k][0], front[k][1]);
      g.strokeStyle = C.gold; g.lineWidth = 2.6; g.stroke();
      /* 点只在左边复平面里走：球是「劈成两半」的概念图，
         正交投影下背面点会落到错的色块里，画上去反而误导。 */
      g.font = F; g.fillStyle = C.dim;
      g.fillText("实圆把球劈成两半", B.x + 10, B.y + 18);
      g.fillStyle = "rgba(255,122,122,.85)"; g.fillText("上：Im χ > 0", B.x + 10, B.y + 34);
      g.fillStyle = "rgba(106,168,255,.9)";
      g.fillText("下：「外侧」= Im χ < 0", B.x + 10, B.y + B.h - 10);
    }

    var ctl = VZ.box(stage, "viz-ctl");
    var s = VZ.slider(ctl, {
      label: "η = Im χ", min: -1.3, max: 1.3, step: 0.02, value: 0,
      format: function (v) { return v.toFixed(2); },
      onInput: function (v) { eta = v; draw(); refresh(); }
    });
    VZ.btn(ctl, "走进下半平面", function () { eta = -1.0; s.set(-1.0); draw(); refresh(); });
    VZ.btn(ctl, "回到实轴", function () { eta = 0; s.set(0); draw(); refresh(); });
    var pan = VZ.panel(stage, { "η": "", "落在哪一半": "", "能不能延拓": "" });
    function refresh() {
      VZ.setPanel(pan, {
        "η": "Im χ = " + eta.toFixed(2),
        "落在哪一半": eta < 0 ? "「外侧」半球 = 下半平面" : (eta > 0 ? "内侧半球 = 上半平面" : "正好压在实圆上"),
        "能不能延拓": eta < 0 ? "能：全纯延拓，且被这半边唯一确定" : (eta > 0 ? "不能：负频部分会指数爆炸" : "往哪边走，就归哪半")
      });
    }
    draw(); refresh();
  }
},

/* ------------------------------------------------------------
   PL13 · 整条链：一处翻面，五格同时翻
   ------------------------------------------------------------ */
"f-pl-freqchain": {
  title: "",
  hint: "",
  draw: function (stage) {
    var C = VZ.C;
    var nar = (stage.clientWidth || 720) < 560;
    var W = nar ? 460 : 720, H = nar ? 400 : 196;
    var cv = VZ.canvas(stage, W, H, { maxDpr: 2 });
    var g = cv.ctx;
    var eta = -0.8, F = "10.5px -apple-system,PingFang SC,sans-serif";

    function draw() {
      g.clearRect(0, 0, W, H);
      var ok = eta < 0;
      var cells = [
        { t: ok ? "正频率" : "负频率", s: ok ? "g(p) 在 p>0 全零" : "g(p) 在 p>0 有值" },
        { t: ok ? "只有 p < 0 的成分" : "混进了 p > 0", s: "e^(ipχ) 的 p 范围" },
        { t: ok ? "下半平面" : "上半平面", s: "Im χ " + (ok ? "< 0" : "> 0") },
        { t: ok ? "「外侧」半球" : "内侧半球", s: "实圆劈出的两半" },
        { t: ok ? "能全纯延拓" : "延拓会爆炸", s: "唯一确定还是失控" }
      ];
      var n = cells.length, i, x, y, bw, bh, gap = nar ? 8 : 16;
      var col = function (k) { return k === 4 ? (ok ? C.green : C.red) : (ok ? C.green : C.red); };
      g.textAlign = "center";
      if (!nar) {
        bw = Math.min(126, (W - 20) / n - gap); bh = 66;
        var total = n * bw + (n - 1) * gap, x0 = (W - total) / 2, cy = H * 0.44;
        for (i = 0; i < n; i++) {
          x = x0 + i * (bw + gap);
          g.fillStyle = ok ? "rgba(94,224,138,.07)" : "rgba(255,122,122,.07)";
          g.strokeStyle = ok ? "rgba(94,224,138,.75)" : "rgba(255,122,122,.75)";
          g.lineWidth = 1.6;
          g.beginPath(); g.rect(x, cy - bh / 2, bw, bh); g.fill(); g.stroke();
          g.fillStyle = ok ? C.green : C.red; g.font = "bold " + F;
          g.fillText(cells[i].t, x + bw / 2, cy - 4);
          g.fillStyle = C.dim; g.font = "9.5px -apple-system,PingFang SC,sans-serif";
          g.fillText(cells[i].s, x + bw / 2, cy + 14);
          if (i < n - 1) {
            var mx = x + bw + gap / 2;
            g.beginPath();
            g.moveTo(mx - 3, cy - 5); g.lineTo(mx + 3, cy); g.lineTo(mx - 3, cy + 5);
            g.strokeStyle = ok ? "rgba(94,224,138,.7)" : "rgba(255,122,122,.7)";
            g.lineWidth = 1.7; g.stroke();
          }
        }
      } else {
        bw = W - 36; bh = 54;
        for (i = 0; i < n; i++) {
          y = 16 + i * (bh + gap);
          x = 18;
          g.fillStyle = ok ? "rgba(94,224,138,.07)" : "rgba(255,122,122,.07)";
          g.strokeStyle = ok ? "rgba(94,224,138,.75)" : "rgba(255,122,122,.75)";
          g.lineWidth = 1.6;
          g.beginPath(); g.rect(x, y, bw, bh); g.fill(); g.stroke();
          g.fillStyle = ok ? C.green : C.red; g.font = "bold " + F;
          g.fillText(cells[i].t, W / 2, y + 22);
          g.fillStyle = C.dim; g.font = "9.5px -apple-system,PingFang SC,sans-serif";
          g.fillText(cells[i].s, W / 2, y + 40);
        }
      }
      g.textAlign = "left";
      g.fillStyle = C.dim; g.font = "10px -apple-system,PingFang SC,sans-serif";
      g.fillText("η = " + eta.toFixed(2) + "　拖过 0 的那一刻，整条链一次性翻面", nar ? 18 : 20, H - 12);
    }

    var ctl = VZ.box(stage, "viz-ctl");
    var pan = VZ.panel(stage, { "η": "", "整条链" : "" });
    VZ.slider(ctl, {
      label: "η = Im χ", min: -1.8, max: 1.8, step: 0.05, value: eta,
      format: function (v) { return v.toFixed(2); },
      onInput: function (v) { eta = v; draw(); refresh(); }
    });
    function refresh() {
      VZ.setPanel(pan, {
        "η": "Im χ = " + eta.toFixed(2),
        "整条链": eta < 0 ? "下半平面 → 外侧半球 → 只有 p<0 的成分 → 能全纯延拓"
                          : "上半平面 → 内侧半球 → 混进 p>0 → 延拓会爆炸"
      });
    }
    draw(); refresh();
  }
}

});
