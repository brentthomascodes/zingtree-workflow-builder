========================================================================
WORKFLOW DIFF — Email Automation - AI Actions INT
========================================================================

Before : Email Automation - AI Actions INT (6 Oct INT release 2026-10-05).json  (61 nodes)
After  : Email Automation - AI Actions INT (new FAST use cases + guardrail 2026-10-05).json  (64 nodes)

## PLAIN SUMMARY

53 of 64 nodes are byte-for-byte identical to the original (83% untouched).
3 nodes added, 0 removed, 0 renumbered, 8 modified.

In plain terms:
  + NEW      node 62 — Part of this request was not recognised [Content]
  + NEW      node 63 — Regenerate in which lane? [Scoring]
  + NEW      node 64 — Keep the draft as it is [Script]
  * CHANGED  node 13 — Grade intent result [Script]
               - script code changed (41 → 43 lines) — Grade intent result
  * CHANGED  node 17 — Build case review dashboard [Script]
               - script code changed (288 → 310 lines) — Build case review dashboard
               - continuation_node_id: 54 → 52 — Build case review dashboard
  * CHANGED  node 19 — Grade intent and build validation screen [Script]
               - script code changed (204 → 206 lines) — Grade intent and build validation screen
  * CHANGED  node 26 — Build case review dashboard [Script]
               - script code changed (290 → 310 lines) — Build case review dashboard
  * CHANGED  node 44 — Test mode - pick a scenario [Content]
               - form field settings changed (same field names)
  * CHANGED  node 45 — Load example email [Script]
               - script code changed (158 → 178 lines) — Load example email
  * CHANGED  node 48 — claude.md [Content]
               - content changed (742 → 765 lines) — claude.md
  * CHANGED  node 52 — Which dashboard? [Scoring]
               - node_name: "Picks the dashboard for the reply: after node 26, and when the feedback Submit returns the agent to the screen they were on. GDPR -> 55, FAST -> 54, missing charges -> 53, else 30" → "Part of the request not recognised -> 62; otherwise the dashboard for the reply (GDPR -> 55, FAST -> 54, missing charges -> 53, else 30). Reached from 17, 26, screen 62 and every dashboard's feedback Submit"
               - button added/changed: "unrecognised_review_needed == "true"" → node 62 [logic: unrecognised_review_needed == "true"]
               - button added/changed: "ai_reply_is_gdpr == true" → node 55 [logic: ai_reply_is_gdpr == true]
               - button added/changed: "queue_route == "fast_admin"" → node 54 [logic: queue_route == "fast_admin"]
               - button added/changed: "hc_show_screenshots_stop == true" → node 53 [logic: hc_show_screenshots_stop == true]
               - button added/changed: "" → node 30
               - button removed/replaced: "ai_reply_is_gdpr == true" → node 55
               - button removed/replaced: "queue_route == "fast_admin"" → node 54
               - button removed/replaced: "hc_show_screenshots_stop == true" → node 53
               - button removed/replaced: "" → node 30

## TREE SHAPE

  node type                before    after    delta
  AI_Action                     5        5       +0
  Content                      23       24       +1
  Data                          4        4       +0
  Email                         1        1       +0
  Scoring                      12       13       +1
  Script                       16       17       +1
  TOTAL                        61       64       +3

  Root node unchanged (node 2).

## STRUCTURAL SANITY

  No broken links introduced.
  No nodes became unreachable.
  Pre-existing in the BEFORE tree (not caused by this edit): 0 broken link(s), 6 unreachable node(s).

## UNTOUCHED NODES (53)

  1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 14, 15, 16, 18, 20, 21, 22, 23, 24, 25, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 46, 47, 49, 50, 51, 53, 54, 55, 56, 57, 58, 59, 60, 61

## TREE-LEVEL SETTINGS CHANGED (0)

  (none)

## COSMETIC / EDITOR-ONLY CHANGES (0) — ignore

  (none)

## LINE-LEVEL BODY DIFFS (6)

### node 13 — Grade intent result (script code)

```diff
--- before/node 13 content
+++ after/node 13 content
@@ -39,3 +39,5 @@
 ZT.setFormData("confidence_score", confidence_score);
 ZT.setFormData("ai_exception_reason", ai_exception_reason);
 ZT.setFormData("email_analysis_route", email_analysis_route);
+// A new intent read starts with nothing added by the agent (screen 62).
+ZT.setFormData("agent_added_request", "");
```

### node 17 — Build case review dashboard (script code)

```diff
--- before/node 17 content
+++ after/node 17 content
@@ -6,6 +6,8 @@
 let sf_CaseNumber = ZT.getVariableValue("sf_CaseNumber", "");
 let selected_topic = ZT.getVariableValue("sf_Topic__c", "");
 let selected_subtopic = ZT.getVariableValue("sf_Sub_Topic__c", "");
+let ai_exception_reason = ZT.getVariableValue("ai_exception_reason", "");
+let agent_added_request = ZT.getVariableValue("agent_added_request", "");
 
 // --- shared helpers -----------------------------------------------------------
 const escapeHtml = value => String(value == null ? "" : value)
@@ -38,7 +40,9 @@
   forgotten_password:          { topic: "Online",     subtopic: "Forgotten Password" },
   lost_or_stolen_card:         { topic: "Online",     subtopic: "Lost & Stolen" },
   account_unlock:              { topic: "Online",     subtopic: "Account Unlock" },
-  add_update_contact_details:  { topic: "Not Online", subtopic: "Add/Update Contact Details" }
+  add_update_contact_details:  { topic: "Not Online", subtopic: "Add/Update Contact Details" },
+  card_group_move:             { topic: "Not Online", subtopic: "Card Group/Moves" },
+  returned_direct_debit:       { topic: "Fee",        subtopic: "Returned direct debit" }
 };
 const intentKeys = Object.keys(salesforceByIntent);
 // Topic -> Sub Topic pairs the manual-changes form offers, taken from this same map so every
@@ -147,6 +151,7 @@
             ${renderRow("Case Number", sf_CaseNumber)}
             ${renderRow("Customer Request", detectedLabels.join(", "))}
             ${renderRow("Requester Email", sfCase.SuppliedEmail)}
+            ${agent_added_request ? renderRow("Added by agent", agent_added_request) : ""}
           </div>
           <div class="case-review-card">
             <h3 class="case-review-card-title">Subtopics found</h3>
@@ -168,6 +173,21 @@
   </div>
 </div>`.trim();
 let case_review_html = renderCaseReview(email_response);
+
+// --- part of the request not recognised (screen 62) ----------------------------------
+// On an in-scope case ai_exception_reason is empty unless the intent AI Action mapped some
+// requests and could not map another; it then names the part it did not recognise. The agent
+// reviews the draft on screen 62 and types what is missing; the reply is then regenerated with
+// agent_added_request in the generation AI Action's context, and this node runs again.
+let unrecognised_review_needed = ai_exception_reason !== "" && agent_added_request === "";
+let unrecognised_review_html = `
+<div class="case-review-card" style="background:#fffbeb;border-color:#fde68a;">
+  <h3 class="case-review-card-title">Part of this request was not recognised</h3>
+  <p>Not all elements of this customer request have been matched to a recognised intent. Please review the draft response and add any missing information before generating the final email.</p>
+  <p><strong>Recognised:</strong> ${escapeHtml(detectedLabels.join(", "))}</p>
+  <p><strong>Not recognised:</strong> ${escapeHtml(ai_exception_reason)}</p>
+</div>
+${case_review_html}`;
 
 // --- manual-changes form (Topic + Subtopic + editable HTML body) -----------------
 const buildOptions = (options, selectedValue, placeholder) =>
@@ -272,6 +292,8 @@
 // after the 1-hour transforms TTL. The two forms carry zt-data inputs and stay transforms.
 const compact = html => html.replace(/\s*\n\s*/g, " ");
 ZT.setFormData("case_review_html", compact(case_review_html));
+ZT.setFormData("unrecognised_review_needed", unrecognised_review_needed ? "true" : "false");
+ZT.setFormData("unrecognised_review_html", compact(unrecognised_review_html));
 ZT.setTransformData("request_form_html", compact(request_form_html));
 ZT.setTransformData("multiple_subtopics_form_html", compact(multiple_subtopics_form_html));
 // GDPR templates, still carrying _NAMES_; node 57 fills them only if the agent picks GDPR.
```

### node 19 — Grade intent and build validation screen (script code)

```diff
--- before/node 19 content
+++ after/node 19 content
@@ -195,6 +195,8 @@
 ZT.setFormData("confidence_score", confidence_score);
 ZT.setFormData("ai_exception_reason", ai_exception_reason);
 ZT.setFormData("email_analysis_route", email_analysis_route);
+// A new intent read starts with nothing added by the agent (screen 62).
+ZT.setFormData("agent_added_request", "");
 ZT.setFormData("hc_salesforce_by_intent", JSON.stringify(salesforceByIntent));
 ZT.setFormData("hc_variant_labels", JSON.stringify(variantLabels));
 ZT.setFormData("hc_requester_type", hc_requester_type);
```

### node 26 — Build case review dashboard (script code)

```diff
--- before/node 26 content
+++ after/node 26 content
@@ -6,6 +6,8 @@
 let sf_CaseNumber = ZT.getVariableValue("sf_CaseNumber", "");
 let selected_topic = ZT.getVariableValue("sf_Topic__c", "");
 let selected_subtopic = ZT.getVariableValue("sf_Sub_Topic__c", "");
+let ai_exception_reason = ZT.getVariableValue("ai_exception_reason", "");
+let agent_added_request = ZT.getVariableValue("agent_added_request", "");
 let requester_type = ZT.getVariableValue("hc_requester_type", "driver");
 let response_variant = ZT.getVariableValue("hc_response_variant", "");
 let copy_approved = ZT.getVariableValue("hc_copy_approved", true);
@@ -170,6 +172,7 @@
             ${renderRow("Customer Request", detectedLabels.join(", "))}
             ${renderRow("Requester Email", sfCase.SuppliedEmail)}
             ${renderRow("Sent by", requesterLabels[requester_type])}
+            ${agent_added_request ? renderRow("Added by agent", agent_added_request) : ""}
             ${response_variant ? renderRow("Response variant", variantLabels[response_variant]) : ""}
           </div>
           <div class="case-review-card">
@@ -193,6 +196,21 @@
     </div>
   </div>
 </div>`.trim();
+
+// --- part of the request not recognised (screen 62) ----------------------------------
+// On an in-scope case ai_exception_reason is empty unless the intent AI Action mapped some
+// requests and could not map another; it then names the part it did not recognise. The agent
+// reviews the draft on screen 62 and types what is missing; the reply is then regenerated with
+// agent_added_request in the generation AI Action's context, and this node runs again.
+let unrecognised_review_needed = ai_exception_reason !== "" && agent_added_request === "";
+let unrecognised_review_html = `
+<div class="case-review-card" style="background:#fffbeb;border-color:#fde68a;">
+  <h3 class="case-review-card-title">Part of this request was not recognised</h3>
+  <p>Not all elements of this customer request have been matched to a recognised intent. Please review the draft response and add any missing information before generating the final email.</p>
+  <p><strong>Recognised:</strong> ${escapeHtml(detectedLabels.join(", "))}</p>
+  <p><strong>Not recognised:</strong> ${escapeHtml(ai_exception_reason)}</p>
+</div>
+${case_review_html}`;
 
 // --- manual-changes form (Topic + Subtopic + editable HTML body) -----------------
 const buildOptions = (options, selectedValue, placeholder) =>
@@ -269,6 +287,8 @@
 const compact = html => html.replace(/\s*\n\s*/g, " ");
 // Display only, so form data: it survives a session reopened after the 1-hour transforms TTL.
 ZT.setFormData("case_review_html", compact(case_review_html));
+ZT.setFormData("unrecognised_review_needed", unrecognised_review_needed ? "true" : "false");
+ZT.setFormData("unrecognised_review_html", compact(unrecognised_review_html));
 ZT.setTransformData("request_form_html", compact(request_form_html));
 ZT.setTransformData("multiple_subtopics_form_html", compact(multiple_subtopics_form_html));
 // A new draft starts with no feedback recorded. script_code's feedback widget writes the
```

### node 45 — Load example email (script code)

```diff
--- before/node 45 content
+++ after/node 45 content
@@ -139,6 +139,26 @@
     subject: "This is not good enough",
     body: "Hello,\n\nThis is the fourth time I have emailed about my missing charges and nobody has come back to me. I am extremely unhappy and want to raise a formal complaint. I am out of pocket by over 200 pounds.\n\nNeil Prescott"
   },
+  test_fast_admin_returned_direct_debit: {
+    subject: "Returned direct debit fee",
+    body: "Hello,\n\nWhy is there a 99 pound fee added to my account? I have just seen it on my latest statement and I would like you to explain my returned direct debit fee.\n\nRegards,\nMartin Hughes\nHughes Haulage Ltd"
+  },
+  test_fast_admin_card_group_move: {
+    subject: "Moving a card to another group",
+    body: "Hi,\n\nOne of our drivers has moved depots. Can you move a card from one group to another for me? The card ending 6612 needs to go from the North group to the Midlands group.\n\nThanks,\nClaire Booth\nFleet Coordinator"
+  },
+  test_fast_admin_card_group_error: {
+    subject: "Error moving a card group",
+    body: "Hello,\n\nI am having an issue moving card group online. Every time I try to change the group for the card ending 6612 I get an error and nothing saves.\n\nRegards,\nClaire Booth"
+  },
+  test_fast_admin_partial_unrecognised: {
+    subject: "PIN reminder and a fuel price question",
+    body: "Hi,\n\nTwo things please. Our driver has forgotten his PIN for the card ending 9082, can you send a PIN reminder? Also, can you tell me why the diesel price at the Shell site in Leeds was higher than the price shown on your site locator last week?\n\nThanks,\nCraig Dunn"
+  },
+  test_hc_partial_unrecognised: {
+    subject: "Password and a question about my charger",
+    body: "Hi,\n\nI have forgotten my password and need a password reset please. Also, can my charger be moved to my new garage when I move house next month?\n\nThanks,\nOwen Bradshaw"
+  },
   test_hc_other_out_of_scope: {
     subject: "Public charging query",
     body: "Hi,\n\nDoes my Homecharge account also cover public charging points, and can I use it abroad in France next month?\n\nThanks,\nEllie Marsh"
```

### node 48 — claude.md (content)

```diff
--- before/node 48 content
+++ after/node 48 content
@@ -26,7 +26,7 @@
 Payment Query and Resent Onboarding Email are OUT of INT and come back through the release
 management cadence, one release at a time.
 
-## Architecture (56 nodes + this one)
+## Architecture (59 nodes + this one)
 
 Shared front end - runs once, whichever journey follows
 1  Content  Start (root)                -> 2 live / 44 Test Mode
@@ -97,7 +97,12 @@
 29 Content  Case is not automated        terminal
 
 Shared tail - both lanes converge here
-52 Scoring  Which dashboard?             ai_reply_is_gdpr -> 55; fast_admin -> 54;
+62 Content  Part of request not          ${unrecognised_review_html} (notice + the draft) and native
+            recognised                   agent_added_request; Generate -> 63; Continue -> 64
+64 Script   Keep the draft as it is      unrecognised_review_needed "false" -> 52
+63 Scoring  Regenerate in which lane?    homecharge -> 25; else 16 (17 / 26 then rebuild the draft)
+52 Scoring  Which dashboard?             unrecognised_review_needed == "true" -> 62;
+                                         ai_reply_is_gdpr -> 55; fast_admin -> 54;
                                          hc_show_screenshots_stop -> 53; else 30. Reached from 26 and
                                          from every dashboard's hidden "Submit feedback" button
 30 Content  Case review dashboard        Homecharge only since 2026-09-24; score_var ai_suggested_email; native ai_feedback +
@@ -223,6 +228,13 @@
 - escalation_html - node 27 -> screen 28 (form data, survives a reopened session).
 - session_expired (bool) - node 36: transforms.request_form_html gone (the dashboard is over an
   hour old), the case response gone from actions, or HtmlBody empty. Router 37 -> screen 61.
+- unrecognised_review_needed ("true" | "false") - nodes 17 / 26: ai_exception_reason is set on an
+  in-scope case (the intent AI Action mapped some requests and named one it could not) and the
+  agent has not added anything yet. Node 64 sets "false" when the agent keeps the draft.
+- agent_added_request - native multiline on screen 62; reset to "" by nodes 13 / 19 on every
+  intent read; merged into the generation AI Actions' context (15 / 18) and printed on the
+  dashboard as "Added by agent".
+- unrecognised_review_html - nodes 17 / 26 -> screen 62 (form data).
 - ai_reply_is_gdpr (bool) - false from node 17, true from node 57; router 52 reads it to send
   the feedback Submit back to the GDPR dashboard (55) rather than 54.
 - HtmlBody, sf_Topic__c, sf_Sub_Topic__c, has_multiple_intents, case_review_html,
@@ -481,6 +493,17 @@
   points at. Importing it as a new tree means updating the layout.
 
 ## Changelog
+- 2026-10-05 Claude - UAT after the 8 Oct PROD release (Charley Gunning, 5 Oct, "New use cases to be
+  built"). FAST Admin: card_group_move (Not Online / Card Group/Moves) and returned_direct_debit
+  (Fee / Returned direct debit) rows in node 17; Test Mode scenarios test_fast_admin_returned_direct_debit,
+  _card_group_move, _card_group_error, _partial_unrecognised, test_hc_partial_unrecognised. Guardrail
+  (Managing Multi-Intent Requests with Unrecognised Intents, tracker 18): 17 now -> router 52 like 26;
+  52's first test sends a partly-recognised case to new screen 62 (Corpay's agent prompt verbatim,
+  the draft, native agent_added_request); Continue -> new script 64 -> 52; Generate -> new router 63 -> the lane's generation AI
+  Action -> 17 / 26 -> dashboard. Needs the AI Action prompt patches in
+  corpay-uk-ai-action-patches-2026-10-05.md (16, 15, 19, 18) before it does anything: until the
+  intent prompts stop escalating a partial match under RULE 3, ai_exception_reason stays empty on
+  in-scope cases and screen 62 never shows. Nodes 13, 17, 19, 26, 44, 45, 52, 62, 63, 64 (new), 48.
 - 2026-10-05 Claude - INT release for 6 Oct testing (standups 1 + 5 Oct, Charley's 5 Oct summary).
   (1) Display HTML moved from transforms to form data so reopened sessions still render (PROD
   blank node 28): nodes 17, 19, 26, 27, 39, 50, 57 write it; screens 21, 28, 30, 41, 51, 53, 54,
```

## CHANGES THAT NEED AN EXPLANATION

Every line below must map to a requirement or an explicit request.
Anything unexplained is unintended drift — revert it before delivering.

  [ ] added node 62 (Part of this request was not recognised)
  [ ] added node 63 (Regenerate in which lane?)
  [ ] added node 64 (Keep the draft as it is)
  [ ] node 13 — script code changed (41 → 43 lines) — Grade intent result
  [ ] node 17 — script code changed (288 → 310 lines) — Build case review dashboard
  [ ] node 17 — continuation_node_id: 54 → 52 — Build case review dashboard
  [ ] node 19 — script code changed (204 → 206 lines) — Grade intent and build validation screen
  [ ] node 26 — script code changed (290 → 310 lines) — Build case review dashboard
  [ ] node 44 — form field settings changed (same field names)
  [ ] node 45 — script code changed (158 → 178 lines) — Load example email
  [ ] node 48 — content changed (742 → 765 lines) — claude.md
  [ ] node 52 — node_name: "Picks the dashboard for the reply: after node 26, and when the feedback Submit returns the agent to the screen they were on. GDPR -> 55, FAST -> 54, missing charges -> 53, else 30" → "Part of the request not recognised -> 62; otherwise the dashboard for the reply (GDPR -> 55, FAST -> 54, missing charges -> 53, else 30). Reached from 17, 26, screen 62 and every dashboard's feedback Submit"
  [ ] node 52 — button added/changed: "unrecognised_review_needed == "true"" → node 62 [logic: unrecognised_review_needed == "true"]
  [ ] node 52 — button added/changed: "ai_reply_is_gdpr == true" → node 55 [logic: ai_reply_is_gdpr == true]
  [ ] node 52 — button added/changed: "queue_route == "fast_admin"" → node 54 [logic: queue_route == "fast_admin"]
  [ ] node 52 — button added/changed: "hc_show_screenshots_stop == true" → node 53 [logic: hc_show_screenshots_stop == true]
  [ ] node 52 — button added/changed: "" → node 30
  [ ] node 52 — button removed/replaced: "ai_reply_is_gdpr == true" → node 55
  [ ] node 52 — button removed/replaced: "queue_route == "fast_admin"" → node 54
  [ ] node 52 — button removed/replaced: "hc_show_screenshots_stop == true" → node 53
  [ ] node 52 — button removed/replaced: "" → node 30

