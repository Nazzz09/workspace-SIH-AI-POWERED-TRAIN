# AI Automatic Block Planning Engine — Indian Railways (Lucknow Division)

An AI-powered maintenance block planning system built for **Smart India Hackathon (SIH)**. It helps the Lucknow Division of Indian Railways plan track maintenance blocks intelligently — reducing train delays, improving punctuality, and keeping track assets healthy.

**Live Demo:** https://workspace-sih-ai-powered-train.vercel.app

## What it does

- **Live corridor monitoring** — health scores, speed restrictions (TSR) and signalling status for the Lucknow–Kanpur high-density corridor sections
- **AI block recommendations** — algorithmic maintenance block proposals with proposed windows, delay impact and AI confidence scores, queued for Section Controller / Sr. DOM sanction
- **Impact analytics** — block hours granted, delay reduction, punctuality gain, asset health & safety index, and section capacity utilisation
- **Shadow block optimisation** — combines Civil, TRD and S&T work into shared closures to save line downtime

## Tech Stack

- **Next.js 14** (App Router) + **React 18** + **TypeScript**
- **Tailwind CSS** for UI, **Recharts** for analytics, **Leaflet** for maps
- **Framer Motion** + **Lucide** icons
- Deployed on **Vercel**

## Run locally

```bash
cd railway-ai-block-planner
npm install
npm run dev
```

Then open http://localhost:3000

## Project structure

The application lives in the [`railway-ai-block-planner/`](railway-ai-block-planner/) folder.

---

Built by **Naitik Jaiswal** (BTech CSE — AI+ML) and team.
