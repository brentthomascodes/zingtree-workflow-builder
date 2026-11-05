"""PROD release 2026-11-04: Networks queue (Charley Gunning, standup 4 Nov: green light, live today or
tomorrow AM; Gemma 2 Nov release plan: PROD Thu 5 Nov AM 'Networks queue & merchant request intent').
Usage: python3 build_prod.py <networks_prod_ai_action_id> <networks_prod_branch_tree_id>
 - 3 BRANCH - Networks PROD: the INT Networks branch (with today's banner), aliases remapped to PROD,
   AI node 93 -> the PROD Networks intent AI Action, PROD tree script (no links-in-new-tab block).
 - PROD master 417189428: node 8 Networks queue row + sender + label, router 10 -> 82, Tree node 82,
   Test Mode Networks mock route (47) and the 5 Networks scenarios (44 / 45). Nothing else from INT."""
import json,sys,re,copy
AI_ID=sys.argv[1] if len(sys.argv)>1 else 'NETWORKS_PROD_AI_ID'
BR_ID=sys.argv[2] if len(sys.argv)>2 else 'NETWORKS_PROD_BRANCH_ID'
D='2026-11-04'
P=json.load(open('0 MASTER PROD 417189428 (BEFORE baseline 2026-11-04).json',encoding='utf-8'))
I=json.load(open('0 MASTER INT 109029630 (networks banner scenario 2026-11-04).json',encoding='utf-8'))
N=json.load(open('3 BRANCH - Networks INT 547469427 (multi-intent banner 2026-11-04).json',encoding='utf-8'))
ALIAS=[('sfdc_int__case_email_ai','get_case_details__prod'),('get_account_details__int','get_account_details__prod'),
       ('get_incoming_email_addresses_int','get_incoming_email_addresses_prod'),('send_email_simple_int','send_email_simple_prod'),
       ('automate_networks_email_intent_int','automate_networks_email_intent_prod')]
def remap(s):
    for a,b in ALIAS: s=re.sub(r'\b'+a+r'\b',b,s)
    return s
# --- branch
B=copy.deepcopy(N)
B['id']='0'; B['name']='3 BRANCH - Networks PROD'; B['script_code']=P['script_code']
for k,n in B['nodes'].items():
    for f in ('content','page_title','node_name'):
        if isinstance(n.get(f),str): n[f]=remap(n[f])
    for b in (n.get('buttons') or {}).values():
        for f in ('logic_expression','button_text'):
            if isinstance(b.get(f),str): b[f]=remap(b[f])
co=B['nodes']['5']['data_connected_objects']['0']; assert co['data_connected_object_id']=='20'; co['data_connected_object_id']='21'
assert B['nodes']['93']['ai_action_id']=='23'; B['nodes']['93']['ai_action_id']=str(AI_ID)
assert B['nodes']['93']['config']=='{"mode":"api","instruction":""}'
B['nodes']['48']['content']+='<p>'+D+': PROD release. Copied from INT 547469427 (multi-intent banner 2026-11-04); aliases remapped to PROD (get_case_details__prod, get_account_details__prod CO 21, automate_networks_email_intent_prod AI '+str(AI_ID)+'); PROD tree script; node map aliases above read PROD.</p>'
# --- master
M=copy.deepcopy(P); mn=M['nodes']; inn=I['nodes']
c=mn['8']['content']
for a,b in (('  Allstar_Chargepass: "homecharge"\n','  Allstar_Chargepass: "homecharge",\n  Networks_General: "networks"   // queue id 00G4L000000efCT (Networks AI tree setup, 16 Oct)\n'),
            ('  homecharge: "homecharge.support@allstarcard.co.uk"\n','  homecharge: "homecharge.support@allstarcard.co.uk",\n  networks: "networksupport@allstarcard.co.uk"   // Gemma Danks, 19 Oct\n'),
            ('  homecharge: "Allstar Homecharge / Chargepass"\n','  homecharge: "Allstar Homecharge / Chargepass",\n  networks: "Allstar / Networks"\n')):
    assert c.count(a)==1,a; c=c.replace(a,b)
mn['8']['content']=c
assert remap(inn['8']['content'])==c.replace('send_email_simple_prod reads','send_email_simple_prod reads'), 'node 8 != INT (remapped)'
# router 10: INT's buttons (adds queue_route == "networks" -> 82)
b10=copy.deepcopy(inn['10']['buttons']); mn['10']['buttons']=b10
assert [x['button_link'] for x in b10.values()]==['80','81','82','11']
mn['82']=copy.deepcopy(inn['82']); mn['82']['open_tree_id']=str(BR_ID); mn['82']['page_title']='Networks branch'
# Test Mode: Networks mock route in 47, Networks scenarios in 44 / 45
c=mn['47']['content']
for a,b in (('// The scenario key carries it: test_hc_ scenarios mock a Homecharge case, everything else a\n// FAST Admin one. Node 8 then resolves queue_route from the mocked queue exactly as it\n',
             '// The scenario key carries it: test_hc_ scenarios mock a Homecharge case, test_networks_ a\n// Networks case, everything else a FAST Admin one. Node 8 then resolves queue_route from the mocked queue exactly as it\n'),
            ('let route = test_intent.indexOf("test_hc_") === 0 ? "homecharge" : "fast_admin";\n',
             'let route = test_intent.indexOf("test_hc_") === 0 ? "homecharge"\n  : (test_intent.indexOf("test_networks_") === 0 ? "networks" : "fast_admin");\n'),
            ('  homecharge: {\n','  networks: {\n    queue: "Networks_General", caseNumber: "02716248",\n    suppliedEmail: "test.merchant@example.co.uk",\n    toAddress: "networks@allstarcard.co.uk",\n    ccAddress: null,\n    accountAdmin: "SME Unmanaged", contactId: null\n  },\n  homecharge: {\n'),
            ('      Account_Segment__c: "SME", AS_Account_Administrator__c: mockCase.accountAdmin }]\n',
             '      Account_Segment__c: test_intent === "test_networks_merchant_ineligible" ? "Corporate" : "SME", AS_Account_Administrator__c: mockCase.accountAdmin }]\n')):
    assert c.count(a)==1,a[:60]; c=c.replace(a,b)
mn['47']['content']=c
NW=['test_networks_remittance_copy','test_networks_remittance_plus_other','test_networks_remittance_wrong','test_networks_merchant_ineligible','test_networks_other_out_of_scope']
ff=mn['44']['formfields']['0']; opts=ff['options'].split('\n'); io=inn['44']['formfields']['0']['options'].split('\n')
# keep PROD order, insert the Networks keys where INT has them (before the first HC key)
first_hc=next(i for i,x in enumerate(opts) if x.startswith('test_hc_'))
opts=opts[:first_hc]+[x for x in io if x in NW]+opts[first_hc:]; ff['options']='\n'.join(opts)
assert all(x in opts for x in NW)
c=mn['45']['content']; ic=inn['45']['content']
blocks=''
for k in [x for x in io if x in NW]:
    m=re.search(r'  '+k+r': \{\n(?:    .*\n)*?  \},\n',ic); assert m,k; blocks+=m.group(0)
a='  test_hc_other_out_of_scope: {'
assert c.count(a)==1; c=c.replace(a,blocks+a); mn['45']['content']=c
c=mn['48']['content']; assert c.endswith('</pre>')
mn['48']['content']=c[:-6]+'\n'+D+': PROD release - Networks queue: node 8 Networks_General -> networks (sender networksupport@allstarcard.co.uk), router 10 -> Tree 82 -> 3 BRANCH - Networks PROD ('+str(BR_ID)+'), Test Mode Networks route (47) + 5 scenarios (44 / 45). Includes the Networks multi-intent banner.</pre>'
json.dump(B,open('3 BRANCH - Networks PROD (release 2026-11-04).json','w',encoding='utf-8'),ensure_ascii=False,indent=1)
json.dump(M,open('0 MASTER PROD 417189428 (networks release 2026-11-04).json','w',encoding='utf-8'),ensure_ascii=False,indent=1)
print('built AI',AI_ID,'branch',BR_ID)
