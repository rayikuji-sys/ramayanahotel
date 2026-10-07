# QA report — 2026-10-01
Environment: Windows, Node22, SQLite builtin, Codex Chromium in-app browser; local sandbox only. No live hotel or external payment/notifier traffic.

## Automated
npm.cmd test: **21 passed,0 failed**. Includes exclusive checkout and invalid dates; integer nightly price, child breakfast/promo; occupancy validation; shared plan stock; all-or-nothing multi-room/night; hold and reservation idempotency; wrong private access; failed/duplicate/out-of-order payment; invalid HMAC/amount/currency/event reuse; expiry vs confirmation; late payment reacquire or review; cancel/refund/task consistency; amendment request preserves old stay; immutable price; captured outbox deduplication; scrypt/RBAC/revocation; restart/backup; two independent connections racing for last room; malformed input validation; HTTP end-to-end with CSRF/ownership/Finance permissions.

Tests use in-memory or temporary isolated databases and HTTP3034, not hotel production data. Concurrency proof is two worker threads with separate connections synchronized at allocation; exactly one wins the last unit. This is not a distributed stress/load test.

Build: syntax and local asset integrity passed,8 room categories. Browser guest/admin app approximately44KB uncompressed; exact current count printed by build. No bundle budget or measured Core Web Vitals claim.

Baseline verify:446 original files, changed=[],added=[]. Excludes cache/runtime/secrets/DB. Original website process/DB not operated on. Main website build not re-run because generating artifacts could modify protected files; existing website availability checked separately.

## Browser observations and fixes
- Mobile390 full checkout using fictitious guest: Deluxe King breakfast,2adults,1night,transfer request; total459000 remained identical in quote, pending, paid and voucher. Confirmed RHB-51EBB5205D after local simulator.
- Refresh at confirmation retained server-backed reservation and private cookie; screenshot confirmation-mobile.png.
- Portal manage and cancellation preview correctly displayed pending Finance refund semantics; preview dismissed with Escape without cancelling.
- Search at360/390/768/1280/1440: document widths345/375/753/1265/1425 respectively (scrollbar excluded), no horizontal overflow and no broken loaded images.
- Compare Superior King and Deluxe King: both details/rates visible; mobile dialog width341 in390 viewport.
- Superior King photo2 changed from bed to supplied bathroom with matching caption.
- Mobile continuation fixed: total/button fixed bottom at<=700px, absent on desktop.
- Confirmation scroll/focus fixed so success begins at page top.
- Invalid nested voucher button replaced by accessible styled anchor.
- Guest draft Back handling and malformed addon/room/guest validation hardened.
- Native dialog Escape tested. Full physical keyboard/mobile keyboard/reduced-motion/assistive technology coverage still pending.

Evidence in outputs: search-five-width images, results-desktop, comparison-desktop/mobile, gallery-mobile, confirmation-mobile, manage-tablet. Full-page screenshot capture was unavailable; viewport screenshots saved instead.

## Backup
VACUUM INTO snapshot and restore-copy successfully executed. Restored sandbox had2reservations, integrity_check ok, no foreign-key errors. Original DB untouched. Restore test file retained only as local sandbox evidence.

## Limits
No real Midtrans sandbox, live payment, real notification/PMS, live stock, corporate blocks, amendment application, configurable commercial policies, MFA or public hosting tested because those features remain unimplemented/unconfigured. No statement of production readiness. Full all-state responsive, reduced-motion runtime, performance and accessibility qualification remains required.

