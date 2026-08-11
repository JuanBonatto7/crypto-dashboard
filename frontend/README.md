# Crypto Dashboard

A responsive cryptocurrency dashboard built with **React 18 + TypeScript**, styled with **Tailwind CSS**, and powered by the public [CoinGecko API](https://www.coingecko.com/en/api). No backend, no API key required.

## Features

- 📊 Live market data for the top 100 cryptocurrencies (price, 24h change, market cap, volume)
- 🔍 Client-side search and sorting (by price, market cap, 24h change)
- 📈 Coin detail page with an interactive price chart (24h / 7d / 30d / 1y) built with Recharts
- ⭐ Favorites list persisted in `localStorage`
- 🌗 Light / dark mode toggle
- ⏳ Loading, empty and error states (with retry) for every network call
- 📱 Fully responsive layout, mobile-first

## Tech Stack

| Layer          | Tech                                   |
| -------------- | --------------------------------------- |
| UI              | React 18, TypeScript                    |
| Routing         | React Router 6                          |
| Styling         | Tailwind CSS                            |
| Charts          | Recharts                                |
| Build tool      | Vite                                    |
| Data source     | CoinGecko public REST API (`fetch`)     |
| Linting         | ESLint (flat config) + typescript-eslint |

## Project structure

```
src/
  api/          fetch wrappers for the CoinGecko API
  components/   reusable, presentational UI components
  context/      React Context providers (theme, favorites)
  hooks/        custom hooks (data fetching, debounce)
  pages/        route-level components (Dashboard, CoinDetail, Favorites)
  types/        shared TypeScript types
  utils/        formatting helpers (currency, percentages, dates)
```

## Getting started

Requires [Node.js](https://nodejs.org/) 18+.

```bash
npm install
npm run dev
```

Then open http://localhost:5173.

Other scripts:

```bash
npm run build     # type-check and build for production
npm run preview   # preview the production build locally
npm run lint       # run ESLint
```

## Notes

- CoinGecko's free tier has rate limits; the UI surfaces a friendly error with a retry button if a request is throttled (HTTP 429).
- Favorites and theme preference are stored in the browser's `localStorage`, so they persist across sessions without needing a backend or authentication.
