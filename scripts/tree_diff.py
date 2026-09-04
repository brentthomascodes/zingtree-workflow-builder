#!/usr/bin/env python3
"""
tree_diff.py — plain-English diff between two Zingtree tree JSON exports.

Purpose: prove that an edited tree is still the same tree. Answers, mechanically:
what nodes changed, what stayed, what moved, and exactly which script lines differ.

Usage:
    python3 tree_diff.py BEFORE.json AFTER.json                 # print report
    python3 tree_diff.py BEFORE.json AFTER.json -o REPORT.md    # also write file
    python3 tree_diff.py BEFORE.json AFTER.json --context 3     # script diff context lines
    python3 tree_diff.py BEFORE.json AFTER.json --no-bodies     # node-level only

Accepts a bare project object or a {"projects":[...]} envelope. With multiple
projects, trees are paired by id (falling back to name) and diffed one by one.

Exit codes: 0 = no differences, 1 = differences found, 2 = usage/parse error.
(Non-zero on differences is expected — it is a signal, not a failure.)
"""

import argparse
import difflib
import json
import os
import sys

# Fields compared individually and reported in plain language.
IDENTITY_FIELDS = ["type", "page_title", "node_name"]
BODY_FIELDS = ["content", "question", "notes", "confirmation_text", "jsmessage"]
ROUTING_FIELDS = ["continuation_node_id", "continuation_button_text",
                  "open_tree_id", "open_tree_node_id", "return_tree_node_id"]
STRUCT_FIELDS = ["formfields", "buttons", "data_connected_objects", "app_messages"]

# Cosmetic / editor-only fields — changes here are counted but never flagged as
# meaningful, because they move on their own when a tree is opened in the editor.
COSMETIC_FIELDS = {"x", "y", "width", "height", "level", "updated",
                   "display_order", "project_node_id", "last_modified",
                   "last_opened", "last_overview", "dev_version_updated"}

TREE_SETTINGS_IGNORE = COSMETIC_FIELDS | {"nodes", "create_date", "view", "zoom_level",
                                          "unlinked_node_x", "unlinked_node_y", "save_lock"}


# ---------------------------------------------------------------- loading

def load_projects(path):
    with open(path, "r", encoding="utf-8") as fh:
        data = json.load(fh)
    if isinstance(data, dict) and isinstance(data.get("projects"), list):
        return data["projects"]
    return [data]


def title_of(node):
    return (node.get("page_title") or "").strip() or (node.get("node_name") or "").strip() or "(untitled)"


def label(key, node):
    return "node %s — %s [%s]" % (key, title_of(node), node.get("type", "?"))


def norm(value):
    """Normalize for comparison: Zingtree stores every scalar as a string."""
    if isinstance(value, (dict, list)):
        return json.dumps(value, sort_keys=True)
    if value is None:
        return ""
    return str(value)


# ---------------------------------------------------------------- matching

def pair_nodes(before, after):
    """Return (matched, added, removed, renumbered).

    Nodes match on dict key first. Leftovers are matched on exact
    (type, page_title, node_name) so a renumber reads as a move, not a
    delete plus an add.
    """
    matched = []                       # (before_key, after_key)
    b_keys, a_keys = set(before), set(after)
    for key in sorted(b_keys & a_keys, key=sort_key):
        matched.append((key, key))

    b_left = sorted(b_keys - a_keys, key=sort_key)
    a_left = sorted(a_keys - b_keys, key=sort_key)

    renumbered = []
    for bk in list(b_left):
        sig = (before[bk].get("type"), before[bk].get("page_title"), before[bk].get("node_name"))
        for ak in list(a_left):
            asig = (after[ak].get("type"), after[ak].get("page_title"), after[ak].get("node_name"))
            if sig == asig:
                matched.append((bk, ak))
                renumbered.append((bk, ak))
                b_left.remove(bk)
                a_left.remove(ak)
                break

    matched.sort(key=lambda pair: sort_key(pair[1]))
    return matched, a_left, b_left, renumbered


def sort_key(key):
    try:
        return (0, int(key), "")
    except (TypeError, ValueError):
        return (1, 0, str(key))


# ---------------------------------------------------------------- helpers

def button_rows(node):
    """[(rank, text, target, logic_expression)] for stable comparison."""
    rows = []
    buttons = node.get("buttons") or {}
    if isinstance(buttons, dict):
        items = [buttons[k] for k in sorted(buttons, key=sort_key)]
    else:
        items = list(buttons)
    for btn in items:
        if not isinstance(btn, dict):
            continue
        rows.append((norm(btn.get("rank")),
                     norm(btn.get("button_text")),
                     norm(btn.get("button_link")),
                     norm(btn.get("logic_expression"))))
    return rows


def field_names(node):
    fields = node.get("formfields") or {}
    if isinstance(fields, dict):
        items = [fields[k] for k in sorted(fields, key=sort_key)]
    else:
        items = list(fields)
    out = []
    for f in items:
        if isinstance(f, dict):
            out.append("%s (%s)" % (f.get("name") or f.get("label") or "?", f.get("type") or "?"))
    return out


def inbound_map(nodes):
    """key -> list of node keys that point at it."""
    inbound = {}
    for key, node in nodes.items():
        targets = []
        cont = norm(node.get("continuation_node_id"))
        if cont and cont != "0":
            targets.append(cont)
        for _rank, _text, target, _logic in button_rows(node):
            if target and target != "0":
                targets.append(target)
        for target in targets:
            bucket = inbound.setdefault(target, [])
            if key not in bucket:
                bucket.append(key)
    return inbound


def broken_links(nodes):
    """[(source_key, kind, missing_target)] for links that point nowhere."""
    bad = []
    for key in sorted(nodes, key=sort_key):
        node = nodes[key]
        cont = norm(node.get("continuation_node_id"))
        if cont and cont != "0" and cont not in nodes:
            bad.append((key, "continuation", cont))
        for _rank, text, target, _logic in button_rows(node):
            if target and target != "0" and target not in nodes:
                bad.append((key, 'button "%s"' % text, target))
    return bad


def unreachable(nodes, root):
    """Nodes not reachable from the root (claude.md is unlinked by design)."""
    root = norm(root)
    if root not in nodes:
        return sorted(nodes, key=sort_key)
    seen, stack = set(), [root]
    while stack:
        key = stack.pop()
        if key in seen or key not in nodes:
            continue
        seen.add(key)
        node = nodes[key]
        cont = norm(node.get("continuation_node_id"))
        if cont and cont != "0":
            stack.append(cont)
        for _rank, _text, target, _logic in button_rows(node):
            if target and target != "0":
                stack.append(target)
    return sorted(set(nodes) - seen, key=sort_key)


def unified(before_text, after_text, name, context):
    diff = difflib.unified_diff(
        norm(before_text).splitlines(),
        norm(after_text).splitlines(),
        fromfile="before/%s" % name,
        tofile="after/%s" % name,
        lineterm="",
        n=context,
    )
    return list(diff)


def counts_by_type(nodes):
    tally = {}
    for node in nodes.values():
        tally[node.get("type", "?")] = tally.get(node.get("type", "?"), 0) + 1
    return tally


# ---------------------------------------------------------------- diffing

def diff_project(before, after, args, out):
    b_nodes = before.get("nodes") or {}
    a_nodes = after.get("nodes") or {}
    matched, added, removed, renumbered = pair_nodes(b_nodes, a_nodes)
    b_inbound = inbound_map(b_nodes)

    changes = {
        "renamed": [], "retyped": [], "body": [], "routing": [],
        "fields": [], "buttons": [], "other": [], "cosmetic": [],
    }
    untouched = []
    script_diffs = []

    for bk, ak in matched:
        bn, an = b_nodes[bk], a_nodes[ak]
        touched = False

        if norm(bn.get("type")) != norm(an.get("type")):
            changes["retyped"].append((ak, "%s → %s (%s)" % (bn.get("type"), an.get("type"), title_of(an))))
            touched = True

        for f in ("page_title", "node_name"):
            if norm(bn.get(f)) != norm(an.get(f)):
                changes["renamed"].append((ak, "%s: \"%s\" → \"%s\"" % (f, norm(bn.get(f)), norm(an.get(f)))))
                touched = True

        for f in BODY_FIELDS:
            if norm(bn.get(f)) != norm(an.get(f)):
                b_text, a_text = norm(bn.get(f)), norm(an.get(f))
                b_lines, a_lines = len(b_text.splitlines()), len(a_text.splitlines())
                kind = "script code" if (an.get("type") == "Script" and f == "content") else f
                if max(b_lines, a_lines) <= 1:
                    size = "%d → %d characters" % (len(b_text), len(a_text))
                else:
                    size = "%d → %d lines" % (b_lines, a_lines)
                changes["body"].append((ak, "%s changed (%s) — %s" % (kind, size, title_of(an))))
                touched = True
                if args.bodies:
                    lines = unified(bn.get(f), an.get(f), "node %s %s" % (ak, f), args.context)
                    script_diffs.append((ak, title_of(an), kind, lines))

        for f in ROUTING_FIELDS:
            if norm(bn.get(f)) != norm(an.get(f)):
                changes["routing"].append((ak, "%s: %s → %s — %s"
                                           % (f, norm(bn.get(f)) or "(none)", norm(an.get(f)) or "(none)", title_of(an))))
                touched = True

        b_btns, a_btns = button_rows(bn), button_rows(an)
        if b_btns != a_btns:
            touched = True
            b_set, a_set = set(b_btns), set(a_btns)
            for rank, text, target, logic in sorted(a_set - b_set):
                changes["buttons"].append((ak, "button added/changed: \"%s\" → node %s%s"
                                           % (text, target or "(none)", " [logic: %s]" % logic if logic else "")))
            for rank, text, target, logic in sorted(b_set - a_set):
                changes["buttons"].append((ak, "button removed/replaced: \"%s\" → node %s"
                                           % (text, target or "(none)")))

        b_fields, a_fields = field_names(bn), field_names(an)
        if b_fields != a_fields:
            touched = True
            for name in [f for f in a_fields if f not in b_fields]:
                changes["fields"].append((ak, "form field added: %s" % name))
            for name in [f for f in b_fields if f not in a_fields]:
                changes["fields"].append((ak, "form field removed: %s" % name))
            if sorted(b_fields) == sorted(a_fields) and b_fields != a_fields:
                changes["fields"].append((ak, "form field order changed"))
        elif norm(bn.get("formfields")) != norm(an.get("formfields")):
            touched = True
            changes["fields"].append((ak, "form field settings changed (same field names)"))

        skip = set(IDENTITY_FIELDS + BODY_FIELDS + ROUTING_FIELDS + STRUCT_FIELDS)
        for f in sorted(set(bn) | set(an)):
            if f in skip:
                continue
            if norm(bn.get(f)) != norm(an.get(f)):
                entry = (ak, "%s: %s → %s" % (f, norm(bn.get(f)) or "(empty)", norm(an.get(f)) or "(empty)"))
                if f in COSMETIC_FIELDS:
                    changes["cosmetic"].append(entry)
                else:
                    changes["other"].append(entry)
                    touched = True

        if not touched:
            untouched.append(ak)

    # ------------------------------------------------------------ report
    name = after.get("name") or before.get("name") or "(unnamed tree)"
    total_changed = sum(len(v) for k, v in changes.items() if k != "cosmetic")
    meaningful_nodes = sorted({k for key, items in changes.items() if key != "cosmetic"
                               for k, _ in items}, key=sort_key)

    out.append("=" * 72)
    out.append("WORKFLOW DIFF — %s" % name)
    out.append("=" * 72)
    out.append("")
    out.append("Before : %s  (%d nodes)" % (args.before_label, len(b_nodes)))
    out.append("After  : %s  (%d nodes)" % (args.after_label, len(a_nodes)))
    out.append("")

    # --- plain summary
    out.append("## PLAIN SUMMARY")
    out.append("")
    kept = len(untouched)
    pct = (100.0 * kept / len(a_nodes)) if a_nodes else 0.0
    out.append("%d of %d nodes are byte-for-byte identical to the original (%.0f%% untouched)."
               % (kept, len(a_nodes), pct))
    out.append("%d node%s added, %d removed, %d renumbered, %d modified."
               % (len(added), "" if len(added) == 1 else "s", len(removed),
                  len(renumbered), len(meaningful_nodes)))
    out.append("")
    if not (added or removed or total_changed):
        out.append("No functional differences found. The trees are equivalent.")
    else:
        out.append("In plain terms:")
        for key in added:
            out.append("  + NEW      %s" % label(key, a_nodes[key]))
        for key in removed:
            callers = b_inbound.get(key) or []
            note = " (was reachable from node%s %s)" % ("s" if len(callers) > 1 else "",
                                                        ", ".join(sorted(callers, key=sort_key))) if callers else " (was unlinked)"
            out.append("  - GONE     %s%s" % (label(key, b_nodes[key]), note))
        for bk, ak in renumbered:
            out.append("  ~ MOVED    node %s → node %s (same title/type): %s" % (bk, ak, title_of(a_nodes[ak])))
        for key in meaningful_nodes:
            reasons = []
            for bucket in ("retyped", "renamed", "body", "routing", "buttons", "fields", "other"):
                reasons += [msg for k, msg in changes[bucket] if k == key]
            out.append("  * CHANGED  %s" % label(key, a_nodes[key]))
            for reason in reasons:
                out.append("               - %s" % reason)
    out.append("")

    # --- shape
    out.append("## TREE SHAPE")
    out.append("")
    b_tally, a_tally = counts_by_type(b_nodes), counts_by_type(a_nodes)
    out.append("  %-22s %8s %8s %8s" % ("node type", "before", "after", "delta"))
    for ntype in sorted(set(b_tally) | set(a_tally)):
        b_count, a_count = b_tally.get(ntype, 0), a_tally.get(ntype, 0)
        out.append("  %-22s %8d %8d %+8d" % (ntype, b_count, a_count, a_count - b_count))
    out.append("  %-22s %8d %8d %+8d" % ("TOTAL", len(b_nodes), len(a_nodes), len(a_nodes) - len(b_nodes)))
    out.append("")
    b_root, a_root = norm(before.get("root_node_id")), norm(after.get("root_node_id"))
    if b_root != a_root:
        out.append("  ROOT CHANGED: node %s → node %s   <-- verify this was intended" % (b_root, a_root))
    else:
        out.append("  Root node unchanged (node %s)." % a_root)
    out.append("")

    # --- structural sanity (only flags problems this edit introduced)
    b_broken = set(broken_links(b_nodes))
    a_broken = set(broken_links(a_nodes))
    b_orphan = set(unreachable(b_nodes, before.get("root_node_id")))
    a_orphan = set(unreachable(a_nodes, after.get("root_node_id")))
    new_broken = sorted(a_broken - b_broken, key=lambda r: sort_key(r[0]))
    new_orphan = sorted(a_orphan - b_orphan, key=sort_key)
    out.append("## STRUCTURAL SANITY")
    out.append("")
    if new_broken:
        out.append("  BROKEN LINKS INTRODUCED (%d) — this tree will misbehave on import:" % len(new_broken))
        for src, kind, target in new_broken:
            out.append("    node %s %s points at node %s, which does not exist" % (src, kind, target))
    else:
        out.append("  No broken links introduced.")
    if new_orphan:
        named = ["%s (%s)" % (k, title_of(a_nodes[k])) for k in new_orphan]
        out.append("  NEWLY UNREACHABLE FROM ROOT (%d): %s" % (len(new_orphan), "; ".join(named)))
        out.append("    (expected for the unlinked claude.md node — anything else is a stranded path)")
    else:
        out.append("  No nodes became unreachable.")
    if b_broken or b_orphan:
        out.append("  Pre-existing in the BEFORE tree (not caused by this edit): %d broken link(s), %d unreachable node(s)."
                   % (len(b_broken), len(b_orphan)))
    out.append("")

    # --- unchanged list
    out.append("## UNTOUCHED NODES (%d)" % kept)
    out.append("")
    if untouched:
        out.append("  " + ", ".join(untouched))
    else:
        out.append("  (none — every node was modified; if that was not the intent, stop here)")
    out.append("")

    # --- tree settings
    settings = []
    for f in sorted(set(before) | set(after)):
        if f in TREE_SETTINGS_IGNORE:
            continue
        if norm(before.get(f)) != norm(after.get(f)):
            settings.append("  %s: %s → %s" % (f, norm(before.get(f)) or "(empty)", norm(after.get(f)) or "(empty)"))
    out.append("## TREE-LEVEL SETTINGS CHANGED (%d)" % len(settings))
    out.append("")
    out.extend(settings or ["  (none)"])
    out.append("")

    # --- cosmetic
    out.append("## COSMETIC / EDITOR-ONLY CHANGES (%d) — ignore" % len(changes["cosmetic"]))
    out.append("")
    if changes["cosmetic"]:
        out.append("  (canvas x/y, sizes, display_order, updated flags on %d node reference%s)"
                   % (len(changes["cosmetic"]), "" if len(changes["cosmetic"]) == 1 else "s"))
    else:
        out.append("  (none)")
    out.append("")

    # --- script/content bodies
    if args.bodies:
        out.append("## LINE-LEVEL BODY DIFFS (%d)" % len(script_diffs))
        out.append("")
        if not script_diffs:
            out.append("  (no script or content bodies changed)")
        for key, ttl, kind, lines in script_diffs:
            out.append("### node %s — %s (%s)" % (key, ttl, kind))
            out.append("")
            out.append("```diff")
            if args.max_diff_lines and len(lines) > args.max_diff_lines:
                out.extend(lines[:args.max_diff_lines])
                out.append("... (%d more diff lines truncated — rerun with --max-diff-lines 0 for the full diff)"
                           % (len(lines) - args.max_diff_lines))
            else:
                out.extend(lines)
            out.append("```")
            out.append("")

    # --- explanation checklist
    out.append("## CHANGES THAT NEED AN EXPLANATION")
    out.append("")
    out.append("Every line below must map to a requirement or an explicit request.")
    out.append("Anything unexplained is unintended drift — revert it before delivering.")
    out.append("")
    rows = []
    for key in added:
        rows.append("  [ ] added node %s (%s)" % (key, title_of(a_nodes[key])))
    for key in removed:
        rows.append("  [ ] removed node %s (%s)" % (key, title_of(b_nodes[key])))
    for key in meaningful_nodes:
        for bucket in ("retyped", "renamed", "body", "routing", "buttons", "fields", "other"):
            for k, msg in changes[bucket]:
                if k == key:
                    rows.append("  [ ] node %s — %s" % (key, msg))
    for line in settings:
        rows.append("  [ ] tree setting —%s" % line.rstrip())
    out.extend(rows or ["  (nothing to explain — no functional changes)"])
    out.append("")

    return bool(added or removed or total_changed or settings)


def main():
    parser = argparse.ArgumentParser(description="Plain-English diff of two Zingtree tree JSONs.")
    parser.add_argument("before")
    parser.add_argument("after")
    parser.add_argument("-o", "--out", help="also write the report to this file")
    parser.add_argument("--context", type=int, default=3, help="context lines in body diffs (default 3)")
    parser.add_argument("--max-diff-lines", type=int, default=400,
                        help="truncate each body diff at N lines; 0 = no limit (default 400)")
    parser.add_argument("--no-bodies", dest="bodies", action="store_false",
                        help="node-level only; skip line-level script/content diffs")
    args = parser.parse_args()

    try:
        b_projects = load_projects(args.before)
        a_projects = load_projects(args.after)
    except (OSError, ValueError) as exc:
        sys.stderr.write("tree_diff: could not read input: %s\n" % exc)
        return 2

    args.before_label = os.path.basename(args.before)
    args.after_label = os.path.basename(args.after)

    out, differs = [], False
    if len(b_projects) == 1 and len(a_projects) == 1:
        differs = diff_project(b_projects[0], a_projects[0], args, out)
    else:
        def index(projects):
            return {norm(p.get("id")) or norm(p.get("name")): p for p in projects}
        b_index, a_index = index(b_projects), index(a_projects)
        for pid in sorted(set(b_index) | set(a_index)):
            if pid in b_index and pid in a_index:
                differs = diff_project(b_index[pid], a_index[pid], args, out) or differs
            elif pid in a_index:
                out.append("## TREE ADDED: %s (%s)" % (a_index[pid].get("name"), pid))
                out.append("")
                differs = True
            else:
                out.append("## TREE REMOVED: %s (%s)" % (b_index[pid].get("name"), pid))
                out.append("")
                differs = True

    report = "\n".join(out)
    print(report)
    if args.out:
        with open(args.out, "w", encoding="utf-8") as fh:
            fh.write(report + "\n")
        sys.stderr.write("\ntree_diff: report written to %s\n" % args.out)
    return 1 if differs else 0


if __name__ == "__main__":
    sys.exit(main())
