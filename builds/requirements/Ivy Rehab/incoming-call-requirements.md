# Incoming Call — Requirements

**Account:** Ivy Rehab
**Tree:** Incoming Call — `632727963` (org `605418`)
**Owner:** Brent Thomas
**Created:** 2026-09-17

This tree already exists in production. This document covers **only the changes requested on
2026-09-14/16/17**; it is not a retrospective spec of the existing flow. Nothing outside the
numbered change requests below is to be touched.

---

## Context

Ivy's Patient Engagement Center is creating duplicate leads in Raintree (Case `#116734`,
Ivy-side Jira `IT-573` is a separate insurance item). Two independent causes were identified
on the 2026-09-14 Raintree/Ivy/Zingtree call and in the "Raintree Duplicate Lead Issue"
thread:

1. Zingtree calls `POST /lead` blind and treats the failure as "lead already exists". When
   the create succeeds for a patient who already has a lead, a duplicate is written. Node 127
   is the router that grades this.
2. Raintree only suppresses a duplicate when the **case type** matches the existing lead.
   Bethany Scott (Ivy), 2026-09-11: *"in all the records where we see duplicates, there is no
   case type being sent over. If the case types match the already existing lead — then it
   would not create the duplicate."* and *"Case type would be `primaryReason` in the API."*
   The current Create Lead payload sends neither `primaryReason` nor `disciplines`.

Commitment on the clock: Aksana Koch to Liz Barton, 2026-09-17 — *"We expect to have the
updates available by end of day today or early tomorrow."*

---

## Reference — current create-lead path (unchanged by this document)

```
100 Combined Summary  --[Create Lead]-->  105 Submit Data to Raintree (Script)
  -> 107 Raintree - Create Lead (Data: get_token 1021 + raintree__create_lead 1067)
  -> 126 Is Lead Created? (Script)   -> 127 Is Lead Created Success? (Scoring)
        isLeadSuccess == true  -> 128 Format Lead Comments -> 130 Lead Created Successfully
        default                -> 129 Lead Already Exists
```

---

## Connected Objects

### Existing, unchanged

| Alias | Id | Method | Endpoint |
| :---- | :-- | :----- | :------- |
| `get_token` | 1021 | POST | `https://api.raintree.cloud/token` |
| `raintree__create_lead` | 1067 | POST | `https://api.raintree.cloud/lead` |

Standard Raintree headers on every call: `client: Zingtree_9892`,
`Authorization: Bearer ${actions.get_token.access_token}`, `Content-Type: application/json`.

### CO-1 — new: `raintree__find_leads`

| | |
| :-- | :-- |
| Name | Raintree - Find Leads |
| Alias | `raintree__find_leads` |
| Source | same HTTP connector as `raintree__create_lead` |
| Method | Retrieve (GET) |
| Endpoint | `https://api.raintree.cloud/lead` |
| Cache TTL | `0` — a stale cached hit would defeat the whole pre-check |
| Headers | `client: Zingtree_9892`, `Accept: application/json`, `Content-Type: application/json`, `Authorization: Bearer ${actions.get_token.access_token}` |
| Query params | `firstName: ${patient_first_name}`, `lastName: ${patient_last_name}`, `dob: ${lead_search_dob}`, `limit: 5` |

Response (root is an object, so no `.value` wrapping):

```json
{ "count": 1, "records": [ { "id": "1XS42SF3O34", "pn": "0000001", "firstName": "Ted",
  "lastName": "Lasso", "dob": "01-20-1990", "primaryReason": "HIP",
  "disciplines": ["PT","OT"] } ], "page": 1, "isMore": false }
```

`dob` on the **query string** is ISO `yyyy-mm-dd`; `dob` **inside a record** is `MM-DD-YYYY`.
The tree holds `patient_dob` as `MM/DD/YYYY`. Hence the separate `lead_search_dob` variable in
CR-2.

### CO-2 — new: `raintree__get_disciplines`

| | |
| :-- | :-- |
| Name | Raintree - Get Disciplines (DPAY) |
| Alias | `raintree__get_disciplines` |
| Method | Retrieve (GET) |
| Endpoint | `https://api.raintree.cloud/customtables/DPAY` |
| Cache TTL | `86400` — a lookup table, safe to cache for a day |
| Headers | as CO-1 |
| Query params | none |

### CO-3 — new: `raintree__get_case_types`

| | |
| :-- | :-- |
| Name | Raintree - Get Case Types (CASET) |
| Alias | `raintree__get_case_types` |
| Method | Retrieve (GET) |
| Endpoint | `https://api.raintree.cloud/customtables/CASET` |
| Cache TTL | `86400` |
| Headers | as CO-1 |
| Query params | none |

Both custom-table calls return:

```json
{ "count": 1, "tables": [ { "code": "PT", "description": "Physical Therapy",
  "desc2": "", "desc3": "", "desc4": "", "filter": "" } ] }
```

`CASET` is confirmed as the case-type table by the Raintree Create Lead spec, which annotates
`"primaryReason": "HIP - CASET custom table"` and `"disciplines": ["PT - DPAY custom table"]`.
This resolves the "exact table name unconfirmed" note from the 9/14 transcript.

### CO-4 — update: `raintree__create_lead` (1067)

Two keys appended to the existing JSON body. **Nothing else in the body changes.**

```json
  "primaryReason": "${lead_primary_reason}",
  "disciplines": ${lead_disciplines_json}
```

`disciplines` is unquoted because `lead_disciplines_json` carries a serialised JSON array
(e.g. `["PT"]`). `lead_primary_reason` is a plain string.

---

## Change requests

### CR-1 — Search for an existing lead before creating one

**Requirement.** Before `POST /lead` runs, the tree queries `GET /lead` by first name, last
name and date of birth. If a lead already exists, the create call is skipped entirely and the
agent lands on the existing "Lead Already Exists" screen (node 129). If no lead exists, the
flow proceeds to the create call exactly as it does today.

**Rationale.** Replaces the create-and-catch-the-failure pattern. Indhu Lakshman (Raintree)
confirmed on the 2026-09-14 call that lead search by first/last/DOB is live; search by phone
is not.

**Acceptance criteria.**

| # | Given | Then |
| :- | :---- | :--- |
| 1.1 | A lead exists for the patient's first name, last name and DOB | `raintree__create_lead` is **not** called; the agent sees node 129 "Lead Already Exists" |
| 1.2 | No lead exists | `raintree__create_lead` is called exactly once; behaviour from node 126 onward is byte-identical to today |
| 1.3 | The search call returns a non-2xx | The tree falls through to the create call (fail-open), so a search outage cannot block scheduling |
| 1.4 | `patient_dob` is `MM/DD/YYYY` | The search sends `dob` as `YYYY-MM-DD` |
| 1.5 | Any path | Node 127's existing buttons, expression and targets are unchanged |

**Deliberately not changed.** Node 126's grading of `actions.raintree__create_lead.success`
and node 127's router stay exactly as they are — they remain the safety net for the case where
a lead is created between the search and the create.

### CR-2 — Send Therapy Type and Primary Reason on the lead

**Requirement.** The Create Lead payload carries `disciplines` (Therapy Type, from the DPAY
custom table) and `primaryReason` (case type, from the CASET custom table), both resolved to
Raintree codes at run time rather than hard-coded.

**Rationale.** Kelsie Brimhall, 2026-09-16: *"Can you let us know when we have been able to
implement the changes in Zingtree to be able to send over: Therapy type - What are you here
for? / Primary Reason - Primary Reason"*. Raintree suppresses duplicates on matching case
type, so this is the second half of the duplicate fix.

**Source values already in the tree.** `therapy_type` ("What are you here for?"),
`specialty_needed_name`, `body_part`.

**Mapping rule.**

- `disciplines` — match `therapy_type` against DPAY, case-insensitively, on `description`
  first and then on `code`. Emit a one-element array of the matched `code`. No match → omit
  the key (send an empty array) rather than guess.
- `primaryReason` — match `body_part` against CASET on `description` then `code`. If
  `body_part` is empty, fall back to `therapy_type`. No match → empty string.

**Acceptance criteria.**

| # | Given | Then |
| :- | :---- | :--- |
| 2.1 | `therapy_type` = "Physical Therapy" and DPAY holds `{code: "PT", description: "Physical Therapy"}` | The payload carries `"disciplines": ["PT"]` |
| 2.2 | `body_part` = "Hip" and CASET holds `{code: "HIP", description: "Hip"}` | The payload carries `"primaryReason": "HIP"` |
| 2.3 | Neither table returns a match | `disciplines` is `[]` and `primaryReason` is `""`; the create call still fires and the rest of the payload is unchanged |
| 2.4 | Any path | Every other key in the Create Lead body is byte-identical to today |
| 2.5 | Ivy adds a row to DPAY or CASET | No Zingtree change is needed — the codes are read live |

### CR-3 — Pick the right lead, don't just say one exists

**Requirement.** When the search returns one or more leads, the agent sees every match and
selects the correct record in a Dynamic View. The selected lead's patient number then drives the
rest of the call; nobody types it by hand.

**Rationale.** CR-1 stopped the duplicate but left the agent on "Lead Already Exists", typing the
Patient Number manually with no sight of what Raintree actually holds. A patient with two leads
was still a guess.

**Design.**

```
5 Existing Lead Found?
    is_existing_lead == true -> 9  Select Existing Lead  (Content, Dynamic View grid)
    default                  -> 107 Raintree - Create Lead
9 -> 10 Apply Selected Lead (Script) -> 132 Get Patient Details
```

Node 10 reads `views.raintree__find_leads` and writes `patient_number` plus the `patient`
transform — the same two writes node 131 makes for the hand-typed paths. Node 131 stays as it is
for nodes 129, 130 and 136.

**Dynamic View config.** Tied to Connected Object `raintree__find_leads` (1288). Grid,
Selectable **on**, Multi-Select **off**. Fields, in order: `firstName`, `lastName`, `dob`,
`location`, `primaryReason`, `disciplines`, `createDateTime`. Inserted on node 9 from the editor
toolbar. `views.*` is keyed by the Connected Object alias, not a separate view name.

**Acceptance criteria.**

| # | Given | Then |
| :- | :---- | :--- |
| 3.1 | The search returns 2+ leads | All of them are listed; the agent picks one |
| 3.2 | The search returns exactly 1 lead | The picker still shows, and the agent confirms it. No auto-select — this binds the call to a patient record |
| 3.3 | A lead is selected | `patient_number` and `transforms.patient.pn` come from that lead's `pn`, and Get Patient Details runs against it |
| 3.4 | The agent continues without selecting | `patient_number` is empty, Get Patient Details 404s, node 134 routes to 136 Re-enter Patient Number — the existing bad-number path, no new guard |
| 3.5 | No lead exists | Unchanged: straight to Create Lead |

**Sequencing constraint.** A Dynamic View is only selectable once its Connected Object has
already run in a published workflow. `raintree__find_leads` has not. So CR-1/CR-2 import first,
the search runs once live, then the view is created and CR-3 imports.

**Deliberately not changed.** Nodes 129 and 130 keep their manual Patient Number field; they are
still reachable from node 127, which remains the backstop for a lead created between the search
and the create.

### CR-4 — Create the patient insurance in Raintree (built 2026-10-08)

**Source.** Ivy calls 2026-10-01 and 2026-10-08 (Kelsie Brimhall). Brent's decision 2026-10-08: run it in this tree, after the appointment, because it needs the patient number.

**Requirement.** After 141 (Search & Update Appointment): 162 stages the body values, 163 routes, 164 calls `get_token` + `raintree__create_patient_insurance` (1132), then 142. POST only when `patient_insurance_rt_code` (Schedule New Patient node 200) and `subscriber_id` are present. Insurance is sent by code only. `effectiveFrom` = Jan 1 of the current year. Node 151 grades the call (`patient_insurance_api_success`).

**Acceptance criteria.**

| # | Given | Then |
| :- | :---- | :--- |
| 4.1 | Accepted insurance + subscriber id, new patient | 2xx; insurance on the patient in Raintree with the selected code |
| 4.2 | No code (other region, not accepted, private pay) or no subscriber id | No request; 151 reports "No Request Made" |
| 4.3 | Patient already has an active insurance in Raintree | Raintree returns "overlapping with existing insurance" (seen on the 10/8 test); 151 flags an API failure |

---

## Open items

| # | Item | Owner | Blocking? |
| :- | :--- | :---- | :-------- |
| OI-1 | No captured sample of a live `GET /lead` or `GET /customtables/{id}` response from Ivy's **production** Raintree org. Fixtures are built from the published Raintree spec. | Brent — capture in Execution Insights on the first live run | No, but Stage A cannot prove response shape |
| OI-2 | Whether Raintree's duplicate rule matches on `primaryReason` alone or on `primaryReason` + `disciplines`. Bethany's note says case type. | Raintree (Indhu / Kevin Nguyen) | No |
| OI-3 | CO changes touch patient PII (name, DOB, insurance) and the Raintree credential chain. House rule requires teammate review before production. | Brent | Yes, for production |
| OI-4 | Returning patients with an active Raintree insurance get "overlapping with existing insurance" (4.3) and trip the API-failure email. Decide: skip for previous patients, or accept the failure. | Kelsie | No |
| OI-5 | Raintree date format: the sample body Brent was given has dob `2000-22-08` (year-day-month). Build sends yyyy-mm-dd. Confirm on the first live test. | Brent | No |

## Changelog

| Date | Change |
| :--- | :----- |
| 2026-10-08 | CR-4 appended — create patient insurance after the appointment (nodes 162–164, 151). |
| 2026-09-17 | CR-3 appended — Dynamic View lead picker replaces the bare "Lead Already Exists" jump. |
| 2026-09-17 | Document created. CR-1 and CR-2 written from the 9/14 Raintree call, the "Raintree Duplicate Lead Issue" thread and Kelsie's 9/16 "Integration Priorities" email. |
