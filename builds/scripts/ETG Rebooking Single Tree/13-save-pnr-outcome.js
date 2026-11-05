// ETG Rebooking (single tree) - node 13 "Save this PNR's outcome"
// Harvests every answer the agent gave for this PNR onto the PNR object, then
// clears the variables so the next PNR starts clean.
// Replaces the old "Store Current PNR" script, which used eval() on a name list.

const HARVEST = ["outcome", "proceedHandling", "new_flights", "ticket_status", "rebooking_reason",
  "hasFlexibleTicket", "portal", "retrieve_pnr", "consolid_exceptions", "fm_policy", "fm_rebook",
  "changes_permitted", "cancel_checkin", "gdpr_waiver", "calculation_way", "calculation_method",
  "flex_alternative", "who_rebook", "reb_permitted", "man_rebooking", "system_command",
  "system_cost", "air_edvin", "cost_to_pax", "currency", "emd", "waiver", "fare_difference",
  "tax_difference", "yy_reb_penalty", "farebase", "firstDepartureDate", "lastSegmentArrivalDate"];

// hasFlexibleTicket and currency are re-used downstream, so they are not cleared.
const KEEP = ["hasFlexibleTicket", "currency"];

const captured = {};
HARVEST.forEach(name => {
  const value = ZT.getVariableValue(name, "");
  if (value !== "") {
    captured[name] = value;
    if (KEEP.indexOf(name) === -1) ZT.setFormData(name, "");
  }
});

const current_pnr = { ...(transforms.current_pnr || {}), ...captured };

const selected_pnrs_customer_action = transforms.selected_pnrs_customer_action || [];
selected_pnrs_customer_action.push(current_pnr);
ZT.setTransformData("selected_pnrs_customer_action", selected_pnrs_customer_action);
