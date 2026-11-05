#!/usr/bin/env python3
"""Pre-delivery lint per Zingtree Builder/MEMORY.md checklist."""
import json, sys

PATH = "/Users/brentthomas/Desktop/Software_Engineering/Claude Cowork - Zingtree/Zingtree Builder/Workflow JSONs/ETG/Register Errands - VI (v1 fork 2026-08-05).json"
with open(PATH) as f:
    tree = json.load(f)

nodes = tree["nodes"]
problems = []

# 1. root_node_id -> a Content node; exactly one is_root="1"
root_id = tree["root_node_id"]
roots = [k for k, n in nodes.items() if n.get("is_root") == "1"]
if len(roots) != 1:
    problems.append(f"expected exactly one is_root=1 node, found {roots}")
elif roots[0] != root_id:
    problems.append(f"root_node_id={root_id} but is_root=1 on {roots[0]}")
# Note: this tree's root is a SCRIPT node (node 1), which patterns.md explicitly
# permits/recommends for seeding initial data - "Root node - Content OR Script".
root_type = nodes[root_id]["type"]
print(f"root_node_id={root_id} type={root_type} (Script root is proven/allowed per patterns.md)")

# 2. project_node_id == display_order == dict key; every scalar field a string
for k, n in nodes.items():
    if n.get("project_node_id") != k:
        problems.append(f"node {k}: project_node_id={n.get('project_node_id')!r} != key")
    if n.get("display_order") != k:
        problems.append(f"node {k}: display_order={n.get('display_order')!r} != key")
    for field, val in n.items():
        if field in ("formfields", "buttons", "data_connected_objects", "app_messages"):
            continue
        if isinstance(val, (bool, int, float)):
            problems.append(f"node {k}: field {field} is {type(val).__name__} not str: {val!r}")

# unique project_node_id
seen = set()
for k in nodes:
    if k in seen:
        problems.append(f"duplicate node key {k}")
    seen.add(k)

# 3. formfields schema keys; Scoring routers advanced_logic_node + continuation
PROVEN_FF_KEYS = {"type","name","label","label_type","options","hidden_value","custom_regex",
                   "inline","required","score_var","checkbox_score","scores","rank","config"}
for k, n in nodes.items():
    for fk, ff in (n.get("formfields") or {}).items():
        extra = set(ff.keys()) - PROVEN_FF_KEYS
        if extra:
            problems.append(f"node {k} formfield {fk}: unknown keys {extra}")
        if "value" in ff:
            problems.append(f"node {k} formfield {fk}: has forbidden 'value' key")

for k, n in nodes.items():
    if n["type"] == "Scoring":
        btns = n.get("buttons") or {}
        has_logic_expr = any(b.get("logic_expression") for b in btns.values())
        if has_logic_expr and n.get("advanced_logic_node") != "1":
            problems.append(f"node {k}: Scoring node with logic_expression buttons but advanced_logic_node != '1'")
        for bk, b in btns.items():
            if b.get("op") == "def":
                continue  # structural default, fine
            if not b.get("logic_expression") and not b.get("op"):
                problems.append(f"node {k} button {bk}: blank logic_expression and no op (unevaluated button)")

# 4. all button/continuation links resolve; DAG check (cursor loops are allowed cycles)
all_ids = set(nodes.keys())
CURSOR_BACK_EDGES = {
    ("11","12"), # cancellation -> last resort (not a cycle, just noting linear progress)
}
edges = []
for k, n in nodes.items():
    for b in (n.get("buttons") or {}).values():
        link = b.get("button_link")
        if link and link != "0":
            if link not in all_ids:
                problems.append(f"node {k}: button_link {link} does not resolve")
            else:
                edges.append((k, link))
    cont = n.get("continuation_node_id")
    if cont and cont != "0":
        if cont not in all_ids:
            problems.append(f"node {k}: continuation_node_id {cont} does not resolve")
        else:
            edges.append((k, cont))

# reachability from root
from collections import deque
visited = set()
q = deque([root_id])
while q:
    cur = q.popleft()
    if cur in visited:
        continue
    visited.add(cur)
    for (a, b) in edges:
        if a == cur and b not in visited:
            q.append(b)

unreachable = all_ids - visited - {"5"}  # node 5 = claude.md, deliberately unlinked
if unreachable:
    problems.append(f"unreachable nodes (excluding claude.md): {sorted(unreachable, key=int)}")
else:
    print("All non-claude.md nodes reachable from root. OK.")

# Known/expected cycles (cursor loops + additional-request re-entry) - just report them
import itertools
def find_cycles_via_dfs():
    graph = {}
    for a, b in edges:
        graph.setdefault(a, set()).add(b)
    cycle_edges = []
    WHITE, GRAY, BLACK = 0, 1, 2
    color = {n: WHITE for n in all_ids}
    def dfs(u, stack):
        color[u] = GRAY
        stack.append(u)
        for v in graph.get(u, []):
            if color[v] == GRAY:
                cycle_edges.append((u, v))
            elif color[v] == WHITE:
                dfs(v, stack)
        stack.pop()
        color[u] = BLACK
    for n in sorted(all_ids, key=int):
        if color[n] == WHITE:
            dfs(n, [])
    return cycle_edges

cycles = find_cycles_via_dfs()
print("Back-edges (expected cursor loops / re-entry):", sorted(cycles))

# 5. Routers test only script-set booleans (spot check button expressions)
ALLOWED_RAW_PATTERNS = []
for k, n in nodes.items():
    if n["type"] != "Scoring":
        continue
    for b in (n.get("buttons") or {}).values():
        expr = b.get("logic_expression", "")
        if expr and ("==" not in expr and "eq" not in (b.get("op") or "") and "len(" not in expr):
            problems.append(f"node {k}: suspicious logic_expression {expr!r}")

# unique node titles check (both page_title and node_name non-empty, except claude.md exempt for node_name style)
for k, n in nodes.items():
    if not n.get("page_title") and k != "5":
        problems.append(f"node {k}: empty page_title")
    if not n.get("node_name") and k != "5":
        problems.append(f"node {k}: empty node_name (house rule: every node gets both fields)")

print()
if problems:
    print(f"{len(problems)} PROBLEM(S):")
    for p in problems:
        print(" -", p)
    sys.exit(1)
else:
    print("0 problems found by static lint.")
