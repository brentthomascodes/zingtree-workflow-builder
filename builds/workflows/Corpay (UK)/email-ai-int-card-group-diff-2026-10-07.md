========================================================================
WORKFLOW DIFF — Email Automation - AI Actions INT
========================================================================

Before : Email Automation - AI Actions INT (BEFORE baseline 2026-10-07).json  (64 nodes)
After  : Email Automation - AI Actions INT (card group topic fix 2026-10-07).json  (64 nodes)

## PLAIN SUMMARY

62 of 64 nodes are byte-for-byte identical to the original (97% untouched).
0 nodes added, 0 removed, 0 renumbered, 2 modified.

In plain terms:
  * CHANGED  node 17 — Build case review dashboard [Script]
               - script code changed (310 → 310 lines) — Build case review dashboard
  * CHANGED  node 48 — claude.md [Content]
               - content changed (773 → 777 lines) — claude.md

## TREE SHAPE

  node type                before    after    delta
  AI_Action                     5        5       +0
  Content                      24       24       +0
  Data                          4        4       +0
  Email                         1        1       +0
  Scoring                      13       13       +0
  Script                       17       17       +0
  TOTAL                        64       64       +0

  Root node unchanged (node 2).

## STRUCTURAL SANITY

  No broken links introduced.
  No nodes became unreachable.
  Pre-existing in the BEFORE tree (not caused by this edit): 0 broken link(s), 6 unreachable node(s).

## UNTOUCHED NODES (62)

  1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, 62, 63, 64

## TREE-LEVEL SETTINGS CHANGED (0)

  (none)

## COSMETIC / EDITOR-ONLY CHANGES (0) — ignore

  (none)

## LINE-LEVEL BODY DIFFS (2)

### node 17 — Build case review dashboard (script code)

```diff
--- before/node 17 content
+++ after/node 17 content
@@ -41,7 +41,7 @@
   lost_or_stolen_card:         { topic: "Online",     subtopic: "Lost & Stolen" },
   account_unlock:              { topic: "Online",     subtopic: "Account Unlock" },
   add_update_contact_details:  { topic: "Not Online", subtopic: "Add/Update Contact Details" },
-  card_group_move:             { topic: "Not Online", subtopic: "Card Group/Moves" },
+  card_group_move:             { topic: "Online",     subtopic: "Card Group/Moves" },
   returned_direct_debit:       { topic: "Fee",        subtopic: "Returned direct debit" }
 };
 const intentKeys = Object.keys(salesforceByIntent);
```

### node 48 — claude.md (content)

```diff
--- before/node 48 content
+++ after/node 48 content
@@ -302,7 +302,7 @@
     Replacements Cards (were Cancel card, VISA Card activation, Replacement cards). VISA Card
     Activation is still kept off screen 33's list, as before.
 Adding a live intent is still one row in its lane's map; the form and the filter read the map.
-Matrix rows with no live intent (e.g. Charger Offline, Card Group/Moves) are deliberately not
+Matrix rows with no live intent (e.g. Charger Offline) are deliberately not
 offered.
 
 ## Conventions and gotchas
@@ -492,6 +492,10 @@
   points at. Importing it as a new tree means updating the layout.
 
 ## Changelog
+- 2026-10-07 Claude - Gemma Danks, 7 Oct: card_group_move maps to Topic Online / Sub Topic
+  Card Group/Moves (the use case doc had Not Online by mistake). Node 17 row only. Returned direct
+  debit stays Fee / Returned direct debit (Charley Gunning, 6 Oct). Thursday's PROD release (screen
+  61, feedback Submit, Resent Onboarding Email) promoted from this tree the same day.
 - 2026-10-06 Claude - standup 6 Oct (Gemma Danks): Homecharge Compatible Chargers REMOVED from the
   Thursday release; Resent Onboarding Email stays. Row removed from node 19's intent map (the map
   is the gate: an intent the Action returns that is not a row is out of scope), scenario
@@ -502,7 +506,7 @@
   Actions 13 / 12 / 20 / 21; tree changes (feedback button, expired-session screen 61) go with the
   tree.
 - 2026-10-05 Claude - UAT after the 8 Oct PROD release (Charley Gunning, 5 Oct, "New use cases to be
-  built"). FAST Admin: card_group_move (Not Online / Card Group/Moves) and returned_direct_debit
+  built"). FAST Admin: card_group_move (Online / Card Group/Moves, corrected 7 Oct) and returned_direct_debit
   (Fee / Returned direct debit) rows in node 17; Test Mode scenarios test_fast_admin_returned_direct_debit,
   _card_group_move, _card_group_error, _partial_unrecognised, test_hc_partial_unrecognised. Guardrail
   (Managing Multi-Intent Requests with Unrecognised Intents, tracker 18): 17 now -> router 52 like 26;
```

## CHANGES THAT NEED AN EXPLANATION

Every line below must map to a requirement or an explicit request.
Anything unexplained is unintended drift — revert it before delivering.

  [ ] node 17 — script code changed (310 → 310 lines) — Build case review dashboard
  [ ] node 48 — content changed (773 → 777 lines) — claude.md

