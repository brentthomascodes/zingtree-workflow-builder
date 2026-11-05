========================================================================
WORKFLOW DIFF — Federation of State Boards of Physical Therapy
========================================================================

Before : FSBPT (BEFORE baseline 2026-10-05).json  (111 nodes)
After  : FSBPT - website answer sanitized (2026-10-05).json  (113 nodes)

## PLAIN SUMMARY

108 of 113 nodes are byte-for-byte identical to the original (96% untouched).
2 nodes added, 0 removed, 0 renumbered, 3 modified.

In plain terms:
  + NEW      node 3 — Strip scripts from website answer [Script]
  + NEW      node 27 — claude.md [Content]
  * CHANGED  node 106 — Ask caller's question for website search [Content]
               - page_title: "New Node (106)" → "Ask caller's question for website search"
               - node_name: "" → "Ask caller's question for website search"
  * CHANGED  node 107 — Search FSBPT websites with OpenAI [Data]
               - page_title: "Next" → "Search FSBPT websites with OpenAI"
               - node_name: "" → "Search FSBPT websites with OpenAI"
               - content changed (4 → 33 characters) — Search FSBPT websites with OpenAI
               - continuation_node_id: 108 → 3 — Search FSBPT websites with OpenAI
  * CHANGED  node 108 — Show website answer [Content]
               - page_title: "Handle response" → "Show website answer"
               - node_name: "" → "Show website answer"
               - content changed (55 → 47 characters) — Show website answer

## TREE SHAPE

  node type                before    after    delta
  Content                     107      108       +1
  Data                          1        1       +0
  Email                         3        3       +0
  Script                        0        1       +1
  TOTAL                       111      113       +2

  Root node unchanged (node 1).

## STRUCTURAL SANITY

  No broken links introduced.
  NEWLY UNREACHABLE FROM ROOT (1): 27 (claude.md)
    (expected for the unlinked claude.md node — anything else is a stranded path)
  Pre-existing in the BEFORE tree (not caused by this edit): 0 broken link(s), 63 unreachable node(s).

## UNTOUCHED NODES (108)

  1, 2, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, 62, 63, 64, 65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78, 79, 80, 81, 82, 83, 84, 85, 86, 87, 88, 89, 90, 91, 92, 93, 94, 95, 96, 97, 98, 99, 100, 101, 102, 103, 104, 105, 109, 110, 111, 112, 113, 114

## TREE-LEVEL SETTINGS CHANGED (0)

  (none)

## COSMETIC / EDITOR-ONLY CHANGES (0) — ignore

  (none)

## LINE-LEVEL BODY DIFFS (2)

### node 107 — Search FSBPT websites with OpenAI (content)

```diff
--- before/node 107 content
+++ after/node 107 content
@@ -1 +1 @@
-Next
+Search FSBPT websites with OpenAI
```

### node 108 — Show website answer (content)

```diff
--- before/node 108 content
+++ after/node 108 content
@@ -1 +1 @@
-<p>${actions.webscraper.choices[0].message.content}</p>
+<div>${transforms.webscraper_answer_html}</div>
```

## CHANGES THAT NEED AN EXPLANATION

Every line below must map to a requirement or an explicit request.
Anything unexplained is unintended drift — revert it before delivering.

  [ ] added node 3 (Strip scripts from website answer)
  [ ] added node 27 (claude.md)
  [ ] node 106 — page_title: "New Node (106)" → "Ask caller's question for website search"
  [ ] node 106 — node_name: "" → "Ask caller's question for website search"
  [ ] node 107 — page_title: "Next" → "Search FSBPT websites with OpenAI"
  [ ] node 107 — node_name: "" → "Search FSBPT websites with OpenAI"
  [ ] node 107 — content changed (4 → 33 characters) — Search FSBPT websites with OpenAI
  [ ] node 107 — continuation_node_id: 108 → 3 — Search FSBPT websites with OpenAI
  [ ] node 108 — page_title: "Handle response" → "Show website answer"
  [ ] node 108 — node_name: "" → "Show website answer"
  [ ] node 108 — content changed (55 → 47 characters) — Show website answer

