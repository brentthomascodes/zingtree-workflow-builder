# Master Workflow — ETG "Register Errand: Cancellations"

**This is the reference implementation.** Tree ID 139367450, 32 nodes, exported Jul 2026. Companion doc: `Workflow JSONs/ETG/ETG Cancellation Errand Flow.pdf`. When building any new workflow, match these patterns.

## Node graph (by node ID)

```
4  Data: Edvin - Find Order (dco 23, alias "findorder")
→ 6  Content: Agent - Select PNRs (Dynamic View grid, multi-select)
→ 24 Script: init — selected_pnrs = views.findorder; map channel/category from ZD custom fields
→ 7  Script: PNR LOOP CURSOR — current_pnr, pnr_index, isMorePNR, pnr_banner
→ 8  Content: Agent - Select Passengers (Dynamic View, ${transforms.current_pnr.pnr})
→ 9  Script: format passengers → merge into current_pnr
→ 1  Content: Agent - Select Channel & Type (select ff `type`, notes)
→ 42 Data: GET Edvin Errands (dco 159)
→ 2  Script: build actions_array from actions.edvin__errand_configuration; push current_pnr → customer_action_pnrs
→ 11 Logic: transforms.isMorePNR == true → 7 (next PNR) | else → 12

12 Script: CREATE PNR ACTION TABLE (dynamic HTML cards + <select class="zt-data">)
→ 25 Content: Display table — ${transforms.customer_action_table_html}
→ 27 Script: STITCH selections (ZT.getVariableValue per row) → bucket → group → build child_tickets + grandchild_tickets + child_tickets_note

→ 31 Data: Update Tags (dco 54)
→ 32 Script: CHILD LOOP CURSOR — current_child_ticket, child_tickets_count, is_more_child_tickets, is_grandchild_tickets
→ 33 Data: ZD - Create Child Ticket (dco 20, "Use transformed data")
→ 35 Logic: is_grandchild_tickets → 39 | else → 34
   39 Script: side_conversation_id from actions.create_child_ticket
   → 41 Content: progress message → 40 Data: Get Side Conversations (dco 158)
   → 36 Script: GRANDCHILD LOOP CURSOR (parent = targetTicketId from side conversation)
   → 37 Data: ZD - Create Grandchild (dco 151)
   → 38 Logic: is_more_grandchild_tickets → 36 | else → 34
→ 34 Logic: is_more_child_tickets == true → 32 | else → 21

21 Script: format internal note (final_pnrs + child_tickets_note)
→ 22 Data: Zendesk - Add Internal Note (dco 57)
→ 44 Script: ERRAND LOOP CURSOR (final_pnrs / final_pnrs_count / is_more_pnrs)
→ 43 Data: Edvin - Register Errand (dco 160)
→ 45 Logic: is_more_pnrs → 44 | else → 23
23 Content: Closing Call (success + ${transforms.internal_note_details})

28/29: Clear Data — reset all loop transforms to [] before restarting at 4.
```

## The canonical loop (use this shape every time)

Script cursor node → body (Data/Content nodes) → Logic node with ONE boolean → back to cursor or exit.

```javascript
// cursor script (node 32 pattern)
let is_more_child_tickets = true;
let child_tickets_count = ZT.getVariableValue("child_tickets_count", 0);
let child_tickets = transforms.child_tickets || [];
let current_child_ticket = child_tickets[child_tickets_count].child_ticket;

child_tickets_count++;
if (child_tickets_count >= child_tickets.length) {
    is_more_child_tickets = false;
    child_tickets_count = 0;          // ← reset so the loop can run again
}
ZT.setFormData("child_tickets_count", child_tickets_count);
ZT.setFormData("is_more_child_tickets", is_more_child_tickets);
ZT.setTransformData("current_child_ticket", current_child_ticket);
```

Logic node buttons: `is_more_child_tickets == true` → cursor node; empty expression = default → exit node. If the boolean lives in transforms instead of form data, the expression is `transforms.isMorePNR == true` (node 11).

Nesting: the child-loop cursor sets the `is_grandchild_tickets` flag; a logic node between the loops gates entry into the inner loop; both inner exits return to the shared `Is More Child Tickets?` node (34).

## Dynamic HTML (node 12 → 25 → 27)

1. Script builds one HTML string: `escapeHtml()` everything, `<style>` block with `:root` CSS variables + classes (cards, pills, meta grid), per-row `<select class="zt-data" name="customer_action_<safePnr>_<rowIndex]">` (sanitize the key: `replace(/[^a-zA-Z0-9_-]/g, "_")`), empty-state div, then `ZT.setTransformData("customer_action_table_html", html)`.
2. Content node renders it with nothing but `<p>${transforms.customer_action_table_html}</p>`.
3. Next script stitches selections back: rebuild each row's variable name, `ZT.getVariableValue(name, "")`.

## Other master patterns

- **Logic placement**: all evaluation lives in scripts; every logic node in the tree is a single boolean comparison. Buttons on logic nodes: `logic_expression` set on the true branch, empty on the default branch.
- **Clear Data node** (29): reset every loop transform to `[]`/empty at restart — transforms persist for 1h and will leak into the next run otherwise.
- **Bucket → map → loop**: agent choices → `.map()` stitch → `groupByBucket` (proceed / no_action / escalate / different_request / default) → build ticket array (silent tickets first, proceed last via sort) → loops consume the array.
- **Data node conventions**: `content` holds the action ("Use transformed data", "Handle response"); Connected Object aliases read back via `actions.<alias>` (e.g. `actions.create_child_ticket.side_conversation.id`); Dynamic View selections via `views.findorder`.
- **ZD custom fields** arrive as bare vars (`custom_field_29658558478738`); guard with `typeof x !== "undefined"` and map values through lookup objects (`mapInteractionType`).
- **Progress content nodes** between automation steps ("Child Ticket Created. Now Creating Grand Child Ticket(s)...") so agents see what's happening.
- **JS dialect**: this master uses modern JS freely — `let`/`const`, arrows, template literals, spread, destructuring-rest, `Set`, optional chaining, `Object.entries`. Modern syntax is safe in this org; fall back to ES5 only if a specific account's tree throws "let is undefined" (seen once on Quest).
