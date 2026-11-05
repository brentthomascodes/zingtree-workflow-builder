========================================================================
WORKFLOW DIFF — Email Automation - AI Actions Prod
========================================================================

Before : 0 MASTER PROD 417189428 (BEFORE baseline 2026-11-03).json  (28 nodes)
After  : 0 MASTER PROD 417189428 (email threading 2026-11-03).json  (30 nodes)

## PLAIN SUMMARY

25 of 30 nodes are byte-for-byte identical to the original (83% untouched).
2 nodes added, 0 removed, 0 renumbered, 3 modified.

In plain terms:
  + NEW      node 83 — Get email thread [Data]
  + NEW      node 84 — Stage email thread [Script]
  * CHANGED  node 2 — Get case and inbound email [Data]
               - continuation_node_id: 58 → 83 — Get case and inbound email
  * CHANGED  node 47 — Seed mocked Salesforce data [Script]
               - script code changed (103 → 107 lines) — Seed mocked Salesforce data
  * CHANGED  node 48 — claude.md [Content]
               - content changed (14 → 15 lines) — claude.md

## TREE SHAPE

  node type                before    after    delta
  Content                      10       10       +0
  Data                          3        4       +1
  Email                         1        1       +0
  Scoring                       5        5       +0
  Script                        7        8       +1
  Tree                          2        2       +0
  TOTAL                        28       30       +2

  Root node unchanged (node 2).

## STRUCTURAL SANITY

  No broken links introduced.
  No nodes became unreachable.
  Pre-existing in the BEFORE tree (not caused by this edit): 0 broken link(s), 6 unreachable node(s).

## UNTOUCHED NODES (25)

  1, 8, 10, 11, 27, 28, 29, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 58, 61, 80, 81, 100

## TREE-LEVEL SETTINGS CHANGED (0)

  (none)

## COSMETIC / EDITOR-ONLY CHANGES (0) — ignore

  (none)

## LINE-LEVEL BODY DIFFS (2)

### node 47 — Seed mocked Salesforce data (script code)

```diff
--- before/node 47 content
+++ after/node 47 content
@@ -68,6 +68,10 @@
 ZT.setFormData("caseId", caseId);
 ZT.setFormData("sf_CaseNumber", mockCase.caseNumber);
 ZT.setFormData("sf_Subject", test_subject);
+// Test Mode has no EmailMessages: the edited test email is the latest email, with no earlier thread (node 84 does this on a live case).
+ZT.setFormData("latest_customer_email", description);
+ZT.setFormData("thread_context_emails", "");
+ZT.setFormData("thread_email_count", "0");
 // Live launches carry the case Contact as sf_ContactId (Salesforce app); node 19 reads it.
 ZT.setFormData("sf_ContactId", mockCase.contactId || "");
 
```

### node 48 — claude.md (content)

```diff
--- before/node 48 content
+++ after/node 48 content
@@ -11,4 +11,5 @@
 Full history before the split: the 12 Oct pre-split file's claude.md (node 48).
 2026-10-16: node 8 routes Networks_General (queue id 00G4L000000efCT) to the Networks branch (82). Test Mode: test_networks_remittance_copy / _remittance_wrong / _other_out_of_scope / _merchant_ineligible (44/45/47). Networks sender address still blank: Corpay to confirm.
 2026-10-19: tree script: external http(s) links open in a new tab instead of inside the widget (Gemma Danks, 19 Oct). Node 8: Networks sender address networksupport@allstarcard.co.uk (Gemma Danks, 19 Oct).
-2026-10-21: PROD release (master split: FAST Admin + Homecharge branches; Ecopoint / Extended Payment Terms / Zero Liability). Not in PROD: Networks route + branch, links-in-new-tab script, RDD sentiment scenarios.</pre>
+2026-10-21: PROD release (master split: FAST Admin + Homecharge branches; Ecopoint / Extended Payment Terms / Zero Liability). Not in PROD: Networks route + branch, links-in-new-tab script, RDD sentiment scenarios.
+2026-11-02: email threading to PROD (INT 29 Oct build, approved Alex Godfrey / Gemma Danks standup 2 Nov): 2 -> new Data 83 (CO 24, SELECT + TextBody, MessageDate) -> new script 84 -> 58. 84 stages latest_customer_email / thread_context_emails for AI Actions 13 / 12 / 20 / 21. Test Mode 47 stages the test email as latest.</pre>
```

## CHANGES THAT NEED AN EXPLANATION

Every line below must map to a requirement or an explicit request.
Anything unexplained is unintended drift — revert it before delivering.

  [ ] added node 83 (Get email thread)
  [ ] added node 84 (Stage email thread)
  [ ] node 2 — continuation_node_id: 58 → 83 — Get case and inbound email
  [ ] node 47 — script code changed (103 → 107 lines) — Seed mocked Salesforce data
  [ ] node 48 — content changed (14 → 15 lines) — claude.md

