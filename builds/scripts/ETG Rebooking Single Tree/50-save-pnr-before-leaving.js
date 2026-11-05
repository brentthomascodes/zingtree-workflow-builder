// ETG Rebooking (single tree) - node 50 "Save the current PNR before leaving the flow"
// Runs on the global (persistent-button) actions: escalation, supervisor callback
// and interaction disconnected. Replaces the "Prepare for Internal Note" script in
// the old Persistent Buttons tree, which used eval() over a name list and returned
// to a stale tree id.

const HARVEST = ["outcome", "proceedHandling", "new_flights", "ticket_status", "rebooking_reason",
  "hasFlexibleTicket", "portal", "fm_policy", "changes_permitted", "cancel_checkin", "gdpr_waiver",
  "calculation_way", "calculation_method", "cost_to_pax", "currency", "system_cost",
  "escalate_to_support", "free_text", "channel", "channel_disconnected", "update_ticket_tag"];

const captured = {};
HARVEST.forEach(name => {
  const value = ZT.getVariableValue(name, "");
  if (value !== "") captured[name] = value;
});

const selected_pnrs_final = transforms.selected_pnrs_final || [];
selected_pnrs_final.push({ ...(transforms.current_pnr || {}), ...captured });
ZT.setTransformData("selected_pnrs_final", selected_pnrs_final);
