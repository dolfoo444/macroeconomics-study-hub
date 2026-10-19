/* ===== Macro MCQ Trainer ===== */
(function () {
  "use strict";
  const TOPICS = window.TOPICS || [];
  const Q = window.QUESTIONS || [];
  const PRED = window.PREDICTIONS || [];
  const LAB = ["a", "b", "c", "d", "e"];
  const topicLabel = {}; TOPICS.forEach(t => topicLabel[t.key] = t.label);

  // ---- storage (safe) ----
  const store = {
    get(k, d) { try { const v = localStorage.getItem(k); return v == null ? d : JSON.parse(v); } catch (e) { return d; } },
    set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} }
  };
  // seen[id] = 'ok' | 'no'
  let seen = store.get("macro_seen", {});
  function record(id, ok) { seen[id] = ok ? "ok" : "no"; store.set("macro_seen", seen); }

  // ---- theme ----
  const root = document.documentElement;
  const savedTheme = store.get("macro_theme", null);
  if (savedTheme) root.setAttribute("data-theme", savedTheme);
  function toggleTheme() {
    const cur = root.getAttribute("data-theme") === "light" ? "dark" : "light";
    root.setAttribute("data-theme", cur); store.set("macro_theme", cur);
    document.getElementById("themeBtn").textContent = cur === "light" ? "🌙" : "☀️";
  }
  // ---- helpers ----
  const $ = s => document.querySelector(s);
  const el = (t, c, h) => { const e = document.createElement(t); if (c) e.className = c; if (h != null) e.innerHTML = h; return e; };
  function shuffle(a) { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1));[a[i], a[j]] = [a[j], a[i]]; } return a; }

  // Build collections: by topic, by year, predicted, all
  const years = [...new Set(Q.map(q => q.year))].sort((a, b) => a - b);
  const yearName = y => y === 2021.5 ? "Resit 2021" : (y === 2026 ? "Resit 2026" : "Exam " + y);

  let mode = "topic"; // topic | year | pred | all
  let app, view;

  function init() {
    app = $("#app");
    $("#themeBtn").textContent = root.getAttribute("data-theme") === "light" ? "🌙" : "☀️";
    $("#themeBtn").addEventListener("click", toggleTheme);
    $("#resetBtn").addEventListener("click", () => {
      if (confirm("Reset all your progress on this device?")) { seen = {}; store.set("macro_seen", {}); renderHome(); }
    });
    document.querySelectorAll(".tab").forEach(t => t.addEventListener("click", () => {
      mode = t.dataset.mode;
      document.querySelectorAll(".tab").forEach(x => x.classList.toggle("active", x === t));
      renderHome();
    }));
    renderStats();
    renderHome();
  }

  function renderStats() {
    const total = Q.length;
    const done = Q.filter(q => seen[q.id]).length;
    const ok = Q.filter(q => seen[q.id] === "ok").length;
    const pct = done ? Math.round(100 * ok / done) : 0;
    $("#statTotal").textContent = total;
    $("#statDone").textContent = done;
    $("#statAcc").textContent = done ? pct + "%" : "–";
  }

  // ---------- HOME ----------
  function renderHome() {
    renderStats();
    app.innerHTML = "";
    const grid = el("div", "grid");
    if (mode === "topic") {
      TOPICS.forEach(t => {
        const list = Q.filter(q => q.topic === t.key);
        grid.appendChild(collectionCard({
          wk: t.label.split("·")[0] || "Topic", title: (t.label.split("·")[1] || t.label).trim(),
          blurb: t.blurb, list, start: () => startQuiz(list, t.label, false)
        }));
      });
    } else if (mode === "year") {
      years.forEach(y => {
        const list = Q.filter(q => q.year === y);
        grid.appendChild(collectionCard({
          wk: "Past paper", title: yearName(y),
          blurb: "All " + list.length + " multiple-choice questions from this sitting, with full worked solutions.",
          list, start: () => startQuiz(list, yearName(y), false)
        }));
      });
    } else if (mode === "pred") {
      app.appendChild(predIntro());
      TOPICS.forEach(t => {
        const list = PRED.filter(q => q.topic === t.key);
        if (!list.length) return;
        grid.appendChild(collectionCard({
          wk: "Predicted", title: (t.label.split("·")[1] || t.label).trim(),
          blurb: list.length + " original exam-style question" + (list.length > 1 ? "s" : "") + " drilling this theme.",
          list, pred: true, start: () => startQuiz(list, "Predicted · " + t.label, true)
        }));
      });
      const allP = el("div", "", "");
      app.appendChild(grid);
      const row = el("div", "navrow");
      const b = el("button", "btn primary", "▶ Take the full predicted mock (" + PRED.length + " Q)");
      b.onclick = () => startQuiz(PRED, "Predicted final · full mock", true);
      row.appendChild(b); app.appendChild(row);
      return;
    } else { // all
      const cards = [
        { wk: "Mixed", title: "All 84 questions (in order)", blurb: "Every past-exam MCQ, 2019 → 2026 resit.", list: Q, sh: false },
        { wk: "Mixed", title: "Random 20", blurb: "A quick randomized set of 20 past-exam questions.", list: shuffle(Q).slice(0, 20), sh: true },
        { wk: "Mixed", title: "Weak spots", blurb: "Questions you've answered incorrectly or not yet seen.", list: Q.filter(q => seen[q.id] !== "ok"), sh: true },
      ];
      cards.forEach(c => grid.appendChild(collectionCard({
        wk: c.wk, title: c.title, blurb: c.blurb, list: c.list,
        start: () => startQuiz(c.sh ? shuffle(c.list) : c.list, c.title, false)
      })));
    }
    app.appendChild(grid);
  }

  function predIntro() {
    const p = el("p", null, "These are <b>original questions written in the exam's exact style</b> — not past papers. Each targets a pattern the examiner reuses year after year. Treat them as a mock for the upcoming final.");
    p.style.color = "var(--muted)"; p.style.maxWidth = "64ch";
    return p;
  }

  function collectionCard(o) {
    const done = o.list.filter(q => seen[q.id]).length;
    const ok = o.list.filter(q => seen[q.id] === "ok").length;
    const pct = o.list.length ? Math.round(100 * done / o.list.length) : 0;
    const c = el("div", "card" + (o.pred ? " pred" : ""));
    if (o.pred) c.appendChild(el("div", "ribbon", "NEW"));
    c.appendChild(el("div", "wk", o.wk));
    c.appendChild(el("h3", null, o.title));
    c.appendChild(el("p", null, o.blurb));
    const meta = el("div", "meta");
    meta.appendChild(el("span", null, o.list.length + " question" + (o.list.length !== 1 ? "s" : "")));
    meta.appendChild(el("span", null, done ? (ok + "/" + done + " correct") : "not started"));
    c.appendChild(meta);
    const bar = el("div", "bar"); const i = el("i"); i.style.width = pct + "%"; bar.appendChild(i); c.appendChild(bar);
    c.addEventListener("click", o.start);
    return c;
  }

  // ---------- QUIZ ----------
  let Qset = [], idx = 0, score = 0, answered = 0, title = "", isPred = false, locked = false;

  function startQuiz(list, t, pred) {
    if (!list.length) { alert("Nothing here yet — great, you've cleared this set!"); return; }
    Qset = list; idx = 0; score = 0; answered = 0; title = t; isPred = pred; locked = false;
    window.scrollTo(0, 0);
    renderQuestion();
  }

  function renderQuestion() {
    locked = false;
    const q = Qset[idx];
    app.innerHTML = "";
    const quiz = el("div", "quiz");

    // top bar
    const top = el("div", "quiz-top");
    const back = el("button", "back", "← All sets");
    back.onclick = renderHome;
    top.appendChild(back);
    const pw = el("div", "progress-wrap");
    const bar = el("div", "bar"); const bi = el("i"); bi.style.width = (100 * idx / Qset.length) + "%"; bar.appendChild(bi); pw.appendChild(bar);
    top.appendChild(pw);
    top.appendChild(el("div", "scorechip", "Score <b>" + score + "</b> / " + answered));
    quiz.appendChild(top);
    quiz.appendChild(el("div", "qmeta", title + " — question " + (idx + 1) + " of " + Qset.length));

    // card
    const card = el("div", "qcard");
    const tags = el("div", "tagrow");
    if (isPred) {
      tags.appendChild(el("span", "tag pred", "★ PREDICTED"));
      tags.appendChild(el("span", "tag", (topicLabel[q.topic] || q.topic)));
    } else {
      tags.appendChild(el("span", "tag src", q.exam + " · Q" + q.q));
      tags.appendChild(el("span", "tag", (topicLabel[q.topic] || q.topic)));
    }
    card.appendChild(tags);
    card.appendChild(el("div", "qtext", q.text));
    if (q.table) card.appendChild(el("div", "qtable", q.table));
    if (q.img) {
      const fig = el("figure", "figwrap");
      const im = el("img", "figimg"); im.src = q.img; im.alt = "Exam figure for this question"; im.loading = "lazy";
      fig.appendChild(im);
      if (q.figure) fig.appendChild(el("figcaption", "figcap", q.figure));
      card.appendChild(fig);
    } else if (q.figure) {
      card.appendChild(el("div", "figure", "📈 " + q.figure));
    }

    const opts = el("div", "opts");
    q.options.forEach((o, i) => {
      const b = el("button", "opt");
      b.appendChild(el("span", "lab", LAB[i]));
      b.appendChild(el("span", "txt", o));
      b.addEventListener("click", () => choose(i, opts, card, q));
      opts.appendChild(b);
    });
    card.appendChild(opts);

    // explanation (hidden)
    const ex = el("div", "explain");
    ex.innerHTML = '<div class="verdict"></div><div class="body">' + q.explanation +
      (isPred && q.likely ? '<div class="likely">Why this is likely: ' + q.likely + '</div>' : '') + '</div>';
    card.appendChild(ex);

    // nav
    const nav = el("div", "navrow");
    const prev = el("button", "btn ghost", "← Prev");
    prev.disabled = idx === 0; prev.onclick = () => { if (idx > 0) { idx--; renderQuestion(); } };
    const next = el("button", "btn primary", idx === Qset.length - 1 ? "Finish ✓" : "Next →");
    next.id = "nextBtn"; next.disabled = true;
    next.onclick = () => { if (idx === Qset.length - 1) renderFinish(); else { idx++; renderQuestion(); } };
    const skip = el("button", "btn ghost", "Skip");
    skip.onclick = () => { if (idx === Qset.length - 1) renderFinish(); else { idx++; renderQuestion(); } };
    nav.appendChild(prev); nav.appendChild(skip); nav.appendChild(el("div", "", "")); nav.lastChild.style.flex = "1"; nav.appendChild(next);
    card.appendChild(nav);

    quiz.appendChild(card);
    app.appendChild(quiz);
  }

  function choose(i, opts, card, q) {
    if (locked) return; locked = true;
    answered++;
    const correct = q.correct;
    const ok = i === correct;
    if (ok) score++;
    record(q.id, ok);
    [...opts.children].forEach((b, j) => {
      b.classList.add("locked");
      if (j === correct) b.classList.add("correct");
      else if (j === i) b.classList.add("wrong");
      else b.classList.add("dim");
    });
    const ex = card.querySelector(".explain");
    ex.classList.add("show", ok ? "ok" : "no");
    ex.querySelector(".verdict").innerHTML = ok
      ? '✓ Correct'
      : '✗ Not quite — the answer is ' + LAB[correct] + '.';
    card.querySelector("#nextBtn").disabled = false;
    card.querySelector("#nextBtn").focus();
    // update score chip
    const chip = app.querySelector(".scorechip");
    if (chip) chip.innerHTML = "Score <b>" + score + "</b> / " + answered;
    renderStats();
  }

  function renderFinish() {
    const pct = answered ? Math.round(100 * score / answered) : 0;
    app.innerHTML = "";
    const card = el("div", "qcard finish");
    let msg = pct >= 85 ? "Exam-ready. 🎯" : pct >= 65 ? "Solid — tighten the weak spots." : "Keep drilling — you'll get there.";
    card.innerHTML = '<div class="big">' + pct + '%</div><div class="ring">' + score + ' / ' + answered + ' correct · ' + msg + '</div>';
    const nav = el("div", "navrow"); nav.style.justifyContent = "center";
    const again = el("button", "btn primary", "↻ Retry this set");
    again.onclick = () => startQuiz(Qset, title, isPred);
    const home = el("button", "btn ghost", "← All sets");
    home.onclick = renderHome;
    nav.appendChild(again); nav.appendChild(home);
    card.appendChild(nav);
    app.appendChild(card);
    window.scrollTo(0, 0);
  }

  // keyboard: 1-4 / a-d to answer, Enter/→ next
  document.addEventListener("keydown", e => {
    const opts = app && app.querySelector(".opts");
    if (opts && !locked) {
      const map = { "1": 0, "2": 1, "3": 2, "4": 3, "a": 0, "b": 1, "c": 2, "d": 3 };
      const k = e.key.toLowerCase();
      if (k in map && opts.children[map[k]]) { opts.children[map[k]].click(); e.preventDefault(); return; }
    }
    if ((e.key === "Enter" || e.key === "ArrowRight")) {
      const nb = app && app.querySelector("#nextBtn");
      if (nb && !nb.disabled) { nb.click(); e.preventDefault(); }
    }
  });

  document.addEventListener("DOMContentLoaded", init);
})();
