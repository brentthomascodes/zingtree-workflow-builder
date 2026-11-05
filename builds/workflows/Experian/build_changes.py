#!/usr/bin/env python3
# Applies the post-node-140 "iterate selected joint accounts + display" changes
# to the Experian "IS - Experian Credit Report" tree (910472552).
# Preserves all IDs/schema; changes only what the requirement needs.
import json, copy, sys

SRC = "/sessions/loving-blissful-mendel/mnt/uploads/IS - Experian Credit Report_1783985028280.json"
OUT = "/sessions/loving-blissful-mendel/mnt/Claude Cowork - Zingtree/Jarvis/Zingtree Builder/Workflow JSONs/Experian/IS - Experian Credit Report_UPDATED.json"

d = json.load(open(SRC))
nodes = d["nodes"]

# ---------------------------------------------------------------------------
# 1. UPDATE NODE 140 (Script "Format isJointAccounts")
#    - add class="zt-data" so each checkbox is captured as option_N (required
#      for the downstream iterate to read selections)
#    - append a fixed "None of these accounts apply" checkbox (option_none)
#    - keep account.value as the label (comprehensive info, per Marcus recap)
# ---------------------------------------------------------------------------
node140_script = r'''// ---------------------------------------------------------------------------
// Zingtree script node  -  Format isJointAccounts
// 1. Filters CVT accounts down to ACTIVE JOINT accounts.
// 2. Builds a stringified HTML multi-select checkbox list from them.
//      checkbox VALUE = account.value   (comprehensive company + account info)
//      checkbox LABEL = account.value
//    Each input carries class="zt-data" so Zingtree captures option_0..option_(n-1).
// 3. Adds a fixed "None of these accounts apply" checkbox (name/id = option_none).
// 4. Exposes everything back to Zingtree. Render the list in a Content node via:
//      ${transforms.active_joint_accounts_html}
// ---------------------------------------------------------------------------

// --- 0. Safely read + parse the accounts data ------------------------------
let raw = ZT.getVariableValue("cvt_report_report_accounts", "");
raw = (raw == null ? "" : String(raw)).trim();

let parsed = null;
if (raw) {
  try {
    parsed = JSON.parse(raw);
  } catch (e1) {
    try {
      parsed = JSON.parse("[" + raw + "]");
    } catch (e2) {
      parsed = null;
    }
  }
}

// Accept either the broken-out accounts array or the full CVT object.
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
    let name = 'option_' + i;
    let val = esc(acct.value);
    let label = esc(acct.value);

    html +=
      '<label for="' + name + '" ' +
        'style="display:flex;align-items:center;gap:10px;padding:12px 14px;border:1px solid #d0d5dd;' +
        'border-radius:8px;cursor:pointer;font-size:15px;">' +
        '<input type="checkbox" class="zt-data" id="' + name + '" name="' + name + '" ' +
          'value="' + val + '" style="width:18px;height:18px;flex:0 0 auto;cursor:pointer;">' +
        '<span>' + label + '</span>' +
      '</label>';
  });

  // Fixed "none of these accounts apply" option (for when the customer has no
  // joint accounts with the person being removed).
  html +=
    '<label for="option_none" ' +
      'style="display:flex;align-items:center;gap:10px;padding:12px 14px;border:1px dashed #d0d5dd;' +
      'border-radius:8px;cursor:pointer;font-size:15px;color:#475467;">' +
      '<input type="checkbox" class="zt-data" id="option_none" name="option_none" ' +
        'value="none" style="width:18px;height:18px;flex:0 0 auto;cursor:pointer;">' +
      '<span>None of these accounts apply</span>' +
    '</label>';

  html += '</div>';
}

// --- 4. Expose to Zingtree --------------------------------------------------
ZT.setFormData("is_active_joint_accounts", is_active_joint_accounts);
ZT.setTransformData("active_joint_accounts", active_joint_accounts);
ZT.setTransformData("active_joint_accounts_html", html);

// Count of rendered account options. Iterate option_0..option_(n-1) downstream
// (node 142) to read which were ticked; option_none is read separately.
ZT.setFormData("active_joint_accounts_count", active_joint_accounts.length);
'''
nodes["140"]["content"] = node140_script

# ---------------------------------------------------------------------------
# 2. UPDATE NODE 127 (Content "Has active joint accounts")
#    - add a Continue button -> 142 (currently a dead end: no buttons, cont=0)
# ---------------------------------------------------------------------------
nodes["127"]["buttons"] = {
  "0": {
    "button_text": ".btn-primary Continue",
    "hover_text": "",
    "button_link": "142",
    "rank": "1",
    "button_data": "",
    "logic_expression": "",
    "wizard_skip": "0",
    "value": "0",
    "op": "",
    "updated": "0"
  }
}

# ---------------------------------------------------------------------------
# 3. NEW NODE 142 (Script "Collect selected joint accounts")
#    - iterate option_0..option_(n-1), collect ticked accounts (match by value)
#    - read option_none; set detection flags; build the display HTML
# ---------------------------------------------------------------------------
node142_script = r'''// ---------------------------------------------------------------------------
// Zingtree script node  -  Collect selected joint accounts
// Iterates the checkboxes rendered by node 140 (option_0..option_(n-1)),
// collects the accounts the agent ticked (matched back to the full account
// object by its `value`), reads the fixed "none of these accounts apply"
// checkbox, sets detection flags for conditional logic, and builds the
// display HTML rendered by the content node via
// ${transforms.selected_joint_accounts_html}.
// ---------------------------------------------------------------------------

let count = parseInt(ZT.getVariableValue("active_joint_accounts_count", "0"), 10) || 0;
let allAccounts = transforms.active_joint_accounts || [];

// "None of these accounts apply" -> non-empty when ticked.
let noneApply = ZT.getVariableValue("option_none", "") !== "";

// Collect the ticked account options.
let selected = [];
for (let i = 0; i < count; i++) {
  let val = ZT.getVariableValue("option_" + i, ""); // account.value if ticked, "" if not
  if (val) {
    let match = allAccounts.filter(a => a.value === val)[0];
    selected.push(match || { value: val });
  }
}

let hasSelected = selected.length >= 1;

function esc(s) {
  return String(s == null ? '' : s)
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function row(label, value) {
  return '<div style="display:flex;gap:8px;padding:2px 0;font-size:14px;">' +
    '<span style="min-width:150px;color:#475467;">' + esc(label) + '</span>' +
    '<span style="color:#101828;">' + esc(value) + '</span></div>';
}

// Build the display HTML for the three cases.
let html = '';
if (hasSelected) {
  html += '<div style="display:flex;flex-direction:column;gap:12px;">';
  selected.forEach(a => {
    html += '<div style="padding:12px 14px;border:1px solid #c7d2fe;border-radius:8px;background:#eef2ff;">';
    html += '<div style="font-weight:600;font-size:15px;margin-bottom:6px;">' + esc(a.value || a.companyName) + '</div>';
    if (a.companyName) html += row('Company', a.companyName);
    if (a.accountType) html += row('Account type', a.accountType);
    if (a.entryNumber) html += row('Entry number', a.entryNumber);
    if (a.startDate) html += row('Start date', a.startDate);
    if (a.typeStatus) html += row('Status', a.typeStatus);
    if (a.balance !== undefined && a.balance !== null) html += row('Balance', a.balance);
    html += '</div>';
  });
  html += '</div>';
} else if (noneApply) {
  html = '<div style="padding:12px 14px;border:1px solid #e5e7eb;border-radius:8px;background:#f9fafb;">' +
         '<p style="margin:0;font-size:15px;">The customer confirmed that <strong>none of the listed accounts apply</strong>.</p></div>';
} else {
  html = '<div style="padding:12px 14px;border:1px solid #fed7aa;border-radius:8px;background:#fff7ed;">' +
         '<p style="margin:0;font-size:15px;">No joint accounts were selected.</p></div>';
}

let selectedValues = selected.map(a => a.value);

// Detection flags (scalars) -> setFormData ; arrays/HTML -> setTransformData.
ZT.setFormData("has_selected_joint_accounts", hasSelected);
ZT.setFormData("none_of_these_accounts_apply", noneApply);
ZT.setFormData("selected_joint_accounts_count", selected.length);
ZT.setTransformData("selected_joint_accounts", selected);
ZT.setTransformData("selected_joint_account_values", selectedValues);
ZT.setTransformData("selected_joint_accounts_html", html);
ZT.setFormData("selected_joint_accounts_text", selectedValues.join("; "));
'''

n142 = copy.deepcopy(nodes["140"])   # clone Script schema
n142["page_title"] = "Collect selected joint accounts"
n142["project_node_id"] = "142"
n142["content"] = node142_script
n142["continuation_node_id"] = "143"
n142["continuation_button_text"] = ""
n142["display_order"] = "116"
n142["buttons"] = {}
n142["formfields"] = {}
n142["data_connected_objects"] = {}
n142["app_messages"] = {}
nodes["142"] = n142

# ---------------------------------------------------------------------------
# 4. NEW NODE 143 (Scoring "Any joint accounts selected?")  -- mirrors node 141
#    has_selected_joint_accounts == true -> 144 (display) ; else -> 145
# ---------------------------------------------------------------------------
n143 = copy.deepcopy(nodes["141"])   # clone Scoring schema exactly
n143["page_title"] = "Any joint accounts selected?"
n143["project_node_id"] = "143"
n143["display_order"] = "117"
n143["continuation_node_id"] = "145"   # default target (mirror 141 -> its default 128)
n143["buttons"] = {
  "0": {
    "button_text": "has_selected_joint_accounts",
    "hover_text": "",
    "button_link": "144",
    "rank": "1",
    "button_data": "true",
    "logic_expression": "",
    "wizard_skip": "0",
    "value": "0",
    "op": "eq",
    "updated": "0"
  },
  "1": {
    "button_text": "",
    "hover_text": "",
    "button_link": "145",
    "rank": "2",
    "button_data": "",
    "logic_expression": "",
    "wizard_skip": "0",
    "value": "0",
    "op": "def",
    "updated": "0"
  }
}
nodes["143"] = n143

# ---------------------------------------------------------------------------
# 5. NEW NODE 144 (Content "Selected joint accounts")  -- clone node 127 schema
# ---------------------------------------------------------------------------
n144 = copy.deepcopy(nodes["127"])
n144["page_title"] = "Selected joint accounts"
n144["project_node_id"] = "144"
n144["display_order"] = "118"
n144["content"] = "<h3>Selected joint accounts</h3><p><br></p><p>${transforms.selected_joint_accounts_html}</p>"
n144["continuation_node_id"] = "0"
n144["buttons"] = {}
nodes["144"] = n144

# ---------------------------------------------------------------------------
# 6. NEW NODE 145 (Content "No joint accounts selected")  -- clone node 127
# ---------------------------------------------------------------------------
n145 = copy.deepcopy(nodes["127"])
n145["page_title"] = "No joint accounts selected"
n145["project_node_id"] = "145"
n145["display_order"] = "119"
n145["content"] = "<p>${transforms.selected_joint_accounts_html}</p>"
n145["continuation_node_id"] = "0"
n145["buttons"] = {}
nodes["145"] = n145

json.dump(d, open(OUT, "w"), indent=1, ensure_ascii=False)
print("WROTE:", OUT)
print("total nodes now:", len(nodes))
