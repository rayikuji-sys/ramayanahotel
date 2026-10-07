# Architecture and API — sandbox v0.1
## Isolation and ownership
Browser ES module → same-origin Node HTTP server → domain functions → own SQLite WAL file. Worker uses the same transactional outbox. Nothing imports website modules at runtime. The manual reference importer is the only read-only bridge to website profile/photo sources.

Inventory authority is **independent simulation**: 2 units per type/night across 180 seeded dates. It is not hotel total inventory, a protected live allotment, or PMS synchronization. Each booked night consumes one unit; checkout is exclusive. A room-only plan and breakfast plan share room-type/date stock. Hotel total77 from source profile is not loaded as sellable inventory.

SQLite BEGIN IMMEDIATE serializes writers; conditional inventory updates and CHECK constraints prevent negative or overcapacity stock. Multi-room/night acquisition is one transaction. This has been tested across independent connections. It is not evidence of distributed/cloud high availability.

## Lifecycle
- Quote: backend integer IDR calculation, 10-minute expiry; immutable JSON room/night/price/policy snapshot.
- Hold: active for 15 minutes → converted on verified paid confirmation, expired by worker/request check, or released on cancellation. Expiry only releases active holds once.
- Reservation: awaiting_payment → confirmed; expiry → expired. Late paid events try reacquisition atomically, otherwise payment_review. Cancellation → cancelled. A late payment on cancelled inventory enters review.
- Payment: pending → failed or paid. Paid is terminal for payment-event ordering. Event ID/fingerprint, amount, currency and HMAC are validated; duplicate events do not double the ledger. Refund is a separate positive ledger entry.
- Refund: cancellation creates pending request; Admin/Manager/Finance may complete a full simulator refund once with audited reason. There is no bank refund.
- Amendment: quote and pending request only; old booking is preserved. Inventory transfer and financial difference settlement are not implemented.
- Task: confirmed add-on requests create FO/Concierge tasks → accepted/completed/cancelled. Cancellation cancels tasks.
- Outbox: pending → captured in local persistent capture. No external delivery is represented as sent.

Schema v1 uses foreign keys and uniqueness for room-night inventory, quote-to-hold, hold-to-booking, idempotency keys, provider events and payment/refund ledger. Future schema changes need numbered migrations; current schema creation is idempotent CREATE IF NOT EXISTS, not a complete migration runner.

## Security boundary
Loopback-only listener; non-sandbox mode refused. SameSite Strict HttpOnly guest/staff cookies; Secure intentionally absent on loopback HTTP only. Staff scrypt hashes, 8-hour session hashes, server-side permissions. Guest 256-bit random access key is stored as a hash with 90-day expiry. Code alone never grants access. Logout clears guest cookie but does not revoke the saved guest key; guest rotation/revocation is pending.

Origin allowlist for POST (webhook instead requires signature), bounded JSON body, local IP throttling, parameterized SQL, escaped HTML, CSP self, frame denial, no-store booking/voucher responses, sanitized correlation-ID errors. Browser cache stores search/selection only. PII is still plaintext in local SQLite; encryption/retention and production security controls are pending. MFA and private uploads are not implemented.

## API contract
All JSON routes begin /api/v1. POST requires exact local Origin. Idempotency-Key is required for holds and reservations. Errors: {error:{code,message,fields,retryable,correlationId}}. IDs and prices from the client are never a pricing authority.

| Method / route | Contract / access |
|---|---|
| GET health | mode/status; no sensitive data |
| GET catalog | 8 room types with local asset references |
| GET availability | checkIn, checkOut, adults; per-night rates and remaining stock |
| POST quotes | dates, rooms[{roomId,plan,adults,children}], optional promo/addOns/source |
| POST holds | quoteId; atomic hold with idempotency key |
| POST checkout-session | issues private checkout cookie |
| POST reservations | holdId, guest{name,email,phone,consent,...}; cookie and idempotency key |
| POST payments | current guest reservation only; idempotent simulator attempt |
| POST sandbox/settle | owned paymentId, status paid/failed; local HMAC-verified event |
| POST webhooks/local | raw-body HMAC in x-booking-signature; local internal secret only |
| GET booking | own cookie, reservation with ledger total and requests |
| GET cancellation-preview | allowed/refund/policy from booking |
| POST cancel / amendment | own booking; amendment body checkIn/checkOut |
| POST manage/access | code + private token, sets guest cookie |
| POST manage/key / manage/logout | current access key display / clear cookie |
| POST inquiries | name,email,company,message,consent; persisted group inquiry |
| POST admin/login / logout | staff sessions |
| GET admin / admin/inventory | authenticated read; inventory from/to |
| POST admin/rates | rates permission; date range,roomId,capacity,rate,stopSell,minStay,reason |
| POST admin/task | tasks permission; id,status |
| POST admin/refund | finance permission; request id,reason |
| POST admin/worker | rates permission; run local capture |

GET /voucher is private HTML with print CSS, not an API PDF stream. No live payment endpoint exists.

## Integrations still to implement
Define provider adapters independently from domain state transitions: initiatePayment(idempotent), verifyRawWebhook, fetchPaymentStatus, requestRefund; inventory mappings and sync outbox with retries; notification rendering/delivery status. Real Midtrans merchant sandbox, reconciliation, email/WhatsApp and PMS are **not implemented**, even if credentials are provided. Local capture is the implemented worker transport. Do not label that as successful provider integration.

