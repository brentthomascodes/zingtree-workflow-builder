# Corpay UK Email AI - live test pass, 2026-09-30

Both trees run in the Zingtree preview (draft, unpublished) from node 1 -> Test Mode, AI Actions live.
Driven scenario by scenario in Chrome; every screen's buttons clicked as an agent would.

| Tree | Mock scope | Scenarios | Email sent (41) | Escalation (28) | Script errors |
|---|---|---|---|---|---|
| PROD 417189428 | mock_all_requests | 31 + 4 re-checks | 20 | 11 | 0 |
| INT 109029630 | mock_case_fetch_only (account, CC and send live) | 34 | 26 | 8 | 0 |

INT live: 26 real emailSimple sends, all graded success, to the Test Mode addresses
(test.customer@ / test.driver@example.co.uk), logged on case 500Ad00000dG5JwIAK.

## Results (same in both trees unless noted)
- FAST Admin, 12 single intents -> 41, Topic / Sub Topic correct, incl. **Online / Replacement cards**
- FAST multiple intents -> screen 32 -> 41
- FAST escalation blocked action / card count -> 28 with the AI's reason
- FAST other / out of scope -> 28 ("Intent does not match ...")
- GDPR button -> 59 -> 55 -> 41. INT: "jane smith and TOM o'neill" -> **"Jane Smith, Tom O'Neill"** (AI Action 22). PROD: names as typed (expected)
- INT case_resolved (Status Resolved) -> AI runs -> 41 (gate is on placeholders, expected)
- HC password reset -> 41; password reset failed -> 28
- HC tariff standard / octopus / failing -> 21 -> 41, variant matches the scenario
- HC missing charges (stock email) -> 28: AI reads the stock email as a complaint (known since 24 Sep, AI judgment, not the tree)
- HC missing charges with screenshots -> 53 -> Yes -> 41, and "No - screenshots are already attached" -> 28 (PROD re-check)
- HC update charger details -> 41. PROD HTML checked: "Here, instructions..." is a <p>, reset steps an <ol>, "Need further help?" its own line
- HC payment query DD increase -> 41; underpayment -> 21 -> 23 -> 41 with "24.5p p/kWh" in the sent body, no [INSERT] left
- INT compatible chargers -> 41 (HC-Not Online / Compatible Chargers); resent onboarding -> 41 (HC-Online / Resent Onboarding Email)
- HC multiple intents (stock email) -> 28: AI escalates the missing-charges half (same AI judgment as above)
- HC fleet requester -> 41; complaint -> 28; other -> 28

## Mock data
- Test Mode seeds (node 47, both trees): records + _zt_meta only, CO 10 fields only. No totalSize / done / attributes / ContactId.
- Real-data gate (co10_gate.py) and response contract: pass on both trees.
- 33 fixtures cleaned of totalSize / done / Business_Process__c / ContactId.

## Observations (not failures)
- Screen 21's approved-reply select opens blank; the AI's suggestion is listed first but not pre-selected, so the agent must pick it.
- Screen 51's provider selects open blank (by design: no guessing).

## Not covered live
- Case status gate firing (placeholders until Alex sends the Status values)
- AS Account Administrator blank (needs a real account with a blank admin; offline fixture passes)
- PROD unmocked run (asked for mock-all on PROD)
