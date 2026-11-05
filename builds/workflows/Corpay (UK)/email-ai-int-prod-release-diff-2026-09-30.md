========================================================================
WORKFLOW DIFF — Email Automation - AI Actions INT
========================================================================

Before : Email Automation - AI Actions INT (BEFORE baseline 2026-09-30).json  (58 nodes)
After  : Email Automation - AI Actions INT (PROD release 2026-09-30).json  (58 nodes)

## PLAIN SUMMARY

55 of 58 nodes are byte-for-byte identical to the original (95% untouched).
0 nodes added, 0 removed, 0 renumbered, 3 modified.

In plain terms:
  * CHANGED  node 3 — Account linked to case? [Scoring]
               - button added/changed: "actions.sfdc_int__case_email_ai.records[0].AccountId != null" → node 5 [logic: actions.sfdc_int__case_email_ai.records[0].AccountId != null]
               - button removed/replaced: "actions.sfdc_int__case_email_ai.records[0].Account" → node 5
  * CHANGED  node 17 — Build case review dashboard [Script]
               - script code changed (292 → 292 lines) — Build case review dashboard
  * CHANGED  node 48 — claude.md [Content]
               - content changed (691 → 694 lines) — claude.md

## TREE SHAPE

  node type                before    after    delta
  AI_Action                     4        4       +0
  Content                      21       21       +0
  Data                          4        4       +0
  Email                         1        1       +0
  Scoring                      12       12       +0
  Script                       16       16       +0
  TOTAL                        58       58       +0

  Root node unchanged (node 2).

## STRUCTURAL SANITY

  No broken links introduced.
  No nodes became unreachable.
  Pre-existing in the BEFORE tree (not caused by this edit): 0 broken link(s), 6 unreachable node(s).

## UNTOUCHED NODES (55)

  1, 2, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 49, 50, 51, 52, 53, 54, 55, 57, 58, 59

## TREE-LEVEL SETTINGS CHANGED (0)

  (none)

## COSMETIC / EDITOR-ONLY CHANGES (0) — ignore

  (none)

## LINE-LEVEL BODY DIFFS (2)

### node 17 — Build case review dashboard (script code)

```diff
--- before/node 17 content
+++ after/node 17 content
@@ -32,7 +32,7 @@
   visa_card_activation:        { topic: "Online",     subtopic: "VISA Card Activation" },
   new_user_request:            { topic: "Online",     subtopic: "New User Request" },
   copy_invoice:                { topic: "Online",     subtopic: "Copy Invoice" },
-  replacement_card:            { topic: "Online",     subtopic: "Replacements Cards" },
+  replacement_card:            { topic: "Online",     subtopic: "Replacement cards" },
   card_pins:                   { topic: "Online",     subtopic: "Card PIN(s)" },
   transaction_report:          { topic: "Online",     subtopic: "Transaction Report" },
   forgotten_password:          { topic: "Online",     subtopic: "Forgotten Password" },
```

### node 48 — claude.md (content)

```diff
--- before/node 48 content
+++ after/node 48 content
@@ -457,6 +457,9 @@
   points at. Importing it as a new tree means updating the layout.
 
 ## Changelog
+- 2026-09-30 Claude - PROD release prep (standup 30 Sep): node 17's replacement_card Sub Topic spelled
+  "Replacement cards" (Gemma's matrix; "Replacements Cards" did not map onto the Case). Node 3's AccountId
+  button label now matches its expression (the label read records[0].Account, not a real CO 10 field).
 - 2026-09-29 Claude - live test pass (real CO 10 responses): Case.Description is plain text, not HTML.
   Nodes 17, 19 and 26 now escape it and keep its line breaks (it was dropped into the dashboards raw, so
   paragraphs collapsed and any < or & in a customer email rendered as markup); node 47 seeds it as plain
```

## CHANGES THAT NEED AN EXPLANATION

Every line below must map to a requirement or an explicit request.
Anything unexplained is unintended drift — revert it before delivering.

  [ ] node 3 — button added/changed: "actions.sfdc_int__case_email_ai.records[0].AccountId != null" → node 5 [logic: actions.sfdc_int__case_email_ai.records[0].AccountId != null]
  [ ] node 3 — button removed/replaced: "actions.sfdc_int__case_email_ai.records[0].Account" → node 5
  [ ] node 17 — script code changed (292 → 292 lines) — Build case review dashboard
  [ ] node 48 — content changed (691 → 694 lines) — claude.md

