# Corpay UK INT -> PROD promote, 2026-09-24

Source: `Email Automation - AI Actions INT (export 2026-09-24).json` (tree 109029630, modified 2026-09-23 19:32)
Output: `Email Automation - AI Actions Prod (promote 2026-09-24).json` (tree 417189428, org 123, root 2)

## Ids remapped
| Node | INT | PROD |
|---|---|---|
| 2 | CO 10 sfdc_int__case_email_ai | CO 22 get_case_details__prod |
| 5 | CO 20 get_account_details__int | CO 21 get_account_details__prod |
| 35 | CO 23 get_incoming_email_addresses_int | CO 24 get_incoming_email_addresses_prod |
| 38 | CO 187 send_email_simple_int | CO 203 send_email_simple_prod |
| 12 | AI 16 automate_email_intent_int | AI 13 automate_email_responses |
| 16 | AI 15 automate_email_generation_int | AI 12 automate_email_generation |
| 18 | AI 19 automate_hc_email_intent_int | AI 20 automate_hc_email_intent_prod (NEW) |
| 25 | AI 18 automate_hc_email_generation_int | AI 21 automate_hc_email_generation_prod (NEW) |

No placeholders. Manifest updated (backup: `corpay-uk-env-manifest (before 2026-09-24).json`).
AI 20/21 created in org 123 as exact copies of INT 19/18, context alias -> get_case_details__prod. Verified field-for-field.

## Verification: 22/22 pass
Zero _int aliases; script_code, formfields, score_var, button_data identical; only diffs = 4 CO, 4 AI ids, aliases, tree id/name, 25 predefined_vars; unreachable = 1,44-48; 11 Scoring nodes ok; AI config string; must-survive items present.

## Blocking before import
1. CO 203 payload is stale (modified 28 days ago). Copy CO 187's body, alias -> get_case_details__prod. Do it at import time: GT's live tree also uses 203.
   - 203: `${sf_Subject}`, `${HtmlBody}<p>`, `${transforms.ccAddresses}`, senderAddress hardcoded fast.admin@allstarcard.co.uk
   - 187: `${transforms.email_subject_json}`, `${transforms.email_body_json}`, `ccAddresses: []` (hardcoded), senderAddress `${ai_email_from_address}`
2. AI 13 (prod intent) behind INT 16: model gpt-4o vs gpt-4.1-mini; missing ai_exception_reason (instructions, constraints, example schema); missing add_update_contact_details blocked-action rule + worked examples; missing RULE 2 "complaint / corporate account / CCS / web-Zingtree-origin" bypass. Copy INT 16 over 13 (context already matches).
3. AI 12 (prod generation) = INT 15 apart from whitespace + initialMsg. No change needed.
4. Export live tree 417189428 before import (rollback).

## Notes
- CO 22 fields == CO 10 (18 fields). ContactId not selected in either: node 19 hc_requester_type always "driver". Energy/Data provider come from sf_ vars, not CO 22.
- Generation context (INT 15 and prod 12) reads `records[0].SupplierEmail`; field is SuppliedEmail, so Requester Contact renders empty.
- 187 hardcodes `ccAddresses: []` while node 36 still stages transforms.ccAddresses. CC is off in INT.
