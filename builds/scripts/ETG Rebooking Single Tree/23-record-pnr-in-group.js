// ETG Rebooking (single tree) - node 23 "Record each PNR in the group and stage its child ticket"
// One "Child Ticket Script" replacing the four near-identical copies that lived in
// 5. Take Payment, 6. Escalate to Support, 7. GDPR Docs and 10. Refund Flex.
// Re-runnable: the index resets to 0 when the bucket is exhausted.

const current_pnr_bucket = transforms.current_pnr_bucket || [];
let index = transforms.current_pnr_bucket_index || 0;

const BUCKET_ANSWERS = ["total_cost_pax_all", "payment_method", "payment_confirmed",
  "escalate_to_support", "free_text"];

const captured = {};
BUCKET_ANSWERS.forEach(name => {
  const value = ZT.getVariableValue(name, "");
  if (value !== "") captured[name] = value;
});

const current_pnr_in_bucket = { ...current_pnr_bucket[index], ...captured };

index += 1;
let isMorePNR_InBucket = true;
if (index >= current_pnr_bucket.length) {
  isMorePNR_InBucket = false;
  index = 0;
}

ZT.setTransformData("current_pnr_bucket_index", index);
ZT.setTransformData("current_pnr_in_bucket", current_pnr_in_bucket);
ZT.setTransformData("isMorePNR_InBucket", isMorePNR_InBucket);

const selected_pnrs_final = transforms.selected_pnrs_final || [];
selected_pnrs_final.push(current_pnr_in_bucket);
ZT.setTransformData("selected_pnrs_final", selected_pnrs_final);

ZT.setTransformData("child_ticket", {
  subject: "Child " + current_pnr_in_bucket.pnr + " - Rebooking",
  body: current_pnr_in_bucket.proceedHandling
});

// A child ticket is created only when this handling uses them AND more than one
// PNR qualified overall (the old trees' isCreateChildTicket check).
ZT.setTransformData("create_child_ticket",
  transforms.bucket_child_ticket === true && transforms.isCreateChildTicket === true);
