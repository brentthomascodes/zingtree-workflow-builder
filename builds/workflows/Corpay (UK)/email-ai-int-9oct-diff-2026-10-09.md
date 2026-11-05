========================================================================
WORKFLOW DIFF — Email Automation - AI Actions INT
========================================================================

Before : Email Automation - AI Actions INT (card group topic fix 2026-10-07).json  (64 nodes)
After  : Email Automation - AI Actions INT (9 Oct quick texts + case status 2026-10-09).json  (64 nodes)

## PLAIN SUMMARY

59 of 64 nodes are byte-for-byte identical to the original (92% untouched).
0 nodes added, 0 removed, 0 renumbered, 5 modified.

In plain terms:
  * CHANGED  node 6 — Check AI eligibility [Script]
               - script code changed (64 → 71 lines) — Check AI eligibility
  * CHANGED  node 17 — Build case review dashboard [Script]
               - script code changed (310 → 310 lines) — Build case review dashboard
  * CHANGED  node 47 — Seed mocked Salesforce data [Script]
               - script code changed (103 → 103 lines) — Seed mocked Salesforce data
  * CHANGED  node 48 — claude.md [Content]
               - content changed (777 → 785 lines) — claude.md
  * CHANGED  node 56 — Case is resolved or closed [Content]
               - content changed (273 → 48 characters) — Case is resolved or closed

## TREE SHAPE

  node type                before    after    delta
  AI_Action                     5        5       +0
  Content                      24       24       +0
  Data                          4        4       +0
  Email                         1        1       +0
  Scoring                      13       13       +0
  Script                       17       17       +0
  TOTAL                        64       64       +0

  Root node unchanged (node 2).

## STRUCTURAL SANITY

  No broken links introduced.
  No nodes became unreachable.
  Pre-existing in the BEFORE tree (not caused by this edit): 0 broken link(s), 6 unreachable node(s).

## UNTOUCHED NODES (59)

  1, 2, 3, 4, 5, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 49, 50, 51, 52, 53, 54, 55, 57, 58, 59, 60, 61, 62, 63, 64

## TREE-LEVEL SETTINGS CHANGED (0)

  (none)

## COSMETIC / EDITOR-ONLY CHANGES (0) — ignore

  (none)

## LINE-LEVEL BODY DIFFS (5)

### node 6 — Check AI eligibility (script code)

```diff
--- before/node 6 content
+++ after/node 6 content
@@ -50,11 +50,17 @@
 
 // --- case status: the AI does not run on a resolved or closed case ---------------
 // Checked only once the account passes, so an ineligible account still shows why.
-// PLACEHOLDERS: Alex Godfrey to confirm the exact Salesforce Status picklist values for a
-// resolved and a closed case. Until they replace these two strings nothing matches, so the
-// gate never fires.
-const closedStatuses = ["PENDING_ALEX_STATUS_RESOLVED", "PENDING_ALEX_STATUS_CLOSED"];
-let ai_case_closed = ai_account_eligibility && closedStatuses.includes(sfCase.Status);
+// Salesforce Status value -> the word screen 56 prints. Corpay gave both spellings
+// ("Resolve status" / "Close status" in writing, "Resolved" / "Closed" on the call).
+const closedStatusWords = {
+  "Resolve status": "resolved",
+  "Resolved": "resolved",
+  "Close status": "closed",
+  "Closed": "closed"
+};
+let closedStatusWord = closedStatusWords[sfCase.Status] || "";
+let ai_case_closed = ai_account_eligibility && closedStatusWord !== "";
+let ai_case_status_notice = closedStatusWord !== "" ? "This case is " + closedStatusWord : "";
 
 // --- outputs ----------------------------------------------------------------
 ZT.setFormData("ai_account_eligibility", ai_account_eligibility);
@@ -62,3 +68,4 @@
 ZT.setFormData("ai_account_admin_display", ai_account_admin_display);
 ZT.setFormData("ai_ineligible_reason", ai_ineligible_reason);
 ZT.setFormData("ai_case_closed", ai_case_closed);
+ZT.setFormData("ai_case_status_notice", ai_case_status_notice);
```

### node 17 — Build case review dashboard (script code)

```diff
--- before/node 17 content
+++ after/node 17 content
@@ -41,7 +41,7 @@
   lost_or_stolen_card:         { topic: "Online",     subtopic: "Lost & Stolen" },
   account_unlock:              { topic: "Online",     subtopic: "Account Unlock" },
   add_update_contact_details:  { topic: "Not Online", subtopic: "Add/Update Contact Details" },
-  card_group_move:             { topic: "Online",     subtopic: "Card Group/Moves" },
+  card_group_move:             { topic: "Not Online", subtopic: "Card Group/Moves" },
   returned_direct_debit:       { topic: "Fee",        subtopic: "Returned direct debit" }
 };
 const intentKeys = Object.keys(salesforceByIntent);
```

### node 47 — Seed mocked Salesforce data (script code)

```diff
--- before/node 47 content
+++ after/node 47 content
@@ -77,7 +77,7 @@
   records: [{
     Id: caseId, CaseNumber: mockCase.caseNumber, Subject: test_subject, Description: description,
     SuppliedEmail: mockCase.suppliedEmail, AccountId: accountId,
-    Origin: "Email", Status: test_intent === "test_fast_admin_case_resolved" ? "Resolved" : "New", Topic__c: "Please select one", Sub_Topic__c: "Please select one",
+    Origin: "Email", Status: test_intent === "test_fast_admin_case_resolved" ? "Resolve status" : "New", Topic__c: "Please select one", Sub_Topic__c: "Please select one",
     Business_process__c: "Operations", RecordTypeId: "0124J000000Cv1rQAA", OwnerId: "00G4J000000jcvjUAA",
     Initial_Case_Queue_Name__c: mockCase.queue, Last_Owner_Queue_Name__c: mockCase.queue, Queue_Email__c: null,
     CreatedDate: "2026-09-11T09:15:32.000+0000", Last_Email_Date__c: "2026-09-11T09:15:18.000+0000"
```

### node 48 — claude.md (content)

```diff
--- before/node 48 content
+++ after/node 48 content
@@ -39,7 +39,7 @@
 6  Script   Check AI eligibility         ai_account_eligibility, ai_bypass_reason, ai_ineligible_reason,
                                          ai_account_admin_display (Blank when empty), ai_case_closed -> 7
 7  Scoring  Account AI eligible?         ai_case_closed -> 56; eligible -> 8; else 9
-56 Content  Case resolved or closed      prints Case.Status; button "Case reopened - run the AI again" -> 2
+56 Content  Case resolved or closed      prints ai_case_status_notice; button "Case reopened - run the AI again" -> 2
 8  Script   Resolve queue route          reads last_owner_queue_name; queue_route, queue_route_label,
                                          ai_email_from_address -> 10
 9  Content  Account not eligible         terminal; prints ai_ineligible_reason and the admin as Blank when empty
@@ -492,6 +492,14 @@
   points at. Importing it as a new tree means updating the layout.
 
 ## Changelog
+- 2026-10-09 Claude - standup 9 Oct (Charley Gunning summary + updated use-case docs "Allstar - Card
+  groups PH1" / "Allstar - Returned direct debit PH1"). Node 17: card_group_move back to Not Online /
+  Card Group/Moves (supersedes the 7 Oct Online row; Brent confirmed). Node 6: resolved/closed gate live -
+  Status "Resolve status" / "Close status" (Charley, in writing) and "Resolved" / "Closed" (Alex, on the
+  call) all fire it; writes ai_case_status_notice. Screen 56 now shows only Corpay's line ("This case is
+  closed" / "This case is resolved") plus the re-run button. Node 47 seeds "Resolve status" for
+  test_fast_admin_case_resolved. Quick texts and the multi-intent Note paragraph live in AI Action 15,
+  outside this file. Nodes 6, 17, 47, 56, 48.
 - 2026-10-07 Claude - Gemma Danks, 7 Oct: card_group_move maps to Topic Online / Sub Topic
   Card Group/Moves (the use case doc had Not Online by mistake). Node 17 row only. Returned direct
   debit stays Fee / Returned direct debit (Charley Gunning, 6 Oct). Thursday's PROD release (screen
@@ -532,11 +540,11 @@
   with Test Mode scenarios test_hc_compatible_chargers / test_hc_resent_onboarding_email. Node 6 writes
   ai_ineligible_reason (every failed account rule in words) and ai_account_admin_display (Blank when the
   AS Account Administrator is empty), both printed on screen 9. Case status gate: node 6 sets ai_case_closed
-  (Status Resolved / Closed, only once the account passes), router 7 sends it to new screen 56, whose button
-  re-reads the case at node 2. Test Mode scenario test_fast_admin_case_resolved seeds Status Resolved.
+  (Status Resolve status / Resolved / Close status / Closed, only once the account passes) and
+  ai_case_status_notice ("This case is resolved" / "This case is closed"), router 7 sends it to new screen 56, whose button
+  re-reads the case at node 2. Test Mode scenario test_fast_admin_case_resolved seeds Status Resolve status.
   The two intents also need AI Actions 19 (definitions) and 18 (approved templates) in org 123.
-  Case status values are PLACEHOLDERS (PENDING_ALEX_STATUS_RESOLVED / _CLOSED) until Alex confirms the
-  Status picklist values, so the gate does not fire yet. GDPR names: new AI Action node 60
+  Case status values confirmed 9 Oct (Charley Gunning / Alex Godfrey); see the 2026-10-09 changelog. GDPR names: new AI Action node 60
   (format_gdpr_names_int, org 123 id 22, created 2026-09-30) between screen 59 and node 57 capitalises
   each name and comma-separates them; node 57 writes formatted_names into _NAMES_ (as typed when empty).
   its PROD twin (the _prod alias) is not created yet - create it before this tree is promoted.
```

### node 56 — Case is resolved or closed (content)

```diff
--- before/node 56 content
+++ after/node 56 content
@@ -1 +1 @@
-<p><strong>AI not run: this case is ${actions.sfdc_int__case_email_ai.records[0].Status}</strong></p><p>The AI only drafts replies on open cases. If the customer needs a reply, change the case Status in Salesforce first, then click the button below to run the AI again.</p>
+<p><strong>${ai_case_status_notice}</strong></p>
```

## CHANGES THAT NEED AN EXPLANATION

Every line below must map to a requirement or an explicit request.
Anything unexplained is unintended drift — revert it before delivering.

  [ ] node 6 — script code changed (64 → 71 lines) — Check AI eligibility
  [ ] node 17 — script code changed (310 → 310 lines) — Build case review dashboard
  [ ] node 47 — script code changed (103 → 103 lines) — Seed mocked Salesforce data
  [ ] node 48 — content changed (777 → 785 lines) — claude.md
  [ ] node 56 — content changed (273 → 48 characters) — Case is resolved or closed

