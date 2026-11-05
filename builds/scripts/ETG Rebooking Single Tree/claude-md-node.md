# claude.md - ETG Rebooking (single tree)

## Purpose

The agent-facing rebooking workflow for Etraveli Group, run from the Zingtree app inside a
Zendesk ticket. An agent selects one or more PNRs on the order, works out the correct rebooking
outcome for each one, reads the outcomes back to the customer, then processes the PNRs in groups
(take payment, escalate, GDPR docs, refund flex, no action, different request) and writes a
single internal note back to Zendesk.

This tree replaces a 15-tree, 256-node family (hub `1. Rebooking` 359750132 plus GDS, LCC,
Portals, Take Payment, Escalate, GDPR Docs, No Action, Different Request, Refund Flex, the four
outcome-text trees 2a/2b/4a/4b and Persistent Buttons) with 52 nodes in one tree.

## The one idea you need

**All of the rebooking business logic lives in node 8's script.** It is an interpreter over a
declarative step graph. Nothing about the tree's shape changes when the business rules change -
you edit one JavaScript object.

- `STEPS` - every question, capture form, notice and outcome, with its routing rules.
  `kind: "ask"` renders fields, `"route"` decides silently, `"notice"` explains and re-asks,
  `"outcome"` ends the PNR.
- Rules are **first match wins**, top to bottom - exactly like button order in the old Scoring
  nodes. Keys inside `when` are ANDed; the array of values for a key is ORed.
- `PORTALS` / `OPTIONS` - the portal groups and every dropdown's option list.
- `OUTCOMES`, `ESCALATE_TEXT`, `REFER_TEXT` - the outcome wording (these three replace trees
  2a, 2b, 4a and 4b entirely).

Common edits:

| You want to... | Edit |
| :--- | :--- |
| Add or remove a portal | `PORTALS` (and `PORTALS.all` for the dropdown) |
| Add a ticket status or rebooking reason | `OPTIONS` |
| Change what a screen asks for | that step's `fields` array |
| Change a screen's guidance text | that step's `guidance` |
| Change where an answer leads | add or reorder a row in that step's `next` |
| Change an outcome's wording | `OUTCOMES` / `ESCALATE_TEXT` / `REFER_TEXT` |
| Add a whole new question | one new `STEPS` entry + point an existing rule at it |
| Add a handling group (Take Payment, etc.) | `HANDLINGS` in node 18's script |
| Change the internal note format | `LABELS` in node 42's script |

If a new question needs a field that does not exist yet, add the field name to `FIELDS` in node 8
**and** add a native form field with the same name to node 10, gated on
`config.conditional.simple = [{variable: "need_<field>", op: "eq", value: "yes"}]`.

## Architecture

Three phases, one linear spine each, plus three loops.

**Phase A - select (nodes 1-5)**
1 Script root: clear last run's transforms, seed Zendesk / Genesys ids -> 2 Content: security
verification + findorder Dynamic View grid -> 3 Script: store selection, flag linked PNR ->
4 Router -> 5 hard stop for linked PNRs, else 6.

**Phase B - determine each PNR (nodes 6-14) - LOOP**
6 Script cursor (`transforms.selected_pnrs`, resets `pnr_index` to 0 when exhausted) ->
7 Content: passenger grid + optional new dates -> **8 Script: THE ENGINE** -> 9 Router
(`transforms.step_is_final`) -> 10 Content: the one ask/capture screen, loops back to 8 ->
11 Content: outcome -> 12 Data: update flow tags -> 13 Script: harvest and clear the answers ->
14 Router (`transforms.isMorePNR`) -> back to 6, or on to 15.

The 8 -> 10 -> 8 cycle is deliberate: the engine renders one step per pass. It is safe because
every step owns **distinct** answer variable names (`ticket_status`, `fm_policy`, ...), never a
shared `answer` variable, so each pass either has a new answer and advances, or blocks on a
`required` field. There is also a hard `guard < 50` bail-out inside the interpreter.

**Phase C - customer decision and grouped handling (nodes 15-44)**
15 Script: build the per-PNR decision table (dynamic HTML radios) -> 16 Content: agent records
Proceed / Do not proceed / Different request -> 17 Script: bucket by handling ->
**18 Script cursor over buckets + HANDLINGS catalog** -> 19 Router (different request?) ->
20 Content: one handling screen for all six handlings -> 21 Script: finalisation steps ->
22 Content: finalise in Edvin -> 23 Script cursor over the PNRs in the bucket -> 24 Router ->
25 Data: child ticket -> 26 Router -> 41 Router (more buckets?) -> 42 Script: format the note ->
43 Data: internal note -> 44 Content: terminal.

Different-request branch: 27 Script cursor -> 28 Content: pick the request -> 29 Router ->
30-38 Tree calls to the nine request trees -> 39 Script: record -> 40 Router -> 41.

**Global actions (nodes 45-51)** are unlinked on purpose - designate them as persistent buttons
in the tree settings. 45 Escalate / 46 Supervisor callback / 47 Interaction disconnected ->
48 next steps -> 49 Data: add tags -> 50 Script: save the PNR in progress -> 51 Router: rejoin
the loop at 6 or go to 15.

`claude.md` is node 52, unlinked.

## Data dictionary

**Inbound (query params / Zendesk app)**
- `zd_ticket_id` - Zendesk ticket id, printed in the internal note
- `custom_field_30866832265234` - Genesys interaction id, printed in the internal note
- `isShowFlexibleTicket` - `"true"` when the order has an unused Flexible Ticket product. When
  it is not `"true"` the engine forces `hasFlexibleTicket = "false"` and hides the question.
- `isSpecialCarrier` - DY/D8 flag, used by the LCC Force Majeure rules
- `isWenrix` - drives the not-yet-issued GDS branch
- `cc2c` - card-charged-to-customer order; combined with `actions.findorder.hasChargeback`

**Engine answers (form data)** - the full list is `FIELDS` in node 8. Questions:
`hasFlexibleTicket, ticket_status, rebooking_reason, portal, retrieve_pnr, consolid_exceptions,
fm_policy, fm_rebook, changes_permitted, cancel_checkin, gdpr_waiver, calculation_way,
calculation_method, flex_alternative, who_rebook, reb_permitted, man_rebooking`. Captures:
`new_flights, system_command, system_cost, air_edvin, cost_to_pax, currency, emd, waiver,
fare_difference, tax_difference, yy_reb_penalty, farebase`. Node 13 harvests them onto the PNR
object and clears them (except `hasFlexibleTicket` and `currency`).

**Engine control (form data)**
- `step` - the current step key in `STEPS`
- `need_<field>` = `"yes"` / `"no"` - reveals the matching conditional field on node 10 or 20
- `outcome`, `proceedHandling`, `new_flights` - the PNR's result; `proceedHandling` is the
  bucket key in phase C
- `groupedPNR_Route` - the current bucket's handling
- Bucket answers: `total_cost_pax_all, payment_method, verify_email, payment_confirmed,
  escalate_to_support, free_text`

**Transforms**
- `selected_pnrs` (node 3) -> `current_pnr` + `pnr_banner` (node 6)
- `selected_pnrs_customer_action` (node 13) -> the decision table (15) and buckets (17)
- `grouped_pnrs` (17) -> `current_pnr_bucket` (18) -> `current_pnr_in_bucket` (23)
- `selected_pnrs_final` (23, 39, 50) -> `internal_note_details` (42)
- `child_ticket` (23) -> Connected Object 20
- Booleans read by routers: `step_is_final`, `is_linked_pnr_selected`, `isMorePNR`,
  `isMorePNR_InBucket`, `isMoreGroupedPnrs`, `bucket_is_changes`, `create_child_ticket`,
  `bucket_child_ticket`, `isCreateChildTicket`
- HTML: `step_html`, `outcome_html`, `notice_html`, `pnr_details_banner`,
  `customer_action_table_html`, `bucket_html`, `finalise_html`, `grouped_pnr_bucket_details`,
  `different_request_html`
- `<field>_options` - option lists for node 10's dynamic selects

**Connected Objects (org 113)**
- 23 / alias `findorder` - order lookup. Dynamic View widgets 26 (PNRs), 15 (linked PNRs),
  27 (passengers). Selections read via `views.findorder`.
- 20 - create child ticket (nodes 25)
- 54 - update ticket tags (nodes 12, 49)
- 57 - create internal note (node 43)

**Called trees** (nodes 30-38): 351646559 Cancellation (returns to node 39), 767278955 Refund,
920077937 Name correction, 595224554 Add passenger, 305651198 Personal information,
540892140 Document and travel info, 816422379 Payment questions, 142897570 Ancillaries,
609698954 Other.

## Conventions and gotchas

- `merge_vars_not_fixed = "1"` is **required**. Nodes 10, 11, 20 and 22 are shared screens that
  render script-staged transforms on every pass; with the default `"0"` Zingtree freezes the
  first value they ever rendered and every screen looks identical.
- `hide_back_button = "1"` is **required**. Back would return the agent to the same engine
  screen with a stale `step`. Wrong answers are corrected through the notice mechanism, which
  clears the offending fields and re-asks.
- Never add a dead end. An impossible combination becomes a `notice` step: it explains the
  problem, clears that question's answers and re-asks it.
- Routers only ever test booleans a script set (`transforms.x == true` / `== false`), never raw
  form values. The one exception is node 29, which matches `different_request` directly - the
  same shape the production ETG trees use.
- Every router has `continuation_node_id` set to the same target as its `== false` branch. No
  button has an empty expression.
- Node 15's dynamic-HTML radios are the only dynamic inputs in the tree, because the row count
  is only known at runtime. Every other input is a native field.
- The engine's guard is `guard < 50`. If you add long chains of `route` steps, raise it.

## Changelog

- 2026-07-27 - Rewrite from the 15-tree export `Selected_from_ETraveli Group_2026-07-27.json`
  into one tree. 256 nodes -> 52. Business logic moved into node 8's declarative step graph;
  trees 2a/2b/4a/4b replaced by `ESCALATE_TEXT` / `REFER_TEXT`; trees 5/6/7/8/10 replaced by
  the `HANDLINGS` catalog in node 18; Persistent Buttons folded in as unlinked nodes 45-51.
  Fixes carried in the rewrite: portal option `"Amadeus NDC-X "` had a trailing space that no
  expression matched; `payment_method` option `"Payment Link on spot (customer is paying while
  on phone"` was missing its closing bracket so its router branch never fired; `"Send  Payment
  Link"` had a double space; `hasFlexibleTicket` was left empty (not `"false"`) when no
  Flexible Ticket existed, so every `== "false"` rule failed; the Persistent Buttons tree
  returned to tree 301173830 instead of the hub; six dead-end screens now re-ask instead of
  trapping the agent; `Transfer to SC` now sets a handling instead of leaving
  `proceedHandling` empty; `eval()`-based variable harvesting replaced with explicit lists.
