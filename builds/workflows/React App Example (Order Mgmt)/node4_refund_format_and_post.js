// NODE 4 (Script) — Format the refund & mock the "POST refund" + re-GET
// -----------------------------------------------------------------------------
// Reached when the agent clicks the React "Refund" button, which wrote the
// selection into the zt-data inputs on node 3. This node:
//   1. reads the selection back out of form data,
//   2. FORMATS it into whatever the refund endpoint wants (the payload),
//   3. MOCKS the POST response -> actions.post_refund,
//   4. MOCKS a fresh GET so the table reflects the change -> actions.get_orders.
// It then continues back to node 2, which reformats and re-renders the app.
//
// INPUT:  selected_order_id, action_payload (form data); actions.get_orders
// OUTPUT: actions.post_refund, actions.get_orders (updated), last_action_summary
// -----------------------------------------------------------------------------

const orderId = ZT.getVariableValue("selected_order_id", "");

// action_payload arrives as a JSON string from the React app. Parse defensively.
let payloadIn = {};
try { payloadIn = JSON.parse(ZT.getVariableValue("action_payload", "{}")); } catch (e) { payloadIn = {}; }

const data = actions.get_orders || {};
const orders = data.orders || [];
const order = orders.find(o => o.order_id === orderId) || {};

// 2. FORMAT — build the exact body the (real) refund API would receive.
const refundBody = {
  order_id: orderId,
  customer_id: data.customer_id || "",
  amount: payloadIn.amount != null ? payloadIn.amount : order.amount,
  reason: payloadIn.reason || "Not specified",
  requested_by: ZT.getVariableValue("agent", "agent")
};

// 3. MOCK the POST response (stand-in for the API's reply).
ZT.setResponseData("post_refund", {
  ok: true,
  refund_id: "RF-" + Math.floor(100000 + Math.random() * 900000),
  order_id: orderId,
  refunded_amount: refundBody.amount,
  received: refundBody
});

// 4. MOCK the refreshed GET — mutate the order the way the backend would, then
// write the whole collection back to actions.get_orders so node 2 rebuilds fresh.
const updated = orders.map(o =>
  o.order_id === orderId ? Object.assign({}, o, { status: "Refunded" }) : o
);
ZT.setResponseData("get_orders", { customer_id: data.customer_id || "", orders: updated });

// Human-readable summary for the terminal screen.
ZT.setFormData("last_action_summary", "Refunded " + orderId + " for $" + Number(refundBody.amount).toFixed(2) + " (" + refundBody.reason + ").");

// Append to the session action log — the Finish/submit step reads this back.
const log = transforms.action_log || [];
log.push({
  action: "Refund",
  order_id: orderId,
  item: order.item || "",
  detail: "$" + Number(refundBody.amount).toFixed(2) + " · " + refundBody.reason,
  result_id: actions.post_refund.refund_id,
  at: new Date().toISOString()
});
ZT.setTransformData("action_log", log);
