# Booking experience: benchmark and implementation

Reviewed 4 October 2026. These are product references, not claims of certification or feature parity.

## Primary references

- [Cloudbeds Booking Engine](https://www.cloudbeds.com/booking-engine/): branded booking within the hotel website, mobile booking, comparison, extras, payments and PMS integration.
- [Cloudbeds feature overview](https://myfrontdesk.cloudbeds.com/hc/en-us/articles/218512197-Cloudbeds-Booking-Engine-overview-and-features): searching availability, comparing accommodation/rates and completing reservations.
- [SiteMinder Booking Engine](https://www.siteminder.com/hotel-booking-engine/): direct booking, optional extras, offers and guest communication.

The implementation below applies common booking patterns to Ramayana's actual room collection and website brand. It does not copy another vendor's interface or promise that the local system provides their managed services.

## Changes implemented

| Guest need | Implementation |
| --- | --- |
| See and change the search without restarting | Dates and occupancy remain above results; one dialog edits both. Two calendar months on desktop, one on mobile, with native date input fallback. |
| Book for a family | Adult/child counters, required age for each child; capacity and breakfast pricing checked again after changes. |
| Understand the price before selection | Each rate has its own action, full-stay price, per-night average, meal inclusion and cancellation details. Currency is explicitly IDR. |
| Compare options | Side-by-side room size, capacity, bed description and full-stay room-only price; a room can be selected from comparison. |
| Change a selected rate | Each selected room has a package selector in the summary. The server recalculates the quote, including promotions. |
| Keep valid choices when editing dates | Availability is fetched first, invalid choices are removed with a notice, retained choices are repriced. Failed quote requests do not commit the new search. |
| Use a phone | Stacked cards, full-width rate actions, compact calendar and fixed total/continue bar. |
| Return to previous checkout steps | Completed steps are clickable before reservation creation. Guest form values remain in memory when navigating back. |
| Remain in the hotel's experience | Playfair Display/Montserrat, cream/charcoal/gold brand, restrained translucent search/summary surfaces, own hotel photos, same-origin booking and staff access. |

## Verification

- 35 booking tests passed, including four new tests for invalid/overlong dates, child ages, leap years and retained-room capacity/stock conflicts.
- Integration smoke passed: website handoff, proxy/assets/cookies, staff SSO, spoof rejection, settings/promo sync, idempotent reservation, simulated payment, totals and PDFs, using isolated databases.
- Booking build validates 32 JavaScript modules and all eight room categories' photo assets.
- Browser checks: calendar changes 2 nights to 3 and reprices; adding a child removes a room with insufficient capacity; breakfast and SANDBOX10 totals; change package in summary; select a room from comparison; remove a second room; extras; return from guest form without losing entered name; mobile continue action.
- Mobile reviewed at 390 × 844. Screenshots are in `outputs/booking-international-mobile.png`, `outputs/booking-calendar-mobile.png` and `outputs/booking-guest-mobile.png` in the website workspace.

## Remaining production requirements

This remains a local sandbox, not a production equivalent of Cloudbeds or SiteMinder. Payment methods use a simulator; PMS/channel manager/OTA inventory is not connected; outbound email needs configured delivery. The live tax, cancellation, capacity and room-allotment rules require hotel-approved configuration. Currency conversion, corporate contracted rates and event room blocks are not implemented as live services. A real rollout needs the hotel's chosen systems, their supported APIs, provider onboarding, verified webhooks, deployment, and operational acceptance tests. These cannot be replaced by decorative controls or mocked success states.
