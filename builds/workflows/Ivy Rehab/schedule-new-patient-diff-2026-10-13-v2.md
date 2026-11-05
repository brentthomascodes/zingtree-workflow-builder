========================================================================
WORKFLOW DIFF — Schedule New Patient Appointment
========================================================================

Before : Schedule New Patient Appointment (BEFORE baseline 2026-10-13 live).json  (125 nodes)
After  : Schedule New Patient Appointment (insurance flow v2 2026-10-13).json  (127 nodes)

## PLAIN SUMMARY

116 of 127 nodes are byte-for-byte identical to the original (91% untouched).
2 nodes added, 0 removed, 0 renumbered, 9 modified.

In plain terms:
  + NEW      node 3 — Insurance Not Accepted - Self-Pay Rates (dropdown clinics) [Content]
  + NEW      node 6 — Insurance Managed - Not Accepting New Patients (dropdown clinics) [Content]
  * CHANGED  node 2 — claude.md [Content]
               - content changed (86 → 97 lines) — claude.md
  * CHANGED  node 53 — Confirm Appointment [Content]
               - content changed (3537 → 3476 characters) — Confirm Appointment
  * CHANGED  node 149 — Initial Insurance Collect [Content]
               - content changed (1926 → 1506 characters) — Initial Insurance Collect
               - form field order changed
  * CHANGED  node 167 — Medicaid [Content]
               - content changed (11 → 11 lines) — Medicaid
  * CHANGED  node 184 — WC or MVA? [Content]
               - button added/changed: "Neither" → node 198
               - button removed/replaced: "Insurance" → node 198
               - button removed/replaced: "Private Pay" → node 150
  * CHANGED  node 188 — Build Insurance Catalogue (static list with status) [Script]
               - page_title: "Build Insurance Options (static list)" → "Build Insurance Catalogue (static list with status)"
               - script code changed (61 → 66 lines) — Build Insurance Catalogue (static list with status)
  * CHANGED  node 199 — Using Insurance? / Select Insurance (dropdown clinics) [Content]
               - page_title: "Select Insurance (Brooklyn / Charlotte)" → "Using Insurance? / Select Insurance (dropdown clinics)"
               - content changed (11 → 11 lines) — Using Insurance? / Select Insurance (dropdown clinics)
               - form field added: is_using_insurance (radio)
               - form field added: patient_insurance_other (text)
  * CHANGED  node 200 — Route Insurance Selection [Script]
               - script code changed (12 → 29 lines) — Route Insurance Selection
  * CHANGED  node 201 — Insurance Route [Scoring]
               - button added/changed: "insurance_route == 'self_pay'" → node 150 [logic: insurance_route == 'self_pay']
               - button added/changed: "insurance_route == 'not_accepted_medicaid'" → node 167 [logic: insurance_route == 'not_accepted_medicaid']
               - button added/changed: "insurance_route == 'not_accepted_other'" → node 3 [logic: insurance_route == 'not_accepted_other']
               - button added/changed: "insurance_route == 'managed'" → node 6 [logic: insurance_route == 'managed']
               - button added/changed: "" → node 1
               - button removed/replaced: "insurance_route == 'not_accepted'" → node 150
               - button removed/replaced: "insurance_route == 'medicaid_not_accepted'" → node 167
               - button removed/replaced: "insurance_route == 'private_pay'" → node 150
               - button removed/replaced: "" → node 1

## TREE SHAPE

  node type                before    after    delta
  Content                      75       77       +2
  Data                          1        1       +0
  Scoring                      27       27       +0
  Script                        6        6       +0
  Tree                         16       16       +0
  TOTAL                       125      127       +2

  Root node unchanged (node 30).

## STRUCTURAL SANITY

  No broken links introduced.
  No nodes became unreachable.
  Pre-existing in the BEFORE tree (not caused by this edit): 41 broken link(s), 29 unreachable node(s).

## UNTOUCHED NODES (116)

  1, 4, 5, 8, 9, 10, 11, 19, 21, 29, 30, 31, 32, 33, 34, 42, 43, 45, 50, 51, 52, 54, 64, 65, 66, 67, 68, 69, 72, 73, 75, 77, 78, 80, 85, 86, 88, 91, 92, 93, 94, 95, 96, 97, 100, 101, 102, 103, 104, 105, 106, 107, 108, 109, 110, 111, 112, 113, 115, 118, 119, 120, 123, 124, 125, 126, 127, 128, 135, 136, 137, 138, 139, 141, 142, 144, 145, 150, 151, 152, 153, 155, 156, 157, 158, 159, 160, 161, 162, 163, 164, 165, 166, 168, 169, 170, 171, 172, 173, 174, 175, 176, 177, 179, 180, 181, 182, 183, 185, 186, 189, 190, 191, 192, 193, 198

## TREE-LEVEL SETTINGS CHANGED (0)

  (none)

## COSMETIC / EDITOR-ONLY CHANGES (0) — ignore

  (none)

## LINE-LEVEL BODY DIFFS (7)

### node 2 — claude.md (content)

```diff
--- before/node 2 content
+++ after/node 2 content
@@ -6,15 +6,17 @@
 
 <h3>Node map - insurance path</h3>
 <pre>
- 31 Collect DOB (Tree) -> 188 Build Insurance Options (Script, static list) -> 4
-184 WC or MVA? [Insurance] -> 198 Insurance Dropdown Region? (Logic)
-      is_display_insurance_dropdown == 'true' -> 199 Select Insurance (Content, one Continue)
+ 31 Collect DOB (Tree) -> 188 Build Insurance Catalogue (Script, static list with status) -> 4
+184 WC or MVA? [WC] [MVA] -> 170   [Neither] -> 198 Insurance Dropdown Region? (Logic)
+      is_display_insurance_dropdown == 'true' -> 199 Using Insurance? / Select Insurance
       default                                 -> 119 What Benefits? (status quo, four buttons)
+199 is_using_insurance Yes/No, insurance_selection (shown on Yes), patient_insurance_other (shown on 10005 Other)
 199 -> 200 Route Insurance Selection (Script) -> 201 Insurance Route (Logic)
-      not_accepted          -> 150
-      medicaid_not_accepted -> 167
-      private_pay           -> 150
-      default (an insurance)-> 1 -> 149 Initial Insurance Collect (subscriber details, no dropdown)
+      self_pay              -> 150 self-pay pricing
+      not_accepted_medicaid -> 167 Medicaid not accepted -> 34
+      not_accepted_other    -> 3 self-pay rates -> 183 / 155 / 34
+      managed               -> 6 call back next month -> 34
+      default (accepted)    -> 1 -> 149 Initial Insurance Collect (card radio first, subscriber details)
 149 [Add Secondary] -> 186 (secondary dropdown, transforms.insurance_list)
 Every exit goes to 34 (Tree -> Incoming Call node 41). The create-insurance POST runs in
 Incoming Call (nodes 162-164) after the appointment, because it needs the patient number.
@@ -34,14 +36,16 @@
 <ul>
 <li><b>new_cost_code</b> - the clinic cost code, under the name the Azure object's query
 string reads. Written by node 1, read only by that Connected Object.</li>
-<li><b>region</b> - clinic region from SharePoint clinic info (tree 787613344). Read by node 188.</li>
-<li><b>is_display_insurance_dropdown</b> - boolean, written by node 188, sends Brooklyn / Charlotte calls to node 199 (router 198).</li>
+<li><b>clinic_raintree_code</b> - clinic code (e.g. NY181). Node 188 matches it, upper-cased, against INSURANCE_DROPDOWN_CLINICS.</li>
+<li><b>is_display_insurance_dropdown</b> - "true"/"false", written by node 188, sends dropdown-clinic calls to node 199 (router 198).</li>
+<li><b>insurance_catalog</b> - form data, JSON [{value, label, status}]. Written by node 188, read by node 200.</li>
+<li><b>is_using_insurance</b> - node 199 radio, Yes / No. Read by node 200.</li>
 <li><b>insurance_list</b> - transform, [{name: label, value: code}], accepted insurances only (Kelsie, 2026-10-08).
 Written by node 188. Option source for node 186.</li>
-<li><b>insurance_selection_list</b> - transform, insurance_list plus three routes (not_accepted,
-medicaid_not_accepted, private_pay). Written by node 188. Option source for node 199.</li>
+<li><b>insurance_selection_list</b> - transform, every catalogue entry. Written by node 188. Option source for node 199.</li>
 <li><b>insurance_selection</b> - node 199's pick. Read only by node 200.</li>
-<li><b>insurance_route</b> - accepted / not_accepted / medicaid_not_accepted / private_pay. Written by node 200, read by router 201.</li>
+<li><b>insurance_route</b> - self_pay / accepted / not_accepted_medicaid / not_accepted_other / managed. Written by node 200, read by router 201.</li>
+<li><b>patient_insurance_other</b> - insurance name for the Incoming Call summaries. On the dropdown path node 200 writes the selected label; for 10005 Other the agent types it on node 199.</li>
 <li><b>patient_insurance_rt_code</b> - Raintree insurance code (e.g. 10012). Written only by node 200, and only for an
 accepted insurance (blank otherwise). Incoming Call 162-164 POSTs it. secondary_patient_insurance_rt_code is node 186's pick.</li>
 </ul>
@@ -56,7 +60,7 @@
 
 <h3>Gotchas</h3>
 <ul>
-<li>Region gate: only Brooklyn, North Charlotte, South Charlotte (case-insensitive) get node 199. Every other
+<li>Clinic gate: only clinics in INSURANCE_DROPDOWN_CLINICS (node 188, 81 codes + ZZZ test clinic) get node 199. New York region codes still to come from Kelsie. Every other
 region keeps node 119's four buttons and no insurance code is captured, so no insurance is POSTed for them. Everyone else uses the free-text insurance field.</li>
 <li>node 149 field selected_case_type is a select with no option source. Leftover from the 9/28 session.</li>
 <li>Kelsie's list repeats 10009 Medicaid Advantage (MDA) and has no 10010. Kept once as 10009; confirm 10010 with her.</li>
@@ -66,6 +70,13 @@
 
 <h3>Changelog</h3>
 <ul>
+<li>2026-10-13 - Jami's updated flowchart and the 10/13 Insurance Updates call. 184 is WC / MVA / Neither. 199 asks
+"Will you be using insurance?" (No -> 150), shows the dropdown on Yes and an insurance-name box for Other.
+Every dropdown entry carries a status (188 insurance_catalog) and 201 routes on it: accepted -> 149,
+not_accepted_medicaid -> 167, not_accepted_other -> 3, managed -> 6. Red not-accepted panels removed from 199 and 149.
+149 asks for the card first. No-card wording on 149, Medicaid wording on 167, last bullet on 53 per the flowchart.
+188 gate is now clinic codes; fixed the match (codes are upper case, the old check lower-cased the input) and added ZZZ.
+Statuses are static until SharePoint returns name, code and status.</li>
 <li>2026-10-08 (pm) - 10/8 Ivy call with Kelsie. Brooklyn / Charlotte calls now pick the insurance on one dropdown
 (node 199: accepted insurances + Insurance Not Accepted / Medicaid Not Accepted / Private Pay) with one Continue,
 routed by 200 + 201 instead of four buttons. 184 [Insurance] -> 198 region router; other regions keep 119 as-is.
```

### node 53 — Confirm Appointment (content)

```diff
--- before/node 53 content
+++ after/node 53 content
@@ -1 +1 @@
-<!-- begin CLINIC INFO BUNDLE --><div class="clinic-info-modal-bundle"><!-- begin CLINIC INFO POPUP MODAL -->${actions.clinicinfoprod.show_variables.clinic_info_popup} <!-- end CLINIC INFO POPUP MODAL --> <!--begin CALL INFO HEADER --><div class="call-info-header panel panel-reference panel-horizontal"><div class="panel-heading"><i class="fa fa-phone-square" aria-hidden="true"></i></div><div class="panel-body"><div class="col-md-6"><strong><i class="fa fa-building-o" aria-hidden="true"></i> CLINIC</strong> <a onclick="openClinicInfoModal(this)"><i class="fa fa-info-circle" data-toggle="tooltip" data-placement="right" title="more Clinic Info" aria-hidden="true"></i><span class="sr-only">more Clinic Info</span></a><br>#name# (#clinic_raintree_code#)</div><div class="col-md-3"><strong><i class="fa fa-user-o" aria-hidden="true"></i> CALLER</strong><br>#caller_first_name# #caller_last_name#<br>#caller_phone_number#</div><div class="col-md-3"><strong><i class="fa fa-user-plus" aria-hidden="true"></i> PATIENT</strong><br>#patient_first_name# #patient_last_name#<br><i class="fa fa-birthday-cake" aria-hidden="true"></i> #patient_dob#</div></div></div><!--end CALL INFO HEADER --></div><!-- end CLINIC INFO BUNDLE --><div class="panel panel-reference panel-horizontal"><div class="panel-heading"><i class="fa fa-calendar" aria-hidden="true"></i></div><div class="panel-body"><div class="clinic-info-modal-bundle"><!-- begin CLINIC INFO POPUP MODAL -->${actions.clinicinfoprod.show_variables.appt_clinic_info_popup}<!-- end CLINIC INFO POPUP MODAL --><div class="col-md-6"><strong><i class="fa fa-building-o" aria-hidden="true"></i> APPOINTMENT CLINIC</strong> <a onclick="openClinicInfoModal(this)"><i class="fa fa-info-circle" data-toggle="tooltip" data-placement="right" title="more Clinic Info" aria-hidden="true"></i><span class="sr-only">more Clinic Info</span></a><br>#appt_clinic# (#appt_clinic_raintree_code#)<br>#appt_clinic_address#</div><div class="col-md-6"><strong><i class="fa fa-clock-o" aria-hidden="true"></i> APPOINTMENT</strong><br>#formatted_appt_date# @ #appt_time#<br>with #appt_provider#</div></div></div></div><div class="panel panel-script panel-horizontal"><div class="panel-heading"><i class="fa fa-microphone" aria-hidden="true"></i></div><div class="panel-body"><p id="isPasted">&quot;Wonderful! Before we wrap up, I have a few more quick items:</p><ul><li>Arrive 15 minutes early and dress comfortably for your appointment, at <strong>#appt_time#</strong> on<strong>&nbsp;#appt_date#</strong> with <strong>#appt_provider#&nbsp;</strong>in our<strong>&nbsp;#appt_clinic#</strong> [<span class="pronunciation">#phonetic_pronunciation#</span>] <strong><a id="modal-toggle-link" class="btn btn-primary" onclick="speak('pronounce_clinic_name')"><i class="fa fa-volume-up" aria-hidden="true"></i></a></strong>clinic located at <strong>#appt_clinic_address#</strong></li><li id="isPasted">Do you know where we are located?</li><li>Our patient coordinator will call you to finalize your registration. We do require that you speak to our in-clinic patient coordinator prior to your appointment, so please be on the lookout for a call from our main number.</li><li>Don&#39;t forget to bring your ID and you <strong>must bring your physical insurance card&nbsp;</strong>to your appointment. If you have more questions about your insurance, please feel free to call your insurance company directly</li></ul><p>And lastly, you will receive an email containing a link to your patient portal.&quot;</p></div></div>
+<!-- begin CLINIC INFO BUNDLE --><div class="clinic-info-modal-bundle"><!-- begin CLINIC INFO POPUP MODAL -->${actions.clinicinfoprod.show_variables.clinic_info_popup} <!-- end CLINIC INFO POPUP MODAL --> <!--begin CALL INFO HEADER --><div class="call-info-header panel panel-reference panel-horizontal"><div class="panel-heading"><i class="fa fa-phone-square" aria-hidden="true"></i></div><div class="panel-body"><div class="col-md-6"><strong><i class="fa fa-building-o" aria-hidden="true"></i> CLINIC</strong> <a onclick="openClinicInfoModal(this)"><i class="fa fa-info-circle" data-toggle="tooltip" data-placement="right" title="more Clinic Info" aria-hidden="true"></i><span class="sr-only">more Clinic Info</span></a><br>#name# (#clinic_raintree_code#)</div><div class="col-md-3"><strong><i class="fa fa-user-o" aria-hidden="true"></i> CALLER</strong><br>#caller_first_name# #caller_last_name#<br>#caller_phone_number#</div><div class="col-md-3"><strong><i class="fa fa-user-plus" aria-hidden="true"></i> PATIENT</strong><br>#patient_first_name# #patient_last_name#<br><i class="fa fa-birthday-cake" aria-hidden="true"></i> #patient_dob#</div></div></div><!--end CALL INFO HEADER --></div><!-- end CLINIC INFO BUNDLE --><div class="panel panel-reference panel-horizontal"><div class="panel-heading"><i class="fa fa-calendar" aria-hidden="true"></i></div><div class="panel-body"><div class="clinic-info-modal-bundle"><!-- begin CLINIC INFO POPUP MODAL -->${actions.clinicinfoprod.show_variables.appt_clinic_info_popup}<!-- end CLINIC INFO POPUP MODAL --><div class="col-md-6"><strong><i class="fa fa-building-o" aria-hidden="true"></i> APPOINTMENT CLINIC</strong> <a onclick="openClinicInfoModal(this)"><i class="fa fa-info-circle" data-toggle="tooltip" data-placement="right" title="more Clinic Info" aria-hidden="true"></i><span class="sr-only">more Clinic Info</span></a><br>#appt_clinic# (#appt_clinic_raintree_code#)<br>#appt_clinic_address#</div><div class="col-md-6"><strong><i class="fa fa-clock-o" aria-hidden="true"></i> APPOINTMENT</strong><br>#formatted_appt_date# @ #appt_time#<br>with #appt_provider#</div></div></div></div><div class="panel panel-script panel-horizontal"><div class="panel-heading"><i class="fa fa-microphone" aria-hidden="true"></i></div><div class="panel-body"><p id="isPasted">&quot;Wonderful! Before we wrap up, I have a few more quick items:</p><ul><li>Arrive 15 minutes early and dress comfortably for your appointment, at <strong>#appt_time#</strong> on<strong>&nbsp;#appt_date#</strong> with <strong>#appt_provider#&nbsp;</strong>in our<strong>&nbsp;#appt_clinic#</strong> [<span class="pronunciation">#phonetic_pronunciation#</span>] <strong><a id="modal-toggle-link" class="btn btn-primary" onclick="speak('pronounce_clinic_name')"><i class="fa fa-volume-up" aria-hidden="true"></i></a></strong>clinic located at <strong>#appt_clinic_address#</strong></li><li id="isPasted">Do you know where we are located?</li><li>Our patient coordinator will call you to finalize your registration. We do require that you speak to our in-clinic patient coordinator prior to your appointment, so please be on the lookout for a call from our main number.</li><li>You will also receive an email with the welcome letter including your patient portal log in details where you can upload your insurance and ID cards. These documents are required and essential for verification, so please do this prior to your appointment.&quot;</li></ul></div></div>
```

### node 149 — Initial Insurance Collect (content)

```diff
--- before/node 149 content
+++ after/node 149 content
@@ -1 +1 @@
-<!-- begin CLINIC INFO BUNDLE --><div class="clinic-info-modal-bundle"><!-- begin CLINIC INFO POPUP MODAL -->${actions.clinicinfoprod.show_variables.clinic_info_popup} <!-- end CLINIC INFO POPUP MODAL --> <!--begin CALL INFO HEADER --><div class="call-info-header panel panel-reference panel-horizontal"><div class="panel-heading"><i class="fa fa-phone-square" aria-hidden="true"></i></div><div class="panel-body"><div class="col-md-6"><strong><i class="fa fa-building-o" aria-hidden="true"></i> CLINIC</strong> <a onclick="openClinicInfoModal(this)"><i class="fa fa-info-circle" data-toggle="tooltip" data-placement="right" title="more Clinic Info" aria-hidden="true"></i><span class="sr-only">more Clinic Info</span></a><br>#name# (#clinic_raintree_code#)</div><div class="col-md-3"><strong><i class="fa fa-user-o" aria-hidden="true"></i> CALLER</strong><br>#caller_first_name# #caller_last_name#<br>#caller_phone_number#</div><div class="col-md-3"><strong><i class="fa fa-user-plus" aria-hidden="true"></i> PATIENT</strong><br>#patient_first_name# #patient_last_name#<br><i class="fa fa-birthday-cake" aria-hidden="true"></i> #patient_dob#</div></div></div><!--end CALL INFO HEADER --></div><!-- end CLINIC INFO BUNDLE --><div class="panel panel-script panel-horizontal"><div class="panel-heading"><i class="fa fa-microphone" aria-hidden="true"></i></div><div class="panel-body"><p>&quot;May I have the name of your insurance and whether it is Medicaid or Medicare, please?&quot;</p></div></div><div class="panel panel-insurance panel-horizontal"><div class="panel-heading"><i class="fa fa-warning" aria-hidden="true"></i></div><div class="panel-body"><p>The following insurances are not accepted at the selected clinic: &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;&nbsp;&nbsp;<!--	<br>#appt_not_accepted_insurances#</p> --><br>${actions.clinicinfoprod.show_variables.not_accepted_insurances}</p><p><br></p></div></div>
+<!-- begin CLINIC INFO BUNDLE --><div class="clinic-info-modal-bundle"><!-- begin CLINIC INFO POPUP MODAL -->${actions.clinicinfoprod.show_variables.clinic_info_popup} <!-- end CLINIC INFO POPUP MODAL --> <!--begin CALL INFO HEADER --><div class="call-info-header panel panel-reference panel-horizontal"><div class="panel-heading"><i class="fa fa-phone-square" aria-hidden="true"></i></div><div class="panel-body"><div class="col-md-6"><strong><i class="fa fa-building-o" aria-hidden="true"></i> CLINIC</strong> <a onclick="openClinicInfoModal(this)"><i class="fa fa-info-circle" data-toggle="tooltip" data-placement="right" title="more Clinic Info" aria-hidden="true"></i><span class="sr-only">more Clinic Info</span></a><br>#name# (#clinic_raintree_code#)</div><div class="col-md-3"><strong><i class="fa fa-user-o" aria-hidden="true"></i> CALLER</strong><br>#caller_first_name# #caller_last_name#<br>#caller_phone_number#</div><div class="col-md-3"><strong><i class="fa fa-user-plus" aria-hidden="true"></i> PATIENT</strong><br>#patient_first_name# #patient_last_name#<br><i class="fa fa-birthday-cake" aria-hidden="true"></i> #patient_dob#</div></div></div><!--end CALL INFO HEADER --></div><!-- end CLINIC INFO BUNDLE --><div class="panel panel-script panel-horizontal"><div class="panel-heading"><i class="fa fa-microphone" aria-hidden="true"></i></div><div class="panel-body"><p>&quot;Perfect! I just need to gather a few more details. Do you have your insurance card available?&quot;</p></div></div>
```

### node 167 — Medicaid (content)

```diff
--- before/node 167 content
+++ after/node 167 content
@@ -8,4 +8,4 @@
 				<br>#appt_clinic_address#</div>
 			<div class="col-md-6"><strong><i class="fa fa-clock-o" aria-hidden="true"></i> APPOINTMENT</strong>
 				<br>#formatted_appt_date# @ #appt_time#
-				<br>with #appt_provider#</div></div></div></div> --><div class="panel panel-script panel-horizontal"><div class="panel-heading"><i class="fa fa-microphone" aria-hidden="true"></i></div><div class="panel-body"><p>&quot;&quot;Thank you for providing that information. At this time, your Medicaid plan is not accepted at our clinic. We recommend reaching out to your insurance company for a list of in-network providers&quot;</p></div></div>
+				<br>with #appt_provider#</div></div></div></div> --><div class="panel panel-script panel-horizontal"><div class="panel-heading"><i class="fa fa-microphone" aria-hidden="true"></i></div><div class="panel-body"><p>&quot;Thank you for providing that information. I have checked your coverage, and your Medicaid plan is not accepted at this location or our nearby locations. We recommend contacting your insurance company for a list of in-network providers. Is there anything else I can help you with?&quot;</p></div></div>
```

### node 188 — Build Insurance Catalogue (static list with status) (script code)

```diff
--- before/node 188 content
+++ after/node 188 content
@@ -1,48 +1,52 @@
 // --- inputs -----------------------------------------------------------------
-// region comes from the SharePoint clinic info (tree 787613344).
-// let region = ZT.getVariableValue("region", "");
-let clinic_code = ZT.getVariableValue("clinic_raintree_code")
+// clinic_raintree_code comes from the clinic info (Incoming Call / tree 787613344).
+let clinic_code = String(ZT.getVariableValue("clinic_raintree_code", "")).trim().toUpperCase();
 
-// --- accepted insurances (Kelsie, 2026-10-08) --------------------------------
-// code = Raintree insurance code, the only insurance value sent to Raintree.
-// label = what the agent sees. Raintree fills in the insurance name from the code.
-// Static until Ivy's SharePoint API returns name, code and status (see requirements CR-7).
-const INSURANCE_OPTIONS = [
-  { code: "10001", label: "Aetna" },
-  { code: "10002", label: "MVA" },
-  { code: "10003", label: "BCBS" },
-  { code: "10004", label: "Cigna" },
-  { code: "10005", label: "Other" },
-  { code: "10006", label: "Medicare Advantage -MA" },
-  { code: "10007", label: "Medicare (MC)" },
-  { code: "10008", label: "Medicaid (MD)" },
-  { code: "10009", label: "Medicaid Advantage (MDA)" },
-  { code: "10011", label: "Tricare/VA" },
-  { code: "10012", label: "UHC" },
-  { code: "10013", label: "Workers Comp (WC)" }
-];
-
-// Node 199 routes on these instead of four buttons; node 200 reads the value back.
-const ROUTE_OPTIONS = [
-  { name: "Insurance Not Accepted", value: "not_accepted" },
-  { name: "Medicaid Not Accepted", value: "medicaid_not_accepted" },
-  { name: "Private Pay", value: "private_pay" }
+// --- insurance catalogue -----------------------------------------------------
+// value  = what the dropdown returns. For an accepted insurance it is the Raintree insurance
+//          code, the only insurance value sent to Raintree (Raintree fills in the name).
+// label  = what the agent sees.
+// status = where node 201 routes the call:
+//          accepted              -> collect insurance details and schedule
+//          not_accepted_medicaid -> Medicaid not accepted, end call
+//          not_accepted_other    -> not accepted, offer self-pay rates, schedule or end call
+//          managed               -> not taking new patients on this plan, call back next month
+// 10005 Other is accepted and opens a free-text insurance name on node 199.
+// Static until Ivy's SharePoint API returns name, code and status for every insurance.
+let insurance_catalog = [
+  { value: "10001", label: "Aetna", status: "accepted" },
+  { value: "10002", label: "MVA", status: "accepted" },
+  { value: "10003", label: "BCBS", status: "accepted" },
+  { value: "10004", label: "Cigna", status: "accepted" },
+  { value: "10005", label: "Other", status: "accepted" },
+  { value: "10006", label: "Medicare Advantage -MA", status: "accepted" },
+  { value: "10007", label: "Medicare (MC)", status: "accepted" },
+  { value: "10008", label: "Medicaid (MD)", status: "accepted" },
+  { value: "10009", label: "Medicaid Advantage (MDA)", status: "accepted" },
+  { value: "10011", label: "Tricare/VA", status: "accepted" },
+  { value: "10012", label: "UHC", status: "accepted" },
+  { value: "10013", label: "Workers Comp (WC)", status: "accepted" },
+  { value: "medicaid_not_listed", label: "Medicaid plan not listed", status: "not_accepted_medicaid" },
+  { value: "other_not_listed", label: "Other insurance not listed", status: "not_accepted_other" }
 ];
 
 // --- dropdown options --------------------------------------------------------
-// insurance_list: accepted insurances only (secondary insurance on node 186).
-// insurance_selection_list: accepted insurances plus the three routes (node 199).
+// insurance_selection_list: every catalogue entry, the option source for node 199.
+// insurance_list: accepted insurances only, the option source for node 186 (secondary).
+let insurance_selection_list = [];
 let insurance_list = [];
-for (let i = 0; i < INSURANCE_OPTIONS.length; i++) {
-  insurance_list.push({ name: INSURANCE_OPTIONS[i].label, value: INSURANCE_OPTIONS[i].code });
+for (let i = 0; i < insurance_catalog.length; i++) {
+  let entry = insurance_catalog[i];
+  insurance_selection_list.push({ name: entry.label, value: entry.value });
+  if (entry.status === "accepted") {
+    insurance_list.push({ name: entry.label, value: entry.value });
+  }
 }
-let insurance_selection_list = insurance_list.concat(ROUTE_OPTIONS);
 
-// --- staged rollout: only these regions get the dropdown screen --------------
-// const INSURANCE_DROPDOWN_REGIONS = ["brooklyn", "north charlotte", "south charlotte"];
-
-// Codes of Brooklyn & Charlotte:
-const INSURANCE_DROPDOWN_REGIONS = [
+// --- staged rollout: only these clinics get the dropdown screen --------------
+// Brooklyn, Long Island, South Charlotte, Virginia Beach and Northeast New Jersey clinics
+// plus ZZZ, the test clinic. New York region codes still to be added.
+const INSURANCE_DROPDOWN_CLINICS = [
   "NY181", "NY182", "NY268", "NY186", "NY267", "NY264", "NY162", "NY269", "NY171", "NY163",
   "NY169", "NY302", "NY183", "NY172", "NC405", "NC435", "NC258", "NC433", "NC436", "NC408",
   "SC424", "SC431", "NC422", "SC425", "NC409", "SC432", "SC451", "VA764", "VA758", "VA759",
@@ -51,11 +55,12 @@
   "NY176", "NY174", "NY192", "NY193", "NY194", "NY195", "NJ678", "NJ661", "NJ662", "NJ664",
   "NJ663", "NJ665", "NJ666", "NJ667", "NJ671", "NJ693", "NJ604", "NJ605", "NJ607", "NJ672",
   "NJ634", "NJ691", "NJ633", "NJ689", "NJ673", "NJ618", "NJ677", "NJ632", "NJ682", "NJ707",
-  "NY196"
+  "NY196", "ZZZ"
 ];
-let is_display_insurance_dropdown = INSURANCE_DROPDOWN_REGIONS.includes(String(clinic_code).trim().toLowerCase());
+let is_display_insurance_dropdown = INSURANCE_DROPDOWN_CLINICS.includes(clinic_code);
 
 // --- outputs ----------------------------------------------------------------
+ZT.setFormData("insurance_catalog", JSON.stringify(insurance_catalog));
 ZT.setTransformData("insurance_list", insurance_list);
 ZT.setTransformData("insurance_selection_list", insurance_selection_list);
 ZT.setFormData("is_display_insurance_dropdown", is_display_insurance_dropdown ? "true" : "false");
```

### node 199 — Using Insurance? / Select Insurance (dropdown clinics) (content)

```diff
--- before/node 199 content
+++ after/node 199 content
@@ -8,4 +8,4 @@
 				<br>#appt_clinic_address#</div>
 			<div class="col-md-6"><strong><i class="fa fa-clock-o" aria-hidden="true"></i> APPOINTMENT</strong>
 				<br>#formatted_appt_date# @ #appt_time#
-				<br>with #appt_provider#</div></div></div></div> --><div class="panel panel-script panel-horizontal"><div class="panel-heading"><i class="fa fa-microphone"></i></div><div class="panel-body"><p>&quot;What type of benefits will you be using? Please let me know whether your insurance is Medicare or Medicaid.&quot;</p></div></div><div class="panel panel-insurance panel-horizontal"><div class="panel-heading"><i class="fa fa-warning"></i></div><div class="panel-body"><p>The following insurances are not accepted at the selected clinic: &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;&nbsp;&nbsp;<!--	<br>#appt_not_accepted_insurances#</p> --><br>${actions.clinicinfoprod.show_variables.not_accepted_insurances}</p></div></div>
+				<br>with #appt_provider#</div></div></div></div> --><div class="panel panel-script panel-horizontal"><div class="panel-heading"><i class="fa fa-microphone"></i></div><div class="panel-body"><p>&quot;Will you be using insurance?&quot;</p></div></div>
```

### node 200 — Route Insurance Selection (script code)

```diff
--- before/node 200 content
+++ after/node 200 content
@@ -1,12 +1,29 @@
 // --- inputs -----------------------------------------------------------------
-// The agent's pick on node 199: an insurance code, or one of the three route values.
+// The agent's answers on node 199, and the catalogue node 188 built the dropdown from.
+let is_using_insurance = ZT.getVariableValue("is_using_insurance", "");
 let insurance_selection = ZT.getVariableValue("insurance_selection", "");
+let insurance_catalog = JSON.parse(ZT.getVariableValue("insurance_catalog", "[]"));
 
 // --- route ------------------------------------------------------------------
-const ROUTES = ["not_accepted", "medicaid_not_accepted", "private_pay"];
-let insurance_route = ROUTES.includes(insurance_selection) ? insurance_selection : "accepted";
+// No insurance means self-pay. Otherwise the selected entry's status is the route.
+// An entry missing from the catalogue goes to details with no code, so nothing is POSTed.
+let insurance_route = "self_pay";
+let patient_insurance_rt_code = "";
+let selected_insurance = { value: "", label: "", status: "accepted" };
+if (is_using_insurance === "Yes") {
+  selected_insurance = insurance_catalog.find(entry => entry.value === insurance_selection) || selected_insurance;
+  insurance_route = selected_insurance.status;
+  if (insurance_route === "accepted") {
+    patient_insurance_rt_code = selected_insurance.value;
+  }
+}
 
 // --- outputs ----------------------------------------------------------------
 // Only an accepted insurance becomes the Raintree code; Incoming Call node 162 POSTs it.
-ZT.setFormData("patient_insurance_rt_code", insurance_route === "accepted" ? insurance_selection : "");
+// The insurance name goes to patient_insurance_other, which the Incoming Call summaries print.
+// For Other (10005) the agent already typed it on node 199, so it is left as typed.
+ZT.setFormData("patient_insurance_rt_code", patient_insurance_rt_code);
 ZT.setFormData("insurance_route", insurance_route);
+if (is_using_insurance === "Yes" && selected_insurance.value !== "10005") {
+  ZT.setFormData("patient_insurance_other", selected_insurance.label);
+}
```

## CHANGES THAT NEED AN EXPLANATION

Every line below must map to a requirement or an explicit request.
Anything unexplained is unintended drift — revert it before delivering.

  [ ] added node 3 (Insurance Not Accepted - Self-Pay Rates (dropdown clinics))
  [ ] added node 6 (Insurance Managed - Not Accepting New Patients (dropdown clinics))
  [ ] node 2 — content changed (86 → 97 lines) — claude.md
  [ ] node 53 — content changed (3537 → 3476 characters) — Confirm Appointment
  [ ] node 149 — content changed (1926 → 1506 characters) — Initial Insurance Collect
  [ ] node 149 — form field order changed
  [ ] node 167 — content changed (11 → 11 lines) — Medicaid
  [ ] node 184 — button added/changed: "Neither" → node 198
  [ ] node 184 — button removed/replaced: "Insurance" → node 198
  [ ] node 184 — button removed/replaced: "Private Pay" → node 150
  [ ] node 188 — page_title: "Build Insurance Options (static list)" → "Build Insurance Catalogue (static list with status)"
  [ ] node 188 — script code changed (61 → 66 lines) — Build Insurance Catalogue (static list with status)
  [ ] node 199 — page_title: "Select Insurance (Brooklyn / Charlotte)" → "Using Insurance? / Select Insurance (dropdown clinics)"
  [ ] node 199 — content changed (11 → 11 lines) — Using Insurance? / Select Insurance (dropdown clinics)
  [ ] node 199 — form field added: is_using_insurance (radio)
  [ ] node 199 — form field added: patient_insurance_other (text)
  [ ] node 200 — script code changed (12 → 29 lines) — Route Insurance Selection
  [ ] node 201 — button added/changed: "insurance_route == 'self_pay'" → node 150 [logic: insurance_route == 'self_pay']
  [ ] node 201 — button added/changed: "insurance_route == 'not_accepted_medicaid'" → node 167 [logic: insurance_route == 'not_accepted_medicaid']
  [ ] node 201 — button added/changed: "insurance_route == 'not_accepted_other'" → node 3 [logic: insurance_route == 'not_accepted_other']
  [ ] node 201 — button added/changed: "insurance_route == 'managed'" → node 6 [logic: insurance_route == 'managed']
  [ ] node 201 — button added/changed: "" → node 1
  [ ] node 201 — button removed/replaced: "insurance_route == 'not_accepted'" → node 150
  [ ] node 201 — button removed/replaced: "insurance_route == 'medicaid_not_accepted'" → node 167
  [ ] node 201 — button removed/replaced: "insurance_route == 'private_pay'" → node 150
  [ ] node 201 — button removed/replaced: "" → node 1

