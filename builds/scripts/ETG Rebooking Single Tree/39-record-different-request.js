// ETG Rebooking (single tree) - node 39 "Record the different request for this PNR"
// Runs when a request tree hands control back (only the Cancellation tree does;
// the others end the session).

const selected_pnrs_final = transforms.selected_pnrs_final || [];
selected_pnrs_final.push({
  ...(transforms.current_pnr_in_bucket || {}),
  different_request: ZT.getVariableValue("different_request", "")
});

ZT.setTransformData("selected_pnrs_final", selected_pnrs_final);
