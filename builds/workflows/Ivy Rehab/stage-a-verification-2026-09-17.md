# Stage A verification — Ivy Rehab, 2026-09-17

Static analysis and offline path testing for the two builds. Stage B (browser UI test in the
Zingtree preview) is attended and has not been run.

---

## 1. Change containment

| Tree | Nodes before | Nodes after | Untouched | Added | Modified | Removed | Renumbered |
| :--- | -----------: | ----------: | --------: | ----: | -------: | ------: | ---------: |
| Incoming Call `632727963` | 97 | 101 | **96 (95%)** | 4 | 1 | 0 | 0 |
| Schedule New Patient Appointment `227319134` | 118 | 120 | **115 (96%)** | 2 | 3 | 0 | 0 |

Root node unchanged in both. No broken links introduced in either. The only newly unreachable
node in each is the unlinked `claude.md` memory node, which is expected.

**Incoming Call — every change**

- `+` node 1 — Find Existing Lead `[Data]`
- `+` node 2 — Check Lead Search and Map Raintree Codes `[Script]`
- `+` node 5 — Existing Lead Found? `[Scoring]`
- `+` node 6 — claude.md `[Content, unlinked]`
- `*` node 105 — 5 lines appended (the ISO date for the search); `continuation_node_id` 107 → 1; `node_name` filled in

**Schedule New Patient Appointment — every change**

- `+` node 1 — Stage Clinic Code for Insurance Lookup `[Script]`
- `+` node 2 — claude.md `[Content, unlinked]`
- `*` node 119 — the "Insurance Accepted" button now targets node 1 instead of 187. The other three buttons are untouched.
- `*` node 187 — gained Connected Object `alias_35`; `node_name` filled in
- `*` node 188 — script rewritten (7 → 19 lines); retitled "Build Insurance Options"

## 2. Lint

`scripts/lint_tree.py`, before vs after:

| Tree | Errors before | Errors after | Warnings before | Warnings after |
| :--- | ------------: | -----------: | --------------: | -------------: |
| Incoming Call | 75 | **75** | 93 | 96 |
| Schedule New Patient Appointment | 138 | **138** | 105 | 106 |

**Zero new errors in either tree.** Every existing error is pre-existing: mostly
`project_node_id/display_order must equal the key`, which is true of ~73 and ~96 original nodes
respectively, plus pre-existing broken button links in Schedule New Patient. All four new nodes
satisfy the rule.

New warnings, all expected:

- `lead_search_dob`, `lead_disciplines_json`, `lead_primary_reason` — "written but never read".
  They are read by Connected Object bodies, which are not part of the tree export. Recorded in
  each tree's `claude.md` data dictionary, which is the documented answer to this warning.
- `Script 2` / `Script 188` — "reflexive normalization". `.trim().toLowerCase()` is deliberate:
  both match free text from one system (the agent's answer, the clinic's region) against values
  from another (Raintree's custom tables). Exact-case matching across two systems is the
  fragile option here.
- `get_token` now sits on one more Data node. It is the shared auth object and already sat on
  four; one request per node does not apply to a token refresh.

## 3. Offline walk — `scripts/walk.mjs`

Four fixtures, real script bodies executed over the real continuation graph.

### A — Incoming Call, no existing lead

`105 -> 1 -> 2 -> 5 -> 107 (create lead)`

```
PASS  raintree__find_leads called 1x
PASS  raintree__create_lead called 1x
PASS  form is_existing_lead == false
PASS  form lead_search_dob == "1990-01-20"      (from patient_dob 01/20/1990)
PASS  form lead_disciplines_json == "[\"PT\"]"  (therapy_type "Physical Therapy" -> DPAY PT)
PASS  form lead_primary_reason == "HIP"         (body_part "Hip" -> CASET HIP)
```

### B — Incoming Call, lead already exists

`105 -> 1 -> 2 -> 5 -> 129 (Lead Already Exists)` — terminal

```
PASS  raintree__find_leads called 1x
PASS  raintree__create_lead called 0x
PASS  form is_existing_lead == true
```

This is the duplicate fix proving itself: the create call does not fire.

### C — Schedule New Patient, Brooklyn clinic, Azure returns 2 accepted insurances

`119 -> 1 -> 187 -> 188 -> 149`

```
PASS  alias_35 called 1x
PASS  raintree__find_master_insurances called 1x
PASS  form new_cost_code == "A0111"

options served to insurance_select (2):
   10001 - Aetna      -> value: Aetna
   10004 - Medicare   -> value: Medicare
```

### D — Schedule New Patient, other region, Azure returns 500

`119 -> 1 -> 187 -> 188 -> 149`

```
PASS  alias_35 called 1x
PASS  raintree__find_master_insurances called 1x
PASS  form new_cost_code == "B0222"

options served to insurance_select (5):
   10001 - Aetna
   10002 - Blue Cross Blue Shield
   10003 - Cigna
   10004 - Medicare
   10005 - United Healthcare
```

Falls back to the master list on both counts — wrong region and a failed call. The agent is
never left with an empty picker. **This is also what production sees today**, because nothing
writes `clinic_region` yet.

### Harness note

Fixtures A and B were asserted on a scope-bounded copy of the tree (node 107's continuation
pointed at a terminal) because the walk otherwise runs into the pre-existing
`131 -> 132 -> 133 -> 134 -> 136 -> 131` patient-number re-entry loop, which predates this
change and which the walk cannot exit without a full downstream fixture. The routing through
the changed region was confirmed on the unmodified build first, in both directions.

## 4. Preview URLs

```
Incoming Call — no existing lead
https://zingtree.com/preview/632727963?zv_patient_first_name=Ted&zv_patient_last_name=Lasso&zv_patient_dob=01%2F20%2F1990&zv_patient_email_address=ted%40lasso.com&zv_therapy_type=Physical+Therapy&zv_body_part=Hip&zv_patient_number=0000001

Schedule New Patient — Brooklyn
https://zingtree.com/preview/227319134?zv_clinic_cost_code=A0111&zv_clinic_region=Brooklyn&zv_name=Ivy+Rehab+Brooklyn+Heights&zv_clinic_raintree_code=01

Schedule New Patient — other region
https://zingtree.com/preview/227319134?zv_clinic_cost_code=B0222&zv_clinic_region=&zv_name=Ivy+Rehab+Fenton&zv_clinic_raintree_code=02
```

## 5. What Stage A cannot prove

- **Live API behaviour.** No captured production response exists for `GET /lead`,
  `GET /customtables/DPAY`, `GET /customtables/CASET` or the Azure insurance endpoint. Every
  fixture is shaped from the published spec or inferred. The Azure response shape in particular
  is a guess (OI-6) — if it is not an array root under `.value`, one line in node 188 changes.
- **Whether the Raintree codes actually match.** The mapping assumes DPAY descriptions look
  like Ivy's `therapy_type` values and CASET descriptions look like `body_part`. First live run
  will show; a non-match sends nothing rather than something wrong.
- **The Create Lead body accepting an unquoted merge field** for `disciplines`.
- **Required and conditional field behaviour** on node 149, and merge-field rendering.
- **The dynamic select resolving** `actions.raintree__find_master_insurances.records` after
  `setResponseData` re-serves it from the Azure list — it already works with the Raintree list,
  but not yet with this source.
- **The runtime invalid-loop guard.**

## 6. Before this goes live

1. Create the three Connected Objects and substitute their ids (see the delivery note).
2. Apply the `raintree__create_lead` body change **in the same window as the tree import** —
   `"disciplines": ${lead_disciplines_json}` is unquoted, so if the object is updated while
   the old tree is still live, the body is not valid JSON and every create fails.
3. Teammate review. This build touches patient PII and the Raintree credential chain.
