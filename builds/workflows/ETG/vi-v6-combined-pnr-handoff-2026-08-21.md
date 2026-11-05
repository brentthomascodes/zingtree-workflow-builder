# VI Dynamic v6 — dropdowns + combined-PNR hand-off (2026-08-21)

Tree: **Register Errands - VI Dynamic (756760393)**
Base: the export Brent supplied on 2026-08-21 (57 nodes, root 48) — the live VI tree, which
is a different lineage from `Register Errands - VI Dynamic (v5 subtree-only 2026-08-20).json`
(that one is the 12-node redesign; field names below are kept compatible with its node 118
hand-off contract).
Parent: **Register Errands - Dynamic (595124299)** — **not modified**.

## What was asked
1. Radio buttons → dropdowns, captured as form-data variables/inputs.
2. After the selection is made, the **combined PNR** values must land on the **final**
   variables `final_pnrs` and `current_pnr`, because the larger dynamic-errands workflow
   handles them.
3. The **bucket selected by the customer action** was not being carried over — (2) should
   address it.

## Edits (16 nodes + tree config)

### 1. Radios → dropdowns
`type: "radio"` → `type: "select"` on every VI screen, same variable names, same option
text, `{"filterable":true}` added, existing `conditional` config preserved:

| Node | Field |
|---|---|
| 48 | `partner` |
| 50, 66 | `disruption_type`, `delay_reason`, `flight_affected` |
| 53, 69 | `stg_alternatives_sameday_sc` |
| 59, 71 | `stg_alternatives_overnight_sc` |
| 62, 73 | `stg_alternatives_sameday_td` |
| 64, 75 | `stg_alternatives_overnight_td` |
| 61 | `stg_refund` |

Two things worth knowing:

- **Every converted dropdown leads with a `- Select -` placeholder.** A radio starts with
  nothing chosen; a select can hand back its first option even when the agent never touched
  it — which would have silently defaulted `partner` to `Booking` and routed the contact
  down the wrong partner's STG rules. `- Select -` matches no logic expression, so an
  unanswered screen falls to the same default branch it did as a radio. Drop it if you
  confirm in sandbox that Zingtree renders its own blank first option for a static select.
- **Node 71's first option had a trailing space** (`"...hotel accomodation "`) while node
  72's logic expression compares without it, so that branch could never match and fell
  through to its default (`button_link 0`, a dead end). Trimmed.

Verified: every value compared in every logic expression in the tree still matches an
option string exactly.

### 2. New node 80 — Set VI Combined PNR (now the tree root, `root_node_id` 48 → 80)
The VI itinerary is one trip, so the PNRs the agent picked on the parent's order grid
(`transforms.selected_pnrs`, set by the parent's node 24 before the jump) collapse into ONE
record:

```
pnr                 "9D89VM, AUU84K"   (joined, de-duped)
pnrs / pnr_count / vi_pnr_count
postSaleHandleType  joined with " / "
providerSystem      joined with " / "
id / providerPnrIds FLAT array of provider booking ids
passengers / formatted_passengers
is_combined_pnr     true
```

Published as `transforms.current_pnr`, `transforms.combined_pnr_record`,
`transforms.combined_pnr`, form data `combined_pnr` / `combined_pnr_count`, and a
`pnr_banner` reading "Combined PNR: …" — so every VI screen that prints
`${transforms.current_pnr.pnr}` now shows the combined PNR instead of nothing. Also clears
the VI selection variables and the per-run accumulators (form data never expires, so a
second contact in the same session was inheriting the previous disruption/STG answers), and
sets `isMorePNR = false` so the collapsed record can never enter the parent's per-PNR loop.

### 3. Node 2 — the actual bucket fix
- **Bucket by Edvin ID, not label.** Edvin returns `bucket` as `{id, name}` where `name` is a
  human label. The old code took the label, so only `"Proceed"` happened to lowercase into a
  key the tree routes on; `"No action"` and `"Different request"` reached the parent as
  labels, and anything else as blank. Node 2 now uses the parent tree's verified block —
  `BUCKET_BY_ID {3: no_action, 4: proceed, 5: different_request}`, name map as fallback,
  unmapped returned unchanged and never guessed — and carries `bucketId` alongside.
- **VI answers captured** into `vi_details` / `vi_details_text`, stored on the record and
  folded into the record's `notes`, which is the field the parent already prints in the
  internal note (its node 21, "Notes") and in the Edvin errand free text (its node 44,
  "Agent Notes"). No parent-side change needed for them to appear in both.
- **Guard + log** when `transforms.category` / `transforms.channel` are missing instead of
  throwing an untraceable script error (see Open risks).
- `notes` read through `ZT.getVariableValue` rather than as a bare variable; the dead
  `CONTACT_REASON_BY_ZENDESK` map (it read a Zendesk field this path never sets and its
  result was never used) removed.

### 4. Node 27 — resolve the selection, keep the grouping contract
Grouping, child/silent/grandchild construction and the summary note are **byte-identical**
apart from these:
- Resolver matches `actionId`, then `id`, then `name`, so a value submitted by either the
  current name-valued render or a future ID-valued one resolves.
- `bucketId` carried onto the stitched record, the child/silent ticket and the grandchild.
- `customer_action` stores the resolved action **name** (not the raw submitted value).
- Every row logs `field name → raw value → resolved action → bucket`, so one sandbox run in
  Execution Insights tells you whether the selection reached the script at all.
- `unresolved_selections` + `has_unresolved_selections` / `unresolved_selections_count`
  recorded when a selection can't be turned into an (action, known bucket) pair.
  **Diagnostics only** — see Open risks.

### 5. New node 81 — Set VI Finals (combined PNR); node 27 continuation 79 → 81
The hand-off the request was really about:

```
transforms.final_pnrs   = [ combined record ]     -> parent node 44, one Edvin errand
transforms.current_pnr  =   combined record       -> parent nodes 44/43 + content nodes
transforms.customer_action_pnrs = [ combined record ]  -> parent node 21 internal note
transforms.final_pnrs_count = 0, isMorePNR = false
form data: combined_pnr, customer_action, customer_action_id,
           bucket, bucket_id, errand_type, stg_outcome
```

`type` is deliberately **not** overwritten — it holds the Edvin type ID node 1's select and
node 2's lookup depend on; the type name goes out as `errand_type`. `providerBookingIds` is
built here as `JSON.stringify` of the flat id array, because the parent's node 27 builds it
as `JSON.stringify(group.map(i => i.id))`, which nests on a collapsed record whose `id` is
already an array. VI answers are also flattened onto the record (`partner`,
`disruption_type`, `delay_reason`, `flight_affected`, `stg_outcome`).

### 6. Tree config
`keep_vars_on_back` **0 → 1**. At 0, any Back navigation through the VI screens discarded
captured values — an independent way to lose the customer action and its bucket. The parent
tree hit exactly this and fixed it the same way (its v26).

### 7. claude.md node (node 5)
Rewritten for **this** tree — it was a stale copy of the parent's, describing tree 139367450.
Now carries the real VI flow map, the data dictionary, the hand-off contract, the
conventions and this changelog entry.

## Verification
- **Offline replay** (`vi-v6-harness.mjs`): runs the tree's real node 80 → 2 → 12 → 27 → 81
  code against a mock Edvin config shaped like the live one (bucket as `{id, name}` with
  human labels), for six scenarios.

  | Scenario | bucket / bucketId | Ticket | final_pnrs |
  |---|---|---|---|
  | proceed action, 2 PNRs | `proceed` / 4 | `Child Ticket: 9D89VM, AUU84K` | 1 |
  | "No action" label | `no_action` / 3 | `Silent Ticket: 9D89VM, AUU84K` | 1 |
  | "Different request" label | `different_request` / 5 | `Silent Ticket: …` | 1 |
  | Edvin sends a blank bucket | `""` / null, flagged `bucket_missing` | Silent | 1 |
  | nothing selected | `""` / null, flagged `selection_unreadable` | Silent | 1 |
  | single PNR | `proceed` / 4 | `Child Ticket: 9D89VM` | 1 |

  In every case node 12's rendered field name (`customer_action_9D89VM__AUU84K_0`) matches
  what node 27 reads back, and node 81 publishes one `final_pnrs` entry plus the scalars.
- **Structural**: no dangling button/continuation targets, exactly one `is_root` and it
  matches `root_node_id`, the VI path is reachable end to end (80 → … → 27 → 81 → 79).
- **House lint** (`vi-v1-lint.py`): 70 problems — **identical to the baseline count on the
  input export**, so nothing new was introduced. All 70 are pre-existing: empty `node_name`
  across the inherited nodes, `display_order` drift on nodes 62-79, and the 27 unreachable
  clone nodes the parent tree owns.

## Open risks (not changed, by request or by scope)
1. **Node 12 still emits a `<style>` block, CSS classes and `data-*` attributes.** The parent
   tree removed all three at v30 because the org's anti-injection sanitizer drops markup
   after a `<style>` block — which made the whole action table, and every selection it
   captured, disappear. If the bucket still arrives blank after this version, that is the
   first thing to check: node 27 now logs the raw value it read for each row, so one run
   tells you whether the select posted anything at all. The port is ~20 lines (inline styles
   only, action IDs as option values); node 27 already accepts IDs, so it needs no further
   change.
2. **`transforms.category` / `transforms.channel` are produced by the parent's node 46, but
   the parent's node 75 opens this subtree from node 24 — before its nodes 42/46 run.** Node 2
   now logs a clear message instead of throwing, but the real fix is on the parent side:
   either move the VI branch to after node 46, or fetch the errand configuration inside this
   tree. (The v5 design solved this by returning to the parent's node 42 instead of node 3.)
3. **No unresolved-selection guard.** The parent halts a run it can't resolve (its nodes
   50/51: re-pick, or escalate recording nothing). Here node 27 only flags and logs, so an
   unreadable selection still becomes a silent ticket. Porting the guard also needs a route
   away from the parent's node 44, which throws on an empty `final_pnrs`.
4. **Passengers.** The parent's passenger screen is skipped on the VI path, so the combined
   record carries only whatever passenger fields the order rows include. If ETG wants named
   passengers on a VI errand, add a passenger Dynamic View before node 1.

## Next step
Import into sandbox, run one VI ticket, and check in Execution Insights that node 27 logs a
non-empty raw selection and node 81 logs `bucket=…` / `bucket_id=…`. Then run the
`etg-errand-regression` harness before calling it done — nodes 2, 12 and 27 are exactly the
nodes that contract keeps breaking.
