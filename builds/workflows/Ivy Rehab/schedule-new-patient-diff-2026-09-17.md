========================================================================
WORKFLOW DIFF — Schedule New Patient Appointment
========================================================================

Before : Schedule New Patient Appointment (BEFORE baseline 2026-09-17).json  (118 nodes)
After  : Schedule New Patient Appointment (Azure insurance dropdown 2026-09-17).json  (120 nodes)

## PLAIN SUMMARY

115 of 120 nodes are byte-for-byte identical to the original (96% untouched).
2 nodes added, 0 removed, 0 renumbered, 3 modified.

In plain terms:
  + NEW      node 1 — Stage Clinic Code for Insurance Lookup [Script]
  + NEW      node 2 — claude.md [Content]
  * CHANGED  node 119 — What Benefits? [Content]
               - button added/changed: "Insurance Accepted" → node 1
               - button removed/replaced: "Insurance Accepted" → node 187
  * CHANGED  node 187 — Get Master Insurances [Data]
               - node_name: "" → "Fetch the Raintree master list and the clinic's accepted insurances"
  * CHANGED  node 188 — Build Insurance Options [Script]
               - page_title: "Handle response" → "Build Insurance Options"
               - node_name: "" → "Serve the clinic's accepted insurances where the region is live, otherwise the master list"
               - script code changed (7 → 19 lines) — Build Insurance Options

## TREE SHAPE

  node type                before    after    delta
  Content                      72       73       +1
  Data                          1        1       +0
  Scoring                      25       25       +0
  Script                        4        5       +1
  Tree                         16       16       +0
  TOTAL                       118      120       +2

  Root node unchanged (node 30).

## STRUCTURAL SANITY

  No broken links introduced.
  NEWLY UNREACHABLE FROM ROOT (1): 2 (claude.md)
    (expected for the unlinked claude.md node — anything else is a stranded path)
  Pre-existing in the BEFORE tree (not caused by this edit): 41 broken link(s), 28 unreachable node(s).

## UNTOUCHED NODES (115)

  4, 5, 8, 9, 10, 11, 19, 21, 29, 30, 31, 32, 33, 34, 42, 43, 45, 50, 51, 52, 53, 54, 64, 65, 66, 67, 68, 69, 72, 73, 75, 77, 78, 80, 85, 86, 88, 91, 92, 93, 94, 95, 96, 97, 100, 101, 102, 103, 104, 105, 106, 107, 108, 109, 110, 111, 112, 113, 115, 118, 120, 123, 124, 125, 126, 127, 128, 135, 136, 137, 138, 139, 141, 142, 144, 145, 149, 150, 151, 152, 153, 155, 156, 157, 158, 159, 160, 161, 162, 163, 164, 165, 166, 167, 168, 169, 170, 171, 172, 173, 174, 175, 176, 177, 179, 180, 181, 182, 183, 184, 185, 186, 189, 190, 191

## TREE-LEVEL SETTINGS CHANGED (0)

  (none)

## COSMETIC / EDITOR-ONLY CHANGES (0) — ignore

  (none)

## LINE-LEVEL BODY DIFFS (1)

### node 188 — Build Insurance Options (script code)

```diff
--- before/node 188 content
+++ after/node 188 content
@@ -1,7 +1,19 @@
-let insurances = actions.raintree__find_master_insurances.records;
-let filtered = insurances.map(item => ({
-    ...item,
-    concat_name: item.code + " - " + item.name 
-  }));
+// --- inputs -----------------------------------------------------------------
+let clinic_region = ZT.getVariableValue("clinic_region", "");
+let master_insurances = actions.raintree__find_master_insurances.records;
+let clinic_list_ok = actions.alias_35._zt_meta.response.code === 200;
+// OPEN ITEM OI-6: the Azure response shape is unconfirmed. Zingtree wraps an array root
+// under .value; the empty default keeps the screen on the master list until a live
+// response is captured.
+let clinic_insurances = clinic_list_ok ? (actions.alias_35.value || []) : [];
 
-ZT.setResponseData("raintree__find_master_insurances", { records: filtered });
+// --- pick the list this clinic is entitled to -------------------------------
+// Staged rollout: only these regions see the clinic-accepted list. An empty or failed
+// clinic list falls back to the master list, so the agent never gets an empty picker.
+const azureInsuranceRegions = ["brooklyn", "charlotte"];
+let region_is_live = azureInsuranceRegions.includes(clinic_region.trim().toLowerCase());
+let source_list = region_is_live && clinic_insurances.length > 0 ? clinic_insurances : master_insurances;
+
+// --- outputs ----------------------------------------------------------------
+let records = source_list.map(item => ({ ...item, concat_name: item.code + " - " + item.name }));
+ZT.setResponseData("raintree__find_master_insurances", { records: records });
```

## CHANGES THAT NEED AN EXPLANATION

Every line below must map to a requirement or an explicit request.
Anything unexplained is unintended drift — revert it before delivering.

  [ ] added node 1 (Stage Clinic Code for Insurance Lookup)
  [ ] added node 2 (claude.md)
  [ ] node 119 — button added/changed: "Insurance Accepted" → node 1
  [ ] node 119 — button removed/replaced: "Insurance Accepted" → node 187
  [ ] node 187 — node_name: "" → "Fetch the Raintree master list and the clinic's accepted insurances"
  [ ] node 188 — page_title: "Handle response" → "Build Insurance Options"
  [ ] node 188 — node_name: "" → "Serve the clinic's accepted insurances where the region is live, otherwise the master list"
  [ ] node 188 — script code changed (7 → 19 lines) — Build Insurance Options

