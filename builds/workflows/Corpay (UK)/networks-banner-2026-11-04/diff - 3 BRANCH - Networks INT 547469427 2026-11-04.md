========================================================================
WORKFLOW DIFF — 3 BRANCH - Networks scaffold
========================================================================

Before : 3 BRANCH - Networks INT 547469427 (BEFORE baseline 2026-11-04).json  (30 nodes)
After  : 3 BRANCH - Networks INT 547469427 (multi-intent banner 2026-11-04).json  (30 nodes)

## PLAIN SUMMARY

26 of 30 nodes are byte-for-byte identical to the original (87% untouched).
0 nodes added, 0 removed, 0 renumbered, 4 modified.

In plain terms:
  * CHANGED  node 48 — claude.md [Content]
               - content changed (18 → 18 lines) — claude.md
  * CHANGED  node 94 — Grade remittance check [Script]
               - script code changed (37 → 56 lines) — Grade remittance check
  * CHANGED  node 110 — Build remittance reply and dashboard [Script]
               - script code changed (94 → 94 lines) — Build remittance reply and dashboard
  * CHANGED  node 118 — Build response-choice dashboard [Script]
               - script code changed (44 → 44 lines) — Build response-choice dashboard

## TREE SHAPE

  node type                before    after    delta
  AI_Action                     1        1       +0
  Content                       9        9       +0
  Data                          1        1       +0
  Scoring                       4        4       +0
  Script                       14       14       +0
  Tree                          1        1       +0
  TOTAL                        30       30       +0

  Root node unchanged (node 3).

## STRUCTURAL SANITY

  No broken links introduced.
  No nodes became unreachable.
  Pre-existing in the BEFORE tree (not caused by this edit): 0 broken link(s), 1 unreachable node(s).

## UNTOUCHED NODES (26)

  3, 4, 5, 6, 7, 9, 56, 70, 71, 72, 73, 79, 91, 92, 93, 95, 96, 97, 98, 112, 113, 114, 115, 116, 117, 119

## TREE-LEVEL SETTINGS CHANGED (0)

  (none)

## COSMETIC / EDITOR-ONLY CHANGES (0) — ignore

  (none)

## LINE-LEVEL BODY DIFFS (4)

### node 48 — claude.md (content)

```diff
--- before/node 48 content
+++ after/node 48 content
@@ -15,4 +15,4 @@
 - 2026-10-12 scaffold (master split).
 - 2026-10-16 remittance MVP: nodes 91-98, 110, 112-117; 90 removed; Merchant Request on 4 / 9; 7 -> 91.
   Source: Gemma Danks "Daily AI standup - Fri 16th Oct" + "Networks AI tree setup" + "Phase 1 - Remittance auto email pushback".
-2026-10-19: tree script: external http(s) links open in a new tab instead of inside the widget (Gemma Danks, 19 Oct).</pre><p>2026-10-27: invoice amount always shown with a pound sign in the service department reply (110); response-choice screen 96 now shows the case dashboard (Case Details + Original Customer Email) built by new script 118 (Gemma Danks, Networks UAT feedback 26 Oct).</p><p>2026-10-29: response-choice screen 96 gets a third button, 'I need to add an attachment', -> new script 119 -> hand back not_automated (master screen 29, work the case as normal) (Gemma Danks, 28 Oct).</p><p>2026-10-29: date (97) and invoice amount (98) questions optional; SMR / Fuel stays required. 117 accepts a blank date; 110 drops the 'on [date]' / 'relating to [amount]' clause when blank (Gemma Danks, 29 Oct).</p><p>2026-10-30: help text 'If not applicable, please leave blank' on optional date (97) and invoice amount (98); General pushback line 'If you have not received this, please confirm the invoice amount and your Merchant Number.' (110) (Gemma Danks, 29 / 30 Oct).</p>
+2026-10-19: tree script: external http(s) links open in a new tab instead of inside the widget (Gemma Danks, 19 Oct).</pre><p>2026-10-27: invoice amount always shown with a pound sign in the service department reply (110); response-choice screen 96 now shows the case dashboard (Case Details + Original Customer Email) built by new script 118 (Gemma Danks, Networks UAT feedback 26 Oct).</p><p>2026-10-29: response-choice screen 96 gets a third button, 'I need to add an attachment', -> new script 119 -> hand back not_automated (master screen 29, work the case as normal) (Gemma Danks, 28 Oct).</p><p>2026-10-29: date (97) and invoice amount (98) questions optional; SMR / Fuel stays required. 117 accepts a blank date; 110 drops the 'on [date]' / 'relating to [amount]' clause when blank (Gemma Danks, 29 Oct).</p><p>2026-10-30: help text 'If not applicable, please leave blank' on optional date (97) and invoice amount (98); General pushback line 'If you have not received this, please confirm the invoice amount and your Merchant Number.' (110) (Gemma Danks, 29 / 30 Oct).</p><p>2026-11-04: multi-intent banner. Script 94 builds transforms.unrecognised_banner_html; response-choice screen 96 (118) and reply dashboard 114 (110) show the "Part of this request was not recognised" card when the intent AI Action 23 returns ai_exception_reason on an in-scope case, same as FAST / Homecharge. AI 23: ai_exception_reason now names the extra request when the email also asks about something else (Charley Gunning, 4 Nov).</p>
```

### node 94 — Grade remittance check (script code)

```diff
--- before/node 94 content
+++ after/node 94 content
@@ -24,11 +24,30 @@
   email_analysis_route = intents.includes("remittance_copy_request") ? "in_scope" : "out_of_scope";
 }
 
+// --- part of the request not recognised (same card as FAST / Homecharge) ------------------
+// On an in-scope case ai_exception_reason is empty unless the email also asks about something
+// the AI does not handle; it then names that part. Screens 96 and 114 print the card on top
+// (Charley Gunning, 4 Nov).
+const escapeHtml = value => String(value == null ? "" : value)
+  .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
+  .replace(/"/g, "&quot;").replace(/'/g, "&#39;");
+let unrecognised_banner_html = "";
+if (email_analysis_route === "in_scope" && ai_exception_reason !== "") {
+  unrecognised_banner_html = `
+<div class="case-review-card" style="background:#fffbeb;border-color:#fde68a;">
+  <h3 class="case-review-card-title">Part of this request was not recognised</h3>
+  <p>Not all elements of this customer request have been matched to a recognised intent. Please review the draft response and add any missing information before sending the email.</p>
+  <p><strong>Recognised:</strong> Remittance copy request</p>
+  <p><strong>Not recognised:</strong> ${escapeHtml(ai_exception_reason)}</p>
+</div>`.replace(/\s*\n\s*/g, " ");
+}
+
 // Case.Description is the inbound email as plain text: escape it and keep its line breaks.
 let networks_customer_email_html = String(actions.sfdc_int__case_email_ai.records[0].Description || "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/\r?\n/g, "<br>");
 
 // --- outputs ----------------------------------------------------------------
 ZT.setTransformData("networks_customer_email_html", networks_customer_email_html);
+ZT.setTransformData("unrecognised_banner_html", unrecognised_banner_html);
 ZT.setFormData("email_intent", intents.join(", "));
 ZT.setFormData("sentiment", sentiment);
 ZT.setFormData("escalate_reason", escalate_reason);
```

### node 110 — Build remittance reply and dashboard (script code)

```diff
--- before/node 110 content
+++ after/node 110 content
@@ -87,7 +87,7 @@
 ZT.setFormData("sf_Topic__c", topic);
 ZT.setFormData("sf_Sub_Topic__c", remittance_type);
 ZT.setFormData("has_multiple_intents", "false");
-ZT.setFormData("case_review_html", compact(case_review_html));
+ZT.setFormData("case_review_html", compact(transforms.unrecognised_banner_html + case_review_html));
 ZT.setTransformData("request_form_html", compact(request_form_html));
 ZT.setFormData("ai_feedback", "");
 ZT.setFormData("ai_feedback_comments", "");
```

### node 118 — Build response-choice dashboard (script code)

```diff
--- before/node 118 content
+++ after/node 118 content
@@ -41,4 +41,4 @@
 </div></div>`;
 
 // --- outputs ----------------------------------------------------------------
-ZT.setTransformData("response_choice_html", response_choice_html.replace(/\s*\n\s*/g, " "));
+ZT.setTransformData("response_choice_html", (transforms.unrecognised_banner_html + response_choice_html).replace(/\s*\n\s*/g, " "));
```

## CHANGES THAT NEED AN EXPLANATION

Every line below must map to a requirement or an explicit request.
Anything unexplained is unintended drift — revert it before delivering.

  [ ] node 48 — content changed (18 → 18 lines) — claude.md
  [ ] node 94 — script code changed (37 → 56 lines) — Grade remittance check
  [ ] node 110 — script code changed (94 → 94 lines) — Build remittance reply and dashboard
  [ ] node 118 — script code changed (44 → 44 lines) — Build response-choice dashboard

