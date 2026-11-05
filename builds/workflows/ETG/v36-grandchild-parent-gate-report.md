# v36 — Grandchild-parent bounded resolve gate

**SUPERSEDED by v37** (`v37-grandchild-parent-resolve-chain-report.md`, same day).
v36's mechanism — a counted loop back through nodes 41/40/18/19 up to 10 times —
tripped Zingtree's own platform-level "invalid loop" guard on Brent's first live
import. v37 keeps the same defect fix and the same outcome, restructured as an
unrolled linear chain with no node ever revisited. Read this file for the
defect background (still accurate); read v37's report for the mechanism that
actually shipped.

Date: 2026-08-05 · Author: Claude (Wes) / Brent · Tree: Register Errands - Dynamic (595124299)

## Defect closed

v35's changelog left one item explicitly open: *"node 41's 1 SEC wait racing
Zendesk's async backing ticket - needs a live run to size a real poll."* Brent
reproduced and sized it live on ZD sandbox 335038 (order 1094-337-122, PNRs
9D89VM + AUU84K, Name correction/change):

- Child ticket + side conversation created 04:06:26.543 (side_conversation id
  `31df1159-914c-11f1-9559-52ed60a9921a`, target ticket 335039).
- `get_side_conversation_detail` returned 200 with `targetTicketId` fast enough
  for the SECOND grandchild (AUU84K, confirmed create 04:06:33.312 - ~6.8s
  later, because it only fires after the first grandchild's loop iteration).
- The FIRST grandchild (9D89VM) fires immediately after node 33 and lost the
  race: `attempted_grandchild_ticket_keys` shows it was tried,
  `created_grandchild_ticket_keys` shows it was never confirmed.

v19's single unguarded check (node 36) fell back to the PARENT ticket id and
let node 37 fire anyway on a miss - a best-effort guess, not a gate.

## Mechanism

Two new nodes sit between 40 (Get Side Conversations) and 36 (grandchild loop):

- **18 - Check Child Ticket Backing Ticket Resolved** (Script): resolves
  `targetTicketId` from `actions.get_side_conversation_detail`; on a miss,
  increments a bounded counter (`child_ticket_resolve_attempts`,
  `MAX_ATTEMPTS = 10`, ~10s at node 41's existing 1 SEC wait).
- **19 - Backing Ticket Resolved?** (Scoring router): `resolved == true` -> 36
  (grandchild loop, now proven-safe); `blocked == true` -> 34 (skip this child
  ticket's grandchildren entirely); structural fallback -> 41 (keep polling).

Node 39 resets the poll state per child ticket. Node 36 no longer resolves
`grandchild_parent_id` itself - it reads what 18 already proved. If the bound
is hit, nothing is created and nothing is written to
`attempted_grandchild_ticket_keys` (so a later retry is not blocked by a
phantom "already tried"); instead node 18 writes
`blocked_grandchild_parent_keys` / `blocked_grandchild_ticket_titles`, and node
21 prints those as a distinct **BLOCKED** line in the internal note, kept out
of the existing generic "not confirmed" reconciliation warning.

Reuses the exact continuation-loop idiom nodes 32/36/44 already use for arrays,
repurposed for a wait-and-recheck instead of an array cursor.

## Verification

**Static + regression (etg-errand-regression skill).** The skill's harness
executes real node bodies only for nodes 2, 12, 27, 21 - the mechanism under
test here (nodes 18/19/36/39/40) sits outside what it simulates, so this layer
confirms no regression to the grouping/note contract, not the gate itself:

| Check | Before (v35 export) | After (v36 export) |
|---|---|---|
| `validate_tree.js` | 0 problems, 1 note | 0 problems, 1 note |
| `run_full.js` + `config.assumed.json` | 74 cases, 74 pass | 74 cases, 74 pass |
| `run_full.js` + `config.numericids.json` | 74 cases, 74 pass | 74 cases, 74 pass |

**Graph-walk stress test (`walk.mjs`)** - this one DOES execute the real
continuation graph through nodes 18/19/36/39/40, so it is the layer that
actually exercises the new gate. Two new scenarios added:

| Scenario | Before (v35) | After (v36) |
|---|---|---|
| `grandchild_parent_never_resolves` (bound never clears) | **Both grandchildren created anyway, parented to 334818 (the PARENT ticket, wrong) — reported as fully confirmed, no warning** | 0 grandchildren created; `blocked_grandchild_parent_keys`/`blocked_grandchild_ticket_titles` populated; note prints a distinct BLOCKED line; both titles absent from `attempted_grandchild_ticket_keys` (retry-eligible) |
| `grandchild_parent_resolves_after_retries` (resolves on the 3rd poll) | Same wrong-parent guess as above — v35 has no retry, so any delay at all trips the fallback | Both grandchildren created, correctly parented to 334823 (the real backing ticket) |

Existing scenarios re-run unchanged on the v36 export: `clean` (1 child + 2
grandchildren), `back_at_25` (replay, no duplicates), `additional_request`
(known/open R10-vs-R17 behavior, unchanged - not in scope here),
`gc_first_unconfirmed_then_replay` (v35's dup-guard still holds: only the
confirmed grandchild is recorded, no duplicate on replay).

The before-column for the two new scenarios is the clearest evidence of the
defect this closes: v35 didn't just risk a delayed grandchild, it silently
filed both grandchildren against the wrong parent ticket and reported success.

## Not fixed here (flagged, not addressed)

Whether Connected Object #181 (Get Side Conversations) caches its HTTP
response. If it does, a retry may replay a stale answer instead of a fresh
one, weakening the bound in a slow-Zendesk window longer than the CO's cache
TTL. This can't be confirmed from the tree JSON - check the Data Source cache
setting in the Zingtree admin UI before relying on this in production.

## Nodes touched

5 (claude.md), 10, 18 (new), 19 (new), 21, 29, 36, 39, 40. Also: `walk.mjs`
(two new scenarios + expanded reporting) in this folder.
