// Verification harness for Penrose MH Master Triage v3.
// v3 routes on ACTION BUTTONS, so verification is graph-based:
// every path from every condition entry must terminate at the Safety Netting
// node (93) or an external Tree node, passing an outcome setter before the
// Outcome screen (90). Scripts are executed with a ZT stub. Risk scoring is
// simulated using the native score_var/button-value mechanics.
const fs = require("fs");

const tree = JSON.parse(fs.readFileSync("Penrose MH Master Triage (Consolidated).json", "utf8"));
const nodes = tree.nodes;
let failures = 0;
const fail = (m) => { failures++; console.log("FAIL: " + m); };
const ffs = (n) => { const f = n.formfields; const a = Array.isArray(f) ? f : Object.values(f || {}); return a.filter((x) => x && typeof x === "object"); };


// ---------- structural ----------
if (String(tree.root_node_id) !== "3") fail("root_node_id != 3 (condition DDL must be the start)");
if (nodes["3"].is_root !== "1") fail("node 3 is_root != 1");
if (!ffs(nodes["3"]).some((f) => f.type === "select" && f.name === "condition" && f.required === "1"))
  fail("start node must carry the required condition drop-down");
for (const [nid, n] of Object.entries(nodes)) {
  const btns = Array.isArray(n.buttons) ? n.buttons : Object.values(n.buttons || {});
  for (const b of btns) {
    if (!(String(b.button_link) in nodes)) fail(`node ${nid} button -> missing ${b.button_link}`);
  }
  if (n.type === "Script") {
    if (!(String(n.continuation_node_id) in nodes)) fail(`script ${nid} continuation missing`);
    if (/[^\x00-\x7F]/.test(n.content)) fail(`script ${nid} non-ASCII`);
    if (/zt-data|<input|<select/.test(n.content)) fail(`script ${nid} builds inputs`);
  }
  if (n.type === "Scoring") {
    const hasLogic = btns.some((b) => b.logic_expression);
    const hasOps = btns.some((b) => ["gte", "eq", "lte", "gt", "lt"].includes(b.op));
    if (hasLogic && n.advanced_logic_node !== "1")
      fail(`scoring ${nid} has logic expressions but advanced_logic_node != 1`);
    if (!btns.some((b) => b.op === "def")) fail(`scoring ${nid} has no default button`);
    if (hasLogic && !(String(n.continuation_node_id) in nodes))
      fail(`scoring ${nid} missing continuation fallback`);
    if (!hasLogic && !hasOps) fail(`scoring ${nid} has neither logic nor score ops`);
    // house pattern: every logic button evaluates ONE script-computed boolean
    // (`var == true`); the only exception is the org-proven outcome check.
    const isVerbatim = /^Copied verbatim from/.test(n.notes || "");
    for (const b of btns) {
      if (!b.logic_expression) continue;
      if (/^\w+ == true$/.test(b.logic_expression)) continue;
      if (b.logic_expression === "(outcome== 'Other')") continue;
      if (isVerbatim) continue; // org-proven expression copied from source tree
      fail(`scoring ${nid} logic '${b.logic_expression}' is not a script-computed boolean`);
    }
  }
  for (const f of ffs(n)) {
    if (!["select", "checkbox", "multiline", "hidden"].includes(f.type))
      fail(`node ${nid} unproven formfield type '${f.type}'`);
  }
}
// stacked-content lint (core building theme): a SINGLE-button Content node
// feeding another Content node should have been ONE screen — unless the
// target is shared (multiple inbound edges), in which case it cannot be
// merged into every parent (e.g. handoffs into the shared risk questions,
// the shared task screen, or the terminal Safety Netting).
// Multi-button content -> content is a branching decision: normal building.
const inbound = {};
for (const [nid, n] of Object.entries(nodes)) {
  const btns = Array.isArray(n.buttons) ? n.buttons : Object.values(n.buttons || {});
  for (const b of btns) (inbound[String(b.button_link)] ||= new Set()).add(nid);
  if (n.type === "Script") (inbound[String(n.continuation_node_id)] ||= new Set()).add(nid);
}
for (const [nid, n] of Object.entries(nodes)) {
  if (n.type !== "Content") continue;
  const btns = Array.isArray(n.buttons) ? n.buttons : Object.values(n.buttons || {});
  if (btns.length !== 1) continue;
  const tid = String(btns[0].button_link);
  const t = nodes[tid];
  if (t && t.type === "Content" && (inbound[tid] || new Set()).size <= 1)
    fail(`stacked content nodes: ${nid} -> ${tid} (combine into one screen + logic)`);
}
console.log("Structural checks done (incl. stacked-content lint).");

// ---------- verbatim copy check ----------
const SRC = JSON.parse(fs.readFileSync(
  "/sessions/wonderful-awesome-volta/mnt/uploads/Selected_from_Penrose Health (2)_2026-07-13 (3).json", "utf8"));
const srcTrees = {};
for (const p of SRC.projects) srcTrees[p.name] = p;
// SMI is sourced from the fresher Jul 14 single-tree export
srcTrees["Severe Mental Illness Review"] = JSON.parse(fs.readFileSync(
  "/sessions/wonderful-awesome-volta/mnt/uploads/Severe Mental Illness Review_1784041090076.json", "utf8"));
let copies = 0;
for (const [nid, n] of Object.entries(nodes)) {
  const m = /^Copied verbatim from '(.+)' node (\d+)$/.exec(n.notes || "");
  if (!m) continue;
  const src = srcTrees[m[1]].nodes[m[2]];
  if (!src) { fail(`copy source missing for ${nid}`); continue; }
  if (src.content !== n.content) fail(`node ${nid} content differs from source`);
  if (src.question !== n.question) fail(`node ${nid} question differs from source`);
  if (JSON.stringify(src.formfields) !== JSON.stringify(n.formfields))
    fail(`node ${nid} formfields differ from source`);
  if (src.score_var !== n.score_var) fail(`node ${nid} score_var differs`);
  copies++;
}
console.log(`Verbatim copy check: ${copies} nodes match their sources.`);

// ---------- script execution ----------
function makeSession() {
  const form = {}, transforms = {};
  const ZT = {
    getVariableValue: (k, d) => (k in form ? form[k] : d),
    setFormData: (k, v) => { form[k] = v; },
    setTransformData: (k, v) => { transforms[k] = v; },
    log: () => {},
  };
  return { form, transforms, ZT };
}
function runScript(code, s) { new Function("ZT", "transforms", code)(s.ZT, s.transforms); }

// every script node must execute cleanly
for (const [nid, n] of Object.entries(nodes)) {
  if (n.type !== "Script") continue;
  try { runScript(n.content, makeSession()); }
  catch (e) { fail(`script ${nid} throws: ${e.message}`); }
}
// every outcome setter must stage the outcome screen
let settersOk = 0;
for (const [nid, n] of Object.entries(nodes)) {
  if (n.type !== "Script" || !/Outcome setter/.test(n.node_name)) continue;
  const s = makeSession();
  runScript(n.content, s);
  if (!s.form["suggested_outcome"]) fail(`setter ${nid} missing suggested_outcome`);
  if (!s.transforms["outcome_html"]) fail(`setter ${nid} missing outcome_html`);
  if ("sn_html" in s.transforms) fail(`setter ${nid} must not touch sn_html (origin netting)`);
  settersOk++;
}
console.log(`Setters staging outcome screen: ${settersOk}`);

// ---------- graph walk: start -> resolution, per condition ----------
const ENTRIES = { smi: "10", adult_mh: "20", depression: "30", cyp: "40", risk: "60" };
// 93 = Safety Netting; 15-18 = verbatim error screens (Back-button dead ends,
// original SMI/CYP validation functionality)
const TERMINALS = new Set(["93", "15", "16", "17", "18"]);
const setterIds = new Set(Object.entries(nodes)
  .filter(([, n]) => /Outcome setter/.test(n.node_name || "")).map(([id]) => id));
const settersReached = new Set();
let pathCount = 0;

function isTreeLink(n) { return n.type === "Tree" && String(n.open_tree_id) !== "0"; }

function targets(n) {
  const btns = Array.isArray(n.buttons) ? n.buttons : Object.values(n.buttons || {});
  if (n.type === "Script") return [String(n.continuation_node_id)];
  if (n.type === "Scoring") return btns.map((b) => String(b.button_link)); // branch all
  return btns.map((b) => String(b.button_link)); // Content: branch every button
}

function walk(cur, path, sawSetter) {
  const n = nodes[cur];
  if (!n) { fail(`walk hit missing node ${cur}`); return; }
  if (path.includes(cur)) {
    fail(`CYCLE: ${[...path, cur].join(" -> ")}`);
    return;
  }
  if (setterIds.has(cur)) { sawSetter = true; settersReached.add(cur); }
  if (cur === "90" && !sawSetter) fail(`Outcome screen reached without setter: ${path.join("->")}`);
  if (TERMINALS.has(cur) || isTreeLink(n)) { pathCount++; return; }
  const next = targets(n);
  if (!next.length) { fail(`dead end at node ${cur} (${n.node_name}): ${path.join("->")}`); return; }
  for (const t of next) walk(t, [...path, cur], sawSetter);
}

for (const [cond, entry] of Object.entries(ENTRIES)) {
  const before = pathCount;
  walk(entry, [], false);
  console.log(`  ${cond}: ${pathCount - before} distinct paths, all terminate`);
}
const unreachedSetters = [...setterIds].filter((s) => !settersReached.has(s));
if (unreachedSetters.length) fail("setters never reached: " + unreachedSetters.join(","));

// ---------- risk score simulation (native mechanics) ----------
// choose buttons by label along a path; accumulate node.score_var/button.value;
// at calculator (73) apply gte/eq/def against risk_score.
function riskRun(answers) {
  let cur = "61", score = 0, guard = 0;
  while (guard++ < 50) {
    const n = nodes[cur];
    if (setterIds.has(cur)) return { setter: nodes[cur].node_name, score };
    if (n.type === "Script") { cur = String(n.continuation_node_id); continue; }
    if (n.type === "Scoring") {
      const btns = n.buttons;
      let chosen = null;
      for (const b of btns) {
        if (b.op === "gte" && score >= parseInt(b.button_data, 10)) { chosen = b; break; }
        if (b.op === "eq" && score === parseInt(b.button_data, 10)) { chosen = b; break; }
        if (b.op === "def") { chosen = b; break; }
      }
      cur = String(chosen.button_link); continue;
    }
    // content: pick by answer label
    const btns = n.buttons;
    const want = answers.shift();
    const b = btns.find((x) => x.button_text === want) || btns[0];
    if (n.score_var === "risk_score") score += parseInt(b.value || "0", 10);
    cur = String(b.button_link);
  }
  fail("risk simulation guard exceeded");
  return { setter: "?", score };
}
const hi = riskRun(["Agree to risk assessment", "Yes", "Continue"]);
if (!/emergency/i.test(hi.setter) || hi.score < 7) fail(`hi risk -> ${hi.setter} score ${hi.score}`);
const lo = riskRun(["Agree to risk assessment", "No", "No", "No", "No", "Continue", "Continue"]);
if (!/MHN/.test(lo.setter) || lo.score !== 0) fail(`lo risk -> ${lo.setter} score ${lo.score}`);
const mid = riskRun(["Agree to risk assessment", "No", "No", "Yes", "No", "No",
                     "Continue", "Continue", "Yes"]);
if (mid.score < 1 || mid.score > 6) fail(`mid risk score ${mid.score} out of band`);
console.log(`Risk simulation: hi=${hi.score} (${hi.setter.slice(0, 40)}), lo=${lo.score}, mid=${mid.score}`);

// ---------- functional simulation: content -> script -> logic -------------
// Executes the real eval scripts against form values and evaluates the
// boolean logic buttons, exactly as Zingtree would. Answers select values
// and checkboxes are seeded into form state.
// evaluate org-style checkbox expressions ((feelsUnsafe == 0) && ...) the way
// live Zingtree does: unticked checkbox resolves to 0, ticked to 1
function evalCheckboxExpr(expr, form) {
  if (/^\w+ == true$/.test(expr) || expr === "(outcome== 'Other')") return false;
  const ids = [...new Set(expr.match(/[a-zA-Z_]\w*/g) || [])];
  const vals = ids.map((id) => (form[id] === "1" || form[id] === 1 ? 1 : 0));
  try { return !!new Function(...ids, "return (" + expr + ");")(...vals); }
  catch (e) { fail("expression eval error: " + expr + " -> " + e.message); return false; }
}
function simFrom(startNode, form, buttonPicks) {
  const s = makeSession();
  Object.assign(s.form, form);
  let cur = String(startNode), guard = 0;
  while (guard++ < 50) {
    const n = nodes[cur];
    if (setterIds.has(cur)) return { end: n.node_name, form: s.form };
    if (n.type === "Tree" && String(n.open_tree_id) !== "0")
      return { end: "TREE:" + (n.node_name || n.page_title || n.content || "").slice(0, 60), form: s.form };
    if (cur === "93") return { end: "SAFETY_NETTING", form: s.form };
    if (TERMINALS.has(cur)) return { end: "ERROR_SCREEN:" + (n.page_title || n.node_name), form: s.form };
    if (n.type === "Script") { runScript(n.content, s); cur = String(n.continuation_node_id); continue; }
    if (n.type === "Scoring") {
      let chosen = null;
      for (const b of n.buttons) {
        const m = /^(\w+) == true$/.exec(b.logic_expression || "");
        if (m && s.form[m[1]] === true) { chosen = b; break; }
        if (b.logic_expression === "(outcome== 'Other')" && s.form["outcome"] === "Other") { chosen = b; break; }
        if (b.logic_expression && evalCheckboxExpr(b.logic_expression, s.form)) { chosen = b; break; }
        if (b.op === "def") { chosen = b; break; }
      }
      cur = String(chosen.button_link); continue;
    }
    // Content: single Continue or pick by label
    const want = buttonPicks.shift();
    const b = want ? n.buttons.find((x) => x.button_text === want) || n.buttons[0] : n.buttons[0];
    cur = String(b.button_link);
  }
  fail("simFrom guard exceeded from " + startNode);
  return { end: "?", form: {} };
}
function expectEnd(label, startNode, form, picks, pattern) {
  const r = simFrom(startNode, form, picks || []);
  if (!pattern.test(r.end)) fail(`${label}: ended at '${r.end}', expected ${pattern}`);
  return r;
}
// Depression: all three routes, driven by the actual select values
expectEnd("dep new symptoms", 31, { new_symptoms: "Yes", about_medication: "No" }, [], /nav/i);
expectEnd("dep medication", 31, { new_symptoms: "No", about_medication: "Yes" }, [], /Pharmacist/i);
expectEnd("dep review", 31, { new_symptoms: "No", about_medication: "No" }, [], /MHN|Mental Health Nurse/i);
console.log("Depression functional sim: nav / Pharmacist / MHN all reached from real select values.");
// SMI: verbatim assertion buttons + verbatim checkbox scoring expressions
const YES_A = "Yes - patient has some emergency symptoms";
const NO_A = "No - patient has no emergency symptoms";
// THE reported bug: nothing ticked + "No" button MUST reach the MHN outcome
expectEnd("smi no-ticks + No btn -> MHN", 11, {}, [NO_A], /MHN|Mental Health Nurse/i);
expectEnd("smi tick + Yes btn -> risk", 11, { suicidal: "1" },
  [YES_A, "Agree to risk assessment", "No", "No", "No", "No", "Continue", "Continue"], /MHN|Emergency|Clinical/i);
expectEnd("smi no-ticks + Yes btn -> error", 11, {}, [YES_A], /ERROR_SCREEN/);
expectEnd("smi tick + No btn -> error", 11, { harm: "1" }, [NO_A], /ERROR_SCREEN/);
// CYP non-verbal: verbatim screens + verbatim scoring expressions
expectEnd("cyp nv Yes, no ticks -> error", 45, {}, ["Yes", "Yes"], /ERROR_SCREEN/);
expectEnd("cyp nv Yes, not_moving -> emergency", 45, { not_moving: "1" }, ["Yes", "Yes"], /Emergency/i);
expectEnd("cyp nv Yes, grunting -> paramedic", 45, { grunting: "1" }, ["Yes", "Yes"], /Paramedic/i);
expectEnd("cyp nv No btn w/ tick -> error", 45, { grunting: "1" }, ["Yes", "No"], /ERROR_SCREEN/);
expectEnd("cyp nv No btn clean -> continues", 45,
  { undiagnosed_condition: "No", worsening_condition: "No", start_medications: "No", urgent_script: "No" },
  ["Yes", "No"], /GP|Accurx|gp/i);
console.log("SMI/CYP verbatim assertion + checkbox-expression evaluation: OK");
// Adult seen/safety
expectEnd("adult seen", 25, { seen_before: "Yes", safety_feeling: "Feeling safe" }, [], /Any|Outcome/i);
expectEnd("adult safe", 25, { seen_before: "No", safety_feeling: "Feeling safe" }, [], /MHN/i);
// CYP non-verbal routes
expectEnd("cyp nv none", 45, { undiagnosed_condition: "No", worsening_condition: "No",
  start_medications: "No", urgent_script: "No" }, ["No"], /GP|Accurx|gp/i);
expectEnd("cyp nv not moving", 45, { not_moving: "1" }, ["Yes", "Yes"], /Emergency/i);
expectEnd("cyp nv other", 45, { grunting: "1" }, ["Yes", "Yes"], /Paramedic/i);
expectEnd("cyp school", 48, { undiagnosed_condition: "Yes", worsening_condition: "No", attends_school: "Yes" }, [], /GP|gp/i);
console.log("SMI / Adult / CYP functional sims: booleans computed by eval scripts drive routing.");
// copy-to-clipboard area must follow the canonical pattern (patterns.md)
{
  const c = nodes["90"].content;
  if (!c.includes("<p>[[COPY-AREA]]</p>") || !c.includes("<p>[[/COPY-AREA]]</p>"))
    fail("outcome node: COPY-AREA markers must each sit in their own <p>");
  if (!c.includes('onclick="copy_to_clipboard();"'))
    fail("outcome node: missing copy_to_clipboard() button");
  const iOpen = c.indexOf("<p>[[COPY-AREA]]</p>"), iClose = c.indexOf("<p>[[/COPY-AREA]]</p>");
  if (!(iOpen >= 0 && iClose > iOpen)) fail("outcome node: COPY-AREA markers out of order");
  console.log("Copy-to-clipboard area matches the canonical pattern.");
}
// full run from the DDL start node: pick Depression Review, answer, reach Pharmacist
{
  const r = simFrom(3, { condition: "Depression Review", new_symptoms: "No", about_medication: "Yes" }, []);
  if (!/Pharmacist/i.test(r.end)) fail("DDL start -> depression -> pharmacist failed, got " + r.end);
  else console.log("DDL start node -> Depression Review -> Pharmacist outcome: OK");
}
// wiring: depression screen goes through the eval script
{
  const d31 = nodes["31"];
  if (String(d31.buttons[0].button_link) !== "34" || nodes["34"].type !== "Script")
    fail("depression screen must route through eval script 34");
  if (String(nodes["34"].continuation_node_id) !== "33")
    fail("depression eval script must continue to logic 33");
  if (String(nodes["32"].buttons[0].button_link) !== "5")
    fail("depression postcard must lead to Navigation tree");
}

// origin netting: entry scripts set sn_html; crisis handoffs (13->61, 21->61,
// 26->61 via default, 42->63) bypass risk entry 60, so origin netting persists
for (const [from, to] of [["13", "61"], ["21", "61"], ["26", "61"], ["42", "63"]]) {
  const n = nodes[from];
  const btns = Array.isArray(n.buttons) ? n.buttons : Object.values(n.buttons || {});
  if (!btns.some((b) => String(b.button_link) === to))
    fail(`crisis handoff ${from}->${to} missing`);
}
console.log("Crisis handoffs bypass risk entry (origin netting preserved): OK");

console.log(`\nTotal distinct start->resolution paths: ${pathCount}`);
console.log(failures ? `\n${failures} FAILURE(S)` : "\nALL CHECKS PASSED");
process.exit(failures ? 1 : 0);
