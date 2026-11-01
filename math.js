/* ============================================================
   math.js —— 数学公式渲染层
   ------------------------------------------------------------
   目标：正文里的公式要像排版好的书一样清楚，长公式不再糊成一团。

   两条通路：
   1) 显式 LaTeX：$...$（行内）  $$...$$（块级，居中可横向滚动）
   2) 裸公式自动识别：正文里本来就用 Unicode 写着 √ ∫ ∂ θ ² ⁻¹ ⟨ψ| 这类
      符号，识别出来后先转成 LaTeX，再交给 KaTeX 排版。

   设计原则：
   · 绝不吞字 —— KaTeX 渲染失败一律回退成原始文本
   · 绝不误伤 —— ASCII 示意图、中文标点、普通英文单词都排除在外
   · 只在候选字符的连续片段里判断，边界由中文/标点天然切开
   ============================================================ */
(function (root) {
  "use strict";

  var KX = root.katex || null;

  /* ============================================================
     一、Unicode → LaTeX 映射
     ============================================================ */
  var MAP = {};
  /* LaTeX 命令后面若紧跟字母会被读成同一个命令（\\partialt），补一个空格切断。
     LaTeX 本身忽略多余空格，所以补空格是安全的。 */
  function cmdSp(v) { return /^\\[a-zA-Z]+$/.test(v) ? v + " " : v; }
  function add(o) {
    for (var k in o) { if (Object.prototype.hasOwnProperty.call(o, k)) MAP[k] = cmdSp(o[k]); }
  }

  /* 希腊字母 */
  add({
    "\u03B1": "\\alpha", "\u03B2": "\\beta", "\u03B3": "\\gamma", "\u03B4": "\\delta",
    "\u03B5": "\\varepsilon", "\u03F5": "\\epsilon", "\u03B6": "\\zeta", "\u03B7": "\\eta",
    "\u03B8": "\\theta", "\u03D1": "\\vartheta", "\u03B9": "\\iota", "\u03BA": "\\kappa",
    "\u03BB": "\\lambda", "\u03BC": "\\mu", "\u03BD": "\\nu", "\u03BE": "\\xi",
    "\u03C0": "\\pi", "\u03D6": "\\varpi", "\u03C1": "\\rho", "\u03C3": "\\sigma",
    "\u03C2": "\\varsigma", "\u03C4": "\\tau", "\u03C5": "\\upsilon", "\u03C6": "\\varphi",
    "\u03D5": "\\phi", "\u03C7": "\\chi", "\u03C8": "\\psi", "\u03C9": "\\omega",
    "\u0393": "\\Gamma", "\u0394": "\\Delta", "\u0398": "\\Theta", "\u039B": "\\Lambda",
    "\u039E": "\\Xi", "\u03A0": "\\Pi", "\u03A3": "\\Sigma", "\u03A5": "\\Upsilon",
    "\u03A6": "\\Phi", "\u03A8": "\\Psi", "\u03A9": "\\Omega"
  });

  /* 算子、关系、箭头、括号、花体字母 */
  add({
    "\u222B": "\\int", "\u222E": "\\oint", "\u222C": "\\iint", "\u222D": "\\iiint",
    "\u222F": "\\oiint", "\u2211": "\\sum", "\u220F": "\\prod", "\u2210": "\\coprod",
    "\u2202": "\\partial", "\u2207": "\\nabla", "\u221E": "\\infty",
    "\u2248": "\\approx", "\u2243": "\\simeq", "\u2245": "\\cong", "\u2261": "\\equiv",
    "\u223C": "\\sim", "\u226A": "\\ll", "\u226B": "\\gg",
    "\u2260": "\\ne", "\u2264": "\\le", "\u2265": "\\ge",
    "\u00B1": "\\pm", "\u2213": "\\mp", "\u00D7": "\\times", "\u00F7": "\\div",
    "\u22C5": "\\cdot", "\u00B7": "\\cdot", "\u2218": "\\circ", "\u221D": "\\propto",
    "\u2208": "\\in", "\u2209": "\\notin", "\u220B": "\\ni",
    "\u2282": "\\subset", "\u2283": "\\supset", "\u2286": "\\subseteq",
    "\u2287": "\\supseteq", "\u2216": "\\setminus",
    "\u222A": "\\cup", "\u2229": "\\cap",
    "\u2200": "\\forall", "\u2203": "\\exists", "\u00AC": "\\neg",
    "\u2227": "\\wedge", "\u2228": "\\vee", "\u22A2": "\\vdash", "\u22A8": "\\models",
    "\u2192": "\\to", "\u2190": "\\leftarrow", "\u2194": "\\leftrightarrow",
    "\u21D2": "\\Rightarrow", "\u21D4": "\\Leftrightarrow", "\u21A6": "\\mapsto",
    "\u27F6": "\\longrightarrow", "\u27F5": "\\longleftarrow",
    "\u27F9": "\\implies", "\u27FA": "\\iff",
    "\u27E8": "\\langle", "\u27E9": "\\rangle",
    "\u2020": "\\dagger", "\u2021": "\\ddagger",
    "\u2220": "\\angle", "\u22A5": "\\perp", "\u2225": "\\parallel", "\u2226": "\\nparallel",
    "\u2295": "\\oplus", "\u2297": "\\otimes", "\u2299": "\\odot",
    "\u2296": "\\ominus", "\u2298": "\\oslash",
    "\u2308": "\\lceil", "\u2309": "\\rceil", "\u230A": "\\lfloor", "\u230B": "\\rfloor",
    "\u2205": "\\varnothing", "\u2113": "\\ell", "\u2118": "\\wp",
    "\u210F": "\\hbar", "\u0127": "\\hbar",
    "\u2102": "\\mathbb{C}", "\u211D": "\\mathbb{R}", "\u2124": "\\mathbb{Z}",
    "\u2115": "\\mathbb{N}", "\u211A": "\\mathbb{Q}", "\u210D": "\\mathbb{H}",
    "\u2119": "\\mathbb{P}",
    "\u22EF": "\\cdots", "\u22EE": "\\vdots", "\u22F1": "\\ddots",
    "\u25B3": "\\triangle", "\u25A1": "\\square", "\u25A0": "\\blacksquare",
    "\u2212": "-", "\u2013": "-",
    "\u2016": "\\Vert", "\u2223": "|", "\u2224": "\\nmid",
    "\u2032": "'", "\u2033": "''", "\u2034": "'''", "\u2057": "''''",
    "\u00B0": "^{\\circ}", "\u2044": "/", "\u2026": "\\cdots ", "\u22EF": "\\cdots ",
    /* 独立分数字符：不映射的话它们既不算候选字符、又渲染不出来 */
    "\u00BC": "\\tfrac{1}{4}", "\u00BD": "\\tfrac{1}{2}", "\u00BE": "\\tfrac{3}{4}",
    "\u2150": "\\tfrac{1}{7}", "\u2151": "\\tfrac{1}{9}", "\u2152": "\\tfrac{1}{10}",
    "\u2153": "\\tfrac{1}{3}", "\u2154": "\\tfrac{2}{3}", "\u2155": "\\tfrac{1}{5}",
    "\u2156": "\\tfrac{2}{5}", "\u2157": "\\tfrac{3}{5}", "\u2158": "\\tfrac{4}{5}",
    "\u2159": "\\tfrac{1}{6}", "\u215A": "\\tfrac{5}{6}", "\u215B": "\\tfrac{1}{8}",
    "\u215C": "\\tfrac{3}{8}", "\u215D": "\\tfrac{5}{8}", "\u215E": "\\tfrac{7}{8}",
    "\u215F": "1/"
  });

  /* 上标 / 下标块（Unicode 有专门的码位，但很多字体显示不好，改成真正的上下标） */
  var SUP = {
    "0": "0", "1": "1", "2": "2", "3": "3", "4": "4", "5": "5", "6": "6", "7": "7",
    "8": "8", "9": "9", "+": "+", "-": "-", "=": "=", "(": "(", ")": ")",
    "n": "n", "i": "i", "a": "a", "b": "b", "c": "c", "d": "d", "e": "e", "f": "f",
    "g": "g", "h": "h", "j": "j", "k": "k", "l": "l", "m": "m", "o": "o", "p": "p",
    "r": "r", "s": "s", "t": "t", "u": "u", "v": "v", "w": "w", "x": "x", "y": "y",
    "z": "z", "A": "A", "B": "B", "D": "D", "E": "E", "G": "G", "H": "H", "I": "I",
    "J": "J", "K": "K", "L": "L", "M": "M", "N": "N", "O": "O", "P": "P", "R": "R",
    "T": "T", "U": "U", "V": "V", "W": "W"
  };
  var SUB = {
    "0": "0", "1": "1", "2": "2", "3": "3", "4": "4", "5": "5", "6": "6", "7": "7",
    "8": "8", "9": "9", "+": "+", "-": "-", "=": "=", "(": "(", ")": ")",
    "a": "a", "e": "e", "h": "h", "i": "i", "j": "j", "k": "k", "l": "l", "m": "m",
    "n": "n", "o": "o", "p": "p", "r": "r", "s": "s", "t": "t", "u": "u", "v": "v",
    "x": "x"
  };
  /* Unicode 上/下标码位 → 上面的 ASCII 键 */
  (function () {
    var i, k;
    var supKeys = "\u2070\u00B9\u00B2\u00B3\u2074\u2075\u2076\u2077\u2078\u2079\u207A\u207B\u207C\u207D\u207E";
    var supVals = "0123456789+-=()".split("");
    for (i = 0; i < supKeys.length; i++) { SUP[supKeys.charAt(i)] = supVals[i]; }
    var supL = "ⁿⁱ", supLA = "abcdefghijklmnoprstuvwxyz".split("");
    SUP["\u207F"] = "n"; SUP["\u2071"] = "i";
    var supMod = "\u1D43\u1D47\u1D9C\u1D48\u1D49\u1DA0\u1D4D\u02B0\u02B2\u1D4F\u02E1\u1D50\u1D52\u1D56\u02B3\u02E2\u1D57\u1D58\u1D5B\u02B7\u02E3\u02B8\u1DBB";
    var supModV = "abcdefghijklmoprstuvwxyz".split("");
    for (i = 0; i < supMod.length; i++) { SUP[supMod.charAt(i)] = supModV[i]; }
    var supUp = "\u1D2C\u1D2E\u1D30\u1D31\u1D33\u1D34\u1D35\u1D36\u1D37\u1D38\u1D39\u1D3A\u1D3C\u1D3E\u1D3F\u1D40\u1D41\u2C7D\u1D42";
    var supUpV = "ABDEGHIJKLMNOPRTUVW".split("");
    for (i = 0; i < supUp.length; i++) { SUP[supUp.charAt(i)] = supUpV[i]; }
    var subKeys = "\u2080\u2081\u2082\u2083\u2084\u2085\u2086\u2087\u2088\u2089\u208A\u208B\u208C\u208D\u208E";
    var subVals = "0123456789+-=()".split("");
    for (i = 0; i < subKeys.length; i++) { SUB[subKeys.charAt(i)] = subVals[i]; }
    var subLow = "\u2090\u2091\u2095\u1D62\u2C7C\u2096\u2097\u2098\u2099\u2092\u209A\u1D63\u209B\u209C\u1D64\u1D65\u2093";
    var subLowV = "aehijklmnoprstuvx".split("");
    for (i = 0; i < subLow.length; i++) { SUB[subLow.charAt(i)] = subLowV[i]; }
  })();

  /* 组合附加符号：q̇ 之类 */
  var COMB = {
    "\u0307": "\\dot", "\u0308": "\\ddot", "\u0304": "\\bar", "\u0305": "\\bar",
    "\u0302": "\\hat", "\u0303": "\\tilde", "\u20D7": "\\vec", "\u030A": "\\mathring"
  };
  var PRE = { "\u0124": "\\hat{H}", "\u0125": "\\hat{h}", "\u0166": "\\hat{T}" };

  /* ============================================================
     二、候选字符集：只有由这些字符组成的连续片段才可能是公式
     ============================================================ */
  var CAND_SRC =
    "A-Za-z0-9" +
    " \\t" +
    "()+\\-/<>=\\[\\]{}|^_'\\\\,.:;!" +
    "\\u00AC\\u00B0\\u00B1\\u00B9\\u00B2\\u00B3\\u00B7\\u00BC-\\u00BE\\u00D7\\u00F7" +              // ¬ ° ± ¹ ² ³ · ¼½¾ × ÷
    "\\u2013\\u2016\\u2020\\u2021\\u2026\\u2032-\\u2037\\u2057\\u2044\\u2212" +              // – ‖ † ‡ … ′″‴⁗ ⁄ −
    "\\u2150-\\u215F" +                                          // ⅐ ⅓ ⅔ ⅕ … ⅞
    "\\u00A0\\u0124\\u0125\\u0127\\u0166\\u1680\\u2000-\\u200D\\u202F\\u205F\\u3000" +           // 各种空白与零宽、Ĥ ħ Ŧ
    "\\u0300-\\u036F" +                                            // 组合附加符号
    "\\u0370-\\u03FF" +                                            // 希腊字母
    "\\u1D2C-\\u1D6A\\u2C7C-\\u2C7F" +                             // 上标字母
    "\\u2070-\\u209F" +                                            // 上标 / 下标数字
    "\\u2100-\\u214F" +                                            // 字母式符号 ℂℝℏℓ
    "\\u2190-\\u21FF" +                                            // 箭头
    "\\u2200-\\u22FF" +                                            // 数学运算符
    "\\u2300-\\u23FF" +                                            // 技术符号 ⌈⌉⌊⌋
    "\\u25A0-\\u25FF" +                                            // 几何图形 △□■
    "\\u27C0-\\u27EF\\u27F5-\\u27FA" +                             // 补充数学 ⟨⟩⟵⟶⟷⟸⟹⟺
    "\\u2980-\\u29FF\\u2A00-\\u2AFF";                              // 杂项数学

  var RE_CAND = new RegExp("[" + CAND_SRC + "]+", "g");
  var RE_CAND1 = new RegExp("[" + CAND_SRC + "]");
  var RE_CAND_G = new RegExp("[" + CAND_SRC + "]", "g");

  /* 强特征：出现即判定为公式（排除方括号类图形，免得图上箭头误触） */
  var STRONG_SRC =
    "\\u00B0\\u00B9\\u00B2\\u00B3\\u2013\\u2016\\u2020\\u2021\\u2032-\\u2037\\u2044\\u2212\\u0127" +
    "\\u0300-\\u036F\\u0370-\\u03FF" +
    "\\u1D2C-\\u1D6A\\u2C7C-\\u2C7F\\u2070-\\u209F" +
    "\\u2100-\\u214F\\u2190-\\u21FF\\u2200-\\u22FF" +
    "\\u2300-\\u23FF\\u27C0-\\u27EF\\u2980-\\u29FF" +
    "\\u2A00-\\u2AFF";
  var RE_STRONG = new RegExp("[" + STRONG_SRC + "]");

  /* 中文 / 全角 → 天然分隔符 */
  var RE_CJK = /[\u2E80-\u303F\u3400-\u4DBF\u4E00-\u9FFF\uF900-\uFAFF\uFF00-\uFFEF]/;

  /* ASCII 示意图标记：含这些字符的行一律不做公式识别，保住对齐 */
  var RE_ART = /[\u2500-\u257F\u2580-\u259F\u25B2\u25B6\u25C0\u25BC]|--|==|->|<-|\|__/;

  /* ============================================================
     三、判定与转换
     ============================================================ */
  function isMathSeg(seg) {
    var t = seg.replace(/^\s+|\s+$/g, "");
    if (t.length < 2 || t.length > 400) return false;
    if (!/[A-Za-z0-9]/.test(t) && !RE_STRONG.test(t)) return false;
    if (RE_STRONG.test(t)) return true;                       // 有数学符号 → 公式
    /* x^2 / T^{a} / w^(1/2)：括号上标也要认，否则 w^(1/2) 会被当普通文字原样显示 */
    if (/[\^_]\s*[{\[(A-Za-z0-9\\]/.test(t)) return true;
    if (/[A-Za-z0-9)\]}]!?\s*=\s*[A-Za-z0-9(\[{]/.test(t)) return true;  // a = b
    return false;
  }

  function supSubRun(run) {
    var isSup = SUP[run.charAt(0)] !== undefined;
    var tbl = isSup ? SUP : SUB, t = "", c;
    for (var i = 0; i < run.length; i++) {
      c = run.charAt(i);
      t += tbl[c] !== undefined ? tbl[c] : c;
    }
    return (isSup ? "^{" : "_{") + t + "}";
  }

  function sqrtify(s) {
    var prev;
    do { prev = s; s = s.replace(/\u221A\s*\(([^()]*)\)/g, "\\sqrt{$1}"); } while (s !== prev);
    s = s.replace(/\u221A\s*\{([^{}]*)\}/g, "\\sqrt{$1}");
    s = s.replace(/\u221A\s*([A-Za-z0-9])/g, "\\sqrt{$1}");
    s = s.replace(/\u221A/g, "\\surd ");
    do { prev = s; s = s.replace(/\u221B\s*\(([^()]*)\)/g, "\\sqrt[3]{$1}"); } while (s !== prev);
    s = s.replace(/\u221B\s*\{([^{}]*)\}/g, "\\sqrt[3]{$1}");
    s = s.replace(/\u221B\s*([A-Za-z0-9])/g, "\\sqrt[3]{$1}");
    s = s.replace(/\u221B/g, "\\sqrt[3]{}");
    return s;
  }

  /* 裸公式片段 → LaTeX */
  function toTex(src) {
    var s = String(src);
    /* 空白变体归一化、零宽字符剔除，免得它们混进 LaTeX */
    s = s.replace(/[\u00A0\u1680\u2000-\u200A\u202F\u205F\u3000]/g, " ");
    s = s.replace(/[\u200B-\u200D\uFEFF]/g, "");
    s = s.replace(/([^\s\u0300-\u036F])([\u0300-\u036F\u20D0-\u20FF])/g, function (_, ch, mk) {
      var cmd = COMB[mk];
      return cmd ? cmd + "{" + ch + "}" : ch;
    });
    s = s.replace(/[\u0124\u0125\u0166]/g, function (c) { return PRE[c] || c; });
    s = s.replace(/[\u00B9\u00B2\u00B3\u2070-\u209F\u1D2C-\u1D6A\u2C7C-\u2C7F]+/g, supSubRun);
    s = sqrtify(s);
    /* 函数名排正体：log i 若按斜体字母逐字排，会连成「logi」读不出来。
       \\log 后面补一个空格，免得和紧跟的字母粘成 \\logi 这个不存在的命令。
       前后都得是非字母，避免把 logistic、sine 这类词拆坏。 */
    s = s.replace(
      /(^|[^A-Za-z\\])(arcsin|arccos|arctan|sinh|cosh|tanh|sin|cos|tan|sec|csc|cot|log|ln|exp|lim|det|dim|ker|deg|max|min|sup|inf|arg|gcd|mod)(?![A-Za-z])/g,
      function (_, pre, fn) { return pre + "\\" + fn + " "; });
    /* 多字母的上下标是「指标」，不是「乘起来」：Q_ab = Q_{ab}、g_μν = g_{μν}、T^ab = T^{ab}。
       全书 266 处下标 / 54 处上标都是这个意思。必须在 MAP 之前做 —— 之后希腊字母
       已经变成 \mu 这样的命令，就认不出连写了。
       只收「纯字母」或「纯数字」连写；数字+字母混排（2π）可能是乘积，不动。 */
    s = s.replace(/([_^])([A-Za-z\u0370-\u03FF]{2,}|[0-9]{2,})/g, "$1{$2}");
    s = s.replace(/[\s\S]/g, function (c) { return MAP[c] !== undefined ? MAP[c] : c; });
    s = s.replace(/%/g, "\\%").replace(/&/g, "\\&").replace(/#/g, "\\#");
    s = s.replace(/(^|[^<>=])!/g, "$1{!}");
    s = s.replace(/\^([-+])(\d)/g, "^{$1$2}");
    /* e^(−1/x)、x^(n+1)：括号上标改成真正的上标组，省掉多余括号 */
    var prev;
    do {
      prev = s;
      /* 指数上的括号只是分组（e^(2πi) → e^{2πi}，全书 167 处都是这个意思），
         但下标/上标上的括号和方括号是张量记号：Q_(ab) 是「对称部分」、
         Q_[ab] 是「反对称部分」，括号必须留着，去掉就改了意思。 */
      s = s.replace(/\^\s*\(([^()]*)\)/g, "^{$1}")
           .replace(/_\s*\(([^()]*)\)/g, "_{($1)}")
           .replace(/([_^])\s*\[([^\[\]]*)\]/g, "$1{[$2]}");
    } while (s !== prev);
    /* 同一个原子连挂两次上下标（A_a^b_c、\u221e^{j}^\u221e^{n}）LaTeX 不允许，
       中间补一个空组，把第二个挂到新原子上。 */
    s = s.replace(/([_^]\{[^{}]*\}|[_^][A-Za-z0-9\u0370-\u03FF])(?=[_^'])/g, "$1{}");
    return s.replace(/^\s+|\s+$/g, "");
  }

  /* ============================================================
     三·五、分数竖排：a/b → \frac{a}{b}
     ------------------------------------------------------------
     斜杠分数读起来是「倒着躺」的一串，上下两层的竖式分数才一眼看清
     谁是分子谁是分母。这里只对已经判定成公式的片段动手，靠括号 /
     组 / 命令名回溯出左右「原子」，不做无边界的贪婪替换。
     ============================================================ */
  function matchFwd(s, i, open, close) {
    var d = 0;
    for (; i < s.length; i++) {
      var c = s.charAt(i);
      if (c === open) d++;
      else if (c === close) { d--; if (d === 0) return i; }
    }
    return -1;
  }

  /* (a+b)/(c+d) 的括号由分数线接管，没必要在分子分母里再套一层 */
  function stripParen(t) {
    t = t.replace(/^\s+|\s+$/g, "");
    if (t.length < 3 || t.charAt(0) !== "(" || t.charAt(t.length - 1) !== ")") return t;
    if (matchFwd(t, 0, "(", ")") === t.length - 1) return t.slice(1, -1).replace(/^\s+|\s+$/g, "");
    return t;
  }

  /* ------------------------------------------------------------
     切片：把 LaTeX 拆成 token，分子分母的边界才判得准
     t: cmd（命令） op（单个符号） wd（字母数字串） grp（整组括号） sp（空格）
     ------------------------------------------------------------ */
  var INFIX = /^\\(cdot|times|div|pm|mp|to|le|ge|ne|leq|geq|approx|equiv|sim|simeq|cong|propto|Rightarrow|Leftrightarrow|implies|iff|cdots|ldots|dots|quad|qquad|ll|gg|subset|supset|subseteq|supseteq|in|mapsto|longrightarrow|leftarrow|oplus|otimes|wedge|vee)$/;
  var RBR = {
    "\\rangle": "\\langle", "\\rvert": "\\lvert", "\\rVert": "\\lVert",
    "\\rfloor": "\\lfloor", "\\rceil": "\\lceil", "\\rbrace": "\\lbrace"
  };
  var LBR = {};
  for (var _rk in RBR) { if (RBR.hasOwnProperty(_rk)) LBR[RBR[_rk]] = _rk; }
  /* 紧跟 / 左边就是这些算符时，分子止于算符本身（iħ∂/∂x 的分子是 ∂） */
  var DIFFOP = /^\\(partial|nabla|delta)$/;

  function toks(s) {
    var arr = [], i = 0, n = s.length, c, j, e, k, close;
    while (i < n) {
      c = s.charAt(i);
      if (c === " ") { arr.push({ t: "sp", v: " ", s: i, e: i + 1 }); i++; continue; }
      if (c === "\\") {
        j = i + 1;
        while (j < n && /[A-Za-z]/.test(s.charAt(j))) j++;
        if (j === i + 1) j = Math.min(i + 2, n);        /* \{ \, \\ 之类 */
        e = j;
        if (s.charAt(e) === " ") e++;                    /* 命令名后的一个空格属于命令 */
        arr.push({ t: "cmd", v: s.slice(i, j), s: i, e: e });
        i = e; continue;
      }
      if (c === "{" || c === "(" || c === "[") {
        close = c === "{" ? "}" : c === "(" ? ")" : "]";
        k = matchFwd(s, i, c, close);
        if (k < 0) { k = i; }
        arr.push({ t: "grp", v: s.slice(i, k + 1), s: i, e: k + 1 });
        i = k + 1; continue;
      }
      if (/[A-Za-z0-9.]/.test(c)) {
        j = i;
        while (j < n && /[A-Za-z0-9.]/.test(s.charAt(j))) j++;
        arr.push({ t: "wd", v: s.slice(i, j), s: i, e: j });
        i = j; continue;
      }
      arr.push({ t: "op", v: c, s: i, e: i + 1 });
      i++;
    }
    return arr;
  }

  function pairLeft(arr, idx, ln, rn) {
    var d = 0;
    for (var i = idx; i >= 0; i--) {
      if (arr[i].t !== "cmd") continue;
      if (arr[i].v === rn) d++;
      else if (arr[i].v === ln) { d--; if (d === 0) return i; }
    }
    return -1;
  }
  function pairRight(arr, idx, ln, rn) {
    var d = 0;
    for (var i = idx; i < arr.length; i++) {
      if (arr[i].t !== "cmd") continue;
      if (arr[i].v === ln) d++;
      else if (arr[i].v === rn) { d--; if (d === 0) return i; }
    }
    return -1;
  }

  /* 分子的起点：向左收下连续的因子，遇到运算符或空格就停 */
  function leftBound(arr, si) {
    var i = si - 1, start = -1, first = true, k, tk;
    while (i >= 0) {
      tk = arr[i];
      if (tk.t === "sp") break;
      if (tk.t === "op") {
        if (tk.v === "^" || tk.v === "_" || tk.v === "'") { i--; continue; }
        break;
      }
      if (tk.t === "cmd") {
        if (INFIX.test(tk.v)) break;
        if (RBR[tk.v]) {
          k = pairLeft(arr, i, RBR[tk.v], tk.v);
          if (k < 0) break;
          start = k; i = k - 1; first = false; continue;
        }
        if (first && DIFFOP.test(tk.v)) { start = i; break; }
        if (LBR[tk.v]) break;                     /* 开括号属于外层，不进分子 */
      }
      start = i; i--; first = false;
    }
    return start;
  }

  /* 分母的终点：向右收下连续的因子 */
  function rightBound(arr, si) {
    var i = si + 1, end = -1, k, tk;
    while (i < arr.length) {
      tk = arr[i];
      if (tk.t === "sp") break;
      if (tk.t === "op") {
        if (tk.v === "^" || tk.v === "_" || tk.v === "'") { i++; continue; }
        break;
      }
      if (tk.t === "cmd") {
        if (INFIX.test(tk.v)) break;
        if (LBR[tk.v]) {
          k = pairRight(arr, i, tk.v, LBR[tk.v]);
          if (k < 0) break;
          end = k; i = k + 1; continue;
        }
        if (RBR[tk.v]) break;                     /* 闭括号属于外层，不进分母 */
      }
      end = i; i++;
    }
    return end;
  }

  /* 括号里的式子先各自处理，再管外层的斜杠 */
  function mapGroups(s, fn) {
    var out = "", i = 0, j, close, e, c;
    while (i < s.length) {
      c = s.charAt(i);
      if (c === "\\") {
        j = i + 1;
        while (j < s.length && /[A-Za-z]/.test(s.charAt(j))) j++;
        if (j === i + 1) j = Math.min(i + 2, s.length);
        out += s.slice(i, j); i = j; continue;
      }
      if (c === "{" || c === "(" || c === "[") {
        close = c === "{" ? "}" : c === "(" ? ")" : "]";
        e = matchFwd(s, i, c, close);
        if (e < 0) { out += c; i++; continue; }
        out += c + fn(s.slice(i + 1, e)) + close;
        i = e + 1; continue;
      }
      out += c; i++;
    }
    return out;
  }

  /* 反复把最靠左的 / 改写成 \frac{}{}，a/b/c 会左结合成 \frac{\frac{a}{b}}{c} */
  function fracify(tex) {
    tex = mapGroups(tex, fracify);
    var guard = 0, arr, si, p, a, b, i;
    while (guard++ < 40) {
      arr = toks(tex);
      si = -1;
      for (i = 0; i < arr.length; i++) {
        if (arr[i].t === "op" && arr[i].v === "/") { si = i; break; }
      }
      if (si < 0) break;
      p = arr[si].s;
      var L = leftBound(arr, si), R = rightBound(arr, si);
      if (L < 0 || R < 0) break;
      a = arr[L].s; b = arr[R].e;
      var num = stripParen(tex.slice(a, p)), den = stripParen(tex.slice(p + 1, b));
      if (!num || !den) break;
      tex = tex.slice(0, a) + "\\frac{" + num + "}{" + den + "}" + tex.slice(b);
    }
    return tex;
  }

  /* 公式前后得有足够的句子撑着，才值得拆成独立一行；
     像「用 √(1−v²/c²) 亲手算出…」这种短句，拆开反而读不顺 */
  function fitsLine(txt, at) {
    var lead = txt.slice(0, at).replace(/\s/g, "").length;
    var all = txt.replace(/\s/g, "").length;
    if (lead < 6) return false;
    if (all < 30) return false;
    return true;
  }

  /* 长公式：行内排会挤断行，值得单独占一行、居中、放大。
     ★ 必须按「原文」长度判，不能按 fracify 之后的 tex 判：
       a/b 被转成 \frac{a}{b} 后长度凭空翻倍，∂/∂x 这种 4 个字符的东西
       也会被抬成独立一行，正文被切成一段一段（就是「断层」的主因）。 */
  function isLongMath(raw, tex) {
    var t = String(raw || "").replace(/\s+/g, "");
    var len = t.length;
    var tx = String(tex || "");
    /* 大运算符：即便短也值得单独一行（求和号带上下限） */
    if (/[\u222B\u222E\u222C\u222D\u2211\u220F]/.test(t) || /\\sum|\\int|\\oint|\\prod/.test(tx)) return len >= 14;
    /* 带等号的等式链：真正需要整行的是「a = b = c = …」 */
    if (t.indexOf("=") >= 0) return len >= 18;
    /* 原文里就写着 \frac 的，短一点也独立成行；由 a/b 转来的不算 */
    if (/\\frac|\\dfrac/.test(t)) return len >= 10;
    return len >= 30;
  }

  /* ============================================================
     四、渲染
     ============================================================ */
  var stat = { ok: 0, fail: [] };

  function esc(s) {
    return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;")
      .replace(/>/g, "&gt;").replace(/"/g, "&quot;");
  }

  function texToHTML(tex, display) {
    /* KaTeX 是按需加载的，可能比本文件晚到——每次渲染时再取一次，
       否则首屏先加载 math.js 时 KX 为 null，之后永远不渲染。 */
    var K = root.katex || KX;
    if (!K) return null;
    try {
      return K.renderToString(tex, {
        displayMode: !!display, throwOnError: true, strict: false,
        trust: false, output: "html", maxSize: 8, maxExpand: 3000
      });
    } catch (e) { return null; }
  }

  /* 行内公式里的分式：排成真正的 \frac 会把行高撑高，正文一行高一行矮，
     看上去就是「断层」。分子分母都简单（不含 + − = 之类）时退回斜杠写法，
     行高立刻齐平，读起来也是书上常见的 inline 排法。 */
  function inlineFrac(tex) {
    return String(tex).replace(/\\frac\{([^{}]{1,12})\}\{([^{}]{1,12})\}/g, function (all, a, b) {
      if (/[=+\-<>]/.test(a) || /[=+\-<>]/.test(b)) return all;
      return a.replace(/\s+$/, "") + "/" + b.replace(/\s+$/, "");
    });
  }

  function mathHTML(tex, display, raw, cls, tail) {
    if (!display) tex = inlineFrac(tex);
    var h = display ? displayHTML(tex, cls || "mblk", tail) : texToHTML(tex, false);
    if (h === null) {
      if (stat.fail.length < 60) stat.fail.push({ raw: raw, tex: tex });
      return null;
    }
    if (display) return h;
    stat.ok++;
    return '<span class="mth">' + h + "</span>";
  }

  /* 超长等式链：整行放不下就只能横向滚动，读起来像被切断。
     按「顶层 = 号」折成多行、等号对齐 —— 这本来就是书上排长等式的做法。
     只在 tex 很长时才动手，普通的公式不动。 */
  function splitChain(tex) {
    if (String(tex).length < 110) return null;
    var depth = 0, parts = [], buf = "";
    for (var i = 0; i < tex.length; i++) {
      var c = tex.charAt(i);
      if (c === "\\") { buf += c + tex.charAt(i + 1); i++; continue; }
      if (c === "{") depth++;
      else if (c === "}") depth--;
      else if (c === "=" && depth === 0) { parts.push(buf); buf = ""; continue; }
      buf += c;
    }
    parts.push(buf);
    if (parts.length < 3) return null;          /* 只折「a = b = c …」这种链 */
    var body = parts[0].replace(/\s+$/, "") + " &= " + parts[1].replace(/^\s+/, "");
    for (var j = 2; j < parts.length; j++) body += " \\\\ &= " + parts[j].replace(/^\s+/, "");
    return "\\begin{aligned}" + body + "\\end{aligned}";
  }

  /* 块级：失败时不记错，让调用方退回行内再试一次 */
  function displayHTML(tex, cls, tail) {
    var alt = splitChain(tex);
    if (alt) {
      var h0 = texToHTML(alt, true);
      if (h0 !== null) {
        stat.ok++;
        return '<span class="' + cls + '">' + h0 +
          (tail ? '<span class="mb-p">' + esc(tail) + "</span>" : "") + "</span>";
      }
    }
    var h = texToHTML(tex, true);
    if (h === null) return null;
    stat.ok++;
    return '<span class="' + cls + '">' + h +
      (tail ? '<span class="mb-p">' + esc(tail) + "</span>" : "") + "</span>";
  }

  /* 把一段纯文本里的裸公式挑出来渲染 */
  function bare(txt, opts) {
    var out = "", i = 0, m;
    RE_CAND.lastIndex = 0;
    while ((m = RE_CAND.exec(txt)) !== null) {
      if (m[0].length === 0) { RE_CAND.lastIndex++; continue; }
      var seg = m[0];
      /* 空格本身也在候选字符集里，所以片段会带上首尾空格。
         直接塞给 KaTeX，KaTeX 会把空格吞掉 —— 汉字和公式就贴在一起了。
         把首尾空格剥出来留在正文里，公式只吃中间那截。 */
      var lead = /^\s*/.exec(seg)[0];
      var trail = /\s*$/.exec(seg)[0];
      var core = seg.slice(lead.length, seg.length - trail.length);
      out += esc(txt.slice(i, m.index)) + esc(lead);
      if (isMathSeg(core)) {
        var tex = fracify(toTex(core));
        var h = null, tail = "";
        if (isLongMath(core, tex) && !(opts && opts.compact) && fitsLine(txt, m.index)) {
          /* 长公式：单独成行。顺手把紧跟的句读收进来，
             免得公式后面孤零零掉一个句号占一行。 */
          /* 句读整串收进来：「0.207879576…。」里的 … 和 。 都要跟着公式走，
             否则下一段会以「…。」开头，读起来像被切断了 */
          var k = m.index + seg.length;
          while (k < txt.length && /[。，、；：？！…·」』）】》%]/.test(txt.charAt(k))) {
            tail += txt.charAt(k); k++;
          }
          h = displayHTML(tex, "mblk mb-disp", tail);
          if (h !== null) i = k;
        }
        if (h === null) h = mathHTML(tex, false, core);
        out += h !== null ? h : esc(core);
        out += esc(trail);
      } else {
        out += esc(core) + esc(trail);
      }
      if (i < m.index + seg.length) i = m.index + seg.length;
    }
    out += esc(txt.slice(i));
    return out;
  }

  /* 显式公式分隔符：$$…$$ $$  \[…\] 为块级；$…$ \(…\) 为行内 */
  var RE_EXPLICIT = /\$\$([\s\S]+?)\$\$|\\\[([\s\S]+?)\\\]|\$([^$\n]+?)\$|\\\(([\s\S]+?)\\\)/g;

  /* 补充平面的数学字母（\u{1D49E} \u{1D4AE} \u{1D524} \u2026，U+1D400\u2013U+1D7FF）：既不进候选集、逐字排也认不出。
     先按 NFKC 退成普通字母——花体风格丢一点，但公式能完整排出来。 */
  function astral(s) {
    return String(s).replace(/[\u{1D400}-\u{1D7FF}]/gu, function (c) {
      var n = c.normalize("NFKC");
      return /[A-Za-z0-9]/.test(n) ? n : c;
    });
  }

  function render(raw, opts) {
    var s = astral(raw);
    var out = "", i = 0, m, tex, disp, h;
    RE_EXPLICIT.lastIndex = 0;
    while ((m = RE_EXPLICIT.exec(s)) !== null) {
      out += bare(s.slice(i, m.index), opts);
      i = m.index + m[0].length;
      if (m[1] !== undefined) { tex = m[1].trim(); disp = true; }
      else if (m[2] !== undefined) { tex = m[2].trim(); disp = true; }
      else if (m[3] !== undefined) { tex = m[3].trim(); disp = false; }
      else { tex = m[4].trim(); disp = false; }
      tex = fracify(tex);
      /* 显式行内公式如果很长，同样升成独立一行。
         例外：compact（闪卡）模式不升 —— 卡片里一句话被公式切成三段，
         读起来像小标题串联，不如让公式留在句子里。 */
      if (!disp && isLongMath(m[3] !== undefined ? m[3] : (m[4] !== undefined ? m[4] : m[0]), tex) &&
          !(opts && opts.compact)) {
        var tail = "";
        while (i < s.length && /[。，、；：？！…·」』）】》%]/.test(s.charAt(i))) { tail += s.charAt(i); i++; }
        h = displayHTML(tex, "mblk mb-disp", tail);
        if (h !== null) { out += h; continue; }
      }
      h = mathHTML(tex, disp, m[0]);
      out += h !== null ? h : esc(tex);
    }
    out += bare(s.slice(i), opts);
    return out;
  }

  /* 整行就是一个公式？→ 排成块级，居中并可横向滚动 */
  function isBlockMath(s) {
    var t = String(s).replace(/^\s+|\s+$/g, "");
    if (t.length < 12 || t.length > 320) return false;
    if (RE_CJK.test(t)) return false;
    if (RE_ART.test(t)) return false;
    if (!/[=\u2212\u2211\u222B\u2202\u2207\u2192]/.test(t)) return false;
    var cand = (t.match(RE_CAND_G) || []).length;
    if (cand / t.length < 0.95) return false;
    return isMathSeg(t);
  }

  var PH_A = "\uE000", PH_B = "\uE001";

  /* Markdown 化：公式 + **粗体** + `行内码` */
  function md(raw, opts) {
    var s = String(raw), codes = [];
    /* 先保护行内码，免得里面的符号被当公式 */
    s = s.replace(/`([^`]+)`/g, function (_, c) {
      codes.push(c);
      return PH_A + (codes.length - 1) + PH_B;
    });
    var html = render(s, opts);
    html = html.replace(/\*\*([^*]+)\*\*/g, "<b>$1</b>");
    html = html.replace(new RegExp(PH_A + "(\\d+)" + PH_B, "g"), function (_, n) {
      return "<code>" + esc(codes[+n]) + "</code>";
    });
    return html;
  }

  /* 多行文本 → 逐行渲染后用 <br> 连接（替代原来的 nl） */
  function lines(raw, opts) {
    return String(raw).split("\n").map(function (l) {
      return RE_ART.test(l) ? esc(l) : render(l, opts);
    }).join("<br>");
  }

  /* 对话文本：模型常返回 markdown + $公式$，这里连换行一起处理 */
  function chat(raw) {
    var s = String(raw);
    var out = [], inCode = false;
    s.split("\n").forEach(function (l) {
      if (/^\s*```/.test(l)) { inCode = !inCode; out.push(esc(l)); return; }
      if (inCode) { out.push(esc(l)); return; }
      if (!l.trim()) { out.push(""); return; }
      var h = render(l);
      h = h.replace(/\*\*([^*]+)\*\*/g, "<b>$1</b>")
           .replace(/`([^`]+)`/g, "<code>$1</code>")
           .replace(/^\s*#{1,6}\s*/, "")
           .replace(/^\s*[-*]\s+/, "· ");
      out.push(h);
    });
    return out.join("<br>");
  }

  var MT = {
    render: render,
    md: md,
    lines: lines,
    chat: chat,
    esc: esc,
    toTex: toTex,
    tex: function (s) { return fracify(toTex(s)); },
    segs: function (s) { RE_CAND.lastIndex = 0; return String(s).match(RE_CAND) || []; },
    isMathSeg: isMathSeg,
    isBlockMath: isBlockMath,
    isArtLine: function (l) { return RE_ART.test(l); },
    has: function (s) { return RE_EXPLICIT.test(s) || RE_STRONG.test(s); },
    stats: function () { return { ok: stat.ok, fail: stat.fail.slice() }; },
    reset: function () { stat.ok = 0; stat.fail = []; },
    ready: !!KX
  };

  /* ready 要跟着「KaTeX 到没到」实时变，不能在建表时就定死 */
  try {
    Object.defineProperty(MT, "ready", { get: function () { return !!(root.katex || KX); } });
  } catch (e) {}

  root.MT = MT;
})(typeof globalThis !== "undefined" ? globalThis : this);
