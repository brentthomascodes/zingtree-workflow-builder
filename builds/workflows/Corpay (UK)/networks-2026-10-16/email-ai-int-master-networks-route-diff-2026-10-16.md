========================================================================
WORKFLOW DIFF — Email Automation - AI Actions INT
========================================================================

Before : Email Automation - AI Actions INT 109029630 (BEFORE baseline 2026-10-16).json  (29 nodes)
After  : 0 MASTER - Email Automation - AI Actions INT 109029630 (Networks route 2026-10-16).json  (29 nodes)

## PLAIN SUMMARY

27 of 29 nodes are byte-for-byte identical to the original (93% untouched).
0 nodes added, 0 removed, 0 renumbered, 2 modified.

In plain terms:
  * CHANGED  node 8 — Resolve queue route [Script]
               - script code changed (30 → 30 lines) — Resolve queue route
  * CHANGED  node 48 — claude.md [Content]
               - content changed (11 → 12 lines) — claude.md

## TREE SHAPE

  node type                before    after    delta
  Content                      10       10       +0
  Data                          3        3       +0
  Email                         1        1       +0
  Scoring                       5        5       +0
  Script                        7        7       +0
  Tree                          3        3       +0
  TOTAL                        29       29       +0

  Root node unchanged (node 2).

## STRUCTURAL SANITY

  No broken links introduced.
  No nodes became unreachable.
  Pre-existing in the BEFORE tree (not caused by this edit): 0 broken link(s), 6 unreachable node(s).

## UNTOUCHED NODES (27)

  1, 2, 10, 11, 27, 28, 29, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 58, 61, 80, 81, 82, 100

## TREE-LEVEL SETTINGS CHANGED (0)

  (none)

## COSMETIC / EDITOR-ONLY CHANGES (0) — ignore

  (none)

## LINE-LEVEL BODY DIFFS (2)

### node 8 — Resolve queue route (script code)

```diff
--- before/node 8 content
+++ after/node 8 content
@@ -6,8 +6,8 @@
 // Declared here only. Router 10 branches on queue_route; screen 11 prints the raw value.
 const routeByQueue = {
   FAST_Admin: "fast_admin",
-  Allstar_Chargepass: "homecharge"
-  // Networks: add its Last_Owner_Queue_Name__c value here as "networks" to switch the branch on.
+  Allstar_Chargepass: "homecharge",
+  Networks_General: "networks"   // queue id 00G4L000000efCT (Networks AI tree setup, 16 Oct)
 };
 // Salesforce org-wide address each journey's reply is sent from. Connected Object
 // send_email_simple_int reads it as "senderAddress": "${ai_email_from_address}".
```

### node 48 — claude.md (content)

```diff
--- before/node 48 content
+++ after/node 48 content
@@ -8,4 +8,5 @@
 Test Mode 44-47 stays here and seeds every Connected Object, then 58 -> routing as live.
 Data crossing trees: form data, transforms and actions are session-wide; branch screens 32/33 build transforms.request_form_html that node 36 reads.
 Switch Networks on: one row in node 8 (queue value -> "networks") plus its sender address.
-Full history before the split: the 12 Oct pre-split file's claude.md (node 48).</pre>
+Full history before the split: the 12 Oct pre-split file's claude.md (node 48).
+2026-10-16: node 8 routes Networks_General (queue id 00G4L000000efCT) to the Networks branch (82). Networks sender address still blank: Corpay to confirm.</pre>
```

## CHANGES THAT NEED AN EXPLANATION

Every line below must map to a requirement or an explicit request.
Anything unexplained is unintended drift — revert it before delivering.

  [ ] node 8 — script code changed (30 → 30 lines) — Resolve queue route
  [ ] node 48 — content changed (11 → 12 lines) — claude.md

