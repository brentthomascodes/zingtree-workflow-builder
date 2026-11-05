import json, subprocess, os
S=os.path.expanduser("~/mnt/Claude Cowork - Zingtree/.claude/skills/zingtree-workflow-builder/scripts/walk.mjs")
D=os.path.expanduser("~/mnt/Claude Cowork - Zingtree/Zingtree Builder/Workflow JSONs/Ivy Rehab/")
T=D+"Insurance Inquiry (LIVE 2026-10-23).json"
def L(x): return list(x.values()) if isinstance(x,dict) else (x or [])
N=json.load(open(T))['nodes']
# reachability from node 1 (Incoming Call opens here) and scoring nodes without a default
def nxt(k):
    n=N[k]; o={str(b.get('button_link')) for b in L(n.get('buttons'))}|{str(n.get('continuation_node_id') or '0')}
    return {x for x in o if x in N}
seen={'1'}; st=['1']
while st:
    k=st.pop()
    for x in nxt(k):
        if x not in seen: seen.add(x); st.append(x)
print("reachable from 1:", sorted(seen,key=int))
for k in seen:
    n=N[k]
    if n['type']=='Scoring' and not any(b.get('op')=='def' or not b.get('logic_expression') for b in L(n.get('buttons'))):
        print("  scoring without default (shows 'No rules were found' when nothing matches):",k,n.get('page_title'))
ok=lambda rows:{"_zt_meta":{"response":{"code":200}},"insurance_list":rows}
SP=ok(["Aetna; 10001; Accepted","Humana Gold; ; Not Accepted - Insurance","Aetna Better Health; ; Not Accepted - All Other","Medicaid; ; Not Accepted - Medicaid",
       "BCBS - Federal; ; Managed","Other; 10005; Accepted","Medicaid plan not listed; ; Not Accepted - Medicaid;","Other insurance not listed; ; Not Accepted - All Other;","Priority Health (INN)"])
OLD=ok(["Aetna - Commercial"]); ERR={"_zt_meta":{"response":{"code":500,"body":"x"}}}
cases=[]
def add(name,qp,resp,sel,expect,term,btn43="Insurance"):
    f={"tree_id":"718637140","query_params":qp,"connected_objects":{"35":"alias_35"},"actions":{"alias_35":resp},
       "form_inputs":{"45":{"insurance_selection":sel}} if sel is not None else {},"buttons":{"43":btn43,"45":"Continue"},
       "expect":{"form_data":expect,"terminal_node":term}}
    cases.append((name,f))
sp={"clinic_cost_code":"UT84737","clinic_raintree_code":"UT84737"}; ny={"clinic_cost_code":"NY181","clinic_raintree_code":"NY181"}
for sel,route,code,term in [("Aetna","accepted","10001","48"),("Humana Gold","not_accepted_other","","9"),("Aetna Better Health","not_accepted_other","","9"),
    ("Medicaid","not_accepted_medicaid","","17"),("BCBS - Federal","managed","","17"),("Other","accepted","10005","48"),
    ("Medicaid plan not listed","not_accepted_medicaid","","17"),("Other insurance not listed","not_accepted_other","","9")]:
    add("SP "+sel,sp,SP,sel,{"insurance_route":route,"patient_insurance_rt_code":code,"new_cost_code":"UT84737"},term)
add("static UHC",ny,OLD,"UHC",{"insurance_route":"accepted","patient_insurance_rt_code":"10012"},"48")
add("static other_not_listed",ny,OLD,"other_not_listed",{"insurance_route":"not_accepted_other"},"9")
add("static medicaid_not_listed",ny,OLD,"medicaid_not_listed",{"insurance_route":"not_accepted_medicaid"},"17")
add("API 500 -> static Aetna",sp,ERR,"Aetna",{"insurance_route":"accepted","patient_insurance_rt_code":"10001"},"48")
add("nothing picked -> self pay",sp,SP,"",{"insurance_route":"self_pay"},"47")
fails=0
for name,f in cases:
    p=f"ii_{abs(hash(name))}.json"; json.dump(f,open(p,"w"))
    r=subprocess.run(["node",S,T,p,"--start","43"],capture_output=True,text=True).stdout
    path=[l for l in r.splitlines() if l.startswith("path")]
    bad=[l.strip() for l in r.splitlines() if "FAIL" in l or "threw" in l]
    fails+=bool(bad)
    print(("FAIL " if bad else "pass ")+name.ljust(32), (path[0].split(":",1)[1].strip() if path else ""), "; ".join(bad))
print(f"\n{len(cases)} cases, {fails} failing")
