// Source: ETG "Register Errands - Dynamic" (tree 595124299), node 36 — PRODUCTION,
//         hand-fixed by Brent 2026-08-06 after the v36–v38.1 build overshot.
// Account: ETG (Etraveli)
// Purpose: REFERENCE SHAPE for "read a value off a Connected Object response and
//          drive a cursor loop with it." Keep this file as the calibration example
//          for how much code a Zingtree script node should be.
//
// Why it's here: the delivered version of this same node was 135 lines — ~45 of them
// narrating v19 -> v36 -> v37 -> v38, plus a resolveTargetTicketId() helper wrapping
// line 1 below in three fallbacks and String() coercion on both sides of a comparison
// that == already handles. Same behaviour on the happy path, 78% more to read.
// Production is 29 lines. Read line 1 and note what is NOT there:
//   - no optional-chaining ladder, no `|| {}`, no null checks before the dereference
//   - no String() on either side of `x.id == ...` — loose compare is the point
//   - no version history, no dates, no references to nodes that no longer exist
//
// The race this node used to be armed against (Zendesk materializing a side
// conversation's backing ticket asynchronously) is NOT handled here at all. It is
// handled by node 60 — a Content node with escalate_after="3" SEC sitting between
// the create call and the fetch. One node, one field. See patterns.md ->
// "ONE REQUEST, ONE NODE".
//
// Inputs:  actions.get_side_conversation_detail (CO #181, fetched ONCE by node 40)
//          actions.create_child_ticket           (CO #157, node 33)
//          transforms.current_child_ticket       (node 32's cursor item)
//          grandchild_tickets_count              (this loop's cursor)
// Outputs: grandchild_parent_id, grandchild_tickets_count, is_more_grandchild_tickets,
//          orderReference (read by CO #180), transforms.child_ticket (the POST payload)

let grandchild_parent_id = actions.get_side_conversation_detail.side_conversations.find(x => x.id == actions.create_child_ticket.side_conversation.id).external_ids.targetTicketId;
ZT.setFormData("grandchild_parent_id", grandchild_parent_id)

let is_more_grandchild_tickets = true;
let grandchild_tickets_count = ZT.getVariableValue("grandchild_tickets_count", 0);
let grandchild_tickets = transforms.current_child_ticket.grandchild_tickets || [];
let current_grandchild_ticket = grandchild_tickets[grandchild_tickets_count];

grandchild_tickets_count++;
if (grandchild_tickets_count >= grandchild_tickets.length) {
    is_more_grandchild_tickets = false;
    grandchild_tickets_count = 0;
}

ZT.setFormData("grandchild_tickets_count", grandchild_tickets_count);
ZT.setFormData("is_more_grandchild_tickets", is_more_grandchild_tickets);

const orderReference =
    ZT.getVariableValue("orderReference", "") ||
    ZT.getVariableValue("custom_field_33772689958162", "");

let child_ticket = {
    subject: `${current_grandchild_ticket.title || "Grandchild Ticket"}`,
    body: `Order Reference: ${orderReference || "N/A"}, Bucket: ${current_grandchild_ticket.bucket}, Customer Action: ${current_grandchild_ticket.customer_action}, Category: ${current_grandchild_ticket.category}, Type: ${current_grandchild_ticket.type}`,
    orderReference: orderReference
};

ZT.setTransformData("child_ticket", child_ticket);
