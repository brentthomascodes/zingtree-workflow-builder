# Corpay UK work run 2026-11-05 - INT + PROD LIVE, reply DRAFTED (score 0.8)

## Sources
- Gmail "Daily AI standup - 4th Nov" (Charley, 4 Nov 16:30 UTC): form fields Case number (hidden), Invoice Amount, Merchant ID Number.
- Gmail "Daily AI standup - 5th Nov" (Gemma, 5 Nov 17:06 UTC): PROD today = thread string off AI emails + General pushback "payment amount"; INT = 'toggle' keyword, driver vs fleet rules (keep dropdown); demos: Networks form (Fri), business impact (Tue).
- Spiky 5 Nov standup aa5be093: same; Bailey: all Business/Personal tests came through as driver; no-reply sender for the form email; SF Opp sessions missing from Execution Insights -> engineering.
- Tracker: nothing new ready for PROD.

## Change list
| # | Ask | Target | Env | Result |
|---|---|---|---|---|
| 1 | General pushback "payment amount" | Networks 110 (INT 547469427, PROD 124295894) | INT + PROD | LIVE. Re-exports = built files. INT + PROD (/show/, published) line verified on 114 -> 41 |
| 2 | Thread string off AI emails | CO 203 addThreadingTokenToBody true -> false (subject token kept), as INT CO 187 since 29 Oct | PROD | PUT 200, re-read = intended (payload only). Not verified by a real PROD send |
| 3 | 'toggle' keyword | AI 19 intent definition + rule + Gemma's example | INT | LIVE. test_hc_business_personal_toggle -> Business/Personal, driver reply (2/2) |
| 4 | Driver vs fleet | AI 19 variant rule (fleet signals) + 2 worked examples | INT | LIVE. fleet_employee -> fleet (2/2), fleet -> fleet, driver -> driver; underpayment still Payment Query; HC multi-intent -> 53 |
| 5 | Networks reply form demo | new tree 385934784 "Networks reply form (demo)" (INT, org 123) | INT | LIVE. Real INT case 500Ad00000dG5JwIAK (02720207): form -> real send OK -> thanks (10). Fixtures happy / no-case / send-fails pass |
| held | Business impact demo | - | - | Tue |
| held | SF Opp missing from Execution Insights (tree 920171070) | - | - | Email to Aksana DRAFTED (r-1832092804311842228), not sent |

## AI 19 patch (INT)
- instructions[8] (hc_business_personal_charges): + phrases "Forgot to toggle my charges", "Haven't toggled my business and personal charges", "Need to toggle my charges to business", "Switch my charging sessions between business and personal"; + "Toggle / toggled / toggling charges always means hc_business_personal_charges. When the customer links a lower payment or reimbursement to not having toggled their business and personal charges, return hc_business_personal_charges only, not hc_payment_query."
- instructions[9] variant lines replaced: before "driver_multi_ev_pushback: the email is from a driver talking about their own account." / "fleet_manager_multi_ev_response: the email is from a fleet manager writing on behalf of a driver." -> after: fleet signals (third person driver, on behalf of, fleet / company vehicles / several drivers, fleet/transport/HR/finance/operations sign-off, any one is enough); driver = own charging and no fleet signal.
- constraints[6] worked examples +3 (Transport Manager employee -> fleet; "one of our drivers forgot to toggle" -> fleet; Gemma's toggle example -> Business/Personal, driver).
- Server normalised outputFormat "json" -> "JSON" on PUT.
- Before object: author-portal browser localStorage corpay_ai_before_2026-11-05_19.

## Trees
- INT master 109029630: Test Mode +test_hc_business_personal_toggle, +test_hc_business_personal_fleet_employee (44, 45), 48 changelog. Re-export = built, 25 predefined vars.
- Live baselines (export hash) matched the 4 Nov built files for 547469427, 124295894, 417189428, 109029630 before any change.

## Tests
- INT unmocked: FAST 500Ad00000c1OgmIAE -> 54, HC 500Ad00000dG5JwIAK -> 30.
- PROD published (/show/417189428): networks copy -> 96 -> 114 (new line) -> 41; fast active card list -> 54 -> 41; hc password reset -> 30. 0 errors.

## Gates / score
- Hard gates pass. Score 4/5 = 0.8 (item 2 has no real-send proof in PROD; a PROD send would email a real customer). Below 0.9 -> reply DRAFTED (r-2823324595578236675) on "Daily AI standup - 5th Nov", not sent.

## Rollback
- Networks INT / PROD: Replace with release-2026-11-05/3 BRANCH - Networks ... (BEFORE baseline 2026-11-05).json, publish PROD.
- INT master: release-2026-11-05/0 MASTER INT 109029630 (BEFORE baseline 2026-11-05).json.
- CO 203: addThreadingTokenToBody back to true (before object in localStorage corpay_co_before_2026-11-05_203).
- AI 19: reverse the text ops above, or localStorage corpay_ai_before_2026-11-05_19.
- Form demo 385934784: standalone, delete or leave.

## Notes
- Workspace moved to ~/zingtree mid-run; old connected folder showed empty. Files for today written there.
- Demo form sends from networksupport@ (no-reply address not provided yet); confirmation copy is demo text.
