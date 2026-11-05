// Source session: "Experian joint accounts logic" (local_88318bd9-5f3e-44af-836e-81502dc69cab)
// Account/customer: Experian (CVT credit report / credit_expert)
// Purpose: Script Node that filters CVT report accounts to ACTIVE JOINT accounts
//          (isJointAccount == true && typeStatus == "Active"), renders them as a
//          stringified HTML checkbox multi-select (name/id = option_0..option_n-1,
//          value = account.value, label = companyName) for a Content Node via
//          #active_joint_accounts_html#, and exposes count + flags to Zingtree.
// Known issue fixed later in the session: JSON.parse throws
//          "Unexpected token at the end: <nil>" when cvt_report_report_accounts
//          is empty/nil, and `.report.report.accounts` only works when the
//          variable holds the FULL CVT object (not the broken-out accounts
//          array). The hardened final version (parse as-is first, bracket-wrap
//          fallback, nil guard, handles both shapes) is saved alongside this
//          file as zt-scripts/joint_account_multiselect.js.

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

// --- 1. Filter to active joint accounts ------------------------------------
// NOTE: use .filter (not .map). .map returns `undefined` for non-matches,
// which leaves holes in the array and makes .length always the full count.
let accounts = JSON.parse(ZT.getVariableValue("cvt_report_report_accounts", "")).report.report.accounts;

let active_joint_accounts = accounts.filter(x => {
  return x.isJointAccount == true && x.typeStatus == "Active";
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
ZT.setTransformData("active_joint_accounts_html", html);

// Number of options rendered. Use this downstream to iterate option_0 ... option_(n-1)
// and check which ones were selected, e.g.:
//   let count = getFormFieldValue("active_joint_accounts_count");
//   for (let i = 0; i < count; i++) {
//     let selected = getFormFieldValue("option_" + i); // value string if ticked, empty if not
//     ...
//   }
ZT.setFormData("active_joint_accounts_count", active_joint_accounts.length);
