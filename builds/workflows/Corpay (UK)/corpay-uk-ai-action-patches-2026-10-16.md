# Corpay UK AI Action patches, 2026-10-16 (INT only)

Sources: Gemma Danks "Daily AI standup - Fri 16th Oct" (16 Oct 15:45 UTC); Spiky "Daily stand ups - UAT testing feedback" 16 Oct (c09a7de7): Brent proposed "if any fee is detected, do not summarise"; Gemma: add it in INT so testers can try it. Hyperlinks: Gemma, links in quick-text emails fail when clicked, load when pasted.

## AI 15 `automate_email_generation_int`
1. instructions[7] card_pins: `<a href="www.allstaronline.co.uk">` -> `<a href="http://www.allstaronline.co.uk/">` (scheme-less href resolves as a relative link when clicked).
2. constraints: new message [4] "FEE WORDING IS NEVER SUMMARISED" (fee topics RDD, Ecopoint, EPT, Zero Liability, £35 copy-invoice line copied word for word; only greeting/closing merged).
Before: exports/ai-actions/15-before-2026-10-16.json (= 10-14 GET, hash-verified against live). After: 15-after-2026-10-16.json. PUT 200, re-read hashes match.
PROD AI 12 has the same scheme-less card_pins href. Not changed (no PROD approval).

## AI 23 `automate_networks_email_intent_int` (new, POST 201)
Intent remittance_copy_request; escalate on "remittance is wrong" / "not received this month" / complaint; ai_exception_reason as FAST. Body: exports/ai-actions/networks-intent-new-2026-10-16.json, re-read hashes match.
