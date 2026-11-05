========================================================================
WORKFLOW DIFF — API - Nearshore Small Balance Open Card
========================================================================

Before : API - Nearshore Small Balance Open Card (API v1).json  (31 nodes)
After  : API - Nearshore Small Balance Open Card (API v1.1).json  (31 nodes)

## PLAIN SUMMARY

26 of 31 nodes are byte-for-byte identical to the original (84% untouched).
0 nodes added, 0 removed, 0 renumbered, 5 modified.

In plain terms:
  * CHANGED  node 4 — Build the Cancel Card request [Script]
               - script code changed (44 → 45 lines) — Build the Cancel Card request
  * CHANGED  node 5 — Review and submit Cancel Card [Content]
               - form field settings changed (same field names)
  * CHANGED  node 28 — Age of Cancel Card Request? [Content]
               - content changed (374 → 406 characters) — Age of Cancel Card Request?
  * CHANGED  node 43 — Stage BizPay payment [Script]
               - script code changed (31 → 36 lines) — Stage BizPay payment
  * CHANGED  node 48 — claude.md [Content]
               - content changed (48 → 49 lines) — claude.md

## TREE SHAPE

  node type                before    after    delta
  Content                      22       22       +0
  Data                          2        2       +0
  Scoring                       3        3       +0
  Script                        4        4       +0
  TOTAL                        31       31       +0

  Root node unchanged (node 1).

## STRUCTURAL SANITY

  No broken links introduced.
  No nodes became unreachable.
  Pre-existing in the BEFORE tree (not caused by this edit): 0 broken link(s), 1 unreachable node(s).

## UNTOUCHED NODES (26)

  1, 2, 3, 6, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 29, 30, 31, 34, 35, 36, 41, 42, 44, 45, 46, 47

## TREE-LEVEL SETTINGS CHANGED (0)

  (none)

## COSMETIC / EDITOR-ONLY CHANGES (0) — ignore

  (none)

## LINE-LEVEL BODY DIFFS (4)

### node 4 — Build the Cancel Card request (script code)

```diff
--- before/node 4 content
+++ after/node 4 content
@@ -29,7 +29,7 @@
   partial_refund: { label: "Cancel and partial refund", api: "partial_refund", reason: "Paid account/invoice balance", fee: "0",
     why: "A significant balance remains that most likely came from client funding. Refund it to the client.",
     note: `MM/DD/YY vendor processed partial payment, CANCEL/PARTIAL REFUND $${remaining} - [INITIALS]` },
-  partial_reissue_check: { label: "Cancel and reissue partial check", api: "reissue_check", reason: "Cancel/reissue per client request", fee: "0",
+  partial_reissue_check: { label: "Cancel and reissue partial check", api: "partial_reissue", reason: "Cancel/reissue per client request", fee: "0",
     why: "A significant balance remains from client funding, but the client does not accept refunds. Reissue it as a partial check.",
     note: `MM/DD/YY Vendor processed partial payment, CANCEL/ISSUE PARTIAL CHECK $${remaining} - [INITIALS]` }
 };
@@ -41,4 +41,5 @@
 ZT.setFormData("amount", String(remaining));
 ZT.setFormData("fee", String(chosen.fee));
 ZT.setFormData("payment_note", chosen.note);
+ZT.setFormData("agent_email", "system@zingtree.com");
 ZT.setTransformData("cancel_summary_html", `<p><strong>${chosen.label}.</strong> ${chosen.why}</p>`);
```

### node 28 — Age of Cancel Card Request? (content)

```diff
--- before/node 28 content
+++ after/node 28 content
@@ -1 +1 @@
-<p>Scroll down to the <strong>Activity History</strong> section of the Payment Details page, and locate the <strong>Activity Date</strong> on which<strong>&nbsp;</strong>the Cancel Card Request was Approved.</p><p><img src="https://s3.amazonaws.com/zingtree-uploads/images%2F1789496962282-activity+history+example.png" style="width: 797px;" class="fr-fic fr-dib fr-fil"></p>
+${transforms.approved_date_html}<p>Scroll down to the <strong>Activity History</strong> section of the Payment Details page, and locate the <strong>Activity Date</strong> on which<strong>&nbsp;</strong>the Cancel Card Request was Approved.</p><p><img src="https://s3.amazonaws.com/zingtree-uploads/images%2F1789496962282-activity+history+example.png" style="width: 797px;" class="fr-fic fr-dib fr-fil"></p>
```

### node 43 — Stage BizPay payment (script code)

```diff
--- before/node 43 content
+++ after/node 43 content
@@ -15,6 +15,11 @@
   ZT.setFormData("cancel_card_request_exists", response.cancel_card_request_exists === true);
   ZT.setFormData("cancel_card_request_approved", response.cancel_card_request_approved === true);
   ZT.setFormData("card_status_date", response.card_status_date);
+  let approved_date = response.cancel_card_request_approved_date === null ? "" : String(response.cancel_card_request_approved_date);
+  ZT.setFormData("cancel_card_request_approved_date", approved_date);
+  ZT.setTransformData("approved_date_html", approved_date === ""
+    ? "<p>BizPay did not return an approved date. Check <strong>Activity History</strong> on the Payment Details page.</p>"
+    : `<p>BizPay approved the Cancel Card request on <strong>${approved_date}</strong>. Compare it with the <strong>Sheet Created Date</strong> on the Followup spreadsheet.</p>`);
 }
 
 // No payment, a balance to verify, or nothing left on the card
@@ -26,6 +31,6 @@
 let errorFields = rawBody === String(rawBody) ? (rawBody.startsWith("{") ? JSON.parse(rawBody) : { message: rawBody }) : rawBody;
 let html_escape = s => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;");
 let payment_html = found
-  ? `<table><tr><th>Client</th><td>${html_escape(response.client_name)}</td></tr><tr><th>Payment amount</th><td>$${response.payment_amount}</td></tr><tr><th>Funding</th><td>$${response.funding_amount}</td></tr><tr><th>Manual value load</th><td>$${response.manual_value_load_amount}</td></tr><tr><th>Service fee</th><td>$${response.service_fee}</td></tr><tr><th>Remaining balance</th><td><strong>$${response.remaining_balance}</strong></td></tr><tr><th>Card status</th><td>${html_escape(response.card_status)} (${html_escape(response.card_status_date)})</td></tr><tr><th>Cancel card request</th><td>${response.cancel_card_request_exists ? (response.cancel_card_request_approved ? "Initiated and approved" : "Initiated, not approved") : "None"}</td></tr></table>`
+  ? `<table><tr><th>Client</th><td>${html_escape(response.client_name)}</td></tr><tr><th>Payment amount</th><td>$${response.payment_amount}</td></tr><tr><th>Funding</th><td>$${response.funding_amount}</td></tr><tr><th>Manual value load</th><td>$${response.manual_value_load_amount}</td></tr><tr><th>Service fee</th><td>$${response.service_fee}</td></tr><tr><th>Remaining balance</th><td><strong>$${response.remaining_balance}</strong></td></tr><tr><th>Card status</th><td>${html_escape(response.card_status)} (${html_escape(response.card_status_date)})</td></tr><tr><th>Cancel card request</th><td>${response.cancel_card_request_exists ? (response.cancel_card_request_approved ? "Initiated and approved" + (response.cancel_card_request_approved_date === null ? "" : " " + html_escape(response.cancel_card_request_approved_date)) : "Initiated, not approved") : "None"}</td></tr></table>`
   : `<p>BizPay returned HTTP ${code}: ${html_escape(errorFields.message || "")} ${html_escape(errorFields.error || "")}</p>`;
 ZT.setTransformData("payment_html", payment_html.replace(/\n/g, " "));
```

### node 48 — claude.md (content)

```diff
--- before/node 48 content
+++ after/node 48 content
@@ -10,7 +10,7 @@
 29 Verify balance vs Followup sheet (manual): match -> 3 | no -> 30
 6, 24, 25, 26, 27, 23 Zero-balance research in Galileo/Comdata (manual) -> positive balance -> 34 (agent enters balance) -> 3
 3 Route the remaining balance (Script) -> 45
-45 Route on resolution_route: approved_request -> 28 (manual approval-date check) | request_pending -> 20 | ipay_rpps_check -> 31 (manual) | client_notes_check -> 41 (manual) | else -> 4
+45 Route on resolution_route: approved_request -> 28 (BizPay approved date shown; agent compares with sheet date) | request_pending -> 20 | ipay_rpps_check -> 31 (manual) | client_notes_check -> 41 (manual) | else -> 4
 31, 41 -> 4
 4 Build the Cancel Card request (Script) -> 5
 5 Review and submit Cancel Card (agent confirms prefilled fields) -> 35
@@ -21,13 +21,13 @@
 
 Data dictionary (form data)
 payment_id - node 1; merged into both CO URLs
-client_exception (ipay | civitas | other), remaining_balance, funding, manual_load_value, fee_amount, cancel_card_request_exists, cancel_card_request_approved, card_status_date (shown on 6) - node 43, from the GET
+client_exception (ipay | civitas | other), remaining_balance, funding, manual_load_value, fee_amount, cancel_card_request_exists, cancel_card_request_approved, cancel_card_request_approved_date (shown on 28, empty when null), card_status_date (shown on 6) - node 43, from the GET
 entry_route - node 43; resolution_route - node 3
 rpps_available - node 31; client_restricts_partial - node 41
 resolution, cancel_card_reason, amount, fee, payment_note - node 4, editable on node 5; read by the CO 1300 body template
-agent_email - node 5; read by CO 1300 (must be a BizPay user)
+agent_email - node 4 sets system@zingtree.com (BizPay system user from Mayur, 10/22), editable on node 5; read by CO 1300
 cancel_submitted - node 36
-transforms.payment_html (43), cancel_summary_html (4), post_result_html (36)
+transforms.payment_html, approved_date_html (43), cancel_summary_html (4), post_result_html (36)
 
 External systems
 Data source "BizPay Dev (Paymerang)", OAuth2 client credentials. Dev base https://develop.api.pega.dev.paymerang.com/
@@ -38,11 +38,12 @@
 Civitas client id 4016 is the PROD id; dev also matches on client name.
 No Date in scripts, so the payment note keeps MM/DD/YY for the agent to fill.
 A double quote in payment_note breaks the POST body.
-Routing follows Helena's Small Balance ZT Workflow Visio (10/20). Open: API resolution value for a partial reissue check (staged as reissue_check, fee blank per Visio); Visio sends a negative balance to Manual Cancellation Needed, the tree keeps Escalate: Negative Balance (27) until confirmed; fee for cancel_fee paths follows the tree (remaining balance) and BizPay may reject it if it expects service_fee.
+Routing follows Helena's Small Balance ZT Workflow Visio (10/20). Partial reissue check sends partial_reissue (added by Mayur 10/22), fee blank per Visio. Negative balance goes to Escalate: Negative Balance (27), confirmed by Jonathan 10/22 over the Visio's Manual Cancellation. fee for cancel_fee paths follows the tree (remaining balance) and BizPay may reject it if it expects service_fee.
 
-Pending from BizPay (Mayur, 10/20 call): cancel_card_request_approved_date on the GET. When it lands, node 3 can compare it with the sheet date and replace the manual check on node 28. A Zingtree system user for agent_email on the POST.
+Node 28 stays an agent choice: the Sheet Created Date lives only in the Followup spreadsheet, so the API date is shown but not compared.
 
 Changelog
 - API build from the 10/20 copy of tree 726245811: GET-driven routing, manual checks kept, single prefilled Cancel Card POST.
 - Reconciled with the 10/20 working session: spreadsheet checks and Galileo/Comdata research stay manual; approval date and system user pending from BizPay.
+- 10/22: partial_reissue resolution, cancel_card_request_approved_date shown on 28, agent_email defaults to system@zingtree.com.
 - Aligned to Helena's Visio: iPay RPPS also when funding + manual load = remaining; partial check fee blank; card status date shown on the card-age check.</pre>
```

## CHANGES THAT NEED AN EXPLANATION

Every line below must map to a requirement or an explicit request.
Anything unexplained is unintended drift — revert it before delivering.

  [ ] node 4 — script code changed (44 → 45 lines) — Build the Cancel Card request
  [ ] node 5 — form field settings changed (same field names)
  [ ] node 28 — content changed (374 → 406 characters) — Age of Cancel Card Request?
  [ ] node 43 — script code changed (31 → 36 lines) — Stage BizPay payment
  [ ] node 48 — content changed (48 → 49 lines) — claude.md

