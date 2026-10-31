/* 长文的三层强调。出发点不是「哪里好看」，而是「读到这一页，眼神该在哪里停一下」。
   45 字/行的楷体长文，一页约 600–900 字，停三处刚好，停五处等于没停。

     术语 「…」里的概念 —— 青色；本章首次出现才加点线下划
     重点 定义句与核心论断 —— 加粗 + 极淡青底，是「要记住的那一句」
     转折 然而 / 但 / 其实 / 恰恰 —— 只染词本身，不占底色

   来源分两类：卡点句来自数据（下方「卡点拆解」引用的那句，正文与拆解自动对得上），
   定义句、论断句、转折词由句式规则现场判，判据就是下面那几条正则，可调。

   全部在渲染后按文本节点改写；$…$ 已渲染成 KaTeX 节点，跳过不碰。 */
var EMPH = (function () {
  var seen = {};          /* 章号 -> { 归一化术语: 1 } */
  var cur = null;

  function norm(s) { return String(s).replace(/[\s「」“”"]/g, ""); }

  /* 建文本地图时要跳过的容器：公式、ASCII 示意图、块标题、按钮、卡点问句。
     注意别把 .key / .turn 也跳过——同一段可能连续标两处，若第二次建图时跳过
     已标好的部分，后面的偏移就全错位了（会抛 parent.insertBefore of null）。 */
  var SKIP = /(^| )(katex|katex-display|viz-line|math-line|blk-t|orig-t|btn|opt|pill|note-q)( |$)/;
  function skipEl(el) {
    if (!el || el.nodeType !== 1) return false;
    var tag = el.tagName;
    if (tag === "SCRIPT" || tag === "STYLE" || tag === "BUTTON") return true;
    var c = el.className;
    return typeof c === "string" && SKIP.test(c);
  }
  /* 术语不进已有强调：白底加粗句里再套一层青字会打架 */
  function skipTerm(el) {
    if (skipEl(el)) return true;
    var c = el.className;
    return typeof c === "string" && /(^| )(term|key|turn)( |$)/.test(c);
  }

  function reset(chN) { cur = String(chN); if (!seen[cur]) seen[cur] = {}; }

  /* ---------- 句式判据 ----------
     DEF 只认「称为 / 叫做 / 是指」这类明确下定义的句式；「意味着」「也就是」太常见，
     放进来会让每页都糊上一层底。CONCL 只认句首连词。 */
  var DEF = /(是指|指的是|称为|叫做|叫作)/;
  var CONCL = /^(因此|所以|可见|于是|这就是说|换句话说|总之|归根到底|这说明|由此可见)/;
  /* 转折词前面必须有句读或在句首，否则「不但」「但凡」「岂但」会被误伤 */
  var TURN = /(?:^|[，。；：、—…」』）])(然而|但是|但|其实|恰恰|反而|并非|并不是|问题在于|关键在于|更要紧的是|反过来)/;

  var MAX_KEY = 2;        /* 每页重点句上限 */
  var MAX_TURN = 2;       /* 每页转折词上限 */
  /* 长度上限按行算：正文一行约 45 字，70 字≈1.6 行，底色还看得出是「一句」；
     放到 100 字就是四行整片荧光笔，读起来比不标注更累。 */
  var LEN_DEF = 70;
  var LEN_MARK = 70;
  var LEN_CONCL = 55;

  /* ---------- 文本地图：段落可见文字拼成一条，数学节点跳过 ---------- */
  function buildMap(root) {
    var items = [], text = "";
    (function walk(n) {
      for (var c = n.firstChild; c; c = c.nextSibling) {
        if (c.nodeType === 3) {
          items.push({ node: c, start: text.length, end: text.length + c.nodeValue.length });
          text += c.nodeValue;
        } else if (c.nodeType === 1 && !skipEl(c)) {
          walk(c);
        }
      }
    })(root);
    return { text: text, items: items };
  }

  function cut(node, s, e, cls) {
    var t = node.nodeValue;
    if (e <= s || s < 0 || e > t.length) return;
    var before = t.slice(0, s), mid = t.slice(s, e), after = t.slice(e);
    var span = document.createElement("span");
    span.className = cls;
    span.textContent = mid;
    var parent = node.parentNode;
    var ref = node.nextSibling;
    parent.insertBefore(span, ref);
    if (after) parent.insertBefore(document.createTextNode(after), ref);
    if (before) node.nodeValue = before;
    else parent.removeChild(node);
  }

  function at(map, off) {
    for (var i = 0; i < map.items.length; i++) {
      var it = map.items[i];
      if (off >= it.start && off < it.end) return { node: it.node, off: off - it.start };
    }
    return null;
  }

  /* 用 Range 把整句 extract 出来再套一层 span：
     句子中间夹着公式时，底色才会连成一片；跨到半截元素时 extractContents
     会自己把文本节点切开，不像 surroundContents 那样抛错留下碎片。 */
  function wrap(map, start, end, cls) {
    var a = at(map, start), z = at(map, end - 1);
    if (!a || !z) return;
    var r = document.createRange();
    r.setStart(a.node, a.off);
    r.setEnd(z.node, z.off + 1);
    var span = document.createElement("span");
    span.className = cls;
    span.appendChild(r.extractContents());
    r.insertNode(span);
  }

  function inClass(node, name) {
    for (var e = node.parentNode; e && e.nodeType === 1; e = e.parentNode) {
      if (e.className && String(e.className).split(" ").indexOf(name) >= 0) return true;
      if (e.id === "lv-stage") break;
    }
    return false;
  }

  /* ---------- 断句 ---------- */
  var ENDS = "。！？；…";
  var TAIL = "。！？；…」』）”’";
  function sentences(t) {
    var out = [], start = 0, i = 0;
    for (; i < t.length; i++) {
      if (ENDS.indexOf(t.charAt(i)) < 0) continue;
      var j = i;
      while (j + 1 < t.length && TAIL.indexOf(t.charAt(j + 1)) >= 0) j++;
      out.push([start, j + 1]);
      start = j + 1;
      i = j;
    }
    if (start < t.length) out.push([start, t.length]);
    return out.filter(function (r) {
      return t.slice(r[0], r[1]).trim().length >= 8;
    });
  }

  /* ---------- 重点句 ----------
     三类候选，各有长度上限；每页最多两句，且「定义」「卡点」各最多一句——
     两个卡点句同时上底，等于告诉读者「这页全都是重点」。 */
  function pickKeys(paras, quotes) {
    var defs = [], marks = [], concls = [];
    paras.forEach(function (p) {
      var map = buildMap(p);
      if (!map.text) return;
      sentences(map.text).forEach(function (r) {
        var sent = map.text.slice(r[0], r[1]).trim();
        var len = sent.length;
        var rec = { p: p, map: map, s: r[0], e: r[1], len: len };
        /* 以「；，：」收尾的只是一个分句，单独上底色像半句话；
           唯一例外是够长的分号句（≥22 字），它本身已经读得成一个单位 */
        var tail = /[。！？」』）]$/.test(sent) || (/；$/.test(sent) && sent.length >= 22);
        if (!tail) return;
        if (len <= LEN_DEF && DEF.test(sent)) defs.push(rec);
        if (len <= LEN_MARK) {
          for (var i = 0; i < quotes.length; i++) {
            if (sent.indexOf(quotes[i]) >= 0) { marks.push(rec); break; }
          }
        }
        if (len <= LEN_CONCL && CONCL.test(sent)) concls.push(rec);
      });
    });
    function shortest(list) {
      return list.slice().sort(function (a, b) { return a.len - b.len; })[0] || null;
    }
    var pick = [];
    /* 同一句可能既是定义句又是卡点句，只留一次——否则会套娃出两层底色 */
    function add(rec) {
      if (!rec) return;
      for (var i = 0; i < pick.length; i++) {
        if (pick[i].p === rec.p && pick[i].s === rec.s) return;
      }
      pick.push(rec);
    }
    add(shortest(defs));
    add(marks[0]);
    if (pick.length < MAX_KEY) add(shortest(concls));
    pick = pick.slice(0, MAX_KEY);

    /* 按段落分组，段内从后往前切 */
    var byP = [];
    pick.forEach(function (k) {
      var box = null;
      for (var i = 0; i < byP.length; i++) if (byP[i].p === k.p) box = byP[i];
      if (!box) { box = { p: k.p, map: k.map, list: [] }; byP.push(box); }
      box.list.push(k);
    });
    byP.forEach(function (box) {
      box.list.sort(function (a, b) { return b.s - a.s; });
      /* 每标一处都重新建图：切分文本节点会让上一次的节点引用失效 */
      box.list.forEach(function (k) {
        wrap(buildMap(box.p), k.s, k.e, "key");
      });
    });
    return pick.length;
  }

  /* ---------- 转折词：只染词 ---------- */
  function pickTurns(paras) {
    var picked = 0;
    for (var i = 0; i < paras.length && picked < MAX_TURN; i++) {
      var map = buildMap(paras[i]);
      var sents = sentences(map.text);
      for (var j = 0; j < sents.length && picked < MAX_TURN; j++) {
        var sent = map.text.slice(sents[j][0], sents[j][1]);
        var m = TURN.exec(sent);
        if (!m) continue;
        var at = sents[j][0] + sent.indexOf(m[1]);
        var node = null;
        for (var k = 0; k < map.items.length; k++) {
          if (map.items[k].start <= at && at < map.items[k].end) { node = map.items[k].node; break; }
        }
        if (!node || inClass(node, "key") || inClass(node, "turn")) continue;
        wrap(map, at, at + m[1].length, "turn");
        picked++;
        break;                       /* 一个段落只标一个转折，避免满页都是 */
      }
    }
    return picked;
  }

  /* ---------- 术语 ---------- */
  function terms(root) {
    function esc(s) {
      return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
    }
    function walk(n) {
      Array.prototype.slice.call(n.childNodes).forEach(function (c) {
        if (c.nodeType === 3) {
          var t = c.nodeValue;
          if (!t || t.indexOf("「") < 0) return;
          var html = esc(t).replace(/「([^」]{1,18})」/g, function (whole, inner) {
            var k = norm(inner);
            if (!k) return whole;
            var first = !seen[cur][k];
            if (first) seen[cur][k] = 1;
            return '<em class="term' + (first ? " first" : "") + '">' + whole + "</em>";
          });
          if (html.indexOf('<em class="term') < 0) return;
          var box = document.createElement("span");
          box.innerHTML = html;
          var frag = document.createDocumentFragment();
          while (box.firstChild) frag.appendChild(box.firstChild);
          n.replaceChild(frag, c);
        } else if (c.nodeType === 1 && !skipTerm(c)) {
          walk(c);
        }
      });
    }
    walk(root);
  }

  /* root：容器；chN：章号（用于「本章首次出现」）；notes：本页卡点 */
  function apply(root, chN, notes) {
    if (!root) return 0;
    if (cur !== String(chN)) reset(chN);

    var quotes = (notes || []).map(function (n) {
      return String(n.q || "").replace(/^「/, "").replace(/」$/, "");
    }).filter(function (q) { return q && q.length >= 6; });

    var paras = Array.prototype.slice.call(root.querySelectorAll(".rd-p")).filter(function (p) {
      return !skipEl(p);
    });
    if (!paras.length) return 0;

    var nKey = pickKeys(paras, quotes);
    var nTurn = pickTurns(paras);
    terms(root);
    return nKey + nTurn;
  }

  return { apply: apply, reset: reset, seen: seen };
})();

if (typeof module !== "undefined" && module.exports) module.exports = EMPH;
