# Networks branch 547469427, Gemma Danks "Networks UAT feedback" 26 Oct:
#  1) invoice amount always shows a £ sign in the service department reply (node 110)
#  2) response-choice screen 96 uses the dashboard layout: Case Details + Original Customer Email (new script 118)
import json, copy, sys
src, out = sys.argv[1], sys.argv[2]
t = json.load(open(src)); N = t["nodes"]
g = {v["project_node_id"]: k for k, v in N.items()}
node = lambda n: N[g[n]]

# --- 1) £ on the invoice amount (node 110) ----------------------------------------
c = node("110")["content"]
old_in = 'let invoice_amount = ZT.getVariableValue("invoice_amount", "");\n'
new_in = ('let invoice_amount = ZT.getVariableValue("invoice_amount", "");\n'
          '// The reply always shows the amount in pounds: one leading pound sign (\\u00a3), whatever the agent typed (Gemma Danks, 26 Oct).\n'
          'let invoice_amount_gbp = "\\u00a3" + String(invoice_amount).trim().replace(/^\\u00a3\\s*/, "");\n')
assert c.count(old_in) == 1
c = c.replace(old_in, new_in)
old_use = 'relating to " + escapeHtml(invoice_amount) + " to the 1Link platform.'
assert c.count(old_use) == 1
c = c.replace(old_use, 'relating to " + escapeHtml(invoice_amount_gbp) + " to the 1Link platform.')
node("110")["content"] = c

# --- 2) dashboard on the response-choice screen ------------------------------------
script118 = r'''// --- inputs -----------------------------------------------------------------
let sfCase = actions.sfdc_int__case_email_ai.records[0];
let sf_CaseNumber = ZT.getVariableValue("sf_CaseNumber", "");
let sf_Subject = ZT.getVariableValue("sf_Subject", "");
let confidence_score = ZT.getVariableValue("confidence_score", "");
let networks_customer_email_html = transforms.networks_customer_email_html;

const escapeHtml = value => String(value == null ? "" : value)
  .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
  .replace(/"/g, "&quot;").replace(/'/g, "&#39;");

// --- dashboard: same layout as the reply dashboard (114), so the agent picks the response
// with the case and the customer's email in view (Gemma Danks, Networks UAT feedback 26 Oct).
const row = (label, value) => `<div class="case-review-row"><div class="case-review-row-label">${escapeHtml(label)}</div><div class="case-review-row-value">${value === "" ? "&mdash;" : escapeHtml(value)}</div></div>`;
let response_choice_html = `
<div class="case-review-shell"><div class="case-review-panel">
  <div class="case-review-hero"><div class="case-review-hero-top">
    <div class="case-review-hero-copy">
      <div class="case-review-eyebrow">Case Review</div>
      <h2 class="case-review-main-title">Remittance request</h2>
      <div class="case-review-subtitle">Case <strong>${escapeHtml(sf_CaseNumber)}</strong> <span class="case-review-subtitle-separator">&middot;</span> Choose the response below</div>
    </div>
    <div class="case-review-hero-metrics-card"><div class="case-review-hero-metric">
      <div class="case-review-hero-metric-label">Confidence Score</div>
      <div class="case-review-hero-metric-value">${confidence_score === "" ? "&mdash;" : escapeHtml(confidence_score)}</div>
    </div></div>
  </div></div>
  <div class="case-review-body"><div class="case-review-grid">
    <div class="case-review-col case-review-col-left"><div class="case-review-card">
      <h3 class="case-review-card-title">Case Details</h3>
      ${row("Case Number", sf_CaseNumber)}
      ${row("Subject", sf_Subject)}
      ${row("Customer Request", "Remittance copy request")}
      ${row("Requester Email", sfCase.SuppliedEmail || "")}
    </div></div>
    <div class="case-review-col case-review-col-right"><div class="case-review-card">
      <h3 class="case-review-card-title">Original Customer Email</h3>
      <div class="case-review-html-card-body">${networks_customer_email_html || "&mdash;"}</div>
    </div></div>
  </div></div>
</div></div>`;

// --- outputs ----------------------------------------------------------------
ZT.setTransformData("response_choice_html", response_choice_html.replace(/\s*\n\s*/g, " "));
'''
new = copy.deepcopy(node("112"))
new.update({"project_node_id": "118", "node_name": "Build response-choice dashboard", "page_title": "Build response-choice dashboard",
            "content": script118, "continuation_node_id": "96", "display_order": "118",
            "x": str(int(node("96")["x"]) - 200), "y": node("96")["y"]})
key = str(max(int(k) for k in N) + 1) if all(k.isdigit() for k in N) else "118"
N[key] = new
for b in node("95")["buttons"].values():
    if b["logic_expression"] == 'email_analysis_route == "in_scope"':
        assert b["button_link"] == "96"; b["button_link"] = "118"
node("96")["content"] = '<p>${transforms.response_choice_html}</p><p><strong>Choose the response for this request:</strong></p>'

# --- claude.md changelog ---------------------------------------------------------
node("48")["content"] += "<p>2026-10-27: invoice amount always shown with a pound sign in the service department reply (110); response-choice screen 96 now shows the case dashboard (Case Details + Original Customer Email) built by new script 118 (Gemma Danks, Networks UAT feedback 26 Oct).</p>"
json.dump(t, open(out, "w"), ensure_ascii=False, indent=1)
print("built", out)
