# Crypto Dashboard — Full Stack

A full-stack cryptocurrency dashboard: a **Spring Boot / Java** REST API backend and a **React / TypeScript** frontend. Built as a portfolio project to demonstrate the same layered architecture used in production Java backends, paired with a modern frontend stack.

```
┌─────────────┐        REST/JSON        ┌──────────────┐        REST/JSON        ┌───────────┐
│   React +   │  ────────────────────▶  │ Spring Boot  │  ────────────────────▶  │ CoinGecko │
│  TypeScript │  ◀────────────────────  │     API      │  ◀────────────────────  │  (public) │
│ (localhost  │                         │  (localhost  │                         └───────────┘
│    :5173)   │                         │    :8080)    │
└─────────────┘                         └──────┬───────┘
                                                 │
                                                 ▼
                                          ┌─────────────┐
                                          │  H2 database │
                                          │  (favorites) │
                                          └─────────────┘
```

The frontend never talks to CoinGecko directly — every request goes through the backend, which proxies/caches market data and owns the favorites data (persisted in H2, not `localStorage`).

## Projects

- [`backend/`](backend) — Spring Boot REST API. See [backend/README.md](backend/README.md).
- [`frontend/`](frontend) — React + TypeScript client. See [frontend/README.md](frontend/README.md).

## Features

- Live top-100 cryptocurrency market data, with search, sort and pagination
- Coin detail page with historical price chart (24h / 7d / 30d / 1y)
- Favorites, persisted server-side in a real database
- Light / dark mode
- Loading, empty and error states throughout, with retry on failure
- Layered backend (controller/service/repository/DTO) with in-memory caching and centralized error handling

## Running it locally

Two terminals, backend first:

```bash
# Terminal 1 — backend (requires JDK 21 + Maven)
cd backend
mvn spring-boot:run
```

```bash
# Terminal 2 — frontend (requires Node.js 18+)
cd frontend
npm install
npm run dev
```

Open http://localhost:5173.

## Why this project

Built to pair two skill sets in a single, real project: a Java/Spring Boot backend (the same stack and layered pattern used in this author's other projects) and a React/TypeScript frontend — rather than two separate one-off demos.
