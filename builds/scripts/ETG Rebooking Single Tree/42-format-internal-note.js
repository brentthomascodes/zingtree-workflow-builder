// ETG Rebooking (single tree) - node 42 "Format the internal note for Zendesk"
// One markdown block per PNR, then the totals. LABELS is the whole note format -
// add a row to change what is written back to Zendesk.

const LABELS = [
  ["Flexible Ticket", "hasFlexibleTicket"],
  ["Ticket status", "ticket_status"],
  ["Rebooking reason", "rebooking_reason"],
  ["New Flights", "new_flights"],
  ["Decision", "proceedHandling"],
  ["Outcome", "outcome"],
  ["Customer Action", "customerAction"],
  ["System Cost", "system_cost"],
  ["Customer Cost", "cost_to_pax"],
  ["Customer's currency", "currency"],
  ["How rebooking was calculated", "calculation_method"],
  ["How rebooking was calculated", "calculation_way"],
  ["Pricing command used", "system_command"],
  ["EMD(s) to be transferred", "emd"],
  ["Air Amount in Edvin and currency", "air_edvin"],
  ["Is FM policy applicable?", "fm_policy"],
  ["How to rebook due to FM", "fm_rebook"],
  ["Fare rules permit changes?", "changes_permitted"],
  ["Farebasis", "farebase"],
  ["Fare difference and system currency", "fare_difference"],
  ["Trained on manual rebooking", "man_rebooking"],
  ["Tax difference and system currency", "tax_difference"],
  ["Airline's penalty and system currency", "yy_reb_penalty"],
  ["Waiver", "waiver"],
  ["Check-in cancelled?", "cancel_checkin"],
  ["GDPR waiver exists", "gdpr_waiver"],
  ["Portal name", "portal"],
  ["Consolid exception", "consolid_exceptions"],
  ["PNR retrievable in the portal", "retrieve_pnr"],
  ["Alternative for Flexible Ticket offered", "flex_alternative"],
  ["Rebooking should be done by", "who_rebook"],
  ["Rebooking permitted", "reb_permitted"],
  ["How the customer will pay", "payment_method"],
  ["Payment received", "payment_confirmed"],
  ["Reason for escalation to support", "escalate_to_support"],
  ["Information to Support", "free_text"],
  ["Different request", "different_request"],
  ["Channel of communication", "channel"],
  ["Customer reachable after callback?", "channel_disconnected"],
  ["Persistent button outcome", "update_ticket_tag"],
  ["New Departure Date", "firstDepartureDate"],
  ["New Return Date", "lastSegmentArrivalDate"]
];

const selected_pnrs_final = transforms.selected_pnrs_final || [];

let internal_note_details = selected_pnrs_final.map(pnr => {
  const passengers = (pnr.passengers || [])
    .map(p => "First Name: " + p.passengerFirstName + ", Last Name: " + p.passengerLastName)
    .join("\n");

  const details = LABELS
    .filter(([, key]) => pnr[key] !== undefined && pnr[key] !== null && pnr[key] !== "")
    .map(([label, key]) => "**" + label + "**: " + pnr[key])
    .join("\n");

  return "**PNR**: " + pnr.pnr +
    "\n**Post Sales Handling**: " + (pnr.postSaleHandleType || "") +
    "\n**Passengers**:\n" + passengers + "\n" + details;
}).join("\n\n");

internal_note_details += "\n\n**Total Cost Pax**: " +
  ZT.getVariableValue("total_cost_pax_all", "N/A") +
  "\n**Genesys Interaction ID**: " +
  ZT.getVariableValue("custom_field_30866832265234", "N/A") +
  "\n**Ticket ID**: " + ZT.getVariableValue("zd_ticket_id", "N/A");

ZT.setTransformData("internal_note_details", internal_note_details);
