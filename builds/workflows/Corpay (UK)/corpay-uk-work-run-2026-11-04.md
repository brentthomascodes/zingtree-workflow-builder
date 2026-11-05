# Corpay UK work run 2026-11-04 - INT + PROD LIVE, score 1.0 (reply DRAFTED - Gmail web needs re-sign-in)

## Sources (since 2026-11-03 05:44 UTC reply)
- Spiky "Daily stand ups - UAT testing feedback" 4 Nov 15:30 UTC (6a81aad4): Charley: Networks "got the green light to go ahead ... live today or ready for tomorrow morning". Asked whether Networks has the same multi-intent banner as FAST / HC; Brent: "it should be ... I will double-check that before I press publish". Fast follow: Zingtree form linked from the Networks AI email (hidden case + thread vars, submit -> Salesforce); Charley to send the field list; Brent demo by Friday.
- Gmail: "Daily AI standup - 2nd Nov" (Gemma 2 Nov): PROD Thu 5 Nov UK AM = Networks queue & merchant request intent. 3 Nov standup cancelled. No reply yet to Brent's FAST doc feedback. Charley's 4 Nov summary email not arrived yet.
- Tracker: Backlog row 5 (Networks queue) Not Started; nothing marked ready for PROD.

## Change list
| # | Ask | Kind | Target | Env | State |
|---|---|---|---|---|---|
| 1 | Networks multi-intent banner (same as FAST / HC) | tree | Networks branch INT 547469427: needs the unrecognised banner (HC equivalents: node 26 unrecognised_banner, 62 review screen, 64, 52 router) | INT, then PROD with #2 | NOT BUILT - see finding |
| 2 | Networks queue to PROD | new PROD branch tree + master PROD 417189428 node 8 route / Tree node 82 + Test Mode | PROD | BLOCKED |
| held | Networks reply form (fast follow) | new | - | INT | Waiting on Charley's field list |
| held | FAST intent doc into INT | AI 16 | INT | Waiting on Corpay's answer to the 3 Nov feedback |

## Finding (offline, local Networks file 30 Oct = last imported build)
Networks branch has NO multi-intent banner. It only sets ai_exception_reason (node 94) and prints it on master escalation screen 29. FAST / HC show the "Part of this request was not recognised" banner + review screen on in-scope dashboards. Brent told Charley it "should be" there: it is not. Confirm against the live export once signed in.

## Blockers
1. Chrome not signed in to eu.zingtree.com (Login button shown). No live export, import, AI Action GET/PUT possible.
2. PROD has no Networks intent AI Action: manifest eu_prod has 13 / 12 / 20 / 21 only (INT twin is 23 automate_networks_email_intent_int). Skill rule: stop the PROD step. Needs Brent to create automate_networks_email_intent_prod (copy of 23) or authorise creating it.
3. Networks sender networksupport@allstarcard.co.uk must be a verified OrgWideEmailAddress in PROD Salesforce: unconfirmed.

## Gates
Nothing built or imported. Score n/a. No email sent or drafted.

## Continuation (Brent signed in, "add the banner and all other steps committed to")

### Baselines (live exports hashed node-for-node in the browser)
- Networks INT 547469427 = networks-2026-10-30 file; INT master 109029630 = hc-business-personal 11-03 file; PROD master 417189428 = prod-threading 11-03 file. Copied as BEFORE baseline 2026-11-04 in networks-banner-2026-11-04/.

### Built (networks-banner-2026-11-04/)
- Networks INT: 94 builds transforms.unrecognised_banner_html (in_scope + ai_exception_reason set) -> 118 (screen 96) and 110 (dashboard 114) print it on top. Same card as FAST / HC. 48 changelog.
- INT master: Test Mode scenario test_networks_remittance_plus_other (44, 45), 48 changelog.
- AI 23 INT: ai_exception_reason names the extra request on a remittance copy email (patch md).
- Fixture: fixtures/email-ai.networks-remittance-plus-other.org123.fixture.json.
- PROD (built, NOT imported): "3 BRANCH - Networks PROD (release 2026-11-04).json" + "0 MASTER PROD 417189428 (networks release 2026-11-04).json" from build_prod.py <ai_id> <branch_id> (currently built with dummy ids 999 / 888888888 - rebuild with real ids).

### Stage A
- INT: lint --strict 0 errors, no new warnings; co10 OK; env eu OK; parity 71/71 SAME; tree_diff = 48, 94, 110, 118 (branch) and 44, 45, 48 (master) only. Banner present in case_review_html on the new fixture, absent on networks-general-fuel.
- PROD: lint 0 errors (one warning fewer: router 10 last button now op def, as INT); co10 OK; _int only in branch claude.md; FAST/HC PROD parity 59/59 SAME; all 12 Networks fixtures (remapped) end on the same node on the PROD stitch as on INT.

### INT live
- AI 23 PUT 200, re-read = intended.
- Import Replace 547469427 and 109029630; re-exports = built files node-for-node; 25 predefined vars.
- Test Mode (preview ?start_node=44, mock_all_requests): plus_other -> 96 banner 3/3, 97 FUEL -> 114 banner -> sent -> 41; remittance_copy -> 96 no banner 2/2; remittance_wrong -> 28; other_out_of_scope -> 29; merchant_ineligible -> 9; fast_admin_active_card_list -> 54. 0 script errors.
- Unmocked INT: FAST 500Ad00000c1OgmIAE -> 54; HC 500Ad00000dG5JwIAK -> 30.

### PROD - blocked
- Creating automate_networks_email_intent_prod (POST /ai-agents-svc/ai-actions, copy of 23) was refused by the session's permission check (shared-resource change). Nothing changed in PROD. Without that action the PROD branch cannot run.
- Still open: networksupport@allstarcard.co.uk verified as OrgWideEmailAddress in PROD Salesforce (unconfirmed).
- To finish: create the action (or approve it), then python3 build_prod.py <ai_id> <branch_id> after New Workflow -> Import of the branch into the PROD folder, re-run Stage A, add both ids to the manifest eu_prod + alias regex in corpay_uk_env_check.py, Replace 417189428, publish, smoke test (Networks scenarios + active card list + 1 HC, unmocked FAST).

### Gates / score
- INT gates pass. Item 2 (Networks PROD) not done -> score 1/2 = 0.5 -> reply DRAFTED (r6887987385662559118) on "Daily AI standup - 2nd Nov", not sent.

### Rollback
- Networks INT: Replace 547469427 with networks-banner-2026-11-04/3 BRANCH - Networks INT 547469427 (BEFORE baseline 2026-11-04).json
- INT master: Replace 109029630 with networks-banner-2026-11-04/0 MASTER INT 109029630 (BEFORE baseline 2026-11-04).json
- AI 23: see corpay-uk-ai-action-patches-2026-11-04.md

## PROD go-live (Brent: "yes explicitly create this for me for the go live")
- AI 24 automate_networks_email_intent_prod created (POST 201), copy of live 23; re-read identical to 23 apart from id / alias / name / description. Manifest eu_prod += 24, branch_trees; env check alias regex += automate_networks_email_intent_*.
- New PROD branch tree 124295894 ("Import from 3 BRANCH - Networks PROD (release 2026-11-04)", sits in All Workflows root; move to Email Automation / PROD - Branched by hand). Imported, then Replace with the claude.md-remapped build; re-export = built file node-for-node. Published.
- PROD master 417189428: Replace with "0 MASTER PROD 417189428 (networks release 2026-11-04).json"; re-export = built file node-for-node, 25 predefined vars. Published ("2026-11-04 Networks queue live ...").
- Stage A on final files: lint 0 errors; co10 OK; env check eu_prod OK on branch and master; 12/12 Networks fixtures pass on the PROD stitch; FAST/HC PROD parity 59/59.
- PROD smoke (preview, mock_all_requests): networks plus_other -> 96 banner -> 97 FUEL -> 114 banner -> 41 (Remittance Breakdown / FUEL Remittance); remittance_copy -> 96 no banner; remittance_wrong -> 28; other_out_of_scope -> 29; merchant_ineligible -> 9; fast_admin_active_card_list -> 54 -> 41 (Online / Active Card List); hc_password_reset -> 30. 0 script errors.
- After publish: /show/417189428 plus_other -> 96 with banner (published path); unmocked real closed case 500WS00000aji3PYAQ from root 2 -> 56, no error. AI screen on an open PROD case not run (no open case used).
- Open: networksupport@allstarcard.co.uk as verified OrgWideEmailAddress in PROD Salesforce unconfirmed (asked in the reply).

## Gates / score (final)
- All hard gates pass; no rollback. Score 2/2 = 1.0.
- Reply-all: draft r6887987385662559118 updated (Live in PROD / In INT / Not in this drop + sender ask). NOT sent: Gmail web in Chrome asks for Google re-verification (cannot sign in for Brent).

## PROD rollback
- Master: Replace 417189428 with networks-banner-2026-11-04/0 MASTER PROD 417189428 (BEFORE baseline 2026-11-04).json, publish (or Version History -> recover pre-import revision).
- Branch 124295894 is only reached through master node 82; rolling back the master switches Networks off.
- AI 24 is new; leave or delete.
