// ETG Rebooking (single tree) - node 6 "Next PNR: reset the answers and show progress"
// Cursor over the PNRs the agent selected. Re-runnable: the counter resets to 0
// when the list is exhausted.

const selected_pnrs = transforms.selected_pnrs || [];
let pnr_index = transforms.pnr_index || 0;

ZT.setTransformData("current_pnr", selected_pnrs[pnr_index]);
ZT.setTransformData("pnr_banner",
  "<h3>PNR " + (pnr_index + 1) + " of " + selected_pnrs.length + "</h3>");

pnr_index += 1;
let isMorePNR = true;
if (pnr_index >= selected_pnrs.length) {
  isMorePNR = false;
  pnr_index = 0;
}
ZT.setTransformData("isMorePNR", isMorePNR);
ZT.setTransformData("pnr_index", pnr_index);

// Start this PNR on a clean slate - the engine picks its own entry step.
ZT.setFormData("step", "");
ZT.setTransformData("notice_html", "");
