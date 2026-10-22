# InvestSphere

Invest smarter. Understand better. Plan ahead.

InvestSphere is a frontend-only investment & wealth-management practice app. Browse mutual
funds, stocks, and bonds, track a simulated portfolio, run SIP/CAGR/goal calculators, and more —
all backed by mock data and your browser's local storage. No backend, no real money.

## Requirements

- [Node.js](https://nodejs.org/) 18 or newer (tested on Node 24)
- npm (comes with Node)

## Setup

```bash
npm install
npm run dev
```

Then open the URL printed in the terminal (usually `http://localhost:5173`).

## Other commands

```bash
npm run build    # production build, output in dist/
npm run preview  # locally preview the production build
npm run lint     # run oxlint
```

## Project structure

```
src/
  components/   reusable UI pieces (Navbar, Modal, cards, charts, ...)
  context/      shared app state (Theme, Watchlist, Portfolio, Notification, Cart)
  data/         mock data (funds, stocks, bonds, goals, articles, ...)
  pages/        one file per route/screen
  utils/        calculations, formatting, and localStorage helpers
```

## Tech stack

React, Vite, React Router, Recharts, Lucide React, and CSS. Data persistence is handled with
the browser's `localStorage` — clearing your browser storage resets the app back to its seed data.
