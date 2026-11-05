// SOURCE: Found in connected workspace root (Claude Cowork - Zingtree/joint-account-multiselect.js)
// ACCOUNT: (bank/financial customer - CVT accounts webhook)
// PURPOSE: Zingtree Script Node. Parses webhook JSON via ZT.getVariableValue with defensive re-wrap, filters ACTIVE JOINT accounts, generates stringified HTML checkbox multi-select (rendered in a Content Node via #active_joint_accounts_html#), exposes option_N counter pattern via ZT.setFormData + active_joint_accounts_count for downstream iteration.

// ---------------------------------------------------------------------------
// Zingtree script node
// 1. Filters CVT accounts down to ACTIVE JOINT accounts.
// 2. Builds a stringified HTML multi-select checkbox list from them.
//      checkbox VALUE = account.value
//      checkbox LABEL = account.companyName
// 3. Exposes everything back to Zingtree.
//    Render the list in a Content node via the merge field:
//      #active_joint_accounts_html#
// ---------------------------------------------------------------------------

// --- 0. Safely read + parse the accounts data ------------------------------
// getVariableValue can return nil/"" if the webhook hasn't populated the var yet.
// JSON.parse(nil) throws "Unexpected token at the end: <nil>", so guard first.
let raw = ZT.getVariableValue("cvt_report_report_accounts", "");

// Normalize to a string and trim.
raw = (raw == null ? "" : String(raw)).trim();

let parsed = null;
if (raw) {
  try {
    // Try parsing exactly as-is first (valid array or full CVT object).
    parsed = JSON.parse(raw);
  } catch (e1) {
    // Fallback: a bare, bracket-less list of objects ("{...}, {...}").
    // Wrap in [ ] and retry before giving up.
    try {
      parsed = JSON.parse("[" + raw + "]");
    } catch (e2) {
      parsed = null; // fall through to the "no accounts" branch below
    }
  }
}

// Accept either shape:
//   a) the broken-out accounts array itself  -> use directly
//   b) the full CVT object                   -> dig into .report.report.accounts
let accounts = [];
if (Array.isArray(parsed)) {
  accounts = parsed;
} else if (parsed && parsed.report && parsed.report.report && Array.isArray(parsed.report.report.accounts)) {
  accounts = parsed.report.report.accounts;
}

// --- 1. Filter to active joint accounts ------------------------------------
// NOTE: use .filter (not .map). .map returns `undefined` for non-matches,
// which leaves holes in the array and makes .length always the full count.
let active_joint_accounts = accounts.filter(x => {
  return x.isJointAccount === true && x.typeStatus === "Active";
});

let is_active_joint_accounts = active_joint_accounts.length >= 1;

// --- 2. Keep values/labels HTML-safe ---------------------------------------
function esc(s) {
  return String(s == null ? '' : s)
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

// --- 3. Build the stringified HTML -----------------------------------------
let html = '';

if (!is_active_joint_accounts) {
  html = '<p>No active joint accounts to display.</p>';
} else {
  html += '<div class="zt-account-multiselect" style="display:flex;flex-direction:column;gap:10px;">';

  active_joint_accounts.forEach((acct, i) => {
    // Unique, index-based name/id so each option can be referenced individually
    // later in the flow (e.g. read option_0, option_1, ... to see what's ticked).
    let name = 'option_' + i;
    let val = esc(acct.value);
    let label = esc(acct.companyName);

    html +=
      '<label for="' + name + '" ' +
        'style="display:flex;align-items:center;gap:10px;padding:12px 14px;border:1px solid #d0d5dd;' +
        'border-radius:8px;cursor:pointer;font-size:15px;">' +
        '<input type="checkbox" id="' + name + '" name="' + name + '" ' +
          'value="' + val + '" style="width:18px;height:18px;flex:0 0 auto;cursor:pointer;">' +
        '<span>' + label + '</span>' +
      '</label>';
  });

  html += '</div>';
}

// --- 4. Expose to Zingtree --------------------------------------------------
ZT.setFormData("is_active_joint_accounts", is_active_joint_accounts);
ZT.setTransformData("active_joint_accounts", active_joint_accounts);
ZT.setFormData("active_joint_accounts_html", html);

// Number of options rendered. Use this downstream to iterate option_0 ... option_(n-1)
// and check which ones were selected, e.g.:
//   let count = getFormFieldValue("active_joint_accounts_count");
//   for (let i = 0; i < count; i++) {
//     let selected = getFormFieldValue("option_" + i); // value string if ticked, empty if not
//     ...
//   }
ZT.setFormData("active_joint_accounts_count", active_joint_accounts.length);
