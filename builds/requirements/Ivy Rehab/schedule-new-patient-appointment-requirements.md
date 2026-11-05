# Schedule New Patient Appointment — Requirements

**Account:** Ivy Rehab
**Tree:** Schedule New Patient Appointment — `227319134` (org `605418`)
**Owner:** Brent Thomas
**Created:** 2026-09-17

Covers **only** the insurance-dropdown change requested by Kelsie Brimhall on 2026-09-16, plus
the HSS advisory. Nothing else in the tree is to be touched.

---

## Reference — current insurance path (the part being changed)

```
119 What Benefits? (Content)
      [Insurance Accepted]      -> 187 Get Master Insurances (Data)
      [Insurance Not Accepted]  -> 150   (unchanged)
      [Medicaid Not Accepted]   -> 167   (unchanged)
      [Private Pay]             -> 150   (unchanged)

187 Get Master Insurances (Data: get_token 1021 + raintree__find_master_insurances 1214)
  -> 188 Handle response (Script)  -> 149 Initial Insurance Collect (Content)
```

Node 149 field `insurance_select` is a native dynamic select:

```json
{"filterable": true, "list_source_type": "dynamic",
 "list_dynamic_source": {"type": "actions",
   "variable": "raintree__find_master_insurances.records",
   "attributes": {"label": "concat_name", "value": "name"}}}
```

Node 188 today reshapes the Raintree master list and re-serves it under the same alias:

```javascript
let insurances = actions.raintree__find_master_insurances.records;
let filtered = insurances.map(item => ({ ...item, concat_name: item.code + " - " + item.name }));
ZT.setResponseData("raintree__find_master_insurances", { records: filtered });
```

That `setResponseData` indirection is what makes this change small: the dropdown's binding
never has to move.

---

## Connected Object

### CO-5 — existing: `alias_35` (`raintree-insurance-dev`, id 35)

| | |
| :-- | :-- |
| Source | `ivy-pec-api-dev` |
| Method | GET |
| Endpoint | `https://ivy-pec-apim-dev.azure-api.net/v1/raintree-insurance` |
| Query params | `cost_code: ${new_cost_code}` |
| Cache TTL | 3600 |

Jay Zisch redeployed this API; Lincoln Schaffer, 2026-09-10: *"The API now accepts either a
clinic cost code or phone number and returns the accepted-insurance list in the expected
format."* Kelsie Brimhall, 2026-09-10: *"the parameters would be for both supported `cost_code`
and `phone`."* Brent validated the response on 2026-09-14 (recorded by Liz Barton on IT-573).

Two changes to the object itself:

1. Add a second query parameter `phone: ${clinic_phone}` so the call works when a cost code is
   not in session. The API accepts either.
2. This tree's clinic cost code lives in `clinic_cost_code`, not `new_cost_code` — see CR-3.

**A near-duplicate object exists:** `test-insurance-dev` (id 1260, alias `testinsurancedev`)
points at `/v1/raintree_insurance` (underscore) with no uses. It is a scratch object; delete or
disable it once `alias_35` is confirmed, so nobody wires the wrong one.

---

## Change requests

### CR-3 — Feed the insurance pick list from the Ivy Azure API

**Requirement.** The `insurance_select` dropdown on node 149 is populated from the Ivy Azure
clinic-accepted-insurance API for the selected clinic, instead of the unfiltered Raintree
master insurance list.

**Rationale.** The master list shows every insurance Raintree knows about, including ones the
clinic does not accept — which is why node 119 and node 149 both have to print a
"not accepted at the selected clinic" warning panel. The Azure API returns the accepted list
for one clinic.

**Design.** Add `alias_35` to node 187 as an additional Connected Object alongside `get_token`
and `raintree__find_master_insurances`; rewrite node 188 to build the option list from the
Azure response and serve it under the existing alias. The dropdown binding, the field name and
every other field on node 149 are untouched.

**Acceptance criteria.**

| # | Given | Then |
| :- | :---- | :--- |
| 3.1 | The clinic's cost code is in session | `alias_35` is called once with that cost code |
| 3.2 | The Azure API returns a list | `insurance_select` lists exactly those insurances, `code - name` as the label and the insurance name as the value |
| 3.3 | The Azure API returns nothing or a non-2xx | The dropdown falls back to the Raintree master list, so the agent is never left with an empty picker |
| 3.4 | Any path | Node 149's other 15 fields, its two buttons and node 119's four buttons are unchanged |

### CR-4 — Show the dropdown only for Brooklyn and Charlotte

**Requirement.** The Azure-backed dropdown is shown only when the clinic belongs to the
Brooklyn or Charlotte region. Every other region keeps today's behaviour exactly.

**Rationale.** Kelsie Brimhall, 2026-09-16: *"Add in logic/routing to show the dropdown for
only the Brooklyn and Charlotte regions."* This is a staged rollout, not a filter on the
insurance list.

**Acceptance criteria.**

| # | Given | Then |
| :- | :---- | :--- |
| 4.1 | The clinic is in the Brooklyn or Charlotte region | The Azure-backed list is shown |
| 4.2 | Any other region | The Raintree master list is shown, as today |
| 4.3 | The region cannot be determined | Treat as "other region" — fail to today's behaviour, never to an empty list |
| 4.4 | Ivy extends the rollout to a third region | One value added to one list in one script |

**Blocked on OI-4.** There is no region or territory field anywhere in either tree, in the
`clinicinfoprod` response as this tree consumes it, or in any of the source threads. Nobody has
ever stated how a clinic maps to a region.

**Documented interim.** The build ships a single `REGIONS_WITH_AZURE_INSURANCE` list and a
`clinic_region` variable read with `ZT.getVariableValue("clinic_region", "")`. Until the region
source is confirmed the variable resolves empty, so 4.3 applies and every clinic keeps today's
behaviour — the change is inert in production until one line names the real source field.

### CR-5 — HSS nearby-clinic filtering (advisory only — not built)

Kelsie Brimhall, 2026-09-16: *"Set up logic so that when the advocate selects that the patient
was referred specifically to an HSS clinic that only HSS nearby options show"* and
*"Add in logic based on the response from node 191 in Schedule New Patient."*

What already exists:

- Node 189 "Gather Doctor Info" has a conditional radio `referred_to_hss` — *"Were you referred
  specifically to an HSS COE Clinic?"* — shown when `name` contains `HSS`.
- Node 190 "HSS COE Logic" is a Scoring node routing `name cont HSS` → 191, default → 120.
- Node 191 "Referred to HSS" sets a second radio, `hss_referred` (Yes/No), then goes to 120.

So the flag Kelsie wants to branch on is `hss_referred` from node 191 (and, redundantly,
`referred_to_hss` from node 189 — two variables for one fact, which should be collapsed to one
before anything routes on it).

The nearby-clinic list is not built in this tree. It comes from the shared clinic tree
`787613344` via nodes 65, 66 and 177 (`Get Nearby Peds Clinics Results Table`,
`Get Nearby Peds Clinic Info`). Filtering to HSS-only therefore means a change in
`787613344`, not here, and it needs a way to identify an HSS clinic in the clinic list
response — see OI-5. **No build in this document.** Recommendation for the reply to Kelsie is
in the delivery note.

### CR-6 — Static insurance list, one dropdown with routing, insurance sent by code (built 2026-10-08)

**Source.** Kelsie Brimhall, Ivy calls 2026-10-01 and 2026-10-08 ("Zingtree Insurance Integration", Spiky). Kelsie's code list (screenshot, 2026-10-08). Target go-live: Monday 2026-10-12 (Kelsie).

**Requirement.**

1. The insurance list is a static list of Ivy's accepted insurances (code + display name) declared once in node 188, until the SharePoint API returns codes (CR-7). It replaces the Raintree master-insurance call (node 194 removed).
2. Brooklyn / Charlotte calls get one screen (node 199) with one dropdown holding the accepted insurances plus *Insurance Not Accepted*, *Medicaid Not Accepted* and *Private Pay*, and one Continue button. Routing comes from the selection, not from four buttons (node 200 script + node 201 router). Every other region keeps node 119 unchanged.
3. Picking an accepted insurance goes to the details screen (149) with no second dropdown. Kelsie: *"if they selected an accepted insurance, it would go to this next page, where instead of having like the option of a dropdown... we just now enter the details."*
4. Only the Raintree code is sent; Raintree fills in the name. Kelsie: *"leave out the name and only do the code."* Confirmed by a live test on the call.
5. The selected code is stored as `patient_insurance_rt_code` (already on the Incoming Call summaries). It is blank on not-accepted / Medicaid / private-pay routes, so nothing is sent to Raintree for those.

**Acceptance criteria.**

| # | Given | Then |
| :- | :---- | :--- |
| 6.1 | Brooklyn / North Charlotte / South Charlotte clinic, agent picks an accepted insurance, Continue | Node 1 → 149; `patient_insurance_rt_code` = that code |
| 6.2 | Same regions, agent picks Insurance Not Accepted or Private Pay | Node 150; `patient_insurance_rt_code` blank |
| 6.3 | Same regions, agent picks Medicaid Not Accepted | Node 167; `patient_insurance_rt_code` blank |
| 6.4 | Any other region | Node 119 with its four buttons, no dropdown, as before 10/1 |
| 6.5 | Appointment created with an accepted insurance and a subscriber id | Incoming Call POSTs the patient insurance with `insurance.code` only (Incoming Call CR-4) |

**Notes.** Kelsie's list repeats 10009 Medicaid Advantage (MDA) and has no 10010; built with 10009 once. Accepted-list dropdowns on 119, 150 and 167 removed (they listed accepted insurances on not-accepted screens and would have sent a code to Raintree).

### CR-7 — Insurance selection future state (Jami Ritter, 2026-10-08): deferred, not for build

One dropdown with every insurance (accepted and not), routed by a status from SharePoint: accepted / not accepted with private pay / not accepted without private pay (Medicaid, end call) / managed (outcome TBD). Needs the SharePoint API to return name + code + status in one list. Full notes: `Account Management HQ/Ivy Rehab/Resources/insurance-selection-future-state-2026-10-08.md`. Estimate given: ~3 hours once the API is updated. **Do not build until Jami confirms the statuses and the API change.**

### CR-8 — Insurance status routing, Jami's flowchart (built 2026-10-13, interim status source)

**Source.** Jami Ritter, "Mix Management Flow oct2026.pdf" (email "Re: Meeting Availability", 2026-10-13) and the 2026-10-08 call (CR-7). Brent's decisions 2026-10-13: interim static status, "And lastly" line replaced, SNPA only (Insurance Inquiry later).

**Requirement.**

1. Node 184 asks WC / MVA / Neither. Neither goes to the region gate (198).
2. Brooklyn / Charlotte (node 199): "Will you be using insurance?" Yes / No; the insurance dropdown shows only on Yes. No routes to self-pay rates (150).
3. Every dropdown entry carries a status (node 188 `insurance_catalog`): accepted → 149 details; not_accepted_medicaid → 167 (end call); not_accepted_other → 3 (self-pay rates, schedule or end); managed → 6 (call back next month).
4. Interim: accepted = Kelsie's code list; not accepted = two catch-alls (Medicaid plan not listed / Other insurance not listed); no managed entries. The red not-accepted panel stays on 199 until real status data replaces the catch-alls.
5. Wording: 149 no-card help text (upload card to portal, self-pay until verified); closing line on 53 / 100 / 118 (welcome letter, portal log in, upload insurance and ID cards); 167 Medicaid text; 3 and 6 scripts per the flowchart.

**Acceptance criteria.**

| # | Given | Then |
| :- | :---- | :--- |
| 8.1 | Brooklyn/Charlotte, Yes, accepted insurance | 149; `patient_insurance_rt_code` = code |
| 8.2 | Brooklyn/Charlotte, No | 150; no code |
| 8.3 | Medicaid plan not listed | 167 → 34; no code |
| 8.4 | Other insurance not listed | 3 → 183 / 155 / 34; no code |
| 8.5 | An entry with status managed | 6 → 34 |
| 8.6 | Any other region, Neither | 119 unchanged (includes Private Pay) |

**Open.** Full insurance list with status per insurance (incl. managed), or SharePoint name + code + status (FS-1, FS-2). Insurance Inquiry tree gets the same pattern once the source is final.

### CR-9 — Jami's updated flowchart, applied to the live tree (built 2026-10-13)

**Source.** Jami Ritter, "Updated Flow" email with "Mix Management Flow oct2026.pdf" (2026-10-13 20:59 UTC), and the "Insurance Updates" call the same day (Spiky; Jami, Kelsie, Trish, Brent). Brent's decisions 2026-10-13: static status list now and SharePoint next; clinic-code gate fixed, ZZZ added.

**Why a CR-9.** The CR-8 build was never imported. The live export (125 nodes) has the CR-6 flow, Kelsie's later edits and Brent's clinic-code gate from the call. CR-9 is built on that export, not on the CR-8 file.

**Requirement.**

1. 184 asks WC / MVA / Neither. Neither goes to the gate (198).
2. The gate is by clinic code (`clinic_raintree_code`), not region. That covers 81 codes Kelsie sent on the call (Brooklyn, Long Island, South Charlotte, Virginia Beach, Northeast NJ), plus ZZZ, the test clinic. The match is case-insensitive.
3. 199 asks "Will you be using insurance?" with Yes/No radio buttons. No goes to self-pay (150). Yes shows the dropdown. Picking Other (10005) shows a required insurance-name box. The red not-accepted panel is removed.
4. The routing is CR-8's, from the status in 188: accepted → 149, not_accepted_medicaid → 167, not_accepted_other → 3, managed → 6. Other is treated as accepted.
5. On the dropdown path, 200 writes the selected insurance name to `patient_insurance_other`, so the Incoming Call summaries show code + name. For Other, the agent's typed name is kept.
6. 149 opens with "Perfect! I just need to gather a few more details. Do you have your insurance card available?" The card radio is first and the red panel is removed. The no-card help text is the upload-to-portal wording. 186 (secondary) is unchanged (Kelsie).
7. Wording: 3, 6 and 167 use the flowchart scripts. On 53, the last bullet is replaced with the welcome-letter / portal-upload text, and the old "And lastly…portal" line is removed because the new bullet covers it.

**Acceptance criteria.**

| # | Given | Then |
| :- | :---- | :--- |
| 9.1 | Dropdown clinic (any case), Neither, Yes, accepted insurance | 149; `patient_insurance_rt_code` = code; `patient_insurance_other` = label |
| 9.2 | Dropdown clinic, Neither, No | 150; no code |
| 9.3 | Medicaid plan not listed | 167 → 34; no code |
| 9.4 | Other insurance not listed | 3; no code |
| 9.5 | Other (10005) + typed name | 149; code 10005; typed name kept |
| 9.6 | ZZZ | Dropdown shown |
| 9.7 | Clinic not in the list | 119 unchanged |

Walk fixtures: `Workflow JSONs/Ivy Rehab/fixtures/snpa-v2.*.fixture.json`. All 7 pass.

**Open.** New York region clinic codes (Kelsie forgot them on the call). Statuses from SharePoint (name + code + status) once Kelsie has updated the Raintree Insurance list, and a captured response, replace the static catalogue. Managed has no entries until then. Trish is collecting private pay codes per state, which become accepted entries once the list comes from SharePoint. Incoming Call needs no change: 162 already POSTs `patient_insurance_rt_code`, and the summaries already print `patient_insurance_other`.

### CR-10 — Read the SharePoint "Raintree Insurance" cells as a string (built 2026-10-21)

**Source.** "Insurance Updates - PLEASE READ" (Jami Ritter / Brent, 2026-10-19): format `Plan name; code; Status;`, with the code slot left empty (`Plan name; ; Status;`) for clinics whose insurance stays in the appointment comments. "UPDATED - Insurance Updates" (Jami, 2026-10-21): Kelsie updated the cells for Parowan and Hurricane to test.

**Requirement.**

1. The tree calls `alias_35` (CO 35) once per call, before the insurance screens: 31 → 1 → 7 (Data) → 188.
2. Each `insurance_list` string is split on `;` into name, code, status. Status (any case): Accepted, Not Accepted - Medicaid, Not Accepted - All Other, Managed. Rows in the old name-only format or with any other status are left out.
3. A clinic with at least one parsed row gets the selection screen (199), whatever its clinic code. The clinic-code list and static catalogue stay as the fallback for rollout clinics not yet converted, and for a non-2xx from `alias_35`.
4. "Medicaid plan not listed" and "Other insurance not listed" are appended to every list.
5. An accepted row with a code sends that code to Raintree. An accepted row with an empty code sends nothing; the name goes to `patient_insurance_other` (summaries / appointment comments).
6. The secondary dropdown (186) lists accepted rows with a code only.
7. The dropdown value is the insurance name, not the code (several SharePoint plans share one Raintree code). The 199 typed-name box opens on "Other". Status is matched on its letters only, so an en dash, missing spaces or case don't matter; plain "Not Accepted" routes as All Other. A 2xx with no `insurance_list` reads as no rows.

**Acceptance.** Fixtures `snpa-v3.*` (10) and the 7 `snpa-v2.*` fixtures all pass on the new tree; `fixtures/snpa-v3.parser-stress.mjs` (62 checks: status variants, cell shapes, duplicate codes, response shapes, every route, the clinic gate, the real 48-name payload) passes.

**Live-only.** CO 35 Cache TTL is 3600, so a SharePoint edit can take up to an hour to show; set it to 0 for testing. CO 35 is the `-dev` Azure object (OI-7).

### CR-11 — Discipline dropdown on the specialty screen (built 2026-10-22)

**Source.** Kelsie Brimhall, "Re: Insurance Updates - PLEASE READ" (2026-10-21 23:53 UTC): move the Case Type API call (193 / 192) forward so the dropdown is on 173.

**Requirement.**

1. 159 (default) → 193 (get_token, case types, disciplines) → 173 → 174 → 175.
2. 173 carries `discipline_selection` (same name, label, optional), listing `actions.raintree__get_disciplines.tables` by code.
3. 192 is removed; 174 no longer writes `final_disciplines`.

**Acceptance.** `fixtures/snpa-v4.case-type-on-173.fixture.json` passes (path 159 → 193 → 173 → 174 → 175); all `snpa-v2` / `snpa-v3` insurance fixtures still pass.

---

## Open items

| # | Item | Owner | Blocking? |
| :- | :--- | :---- | :-------- |
| OI-4 | How a clinic maps to a region (Brooklyn / Charlotte). Needs a field name and its values, or a cost-code list. | Kelsie / Ivy IT | **Yes — CR-4 is inert until answered** |
| OI-5 | How an HSS clinic is identified in the nearby-clinic response. `name cont "HSS"` is what node 190 uses today; a real flag would be better. | Kelsie / Ivy IT | Yes, for CR-5 |
| OI-6 | No captured sample of the Azure API response. CR-3's field mapping (`code`, `name`) is inferred from what node 188 builds today. | Brent — Execution Insights on `alias_35` | **Yes — confirm before production** |
| OI-7 | `alias_35` is the `-dev` object against `ivy-pec-apim-dev.azure-api.net`. A production Azure object does not exist yet. | Ivy IT (Jay Zisch) | Yes, for production |
| OI-8 | `${clinic_phone}` is not set in this tree — it is an Incoming Call variable. If the phone parameter is to be used here, the seed script must carry it through. | Brent | No — cost code is the primary key |
| OI-9 | Kelsie's list has 10009 twice and no 10010. Confirm 10010. | Kelsie | No |
| OI-10 | SharePoint API returns insurance names without codes (used to return codes). Blocks replacing the static list (CR-7). | Kelsie / Liz (Ivy IT) | Yes, for CR-7 |

## Changelog

| Date | Change |
| :--- | :----- |
| 2026-10-22 | CR-11 appended (built): discipline dropdown moved onto 173, 192 removed. |
| 2026-10-21 | CR-10 appended (built): SharePoint insurance string parsed into the dropdown; data-driven rollout; static fallback. |
| 2026-10-13 | CR-9 appended (built): Jami's updated flowchart on the live export; clinic-code gate fixed; Other name box; 149 card-first. |
| 2026-10-13 | CR-8 appended (built): status routing from Jami's flowchart, interim static status. |
| 2026-10-08 | CR-6 appended (built) and CR-7 appended (deferred) from the 10/8 Ivy call. CR-3's Azure source and CR-4's region interim are superseded by CR-6 for the dropdown; region gate now reads `region`. |
| 2026-09-17 | Document created. CR-3, CR-4 and CR-5 written from Kelsie Brimhall's 2026-09-16 "Integration Priorities & Recommended Next Steps" email and the IT-573 thread. |
