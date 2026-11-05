# Master Design — Returns Multi-Tree Family (SFDC)

**Second reference implementation** (alongside `Master - ETG Cancellation Errand/`). Five trees, exported Jul 2026. JSONs in `Workflow JSONs/Returns Redesign (SFDC)/`. This one demonstrates **multi-tree orchestration**: one primary tree organizes the data, subtrees each perform one bucket's unique business logic.

## The tree family

| Tree | ID | Role |
|---|---|---|
| Returns | 857069947 | **Hub/orchestrator** — fetch order once, bucket line items, dispatch subtrees |
| Not Shipped Bucket | 731150281 | Cancel items not yet shipped (SFDC cancellation request) |
| Returnable Bucket | 831637528 | In-policy returns: stock vs non-stock, vendor RMAs, child cases |
| Approval Process | 268661429 | Non-returnable/out-of-policy: approvals queue, child cases |
| Add Order Line Items | 816966811 | **Reusable subroutine** — POST each line item of a group to SFDC |

## Hub-and-spoke orchestration (the headline pattern)

1. **Hub fetches once** (#2 Get Order Details) and one script (#3 Line Item Buckets) maps/filters everything downstream needs:
   - policy rules in code: status checks + `ZT.isOlderThan30Days(record.Delivered_Date__c)` (user transformation function via `ZT.` prefix)
   - buckets object → `ZT.setTransformData("buckets", buckets)`
   - **each bucket also becomes a Dynamic View**: `ZT.setResponseData("dynamic_view__not_shipped", { records: buckets.not_shipped })` — script-computed subsets rendered as selectable grids, selections read back via `views.dynamic_view__*`
2. **Display Buckets to Agent** (one content node), then Tree nodes chain the subtrees sequentially: Not Shipped → Returnable → Approvals → complete. Each Tree node sets `open_tree_id` + `return_tree_node_id`, so the subtree hands control back to the hub, which immediately dispatches the next bucket.
3. **Every subtree's root is a guard**: `len(views.dynamic_view__X) >= 1` → run, else → Tree node straight back to the hub. Subtrees are safe to call unconditionally; empty buckets cost nothing.
4. **Subroutine calling convention** (Add Order Line Items): caller sets `transforms.current_items_group` (and case/user context), opens the subtree; it runs a standard cursor loop POSTing each item, then returns to the caller's `return_tree_node_id`. Called from 3+ places.

## Patterns repeated from the ETG master (the common themes)

- Cursor loops with counter in transforms, `is_more_*` flag, counter reset to 0 on exhaustion.
- Logic nodes = one expression only. This family shows expressions can be `len(...)` over transforms/views, not just booleans: `len(transforms.stock_type_buckets.stock) >= 1`.
- Complex evaluation in scripts (bucketing policy, stock/non-stock split, vendor grouping via `Map` → `Array.from(map.values())`), logic nodes only route on the result.
- Dynamic HTML built in scripts, `setTransformData`, rendered by thin content nodes; `${x ?? ""}` fallbacks; "N of M Vendor Groups" progress headers inside the HTML.
- One script per loop iteration does cursor + HTML + payload staging together (node 19 Format HTML Response: advance vendor group, build display HTML, set `subject`/`description`/`order_id`/`contact_id` form data for the next Connected Object).
- `vendor_key` set as form data so the Get Vendor Details Connected Object auto-receives it by exact name match.
- `sf_*` / `sf_*__c` naming for Salesforce-bound fields; scalars via `setFormData`, objects/arrays via `setTransformData` throughout.

## Notable script files here

- `returns__node3_Line_Item_Buckets.js` — the bucketing script + Dynamic View creation (`setResponseData`)
- `returnable_bucket__node8_Group_Stock_&_Non-Stock_Items.js` — stock split + vendor grouping
- `returnable_bucket__node12_Set_Vendor_Key.js` — minimal cursor variant (peek without increment)
- `returnable_bucket__node19_Format_HTML_Response.js` — combined cursor/HTML/payload script
- `add_order_line_items__node2_Iterate_Order_Line_Items.js` — the subroutine's loop cursor
- `returns__node4_Display_Buckets_to_Agent.html` — hub display content node
