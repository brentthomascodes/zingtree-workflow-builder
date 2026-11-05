let final_pnrs = transforms.final_pnrs || [];
let internal_note_details = "";

const genesys_interaction_id =
  typeof custom_field_30866832265234 !== "undefined"
    ? custom_field_30866832265234
    : "N/A";

final_pnrs.forEach(current_pnr_final => {
  const passengersFormatted = (current_pnr_final.passengers || [])
    .map(p => `First Name: ${p.passengerFirstName}, Last Name: ${p.passengerLastName}`)
    .join("\n");

  const current_pnr_details = [
    { label: "Channel", value: "channel" },
    { label: "Category", value: "category" },
    { label: "Type", value: "type" },
    { label: "Customer Action", value: "customer_action" },
    { label: "Customer Action Bucket", value: "bucket" },
    { label: "Notes", value: "notes" },
    { label: "Description", value: "description" }
  ];

  let pnr_note_details = `**PNR**: ${current_pnr_final.pnr},
  **Contact Reason**: ${custom_field_29658558478738},
  **Genesys Interaction Type**: ${genesys_interaction_id},
**Passengers**:
${passengersFormatted}
`;

  pnr_note_details += current_pnr_details
    .filter(({ value }) => current_pnr_final[value] != null && current_pnr_final[value] !== "")
    .map(({ label, value }) => `**${label}**: ${current_pnr_final[value]}`)
    .join("\n");

  internal_note_details += pnr_note_details + "\n\n";
});

internal_note_details += `
  **Genesys Interaction ID**: ${genesys_interaction_id},
  **Ticket ID**: ${zd_ticket_id}

  **Child Ticket Summary**:
  
  ${transforms.child_tickets_note}
  `

ZT.setTransformData("internal_note_details", internal_note_details);
("update_ticket_tag", "errand_register_completed");