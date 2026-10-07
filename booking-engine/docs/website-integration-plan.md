# Website integration — implemented 2026-10-03

The user authorized connecting hotel reservation buttons to the booking engine. The historical proposal below is retained as background; its no-change statements no longer describe the current integration.

## Current behavior

- Header, mobile menu, homepage and room reservation links open `/book` in the same tab.
- Room cards pass stable slugs; room details also pass the chosen `room-only` or `breakfast` plan.
- `/book` redirects to same-origin `/booking`. `BOOKING_ENGINE_URL` is an optional override for a deliberately separate deployment. The website proxies API, assets and documents to the internal booking service.
- Supported parameters: `room`, `plan`, `checkIn`, `checkOut`, `adults`, `lang=id|en`. The website sets `source=hotel-website`; other languages fall back to English.
- Without dates, the engine displays the room/package above its search form, then selects it after the guest searches. With dates, it opens checked availability and a freshly calculated quote.
- A fresh handoff replaces old browser choices. Unknown, sold-out or over-capacity rooms display an error; alternatives are never selected silently.
- Prices are calculated by the engine. A redirect creates no hold, reservation or payment. Databases remain separate; contact and Events workflows stay on the website.

Run `npm.cmd run dev` from the project root to start both services. Staff signed in on `/admin` can open `/booking/admin` without a second login. Dashboard data comes from the booking API. The engine remains a sandbox; this connection does not activate real payments or PMS/OTA synchronization. See [the runbook](../../BOOKING-RUNBOOK.md).

Verification: after a production build, `npm.cmd run test:booking-integration` starts an isolated pair of services on spare ports and tests the proxy, staff session, cookies, checkout, admin records and PDFs. Running user servers remain untouched. Handoff validation is also covered by `tests/backend.test.ts` and `booking-engine/tests/website-handoff.test.mjs`.

The historical `website-baseline.json` predates this authorized integration; baseline verification will report intended website changes.

## Historical proposal
Main website remains unchanged. SHA-256 baseline covers446 source/config/assets files; runtime/cache, secrets and databases are excluded. Booking never opens the main website DB.

After separate user authorization, the smallest integration is a link from the existing room booking action to the independent booking origin. Preserve navigation and existing Events/inquiry functions. Proposed public hostname: to be chosen by the owner; localhost is local testing only.

Current accepted search query parameters: checkIn,checkOut,promo,lang=id|en. Prices are never accepted from the URL. Room-specific preselection/deep links are still pending implementation. Do not link a room ID yet and assume it is applied.

Before integration: settle real inventory authority, approve rate/child/tax/cancellation data, validate room-photo mapping, configure and test real provider sandbox, harden production sessions/HTTPS, finish admin/group workflows, accessibility and device QA. Plan a separate deployment and rollback by removing only the new booking link. Existing contact inquiry path should remain usable.

No changes have been made to website routes, booking buttons, package.json, lockfile, environment, live database or video assets.

