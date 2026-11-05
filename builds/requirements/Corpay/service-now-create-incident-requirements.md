# Requirements — Corpay ServiceNow "Create Incident" workflow

**Account:** Corpay / Corporate Payments
**Tree:** `Service Now - Create Incident` (tree 482136721, org 604910). Lives inside workflow 179471451; API version starts at node 53.
**Owner:** Brent Thomas (Zingtree) · **Corpay:** Jennifer Sublett (Experience Design), Emmett Palmer (Ops Incident Mgmt BA), Gautam Singh (ServiceNow Platform Owner)
**Status:** CR-002 Ready for build — built + Stage-A verified 2026-07-30, **awaiting Brent review + live import**

> **Routing note.** The 2026-07-30 call is titled *"Vehicle Payments: CX Action"* on the calendar, but Jennifer "hijacked" that recurring CX-Actions slot for the ServiceNow/ZT project (email 2026-07-29). All contacts and content are **Corporate Payments**, so this routes there — not to the Corpay/Vehicle Payments sub-HQ. Confirm if that's wrong.

---

## Background / prior state

The tree collects a production-support incident form and POSTs it to Corpay's ServiceNow scripted REST API (`POST {{base_path}}/api/stvsc/zingtree/incident/create`, base = fleetcortest.service-now.com) via a Script node (node 53, "Format API Request") that builds the payload and hands off to the Data node (51). FRS + TDD approved (Jul 2026). Payload fields (`requested_for`, `description`, `assignment_group`, etc.) locked previously.

**CR-001 (done 2026-07-27):** `assignment_group` made dynamic — resolved from the selected `form` (and `customer_product` on the open-incident branch). No change here.

---

## CR-002 — Per-form Short Description (2026-07-30)

**Trigger:** Jennifer 2026-07-29 ("issues with what Zingtree sends ServiceNow for Short Description"); Emmett's follow-up email 2026-07-29 23:50 UTC carried the full edit spec (table below). Confirmed live on the 2026-07-30 call. Emmett confirmed **Description and all form fields come through correctly** — only Short Description changes.

**Problem:** the old Short Description was one generic template for every form —
`{form} | {customer_name|vendor_name} | {issue} | SF {sf_case_number}` — carrying a redundant prefix and the SF case number Corpay doesn't want, and not surfacing the form-specific fields their ServiceNow queues triage on.

**Requirement:** each of the 9 forms emits its own Short Description. Remove the SF case suffix; drop the generic customer prefix. Target templates (Emmett's "Short Description Needed" column, authoritative):

| Form (`form` value) | Short Description |
| :-- | :-- |
| Commercial Card Production Support | `Commercial Card Production Support: {issue_short_description}` |
| Corpay Complete Engineering Identified Bug | `Corpay Complete Engineering Identified Bug: {corpay_complete_module} {issue_short_description}` |
| Corpay Complete ERP Integrations Escalation | `Corpay Complete ERP Integration Issue: {customer_ERP} {issue_short_description}` |
| Corpay Complete Production Support | `Corpay Complete Production Support: {issue_short_description}` |
| Full AP Customer Related Production Support | `Full AP {customer_product} {channel_partner} {accounting_system} Production Support: {issue_short_description}` |
| Full AP Vendor Related Production Support | `Full AP Vendor Related Production Support: {issue_short_description}` |
| Issue Related to an Open Incident | `{customer_product} Issue Related to Open Incident {existing_incident} : {issue_short_description}` |
| MDM Escalation Production Support | `MDM Production Support: {issue_short_description}` |
| Print Check Batch File Issue | `{check_printer} Check Batch Error: {venture_batch}` |

**Rules:** blank/unreplaced fields collapse out (no double spaces, no stray tokens); cap 160 chars; unknown `form` value → `{form} {issue_short_description}` fallback so submission never breaks.

**Field-capture check (done):** every field the templates reference is **already captured** on its form — `customer_ERP` (node 44), `corpay_complete_module` (48), `existing_incident` (41), `check_printer`/`venture_batch` (38), `customer_product`/`channel_partner`/`accounting_system` (21). Emmett's "need to add X" notes referred to the *output string*, not missing form fields. **→ No form-field edits needed. Node 53 script only.**

**Implementation note:** `fld()` reads each field directly via `ZT.getVariableValue` rather than the script's internal `form` dict — `issue_short_description` is deliberately absent from that dict (it's excluded from Description), so reading it from the dict returned empty. Reading from Zingtree directly is correct and leaves Description untouched.

### Open questions (non-blocking; confirm with Brent/Emmett)
1. **Commercial Card & CPC Production Support** — Emmett noted "OK to leave Customer Name." The "Needed" column omits it, so the build omits it. Confirm customer name isn't wanted in the title.
2. **Full AP Vendor** — Emmett: "OK to leave SF# but not needed." Build omits SF#. Confirm.
3. **Print Check** — form name may shorten to "Check Batch Error" (Emmett's option). Title string already uses "Check Batch Error:"; no node rename done — confirm if the node/button label should also change.

### Verification (Stage A — passed 2026-07-30)
`node --check` clean; stubbed-`ZT` smoke test across all 9 forms + both open-incident sub-products + a blank-field case + an unknown-form fallback = **12/12 pass**, all ≤160 chars, no stray tokens, no double spaces, assignment_group unchanged.

### Deliverable
`Zingtree Builder/Workflow JSONs/Corpay/Service Now - Create Incident (short_description per-form REBASED 2026-07-30).json` — **rebased 2026-07-30 onto Brent's latest export** (tree last_modified 7/29 23:41, which added `issue_short_description` + several `_other` fields to the LABELS map and renumbered node 56→58). This supersedes the first per-form JSON that was built on the 7/27 base. Re-verified 12/12 on the new base; claude.md node + changelog updated. **Not yet imported** — Brent reviews, then imports into tree 482136721. Live import is the gated step (Corporate Payments account; recommend a teammate glance before publish).

### Pending inputs
- Spiky transcript for "Vehicle Payments: CX Action" 2026-07-30 was still `ONGOING`/unanalyzed at build time — pull when ready to confirm no additional edits beyond Emmett's email.
- Jennifer's target: all data corrections tested by **EOD Fri 2026-07-31**; Hexaware deploys to prod next week; tentative go-live **Fri 2026-08-07**.
