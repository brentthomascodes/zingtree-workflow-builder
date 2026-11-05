# Corpay UK work run, 2026-10-16 (INT only)

## Sources (since 15 Oct run)
- Gmail "Daily AI standup - Fri 16th Oct", Gemma Danks, 16 Oct 15:45 UTC, attachments "Networks AI tree setup.docx", "Phase 1 - Remittance auto email pushback.docx".
- Spiky "Daily stand ups - UAT testing feedback", 16 Oct 14:00 UTC (c09a7de7): Networks MVP agreed, INT ready by Tue 20 Oct; fee rule into INT; hyperlink investigation; no other use cases into INT next week.
- Tracker (Drive read, sample only): no row newly ready for PROD. No PROD items.

## Change list
| # | Item | Env | Result |
|---|---|---|---|
| 1 | Fee wording never summarised (AI 15) | INT | Live: multi-intent Ecopoint+PIN+RDD -> Ecopoint + RDD text verbatim; single RDD verbatim |
| 2 | Card PINs link scheme fix (AI 15) | INT | Live: test_fast_admin_card_pins reply hrefs all http(s) |
| 3 | Networks_General route (master node 8) + Test Mode 44/45/47 | INT | Live: test_networks_* reach branch |
| 4 | Networks AI Action 23 | INT | Live: copy -> 96, wrong -> 28, other -> 29 |
| 5 | Networks branch remittance MVP (91-98, 110, 112-117) | INT | Live: general (bad date blocked, valid -> 114 -> manual 115 -> 41), service dept -> 114 -> 41, copy verbatim, Topic/Sub Topic correct |
| 6 | Merchant Request bypass on 4 / 9 | INT | Offline only (2 fixtures). Live needs a Networks case without account / ineligible (Salesforce queue lands Tue) |
| H | Networks sender address | - | Blank in node 8, question to Corpay |
| H | General pushback [sender name] | - | No name field in CO 10 schema -> "Hello,". Question |
| H | Other hyperlink failures | - | Need examples |

## Gates
- Stage A: lint 0 errors (both trees); co10 gate OK; env check eu OK (AI 23 in manifest); tree_diff = change list only; 6 Networks fixtures pass; parity 54/54 identical before/after on FAST/HC fixtures (stale pre-Sep fixtures fail identically).
- Imports: master Replace 109029630, branch Replace 547469427 (twice, 2nd adds 116/117 date check). Re-exports identical to built files (excluding ids/node_name). Master predefined vars 25.
- AI Actions: 15 PUT 200 + re-read match; 23 POST 201 + re-read match.
- Live Test Mode (preview ?start_node=44, mock_all_requests): networks x5 paths, FAST RDD, card PINs, multi-intent fee, HC password reset -> 30. 0 script errors.
- Unmocked: FAST 500Ad00000c1OgmIAE -> 54; HC 500Ad00000dG5JwIAK -> 30.
- PROD: not touched.
- Score: 5/6 = 0.83 (< 0.90): reply saved as Gmail draft, not sent.

## Observations
- AI 16 flagged RDD as "not recognised" in a 5-intent email while also matching it (screen 62). Pre-existing, not changed.
- AI 15 context "Requester Contact" reads `.SupplierEmail` (typo for SuppliedEmail), always blank. Pre-existing.
- Native field custom_regex is not enforced live; date check is script node 117.
- Branch tree name still "3 BRANCH - Networks scaffold".

## Files / rollback
- networks-2026-10-16/ (build_networks.py, patch_test_mode.py, stitch.py, built + AFTER re-exports, diffs)
- Rollback: Replace 109029630 with "Email Automation - AI Actions INT 109029630 (BEFORE baseline 2026-10-16).json"; Replace 547469427 with "master-split 2026-10-12/3 BRANCH - Networks 547469427 (BEFORE baseline 2026-10-16).json"; PUT exports/ai-actions/15-before-2026-10-16.json; AI 23 is new (deactivate to roll back).

## Addendum 16 Oct (after Brent's review)
- Kept Networks in INT (dormant until Salesforce sends Networks_General). Added Test Mode scenario test_networks_merchant_ineligible (Corporate account -> screen 9 -> Merchant Request). Master re-imported, re-export identical, parity 54/54. Live: 9 -> Merchant Request -> 96 -> 98 -> 114 -> 41 (SMR). All 6 items now verified live.
- Reply-all sent by Brent.

## Full INT regression sweep, 18 Oct (preview, Test Mode mock_all_requests, no real sends)
Entry: /preview/109029630?start_node=45&zv_test_intent=<key>&zv_test_mock_scope=mock_all_requests
- FAST (30): active card list, order card, cancel, new user, copy invoice (£35 line kept), card PINs (links all http/https), transaction report, replacement, forgotten password, account unlock, contact details, card group move, RDD, RDD frustrated (RDD text in full), Ecopoint / EPT / Zero Liability (full fee text, links ok) -> 54. Lost & stolen -> 54 (Lost & Stolen + Replacement). Multiple intents -> 54 -> 32 -> 41. GDPR -> 54 -> 55 (v2 copy) -> 41. Case resolved -> 56. Escalations (blocked action, card count, RDD complaint, Ecopoint/EPT/ZL failed, card group error, out of scope) -> 28. Partial unrecognised -> 62 -> agent text -> regenerated reply includes it -> 54 -> manual 33 -> 41.
- HC (16): password reset, update charger, resent onboarding -> 30; tariff standard/octopus/failing, fleet requester, payment query x2 -> 21 (octopus driven -> 30 approved copy); missing charges (+screenshots), multiple intents -> 53; partial -> 62; password reset failed, complaint -> 28; other out of scope -> 29.
- Networks (4 + paths): copy -> 96 -> general: 31/02/2026 rejected with message, 15/09/2026 accepted -> 114 -> thumbs down + comment + Submit -> back on 114 -> send -> 41 FUEL; service dept: empty submit blocked, £480.25 + SMR -> 114 -> manual 115 (body edited, Sub Topic changed to FUEL) -> 41 shows edit + FUEL; wrong -> 28; other -> 29; merchant ineligible -> 9 -> Merchant Request -> 29/02/2028 accepted -> 41 SMR.
- AI 23 wording variants: "resend the remittance advice" -> 96; "does not match what was paid" -> 28; "not received remittance email for October" -> 28; "remittance breakdown for SMR invoices" -> 96; bank details change -> 29; complaint about remittance -> 28.
- Unmocked: FAST 500Ad00000c1OgmIAE -> 54; HC 500Ad00000dG5JwIAK -> 30.
- 0 script errors, no unrendered merges.
- Observations (AI 16/19 behaviour, unchanged this release): blocked-action and EPT/ZL-failed escalations show no "Why AI stopped" line; HC other_out_of_scope landed on 29 (not automated) this run vs 28 in the 14 Oct sweep.
- Not re-verified: tree export / AI Action re-read on 18 Oct (author session logged out).
