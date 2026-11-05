# VI Dynamic v7 — combined-PNR errand data (2026-08-21)

Tree: **Register Errands - VI Dynamic (756760393)**
Base: Brent's export of 2026-08-21 (`Register Errands VI Dynamic_1787344142833.json`, 33 nodes, root 48)
Parent: **Register Errands - Dynamic (595124299)** — **not modified**
Scope chosen by Brent: **minimal surgical fix**, errand key stays **type + action**

## The defect

VI node 27, one line:

```js
let final_pnrs = groupByErrand(bucket_stitch).map(group => group[0]);
```

`groupByErrand` correctly collapses PNRs that share a (type + customer action) pair into one
group — then `group[0]` throws away every PNR after the first. The child ticket title is built
separately with `joinPnrs(...)`, so the Zendesk note showed `Child Ticket: IFVLYF, PN6WPN`
while the Edvin errand built from `final_pnrs` described only `IFVLYF`.

This is exactly what Christina Zamenopoulou reported on ticket 337619 during the ETG
Pre-Launch Check In (2026-08-21): *"I still get only for one PNR message in the errand"* …
*"I see type, customer action, PNR only the first one, IFVLYF, passengers, channel, contact
reason, order reference, Zendesk … I don't see the information for the other PNR."*
And Brent, same call: *"We're registering one errand against one child ticket with combined
PNR logic. We need all of the combined PNR logic to be represented in the errand we display."*

## The change (node 27 only)

`final_pnrs` entries are now **combined records** instead of representatives. Per group:

| Field | Value |
| :---- | :---- |
| `pnr` | `"IFVLYF, PN6WPN"` — every PNR in the group, joined |
| `pnrs` / `pnr_count` / `is_combined_pnr` | the group, its size, and whether it combined |
| `orderProviderBookingDetails` | `[5551, 5552]` — all booking ids, as integers |
| `passenger_names` | `"Igor Grzybowski; Ann Grzybowski"` — de-duped across the group |
| `formatted_passengers` | every PNR's passenger HTML, concatenated |
| `free_text` | one `PNR <code>: <agent notes>` line per PNR |
| `notes` | rewritten to `free_text` **only** when the group has 2+ PNRs |
| `errand_key`, `orderReference`, `zendesk_parent_ticket_id` | stamped for the parent's loop |

Published under **both** names — `final_pnrs` and `errands_to_register` — carrying the same
records, plus `final_pnrs_count` / `errands_index` reset to 0.

**Why both names.** The parent tree reads this list differently depending on its revision:
v40's node 44 reads `errands_to_register` and formats the free text from `free_text` /
`passenger_names`; earlier revisions read `final_pnrs[count]` and let the Edvin Connected
Object merge `${transforms.current_pnr.*}` directly. The export supplied does not tell us
which revision the live parent is on — its note format matches neither v40 nor this export
exactly — so both names get the same record and the errand is complete either way. This keeps
the entire change inside the VI tree.

**`id` deliberately left alone.** It stays the first PNR's scalar booking id. The Edvin
Connected Object merges `id` by name, and turning it into an array would change the shape of
a request that works today. The full set travels as `orderProviderBookingDetails`, which is
the field the parent's node 44 forwards as `orderProviderBookingDetails`.

Grouping itself is **byte-identical**: the key is still ``type + "|" + customer_action``, and
`buildChildTickets` / `buildChildTicketsNote` are untouched. Ticket counts do not move.

## Verification — Stage A

`stageA.mjs` extracts node 27's real code from the built JSON and executes it.

**Static (11/11)**

- exactly one node differs from the input export, and it is node 27
- node count (33), `root_node_id` (48) and the single `is_root` unchanged
- no dangling continuation or button targets
- node 27 still continues to 79 (the parent hand-off)
- the grouping key, the ticket builder and the note builder are all still present verbatim
- the `group[0]` line is gone
- node 27 parses as valid JS

**Replay (9/9 scenarios)**

| Scenario | Errands | PNRs per errand | Booking ids | child / silent / grandchild |
| :---- | :---- | :---- | :---- | :---- |
| 1 PNR, proceed | 1 | `IFVLYF` | `[5551]` | 1 / 0 / 0 |
| **2 PNRs, same type + SAME action** (ticket 337619) | **1** | **`IFVLYF, PN6WPN`** | **`[5551,5552]`** | 1 / 0 / 0 |
| 2 PNRs, same type + DIFFERENT action (Brent's paste) | 2 | `IFVLYF` · `PN6WPN` | `[5551]` · `[5552]` | 1 / 0 / 2 |
| 3 PNRs, 2 share a pair + 1 differs | 2 | `AAA111, BBB222` · `CCC333` | `[1,2]` · `[3]` | 1 / 0 / 2 |
| 2 PNRs share pair, both no_action | 1 | `AAA111, BBB222` | `[1,2]` | 0 / 1 / 0 |
| 2 proceed (same pair) + 1 different_request | 2 | `AAA111, BBB222` · `CCC333` | `[1,2]` · `[3]` | 1 / 1 / 0 |
| 2 PNRs, DIFFERENT type + same action | 2 | `AAA111` · `BBB222` | `[1]` · `[2]` | 1 / 0 / 2 |
| nothing selected | 1 | `AAA111` | `[1]` | 0 / 1 / 0 |
| PNR with punctuation (`AB-12/34`) | 1 | `AB-12/34` | `[7]` | 1 / 0 / 0 |

In every scenario `final_pnrs` and `errands_to_register` are identical, and both cursors reset
to 0.

The ticket-337619 errand message now reads:

```
Type: Force Majeure
Customer Action: Sent to ticketing
PNR: IFVLYF, PN6WPN
Passengers: Igor Grzybowski
Channel: Chat
Contact Reason: Rebooking
Order Reference: 1029-995-166
Zendesk Ticket: 337619
Agent Notes: PNR IFVLYF: note A
             PNR PN6WPN: note B
```

Stage B (browser UI test in the Zendesk sandbox) is **not** run — it is attended, and it is
the right next step.

## Known gaps left in place (minimal scope, by decision)

1. **No unresolved-selection guard.** The parent's v40 node 27 filters on
   `ROUTED_BUCKETS = [proceed, no_action, different_request]`, so a PNR whose pick could not be
   read produces no ticket and no errand. Here an unreadable selection still becomes a silent
   ticket with a blank customer action — visible in the "nothing selected" row above.
2. **Node 2 resolves the Edvin bucket by label, not id** (`bucketKey` reads `b.name`). Only
   `"Proceed"` happens to lowercase into a key the tree routes on; other labels arrive
   unmapped. This is the bucket bug already written up in the v6 notes.
3. **Node 12 still emits a `<style>` block.** The parent tree removed all inline `<style>` at
   v30 because the org's anti-injection sanitizer drops markup after it, taking the whole
   action table with it.
4. **`keep_vars_on_back = 0`.** Back navigation through the VI screens discards captured
   values; the parent fixed this at v26 by setting it to 1.
5. **`id` stays scalar** (see above) — Edvin receives the full set only through
   `orderProviderBookingDetails`.

## Next step

Import into sandbox, run ticket 337619's shape (2 PNRs, same type, same action), and confirm
in Edvin admin that the free text lists both PNRs and both agent notes. Then run the
`etg-errand-regression` harness — node 27 is exactly the node that contract keeps breaking.
