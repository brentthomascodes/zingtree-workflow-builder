#!/usr/bin/env python3
"""Build 'Penrose Outcome Tail (Unified)' v2 - the flattened shape.

ONE script node owns ALL data + logic (resolver + all six outcome catalogs +
netting + screen HTML builder). ONE content node renders the dynamically built
screen and captures outcome + other_outcome natively. Escape buttons go to the
Pharmacy First Tree node and the alternate-outcome swap script.

19 nodes (v1) -> 6 nodes. Regenerate from fresh exports:  python3 build_outcome_tail.py
"""
import json, re, copy, hashlib, collections

SRC = "/sessions/zealous-sharp-allen/mnt/uploads/Selected_from_Penrose Health (2)_2026-07-17 (5).json"
OUT_JSON = "Penrose Outcome Tail (Unified).json"

data = json.load(open(SRC))
trees = {p["name"]: p for p in data["projects"]}

META = [
    ("Women's Health",                 "wh",    "womens_health",  "62"),
    ("Paediatric Cough, Cold & Fever", "paeds", "paeds",          "36"),
    ("Pharmacy First",                 "p1",    "pharmacy_first", "4"),
    ("Rash",                           "rash",  "rash",           "63"),
    ("NHS Health Check",               "nhs",   "nhs_check",      "10"),
    ("Contraception",                  "con",   "contraception",  "20"),
]
PHARMACY_FIRST_TREE_ID = "824824140"

COPY_RE = re.compile(r"\[\[COPY-AREA\]\](.*?)\[\[/COPY-AREA\]\]", re.S)
TAG_RE = re.compile(r"<[^>]+>")
BTN_RE = re.compile(r"<a[^>]*copy_to_clipboard[^>]*>.*?</a>", re.S)

def fflist(n):
    ff = n.get("formfields") or []
    return ff if isinstance(ff, list) else list(ff.values())

def btnlist(n):
    b = n.get("buttons") or []
    return b if isinstance(b, list) else list(b.values())

def strip_tags(h):
    return re.sub(r"\s+", " ", TAG_RE.sub(" ", h)).strip()

def slugify(title):
    t = re.sub(r"^\s*outcome\s*:?\s*", "", title.lower())
    return re.sub(r"[^a-z0-9]+", "_", t).strip("_") or "outcome"

def harvest(tree, nid):
    n = tree["nodes"][nid]
    content = n.get("content") or ""
    m = COPY_RE.search(content)
    sug = strip_tags(m.group(1)) if m else strip_tags(n.get("page_title") or "")
    html = BTN_RE.sub("", COPY_RE.sub("", content)).replace("Copy to Clipboard", "")
    code = ""
    for f in fflist(n):
        if f.get("type") == "hidden" and f.get("name") == "suggested_outcome":
            code = f.get("hidden_value") or ""
    return {"title": (n.get("page_title") or n.get("node_name") or "").strip(),
            "code": code, "sug": sug, "html": html}

# ---------------------------------------------------------------- catalogs --
OUTCOMES = {}                       # flat, prefix-keyed
NETTING = {}                        # src key -> netting html
CODE_TO_KEY = collections.defaultdict(dict)   # src key -> {code: key}
registry = []
node_to_key = {}

def outcome_nodes(tree):
    for k, n in tree["nodes"].items():
        if any(f.get("name") == "outcome" for f in fflist(n)):
            yield k, n

for tname, prefix, srckey, netting_nid in META:
    tree = trees[tname]
    NETTING[srckey] = tree["nodes"][netting_nid].get("content") or ""
    byhash, srcids = {}, collections.defaultdict(list)
    for nid, n in sorted(outcome_nodes(tree), key=lambda kv: int(kv[0])):
        e = harvest(tree, nid)
        h = hashlib.md5((e["code"] + "\x00" + e["title"] + "\x00" + e["html"]).encode()).hexdigest()
        if h in byhash:
            node_to_key[(tname, nid)] = byhash[h]; srcids[byhash[h]].append(nid); continue
        base = prefix + "_" + slugify(e["title"])
        key, i = base, 2
        while key in OUTCOMES:
            key = "%s_%d" % (base, i); i += 1
        e["src"] = srckey
        OUTCOMES[key] = e
        byhash[h] = key; node_to_key[(tname, nid)] = key; srcids[key].append(nid)
        CODE_TO_KEY[srckey].setdefault(e["code"], key)
    for nid, n in outcome_nodes(tree):        # variants + alternates
        key = node_to_key[(tname, nid)]
        btns = btnlist(n)
        if len(btns) <= 1:
            continue
        texts = [b.get("button_text") or "" for b in btns]
        OUTCOMES[key]["variant"] = "p1_child" if any("0-4" in t for t in texts) else "p1_adult"
        for b in btns:
            t = (b.get("button_text") or "").lower()
            tgt = str(b.get("button_link") or "")
            tn = tree["nodes"].get(tgt)
            if tn and tn.get("type") != "Tree" and any(f.get("name") == "outcome" for f in fflist(tn)) \
               and ("refused" in t or "0-4" in t):
                OUTCOMES[key]["alt"] = node_to_key[(tname, tgt)]
    for key in srcids:
        e = OUTCOMES[key]
        registry.append((tname, key, e["title"], e["code"], ",".join(srcids[key])))

for key, e in OUTCOMES.items():
    if e.get("variant"):
        assert e.get("alt"), ("variant without alt", key)

# ------------------------------------------------- canonical outcome select --
opt_counter = collections.Counter()
for tname, *_ in META:
    for nid, n in outcome_nodes(trees[tname]):
        for f in fflist(n):
            if f.get("name") == "outcome":
                opt_counter[f.get("options") or ""] += 1
base_opts = opt_counter.most_common(1)[0][0].split("\n")
seen = {o.strip() for o in base_opts}
extras = []
for opts, _ in opt_counter.most_common():
    for o in opts.split("\n"):
        if o.strip() and o.strip() not in seen:
            extras.append(o); seen.add(o.strip())
tail_opts = [o for o in base_opts if o.strip() in ("No appointment booked / no action taken", "Other")]
main_opts = [o for o in base_opts if o.strip() not in ("No appointment booked / no action taken", "Other")]
CANONICAL = "\n".join(main_opts + extras + tail_opts)

# ------------------------------------------------------------- node makers --
shell = copy.deepcopy(trees["NHS Health Check"])
proto = copy.deepcopy(shell["nodes"][str(shell["root_node_id"])])

def base_node(nid, ntype, name, page_title=None):
    n = copy.deepcopy(proto)
    n.update({
        "type": ntype, "is_root": "0", "node_name": name,
        "page_title": name if page_title is None else page_title,
        "content": "", "question": "", "project_node_id": str(nid),
        "display_order": str(nid), "buttons": [], "formfields": [],
        "data_connected_objects": [], "app_messages": [],
        "continuation_node_id": "0", "open_tree_id": "0",
        "open_tree_node_id": "0", "return_tree_node_id": "0",
        "advanced_logic_node": "0", "score_var": "", "notes": "",
    })
    return n

def btn(text, link, rank=1, hover=""):
    return {"button_text": text, "hover_text": hover, "button_link": str(link),
            "rank": str(rank), "button_data": "", "logic_expression": "",
            "wizard_skip": "0", "value": "0", "op": "", "updated": "0"}

def ff(ftype, name, label, options="", required="0", rank=1, config=""):
    return {"type": ftype, "name": name, "label": label, "label_type": "L",
            "options": options, "hidden_value": "", "custom_regex": "",
            "inline": "0", "required": required, "score_var": "",
            "checkbox_score": "1", "scores": "", "rank": str(rank), "config": config}

# ------------------------------------------------------------ the ONE script --
UNIFIED = (
"""// ============================================================================
// PENROSE OUTCOME TAIL - THE script. ALL data and logic live here.
// Editing any outcome in any of the six trees = editing ONE entry in OUTCOMES.
// Inputs:  outcome_key (preferred)  OR  source_tree + suggested_outcome (legacy)
// Outputs: outcome_screen_html + source_netting_html (transforms);
//          suggested_outcome, outcome_title, suggested_outcome_text,
//          outcome_found, alt_* staging for the swap script (form data)
// ============================================================================

// ---------------- DATA: outcome catalog (edit outcomes HERE) ----------------
// entry: { code, title, sug, html, src, variant?, alt? }
// variant "p1_adult"/"p1_child" marks Pharmacy First referral outcomes;
// alt names the fallback entry the swap script applies (refused / age 0-4).
var OUTCOMES = %s;

// ---------------- DATA: per-tree safety netting ----------------
var NETTING = %s;

// ---------------- DATA: legacy suggested_outcome code -> key ----------------
var CODE_TO_KEY = %s;

// ---------------- LOGIC ----------------
var PREFIXES = { "wh_": "womens_health", "paeds_": "paeds", "p1_": "pharmacy_first",
                 "rash_": "rash", "nhs_": "nhs_check", "con_": "contraception" };
var NAMES = { "women": "womens_health", "paed": "paeds", "pharmacy": "pharmacy_first",
              "rash": "rash", "nhs": "nhs_check", "contracep": "contraception" };

var key = String(ZT.getVariableValue("outcome_key", "")).trim().toLowerCase();
var srcVar = String(ZT.getVariableValue("source_tree", "")).trim().toLowerCase();
var legacyCode = String(ZT.getVariableValue("suggested_outcome", ""));

var src = "";
for (var p in PREFIXES) { if (key.indexOf(p) === 0) { src = PREFIXES[p]; } }
if (!src && srcVar) { for (var nm in NAMES) { if (srcVar.indexOf(nm) >= 0) { src = NAMES[nm]; } } }
if (!OUTCOMES[key] && src && legacyCode && CODE_TO_KEY[src] && CODE_TO_KEY[src][legacyCode]) {
    key = CODE_TO_KEY[src][legacyCode];
}

var o = OUTCOMES[key];
var found = !!o;

function noticeBox(title, body) {
    return "<div style='background:#eef2ff;border:1px solid #c7d2fe;border-radius:8px;" +
           "padding:12px 16px;margin:10px 0;'><strong>" + title + "</strong><br>" + body + "</div>";
}

var html = "";
if (found) {
    html = o.html;
    if (o.variant) {
        html += noticeBox("Pharmacy First referral",
            "If the patient has ALREADY trialled Pharmacy First, use the 'Patient has " +
            "already trialled Pharmacy First' button below. If the pharmacy refused to " +
            "see the patient" + (o.variant === "p1_child" ? " or the patient is 0-4 years old" : "") +
            ", use 'Pharmacy First not possible - record alternate outcome'.");
    }
} else {
    o = { code: "", title: "", sug: "", html: "", src: src };
    html = noticeBox("Outcome not recognized",
        "This session arrived without a recognizable outcome key. The calling tree " +
        "should set outcome_key (or legacy source_tree + suggested_outcome) before " +
        "routing here - check its claude.md for the key registry. " +
        "You can still record the outcome manually below.");
}

ZT.setFormData("outcome_found", found);
ZT.setFormData("outcome_key", key);
ZT.setFormData("suggested_outcome", o.code);
ZT.setFormData("outcome_title", o.title);
ZT.setFormData("suggested_outcome_text", o.sug);
ZT.setTransformData("outcome_screen_html", html);
ZT.setTransformData("source_netting_html", (o.src && NETTING[o.src]) ? NETTING[o.src] : "");

var a = (found && o.alt) ? OUTCOMES[o.alt] : null;
ZT.setFormData("alt_code", a ? a.code : "");
ZT.setFormData("alt_title", a ? a.title : "");
ZT.setFormData("alt_sug", a ? a.sug : "");
ZT.setTransformData("alt_screen_html", a ? a.html : "");
ZT.log("outcome-tail: key=" + key + " src=" + (src || "UNKNOWN") + " found=" + found +
       (found && o.variant ? " variant=" + o.variant : ""));
""") % (json.dumps(OUTCOMES, ensure_ascii=True, indent=1, sort_keys=True),
        json.dumps(NETTING, ensure_ascii=True, indent=1, sort_keys=True),
        json.dumps(dict(CODE_TO_KEY), ensure_ascii=True, indent=1, sort_keys=True))

SWAP = r"""// Swap to the alternate outcome staged by the unified script (used by the
// 'Pharmacy First not possible' escape button; safe no-op when no alternate).
var altCode = String(ZT.getVariableValue("alt_code", ""));
if (altCode) {
    ZT.setFormData("suggested_outcome", altCode);
    ZT.setFormData("outcome_title", ZT.getVariableValue("alt_title", ""));
    ZT.setFormData("suggested_outcome_text", ZT.getVariableValue("alt_sug", ""));
    ZT.setTransformData("outcome_screen_html", transforms.alt_screen_html || "");
    ZT.setFormData("alt_code", "");
    ZT.log("outcome-tail: swapped to alternate outcome " + altCode);
} else {
    ZT.setTransformData("outcome_screen_html",
        (transforms.outcome_screen_html || "") +
        "<div style='background:#fff7ed;border:1px solid #fed7aa;border-radius:8px;" +
        "padding:12px 16px;margin:10px 0;'><strong>No alternate outcome defined</strong>" +
        "<br>This outcome has no Pharmacy First alternate - continue with the outcome shown.</div>");
    ZT.log("outcome-tail: swap requested but no alternate staged");
}
"""

# ------------------------------------------------------------------ nodes --
nodes = {}
def add(n): nodes[n["project_node_id"]] = n

n1 = base_node(1, "Script", "Resolve outcome and build screen")
n1["is_root"] = "1"
n1["content"] = UNIFIED
n1["continuation_node_id"] = "2"
add(n1)

n2 = base_node(2, "Content", "Outcome")
n2["content"] = (
    "${transforms.outcome_screen_html}"
    "<p>[[COPY-AREA]]</p>"
    "<p>${outcome_title} suggested outcome:<br>${suggested_outcome_text}</p>"
    "<p>[[/COPY-AREA]]</p>"
    "<p><a class=\"btn btn-success\" style=\"cursor:pointer;\" "
    "onclick=\"copy_to_clipboard();\">Copy to Clipboard</a></p>")
n2["question"] = "Select the final outcome, then submit."
n2["formfields"] = [
    ff("select", "outcome", "Final outcome", CANONICAL, "1", 1, "{\"filterable\":true}"),
    ff("multiline", "other_outcome", "Other outcome details (required when the final outcome is Other)", "", "0", 2),
]
n2["buttons"] = [
    btn("Submit outcome", 3, 1),
    btn("Patient has already trialled Pharmacy First", 4, 2, "Pharmacy First referral outcomes only"),
    btn("Pharmacy First not possible - record alternate outcome", 5, 3,
        "Pharmacy refused / patient is 0-4 - Pharmacy First referral outcomes only"),
]
add(n2)

n3 = base_node(3, "Content", "Safety Netting")
n3["content"] = "${transforms.source_netting_html}"
add(n3)

n4 = base_node(4, "Tree", "Open Pharmacy First tree")
n4["open_tree_id"] = PHARMACY_FIRST_TREE_ID
add(n4)

n5 = base_node(5, "Script", "Swap to alternate outcome")
n5["content"] = SWAP
n5["continuation_node_id"] = "2"
add(n5)

reg_lines = []
cur = None
for tname, key, title, code, srcids in sorted(registry):
    if tname != cur:
        reg_lines += ["\n### %s\n" % tname,
                      "| outcome_key | title | suggested_outcome code | source node(s) |",
                      "|---|---|---|---|"]
        cur = tname
    reg_lines.append("| `%s` | %s | %s | %s |" % (key, title or "-", code or "-", srcids))
REGISTRY_MD = "\n".join(reg_lines)

CLAUDE_MD = """# claude.md - Penrose Outcome Tail (Unified)

## Purpose
The single shared outcome tail for Penrose's six disparate triage trees
(Women's Health, Paediatric Cough/Cold/Fever, Pharmacy First, Rash, NHS Health
Check, Contraception). Source trees keep their own clinical logic; every
terminal path sets `outcome_key` and dispatches here via a Tree node. ONE
script owns all data + logic and builds the outcome screen HTML dynamically;
ONE content node displays it. Any outcome edit in any tree is made HERE.

## Architecture (6 nodes)
1 (Script, root) Resolve outcome and build screen -> 2
    THE script: OUTCOMES catalog (147 entries, all six trees), NETTING map,
    CODE_TO_KEY legacy map, resolver, screen-HTML builder (advice / P1-referral
    escape guidance / unknown-key notice), alt_* staging.
2 (Content) Outcome -> Submit=3, Already trialled P1=4, P1 not possible=5
    ${transforms.outcome_screen_html} + copy area; native fields: outcome
    (canonical select, required) + other_outcome (optional multiline - fill
    when outcome is Other; can be flipped to a conditional field in the editor).
3 (Content) Safety Netting - ${transforms.source_netting_html} (end)
4 (Tree) Open Pharmacy First tree (824824140)
5 (Script) Swap to alternate outcome -> 2 (safe no-op notice when no alternate)
6 (Content) claude.md - this node, unlinked

The 5 -> 2 return edge is the ONE intentional revisit (escape button rebuilds
the screen); everything else is forward-only.

## Integration contract (for the six source trees)
- Preferred: fold `ZT.setFormData("outcome_key", "<key>")` into the path's
  eval script, then a Tree node -> this tree (no return; this tail ends the
  session with Safety Netting, same as the source tails).
- Legacy fallback: set `source_tree` (any string containing women/paed/
  pharmacy/rash/nhs/contracep) + the existing `suggested_outcome` hidden-field
  code; repeated codes resolve to the first catalog entry.

## Data dictionary
- In: outcome_key | source_tree + suggested_outcome (legacy)
- Form out: outcome_found, suggested_outcome, outcome_title,
  suggested_outcome_text, alt_code/alt_title/alt_sug, outcome (agent),
  other_outcome (agent)
- Transforms: outcome_screen_html, source_netting_html, alt_screen_html
- Tree setting: merge_vars_not_fixed = "1" (REQUIRED, do not switch off)

## Conventions & gotchas
- Catalog entries hold VERBATIM clinical copy from the Jul 17 2026 exports.
- The two escape buttons render on every outcome (buttons are static); the
  screen HTML tells agents when they apply, hover text reinforces it, and the
  swap script is a safe no-op with a notice when no alternate exists.
- other_outcome is optional (not conditional) in the generated JSON - no
  org-proven conditional config existed in the exports; flip it in the editor.
- Regenerate with build_outcome_tail.py; verify with verify_outcome_tail.js.

## Outcome key registry
%s

## Changelog
- 2026-07-16 - Claude (Brent) - v1: 201 source outcome screens -> 19-node tree.
- 2026-07-16 - Claude (Brent) - v2 (Brent's flattening): one unified script
  (was nodes 2-8), one dynamic Outcome content screen (was 9/10/11/12/20),
  snake 10->13->16->17 collapsed (other_outcome on the same screen, Safety
  Netting is the single terminal). Titles set on every node. 19 -> 6 nodes.
""" % REGISTRY_MD

n6 = base_node(6, "Content", "claude.md", page_title="claude.md")
n6["content"] = CLAUDE_MD
n6["hide_from_search"] = "1"
add(n6)

# ---------------------------------------------------------------- project --
out = shell
out["id"] = "417000001"
out["name"] = "Penrose Outcome Tail (Unified)"
out["description"] = ("Shared outcome tail for the six Penrose triage trees. One script owns all "
                      "outcome data + logic and builds the screen HTML; one content node renders it. "
                      "Sources set outcome_key and dispatch here via a Tree node. "
                      "Generated from the Jul 17 2026 exports.")
out["tags"] = "outcome-tail,shared,penrose"
out["root_node_id"] = 1
out["merge_vars_not_fixed"] = "1"
out["nodes"] = nodes
out["predefined_vars"] = []

# ------------------------------------------------------------------ lint --
for k, n in nodes.items():
    assert n["project_node_id"] == k == n["display_order"], k
    assert n["node_name"] and n["page_title"], ("missing title", k)
    for fk, fv in n.items():
        assert not isinstance(fv, (bool, int, float)), (k, fk, type(fv))
    for b in n["buttons"]:
        assert b["button_link"] in nodes, (k, "button ->", b["button_link"])
    c = str(n.get("continuation_node_id", "0"))
    if c not in ("0", ""):
        assert c in nodes, (k, "continuation ->", c)
ids = [n["project_node_id"] for n in nodes.values()]
assert len(ids) == len(set(ids))
# graph: forward-only except the documented 5->2 revisit
adj = {"1": ["2"], "2": ["3", "4", "5"], "3": [], "4": [], "5": ["2"]}
for k, n in nodes.items():
    if k == "6": continue
    outs = set(str(b["button_link"]) for b in n["buttons"])
    c = str(n.get("continuation_node_id", "0"))
    if c not in ("0", ""): outs.add(c)
    assert outs == set(adj[k]), (k, outs)

with open(OUT_JSON, "w") as f:
    json.dump(out, f, indent=1)  # single workflow dict - import requirement

with open("key_registry.md", "w") as f:
    f.write("# Outcome key registry (integration contract for source trees)\n" + REGISTRY_MD + "\n")

import os
print("nodes:", len(nodes), "| catalog entries:", len(OUTCOMES),
      "| canonical options:", len(CANONICAL.split("\n")),
      "| variants:", sum(1 for e in OUTCOMES.values() if e.get("variant")))
print("unified script size: %.1f KB | JSON: %.1f KB" %
      (len(UNIFIED) / 1024.0, os.path.getsize(OUT_JSON) / 1024.0))
print("Generated OK (v2)")
