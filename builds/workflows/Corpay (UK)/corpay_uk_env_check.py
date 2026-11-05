#!/usr/bin/env python3
"""Corpay UK (Allstar) Email Automation - dev/prod parity check and promotion.

  # 1. What does a tree reference, and does it all exist in the target environment?
  python3 corpay_uk_env_check.py check  "Email Automation - INT.json"  --env int
  python3 corpay_uk_env_check.py check  "Email Automation - PROD.json" --env prod

  # 2. Diff two exports: every Connected Object / AI Action / org id that differs, node by node
  python3 corpay_uk_env_check.py diff   "Email Automation - INT.json" "Email Automation - PROD.json"

  # 3. Promote / demote: rewrite every environment-specific id and alias, write a new file
  python3 corpay_uk_env_check.py promote "Email Automation - INT.json" --from int --to prod -o "Email Automation - PROD.json"
  python3 corpay_uk_env_check.py promote "Email Automation - PROD.json" --from prod --to int -o "Email Automation - INT.json"
  python3 corpay_uk_env_check.py promote "Email Automation - INT.json"  --from int  --to eu   -o "Email Automation - EU.json"   # Corpay UK org 123, GT's original objects

  # 4. INT -> PROD inside the Corpay UK org (org 123): eu = the INT tree 109029630, eu_prod = live tree 417189428
  python3 corpay_uk_env_check.py promote "Email Automation - AI Actions INT.json" --from eu --to eu_prod -o "Email Automation - AI Actions Prod (promote).json"
  python3 corpay_uk_env_check.py check   "Email Automation - AI Actions Prod (promote).json" --env eu_prod

The manifest (corpay-uk-env-manifest.json, next to this script) is the single list of what exists
per environment: org id, Connected Object alias -> id, AI Action alias -> id. Update it when an
object is created live; the script never talks to the Zingtree API.
Exit code 1 when a check or diff finds a problem, so it can gate a promotion.
"""
import argparse, json, re, sys
from pathlib import Path

HERE = Path(__file__).parent
MANIFEST = HERE / "corpay-uk-env-manifest.json"


def load(path):
    return json.load(open(path))


def manifest():
    return load(MANIFEST)


def references(tree):
    """Every environment-specific reference in a tree, by node."""
    refs = {"org_id": str(tree.get("org_id")), "connected_objects": [], "ai_actions": [], "aliases": set()}
    alias_re = re.compile(r"\b(sfdc_(?:int|prod)__case_email_ai|get_case_details__prod|"
                          r"get_account_details__(?:int|prod)|"
                          r"get_incoming_email_addresses_(?:int|prod)|send_email_simple_(?:int|prod)|"
                          r"automate_email_(?:intent|generation)_(?:int|prod)|"
                          r"automate_hc_email_(?:intent|generation)_(?:int|prod)|"
                          r"automate_networks_email_intent_(?:int|prod)|"
                          r"automate_email_responses|automate_email_generation|format_gdpr_names_(?:int|prod))\b")
    for nid, node in tree["nodes"].items():
        for co in (node.get("data_connected_objects") or {}).values():
            refs["connected_objects"].append({"node": nid, "id": str(co.get("data_connected_object_id")),
                                              "org_id": str(co.get("org_id")), "type": co.get("data_connected_object_type")})
        if node.get("type") == "AI_Action":
            refs["ai_actions"].append({"node": nid, "id": str(node.get("ai_action_id"))})
        for field in ("content", "page_title", "node_name"):
            refs["aliases"].update(alias_re.findall(node.get(field) or ""))
        for b in (node.get("buttons") or {}).values():
            refs["aliases"].update(alias_re.findall(b.get("logic_expression") or ""))
    refs["aliases"] = sorted(refs["aliases"])
    return refs


def cmd_check(args):
    tree, env = load(args.tree), args.env
    m = manifest()[env]
    refs = references(tree)
    problems = []
    if refs["org_id"] != str(m["org_id"]):
        problems.append(f"top-level org_id {refs['org_id']} != {env} org {m['org_id']}")
    co_ids = {str(v): k for k, v in m["connected_objects"].items()}
    ai_ids = {str(v): k for k, v in m["ai_actions"].items()}
    for co in refs["connected_objects"]:
        if co["org_id"] != str(m["org_id"]):
            problems.append(f"node {co['node']}: Connected Object org_id {co['org_id']} != {m['org_id']}")
        if co["id"] not in co_ids:
            problems.append(f"node {co['node']}: Connected Object id {co['id']} does not exist in {env}")
    for ai in refs["ai_actions"]:
        if ai["id"] in ("0", "None", ""):
            problems.append(f"node {ai['node']}: AI Action id is unassigned")
        elif ai["id"] not in ai_ids:
            problems.append(f"node {ai['node']}: AI Action id {ai['id']} does not exist in {env}")
    known = set(m["alias_order"])
    for a in [a for a in refs["aliases"] if a not in known]:
        problems.append(f"alias '{a}' referenced in scripts/content belongs to the other environment")
    print(f"check: {tree['name']} ({tree['id']}) against {env} (org {m['org_id']})")
    print(f"  {len(refs['connected_objects'])} Connected Object refs, {len(refs['ai_actions'])} AI Action refs, {len(refs['aliases'])} aliases in code")
    for co in refs["connected_objects"]:
        print(f"  node {co['node']:>3}  CO {co['id']:>5}  {co_ids.get(co['id'], '?? not in manifest')}")
    for ai in refs["ai_actions"]:
        print(f"  node {ai['node']:>3}  AI {ai['id']:>5}  {ai_ids.get(ai['id'], '?? not in manifest')}")
    for p in problems:
        print(f"  PROBLEM  {p}")
    print("  OK" if not problems else f"  {len(problems)} problem(s)")
    return 1 if problems else 0


def cmd_diff(args):
    a, b = load(args.tree_a), load(args.tree_b)
    ra, rb = references(a), references(b)
    print(f"diff: {a['name']} ({a['id']}, org {ra['org_id']})  vs  {b['name']} ({b['id']}, org {rb['org_id']})")
    diffs = 0
    nodes = sorted(set(a["nodes"]) | set(b["nodes"]), key=int)
    for nid in nodes:
        na, nb = a["nodes"].get(nid), b["nodes"].get(nid)
        if not na or not nb:
            print(f"  node {nid}: only in {'A' if na else 'B'}"); diffs += 1; continue
        if na.get("type") != nb.get("type"):
            print(f"  node {nid}: type {na.get('type')} vs {nb.get('type')}"); diffs += 1
        ca = [c["id"] for c in ra["connected_objects"] if c["node"] == nid]
        cb = [c["id"] for c in rb["connected_objects"] if c["node"] == nid]
        if ca or cb:
            same = ca == cb
            print(f"  node {nid}: Connected Object {ca} vs {cb}{'  <- SAME ID IN BOTH ENVIRONMENTS' if same and ca else ''}")
            if same and ca: diffs += 1
        aa = [x["id"] for x in ra["ai_actions"] if x["node"] == nid]
        ab = [x["id"] for x in rb["ai_actions"] if x["node"] == nid]
        if aa or ab:
            same = aa == ab
            print(f"  node {nid}: AI Action {aa} vs {ab}{'  <- SAME ID IN BOTH ENVIRONMENTS' if same and aa else ''}")
            if same and aa: diffs += 1
    if ra["org_id"] == rb["org_id"]:
        print(f"  org_id identical ({ra['org_id']}) - fine inside one sandbox, wrong across real orgs")
    print(f"  aliases A: {ra['aliases']}")
    print(f"  aliases B: {rb['aliases']}")
    print("  OK" if not diffs else f"  {diffs} difference(s) to review")
    return 1 if diffs else 0


def cmd_promote(args):
    tree = load(args.tree)
    m = manifest()
    src, dst = m[args.src], m[args.dst]
    alias_map = {a: b for a, b in zip(src["alias_order"], dst["alias_order"])}
    co_map = {str(src["connected_objects"][a]): str(dst["connected_objects"][alias_map[a]])
              for a in src["connected_objects"] if a in alias_map and alias_map[a] in dst["connected_objects"]}
    ai_map = {str(src["ai_actions"][a]): str(dst["ai_actions"][alias_map[a]])
              for a in src["ai_actions"] if a in alias_map and alias_map[a] in dst["ai_actions"]}
    # An AI Action the target environment has not been given yet: the manifest names a stand-in
    # id so the tree still imports. The alias in the scripts is NOT rewritten to the stand-in -
    # it becomes the intended (not yet created) target alias, so the lane fails loudly instead of
    # quietly answering with the wrong prompt.
    placeholders = dst.get("ai_action_placeholders", {})
    ai_placeholder_map = {str(src["ai_actions"][a]): str(placeholders[alias_map[a]])
                          for a in src["ai_actions"] if a in alias_map and alias_map[a] in placeholders}
    placeholder_nodes = []
    alias_re = re.compile(r"\b(" + "|".join(map(re.escape, alias_map)) + r")\b")
    changed = 0

    def swap_text(s):
        nonlocal changed
        out = alias_re.sub(lambda mo: alias_map[mo.group(1)], s or "")
        changed += out != (s or "")
        return out

    tree["org_id"] = str(dst["org_id"])
    for nid, node in tree["nodes"].items():
        for co in (node.get("data_connected_objects") or {}).values():
            old = str(co.get("data_connected_object_id"))
            if old not in co_map:
                sys.exit(f"node {nid}: Connected Object {old} has no {args.dst} twin in the manifest")
            co["data_connected_object_id"] = co_map[old]; co["org_id"] = str(dst["org_id"]); changed += 1
            co["data_connected_object_type"] = dst.get("connected_object_types", {}).get(co_map[old], co.get("data_connected_object_type"))
        if node.get("type") == "AI_Action":
            old = str(node.get("ai_action_id"))
            if old in ai_map:
                node["ai_action_id"] = ai_map[old]; changed += 1
            elif old in ai_placeholder_map:
                node["ai_action_id"] = ai_placeholder_map[old]; changed += 1
                placeholder_nodes.append((nid, old, ai_placeholder_map[old]))
            else:
                sys.exit(f"node {nid}: AI Action {old} has no {args.dst} twin in the manifest")
        for field in ("content", "page_title", "node_name"):
            node[field] = swap_text(node.get(field))
        for b in (node.get("buttons") or {}).values():
            b["logic_expression"] = swap_text(b.get("logic_expression"))
            b["button_text"] = swap_text(b.get("button_text"))
    if args.rename:
        tree["name"] = tree["name"].replace(args.src.upper(), args.dst.upper())
    # Retarget the export at the destination tree, so importing it lands on that tree rather
    # than creating a second one. --keep-tree-id skips this (new tree / side-by-side cutover).
    if dst.get("tree_id") and not args.keep_tree_id:
        tree["id"] = str(dst["tree_id"])
        if dst.get("tree_name"):
            tree["name"] = dst["tree_name"]
        for var in (tree.get("predefined_vars") or {}).values():
            var["project_id"] = int(dst["tree_id"]) if isinstance(var.get("project_id"), int) else str(dst["tree_id"])
        print(f"  retargeted at tree {dst['tree_id']} ({tree['name']}), "
              f"{len(tree.get('predefined_vars') or {})} predefined vars repointed")
    json.dump(tree, open(args.out, "w"), indent=2)
    print(f"promote {args.src} -> {args.dst}: {changed} references rewritten, wrote {args.out}")
    for nid, old, new in placeholder_nodes:
        print(f"  PLACEHOLDER  node {nid}: AI Action {old} -> {new} (stand-in; that lane is NOT live "
              f"in {args.dst} until the real action exists and the id is swapped)")
    print("  reminder: the AI Action contexts in Zingtree also reference the alias "
          f"(actions.{src['alias_order'][0]}...) - the {args.dst} AI Actions must use the {args.dst} alias.")
    return 0


def main():
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    sub = ap.add_subparsers(dest="cmd", required=True)
    envs = ["int", "prod", "eu", "eu_prod"]
    c = sub.add_parser("check"); c.add_argument("tree"); c.add_argument("--env", choices=envs, required=True); c.set_defaults(fn=cmd_check)
    d = sub.add_parser("diff"); d.add_argument("tree_a"); d.add_argument("tree_b"); d.set_defaults(fn=cmd_diff)
    p = sub.add_parser("promote"); p.add_argument("tree"); p.add_argument("--from", dest="src", choices=envs, required=True)
    p.add_argument("--to", dest="dst", choices=envs, required=True); p.add_argument("-o", "--out", required=True)
    p.add_argument("--rename", action="store_true", help="also swap INT/PROD in the tree name")
    p.add_argument("--keep-tree-id", action="store_true",
                   help="do not retarget id/name/predefined_vars at the destination tree (new tree instead of overwrite)")
    p.set_defaults(fn=cmd_promote)
    args = ap.parse_args()
    sys.exit(args.fn(args))


if __name__ == "__main__":
    main()
