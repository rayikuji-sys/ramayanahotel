# Checkpoint — 2026-10-01
**Status: independent local sandbox core implemented; master prompt NOT fully complete.** Continue from this folder and these decisions. Do not restart the design or edit the parent website.

## Completed
- Read-only website/design/data audit and SHA-256 baseline446 files.
- Independent Node HTTP/SQLite application, local assets/fonts, responsive guest/admin screens.
- Catalog8types, multi-room/night backend pricing, room-only/breakfast shared stock, test promo, immutable policies.
- Transactional hold15min, expiry and safe stock reacquisition, idempotent reserve/payment events and ledger.
- Guest search → selection/compare/gallery → add-on requests → details → local payment simulator → confirmation/voucher.
- Guest private access, cancellation preview/action, full refund approval, pending amendment request; persistent tasks.
- Staff scrypt/session/RBAC; rates/inventory/stop-sell, reservations, payments/refunds, tasks, inquiry list, integration state and audit.
- Durable local outbox capture and worker, isolated tests, backup/restore-copy.
- README, architecture/API, inventory ownership, motion/visual mapping, runbook and website integration proposal.
-21 automated tests passed. Build validates modules and catalog assets. Five-width search overflow check passed. Website baseline unchanged.

## In progress / partial
- Guest internationalization: primary transaction copy ID/EN; source room descriptions and some admin/policy/navigation labels not fully translated.
- Motion: functional entry/step/dialog/success and mobile summary; native calendar/disclosure and immediate total-change fallback. Advanced drawer/swipe and forced reduced-motion QA pending.
- Amendment is request-only; no staff approval/application or financial delta.
- Group/corporate is inquiry-only; does not hold rooms or form a contract.
- Notifications are local capture; no email/WhatsApp. Real payment adapter is absent, not merely missing keys.
- Save PDF uses browser print, not generated downloadable PDF.
- Admin mobile visual/keyboard breadth, device Safari, comprehensive contrast/assistive-tech/performance audit pending.
- Detailed room capacity/bed/accessibility and shared triple reference need hotel validation.

## Pending implementation — do not silently drop
1. Corporate company/contract/authorized booker rates, approval/credit and private documents.
2. Group/event room blocks, release dates, booking against a block without double allocation, rooming lists, group deposits; versioned professional proposals.
3. Full amendment quote/approval/apply including overlapping dates, atomic stock swap, payment/refund difference, policy/task updates.
4. Real Midtrans merchant sandbox adapter, reconciliation, provider refunds, partial payments/deposit/pay-at-hotel.
5. Configurable rate/policy versions, child/extra-bed/tax service rules, restrictions beyond min-stay, promo quotas/redemption, loyalty.
6. Service capacity slots and scheduling, manual staff bookings, user management/MFA, retention/revocation/private-file controls.
7. PMS/channel and notification adapters, failure/backoff/dead-letter workflows, recovery consent/analytics with PII minimization.
8. Full languages, room deep links, guest refresh-draft design, direct PDF generation, full advanced motion matrix and all-state QA.
9. Migration runner, encrypted backup/deployment hardening, representative performance/load tests and operational monitoring.
10. Website integration is a separate authorization gate; proposal only.

## External decisions required later
Hotel-approved inventory authority/allotment, actual sellable room capacity and photography mapping, rates/tax/child/cancellation/deposit/refund rules; provider merchant sandbox and eventually live account, sending domain/mail/WhatsApp/PMS access, hosting/HTTPS. Implement adapters and fixtures while waiting; credentials alone will not complete the pending software.

## Decisions to preserve
Only booking-engine folder changes. Ivory neutral website-derived design; existing logo unlinked. No new runtime npm dependency. Database and simulated inventory isolated. Do not send emails or accept real payment. Main website3001 remains separate. Booking3003 is local only. No bootstrap default admin.

## Commands / continuation
Use npm.cmd run seed, npm.cmd start, npm.cmd test, npm.cmd run build, npm.cmd run baseline:verify from this folder. README has secure staff bootstrap. Read qa-report and scripts/tests before changing lifecycle semantics.

Recommended next implementation: full amendment workflow with atomic stock swap and finance delta, then corporate/group room blocks with concurrency tests. Preserve successful core flows and extend schema through explicit migrations. Re-run relevant domain/HTTP and browser checkout tests after changes.

