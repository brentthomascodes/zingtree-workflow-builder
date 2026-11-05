# VI Dynamic v7 — rebased onto the 2026-08-21 export (2026-08-21)

Tree: **Register Errands - VI Dynamic (756760393)**
Base: the export Brent supplied 2026-08-21 20:21 (33 nodes, root 48).
Supersedes: v6, which was built on the 2026-08-20 23:15 export.
Parent: **Register Errands - Dynamic (595124299)** — **not modified**.

## What changed in the base, and what that means for the fixes

Brent's newer export moved three things forward, and v7 keeps all of them:

| New in the base | v7 treatment |
|---|---|
| **80 Get Errand Configurations** (Data, CO 182 + 183) → **81 Format Types**, with every STG ladder exit now pointing at 80 | Kept as the design. This closes v6's open risk #2 — the tree no longer depends on the parent's node 46 for `transforms.category`, so that guard is no longer load-bearing. |
| **82** partner / order-date route script, feeding node 49 through a `route` scalar | Kept, hardened (below). Node 49's old two-condition `partner` branching is gone. |
| The 27 inherited clone nodes (3, 4, 6-9, 21-24, 29, 31-45, 47, 77) **deleted** | Kept deleted. v7 adds nothing back; the only unlinked node is 5 (claude.md). |
| Node 81 already carries the parent's **ID-first bucket mapping** | Made it the *only* copy — see node 2. |

Because Brent's new nodes took ids 80, 81 and 82, v6's two new nodes were renumbered:
**80 → 83** (combined PNR, root) and **81 → 84** (finals).

## Edits

### 1. Radios → dropdowns (unchanged from v6)
`type: "radio"` → `"select"` on 48 (`partner`), 50 / 66 (`disruption_type`, `delay_reason`,
`flight_affected`), 53 / 69 (`stg_alternatives_sameday_sc`), 59 / 71
(`stg_alternatives_overnight_sc`), 62 / 73 (`stg_alternatives_sameday_td`), 64 / 75
(`stg_alternatives_overnight_td`), 61 (`stg_refund`). Same variable names, same option text,
`{"filterable":true}`, existing `conditional` config preserved. Each leads with a
`- Select -` placeholder so an untouched dropdown cannot post its first option and silently
default `partner` to "Booking". Node 71's trailing-space option trimmed — node 72 could never
match it, so that branch dead-ended.

### 2. New node 83 — Set VI Combined PNR (new root; `root_node_id` 48 → 83)
Collapses `transforms.selected_pnrs` (set by the parent's node 24 before the jump) into one
record: `pnr` joined and de-duped, `postSaleHandleType` / `providerSystem` joined with " / ",
`id` + `providerPnrIds` as a flat array, `vi_pnr_count`, merged passengers. Published as
`transforms.current_pnr` / `combined_pnr_record` / `combined_pnr` plus form data, with a
`pnr_banner` reading "Combined PNR: …". Clears the VI selection variables — now including
`orderCreated` and `route` — and the per-run accumulators, and sets `isMorePNR = false`.

### 3. Node 2 — one producer of bucket routing keys
This is the bucket fix, and the newer base makes it cleaner than v6's version. Node 81
already normalizes every action in the category (bucket → routing key, `bucketId`,
`actionId`) and groups them by type id — but node 2 still kept its **own** label-only
`bucketKey()`, which is why only "Proceed" survived the round trip and every other bucket
reached node 27 unusable. Node 2 now **reads `transforms.actions_by_type[type_id]`** instead
of re-mapping the raw API objects. The same ID-first block stays in node 2 only as a fallback
for a session where node 81 has not run, and it logs when it uses it.

Also: VI/STG answers captured into `vi_details` / `vi_details_text` and folded into the
record's `notes` (which the parent already prints in the internal note and the Edvin errand
free text — no parent-side change); combined-PNR upsert; `notes` read via
`getVariableValue`; the dead `CONTACT_REASON_BY_ZENDESK` block removed (it read
`custom_field_29658558478738`, which this path never sets, and its result was never used —
node 81 owns the real mapping off `custom_field_29559177650834`).

### 4. Node 27 — resolve the selection, keep the grouping contract (unchanged from v6)
Grouping, child/silent/grandchild construction and the summary note are byte-identical apart
from: resolver matches `actionId` → `id` → `name`; `bucketId` carried onto the record, the
child/silent ticket and the grandchild; `customer_action` stores the resolved action name;
every row logs `field → raw value → action → bucket`; `unresolved_selections` +
`has_unresolved_selections` / `unresolved_selections_count` recorded (diagnostics only).

### 5. New node 84 — Set VI Finals; node 27 continuation 79 → 84
```
transforms.final_pnrs  = [ combined record ]   -> parent node 44, one Edvin errand
transforms.current_pnr =   combined record     -> parent nodes 44/43 + content nodes
transforms.customer_action_pnrs = [ combined record ]  -> parent node 21 internal note
transforms.final_pnrs_count = 0, isMorePNR = false
form data: combined_pnr, customer_action, customer_action_id, bucket, bucket_id,
           errand_type, stg_outcome, stg_trail
```
`type` is deliberately not overwritten (it holds the Edvin type ID node 1 and node 2 depend
on); the type name goes out as `errand_type`. Two corrections found while testing v7:

- **`providerBookingIds` is built from the first source that has ids**, not a concatenation
  of `providerPnrIds` + `id` + baseline — they all hold the same ids, so concatenating
  tripled the list. Built flat and de-duped, because the parent's node 27 builds it as
  `JSON.stringify(group.map(i => i.id))`, which nests on a collapsed record.
- **`stg_outcome` is the LAST rung that named a real offer**, not the first answer found.
  The ladder is walked top-down and each rung the agent can't fill answers "None of the above
  is available", so first-answer-wins reported a decline for a case that ended in a refund.
  All declines still yields "None of the above is available". `stg_trail` keeps every answer
  in ladder order.

### 6. Node 82 — hardened route script
- **Date-only, timezone-free compare.** `new Date('2026-05-21T00:00:00')` parses as *local*
  midnight while Edvin's `orderCreated` is an ISO timestamp, so a late-20-May order could
  fall either side depending on where the engine runs. Node 82 compares `YYYY-MM-DD` prefixes
  as strings. Boundary unchanged: an order created **on** 2026-05-21 routes to node 66 — but
  node 50 is titled "prior 21May26" and 66 "post 22may2026", so the 21st itself is described
  by neither. **Worth confirming with ETG.**
- **Two sources for the order date.** Node 48 carries an `orderCreated` date field and the
  Edvin lookup carries the real value. The agent's entry wins, then the API; when neither is
  readable the route falls back to "66" and the log says so, instead of
  `new Date(undefined)` silently comparing false.
- Bare `partner` reference replaced with `ZT.getVariableValue` (patterns.md rule).

### 7. Node 81 — two guards
- **`bucketKey()` no longer throws on a null bucket.** It dereferenced `b.id` with no guard,
  so a single Edvin action with a missing bucket would take down the whole Format Types node
  — and with it the VI flow. It now returns `""`, which node 27 flags as `bucket_missing`,
  the correct outcome. **The same one-line hole is still in the parent tree's nodes 2 and 46**
  — worth fixing there next time they're touched. (The harness caught this: one mock action
  with `bucket: null` crashed node 81 on the first run.)
- Before throwing on "no category match", it now logs the Zendesk value, the resolved name
  and **every category Edvin actually offered**, and documents the known gap below.

### 8. Tree config
- `keep_vars_on_back` **0 → 1** — at 0, any Back navigation through the VI screens discarded
  captured values, an independent way to lose the customer action and its bucket.
- **Stale persistent button cleared.** `persist_names` / `persist_node_ids` still pointed at
  node 29 (Clear Data), which this export deleted.

### 9. claude.md node (node 5)
Rewritten for this tree — it was still a copy of the parent's, describing tree 139367450.
Now documents the real v7 flow (including 80/81/82), the data dictionary, the hand-off
contract, the conventions and the changelog.

## Verification
- **Offline replay** (`vi-v7-harness.mjs`) runs the tree's real code for the **whole** path —
  83 → 82 → the actual logic nodes from 49 to 80 → 81 → 2 → 12 → 27 → 84 — against a mock
  Edvin config shaped like the live one (bucket as `{id, name}` with human labels, plus one
  action with a null bucket). 8 scenarios, all checks pass:

  | Scenario | Route walked | Result |
  |---|---|---|
  | ETG, order after cutoff, SC direct, offer accepted | 49→66→67→69→70→80 | `proceed`/4, 1 child ticket, 1 final_pnr |
  | Booking partner | 49→**50**→52→53→58→80 | `no_action`/3, 1 silent ticket |
  | ETG, API order date before cutoff | 49→**50**→52→53→58→80 | `different_request`/5, 1 silent ticket |
  | agent-entered date overrides the API date | 49→**50**→52→53→58→80 | route 50 from `2026-01-15` |
  | trip-delay ladder, all offers declined → refund | 49→66→67→73→74→75→76→61→80 | `stg_outcome` = "Last resort" |
  | nothing selected on the action table | — | flagged `selection_unreadable`, silent ticket |
  | single PNR | — | field `customer_action_9D89VM_0`, 1 final_pnr |
  | untouched dropdowns (placeholder posted) | — | route "66", never a silent "Booking" |

  Every case asserts: node 12's rendered field name matches what node 27 reads back;
  `final_pnrs` has exactly one entry whose `pnr` is the combined PNR; `current_pnr` is the
  same record; `bucket` / `bucket_id` reach form data; `type` is untouched;
  `providerBookingIds` is flat.
- **Structural**: no dangling button/continuation targets; exactly one `is_root` and it
  matches `root_node_id`; everything reachable from the root except node 5 (claude.md);
  every value compared in every logic expression still matches an option string exactly.
- **House lint** (`vi-v1-lint.py`): **49 problems vs 50 on the input export** — one fewer
  (node 82 now has a `node_name`), nothing new introduced. The rest are pre-existing: empty
  `node_name` on the inherited nodes and `display_order` drift on 62-79.

## Open items
1. **The bare contact reason still crashes node 81.** The parent's node 75 routes
   `contact_reason_sc__self_transfer_guarantee_vi` (the parent value) into this tree, but
   `CONTACT_REASON_BY_ZENDESK` only maps the two leaf values (`_vi_sc`,
   `_vi_passengers_at_the_airport`), so that contact throws. Node 81 now logs exactly what
   Edvin offered, but the mapping is a business decision — which leaf does the bare value
   mean, or should the parent stop routing it? Not guessed here.
2. **Node 12's action table still uses a `<style>` block, CSS classes and `data-*`
   attributes** (left as-is by request). The parent tree removed all three at v30 because the
   anti-injection sanitizer drops markup after `<style>`, which made the table and every
   selection it captured vanish. If the bucket still arrives blank, check this first — node
   27 now logs the raw value per row.
3. **No unresolved-selection guard.** Node 27 flags and logs; it does not halt. Porting the
   parent's re-pick/escalate screens also needs a route away from the parent's node 44, which
   throws on an empty `final_pnrs`.
4. **Passengers.** The parent's passenger screen is skipped on the VI path, so the combined
   record carries only whatever passenger fields the order rows include.
5. **Node 1's `type` select still carries 17 hardcoded Cancellation labels** and their
   `actions_array_name` scores underneath the dynamic list source — dead weight for VI, and
   what an agent sees if the dynamic list fails to load.
6. **The 21 May boundary** (see node 82 above).

## Next step
Import into sandbox, run one VI ticket, and confirm in Execution Insights that node 82 logs
the resolved date and route, node 81 logs the category it matched, node 27 logs a non-empty
raw selection, and node 84 logs `bucket=…` / `bucket_id=…`. Then run the
`etg-errand-regression` harness before calling it done — nodes 2, 12 and 27 are exactly the
nodes that contract keeps breaking.
