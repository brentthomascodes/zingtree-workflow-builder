# Corpay UK work run, 2026-10-21 - PROD release published (unmocked check outstanding)

## Sources
- Gmail "Daily standup - 21st Oct", Gemma 16:21 UTC: live out of hours tonight = Extended Payment Terms, Ecopoint, Zero Liability use cases + master tree re-structure.
- Spiky "Daily stand ups - UAT testing feedback" 21 Oct (ad56e66f): Gemma [09:23] "happy for the intents to go live tomorrow ... the three fee ones" + master restructure; [37:21] promote out of hours. Session restart held (wait for Salesforce pause/resume change). Thu call cancelled, Fri 23 Oct 90-min multi-intent workshop.
- Gmail "Re: Scheduling conflict" 20 Oct: INT asks (no "I can see that you want to" on multi-intent, Note: sentences own bold paragraph).
- Brent (chat): PROD = approved items only; Card Group/Moves keeps live PROD Topic "Online" (someone edited PROD after 14 Oct), INT set to match.

## Change list
| # | Item | Env | State |
|---|---|---|---|
| 1 | AI 15: multi-intent opening rule + Note: sentences rule (constraints 6/7) | INT | DONE via portal UI; re-read constraints hash 402adb219c47cb41 = 15-intended-2026-10-20; other fields unchanged |
| 2 | FAST branch node 17 card_group_move Topic "Online" | INT | Imported (Replace 474162496). Re-export check pending |
| 3 | PROD master split: master 417189428 + FAST 450053608 + HC 496283193 (folder "PROD - Branched") | PROD | Imported as DRAFT, re-exports match built files node-for-node, 25 predefined vars. NOT PUBLISHED |
| 4 | Ecopoint / EPT / Zero Liability (tree: FAST 13/17, Test Mode 44/45) | PROD | In the draft trees above |
| 5 | AI 13 (intent) fee intents, definitions, fee escalation rule (sentiment-split lines excluded) | PROD | NOT SAVED - save blocked by session permission (auto-mode classifier) |
| 6 | AI 12 (generation) fee templates, fee wording rule, multi-fee layout context (link fix + 20 Oct INT rules excluded) | PROD | NOT STARTED - same block |
| H | Networks route/branch, links-in-new-tab script, RDD sentiment split, 20 Oct reply rules, session restart | - | Held (not approved for PROD) |

## Gates
- Stage A (PROD build): lint --strict 0 errors (18/22/26 warnings = INT baseline); co10 gate OK x3; env check eu_prod OK x3; zero _int aliases; tree_diff = split structure + fee scenarios only.
- Parity: 60 fixtures, INT family vs PROD family stitched (FAST + HC): identical on all non-Networks fixtures; Networks fixtures end on 11 Queue not in scope in PROD (intended, route off). Card-group fixture updated to Online.
- PROD AI Actions 12/13/20/21 untouched (live GET hashes = start of run).
- Live Test Mode / unmocked: not run (stopped before publish).
- Score: 1 of 5 items live and verified. Email not sent.

## Files
- release-2026-10-21/ : BEFORE baselines (PROD 417189428, INT 109029630/474162496/698599608/547469427), build_int.py, build_prod.py, built PROD files.
- runbook exports/ai-actions/15-before-2026-10-21.json, 15-after-2026-10-21.json, 16/18/19-before-2026-10-21.json.

## Rollback
- PROD (nothing published): Import > Replace Workflow 417189428 with "release-2026-10-21/Email Automation - AI Actions Prod 417189428 (BEFORE baseline 2026-10-21).json" (or Version History > Recover), then archive 450053608 / 496283193.
- INT AI 15: delete constraints 6 and 7 (or restore 15-before-2026-10-21.json).
- INT FAST: Replace 474162496 with "release-2026-10-21/1 BRANCH - FAST Admin INT 474162496 (BEFORE baseline 2026-10-21).json".

## Update (Brent: resolve 5000-char limit and continue)
- AI 13 constraints[3] was 5505 chars (portal limit 5000). Split at "WORKED EXAMPLES" into constraints[3] (4007) + new constraints[4] (1497); text unchanged. AI 13 saved, re-read: context/instructions/constraints = target, all other fields unchanged.
- AI 12 saved, re-read = target, other fields unchanged.
- Published: FAST 450053608, HC 496283193, then master 417189428 (release notes added). Status "in sync with Production".
- PROD Test Mode (mock_all_requests): Ecopoint / EPT / ZL -> 54 with fee verbatim; Ecopoint+ZL edited email -> multi-fee layout; ecopoint_failed / EPT_failed / ZL_failed -> master 28; active card list -> 54 -> send -> master 41 Online / Active Card List; card group move -> 41 Online / Card Group/Moves; HC password reset -> 30 -> 51 -> 41 HC-Not Online / Password Reset. 0 script errors.
- INT Test Mode: multiple intents -> no "I can see that you want to" line; forgotten password -> <p><strong>Note: ...</strong></p>; card group -> 41 Online.
- NOT RUN: unmocked FAST + HC cases (INT and PROD) - blocked by session permission (production reads). Hard gate open -> reply saved as Gmail draft r-6223987519435341102 on "Daily standup - 21st Oct", not sent.
- Rollback AI 13/12: live-before copies held only in browser localStorage (__zt_live) - not on disk. Reverse = remove fee lines per build notes.
- Cosmetic: branch tree names still "Import from ... (release 2026-10-21)".
