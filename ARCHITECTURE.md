# Architecture

The site is a Next.js App Router application. Public pages are server-rendered from SQLite-backed content and settings, then enhanced with client components for navigation, galleries, event planning, dialogs, and forms.

## Request flow

```text
visitor -> public page -> inquiry form -> POST /api/inquiries -> SQLite inquiry
                                                        |
                                                        v
staff -> /admin -> cookie session -> GET/POST /api/admin -> content/settings/inquiry updates
```

Public content is filtered to `active && published && verified`. Admin reads include drafts so staff can review unpublished material. Publishing content requires a source note and verified flag.

## Main areas

- `app/` contains routes, metadata, robots, sitemap, and API route handlers.
- `components/hotel/` contains the public shell, hotel chapters, forms, event planner, gallery, and admin UI.
- `lib/db.ts` owns the SQLite schema, seed data, and persistence helpers.
- `lib/security.ts` owns scrypt password hashes, hashed sessions, same-origin checks, request size limits, and rate limits.
- `lib/validation.ts` owns Zod schemas for inquiries, content, and settings.
- `public/media/` contains the supplied hotel imagery and the arrival video.
- `references/` preserves the supplied brief, PRD, and prototype for future content review.

## Security model

Admin passwords are salted scrypt hashes. Session tokens are random values stored only as SHA-256 digests and sent in an HTTP-only, same-site cookie. Mutating routes require same-origin requests, use bounded JSON bodies, and apply IP-based rate limits. The inquiry form includes consent and a honeypot field.

The “confirmed” inquiry status is an internal staff state. The system never represents it as a live booking confirmation and does not expose inventory or payment collection.

## Deployment note

The current implementation intentionally uses Node SQLite and local media. A production deployment should replace `lib/db.ts` with the hotel’s approved hosted database and object storage, then configure a trusted `APP_URL`, secure cookies, backups, and operational email or CRM delivery.
