========================================================================
WORKFLOW DIFF — Email Automation - AI Actions INT
========================================================================

Before : before.json  (53 nodes)
After  : after.json  (57 nodes)

## PLAIN SUMMARY

48 of 57 nodes are byte-for-byte identical to the original (84% untouched).
4 nodes added, 0 removed, 0 renumbered, 5 modified.

In plain terms:
  + NEW      node 22 — Reply details needed? [Scoring]
  + NEW      node 23 — Add the details the reply needs [Content]
  + NEW      node 56 — Which reply gets the details? [Scoring]
  + NEW      node 57 — Write authorised contacts into GDPR reply [Script]
  * CHANGED  node 17 — Build case review dashboard [Script]
               - script code changed (312 → 315 lines) — Build case review dashboard
  * CHANGED  node 24 — Set case origin and template key [Script]
               - node_name: "Stamps sf_Origin and resolves the template key the generation ac" → "Stamps sf_Origin, resolves the template key and which reply details screen 23 asks for"
               - script code changed (35 → 47 lines) — Set case origin and template key
               - continuation_node_id: 25 → 22 — Set case origin and template key
  * CHANGED  node 26 — Build case review dashboard [Script]
               - node_name: "Maps intent -> Topic/Sub Topic, sets HtmlBody, has_multiple_inte" → "Writes screen 23's answers into the draft, then builds the dashboard; sets hc_manual_changes_required if a gap survives"
               - script code changed (279 → 294 lines) — Build case review dashboard
  * CHANGED  node 48 — claude.md [Content]
               - content changed (617 → 654 lines) — claude.md
  * CHANGED  node 54 — Case review dashboard - FAST Admin [Content]
               - button added/changed: "Non-authorised user: GDPR response" → node 23
               - button removed/replaced: "Non-authorised user: GDPR response" → node 55

## TREE SHAPE

  node type                before    after    delta
  AI_Action                     4        4       +0
  Content                      19       20       +1
  Data                          4        4       +0
  Email                         1        1       +0
  Scoring                      11       13       +2
  Script                       14       15       +1
  TOTAL                        53       57       +4

  Root node unchanged (node 2).

## STRUCTURAL SANITY

  No broken links introduced.
  No nodes became unreachable.
  Pre-existing in the BEFORE tree (not caused by this edit): 0 broken link(s), 6 unreachable node(s).

## UNTOUCHED NODES (48)

  1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 18, 19, 20, 21, 25, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 49, 50, 51, 52, 53, 55

## TREE-LEVEL SETTINGS CHANGED (0)

  (none)

## COSMETIC / EDITOR-ONLY CHANGES (0) — ignore

  (none)

## LINE-LEVEL BODY DIFFS (4)

### node 17 — Build case review dashboard (script code)

```diff
--- before/node 17 content
+++ after/node 17 content
@@ -224,8 +224,8 @@
 // --- GDPR pushback form (FAST Admin only: the sender is not an authorised contact) ----
 // Corpay UK's approved GDPR pushback copy, "Allstar - GDPR button PH1" (Charley Gunning).
 // The agent decides the sender is not authorised, so the draft is fixed copy rather than
-// an AI reply, and _NAMES_ is left for the agent to replace with the authorised contacts
-// before it goes out. Same Topic / Sub Topic selects and the same editor ids as the
+// an AI reply. _NAMES_ is the token node 57 replaces with the authorised contacts the
+// agent types on screen 23, so screen 55 opens with them already in the reply. Same Topic / Sub Topic selects and the same editor ids as the
 // manual-changes form, so script_code's editor sync and field validation apply unchanged.
 const gdpr_email_body = [
   "<p>Hello,</p>",
@@ -248,7 +248,7 @@
 <div class="zt-form-card">
   <div class="zt-form-header">
     <h2 class="zt-form-title">Non-authorised contact: GDPR response</h2>
-    <p class="zt-form-subtitle">Replace <strong>_NAMES_</strong> with the authorised contacts on the account before you send.</p>
+    <p class="zt-form-subtitle">The authorised contacts you entered are in the reply. Read it through before you send.</p>
   </div>
   <div class="zt-form-header">
     <h2 class="zt-form-title">Original Customer Email</h2>
@@ -310,3 +310,6 @@
 ZT.setTransformData("request_form_html", compact(request_form_html));
 ZT.setTransformData("multiple_subtopics_form_html", compact(multiple_subtopics_form_html));
 ZT.setTransformData("gdpr_request_form_html", compact(gdpr_request_form_html));
+// Screen 23 is reached on this lane only from dashboard 54's GDPR button, so its names
+// field is always the one to show here.
+ZT.setFormData("gdpr_ask_names", "true");
```

### node 24 — Set case origin and template key (script code)

```diff
--- before/node 24 content
+++ after/node 24 content
@@ -18,18 +18,30 @@
 hc_template_key = hc_template_key + ":" + requester_type;
 let hc_copy_approved = requester_type === "driver";
 
-// Some approved templates ship with a placeholder only the agent can fill, so the draft
-// cannot go out untouched. Router 31 sends these to the manual-changes screen instead of
-// the send path.
-const manualEditByVariant = {
-  underpayment_response: "The approved underpayment reply leaves the unit rate as [INSERT UNIT RATE EXCLUDING VAT] - put the driver's rate in before this goes out."
+// Some approved templates carry a gap only the agent can fill. Each row names the native
+// field on screen 23 that asks for it, the driver that shows that field, and the token node
+// 26 replaces with the answer, so the draft arrives on the dashboard already filled in.
+// A new placeholder is one row here plus one conditional field on screen 23.
+const emailInputsByVariant = {
+  underpayment_response: [
+    { field: "hc_unit_rate", driver: "hc_ask_unit_rate", token: "[INSERT UNIT RATE EXCLUDING VAT]" }
+  ]
 };
-let hc_manual_changes_reason = manualEditByVariant[response_variant] || "";
+const allDrivers = ["hc_ask_unit_rate"];
+let hc_email_inputs = emailInputsByVariant[response_variant] || [];
+let askedDrivers = [];
+for (let i = 0; i < hc_email_inputs.length; i++) {
+  askedDrivers.push(hc_email_inputs[i].driver);
+}
 
 // --- outputs ----------------------------------------------------------------
 // Salesforce Case Origin stamped on every AI-handled case.
 ZT.setFormData("sf_Origin", "Zingtree AI");
 ZT.setFormData("hc_template_key", hc_template_key);
 ZT.setFormData("hc_copy_approved", hc_copy_approved);
-ZT.setFormData("hc_manual_changes_required", hc_manual_changes_reason !== "");
-ZT.setFormData("hc_manual_changes_reason", hc_manual_changes_reason);
+// Screen 23's conditional fields test these drivers as the strings "true" / "false".
+for (let i = 0; i < allDrivers.length; i++) {
+  ZT.setFormData(allDrivers[i], askedDrivers.indexOf(allDrivers[i]) !== -1 ? "true" : "false");
+}
+ZT.setFormData("hc_email_inputs", JSON.stringify(hc_email_inputs));
+ZT.setFormData("hc_email_inputs_required", hc_email_inputs.length > 0);
```

### node 26 — Build case review dashboard (script code)

```diff
--- before/node 26 content
+++ after/node 26 content
@@ -9,7 +9,7 @@
 let requester_type = ZT.getVariableValue("hc_requester_type", "driver");
 let response_variant = ZT.getVariableValue("hc_response_variant", "");
 let copy_approved = ZT.getVariableValue("hc_copy_approved", true);
-let manual_changes_reason = ZT.getVariableValue("hc_manual_changes_reason", "");
+let email_inputs = JSON.parse(ZT.getVariableValue("hc_email_inputs", "[]"));
 
 // --- shared helpers -----------------------------------------------------------
 const escapeHtml = value => String(value == null ? "" : value)
@@ -24,6 +24,20 @@
   return escapeHtml(value);
 };
 const normalizeIntentKey = value => String(value || "").trim().toLowerCase().replace(/\s+/g, "_");
+
+// --- the details the agent gave on screen 23, written into the draft ------------------
+// Each token is matched case-insensitively with flexible spacing, in case the generation
+// AI Action reflows it. A gap still open afterwards (the AI reworded the token, or a new
+// template gained one nobody mapped) sends the case to screen 33 through router 31.
+for (let i = 0; i < email_inputs.length; i++) {
+  let pattern = email_inputs[i].token.replace(/[.*+?^${}()|[\]\\]/g, "\\$&").replace(/\s+/g, "\\s+");
+  let answer = escapeHtml(String(ZT.getVariableValue(email_inputs[i].field, "")).trim());
+  email_response = email_response.replace(new RegExp(pattern, "gi"), function () { return answer; });
+}
+let unfilledGap = email_response.match(/\[\s*INSERT[^\]]*\]/i);
+let manual_changes_reason = unfilledGap
+  ? "The reply still contains " + unfilledGap[0] + " - fill it in before this goes out."
+  : "";
 
 // intent key -> Salesforce Topic / Sub Topic (also the dashboard label). The map is declared
 // once, in node 19; this is that same map read back. Homecharge has its own Topic namespace:
@@ -113,8 +127,8 @@
     <p>The approved Homecharge templates are written for drivers. This reply was re-framed for a fleet manager, so read it in full before sending.</p>
   </div>`;
 
-// Some approved templates carry a placeholder only the agent can fill, so router 31 sends
-// the case to the manual-changes screen. Say so here - the dashboard still shows a Send button.
+// A placeholder that survived screen 23's answers: router 31 sends the case to the
+// manual-changes screen. Say so here - the dashboard still shows a Send button.
 const renderManualEditNotice = () => manual_changes_reason === "" ? `` : `
   <div class="case-review-card" style="background:#fef2f2;border-color:#fecaca;">
     <h3 class="case-review-card-title">This reply has to be edited before it is sent</h3>
@@ -261,6 +275,7 @@
 ZT.setFormData("sf_Topic__c", salesforce.topic);
 ZT.setFormData("sf_Sub_Topic__c", salesforce.subtopic);
 ZT.setFormData("has_multiple_intents", has_multiple_intents);
+ZT.setFormData("hc_manual_changes_required", manual_changes_reason !== "");
 // Form-data merge fields render newlines as <br>, so the HTML is written on one line.
 const compact = html => html.replace(/\s*\n\s*/g, " ");
 ZT.setTransformData("case_review_html", compact(case_review_html));
```

### node 48 — claude.md (content)

```diff
--- before/node 48 content
+++ after/node 48 content
@@ -26,7 +26,7 @@
 Payment Query and Resent Onboarding Email are OUT of INT and come back through the release
 management cadence, one release at a time.
 
-## Architecture (50 nodes + this one)
+## Architecture (54 nodes + this one)
 
 Shared front end - runs once, whichever journey follows
 1  Content  Start (root)                -> 2 live / 44 Test Mode
@@ -49,11 +49,13 @@
 14 Scoring  Email analysis route         escalation -> 27; in_scope -> 15; else 29
 15 Script   Set case origin              sf_Origin -> 16
 16 AI       Generate email response      automate_email_generation_int (94) -> 17
-17 Script   Build case review dashboard  also stages gdpr_request_form_html -> 54
+17 Script   Build case review dashboard  also stages gdpr_request_form_html (_NAMES_ token) and
+                                         gdpr_ask_names = "true" -> 54
 54 Content  Dashboard - FAST Admin       clone of 30 + third button "Non-authorised user: GDPR
-                                         response" (button_data "Sent GDPR response") -> 55
+                                         response" (button_data "Sent GDPR response") -> 23
+57 Script   Write contacts into GDPR     replaces _NAMES_ in gdpr_request_form_html -> 55
 55 Content  GDPR response                ${transforms.gdpr_request_form_html}: Topic/Sub Topic +
-                                         editable approved GDPR copy with _NAMES_ -> 49
+                                         editable GDPR copy, names already in -> 49
 
 Homecharge lane
 18 AI       Detect Homecharge intent     automate_hc_email_intent_int (98) -> 19
@@ -65,9 +67,18 @@
 21 Content  Choose the approved reply    case summary + email, one native select
                                          hc_response_variant -> 24 (Tariff only)
 24 Script   Set origin + template key    sf_Origin, hc_template_key, hc_copy_approved,
-                                         hc_manual_changes_required -> 25
+                                         hc_email_inputs, hc_email_inputs_required, hc_ask_* -> 22
+22 Scoring  Reply details needed?        hc_email_inputs_required == true -> 23; else 25
 25 AI       Generate email response      automate_hc_email_generation_int (99) -> 26
-26 Script   Build case review dashboard  hc_show_screenshots_stop -> 52
+26 Script   Build case review dashboard  writes screen 23's answers into the draft,
+                                         hc_manual_changes_required (a gap survived),
+                                         hc_show_screenshots_stop -> 52
+
+Reply details - shared by both lanes, before the reply the agent reviews
+23 Content  Add the details the reply    one native conditional field per agent-filled gap:
+            needs                        hc_unit_rate (hc_ask_unit_rate), gdpr_authorised_names
+                                         (gdpr_ask_names) -> 56
+56 Scoring  Which reply gets the details? homecharge -> 25; fast_admin -> 57; else 57
 
 Shared escalation / out of scope
 27 Script   Build escalation notice      escalation_html, all seven reasons -> 28
@@ -172,8 +183,16 @@
   of the detected intents, which is the only dashboard that carries the third button.
 - sf_Origin ("Zingtree AI"), hc_template_key, hc_copy_approved - nodes 15 / 24. sf_Origin is a
   predefined variable, so the marketplace app writes it to Case Origin.
-- hc_manual_changes_required (bool), hc_manual_changes_reason - node 24. The boolean is router
-  31's first test; the reason is printed on the dashboard by node 26.
+- hc_email_inputs (JSON string [{field, driver, token}]), hc_email_inputs_required (bool),
+  hc_ask_unit_rate ("true"/"false") - node 24, from emailInputsByVariant: the agent-filled gaps
+  of the chosen approved reply. Router 22 opens screen 23 on hc_email_inputs_required; the
+  driver shows its field there; node 26 replaces each token with the field's answer.
+- hc_unit_rate - native text on screen 23 (underpayment_response), written into the draft by 26.
+- gdpr_ask_names ("true") - node 17, FAST lane only; shows gdpr_authorised_names on screen 23.
+- gdpr_authorised_names - native text on screen 23, written over _NAMES_ by node 57.
+- hc_manual_changes_required (bool) - node 26: true only when a [INSERT ...] gap is still in the
+  draft after screen 23's answers are written in (the AI reworded a token, or a template gained
+  a gap no row maps). Router 31's first test; node 26 prints why on the dashboard.
 - sf_Energy_Provider__c, sf_Data_Provider__c - native selects on screen 51 (Homecharge lane
   only). Predefined variables: the Zingtree Salesforce marketplace app loads the Case's current
   values into them (so the selects open pre-selected) and writes the agent's choice back to
@@ -221,8 +240,9 @@
 One intent carries response variants, pre-selected by the intent AI Action and confirmed by the
 agent on screen 21:
   hc_tariff_update  standard_driver_pushback, octopus_pairing_pushback, driver_struggling_response
-  hc_payment_query  dd_increase_pushback, underpayment_response (underpayment forces screen 33:
-                    its template leaves [INSERT UNIT RATE EXCLUDING VAT] for the agent - node 24)
+  hc_payment_query  dd_increase_pushback, underpayment_response (underpayment asks for the unit
+                    rate on screen 23 before the draft; node 26 writes it over
+                    [INSERT UNIT RATE EXCLUDING VAT])
 Retired from INT with the Phase 1 cut, in the map's own words - each comes back as one row here,
 one row in requiredChecksByIntent, its Test Mode scenario and its line in AI Action 98's prompt:
   hc_update_charger_details  HC-Online     / Update Charger Information
@@ -391,11 +411,21 @@
   early is safe and costs no setter node. Corpay has no compliance sign-off for AI reading
   attachments (Charley Gunning), so the AI cannot decide this itself; revisit when it does.
 - Screen 21 is skipped unless the case has an approved-reply choice.
-- A response variant whose approved template carries a placeholder sets hc_manual_changes_required
-  in node 24, and router 31 tests it FIRST - ahead of the multi-intent branch - so the send path
-  cannot be reached without an edit. Today that is underpayment_response, whose template leaves
-  [INSERT UNIT RATE EXCLUDING VAT] for the driver's kWh rate. Nothing is lost by skipping screen
-  32: screen 33 carries the Topic and Sub Topic selects too.
+- AGENT-FILLED GAPS ARE ASKED FOR BEFORE THE REPLY, NOT EDITED AFTER IT. Any approved reply
+  with a gap only the agent can fill gets it asked on screen 23 - one native conditional field
+  per gap, shown by its own driver - and the answer is written into the email before the agent
+  sees it. Homecharge: node 24's emailInputsByVariant row (field, driver, token), node 26 does
+  the replace after AI Action 25. GDPR: node 17 keeps _NAMES_ as a token, node 57 does the
+  replace. A new gap is one row (or one token) plus one field on screen 23.
+- The tokens are replaced in the tree, not by the AI Action: the rate is a value the reply must
+  carry exactly, so it never goes through the model. The generation Action still returns the
+  token verbatim; node 26 matches it case-insensitively with flexible spacing.
+- Safety net: if a [INSERT ...] gap is still in the draft after the replace, node 26 sets
+  hc_manual_changes_required and router 31 tests it FIRST - ahead of the multi-intent branch -
+  so the send path cannot be reached without an edit on screen 33 (which carries the Topic and
+  Sub Topic selects too). Normal underpayment runs no longer reach screen 33.
+- Screen 23's drivers are strings "true"/"false" (the conditional compares text); each lane
+  sets only its own, and the other lane's field stays hidden because its driver is unset.
 - BOTH PROVIDER FIELDS ARE RESTRICTED PICKLISTS. Salesforce rejects a value that does not match
   its own list character for character, so node 50 carries the 27 energy and 25 data values
   verbatim - including the two that read as typos, "SSE Airticity" and "Uknown / Unspecified".
@@ -415,6 +445,13 @@
   points at. Importing it as a new tree means updating the layout.
 
 ## Changelog
+- 2026-09-24 Claude (Brent: collect manual inputs before the draft) - new screen 23 "Add the
+  details the reply needs" with native conditional fields hc_unit_rate / gdpr_authorised_names;
+  router 22 (24 -> 22 -> 23|25) and router 56 (23 -> 25 Homecharge | 57 FAST); script 57 writes
+  the names over _NAMES_. Node 24's manualEditByVariant became emailInputsByVariant; node 26
+  writes the answers into the draft and only sets hc_manual_changes_required if a gap survives;
+  node 17's GDPR subtitle no longer asks the agent to replace _NAMES_; dashboard 54's GDPR button
+  -> 23. hc_manual_changes_reason is now local to node 26. Nodes 17, 22, 23, 24, 26, 54, 56, 57, 48.
 - 2026-09-24 Claude - PROMOTE sandbox 605565 -> UK org 123. org_id 605565->123; COs 1263->10, 1264->20, 1265->23 (http->salesforce), 1266->187; AI Actions node 12 93->16, node 16 94->15, node 18 98->19, node 25 99->18; root_node_id 1->2.
 - 2026-09-24 Claude - screen 33 now carries score_var ai_suggested_email with button_data "Made manual changes". Before, an underpayment reply that router 31 forced onto screen 33 kept the "Sent AI suggested email" value from the dashboard Yes button, so reporting counted an agent-edited email as unedited.
 - 2026-09-24 Claude - "Original Customer Email" on screens 33 (both lanes) and 55 rendered Case.Description escaped inside a <p>, so its HTML showed as literal <br> tags. Nodes 17 and 26 now render it as HTML in a div, the same way the dashboards (30/53/54) and screen 21 already do.
```

## CHANGES THAT NEED AN EXPLANATION

Every line below must map to a requirement or an explicit request.
Anything unexplained is unintended drift — revert it before delivering.

  [ ] added node 22 (Reply details needed?)
  [ ] added node 23 (Add the details the reply needs)
  [ ] added node 56 (Which reply gets the details?)
  [ ] added node 57 (Write authorised contacts into GDPR reply)
  [ ] node 17 — script code changed (312 → 315 lines) — Build case review dashboard
  [ ] node 24 — node_name: "Stamps sf_Origin and resolves the template key the generation ac" → "Stamps sf_Origin, resolves the template key and which reply details screen 23 asks for"
  [ ] node 24 — script code changed (35 → 47 lines) — Set case origin and template key
  [ ] node 24 — continuation_node_id: 25 → 22 — Set case origin and template key
  [ ] node 26 — node_name: "Maps intent -> Topic/Sub Topic, sets HtmlBody, has_multiple_inte" → "Writes screen 23's answers into the draft, then builds the dashboard; sets hc_manual_changes_required if a gap survives"
  [ ] node 26 — script code changed (279 → 294 lines) — Build case review dashboard
  [ ] node 48 — content changed (617 → 654 lines) — claude.md
  [ ] node 54 — button added/changed: "Non-authorised user: GDPR response" → node 23
  [ ] node 54 — button removed/replaced: "Non-authorised user: GDPR response" → node 55

