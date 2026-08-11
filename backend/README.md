# Crypto Dashboard — Backend

Spring Boot REST API that powers the [Crypto Dashboard](../README.md). It proxies and caches the public [CoinGecko API](https://www.coingecko.com/en/api) and persists favorites in an embedded H2 database — the frontend never calls CoinGecko directly.

## Tech Stack

- Java 21, Spring Boot 3
- Spring Web (`RestClient` for outbound HTTP)
- Spring Data JPA + H2 (file-based embedded database)
- Maven

## Architecture

Layered, the same pattern used across this author's other Java projects:

```
controller/   REST endpoints (CoinController, FavoriteController)
service/      business logic, CoinGecko proxy + in-memory cache (CoinService), favorites CRUD (FavoriteService)
repository/   Spring Data JPA (FavoriteRepository)
model/entity/ JPA entities (Favorite)
dto/          API request/response shapes, never the entities themselves
config/       CORS, RestClient bean
exception/    ApiException + @RestControllerAdvice global error handling
```

## Endpoints

| Method | Path                          | Description                              |
| ------ | ------------------------------ | ----------------------------------------- |
| GET    | `/api/coins`                   | Top 100 coins by market cap               |
| GET    | `/api/coins?ids=bitcoin,ethereum` | Coins filtered by id                   |
| GET    | `/api/coins/{id}`              | Coin detail                               |
| GET    | `/api/coins/{id}/chart?days=7` | Historical price points (1, 7, 30 or 365) |
| GET    | `/api/favorites`               | List saved favorites                      |
| POST   | `/api/favorites/{coinId}`      | Add a favorite                            |
| DELETE | `/api/favorites/{coinId}`      | Remove a favorite                         |

## Getting started

Requires JDK 21 and Maven.

```bash
mvn spring-boot:run
```

The API starts on `http://localhost:8080`. The H2 database is a local file under `backend/data/` (ignored by git), and its web console is available at `http://localhost:8080/h2-console` while the app is running (JDBC URL: `jdbc:h2:file:./data/cryptodashboard`).

Other commands:

```bash
mvn test    # run tests
mvn package # build the executable jar
```

## Notes

- CoinGecko responses are cached in memory (60s for listings, 2min for coin detail, 5min for charts) to stay within the free tier's rate limits.
- CORS is restricted to `http://localhost:5173` (the frontend's dev server) via `app.cors.allowed-origin` in `application.properties`.
