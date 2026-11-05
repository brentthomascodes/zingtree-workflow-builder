# Handoff: ETG Register Errands — VI (Virtual Interlining) sub-tree

**Written:** 2026-08-20, by Claude (Cowork), for whichever agent/session picks this
up next. No memory carries over between sessions — everything you need to
continue this work should be in this doc or the files it points to. If
something below turns out to be wrong once you inspect the live trees, trust
the trees and correct this doc, not the other way around.

## 1. What this is

ETG (eTraveli Group) is a Zingtree customer. Their Zendesk agents use a
Zingtree sidebar app ("Register Errands") to log cancellations/disruptions:
look up the order in Edvin (ETG's internal system), select PNRs and
passengers, pick a customer action per PNR, and the tree auto-creates
Zendesk child/grandchild/silent tickets, registers an "errand" in Edvin, and
posts an internal note.

**VI (virtual interlining)** is a new case this doesn't handle: ETG
sometimes sells multiple flight PNRs — possibly on different airlines,
under different fare rules — as one bundled/interlined trip. If one leg has
a schedule change that breaks a connection, the fix has to be evaluated
across the whole trip, not PNR-by-PNR. This session built VI as its own
Zingtree tree that hands off into the existing "Dynamic" tree's ticket
creation logic once VI's own screens are done.

**Key person on the ETG side:** Olga Gerothanasi — she's the one defining
the VI business rules (in Slack and in a rough draft tree of her own) and
will test whatever gets built. Brent Thomas is the Zingtree engineer
building this. Other names that show up in call transcripts/Slack but
aren't central to VI itself: John Ruberto, Ravindu Roshan Liyanagamage,
Charchit (Zingtree side); Karl-Johan Sigurdson, Kateryna Novak, Jesper
Parker, Oskar Brandt, Jakub Osuchowski (ETG side, mostly on a separate
Edvin-data-population defect, not VI).

## 2. Where things live

**Connected device folder** (if this session has the same folder connected):
`Claude Cowork - Zingtree/Zingtree Builder/` — subfolders:
- `Script Library/` — production script-node code (e.g.
  `etg_current_pnr_accumulator_snippet.js`,
  `node27_stitch_group_FIXED_2026-08-13.js`, `etg_errand_transform_api.js`,
  `sanitize-audit-etg-errands.mjs`).
- `Visualizations/` — mermaid diagrams of Dynamic's history
  (`register-errands-dynamic-v19/v20/v25/v30-reentry-fix.mermaid`) and the
  cancellation-flow diagrams.
- `Skill Source/` — source for the `etg-errand-regression` skill (and
  `etg-env-promote`, `analyze-workflow-session`).
- `Workflow JSONs/ETG/` — **new this session** — the two current tree
  exports plus this doc:
  - `Register Errands - Dynamic (companion edit).json`
  - `Register Errands - VI Dynamic (FIXED v2).json`
  - `HANDOFF.md` (this file)

**Skills** (synced locally under `~/.claude/skills/synced/`, also loadable
via the Skill tool):
- `zingtree-workflow-builder` — authoritative rules for reading/writing
  Zingtree tree JSON: the three data-setting rules, the `claude.md` node
  convention every tree carries, the hub-and-spoke multi-tree pattern
  (`open_tree_id` / `open_tree_node_id` / `return_tree_node_id`). **Read
  this before touching either tree.**
- `etg-errand-regression` — the tested contract for Dynamic's grouping
  logic (below), with an offline harness (`scripts/run_full.js`,
  `scripts/oracle.js`, `scripts/validate_tree.js`) and a live-sandbox
  procedure. **Must be re-run after any edit to Dynamic nodes 2, 12, 21,
  27, 32, 36, or 44** — that's the exact contract VI's hand-off depends on.

**Each tree also carries its own `claude.md`** (an unlinked Content node,
node id `5` in both trees) — read it first, it's more authoritative than
this doc for anything tree-internal, and it's meant to be kept up to date
by whoever edits the tree next.

## 3. The two trees, and how they're wired together

| | Dynamic | VI |
|---|---|---|
| Tree id | `595124299` | `756760393` |
| Name | Register Errands - Dynamic | Register Errands - VI Dynamic |
| Root node | `10` (Clear session) | `78` (Select Brand) |

**Dynamic node 75** ("Use transformed data", Scoring) checks
`custom_field_29559177650834` for
`contact_reason_sc__self_transfer_guarantee_vi_passengers_at_the_airport`
or `contact_reason_sc__self_transfer_guarantee_vi_sc`. If either matches, it
routes to **node 76** (type `Tree`), which has `open_tree_id=756760393`,
`open_tree_node_id=78` — i.e. it jumps into VI's root. `return_tree_node_id`
is `0`: this is a **one-way hand-off**, not a call/return. VI does not come
back to wherever it left Dynamic.

**VI node 77** (type `Tree`) is VI's own exit: `open_tree_id=595124299`,
`open_tree_node_id=3` — jumps into Dynamic at node 3 ("Any child tickets to
create?"), the point where Dynamic's shared ticket/grandchild/errand/closing
logic takes over. Also one-way (`return_tree_node_id=0`) — once VI hands
off, Dynamic finishes the session using its own unmodified logic.

This means: **the only thing VI is responsible for building is the data
Dynamic's node 3 onward expects to find** — specifically
`transforms.customer_action_pnrs` and whatever else nodes 12/25/27
read. Get that shape right and the rest of Dynamic just works, unmodified.

## 4. Why VI can't just reuse Dynamic's per-PNR loop

Dynamic's core contract (from `etg-errand-regression`'s SKILL.md, tested by
its offline harness):

| Situation | Result |
|---|---|
| PNRs with bucket `proceed` | Exactly ONE active child ticket, however many PNRs |
| Grandchildren under that child | One per distinct (type + action) pair, only when 2+ distinct pairs |
| PNRs with `no_action`/`escalate`/`different_request` | Exactly ONE silent ticket covering all of them, never grandchildren |
| Any unresolved/unrecognized selection | Invalid run — nothing recorded, agent sent back to re-pick |

That's keyed on **distinct (type + action) pairs across PNRs** — which
assumes each PNR can legitimately carry a different type/action. Olga's
explicit rule for VI (Slack, 2026-08-20): when ETG bundles multiple PNRs
into one interlined trip, they're evaluated **as one unit** — "we select
multiple PNRs but treat them as one pnr through the whole VI flow (no pnr
loop) ... For VI there will be no grandchildren but always one child
(active or silent) as multi pnrs are treated as one."

So VI's job is: collapse however many real PNRs the agent selected into
**exactly one** `customer_action_pnrs` entry before handing off to Dynamic's
node 3. Because node 27's grouping can only ever see one (type+action) pair
when there's only one record, the "always one child, never grandchildren"
outcome falls out of Dynamic's existing logic for free — no changes needed
to nodes 12/25/27/32/36/44 themselves.

## 5. VI tree flow, as currently built

```
78 Select Brand
 -> 83 Set Group Context (captures brand; builds transforms.vi_pnr_banner
    from the PNRs Dynamic already selected before the node-76 hand-off)
 -> 79 Select Passengers (group-level, one pass — not per-PNR)
 -> 80 Format Passengers (group-level)
 -> 90 Partner selection [Olga's own placeholder — see §6]
 -> 120 Compute Partner & Date Bucket (script)
 -> 121 Partner & Date Routing (scoring):
      - Booking.com, OR ETG before the cutoff -> 92
      - ETG on/after the cutoff               -> 103
 -> [92-102] "Bcom & ETG prior 21May26" STG-eligibility branch, OR
    [103-112] "ETG post 22may2026" STG-eligibility branch
    (disruption_type / delay_reason / flight_affected / same-day-alternative
    / overnight-alternative / Bcom-refund-offer screens — ported from
    Olga's own draft tree, see §6)
 -> both branches funnel into ->
 42 GET Edvin Errands (copied verbatim from Dynamic node 42)
 -> 46 Format Types (copied verbatim from Dynamic node 46)
 -> 81 Select Channel & Type (adapted from Dynamic node 1)
 -> 82 Build Collapsed Action Record (adapted from Dynamic node 2 — this is
    the node that guarantees exactly ONE customer_action_pnrs entry
    spanning every selected PNR)
 -> 12 Create PNR Action Table  [byte-for-byte shared with Dynamic]
 -> 25 Display PNR Action Table [byte-for-byte shared with Dynamic]
 -> 27 Stitch & Group PNR Action Selections [byte-for-byte shared with Dynamic]
 -> 77 Tree node -> hands off to Dynamic tree 595124299, node 3
```

Full reachability was checked node-by-node when this was built — nothing
is orphaned except VI's own `claude.md` (node 5, unlinked by design).

## 6. The partner/date/STG-eligibility branch (nodes 90, 92-112, 120-121)

Olga built her own rough draft of VI logic in a separate file (she called
it "test vi", tree id `610125226`) — it had a full duplicate of the
per-PNR loop and ticket-creation logic (outdated, already superseded by
§5's collapsed-record approach and **not** ported), but it also had a
genuinely valuable disruption-type/compensation decision tree that VI
needs: given the contact reason (schedule change within/outside 24h, trip
delay, accommodation/meal compensation), what alternatives or compensation
should the agent offer, and does that differ depending on whether the
booking is through Booking.com or ETG, and when it was made. That part
(her nodes 34, 36-56) was ported into this tree as nodes 90, 92-112, with
one fix:

Her own routing node (her node 35, "Partner logic") checked **only**
`partner` (Booking vs ETG) — no date check anywhere. That contradicts her
own rule as she described it: Booking.com is never affected by the date
cutoff either way; ETG *before* the cutoff should land on the same branch
as Booking.com; only ETG *on/after* the cutoff gets its own branch. As she
had it built, **every** ETG case — regardless of date — went to the
post-cutoff branch. Nodes 120 (script, computes `partner` +
`is_etg_post_cutoff`) and 121 (scoring, routes on both) fix that gap.

**Two things are explicitly unverified — don't guess at these, ask Olga:**

1. **`partner` (Booking.com vs ETG).** Olga's own node — ported here as
   node 90 — has an alert box that literally says *"this will be defined
   by the system - temporary node."* She already knew this needs to come
   from real order data (presumably via the ETG BCom API she mentioned
   needing) rather than a manual agent radio button. It's still a manual
   radio button in this build. Don't invent an Edvin/BCom field name to
   wire it up automatically — ask Olga what the real field is once that
   integration exists, and replace node 90 then.
2. **The booking/order-created date** used for the 21-vs-22-May-2026
   cutoff. Olga flagged in Slack (2026-08-20): *"the information on
   partner/created date is needed."* Node 120 currently reads
   `transforms.selected_pnrs[0].bookingDate` as a **placeholder** — this
   field name has not been confirmed against any real API response. If
   that value is missing or unparseable, node 120 currently defaults to
   the **pre-cutoff** branch (rather than guessing the newer, less-tested
   post-cutoff behavior) — that default is a judgment call, not something
   Olga confirmed; flag it back to her.
   Also unconfirmed: the exact boundary. Olga's phrasing ("Booking/ETG
   prior 21May2026 ... Booking after 22May2026 ... ETG after 22May26")
   leaves the 21st-to-22nd gap ambiguous. This build treats "on/after
   22-May-2026 UTC" as the post-cutoff condition and everything earlier
   (including the 21st) as pre-cutoff. Confirm with Olga before this ships.

## 7. Known drift already flagged inside Dynamic's own claude.md

Dynamic's `claude.md` (node 5) carries a note that its own architecture
description is stale in one spot: it still describes v26's nodes 54/55
("NATIVE dynamic select" + "Record Customer Action") in the per-PNR intake
line, but neither node exists in the current export — the real flow goes
`2 -> 11 -> 12 -> 25`. This was **left uncorrected on purpose** by whoever
wrote that note, rather than rewritten from a guess. If you're touching
that part of Dynamic, fix the description for real rather than re-guessing;
otherwise leave the note as an honest flag.

## 8. What's confirmed done vs. what's still open

**Done and verified this session:**
- VI tree fully reachable, no orphans (except its own `claude.md`).
- Dynamic node 76 correctly points at VI tree 756760393, node 78.
- VI node 77 correctly points at Dynamic tree 595124299, node 3.
- VI node 82 guarantees exactly one `customer_action_pnrs` record per VI
  case (the mechanism that makes "always one child, never grandchildren"
  fall out of Dynamic's existing, unmodified grouping logic).
- Olga's disruption-type/STG-eligibility decision tree ported in, with the
  missing partner+date check fixed (nodes 120/121).

**Still open — needs a real answer, not an assumption:**
- The real system field for `partner` (§6.1).
- The real field/format for the booking/order-created date, and
  confirmation of the exact cutoff boundary (§6.2).
- Once both of the above are wired to real data: **re-run the
  `etg-errand-regression` offline harness** against the updated Dynamic
  export (nodes 2/12/21/27/32/36/44 are all in VI's downstream path, even
  though this session didn't change their content) before calling this
  done, and run at least one live VI case through the Zendesk sandbox per
  that skill's live-testing procedure.
- Whether `transforms.selected_pnrs[0].providerPnrIds` (the array of real
  PNRs folded into VI's one collapsed record, for Edvin traceability) is
  actually the shape Edvin's `registerErrand` endpoint (Connected Object
  #184) expects — not verified against a real API response.

## 9. Suggested next step

Don't touch node 90/the partner field or node 120/the date field until
Olga answers §6's two open questions — everything else in the VI tree
already has a defensible, checked shape. When she does answer them, this
is a small, contained edit (two node contents), not a re-architecture.
