# v38 — Grandchild-parent: reverted to single-check (no retry chain)

**SUPERSEDED by v38.1** (`v38.1-import-fix-report.md`, same day) — this exact file
**failed to import** into Zingtree (a `predefined_vars` key gap the offline
validator doesn't check for; the design/logic below is unaffected and unchanged).
Read this file for the revert design (still accurate); use v38.1's file to import.

Date: 2026-08-05 · Author: Claude (Wes) / Brent · Tree: Register Errands - Dynamic (595124299)

## What changed and why

Brent confirmed v37's unroll fixed the "invalid loop" engine error (retested fresh,
error gone — no further diagnosis needed there). But his call on the underlying
design, after reviewing v37 live, was that a separate multi-node check/router/poll
apparatus is more machinery than this problem is worth, even structured as a
non-looping chain. His framing: create the child ticket, check its own status code,
proceed straight to grandchildren — no separate gate, no attempted/blocked
bookkeeping layered in between.

v38 reverts nodes 36/39/40/41 to the **exact shape that existed before v36** —
confirmed against the tree's very first export (2026-07-27): one wait (node 41,
`escalate_after` back to 1 SEC), one fetch (node 40), one inline resolve (node 36).
This wait-then-resolve pattern is original architecture, not something recent
hardening invented — it's been there since day one.

**The one thing kept, at Brent's explicit direction:** on a miss, node 36 now
**skips** that grandchild (no create, not marked attempted) and records it as
BLOCKED for node 21's note — instead of the pre-v36 behavior of falling back to a
**guessed** parent ticket id and creating anyway. That guess-and-create behavior is
the actual defect this whole effort started from (ZD 334468, 335038). Skipping
instead of guessing costs nothing extra — no added wait, no added node — so there
was no reason to give it up along with the rest of the machinery.

**Left untouched, per Brent's explicit instruction:** the duplicate-ticket
idempotency guard (nodes 13/14/15/16, `attempted_*`/`created_*` keys). That's
unrelated to this race — it protects against the separately-reported ZD 334818
duplicate-grandchild bug — and he did not ask for it to change.

## The tradeoff, plainly

This **consciously re-accepts** the small residual wrong-parent race risk that the
requirements doc already flagged as a tolerated, known-open item before v36/v37
existed:

> "node 41's 1 SEC wait racing Zendesk's async backing-ticket creation... sizing a
> real poll needs a live run."

Brent's decision, given how much machinery fully closing it turned out to need. If
the race recurs in practice, the honest next options are (a) a real live timing
measurement to justify a longer single wait, or (b) relaxing the requirement that
grandchildren nest under the child's own ticket (R5/AC-5.2 in the requirements doc)
so there's no second ticket id to resolve at all — not another layer of gate nodes.

**One structural note worth being precise about, found while updating the test
harness:** node 40 (Get Side Conversations) fetches **once per child ticket**,
before the grandchild loop starts — node 38's "more grandchildren?" loops directly
back to node 36, never back through 39/41/40 (true since before v36, unchanged by
this revert). So the resolve outcome is shared by every grandchild under one child
ticket: either that one fetch resolves the target ticket id and all of that child's
grandchildren get created against it, or it doesn't and all of them are blocked
together. The real ZD 335038 timeline (first grandchild lost, second succeeded ~7s
later) most likely reflects the **create call** (node 37) itself hitting a
later-stage Zendesk readiness issue after a successfully resolved parent id — not a
GET failure this check would catch. That failure mode is unrelated to what node 36
checks, and is exactly what the existing, untouched `attempted_*`/`created_*`
reconciliation in node 21 already surfaces as "not confirmed."

## Diff summary

| | Before (v37) | After (v38) |
|---|---|---|
| Node count | 56 | 46 |
| Nodes removed | — | 18, 19, 20, 26, 28, 30, 31, 54, 55, 56 (10 nodes) |
| Nodes changed | — | 10 (Set Side Conversation Parent Id — reverted to original), 15 (Skip grandchild create? — router simplified), 21 (unchanged, already correct), 29, 36 (Loop Grand Child Tickets — single-check + block instead of guess), 39 (reverted), 40 (continuation reverted to 36), 41 (`escalate_after` reverted to 1 SEC) |
| `predefined_vars` | +2 (`grandchild_parent_resolved`, `grandchild_parent_blocked`) | `grandchild_parent_resolved` dropped (unused); `should_skip_grandchild_create` added (node 36's combined routing flag, so node 15's router tests one script-set boolean instead of a compound expression) |
| Retry/poll mechanism | 3-attempt unrolled chain | None — single check |
| On a miss | Skip + BLOCKED note line | Same — skip + BLOCKED note line (kept) |
| Duplicate-ticket guard (13/14/15/16) | Unchanged | Unchanged (explicitly out of scope) |

## Verification

| Check | v37 | v38 |
|---|---|---|
| `validate_tree.js` | 0 problems, 1 note | 0 problems, 1 note |
| `run_full.js` + `config.assumed.json` | 74 cases, 74 pass | 74 cases, 74 pass |
| `run_full.js` + `config.numericids.json` | 74 cases, 74 pass | 74 cases, 74 pass |

(This harness executes real bodies only for nodes 2/12/27/21 — unaffected by this
change other than node 21's already-correct BLOCKED logic, so identical results
are expected and confirmed.)

**`walk.mjs`** (executes the real continuation graph, so it's the layer that
actually exercises nodes 15/36/39/40/41):

| Scenario | Result |
|---|---|
| `clean` | 1 child + 2 grandchildren, correct parent — unchanged from v35/v36/v37 |
| `back_at_25` (replay) | No duplicates — dup-guard (untouched) still holds |
| `gc_first_unconfirmed_then_replay` | Only the confirmed grandchild recorded after replay — unchanged |
| `additional_request` | Same known/open R10-vs-R17 behavior — unrelated, unaffected |
| `grandchild_parent_never_resolves` | 0 grandchildren created; both titles BLOCKED in the note; neither in `attempted_grandchild_ticket_keys` (retry-eligible) — same outcome as v36/v37, now produced by a single check instead of a bounded retry |

`grandchild_parent_resolves_after_retries` (v36/v37's "succeeds on a later attempt"
scenario) was **removed** from `walk.mjs`, not reworked — it depended on v37's
separate per-attempt fetch nodes (26/54), which no longer exist, and there's no
per-grandchild retry left to test given node 40 only fetches once per child ticket.

## Nodes touched

5 (claude.md), 10, 15, 21 (unchanged content, confirmed still correct), 29, 36, 39,
40, 41. Removed: 18, 19, 20, 26, 28, 30, 31, 54, 55, 56. Also: `walk.mjs` (scenario
updated/removed to match) in this folder.

## File

`Register Errands - Dynamic (v38 reverted to single-check resolve, no retry chain 2026-08-05).json`
— new file, v37 export untouched.
