// NODE 2 (Script) — Format orders & build the React app shell
// -----------------------------------------------------------------------------
// Reads the mocked API data from the ACTIONS namespace, shapes a clean view
// model, and builds ONE HTML string for the content node to render. The HTML is
// only a SHELL: a mount point, a hidden JSON data island, and the hidden
// zt-data inputs the app writes to. The app itself (lightweight vanilla JS,
// no framework/CDN) lives in Settings > Custom Code — see settings_script_code.html.
//
// INPUT:  actions.get_orders = { customer_id, orders:[...] }
// OUTPUT: transforms.app_html (rendered by node 3), transforms.orders_json
// -----------------------------------------------------------------------------

const data = actions.get_orders || {};
const customerId = data.customer_id || ZT.getVariableValue("customer_id", "");
const orders = data.orders || [];

// Shape a view model — do formatting HERE, keep the React app dumb.
const viewModel = orders.map(o => ({
  order_id: o.order_id,
  placed_on: o.placed_on,
  item: o.item,
  qty: o.qty,
  amount: o.amount,
  amount_display: "$" + Number(o.amount).toFixed(2),
  status: o.status,
  tracking: o.tracking || "",
  // Only Shipped/Delivered orders can be refunded; anything not yet shipped
  // can be reshipped. The React app uses these flags to enable/disable buttons.
  can_refund: o.status === "Shipped" || o.status === "Delivered",
  can_reship: o.status !== "Delivered"
}));

const payload = {
  customer_id: customerId,
  generated_at: new Date().toISOString(),
  orders: viewModel
};

// JSON that the React app reads from the DOM. Escape "<" so the JSON can sit
// safely inside an HTML element's text without being parsed as a tag.
const ordersJson = JSON.stringify(payload).replace(/</g, "\\u003c");

// Stage the JSON as a transform too (handy for merge fields / debugging).
ZT.setTransformData("orders_json", payload);

// The SHELL. No React here — just the mount, the data island, and the inputs
// the React app fills in before it clicks a real Zingtree action button.
const html = `
<style>
  #zt-order-app { font-family: -apple-system, Segoe UI, Roboto, sans-serif; }
  #zt-order-app .zt-app-loading { color:#6b7280; padding:16px; }
</style>

<div id="zt-app-marker" style="display:none"></div>
<div id="zt-order-data" style="display:none">${ordersJson}</div>

<input type="hidden" class="zt-data" name="selected_order_id" id="zt_selected_order_id" />
<input type="hidden" class="zt-data" name="selected_action"   id="zt_selected_action" />
<input type="hidden" class="zt-data" name="action_payload"    id="zt_action_payload" />

<div id="zt-order-app"><div class="zt-app-loading">Loading order manager…</div></div>
`;

ZT.setTransformData("app_html", html);
