# Corpay UK work run 2026-10-27

## Sources
- Gmail "Networks UAT feedback" (Gemma, 26 Oct 15:01 GMT): £ on invoice amount; dashboard on the pushback choice screen.
- Gmail "Networks INT tree issue" (Gemma, 27 Oct 16:59 GMT): Charley + Dexter get Queue not in scope on Networks INT.
- Gmail "Daily stand up workshops" (Charley, 26 Oct): playbook, multi-intent check, Workflow Unavailable RCA (playbook v1/v2 sent 27 Oct).
- Spiky "Daily stand ups - UAT testing feedback" 27 Oct: Brent to land Networks tweaks for tomorrow; Charley to send keyword/intent/confidence doc for Thursday before/after session.
- Gmail "Zingtree - Corpay Attachment storing" (Gemma, 27 Oct): SF team owns, Jan start; 5 TDD questions (not workflow work).
- Tracker 1dFn-HUQ...: no new / ready-for-PROD rows.

## Change list
| # | Ask | Kind | Target | Env | Result |
|---|---|---|---|---|---|
| 1 | £ always on invoice amount (service dept pushback) | tree script | Networks 547469427 node 110 | INT | Live Test Mode: typed 250.00 -> reply "£250.00", sent (mock) -> 41 |
| 2 | Pushback choice screen = dashboard (case details + customer email) | tree | Networks new script 118, 95 -> 118 -> 96, 96 content | INT | Live Test Mode: screen 96 shows Case Details + Original Customer Email + confidence |
| 3 | Queue not in scope for Charley / Dexter on INT | investigation | n/a | n/a | Root cause: their sessions ran on PROD master 417189428 (LIVE), not INT 109029630. Dexter 13 sessions 15:51-16:02 GMT case 02724364 (path 2-58-8-10-11, queue blank); Charley 2 sessions 16:26-16:28. No Charley/Dexter sessions on 109029630 20-27 Oct. Fix = Corpay SF sandbox Zingtree component tree id for their profile/app |
| held | Keyword / intent / confidence instructions | AI Action | FAST intent | - | Awaiting Charley's final doc (Thursday session) |
| held | Attachment TDD questions | doc | - | - | Separate reply |

## Gates
- Stage A: lint --strict 0 errors (17 warnings, all pre-existing; 2 new ones fixed: transform for HTML, £ escape); co10 gate OK; env check eu OK; tree_diff = change list only (1 added, 4 changed: 48, 95, 96, 110).
- Parity: 6 Networks fixtures identical end node before/after (41,41,41,29,28,41). New fixtures networks-invoice-gbp-added / -kept fail on BEFORE, pass AFTER.
- Live baseline: export of 547469427 matched local 21 Oct baseline node-for-node (hash) -> saved as BEFORE baseline 2026-10-27.
- Import: Replace 547469427. Re-export matches built file node-for-node (29 nodes, script_code unchanged).
- Live INT Test Mode test_networks_remittance_copy (mock_all_requests): 96 dashboard -> service dept -> 98 -> 114 (£250.00) -> 41. 0 script errors.
- Unmocked FAST + HC: NOT run. Author-portal preview with sf_Id reads no case (ends 11, blank queue); needs Salesforce context. Master / FAST / HC untouched this run.
- PROD: none.
- Score: 2/2 build items verified live in Test Mode; hard gate (unmocked) not met -> email DRAFTED, not sent.

## Files
- networks-2026-10-27/: build.py, BEFORE baseline 2026-10-27, "3 BRANCH - Networks INT 547469427 (UAT feedback 2026-10-27).json", email-ai-int-networks-diff-2026-10-27.md
- fixtures/email-ai.networks-invoice-gbp-added.org123.fixture.json, -kept

## Rollback
- Replace 547469427 with "networks-2026-10-27/3 BRANCH - Networks INT 547469427 (BEFORE baseline 2026-10-27).json".

## Notes
- INT master 109029630 shows another editor modified it ~1 day ago (not this run). Not touched.
- Gmail draft: reply-all on "Networks INT tree issue" (to Gemma; cc Charley, Alex, Brad, Aksana).
