# Corpay UK work run, 2026-10-20 - NOT deployed (live change blocked)

## Sources
- Gmail "Re: [EXTERNAL] Scheduling conflict", Gemma 20 Oct 14:33 UTC: 4 PROD examples + 2 INT asks + ask for AI behaviour explanation.
- Spiky "Daily stand ups - UAT testing feedback" 20 Oct (daca46a4), Gemma + Aksana: "I don't feel confident in the explanation of its patterns and behaviour".
- Tracker: not re-read this run (no PROD items possible: Charley OOO until Wed 21).

## PROD diagnosis (session detail, eu.zingtree.com/tree/usage-session-detail.php)
Root cause for all 4: case reopened hours/days later, session resumed (tree session_resume_timeout 0), transforms (1 h) and CO cache expired. Stale guard exists only at node 36/37 (send).
- dHcQdYAK / 02992166: 15:32:46 on node 62, resumed 20th. Loop 62->63->16->62 x3: intent = add_update_contact_details AND ai_exception_reason "customer is asking to update their address details" (unrecognised_review_needed stays true).
- dAUOGYA4 / 02990440: 21:36:31 on node 5, second agent resumed, node 6 on expired account data -> 9. "Workflow Unavailable" = platform message, not tree.
- dFhUVYA0 / 02992166: 10:51:48 on 54, GDPR by second agent -> 57 reads transforms.gdpr_request_form_html (expired) -> 33 blank.
- dQmLvYAK / 02995485: session 15 Oct, reopened 20 Oct -> node 21 select fed by transforms.hc_variant_options (expired) -> empty. Node 19 logic correct (tariff group, octopus pre-selected).

## Change list
| # | Item | Kind | Target | Env | Result |
|---|---|---|---|---|---|
| 1 | No "I can see that you want to" in multi-intent | AI prompt | AI 15 constraints[5] | INT | Built, NOT applied (PUT blocked by permission classifier twice) |
| 2 | "Note:" sentences own paragraph, bold | AI prompt | AI 15 constraints[6] | INT | Built, NOT applied |
| P1 | Stale-session restart on every screen | tree | master + branches | INT then PROD (needs approval) | Proposed only |
| P2 | Stop node 62 loop when exception restates the recognised intent | tree/AI 16 | INT | Proposed only |
| Q | Temperature 0.7 -> 0.2 on reply AI | AI prompt | AI 15 | - | Question for 21 Oct call |

## Gates
- AI 15 live GET hash = 15-intended-2026-10-19 (c 7a84762968ed, i bb8cd2462ffd, x e731f7622407). New intended constraints hash 3f4401b0e695.
- Score 0 (nothing live). Reply saved as Gmail draft r5051061365085281097, not sent.

## Files
- runbook exports/ai-actions/15-before-2026-10-20.json, 15-intended-2026-10-20.json
- Rollback: PUT 15-before-2026-10-20.json
