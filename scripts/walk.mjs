#!/usr/bin/env node
// Offline walk of a Zingtree tree export against a fixture file.
//
//   node scripts/walk.mjs <tree.json> <tree.fixture.json> [--start <nodeId>] [--verbose]
//
// Executes the REAL Script node bodies over the REAL continuation graph with a stubbed ZT,
// serves Connected Object responses from the fixture, submits the fixture's form inputs on
// Content nodes, evaluates Scoring buttons, and checks the fixture's `expect` block.
// See references/03-testing-and-mock-data.md for the fixture shape.

import fs from "node:fs";
import vm from "node:vm";

const args = process.argv.slice(2);
const [treePath, fixturePath] = args;
if (!treePath || !fixturePath) {
  console.error("usage: node walk.mjs <tree.json> <tree.fixture.json> [--start <nodeId>] [--verbose]");
  process.exit(2);
}
const verbose = args.includes("--verbose");
const startArg = args.includes("--start") ? args[args.indexOf("--start") + 1] : null;

const tree = JSON.parse(fs.readFileSync(treePath, "utf8"));
const fixture = JSON.parse(fs.readFileSync(fixturePath, "utf8"));
const nodes = tree.nodes;

// --- session state ------------------------------------------------------------
const session = {
  form: { ...(fixture.query_params || {}) },
  transforms: {},
  actions: {},
  views: { ...(fixture.views || {}) }
};
const calls = [];          // every Data node hit: { node, alias, form snapshot }
const path = [];
const warnings = [];

// Exports store formfields/buttons as a list or an index-keyed dict.
const asList = v => (v && !Array.isArray(v) && typeof v === "object") ? Object.values(v) : (v || []);
const coAlias = id => (fixture.connected_objects || {})[String(id)] || `co_${id}`;

// --- ZT stub -----------------------------------------------------------------------
function makeZT(nodeId) {
  return {
    getVariableValue(name, def) {
      const v = session.form[name];
      return v === undefined || v === null || v === "" ? def : v;
    },
    setFormData(k, v) { session.form[k] = v; },
    setTransformData(k, v) { session.transforms[k] = v; },
    setResponseData(alias, data) { session.actions[alias] = data; },
    setViewData(alias, data) { session.views[alias] = data; },
    log() { warnings.push(`node ${nodeId}: ZT.log is present (house rule: no logging)`); }
  };
}

function runScript(nodeId) {
  const code = nodes[nodeId].content || "";   // Script bodies are stored raw in the export
  // Form data is exposed as bare globals too, exactly as the engine does (a missing one throws).
  const sandbox = {
    ...session.form,
    ZT: makeZT(nodeId),
    transforms: JSON.parse(JSON.stringify(session.transforms)),   // snapshot, as the engine does
    actions: session.actions,
    views: session.views,
    console: { log() {} },
    JSON, Math, Object, Array, String, Number, Boolean, Set, Map, Date, RegExp,
    parseInt, parseFloat, isNaN, encodeURIComponent, decodeURIComponent
  };
  try {
    new vm.Script(code, { filename: `node-${nodeId}.js` })
      .runInContext(vm.createContext(sandbox), { timeout: 5000 });
  } catch (e) {
    throw new Error(`script node ${nodeId} ("${nodes[nodeId].page_title}") threw: ${e.message}`);
  }
}

// --- logic expressions -------------------------------------------------------
// Zingtree expressions are JS-like: `flag == true`, `(a == 'x') && (b == 1)`,
// `len(transforms.list) >= 1`, `actions.alias._zt_meta.response.code == 200`.
// Unknown identifiers resolve to "" rather than throwing.
function evalLogic(expr) {
  const scope = {
    transforms: session.transforms, actions: session.actions, views: session.views,
    len: x => (x == null ? 0 : (x.records || x).length),
    ...session.form
  };
  const proxy = new Proxy(scope, {
    has: () => true,
    get: (t, k) => (k in t ? t[k] : (k === Symbol.unscopables ? undefined : ""))
  });
  try {
    return Boolean(vm.runInContext(`(${expr})`, vm.createContext(proxy), { timeout: 1000 }));
  } catch (e) {
    warnings.push(`logic expression could not be evaluated: ${expr} (${e.message})`);
    return false;
  }
}

function pickScoring(nodeId) {
  const node = nodes[nodeId];
  const buttons = asList(node.buttons).slice().sort((a, b) => Number(a.rank) - Number(b.rank));
  for (const b of buttons) {
    if (b.op === "def") return b.button_link;
    if (b.logic_expression && evalLogic(b.logic_expression)) return b.button_link;
  }
  return node.continuation_node_id;
}

// --- content nodes -----------------------------------------------------------
function submitContent(nodeId) {
  const node = nodes[nodeId];
  Object.assign(session.form, (fixture.form_inputs || {})[nodeId] || {});
  Object.assign(session.views, (fixture.view_inputs || {})[nodeId] || {});   // Dynamic View selections made on this screen
  // Native fields with a hidden_value submit it when the field is active; we assume active.
  for (const f of asList(node.formfields)) {
    if (f.type === "hidden" && f.hidden_value && session.form[f.name] === undefined) session.form[f.name] = f.hidden_value;
  }
  if (node.continuation_node_id && node.continuation_node_id !== "0") return node.continuation_node_id;
  const buttons = asList(node.buttons);
  const wanted = (fixture.buttons || {})[nodeId];
  if (wanted) {
    const b = buttons.find(x => x.button_text === wanted || x.button_link === String(wanted));
    if (!b) throw new Error(`content node ${nodeId}: fixture button "${wanted}" not found`);
    return b.button_link;
  }
  if (buttons.length === 1) return buttons[0].button_link;
  return null; // needs a choice the fixture didn't make
}

// --- the walk ----------------------------------------------------------------
function walk(startId) {
  let id = String(startId);
  const seen = new Map(); // nodeId -> Set of form-data hashes
  for (let step = 0; step < 5000; step++) {
    const node = nodes[id];
    if (!node) throw new Error(`link to missing node ${id} (from ${path[path.length - 1]})`);
    path.push(id);

    const hash = JSON.stringify(session.form);
    const hashes = seen.get(id) || new Set();
    if (hashes.has(hash) && node.type !== "Content") {
      throw new Error(`node ${id} ("${node.page_title}") revisited with identical form data - ` +
        `a loop that does not advance any state. This is the shape Zingtree's invalid-loop guard halts. ` +
        `Path tail: ${path.slice(-12).join(" -> ")}`);
    }
    hashes.add(hash); seen.set(id, hashes);

    if (verbose) console.log(`  ${node.type.padEnd(8)} ${id.padStart(3)}  ${node.page_title}`);

    if (node.type === "Script") { runScript(id); id = String(node.continuation_node_id); continue; }
    if (node.type === "Scoring") { id = String(pickScoring(id)); continue; }
    if (node.type === "Data") {
      for (const co of asList(node.data_connected_objects)) {
        const alias = coAlias(co.data_connected_object_id);
        const response = (fixture.actions || {})[alias];
        if (!response) warnings.push(`Data node ${id} calls "${alias}" but the fixture has no actions["${alias}"]`);
        session.actions[alias] = response || { _zt_meta: { response: { code: 0 } } };
        calls.push({ node: id, alias, form: { ...session.form } });
      }
      id = String(node.continuation_node_id); continue;
    }
    if (node.type === "Content") {
      const next = submitContent(id);
      if (!next || next === "0") return { end: id, reason: asList(node.buttons).length > 1 ? "needs a button choice" : "terminal" };
      id = String(next); continue;
    }
    if (node.type === "Tree") {
      const next = node.continuation_node_id && node.continuation_node_id !== "0" ? node.continuation_node_id : node.return_tree_node_id;
      if (!next || next === "0") return { end: id, reason: `subtree call (open_tree_id ${node.open_tree_id})` };
      id = String(next); continue;
    }
    throw new Error(`unknown node type ${node.type} at ${id}`);
  }
  throw new Error("walk did not terminate in 5000 steps");
}

// --- run ---------------------------------------------------------------------
const start = startArg || tree.root_node_id;
console.log(`walk: ${tree.name} (${tree.id}) from node ${start}`);
let result;
try {
  result = walk(start);
} catch (e) {
  console.log(`\nFAIL  ${e.message}`);
  console.log(`path: ${path.join(" -> ")}`);
  process.exit(1);
}

console.log(`\npath (${path.length} steps): ${path.join(" -> ")}`);
console.log(`ended at node ${result.end} (${nodes[result.end].page_title}) - ${result.reason}`);

const callCounts = {};
for (const c of calls) callCounts[c.alias] = (callCounts[c.alias] || 0) + 1;
console.log(`\nConnected Object calls:`);
for (const [alias, n] of Object.entries(callCounts)) console.log(`  ${alias}: ${n}`);

if (verbose) {
  console.log(`\nfinal form data:`);
  for (const [k, v] of Object.entries(session.form)) console.log(`  ${k} = ${typeof v === "string" && v.length > 120 ? v.slice(0, 117) + "..." : JSON.stringify(v)}`);
  const stillTransforms = Object.keys(session.transforms);
  if (stillTransforms.length) console.log(`\ntransforms in use (each must be one of the two allowed cases): ${stillTransforms.join(", ")}`);
}

let failures = 0;
const check = (label, ok, detail) => { console.log(`  ${ok ? "PASS" : "FAIL"}  ${label}${ok || !detail ? "" : `  (${detail})`}`); if (!ok) failures++; };
const expect = fixture.expect || {};
if (Object.keys(expect).length) {
  console.log(`\nexpectations:`);
  for (const [alias, n] of Object.entries(expect.data_node_calls || {})) check(`${alias} called ${n}x`, (callCounts[alias] || 0) === n, `actual ${callCounts[alias] || 0}`);
  for (const [k, v] of Object.entries(expect.form_data || {})) check(`form ${k} == ${JSON.stringify(v)}`, JSON.stringify(session.form[k]) === JSON.stringify(v), `actual ${JSON.stringify(session.form[k])}`);
  if (expect.terminal_node) check(`ends at node ${expect.terminal_node}`, result.end === String(expect.terminal_node), `actual ${result.end}`);
}

if (warnings.length) { console.log(`\nwarnings:`); [...new Set(warnings)].forEach(w => console.log(`  - ${w}`)); }
console.log(failures ? `\n${failures} expectation(s) failed` : `\nOK`);
process.exit(failures ? 1 : 0);
