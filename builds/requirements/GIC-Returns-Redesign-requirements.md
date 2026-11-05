# Requirements — GIC (Global Industrial) Returns Redesign (SFDC)

**Account:** GIC (Global Industrial)
**Workflow:** Returns Redesign, multi-tree (5 trees), export `Selected_from_Global UAT_2026-07-27.json`
**Owner:** Brent Thomas
**Created:** 2026-07-27

## Tree inventory (as exported 2026-07-27)

| Tree | ID | Root | Nodes |
|---|---|---|---|
| Zingtree Redesign - Returns (hub) | 857069947 | 2 | 8 |
| Zingtree Redesign - Returnable Bucket | 831637528 | 16 | 22 |
| Zingtree Redesign - Approval Process (Non-Returnable) | 268661429 | 27 | 28 |
| Zingtree Redesign - Not Shipped Bucket | 731150281 | 12 | 7 |
| Zingtree Redesign - Add Order Line Items (subroutine) | 816966811 | 7 | 6 |

**Gap:** none of the five trees carries a `claude.md` memory node (house rule). To be created as part of CR-001.

---

## CR-001 — Send vendor communication emails from Zingtree instead of Salesforce

**Source:** Spiky call "Global Industrial x Zingtree: Working session," 2026-07-27 3:30pm ET / 19:30 UTC
(meeting id `7e774102-bb20-4e53-b992-2c9c639c1a28`). Attendees: Brent Thomas, Marcus Torres (Zingtree);
Tammy Scher, Vamshi Rajarapu, Arun Nagarajan, Pankaj (GIC).

### What changed on this call

The approach flipped. Brent went in expecting to **call a Salesforce API that triggers the email**.
Vamshi confirmed no such API exists: *"There is no such API readily available"* — the vendor
communication screen is built entirely inside Salesforce (no PCS involvement), and it prepares the
template and sends the email from Salesforce itself.

Arun reframed it and the team landed here, in Arun's words: *"the basic ask is, we might have to
create a page similar to this."* Brent's confirmation of the final approach: *"as long as we're
confirming that we're not sending an API request to trigger the email, we're just gonna send the
email from Zingtree and copy the functionality and the data that's being sent from here."*

**Decision: Zingtree recreates the vendor communication screen and sends the email itself.**
It is a lift-and-shift of Salesforce's screen and its dynamic-text logic, not an API trigger.

### Functional requirements

| # | Requirement | Source |
|---|---|---|
| R1 | Agent initiates vendor communication (RMA requests and approvals) from inside Zingtree — no screen swap to Salesforce. | Brent, opening framing |
| R2 | The email is **sent from Zingtree**, not triggered via a Salesforce API. | Brent + Vamshi, confirmed |
| R3 | A Salesforce-generated **thread ID must be embedded in the email** so vendor replies attach to the existing case instead of creating a new one. Arun: *"that was a big issue when we launched this."* | Arun; Vamshi |
| R4 | The thread ID is obtained by an **API call to Salesforce immediately before sending**. Vamshi: *"you can create your own thread ID, but you have to create it by making an API call to Salesforce."* | Vamshi |
| R5 | After sending, the email must be **attached to the Salesforce case** so it appears in the case feed / history. | Arun; Brent |
| R6 | Recipient is a **dropdown the agent selects from** — it must NOT auto-select. Vendor contacts span multiple tables and the customer-service/main-contact fields are not consistent across account keys. Tammy: *"we can't just say when we create it, it's automatically going to go to the contact listed as customer service or main contact."* Arun confirmed the same logic applies. | Tammy; Arun |
| R7 | Recipient options are pulled from the **vendor contact object**, linked off dropship. Vamshi: *"Dropship has a vendor contact link to it… you can pull that from the vendor contact object to display all the recipient list."* | Vamshi |
| R8 | Everything other than the recipient can be **auto-generated**. Tammy: *"all the rest of the stuff can be automatically generated."* | Tammy |
| R9 | Templates are queried from Salesforce rather than duplicated in Zingtree, to keep one source of truth. Arun on duplication: *"it's one stop shop… they can maintain it, but it's a duplication."* | Arun |
| R10 | Template **selection may be skipped** — Zingtree knows the trigger condition. Arun: *"if you're triggering it from Zingtree, you know the condition when are you going to trigger. There is no point of even selecting a template."* Preselect by condition, allow override. | Arun |
| R11 | Line-item detail is **pulled from the case**, not entered by the agent — the case already records what is being returned. Arun: *"they have already decided that how many items are getting returned. So they don't need to enter it there. They just need to pull it from the case itself."* | Arun |
| R12 | The dynamic body text logic currently lives in Salesforce code and must be **replicated in Zingtree**. Vamshi: *"Not all information is in our email template for you to populate it… the information will be populated from the logic that is written in Salesforce dynamically."* | Vamshi |

### Template counts (per Tammy + Arun on the call)

- Returns: **1** template ("return request"). Arun initially said three; Tammy corrected — *"there's only one return, but there's four for cancels."*
- Cancellations: **4** templates.

### BLOCKING dependencies — not yet delivered

Both are owed by **Vamshi Rajarapu** and were committed on the call; neither has arrived.

| # | Dependency | Quote |
|---|---|---|
| D1 | API + method to **generate a Salesforce thread ID** and pass it so Salesforce accepts it | *"I can give you that API to create a thread ID"* / *"I will tell you how to generate this thread ID and pass it so can accept it"* |
| D2 | API + method to **query the email template list** from Salesforce via the connector | *"I can give you that API to query the template"* / *"Templates, I can provide you the list of templates and how can you pull it from the query from your connector"* |

Vamshi: *"I will just share that details with you."* Marcus closed the call on it: *"we'll look
forward to hearing back as far as when you two can deliver that to Brent."*

**Impact:** R3/R4 (thread ID) and R9 (template query) cannot be completed until D1 and D2 land.
Without the thread ID, vendor replies spawn new cases — the exact defect Arun flagged from their
own launch. The screen, recipient dropdown, body generation, send, and case attachment can all be
built ahead of D1/D2 behind placeholder CX Actions.

### Vendor communication spots in the current workflow

| Spot | Node | Today | In scope |
|---|---|---|---|
| Non-stock RMA request to vendor | Returnable Bucket **#21 "Vendor Communications"** (Content) | Manual step list: Document Center Tab → Vendor Communication → Drop Ship PO URL → request Return Authorization for case → set Awaiting Status = Awaiting Information / Awaiting Reason = Vendor → post next steps in feed | **Yes — primary** |
| Non-stock vendor approval request | Approval Process **#9 "Non-Stock Return Request"** (Content) | Manual: *"Through vendor Communications, send request for Vendor (RMA) Approval"* | **Yes — primary** |
| Customer forward of vendor response | Approval Process **#9**, step 2 | Manual: *"if no pricing listed => forward to customer (use templated email: TEMPLATE NAME)"* — template name never filled in | Confirm with Brent — customer-facing, not vendor |
| Stock return document + shipping label | Returnable Bucket **#10 "Handle Stock Returns"** | Manual steps 2–3: *"Send RMA document from SFDC Feed"*, *"Forward shipping label when applicable for Global Pay Small pack returns"* | Confirm with Brent — customer-facing, not vendor. Step 1 (create RMA in Salesforce) stays manual; no RMA-creation API exists |
| Cancellation vendor comms (4 templates) | Not Shipped Bucket — **no such node today** | Cancellation vendor comms exist in Salesforce but were never built into this workflow | Confirm with Brent — additive, not a replacement |

### Adjacent manual steps (not email, but bundled into #21's step list)

- Awaiting Status / Awaiting Reason field update — appears in #21 steps 5a/5b, and separately in
  Approval Process **#31 "Agent Approvals Queue Steps"** and **#34 / Returnable #26 "Stock - Child Case"**.
  There is an existing open action item: *"Determine how the Awaiting Reason field can be updated via
  Zingtree API request"* (opened 2026-07-02). Replacing #21 end-to-end requires resolving it.

### Non-goals

- Triggering the Salesforce vendor-communication button via API — confirmed impossible, explicitly abandoned.
- Automating RMA **creation** — still blocked on GIC exposing RMA APIs (separate open item, Bill Sexton / Arun, since 2026-07-07).
- Replicating Vamshi's Salesforce screen pixel-for-pixel — Brent: *"We're hoping to not replicate any screens."* The Zingtree screen carries the same data and outcome, in Zingtree's own layout.

### Open questions for Brent

1. Scope — vendor-only (#21, #9), or also the customer-facing sends in #10 and #9-step-2?
2. Build now behind placeholder CX Actions for D1/D2, or wait for Vamshi?
3. Add cancellation vendor comms to the Not Shipped bucket (4 templates), or defer?

### Build status — Vendor Communication subroutine (2026-07-27)

Built on Brent's direct instruction ("create the vendor communication tree directly"), ahead of the
parked gate. A standalone subroutine tree that takes the template + vendor data in, sends the email,
attaches it to the case, and returns `email_sent` + `vendor_comm_result` to the caller.
Delivered: `Zingtree Builder/Workflow JSONs/Global Industrial/Vendor Communication (subroutine) v1.json`
(13 nodes, Script root, Stage A passed — static lint clean, all scripts parse, all paths smoke-tested).

| Edit | Nodes | Requirements | Status |
|---|---|---|---|
| E1 | 3, 4, 5 | R6, R7 — recipient dropdown from vendor contact object, agent-selected (never auto) | Built (recipient lookup reuses live SF CO 444) |
| E2 | 4 | R8, R11, R12 — auto-generated dynamic body from case + line items | Built (replicated logic; refines once SF template body lands) |
| E3 | 2, 4 | R9, R10 — template query + preselect by condition | **Placeholder — needs D2** |
| E4 | 6, 7 | R3, R4 — thread ID generated pre-send and embedded so replies attach to the case | **Placeholder — needs D1** |
| E5 | 8 | R1, R2 — send the email from Zingtree (not an SF trigger) | **Placeholder — needs send CO** |
| E6 | 9 | R5 — attach the sent email to the SF case feed | **Placeholder — needs attach CO** |
| E7 | 10, 11, 12 | Brent's direct ask — return to caller with a correct-send indication (`email_sent`, `vendor_comm_result`) | Built |

**Live function is blocked on D1, D2, and the send/attach Connected Objects.** Until wired, nodes
2/6/8/9 pass through and the result screen reports "not sent yet — integration pending." The screen,
recipient dropdown, body generation, and case-attachment structure are all in place, exactly as this CR
scoped as buildable ahead of D1/D2. Status: **Built (placeholder stage), pending Brent's import + Vamshi's APIs.**

---

## CR-002 — Consolidate Cancellations into the Returns workflow; child-case, validation, and customer-comms gaps

**Source:** Spiky call "GIC | Zingtree Sync," 2026-07-21 12:00–1:18pm MDT (meeting id
`559d05f0-23ed-4bf3-80ab-924b9ac0a650`). Attendees: Brent Thomas (Zingtree); Tammy Scher,
Arun Nagarajan (GIC). Marcus Torres declined. Corroborated by Brent's own recap in
[Slack #customer-globalindustrial, 2026-07-22 12:04pm MDT](https://zingtree.slack.com/archives/C074L34SG23/p1784743446507819).

**Logged retroactively 2026-07-27.** This call predates CR-001 by six days and was never specced.
Nothing in it is superseded by CR-001 — CR-001 covers *how the vendor email gets sent*; CR-002 covers
*the workflow it gets sent from*.

### What changed on this call

Two reversals. First, the standalone Cancellations workflow goes away: Arun and Brent agreed all
cancellation functionality already belongs in the Returns workflow, so the two **ship as one flow and go
live together**. Brent: *"Cancellations + returns will go live together as one workflow… Arun helped us
identify that all of the cancellation functionality makes sense to live in this workflow as it currently
does. This replaces the current (separate) cancellations process. Agents will now select a button:
Cancellations & Returns => the workflow logic takes it from there."*

Second, vendor/RMA communication became possible again. Arun's 7/06–7/07 position was that it wasn't
exposed via APIs and would need a major GIC engineering lift. Brent: *"On yesterday's call we clarified
that we only need to trigger the email and email template being sent within Global Industrial, and Arun
confirmed that should be possible."* CR-001 then took that from "possible" to a concrete design.

### Functional requirements

| # | Requirement | Source |
|---|---|---|
| R13 | Cancellations and Returns are **one workflow**, entered from a single agent-facing "Cancellations & Returns" selection; workflow logic routes to the correct bucket from there. The separate cancellations process is retired, not run alongside. | Brent, Slack recap 7/22 |
| R14 | Both go live **together** — a returns-only launch is explicitly off the table. | Brent, Slack recap 7/22 |
| R15 | A case carries **exactly one type**. Moving an item between return and cancellation handling requires updating the case type and pointing at the corresponding tree. Cancellation logic was originally branched on case type; the consolidated flow must respect that. | Arun, Spiky segment "Case Type Management and Flow Transitions" |
| R16 | Cancelling order items from inside the Returns flow must **create a child case of type `cancellation`** carrying those order items. | Arun: *"should we create a child case that is type cancellation and includes the order items?"* — confirmed *"Yeah"* |
| R17 | After child cases are created, the **parent case status moves to "Awaiting Information."** All subsequent action happens on the child cases; the parent is closed manually once the children complete. | Brent proposed, Arun confirmed as current practice — Spiky segment "Child Case Creation Requirements" |
| R18 | Cancellation, Returns, and Order Issues paths all **converge back to Order Verification**, so an agent can handle several customer needs in sequence in one session. Each path only handles the order items eligible for that path. | Brent's design diagram, Arun supportive — Spiky segment "Workflow Design Philosophy and Process Flow" |
| R19 | A **mixed order** — some items to return, others not yet shipped and to be cancelled — must be handled in one pass, producing the right child case per action type. | Tammy, Spiky segment "Current Flow Structure and Case Management" |
| R20 | Add a **workflow validation letting the agent check whether an RMA request has been sent.** | Brent: *"We want a validation in the workflow for an agent to check if A request for RMA has been sent"* |
| R21 | After the vendor RMA communication goes out, the agent must be able to **update the customer** — verbally by phone, or by an email sent updating them on status and actions taken. | Brent: *"once an RMA vendor communication has been sent off. We need to also communicate with the customer either by phone. the agent can tell the customer verbally or by email the agent We'll send an email updating the customer of the status and actions taken on their end"* |
| R22 | Order-item selections made in **Order Verification must carry forward** into the Returns flow. Today they don't — the agent re-selects. | Tammy, live test — see Defect DF-002 |

### Defects found live on the 7/21 call

| # | Defect | Evidence | Impact |
|---|---|---|---|
| DF-001 | **Child case creation fails — order number ID rejected as the wrong type.** | Brent: *"When we tried to create the child case, we got an error. that the order number ID value of incorrect type. We tried to send a value for the order number of… 28545671. And it did not like that"* | Blocks the end-to-end testing GIC has been waiting on since 7/14. Highest-priority item in this CR. |
| DF-002 | **Order Verification selections don't carry into Returns.** Tammy created a case from Order Verification with one order product; continuing into returns displayed all items. | Spiky segment "Live Testing and Data Flow Issues" | Agent re-selects items already chosen — the manual-step burden Bill Sexton flagged as an adoption risk on 2026-07-01. |

### Open questions — BLOCKING

| # | Question | Why it blocks |
|---|---|---|
| Q1 | **BLOCKING** — Is DF-002 (selection carry-forward) Zingtree's to fix in the tree, or GIC's on the Salesforce side? The call surfaced it and assigned it to nobody. | Determines whether R22 is a build item at all. |
| Q2 | **BLOCKING** — For R21, is the customer email **sent from Zingtree** (like CR-001's vendor email) or is it the agent's existing manual Salesforce send? The call didn't distinguish, and the two are very different builds. | R21 is unbuildable either way until answered. |
| Q3 | **BLOCKING** — R13/R14 consolidation spans the Returns trees **and** the separate Cancellations tree. Only the five Returns Redesign trees are exported locally. Which cancellations tree(s) are in scope, and where is that export? | No JSON, no build. |
| Q4 | Non-blocking — does "go live together" (R14) imply a target date? None was stated on the call and none exists anywhere in the workspace. | Sequencing only. |

### Traceability

| Req | Edit | Status |
|---|---|---|
| R13–R22, DF-001, DF-002 | — | **Not started.** No edit list produced; the build gate is closed (see below). |

**Status: NOT ready for build.** Four blocking items — Q1, Q2, Q3, and CR-001's D1/D2 dependencies.

---
*CR-001 requirements sourced from the 2026-07-27 Spiky transcript; CR-002 from the 2026-07-21 Spiky
analysis + Brent's contemporaneous Slack recap. Quotes verbatim. Nothing inferred beyond what was said.*
