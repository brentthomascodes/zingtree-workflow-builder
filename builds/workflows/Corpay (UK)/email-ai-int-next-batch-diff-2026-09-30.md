========================================================================
WORKFLOW DIFF — Email Automation - AI Actions INT
========================================================================

Before : Email Automation - AI Actions INT (PROD release 2026-09-30).json  (58 nodes)
After  : Email Automation - AI Actions INT (next batch 2026-09-30).json  (60 nodes)

## PLAIN SUMMARY

48 of 60 nodes are byte-for-byte identical to the original (80% untouched).
2 nodes added, 0 removed, 0 renumbered, 10 modified.

In plain terms:
  + NEW      node 56 — Case is resolved or closed [Content]
  + NEW      node 60 — Format the authorised contact names [AI_Action]
  * CHANGED  node 6 — Check AI eligibility [Script]
               - script code changed (33 → 64 lines) — Check AI eligibility
  * CHANGED  node 7 — Account AI eligible? [Scoring]
               - node_name: "Route eligible cases to the queue check, everything else to the" → "Closed/resolved case -> notice, eligible -> queue check, everything else -> not eligible"
               - button added/changed: "ai_case_closed == true" → node 56 [logic: ai_case_closed == true]
               - button added/changed: "ai_account_eligibility == true" → node 8 [logic: ai_account_eligibility == true]
               - button added/changed: "" → node 9
               - button removed/replaced: "ai_account_eligibility == true" → node 8
               - button removed/replaced: "" → node 9
  * CHANGED  node 9 — Account not eligible for AI [Content]
               - node_name: "Terminal: shows why the case is not handled by the AI" → "Terminal: shows why the case is not handled by the AI, every failed rule in words"
               - content changed (472 → 480 characters) — Account not eligible for AI
  * CHANGED  node 19 — Grade intent and build validation screen [Script]
               - script code changed (201 → 204 lines) — Grade intent and build validation screen
  * CHANGED  node 44 — Test mode - pick a scenario [Content]
               - form field settings changed (same field names)
  * CHANGED  node 45 — Load example email [Script]
               - script code changed (146 → 158 lines) — Load example email
  * CHANGED  node 47 — Seed mocked Salesforce data [Script]
               - script code changed (103 → 103 lines) — Seed mocked Salesforce data
  * CHANGED  node 48 — claude.md [Content]
               - content changed (694 → 710 lines) — claude.md
  * CHANGED  node 57 — Write authorised contacts into GDPR reply [Script]
               - node_name: "Replaces _NAMES_ in node 17's GDPR form with the names from scre" → "Fills _NAMES_ in the GDPR reply with the formatted names from node 60 (as typed when the AI returns nothing)"
               - script code changed (19 → 25 lines) — Write authorised contacts into GDPR reply
  * CHANGED  node 59 — Provide the authorised contacts for this account [Content]
               - button added/changed: "Continue" → node 60
               - button removed/replaced: "Continue" → node 57

## TREE SHAPE

  node type                before    after    delta
  AI_Action                     4        5       +1
  Content                      21       22       +1
  Data                          4        4       +0
  Email                         1        1       +0
  Scoring                      12       12       +0
  Script                       16       16       +0
  TOTAL                        58       60       +2

  Root node unchanged (node 2).

## STRUCTURAL SANITY

  No broken links introduced.
  No nodes became unreachable.
  Pre-existing in the BEFORE tree (not caused by this edit): 0 broken link(s), 6 unreachable node(s).

## UNTOUCHED NODES (48)

  1, 2, 3, 4, 5, 8, 10, 11, 12, 13, 14, 15, 16, 17, 18, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 46, 49, 50, 51, 52, 53, 54, 55, 58

## TREE-LEVEL SETTINGS CHANGED (0)

  (none)

## COSMETIC / EDITOR-ONLY CHANGES (0) — ignore

  (none)

## LINE-LEVEL BODY DIFFS (7)

### node 6 — Check AI eligibility (script code)

```diff
--- before/node 6 content
+++ after/node 6 content
@@ -28,6 +28,37 @@
 
 let ai_account_eligibility = frameworkEligible && segmentEligible && administratorEligible && ai_bypass_reason === "";
 
+// --- what screen 9 tells the agent: every rule the account failed, in words -------
+// A blank Salesforce value prints as the word Blank so the agent can see the gap.
+let accountAdministrator = account.AS_Account_Administrator__c || "";
+let ai_account_admin_display = accountAdministrator !== "" ? accountAdministrator : "Blank";
+let ineligibleReasons = [];
+if (!frameworkEligible) {
+  ineligibleReasons.push("Framework is " + account.Framework__c + " - only accounts with no framework are in scope");
+}
+if (!segmentEligible) {
+  ineligibleReasons.push("Account Segment is " + account.Account_Segment__c + " - only SME, SMB, Keyfuels or blank are in scope");
+}
+if (!administratorEligible) {
+  if (accountAdministrator === "") {
+    ineligibleReasons.push("AS Account Administrator is blank - the account needs an approved administrator");
+  } else {
+    ineligibleReasons.push("AS Account Administrator " + accountAdministrator + " is not on the approved list");
+  }
+}
+let ai_ineligible_reason = ineligibleReasons.join(". ");
+
+// --- case status: the AI does not run on a resolved or closed case ---------------
+// Checked only once the account passes, so an ineligible account still shows why.
+// PLACEHOLDERS: Alex Godfrey to confirm the exact Salesforce Status picklist values for a
+// resolved and a closed case. Until they replace these two strings nothing matches, so the
+// gate never fires.
+const closedStatuses = ["PENDING_ALEX_STATUS_RESOLVED", "PENDING_ALEX_STATUS_CLOSED"];
+let ai_case_closed = ai_account_eligibility && closedStatuses.includes(sfCase.Status);
+
 // --- outputs ----------------------------------------------------------------
 ZT.setFormData("ai_account_eligibility", ai_account_eligibility);
 ZT.setFormData("ai_bypass_reason", ai_bypass_reason);
+ZT.setFormData("ai_account_admin_display", ai_account_admin_display);
+ZT.setFormData("ai_ineligible_reason", ai_ineligible_reason);
+ZT.setFormData("ai_case_closed", ai_case_closed);
```

### node 9 — Account not eligible for AI (content)

```diff
--- before/node 9 content
+++ after/node 9 content
@@ -1 +1 @@
-<p>Account Not eligible for AI</p><p><strong>Framework</strong>: ${actions.get_account_details__int.records[0].Framework__c}</p><p><strong>Account Segment</strong>: ${actions.get_account_details__int.records[0].Account_Segment__c}</p><p><strong>Account Admin</strong>: ${actions.get_account_details__int.records[0].AS_Account_Administrator__c}</p><p><strong>Acct Eligibility</strong>: ${ai_account_eligibility}</p><p><strong>Bypass reason</strong>: ${ai_bypass_reason}</p>
+<p>Account Not eligible for AI</p><p><strong>Reason</strong>: ${ai_ineligible_reason}</p><p><strong>Framework</strong>: ${actions.get_account_details__int.records[0].Framework__c}</p><p><strong>Account Segment</strong>: ${actions.get_account_details__int.records[0].Account_Segment__c}</p><p><strong>Account Admin</strong>: ${ai_account_admin_display}</p><p><strong>Acct Eligibility</strong>: ${ai_account_eligibility}</p><p><strong>Bypass reason</strong>: ${ai_bypass_reason}</p>
```

### node 19 — Grade intent and build validation screen (script code)

```diff
--- before/node 19 content
+++ after/node 19 content
@@ -15,7 +15,9 @@
   hc_tariff_update:   { topic: "HC-Online",     subtopic: "Update Energy/Tariff Information" },
   hc_password_reset:  { topic: "HC-Not Online", subtopic: "Password Reset" },
   hc_update_charger_details: { topic: "HC-Online", subtopic: "Update Charger Information" },
-  hc_payment_query:   { topic: "HC-Not Online", subtopic: "Payment Query / Review" }
+  hc_payment_query:   { topic: "HC-Not Online", subtopic: "Payment Query / Review" },
+  hc_compatible_chargers:     { topic: "HC-Not Online", subtopic: "Compatible Chargers" },
+  hc_resent_onboarding_email: { topic: "HC-Online",     subtopic: "Resent Onboarding Email" }
 };
 
 // An intent with a variant group asks the agent which approved reply fits; an intent
@@ -116,7 +118,8 @@
 // --- does screen 21 have anything to ask? ---------------------------------------
 // Per Charley's matrix, the only question asked before a reply is generated is which
 // approved reply fits (Update Tariff / Energy Supplier and Payment Query). Every other
-// intent - Missing Charges, Password Reset, Update Charger Information - goes straight to
+// intent - Missing Charges, Password Reset, Update Charger Information, Compatible Chargers,
+// Resent Onboarding Email - goes straight to
 // the drafted reply.
 if (email_analysis_route === "in_scope" && variantOptions.length === 0) {
   email_analysis_route = "in_scope_no_questions";
```

### node 45 — Load example email (script code)

```diff
--- before/node 45 content
+++ after/node 45 content
@@ -75,6 +75,10 @@
     subject: "Invoices for our account",
     body: "Hi,\n\nI've just joined the finance team at Northgate Plumbing. Please can you send me copies of the last three invoices for our Allstar account?\n\nThanks,\nPriya Shah\nFinance Assistant"
   },
+  test_fast_admin_case_resolved: {
+    subject: "Active card list request",
+    body: "Hi,\n\nCould you please send me my active card list for account 02716246?\n\nThanks,\nSarah Jenkins\nFleet Administrator, Northgate Plumbing Ltd"
+  },
   test_hc_password_reset: {
     subject: "Can't log in to my Homecharge account",
     body: "Hi,\n\nI can't log in to my Homecharge account, it says my password is wrong every time. I've forgotten password and don't know how to reset password.\n\nCan you help?\n\nThanks,\nDavid Elliott"
@@ -115,6 +119,14 @@
     subject: "Reimbursement lower than expected",
     body: "Hello,\n\nI think I have been underpaid. The payment amount seems low - my reimbursement is lower than expected for last month and I expected more money given how much I charged.\n\nPlease can you check the amount paid is correct?\n\nThanks,\nHannah Ridley"
   },
+  test_hc_compatible_chargers: {
+    subject: "Charger compatibility",
+    body: "Hi,\n\nBefore I order a new unit I want to check charger compatibility. Which chargers are compatible with Homecharge, and is my charger supported if it is an Ohme?\n\nCan I use my existing charger, or do I need one of the supported charger brands?\n\nThanks,\nAdam Whitcombe"
+  },
+  test_hc_resent_onboarding_email: {
+    subject: "Never got the Homecharge invite",
+    body: "Hello,\n\nI still have not had the Homecharge invitation. My manager set me up over a week ago but no invitation email has arrived and the setup link has never come through.\n\nCan the invite be resent please?\n\nThanks,\nLouise Hammond"
+  },
   test_hc_multiple_intents: {
     subject: "Two things please",
     body: "Hi,\n\nTwo things if possible. First, I can't get into my account and need a password reset. Second, my charge sessions are not appearing for the last month.\n\nThanks,\nOwen Bradshaw"
```

### node 47 — Seed mocked Salesforce data (script code)

```diff
--- before/node 47 content
+++ after/node 47 content
@@ -77,7 +77,7 @@
   records: [{
     Id: caseId, CaseNumber: mockCase.caseNumber, Subject: test_subject, Description: description,
     SuppliedEmail: mockCase.suppliedEmail, AccountId: accountId,
-    Origin: "Email", Status: "New", Topic__c: "Please select one", Sub_Topic__c: "Please select one",
+    Origin: "Email", Status: test_intent === "test_fast_admin_case_resolved" ? "Resolved" : "New", Topic__c: "Please select one", Sub_Topic__c: "Please select one",
     Business_process__c: "Operations", RecordTypeId: "0124J000000Cv1rQAA", OwnerId: "00G4J000000jcvjUAA",
     Initial_Case_Queue_Name__c: mockCase.queue, Last_Owner_Queue_Name__c: mockCase.queue, Queue_Email__c: null,
     CreatedDate: "2026-09-11T09:15:32.000+0000", Last_Email_Date__c: "2026-09-11T09:15:18.000+0000"
```

### node 48 — claude.md (content)

```diff
--- before/node 48 content
+++ after/node 48 content
@@ -36,11 +36,13 @@
 3  Scoring  Account linked to case?      mock_downstream == true -> 6; AccountId != null -> 5; else 4
 4  Content  No account linked            button -> 2
 5  Data     Get account details          get_account_details__int (1264) -> 6
-6  Script   Check AI eligibility         ai_account_eligibility, ai_bypass_reason -> 7
-7  Scoring  Account AI eligible?         true -> 8; false -> 9
+6  Script   Check AI eligibility         ai_account_eligibility, ai_bypass_reason, ai_ineligible_reason,
+                                         ai_account_admin_display (Blank when empty), ai_case_closed -> 7
+7  Scoring  Account AI eligible?         ai_case_closed -> 56; eligible -> 8; else 9
+56 Content  Case resolved or closed      prints Case.Status; button "Case reopened - run the AI again" -> 2
 8  Script   Resolve queue route          reads last_owner_queue_name; queue_route, queue_route_label,
                                          ai_email_from_address -> 10
-9  Content  Account not eligible         terminal
+9  Content  Account not eligible         terminal; prints ai_ineligible_reason and the admin as Blank when empty
 10 Scoring  Queue route                  fast_admin -> 12; homecharge -> 18; else 11
 11 Content  Queue not in scope           terminal, prints the raw field value
 
@@ -58,7 +60,8 @@
 54 Content  Dashboard - FAST Admin       clone of 30 + third button "Non-authorised user: GDPR
                                          response" (button_data "Sent GDPR response") -> 59
 59 Content  Provide the authorised       Corpay's wording (tracker 15); native gdpr_authorised_names
-            contacts                     -> 57
+            contacts                     -> 60
+60 AI       Format authorised names      format_gdpr_names_int (org 123 id 22): formatted_names -> 57
 57 Script   Write contacts into GDPR     fills _NAMES_; sets HtmlBody, gdpr_review_html and
                                          request_form_html (screen 33's editor gets the GDPR copy) -> 55
 55 Content  GDPR response dashboard      ${transforms.gdpr_review_html}: the standard dashboard with
@@ -457,6 +460,19 @@
   points at. Importing it as a new tree means updating the layout.
 
 ## Changelog
+- 2026-09-30 Claude - next INT batch (standup 30 Sep, Gemma's summary): Compatible Chargers (HC-Not Online /
+  Compatible Chargers) and Resent Onboarding Email (HC-Online / Resent Onboarding Email) back in node 19's map,
+  with Test Mode scenarios test_hc_compatible_chargers / test_hc_resent_onboarding_email. Node 6 writes
+  ai_ineligible_reason (every failed account rule in words) and ai_account_admin_display (Blank when the
+  AS Account Administrator is empty), both printed on screen 9. Case status gate: node 6 sets ai_case_closed
+  (Status Resolved / Closed, only once the account passes), router 7 sends it to new screen 56, whose button
+  re-reads the case at node 2. Test Mode scenario test_fast_admin_case_resolved seeds Status Resolved.
+  The two intents also need AI Actions 19 (definitions) and 18 (approved templates) in org 123.
+  Case status values are PLACEHOLDERS (PENDING_ALEX_STATUS_RESOLVED / _CLOSED) until Alex confirms the
+  Status picklist values, so the gate does not fire yet. GDPR names: new AI Action node 60
+  (format_gdpr_names_int, org 123 id 22, created 2026-09-30) between screen 59 and node 57 capitalises
+  each name and comma-separates them; node 57 writes formatted_names into _NAMES_ (as typed when empty).
+  PROD twin format_gdpr_names_prod not created yet - create it before this tree is promoted.
 - 2026-09-30 Claude - PROD release prep (standup 30 Sep): node 17's replacement_card Sub Topic spelled
   "Replacement cards" (Gemma's matrix; "Replacements Cards" did not map onto the Case). Node 3's AccountId
   button label now matches its expression (the label read records[0].Account, not a real CO 10 field).
```

### node 57 — Write authorised contacts into GDPR reply (script code)

```diff
--- before/node 57 content
+++ after/node 57 content
@@ -1,5 +1,11 @@
 // --- inputs -----------------------------------------------------------------
 let names = String(ZT.getVariableValue("gdpr_authorised_names", "")).trim();
+// The formatting AI Action answers with formatted_names (capitalised, comma-separated). An
+// empty answer leaves the names exactly as the agent typed them.
+let formattedNames = actions.format_gdpr_names_int.formatted_names;
+if (formattedNames !== undefined && String(formattedNames).trim() !== "") {
+  names = String(formattedNames).trim();
+}
 let gdpr_email_body = ZT.getVariableValue("gdpr_email_body", "");
 let review_html = transforms.gdpr_review_html;
 let form_html = transforms.gdpr_request_form_html;
```

## CHANGES THAT NEED AN EXPLANATION

Every line below must map to a requirement or an explicit request.
Anything unexplained is unintended drift — revert it before delivering.

  [ ] added node 56 (Case is resolved or closed)
  [ ] added node 60 (Format the authorised contact names)
  [ ] node 6 — script code changed (33 → 64 lines) — Check AI eligibility
  [ ] node 7 — node_name: "Route eligible cases to the queue check, everything else to the" → "Closed/resolved case -> notice, eligible -> queue check, everything else -> not eligible"
  [ ] node 7 — button added/changed: "ai_case_closed == true" → node 56 [logic: ai_case_closed == true]
  [ ] node 7 — button added/changed: "ai_account_eligibility == true" → node 8 [logic: ai_account_eligibility == true]
  [ ] node 7 — button added/changed: "" → node 9
  [ ] node 7 — button removed/replaced: "ai_account_eligibility == true" → node 8
  [ ] node 7 — button removed/replaced: "" → node 9
  [ ] node 9 — node_name: "Terminal: shows why the case is not handled by the AI" → "Terminal: shows why the case is not handled by the AI, every failed rule in words"
  [ ] node 9 — content changed (472 → 480 characters) — Account not eligible for AI
  [ ] node 19 — script code changed (201 → 204 lines) — Grade intent and build validation screen
  [ ] node 44 — form field settings changed (same field names)
  [ ] node 45 — script code changed (146 → 158 lines) — Load example email
  [ ] node 47 — script code changed (103 → 103 lines) — Seed mocked Salesforce data
  [ ] node 48 — content changed (694 → 710 lines) — claude.md
  [ ] node 57 — node_name: "Replaces _NAMES_ in node 17's GDPR form with the names from scre" → "Fills _NAMES_ in the GDPR reply with the formatted names from node 60 (as typed when the AI returns nothing)"
  [ ] node 57 — script code changed (19 → 25 lines) — Write authorised contacts into GDPR reply
  [ ] node 59 — button added/changed: "Continue" → node 60
  [ ] node 59 — button removed/replaced: "Continue" → node 57

