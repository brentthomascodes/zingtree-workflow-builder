"""Build the BizPay GET-by-payment-id contract test tree. Usage: python3 build_tree.py <connected_object_id> <alias>"""
import json, sys, copy, os
HERE = os.path.dirname(os.path.abspath(__file__))
REF = os.path.join(HERE, "../bizpay-connection-test/BizPay Connection Test (Dev) v1.json")
co_id, alias = sys.argv[1], sys.argv[2]
ref = json.load(open(REF))
ORG = "604910"

tree = {k: v for k, v in ref.items() if k not in ("nodes", "predefined_vars")}
tree.update({
    "id": "0", "name": "BizPay API Contract Test (Dev) v2",
    "description": "Corpay PMG / Paymerang. Calls GET /payments/zingtree/{payment_id} on BizPay dev and checks the response against the agreed contract field by field. Test harness only, no business logic, no POST.",
    "tags": "pmg_bizpay_test", "root_node_id": "1", "org_id": ORG, "live": "0",
})
base = copy.deepcopy(ref["nodes"]["1"])
for k in ("formfields", "buttons", "data_connected_objects"):
    base[k] = {}
base.update({"is_root": "0", "continuation_node_id": "0", "content": ""})

def node(nid, typ, title, name, y, **kw):
    n = copy.deepcopy(base)
    n.update({"type": typ, "project_node_id": str(nid), "page_title": title, "node_name": name,
              "display_order": str(nid), "x": "600", "y": str(y)})
    n.update(kw)
    return n

def button(text, link, rank):
    return {"button_text": text, "hover_text": "", "button_link": str(link), "rank": str(rank),
            "button_data": "", "logic_expression": "", "wizard_skip": "0", "value": "0", "op": "", "updated": "0"}

payment_field = {"type": "text", "name": "payment_id", "label": "BizPay payment ID", "label_type": "L",
                 "options": "", "hidden_value": "", "custom_regex": "", "inline": "0", "required": "1",
                 "score_var": "", "checkbox_score": "1", "scores": "", "rank": "1", "config": ""}

check = f"""let response = actions.{alias};
let code = response._zt_meta.response.code;
let found = code >= 200 && code < 300;
let entered = ZT.getVariableValue("payment_id", "");

// The agreed GET contract: field -> rule the value must satisfy
let statuses = ["Created", "Waiting", "Locked", "Processing", "Completed", "On Hold", "Error", "Converted", "Cancelled", "Unloaded"];
let isNumber = v => Number.isFinite(v);
let isString = v => v === String(v);
let isBoolean = v => v === true || v === false;
let contract = [
  ["payment_id", "number matching the ID entered", v => isNumber(v) && String(v) === entered],
  ["client_id", "number", isNumber],
  ["client_name", "text", isString],
  ["vendor_id", "number", isNumber],
  ["client_vendor_id", "number", isNumber],
  ["payment_amount", "number", isNumber],
  ["service_fee", "number", isNumber],
  ["funding_amount", "number", isNumber],
  ["manual_value_load_amount", "number", isNumber],
  ["remaining_balance", "number", isNumber],
  ["card_status", "one of " + statuses.join(", "), v => statuses.includes(v)],
  ["card_status_date", "date as YYYY-MM-DD", v => isString(v) && /^\\d{{4}}-\\d{{2}}-\\d{{2}}$/.test(v)],
  ["cancel_card_request_exists", "true or false", isBoolean],
  ["cancel_card_request_approved", "true or false", isBoolean],
  ["pega_case_id", "text, empty when no Pega case", isString]
];

let html_escape = s => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;");
let returned = found ? Object.keys(response).filter(k => k !== "_zt_meta") : [];
let rows = contract.map(([field, rule, test]) => {{
  let present = returned.includes(field);
  let pass = present && test(response[field]);
  let shown = present ? html_escape(JSON.stringify(response[field])) : "<em>missing</em>";
  return {{ pass, html: `<tr><td>${{pass ? "PASS" : "FAIL"}}</td><td>${{field}}</td><td>${{shown}}</td><td>${{rule}}</td></tr>` }};
}});
let unexpected = returned.filter(k => !contract.some(([field]) => field === k));
let failures = rows.filter(r => !r.pass).length;

// A non-2xx is expected to carry {{message, error}}; the engine hands a JSON error body over already parsed
let rawBody = found ? "" : (response._zt_meta.response.body || "");
let bodyIsText = rawBody === String(rawBody);
let parsed = bodyIsText ? (rawBody.startsWith("{{") ? JSON.parse(rawBody) : {{}}) : rawBody;
let body = bodyIsText ? rawBody : JSON.stringify(rawBody);
let errorShapeOk = isString(parsed.message) && isString(parsed.error);

let table = `<table><tr><th>Result</th><th>Field</th><th>Returned</th><th>Contract</th></tr>${{rows.map(r => r.html).join("")}}</table>`;
let extras = unexpected.length ? `<p>Fields returned that are not in the contract: ${{unexpected.join(", ")}}</p>` : "";
let html = found
  ? `<p><strong>HTTP ${{code}}. ${{failures === 0 ? "All 15 contract fields pass." : failures + " of 15 contract fields fail."}}</strong></p>${{table}}${{extras}}<p>Raw response</p><pre style="white-space:pre-wrap">${{html_escape(JSON.stringify(Object.fromEntries(returned.map(k => [k, response[k]]))))}}</pre>`
  : `<p><strong>HTTP ${{code}} for payment ${{html_escape(entered)}}.</strong> Error body ${{errorShapeOk ? "matches" : "does not match"}} the agreed {{message, error}} shape.</p><p>message: ${{html_escape(parsed.message || "")}}<br>error: ${{html_escape(parsed.error || "")}}</p><p>Raw body</p><pre style="white-space:pre-wrap">${{html_escape(body)}}</pre>`;
ZT.setTransformData("bizpay_contract_html", html.replace(/\\n/g, " "));"""

claude_md = f"""<pre># claude.md - BizPay API Contract Test (Dev) v2 - org {ORG}

Purpose: confirm the BizPay dev GET-by-payment-id endpoint matches the contract Mayur Palankar sent 2026-10-16. Test harness, not a customer workflow. GET only; the POST /actions call cancels a card and is deliberately not wired here.

Node map
1 Start (Content, root): payment_id text field -> 2
2 Get BizPay payment (Data, CO {co_id} alias {alias}) -> 3
3 Check the contract (Script) -> 4
4 Contract result (Content): end. Use Restart to test another payment.

Data dictionary
payment_id - form data, typed on node 1; the Connected Object merges it into the URL as ${{payment_id}}
actions.{alias} - GET {{base}}/payments/zingtree/${{payment_id}}: payment_id, client_id, client_name, vendor_id, client_vendor_id, payment_amount, service_fee, funding_amount, manual_value_load_amount, remaining_balance, card_status, card_status_date, cancel_card_request_exists, cancel_card_request_approved, pega_case_id. Non-2xx (404 for not found): _zt_meta.response.body = {{message, error}}, arrives as a parsed object (confirmed live), not a string
transforms.bizpay_contract_html - pass/fail table per field plus the raw response

External systems
Data source "BizPay Dev (Paymerang)": OAuth2 client credentials against the Paymerang Auth0 dev tenant.
Dev API base https://develop.api.pega.dev.paymerang.com/ (IP whitelisted for Zingtree's static IPs).

Gotchas
No credential lives in this tree. Results cache for 300s per payment_id; use a different ID or wait to re-test the same one.
The contract list in node 3 is the spec; if Mayur changes a field, change that list.

Changelog
- Contract test for GET /payments/zingtree/{{payment_id}} built from the 10/16 contract.\n- Error body handled as a parsed object after the first live 404 run.</pre>"""

nodes = {
    "1": node(1, "Content", "BizPay contract test", "Start: enter a payment ID to test", 40, is_root="1",
              content="<p>Enter a BizPay dev payment ID. The test calls GET /payments/zingtree/{payment_id} and checks every field against the agreed contract. Try an ID that does not exist to check the error format.</p>",
              formfields={"0": payment_field}, buttons={"0": button("Run test", 2, 1)}),
    "2": node(2, "Data", "Get BizPay payment", "Calls GET /payments/zingtree/{payment_id} on BizPay dev", 140,
              continuation_node_id="3",
              data_connected_objects={"0": {"org_id": ORG, "data_connected_object_id": str(co_id), "data_connected_object_type": "http"}}),
    "3": node(3, "Script", "Check the contract", "Grades the call and checks each field against the contract", 240,
              content=check, continuation_node_id="4"),
    "4": node(4, "Content", "Contract result", "Shows pass/fail per field and the raw response", 340,
              content="${transforms.bizpay_contract_html}"),
    "5": node(5, "Content", "claude.md", "Tree memory: purpose, node map, data dictionary", 40, x="900", content=claude_md),
}
tree["nodes"] = nodes
tree["predefined_vars"] = {}
out = os.path.join(HERE, "BizPay API Contract Test (Dev) v2.json")
json.dump(tree, open(out, "w"), indent=2)
print(out)
