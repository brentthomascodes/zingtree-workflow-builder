# Corpay UK work run 2026-11-02 (second run) - BLOCKED before live steps

## Sources (since 14:35 UTC intake-only run)
- Gmail "Daily AI standup - 2nd Nov", Gemma 15:34 GMT: PROD Tue 3 Nov UK AM = reading most recent email in thread + inferring context; PROD Thu 5 Nov UK AM = Networks queue + merchant request; INT Thu 5 Nov UK PM = Homecharge Business / Personal charges (use case attached).
- Same thread, Charley 16:18 GMT: FAST intent/instructions doc ("Possible Intent change v1") + "Intent_Classification_Change_Handover" - "review and validate our thinking and share any feedback before going into INT".
- Spiky "Daily stand ups - UAT testing feedback" 2 Nov (be4355f8): Alex happy to go live with threading; Brent "I will have it ready for you in production tomorrow in your time." Gemma to give Networks green light Wednesday. Bulk threshold agreed: 9 or fewer proceed, 10 or more escalate.
- Tracker: sample rows only via connector; nothing new ready for PROD.

## Change list
| # | Ask | Kind | Target | Env | State |
|---|---|---|---|---|---|
| 1 | Threading to PROD | tree + CO 24 SELECT + AI context | PROD master 417189428 (2 -> 83 -> 84 -> 58, 47, 48); CO 24 += TextBody, MessageDate; AI 13/12/20/21 context swap | PROD (Brent approved early deploy 2 Nov) | Built + Stage A on local source. NOT imported |
| 2 | HC Business/Personal Charges intent | tree + AI | HC INT 698599608 nodes 19, 24, 48; master INT 109029630 nodes 44, 45, 47, 48; AI 19 / 18 | INT | Built + Stage A on local source. NOT imported |
| 3 | Charley's FAST doc | review | AI 16 | none until Corpay confirms | Review done (feedback below) |
| held | Thread ID off customer email in PROD | CO 203 | - | PROD | Not in today's approved release list. Ask |
| held | Networks PROD | - | - | PROD | Gemma's Wednesday green light |

## Blocker
- Chrome (Claude tab group) is not signed in to eu.zingtree.com; asked Brent to sign in. Folder access to ~/Downloads was declined, so exports are verified by hashing in the browser against local files instead of saved downloads.
- No live baselines, imports, AI Action PUTs or email this run. Nothing to roll back.

## Stage A (provisional, on local sources - rerun on live exports before import)
- lint --strict: 0 errors on HC INT, master INT, PROD master (warnings pre-existing).
- co10_gate OK on all three. env check eu (INT) / eu_prod (PROD) OK. PROD master zero _int aliases.
- INT parity: 68 SAME; 2 new fixtures (hc-business-personal-driver / -fleet) FAIL before, PASS after (intended).
- PROD parity: 59 SAME, but the walker fails before and after alike on most PROD fixtures (known since 29 Oct) - live smoke is the real check.
- AI patch dry-run (ai_patches.json) applies cleanly to the last saved 19 / 18 (29 Oct) and 13 / 12 / 20 / 21 (14 Oct) objects.

## Files
- prod-threading-2026-11-02/build_prod.py, regress_prod_family.py, parity_prod_provisional.txt
- hc-business-personal-2026-11-02/build_hc.py, build_master_int.py, make_patches.py, ai_patches.json, parity_int_provisional.txt
- fixtures/email-ai.hc-business-personal-driver.org123.fixture.json, -fleet

## Charley doc review (for the reply)
1. Rule 2 drops "NEGATIVE TONE IS NOT A COMPLAINT" and adds "frustrated" as an escalation trigger: annoyed fee questions (e.g. £99 RDD) would now escalate. Live rule and test scenarios rdd_frustrated expect no escalation.
2. Complaint definition (formal complaint, threaten to leave / legal action, chased repeatedly) and the angry/abusive bullet are condensed; keep the detail.
3. Card threshold: Rule 2 says 10 or more (matches call), but the "replace my card and order 12 more" example still says "more than 10". Add a 9-cards-proceeds example and the footnote (applies to cancel_card, order_a_new_card).
4. cancel_card says "a card": per call make it "one or more cards".
5. "How do I activate my card?" changes from no escalation (live) to escalation / other. Confirm that's intended.
6. "email_intent must always be an array" constraint is missing (handover flags it too). Keep it.
7. "do not generate that intent's AI draft" lines are fine but the intent action doesn't draft: the outcome comes from email_intent = other.
8. ai_exception_reason escalation pattern lost the rule number ("RULE <n> escalated it").
