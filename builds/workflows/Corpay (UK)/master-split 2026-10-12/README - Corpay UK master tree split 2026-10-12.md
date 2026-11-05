# Corpay UK Email AI: master tree and queue branches (INT), 2026-10-12

## Why

Corpay asked for three things:

- one Salesforce widget, pointing at one tree id
- a separate workflow per queue, so one queue can change without touching the others
- account eligibility inside each queue's workflow, because Networks will need its own corporate exclusions and a bypass

**Sources:**

- Charley Gunning, "master tree request", 12 Oct.
- Spiky standups:
  - 9/9: one widget and one tree id; route on Last Owner Queue Name.
  - 9/28: the tree id won't change; each queue gets its own tree with a routing node in the master.
  - 9/29: Networks is its own branch with its own AI Actions; unused branches stay built but switched off.
  - 10/12: two live branches for now; eligibility goes in each branch, not the master.

## Shape

```
MASTER 109029630 (id unchanged -> Salesforce widget unchanged)
  1 Start | 44-47 Test Mode (seeds every Connected Object)
  2 Get case (CO 1263) -> 58 last_owner_queue_name -> 8 queue_route -> 10 router
        -> 80 Tree: FAST Admin branch
        -> 81 Tree: Homecharge branch
        -> 82 Tree: Networks branch (scaffold; off until node 8 maps a Networks queue)
        -> 11 Queue not in scope
  Shared resources, entered from the branches by Tree node:
        34 mock? -> 35 CC lookup -> 36 prepare -> 37 expired/mock -> 38 send -> 39 grade -> 40
           -> 41 Email sent | 42 alert -> 43 Email failed | 61 Session expired
        27 -> 28 Escalation notice
        29 Case is not automated

FAST Admin branch  (root 3)
  3-7 eligibility (5 account fetch, 6 rules, 9 not eligible, 56 resolved/closed)
  12 intent AI -> 13 -> 14 -> 15 -> 16 reply AI -> 17 dashboard builder -> 52
  54 dashboard, GDPR 59-60-57-55, unrecognised 62/63/64, send path 31 -> 32/33
  exits: 70 -> master 2 | 71 -> master 34 | 72 -> master 27 | 73 -> master 29

Homecharge branch  (root 3)
  3-7 eligibility -> 18 intent AI -> 19 -> 20 -> 21 -> 24 -> 22 -> 23 -> 25 reply AI -> 26 -> 52
  30 / 53 dashboards, 62/63/64, send path 31 -> 32/33 -> 50 -> 51 providers
  exits: 70 / 71 / 72 / 73 as above

Networks branch (scaffold, root 3)
  3-7 eligibility (FAST rules + networksBypassAccounts placeholder) -> 90 holding screen
  exits 70-73 wired, ready for the Networks AI Actions
```

**Node numbers:** each branch keeps the node numbers it had in the single tree, so every diff, fixture and tracker reference still lines up.

**Data between trees:** form data, transforms and Connected Object responses are session-wide. The branches read the master's case fetch, and the master's send reads the reply and `transforms.request_form_html` that the branch built. Test Mode post-import step 3 confirms this live.

**Base:** `Email Automation - AI Actions INT (new FAST use cases - Ecopoint EPT Zero Liability 2026-10-12).json`. That is the Thursday release plus the three new FAST intents, so this split ships with the new use cases.

## Behaviour change (intended)

Queue routing now runs **before** eligibility, because eligibility lives in the branch.

A case whose Last Owner Queue Name is not FAST_Admin or Allstar_Chargepass now stops at screen 11, "Queue not in scope". Before, it would reach 9 "Not eligible" first if the account also failed.

## Offline regression

I stitched the four trees back into one graph (Tree hops became pass-throughs) and ran every Corpay UK fixture against both:

- the pre-split tree
- the stitched split family

Results:

- All 12 live-shaped org 123 journeys (FAST, GDPR, partial unrecognised, RDD, card groups, case open, admin blank, the Homecharge use cases) end on the same node.
- The 4 feedback-return fixtures, run with `--start 52`, end on the same dashboards (54 / 55 / 30 / 53).
- Session-expired, run with `--start 35`, takes the same path through 61 in both.
- The older pre-September fixtures fail identically on both, because their case-fetch shape is stale.
- The admin-blank fixture is updated to the 12 Oct wording.

## Import (Brent; the author portal does the file uploads)

1. Do this after Thursday's INT-to-PROD promote, so PROD keeps the single tree until the split is approved.
2. Create the new folder **INT** in My Workflows.
3. **New Workflow → Import**, into that folder:
   - `1 BRANCH - FAST Admin`
   - `2 BRANCH - Homecharge`
   - `3 BRANCH - Networks scaffold`

   Note the three new tree ids.
4. Tell me the three ids. I patch master Tree nodes 80, 81 and 82 (`split.py fast=<id>,homecharge=<id>,networks=<id>`) and re-run the regression.
5. **Import → Replace Workflow → 109029630** with `0 MASTER`. Rollback is Version History "Recover" on the revision before this import.
6. Apply Part B of `corpay-uk-ai-action-patches-2026-10-12.md` to AI Actions 16 and 15.

## Post-import Test Mode checks (mock_all_requests)

1. **FAST** `test_fast_admin_card_group_move`: goes master → branch → dashboard 54 → Yes → master 41, showing Not Online / Card Group/Moves.
2. **Homecharge** `test_hc_password_reset`: master → branch → 30 → master 41.
3. **Cross-tree data:** on 41, the email body and Topic show. That proves the transforms and form data written in the branch reached the master.
4. **Escalation** `test_fast_admin_escalation_blocked_action`: branch → master 28.
5. **Resolved** `test_fast_admin_case_resolved`: branch 56, then "Case reopened" → master 2.
6. **New use cases:**
   - `test_fast_admin_ecopoint` / `_extended_payment_terms` / `_zero_liability`: the dashboard shows Fee / the right Sub Topic.
   - `_failed` variants: escalation.
7. **Out of scope** `test_fast_admin_other_out_of_scope`: master 29.

## PROD (later)

When Corpay approves: three PROD branch trees in a **PROD** folder, then the master 417189428 replaced the same way. The `corpay-uk-int-to-prod` remap (CO 1263-1266 → PROD COs, AI 16/15/19/18 → 13/12/20/21, `_int` → `_prod` aliases) runs per tree. The skill needs a multi-tree pass for that, and I'll extend it before the promote.

## Switching Networks on

1. Corpay sends the Networks queue value, sender address, eligibility rules (corporate exclusions plus bypass) and use cases.
2. Add one row in master node 8: `<queue value>: "networks"`, plus the sender address.
3. Fill Networks node 6.
4. Add its intent and reply AI Actions, catalog map and dashboard.
5. Wire its send path to exit 71.
