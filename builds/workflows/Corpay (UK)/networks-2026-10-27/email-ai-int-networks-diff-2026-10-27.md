========================================================================
WORKFLOW DIFF — 3 BRANCH - Networks scaffold
========================================================================

Before : 3 BRANCH - Networks INT 547469427 (BEFORE baseline 2026-10-27).json  (28 nodes)
After  : 3 BRANCH - Networks INT 547469427 (UAT feedback 2026-10-27).json  (29 nodes)

## PLAIN SUMMARY

24 of 29 nodes are byte-for-byte identical to the original (83% untouched).
1 node added, 0 removed, 0 renumbered, 4 modified.

In plain terms:
  + NEW      node 118 — Build response-choice dashboard [Script]
  * CHANGED  node 48 — claude.md [Content]
               - content changed (18 → 18 lines) — claude.md
  * CHANGED  node 95 — Remittance route [Scoring]
               - button added/changed: "email_analysis_route == "in_scope"" → node 118 [logic: email_analysis_route == "in_scope"]
               - button removed/replaced: "email_analysis_route == "in_scope"" → node 96
  * CHANGED  node 96 — Remittance request - choose the response [Content]
               - content changed (133 → 102 characters) — Remittance request - choose the response
  * CHANGED  node 110 — Build remittance reply and dashboard [Script]
               - script code changed (91 → 93 lines) — Build remittance reply and dashboard

## TREE SHAPE

  node type                before    after    delta
  AI_Action                     1        1       +0
  Content                       9        9       +0
  Data                          1        1       +0
  Scoring                       4        4       +0
  Script                       12       13       +1
  Tree                          1        1       +0
  TOTAL                        28       29       +1

  Root node unchanged (node 3).

## STRUCTURAL SANITY

  No broken links introduced.
  No nodes became unreachable.
  Pre-existing in the BEFORE tree (not caused by this edit): 0 broken link(s), 1 unreachable node(s).

## UNTOUCHED NODES (24)

  3, 4, 5, 6, 7, 9, 56, 70, 71, 72, 73, 79, 91, 92, 93, 94, 97, 98, 112, 113, 114, 115, 116, 117

## TREE-LEVEL SETTINGS CHANGED (0)

  (none)

## COSMETIC / EDITOR-ONLY CHANGES (0) — ignore

  (none)

## LINE-LEVEL BODY DIFFS (3)

### node 48 — claude.md (content)

```diff
--- before/node 48 content
+++ after/node 48 content
@@ -15,4 +15,4 @@
 - 2026-10-12 scaffold (master split).
 - 2026-10-16 remittance MVP: nodes 91-98, 110, 112-117; 90 removed; Merchant Request on 4 / 9; 7 -> 91.
   Source: Gemma Danks "Daily AI standup - Fri 16th Oct" + "Networks AI tree setup" + "Phase 1 - Remittance auto email pushback".
-2026-10-19: tree script: external http(s) links open in a new tab instead of inside the widget (Gemma Danks, 19 Oct).</pre>
+2026-10-19: tree script: external http(s) links open in a new tab instead of inside the widget (Gemma Danks, 19 Oct).</pre><p>2026-10-27: invoice amount always shown with a pound sign in the service department reply (110); response-choice screen 96 now shows the case dashboard (Case Details + Original Customer Email) built by new script 118 (Gemma Danks, Networks UAT feedback 26 Oct).</p>
```

### node 96 — Remittance request - choose the response (content)

```diff
--- before/node 96 content
+++ after/node 96 content
@@ -1 +1 @@
-<p><strong>Customer request</strong></p><p>${transforms.networks_customer_email_html}</p><p>Choose the response for this request:</p>
+<p>${transforms.response_choice_html}</p><p><strong>Choose the response for this request:</strong></p>
```

### node 110 — Build remittance reply and dashboard (script code)

```diff
--- before/node 110 content
+++ after/node 110 content
@@ -3,6 +3,8 @@
 let networks_pushback_type = ZT.getVariableValue("networks_pushback_type", "general");
 let remittance_sent_date = ZT.getVariableValue("remittance_sent_date", "");
 let invoice_amount = ZT.getVariableValue("invoice_amount", "");
+// The reply always shows the amount in pounds: one leading pound sign (\u00a3), whatever the agent typed (Gemma Danks, 26 Oct).
+let invoice_amount_gbp = "\u00a3" + String(invoice_amount).trim().replace(/^\u00a3\s*/, "");
 let remittance_type = ZT.getVariableValue("remittance_type", "");
 let sf_CaseNumber = ZT.getVariableValue("sf_CaseNumber", "");
 let networks_customer_email_html = transforms.networks_customer_email_html;
@@ -23,7 +25,7 @@
   ],
   service_department: [
     "<p>Hello,</p>",
-    "<p>Thank you for your email. Please can you contact your service department and request that they upload the invoice relating to " + escapeHtml(invoice_amount) + " to the 1Link platform.</p>",
+    "<p>Thank you for your email. Please can you contact your service department and request that they upload the invoice relating to " + escapeHtml(invoice_amount_gbp) + " to the 1Link platform.</p>",
     "<p>Once this has been done, your payment can be processed.</p>",
     "<p>Kind regards,<br>Allstar Networks Support</p>"
   ]
```

## CHANGES THAT NEED AN EXPLANATION

Every line below must map to a requirement or an explicit request.
Anything unexplained is unintended drift — revert it before delivering.

  [ ] added node 118 (Build response-choice dashboard)
  [ ] node 48 — content changed (18 → 18 lines) — claude.md
  [ ] node 95 — button added/changed: "email_analysis_route == "in_scope"" → node 118 [logic: email_analysis_route == "in_scope"]
  [ ] node 95 — button removed/replaced: "email_analysis_route == "in_scope"" → node 96
  [ ] node 96 — content changed (133 → 102 characters) — Remittance request - choose the response
  [ ] node 110 — script code changed (91 → 93 lines) — Build remittance reply and dashboard

