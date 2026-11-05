========================================================================
WORKFLOW DIFF — Insurance Inquiry
========================================================================

Before : Insurance Inquiry (BEFORE baseline 2026-10-22 live).json  (35 nodes)
After  : Insurance Inquiry (SharePoint insurance 2026-10-22).json  (34 nodes)

## PLAIN SUMMARY

26 of 34 nodes are byte-for-byte identical to the original (76% untouched).
1 node added, 2 removed, 0 renumbered, 7 modified.

In plain terms:
  + NEW      node 5 — Insurance Managed - Not Accepting New Patients [Content]
  - GONE     node 52 — Build Insurance Options [Script] (was reachable from node 51)
  - GONE     node 54 — New Node (54) [Data] (was unlinked)
  * CHANGED  node 1 — Start Node [Content]
               - is_root: 0 → 1
  * CHANGED  node 43 — WC or MVA? [Content]
               - button added/changed: "Insurance" → node 50
               - button removed/replaced: "Insurance" → node 45
  * CHANGED  node 48 — Initial Insurance Collect [Content]
               - form field removed: insurance_select (select)
  * CHANGED  node 51 — Get Clinic Insurances [Data]
               - continuation_node_id: 52 → 55 — Get Clinic Insurances
  * CHANGED  node 55 — Build Insurance Catalogue (SharePoint, static fallback) [Script]
               - page_title: "Handle response" → "Build Insurance Catalogue (SharePoint, static fallback)"
               - node_name: "" → "Parse the clinic's SharePoint insurance cells into the dropdown, or fall back to the static list"
               - continuation_node_id: 1 → 45 — Build Insurance Catalogue (SharePoint, static fallback)
  * CHANGED  node 56 — Insurance Routing [Scoring]
               - button added/changed: "insurance_route == 'managed'" → node 5 [logic: insurance_route == 'managed']
               - button added/changed: "" → node 48
               - button removed/replaced: "insurance_route == 'managed'" → node 50
               - button removed/replaced: "" → node 0
  * CHANGED  node 57 — Format Insurance Selection [Script]
               - script code changed (30 → 31 lines) — Format Insurance Selection

## TREE SHAPE

  node type                before    after    delta
  Content                      21       22       +1
  Data                          2        1       -1
  Scoring                       2        2       +0
  Script                        4        3       -1
  Tree                          6        6       +0
  TOTAL                        35       34       -1

  ROOT CHANGED: node 54 → node 1   <-- verify this was intended

## STRUCTURAL SANITY

  No broken links introduced.
  No nodes became unreachable.
  Pre-existing in the BEFORE tree (not caused by this edit): 6 broken link(s), 6 unreachable node(s).

## UNTOUCHED NODES (26)

  2, 3, 4, 8, 9, 17, 28, 29, 30, 31, 32, 33, 35, 36, 37, 38, 39, 40, 42, 44, 45, 46, 47, 49, 50, 53

## TREE-LEVEL SETTINGS CHANGED (1)

  root_node_id: 54 → 1

## COSMETIC / EDITOR-ONLY CHANGES (0) — ignore

  (none)

## LINE-LEVEL BODY DIFFS (1)

### node 57 — Format Insurance Selection (script code)

```diff
--- before/node 57 content
+++ after/node 57 content
@@ -1,7 +1,8 @@
 // --- inputs -----------------------------------------------------------------
-// The agent's answers on the selection screen, and the catalogue the dropdown was built from.
-let is_using_insurance = ZT.getVariableValue("is_using_insurance", "");
+// The agent's pick on the selection screen, and the catalogue the dropdown was built from.
 let insurance_selection = ZT.getVariableValue("insurance_selection", "");
+// Reached only from the [Insurance] button, so a selection means the caller is using insurance.
+let is_using_insurance = insurance_selection !== "" ? "Yes" : "No";
 let insurance_catalog = JSON.parse(ZT.getVariableValue("insurance_catalog", "[]"));
 
 // --- route ------------------------------------------------------------------
```

## CHANGES THAT NEED AN EXPLANATION

Every line below must map to a requirement or an explicit request.
Anything unexplained is unintended drift — revert it before delivering.

  [ ] added node 5 (Insurance Managed - Not Accepting New Patients)
  [ ] removed node 52 (Build Insurance Options)
  [ ] removed node 54 (New Node (54))
  [ ] node 1 — is_root: 0 → 1
  [ ] node 43 — button added/changed: "Insurance" → node 50
  [ ] node 43 — button removed/replaced: "Insurance" → node 45
  [ ] node 48 — form field removed: insurance_select (select)
  [ ] node 51 — continuation_node_id: 52 → 55 — Get Clinic Insurances
  [ ] node 55 — page_title: "Handle response" → "Build Insurance Catalogue (SharePoint, static fallback)"
  [ ] node 55 — node_name: "" → "Parse the clinic's SharePoint insurance cells into the dropdown, or fall back to the static list"
  [ ] node 55 — continuation_node_id: 1 → 45 — Build Insurance Catalogue (SharePoint, static fallback)
  [ ] node 56 — button added/changed: "insurance_route == 'managed'" → node 5 [logic: insurance_route == 'managed']
  [ ] node 56 — button added/changed: "" → node 48
  [ ] node 56 — button removed/replaced: "insurance_route == 'managed'" → node 50
  [ ] node 56 — button removed/replaced: "" → node 0
  [ ] node 57 — script code changed (30 → 31 lines) — Format Insurance Selection
  [ ] tree setting —  root_node_id: 54 → 1

