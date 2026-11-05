========================================================================
WORKFLOW DIFF — Fast Admin - INT
========================================================================

Before : Fast Admin - INT (BEFORE baseline 2026-09-17).json  (51 nodes)
After  : Fast Admin - INT (UAT standup changes 2026-09-17).json  (53 nodes)

## PLAIN SUMMARY

43 of 53 nodes are byte-for-byte identical to the original (81% untouched).
2 nodes added, 0 removed, 0 renumbered, 8 modified.

In plain terms:
  + NEW      node 52 — Screenshots option needed? [Scoring]
  + NEW      node 53 — Case review dashboard - missing charges [Content]
  * CHANGED  node 19 — Grade intent and build validation screen [Script]
               - node_name: "Reads the intent AI Action; sets email_intent, route, ai_excepti" → "Reads the intent AI Action; stages the case summary block, the Phase 1 intent map, the checks this case needs and the screen 21 drivers"
               - script code changed (211 → 235 lines) — Grade intent and build validation screen
  * CHANGED  node 20 — Email analysis route [Scoring]
               - node_name: "escalation -> notice, in_scope -> validation, anything else -> n" → "escalation -> notice, in_scope -> validation screen, in_scope_no_questions -> straight to the draft, else out of scope"
               - button added/changed: "email_analysis_route == "in_scope_no_questions"" → node 24 [logic: email_analysis_route == "in_scope_no_questions"]
               - button added/changed: "email_analysis_route == "in_scope"" → node 21 [logic: email_analysis_route == "in_scope"]
               - button added/changed: "" → node 29
               - button removed/replaced: "email_analysis_route == "in_scope"" → node 21
               - button removed/replaced: "" → node 29
  * CHANGED  node 21 — Requester type and validation [Content]
               - node_name: "Agent confirms who sent the email, the approved reply and the Ed" → "Shows the case and the customer's email, then asks only what this intent still needs before the reply is drafted"
               - content changed (134 → 80 characters) — Requester type and validation
               - form field removed: hc_sender_validated (select)
               - form field removed: hc_pairing_checked (select)
               - form field removed: hc_screenshots_attached (select)
  * CHANGED  node 22 — Evaluate validation [Script]
               - node_name: "Turns the screen 9 answers into one boolean for the router" → "Turns screen 21's answers into one boolean for the router"
               - script code changed (36 → 25 lines) — Evaluate validation
  * CHANGED  node 26 — Build case review dashboard [Script]
               - script code changed (243 → 254 lines) — Build case review dashboard
               - continuation_node_id: 30 → 52 — Build case review dashboard
  * CHANGED  node 44 — Test mode - pick a scenario [Content]
               - form field settings changed (same field names)
  * CHANGED  node 45 — Load example email [Script]
               - script code changed (150 → 130 lines) — Load example email
  * CHANGED  node 48 — claude.md [Content]
               - content changed (479 → 527 lines) — claude.md

## TREE SHAPE

  node type                before    after    delta
  AI_Action                     4        4       +0
  Content                      16       17       +1
  Data                          4        4       +0
  Email                         1        1       +0
  Scoring                      11       12       +1
  Script                       15       15       +0
  TOTAL                        51       53       +2

  Root node unchanged (node 1).

## STRUCTURAL SANITY

  No broken links introduced.
  No nodes became unreachable.
  Pre-existing in the BEFORE tree (not caused by this edit): 0 broken link(s), 1 unreachable node(s).

## UNTOUCHED NODES (43)

  1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 23, 24, 25, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 46, 47, 49, 50, 51

## TREE-LEVEL SETTINGS CHANGED (0)

  (none)

## COSMETIC / EDITOR-ONLY CHANGES (0) — ignore

  (none)

## LINE-LEVEL BODY DIFFS (6)

### node 19 — Grade intent and build validation screen (script code)

```diff
--- before/node 19 content
+++ after/node 19 content
@@ -8,20 +8,16 @@
 
 // --- reference data: declared here only, carried forward as form data -------------
 // The one Homecharge intent map. Sub Topic doubles as the label every screen prints, so
-// adding a Phase 1 use case means adding one row here and nothing anywhere else.
+// adding a Phase 1 use case means adding one row here and nothing anywhere else. An intent
+// the Action returns that is NOT a row here is out of scope, so the map is also the gate.
 const salesforceByIntent = {
-  hc_missing_charges:         { topic: "HC-Not Online", subtopic: "Missing Charges" },
-  hc_tariff_update:           { topic: "HC-Online",     subtopic: "Update Energy/Tariff Information" },
-  hc_update_charger_details:  { topic: "HC-Online",     subtopic: "Update Charger Information" },
-  hc_password_reset:          { topic: "HC-Not Online", subtopic: "Password Reset" },
-  hc_compatible_chargers:     { topic: "HC-Not Online", subtopic: "Compatible Chargers" },
-  hc_payment_query:           { topic: "HC-Not Online", subtopic: "Payment Query" },
-  hc_resent_onboarding_email: { topic: "HC-Online",     subtopic: "Resent Onboarding Email" }
+  hc_missing_charges: { topic: "HC-Not Online", subtopic: "Missing Charges" },
+  hc_tariff_update:   { topic: "HC-Online",     subtopic: "Update Energy/Tariff Information" },
+  hc_password_reset:  { topic: "HC-Not Online", subtopic: "Password Reset" }
 };
 
 // An intent with a variant group asks the agent which approved reply fits; an intent
-// without one has a single template and no select. Payment Query is one intent with two
-// replies, not two intents.
+// without one has a single template and no select.
 const variantGroups = [
   {
     intent: "hc_tariff_update",
@@ -31,42 +27,22 @@
       { value: "octopus_pairing_pushback", label: "Octopus pairing pushback" },
       { value: "driver_struggling_response", label: "Driver struggling response" }
     ]
-  },
-  {
-    intent: "hc_payment_query",
-    fallback: "dd_increase_pushback",
-    options: [
-      { value: "dd_increase_pushback", label: "Driver's electricity direct debit has increased" },
-      { value: "underpayment_response", label: "Driver claiming underpayment" }
-    ]
   }
 ];
 
-// Step 3 of the use case documents: confirm the sender in Edison, or as a recognised fleet
-// manager in Salesforce, before any account-level action, and unlock the account where the
-// request needs it. Compatible Chargers and Resent Onboarding Email take no account-level
-// action - their documents carry no step 3 - so they ask for nothing.
+// Step 3 of the use case documents, minus the sender check: confirming an authorised
+// contact is BAU for every agent on every queue, done before the email is even read, so
+// the workflow does not ask again. What is left is the unlock Password Reset needs.
 const requiredChecksByIntent = {
-  hc_missing_charges: ["hc_sender_validated", "hc_pairing_checked"],
-  hc_tariff_update: ["hc_sender_validated"],
-  hc_update_charger_details: ["hc_sender_validated"],
-  hc_password_reset: ["hc_sender_validated", "hc_account_unlocked"],
-  hc_payment_query: ["hc_sender_validated", "hc_account_unlocked"],
-  hc_compatible_chargers: [],
-  hc_resent_onboarding_email: []
-};
-// Answered Yes, these END AI handling rather than clear it.
-const blockingCheckByIntent = {
-  hc_missing_charges: { name: "hc_screenshots_attached", reason: "Screenshots already provided" }
+  hc_missing_charges: [],
+  hc_tariff_update: [],
+  hc_password_reset: ["hc_account_unlocked"]
 };
 
 // Screen 21 asks every check as a native Yes/No field, shown by its own driver variable.
 // The question text lives on the field; this list only says which drivers to switch on.
 const checks = [
-  { name: "hc_sender_validated", driver: "hc_ask_sender_validated" },
-  { name: "hc_pairing_checked", driver: "hc_ask_pairing_checked" },
-  { name: "hc_account_unlocked", driver: "hc_ask_account_unlocked" },
-  { name: "hc_screenshots_attached", driver: "hc_ask_screenshots_attached" }
+  { name: "hc_account_unlocked", driver: "hc_ask_account_unlocked" }
 ];
 
 // --- read the AI Action, or say why it could not be read ------------------------
@@ -89,7 +65,16 @@
 }
 
 // --- transform: one route for the router --------------------------------------
-let intentInScope = intents.length > 0 && !intents.includes("other");
+// Every detected intent has to be a row in the map above. An intent the Action still
+// returns after it was retired from Phase 1 lands on the out-of-scope screen rather than
+// throwing, so the tree is safe to run while the Action's own intent list catches up.
+let intentInScope = intents.length > 0;
+for (let i = 0; i < intents.length; i++) {
+  if (!salesforceByIntent[intents[i]]) {
+    intentInScope = false;
+  }
+}
+
 let email_analysis_route = "escalation";
 if (intentRead && intent.escalate_to_agent !== true) {
   if (intentInScope) {
@@ -101,17 +86,14 @@
 
 // --- the checks this case actually needs --------------------------------------
 let requiredChecks = [];
-let blockingChecks = [];
 for (let i = 0; i < intents.length; i++) {
   let checksForIntent = requiredChecksByIntent[intents[i]];
-  for (let j = 0; j < checksForIntent.length; j++) {
-    if (!requiredChecks.includes(checksForIntent[j])) {
-      requiredChecks.push(checksForIntent[j]);
+  if (checksForIntent) {
+    for (let j = 0; j < checksForIntent.length; j++) {
+      if (!requiredChecks.includes(checksForIntent[j])) {
+        requiredChecks.push(checksForIntent[j]);
+      }
     }
-  }
-  let blocking = blockingCheckByIntent[intents[i]];
-  if (blocking) {
-    blockingChecks.push(blocking);
   }
 }
 
@@ -143,22 +125,65 @@
 }
 
 // --- screen 21: the requester list, suggestion first ----------------------------
-// Charley's 1 Sept assumption: an empty Contact on the case points to a driver rather
-// than a fleet manager. OPEN ITEM #3 - unconfirmed, so the agent can correct it.
+// Charley's assumption: an empty Contact on the case points to a driver rather than a
+// fleet manager. OPEN ITEM #3 - unconfirmed, so the agent can correct it.
 let requesterOptions = [{ value: "driver", label: "Driver" }, { value: "fleet", label: "Fleet manager" }];
 if (sfCase.ContactId) {
   requesterOptions = [{ value: "fleet", label: "Fleet manager" }, { value: "driver", label: "Driver" }];
 }
 
-// --- screen 21: the guidance above the native fields ---------------------------
+// --- does screen 21 have anything left to ask? ---------------------------------
+// Requester type alone is not a question worth a screen: the AI already suggests it and
+// the agent can change it on the manual-changes screen. With no checks and no approved-reply
+// choice the case goes straight to the drafted reply, which is what Missing Charges does.
+let hasQuestions = requiredChecks.length > 0 || variantOptions.length > 0;
+if (email_analysis_route === "in_scope" && !hasQuestions) {
+  email_analysis_route = "in_scope_no_questions";
+}
+
+// --- screen 21: the case, then the questions ------------------------------------
+// Same shell, cards and hero as the case review dashboard, so the agent reads the customer's
+// email in the layout they already know before answering anything about it.
 let detectedLabels = [];
 for (let i = 0; i < intents.length; i++) {
-  let label = salesforceByIntent[intents[i]].subtopic;
+  let mapped = salesforceByIntent[intents[i]];
+  let label = mapped ? mapped.subtopic : intents[i];
   if (!detectedLabels.includes(label)) {
     detectedLabels.push(label);
   }
 }
 
+let customerEmailBody = "<span class=\"case-review-muted\">&mdash;</span>";
+if (sfCase.Description && String(sfCase.Description).trim() !== "") {
+  customerEmailBody = sfCase.Description;
+}
+
+let hc_case_summary_html = "<div class=\"case-review-shell\"><div class=\"case-review-panel\">"
+  + "<div class=\"case-review-hero\"><div class=\"case-review-hero-top\"><div class=\"case-review-hero-copy\">"
+  + "<div class=\"case-review-eyebrow\">Case Review &middot; Homecharge</div>"
+  + "<h2 class=\"case-review-main-title\">Customer Request</h2>"
+  + "<div class=\"case-review-subtitle\">Case <strong>" + ZT.getVariableValue("sf_CaseNumber", "") + "</strong>"
+  + "<span class=\"case-review-subtitle-separator\">&middot;</span> " + detectedLabels.join(", ") + "</div>"
+  + "</div></div></div>"
+  + "<div class=\"case-review-body\"><div class=\"case-review-grid\">"
+  + "<div class=\"case-review-col case-review-col-left\"><div class=\"case-review-card\">"
+  + "<h3 class=\"case-review-card-title\">Case Details</h3>"
+  + "<div class=\"case-review-row\"><div class=\"case-review-row-label\">Case Number</div>"
+  + "<div class=\"case-review-row-value\">" + ZT.getVariableValue("sf_CaseNumber", "") + "</div></div>"
+  + "<div class=\"case-review-row\"><div class=\"case-review-row-label\">Customer Request</div>"
+  + "<div class=\"case-review-row-value\">" + detectedLabels.join(", ") + "</div></div>"
+  + "<div class=\"case-review-row\"><div class=\"case-review-row-label\">Requester Email</div>"
+  + "<div class=\"case-review-row-value\">" + sfCase.SuppliedEmail + "</div></div>"
+  + "<div class=\"case-review-row\"><div class=\"case-review-row-label\">Subject</div>"
+  + "<div class=\"case-review-row-value\">" + ZT.getVariableValue("sf_Subject", "") + "</div></div>"
+  + "</div></div>"
+  + "<div class=\"case-review-col case-review-col-right\"><div class=\"case-review-card\">"
+  + "<h3 class=\"case-review-card-title\">Original Customer Email</h3>"
+  + "<div class=\"case-review-html-card-body\">" + customerEmailBody + "</div>"
+  + "</div></div>"
+  + "</div></div></div></div>";
+
+// --- screen 21: the guidance above the native fields ---------------------------
 let suggestionLine = "AI suggests <strong>" + requesterOptions[0].label + "</strong>";
 if (variantOptions.length > 0) {
   suggestionLine = suggestionLine + " and the <strong>" + variantOptions[0].label + "</strong> reply";
@@ -167,10 +192,9 @@
 
 let hc_validation_html = "<div class=\"zt-content-block\">"
   + "<h3>Before the reply is drafted</h3>"
-  + "<p>Detected: <strong>" + detectedLabels.join(", ") + "</strong></p>"
   + "<p>" + suggestionLine + "</p>"
-  + "<p>Answer every question below. Confirm only what you have actually checked in Edison and"
-  + " Salesforce - anything left as No sends the case to you to work by hand.</p>"
+  + "<p>Answer every question below. Confirm only what you have actually checked in Edison -"
+  + " anything left as No sends the case to you to work by hand.</p>"
   + "</div>";
 
 // --- the variant labels node 26 prints on the dashboard -------------------------
@@ -192,20 +216,20 @@
 ZT.setFormData("hc_salesforce_by_intent", JSON.stringify(salesforceByIntent));
 ZT.setFormData("hc_variant_labels", JSON.stringify(variantLabels));
 ZT.setFormData("hc_required_checks", JSON.stringify(requiredChecks));
-ZT.setFormData("hc_blocking_checks", JSON.stringify(blockingChecks));
 ZT.setFormData("hc_has_variant", variantOptions.length > 0 ? "yes" : "no");
+
+// Screen 21 normally writes this. When the screen is skipped it never runs, so the AI's
+// own suggestion is stamped here instead - one writer per session either way.
+if (email_analysis_route === "in_scope_no_questions") {
+  ZT.setFormData("hc_requester_type", requesterOptions[0].value);
+}
 
 // One driver per check: "yes" only when this case's intents actually ask for it.
 for (let i = 0; i < checks.length; i++) {
-  let asked = requiredChecks.includes(checks[i].name);
-  for (let j = 0; j < blockingChecks.length; j++) {
-    if (blockingChecks[j].name === checks[i].name) {
-      asked = true;
-    }
-  }
-  ZT.setFormData(checks[i].driver, asked ? "yes" : "no");
+  ZT.setFormData(checks[i].driver, requiredChecks.includes(checks[i].name) ? "yes" : "no");
 }
 
 ZT.setTransformData("hc_requester_options", requesterOptions);
 ZT.setTransformData("hc_variant_options", variantOptions);
+ZT.setTransformData("hc_case_summary_html", hc_case_summary_html);
 ZT.setTransformData("hc_validation_html", hc_validation_html);
```

### node 21 — Requester type and validation (content)

```diff
--- before/node 21 content
+++ after/node 21 content
@@ -1 +1 @@
-<p>Original Email:<br><br>${actions.sfdc_int__case_email_ai.records | stringify}</p><p><br></p><p>${transforms.hc_validation_html}</p>
+<p>${transforms.hc_case_summary_html}</p><p>${transforms.hc_validation_html}</p>
```

### node 22 — Evaluate validation (script code)

```diff
--- before/node 22 content
+++ after/node 22 content
@@ -1,20 +1,11 @@
 // --- inputs -----------------------------------------------------------------
-// Node 19 owns the intent -> checks mapping and publishes the two lists this case needs.
+// Node 19 owns the intent -> checks mapping and publishes the list this case needs.
 // Screen 21 asks each one as a required native Yes/No select, so every question it showed
 // comes back answered - there is no "unticked" state to interpret here.
 let requiredChecks = JSON.parse(ZT.getVariableValue("hc_required_checks", "[]"));
-let blockingChecks = JSON.parse(ZT.getVariableValue("hc_blocking_checks", "[]"));
 
 // --- transform: one boolean for the router ------------------------------------
-// A blocking check answered Yes ENDS AI handling (Missing Charges step 4: screenshots
-// already attached). A required check answered No sends the case to the agent instead.
-let blockedReason = "";
-for (let i = 0; i < blockingChecks.length; i++) {
-  if (ZT.getVariableValue(blockingChecks[i].name, "") === "Yes") {
-    blockedReason = blockingChecks[i].reason;
-  }
-}
-
+// A required check answered No sends the case to the agent instead of drafting a reply.
 let missingCheck = false;
 for (let i = 0; i < requiredChecks.length; i++) {
   if (ZT.getVariableValue(requiredChecks[i], "") !== "Yes") {
@@ -23,9 +14,7 @@
 }
 
 let escalate_reason = "";
-if (blockedReason !== "") {
-  escalate_reason = blockedReason;
-} else if (missingCheck) {
+if (missingCheck) {
   escalate_reason = "Validation incomplete";
 }
 
```

### node 26 — Build case review dashboard (script code)

```diff
--- before/node 26 content
+++ after/node 26 content
@@ -241,3 +241,14 @@
 ZT.setTransformData("case_review_html", compact(case_review_html));
 ZT.setTransformData("request_form_html", compact(request_form_html));
 ZT.setTransformData("multiple_subtopics_form_html", compact(multiple_subtopics_form_html));
+
+// --- the missing-charges stop ---------------------------------------------------
+// Missing Charges is the one approved reply that asks the customer for screenshots, so its
+// dashboard carries a third button for the case where the agent can see they are already
+// attached. Node 27 is only reachable from that button once this script has run, so the
+// reason it prints is staged here rather than by a setter node.
+let hc_show_screenshots_stop = detectedIntents.includes("hc_missing_charges");
+ZT.setFormData("hc_show_screenshots_stop", hc_show_screenshots_stop);
+if (hc_show_screenshots_stop) {
+  ZT.setFormData("escalate_reason", "Screenshots already provided");
+}
```

### node 45 — Load example email (script code)

```diff
--- before/node 45 content
+++ after/node 45 content
@@ -79,10 +79,6 @@
     subject: "Password reset error",
     body: "Hello,\n\nI have asked for a password reset three times now and I either get nothing through or I get a password reset error on the page. I need password reset help please, this has been going on a week.\n\nRegards,\nMaria Collins"
   },
-  test_hc_update_charger_details: {
-    subject: "New charger installed",
-    body: "Good morning,\n\nWe have had a new charger installed at my home last week, the old one was faulty so the charger has been replaced. I need to update charger details on my account so my sessions come through again.\n\nThe new unit is a Zappi.\n\nThanks,\nStephen Ward"
-  },
   test_hc_tariff_update_standard: {
     subject: "My tariff is wrong",
     body: "Hi,\n\nMy tariff is incorrect on my account, my energy prices went up in July and the account still shows the old rate. I need to change tariff so I'm reimbursed properly.\n\nHow do I update my energy tariff?\n\nThanks,\nRachel Simmons"
@@ -102,22 +98,6 @@
   test_hc_missing_charges_with_screenshots: {
     subject: "Missing charges - screenshots attached",
     body: "Hello,\n\nAs requested, please find attached the screenshots of my home charging sessions from my charger app showing the kWh figures. My session data is missing from the Homecharge portal.\n\nThanks,\nPriya Raval"
-  },
-  test_hc_compatible_chargers: {
-    subject: "Charger compatibility",
-    body: "Hi,\n\nBefore I order a new unit I want to check charger compatibility. Which chargers are compatible with Homecharge, and is my charger supported if it is an Ohme?\n\nCan I use my existing charger, or do I need one of the supported charger brands?\n\nThanks,\nAdam Whitcombe"
-  },
-  test_hc_resent_onboarding_email: {
-    subject: "Never got the Homecharge invite",
-    body: "Hello,\n\nI still have not had the Homecharge invitation. My manager set me up over a week ago but no invitation email has arrived and the setup link has never come through.\n\nCan the invite be resent please?\n\nThanks,\nLouise Hammond"
-  },
-  test_hc_payment_query_dd_increase: {
-    subject: "My direct debit has gone up",
-    body: "Hi,\n\nWhy has my direct debit increased? My energy supplier increased my direct debit this month and my monthly payment has gone up by quite a lot since I started charging the car at home.\n\nIs that right?\n\nThanks,\nGraham Poole"
-  },
-  test_hc_payment_query_underpayment: {
-    subject: "Reimbursement lower than expected",
-    body: "Hello,\n\nI think I have been underpaid. The payment amount seems low - my reimbursement is lower than expected for last month and I expected more money given how much I charged.\n\nPlease can you check the amount paid is correct?\n\nThanks,\nHannah Ridley"
   },
   test_hc_multiple_intents: {
     subject: "Two things please",
```

### node 48 — claude.md (content)

```diff
--- before/node 48 content
+++ after/node 48 content
@@ -17,11 +17,13 @@
 Chargepass AI journey. Last queue dev ID in Salesforce will be the identifier."
 
 Use cases: FAST Admin (13 intents, ported 1:1 from GT's "Email Automation - AI Actions INT"
-109029630 org 123) and Homecharge Phase 1 - Missing Charges, Tariff Update, Update Charger
-Details, Password Reset, Compatible Chargers, Payment Query, Resent Onboarding Email
-(Charley Gunning documents, 3 and 15 Sept).
-
-## Architecture (47 nodes + this one)
+109029630 org 123) and Homecharge Phase 1 - Missing Charges, Tariff Update, Password Reset.
+Phase 1 ran to seven intents; Charley Gunning cut it to the three that can carry a full
+25-case test pass inside one release week. Update Charger Information, Compatible Chargers,
+Payment Query and Resent Onboarding Email are OUT of INT and come back through the release
+management cadence, one release at a time.
+
+## Architecture (52 nodes + this one)
 
 Shared front end - runs once, whichever journey follows
 1  Content  Start (root)                -> 2 live / 44 Test Mode
@@ -47,18 +49,20 @@
 
 Homecharge lane
 18 AI       Detect Homecharge intent     automate_hc_email_intent_int (98) -> 19
-19 Script   Grade intent + validation     email_intent, ai_exception_reason, the 7-intent map,
-                                         the per-intent check lists, the screen 21 drivers and
-                                         option lists, hc_validation_html -> 20
-20 Scoring  Email analysis route         escalation -> 27; in_scope -> 21; else 29
-21 Content  Requester type + validation  native conditional fields + guidance HTML -> 22
-22 Script   Evaluate validation          reads node 19's check lists -> hc_agent_required,
+19 Script   Grade intent + validation     email_intent, ai_exception_reason, the 3-intent map,
+                                         the per-intent check list, the screen 21 drivers and
+                                         option lists, hc_case_summary_html, hc_validation_html -> 20
+20 Scoring  Email analysis route         escalation -> 27; in_scope -> 21;
+                                         in_scope_no_questions -> 24; else 29
+21 Content  Case, email + validation     the case summary block, the customer's email, then the
+                                         native conditional fields still needed -> 22
+22 Script   Evaluate validation          reads node 19's check list -> hc_agent_required,
                                          escalate_reason -> 23
 23 Scoring  Agent required?              true -> 27; else 24
 24 Script   Set origin + template key    sf_Origin, hc_template_key, hc_copy_approved,
                                          hc_manual_changes_required -> 25
 25 AI       Generate email response      automate_hc_email_generation_int (99) -> 26
-26 Script   Build case review dashboard  -> 30
+26 Script   Build case review dashboard  hc_show_screenshots_stop -> 52
 
 Shared escalation / out of scope
 27 Script   Build escalation notice      escalation_html, all seven reasons -> 28
@@ -66,7 +70,10 @@
 29 Content  Case is not automated        terminal
 
 Shared tail - both lanes converge here
-30 Content  Case review dashboard        Yes -> 31; No (manual) -> 33
+52 Scoring  Screenshots option needed?   hc_show_screenshots_stop == true -> 53; else 30
+30 Content  Case review dashboard        Yes -> 49; No (manual) -> 33
+53 Content  Dashboard - missing charges  Yes -> 49; No (manual) -> 33;
+                                         No (screenshots already attached) -> 27
 31 Scoring  Manual edit / multi intent?  hc_manual_changes_required -> 33; multi intent -> 32;
                                          mock_downstream == true -> 36; else 35
 32 Content  Choose the Sub Topic         Send -> 34; Manual -> 33
@@ -104,6 +111,10 @@
 - queue_source_value - the raw Last_Owner_Queue_Name__c value, printed on screen 11.
 - queue_route - "fast_admin" | "homecharge" | "" - the only thing router 10 branches on.
 - queue_route_label - node 8, display. queue_routes_known is gone; nothing read it.
+- email_analysis_route - "escalation" | "in_scope" | "in_scope_no_questions" | "out_of_scope".
+  The fourth value is the Homecharge lane only: screen 21 is worth a screen only when it has a
+  check or an approved-reply choice to ask about, and requester type alone is not one, so a case
+  with neither goes straight to node 24. Missing Charges is what that covers today.
 - email_intent (comma string), sentiment, escalate_reason, confidence_score, email_analysis_route -
   node 13 on the FAST Admin lane, node 19 on the Homecharge lane. Only one lane runs per session,
   so the two lanes share these names without colliding.
@@ -115,26 +126,38 @@
   unmatched_summary and the drop-off logging that was considered alongside it.
 - hc_salesforce_by_intent - THE Homecharge intent -> Topic / Sub Topic map, declared in node 19
   and parsed by node 26. Sub Topic doubles as the label every screen prints, so a new Phase 1 use
-  case is one row here and nothing anywhere else.
+  case is one row here and nothing anywhere else. The map is also the SCOPE GATE: node 19 marks
+  a case out of scope when ANY detected intent is missing a row, so an intent the AI Action still
+  returns after it was cut from Phase 1 lands on screen 29 instead of throwing.
 - hc_variant_labels - flat variant key -> label map, declared in node 19, parsed by node 26.
-- hc_required_checks (JSON array of check names), hc_blocking_checks (JSON array of
-  { name, reason }) - the checks THIS case needs, resolved in node 19 from the per-intent maps
-  and read back by node 22. Both are empty for Compatible Chargers and Resent Onboarding Email.
-- hc_validation_html - node 19 -> screen 21. GUIDANCE ONLY (detected intents, the AI's
-  suggestions, what ticking means). Every input on that screen is a native field.
+- hc_required_checks (JSON array of check names) - the checks THIS case needs, resolved in node
+  19 from requiredChecksByIntent and read back by node 22. Only Password Reset asks for one
+  (hc_account_unlocked); Missing Charges and Tariff Update ask for nothing.
+- hc_blocking_checks is gone. The one blocking check, screenshots already attached, is now a
+  button on the dashboard (node 53), not a question on screen 21, so node 22 no longer has a
+  blocking loop to run.
+- hc_case_summary_html - node 19 -> screen 21. The case and the customer's own email, in the
+  same shell, hero and cards as the dashboard (case-review-* classes from the managed
+  stylesheet), so the agent reads the email in the layout they already know BEFORE answering
+  anything about it. Corpay UK's ask on the UAT standup: the agent should never have to leave
+  the Zingtree tab for the Salesforce feed to answer a question about the email.
+- hc_validation_html - node 19 -> screen 21. GUIDANCE ONLY (the AI's suggestions, what the
+  answers mean). Every input on that screen is a native field.
 - hc_requester_options, hc_variant_options - node 19 -> the two native dynamic selects on screen
   21, each an array of {label, value} with the AI's suggestion FIRST. Transforms because a native
   dynamic select is one of the two things a transform is for. hc_variant_options is [] when the
   detected intent has no variant group, and the field is hidden anyway.
-- hc_has_variant, hc_ask_sender_validated, hc_ask_pairing_checked, hc_ask_account_unlocked,
-  hc_ask_screenshots_attached - "yes"/"no" drivers written by node 19 and read ONLY by the
-  config.conditional on the matching field of screen 21. One driver per question; node 19's
-  checkDrivers map is where a new check gets wired.
-- hc_requester_type, hc_response_variant, hc_sender_validated, hc_pairing_checked,
-  hc_screenshots_attached, hc_account_unlocked - screen 21 answers. The four checks are required
-  Yes/No selects, so node 22 reads "Yes" or "No" and never an absent value. hc_response_variant
-  covers hc_tariff_update and hc_payment_query; its select renders only when hc_has_variant is
-  "yes".
+- hc_has_variant, hc_ask_account_unlocked - "yes"/"no" drivers written by node 19 and read ONLY
+  by the config.conditional on the matching field of screen 21. One driver per check; node 19's
+  checks list is where a new one gets wired.
+- hc_requester_type, hc_response_variant, hc_account_unlocked - screen 21 answers. The check is
+  a required Yes/No select, so node 22 reads "Yes" or "No" and never an absent value.
+  hc_response_variant covers hc_tariff_update only now; its select renders only when
+  hc_has_variant is "yes". hc_requester_type has a SECOND writer: node 19 stamps the AI's
+  suggestion when it routes in_scope_no_questions and screen 21 never runs. One writer per
+  session either way.
+- hc_show_screenshots_stop (bool) - node 26 -> router 52. True only when Missing Charges is one
+  of the detected intents, which is the only dashboard that carries the third button.
 - hc_agent_required (bool) - node 22 -> router 23.
 - sf_Origin ("Zingtree AI"), hc_template_key, hc_copy_approved - nodes 15 / 24.
 - hc_manual_changes_required (bool), hc_manual_changes_reason - node 24. The boolean is router
@@ -182,17 +205,17 @@
 Homecharge: declared in node 19, rendered by node 26 (HC-Online / HC-Not Online namespace).
   hc_missing_charges         HC-Not Online / Missing Charges
   hc_tariff_update           HC-Online     / Update Energy/Tariff Information
-  hc_update_charger_details  HC-Online     / Update Charger Information
   hc_password_reset          HC-Not Online / Password Reset
-  hc_compatible_chargers     HC-Not Online / Compatible Chargers
-  hc_payment_query           HC-Not Online / Payment Query
-  hc_resent_onboarding_email HC-Online     / Resent Onboarding Email
-Two intents carry response variants, pre-selected by the intent AI Action and confirmed by the
+One intent carries response variants, pre-selected by the intent AI Action and confirmed by the
 agent on screen 21:
   hc_tariff_update  standard_driver_pushback, octopus_pairing_pushback, driver_struggling_response
-  hc_payment_query  dd_increase_pushback, underpayment_response
-Payment Query is ONE intent with two approved replies, not two intents - Topic and Sub Topic are
-the same either way and only the wording differs.
+Retired from INT with the Phase 1 cut, in the map's own words - each comes back as one row here,
+one row in requiredChecksByIntent, its Test Mode scenario and its line in AI Action 98's prompt:
+  hc_update_charger_details  HC-Online     / Update Charger Information
+  hc_compatible_chargers     HC-Not Online / Compatible Chargers
+  hc_payment_query           HC-Not Online / Payment Query (variants dd_increase_pushback,
+                             underpayment_response - ONE intent with two approved replies)
+  hc_resent_onboarding_email HC-Online     / Resent Onboarding Email
 Topic precedence (both lanes): Sub Topic is the one request the agent acts on, but Topic
 describes the whole case - if ANY detected intent maps to the Not Online topic, Topic is
 Not Online, whatever Sub Topic is chosen on screen 32. Today that means add_update_contact_details
@@ -326,13 +349,24 @@
   blockingChecksByIntent), a row in checkDrivers, and one native field on screen 21 carrying the
   question text and its conditional. Node 22 never changes - it reads the resolved lists.
 - The validation checklist is per intent, not global. requiredChecksByIntent in node 19 decides
-  what screen 21 asks for. Compatible Chargers and Resent Onboarding Email take no account-level
-  action and their use case documents carry no step 3, so they ask for nothing and the Validation
-  block does not render at all. Node 22 reads the resolved list rather than restating the
-  conditions - adding an intent never means editing node 22.
-- hc_screenshots_attached is a BLOCKING check: ticking it ENDS AI handling instead of clearing
-  it. Blocking checks live in blockingChecksByIntent, keyed by check name with the escalation
-  reason as the value, so a second one is one row.
+  what screen 21 asks for. Node 22 reads the resolved list rather than restating the conditions -
+  adding an intent never means editing node 22.
+- THE SENDER CHECK IS GONE FROM EVERY INTENT. Confirming the requester is an authorised contact
+  is BAU for every agent on every queue, done before the email is read; an agent who spots an
+  unauthorised sender simply stops using AI and works the case. Asking again inside the workflow
+  added a gate that was always answered Yes and made Homecharge behave differently from the live
+  FAST queue. Removed with hc_sender_validated, hc_ask_sender_validated and its field on screen
+  21 (Bailey Britton and Gemma Danks, UAT standup). hc_pairing_checked went with it - it only
+  ever applied to Missing Charges, which now asks nothing.
+- THE SCREENSHOTS STOP IS A DASHBOARD BUTTON, NOT A QUESTION. The Missing Charges reply asks the
+  customer for screenshots, so it must not go out when they are already attached - but the agent
+  only knows that from the case, and asking up front made them answer before they had read the
+  email. Node 26 sets hc_show_screenshots_stop, router 52 sends Missing Charges to node 53 (the
+  same case_review_html, three buttons) and the third button lands on node 27 with escalate_reason
+  already staged by node 26 - node 27 is unreachable from anywhere else by then, so staging it
+  early is safe and costs no setter node. Corpay has no compliance sign-off for AI reading
+  attachments (Charley Gunning), so the AI cannot decide this itself; revisit when it does.
+- Screen 21 is skipped when it has nothing to ask. Requester type alone does not earn a screen.
 - A response variant whose approved template carries a placeholder sets hc_manual_changes_required
   in node 24, and router 31 tests it FIRST - ahead of the multi-intent branch - so the send path
   cannot be reached without an edit. Today that is underpayment_response, whose template leaves
@@ -360,6 +394,20 @@
   points at. Importing it as a new tree means updating the layout.
 
 ## Changelog
+- 2026-09-17 Claude - the UAT standup pass. Screen 21 now opens with the case and the customer's
+  own email in the dashboard's own shell (node 19 -> hc_case_summary_html) instead of a raw
+  ${actions...| stringify} dump, and asks only what is left: the sender check is removed from
+  every intent, the pairing check with it, and the screenshots question has become a third
+  button on a Missing Charges dashboard (new nodes 52 router / 53 screen, node 26 stages
+  hc_show_screenshots_stop and the escalation reason). A case with no check and no approved-reply
+  choice skips screen 21 entirely - node 19's new in_scope_no_questions route, router 20's new
+  branch to node 24 - which is what "load the case summary straight away" means for Missing
+  Charges. Homecharge Phase 1 cut from seven intents to three: hc_update_charger_details,
+  hc_compatible_chargers, hc_payment_query and hc_resent_onboarding_email are out of the node 19
+  map, out of Test Mode (five scenarios), and the map is now the scope gate so the tree is safe
+  to run before AI Action 98's prompt catches up. hc_blocking_checks and node 22's blocking loop
+  are gone with their producer. NOT IN THIS FILE: the Octopus pairing pushback paragraph spacing
+  and AI Action 98's own intent list - both live in the AI Actions, not the tree.
 - 2026-09-16 Claude - the two provider fields moved off the dashboard onto their own screen and
   became restricted picklists. New nodes: 49 (router, Homecharge lane only), 50 (script, the two
   option lists plus pre-selection from the case) and 51 (screen, two required native dynamic
```

## CHANGES THAT NEED AN EXPLANATION

Every line below must map to a requirement or an explicit request.
Anything unexplained is unintended drift — revert it before delivering.

  [ ] added node 52 (Screenshots option needed?)
  [ ] added node 53 (Case review dashboard - missing charges)
  [ ] node 19 — node_name: "Reads the intent AI Action; sets email_intent, route, ai_excepti" → "Reads the intent AI Action; stages the case summary block, the Phase 1 intent map, the checks this case needs and the screen 21 drivers"
  [ ] node 19 — script code changed (211 → 235 lines) — Grade intent and build validation screen
  [ ] node 20 — node_name: "escalation -> notice, in_scope -> validation, anything else -> n" → "escalation -> notice, in_scope -> validation screen, in_scope_no_questions -> straight to the draft, else out of scope"
  [ ] node 20 — button added/changed: "email_analysis_route == "in_scope_no_questions"" → node 24 [logic: email_analysis_route == "in_scope_no_questions"]
  [ ] node 20 — button added/changed: "email_analysis_route == "in_scope"" → node 21 [logic: email_analysis_route == "in_scope"]
  [ ] node 20 — button added/changed: "" → node 29
  [ ] node 20 — button removed/replaced: "email_analysis_route == "in_scope"" → node 21
  [ ] node 20 — button removed/replaced: "" → node 29
  [ ] node 21 — node_name: "Agent confirms who sent the email, the approved reply and the Ed" → "Shows the case and the customer's email, then asks only what this intent still needs before the reply is drafted"
  [ ] node 21 — content changed (134 → 80 characters) — Requester type and validation
  [ ] node 21 — form field removed: hc_sender_validated (select)
  [ ] node 21 — form field removed: hc_pairing_checked (select)
  [ ] node 21 — form field removed: hc_screenshots_attached (select)
  [ ] node 22 — node_name: "Turns the screen 9 answers into one boolean for the router" → "Turns screen 21's answers into one boolean for the router"
  [ ] node 22 — script code changed (36 → 25 lines) — Evaluate validation
  [ ] node 26 — script code changed (243 → 254 lines) — Build case review dashboard
  [ ] node 26 — continuation_node_id: 30 → 52 — Build case review dashboard
  [ ] node 44 — form field settings changed (same field names)
  [ ] node 45 — script code changed (150 → 130 lines) — Load example email
  [ ] node 48 — content changed (479 → 527 lines) — claude.md

