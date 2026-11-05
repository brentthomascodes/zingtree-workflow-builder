// ETG Rebooking (single tree) - node 21 "Work out the finalisation steps for this group"
// Replaces the "Is Payment Received?" router plus the "Rebooking Final Steps" and
// "Register Errand" screens from the old 5. Take Payment tree.
// Only the Take Payment route has two possible endings; everything else shows the
// handling's own closing instructions.

const ACTION = (title, body) =>
  '<div class="zt-content-block zt-cb-type-action"><div class="zt-cb-title"><h3>' + title +
  '</h3></div><div class="zt-cb-body">' + body + '</div></div>';
const ALERT = (title, body) =>
  '<div class="zt-content-block zt-cb-type-alert"><div class="zt-cb-title"><h3>' + title +
  '</h3></div><div class="zt-cb-body">' + body + '</div></div>';

const FINAL_STEPS = ACTION("Actions",
  "<ul><li>Split the passenger if needed and permitted, and link the PNR in Edvin.</li>" +
  "<li>Take all the actions needed to finalise the rebooking:" +
  "<ul><li><strong>GDS and Farelogix</strong>: if it is Void &amp; Rebook, VOID the ticket and " +
  "the EMDs in the GDS - do NOT use the automation. Save the new flights, remove the old ones, " +
  "save the pricing, then send to ticketing for reissue using the rebooking wizard.</li>" +
  "<li><strong>External portals</strong>: if it is Void &amp; Rebook, VOID the ticket and the " +
  "EMDs in the portal - do NOT use the automation. Finalise the rebooking in the portal. If the " +
  "form of payment is CASH, place the order in UPA TKT \"Close D365 External portals\". Send the " +
  "confirmation and new tickets to the customer, then register the errand.</li>" +
  "<li><strong>LCC</strong>: finalise the rebooking on the airline's website, send the " +
  "confirmation and new tickets, register the errand. If the form of payment is TFpay, place the " +
  "order in UPA TKT \"Close D365 External portals\".</li></ul></li>" +
  "<li>If you created a new PNR, link it in Edvin.</li>" +
  "<li>Change the order in Edvin.</li></ul>") +
  ALERT("Attention", "<p>If the customer used the Flexible Ticket service, remove the product " +
  "from Edvin.</p>");

const REGISTER_ERRAND = ACTION("Actions",
  "<ul><li>Tell the customer the payment deadline, or create a new payment link if needed.</li>" +
  "<li>For GDS, complete the rebooking wizard.</li>" +
  "<li>For Portals and LCC, register the errand.</li></ul>");

const route = ZT.getVariableValue("groupedPNR_Route", "Do Not Proceed");
const payment_method = ZT.getVariableValue("payment_method", "");
const payment_confirmed = ZT.getVariableValue("payment_confirmed", "");

let finalise_html = "<h3>Finalise this group</h3>" +
  (transforms.grouped_pnr_bucket_details || "");

if (route === "Take Payment") {
  const paidNow = payment_confirmed === "Yes" ||
    payment_method === "Free of cost for customer" && payment_confirmed !== "No";
  finalise_html += paidNow ? FINAL_STEPS : REGISTER_ERRAND;
} else {
  finalise_html += ACTION("Action",
    "<p>Complete the actions listed on the previous screen, then continue.</p>");
}

ZT.setTransformData("finalise_html", finalise_html);
