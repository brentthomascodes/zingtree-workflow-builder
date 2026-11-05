# AI Actions, org 123, 2026-09-30

Saved via PUT /ai-agents-svc/ai-actions (author-portal session), each re-read and verified.
Before-state of 18, 19, 20 and 21 is kept in the portal tab's localStorage as `claude_uk<id>_before_20260930`.

## INT
- **18 `automate_hc_email_generation_int`**: Update Charger Information template matches Gemma's
  30 Sep docx. "We haven't made any changes..." and "Please follow the below instructions..." are
  two paragraphs. "Here, instructions will appear on screen..." is a paragraph, not the last bullet
  (Charley's point on the call). Password-reset steps are a numbered list (`<ol>`). "Need further
  help?" is its own heading line. Constraint 0 now allows `<ol><li>` only where a template has one.
  Headings stay `<p><strong>` (house style, no underline). Links keep linked text, no raw URLs (tracker 7).
- **19 `automate_hc_email_intent_int`**: 5 -> 7 intents. `hc_compatible_chargers` and
  `hc_resent_onboarding_email` added to Possible Intents, their definitions restored (copied from
  the 7-intent prompt PROD 20 held before tonight), Rule 0 override line added, worked examples
  un-pinned from `other`. Pairs with the INT tree `(next batch 2026-09-30)`.

## PROD (tonight's release)
- **21 `automate_hc_email_generation_prod`** = INT 18 (with the charger fix), aliases -> prod.
  Before: an older copy that differed from INT 18 in instructions 0/3/8/9 and constraint 0.
- **20 `automate_hc_email_intent_prod`** = INT 19 as Corpay tested it (5 intents), aliases -> prod.
  Before: the 7-intent prompt with the older payment-query rules. Compatible Chargers / Resent
  Onboarding are no longer detected in PROD; they go live with the next release.
- FAST Admin 13/12 already match INT 16/15 (whitespace only). Not touched.

## Not applied, waiting on Brent
- Tracker 23 / 24 (Payment Query template quote styling + video link text) from the 28 Sep patch
  were never applied to UK 18 or 21.
