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

// ZT.setTransformData("grandchild_ticket_payload", { subject: `grandchild Ticket: ${current_grandchild_ticket.pnr}`, body: `Bucket: ${current_grandchild_ticket.bucket}, Customer Action: ${current_grandchild_ticket.customer_action}, Category: ${current_grandchild_ticket.category}` });
ZT.setFormData("grandchild_tickets_count", grandchild_tickets_count);
ZT.setFormData("is_more_grandchild_tickets", is_more_grandchild_tickets);

// {
//   "title": "Silent Ticket: 9D89VM, AUU84K",
//   "pnr": "9D89VM, AUU84K",
//   "bucket": "proceed",
//   "category": "contact_reason__rebooking",
//   "customer_action": "Void completed",
//   "type": "Void",
//   "formatted_passengers": "<div><strong>First Name:</strong> MARIO ENRIQUE</div><div><strong>Last Name:</strong> MUJICA DIAZ</div>"
// }

let child_ticket = {
    subject: `${current_grandchild_ticket.title}`,
    body: `Bucket: ${current_grandchild_ticket.bucket}, Customer Action: ${current_grandchild_ticket.customer_action}, Category: ${current_grandchild_ticket.category}, Type: ${current_grandchild_ticket.type}`
}

ZT.setTransformData("child_ticket", child_ticket)
// Create Ticket ID for Grand child case to use as parent