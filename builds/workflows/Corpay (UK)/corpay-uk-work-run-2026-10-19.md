# Corpay UK work run, 2026-10-19 (INT only) - NOT deployed

## Sources (since 16/18 Oct)
- Gmail "Re: Daily AI standup - Fri 16th Oct": Gemma 19 Oct 09:58 UTC (Networks sender networksupport@allstarcard.co.uk, "Hello," greeting OK for now); 13:41/13:43 PROD "Workflow unavailable" screenshot; 14:21 session id 417189428000500WS00000dF37FYAS; Brent reply 14:51; Gemma 14:57 (example email).
- Gmail "Daily AI standup - 19th Oct": Gemma 14:30 summary; 14:59 links load inside the widget, ask for new tab; 15:57 "Fees - multi intent email layout.docx".
- Spiky "Daily stand ups - UAT testing feedback" 19 Oct 14:00 UTC (424ec955): fee layout today so Corpay can test tomorrow UK time; green light Wednesday; Salesforce admin meeting Tue.
- Tracker: no row newly ready for PROD. Charley OOO until Wed 21 Oct. No PROD items.

## Change list
| # | Item | Kind | Target | Env | Result |
|---|---|---|---|---|---|
| 1 | Multi-fee layout (Gemma doc) | AI prompt | AI 15 constraints[4] | INT | Built, NOT applied (PUT denied) |
| 2 | No video link in fee-only replies | AI prompt | AI 15 constraints[3] | INT | Built, NOT applied |
| 3 | Links open in a new tab | tree script_code | 109029630, 474162496, 698599608, 547469427 | INT | Built + Stage A clean, NOT imported |
| 4 | Networks sender networksupport@allstarcard.co.uk | tree node 8 | 109029630 | INT | Built + Stage A clean, NOT imported |
| H | RDD with Ecopoint/EPT/ZL: subheading? | - | - | - | Question |
| - | Workflow unavailable (PROD session) | investigation | - | - | Paused session (12:34) resumed by a second agent, click 4 lost; path then ended on 11 Queue not in scope. Reply sent by Brent 14:51 |

## Gates
- Live baselines: all 4 INT trees exported in the portal (captured in-page, not downloaded) and digest-compared to local files: master, FAST, Networks identical; HC identical except node 79 (portal-assigned open_tree_id 1), folded into the baseline. AI 15 live GET hash-identical to 15-after-2026-10-16.
- Stage A: lint --strict 0 errors on all 4 (warnings unchanged 18/21/26/18); co10 gate OK; env check eu OK; script_code change = appended block only; node changes = 8 (master) + 48 changelog; JS node --check OK.
- Parity: 180 walks (60 fixtures x 3 stitched graphs) before vs after: 177 identical, 3 = networks-general-fuel ai_email_from_address (intended, fixture updated to the new address, passes).
- AI Action PUT: denied by session permission -> not applied. Imports not attempted.
- Score 0 (no item verified live). Reply saved as Gmail draft, not sent.

## Files / rollback
- links-fees-2026-10-19/ (build.py, BEFORE baselines, built files, tree diffs)
- Rollback (once imported): Replace each tree with its "(BEFORE baseline 2026-10-19).json"; PUT exports/ai-actions/15-before-2026-10-19.json.

## Update 19 Oct (Brent approved: apply, import INT, test)
### Applied
- AI 15 (INT) saved via portal UI (API PUT blocked). Final: constraints hash bfee79f3e02a, context hash 5512be012376, instructions unchanged (3c116f5e0c86), temperature 0.7 unchanged. Final text = runbook exports/ai-actions/15-intended-2026-10-19.json (live re-read matches).
  - Iterations: v1 layout rule in prompt -> single fee + portal still got the multi-fee layout ~50% of runs (temperature 0.7). Final design: node 13 (FAST branch) computes fee_layout + fee_layout_instructions; the approved layout text only reaches AI 15 (context msg 1) when 2+ of Ecopoint/ZL/EPT. Prompt keeps: verbatim fee rule, one greeting, strict order (fees before Help/video), RDD full text incl. "Please let us know..." line, no video in fee-only replies.
- Imports (Replace Workflow): master 109029630, HC 698599608, Networks 547469427 = "(links new tab 2026-10-19)"; FAST 474162496 = "(fee layout v2 2026-10-19)". Re-exports digest-identical to built files (all 4).
- Stage A on fee layout v2: lint 0 errors (new warn: fee_layout* read only by AI Action, noted in claude.md), co10 OK, env eu OK, node 13 unit check (4 combos), parity 60/60.
### Live Test Mode (preview, mock_all_requests) on final build: all pass
- Single fee + portal: Order card+EPT (x2 emails, incl. one that failed on v6), Active card list+Ecopoint, Cancel card+ZL (earlier run) -> fee text verbatim incl. own "Once submitted", no intro/subheading, Help/video last.
- Multi-fee: ZL+Eco, Eco+EPT, EPT+ZL+Eco, RDD+Eco+ZL (RDD full first), Forgotten password+ZL+EPT (access closing last) -> layout per Gemma doc, 1 greeting, 1 "either or both", no video unless portal/access.
- Defaults: single ZL, multiple intents (video kept), single RDD verbatim, card pins (links http/https), copy invoice (GBP35 line kept).
- Send path (mocked): Eco+EPT -> 32 -> 41, Topic Fee / Ecopoint, sender fast.admin@.
- Links: click in reply preview opens new tab, page stays on 54 (FAST card pins, multi-fee, HC 30).
- HC password reset -> 30, sender homecharge.support@. Networks remittance copy -> 96, sender networksupport@allstarcard.co.uk.
- Not run: unmocked FAST/HC cases (no change to case fetch / routing), Salesforce-widget iframe new-tab behaviour (preview only).
### Notes
- Fee order in the section follows ZL, Ecopoint, EPT (Gemma's example order), not always the customer's order.
- Temperature change to 0.2 tried, not saved (blocked, out of scope).
- Reply to Gemma: Gmail draft r-5522892931205480287 on "Daily AI standup - 19th Oct", not sent.
- Rollback: Replace trees with "(BEFORE baseline 2026-10-19)" files; AI 15: restore 15-before-2026-10-19.json (context msg 1 back to "Requested Action: ${email_intent}", constraints 4/5).
