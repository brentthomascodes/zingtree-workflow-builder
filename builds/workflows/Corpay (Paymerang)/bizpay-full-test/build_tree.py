"""Build the BizPay full connection test (GET + POST). Usage: python3 build_tree.py <post_connected_object_id>
Starts from the v2 contract test (GET, CO 1299) and adds the gated POST /actions leg."""
import json, sys, copy, os
HERE = os.path.dirname(os.path.abspath(__file__))
V2 = os.path.join(HERE, "../bizpay-contract-test/BizPay API Contract Test (Dev) v2.json")
post_co = sys.argv[1]
POST_ALIAS = "bizpay__post_payment_action"
ORG = "604910"
tree = json.load(open(V2))
tree.update({"id": "0", "name": "BizPay API Full Test (Dev) v3",
             "description": "Corpay PMG / Paymerang. Tests both BizPay dev endpoints: GET /payments/zingtree/{payment_id} against the agreed contract, then a confirmed POST /payments/zingtree/{payment_id}/actions. Test harness only. The POST cancels the card on the payment."})
nodes = tree["nodes"]
base = copy.deepcopy(nodes["4"])
for k in ("formfields", "buttons", "data_connected_objects"):
    base[k] = {}
base.update({"continuation_node_id": "0", "content": ""})

def node(nid, typ, title, name, y, **kw):
    n = copy.deepcopy(base)
    n.update({"type": typ, "project_node_id": str(nid), "page_title": title, "node_name": name,
              "display_order": str(nid), "x": "600", "y": str(y)})
    n.update(kw)
    return n

def button(text, link, rank):
    return {"button_text": text, "hover_text": "", "button_link": str(link), "rank": str(rank),
            "button_data": "", "logic_expression": "", "wizard_skip": "0", "value": "0", "op": "", "updated": "0"}

def field(rank, typ, name, label, required, options=""):
    return {"type": typ, "name": name, "label": label, "label_type": "L", "options": options, "hidden_value": "",
            "custom_regex": "", "inline": "0", "required": "1" if required else "0", "score_var": "",
            "checkbox_score": "0" if typ == "checkbox" else "1", "scores": "", "rank": str(rank), "config": ""}

resolutions = ["reissue_check", "cancel_fee", "cancel_fee_under_1", "partial_refund", "full_refund", "reissue_rpps", "reissue_check_cancel_fee"]
reasons = [l.strip() for l in open(os.path.join(HERE, "cancel_card_reason_list.txt")) if l.strip()]

# Node 3 also stages the POST amount and fee from the GET, since BizPay rejects a POST whose amount or fee does not match its record
nodes["3"]["content"] += """

// The POST must match BizPay's record, so the amount and fee come from this GET
if (found) {
  ZT.setFormData("amount", String(response.payment_amount));
  ZT.setFormData("fee", String(response.service_fee));
}"""

# Node 4: GET result plus the POST inputs, so GET result -> POST is one screen
nodes["4"].update({
    "page_title": "GET result and POST test", "node_name": "Shows the GET contract check and collects the POST test inputs",
    "content": "${transforms.bizpay_contract_html}<h3>POST /actions test</h3><p>Sends a cancel_card action for payment #payment_id#. This cancels the card on that payment in BizPay dev. Use only a payment Corpay has cleared for testing, or a payment ID that does not exist to test the error path. Amount and fee are prefilled from the GET (payment_amount and service_fee) because BizPay rejects a POST whose amount is higher than its record or whose fee does not match; each payment can be cancelled once. Keep quotes out of the note.</p>",
    "formfields": {
        "0": field(1, "select", "resolution", "Resolution", True, "\n".join(resolutions)),
        "1": field(2, "select", "cancel_card_reason", "Cancel card reason (BizPay list)", True, "\n".join(reasons)),
        "2": field(3, "number", "amount", "Amount", True),
        "3": field(4, "number", "fee", "Remaining fee", True),
        "4": field(5, "text", "payment_note", "Payment note", True),
        "5": field(6, "email", "agent_email", "Agent email", True),
        "6": field(7, "checkbox", "confirm_post", "I understand this cancels the card on this payment in BizPay dev", True),
    },
    "buttons": {"0": button("Send POST test", 5, 1)},
})

grade_post = f"""let response = actions.{POST_ALIAS};
let code = response._zt_meta.response.code;
let accepted = code >= 200 && code < 300;
let entered = ZT.getVariableValue("payment_id", "");
let html_escape = s => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;");

// What the Connected Object sent, read back from the form
let sent = ["resolution", "cancel_card_reason", "amount", "fee", "payment_note", "agent_email"]
  .map(name => `<tr><td>${{name}}</td><td>${{html_escape(ZT.getVariableValue(name, ""))}}</td></tr>`).join("");

// The agreed success body: {{success: true, message, request_id}}
let checks = [
  ["success", "true", v => v === true],
  ["message", "text", v => v === String(v)],
  ["request_id", "number", v => Number.isFinite(v)]
];
let returned = accepted ? Object.keys(response).filter(k => k !== "_zt_meta") : [];
let rows = checks.map(([field, rule, test]) => {{
  let pass = returned.includes(field) && test(response[field]);
  let shown = returned.includes(field) ? html_escape(JSON.stringify(response[field])) : "<em>missing</em>";
  return {{ pass, html: `<tr><td>${{pass ? "PASS" : "FAIL"}}</td><td>${{field}}</td><td>${{shown}}</td><td>${{rule}}</td></tr>` }};
}});
let failures = rows.filter(r => !r.pass).length;

// Errors come back as {{message, error}}, handed over parsed or as text
let errorBody = accepted ? {{}} : (response._zt_meta.response.body || {{}});
let errorText = errorBody === String(errorBody) ? errorBody : JSON.stringify(errorBody);
let errorFields = errorBody === String(errorBody) ? (errorBody.startsWith("{{") ? JSON.parse(errorBody) : {{}}) : errorBody;
let errorShapeOk = errorFields.message === String(errorFields.message) && errorFields.error === String(errorFields.error);

let sentTable = `<p>Sent for payment ${{html_escape(entered)}}</p><table><tr><th>Field</th><th>Value</th></tr>${{sent}}</table>`;
let html = accepted
  ? `<p><strong>HTTP ${{code}}. ${{failures === 0 ? "Response matches the agreed success body." : failures + " of 3 response fields fail."}}</strong></p><table><tr><th>Result</th><th>Field</th><th>Returned</th><th>Contract</th></tr>${{rows.map(r => r.html).join("")}}</table>${{sentTable}}<p>Raw response</p><pre style="white-space:pre-wrap">${{html_escape(JSON.stringify(Object.fromEntries(returned.map(k => [k, response[k]]))))}}</pre>`
  : `<p><strong>HTTP ${{code}}. POST not accepted.</strong> Error body ${{errorShapeOk ? "matches" : "does not match"}} the agreed {{message, error}} shape.</p><p>message: ${{html_escape(errorFields.message || "")}}<br>error: ${{html_escape(errorFields.error || "")}}</p>${{sentTable}}<p>Raw body</p><pre style="white-space:pre-wrap">${{html_escape(errorText)}}</pre>`;
ZT.setTransformData("bizpay_post_html", html.replace(/\\n/g, " "));"""

claude_md = f"""<pre># claude.md - BizPay API Full Test (Dev) v3 - org {ORG}

Purpose: test both BizPay dev endpoints Mayur Palankar delivered 2026-10-16. Test harness, not a customer workflow. The POST cancels the card on the payment it is sent for.

Node map
1 Start (Content, root): payment_id -> 2
2 Get BizPay payment (Data, CO 1299 alias bizpay__get_payment_by_id) -> 3
3 Check the GET contract (Script) -> 4
4 GET result and POST test (Content): POST inputs + confirm checkbox; Send POST test -> 5
5 Post BizPay action (Data, CO {post_co} alias {POST_ALIAS}) -> 6
6 Check the POST response (Script) -> 7
7 POST result (Content): end. Use Restart to run again.

Data dictionary
payment_id - form data, node 1; merged into both Connected Object URLs as ${{payment_id}}
resolution, cancel_card_reason, amount, fee, payment_note, agent_email - form data, node 4; read only by the POST Connected Object body template (and echoed by node 6)
confirm_post - form data, node 4; required checkbox gating the POST
actions.bizpay__get_payment_by_id - 15-field GET contract (see node 3); non-2xx 404 with {{message, error}}
actions.{POST_ALIAS} - success {{success, message, request_id}}; error {{message, error}}
transforms.bizpay_contract_html, transforms.bizpay_post_html - rendered results

External systems
Data source "BizPay Dev (Paymerang)": OAuth2 client credentials against the Paymerang Auth0 dev tenant.
POST Connected Object body template (owned by the CO, not the tree):
{{"action":"cancel_card","resolution":"${{resolution}}","cancel_card_reason":"${{cancel_card_reason}}","amount":${{amount}},"fee":${{fee}},"payment_note":"${{payment_note}}","agent_email":"${{agent_email}}"}}

Gotchas
No credential lives in this tree. The POST cancels a real dev card: use payments Corpay cleared for testing, or a nonexistent ID for the error path.
A double quote in payment_note breaks the JSON body.
Error bodies arrive as a parsed object (confirmed live on the GET 404); both scripts accept text too.
cancel_card_reason options are BizPay's list from Mayur's 10/16 email; they must match exactly.
Node 3 prefills amount (payment_amount) and fee (service_fee) from the GET for the POST.\nPOST validation (Mayur, 10/19 call): amount must be <= the payment amount on record, fee must match; a payment can be cancelled only once. Test IDs from Mayur 10/19: 34312851, 34312417, 34312403, 34311241, 34311227, 34307517, 34307503, 34305312, 34305298, 34303695 (amounts 1489.38 / 537.42, fee 0) - GET returned 404 for 34312851 and 34303695 in dev on 10/19.

Changelog
- Contract test for GET /payments/zingtree/{{payment_id}} built from the 10/16 contract.
- Error body handled as a parsed object after the first live 404 run.
- POST /actions leg added behind a confirm checkbox.\n- POST amount and fee prefilled from the GET response.</pre>"""

old_md = nodes.pop("5")
nodes["5"] = node(5, "Data", "Post BizPay action", "Calls POST /payments/zingtree/{payment_id}/actions on BizPay dev", 440,
                  continuation_node_id="6",
                  data_connected_objects={"0": {"org_id": ORG, "data_connected_object_id": str(post_co), "data_connected_object_type": "http"}})
nodes["6"] = node(6, "Script", "Check the POST response", "Grades the POST and checks the response against the contract", 540,
                  content=grade_post, continuation_node_id="7")
nodes["7"] = node(7, "Content", "POST result", "Shows the POST result, what was sent and the raw response", 640,
                  content="${transforms.bizpay_post_html}")
nodes["8"] = copy.deepcopy(old_md)
nodes["8"].update({"project_node_id": "8", "display_order": "8", "content": claude_md})
out = os.path.join(HERE, "BizPay API Full Test (Dev) v3.json")
json.dump(tree, open(out, "w"), indent=2)
print(out)
