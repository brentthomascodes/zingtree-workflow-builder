# Corpay UK AI Action patches 2026-10-29 (INT, org 123)

Source: Charley Gunning, "Networks INT tree issue" 28 Oct 13:49 / 14:47 GMT - read the whole thread, base the response on the most recent email, use the rest as context. INT for testing.

Applied by PUT /ai-agents-svc/ai-actions, re-read and diffed: context changed as intended; instructions, constraints, model, alias unchanged. Before files: runbook exports/ai-actions/{15,16,18,19,23}-before-2026-10-29.json.

| id | alias | message | before | after |
|---|---|---|---|---|
| 16 | automate_email_intent_int | context[0] | `Email from the customer:\nSubject: ${sf_Subject}\n${actions.sfdc_int__case_email_ai.records[0].Description}` | `Email from the customer:\nSubject: ${sf_Subject}\n${latest_customer_email}` |
| 19 | automate_hc_email_intent_int | context[0] | same as 16 | same as 16 |
| 23 | automate_networks_email_intent_int | context[0] | same as 16 | same as 16 |
| 15 | automate_email_generation_int | context[1] | `Customer Email (verbatim):\nSubject: ${sf_Subject}\n${actions...records[0].Description}` | `Customer Email (verbatim):\nSubject: ${sf_Subject}\n${latest_customer_email}` |
| 18 | automate_hc_email_generation_int | context[2] | same as 15 | same as 15 |

Each also gets a new message right after it: `Earlier emails from the customer on this case, for context only (may be empty):\n${thread_context_emails}`

Variables set by master 109029630 node 84 (live) / node 47 (Test Mode). PROD AI Actions (12, 13, 20, 21) untouched.

Connected Object 23 (get_incoming_email_addresses_int, INT only): SELECT += TextBody, MessageDate. WHERE (ParentId = sf_Id, Incoming = true), limit 10, TTL 3000 unchanged. Before: exports/connected-objects/23-before-2026-10-29.json.

Rollback: restore context.messages from the before files (PUT), remove TextBody / MessageDate from CO 23, Replace 109029630 with threading-2026-10-29/0 MASTER INT 109029630 (BEFORE baseline 2026-10-29).json.
