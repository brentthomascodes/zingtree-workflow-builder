========================================================================
WORKFLOW DIFF — 3 BRANCH - Networks scaffold
========================================================================

Before : 3 BRANCH - Networks 547469427 (BEFORE baseline 2026-10-16).json  (14 nodes)
After  : 3 BRANCH - Networks 547469427 (remittance MVP 2026-10-16).json  (28 nodes)

## PLAIN SUMMARY

9 of 28 nodes are byte-for-byte identical to the original (32% untouched).
15 nodes added, 1 removed, 0 renumbered, 4 modified.

In plain terms:
  + NEW      node 91 — Set case origin [Script]
  + NEW      node 92 — Merchant request bypass [Script]
  + NEW      node 93 — Detect remittance request [AI_Action]
  + NEW      node 94 — Grade remittance check [Script]
  + NEW      node 95 — Remittance route [Scoring]
  + NEW      node 96 — Remittance request - choose the response [Content]
  + NEW      node 97 — General pushback - details [Content]
  + NEW      node 98 — Service department pushback - details [Content]
  + NEW      node 110 — Build remittance reply and dashboard [Script]
  + NEW      node 112 — Pushback: general [Script]
  + NEW      node 113 — Pushback: service department [Script]
  + NEW      node 114 — Case review dashboard - Networks [Content]
  + NEW      node 115 — Make manual changes [Content]
  + NEW      node 116 — Remittance date valid? [Scoring]
  + NEW      node 117 — Check remittance date [Script]
  - GONE     node 90 — Networks AI is not switched on yet [Content] (was reachable from node 7)
  * CHANGED  node 4 — No account linked to the case [Content]
               - button added/changed: "Merchant Request" → node 92
  * CHANGED  node 7 — Account AI eligible? [Scoring]
               - button added/changed: "ai_account_eligibility == true" → node 91 [logic: ai_account_eligibility == true]
               - button removed/replaced: "ai_account_eligibility == true" → node 90
  * CHANGED  node 9 — Account not eligible for AI [Content]
               - button added/changed: "Merchant Request" → node 92
  * CHANGED  node 48 — claude.md [Content]
               - content changed (5 → 17 lines) — claude.md

## TREE SHAPE

  node type                before    after    delta
  AI_Action                     0        1       +1
  Content                       5        9       +4
  Data                          1        1       +0
  Scoring                       2        4       +2
  Script                        5       12       +7
  Tree                          1        1       +0
  TOTAL                        14       28      +14

  Root node unchanged (node 3).

## STRUCTURAL SANITY

  No broken links introduced.
  No nodes became unreachable.
  Pre-existing in the BEFORE tree (not caused by this edit): 0 broken link(s), 4 unreachable node(s).

## UNTOUCHED NODES (9)

  3, 5, 6, 56, 70, 71, 72, 73, 79

## TREE-LEVEL SETTINGS CHANGED (0)

  (none)

## COSMETIC / EDITOR-ONLY CHANGES (0) — ignore

  (none)

## LINE-LEVEL BODY DIFFS (1)

### node 48 — claude.md (content)

```diff
--- before/node 48 content
+++ after/node 48 content
@@ -1,5 +1,17 @@
-<pre>claude.md - Networks branch (scaffold). Root 3. Entered from master node 82, which nothing reaches until
-node 8 in the master maps a Networks Last_Owner_Queue_Name__c value to "networks".
-3-7 eligibility (node 6 = FAST rules + networksBypassAccounts placeholder; Corpay to send the corporate exclusion
-and bypass rules) -> 90 holding screen. Next: Networks intent + reply AI Actions (Corpay to create), a catalog map,
-a dashboard, then a send path -> 71. Hand-back 70-73 -> 79 -> master 100 is already wired.</pre>
+<pre>claude.md - Networks branch (INT). Root 3. Entered from master node 82 when master node 8 maps
+Last_Owner_Queue_Name__c "Networks_General" (queue id 00G4L000000efCT) to "networks".
+3-7 eligibility (node 6 = FAST rules + networksBypassAccounts placeholder).
+4 / 9 carry a "Merchant Request" button (Networks only) -> 92 sets networks_merchant_bypass + Case Origin -> 93,
+skipping the account-linked / eligibility rules. Eligible accounts: 7 -> 91.
+91 Case Origin "Zingtree AI" -> 93 AI Action automate_networks_email_intent_int -> 94 grade -> 95 router:
+  escalation -> 72 (master 27/28), remittance_copy_request -> 96, anything else -> 73 (master 29).
+96 shows the email + two buttons -> 112 / 113 set networks_pushback_type -> 97 (date + FUEL/SMR; 117/116 send a non-DD/MM/YYYY date back to 97)
+or 98 (invoice amount + FUEL/SMR) -> 110 builds the approved reply (verbatim, Phase 1 Remittance doc),
+Topic "Remittance Breakdown", Sub Topic = remittance_type, dashboard + request_form_html -> 114 dashboard
+(feedback thumbs) -> 71 send, or 115 manual changes -> 71. No generation AI Action: the two replies are fixed copy.
+Hand-back 70-73 -> 79 -> master 100.
+
+Changelog
+- 2026-10-12 scaffold (master split).
+- 2026-10-16 remittance MVP: nodes 91-98, 110, 112-117; 90 removed; Merchant Request on 4 / 9; 7 -> 91.
+  Source: Gemma Danks "Daily AI standup - Fri 16th Oct" + "Networks AI tree setup" + "Phase 1 - Remittance auto email pushback".</pre>
```

## CHANGES THAT NEED AN EXPLANATION

Every line below must map to a requirement or an explicit request.
Anything unexplained is unintended drift — revert it before delivering.

  [ ] added node 91 (Set case origin)
  [ ] added node 92 (Merchant request bypass)
  [ ] added node 93 (Detect remittance request)
  [ ] added node 94 (Grade remittance check)
  [ ] added node 95 (Remittance route)
  [ ] added node 96 (Remittance request - choose the response)
  [ ] added node 97 (General pushback - details)
  [ ] added node 98 (Service department pushback - details)
  [ ] added node 110 (Build remittance reply and dashboard)
  [ ] added node 112 (Pushback: general)
  [ ] added node 113 (Pushback: service department)
  [ ] added node 114 (Case review dashboard - Networks)
  [ ] added node 115 (Make manual changes)
  [ ] added node 116 (Remittance date valid?)
  [ ] added node 117 (Check remittance date)
  [ ] removed node 90 (Networks AI is not switched on yet)
  [ ] node 4 — button added/changed: "Merchant Request" → node 92
  [ ] node 7 — button added/changed: "ai_account_eligibility == true" → node 91 [logic: ai_account_eligibility == true]
  [ ] node 7 — button removed/replaced: "ai_account_eligibility == true" → node 90
  [ ] node 9 — button added/changed: "Merchant Request" → node 92
  [ ] node 48 — content changed (5 → 17 lines) — claude.md

