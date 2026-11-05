// ============================================================================
// Quest Consent - Agent Workflow (tree 208427015)
// Node 20 "Stamp Verbal Consent"  [NEW - Script node, continuation -> 12]
// ----------------------------------------------------------------------------
// Purpose: close out the verbal-consent fallback path with a complete audit
//          record, then hand a printable summary to the confirmation screen.
//          This is the path Emily approved on 2026-07-23: when the participant
//          cannot accept the emailed/texted consent in the moment, the agent
//          reads the consent verbatim and captures verbal acceptance instead.
//
// Inputs (form data)
//   company, company_score, client_name, client_id, full_name, agent_name
//   consent_preference          -- Email | Text Message | Voice (intake choice)
//   verbal_fallback_reason      -- why the digital path was not used (node 19)
//   verbal_fallback_notes       -- optional free text (node 19)
//   verbal_attestation          -- "1" when the agent confirmed verbatim read
//   participant_verbal_name     -- name the participant stated aloud (node 11)
//
// Outputs
//   form : consent_method, consent_captured_at, consent_captured_at_iso,
//          consent_captured_by, consent_verbal_reason, consent_audit_complete
//   transforms : verbal_consent_summary_html, verbal_consent_summary_text
//
// Data rules applied: scalars -> setFormData, HTML string -> setTransformData.
// ============================================================================

function g(key) {
  return ZT.getVariableValue(key, "");
}

function escapeHtml(s) {
  return String(s == null ? "" : s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function pad(n) {
  return n < 10 ? "0" + n : String(n);
}

// Readable local stamp plus an ISO stamp for reporting/export.
function formatStamp(d) {
  var months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
                "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  var hours24 = d.getHours();
  var suffix = hours24 >= 12 ? "PM" : "AM";
  var hours12 = hours24 % 12;
  if (hours12 === 0) { hours12 = 12; }
  return months[d.getMonth()] + " " + d.getDate() + ", " + d.getFullYear() +
         " at " + hours12 + ":" + pad(d.getMinutes()) + ":" +
         pad(d.getSeconds()) + " " + suffix;
}

function isoStamp(d) {
  return d.getFullYear() + "-" + pad(d.getMonth() + 1) + "-" + pad(d.getDate()) +
         "T" + pad(d.getHours()) + ":" + pad(d.getMinutes()) + ":" +
         pad(d.getSeconds());
}

// Reason label lookup. Node 19 writes the raw select value; anything not in the
// map passes through unchanged so new options do not silently blank out.
var REASON_LABELS = {
  "driving": "Participant was driving",
  "no_email_access": "No email or phone access during the call",
  "requested_later": "Participant asked to review later",
  "technical_issue": "Technical issue with the link",
  "declined_digital": "Participant declined the digital option",
  "other": "Other (see notes)"
};

var now = new Date();

var company = g("company");
var clientName = g("client_name");
var clientId = g("client_id");
var fullName = g("full_name");
var agentName = g("agent_name");
var preference = g("consent_preference");
var rawReason = g("verbal_fallback_reason");
var notes = g("verbal_fallback_notes");
var attested = g("verbal_attestation") === "1";
var statedName = g("participant_verbal_name");

// Entering from node 10 means the agent chose Voice at intake -- that is not a
// fallback, so label it distinctly rather than leaving the reason blank.
var reasonKey = rawReason;
if (!reasonKey) {
  reasonKey = preference === "Voice" ? "voice_at_intake" : "unspecified";
}
var reasonLabel = REASON_LABELS[reasonKey] ||
  (reasonKey === "voice_at_intake" ? "Voice selected at intake" :
   reasonKey === "unspecified" ? "Not specified" : reasonKey);

var capturedAt = formatStamp(now);
var capturedAtIso = isoStamp(now);

ZT.setFormData("consent_method", "Verbal");
ZT.setFormData("consent_captured_at", capturedAt);
ZT.setFormData("consent_captured_at_iso", capturedAtIso);
ZT.setFormData("consent_captured_by", agentName);
ZT.setFormData("consent_verbal_reason", reasonLabel);
ZT.setFormData("consent_verbal_reason_code", reasonKey);
ZT.setFormData("consent_audit_complete", attested && statedName ? "1" : "0");

// --- printable summary ------------------------------------------------------

function infoRow(label, value) {
  return '<div style="display:flex; gap:10px; padding:6px 0; ' +
         'border-bottom:1px solid #e5e7eb; font-size:14px;">' +
         '<div style="min-width:210px; font-weight:700; color:#374151;">' +
         escapeHtml(label) + "</div>" +
         '<div style="color:#111827;">' + escapeHtml(value || "-") + "</div>" +
         "</div>";
}

var rows =
  infoRow("Consent method", "Verbal (read aloud by agent)") +
  infoRow("Reason digital not used", reasonLabel) +
  infoRow("Company / program", company) +
  infoRow("Client name", clientName) +
  infoRow("Client ID", clientId) +
  infoRow("Participant (intake)", fullName) +
  infoRow("Name stated by participant", statedName) +
  infoRow("Agent", agentName) +
  infoRow("Captured", capturedAt) +
  infoRow("Verbatim read attested", attested ? "Yes" : "NO - incomplete");

if (notes) {
  rows += infoRow("Agent notes", notes);
}

var tone = attested
  ? { bg: "#f0fdf4", border: "#bbf7d0", title: "Verbal consent captured" }
  : { bg: "#fef2f2", border: "#fecaca", title: "Verbal consent INCOMPLETE" };

var html =
  '<div style="border:1px solid ' + tone.border + '; background:' + tone.bg +
  '; border-radius:14px; padding:16px 18px; font-family:Arial, Helvetica, sans-serif;">' +
  '<div style="font-size:16px; font-weight:800; color:#111827; margin-bottom:10px;">' +
  escapeHtml(tone.title) + "</div>" + rows + "</div>";

ZT.setTransformData("verbal_consent_summary_html", html);

var text =
  "CONSENT METHOD: Verbal (read aloud by agent)\n" +
  "Reason digital not used: " + reasonLabel + "\n" +
  "Company / program: " + company + "\n" +
  "Client name: " + clientName + "\n" +
  "Client ID: " + clientId + "\n" +
  "Participant (intake): " + fullName + "\n" +
  "Name stated by participant: " + statedName + "\n" +
  "Agent: " + agentName + "\n" +
  "Captured: " + capturedAt + " (" + capturedAtIso + ")\n" +
  "Verbatim read attested: " + (attested ? "Yes" : "NO - incomplete");

ZT.setTransformData("verbal_consent_summary_text", text);

ZT.log("verbal consent stamped: " + JSON.stringify({
  method: "Verbal",
  reason: reasonKey,
  attested: attested,
  at: capturedAtIso
}));
