# v37 — Grandchild-parent resolve chain (unrolled, fixes Zingtree's invalid-loop guard)

**SUPERSEDED by v38** (`v38-grandchild-parent-single-check-revert-report.md`, same
day). v37's loop-guard fix was confirmed working live (Brent retested fresh, error
gone) — but Brent's subsequent call, after reviewing v37, was that the whole
multi-node check/router/poll apparatus was more machinery than the problem is
worth, even as a non-looping chain. v38 reverts nodes 36/39/40/41 to the original
pre-v36 single-check shape, keeping only the "block instead of guess" improvement.
Read this file for the loop-guard diagnosis (still accurate); read v38's report for
what actually shipped.

Date: 2026-08-05 · Author: Claude (Wes) / Brent · Tree: Register Errands - Dynamic (595124299)

## What broke in v36

Brent imported v36 into the Zingtree author tool and ran it live. On the very
first Continue click past "Display PNR Action Table," the tool paused with:

> Workflow execution paused — The last action triggered an invalid loop.

Nothing between node 27 (Stitch & Group) and the child/grandchild create loop is
a real rendered screen with a button — it is all Script/Data/Scoring nodes and
one no-button Content interstitial (node 41), so the whole chain runs as one
continuous auto-advance as far as the agent can see, and the last screen still
on display was node 25. That is consistent with the guard tripping somewhere
deep in that chain, not on node 25 itself.

**Root cause:** v36 gated grandchild creation with a *counted* loop back through
the same four nodes — `41 (wait) -> 40 (fetch) -> 18 (check) -> 19 (router) ->
41` on a miss — up to `MAX_ATTEMPTS = 10` times. Zingtree's own execution engine
apparently flags repeated re-entry into the same node (or a short node cycle)
within a session past some threshold, independent of whether the script's own
counter logic is correct. The offline harness cannot see this at all — it
executes node bodies in a sandbox and never models Zingtree's own engine-level
loop guard — so this only ever surfaces on a real import, which is exactly what
happened.

Notably, the *existing* array-cursor loops in this tree (nodes 32/36/44) are
structurally cycles too, but they never approach whatever threshold trips the
guard, because their iteration count is bounded by real, small data (rarely
more than 2–3 child tickets, grandchildren, or errands in practice). v36's
10-iteration wait loop had no such natural ceiling — it revisited the same 4
nodes far more times, in a tight burst, purely to wait.

## The fix: unroll instead of loop

v37 keeps the identical intent — node 37 cannot fire until the child ticket's
backing ticket is proven, and if it never resolves, the run must not silently
proceed and must not silently record a false attempt — but replaces the counted
loop with a straight-line chain of **distinct nodes, one set per attempt, three
attempts total, no node ever revisited**:

```
39 (reset resolve-chain flags)
  -> 41 wait -> 40 fetch -> 18 check (1/3) -> 19 router
       resolved==true  -> 36 (grandchild loop)
       resolved==false -> 20
  -> 20 wait -> 26 fetch -> 28 check (2/3) -> 30 router
       resolved==true  -> 36
       resolved==false -> 31
  -> 31 wait -> 54 fetch -> 55 check (3/3, FINAL) -> 56 router
       resolved==true      -> 36
       grandchild_parent_blocked==true -> 34 (skip this child ticket's
                                              grandchildren entirely)
```

Node 55 is the only place `grandchild_parent_blocked` gets set (all 3 attempts
came up empty) — same BLOCKED bookkeeping as v36 (`blocked_grandchild_parent_keys`,
`blocked_grandchild_ticket_titles`), read by node 21 into the same distinct
BLOCKED note line, kept separate from the generic "not confirmed" warning.

Each wait node's `escalate_after` went from v19/v36's 1 SEC to 4 SEC, so the
cumulative bound across 3 attempts (~12s) still comfortably covers the ~6.8s
race measured live on ZD sandbox 335038.

`child_ticket_resolve_attempts` (v36's counter) is gone — which attempt is
running is now positional (which node you're at), not runtime state. This is
also exactly what makes the loop guard structurally unable to fire: there is no
cycle in this subgraph at all anymore.

## Verification

**Structural proof of no cycle.** A full DFS from node 39 through the resolve
chain enumerates every path; all four terminate at 36 or 34 without ever
revisiting a node:

```
39->41->40->18->19->36
39->41->40->18->19->20->26->28->30->36
39->41->40->18->19->20->26->28->30->31->54->55->56->36
39->41->40->18->19->20->26->28->30->31->54->55->56->34
```

**Static + regression (etg-errand-regression skill)** — unchanged from v36, as
expected (this fix touches only the mechanism, not the grouping/note contract):

| Check | v36 | v37 |
|---|---|---|
| `validate_tree.js` | 0 problems, 1 note | 0 problems, 1 note |
| `run_full.js` + `config.assumed.json` | 74 cases, 74 pass | 74 cases, 74 pass |
| `run_full.js` + `config.numericids.json` | 74 cases, 74 pass | 74 cases, 74 pass |

**Graph-walk stress test (`walk.mjs`)** — updated to track the 3 distinct fetch
nodes (40, 26, 54) instead of v36's single repeated node 40:

| Scenario | v36 result | v37 result |
|---|---|---|
| `grandchild_parent_resolves_after_retries` (resolves on attempt 2) | 2 grandchildren created, parent 334823 (correct) | Identical: 2 grandchildren created, parent 334823 |
| `grandchild_parent_never_resolves` (all 3 attempts empty) | 0 created, both titles BLOCKED, absent from `attempted_grandchild_ticket_keys` | Identical: 0 created, both titles BLOCKED, absent from `attempted_grandchild_ticket_keys` |

Existing scenarios (`clean`, `back_at_25`, `additional_request`,
`gc_first_unconfirmed_then_replay`) also unchanged from v36. This confirms v37
is a structural fix only — same outcomes, different graph shape.

## Not fixed here (unchanged from v36)

Whether Connected Object #181 (Get Side Conversations) caches its HTTP response
— if it does, a later attempt may replay a stale answer. Can't be confirmed
from the tree JSON; check the Data Source cache setting in the Zingtree admin
UI before relying on this bound in an unusually slow Zendesk window.

**New from this build:** the exact revisit count that trips Zingtree's loop
guard is still unknown — v36 tripped at up to 10 revisits; v37 uses 0 revisits
per node, so it cannot trip regardless of where the threshold actually sits.
If a future edit to this tree reintroduces a counted loop anywhere, keep the
iteration count low (matching 32/36/44's natural, data-bounded cardinality) or
prefer unrolling, and test live before assuming the offline harness caught
everything — it cannot see this class of defect.

## Nodes touched

5 (claude.md), 10, 18, 19, 20 (new), 21, 26 (new), 28 (new), 29, 30 (new),
31 (new), 36, 39, 41, 54 (new), 55 (new), 56 (new). Also: `walk.mjs` (scenarios
updated for 3 distinct fetch nodes) in this folder.

## File

`Register Errands - Dynamic (v37 unrolled resolve chain - fixes Zingtree invalid-loop guard 2026-08-05).json`
— new file, v36 export untouched.
