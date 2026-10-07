# QA checklist

Visual and event-planning refinement verification, 25 September 2026:

- `npm.cmd run typecheck` passed.
- `npm.cmd run lint` passed.
- `npm.cmd test` passed all 10 backend tests, including event-context validation, persistence, and layout-capacity boundaries.
- `npm.cmd run build` passed and the production preview was restarted on `http://127.0.0.1:3001`.
- At 390 × 844, the homepage starts with a 100dvh hero, transparent header, hidden mobile contact bar, cover-sized video, and no Watch Film, arrival chapter, pace tagline, or scroll prompt. The document has no horizontal overflow.
- At 320 × 812 and 844 × 390, the homepage hero filled the viewport and both layouts had no horizontal overflow.
- Homepage Dining was checked at 390 × 844. The layered photo carousel renders within the viewport and its Next control changed the active image and caption from Arjuna Resto to Rama Shinta Lounge.
- At desktop 1440 × 900, the home hero filled the viewport with no horizontal overflow, and the Facilities-to-Dining transition showed the neutral charcoal/ivory palette and new scene layout.
- Rooms was checked at 390 × 844 and 1440 × 900. Both had no horizontal overflow; the light ivory/champagne room collection and booking surfaces rendered correctly.
- `/events` was checked at 390 × 844. Occasion tabs, venue matching, original seating-plan dialog, event equipment, brief form, and review state were present. 100 guests with Round tables returned one eligible space; selecting it was carried into the review summary. 300 guests returned the intentional no-match guidance and disabled venue selection.
- `/events?occasion=Wedding` was checked at 820 × 1180. Wedding remained selected, the three-column venue comparison fit without horizontal overflow, and the editorial introduction rendered correctly.
- The preview tab reported no browser console errors or warnings during these checks.

Visual refresh verification, 23 September 2026:

- TypeScript and ESLint passed for the visual refresh; the production build also completed successfully.
- The desktop Rooms opening and first room card were inspected in the browser. The page rendered the new glass panels, green/champagne palette, and structured icons, with no horizontal overflow at the default desktop viewport.
- The Discover your room anchor moved to the collection. DOM inspection confirmed that the motion controller initialized.
- Production preview: `/`, `/rooms`, and `/rooms/junior-suite` returned HTTP 200 with the refreshed content.
- The Suites filter changed the collection from eight rooms to Junior Suite and Ramayana Suite. Opening Junior Suite from the filtered collection worked.
- Selecting breakfast changed Junior Suite from Rp700,000 to Rp800,000. The reservation dialog retained “Junior Suite · breakfast for two”; no request was submitted during this check.
- At a 390 × 844 viewport, the collection opening, room card, detail opening, booking panel, and amenity layout were inspected. Collection and detail pages had no horizontal document overflow. The viewport override was reset afterward.
- Home hero video advanced from 0 to 3.61875 seconds and finished at 8.008333 seconds during scroll. It retained `object-fit: contain`; the header stayed transparent in the hero and switched to glass afterward.
- Home room carousel responded to wheel scrolling and the Next room button, which selected Deluxe King. The transition into the facilities section was inspected.
- The lower homepage sections still need a complete visual recheck: browser automation timed out while scrolling toward dining and services, then timed out recovering the tab. Do not interpret the older validation below as coverage for this remaining part of the new visual changes.

Validated locally on 18 September 2026:

- `node node_modules/typescript/bin/tsc --noEmit` passed.
- `npm run lint` passed with no warnings or errors.
- `node --experimental-strip-types --test tests/backend.test.ts` passed all 7 tests.
- `node node_modules/next/dist/bin/next build --webpack` passed and produced the App Router routes.
- PowerShell `$env:PREVIEW_URL='http://localhost:3001'; node scripts/preview-check.mjs` passed with no page errors, no image URL errors, and no desktop/mobile horizontal overflow.
- `POST /api/inquiries` returned a real `RHM-YYYY-XXXXXX` reference for a valid contact request.
- The generated admin credentials returned a `200` login response and `ramayana_session` cookie.

Validated during the 26–27 September 2026 photo, language and readability update:

- Production build and TypeScript validation passed. ESLint passed; the existing 33 backend tests and 50 Events HTTP assertions passed during this update.
- All 222 catalog entries contain text for the 11 supported languages. Untranslated editorial content explicitly falls back to its original wording.
- Fixed a saved-language hydration mismatch. Arabic now persists after a full page reload without a new React hydration error; moving between Rooms, Events and Gallery retains the selection. A fresh browser tab on the final build reported no console errors.
- Checked Rooms at 390px with Indonesian, French, Simplified Chinese and Arabic. Arabic uses RTL while the room-area number range is isolated as LTR. Room and venue pages had no horizontal document overflow.
- Superior Twin opens the two-photo viewer; ArrowRight changes to the bathroom image and Escape closes it. Erlangga shows its three reviewed classroom photos. Gallery includes all 30 curated WebPs with no broken loaded images in the inspected state.
- Visually inspected the mobile homepage facilities, dining, services, nearby area, Events, final reservation panel and footer. Fixed white-on-white Events button text, insufficient contrast over bright facility photos, the clipped translated reservation heading, and a nearby grid that previously expanded to 726px inside a 335px container.
- On the final build, nearby panels measure 333px at a 390px viewport. At 768px and 1440px, panels fit their grid columns; the reservation heading fits its container. Screenshots verified facility overlay text and the complete mobile reservation heading and buttons.
- Preview runs at `http://127.0.0.1:3001`. These checks used the local preview and did not submit guest requests or contact external recipients.

Before production release:

- Run the full browser check against the production build, including keyboard-only navigation and screen-reader landmarks.
- Replace local SQLite with the approved production database and configure backup/restore.
- Set `APP_URL` to the canonical HTTPS origin and use secure cookies behind the trusted proxy.
- Review and verify the register in `CONTENT_VERIFICATION.md`.
- Test inquiry ownership, response time, deletion requests, and audit-log retention with hotel staff.
- Confirm image rights, event package validity, contact routing, and map accuracy.
