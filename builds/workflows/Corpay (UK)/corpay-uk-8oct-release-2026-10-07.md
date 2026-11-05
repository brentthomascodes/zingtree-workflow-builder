# Corpay UK 8 Oct release - INT -> PROD, 2026-10-07

Sources: Spiky "Daily stand ups - UAT testing feedback" (7 Oct), Gemma Danks "Daily AI standup - 7th Oct" email,
Corpay Implementation requirements tracker (Open Items 17, 26, 29, 30), Gemma 7 Oct card-group topic email.

## Promoted to PROD (tracker 30, 26, 17)
- Resent Onboarding Email (HC): node 19 map row + Test Mode scenario; PROD AI Action 20 updated.
- Feedback Submit button reverted (30/53/54/55 + router 52 + tree script_code).
- AI session expired screen 61 instead of the failed-send path (36/37/39/61, display HTML to form data).

## Held in INT
Returned direct debit, card groups, multi-intent guardrail (62-64), closed-case gate (56), GDPR names AI Action (60).
Compatible Chargers removed everywhere (tracker 29).

## Files
- Email Automation - AI Actions Prod (8 Oct release promote 2026-10-07).json -> import over 417189428 (draft; publish Thursday)
- Email Automation - AI Actions INT (card group topic fix 2026-10-07).json -> import over 109029630
- Rollbacks: ... (BEFORE baseline 2026-10-07).json for both (live exports taken 7 Oct)
- Diffs: email-ai-prod-8oct-promote-diff-2026-10-07.md, email-ai-int-card-group-diff-2026-10-07.md

## AI Actions (org 123)
- PROD 20 automate_hc_email_intent_prod (saved via portal, re-read OK): + hc_resent_onboarding_email in Possible
  Intents, its definition (copied from INT 19), Rule 0 self-service override line, worked example flipped from
  "other" to hc_resent_onboarding_email. Constraint 3 semicolons -> commas (portal validator rejects ";"), wording unchanged.
  INT 19's guardrail Rule 3 / SCOPE changes NOT copied.
- PROD 21: already carries the Resent Onboarding template identical to INT 18. No change. (Its Compatible Chargers
  template is inert: PROD 20 never emits that intent.)
- PROD 13 / 12 and all INT Actions: no change.

## Checks
- co10 gate OK both; env check OK (eu_prod 22/21/24/203, 13/12/20/21; eu 10/20/23/187, 16/15/19/18/22).
- Lint 0 errors both. Walks: resent onboarding, feedback-return x4, session expired (->61), GDPR, underpayment pass on PROD;
  card group (now Online / Card Group/Moves), resent, returned DD pass on INT.
