# Corpay UK AI Action patch, 2026-10-13

Source: Gemma Danks, "Daily AI standup - 13th Oct": "Homecharge complaint exclusion message to be formatted in the same way as FAST Admin (variables to not be on display)". Spiky standup 13 Oct (Gemma: Homecharge "Why AI stopped" shows variables in raw form, FAST Admin is formatted).

## AI Action 19 `automate_hc_email_intent_int` (INT only)
Live evidence before the change (Test Mode, test_hc_escalation_complaint):
"Why AI stopped: hc_missing_charges matched, but the customer also asks to raise a formal complaint."
FAST Admin equivalent (test_fast_admin_rdd_complaint, AI 16 unchanged):
"Why AI stopped: The customer is making a formal complaint about a £99 fee and poor service response"

Changed: instructions message 11 (ai_exception_reason) only. Templates now say "<request in plain words>" instead of "<matched intent(s)>" / "<intent> matched but RULE <n>", plus:
"Write requests the way an agent would say them (for example "missing charges", "a tariff update", "a password reset"), never as intent keys, field names, variable names or rule numbers (never "hc_missing_charges", "RULE 2" or "escalate_to_agent")."
Nothing else in the Action changed (re-read verified: every other message and field identical).

After (same scenario): "Why AI stopped: The customer is making a complaint about missing charges and wants to raise a formal complaint."

Before / after JSON: Account Management HQ/Corpay/UK/corpay-uk-email-ai-runbook/exports/ai-actions/19-before-2026-10-13.json, 19-after-2026-10-13.json

PROD: AI 20 `automate_hc_email_intent_prod` carries the same instruction. Not changed (not in Thursday's approved list). Add to a release when Corpay asks.
AI 16 (FAST INT) shares the same instruction text but already produces plain wording; left unchanged.
