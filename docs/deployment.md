# Deployment: website and booking engine

This application needs Node.js 22.13+ and a writable persistent disk. The website uses Next.js; the booking engine is a separate loopback-only Node process. `scripts/run-hotel.mjs start` starts both and proxies booking through `/booking`. Keep one instance: SQLite databases and the private bridge key are local to that instance.

## Docker on a server

1. Copy `.env.production.example` to `.env.production`. Set `APP_URL` and `HOTEL_WEBSITE_URL` to the same HTTPS origin. Keep `BOOKING_ENGINE_URL` unset.
2. Run `docker compose up -d --build`.
3. Run `docker compose exec hotel node --experimental-strip-types scripts/create-admin.ts` once. The generated access details are stored in `/app/.local/admin-access.txt`. Retrieve them privately with `docker compose exec hotel cat .local/admin-access.txt`, store them in a password manager, and do not publish the output.
4. Configure a reverse proxy on this server to terminate HTTPS and forward to `127.0.0.1:3001`. Port 3003 must remain private. Preserve the original Host and Origin. Disable response buffering for streaming.
5. Verify `/`, `/rooms`, `/book`, `/booking`, `/admin`, and `/booking/api/v1/health`. Verify that a selected room, meal plan, dates, and guest count survive the website-to-booking handoff. Then test staff login and staff-only API rejection without login.

Compose retains the website database, booking database, and bridge state in named volumes. Do not use `docker compose down -v` on a server containing data. Back up both databases consistently using SQLite backup APIs or a stopped service, and test restoration before upgrades. No local database or local staff account is copied into the image.

The Docker daemon must be running to build and validate the container. Local Next.js checks alone do not prove container deployment success. No cloud deployment is implied by these files.

## Node.js without Docker

Install both locked dependency sets with `npm ci` and `npm ci --prefix booking-engine`, then run `npm run build`. Load server environment variables into the parent process, for example `node --env-file=.env.production scripts/run-hotel.mjs start`. Keep both processes supervised. Persist `data/`, `booking-engine/data/`, and `.local/` privately. Create the staff account with the same environment and database path as the server.

## Current operational limits

- Booking is explicitly sandbox-only. Payments are simulated; PMS/OTA and live payment providers are not configured. Hosting it does not turn it into a live reservation/payment system.
- Email is disabled by default. Configure SMTP and explicitly enable booking email only when authorized; do not enable automatic email for a public demo.
- Database-stored staff edits, guest records, uploads, and existing accounts are not source code. Migrate these separately through a controlled backup/restore process if needed.
- Cloudflare Workers/static hosting cannot run this unchanged Node/SQLite architecture. Old Sites/Vite/D1 scaffolding is retained as source history, but the current package scripts use Next.js and Node SQLite.
- A temporary tunnel can demonstrate an isolated sandbox while the computer and tunnel remain running; it is not permanent production hosting.

## GitHub handoff

The authorized destination is `https://github.com/rayikuji-sys/ramayanahotel.git`. On 8 October 2026, the remote was empty and was added as `origin`. Inspect remote history again before pushing `main`; do not force-push. Repository upload and application hosting are separate steps.

## Vercel trial

Vercel is the requested trial provider. The current application cannot be deployed unchanged as a durable Vercel application: both databases require persistent SQLite writes, the booking service listens on a private port, and the bridge key is stored on disk. Merely setting a database path under `/tmp` would lose state and could separate sessions, inventory, and reservations between instances.

Two deployment paths require an explicit choice before implementation:

1. A temporary Vercel entry point forwarding to an isolated, running demo backend. This still depends on that computer and tunnel and must be labelled as a temporary trial.
2. Independent cloud operation: move data to a persistent managed database and adapt the backend to Vercel Functions, or keep the stateful backend on a separate cloud service. This changes architecture and requires database/backend provisioning and migration work.

Vercel account authentication is required before creating a deployment. Authentication credentials and filled environment files must never be committed. Provider reference: https://vercel.com/kb/guide/is-sqlite-supported-in-vercel
