// SOURCE: Cowork session 'Corpay account hierarchy JSON payload' (local_2bccd200)
// ACCOUNT: Corpay - Corporate Payments (ServiceNow integration)
// PURPOSE: Zingtree Script Node. Pulls every form variable via ZT.getVariableValue(name, ''), drops blanks/unreplaced #tokens#, builds description from valued fields only, maps to ServiceNow incident schema (POST /api/stvsc/zingtree/incident/create). session_id is ambient in the script context.

/**
 * Corpay Corporate Payments — ServiceNow incident payload builder
 * POST {{base_path}}/api/stvsc/zingtree/incident/create
 *
 * Reads each variable with ZT.getVariableValue("varName", "").
 * `description` is built from only the variables that carry a real value; blank
 * ones are dropped. Everything else maps to the default ServiceNow payload.
 * `session_id` is provided automatically by the Zingtree script context.
 */

// Label + order for every known variable (only valued ones are printed).
var LABELS = {
  customer_name: "Customer Name", customer_number: "Customer Number",
  cust_guid: "Cust GUID", customer_guid: "Customer GUID", cust_ID: "Cust ID",
  account_code: "Account Code", customer_ERP: "Customer ERP Integration",
  corpay_complete_module: "Corpay Complete Module",
  customer_product: "Customer Product", channel_partner: "Channel Partner",
  accounting_system: "Accounting System",
  vendor_name: "Vendor Name", vendor_guid: "Vendor GUID", vendor_numbers: "Vendor Numbers",
  vendor_master_id: "Vendor Master ID", cv_mast_id: "CV Mast ID",
  cv_reltio_id: "CV Reltio ID", mv_reltio_id: "MV Reltio ID",
  batch_guid: "Batch GUID(s)", payment_guid: "Payment GUID(s)", payment_ids: "Payment ID(s)",
  venture_batch: "Batch Number", check_printer: "Check Printer",
  impacted_transactions: "Number of Impacted Transactions",
  amount_impacted_transactions: "Total Amount of Impacted Transactions",
  sf_case_number: "Salesforce Case Number", jira_link: "Jira Link",
  existing_incident: "Existing Incident",
  hours_worked: "Number of Hours Worked on This Issue Before Reporting", hours: "Hours Worked",
  issue_short_description: "What is the Issue", details_of_incident: "What is the Issue",
  expected_results: "Expected Results", actual_results: "Actual Results",
  incident_impact: "What is the impact of the issue",
  incident_experience: "Who is and isn't experiencing the issue",
  incident_worked: "When was the last time this worked",
  incident_changed: "What has changed since the last time it worked",
  incident_occuring: "Where is the issue occurring",
  incident_troubleshooting: "What troubleshooting steps have you taken",
  incident_replication: "How can this issue be replicated",
  incident_workaround: "Is there a work around for this issue",
  incident_urgency: "How urgent is this issue",
  date_batch_submitted: "Date Batch Submitted", date_of_error: "Date of Error",
  cause_of_error: "Cause of Error",
  customer_customizations: "Does the customer use any customizations in NetSuite",
  in_implementation: "Is the customer currently in Implementation",
  implementation_blocker: "Implementation Blocker",
  monthly_revenue: "Customer's Monthly Revenue/SOV", go_live: "Projected Go Live Date",
  additional_information: "Additional Information",
  notification: "Contacts to Notify When Incident is Closed", mdm_theme: "Theme",
};
var ORDER = Object.keys(LABELS);

// Pull every variable from Zingtree (fallback to empty string).
var form = {};
for (var i = 0; i < ORDER.length; i++) {
  form[ORDER[i]] = ZT.getVariableValue(ORDER[i], "");
}

// A value counts only if it's non-blank and not an unreplaced token.
function hasValue(v) {
  if (v === null || v === undefined) return false;
  var s = String(v).trim();
  return s !== "" && !/^#.*#$/.test(s) && !/^\$\{.*\}$/.test(s);
}

// Build description from only the valued fields.
var lines = [];
for (var j = 0; j < ORDER.length; j++) {
  var k = ORDER[j];
  if (hasValue(form[k])) lines.push(LABELS[k] + ": " + String(form[k]).trim());
}
var description = lines.join("\n");

// short_description: Corpay prefix + customer/vendor + issue + SF case (<=160 chars).
var issue = hasValue(form.issue_short_description) ? form.issue_short_description
          : (hasValue(form.details_of_incident) ? form.details_of_incident : "");
var who = hasValue(form.customer_name) ? form.customer_name
        : (hasValue(form.vendor_name) ? form.vendor_name : "");
var caseNo = hasValue(form.sf_case_number) ? " | SF " + String(form.sf_case_number).trim() : "";
var short_description = ["Corpay Corporate Payments Incident", who, issue]
  .filter(Boolean).join(" | ") + caseNo;
if (short_description.length > 160) short_description = short_description.slice(0, 157) + "...";

// work_notes: reporter effort.
var hrs = hasValue(form.hours_worked) ? form.hours_worked
        : (hasValue(form.hours) ? form.hours : "");

var payload = {
  requested_for: "corporate.payments.support@corpay.com",
  short_description: short_description,
  description: description,
  category: "Applications",
  subcategory: "Unexpected behavior",
  assignment_group: "Corpay Corporate Payments App Support",
  zingtree_session_id: session_id,
};
if (hasValue(hrs)) payload.work_notes = "Hours reporter worked on this issue before reporting: " + String(hrs).trim();
