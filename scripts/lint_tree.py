#!/usr/bin/env python3
"""Lint a Zingtree tree export before delivery.

    python3 scripts/lint_tree.py <tree.json> [--strict]

Two groups of checks, each traced to a real failure or a house rule:

  import safety  - things that make Zingtree reject or mis-load the file
  house standard - graph shape (patterns.md) and script standard (01-scripting-standards.md)

Errors exit non-zero. Warnings are printed and, with --strict, also exit non-zero.
Everything this lint cannot see is listed at the end - say it in the delivery note.
"""
import json
import re
import shutil
import subprocess
import sys
import tempfile
from collections import Counter, defaultdict

PROVEN_FORMFIELD_KEYS = {
    "type", "name", "label", "label_type", "options", "hidden_value", "custom_regex", "inline",
    "required", "score_var", "checkbox_score", "scores", "rank", "config",
}
BASELINE_CSS = "https://assets.zingtree.com/managed/templates/zingtree_2026.css"

BANNED_TOKENS = [
    (r"\bZT\.log\s*\(", "ZT.log - no logging (house rule, Sep 2026)"),
    (r"\bconsole\.log\s*\(", "console.log - no logging"),
    (r"^\s*var\s+", "var - use let/const"),
    (r"\btypeof\s+", "typeof guard - trust the engine"),
    (r"\btry\s*\{", "try/catch - no defensive parsing"),
    (r"\bparseInt\s*\(", "parseInt - use Number()"),
    (r"\bArray\.isArray\s*\(", "Array.isArray ladder"),
    (r"\.trim\(\)\.toLowerCase\(\)", "reflexive normalization"),
    (r"\bfunction\s+(g|set|esc|escapeHtml|firstOf|logWrite|logArm|logFlush|logClean)\s*\(", "retired helper redefined per node"),
    (r"getVariableValue\([^)]*\)\s*\|\|", "fallback chain on getVariableValue - one call, one default"),
    (r"\bthis\.(transforms|actions|views)\b", "reading through `this`"),
    (r"JSON\.stringify\([^)]*\)\.slice\(1,\s*-1\)", "quote-strip hack - build the whole payload and stringify once"),
]
CONST_BLOCK = re.compile(r"^\s*const\s+[A-Z][A-Z0-9_]{2,}\s*=", re.M)
UUID = re.compile(r"[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}", re.I)
FIELD_ID = re.compile(r"custom_field_\d+")
COMMENT_HISTORY = re.compile(r"(//|/\*|\*).*(\b20\d\d-\d\d-\d\d\b|\bv\d{1,3}(\.\d)?\b|\bFIX\b|\bSIMPLIFIED\b|previously|used to)", re.I)
WRITE = re.compile(r"ZT\.set(Form|Transform)Data\(\s*[\"']([A-Za-z0-9_]+)[\"']")
READ_GV = re.compile(r"getVariableValue\(\s*[\"']([A-Za-z0-9_]+)[\"']")
DUP_WINDOW = 8


class Lint:
    def __init__(self):
        self.errors, self.warnings = [], []

    def err(self, msg): self.errors.append(msg)
    def warn(self, msg): self.warnings.append(msg)


def as_list(v):
    """Exports store formfields/buttons as a list or as an index-keyed dict; normalize."""
    if isinstance(v, dict):
        return list(v.values())
    return list(v or [])


def scalars_are_strings(node):
    bad = []
    for k, v in node.items():
        if isinstance(v, (bool, int, float)):
            bad.append(k)
    return bad


def script_reads_everywhere(tree):
    """Every variable name read anywhere in the tree: scripts, merge fields, logic, field configs."""
    reads = set()
    # Raw node content (script bodies, HTML) plus the JSON-encoded rest (button expressions, field configs).
    blob = "\n".join(str(n.get("content") or "") for n in tree.get("nodes", {}).values()) + "\n" + json.dumps(tree)
    reads.update(READ_GV.findall(blob))
    reads.update(re.findall(r"\$\{\s*(?:transforms\.)?([A-Za-z0-9_]+)", blob))
    reads.update(re.findall(r"#([A-Za-z0-9_]+)#", blob))
    reads.update(re.findall(r"transforms\.([A-Za-z0-9_]+)", blob))
    reads.update(re.findall(r'\\?"variable\\?":\s*\\?"([A-Za-z0-9_]+)\\?"', blob))   # conditional / dynamic-select config
    reads.update(re.findall(r"\b([A-Za-z_][A-Za-z0-9_]*)\s*==", blob))             # logic expressions
    for n in tree.get("nodes", {}).values():                                        # bare / complex router expressions
        for b in as_list(n.get("buttons")):
            reads.update(re.findall(r"[A-Za-z_][A-Za-z0-9_]*", b.get("logic_expression") or ""))
    return reads


def lint(tree, strict=False):
    L = Lint()
    nodes = tree.get("nodes", {})
    if not isinstance(nodes, dict) or not nodes:
        L.err("no `nodes` dict - is this a bare project object? (multi-project exports and {projects:[...]} do not import)")
        return L
    ids = sorted(nodes, key=int)

    # --- import safety ------------------------------------------------------------
    roots = [k for k, n in nodes.items() if str(n.get("is_root")) == "1"]
    if len(roots) != 1:
        L.err(f"expected exactly one is_root='1', found {roots}")
    elif str(tree.get("root_node_id")) != roots[0]:
        L.err(f"root_node_id {tree.get('root_node_id')} != is_root node {roots[0]}")

    for k in ids:
        n = nodes[k]
        if str(n.get("project_node_id")) != k or str(n.get("display_order")) != k:
            L.err(f"node {k}: project_node_id/display_order must equal the key (got {n.get('project_node_id')}/{n.get('display_order')})")
        bad = scalars_are_strings(n)
        if bad:
            L.err(f"node {k}: non-string scalars {bad} - every scalar field must be a string")
        for f in as_list(n.get("formfields")):
            extra = set(f) - PROVEN_FORMFIELD_KEYS
            if extra:
                L.err(f"node {k}: formfield '{f.get('name')}' has unproven keys {sorted(extra)} (use hidden_value, never value)")
        for b in as_list(n.get("buttons")):
            link = str(b.get("button_link", ""))
            if link and link != "0" and link not in nodes:
                L.err(f"node {k}: button '{b.get('button_text')}' links to missing node {link}")
        cont = str(n.get("continuation_node_id", "0"))
        if cont not in ("", "0") and cont not in nodes:
            L.err(f"node {k}: continuation_node_id {cont} does not exist")
        if n.get("type") == "Scoring":
            has_logic = any(b.get("logic_expression") for b in as_list(n.get("buttons")))
            if has_logic and str(n.get("advanced_logic_node")) != "1":
                L.err(f"node {k}: Scoring node with logic_expression buttons needs advanced_logic_node='1'")

    pv = tree.get("predefined_vars")
    if isinstance(pv, dict) and pv:
        keys = sorted(int(x) for x in pv)
        if keys != list(range(len(keys))):
            L.err(f"predefined_vars keys are not contiguous 0..n-1: {keys} (import fails with no usable error)")
        for entry in pv.values():
            if isinstance(entry, dict) and isinstance(entry.get("project_id"), str):
                L.warn("predefined_vars entry has a string project_id - keep it a number")

    # --- graph ---------------------------------------------------------------------
    root = roots[0] if roots else ids[0]
    reachable, stack = set(), [root]
    while stack:
        cur = stack.pop()
        if cur in reachable or cur not in nodes:
            continue
        reachable.add(cur)
        n = nodes[cur]
        for b in as_list(n.get("buttons")):
            stack.append(str(b.get("button_link")))
        stack.append(str(n.get("continuation_node_id", "0")))
    for k in ids:
        title = (nodes[k].get("page_title") or nodes[k].get("node_name") or "").strip().lower()
        if k not in reachable and title != "claude.md":
            L.warn(f"node {k} ('{nodes[k].get('page_title')}') is unreachable from the root")
    if not any((n.get("page_title") or "").strip().lower() == "claude.md" for n in nodes.values()):
        L.warn("no claude.md node - every tree carries its own memory node")

    gaps = sorted(set(range(int(ids[0]), int(ids[-1]) + 1)) - set(int(x) for x in ids))
    if gaps:
        L.warn(f"node id gaps {gaps[:12]}{'...' if len(gaps) > 12 else ''} - ids should be sequential, lowest available")

    untitled = [k for k in ids if not (nodes[k].get("page_title") or "").strip()]
    unnamed = [k for k in ids if not (nodes[k].get("node_name") or "").strip()]
    if untitled:
        L.warn(f"{len(untitled)} node(s) with an empty page_title: {untitled}")
    if unnamed:
        L.warn(f"{len(unnamed)} node(s) with an empty node_name (both title and name must read like a story): {unnamed}")

    co_nodes = defaultdict(list)
    for k in ids:
        for co in as_list(nodes[k].get("data_connected_objects")):
            co_nodes[str(co.get("data_connected_object_id"))].append(k)
    for co, where in co_nodes.items():
        if len(where) > 1:
            L.err(f"Connected Object {co} sits on nodes {where} - one request, one node")

    # same type back to back. Scoring->Scoring and Script->Script always; Content->Content only
    # when it is the node's single way out (a multi-button menu to screens is a branch, not a chain).
    for k in ids:
        n = nodes[k]
        targets = []
        cont = str(n.get("continuation_node_id", "0"))
        if cont not in ("", "0"):
            targets.append(cont)
        for b in as_list(n.get("buttons")):
            targets.append(str(b.get("button_link")))
        targets = [t for t in dict.fromkeys(targets) if t in nodes]
        for t in targets:
            same = nodes[t]["type"] == n["type"]
            if not same or n["type"] not in ("Content", "Scoring", "Script"):
                continue
            if n["type"] == "Content" and len(targets) > 1:
                continue
            L.warn(f"{n['type']} {k} -> {n['type']} {t}: two of the same node type back to back ('{n.get('page_title')}' -> '{nodes[t].get('page_title')}')")

    for k in ids:
        n = nodes[k]
        if n.get("type") != "Scoring":
            continue
        evaluated = [b for b in as_list(n.get("buttons")) if b.get("op") != "def"]
        for b in evaluated:
            if not (b.get("logic_expression") or "").strip():
                L.warn(f"Scoring {k}: button '{b.get('button_text')}' has a blank expression - every router button evaluates something explicit")
        dests = Counter(str(b.get("button_link")) for b in evaluated if (b.get("logic_expression") or "").strip())
        for d, c in dests.items():
            if c > 1:
                L.warn(f"Scoring {k}: {c} evaluated buttons route to the same node {d} - the split is not a real decision")
        if str(n.get("continuation_node_id", "0")) in ("", "0"):
            L.warn(f"Scoring {k}: no continuation_node_id fallback")

    css = tree.get("css_include") or ""
    if not css:
        L.warn(f"no css_include - set the baseline stylesheet {BASELINE_CSS} (unless the account has its own)")
    elif "zingtree_2025" in css:
        L.warn("css_include points at zingtree_2025.css - superseded by zingtree_2026.css")

    # --- script standard -------------------------------------------------------------
    scripts = {k: nodes[k].get("content") or "" for k in ids if nodes[k].get("type") == "Script"}
    reads = script_reads_everywhere(tree)
    writes = defaultdict(set)
    node_check = shutil.which("node")

    for k, code in scripts.items():
        title = nodes[k].get("page_title")
        lines = code.splitlines()
        if any(ord(ch) > 127 for ch in code):
            L.warn(f"Script {k} ('{title}'): non-ASCII characters - curly quotes/unicode in code break scripts (in comments they are only noise)")
        if len(lines) > 120:
            L.warn(f"Script {k} ('{title}'): {len(lines)} lines - more than one screen means two nodes' work or scaffolding")
        for pat, why in BANNED_TOKENS:
            hits = re.findall(pat, code, re.M)
            if hits:
                L.warn(f"Script {k} ('{title}'): {why} x{len(hits)}")
        consts = CONST_BLOCK.findall(code)
        if consts:
            L.warn(f"Script {k} ('{title}'): {len(consts)} UPPER_CASE const(s) - no config/env constants in scripts")
        if UUID.search(code):
            L.warn(f"Script {k} ('{title}'): literal UUID - belongs in the Connected Object body or predefined_vars")
        if k != root and FIELD_ID.search(code):
            L.warn(f"Script {k} ('{title}'): reads raw custom_field_* ids - only the seed (root) script reads inbound names; everything else reads the tree's canonical variable")
        hist = [ln.strip()[:80] for ln in lines if COMMENT_HISTORY.search(ln)]
        if hist:
            L.warn(f"Script {k} ('{title}'): {len(hist)} history-style comment(s), e.g. `{hist[0]}` - comments describe the code now; history lives in claude.md")
        n_tf = len(re.findall(r"ZT\.setTransformData\(", code))
        if n_tf:
            L.warn(f"Script {k} ('{title}'): {n_tf} setTransformData call(s) - allowed only for a dynamic-select source or a dot-path merge field; say which")
        for kind, name in WRITE.findall(code):
            writes[name].add(k)
        if node_check:
            with tempfile.NamedTemporaryFile("w", suffix=".js", delete=False) as tf:
                tf.write(code)
            r = subprocess.run([node_check, "--check", tf.name], capture_output=True, text=True)
            if r.returncode != 0:
                L.err(f"Script {k} ('{title}'): syntax error - {r.stderr.strip().splitlines()[-1] if r.stderr.strip() else 'node --check failed'}")

    # duplicate blocks across scripts
    windows = defaultdict(set)
    for k, code in scripts.items():
        ls = [ln.strip() for ln in code.splitlines() if ln.strip()]
        for i in range(0, max(0, len(ls) - DUP_WINDOW + 1)):
            windows["\n".join(ls[i:i + DUP_WINDOW])].add(k)
    dup_pairs = defaultdict(int)
    for w, where in windows.items():
        if len(where) > 1:
            dup_pairs[tuple(sorted(where, key=int))] += 1
    for where, count in sorted(dup_pairs.items(), key=lambda x: -x[1])[:10]:
        L.warn(f"Scripts {list(where)} share {count} identical {DUP_WINDOW}-line window(s) - shared code means the design is wrong (one node, or drop the helper)")

    # writes never read
    for name, where in sorted(writes.items()):
        if name not in reads:
            L.warn(f"variable '{name}' is written in Script {sorted(where, key=int)} but never read in this export - "
                   f"remove it, or if a Connected Object body consumes it by name, record that in claude.md")

    return L


def main(argv):
    if len(argv) < 2:
        print(__doc__)
        return 2
    strict = "--strict" in argv
    tree = json.load(open(argv[1]))
    L = lint(tree, strict)
    print(f"lint: {tree.get('name')} ({tree.get('id')}) - {len(tree.get('nodes', {}))} nodes")
    for e in L.errors:
        print(f"ERROR  {e}")
    for w in L.warnings:
        print(f"warn   {w}")
    print(f"\n{len(L.errors)} error(s), {len(L.warnings)} warning(s)")
    print("not visible to this lint: runtime invalid-loop guard, live API behaviour, required/conditional field "
          "behaviour, merge-field rendering, dynamic-select path resolution. Run scripts/walk.mjs and the preview URL.")
    return 1 if L.errors or (strict and L.warnings) else 0


if __name__ == "__main__":
    sys.exit(main(sys.argv))
