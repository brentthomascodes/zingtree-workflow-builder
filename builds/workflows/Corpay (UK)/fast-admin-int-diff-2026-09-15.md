========================================================================
WORKFLOW DIFF — Fast Admin - INT
========================================================================

Before : Fast Admin - INT (BEFORE baseline 2026-09-15).json  (48 nodes)
After  : Fast Admin - INT (ai-exception-reason + native validation 2026-09-15).json  (48 nodes)

## PLAIN SUMMARY

37 of 48 nodes are byte-for-byte identical to the original (77% untouched).
0 nodes added, 0 removed, 0 renumbered, 11 modified.

In plain terms:
  * CHANGED  node 8 — Resolve queue route [Script]
               - script code changed (22 → 21 lines) — Resolve queue route
  * CHANGED  node 13 — Grade intent result [Script]
               - script code changed (16 → 41 lines) — Grade intent result
  * CHANGED  node 19 — Grade intent and build validation screen [Script]
               - node_name: "Reads the intent AI Action; sets email_intent, route, and builds" → "Reads the intent AI Action; sets email_intent, route, ai_exception_reason, the per-intent check drivers and the screen 21 option lists"
               - script code changed (150 → 211 lines) — Grade intent and build validation screen
  * CHANGED  node 21 — Requester type and validation [Content]
               - node_name: "Agent confirms who sent the email, the tariff response, and the " → "Agent confirms who sent the email, the approved reply and the Edison / Salesforce checks this intent needs"
               - form field added: hc_requester_type (select)
               - form field added: hc_response_variant (select)
               - form field added: hc_sender_validated (select)
               - form field added: hc_pairing_checked (select)
               - form field added: hc_account_unlocked (select)
               - form field added: hc_screenshots_attached (select)
  * CHANGED  node 22 — Evaluate validation [Script]
               - script code changed (21 → 36 lines) — Evaluate validation
  * CHANGED  node 24 — Set case origin and template key [Script]
               - script code changed (28 → 35 lines) — Set case origin and template key
  * CHANGED  node 27 — Build escalation notice [Script]
               - script code changed (23 → 25 lines) — Build escalation notice
  * CHANGED  node 29 — Case is not automated [Content]
               - content changed (156 → 158 characters) — Case is not automated
  * CHANGED  node 36 — Prepare email request [Script]
               - page_title: "Stage CC list" → "Prepare email request"
               - node_name: "Stages transforms.ccAddresses for the send_email_simple_int body" → "Escapes HtmlBody and sf_Subject and stages ccAddresses for the send_email_simple_int body"
               - script code changed (22 → 36 lines) — Prepare email request
  * CHANGED  node 39 — Grade email send [Script]
               - node_name: "Sets emailSent / errorEmailMessage from the send response and bu" → "Grades the send on the response code, then the composite result; builds the summary screen"
               - script code changed (61 → 60 lines) — Grade email send
  * CHANGED  node 48 — claude.md [Content]
               - content changed (350 → 428 lines) — claude.md

## TREE SHAPE

  node type                before    after    delta
  AI_Action                     4        4       +0
  Content                      15       15       +0
  Data                          4        4       +0
  Email                         1        1       +0
  Scoring                      10       10       +0
  Script                       14       14       +0
  TOTAL                        48       48       +0

  Root node unchanged (node 1).

## STRUCTURAL SANITY

  No broken links introduced.
  No nodes became unreachable.
  Pre-existing in the BEFORE tree (not caused by this edit): 0 broken link(s), 1 unreachable node(s).

## UNTOUCHED NODES (37)

  1, 2, 3, 4, 5, 6, 7, 9, 10, 11, 12, 14, 15, 16, 17, 18, 20, 23, 25, 26, 28, 30, 31, 32, 33, 34, 35, 37, 38, 40, 41, 42, 43, 44, 45, 46, 47

## TREE-LEVEL SETTINGS CHANGED (0)

  (none)

## COSMETIC / EDITOR-ONLY CHANGES (0) — ignore

  (none)

## LINE-LEVEL BODY DIFFS (10)

### node 8 — Resolve queue route (script code)

```diff
--- before/node 8 content
+++ after/node 8 content
@@ -19,4 +19,3 @@
 ZT.setFormData("queue_source_value", queue_source_value);
 ZT.setFormData("queue_route", queue_route);
 ZT.setFormData("queue_route_label", labelByRoute[queue_route] || "Not in scope");
-ZT.setFormData("queue_routes_known", JSON.stringify(Object.keys(routeByQueue)));
```

### node 13 — Grade intent result (script code)

```diff
--- before/node 13 content
+++ after/node 13 content
@@ -1,16 +1,41 @@
 // --- inputs -----------------------------------------------------------------
 let intent = actions.automate_email_intent_int;
-let email_intents = [].concat(intent.email_intent || []);
+
+// --- read the AI Action, or say why it could not be read ------------------------
+// An AI Action response carries no _zt_meta - only Connected Object responses do - so the
+// output itself is the signal: every answer this Action returns carries email_intent. A
+// response without it never ran, and that must not read as "no intent matched" on screen
+// 29 - it goes to the agent instead.
+let intentRead = intent.email_intent !== undefined;
+let intents = [];
+let sentiment = "";
+let escalate_reason = "";
+let confidence_score = "";
+let ai_exception_reason = "The intent check did not return a result. Work this case as you normally would.";
+
+if (intentRead) {
+  intents = intent.email_intent;
+  sentiment = intent.sentiment;
+  escalate_reason = intent.escalate_reason;
+  confidence_score = intent.confidence_score;
+  ai_exception_reason = intent.ai_exception_reason;
+}
 
 // --- transform: one route for the router --------------------------------------
-let intentInScope = email_intents.length > 0 && !email_intents.includes("other");
-let email_analysis_route = intent.escalate_to_agent === true
-  ? "escalation"
-  : (intentInScope ? "in_scope" : "out_of_scope");
+let intentInScope = intents.length > 0 && !intents.includes("other");
+let email_analysis_route = "escalation";
+if (intentRead && intent.escalate_to_agent !== true) {
+  if (intentInScope) {
+    email_analysis_route = "in_scope";
+  } else {
+    email_analysis_route = "out_of_scope";
+  }
+}
 
 // --- outputs ----------------------------------------------------------------
-ZT.setFormData("email_intent", email_intents.join(", "));
-ZT.setFormData("sentiment", intent.sentiment || "");
-ZT.setFormData("escalate_reason", intent.escalate_reason || "");
-ZT.setFormData("confidence_score", intent.confidence_score == null ? "" : intent.confidence_score);
+ZT.setFormData("email_intent", intents.join(", "));
+ZT.setFormData("sentiment", sentiment);
+ZT.setFormData("escalate_reason", escalate_reason);
+ZT.setFormData("confidence_score", confidence_score);
+ZT.setFormData("ai_exception_reason", ai_exception_reason);
 ZT.setFormData("email_analysis_route", email_analysis_route);
```

### node 19 — Grade intent and build validation screen (script code)

```diff
--- before/node 19 content
+++ after/node 19 content
@@ -1,7 +1,10 @@
 // --- inputs -----------------------------------------------------------------
 let intent = actions.automate_hc_email_intent_int;
 let sfCase = actions.sfdc_int__case_email_ai.records[0];
-let hc_intents = [].concat(intent.email_intent || []);
+
+// An AI Action response carries no _zt_meta - only Connected Object responses do - so the
+// output itself is the signal: every answer this Action returns carries email_intent.
+let intentRead = intent.email_intent !== undefined;
 
 // --- reference data: declared here only, carried forward as form data -------------
 // The one Homecharge intent map. Sub Topic doubles as the label every screen prints, so
@@ -16,40 +19,33 @@
   hc_resent_onboarding_email: { topic: "HC-Online",     subtopic: "Resent Onboarding Email" }
 };
 
-// hc_response_variant is no longer tariff-only. An intent with a variant group asks the agent
-// which approved reply fits; an intent without one has a single template and no select.
-const variantGroups = {
-  hc_tariff_update: {
-    label: "Tariff response",
-    help: "Pre-selected from the customer's wording. Change it if the email fits a different response.",
+// An intent with a variant group asks the agent which approved reply fits; an intent
+// without one has a single template and no select. Payment Query is one intent with two
+// replies, not two intents.
+const variantGroups = [
+  {
+    intent: "hc_tariff_update",
     fallback: "standard_driver_pushback",
-    options: {
-      standard_driver_pushback: "Standard driver pushback",
-      octopus_pairing_pushback: "Octopus pairing pushback",
-      driver_struggling_response: "Driver struggling response"
-    }
+    options: [
+      { value: "standard_driver_pushback", label: "Standard driver pushback" },
+      { value: "octopus_pairing_pushback", label: "Octopus pairing pushback" },
+      { value: "driver_struggling_response", label: "Driver struggling response" }
+    ]
   },
-  hc_payment_query: {
-    label: "Payment query response",
-    help: "Pre-selected from the customer's wording. Direct debit increases and underpayment claims use different approved templates.",
+  {
+    intent: "hc_payment_query",
     fallback: "dd_increase_pushback",
-    options: {
-      dd_increase_pushback: "Driver's electricity direct debit has increased",
-      underpayment_response: "Driver claiming underpayment"
-    }
-  }
-};
+    options: [
+      { value: "dd_increase_pushback", label: "Driver's electricity direct debit has increased" },
+      { value: "underpayment_response", label: "Driver claiming underpayment" }
+    ]
+  }
+];
 
 // Step 3 of the use case documents: confirm the sender in Edison, or as a recognised fleet
 // manager in Salesforce, before any account-level action, and unlock the account where the
 // request needs it. Compatible Chargers and Resent Onboarding Email take no account-level
 // action - their documents carry no step 3 - so they ask for nothing.
-const checkLabels = {
-  hc_sender_validated: "Sender confirmed in Edison as a valid contact, or as a recognised fleet manager in Salesforce",
-  hc_pairing_checked: "Pairing status checked in Edison, and Chargelink reviewed for the missing sessions",
-  hc_account_unlocked: "Account checked in Edison and unlocked if it was locked",
-  hc_screenshots_attached: "Screenshots of the charge sessions were already attached to the customer's email"
-};
 const requiredChecksByIntent = {
   hc_missing_charges: ["hc_sender_validated", "hc_pairing_checked"],
   hc_tariff_update: ["hc_sender_validated"],
@@ -59,92 +55,157 @@
   hc_compatible_chargers: [],
   hc_resent_onboarding_email: []
 };
-// Ticked, these END AI handling rather than clear it. The value is the escalation reason.
-const blockingChecksByIntent = {
-  hc_missing_charges: { hc_screenshots_attached: "Screenshots already provided" }
+// Answered Yes, these END AI handling rather than clear it.
+const blockingCheckByIntent = {
+  hc_missing_charges: { name: "hc_screenshots_attached", reason: "Screenshots already provided" }
 };
 
+// Screen 21 asks every check as a native Yes/No field, shown by its own driver variable.
+// The question text lives on the field; this list only says which drivers to switch on.
+const checks = [
+  { name: "hc_sender_validated", driver: "hc_ask_sender_validated" },
+  { name: "hc_pairing_checked", driver: "hc_ask_pairing_checked" },
+  { name: "hc_account_unlocked", driver: "hc_ask_account_unlocked" },
+  { name: "hc_screenshots_attached", driver: "hc_ask_screenshots_attached" }
+];
+
+// --- read the AI Action, or say why it could not be read ------------------------
+// A response the Action never produced must not read as "no intent matched" on screen 29 -
+// it goes to the agent, with the miss stated in the one field the screens print.
+let intents = [];
+let sentiment = "";
+let escalate_reason = "";
+let confidence_score = "";
+let suggestedVariant = "";
+let ai_exception_reason = "The intent check did not return a result. Work this case as you normally would.";
+
+if (intentRead) {
+  intents = intent.email_intent;
+  sentiment = intent.sentiment;
+  escalate_reason = intent.escalate_reason;
+  confidence_score = intent.confidence_score;
+  suggestedVariant = intent.hc_response_variant;
+  ai_exception_reason = intent.ai_exception_reason;
+}
+
 // --- transform: one route for the router --------------------------------------
-let intentInScope = hc_intents.length > 0 && !hc_intents.includes("other");
-let email_analysis_route = intent.escalate_to_agent === true
-  ? "escalation"
-  : (intentInScope ? "in_scope" : "out_of_scope");
-
-// Charley's 1 Sept assumption: an empty Contact on the case points to a driver
-// rather than a fleet manager. OPEN ITEM #3 - unconfirmed, so the agent can correct it.
-let requesterDefault = sfCase.ContactId ? "fleet" : "driver";
-let variantIntent = hc_intents.filter(key => variantGroups[key])[0] || "";
-let variantGroup = variantGroups[variantIntent];
-let variantDefault = variantGroup
-  ? (variantGroup.options[intent.hc_response_variant] ? intent.hc_response_variant : variantGroup.fallback)
-  : "";
+let intentInScope = intents.length > 0 && !intents.includes("other");
+let email_analysis_route = "escalation";
+if (intentRead && intent.escalate_to_agent !== true) {
+  if (intentInScope) {
+    email_analysis_route = "in_scope";
+  } else {
+    email_analysis_route = "out_of_scope";
+  }
+}
 
 // --- the checks this case actually needs --------------------------------------
-let requiredChecks = [...new Set(hc_intents.reduce(
-  (all, key) => all.concat(requiredChecksByIntent[key] || []), []))];
-let blockingChecks = hc_intents.reduce(
-  (all, key) => Object.assign(all, blockingChecksByIntent[key] || {}), {});
-let checklistKeys = requiredChecks.concat(Object.keys(blockingChecks));
-
-// --- validation screen (screen 21) ---------------------------------------------
-const escapeHtml = value => String(value == null ? "" : value)
-  .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
-  .replace(/"/g, "&quot;").replace(/'/g, "&#39;");
-const buildOptions = (pairs, selectedValue) => pairs
-  .map(pair => `<option value="${escapeHtml(pair[0])}"${pair[0] === selectedValue ? ' selected="selected"' : ""}>${escapeHtml(pair[1])}</option>`)
-  .join("");
-
-let detectedLabels = [...new Set(hc_intents.map(
-  key => salesforceByIntent[key] ? salesforceByIntent[key].subtopic : key))];
-
-let checklistRows = checklistKeys.map(name => `
-  <label class="zt-form-check"><input type="checkbox" class="zt-data" id="${name}" name="${name}" data-name="${name}" value="yes" />
-    <span>${escapeHtml(checkLabels[name])}</span></label>`).join("");
-
-let checklistField = checklistKeys.length === 0 ? "" : `
-  <div class="zt-form-field zt-form-field-full">
-    <label class="zt-form-label">Validation</label>
-    <div class="zt-form-checklist">${checklistRows}</div>
-    <div class="zt-form-help">Tick only what you have actually confirmed. Anything left unticked sends the case to you to work by hand.</div>
-  </div>`;
-
-let variantField = !variantGroup ? "" : `
-    <div class="zt-form-field">
-      <label for="hc_response_variant" class="zt-form-label">${escapeHtml(variantGroup.label)} <span class="zt-required">*</span></label>
-      <select id="hc_response_variant" name="hc_response_variant" data-name="hc_response_variant" class="zt-data zt-form-control" required>
-        ${buildOptions(Object.keys(variantGroup.options).map(key => [key, variantGroup.options[key]]), variantDefault)}
-      </select>
-      <div class="zt-form-help">${escapeHtml(variantGroup.help)}</div>
-    </div>`;
-
-let hc_validation_html = `
-<div class="zt-form-card">
-  <div class="zt-form-header">
-    <h2 class="zt-form-title">Before the reply is drafted</h2>
-    <p class="zt-form-subtitle">Detected: ${escapeHtml(detectedLabels.join(", "))}</p>
-  </div>
-  <div class="zt-form-grid">
-    <div class="zt-form-field">
-      <label for="hc_requester_type" class="zt-form-label">Who sent this email <span class="zt-required">*</span></label>
-      <select id="hc_requester_type" name="hc_requester_type" data-name="hc_requester_type" class="zt-data zt-form-control" required>
-        ${buildOptions([["driver", "Driver"], ["fleet", "Fleet manager"]], requesterDefault)}
-      </select>
-      <div class="zt-form-help">Pre-set from whether a Contact is linked to the case. Correct it if that is wrong.</div>
-    </div>${variantField}
-  </div>${checklistField}
-</div>`.trim();
+let requiredChecks = [];
+let blockingChecks = [];
+for (let i = 0; i < intents.length; i++) {
+  let checksForIntent = requiredChecksByIntent[intents[i]];
+  for (let j = 0; j < checksForIntent.length; j++) {
+    if (!requiredChecks.includes(checksForIntent[j])) {
+      requiredChecks.push(checksForIntent[j]);
+    }
+  }
+  let blocking = blockingCheckByIntent[intents[i]];
+  if (blocking) {
+    blockingChecks.push(blocking);
+  }
+}
+
+// --- the variant group, if this case has one -----------------------------------
+// The AI pre-selects a variant; we accept it only if it belongs to this intent's group.
+let variantGroup = null;
+for (let i = 0; i < variantGroups.length; i++) {
+  if (variantGroup === null && intents.includes(variantGroups[i].intent)) {
+    variantGroup = variantGroups[i];
+  }
+}
+
+let variantOptions = [];
+if (variantGroup !== null) {
+  let variantDefault = variantGroup.fallback;
+  for (let i = 0; i < variantGroup.options.length; i++) {
+    if (variantGroup.options[i].value === suggestedVariant) {
+      variantDefault = suggestedVariant;
+    }
+  }
+  // The suggestion goes first so the agent confirms rather than hunts.
+  for (let i = 0; i < variantGroup.options.length; i++) {
+    if (variantGroup.options[i].value === variantDefault) {
+      variantOptions.unshift(variantGroup.options[i]);
+    } else {
+      variantOptions.push(variantGroup.options[i]);
+    }
+  }
+}
+
+// --- screen 21: the requester list, suggestion first ----------------------------
+// Charley's 1 Sept assumption: an empty Contact on the case points to a driver rather
+// than a fleet manager. OPEN ITEM #3 - unconfirmed, so the agent can correct it.
+let requesterOptions = [{ value: "driver", label: "Driver" }, { value: "fleet", label: "Fleet manager" }];
+if (sfCase.ContactId) {
+  requesterOptions = [{ value: "fleet", label: "Fleet manager" }, { value: "driver", label: "Driver" }];
+}
+
+// --- screen 21: the guidance above the native fields ---------------------------
+let detectedLabels = [];
+for (let i = 0; i < intents.length; i++) {
+  let label = salesforceByIntent[intents[i]].subtopic;
+  if (!detectedLabels.includes(label)) {
+    detectedLabels.push(label);
+  }
+}
+
+let suggestionLine = "AI suggests <strong>" + requesterOptions[0].label + "</strong>";
+if (variantOptions.length > 0) {
+  suggestionLine = suggestionLine + " and the <strong>" + variantOptions[0].label + "</strong> reply";
+}
+suggestionLine = suggestionLine + ". Change either if the email says otherwise.";
+
+let hc_validation_html = "<div class=\"zt-content-block\">"
+  + "<h3>Before the reply is drafted</h3>"
+  + "<p>Detected: <strong>" + detectedLabels.join(", ") + "</strong></p>"
+  + "<p>" + suggestionLine + "</p>"
+  + "<p>Answer every question below. Confirm only what you have actually checked in Edison and"
+  + " Salesforce - anything left as No sends the case to you to work by hand.</p>"
+  + "</div>";
+
+// --- the variant labels node 26 prints on the dashboard -------------------------
+let variantLabels = {};
+for (let i = 0; i < variantGroups.length; i++) {
+  let options = variantGroups[i].options;
+  for (let j = 0; j < options.length; j++) {
+    variantLabels[options[j].value] = options[j].label;
+  }
+}
 
 // --- outputs ----------------------------------------------------------------
-ZT.setFormData("email_intent", hc_intents.join(", "));
-ZT.setFormData("sentiment", intent.sentiment || "");
-ZT.setFormData("escalate_reason", intent.escalate_reason || "");
-ZT.setFormData("confidence_score", intent.confidence_score == null ? "" : intent.confidence_score);
-ZT.setFormData("unmatched_summary", intent.unmatched_summary || "");
+ZT.setFormData("email_intent", intents.join(", "));
+ZT.setFormData("sentiment", sentiment);
+ZT.setFormData("escalate_reason", escalate_reason);
+ZT.setFormData("confidence_score", confidence_score);
+ZT.setFormData("ai_exception_reason", ai_exception_reason);
 ZT.setFormData("email_analysis_route", email_analysis_route);
 ZT.setFormData("hc_salesforce_by_intent", JSON.stringify(salesforceByIntent));
-ZT.setFormData("hc_variant_labels", JSON.stringify(Object.keys(variantGroups).reduce(
-  (all, key) => Object.assign(all, variantGroups[key].options), {})));
+ZT.setFormData("hc_variant_labels", JSON.stringify(variantLabels));
 ZT.setFormData("hc_required_checks", JSON.stringify(requiredChecks));
 ZT.setFormData("hc_blocking_checks", JSON.stringify(blockingChecks));
-// Collapsed to one line - newlines in a merge field have rendered as <br> before.
-ZT.setTransformData("hc_validation_html", hc_validation_html.replace(/\s*\n\s*/g, " "));
+ZT.setFormData("hc_has_variant", variantOptions.length > 0 ? "yes" : "no");
+
+// One driver per check: "yes" only when this case's intents actually ask for it.
+for (let i = 0; i < checks.length; i++) {
+  let asked = requiredChecks.includes(checks[i].name);
+  for (let j = 0; j < blockingChecks.length; j++) {
+    if (blockingChecks[j].name === checks[i].name) {
+      asked = true;
+    }
+  }
+  ZT.setFormData(checks[i].driver, asked ? "yes" : "no");
+}
+
+ZT.setTransformData("hc_requester_options", requesterOptions);
+ZT.setTransformData("hc_variant_options", variantOptions);
+ZT.setTransformData("hc_validation_html", hc_validation_html);
```

### node 22 — Evaluate validation (script code)

```diff
--- before/node 22 content
+++ after/node 22 content
@@ -1,21 +1,36 @@
 // --- inputs -----------------------------------------------------------------
 // Node 19 owns the intent -> checks mapping and publishes the two lists this case needs.
+// Screen 21 asks each one as a required native Yes/No select, so every question it showed
+// comes back answered - there is no "unticked" state to interpret here.
 let requiredChecks = JSON.parse(ZT.getVariableValue("hc_required_checks", "[]"));
-let blockingChecks = JSON.parse(ZT.getVariableValue("hc_blocking_checks", "{}"));
+let blockingChecks = JSON.parse(ZT.getVariableValue("hc_blocking_checks", "[]"));
 
 // --- transform: one boolean for the router ------------------------------------
-// A blocking check the agent ticked ENDS AI handling (Missing Charges step 4: screenshots
-// already attached). A required check left unticked sends the case to the agent instead.
-let blockedBy = Object.keys(blockingChecks).filter(name => ZT.getVariableValue(name, "") === "yes")[0] || "";
-let missingChecks = requiredChecks.some(name => ZT.getVariableValue(name, "") !== "yes");
+// A blocking check answered Yes ENDS AI handling (Missing Charges step 4: screenshots
+// already attached). A required check answered No sends the case to the agent instead.
+let blockedReason = "";
+for (let i = 0; i < blockingChecks.length; i++) {
+  if (ZT.getVariableValue(blockingChecks[i].name, "") === "Yes") {
+    blockedReason = blockingChecks[i].reason;
+  }
+}
 
-let hc_agent_required = blockedBy !== "" || missingChecks;
-let escalate_reason = blockedBy !== ""
-  ? blockingChecks[blockedBy]
-  : (missingChecks ? "Validation incomplete" : "");
+let missingCheck = false;
+for (let i = 0; i < requiredChecks.length; i++) {
+  if (ZT.getVariableValue(requiredChecks[i], "") !== "Yes") {
+    missingCheck = true;
+  }
+}
+
+let escalate_reason = "";
+if (blockedReason !== "") {
+  escalate_reason = blockedReason;
+} else if (missingCheck) {
+  escalate_reason = "Validation incomplete";
+}
 
 // --- outputs ----------------------------------------------------------------
-ZT.setFormData("hc_agent_required", hc_agent_required);
+ZT.setFormData("hc_agent_required", escalate_reason !== "");
 if (escalate_reason !== "") {
   ZT.setFormData("escalate_reason", escalate_reason);
 }
```

### node 24 — Set case origin and template key (script code)

```diff
--- before/node 24 content
+++ after/node 24 content
@@ -2,13 +2,20 @@
 let email_intent = ZT.getVariableValue("email_intent", "");
 let requester_type = ZT.getVariableValue("hc_requester_type", "driver");
 let response_variant = ZT.getVariableValue("hc_response_variant", "");
-let intents = email_intent.split(", ").filter(Boolean);
+let intents = [];
+if (email_intent !== "") {
+  intents = email_intent.split(", ");
+}
 
 // --- transform: the key the generation AI Action drafts against -------------------
 // intent (+ response variant) + audience. Only approved driver copy exists today, so a
 // fleet run is flagged for the agent on the dashboard. OPEN ITEM #3.
 let base = intents.length === 1 ? intents[0] : "multiple";
-let hc_template_key = [base, response_variant, requester_type].filter(Boolean).join(":");
+let hc_template_key = base;
+if (response_variant !== "") {
+  hc_template_key = hc_template_key + ":" + response_variant;
+}
+hc_template_key = hc_template_key + ":" + requester_type;
 let hc_copy_approved = requester_type === "driver";
 
 // Some approved templates ship with a placeholder only the agent can fill, so the draft
```

### node 27 — Build escalation notice (script code)

```diff
--- before/node 27 content
+++ after/node 27 content
@@ -1,6 +1,6 @@
 // --- inputs -----------------------------------------------------------------
 let escalate_reason = ZT.getVariableValue("escalate_reason", "");
-let unmatched_summary = ZT.getVariableValue("unmatched_summary", "");
+let ai_exception_reason = ZT.getVariableValue("ai_exception_reason", "");
 
 // --- one notice per escalation reason ----------------------------------------
 const noticeTitleByReason = {
@@ -14,9 +14,11 @@
 };
 let title = noticeTitleByReason[escalate_reason] || "AI support needs your help with this";
 
+// The AI Action explains itself. The reason is blank only on the two agent-side stops
+// (validation incomplete, screenshots already provided), where the title already says it.
 let escalation_html = `<h3>${title}</h3>`
   + `<p>This case requires you to action the request. Please work this case as you normally would.</p>`
-  + (unmatched_summary ? `<p><strong>What AI saw:</strong> ${unmatched_summary}</p>` : ``)
+  + (ai_exception_reason ? `<p><strong>Why AI stopped:</strong> ${ai_exception_reason}</p>` : ``)
   + `<p>For further guidance, refer to the Zingtree pop up over to the right.</p>`;
 
 // --- outputs ----------------------------------------------------------------
```

### node 29 — Case is not automated (content)

```diff
--- before/node 29 content
+++ after/node 29 content
@@ -1 +1 @@
-<p>Please work this case as you normally would, the intent detected is not in scope for AI email generation automation.&nbsp;</p><p>${unmatched_summary}</p>
+<p>Please work this case as you normally would, the intent detected is not in scope for AI email generation automation.&nbsp;</p><p>${ai_exception_reason}</p>
```

### node 36 — Prepare email request (script code)

```diff
--- before/node 36 content
+++ after/node 36 content
@@ -1,22 +1,36 @@
 // --- inputs -----------------------------------------------------------------
-let inboundEmail = actions.get_incoming_email_addresses_int.records[0] || {};
+let inboundEmail = actions.get_incoming_email_addresses_int.records[0];
+let html_body = ZT.getVariableValue("HtmlBody", "");
+let sf_Subject = ZT.getVariableValue("sf_Subject", "");
 
-// --- transform: the CC list -------------------------------------------------------
-// Salesforce EmailMessage.CcAddress holds several addresses separated by semicolons;
-// emailSimple wants a list. Always an array, never null - the merge field sits BARE in
-// the Connected Object body, so whatever lands here has to be valid JSON on its own.
-let ccAddresses = inboundEmail.CcAddress
-  ? inboundEmail.CcAddress.split(";").map(address => address.trim()).filter(Boolean)
-  : [];
+// --- transform: the CC list as JSON text ------------------------------------------
+// Salesforce EmailMessage.CcAddress separates addresses with semicolons; emailSimple
+// wants a list. ${transforms.ccAddresses} sits BARE in the Connected Object body - no
+// surrounding quotes - so what lands here has to be valid JSON on its own: "[]" when
+// there is no CC list, never null and never absent.
+let ccList = [];
+if (inboundEmail.CcAddress) {
+  let addresses = inboundEmail.CcAddress.split(";");
+  for (let i = 0; i < addresses.length; i++) {
+    let address = addresses[i].trim();
+    if (address !== "") {
+      ccList.push(address);
+    }
+  }
+}
 
 // --- outputs ----------------------------------------------------------------------
-// Connected Object 187 owns the request body. Its template reads exactly five things:
+// The Connected Object owns the request body and reads exactly five things:
 //   ${actions.sfdc_int__case_email_ai.records[0].SuppliedEmail}  - node 2
 //   ${transforms.ccAddresses}   (bare, unquoted)                 - this node
-//   ${sf_Subject}                                                - inbound / node 47
-//   ${HtmlBody}                                                  - node 17 or 26
+//   ${sf_Subject}               (quoted, pre-escaped)            - this node
+//   ${HtmlBody}                 (quoted, pre-escaped)            - this node
 //   ${sf_Id}                                                     - inbound / node 47
-// This node's only job is the one the template cannot do for itself. Do not build a
-// payload variable here: the template does not read one, and an earlier attempt to
-// merge a serialized body is what produced the Salesforce JSON_PARSER_ERROR.
-ZT.setTransformData("ccAddresses", ccAddresses);
+// The subject and the body sit INSIDE quotes, so each is escaped for that position
+// before it goes: stringify it, then drop the quotes stringify added. A drafted reply
+// carries quotes of its own in every class and href attribute. Node 39 reverses this to
+// show the reply on screen. Never build the request body here and merge it as one
+// variable - that is what produced the Salesforce JSON_PARSER_ERROR.
+ZT.setFormData("HtmlBody", JSON.stringify(html_body).slice(1, -1));
+ZT.setFormData("sf_Subject", JSON.stringify(sf_Subject).slice(1, -1));
+ZT.setTransformData("ccAddresses", JSON.stringify(ccList));
```

### node 39 — Grade email send (script code)

```diff
--- before/node 39 content
+++ after/node 39 content
@@ -1,26 +1,25 @@
 // --- inputs -----------------------------------------------------------------
 let send = actions.send_email_simple_int;
+let responseCode = send._zt_meta.response.code;
+let callSucceeded = responseCode >= 200 && responseCode < 300;
 let sf_Topic__c = ZT.getVariableValue("sf_Topic__c", "");
 let sf_Sub_Topic__c = ZT.getVariableValue("sf_Sub_Topic__c", "");
-let html_body = ZT.getVariableValue("HtmlBody", "");
 
-// --- grade: emailSimple result (array root is wrapped under .value) or HTTP error body --
-let result = [].concat(send.value || send)[0] || {};
-let emailSent = result.actionName === "emailSimple" && result.isSuccess === true;
-let errorEmailMessage = "";
-if (!emailSent) {
-  // _zt_meta.response.body is set only on a non-2xx, and a transport-level failure can
-  // leave _zt_meta absent entirely - read it defensively so a failed send lands on
-  // screen 43 with the reason instead of throwing here and hiding it.
-  let meta = send._zt_meta || {};
-  let rawBody = (meta.response && meta.response.body) || "";
-  let errors = [].concat(result.errors || []);
-  if (errors.length && errors[0].message) {
-    errorEmailMessage = errors[0].message;
-  } else if (rawBody) {
-    errorEmailMessage = typeof rawBody === "string" ? rawBody : JSON.stringify(rawBody);
-  } else {
-    errorEmailMessage = "Email failed with no error message.";
+// Node 36 escaped HtmlBody for its quoted position in the request body. Reverse that
+// here so the summary shows the reply the way the customer received it.
+let html_body = JSON.parse("\"" + ZT.getVariableValue("HtmlBody", "") + "\"");
+
+// --- grade the send -----------------------------------------------------------
+// Two ways this fails: a non-2xx from Salesforce, or a 2xx whose composite result says
+// isSuccess false. Only a 2xx carries a result to read; a non-2xx carries the raw body.
+let emailSent = false;
+let errorEmailMessage = "Salesforce returned status " + responseCode + ". " + send._zt_meta.response.body;
+if (callSucceeded) {
+  let result = send.value[0];
+  emailSent = result.isSuccess === true;
+  errorEmailMessage = "";
+  if (!emailSent) {
+    errorEmailMessage = result.errors[0].message;
   }
 }
 
```

### node 48 — claude.md (content)

```diff
--- before/node 48 content
+++ after/node 48 content
@@ -47,10 +47,11 @@
 
 Homecharge lane
 18 AI       Detect Homecharge intent     automate_hc_email_intent_int (98) -> 19
-19 Script   Grade intent + validation     email_intent, the 7-intent map, the per-intent
-                                         check lists, hc_validation_html -> 20
+19 Script   Grade intent + validation     email_intent, ai_exception_reason, the 7-intent map,
+                                         the per-intent check lists, the screen 21 drivers and
+                                         option lists, hc_validation_html -> 20
 20 Scoring  Email analysis route         escalation -> 27; in_scope -> 21; else 29
-21 Content  Requester type + validation  zt-data inputs staged by node 19 -> 22
+21 Content  Requester type + validation  native conditional fields + guidance HTML -> 22
 22 Script   Evaluate validation          reads node 19's check lists -> hc_agent_required,
                                          escalate_reason -> 23
 23 Scoring  Agent required?              true -> 27; else 24
@@ -72,7 +73,7 @@
 33 Content  Make manual changes          Send -> 34
 34 Scoring  Mock mode?                   is_mock_run == true -> 36; else 35
 35 Data     Get incoming email addresses get_incoming_email_addresses_int (1265) -> 36
-36 Script   Stage CC list                transforms.ccAddresses -> 37
+36 Script   Prepare email request        ccAddresses, escaped HtmlBody / sf_Subject -> 37
 37 Scoring  Mock mode before send?       is_mock_run == true -> 39; else 38
 38 Data     Send email to customer       send_email_simple_int (1266) -> 39
 39 Script   Grade email send             emailSent, errorEmailMessage, email_sent_summary_html -> 40
@@ -93,25 +94,43 @@
 Test Mode seeds the same names itself.
 - is_mock_run (boolean, Test Mode only) - routers 3/31/34/37 skip the Data nodes when true.
 - ai_account_eligibility (bool), ai_bypass_reason - node 6 -> router 7, screen 9.
+- sentiment and confidence_score look unread to the lint and are not. sentiment is merged into
+  the GENERATION AI Actions' own context ("Customer Sentiment: ${sentiment}"), outside this
+  export; confidence_score is printed by the dashboard scripts 17 and 26. Neither is dead.
 - queue_source_value - the raw Last_Owner_Queue_Name__c value, printed on screen 11.
 - queue_route - "fast_admin" | "homecharge" | "" - the only thing router 10 branches on.
-- queue_route_label, queue_routes_known - node 8, display and reporting.
+- queue_route_label - node 8, display. queue_routes_known is gone; nothing read it.
 - email_intent (comma string), sentiment, escalate_reason, confidence_score, email_analysis_route -
   node 13 on the FAST Admin lane, node 19 on the Homecharge lane. Only one lane runs per session,
   so the two lanes share these names without colliding.
-- unmatched_summary - node 19 (Homecharge only); blank on the FAST Admin lane, where screen 29 and
-  node 27 render nothing for it.
+- ai_exception_reason - the intent AI Action's own account of why a case was not handled
+  automatically, written by node 13 (FAST Admin) or node 19 (Homecharge). "" whenever the Action
+  mapped an in-scope intent and did not escalate; otherwise one sentence naming what the customer
+  actually asked for. Printed on screen 29 and, by node 27, on screen 28. Nothing in the tree
+  infers a reason from the route - if the wording is wrong, the prompt is what changes. Replaces
+  unmatched_summary and the drop-off logging that was considered alongside it.
 - hc_salesforce_by_intent - THE Homecharge intent -> Topic / Sub Topic map, declared in node 19
   and parsed by node 26. Sub Topic doubles as the label every screen prints, so a new Phase 1 use
   case is one row here and nothing anywhere else.
 - hc_variant_labels - flat variant key -> label map, declared in node 19, parsed by node 26.
-- hc_required_checks (JSON array), hc_blocking_checks (JSON object, check name -> escalation
-  reason) - the checks THIS case needs, resolved in node 19 from the per-intent maps and read
-  back by node 22. Both are empty for Compatible Chargers and Resent Onboarding Email.
-- hc_validation_html - node 19 -> screen 21.
+- hc_required_checks (JSON array of check names), hc_blocking_checks (JSON array of
+  { name, reason }) - the checks THIS case needs, resolved in node 19 from the per-intent maps
+  and read back by node 22. Both are empty for Compatible Chargers and Resent Onboarding Email.
+- hc_validation_html - node 19 -> screen 21. GUIDANCE ONLY (detected intents, the AI's
+  suggestions, what ticking means). Every input on that screen is a native field.
+- hc_requester_options, hc_variant_options - node 19 -> the two native dynamic selects on screen
+  21, each an array of {label, value} with the AI's suggestion FIRST. Transforms because a native
+  dynamic select is one of the two things a transform is for. hc_variant_options is [] when the
+  detected intent has no variant group, and the field is hidden anyway.
+- hc_has_variant, hc_ask_sender_validated, hc_ask_pairing_checked, hc_ask_account_unlocked,
+  hc_ask_screenshots_attached - "yes"/"no" drivers written by node 19 and read ONLY by the
+  config.conditional on the matching field of screen 21. One driver per question; node 19's
+  checkDrivers map is where a new check gets wired.
 - hc_requester_type, hc_response_variant, hc_sender_validated, hc_pairing_checked,
-  hc_screenshots_attached, hc_account_unlocked - screen 21 inputs. hc_response_variant covers
-  hc_tariff_update and hc_payment_query; the select only renders for an intent that has a group.
+  hc_screenshots_attached, hc_account_unlocked - screen 21 answers. The four checks are required
+  Yes/No selects, so node 22 reads "Yes" or "No" and never an absent value. hc_response_variant
+  covers hc_tariff_update and hc_payment_query; its select renders only when hc_has_variant is
+  "yes".
 - hc_agent_required (bool) - node 22 -> router 23.
 - sf_Origin ("Zingtree AI"), hc_template_key, hc_copy_approved - nodes 15 / 24.
 - hc_manual_changes_required (bool), hc_manual_changes_reason - node 24. The boolean is router
@@ -123,10 +142,16 @@
 - HtmlBody, sf_Topic__c, sf_Sub_Topic__c, has_multiple_intents, case_review_html,
   request_form_html, multiple_subtopics_form_html - node 17 or 26. The first three are overwritten
   by the zt-data inputs on screens 32/33. ai_feedback / ai_feedback_comments come from the widget.
-- transforms.ccAddresses - node 36, an array of CC addresses split out of the inbound
-  EmailMessage.CcAddress. The ONLY thing node 36 stages. Connected Object 187 owns the request
-  body and merges it bare (unquoted), so it must always be a valid JSON array - [] when there
-  is no CC list, never null and never absent.
+- transforms.ccAddresses - node 36, the CC list as JSON TEXT ("[]" or
+  '["a@b.com","c@d.com"]'), split out of the inbound EmailMessage.CcAddress. Connected Object 187
+  owns the request body and merges this one bare (unquoted), so it must always be valid JSON on
+  its own - "[]" when there is no CC list, never null and never absent.
+- HtmlBody, sf_Subject at node 36 - rewritten in place, escaped for their QUOTED positions in
+  that same body ("emailSubject": "${sf_Subject}", "emailBody": "${HtmlBody}"). JSON.stringify
+  then slice the outer quotes off, which is what the UK source of truth does. A drafted reply
+  carries quotes in every class and href attribute. Node 36 runs after screens 30 and 33, so it
+  covers an agent's edits too - but that also means re-entering node 36 in one session would
+  escape twice. Nothing routes back to it today.
 - emailSent ("true"/"false"), errorEmailMessage, email_sent_summary_html - node 39.
 - test_intent, test_subject, test_email, test_example_body, test_example_email_html - test only.
 actions.*: sfdc_int__case_email_ai.records[0] (Case), get_account_details__int.records[0] (Account),
@@ -233,13 +258,31 @@
   field does not reliably render markup: on the Homecharge validation screen (21) the select
   survived but the checkbox inputs were dropped, leaving the three checklist labels as one run
   of text and blocking the agent on a required field (live, org 123, 2026-09-15, case
-  500Ad00000cvWYMIA2). The UK source of truth tree 619153300 is the proof: every block it
+  500Ad00000cvWYMIA2). Screen 21 no longer renders inputs at all - see the native-fields rule
+  below - so that failure mode cannot come back there, but the rule still governs every other
+  block this tree renders. The UK source of truth tree 619153300 is the proof: every block it
   renders - case_review_html, requestFormHtml, multipleSubtopicsFormHtml,
   email_sent_summary_html - is a transform, and only HtmlBody, which is a payload value rather
   than a screen, is form data. The three-tree merge moved all seven of this tree's blocks to
   form data; 2026-09-15 moved them back. The seven pairs: 17/26 -> 30, 17/26 -> 33, 17/26 -> 32,
   19 -> 21, 27 -> 28, 39 -> 41, 45 -> 46. Plain scalars printed on a screen
-  (queue_source_value, ai_bypass_reason, unmatched_summary, errorEmailMessage) stay form data.
+  (queue_source_value, ai_bypass_reason, ai_exception_reason, errorEmailMessage) stay form data.
+- AN AI ACTION RESPONSE CARRIES NO _zt_meta. Only Connected Object responses are decorated
+  with it (proved live in Test Mode, 2026-09-15: the three CO responses in the session data each
+  carry _zt_meta.response.code, automate_hc_email_intent_int carries none, and reading
+  intent._zt_meta.response.code threw "cannot read undefined 'response'"). So the two kinds of
+  call are graded differently, and neither one guesses:
+    Connected Object - node 39 reads send._zt_meta.response.code and only looks at the composite
+    result on a 2xx.
+    AI Action - nodes 13 and 19 test whether the output field they need is there
+    (intent.email_intent !== undefined). A response without it never ran, and it must not read as
+    "no intent matched" on screen 29 - it routes to escalation with ai_exception_reason saying the
+    check returned no result.
+  Nothing infers success from the shape of a payload - there are no [].concat(x || []) stand-ins
+  for "did this return anything".
+- Node 36 escapes HtmlBody IN PLACE, so everything downstream of it sees the payload form, not
+  the reply. Node 39 reverses it with JSON.parse before rendering the summary. Any new consumer
+  of HtmlBody after node 36 has to do the same.
 - Every *_html string is still collapsed to one line before it is stored - newlines in a merge
   field have rendered as <br> and broken the grid layouts (seen live 2026-09-11).
 - Scoring nodes carry advanced_logic_node "1" and mark their else branch with op "def". With
@@ -255,6 +298,18 @@
   prompt and flagged on the dashboard through hc_copy_approved. See OPEN ITEM #3.
 - Edison and Chargelink have no integration. Screen 21 records the agent's attestation; anything
   unticked routes to the escalation notice rather than drafting a reply.
+- SCREEN 21'S INPUTS ARE NATIVE FIELDS, NOT DYNAMIC HTML. The requester and the approved-reply
+  selects are native dynamic selects reading transforms.hc_requester_options /
+  transforms.hc_variant_options; each Edison / Salesforce check is a required native Yes/No
+  select shown by config.conditional on its hc_ask_* driver. This replaced zt-data checkbox
+  markup that rendered without its tick boxes on roughly every other case tested, leaving a
+  mandatory field unanswerable. Three reasons it stays native: a zt-data input cannot enforce
+  required, an unticked checkbox does not read back reliably through getVariableValue, and the
+  markup is no longer ours to get dropped. A required conditional field is safe - required only
+  bites once the field renders. Dynamic HTML on this screen is display text only.
+- Adding a check is three edits, all of them declarative: a row in requiredChecksByIntent (or
+  blockingChecksByIntent), a row in checkDrivers, and one native field on screen 21 carrying the
+  question text and its conditional. Node 22 never changes - it reads the resolved lists.
 - The validation checklist is per intent, not global. requiredChecksByIntent in node 19 decides
   what screen 21 asks for. Compatible Chargers and Resent Onboarding Email take no account-level
   action and their use case documents carry no step 3, so they ask for nothing and the Validation
@@ -273,6 +328,29 @@
   points at. Importing it as a new tree means updating the layout.
 
 ## Changelog
+- 2026-09-16 Claude - every call now graded, each in the way its own response allows: node 39 on
+  send._zt_meta.response.code, nodes 13 and 19 on whether the AI Action returned email_intent.
+  AI Action responses carry no _zt_meta - grading them on it threw live in Test Mode - and the
+  scripts rewritten in plain loops and direct object traversal: no [].concat(x || [])
+  coercion, no Object.keys / reduce / Set / spread, no per-node arrow helpers where a loop reads
+  better. variantGroups became a list of groups and hc_blocking_checks a list of { name, reason },
+  so both are walked rather than keyed apart. Node 39 also reverses node 36's escaping before it
+  renders the reply.
+- 2026-09-15 Claude - ai_exception_reason: the intent AI Actions (93 FAST Admin, 98 Homecharge,
+  org 605565) now return one field saying why a case was not handled automatically - "" when an
+  in-scope intent mapped and nothing escalated, otherwise a sentence naming what the customer
+  actually asked for, including a topic that is not on the intent list. Nodes 13 and 19 stage it,
+  node 27 prints it on the escalation notice and screen 29 prints it directly. unmatched_summary
+  is gone from the tree and from AI Action 98's prompt. This is deliberately the AI Action's job
+  rather than the workflow's: no drop-off logging, no per-node breadcrumbs.
+- 2026-09-15 Claude - screen 21 rebuilt as native conditional fields. Node 19 now stages guidance
+  HTML plus five "yes"/"no" drivers and two option-list transforms; screen 21 carries six native
+  fields (two dynamic selects, four required Yes/No selects gated on their driver); node 22 reads
+  "Yes" instead of a checkbox value. Fixes the tick boxes that were not rendering for the
+  Homecharge validation checklist, and makes the required checks actually enforceable.
+- 2026-09-15 Claude - node 36 brought back in line with the UK org's email API request schema:
+  HtmlBody and sf_Subject escaped for their quoted positions, ccAddresses staged as JSON text
+  ("[]" when there is no CC list). Renamed Prepare email request.
 - 2026-09-15 Claude - demoted to sandbox org 605565. Connected Objects 10 / 20 / 23 / 187 ->
   1263 / 1264 / 1265 / 1266, all type http; AI Actions node 12 16->93, node 16 15->94,
   node 18 19->98, node 25 18->99; org_id 123->605565; root_node_id 2->1, which puts the Start
```

## CHANGES THAT NEED AN EXPLANATION

Every line below must map to a requirement or an explicit request.
Anything unexplained is unintended drift — revert it before delivering.

  [ ] node 8 — script code changed (22 → 21 lines) — Resolve queue route
  [ ] node 13 — script code changed (16 → 41 lines) — Grade intent result
  [ ] node 19 — node_name: "Reads the intent AI Action; sets email_intent, route, and builds" → "Reads the intent AI Action; sets email_intent, route, ai_exception_reason, the per-intent check drivers and the screen 21 option lists"
  [ ] node 19 — script code changed (150 → 211 lines) — Grade intent and build validation screen
  [ ] node 21 — node_name: "Agent confirms who sent the email, the tariff response, and the " → "Agent confirms who sent the email, the approved reply and the Edison / Salesforce checks this intent needs"
  [ ] node 21 — form field added: hc_requester_type (select)
  [ ] node 21 — form field added: hc_response_variant (select)
  [ ] node 21 — form field added: hc_sender_validated (select)
  [ ] node 21 — form field added: hc_pairing_checked (select)
  [ ] node 21 — form field added: hc_account_unlocked (select)
  [ ] node 21 — form field added: hc_screenshots_attached (select)
  [ ] node 22 — script code changed (21 → 36 lines) — Evaluate validation
  [ ] node 24 — script code changed (28 → 35 lines) — Set case origin and template key
  [ ] node 27 — script code changed (23 → 25 lines) — Build escalation notice
  [ ] node 29 — content changed (156 → 158 characters) — Case is not automated
  [ ] node 36 — page_title: "Stage CC list" → "Prepare email request"
  [ ] node 36 — node_name: "Stages transforms.ccAddresses for the send_email_simple_int body" → "Escapes HtmlBody and sf_Subject and stages ccAddresses for the send_email_simple_int body"
  [ ] node 36 — script code changed (22 → 36 lines) — Prepare email request
  [ ] node 39 — node_name: "Sets emailSent / errorEmailMessage from the send response and bu" → "Grades the send on the response code, then the composite result; builds the summary screen"
  [ ] node 39 — script code changed (61 → 60 lines) — Grade email send
  [ ] node 48 — content changed (350 → 428 lines) — claude.md

