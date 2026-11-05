# ETG (Etraveli) — VI (Virtual Interlining) Errand Registration — Requirements

| | |
| :---- | :---- |
| **Account** | ETG (Etraveli) |
| **Workflow / tree** | VI (Virtual Interlining) Errand Registration (`tree ID: not yet created` — forked from `Register Errands - Dynamic`, tree 139367450/595124299, v35 lineage) |
| **JSON location** | `Zingtree Builder/Workflow JSONs/ETG/` (to be created at build time — fork target: `Register Errands - Dynamic (v35 replay idempotency 2026-08-05).json`) |
| **Status** | **Ready for build** |
| **Owner** | Brent Thomas |
| **Created** | 2026-08-05 |
| **Last amended** | 2026-08-25 — CR-002 (nodes 52/67 operator-precedence fix; brings implementation into compliance with existing AC-6.3, no requirement text changed). Previously 2026-08-21 — CR-001 (combined errand must carry every PNR in its group; amends R10). Previously 2026-08-05 — same-day amendment: Q1–Q3 answered, R10 revised, R3/R9 notes added, §8 environment note added. Amended in place (no CR — the doc had not yet reached a settled Ready-for-build state; see §13). |
| **Sources** | `Call Reviews/2026-08-04-ETG (Etraveli).md` (Spiky `c1cd8edc-dd7a-4684-a6f9-baf34275f9fb`) · `Zingtree Builder/Requirements/ETG/register-errands-dynamic-requirements.md` (CR-005/R13, and the R1–R23 patterns this doc reuses) · `Register Errands - Dynamic (v35 replay idempotency 2026-08-05).json` (base tree, 46 nodes, its `claude.md` node 5) · `VI - demo_1785950574406.json` (Olga Gerothanasi's reference demo, tree 915692749, org 113, `live=0`, created 2026-06-18, last modified 2026-07-29, tag `errand_testing`) · `Account Management HQ/ETG (Etraveli)/MEMORY.md` (Karolina Zetterberg 2026-07-09 multi-PNR-errand ask) · Slack `#zingtee-etg-squad` (thread parent ts `1785360732.130779`; Olga Gerothanasi, Ravindu Roshan Liyanagamage, Katya, 2026-07-29 through 2026-08-05) · Brent direct, 2026-08-05

> **New build, not a change request.** The 2026-08-04 call resolved the open question in `register-errands-dynamic-requirements.md` CR-005 ("whether VI lives as a separate tree or inside this one") in favor of a separate tree — VI's PNR-loop-free journey is structurally different from the parent tree's per-PNR loop, so it gets its own requirements doc per house rule. See that doc's CR-005 for the pointer back here.
>
> Requirement text is never edited after agreement — changes arrive as numbered CRs in §12.

---

## 1. Business context & outcome

Virtual Interlining (VI) orders combine PNRs across airlines with no formal interlining agreement, so when a schedule change or delay hits one leg, ETG agents must walk a prescribed alternative→new-ticket→cancellation ladder rather than the generic errand flow. Today VI has no dedicated tree; Olga Gerothanasi built a demo (tree 915692749) to prototype the decision spine, but it forked the parent tree before six change requests (CR-007 through CR-012 — idempotency guards, ticket-creation grouping, `orderReference` payload fix, unresolved-selection escalation) landed, and it carries several defects of its own (§3, "Known defects"). Building on the demo directly would silently reintroduce all of that already-fixed work.

The 2026-08-04 call decided VI gets its **own tree**, forked from the current, patched `Register Errands - Dynamic` lineage, with the per-PNR loop removed: "VI PNRs are treated as segments of one trip, not independent legs" (Olga's stated reason). This tree ports Olga's VI-specific decision spine (disruption type, operational-window routing, the alternative ladder) and her VI type list onto that patched base, so VI inherits every regression fix the parent tree has already earned instead of starting over.

## 2. Actors & journey

- **Who uses it** — Etraveli contact-centre agents handling a VI-flagged contact reason (First Line / Schedule Change groups, same population as the parent tree).
- **Where it runs** — embedded in Zendesk, EU-hosted (`eu.zingtree.com`), same Edvin/Zendesk integration model as the parent tree.
- **Journey** — agent opens a VI-flagged ticket → tree calls Edvin Find Order → agent multi-selects **all** relevant PNRs for the order in one screen (no per-PNR loop) → agent indicates booking.com vs. non-booking.com (interim manual select, R9) → agent confirms STG eligibility manually (R4) → agent selects disruption type and, if applicable, delay reason (R5) → the tree routes to the Outside- or Within-the-Operational-Window alternative ladder (R6, R7) → the ladder resolves to one type + one action for the whole order (R8) → the tree creates exactly one child or silent ticket (plus any grandchildren the ladder requires) and registers the order's errand(s) in Edvin (R10/R11) → the tree offers the same Finish / Register-an-additional-request / End Session choice the parent tree's node 23 offers.

## 3. Scope

**In scope**
- Forking the current `Register Errands - Dynamic` (v35 lineage) as the new VI tree, with the per-PNR loop removed (D1).
- Porting Olga's VI decision spine (disruption type → operational-window routing → alternative ladder) and VI type list, sourced dynamically from Edvin, not hardcoded (D1, R3).
- Multi-PNR selection up front, single pass through every downstream screen (D1, R2).
- Mixed-action VI orders resolving to one type + one action + one child ticket, with the additional-request branch as the escape hatch (D2, R8).
- One Edvin errand per selected PNR, each carrying the order's single shared type+action — the parent tree's existing pattern, unchanged (R10; reverses this doc's initial D3 reading per Brent direct, 2026-08-05 — see R10 and §9 Q1).
- An interim manual booking.com / non-booking.com selector that sets the same routing variable the Admin API `partner` field will later populate (D4, R9).

**Out of scope (this round)**
- Automating the STG eligibility check (R4) — depends on date-of-issuance data ETG owes (Call Review 2026-08-04, They owe Brent #7).
- Automating booking.com/non-booking.com routing off the live API `partner` field (R9) — depends on the same owed dependency.
- Cleaning up or finalizing the VI category's type list in Edvin itself — that's ETG's Edvin configuration work, not a Zingtree build item (see Q2).
- Anything not touching the VI tree — this doc does not amend the parent `Register Errands - Dynamic` requirements doc's agreed requirement text (see the CR-005 pointer note added there).

**Known defects in the reference demo (tree 915692749) — explicitly not carried forward**
Olga's demo is reference material for its VI-specific content only (the decision spine and the type list), never as a build base. The following defects were found in it during this write-up and must not be re-imported when that content is ported into the new tree:
1. **Dead conditional field.** Demo node 32's `delay_reason` radio conditions on `disruption_type == "Trip delay"`, but the only matching option value is `"Trip delay within the Operational Window"` — the condition can never be true, so the field never renders. Fixed by R5/AC-5.1.
2. **Router tests raw form strings and dead-ends.** Demo node 33 branches on the literal `disruption_type` string three times and its default (`op: "def"`) button links to node `0` with no `continuation_node_id` — an unreachable-but-present dead end. House rule: routers test script-set booleans, not raw strings, and never leave a default pointed at a missing node. Fixed by R6/AC-6.3–AC-6.4.
3. **Unreachable bucket-dispatch subtree.** Demo node 17 ("Is Different Request Bucket?", a Scoring node) has zero buttons, and demo nodes 11–18 (a four-way bucket dispatch to Proceed/No Action/Escalate/Different-Request subtrees) are entirely unreachable as a result — nothing routes into node 11 from the tree's actual path. Not ported; superseded by R11's simpler single-bucket-per-order model.
4. **Duplicate form field.** Demo nodes 1 and 2 each carry two form fields named `notes` — one `hidden`, one `multiline_full` — sharing the same name. Not ported; the VI tree carries one `notes` field per screen.
5. **Dead code.** Demo node 8 ("Store PNR") is 100% commented out — it does nothing. Not ported.

## 4. Functional requirements

### R1 — Fork the patched base tree, not the demo · **Must**
- **Source:** Brent direct, 2026-08-05, confirming the 8/4 call's direction — Brent, Call Review 2026-08-04 (Brent owes #5): *"I do agree that a different tree will make it easier to edit this logic as well... We'll see how much progress we can make before the end of this week."*
- **Requirement:** The VI tree is built by forking `Register Errands - Dynamic (v35 replay idempotency 2026-08-05).json` (or its latest confirmed export at fork time) — not Olga's demo tree 915692749. Every idempotency/regression fix the parent tree carries from CR-007 through CR-012 (Finish/Additional-request split, full loop/cursor reset, action-identity resolution, `orderReference` payload, replay-safe duplicate guards) is inherited by construction and must not be reintroduced as a defect.
- **AC-1.1** — Given the VI tree is exported, when its node set is diffed against the v35 fork point, then every idempotency guard present in v35 (`attempted_*_keys`, `registered_errand_keys`, node 44's clamp/reset pattern) is still present, modified only where R2/R8/R10/R11 require a behavior change.
- **AC-1.2** — Given the VI tree is built, when it is checked against the five defects catalogued in §3, then none of them are present.
- **Notes / open items:** Demo tree 915692749 is reference-only for its VI-specific spine (disruption type, operational-window routing, alternative ladder, type list) and is never itself the fork base.

### R2 — PNR loop removed; PNRs selected once, up front · **Must**
- **Source:** "VI PNRs are treated as segments of one trip, not independent legs" — Olga Gerothanasi, per Call Review 2026-08-04 Headline and Decisions made ("Multiple selected PNRs are treated as one unit sharing one set of options").
- **Requirement:** The agent multi-selects all relevant PNRs for the order on the Find Order grid in a single screen (the parent tree's node 6 pattern, extended to multi-select). The parent tree's per-PNR loop — nodes 7 (`pnr_index` cursor) → 8 (passenger selection) → 9 (format passengers) → 11 (more-PNRs router back to 7) — does not exist in the VI tree. Every downstream screen (STG check, disruption type, alternative ladder, action/type selection) runs exactly once for the whole selection, not once per PNR.
- **AC-2.1** — Given an agent selects 3 PNRs on the Find Order grid, when they click Continue, then the tree advances directly to the STG eligibility screen once — not three times.
- **AC-2.2** — Given the VI tree's node graph, when it is walked end to end, then no node reads or increments a `pnr_index`-style cursor, and no screen loops back into a per-PNR passenger-selection step.
- **AC-2.3** — Given a single-PNR VI order, when the agent proceeds, then the flow's shape is identical to a multi-PNR order — there is no special-cased single-PNR path.

### R3 — VI type list sourced dynamically from Edvin, not hardcoded · **Must**
- **Source:** Parity with the parent tree's R1 ("Edvin API to provide all necessary errand data dynamically... No errand values are hardcoded in the tree"); demo defect noted by Brent direct, 2026-08-05.
- **Requirement:** The VI tree's `type` dropdown is populated at runtime from the Edvin errand-configuration API for the VI category — the same node 42/46 pattern the parent tree uses for every other category. Olga's demo node 2 static 39-option list is not ported as a literal, hardcoded option list; it is reference-only for validating what Edvin's VI-category configuration should return.
- **AC-3.1** — Given the VI tree loads, when the `type` dropdown renders, then its options come from the Edvin API response for the VI category, not from a literal string in a script or a form field's `options` value.
- **AC-3.2** — Given Edvin's VI-category configuration changes, when an agent reloads the tree after Edvin's cache window, then the new type list appears with no Zingtree edit.
- **Notes / open items:** The demo's 39-option list is dirty — see Q2. It has 4 duplicated options (`Accomodation compensation`, `Meal compensation`, `Not trained for VI`, `Chargeback/BR lawsuit in progress/lost`, each appearing twice) and mixes three unrelated type-sets in one list: SC-VI actions (alternative flight, rebooking pass, new ticket, cancellation variants), missed-connection/STG actions (rebooking of the flight missed, redirect to CR), and bare severity values (`Trivial`, `Minor`, `Critical`). Which of these actually belong under the VI category in Edvin is Olga's call, not Zingtree's — flagged, not resolved here.
  **Update — Brent direct, 2026-08-05, ANSWERS Q2:** *"[VI type/action values] should come from an API request (edvin errand configuration). This currently exists in the edvin source workflow (v35)."* This closes Q2 with no requirement change — R3 already specifies dynamic sourcing from Edvin. Made explicit: the demo's 39-option list is reference-only and has no bearing on what the dropdown offers. Whatever Edvin's VI-category configuration returns at runtime is authoritative — not any curated subset of the demo's list.

### R4 — STG eligibility check (manual, interim) · **Should**
- **Source:** "Before proceeding, confirm that the order is eligible for STG offers by reviewing the applicability based on the 'order date in site time' displayed in Edvin." — `VI - demo` (tree 915692749), node 32 alert copy, reference material.
- **Requirement:** The VI tree's first VI-specific screen (immediately after PNR selection and the booking.com/non-booking.com selector) shows this alert copy verbatim, instructing the agent to manually confirm STG eligibility in Edvin before proceeding. No automated check is built this round.
- **AC-4.1** — Given the tree reaches the disruption-type screen, when it renders, then the alert box shows the STG-eligibility copy above the disruption-type radio.
- **AC-4.2** — Given there is no automated eligibility check in this build, then the tree does not block the agent's progress on it — the alert is instructional only.
- **Notes / open items:** Automating this depends on the date-of-issuance field ETG owes via Ravindra (Call Review 2026-08-04, They owe Brent #7) — see Q3, non-blocking for this build since the manual interim ships regardless.

### R5 — Disruption type & delay-reason capture · **Must**
- **Source:** `VI - demo` node 32 formfields, reference material.
- **Requirement:** The tree presents a required radio, "Select disruption type," with exactly three options — "Schedule change within the Operational Window," "Schedule change outside the Operational Window," "Trip delay within the Operational Window" — and a conditional radio, "What caused delay:" (Baggage delay or loss / Customs or immigration processes / Last minute flight delay), that renders only when `disruption_type` is the trip-delay value actually offered.
- **AC-5.1** — Given the agent selects "Trip delay within the Operational Window," when the screen re-renders, then the `delay_reason` radio becomes visible. (This fixes demo defect #1 in §3 — the demo's conditional could never fire because it tested for `"Trip delay"` rather than the real option value.)
- **AC-5.2** — Given the agent selects either schedule-change option, then `delay_reason` stays hidden and is not required for submission.
- **AC-5.3** — Given `delay_reason` is visible, then Continue is blocked until it is answered.

### R6 — Operational-window routing · **Must**
- **Source:** `VI - demo` node 33 router logic, reference material.
- **Requirement:** After the disruption-type screen, a router evaluates `disruption_type`: "Schedule change outside the Operational Window" routes to the Outside-the-Operational-Window ladder (R7); "Schedule change within the Operational Window" **or** "Trip delay within the Operational Window" routes to the Within-the-Operational-Window ladder (R7). There is no branch that can dead-end.
- **AC-6.1** — Given `disruption_type` = "Schedule change outside the Operational Window," then the agent reaches the Outside ladder.
- **AC-6.2** — Given `disruption_type` is either within-window value, then the agent reaches the Within ladder.
- **AC-6.3** — Given the router's logic, when `disruption_type` is read, then the comparison is made once against a script-set boolean/variable, not repeated as raw string literals across multiple buttons. (Fixes demo defect #2's house-rule violation — routers test script-set booleans.)
- **AC-6.4** — Given the radio is required and its option set is fixed to the three values in R5, then no runtime value can reach an unhandled branch; if the platform still requires a default case, that default routes to a real screen (the Outside ladder, as the more conservative path), never to a missing node ID. (Fixes demo defect #2's dead `button_link: "0"`.)

### R7 — Alternative ladder (alternative flight → new ticket sell → cancellation → last resort) · **Must**
- **Source:** `VI - demo` nodes 34, 36, 37, 38, 39, 40 — Action/Note/Alert copy quoted verbatim below, reference material.
- **Requirement:** Both operational-window branches walk the same underlying ladder — alternative flight, then new ticket sell, then cancellation, then last resort — with accommodation/overnight-stay variants at the first two steps, and the Within-window branch additionally requires the Rebooking Pass at its new-ticket-sell step.
  - **Outside-the-Operational-Window ladder:**
    - *Alternative flight screen* — **Action:** "Find a valid flight alternative for the flight directly or indirectly affected by the SC within the same-day VI connection that complies with minimum connection time requirements, without impacting other flights in the itinerary." Buttons: "Alternative flight available" and "Alternative flight requiring accomodation available" both proceed to action/type selection (R8); "Alternative flight is not available" advances to the new-ticket-sell screen.
    - *New ticket sell screen* — **Action:** "Book new tickets with the same or a different airline for directly or indirectly affected PNR(s) and accept the proposed alternative by the airline on the directly affected PNR by SC within VI orders if available." **Note:** "New ticket sell for directly or indirectly affected PNR(s) by SC, with Overnight Stay and Hotel accommodation compensation comes as the next option." Buttons: "New ticket sell available" and "New ticket sell requiring accomodation available" both proceed to R8; "No new ticket sell option" advances to cancellation.
    - *Cancellation screen* — **Action:** "Refund of the rest flights remaining on the bound." **Alert** ("Refund all the rest of the flights in the order"): "This is only applicable if the entire order is a VI or the remaining flights are within the VI part of the trip." Buttons: "Refund offer" proceeds to R8; "Last resort" advances to the last-resort step.
    - *Last resort step* — terminal escalation; the demo's node has no content beyond its title. The VI tree fills this with real escalation copy/routing **[inferred]** — flagged for Brent's or Olga's review since the demo provides nothing to quote here.
  - **Within-the-Operational-Window ladder:**
    - *Alternative flight screen* — same Action copy as the Outside ladder's opening screen. Buttons: "Alternative flight available" proceeds to R8; "Alternative flight is not available" advances to the 24h new-ticket-sell screen.
    - *24h New ticket sell screen* — same Action copy as the Outside ladder's new-ticket-sell screen. **Alert:** "If the flight disruption is within the Operational Window (24 hours before the start of the first segment), New Ticket Sell needs to be done using the Rebooking Pass. Follow the guidelines as described in VI Rebooking Pass - Shelf Pages." **Note:** same as the Outside ladder's new-ticket-sell note. Buttons: "New ticket rebooking pass" and "New ticket sell requiring accomodation Rebooking pass available" both proceed to R8; "No new ticket sell option" advances to the **same** cancellation screen as the Outside ladder (the demo shares this node between both branches).
- **AC-7.1** — Given the Outside ladder, when each screen renders, then its Action/Note/Alert copy matches the text quoted above verbatim.
- **AC-7.2** — Given the Within ladder, when each screen renders, then its Action/Note/Alert copy matches the text quoted above verbatim, including the Rebooking Pass alert at the new-ticket-sell step.
- **AC-7.3** — Given either ladder's "no [option] available" button, then the agent advances to the next rung, never back to a previous one and never to a dead end.
- **AC-7.4** — Given both ladders' cancellation step, then it is the same screen/logic for both branches (shared, not duplicated).
- **Notes / open items:** The Last-Resort step's actual content is not specified anywhere in the source material — see Q4 area of Assumptions/A2 below; this is the one screen in the ladder that needs real copy before build, not just a port.

### R8 — Mixed-action VI orders resolve to one type + one action + one child ticket · **Must**
- **Source:** No verbatim quote — Christina Zamenopoulou's rebook/cancel scenario is described, not quoted, in Call Review 2026-08-04's Decisions made ("child-ticket-creation logic for mixed-action cases (e.g., rebook one PNR + cancel another in the same VI order) was discussed with Christina but not conclusively resolved") and Unclear #4. Resolved into an agreed requirement by **Brent direct, 2026-08-05** — Christina is on leave from 8/5, so this is explicitly Brent's call in her absence.
- **Requirement:** All PNRs the agent selects on one VI order share exactly one type and one action, producing exactly one child ticket (or one silent ticket, if the resolved bucket is not Proceed). If a PNR within the order genuinely needs a different action from the rest, the agent completes the current flow for the order as one type+action, then uses the existing additional-request branch (the parent tree's Finish/Register-an-additional-request pattern) to register the differing action as a separate pass on the same ticket. There is no per-PNR action override inside the VI flow itself.
- **AC-8.1** — Given Christina's scenario — rebook PNR 1 and cancel PNR 2 in the same VI order — when the agent completes the VI flow, then exactly one type+action is captured for the whole order and exactly one child (or silent) ticket is created; the agent registers the second action via "Register an additional request," not a per-PNR selector on the VI screen.
- **AC-8.2** — Given a VI order with N selected PNRs and one resolved action, then no control on the VI flow's screens lets the agent assign a different action to a subset of the N PNRs.
- **AC-8.3** — Given the agent uses the additional-request path for the differing action, then it behaves per the parent tree's R17 (full loop/cursor reset before re-entering intake) — no PNR, type, or action carries over from the first pass.
- **Notes / open items:** This decision resolves the 8/4 call's tentative lean ("take the single-PNR logic as a tentative simplification with additional-request as the fallback" — Unclear #4) into an agreed Must, confirmed by Brent 2026-08-05 while Christina is on leave. Flag for her review when she returns, in case she'd have pushed back.

### R9 — Booking.com / non-booking.com interim routing selector · **Should**
- **Source:** "there is one additional need we need to have different information for booking.com and for non-booking.com… it could be an API logic like if it's booking.com go here. If it's not booking.com, go there." — Olga Gerothanasi, Spiky "Flow test results" 2026-07-27, quoted in `register-errands-dynamic-requirements.md` CR-005. Carried into this build per **Brent direct, 2026-08-05** (D4).
- **Requirement:** The first VI screen after PNR selection presents a manual native select with two options, "booking.com" and "other," that sets the same routing variable the Admin API's `partner` field will populate once available (e.g. `partner_routing`). This mirrors the parent doc's Assumption A1 interim-selector pattern.
- **AC-9.1** — Given the agent picks "booking.com," when downstream VI logic reads the routing variable, then it reads "booking.com" — the same variable name and shape a future automated read of the API `partner` field would populate.
- **AC-9.2** — Given the Admin API `partner` field becomes available, then swapping the manual select for an automated read is a one-line change — no downstream logic reads the raw select value directly; everything reads the routing variable.
- **Notes / open items:** The Admin API `partner` field (booking.com vs. non-booking/APG) and date-of-issuance data are owed by Ravindra/ETG dev team (Call Review 2026-08-04, They owe Brent #7, via Olga). Non-blocking for this build — the interim selector ships regardless of when that field lands. See Q3.
  **Update, 2026-08-05 — Q3 now ANSWERED, R9's build shape unchanged:** The `partner` and `orderCreated` fields are confirmed available now, via the same Edvin v1 `findOrder` endpoint this tree already calls for Find Order — **Ravindu Roshan Liyanagamage (ETG), Slack `#zingtee-etg-squad`, 2026-07-30 02:28 MDT:** *"As I can see the 'partner' and the 'orderCreated' fields are already available in the v1 findorder endpoint in Edvin API."* (`https://edvin-api.etraveli.com/edvinapi/docs/v1/index.html#operation/findOrder`). The premise behind this interim selector — that ETG owed the field — was false as of that date.
  This does **not** change what ships this round. Brent's D4 decision (interim manual native select, wired so the swap to an API read is one line, per AC-9.2) still stands as the build shape, precisely because it was designed for this swap. Re-pointing R9 to read the Edvin fields directly is pending Brent's decision plus two gaps — see **Q5, Q6, Q7** in §9.
  Olga Gerothanasi separately stated a partner × order-created-date routing rule, as her stated intent for tree `269789227` (not this doc's fork target — see Q5) — **Olga Gerothanasi, 2026-07-30 07:57:31 MDT:** *"Workflow ID:269789227 this is the tree I'm working on and the information on partner/created date is needed in node 48/49 where Booking/ETG prior 21May2026 will go to Node 50; Booking after 22May2026 will go again to Node 50; ETG after 22May26 will go to node 66."* Tabulated:

  | Partner | Order created date | Destination (tree 269789227, nodes 48/49 → …) |
  | :---- | :---- | :---- |
  | Booking.com or ETG | prior to 21 May 2026 | Node 50 |
  | Booking.com | after 22 May 2026 | Node 50 |
  | ETG | after 22 May 2026 | Node 66 |

  This is recorded as ETG's stated intent only. The node numbers (48/49, 50, 66) belong to tree `269789227` and must **not** be ported literally into the VI tree — they are evidence of intent, not build targets. See Q6 for the uncovered 21–22 May boundary.

### R10 — Errand registration follows the parent tree's existing per-PNR pattern, unchanged · **Must**
- **Source:** **Brent direct, 2026-08-05:** *"register errand should work as it does in the existing register errand workflow."* This reverses the initial version of this doc's D3 reading, which had elevated Karolina Zetterberg's 2026-07-09 "one errand tagged to multiple PNRs" ask ("when multiple PNRs share the same outcome, ETG may want one errand tagged to multiple PNRs rather than duplicate errands" — per `Account Management HQ/ETG (Etraveli)/MEMORY.md`, 2026-07-09 Collaboration Hour note) into a VI-specific requirement.
- **Requirement:** The VI tree does **not** diverge from the parent tree's R7 ("every PNR will have an errand registered in Edvin," one per PNR). When the VI flow completes registration, the tree uses the parent tree's existing errand-per-PNR loop (node 44 → 17 → 43 → 45), unchanged, registering one Edvin errand per selected PNR, each carrying the order's single shared type+action (per R8). This is the previous version's AC-10.2 fallback — now the agreed shape, not a fallback.
- **AC-10.1** — Given a VI order with N selected PNRs and one resolved type+action (per R8), when the register-errand step fires, then Edvin holds exactly N errand records — one per PNR — each carrying the same type+action.
- **AC-10.2** — Given the parent tree's node 44→17→43→45 loop is ported into the VI tree unchanged, when it is diffed against the v35 fork point (per R1/AC-1.1), then its idempotency guards (attempted/registered-key tracking) are present and unmodified.
- **Regression risk** — Re-run the parent tree's AC-7.1 (loop exits cleanly) and confirm the internal note enumerates every registered errand correctly.
- **Notes / open items:** Karolina Zetterberg's 2026-07-09 "one errand tagged to multiple PNRs" ask is **not implemented in this round**. Per Brent direct, 2026-08-05, it is recorded as a noted future consideration for ETG, not a requirement — if ETG wants it revisited, that would be a future CR against this doc. Q1 (whether Edvin's `registerErrand` can accept a single multi-PNR errand) is answered/moot for this build's purposes, since the shape actually shipping doesn't need that capability — see §9.

### R11 — Ticket creation follows the order's single type+action, no per-pair grouping · **Must** **[inferred]**
- **Source:** **[inferred]** — a direct consequence of R8's one-type-one-action-per-order rule; not separately stated by ETG on the 8/4 call.
- **Requirement:** Because R8 forces exactly one type+action for the whole VI order, the VI tree's ticket-creation step does not need the parent tree's distinct-(type+action) grouping logic (CR-009/CR-012's per-pair silent-ticket rule, since there is only ever one pair per order). A VI order produces exactly one child ticket if the resolved bucket is Proceed, or exactly one silent ticket otherwise — titled with all selected PNRs — with grandchildren created per the alternative ladder's outcome (R7) against that one child ticket's side conversation, following the parent tree's grandchild pattern (parent R5, nodes 32–41 equivalent).
- **AC-11.1** — Given a VI order resolves to bucket Proceed, then exactly one child ticket is created, titled with all selected PNRs.
- **AC-11.2** — Given a VI order resolves to any non-Proceed bucket, then exactly one silent ticket is created, titled with all selected PNRs, with no grandchildren.
- **AC-11.3** — Given the alternative ladder (R7) reaches a step requiring a follow-up task (e.g., new ticket sell, accommodation), then a grandchild ticket is created against the child ticket's side conversation, per the parent tree's pattern.
- **Notes / open items:** **[inferred]** — this is Mira's reading of what R8 implies for ticket creation, not a separately confirmed ETG ask. Flag for Brent's sign-off at build review; non-blocking (mirrors the parent doc's A4 pattern of flagging an inferred build-shape decision rather than blocking on it).

## 5. Data contract

*The VI tree does not exist yet — every row below is proposed naming for the fork, not yet observed in a built tree. Names are chosen to match the parent tree's existing conventions wherever a parent variable is being reused or extended.*

| Name | Type | Set where | Read where | Default / fallback |
| :---- | :---- | :---- | :---- | :---- |
| `transforms.selected_pnrs` | array (multi-select, whole order) | PNR-selection screen (R2) | every downstream VI screen | `[]` |
| `partner_routing` | string `"booking.com"` \| `"other"` | interim manual select (R9) | VI booking.com/non-booking.com branch logic | — (required) |
| `disruption_type` | string, one of the three R5 options | disruption-type radio | operational-window router (R6) | — (required) |
| `delay_reason` | string, one of the three R5 sub-options | conditional radio, R5 | internal note / errand message | `""` (hidden when not applicable) |
| `transforms.vi_type`, `transforms.vi_actions_array` | Edvin config object / array | GET Edvin Errands, VI category (R3) | type dropdown, action selection | — |
| `vi_resolved_type`, `vi_resolved_action` | string (form data) | end of the ladder + action selection (R8) | ticket creation (R11), errand registration (R10) | — (required before ticket creation) |
| `transforms.vi_final_pnrs` | array, all selected PNRs carrying the order's single type+action | R8/R11 | R10 (register-errand step) | `[]` |

House rules apply (`Zingtree Builder/MEMORY.md`): scalars → `ZT.setFormData`; objects/arrays/HTML strings → `ZT.setTransformData`; every read via `ZT.getVariableValue("name", default)`. Transforms expire after 1 hour, matching the parent tree.

## 6. Integrations

| System | Alias | Direction | Trigger | Failure behavior |
| :---- | :---- | :---- | :---- | :---- |
| Edvin — Find Order | (parent tree's node 4 pattern) | out | tree load | Not specified — inherits the parent tree's open gap (parent doc Q6) |
| Edvin — GET Errands (VI category config) | (parent tree's node 42/46 pattern) | out | after PNR + booking.com selection | Not specified — same gap |
| Edvin — Register Errand | (parent tree's node 44→17→43→45 per-PNR loop, per R10) | out | after R8 resolves | Inherits parent guard behavior (per R1/AC-1.1); error/timeout behavior not yet separately specified for the VI tree |
| Zendesk — Create Child Ticket / Create Silent Ticket | (parent tree's node 33 pattern) | out | after R8/R11 resolve | Inherits parent guard behavior (attempt-recorded-before-call, per parent CR-011) |
| Zendesk — Create Grandchild Ticket | (parent tree's node 37 pattern) | out | ladder steps requiring follow-up (R7/R11) | Inherits parent pattern |
| Zendesk — Add Internal Note | (parent tree's node 22 pattern) | out | after ticket creation | Inherits parent pattern |

## 7. Edge cases & failure modes

- **Zero PNRs selected on the Find Order grid** → Continue should not be reachable; mirrors the parent tree's implicit requirement that PNR selection is non-empty before proceeding. Not separately specified by ETG — **[inferred]**.
- **Agent skips or misreads the STG eligibility alert (R4)** → no system-side check exists this round; the tree cannot detect or prevent this. Recorded as a known limitation, not a defect to fix here.
- **Disruption type at the Trip-delay/Operational-Window boundary** → the three options are mutually exclusive by construction (single radio); no ambiguous state is possible if R5/R6 are built as specified.
- **Mixed-action order (R8's core edge case)** → handled by the additional-request branch; see AC-8.1–AC-8.3.
- **~~Edvin `registerErrand` rejects a multi-PNR payload~~** — moot as of 2026-08-05: R10 no longer attempts a multi-PNR errand; it uses the parent tree's per-PNR loop outright (see R10, §9 Q1).
- **Edvin API error/timeout mid-flow** → not specified by ETG for this tree, same open gap the parent doc carries (its Q6). **[inferred gap]**.
- **Agent navigates backward mid-flow (Back button)** → the VI tree must be replay-safe under Back+Continue exactly like the parent tree post-CR-011 (attempted-key guards recorded before the create call fires, not after a confirmed response). This is inherited by R1's fork requirement, not a new build item.
- **Session resumed after the 1-hour transform expiry** → inherits the parent tree's unspecified behavior; **[inferred gap]**.

## 8. Non-functional & compliance

- **PII:** Same profile as the parent tree — passenger names, PNRs, and order data from Edvin, written into Zendesk tickets and internal notes. No new storage introduced.
- **Environments:** Built and tested against the same environment the parent tree currently uses (production, org 113/116 per the base export) — no separate VI sandbox has been set up. Sandbox testing for VI is subject to the same account-wide sandbox stand-up work tracked in the parent doc.
  **Sandbox persistence — Katya (ETG), Slack `#zingtee-etg-squad`, 2026-08-05 03:22 MDT:** the external Edvin test server's DB snapshot is rebuilt nightly, so changes made there do not persist beyond a day; to persist, changes must be made in PROD.
  **Brent, same channel, 2026-08-05 09:36 and 11:19 MDT:** confirmed he has migrated the sandbox Zendesk instance to the sandbox Edvin instance and "everything is working as before."
- **Timeline constraint:** Christina Zamenopoulou is on leave starting 2026-08-05 (today); Olga Gerothanasi's last working day is Friday 2026-08-14 (she is on leave from 8/17); Brent is out 2026-08-17 through 2026-08-21. The parent tree's tentative go-live is 2026-08-17. Realistically: R1, R2, R3, R5, R6, R7, R9 (the fork, PNR-loop removal, ladder port, and the interim booking.com selector) depend only on Brent's build work against material already in hand and can be built and Stage-A verified before 8/14. R8 and **R10** are both already confirmed by Brent (8/5) and can ship in the same window — R10 no longer depends on Olga's confirmation of Edvin's `registerErrand` behavior, since Q1 is answered/moot (§9) and the requirement now ships as the parent tree's existing per-PNR loop, not a conditional fallback.
- **Access control:** No new authorization changes introduced by this tree.

## 9. Open questions

| # | Question | Blocking? | Asked of | Answer / date |
| :---- | :---- | :---- | :---- | :---- |
| Q1 | Does Edvin's `registerErrand` accept a single errand record naming multiple PNRs (R10)? | **ANSWERED — moot for this build** | Brent direct | **2026-08-05:** *"register errand should work as it does in the existing register errand workflow."* R10 reverted to the parent tree's per-PNR pattern; this question no longer governs R10's shape. Karolina Zetterberg's 2026-07-09 multi-PNR-single-errand ask is not implemented this round — recorded as a future consideration only, not a requirement. |
| Q2 | Of the demo's 39-option VI type list (§3, R3 notes) — which entries actually belong under the VI category in Edvin, given the 4 duplicates and the three unrelated type-sets mixed together? | **ANSWERED — no requirement change** | Brent direct | **2026-08-05:** *"[VI type/action values] should come from an API request (edvin errand configuration). This currently exists in the edvin source workflow (v35)."* R3 already specifies this; the demo's 39-option list is reference-only and has no bearing on what the dropdown offers. |
| Q3 | When will the Admin API `partner` field (booking.com vs. non-booking) and date-of-issuance data land, so R9 and R4 can move from manual/interim to automated? | **ANSWERED by ETG — R9's build shape unchanged (see R9 notes)** | Ravindra / ETG dev team, via Olga Gerothanasi (Call Review 2026-08-04, They owe Brent #7) | **Ravindu Roshan Liyanagamage, 2026-07-30 02:28 MDT:** *"As I can see the 'partner' and the 'orderCreated' fields are already available in the v1 findorder endpoint in Edvin API."* Olga Gerothanasi followed with a routing rule for tree `269789227` (2026-07-30 07:57:31 MDT — see R9 notes and Q5/Q6). Brent replied "I will review shortly" (2026-07-30 07:59:46 MDT); Olga nudged 2026-07-30 14:55 MDT and again 2026-08-04 07:11 MDT ("reminder kindest"). Still unanswered by Brent as of 2026-08-05 — his decision on re-pointing R9 is pending Q5/Q6/Q7 below. |
| Q4 | Is R8's mixed-action resolution (Brent's 8/5 call, made in Christina's absence) something Christina would agree with when she returns from leave? | no — ships as agreed per Brent's 8/5 confirmation, flagged for her review | Christina Zamenopoulou (on leave from 8/5) | — |
| Q5 | Which tree is the real VI target: `VI - demo` 915692749 (the export Brent supplied, and the fork basis for this doc) or **269789227** (the tree Olga says she is working on for partner routing — see R9 notes)? If 269789227, this doc's fork plan (R1) must be re-pointed. | **BLOCKING** for automating R9 (not blocking for this round's manual-interim build, per R9 notes) | Olga Gerothanasi | — |
| Q6 | Olga's date rule (R9 notes) leaves the **21–22 May 2026 boundary uncovered** — she specified "prior 21May2026" and "after 22May2026" but nothing for 21–22 May itself. Which side do those dates fall on? | non-blocking for this round's manual-interim build; blocking before any automation of R9 ships | Olga Gerothanasi | — |
| Q7 | Is Edvin's `orderCreated` the same value as the STG check's "order date in site time" (demo node 32 alert copy, R4)? Timezone treatment may differ. | non-blocking for this round; prerequisite to automating R4 | Ravindu Roshan Liyanagamage / Olga Gerothanasi | — |

## 10. Assumptions

- **A1** — The interim booking.com/non-booking.com manual selector (R9) mirrors the parent doc's Assumption A1 (interim channel selector) and is removed once the Admin API `partner` field is confirmed available (affects R9; see Q3).
- **A2** — VI PNRs are always segments of one trip, never independent legs needing separate treatment — Olga's stated rationale for removing the loop (affects R2). If this assumption is ever wrong for some VI order shape, that's a CR, not a silent fix.
- **A3 — RESOLVED 2026-08-05, see R10 and §9 Q1.** Q1 is answered/moot: Brent confirmed R10 ships as the parent tree's per-PNR errand loop outright, not as a conditional fallback. The former AC-10.1 (one errand covering all PNRs) is dropped, not deferred.
- **A4** — R11's ticket-creation simplification is Mira's inference from R8, not a separately confirmed ETG ask — flagged for Brent's review at build time; non-blocking, following the same pattern as the parent doc's A4.
- **A5** — The alternative ladder's Last-Resort step (end of R7) needs real content before build; the demo supplies none. Flagged for Brent's or Olga's input at build time; non-blocking since it's a single terminal screen, not a routing dependency.
- **A6** — CBK (chargeback) flagging dependency, not a VI requirement: **Olga Gerothanasi asked Ravindu Roshan Liyanagamage** (Slack `#zingtee-etg-squad`, 2026-08-05 03:56 MDT) for a status update on flagging an order as CBK for the upcoming high-level flows, noting the logic already exists for live flows and that Christina Zamenopoulou had shared details with Elis. Zingtree's dependency, once that flag exists: the tree must override the selected contact reason to display the correct type/action. No ETG reply as of 2026-08-05. Cross-reference: `register-errands-dynamic-requirements.md` §3's static-chargeback-filter scope note.

## 11. Traceability

| Req | Edit(s) | Test(s) | Status |
| :---- | :---- | :---- | :---- |
| R1 | — | — | Not yet built |
| R2 | — | — | Not yet built |
| R3 | — | — | Not yet built |
| R4 | — | — | Not yet built |
| R5 | — | — | Not yet built |
| R6 | — | — | Not yet built |
| R7 | — | — | Not yet built |
| R8 | — | — | Not yet built |
| R9 | — | — | Not yet built |
| R10 | — | — | Not yet built — no longer blocked; Q1 answered/moot, per Brent direct 2026-08-05 (§9) |
| R11 | — | — | Not yet built |
| CR-002 → R6/AC-6.3 (compliance fix, no new requirement) | Nodes 52, 67 (button 0/1 `logic_expression` + `button_text`, parens added) | Real `eval()` replay of live `logic_expression` strings against 5 scenarios (2 bug-trigger, 3 normal-case) — all pass | **Built** in `Register Errands - VI Dynamic (v12 node52-67 precedence fix, 2026-08-25).json`, pending Brent's approval + Stage B + import. Pre-existing `display_order` drift on nodes 62-82 (unrelated to this fix) noted, not touched. |

## 12. Change requests (amendments)

### CR-001 — A combined errand must carry every PNR in its group · **Must** · raised 2026-08-21

- **Raised by:** Christina Zamenopoulou (ETG), confirmed by Brent Thomas — ETG Pre-Launch Check In, 2026-08-21 (Spiky `72859515-0f35-4e9c-80a4-fe0d7d2f61d2`). Reported against Zendesk sandbox ticket **337619**.
- **Amends:** R10. This is the future CR that R10's notes anticipated ("if ETG wants it revisited, that would be a future CR against this doc") for Karolina Zetterberg's 2026-07-09 "one errand tagged to multiple PNRs" ask. R10's per-PNR-errand shape is superseded for the grouped case only; the type+action grouping key in R8/R11 is **unchanged**.
- **Evidence:** Christina, on the errand free text in Edvin admin: *"I still get only for one PNR message in the errand"* … *"I see type, customer action, PNR only the first one, IFVLYF, passengers, channel, contact reason, order reference, Zendesk … I don't see the information for the other PNR."* Brent, same call: *"It should be one active child because it's type and action are the same"* (Christina) → *"Yes, so we should only register one errand as well"* (Brent); *"We're registering one errand against one child ticket with combined PNR logic. We need all of the combined PNR logic to be represented in the errand we display."*; *"Registering an errand needs all PNR data."*
- **Root cause:** node 27 built the Edvin list as `groupByErrand(bucket_stitch).map(group => group[0])`. The grouping was correct; taking `group[0]` discarded every PNR after the first. The child-ticket title was built separately with `joinPnrs(...)`, which is why the Zendesk note showed both PNRs while the errand showed one.

**Requirement (R10.1):** When two or more selected PNRs resolve to the **same (type + customer action) pair**, the single Edvin errand registered for that pair must carry the data of **every** PNR in the group — not a representative PNR.

- **AC-10.1.1** — Given N PNRs resolving to one (type + action) pair, when the errand is registered, then its `pnr` field lists all N PNR codes and its booking-id field carries all N provider booking ids as integers.
- **AC-10.1.2** — Given those N PNRs each carry agent notes, when the errand free text is built, then it contains one `PNR <code>: <notes>` line per PNR.
- **AC-10.1.3** — Given those N PNRs, when the errand free text is built, then its `Passengers` value lists the de-duplicated passenger names across all N PNRs.
- **AC-10.1.4** — Given PNRs that resolve to **different** (type + action) pairs, when errands are registered, then the count of errands, child tickets, silent tickets and grandchild tickets is **unchanged** from R8/R11 — this CR changes the contents of an errand, never how many exist.
- **AC-10.1.5** — Given the change ships inside the VI tree, when the parent tree `Register Errands - Dynamic (595124299)` is diffed, then it is unmodified.

- **Decisions taken (Brent direct, 2026-08-21):**
  - **Errand key stays type + action.** The grouping rule and the whole regression matrix are unchanged. Two PNRs sharing a Type but differing in Customer Action remain two errands. (Raised because the reproduction Brent pasted had `Sent to ticketing` / `Sent to support` on the two PNRs, which correctly produced 2 errands and 2 grandchildren, alongside a stated expectation of one errand. Confirmed: the tree's behaviour there was right; only the per-errand data was wrong.)
  - **Minimal surgical scope.** Node 27 only. The pre-v40 defects the VI tree still carries — no unresolved-selection guard, bucket resolved by label in node 2, node 12's `<style>` block, `keep_vars_on_back = 0` — are knowingly left in place this round and remain open items.

- **Regression risk** — Node 27 is the node the errand grouping contract keeps breaking. Re-run the `etg-errand-regression` harness before this is called done. Ticket counts must not move.
- **Implemented in:** `Register Errands - VI Dynamic (v7 combined-PNR errand data 2026-08-21).json` — Stage A passed (11/11 static, 9/9 replay scenarios); report at `Workflow JSONs/ETG/vi-v7-combined-pnr-errand-data-2026-08-21.md`. Stage B (sandbox UI) not yet run.

### CR-002 — Nodes 52/67 violate R6/AC-6.3: raw compound logic expressions can misroute Trip Delay / Accommodation-Meal cases
| | |
| :---- | :---- |
| **Date agreed** | 2026-08-25 |
| **Requested by** | Brent ("also fix the VI issues," following the pre-launch risk review) |
| **Source** | Root cause diagnosed by Dudley against `Register Errands - VI Dynamic (v11 conditional-required correction, 2026-08-24).json`, nodes 52 and 67 — confirmed by executing the tree's literal `logic_expression` strings via a real JS `eval()`, not by inspection alone. Same defect independently confirmed present in the on-disk `Register Errands - VI Dynamic (PRODUCTION, 2026-08-24).json` (35 nodes) and v10 (36 nodes) — predates v11 and is unrelated to the conditional/required-flag correction v11 shipped. |
| **Type** | Bug / defect — code deviates from an already-agreed requirement (R6/AC-6.3) |
| **Status** | Agreed — ready for build |

**The ask (verbatim)**
> Brent, in session, 2026-08-25: "yes. Also fix the VI issues" — following a pre-launch risk review ahead of 2,500 agents going live 2026-08-26, which surfaced this against the VI sub-tree.

**Interpretation**

R6/AC-6.3 already requires exactly the discipline this bug violates: *"the comparison is made once against a script-set boolean/variable, not repeated as raw string literals across multiple buttons"* — written specifically to fix the same class of defect in the original demo tree (demo defect #2). As built, nodes 52 ("Bcom OR ETG & prior 21May26" branch) and 67 ("ETG & post 22May2026" branch) route on raw compound string-literal expressions instead, and the first two buttons on each are missing parentheses:

```
disruption_type == "Schedule change within 24 hour window" && flight_affected == "Directly affected flight" || flight_affected == "Indirectly affected flight"
```

JS evaluates `&&` before `||`, so this parses as `(disruption_type == "..." && flight_affected == "Directly...") || (flight_affected == "Indirectly...")` — the second clause is not gated by `disruption_type` at all, which is exactly the failure mode AC-6.3 exists to prevent. Confirmed by running the literal expression through `eval()` with representative inputs:

| disruption_type | flight_affected | node 67 routes to (actual) | should route to |
| :---- | :---- | :---- | :---- |
| Trip delay | Indirectly affected flight | 69 (Schedule Change screen) | 73 (Trip Delay screen) |
| Accomodation compensation | Indirectly affected flight | 69 (Schedule Change screen) | 80 (skip to errand config) |
| Trip delay | *(blank)* | 73 (correct) | 73 |

`flight_affected`'s own field config shows it is conditionally displayed only when `disruption_type` contains "Schedule," and is not required. In a single-PNR session it's therefore likely blank for Trip Delay / Accommodation / Meal cases and the bug is dormant — but nothing in the tree clears it between PNRs on the same ticket, so a value an agent picked for an earlier Schedule-Change PNR can persist and silently misroute a later Trip-Delay or Accommodation/Meal PNR later in the same session.

Node 79 ("Return Parent") hands this tree's output into the parent `Register Errands - Dynamic` tree's own node 3/44 pipeline — so this defect is independent of, and does not overlap with, CR-015 in the parent doc (the ticket-creation/errand-registration crash paths). Both are part of the same 2026-08-25 pre-launch review; noting the cross-reference so they aren't mistaken for the same fix.

**Effect on the existing spec**
- Supersedes: none.
- Amends: none. R6/AC-6.3 already specifies the correct behavior; this CR does not change requirement text — it brings nodes 52/67 into compliance with an acceptance criterion already on the books.
- Adds: none.

**Fix (mechanical)** — Add parentheses to disambiguate both affected buttons on both nodes:
`(disruption_type == "..." && flight_affected == "Directly affected flight") || (disruption_type == "..." && flight_affected == "Indirectly affected flight")`.
Per AC-6.3's actual requirement, the more durable fix is to stop comparing raw string literals across buttons at all and instead have a script node set a single boolean/variable once, with the Scoring node testing that — the same pattern R6 already mandates for the within/outside-window split. Recommend the factory pick whichever shape keeps the smallest diff against a tree going live tomorrow; the parens fix alone is sufficient to close the defect.

**Open questions** — None blocking.

**Regression risk** — Nodes 52 and 67 only. Re-run the existing `vi-v7-harness.mjs` / `vi-v7-stageA.mjs` scenarios (routing paths A–H) plus new cases specifically exercising a stale `flight_affected` value carried into a Trip Delay / Accommodation / Meal PNR, to confirm the fix actually closes the gap rather than just changing which screen a directly-tested case reaches.

---

<!-- CRs get appended below using templates/change-request.md -->

## 13. Document change log

| Date | Change | By |
| :---- | :---- | :---- |
| 2026-08-05 | Created — new build requirements doc for the VI (Virtual Interlining) tree, per the 2026-08-04 call's decision to give VI its own tree with the PNR loop removed. R1–R11 added. R10 (one errand per VI order) carries a BLOCKING open question (Q1) with a specified fallback (AC-10.2), so the rest of the tree is ready for build while that one requirement resolves. Cross-referenced against `register-errands-dynamic-requirements.md` CR-005/R13 — that doc's open question on separate-tree-vs-same-tree is now marked resolved with a pointer back to this doc. | Mira (requirements role) |
| 2026-08-21 | **CR-001 raised and implemented.** A combined errand must carry every PNR in its group (R10.1, AC-10.1.1–10.1.5), amending R10 — the multi-PNR-single-errand shape deferred on 2026-08-05 is now required, for the grouped case only. Root cause: node 27's `map(group => group[0])` discarded every PNR after the first. Raised by Christina Zamenopoulou on ticket 337619 and confirmed by Brent on the 2026-08-21 ETG Pre-Launch Check In. Two decisions recorded from Brent direct: errand key stays type + action (grouping and ticket counts unchanged), and scope is the minimal node-27 fix (the VI tree's four pre-v40 defects stay open). Built as VI Dynamic v7; Stage A passed, Stage B outstanding. | Mira (requirements role) |
| 2026-08-05 | **Amended in place (same day, no CR — doc had not yet reached a settled Ready-for-build state).** Q1 answered (Brent direct): R10 retitled and rewritten — the multi-PNR-single-errand shape (former AC-10.1) is dropped; the parent tree's per-PNR errand loop ships outright, not as a fallback; BLOCKED flag removed; §3 scope bullet and §10 A3 updated to match. Karolina Zetterberg's 2026-07-09 multi-PNR-errand ask recorded as a noted future consideration, not implemented this round. Q2 answered (Brent direct): closes with no requirement change; R3 notes updated to make the demo's 39-option list explicitly non-authoritative. Q3 answered by ETG (Ravindu Roshan Liyanagamage, 2026-07-30, via Slack `#zingtee-etg-squad`): the `partner`/`orderCreated` Edvin fields are available now; R9's D4 build shape is unchanged this round; three new open questions raised (Q5 tree target, Q6 date-boundary gap, Q7 timezone parity with R4) and Olga's stated partner×date routing rule for tree 269789227 recorded in R9's notes as intent only, not a build target. Two context items recorded: §8 sandbox-persistence note (Katya, ETG, 2026-08-05) plus Brent's sandbox-migration confirmation; §10 new Assumption A6 for the CBK-flagging dependency (cross-referenced to the parent doc). §9, §11 (R10 row), and header Status/Last-amended/Sources updated accordingly. Status set to plain **Ready for build** — zero blocking questions remain. | Mira (requirements role) |
| 2026-08-25 | CR-002 added — pre-launch risk review (2,500 agents live 2026-08-26) found nodes 52/67 use raw compound string-literal logic expressions missing parentheses, violating R6/AC-6.3 (which already mandates a script-set boolean instead, specifically to prevent this). `disruption_type == X && flight_affected == Y || flight_affected == Z` parses as `(X && Y) || Z` in JS, so a Trip Delay or Accommodation/Meal case with a stale `flight_affected == "Indirectly affected flight"` (carried over from an earlier Schedule-Change PNR in the same session) gets silently routed into the Schedule-Change alternative screens. Confirmed via real `eval()` of the tree's literal expressions, not inspection. Predates v11 — same defect present in v10 and the on-disk `PRODUCTION, 2026-08-24` export. No requirement text changed; fix brings the implementation into compliance with AC-6.3. Ready to build. | Mira (requirements role) |
