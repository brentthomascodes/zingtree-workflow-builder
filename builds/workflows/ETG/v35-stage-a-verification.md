# v35 — Stage A verification

Built from: the v34 re-export Brent uploaded 2026-08-05 (`Register Errands  Dynamic_1785942713931.json`).
Content-identical to `v34 node 27 idempotent` except nodes 3 and 13, whose second branch
had been converted to an `op:def` default — that improvement is preserved.

Output: `Register Errands - Dynamic (v35 replay idempotency 2026-08-05).json` (46 nodes).
**Not imported. Live publish remains Brent's call.**

## Edit list as built

| # | Node | Change |
| :-- | :-- | :-- |
| 1 | 32 | Duplicate guard reads `attempted_child_ticket_keys`, recorded before node 33 fires |
| 2 | 36 | Duplicate guard reads `attempted_grandchild_ticket_keys`, recorded before node 37 fires |
| 3 | 14 | Scope comment only — `created_child_ticket_keys` is now reconciliation input, not the guard |
| 4 | 16 | Scope comment only — same for `created_grandchild_ticket_keys` |
| 5 | 44 | Cursor clamps on entry and resets on exhaustion (house pattern, matches 32/36); `registered_errand_keys` guard on `type|customer_action`; `skip_errand_registration` flag; skip + key added to the log line |
| 6 | **17 (new)** | Scoring node "Errand already registered?" — `skip_errand_registration == true` → 45, `== false` → 43, `advanced_logic_node="1"`, `continuation_node_id="43"`. Lowest unused ID per the numbering rule. Also declared in `predefined_vars`, matching every other flag this tree branches on |
| 7 | 44 | `continuation_node_id` 43 → 17 |
| 8 | 10 | Resets `attempted_child_ticket_keys`, `attempted_grandchild_ticket_keys`, `registered_errand_keys`, `skip_errand_registration` |
| 9 | 29 | Same resets on the Additional / Different Request re-entry |
| 10 | 5 | `claude.md` sections + changelog entry; flagged the pre-existing drift where the intake flow still describes v26's nodes 54/55, which do not exist in this export |

Node 27 was **not** touched — its grouping was never the defect.

## Results

`validate_tree.js` — 0 problems, 1 note (`claude.md` unlinked by design).
Schema lint — every `project_node_id` == `display_order` == key, no bool/int/float node
fields, ASCII clean across all 17 script nodes (the only non-ASCII is the pre-existing
markdown in node 5).

`run_full.js` — **64 cases, 64 pass, 0 fail**, identical to v34 under the corrected
oracle. No regression anywhere in the matrix.

`walk.mjs` graph replay — real Edvin type IDs (1321 / 1320) and real bucket **objects**
(`{id:4,name:"Proceed"}`), so this also exercises node 2's `BUCKET_BY_ID` mapping, which
the assumed config never did:

| Scenario | v34 | v35 |
| :-- | :-- | :-- |
| `clean` | 1 child / 2 gc / 2 errands | 1 / 2 / 2 |
| `back_at_25` | 1 / 2 / **3 errands** (one from `final_pnrs[undefined]`) | 1 / 2 / **2** |
| `gc_first_unconfirmed_then_replay` | 1 / **3 gc** (Y4JU9G twice) / 3 | 1 / **2** / 2 |
| `node41_double_advance` | 1 / 2 / **3 errands** | 1 / 2 / **2** |
| `async_parent_missing` | 2 gc on parent 334818 | unchanged — see below |
| `additional_request` | 2 / 4 / 4 | unchanged — see Q13 |

`gc_first_unconfirmed_only` confirms the reconciliation path still works: the unconfirmed
grandchild is absent from `created_grandchild_ticket_keys` and node 21 prints
*"WARNING - 1 ticket(s) in the summary above were not confirmed created by Zendesk"*.
That was the point of keeping the two lists separate.

## Open, not fixed here

- **Q13 — the Additional Request path still duplicates.** Node 29 clears every guard key
  by design per CR-007/R17, so re-registering the *same* PNR + type + action after
  "Additional Request" produces a second child ticket, second grandchildren and second
  errand. R10 ("restart is idempotent within a ticket") and R17 ("fully reset loop and
  cursor state") cannot both hold. This is plausibly the original 334577 / 334588
  duplicate report and needs your call before anyone codes it.
- **Node 41's 1 SEC wait** races Zendesk materializing the child ticket's backing ticket.
  The duplicate consequence is gone, but a first grandchild can still land on the parent
  ticket via node 36's documented fallback. Sizing a real poll needs a live run — I did
  not want to change a timing field I cannot verify offline.
- **Node 16's response-alias candidates** are still unconfirmed against CO #180. Pin the
  real alias from Execution Insights; until then the node records unchecked and logs a
  warning, which is the safe direction now that the guard no longer depends on it.

## Harness change that must persist

`oracle.js` R4 has been corrected to one silent ticket per distinct (type + action), per
your confirmation and CR-012. Node 5's v33 changelog claims this was already done, but the
copy the skill actually runs still had the consolidated rule — which is why 22 cases were
failing on v33 *and* v34. The corrected file is delivered here; it needs to land in the
skill's `scripts/` (the device copy under `Skill Source/etg-errand-regression/scripts/`
holds only `run_full.js` and `config.numericids.json`, so the two are out of sync).

Also worth knowing: the real Edvin config has **no `escalate` bucket** — only Proceed (4),
No action (3), Different request (5). `config.assumed.json` invents escalate actions, so
those sweep cases test a bucket that cannot occur. Not wrong, just wasted coverage, and
`run_full.js`'s hardcoded action names prevent swapping the real 17-type config in without
generalising them first.

## Stage B

Not run — browser UI testing is attended and offered, never assumed. Recommended before
publish, on a fresh sandbox ticket, exercising: a clean 2-PNR proceed run, then Back on
node 25 + Continue, confirming Zendesk still shows exactly 1 child + 2 grandchildren and
Edvin holds exactly 2 errands.
