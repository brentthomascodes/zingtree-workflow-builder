========================================================================
WORKFLOW DIFF — 2 BRANCH - Homecharge PROD
========================================================================

Before : 2 BRANCH - Homecharge PROD 496283193 (BEFORE baseline 2026-10-29).json  (33 nodes)
After  : 2 BRANCH - Homecharge PROD 496283193 (multi-intent banner 2026-10-29).json  (33 nodes)

## PLAIN SUMMARY

31 of 33 nodes are byte-for-byte identical to the original (94% untouched).
0 nodes added, 0 removed, 0 renumbered, 2 modified.

In plain terms:
  * CHANGED  node 26 — Build case review dashboard [Script]
               - script code changed (310 → 315 lines) — Build case review dashboard
  * CHANGED  node 48 — claude.md [Content]
               - content changed (8 → 8 lines) — claude.md

## TREE SHAPE

  node type                before    after    delta
  AI_Action                     2        2       +0
  Content                      12       12       +0
  Data                          1        1       +0
  Scoring                       7        7       +0
  Script                       10       10       +0
  Tree                          1        1       +0
  TOTAL                        33       33       +0

  Root node unchanged (node 3).

## STRUCTURAL SANITY

  No broken links introduced.
  No nodes became unreachable.
  Pre-existing in the BEFORE tree (not caused by this edit): 0 broken link(s), 1 unreachable node(s).

## UNTOUCHED NODES (31)

  3, 4, 5, 6, 7, 9, 18, 19, 20, 21, 22, 23, 24, 25, 30, 31, 32, 33, 50, 51, 52, 53, 56, 62, 63, 64, 70, 71, 72, 73, 79

## TREE-LEVEL SETTINGS CHANGED (0)

  (none)

## COSMETIC / EDITOR-ONLY CHANGES (0) — ignore

  (none)

## LINE-LEVEL BODY DIFFS (2)

### node 26 — Build case review dashboard (script code)

```diff
--- before/node 26 content
+++ after/node 26 content
@@ -202,7 +202,11 @@
 // requests and could not map another; it then names the part it did not recognise. The agent
 // reviews the draft on screen 62 and types what is missing; the reply is then regenerated with
 // agent_added_request in the generation AI Action's context, and this node runs again.
-let unrecognised_review_needed = ai_exception_reason !== "" && agent_added_request === "";
+// Half rollback (Gemma Danks, 29 Oct): screen 62 and its text box are no longer used. A partly
+// unrecognised request goes to the normal dashboard with the banner on top; the agent edits
+// through "No - make manual changes".
+let unrecognised_review_needed = false;
+let unrecognised_banner = ai_exception_reason !== "";
 let unrecognised_review_html = `
 <div class="case-review-card" style="background:#fffbeb;border-color:#fde68a;">
   <h3 class="case-review-card-title">Part of this request was not recognised</h3>
@@ -211,6 +215,7 @@
   <p><strong>Not recognised:</strong> ${escapeHtml(ai_exception_reason)}</p>
 </div>
 ${case_review_html}`;
+if (unrecognised_banner) case_review_html = unrecognised_review_html;
 
 // --- manual-changes form (Topic + Subtopic + editable HTML body) -----------------
 const buildOptions = (options, selectedValue, placeholder) =>
```

### node 48 — claude.md (content)

```diff
--- before/node 48 content
+++ after/node 48 content
@@ -5,4 +5,4 @@
 31 send path: manual -> 33, multi -> 32, else -> 50; 32/33 -> 50 -> 51 provider picklists -> 71
 Hand-back: 70-73 set branch_outcome -> 79 Tree -> master 100 Main end.
 2026-10-19: tree script: external http(s) links open in a new tab instead of inside the widget (Gemma Danks, 19 Oct).
-2026-10-21: PROD release (master split: FAST Admin + Homecharge branches; Ecopoint / Extended Payment Terms / Zero Liability). Not in PROD: Networks route + branch, links-in-new-tab script, RDD sentiment scenarios.</pre>
+2026-10-21: PROD release (master split: FAST Admin + Homecharge branches; Ecopoint / Extended Payment Terms / Zero Liability). Not in PROD: Networks route + branch, links-in-new-tab script, RDD sentiment scenarios.</pre><p>2026-10-29: multi-intent half rollback (Gemma Danks, 29 Oct): node 26 no longer routes to text-box screen 62; the 'Part of this request was not recognised' banner sits on top of the dashboard, agent uses 'No - make manual changes'.</p>
```

## CHANGES THAT NEED AN EXPLANATION

Every line below must map to a requirement or an explicit request.
Anything unexplained is unintended drift — revert it before delivering.

  [ ] node 26 — script code changed (310 → 315 lines) — Build case review dashboard
  [ ] node 48 — content changed (8 → 8 lines) — claude.md

