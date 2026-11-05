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

// --- disciplines (Therapy Type): auto-selected from therapy_type -----------
// An explicit pick on the SNPA dropdown wins; otherwise every therapy type on the call
// is resolved against DPAY. Unmatched values are dropped rather than guessed.
let discipline_source = discipline_selection !== "" ? toList(discipline_selection) : toList(therapy_type_raw);
let discipline_codes = [];
discipline_source.forEach(v => {
  let code = matchCode(disciplines_table, v);
  if (code !== "" && !discipline_codes.includes(code)) discipline_codes.push(code);
});

// --- primaryReason (case type): body part resolved against CASET ------------
// Raintree rejects free text ("Invalid primary reason: BACK/L CALF"), so only a real CASET
// code is ever sent. Try the whole body part, then each word of it, then the therapy type.
let body_part_words = body_part.split(/[^A-Za-z0-9]+/).filter(w => w.length >= 2);
let case_type_candidates = [body_part].concat(body_part_words, toList(therapy_type_raw));
let case_type_code = "";
for (let i = 0; i < case_type_candidates.length && case_type_code === ""; i++) {
  case_type_code = matchCode(case_types_table, case_type_candidates[i]);
}

// --- outputs ----------------------------------------------------------------
// String flag: node 5 routes on is_existing_lead == 'true'. A boolean did not compare reliably in the router.
ZT.setFormData("is_existing_lead", is_existing_lead ? "true" : "false");
ZT.setFormData("lead_disciplines_json", JSON.stringify(discipline_codes));
ZT.setFormData("lead_primary_reason", case_type_code);
ZT.log("lead codes: " + JSON.stringify({ disciplines: discipline_codes, primaryReason: case_type_code }));
