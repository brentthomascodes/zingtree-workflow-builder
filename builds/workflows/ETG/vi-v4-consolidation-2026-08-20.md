# VI (Virtual Interlining) — v4 efficiency rebuild, 2026-08-20

**Deliverables**
- `Register Errands - VI Dynamic (v4 consolidated 2026-08-20).json` — tree `756760393`, **37 → 18 nodes**
- `Register Errands - Dynamic (companion edit v2).json` — one field changed: node 76's `open_tree_node_id` `78` → `83` (VI's new root). Matched pair — import both.
- `vi-v4-before-after.mermaid` — before/after flow

## First, two things I got wrong in v3

Brent was right to push back. Beyond the structural criticism, the v3 pass shipped two real errors:

1. **I called a genuine defect "cosmetic."** v3's report said the `stg_alternatives_sameday` vs
   `stg_alternatives_sc` variable-name difference was "cosmetic, not a behavior change." It was
   not. The eight accept/decline routers (nodes 95/97/100/102/106/108/110/112) all tested a
   variable named **`stg_alternatives`** — which matched *neither* the fields on screen
   (`stg_alternatives_sameday`, `stg_alternatives_overnight`) nor Olga's own naming. That
   variable was never set, so **every ladder router in v2/v3 fell through to its default
   branch.** In Olga's tree the routers are consistent and work; the break was introduced by
   the earlier v2 build. I should have caught it by checking field names against expressions
   instead of eyeballing the option text.

2. **I introduced a routing regression while "fixing" a bug.** v3 merged the two
   schedule-change buttons on nodes 93/104 into one condition pointing at one target. On node
   104 those two buttons had *different* targets: `within 24h` → the Rebooking-Pass ladder,
   `outside 24h` → the **standard** ladder. Olga encoded a real rule there — the Rebooking Pass
   applies only inside the 24h operational window — and v3 flattened it, sending ETG-post
   "outside 24h" cases down the wrong ladder. v4 restores it explicitly (the
   `cutoff_sensitive` flag in node 113) and the harness now regression-tests it.

Both are the same root cause: the rules lived as string literals scattered across 24 nodes,
where nothing cross-checks anything. That's the argument for the rebuild, not just tidiness.

## What changed structurally

| | v2 / v3 | v4 |
|---|---|---|
| Total nodes | 37 | **18** |
| VI decision block | 24 nodes | **5** |
| Logic (Scoring) nodes | 11 | **1** |
| Agent-facing ladder screens | 13 | **1** |
| Places an offer's text appears | 2 (radio + router expression) | **1** (a lookup table) |
| Places the partner/date rule appears | 3 nodes, 6 buttons | **1** table |

The VI block is now:

```
90  Trip & Disruption Intake   Content   brand + partner + disruption_type + delay_reason
                                         + flight_affected + STG alert, one screen
113 Resolve STG Ladder         Script    ALL rules as lookup tables -> vi_stg_rungs[]
114 More STG Rungs?            Scoring   one boolean: vi_more_rungs == true
115 Stage STG Rung             Script    cursor: stage one rung, advance index
116 STG Offer Sequence         Content   the only ladder screen; its select reads
                                         options from transforms.vi_rung_options
117 Record Rung Outcome        Script    accept -> exit ladder; decline -> next rung
```

Loop: `114 → 115 → 116 → 117 → 114`, exits to node 42. Same cursor-loop shape as Dynamic's own
node 32 and node 44 loops.

### How Olga's intent is preserved rather than flattened

Everything she designed is still there — it just lives in data instead of topology:

- **`LADDERS`** (node 113) — the offer sequences, verbatim from her tree: `schedule_change` and
  `trip_delay` families, each with a `standard` and a `rebooking_pass` variant, each with a
  `sameday` and an `overnight` list. Her four pairs of near-duplicate screens *are* these four
  entries.
- **`REFUND_RUNG`** — the shared terminal rung (her node 61), including `Last resort`.
- **`DISRUPTION`** — contact reason → ladder family, with a `cutoff_sensitive` flag per reason.
  That flag is how her subtle "outside 24h ignores the cutoff" rule survives as an explicit,
  readable fact instead of an accident of which button pointed where.
- **The decline option** is appended by the cursor (node 115) rather than stored per-rung, so a
  new ladder can't be added without its escape hatch.
- **Node 117's rule is one negative test** — anything that isn't the decline option resolves the
  ladder. That's what removes the "add the offer in two places or it dead-ends" failure mode
  permanently.

**To add, remove or reorder an offer: edit the `LADDERS` table. Nothing else.** To change which
bucket gets the Rebooking Pass: edit `DISRUPTION`. Nothing else.

## Verification

I built a harness that **executes the actual script text** from nodes 113/115/117 in a mock `ZT`
sandbox, and an oracle that **walks Olga's real node graph** in her JSON — then compared the
sequence of option-sets each produces.

- **25/25 (partner × order-date × disruption) combinations produce an identical screen sequence
  and identical option lists** to Olga's own graph.
- Two intentional, documented deviations, both flagged in the run output: **ETG pre-cutoff** and
  **missing/unparseable date** take the standard ladder. Olga's built tree has *no date check at
  all* (her node 49 routes on `partner` alone), so every ETG case went to the Rebooking-Pass
  branch. v4 follows her **stated Slack rule** instead. This is the same fix the earlier build
  intended; it's now testable.
- **Every accept-at-rung-N path** (for all partner × disruption combinations, at every rung
  depth) terminates with a recorded outcome and `vi_more_rungs == false`.
- The **terminal refund rung exits rather than looping**, including `Last resort`.
- Structural: no dangling links, no dead `def` branches, every node has an exit, full
  reachability from root except the intentionally-unlinked `claude.md`.
- Import safety: node/formfield/button key parity against Zingtree's own emitted schema, and an
  ASCII-only guard on all script content.

Harness is `harness.mjs` (delivered with this doc) — rerun with `node harness.mjs` after any
edit to node 113's tables.

## Other defects fixed in passing

- **Broken merge fields.** The ladder screens interpolated `${transforms.pnr_banner}`,
  `${transforms.current_pnr.pnr}`, `${transforms.current_pnr.postSaleHandleType}` and
  `${channel}` — all per-PNR-loop artifacts from Dynamic that **do not exist in this tree** (and
  `channel` isn't selected until later anyway). They rendered blank. Now `vi_pnr_banner`.
- **Trailing space** on one ETG-post overnight option (`"...hotel accomodation "`) that would
  have broken exact-match routing.
- **Node 81's duplicate `notes` field** (a `hidden` and a `multiline_full` sharing one name) —
  this is defect #4 the requirements doc §3 explicitly said must not be carried forward, and it
  had been. Removed.
- **Node 81's stale static type list** and its 17 `scores` values removed — the field already
  has a dynamic Edvin list source, and R3 says Edvin is the only source.
- **Node 83 now resets all VI state** — Dynamic's "Register an additional request" loop
  re-enters this tree without clearing VI's own transforms, so a second pass could have
  inherited the first one's rung cursor.
- **Node 82** now carries the STG outcome, partner bucket, and disruption answers into the
  errand record, so the ladder result reaches the internal note instead of being discarded.

## Open items — unchanged, still need real answers

Nothing here was guessed at:

1. **`partner`** is still a manual radio. Olga's own node said "this will be defined by the
   system — temporary node." When the real field is confirmed, delete the radio on node 90 and
   read the field in node 113 — a two-line change.
2. **The order-created date.** Node 113 reads `orderCreated` first (the field Ravindu named on
   the Edvin v1 `findOrder` endpoint), falling back to `bookingDate`. Neither is verified against
   a real response. Missing/unparseable → standard ladder, which is my judgment call, not Olga's.
3. **The 21-vs-22-May-2026 boundary** — resolved as ">= 22 May UTC is post-cutoff". Unconfirmed.
4. **`Last resort`** has no defined follow-up (requirements doc A5). It records and moves on.
5. **`providerPnrIds` vs Edvin's `registerErrand` payload** (CO #184) — unverified. Note that
   node 27's own `providerBookingIds` comes out *nested* for a VI record; wire the payload to
   `providerPnrIds`.
6. **`brand` (Booking.com / Clicktrip) may be redundant with `partner` (Booking / ETG).** `brand`
   does not exist in Olga's tree at all and isn't in the requirements doc's journey — it was
   introduced by the earlier build. Kept and captured, but it looks like the same question asked
   twice. Deleting it is a one-field edit on node 90 — your call.
7. **Requirements doc R10** ("exactly N errand records, one per PNR") still describes behavior
   Dynamic hasn't had since v11 — Dynamic already collapses same-(type+action) PNRs into one
   errand. Recommend a CR correcting R10's text rather than changing either tree. Unchanged from
   v3; still wants your sign-off.

## Before this ships

- Re-run the `etg-errand-regression` offline harness. Dynamic nodes 2/12/21/27/32/36/44 are
  untouched, so the skill's trigger rule doesn't strictly require it, but VI's whole hand-off
  depends on that contract.
- One live VI case through the Zendesk sandbox per that skill's live procedure — specifically to
  confirm node 116's dynamic-list select captures into `vi_stg_choice` across loop iterations.
  That's the one mechanism here that the offline harness can't prove.
- Import **both** JSONs — VI's root moved from 78 to 83, so Dynamic's node 76 must be updated in
  the same pass or the hand-off lands on a node that no longer exists.
