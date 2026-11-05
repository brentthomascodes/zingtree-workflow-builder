# Parity: every fixture in fixtures/ against BEFORE vs AFTER master+branch stitches. Branch picked from
# the fixture's queue (FAST_Admin -> 80/FAST, Allstar_Chargepass/Homecharge -> 81/HC, Networks -> 82).
import json, subprocess, glob, os, re, sys, copy
S = os.path.expanduser("~/mnt/Claude Cowork - Zingtree/.claude/skills/zingtree-workflow-builder/scripts/walk.mjs")
mb, fb, hb, nb, ma, fa, ha, na = sys.argv[1:9]
os.makedirs(os.path.expanduser("~/work/st"), exist_ok=True)
def stitch(master, branch, tree_node, out):
    m = json.load(open(master)); b = json.load(open(branch)); s = copy.deepcopy(m)
    for k, n in b["nodes"].items():
        if k not in s["nodes"]: s["nodes"][k] = copy.deepcopy(n)
    s["nodes"][tree_node]["continuation_node_id"] = "3"; s["nodes"]["79"]["continuation_node_id"] = "100"; s["nodes"]["3"]["is_root"] = "0"
    json.dump(s, open(out, "w"))
P = {}
for tag, (m, f, h, n) in {"b": (mb, fb, hb, nb), "a": (ma, fa, ha, na)}.items():
    for r, (br, tn) in {"fast": (f, "80"), "hc": (h, "81")}.items():
        p = os.path.expanduser(f"~/work/st/{tag}_{r}.json"); stitch(m, br, tn, p); P[(tag, r)] = p
def route(fx):
    s = json.dumps(fx)
    if "Networks" in s: return "nw"
    if "Chargepass" in s or "test_hc_" in s or "Homecharge" in s or "hc-" in s: return "hc"
    return "fast"
def run(tree, fxp, start):
    r = subprocess.run(["node", S, tree, fxp] + (["--start", start] if start else []), capture_output=True, text=True, timeout=60)
    o = r.stdout + r.stderr; e = re.findall(r"ends at node (\d+)", o)
    return ("PASS" if r.returncode == 0 else "FAIL", e[-1] if e else "?", (re.findall(r"FAIL.*", o) or [""])[0][:120])
for f in sorted(glob.glob(sys.argv[9]+"/*.json")):
    fx = json.load(open(f)); r = route(fx)
    start = "52" if "feedback-return" in f else ("35" if "session-expired" in f else None)
    b = run(P[("b", r)], f, start); a = run(P[("a", r)], f, start)
    print(f"{'SAME' if b[:2]==a[:2] else 'DIFF'} {r:4} {os.path.basename(f)[:58]:58} before={b[0]}/{b[1]} after={a[0]}/{a[1]} {a[2] if a!=b else ''}")
