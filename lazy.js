/* ============================================================
   lazy.js — 按需加载
   首屏只加载地图需要的东西；章节正文、原书插图、交互图、KaTeX、
   楷体字库全部等到真正用的时候再取。

   识别的清单由 gen/build-lazy.py 生成（gen/lazy/manifest.js）：
     LAZY.chapters[n] 第 n 章正文      LAZY.steps[n]  该章页数
     LAZY.figs[n]     第 n 章原书插图   LAZY.viz[n]    该章用到的交互图文件
     LAZY.regions     区域导论用的交互图
   单文件版里 window.__SINGLE_FILE 为真，所有资源已内联，这里直接放行。
   ============================================================ */
var LZ = (function () {
  var MAN = window.LAZY || { chapters: {}, steps: {}, figs: {}, viz: {}, regions: [], all_viz: [] };
  /* 单文件版会在 app.js 之前打上 __SINGLE_FILE，所以这里必须是「用时再读」，不能 IIFE 时定死 */
  function single() { return !!window.__SINGLE_FILE; }
  var cache = {};        /* src -> Promise */
  var TIMEOUT = 25000;

  function isCSS(src) { return /\.css($|\?)/.test(src); }

  function loadCSS(href) {
    if (single()) return Promise.resolve(href);
    return new Promise(function (res, rej) {
      var l = document.createElement("link");
      l.rel = "stylesheet";
      l.href = href;
      var done = false;
      l.onload = function () { if (!done) { done = true; res(href); } };
      l.onerror = function () { if (!done) { done = true; rej(new Error("样式载入失败：" + href)); } };
      document.head.appendChild(l);
      /* Safari 偶尔不触发 link.onload，给个兜底 */
      setTimeout(function () { if (!done) { done = true; res(href); } }, TIMEOUT);
    });
  }

  /* 每个脚本地址带上内容指纹：改了 bundle 浏览器才会重新取，
     否则会拿着旧的 viz-part2.js，图 id 对不上、只剩一个空盒子。 */
  function ver(src) {
    if (!src || /[?]/.test(src) || /^https?:|^\/\//.test(src)) return src;
    return src + "?v=" + (MAN.v || "0");
  }

  function loadJS(raw) {
    if (single()) return Promise.resolve(raw);
    var src = ver(raw);
    if (cache[src]) return cache[src];
    cache[src] = new Promise(function (res, rej) {
      var s = document.createElement("script");
      s.src = src;
      s.async = true;
      var done = false;
      s.onload = function () { if (!done) { done = true; res(src); } };
      s.onerror = function () {
        if (done) return;
        done = true;
        delete cache[src];
        rej(new Error("脚本载入失败：" + src));
      };
      document.head.appendChild(s);
      setTimeout(function () {
        if (done) return;
        done = true;
        delete cache[src];
        rej(new Error("脚本载入超时：" + src));
      }, TIMEOUT);
    });
    return cache[src];
  }

  function load(src) { return isCSS(src) ? loadCSS(src) : loadJS(src); }

  function loadAll(list) {
    if (!list || !list.length) return Promise.resolve();
    /* 同一个文件只请求一次；并行取，失败即整体失败 */
    var uniq = [];
    list.forEach(function (f) { if (f && uniq.indexOf(f) < 0) uniq.push(f); });
    return Promise.all(uniq.map(load));
  }

  /* ---------- 数学排版：KaTeX + math.js ---------- */
  var mathPromise = null;
  function ensureMath() {
    /* math.js 在首屏（26KB 的转换逻辑）；这里只需要把 KaTeX 本体拉回来。
       若老版本 index.html 没带 math.js，也补上——顺序弄错的话 MT 会晚到。 */
    if (single() || (window.MT && window.MT.ready)) return Promise.resolve();
    if (mathPromise) return mathPromise;
    mathPromise = loadCSS("vendor/katex/katex-inline.css")
      .then(function () { return loadJS("vendor/katex/katex.min.js"); })
      .then(function () { return window.MT ? null : loadJS("math.js"); })
      .catch(function (e) { mathPromise = null; throw e; });
    return mathPromise;
  }

  /* ---------- 楷体：2MB 的 base64 字库，只在真的要读长文时才拉 ---------- */
  var fontPromise = null;
  function ensureFont() {
    if (single() || fontPromise) return fontPromise || Promise.resolve();
    fontPromise = loadCSS("kai-font.css").catch(function (e) { fontPromise = null; throw e; });
    return fontPromise;
  }

  function hasChapterData(n) {
    var arr = (window.DATA && DATA.chapters) || [];
    for (var i = 0; i < arr.length; i++) if (+arr[i].n === +n) return true;
    return false;
  }
  function hasFigs(n) {
    var b = (window.DATA && DATA.bookFigs) || {};
    for (var k in b) if (k.split(".")[0] === String(n)) return true;
    return false;
  }

  /* ---------- 对外：打开某一关前需要的资源 ---------- */
  function ensureLevel(lv) {
    var jobs = [];
    var n = lv && lv.chapter ? String(lv.chapter).replace(/^ch/, "") : null;
    if (n) {
      if (MAN.chapters[n] && !hasChapterData(n)) jobs.push(loadJS(MAN.chapters[n]));
      if (MAN.figs[n]) {
        if (!hasFigs(n)) jobs.push(loadJS(MAN.figs[n]));
        /* 中文图注跟插图一起取：不打开带图的章节就永远不下这 40KB */
        if (MAN.caps && !(window.DATA && DATA.bookFigCaps)) jobs.push(loadJS(MAN.caps));
      }
      var viz = MAN.viz[n] || [];
      /* viz-core 必须先行：其余图示脚本一执行就调 VZ.define */
      if (viz.length) jobs.push(loadJS("viz-core.js").then(function () { return loadAll(viz); }));
    } else if (lv && lv.type === "lesson") {
      var reg = MAN.regions || [];
      if (reg.length) jobs.push(loadJS("viz-core.js").then(function () { return loadAll(reg); }));
    }
    /* 关键：楷体（2MB）与 KaTeX（600KB）都放在正文之后才开始取。
       慢网下它们会和几十 KB 的正文抢同一条连接，正文能拖到二十几秒。
       字体到位浏览器自己换字，KaTeX 到位由 app.js 重排，都不必等。 */
    var content = Promise.all(jobs);
    content.then(function () {
      ensureFont().catch(function () { });
      ensureMath().catch(function () { });
    });
    return content;
  }

  /* 页面空闲时悄悄把字库取回来，用户点进精读关就不用等。
     只在网络条件允许时做：省流量模式下不预取，等真正进章时再说。 */
  function warmFont() {
    if (single() || fontPromise) return;
    var c = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
    if (c && (c.saveData || /2g|slow-2g|3g/.test(c.effectiveType || ""))) return;
    var go = function () { ensureFont().catch(function () { }); };
    if (window.requestIdleCallback) requestIdleCallback(go, { timeout: 8000 });
    else setTimeout(go, 3000);
  }

  return {
    ensureLevel: ensureLevel,
    ensureMath: ensureMath,
    ensureFont: ensureFont,
    warmFont: warmFont,
    load: load,
    stepsOf: function (n) { return MAN.steps[String(n)] || 0; },
    manifest: MAN,
    single: single
  };
})();
