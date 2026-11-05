// Source session: Experian joint accounts checkbox READER (Jul 2026, Brent)
// Purpose: Zingtree Script Node (READER). Runs AFTER the Content node that renders
//          the checkbox HTML. Loops option_0 .. option_(count-1), collects the values
//          of the CHECKED boxes, matches each back to its full account object, and
//          flags whether any selected account is a MORTGAGE.
//
// FIX (Jul 2026): unchecked checkboxes read back as the string "0" (NOT ""), so the
//          old `if (!v) continue;` guard let every "0" through ("0" is truthy in JS).
//          Now we compare each read to the account's OWN expected value
//          (v === String(accounts[i].value)) — the org-proven guard. This drops
//          unchecked "0"s and any stray reads, keeping ONLY the real selected values.
//
// INPUTS:
//   joint_account_option_count (number)   - total checkboxes rendered
//   option_0 .. option_(count-1)           - each holds its value string when checked, "0" when not
//   transforms.active_joint_accounts       - full account objects (from the builder script)
//
// OUTPUTS:
//   transforms.selected_joint_accounts        - array of selected value strings
//   transforms.selected_joint_account_objects - array of matched account objects
//   transforms.selected_mortgage_accounts     - subset that are mortgages (objects)
//   transforms.selected_joint_accounts_html   - PASTEABLE inline HTML block of selections
//   transforms.selected_mortgage_accounts_html - PASTEABLE inline HTML block of mortgage selections
//   transforms.selected_joint_accounts_text   - comma-joined list for plain-text copy
//   selected_joint_accounts_count (number)
//   selected_mortgage_accounts_count (number)
//   is_any_mortgage_selected (bool)
//   is_none_apply_selected (bool)
// ---------------------------------------------------------------------------

// Keep values HTML-safe when building the pasteable block.
function esc(s) {
  return String(s == null ? '' : s)
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

// A joint account counts as a mortgage if its accountType mentions "mortgage".
function isMortgage(acct) {
  if (!acct) return false;
  let t = String(acct.accountType == null ? "" : acct.accountType).toLowerCase();
  return t.indexOf("mortgage") >= 0;
}

let count = parseInt(ZT.getVariableValue("joint_account_option_count", "0"), 10);
let accounts = transforms.active_joint_accounts || [];

// Index the full account objects by their value string for O(1) lookup.
let acctByValue = {};
accounts.forEach(a => { acctByValue[String(a.value)] = a; });

let selected = [];
let selected_objects = [];
let selected_mortgages = [];
let is_none_apply_selected = false;

for (let i = 0; i < count; i++) {
  let v = String(ZT.getVariableValue("option_" + i, "")).trim();

  // Unchecked boxes come back as "0" (or ""). Skip them.
  if (!v || v === "0") continue;

  if (v === "None of these apply") {
    is_none_apply_selected = true;
    continue;
  }

  // Only keep it if it matches this row's real expected value — this is what
  // guarantees the result is the actual selected accounts, never stray reads.
  let expected = accounts[i] ? String(accounts[i].value) : null;
  if (expected !== null && v !== expected) continue;

  selected.push(v);
  let acct = acctByValue[v] || null;
  if (acct) {
    selected_objects.push(acct);
    if (isMortgage(acct)) selected_mortgages.push(acct);
  }
}

let is_any_mortgage_selected = selected_mortgages.length >= 1;

// --- Pasteable inline HTML block of the selections -------------------------
let html = '';
if (selected.length === 0) {
  html = '<p style="margin:0;color:#6b7280;">No accounts selected.</p>';
} else {
  html += '<ul style="margin:0;padding-left:20px;font-size:14px;line-height:1.5;">';
  selected.forEach(v => { html += '<li>' + esc(v) + '</li>'; });
  html += '</ul>';
}

// Same simple display, limited to the selected MORTGAGE accounts.
let mortgage_html = '';
if (selected_mortgages.length === 0) {
  mortgage_html = '<p style="margin:0;color:#6b7280;">No mortgage accounts selected.</p>';
} else {
  mortgage_html += '<ul style="margin:0;padding-left:20px;font-size:14px;line-height:1.5;">';
  selected_mortgages.forEach(a => { mortgage_html += '<li>' + esc(a.value) + '</li>'; });
  mortgage_html += '</ul>';
}

ZT.setTransformData("selected_joint_accounts", selected);
ZT.setTransformData("selected_joint_account_objects", selected_objects);
ZT.setTransformData("selected_mortgage_accounts", selected_mortgages);
ZT.setTransformData("selected_joint_accounts_html", html);
ZT.setTransformData("selected_mortgage_accounts_html", mortgage_html);
ZT.setTransformData("selected_joint_accounts_text", selected.join(", "));

// FORM DATA VARIABLES
ZT.setFormData("selected_joint_accounts_count", selected.length);
ZT.setFormData("selected_mortgage_accounts_count", selected_mortgages.length);
ZT.setFormData("is_any_mortgage_selected", is_any_mortgage_selected);
ZT.setFormData("is_none_apply_selected", is_none_apply_selected);
