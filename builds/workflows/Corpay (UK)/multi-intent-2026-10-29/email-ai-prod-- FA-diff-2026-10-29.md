========================================================================
WORKFLOW DIFF — 1 BRANCH - FAST Admin PROD
========================================================================

Before : 1 BRANCH - FAST Admin PROD 450053608 (BEFORE baseline 2026-10-29).json  (29 nodes)
After  : 1 BRANCH - FAST Admin PROD 450053608 (multi-intent banner 2026-10-29).json  (29 nodes)

## PLAIN SUMMARY

27 of 29 nodes are byte-for-byte identical to the original (93% untouched).
0 nodes added, 0 removed, 0 renumbered, 2 modified.

In plain terms:
  * CHANGED  node 17 — Build case review dashboard [Script]
               - script code changed (303 → 308 lines) — Build case review dashboard
  * CHANGED  node 48 — claude.md [Content]
               - content changed (18 → 18 lines) — claude.md

## TREE SHAPE

  node type                before    after    delta
  AI_Action                     2        2       +0
  Content                       9        9       +0
  Data                          1        1       +0
  Scoring                       6        6       +0
  Script                       10       10       +0
  Tree                          1        1       +0
  TOTAL                        29       29       +0

  Root node unchanged (node 3).

## STRUCTURAL SANITY

  No broken links introduced.
  No nodes became unreachable.
  Pre-existing in the BEFORE tree (not caused by this edit): 0 broken link(s), 1 unreachable node(s).

## UNTOUCHED NODES (27)

  3, 4, 5, 6, 7, 9, 12, 13, 14, 15, 16, 31, 32, 33, 52, 54, 55, 56, 57, 62, 63, 64, 70, 71, 72, 73, 79

## TREE-LEVEL SETTINGS CHANGED (0)

  (none)

## COSMETIC / EDITOR-ONLY CHANGES (0) — ignore

  (none)

## LINE-LEVEL BODY DIFFS (2)

### node 17 — Build case review dashboard (script code)

```diff
--- before/node 17 content
+++ after/node 17 content
@@ -182,7 +182,11 @@
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
@@ -191,6 +195,7 @@
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
@@ -15,4 +15,4 @@
 2026-10-19: tree script: external http(s) links open in a new tab instead of inside the widget (Gemma Danks, 19 Oct).
 2026-10-19: node 13 sets fee_layout (multi_fee when 2+ of Ecopoint / Zero Liability / Extended Payment Terms, else standard); AI 15 reads it for the multi-fee reply layout (Gemma Danks, 19 Oct). fee_layout_instructions carries the approved multi-fee layout to AI 15 only for 2+ fees.
 2026-10-21: node 17 card_group_move Topic "Online" (matches the live PROD value).
-2026-10-21: PROD release (master split: FAST Admin + Homecharge branches; Ecopoint / Extended Payment Terms / Zero Liability). Not in PROD: Networks route + branch, links-in-new-tab script, RDD sentiment scenarios.</pre>
+2026-10-21: PROD release (master split: FAST Admin + Homecharge branches; Ecopoint / Extended Payment Terms / Zero Liability). Not in PROD: Networks route + branch, links-in-new-tab script, RDD sentiment scenarios.</pre><p>2026-10-29: multi-intent half rollback (Gemma Danks, 29 Oct): node 17 no longer routes to text-box screen 62; the 'Part of this request was not recognised' banner sits on top of the dashboard, agent uses 'No - make manual changes'.</p>
```

## CHANGES THAT NEED AN EXPLANATION

Every line below must map to a requirement or an explicit request.
Anything unexplained is unintended drift — revert it before delivering.

  [ ] node 17 — script code changed (303 → 308 lines) — Build case review dashboard
  [ ] node 48 — content changed (18 → 18 lines) — claude.md

