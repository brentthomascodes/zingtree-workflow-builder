========================================================================
WORKFLOW DIFF — Email Automation - AI Actions INT
========================================================================

Before : Email Automation - AI Actions INT (Thursday release - admin wording + sentiment tests 2026-10-12).json  (64 nodes)
After  : Email Automation - AI Actions INT (GDPR v2 2026-10-13).json  (62 nodes)

## PLAIN SUMMARY

58 of 62 nodes are byte-for-byte identical to the original (94% untouched).
0 nodes added, 2 removed, 0 renumbered, 4 modified.

In plain terms:
  - GONE     node 59 — Provide the authorised contacts for this account [Content] (was reachable from node 54)
  - GONE     node 60 — Format the authorised contact names [AI_Action] (was reachable from node 59)
  * CHANGED  node 17 — Build case review dashboard [Script]
               - script code changed (310 → 300 lines) — Build case review dashboard
  * CHANGED  node 48 — claude.md [Content]
               - content changed (789 → 795 lines) — claude.md
  * CHANGED  node 54 — Case review dashboard - FAST Admin [Content]
               - button added/changed: "Non-authorised user: GDPR response" → node 57
               - button removed/replaced: "Non-authorised user: GDPR response" → node 59
  * CHANGED  node 57 — Stage GDPR reply [Script]
               - page_title: "Write authorised contacts into GDPR reply" → "Stage GDPR reply"
               - node_name: "Fills _NAMES_ in the GDPR reply with the formatted names from no" → "Stages the GDPR reply (v2 copy, no names) into HtmlBody and request_form_html"
               - script code changed (26 → 12 lines) — Stage GDPR reply

## TREE SHAPE

  node type                before    after    delta
  AI_Action                     5        4       -1
  Content                      24       23       -1
  Data                          4        4       +0
  Email                         1        1       +0
  Scoring                      13       13       +0
  Script                       17       17       +0
  TOTAL                        64       62       -2

  Root node unchanged (node 2).

## STRUCTURAL SANITY

  No broken links introduced.
  No nodes became unreachable.
  Pre-existing in the BEFORE tree (not caused by this edit): 0 broken link(s), 6 unreachable node(s).

## UNTOUCHED NODES (58)

  1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 49, 50, 51, 52, 53, 55, 56, 58, 61, 62, 63, 64

## TREE-LEVEL SETTINGS CHANGED (0)

  (none)

## COSMETIC / EDITOR-ONLY CHANGES (0) — ignore

  (none)

## LINE-LEVEL BODY DIFFS (3)

### node 17 — Build case review dashboard (script code)

```diff
--- before/node 17 content
+++ after/node 17 content
@@ -233,26 +233,16 @@
 let request_form_html = renderRequestForm(email_response);
 
 // --- GDPR pushback reply (FAST Admin only: the sender is not an authorised contact) ----
-// Corpay UK's approved GDPR pushback copy, "Allstar - GDPR button PH1" (Charley Gunning).
+// Corpay UK's approved GDPR pushback copy, "Allstar - GDPR button PH1 v2" (Gemma Danks, 13 Oct).
 // The agent decides the sender is not authorised, so the draft is fixed copy rather than
-// an AI reply. _NAMES_ is the token node 57 replaces with the authorised contacts the agent
-// types on screen 59. The reply then opens on screen 55, the same dashboard as every other
-// reply (thumbs included), and its manual-changes button opens screen 33 with this copy in
-// the editor (tracker 13 / 14, 25 Sep standup).
+// an AI reply. Corpay may no longer name the authorised contacts, so the copy carries no
+// names and the agent is not asked for any. The reply opens on screen 55, the same dashboard
+// as every other reply (thumbs included), and its manual-changes button opens screen 33.
 const gdpr_email_body = [
   "<p>Hello,</p>",
   "<p>Thank you for your email.</p>",
-  "<p>Due to GDPR data protection requirements, we're unable to process this request or disclose account information, as you are not currently listed as an authorised contact or registered for access to the Allstar Online portal.</p>",
-  "<p>The authorised contacts on the account are: <strong>_NAMES_</strong></p>",
-  "<p>If you require access, one of the authorised contacts above can add you as a portal user.</p>",
-  "<p>An authorised user can complete this request through <a href=\"http://www.allstaronline.co.uk\">Allstar Online</a>. The portal allows users to:</p>",
-  "<ul>",
-  "<li>Manage purchase orders</li>",
-  "<li>Manage cards, including ordering, cancelling, replacing, and viewing PINs</li>",
-  "<li>Access reports, including active card lists and transactions</li>",
-  "<li>Manage users, including creating, updating, deactivating, locking/unlocking accounts, and resetting passwords</li>",
-  "<li>View and download invoices and statements</li>",
-  "</ul>",
+  "<p>Please be advised that in order to fulfil our GDPR obligations and as a result of the current account permissions, I am unable to action your request or disclose any information about the account to you as you are not a named contact and you're not set up to have access to the Allstar Online portal.</p>",
+  "<p>Please contact your account administrator for further access or account information.</p>",
   "<p>Kind regards,<br>Allstar Customer Support</p>"
 ].join("");
 
@@ -296,7 +286,7 @@
 ZT.setFormData("unrecognised_review_html", compact(unrecognised_review_html));
 ZT.setTransformData("request_form_html", compact(request_form_html));
 ZT.setTransformData("multiple_subtopics_form_html", compact(multiple_subtopics_form_html));
-// GDPR templates, still carrying _NAMES_; node 57 fills them only if the agent picks GDPR.
+// GDPR templates; node 57 stages them only if the agent picks GDPR.
 ZT.setFormData("gdpr_email_body", gdpr_email_body);
 ZT.setFormData("gdpr_review_html", compact(gdpr_review_html));
 // Router 52 sends the feedback Submit back to the GDPR dashboard only after node 57 ran.
```

### node 48 — claude.md (content)

```diff
--- before/node 48 content
+++ after/node 48 content
@@ -492,6 +492,12 @@
   points at. Importing it as a new tree means updating the layout.
 
 ## Changelog
+- 2026-10-13 Claude - GDPR v2 (Gemma Danks, 13 Oct, "Allstar - GDPR button PH1 v2"; Thursday
+  release). Corpay may no longer name the authorised contacts: screen 59 (names entry) and AI Action
+  node 60 (format_gdpr_names_int) deleted; dashboard 54's GDPR button now goes straight to 57.
+  Node 17's gdpr_email_body is the v2 copy verbatim, no _NAMES_ token. Node 57 only stages the GDPR
+  copy into HtmlBody / request_form_html. gdpr_authorised_names is no longer written or read.
+  Architecture rows for 59 / 60 above are retired.
 - 2026-10-12 Claude - standup 12 Oct (Gemma Danks summary). Node 6: blank AS Account Administrator
   reason now reads "AS Account Administrator is blank - Please work this case as you normally would."
   Test Mode: test_fast_admin_rdd_frustrated (negative tone, still asking - expect the BAU reply once
```

### node 57 — Stage GDPR reply (script code)

```diff
--- before/node 57 content
+++ after/node 57 content
@@ -1,26 +1,12 @@
 // --- inputs -----------------------------------------------------------------
-let names = String(ZT.getVariableValue("gdpr_authorised_names", "")).trim();
-// The formatting AI Action answers with formatted_names (capitalised, comma-separated). An
-// empty answer leaves the names exactly as the agent typed them.
-let formattedNames = actions.format_gdpr_names_int.formatted_names;
-if (formattedNames !== undefined && String(formattedNames).trim() !== "") {
-  names = String(formattedNames).trim();
-}
 let gdpr_email_body = ZT.getVariableValue("gdpr_email_body", "");
-let review_html = ZT.getVariableValue("gdpr_review_html", "");
 let form_html = transforms.gdpr_request_form_html;
-
-// --- transform ----------------------------------------------------------------
-let safeNames = names.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
-  .replace(/"/g, "&quot;").replace(/'/g, "&#39;");
-const fillNames = html => html.split("_NAMES_").join(safeNames);
 
 // --- outputs ----------------------------------------------------------------
 // The agent chose the GDPR reply, so it replaces the AI draft everywhere the send path
 // reads one: HtmlBody for dashboard 55's send button, and request_form_html for screen 33
 // behind its manual-changes button. script_code copies the editor into the HtmlBody
 // textarea on render, so the one replacement covers both copies of the body on screen 33.
-ZT.setFormData("HtmlBody", fillNames(gdpr_email_body));
-ZT.setFormData("gdpr_review_html", fillNames(review_html));
+ZT.setFormData("HtmlBody", gdpr_email_body);
 ZT.setFormData("ai_reply_is_gdpr", true);
-ZT.setTransformData("request_form_html", fillNames(form_html));
+ZT.setTransformData("request_form_html", form_html);
```

## CHANGES THAT NEED AN EXPLANATION

Every line below must map to a requirement or an explicit request.
Anything unexplained is unintended drift — revert it before delivering.

  [ ] removed node 59 (Provide the authorised contacts for this account)
  [ ] removed node 60 (Format the authorised contact names)
  [ ] node 17 — script code changed (310 → 300 lines) — Build case review dashboard
  [ ] node 48 — content changed (789 → 795 lines) — claude.md
  [ ] node 54 — button added/changed: "Non-authorised user: GDPR response" → node 57
  [ ] node 54 — button removed/replaced: "Non-authorised user: GDPR response" → node 59
  [ ] node 57 — page_title: "Write authorised contacts into GDPR reply" → "Stage GDPR reply"
  [ ] node 57 — node_name: "Fills _NAMES_ in the GDPR reply with the formatted names from no" → "Stages the GDPR reply (v2 copy, no names) into HtmlBody and request_form_html"
  [ ] node 57 — script code changed (26 → 12 lines) — Stage GDPR reply

