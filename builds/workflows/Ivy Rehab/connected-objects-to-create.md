# Connected Objects to create — Ivy Rehab org 605418

Three new objects plus one body edit. All three follow the house pattern I read off the
existing Raintree objects (`get_token` 1021, `raintree__get_patient_by_patient_number` 1138,
`raintree__find_master_insurances` 1214, `raintree__create_lead` 1067):

- **Connector:** `No Auth` — every Raintree object uses it; auth is the explicit Bearer header
- **Base URL:** `https://api.raintree.cloud` (production; the developer portal documents the UAT host)
- **Headers, in this order:**
  1. `Content-Type` → `application/json`
  2. `Authorization` → `Bearer ${actions.get_token.access_token}`
  3. `client` → `Zingtree_9892`

---

## 1. Raintree - Find Leads

| Field | Value |
| :---- | :---- |
| Method tab | **Retrieve** |
| Connector | `No Auth` |
| Endpoint URL | `https://api.raintree.cloud/lead` |
| Name | `Raintree - Find Leads` |
| Alias | `raintree__find_leads` |
| Cache TTL | `0` |
| Log Activity | on |

Headers: the three above.

Query parameters:

| Key | Value |
| :-- | :---- |
| `firstName` | `${patient_first_name}` |
| `lastName` | `${patient_last_name}` |
| `dob` | `${lead_search_dob}` |
| `limit` | `5` |

**Cache TTL must be 0.** A cached hit would make the duplicate pre-check read a stale answer,
which is the bug we're fixing.

Response: `{ "count": 1, "records": [...], "page": 1, "isMore": false }` — object root, so no
`.value` wrapping. Node 2 reads `.count`.

---

## 2. Raintree - Get Disciplines (DPAY)

| Field | Value |
| :---- | :---- |
| Method tab | **Retrieve** |
| Connector | `No Auth` |
| Endpoint URL | `https://api.raintree.cloud/customtables/DPAY` |
| Name | `Raintree - Get Disciplines (DPAY)` |
| Alias | `raintree__get_disciplines` |
| Cache TTL | `86400` |
| Log Activity | on |

Headers: the three above. No query parameters.

---

## 3. Raintree - Get Case Types (CASET)

| Field | Value |
| :---- | :---- |
| Method tab | **Retrieve** |
| Connector | `No Auth` |
| Endpoint URL | `https://api.raintree.cloud/customtables/CASET` |
| Name | `Raintree - Get Case Types (CASET)` |
| Alias | `raintree__get_case_types` |
| Cache TTL | `86400` |
| Log Activity | on |

Headers: the three above. No query parameters.

Both custom tables return `{ "count": N, "tables": [ {code, description, desc2, desc3, desc4,
filter} ] }`. Node 2 matches on `description` first, then `code`.

---

## 4. Raintree - Create Lead (1067) — body edit

Append two keys to the existing body. **Change nothing else.**

```json
{
  "firstName": "${patient_first_name}",
  "lastName": "${patient_last_name}",
  "dob": "${patient_dob}",
  "sex": "${patient_birth_sex_raintree}",
  "cellPhone": "${patient_phone_number}",
  "email": "${patient_email_address}",
  "address": "${patient_address_line_1} ${patient_address_line_2}",
  "city": "${patient_city}",
  "state": "${patient_state}",
  "zipCode": "${patient_zipcode}",
  "location": "${appt_clinic_raintree_code}",
  "mrefs": "00000",
  "mRefsCat": "1",
  "comm": "${comment}",
  "primaryReason": "${lead_primary_reason}",
  "disciplines": ${lead_disciplines_json}
}
```

`disciplines` is **unquoted** — `lead_disciplines_json` carries a serialised array such as
`["PT"]`. Because of that, this edit and the tree import have to happen in the same window: if
the object is updated while the old tree is still live, `lead_disciplines_json` is unset and
the body stops being valid JSON, so every lead creation fails.

---

## After they exist

Note the three ids from the Connected Objects list, then in
`Zingtree Builder/Workflow JSONs/Ivy Rehab/`:

```bash
python3 apply_co_ids.py --find-leads <id> --disciplines <id> --case-types <id>
```

It rewrites the tree JSON and both fixtures and refuses to write invalid JSON. Then re-run:

```bash
python3 scripts/lint_tree.py "Incoming Call (lead pre-check + therapy type 2026-09-17).json"
node scripts/walk.mjs "Incoming Call (...).json" "fixtures/incoming-call.fixture.json" --start 105
```
