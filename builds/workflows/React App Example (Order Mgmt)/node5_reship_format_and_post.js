// NODE 5 (Script) — Format the reship & mock the "POST reship" + re-GET
// -----------------------------------------------------------------------------
// The SECOND data source / action. Same shape as node 4 but a different
// endpoint (post_reship) and a different mutation to the order. This is what
// Brent means by "different action buttons add in different data sources":
// each React button routes to its own format+post script.
//
// INPUT:  selected_order_id, action_payload (form data); actions.get_orders
// OUTPUT: actions.post_reship, actions.get_orders (updated), last_action_summary
// -----------------------------------------------------------------------------

const orderId = ZT.getVariableValue("selected_order_id", "");

let payloadIn = {};
try { payloadIn = JSON.parse(ZT.getVariableValue("action_payload", "{}")); } catch (e) { payloadIn = {}; }

const data = actions.get_orders || {};
const orders = data.orders || [];
const order = orders.find(o => o.order_id === orderId) || {};

// FORMAT the reship request body.
const reshipBody = {
  order_id: orderId,
  customer_id: data.customer_id || "",
  item: order.item || "",
  qty: payloadIn.qty != null ? payloadIn.qty : (order.qty || 1),
  ship_speed: payloadIn.ship_speed || "Standard",
  requested_by: ZT.getVariableValue("agent", "agent")
};

// MOCK the POST response.
const newTracking = "1Z" + Math.floor(1000000 + Math.random() * 9000000);
ZT.setResponseData("post_reship", {
  ok: true,
  reship_id: "RS-" + Math.floor(100000 + Math.random() * 900000),
  order_id: orderId,
  tracking: newTracking,
  received: reshipBody
});

// MOCK the refreshed GET — order flips to a new shipment with fresh tracking.
const updated = orders.map(o =>
  o.order_id === orderId ? Object.assign({}, o, { status: "Shipped", tracking: newTracking }) : o
);
ZT.setResponseData("get_orders", { customer_id: data.customer_id || "", orders: updated });

ZT.setFormData("last_action_summary", "Reshipped " + orderId + " (" + reshipBody.ship_speed + ") — new tracking " + newTracking + ".");

// Append to the session action log — the Finish/submit step reads this back.
const log = transforms.action_log || [];
log.push({
  action: "Reship",
  order_id: orderId,
  item: order.item || "",
  detail: reshipBody.ship_speed + " · tracking " + newTracking,
  result_id: actions.post_reship.reship_id,
  at: new Date().toISOString()
});
ZT.setTransformData("action_log", log);
