========================================================================
WORKFLOW DIFF — Email Automation - AI Actions INT
========================================================================

Before : 0 MASTER INT 109029630 (BEFORE baseline 2026-11-03).json  (31 nodes)
After  : 0 MASTER INT 109029630 (business personal test mode 2026-11-03).json  (31 nodes)

## PLAIN SUMMARY

27 of 31 nodes are byte-for-byte identical to the original (87% untouched).
0 nodes added, 0 removed, 0 renumbered, 4 modified.

In plain terms:
  * CHANGED  node 44 — Test mode - pick a scenario [Content]
               - form field settings changed (same field names)
  * CHANGED  node 45 — Load example email [Script]
               - script code changed (222 → 230 lines) — Load example email
  * CHANGED  node 47 — Seed mocked Salesforce data [Script]
               - script code changed (115 → 115 lines) — Seed mocked Salesforce data
  * CHANGED  node 48 — claude.md [Content]
               - content changed (14 → 15 lines) — claude.md

## TREE SHAPE

  node type                before    after    delta
  Content                      10       10       +0
  Data                          4        4       +0
  Email                         1        1       +0
  Scoring                       5        5       +0
  Script                        8        8       +0
  Tree                          3        3       +0
  TOTAL                        31       31       +0

  Root node unchanged (node 2).

## STRUCTURAL SANITY

  No broken links introduced.
  No nodes became unreachable.
  Pre-existing in the BEFORE tree (not caused by this edit): 0 broken link(s), 6 unreachable node(s).

## UNTOUCHED NODES (27)

  1, 2, 8, 10, 11, 27, 28, 29, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 46, 58, 61, 80, 81, 82, 83, 84, 100

## TREE-LEVEL SETTINGS CHANGED (0)

  (none)

## COSMETIC / EDITOR-ONLY CHANGES (0) — ignore

  (none)

## LINE-LEVEL BODY DIFFS (3)

### node 45 — Load example email (script code)

```diff
--- before/node 45 content
+++ after/node 45 content
@@ -126,6 +126,14 @@
   test_hc_multiple_intents: {
     subject: "Two things please",
     body: "Hi,\n\nTwo things if possible. First, I can't get into my account and need a password reset. Second, my charge sessions are not appearing for the last month.\n\nThanks,\nOwen Bradshaw"
+  },
+  test_hc_business_personal_driver: {
+    subject: "Home charger for work and personal use",
+    body: "Hi,\n\nI use my EV for business and personal and charge it at home. I need business charging separated from personal so I can claim only business charging.\n\nHow do I do this?\n\nThanks,\nDaniel Hughes"
+  },
+  test_hc_business_personal_fleet: {
+    subject: "Driver has two EVs at home",
+    body: "Hello,\n\nI manage the fleet for Brookfield Services. One of our drivers, Amy Clarke, has two EVs at home and needs both vehicles linked to the account. She charges for work and personal use.\n\nCan you enable multi EV mode for her?\n\nKind regards,\nMark Ellis\nFleet Manager"
   },
   test_hc_fleet_requester: {
     subject: "Driver tariff update on behalf of driver",
```

### node 47 — Seed mocked Salesforce data (script code)

```diff
--- before/node 47 content
+++ after/node 47 content
@@ -62,7 +62,7 @@
     ccAddress: null,
     // Only the fleet scenario mocks a linked Contact - that is what the driver / fleet
     // default on screen 21 reads.
-    accountAdmin: "AS HC1", contactId: test_intent === "test_hc_fleet_requester" ? "003Ad00000MOCK0001" : null
+    accountAdmin: "AS HC1", contactId: (test_intent === "test_hc_fleet_requester" || test_intent === "test_hc_business_personal_fleet") ? "003Ad00000MOCK0001" : null
   }
 };
 let mockCase = mockCaseByRoute[route];
```

### node 48 — claude.md (content)

```diff
--- before/node 48 content
+++ after/node 48 content
@@ -11,4 +11,5 @@
 Full history before the split: the 12 Oct pre-split file's claude.md (node 48).
 2026-10-16: node 8 routes Networks_General (queue id 00G4L000000efCT) to the Networks branch (82). Test Mode: test_networks_remittance_copy / _remittance_wrong / _other_out_of_scope / _merchant_ineligible (44/45/47). Networks sender address still blank: Corpay to confirm.
 2026-10-19: tree script: external http(s) links open in a new tab instead of inside the widget (Gemma Danks, 19 Oct). Node 8: Networks sender address networksupport@allstarcard.co.uk (Gemma Danks, 19 Oct).
-2026-10-29: email threading for the INT AI Actions (Charley Gunning, 28 Oct): 2 -> new Data 83 (CO 23, SELECT now includes TextBody + MessageDate) -> new script 84 -> 58. 84 stages latest_customer_email (newest inbound EmailMessage, falls back to Case.Description) and thread_context_emails (the rest, newest first, 4000 chars each). Test Mode 47 stages the test email as latest. AI Actions 16 / 15 / 19 / 18 / 23 read these instead of Case.Description (they are consumed by the AI Actions by name, not by a node). CO 23 now sits on 83 and 35 on purpose: 83 feeds the AI Actions at the start, 35 re-reads the CC list at send time (a resumed session may be past the cache TTL).</pre>
+2026-10-29: email threading for the INT AI Actions (Charley Gunning, 28 Oct): 2 -> new Data 83 (CO 23, SELECT now includes TextBody + MessageDate) -> new script 84 -> 58. 84 stages latest_customer_email (newest inbound EmailMessage, falls back to Case.Description) and thread_context_emails (the rest, newest first, 4000 chars each). Test Mode 47 stages the test email as latest. AI Actions 16 / 15 / 19 / 18 / 23 read these instead of Case.Description (they are consumed by the AI Actions by name, not by a node). CO 23 now sits on 83 and 35 on purpose: 83 feeds the AI Actions at the start, 35 re-reads the CC list at send time (a resumed session may be past the cache TTL).
+2026-11-02: Test Mode scenarios test_hc_business_personal_driver / test_hc_business_personal_fleet (44, 45; 47 mocks a Contact for the fleet one) for hc_business_personal_charges (Gemma Danks, 2 Nov).</pre>
```

## CHANGES THAT NEED AN EXPLANATION

Every line below must map to a requirement or an explicit request.
Anything unexplained is unintended drift — revert it before delivering.

  [ ] node 44 — form field settings changed (same field names)
  [ ] node 45 — script code changed (222 → 230 lines) — Load example email
  [ ] node 47 — script code changed (115 → 115 lines) — Seed mocked Salesforce data
  [ ] node 48 — content changed (14 → 15 lines) — claude.md

