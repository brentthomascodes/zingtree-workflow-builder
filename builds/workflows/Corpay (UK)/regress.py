import json,subprocess,glob,os,re,sys
S=os.path.expanduser("~/mnt/Claude Cowork - Zingtree/.claude/skills/zingtree-workflow-builder/scripts/walk.mjs")
M=[("sfdc_int__case_email_ai","get_case_details__prod"),("get_account_details__int","get_account_details__prod"),("get_incoming_email_addresses_int","get_incoming_email_addresses_prod"),("send_email_simple_int","send_email_simple_prod"),("automate_email_intent_int","automate_email_responses"),("automate_email_generation_int","automate_email_generation"),("automate_hc_email_intent_int","automate_hc_email_intent_prod"),("automate_hc_email_generation_int","automate_hc_email_generation_prod")]
before,after=sys.argv[1],sys.argv[2]
os.makedirs(os.path.expanduser('~/work/fx'),exist_ok=True)
def run(tree,fx,start):
    cmd=['node',S,tree,fx]+(['--start',start] if start else [])
    r=subprocess.run(cmd,capture_output=True,text=True,timeout=60)
    o=r.stdout+r.stderr
    end=re.findall(r'ends at node (\d+)',o); fails=len(re.findall(r'^\s*FAIL',o,re.M)); 
    last=re.findall(r'(?:end(?:ed)? (?:at|on) node|final node)[^\d]*(\d+)',o,re.I)
    return (('OK' if r.returncode==0 else 'FAIL'),fails,(last[-1] if last else '?'))
for f in sorted(glob.glob('fixtures/*.json')):
    s=open(f).read()
    for a,b in M: s=re.sub(r'\b'+a+r'\b',b,s)
    p=os.path.expanduser('~/work/fx/'+os.path.basename(f)); open(p,'w').write(s)
    start=None
    if 'feedback-return' in f: start='52'
    if 'session-expired' in f: start='35'
    rb=run(before,p,start); ra=run(after,p,start)
    flag='' if rb==ra else '  <-- DIFF'
    print(f"{os.path.basename(f)[:60]:60} before={rb} after={ra}{flag}")
