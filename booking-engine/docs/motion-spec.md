# Motion system
Principle: motion follows a user action and never delays a quote, hides a total, or implies payment success before the server confirms it.

Tokens in public/styles.css: fast160ms, panel240ms, entry340ms, cubic-bezier(.2,.75,.25,1). Only opacity/transform for core entry transitions. Reduced-motion CSS disables animations/transitions globally and card hover transforms.

| Interaction | Implemented behavior / fallback |
|---|---|
| Search entry | gentle opacity + 12px upward reveal |
| Date picker | native platform calendar; platform motion and keyboard behavior |
| Occupancy | native details disclosure; immediate fallback |
| Request/loading | buttons disabled while real requests run; loading message, no fake wait |
| Room selection | selected card styling; summary/total recalculated from server |
| Total change | aria-live region, immediate numeric update; no rolling-number animation |
| Comparison | native dialog with animated entry; two-column cards |
| Room gallery | native dialog; thumbnail replaces photo and caption; CSS initial photo fade |
| Checkout steps | entry transition; focus main and reset scroll position |
| Mobile checkout | fixed bottom total/continue at <=700px only |
| Errors | focus visible alert; preserve input on failed submission |
| Success | checkmark scale/opacity; rendered only after confirmed server state |
| Manage/cancel | explicit preview dialog and separate confirmation action |
| Admin tabs | content replacement without artificial motion delay |
| Browser Back | guest draft stays in memory; committed checkout returns to payment/status |
| Reduced motion | CSS disables animation and transition; no transform-dependent information |
| Missing backdrop-filter | opaque white surface fallback |

The gallery does not yet implement a continuous swipe carousel, and total changes do not tween. No draggable drawer is implemented. These are explicit simple fallbacks, not claims of every advanced animation in the master prompt.

Normal-mode interactions tested: search, selection, comparison, thumbnail change, step movement, pending payment, success, manage preview. Escape closes dialogs. Reduced-motion rules were reviewed in code; forced reduced-motion browser/device QA is still pending. Native calendar/mobile keyboard behavior requires physical device testing.

