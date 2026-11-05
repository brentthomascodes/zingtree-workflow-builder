// SOURCE: Cowork session "API data migration for actions arrays" (local_13dc0e72) - user-pasted existing logic
// ACCOUNT: eTraveli Group (ETG) - Cancellation Errand Register
// PURPOSE: Zingtree Script Node snippet. Accumulates the current PNR's errand data onto the running
//          customer_action_pnrs transform array (one entry per PNR handled in the session).
//          Later merged into etg_actions_array_from_api.js / etg_build_actions_array.js.

let current_pnr = {
    ...transforms.current_pnr,
    channel,
    category,
    type,
    notes,
    actions_array: transforms.actions_array
    // customer_action,
    // customer_action_bucket
}

let customer_action_pnrs = transforms.customer_action_pnrs || [];
customer_action_pnrs.push(current_pnr);
ZT.setTransformData("customer_action_pnrs", customer_action_pnrs)
