# Events implementation handoff — 26 September 2026

## Delivered
The existing Next.js / SQLite application now has a dedicated Indonesian Events experience with original hotel photography, ivory/champagne styling, translucent panels, responsive venue rails, package comparison, filters, and the shared reduced-motion-aware reveal/parallax controller.

Routes:
- /events
- /events/venues and /events/venues/[slug]
- /events/packages and /events/packages/[slug]
- /events/corporate-meeting, /events/government-meeting, /events/wedding
- /events/gathering, /events/birthday, /events/manasik, /events/romantic-dinner
- /events/seasonal, /events/ramadan, /events/new-years-eve
- /events/bukber redirects to /events/ramadan
- /events/request-proposal, /events/site-inspection, /events/group-accommodation

The header has an Events submenu. Mobile Events pages have WhatsApp and proposal actions. The finder passes requirements into the request form. Wedding and other packages can be compared (two or three at a time). Venue capacity ranges preserve both company-profile and floor-plan values, with source details on venue pages. Layout downloads use the supplied hotel plans.

## Backend and staff workflow
- New SQLite event_records and event_attachments tables; migration 3 seeds only once and preserves subsequent staff edits.
- Events tab in /admin: venue capacities, package price validity, seasonal dates/status, publication, source verification, and internal notes.
- Lead statuses: new, contacted, proposal_sent, site_inspection, negotiation, tentative, confirmed, lost, plus legacy closed.
- Optional sales owner and follow-up date; requests carry organisation, event details, meals/equipment, room needs, budgets, and consent.
- Proposal, inspection, and group-stay requests use /api/events/inquiries.
- Optional TOR supports PDF/DOC/DOCX/XLS/XLSX, maximum 5 MB. Requests are bounded before multipart parsing; extensions and signatures are checked. Documents are not executed or rendered, and are not claimed to be malware-scanned.
- Attachments are private SQLite BLOBs, retrieved only through an authenticated, no-store attachment download. Deleting a request deletes its attachments in the same transaction.
- Origin checks, rate limiting, honeypot, consent and server validation protect submissions.
- No payment, live availability, email delivery, CRM/PMS integration, or automated proposal claim.

## Source handling
The attached PDF and Events master prompt informed the implementation. The full combined PDF is not published because it includes private commercial correspondence. No bank information or signatures were copied to client data.

30 records were seeded: 6 venue records (Room 235 and Sriwijaya hidden pending operational verification), 21 package records, 2 draft seasonal templates, and 1 private commercial reference. Historical prices remain in the staff workspace with needs-review status. Public pages receive only valid, current, verified prices; otherwise they show “Minta harga terbaru”. Maximum six-hour rental terms are also withheld until the corresponding price has been verified.

Canonical contact continues to use the existing hotel settings. No named employee or alternative personal contact was promoted to the primary Events number.

Event Kit: a working “Minta Event Kit terbaru” action pre-fills the proposal request. An unapproved PDF is not offered as a current downloadable kit.

## Verify with the hotel before public launch
- Final Majapahit / Erlangga / Ganesha capacity by layout; Room 235 and Sriwijaya venue availability.
- Current prices, dates, inclusions, minimums and additional guest charges for all packages.
- LCD / flipchart / banner inclusions versus extra charges in the May 2026 quotation.
- Room-rate reference: the May 2026 letter contains a printed 2025 validity period; these rates were kept private and do not replace Rooms prices.
- Cancellation, deposit, rescheduling, vendor, overtime, guest-count and accessibility policies.
- Canonical Events Sales WhatsApp/email, current Event Kit, venue-specific photo mapping.
- Confirm campaign year, dates, menus, pricing and entertainment before publishing Ramadan or New Year programs.
- Wedding Anggun: PDF page 3 specifies a fruit basket, whereas one instruction reference mentions flowers; clarify any additional inclusions in the quotation.

## Validation
- TypeScript: passed.
- ESLint: passed after correcting the async admin load effect.
- Production build: passed.
- 20 backend/domain tests: passed.
- 42 HTTP assertions on a separate QA database/server: passed. Covers public routes, invalid routes, redirect, login, unauthenticated document rejection, valid proposal with TOR, invalid signature, consent/origin rejection, authenticated download, CRM updates, CMS publication, expired seasonal closure, inspection, group stay, and attachment deletion.
- Browser visual / touch / keyboard checks: NOT completed this turn. The browser automation kernel failed twice with Windows “apply deny-read ACLs”. Mobile/tablet CSS and reduced-motion rules are implemented but were not verified on physical devices or in a rendered browser this turn.

## Files
- lib/events-model.ts, events-seed.ts, events-store.ts, events-validation.ts, events-upload.ts
- components/hotel/events-experience.tsx, event-request.tsx, events-admin.tsx
- app/events/[[...path]]/page.tsx and app/events.css
- app/api/events/inquiries/route.ts
- app/api/admin/events/route.ts and attachments/[id]/route.ts
- Updated shared navigation, admin CRM, inquiry types, sitemap, privacy copy, global styles, README and npm test command.
- tests/events.test.ts and scripts/events-smoke.mjs

## Local checks
Open http://localhost:3001/events and /admin. Do not start another process if port 3001 already serves this project.

Run:
npm.cmd run typecheck
npm.cmd run lint
npm.cmd test
npm.cmd run build
node --experimental-strip-types scripts/events-smoke.mjs

The HTTP smoke script uses port 3002 and a separate .local/events-smoke-*.db database. It never submits live hotel requests. The production preview uses the normal hotel database.

Manual UI checklist:
1. At 390 px, 768 px and desktop widths, check header, rail swipe, filter pills, capacity cards and fixed bottom actions.
2. Compare Bahagia / Cantik / Indah; open venue details and download a plan.
3. Complete all three form steps, enable rooms, attach a small PDF and submit a clearly labelled test request.
4. Log in to staff workspace; inspect the request, download its TOR, update status and delete the test request.
5. Test Tab/Shift+Tab and dialog close, reduced-motion preference, navigation between routes, and native mobile date inputs.

