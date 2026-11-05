========================================================================
WORKFLOW DIFF — 3 BRANCH - Networks scaffold
========================================================================

Before : 3 BRANCH - Networks INT 547469427 (UAT feedback 2026-10-27).json  (29 nodes)
After  : 3 BRANCH - Networks INT 547469427 (attachment button 2026-10-29).json  (30 nodes)

## PLAIN SUMMARY

27 of 30 nodes are byte-for-byte identical to the original (90% untouched).
1 node added, 0 removed, 0 renumbered, 2 modified.

In plain terms:
  + NEW      node 119 — Attachment needed [Script]
  * CHANGED  node 48 — claude.md [Content]
               - content changed (18 → 18 lines) — claude.md
  * CHANGED  node 96 — Remittance request - choose the response [Content]
               - button added/changed: "I need to add an attachment" → node 119

## TREE SHAPE

  node type                before    after    delta
  AI_Action                     1        1       +0
  Content                       9        9       +0
  Data                          1        1       +0
  Scoring                       4        4       +0
  Script                       13       14       +1
  Tree                          1        1       +0
  TOTAL                        29       30       +1

  Root node unchanged (node 3).

## STRUCTURAL SANITY

  No broken links introduced.
  No nodes became unreachable.
  Pre-existing in the BEFORE tree (not caused by this edit): 0 broken link(s), 1 unreachable node(s).

## UNTOUCHED NODES (27)

  3, 4, 5, 6, 7, 9, 56, 70, 71, 72, 73, 79, 91, 92, 93, 94, 95, 97, 98, 110, 112, 113, 114, 115, 116, 117, 118

## TREE-LEVEL SETTINGS CHANGED (0)

  (none)

## COSMETIC / EDITOR-ONLY CHANGES (0) — ignore

  (none)

## LINE-LEVEL BODY DIFFS (1)

### node 48 — claude.md (content)

```diff
--- before/node 48 content
+++ after/node 48 content
@@ -15,4 +15,4 @@
 - 2026-10-12 scaffold (master split).
 - 2026-10-16 remittance MVP: nodes 91-98, 110, 112-117; 90 removed; Merchant Request on 4 / 9; 7 -> 91.
   Source: Gemma Danks "Daily AI standup - Fri 16th Oct" + "Networks AI tree setup" + "Phase 1 - Remittance auto email pushback".
-2026-10-19: tree script: external http(s) links open in a new tab instead of inside the widget (Gemma Danks, 19 Oct).</pre><p>2026-10-27: invoice amount always shown with a pound sign in the service department reply (110); response-choice screen 96 now shows the case dashboard (Case Details + Original Customer Email) built by new script 118 (Gemma Danks, Networks UAT feedback 26 Oct).</p>
+2026-10-19: tree script: external http(s) links open in a new tab instead of inside the widget (Gemma Danks, 19 Oct).</pre><p>2026-10-27: invoice amount always shown with a pound sign in the service department reply (110); response-choice screen 96 now shows the case dashboard (Case Details + Original Customer Email) built by new script 118 (Gemma Danks, Networks UAT feedback 26 Oct).</p><p>2026-10-29: response-choice screen 96 gets a third button, 'I need to add an attachment', -> new script 119 -> hand back not_automated (master screen 29, work the case as normal) (Gemma Danks, 28 Oct).</p>
```

## CHANGES THAT NEED AN EXPLANATION

Every line below must map to a requirement or an explicit request.
Anything unexplained is unintended drift — revert it before delivering.

  [ ] added node 119 (Attachment needed)
  [ ] node 48 — content changed (18 → 18 lines) — claude.md
  [ ] node 96 — button added/changed: "I need to add an attachment" → node 119

