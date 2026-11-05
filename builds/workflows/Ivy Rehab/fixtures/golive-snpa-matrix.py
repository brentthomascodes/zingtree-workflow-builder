import json, subprocess, os, sys
S=os.path.expanduser("~/mnt/Claude Cowork - Zingtree/.claude/skills/zingtree-workflow-builder/scripts/walk.mjs")
D=os.path.expanduser("~/mnt/Claude Cowork - Zingtree/Zingtree Builder/Workflow JSONs/Ivy Rehab/")
T=D+"Schedule New Patient Appointment (LIVE 2026-10-23).json"
ok=lambda rows:{"_zt_meta":{"response":{"code":200}},"insurance_list":rows}
SP=ok(["Aetna - MA (Medicare Advantage); ; Accepted","Aetna Better Health (NOT ACCEPTED)","Aetna Better Health; ; Not Accepted - All Other",
 "Aetna; 10001; Accepted","BCBS (Blue Cross Blue Shield) - Michigan - Federal; ; Managed","Cigna (Priority Health or HAP); ;Accepted",
 "Humana Gold; ; Not Accepted - Insurance","Medicaid; ; Not Accepted - Medicaid","Other; 10005; Accepted",
 "Medicaid plan not listed; ; Not Accepted - Medicaid;","Other insurance not listed; ; Not Accepted - All Other;","Priority Health (INN)"])
OLD=ok(["Aetna - Commercial","Wellcare"])
ERR={"_zt_meta":{"response":{"code":500,"body":"x"}}}
NOLIST={"_zt_meta":{"response":{"code":200}}}
def clinic(code): return {"clinic_raintree_code":code,"clinic_cost_code":code,"name":"Test "+code}
cases=[]
def add(name,qp,resp,inputs,buttons,expect,term):
    cases.append((name,{"tree_id":"227319134","query_params":qp,"connected_objects":{"35":"alias_35"},"actions":{"alias_35":resp},
      "form_inputs":inputs,"buttons":dict({"184":"Neither"},**buttons),"expect":{"form_data":expect,"terminal_node":term}}))
# SharePoint clinic, every dropdown option
spc=clinic("UT84737")
for sel,route,code,other,term in [
  ("Aetna","accepted","10001","Aetna","149"),("Aetna - MA (Medicare Advantage)","accepted","","Aetna - MA (Medicare Advantage)","149"),
  ("Cigna (Priority Health or HAP)","accepted","","Cigna (Priority Health or HAP)","149"),
  ("Aetna Better Health","not_accepted_other","","Aetna Better Health","3"),("Humana Gold","not_accepted_other","","Humana Gold","3"),
  ("Medicaid","not_accepted_medicaid","","Medicaid","34"),("BCBS (Blue Cross Blue Shield) - Michigan - Federal","managed","","BCBS (Blue Cross Blue Shield) - Michigan - Federal","34"),
  ("Medicaid plan not listed","not_accepted_medicaid","","Medicaid plan not listed","34"),("Other insurance not listed","not_accepted_other","","Other insurance not listed","3")]:
    add(f"SP {sel}",spc,SP,{"199":{"is_using_insurance":"Yes","insurance_selection":sel}},{"199":"Continue"},
        {"is_display_insurance_dropdown":"true","insurance_route":route,"patient_insurance_rt_code":code,"patient_insurance_other":other},term)
add("SP Other typed",spc,SP,{"199":{"is_using_insurance":"Yes","insurance_selection":"Other","patient_insurance_other":"Oscar Health"}},{"199":"Continue"},
    {"insurance_route":"accepted","patient_insurance_rt_code":"10005","patient_insurance_other":"Oscar Health"},"149")
add("SP No insurance",spc,SP,{"199":{"is_using_insurance":"No"}},{"199":"Continue"},{"insurance_route":"self_pay","patient_insurance_rt_code":""},"150")
# rollout clinic, SharePoint not converted -> static list
for code in ["NY181","ny181","ZZZ","VA764","NJ707"]:
    add(f"static {code} UHC",clinic(code),OLD,{"199":{"is_using_insurance":"Yes","insurance_selection":"UHC"}},{"199":"Continue"},
        {"is_display_insurance_dropdown":"true","insurance_route":"accepted","patient_insurance_rt_code":"10012","patient_insurance_other":"UHC"},"149")
add("static medicaid_not_listed",clinic("NY181"),OLD,{"199":{"is_using_insurance":"Yes","insurance_selection":"medicaid_not_listed"}},{"199":"Continue"},{"insurance_route":"not_accepted_medicaid","patient_insurance_rt_code":""},"34")
add("static other_not_listed",clinic("NY181"),OLD,{"199":{"is_using_insurance":"Yes","insurance_selection":"other_not_listed"}},{"199":"Continue"},{"insurance_route":"not_accepted_other"},"3")
add("static Other typed",clinic("NY181"),OLD,{"199":{"is_using_insurance":"Yes","insurance_selection":"Other","patient_insurance_other":"Oscar"}},{"199":"Continue"},{"patient_insurance_rt_code":"10005","patient_insurance_other":"Oscar"},"149")
add("rollout API 500",clinic("NY181"),ERR,{"199":{"is_using_insurance":"Yes","insurance_selection":"Aetna"}},{"199":"Continue"},{"is_display_insurance_dropdown":"true","patient_insurance_rt_code":"10001"},"149")
add("rollout 2xx no list",clinic("NC405"),NOLIST,{"199":{"is_using_insurance":"Yes","insurance_selection":"BCBS"}},{"199":"Continue"},{"patient_insurance_rt_code":"10003"},"149")
# non-rollout clinic, not converted -> status quo 119, every button
for btn,term in [("Insurance Accepted","149"),("Insurance Not Accepted","150"),("Medicaid Not Accepted","34"),("Private Pay","150")]:
    add(f"non-rollout 119 {btn}",clinic("PA101"),OLD,{},{"119":btn},{"is_display_insurance_dropdown":"false"},term)
add("non-rollout API 500",clinic("PA101"),ERR,{},{"119":"Insurance Accepted"},{"is_display_insurance_dropdown":"false"},"149")
add("no clinic code",{},ERR,{},{"119":"Private Pay"},{"is_display_insurance_dropdown":"false"},"150")
fails=0
for name,f in cases:
    p=f"fx_{abs(hash(name))}.json"; json.dump(f,open(p,"w"))
    r=subprocess.run(["node",S,T,p,"--start","31"],capture_output=True,text=True).stdout
    path=[l for l in r.splitlines() if l.startswith("path")]
    bad=[l.strip() for l in r.splitlines() if "FAIL" in l or "threw" in l]
    fails+=bool(bad)
    print(("FAIL " if bad else "pass ")+name.ljust(55), (path[0].split(":",1)[1].strip()[-60:] if path else ""), "; ".join(bad))
print(f"\n{len(cases)} cases, {fails} failing")
