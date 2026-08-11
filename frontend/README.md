# Crypto Dashboard — Frontend

React + TypeScript client for the Crypto Dashboard. Talks only to [the project's own Spring Boot API](../backend) — never to CoinGecko directly. See the [root README](../README.md) for the full-stack picture.

## Features

- 📊 Live market data for the top 100 cryptocurrencies (price, 24h change, market cap, volume)
- 🔍 Client-side search and sorting (by price, market cap, 24h change)
- 📈 Coin detail page with an interactive price chart (24h / 7d / 30d / 1y) built with Recharts
- ⭐ Favorites persisted server-side (H2 database via the backend API), with optimistic UI updates
- 🌗 Light / dark mode toggle (stored in `localStorage` — a pure UI preference, not app data)
- ⏳ Loading, empty and error states (with retry) for every network call
- 📱 Fully responsive layout, mobile-first

## Tech Stack

| Layer       | Tech                                      |
| ----------- | ------------------------------------------ |
| UI          | React 18, TypeScript                       |
| Routing     | React Router 6                             |
| Styling     | Tailwind CSS                               |
| Charts      | Recharts                                   |
| Build tool  | Vite                                       |
| Data source | This project's own REST API (`fetch`)      |
| Linting     | ESLint (flat config) + typescript-eslint   |

## Project structure

```
src/
  api/          fetch wrappers for the backend API
  components/   reusable, presentational UI components
  context/      React Context providers (theme, favorites)
  hooks/        custom hooks (data fetching, debounce)
  pages/        route-level components (Dashboard, CoinDetail, Favorites)
  types/        shared TypeScript types (mirror the backend DTOs)
  utils/        formatting helpers (currency, percentages, dates)
```

## Getting started

Requires [Node.js](https://nodejs.org/) 18+ and the [backend](../backend) running on `:8080`.

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

## Configuration

By default the app talks to `http://localhost:8080/api`. To point it somewhere else, create a `.env.local` file:

```
VITE_API_BASE_URL=http://localhost:8080/api
```
