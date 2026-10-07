# Operations and deployment runbook
## Local staff operations
Create staff with README bootstrap, then use /admin. All actions affect sandbox DB only.

- Rates/inventory: select room type and [from,to) dates (max30 nights per update). Set integer IDR rate, allotment, stop-sell, minimum nights, and reason. Server refuses capacity below used count and rolls back the entire range.
- Reservations: search name/code; inspect immutable stay, price and guest request. Manual booking on behalf of a guest is not implemented.
- Payments: paid/refund totals are sandbox ledger values, not bank reconciliation. Finance/Admin/Manager can approve pending full refund with a reason. Do not process actual money based on this dashboard.
- Cancellation: guest previews refund, confirms cancellation; inventory is released and tasks cancelled immediately. Refund remains pending until Finance completes simulator action.
- Amendment: pending inquiry only. Staff must not tell the guest their dates changed; applying inventory/price differences is pending.
- Tasks: FO/Admin/Manager can mark accepted/completed/cancelled. Add-ons carry no charge or capacity commitment yet.
- Groups: inquiry is persisted for Sales review. Company contracts, negotiated rates, credit, room blocks, proposals and rooming lists are not implemented.
- Integrations: local capture queue only. Captured does not mean email or PMS delivery. No external retry/reconciliation tooling exists yet.
- Audit: inspect rates, booking/payment/cancel/refund/task actions. No secret/access key is logged.

## Backup and restore
All local data/backups contain guest PII. Restrict filesystem access; production encrypted backups/retention are pending.

```powershell
cd C:\projects\ramayana-web\booking-engine
npm.cmd run backup
npm.cmd run restore:copy -- data/backups/EXACT-FILENAME.sqlite data/restored.sqlite
```

Backup uses SQLite VACUUM INTO for an independent consistent snapshot, including committed WAL data. Do not copy only the active .sqlite file while ignoring WAL. Restore validates SQLite integrity, foreign keys and schema version, then creates a **new** file. It refuses an existing target and restricts target to booking data.

For activation: stop booking server and worker (never all Node processes), preserve current files, set BOOKING_DB to the verified restored file, restart booking only, check health and one reservation/inventory/ledger record. Never overwrite the main website DB. Rollback by stopping booking and switching BOOKING_DB to the preserved previous file. This procedure is local-only, not a production disaster recovery plan.

On 2026-10-01 backup and restore-copy were executed against sandbox: restore-qa-20261001.sqlite had integrity_check=ok, zero FK errors,2 existing sandbox reservations. Domain tests additionally verify re-opening a restored DB and original guest access/stock.

## Hosting plan — no deployment performed
Current application deliberately refuses live mode and binds loopback. Before any public deployment:
1. Finish missing workflows in checkpoint.md and review authentication/RBAC/retention.
2. Obtain explicit inventory authority (PMS source or approved protected allotment), approve tax/child/extra-bed/minstay/cancel/deposit rules and category photos.
3. Implement real provider adapter, webhook signature verification per provider, status reconciliation and refund semantics; run merchant sandbox failures and duplicates.
4. Provide same-origin HTTPS reverse proxy, Secure cookies, trusted origin config, persistent database volume, restricted secrets and service account. Never just expose3003 publicly.
5. Choose single-host SQLite deployment or migrate/test PostgreSQL for multiple instances. Add migration/restore rehearsal, load/race tests and monitoring.
6. Implement durable external outbox retry/backoff/dead-letter visibility, SMTP/WhatsApp/PMS setup with owner authorization; configure real recipients without placing secrets in chat.
7. Set backups encrypted off-host, retention and deletion policy, incident owner, metrics/alerts for payment_review, inventory conflict and worker failure.
8. Accessibility/reduced-motion/physical-device tests; representative performance measurements.
9. Separate approval for website link changes. Deploy booking independently with a rollback strategy, then test agreed live activation gates.

No claim of high availability, production security certification, WCAG certification or real inventory synchronization is made.

