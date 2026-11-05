// --- inputs -----------------------------------------------------------------
// clinic_raintree_code comes from the clinic info set upstream in Incoming Call.
// alias_35 is the clinic's "Raintree Insurance" list from SharePoint, one string per insurance.
let clinic_code = String(ZT.getVariableValue("clinic_raintree_code", "")).trim().toUpperCase();
let raintree_insurance = actions.alias_35;
let response_code = raintree_insurance._zt_meta.response.code;
let is_raintree_insurance_ok = response_code >= 200 && response_code < 300;

// --- SharePoint insurance rows ----------------------------------------------
// Each cell reads "Plan name; Raintree code; Status;". Clinics that keep insurance in the
// appointment comments leave the code empty ("Plan name; ; Status;"), so nothing is sent
// to Raintree for them. Cells are typed by hand in SharePoint, which turns " - " into an en
// dash and drops spaces, so the status is matched on its letters only. Any "Not Accepted"
// that is not Medicaid (Not Accepted - Insurance, Not Accepted - All Other) offers self-pay.
// Rows still in the old name-only format, or with a status not listed here, are left out.
// A clinic with no list comes back 2xx without insurance_list; it reads as no rows.
// Several plans share one Raintree code, so the dropdown value is the plan name, not the code.
let sharepoint_catalog = [];
if (is_raintree_insurance_ok) {
  let rows = raintree_insurance.insurance_list || [];
  for (let i = 0; i < rows.length; i++) {
    let parts = rows[i].split(";");
    if (parts.length < 3) {
      continue;
    }
    let label = parts[0].trim();
    let code = parts[1].trim();
    let status_text = parts[2].toLowerCase().replace(/[^a-z]/g, "");
    let status = "";
    if (status_text === "accepted") {
      status = "accepted";
    } else if (status_text === "managed") {
      status = "managed";
    } else if (status_text.startsWith("notacceptedmedicaid")) {
      status = "not_accepted_medicaid";
    } else if (status_text.startsWith("notaccepted")) {
      status = "not_accepted_other";
    }
    if (label !== "" && status) {
      sharepoint_catalog.push({ value: label, label: label, code: code, status: status });
    }
  }
}

// --- static catalogue --------------------------------------------------------
// Used for the rollout clinics until their SharePoint cells are in the new format.
// value = what the dropdown returns (the name), code = the Raintree insurance code, status = the route:
//   accepted              -> collect insurance details and schedule
//   not_accepted_medicaid -> Medicaid not accepted, end call
//   not_accepted_other    -> not accepted, offer self-pay rates, schedule or end call
//   managed               -> not taking new patients on this plan, call back next month
// Other (10005) is accepted and opens a free-text insurance name on the selection screen.
let static_catalog = [
  { value: "Aetna", label: "Aetna", code: "10001", status: "accepted" },
  { value: "MVA", label: "MVA", code: "10002", status: "accepted" },
  { value: "BCBS", label: "BCBS", code: "10003", status: "accepted" },
  { value: "Cigna", label: "Cigna", code: "10004", status: "accepted" },
  { value: "Other", label: "Other", code: "10005", status: "accepted" },
  { value: "Medicare Advantage -MA", label: "Medicare Advantage -MA", code: "10006", status: "accepted" },
  { value: "Medicare (MC)", label: "Medicare (MC)", code: "10007", status: "accepted" },
  { value: "Medicaid (MD)", label: "Medicaid (MD)", code: "10008", status: "accepted" },
  { value: "Medicaid Advantage (MDA)", label: "Medicaid Advantage (MDA)", code: "10009", status: "accepted" },
  { value: "Tricare/VA", label: "Tricare/VA", code: "10011", status: "accepted" },
  { value: "UHC", label: "UHC", code: "10012", status: "accepted" },
  { value: "Workers Comp (WC)", label: "Workers Comp (WC)", code: "10013", status: "accepted" }
];

// Every list ends with the two catch-alls for an insurance the clinic does not list.
let not_listed = [
  { value: "medicaid_not_listed", label: "Medicaid plan not listed", code: "", status: "not_accepted_medicaid" },
  { value: "other_not_listed", label: "Other insurance not listed", code: "", status: "not_accepted_other" }
];

let is_sharepoint_catalog = sharepoint_catalog.length > 0;
let insurance_catalog = (is_sharepoint_catalog ? sharepoint_catalog : static_catalog).concat(not_listed);

// --- dropdown options --------------------------------------------------------
// insurance_selection_list: every catalogue entry, the option source for the selection screen.
// insurance_list: accepted insurances that carry a Raintree code, the option source for the
// secondary insurance dropdown, which sends its value to Raintree as a code.
let insurance_selection_list = [];
let insurance_list = [];
for (let i = 0; i < insurance_catalog.length; i++) {
  let entry = insurance_catalog[i];
  insurance_selection_list.push({ name: entry.label, value: entry.value });
  if (entry.status === "accepted" && entry.code !== "") {
    insurance_list.push({ name: entry.label, value: entry.code });
  }
}

// --- staged rollout ----------------------------------------------------------
// A clinic gets the selection screen when its SharePoint cells are in the new format, so Ivy
// moves a clinic over from SharePoint. These clinics also get it on the static catalogue:
// Brooklyn, Long Island, South Charlotte, Virginia Beach, Northeast New Jersey, and ZZZ (test).
let insurance_dropdown_clinics = [
  "NY181", "NY182", "NY268", "NY186", "NY267", "NY264", "NY162", "NY269", "NY171", "NY163",
  "NY169", "NY302", "NY183", "NY172", "NC405", "NC435", "NC258", "NC433", "NC436", "NC408",
  "SC424", "SC431", "NC422", "SC425", "NC409", "SC432", "SC451", "VA764", "VA758", "VA759",
  "VA761", "VA762", "VA763", "VA766", "VA767", "VA757", "VA768", "VA778", "VA773", "VA774",
  "VA779", "VA781", "VA755", "NY179", "NY178", "NY173", "NY191", "NY188", "NY177", "NY175",
  "NY176", "NY174", "NY192", "NY193", "NY194", "NY195", "NJ678", "NJ661", "NJ662", "NJ664",
  "NJ663", "NJ665", "NJ666", "NJ667", "NJ671", "NJ693", "NJ604", "NJ605", "NJ607", "NJ672",
  "NJ634", "NJ691", "NJ633", "NJ689", "NJ673", "NJ618", "NJ677", "NJ632", "NJ682", "NJ707",
  "NY196", "ZZZ"
];
let is_display_insurance_dropdown = is_sharepoint_catalog || insurance_dropdown_clinics.includes(clinic_code);

// --- outputs ----------------------------------------------------------------
ZT.setFormData("insurance_catalog", JSON.stringify(insurance_catalog));
ZT.setTransformData("insurance_list", insurance_list);
ZT.setTransformData("insurance_selection_list", insurance_selection_list);
ZT.setFormData("is_display_insurance_dropdown", is_display_insurance_dropdown ? "true" : "false");
