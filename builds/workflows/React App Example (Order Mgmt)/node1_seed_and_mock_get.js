// NODE 1 (Script, ROOT) — Seed context & mock the "GET orders" API
// -----------------------------------------------------------------------------
// In production this node is a Data (Connected Object) node that calls your
// order API. Here we MOCK that API with a script: ZT.setResponseData("get_orders", ...)
// writes into the ACTIONS namespace, so every downstream node reads it via
// `actions.get_orders` exactly as if a real Connected Object had returned it.
//
// OUTPUT: actions.get_orders = { customer_id, orders:[...] }
// -----------------------------------------------------------------------------

// Context is seeded from the session URL (?customer_id=CUST-4471). Falls back
// to a demo customer so the tree runs standalone.
const customerId = ZT.getVariableValue("customer_id", "CUST-4471");

// Fake payload — stand-in for the JSON your order API would return.
const orders = [
  { order_id: "SO-10231", placed_on: "2026-07-14", item: "Wireless Keyboard K380", qty: 1, amount: 39.99, status: "Delivered",  tracking: "1Z9992384" },
  { order_id: "SO-10244", placed_on: "2026-07-18", item: "USB-C Hub 7-in-1",       qty: 2, amount: 118.0, status: "Shipped",    tracking: "1Z9992501" },
  { order_id: "SO-10259", placed_on: "2026-07-21", item: "27\" 4K Monitor",         qty: 1, amount: 329.5, status: "Processing", tracking: "" }
];

// Mock the API response into the actions namespace (this is the whole trick).
ZT.setResponseData("get_orders", { customer_id: customerId, orders: orders });

// Keep the seeded customer id available as plain form data for merge fields.
ZT.setFormData("customer_id", customerId);

// Init the summary shown on the terminal screen (overwritten by an action).
ZT.setFormData("last_action_summary", "No action taken this session.");

// Start a fresh action log for this session (transforms persist ~1h, so reset).
ZT.setTransformData("action_log", []);
