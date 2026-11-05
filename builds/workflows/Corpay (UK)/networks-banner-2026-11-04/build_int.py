"""INT 2026-11-04: Networks multi-intent banner (Charley Gunning, standup 4 Nov) + Test Mode scenario.
Networks 547469427: 118 (response choice) and 110 (reply dashboard) show the same
'Part of this request was not recognised' card FAST / Homecharge show when ai_exception_reason
is set on an in-scope case. 48 changelog.
Master 109029630: Test Mode scenario test_networks_remittance_plus_other (44 options, 45 email). 48 changelog."""
import json
D='2026-11-04'
N=json.load(open('3 BRANCH - Networks INT 547469427 (BEFORE baseline 2026-11-04).json',encoding='utf-8'))
M=json.load(open('0 MASTER INT 109029630 (BEFORE baseline 2026-11-04).json',encoding='utf-8'))
n=N['nodes']

# --- 94: the banner is built once, where the AI answer is graded; 118 and 110 print it
c=n['94']['content']
a="// Case.Description is the inbound email as plain text"
assert c.count(a)==1
c=c.replace(a,"""// --- part of the request not recognised (same card as FAST / Homecharge) ------------------
// On an in-scope case ai_exception_reason is empty unless the email also asks about something
// the AI does not handle; it then names that part. Screens 96 and 114 print the card on top
// (Charley Gunning, 4 Nov).
const escapeHtml = value => String(value == null ? "" : value)
  .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
  .replace(/"/g, "&quot;").replace(/'/g, "&#39;");
let unrecognised_banner_html = "";
if (email_analysis_route === "in_scope" && ai_exception_reason !== "") {
  unrecognised_banner_html = `
<div class="case-review-card" style="background:#fffbeb;border-color:#fde68a;">
  <h3 class="case-review-card-title">Part of this request was not recognised</h3>
  <p>Not all elements of this customer request have been matched to a recognised intent. Please review the draft response and add any missing information before sending the email.</p>
  <p><strong>Recognised:</strong> Remittance copy request</p>
  <p><strong>Not recognised:</strong> ${escapeHtml(ai_exception_reason)}</p>
</div>`.replace(/\\s*\\n\\s*/g, " ");
}

"""+a)
a='ZT.setTransformData("networks_customer_email_html", networks_customer_email_html);\n'
assert c.count(a)==1
c=c.replace(a,a+'ZT.setTransformData("unrecognised_banner_html", unrecognised_banner_html);\n')
n['94']['content']=c
# --- 118
c=n['118']['content']
a='ZT.setTransformData("response_choice_html", response_choice_html.replace('
assert c.count(a)==1
c=c.replace(a,'ZT.setTransformData("response_choice_html", (transforms.unrecognised_banner_html + response_choice_html).replace(')
n['118']['content']=c
# --- 110
c=n['110']['content']
a='ZT.setFormData("case_review_html", compact(case_review_html));'
assert c.count(a)==1
c=c.replace(a,'ZT.setFormData("case_review_html", compact(transforms.unrecognised_banner_html + case_review_html));')
n['110']['content']=c
# --- 48 changelog (Networks)
c=n['48']['content']
n['48']['content']=c+'<p>'+D+': multi-intent banner. Script 94 builds transforms.unrecognised_banner_html; response-choice screen 96 (118) and reply dashboard 114 (110) show the "Part of this request was not recognised" card when the intent AI Action 23 returns ai_exception_reason on an in-scope case, same as FAST / Homecharge. AI 23: ai_exception_reason now names the extra request when the email also asks about something else (Charley Gunning, 4 Nov).</p>'

# --- master: Test Mode scenario
mn=M['nodes']
KEY='test_networks_remittance_plus_other'
ff=mn['44']['formfields']['0']; opts=ff['options'].split('\n'); assert KEY not in opts
i=opts.index('test_networks_remittance_wrong'); opts.insert(i,KEY); ff['options']='\n'.join(opts)
c=mn['45']['content']
a='  test_networks_remittance_wrong: {'
assert c.count(a)==1
c=c.replace(a,'''  test_networks_remittance_plus_other: {
    subject: "Remittance and window stickers",
    body: "Hello,\\n\\nPlease can you send me a copy of my remittance for last week's payment? Also, could you post us some new Allstar window stickers for the forecourt?\\n\\nThanks,\\nGary Lowe\\nLowe Motors"
  },
'''+a)
mn['45']['content']=c
c=mn['48']['content']; assert c.endswith('</pre>')
mn['48']['content']=c[:-6]+'\n'+D+': Test Mode scenario test_networks_remittance_plus_other (44, 45): remittance copy + an out-of-scope ask, shows the Networks multi-intent banner.</pre>'

json.dump(N,open('3 BRANCH - Networks INT 547469427 (multi-intent banner 2026-11-04).json','w',encoding='utf-8'),ensure_ascii=False,indent=1)
json.dump(M,open('0 MASTER INT 109029630 (networks banner scenario 2026-11-04).json','w',encoding='utf-8'),ensure_ascii=False,indent=1)
print('built')
