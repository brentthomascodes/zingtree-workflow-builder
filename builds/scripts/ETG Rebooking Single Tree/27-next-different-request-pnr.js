// ETG Rebooking (single tree) - node 27 "Next PNR in the different-request group"
// The customer wants something other than a rebooking for these PNRs, so each one
// is walked individually and handed to the matching request tree.

const current_pnr_bucket = transforms.current_pnr_bucket || [];
let index = transforms.current_pnr_bucket_index || 0;

const current_pnr_in_bucket = current_pnr_bucket[index] || {};

index += 1;
let isMorePNR_InBucket = true;
if (index >= current_pnr_bucket.length) {
  isMorePNR_InBucket = false;
  index = 0;
}

ZT.setTransformData("current_pnr_bucket_index", index);
ZT.setTransformData("current_pnr_in_bucket", current_pnr_in_bucket);
ZT.setTransformData("isMorePNR_InBucket", isMorePNR_InBucket);
ZT.setFormData("different_request", "");

ZT.setTransformData("different_request_html",
  "<h3>PNR " + index + " of " + current_pnr_bucket.length + "</h3>" +
  "<p><strong>PNR</strong>: " + (current_pnr_in_bucket.pnr || "") + "</p>" +
  "<p><strong>Post sales handle type</strong>: " +
  (current_pnr_in_bucket.postSaleHandleType || "") + "</p>" +
  "<p><strong>Passengers</strong>: " +
  (current_pnr_in_bucket.formatted_passengers || "") + "</p>");
