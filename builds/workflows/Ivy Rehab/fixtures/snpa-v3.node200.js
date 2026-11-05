// --- inputs -----------------------------------------------------------------
// The agent's answers on the selection screen, and the catalogue the dropdown was built from.
let is_using_insurance = ZT.getVariableValue("is_using_insurance", "");
let insurance_selection = ZT.getVariableValue("insurance_selection", "");
let insurance_catalog = JSON.parse(ZT.getVariableValue("insurance_catalog", "[]"));

// --- route ------------------------------------------------------------------
// No insurance means self-pay. Otherwise the selected entry's status is the route.
// An entry missing from the catalogue goes to details with no code, so nothing is POSTed.
let insurance_route = "self_pay";
let patient_insurance_rt_code = "";
let selected_insurance = { value: "", label: "", code: "", status: "accepted" };
if (is_using_insurance === "Yes") {
  selected_insurance = insurance_catalog.find(entry => entry.value === insurance_selection) || selected_insurance;
  insurance_route = selected_insurance.status;
  if (insurance_route === "accepted") {
    patient_insurance_rt_code = selected_insurance.code;
  }
}

// --- outputs ----------------------------------------------------------------
// Only an accepted insurance with a code becomes the Raintree code; Incoming Call POSTs it.
// An empty code (clinics that keep insurance in the appointment comments) sends nothing.
// The insurance name goes to patient_insurance_other, which the Incoming Call summaries print.
// For Other (10005) the agent already typed it on the selection screen, so it is left as typed.
ZT.setFormData("patient_insurance_rt_code", patient_insurance_rt_code);
ZT.setFormData("insurance_route", insurance_route);
if (is_using_insurance === "Yes" && selected_insurance.code !== "10005") {
  ZT.setFormData("patient_insurance_other", selected_insurance.label);
}
