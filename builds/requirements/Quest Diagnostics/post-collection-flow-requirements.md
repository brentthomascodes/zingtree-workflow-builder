# Quest Diagnostics — Post Collection Flow — Requirements

| | |
| :---- | :---- |
| **Account** | Quest Diagnostics (Workforce Health Solutions unit; end-client Delta Air Lines) |
| **Workflow / tree** | Post Collection Flow — build-time export `173598167`; **live tree is `458535399`**, confirmed live 2026-07-29 (Zingtree assigns a new ID on import — see the companion note in `delta-post-accident-requirements.md` §0.1). This doc's baseline is reconstructed from live tree `458535399`. |
| **JSON location** | Live tree export `458535399` (within Brent-provided "Selected_from_Quest Diagnostics 11_20260825.json", 2026-08-25); build-time history in `Zingtree Builder/Workflow JSONs/Quest Delta/Post Collection Flow_173598167_v2/v3.json` and `Quest - Delta Post Accident/Post Collection Flow_2026-07-22.json` |
| **Status** | Baseline reconstructed; CR-001 and CR-002 drafted — **not Ready for build**: CR-002 Q9 (DER date/time Salesforce API names), Q10 (paperwork-sent field shape) and Q5 (Confirmation Test Time scope) are blocking; field-requirement policy still open with Fahim/Chris; PII/PHI carve-out applies (§8) |
| **Owner** | Brent Thomas |
| **Created** | 2026-08-25 |
| **Last amended** | 2026-09-17 (CR-002 drafted — 2026-09-15 working session) |
| **Sources** | Live tree export `458535399` (2026-08-25); its own `claude.md` memory node (914); `Workflow JSONs/Quest - Delta Post Accident/Post-Collection Field Map (Chris feedback, 2026-07-22).md` (2026-07-22 call, Chris LeDoux + Emily James + Marcus Torres); Spiky meeting "Quest x Zingtree: Project Sync" (2026-08-20, `https://app.spiky.ai/meetings/e6731191-c8f6-4a1b-8642-87ea8ebf8e84`) — Chris LeDoux, Fahim Ziyad, Marcus Torres; `Account Management HQ/Quest Diagnostics/MEMORY.md` |

> This tree had no formal requirements doc before this pass — per house rule ("new workflow → new doc"), this reconstructs the baseline from the current live tree JSON (which already includes the 2026-07-22 field-map asks, built 2026-07-28) and adds CR-001 for the 2026-08-20 call's new asks. Requirements inferred rather than directly sourced are tagged `[inferred]`. Requirement text is never edited after agreement — changes arrive as numbered CRs in §12.

---

## 0. Baseline note — read before building

This tree is reached from the Delta Post Accident tree's OSM notification email (node 22 of live tree `230727783`), which links to `https://zingtree.com/live/458535399?zv_sf_Id=${sf_Id}#910`. It is a single-screen native form (node 910) that writes back to the same Salesforce Event record via Connected Object `447`, alongside a time-format conversion script (node 913) and a success screen (node 912). It carries its own `claude.md` memory node (914, unlinked) documenting the 2026-07-28 build — this doc formalizes that history and adds governance going forward.

**Known naming quirk (carried over from the 2026-07-28 build, not touched here):** `sf_DER_Notified_At__c` combines date+time into one field, rather than the two separate fields (`DER notify date`, `DER notify time`) originally asked for on 2026-07-22. It captures the same information; leaving as-is unless Brent says otherwise — flagged as Assumption A1.

## 1. Business context & outcome

The collector who performs a Delta post-accident/reasonable-suspicion drug/alcohol test submits collection details (arrival/end time, FedEx tracking, ATF #, BAT results, specimen ID, and — when the BAT is positive — DER notification and confirmation-test details) back into the same Salesforce Event record the agent started in the Delta Post Accident tree. `[inferred]`

## 2. Actors & journey

- **Who uses it** — the collector (not the intake agent), via a link emailed automatically from the Delta Post Accident tree's OSM notification (node 22).
- **Where it runs** — embedded in Salesforce (UAT: `ies-questdiagnostics--zingtree.sandbox.lightning.force.com`), writing back to the Event identified by `sf_Id` (passed as a query param).
- **Journey** — single form screen (910) → time-format conversion script (913) → Connected Object write (911) → success screen (912). No branching, no email sent from this tree.

## 3. Scope

**In scope (CR-001)**
- Remove the duplicate "Test Number" field.
- Add four new confirmation fields, conditional on a positive BAT result.
- Fix the Salesforce field-mapping/population issue Chris found (flagged as a Salesforce Connected-Object-side investigation, not a Zingtree JSON change — see R7).

**Out of scope (this round)**
- The full required-vs-conditional field matrix (§9 Q2) — Fahim and Chris are determining this offline; this round does not change any `required` flag pending that answer.
- Collector name/phone/office number — Chris asked for these in "both emails," which are sent by the Delta Post Accident tree, not this one. See `delta-post-accident-requirements.md` CR-002 R25.
- Any change to the Delta Post Accident tree itself (`230727783`/`683028422`) — separate doc.

## 4. Functional requirements — reconstructed baseline (current live tree `458535399`)

### R1 — Single-screen post-collection form `[inferred]` · **Must**
- **Source:** node 910
- **Requirement:** One native-field form captures: Salesforce Event ID (`sf_Id`, hidden/read-only), Arrival Time (`sf_Collector_Arrival_Time_Actual__c`), End Time (`sf_End_Time_Actual__c`), FedEx Tracking # (`sf_FedEx_Tracking_for_ES_24_7__c`, required), ATF # (`sf_ATF_Number__c`, required), Test # on Printout (`sf_BAT_Test_Number__c`), BAT Results (`sf_BAT_Result__c`), Additional Paperwork (file upload).
- **AC-1.1** — Given the form loads from the OSM email link, when it renders, then `sf_Id` is pre-filled and read-only.

### R2 — Breath-alcohol time + time zone `[inferred]` · **Must** · ~~time-select portion superseded by CR-002 R16~~
- **Source:** node 910, added 2026-07-28 per the 2026-07-22 call
- **Requirement:** `sf_BAT_Collection_Time_Actual__c` (time select) and `sf_BAT_Collection_Time_Zone__c` (select) capture when/where the breath-alcohol test was administered. Converted to `HH:MM:SS.000Z` by node 913's `toSalesforceTime()`.

### R3 — "Test Number" field (duplicate — superseded by CR-001 R8) `[inferred]`
- **Source:** node 910, added 2026-07-28
- **Requirement (as-built, now changing):** `sf_Test_Number__c` ("Test Number") duplicates `sf_BAT_Test_Number__c` ("Test # on Printout"). Added in the same 2026-07-28 pass that resolved the 2026-07-22 "test number doesn't persist" bug report — but added a second field instead of fixing the first, creating the duplication Chris flagged on the 2026-08-20 call.

### R4 — BAT-positive gated fields: DER notification + specimen ID + paperwork-sent `[inferred]` · **Must** · ~~DER gating superseded by CR-002 R14~~
- **Source:** node 910, added 2026-07-28
- **Requirement:** `sf_BAT_Positive__c` (Was the BAT positive?) gates, via native `config.conditional.simple`, the display of `sf_DER_Notified__c` (DER notified?) and `sf_DER_Notified_At__c` (DER Notified Date & Time, combined field — see Assumption A1). `sf_CCF_Number__c` (Specimen ID / CCF Number) and `sf_Paperwork_Sent_to_Delta__c` (Paperwork sent to Delta?) are always visible, not gated.
- **AC-4.1** — Given `sf_BAT_Positive__c == "Yes"`, when the form re-renders, then `sf_DER_Notified__c` and `sf_DER_Notified_At__c` become visible.

### R5 — Time-format conversion `[inferred]` · **Must** · ~~superseded by CR-002 R16~~
- **Source:** node 913
- **Requirement:** Converts `sf_Collector_Arrival_Time_Actual__c`, `sf_End_Time_Actual__c`, and `sf_BAT_Collection_Time_Actual__c` from 12h/24h select values to Salesforce's `HH:MM:SS.000Z` format. Writes each output through `setFormData`, `setTransformData`, and `setVariableValue` redundantly (belt-and-suspenders pattern, not a house-rule violation worth changing).

### R6 — Salesforce write-back via Connected Object 447 `[inferred]` · **Must**
- **Source:** node 911 (Data, salesforce) → node 912 (success screen)
- **Requirement:** All native form-field values on node 910 pass to Connected Object 447 by exact variable-name match — the same pattern as the Delta Post Accident tree's payload.

## 5. Data contract (reconstructed baseline)

| Name | Type | Set where | Default / fallback |
| :---- | :---- | :---- | :---- |
| `sf_Id` | text, read-only | node 910 (hidden value from query param) | — |
| `sf_Collector_Arrival_Time_Actual__c` / `sf_End_Time_Actual__c` | select → converted | node 910 → node 913 | — |
| `sf_FedEx_Tracking_for_ES_24_7__c` | text, required | node 910 | — |
| `sf_ATF_Number__c` | text, required | node 910 | — |
| `sf_BAT_Test_Number__c` | text ("Test # on Printout") | node 910 | — |
| `sf_Test_Number__c` | text ("Test Number") — **duplicate, removed by CR-001 R8** | node 910 | — |
| `sf_BAT_Result__c` | text | node 910 | — |
| `additional_paperwork` | file | node 910 | — |
| `sf_BAT_Collection_Time_Actual__c` / `_Time_Zone__c` | select → converted | node 910 → node 913 | — |
| `sf_BAT_Positive__c` | select (Yes/No) | node 910 | — |
| `sf_DER_Notified__c` | select (Yes/No), conditional on `sf_BAT_Positive__c==Yes` | node 910 | — |
| `sf_DER_Notified_At__c` | text (combined datetime), conditional on `sf_BAT_Positive__c==Yes` | node 910 | — |
| `sf_CCF_Number__c` | text ("Specimen ID / CCF Number") | node 910 | — |
| `sf_Paperwork_Sent_to_Delta__c` | select (Yes/No) | node 910 | — |

## 6. Integrations

| System | Alias | Direction | Trigger | Failure behavior |
| :---- | :---- | :---- | :---- | :---- |
| Salesforce (Quest UAT sandbox) | Connected Object 447 | out | form submit (node 910 → 911) | not observed/specified in tree JSON — **this is exactly where Chris's "nothing populates" bug (§9, R7) needs to be traced**, on the Salesforce side |

## 7. Edge cases & failure modes

- Collection over 8 hours where only urine testing applies — Chris flagged this on 2026-08-20 as a scenario that may need different required-field rules; explicitly not resolved yet (§9 Q2).
- No email is sent from this tree on submit — collector and Delta both rely on the two Delta Post Accident emails (sent earlier, at intake) for written confirmation; this tree's only visible feedback is the node 912 success screen.

## 8. Non-functional & compliance

- **PII/PHI**: breath-alcohol results, DER notifications, specimen/CCF IDs, and (pending CR-001) confirmation-test results all flow through this form and into Salesforce. Per workspace rules, this build and any live import are Brent-gated, not auto-approvable — this doc stops at "drafted," not "Ready for build."
- **UAT-timing consideration**: same flagship-deliverable UAT window as the Delta Post Accident tree.

## 9. Open questions

| # | Question | Blocking? | Asked of | Answer / date |
| :---- | :---- | :---- | :---- | :---- |
| Q1 | Full required-vs-conditional field matrix, including the >8h/urine-only scenario | **blocking for the required-flag portion of CR-001 only** — everything else in CR-001 is unaffected | Fahim / Chris (offline, per the call: "let us take probably the week") | open |
| Q2 | Is Salesforce Connected Object 447's field mapping correct for `sf_Collector_Arrival_Time_Actual__c` and the confirmation-test fields (R7)? Chris demonstrated a live session where none of this form's data reached Salesforce. Cannot be diagnosed from tree JSON alone — the native field names here look correct; the break is more likely on the Salesforce/Connected-Object side. | non-blocking for building the JSON changes, but blocking for confirming they actually fix Chris's bug | Rachel Kendrick (Quest SFDC admin) or a live SF trace | **CLOSED 2026-09-15** — not a mapping fault. The `DER Notified Date & Time` value was failing serialization and taking the whole payload down with it; removing the field restored every other field. See CR-002 R13. |
| Q3 | Does `sf_DER_Notified_At__c` (combined datetime) need to be split into separate date/time fields to match the original 2026-07-22 ask, or is the combined field acceptable? | non-blocking | Brent / Fahim | **ANSWERED 2026-09-17 (Brent direct)** — yes, split. Salesforce holds two fields. The 2026-07-22 ask for separate date and time was correct; the combined field built on 2026-07-28 is what broke the write. Assumption A1 is withdrawn. See CR-002 R13. |

## 10. Assumptions

- **A1** — ~~`sf_DER_Notified_At__c`'s combined-datetime format (vs. the originally-asked-for separate date/time fields) is preserved as currently built; not touched by CR-001 unless Q3 comes back otherwise.~~ **WITHDRAWN 2026-09-17** — Q3 came back otherwise. The combined field is the defect, not a harmless naming quirk. See CR-002 R13.
- **A2** — The "error blank results" field name from the call (item in R9 below) is assumed to mean a free-text field for noting when a confirmation result comes back blank/invalid, not a validation rule — confirm with Chris if that's wrong.

## 11. Traceability

| Req | Edit(s) | Test(s) | Status |
| :---- | :---- | :---- | :---- |
| R1–R6 | (baseline, no edits — reconstructed) | — | n/a |
| R8–R11 (CR-001) | R8 built 2026-09-03 (CR-007, tree claude.md) | TBD | R8 done; R9–R11 not started |
| R12 (layout) | none needed — CR-007 (2026-09-03) already built Chris's layout from his whiteboard photo; the 9/15 spreadsheet is the same layout | Stage A S7–S9 (order/ranks/labels unchanged) | **Verified 2026-09-17** |
| R13 (DER split) | **deferred by Brent 2026-09-17** — node 913 withholds the value from the payload instead | Stage A S16–S19 | Parked pending Q9 |
| R14 (ungate DER) | node 910 edits 1–2 | Stage A S10, S12 | **Built 2026-09-17** |
| R15 (keep confirmation gate) | no change | Stage A S11–S12 | **Verified 2026-09-17** |
| R16 (free-text times) | node 910 edits 4–7; node 913 `toSalesforceTime()` | Stage A S13–S14 + 21-case parser replay (AC-16.1–16.4) | **Built 2026-09-17** |
| R17 (ungate paperwork sent) | node 910 edit 3 | Stage A S10, S12 | **Built 2026-09-17** |

## 12. Change requests (amendments)

### CR-001 — Chris LeDoux's 2026-08-20 UAT feedback: remove duplicate field, add confirmation fields, flag SF mapping bug

| | |
| :---- | :---- |
| **Date agreed** | 2026-08-25 (drafted from call; awaiting Brent's confirmation to build) |
| **Requested by** | Christopher LeDoux (Quest), relayed by Marcus Torres / Fahim Ziyad |
| **Source** | Spiky meeting "Quest x Zingtree: Project Sync," 2026-08-20 |
| **Type** | Bug fix (remove duplicate field) + new fields (4) + investigation flag (Salesforce-side mapping) |
| **Status** | Drafted — **not Ready for build**: the required-flag portion needs Q1's answer; PII/PHI carve-out applies (§8) |

**Effect on the existing spec**
- Supersedes: R3 (the duplicate `sf_Test_Number__c` field is removed)
- Adds: R8–R11 (below)

#### R8 — Remove the duplicate "Test Number" field · **Must**
- **Source:** Chris, 2026-08-20 ("test number on printout is actually the same thing as test number down here... keep the test number on printout one")
- **Requirement:** Remove `sf_Test_Number__c` ("Test Number") from node 910. Keep `sf_BAT_Test_Number__c` ("Test # on Printout") as the single field. Chris's original 2026-07-22 complaint about this field "not persisting" is resolved by this removal, not by a separate persistence fix — if it still doesn't reach Salesforce after this, that's now covered by R7/Q2's mapping investigation instead.
- **AC-8.1** — Given the rebuilt form, when node 910 is inspected, then no field named `sf_Test_Number__c` (or labeled "Test Number") exists.

#### R9 — Add four confirmation fields, conditional on a positive BAT result · **Must**
- **Source:** Chris, 2026-08-20 ("confirmation test number, confirmation test time results and error blank results, along with the DER information... if BET was positive, then those should populate"); Fahim and Marcus confirmed these should be required when shown ("if it's selected... we want that to be required")
- **Requirement:** Add: confirmation test number (text), confirmation test time (time select, converted via node 913's same `toSalesforceTime()`), confirmation test results (text), and an "error/blank results" field (text — see Assumption A2). All four use the same `config.conditional.simple` gate on `sf_BAT_Positive__c == "Yes"` as the existing DER fields, and sit visually "below the DER notify" fields per Chris's description. **Required flag:** hold pending Q1 (§9) — Fahim/Chris are still finalizing which fields are required in which scenarios; do not mark these `required: 1` until that comes back, even though the call leaned toward "yes, required when shown."
- **AC-9.1** — Given `sf_BAT_Positive__c == "Yes"`, when the form re-renders, then all four new fields become visible, positioned after the existing DER fields.
- **AC-9.2** — Given `sf_BAT_Positive__c != "Yes"` (or unanswered), when the form renders, then none of the four new fields are visible or required.

#### R10 — Salesforce field-name confirmation for the new fields · Non-blocking, house pattern
- **Source:** house pattern (per `delta-post-accident-requirements.md` R13/A3-style caution) — new SF fields need creating/confirming in the sandbox before wiring
- **Requirement:** Confirm exact Salesforce API names for the four new confirmation fields with Rachel Kendrick before this CR ships, same as the 2026-07-22 field-map asks required.

#### R11 — Investigate why arrival time / confirmation data isn't reaching Salesforce · Flag, not a JSON build item
- **Source:** Chris, 2026-08-20 ("collector arrival time doesn't show up... nothing shows up down here now" after submitting the post-collection form twice)
- **Note:** The native fields on node 910 (`sf_Collector_Arrival_Time_Actual__c`, etc.) look structurally correct in the tree JSON — this doesn't look like a Zingtree-side defect the way the Delta Post Accident tree's damage-type fields were (see `delta-post-accident-requirements.md` CR-002 R24, which *is* a confirmed Zingtree-side bug). Recommend Rachel Kendrick trace Connected Object 447's field mapping directly in Salesforce rather than building a speculative JSON fix.

**Open questions**
| # | Question | Blocking? | Asked of | Answer / date |
| :---- | :---- | :---- | :---- | :---- |
| Q1–Q3 | See §9 (doc-level, apply to this CR) | Q1 partially blocking (required-flag portion only) | — | open |

**Regression risk**
- Re-test the existing DER-notified conditional fields after R9 lands alongside them, since both share the same `sf_BAT_Positive__c` gate and sit on the same screen.
- Confirm removing `sf_Test_Number__c` (R8) doesn't orphan any Salesforce field mapping that was pointed at it specifically (separate from `sf_BAT_Test_Number__c`) — ask Rachel Kendrick before removing, not after.

## 13. Document change log

| Date | Change | By |
| :---- | :---- | :---- |
| 2026-08-25 | Created — reconstructed baseline (R1–R6) from live tree `458535399`; CR-001 drafted (R8–R11) from Chris LeDoux's 2026-08-20 UAT call — not yet Ready for build (Q1 partially blocking, PII/PHI carve-out) | Requirements role, this session |
| 2026-09-17 | CR-002 appended (R12–R17) from the 2026-09-15 working session — Chris's two-column layout, the DER date/time serialization defect that was blocking the whole Salesforce write, and free-text times. Closes §9 Q2. | Requirements role, this session |
| 2026-09-17 | CR-002 built (R12, R14–R17) against the 2026-09-08 export; Stage A passed (27 static checks + 21-case time-parser replay). R13 deferred by Brent — node 913 withholds the DER value from the payload so the rest of the write succeeds and the business logic is testable. Closes Q5. JSON + diff report in `Workflow JSONs/Quest Delta/`. Not imported live. | Builder role, this session |
| 2026-09-17 | R13 restated pre-build after Brent identified the actual root cause: Salesforce stores the DER notification as two fields (Date + Time), and the single combined Zingtree field was never formatted for either. Closes §9 Q3 and CR-002 Q4; withdraws §10 A1; opens Q9 and Q10. Not Ready for build: Q5, Q9, Q10 blocking. | Requirements role, this session (Brent direct) |

---

### CR-002 — 9/15 working session: Chris's two-column form layout, DER date/time API failure, free-text times

| | |
| :---- | :---- |
| **Date agreed** | 2026-09-15 (working session); recap circulated 2026-09-16 |
| **Requested by** | Christopher Le'Doux (Client Service Rep II, Quest), with Emily James / Fahim Ziyad on the call |
| **Source** | Gmail "Zingtree: Delta Implementation and Post-Collection Integration Follow-Up" (Marcus Torres, 2026-09-16); Gmail "Zingtree Observations 4" (Chris Le'Doux, 2026-09-15); Gmail "FW: Post Collection Flow" (Chris Le'Doux, 2026-09-15 — `Post Collection Flow.xlsx`, originally sent 2026-08-13); Brent's "Quest Issue Tracker 9/15" Google Doc |
| **Type** | Bug / defect + change to existing behavior |
| **Status** | **Built 2026-09-17, Stage A passed, pending Brent's approval + teammate review** — R12/R14/R15/R16/R17 delivered; R13 deferred by Brent (payload withholding in place, see Q9). Not imported live: PII/PHI carve-out per §8. |

> **Transcript note:** Spiky failed to process the 2026-09-15 "Quest x Zingtree: Project Sync" (`8bde2ce7-5eee-454e-b30e-61c066fc6fcb`, status `UPLOAD_ERROR`) — there is no transcript for this call. Every quote below is sourced from written artifacts (email, Chris's spreadsheet, Brent's own notes), not from the call audio. Items attributed to the call itself come from Marcus's written recap and are marked as such.

**The ask (verbatim)**

> "On the Post-Collection details, I am unable to put in an exact time that isn't within 15min increments." — Chris Le'Doux, Zingtree Observations 4, 2026-09-15

> "At this time, no changes made to the post-collection details form and the details do not post to the salesforce page." — Chris Le'Doux, Zingtree Observations 4, 2026-09-15

> "DER Notified Date & Time is causing API failures due to formatting" — Brent, Quest Issue Tracker 9/15

> "The highlight was when Brent identified that the DER notified date/time field was causing API serialization errors preventing your post-collection data from syncing to Salesforce. Once we temporarily removed that field, BAT results, collection time, ATF number, and CCF number all started populating correctly." — Marcus Torres recap, 2026-09-16

> "Restructure the post-collection form according to your Excel specifications, with conditional display of confirmation test fields only when BAT results are positive" — Marcus Torres recap, 2026-09-16

**Interpretation**

One defect is the root cause of Chris's "nothing posts to Salesforce" report: the `DER Notified Date & Time` field's value breaks serialization on the Connected Object 447 request, so the whole payload fails and *no* field lands — not just that one. Separately, Chris's spreadsheet is now the authoritative layout for node 910, and it differs from the as-built form in which fields are conditional. Third, the 15-minute time selects do not satisfy the legal-compliance requirement to record exact times, so they become free text with normalization.

This CR closes the long-open Q2 (§9) — the "is the Connected Object mapping wrong?" question. It was not a mapping problem. The mapping is fine; one malformed value was failing the request.

**Effect on the existing spec**

- **Supersedes:** R2 and R5 (time capture — selects replaced by free text + normalization); R4 (the DER conditional gate is removed)
- **Amends:** R1 (field order and two-column layout now specified, not incidental)
- **Answers:** §9 Q2 — root cause identified as the DER date/time value, not Connected Object 447's mapping. Q2 is closed by R13.
- **Adds:** R12–R17 (below)
- **Unaffected:** R6 (Connected Object 447 write-back pattern), R8 (duplicate Test Number removal, CR-001), R10 (SF API-name confirmation still outstanding for the CR-001 fields)
- **Not in this doc:** three items from the same call belong to the Delta Post Accident tree, not this form — see "Out of scope" below

---

#### R12 — Node 910 field order and two-column layout follow Chris's spreadsheet · **Must**

- **Source:** `Post Collection Flow.xlsx` (Chris Le'Doux, re-sent to Brent 2026-09-15); "Restructure the post-collection form according to your Excel specifications" — Marcus recap, 2026-09-16
- **Requirement:** Node 910 renders at `form_columns: 2` with fields in exactly this left-to-right, top-to-bottom order:

| Row | Left column | Right column |
| :---- | :---- | :---- |
| 1 | ATF # | Test # on Printout |
| 2 | BAT Time | BAT Time Zone |
| 3 | BAT Results | Positive BAT? |
| 4 | DER Notified? | DER Notified Date & Time |
| 5 | Confirmation Test # | Confirmation Test Time |
| 6 | Confirmation Results | Air Blank Results |
| 7 | CCF # | FedEx Tracking # |
| 8 | Paperwork Sent to Delta? | Time and Date Paperwork Sent |
| 9 | Arrival Time | Departure Time |

- **Note:** Two fields on the as-built form are absent from Chris's sheet and are retained: `sf_Id` (hidden, rank 1 — carries the Salesforce Event ID from the query param) and `additional_paperwork` (file upload, placed last, after row 9). Neither is a visible labeled field in Chris's layout, so neither contradicts it.
- **AC-12.1** — Given node 910 renders, when the visible labeled fields are read in DOM order, then they match the table above exactly, with no field inserted, reordered, or omitted.
- **AC-12.2** — Given node 910 renders at desktop width, when the form is displayed, then fields appear in two columns, pairing each row above.

#### R13 — DER notified date/time must be split into the two Salesforce fields and formatted for each · **Must**

- **Source:** "DER Notified Date & Time is causing API failures due to formatting" — Brent, Quest Issue Tracker 9/15. **Root cause corrected by Brent direct, 2026-09-17:** *"it is a datetime field across 2 separate fields in Salesforce, the api errored because I am not formatting the value correctly."*
- **Correction note:** this requirement was first drafted on 2026-09-17 as a single-field normalization problem, before Brent identified the actual cause. Restated same day, pre-build. The earlier framing (normalize one value into one field) would not have fixed it.
- **Requirement:** Salesforce holds the DER notification as **two** fields — a Date and a Time — while node 910 captures it in **one** free-text field (`DER_Notified_Date_and_Time__c`). Connected Object 447 matches by exact variable name, so a single combined value has no correctly-typed target and fails serialization, taking the whole payload with it. Node 913 must parse the entered value, split it, and write **two** separate variables named for the two Salesforce fields, each formatted for its own type: the date as Salesforce's date format and the time via the same `toSalesforceTime()` path the other time fields use. The combined field is not sent to Salesforce.
- **Requirement (agent-facing):** the collector keeps entering one value. The split is a build concern, not a form-layout change — Chris's sheet shows one field in row 4 right, and R12's layout is unaffected.
- **AC-13.1** — Given `09/15/2026 3:45 PM` entered in DER Notified Date & Time, when the form is submitted, then the Salesforce date field receives `2026-09-15` and the Salesforce time field receives `15:45:00.000Z`, and the request succeeds.
- **AC-13.2** — Given the same submission, when the Connected Object 447 payload is inspected, then `DER_Notified_Date_and_Time__c` is not present in it as a Salesforce-bound value.
- **AC-13.3** — Given a value that cannot be parsed into both a date and a time, when the form is submitted, then neither derived field is sent, the request still succeeds, and every other field on the form lands in Salesforce.
- **AC-13.4** — Given the DER field is left empty, when node 911 fires, then no empty-value serialization error occurs and the rest of the payload lands.
- **AC-13.5** — Given a successful submission, when the Salesforce Event record is opened, then BAT results, collection time, ATF number and CCF number are all populated — the four fields Marcus's recap confirmed started working once the DER field was removed.

#### R14 — DER Notified? and DER Notified Date & Time are always visible · **Must**

- **Source:** `Post Collection Flow.xlsx` — Chris annotates `<If results were positive` against **rows 5 and 6 only** (Confirmation Test # / Time, Confirmation Results / Air Blank Results). Row 4 (DER Notified? / DER Notified Date & Time) carries no such annotation.
- **Requirement:** Remove the `config.conditional.simple` gate on `sf_BAT_Positive__c == "Yes"` from `sf_DER_Notified__c` and `DER_Notified_Date_and_Time__c`. Both render unconditionally. This supersedes R4, which gated them.
- **Rationale:** DER notification can be required for reasons other than a positive BAT (e.g. a refusal or a shy-bladder outcome); gating it on a positive BAT hides the field in cases where the collector still needs to record it. Chris's sheet reflects that.
- **AC-14.1** — Given node 910 renders with `sf_BAT_Positive__c` unanswered or set to `No` or `NA`, when the form is displayed, then DER Notified? and DER Notified Date & Time are both visible.

#### R15 — The four confirmation fields stay gated on a positive BAT · **Must**

- **Source:** `Post Collection Flow.xlsx` — `<If results were positive` on rows 5 and 6; "conditional display of confirmation test fields only when BAT results are positive" — Marcus recap, 2026-09-16
- **Requirement:** `sf_BAT_Confirmation_Test_Number__c`, `sf_BAT_Confirmation_Time_Actual__c`, `sf_BAT_Confirmation_Result__c` and `sf_BAT_Air_Blank_Result__c` remain gated on `sf_BAT_Positive__c == "Yes"`. This restates and confirms CR-001 R9 against Chris's written layout — no change to the as-built behavior, recorded here so the build has an explicit requirement to test against.
- **AC-15.1** — Given `sf_BAT_Positive__c == "Yes"`, when the form re-renders, then all four confirmation fields become visible in rows 5–6.
- **AC-15.2** — Given `sf_BAT_Positive__c` is `No`, `NA`, or unanswered, when the form renders, then none of the four are visible, and none are submitted to Salesforce.

#### R16 — Time fields accept exact free-text times, normalized before the Salesforce write · **Must**

- **Source:** "I am unable to put in an exact time that isn't within 15min increments" — Chris, Observations 4, 2026-09-15; "Time selections (start & end) should be free text and encourage format: **2:04 PM**" / "Need a script to normalize this timestamp so it goes into SFDC correctly" — Brent, Quest Issue Tracker 9/15; "Implement free text time input with normalization to support exact times beyond 15-minute increments for legal compliance requirements" — Marcus recap, 2026-09-16
- **Requirement:** Replace the 15-minute `select` dropdowns with free-text inputs on `sf_Collector_Arrival_Time_Actual__c` (Arrival Time), `sf_End_Time_Actual__c` (Departure Time) and `sf_BAT_Collection_Time_Actual__c` (BAT Time). Each carries help text prompting the `2:04 PM` format. Node 913's existing `toSalesforceTime()` is extended to parse free-typed input and emit Salesforce's `HH:MM:SS.000Z`. `sf_BAT_Confirmation_Time_Actual__c` (Confirmation Test Time) is also a 15-minute select today — see Q5.
- **Requirement (tolerance):** Normalization accepts, at minimum: `2:04 PM`, `2:04pm`, `02:04 PM`, `14:04`. It must not silently produce a wrong time from an unparseable value.
- **AC-16.1** — Given `2:04 PM` typed into Arrival Time, when the form is submitted, then Salesforce receives `14:04:00.000Z`.
- **AC-16.2** — Given `14:04` typed into Departure Time, when the form is submitted, then Salesforce receives `14:04:00.000Z`.
- **AC-16.3** — Given an unparseable value such as `this afternoon`, when the form is submitted, then the value is not silently coerced to a wrong time, and the rest of the payload still lands (same guard as AC-13.2).
- **AC-16.4** — Given a time not on a 15-minute boundary (e.g. `2:04 PM`), when the form is submitted, then it is preserved exactly — this is the compliance requirement driving the change.

#### R17 — Time and Date Paperwork Sent is ungated · **Should**

- **Source:** `Post Collection Flow.xlsx` — row 8 right, annotated `<Good Idea?` (Chris's own suggestion, not a conditional marker)
- **Requirement:** `sf_Paperwork_Sent_Date_Time__c` currently renders only when `sf_Paperwork_Sent_to_Delta__c == "Yes"`. Chris's sheet shows it as a plain row-8 field with no conditional annotation, so the gate is removed and it renders unconditionally alongside Paperwork Sent to Delta?.
- **Note:** This field also carries a free-typed date/time and therefore the same serialization exposure as R13 — normalize it on the same path, or it becomes the next payload-killer.
- **AC-17.1** — Given node 910 renders, when Paperwork Sent to Delta? is unanswered, then Time and Date Paperwork Sent is still visible.
- **AC-17.2** — Given a date/time entered there, when the form is submitted, then the Connected Object 447 request succeeds.

---

**Out of scope for this doc (Delta Post Accident tree, `683028422`)**

These three came out of the same 9/15 session and Brent's issue tracker but belong to the post-accident tree's requirements doc, not this form. Recorded here only so they are not lost:

1. Remove the duplicate "Additional Notes" block from both the "Delta: Incident Summary" and "Delta Airlines Event Information" emails — keep only "What Happened/Notes (Send to Delta)". *(Chris, Observations 4: "Additional notes and What Happened notes are the same.")*
2. For multiple selected damage categories, produce **one** concise what-happened sentence rather than one per category, and show each agent-selection description once per selected category. *(Chris: "having an explanation for each damage isn't necessary. Just one explanation is what we usually need.")*
3. Clear prior selections on restart — Chris found altered options persisted through refresh and re-send. *(Chris: "The options are set in stone until I make another event.")*

Also out of scope here: the supervisor / donor / employee detail fields from Marcus's recap. Chris reports employee details reaching the emails but not Salesforce — those fields are captured in the post-accident tree, so the defect and any new fields belong to that doc. Confirm with Brent before either doc claims them.

**Edge cases introduced**

- A collector who enters a DER notified date/time but leaves Positive BAT as `No` — now reachable for the first time under R14, and must still serialize (AC-13.1).
- Free-text time entered with no AM/PM and an hour ≤ 12 (`2:04`) — ambiguous; normalization must have a stated rule rather than guessing. Flagged as Q6.
- A submission where every optional field is blank — must still write successfully (AC-13.3).

**Open questions**

| # | Question | Blocking? | Asked of | Answer / date |
| :---- | :---- | :---- | :---- | :---- |
| Q4 | What is the Salesforce field behind `DER_Notified_Date_and_Time__c`? | — | Brent | **ANSWERED 2026-09-17 (Brent direct)** — it is not one field. Salesforce stores the DER notification as a separate Date field and Time field; the API errored because the combined value was not being formatted for either. See R13 as restated. |
| Q9 | What are the two exact Salesforce API names — the DER notify **date** field and the DER notify **time** field? R13 writes two variables matched by name against Connected Object 447, so both must be exact. | **BLOCKING** for R13 | Brent, or Rachel Kendrick if not already known | open |
| Q10 | Does `sf_Paperwork_Sent_Date_Time__c` (R17) have the same shape — one Zingtree field against two Salesforce fields? If so it needs the same split, and it is the next payload-killer once R13 lands. | **BLOCKING** for R17 | Brent / Rachel Kendrick | open |
| Q5 | Does Confirmation Test Time become free text too? | — | Brent | **ANSWERED 2026-09-17 (Brent direct)** — yes, free text like the other three. Its positive-BAT conditional is retained. |
| Q6 | Free-text time with no AM/PM (`2:04`) — interpret as 24-hour, assume PM, or reject and prompt? | non-blocking (assumption A3 below ships if unanswered) | Chris Le'Doux | open |
| Q7 | Chris's sheet asks: "Make mandatory to fill all of the sections?" This is the same question as §9 Q1, still with Fahim/Chris since 2026-08-20. No `required` flag changes in this CR until it comes back. | non-blocking for this CR (nothing changes without the answer) | Fahim Ziyad / Chris Le'Doux | open since 2026-08-20 |
| Q8 | Mobile device link access — Marcus's recap commits to gathering device types, email providers and error patterns. Not a build item yet; may become one. | non-blocking | Chris Le'Doux / Quest collectors | open |

**Assumptions**

- **A3** — Absent an answer to Q6, a free-typed time with no meridiem and an hour of 1–12 is interpreted as **24-hour** (so `2:04` = 02:04), on the grounds that silently assuming PM can misstate a legally-reportable time by twelve hours. Revisit if Chris says otherwise.
- **A4** — Chris's spreadsheet supersedes the as-built conditional flags wherever the two disagree, because Marcus's recap commits to building "according to your Excel specifications." Confirmed with Brent 2026-09-17.

**Regression risk**

- R14 removes a conditional gate that R4 established and CR-001 R9 re-tested against. Re-run AC-4.1 and CR-001's AC-9.1/9.2 after this build — the confirmation fields share the same `sf_BAT_Positive__c` variable, and it is easy to strip one gate and take the other four with it.
- R16 rewrites `toSalesforceTime()` in node 913, which currently serves three fields (and possibly four, per Q5). A parsing change that breaks one breaks all of them. Every time field needs its own path test, not one representative case.
- R13's fix must be verified by a **successful end-to-end write**, not by inspecting the JSON. The whole reason this defect survived from 2026-08-20 to 2026-09-15 is that the tree looked structurally correct (logged as Q2, "probably a Salesforce-side mapping problem") while a single value was failing the request. Static analysis would not have caught it and will not confirm the fix.
- CR-001 R8 (remove the duplicate `sf_Test_Number__c`) is still unbuilt and touches the same node. Sequence it with this CR rather than shipping them separately.

