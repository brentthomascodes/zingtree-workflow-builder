"""PROD release 2026-10-21: master split (FAST + Homecharge branches) + Ecopoint / EPT / Zero Liability.
Held from INT (not approved for PROD): Networks route/branch, links-in-new-tab tree script,
RDD sentiment Test Mode scenarios. Card Group/Moves Topic keeps the live PROD value "Online"."""
import json,sys,re
FAST_ID=sys.argv[1] if len(sys.argv)>1 else 'FAST_PROD_ID'
HC_ID=sys.argv[2] if len(sys.argv)>2 else 'HC_PROD_ID'
P=json.load(open('Email Automation - AI Actions Prod 417189428 (BEFORE baseline 2026-10-21).json',encoding='utf-8'))
M=json.load(open('_m_promoted.json',encoding='utf-8'))
F=json.load(open('_f_promoted.json',encoding='utf-8'))
H=json.load(open('_h_promoted.json',encoding='utf-8'))
LINE='2026-10-21: PROD release (master split: FAST Admin + Homecharge branches; Ecopoint / Extended Payment Terms / Zero Liability). Not in PROD: Networks route + branch, links-in-new-tab script, RDD sentiment scenarios.'
def changelog(n):
    c=n['content']; assert c.endswith('</pre>'); n['content']=c[:-6]+'\n'+LINE+'</pre>'
# --- every tree: PROD tree script (no links-in-new-tab block)
for t in (M,F,H): t['script_code']=P['script_code']
# --- master
mn=M['nodes']
mn['8']['content']=P['nodes']['8']['content']                      # no Networks queue row / sender
b=mn['10']['buttons']; assert b['2']['button_link']=='82'
nb={'0':b['0'],'1':b['1'],'2':dict(b['3'],rank='3')}; mn['10']['buttons']=nb
del mn['82']
assert not any(x.get('button_link')=='82' for n in mn.values() for x in (n.get('buttons') or {}).values() if isinstance(x,dict))
assert all(n.get('continuation_node_id')!='82' for n in mn.values())
mn['80']['open_tree_id']=FAST_ID; mn['81']['open_tree_id']=HC_ID
mn['47']['content']=P['nodes']['47']['content']                    # no Networks mock route
# Test Mode picker + emails: PROD set + the six fee scenarios
DROP=['test_fast_admin_rdd_frustrated','test_fast_admin_rdd_complaint','test_networks_remittance_copy','test_networks_remittance_wrong','test_networks_other_out_of_scope','test_networks_merchant_ineligible']
ff=mn['44']['formfields']['0']; ff['options']='\n'.join(x for x in ff['options'].split('\n') if x not in DROP)
c=mn['45']['content']
for k in DROP:
    m=re.search(r'\n  '+k+r': \{\n(?:    .*\n)*?  \},?',c); assert m,k
    c=c[:m.start()]+c[m.end():]
mn['45']['content']=c
changelog(mn['48'])
M['description']=P['description']
# --- branches
for t,name,tid in ((F,'1 BRANCH - FAST Admin PROD',None),(H,'2 BRANCH - Homecharge PROD',None)):
    t['id']='0'; t['name']=name
    changelog(t['nodes']['48'])
assert 'topic: "Online", subtopic: "Card Group/Moves"' in F['nodes']['17']['content']
for t,f in ((M,'0 MASTER - Email Automation - AI Actions Prod 417189428 (release 2026-10-21).json'),(F,'1 BRANCH - FAST Admin PROD (release 2026-10-21).json'),(H,'2 BRANCH - Homecharge PROD (release 2026-10-21).json')):
    json.dump(t,open(f,'w',encoding='utf-8'),ensure_ascii=False,indent=1)
print('built',FAST_ID,HC_ID)
