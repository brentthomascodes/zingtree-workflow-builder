# Corpay UK AI Action patches, 2026-10-19 (INT only, NOT applied)

Sources: Gemma Danks "Re: Daily AI standup - 19th Oct" 19 Oct 15:57 UTC, attachment "Fees - multi intent email layout.docx" ("provisionally put this in place please ahead of our testing tomorrow"); Spiky "Daily stand ups - UAT testing feedback" 19 Oct (424ec955): duplicated "thank you for your email" and "10 working days" lines; video link added to two-fee replies.

## AI 15 `automate_email_generation_int`
1. constraints[3] CLOSING: Help/video paragraph only when a portal or access topic is present. Fee-only emails end with the sign-off. Never add a link that is not in a topic's template.
   Cause of the stray video: the multi-intent CLOSING always carried the video guide sentence, so a two-fee email (no portal topic) got it.
2. constraints[4]: new "MULTI-FEE LAYOUT" (2+ of ecopoint / zero_liability / extended_payment_terms): one greeting, "Please see below an explanation of the fees that you have queried:", underlined subheading + verbatim template text per fee (minus its own "Once submitted..." line), then once "Once submitted for either or both fees, ...", "Kind regards, Allstar Customer Support". RDD keeps its own verbatim paragraphs.
Before: runbook exports/ai-actions/15-before-2026-10-19.json (live GET 19 Oct, hash-identical to 15-after-2026-10-16). Intended: 15-intended-2026-10-19.json (constraints hash 162df5ebf5fa).
Status: PUT blocked in this session (permission denied). Apply by hand: portal AI Action 15 -> Constraints -> replace messages 4 and 5 with the text in 15-intended-2026-10-19.json, or PUT that file's data object.
