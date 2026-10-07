# Ramayana Hotel Makassar

## Overview

Hotel website, staff dashboard, event inquiries, and a separate booking engine served on the same origin under /booking. Booking currently runs in sandbox mode; it does not collect live payments or synchronize live PMS/OTA inventory.

## Tech Stack

Next.js 16.3.5 App Router, React 19.2.6, TypeScript, Node.js node:sqlite, a standalone Node HTTP booking service, PDFKit, Nodemailer, ESLint, and npm lockfiles. SQLite schemas and migrations are versioned; operational databases are not.

## Requirements

Node.js 22.13 or newer (Node 22 recommended), npm, and writable persistent storage. Install both dependency sets. Docker is optional for server deployment.

## Installation

```sh
npm ci
npm ci --prefix booking-engine
```

Copy .env.example to .env.local and review its values. Never commit the filled file. Initialize the database and staff account with the same environment used by the server:

```sh
node --env-file=.env.local --experimental-strip-types scripts/seed.ts
node --env-file=.env.local --experimental-strip-types scripts/create-admin.ts
```

The generated credentials are saved privately in .local/admin-access.txt. Existing admin passwords are not changed by this command.

## Environment Variables

See [.env.example](.env.example), [.env.production.example](.env.production.example), and [booking-engine/.env.example](booking-engine/.env.example). The root example combines the variables needed by both services. Standalone Node scripts do not automatically load Next.js .env.local files: use Node --env-file or inject environment variables from the host.

| Variables | Purpose |
| --- | --- |
| APP_URL, HOTEL_WEBSITE_URL | Same public website origin; HTTPS when deployed |
| HOTEL_PORT, BOOKING_PORT | Website and private booking ports, defaults 3001/3003 |
| HOTEL_DB_PATH | Website SQLite path, relative to repository root |
| BOOKING_DB | Booking SQLite path, relative to booking-engine; must remain inside it |
| BOOKING_MODE | sandbox; live mode is refused |
| BOOKING_ENGINE_URL | Leave unset for the same-origin /booking handoff |
| BOOKING_INTERNAL_URL | Set automatically by the launcher |
| COOKIE_SECURE, TRUST_PROXY | Secure cookies and trusted proxy handling |
| PUBLIC_SITE | Search indexing, false for demos |
| ADMIN_EMAIL, ADMIN_PASSWORD | One-time account creation; password may be generated |
| SMTP_HOST, SMTP_PORT, SMTP_SECURE, SMTP_USER, SMTP_PASS, SMTP_FROM | Optional event email transport |
| BOOKING_EMAIL_ENABLED, BOOKING_EMAIL_AUTOSEND, BOOKING_HOTEL_EMAIL | Explicit booking email controls; disabled for demos |

## Development

```sh
node --env-file=.env.local scripts/run-hotel.mjs dev
```

Open http://localhost:3001; booking is http://localhost:3001/booking; staff login is http://localhost:3001/admin. The launcher starts both services. npm run dev also works with exported environment variables.

## Build

```sh
npm run lint
npm run typecheck
npm test
npm run test:booking
npm run build
npm --prefix booking-engine run build
npm run test:booking-integration
```

Integration tests use isolated temporary databases and ports. Never test against guest production data.

## Production

```sh
node --env-file=.env.production scripts/run-hotel.mjs start
```

Build first. Run behind an HTTPS reverse proxy and retain both databases plus private bridge state on persistent storage. Production here describes the optimized server build; the booking business mode remains sandbox.

## Project Structure

| Path | Contents |
| --- | --- |
| app/, components/hotel/, lib/ | Website routes, UI, server services, schemas/migrations |
| booking-engine/ | Booking API, UI, database schema, seed catalog, tests |
| public/ | Website photos, fonts, artwork, and videos |
| scripts/, tests/, docs/ | Setup, verification, documentation |
| Dockerfile, compose.yaml | Single-instance Node deployment with persistent volumes |
| build/, db/, drizzle/, examples/, vendor/ | Retained adapter/template source; not runtime database files |
| data/, booking-engine/data/, .local/ | Private runtime state; excluded from Git |

## Deployment Notes

See [deployment guide](docs/deployment.md). A GitHub repository stores source code; an online website additionally needs a running host. Preserve existing UI and business logic during import. Keep dependency caches, generated outputs, local databases, uploaded documents, credentials, and backups outside Git. Public video assets remain necessary for the existing design.

## Feature and content documentation

Full-stack hotel website for Ramayana Hotel Makassar with reservation links to the standalone booking engine and a protected staff workspace for guest requests and website content.

## Website and booking engine

Reservation buttons open the booking engine with the selected room and breakfast package. Header/homepage Reserve opens a fresh search. Dates and guests are also supported by `/book?room=junior-suite&plan=breakfast&checkIn=YYYY-MM-DD&checkOut=YYYY-MM-DD&adults=2&lang=id`. The engine calculates availability and prices.

Start both services from the project root:

```powershell
cd C:\projects\ramayana-web
npm.cmd run dev
```

The website opens at `http://localhost:3001`, reservations at `/booking`, and staff login at `/admin`. The launcher starts the booking service on internal port 3003 and waits for its health check before starting Next.js. A healthy existing booking service can be reused. Leave `BOOKING_ENGINE_URL` unset to use this same-origin integration. Only set it when deliberately using a separate booking deployment. The engine remains a sandbox with simulated inventory/payments. See [the runbook](BOOKING-RUNBOOK.md).

## Run locally

Requires Node.js `>=22.13.0`.

```text
npm.cmd install
npm.cmd --prefix booking-engine install
npm.cmd run db:seed
npm.cmd run admin:create
npm.cmd run dev
```

Open `http://localhost:3001`. If port 3001 is already running this site, open it rather than starting a second server. The generated staff credentials are written to `.local/admin-access.txt`; keep that file private. The staff workspace is at `/admin`.

The app uses a local SQLite database at `data/hotel.db`. Copy `.env.example` to `.env.local` when you need to set `APP_URL`, `HOTEL_DB_PATH`, or a fixed admin email/password. The reservation form creates a request reference and sends the guest to the hotelâ€™s phone, WhatsApp, or email channel for confirmation. It does not claim live availability or invent a rate.

## Commands

`npm run dev` starts the booking service and the Next development server together.

`npm run build` creates the production build and `npm run start` serves it.

`npm run typecheck`, `npm run lint`, and `npm test` run the static, style, and backend checks.

`npm run test:booking` tests booking rules, concurrent inventory allocation, payments, access control and documents. After `npm run build`, `npm run test:booking-integration` tests the complete website proxy, staff single sign-on, checkout, admin synchronization and PDFs using isolated databases and spare ports. It does not stop the running hotel services.

`npm run db:seed` safely seeds the hotel content and does not duplicate rows.

`npm run admin:create` creates the first admin account when one does not exist.

`node scripts/preview-check.mjs` runs the desktop/mobile browser smoke check. Set `PREVIEW_URL` to use another local port.

See [ARCHITECTURE.md](ARCHITECTURE.md), [CONTENT_VERIFICATION.md](CONTENT_VERIFICATION.md), [UX_AUDIT.md](UX_AUDIT.md), and [QA_CHECKLIST.md](QA_CHECKLIST.md) for the implementation handoff.

## Rooms, gallery and arrival film

The hotel-supplied `Ramayana_Hotel_Makassar (1).txt` is represented in `lib/hotel-profile.ts`. Database migration 2 imports eight room categories (77 rooms), dimensions, promotional rates, breakfast options, and stay policies. It preserves staff edits and publication controls and only retires the two untouched generic starter categories. Content remains editable in the staff dashboard. A pre-migration backup is in `data/before-profile-1789744703589.db` on this workspace.

`/rooms` includes category filters and a comparison table. Each room has a detail page and a reservation request retaining the selected room/package. Photographs are labelled representative where a specific room-to-photo mapping was not provided.

`/gallery` has a curated photo mosaic, category filters, a full-screen photo/video viewer, keyboard arrows, and Escape to close. The photographs are mapped in `lib/gallery-media.ts`.

The homepage uses `/media/arrival-scroll.mp4`, optimized from the supplied 8.04-second original without trimming. Scrolling covers the entire timeline inside a sticky full-viewport hero. The video uses `object-fit: cover` to fill portrait and landscape screens, so the edges crop to the screen aspect ratio. Extra film controls, chapter labels, and scroll prompts have been removed. Reduced-motion users see a still hero; normal video playback remains available in Photos & Videos. Header transparency lasts throughout the hero; the logo is a static image and Home is an explicit navigation item.

For a local visual check: open `/`, scroll to the end of the film, then open `/gallery` and test its filters and viewer. Open `/rooms/junior-suite`, select the breakfast option and verify the reservation form keeps that package. Also check these pages at a narrow mobile viewport.

## Visual rhythm and room design

The shared motion controller reveals headings, photographs, and content at different intervals, with gentle image parallax and pointer depth. Native scrolling is retained. Animation observers reconnect when room filters replace cards and release detached elements. Reduced-motion preferences disable these effects; the flower cursor also stays off on touch devices. Facilities crossfade between scenes and use a horizontal thumbnail rail on small screens. Dining uses a layered photo carousel with buttons, swipe, and keyboard navigation. Stay moments combine photography with a glass information panel.

Public pages use white, warm ivory, champagne accents, and charcoal text. Rooms retain translucent information panels, alternating photographs, and a shared icon system for room facts, amenities, services, and policies. Detail pages include a light reservation panel and preserve the selected breakfast package.

## Event planning

Events provides occasion guides, seating-style capacity comparisons for Majapahit, Erlangga, and Ganesha, original seating plans, equipment guidance, FAQs, and a reviewable event brief. The brief carries venue, layout, date/time, duration, catering, accommodation, and setup requirements into the existing inquiry workflow and staff dashboard.

`lib/event-guide.ts` records brochure information. The dedicated Events module preserves both overview and seating-plan capacities; public ranges identify the differences until staff verify final figures. Legacy brochure prices are not treated as current quotes. Hotel confirmation remains necessary for the final arrangement, availability, inclusions, and price.

Design references and adaptation notes: [DESIGN_REFERENCES.md](DESIGN_REFERENCES.md).

To preview without development compilation, stop the development server with Ctrl+C, run `npm.cmd run build`, then `npm.cmd run start`. Open `http://localhost:3001`. Start only one server on that port.

## Events workspace (September 2026)

The new module lives at /events, with venue and package details, corporate/government/wedding guides, seasonal pages, proposal requests, site inspections, and group accommodation. See EVENTS_HANDOFF.md for routes, verification items, and the test record. The Events tab in /admin manages pricing validity, publication, capacity verification, and seasonal schedules.

Run npm.cmd test for backend tests, and node --experimental-strip-types scripts/events-smoke.mjs after a production build for an isolated HTTP check on port 3002. QA records use a separate .local/events-smoke-*.db database. TOR attachments are private SQLite BLOBs, limited to 5 MB and served only through an authenticated download route.

## Languages, readability and hotel photographs

The header language picker supports English, Indonesian, Simplified Chinese, Japanese, Korean, Arabic, German, French, Dutch, Spanish and Russian. It translates 222 curated phrases covering navigation, room information and primary guest controls. Detailed editorial copy without an approved translation remains in its source language; the picker explains this. Translation is local and does not send visitor content to an external service. Arabic uses right-to-left layout. Language preferences survive refresh and synchronize between tabs without a hydration mismatch.

Add complete phrases in `lib/translations.ts` or `lib/guest-translations.ts`, using the language order in `lib/locales.ts`. Keep addresses, telephone numbers, prices, room names and user-entered content intact. The staff dashboard remains in English.

`app/readability.css` provides explicit text contrast for glass panels, form fields and dark Events sections. `app/languages.css` supplies script-appropriate fonts and responsive language controls.

The three hotel ZIP archives were reviewed as 104 image entries. Thirty photographs are curated in `lib/photo-catalog.ts`, with original archive paths and placement metadata in `outputs/photo-placement.json`. WebP copies in `public/media/collection` total about 3.4 MB. Room details and event venues include a photograph rail with a full-screen viewer; all curated photographs are also available in Photos & Videos. Migrations 4–7 correct known starter images while preserving staff-selected photography and publication controls. Triple rooms 205 and 223 appear together with an explicit category note on both triple-room pages. Unidentified Deluxe King and suite categories use a neutral panel until a category-specific photograph is available.

The September 27 review also corrects the buffet previously labelled Mini Library, the dining area previously shown as a bedroom, and Ganesha previously illustrated with an Erlangga photograph. Editorial descriptions now describe the visible furniture, setting and arrangement. See `outputs/media-review.md` for the placement decisions.

Ten original package brochure designs serve eleven named packages, including four wedding options. `lib/package-artwork.ts` maps the designs to the catalogue, detail pages and homepage occasions. Visitors can enlarge, page through and download the original artwork. Printed prices remain part of the original designs; the adjacent note asks guests to confirm a current quotation. Re-import with `node --experimental-strip-types scripts/import-package-artwork.ts`.

The additional 8.04-second courtyard film appears between Facilities and Dining and in Photos & Videos. Its 1440×962 MP4 is approximately 2 MB, retains the full frame, loads when the section is visible, and plays on request. Playback pauses when the section or browser tab is no longer visible. The homepage arrival scroll film remains separate.

Local verification: select a language, refresh, then visit Rooms, a room detail, Events and Photos & Videos. Confirm the language persists, Arabic reverses layout, the mobile page has no horizontal overflow, and photograph viewers support navigation and Escape. Test at 390px, 768px and desktop width. Use `npm.cmd` in PowerShell if script execution policy prevents the `npm` alias from running.
