// NODE 6 (Script) — Finish: submit the session & build the confirmation screen
// -----------------------------------------------------------------------------
// Reached by the app's "Submit & finish" button. This is a real submit:
//   1. gather everything captured this session (the action log + final orders),
//   2. FORMAT the submit body,
//   3. MOCK the POST -> actions.submit_session (your real "save session" API / DCN),
//   4. build a self-contained "all done" confirmation screen with the captured data.
//
// INPUT:  transforms.action_log, actions.get_orders
// OUTPUT: actions.submit_session, transforms.done_html, confirmation_id
// -----------------------------------------------------------------------------

const log = transforms.action_log || [];
const data = actions.get_orders || {};
const orders = data.orders || [];
const customer = data.customer_id || ZT.getVariableValue("customer_id", "");

const confirmationId = "CONF-" + Math.floor(100000 + Math.random() * 900000);
const submittedAt = new Date();

// 2 + 3. Format the submit body and mock the POST response.
ZT.setResponseData("submit_session", {
  ok: true,
  confirmation_id: confirmationId,
  customer_id: customer,
  actions_count: log.length,
  submitted_at: submittedAt.toISOString(),
  actions: log,
  final_orders: orders
});
ZT.setFormData("confirmation_id", confirmationId);

// 4. Build the confirmation screen (self-contained styles so it renders anywhere).
function esc(s) {
  return String(s == null ? "" : s).replace(/[&<>"]/g, function (c) {
    return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c];
  });
}

const actionRows = log.length
  ? log.map(a =>
      `<tr><td><span class="tag ${a.action}">${esc(a.action)}</span></td>` +
      `<td><strong>${esc(a.order_id)}</strong><div class="hint">${esc(a.item)}</div></td>` +
      `<td>${esc(a.detail)}</td><td class="hint">${esc(a.result_id)}</td></tr>`
    ).join("")
  : `<tr><td colspan="4" class="hint">No actions were taken this session.</td></tr>`;

const orderRows = orders.map(o =>
  `<tr><td><strong>${esc(o.order_id)}</strong></td><td>${esc(o.item)}</td>` +
  `<td><span class="pill ${esc(o.status)}">${esc(o.status)}</span></td>` +
  `<td class="hint">${esc(o.tracking || "-")}</td></tr>`
).join("");

// Plain-text summary for case notes (wrapped for the Copy to Clipboard button).
const noteLines = log.map(a => "- " + a.action + " " + a.order_id + " (" + a.detail + ") ref " + a.result_id);
const noteText = "Session " + confirmationId + " for " + customer + "\n" +
  (noteLines.length ? noteLines.join("\n") : "No actions taken.") ;

const done_html = `
<style>
  #zt-done { font-family:-apple-system,Segoe UI,Roboto,sans-serif; max-width:840px; }
  #zt-done .hero { display:flex; align-items:center; gap:14px; background:#ecfdf5; border:1px solid #a7f3d0; border-radius:14px; padding:18px 20px; }
  #zt-done .check { width:44px; height:44px; border-radius:50%; background:#10b981; color:#fff; font-size:26px; line-height:44px; text-align:center; flex:0 0 auto; }
  #zt-done h2 { margin:0; font-size:22px; color:#064e3b; }
  #zt-done .hero .sub { color:#047857; font-size:13px; margin-top:2px; }
  #zt-done .meta { display:flex; gap:24px; margin:16px 2px; font-size:13px; color:#374151; flex-wrap:wrap; }
  #zt-done .meta b { color:#111827; }
  #zt-done h3 { font-size:14px; color:#374151; margin:20px 0 8px; }
  #zt-done table { width:100%; border-collapse:collapse; font-size:14px; }
  #zt-done th { text-align:left; color:#6b7280; font-weight:600; padding:7px 10px; border-bottom:1px solid #e5e7eb; }
  #zt-done td { padding:9px 10px; border-bottom:1px solid #f3f4f6; vertical-align:middle; }
  #zt-done .hint { color:#6b7280; font-size:12px; }
  #zt-done .tag { font-size:12px; padding:2px 8px; border-radius:6px; font-weight:600; }
  #zt-done .tag.Refund { background:#fee2e2; color:#991b1b; }
  #zt-done .tag.Reship { background:#eef2ff; color:#3730a3; }
  #zt-done .pill { font-size:12px; padding:2px 8px; border-radius:999px; font-weight:600; }
  #zt-done .pill.Delivered{background:#dcfce7;color:#166534}
  #zt-done .pill.Shipped{background:#dbeafe;color:#1e40af}
  #zt-done .pill.Processing{background:#fef9c3;color:#854d0e}
  #zt-done .pill.Refunded{background:#fee2e2;color:#991b1b}
</style>

<div id="zt-done">
  <div class="hero">
    <div class="check">&#10003;</div>
    <div>
      <h2>Session submitted</h2>
      <div class="sub">Everything below was captured and sent for ${esc(customer)}.</div>
    </div>
  </div>

  <div class="meta">
    <div>Confirmation&nbsp;<b>${esc(confirmationId)}</b></div>
    <div>Customer&nbsp;<b>${esc(customer)}</b></div>
    <div>Actions&nbsp;<b>${log.length}</b></div>
    <div>Submitted&nbsp;<b>${esc(submittedAt.toLocaleString())}</b></div>
  </div>

  <h3>Actions submitted</h3>
  <table><thead><tr><th>Action</th><th>Order</th><th>Detail</th><th>Reference</th></tr></thead>
  <tbody>${actionRows}</tbody></table>

  <h3>Final order states</h3>
  <table><thead><tr><th>Order</th><th>Item</th><th>Status</th><th>Tracking</th></tr></thead>
  <tbody>${orderRows}</tbody></table>
</div>
`;

ZT.setTransformData("done_html", done_html);
ZT.setTransformData("case_note_text", noteText);
