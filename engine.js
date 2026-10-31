/* 学习法远征 · 引擎：状态、SM-2 调度、评分、校准、成就 */

var Engine = (function () {
  var KEY = "learn_os_state_v1";
  var NEW_LIMIT = 20;

  function today() {
    var d = new Date();
    return d.getFullYear() + "-" + (d.getMonth() + 1) + "-" + d.getDate();
  }
  function dayNum() {
    return Math.floor(new Date().setHours(0, 0, 0, 0) / 86400000);
  }
  function addDays(n) {
    var d = new Date();
    d.setHours(0, 0, 0, 0);
    d.setDate(d.getDate() + n);
    return Math.floor(d.getTime() / 86400000);
  }

  function blankCard() {
    return { ef: 2.5, iv: 0, rep: 0, due: dayNum(), lapses: 0, seen: 0, ok: 0, learned: false };
  }

  function defaults() {
    return {
      version: 1, xp: 0, fragments: 0, streak: 0, lastDay: null,
      days: [], cards: {}, levels: {}, log: [], achievements: [],
      newToday: 0, newDay: null,
      bossWrong: {}
    };
  }

  var S = null;

  function load() {
    try {
      var raw = localStorage.getItem(KEY);
      S = raw ? JSON.parse(raw) : defaults();
    } catch (e) { S = defaults(); }
    if (!S.cards) S.cards = {};
    if (!S.levels) S.levels = {};
    if (typeof S.xp !== "number" || isNaN(S.xp)) S.xp = 0;
    if (!S.log) S.log = [];
    if (!S.days) S.days = [];
    if (!S.achievements) S.achievements = [];
    return S;
  }

  function save() {
    try { localStorage.setItem(KEY, JSON.stringify(S)); } catch (e) {}
  }

  function state() { return S || load(); }

  /* ---------- 每日登录与连胜 ---------- */
  function touchDay() {
    var t = today();
    if (S.lastDay === t) return;
    var dn = dayNum();
    var last = S.lastDay ? parseDay(S.lastDay) : null;
    if (last && dn - last === 1) S.streak += 1;
    else if (last && dn - last > 1) S.streak = 1;
    else if (!last) S.streak = 1;
    S.lastDay = t;
    if (S.days.indexOf(t) < 0) S.days.push(t);
    if (S.newDay !== t) { S.newDay = t; S.newToday = 0; }
    save();
  }
  function parseDay(s) {
    var p = s.split("-");
    return Math.floor(new Date(+p[0], +p[1] - 1, +p[2]).getTime() / 86400000);
  }

  /* ---------- SM-2 ---------- */
  function gradeCard(id, g) {
    var c = S.cards[id] || (S.cards[id] = blankCard());
    c.seen += 1;
    if (g >= 3) {
      c.ok += 1;
      if (c.rep === 0) c.iv = 1;
      else if (c.rep === 1) c.iv = 3;
      else c.iv = Math.round(c.iv * c.ef);
      if (g === 5) c.iv = Math.round(c.iv * 1.3);
      c.rep += 1;
      c.ef = c.ef + (0.1 - (5 - g) * (0.08 + (5 - g) * 0.02));
      if (c.ef < 1.3) c.ef = 1.3;
      if (c.ef > 2.5) c.ef = 2.5;
      c.due = addDays(c.iv);
    } else {
      c.lapses += 1;
      c.rep = 0;
      c.iv = 0;
      c.due = dayNum();
    }
    save();
    return c;
  }

  /* ---------- 出卡范围：只放行读完的章节 ----------
     闪卡是「提取」，前提是「编码」已经发生。所以队列只从已通关的章节里取卡：
     读到第 8 章的人，不该在今日复习里看见第 9 章的超函数——那不是复习，是预习，
     而且是没有上下文的预习。
     历史状态里若已把未读章节的卡标了 seen（老版本会这么干），这里同样挡住。 */
  function openedChapters() {
    var set = {};
    (DATA.levels || []).forEach(function (lv) {
      var rec = S.levels[lv.id];
      if (!rec || !rec.done) return;
      var ch = lv.chapter ? String(lv.chapter).replace(/^ch/, "") : "";
      if (ch) set[ch] = 1;
    });
    return set;
  }
  function openCards() {
    var open = openedChapters();
    return DATA.cards.filter(function (c) { return open[String(c.ch)]; });
  }

  /* ---------- 队列 ---------- */
  function dueCards() {
    var dn = dayNum();
    return openCards().filter(function (c) {
      var st = S.cards[c.id];
      return st && st.seen > 0 && st.due <= dn;
    });
  }
  function newCards() {
    var lim = NEW_LIMIT - (S.newDay === today() ? S.newToday : 0);
    if (lim <= 0) return [];
    return openCards().filter(function (c) {
      var st = S.cards[c.id];
      return !st || st.seen === 0;
    }).slice(0, lim);
  }
  function countNew() { return newCards().length; }

  function markNewTaken() {
    if (S.newDay !== today()) { S.newDay = today(); S.newToday = 0; }
    S.newToday += 1;
    save();
  }

  /* ---------- 掌握度 ---------- */
  function regionMastery(r) {
    var list = DATA.cards.filter(function (c) { return c.r === r; });
    if (!list.length) return 0;
    var score = 0;
    list.forEach(function (c) {
      var st = S.cards[c.id];
      if (!st || !st.seen) return;
      var base = st.iv >= 21 ? 1 : Math.min(st.iv / 21, 0.9);
      score += Math.max(0, base - st.lapses * 0.15);
    });
    return Math.round(Math.min(100, (score / list.length) * 100));
  }

  /* ---------- 已学（先编码，才允许提取） ---------- */
  function isLearned(id) {
    var c = S.cards[id];
    return !!(c && c.learned);
  }
  function markLearned(id) {
    var c = S.cards[id] || (S.cards[id] = blankCard());
    if (c.learned) return c;
    c.learned = true;
    save();
    return c;
  }
  function unlearnedCount() {
    return openCards().filter(function (c) { return !isLearned(c.id); }).length;
  }
  function openCardCount() {
    return openCards().length;
  }
  function applyLessonTeaches(levelId) {
    var lv = DATA.levels.filter(function (l) { return l.id === levelId; })[0];
    if (!lv) return 0;
    var src = null;
    if (lv.lesson) {
      src = (DATA.lessons || []).filter(function (x) { return x.id === lv.lesson; })[0];
    } else if (lv.chapter) {
      src = (DATA.chapters || []).filter(function (x) { return x.id === lv.chapter; })[0];
    }
    if (!src || !src.teaches) return 0;
    var n = 0;
    src.teaches.forEach(function (cid) {
      if (!isLearned(cid)) { markLearned(cid); n++; }
    });
    return n;
  }

  /* ---------- 日志 ---------- */
  function logItem(o) {
    o.ts = Date.now();
    S.log.push(o);
    if (S.log.length > 500) S.log.shift();
    save();
  }

  function calibration() {
    var arr = S.log.filter(function (l) { return typeof l.predict === "number"; });
    if (!arr.length) return { n: 0, err: null };
    var sum = 0;
    arr.forEach(function (l) {
      var p = l.predict / 5;
      sum += Math.abs(p - (l.correct ? 1 : 0));
    });
    return { n: arr.length, err: sum / arr.length };
  }

  function mistakeStats() {
    var m = { 事实缺失: 0, 规则误用: 0, 条件误判: 0, 表达不清: 0 };
    S.log.forEach(function (l) { if (l.mtype && m[l.mtype] !== undefined) m[l.mtype] += 1; });
    return m;
  }

  /* ---------- 奖励 ---------- */
  function awardXp(n, why) {
    S.xp += n;
    if (why) S.fragments += Math.max(1, Math.round(n / 5));
    checkAchievements();
    save();
    return S.xp;
  }
  function level() { return Math.floor(S.xp / 100) + 1; }

  function checkAchievements() {
    DATA.achievements.forEach(function (a) {
      if (S.achievements.indexOf(a.id) < 0) {
        try { if (a.cond(S)) S.achievements.push(a.id); } catch (e) {}
      }
    });
  }

  /* ---------- 关卡进度 ---------- */
  function setLevelResult(id, score, total) {
    var pct = Math.round((score / total) * 100);
    var rec = S.levels[id] || { done: false, best: 0, tries: 0 };
    rec.tries += 1;
    rec.best = Math.max(rec.best || 0, pct);
    if (pct >= 80) {
      rec.done = true;
      var taught = applyLessonTeaches(id);
      if (taught) rec.taught = taught;
    }
    S.levels[id] = rec;
    checkAchievements();
    save();
    return rec;
  }

  /* ---------- 逐页进度（精读关/教材关读到第几页） ----------
     存在 S.levels[id].page 里：退出关卡、回到地图、甚至关掉浏览器，
     再进来都从这一页继续，不用重看前面几十页。 */
  function setPage(id, idx) {
    if (!id) return;
    var rec = S.levels[id] || (S.levels[id] = { done: false, best: 0, tries: 0 });
    var v = Math.max(0, idx | 0);
    if (rec.page === v) return;
    rec.page = v;
    save();
  }
  function getPage(id) {
    var rec = S.levels[id];
    return rec && typeof rec.page === "number" ? rec.page : 0;
  }

  /* ---------- 解锁 ----------
     三条规则并存：
       ① 上一关通关 ⇒ 解锁（原有的线性链，保证区域与综合关按序推进）
       ② 精读关：本区域入口（导论）通关后，各章可按任意顺序阅读
       ③ 闪卡关：本区域全部精读关通关才解锁 —— 先编码后提取 */
  function unlocked(lv) {
    var idx = DATA.levels.indexOf(lv);
    if (idx === 0) return true;
    var prev = DATA.levels[idx - 1];
    if (S.levels[prev.id] && S.levels[prev.id].done) return true;
    if (lv.type === "read") {
      var first = DATA.levels.filter(function (l) { return l.r === lv.r; })[0];
      if (!first || first === lv) return false;
      return !!(S.levels[first.id] && S.levels[first.id].done);
    }
    if (lv.type === "cards") {
      var reads = DATA.levels.filter(function (l) { return l.r === lv.r && l.type === "read"; });
      return reads.length > 0 && reads.every(function (l) {
        return S.levels[l.id] && S.levels[l.id].done;
      });
    }
    return false;
  }

  /* ---------- 导出 ---------- */
  function exportCsv() {
    var rows = [["front", "back", "type", "example"]];
    DATA.cards.forEach(function (c) {
      rows.push([c.q, c.a, "definition", c.t + " · " + c.r]);
    });
    return rows.map(function (r) {
      return r.map(function (v) { return '"' + String(v).replace(/"/g, '""') + '"'; }).join(",");
    }).join("\n");
  }
  function exportJson() { return JSON.stringify(S, null, 2); }

  function reset() { S = defaults(); save(); }

  return {
    load: load, save: save, state: state, touchDay: touchDay,
    gradeCard: gradeCard, dueCards: dueCards, newCards: newCards, countNew: countNew,
    markNewTaken: markNewTaken, regionMastery: regionMastery, logItem: logItem,
    isLearned: isLearned, markLearned: markLearned, unlearnedCount: unlearnedCount,
    openedChapters: openedChapters, openCards: openCards, openCardCount: openCardCount,
    applyLessonTeaches: applyLessonTeaches,
    calibration: calibration, mistakeStats: mistakeStats, awardXp: awardXp, level: level,
    setLevelResult: setLevelResult, unlocked: unlocked,
    setPage: setPage, getPage: getPage,
    exportCsv: exportCsv, exportJson: exportJson, reset: reset,
    today: today, dayNum: dayNum
  };
})();