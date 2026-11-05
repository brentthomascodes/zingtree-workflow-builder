========================================================================
WORKFLOW DIFF — API - Nearshore Small Balance Open Card
========================================================================

Before : API - Nearshore Small Balance Open Card (API v1.1).json  (31 nodes)
After  : API - Nearshore Small Balance Open Card (API v1.2).json  (32 nodes)

## PLAIN SUMMARY

29 of 32 nodes are byte-for-byte identical to the original (91% untouched).
1 node added, 0 removed, 0 renumbered, 2 modified.

In plain terms:
  + NEW      node 49 — Route: already submitted? [Scoring]
  * CHANGED  node 5 — Review and submit Cancel Card [Content]
               - button added/changed: "Submit Cancel Card to BizPay" → node 49
               - button removed/replaced: "Submit Cancel Card to BizPay" → node 35
  * CHANGED  node 48 — claude.md [Content]
               - content changed (49 → 51 lines) — claude.md

## TREE SHAPE

  node type                before    after    delta
  Content                      22       22       +0
  Data                          2        2       +0
  Scoring                       3        4       +1
  Script                        4        4       +0
  TOTAL                        31       32       +1

  Root node unchanged (node 1).

## STRUCTURAL SANITY

  No broken links introduced.
  No nodes became unreachable.
  Pre-existing in the BEFORE tree (not caused by this edit): 0 broken link(s), 1 unreachable node(s).

## UNTOUCHED NODES (29)

  1, 2, 3, 4, 6, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 34, 35, 36, 41, 42, 43, 44, 45, 46, 47

## TREE-LEVEL SETTINGS CHANGED (0)

  (none)

## COSMETIC / EDITOR-ONLY CHANGES (0) — ignore

  (none)

## LINE-LEVEL BODY DIFFS (1)

### node 48 — claude.md (content)

```diff
--- before/node 48 content
+++ after/node 48 content
@@ -13,7 +13,8 @@
 45 Route on resolution_route: approved_request -> 28 (BizPay approved date shown; agent compares with sheet date) | request_pending -> 20 | ipay_rpps_check -> 31 (manual) | client_notes_check -> 41 (manual) | else -> 4
 31, 41 -> 4
 4 Build the Cancel Card request (Script) -> 5
-5 Review and submit Cancel Card (agent confirms prefilled fields) -> 35
+5 Review and submit Cancel Card (agent confirms prefilled fields) -> 49
+49 Route: cancel_submitted == true -> 18 (no second POST after Back) | else -> 35
 35 Post Cancel Card (Data, CO 1300 bizpay__post_payment_action) -> 36
 36 Grade the Cancel Card (Script) -> 46
 46 Route: cancel_submitted == true -> 18 (disposition) -> 19 | else -> 47 (edit and resend -> 5, or done in BizPay -> 18)
@@ -26,7 +27,7 @@
 rpps_available - node 31; client_restricts_partial - node 41
 resolution, cancel_card_reason, amount, fee, payment_note - node 4, editable on node 5; read by the CO 1300 body template
 agent_email - node 4 sets system@zingtree.com (BizPay system user from Mayur, 10/22), editable on node 5; read by CO 1300
-cancel_submitted - node 36
+cancel_submitted - node 36; read by 46 and 49
 transforms.payment_html, approved_date_html (43), cancel_summary_html (4), post_result_html (36)
 
 External systems
@@ -46,4 +47,5 @@
 - API build from the 10/20 copy of tree 726245811: GET-driven routing, manual checks kept, single prefilled Cancel Card POST.
 - Reconciled with the 10/20 working session: spreadsheet checks and Galileo/Comdata research stay manual; approval date and system user pending from BizPay.
 - 10/22: partial_reissue resolution, cancel_card_request_approved_date shown on 28, agent_email defaults to system@zingtree.com.
+- 10/23: node 49 blocks a duplicate Cancel Card POST when the agent goes Back to 5 after BizPay accepted one (Jonathan's dev test, 36703751).
 - Aligned to Helena's Visio: iPay RPPS also when funding + manual load = remaining; partial check fee blank; card status date shown on the card-age check.</pre>
```

## CHANGES THAT NEED AN EXPLANATION

Every line below must map to a requirement or an explicit request.
Anything unexplained is unintended drift — revert it before delivering.

  [ ] added node 49 (Route: already submitted?)
  [ ] node 5 — button added/changed: "Submit Cancel Card to BizPay" → node 49
  [ ] node 5 — button removed/replaced: "Submit Cancel Card to BizPay" → node 35
  [ ] node 48 — content changed (49 → 51 lines) — claude.md

