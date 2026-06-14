# AI Worth It? — Workflow ROI Tracker

A simple, jargon-free web app that helps a **non-technical operator** answer one
question: *“Is using AI in this workflow actually worth it — and where should I
use it more or less?”*

You describe each task where you use AI (how often it runs, minutes with vs.
without AI, who does it and what they cost). The app turns that into a clear
**per-workflow verdict** and a **portfolio view** so you can see your biggest win
and biggest leak at a glance.

## What it does

- **Plain-English inputs** — only things you actually know (no tokens, no APIs)
- **Live ROI preview** — the verdict updates as you type
- **A verdict per workflow** — Expand · Optimize · Keep · Reconsider
- **Portfolio dashboard** — a value-vs-cost quadrant (the hero visual), total
  net monthly impact, and “biggest win / biggest leak” callouts
- **Built-in demo data** — useful the instant it opens
- Everything stays in your browser (localStorage). No account, no backend.

## How the numbers work

| Step | Formula |
|------|---------|
| Time saved per task | minutes without AI − minutes with AI |
| Hours saved / month | (time saved × runs per month) ÷ 60 |
| Value / month | hours saved × hourly cost + attributed revenue |
| Net / month | value − AI cost |
| ROI % | net ÷ AI cost |

A workflow is plotted by **monthly value (y)** vs **monthly AI cost (x)**:

- **High value, low cost → Expand** (clear win)
- **High value, high cost → Optimize** (worth it, trim the cost)
- **Low value, low cost → Keep** (minor help, monitor it)
- **Low value, high cost / losing money → Reconsider**

## Run it locally

```bash
cd ai-roi-tracker
npm install
npm run dev      # http://localhost:5173
```

```bash
npm run build    # production build into dist/
npm run preview  # preview the production build
```

## Deploy

The app is a static bundle, so any static host works. The base path adjusts
automatically per host (root hosts get `/`, GitHub Pages gets `/course/`).

### Netlify (recommended here — builds off-GitHub)

A [`netlify.toml`](../netlify.toml) at the repo root is preconfigured. On
[netlify.com](https://app.netlify.com): **Add new site → Import an existing
project → pick this repo**. It reads the config automatically (base
`ai-roi-tracker/`, build `npm run build`, publish `dist`) and redeploys on every
push. No GitHub Actions required.

### Vercel

[`vercel.json`](./vercel.json) is preconfigured. On
[vercel.com](https://vercel.com): **Add New → Project → import this repo**, and
set **Root Directory = `ai-roi-tracker`**. Vercel auto-detects Vite and deploys
on push.

### GitHub Pages (needs Actions enabled)

Pushing triggers [`.github/workflows/deploy.yml`](../.github/workflows/deploy.yml),
which publishes to `https://<user>.github.io/course/`.

> Requires: **Settings → Pages → Source → GitHub Actions**, and an account where
> GitHub Actions is enabled (it's blocked while an account is locked for billing).

## Tech

Single-page React app (Vite) · Recharts · client-side state only. Built to MVP
scope — no API integrations, accounts, or syncing.
