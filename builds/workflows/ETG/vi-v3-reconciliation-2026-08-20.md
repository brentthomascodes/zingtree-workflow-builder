# VI (Virtual Interlining) — Reconciliation against Olga's live tree, 2026-08-20

**Input files:** Olga Gerothanasi's "Copy of VI - Dynamic" (tree `269789227`, last modified
2026-08-20 20:19 — her actively-worked tree, confirmed working for her use case) · this
session's `Register Errands - VI Dynamic (FIXED v2).json` (tree `756760393`, Brent's
sub-tree/hand-off approach, built earlier today per `HANDOFF.md`) · `HANDOFF.md` ·
`Zingtree Builder/Requirements/ETG/vi-errand-registration-requirements.md` (R1–R11, "Ready
for build," 2026-08-05).

**Output:** `Register Errands - VI Dynamic (v3 reconciled 2026-08-20).json` — same tree
(`756760393`), same architecture, targeted fixes below. Delivered alongside this doc.

## What this answers

Brent's ask: take Olga's confirmed VI business logic and make it work inside the sub-tree
hand-off architecture (VI tree → collapses to one record → hands off to Dynamic's existing
node 3 onward) instead of her tree's shape — a full duplicate of the whole `Register Errands
- Dynamic` tree (root node 10, the entire per-PNR loop, the entire ticket/grandchild/errand
loop) with her VI decision spine spliced in *inside* that per-PNR loop, so it (and the
partner/date/disruption screens) reruns once per real PNR instead of once per booking. That
loop-per-PNR shape is the "not well built, technically" part — not her decision content,
which tests out fine on its own.

## Finding: the two trees' VI content already matched, almost exactly

Diffing Olga's nodes 48 (partner selection) through 76 (the ETG-post-cutoff ladder) against
FIXED v2's nodes 90/92–112 node-by-node found **zero differences in content or radio
options** — every alert, label, and option string already matched hers verbatim. This
strongly suggests FIXED v2 was already built from this same source content earlier today
(the `HANDOFF.md` attribution to a separate "test vi" tree, id `610125226`, may simply be
mislabeled — tree `269789227` is the one Olga's own Slack messages reference by number for
this exact partner/date logic, see the requirements doc's R9 notes/Q5).

The only differences were internal variable-name granularity: Olga's tree uses
`stg_alternatives_sameday_sc` / `_td` (distinct per screen), FIXED v2 uses a shared
`stg_alternatives_sameday` / `_overnight` (read back immediately after being set on the
same screen). Cosmetic, not a behavior change — left as FIXED v2 already had it.

## Real defects found and fixed (present in Olga's tree; not reintroduced here)

1. **Operator-precedence bug, nodes 93/104** ("Continue" routers). The two same-day
   schedule-change buttons read `disruption_type == "X" && flight_affected == "Directly
   affected flight" || flight_affected == "Indirectly affected flight"` — with no
   parentheses, `flight_affected == "Indirectly affected flight"` alone satisfies the first
   button regardless of `disruption_type`. Both buttons already routed to the same target
   node, so no behavior changed, but the logic was wrong. **Fix:** merged into one clean
   `disruption_type == "...within..." || disruption_type == "...outside..."` button per
   router. Confirmed present, unfixed, in Olga's live tree as of this reconciliation (her
   node 52).
2. **Dead-end defaults across every disruption/ladder Scoring node**, plus node 121. Every
   `op: "def"` button routed to node `0` — a missing node — inherited from Olga's tree
   (her node 49 "Partner logic" and node 52 "Continue" both still do this). **Fix:** marked
   the gating radios (`partner`, `disruption_type`, `stg_alternatives_sameday`,
   `stg_alternatives_overnight`) required so Continue can't fire blank, *and* rerouted every
   remaining default to a real screen (node 42, or node 92 for node 121) as defense in
   depth — matches the parent requirements doc's AC-6.4 pattern.
3. **Node 82 — `providerBookingIds` shape caveat.** Node 82 sets `id` to an *array* of every
   real PNR's booking id (correct for a collapsed VI record). Node 27 (shared, unmodified)
   independently computes its own `providerBookingIds` as
   `JSON.stringify(group.map(item => item.id))` — for a VI case, that wraps the
   already-an-array `id` a second time, producing a **nested** array
   (`"[[123,456]]"`) instead of a flat one. Not fixed by touching node 27 (out of scope —
   shared with the main flow). **Fix:** added a code comment on node 82 pointing at
   `final_pnrs[0].providerPnrIds` (survives node 27's `...group[0]` spread untouched, flat
   and correct) as the field to wire into Edvin's Register Errand payload instead of
   `providerBookingIds`. Still unverified against a real `registerErrand` response either
   way — this was already an open item in `HANDOFF.md` (Connected Object #184) and remains
   one.

## Verification run

- **Structural:** every `continuation_node_id`/`button_link` resolves to a real node; full
  reachability from root (78) reaches every node except the intentionally-unlinked
  `claude.md` (node 5); zero remaining `def`-branch dead ends.
- **Every-path walk:** enumerated all 36 distinct paths through the partner/date/disruption/
  ladder decision block (root → hand-off). All 36 terminate cleanly at node 27 before the
  node 77 Tree-hop into Dynamic. Zero dead ends, zero loops.
- **Not run this pass:** the `etg-errand-regression` offline harness (Dynamic nodes
  2/12/21/27/32/36/44 are unchanged, so it isn't required by that skill's own trigger rule,
  but it's cheap insurance) and a live Zendesk-sandbox VI case — both still recommended
  before this ships, per `HANDOFF.md` §8.

## Open item — needs Brent's decision, not resolved here

The VI requirements doc (`vi-errand-registration-requirements.md`) **R10** says Edvin should
hold "exactly N errand records — one per PNR" for an N-PNR VI order. This tree's node 82
collapses every VI case to one `customer_action_pnrs` record, so Dynamic's node 44 register-
errand loop (unmodified) fires **once** per VI order, not N times — on its face, a deviation
from R10.

But Dynamic's own node 27 (shared, v11+, predates this VI work) already collapses *any* PNRs
sharing the same (type + action) into one `final_pnrs` entry today, even in the ordinary
per-PNR flow. "One errand call per distinct type+action, not literally one per PNR" is
Dynamic's existing, already-shipped behavior — not something VI introduces. Recommend a CR
against R10 to correct its text to match Dynamic's actual grouping-based behavior, rather
than treating this tree as out of spec against a requirement that described the wrong
baseline.

**This reconciliation does not write that CR** — it's a read on Dynamic's existing code, not
a confirmed answer from Olga/Edvin about whether `registerErrand` actually accepts (or would
even need) a multi-PNR payload. Flagging for Brent to confirm; happy to draft and append the
CR to the requirements doc once he does.

## claude.md (node 5)

Updated in the delivered JSON with a new "Reconciliation against Olga's live tree" section
and a dated changelog entry covering all of the above, per the workflow-builder skill's
maintenance convention.
