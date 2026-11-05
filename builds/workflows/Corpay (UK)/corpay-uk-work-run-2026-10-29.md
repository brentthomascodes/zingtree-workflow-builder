# Corpay UK work run 2026-10-29

## Sources
- Gmail "Networks INT tree issue": Charley 28 Oct 13:49 / 14:47 GMT (threading to INT); Gemma 28 Oct 16:50 GMT (attachment button; question prompts).
- Gmail "Daily AI standup - 29th Oct", Gemma 14:43 GMT: INT now = full thread, Networks date + invoice amount optional (others stay required); INT & PROD = remove multi-intent text box, keep banner + make manual changes.
- Spiky "Daily stand ups - UAT testing feedback" 29 Oct (49824243): threading INT now, earlier PROD release once tested; thread ID removed; half rollback of free text box; corporate override field pending legal; testing at 3pm.
- Tracker: sheet read returns sample rows only; no new ready-for-PROD rows visible.

## Change list
| # | Ask | Kind | Target | Env | Result |
|---|---|---|---|---|---|
| 1 | Read full thread, answer latest email | CO 23 SELECT + tree + AI | CO 23 +TextBody/MessageDate; master 2->83->84->58, 47; AI 16/15/19/18/23 context | INT | Live, published. Unmocked FAST (...OgmIAE -> 54, real INT send -> 41) and HC (...JwIAK -> 30) read live EmailMessage |
| 2 | Networks attachment button | tree | Networks 96 + new 119 | INT | Live Test Mode -> 29 with reason |
| 3 | Networks date / invoice optional | tree | Networks 97/98 required=0, 117, 110 | INT | Live Test Mode blank date -> 114 -> 41 FUEL, clause dropped |
| 4 | Multi-intent text box removed, banner kept | tree | FAST 17 / HC 26 (INT 474162496/698599608, PROD 450053608/496283193) | INT + PROD | INT + PROD Test Mode partial_unrecognised -> 54/30 with banner, no box |
| 5 | Thread ID off customer email | CO 187 body | addThreadingTokenToBody false (subject token kept) | INT | Saved, re-read; real INT send OK |
| held | Question prompts | - | - | - | Covered by optional fields? asked |
| held | Thread ID PROD, threading PROD | - | - | PROD | After Corpay INT testing |
| held | Corporate override field, Post tab | - | - | - | Waiting on field name / Gemma next week |

## AI Action wording note
First wording ("Most recent email ... decide on this email") made HC multi-intent escalate 2/2 (A/B: original wording -> 53 2/2). Final wording keeps the original labels, only swaps Case.Description for ${latest_customer_email} and adds the earlier-emails context line; HC multi-intent -> 53 2/2.

## Gates
- Stage A: lint 0 errors on all 7 built trees; co10 OK; env check eu / eu_prod OK; PROD zero _int; tree_diff = change list only.
- Parity: all live-shaped org123 fixtures same end node INT before/after; intended diffs = new fixtures (thread x3, networks attachment/date-blank/invoice-blank); partial-unrecognised path skips 62 (same end 41). PROD fixture walk not usable (fails before/after alike at node 17 on fixture shape) - relied on identical patch + live smoke.
- Re-exports match built files node-for-node: INT master, Networks, FAST, HC; PROD FAST, HC. AI 15/16/18/19/23 re-read = intended. CO 23 / CO 187 re-read = intended.
- Live INT sweep: 50/50 scenarios with first wording, 0 script errors; after final wording re-ran 17 FAST + partials + networks + HC multi, 0 errors. Not every scenario re-run on final wording.
- Unmocked INT FAST + HC: pass.
- PROD smoke (mock_all_requests): partial FAST/HC, active card list -> 41 Online / Active Card List, HC password reset -> 30. 0 errors. Unmocked PROD case: NOT run.
- Score: 5/5 items verified live, but two gates incomplete (full re-sweep on final wording, unmocked PROD) -> reply DRAFTED (r-3249047705753696296), not sent.

## Rollback
- INT master: Replace 109029630 with threading-2026-10-29/0 MASTER INT 109029630 (BEFORE baseline 2026-10-29).json
- INT Networks: networks-2026-10-29/3 BRANCH - Networks INT 547469427 (BEFORE baseline 2026-10-29).json
- INT FAST / HC: threading-2026-10-29/{1,2} ... (BEFORE baseline 2026-10-29).json
- PROD FAST / HC: multi-intent-2026-10-29/{1,2} ... PROD ... (BEFORE baseline 2026-10-29).json
- AI Actions: runbook exports/ai-actions/{15,16,18,19,23}-before-2026-10-29.json (context only changed)
- CO 23: remove TextBody, MessageDate. CO 187: addThreadingTokenToBody true (exports/connected-objects/187-before-2026-10-29.json)

## Found, not fixed
- Master node 36 throws when CO 23 returns zero records (case with no inbound EmailMessage reaching send). Pre-existing.
