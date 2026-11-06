"""Networks reply form demo (INT, org 123) - 2026-11-05.
Sources: Charley Gunning 'Daily AI standup - 4th Nov' (fields: Case number hidden, Invoice Amount,
Merchant ID Number); standup 5 Nov (form submission must tie to the existing case via a hidden case
variable; demo Fri 6 Nov).
Flow: link https://eu.zingtree.com/show/<tree>?sf_Id=<Case Id> -> 1 get case (CO 10) -> 2 check ->
3 router -> 4 form (Invoice Amount, Merchant ID Number) -> 5 build confirmation -> 6 send (CO 187,
emailSimple, relatedRecordId = sf_Id, logEmailOnSend) -> 7 grade -> 8 router -> 10 thanks | 11 failed.
9 = link not valid. The send logs the merchant's details as an email on the existing case."""
import json,copy
M=json.load(open('m_int_before.json')); N=json.load(open('nw_int_after.json'))
mn=M['nodes']; nn=N['nodes']
T=copy.deepcopy(N)
T['id']='0'; T['name']='Networks reply form (demo)'; T['description']='Networks remittance reply form, demo for Corpay UK (6 Nov). Merchant opens the link from the AI email; the case id rides in the link (sf_Id) and never shows.'
T['root_node_id']='1'; T['script_code']=''
pv=[v for v in M['predefined_vars'].values() if v['name']=='sf_Id'][0]
pv=dict(pv); pv.pop('id',None); pv['project_id']=0
T['predefined_vars']={'0':pv}
def base(src, nid, title, x, y):
    n=copy.deepcopy(src); n['project_node_id']=nid; n['display_order']=nid; n['node_name']=title; n['page_title']=title
    n['x']=str(x); n['y']=str(y); n['is_root']='1' if nid=='1' else '0'; n['continuation_node_id']='0'; n['buttons']={}; n['formfields']={}
    n['data_connected_objects']={}; n['content']=''; n['open_tree_id']='0'; n['ai_action_id']='0'
    return n
def btn(text,link,rank,expr='',op=''):
    return {"button_text":text,"hover_text":"","button_link":link,"rank":str(rank),"button_data":"","logic_expression":expr,"wizard_skip":"0","value":"0","op":op,"updated":"0"}
def field(typ,name,label,rank,req='1'):
    return {"type":typ,"name":name,"label":label,"label_type":"L","options":"","hidden_value":"","custom_regex":"","inline":"0","required":req,"score_var":"","checkbox_score":"1","scores":"","rank":str(rank),"config":""}
S=nn['94']; D=mn['2']; C=nn['97']; R=mn['40']; CT=mn['41']
out={}
n=base(D,'1','Find the case from the link',100,100); n['data_connected_objects']=copy.deepcopy(mn['2']['data_connected_objects']); n['continuation_node_id']='2'; out['1']=n
n=base(S,'2','Check the link points at a case',100,250); n['continuation_node_id']='3'
n['content']='''// --- inputs -----------------------------------------------------------------
// sf_Id comes from the link in the AI email (?sf_Id=<Case Id>). The case read returns
// records + _zt_meta only, so "found" means records[0] exists with an Id.
let caseRecord = actions.sfdc_int__case_email_ai.records[0];

// --- transform ----------------------------------------------------------------
let case_found = caseRecord !== undefined && caseRecord.Id !== "";
let networks_form_case_number = case_found ? caseRecord.CaseNumber : "";

// --- outputs ----------------------------------------------------------------
ZT.setFormData("case_found", case_found ? "true" : "false");
ZT.setFormData("networks_form_case_number", networks_form_case_number);
'''
out['2']=n
n=base(R,'3','Case found?',100,400); n['buttons']={'0':btn('case_found == "true"','4',1,'case_found == "true"'),'1':btn('','9',2,'','def')}; n['advanced_logic_node']='1'; out['3']=n
n=base(C,'4','Your remittance details',100,550)
n['content']='<p>Your case reference: <strong>${networks_form_case_number}</strong></p><p>Please confirm the details below so we can match them to your remittance.</p>'
n['formfields']={'0':field('text','invoice_amount','Invoice Amount',1),'1':field('text','merchant_id_number','Merchant ID Number',2)}
n['buttons']={'0':btn('Submit','5',1)}; out['4']=n
n=base(S,'5','Build the confirmation email',100,700); n['continuation_node_id']='6'
n['content']='''// --- inputs -----------------------------------------------------------------
let caseNumber = ZT.getVariableValue("networks_form_case_number", "");
let invoiceAmount = String(ZT.getVariableValue("invoice_amount", "")).trim();
let merchantIdNumber = String(ZT.getVariableValue("merchant_id_number", "")).trim();

// The amount always shows in pounds: one leading pound sign, whatever the merchant typed
// (same rule as the Networks reply, Gemma Danks 26 Oct).
let invoiceAmountGbp = "\\u00a3" + invoiceAmount.replace(/^\\u00a3\\s*/, "");
const escapeHtml = value => String(value == null ? "" : value)
  .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
  .replace(/"/g, "&quot;").replace(/'/g, "&#39;");

// --- the email: sent to the merchant and logged on the existing case (relatedRecordId) ---
// DEMO COPY - not approved by Corpay yet.
let subject = "Your remittance details - case " + caseNumber;
let htmlBody = "<p>Hello,</p>"
  + "<p>Thank you, we have received your details:</p>"
  + "<p>Invoice Amount: " + escapeHtml(invoiceAmountGbp) + "<br>Merchant ID Number: " + escapeHtml(merchantIdNumber) + "</p>"
  + "<p>Our Networks team will review them and come back to you.</p>"
  + "<p>Kind regards,<br>Allstar Networks Support</p>";

// Same escaping as master node 36: the send Connected Object merges these into quoted JSON.
const jsonText = (value) => JSON.stringify(value == null ? "" : String(value)).slice(1, -1);

// --- outputs ----------------------------------------------------------------
ZT.setFormData("ai_email_from_address", "networksupport@allstarcard.co.uk");
ZT.setTransformData("ccAddresses", "[]");
ZT.setTransformData("email_body_json", jsonText(htmlBody));
ZT.setTransformData("email_subject_json", jsonText(subject));
'''
out['5']=n
n=base(D,'6','Send and log on the case',100,850); n['data_connected_objects']=copy.deepcopy(mn['38']['data_connected_objects']); n['continuation_node_id']='7'; out['6']=n
n=base(S,'7','Grade the send',100,1000); n['continuation_node_id']='8'
n['content']='''// --- inputs -----------------------------------------------------------------
let send = actions.send_email_simple_int;
let responseCode = send._zt_meta.response.code;

// --- grade: a 2xx carries the emailSimple result, anything else does not -------------
let emailSent = false;
if (responseCode >= 200 && responseCode < 300) {
  emailSent = send.value[0].isSuccess === true;
}

// --- outputs ----------------------------------------------------------------
ZT.setFormData("emailSent", emailSent ? "true" : "false");
'''
out['7']=n
n=base(R,'8','Sent?',100,1150); n['buttons']={'0':btn("emailSent == 'true'",'10',1,"emailSent == 'true'"),'1':btn('','11',2,'','def')}; n['advanced_logic_node']='1'; out['8']=n
n=base(CT,'9','Link not valid',400,550); n['content']='<p>This link is not valid any more. Please reply to our email with your Invoice Amount and Merchant ID Number.</p>'; out['9']=n
n=base(CT,'10','Thank you',100,1300); n['content']='<p>Thank you, your details have been sent to our Networks team. We have also emailed you a copy.</p>'; out['10']=n
n=base(CT,'11','Not sent',400,1300); n['content']='<p>Sorry, we could not send your details. Please reply to our email with your Invoice Amount and Merchant ID Number.</p>'; out['11']=n
n=base(CT,'48','claude.md',700,100)
n['content']='<p>claude.md - Networks reply form (demo), INT org 123.</p><p>Purpose: a merchant who was asked for the invoice amount and Merchant Number answers through this form instead of replying to the email, so the answer lands on the existing case (no threading needed). Fields per Charley Gunning 4 Nov: Case number (hidden), Invoice Amount, Merchant ID Number.</p><p>Link: https://eu.zingtree.com/show/&lt;tree id&gt;?sf_Id=&lt;Case Id&gt;. sf_Id is the only input.</p><p>Nodes: 1 get case (CO 10 sfdc_int__case_email_ai) -&gt; 2 found? -&gt; 3 router -&gt; 4 form -&gt; 5 build email -&gt; 6 send (CO 187 send_email_simple_int, relatedRecordId sf_Id, logEmailOnSend) -&gt; 7 grade -&gt; 8 router -&gt; 10 thanks / 11 failed. 9 link not valid.</p><p>Send CO 187 body reads by name: transforms.email_subject_json, transforms.email_body_json, transforms.ccAddresses (JSON text, [] here), ai_email_from_address, sf_Id, actions.sfdc_int__case_email_ai.records[0].SuppliedEmail - all set by nodes 1 / 5.</p><p>Open: no-reply sender (Alex / Gemma 5 Nov) needs a verified OrgWideEmailAddress from Corpay - sender is networksupport@ for the demo. Confirmation copy is demo text, not approved. PROD needs the get_case_details__prod / send_email_simple_prod remap.</p><p>2026-11-05: built for the 6 Nov demo.</p>'
out['48']=n
T['nodes']=out
json.dump(T,open('form_demo.json','w'),ensure_ascii=False,indent=1)
print(len(out),'nodes')
