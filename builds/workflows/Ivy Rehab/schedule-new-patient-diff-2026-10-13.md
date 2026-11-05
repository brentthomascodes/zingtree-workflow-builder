========================================================================
WORKFLOW DIFF — Schedule New Patient Appointment
========================================================================

Before : Schedule New Patient Appointment (insurance dropdown routing 2026-10-08).json  (125 nodes)
After  : Schedule New Patient Appointment (insurance status routing 2026-10-13).json  (127 nodes)

## PLAIN SUMMARY

114 of 127 nodes are byte-for-byte identical to the original (90% untouched).
2 nodes added, 0 removed, 0 renumbered, 11 modified.

In plain terms:
  + NEW      node 3 — Insurance Not Accepted - Self-Pay Rates (Brooklyn / Charlotte) [Content]
  + NEW      node 6 — Insurance Managed - Not Accepting New Patients (Brooklyn / Charlotte) [Content]
  * CHANGED  node 2 — claude.md [Content]
               - content changed (86 → 100 lines) — claude.md
  * CHANGED  node 53 — Confirm Appointment [Content]
               - content changed (3537 → 3713 characters) — Confirm Appointment
  * CHANGED  node 100 — WC Confirm Appointment [Content]
               - content changed (3355 → 3531 characters) — WC Confirm Appointment
  * CHANGED  node 118 — MVA Confirm Appointment [Content]
               - content changed (3259 → 3435 characters) — MVA Confirm Appointment
  * CHANGED  node 149 — Initial Insurance Collect [Content]
               - form field settings changed (same field names)
  * CHANGED  node 167 — Medicaid [Content]
               - content changed (11 → 11 lines) — Medicaid
  * CHANGED  node 184 — WC or MVA? [Content]
               - button added/changed: "Neither" → node 198
               - button removed/replaced: "Insurance" → node 198
               - button removed/replaced: "Private Pay" → node 150
  * CHANGED  node 188 — Build Insurance Catalogue (static list with status) [Script]
               - page_title: "Build Insurance Options (static list)" → "Build Insurance Catalogue (static list with status)"
               - script code changed (47 → 53 lines) — Build Insurance Catalogue (static list with status)
  * CHANGED  node 199 — Using Insurance? / Select Insurance (Brooklyn / Charlotte) [Content]
               - page_title: "Select Insurance (Brooklyn / Charlotte)" → "Using Insurance? / Select Insurance (Brooklyn / Charlotte)"
               - content changed (11 → 11 lines) — Using Insurance? / Select Insurance (Brooklyn / Charlotte)
               - form field added: is_using_insurance (radio)
  * CHANGED  node 200 — Route Insurance Selection [Script]
               - script code changed (12 → 22 lines) — Route Insurance Selection
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

## UNTOUCHED NODES (114)

  1, 4, 5, 8, 9, 10, 11, 19, 21, 29, 30, 31, 32, 33, 34, 42, 43, 45, 50, 51, 52, 54, 64, 65, 66, 67, 68, 69, 72, 73, 75, 77, 78, 80, 85, 86, 88, 91, 92, 93, 94, 95, 96, 97, 101, 102, 103, 104, 105, 106, 107, 108, 109, 110, 111, 112, 113, 115, 119, 120, 123, 124, 125, 126, 127, 128, 135, 136, 137, 138, 139, 141, 142, 144, 145, 150, 151, 152, 153, 155, 156, 157, 158, 159, 160, 161, 162, 163, 164, 165, 166, 168, 169, 170, 171, 172, 173, 174, 175, 176, 177, 179, 180, 181, 182, 183, 185, 186, 189, 190, 191, 192, 193, 198

## TREE-LEVEL SETTINGS CHANGED (0)

  (none)

## COSMETIC / EDITOR-ONLY CHANGES (0) — ignore

  (none)

## LINE-LEVEL BODY DIFFS (8)

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
-      default                                 -> 119 What Benefits? (status quo, four buttons)
-199 -> 200 Route Insurance Selection (Script) -> 201 Insurance Route (Logic)
-      not_accepted          -> 150
-      medicaid_not_accepted -> 167
-      private_pay           -> 150
-      default (an insurance)-> 1 -> 149 Initial Insurance Collect (subscriber details, no dropdown)
+ 31 Collect DOB (Tree) -> 188 Build Insurance Catalogue (Script, static list with status) -> 4
+184 WC or MVA? [WC] [MVA] -> 170   [Neither] -> 198 Insurance Dropdown Region? (Logic)
+      is_display_insurance_dropdown == 'true' -> 199 Using Insurance? / Select Insurance (one screen, one Continue)
+            is_using_insurance radio; insurance_selection dropdown shown only on Yes
+      default                                 -> 119 What Benefits? (status quo, four buttons incl. Private Pay)
+199 -> 200 Route Insurance Selection (Script) -> 201 Insurance Route (Logic, on insurance_route)
+      self_pay              -> 150 self-pay rates (Ready to Schedule / not at this time)
+      not_accepted_medicaid -> 167 Medicaid not accepted -> 34
+      not_accepted_other    -> 3 Not accepted, self-pay rates -> 183 / 155 / 34
+      managed               -> 6 Managed, call back next month -> 34
+      default (accepted)    -> 1 -> 149 Initial Insurance Collect (subscriber details)
 149 [Add Secondary] -> 186 (secondary dropdown, transforms.insurance_list)
 Every exit goes to 34 (Tree -> Incoming Call node 41). The create-insurance POST runs in
 Incoming Call (nodes 162-164) after the appointment, because it needs the patient number.
@@ -36,12 +38,14 @@
 string reads. Written by node 1, read only by that Connected Object.</li>
 <li><b>region</b> - clinic region from SharePoint clinic info (tree 787613344). Read by node 188.</li>
 <li><b>is_display_insurance_dropdown</b> - boolean, written by node 188, sends Brooklyn / Charlotte calls to node 199 (router 198).</li>
-<li><b>insurance_list</b> - transform, [{name: label, value: code}], accepted insurances only (Kelsie, 2026-10-08).
-Written by node 188. Option source for node 186.</li>
-<li><b>insurance_selection_list</b> - transform, insurance_list plus three routes (not_accepted,
-medicaid_not_accepted, private_pay). Written by node 188. Option source for node 199.</li>
+<li><b>insurance_catalog</b> - form data, JSON string [{value, label, status}]. The one insurance list. value is the
+Raintree code for accepted entries; status is accepted / not_accepted_medicaid / not_accepted_other / managed.
+Written by node 188, read by node 200.</li>
+<li><b>insurance_list</b> - transform derived from insurance_catalog, accepted entries only. Option source for node 186.</li>
+<li><b>insurance_selection_list</b> - transform derived from insurance_catalog, every entry. Option source for node 199.</li>
 <li><b>insurance_selection</b> - node 199's pick. Read only by node 200.</li>
-<li><b>insurance_route</b> - accepted / not_accepted / medicaid_not_accepted / private_pay. Written by node 200, read by router 201.</li>
+<li><b>is_using_insurance</b> - Yes / No radio on node 199. Read by node 200.</li>
+<li><b>insurance_route</b> - self_pay, or the selected entry's status. Written by node 200, read by router 201.</li>
 <li><b>patient_insurance_rt_code</b> - Raintree insurance code (e.g. 10012). Written only by node 200, and only for an
 accepted insurance (blank otherwise). Incoming Call 162-164 POSTs it. secondary_patient_insurance_rt_code is node 186's pick.</li>
 </ul>
@@ -56,6 +60,11 @@
 
 <h3>Gotchas</h3>
 <ul>
+<li>Status is static in node 188 until SharePoint returns name + code + status. Not-accepted insurances are two
+catch-all entries (Medicaid plan not listed / Other insurance not listed); no entry is managed yet, so node 6 is
+reachable only once one is added. The red not-accepted panel on 199 stays until the status data is live, because it
+is the only clinic-level not-accepted data the agent has.</li>
+<li>Node 167's Medicaid wording is shared with node 119 (other regions).</li>
 <li>Region gate: only Brooklyn, North Charlotte, South Charlotte (case-insensitive) get node 199. Every other
 region keeps node 119's four buttons and no insurance code is captured, so no insurance is POSTed for them. Everyone else uses the free-text insurance field.</li>
 <li>node 149 field selected_case_type is a select with no option source. Leftover from the 9/28 session.</li>
@@ -66,6 +75,11 @@
 
 <h3>Changelog</h3>
 <ul>
+<li>2026-10-13 - Jami's insurance flowchart (Mix Management Flow, 10/13). 184 buttons now WC / MVA / Neither.
+Brooklyn / Charlotte: 199 asks "Will you be using insurance?" with the dropdown shown only on Yes (No -> 150 self-pay).
+188 builds one insurance_catalog with a status per entry; 200 routes on status; 201 -> 150 / 167 / 3 / 6 / 1. New nodes
+3 (not accepted, self-pay rates) and 6 (managed). Wording: 199 asks for the insurance name, 167 Medicaid text, 149 no-card help text and checkbox,
+closing patient-portal line on 53 / 100 / 118.</li>
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
+<!-- begin CLINIC INFO BUNDLE --><div class="clinic-info-modal-bundle"><!-- begin CLINIC INFO POPUP MODAL -->${actions.clinicinfoprod.show_variables.clinic_info_popup} <!-- end CLINIC INFO POPUP MODAL --> <!--begin CALL INFO HEADER --><div class="call-info-header panel panel-reference panel-horizontal"><div class="panel-heading"><i class="fa fa-phone-square" aria-hidden="true"></i></div><div class="panel-body"><div class="col-md-6"><strong><i class="fa fa-building-o" aria-hidden="true"></i> CLINIC</strong> <a onclick="openClinicInfoModal(this)"><i class="fa fa-info-circle" data-toggle="tooltip" data-placement="right" title="more Clinic Info" aria-hidden="true"></i><span class="sr-only">more Clinic Info</span></a><br>#name# (#clinic_raintree_code#)</div><div class="col-md-3"><strong><i class="fa fa-user-o" aria-hidden="true"></i> CALLER</strong><br>#caller_first_name# #caller_last_name#<br>#caller_phone_number#</div><div class="col-md-3"><strong><i class="fa fa-user-plus" aria-hidden="true"></i> PATIENT</strong><br>#patient_first_name# #patient_last_name#<br><i class="fa fa-birthday-cake" aria-hidden="true"></i> #patient_dob#</div></div></div><!--end CALL INFO HEADER --></div><!-- end CLINIC INFO BUNDLE --><div class="panel panel-reference panel-horizontal"><div class="panel-heading"><i class="fa fa-calendar" aria-hidden="true"></i></div><div class="panel-body"><div class="clinic-info-modal-bundle"><!-- begin CLINIC INFO POPUP MODAL -->${actions.clinicinfoprod.show_variables.appt_clinic_info_popup}<!-- end CLINIC INFO POPUP MODAL --><div class="col-md-6"><strong><i class="fa fa-building-o" aria-hidden="true"></i> APPOINTMENT CLINIC</strong> <a onclick="openClinicInfoModal(this)"><i class="fa fa-info-circle" data-toggle="tooltip" data-placement="right" title="more Clinic Info" aria-hidden="true"></i><span class="sr-only">more Clinic Info</span></a><br>#appt_clinic# (#appt_clinic_raintree_code#)<br>#appt_clinic_address#</div><div class="col-md-6"><strong><i class="fa fa-clock-o" aria-hidden="true"></i> APPOINTMENT</strong><br>#formatted_appt_date# @ #appt_time#<br>with #appt_provider#</div></div></div></div><div class="panel panel-script panel-horizontal"><div class="panel-heading"><i class="fa fa-microphone" aria-hidden="true"></i></div><div class="panel-body"><p id="isPasted">&quot;Wonderful! Before we wrap up, I have a few more quick items:</p><ul><li>Arrive 15 minutes early and dress comfortably for your appointment, at <strong>#appt_time#</strong> on<strong>&nbsp;#appt_date#</strong> with <strong>#appt_provider#&nbsp;</strong>in our<strong>&nbsp;#appt_clinic#</strong> [<span class="pronunciation">#phonetic_pronunciation#</span>] <strong><a id="modal-toggle-link" class="btn btn-primary" onclick="speak('pronounce_clinic_name')"><i class="fa fa-volume-up" aria-hidden="true"></i></a></strong>clinic located at <strong>#appt_clinic_address#</strong></li><li id="isPasted">Do you know where we are located?</li><li>Our patient coordinator will call you to finalize your registration. We do require that you speak to our in-clinic patient coordinator prior to your appointment, so please be on the lookout for a call from our main number.</li><li>Don&#39;t forget to bring your ID and you <strong>must bring your physical insurance card&nbsp;</strong>to your appointment. If you have more questions about your insurance, please feel free to call your insurance company directly</li></ul><p>You will also receive an email with the welcome letter including your patient portal log in details where you can upload your insurance and ID cards. These documents are required and essential for verification, so please do this prior to your appointment.&quot;</p></div></div>
```

### node 100 — WC Confirm Appointment (content)

```diff
--- before/node 100 content
+++ after/node 100 content
@@ -1 +1 @@
-<!-- begin CLINIC INFO BUNDLE --><div class="clinic-info-modal-bundle"><!-- begin CLINIC INFO POPUP MODAL -->${actions.clinicinfoprod.show_variables.clinic_info_popup} <!-- end CLINIC INFO POPUP MODAL --> <!--begin CALL INFO HEADER --><div class="call-info-header panel panel-reference panel-horizontal"><div class="panel-heading"><i class="fa fa-phone-square" aria-hidden="true"></i></div><div class="panel-body"><div class="col-md-6"><strong><i class="fa fa-building-o" aria-hidden="true"></i> CLINIC</strong> <a onclick="openClinicInfoModal(this)"><i class="fa fa-info-circle" data-toggle="tooltip" data-placement="right" title="more Clinic Info" aria-hidden="true"></i><span class="sr-only">more Clinic Info</span></a><br>#name# (#clinic_raintree_code#)</div><div class="col-md-3"><strong><i class="fa fa-user-o" aria-hidden="true"></i> CALLER</strong><br>#caller_first_name# #caller_last_name#<br>#caller_phone_number#</div><div class="col-md-3"><strong><i class="fa fa-user-plus" aria-hidden="true"></i> PATIENT</strong><br>#patient_first_name# #patient_last_name#<br><i class="fa fa-birthday-cake" aria-hidden="true"></i> #patient_dob#</div></div></div><!--end CALL INFO HEADER --></div><!-- end CLINIC INFO BUNDLE --><div class="panel panel-reference panel-horizontal"><div class="panel-heading"><i class="fa fa-calendar" aria-hidden="true"></i></div><div class="panel-body"><div class="clinic-info-modal-bundle"><!-- begin CLINIC INFO POPUP MODAL -->${actions.clinicinfoprod.show_variables.appt_clinic_info_popup} <!-- end CLINIC INFO POPUP MODAL --><div class="col-md-6"><strong><i class="fa fa-building-o" aria-hidden="true"></i> APPOINTMENT CLINIC</strong> <a onclick="openClinicInfoModal(this)"><i class="fa fa-info-circle" data-toggle="tooltip" data-placement="right" title="more Clinic Info" aria-hidden="true"></i><span class="sr-only">more Clinic Info</span></a><br>#appt_clinic# (#appt_clinic_raintree_code#)<br>#appt_clinic_address#</div><div class="col-md-6"><strong><i class="fa fa-clock-o" aria-hidden="true"></i> APPOINTMENT</strong><br>#formatted_appt_date# @ #appt_time#<br>with #appt_provider#</div></div></div></div><div class="panel panel-script panel-horizontal"><div class="panel-heading"><i class="fa fa-microphone" aria-hidden="true"></i></div><div class="panel-body"><div id="isPasted"><p>&quot;Wonderful! Before we wrap up, I have a few more quick items:</p><ul><li id="isPasted">Arrive 15 minutes early and dress comfortably for your appointment, at <strong>#appt_time#</strong> on<strong>&nbsp;#appt_date#</strong> with <strong>#appt_provider#&nbsp;</strong>in our<strong>&nbsp;#appt_clinic#&nbsp;</strong>clinic located at <strong>#appt_clinic_address#</strong></li><li>Do you know where we are located?</li><li>Our patient coordinator will call you to finalize your registration. We do require that you speak to our in-clinic patient coordinator prior to your appointment, so please be on the lookout for a call from our main number.</li><li>Please be sure to upload your prescription to your patient portal prior to coming in for your appointment.</li><li>Don&#39;t forget to bring your ID. If you have more questions about your insurance, please feel free to call your insurance company directly</li></ul><p>And lastly, you will receive an email containing a link to your patient portal.&quot;</p></div></div></div>
+<!-- begin CLINIC INFO BUNDLE --><div class="clinic-info-modal-bundle"><!-- begin CLINIC INFO POPUP MODAL -->${actions.clinicinfoprod.show_variables.clinic_info_popup} <!-- end CLINIC INFO POPUP MODAL --> <!--begin CALL INFO HEADER --><div class="call-info-header panel panel-reference panel-horizontal"><div class="panel-heading"><i class="fa fa-phone-square" aria-hidden="true"></i></div><div class="panel-body"><div class="col-md-6"><strong><i class="fa fa-building-o" aria-hidden="true"></i> CLINIC</strong> <a onclick="openClinicInfoModal(this)"><i class="fa fa-info-circle" data-toggle="tooltip" data-placement="right" title="more Clinic Info" aria-hidden="true"></i><span class="sr-only">more Clinic Info</span></a><br>#name# (#clinic_raintree_code#)</div><div class="col-md-3"><strong><i class="fa fa-user-o" aria-hidden="true"></i> CALLER</strong><br>#caller_first_name# #caller_last_name#<br>#caller_phone_number#</div><div class="col-md-3"><strong><i class="fa fa-user-plus" aria-hidden="true"></i> PATIENT</strong><br>#patient_first_name# #patient_last_name#<br><i class="fa fa-birthday-cake" aria-hidden="true"></i> #patient_dob#</div></div></div><!--end CALL INFO HEADER --></div><!-- end CLINIC INFO BUNDLE --><div class="panel panel-reference panel-horizontal"><div class="panel-heading"><i class="fa fa-calendar" aria-hidden="true"></i></div><div class="panel-body"><div class="clinic-info-modal-bundle"><!-- begin CLINIC INFO POPUP MODAL -->${actions.clinicinfoprod.show_variables.appt_clinic_info_popup} <!-- end CLINIC INFO POPUP MODAL --><div class="col-md-6"><strong><i class="fa fa-building-o" aria-hidden="true"></i> APPOINTMENT CLINIC</strong> <a onclick="openClinicInfoModal(this)"><i class="fa fa-info-circle" data-toggle="tooltip" data-placement="right" title="more Clinic Info" aria-hidden="true"></i><span class="sr-only">more Clinic Info</span></a><br>#appt_clinic# (#appt_clinic_raintree_code#)<br>#appt_clinic_address#</div><div class="col-md-6"><strong><i class="fa fa-clock-o" aria-hidden="true"></i> APPOINTMENT</strong><br>#formatted_appt_date# @ #appt_time#<br>with #appt_provider#</div></div></div></div><div class="panel panel-script panel-horizontal"><div class="panel-heading"><i class="fa fa-microphone" aria-hidden="true"></i></div><div class="panel-body"><div id="isPasted"><p>&quot;Wonderful! Before we wrap up, I have a few more quick items:</p><ul><li id="isPasted">Arrive 15 minutes early and dress comfortably for your appointment, at <strong>#appt_time#</strong> on<strong>&nbsp;#appt_date#</strong> with <strong>#appt_provider#&nbsp;</strong>in our<strong>&nbsp;#appt_clinic#&nbsp;</strong>clinic located at <strong>#appt_clinic_address#</strong></li><li>Do you know where we are located?</li><li>Our patient coordinator will call you to finalize your registration. We do require that you speak to our in-clinic patient coordinator prior to your appointment, so please be on the lookout for a call from our main number.</li><li>Please be sure to upload your prescription to your patient portal prior to coming in for your appointment.</li><li>Don&#39;t forget to bring your ID. If you have more questions about your insurance, please feel free to call your insurance company directly</li></ul><p>You will also receive an email with the welcome letter including your patient portal log in details where you can upload your insurance and ID cards. These documents are required and essential for verification, so please do this prior to your appointment.&quot;</p></div></div></div>
```

### node 118 — MVA Confirm Appointment (content)

```diff
--- before/node 118 content
+++ after/node 118 content
@@ -1 +1 @@
-<!-- begin CLINIC INFO BUNDLE --><div class="clinic-info-modal-bundle"><!-- begin CLINIC INFO POPUP MODAL -->${actions.clinicinfoprod.show_variables.clinic_info_popup} <!-- end CLINIC INFO POPUP MODAL --> <!--begin CALL INFO HEADER --><div class="call-info-header panel panel-reference panel-horizontal"><div class="panel-heading"><i class="fa fa-phone-square" aria-hidden="true"></i></div><div class="panel-body"><div class="col-md-6"><strong><i class="fa fa-building-o" aria-hidden="true"></i> CLINIC</strong> <a onclick="openClinicInfoModal(this)"><i class="fa fa-info-circle" data-toggle="tooltip" data-placement="right" title="more Clinic Info" aria-hidden="true"></i><span class="sr-only">more Clinic Info</span></a><br>#name# (#clinic_raintree_code#)</div><div class="col-md-3"><strong><i class="fa fa-user-o" aria-hidden="true"></i> CALLER</strong><br>#caller_first_name# #caller_last_name#<br>#caller_phone_number#</div><div class="col-md-3"><strong><i class="fa fa-user-plus" aria-hidden="true"></i> PATIENT</strong><br>#patient_first_name# #patient_last_name#<br><i class="fa fa-birthday-cake" aria-hidden="true"></i> #patient_dob#</div></div></div><!--end CALL INFO HEADER --></div><!-- end CLINIC INFO BUNDLE --><div class="panel panel-reference panel-horizontal"><div class="panel-heading"><i class="fa fa-calendar" aria-hidden="true"></i></div><div class="panel-body"><div class="clinic-info-modal-bundle"><!-- begin CLINIC INFO POPUP MODAL -->${actions.clinicinfoprod.show_variables.appt_clinic_info_popup} <!-- end CLINIC INFO POPUP MODAL --><div class="col-md-6"><strong><i class="fa fa-building-o" aria-hidden="true"></i> APPOINTMENT CLINIC</strong> <a onclick="openClinicInfoModal(this)"><i class="fa fa-info-circle" data-toggle="tooltip" data-placement="right" title="more Clinic Info" aria-hidden="true"></i><span class="sr-only">more Clinic Info</span></a><br>#appt_clinic# (#appt_clinic_raintree_code#)<br>#appt_clinic_address#</div><div class="col-md-6"><strong><i class="fa fa-clock-o" aria-hidden="true"></i> APPOINTMENT</strong><br>#formatted_appt_date# @ #appt_time#<br>with #appt_provider#</div></div></div></div><div class="panel panel-script panel-horizontal"><div class="panel-heading"><i class="fa fa-microphone" aria-hidden="true"></i></div><div class="panel-body"><div id="isPasted"><p>&quot;Wonderful! Before we wrap up, I have a few more quick items:</p><ul><li id="isPasted">Arrive 15 minutes early and dress comfortably for your appointment, at <strong>#appt_time#</strong> on<strong>&nbsp;#appt_date#</strong> with <strong>#appt_provider#&nbsp;</strong>in our<strong>&nbsp;#appt_clinic#&nbsp;</strong>clinic located at <strong>#appt_clinic_address#</strong></li><li>Do you know where we are located?</li><li>Our patient coordinator will call you to finalize your registration. We do require that you speak to our in-clinic patient coordinator prior to your appointment, so please be on the lookout for a call from our main number.</li><li>Don&#39;t forget to bring your ID and insurance card. If you have more questions about your insurance, please feel free to call your insurance company directly</li></ul><p>And lastly, you will receive an email containing a link to your patient portal.&quot;</p></div></div></div>
+<!-- begin CLINIC INFO BUNDLE --><div class="clinic-info-modal-bundle"><!-- begin CLINIC INFO POPUP MODAL -->${actions.clinicinfoprod.show_variables.clinic_info_popup} <!-- end CLINIC INFO POPUP MODAL --> <!--begin CALL INFO HEADER --><div class="call-info-header panel panel-reference panel-horizontal"><div class="panel-heading"><i class="fa fa-phone-square" aria-hidden="true"></i></div><div class="panel-body"><div class="col-md-6"><strong><i class="fa fa-building-o" aria-hidden="true"></i> CLINIC</strong> <a onclick="openClinicInfoModal(this)"><i class="fa fa-info-circle" data-toggle="tooltip" data-placement="right" title="more Clinic Info" aria-hidden="true"></i><span class="sr-only">more Clinic Info</span></a><br>#name# (#clinic_raintree_code#)</div><div class="col-md-3"><strong><i class="fa fa-user-o" aria-hidden="true"></i> CALLER</strong><br>#caller_first_name# #caller_last_name#<br>#caller_phone_number#</div><div class="col-md-3"><strong><i class="fa fa-user-plus" aria-hidden="true"></i> PATIENT</strong><br>#patient_first_name# #patient_last_name#<br><i class="fa fa-birthday-cake" aria-hidden="true"></i> #patient_dob#</div></div></div><!--end CALL INFO HEADER --></div><!-- end CLINIC INFO BUNDLE --><div class="panel panel-reference panel-horizontal"><div class="panel-heading"><i class="fa fa-calendar" aria-hidden="true"></i></div><div class="panel-body"><div class="clinic-info-modal-bundle"><!-- begin CLINIC INFO POPUP MODAL -->${actions.clinicinfoprod.show_variables.appt_clinic_info_popup} <!-- end CLINIC INFO POPUP MODAL --><div class="col-md-6"><strong><i class="fa fa-building-o" aria-hidden="true"></i> APPOINTMENT CLINIC</strong> <a onclick="openClinicInfoModal(this)"><i class="fa fa-info-circle" data-toggle="tooltip" data-placement="right" title="more Clinic Info" aria-hidden="true"></i><span class="sr-only">more Clinic Info</span></a><br>#appt_clinic# (#appt_clinic_raintree_code#)<br>#appt_clinic_address#</div><div class="col-md-6"><strong><i class="fa fa-clock-o" aria-hidden="true"></i> APPOINTMENT</strong><br>#formatted_appt_date# @ #appt_time#<br>with #appt_provider#</div></div></div></div><div class="panel panel-script panel-horizontal"><div class="panel-heading"><i class="fa fa-microphone" aria-hidden="true"></i></div><div class="panel-body"><div id="isPasted"><p>&quot;Wonderful! Before we wrap up, I have a few more quick items:</p><ul><li id="isPasted">Arrive 15 minutes early and dress comfortably for your appointment, at <strong>#appt_time#</strong> on<strong>&nbsp;#appt_date#</strong> with <strong>#appt_provider#&nbsp;</strong>in our<strong>&nbsp;#appt_clinic#&nbsp;</strong>clinic located at <strong>#appt_clinic_address#</strong></li><li>Do you know where we are located?</li><li>Our patient coordinator will call you to finalize your registration. We do require that you speak to our in-clinic patient coordinator prior to your appointment, so please be on the lookout for a call from our main number.</li><li>Don&#39;t forget to bring your ID and insurance card. If you have more questions about your insurance, please feel free to call your insurance company directly</li></ul><p>You will also receive an email with the welcome letter including your patient portal log in details where you can upload your insurance and ID cards. These documents are required and essential for verification, so please do this prior to your appointment.&quot;</p></div></div></div>
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
+				<br>with #appt_provider#</div></div></div></div> --><div class="panel panel-script panel-horizontal"><div class="panel-heading"><i class="fa fa-microphone" aria-hidden="true"></i></div><div class="panel-body"><p>&quot;Thank you for providing that information. I have checked your coverage, and your Medicaid plan is not accepted at this or our nearby locations. We recommend contacting your insurance company for a list of in-network providers.&quot;</p></div></div>
```

### node 188 — Build Insurance Catalogue (static list with status) (script code)

```diff
--- before/node 188 content
+++ after/node 188 content
@@ -2,46 +2,52 @@
 // region comes from the SharePoint clinic info (tree 787613344).
 let region = ZT.getVariableValue("region", "");
 
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
+//          not_accepted_medicaid -> Medicaid not accepted, no private pay, end call
+//          not_accepted_other    -> not accepted, offer self-pay rates, schedule or end call
+//          managed               -> not taking new patients on this plan, call back next month
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
 
 // --- staged rollout: only these regions get the dropdown screen --------------
-const INSURANCE_DROPDOWN_REGIONS = ["brooklyn", "north charlotte", "south charlotte"];
-let is_display_insurance_dropdown = INSURANCE_DROPDOWN_REGIONS.includes(String(region).trim().toLowerCase());
+let insurance_dropdown_regions = ["brooklyn", "north charlotte", "south charlotte"];
+let is_display_insurance_dropdown = insurance_dropdown_regions.includes(region.trim().toLowerCase());
 
 // --- outputs ----------------------------------------------------------------
+ZT.setFormData("insurance_catalog", JSON.stringify(insurance_catalog));
 ZT.setTransformData("insurance_list", insurance_list);
 ZT.setTransformData("insurance_selection_list", insurance_selection_list);
 ZT.setFormData("is_display_insurance_dropdown", is_display_insurance_dropdown ? "true" : "false");
```

### node 199 — Using Insurance? / Select Insurance (Brooklyn / Charlotte) (content)

```diff
--- before/node 199 content
+++ after/node 199 content
@@ -8,4 +8,4 @@
 				<br>#appt_clinic_address#</div>
 			<div class="col-md-6"><strong><i class="fa fa-clock-o" aria-hidden="true"></i> APPOINTMENT</strong>
 				<br>#formatted_appt_date# @ #appt_time#
-				<br>with #appt_provider#</div></div></div></div> --><div class="panel panel-script panel-horizontal"><div class="panel-heading"><i class="fa fa-microphone"></i></div><div class="panel-body"><p>&quot;What type of benefits will you be using? Please let me know whether your insurance is Medicare or Medicaid.&quot;</p></div></div><div class="panel panel-insurance panel-horizontal"><div class="panel-heading"><i class="fa fa-warning"></i></div><div class="panel-body"><p>The following insurances are not accepted at the selected clinic: &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;&nbsp;&nbsp;<!--	<br>#appt_not_accepted_insurances#</p> --><br>${actions.clinicinfoprod.show_variables.not_accepted_insurances}</p></div></div>
+				<br>with #appt_provider#</div></div></div></div> --><div class="panel panel-script panel-horizontal"><div class="panel-heading"><i class="fa fa-microphone"></i></div><div class="panel-body"><p>&quot;Will you be using insurance?&quot;</p></div></div><div class="panel panel-insurance panel-horizontal"><div class="panel-heading"><i class="fa fa-warning"></i></div><div class="panel-body"><p>The following insurances are not accepted at the selected clinic: &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;&nbsp;&nbsp;<!--	<br>#appt_not_accepted_insurances#</p> --><br>${actions.clinicinfoprod.show_variables.not_accepted_insurances}</p></div></div>
```

### node 200 — Route Insurance Selection (script code)

```diff
--- before/node 200 content
+++ after/node 200 content
@@ -1,12 +1,22 @@
 // --- inputs -----------------------------------------------------------------
-// The agent's pick on node 199: an insurance code, or one of the three route values.
+// The agent's pick on node 199, and the catalogue node 188 built it from.
+let is_using_insurance = ZT.getVariableValue("is_using_insurance", "");
 let insurance_selection = ZT.getVariableValue("insurance_selection", "");
+let insurance_catalog = JSON.parse(ZT.getVariableValue("insurance_catalog", "[]"));
 
 // --- route ------------------------------------------------------------------
-const ROUTES = ["not_accepted", "medicaid_not_accepted", "private_pay"];
-let insurance_route = ROUTES.includes(insurance_selection) ? insurance_selection : "accepted";
+// No insurance means self-pay. Otherwise the selected entry's status is the route.
+let insurance_route = "self_pay";
+let patient_insurance_rt_code = "";
+if (is_using_insurance === "Yes") {
+  let selected_insurance = insurance_catalog.find(entry => entry.value === insurance_selection);
+  insurance_route = selected_insurance.status;
+  if (insurance_route === "accepted") {
+    patient_insurance_rt_code = selected_insurance.value;
+  }
+}
 
 // --- outputs ----------------------------------------------------------------
 // Only an accepted insurance becomes the Raintree code; Incoming Call node 162 POSTs it.
-ZT.setFormData("patient_insurance_rt_code", insurance_route === "accepted" ? insurance_selection : "");
+ZT.setFormData("patient_insurance_rt_code", patient_insurance_rt_code);
 ZT.setFormData("insurance_route", insurance_route);
```

## CHANGES THAT NEED AN EXPLANATION

Every line below must map to a requirement or an explicit request.
Anything unexplained is unintended drift — revert it before delivering.

  [ ] added node 3 (Insurance Not Accepted - Self-Pay Rates (Brooklyn / Charlotte))
  [ ] added node 6 (Insurance Managed - Not Accepting New Patients (Brooklyn / Charlotte))
  [ ] node 2 — content changed (86 → 100 lines) — claude.md
  [ ] node 53 — content changed (3537 → 3713 characters) — Confirm Appointment
  [ ] node 100 — content changed (3355 → 3531 characters) — WC Confirm Appointment
  [ ] node 118 — content changed (3259 → 3435 characters) — MVA Confirm Appointment
  [ ] node 149 — form field settings changed (same field names)
  [ ] node 167 — content changed (11 → 11 lines) — Medicaid
  [ ] node 184 — button added/changed: "Neither" → node 198
  [ ] node 184 — button removed/replaced: "Insurance" → node 198
  [ ] node 184 — button removed/replaced: "Private Pay" → node 150
  [ ] node 188 — page_title: "Build Insurance Options (static list)" → "Build Insurance Catalogue (static list with status)"
  [ ] node 188 — script code changed (47 → 53 lines) — Build Insurance Catalogue (static list with status)
  [ ] node 199 — page_title: "Select Insurance (Brooklyn / Charlotte)" → "Using Insurance? / Select Insurance (Brooklyn / Charlotte)"
  [ ] node 199 — content changed (11 → 11 lines) — Using Insurance? / Select Insurance (Brooklyn / Charlotte)
  [ ] node 199 — form field added: is_using_insurance (radio)
  [ ] node 200 — script code changed (12 → 22 lines) — Route Insurance Selection
  [ ] node 201 — button added/changed: "insurance_route == 'self_pay'" → node 150 [logic: insurance_route == 'self_pay']
  [ ] node 201 — button added/changed: "insurance_route == 'not_accepted_medicaid'" → node 167 [logic: insurance_route == 'not_accepted_medicaid']
  [ ] node 201 — button added/changed: "insurance_route == 'not_accepted_other'" → node 3 [logic: insurance_route == 'not_accepted_other']
  [ ] node 201 — button added/changed: "insurance_route == 'managed'" → node 6 [logic: insurance_route == 'managed']
  [ ] node 201 — button added/changed: "" → node 1
  [ ] node 201 — button removed/replaced: "insurance_route == 'not_accepted'" → node 150
  [ ] node 201 — button removed/replaced: "insurance_route == 'medicaid_not_accepted'" → node 167
  [ ] node 201 — button removed/replaced: "insurance_route == 'private_pay'" → node 150
  [ ] node 201 — button removed/replaced: "" → node 1

