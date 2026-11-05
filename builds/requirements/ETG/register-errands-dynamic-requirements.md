# ETG (Etraveli) — Register Errands - Dynamic — Requirements

| | |
| :---- | :---- |
| **Account** | ETG (Etraveli) |
| **Workflow / tree** | Register Errands - Dynamic (`tree ID 139367450`, org 113 / EU) |
| **JSON location** | `Zingtree Builder/Workflow JSONs/ETG/Register Errands - Dynamic (export 2026-07-27).json` |
| **Status** | **Built, pending Brent's approval** (CR-016, 2026-09-04; CR-017, 2026-09-05) — Stage A verification complete for both; Stage B live/browser test and etg-errand-regression offline replay not yet run for either |
| **Owner** | Brent Thomas |
| **Created** | 2026-07-27 |
| **Last amended** | 2026-09-05 (CR-017) — previously 2026-09-04 (CR-016), 2026-08-25 (CR-015), 2026-08-03 (CR-008) |
| **Sources** | Tree export + its `claude.md` node (node 5) · `Call Reviews/2026-07-27 ETG (Etraveli) - Flow test results.md` · Spiky "Flow test results" 2026-07-27 · Spiky " Mandatory Zingtree Approach - Working Workshop" 2026-07-27 · John Ruberto's meeting notes in Slack `#customer_etraveli` (7/16, 7/20, 7/21, 7/24, 7/27) · Slack `#zingtee-etg-squad` |

> **Status: reconstructed from existing tree.** This tree was built before the requirements process existed. §1–§8 are recovered from the JSON, the `claude.md` node's changelog, and the meeting record — every line that was inferred rather than stated by ETG is tagged **[inferred]**. §12 carries the real, sourced change requests from here on.

---

## 1. Business context & outcome

ETG's Errand Restructure programme replaces per-use-case Zingtree trees with **one dynamic tree** driven by Edvin configuration, so that adding a new errand no longer requires a developer or a workflow edit. Zingtree takes over child/silent ticket creation in Zendesk and posts errands into Edvin automatically, cutting manual agent steps. ETG's stated objective from the 16 July integration workshop: *"A single, dynamic ZingTree workflow that can handle all errand registration cases without needing new flows for each use case"* and mapping/config owned by process teams, not developers.

Target go-live for the high-level trees: **17 August 2026** (tentative — #customer_etraveli, 21 July weekly collaboration notes).

## 2. Actors & journey

- **Who uses it** — Etraveli contact-centre agents, currently First Line (FL) and Schedule Change (SC) groups. Other teams remain on the old structure.
- **Where it runs** — embedded in Zendesk, against the agent's open ticket. EU-hosted (`eu.zingtree.com`, org 113).
- **Journey** — agent opens a ticket with a contact reason → tree calls Edvin Find Order → agent selects PNR(s) → selects passengers → tree pulls that group's Edvin errand configuration → agent selects channel/type and then a customer action per PNR → tree groups the selections, creates Zendesk child (actionable) and silent tickets plus grandchild tickets where required, writes an internal note on the parent listing everything created, registers the errands in Edvin, then offers an "additional request" restart.

## 3. Scope

**In scope**
- Dynamic channel / category / type / action population from the Edvin errand-configuration API (no hardcoded lists).
- Per-agent-group configuration (FL vs SC return different types under the same category).
- Zendesk child / silent / grandchild ticket creation, side-conversation parenting, tag updates, parent internal note.
- Edvin errand registration, one errand per PNR.
- End-of-flow "additional request" restart that updates the Zendesk contact reason.

**Out of scope (this round)**
- **Fully dynamic chargeback filtering.** Agreed at the 20 July technical workshop to ship a *temporary static filter* using predefined chargeback IDs, because of the mid-August deadline. Requested by Christina; IDs owed by Elis.
- **Dropdown re-ordering** beyond Edvin's own ordering — Brent flagged the effort at the 14 July collaboration meeting; ETG to confirm priority. Still unresolved.
- Teams other than First Line and Schedule Change.

## 4. Functional requirements

*Recovered from the built tree. Numbering starts at R1; anything marked **[inferred]** was read off the implementation rather than stated by ETG.*

### R1 — Dynamic errand configuration from Edvin · **Must**
- **Source:** *"Edvin API to provide all necessary errand data dynamically, including categories, types, actions, and their ordering"* — ZingTree/Edvin API Integration Workshop notes, John Ruberto, `#customer_etraveli`, 2026-07-16.
- **Requirement:** Channels, categories, types and actions are read at runtime from the Edvin errand-configuration API (node 42), normalised in node 46, and rendered as agent-selectable options (nodes 1, 2). No errand values are hardcoded in the tree.
- **AC-1.1** — Given a new errand type is added in Edvin, when an agent loads the tree after Edvin's cache window (~30–60 min), then the new type appears without any Zingtree edit.
- **AC-1.2** — Given the API returns `channel`/`category` as objects, when they are stored on a PNR item, then only the scalar `.name` is stored (never the raw object) — see the 2026-07-26 changelog entries.

### R2 — Contact reason drives the category filter · **Must**
- **Source:** *"Contact reason in Zendesk corresponds to category in Edvin; mapping is required for ZingTree to filter API responses correctly"* — workshop notes, 2026-07-16.
- **Requirement:** The Zendesk contact reason (custom field `29658558478738`) selects the Edvin category via the `CONTACT_REASON_BY_ZENDESK` map in nodes 2 and 46, and only that category's types/actions are offered.
- **AC-2.1** — Given contact reason `contact_reason__rebooking`, when the tree loads, then only Rebooking types are offered.
- **Notes:** the map is an **interim** measure until Edvin returns a matching key (see CR-004 and Open Question Q5). `contact_reason__schedule_change` has no Edvin category.

### R3 — Per-agent-group configuration · **Must**
- **Source:** Flow test results, 2026-07-27 — Brent confirmed FL and SC issue separate Edvin requests and receive different types under the same category; verified live in the call.
- **AC-3.1** — Given a Schedule Change agent, when the tree loads, then the SC errand configuration is requested and SC-specific types are shown.

### R4 — Per-PNR customer action capture · **Must** **[inferred]**
- **Requirement:** For each selected PNR the agent picks a customer action; each action carries a `bucket` normalised to one of `proceed | no_action | escalate | different_request` (default → silent ticket). Selections accumulate in `transforms.customer_action_pnrs` (node 2) and are restitched and grouped in node 27.
- **AC-4.1** — Given two PNRs with the same type, action and bucket, when the tree groups them, then their errands are consolidated rather than duplicated. *(Consolidation rule stated by Brent at the 21 July collaboration meeting: "the key new functionality is consolidating errands when type, action, and bucket are the same.")*

### R5 — Zendesk child, silent and grandchild ticket creation · **Must**
- **Source:** Errand Restructure operating model, Meni Kyritsi, Gmail *"Alignment Needed: Mandatory Zingtree Approach for Errand Restructure Go-Live"*, 2026-07-22: *"Zingtree taking over child/silent ticket creation."*
- **Requirement:** Actionable actions create child tickets; non-actionable buckets create silent tickets; where an action requires a further task, a grandchild ticket is created against the child's side conversation (nodes 32–41).
- **AC-5.1** — Given zero child tickets to create, when the flow reaches node 3, then node 32 is skipped entirely (guard `len(transforms.child_tickets) >= 1` — must not regress).
- **AC-5.2** — Grandchild tickets are never silent and remain open.

### R6 — Parent internal note listing everything created · **Must**
- **Source:** *"notes about all tickets created should be added to the parent ticket"* — Errands API Integration review notes, `#customer_etraveli`, 2026-07-08.
- **AC-6.1** — Given a completed run, when the flow reaches node 22, then the parent ticket carries one internal note enumerating every child and grandchild ticket created.

### R7 — Edvin errand registration, one per PNR · **Must**
- **Source:** Brent, Slack `#zingtee-etg-squad`, 2026-07-07: *"Every PNR will have an errand registered in Edvin. This makes more sense."* Confirmed at the 9 July Collaboration Hour that the API supports multiple PNRs on a single errand.
- **AC-7.1** — Given N PNRs processed, when the register loop (44 → 43 → 45) completes, then Edvin holds the corresponding errand records and the loop exits cleanly.

### R8 — End-of-flow "additional request" restart · **Must**
- **Source:** ETG's Collaboration Hour request #3, Christina/Olga, Slack `#zingtee-etg-squad`, 2026-07-15: *"We need a button at the end of the flow in cases the customer has an additional request (not changed his mind)."*
- **Requirement:** Node 47 offers an additional-request path; selecting a different contact reason updates the Zendesk contact reason field and restarts the flow with loop state cleared (node 29).
- **AC-8.1** — Verified working in the 27 July call: selecting a new contact reason through the additional-request flow updates the ticket's contact reason field.

## 5. Data contract

| Name | Type | Set where | Read where | Default / fallback |
| :---- | :---- | :---- | :---- | :---- |
| `transforms.channel`, `transforms.category` | Edvin config objects `{id,name,categories}` | node 46 | nodes 1, 2 | — |
| `transforms.customer_action_pnrs` | array of PNR items | node 2, restitched node 27 | nodes 12, 25, 27 | `[]` |
| `actions_array[].bucket` | string (`bucketKey`) | node 2 | node 27 routing | silent ticket |
| `transforms.child_tickets` | array | node 27 | node 32 loop | `[]` (guarded at node 3) |
| `child_tickets_count`, `grandchild_tickets_count` | form data counters | nodes 27/32/36 | nodes 34, 38 | 0 |
| `is_more_child_tickets`, `is_grandchild_tickets`, `is_more_grandchild_tickets`, `is_more_pnrs`, `isMorePNR` | booleans, form data | loop scripts | nodes 3, 11, 34, 35, 38 | false |
| `custom_field_29658558478738` | Zendesk contact reason | Zendesk | nodes 2, 46 | — |
| Zendesk channel identifier (`zingtree.channels.phone`) | string | **unresolved** — read from var `zendeskChannelIdentifier` (node 24), agent list box interim | node 24 / node 1 | see CR-004 |
| `errand_api_path` | string `fl_paths` \| `sc_paths` | node 24 (default `fl_paths`) | node 42 GET Edvin Errands (picks FL vs SC config) | `fl_paths` |
| `agent_group_role` | string `FL` \| `SC` | **new** — node 24, from `group_memberships` API + CSV map | node 24 sets `errand_api_path` | `FL` |

**Connected Object dependency (build constraint):** the Zendesk ticket-create calls are Data nodes bound to org-113 Connected Objects — Create Child Ticket = CO **#20** (node 33), Create Grandchild = CO **#151** (node 37), Update Tags = CO #54, Get Side Conversations = CO #158, Edvin Register = CO #160, Find Order #23, GET Errands #159/#167. **These HTTP body templates are not in the tree JSON export** — they live in the Zingtree org. Any field the tree wants Zendesk to receive (e.g. ticket `status`) must be mapped inside the Connected Object body, which is edited in the Zingtree app, not this file. See Q9.

House rules apply (`Zingtree Builder/MEMORY.md`): scalars → `ZT.setFormData`; objects/arrays/HTML → `ZT.setTransformData`; reads via `ZT.getVariableValue("name", default)`. Transforms expire after 1 hour; node 29 clears loop state so the additional-request loop restarts clean.

## 6. Integrations

| System | Node | Direction | Trigger | Failure behavior |
| :---- | :---- | :---- | :---- | :---- |
| Edvin — Find Order | 4 | out | tree load | *unspecified* **[inferred gap — see Q6]** |
| Edvin — GET Errands (errand configuration) | 42 | out | after passenger selection | *unspecified* **[inferred gap — see Q6]** |
| Edvin — Register Errand | 43 | out | register loop | *unspecified* **[inferred gap — see Q6]** |
| Zendesk — Update Tags | 31 | out | after grouping | — |
| Zendesk — Create Child Ticket | 33 | out | child loop | — |
| Zendesk — Create Grandchild Ticket | 37 | out | grandchild loop | — |
| Zendesk — Get Side Conversations | 40 | in | before grandchild loop | — |
| Zendesk — Add Internal Note | 22 | out | after ticket creation | — |

Edvin config caching delays propagation ~30–60 minutes (workshop, 2026-07-16). Edvin's own errand tree is large (~147 objects, ~2 MB) — load-time caution noted at the 6 July API sync.

## 7. Edge cases & failure modes

- **Empty child-ticket set** → node 3 guard routes to node 21; node 32 must never run unguarded (it creates a Zendesk ticket unconditionally). *Regression-critical.*
- **API returns objects where a scalar is expected** (`channel`, `category`, `bucket`) → must be reduced at the producer (nodes 2/46); rendering raw yields `[object Object]`, `.trim()` yields `no member 'trim'`. Both were live defects on 2026-07-26.
- **Agent restarts inside the same ticket** → currently duplicates entries. See CR-002.
- **Contact reason with no Edvin category** (`contact_reason__schedule_change`) → no mapping exists; behaviour unspecified. See Q5.
- **Edvin API error / timeout** → not specified. See Q6.
- **Session resumed after 1 hour** → transforms expired; behaviour not specified. **[inferred gap]**

## 8. Non-functional & compliance

- **PII:** the tree handles passenger names, PNRs and order data from Edvin and writes them into Zendesk tickets and internal notes. No new storage is introduced by this tree beyond Zendesk and Edvin.
- **Environments:** built and tested in **production** (org 113) to date — Brent flagged at the 21 July collaboration meeting that replicating production in Zendesk Sandbox is costly because custom field IDs differ. CR-007-adjacent work (the sandbox stand-up) reverses that for agent testing.
- **Security:** an Edvin/Zingtree **API key was exposed on screen share** during the 27 July workshop and Brent committed to rotating it. Tracked as an action item, not a requirement.
- **Access control:** the Zingtree-mandatory field enforcement (CR-006) is an authorization change in Zendesk — role permissions are set by Somik on ETG's side, not by this tree.

## 9. Open questions

| # | Question | Blocking? | Asked of | Answer / date |
| :---- | :---- | :---- | :---- | :---- |
| Q1 | Silent tickets — target Zendesk status: `solved` or `closed`? | ~~BLOCKING~~ **ANSWERED** | Olga Gerothanasi | **Brent 2026-07-27: resolved/closed.** Build note: the Zendesk API cannot *create* a ticket in `closed` (terminal, automation-only); the create call accepts `new/open/pending/hold/solved`. Silent tickets are created `status: "solved"`; Zendesk automation later moves them to `closed`. ([Zendesk: solved vs closed](https://support.zendesk.com/hc/en-us/articles/4408887712154), [ticket lifecycle](https://support.zendesk.com/hc/en-us/articles/8263915942938)) |
| Q2 | How is the agent's group (FL vs SC) determined at runtime? | ~~BLOCKING~~ **ANSWERED** | Somik Mukherjee | **Somik DM 2026-07-24/25:** groups are set when the agent assigns the ticket, unrelated to customer/contact reason. Call `GET /api/v2/users/{userId}/group_memberships`; map each `group_id` → role via Somik's CSV `belongs_to` column (Customer Care/CNX/WNS = **FL**, Schedule Change / Schedule Change FF = **SC**, Training = **both**). Somik: *"if it is firstline or schedule change as per my csv, you can decide what happens then."* For training/both-group agents where a single value is forced, default **FL**. |
| Q3 | Where does the Zendesk channel identifier (`zingtree.channels.phone`) come from? | **BLOCKING** (CR-004) | John Ruberto; Anders Berg (Elis on leave ~2 weeks) | — |
| Q4 | Does Zendesk filter visible contact reasons by agent group? | no | Somik Mukherjee | — |
| Q5 | `contact_reason__schedule_change` has no Edvin category — how should it be handled? | no | Elis Taraj (Brent asked in `#zingtee-etg-squad`, 2026-07-27 00:52 MDT) | — |
| Q6 | What should the agent see when an Edvin call fails or times out mid-flow? | no | ETG (never specified) | — |
| Q7 | Can each Edvin category carry its matching Zendesk contact-reason value so the mapping in R2 can be dropped? | no | Elis Taraj (Brent asked, `#zingtee-etg-squad`, 2026-07-27 00:52 MDT) | — |
| Q8 | Sandbox scope — does "ready Wednesday" mean the environment, or all ~15 FL+SC use cases runnable? | **BLOCKING** for CR-007 sizing | Meni Kyritsi / Brent | — |
| Q9 | Does Create-Child-Ticket Connected Object #20 (and #151) pass the child-ticket object's fields through to the Zendesk POST body, so a new `status` field flows automatically — or is the body a fixed template that must be edited in the Zingtree app to add `status`? | **BLOCKING** for CR-001 to work end-to-end | Brent (only he can see the CO config) | — |

## 10. Assumptions

- **A1** — The temporary manual channel list box stays until Q3 is answered, and is removed thereafter (stated in the 27 July call, affects R1/CR-004).
- **A2** — Sandbox agent testing runs against **production Edvin orders**; no synthetic dataset is built. Brent: *"as long as we have access to great tickets and Edvin. I think we can still use production orders from Edvin."* (affects CR-007).
- **A3** — Chargeback filtering ships as a static ID list this round, not dynamic (agreed 20 July; affects §3).
- **A4** — CR-007's Finish path repurposes node 23 as the terminal display rather than adding a new "done" node — its existing Success copy ("All PNR's are resolved…") already reads as complete, and adding a node would be pure duplication. Node 47 is retired outright rather than repurposed, since its only content was a placeholder pass-through. Brent direct, 2026-07-29 — flagged for his review at build time; not blocking.

## 11. Traceability

| Req | Edit(s) | Test(s) | Status |
| :---- | :---- | :---- | :---- |
| R1–R8 | — (pre-existing build) | Olga's 7/28 end-to-end pass | Built, in test |
| CR-001 → R9 | — | — | Blocked on Q1 |
| CR-002 → R10 | — | — | Ready to build |
| CR-003 → R11 | — | — | Blocked on Q2 |
| CR-004 → R12 | — | — | Blocked on Q3 |
| CR-005 → R13 | — | — | Blocked on Olga |
| CR-006 → R14 | — | — | Ready to build |
| CR-007 → R15–R17 | Node 29 (R17 only — see note) | Static + harness sim, 2026-08-03 | R17 built, pending Brent's approval. R15/R16 (node 23 Finish/End-Session split, node 47 retirement) — **already present in the live export** (node 23 has "Additional Request" + "End Session" buttons) but not built by this session; node 47 was not retired as R15 specifies. Not verified here. |
| CR-008 → R18 | Node 12, Node 27 | Static + harness replay of real 334582 **and** 334577 session data, 2026-08-03 | **Built and confirmed working in production.** Node 12 + node 27 ID-matching was imported by Brent (tree modified 10:22) and ticket 334577 at 10:58 produced the matrix-correct 1 child + 2 grandchildren with both buckets resolving to `Proceed`. Q11 answered — no read-timing defect. One follow-up shipped as v17 (below). |
| CR-009 → R19 | Node 27 (non-proceed branch) | Full CSV matrix Tests 1–8 + mixed case, 2026-08-03 — 12/12 assertions pass | Built in v18, pending Brent's approval |
| CR-010 → R20 | Node 44 | Harness: session-var and findorder-fallback paths, 2026-08-03 | Built in v18, pending Brent's approval. **AC-20.4 needs a live run** — and Q12 (does CO #184 map from the loop item?) is still open. |
| CR-008 follow-up (v17) | Node 27 only | Harness replay of 334577 with stale transforms pre-seeded, 2026-08-03 — 6/6 assertions pass | **Awaiting Brent's import.** The unresolved-selection warning banner added alongside R18 read `transforms.unresolved_selections`, which `ZT.setTransformData` does not refresh mid-script — so it echoed the *previous* run's value (transforms persist ~1h) and printed a false WARNING on the otherwise-correct 334577 note. v17 passes the list to the note builder by argument instead. File: `Register Errands - Dynamic (v17 warning-scope fix 2026-08-03).json`. Cause was a Wes-side test-harness error (the v16 harness stubbed `transforms` so writes read back, which Zingtree does not do), not an ETG requirement change. |
| CR-011 → R21, R22 | Nodes 32, 36, 44, 17 (new), 14, 16, 10, 29 | `validate_tree` 0 problems; `etg-errand-regression` 64/64; `walk.mjs` graph-replay scenarios `back_at_25` and `gc_first_unconfirmed_then_replay`, 2026-08-05 | Built in v35, pending Brent's approval and import. Stage B (browser) not run. |
| CR-012 → R23 (supersedes R19) | Node 27 — no change required, the code already behaves this way | `etg-errand-regression` 64/64 with `oracle.js` R4 corrected, 2026-08-05 | Confirmed by Brent in session 2026-08-05. Doc-only change; the stale artifact was the harness answer key, not the tree. |
| CR-013 → R24 | Node 21, Node 22 (exact node treatment is the factory's call) | `etg-errand-regression` + `walk.mjs` `back_at_25` scenario extended to assert single note-post (recommended, not yet run) | Ready to build |
| CR-014 → R25 | Node 22 / CO #178 (auth config + request payload) | — | Blocked on Q14 |
| CR-015 → R26, R27 | R26: new nodes 90 (Scoring guard), 91 (Content retry screen); node 22 continuation redirected 44→90 | `graph_walk.mjs` full suite re-run against the built file — 12 unaffected scenarios unchanged, `nothing_selected_unresolved`/`stale_action_id_from_other_type` now land cleanly at node 91 instead of crashing | **R26 built** in `Register Errands - Dynamic (v41 R26 unresolved-selection guard, 2026-08-25).json`, Stage A passed, pending Brent's approval + Stage B + import. R27 still blocked on Q15 — not built. |

## 12. Change requests (amendments)

### CR-001 — Silent tickets auto-close; actionable tickets stay open
| | |
| :---- | :---- |
| **Date agreed** | 2026-07-27 |
| **Requested by** | Olga Gerothanasi, Process, Etraveli |
| **Source** | `Call Reviews/2026-07-27 ETG (Etraveli) - Flow test results.md` · Spiky "Flow test results" |
| **Type** | New behavior |
| **Status** | Agreed — blocked on Q1 |

**The ask (verbatim)**
> "we expect Silent Tickets to be auto closed" … "everything that is silent should be auto resolved" … "only the actionable child tickets and task will remain open"

**Interpretation**
The tree currently sets no status on the tickets it creates. It must set a terminal status on silent tickets at creation and leave actionable child and grandchild tickets open.

**Effect on the existing spec** — Amends R5. Adds R9.

#### R9 — Ticket status on creation · **Must**
- **Requirement:** Silent tickets are created with the agreed terminal status; actionable child tickets and all grandchild tickets are created open.
- **AC-9.1** — Given a bucket that produces a silent ticket, when it is created, then its Zendesk status is the agreed terminal value and it requires no agent action.
- **AC-9.2** — Given an actionable child ticket, when it is created, then its status is open.

**Open questions** — Q1 (BLOCKING): `solved` vs `closed`.

**Regression risk** — Ticket-status changes interact with ETG's Zendesk automations and with the open question of whether a child can be closed while its grandchild is open (Olga raised it; Brent said that is Zendesk configuration, not the tree). Re-run AC-5.1, AC-5.2, AC-6.1.

---

### CR-002 — Restarting inside the same ticket duplicates entries
| | |
| :---- | :---- |
| **Date agreed** | 2026-07-27 |
| **Requested by** | Surfaced by Brent, confirmed with Olga |
| **Source** | Spiky "Flow test results" 2026-07-27 |
| **Type** | Bug / defect |
| **Status** | Agreed — ready for build |

**The ask (verbatim)**
> Brent: "if you restart, I think it's doubling the information. But if you create a new ticket and you go through Zingtree the first time, it's working… I know how to fix that." / "I'll look at what I think is causing this and it should fix it for everything, but you won't see that tomorrow."

**Interpretation**
Loop state and/or accumulated arrays are not fully cleared on restart within a session, so a second pass appends rather than replaces. Suspect node 29 (Clear Data) coverage and the counters listed in §5.

**Effect on the existing spec** — Adds R10.

#### R10 — Restart is idempotent within a ticket · **Must**
- **AC-10.1** — Given a completed run on ticket X, when the agent restarts the flow on the same ticket and completes it again, then the final screen and the parent internal note show exactly the tickets created by the second run, with no duplicates carried from the first.
- **AC-10.2** — All loop counters and boolean flags in §5 reset to their defaults on restart.

**Regression risk** — Node 29 also serves the R8 additional-request loop. Re-run AC-8.1 and AC-5.1.

---

### CR-003 — Group selection for agents in both FL and SC
| | |
| :---- | :---- |
| **Date agreed** | 2026-07-27 |
| **Requested by** | Olga Gerothanasi (testing need), offered by Brent |
| **Source** | Spiky "Flow test results" 2026-07-27 |
| **Type** | New behavior |
| **Status** | Agreed — blocked on Q2 |

**The ask (verbatim)**
> Brent: "if Olga has both, let her choose if she wants to be first line or schedule change right now" — "I will do it right now."

**Interpretation**
When the agent belongs to more than one group, present a selection so they choose which group's errand configuration to load; single-group agents see no extra screen.

**Effect on the existing spec** — Amends R3. Adds R11.

#### R11 — Multi-group agent selection · **Should**
- **AC-11.1** — Given an agent in both FL and SC, when the tree loads, then a group selection is shown and the chosen group's Edvin configuration is requested.
- **AC-11.2** — Given an agent in exactly one group, when the tree loads, then no selection is shown and behaviour is unchanged.

**Open questions** — Q2 (BLOCKING): how group membership is read.

---

### CR-004 — Replace the temporary channel list box with the real Zendesk channel identifier
| | |
| :---- | :---- |
| **Date agreed** | 2026-07-27 |
| **Requested by** | Olga Gerothanasi (blocker), fix owned by Brent |
| **Source** | Spiky "Flow test results" 2026-07-27 |
| **Type** | Change to existing behavior |
| **Status** | Agreed — blocked on Q3 |

**The ask (verbatim)**
> Brent: "So we created this field, Zendesk channel identifier, and it equals zingtree.channels.phone." … "I just don't recall where we get that field from. So I need to ask John tomorrow on our call."
> Olga: "Ellis is on leave for a couple of weeks, but they added, I think, someone to the Slack, which is Anders Bert."

**Interpretation**
Channel was previously derived from `genesys_interaction_type`, which ETG retired in favour of the Zendesk ticket channel field (Somik, `#zingtee-etg-squad`, 2026-06-29). The replacement source in the Edvin/Zendesk model is not yet identified. A manual list box (phone / chat / email) stands in so testing can proceed.

**Effect on the existing spec** — Amends R1 and the §5 data contract row.

#### R12 — Channel resolved automatically · **Must**
- **AC-12.1** — Given a ticket of any supported channel, when the tree loads, then the channel is resolved without agent input and the temporary list box is gone.
- **AC-12.2** — Given the channel cannot be resolved, then the agent sees a clear message rather than a silent failure.

**Open questions** — Q3 (BLOCKING).

---

### CR-005 — VI (Virtual Interlining) flow: booking.com vs non-booking.com routing
| | |
| :---- | :---- |
| **Date agreed** | 2026-07-27 |
| **Requested by** | Olga Gerothanasi |
| **Source** | Spiky "Flow test results" 2026-07-27 |
| **Type** | New behavior |
| **Status** | Agreed — blocked on Olga's build |

**The ask (verbatim)**
> Olga: "there is one additional need we need to have different information for booking.com and for non-booking.com… it could be an API logic like if it's booking.com go here. If it's not booking.com, go there." … "if partner is booking.com. But it's not for all the high-level trees. It's for that VI tree."
> Brent: "once you get this more comfortably working and better with what you needed to do, let me know, and I'll make it a part of the larger flow."

**Interpretation**
VI is used where an itinerary combines airlines with no interlining; agents must offer alternatives in a prescribed sequence. Olga builds two branches between PNR selection and the customer-decision page; Brent adds routing on the API `partner` field. Scoped to the VI tree only, not all high-level trees.

**Effect on the existing spec** — Adds R13.

#### R13 — Partner-based VI routing · **Should**
- **AC-13.1** — Given `partner` = booking.com on the order, when the agent reaches the VI decision point, then the booking.com branch is taken; otherwise the non-booking.com branch.

**Open questions** — Olga's branches do not exist yet (she committed to building them 7/28). ~~Whether VI lives as a separate tree or inside this one was raised and not resolved.~~ **RESOLVED 2026-08-04:** VI gets its own tree, with the PNR loop removed — decided on the 2026-08-04 "Zingtee - ETG Collaboration Hour" call (`Call Reviews/2026-08-04-ETG (Etraveli).md`, Brent owes #5: *"I do agree that a different tree will make it easier to edit this logic as well."*). Rationale: VI PNRs are segments of one trip, not independent legs (Olga), which makes the journey structurally different from this tree's per-PNR loop — a hard-fork case, not a CR, per the requirements house rule.

**Pointer** — Full VI requirements (including R13's booking.com/non-booking.com routing, carried forward as that doc's R9) now live in `Zingtree Builder/Requirements/ETG/vi-errand-registration-requirements.md` (new build doc, created 2026-08-05). R13's text above is unchanged and still describes this doc's original CR-005 ask; the new doc is where VI's build-ready spec is tracked going forward.

---

### CR-006 — Zingtree-mandatory field: false on load, true on completion
| | |
| :---- | :---- |
| **Date agreed** | 2026-07-27 |
| **Requested by** | John Spanidis / Meni Kyritsi, Etraveli (workshop outcome) |
| **Source** | Spiky " Mandatory Zingtree Approach - Working Workshop" 2026-07-27 · John Ruberto's notes, Slack `#customer_etraveli`, 2026-07-27 09:23 · Gmail "Alignment Needed: Mandatory Zingtree Approach for Errand Restructure Go-Live", Meni Kyritsi, 2026-07-22 |
| **Type** | New behavior |
| **Status** | Agreed — pending ETG business approval at workshop #2 (Tue 7/28) |

**The ask (verbatim)**
> Meni (email, 7/22): "we aligned on the need to make Zingtree mandatory within the agent workflow… Agents cannot bypass the process by manually updating key fields in Zendesk."
> Brent (workshop): "In production, we'll need to apply this to the rebooking flow, the name change flow, or the name correction change flow, and all of the errand flows that are coming soon."
> Notes: "the Zingtree field should default to true globally, then be set to false at the start of any Zingtree workflow and back to true upon successful completion."

**Interpretation**
A Zendesk field (created by Somik) gates the "Submit as Resolved" button. The tree sets it false on load and true on successful completion. Defaulting to `true` globally avoids breaking flows that have not yet been updated.

**Effect on the existing spec** — Adds R14.

#### R14 — Mandatory-journey enforcement field · **Must**
- **AC-14.1** — Given the tree loads on a ticket, when the first node renders, then the Zingtree-mandatory field is set to `false` and the ticket cannot be resolved.
- **AC-14.2** — Given the agent completes the flow, when the closing node is reached, then the field is set to `true` and the ticket can be resolved.
- **AC-14.3** — Given an admin or team leader with override permission, then they can set the field manually (ETG-side Zendesk role config, not this tree).

**Known limitations recorded at the workshop**
- The Zendesk error message persists after the field flips, because Zingtree runs in an iframe and cannot reload the parent page. No agreed fix yet — options discussed were a status change to force a refresh, a save/reload button, or a dynamic banner.
- A window remains where an agent can resolve a ticket before loading Zingtree at all (raised by John Spanidis).

**Regression risk** — Applies across rebooking, name-correction and errand flows, not just this tree. Each needs its own re-test.

---

### CR-007 — Missing "done" exit causes duplicate child tickets on loop-back
| | |
| :---- | :---- |
| **Date agreed** | 2026-07-29 |
| **Requested by** | ETG agents (bug reports via Zendesk tickets); fix scoped by Brent, root cause diagnosed by Wes |
| **Source** | Zendesk tickets 7601204 and 7621694-adjacent testing (agent-reported "double child tickets"); Wes's root-cause read of the live tree export, tree 139367450, 2026-07-29; **Brent direct, 2026-07-29** (no call transcript or customer quote for this one — flagging that explicitly since every other CR in this doc carries a verbatim quote and this one doesn't) |
| **Type** | Bug / defect — but the root cause is a missing UX exit, not a code error; the fix is a flow change |
| **Status** | Agreed — **ready for build** |

**The trigger (no verbatim customer quote available — see Source)**
ETG agents reported "double child tickets" on live Zendesk tickets. Wes root-caused it against the tree 139367450 export: there is no code defect. The tree simply has no "done" exit. Every successful registration ends at node 23 ("Closing Call") with a single button, "Additional request," which routes through node 47 ("Additional request" — an effectively empty screen, `node_name` blank, content literally `<p>Additional request</p>`, one button "Continue") → node 29 ("Clear Data") → node 4 ("Edvin - Find Order," fresh intake). An agent who is actually *done* has no way to stop — they either loop back voluntarily or the pattern gets triggered again, and each additional loop posts another internal note and creates another child ticket against the same Zendesk ticket.

**Interpretation**
The flow needs an explicit two-way choice at the point of success — *Finish* vs *Register an additional request* — where today there is only the one path back into intake. This is a structural gap, not a state-clearing bug (that's CR-002/R10, still separately in force): even a perfectly idempotent additional-request loop doesn't help an agent who never wanted to loop in the first place.

**Effect on the existing spec** — Extends R8 (CR-002's forebear): the additional-request path itself keeps its original intent (offer to register another errand on the same ticket) but its implementation moves off node 47 and picks up a fuller state reset. Amends R14 (CR-006): the "closing node" trigger in AC-14.2 for flipping the mandatory-field to `true` is now specifically the *Finish* action, not mere arrival at node 23 — see AC-16.3. Adds R15, R16, R17.

#### R15 — Explicit Finish / Register-additional-request choice on completion · **Must**
- **Requirement:** Node 23 ("Closing Call") presents two buttons where today there is one: **"Finish"** and **"Register an additional request."** Node 47 is retired — its content served no purpose beyond a single pass-through "Continue" button, and removing it collapses one redundant screen out of the path. The "Register an additional request" button routes directly to node 29 (Clear Data), skipping node 47 entirely.
- **AC-15.1** — Given the flow reaches node 23, when it renders, then the agent sees exactly two buttons, "Finish" and "Register an additional request" — the old single "Additional request" button no longer exists.
- **AC-15.2** — Given the rebuilt tree, when exported, then node 47 no longer exists (or, if the platform requires an orphaned node ID to remain, it has zero inbound routes from anywhere in the tree).
- **AC-15.3** (**Should**, readability) — Node 23's node-name/title is updated to reflect its new dual-purpose role (it's no longer purely a "closing" screen — it's the fork point), so the tree reads clearly node-to-node for the next person who opens it.

#### R16 — Finish branch reaches a true terminal state · **Must**
- **Requirement:** Selecting "Finish" ends the session on node 23's existing success content — no button, no next node, no further routing. It must not call node 29, must not call node 4, must not post an additional internal note, and must not create an additional child, silent, or grandchild ticket.
- **AC-16.1** — Given the agent selects "Finish," when the session ends, then no further Zendesk or Edvin calls occur — the ticket's internal-note count and child/silent/grandchild ticket counts are exactly what the run already produced, unchanged by the Finish click itself.
- **AC-16.2** — Given the agent selects "Finish," when the ticket is inspected afterward, then no additional child ticket has appeared — this is the direct regression test closing the "double child ticket" defect for the Finish path.
- **AC-16.3** — Given the flow reaches node 23 as part of a loop (the agent is looking at the fork, about to choose), when node 23 renders, then the Zingtree-mandatory field (R14/CR-006) remains `false`. It flips to `true` only when "Finish" is the button actually selected — not merely on arrival at node 23 — so an agent can't get the ticket resolvable while a second errand is mid-registration.

#### R17 — Additional-request branch fully resets loop and cursor state before re-entering intake · **Must**
- **Requirement:** The "Register an additional request" path must clear more than node 29 clears today. Node 29's current scope (`selected_pnrs, customer_action_pnrs, actions_array, final_pnrs, internal_note_details, child_tickets, pnr_buckets, current_child_ticket, child_ticket`, and counters `child_tickets_count, grandchild_tickets_count`) is **not sufficient** — it does not touch `current_pnr, pnr_index, isMorePNR, pnr_banner, customer_action_table_html`, or the flags `is_more_pnrs, is_grandchild_tickets, is_more_grandchild_tickets`, which today are only reset by node 10 (the tree's root/Restart node). The additional-request branch must reset **all** of the above — node 29's existing set plus the node-10-only set — before node 4 reloads.
- **AC-17.1** — Given an agent completes one errand and selects "Register an additional request," when node 4 reloads, then every variable in the full reset list (node 29's set + the node-10-only set above) reads its default/empty value.
- **AC-17.2** — Given the second errand pass runs to completion, when it creates child/silent/grandchild tickets, then those tickets and the parent internal note reflect only the second errand's own selections — no PNRs, actions, or banner text carried over from the first pass.
- **AC-17.3** — Given the additional-request path completes, when the parent ticket is inspected, then it carries exactly one new internal note and the correct count of new child/silent/grandchild tickets for the second errand — not a duplicate of the first run's note or tickets. This is the direct regression test closing the "double child ticket" defect for the loop-back path.

**Open questions** — None blocking. The node-placement, terminal-approach, and reset-scope calls above are Mira's recommendation per Brent's steer (see A4, §10); flag for his sign-off at build review, but they don't block the factory.

**Regression risk** — Touches node 23, retires node 47, and broadens node 29's clear scope (or adds a call into node 10's reset logic). Re-run: AC-8.1 (R8 — contact-reason update still works through the new routing); AC-10.1/AC-10.2 (CR-002/R10 — restart idempotency; R17 broadens the same concern, don't treat R10 as already covering it); AC-5.1/AC-5.2 (child-ticket creation guards); AC-6.1 (parent internal note); AC-14.1/AC-14.2 (CR-006/R14 — mandatory-field flip now keyed to the Finish action specifically, per AC-16.3).

---

### CR-008 — Action selection must resolve by identity, not display name (root cause: Proceed actions resolving to Silent tickets)
| | |
| :---- | :---- |
| **Date agreed** | 2026-08-03 |
| **Requested by** | Olga Gerothanasi, Process, Etraveli (bug report) |
| **Source** | Olga Gerothanasi, Slack (quoted by Brent, 2026-08-03), re: ticket 334582 — timestamped `[2:16 AM]`, day not stated in the quote. Root cause diagnosed by Dudley against the live tree export (`Register Errands - Dynamic`, tree 139367450, nodes 12 and 27) and cross-checked against `ETG_ZT errand tracker - Testing (1).csv`. |
| **Type** | Bug / defect |
| **Status** | Agreed — ready for build (one non-blocking open question, see Q10) |

**The ask (verbatim)**
> Olga Gerothanasi, Slack, re: https://etraveligroup1752742116.zendesk.com/agent/tickets/334582 — "both actions selected are 'Proceed' but we have 2 silent tickets instead of Actionable child/grandchildren"

**Interpretation** *(revised 2026-08-03 against the actual 334582 session dump — supersedes this CR's initial name-collision hypothesis, which the live data disproved)*

The live tree's node 12 renders each dropdown option with the action's **ID** as the option value (`<option value="1913">Interaction disconnected - no response</option>`, confirmed in `transforms.customer_action_table_html` in the 334582 dump). Node 27 then resolves that submitted value by **display name** — `actionsArray.find(action => action.name === selectedActionName)`. ID in, name compared: the lookup can never match, so every PNR falls to `bucket: ""` → the `default` bucket → a Silent ticket, regardless of what the agent actually picked. In 334582 the agent picked action 1863 (`Customer requested Supervisor - Escalated`, bucket **Proceed**) for CTP2HN and 1895 (`Information updated`, bucket **Proceed**) for CTR2QG; both landed as Silent tickets with blank buckets.

Two things follow, and only the first is certain:
1. **Certain:** node 12 and node 27 disagree on the selection's identity space (ID vs. name). Verified by replaying the live node 27 script against 334582's real `actions_array` and submitted values — reproduces `Child: 0, Silent: 2, Grandchildren: 0` exactly.
2. **Not yet certain:** the dump's stored `customer_action` is `""` rather than `"1863"`. Node 27 assigns `customer_action` from the raw read, so an empty value implies `ZT.getVariableValue("customer_action_CTP2HN_0", "")` returned empty *at node-27 execution time*, even though the session ends with that variable set to `1863`. If the read itself is failing (timing/scope of `zt-data` select capture) rather than merely mismatching, identity-based matching is **necessary but not sufficient** — see Q11.

This sits upstream of the CR-002/CR-007 loop-state issues and of the grandchild grouping logic already verified correct against the test matrix (Tests 1–8).

**Effect on the existing spec**
- Supersedes: none.
- Amends: R4 (§4) — per-PNR action capture must resolve unambiguously to one `actions_array` entry, not to the first name match.
- Adds: R18 (below).
- Unaffected: R5 grouping/grandchild logic (verified correct against the CSV test matrix); CR-002/CR-007 loop-state work (separate defect, tracked there — see Q10 note on how the two were told apart).

**New / restated requirements**

#### R18 — Action selection resolves by identity, not display text · **Must**
- **Source:** Olga Gerothanasi, Slack, ticket 334582 (quoted above).
- **Requirement:** The action dropdown (node 12) and the selection stitch-back (node 27) must key on each action's stable identifier (e.g. `actionId`) rather than its display `name`. The dropdown may still de-duplicate visually-identical rows, but only when name **and** identifier **and** bucket all match — never on name alone. The stitched `customer_action` record must carry the bucket and `edvin_actions` detail from the exact action the agent picked, never a same-named neighbor.
- **AC-18.1** — Given an `actions_array` with two entries sharing a display `name` but different `actionId`/`bucket`, when the agent selects one from the dropdown, then the bucket and `edvin_actions` applied downstream match the selected entry's own identifier, not the first name match.
- **AC-18.2** — Given the current (no-collision) case, when the agent selects an action, then behavior is unchanged from today — this is a reliability fix, not a UI change.

**Edge cases introduced**
- Edvin actions with a missing/null `actionId` — fall back to name-matching only for that entry (no worse than today), but log it so a real ID gap in Edvin's config surfaces.

**Open questions**
| # | Question | Blocking? | Asked of | Answer / date |
| :---- | :---- | :---- | :---- | :---- |
| Q10 | Does ticket 334582's Edvin errand-configuration response actually contain two same-named actions with different buckets under "Change customer's personal information"? | ~~No~~ **ANSWERED — moot** | Brent / Elis (Edvin config) | **2026-08-03: No.** The 334582 dump shows five distinct action names under both Apis/Docs and Phone/address, no collisions. The name-collision hypothesis was wrong; the real defect is the ID-vs-name mismatch in the revised Interpretation above. |
| Q11 | At node-27 execution time, does `ZT.getVariableValue("customer_action_<PNR>_<i>", "")` return the submitted option value (e.g. `"1863"`), or empty? | ~~BLOCKING~~ **ANSWERED** | Brent | **2026-08-03: the read works.** Ticket 334577's session dump (captured at node 44) shows both picks resolved correctly — `actionId: 1973 / 1961`, `bucket: "Proceed"` on both PNR records, 1 child + 2 grandchildren created. So node 27's variable read was never the problem; the 334582 failure was purely the ID-vs-name mismatch, which R18 fixes. No read-timing defect exists. |
| Q12 | Edvin `registerErrand` returns HTTP 400 `"ILLEGAL ARGUMENT(S): OrderReference should not be null/empty."` (ticket 334577, 2026-08-03). `orderReference` exists as a session variable (`1122-756-731`) but the records in `transforms.final_pnrs` — which node 44 feeds to the Register Errand Connected Object (#160) — do not carry it. Does CO #160 read `orderReference` from the loop item, from session/form data, or from a fixed body template that needs editing in the Zingtree app? | **BLOCKING for R7** (no errand is actually being registered in Edvin) | Brent (only he can see the CO config) | — |

**Regression risk** — Touches node 12 (dropdown) and node 27 (stitch), which every errand type routes through. Re-run: R4/AC-4.1 (consolidation), all of R5/AC-5.1–5.2 (child/silent/grandchild creation), and the full CSV test matrix (Tests 1–8) — none of those should change; they're the safety net this fix must not disturb.

---

### CR-009 — Do-not-proceed PNRs must produce exactly ONE silent ticket
| | |
| :---- | :---- |
| **Date agreed** | 2026-08-03 |
| **Requested by** | ETG (defined in the errand-tracker test matrix); deviation surfaced by Dudley |
| **Source** | `ETG_ZT errand tracker - Testing.csv` (supplied by Brent, 2026-08-03) — Tests 5, 6a, 6b, 8 |
| **Type** | Bug / defect — code deviates from the agreed matrix |
| **Status** | Agreed — built, pending Brent's approval |

**The ask (from the test matrix, not a verbal quote)**

| Test | Use case | Expected outcome | Errands in Edvin |
| :---- | :---- | :---- | :---- |
| 5 | Different type, different action, both do NOT proceed | 1 silent | 2 errands |
| 6a | Same type, different action, both do NOT proceed | 1 silent | 2 errands |
| 6b | Same type, same action, both do NOT proceed | 1 silent | 1 errand |
| 8 | Same type, different action, Different request + Do not proceed | 1 silent | 2 errands |

**Interpretation**
The proceed and non-proceed sides of node 27 are **not symmetrical**, and the matrix says so explicitly. Proceed PNRs collapse into one active Child ticket with one grandchild per distinct (type+action). Non-proceed PNRs collapse into **one Silent ticket, always** — no per-combo split and no grandchildren — even when they span different types, different actions, or different non-proceed buckets (`No action` and `Different request` together, per Test 8). The Edvin errand count is unaffected: still one errand per distinct (type+action), which is why Test 6b shows 1 errand and the rest show 2.

The shipped code applied the same distinct-(type+action) grouping to both sides, emitting 2 Silent tickets for Tests 5, 6a and 8. This predates CR-007 and CR-008 and was never covered by a requirement — R4/AC-4.1 only ever addressed child-ticket consolidation.

**Effect on the existing spec** — Amends R5. Adds R19.

#### R19 — Single consolidated silent ticket · **Must**
- **Requirement:** All PNRs whose resolved bucket is not `Proceed` produce exactly one Silent ticket, titled with every affected PNR, carrying no grandchildren — regardless of how many distinct types, actions or non-proceed buckets they span.
- **AC-19.1** — Given 2+ non-proceed PNRs with different types AND different actions, when node 27 groups them, then exactly 1 Silent ticket is created (Test 5).
- **AC-19.2** — Given 2+ non-proceed PNRs mixing `Different request` and `No action`, then still exactly 1 Silent ticket (Test 8).
- **AC-19.3** — Given a mix of proceed and non-proceed PNRs, then exactly 1 Child ticket and exactly 1 Silent ticket (ticket 334585 shape).
- **AC-19.4** — Edvin errand registration count is unchanged by this rule: still one errand per distinct (type+action).

**Known trade-off** — The single Silent ticket's `type` / `customer_action` / `bucket` fields show the first non-proceed PNR's values. Per-PNR detail is not lost overall: node 21's internal note enumerates every PNR with its own Contact Reason, Type, Customer Action and Bucket above the child-ticket summary. Flagging in case ETG wants the Silent ticket body itself to enumerate them — that would be a further CR.

**Regression risk** — Re-run the full matrix (Tests 1–8) plus AC-5.1 (node 3 empty-set guard) and AC-6.1 (parent internal note).

---

### CR-010 — Edvin registerErrand fails: orderReference never reaches the payload
| | |
| :---- | :---- |
| **Date agreed** | 2026-08-03 |
| **Requested by** | Surfaced by Dudley from ticket 334577's session dump |
| **Source** | Ticket 334577 session data at node 44, 2026-08-03 — `actions.edvin__register_errand._zt_meta.response` = HTTP 400 |
| **Type** | Bug / defect |
| **Status** | Agreed — built, pending Brent's approval and CO confirmation (Q12) |

**The evidence (verbatim from the API response)**
> `"ILLEGAL ARGUMENT(S): OrderReference should not be null/empty."` — HTTP 400, ticket 334577

**Interpretation**
R7 ("one errand per PNR registered in Edvin") has **not been working at all** — every run reaches node 43 and gets a 400 back. The Zendesk order reference *is* present in session (`orderReference` = `1122-756-731`, set by node 10 from custom field `33772689958162`), but node 44 hands Connected Object #184 a `current_pnr` record built by nodes 2/27 that never carried the field, so the CO had nothing to map. Earlier the same call returned a vaguer `"Invalid format/mapping at line 1, column 267"`, which was the same root cause presenting differently once buckets started resolving.

**Effect on the existing spec** — Amends R7 (which was recorded as satisfied but never actually verified against a 2xx response). Adds R20.

#### R20 — Register-errand payload carries the order reference · **Must**
- **Requirement:** Every item passed to the Edvin Register Errand call carries a non-empty `orderReference`, sourced from the Zendesk order-reference field with a fallback to the Find Order response.
- **AC-20.1** — Given a ticket with the ZD order-reference field populated, when node 44 sets the loop item, then `current_pnr.orderReference` is that value.
- **AC-20.2** — Given the ZD field is blank but Find Order returned an `orderReference`, then the Find Order value is used.
- **AC-20.3** — Given neither is available, then a warning is logged naming the PNR rather than posting a payload guaranteed to 400.
- **AC-20.4** — Given a completed run, when node 43 responds, then the response code is 2xx and Edvin holds one errand per distinct (type+action). **Only Brent can confirm this — it needs a live run.**

**Open questions** — Q12 (BLOCKING for AC-20.4): whether CO #184 reads `orderReference` from the loop item (in which case this fix is sufficient) or from a fixed body template that must be edited in the Zingtree app. The tree-side fix is safe either way; if the CO uses a fixed template, the field must also be added there.

**Regression risk** — Node 44 is the register-errand loop cursor. Re-run AC-7.1 (loop exits cleanly over N PNRs) and confirm the internal note (AC-6.1) is unaffected.

---

### CR-011 — Duplicate Zendesk tickets and a junk Edvin errand on loop replay
| | |
| :---- | :---- |
| **Date agreed** | 2026-08-05 |
| **Requested by** | Olga Gerothanasi (ETG) — "still receiving duplicate grand child tickets" |
| **Source** | ZD 334818 → child ticket 334823, order 1122-047-131. Screenshots: 3 grandchild side conversations (Y4JU9G twice, Y4K8XC once) under a child ticket whose own internal note reads `Grand Child Tickets: 2` |
| **Type** | Bug / defect |
| **Status** | Agreed — built in v35, pending Brent's approval |

**The evidence**

Node 27's grouping is correct and was never at fault: for this dataset (Y4JU9G / Voluntary - Fare rules and Y4K8XC / 24 hour rule, both `Sent to support` → Proceed) it produces exactly 1 child + 2 grandchildren, and the note says so. The extra ticket is created downstream, in the node 32→38 create loop, and only when that loop runs a **second** time over the same child ticket. Node 25 has Back enabled with `keep_vars_on_back = 1`, so Back + Continue re-fires node 27 and everything below it — a routine agent action, not an edge case.

Two independent defects were reproduced by a graph-walking replay driver (`walk.mjs`, which executes the real node bodies along the real continuation graph and counts actual create calls — the existing offline harness stubs the create loop and structurally cannot see either):

1. **The duplicate guards read confirmation, not attempt.** Nodes 13/15 route on `created_*_keys`, which nodes 14/16 write only on a confirmed 2xx (a deliberate v25 change, so a failed create would still be flagged and retried). A create Zendesk actually *made* but reported badly therefore stays unrecorded, and the replay makes a second one. The first grandchild is the likeliest victim: Zendesk materializes a side conversation's backing ticket asynchronously, node 41 waits 1 SEC and node 40 polls once, so the first grandchild create is the one racing that window. This is exactly the reported asymmetry — Y4JU9G duplicated, the acknowledged Y4K8XC correctly skipped.
2. **The Edvin errand loop has no guard and a non-resetting cursor.** Node 44 never clamped `final_pnrs_count` on entry nor reset it on exhaustion — the only cursor loop in the tree missing the house pattern that nodes 32/36 follow. After a complete pass the cursor sat at `final_pnrs.length`, so the replay read `final_pnrs[out-of-range] === undefined` and node 43 registered a **real Edvin errand carrying no type, no action and no PNR** against the customer's order:

> `register-errand item | pnr=undefined | orderReference=undefined | actionId=undefined | bucket=undefined`

**Why now, after v34** — v34 fixed node 27's idempotency (it had been stripping `actions_array`). On v33 a replay was *accidentally* blocked at node 51 because pass 2 reported `lookup_failed` on every PNR, so the create loop was never reached twice. v34 removed that accidental block and exposed both defects. This is a regression in observable behaviour, not in the v34 change, which was correct.

**Effect on the existing spec** — Amends R5 and R7 (both recorded as satisfied; neither was ever tested under replay). Adds R21, R22. Interacts with CR-002/R10 — see the open question below.

#### R21 — Ticket creation is idempotent under loop replay · **Must**
- **Requirement:** No Zendesk child, silent or grandchild ticket is created more than once per session for the same title, regardless of how many times the create loop is re-entered, and regardless of what the create call returned. The duplicate guard must record the **attempt**, before the call fires; confirmation records stay separate and feed only node 21's reconciliation warning.
- **AC-21.1** — Given a completed run, when the agent presses Back on node 25 and Continues, then no additional child or grandchild ticket is created.
- **AC-21.2** — Given a grandchild create that Zendesk made but reported non-2xx, when the loop replays, then that grandchild is **not** created again, and node 21 still warns that it could not be confirmed.
- **AC-21.3** — The reconciliation warning in node 21 continues to name any planned title not present in `created_*_keys` (regression guard on the v24/ZD 334468 behaviour).

#### R22 — Edvin errand registration is idempotent, and never fires without an errand · **Must**
- **Requirement:** One Edvin errand per distinct (type + customer action) per session, and no registration call for a cursor position with no item. `final_pnrs_count` clamps on entry and resets on exhaustion, matching nodes 32/36.
- **AC-22.1** — Given a completed run over N distinct (type+action) pairs, when the loop replays, then no further errand is registered.
- **AC-22.2** — Given a replay, then node 43 is never called with an undefined loop item.
- **AC-22.3** — Given the agent goes Back and genuinely **changes** a selection, then the new (type+action) pair registers normally — the guard suppresses repeats, not new work.

**Open question (raised by this CR, not blocking the build)**

| Q13 | After "Additional Request" (node 47 → 29), every guard key is cleared by design per CR-007/R17 — so re-registering the *same* PNR + type + action produces a second child ticket, second grandchildren and second errand. Is that correct (a genuinely new errand on the same ticket) or is it the duplicate ETG reported on 334577/334588? R10 ("restart is idempotent within a ticket") and R17 ("fully reset loop and cursor state") pull opposite ways here and cannot both hold. | **Needs Brent** | Brent / Olga | — |

**Regression risk** — Touches both create loops and the errand loop. Re-run the full matrix (Tests 1–8), AC-5.1 (node 3 empty-set guard), AC-6.1 (parent internal note), AC-19.x (silent grouping) and AC-20.x (orderReference).

**Not fixed here, deliberately** — (a) node 41's 1 SEC wait racing Zendesk's async backing-ticket creation: the duplicate consequence is now gone, but a first grandchild can still land on the parent ticket via node 36's documented fallback; sizing a real poll needs a live run. (b) Node 16's response-alias candidate list is still unconfirmed against CO #180 — pin it from Execution Insights.

---

### CR-012 — Silent tickets group by distinct (type + action), superseding R19
| | |
| :---- | :---- |
| **Date agreed** | 2026-08-05 |
| **Requested by** | Brent, confirmed in session 2026-08-05 |
| **Source** | Errand tracker "Testing 3" tab; node 27's own change note dated 2026-08-05 |
| **Type** | Requirement change (supersedes an agreed Must) |
| **Status** | Agreed — no build required |

**The ask**

Non-proceed PNRs produce **one silent ticket per distinct (type + customer action) pair**, each covering every non-proceed PNR sharing that pair — the same grouping key already used for grandchildren and Edvin errands. This **supersedes CR-009/R19**, which required exactly one consolidated silent ticket regardless of how many pairs the non-proceed PNRs spanned.

**How this surfaced** — v33 changed node 27's silent branch to per-pair grouping, but CR-009/R19 was never amended, so the two disagreed. The offline harness reported 22 failing cases on both v33 and v34; all 22 were this single disagreement, with `oracle.js` still encoding R19. Brent confirmed the per-pair behaviour is what ETG wants, so the tree was already right and the harness answer key was the stale artifact. `oracle.js` R4 corrected 2026-08-05; the matrix returns 64/64.

**Effect on the existing spec** — Supersedes R19 (CR-009). R19's AC-19.1 / AC-19.2 / AC-19.3 no longer hold as written and are replaced below. AC-19.4 (Edvin errand count unaffected) is unchanged and carries forward. Adds R23.

#### R23 — Silent tickets group by distinct (type + action) · **Must**
- **Requirement:** All PNRs whose resolved bucket is not `Proceed` produce one silent ticket per distinct (type + customer action) pair, each titled with every PNR sharing that pair, carrying no grandchildren.
- **AC-23.1** — 2 non-proceed PNRs, different types AND different actions → 2 silent tickets (tracker Test 5).
- **AC-23.2** — 2 non-proceed PNRs, same type, different actions → 2 silent tickets (Test 6a).
- **AC-23.3** — 2 non-proceed PNRs, same type, same action → 1 silent ticket (Test 6b).
- **AC-23.4** — `Different request` + `Do not proceed` under one type → 2 silent tickets (Test 8).
- **AC-23.5** — Mixed proceed and non-proceed → 1 child ticket plus one silent per distinct non-proceed pair.
- **AC-23.6** — Edvin errand count is unchanged by this rule: still one per distinct (type + action). (Carried over from AC-19.4.)

**Regression risk** — None in the tree; node 27 already behaves this way. The risk is in the harness: if this CR is ever reversed, change `oracle.js` first and the tree second, never the reverse.

---

### CR-013 — Duplicate internal note posted on session replay
| | |
| :---- | :---- |
| **Date agreed** | 2026-08-19 |
| **Requested by** | Surfaced by Brent (live bug report, Zendesk ticket 337322, this session); root cause diagnosed by Dudley |
| **Source** | Brent direct, 2026-08-19 — Zendesk ticket 337322 screenshot showing two byte-identical internal notes ~1 minute apart (same PNRs KCSJGPF/ZHU9OH, same fee notes); Dudley's read of the live tree JSON supplied this session (`Register Errands - Dynamic`, tree ID `595124299`, org 116, tags `dynamic_errand_testing`) — **note:** this doc's own header (line 6) records tree ID `139367450`, org 113, as the tree of record; flagging the ID/org mismatch for Brent to reconcile (sandbox/testing copy vs. production tree), not blocking, since the defect and fix below don't depend on which is authoritative — the node numbers and logic match this doc's own references throughout |
| **Type** | Bug / defect |
| **Status** | Agreed — ready for build |

**The evidence (no verbatim customer quote available — see Source, as with CR-007)**
Ticket 337322 shows two identical internal notes on the same PNRs (KCSJGPF/ZHU9OH), same fee notes, ~1 minute apart. Dudley traced the cause directly in the live tree export:
- Node 22 ("Zendesk - Add Internal Note", CX Action → Connected Object #178) is the only write-path in this tree with no idempotency/duplicate guard. Ticket creation (nodes 32/33/14) and Edvin errand registration (nodes 44/17) both have one — an `attempted_*` / `registered_errand_keys` check written *before* the external call fires, so a replay doesn't repeat the write. The node 21 → node 22 pair (note text built, then posted) has never had an equivalent.
- The tree's own embedded documentation (node 5, its `claude.md` node) already names the general risk: *"This tree is RE-ENTERED ROUTINELY. Node 25 has Back enabled and keep_vars_on_back=1, so Back + Continue re-fires node 27 and everything downstream of it. Any node that writes to Zendesk or Edvin must be idempotent under that replay — test it, don't assume it."* Node 22 is exactly the write this warning describes, and the one exception that was never closed.
- Graph check: only node 21 has a continuation into node 22 (confirmed against every node's `continuation_node_id` and button `button_link` in the export) — so this is one session path (27 → 3 → 21 → 22) firing twice via Back+Continue or a session resume, not two paths converging on one node.

**Interpretation**
Same defect class as CR-011 (duplicate Zendesk tickets / junk Edvin errand on loop replay) — same root cause (a write node with no idempotency guard, under this tree's routine re-entry pattern), different node. Node 22 was explicitly out of scope for CR-011's fix, which covered the ticket-creation guards (nodes 13/15/14/16) and the Edvin registration guard (node 44/17) only — it never touched the note-posting path.

**Effect on the existing spec** — Amends R6 (§4, parent internal note) to require idempotency under replay. Adds R24.

#### R24 — Internal note posting is idempotent under session replay · **Must**
- **Requirement:** The note-posting write (node 21 → node 22) must not repeat for a session/PNR-set that has already had a note posted, following the same attempted-before-write / cleared-on-restart pattern CR-011 established for ticket creation and Edvin registration.
- **AC-24.1** — Given a normal single-pass session, when it completes, then exactly one internal note is posted to the parent ticket.
- **AC-24.2** — Given the agent presses Back on node 25 and Continues without changing anything, when the flow re-reaches node 22, then no second note is posted.
- **AC-24.3** — Given the agent presses Back on node 25 and then genuinely changes the PNR selection, when the flow re-reaches node 22, then a note is posted correctly for the new selection.
- **AC-24.4** — Given Restart (node 10) or an Additional/Different Request re-entry (node 29), when a fresh pass completes, then a new note is posted for that pass — the guard must not suppress a legitimately new run.

**Open questions** — None blocking. This is a straightforward extension of the attempted-before-write / cleared-on-restart pattern CR-011 already established for the other two write-paths.

**Regression risk** — Touches node 21/22 only. Re-run AC-6.1 (note content/enumeration unchanged), AC-21.1–21.3 (CR-011's ticket-creation guards, to confirm the new note guard doesn't interact with them), and extend the `walk.mjs` `back_at_25` scenario to also assert exactly one note-post.

---

### CR-014 — Zendesk internal notes/comments attributed to the API token owner, not the live agent
| | |
| :---- | :---- |
| **Date agreed** | 2026-08-19 |
| **Requested by** | Brent (question raised directly in session) |
| **Source** | Brent direct, 2026-08-19 — no call transcript, email, or Slack thread for this one; flagging that explicitly, as CR-007 does for the same reason |
| **Type** | Change to existing behavior |
| **Status** | Open — blocked on Q14 |

**The ask (no verbatim quote available — see Source)**
Brent asked why all internal notes/updates posted by this tree register in Zendesk against his own user, and how to get the acting agent's name attached instead.

**Interpretation**
- Node 22's Connected Object (#178) posts the internal note via the Zendesk API but its config (visible in the export) sets no `author_id` on the comment. Zendesk's Ticket Comments API attributes a comment to whichever identity is tied to the credentials making the call when `author_id` is omitted — not to whichever human agent is live in the browser. Since CO #178 is apparently running on Brent's own token/credentials, every note it posts shows as authored by Brent regardless of who is working the ticket.
- This is the same open gap the tree's own `claude.md` node already documents for a different external system: *"ERRAND CREATOR (open, blocked): Edvin registers the errand against a generic user; ETG wants the actual agent. Needs an ETG dev change to the admin API (Olga raising the Jira, confirmed by John Spanidis 2026-08-04). Zingtree already has agent name + email from Zendesk — one line in node 44 once the API accepts it."* Also relevant: *"AGENT IDENTITY (interim, tracker #73): node 44 resolves the handling agent from the first of agent_name / current_user_name / zendesk_agent_name / requester_name (and the email equivalents), logs which one resolved, and includes it in the errand message as 'Handled By'."* That resolved-agent-identity value already exists in the tree and is the natural source for a Zendesk `author_id` too — it just isn't wired into CO #178's request today.

**Effect on the existing spec** — Amends R6 (§4, parent internal note) to require correct author attribution. Adds R25.

#### R25 — Internal note is attributed to the acting agent, not the API credential owner · **Must**
- **Requirement:** The internal note posted by node 22/CO #178 carries an `author_id` resolved the same way node 44 already resolves agent identity for the errand message (agent_name / current_user_name / zendesk_agent_name / requester_name and email equivalents, in that order).
- **AC-25.1** — Given a live agent identity resolves via the existing node 44 resolution order, when the note posts, then Zendesk records it against that agent's user, not the token owner.
- **AC-25.2** — Given no live-agent identity resolves (all candidates empty), then the note falls back to a defined, documented identity (e.g. the current token owner or a shared "Zingtree" service user) rather than an undefined/error state — the fallback choice itself is part of Q14 below.
- **AC-25.3** — Given the token behind CO #178 lacks permission to set `author_id` to another user, when the note-post is attempted, then the failure surfaces as a visible error to the agent or in logs — it must never silently post under the wrong identity with no one aware.

**Open questions**

| # | Question | Blocking? | Asked of | Answer / date |
| :---- | :---- | :---- | :---- | :---- |
| Q14 | (1) Does the API token behind CO #178 have permission to set `author_id` to a different Zendesk user on comment creation (this typically requires an admin-scoped token)? (2) Whose identity should the token resolve to when `author_id` isn't the live agent's Zendesk user id (e.g. a shared token has no live-agent context beyond what the tree already captures via ZT variables)? | **BLOCKING** | Brent (only he can see the CO #178 config — same convention as Q9) | — |

**Regression risk** — CO #178 is the same write path amended by CR-013/R24; both changes touch the same Connected Object and should be built and tested together rather than twice. Re-run AC-6.1 (note content) and R24's AC-24.1–24.4 (idempotency) after this lands, to confirm the two changes don't interact.

---

### CR-015 — No failure handling anywhere in the ticket-creation / errand-registration chain
| | |
| :---- | :---- |
| **Date agreed** | 2026-08-25 |
| **Requested by** | Brent (pre-launch risk review — 2,500 agents going live 2026-08-26) |
| **Source** | Root cause diagnosed by Dudley against the live tree export (`Register_Errands_notes_fix_20260824.json`, nodes 3, 27, 32–38, 44, 62–72, 78, 83) using a rewritten graph-walking harness (`etg-errand-regression`, rewritten 2026-08-25 to execute real node bodies rather than reimplement them — `Zingtree Builder/Workflow JSONs/ETG/graph_walk.mjs`) driven by a mock-payload matrix built to trigger exactly these failure shapes. |
| **Type** | Bug / defect — production-readiness gap, not a reported live incident |
| **Status** | Agreed — ready for build |

**The ask (verbatim)**
> Brent, in session, 2026-08-25: "are there any errors or issues I need to be concerned about with 2500 agents using it in production live starting tomorrow? (networking has already been handled)"

**Interpretation**

Four confirmed crash paths, all with the same underlying cause: nothing between the tree and Zendesk/Edvin ever checks whether an external call, or an agent's own selection, actually succeeded before the next node assumes it did.

1. **No guard before node 44 when every PNR is unresolved.** Node 27 correctly builds `final_pnrs: []` when no selection resolves (blank, never posted, or a stale/foreign action id). Node 3 gates the *ticket*-creation branch on `len(transforms.child_tickets) >= 1` and safely skips to node 21 when there's nothing to create — but node 22 → 44 is an unconditional continuation, with no equivalent guard. Node 44 runs `final_pnrs[final_pnrs_count]` unguarded and throws on `current_pnr.type` against `current_pnr === undefined`. Reproduced via `graph_walk.mjs` scenarios `nothing_selected_unresolved` and `stale_action_id_from_other_type`.
2. **A failed Zendesk child-ticket create crashes node 64.** Node 33 creates the child/silent ticket. Any non-201 response — no `.side_conversation` field — and node 64 ("Set Side Conversation Id") throws reading `.side_conversation.id`. `created_child_ticket_keys`, the field the tree's own comments describe as the confirmed-creation reconciliation list, is cleared on restart but never written by node 33 or read by anything downstream — it does not actually track success/failure today. Reproduced via `CRASH_child_create_fails`.
3. **An unresolved async side-conversation lookup crashes node 65.** Node 63 looks up the side conversation node 33 just created; Zendesk's own eventual-consistency window means it isn't guaranteed queryable immediately, and node 65 throws on `.external_ids` of `undefined` if the lookup comes back empty, rather than waiting or retrying. Reproduced via `CRASH_child_detail_never_resolves`.
4. **Both of the above repeat identically on the grandchild path** (nodes 69/71, mirroring 64/65) — grandchildren share connected objects with the child path (node 69's own source reads `actions.create_child_ticket`, confirming there is no separate grandchild alias), so the fix has to cover both paths together, not in parallel. Reproduced via `CRASH_grandchild_create_fails` and `CRASH_grandchild_detail_never_resolves`.

None of these four requires unusual input — #1 is triggered by ordinary agent behavior (a missed selection), and #2/#3 are triggered by Zendesk's own ordinary failure modes (rate limits, transient 5xx, eventual consistency), which at 2,500 concurrent agents will occur at some non-zero rate on day one. Each one currently ends the agent's session with an unhandled exception and no recovery screen.

**Effect on the existing spec**
- Supersedes: none.
- Amends: R7 (Edvin errand registration) and R5 (child/silent/grandchild ticket creation) — both must degrade to a visible, recoverable state instead of an uncaught exception.
- Adds: R26, R27.

**New / restated requirements**

#### R26 — Errand registration never runs against an empty result set · **Must**
- **Requirement:** Node 44 (or a new Scoring guard ahead of it, mirroring node 3's pattern) must not execute when `transforms.final_pnrs` is empty. When every PNR is unresolved, the agent is routed back to re-select — using the unresolved-selection messaging node 27 already builds (`transforms.unresolved_note_html`) but nothing currently renders — rather than falling through into a script that assumes a record exists.
- **AC-26.1** — Given every selected PNR is unresolved (blank, unposted, or an id/name that matches no `actions_array` entry), when the agent continues past node 25, then the session shows the "nothing recorded, pick again" state and does not proceed into ticket/errand creation.
- **AC-26.2** — Given at least one PNR resolves, when node 3/44 evaluate, then behavior for the resolved PNR(s) is unchanged from today.

#### R27 — Ticket-creation and side-conversation lookups fail visibly, not with an uncaught exception · **Must**
- **Requirement:** Every Data-node call in the child/grandchild creation chain (nodes 33, 63, 37, 70) is followed by a check of its outcome before the next Script node assumes success. A failed create or an unresolved lookup routes to a defined recovery/retry state (exact shape — inline retry vs. flag-and-continue vs. stop-and-notify — is a build/product decision, not specified here) instead of reaching node 64/65/69/71 with data those scripts can't safely dereference.
- **AC-27.1** — Given node 33/37 returns a non-2xx response, when the flow reaches the next node, then it does not throw — it reaches a defined state that says which ticket failed to create.
- **AC-27.2** — Given node 63/70's lookup returns no matching side conversation, when the flow reaches the next node, then it does not throw — it either retries within a bounded window or reaches a defined state that says the parent-child link could not be confirmed.
- **AC-27.3** — Given a clean, fully-successful run (the common case), when this fix ships, then output is unchanged from today — this is a failure-path addition, not a behavior change to the success path.
- **AC-27.4** — `created_child_ticket_keys` / `created_grandchild_ticket_keys` are actually written on confirmed success (they are declared and cleared today but never populated) — so "was this ticket actually created" becomes answerable, which R27's recovery states depend on.

**Open questions**

| # | Question | Blocking? | Asked of | Answer / date |
| :---- | :---- | :---- | :---- | :---- |
| Q15 | What should the agent-facing recovery state be for a failed create / unresolved lookup — silent retry (how many attempts, what backoff), a visible error banner the agent can dismiss and retry manually, or a hard stop that pages someone? Zendesk rate limits and typical side-conversation resolve latency at ETG's current ticket volume would inform the choice. | Non-blocking for R26 (node 44 guard can ship alone); **blocking for R27's exact shape** | Brent / ETG | — |

**Regression risk** — R26 touches node 44's entry condition only; re-run every existing scenario in `graph_walk.mjs` to confirm resolved-PNR behavior is unchanged (17/17 pass today). R27 touches nodes 33/37/63/70 and whatever new recovery node(s) the build introduces; re-run the full matrix plus the four `CRASH_*` scenarios, which should move from "confirmed broken path" to "confirmed handled," not disappear.

**Launch-timing note** — R26 alone is a small, contained, high-value fix (one new Scoring node) that removes the single most reachable crash (any unresolved selection) without touching the ticket-creation chain at all. Given the 2026-08-26 launch date, shipping R26 immediately and treating R27 as fast-follow is a reasonable split if Q15 can't be answered in time — flagging that split explicitly rather than deciding it unilaterally.

---

## 13. Document change log

| Date | Change | By |
| :---- | :---- | :---- |
| 2026-07-27 | Created — BRD reconstructed from tree 139367450 + its `claude.md` node; CR-001 … CR-006 added from the 27 July "Flow test results" call and "Mandatory Zingtree Approach" workshop | Requirements role (account sweep) |
| 2026-07-29 | CR-007 added — missing "done" exit (root cause of agent-reported "double child tickets," Zendesk 7601204 / 7621694-adjacent testing) fixed with an explicit Finish vs. Register-additional-request choice on node 23; node 47 retired; R15–R17 added; amends R8 and R14. No blocking questions — ready for build. | Mira (requirements role) |
| 2026-08-03 | CR-008 added — Olga Gerothanasi flagged Proceed-bucket actions (ticket 334582) resolving to Silent tickets; root cause traced to name-based (not identity-based) action matching in nodes 12/27; R18 added, amends R4. One non-blocking open question (Q10). Note: this session also confirmed via `ETG_ZT errand tracker - Testing (1).csv` that the grandchild-per-distinct-(type+action) behavior on tickets 334577/334588 is working as designed, not a defect — the "duplicate grandchild" reports on those two tickets are more likely CR-007/R17's known loop-state gap (Node 29 vs Node 10 reset scope), pending confirmation of whether an Additional-Request pass was involved. | Mira (requirements role) |
| 2026-08-03 | CR-008's root cause **corrected** against Brent's 334582 session dump. The initial diagnosis (two same-named Edvin actions with different buckets) was wrong — Q10 answered "no collisions exist." The actual defect: node 12 renders option values as action **IDs** while node 27 resolves selections by display **name**, so no lookup ever matches and every PNR defaults to a Silent ticket with a blank bucket. Replaying the live node 27 against 334582's real `actions_array` and submitted values (`1863`, `1895` — both Proceed) reproduces the reported `Child: 0, Silent: 2` exactly; the v15 build produces the matrix-correct `Child: 1, Grandchildren: 2`. New Q11 raised **BLOCKING**: the dump's stored `customer_action` is empty rather than `"1863"`, which may mean node 27's variable read is failing outright — in which case identity-matching is necessary but not sufficient. Also noted: the dump's `edvin__register_errand` call returned HTTP 400 (`Invalid format/mapping at line 1, column 267`), consistent with `actionId: null` / empty bucket being sent downstream; likely a symptom of the same defect, to be re-checked after the fix rather than chased separately. | Mira (requirements role) |
| 2026-08-03 | **v18 built** (`Register Errands - Dynamic (v18 silent consolidation + orderReference 2026-08-03).json`, nodes 27 and 44 only, everything else byte-identical to the 10:22 live export). Adds CR-009/R19 (non-proceed PNRs → exactly one Silent ticket, per CSV matrix Tests 5/6a/6b/8 — code was emitting one per distinct type+action) and CR-010/R20 (register-errand payload now carries `orderReference`; Edvin was returning HTTP 400 on every run, so R7 has never actually worked). Also carries the v17 warning-scope fix. Stage A: 12/12 assertions pass — full CSV matrix Tests 1–8, the mixed proceed/non-proceed 334585 shape, the stale-transform false-warning regression, and both orderReference source paths. Q11 closed (the variable read was never broken). Q12 raised BLOCKING for AC-20.4. Not imported — Brent's call. | Wes (build role) |
| 2026-08-03 | R17 and R18 built by Wes to `Zingtree Builder/Workflow JSONs/ETG/Register Errands - Dynamic (v15 reset-scope + action-id fix 2026-08-03).json`, based on the 2026-07-31 live export supplied by Brent. Node 29 now resets the 8 fields R17 identified as missing (`current_pnr, pnr_index, isMorePNR, pnr_banner, customer_action_table_html, is_more_pnrs, is_grandchild_tickets, is_more_grandchild_tickets`). Nodes 12 and 27 now key the action dropdown and its stitch-back on `actionId` instead of display `name` (R18). Stage A: static JSON/brace validation passed; a Node.js harness re-ran the script logic against CSV Tests 1, 2, and 4 (all matched expected outcome) and against a synthetic 334582-style name-collision case — confirmed the fix resolves to the agent's actual pick regardless of array order, and reproduced the pre-fix failure mode when simulated against the old name-matching logic. **Not built or touched:** R15/R16 (node 23 already has an "Additional Request"/"End Session" split in the live export, but node 47 was not retired as R15 specifies — flagging, not fixing, since it wasn't part of the confirmed edit list). **Also flagged, not fixed:** node 27's non-proceed branch still creates one Silent ticket per distinct (type+action) combo, which appears to conflict with the CSV test matrix's Tests 5/6/8 (expecting exactly one consolidated Silent ticket regardless of type/action distinctness) — this predates today's build, is unrelated to R17/R18, and needs its own CR if confirmed. Live import to the running tree was **not** performed — that remains Brent's explicit call. Stage B (browser session test) not run; recommended before publish. | Wes (build role) |
| 2026-08-05 | CR-011 added and built as **v35** — Olga's "still receiving duplicate grand child tickets" (ZD 334818 / child 334823). Node 27's grouping was confirmed correct and is not the cause. Two independent replay defects found with a new graph-walking driver (`walk.mjs`) that executes the real node bodies along the real continuation graph: (1) the child/grandchild duplicate guards read `created_*_keys`, which nodes 14/16 write only on a confirmed 2xx, so a create Zendesk made but reported badly duplicated on the next pass — guards moved onto `attempted_*_keys` recorded pre-create by nodes 32/36; (2) node 44 had no idempotency guard and never clamped or reset `final_pnrs_count`, so a replay registered a real Edvin errand from `final_pnrs[undefined]` with no type, action or PNR — added the house clamp+reset plus a `registered_errand_keys` guard gated by new Scoring node 17. Root-cause note: v34's node-27 idempotency fix is what exposed both, because on v33 a replay was accidentally blocked at node 51. R21/R22 added; Q13 raised (R10 vs R17 on the Additional Request path — needs Brent). Stage A: `validate_tree` 0 problems, harness 64/64, `walk.mjs` `back_at_25` 3→2 errands and `gc_first_unconfirmed_then_replay` 3→2 grandchildren. Not imported — Brent's call. Stage B not run. | Wes (build role) |
| 2026-08-05 | CR-012 added — silent tickets group by distinct (type + action), **superseding CR-009/R19**. Confirmed by Brent in session. Resolves the 22-case harness disagreement that had been failing on both v33 and v34: the tree was already correct and `oracle.js` R4 was the stale artifact, now corrected (64/64). R23 added; R19's AC-19.1–19.3 replaced, AC-19.4 carried forward as AC-23.6. Doc-only — no tree change. | Mira (requirements role) |
| 2026-08-05 | CR-005's open question resolved (doc-only, no requirement text changed): the 2026-08-04 call decided VI gets its own tree, PNR loop removed — separate from this tree. Added a pointer to the new build doc, `Zingtree Builder/Requirements/ETG/vi-errand-registration-requirements.md`, which carries R13 forward as its R9. R13's text is unchanged. | Mira (requirements role) |
| 2026-08-19 | CR-013 added — Brent surfaced a live duplicate-internal-note defect (Zendesk ticket 337322, PNRs KCSJGPF/ZHU9OH) this session; root cause traced to node 22 (Zendesk - Add Internal Note) being the only write-path in the tree with no idempotency guard, same defect class as CR-011 but a different node, out of scope for CR-011's fix. R24 added, amends R6. No blocking questions — ready for build. | Mira (requirements role) |
| 2026-08-19 | CR-014 added — Brent asked why internal notes post to Zendesk under his own user instead of the live agent's. Traced to CO #178 omitting `author_id` on comment creation, so Zendesk attributes it to the token's own identity by default. R25 added, amends R6, proposing the same agent-identity resolution node 44 already uses for Edvin. Q14 raised **BLOCKING** (CO #178 config and token permissions — only Brent can see them). Doc stays Draft for this CR; not marked ready for build. | Mira (requirements role) |
| 2026-08-25 | CR-015 added — pre-launch risk review ahead of 2,500 agents going live 2026-08-26 surfaced four confirmed crash paths via a rewritten graph-walking harness (`graph_walk.mjs`) that executes real node bodies rather than reimplementing them: (1) no guard before node 44 when every PNR is unresolved — node 3 already guards the ticket-creation branch the same way, node 44 has no equivalent; (2)/(3) a failed Zendesk create or an unresolved async side-conversation lookup crashes nodes 64/65 with no error handling anywhere in the chain; (4) the same two crash modes repeat on the grandchild path (69/71) via the shared connected objects. R26 (empty-final_pnrs guard) and R27 (create/lookup failure handling) added, amending R5/R7. R26 is ready to build standalone; R27's exact recovery shape is blocked on Q15 (retry vs. visible error vs. hard stop) pending Brent/ETG input on acceptable latency and failure-rate assumptions. | Mira (requirements role) |
| 2026-09-05 | CR-018 added and built as **v54** (parent) + **v17** (VI Dynamic) — Brent asked for three things in one message: one contact-reason list instead of four hand-maintained copies (as a stringified form-data variable, parsed on reference), the custom API request logger and its display back (his stated exception to the no-logging rule), and the no-PNR-for-this-order screen restyled with a yellow warning label and real spacing. R31/R32/R33 added; no existing requirement text amended. **Defect found in passing (CR-018.1):** the three copies of the Zendesk→Edvin contact-reason map had drifted, and checked against Edvin's own errand configuration the VI subtree's copy was wrong on five category names — `categories.find(c => c.name === ...)` is case-sensitive, so those five contact reasons were throwing "No Edvin category match" live in the VI flow. Reproduced and fixed under test. Stage A complete: lint 73 warnings vs 74, walk identical (same 8 COs, 1 call each, terminal 48), 24 purpose-built assertions pass, `etg-errand-regression` results CSV byte-identical before and after. **Two harness problems surfaced and flagged, not worked around:** `etg-errand-regression` reports 0/64 on the v53 baseline too (its oracle still expects the pre-v46 `child_tickets`/`silent_tickets` shape), and `walk.mjs`'s loop detector is desensitised by the growing `api_trail` (one-line fix identified and tested). Not imported — Brent's call. Stage B not run. | Wes (build role) / Dudley |


---

### CR-016 — Order-reference/PNR-optional handling (orphan + unconfirmed booking) + VI-flow env-promotion hardening

| | |
|:---|:---|
| **Date agreed** | 2026-09-04 (ETG Collaboration Hour) for the routing decisions; refactor/hardening scoped same day by Brent |
| **Requested by** | Christina Zamenopoulou (ETG), on the routing decisions; Brent Thomas, on the refactor/env-promotion scope |
| **Source** | Spiky call "Zingtee - ETG Collaboration Hour", 2026-09-04 12:45 UTC (meeting id `0862ff91-6568-4f79-9db7-529cbfe09632`), ANALYSIS_READY; plus Brent's direct build instructions the same day |
| **Type** | Change request — new branch logic (already partially implemented live by Brent as v51 before this CR was written) + code-quality/env-promotion hardening |
| **Status** | Built, pending Brent's approval (Stage A verification complete; Stage B live/browser test not run — see Regression risk) |

**The ask (verbatim)**

Christina (2915s), on the no-order-reference case: *"the register error[rand] step, since there is no order to register — Should it for now at least be replaced by a node saying now go to admin and register this [errand]."* ... *"If they select not the reference, they should see the new screen that requires manual work by them in Edvin. But if they have all the reference, they should see this screen that we are seeing now."*

Christina, specifying the manual screen's fields (3036s–3073s): *"We need the more extended description here. We need the notes they have added... We need channel category type and action. And the notes. And genesis interaction ID... These are the mandatory fields they should add."* — and (3084s–3091s) explicitly excluding Genesys Interaction **Type**: *"It's not mandatory because it's the channel."*

Brent, on the no-PNR case (3171s–3175s): *"We should have some sort of text that indicates what just happened. No PNR is available for this order."* Closing commitment (3979s–3987s): *"Yes, I can update the logic there and I'll also update the text for no PNRs too so that an agent knows what's happening."*

Separately, Brent (this session, 2026-09-04): review both "Register Errands" trees, reduce script/logic complexity, apply current best practices, and ensure every environment-specific (dev/prod) Zendesk custom-field reference is resolved once to a standard variable name rather than referenced raw anywhere else in either tree — "so that env promotion will never be an issue" — with the VI Dynamic tree named explicitly as the one needing this pass.

**Interpretation**

Two behaviors, two different registration paths, per Christina's own distinction on the call:

1. **Orphan (no order reference at all):** skip automatic Edvin registration; show the agent one card per errand with Channel/Category/Type/Action/Notes/Genesys Interaction ID and an instruction to register it manually in Edvin. This **supersedes** the 2026-09-01 Building Guide's Subflow 2 design (automatic registration using `orderReference = "-999"`, per Elis) — Christina's 9/4 direction reverses that specifically for the no-order-reference path, "for now."
2. **Unconfirmed booking (order reference present, Edvin returns 0 PNRs):** registration stays **automatic**, unchanged from the Building Guide's Subflow 1 — only a new agent-facing notice is added before type/action selection, naming the order reference, contact reason and channel, and confirming the child ticket + internal note still happen normally. This is Subflow 1's design, unchanged.

**Gap flagged, not guessed:** Brent's own recollection when describing this task described the no-PNR notice appearing in three places (type-selection, child-ticket-creation, and the internal-note/errand-registration output) and a separate alert/title node ahead of the manual-Edvin screen. The call transcript only substantiates ONE no-PNR notice location (a dedicated screen shown right after the unconfirmed-booking branch is detected, before type/action selection — node 101) and ONE combined screen for the orphan case (no separate alert node; the manual-registration screen itself is formatted as an alert-style content block, node 100). R29 and R28 below are written to the call-verified scope. The child-ticket-creation and internal-note screens were not changed to add a second/third no-PNR indicator, since nothing in the transcript commits to that and the existing internal note already lists every PNR/order reference per errand (which already surfaces the absence for anyone reading it). Flagging this explicitly for Brent to confirm rather than silently expanding scope beyond what the customer call agreed to.

**Effect on the existing spec**

- **Supersedes** `Building Guide - Unconfirmed Booking + Orphan Subflows (2026-09-01).md` §3 (Orphan Errand registration approach) — mark that document historical/superseded by this CR for the orphan path specifically. §2 (Unconfirmed Booking) is unaffected and stays current.
- **Amends** R20 (order reference reaching the Edvin payload) — R20 assumed a resolved order reference always exists; R28 below is the "what happens when it doesn't" case R20 didn't cover.
- **Adds** R28, R29, R30.

**New / restated requirements**

#### R28 — Orphan errand: manual Edvin registration screen · **Must**
- **Requirement:** When no order reference resolves for the session, the agent still completes contact reason, type, action and notes selection as normal, but the automatic "Register Errand" API call is replaced by a content screen showing one card per errand (Channel, Category, Type, Action, Notes, Genesys Interaction ID — Interaction Type intentionally omitted) instructing the agent to register each in Edvin manually. A run with zero automatic Edvin registrations in this path is expected, not an error, and must be visible as such in the execution log.
- **AC-28.1** — Given a session where order reference never resolves, when the agent reaches the point where an errand would normally auto-register, then the agent sees a manual-registration card per errand with exactly the six listed fields and no automatic Edvin API call fires.
- **AC-28.2** — Given the manual-registration screen renders, when the underlying card HTML is generated, then it must not be wrapped in a `<p>` tag (block-level content collapses the paragraph — see Conventions/ZD 334703 class of bug). *(Found broken in the initial 9/4 build; fixed same day — see Fixes below.)*

#### R29 — Unconfirmed booking: no-PNR notice before type/action selection · **Must**
- **Requirement:** When Edvin returns an order with a valid order reference but zero PNRs (Unconfirmed Booking), the agent sees a notice before proceeding to type/action selection stating: the order reference, contact reason, channel, an explanation that no PNR was issued (normal for an incomplete-payment booking), and confirmation that the child ticket and internal note will be created exactly as normal. Automatic Edvin registration for this path is unaffected (still automatic, per the Building Guide's Subflow 1).
- **AC-29.1** — Given Edvin returns 0 PNRs for a resolved order, when the agent's contact reason matches the Unconfirmed Booking value, then the notice screen renders with correct order reference, contact reason and **actual** channel (not a hardcoded value — see Fixes below) before any type/action screen.
- **AC-29.2** — Given the notice has been shown, when the agent continues, then the child ticket and internal note are created via the same unchanged path as a normal PNR.

#### R30 — No raw environment-specific field references in the VI Dynamic subtree · **Must**
- **Requirement:** The "Register Errands - VI Dynamic" subtree must not read any Zendesk `custom_field_<id>` directly in a consuming node. Since this subtree only ever executes mid-session after the parent tree has already resolved environment-specific fields to standard variable names (parent's ENV FIELD RESOLUTION block, nodes 10/29/93/95), consuming nodes read the standard name; a new environment-specific value needed only within the subtree gets its own single resolution point at the subtree's root (node 83), never inline where it's used.
- **AC-30.1** — Given the VI subtree runs after the parent has resolved `contact_reason`, when node 81 needs the agent's contact reason, then it reads the standard `contact_reason` variable, not a raw `custom_field_<id>`.
- **AC-30.2** — Given a promotion from dev to prod (or the reverse), when the VI subtree runs in the new environment, then no script in it breaks or silently reads an empty/wrong field due to a hardcoded environment-specic id.

**Fixes shipped alongside this CR (found during code review, not separately requested, listed for visibility)**

| # | Node(s) | Tree | Fix |
|:---|:---|:---|:---|
| 1 | 100 | Dynamic | Removed `<p>` wrapper around generated manual-registration card HTML (AC-28.2) |
| 2 | 61 | Dynamic | Restored real `mapGenesysInteractionType()` channel mapping; was hardcoded to "Zingtree.Channels.Phone" for every session — directly affects AC-29.1's channel display and R28's cards |
| 3 | 10, 29, 93, 95 | Dynamic | Corrected stale comment ("keep IDENTICAL in nodes 10, 24, 29" → "10, 29, 93, 95") — doc/code no longer disagree on the ENV FIELD RESOLUTION call sites |
| 4 | 10 | Dynamic | Removed dead leftover commented-out debug line (raw `custom_field_` read, pre-dates the ENV FIELD RESOLUTION block) |
| 5 | 90 | Dynamic | Fixed stale comment cross-reference (`contact_reasons_dynamic` list is on node 10, not node 61) |
| 6 | 1 | VI Dynamic | Cleared 17 dead hardcoded Type options/scores, unreachable under the live dynamic list source (code-review parity item #5, open since 2026-09-01) |

**Known open issues, explicitly out of scope for this CR** (found during review, pre-existing, not part of today's ask — listed so they aren't mistaken for closed): the unresolved-selection guard never being wired/routed (node 27); silent-ticket auto-resolve status unconfirmed (node 65); the generic Edvin errand creator identity (blocked on ETG's own Jira); CO #181 (Get Side Conversations) response-cache setting unconfirmed; the R10-vs-R17 duplicate-errand-on-re-entry conflict (needs Brent's call, unrelated to this CR); VI Dynamic code-review parity items #1, #2, #3, #6 (2026-09-01 list, none touched here).

**Open questions**

| # | Question | Blocking? | Asked of | Answer/date |
|:---|:---|:---|:---|:---|
| Q16 | Brent's own description of this task named three display locations for the no-PNR notice (type-selection, child-ticket-creation, internal-note output) and a separate alert node ahead of the manual-Edvin screen. The call only substantiates one location for each. Build as call-verified (this CR) or expand to match the original three-location/two-node description? | No — built to the narrower, call-verified scope; flagging so Brent can expand if he actually wants the broader version | Brent | Open |
| Q17 | Two of the four tree/id fields for these exports disagree with the local Workflow JSONs inventory (uploaded FILE1's JSON `id` is 218204451; the local, doc-referenced "Register Errands - Dynamic" tree is 518765124 — see delivery note). Which is the live tree to import into? | **Yes** — importing under the wrong id risks creating a duplicate tree instead of updating production/sandbox | Brent | Open |
| Q18 | Is "for now" (Christina's own qualifier on the manual-registration decision) meant to be revisited — i.e., should R28 be flagged as a temporary/interim behavior rather than a permanent design? | No | Brent / Christina | Open |

**Regression risk**

Static verification only (Stage A: JSON validity, all button/continuation node-id references resolve, node count and every non-target node byte-identical to the uploaded export — confirmed via diff). None of the eight changed nodes (5, 10, 29, 61, 90, 93, 95, 100 in Dynamic; 1, 5, 81 in VI Dynamic) are in the etg-errand-regression trigger list (2, 12, 21, 27, 32, 36, 44), so the grouping/ticket-creation contract that harness protects is untouched by this CR. Recommend etg-errand-regression's offline replay anyway before import, given R28/R29 are new branches, plus a live/attended Stage B pass in the Zendesk sandbox — neither has been run. No live import performed; new JSON exports only.

**Launch-timing note:** node 100/101 and the env-promotion fix (R30) have no dependency on each other and can ship independently if Brent wants to stage them separately.


---

### CR-017 — VI Dynamic: retire duplicate variable storage (one canonical name per fact)

| | |
|:---|:---|
| **Date agreed** | 2026-09-05 |
| **Requested by** | Brent Thomas |
| **Source** | Brent's direct build instruction, this session, 2026-09-05, pasting a live example from node 83 of the VI Dynamic tree |
| **Type** | Code-quality hardening — no behavior change, no new branch logic |
| **Status** | Built, pending Brent's approval (Stage A verification complete; Stage B live/browser test and etg-errand-regression offline replay not run) |

**The ask (verbatim)**

"Follow the pattern that all variables should be stringified formdata to set it and parse it on retrieval. I see a lot of duplicate references saving variables as both form data and transform data... This also looked like duplicate variable references / poorly named variables. I see this pattern throughout. Use 1 variable for each relevant referenace and stick to it at different points within the workflow. There should be no need to have the same value saved twice under current_pnr and combined_pnr_record. Find all similar variable declerations / references like this in the workflow's nodes and improve all of them to be more streamlined / efficient (same variable references / simple naming conventions / straightforward data flow). Remember all of this and update the builder skill."

Pasted example (from node 83, pre-fix):
```javascript
ZT.setTransformData("current_pnr", combined_pnr_record);
ZT.setTransformData("combined_pnr_record", combined_pnr_record);
ZT.setTransformData("combined_pnr", combined_pnr);
ZT.setFormData("combined_pnr", combined_pnr);
```

**Interpretation**

Brent flagged a duplicate-variable-storage anti-pattern: the same fact (the combined PNR record built at the start of the VI subtree) was being written under three different names — `combined_pnr_record` (transform), `current_pnr` (transform), and `combined_pnr` (transform, then mirrored again to form data) — with only `current_pnr` actually read by anything downstream. Scope was limited to CR-016's two trees (Register Errands - Dynamic and Register Errands - VI Dynamic, the only trees in this engagement); every `setFormData`/`setTransformData` call in both was checked against every read site (`getVariableValue`, `transforms.name`, `${name}`/`${transforms.name...}` merge fields) before any write was removed, so nothing was collapsed on the assumption it looked redundant.

**Effect on the existing spec**

- No requirement changes — this is a refactor of CR-016's own VI Dynamic delivery (v15) before Brent's approval, not a new behavior. Superseded by nothing; supersedes nothing.
- Amends R30 in spirit (VI Dynamic env-promotion hardening) by extending the same "one canonical name, resolved once" discipline from environment-specific fields to internal working variables generally — no new R-number, since R30's acceptance criteria are unchanged and still hold.

**Findings and fixes (VI Dynamic tree only — Dynamic tree checked and found clean, see below)**

| # | Node(s) | Fix |
|:---|:---|:---|
| 1 | 83 (Set VI Combined PNR) | Removed the `combined_pnr_record` transform write (byte-identical shadow of `current_pnr`, written immediately after it) and the mid-flow `combined_pnr` transform + form-data writes (nothing between node 83 and node 84 ever read either — node 84 always re-derives and writes the real, final `combined_pnr` string at hand-off). Renamed the local JS variable `combined_pnr_record` → `pnr_record` for clarity. `current_pnr` is now the one write this node makes for the record. |
| 2 | 84 (Set VI Finals) | Updated both fallback-read expressions (`stitched[0] \|\| transforms.combined_pnr_record \|\| transforms.current_pnr` and `transforms.combined_pnr_record` as `baseline`) to read `transforms.current_pnr` only, now that `combined_pnr_record` no longer exists anywhere in the tree. Kept the node's own `ZT.setFormData("combined_pnr", combined_pnr)` at hand-off — this is the tree's one legitimate exit-point mirror (form data for anything after this point that reads the plain PNR string, same pattern as the existing `orderReference` mirror), not a duplicate. |
| 3 | 86 (Continue) | Renamed the local JS variable `combined_pnr_record` → `record` throughout; removed the duplicate `ZT.setTransformData("combined_pnr_record", record)` write, keeping only `ZT.setTransformData("current_pnr", record)`. Updated the node's own historical bugfix comment (2026-08-24 entry), which referenced the now-retired name, so it doesn't mislead the next reader. |
| 4 | 2 | Removed a dead `ZT.setFormData("vi_details_text", vi_details_text)` line — verified no `getVariableValue("vi_details_text"...)` call and no `${vi_details_text}` merge field anywhere in the tree; every consumer reads the transform copy (`${transforms.vi_details_text}`) or the field embedded on the row object. Kept the transform write. |
| 5 | 5 (claude.md) | Replaced the stale Data Dictionary entry describing `combined_pnr_record`/`combined_pnr` with one describing `current_pnr` as the sole canonical name for the record, `combined_pnr` (the plain string) as the one deliberate form-data mirror at node 84's hand-off. Appended a v16 changelog section recording what was retired, the evidence for each removal, and the `orderReference` mirror that was checked and explicitly *not* touched (see below). |

**Checked and deliberately NOT touched**

- **`orderReference` (camelCase) / `order_reference` (snake_case), both trees.** This looks like the same anti-pattern (two names, one fact) but isn't: `orderReference` is the literal key name a Connected Object (CX Action) request body reads, configured in the Zingtree admin UI and not visible in either JSON export. Dropping it would silently break a live API payload with no error at build time. Documented in the Dynamic tree's own `claude.md` as an intentional exception; left untouched in both trees.
- **Register Errands - Dynamic (the parent tree, "FILE1"):** re-scanned every `setFormData`/`setTransformData` call against every read site with the same discipline used on VI Dynamic. Two candidate patterns turned up (`pending_api_alias`/`last_api_alias`, and the `orderReference`/`order_reference` pair above) — both verified as intentional (different lifecycles / the CO-body exception, respectively) and left unchanged. **No fixes needed in this tree for this CR** — the duplicate-storage pattern Brent described was isolated to the VI Dynamic subtree.

**Durable convention — added to the builder skill and to memory**

Codified as a house rule so it isn't re-discovered per review: one canonical variable name per concept, one write site, for the life of a tree; a value lives in both form data and transforms only when a verified consumer needs it in each (never as a defensive "might need it later" mirror); grep every read of an existing name before adding a second write of it under a new name. Added to `zingtree-workflow-builder` skill's `SKILL.md` (rule 1) and `references/02-data-and-namespaces.md` (new "No duplicate storage" subsection), committed to the skill's repo. Also filed to Brent's persistent Zingtree-conventions notes for future sessions.

**Open questions**

None — this CR is a self-contained cleanup with no design decisions pending.

**Regression risk**

Static verification only (Stage A: JSON validity, all button/continuation node-id references resolve, node count unchanged at 43, diff against the CR-016/v15 baseline confirms only nodes 2, 5, 83, 84, 86 changed beyond CR-016's own 1/5/81). None of these five nodes are in the `etg-errand-regression` trigger list (2, 12, 21, 27, 32, 36, 44 — that list is keyed to Register Errands - Dynamic's node numbering, not VI Dynamic's), and node 2's number collides with a Dynamic-tree trigger node only in numbering, not in tree — they are different trees. Recommend running `etg-errand-regression` anyway before import, same as CR-016, since neither Stage B live test nor the offline replay has been run for CR-016 or this CR yet — both should be verified together in the same pass, not separately.

**Delivery:** `Register Errands - VI Dynamic (v16 variable dedup, 2026-09-05).json`, built on top of CR-016's v15 delivery. No changes to Register Errands - Dynamic (v52) from this CR.

---

### CR-018 — One contact-reason catalogue; the API receipt restored as the single logging exception; no-PNR screen restyled

| | |
|:---|:---|
| **Date agreed** | 2026-09-05 |
| **Requested by** | Brent Thomas |
| **Source** | Brent's direct build instruction, this session, 2026-09-05, against the live v53 dev export (`Register Errands_1788619532301.json`, tree 218204451) |
| **Type** | Two code-quality/maintainability changes + one screen restyle. One defect fixed in passing (see CR-018.1). No change to the errand, ticket or grouping contract. |
| **Status** | Built, pending Brent's approval (Stage A verification complete; Stage B live/browser test not run, `etg-errand-regression` verdict not usable — see Regression risk) |

**The ask (verbatim)**

> "in node 46, I shouldn't have to maintain the list in multiple places (in VI flow and node 2 above). Instead I want to save this array of contact reasons as a stringified form data variable and then parse on reference in the other locations
>
> what happened to the custom logger I had. That feature to log and display api requests is an exception to my no logging rule. That custom display was very helpful.
>
> When an order reference has no pnrs, the message is a standard wall of text. Add a yellow warning label for the title and space out out improve styling and appearance for the no pnr for order reference"

**Decisions taken in session** (asked and answered before any build)

| Question | Brent's answer |
|:---|:---|
| How should the logger come back, given v46's arm/flush block pasted into 12 scripts is what the house standard now bans? | Derived receipt + call trail — one append line per call site, one renderer node, no shared block |
| Scope of the single catalogue: this tree only, or the VI subtree too? | This tree **and** fix the VI subtree's five wrong Edvin category names, by having it read the same catalogue |
| Who sees the receipt, given raw responses can carry tokens and internal ids? | Always visible — not gated behind a debug flag |

---

#### R31 — One contact-reason catalogue, declared once, parsed on reference

The Zendesk contact-reason value → Edvin category name mapping, and the option list the agent picks from, are **one** list with **one** declaration site.

- **R31.1** The catalogue is declared in the root script (node 10) as an array of rows, one per contact reason, each carrying: `value` (the Zendesk field value), `label` (what the agent sees in the select), `edvin` (the Edvin category name), `path` (`fl` or `sc`).
- **R31.2** It is written to **form data** as a JSON string (`contact_reasons`), and read anywhere with `JSON.parse(ZT.getVariableValue("contact_reasons", "[]"))` then `.find()` by `value`. Form data, not transforms: it has no TTL and it crosses the Tree-node boundary into the VI subtree, which is what lets the VI copy be retired rather than merely corrected.
- **R31.3** `transforms.contact_reasons_dynamic` (`fl_paths` / `sc_paths`) remains — the two native dynamic selects on nodes 77 and 47 address it by transform path and cannot read a form-data JSON string. It must be **derived** from the catalogue, never typed out a second time.
- **R31.4** No other node in this tree or the VI subtree may restate any part of the mapping.
- **R31.5** Adding, removing or renaming a contact reason is a single edit to the catalogue row.

**Acceptance criteria**

- **AC-31.1** `transforms.contact_reasons_dynamic` is byte-identical to v53's, order included — the agent sees the same options in the same order on nodes 77 and 47. *(Verified: asserted in the Stage A harness by executing both roots and comparing the serialized transform.)*
- **AC-31.2** For all 21 contact-reason values, the Edvin category name resolved by node 46 is identical to the name its inline map resolved in v53. *(Verified: 21/21.)*
- **AC-31.3** Every `edvin` value in the catalogue matches a category name in Edvin's own errand configuration (`edvin-errand-config-full-2026-08-06.json`). *(Verified for all 19 first-line names; the 2 Self Transfer Guarantee (VI) SC names are not present in that captured single-channel response and remain unverified offline.)*
- **AC-31.4** `grep CONTACT_REASON_BY_ZENDESK` returns nothing in either tree. *(Verified.)*

#### R32 — API request receipt (the one logging exception)

Brent's no-logging rule stands with one carve-out, stated 2026-09-05: **the tree records and displays its API requests.** No `ZT.log`, no per-step breadcrumb log, and specifically no arm/flush helper pasted into multiple scripts.

- **R32.1** Each script that already names the call it is about to fire appends one entry — request alias plus the subject it is working on — to an append-only form variable (`api_trail`). One added line per call site; no function, no shared block.
- **R32.2** One script node renders the receipt: repeats of the same alias+subject collapse into an attempt count, each row is graded from `actions[alias]._zt_meta.response.code`, and the output is two cards — failures first, then completed — written to form data as `api_receipt_html`. Nothing routes on it.
- **R32.3** The receipt shows on the end-of-run screens (Closing Call and End Session) and is visible to agents.
- **R32.4** A request whose response is no longer in `actions` is reported as uncaptured, never as a failure.
- **R32.5** The failure card the Request Failed screens already show carries the run's call sequence. This is a distinct, one-line rendering — not a second copy of the receipt renderer.
- **R32.6** `api_trail` clears on a fresh launch and on Restart only, so an Additional/Different Request pass accumulates onto the same receipt.

**Acceptance criteria**

- **AC-32.1** A run in which one request returns 400 shows exactly one row under Failures, carrying that request's message. *(Verified.)*
- **AC-32.2** A create call fired three times against two subjects renders two rows, one of them marked ×2. *(Verified.)*
- **AC-32.3** A request present in the trail but absent from `actions` renders as "no response captured" and counts as completed, not failed. *(Verified.)*
- **AC-32.4** An empty trail renders an empty string — the closing screen is unchanged when no API call ran. *(Verified.)*
- **AC-32.5** The Request Failed card still names the failing request, and the create call still takes its label from `ticket_kind`. *(Verified.)*
- **AC-32.6** The full walk of the happy fixture fires exactly the same Connected Objects, the same number of times, as v53, and ends at the same terminal node. *(Verified: identical, 8 aliases, 1 call each, node 48.)*

#### R33 — No-PNR-for-this-order screen

- **R33.1** The screen keeps its warning content block, and its title carries a yellow warning label.
- **R33.2** The intake values (order reference, contact reason, channel) render as discrete label/value rows in the pattern the tree's other cards use, not as a `<br>`-joined run inside a paragraph.
- **R33.3** The wording, the merge fields and the single Continue button to the no-PNR bridge are unchanged. Markup only.

**Acceptance criteria**

- **AC-33.1** Same three merge fields, same button, same target node. *(Verified in the diff.)*
- **AC-33.2** Renders correctly in the narrow Zendesk sidebar. **NOT VERIFIED — Stage B, live only.**

---

#### CR-018.1 — Defect found in passing: the VI subtree threw on five contact reasons

Not part of the ask; found while establishing which of the three copies was canonical, and fixed by R31.

The three copies of the mapping had drifted. Checked against Edvin's own errand configuration, **node 46 was right and node 2 and VI node 81 were wrong** on five rows:

| Zendesk value | node 2 and VI node 81 said | Edvin actually has |
|:---|:---|:---|
| `contact_reason__name_correction_change` | Name Correction/Change | Name correction/change |
| `contact_reason__add_passenger` | Add Passenger/New ticket sell | Add passenger/New ticket sell |
| `contact_reason__document_travel_info` | Document & Travel Info | Document & Travel info |
| `contact_reason__document_travel_info_sc` | Document & Travel Info | Document & Travel info |
| `contact_reason__payment_question` | Payment Question | Payment Questions |

In node 2 this was harmless: it computed the name into a `const` and never read it — dead code since the type resolver started handing it `transforms.category`. **In VI node 81 it is live**: `channel.categories.find(c => c.name === CONTACT_REASON)` is a case-sensitive match, so each of those five contact reasons fell into the `if (!category)` branch and threw *"No Edvin category match"* — a hard stop for the agent in the VI flow.

Reproduced and fixed under test: executing VI node 81's v16 body on an Edvin config carrying the real category names throws for all four testable values; the v17 body resolves all four. Cancellation, Rebooking, Refund and the remaining reasons were spelled correctly and are unaffected.

**Open question Q16 (non-blocking):** how long has this been live, and did any agent hit it? The five affected reasons only reach the VI subtree via node 75, which routes on the two Self Transfer Guarantee values — so a Payment Questions contact would only land there if node 75's routing let it through. Worth a look at the VI subtree's Zendesk sessions before deciding whether it needs a customer-facing note.

---

**Findings and fixes**

| # | Node(s) | Fix |
|:---|:---|:---|
| 1 | 10 (root) | Replaced the hand-typed `contact_reasons_dynamic` literal with the 21-row catalogue, written once to form data as a JSON string; `contact_reasons_dynamic` is now derived from it with two `filter`/`map` calls. Also seeds `api_steps` (alias → readable request name) so node 86 and node 19 stop each carrying their own copy, and clears `api_trail` / `api_receipt_html`. |
| 2 | 46 (Format Types) | 21-entry map deleted; resolves `edvin_category_name` from the catalogue. −20 lines. |
| 3 | 2 (Dynamic Actions List Options) | Dead 21-entry map and its unused `CONTACT_REASON` assignment deleted. −22 lines. |
| 4 | VI subtree 81 (Format Types) | Same replacement, reading the catalogue across the Tree-node boundary; added an explicit throw if the catalogue is missing; removed the `ZT.log` in the no-category branch and folded its detail into the thrown message. −25 lines. **Fixes CR-018.1.** |
| 5 | 9, 21, 29, 32, 44, 64, 65, 93, 95 | One line each, next to the existing `last_api_alias` write, appending `alias~:~subject~||~` to `api_trail`. Nodes 9 and 93 append two entries — node 42 fires two Connected Objects. |
| 6 | **19 (new Script)** | "Render API Receipt". Parses the trail, collapses repeats into an attempt count, grades each row from `actions[alias]._zt_meta`, writes `api_receipt_html`. Lowest unused node id. |
| 7 | 83, 100 | Rewired into node 19: node 83's continuation and default button, and node 100's button, were 23 and are now 19; node 19 continues to 23. Incidentally removed a pre-existing Content→Content adjacency (100 → 23). |
| 8 | 23, 48 | Print `${api_receipt_html}`. |
| 9 | 86 (API Failure) | Step label read from `api_steps` instead of its own inline map (one-line `ticket_kind` refinement kept for the create call); prints the run's call sequence on the failure card. |
| 10 | 29 (Clear Data) | Clears `api_receipt_html` alongside the other failure-path state. |
| 11 | 101 | Yellow WARNING pill on the title, boxed label/value rows for the three intake values, a "What happens next" list instead of a third paragraph. Wording, merge fields and the Continue target unchanged. |
| 12 | 5 (claude.md), VI 5 (claude.md) | New v54 / v17 sections and changelog entries; data-dictionary entries for `contact_reasons`, `api_steps`, `api_trail`, `api_receipt_html`; the two deliberate validator exceptions recorded. |

**Checked and deliberately NOT touched**

- **`transforms.contact_reasons_dynamic` stays a transform.** It is the documented transforms exception (a native dynamic select's `list_dynamic_source` addresses `{type: "transforms", variable: "contact_reasons_dynamic.fl_paths"}`). Moving it to form data would break both selects silently.
- **`last_api_alias` stays.** Nodes 88 and 94 route on it with button logic expressions, which need a plain scalar. `api_trail` is history; `last_api_alias` is the current call. Different lifecycles, both read.
- **Node 83's missing `advanced_logic_node='1'`.** `lint_tree.py` reports this as the tree's one error, on v53 as well as v54. Node 83 was touched by this CR (its continuation and default button), but the flag was left alone: it is live and working, and flipping it changes how the engine evaluates that button. Flagged, not fixed — it needs its own change and a live test.
- **The unscoped raw-response dumps on the eight Request Failed screens.** Still open from v43 ("Debug printing is unscoped"). Brent chose an always-visible receipt, and the receipt itself prints only alias, HTTP code, subject and error message — no body dump. The pre-existing `${actions.ALIAS | stringify}` dumps are unchanged and remain the open item.
- **Node 10 / node 29's duplicated reset blocks.** `lint_tree.py` reports them sharing 20 identical 8-line windows, and v53's own claude.md lists the transforms→form-data migration of that state as still open. Out of scope.

**Two deliberate validator findings**

`validate_tree.js` enforces "everything node 10 resets, node 29 resets too", and now reports `contact_reasons` and `api_steps` as unreset. Both are immutable reference data seeded once per session, not per-run state — clearing them in node 29 would blank the catalogue on the Additional Request path and break node 46 and node 86. The validator needs a CATALOGUE exclusion set alongside its existing INBOUND one; that is a change to the `etg-errand-regression` harness, not to this tree.

**Regression risk**

Stage A only. What was run, and what it proves:

- `lint_tree.py`: 73 warnings vs 74 on v53, one pre-existing error either side. No new finding — every difference is a reduced count (nodes 2/46 shared-code windows 16 → 11, UPPER_CASE consts 5 → 3) or a line-count shift on an already-flagged node.
- `validate_tree.js`: 18 problems vs 16, the two being the documented catalogue exceptions above.
- `walk.mjs` on the happy fixture: same path plus node 19, same 8 Connected Objects at 1 call each, same terminal node 48, all v53 expectations pass plus a new `api_trail` expectation (which fails against v53, as it should).
- `walk.mjs` on the no-order-ref fixture: fails identically on v53 and v54 — a pre-existing stale fixture, see below.
- A purpose-built harness executing the real node bodies out of both exports: 24 assertions across the catalogue, node 46, node 2, node 19, node 86 and VI node 81, including the before/after reproduction of CR-018.1. All pass.
- `etg-errand-regression run_full.js`: **byte-identical results CSV before and after** — this change moves nothing across the 64-case matrix.

Two things this cannot certify, both flagged rather than worked around:

1. **`etg-errand-regression`'s verdict is not currently usable.** It reports 0 of 64 cases passing on the **v53 baseline** as well as on v54. Its `oracle.js` still expects node 27 to emit `child_tickets` / `silent_tickets`; the v46 unified `work_queue` replaced those, so every case reads 0 child / 0 grandchild / 0 silent and every case fails on the note format. The harness has been giving false FAILs since v46 (2026-09-02). The before/after delta is still meaningful — and it is clean — but the harness needs updating before its pass/fail means anything. Recommend a separate pass on `oracle.js` and `run_full.js`.
2. **`walk.mjs`'s loop detector is desensitised by `api_trail`.** It fingerprints a node revisit by hashing all of form data; `api_trail` grows on every pass through a call site, so a non-advancing loop that crosses one no longer looks identical. On the no-order-ref fixture, v53 fails fast with "revisited with identical form data" and v54 runs to the 5000-step limit — same defect, worse diagnosis. Excluding `api_trail` and `api_receipt_html` from that hash restores it exactly (tested locally: identical failure and identical path). One line in `walk.mjs`. Zingtree's own runtime guard counts node revisits rather than form data, so **live behaviour is unaffected** — this is a harness sensitivity issue, not a tree defect. Recommend the harness fix before the next build that touches a loop.

**Not run: Stage B.** No live import, no browser session. The live-only checks this build needs, in priority order: node 19 renders on the Closing Call and End Session screens in the Zendesk sidebar; node 101's pill and rows render correctly at sidebar width; both contact-reason selects on nodes 77 and 47 still populate (the dynamic-select path resolution is the one thing no offline harness sees); node 42's two-Connected-Object call produces two trail entries; and a deliberate failure — an order reference Edvin rejects — shows the call sequence on the Request Failed card.

**Delivery**

- `Register Errands - Dynamic (v54 contact-reason catalogue + API receipt + no-PNR screen, 2026-09-05).json` — built on the live v53 dev export Brent supplied (tree 218204451), not on the v52 file in the repo.
- `Register Errands - VI Dynamic (v17 contact-reason catalogue, 2026-09-05).json` — built on CR-017's v16, **which is itself still pending Brent's approval**. The two must be imported together: v17 reads a catalogue only v54's root seeds, so importing VI v17 without the parent v54 would make node 81 throw on every contact reason.
- `register-errands-dynamic-v53-to-v54-diff-2026-09-05.md` and `register-errands-vi-v16-to-v17-diff-2026-09-05.md` — 57 of 77 parent nodes byte-identical (74% untouched); 2 of 43 VI nodes changed.
- `register-errands-dynamic-v54-changes.mermaid` — the three changed areas.
- `Register Errands - Dynamic.fixture.json` — updated with the `api_trail` expectation.
- Preview URL (dev tree, mock data): `https://zingtree.com/preview/218204451?zv_zd_ticket_id=334818&zv_custom_field_33772689958162=1122-047-131&zv_custom_field_29559177650834=contact_reason__cancellation&zv_zendeskChannelIdentifier=CH-PHONE&zv_orderReference=1122-047-131&zv_channel=Phone&zv_mock=1`

**Follow-ups this CR raises**

1. The `zingtree-workflow-builder` house rule 2 ("no logging") and `references/08-troubleshooting.md`'s house position both need Brent's carve-out written into them, or the next session strips the receipt again exactly as v53 did. Run `analyze-workflow-session` to capture it.
2. `etg-errand-regression`'s `oracle.js` / `run_full.js` need bringing up to the v46 `work_queue` shape.
3. `walk.mjs` needs `api_trail` / `api_receipt_html` excluded from its revisit fingerprint.
4. Q16: check whether any live VI session hit the five broken contact reasons.

---

#### CR-018 — revision, same session (2026-09-05, after Brent's first look at the build)

Three corrections. R31/R32/R33 above are unchanged as requirements; this records where the first build did not meet them.

**1. The receipt rendered nothing — wrong namespace for the HTML.** Node 19 wrote `api_receipt_html` to form data and nodes 23/48 read `${api_receipt_html}`. The builder skill's house rule says rendered HTML goes to form data, but **every one of the eight blocks that demonstrably renders in this tree is a transform** — `failure_html`, `ticket_card_html`, `customer_action_table_html`, `edvin_errand_card_html`, `manual_errand_registration_html`, `unresolved_note_html` — and so was v45's `${transforms.execution_log_html}`. Zingtree's own Dynamic HTML article uses `${transforms.custom_html}`. Nothing in this tree has ever proven a form-data merge field renders markup rather than escaping it. Node 19 now writes a transform; nodes 23/48 read `${transforms.api_receipt_html}`; nodes 10/29 reset it as a transform. The trail itself stays in form data, where the no-TTL guarantee is what matters. **This is a live-only failure mode no offline harness catches** — worth raising with the skill's house rule, which appears to be asserted rather than demonstrated.

**2. The log record now lives in the string (Brent's call).** The first build put only `alias~:~subject` in `api_trail` and had node 19 grade each row from `actions[alias]` at render time. Brent: *"The display-ed logger built from the concatenated formdata string value is not there."* `actions` keeps one response per alias, so in the ticket loop the only surviving response is the last — four creates were indistinguishable from one, and a first attempt that failed 500 before a retry succeeded left no trace. The trail is now two entry kinds, appended in call order:

```
A~:~<alias>~:~<subject>                      armed, a call is about to fire
R~:~<alias>~:~OK|FAIL~:~<code>~:~<detail>    result, written where it is known
```

Nine ARM sites (unchanged: 9, 21, 29, 32, 44, 64, 65, 93, 95). Five RESULT sites, each one line in a script that **already reads that response**, so nothing new is looked up: node 90 (findorder), node 46 (both of node 42's calls), node 64 (create_child_ticket), node 65 (get_side_conversation_detail), node 86 (whatever failed). Still no helper block anywhere. Node 19 attaches each R to the most recent still-open A for that alias and renders one row per attempt, nothing collapsed.

Three calls still fall back to an end-of-run read: nothing in this tree reads back `create_internal_note__no_group_id`, `zingtree_redesign__update_side_conversation` or `edvin__register_errand` — which is why their aliases were never derivable from the export. On the success path their A entry has no R, so node 19 grades them from `actions` and labels the row *"read back at end of run"* rather than passing a late read off as a contemporaneous one. On the failure path node 86 records them properly. Giving them real R entries means a write in a script that does not otherwise touch them, at a node with two possible successors — worth doing only if that end-of-run read proves misleading in practice.

**AC-32.7** A create call that fails 500 and succeeds on retry renders two rows: the failed attempt keeps its own code and message even though `actions` no longer holds that response. *(Verified.)*
**AC-32.8** Four creates in one run render four graded rows. *(Verified.)*
**AC-32.9** Rows whose outcome was read at end of run are labelled as such. *(Verified.)*

**3. `new Date()` removed — it would have thrown in all nine arm scripts.** The first revision timestamped each ARM entry with `new Date().toISOString()`. `etg-errand-regression`'s `engine.js` sets `Date: undefined` in its sandbox — a deliberate model of Zingtree's script environment — and running the tree turned all 64 cases into `ENGINE ERROR / node 21: TypeError: Date is not a constructor`. v53 constructs a `Date` nowhere. The timestamps are gone; append order is the sequence and node 19 numbers the rows as it renders, which is the read-out v45's `seq` field gave. **Note for the builder skill: no `Date` in script nodes.** This is the one case where the stale errand-regression harness earned its keep — its engine model caught a real defect its oracle could not.

**Verification after the revision** — `lint_tree.py` 73 warnings vs v53's 74, one pre-existing error either side; `validate_tree.js` 18 problems vs 16, the two being the documented catalogue exceptions; `run_full.js` **field-for-field identical to the v53 baseline across all 64 cases, zero engine errors**; walk on the happy fixture unchanged (same 8 Connected Objects, 1 call each, terminal 48); the build's own harness 34 assertions, all passing. Diff: 56 of 77 nodes byte-identical, 1 added, 20 modified.

**Also corrected: the preview/mock URL and the fixture's query params.** Brent supplied the right shape:

```
https://eu.zingtree.com/preview/218204451?zv_zd_ticket_id=334818&zv_custom_field_33772689958162=1122-047-131&zv_custom_field_29559177650834=contact_reason__cancellation&zv_custom_field_31213052370194=genesys_interaction_type__call
```

Host is `eu.zingtree.com`, and **only the raw inbound fields are seeded** — the ticket id plus the `custom_field_<id>` params. The standardized names and derived values (`order_reference`, `orderReference`, `zendeskChannelIdentifier`, `channel`) are set programmatically or by a form field inside the flow. The fixture had been seeding all four plus `mock`, which masks any break in the code that derives them; it now seeds inbound only, and the walk still passes — which is itself the proof that those three are genuinely derived. A `#<node_id>` fragment opens the tree at that node.

The fixture's `api_trail` expectation was dropped: exact-match on a growing log string is brittle. The log's parsing, per-attempt grading, retry ordering and end-of-run fallback are asserted deterministically in the build's own harness instead.

#### CR-018 — revision 2, same session (2026-09-05): the log must render on the abort path

**Brent:** *"on an api fail, I sometimes need to press 'end session', and there is not log tail that displays after this. The end session / error screens should display the log tail from the concatenated formdata string. like v45 did."*

**The gap.** Node 19 was the only renderer and it sat on the success path only (node 83 default / node 100 → 19 → 23). An API failure routes 86 → 94 → a Request Failed screen → *End Session* → node 53, and node 19 is on none of that. So the exact case the read-out exists for — a failed call, abandon the run, what happened? — showed nothing. R32.3 said "the end-of-run screens"; that was too narrow, and the first two builds met it as written while missing the point.

**R32.10 (new).** The log renders on **every screen a run can end on, whichever way it ends** — the eight Request Failed screens, the Session Ended - Request Failed screen, and both success terminals.

**How.** Node 86 already runs on every failure, before node 94 picks a screen, and already grades the failing call. It now renders the log as well. That covers nodes 14, 16, 18, 28, 31, 40, 45, 87 and 53 with no new nodes and no rewiring — the transform is set before any of those screens render, and it survives the End Session click. Node 19 keeps the success end. Eleven screens print `${transforms.api_receipt_html}`: those nine plus 23 and 48.

**The renderer is now duplicated in nodes 19 and 86, deliberately.** This is a named exception to the house no-shared-blocks rule, and the only one in this tree. Both copies carry an `API LOG RENDERER (keep IDENTICAL in nodes 19 and 86)` banner and the build's harness asserts they are byte-identical. The reason the rule yields: the log has to render at the end of a successful run and at an aborted one; those are two different paths ending at two different terminals (23/48 vs 53); routing both through one renderer needs a script-to-script hop plus a router that cannot tell which way it was entered. The old execution log kept its renderer in its own nodes 86 and 89 for exactly this reason, which is what Brent meant by "like v45 did". `lint_tree.py` reports 75 shared 8-line windows between 19 and 86 — expected, and the reason the banner exists.

Two small consequences: node 86's one-line "Calls this session" summary is gone, since the full log now renders under the same card; and the shared block declares `log_steps` rather than `api_steps`, because node 86 already declares that `const` and byte-identical copies matter more than one redundant parse.

**AC-32.10** After a failed call and *End Session*, node 53 shows the log with the failing call under Failures carrying its code and message, and the calls that succeeded before it under Completed. *(Verified — the harness runs node 86's real body and asserts the transform, the graded `R` entry, both card counts, and the merge field's presence on all eleven screens.)*
**AC-32.11** The renderer is byte-identical in nodes 19 and 86. *(Verified, asserted on every run of the harness.)*

**Verification after revision 2** — `lint_tree.py` 75 warnings vs v53's 74, the one addition being the deliberate 19/86 shared block; one pre-existing error either side; no new history-comment or banned-token findings. `validate_tree.js` 18 problems vs 16 (the two documented catalogue exceptions). `run_full.js` field-for-field identical to the v53 baseline across all 64 cases, zero engine errors. Walk on the happy fixture unchanged. Harness: 39 assertions, all passing. Diff: 47 of 77 nodes byte-identical, 1 added, 29 modified — the jump in modified nodes over revision 1 is the nine screens that gained the merge field.

**Still not verified — Stage B.** Whether a `transforms` merge field renders the log correctly on each of those eleven screens at Zendesk-sidebar width, and whether node 86's script completes cleanly now that it does two jobs. The abort path is the one to test first: force a failure, press End Session, confirm node 53 carries the log.
