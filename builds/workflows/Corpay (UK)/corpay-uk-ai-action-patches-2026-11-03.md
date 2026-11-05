# Corpay UK AI Action patches 2026-11-03 (org 123)

Ops: hc-business-personal-2026-11-02/ai_patches.json (applied in-browser to the live GET, PUT, re-read = intended).
Before objects: checked against prior saved files by hash (19 / 18 = 29 Oct files + 29 Oct thread patch); PROD 12/13/20/21 before kept in the author-portal browser localStorage (corpay_ai_before_2026-11-03_<id>) - only context changed on those.

| id | alias | env | change | state |
|---|---|---|---|---|
| 13 | automate_email_responses | PROD | context: ${actions.get_case_details__prod.records[0].Description} -> ${latest_customer_email}; + "Earlier emails from the customer on this case, for context only (may be empty):\n${thread_context_emails}" | LIVE |
| 12 | automate_email_generation | PROD | same swap + insert | LIVE |
| 20 | automate_hc_email_intent_prod | PROD | same swap + insert | LIVE as variant B: swap + earlier emails appended inside the same message (separate message made HC multi-intent escalate 4/4) |
| 21 | automate_hc_email_generation_prod | PROD | LIVE as variant B (same form as 20) |
| 19 | automate_hc_email_intent_int | INT | + hc_business_personal_charges (intent list, definition, variants driver_multi_ev_pushback / fleet_manager_multi_ev_response, variant rule order, constraint, 2 worked examples) | LIVE |
| 18 | automate_hc_email_generation_int | INT | + 4a / 4b templates (Gemma 2 Nov use case, links as text), variant count line, requester-type exception | LIVE |

Rollback 13 / 12: remove the inserted "Earlier emails" message and swap ${latest_customer_email} back to ${actions.get_case_details__prod.records[0].Description}.
Rollback 19 / 18: remove the ops listed in ai_patches.json keys "19" / "18".
