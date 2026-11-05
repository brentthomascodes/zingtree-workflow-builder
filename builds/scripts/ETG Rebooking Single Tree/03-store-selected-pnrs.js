// ETG Rebooking (single tree) - node 3 "Store the selected PNRs and flag linked bookings"
// Reads the agent's selection from the findorder Dynamic View on node 2.

const selected_pnrs = views.findorder || [];
ZT.setTransformData("selected_pnrs", selected_pnrs);

const first = selected_pnrs[0] || {};
ZT.setTransformData("is_linked_pnr_selected", !!first.providerReference);
