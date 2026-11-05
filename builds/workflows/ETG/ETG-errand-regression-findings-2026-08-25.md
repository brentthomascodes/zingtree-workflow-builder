# ETG dynamic-errand regression — findings, 2026-08-25

**Skill used:** your updated `etg-errand-regression` source (Zingtree Builder/Skill Source/etg-errand-regression on your Mac) — merged its updated `oracle.js`, `run_full.js`, and `config.numericids.json` with the unchanged `engine.js`/`validate_tree.js`/`config.assumed.json`.

**Tree tested:** `Register Errands - Dynamic (PRODUCTION, 2026-08-24).json` (your most recent export in that line), cross-checked against the prior export (`... fixed 2026-08-24 - node27 simplify + node36 fix.json`) to isolate what that edit changed.

**Result: 74/74 cases fail on both tree versions, against both `config.assumed.json` and `config.numericids.json`.** Identical failure set on both tree versions — nothing in the "node27 simplify + node36 fix" edit introduced or fixed anything the harness can see. The two most important issues below are already flagged as open in the tree's own `claude.md`; the harness confirms they still reproduce and quantifies exactly which cases hit them. One issue (the unvalidated bucket string) is not called out in `claude.md` and is the most severe finding here.

## 1. CRITICAL — an unrecognized (but non-empty) bucket value is never validated, and silently writes a false outcome

Case `bucket is a string nobody routes on ('pending')`: expected an invalid run (0/0/0/0, nothing recorded). Actual: **1 silent ticket + 1 Edvin errand created**, both attributing the PNR "did not proceed" — a fact that isn't true, it's an integration returning something the tree doesn't recognize.

Root cause, read straight from the export: node 2's `bucketKey()` matches a bucket by id or by a known name, and if neither matches, **returns the raw string unchanged** (`node2.js` — `bucketKey()`, last line). Node 27 then only checks truthiness (`if (!selectedAction || !selectedAction.bucket) { unresolved... }`) — never checks the value against the four known routing keys. Any non-empty, non-matching bucket string sails through as if it were a legitimate value, and `isProceed()` treats "not proceed" as "customer declined," which becomes a silent ticket and an Edvin errand.

This contradicts `claude.md`'s own description of the design ("An unmapped bucket is returned UNCHANGED, never guessed — node 27 then flags it and stops the run") — the flagging step doesn't actually exist in this export's node 27. Doc and code disagree here the same way they already disagree on the two items below; this one just hadn't been written down yet.

**Why this is the highest-severity finding in the run:** per the skill's own rule, a `valid_run=no` row that actually wrote something is the worst class of failure — it's a wrong fact recorded against a customer's order. This is one of five such rows (see below); it's the only one that *writes something false* rather than just dropping a PNR.

## 2. CRITICAL, already open in claude.md — the v24 unresolved-selection guard isn't wired into this export

`validate_tree.js` confirms: no node 50, no node 51. Node 27 still computes and sets `has_unresolved_selections`, but its `continuation_node_id` points straight at node 3 — nothing in the whole tree ever reads that flag to route anywhere. `claude.md` already documents this as an open, critical item (found 2026-08-21).

Practical effect, confirmed by 5 harness cases where the run should have been fully invalid (0/0/0/0) but instead produced tickets/errands for the *other*, resolvable PNR in the batch:

| Case | Scenario | Actual (child/grandchild/silent/errands) |
|---|---|---|
| C054 | One selection posted, one lost | 1/0/0/1 |
| C056 | Stale submit: action id from another type | 1/0/0/1 |
| C058 | Bucket arrives in a shape nothing can read | 1/0/0/1 |
| C059 | Bucket is a string nobody routes on ('pending') | 1/0/1/2 *(see #1 — this one also fabricates a false record)* |
| C073 | One selection lost, still not posted on the re-pick | 1/0/0/1 |

Two more cases (C053, C074 — *both* PNRs unresolved) happen to land on the "right" counts (0/0/0/0) by coincidence — every PNR gets dropped, so there's nothing to write — but the guard still isn't actually blocking the run the way v24 intended; the harness flags them on that invariant, not on a count mismatch.

## 3. HIGH — a PNR that fails to resolve once is gone for good, not just missing its dropdown options

This is a variant of `known-defects.md` #4 ("node 27 destroys state it needs to run twice," supposedly fixed in v30) that's still live in a different form here. Node 27 ends every run with `ZT.setTransformData("customer_action_pnrs", resolved_pnrs)` — it overwrites the whole working list with *only* the PNRs that resolved. A PNR that didn't resolve isn't just missing `actions_array` (the v30 defect) — it's removed from the list entirely.

Harness case "One selection lost, then the agent re-picks it on the node 51 → 12 round trip": pass 1 resolves PNR 9D89VM, loses AUU84K; pass 2 the agent picks AUU84K's action too. Expected: both PNRs recorded (1 child/2 grandchild/0 silent/2 errands). Actual: **1/0/0/1 — AUU84K never appears anywhere**, including the internal note. Because node 27 already dropped it from `customer_action_pnrs` on pass 1, there's no record left for a re-pick to attach to, and (per finding #2) there's no node 50/51 to send the agent back to a dedicated re-pick screen in the first place — the only path back is Back-nav to node 25, which re-renders from the now-truncated list.

## 4. MEDIUM, already open in claude.md — internal note has no per-PNR bucket row

Node 21 in this export has no `SHOW_ACTION_BUCKET` flag, no `BUCKET_LABELS` map, and no `bucket` field in `PNR_FIELDS` — confirmed by reading node 21 directly. `claude.md` documents this as open (found 2026-08-21): the flag was supposedly reinstated in v23, removed again since, doc and export disagree. Affects 67 of 74 cases (every case with a valid, resolved PNR) — low risk since it's display-only and Olga's team said it's internal-only anyway, but worth closing one way or the other so the doc stops contradicting the export.

## 5. MEDIUM, not previously documented — node 21 has no reconciliation against actual ticket creation

`claude.md`'s data dictionary describes node 21 comparing `created_child_ticket_keys`/`created_grandchild_ticket_keys` against `planned_ticket_titles` and warning when a promised ticket was never confirmed (the fix for the ZD 334468 "summary written before tickets exist" class of bug, `known-defects.md` #4/#5). Reading node 21's actual code: **that comparison doesn't exist**. It prints `child_tickets_note` (built in node 27, before any create call fires) with no cross-check at all. Case "Child-ticket create fails at Zendesk" confirms it: the note reports the ticket as created with no warning. This is the same underlying risk `known-defects.md` already calls the second-most-dangerous class (a note that promises something that isn't true) — it just isn't caught by anything in this export.

## Structural findings (`validate_tree.js`)

- Node 32 and node 36 each contain one non-ASCII character (a "·" middot) — flagged because Zingtree script bodies are expected to be ASCII-only.
- Node 75's logic expression is compound (`... || ...`) — per the tree's own conventions this should be computed in a script instead of inline in a logic node's expression.

## Live sandbox sweep — blocked, not a workflow finding

You confirmed ticket 8837843 on `etraveligroup.zendesk.com` (not the documented sandbox subdomain) as approved for this testing. I opened it and the Zingtree panel loaded normally (showing the prior test errands already on the ticket), but **no click registered inside the Zingtree app's iframe** — not "Submit Order Reference," not "Restart," not the panel's own refresh icon — across repeated attempts and a full page reload. The browser console showed an extension-level error tied to that iframe (`MutationObserver` failing to attach to it), which is consistent with clicks not reaching the iframe's content at all. This is a browser-automation tooling limitation on my end, not something to log as a tree defect. I stopped rather than keep retrying the same failing action — happy to try again, or you may find it faster to click through a couple of the higher-value permutations yourself (particularly re-testing finding #1 and #3 live, since both are cheap to hit) and tell me what the internal note says.

## Suggested priority

1. Add bucket validation against `KNOWN_BUCKETS` in node 27 (or node 2) so an unrecognized string is treated the same as a blank one — finding #1 is actively writing false records right now.
2. Re-wire the node 50/51 guard (or decide it's being retired and rewrite `claude.md` to match) — finding #2.
3. Stop node 27 from removing unresolved PNRs from `customer_action_pnrs` entirely — finding #3.
4. Decide on the bucket row and the reconciliation warning (findings #4/#5) and make the doc and the export agree either way.

Full per-case data: `results-PRODUCTION-assumed.csv` / `results-PRODUCTION-numericids.csv` (identical outcomes) and their matching `summary-*.md` files, attached.
