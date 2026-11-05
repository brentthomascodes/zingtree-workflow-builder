========================================================================
WORKFLOW DIFF — Schedule New Patient Appointment
========================================================================

Before : Schedule New Patient Appointment (BEFORE baseline 2026-10-21 live).json  (127 nodes)
After  : Schedule New Patient Appointment (SharePoint insurance string 2026-10-21).json  (128 nodes)

## PLAIN SUMMARY

119 of 128 nodes are byte-for-byte identical to the original (93% untouched).
1 node added, 0 removed, 0 renumbered, 8 modified.

In plain terms:
  + NEW      node 7 — Get Clinic Raintree Insurances [Data]
  * CHANGED  node 1 — Stage Clinic Code for Insurance Lookup [Script]
               - continuation_node_id: 149 → 7 — Stage Clinic Code for Insurance Lookup
  * CHANGED  node 2 — claude.md [Content]
               - content changed (97 → 99 lines) — claude.md
  * CHANGED  node 31 — Collect DOB [Tree]
               - continuation_node_id: 188 → 1 — Collect DOB
               - return_tree_node_id: 188 → 1 — Collect DOB
  * CHANGED  node 119 — What Benefits? [Content]
               - button added/changed: "Insurance Accepted" → node 149
               - button removed/replaced: "Insurance Accepted" → node 1
  * CHANGED  node 188 — Build Insurance Catalogue (SharePoint, static fallback) [Script]
               - page_title: "Build Insurance Catalogue (static list with status)" → "Build Insurance Catalogue (SharePoint, static fallback)"
               - node_name: "Serve the clinic's accepted insurances where the region is live," → "Parse the clinic's SharePoint insurance cells into the dropdown, or fall back to the static list"
               - script code changed (66 → 108 lines) — Build Insurance Catalogue (SharePoint, static fallback)
  * CHANGED  node 199 — Using Insurance? / Select Insurance (dropdown clinics) [Content]
               - form field settings changed (same field names)
  * CHANGED  node 200 — Route Insurance Selection [Script]
               - script code changed (29 → 30 lines) — Route Insurance Selection
  * CHANGED  node 201 — Insurance Route [Scoring]
               - button added/changed: "" → node 149
               - button removed/replaced: "" → node 1

## TREE SHAPE

  node type                before    after    delta
  Content                      77       77       +0
  Data                          1        2       +1
  Scoring                      27       27       +0
  Script                        6        6       +0
  Tree                         16       16       +0
  TOTAL                       127      128       +1

  Root node unchanged (node 30).

## STRUCTURAL SANITY

  No broken links introduced.
  No nodes became unreachable.
  Pre-existing in the BEFORE tree (not caused by this edit): 41 broken link(s), 29 unreachable node(s).

## UNTOUCHED NODES (119)

  3, 4, 5, 6, 8, 9, 10, 11, 19, 21, 29, 30, 32, 33, 34, 42, 43, 45, 50, 51, 52, 53, 54, 64, 65, 66, 67, 68, 69, 72, 73, 75, 77, 78, 80, 85, 86, 88, 91, 92, 93, 94, 95, 96, 97, 100, 101, 102, 103, 104, 105, 106, 107, 108, 109, 110, 111, 112, 113, 115, 118, 120, 123, 124, 125, 126, 127, 128, 135, 136, 137, 138, 139, 141, 142, 144, 145, 149, 150, 151, 152, 153, 155, 156, 157, 158, 159, 160, 161, 162, 163, 164, 165, 166, 167, 168, 169, 170, 171, 172, 173, 174, 175, 176, 177, 179, 180, 181, 182, 183, 184, 185, 186, 189, 190, 191, 192, 193, 198

## TREE-LEVEL SETTINGS CHANGED (0)

  (none)

## COSMETIC / EDITOR-ONLY CHANGES (0) — ignore

  (none)

## LINE-LEVEL BODY DIFFS (3)

### node 2 — claude.md (content)

```diff
--- before/node 2 content
+++ after/node 2 content
@@ -6,7 +6,8 @@
 
 <h3>Node map - insurance path</h3>
 <pre>
- 31 Collect DOB (Tree) -> 188 Build Insurance Catalogue (Script, static list with status) -> 4
+ 31 Collect DOB (Tree) -> 1 Stage Clinic Code (Script) -> 7 Get Clinic Raintree Insurances (Data: alias_35)
+  7 -> 188 Build Insurance Catalogue (Script: SharePoint rows, static fallback) -> 4
 184 WC or MVA? [WC] [MVA] -> 170   [Neither] -> 198 Insurance Dropdown Region? (Logic)
       is_display_insurance_dropdown == 'true' -> 199 Using Insurance? / Select Insurance
       default                                 -> 119 What Benefits? (status quo, four buttons)
@@ -16,7 +17,7 @@
       not_accepted_medicaid -> 167 Medicaid not accepted -> 34
       not_accepted_other    -> 3 self-pay rates -> 183 / 155 / 34
       managed               -> 6 call back next month -> 34
-      default (accepted)    -> 1 -> 149 Initial Insurance Collect (card radio first, subscriber details)
+      default (accepted)    -> 149 Initial Insurance Collect (card radio first, subscriber details)
 149 [Add Secondary] -> 186 (secondary dropdown, transforms.insurance_list)
 Every exit goes to 34 (Tree -> Incoming Call node 41). The create-insurance POST runs in
 Incoming Call (nodes 162-164) after the appointment, because it needs the patient number.
@@ -70,6 +71,7 @@
 
 <h3>Changelog</h3>
 <ul>
+<li>2026-10-21 - SharePoint insurance string. alias_35 moved to new Data node 7 (31 -> 1 -> 7 -> 188); 119 [Insurance Accepted] and 201 default now go straight to 149. 188 parses each insurance_list cell as "Plan name; Raintree code; Status;" (status: Accepted / Not Accepted - Medicaid / Not Accepted - All Other / Managed, any case). Empty code = insurance stays in the appointment comments, no Raintree POST. Clinics with SharePoint rows get the selection screen; the static list and clinic-code list stay as the fallback for rollout clinics not yet converted. Catalogue entries carry code; 200 posts entry.code. Dropdown value is the insurance name (several plans share a code); 199 Other box keys on "Other". Status matched on letters only (en dash, spacing, case). 2xx without insurance_list falls back. Secondary dropdown lists accepted entries with a code only.</li>
 <li>2026-10-13 - Jami's updated flowchart and the 10/13 Insurance Updates call. 184 is WC / MVA / Neither. 199 asks
 "Will you be using insurance?" (No -> 150), shows the dropdown on Yes and an insurance-name box for Other.
 Every dropdown entry carries a status (188 insurance_catalog) and 201 routes on it: accepted -> 149,
```

### node 188 — Build Insurance Catalogue (SharePoint, static fallback) (script code)

```diff
--- before/node 188 content
+++ after/node 188 content
@@ -1,52 +1,94 @@
 // --- inputs -----------------------------------------------------------------
-// clinic_raintree_code comes from the clinic info (Incoming Call / tree 787613344).
+// clinic_raintree_code comes from the clinic info set upstream in Incoming Call.
+// alias_35 is the clinic's "Raintree Insurance" list from SharePoint, one string per insurance.
 let clinic_code = String(ZT.getVariableValue("clinic_raintree_code", "")).trim().toUpperCase();
+let raintree_insurance = actions.alias_35;
+let response_code = raintree_insurance._zt_meta.response.code;
+let is_raintree_insurance_ok = response_code >= 200 && response_code < 300;
 
-// --- insurance catalogue -----------------------------------------------------
-// value  = what the dropdown returns. For an accepted insurance it is the Raintree insurance
-//          code, the only insurance value sent to Raintree (Raintree fills in the name).
-// label  = what the agent sees.
-// status = where node 201 routes the call:
-//          accepted              -> collect insurance details and schedule
-//          not_accepted_medicaid -> Medicaid not accepted, end call
-//          not_accepted_other    -> not accepted, offer self-pay rates, schedule or end call
-//          managed               -> not taking new patients on this plan, call back next month
-// 10005 Other is accepted and opens a free-text insurance name on node 199.
-// Static until Ivy's SharePoint API returns name, code and status for every insurance.
-let insurance_catalog = [
-  { value: "10001", label: "Aetna", status: "accepted" },
-  { value: "10002", label: "MVA", status: "accepted" },
-  { value: "10003", label: "BCBS", status: "accepted" },
-  { value: "10004", label: "Cigna", status: "accepted" },
-  { value: "10005", label: "Other", status: "accepted" },
-  { value: "10006", label: "Medicare Advantage -MA", status: "accepted" },
-  { value: "10007", label: "Medicare (MC)", status: "accepted" },
-  { value: "10008", label: "Medicaid (MD)", status: "accepted" },
-  { value: "10009", label: "Medicaid Advantage (MDA)", status: "accepted" },
-  { value: "10011", label: "Tricare/VA", status: "accepted" },
-  { value: "10012", label: "UHC", status: "accepted" },
-  { value: "10013", label: "Workers Comp (WC)", status: "accepted" },
-  { value: "medicaid_not_listed", label: "Medicaid plan not listed", status: "not_accepted_medicaid" },
-  { value: "other_not_listed", label: "Other insurance not listed", status: "not_accepted_other" }
+// --- SharePoint insurance rows ----------------------------------------------
+// Each cell reads "Plan name; Raintree code; Status;". Clinics that keep insurance in the
+// appointment comments leave the code empty ("Plan name; ; Status;"), so nothing is sent
+// to Raintree for them. Cells are typed by hand in SharePoint, which turns " - " into an en
+// dash and drops spaces, so the status is matched on its letters only.
+// Rows still in the old name-only format, or with a status not listed here, are left out.
+// A clinic with no list comes back 2xx without insurance_list; it reads as no rows.
+// Several plans share one Raintree code, so the dropdown value is the plan name, not the code.
+let status_routes = {
+  "accepted": "accepted",
+  "notacceptedmedicaid": "not_accepted_medicaid",
+  "notacceptedallother": "not_accepted_other",
+  "notaccepted": "not_accepted_other",
+  "managed": "managed"
+};
+let sharepoint_catalog = [];
+if (is_raintree_insurance_ok) {
+  let rows = raintree_insurance.insurance_list || [];
+  for (let i = 0; i < rows.length; i++) {
+    let parts = rows[i].split(";");
+    if (parts.length < 3) {
+      continue;
+    }
+    let label = parts[0].trim();
+    let code = parts[1].trim();
+    let status = status_routes[parts[2].toLowerCase().replace(/[^a-z]/g, "")];
+    if (label !== "" && status) {
+      sharepoint_catalog.push({ value: label, label: label, code: code, status: status });
+    }
+  }
+}
+
+// --- static catalogue --------------------------------------------------------
+// Used for the rollout clinics until their SharePoint cells are in the new format.
+// value = what the dropdown returns (the name), code = the Raintree insurance code, status = the route:
+//   accepted              -> collect insurance details and schedule
+//   not_accepted_medicaid -> Medicaid not accepted, end call
+//   not_accepted_other    -> not accepted, offer self-pay rates, schedule or end call
+//   managed               -> not taking new patients on this plan, call back next month
+// Other (10005) is accepted and opens a free-text insurance name on the selection screen.
+let static_catalog = [
+  { value: "Aetna", label: "Aetna", code: "10001", status: "accepted" },
+  { value: "MVA", label: "MVA", code: "10002", status: "accepted" },
+  { value: "BCBS", label: "BCBS", code: "10003", status: "accepted" },
+  { value: "Cigna", label: "Cigna", code: "10004", status: "accepted" },
+  { value: "Other", label: "Other", code: "10005", status: "accepted" },
+  { value: "Medicare Advantage -MA", label: "Medicare Advantage -MA", code: "10006", status: "accepted" },
+  { value: "Medicare (MC)", label: "Medicare (MC)", code: "10007", status: "accepted" },
+  { value: "Medicaid (MD)", label: "Medicaid (MD)", code: "10008", status: "accepted" },
+  { value: "Medicaid Advantage (MDA)", label: "Medicaid Advantage (MDA)", code: "10009", status: "accepted" },
+  { value: "Tricare/VA", label: "Tricare/VA", code: "10011", status: "accepted" },
+  { value: "UHC", label: "UHC", code: "10012", status: "accepted" },
+  { value: "Workers Comp (WC)", label: "Workers Comp (WC)", code: "10013", status: "accepted" }
 ];
 
+// Every list ends with the two catch-alls for an insurance the clinic does not list.
+let not_listed = [
+  { value: "medicaid_not_listed", label: "Medicaid plan not listed", code: "", status: "not_accepted_medicaid" },
+  { value: "other_not_listed", label: "Other insurance not listed", code: "", status: "not_accepted_other" }
+];
+
+let is_sharepoint_catalog = sharepoint_catalog.length > 0;
+let insurance_catalog = (is_sharepoint_catalog ? sharepoint_catalog : static_catalog).concat(not_listed);
+
 // --- dropdown options --------------------------------------------------------
-// insurance_selection_list: every catalogue entry, the option source for node 199.
-// insurance_list: accepted insurances only, the option source for node 186 (secondary).
+// insurance_selection_list: every catalogue entry, the option source for the selection screen.
+// insurance_list: accepted insurances that carry a Raintree code, the option source for the
+// secondary insurance dropdown, which sends its value to Raintree as a code.
 let insurance_selection_list = [];
 let insurance_list = [];
 for (let i = 0; i < insurance_catalog.length; i++) {
   let entry = insurance_catalog[i];
   insurance_selection_list.push({ name: entry.label, value: entry.value });
-  if (entry.status === "accepted") {
-    insurance_list.push({ name: entry.label, value: entry.value });
+  if (entry.status === "accepted" && entry.code !== "") {
+    insurance_list.push({ name: entry.label, value: entry.code });
   }
 }
 
-// --- staged rollout: only these clinics get the dropdown screen --------------
-// Brooklyn, Long Island, South Charlotte, Virginia Beach and Northeast New Jersey clinics
-// plus ZZZ, the test clinic. New York region codes still to be added.
-const INSURANCE_DROPDOWN_CLINICS = [
+// --- staged rollout ----------------------------------------------------------
+// A clinic gets the selection screen when its SharePoint cells are in the new format, so Ivy
+// moves a clinic over from SharePoint. These clinics also get it on the static catalogue:
+// Brooklyn, Long Island, South Charlotte, Virginia Beach, Northeast New Jersey, and ZZZ (test).
+let insurance_dropdown_clinics = [
   "NY181", "NY182", "NY268", "NY186", "NY267", "NY264", "NY162", "NY269", "NY171", "NY163",
   "NY169", "NY302", "NY183", "NY172", "NC405", "NC435", "NC258", "NC433", "NC436", "NC408",
   "SC424", "SC431", "NC422", "SC425", "NC409", "SC432", "SC451", "VA764", "VA758", "VA759",
@@ -57,7 +99,7 @@
   "NJ634", "NJ691", "NJ633", "NJ689", "NJ673", "NJ618", "NJ677", "NJ632", "NJ682", "NJ707",
   "NY196", "ZZZ"
 ];
-let is_display_insurance_dropdown = INSURANCE_DROPDOWN_CLINICS.includes(clinic_code);
+let is_display_insurance_dropdown = is_sharepoint_catalog || insurance_dropdown_clinics.includes(clinic_code);
 
 // --- outputs ----------------------------------------------------------------
 ZT.setFormData("insurance_catalog", JSON.stringify(insurance_catalog));
```

### node 200 — Route Insurance Selection (script code)

```diff
--- before/node 200 content
+++ after/node 200 content
@@ -1,5 +1,5 @@
 // --- inputs -----------------------------------------------------------------
-// The agent's answers on node 199, and the catalogue node 188 built the dropdown from.
+// The agent's answers on the selection screen, and the catalogue the dropdown was built from.
 let is_using_insurance = ZT.getVariableValue("is_using_insurance", "");
 let insurance_selection = ZT.getVariableValue("insurance_selection", "");
 let insurance_catalog = JSON.parse(ZT.getVariableValue("insurance_catalog", "[]"));
@@ -9,21 +9,22 @@
 // An entry missing from the catalogue goes to details with no code, so nothing is POSTed.
 let insurance_route = "self_pay";
 let patient_insurance_rt_code = "";
-let selected_insurance = { value: "", label: "", status: "accepted" };
+let selected_insurance = { value: "", label: "", code: "", status: "accepted" };
 if (is_using_insurance === "Yes") {
   selected_insurance = insurance_catalog.find(entry => entry.value === insurance_selection) || selected_insurance;
   insurance_route = selected_insurance.status;
   if (insurance_route === "accepted") {
-    patient_insurance_rt_code = selected_insurance.value;
+    patient_insurance_rt_code = selected_insurance.code;
   }
 }
 
 // --- outputs ----------------------------------------------------------------
-// Only an accepted insurance becomes the Raintree code; Incoming Call node 162 POSTs it.
+// Only an accepted insurance with a code becomes the Raintree code; Incoming Call POSTs it.
+// An empty code (clinics that keep insurance in the appointment comments) sends nothing.
 // The insurance name goes to patient_insurance_other, which the Incoming Call summaries print.
-// For Other (10005) the agent already typed it on node 199, so it is left as typed.
+// For Other (10005) the agent already typed it on the selection screen, so it is left as typed.
 ZT.setFormData("patient_insurance_rt_code", patient_insurance_rt_code);
 ZT.setFormData("insurance_route", insurance_route);
-if (is_using_insurance === "Yes" && selected_insurance.value !== "10005") {
+if (is_using_insurance === "Yes" && selected_insurance.code !== "10005") {
   ZT.setFormData("patient_insurance_other", selected_insurance.label);
 }
```

## CHANGES THAT NEED AN EXPLANATION

Every line below must map to a requirement or an explicit request.
Anything unexplained is unintended drift — revert it before delivering.

  [ ] added node 7 (Get Clinic Raintree Insurances)
  [ ] node 1 — continuation_node_id: 149 → 7 — Stage Clinic Code for Insurance Lookup
  [ ] node 2 — content changed (97 → 99 lines) — claude.md
  [ ] node 31 — continuation_node_id: 188 → 1 — Collect DOB
  [ ] node 31 — return_tree_node_id: 188 → 1 — Collect DOB
  [ ] node 119 — button added/changed: "Insurance Accepted" → node 149
  [ ] node 119 — button removed/replaced: "Insurance Accepted" → node 1
  [ ] node 188 — page_title: "Build Insurance Catalogue (static list with status)" → "Build Insurance Catalogue (SharePoint, static fallback)"
  [ ] node 188 — node_name: "Serve the clinic's accepted insurances where the region is live," → "Parse the clinic's SharePoint insurance cells into the dropdown, or fall back to the static list"
  [ ] node 188 — script code changed (66 → 108 lines) — Build Insurance Catalogue (SharePoint, static fallback)
  [ ] node 199 — form field settings changed (same field names)
  [ ] node 200 — script code changed (29 → 30 lines) — Route Insurance Selection
  [ ] node 201 — button added/changed: "" → node 149
  [ ] node 201 — button removed/replaced: "" → node 1

