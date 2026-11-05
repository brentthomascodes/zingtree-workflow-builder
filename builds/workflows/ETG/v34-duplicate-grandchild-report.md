# Duplicate grandchild tickets — ZD 334818 / child 334823 (Olga, 2026-08-05)

Tree under test: `Register Errands - Dynamic (v34 node 27 idempotent 2026-08-05).json`
Dataset: Y4JU9G (Cancellation / Voluntary - Fare rules / Sent to support / proceed)
+ Y4K8XC (Cancellation / 24 hour rule / Sent to support / proceed), order 1122-047-131.

## Short version

Node 27's grouping is correct and is **not** the cause. It produces exactly 1 child
ticket + 2 grandchildren for this dataset, and the internal note says so. The
duplicate is created downstream, in the node 32→38 create loop, and it is only
reachable when the loop runs a **second time** over the same child ticket.

The v34 node-27 idempotency fix is what made it visible. On v33 a replay was
accidentally blocked at node 51 (node 27 stripped `actions_array`, so pass 2
reported `lookup_failed` and never reached the create loop). v34 correctly keeps
`actions_array`, so pass 2 now sails through node 50 and re-enters the create loop —
where the guard turns out to be one-sided. That is why Olga is seeing this *after*
today's fix rather than before it.

## Reproduction

`walk.mjs` walks the real continuation graph and executes the real node bodies,
counting every node 33 / node 37 invocation. (The existing `run_full.js` harness
stubs the create loop — one create per `child_tickets` entry — which is exactly the
assumption under test here, so it cannot see this class of bug.)

```
node walk.mjs v34.json gc_first_unconfirmed_then_replay

child creates      : 1
   node 33 -> Child Ticket: Y4JU9G, Y4K8XC
grandchild creates : 3
   node 37 -> Grandchild Ticket: Y4JU9G   (parent 334823)
   node 37 -> Grandchild Ticket: Y4K8XC   (parent 334823)
   node 37 -> Grandchild Ticket: Y4JU9G   (parent 334823)
note header        : (Child Tickets: 1, Grand Child Tickets: 2, Silent Tickets: 0)
*** DUPLICATE GRANDCHILDREN: Grandchild Ticket: Y4JU9G x2 ***
```

One child ticket, three grandchild side conversations, Y4JU9G twice, Y4K8XC once,
note claiming 2. That is the reported ticket exactly.

Same scenario on v33 stops at node 51 on pass 2 and creates no duplicate — the
accidental block described above.

## Defect 1 — the Edvin errand loop has no idempotency guard (most serious)

Surfacing this first because it writes a wrong fact against a customer's order.

Node 44's cursor is `transforms.final_pnrs_count`. Node 27 rebuilds `final_pnrs`
fresh on every pass and its comment says that stops a Back-nav re-entry doubling the
list — but **nothing resets the cursor**, and node 44 has no equivalent of node 13 /
node 15's already-created guard. On a replay the cursor is still at 2:

```
pass 1: register-errand item | pnr=Y4JU9G | actionId="9001" | bucket="proceed"
pass 1: register-errand item | pnr=Y4K8XC | actionId="9001" | bucket="proceed"
pass 2: register-errand item | pnr=undefined | orderReference=undefined |
                               actionId=undefined | bucket=undefined
```

`final_pnrs[2]` is `undefined`, so node 43 fires a **third** Edvin registerErrand
carrying no type, no action and no PNR — against the real order reference. Reproduced
by `walk.mjs v34.json back_at_25` (2 errands expected, 3 registered).

Fix shape: reset `final_pnrs_count` to 0 wherever `final_pnrs` is rebuilt (node 27),
and give node 44 a `registered_errand_keys` guard keyed on `type|customer_action`,
mirroring nodes 13/15. Also guard `current_pnr` being undefined so the loop cannot
fire a request for an out-of-range cursor at all.

## Defect 2 — node 16's confirmed-create check makes the duplicate guard one-sided

The grandchild duplicate guard has exactly one input: whether the title is in
`transforms.created_grandchild_ticket_keys`. Node 16 is the only writer, and since
v25 it records the title **only when the create is confirmed**:

```javascript
const confirmed = checkable ? (statusCode >= 200 && statusCode < 300) : true;
if (confirmed) { /* record the title */ } else { /* log, leave un-recorded */ }
```

A non-2xx from CO #180 therefore leaves the title un-recorded — and a side
conversation that Zendesk *did* create (or created moments later) is then invisible
to the guard. Any replay of the create loop makes a second one. Y4K8XC, whose create
was acknowledged, is correctly skipped. Hence the asymmetry: the first grandchild
duplicates, the second does not.

Why the first one specifically is the likely victim: Zendesk materializes a side
conversation's backing ticket asynchronously. Node 41 waits 1 second
(`escalate_after = 1 SEC`) and node 40 polls once, so the very first grandchild
create is the one that can land before ticket 334823 is ready to accept it.

v25's reasoning was sound for node 14 (don't let a failed create look successful, so
the note flags it and a retry can still make it). But for node 16 it trades a masked
failure for a guaranteed duplicate, because nothing distinguishes "Zendesk rejected
it" from "Zendesk made it and the response was ugly".

Fix shape: make the guard record *attempts*, not confirmations. Record the title
before/regardless of the response in a `attempted_grandchild_ticket_keys` list used
by node 15, and keep `created_grandchild_ticket_keys` (confirmed only) for node 21's
reconciliation warning. A duplicate against a customer's order is worse than a note
that says "not confirmed — check the ticket list", which node 21 already prints.
Additionally: raise node 41's wait above 1 second, or poll node 40 until the
`targetTicketId` resolves, so the first create is not racing Zendesk.

## The discriminator to look for in Execution Insights (ZD 334818)

Both defects above are confirmed in the harness. Which one produced *this* ticket is
settled by two log lines from the run:

- `grandchild loop | ... | title="Grandchild Ticket: Y4JU9G" | already_created=` —
  two entries with `already_created=false` for the same title means the guard never
  saw the first create (Defect 2). A repeat with `already_created=true` means the
  guard worked and the duplicate came from somewhere else.
- `ERROR create-grandchild NOT confirmed, title left un-recorded: "Grandchild Ticket:
  Y4JU9G" | status=...` — this line appearing is the direct fingerprint of Defect 2,
  and `status` tells us what CO #180 actually returned.

Worth checking too: the note Olga pasted has no `WARNING - N ticket(s) ... were not
confirmed created by Zendesk` line. On the reproduction, pass 1's note *does* carry
that warning for Y4JU9G. So either the note she has is from the second pass (node 22
posts again on a replay), or CO #180 returned a clean 2xx and the missing key has a
different cause. The `already_created=` lines settle it either way.

## Also found — pre-existing, unrelated to the duplicate

`run_full.js` reports 42 pass / 22 fail on both v33 and v34, and **all 22 failures are
the same disagreement**: the tree now creates one silent ticket per distinct
(type + action) pair, while `scripts/oracle.js` still encodes v18's single
consolidated silent ticket.

Node 27's comment says this was changed deliberately on 2026-08-05 per tracker
"Testing 3" (Test 5 → 2 silent, 6a → 2 silent, 6b → 1 silent, 8 → 2 silent). If that
is right, **oracle.js is stale and needs updating** — deliberately not changed here,
since the whole value of the harness is that the answer key is not written by the code
being graded. Every proceed / grandchild / errand case passes, which is why the
duplicate above needed a separate driver to find.
