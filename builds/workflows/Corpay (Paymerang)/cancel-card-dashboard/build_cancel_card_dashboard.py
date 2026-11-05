"""Build API - iPay Cancel Card Dashboard (draft) from Caroline's Cancel Card Dashboard Workflow Visio (10/27).
Usage: python3 build_cancel_card_dashboard.py <small-balance-export.json> <out.json>
Borrows the tree settings and node shapes from the Small Balance API tree (org 604910). Reads the payment
with the existing BizPay GET (CO 1299); the rest of the Visio's data points are agent answers until the
Cancel Card API returns them. One route script replaces the Visio's ~40 logic nodes."""
import json, sys, copy

src, out = sys.argv[1], sys.argv[2]
base = json.load(open(src))
ORG = base["org_id"]
GET_CO = "1299"

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
ACTIONS = ["Refund", "Reissue RPPS", "Fee Cancellation", "Partial Refund"]

# ---------- node helpers (shapes copied from the Small Balance export) ----------
content_base = copy.deepcopy(base["nodes"]["20"])
for k in ("formfields", "buttons", "data_connected_objects", "app_messages"):
    content_base[k] = {}
content_base.update({"is_root": "0", "continuation_node_id": "0", "content": "", "advanced_logic_node": "0",
                     "notes": "", "node_name": "", "page_title": "", "question": "", "score_var": ""})
data_base = copy.deepcopy(base["nodes"]["42"])

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

def field(rank, typ, name, label, required=True, options="", hidden_value=""):
    return {"type": typ, "name": name, "label": label, "label_type": "L", "options": options, "hidden_value": hidden_value,
            "custom_regex": "", "inline": "0", "required": "1" if required else "0", "score_var": "",
            "checkbox_score": "0" if typ == "checkbox" else "1", "scores": "", "rank": str(rank), "config": ""}

def fields(*items):
    return {str(i): f for i, f in enumerate(items)}

YES_NO = "Yes\nNo"

# ---------- scripts ----------
stage = r'''let response = actions.bizpay__get_payment_by_id;
let code = response._zt_meta.response.code;
let found = code >= 200 && code < 300;
ZT.setFormData("payment_found", found);

// Each payment starts with no answers from the previous one
ZT.setFormData("correct_vendor", "");
ZT.setFormData("rpps_available", "");
ZT.setFormData("reason_confirmed", "");

if (found) {
  ZT.setFormData("payment_amount", String(response.payment_amount));
  ZT.setFormData("service_fee", String(response.service_fee));
  ZT.setFormData("funding_amount", String(response.funding_amount));
  ZT.setFormData("mvl_amount", String(response.manual_value_load_amount));
  // The confirm-reason screen opens on the reason the request was made with
  ZT.setFormData("resubmit_reason", ZT.getVariableValue("requested_cancel_reason", ""));

  let row = (label, value) => `<tr><td style="padding:4px 16px 4px 0;border-bottom:1px solid #e5e7eb;">${label}</td><td style="padding:4px 0;border-bottom:1px solid #e5e7eb;"><strong>${value}</strong></td></tr>`;
  let payment_html = `<table style="border-collapse:collapse;margin:0 0 12px 0;">`
    + row("Client", response.client_name)
    + row("Payment amount", "$" + Number(response.payment_amount).toFixed(2))
    + row("Service fee", "$" + Number(response.service_fee).toFixed(2))
    + row("Funding amount", "$" + Number(response.funding_amount).toFixed(2))
    + row("Manual value load", "$" + Number(response.manual_value_load_amount).toFixed(2))
    + row("Card status", response.card_status + " (" + response.card_status_date + ")")
    + `</table>`;
  ZT.setTransformData("payment_html", payment_html);
}'''

route = r'''let cents = (value) => Math.round(Number(value) * 100);
let money = (amount) => "$" + (amount / 100).toFixed(2);
let answer = (name) => String(ZT.getVariableValue(name, ""));

let payment_amount = cents(ZT.getVariableValue("payment_amount", 0));
let service_fee = cents(ZT.getVariableValue("service_fee", 0));
let funding_amount = cents(ZT.getVariableValue("funding_amount", 0));
let mvl_amount = cents(ZT.getVariableValue("mvl_amount", 0));
let dashboard_fee = cents(ZT.getVariableValue("dashboard_fee", 0));
let requested_action = answer("requested_action");
let requested_cancel_reason = answer("requested_cancel_reason");
let resubmit_reason = answer("resubmit_reason");
let has_mvl = mvl_amount > 0;
let has_settled_credit = answer("has_settled_credit") === "Yes";
let settled_credit_is_most_recent = answer("settled_credit_is_most_recent") === "Yes";

// Total Funds Remaining: calculated from Comdata when it has transactions, otherwise Galileo's Avail. To Spend
let funds_remaining = answer("has_comdata") === "Yes"
  ? funding_amount + mvl_amount - cents(ZT.getVariableValue("pending_auth_total", 0))
    - cents(ZT.getVariableValue("posted_total", 0)) + cents(ZT.getVariableValue("credits_total", 0))
  : cents(ZT.getVariableValue("avail_to_spend", 0));
ZT.setFormData("funds_remaining", (funds_remaining / 100).toFixed(2));

// The fee on file is service fee + manual value load (Caroline 11/2): resubmits carry it, and an approve needs the dashboard fee to equal it
let fee_on_file = service_fee + mvl_amount;

let escalate_steps = "Do not take any further action on the payment. Escalate it to the <strong>Paymerang Support &gt; Cancel Card Escalations</strong> Teams channel.";
let outcome = { route: "outcome" };

if (answer("decline_auth") === "Yes") {
  outcome.decision = "hold";
  outcome.headline = "Authorization pending release";
  outcome.steps = "Do not approve, deny, or resubmit the payment at this time. Leave it in the queue.";
} else if (answer("has_payment_activity") === "Yes" && answer("correct_vendor") === "") {
  outcome.route = "check_vendor";
} else if (answer("has_payment_activity") === "Yes" && answer("correct_vendor") === "No") {
  outcome.decision = "escalate";
  outcome.headline = "Wrong vendor processed the payment";
  outcome.steps = escalate_steps;
} else if (funds_remaining < 0) {
  outcome.decision = "escalate";
  outcome.headline = "Negative funds remaining (" + money(funds_remaining) + ")";
  outcome.steps = escalate_steps;
} else if (funds_remaining === 0) {
  outcome.decision = "deny";
  outcome.headline = "Deny. Do NOT resubmit.";
  outcome.steps = "No funds remain on the card. Deny the request and do not resubmit it.";
} else {
  let full_funds = funds_remaining === funding_amount
    || (has_mvl && funds_remaining === funding_amount + mvl_amount)
    || (has_settled_credit && settled_credit_is_most_recent && funds_remaining === payment_amount);
  let fee_only = (has_mvl && funds_remaining === mvl_amount)
    || (!has_mvl && funds_remaining === service_fee)
    || (has_mvl && funds_remaining - service_fee === mvl_amount);

  if (full_funds) {
    // Which action the full balance should go back as: the request as made ("approve_check") or a corrected one
    let target = "";
    let rpps_available = answer("rpps_available");
    if (has_settled_credit) {
      target = requested_action === "Refund" ? "approve_check" : requested_action === "Reissue RPPS" ? "Refund" : "";
    } else if (rpps_available === "") {
      outcome.route = "rpps_check";
    } else if (rpps_available === "Yes") {
      target = requested_action === "Reissue RPPS" ? "approve_check" : requested_action === "Refund" ? "Reissue RPPS" : "";
    } else {
      target = requested_action === "Refund" ? "approve_check" : requested_action === "Reissue RPPS" ? "Refund" : "";
    }

    if (outcome.route === "rpps_check") {
      // asked first, routed on the next pass
    } else if (target === "") {
      outcome.decision = "not_mapped";
    } else if (answer("reason_confirmed") !== "Yes") {
      outcome.route = "confirm_reason";
      ZT.setFormData("reason_lane", target === "approve_check" ? requested_action : target);
    } else if (target !== "approve_check") {
      outcome.decision = "resubmit";
      outcome.resolution = target;
      outcome.fee = fee_on_file;
    } else if (resubmit_reason !== requested_cancel_reason || dashboard_fee !== fee_on_file) {
      outcome.decision = "resubmit";
      outcome.resolution = requested_action;
      outcome.fee = fee_on_file;
    } else {
      outcome.route = "approve";
      outcome.decision = "approve";
      outcome.headline = "Approve the request";
      outcome.steps = "The cancel reason and fee match. Click <strong>Approve</strong>.";
    }
  } else if (fee_only) {
    outcome.decision = "resubmit";
    outcome.resolution = "Fee Cancellation";
    // A Fee Cancellation cancels exactly what is left, so fee and amount are the same
    outcome.fee = funds_remaining;
    ZT.setFormData("resubmit_reason", "Fee not needed");
  } else if (answer("reason_confirmed") !== "Yes") {
    outcome.route = "confirm_reason";
    ZT.setFormData("reason_lane", "Partial Refund");
  } else {
    outcome.decision = "resubmit";
    outcome.resolution = "Partial Refund";
    outcome.fee = fee_on_file;
  }
}

if (outcome.decision === "resubmit") {
  outcome.headline = "Deny and resubmit as " + outcome.resolution;
  outcome.steps = "Deny the request, then resubmit it with these details:"
    + `<ul style="margin:6px 0 0 0;"><li>Action: <strong>${outcome.resolution}</strong></li>`
    + `<li>Cancel reason: <strong>${answer("resubmit_reason")}</strong></li>`
    + `<li>Fee: <strong>${money(outcome.fee)}</strong></li></ul>`;
}
if (outcome.decision === "not_mapped") {
  outcome.headline = "Not covered by the Cancel Card process";
  outcome.steps = escalate_steps;
}

ZT.setFormData("route", outcome.route);
ZT.setFormData("decision", outcome.decision || "");

if (outcome.route === "outcome" || outcome.route === "approve") {
  let row = (label, value) => `<tr><td style="padding:4px 16px 4px 0;border-bottom:1px solid #e5e7eb;">${label}</td><td style="padding:4px 0;border-bottom:1px solid #e5e7eb;"><strong>${value}</strong></td></tr>`;
  let outcome_html = `<p style="margin:0 0 6px 0;font-size:18px;"><strong>${outcome.headline}</strong></p>`
    + `<p style="margin:0 0 12px 0;line-height:1.5;">${outcome.steps}</p>`
    + `<table style="border-collapse:collapse;margin:0;">`
    + row("Total funds remaining", money(funds_remaining))
    + row("Funding amount", money(funding_amount))
    + row("Payment amount", money(payment_amount))
    + row("Service fee", money(service_fee))
    + row("Manual value load", money(mvl_amount))
    + row("Requested", requested_action + ", " + requested_cancel_reason + ", fee " + money(dashboard_fee))
    + `</table>`;
  ZT.setTransformData("outcome_html", outcome_html);
}'''

# ---------- nodes ----------
n = {}
n["1"] = node(1, "Content", "Start: Cancel Card Dashboard", "Agent picks the next iPay request and enters it",
              is_root="1",
              content="<p>Open the <strong>Cancel Card Dashboard</strong> in BizPay. Under <strong>Filters</strong>, select <strong>iPay</strong>. Under <strong>Date Requested</strong>, sort <strong>Oldest to Newest</strong>.</p><p>View the first payment and enter what the request shows.</p>",
              formfields=fields(field(1, "text", "payment_id", "Payment ID"),
                                field(2, "number", "cancel_amount", "Amount"),
                                field(3, "number", "dashboard_fee", "Fee Amount"),
                                field(4, "select", "requested_action", "Recommended Action", True, "\n".join(ACTIONS)),
                                field(5, "select", "requested_cancel_reason", "Reason", True, "\n".join(REASONS))),
              buttons={"0": button("Continue", 2, 1)})
data = copy.deepcopy(data_base)
data.update({"project_node_id": "2", "display_order": "2", "page_title": "Get BizPay payment",
             "node_name": "Calls GET /payments/zingtree/{payment_id} (CO 1299)", "continuation_node_id": "3",
             "data_connected_objects": {"0": {"org_id": ORG, "data_connected_object_id": GET_CO, "data_connected_object_type": "http"}}})
n["2"] = data
n["3"] = node(3, "Script", "Stage BizPay payment", "Grades the GET and stages the payment fields", content=stage,
              continuation_node_id="4")
n["4"] = node(4, "Scoring", "Route: payment found?", "Routes on payment_found", advanced_logic_node="1",
              continuation_node_id="5",
              buttons={"0": button("payment_found == true", 6, 1, "payment_found == true"), "1": button("", 5, 2, "", "def")})
n["5"] = node(5, "Content", "Payment not found", "BizPay has no payment for this ID",
              content="<p>BizPay could not find payment <strong>#payment_id#</strong>. Check the Payment ID on the dashboard and enter it again.</p>",
              buttons={"0": button("Re-enter the request", 1, 1)})
n["6"] = node(6, "Content", "Payment details and settlement", "Agent checks Settlement History and Comdata",
              content="<p style=\"margin:0 0 4px 0;\"><strong>BizPay shows this payment:</strong></p>${transforms.payment_html}<p>Open the <strong>Payment Details</strong> page and scroll to <strong>Settlement History</strong>, then to <strong>Comdata Transactions</strong>.</p>",
              formfields=fields(field(1, "radio", "has_settled_credit", "Is there a Settled Credit?", True, YES_NO),
                                field(2, "radio", "settled_credit_is_most_recent", "If yes, is it the most recent transaction?", False, YES_NO),
                                field(3, "radio", "has_comdata", "Is there transaction data in the Comdata Transactions section?", True, YES_NO)),
              buttons={"0": button("Continue", 7, 1)})
n["7"] = node(7, "Scoring", "Route: Comdata data?", "Comdata calculation or Galileo lookup", advanced_logic_node="1",
              continuation_node_id="9",
              buttons={"0": button('has_comdata == "Yes"', 8, 1, 'has_comdata == "Yes"'), "1": button("", 9, 2, "", "def")})
activity = field(4, "radio", "has_payment_activity", "Has there been payment activity on the card?", True, YES_NO)
decline = field(5, "radio", "decline_auth", "Is there an Authorization or Pre-Authorization related to a Declined transaction?", True, YES_NO)
n["8"] = node(8, "Content", "Comdata transactions", "Agent totals the Comdata transactions",
              content="<p>From the <strong>Comdata Transactions</strong> section, total each group below. Zingtree calculates Total Funds Remaining as Funding Amount + Manual Value Load - unmatched Auths - Posted + Credits.</p>",
              formfields=fields(field(1, "number", "pending_auth_total", "Authorization/Pre-Authorization amounts with no matching Posted transaction"),
                                field(2, "number", "posted_total", "Posted or Force Post amounts"),
                                field(3, "number", "credits_total", "Credits"),
                                activity, decline),
              buttons={"0": button("Continue", 10, 1)})
n["9"] = node(9, "Content", "Galileo lookup", "Agent reads the card in Galileo",
              content="<p>Open <strong>Galileo</strong> and search by Payment ID <strong>#payment_id#</strong>.</p>",
              formfields=fields(field(1, "number", "avail_to_spend", "Avail. To Spend"), activity, decline),
              buttons={"0": button("Continue", 10, 1)})
n["10"] = node(10, "Script", "Route the Cancel Card request", "Applies the Cancel Card Dashboard rules; asks for the next missing answer",
               content=route, continuation_node_id="11")
n["11"] = router(11, "Route: next step", "Routes on route", "route",
                 [("check_vendor", 13), ("rpps_check", 14), ("confirm_reason", 15), ("approve", 17)], 16)
n["13"] = node(13, "Content", "Check the supplier", "Agent confirms which supplier processed the payment",
               content="<p>The card has payment activity. Determine which <strong>Supplier</strong> processed the payment.</p>",
               formfields=fields(field(1, "radio", "correct_vendor", "Did the correct vendor process the payment?", True, YES_NO)),
               buttons={"0": button("Continue", 10, 1)})
n["14"] = node(14, "Content", "Check Reissue RPPS", "Agent checks the Actions menu",
               content="<p>Click the <strong>Actions</strong> button on the payment.</p>",
               formfields=fields(field(1, "radio", "rpps_available", "Is Reissue RPPS an available option?", True, YES_NO)),
               buttons={"0": button("Continue", 10, 1)})
n["15"] = node(15, "Content", "Confirm cancel reason", "Agent confirms the cancel reason",
               content="<p>The request was made with the reason <strong>#requested_cancel_reason#</strong>.</p><p>Confirm the cancel reason for <strong>#reason_lane#</strong>.</p>",
               formfields=fields(field(1, "select", "resubmit_reason", "Cancel reason", True, "\n".join(REASONS)),
                                 field(2, "hidden", "reason_confirmed", "", False, "", "Yes")),
               buttons={"0": button("Continue", 10, 1)})
n["16"] = node(16, "Content", "Cancel Card decision", "What to do with the request",
               content="${transforms.outcome_html}", buttons={"0": button("Work the next request", 1, 1)})
n["17"] = node(17, "Content", "Approve", "Agent approves and reports the result",
               content="${transforms.outcome_html}<p style=\"margin:12px 0 0 0;\">Did the payment approve successfully?</p>",
               buttons={"0": button("Yes, work the next request", 1, 1), "1": button("No", 18, 2)})
n["18"] = node(18, "Content", "Approval failed: card expired?", "Agent checks the expiration date",
               content="<p>Check the card's expiration date. Is the card expired?</p>",
               buttons={"0": button("Yes, expired", 19, 1), "1": button("No", 12, 2)})
n["19"] = node(19, "Content", "Settled Credit Spreadsheet", "Expired card stays in the queue",
               content="<p>Add the card to the <strong>Settled Credit Spreadsheet</strong> and leave it in the queue.</p>",
               buttons={"0": button("Work the next request", 1, 1)})
n["12"] = node(12, "Content", "Escalate", "Approval failed on an active card",
               content="<p>Do not take any further action on the payment. Escalate it to the <strong>Paymerang Support &gt; Cancel Card Escalations</strong> Teams channel.</p>",
               buttons={"0": button("Work the next request", 1, 1)})
claude_md = """<pre># claude.md - API - iPay Cancel Card Dashboard (draft) - org 604910

Purpose: iPay Cancel Card Dashboard review for Corpay PMG (BizPay) Payment Processors. The agent enters a pending Cancel Card request; the tree reads the payment from BizPay, collects what the API cannot answer yet, and tells the agent to approve, deny, deny and resubmit (with action, reason and fee), hold, or escalate. Logic follows Caroline Smith's "Cancel Card Dashboard Workflow" Visio (10/27).

Node map
1 Start: payment_id, cancel_amount, dashboard_fee, requested_action, requested_cancel_reason -> 2
2 Get BizPay payment (Data, CO 1299 bizpay__get_payment_by_id) -> 3
3 Stage BizPay payment (Script); clears the previous request's answers -> 4
4 Route: payment_found -> 6 | else 5 (re-enter -> 1)
6 Settlement History + Comdata question -> 7 -> Comdata 8 | Galileo 9 -> 10
10 Route the Cancel Card request (Script) -> 11
11 Route on route: check_vendor 13 | rpps_check 14 | confirm_reason 15 (each -> 10 again) | approve 17 | else 16
17 Approve: success -> 1 | failed -> 18 card expired? yes 19 (Settled Credit Spreadsheet) | no 12 (escalate) -> 1
16 Decision screen (hold, deny, deny + resubmit, escalate, not mapped) -> 1 (next request)

Data dictionary (form data)
payment_id, cancel_amount, dashboard_fee, requested_action, requested_cancel_reason - node 1
payment_found, payment_amount, service_fee, funding_amount, mvl_amount - node 3 (GET)
has_settled_credit, settled_credit_is_most_recent, has_comdata - node 6
pending_auth_total, posted_total, credits_total - node 8; avail_to_spend - node 9; has_payment_activity, decline_auth - 8 or 9
correct_vendor 13, rpps_available 14, resubmit_reason + reason_confirmed 15 (node 3 resets them per request)
funds_remaining, route, decision, reason_lane - node 10; transforms.payment_html (3), transforms.outcome_html (10)

Rules (node 10, in order)
decline auth -> hold. Activity + wrong vendor -> escalate. Funds < 0 -> escalate. Funds = 0 -> deny, no resubmit.
Full funds (funds = funding, funds = funding + MVL, or most-recent settled credit and funds = payment amount): settled credit -> Refund approve-check, RPPS -> resubmit Refund; no settled credit -> RPPS available? Yes+RPPS / No+Refund approve-check, Yes+Refund resubmit RPPS, No+RPPS resubmit Refund. Approve-check: reason differs, or dashboard fee is not service fee + MVL -> resubmit as requested; else approve (MVL payments included).
Fee only (MVL = funds, no MVL and service fee = funds, or funds - service fee = MVL) -> resubmit Fee Cancellation; fee = amount = funds remaining.
Anything else above 0 -> resubmit Partial Refund.
Resubmit fee = service fee + MVL.

Open questions (Visio gaps, decision "not_mapped" escalates)
Settled credit with a requested action other than Refund / Reissue RPPS: no Visio branch.
Fee Cancellation and Partial Refund always resubmit, never approve, per Visio.
Fee Cancellation reason assumed "Fee not needed". Resubmit amount not in the Visio.

Changelog
- 11/4: Caroline's 11/2 answers: fee on file = service fee + MVL for approve and resubmit; MVL payments can be approved; funds = funding + MVL is full funds; Fee Cancellation fee = amount.
- 10/27: draft built from the Cancel Card Dashboard Workflow Visio. GET only (CO 1299); approve/deny/resubmit done in BizPay until the Cancel Card API exists.</pre>"""
n["20"] = node(20, "Content", "claude.md", "Tree memory: purpose, node map, data dictionary", content=claude_md)

for v in n.values():
    v.pop("x", None); v.pop("y", None)
    v["x"], v["y"] = "-1", "0"

t = copy.deepcopy(base)
t.update({"id": "", "name": "API - iPay Cancel Card Dashboard (draft)", "tags": "pmg_cancelcard", "root_node_id": "1",
          "create_date": "", "last_opened": "", "last_modified": "", "predefined_vars": {}})
t["nodes"] = n
json.dump(t, open(out, "w"), indent=2)
print(out, len(n), "nodes")
