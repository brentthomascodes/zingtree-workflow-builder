// ETG Rebooking (single tree) - node 17 "Group the PNRs by decision"
// Reads the radio the agent picked for each PNR on node 16, turns it into a
// handling route, and buckets the PNRs so each handling is worked once.
// Output: transforms.grouped_pnrs = [[{pnr}, {pnr}], [{pnr}]]

const CHILD_TICKET_HANDLINGS = ["Take Payment", "Escalate to support", "GDPR Docs", "Refund Flex"];

const rows = (transforms.selected_pnrs_customer_action || []).map(row => {
  const key = "customer_action_" + String(row.pnr).replace(/[^a-zA-Z0-9_-]/g, "_");
  const customerAction = ZT.getVariableValue(key, "noSelection");

  const pnr_route =
    customerAction === "proceed" ? (row.proceedHandling || "Do Not Proceed") :
    customerAction === "changes" ? "Changes" : "Do Not Proceed";

  return { ...row, customerAction, pnr_route };
});

ZT.setTransformData("selected_pnrs_customer_action", rows);

const buckets = {};
rows.forEach(row => {
  const key = row.pnr_route;
  if (!buckets[key]) buckets[key] = [];
  buckets[key].push(row);
});

const grouped_pnrs = Object.keys(buckets).map(key => buckets[key]);
ZT.setTransformData("grouped_pnrs", grouped_pnrs);
ZT.setTransformData("grouped_count", 0);

const child_ticket_pnrs = rows
  .filter(r => r.customerAction === "proceed" && CHILD_TICKET_HANDLINGS.indexOf(r.pnr_route) > -1);
ZT.setTransformData("isCreateChildTicket", child_ticket_pnrs.length > 1);
