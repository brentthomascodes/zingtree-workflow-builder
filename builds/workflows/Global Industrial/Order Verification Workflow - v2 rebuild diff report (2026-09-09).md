# Order Verification Workflow — baseline vs. v2 rebuild diff report (2026-09-09)

```
========================================================================
WORKFLOW DIFF — Order Verification Workflow
========================================================================

Before : baseline.json  (101 nodes)
After  : gic_order_verification_v2.json  (67 nodes)

## PLAIN SUMMARY

0 of 67 nodes are byte-for-byte identical to the original (0% untouched).
43 nodes added, 77 removed, 0 renumbered, 24 modified.

In plain terms:
  + NEW      node 2 — Session and case valid? [Scoring]
  + NEW      node 4 — Agent session not detected [Content]
  + NEW      node 5 — Look up user and case details [Data]
  + NEW      node 6 — Classify the case context [Script]
  + NEW      node 7 — Collect the reason for contact [Content]
  + NEW      node 8 — Resolve order key and division [Script]
  + NEW      node 9 — Order number already known? [Scoring]
  + NEW      node 10 — Search order by key [Data]
  + NEW      node 12 — Stage the criteria search [Script]
  + NEW      node 13 — Search order by criteria [Data]
  + NEW      node 14 — Grade the order search [Script]
  + NEW      node 15 — How many orders matched? [Scoring]
  + NEW      node 16 — No orders found [Content]
  + NEW      node 17 — Select the order [Content]
  + NEW      node 18 — Resolve the selected order [Script]
  + NEW      node 19 — Get cases for this order [Data]
  + NEW      node 20 — Count cases on this order [Script]
  + NEW      node 21 — Any cases already on this order? [Scoring]
  + NEW      node 22 — Cases already exist on this order [Content]
  + NEW      node 23 — Resolution summary for merge [Content]
  + NEW      node 24 — Stage the case-merge payload [Script]
  + NEW      node 25 — Merge case [Data]
  + NEW      node 30 — Stage the case-update payload [Script]
  + NEW      node 31 — Update case [Data]
  + NEW      node 32 — Case updated [Content]
  + NEW      node 35 — Check products and contacts came back [Script]
  + NEW      node 36 — Products and contact ready? [Scoring]
  + NEW      node 38 — No contacts on this account [Content]
  + NEW      node 39 — Select the contact and call source [Content]
  + NEW      node 45 — Case create succeeded? [Scoring]
  + NEW      node 46 — Case create failed [Content]
  + NEW      node 47 — Waiting for case number to generate [Content]
  + NEW      node 48 — Re-read the case for its GTK key [Data]
  + NEW      node 49 — Record whether the GTK key populated [Script]
  + NEW      node 51 — Case number not yet generated [Content]
  + NEW      node 52 — Build the line-item queue [Script]
  + NEW      node 53 — Review line items and quantities [Content]
  + NEW      node 54 — Render the line-items table [Script]
  + NEW      node 55 — Apply the agent's edited quantities [Script]
  + NEW      node 56 — Next line item [Script]
  + NEW      node 57 — Add line item to case [Data]
  + NEW      node 59 — More line items? [Scoring]
  + NEW      node 64 — Add case comment [Data]
  - GONE     node 68 — Pull Data from PCS [Data] (was reachable from node 70)
  - GONE     node 70 — Print Data [Script] (was reachable from nodes 11, 134)
  - GONE     node 71 — Print OrderKey [Script] (was reachable from node 26)
  - GONE     node 72 — Handle response [Script] (was reachable from node 68)
  - GONE     node 73 — Get OrderSFId from Products [Script] (was reachable from node 129)
  - GONE     node 74 — Set Data for Case [Script] (was reachable from nodes 98, 125)
  - GONE     node 75 — Check if there are more than 1 Orders [Scoring] (was reachable from node 72)
  - GONE     node 76 — Get Cases with same Order [Data] (was reachable from node 75)
  - GONE     node 77 — Get Account By Key [Data] (was reachable from nodes 50, 67, 126)
  - GONE     node 78 — Create New Case [Data] (was reachable from node 144)
  - GONE     node 79 — Initialize Index to 0 [Script] (was reachable from node 139)
  - GONE     node 80 — Check for Length of Array (products selected) DCN [Script] (was reachable from nodes 79, 137)
  - GONE     node 81 — Update GIC Case Product Table [Data] (was reachable from node 150)
  - GONE     node 84 — On an Existing Case [Scoring] (was reachable from node 76)
  - GONE     node 85 — check we have existing cases [Scoring] (was reachable from node 84)
  - GONE     node 86 — Display existing cases to merge [Content] (was reachable from node 85)
  - GONE     node 88 — Merge Selected Case [Content] (was reachable from nodes 86, 111)
  - GONE     node 89 — set Parameters for Case Merge [Script] (was reachable from node 88)
  - GONE     node 90 — New Node [Content] (was reachable from node 101)
  - GONE     node 91 — Merge Case [Data] (was reachable from node 89)
  - GONE     node 92 — Link to Parent [Content] (was reachable from node 91)
  - GONE     node 93 — Existing or New Case [Scoring] (was reachable from node 74)
  - GONE     node 94 — get Parameters for Update [Script] (was reachable from node 93)
  - GONE     node 95 — Merge Case [Data] (was reachable from node 108)
  - GONE     node 96 — Format Quantity Input HTML [Script] (was reachable from node 34)
  - GONE     node 97 — Quantity Input HTML [Content] (was reachable from node 96)
  - GONE     node 98 — Extract HTML Quantity & Data [Script] (was reachable from node 97)
  - GONE     node 99 — Is Agent Selected Case? [Scoring] (was reachable from node 61)
  - GONE     node 100 — Clear Order Key [Script] (was unlinked)
  - GONE     node 101 — Parent & Sub Case [Content] (was reachable from node 103)
  - GONE     node 102 — Update Case Comments [Data] (was reachable from node 140)
  - GONE     node 103 — Questions to determine Process Selection [Content] (was unlinked)
  - GONE     node 104 — Add Comment Before moving to Case [Script] (was reachable from node 105)
  - GONE     node 105 — Comments [Content] (was reachable from nodes 110, 111)
  - GONE     node 106 — Use transformed data [Data] (was reachable from node 104)
  - GONE     node 107 — Processing [Content] (was reachable from node 81)
  - GONE     node 108 — Use transformed data [Scoring] (was reachable from node 94)
  - GONE     node 109 — Update Case [Data] (was reachable from node 108)
  - GONE     node 110 — On Existing Case [Scoring] (was reachable from node 99)
  - GONE     node 111 — Do you want to Merge [Content] (was reachable from node 110)
  - GONE     node 113 — Handle response [Scoring] (was reachable from node 102)
  - GONE     node 114 — Case Updated [Content] (was reachable from node 113)
  - GONE     node 115 — Continue [Tree] (was reachable from node 117)
  - GONE     node 116 — New Node [Data] (was reachable from node 114)
  - GONE     node 117 — Handle response [Script] (was reachable from node 116)
  - GONE     node 118 — Processing [Content] (was reachable from nodes 78, 95, 109, 120, 145)
  - GONE     node 119 — Logging Orders [Script] (was reachable from nodes 99, 111)
  - GONE     node 120 — Check if GTK Key is created [Scoring] (was reachable from node 121)
  - GONE     node 121 — Sets BreakLoop [Script] (was reachable from node 42)
  - GONE     node 122 — Existing Case [Scoring] (was reachable from node 146)
  - GONE     node 123 — Is Existing Case [Data] (was reachable from node 122)
  - GONE     node 124 — Check if Order is preselected [Scoring] (was reachable from node 123)
  - GONE     node 125 — Create Json for Insert Products [Script] (was reachable from node 34)
  - GONE     node 126 — Identify Call Source [Content] (was reachable from node 65)
  - GONE     node 127 — Form To Collect Information [Content] (was reachable from node 124)
  - GONE     node 128 — No Orders Found [Content] (was reachable from node 75)
  - GONE     node 129 — Check if ZT session is alive [Scoring] (was reachable from node 77)
  - GONE     node 130 — actions.get_order_products is NULL [Content] (was reachable from node 131)
  - GONE     node 131 — Check ZT Session is NULL [Scoring] (was reachable from node 120)
  - GONE     node 132 — actions.get_order_products == null [Content] (was reachable from node 129)
  - GONE     node 133 — Handle response [Script] (was reachable from node 3)
  - GONE     node 134 — Additional Data entered? [Scoring] (was reachable from node 133)
  - GONE     node 137 — Escalated from #107 [Script] (was reachable from node 107)
  - GONE     node 138 — Case Closed [Content] (was reachable from node 122)
  - GONE     node 139 — Get Case Products [Data] (was reachable from node 142)
  - GONE     node 140 — Check if Product Avl to Process [Scoring] (was reachable from node 151)
  - GONE     node 141 — Back [Script] (was reachable from node 105)
  - GONE     node 142 — Set Case Id in Transforms [Script] (was reachable from node 131)
  - GONE     node 143 — Checking If Owner Exists [Script] (was reachable from node 93)
  - GONE     node 144 — Use transformed data [Scoring] (was reachable from node 143)
  - GONE     node 145 — Create New Case With Owner [Data] (was reachable from node 144)
  - GONE     node 146 — check UserEmail [Scoring] (was reachable from node 148)
  - GONE     node 147 — User Email Not Available [Content] (was reachable from node 146)
  - GONE     node 148 — set Existing Case [Script] (was reachable from node 100)
  - GONE     node 149 — Use transformed data [Script] (was reachable from node 80)
  - GONE     node 150 — transforms.indexAvlForProcessing == true && transforms.currentCaseProductAvailable == true [Script] (was reachable from node 140)
  - GONE     node 151 — Use transformed data [Content] (was reachable from node 149)
  * CHANGED  node 1 — Start session [Script]
               - Content → Script (Start session)
               - page_title: "Form To Collect Information" → "Start session"
               - node_name: "" → "Resets loop/session state to its empty shape and classifies the inbound case context (existing case vs. new, closed case, order already known) so downstream screens can be skipped when the launcher already answered them."
               - script code changed (1 → 15 lines) — Start session
               - notes changed (9 → 0 lines) — Start session
               - continuation_node_id: 0 → 2 — Start session
               - button removed/replaced: "Proceed to Verify order" → node 3
               - form field removed: request_reason (text)
               - form field removed: website (select)
               - form field removed: caller_first_name (text)
               - form field removed: caller_last_name (text)
               - form field removed: orderKey (text)
               - form field removed: case_id (text)
               - form field removed: caller_email (text)
               - form field removed: GINumber (text)
               - form field removed: deliveryPO (text)
               - form field removed: trackingNumber (text)
               - form field removed: empty_variable (hidden)
               - form field removed: number_of_days (hidden)
               - form_columns: 2 → 1
               - is_root: 0 → 1
  * CHANGED  node 3 — Case already closed [Content]
               - Data → Content (Case already closed)
               - page_title: "Get User Details DCN" → "Case already closed"
               - node_name: "" → "Terminal screen — matches the case's current status; agent restarts for a new contact."
               - content changed (0 → 69 characters) — Case already closed
               - notes changed (0 → 9 lines) — Case already closed
               - continuation_node_id: 133 → 0 — Case already closed
               - form_columns: 1 → 2
  * CHANGED  node 11 — Search for the order [Content]
               - page_title: "Order Identification - Additional" → "Search for the order"
               - node_name: "" → "Replaces two screens (baseline nodes 11 and 26): the order number field is primary; the rest is a 'search by other criteria' fallback for when the customer has no order number, shown as one screen instead of a second node the agent is routed to."
               - content changed (430 → 413 characters) — Search for the order
               - notes changed (0 → 9 lines) — Search for the order
               - button added/changed: "Search" → node 12
               - button removed/replaced: "Order Search" → node 70
               - form field added: order_key_input (text)
               - form field added: account_key_input (text)
               - form field added: ship_to_zip (text)
               - form field added: bill_to_zip (text)
               - form field added: delivery_po (text)
               - form field added: buyer_po (text)
               - form field added: gi_load_number (text)
               - form field added: tracking_number (text)
               - form field added: invoice_key (text)
               - form field added: rma_key (text)
               - form field added: date_range (select)
               - form field removed: orderKey (text)
               - form field removed: accountKey (text)
               - form field removed: shipToZip (text)
               - form field removed: billToZip (text)
               - form field removed: deliveryPO (text)
               - form field removed: buyerPO (text)
               - form field removed: GINumber (text)
               - form field removed: trackingNumber (text)
               - form field removed: invoiceKey (text)
               - form field removed: rmaKey (text)
               - form field removed: dateRange (select)
  * CHANGED  node 26 — Merged — link to parent case [Content]
               - page_title: "Order Identification" → "Merged — link to parent case"
               - node_name: "" → "Content unchanged from the original (node 92), but the original dead-ended here with no continuation at all. Per claude.md 'Import safety', this rebuild sends every case-touching path through Case Type Routing, so a merged case gets reclassified the same as an updated one."
               - content changed (178 → 59 characters) — Merged — link to parent case
               - notes changed (0 → 9 lines) — Merged — link to parent case
               - button added/changed: "Continue" → node 27
               - button removed/replaced: "Next" → node 71
               - form field removed: orderKey (text)
               - form_columns: 1 → 2
  * CHANGED  node 27 — Read the parent case's type [Data]
               - page_title: "Search Order" → "Read the parent case's type"
               - node_name: "" → "Same Connected Object as fetch_case_type (221) -- a fourth genuinely distinct read (session start / after existing-case fetch / after create-or-update / now after merge), reusing the read rather than adding a fifth near-identical node."
               - content changed (4 → 0 characters) — Read the parent case's type
               - continuation_node_id: 60 → 66 — Read the parent case's type
  * CHANGED  node 28 — Update path: existing case selected? [Scoring]
               - page_title: "Check for valid Order Details Logic" → "Update path: existing case selected?"
               - node_name: "" → "Mirrors the original's node 110 check."
               - content changed (15 → 0 characters) — Update path: existing case selected?
               - continuation_node_id: 11 → 23 — Update path: existing case selected?
               - button added/changed: "" → node 23
               - button added/changed: "selected_case_id != ''" → node 29 [logic: selected_case_id != '']
               - button removed/replaced: "actions.findordersbycriteria.OrderList[0] != nil && len(actions.findordersbycriteria.OrderList) > 0" → node 29
               - button removed/replaced: "" → node 11
  * CHANGED  node 29 — Comments for the update [Content]
               - page_title: "Orders" → "Comments for the update"
               - node_name: "" → "Kept from the original (node 105)."
               - content changed (2599 → 0 characters) — Comments for the update
               - notes changed (0 → 9 lines) — Comments for the update
               - button added/changed: "Continue" → node 30
               - button removed/replaced: "Select the Order" → node 44
               - form field added: verification_comments (multiline_full)
               - form_columns: 1 → 2
  * CHANGED  node 33 — Read the updated case type [Data]
               - page_title: "Find Order via Criteria search + Find Contacts DCN" → "Read the updated case type"
               - node_name: "" → "Same Connected Object as the original (221) — a distinct read, after the update, not a retry of it."
               - content changed (4 → 0 characters) — Read the updated case type
               - continuation_node_id: 65 → 66 — Read the updated case type
  * CHANGED  node 34 — Get order products, contacts and account [Data]
               - Content → Data (Get order products, contacts and account)
               - page_title: "Order Product Details" → "Get order products, contacts and account"
               - node_name: "" → "Same Connected Objects as the original (225 order products, 608/613 contacts, 227 account) fetched together — this is the one data structure the rest of the tree walks (the selected order's line items)."
               - content changed (899 → 0 characters) — Get order products, contacts and account
               - continuation_node_id: 0 → 35 — Get order products, contacts and account
               - button removed/replaced: "Cancellation" → node 96
               - button removed/replaced: "Billing Issue" → node 96
               - button removed/replaced: "Claim" → node 96
               - button removed/replaced: "Technical Assistance" → node 96
               - button removed/replaced: "Information Request" → node 125
               - button removed/replaced: "Order Issue" → node 96
               - button removed/replaced: "Return" → node 96
               - buttons_across: 4 → 0
               - score_var: type → (empty)
  * CHANGED  node 37 — No products on this order [Content]
               - Scoring → Content (No products on this order)
               - page_title: "Check for orderKey Logic" → "No products on this order"
               - node_name: "" → "Kept from the original (node 66)."
               - content changed (4 → 56 characters) — No products on this order
               - notes changed (0 → 9 lines) — No products on this order
               - continuation_node_id: 11 → 0 — No products on this order
               - button added/changed: "Choose a different order" → node 11
               - button removed/replaced: "orderKey != 0" → node 58
               - button removed/replaced: "" → node 11
               - advanced_logic_node: 1 → 0
               - form_columns: 1 → 2
  * CHANGED  node 40 — Resolve the selected contact [Script]
               - page_title: "Set Order Number" → "Resolve the selected contact"
               - node_name: "" → "Same matching logic as the original (node 73), without the nested try/catch noise."
               - script code changed (61 → 10 lines) — Resolve the selected contact
               - continuation_node_id: 27 → 41 — Resolve the selected contact
  * CHANGED  node 41 — Select the line items and the reason [Content]
               - Tree → Content (Select the line items and the reason)
               - page_title: "Case Type Routing Tree" → "Select the line items and the reason"
               - node_name: "" → "Same dynamic grid and category buttons as the original (node 34) — the category chosen here (Cancellation / Billing Issue / Claim / Technical Assistance / Information Request / Order Issue / Return) is preserved verbatim via button_data."
               - content changed (20 → 899 characters) — Select the line items and the reason
               - notes changed (0 → 9 lines) — Select the line items and the reason
               - button added/changed: "Billing Issue" → node 42
               - button added/changed: "Cancellation" → node 42
               - button added/changed: "Claim" → node 42
               - button added/changed: "Information Request" → node 42
               - button added/changed: "Order Issue" → node 42
               - button added/changed: "Return" → node 42
               - button added/changed: "Technical Assistance" → node 42
               - form_columns: 1 → 2
  * CHANGED  node 42 — Stage the new-case fields [Script]
               - Data → Script (Stage the new-case fields)
               - page_title: "Create New Case +Update Case Order + Products + Account + Contact DCN" → "Stage the new-case fields"
               - node_name: "" → "Same field names as the original (nodes 73/74 combined) in `transforms`, for the same reason as the merge/update scripts above — Connected Object 609's body template dot-paths into these exact names. NOT consolidated into one JSON payload: unlike the line-item Data node (228, which the original already fed a single object), this account's create/merge/update case calls were fed individual named merge fields, so a single stringified blob here would silently reach the template as nothing at all. See claude.md."
               - script code changed (1 → 18 lines) — Stage the new-case fields
               - continuation_node_id: 121 → 43 — Stage the new-case fields
  * CHANGED  node 43 — Create new case [Data]
               - Scoring → Data (Create new case)
               - page_title: "Order Exists Verification Logic" → "Create new case"
               - node_name: "" → "Same Connected Object as the original (609)."
               - content changed (15 → 0 characters) — Create new case
               - continuation_node_id: 26 → 44 — Create new case
               - button removed/replaced: "// check if there's an order in the case
actions.get_case_details.records[0].Order__c != nil && actions.get_case_details.records[0].Order__c != ''" → node 40
               - button removed/replaced: "orderKey != 0" → node 40
               - button removed/replaced: "" → node 26
               - advanced_logic_node: 1 → 0
  * CHANGED  node 44 — Grade the case create [Script]
               - page_title: "Normalize order number" → "Grade the case create"
               - node_name: "" → "One boolean from the response code, per the script standard's one-thing-scripts-route-on rule. On success it records the id created; the case's type/subtype is picked up from the same read that checks the GTK key below rather than a separate read right after create (the original's node 116/117) — one fewer reuse of Connected Object 221."
               - script code changed (31 → 7 lines) — Grade the case create
               - continuation_node_id: 33 → 45 — Grade the case create
  * CHANGED  node 50 — GTK key populated? [Scoring]
               - Content → Scoring (GTK key populated?)
               - page_title: "Select the Contact for the Case" → "GTK key populated?"
               - node_name: "" → "The original silently proceeded either way after its 3-try poll. This surfaces a miss to the agent (one screen) instead of hiding it — the requirement this replaces was never written down, so a review with Brent/GIC on the right handling is still open; this is the safe interim per house rule on documented interims."
               - content changed (939 → 0 characters) — GTK key populated?
               - confirmation_text changed (48 → 0 characters) — GTK key populated?
               - continuation_node_id: 0 → 65 — GTK key populated?
               - button added/changed: "" → node 65
               - button added/changed: "gtk_key_ready == false" → node 51 [logic: gtk_key_ready == false]
               - button removed/replaced: "Select the line items" → node 77
               - form field removed: call_source (select)
               - advanced_logic_node: 0 → 1
  * CHANGED  node 58 — Grade the add and advance [Script]
               - page_title: "Set Order Number" → "Grade the add and advance"
               - node_name: "" → "One boolean from the response code; writes the result back onto the item in the queue (the structure is the record — no side arrays) and advances the cursor and the checkpoint counter."
               - script code changed (38 → 19 lines) — Grade the add and advance
               - continuation_node_id: 27 → 59 — Grade the add and advance
  * CHANGED  node 60 — Line items added — continue? [Content]
               - Scoring → Content (Line items added — continue?)
               - page_title: "Check if there are more than 1 open Cases" → "Line items added — continue?"
               - node_name: "" → "A genuine agent click (not an auto-advance) every 10 items. This single node is what Brent asked for: a real human interaction inside the loop so the platform never sees more than a handful of unattended automatic jumps in a row, regardless of how many line items the order has. Tune the batch size (currently 10) in route_more_line_items / grade_case_product if a different cadence is wanted."
               - content changed (15 → 95 characters) — Line items added — continue?
               - notes changed (0 → 9 lines) — Line items added — continue?
               - continuation_node_id: 28 → 0 — Line items added — continue?
               - button added/changed: "Continue" → node 56
               - button removed/replaced: "len(actions.get_cases_with_same_order.records) > 0" → node 61
               - button removed/replaced: "" → node 28
               - advanced_logic_node: 1 → 0
               - form_columns: 1 → 2
  * CHANGED  node 61 — Summarize the line items added [Script]
               - Content → Script (Summarize the line items added)
               - page_title: "There are several Open Cases" → "Summarize the line items added"
               - node_name: "" → "Renders the same-shape summary from the one structure the loop walked — no second pass over the data."
               - script code changed (1 → 10 lines) — Summarize the line items added
               - continuation_node_id: 0 → 62 — Summarize the line items added
               - button removed/replaced: "Continue" → node 99
  * CHANGED  node 62 — Line items added — add verification comments [Content]
               - page_title: "Case Information" → "Line items added — add verification comments"
               - node_name: "" → "Merges the original's separate summary screen and comments screen (nodes 105/104) into one — 'one screen, many values' per house rule, since nothing branches between them."
               - content changed (525 → 99 characters) — Line items added — add verification comments
               - notes changed (0 → 9 lines) — Line items added — add verification comments
               - button added/changed: "Continue" → node 63
               - form field added: verification_comments (multiline_full)
               - form_columns: 1 → 2
  * CHANGED  node 63 — Stage the case comment [Script]
               - Content → Script (Stage the case comment)
               - page_title: "New Case was created" → "Stage the case comment"
               - node_name: "" → "Same field names as the original (node 104) in `transforms` — Connected Object 606's body template dot-paths into `sfId` / `insertCommentJson`, same as the update path above."
               - script code changed (1 → 7 lines) — Stage the case comment
               - continuation_node_id: 0 → 64 — Stage the case comment
  * CHANGED  node 65 — Get products already on the case [Data]
               - Scoring → Data (Get products already on the case)
               - page_title: "Check Arrays Length Logic" → "Get products already on the case"
               - node_name: "" → "Feeds the de-dup check in prep_line_item_queue. Same Connected Object as the original (222)."
               - content changed (15 → 0 characters) — Get products already on the case
               - continuation_node_id: 50 → 52 — Get products already on the case
               - button removed/replaced: "// checks if the product array is empty

let products = actions.get_order_products;
let records = products?.records ?? [];
len(records) == 0" → node 66
               - button removed/replaced: "// checks if the product array is empty

let contacts = actions.universal_connector_contacts_by_account;
let records = contacts?.records ?? [];
len(records) == 0" → node 67
               - button removed/replaced: "transforms.contactIdSfdc != '' && transforms.contactIdSfdc != null" → node 126
               - button removed/replaced: "" → node 50
               - advanced_logic_node: 1 → 0
  * CHANGED  node 66 — Hand off to Case Type Routing [Tree]
               - Content → Tree (Hand off to Case Type Routing)
               - page_title: "No Products" → "Hand off to Case Type Routing"
               - node_name: "" → "OPEN ITEM: tree id set to 1, the only open_tree_id value found wired up anywhere in the baseline (node 115, reachable from exactly one of its several case-create/merge/update end states). The node baseline literally labeled 'Case Type Routing Tree' (41) had open_tree_id left at 0 and zero predecessors -- unreachable, probably an earlier abandoned attempt at this same handoff. '1' is a very low id next to this org's other tree ids (this tree is 411323165) -- confirm it's really Case Type Routing before any live import. This rebuild also routes the merge and explicit-update paths here, which the baseline itself never did (see claude.md 'Import safety' for why)."
               - content changed (56 → 0 characters) — Hand off to Case Type Routing
               - open_tree_id: 0 → 1 — Hand off to Case Type Routing
               - button removed/replaced: "Choose a different order" → node 26
  * CHANGED  node 67 — claude.md [Content]
               - page_title: "No Contacts" → "claude.md"
               - node_name: "" → "Unlinked memory node — not part of the execution flow. Read first on every future task."
               - content changed (1 → 185 lines) — claude.md
               - notes changed (0 → 9 lines) — claude.md
               - button removed/replaced: "Proceed anyway" → node 77
               - form_columns: 1 → 2
               - hide_from_search: 0 → 1

## TREE SHAPE

  node type                before    after    delta
  Content                      31       22       -9
  Data                         18       14       -4
  Scoring                      22        9      -13
  Script                       28       21       -7
  Tree                          2        1       -1
  TOTAL                       101       67      -34

  ROOT CHANGED: node 100 → node 1   <-- verify this was intended

## STRUCTURAL SANITY

  No broken links introduced.
  NEWLY UNREACHABLE FROM ROOT (1): 67 (claude.md)
    (expected for the unlinked claude.md node — anything else is a stranded path)
  Pre-existing in the BEFORE tree (not caused by this edit): 0 broken link(s), 4 unreachable node(s).

## UNTOUCHED NODES (0)

  (none — every node was modified; if that was not the intent, stop here)

## TREE-LEVEL SETTINGS CHANGED (2)

  merge_vars_not_fixed: 0 → 1
  root_node_id: 100 → 1

## COSMETIC / EDITOR-ONLY CHANGES (33) — ignore

  (canvas x/y, sizes, display_order, updated flags on 33 node references)

## CHANGES THAT NEED AN EXPLANATION

Every line below must map to a requirement or an explicit request.
Anything unexplained is unintended drift — revert it before delivering.

  [ ] added node 2 (Session and case valid?)
  [ ] added node 4 (Agent session not detected)
  [ ] added node 5 (Look up user and case details)
  [ ] added node 6 (Classify the case context)
  [ ] added node 7 (Collect the reason for contact)
  [ ] added node 8 (Resolve order key and division)
  [ ] added node 9 (Order number already known?)
  [ ] added node 10 (Search order by key)
  [ ] added node 12 (Stage the criteria search)
  [ ] added node 13 (Search order by criteria)
  [ ] added node 14 (Grade the order search)
  [ ] added node 15 (How many orders matched?)
  [ ] added node 16 (No orders found)
  [ ] added node 17 (Select the order)
  [ ] added node 18 (Resolve the selected order)
  [ ] added node 19 (Get cases for this order)
  [ ] added node 20 (Count cases on this order)
  [ ] added node 21 (Any cases already on this order?)
  [ ] added node 22 (Cases already exist on this order)
  [ ] added node 23 (Resolution summary for merge)
  [ ] added node 24 (Stage the case-merge payload)
  [ ] added node 25 (Merge case)
  [ ] added node 30 (Stage the case-update payload)
  [ ] added node 31 (Update case)
  [ ] added node 32 (Case updated)
  [ ] added node 35 (Check products and contacts came back)
  [ ] added node 36 (Products and contact ready?)
  [ ] added node 38 (No contacts on this account)
  [ ] added node 39 (Select the contact and call source)
  [ ] added node 45 (Case create succeeded?)
  [ ] added node 46 (Case create failed)
  [ ] added node 47 (Waiting for case number to generate)
  [ ] added node 48 (Re-read the case for its GTK key)
  [ ] added node 49 (Record whether the GTK key populated)
  [ ] added node 51 (Case number not yet generated)
  [ ] added node 52 (Build the line-item queue)
  [ ] added node 53 (Review line items and quantities)
  [ ] added node 54 (Render the line-items table)
  [ ] added node 55 (Apply the agent's edited quantities)
  [ ] added node 56 (Next line item)
  [ ] added node 57 (Add line item to case)
  [ ] added node 59 (More line items?)
  [ ] added node 64 (Add case comment)
  [ ] removed node 68 (Pull Data from PCS)
  [ ] removed node 70 (Print Data)
  [ ] removed node 71 (Print OrderKey)
  [ ] removed node 72 (Handle response)
  [ ] removed node 73 (Get OrderSFId from Products)
  [ ] removed node 74 (Set Data for Case)
  [ ] removed node 75 (Check if there are more than 1 Orders)
  [ ] removed node 76 (Get Cases with same Order)
  [ ] removed node 77 (Get Account By Key)
  [ ] removed node 78 (Create New Case)
  [ ] removed node 79 (Initialize Index to 0)
  [ ] removed node 80 (Check for Length of Array (products selected) DCN)
  [ ] removed node 81 (Update GIC Case Product Table)
  [ ] removed node 84 (On an Existing Case)
  [ ] removed node 85 (check we have existing cases)
  [ ] removed node 86 (Display existing cases to merge)
  [ ] removed node 88 (Merge Selected Case)
  [ ] removed node 89 (set Parameters for Case Merge)
  [ ] removed node 90 (New Node)
  [ ] removed node 91 (Merge Case)
  [ ] removed node 92 (Link to Parent)
  [ ] removed node 93 (Existing or New Case)
  [ ] removed node 94 (get Parameters for Update)
  [ ] removed node 95 (Merge Case)
  [ ] removed node 96 (Format Quantity Input HTML)
  [ ] removed node 97 (Quantity Input HTML)
  [ ] removed node 98 (Extract HTML Quantity & Data)
  [ ] removed node 99 (Is Agent Selected Case?)
  [ ] removed node 100 (Clear Order Key)
  [ ] removed node 101 (Parent & Sub Case)
  [ ] removed node 102 (Update Case Comments)
  [ ] removed node 103 (Questions to determine Process Selection)
  [ ] removed node 104 (Add Comment Before moving to Case)
  [ ] removed node 105 (Comments)
  [ ] removed node 106 (Use transformed data)
  [ ] removed node 107 (Processing)
  [ ] removed node 108 (Use transformed data)
  [ ] removed node 109 (Update Case)
  [ ] removed node 110 (On Existing Case)
  [ ] removed node 111 (Do you want to Merge)
  [ ] removed node 113 (Handle response)
  [ ] removed node 114 (Case Updated)
  [ ] removed node 115 (Continue)
  [ ] removed node 116 (New Node)
  [ ] removed node 117 (Handle response)
  [ ] removed node 118 (Processing)
  [ ] removed node 119 (Logging Orders)
  [ ] removed node 120 (Check if GTK Key is created)
  [ ] removed node 121 (Sets BreakLoop)
  [ ] removed node 122 (Existing Case)
  [ ] removed node 123 (Is Existing Case)
  [ ] removed node 124 (Check if Order is preselected)
  [ ] removed node 125 (Create Json for Insert Products)
  [ ] removed node 126 (Identify Call Source)
  [ ] removed node 127 (Form To Collect Information)
  [ ] removed node 128 (No Orders Found)
  [ ] removed node 129 (Check if ZT session is alive)
  [ ] removed node 130 (actions.get_order_products is NULL)
  [ ] removed node 131 (Check ZT Session is NULL)
  [ ] removed node 132 (actions.get_order_products == null)
  [ ] removed node 133 (Handle response)
  [ ] removed node 134 (Additional Data entered?)
  [ ] removed node 137 (Escalated from #107)
  [ ] removed node 138 (Case Closed)
  [ ] removed node 139 (Get Case Products)
  [ ] removed node 140 (Check if Product Avl to Process)
  [ ] removed node 141 (Back)
  [ ] removed node 142 (Set Case Id in Transforms)
  [ ] removed node 143 (Checking If Owner Exists)
  [ ] removed node 144 (Use transformed data)
  [ ] removed node 145 (Create New Case With Owner)
  [ ] removed node 146 (check UserEmail)
  [ ] removed node 147 (User Email Not Available)
  [ ] removed node 148 (set Existing Case)
  [ ] removed node 149 (Use transformed data)
  [ ] removed node 150 (transforms.indexAvlForProcessing == true && transforms.currentCaseProductAvailable == true)
  [ ] removed node 151 (Use transformed data)
  [ ] node 1 — Content → Script (Start session)
  [ ] node 1 — page_title: "Form To Collect Information" → "Start session"
  [ ] node 1 — node_name: "" → "Resets loop/session state to its empty shape and classifies the inbound case context (existing case vs. new, closed case, order already known) so downstream screens can be skipped when the launcher already answered them."
  [ ] node 1 — script code changed (1 → 15 lines) — Start session
  [ ] node 1 — notes changed (9 → 0 lines) — Start session
  [ ] node 1 — continuation_node_id: 0 → 2 — Start session
  [ ] node 1 — button removed/replaced: "Proceed to Verify order" → node 3
  [ ] node 1 — form field removed: request_reason (text)
  [ ] node 1 — form field removed: website (select)
  [ ] node 1 — form field removed: caller_first_name (text)
  [ ] node 1 — form field removed: caller_last_name (text)
  [ ] node 1 — form field removed: orderKey (text)
  [ ] node 1 — form field removed: case_id (text)
  [ ] node 1 — form field removed: caller_email (text)
  [ ] node 1 — form field removed: GINumber (text)
  [ ] node 1 — form field removed: deliveryPO (text)
  [ ] node 1 — form field removed: trackingNumber (text)
  [ ] node 1 — form field removed: empty_variable (hidden)
  [ ] node 1 — form field removed: number_of_days (hidden)
  [ ] node 1 — form_columns: 2 → 1
  [ ] node 1 — is_root: 0 → 1
  [ ] node 3 — Data → Content (Case already closed)
  [ ] node 3 — page_title: "Get User Details DCN" → "Case already closed"
  [ ] node 3 — node_name: "" → "Terminal screen — matches the case's current status; agent restarts for a new contact."
  [ ] node 3 — content changed (0 → 69 characters) — Case already closed
  [ ] node 3 — notes changed (0 → 9 lines) — Case already closed
  [ ] node 3 — continuation_node_id: 133 → 0 — Case already closed
  [ ] node 3 — form_columns: 1 → 2
  [ ] node 11 — page_title: "Order Identification - Additional" → "Search for the order"
  [ ] node 11 — node_name: "" → "Replaces two screens (baseline nodes 11 and 26): the order number field is primary; the rest is a 'search by other criteria' fallback for when the customer has no order number, shown as one screen instead of a second node the agent is routed to."
  [ ] node 11 — content changed (430 → 413 characters) — Search for the order
  [ ] node 11 — notes changed (0 → 9 lines) — Search for the order
  [ ] node 11 — button added/changed: "Search" → node 12
  [ ] node 11 — button removed/replaced: "Order Search" → node 70
  [ ] node 11 — form field added: order_key_input (text)
  [ ] node 11 — form field added: account_key_input (text)
  [ ] node 11 — form field added: ship_to_zip (text)
  [ ] node 11 — form field added: bill_to_zip (text)
  [ ] node 11 — form field added: delivery_po (text)
  [ ] node 11 — form field added: buyer_po (text)
  [ ] node 11 — form field added: gi_load_number (text)
  [ ] node 11 — form field added: tracking_number (text)
  [ ] node 11 — form field added: invoice_key (text)
  [ ] node 11 — form field added: rma_key (text)
  [ ] node 11 — form field added: date_range (select)
  [ ] node 11 — form field removed: orderKey (text)
  [ ] node 11 — form field removed: accountKey (text)
  [ ] node 11 — form field removed: shipToZip (text)
  [ ] node 11 — form field removed: billToZip (text)
  [ ] node 11 — form field removed: deliveryPO (text)
  [ ] node 11 — form field removed: buyerPO (text)
  [ ] node 11 — form field removed: GINumber (text)
  [ ] node 11 — form field removed: trackingNumber (text)
  [ ] node 11 — form field removed: invoiceKey (text)
  [ ] node 11 — form field removed: rmaKey (text)
  [ ] node 11 — form field removed: dateRange (select)
  [ ] node 26 — page_title: "Order Identification" → "Merged — link to parent case"
  [ ] node 26 — node_name: "" → "Content unchanged from the original (node 92), but the original dead-ended here with no continuation at all. Per claude.md 'Import safety', this rebuild sends every case-touching path through Case Type Routing, so a merged case gets reclassified the same as an updated one."
  [ ] node 26 — content changed (178 → 59 characters) — Merged — link to parent case
  [ ] node 26 — notes changed (0 → 9 lines) — Merged — link to parent case
  [ ] node 26 — button added/changed: "Continue" → node 27
  [ ] node 26 — button removed/replaced: "Next" → node 71
  [ ] node 26 — form field removed: orderKey (text)
  [ ] node 26 — form_columns: 1 → 2
  [ ] node 27 — page_title: "Search Order" → "Read the parent case's type"
  [ ] node 27 — node_name: "" → "Same Connected Object as fetch_case_type (221) -- a fourth genuinely distinct read (session start / after existing-case fetch / after create-or-update / now after merge), reusing the read rather than adding a fifth near-identical node."
  [ ] node 27 — content changed (4 → 0 characters) — Read the parent case's type
  [ ] node 27 — continuation_node_id: 60 → 66 — Read the parent case's type
  [ ] node 28 — page_title: "Check for valid Order Details Logic" → "Update path: existing case selected?"
  [ ] node 28 — node_name: "" → "Mirrors the original's node 110 check."
  [ ] node 28 — content changed (15 → 0 characters) — Update path: existing case selected?
  [ ] node 28 — continuation_node_id: 11 → 23 — Update path: existing case selected?
  [ ] node 28 — button added/changed: "" → node 23
  [ ] node 28 — button added/changed: "selected_case_id != ''" → node 29 [logic: selected_case_id != '']
  [ ] node 28 — button removed/replaced: "actions.findordersbycriteria.OrderList[0] != nil && len(actions.findordersbycriteria.OrderList) > 0" → node 29
  [ ] node 28 — button removed/replaced: "" → node 11
  [ ] node 29 — page_title: "Orders" → "Comments for the update"
  [ ] node 29 — node_name: "" → "Kept from the original (node 105)."
  [ ] node 29 — content changed (2599 → 0 characters) — Comments for the update
  [ ] node 29 — notes changed (0 → 9 lines) — Comments for the update
  [ ] node 29 — button added/changed: "Continue" → node 30
  [ ] node 29 — button removed/replaced: "Select the Order" → node 44
  [ ] node 29 — form field added: verification_comments (multiline_full)
  [ ] node 29 — form_columns: 1 → 2
  [ ] node 33 — page_title: "Find Order via Criteria search + Find Contacts DCN" → "Read the updated case type"
  [ ] node 33 — node_name: "" → "Same Connected Object as the original (221) — a distinct read, after the update, not a retry of it."
  [ ] node 33 — content changed (4 → 0 characters) — Read the updated case type
  [ ] node 33 — continuation_node_id: 65 → 66 — Read the updated case type
  [ ] node 34 — Content → Data (Get order products, contacts and account)
  [ ] node 34 — page_title: "Order Product Details" → "Get order products, contacts and account"
  [ ] node 34 — node_name: "" → "Same Connected Objects as the original (225 order products, 608/613 contacts, 227 account) fetched together — this is the one data structure the rest of the tree walks (the selected order's line items)."
  [ ] node 34 — content changed (899 → 0 characters) — Get order products, contacts and account
  [ ] node 34 — continuation_node_id: 0 → 35 — Get order products, contacts and account
  [ ] node 34 — button removed/replaced: "Cancellation" → node 96
  [ ] node 34 — button removed/replaced: "Billing Issue" → node 96
  [ ] node 34 — button removed/replaced: "Claim" → node 96
  [ ] node 34 — button removed/replaced: "Technical Assistance" → node 96
  [ ] node 34 — button removed/replaced: "Information Request" → node 125
  [ ] node 34 — button removed/replaced: "Order Issue" → node 96
  [ ] node 34 — button removed/replaced: "Return" → node 96
  [ ] node 34 — buttons_across: 4 → 0
  [ ] node 34 — score_var: type → (empty)
  [ ] node 37 — Scoring → Content (No products on this order)
  [ ] node 37 — page_title: "Check for orderKey Logic" → "No products on this order"
  [ ] node 37 — node_name: "" → "Kept from the original (node 66)."
  [ ] node 37 — content changed (4 → 56 characters) — No products on this order
  [ ] node 37 — notes changed (0 → 9 lines) — No products on this order
  [ ] node 37 — continuation_node_id: 11 → 0 — No products on this order
  [ ] node 37 — button added/changed: "Choose a different order" → node 11
  [ ] node 37 — button removed/replaced: "orderKey != 0" → node 58
  [ ] node 37 — button removed/replaced: "" → node 11
  [ ] node 37 — advanced_logic_node: 1 → 0
  [ ] node 37 — form_columns: 1 → 2
  [ ] node 40 — page_title: "Set Order Number" → "Resolve the selected contact"
  [ ] node 40 — node_name: "" → "Same matching logic as the original (node 73), without the nested try/catch noise."
  [ ] node 40 — script code changed (61 → 10 lines) — Resolve the selected contact
  [ ] node 40 — continuation_node_id: 27 → 41 — Resolve the selected contact
  [ ] node 41 — Tree → Content (Select the line items and the reason)
  [ ] node 41 — page_title: "Case Type Routing Tree" → "Select the line items and the reason"
  [ ] node 41 — node_name: "" → "Same dynamic grid and category buttons as the original (node 34) — the category chosen here (Cancellation / Billing Issue / Claim / Technical Assistance / Information Request / Order Issue / Return) is preserved verbatim via button_data."
  [ ] node 41 — content changed (20 → 899 characters) — Select the line items and the reason
  [ ] node 41 — notes changed (0 → 9 lines) — Select the line items and the reason
  [ ] node 41 — button added/changed: "Billing Issue" → node 42
  [ ] node 41 — button added/changed: "Cancellation" → node 42
  [ ] node 41 — button added/changed: "Claim" → node 42
  [ ] node 41 — button added/changed: "Information Request" → node 42
  [ ] node 41 — button added/changed: "Order Issue" → node 42
  [ ] node 41 — button added/changed: "Return" → node 42
  [ ] node 41 — button added/changed: "Technical Assistance" → node 42
  [ ] node 41 — form_columns: 1 → 2
  [ ] node 42 — Data → Script (Stage the new-case fields)
  [ ] node 42 — page_title: "Create New Case +Update Case Order + Products + Account + Contact DCN" → "Stage the new-case fields"
  [ ] node 42 — node_name: "" → "Same field names as the original (nodes 73/74 combined) in `transforms`, for the same reason as the merge/update scripts above — Connected Object 609's body template dot-paths into these exact names. NOT consolidated into one JSON payload: unlike the line-item Data node (228, which the original already fed a single object), this account's create/merge/update case calls were fed individual named merge fields, so a single stringified blob here would silently reach the template as nothing at all. See claude.md."
  [ ] node 42 — script code changed (1 → 18 lines) — Stage the new-case fields
  [ ] node 42 — continuation_node_id: 121 → 43 — Stage the new-case fields
  [ ] node 43 — Scoring → Data (Create new case)
  [ ] node 43 — page_title: "Order Exists Verification Logic" → "Create new case"
  [ ] node 43 — node_name: "" → "Same Connected Object as the original (609)."
  [ ] node 43 — content changed (15 → 0 characters) — Create new case
  [ ] node 43 — continuation_node_id: 26 → 44 — Create new case
  [ ] node 43 — button removed/replaced: "// check if there's an order in the case
actions.get_case_details.records[0].Order__c != nil && actions.get_case_details.records[0].Order__c != ''" → node 40
  [ ] node 43 — button removed/replaced: "orderKey != 0" → node 40
  [ ] node 43 — button removed/replaced: "" → node 26
  [ ] node 43 — advanced_logic_node: 1 → 0
  [ ] node 44 — page_title: "Normalize order number" → "Grade the case create"
  [ ] node 44 — node_name: "" → "One boolean from the response code, per the script standard's one-thing-scripts-route-on rule. On success it records the id created; the case's type/subtype is picked up from the same read that checks the GTK key below rather than a separate read right after create (the original's node 116/117) — one fewer reuse of Connected Object 221."
  [ ] node 44 — script code changed (31 → 7 lines) — Grade the case create
  [ ] node 44 — continuation_node_id: 33 → 45 — Grade the case create
  [ ] node 50 — Content → Scoring (GTK key populated?)
  [ ] node 50 — page_title: "Select the Contact for the Case" → "GTK key populated?"
  [ ] node 50 — node_name: "" → "The original silently proceeded either way after its 3-try poll. This surfaces a miss to the agent (one screen) instead of hiding it — the requirement this replaces was never written down, so a review with Brent/GIC on the right handling is still open; this is the safe interim per house rule on documented interims."
  [ ] node 50 — content changed (939 → 0 characters) — GTK key populated?
  [ ] node 50 — confirmation_text changed (48 → 0 characters) — GTK key populated?
  [ ] node 50 — continuation_node_id: 0 → 65 — GTK key populated?
  [ ] node 50 — button added/changed: "" → node 65
  [ ] node 50 — button added/changed: "gtk_key_ready == false" → node 51 [logic: gtk_key_ready == false]
  [ ] node 50 — button removed/replaced: "Select the line items" → node 77
  [ ] node 50 — form field removed: call_source (select)
  [ ] node 50 — advanced_logic_node: 0 → 1
  [ ] node 58 — page_title: "Set Order Number" → "Grade the add and advance"
  [ ] node 58 — node_name: "" → "One boolean from the response code; writes the result back onto the item in the queue (the structure is the record — no side arrays) and advances the cursor and the checkpoint counter."
  [ ] node 58 — script code changed (38 → 19 lines) — Grade the add and advance
  [ ] node 58 — continuation_node_id: 27 → 59 — Grade the add and advance
  [ ] node 60 — Scoring → Content (Line items added — continue?)
  [ ] node 60 — page_title: "Check if there are more than 1 open Cases" → "Line items added — continue?"
  [ ] node 60 — node_name: "" → "A genuine agent click (not an auto-advance) every 10 items. This single node is what Brent asked for: a real human interaction inside the loop so the platform never sees more than a handful of unattended automatic jumps in a row, regardless of how many line items the order has. Tune the batch size (currently 10) in route_more_line_items / grade_case_product if a different cadence is wanted."
  [ ] node 60 — content changed (15 → 95 characters) — Line items added — continue?
  [ ] node 60 — notes changed (0 → 9 lines) — Line items added — continue?
  [ ] node 60 — continuation_node_id: 28 → 0 — Line items added — continue?
  [ ] node 60 — button added/changed: "Continue" → node 56
  [ ] node 60 — button removed/replaced: "len(actions.get_cases_with_same_order.records) > 0" → node 61
  [ ] node 60 — button removed/replaced: "" → node 28
  [ ] node 60 — advanced_logic_node: 1 → 0
  [ ] node 60 — form_columns: 1 → 2
  [ ] node 61 — Content → Script (Summarize the line items added)
  [ ] node 61 — page_title: "There are several Open Cases" → "Summarize the line items added"
  [ ] node 61 — node_name: "" → "Renders the same-shape summary from the one structure the loop walked — no second pass over the data."
  [ ] node 61 — script code changed (1 → 10 lines) — Summarize the line items added
  [ ] node 61 — continuation_node_id: 0 → 62 — Summarize the line items added
  [ ] node 61 — button removed/replaced: "Continue" → node 99
  [ ] node 62 — page_title: "Case Information" → "Line items added — add verification comments"
  [ ] node 62 — node_name: "" → "Merges the original's separate summary screen and comments screen (nodes 105/104) into one — 'one screen, many values' per house rule, since nothing branches between them."
  [ ] node 62 — content changed (525 → 99 characters) — Line items added — add verification comments
  [ ] node 62 — notes changed (0 → 9 lines) — Line items added — add verification comments
  [ ] node 62 — button added/changed: "Continue" → node 63
  [ ] node 62 — form field added: verification_comments (multiline_full)
  [ ] node 62 — form_columns: 1 → 2
  [ ] node 63 — Content → Script (Stage the case comment)
  [ ] node 63 — page_title: "New Case was created" → "Stage the case comment"
  [ ] node 63 — node_name: "" → "Same field names as the original (node 104) in `transforms` — Connected Object 606's body template dot-paths into `sfId` / `insertCommentJson`, same as the update path above."
  [ ] node 63 — script code changed (1 → 7 lines) — Stage the case comment
  [ ] node 63 — continuation_node_id: 0 → 64 — Stage the case comment
  [ ] node 65 — Scoring → Data (Get products already on the case)
  [ ] node 65 — page_title: "Check Arrays Length Logic" → "Get products already on the case"
  [ ] node 65 — node_name: "" → "Feeds the de-dup check in prep_line_item_queue. Same Connected Object as the original (222)."
  [ ] node 65 — content changed (15 → 0 characters) — Get products already on the case
  [ ] node 65 — continuation_node_id: 50 → 52 — Get products already on the case
  [ ] node 65 — button removed/replaced: "// checks if the product array is empty

let products = actions.get_order_products;
let records = products?.records ?? [];
len(records) == 0" → node 66
  [ ] node 65 — button removed/replaced: "// checks if the product array is empty

let contacts = actions.universal_connector_contacts_by_account;
let records = contacts?.records ?? [];
len(records) == 0" → node 67
  [ ] node 65 — button removed/replaced: "transforms.contactIdSfdc != '' && transforms.contactIdSfdc != null" → node 126
  [ ] node 65 — button removed/replaced: "" → node 50
  [ ] node 65 — advanced_logic_node: 1 → 0
  [ ] node 66 — Content → Tree (Hand off to Case Type Routing)
  [ ] node 66 — page_title: "No Products" → "Hand off to Case Type Routing"
  [ ] node 66 — node_name: "" → "OPEN ITEM: tree id set to 1, the only open_tree_id value found wired up anywhere in the baseline (node 115, reachable from exactly one of its several case-create/merge/update end states). The node baseline literally labeled 'Case Type Routing Tree' (41) had open_tree_id left at 0 and zero predecessors -- unreachable, probably an earlier abandoned attempt at this same handoff. '1' is a very low id next to this org's other tree ids (this tree is 411323165) -- confirm it's really Case Type Routing before any live import. This rebuild also routes the merge and explicit-update paths here, which the baseline itself never did (see claude.md 'Import safety' for why)."
  [ ] node 66 — content changed (56 → 0 characters) — Hand off to Case Type Routing
  [ ] node 66 — open_tree_id: 0 → 1 — Hand off to Case Type Routing
  [ ] node 66 — button removed/replaced: "Choose a different order" → node 26
  [ ] node 67 — page_title: "No Contacts" → "claude.md"
  [ ] node 67 — node_name: "" → "Unlinked memory node — not part of the execution flow. Read first on every future task."
  [ ] node 67 — content changed (1 → 185 lines) — claude.md
  [ ] node 67 — notes changed (0 → 9 lines) — claude.md
  [ ] node 67 — button removed/replaced: "Proceed anyway" → node 77
  [ ] node 67 — form_columns: 1 → 2
  [ ] node 67 — hide_from_search: 0 → 1
  [ ] tree setting —  merge_vars_not_fixed: 0 → 1
  [ ] tree setting —  root_node_id: 100 → 1

