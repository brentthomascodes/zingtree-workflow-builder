let is_more_child_tickets = true;
let child_tickets_count = ZT.getVariableValue("child_tickets_count", 0);
let child_tickets = transforms.child_tickets || [];
let current_child_ticket = child_tickets[child_tickets_count].child_ticket;

// Grand Child Logic
let is_grandchild_tickets = current_child_ticket.grandchild_tickets?.length > 0
ZT.setFormData("is_grandchild_tickets", is_grandchild_tickets);
//

child_tickets_count++;
if (child_tickets_count >= child_tickets.length) {
    is_more_child_tickets = false;
    child_tickets_count = 0;
}

// ZT.setTransformData("child_ticket_payload", { subject: `Child Ticket: ${current_child_ticket.pnr}`, body: `Bucket: ${current_child_ticket.bucket}, Customer Action: ${current_child_ticket.customer_action}, Category: ${current_child_ticket.category}` });
ZT.setFormData("child_tickets_count", child_tickets_count);
ZT.setFormData("is_more_child_tickets", is_more_child_tickets);
ZT.setTransformData("current_child_ticket", current_child_ticket)

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
    subject: `${current_child_ticket.title}`,
    body: `Bucket: ${current_child_ticket.bucket}, Customer Action: ${current_child_ticket.customer_action}, Category: ${current_child_ticket.category}, Type: ${current_child_ticket.type}`
}

ZT.setTransformData("child_ticket", child_ticket)