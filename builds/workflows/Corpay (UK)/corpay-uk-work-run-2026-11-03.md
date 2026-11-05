# Corpay UK work run 2026-11-03 (continues 2026-11-02b) - BELOW THRESHOLD, reply DRAFTED

## Sources
As 2026-11-02b: Gemma "Daily AI standup - 2nd Nov" 15:34 GMT (PROD Tue 3 Nov AM threading; INT Thu 5 Nov HC Business/Personal), Charley 16:18 GMT (FAST doc review before INT), Spiky 2 Nov be4355f8 (Alex approved threading; Brent: in PROD tomorrow). Brent approved deploying PROD ahead of the release date. No new emails since.

## Change list
| # | Ask | Target | Env | Result |
|---|---|---|---|---|
| 1 | Threading to PROD | CO 24 SELECT + TextBody, MessageDate; master 417189428 (2 -> 83 -> 84 -> 58, 47, 48); AI 13 / 12 / 20 / 21 | PROD | Tree + CO 24 + AI 13/12 LIVE (published). AI 20/21 ROLLED BACK |
| 2 | HC Business/Personal Charges | HC INT 698599608 (19, 24, 48); master INT 109029630 (44, 45, 47, 48); AI 19 / 18 | INT | LIVE |
| 3 | Charley FAST doc | review | - | Feedback in drafted reply |
| held | HC threading in PROD | AI 20 / 21 | PROD | Rolled back, see below |
| held | Thread ID removal PROD | CO 203 | PROD | Not in release list, asked |
| held | Networks PROD | - | PROD | Gemma green light Wed |

## Baselines
Live exports hashed node-for-node in the browser against local files: PROD master = release-2026-10-21 file (only predefined_var ids differ); INT master = threading 29 Oct file; HC INT = multi-intent 29 Oct file. Copied as BEFORE baseline 2026-11-03 in prod-threading-2026-11-02/ and hc-business-personal-2026-11-02/.

## Stage A
lint --strict 0 errors x3; co10 OK x3; env eu / eu_prod OK, PROD zero _int; tree_diff = change list only. INT parity 68 SAME + 2 new fixtures FAIL before / PASS after. PROD walker parity uninformative (fails before and after alike).

## Live
- Imports: Replace 417189428 / 698599608 / 109029630. Re-exports = built files node-for-node (digests e156726500e1eee6 / fc65bf2824bd75d2 / 7e747f3b93088a07), 25 predefined vars. PROD published 05:12 UTC ("2026-11-03 email threading ...").
- CO 24 PUT + re-read: fields += TextBody, MessageDate; clauses, limit 10, TTL 3000 unchanged. Rollback: remove the two fields.
- AI PUTs re-read = intended (see corpay-uk-ai-action-patches-2026-11-03.md).
- INT Test Mode sweep, all 50 scenarios (mock_all_requests, parallel): 0 script errors; FAST in-scope -> 54, escalations -> 28, GDPR -> 54, resolved -> 56; HC -> 30 / 21 / 53 / 28 as expected; Networks 96 / 28 / 29 / 9. New intent: driver -> 21 (AI suggests driver reply) -> 30 with 4a copy; fleet -> 21 (fleet suggested) -> 30 "Sent by Fleet manager", 4b copy, no unapproved-copy flag. HC multi-intent 2/3 -> 53, 1/3 -> 28 (AI variance, watch).
- Unmocked INT: FAST 500Ad00000c1OgmIAE -> 54; HC 500Ad00000dG5JwIAK -> 30.
- PROD Test Mode: FAST 13 scenarios all expected (active card list sent (mock) -> 41 Online / Active Card List). HC: test_hc_missing_charges -> 28 with old AND new AI 20 (pre-existing: PROD 20 lacks INT's "first report of missing charges is not an error" clause). test_hc_multiple_intents -> 28 4/4 with new AI 20 vs 53 4/4 with old AI 20 = regression -> AI 20 + 21 rolled back; after rollback multi -> 53, password reset -> 30, tariff -> 21.
- Unmocked PROD: real case 500WS00000aji3PYAQ from root 2 ran 2 -> 83 (CO 24 live) -> 84 -> 58 -> 56 (case closed), no script error. AI screen not reached (no open PROD case used).

## Gates
- Stage A, re-exports, AI re-reads: pass.
- INT sweep + unmocked INT: pass.
- PROD smoke: FAIL on HC multi-intent with threading -> rollback of AI 20/21 needed. Hard gate fails -> score 0 -> reply DRAFTED (r-3157349026594263665), not sent.

## Rollback (if needed)
- PROD master: Replace 417189428 with prod-threading-2026-11-02/0 MASTER PROD 417189428 (BEFORE baseline 2026-11-03).json, publish. Safe to leave: AI 20/21 read Description directly and ignore the new variables.
- CO 24: remove TextBody, MessageDate.
- AI 13 / 12: reverse swap (patch md).
- INT HC / master: hc-business-personal-2026-11-02/* (BEFORE baseline 2026-11-03).json; AI 19 / 18 reverse ops.

## Open
- PROD HC: port INT 19's missing-charges clause (or re-run A/B with the thread line wording) before turning threading on for HC; also explains test_hc_missing_charges escalating in PROD today.
- HC multi-intent in INT is flaky (1/3 escalated).

## Continuation 05:40 UTC - HC threading fixed and live in PROD
- Cause: the separate empty "Earlier emails" context message. A/B on PROD AI 20 (Test Mode, mock_all_requests):
  - full patch (separate message): test_hc_multiple_intents 4/4 -> 28
  - old (Description): 4/4 -> 53
  - variant A (swap only): 3/3 -> 53
  - variant B (swap + earlier emails appended inside the same message): 3/3 -> 53  <- adopted
- AI 20 and 21 now = variant B (re-read = intended). PROD HC re-sweep: multi 53 x4, password reset 30, tariff 21, charger 30, resent onboarding 30, partial 30, complaint 28, other 28, payment query 21, missing charges 28 (pre-existing, same with old AI 20).
- AI 13 / 12 keep the separate-message form (FAST sweep all expected).
- Rollback 20 / 21: old objects in browser localStorage corpay_ai_before_2026-11-03_20 / _21 (context only differs: remove the appended paragraph, swap ${latest_customer_email} back to ${actions.get_case_details__prod.records[0].Description}).
- Gate: a rollback was needed during the run -> stays below threshold by the rule -> reply still DRAFT (r-3157349026594263665, updated: threading live for both queues + extended doc feedback). Brent to send.

## PROD re-test (Brent asked)
- Live config re-read: AI 13/12/20/21 read latest_customer_email + thread_context_emails, no Case.Description; CO 24 has TextBody, MessageDate.
- Full PROD Test Mode sweep, 46 scenarios (mock_all_requests): 0 script errors. FAST in-scope -> 54, escalations -> 28, resolved -> 56; HC -> 30 / 21 / 53 / 28.
- Sends (mocked) -> 41: active card list (Online / Active Card List), card group move (Online / Card Group/Moves), returned DD (Fee / Returned direct debit).
- Pre-existing, not from today (A/B with old AI): test_fast_admin_rdd_complaint -> 54 3/3 with old and new AI 13 (PROD 13 lacks INT's complaint wording); test_hc_missing_charges -> 28 (PROD 20 lacks INT's missing-charges clause).
- Unmocked: real closed case 500WS00000aji3PYAQ -> 2 -> 83 -> 84 -> 56, no error. Open PROD case to reach the AI screen: still not run.
