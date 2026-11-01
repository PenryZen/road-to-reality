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
      g.beginPath(); g.arc(o1[0], o1[1], 4, 0, Math.PI * 2); g.fillStyle = C.bad; g.fill();
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
          g.strokeStyle = C.bad; g.lineWidth = 3; g.stroke();
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
      g.beginPath(); g.arc(o2[0], o2[1], 4, 0, Math.PI * 2); g.fillStyle = C.bad; g.fill();

      g.font = "11px -apple-system,PingFang SC,sans-serif";
      g.fillStyle = C.dim;
      g.fillText("z 平面（拖动圆心）", 10, 18);
      g.fillText("w 平面（像）", PW + 10, 18);
      g.fillStyle = through ? C.bad : C.green;
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
        g.fillStyle = C.bad; g.fill(); g.strokeStyle = C.deep; g.lineWidth = 2; g.stroke();
        g.fillStyle = C.bad; g.font = "10.5px -apple-system,PingFang SC,sans-serif";
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
}

});
