# ETG errand workflows — regression findings (rewritten methodology)

**Trees under test:** `Register_Errands_notes_fix_20260824.json` (the errand-registration tree,
50 nodes — the file you sent, superseding the "PRODUCTION, 2026-08-24" export I'd tested
before) and `Register Errands - VI Dynamic (v11 conditional-required correction,
2026-08-24).json` (the linked Self-Transfer-Guarantee sub-tree, 36 nodes).

**Method:** real graph walk — `scripts/graph_walk.mjs` executes the tree's actual Script node
bodies via Node's `vm` module, follows the actual Scoring-node button logic, and stubs only
the external Data/CX Action calls (Zendesk, Edvin). It is **not** a reimplementation of the
tree's business rules — every routing decision and every transform is the tree's own code,
run for real, against a matrix of mock data payloads. 18 scenarios against the errand tree,
0 unexplained failures, plus one routing defect on the VI tree confirmed by executing its
literal logic expressions directly (below).

**On the video:** I still can't get to it. It's "Screen Recording 2026-07-10 at 12.04.30 PM.mov"
in your Google Drive (fileId `1Yaq97p8XZuWndLZ4nrE3X6cYO5LlrBtw`) — the Drive connector's
download tool has a hard 10MB cap and the file is ~50MB, so it's not a permissions problem,
it's a tool limit. If there's methodology on it I'm missing, the fastest path is you attaching
it directly to the conversation rather than me trying Drive again.

This replaces the earlier findings pass, which ran on a hand-coded harness (`run_full.js`/
`oracle.js`) that reimplemented the bucket/grouping rules by hand instead of executing the
tree's own code. That harness is retired; the rules below are things the tree's real code
was caught doing, not things a re-implementation assumed it would do.

I could not access "Screen Recording 2026-07-10 at 12.04.30 PM.mov" (Drive's 10MB download
cap blocks it) — if there's methodology on that recording not reflected here, send it over
directly and I'll fold it in. Everything below is built from the tree's own node graph and
your own prior graph-walking scripts (`walk.mjs`, `vi-v7-harness.mjs`) as the template.

## Fully broken paths (uncaught exceptions — these kill the agent's session)

These are the most severe class: not a wrong answer, a hard crash with no recovery screen.
Each was reproduced by literally executing the real node code with a payload chosen to
trigger it.

1. **Every PNR unresolved → crash at node 44, not a graceful re-prompt.**
   When no PNR's customer-action selection resolves (blank, never posted, or a stale/foreign
   action id), node 27 correctly builds `final_pnrs: []` — so far so good. But node 3 ("Any
   child tickets to create?") is the **only** guard on this path, and it only decides whether
   to run the *ticket*-creation loop (node 32). There is no equivalent guard before node 44
   ("Loop Errands to Register"): node 22 → 44 is an unconditional continuation. With
   `final_pnrs` empty, node 44 runs `final_pnrs[0]` unguarded and throws on
   `current_pnr.type` against `current_pnr === undefined`. Confirmed two ways: a selection
   that was never posted at all, and a selection that posted a stale/foreign action id from
   the wrong type — both hit the identical crash. `validate_tree.js`'s static check
   independently flags the same gap ("no node 50: this export predates the
   unresolved-selection guard").
   **Impact:** an agent who leaves any PNR unresolved and continues does not see the
   tree's own "nothing recorded, pick again" messaging (`buildUnresolvedHtml` in node 27 is
   built but never rendered on this path) — they get a dead session instead.

2. **A failed Zendesk child-ticket create crashes node 64, not a retry or an error screen.**
   Node 33 creates the child/silent ticket via CO #157. If Zendesk returns anything other
   than success (mocked here as a plain error response with no `.side_conversation` field —
   what a real 4xx/5xx looks like), node 64 ("Set Side Conversation Id") crashes reading
   `.side_conversation.id` off that response. There is no success/failure branch anywhere in
   this chain — `created_child_ticket_keys` (the field the tree's own comments describe as
   the confirmed-creation reconciliation list) is declared and cleared by nodes 10/29 but is
   never actually **written** by node 33 or read by anything downstream. It exists in name
   only.

3. **An unresolved async side-conversation lookup crashes node 65, same shape.**
   Node 63 looks up the side conversation Zendesk just created; if it hasn't materialized
   yet (Zendesk's own eventual-consistency window, or the lookup simply comes back empty),
   node 65 crashes on `.external_ids` of `undefined` rather than retrying or surfacing a
   wait state.

4. **Both crashes repeat identically on the grandchild path** (nodes 69/71, mirroring 64/65) —
   confirmed with the same technique. Grandchildren share connected objects #157/#181 with
   the child path (verified from node 69's source: `const createResponse =
   actions.create_child_ticket;` — there is no separate grandchild alias), so whatever fixes
   the child path's two crashes needs to cover the grandchild path with the same fix, not a
   parallel one.

**Net: there is no success/failure handling anywhere in the ticket-creation chain.** Every
"idempotency guard" the tree's comments describe (`created_child_ticket_keys`,
`created_grandchild_ticket_keys`) is wired to be cleared on restart but never populated on
success — so even *if* these crashes are fixed reactively, nothing currently tells the tree
whether a create actually landed.

## Confirmed logic defect (not a crash — silently wrong)

5. **An unrecognized bucket value from Edvin's own action list is accepted, not rejected.**
   Reproduced by feeding node 2's real `bucketKey()` function an action whose `bucket` is a
   plain string not in `BUCKET_BY_NAME` ("pending", standing in for any config drift on
   Edvin's side). `bucketKey()`'s own fallback (`return BUCKET_BY_NAME[...] || raw;`) passes
   the raw string straight through as if it were a legitimate bucket. Node 27 then treats it
   as fully resolved: it becomes a "Silent Ticket" and gets an Edvin errand registered,
   indistinguishable in the note or in Edvin from an intentional `no_action` outcome. There
   is no allowlist check anywhere between Edvin's response and the tree treating a bucket as
   valid. Confirmed scenario: `unrecognized_bucket_string_writes_false_silent`.

## Confirmed fixed, and now verified (the notes-merge fix)

Your tree's own `claude.md` (node 5) logs a 2026-08-24 changelog entry: when 2+ PNRs collapse
into one errand, `buildFinalErrandRecord()` (node 27) combined PNR/passengers/orderReference
across the group but still spread `{...group[0]}` for `.notes` — so a second PNR's agent notes
were silently dropped from the Edvin "Agent Notes" line. The entry says this was "not yet
verified against etg-errand-regression's harness... recommend a hand-repro before this ships."

I ran that repro for real: two PNRs, same (type + action), distinct agent notes on each.

- Against the **old** export (no fix): `final_pnrs[0].notes` = `"agent note for AAA111"` —
  BBB222's note is gone, reproducing the exact bug described.
- Against the **file you just sent** (with the fix): `final_pnrs[0].notes` =
  `"AAA111: agent note for AAA111 | BBB222: agent note for BBB222"` — both notes present,
  correctly merged and de-duped. Fix confirmed, safe to consider shipped.

## Confirmed fixed (worth closing out, not re-opening)

6. **The Additional/Different-Request round-leakage bug node 29's comments describe (Zendesk
   334577 / 334588, "v37 fix") holds in this export.** I ran two independent checks: a
   second round with a *different* (type + action) pair came back fully independent of round
   1's counts, and — the sharper test — a second round reusing the **identical** (type +
   action) pair as round 1 still produced its own child ticket and errand rather than being
   silently swallowed by the `registered_errand_keys` idempotency guard. Node 29 does clear
   every key `attempted_child_ticket_keys` / `attempted_grandchild_ticket_keys` /
   `registered_errand_keys` / `final_pnrs_count` on this exact re-entry path, exactly as its
   comments claim. No action needed here — flagging it only because it was a live line item
   in the prior findings pass.

## What was swept and came back clean

Executed for real (not asserted): legacy display-name submit instead of numeric action id,
duplicate PNRs in the same request, PNRs with punctuation/regex-unsafe characters through the
node 12 → 25 → 27 field-naming round trip, 3-PNR mixed grouping (2 sharing a pair, 1 not), and
the Different Request branch's re-entry (confirmed no stale PNR/type/action carries over,
same as Additional Request).

## VI tree (Self Transfer Guarantee sub-tree): a real routing bug, longstanding

Since you handed me both trees as production, I read the VI tree's Scoring logic the same
way — not assumed, executed. Nodes 52 ("Bcom OR ETG & prior 21May26" branch) and 67 ("ETG &
post 22May2026" branch) each route on `disruption_type` (Schedule Change / Trip Delay /
Accommodation compensation / Meal compensation) combined with `flight_affected` (Directly /
Indirectly affected flight). Both nodes' first two buttons are missing parentheses:

```
disruption_type == "Schedule change within 24 hour window" && flight_affected == "Directly affected flight" || flight_affected == "Indirectly affected flight"
```

JS evaluates `&&` before `||`, so this is actually
`(disruption_type == "..." && flight_affected == "Directly...") || (flight_affected == "Indirectly...")`
— the second clause isn't gated by `disruption_type` at all. I confirmed this isn't just a
reading of the string — I ran the tree's literal expression through a real JS `eval()` with a
few variable combinations:

| disruption_type | flight_affected | node 67 routes to | should route to |
|---|---|---|---|
| Trip delay | Indirectly affected flight | **69** (Schedule Change screen) | 73 (Trip Delay screen) |
| Accomodation compensation | Indirectly affected flight | **69** (Schedule Change screen) | 80 (skip straight to errand config) |
| Trip delay | *(blank)* | 73 (correct) | 73 |

`flight_affected` is conditionally shown only when `disruption_type` contains "Schedule" (its
own field config confirms this) and is not required — so in a normal single-PNR session it
likely stays blank for Trip Delay / Accommodation / Meal cases, and the bug is dormant. But
nothing clears it between PNRs in the same ticket: if an earlier PNR in the same session was a
Schedule Change case and the agent picked "Indirectly affected flight," that value has no
reason to reset, and a later PNR in the same ticket that's actually a Trip Delay or
Accommodation/Meal case gets silently routed into the wrong alternative-selection screens.

This is **not new to v11** — I checked it against the on-disk "PRODUCTION, 2026-08-24" VI
export and v10 as well; the same missing parentheses are in all three. One file-hygiene note
separate from the bug itself: the file literally named `Register Errands - VI Dynamic
(PRODUCTION, 2026-08-24).json` on your Mac is a 35-node snapshot, one node behind v10/v11 (36
nodes) — worth relabeling so "PRODUCTION" reliably means "newest," since v11 is the one you
just told me to treat as production.

Fix is mechanical: wrap the first clause in parens on both buttons, both nodes — e.g.
`(disruption_type == "..." && flight_affected == "Directly affected flight") || (disruption_type == "..." && flight_affected == "Indirectly affected flight")`.
I did not make this edit — Wes owns tree edits and it should get its own requirements
line/CR per your usual flow, plus a check on whether `flight_affected` ought to be
explicitly cleared per-PNR regardless of the parens fix.

## What's still open

- **Live click-through in the Zendesk sandbox** is still blocked by a browser-automation
  issue (an extension-level `MutationObserver` error tied to the Zingtree app's iframe — no
  clicks register inside it). This is a tooling limitation, not a tree defect, and I haven't
  found a workaround yet. If you want this closed out, the fastest path is probably you
  driving one pass by hand while I read the resulting ticket/note state back, rather than me
  continuing to fight the iframe.
- **The skill recording** — still can't pull it past Drive's 10MB cap. Send it directly if
  there's a testing angle in it not covered above.
- **The VI tree's routing bug** — confirmed by direct expression execution, not yet fixed or
  re-verified against a patched export.

## Files

- `scripts/graph_walk.mjs` — the harness itself (18 scenarios, re-runnable against any
  export: `node graph_walk.mjs <tree.json>`)
- `scripts/graph-walk-report.json` — machine-readable run output
