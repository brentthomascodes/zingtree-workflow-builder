# ETG Register Errands v46 - straight ETL, one ticket loop, execution log

**Date:** 2026-09-02 · **Draft:** `Register Errands - Dynamic (v46 unified ticket loop + execution log, 2026-09-02).json`
**Built from:** `Register Errands - Dynamic (v44 code-review simplification draft, 2026-09-01).json`
**Nothing in production was touched.** Tree id 518765124. VI tree unchanged (see §6).

**Node count: 78 -> 59.**

---

## 1. The flow, as specified

```
load order from Edvin                          10 -> 77 -> 4 -> 13
agent selects PNRs                             61 -> 6 -> 24 -> 54 -> 75 -> 7
  agent selects passengers                     8 -> 9 -> 56
  agent selects type                           42 -> 26 -> 46 -> 1 -> 2 -> 11
  agent selects customer decisions             12 -> 25 -> 58 -> 59
build ONE data structure from those picks      27  (transforms.work_queue)
  CREATE child ticket                          32 -> 84 -> 33 -> 17
  GET details (ticket id)                      62 -> 64 -> 63 -> 39
  UPDATE ticket fields / data                  65 -> 66 -> 41
  grand child tickets? yes -> create/get/update  same nodes, cursor advances into
                                                 grand_child_tickets
  no -> other child tickets?                   34 -> back to 32, else 21
create internal note                           21 -> 22 -> 15
loop errands to create                         44 -> 78 -> 43 -> 30 -> 83
  create errand                                43
options to agent: end / other requests         89 -> 23 -> [47 other | 48 end]
on end session, display formatted logger       48
```

That is the whole tree. No idempotency checks anywhere.

---

## 2. Straight ETL - what protects a run

Per your call: **API error handling is the primary safeguard.** All the
have-I-done-this-already state is gone from nodes 10, 29, 32 and 44 -
`attempted_child_ticket_keys`, `attempted_grandchild_ticket_keys`,
`created_*_keys`, `registered_errand_keys`, and the `ticket_already_created` /
`skip_errand_registration` flags.

Worth recording, because it explains why removing them changed nothing in practice:
**none of that state was routing anything in v44 either.** The flags were computed and
read by nobody - node 32 continued straight into 84 -> 33, node 44 straight into
78 -> 43. They had been dead since the v42 renumbering broke the node ids the older
claude.md entries name ("node 13/15", "node 45"). So v46's behaviour here matches what
production has actually been doing, minus the state that pretended otherwise.

What is left doing the work:

- every API call is status-checked (nodes 13, 15, 17, 26, 30, 39, 41);
- every failure routes to one screen that logs it, shows the raw response, and can
  retry the exact call that failed (86 -> 87 -> 88);
- every call - success, failure, and retry - is written to the execution log.

**Accepted, and documented in claude.md:** a Back-nav replay of node 27 re-runs the ETL
and creates a second set of tickets. It is not silent - `walk_v46.mjs` asserts the
replay's six creates all appear in the log with no SKIP lines hiding any of them. If
that ever becomes an operational problem, the fix is upstream (stop node 25's Back from
re-entering node 27), not a key list inside the loop.

---

## 3. The execution log

### Format

One flat string in **form data** (`execution_log`). Form data has no TTL, so it survives
the 1-hour transforms expiry, a deep resume, and an Additional/Different Request pass.

```
entry ~||~ entry ~||~ entry ...
seq ~:~ ts ~:~ node ~:~ step ~:~ status ~:~ code ~:~ ref ~:~ detail
```

| Field | Meaning |
|---|---|
| `seq` | 1-based counter, never reused within a session |
| `ts` | ISO 8601 timestamp |
| `node` | e.g. `node 33` - which node fired the call |
| `step` | human label, e.g. `Create Grand Child Ticket` |
| `status` | `OK` \| `FAIL` \| `INFO` |
| `code` | HTTP status, blank for INFO |
| `ref` | what was acted on - ticket title, errand key, ZD ticket id |
| `detail` | error message on FAIL, blank on a clean OK |

Two `split()` calls to parse:

```js
const rows = log.split("~||~").map(e => {
  const [seq, ts, node, step, status, code, ref, detail] = e.split("~:~");
  return { seq, ts, node, step, status, code, ref, detail };
});
```

Every field goes through `logClean()` - tildes become hyphens, newlines and tabs become
spaces, 300-char cap - so no payload can forge a delimiter. The string is capped at
20,000 chars and trims **whole entries** off the front, never a partial one.

### Real output (harness, 2 PNRs / 2 type+action combos)

```
1~:~...~:~node 4~:~Edvin Find Order~:~OK~:~200~:~~:~
2~:~...~:~node 33~:~Create Child Ticket~:~OK~:~201~:~Child Ticket: Y4JU9G, Y4K8XC~:~
3~:~...~:~node 63~:~Get Ticket Details~:~OK~:~200~:~Child Ticket: Y4JU9G, Y4K8XC~:~
4~:~...~:~node 66~:~Update Child Ticket~:~OK~:~200~:~Child Ticket: Y4JU9G, Y4K8XC~:~
5~:~...~:~node 33~:~Create Grand Child Ticket~:~OK~:~201~:~Grandchild Ticket: Y4JU9G~:~
...
12~:~...~:~node 43~:~Edvin Register Errand~:~OK~:~200~:~Voluntary - Fare rules|Sent to support~:~
14~:~...~:~node 89~:~Run finished~:~INFO~:~~:~334818~:~1 queue entries, 2 Edvin errands
```

### Mechanism

Three functions, in a block byte-identical across nodes 9, 10, 21, 29, 32, 44, 46, 61,
64, 65, 86, 89:

- `logArm(node, step, alias, ref)` - the script immediately **before** a Data node names
  the call about to happen.
- `logFlush()` - first line of every script that can follow a Data node. Grades the armed
  call off `actions.<alias>._zt_meta.response.code`, appends one entry, disarms.
- `logWrite(...)` - direct append, used for the closing `INFO` marker.

The detail that matters: **node 86 writes the failure before the agent sees the retry
screen**, then re-arms the same call. A request that failed once and succeeded on retry
leaves both lines. The old per-request failure screens structurally could not do this -
a retry overwrote `actions.<alias>` and the failure vanished.

### Display

Node 89 renders the log into `transforms.execution_log_html`, grouped **failures first,
then completed**. Printed on node 48 (End Session), node 53 (Session Ended - Request
Failed), and node 87 (the failure screen). Deliberately **not** on node 23 (Closing
Call) - per your flow, the read-out belongs at the end of the session, not on the
options screen.

### The one thing to fix when you can

The block is copied into 12 scripts because Zingtree **User Functions**
(`ZT.<yourFunction>`) are registered in the admin UI, not in a tree export - a tree-only
change cannot centralise it. Register `logArm` / `logFlush` / `logWrite` as User
Functions once and all 12 blocks collapse to a single `ZT.logFlush();` line. Until then,
changing the block means changing 12 nodes - the same drift hazard already documented for
`BUCKET_BY_ID` across nodes 2 and 46. The bodies are verbatim-ready in node 32.

---

## 4. One loop for child + grand child tickets

### Why it was an easy lift

The grandchild body was not a different process. Nodes 36/37/68/69/70/71/72/85 called
**the same three Connected Objects** as the child body - #20 create, #158 get details,
#207 update - through duplicate node ids. The only real difference was
`target_ticket_id`: a child hangs off the root Zendesk ticket, a grand child hangs off
its parent's resolved ticket id. That is one ternary.

### The structure (your shape)

```js
transforms.work_queue = [
  {
    ticket: {
      kind: "child" | "silent" | "grand_child",
      title, pnr, bucket, category, contact_reason, customer_action, type, channel,
      genesys_interaction_type,
      errand_key,          // type + "|" + customer_action - the join key
      status,              // "open" | "solved" - what node 65 sends to Zendesk
      passengers: [...],
      grand_child_tickets: [ { ...same shape... } ]
    },
    errands: [ { ...the final_pnrs record(s) this ticket covers... } ]
  }
]
```

Two additions to your sketch, both to make it live rather than decorative:

- **`status` on the ticket** replaces node 65 sniffing the title for the word "Silent"
  to decide whether to solve it. The decision is made once, in node 27, where the bucket
  is actually known.
- **`errand_key`** is the join back to `final_pnrs`. The `errands` arrays hold
  *references* to those same records, not copies - `transforms.final_pnrs` is still built
  first, in its original order, so node 44 and the entire Edvin side are byte-for-byte
  unchanged.

### How one loop walks two levels

Depth-first, two form-data cursors: `queue_index` (which entry) and `grandchild_index`
(`-1` = the parent ticket itself, `0..n-1` = that grand child).

```
32 -> 84 -> 33 create -> 17 -> 62 -> 64 -> 63 get -> 39 -> 65 resolve
   -> 66 update -> 41 -> 34 (more?) -> back to 32
```

A parent is always processed before its grand children, so by the time a grand child
needs a `target_ticket_id`, node 65 has already filed the parent's real Zendesk id in
`resolved_ticket_ids_by_queue_index[queue_index]`. **That ordering is the contract** -
it is written into claude.md, because reordering the walk silently breaks grandchild
parenting. It also replaces `transforms.resolved_child_ticket_id`, which held "the last
id resolved" and worked only because grand children happened to follow their parent.

### Deleted

`19, 20, 35, 36, 37, 38, 49, 50, 51, 52, 68, 69, 70, 71, 72, 85`

---

## 5. Shared failure screen

Seven near-identical "Request Failed" content nodes (14, 16, 18, 28, 31, 40, 45) replaced
by three:

- **86** (Script) - flush the failure to the log, re-arm the same call, build the failure
  card and the log HTML.
- **87** (Content) - the screen: raw response, Retry, or End Session.
- **88** (Scoring) - retry router, branching on `last_api_alias` back to the Data node
  that failed.

**When you add a new API call, add a button to node 88.** If you forget, its Retry falls
through node 88's default to node 53 (Session Ended) - the run ends safely, but the agent
cannot retry. This is the one maintenance cost of the consolidation, and it is written
into claude.md.

---

## 6. What is NOT done

1. **Sandbox live test.** Required before promoting.
2. **PLATFORM RISK - Zingtree's "invalid loop" guard.** Node 32 is now re-entered once
   per *ticket* instead of once per *child ticket*: a child plus three grand children hits
   it four times instead of once. Zingtree's engine flags repeated re-entry into the same
   node or short cycle as an invalid loop independently of whether the counter logic is
   correct - you hit exactly this on v36. The loop passes through Content node 84 every
   pass, which is the paced-checkpoint shape that fixed it last time, so the risk is low.
   **But it is the one thing the offline harness cannot see.** Run a 1-child +
   2-grandchild case in sandbox first.
3. **The house `etg-errand-regression` harness could not be run** - `scripts/engine.js` is
   missing from the workspace copy of the skill, so `run_full.js` fails against *any*
   export, including current production. Worth restoring separately; it is the only thing
   that checks node 27's grouping against the independent oracle.
4. **VI tree unchanged.** It has no ticket loop - it is a data-prep subtree that returns
   to node 3 - so the unified loop does not apply. It does have one unlogged API call
   (node 80, `edvin__errand_configuration`) and its own failure screen, so the execution
   log will have a gap where VI ran. Small follow-up, deliberately out of scope here.
5. **Dead data left in place deliberately:** node 27 still builds
   `transforms.planned_ticket_titles` and nothing reads it. It is the input the
   note-reconciliation feature needs if it returns, and it costs nothing - but do not
   mistake it for live state.
6. **Still open from the 2026-09-01 handoff:** CO #184's admin-UI body change, node 21's
   CO `.slice(1,-1)`, and Tier 1 of the transforms migration.

---

## 7. Verification

`walk_v46.mjs` (this folder) executes the **real node bodies** over the **real
continuation graph** in a sandboxed VM, stubbing only the Connected Objects, and counts
every call:

```
node walk_v46.mjs "Register Errands - Dynamic (v46 unified ticket loop + execution log, 2026-09-02).json"
```

| Scenario | Asserts |
|---|---|
| 2 proceed PNRs, 2 type+action combos | 3 creates (1 child + 2 grandchildren), both grandchildren target the child's backing ticket, get/update calls match creates 1:1, 2 Edvin errands, all log entries OK |
| 2 proceed PNRs, 1 combo | 1 create, no grandchildren, 1 errand |
| 1 proceed + 2 distinct non-proceed | 3 creates, silent tickets first, silent updates `solved` / child `open`, all hang off the root ticket, 3 errands |
| Create fails, agent retries | Routes via 86 to 87, failure in the log *before* retry, node 88 routes back to node 33, log holds `FAIL` then `OK`, exactly one ticket exists |
| Back-nav replay of node 27 | Re-runs the ETL (6 creates), no guard nodes exist, all 6 creates visible in the log, zero SKIP entries |

All pass.
