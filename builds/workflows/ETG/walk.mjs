// Graph-walking driver for the ETG dynamic-errand tree.
//
// The offline harness (run_full.js) stubs the create loop: it reads
// transforms.child_tickets and assumes one create per entry. That is exactly the
// assumption under test in the "duplicate grandchild" report, so this driver walks
// the REAL continuation graph instead and executes the REAL node bodies, counting
// every node 33 / node 37 invocation.
//
//   node walk.mjs <tree.json> <scenario>

import fs from "node:fs";
import vm from "node:vm";

const treePath = process.argv[2];
const scenarioName = process.argv[3] || "clean";
const tree = JSON.parse(fs.readFileSync(treePath, "utf8"));
const N = tree.nodes;

// --- the ETG dataset from Olga's report -------------------------------------
// Real ids and bucket shapes from the live Edvin errand-configuration response
// (Requirements/ETG/edvin-errand-config-cancellation-2026-08-04.json). Buckets are
// OBJECTS here, not snake_case strings, so this also exercises node 2's BUCKET_BY_ID
// mapping on the way through - the assumed config never did.
const TYPE_A = { id: "1321", name: "Voluntary - Fare rules" };
const TYPE_B = { id: "1320", name: "24 hour rule" };
const SENT_TO_SUPPORT = { id: "1973", name: "Sent to support", bucket: { id: 4, name: "Proceed" } };
const OTHER = { id: "1869", name: "Do not proceed", bucket: { id: 3, name: "No action" } };

const CHANNEL = {
  id: "CH-PHONE", name: "Phone",
  categories: [{
    id: "CAT-CANC", name: "Cancellation",
    types: [
      { id: TYPE_A.id, name: TYPE_A.name, actions: [ {...SENT_TO_SUPPORT, edvin_actions:{}}, {...OTHER, edvin_actions:{}} ] },
      { id: TYPE_B.id, name: TYPE_B.name, actions: [ {...SENT_TO_SUPPORT, edvin_actions:{}}, {...OTHER, edvin_actions:{}} ] }
    ]
  }]
};

const PASSENGERS = [
  { passengerFirstName: "Aslan Imdat", passengerLastName: "YILMAZ" },
  { passengerFirstName: "Erkan", passengerLastName: "YILMAZ" },
  { passengerFirstName: "Aysegul", passengerLastName: "YILMAZ" }
];

const SELECTIONS = [
  { pnr: "Y4JU9G", type: TYPE_A, action: SENT_TO_SUPPORT },
  { pnr: "Y4K8XC", type: TYPE_B, action: SENT_TO_SUPPORT }
];

// --- session ----------------------------------------------------------------
const session = {
  form: {
    zd_ticket_id: "334818",
    orderReference: "1122-047-131",
    custom_field_33772689958162: "1122-047-131",
    custom_field_29559177650834: "contact_reason__cancellation",
    channel: "Phone"
  },
  transforms: { customer_action_pnrs: [] },
  logs: []
};

// Zendesk side: side conversation ids handed back by node 33, and the list node 40
// returns. Zendesk creates the backing ticket asynchronously, which node 36 handles.
let sideConvSeq = 1000;
const sideConversations = [];   // what node 40 returns
const createCalls = [];        // every node 33 / 37 invocation

// `actions.*` — the Connected Object response aliases visible to scripts.
let actionResponses = {
  findorder: { orderReference: "1122-047-131" },
  get_side_conversation_detail: { side_conversations: sideConversations }
};

function runScript(nodeId, extraGlobals) {
  const body = N[String(nodeId)].content;
  const snapshot = JSON.parse(JSON.stringify(session.transforms));
  const ZT = {
    getVariableValue(name, def) {
      const v = session.form[name];
      if (v === undefined || v === null) return def;
      if (v === "") return def === undefined ? "" : (def === 0 ? "" : (def === "" ? "" : v));
      return v;
    },
    setFormData(n, v) { session.form[n] = v; },
    setTransformData(n, v) { session.transforms[n] = v; },
    log(m) {
      if (typeof m !== "string") throw new Error("ZT.log takes one string");
      session.logs.push(`[${nodeId}] ${m}`);
    }
  };
  const sandbox = Object.assign({
    ZT, transforms: snapshot, actions: actionResponses, views: {},
    console: { log(){} }, JSON, Math, Object, Array, String, Number, Boolean, Set, Map
  }, extraGlobals || {});
  new vm.Script(body, { filename: `node-${nodeId}.js` })
    .runInContext(vm.createContext(sandbox), { timeout: 5000 });
}

// Truthiness the engine's `op:eq` comparison sees: the form value stringified.
const asStr = v => String(v === undefined || v === null ? "" : v);

function evalLogic(expr) {
  // Only the handful of expressions this tree actually uses.
  let m = /^(\w+)\s*==\s*(true|false)$/.exec(expr.trim());
  if (m) return asStr(session.form[m[1]]) === m[2];
  m = /^len\(transforms\.(\w+)\)\s*(>=|==)\s*(\d+)$/.exec(expr.trim());
  if (m) {
    const len = (session.transforms[m[1]] || []).length;
    return m[2] === ">=" ? len >= Number(m[3]) : len === Number(m[3]);
  }
  m = /^transforms\.(\w+)\s*==\s*(true|false)$/.exec(expr.trim());
  if (m) return asStr(session.transforms[m[1]]) === m[2];
  throw new Error("unhandled logic expression: " + expr);
}

function pickScoring(nodeId) {
  const btns = Object.values(N[String(nodeId)].buttons || {})
    .sort((a, b) => Number(a.rank) - Number(b.rank));
  for (const b of btns) {
    if (b.op === "def") return b.button_link;
    if (b.logic_expression) { if (evalLogic(b.logic_expression)) return b.button_link; continue; }
    if (b.op === "eq") { if (asStr(session.form[b.button_text]) === asStr(b.button_data)) return b.button_link; continue; }
  }
  return N[String(nodeId)].continuation_node_id;
}

const runDataRef = { fn: null };

// --- the Data nodes that matter ---------------------------------------------
function runDataImpl(nodeId) {
  if (nodeId === "33") {                     // ZD - Create Child Ticket
    const t = session.transforms.child_ticket || {};
    const id = ++sideConvSeq;
    createCalls.push({ node: "33", kind: "child", subject: t.subject });
    // Zendesk returns the side conversation; its backing ticket appears in node 40's
    // list with a targetTicketId.
    actionResponses.create_child_ticket = {
      _zt_meta: { response: { code: 201 } },
      side_conversation: { id: String(id) }
    };
    sideConversations.push({ id: String(id), external_ids: { targetTicketId: "334823" } });
    return;
  }
  if (nodeId === "37") {                     // ZD - Create Grandchild Ticket
    const t = session.transforms.child_ticket || {};
    createCalls.push({
      node: "37", kind: "grandchild", subject: t.subject,
      parent: session.form.grandchild_parent_id
    });
    actionResponses.create_grandchild_ticket = { _zt_meta: { response: { code: 201 } } };
    return;
  }
  // 22/53 note, 40 get side conversations, 42/43 Edvin — no state this test needs.
  if (nodeId === "43") createCalls.push({ node: "43", kind: "edvin" });
}

runDataRef.fn = runDataImpl;
const runData = (id) => runDataRef.fn(id);

// --- intake: nodes 2 / 12, then the browser posts the selections ------------
function intake(selections) {
  for (const sel of selections) {
    session.transforms.channel = CHANNEL;
    session.transforms.category = CHANNEL.categories[0];
    session.transforms.current_pnr = {
      pnr: sel.pnr, postSaleHandleType: "GDS", passengers: PASSENGERS,
      formatted_passengers: PASSENGERS.map(p => `<div>${p.passengerFirstName}</div>`).join("")
    };
    session.form.type = sel.type.id;
    runScript(2, { notes: "test" });
  }
  runScript(12);
  // The browser posts the option values back, the way node 12 named the fields.
  const html = session.transforms.customer_action_table_html || "";
  const names = [...html.matchAll(/<select\b[^>]*name="([^"]+)"/g)].map(m => m[1]);
  names.forEach((name, i) => { session.form[name] = selections[i].action.id; });
  return names;
}

// --- walk from a node until we hit a Content node that needs a human ---------
const CONTENT_STOPS = new Set(["1", "6", "8", "23", "25", "47", "48", "49", "51"]);

function walk(startId, maxSteps = 500) {
  const path = [];
  let id = String(startId);
  for (let step = 0; step < maxSteps; step++) {
    const node = N[id];
    if (!node) throw new Error("missing node " + id);
    path.push(id);
    if (node.type === "Content" && CONTENT_STOPS.has(id)) return { stoppedAt: id, path };
    if (node.type === "Script") { runScript(id); id = String(node.continuation_node_id); continue; }
    if (node.type === "Data") { runData(id); id = String(node.continuation_node_id); continue; }
    if (node.type === "Scoring") { id = String(pickScoring(id)); continue; }
    if (node.type === "Content") { id = String(node.continuation_node_id || 0); if (id === "0") return { stoppedAt: path.at(-1), path }; continue; }
    throw new Error("unknown node type " + node.type + " at " + id);
  }
  throw new Error("walk did not terminate");
}

// ---------------------------------------------------------------------------
// Scenarios
// ---------------------------------------------------------------------------
const scenarios = {
  // Zendesk MADE the first grandchild side conversation, but the CO response came
  // back non-2xx, so node 16's v25 "confirmed create" check leaves the title
  // un-recorded. The agent then presses Back on node 25 and Continues (node 27 is
  // idempotent in v34, so the run proceeds) -> the create loop replays.
  gc_first_unconfirmed_then_replay() {
    runScript(10);
    intake(SELECTIONS);
    let gcCreates = 0;
    const origRunData = runDataRef.fn;
    runDataRef.fn = (nodeId) => {
      if (nodeId === "37") {
        gcCreates++;
        const t = session.transforms.child_ticket || {};
        createCalls.push({ node: "37", kind: "grandchild", subject: t.subject,
                           parent: session.form.grandchild_parent_id });
        // First create: Zendesk made it, but the response is not a clean 2xx.
        actionResponses.create_grandchild_ticket = {
          _zt_meta: { response: { code: gcCreates === 1 ? 502 : 201 } }
        };
        return;
      }
      return origRunData(nodeId);
    };
    const first = walk(27);
    const second = walk(27);
    return [first, second];
  },

  // Same, but the run is never replayed - shows what the note claims vs what exists.
  gc_first_unconfirmed_only() {
    runScript(10);
    intake(SELECTIONS);
    const origRunData = runDataRef.fn;
    let gcCreates = 0;
    runDataRef.fn = (nodeId) => {
      if (nodeId === "37") {
        gcCreates++;
        const t = session.transforms.child_ticket || {};
        createCalls.push({ node: "37", kind: "grandchild", subject: t.subject,
                           parent: session.form.grandchild_parent_id });
        actionResponses.create_grandchild_ticket = {
          _zt_meta: { response: { code: gcCreates === 1 ? 502 : 201 } }
        };
        return;
      }
      return origRunData(nodeId);
    };
    return [walk(27)];
  },

  // A single clean pass: intake, node 27, then the create loop.
  clean() {
    runScript(10);
    intake(SELECTIONS);
    return [walk(27)];
  },

  // The agent presses Back on node 25 and Continues again, so node 27 fires twice.
  // v34 made node 27 idempotent; this checks the CREATE LOOP under the same replay.
  back_at_25() {
    runScript(10);
    intake(SELECTIONS);
    const first = walk(27);         // full run, tickets created
    const second = walk(27);        // Back -> Continue -> node 27 again
    return [first, second];
  },

  // The agent finishes, then picks "Additional Request" (node 47 -> 29) and runs a
  // second errand on the same Zendesk ticket.
  additional_request() {
    runScript(10);
    intake(SELECTIONS);
    const first = walk(27);
    runScript(29);
    intake(SELECTIONS);
    const second = walk(27);
    return [first, second];
  },

  // Zendesk has not yet materialized the side conversation's backing ticket when
  // node 40 fires (the async window node 36's fallback exists for).
  async_parent_missing() {
    runScript(10);
    intake(SELECTIONS);
    const realPush = sideConversations.push.bind(sideConversations);
    sideConversations.push = function (x) { return realPush({ id: x.id, external_ids: {} }); };
    return [walk(27)];
  },

  // Node 41 is a Content node with escalate_after=1 SEC and continuation 40. If the
  // auto-advance and an agent/app-driven continue both fire, node 40 -> 36 is entered
  // twice for the same child ticket.
  node41_double_advance() {
    runScript(10);
    intake(SELECTIONS);
    // walk to the point where node 41 auto-advances, then enter the grandchild loop
    // a second time from node 40 as the duplicate advance would.
    const first = walk(27);
    const second = walk(40);
    return [first, second];
  },

  // v38: REVERTED to the original single-check shape (node 40 fetches once per
  // child ticket, node 36 resolves inline, no retry). v36/v37's
  // grandchild_parent_resolves_after_retries scenario relied on v37's separate
  // per-attempt fetch nodes (26/54), which no longer exist - there is no
  // per-grandchild retry left to test, so that scenario is gone rather than
  // reworked. What v38 DOES change from every version before v36: on a miss,
  // this blocks instead of guessing a wrong parent and creating anyway. Since
  // node 40 fetches once per child ticket (node 38 loops directly back to 36,
  // never back through 39/41/40 - true since before v36), the outcome is the
  // same for every grandchild under that child ticket: all created, or all
  // blocked together. Covered below by grandchild_parent_never_resolves (all
  // blocked) and the existing clean/back_at_25/etc. scenarios (all created).

  // Zendesk NEVER materializes the backing ticket by the time node 40 fetches
  // (its one fetch per child ticket). Every grandchild under that child ticket
  // must be skipped entirely - not attempted, not created - and called out as
  // BLOCKED rather than lumped into the generic "not confirmed" warning. This
  // is the scenario async_parent_missing used to model against the OLD
  // pre-v36 fallback-and-guess behaviour; the outcome here is materially
  // different (nothing fires, instead of firing against a guessed parent).
  grandchild_parent_never_resolves() {
    runScript(10);
    intake(SELECTIONS);
    const realPush = sideConversations.push.bind(sideConversations);
    sideConversations.push = function (x) { return realPush({ id: x.id, external_ids: {} }); };
    return [walk(27)];
  }
};

const fn = scenarios[scenarioName];
if (!fn) { console.error("scenarios: " + Object.keys(scenarios).join(", ")); process.exit(1); }
const results = fn();

console.log(`\n=== ${treePath.split("/").pop()} | scenario: ${scenarioName} ===`);
results.forEach((r, i) => console.log(`pass ${i + 1}: stopped at node ${r.stoppedAt}`));

const gc = createCalls.filter(c => c.kind === "grandchild");
const ch = createCalls.filter(c => c.kind === "child");
console.log(`\nchild creates      : ${ch.length}`);
ch.forEach(c => console.log(`   node 33 -> ${c.subject}`));
console.log(`grandchild creates : ${gc.length}`);
gc.forEach(c => console.log(`   node 37 -> ${c.subject}   (parent ${c.parent})`));
console.log(`edvin registrations: ${createCalls.filter(c => c.kind === "edvin").length}`);

const note = session.transforms.child_tickets_note || "";
console.log(`\nnote header        : ${note.split("\n")[0]}`);
console.log(`created_child_keys : ${JSON.stringify(session.transforms.created_child_ticket_keys)}`);
console.log(`created_gc_keys    : ${JSON.stringify(session.transforms.created_grandchild_ticket_keys)}`);
console.log(`attempted_gc_keys  : ${JSON.stringify(session.transforms.attempted_grandchild_ticket_keys)}`);
console.log(`blocked_parents    : ${JSON.stringify(session.transforms.blocked_grandchild_parent_keys)}`);
console.log(`blocked_gc_titles  : ${JSON.stringify(session.transforms.blocked_grandchild_ticket_titles)}`);
console.log(`blocked (last pass): ${session.form.grandchild_parent_blocked}`);
const blockedTitles = session.transforms.blocked_grandchild_ticket_titles || [];
const attemptedKeys = session.transforms.attempted_grandchild_ticket_keys || [];
const wronglyAttempted = blockedTitles.filter(t => attemptedKeys.includes(t));
if (blockedTitles.length && wronglyAttempted.length) {
  console.log(`\n*** BLOCKED titles wrongly marked attempted: ${JSON.stringify(wronglyAttempted)} ***`);
} else if (blockedTitles.length) {
  console.log(`\nblocked titles correctly absent from attempted_grandchild_ticket_keys`);
}

const dupes = {};
gc.forEach(c => { dupes[c.subject] = (dupes[c.subject] || 0) + 1; });
const dupTitles = Object.entries(dupes).filter(([, n]) => n > 1);
if (dupTitles.length) {
  console.log(`\n*** DUPLICATE GRANDCHILDREN: ${dupTitles.map(([t, n]) => `${t} x${n}`).join(", ")} ***`);
} else {
  console.log(`\nno duplicate grandchildren`);
}

if (process.env.NOTE) { console.log("\n--- internal_note_details ---"); console.log(session.transforms.internal_note_details || "(empty)"); }
if (process.env.LOGS) { console.log("\n--- logs ---"); session.logs.forEach(l => console.log(l)); }
