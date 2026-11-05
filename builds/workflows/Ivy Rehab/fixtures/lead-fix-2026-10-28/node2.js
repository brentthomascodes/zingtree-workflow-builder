// --- inputs -----------------------------------------------------------------
// therapy_type arrives from Schedule New Patient node 174 as "PT" or "PT,OT".
// discipline_selection only exists once the new SNPA discipline dropdown (node 192) is live.
let therapy_type_raw = ZT.getVariableValue("therapy_type", "");
let discipline_selection = ZT.getVariableValue("discipline_selection", "");
let body_part = ZT.getVariableValue("body_part", "");
let lead_search = actions.raintree__find_leads || {};
let disciplines_table = actions.raintree__get_disciplines?.tables || [];
let case_types_table = actions.raintree__get_case_types?.tables || [];

// --- does Raintree already hold this patient? -------------------------------
// Same test node 5 routes on. A failed search has no records, so it falls through to create.
let lead_records = lead_search.records || [];
let is_existing_lead = lead_records.length >= 1;

// --- helpers ----------------------------------------------------------------
const norm = s => String(s || "").trim().toLowerCase();
const toList = v => (Array.isArray(v) ? v : String(v || "").split(","))
  .map(s => String(s).trim())
  .filter(s => s !== "");

// Match a custom-table row on description first, then code. "" when nothing matches.
const matchCode = (rows, value) => {
  let wanted = norm(value);
  if (wanted === "") return "";
  let row = rows.find(r => norm(r.description) === wanted) ||
            rows.find(r => norm(r.code) === wanted);
  return row ? row.code : "";
};

// --- disciplines + primaryReason -------------------------------------------
// Raintree only accepts a primaryReason whose CASET row is filtered to one of the lead's
// disciplines: TMJ is a PT reason, so ["AB"] + TMJ comes back "Invalid primary reason: TMJ".
// The SNPA dropdown pick is tried first. If no case type fits it, the call's therapy type is used.
const resolveDisciplines = source => {
  let codes = [];
  toList(source).forEach(v => {
    let code = matchCode(disciplines_table, v);
    if (code !== "" && !codes.includes(code)) codes.push(code);
  });
  return codes;
};

// Raintree rejects free text ("Invalid primary reason: BACK/L CALF"), so only a real CASET
// code is ever sent. Try the whole body part, then each word of it, then the therapy type.
const resolveCaseType = disciplineCodes => {
  let rows = case_types_table.filter(r => disciplineCodes.includes(r.filter));
  let body_part_words = body_part.split(/[^A-Za-z0-9]+/).filter(w => w.length >= 2);
  let candidates = [body_part].concat(body_part_words, toList(therapy_type_raw));
  for (let i = 0; i < candidates.length; i++) {
    let code = matchCode(rows, candidates[i]);
    if (code !== "") return code;
  }
  return "";
};

let discipline_codes = resolveDisciplines(discipline_selection);
let case_type_code = resolveCaseType(discipline_codes);
if (case_type_code === "") {
  discipline_codes = resolveDisciplines(therapy_type_raw);
  case_type_code = resolveCaseType(discipline_codes);
}

// --- outputs ----------------------------------------------------------------
// String flag: node 5 routes on is_existing_lead == 'true'. A boolean did not compare reliably in the router.
ZT.setFormData("is_existing_lead", is_existing_lead ? "true" : "false");
ZT.setFormData("lead_disciplines_json", JSON.stringify(discipline_codes));
ZT.setFormData("lead_primary_reason", case_type_code);
