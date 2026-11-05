"""Build API - Nearshore Small Balance Open Card v1 from the 10/20 export.
Usage: python3 build_small_balance_api.py <export.json> <out.json>
Keeps every manual decision point, replaces data-entry and routing with the BizPay GET (CO 1299),
and replaces the per-resolution payment-note / initiate-cancel screens with one prefilled POST (CO 1300)."""
import json, sys, copy

src, out = sys.argv[1], sys.argv[2]
t = json.load(open(src))
ORG = t["org_id"]
nodes = t["nodes"]
POST_CO = "1300"

REASONS = [
    "Vendor does not accept card payments", "Vendor does not accept one time use card payments",
    "Account/client/invoice not eligible for card payments", "Discounts not eligible for card payments",
    "Card expired", "Cancel/reissue per client request", "Fee amount exceeds 1%",
    "Vendor charges % fee for card payments", "Unable to verify account information", "Must log in to portal",
    "Payment exceeds maximum amount eligible for card payments",
    "Payment exceeds maximum number of transactions allowed", "Unable to reach vendor",
    "Unable to short pay/over pay invoices via card", "Unable to transfer credits to separate accounts",
    "Vendor does not accept third party card payments", "Vendor experiencing system issues",
    "Vendor refusing card payment over a recorded line", "Vendor does not accept card payments over the phone",
    "Vendor requires PHI for card payments", "Vendor processing card outside of the US", "Unable to pay via PayPal",
    "Vendor unable to apply credits over the phone", "Account on auto pay", "Zero balance on account/invoice",
    "Paid account/invoice balance", "Invoice paid previously", "Cancel/refund per client request",
    "Credit balance on account/invoice", "Vendor returned payment", "Vendor credited partial payment back to card",
    "Payment submitted to incorrect vendor", "Payment submitted in error", "Discount applied",
    "No response from client", "Fee not needed", "Invalid account information", "Vendor refused payment",
    "Vendor requires invoice number(s)", "Does Not Meet PFY Threshold",
]

# ---------- node helpers (shapes copied from this export) ----------
content_base = copy.deepcopy(nodes["20"])
for k in ("formfields", "buttons", "data_connected_objects"):
    content_base[k] = {}
content_base.update({"is_root": "0", "continuation_node_id": "0", "content": "", "advanced_logic_node": "0",
                     "notes": "", "node_name": "", "page_title": ""})

def node(nid, typ, title, name, **kw):
    n = copy.deepcopy(content_base)
    n.update({"type": typ, "project_node_id": str(nid), "page_title": title, "node_name": name,
              "display_order": str(nid)})
    n.update(kw)
    return n

def button(text, link, rank, expr="", op=""):
    return {"button_text": text, "hover_text": "", "button_link": str(link), "rank": str(rank), "button_data": "",
            "logic_expression": expr, "wizard_skip": "0", "value": "0", "op": op, "updated": "0"}

def router(nid, title, name, var, routes, default):
    btns = {str(i): button(f'{var} == "{v}"', link, i + 1, f'{var} == "{v}"') for i, (v, link) in enumerate(routes)}
    btns[str(len(routes))] = button("", default, len(routes) + 1, "", "def")
    return node(nid, "Scoring", title, name, advanced_logic_node="1", continuation_node_id=str(default), buttons=btns)

def field(rank, typ, name, label, required=True, options=""):
    return {"type": typ, "name": name, "label": label, "label_type": "L", "options": options, "hidden_value": "",
            "custom_regex": "", "inline": "0", "required": "1" if required else "0", "score_var": "",
            "checkbox_score": "0" if typ == "checkbox" else "1", "scores": "", "rank": str(rank), "config": ""}

# ---------- scripts ----------
stage = r'''let response = actions.bizpay__get_payment_by_id;
let code = response._zt_meta.response.code;
let found = code >= 200 && code < 300;

// BizPay answered: stage the payment once, under the names the agent screens already use
if (found) {
  let client = String(response.client_name).toLowerCase();
  let client_exception = response.client_id === 1398 || client.includes("ipay") ? "ipay"
    : response.client_id === 4016 || response.client_id === 12113 || client.includes("civitas") ? "civitas" : "other";
  ZT.setFormData("client_exception", client_exception);
  ZT.setFormData("remaining_balance", String(response.remaining_balance));
  ZT.setFormData("funding", String(response.funding_amount));
  ZT.setFormData("manual_load_value", String(response.manual_value_load_amount));
  ZT.setFormData("fee_amount", String(response.service_fee));
  ZT.setFormData("payment_amount", String(response.payment_amount));
  ZT.setFormData("cancel_card_request_exists", response.cancel_card_request_exists === true);
  ZT.setFormData("cancel_card_request_approved", response.cancel_card_request_approved === true);
  ZT.setFormData("card_status_date", response.card_status_date);
  let approved_date = response.cancel_card_request_approved_date === null ? "" : String(response.cancel_card_request_approved_date);
  ZT.setFormData("cancel_card_request_approved_date", approved_date);
  ZT.setTransformData("approved_date_html", approved_date === ""
    ? "<p>BizPay did not return an approved date. Check <strong>Activity History</strong> on the Payment Details page.</p>"
    : `<p>BizPay approved the Cancel Card request on <strong>${approved_date}</strong>. Compare it with the <strong>Sheet Created Date</strong> on the Followup spreadsheet.</p>`);
}

// No payment, a balance to verify, or nothing left on the card
let entry_route = !found ? "not_found" : response.remaining_balance > 0 ? "verify_balance" : "no_remainder";
ZT.setFormData("entry_route", entry_route);

// Error detail for the not-found screen (the engine hands a JSON error body over parsed)
let rawBody = found ? "" : (response._zt_meta.response.body || "");
let errorFields = rawBody === String(rawBody) ? (rawBody.startsWith("{") ? JSON.parse(rawBody) : { message: rawBody }) : rawBody;
let html_escape = s => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;");
let money = v => "$" + Number(v).toFixed(2);
let row = (label, value, highlight) => `<tr${highlight ? ' style="background:#f3f6fb;"' : ""}><th style="text-align:left;font-weight:600;color:#444;padding:8px 24px 8px 10px;border:none;border-bottom:1px solid #e3e3e3;white-space:nowrap;width:40%;">${label}</th><td style="text-align:left;padding:8px 10px;border:none;border-bottom:1px solid #e3e3e3;${highlight ? "font-weight:700;" : ""}">${value}</td></tr>`;
let request_text = !response.cancel_card_request_exists ? "None"
  : response.cancel_card_request_approved ? "Initiated and approved" + (response.cancel_card_request_approved_date === null ? "" : " (" + html_escape(response.cancel_card_request_approved_date) + ")")
  : "Initiated, not approved";
let payment_html = found
  ? `<table border="0" style="border:none;border-collapse:collapse;width:100%;max-width:560px;margin:12px 0 20px 0;font-size:15px;">`
    + row("Client", html_escape(response.client_name))
    + row("Payment amount", money(response.payment_amount))
    + row("Funding", money(response.funding_amount))
    + row("Manual value load", money(response.manual_value_load_amount))
    + row("Service fee", money(response.service_fee))
    + row("Remaining balance", money(response.remaining_balance), true)
    + row("Card status", `${html_escape(response.card_status)} <span style="color:#777;">(${html_escape(response.card_status_date)})</span>`)
    + row("Cancel card request", request_text)
    + `</table>`
  : `<p>BizPay returned HTTP ${code}: ${html_escape(errorFields.message || "")} ${html_escape(errorFields.error || "")}</p>`;
ZT.setTransformData("payment_html", payment_html.replace(/\n/g, " "));'''

route = r'''// Decide what happens to the remaining balance, in the order the Small Balance process checks it
let cents = v => Math.round(Number(v) * 100);
let remaining = cents(ZT.getVariableValue("remaining_balance", "0"));
let funding = cents(ZT.getVariableValue("funding", "0"));
let manual = cents(ZT.getVariableValue("manual_load_value", "0"));
let fee = cents(ZT.getVariableValue("fee_amount", "0"));
let client = ZT.getVariableValue("client_exception", "other");
let requested = String(ZT.getVariableValue("cancel_card_request_exists", "false")) === "true";
let approved = String(ZT.getVariableValue("cancel_card_request_approved", "false")) === "true";

let resolution_route =
  requested && approved ? "approved_request"
  : requested ? "request_pending"
  : client === "ipay" && (funding === remaining || funding + manual === remaining) ? "ipay_rpps_check"
  : funding === remaining || funding + manual === remaining ? "reissue_check"
  : fee === remaining || manual === remaining || remaining - manual === fee || fee + manual === remaining ? "cancel_fee"
  : client === "civitas" || client === "ipay" ? "partial_refund"
  : remaining > 100 ? "client_notes_check"
  : "cancel_fee_under_1";
ZT.setFormData("resolution_route", resolution_route);'''

build = r'''// The agent's answers settle the two routes that need a BizPay screen check
let resolution_route = ZT.getVariableValue("resolution_route", "");
let resolution = resolution_route === "ipay_rpps_check"
  ? (ZT.getVariableValue("rpps_available", "") === "Yes" ? "reissue_rpps" : "full_refund")
  : resolution_route === "client_notes_check"
  ? (ZT.getVariableValue("client_restricts_partial", "") === "Yes" ? "partial_reissue_check" : "partial_refund")
  : resolution_route;

let remaining = ZT.getVariableValue("remaining_balance", "0");
let fee = ZT.getVariableValue("fee_amount", "0");
let money = v => Number(v).toFixed(2);
let cents = v => Math.round(Number(v) * 100);
let manual = ZT.getVariableValue("manual_load_value", "0");
let payment_amount = ZT.getVariableValue("payment_amount", remaining);
// Unprocessed-card cancels: the manual value load is a fee too, and the note shows only the client's payment
let full_fee = money((cents(fee) + cents(manual)) / 100);

// Note date from the Timestamp webhook on node 1; agent from the Agent Portal login (the part before @), else the agent's name
let today = ZT.getVariableValue("today", "MM/DD/YY");
let agent_login = String(ZT.getVariableValue("agent", ""));
let agent_label = agent_login !== "" ? agent_login.split("@")[0] : ZT.getVariableValue("agent_name", "[AGENT NAME]");

// One entry per Small Balance outcome: the API resolution, the BizPay cancel reason, amount, fee and the payment note
let catalog = {
  reissue_check: { label: "Cancel and reissue check", api: "reissue_check", reason: "Unable to reach vendor", fee: full_fee,
    why: "The remainder shows this card was never processed. Cancel it and reissue as a check.",
    note: `${today} Pmt never processed, CANCEL/ISSUE CHECK $${money(payment_amount)} - ${agent_label}` },
  reissue_rpps: { label: "Cancel and reissue RPPS", api: "reissue_rpps", reason: "Unable to reach vendor", fee: full_fee,
    why: "The card was never processed and the client is iPay, so it is reissued via RPPS.",
    note: `${today} Pmt never processed, CANCEL/ISSUE RPPS $${money(payment_amount)} - ${agent_label}` },
  full_refund: { label: "Cancel and full refund", api: "full_refund", reason: "Unable to reach vendor", fee: full_fee,
    why: "The card was never processed and RPPS is not available, so the funds are refunded to the client.",
    note: `${today} Pmt never processed, CANCEL/REFUND $${money(payment_amount)} - ${agent_label}` },
  cancel_fee: { label: "Cancel fee", api: "cancel_fee", reason: "Fee not needed", fee: remaining,
    why: "The remainder matches the fee or manual load Corpay added to the card. Cancel the fee to recoup it.",
    note: `${today} fee not needed CANCEL FEE $${money(remaining)} - ${agent_label}` },
  cancel_fee_under_1: { label: "Cancel fee (under $1)", api: "cancel_fee_under_1", reason: "Fee not needed", fee: remaining,
    why: "The remainder is $1 or less, most likely left over from fees.",
    note: `${today} vendor processed partial payment, $1 or less remaining, CANCEL FEE $${money(remaining)} - ${agent_label}` },
  partial_refund: { label: "Cancel and partial refund", api: "partial_refund", reason: "Paid account/invoice balance", fee: "0",
    why: "A significant balance remains that most likely came from client funding. Refund it to the client.",
    note: `${today} vendor processed partial payment, CANCEL/PARTIAL REFUND $${money(remaining)} - ${agent_label}` },
  partial_reissue_check: { label: "Cancel and reissue partial check", api: "partial_reissue", reason: "Cancel/reissue per client request", fee: "0",
    why: "A significant balance remains from client funding, but the client does not accept refunds. Reissue it as a partial check.",
    note: `${today} Vendor processed partial payment, CANCEL/ISSUE PARTIAL CHECK $${money(remaining)} - ${agent_label}` }
};
let chosen = catalog[resolution] || catalog.cancel_fee_under_1;

// Staged for the POST Connected Object body and prefilled on the review screen
ZT.setFormData("resolution", chosen.api);
ZT.setFormData("cancel_card_reason", chosen.reason);
ZT.setFormData("amount", String(remaining));
ZT.setFormData("fee", String(chosen.fee));
ZT.setFormData("payment_note", chosen.note);
ZT.setFormData("agent_email", "system@zingtree.com");
ZT.setTransformData("cancel_summary_html", `<p><strong>${chosen.label}.</strong> ${chosen.why}</p>`);'''

grade_post = r'''let response = actions.bizpay__post_payment_action;
let code = response._zt_meta.response.code;
let cancel_submitted = code >= 200 && code < 300 && response.success === true;
ZT.setFormData("cancel_submitted", cancel_submitted);

let html_escape = s => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;");
let rawBody = cancel_submitted ? "" : (response._zt_meta.response.body || "");
let errorFields = rawBody === String(rawBody) ? (rawBody.startsWith("{") ? JSON.parse(rawBody) : { message: rawBody }) : rawBody;
let post_html = cancel_submitted
  ? `<p><strong>Cancel Card submitted to BizPay.</strong> ${html_escape(response.message)} (request ${response.request_id}).</p>`
  : `<p><strong>BizPay did not accept the Cancel Card request</strong> (HTTP ${code}): ${html_escape(errorFields.message || "")}. ${html_escape(errorFields.error || "")}</p><p>An amount above the payment amount, a fee that does not match BizPay, or an email that is not a BizPay user is rejected. Correct the details and resend, or initiate the Cancel Card in BizPay directly.</p>`;
ZT.setTransformData("post_result_html", post_html.replace(/\n/g, " "));'''

# ---------- remove the screens the API and the POST replace ----------
for k in ["7", "8", "9", "10", "11", "12", "13", "14", "15", "16", "17", "32", "33", "37", "38", "39", "40"]:
    nodes.pop(k)

# ---------- start, GET, stage, entry router ----------
nodes["1"]["buttons"]["0"]["button_link"] = "42"
# Zingtree Timestamp webhook (app 381): today's date for the payment notes, as MM/DD/YY in Central time
nodes["1"]["app_messages"] = {"0": {"id": "", "project_id": "563559070", "project_node_id": "1", "app": "", "app_id": "381",
                                    "message": "&tz=America/Chicago&format=m/d/y&return=today"}}
nodes["42"].update({"page_title": "Get BizPay payment", "node_name": "Calls GET /payments/zingtree/{payment_id} (CO 1299)",
                    "continuation_node_id": "43"})
nodes["43"].update({"page_title": "Stage BizPay payment", "node_name": "Grades the GET and stages the payment fields",
                    "content": stage, "continuation_node_id": "44"})
nodes["44"] = router(44, "Route: payment found?", "Routes on entry_route", "entry_route",
                     [("not_found", 2), ("verify_balance", 29)], 6)
nodes["2"] = node(2, "Content", "Payment not found", "BizPay has no payment for this ID",
                  content="<p>BizPay could not find payment <strong>#payment_id#</strong>.</p>${transforms.payment_html}<p>Check the Payment ID on the Nearshore Small Balance Followup sheet and enter it again.</p>",
                  buttons={"0": button("Re-enter Payment ID", 1, 1)})

# ---------- verify balance (manual) shows the BizPay data, then routing ----------
nodes["29"]["content"] = "<p style=\"margin:0 0 4px 0;\"><strong>BizPay shows this payment:</strong></p>${transforms.payment_html}<p style=\"margin:0 0 8px 0;line-height:1.5;\">Compare the remaining balance, <strong>$#remaining_balance#</strong>, to the <strong>Amount on Card</strong> field on the Nearshore Small Balance Followup sheet.</p>"
for b in nodes["29"]["buttons"].values():
    if b["button_link"] == "45":
        b["button_link"] = "3"
nodes["34"]["buttons"]["0"]["button_link"] = "3"   # after Galileo/Comdata research the agent's balance is routed the same way
nodes["3"] = node(3, "Script", "Route the remaining balance", "Decides the Small Balance outcome from the BizPay data",
                  content=route, continuation_node_id="45")
nodes["45"] = router(45, "Route: Small Balance outcome", "Routes on resolution_route", "resolution_route",
                     [("approved_request", 28), ("request_pending", 20), ("ipay_rpps_check", 31), ("client_notes_check", 41)], 4)

nodes["28"]["content"] = "${transforms.approved_date_html}" + nodes["28"]["content"].replace("<p>Scroll down", "<p>If no date shows above, scroll down")
nodes["6"]["content"] = "<p>BizPay shows no remaining balance on this card. The card status date is <strong>#card_status_date#</strong>.</p><p>Is that date 0-7 days before today?</p>" + nodes["6"]["content"]

# ---------- the two BizPay screen checks become a question each, then the cancel request is built ----------
nodes["31"]["formfields"] = {"0": field(1, "radio", "rpps_available", "Is Reissue RPPS listed in the Actions menu?", True, "Yes\nNo")}
nodes["31"]["buttons"] = {"0": button("Continue", 4, 1)}
nodes["41"]["formfields"] = {"0": field(1, "radio", "client_restricts_partial", "Do the Client Notes restrict partial refunds or require approval?", True, "Yes\nNo")}
nodes["41"]["buttons"] = {"0": button("Continue", 4, 1)}
nodes["4"] = node(4, "Script", "Build the Cancel Card request", "Picks the resolution, cancel reason, amount, fee and payment note",
                  content=build, continuation_node_id="5")

# ---------- review and POST ----------
nodes["5"] = node(5, "Content", "Review and submit Cancel Card", "Prefilled Cancel Card request the agent confirms",
                  content="${transforms.cancel_summary_html}<p>Check the details below. They are prefilled from BizPay and the Small Balance rules. Check the payment note, then submit.</p>",
                  formfields={
                      "0": field(1, "select", "resolution", "Recommended action", True,
                                 "reissue_check\ncancel_fee\ncancel_fee_under_1\npartial_refund\npartial_reissue\nfull_refund\nreissue_rpps\nreissue_check_cancel_fee"),
                      "1": field(2, "select", "cancel_card_reason", "Cancel reason", True, "\n".join(REASONS)),
                      "2": field(3, "number", "amount", "Amount to cancel"),
                      "3": field(4, "number", "fee", "Fee"),
                      "4": field(5, "text", "payment_note", "Payment note"),
                      "5": field(6, "email", "agent_email", "BizPay user (Zingtree system account)"),
                  },
                  buttons={"0": button("Submit Cancel Card to BizPay", 49, 1)})
data_node = copy.deepcopy(nodes["42"])
data_node.update({"project_node_id": "35", "display_order": "35", "page_title": "Post Cancel Card to BizPay",
                  "node_name": "Calls POST /payments/zingtree/{payment_id}/actions (CO 1300)", "continuation_node_id": "36",
                  "data_connected_objects": {"0": {"org_id": ORG, "data_connected_object_id": POST_CO, "data_connected_object_type": "http"}}})
nodes["35"] = data_node
# One Cancel Card per payment: Back to node 5 after an accepted POST must not send a second request
nodes["49"] = node(49, "Scoring", "Route: already submitted?", "Blocks a second Cancel Card after BizPay accepted one", advanced_logic_node="1",
                   continuation_node_id="35",
                   buttons={"0": button("cancel_submitted == true", 18, 1, "cancel_submitted == true"),
                            "1": button("", 35, 2, "", "def")})
nodes["36"] = node(36, "Script", "Grade the Cancel Card", "Checks BizPay accepted the Cancel Card", content=grade_post,
                   continuation_node_id="46")
nodes["46"] = node(46, "Scoring", "Route: Cancel Card accepted?", "Routes on cancel_submitted", advanced_logic_node="1",
                   continuation_node_id="47",
                   buttons={"0": button("cancel_submitted == true", 18, 1, "cancel_submitted == true"),
                            "1": button("", 47, 2, "", "def")})
nodes["47"] = node(47, "Content", "Cancel Card not accepted", "BizPay rejected the Cancel Card",
                   content="${transforms.post_result_html}",
                   buttons={"0": button("Edit and resend", 5, 1), "1": button("I initiated it in BizPay", 18, 2)})
nodes["18"]["content"] = "${transforms.post_result_html}" + nodes["18"]["content"]

# ---------- every node reads as a step ----------
for n in nodes.values():
    if not n.get("node_name"):
        n["node_name"] = n.get("page_title", "")

# ---------- tree memory ----------
claude_md = """<pre># claude.md - API - Nearshore Small Balance Open Card - org 604910

Purpose: Small Balance card workflow for Corpay PMG (BizPay) Payment Processors, driven by the BizPay API. The agent enters a Payment ID; the tree reads the payment, routes it, and stops only at checks the API cannot answer. The Cancel Card is submitted by API.

Node map
1 Start: payment_id -> 42
42 Get BizPay payment (Data, CO 1299 bizpay__get_payment_by_id) -> 43
43 Stage BizPay payment (Script) -> 44
44 Route on entry_route: not_found -> 2 (re-enter ID -> 1) | verify_balance -> 29 | else (no remainder) -> 6
29 Verify balance vs Followup sheet (manual): match -> 3 | no -> 30
6, 24, 25, 26, 27, 23 Zero-balance research in Galileo/Comdata (manual) -> positive balance -> 34 (agent enters balance) -> 3
3 Route the remaining balance (Script) -> 45
45 Route on resolution_route: approved_request -> 28 (BizPay approved date shown; agent compares with sheet date) | request_pending -> 20 | ipay_rpps_check -> 31 (manual) | client_notes_check -> 41 (manual) | else -> 4
31, 41 -> 4
4 Build the Cancel Card request (Script) -> 5
5 Review and submit Cancel Card (agent confirms prefilled fields) -> 49
49 Route: cancel_submitted == true -> 18 (no second POST after Back) | else -> 35
35 Post Cancel Card (Data, CO 1300 bizpay__post_payment_action) -> 36
36 Grade the Cancel Card (Script) -> 46
46 Route: cancel_submitted == true -> 18 (disposition) -> 19 | else -> 47 (edit and resend -> 5, or done in BizPay -> 18)
Escalations: 21, 22, 23, 27, 30. No action: 20.

Data dictionary (form data)
payment_id - node 1; merged into both CO URLs
client_exception (ipay | civitas | other), remaining_balance, funding, manual_load_value, fee_amount, cancel_card_request_exists, cancel_card_request_approved, cancel_card_request_approved_date (shown on 28, empty when null), card_status_date (shown on 6) - node 43, from the GET
entry_route - node 43; resolution_route - node 3
rpps_available - node 31; client_restricts_partial - node 41
resolution, cancel_card_reason, amount, fee, payment_note - node 4, editable on node 5; read by the CO 1300 body template
agent_email - node 4 sets system@zingtree.com (BizPay system user from Mayur, 10/22), editable on node 5; read by CO 1300
cancel_submitted - node 36; read by 46 and 49
transforms.payment_html, approved_date_html (43), cancel_summary_html (4), post_result_html (36)

External systems
Data source "BizPay Dev (Paymerang)", OAuth2 client credentials. Dev base https://develop.api.pega.dev.paymerang.com/
CO 1300 body: {"action":"cancel_card","resolution":"${resolution}","cancel_card_reason":"${cancel_card_reason}","amount":${amount},"fee":${fee},"payment_note":"${payment_note}","agent_email":"${agent_email}"} with header Content-Type: application/json

Gotchas
Amounts are compared in cents (floats).
Civitas client ids 4016 and 12113 are PROD ids (Jonathan 10/27); dev also matches on client name.
No Date in scripts: node 1 runs the Timestamp webhook (app 381) to set today (m/d/y, America/Chicago). Notes end with the Agent Portal login before @ (agent), else agent_name; outside the Agent Portal they fall back to MM/DD/YY and [AGENT NAME].
A double quote in payment_note breaks the POST body.
Routing follows Helena's Small Balance ZT Workflow Visio (10/20). Partial reissue check sends partial_reissue (added by Mayur 10/22), fee blank per Visio. Negative balance goes to Escalate: Negative Balance (27), confirmed by Jonathan 10/22 over the Visio's Manual Cancellation. fee for cancel_fee paths follows the tree (remaining balance) and BizPay may reject it if it expects service_fee.

Node 28 stays an agent choice: the Sheet Created Date lives only in the Followup spreadsheet, so the API date is shown but not compared.

Changelog
- API build from the 10/20 copy of tree 726245811: GET-driven routing, manual checks kept, single prefilled Cancel Card POST.\n- Reconciled with the 10/20 working session: spreadsheet checks and Galileo/Comdata research stay manual; approval date and system user pending from BizPay.\n- 10/22: partial_reissue resolution, cancel_card_request_approved_date shown on 28, agent_email defaults to system@zingtree.com.\n- 10/23: payment notes show amounts to 2 decimals; payment table on 29 restyled (padding, row lines, remaining balance highlighted) per Carrie 10/26.\n- 10/27 (Jonathan/SME): reissue check, RPPS and full refund send fee = service fee + manual value load and the note shows the payment amount; Civitas also on client 12113; notes auto-fill today's date and the agent; those three default the cancel reason to Unable to reach vendor (expired backlog cleared, Jonathan 10/27); node 28 points to Activity History only when BizPay returns no date.\n- 10/23: node 49 blocks a duplicate Cancel Card POST when the agent goes Back to 5 after BizPay accepted one (Jonathan's dev test, 36703751).\n- Aligned to Helena's Visio: iPay RPPS also when funding + manual load = remaining; partial check fee blank; card status date shown on the card-age check.</pre>"""
nodes["48"] = node(48, "Content", "claude.md", "Tree memory: purpose, node map, data dictionary", content=claude_md)

t["predefined_vars"] = {}
t["name"] = "API - Nearshore Small Balance Open Card"
json.dump(t, open(out, "w"), indent=2)
print(out, len(nodes), "nodes")
