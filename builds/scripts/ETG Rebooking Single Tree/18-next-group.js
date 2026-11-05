// ETG Rebooking (single tree) - node 18 "Next group of PNRs and stage its handling screen"
//
// Cursor over the buckets, plus the HANDLINGS catalog that replaces five whole
// trees (5. Take Payment, 6. Escalate to Support, 7. GDPR Docs, 8. No Action,
// 10. Refund Flex).
//
// TO ADD A NEW HANDLING: add one entry to HANDLINGS. "fields" are the native
// conditional fields shown on node 20; "childTicket" decides whether node 24
// creates a Zendesk child ticket for each PNR in the bucket.

const ACTION = (title, body) =>
  '<div class="zt-content-block zt-cb-type-action"><div class="zt-cb-title"><h3>' + title +
  '</h3></div><div class="zt-cb-body">' + body + '</div></div>';
const ALERT = (title, body) =>
  '<div class="zt-content-block zt-cb-type-alert"><div class="zt-cb-title"><h3>' + title +
  '</h3></div><div class="zt-cb-body">' + body + '</div></div>';

const HANDLINGS = {
  "Take Payment": {
    title: "Take payment for this group",
    fields: ["total_cost_pax_all", "currency", "payment_method", "verify_email", "payment_confirmed"],
    childTicket: true,
    guidance: ACTION("Edvin actions",
      "<ul><li>Create and fill in the rebooking wizard for all GDS PNRs</li>" +
      "<li>For Portals and LCC, register the errand</li>" +
      "<li>Create an add-on cart for the customer to pay</li></ul>") +
      ALERT("Attention", "<p>If the customer has the Flexible Ticket service, the airline's " +
      "penalty and our fee must not be collected.</p>")
  },
  "Escalate to support": {
    title: "Escalate this group to Support",
    fields: ["escalate_to_support", "free_text"],
    childTicket: true,
    guidance: ALERT("Non-English bookings",
      "<p>When placing a non-English booking with Support, tell the customer up front that " +
      "Support - and any callbacks - may be handled in English. Language continuity cannot be " +
      "guaranteed.</p>")
  },
  "GDPR Docs": {
    title: "Request the GDPR documents for this group",
    fields: [],
    childTicket: true,
    guidance: ACTION("Actions in Edvin",
      "<p>1. Send the rebooking email template from Edvin for ETG and B2B partners: " +
      "\"Rebooking - Med Cert Waiver\" or \"Rebooking - Death Cert Waiver\", depending on the " +
      "situation.</p>" +
      "<p>2. Tell the customer we need the documents within 5 working days to request a waiver " +
      "from the airline, and at least 72 hours before departure.</p>" +
      "<p>3. Remind the customer the certificate must be in English or the airline's official " +
      "language, and must state the relationship to the close relative.</p>" +
      "<p>4. Use the Rebooking Wizard for GDS and Farelogix, or register the errand for " +
      "external portals.</p>")
  },
  "Refund Flex": {
    title: "Refund the Flexible Ticket for this group",
    fields: [],
    childTicket: true,
    guidance: ACTION("Actions in Edvin",
      "<p>1. Use Modify order with reason \"Failed Flex Rebooking\".<br>" +
      "2. Write clear notes to SL.</p>")
  },
  "Transfer to SC": {
    title: "Transfer this group to Schedule Change",
    fields: [],
    childTicket: false,
    guidance: ACTION("Action",
      "<p>1. Select macro: Action -> \"Transferred\"<br>2. Write the internal note.<br>" +
      "3. Submit as \"Open\" status.<br>4. Transfer the interaction through the Genesys widget." +
      "<br>5. Register the appropriate errand in the Edvin order.</p>")
  },
  "Do Not Proceed": {
    title: "No action for this group",
    fields: [],
    childTicket: false,
    guidance: ACTION("Action",
      "<ul><li>For GDS and Farelogix, complete the rebooking wizard</li>" +
      "<li>For Portals and LCC, register the errand</li></ul>")
  }
};

const BUCKET_FIELDS = ["total_cost_pax_all", "currency", "payment_method", "verify_email",
  "payment_confirmed", "escalate_to_support", "free_text"];

/* ---- cursor over the buckets ---- */

const grouped_pnrs = transforms.grouped_pnrs || [];
let grouped_count = transforms.grouped_count || 0;
const current_pnr_bucket = grouped_pnrs[grouped_count] || [];

grouped_count += 1;
let isMoreGroupedPnrs = true;
if (grouped_count >= grouped_pnrs.length) {
  isMoreGroupedPnrs = false;
  grouped_count = 0;
}

ZT.setTransformData("current_pnr_bucket", current_pnr_bucket);
ZT.setTransformData("current_pnr_bucket_index", 0);
ZT.setTransformData("grouped_count", grouped_count);
ZT.setTransformData("isMoreGroupedPnrs", isMoreGroupedPnrs);

const route = (current_pnr_bucket[0] || {}).pnr_route || "Do Not Proceed";
const handling = HANDLINGS[route] || HANDLINGS["Do Not Proceed"];

ZT.setFormData("groupedPNR_Route", route);
ZT.setTransformData("bucket_is_changes", route === "Changes");
ZT.setTransformData("bucket_child_ticket", handling.childTicket);

/* ---- the group's PNR summary ---- */

const field = (label, value) =>
  value ? "<p><strong>" + label + "</strong>: " + value + "</p>" : "";

const bucket_details = current_pnr_bucket.map(item =>
  '<div class="pnr-card">' +
  field("PNR", item.pnr) +
  field("Handling", item.proceedHandling) +
  field("Rebooking reason", item.rebooking_reason) +
  field("Post sales handle type", item.postSaleHandleType) +
  field("New flights", item.new_flights) +
  field("Outcome", item.outcome) +
  field("Cost to customer", item.cost_to_pax) +
  field("Currency", item.currency) +
  "</div>"
).join('<hr style="margin:16px 0;" />');

ZT.setTransformData("grouped_pnr_bucket_details", bucket_details);

/* ---- stage node 20 ---- */

const total_cost = current_pnr_bucket
  .reduce((sum, item) => sum + parseFloat(item.cost_to_pax || 0), 0);

ZT.setFormData("total_cost_pax_all", total_cost);
ZT.setFormData("currency", (current_pnr_bucket[0] || {}).currency || "");

BUCKET_FIELDS.forEach(f =>
  ZT.setFormData("need_" + f, handling.fields.indexOf(f) > -1 ? "yes" : "no"));

ZT.setTransformData("bucket_html",
  "<h3>" + handling.title + "</h3>" + bucket_details + handling.guidance);

ZT.log("bucket: route=" + route + " size=" + current_pnr_bucket.length);
