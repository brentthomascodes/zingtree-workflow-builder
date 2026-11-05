"""Build the BizPay connection test tree. Usage: python3 build_tree.py <connected_object_id> <alias>"""
import json, sys, copy, os
HERE = os.path.dirname(os.path.abspath(__file__))
REF = os.path.join(HERE, "../../Corpay (UK)/Fast Admin - INT (EU org 123 promote 2026-09-16).json")
co_id, alias = sys.argv[1], sys.argv[2]
ref = json.load(open(REF))
ORG = "604910"

tree = {k: v for k, v in ref.items() if k not in ("nodes", "predefined_vars")}
tree.update({
    "id": "0", "name": "BizPay Connection Test (Dev)",
    "description": "Corpay PMG / Paymerang. Calls the BizPay dev API through the BizPay Dev data source and shows the HTTP status and raw response. Connection test only, no business logic.",
    "tags": "pmg_bizpay_test", "root_node_id": "1", "org_id": ORG, "live": "0",
    "css_include": "https://assets.zingtree.com/managed/templates/zingtree_2026.css",
    "script_code": "", "create_date": "", "last_opened": "", "last_modified": "",
    "persistent_buttons": None, "hide_back_button": "0",
})
base = copy.deepcopy(next(n for n in ref["nodes"].values() if n["type"] == "Content"))
for k in ("formfields", "buttons", "data_connected_objects"):
    base[k] = {}
base.update({"is_root": "0", "continuation_node_id": "0", "continuation_button_text": "",
             "content": "", "notes": "", "ai_action_id": "0", "advanced_logic_node": "0"})

def node(nid, typ, title, name, y, **kw):
    n = copy.deepcopy(base)
    n.update({"type": typ, "project_node_id": str(nid), "page_title": title, "node_name": name,
              "display_order": str(nid), "x": "600", "y": str(y)})
    n.update(kw)
    return n

def button(text, link, rank):
    return {"button_text": text, "hover_text": "", "button_link": str(link), "rank": str(rank),
            "button_data": "", "logic_expression": "", "wizard_skip": "0", "value": "0", "op": "", "updated": "0"}

grade = f"""let response = actions.{alias};
let code = response._zt_meta.response.code;
let connected = code >= 200 && code < 300;
let payments = connected ? response.payments : [];
let rows = payments.map(p => `<tr><td>${{p.payment_id}}</td><td>${{p.client_id}}</td><td>${{p.vendor_id}}</td><td>${{p.client_vendor_id}}</td><td>${{p.payment_amount}}</td><td>${{p.fee}}</td></tr>`).join("");
let table = `<table><tr><th>Payment ID</th><th>Client ID</th><th>Vendor ID</th><th>Client Vendor ID</th><th>Amount</th><th>Fee</th></tr>${{rows}}</table>`;
let errorBody = connected ? "" : String(response._zt_meta.response.body || "").replace(/&/g, "&amp;").replace(/</g, "&lt;");
let html = connected
  ? `<p><strong>Connected.</strong> BizPay returned HTTP ${{code}} with ${{payments.length}} payment(s).</p>${{table}}`
  : `<p><strong>Not connected.</strong> BizPay returned HTTP ${{code}}. A 401 or 403 points at the data source credentials or audience; a timeout points at the IP whitelist.</p><pre style="white-space:pre-wrap">${{errorBody}}</pre>`;
ZT.setTransformData("bizpay_result_html", html.replace(/\\n/g, " "));"""

claude_md = f"""<pre># claude.md - BizPay Connection Test (Dev) - org {ORG}

Purpose: prove Zingtree can reach the Corpay PMG BizPay dev API. Not a customer workflow.

Node map
1 Start (Content, root) -> 2
2 Get BizPay payments (Data, CO {co_id} alias {alias}) -> 3
3 Grade the call (Script) -> 4
4 Result (Content): end. Use Restart to run again (results cache 300s).

Data dictionary
actions.{alias} - GET {{base}}/payments/zingtree response: payments[] of payment_id, client_id, vendor_id, client_vendor_id, payment_amount, fee (confirmed live)
transforms.bizpay_result_html - status line plus a table of payments

External systems
Data source "BizPay Dev (Paymerang)": OAuth2 client credentials against the Paymerang Auth0 dev tenant, 23h token.
Dev API base https://develop.api.pega.dev.paymerang.com/ (IP whitelisted for Zingtree's static IPs).

Gotchas
No credential lives in this tree. Fields read are the ones the live test response returned; nothing reads a mock-only field.

Changelog
- Initial connection test build.</pre>"""

nodes = {
    "1": node(1, "Content", "BizPay connection test", "Start: explains the test and runs the call", 40,
              is_root="1",
              content="<p>Calls the BizPay dev API (GET /payments/zingtree) using the BizPay Dev data source, then shows the HTTP status and the raw response.</p>",
              buttons={"0": button("Run test", 2, 1)}),
    "2": node(2, "Data", "Get BizPay payments", "Calls GET /payments/zingtree on BizPay dev", 140,
              continuation_node_id="3",
              data_connected_objects={"0": {"org_id": ORG, "data_connected_object_id": str(co_id), "data_connected_object_type": "http"}}),
    "3": node(3, "Script", "Grade the BizPay call", "Grades the status code and renders the raw response", 240,
              content=grade, continuation_node_id="4"),
    "4": node(4, "Content", "BizPay test result", "Shows the status line and raw response", 340,
              content="${transforms.bizpay_result_html}",
              ),
    "5": node(5, "Content", "claude.md", "Tree memory: purpose, node map, data dictionary", 40, x="900",
              content=claude_md),
}
nodes["5"]["x"] = "900"
tree["nodes"] = nodes
tree["predefined_vars"] = {}
out = os.path.join(HERE, "BizPay Connection Test (Dev) v1.json")
json.dump(tree, open(out, "w"), indent=2)
print(out)
