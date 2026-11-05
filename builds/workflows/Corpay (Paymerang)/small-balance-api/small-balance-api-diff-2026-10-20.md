========================================================================
WORKFLOW DIFF — API - Nearshore Small Balance Open Card
========================================================================

Before : API - Nearshore Small Balance Open Card (BEFORE baseline 2026-10-20).json  (39 nodes)
After  : API - Nearshore Small Balance Open Card (API v1).json  (31 nodes)

## PLAIN SUMMARY

0 of 31 nodes are byte-for-byte identical to the original (0% untouched).
9 nodes added, 17 removed, 0 renumbered, 22 modified.

In plain terms:
  + NEW      node 2 — Payment not found [Content]
  + NEW      node 3 — Route the remaining balance [Script]
  + NEW      node 4 — Build the Cancel Card request [Script]
  + NEW      node 5 — Review and submit Cancel Card [Content]
  + NEW      node 35 — Post Cancel Card to BizPay [Data]
  + NEW      node 36 — Grade the Cancel Card [Script]
  + NEW      node 46 — Route: Cancel Card accepted? [Scoring]
  + NEW      node 47 — Cancel Card not accepted [Content]
  + NEW      node 48 — claude.md [Content]
  - GONE     node 7 — Payment Notes Review [Content] (was reachable from node 34)
  - GONE     node 8 — Cancel Card Request Approved? [Content] (was reachable from nodes 7, 45)
  - GONE     node 9 — Logic: Cancel Card Routing [Scoring] (was reachable from nodes 7, 45)
  - GONE     node 10 — Cancel/Issue Check - Payment Notes [Content] (was reachable from node 9)
  - GONE     node 11 — Cancel Fee - Under $1 - Payment Notes [Content] (was reachable from node 9)
  - GONE     node 12 — Cancel Fee - Payment Notes [Content] (was reachable from node 9)
  - GONE     node 13 — Partial Refund - Payment Notes [Content] (was reachable from nodes 9, 41)
  - GONE     node 14 — Initiate Cancel Card (Cancel Fee - Under $1) [Content] (was reachable from node 11)
  - GONE     node 15 — Initiate Cancel Card (Reissue Check) [Content] (was reachable from node 10)
  - GONE     node 16 — Initiate Cancel Card (Cancel Fee) [Content] (was reachable from node 12)
  - GONE     node 17 — Initiate Cancel Card (Partial Refund) [Content] (was reachable from node 13)
  - GONE     node 32 — Initiate Cancel Card (RPPS) [Content] (was reachable from node 37)
  - GONE     node 33 — Initiate Cancel Card (Full Refund) [Content] (was reachable from node 38)
  - GONE     node 37 — Reissue RPPS - Payment Notes [Content] (was reachable from node 31)
  - GONE     node 38 — Full Refund - Payment Notes [Content] (was reachable from node 31)
  - GONE     node 39 — Cancel/Issue Partial Check - Payment Notes [Content] (was reachable from node 41)
  - GONE     node 40 — Initiate Cancel Card (Reissue Partial Check) [Content] (was reachable from node 39)
  * CHANGED  node 1 — Start: Small Balance Process [Content]
               - node_name: "" → "Start: Small Balance Process"
  * CHANGED  node 6 — Card Age [Content]
               - node_name: "" → "Card Age"
               - content changed (209 → 366 characters) — Card Age
  * CHANGED  node 18 — Disposition Card: Cancelled [Content]
               - node_name: "" → "Disposition Card: Cancelled"
               - content changed (432 → 462 characters) — Disposition Card: Cancelled
  * CHANGED  node 19 — Finish Tree [Content]
               - node_name: "" → "Finish Tree"
  * CHANGED  node 20 — Disposition Card: No Action Required [Content]
               - node_name: "" → "Disposition Card: No Action Required"
  * CHANGED  node 21 — Escalate for Manual Cancellation (Cancel Card) [Content]
               - node_name: "" → "Escalate for Manual Cancellation (Cancel Card)"
  * CHANGED  node 22 — Disposition Card: Escalation [Content]
               - node_name: "" → "Disposition Card: Escalation"
  * CHANGED  node 23 — Escalate to App Support: No Remainder [Content]
               - node_name: "" → "Escalate to App Support: No Remainder"
  * CHANGED  node 24 — Debit or Credit? [Content]
               - node_name: "" → "Debit or Credit?"
  * CHANGED  node 25 — Galileo Transaction Research [Content]
               - node_name: "" → "Galileo Transaction Research"
  * CHANGED  node 26 — Comdata Transactions Research [Content]
               - node_name: "" → "Comdata Transactions Research"
  * CHANGED  node 27 — Escalate: Negative Balance [Content]
               - node_name: "" → "Escalate: Negative Balance"
  * CHANGED  node 28 — Age of Cancel Card Request? [Content]
               - node_name: "" → "Age of Cancel Card Request?"
  * CHANGED  node 29 — Verify Balance [Content]
               - node_name: "" → "Verify Balance"
               - content changed (172 → 227 characters) — Verify Balance
               - button added/changed: "Yes, they match" → node 3
               - button removed/replaced: "Yes, they match" → node 45
  * CHANGED  node 30 — Escalate to App Support: Incorrect Balance [Content]
               - node_name: "" → "Escalate to App Support: Incorrect Balance"
  * CHANGED  node 31 — Refund/Reissue RPPS [Content]
               - node_name: "" → "Refund/Reissue RPPS"
               - button added/changed: "Continue" → node 4
               - button removed/replaced: "Yes, RPPS is an option" → node 37
               - button removed/replaced: "No, RPPS is not listed" → node 38
               - form field added: rpps_available (radio)
  * CHANGED  node 34 — Positive Balance (After research) [Content]
               - node_name: "" → "Positive Balance (After research)"
               - button added/changed: "Continue" → node 3
               - button removed/replaced: "Continue" → node 7
  * CHANGED  node 41 — Review Client Notes (Partial Refund/Reissue) [Content]
               - node_name: "" → "Review Client Notes (Partial Refund/Reissue)"
               - button added/changed: "Continue" → node 4
               - button removed/replaced: "No" → node 13
               - button removed/replaced: "Yes" → node 39
               - form field added: client_restricts_partial (radio)
  * CHANGED  node 42 — Get BizPay payment [Data]
               - page_title: "Bizpay Get Payment by ID" → "Get BizPay payment"
               - node_name: "" → "Calls GET /payments/zingtree/{payment_id} (CO 1299)"
  * CHANGED  node 43 — Stage BizPay payment [Script]
               - page_title: "Format Bizpay Data" → "Stage BizPay payment"
               - node_name: "" → "Grades the GET and stages the payment fields"
               - script code changed (24 → 31 lines) — Stage BizPay payment
  * CHANGED  node 44 — Route: payment found? [Scoring]
               - page_title: "Use transformed data" → "Route: payment found?"
               - node_name: "" → "Routes on entry_route"
               - content changed (20 → 0 characters) — Route: payment found?
               - button added/changed: "entry_route == "not_found"" → node 2 [logic: entry_route == "not_found"]
               - button added/changed: "entry_route == "verify_balance"" → node 29 [logic: entry_route == "verify_balance"]
               - button added/changed: "" → node 6
               - button removed/replaced: "is_remaining_balance" → node 29
               - button removed/replaced: "" → node 6
               - advanced_logic_node: 0 → 1
  * CHANGED  node 45 — Route: Small Balance outcome [Scoring]
               - page_title: "Is Cancel Card Request Exist?" → "Route: Small Balance outcome"
               - node_name: "" → "Routes on resolution_route"
               - content changed (15 → 0 characters) — Route: Small Balance outcome
               - continuation_node_id: 9 → 4 — Route: Small Balance outcome
               - button added/changed: "resolution_route == "approved_request"" → node 28 [logic: resolution_route == "approved_request"]
               - button added/changed: "resolution_route == "request_pending"" → node 20 [logic: resolution_route == "request_pending"]
               - button added/changed: "resolution_route == "ipay_rpps_check"" → node 31 [logic: resolution_route == "ipay_rpps_check"]
               - button added/changed: "resolution_route == "client_notes_check"" → node 41 [logic: resolution_route == "client_notes_check"]
               - button added/changed: "" → node 4
               - button removed/replaced: "transforms.bizpay_data.cancel_card_request_exists == true" → node 8
               - button removed/replaced: "" → node 9

## TREE SHAPE

  node type                before    after    delta
  Content                      34       22      -12
  Data                          1        2       +1
  Scoring                       3        3       +0
  Script                        1        4       +3
  TOTAL                        39       31       -8

  Root node unchanged (node 1).

## STRUCTURAL SANITY

  No broken links introduced.
  NEWLY UNREACHABLE FROM ROOT (1): 48 (claude.md)
    (expected for the unlinked claude.md node — anything else is a stranded path)

## UNTOUCHED NODES (0)

  (none — every node was modified; if that was not the intent, stop here)

## TREE-LEVEL SETTINGS CHANGED (1)

  predefined_vars: {"0": {"checkbox_score": 1, "config": null, "custom_regex": "", "hidden_value": "", "id": 34493640, "inline": 0, "label": "", "label_type": "", "name": "is_remaining_balance", "options": "", "project_id": 563559070, "project_node_id": 0, "rank": 0, "required": false, "score_var": "", "scores": "", "type": "predefined"}} → {}

## COSMETIC / EDITOR-ONLY CHANGES (2) — ignore

  (canvas x/y, sizes, display_order, updated flags on 2 node references)

## LINE-LEVEL BODY DIFFS (6)

### node 6 — Card Age (content)

```diff
--- before/node 6 content
+++ after/node 6 content
@@ -1 +1 @@
-<p><em>Example of <strong>Status</strong> field:</em></p><p><img src="https://s3.amazonaws.com/zingtree-uploads/images%2F1789494138796-1789494138796.png" style="width: 174px;" class="fr-fic fr-dib fr-fil"></p>
+<p>BizPay shows no remaining balance on this card. The card status date is <strong>#card_status_date#</strong>.</p><p>Is that date 0-7 days before today?</p><p><em>Example of <strong>Status</strong> field:</em></p><p><img src="https://s3.amazonaws.com/zingtree-uploads/images%2F1789494138796-1789494138796.png" style="width: 174px;" class="fr-fic fr-dib fr-fil"></p>
```

### node 18 — Disposition Card: Cancelled (content)

```diff
--- before/node 18 content
+++ after/node 18 content
@@ -1 +1 @@
-<p>Return to the Nearshore Small Balance Followup spreadsheet, and <strong id="isPasted">disposition&nbsp;</strong>the card:</p><ul><li id="isPasted"><strong>Code&nbsp;</strong>column<strong>:</strong> Key in a <strong>2.</strong></li><li><strong>Worked By&nbsp;</strong>column<strong>:</strong> Key in your first and last name.</li><li><strong>Date Worked&nbsp;</strong>column<strong>:</strong> Key in today&rsquo;s date.</li></ul>
+${transforms.post_result_html}<p>Return to the Nearshore Small Balance Followup spreadsheet, and <strong id="isPasted">disposition&nbsp;</strong>the card:</p><ul><li id="isPasted"><strong>Code&nbsp;</strong>column<strong>:</strong> Key in a <strong>2.</strong></li><li><strong>Worked By&nbsp;</strong>column<strong>:</strong> Key in your first and last name.</li><li><strong>Date Worked&nbsp;</strong>column<strong>:</strong> Key in today&rsquo;s date.</li></ul>
```

### node 29 — Verify Balance (content)

```diff
--- before/node 29 content
+++ after/node 29 content
@@ -1 +1 @@
-<p>Compare the amount remaining, ${remaining_balance}, to the amount listed in the &quot;Amount on Card&quot; field on the Nearshore Small Balance Followup spreadsheet.</p>
+<p>BizPay shows this payment:</p>${transforms.payment_html}<p>Compare the remaining balance, <strong>$#remaining_balance#</strong>, to the <strong>Amount on Card</strong> field on the Nearshore Small Balance Followup sheet.</p>
```

### node 43 — Stage BizPay payment (script code)

```diff
--- before/node 43 content
+++ after/node 43 content
@@ -1,24 +1,31 @@
-let bizpay_data = actions.bizpay__get_payment_by_id;
-let client_id = bizpay_data.client_id;
+let response = actions.bizpay__get_payment_by_id;
+let code = response._zt_meta.response.code;
+let found = code >= 200 && code < 300;
 
-let { service_fee, remaining_balance } = bizpay_data;
-
-let client_name = "other";
-if (client_id == 1398) {
-    client_name = "Ipay"
+// BizPay answered: stage the payment once, under the names the agent screens already use
+if (found) {
+  let client = String(response.client_name).toLowerCase();
+  let client_exception = response.client_id === 1398 || client.includes("ipay") ? "ipay"
+    : response.client_id === 4016 || client.includes("civitas") ? "civitas" : "other";
+  ZT.setFormData("client_exception", client_exception);
+  ZT.setFormData("remaining_balance", String(response.remaining_balance));
+  ZT.setFormData("funding", String(response.funding_amount));
+  ZT.setFormData("manual_load_value", String(response.manual_value_load_amount));
+  ZT.setFormData("fee_amount", String(response.service_fee));
+  ZT.setFormData("cancel_card_request_exists", response.cancel_card_request_exists === true);
+  ZT.setFormData("cancel_card_request_approved", response.cancel_card_request_approved === true);
+  ZT.setFormData("card_status_date", response.card_status_date);
 }
 
-// only PROD Civitas Client ID
-if (client_id == 4016) {
-    client_name = "Civitas"
-};
+// No payment, a balance to verify, or nothing left on the card
+let entry_route = !found ? "not_found" : response.remaining_balance > 0 ? "verify_balance" : "no_remainder";
+ZT.setFormData("entry_route", entry_route);
 
-let is_remaining_balance = remaining_balance > 0;
-
-ZT.setFormData("is_remaining_balance", is_remaining_balance);
-ZT.setFormData("remaining_balance", remaining_balance);
-
-ZT.setFormData("client_name", client_name);
-ZT.setTransformData("bizpay_data", bizpay_data);
-
-// calculate date stamp approval => if date >= today's date
+// Error detail for the not-found screen (the engine hands a JSON error body over parsed)
+let rawBody = found ? "" : (response._zt_meta.response.body || "");
+let errorFields = rawBody === String(rawBody) ? (rawBody.startsWith("{") ? JSON.parse(rawBody) : { message: rawBody }) : rawBody;
+let html_escape = s => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;");
+let payment_html = found
+  ? `<table><tr><th>Client</th><td>${html_escape(response.client_name)}</td></tr><tr><th>Payment amount</th><td>$${response.payment_amount}</td></tr><tr><th>Funding</th><td>$${response.funding_amount}</td></tr><tr><th>Manual value load</th><td>$${response.manual_value_load_amount}</td></tr><tr><th>Service fee</th><td>$${response.service_fee}</td></tr><tr><th>Remaining balance</th><td><strong>$${response.remaining_balance}</strong></td></tr><tr><th>Card status</th><td>${html_escape(response.card_status)} (${html_escape(response.card_status_date)})</td></tr><tr><th>Cancel card request</th><td>${response.cancel_card_request_exists ? (response.cancel_card_request_approved ? "Initiated and approved" : "Initiated, not approved") : "None"}</td></tr></table>`
+  : `<p>BizPay returned HTTP ${code}: ${html_escape(errorFields.message || "")} ${html_escape(errorFields.error || "")}</p>`;
+ZT.setTransformData("payment_html", payment_html.replace(/\n/g, " "));
```

### node 44 — Route: payment found? (content)

```diff
--- before/node 44 content
+++ after/node 44 content
@@ -1 +0,0 @@
-Use transformed data
```

### node 45 — Route: Small Balance outcome (content)

```diff
--- before/node 45 content
+++ after/node 45 content
@@ -1 +0,0 @@
-Yes, they match
```

## CHANGES THAT NEED AN EXPLANATION

Every line below must map to a requirement or an explicit request.
Anything unexplained is unintended drift — revert it before delivering.

  [ ] added node 2 (Payment not found)
  [ ] added node 3 (Route the remaining balance)
  [ ] added node 4 (Build the Cancel Card request)
  [ ] added node 5 (Review and submit Cancel Card)
  [ ] added node 35 (Post Cancel Card to BizPay)
  [ ] added node 36 (Grade the Cancel Card)
  [ ] added node 46 (Route: Cancel Card accepted?)
  [ ] added node 47 (Cancel Card not accepted)
  [ ] added node 48 (claude.md)
  [ ] removed node 7 (Payment Notes Review)
  [ ] removed node 8 (Cancel Card Request Approved?)
  [ ] removed node 9 (Logic: Cancel Card Routing)
  [ ] removed node 10 (Cancel/Issue Check - Payment Notes)
  [ ] removed node 11 (Cancel Fee - Under $1 - Payment Notes)
  [ ] removed node 12 (Cancel Fee - Payment Notes)
  [ ] removed node 13 (Partial Refund - Payment Notes)
  [ ] removed node 14 (Initiate Cancel Card (Cancel Fee - Under $1))
  [ ] removed node 15 (Initiate Cancel Card (Reissue Check))
  [ ] removed node 16 (Initiate Cancel Card (Cancel Fee))
  [ ] removed node 17 (Initiate Cancel Card (Partial Refund))
  [ ] removed node 32 (Initiate Cancel Card (RPPS))
  [ ] removed node 33 (Initiate Cancel Card (Full Refund))
  [ ] removed node 37 (Reissue RPPS - Payment Notes)
  [ ] removed node 38 (Full Refund - Payment Notes)
  [ ] removed node 39 (Cancel/Issue Partial Check - Payment Notes)
  [ ] removed node 40 (Initiate Cancel Card (Reissue Partial Check))
  [ ] node 1 — node_name: "" → "Start: Small Balance Process"
  [ ] node 6 — node_name: "" → "Card Age"
  [ ] node 6 — content changed (209 → 366 characters) — Card Age
  [ ] node 18 — node_name: "" → "Disposition Card: Cancelled"
  [ ] node 18 — content changed (432 → 462 characters) — Disposition Card: Cancelled
  [ ] node 19 — node_name: "" → "Finish Tree"
  [ ] node 20 — node_name: "" → "Disposition Card: No Action Required"
  [ ] node 21 — node_name: "" → "Escalate for Manual Cancellation (Cancel Card)"
  [ ] node 22 — node_name: "" → "Disposition Card: Escalation"
  [ ] node 23 — node_name: "" → "Escalate to App Support: No Remainder"
  [ ] node 24 — node_name: "" → "Debit or Credit?"
  [ ] node 25 — node_name: "" → "Galileo Transaction Research"
  [ ] node 26 — node_name: "" → "Comdata Transactions Research"
  [ ] node 27 — node_name: "" → "Escalate: Negative Balance"
  [ ] node 28 — node_name: "" → "Age of Cancel Card Request?"
  [ ] node 29 — node_name: "" → "Verify Balance"
  [ ] node 29 — content changed (172 → 227 characters) — Verify Balance
  [ ] node 29 — button added/changed: "Yes, they match" → node 3
  [ ] node 29 — button removed/replaced: "Yes, they match" → node 45
  [ ] node 30 — node_name: "" → "Escalate to App Support: Incorrect Balance"
  [ ] node 31 — node_name: "" → "Refund/Reissue RPPS"
  [ ] node 31 — button added/changed: "Continue" → node 4
  [ ] node 31 — button removed/replaced: "Yes, RPPS is an option" → node 37
  [ ] node 31 — button removed/replaced: "No, RPPS is not listed" → node 38
  [ ] node 31 — form field added: rpps_available (radio)
  [ ] node 34 — node_name: "" → "Positive Balance (After research)"
  [ ] node 34 — button added/changed: "Continue" → node 3
  [ ] node 34 — button removed/replaced: "Continue" → node 7
  [ ] node 41 — node_name: "" → "Review Client Notes (Partial Refund/Reissue)"
  [ ] node 41 — button added/changed: "Continue" → node 4
  [ ] node 41 — button removed/replaced: "No" → node 13
  [ ] node 41 — button removed/replaced: "Yes" → node 39
  [ ] node 41 — form field added: client_restricts_partial (radio)
  [ ] node 42 — page_title: "Bizpay Get Payment by ID" → "Get BizPay payment"
  [ ] node 42 — node_name: "" → "Calls GET /payments/zingtree/{payment_id} (CO 1299)"
  [ ] node 43 — page_title: "Format Bizpay Data" → "Stage BizPay payment"
  [ ] node 43 — node_name: "" → "Grades the GET and stages the payment fields"
  [ ] node 43 — script code changed (24 → 31 lines) — Stage BizPay payment
  [ ] node 44 — page_title: "Use transformed data" → "Route: payment found?"
  [ ] node 44 — node_name: "" → "Routes on entry_route"
  [ ] node 44 — content changed (20 → 0 characters) — Route: payment found?
  [ ] node 44 — button added/changed: "entry_route == "not_found"" → node 2 [logic: entry_route == "not_found"]
  [ ] node 44 — button added/changed: "entry_route == "verify_balance"" → node 29 [logic: entry_route == "verify_balance"]
  [ ] node 44 — button added/changed: "" → node 6
  [ ] node 44 — button removed/replaced: "is_remaining_balance" → node 29
  [ ] node 44 — button removed/replaced: "" → node 6
  [ ] node 44 — advanced_logic_node: 0 → 1
  [ ] node 45 — page_title: "Is Cancel Card Request Exist?" → "Route: Small Balance outcome"
  [ ] node 45 — node_name: "" → "Routes on resolution_route"
  [ ] node 45 — content changed (15 → 0 characters) — Route: Small Balance outcome
  [ ] node 45 — continuation_node_id: 9 → 4 — Route: Small Balance outcome
  [ ] node 45 — button added/changed: "resolution_route == "approved_request"" → node 28 [logic: resolution_route == "approved_request"]
  [ ] node 45 — button added/changed: "resolution_route == "request_pending"" → node 20 [logic: resolution_route == "request_pending"]
  [ ] node 45 — button added/changed: "resolution_route == "ipay_rpps_check"" → node 31 [logic: resolution_route == "ipay_rpps_check"]
  [ ] node 45 — button added/changed: "resolution_route == "client_notes_check"" → node 41 [logic: resolution_route == "client_notes_check"]
  [ ] node 45 — button added/changed: "" → node 4
  [ ] node 45 — button removed/replaced: "transforms.bizpay_data.cancel_card_request_exists == true" → node 8
  [ ] node 45 — button removed/replaced: "" → node 9
  [ ] tree setting —  predefined_vars: {"0": {"checkbox_score": 1, "config": null, "custom_regex": "", "hidden_value": "", "id": 34493640, "inline": 0, "label": "", "label_type": "", "name": "is_remaining_balance", "options": "", "project_id": 563559070, "project_node_id": 0, "rank": 0, "required": false, "score_var": "", "scores": "", "type": "predefined"}} → {}

