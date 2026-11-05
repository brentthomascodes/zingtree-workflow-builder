# Builds the Networks branch (INT) and the master queue-route row from the live 16 Oct exports.
# Sources: Gemma Danks "Daily AI standup - Fri 16th Oct" + attachments "Networks AI tree setup",
# "Phase 1 - Remittance auto email pushback"; Spiky standup 16 Oct.
import json, copy, os, sys
W = os.path.dirname(os.path.abspath(__file__)) + "/.."
NET_IN = W + "/master-split 2026-10-12/3 BRANCH - Networks 547469427 (BEFORE baseline 2026-10-16).json"
MASTER_IN = W + "/Email Automation - AI Actions INT 109029630 (BEFORE baseline 2026-10-16).json"
NET_OUT = W + "/networks-2026-10-16/3 BRANCH - Networks 547469427 (remittance MVP 2026-10-16).json"
MASTER_OUT = W + "/networks-2026-10-16/0 MASTER - Email Automation - AI Actions INT 109029630 (Networks route 2026-10-16).json"
NETWORKS_AI_ID = sys.argv[1] if len(sys.argv) > 1 else "0"   # id of automate_networks_email_intent_int in org 123

net = json.load(open(NET_IN))
master = json.load(open(MASTER_IN))
N = net["nodes"]

def clone(src, nid, ntype, title, content="", x=0, y=0):
    n = copy.deepcopy(src)
    n.update({"type": ntype, "project_node_id": str(nid), "page_title": title, "node_name": title[:64],
              "content": content, "x": str(x), "y": str(y), "is_root": "0", "buttons": {},
              "formfields": {}, "continuation_node_id": "0", "continuation_button_text": "",
              "ai_action_id": "0", "data_connected_objects": {}, "display_order": str(nid)})
    n.pop("config", None)
    return n

def btn(text, link, rank, expr="", data=""):
    return {"button_text": text, "hover_text": "", "button_link": str(link), "rank": str(rank),
            "button_data": data, "logic_expression": expr, "wizard_skip": "0", "value": "0",
            "op": "def" if (expr == "" and text == "") else "", "updated": "0"}

def field(rank, ftype, name, label, options="", regex="", required="1"):
    return {"type": ftype, "name": name, "label": label, "label_type": "L", "options": options,
            "hidden_value": "", "custom_regex": regex, "inline": "0", "required": required,
            "score_var": "", "checkbox_score": "1", "scores": "", "rank": str(rank), "config": ""}

SCRIPT, CONTENT, SCORING = N["6"], N["4"], N["7"]
FAST = json.load(open(W + "/master-split 2026-10-12/1 BRANCH - FAST Admin 474162496 (GDPR v2 2026-10-13).json"))["nodes"]

# ---- 7: eligible -> 91 (was holding screen 90) ----
for b in N["7"]["buttons"].values():
    if b["button_link"] == "90":
        b["button_link"] = "91"

# ---- 4 / 9: Merchant Request bypass (Networks only) ----
def add_merchant(nid):
    bs = N[nid]["buttons"]
    bs[str(len(bs))] = btn("Merchant Request", 92, len(bs) + 1, data="Merchant request bypass")
add_merchant("4")
add_merchant("9")

# ---- 92: merchant bypass flag ----
N["92"] = clone(SCRIPT, 92, "Script", "Merchant request bypass", """// The agent says this email is from a merchant, not a fuel-card customer. Salesforce has no
// reliable merchant field (Corpay UK, 16 Oct standup), so the agent's button is the signal.
// It skips the account-linked / eligibility rules and goes straight to the AI.
ZT.setFormData("networks_merchant_bypass", true);
// Salesforce Case Origin stamped on every AI-handled case.
ZT.setFormData("sf_Origin", "Zingtree AI");
""", 300, 1300)
N["92"]["continuation_node_id"] = "93"

# ---- 91: case origin ----
N["91"] = clone(SCRIPT, 91, "Script", "Set case origin", """// Salesforce Case Origin stamped on every AI-handled case.
ZT.setFormData("sf_Origin", "Zingtree AI");
""", 600, 1300)
N["91"]["continuation_node_id"] = "93"

# ---- 93: Networks intent AI Action ----
ai = copy.deepcopy(FAST["12"])
ai.update({"project_node_id": "93", "page_title": "Detect remittance request", "node_name": "Detect remittance request",
           "ai_action_id": str(NETWORKS_AI_ID), "x": "600", "y": "1420", "display_order": "93",
           "continuation_node_id": "94", "is_root": "0", "buttons": {}})
N["93"] = ai

# ---- 94: grade ----
N["94"] = clone(SCRIPT, 94, "Script", "Grade remittance check", """// --- inputs -----------------------------------------------------------------
let intent = actions.automate_networks_email_intent_int;

// --- read the AI Action, or say why it could not be read ------------------------
// AI Action responses carry no _zt_meta: every answer this Action returns has email_intent.
let intentRead = intent.email_intent !== undefined;
let intents = [];
let sentiment = "";
let escalate_reason = "";
let confidence_score = "";
let ai_exception_reason = "The remittance check did not return a result. Work this case as you normally would.";

if (intentRead) {
  intents = intent.email_intent;
  sentiment = intent.sentiment;
  escalate_reason = intent.escalate_reason;
  confidence_score = intent.confidence_score;
  ai_exception_reason = intent.ai_exception_reason;
}

// --- transform: one route for router 95 ------------------------------------------
let email_analysis_route = "escalation";
if (intentRead && intent.escalate_to_agent !== true) {
  email_analysis_route = intents.includes("remittance_copy_request") ? "in_scope" : "out_of_scope";
}

// --- outputs ----------------------------------------------------------------
ZT.setFormData("email_intent", intents.join(", "));
ZT.setFormData("sentiment", sentiment);
ZT.setFormData("escalate_reason", escalate_reason);
ZT.setFormData("confidence_score", confidence_score);
ZT.setFormData("ai_exception_reason", ai_exception_reason);
ZT.setFormData("email_analysis_route", email_analysis_route);
""", 600, 1540)
N["94"]["continuation_node_id"] = "95"

# ---- 95: router ----
N["95"] = clone(SCORING, 95, "Scoring", "Remittance route", "", 600, 1660)
N["95"]["buttons"] = {
    "0": btn('email_analysis_route == "escalation"', 72, 1, 'email_analysis_route == "escalation"'),
    "1": btn('email_analysis_route == "in_scope"', 96, 2, 'email_analysis_route == "in_scope"'),
    "2": btn("", 73, 3)}
N["95"]["continuation_node_id"] = "73"

# ---- 96: choose pushback ----
N["96"] = clone(CONTENT, 96, "Content", "Remittance request - choose the response",
    "<p><strong>Customer request</strong></p><p>${transforms.networks_customer_email_html}</p><p>Choose the response for this request:</p>", 600, 1780)
N["96"]["buttons"] = {"0": btn("General pushback response", 112, 1, data="General pushback response"),
                      "1": btn("Service department pushback response", 113, 2, data="Service department pushback response")}

# 94 also stages the escaped customer email for 96 (Case.Description is plain text)
N["94"]["content"] = N["94"]["content"].replace("// --- outputs ----------------------------------------------------------------",
"""// Case.Description is the inbound email as plain text: escape it and keep its line breaks.
let networks_customer_email_html = String(actions.sfdc_int__case_email_ai.records[0].Description || "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/\\r?\\n/g, "<br>");

// --- outputs ----------------------------------------------------------------
ZT.setTransformData("networks_customer_email_html", networks_customer_email_html);""")

# ---- 112 / 113: which pushback ----
for nid, kind, nxt, title in [(112, "general", 97, "Pushback: general"), (113, "service_department", 98, "Pushback: service department")]:
    N[str(nid)] = clone(SCRIPT, nid, "Script", title, f'ZT.setFormData("networks_pushback_type", "{kind}");\nZT.setFormData("networks_date_error", "");\n', 450 if nid == 112 else 750, 1900)
    N[str(nid)]["continuation_node_id"] = str(nxt)

REMIT = "FUEL Remittance\nSMR Remittance"
DATE_RE = "^(0[1-9]|[12][0-9]|3[01])/(0[1-9]|1[0-2])/[0-9]{4}$"
N["97"] = clone(CONTENT, 97, "Content", "General pushback - details", "<p>${transforms.networks_customer_email_html}</p>", 450, 2020)
N["97"]["formfields"] = {"0": field(1, "text", "remittance_sent_date", "When was the remittance sent to the Merchant? (DD/MM/YYYY)", regex=""),
                         "1": field(2, "select", "remittance_type", "Is the request for a SMR or Fuel Remittance?", options=REMIT)}
N["97"]["buttons"] = {"0": btn("Continue", 117, 1)}
N["97"]["content"] = "<p>${transforms.networks_customer_email_html}</p><p><strong>${networks_date_error}</strong></p>"

# ---- 117 / 116: the date must be DD/MM/YYYY (the native field regex is not enforced live) ----
N["117"] = clone(SCRIPT, 117, "Script", "Check remittance date", """// --- inputs -----------------------------------------------------------------
let remittance_sent_date = ZT.getVariableValue("remittance_sent_date", "").trim();

// --- transform: DD/MM/YYYY, a real calendar day ----------------------------------
// Corpay's template asks for the date in this format (Phase 1 Remittance doc).
let parts = remittance_sent_date.match(/^(\\d{2})\\/(\\d{2})\\/(\\d{4})$/);
const daysByMonth = [31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
let year = parts ? Number(parts[3]) : 0;
let leapYear = (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
let month = parts ? Number(parts[2]) : 0;
let daysInMonth = month === 2 && !leapYear ? 28 : (daysByMonth[month - 1] || 0);
let remittance_date_valid = parts !== null && month >= 1 && month <= 12
  && Number(parts[1]) >= 1 && Number(parts[1]) <= daysInMonth;

// --- outputs ----------------------------------------------------------------
ZT.setFormData("remittance_sent_date", remittance_sent_date);
ZT.setFormData("remittance_date_valid", remittance_date_valid);
ZT.setFormData("networks_date_error", remittance_date_valid ? "" : "Enter the date as DD/MM/YYYY, for example 02/10/2026.");
""", 450, 2080)
N["117"]["continuation_node_id"] = "116"
N["116"] = clone(SCORING, 116, "Scoring", "Remittance date valid?", "", 450, 2110)
N["116"]["buttons"] = {"0": btn("remittance_date_valid == true", 110, 1, "remittance_date_valid == true"),
                       "1": btn("", 97, 2)}
N["116"]["continuation_node_id"] = "97"
N["98"] = clone(CONTENT, 98, "Content", "Service department pushback - details", "<p>${transforms.networks_customer_email_html}</p>", 750, 2020)
N["98"]["formfields"] = {"0": field(1, "text", "invoice_amount", "What is the invoice amount that the request is related to?"),
                         "1": field(2, "select", "remittance_type", "Is the request for a SMR or Fuel Remittance?", options=REMIT)}
N["98"]["buttons"] = {"0": btn("Continue", 110, 1)}

# ---- 110: build reply + dashboard ----
N["110"] = clone(SCRIPT, 110, "Script", "Build remittance reply and dashboard", r"""// --- inputs -----------------------------------------------------------------
let sfCase = actions.sfdc_int__case_email_ai.records[0];
let networks_pushback_type = ZT.getVariableValue("networks_pushback_type", "general");
let remittance_sent_date = ZT.getVariableValue("remittance_sent_date", "");
let invoice_amount = ZT.getVariableValue("invoice_amount", "");
let remittance_type = ZT.getVariableValue("remittance_type", "");
let sf_CaseNumber = ZT.getVariableValue("sf_CaseNumber", "");
let networks_customer_email_html = transforms.networks_customer_email_html;

const escapeHtml = value => String(value == null ? "" : value)
  .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
  .replace(/"/g, "&quot;").replace(/'/g, "&#39;");

// --- approved copy: "Phase 1 - Remittance auto email pushback" (Gemma Danks, 16 Oct) ---
// The template's [sender name] stays out: the case read carries no sender name (CO 10 schema).
const replyByType = {
  general: [
    "<p>Hello,</p>",
    "<p>Thank you for your email.</p>",
    "<p>We sent you your remittance via email on <strong>" + escapeHtml(remittance_sent_date) + "</strong>. Please make sure that you have also checked your spam/junk folders.</p>",
    "<p>If you can confirm that you have not received this, please send us the amount received and your Merchant Number.</p>",
    "<p>Kind regards,<br>Allstar Networks Support</p>"
  ],
  service_department: [
    "<p>Hello,</p>",
    "<p>Thank you for your email. Please can you contact your service department and request that they upload the invoice relating to " + escapeHtml(invoice_amount) + " to the 1Link platform.</p>",
    "<p>Once this has been done, your payment can be processed.</p>",
    "<p>Kind regards,<br>Allstar Networks Support</p>"
  ]
};
const labelByType = { general: "General pushback response", service_department: "Service department pushback response" };
let email_response = replyByType[networks_pushback_type].join("");

// --- Salesforce Topic / Sub Topic (Networks AI tree setup) -----------------------
const topic = "Remittance Breakdown";
const subtopics = ["FUEL Remittance", "SMR Remittance"];

// --- dashboard ----------------------------------------------------------------
const row = (label, value) => `<div class="case-review-row"><div class="case-review-row-label">${escapeHtml(label)}</div><div class="case-review-row-value">${value === "" ? "&mdash;" : escapeHtml(value)}</div></div>`;
let case_review_html = `
<div class="case-review-shell"><div class="case-review-panel">
  <div class="case-review-hero"><div class="case-review-hero-top"><div class="case-review-hero-copy">
    <div class="case-review-eyebrow">Case Review</div>
    <h2 class="case-review-main-title">Email Response Summary</h2>
    <div class="case-review-subtitle">Case <strong>${escapeHtml(sf_CaseNumber)}</strong> <span class="case-review-subtitle-separator">&middot;</span> ${escapeHtml(labelByType[networks_pushback_type])}</div>
  </div></div></div>
  <div class="case-review-body"><div class="case-review-grid">
    <div class="case-review-col case-review-col-left"><div class="case-review-card">
      <h3 class="case-review-card-title">Case Details</h3>
      ${row("Case Number", sf_CaseNumber)}
      ${row("Response", labelByType[networks_pushback_type])}
      ${row("Topic", topic)}
      ${row("Sub Topic", remittance_type)}
      ${row("Requester Email", sfCase.SuppliedEmail || "")}
    </div></div>
    <div class="case-review-col case-review-col-right">
      <div class="case-review-card"><h3 class="case-review-card-title">Original Customer Email</h3><div class="case-review-html-card-body">${networks_customer_email_html || "&mdash;"}</div></div>
      <div class="case-review-card case-review-response-card"><h3 class="case-review-card-title">Email Response</h3><div class="case-review-html-card-body">${email_response}</div></div>
    </div>
  </div></div>
</div></div>`;

// --- manual-changes form (screen 115): Topic fixed, Sub Topic FUEL / SMR, editable body ---
const options = (values, selected) => values.map(v => `<option value="${escapeHtml(v)}" data-topic="${escapeHtml(topic)}"${v === selected ? ' selected="selected"' : ""}>${escapeHtml(v)}</option>`).join("");
let request_form_html = `
<div class="zt-form-card">
  <div class="zt-form-header"><h2 class="zt-form-title">Original Customer Email</h2><div class="zt-form-subtitle case-review-html-card-body">${networks_customer_email_html || "&mdash;"}</div></div>
  <div class="zt-form-header"><h2 class="zt-form-title">Request Details</h2><p class="zt-form-subtitle">Complete the fields below.</p></div>
  <div class="zt-form-grid">
    <div class="zt-form-field"><label for="sf_Topic__c" class="zt-form-label">Topic <span class="zt-required">*</span></label>
      <select id="sf_Topic__c" name="sf_Topic__c" data-name="sf_Topic__c" class="zt-data zt-form-control" required><option value="${topic}" selected="selected">${topic}</option></select></div>
    <div class="zt-form-field"><label for="sf_Sub_Topic__c" class="zt-form-label">Subtopic <span class="zt-required">*</span></label>
      <select id="sf_Sub_Topic__c" name="sf_Sub_Topic__c" data-name="sf_Sub_Topic__c" class="zt-data zt-form-control" required><option value="" data-topic="">Select Subtopic</option>${options(subtopics, remittance_type)}</select></div>
  </div>
  <div class="zt-form-field zt-form-field-full"><label class="zt-form-label">HTML Body</label>
    <div id="htmlBodyEditor" class="zt-rich-editor" contenteditable="true">${email_response}</div>
    <textarea id="HtmlBody" name="HtmlBody" data-name="HtmlBody" class="zt-data" style="display:none;">${escapeHtml(email_response)}</textarea>
    <div class="zt-form-help">Format text visually (bold, line breaks, etc.)</div></div>
</div>`;

// --- outputs ----------------------------------------------------------------
const compact = html => html.replace(/\s*\n\s*/g, " ");
ZT.setFormData("HtmlBody", email_response);
ZT.setFormData("sf_Topic__c", topic);
ZT.setFormData("sf_Sub_Topic__c", remittance_type);
ZT.setFormData("has_multiple_intents", "false");
ZT.setFormData("case_review_html", compact(case_review_html));
ZT.setTransformData("request_form_html", compact(request_form_html));
ZT.setFormData("ai_feedback", "");
ZT.setFormData("ai_feedback_comments", "");
ZT.setFormData("ai_feedback_submitted", "No");
""", 600, 2140)
N["110"]["continuation_node_id"] = "114"

# ---- 114: dashboard (same fields + feedback as FAST 54) ----
d = copy.deepcopy(FAST["54"])
d.update({"project_node_id": "114", "page_title": "Case review dashboard - Networks", "node_name": "Case review dashboard - Networks",
          "x": "600", "y": "2260", "display_order": "114", "is_root": "0", "continuation_node_id": "0"})
d["buttons"] = {"0": btn("Yes - send email response", 71, 1, data="Sent AI suggested email"),
                "1": btn("No - make manual changes", 115, 2, data="Made manual changes"),
                "2": btn("Submit feedback", 114, 3)}
N["114"] = d

# ---- 115: manual changes ----
m = copy.deepcopy(FAST["33"])
m.update({"project_node_id": "115", "page_title": "Make manual changes", "node_name": "Make manual changes",
          "x": "800", "y": "2380", "display_order": "115", "is_root": "0", "continuation_node_id": "0"})
m["buttons"] = {"0": btn("Send email and update fields", 71, 1)}
N["115"] = m

# ---- holding screen 90 no longer reached: remove ----
del N["90"]

# ---- claude.md ----
N["48"]["content"] = """<pre>claude.md - Networks branch (INT). Root 3. Entered from master node 82 when master node 8 maps
Last_Owner_Queue_Name__c "Networks_General" (queue id 00G4L000000efCT) to "networks".
3-7 eligibility (node 6 = FAST rules + networksBypassAccounts placeholder).
4 / 9 carry a "Merchant Request" button (Networks only) -> 92 sets networks_merchant_bypass + Case Origin -> 93,
skipping the account-linked / eligibility rules. Eligible accounts: 7 -> 91.
91 Case Origin "Zingtree AI" -> 93 AI Action automate_networks_email_intent_int -> 94 grade -> 95 router:
  escalation -> 72 (master 27/28), remittance_copy_request -> 96, anything else -> 73 (master 29).
96 shows the email + two buttons -> 112 / 113 set networks_pushback_type -> 97 (date + FUEL/SMR; 117/116 send a non-DD/MM/YYYY date back to 97)
or 98 (invoice amount + FUEL/SMR) -> 110 builds the approved reply (verbatim, Phase 1 Remittance doc),
Topic "Remittance Breakdown", Sub Topic = remittance_type, dashboard + request_form_html -> 114 dashboard
(feedback thumbs) -> 71 send, or 115 manual changes -> 71. No generation AI Action: the two replies are fixed copy.
Hand-back 70-73 -> 79 -> master 100.

Changelog
- 2026-10-12 scaffold (master split).
- 2026-10-16 remittance MVP: nodes 91-98, 110, 112-117; 90 removed; Merchant Request on 4 / 9; 7 -> 91.
  Source: Gemma Danks "Daily AI standup - Fri 16th Oct" + "Networks AI tree setup" + "Phase 1 - Remittance auto email pushback".</pre>"""

json.dump(net, open(NET_OUT, "w"), indent=1, ensure_ascii=False)

# ---- master node 8: route Networks_General ----
M8 = master["nodes"]["8"]
old = '  Allstar_Chargepass: "homecharge"\n  // Networks: add its Last_Owner_Queue_Name__c value here as "networks" to switch the branch on.\n'
assert old in M8["content"], "node 8 anchor"
M8["content"] = M8["content"].replace(old, '  Allstar_Chargepass: "homecharge",\n  Networks_General: "networks"   // queue id 00G4L000000efCT (Networks AI tree setup, 16 Oct)\n')
mc = master["nodes"]["48"]
mc["content"] = mc["content"].replace("</pre>", "\n2026-10-16: node 8 routes Networks_General (queue id 00G4L000000efCT) to the Networks branch (82). Networks sender address still blank: Corpay to confirm.</pre>")
json.dump(master, open(MASTER_OUT, "w"), indent=1, ensure_ascii=False)
print("ok", len(N), "nodes; ai id", NETWORKS_AI_ID)
