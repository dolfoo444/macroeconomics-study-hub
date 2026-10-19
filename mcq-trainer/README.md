# Macro MCQ Trainer

Interactive multiple-choice trainer for **Macroeconomics for Quantitative Economics (6011P0506Y)**, UvA.

- **84 past-exam MCQs** from the 2019, 2020, 2021, 2021-resit, 2022, 2023 and 2026-resit papers, sorted **by topic/week** and **by exam year**.
- Click an answer → instant right/wrong feedback + a **step-by-step worked solution** grounded in the official answer key.
- **17 predicted MCQs** written in the exam's exact style for the upcoming final (a "★ Predicted final" mock).
- Keyboard: `1`–`4` / `a`–`d` to answer, `Enter` for next. Light/dark theme. Progress saved in your browser.

## How it's organised
`index.html` + `assets/` (style.css, app.js, data.js). Pure static site — no build step.
`data.js` is generated from `data/questions.json` and `data/predictions.json`.

Served as a static page; open `index.html` or host on GitHub Pages.
