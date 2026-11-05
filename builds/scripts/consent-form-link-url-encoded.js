// consent-form-link-url-encoded.js
// Source: Brent, Jul 2026 — consent form link sent via Zingtree email node.
// Purpose: build the preview/consent URL and stage it as consent_form_link,
//          and expose the selected client's name and ID for downstream nodes.
// Fix: URL-encode the company value so spaces (e.g. "AutoNation Consent")
//      become %20. Email clients auto-link by scanning for an unbroken run of
//      characters and stop at the first space, which truncated the hyperlink
//      and dropped the final query param. Encoding keeps it one clickable token.
// Note: query param renamed zv_comapny -> zv_company (was a typo).

function generateGuid() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxx'.replace(/[xy]/g, function (c) {
    let r = Math.random() * 16 | 0,
        v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

// Client info keyed by company_score. Mirrors quest_consent_dictionary_with_client_info.js.
// Keep in sync with that dictionary when clients are added/changed.
var clientData = {
  "autonation_consent": { "client name": "AutoNation", "client ID": "10035" },
  "honeywell_international_inc": { "client name": "Honeywell", "client ID": "10430" },
  "bcbs_of_alabama_custom_consent": { "client name": "BCBS of Alabama", "client ID": "20248" },
  "partners_for_health_consent": { "client name": "State of Tennessee", "client ID": "29820" },
  "solutions_program_authorization_for_release_of_health_screening_results__rock_and_roll_hall_of_fame": { "client name": "Rock and Roll Hall of Fame", "client ID": "33903" },
  "sharecare_1272020": { "client name": "Sharecare", "client ID": "14503" },
  "shbp_2020": { "client name": "State of Georgia", "client ID": "30339" },
  "cigna_consent_english_2024": { "client name": "CIGNA", "client ID": "10183" },
  "cigna_consent_spanish_2020": { "client name": "CIGNA", "client ID": "10183" },
  "choose_healthy_life_hipaa_authorization": { "client name": "Choose Healthy Life Q4HE", "client ID": "44638" },
  "crown_2023_custom_consent": { "client name": "Crown Equipment", "client ID": "17569" },
  "occ_health": { "client name": "Saratoga Bridges", "client ID": "46536" },
  "qual_med": { "client name": "Huntington Ingalls Incorporated", "client ID": "42899" },
  "occ_health_custom_consent": { "client name": "Direct WE Clients", "client ID": "10189" },
  "asarco_consent": { "client name": "ASARCO LLC", "client ID": "10082" },
  "healthyquest_bfw_hipaa_authorization_08292025": { "client name": "HealthyQuest", "client ID": "10074" },
  "quad_med": { "client name": "QuadMed", "client ID": "42936" },
  "honeywell_aerospace_custom_consent": { "client name": "Honeywell Aerospace", "client ID": "47878" }
};

// Generic getter — pull any field ("client name", "client ID", ...) for the
// selected company_score. Returns "" if the score or field is missing.
function getClientValue(companyScore, field) {
  var entry = clientData[companyScore];
  return (entry && entry[field]) || "";
}

let guid = generateGuid();
let company_score = ZT.getVariableValue("company_score", "");
let company = ZT.getVariableValue("company", "");

let client_name = getClientValue(company_score, "client name");
let client_id = getClientValue(company_score, "client ID");

let url = "https://zingtree.com/preview/973795360"
  + "?session_id=" + guid
  + "&zv_company_score=" + encodeURIComponent(company_score)

ZT.setFormData("consent_form_link", url);
ZT.setFormData("user_consent_session_id", guid);
ZT.setFormData("client_name", client_name);
ZT.setFormData("client_id", client_id);
