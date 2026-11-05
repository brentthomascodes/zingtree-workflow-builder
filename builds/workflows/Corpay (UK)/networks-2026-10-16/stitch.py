# Stitch the master + one branch into one graph for walk.mjs: master Tree node -> branch root 3,
# branch Tree node 79 -> master 100. Master nodes win on id clashes (only claude.md 48).
import json, sys, copy
master, branch, tree_node, out = sys.argv[1:5]
m = json.load(open(master)); b = json.load(open(branch))
s = copy.deepcopy(m)
for k, n in b["nodes"].items():
    if k in s["nodes"]:
        continue
    s["nodes"][k] = copy.deepcopy(n)
s["nodes"][tree_node]["continuation_node_id"] = "3"
s["nodes"]["79"]["continuation_node_id"] = "100"
s["nodes"]["3"]["is_root"] = "0"
json.dump(s, open(out, "w"))
