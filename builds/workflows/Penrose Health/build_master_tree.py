#!/usr/bin/env python3
"""
Penrose MH Master Triage - consolidated tree generator (v3).

v3 rule: ONLY mechanics proven in Penrose's own production trees.
- Question screens are verbatim copies of the original nodes; ACTION BUTTONS
  route between them (start -> outcome guaranteed by graph, not by a script).
- Risk scoring uses the native score_var/button-value mechanism and the
  original op-based calculator node, copied verbatim.
- Checkbox screens route via advanced-logic Scoring nodes using the same
  expressions style as the originals (no error nodes, no mismatch possible).
- Scripts only STAGE DATA: init (condition param), per-condition entry
  (safety netting), per-outcome setters (suggested outcome + display HTML).
  advanced_logic_node="1" + continuation fallback on every logic Scoring node
  (this flag was missing in v2 - proven nodes all have it).
- The consolidated wins kept: one tree, ?condition= entry, ONE outcome screen
  with the single canonical outcome list, ONE Other/Safety-Netting tail,
  origin-following safety netting.

Node map:
  1 Init(S)  2 picker?(L)  3 Picker(C)  4 condition router(L)
  5-8 Tree links: nav / panic / referral / repeat meds
  SMI:   10 entry(S) 11 purpose 12 emergency checks 13 route(L)
  Adult: 20 entry(S) 21 reason 22 choices 23 adhd 24 medreview 25 seen 26 safety
  Dep:   30 entry(S) 31 new sympt 32 postcard 33 medication
  CYP:   40 entry(S) 41-53 (emergency, crisis lines, risk intro, willing,
         non-verbal check, non-verbal symptoms + 47 route(L), undiagnosed,
         worsening, start meds, urgent script, school, viability)
  Risk:  60 entry(S) 61 consent 62 text 63-71 checks 72 task
         73 calculator(L, verbatim) 74 moderate
  Outcome setters (S): 111, 116-135
  Tail: 90 Outcome 91 Other?(L) 92 Other text 93 Safety Netting (terminal)
"""
import json, re, copy, html

SRC = "/sessions/wonderful-awesome-volta/mnt/uploads/Selected_from_Penrose Health (2)_2026-07-13 (3).json"
SMI_SRC = "/sessions/wonderful-awesome-volta/mnt/uploads/Severe Mental Illness Review_1784041090076.json"  # fresher export (Jul 14)
SHELL = "/sessions/wonderful-awesome-volta/mnt/uploads/Severe Mental Illness Review_1783978572627.json"
OUT_DIR = "."

data = json.load(open(SRC))
trees = {str(p["id"]): p for p in data["projects"]}
_, ADULT, DEP, CYP, RISK = (trees[k] for k in ("119519550", "301156332", "425412984", "685738840", "781007709"))
SMI = json.load(open(SMI_SRC))  # single-tree export; same node shape

def src_node(tree, nid):
    return tree["nodes"][str(nid)]

def fflist(node_dict):
    """Formfields as a list of dicts (some exports include stray strings)."""
    ffs = node_dict.get("formfields") or []
    if isinstance(ffs, dict):
        ffs = list(ffs.values())
    return [f for f in ffs if isinstance(f, dict)]

IFRAME_RE = re.compile(r"##iframe_contents:\s*(\S+)\s*(width=\S+)?\s*(height=\S+)?\s*##")
COPY_RE = re.compile(r"\[\[COPY-AREA\]\](.*?)\[\[/COPY-AREA\]\]", re.S)

def convert_iframes(h):
    def rep(m):
        return ('<iframe src="%s" style="width:100%%;height:600px;border:1px solid #e5e7eb;'
                'border-radius:8px;background:#fff;"></iframe>' % m.group(1))
    return IFRAME_RE.sub(rep, h or "")

def strip_tags(h):
    t = re.sub(r"<br\s*/?>", "\n", h or "")
    t = re.sub(r"</p>", "\n", t)
    t = re.sub(r"<[^>]+>", " ", t)
    t = html.unescape(t)
    t = re.sub(r"[ \t]+", " ", t)
    t = re.sub(r"\n\s*", "\n", t).strip()
    return t

def harvest_outcome(tree, nid):
    n = src_node(tree, nid)
    content = n.get("content") or ""
    m = COPY_RE.search(content)
    suggested_text = strip_tags(m.group(1)) if m else strip_tags(n.get("page_title") or "")
    content = COPY_RE.sub("", content).replace("Copy to Clipboard", "")
    content = convert_iframes(content)
    code = ""
    for f in fflist(n):
        if f.get("type") == "hidden" and f.get("name") == "suggested_outcome":
            code = f.get("hidden_value") or ""
    return {"title": n.get("page_title") or "", "code": code,
            "suggested_text": suggested_text, "html": content,
            "src": "%s #%s" % (tree["name"], nid)}

# ------------------------------------------------------------- node makers --
shell = json.load(open(SHELL))
proto = copy.deepcopy(shell["nodes"]["1"])

def base_node(nid, ntype, name):
    n = copy.deepcopy(proto)
    n.update({
        "type": ntype, "is_root": "0", "node_name": name, "page_title": "",
        "content": "", "question": "", "project_node_id": str(nid),
        "display_order": str(nid), "buttons": [], "formfields": [],
        "data_connected_objects": [], "app_messages": [],
        "continuation_node_id": "0", "open_tree_id": "0",
        "open_tree_node_id": "0", "return_tree_node_id": "0",
        "advanced_logic_node": "0", "score_var": "",
    })
    return n

def btn(text, link, logic="", op="", rank=1, value="0", button_data=""):
    return {"button_text": text, "hover_text": "", "button_link": str(link),
            "rank": str(rank), "button_data": button_data, "logic_expression": logic,
            "wizard_skip": "0", "value": value, "op": op, "updated": "0"}

def ff(ftype, name, label, options="", required="0", hidden_value="", rank=1, config=""):
    return {"type": ftype, "name": name, "label": label, "label_type": "L",
            "options": options, "hidden_value": hidden_value, "custom_regex": "",
            "inline": "0", "required": required, "score_var": "",
            "checkbox_score": "1", "scores": "", "rank": str(rank), "config": config}

def copy_node(tree, sid, new_id, new_links=None, replace_buttons=None):
    """Verbatim copy of a proven node; only ids and button targets remapped."""
    n = copy.deepcopy(src_node(tree, sid))
    n["project_node_id"] = str(new_id)
    n["display_order"] = str(new_id)
    n["is_root"] = "0"
    n["notes"] = ("Copied verbatim from '%s' node %s" % (tree["name"], sid))
    if replace_buttons is not None:
        n["buttons"] = replace_buttons
    elif new_links is not None:
        btns = n.get("buttons", [])
        btns = btns if isinstance(btns, list) else list(btns.values())
        assert len(btns) == len(new_links), (tree["name"], sid, len(btns), len(new_links))
        for b, tgt in zip(btns, new_links):
            b["button_link"] = str(tgt)
        n["buttons"] = btns
    # keep the continuation fallback pointing inside THIS tree: use the
    # default/last button's remapped target (source continuations reference
    # old node ids; logic Scoring nodes always need an in-tree fallback)
    btns = n.get("buttons", [])
    btns = btns if isinstance(btns, list) else list(btns.values())
    has_logic = any(b.get("logic_expression") for b in btns)
    if str(n.get("continuation_node_id", "0")) not in ("0", "") or has_logic:
        deflt = next((b for b in btns if b.get("op") == "def"), btns[-1] if btns else None)
        n["continuation_node_id"] = str(deflt["button_link"]) if deflt else "0"
    return n

def script_node(nid, name, code, continuation):
    n = base_node(nid, "Script", name)
    n["content"] = code
    n["continuation_node_id"] = str(continuation)
    return n

def logic_node(nid, name, rules, default):
    """Advanced-logic Scoring node (proven flags: advanced_logic_node=1,
    continuation fallback). rules = [(expression, target)]."""
    n = base_node(nid, "Scoring", name)
    n["advanced_logic_node"] = "1"
    n["continuation_node_id"] = str(default)
    bs = [btn(expr, tgt, expr, "", i + 1) for i, (expr, tgt) in enumerate(rules)]
    bs.append(btn("", default, "", "def", len(rules) + 1))
    n["buttons"] = bs
    return n

def q_text(tree, sid):
    return strip_tags(src_node(tree, sid).get("question") or "")

def content_of(tree, sid):
    return convert_iframes(src_node(tree, sid).get("content") or "")

def merged_node(nid, name, content_blocks, fields, buttons):
    """ONE content node capturing several values (core building theme: never
    stack content nodes; combine questions into one screen, route with a
    logic node). content_blocks: list of html strings; fields: formfields."""
    n = base_node(nid, "Content", name)
    n["content"] = "".join(b for b in content_blocks if b)
    for i, f in enumerate(fields):
        f["rank"] = str(i + 1)
    n["formfields"] = fields
    n["buttons"] = buttons
    n["notes"] = "Merged screen (multi-question) - see generator for sources"
    return n

def yn_select(var, label, required="1"):
    return ff("select", var, label, "Yes\nNo", required)

def eval_script(nid, name, code, continuation):
    """Evaluate script: reads form/checkbox values, computes booleans for the
    following logic node (house pattern: content -> script -> logic; every
    logic button checks exactly one script-computed boolean)."""
    return script_node(nid, name, code, continuation)

BOX_HELPER = ('const box = (n) => { const v = ZT.getVariableValue(n, ""); '
              'return v !== "" && v !== "0"; };\n'
              'const yes = (n) => ZT.getVariableValue(n, "").trim().toLowerCase() === "yes";\n')

# ------------------------------------------------- canonical outcome list ---
def get_select_options(tree, nid):
    for f in fflist(src_node(tree, nid)):
        if f.get("type") == "select" and f.get("name") == "outcome":
            return [o for o in (f.get("options") or "").splitlines() if o.strip()]
    return []

canonical = get_select_options(SMI, 5)
for e in ["Duty Doctor list (London Bridge)", "Clinical Oversight"]:
    if e not in canonical:
        canonical.insert(canonical.index("Other"), e)
CANONICAL_OUTCOMES = "\n".join(canonical)

# ------------------------------------------------------------- scripts ------
LABEL_MAP = {
    "smi": "smi", "depression": "depression", "adult_mh": "adult_mh",
    "cyp": "cyp", "risk": "risk",
    "Severe Mental Illness Review": "smi",
    "Adult Mental Health": "adult_mh",
    "Depression Review": "depression",
    "Children and Young People Mental Health and Learning Disability": "cyp",
    "MH Risk Assessment": "risk",
}

INIT_SCRIPT = """// Node 1 - Init (ROOT). Penrose MH Master Triage v3.
// Normalizes the `condition` query param / picker choice, and defaults all
// display transforms to empty strings so nothing renders until set.
const LABEL_MAP = __LABEL_MAP__;

ZT.setTransformData("outcome_html", "");
ZT.setTransformData("sn_html", "");

let raw = ZT.getVariableValue("condition", "").trim();
let key = LABEL_MAP[raw] || LABEL_MAP[raw.toLowerCase()] || "";

let needsPicker = true;
if (key) {
    needsPicker = false;
    ZT.setFormData("condition", key);
}
ZT.setFormData("needs_picker", needsPicker);
// house pattern: logic nodes evaluate exactly one script-computed boolean
ZT.setFormData("cond_smi", key === "smi");
ZT.setFormData("cond_adult_mh", key === "adult_mh");
ZT.setFormData("cond_depression", key === "depression");
ZT.setFormData("cond_cyp", key === "cyp");
ZT.setFormData("cond_risk", key === "risk");
ZT.setFormData("risk_score", 0);
ZT.log("init: condition=" + key + " needsPicker=" + needsPicker);
""".replace("__LABEL_MAP__", json.dumps(LABEL_MAP, ensure_ascii=True))

def entry_script(cond_key, label, netting_html):
    return ("// Entry - %s. Stages the safety-netting text for this condition.\n"
            "// Crisis handoffs into the risk questions keep the origin's netting\n"
            "// because they bypass the risk entry node.\n"
            "ZT.setFormData(\"condition\", %s);\n"
            "ZT.setFormData(\"condition_label\", %s);\n"
            "ZT.setTransformData(\"sn_html\", %s);\n"
            % (label, json.dumps(cond_key), json.dumps(label),
               json.dumps(netting_html, ensure_ascii=True))).replace(
        "ZT.setFormData(\"condition\", %s);" % label,
        "ZT.setFormData(\"condition\", %s);" % json.dumps(cond_key))

def setter_script(cond, key, o):
    hhtml = ("<h3>" + html.escape(o["title"]) + "</h3>"
             "<p><b>Suggested outcome:</b><br>"
             + html.escape(o["suggested_text"]).replace("\n", "<br>") + "</p>"
             + o["html"])
    return ("// Outcome setter - %s / %s (source: %s)\n"
            "// Stages the shared Outcome screen (node 90). Data only - the\n"
            "// canonical Final outcome select lives once, on node 90.\n"
            "ZT.setFormData(\"outcome_key\", %s);\n"
            "ZT.setFormData(\"suggested_outcome\", %s);\n"
            "ZT.setFormData(\"suggested_outcome_text\", %s);\n"
            "ZT.setFormData(\"outcome_title\", %s);\n"
            "ZT.setTransformData(\"outcome_html\", %s);\n"
            % (cond, key, o["src"],
               json.dumps(cond + ":" + key),
               json.dumps(o["code"] or o["title"], ensure_ascii=True),
               json.dumps(o["suggested_text"] or o["title"], ensure_ascii=True),
               json.dumps(o["title"], ensure_ascii=True),
               json.dumps(hhtml, ensure_ascii=True)))

NETTING = {
    "smi": convert_iframes(src_node(SMI, 8).get("content") or ""),
    "adult_mh": convert_iframes(src_node(ADULT, 28).get("content") or ""),
    "depression": convert_iframes(src_node(DEP, 8).get("content") or ""),
    "cyp": convert_iframes(src_node(CYP, 4).get("content") or ""),
    "risk": convert_iframes(src_node(ADULT, 28).get("content") or ""),  # generic
}
LABELS = {"smi": "Severe Mental Illness Review", "adult_mh": "Adult Mental Health",
          "depression": "Depression Review",
          "cyp": "Children and Young People Mental Health and Learning Disability",
          "risk": "MH Risk Assessment"}

# ------------------------------------------------------------- build tree ---
nodes = {}

def add(n):
    nodes[n["project_node_id"]] = n

# core - the condition drop-down IS the starting node (root = 3)
picker = base_node(3, "Content", "Select condition (START)")
picker["is_root"] = "1"
picker["question"] = "Which triage POSTcard is this call for?"
picker["content"] = "<p>Select the condition for this call, then press Continue.</p>"
picker["formfields"] = [ff("select", "condition", "Condition / use case",
                           "\n".join(LABELS.values()), "1")]
picker["buttons"] = [btn("Continue", 1)]
add(picker)
add(script_node(1, "Init - map condition selection", INIT_SCRIPT, 2))
add(logic_node(2, "Route: valid condition?", [("needs_picker == true", 3)], 4))
add(logic_node(4, "Route: condition", [
    ("cond_smi == true", 10), ("cond_adult_mh == true", 20),
    ("cond_depression == true", 30), ("cond_cyp == true", 40),
    ("cond_risk == true", 60)], 3))

# external tree links (verbatim copies of the original Tree nodes)
add(copy_node(DEP, 4, 5))       # Navigation tree
add(copy_node(ADULT, 2, 6))     # Panic attack tree
add(copy_node(ADULT, 7, 7))     # Referral chasing tree
add(copy_node(ADULT, 10, 8))    # Repeat medication tree

# --- SMI ---
# MERGED: purpose info + emergency checkboxes = one screen (was 2 contents in a row)
add(script_node(10, "Entry - SMI", entry_script("smi", LABELS["smi"], NETTING["smi"]), 11))
# Full original functionality, evaluated EXACTLY like the source tree:
# checkboxes (native form fields) + the two verbatim assertion ACTION BUTTONS,
# then the source's own scoring nodes copied verbatim - checkbox expressions
# ((feelsUnsafe == 0) && ...) are the org-proven way to evaluate ticks.
smi_fields = [dict(f) for f in fflist(src_node(SMI, 2)) if f.get("type") == "checkbox"]
smi_btns = [dict(b) for b in (src_node(SMI, 2)["buttons"] if isinstance(src_node(SMI, 2)["buttons"], list)
                              else list(src_node(SMI, 2)["buttons"].values()))]
smi_btns[0]["button_link"] = "13"   # Yes - patient has some emergency symptoms
smi_btns[1]["button_link"] = "14"   # No - patient has no emergency symptoms
add(merged_node(11, "SMI - purpose + emergency check",
    [content_of(SMI, 1), "<p><b>" + q_text(SMI, 2) + "</b></p>", content_of(SMI, 2)],
    smi_fields, smi_btns))
# source scoring 3 'emerg sx YES': no ticks -> Error-YES; else -> risk consent
add(copy_node(SMI, 3, 13, new_links=[15, 61]))
# source scoring 4 'emerg sx NO': no ticks -> MHN outcome; else -> Error-NO
add(copy_node(SMI, 4, 14, new_links=[111, 16]))
add(copy_node(SMI, 9, 15))    # Error - YES (verbatim; agent uses Back)
add(copy_node(SMI, 10, 16))   # Error - NO (verbatim; agent uses Back)

# --- Adult MH ---
add(script_node(20, "Entry - Adult MH", entry_script("adult_mh", LABELS["adult_mh"], NETTING["adult_mh"]), 21))
add(copy_node(ADULT, 23, 21, new_links=[61, 40, 22]))   # reason for call (crisis branch stays fast)
add(copy_node(ADULT, 1, 22, new_links=[116, 23, 6, 24, 119, 25]))  # choices
add(copy_node(ADULT, 4, 23, new_links=[117, 118, 7]))   # adhd
add(copy_node(ADULT, 9, 24, new_links=[8, 120]))        # medication review
# MERGED: seen-before + safety check = one screen + logic (was 2 screens for the No path)
add(merged_node(25, "Adult MH - seen before + safety check",
    [content_of(ADULT, 14),
     "<p><i>The safety question applies when the patient has not been seen before.</i></p>"],
    [yn_select("seen_before", q_text(ADULT, 12)),
     ff("select", "safety_feeling", q_text(ADULT, 14) or "Is the patient feeling safe at the moment?",
        "Feeling safe\nFeeling suicidal or unsafe", "1")],
    [btn("Continue", 27)]))
add(eval_script(27, "Evaluate - Adult seen/safety", BOX_HELPER +
    'const goSeen = yes("seen_before");\n'
    'const safety = ZT.getVariableValue("safety_feeling", "").trim().toLowerCase();\n'
    'const goSafe = !goSeen && safety === "feeling safe";\n'
    'ZT.setFormData("adult_go_seen", goSeen);\n'
    'ZT.setFormData("adult_go_safe", goSafe);\n'
    'ZT.log("adult eval: seen=" + goSeen + " safe=" + goSafe);\n', 26))
add(logic_node(26, "Route: Adult seen/safety", [
    ("adult_go_seen == true", 121),
    ("adult_go_safe == true", 122)], 61))   # default = unsafe -> risk consent (safe failure mode)

# --- Depression ---
# MERGED: new-symptoms + medication = one screen + logic (Brent, Jul 13)
add(script_node(30, "Entry - Depression", entry_script("depression", LABELS["depression"], NETTING["depression"]), 31))
add(merged_node(31, "Depression - new symptoms + medication",
    [content_of(DEP, 2),
     "<p><i>The medication question applies when there are no new symptoms.</i></p>"],
    [yn_select("new_symptoms", q_text(DEP, 2)),
     yn_select("about_medication", q_text(DEP, 9))],
    [btn("Continue", 34)]))
add(copy_node(DEP, 3, 32, new_links=[5]))                # different POSTcard -> nav tree
add(eval_script(34, "Evaluate - Depression answers", BOX_HELPER +
    'const goPostcard = yes("new_symptoms");\n'
    'const goPharmacist = !goPostcard && yes("about_medication");\n'
    'ZT.setFormData("dep_go_postcard", goPostcard);\n'
    'ZT.setFormData("dep_go_pharmacist", goPharmacist);\n'
    'ZT.log("depression eval: postcard=" + goPostcard + " pharmacist=" + goPharmacist);\n', 33))
add(logic_node(33, "Route: Depression", [
    ("dep_go_postcard == true", 32),
    ("dep_go_pharmacist == true", 123)], 124))

# --- CYP ---
add(script_node(40, "Entry - CYP", entry_script("cyp", LABELS["cyp"], NETTING["cyp"]), 41))
add(copy_node(CYP, 1, 41, new_links=[42, 44]))           # emergency
# MERGED: crisis lines + risk intro = one screen (was 2 info screens in a row)
add(merged_node(42, "CYP - crisis lines + risk assessment intro",
    [content_of(CYP, 17), content_of(CYP, 10)],
    [], [btn("Go to risk assessment", 63)]))
add(copy_node(CYP, 22, 44, new_links=[45, 125]))         # willing to discuss
# Non-verbal path evaluated EXACTLY like the source tree (verbatim screens,
# assertion buttons, and checkbox scoring expressions)
# Non-verbal check (verbatim): Yes -> symptom screen, No -> undiagnosed screen
add(copy_node(CYP, 41, 45, new_links=[46, 48]))
# Symptom screen (verbatim: checkboxes + the original Yes/No assertion buttons)
add(copy_node(CYP, 24, 46, new_links=[57, 58]))
# source scoring 44 'Non verbal symptom check - YES' (verbatim expressions):
# none ticked -> Error-YES; not_moving combos -> Emergency; others -> Paramedic
add(copy_node(CYP, 44, 57, new_links=[17, 126, 127, 126, 126]))
# source scoring 45 'Non verbal symptom check - NO' (verbatim expressions):
# any ticked -> Error-NO; none -> undiagnosed screen
add(copy_node(CYP, 45, 58, new_links=[18, 48, 48]))
add(copy_node(CYP, 42, 17))   # Error - YES (verbatim; agent uses Back)
add(copy_node(CYP, 43, 18))   # Error - NO (verbatim; agent uses Back)
# MERGED: undiagnosed + worsening = one screen + eval script + logic
add(merged_node(48, "CYP - undiagnosed + worsening",
    [content_of(CYP, 25)],
    [yn_select("undiagnosed_condition", q_text(CYP, 25)),
     yn_select("worsening_condition", q_text(CYP, 26))],
    [btn("Continue", 55)]))
add(eval_script(55, "Evaluate - CYP condition", BOX_HELPER +
    'const goSchool = yes("undiagnosed_condition") || yes("worsening_condition");\n'
    'ZT.setFormData("cyp_go_school", goSchool);\n'
    'ZT.log("cyp condition eval: school=" + goSchool);\n', 49))
add(logic_node(49, "Route: CYP condition", [
    ("cyp_go_school == true", 52)], 50))
# MERGED: start meds + urgent script = one screen + eval script + logic
add(merged_node(50, "CYP - start meds + urgent script",
    [],
    [yn_select("start_medications", q_text(CYP, 27)),
     yn_select("urgent_script", q_text(CYP, 28))],
    [btn("Continue", 56)]))
add(eval_script(56, "Evaluate - CYP medication", BOX_HELPER +
    'const goGp = yes("start_medications");\n'
    'const goUrgent = !goGp && yes("urgent_script");\n'
    'ZT.setFormData("cyp_go_gp_meds", goGp);\n'
    'ZT.setFormData("cyp_go_urgent", goUrgent);\n'
    'ZT.log("cyp meds eval: gp=" + goGp + " urgent=" + goUrgent);\n', 51))
add(logic_node(51, "Route: CYP medication", [
    ("cyp_go_gp_meds == true", 128),
    ("cyp_go_urgent == true", 129)], 130))
# MERGED: attending school + SENCO viability guidance = one screen (all roads -> GP outcome)
add(merged_node(52, "CYP - school + SENCO guidance",
    ["<p><b>If the patient attends a primary or secondary school:</b></p>", content_of(CYP, 31)],
    [yn_select("attends_school", q_text(CYP, 29))],
    [btn("Continue", 128)]))

# --- Risk (score mechanics copied verbatim; suicide/harm chain stays one-at-a-
# time BY DESIGN: the native short-circuit means a high-risk answer skips
# straight to the task - fewer clicks than a combined screen would give) ---
add(script_node(60, "Entry - Risk (standalone)", entry_script("risk", LABELS["risk"], NETTING["risk"]), 61))
# MERGED: consent + text-resources script = one screen
add(merged_node(61, "Risk - consent + text resources",
    [content_of(RISK, 23), "<p><b>If the patient agrees:</b></p>", content_of(RISK, 24)],
    [], [btn("Agree to risk assessment", 63), btn("Does not agree to risk assessment", 131, rank=2)]))
add(copy_node(RISK, 6, 63, new_links=[72, 64]))          # suicide 1 (+7)
add(copy_node(RISK, 1, 64, new_links=[72, 65]))          # suicide 2 (+7)
add(copy_node(RISK, 8, 65, new_links=[66, 67]))          # self-harm 1 (+1)
add(copy_node(RISK, 2, 66, new_links=[72, 67]))          # self-harm 2 (+7)
add(copy_node(RISK, 10, 67, new_links=[68, 69]))         # harm others 1 (+1)
add(copy_node(RISK, 11, 68, new_links=[72, 69]))         # harm others 2 (+1)
# MERGED: dependents 1-3 = one screen (was 3 screens with zero branching)
YNR = "Yes\nNo\nRefused to answer"
add(merged_node(69, "Risk - dependents checks",
    [content_of(RISK, 18)],
    [ff("select", "cares_for_children", q_text(RISK, 18), YNR, "1"),
     ff("select", "carer_for_someone", q_text(RISK, 19), YNR, "1"),
     ff("select", "has_social_worker", q_text(RISK, 20), YNR, "1")],
    [btn("Continue", 72)]))
add(copy_node(RISK, 21, 72, new_links=[73]))             # task (copy to EMIS)
add(copy_node(RISK, 4, 73, new_links=[132, 133, 74]))    # calculator (gte 7 / eq 0 / def)
add(copy_node(RISK, 12, 74, new_links=[134, 135]))       # moderate risk appt

# --- outcome setters ---
SETTERS = [
    (111, "smi", "mhn", SMI, 5),
    (116, "adult_mh", "gp_detox", ADULT, 3),
    (117, "adult_mh", "gp_first", ADULT, 5),
    (118, "adult_mh", "gp_review", ADULT, 6),
    (119, "adult_mh", "any_book", ADULT, 8),
    (120, "adult_mh", "any_medreview", ADULT, 11),
    (121, "adult_mh", "any_seen", ADULT, 13),
    (122, "adult_mh", "mhn_safe", ADULT, 15),
    (123, "depression", "pharmacist", DEP, 5),
    (124, "depression", "mhn", DEP, 10),
    (125, "cyp", "gp_decline", CYP, 23),
    (126, "cyp", "emergency_out", CYP, 33),
    (127, "cyp", "paramedic", CYP, 40),
    (128, "cyp", "gp", CYP, 21),
    (129, "cyp", "urgent_pharm", CYP, 32),
    (130, "cyp", "gp_accurx", CYP, 47),
    (131, "risk", "oversight", RISK, 26),
    (132, "risk", "emergency", RISK, 14),
    (133, "risk", "mhn_routine", RISK, 17),
    (134, "risk", "mhn_appt", RISK, 15),
    (135, "risk", "mhn_oversight", RISK, 16),
]
for nid, cond, key, tree, sid in SETTERS:
    o = harvest_outcome(tree, sid)
    add(script_node(nid, "Outcome setter - %s (%s)" % (o["title"] or key, cond),
                    setter_script(cond, key, o), 90))

# --- shared tail ---
outcome = base_node(90, "Content", "Outcome")
outcome["question"] = "Please indicate the final outcome by selecting from the list above."
# copy-to-clipboard area per the canonical pattern (patterns.md): markers in
# their own <p> tags + a button calling Zingtree's built-in copy_to_clipboard()
outcome["content"] = (
    "${transforms.outcome_html}"
    "<p>[[COPY-AREA]]</p>"
    "<p>${outcome_title} suggested outcome:<br>${suggested_outcome_text}</p>"
    "<p>[[/COPY-AREA]]</p>"
    "<p><a class=\"btn btn-success\" style=\"cursor:pointer;\" "
    "onclick=\"copy_to_clipboard();\">Copy to Clipboard</a></p>")
outcome["formfields"] = [ff("select", "outcome", "Final outcome", CANONICAL_OUTCOMES, "1",
                            rank=1, config="{\"filterable\":true}")]
outcome["buttons"] = [btn("Continue", 91)]
add(outcome)
add(logic_node(91, "Other outcome logic", [("(outcome== 'Other')", 92)], 93))
add(copy_node(CYP, 3, 92, new_links=[93]))               # other outcome (multiline)
netting = base_node(93, "Content", "Safety Netting")
netting["content"] = "${transforms.sn_html}"
add(netting)

# ------------------------------------------------------------- assemble -----
out = copy.deepcopy(shell)
out["name"] = "Penrose MH Master Triage (Consolidated)"
out["description"] = ("v3.1 - One tree replacing 5 MH trees. One content screen captures "
                      "multiple values, logic nodes route (no stacked content nodes). "
                      "Scripts only stage data. Drive with "
                      "?condition=smi|depression|adult_mh|cyp|risk. "
                      "Generated from Penrose exports 2026-07-13.")
out["root_node_id"] = 3  # the condition drop-down is the starting node
out["nodes"] = nodes
out["tags"] = "consolidated,mental-health,master"
# native risk_score predefined variable (as in the original risk tree)
out["predefined_vars"] = [{
    "id": 0, "project_id": 0, "project_node_id": 0, "type": "predefined",
    "name": "risk_score", "label": "", "label_type": "", "options": "",
    "hidden_value": "", "custom_regex": "", "inline": 0, "required": False,
    "score_var": "", "checkbox_score": 1, "scores": "", "rank": 0, "config": None,
}]

with open(OUT_DIR + "/Penrose MH Master Triage (Consolidated).json", "w") as f:
    json.dump(out, f, indent=1)

with open(OUT_DIR + "/init_config.js", "w") as f:
    f.write(INIT_SCRIPT)
with open(OUT_DIR + "/entry_and_setters_sample.js", "w") as f:
    f.write("// Sample entry script (SMI):\n" + nodes["10"]["content"] +
            "\n\n// Sample outcome setter (SMI MHN):\n" + nodes["111"]["content"])

print("nodes: %d | setters: %d | canonical options: %d" % (len(nodes), len(SETTERS), len(canonical)))
print("Generated OK (v3)")
