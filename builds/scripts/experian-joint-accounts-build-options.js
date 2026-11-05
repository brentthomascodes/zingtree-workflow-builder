// Source session: Experian joint accounts NATIVE single-select (Jul 2026, Brent)
// Account/customer: Experian (CVT credit report / credit_expert)
// Purpose: Zingtree Script Node. Filters CVT accounts to ACTIVE JOINT accounts
//          and stages an options array for a NATIVE dynamic `select` field
//          (no custom HTML). Appends "None of these apply" as the LAST option.
//          The Content node's native select reads this transform; making the
//          field required is done natively in the field config (required:"1").
//
// OUTPUT transform consumed by the native select's list_dynamic_source:
//   transforms.joint_account_options - [{label, value}, ... , {label:"None of these apply", value:"na"}]
// Also keeps:
//   transforms.active_joint_accounts  - the raw filtered account objects
//   is_active_joint_accounts (bool), active_joint_accounts_count (number)
// ---------------------------------------------------------------------------

// --- 0. Safely read + parse the accounts data ------------------------------
let raw = ZT.getVariableValue("cvt_report_report_accounts", "");
raw = (raw == null ? "" : String(raw)).trim();

let parsed = null;
if (raw) {
  try {
    parsed = JSON.parse(raw);                 // valid array or full CVT object
  } catch (e1) {
    try {
      parsed = JSON.parse("[" + raw + "]");   // bare, bracket-less list fallback
    } catch (e2) {
      parsed = null;
    }
  }
}

let accounts = [];
if (Array.isArray(parsed)) {
  accounts = parsed;
} else if (parsed && parsed.report && parsed.report.report && Array.isArray(parsed.report.report.accounts)) {
  accounts = parsed.report.report.accounts;
}

// --- 1. Filter to active joint accounts ------------------------------------
let active_joint_accounts = accounts.filter(x => {
  return x.isJointAccount === true && x.typeStatus === "Active";
});

let is_active_joint_accounts = active_joint_accounts.length >= 1;

// --- 2. Build the {label, value} options for the native select -------------
// label = human-readable company name; value = account.value.
let joint_account_options = active_joint_accounts.map(acct => {
  return { label: String(acct.companyName), value: String(acct.value) };
});

// ALWAYS append "None of these apply" as the LAST option, value "na".
joint_account_options.push({ label: "None of these apply", value: "na" });

// --- 3. Expose to Zingtree --------------------------------------------------
ZT.setTransformData("active_joint_accounts", active_joint_accounts);
ZT.setTransformData("joint_account_options", joint_account_options);
ZT.setFormData("is_active_joint_accounts", is_active_joint_accounts);
ZT.setFormData("active_joint_accounts_count", active_joint_accounts.length);
