# Users API

A small, production-shaped REST API for managing users and their favorite [Studio Ghibli](https://ghibliapi.vercel.app/) films.

This repository is a **take-home challenge template**. The problem statement below is a stand-in. Swap it for the real brief when you receive one. The rest of this README is written so a reviewer can clone, run, explore, and judge the work in minutes.

---

## Badges

[![CircleCI](https://dl.circleci.com/status-badge/img/circleci/Tq8gYs4qewaE3ExgDwSHkJ/BgQnZTVcLqWG2Uxg9brNj3/tree/main.svg?style=svg&circle-token=CCIPRJ_96GDujNaascaKNsU6i4XxZ_559fb8b9e31f25853b4f09e0b4e7ff06623883d8)](https://dl.circleci.com/status-badge/redirect/circleci/Tq8gYs4qewaE3ExgDwSHkJ/BgQnZTVcLqWG2Uxg9brNj3/tree/main)

---

## Table of contents

- [Challenge statement](#challenge-statement)
- [Quick start (reviewer path)](#quick-start-reviewer-path)
- [Interactive API docs (Swagger)](#interactive-api-docs-swagger)
- [Prerequisites](#prerequisites)
- [Stack and architecture (and why)](#stack-and-architecture-and-why)
- [Features and HTTP API](#features-and-http-api)
- [Running the application](#running-the-application)
- [Local deployment for reviewers](#local-deployment-for-reviewers)
- [Testing](#testing)
- [Project structure](#project-structure)
- [Known limitations / what I would improve](#known-limitations--what-i-would-improve)
- [Next steps](#next-steps)

---

## Challenge statement

> Build a **Users API** that lets a client create, read, update, and delete users.
>
> Each user has a name, a unique email, a password, and an optional list of favorite film IDs from the public Studio Ghibli films API.
>
> When a user is returned, the API must **not** expose the password. Favorite film IDs must be **enriched** with film data (at least `id` and `title`) from the external Ghibli API.
>
> Treat this as a real service: validate input, use a relational database, hash secrets, isolate domain rules from HTTP and persistence, and make the project easy for another engineer to run locally.

What this codebase currently implements against that brief:


| Requirement                                   | Status                                        |
| --------------------------------------------- | --------------------------------------------- |
| CRUD for users                                | Implemented                                   |
| Unique email                                  | Enforced in domain + unique column            |
| Password hashing (never returned)             | Implemented with bcrypt                       |
| Favorite Ghibli films enriched on read/create | Implemented via a gateway port                |
| Input validation                              | Global `ValidationPipe`                       |
| Documented HTTP API                           | Swagger at `/swagger`                         |
| Reproducible local run                        | Docker Compose                                |
| Automated tests                               | End-to-end against a real Postgres and Docker |


---

## Quick start (reviewer path)

If you only have five minutes:

```
git clone <this-repo-url>
cd thchallenge
cp .env.example .env
npm run docker:up
```

`.env` is gitignored. Copying `.env.example` gives local-demo values (`admin` / `admin`, `DB_HOST=localhost`). That is enough for Node on the host. **Docker Compose overrides `DB_HOST=postgres`** in `docker-compose.yml`, so you do not put the Compose hostname in `.env` (that would break `npm run start:dev`).

In a normal repository `.env` would never be committed. These values would come from the project’s secret architecture (CI secrets, AWS Secrets Manager, GCP Secret Manager, Doppler, etc.), injected at runtime.

Then when the `app` container is healthy (postgres is up and ready to work), then you will be able to use it:


| What               | Where                                                          |
| ------------------ | -------------------------------------------------------------- |
| API                | [http://localhost:3000](http://localhost:3000)                 |
| Swagger UI         | [http://localhost:3000/swagger](http://localhost:3000/swagger) |
| pgAdmin (optional) | [http://localhost:5050](http://localhost:5050)                 |


pgAdmin login: `admin@admin.com` / `admin`. Register a server with host `postgres`, port `5432`, user `admin`, password `admin`, database `thchallenge`.

---

## Interactive API docs (Swagger)

The HTTP contract is documented with **OpenAPI / Swagger**. After the app is running, open:

**[http://localhost:3000/swagger](http://localhost:3000/swagger)**

From there you can inspect request/response schemas and execute every endpoint against the running instance. That is the intended way to explore the API — you do not need Postman or a collection file.

Swagger is mounted in `src/main.ts` at the path `swagger` (not `/api`).

---

## Prerequisites

**Required to run via Docker (recommended):**

- [Docker](https://docs.docker.com/get-docker/) with Compose v2 (`docker compose`)
- Git
- These host ports **free**:
  - `3000` — NestJS API
  - `5432` — PostgreSQL
  - `5050` — pgAdmin (only if you start the full stack)

**Required only if you run Node on the host:**

- [Node.js 22+](https://nodejs.org/) (the Docker image is `node:22-alpine`)
- npm
- A reachable PostgreSQL 16 instance (the Compose `postgres` service is enough)

If a port is already taken, Docker will fail at bind time. Stop the conflicting process or change the host mapping in `docker-compose.yml`.

---

## Stack and architecture

### Stack


| Layer             | Choice                                                 | Why                                                                                                                                                                                                                              |
| ----------------- | ------------------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Language          | TypeScript                                             | Allow typed data contracts spetially apreciated with the HTTP (DTOs), but also application, and domain boundaries.                                                                                                               |
| Framework         | NestJS 11                                              | Is one of the most popular Back-end frameworks with separation of concerns with tools for that like Modules, DI, pipes, filters, and OpenAPI with little ceremony. And allows to scale aplications with any architectural style. |
| HTTP              | Express (Nest platform)                                | Default Nest adapter; enough for this service size.                                                                                                                                                                              |
| Validation        | `class-validator` + `class-transformer`                | Fail fast at the edge. Unknown fields are rejected (`forbidNonWhitelisted`).                                                                                                                                                     |
| Persistence       | PostgreSQL 16 + TypeORM                                | Relational integrity (unique email, UUID PK, UUID array for film IDs). TypeORM fits Nest's module model.                                                                                                                         |
| Password hashing  | bcrypt                                                 | Passwords are stored only as hashes. Comparison lives on a value object, not in the controller.                                                                                                                                  |
| External films    | Studio Ghibli HTTP API                                 | Real third-party dependency behind a port, so tests do not hit the network.                                                                                                                                                      |
| Docs              | `@nestjs/swagger`                                      | Living contract for reviewers.                                                                                                                                                                                                   |
| Runtime packaging | Docker multi-stage (`builder` / `production` / `test`) | Same app image for run and test; small production stage.                                                                                                                                                                         |
| Tests             | Jest + Supertest                                       | Exercise the real HTTP stack against a real database.                                                                                                                                                                            |


### Architecture

The project structure is organized as **clean architecture** (with ports and adapters) inside a NestJS module:

## Project structure

```
src/
  main.ts                         Swagger, ValidationPipe, listen
  app.module.ts                   Database + Users + domain exception filter
  common/                         DomainError, HTTP mapping, exception filter
  database/                       TypeORM module + config
  users/
    domain/                       Entity, VO, ports, errors
    application/                  Use cases, DTOs, mappers, DI tokens
    infrastructure/
      controllers/                HTTP + Swagger DTOs
      persistence/                TypeORM entity, repo, mappers
      ghibli/                     HTTP adapter for films
test/                             e2e specs, factory, mocks, DB setup
Dockerfile                        builder / production / test
docker-compose.yml                postgres + app + pgadmin
docker-compose.test.yml           test overlay
.env.example                      required keys
```

The Users module for instance is set as:

```
src/
│
├── common/                 Shared error handling (not user-specific)
│   │
│   ├── domain/             Base DomainError with a stable `code`
│   │
│   └── infrastructure/     Maps that code to HTTP status + JSON body
│
├── database/               Postgres connection (TypeORM)
│
└── users/                  Users bounded context
    │
    ├── domain/             Business rules. No HTTP, no database, no Nest.
    │   │
    │   ├── errors/          Typed failures (not found, email already exists)
    │   │
    │   ├── ports/          Contracts to the outside (Ghibli films)
    │   │
    │   ├── entities         User: id, name, email, password, favorite films
    │   │
    │   └── repositories    IUserRepository: save / find / update / delete (interface only)
    │
    ├── application/        Orchestrates one action per use case
    │   │
    │   ├── usecases         create / read / update / delete
    │   │
    │   ├── dtos             What a use case returns (never the password)
    │   │
    │   └── mappers          Domain User + films → response DTO
    │
    └── infrastructure/     Adapters. Talks to the outside world.
        │
        ├── controllers     HTTP in: routes, validation, Swagger
        │
        ├── persistence     Postgres out: TypeORM entity + repository impl
        │
        └── ghibli          HTTP out: Studio Ghibli API client
```

**This gives:**

1. **Readability.** Any colleage can see where business rules and edge layers are.
2. **Testability.** E2E tests replace only the Ghibli gateway. Postgres stays real. That is only possible because the gateway is a port, not a hard-coded `fetch` inside the use case.
3. **Replaceability.** Swapping Ghibli for another catalog, or TypeORM for prisma, should not rewrite use cases or domain.
4. **Honest boundaries.** HTTP status codes are an infrastructure concern. Domain errors carry a stable `code` (`USER_NOT_FOUND`, `USER_ALREADY_EXISTS`) so clients and tests assert on meaning, not on a string message. This is a small event-sourced system that shows how the service would grow.

---

## API HTTP Features

**User model (API):** `id`, `name`, `email`, `favoriteFilms[]` (`id`, `title`). Password is write-only.

**Uses:**

- Global validation pipe (whitelist, reject unknown properties, transform types)
- Domain exceptions mapped to structured JSON (`statusCode`, `code`, `message`, `error`, `timestamp`)
- Passwords hashed with bcrypt before persist
- Favorite films resolved through `IGhibliGateway` on create and get

### Endpoints


| Method   | Path            | Description                                                             | Success Response              |
| -------- | --------------- | ----------------------------------------------------------------------- | ----------------------------- |
| `POST`   | `/users`        | Create user                                                             | `201` user body (no password) |
| `GET`    | `/users/:email` | Get user by email, films enriched with `GhibliGateway`                  | `200` user body               |
| `PATCH`  | `/users`        | Update name and/or favorite film IDs (email in body identifies the row) | `200` empty                   |
| `DELETE` | `/users/:email` | Delete user by email                                                    | `200` empty                   |


Swagger is the source of truth for schemas. Representative payloads:

**Create —** `POST /users`

```
{
  "name": "Clark Kent",
  "email": "clark@kent.com",
  "password": "123456",
  "favoriteFilmIds": [
    "2baf70d1-42bb-4437-b551-e5fed5a87abe",
    "58611129-2dbc-4a81-a72f-77ddfc1b1b49"
  ]
}
```

`favoriteFilmIds` is optional. Omit it or send `[]` for a user with no favorites.

**Update —** `PATCH /users`

```
{
  "email": "clark@kent.com",
  "name": "Kal-El",
  "favoriteFilmIds": ["2baf70d1-42bb-4437-b551-e5fed5a87abe"]
}
```

**Error examples**

Some of them are `Domain Exceptions` as explained previously. 


| Situation                       | Status | `code`                     |
| ------------------------------- | ------ | -------------------------- |
| Validation failure              | `400`  | Nest validation payload    |
| For future Login implementation | `401`  | `USER_INVALID_CREDENTIALS` |
| User not found                  | `404`  | `USER_NOT_FOUND`           |
| Email already registered        | `409`  | `USER_ALREADY_EXISTS`      |


Emails in path params should be URL-encoded (`encodeURIComponent`) when they contain `+` or other reserved characters.

---

## Running the application

### Option A — Docker (preferred for reviewers)

From the repo root, after `cp .env.example .env` (see [Quick start](#quick-start-reviewer-path)):

```
npm run docker:up
```

This builds the **production** image and starts the containers, PostgreSQL (healthcheck), the API on port `3000`, and pgAdmin on port `5050`.

Useful scripts:


| Script                       | What it does                                                       |
| ---------------------------- | ------------------------------------------------------------------ |
| `npm run docker:up`          | Build and start `postgres`, `app`, `pgadmin` in the background     |
| `npm run docker:up:recreate` | Same, but force-recreates containers (use after image/env changes) |
| `npm run docker:logs`        | Follow API logs                                                    |
| `npm run docker:down`        | Stop the stack (volumes are kept)                                  |


The API container sets `DB_HOST=postgres` so it talks to the Compose network, not `localhost`.

### Option B — Node on the host (development)

1. Start Postgres (Compose-only DB is enough):
  ```
  docker compose up -d postgres
  ```
2. `.env` from `.env.example` already uses `DB_HOST=localhost` (do not set it to `postgres` on the host).
3. Install and run:
  ```
  npm install
  npm run start:dev
  ```

Other npm scripts:


| Script                | Purpose                      |
| --------------------- | ---------------------------- |
| `npm run start:dev`   | Watch mode                   |
| `npm run start:debug` | Watch + debugger             |
| `npm run build`       | Compile to `dist/`           |
| `npm run start:prod`  | `node dist/main`             |
| `npm run lint`        | ESLint with `--fix`          |
| `npm run format`      | Prettier on `src` and `test` |


`synchronize: true` is enabled in TypeORM so the schema is created on boot. That is convenient for a take-home; it is **not** a production migration strategy (see [Known limitations](#known-limitations--what-i-would-improve)).

---

## Local deployment for reviewers

Goal: **one machine, no tribal knowledge.**

### Environment files


| File               | Role                                                       | Commit?                      |
| ------------------ | ---------------------------------------------------------- | ---------------------------- |
| `.env.example`     | Checked-in local-demo values; copy to .env                 | Yes                          |
| `.env`             | Local/Docker **runtime** for the API                       | No (gitignored)              |
| `.env.test`        | Host-side e2e (`DB_HOST=localhost`, db `thchallenge_test`) | Yes (local-only credentials) |
| `.env.docker-test` | Container-side e2e (`DB_HOST=postgres`)                    | Yes                          |


`.env.example` is already filled with local-demo credentials. Create runtime config with:
```
cp .env.example .env
```
`.env` stays gitignored. Test fixtures (`.env.test`, `.env.docker-test`) **are** committed on purpose: they are shared test config, not secrets. In production, runtime secrets would not live in git; they would be injected from a secret manager according to the project’s security architecture.

### Docker layout

- `docker-compose.yml` — `postgres` (16-alpine, volume, healthcheck), `app` (production target, port 3000), `pgadmin` (port 5050).
- `docker-compose.test.yml` — overrides `app` to the **test** image target, loads `.env.docker-test`, sets `NODE_ENV=test` and `DOCKER_TEST=true`.
- `Dockerfile` — multi-stage:
  - `builder` — `npm ci` + `nest build`
  - `production` — production deps + `dist`, `CMD node dist/main.js`
  - `test` — full dev install, `CMD npm run test:e2e`

Postgres data lives in the `postgres_data` volume. To wipe the database, remove the volume after `docker compose down`.

### Reviewer checklist

1. Docker is installed and the daemon is running.
2. Ports `3000`, `5432`, and `5050` are free.
3. `.env` exists (`cp .env.example .env`). `DB_HOST` in that file is `localhost`; Compose overrides it to `postgres` for the app container.
4. `npm run docker:up` then open [http://localhost:3000/swagger](http://localhost:3000/swagger).
5. Optional: `npm run docker:test` (see [Testing](#testing)).
6. `npm run docker:down` when finished.

If the API container restarts, `npm run docker:logs` is the first place to look (almost always missing `.env` or Postgres not healthy yet).

---

## Testing

### Why end-to-end as the default (not a wide unit-test pyramid)

This service is a thin vertical slice: HTTP → validation → use case → domain → Postgres → (optional) Ghibli → response mapping → HTTP.

For that shape I chose **e2e tests as the primary suite**, not dozens of isolated unit tests:

- **One test walks the whole cycle.** A `POST /users` assertion proves wiring, pipes, hashing, unique email, persistence, mapping, and that `password` never leaves the API. A unit test of `CreateUserUseCase` would mock the repository and miss half of those bugs.
- **Less test code, more code tested.** Helpers (`createE2EApp`, `buildCreateUserPayload`, DB cleaner) keep scenarios short. Coverage of behavior grows without a second copy of every rule in a unit file.
- **Integration bugs are often the most valuable bugs to catch:** DI tokens, TypeORM column types, `ValidationPipe` flags, global filters, unique constraints. E2E is where those show up.
- **The only fake is the one I do not own.** The Ghibli gateway is replaced with an in-memory mock (`overrideProvider(DI_TOKENS.GHIBLI_GATEWAY)`). Postgres is real, so it can still prove SQL.
- **Isolated data.** `global-setup` creates `thchallenge_test` if needed. Each case truncates tables. Host tests use `.env.test`; Docker tests use `.env.docker-test` and `DOCKER_TEST=true`.

If the domain grows (billing, complex business rules), I would add unit tests **next to** these e2e tests, not instead of them.

### What the suite covers today

`test/users.e2e-spec.ts` and `test/app.e2e-spec.ts`:

- Create with and without favorite films (`201`)
- Duplicate email (`409` + `USER_ALREADY_EXISTS`)
- Invalid payload (`400`)
- Get by email (`200`) and missing user (`404`)
- Patch + follow-up GET
- Delete + follow-up GET `404`
- `GET /` hello

### Test environment files

E2E tests do **not** use `.env`. Jest loads a dedicated file in `test/setup-env.ts` and `test/global-setup.ts`.

**Host (`npm run test:e2e`)** — `.env.test` must exist and include at least:

```
NODE_ENV=test
```

`NODE_ENV=test` turns TypeORM logging off (`src/database/typeorm.config.ts`). The rest of the keys are the same as `.env.example` (`DB_*`, `GHIBLI_FILMS_URL`), pointed at `localhost` and database `thchallenge_test`.

**Docker (`npm run docker:test`)** — `.env.docker-test` must exist and include the test-only keys from `.env.example`:


### How to run tests

**Inside Docker (closest to CI, no local Node required):**

Requires `.env.docker-test` with `NODE_ENV=test` and `DOCKER_TEST=true` (see [Test environment files](#test-environment-files)).

Postgres must be up. Then:

```
npm run docker:test
```

This builds the `test` stage and executes `npm run test:e2e`.

If the test database or containers doesn't run well, use:

```
npm run docker:test:recreate
```

This will force recreation of the image.

**On the host** (Postgres on `5432`; `.env.test` with `NODE_ENV=test`, `DB_HOST=localhost`, database `thchallenge_test`):

```
docker compose up -d postgres
npm install
npm run test:e2e
```


| Script                | Purpose                                        |
| --------------------- | ---------------------------------------------- |
| `npm run test:e2e`    | Jest e2e (`test/jest-e2e.json`, `--runInBand`) |
| `npm run docker:test` | Same suite inside the test image               |
| `npm test`            | Unit glob under `src/` (sparse today)          |
| `npm run test:cov`    | Coverage for that unit glob                    |


---

## Known limitations / what I would improve

These are known gaps, not surprises. I would treat them as the first PR depending on the real requirements.

1. **No authentication or authorization.** Passwords are hashed and a `HashedPassword.isMatch` helper exists, but there is no login, JWT/session, or protected route. `USER_INVALID_CREDENTIALS` is mapped and unused.
2. `synchronize: true`**.** Fine for a review. Production needs migrations and `synchronize: false`.
3. **Password policy is documentation-only.** Password still has `@IsString()` / `@IsNotEmpty()` only (`minLength` in Swagger is not aplied in runtime). I would add length and complexity.
4. **Improve PATCH response.** It returns empty `200` and identifies the user in the body instead of `/users/:email`. I would return the updated, film-enriched user and use a resource URL.
5. **Ghibli failures per-id are not fully mannaged** (`Promise.allSettled` keeps only fulfilled). A missing film currently disappears from `favoriteFilms` with no error. I would define a contract: fail the request, or return partial data with a warning.
6. **Operational hardening:** dedicated `/health` (DB ping), structured logs, request IDs, Helmet, rate limits, ConfigModule instead of scattered `process.env`.
7. **Demo secrets in Compose.** Acceptable for local review; not for a shared environment.
8. **Starter** `GET /` **hello** can be replaced by `/health`.

---

## Next steps

If this were moving toward a production service (or the next round of a take-home):

1. **Auth.** `POST /auth/login`, JWT access (and refresh if the requirements need sessions), guards on mutating routes. Hashing is already in the domain.
2. **Migrations + explicit schema.** TypeORM migrations, unique index documented, seed script.
3. **User list + pagination.** `GET /users` with cursor or offset, stable sort.
4. **Cache the Ghibli catalog.** In-memory or Redis so create/get do not trigger HTTP per film ID.
5. **Observability.** Health telemetry traces around the Ghibli adapter.
6. **Hardening.** Helmet, throttling, stricter CORS, secrets from a manager rather than `.env` in anything beyond local.

