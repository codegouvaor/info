# Official Portal of the Government of the Republic of Astoria

**info.gouv.aor** is the official web portal of the Government of the Republic
of Astoria: the reference website of the Astorian public administration, and
the single entry point for official information about the State — government
news, the organisation of the institutions, and access to public services and
online procedures.

**Status:** preview foundation — 1.0.0. The portal is published and open; the
news feed, the online procedures and the detailed government composition are
still being prepared and will be progressively released. The state of each
section is documented on its own page, and the project's operating rules in
[Governance.md](Governance.md).

## Table of contents

- [What is this portal?](#what-is-this-portal)
- [Installation](#installation)
- [Quick start](#quick-start)
- [Portal sections](#portal-sections)
- [Multi-domain routing](#multi-domain-routing)
- [Backend API](#backend-api)
- [Internationalization](#internationalization)
- [Search](#search)
- [Accessibility](#accessibility)
- [Contributing & development](#contributing--development)
- [Architecture & repository layout](#architecture--repository-layout)
- [Provenance & licensing](#provenance--licensing)
- [Governance](#governance)
- [Releases & versioning](#releases--versioning)

## What is this portal?

The official portal of the Government of the Republic of Astoria gives
citizens a legible, consistent and accessible entry point to the institutions
and to the public services of the Republic. It is the portal of record for
government action: institutional communications, the composition of the
Government, and the procedures offered online.

It is designed for the modern web:

- **Next.js App Router** — React 19, strict TypeScript, server components and
  static generation for the public routes.
- **The Astoria Design System** — the interface is built on
  `@codegouvaor/react-ads`, the official React implementation of ADS, so the
  portal is instantly recognizable and consistent with the rest of the
  Astorian digital ecosystem.
- **Internationalization** — French and English out of the box, with
  locale-prefixed URLs and per-locale SEO metadata.
- **Accessibility** — a WCAG 2.2 AA target, with skip links, semantic
  landmarks and keyboard navigation throughout.
- **A monorepo** — the public portal, the SSO and platform domains, the Go
  backend API and the local infrastructure all live in one workspace, with a
  single Docker stack for development.

The repository also hosts the other products of the ecosystem: the SSO
(authentication) and the studios (platform) route groups are served by the
same Next.js application and middleware, on their own domains.

## Installation

The project is a pnpm workspace. Install the dependencies from the repository
root:

```bash
pnpm install
```

Peer requirements: Node.js ≥ 18 and pnpm ≥ 8 (the workspace is pinned to
`pnpm@8.15.0`); Go 1.25+ for the backend, and Docker + Docker Compose for the
full local stack (PostgreSQL, Redis, RabbitMQ, Meilisearch).

## Quick start

1. **Configure the environment**

```bash
cp .env.example .env
```

The variables are documented inline in `.env.example`; the service-level
settings (Redis, RabbitMQ, Meilisearch, Postgres) live in
`docker-compose.yml`.

2. **Start the stack**

```bash
pnpm docker:run        # PostgreSQL, Redis, RabbitMQ, Meilisearch
pnpm dev               # frontend (:3000) + Go API (:8080), both in watch mode
```

or run each part separately:

```bash
pnpm dev:frontend      # Next.js dev server, hot reload
pnpm dev:backend       # Go API via Air, hot reload
```

3. **Open the portal**

Point your browser (and `/etc/hosts`) at `http://info.gouv.localhost`. The
root path is negotiated by the middleware to the default locale (`/fr`);
`/en` serves the English version. The SSO and studios domains
(`sso.gouv.localhost`, `studios.gouv.localhost`) are served by the same
application — see [Multi-domain routing](#multi-domain-routing).

## Portal sections

The public portal is organized around four main sections:

- **Government** — the institutions of the Republic: presidency, council of
  ministers and public administrations, with a dedicated page for the
  government composition;
- **News** — official communications, announcements and press briefings;
- **Services and procedures** — access to online procedures and the main
  public services;
- **Contact** — the official channels to reach government services.

It is completed by a search page, a sitemap, and the legal pages
(accessibility statement, privacy policy, legal notice, cookie management).

⚠️ The preview foundation publishes the home page, the Government and
composition pages, the section pages and the full legal framework. The news
feed and the online procedures are announced on their pages but not yet
published — they will be released incrementally without breaking changes.

## Multi-domain routing

The Next.js middleware (`apps/middleware.ts`) routes a single application
across the domains of the Astorian digital ecosystem: the public portal on
`info.gouv.aor`, the SSO on `sso.gouv.aor` (login, register, MFA) and the
platform on `studios.gouv.aor` (dashboard, admin).

Unprefixed auth paths (`/login`, `/register`, `/mfa-*`, …) are redirected to
the SSO domain and platform paths (`/dash`) to the studios domain, from
whichever domain they are requested. The studios domain is guarded: requests
without an authenticated admin session are redirected back to the dashboard.
Everything else on the portal domain goes through locale negotiation, which
keeps `/fr/…` and `/en/…` untouched, redirects unprefixed public paths to the
negotiated locale, and announces the request locale to server components via
the `x-next-intl-locale` header.

## Backend API

The backend (`server/`) is a Go application built with Gin, providing the
API consumed by the frontend and the platform. It ships:

- **Authentication** — JWT access/refresh tokens, OAuth, MFA (setup,
  verification, recovery), rate limiting on auth endpoints, an identity
  provider, and a bootstrap that gives the first registered user the
  superadmin roles;
- **Content** — articles, categories, media, newsletters and SEO routes;
- **Operations** — admin routes, scheduled jobs and webhooks;
- **Infrastructure** — PostgreSQL through GORM, whose `AutoMigrate` owns the
  runtime schema (the Prisma schema in `server/prisma/` remains the
  versioned source used by the database tooling), Redis for caching, rate
  limiting, presence and the event bus, and RabbitMQ as the message broker.
  Logging is structured: `slog` on the backend, pino/loglayer on the
  frontend.

## Internationalization

The portal is fully localized — French is the default, English is
translated — using **next-intl**. Every public URL carries its locale
(`/fr/…`, `/en/…`) so switching language never loses the current page; the
only exception is the Capacitor native shell, which cannot use a path
prefix.

Metadata is generated per locale through `apps/lib/localized-metadata.ts`:
canonical URLs and `hreflang` alternates are resolved through the next-intl
router, keeping the active language and the prefix strategy in a single
place.

To add a language: add its code in `apps/i18n/routing.ts`, a message file in
`apps/messages/<code>.json` (a partial file is fine — untranslated keys
gracefully fall back to the default locale), and its endonym in
`apps/i18n/locales.ts`.

## Search

The portal ships a search page with a portal search bar. The engine is
**Meilisearch**, provided by the local Docker stack (`MEILI_HOST`,
`MEILI_MASTER_KEY` in `docker-compose.yml`) and reachable from the Go API.
The frontend carries the `meilisearch` client; indexing of the news and
services content will be enabled as those sections are published — until
then, the search page explains itself and reports no results.

## Accessibility

Accessibility is a first-class requirement of the portal, with a
WCAG 2.2 AA target:

- skip links to content, navigation and footer;
- semantic landmarks, visible focus and keyboard navigation;
- ARIA patterns on every interactive component, provided by the ADS React
  toolkit;
- reduced-motion support through the ADS runtime.

The accessibility statement is published on the portal and will be updated
as the audit of the preview foundation progresses.

## Contributing & development

See [Governance.md](Governance.md) for how the project is run, and
[SECURITY.md](SECURITY.md) for security matters. The workspace is a standard
pnpm monorepo:

```bash
git clone https://github.com/codegouvaor/info.git
cd info
pnpm install
```

| Command | Purpose |
| --- | --- |
| `pnpm dev` | Start frontend + backend in watch mode |
| `pnpm build` | Build all workspaces |
| `pnpm lint` / `pnpm typecheck` | ESLint and TypeScript checks across the workspace |
| `pnpm test` | Run the test suites |
| `pnpm db:generate` / `db:migrate` / `db:studio` / `db:seed` | Prisma database tooling |
| `pnpm docker:run` / `docker:stop` | Start / stop the local stack |

⚠️ The database schema is owned at runtime by GORM `AutoMigrate`
(`server/main.go`). Do not run `prisma db push` against a running
environment — it drops and recreates the enum-backed columns and wipes data
(see the comments in `docker-compose.yml`).

## Architecture & repository layout

```
├── apps/                    # Next.js frontend (one app, three domains)
│   ├── app/
│   │   ├── (public)/[locale]/   # localized portal routes (fr, en)
│   │   │   ├── page.tsx         # home — hero, top tasks, news teaser
│   │   │   ├── government/      # institutions + composition
│   │   │   ├── news/            # official news
│   │   │   ├── services/        # services and procedures
│   │   │   ├── search/          # portal search
│   │   │   ├── contact/         # contact channels
│   │   │   ├── legal/           # accessibility, privacy, terms, cookies
│   │   │   └── sitemap/         # sitemap
│   │   └── (health)/            # health routes
│   ├── components/          # portal chrome and content (ADS-based)
│   ├── i18n/                # next-intl routing, navigation, locales
│   ├── messages/            # en.json, fr.json message catalogs
│   └── lib/                 # site structure, localized metadata
├── server/                  # Go backend API
│   ├── main.go              # wiring: database, Redis, services, routes
│   ├── src/
│   │   ├── routes/          # auth, admin, articles, categories, media…
│   │   ├── services/        # database, auth, MFA, OAuth, presence…
│   │   ├── middleware/      # request ID, CORS, logging, recovery
│   │   └── models/          # data models (GORM)
│   └── prisma/              # Prisma schema (database tooling)
├── tools/                   # CLI tools and scripts
├── infrastructure/          # Docker, nginx and deployment assets
├── tests/                   # integration tests
└── examples/                # demo applications
```

The frontend lives entirely in `apps/` (which is also the Next.js project
root — the middleware must stay there to be picked up by `next dev`). The
API lives in `server/`. Both are packaged in a single unified Docker image
(`Dockerfile`): `entrypoint.sh` switches behaviour per role — `server`
(Next.js, static export in production), `worker` (Go binary, hot-reloaded
with Air in development) and `postgresql` — orchestrated by
`docker-compose.yml` with nginx and pgAdmin available under the `dev`
profile.

## Provenance & licensing

This repository is developed and maintained in the open by the digital
services of the Republic of Astoria. The frontend is built on the official
Astoria Design System React toolkit (`@codegouvaor/react-ads`) and on
open-source foundations — Next.js, React, Tailwind CSS, Radix UI,
next-intl, Gin, GORM, Prisma.

The code is MIT licensed; see [LICENSE](LICENSE).

## Governance

The project is developed under the governance described in
[Governance.md](Governance.md). Contributions are covered by the
[Code of Conduct](CODE_OF_CONDUCT.md); security matters are handled per
[SECURITY.md](SECURITY.md).

## Releases & versioning

The workspace follows Semantic Versioning. Releases are cut from the `main`
branch using Changesets (`pnpm changeset`, `pnpm version-packages`,
`pnpm release`) and published from CI. The public portal is currently in
preview foundation: expect incremental, non-breaking additions as the news
feed, the online procedures and the detailed government composition are
published.