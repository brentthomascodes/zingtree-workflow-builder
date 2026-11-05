# Corpay UK work run, 2026-10-14 - Thursday 15 Oct PROD release (published Wed night per Brent)

## Sources
- Gemma Danks, "Daily AI standup - 13th Oct" (13 Oct 14:40 UTC): PROD list for Thursday.
- Gemma Danks, "Re: Daily AI standup - 13th Oct" (14 Oct 09:43 UTC): GDPR v2 confirmed in INT.
- Charley Gunning, "New use cases to be built" (12 Oct): Ecopoint / EPT / Zero Liability, UAT after this release.
- Tracker (full xlsx export read): rows 18, 27, 28, 31, 32, 37 = release items; 19 (internal domains) and 38 (sentiment) show 15/10 but are not on Gemma's list.
- No Corpay UK standup recorded 14 Oct (in-person day). Charley OOO until 15 Oct.
- Brent (chat, 14 Oct): run the full PROD release tonight; draft (not send) the status email.

## Change list
| # | Item | Env | Result |
|---|---|---|---|
| 1 | AS Account Administrator blank wording (node 6/9) | PROD | In tree; offline fixture admin-blank PASS (no Test Mode scenario) |
| 2 | GDPR v2 (54 -> 57, no names step) | PROD | Live Test Mode: 54 -> GDPR -> 55 v2 copy verbatim -> 41 |
| 3 | Resolved/Closed gate (6/7/56) | PROD | Test Mode case_resolved -> 56; 2 real PROD cases (closed) -> 56 unmocked |
| 4 | Multi-intent unsupported/unrecognised (13/17/19/26/52/62-64 + AI 13/12/20/21) | PROD | FAST partial -> 62 -> agent text -> regenerated reply includes it -> 54; HC partial -> 62 -> keep draft -> 30 |
| 5 | Card Group/Moves (AI 13/12, node 17 map) | PROD | move -> 54 -> 41 Not Online / Card Group/Moves; error -> 28 |
| 6 | Returned Direct Debit (AI 13/12, node 17 map) | PROD | -> 54 -> 41 Fee / Returned direct debit, approved copy |
| H | Sentiment split; HC plain "Why AI stopped" wording; Ecopoint/EPT/ZL; master split | held | INT only |
| H | Tracker 19 internal domains | held | no spec, question to Corpay |

## Gates
- Stage A on PROD build: lint 0 errors; co10 gate OK; env check eu_prod OK; zero _int aliases; diff vs live = approved items only (+ sentiment Test Mode scenarios removed, changelog line).
- Fixture regression (prod-aliased): new-feature fixtures pass; feedback-return x4 identical; old pre-Sep fixtures fail identically before/after (stale case shape); case-closed/session-expired walks loop on the re-run button in INT and PROD alike (walker artefact).
- Rollback export: "Email Automation - AI Actions Prod (BEFORE baseline 2026-10-14).json" (matches 8 Oct promote file except truncated node names).
- AI Actions PROD 13/12/20/21: before GETs in runbook exports/ai-actions/*-before-2026-10-14.json; PUT 200; re-read matches intended text for all four.
- Import (Replace Workflow 417189428): re-export identical to built file except portal-truncated node_name on 18/25/57 and portal ids; 25 predefined vars present. Published with release notes.
- PROD Test Mode (mock_all_requests, no sends): RDD, card group move, card group error, partial unrecognised (+regenerate), GDPR, case resolved, active card list, multiple intents (-> 32 -> 41), out of scope (28), blocked action (28), HC password reset (30), HC partial (62 -> 30), HC complaint (28). 0 script errors.
- Unmocked PROD: 2 real cases via CO 22/21 -> both closed -> 56. No open PROD case available to run end to end; first live FAST case to be watched Thursday.
- Score: 5/6 verified live (AS2 wording verified offline only).

## Observations (pre-existing, not caused by this release)
- HC missing charges stock Test Mode email escalates in PROD (runbook failure mode: RULE 2 reads "look into this" as investigation). INT AI 19 has the fix clause; held with the sentiment change.
- PROD HC "Why AI stopped" still prints intent keys (e.g. hc_password_reset); INT 13 Oct fix not in this release.

## Rollback
1. Import "Email Automation - AI Actions Prod (BEFORE baseline 2026-10-14).json" -> Replace Workflow 417189428 -> Publish (or Version History -> previous).
2. PUT runbook exports/ai-actions/{13,12,20,21}-before-2026-10-14.json.

## Full regression sweep (after release, 14/15 Oct)
PROD 417189428, Test Mode mock_all_requests, all 38 scenarios (no sends):
- FAST to 41 with right Topic / Sub Topic: active card list, order new card, cancel card, new user, copy invoice, card PINs, transaction report, replacement cards, forgotten password, lost & stolen (via 32), account unlock, add/update contact (Not Online), multiple intents (32), RDD (Fee), card group move (Not Online), GDPR (55 v2 copy), partial unrecognised (62 -> agent text -> regenerated reply includes it).
- FAST stops: case resolved -> 56; blocked action, card count, card group error, out of scope -> 28.
- HC: password reset 30 -> 51 providers -> 41 HC-Not Online / Password Reset; tariff standard/octopus/failing, fleet requester, payment query x2 -> 21 (octopus driven to 30, approved copy); update charger, resent onboarding -> 30; missing charges with screenshots, multiple intents -> 53; partial -> 62 -> 30; password reset failed, complaint, out of scope -> 28.
- HC missing charges (stock email) -> 28 in PROD (pre-existing; INT has the fix, held).
- Feedback thumbs down + comment + Submit -> back on 54, ai_feedback=thumbs_down, ai_feedback_submitted=Yes. Manual changes 54 -> 33 -> 41.
INT 109029630 (master + branches), all 46 scenarios: same results as PROD plus Ecopoint / EPT / Zero Liability (Fee / <name>, failed opt-out -> 28), rdd_frustrated -> 54 BAU, rdd_complaint -> 28, HC missing charges -> 53, HC plain "Why AI stopped" wording, underpayment -> 23 unit-rate prompt -> draft includes it. Screenshots-attached button 53 -> 28. Feedback + manual changes OK. Unmocked INT: FAST case 500Ad00000c1OgmIAE -> 54; HC case 500Ad00000dG5JwIAK -> 30. 0 script errors in either tree.
- "Case —" on unmocked dashboards = sf_CaseNumber not passed in a bare preview (the Salesforce widget passes it); with zv_sf_CaseNumber it shows. Not a defect.

## Tracker (Open Items) updated 14/10
Completed + date closed 14/10/2026 + comment: items 18, 27, 28, 31, 32, 37. Comment only: 33, 34, 35, 36, 38, 19. Item 5 (GDPR button) not touched: hidden by the sheet's current filter. One mis-edit (row 13 / item 12, hidden-row jump) restored to its original values.
