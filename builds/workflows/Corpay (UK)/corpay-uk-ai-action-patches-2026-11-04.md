# Corpay UK AI Action patches 2026-11-04 (org 123)

| id | alias | env | change | state |
|---|---|---|---|---|
| 23 | automate_networks_email_intent_int | INT | instructions msg 6 (ai_exception_reason): 'Return "" only when the email is a remittance copy request AND escalate_to_agent is false.' -> 'Return "" only when the email's only request is a remittance copy request AND escalate_to_agent is false.' + new line: 'When the email asks for a copy of a remittance AND also asks about something else, keep email_intent = ["remittance_copy_request"] and return one plain sentence in this form: "The merchant asks for a copy of the remittance, but also asks about <the other request in plain words>, which AI does not handle."' | LIVE (PUT 200, re-read = intended, all other fields unchanged) |
| (new) | automate_networks_email_intent_prod | PROD | create as a copy of live 23 (name "Automate Networks Email Intent", description PROD) | NOT CREATED - create call denied by the session's permission check |

Rollback 23: before object in author-portal browser localStorage `corpay_ai_before_2026-11-04_23`; or reverse the text swap above.
