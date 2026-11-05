// Graph-walking harness for the v45 unified ticket loop.
// Executes the REAL node bodies over the REAL continuation graph and counts every
// Connected Object invocation, so "one loop for child + grand child" is verified
// by the number and shape of the create/get/update calls, not by reading code.
//
//   node walk_v45.mjs <tree.json>

import fs from "node:fs";
import vm from "node:vm";

const tree = JSON.parse(fs.readFileSync(process.argv[2], "utf8"));
const N = tree.nodes;

const TYPE_A = { id: "1321", name: "Voluntary - Fare rules" };
const TYPE_B = { id: "1320", name: "24 hour rule" };
const PROCEED = { id: "1973", name: "Sent to support", bucket: { id: 4, name: "Proceed" } };
const NO_ACTION = { id: "1869", name: "Do not proceed", bucket: { id: 3, name: "No action" } };
const NO_ACTION_2 = { id: "1870", name: "Customer declined", bucket: { id: 3, name: "No action" } };

const CHANNEL = {
  id: "CH-PHONE", name: "Phone",
  categories: [{
    id: "CAT-CANC", name: "Cancellation",
    types: [TYPE_A, TYPE_B].map(t => ({
      id: t.id, name: t.name,
      actions: [PROCEED, NO_ACTION, NO_ACTION_2].map(a => ({ ...a, edvin_actions: {} }))
    }))
  }]
};
const PASSENGERS = [{ passengerFirstName: "Aslan", passengerLastName: "YILMAZ" }];

let session, actionResponses, calls, sideConversations, sideConvSeq, failOnce;

function reset() {
  session = {
    form: {
      zd_ticket_id: "334818", orderReference: "1122-047-131",
      custom_field_33772689958162: "1122-047-131",
      custom_field_29559177650834: "contact_reason__cancellation",
      channel: "Phone"
    },
    transforms: { customer_action_pnrs: [] }
  };
  sideConversations = [];
  sideConvSeq = 1000;
  calls = [];
  failOnce = {};
  actionResponses = {
    findorder: { _zt_meta: { response: { code: 200 } }, orderReference: "1122-047-131" },
    get_side_conversation_detail: { _zt_meta: { response: { code: 200 } }, side_conversations: sideConversations },
    edvin__errand_configuration: { _zt_meta: { response: { code: 200 } } }
  };
}

function runScript(nodeId, extra) {
  const ZT = {
    getVariableValue(name, def) {
      const v = session.form[name];
      return (v === undefined || v === null || v === "") ? def : v;
    },
    setFormData(k, v) { session.form[k] = v; },
    setTransformData(k, v) { session.transforms[k] = v; },
    log() { throw new Error("ZT.log survived in node " + nodeId); }
  };
  const sandbox = Object.assign({
    ZT, transforms: JSON.parse(JSON.stringify(session.transforms)),
    actions: actionResponses, views: {}, console: { log() {} },
    JSON, Math, Object, Array, String, Number, Boolean, Set, Map, Date, parseInt, parseFloat, isNaN
  }, extra || {});
  new vm.Script(N[String(nodeId)].content, { filename: `node-${nodeId}.js` })
    .runInContext(vm.createContext(sandbox), { timeout: 5000 });
}

const asStr = v => String(v === undefined || v === null ? "" : v);

function evalLogic(expr) {
  const e = expr.trim();
  let m = /^(\w+)\s*==\s*(true|false)$/.exec(e);
  if (m) return asStr(session.form[m[1]]) === m[2];
  m = /^(\w+)\s*==\s*"([^"]*)"$/.exec(e);
  if (m) return asStr(session.form[m[1]]) === m[2];
  m = /^len\(transforms\.(\w+)\)\s*(>=|==)\s*(\d+)$/.exec(e);
  if (m) {
    const len = (session.transforms[m[1]] || []).length;
    return m[2] === ">=" ? len >= Number(m[3]) : len === Number(m[3]);
  }
  m = /^transforms\.(\w+)\s*==\s*(true|false)$/.exec(e);
  if (m) return asStr(session.transforms[m[1]]) === m[2];
  m = /actions\.([A-Za-z0-9_]+)\._zt_meta\.response\.code/.exec(e);
  if (m) {
    const res = actionResponses[m[1]];
    const code = res && res._zt_meta && res._zt_meta.response ? res._zt_meta.response.code : 0;
    return code === 200 || code === 201;
  }
  m = /^(\w+)$/.exec(e);
  if (m) return asStr(session.form[m[1]]) === "true";
  throw new Error("unhandled logic expression: " + expr);
}

function pickScoring(nodeId) {
  const btns = (N[String(nodeId)].buttons || []).slice().sort((a, b) => Number(a.rank) - Number(b.rank));
  for (const b of btns) {
    if (b.op === "def") return b.button_link;
    if (b.logic_expression && evalLogic(b.logic_expression)) return b.button_link;
  }
  return N[String(nodeId)].continuation_node_id;
}

function meta(code) { return { _zt_meta: { response: { code, message: code >= 400 ? "simulated failure" : "" } } }; }

function runData(nodeId) {
  const t = session.transforms.child_ticket || {};
  if (nodeId === "33") {
    if (failOnce["33"]) { failOnce["33"] = false; actionResponses.create_child_ticket = meta(502); calls.push({ node: "33", ok: false, subject: t.subject }); return; }
    const id = ++sideConvSeq;
    const backing = String(400000 + id);
    calls.push({ node: "33", ok: true, subject: t.subject, target: t.target_ticket_id, backing });
    actionResponses.create_child_ticket = Object.assign(meta(201), { side_conversation: { id: String(id) } });
    sideConversations.push({ id: String(id), external_ids: { targetTicketId: backing } });
    return;
  }
  if (nodeId === "63") { actionResponses.get_side_conversation_detail = Object.assign(meta(200), { side_conversations: sideConversations }); calls.push({ node: "63", ok: true }); return; }
  if (nodeId === "66") { actionResponses.zingtree_redesign__update_side_conversation = meta(200); calls.push({ node: "66", ok: true, status: session.form.ticket_status }); return; }
  if (nodeId === "22") { actionResponses.create_internal_note__no_group_id = meta(200); calls.push({ node: "22", ok: true }); return; }
  if (nodeId === "43") { actionResponses.edvin__register_errand = meta(200); calls.push({ node: "43", ok: true, key: session.form.errand_message }); return; }
  if (nodeId === "42") { actionResponses.edvin__errand_configuration = meta(200); return; }
  if (nodeId === "4") { actionResponses.findorder = Object.assign(meta(200), { orderReference: "1122-047-131" }); return; }
}

const HUMAN_STOPS = new Set(["1", "6", "8", "23", "25", "47", "48", "53", "55", "57", "60", "77", "87"]);

function walk(startId, maxSteps = 800) {
  const path = [];
  let id = String(startId);
  for (let step = 0; step < maxSteps; step++) {
    const node = N[id];
    if (!node) throw new Error("missing node " + id);
    path.push(id);
    if (node.type === "Content" && HUMAN_STOPS.has(id)) return { stoppedAt: id, path };
    if (node.type === "Script") { runScript(id); id = String(node.continuation_node_id); continue; }
    if (node.type === "Data") { runData(id); id = String(node.continuation_node_id); continue; }
    if (node.type === "Scoring") { id = String(pickScoring(id)); continue; }
    if (node.type === "Content") {
      const btns = node.buttons || [];
      if (node.continuation_node_id && node.continuation_node_id !== "0") { id = String(node.continuation_node_id); continue; }
      if (btns.length === 1) { id = String(btns[0].button_link); continue; }
      return { stoppedAt: id, path };
    }
    if (node.type === "Tree") { id = String(node.return_tree_node_id || node.continuation_node_id); continue; }
    throw new Error("unknown node type " + node.type + " at " + id);
  }
  throw new Error("walk did not terminate (loop guard) - last path: " + path.slice(-25).join(" -> "));
}

function intake(selections) {
  for (const sel of selections) {
    session.transforms.channel = CHANNEL;
    session.transforms.category = CHANNEL.categories[0];
    session.transforms.current_pnr = {
      pnr: sel.pnr, postSaleHandleType: "GDS", passengers: PASSENGERS,
      formatted_passengers: PASSENGERS.map(p => `<div>${p.passengerFirstName}</div>`).join("")
    };
    session.form.type = sel.type.id;
    runScript(2, { notes: "test note " + sel.pnr });
  }
  runScript(12);
  const html = session.transforms.customer_action_table_html || "";
  const names = [...html.matchAll(/<select\b[^>]*name="([^"]+)"/g)].map(m => m[1]);
  names.forEach((name, i) => { session.form[name] = selections[i].action.id; });
}

function parseLog() {
  return (session.form.execution_log || "").split("~||~").filter(Boolean)
    .map(l => l.split("~:~"))
    .map(f => ({ seq: f[0], node: f[2], step: f[3], status: f[4], code: f[5], ref: f[6], detail: f[7] }));
}

// ---------------------------------------------------------------------------
let failures = 0;
function check(label, actual, expected) {
  const a = JSON.stringify(actual), e = JSON.stringify(expected);
  const ok = a === e;
  if (!ok) failures++;
  console.log(`  ${ok ? "PASS" : "FAIL"}  ${label}${ok ? "" : `\n          expected ${e}\n          actual   ${a}`}`);
}

function scenario(name, selections, fn) {
  console.log("\n=== " + name + " ===");
  reset();
  runScript(10);
  intake(selections);
  fn();
}

// 1. two proceed PNRs on DIFFERENT types -> 1 child + 2 grand children
scenario("proceed x2, two type+action combos", [
  { pnr: "Y4JU9G", type: TYPE_A, action: PROCEED },
  { pnr: "Y4K8XC", type: TYPE_B, action: PROCEED }
], () => {
  const r = walk(27);
  const creates = calls.filter(c => c.node === "33");
  check("stops at Closing Call", r.stoppedAt, "23");
  check("create calls", creates.length, 3);
  check("subjects", creates.map(c => c.subject), [
    "Child Ticket: Y4JU9G, Y4K8XC", "Grandchild Ticket: Y4JU9G", "Grandchild Ticket: Y4K8XC"]);
  check("grand children target the child's backing ticket",
    creates.slice(1).map(c => c.target), [creates[0].backing, creates[0].backing]);
  check("get-details calls == create calls", calls.filter(c => c.node === "63").length, 3);
  check("update calls == create calls", calls.filter(c => c.node === "66").length, 3);
  check("all updates open", calls.filter(c => c.node === "66").map(c => c.status), ["open", "open", "open"]);
  check("edvin registrations", calls.filter(c => c.node === "43").length, 2);
  check("node 37 no longer exists", N["37"] === undefined, true);
  const log = parseLog();
  check("every log entry OK", log.every(e => e.status === "OK" || e.status === "INFO"), true);
  check("log has a create entry per ticket", log.filter(e => e.step.indexOf("Create") === 0).length, 3);
  check("log ends with the run marker", log[log.length - 1].step, "Run finished");
});

// 2. two proceed PNRs sharing ONE type+action -> 1 child, no grand children
scenario("proceed x2, one combo", [
  { pnr: "Y4JU9G", type: TYPE_A, action: PROCEED },
  { pnr: "Y4K8XC", type: TYPE_A, action: PROCEED }
], () => {
  walk(27);
  const creates = calls.filter(c => c.node === "33");
  check("create calls", creates.length, 1);
  check("subject", creates[0].subject, "Child Ticket: Y4JU9G, Y4K8XC");
  check("edvin registrations", calls.filter(c => c.node === "43").length, 1);
});

// 3. one proceed + two distinct non-proceed -> 1 child + 2 silent
scenario("mixed proceed + 2 silent", [
  { pnr: "AAA111", type: TYPE_A, action: PROCEED },
  { pnr: "BBB222", type: TYPE_A, action: NO_ACTION },
  { pnr: "CCC333", type: TYPE_B, action: NO_ACTION_2 }
], () => {
  walk(27);
  const creates = calls.filter(c => c.node === "33");
  check("create calls", creates.length, 3);
  check("silent tickets created first", creates.map(c => c.subject), [
    "Silent Ticket: BBB222", "Silent Ticket: CCC333", "Child Ticket: AAA111"]);
  check("silent updates solved, child open",
    calls.filter(c => c.node === "66").map(c => c.status), ["solved", "solved", "open"]);
  check("all children hang off the root ticket", creates.map(c => c.target), ["334818", "334818", "334818"]);
  check("edvin registrations", calls.filter(c => c.node === "43").length, 3);
});

// 4. create fails once, agent retries -> both attempts land in the log
scenario("create fails, agent retries", [
  { pnr: "Y4JU9G", type: TYPE_A, action: PROCEED }
], () => {
  failOnce["33"] = true;
  const first = walk(27);
  check("routes to the shared failure screen", first.stoppedAt, "87");
  check("failure screen reached via node 86", first.path.includes("86"), true);
  let log = parseLog();
  check("failure written to the log before any retry", log.filter(e => e.status === "FAIL").length, 1);
  check("failure names the step", log.find(e => e.status === "FAIL").step, "Create Child Ticket");
  // Agent presses Retry -> node 88 routes back to the Data node by alias.
  const retry = walk(88);
  check("retry completes the run", retry.stoppedAt, "23");
  log = parseLog();
  check("log keeps the failure AND the success",
    log.filter(e => e.step === "Create Child Ticket").map(e => e.status), ["FAIL", "OK"]);
  check("one ticket created in the end", calls.filter(c => c.node === "33" && c.ok).length, 1);
});

// 5. Back-nav replay of node 27 must not double-create
scenario("replay node 27 (Back + Continue)", [
  { pnr: "Y4JU9G", type: TYPE_A, action: PROCEED },
  { pnr: "Y4K8XC", type: TYPE_B, action: PROCEED }
], () => {
  walk(27);
  const first = calls.filter(c => c.node === "33").length;
  walk(27);
  const total = calls.filter(c => c.node === "33").length;
  check("first pass creates", first, 3);
  check("replay creates nothing new", total, 3);
  check("edvin registrations not repeated", calls.filter(c => c.node === "43").length, 2);
});

console.log("\n" + (failures ? failures + " CHECK(S) FAILED" : "ALL CHECKS PASSED"));
process.exit(failures ? 1 : 0);
