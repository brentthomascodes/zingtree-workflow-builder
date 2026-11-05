========================================================================
WORKFLOW DIFF — Vault File Upload - Test and Maintenance
========================================================================

Before : Vault File Upload - Test and Maintenance (build 2026-10-19).json  (17 nodes)
After  : Vault File Upload - Test and Maintenance (no-file check 2026-10-19).json  (17 nodes)

## PLAIN SUMMARY

14 of 17 nodes are byte-for-byte identical to the original (82% untouched).
0 nodes added, 0 removed, 0 renumbered, 3 modified.

In plain terms:
  * CHANGED  node 2 — Start the attempt [Script]
               - script code changed (55 → 62 lines) — Start the attempt
  * CHANGED  node 3 — File uploaded? Fetch the link live? [Scoring]
               - page_title: "Fetch the link live?" → "File uploaded? Fetch the link live?"
               - node_name: "Mocked runs skip the vault call; the seed already filled zingtree__get_vault_file" → "No file goes to the failure screen; mocked runs skip the vault call (the seed already filled zingtree__get_vault_file)"
               - button added/changed: "has_file == 'false'" → node 14 [logic: has_file == 'false']
               - button added/changed: "mock_vault == 'true'" → node 5 [logic: mock_vault == 'true']
               - button added/changed: "" → node 4
               - button removed/replaced: "mock_vault == 'true'" → node 5
               - button removed/replaced: "" → node 4
  * CHANGED  node 17 — claude.md [Content]
               - content changed (88 → 92 lines) — claude.md

## TREE SHAPE

  node type                before    after    delta
  Content                       5        5       +0
  Data                          3        3       +0
  Scoring                       4        4       +0
  Script                        5        5       +0
  TOTAL                        17       17       +0

  Root node unchanged (node 1).

## STRUCTURAL SANITY

  No broken links introduced.
  No nodes became unreachable.
  Pre-existing in the BEFORE tree (not caused by this edit): 0 broken link(s), 1 unreachable node(s).

## UNTOUCHED NODES (14)

  1, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16

## TREE-LEVEL SETTINGS CHANGED (0)

  (none)

## COSMETIC / EDITOR-ONLY CHANGES (0) — ignore

  (none)

## LINE-LEVEL BODY DIFFS (2)

### node 2 — Start the attempt (script code)

```diff
--- before/node 2 content
+++ after/node 2 content
@@ -12,6 +12,12 @@
 let test_scenario = ZT.getVariableValue("test_scenario", "test_success");
 let test_mock_scope = ZT.getVariableValue("test_mock_scope", "mock_all_requests");
 let test_case_id = ZT.getVariableValue("test_case_id", "");
+let vault_file_uid = ZT.getVariableValue("vault_file_uid", "");
+
+// --- file check ---------------------------------------------------------------
+// The vault field's required flag is not enforced, and a failed upload leaves it empty.
+let has_file = vault_file_uid !== "";
+let no_file_error = "No file was uploaded. The upload field rejects blocked file types and files over 35 MB. Upload the file again.";
 
 // --- scope and scenario -------------------------------------------------------
 let mock_vault = test_mock_scope === "mock_all_requests";
@@ -51,5 +57,6 @@
 ZT.setFormData("vault_download_url", "");
 ZT.setFormData("file_base64", "");
 ZT.setFormData("file_read_error", "");
-ZT.setFormData("vault_upload_status", "in_progress");
-ZT.setFormData("vault_upload_error", "");
+ZT.setFormData("has_file", has_file ? "true" : "false");
+ZT.setFormData("vault_upload_status", has_file ? "in_progress" : "failed_no_file");
+ZT.setFormData("vault_upload_error", has_file ? "" : no_file_error);
```

### node 17 — claude.md (content)

```diff
--- before/node 17 content
+++ after/node 17 content
@@ -12,7 +12,8 @@
 1  Content  Upload a file for the case: vault field vault_file_uid (required), test_case_id,
             test_scenario, test_mock_scope -> 2
 2  Script   Start the attempt: vault_attempt + 1, case_id, mock flags, seeds mocks -> 3
-3  Scoring  Fetch the link live?  mock_vault == 'true' -> 5 | else -> 4
+3  Scoring  File uploaded? Fetch the link live?  has_file == 'false' -> 14 |
+            mock_vault == 'true' -> 5 | else -> 4
 4  Data     Get the vault download link (CO 1301 zingtree__get_vault_file) -> 5
 5  Script   Grade the download link: vault_download_url, file_name, is_link_ok -> 6
 6  Scoring  Download link received?  is_link_ok == 'true' -> 7 | else -> 14
@@ -35,6 +36,7 @@
 - vault_file_uid      vault field on 1; read by CO 1301 and 1302 URL templates
 - test_case_id, test_scenario, test_mock_scope   fields on 1; read by 2
 - vault_attempt       2 (+1 per attempt); read by 2, 14, 15 and the CO 1301 URL (cache key)
+- has_file            2 -> router 3
 - mock_vault, mock_salesforce   2 -> routers 3, 11 / 8 ("true" / "false" strings)
 - case_id             2 (test_case_id or 500Ad00000MOCK0001); read by 7, 15 and the CO 1303 template
 - vault_download_url  2 (cleared), 5 (link), 8 (cleared); read by the browser script_code
@@ -44,7 +46,7 @@
 - sf_route            8 -> router 9 (error / mock / live)
 - content_version_id  11; read by 15
 - delete_route        11 -> router 12 (error / mock / live)
-- vault_upload_status in_progress, failed_link, failed_read, failed_salesforce, attached,
+- vault_upload_status in_progress, failed_no_file, failed_link, failed_read, failed_salesforce, attached,
                       attached_delete_failed (2, 5, 8, 11, 15); shown on 14, form data report
 - vault_upload_error  reason text (2, 5, 8, 11, 15); shown on 14
 Transforms
@@ -72,8 +74,9 @@
 - VAULT LIMITS (tested 2026-10-19 in GT's demo): .exe rejected by the upload service (400,
   "This file type is not allowed for security reasons."); over 35 MB blocked in the browser
   ("File size exceeds the maximum size: 35 MB"); 30 MB uploads fine.
-- A FAILED UPLOAD CLEARS THE FIELD, including an earlier good upload. The field is required
-  here so the agent cannot continue without a file (GT's demo continues with an empty id).
+- A FAILED UPLOAD CLEARS THE FIELD, including an earlier good upload. The vault field's
+  required flag is NOT enforced (tested 2026-10-19: Continue works with no file), so 2 checks
+  vault_file_uid and router 3 sends an empty one to the failure screen (failed_no_file).
 - FILE CONTENTS NEVER STAY IN FORM DATA. script_code can only write form data, so 8 moves the
   base64 to a transform and blanks the form copy in the same step; 11 blanks the transform.
 - THE BROWSER READ IS ASYNC. If the agent clicks Attach before a large file is read, 8 routes
@@ -85,4 +88,5 @@
 
 ## Changelog
 - 2026-10-19 - Built from GT's demo with failure handling, retry and Test Mode - nodes 1-17
+- 2026-10-19 - Preview showed the vault field's required flag is ignored; added the no-file check - nodes 2, 3
 </pre>
```

## CHANGES THAT NEED AN EXPLANATION

Every line below must map to a requirement or an explicit request.
Anything unexplained is unintended drift — revert it before delivering.

  [ ] node 2 — script code changed (55 → 62 lines) — Start the attempt
  [ ] node 3 — page_title: "Fetch the link live?" → "File uploaded? Fetch the link live?"
  [ ] node 3 — node_name: "Mocked runs skip the vault call; the seed already filled zingtree__get_vault_file" → "No file goes to the failure screen; mocked runs skip the vault call (the seed already filled zingtree__get_vault_file)"
  [ ] node 3 — button added/changed: "has_file == 'false'" → node 14 [logic: has_file == 'false']
  [ ] node 3 — button added/changed: "mock_vault == 'true'" → node 5 [logic: mock_vault == 'true']
  [ ] node 3 — button added/changed: "" → node 4
  [ ] node 3 — button removed/replaced: "mock_vault == 'true'" → node 5
  [ ] node 3 — button removed/replaced: "" → node 4
  [ ] node 17 — content changed (88 → 92 lines) — claude.md

