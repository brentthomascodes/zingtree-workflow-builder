# PROD parity: fixtures remapped INT->PROD aliases, run on stitched PROD master + FAST / HC branches, before vs after.
import json, subprocess, glob, os, re, sys, copy
S = os.path.expanduser("~/mnt/Claude Cowork - Zingtree/.claude/skills/zingtree-workflow-builder/scripts/walk.mjs")
M=[("sfdc_int__case_email_ai","get_case_details__prod"),("get_account_details__int","get_account_details__prod"),("get_incoming_email_addresses_int","get_incoming_email_addresses_prod"),("send_email_simple_int","send_email_simple_prod"),("automate_email_intent_int","automate_email_responses"),("automate_email_generation_int","automate_email_generation"),("automate_hc_email_intent_int","automate_hc_email_intent_prod"),("automate_hc_email_generation_int","automate_hc_email_generation_prod")]
mb, fb, hb, ma = sys.argv[1:5]
W = os.path.expanduser("~/work/pst"); os.makedirs(W, exist_ok=True)
def stitch(master, branch, tn, out):
    m = json.load(open(master)); b = json.load(open(branch)); s = copy.deepcopy(m)
    for k, n in b["nodes"].items():
        if k not in s["nodes"]: s["nodes"][k] = copy.deepcopy(n)
    s["nodes"][tn]["continuation_node_id"] = "3"; s["nodes"]["79"]["continuation_node_id"] = "100"; s["nodes"]["3"]["is_root"] = "0"
    json.dump(s, open(out, "w"))
P = {}
for tag, m in {"b": mb, "a": ma}.items():
    for r, (br, tn) in {"fast": (fb, "80"), "hc": (hb, "81")}.items():
        p = f"{W}/{tag}_{r}.json"; stitch(m, br, tn, p); P[(tag, r)] = p
def run(tree, fxp, start):
    r = subprocess.run(["node", S, tree, fxp] + (["--start", start] if start else []), capture_output=True, text=True, timeout=60)
    o = r.stdout + r.stderr; e = re.findall(r"ends at node (\d+)", o)
    return ("PASS" if r.returncode == 0 else "FAIL", e[-1] if e else "?")
for f in sorted(glob.glob("fixtures/*.json")):
    s = open(f).read()
    if "Networks" in s: continue
    for a, b in M: s = re.sub(r"\b" + a + r"\b", b, s)
    p = f"{W}/{os.path.basename(f)}"; open(p, "w").write(s)
    r = "hc" if ("Chargepass" in s or "test_hc_" in s or "Homecharge" in s or "hc-" in f) else "fast"
    start = "52" if "feedback-return" in f else ("35" if "session-expired" in f else None)
    b = run(P[("b", r)], p, start); a = run(P[("a", r)], p, start)
    print(f"{'SAME' if b==a else 'DIFF'} {r:4} {os.path.basename(f)[:58]:58} before={b} after={a}")
