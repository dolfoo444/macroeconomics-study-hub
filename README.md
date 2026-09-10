# Macroeconomics — Study Hub

An interactive, single-page study website for **Macroeconomics for Quantitative Economics** (University of Amsterdam, following Mankiw's *Macroeconomics*, 12th ed.). Built from the Course Manual, lecture slides, homework, and past midterms & finals (2017–2025).

🔗 **Live site:** once GitHub Pages is enabled, this is served at `https://<your-username>.github.io/macroeconomics-study-hub/`

## What's inside

Two hubs you switch between with the tab bar:

### 📘 Midterm Hub (Weeks 1–3)
National accounts (GDP, deflators, chain-weighting), the classical circular-flow models (closed & small open economy), the monetary system, inflation & the quantity theory, exchange rates, and unemployment.

### 📗 Final Exam Hub (all 6 weeks)
Everything above **plus** the business-cycle toolkit: the Keynesian Cross & multiplier, the IS-LM model, the Mundell-Fleming model (floating vs fixed exchange rates), and the AD-AS model with the Phillips curve and the Lucas critique.

Each hub has six sections:
1. **Step-by-step theory** — intuition → formal model → *how it's tested*.
2. **High-probability exam topics** — ranked by how reliably they recur.
3. **Pure-theory MCQ bank** — original true/false & concept questions with revealed reasoning.
4. **Numerical practice** — original problems matching the exam parts, fully worked.
5. **Likely vs unlikely** — what to study vs what the Course Manual explicitly *excludes* (e.g. the Solow model, sticky-price/imperfect-information AS, the sacrifice ratio).
6. **Formula sheet** — one-screen quick reference.

## Notes on integrity
- All questions here are **original practice** written to match the exam's structure and difficulty. The real past-exam questions are **copyright © Koen Vermeylen** and are **not** reproduced.
- "Likely vs unlikely" reflects the recurring exam structure and the Course Manual's stated reading list and exclusions. Always confirm against your official Canvas materials.

## Features
- Tabbed navigation, collapsible self-test accordions, math rendered with **MathJax**.
- Clean, responsive, light/dark-theme-aware design. One self-contained `index.html`, no build step.
- Guess-correction aware study advice (a blind MCQ guess has expected value ≤ 0).

## Run locally
Open `index.html` in any browser (needs internet the first time so MathJax loads from its CDN).

## Enable the live website (GitHub Pages)
1. Push this repository to GitHub.
2. **Settings → Pages → Build and deployment → Source → Deploy from a branch.**
3. Branch **`main`**, folder **`/ (root)`**, **Save**. Live in ~1 minute at `https://<your-username>.github.io/macroeconomics-study-hub/`.
