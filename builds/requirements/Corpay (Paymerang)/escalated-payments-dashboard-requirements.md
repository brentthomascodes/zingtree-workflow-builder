# Requirements — Corpay (Paymerang): Escalated Payments Dashboard Guided Workflow

**Account:** Corpay (Paymerang)
**Workflow:** Escalated Payments Dashboard — Payment Processor II (PPII) guided workflow (**new build**)
**Owner:** Brent Thomas
**Created:** 2026-08-07
**Source:** "Dashboard Follow-up — Escalated Payments Dashboard" (Corpay, Rev 1, 6/26/2026, author K. Aleshire, 20 pp., Internal Use Only). Stored at `Account Management HQ/Corpay/Paymerang/Resources/Paymerang - Dashboard Follow-up Escalated Payments Dashboard.pdf`.
**Status:** Ready for build (content) — **build gated separately on Brent's sign-off** (payments carve-out, see Build Gate below). No blocking spec questions; several non-blocking open questions listed at the end.

## Scope decision (confirmed with Brent, 2026-08-07 via AskUserQuestion)
- New 4th Corpay sub-account: **Corpay (Paymerang)**.
- Build shape: **full guided decision tree** — walks a PPII through the whole branching logic (Universal/iCare/iStay vs. iPay, de-escalation, special cases), not a flat reference/checklist tree.
- **Placeholder Connected Objects** stand in for BizPay API calls Paymerang would wire up later (no API docs exist yet — this SOP is UI-click-path only).
- **AI Action nodes** where they add real value: drafting the two Teams escalation messages (Team Lead/Manager, CAM) and summarizing/triaging Completion Notes.

## Build Gate — read before building
This SOP has PPIIs **cancel payments, issue refunds, and reissue payments as checks** — real payment-processing actions. Per house rules this is never auto-approved on Brent's behalf, even though the logic itself (branching, content nodes, placeholder CX Actions) is otherwise routine. **Wes builds only after Brent has confirmed the numbered edit list produced from this doc.** Flag this again at build-edit-list time, not just here.

---

## Tree inventory (target)
No existing tree — first build for this account.

| Tree | Target file | Notes |
|---|---|---|
| Escalated Payments Dashboard — PPII Guide | `Zingtree Builder/Workflow JSONs/Corpay (Paymerang)/Escalated Payments Dashboard - PPII Guide v1.json` | Single tree, ~6 major branches (see §Functional Requirements). Root: vertical selection (Universal/iCare/iStay vs. iPay). |

---

## Functional Requirements

### A. Entry / dashboard access (pp. 6–7)

| # | Requirement | Source |
|---|---|---|
| R1 | Root node asks the PPII which verticals they're working: **Universal / iCare / iStay** (one branch) or **iPay** (a separate branch with different rules throughout). | SOP p.6–7: "Apply Filters depending on which payment type you are working. a. For Universal, iStay & iCare select all verticals except iPay. b. For iPay, only select iPay." |
| R2 | Content node restates the two dashboard prep steps as a checklist before the PPII starts working payments: select **Escalated Payments Dashboard** from the Payments dropdown, filter to **Uncleared**, apply the correct vertical filter set (R1), sort **Processed Date ascending**. | SOP p.6–7 |
| R3 | **Non-goal for v1:** the Aviatrix VPN / Duo MFA / BizPay SSO login sequence (pp.1–5) is **not modeled as tree steps** — the tree assumes the PPII is already logged into BizPay and viewing the dashboard. [Open question #1 below — confirm with Brent.] | Scope call, flag for confirmation |

### B. Escalations for Universal, iCare & iStay (pp. 8–10)

| # | Requirement | Source |
|---|---|---|
| R4 | Content/logic node: review the **Action Taken** column and **Notes** (hover) for the oldest escalated payment; branch on whether a follow-up is required. | SOP p.8: "Determine whether a follow-up is required" |
| R5 | If the payment is already in **Invoice Requested** status and worked by the Invoice Request inbox team, the tree ends this path with **no further PPII action**. | SOP p.8 |
| R6 | If an invoice request is still pending and within PPII responsibility, branch to the **invoice request snooze schedule**: 1st request → snooze 3 days; 2nd request → snooze 2 days; 3rd request → snooze 2 days. Each branch should surface the "send the next request, let the inbox team know" instruction. | SOP p.8: "1st request: Snooze for 3 days. 2nd request: Snooze for 2 days. 3rd request: Snooze for 2 days." |
| R7 | If a 3rd request has gone unanswered, branch to **cancel the payment and reissue as a check**, with a content-node link/reference to the Paymerang - BizPay Participant Guide procedure (companion doc — not yet obtained; placeholder link + [inferred] step text). | SOP p.8: "If the third request was sent and no response was received, prepare to cancel the payment and have it reissued as a check, per the Paymerang - BizPay Participant Guide.pdf." |
| R8 | If no invoice request is needed and the payment can be made directly (e.g., a payment link was found), branch to **make the payment** per the Participant Guide; on completion the escalation resolves and auto-drops off the dashboard — no PPII cleanup action needed. | SOP p.9 |
| R9 | If, after taking an action, the payment **cannot be fully completed**, require the PPII to update **Action Taken** (Escalate to Enrollment, or Invoice Request) **before unlocking** the payment. Frame this as a required step, not optional — "This step helps document the outcome and ensures visibility for follow-up." | SOP p.9 |
| R10 | Branch for **iPay High-Dollar Phone Payments** even though it's listed under this section: Action Taken options **Left Voicemail** / **Long Hold**; require **two attempts** before the tree allows branching to **cancel + document reason**. Note in the tree that the Action Taken dropdown is "rarely needed" for iPay in general (most iPay resolves single-touch) — this is the exception. | SOP p.9 |
| R11 | Loop-back content node: "Select Uncleared again to refresh, re-sort oldest→newest, repeat, work the next payment." Modeled as a **repeat/return-to-top** node so the tree reflects the real workflow loop rather than ending after one payment. | SOP p.10 |

### C. De-escalating Universal, iCare & iStay (pp. 10–12)

| # | Requirement | Source |
|---|---|---|
| R12 | Logic node: de-escalation is only valid when **either** (a) the escalation was due to lack of access and the escalation team has since verified the inbox and taken appropriate action, **or** (b) all required Nearshore (NS) attempts are complete. | SOP p.10 |
| R13 | Branch (a): if the required payment link is found, **make the payment** per the Participant Guide; if not found, **request the link(s)** per the Participant Guide and de-escalate anyway. | SOP p.10 |
| R14 | Branch (b): note that **all NS attempts collectively count as 1 of the 4 attempts** required for the DBFU PPII follow-up procedure — this is a rule the tree should surface explicitly since it's easy to miscount. | SOP p.10: "According to the Follow-up procedure, all NS attempts only count as 1 attempt for the DBFU PPII working Follow-up, and we are required to make 4 attempts." |
| R15 | Step sequence node: hover Notes to confirm resolution needs → click the Payment ID to open **Card Payment Details** → if link not in inbox, request the link(s) per the Participant Guide and enter **Completion Notes** reflecting the action → if all NS attempts are done and it just needs to move on, no notes/action required → **Actions → De-Escalate Payment → Yes** → **Unlock Payment**. | SOP p.11–12 |
| R16 | Content node: de-escalating **removes the payment from the Escalated Payments Dashboard** and routes it to the **Card Payment Processing** dashboard, where it's picked up via the separate "Dashboard Follow-up — Follow-up Sheet" procedure (companion doc, not yet obtained — out of scope for this tree, referenced only). | SOP p.10 |

### D. Nearshore Escalation Sheet logging (pp. 12–13)

| # | Requirement | Source |
|---|---|---|
| R17 | Logic node: determine whether this resolution qualifies for the **"2025 NS Escalations" sheet** — an NS agent escalated it and the PPII resolved it **without** an invoice request (verified details via the Hotel Group All Sheet, or completed from info already on file). | SOP p.12 |
| R18 | If yes, content node listing the **required fields** to log, exactly as the SOP defines them: **Payment ID** (copy from BizPay), **Vertical** (Universal/iCare/iStay/iPay), **Vendor Name** (exact, as listed on the payment/remittance), **Worked By** (first initial + last name, e.g. "HPotter"), **Completion Notes** (copy/paste from the original escalation), **Resolution** (brief summary of how it was resolved), **NS Submitted By** (name/email of the NS agent who originally escalated it). | SOP p.13, fields a–g |
| R19 | Note that entries are **reviewed and sent out the following morning for coaching** — all fields must be complete and accurate before submission. This is a completeness gate the tree should enforce as a "confirm all fields filled" checkpoint, not a hard validation (this sheet is external to BizPay). | SOP p.13 |

### E. Escalations for iPay (pp. 14–16)

| # | Requirement | Source |
|---|---|---|
| R20 | Branch header content: iPay is governed by a **different rule set** than Universal/iStay/iCare — surfaced explicitly so a PPII working both doesn't cross-apply rules. Used for: refunds/partial refunds escalated from Pega, and problem payments (unresponsive vendor, invalid account info, failed attempts). | SOP p.14 |
| R21 | Three hard constraints, each as its own content/logic gate: **(1)** all payments must be attempted unless notes/history clearly justify cancellation — no "cancel on sight." **(2)** vendor-specific handling is critical (e.g., MyChart accounts don't take calls — the tree should flag this as an example vendor rule, not the only one). **(3)** iPay DBFU **never** requests invoices, contacts the client, or sends checks — this should be a hard stop / guardrail message if a PPII tries to branch into the Universal/iCare/iStay invoice-request flow while in the iPay branch. | SOP p.14 |
| R22 | Step sequence: hover Notes to identify refund / partial refund / problem payment → click Payment ID → **Card Payment Details** → read Completion Notes + past payment history for that Payor to decide next step. | SOP p.14–15 |
| R23 | Branch by payment channel: **Online/IVR** — attempt normally; if a partial payment was made and overpayment isn't allowed, initiate a partial refund; if payment fails, try the second payment option on file; if that also fails, cancel + refund + mark completed. **Phone** — same escalation ladder; cancel + refund if the vendor is unreachable or payment fails after multiple attempts. | SOP p.15 |

### F. iPay special cases (pp. 15–16)

| # | Requirement | Source |
|---|---|---|
| R24 | **Repeatedly escalated vendor** → branch to root-cause options: improve payment instructions, consider Clear Email method (flagged "rare"), explore alternative payment methods. | SOP p.15 |
| R25 | **Improperly canceled payment** → branch by who canceled it: if a Nearshore agent, route to the Nearshore Escalation Sheet section (§D) "for coaching"; if an in-house Payment Processor, send them the Payment ID, ask for their reasoning, and use it as a coaching opportunity. | SOP p.16 |
| R26 | **Dashboard exceeds 50 uncleared entries** → guidance content node: don't panic, prioritize clearing easy cancellations first, coordinate with teammates on the same dashboard to avoid duplicate work. | SOP p.16 |
| R27 | **Cancellation reason doesn't match the actual issue** → use the catch-all reason **"Cancel/refund per Client request"**, with the tree offering the four documented sub-reasons as a pick-list: fee exceeds 1%; payor reached max transaction limit; account not eligible for card payments; vendor did not respond after multiple calls. | SOP p.16 |

### G. Special case — Repeated Invoice Request (pp. 16–17)

| # | Requirement | Source |
|---|---|---|
| R28 | Logic gate defining "repeated invoice request": **3 or more consecutive payments** for the same client required invoice requests, **or** the client consistently omits the same key details (e.g., account number, address). | SOP p.16 |
| R29 | Step sequence: review the last 3 payments for the client → verify whether the missing info was consistent across all three → send another invoice request if warranted (document as usual) → escalate to **Team Lead/Manager**, who escalates to the **Client Account Manager (CAM)**. | SOP p.17 |
| R30 | **AI Action candidate:** draft the Team Lead/Manager escalation message from structured fields (client name, vendor name if applicable, payment IDs, summary of missing info, dates of invoice requests) — matching the Teams-message template shown in the SOP. PPII reviews/edits before sending; this tree does **not** auto-send to Teams (no Teams integration exists yet — placeholder Connected Object only). | SOP p.17 (Teams message mockup) |

### H. iStay Payments — ShareFile (p. 18)

| # | Requirement | Source |
|---|---|---|
| R31 | Logic gate: this path applies **only** to iStay clients **M3** and **Sage Hospitality** — confirm via the client's contact email (M3 example: `AP@M3AS.com`) or the client name containing "Sage." | SOP p.18 |
| R32 | Step sequence: confirm M3 or Sage Hospitality → review Completion Notes + payment history to confirm the invoice is actually required → follow the ShareFile submission steps in the companion doc "Paymerang Dashboard Follow-up Invoice Request" (**not yet obtained — placeholder content node with a TODO link**; do not fabricate the ShareFile UI steps) → notate in Completion Notes that the invoice was requested via ShareFile. | SOP p.18 |
| R33 | Once ShareFile is submitted, hand off to the **Universal/iCare/iStay follow-up flow** (§B) for tracking the response. | SOP p.18–19 |

### I. Handling Misapplied Payments (pp. 19–20)

| # | Requirement | Source |
|---|---|---|
| R34 | Logic gate: identify misapplied-payment indicators in Notes/Action Taken — payment applied to the wrong account, unable to match payment to vendor, or escalated due to a remittance mismatch. | SOP p.19 |
| R35 | **Hard guardrail, styled as a warning in the tree exactly like the SOP's callout box:** "Do Not Attempt to Resolve It Yourself." This must be a visually distinct warning node, not buried in a bullet. | SOP p.19: "IMPORTANT — Do Not Attempt to Resolve It Yourself." |
| R36 | Step sequence: send the Team Lead/Manager the Payment ID, Client/Vendor Name, and a brief issue summary → notate in Completion Notes that it was escalated → **leave Action Taken empty** until the manager/Team Lead responds → **leave the payment locked** so nobody else works it. | SOP p.20 |
| R37 | **AI Action candidate:** same pattern as R30 — draft the manager escalation message from structured fields (Payment ID, Client/Vendor Name, issue summary), matching the SOP's Teams-message template. Reviewed/edited by the PPII before sending; placeholder Connected Object for the actual Teams send. | SOP p.20 (Teams message mockup) |

---

## Placeholder Connected Objects (stub now, wire up later)
No BizPay API documentation exists yet — every one of these is a **named, empty Connected Object** so Wes can build the branching logic now and Paymerang (or Brent) can wire the real calls in later without restructuring the tree.

| Connected Object (placeholder) | Used in | Real integration (future) |
|---|---|---|
| `bizpay_get_escalated_payments` | R2, R4, R11 | GET filtered/sorted Escalated Payments Dashboard rows |
| `bizpay_update_action_taken` | R9, R10, R36 | PATCH Action Taken field on a payment |
| `bizpay_get_card_payment_details` | R15, R22 | GET Card Payment Details / payment history for a Payor |
| `bizpay_deescalate_payment` | R15 | POST De-Escalate Payment action |
| `bizpay_unlock_payment` / `bizpay_lock_payment` | R15, R36 | POST Unlock / Lock payment |
| `teams_send_message` | R30, R37 | POST message to Team Lead/Manager/CAM Teams channel or DM |
| `sharefile_submit_invoice_request` | R32 | Submit an iStay M3/Sage Hospitality invoice request to ShareFile |
| `ns_escalations_sheet_append_row` | R18 | Append a row to the "2025 NS Escalations" sheet for the current month tab |

## AI Action node candidates
| AI Action | Used in | What it does |
|---|---|---|
| Draft Team Lead/Manager → CAM escalation message | R30 | Generates the message body from client name, vendor name, payment IDs, missing-info summary, request dates — PPII reviews/edits before send |
| Draft misapplied-payment escalation message | R37 | Generates the message body from Payment ID, Client/Vendor Name, issue summary — PPII reviews/edits before send |
| Completion Notes triage (optional, flag as **Should**, not **Must**) | R4, R22, R34 | Summarizes a long/messy Completion Notes hover-text into a structured read (last action, date, outstanding ask) so the PPII doesn't have to parse run-on notes like the p.8 example (multiple stacked timestamped entries) |

## MoSCoW summary
- **Must:** R1–R23, R28–R29, R31–R36 (25) — the core branching logic and hard guardrails (R21's iPay stop, R35's misapplied-payment warning).
- **Should:** R24–R27, R30, R37, Nearshore sheet logging fully modeled (R17–R19) — real but secondary paths and the two AI Action drafting nodes.
- **Could:** Completion Notes AI triage (above) — genuinely optional polish, not asked for by Brent, proposed because it fits the "AI actions where it makes sense" instruction.
- **Won't (this build):** VPN/Duo/BizPay login sequence (R3); live BizPay/Teams/ShareFile API wiring (all Connected Objects ship empty); Card Payment Processing dashboard follow-up flow (referenced, out of scope — separate companion-doc procedure).

## Non-goals
- No live integration to BizPay, Teams, or ShareFile in this build — every external call is a named placeholder Connected Object per Brent's instruction.
- Not modeling the Aviatrix VPN / Duo MFA / BizPay SSO login steps (pp.1–5) as tree nodes (see Open Question #1).
- Not building the "Card Payment Processing" / "Dashboard Follow-up — Follow-up Sheet" procedure that de-escalated payments flow into — that's a separate, not-yet-obtained SOP.
- Not fabricating exact UI steps for the ShareFile submission (R32) or the Participant Guide payment/cancellation procedures (R7, R8, R13) — these reference companion docs Paymerang hasn't provided; content nodes will say "per the Participant Guide" / "per the ShareFile doc" and link a placeholder, not invented click-paths.

## Open questions for Brent (non-blocking — reasonable defaults assumed above, flag if wrong)
1. Confirm the tree should start at "already logged into BizPay, dashboard open" rather than modeling the VPN/Duo/SSO steps (R3). Assumed: yes, skip login steps.
2. No confirmed Paymerang-side contact exists yet (only K. Aleshire, the SOP's author, is named, and their role/email is unconfirmed) — anyone to loop in before this goes further, or is this staying internal to Zingtree for now?
3. Three companion docs are referenced but not in hand: **Paymerang - BizPay Participant Guide.pdf** (R7, R8, R13, R23), **Paymerang Dashboard Follow-up Invoice Request** / ShareFile section (R32), and the **Hotel Group All Sheet** (R17). Want me to build those nodes as clearly-marked placeholders now (as scoped above), or hold off on those specific branches until the docs are in hand?

## Verification note
Given the payments carve-out, recommend Stage A (static + full-path stress test) **plus** a manual read-through by Brent or a teammate against this doc's Must-list before this goes anywhere near a live BizPay integration — not just the standard Stage A gate.

---

## Proposed Build — Node/Edit List (v1, pending Brent's confirmation)

**2026-08-07 — Brent's answers to the three open questions above:** skip the login-step modeling; stay internal for now (no external contact loop-in); build the three companion-doc-dependent branches (Participant Guide, ShareFile, Hotel Group All Sheet) as placeholders now.

Consolidated per the house pattern (logic lives in scripts, content nodes only render; multiple SOP screens collapse into one script + one content node). **This is the numbered edit list — nothing gets built until Brent confirms it**, per the payments carve-out (no Dudley/Wes auto-approval on this account).

| # | Node | Type | Requirements | Notes |
|---|---|---|---|---|
| E1 | Vertical router | Script | R1–R3 | Sets `working_vertical`; builds the dashboard-prep checklist HTML for whichever branch. No login-step nodes (per Brent, 8/7). |
| E2 | Dashboard prep | Content | R2 | Renders E1's HTML. |
| E3 | Escalation triage (Universal/iCare/iStay) | Script | R4–R8 | One script computes follow-up-needed, request number (1st/2nd/3rd/none), and route (send request / cancel+reissue / make payment / no action); builds explanation HTML. |
| E4 | Triage result | Content | R4–R8 | Renders E3's HTML. |
| E5 | Action Taken updater | Script | R9 | Placeholder CO `bizpay_update_action_taken`. |
| E6 | iPay high-dollar phone payment side-check | Logic + Script | R10 | 2-attempt counter, Left Voicemail / Long Hold. |
| E7 | Loop back to next payment | Content | R11 | `return_tree_node_id` → E3. |
| E8 | De-escalation gate + steps | Script | R12–R15 | Eligibility check + step builder. Placeholder COs `bizpay_get_card_payment_details`, `bizpay_deescalate_payment`, `bizpay_unlock_payment`. Surfaces the "NS attempts = 1 of 4" rule explicitly (R14). |
| E9 | De-escalation steps | Content | R13, R15, R16 | Renders E8's HTML; notes hand-off to Card Payment Processing (out of scope, referenced only). |
| E10 | NS Escalation Sheet qualifier + row builder | Script | R17–R19 | Placeholder CO `ns_escalations_sheet_append_row`; all 7 fields (Payment ID, Vertical, Vendor Name, Worked By, Completion Notes, Resolution, NS Submitted By). |
| E11 | iPay triage | Script | R20–R23 | Payment type + channel ladder (Online/IVR/Phone); hard-stops any attempt to fall into the Universal invoice-request flow (R21 guardrail). |
| E12 | iPay attempt result | Content | R20–R23 | Renders E11's HTML. |
| E13 | iPay special-cases router | Script | R24–R27 | One script, four cases (repeat vendor, improperly canceled, >50 queue, reason-mismatch picklist); builds HTML per case. |
| E14 | iPay special case guidance | Content | R24–R27 | Renders E13's HTML. |
| E15 | Repeated Invoice Request gate + field prep | Script | R28–R29 | Reviews last 3 payments, checks consistency, stages escalation fields. |
| E16 | Draft CAM escalation message | Script (**AI Action placeholder**) | R30 | Placeholder CO `teams_send_message`. AI Action node type not modeled in detail — flagged as a stub pending real Zingtree AI Action config. |
| E17 | Review & send escalation message | Content | R30 | Editable draft; PPII reviews before "send" (send itself is the placeholder CO). |
| E18 | iStay ShareFile gate + placeholder steps | Script | R31–R33 | Placeholder — ShareFile doc not in hand, per Brent build-as-placeholder call. Hands off to E3 for follow-up. |
| E19 | Misapplied Payment gate + lock/clear prep | Script | R34, R36 | Computes lock state + clears Action Taken. |
| E20 | "Do Not Attempt to Resolve It Yourself" warning | Content | R35 | Distinct styled warning box, matching the SOP's callout. |
| E21 | Draft misapplied-payment escalation message | Script (**AI Action placeholder**) | R37 | Same pattern as E16; placeholder CO `teams_send_message`. |
| E22 | `claude.md` tree-memory node | Content (unlinked) | house convention | Purpose, node map, data dictionary, external systems, changelog — per `zingtree-workflow-builder` skill. |

**Node count:** 22 (down from a naive ~38-node draft via script/content consolidation — logic-chains and repeated screens collapsed per house pattern).

**Flagged for review (per Zingtree policy — payments/PII carve-out):** E5, E8–E10 (payment cancel/de-escalate/unlock actions), E15–E17 and E19–E21 (payment escalation with client/vendor data). Recommend a teammate review pass before this goes near a live BizPay connection, even after Brent's own sign-off.

**Waiting on:** Brent's explicit confirmation of this edit list before Wes writes any node/script/JSON.

---

## Build status — v1 (2026-08-07)

Built on Brent's confirmation ("build," 2026-08-07) against the edit list above. Delivered:
`Zingtree Builder/Workflow JSONs/Corpay (Paymerang)/Escalated Payments Dashboard - PPII Guide v1.json`
(57 nodes: 36 Content, 11 Data-placeholder, 10 Script; Script root's first two nodes are the
vertical-router pair). Stage A verification (static lint + full-path reachability + script
smoke-test) passed — see `Zingtree Builder/Workflow JSONs/Corpay (Paymerang)/stage-a-verification.md`.

**Status: Built, pending Brent's approval.** Not ready for live BizPay integration or agent-facing
rollout — placeholder Connected Objects are unwired, the two AI Action nodes are script-built stubs
(pending confirmation of Zingtree's real AI Action node config), and the payments/PII carve-out
nodes need a teammate review pass, per this account's house rules.

| Edit | Concrete node(s) | Status |
|---|---|---|
| E1/E2 | `root_pick`, `u_prep_script`/`u_prep_content`, `i_prep_script`/`i_prep_content` | Built |
| E3/E4 | `u_review` (judgment-call content node, not a computed Scoring node — see claude.md "Conventions") | Built |
| E5 | `u_noaction` | Built |
| E6 | `u_ladder_pick`/`u_ladder_script`/`u_ladder_content`, `hd_note` | Built |
| E7 | `u_cancel_reissue` | Built (placeholder content, Participant Guide not in hand) |
| E8 | `u_makepay` | Built (placeholder content) |
| E9 | `u_action_taken` (Data placeholder) | Built |
| E10-E11 (was E8 in v1 edit list) | `u_deescalate_gate`/`u_cpd_fetch`/`u_deescalate_content`/`u_deescalate_action`/`u_unlock_action`/`u_deescalate_result` | Built |
| E12 (was E9) | folded into `u_deescalate_result` | Built |
| E13 (was E10) | `ns_gate`/`ns_script`/`ns_append`/`ns_confirm` | Built |
| E14 (was E11/E12) | `i_triage`/`i_cpd_fetch`/`i_channel_pick`/`i_channel_script`/`i_channel_content`/`i_result_ok` | Built |
| E15 (was E13/E14) | `i_special_gate`/`i_sp_repeat`/`i_sp_improper`/`i_sp_queue`/`i_sp_mismatch`/`i_sp_mismatch_content` | Built |
| E16 (was E15) | `riq_gate`/`riq_script`/`riq_content` | Built |
| E17 (was E16) | `riq_ai_draft` | Built as script-stub — **AI Action node type not modeled**, flagged |
| — | `riq_review`/`riq_send`/`riq_confirm` | Built |
| E18 (was E18) | `isf_gate`/`isf_content`/`isf_confirm` | Built (placeholder content) |
| E19-E20 | `mis_warn`/`mis_script`/`mis_content` | Built |
| E21 | `mis_ai_draft` | Built as script-stub — same AI Action caveat |
| — | `mis_review`/`mis_send`/`mis_confirm` | Built |
| E22 | `claude_md` (node 57, unlinked) | Built |

**Test steps for Brent:** import the JSON into a sandbox Zingtree org, start at the root, and click
through at minimum: (1) Universal/iCare/iStay → invoice ladder → 3rd-request cancel+reissue path,
(2) Universal/iCare/iStay → de-escalation path, (3) iPay → Online/IVR channel path, (4) iPay →
cancellation-reason-mismatch special case, (5) repeated invoice request → CAM draft/send, (6)
misapplied payment → warning → lock → draft/send. No testing link exists yet for this account
(no confirmed Paymerang sandbox) — flagging that as a gap, not assuming one.
