========================================================================
WORKFLOW DIFF — Incoming Call
========================================================================

Before : Incoming Call (BEFORE baseline 2026-09-17).json  (97 nodes)
After  : Incoming Call (lead picker + therapy type 2026-09-17).json  (103 nodes)

## PLAIN SUMMARY

96 of 103 nodes are byte-for-byte identical to the original (93% untouched).
6 nodes added, 0 removed, 0 renumbered, 1 modified.

In plain terms:
  + NEW      node 1 — Find Existing Lead [Data]
  + NEW      node 2 — Check Lead Search and Map Raintree Codes [Script]
  + NEW      node 5 — Existing Lead Found? [Scoring]
  + NEW      node 6 — claude.md [Content]
  + NEW      node 9 — Select Existing Lead [Content]
  + NEW      node 10 — Apply Selected Lead [Script]
  * CHANGED  node 105 — Submit Data to Raintree [Script]
               - node_name: "" → "Format the patient record and stage the Raintree lead search"
               - script code changed (27 → 32 lines) — Submit Data to Raintree
               - continuation_node_id: 107 → 1 — Submit Data to Raintree

## TREE SHAPE

  node type                before    after    delta
  Content                      31       33       +2
  Data                          7        8       +1
  Email                         2        2       +0
  Link                          1        1       +0
  Scoring                      17       18       +1
  Script                       17       19       +2
  Tree                         22       22       +0
  TOTAL                        97      103       +6

  Root node unchanged (node 79).

## STRUCTURAL SANITY

  No broken links introduced.
  NEWLY UNREACHABLE FROM ROOT (1): 6 (claude.md)
    (expected for the unlinked claude.md node — anything else is a stranded path)
  Pre-existing in the BEFORE tree (not caused by this edit): 0 broken link(s), 17 unreachable node(s).

## UNTOUCHED NODES (96)

  3, 4, 7, 8, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 52, 53, 54, 56, 57, 60, 61, 62, 63, 64, 65, 69, 70, 71, 73, 74, 75, 76, 77, 78, 79, 80, 81, 82, 83, 84, 85, 86, 87, 88, 89, 90, 91, 92, 93, 94, 95, 96, 97, 98, 100, 103, 104, 107, 122, 123, 124, 125, 126, 127, 128, 129, 130, 131, 132, 133, 134, 135, 136, 137, 138, 139, 140, 141, 142, 143, 144, 145, 146, 147, 148, 150, 151, 152, 153, 154, 156, 157, 158, 159, 160

## TREE-LEVEL SETTINGS CHANGED (0)

  (none)

## COSMETIC / EDITOR-ONLY CHANGES (0) — ignore

  (none)

## LINE-LEVEL BODY DIFFS (1)

### node 105 — Submit Data to Raintree (script code)

```diff
--- before/node 105 content
+++ after/node 105 content
@@ -25,3 +25,8 @@
 
 let patient_dob_formatted = convertDate(patient_dob);
 ZT.setFormData("patient_dob", patient_dob_formatted)
+
+// --- stage the lead search --------------------------------------------------
+// Raintree wants ISO yyyy-mm-dd on the /lead query string; the record itself uses MM-DD-YYYY.
+let [dob_month, dob_day, dob_year] = patient_dob_formatted.split("-");
+ZT.setFormData("lead_search_dob", `${dob_year}-${dob_month}-${dob_day}`);
```

## CHANGES THAT NEED AN EXPLANATION

Every line below must map to a requirement or an explicit request.
Anything unexplained is unintended drift — revert it before delivering.

  [ ] added node 1 (Find Existing Lead)
  [ ] added node 2 (Check Lead Search and Map Raintree Codes)
  [ ] added node 5 (Existing Lead Found?)
  [ ] added node 6 (claude.md)
  [ ] added node 9 (Select Existing Lead)
  [ ] added node 10 (Apply Selected Lead)
  [ ] node 105 — node_name: "" → "Format the patient record and stage the Raintree lead search"
  [ ] node 105 — script code changed (27 → 32 lines) — Submit Data to Raintree
  [ ] node 105 — continuation_node_id: 107 → 1 — Submit Data to Raintree

