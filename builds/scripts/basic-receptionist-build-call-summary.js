// Source session: Vermasoft workflow streamlining (2026-07-21)
// Account: Vermasoft  ·  Tree: Basic Receptionist (862603108) node 13
// Purpose: Build a call summary from captured fields: summary_html (styled card) + summary_text (plain text for the copy-to-clipboard case note). Row-list pattern, lean (no esc()).
// House rules embodied: lean code (ZT.getVariableValue fallback, no normalization/over-guarding),
//   only-referenced variables, script-before-router (sets a boolean the router tests).

function g(k){ return ZT.getVariableValue(k, ""); }

var rows = [
  ["Caller", g("name")],
  ["Phone", g("phone")],
  ["Email", g("mail")],
  ["Caller type", g("caller_type")],
  ["Case number", g("case_number") || g("past_case_number")],
  ["Other caller type", g("other_type")],
  ["Company", g("company")],
  ["Call reason", g("call_reason")],
  ["Deadline", g("deadline")],
  ["Attorney reachable", g("attorney_reachable")],
  ["Acquaintance handling", g("acquaintance_action")],
  ["Billing issue", g("billing_issue")],
  ["Prospect handling", g("prospect_action")],
  ["Consultation time", g("selected_time")],
  ["New phone", g("new_phone")],
  ["New email", g("new_email")],
  ["New address", g("new_address")],
  ["Notes", g("reason_notes") || g("cancel_notes") || g("complaint_notes") || g("billing_notes") || g("other_notes")]
];

var htmlRows = "", textLines = [];
for (var i = 0; i < rows.length; i++) {
  var label = rows[i][0], val = rows[i][1];
  if (!val) continue;
  htmlRows += '<tr><td style="padding:4px 12px 4px 0;color:#6b7280;white-space:nowrap;">' + label + '</td><td style="padding:4px 0;color:#111827;">' + val + '</td></tr>';
  textLines.push(label + ": " + val);
}
if (!htmlRows) {
  htmlRows = '<tr><td style="padding:4px 0;color:#6b7280;">No details captured on this call.</td></tr>';
  textLines.push("No details captured on this call.");
}

ZT.setTransformData("summary_html",
  '<div style="border:1px solid #c7d2fe;background:#eef2ff;border-radius:8px;padding:16px;font-family:-apple-system,Segoe UI,Roboto,sans-serif;max-width:520px;">' +
  '<div style="font-weight:600;color:#3730a3;margin-bottom:8px;">Call summary</div>' +
  '<table style="border-collapse:collapse;font-size:14px;">' + htmlRows + '</table></div>');
ZT.setTransformData("summary_text", textLines.join("\n"));
