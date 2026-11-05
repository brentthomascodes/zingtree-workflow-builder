// Source session: Vermasoft workflow streamlining (2026-07-21)
// Account: Vermasoft  ·  Tree: Basic Receptionist (862603108) nodes 2 + 6
// Purpose: Linear-spine pattern: a CLASSIFY script stages guidance HTML (screen_html) + a routing boolean, then one conditional-field content node captures details, then a GATHER script reads them and sets the next routing boolean. Reusable shape for a linear top-to-bottom tree.
// House rules embodied: lean code (ZT.getVariableValue fallback, no normalization/over-guarding),
//   only-referenced variables, script-before-router (sets a boolean the router tests).

// ----- CLASSIFY (node 2): stage screen guidance + set go_subtree -----
function g(k){ return ZT.getVariableValue(k, ""); }
var type = g("caller_type");
var goSubtree = type === "Possible new client" || (type === "Returning client" && g("returning_kind") === "New matter");
ZT.setFormData("go_subtree", goSubtree);

var guide = {
  "Existing client": "Existing client. Confirm the case, choose the call reason, and capture only the fields shown.",
  "Returning client": "Returning client with a past case. Look up the case number and check if they want to schedule.",
  "Other caller": "Non-client caller. Capture the details shown for this caller type."
};
ZT.setTransformData("screen_html",
  '<div style="background:#eef2ff;border:1px solid #c7d2fe;border-radius:8px;padding:12px 14px;color:#3730a3;font-size:14px;">' +
  (guide[type] || "Capture the details below.") + '</div>');


// ----- GATHER + DECIDE (node 6): read the conditional-field answers, set should_schedule -----
function g(k){ return ZT.getVariableValue(k, ""); }
var reason = g("call_reason");
var shouldSchedule =
  reason === "Schedule a consultation" ||
  g("forms_wants_consult") === "Yes" ||
  g("cancel_reschedule") === "Yes" ||
  g("past_case_wants_schedule") === "Yes" ||
  g("prospect_action") === "Offer a consultation";
ZT.setFormData("should_schedule", shouldSchedule);
