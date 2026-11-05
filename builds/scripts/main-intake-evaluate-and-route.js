// Source session: Vermasoft workflow streamlining (2026-07-21)
// Account: Vermasoft  ·  Tree: Main Intake (142849578) node 8
// Purpose: Main Intake eval+route: read intake selects (direct value match), set needs_review_offer, stage review_offer_html + intake_summary_html/_text. LEAN version (no norm(), no route_* flags) -- supersedes the earlier verbose file.
// House rules embodied: lean code (ZT.getVariableValue fallback, no normalization/over-guarding),
//   only-referenced variables, script-before-router (sets a boolean the router tests).

// Node 100 - Evaluate the intake answers, decide whether to offer an attorney
// review, and build the agent summary. The router (node 101) only tests needs_review_offer.
function g(k){ return ZT.getVariableValue(k, ""); }

var caseType   = g("case_type");
var isAuto     = caseType === "Vehicle Accident";
var isSlip     = caseType === "Slip and Fall";
var isMedMal   = caseType === "Medical Malpractice";
var isWorkComp = caseType === "Workers Compensation";
var isOther    = caseType === "Other";

// Pick the review-offer reason (empty means no review offer). Order mirrors the original tree.
var reason = "";
if (g("proceed_mode") === "Proceed with questions") {
  if (isOther || (isWorkComp && g("work_related") === "No, not work related")) {
    reason = "This is outside the case types we most commonly handle, but our attorneys review all types of situations.";
  } else if (g("event_date") === "More than 2 years ago") {
    reason = "Depending on when this happened, there may be legal filing deadlines (statute of limitations). Exceptions such as the discovery rule can apply, so an attorney should review this promptly.";
  } else if ((isAuto || isSlip) && g("injured") === "No one was injured") {
    reason = "Personal injury cases typically require a physical injury. Without one these can be harder to pursue, but every situation is unique and an attorney can still take a look.";
  } else if ((isAuto && g("at_fault") === "Unclear or I may have been at fault") || (isMedMal && g("harm_negligence") === "No")) {
    reason = "Fault or liability looks unclear or potentially unfavorable here. Our attorneys evaluate each case on its own merits, so a review is still worthwhile.";
  }
}

ZT.setFormData("needs_review_offer", reason !== "");
ZT.setTransformData("review_offer_html", reason
  ? '<div style="background:#fff7ed;border:1px solid #fed7aa;border-radius:8px;padding:12px 14px;margin:0 0 4px;"><strong>For the agent:</strong> ' + reason + '</div>'
  : "");

// Agent-facing intake summary: a display card plus a plain-text copy for case notes.
var fields = [
  ["How caller wants to proceed", g("proceed_mode")],
  ["Case type", caseType],
  ["When it happened", g("event_date")],
  ["Injury", g("injured")],
  ["Medical treatment", g("medical_treatment")],
  ["Other party at fault", g("at_fault")],
  ["Insurance", g("insurance_status")],
  ["Where it happened", g("incident_location")],
  ["Licensed provider involved", g("provider_licensed")],
  ["Harm from error / negligence", g("harm_negligence")],
  ["Work related", g("work_related")],
  ["Reported to employer", g("reported_employer")]
];

var htmlRows = "", textLines = [];
for (var i = 0; i < fields.length; i++) {
  var label = fields[i][0], val = fields[i][1];
  if (!val) continue;
  htmlRows += '<tr><td style="padding:4px 10px 4px 0;color:#6b7280;white-space:nowrap;vertical-align:top;">' + label + '</td><td style="padding:4px 0;color:#111827;font-weight:600;">' + val + '</td></tr>';
  textLines.push(label + ": " + val);
}
if (!htmlRows) htmlRows = '<tr><td style="padding:6px 0;color:#6b7280;">No intake answers captured yet.</td></tr>';

ZT.setTransformData("intake_summary_html",
  '<div style="background:#f9fafb;border:1px solid #e5e7eb;border-radius:8px;padding:12px 14px;">' +
  '<div style="font-weight:700;color:#0f2f4d;margin:0 0 6px;">Intake summary</div>' +
  '<table style="border-collapse:collapse;font-size:14px;">' + htmlRows + '</table></div>');
ZT.setTransformData("intake_summary_text",
  "INTAKE SUMMARY\n" + (textLines.length ? textLines.join("\n") : "No intake answers captured."));
