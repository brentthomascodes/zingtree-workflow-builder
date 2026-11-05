// Real graph-walking harness for the ETG "Register Errands - Dynamic" tree.
//
// Unlike run_full.js (which hardcoded a node sequence and reimplemented routing
// decisions by hand), this walker starts at a node and follows the tree's ACTUAL
// button links / continuation_node_id / Scoring-node logic to decide what runs
// next, executing the real Script node bodies via vm, and only stopping at a
// Content node that needs a human click (at which point a scenario's `choose`
// callback picks the button, exactly mirroring what an agent would click).
//
// Data nodes (CX Actions / Connected Objects) are stubbed, but the stub for a
// given call is keyed by the *actual* alias each node's downstream scripts read
// (verified by reading node 64/65/69/71: nodes 33 and 37 share connected object
// #157 and BOTH populate `actions.create_child_ticket` - there is no separate
// `create_grandchild_ticket` alias in this tree. Same for #181 -> both node 63
// and node 70 populate `actions.get_side_conversation_detail`.) Getting this
// wrong is exactly the class of mistake a from-scratch reimplementation makes
// and a real walk avoids.
//
//   node graph_walk.mjs <tree.json> [scenario-name]
//   node graph_walk.mjs <tree.json>            # runs every scenario

import fs from "node:fs";
import vm from "node:vm";
import path from "node:path";

const treePath = process.argv[2];
if (!treePath) { console.error("usage: node graph_walk.mjs <tree.json> [scenario]"); process.exit(1); }
const tree = JSON.parse(fs.readFileSync(treePath, "utf8"));
const N = tree.nodes;
const only = process.argv[3];

// ---------------------------------------------------------------------------
// Session + script execution
// ---------------------------------------------------------------------------
function makeSession(formSeed) {
  return {
    form: Object.assign({}, formSeed || {}),
    transforms: {},
    actions: {},
    views: {},
    notes: "",
    logs: [],
    path: []
  };
}

function runScript(nodeId, session) {
  const body = N[nodeId].content;
  const snapshot = JSON.parse(JSON.stringify(session.transforms));
  const ZT = {
    getVariableValue(name, def) {
      const v = session.form[name];
      if (v === undefined || v === null) return def;
      if (v === "") return def === undefined ? "" : def;
      return v;
    },
    setFormData(n, v) { session.form[n] = v; },
    setTransformData(n, v) { session.transforms[n] = v; },
    setResponseData(n, v) { session.actions[n] = v; },
    log(m) {
      if (typeof m !== "string") throw new Error(`ZT.log takes one string, got ${typeof m}`);
      session.logs.push(`[node ${nodeId}] ${m}`);
    }
  };
  const sandbox = Object.assign({
    ZT, transforms: snapshot, actions: session.actions, views: session.views,
    notes: session.notes, console: { log() {} },
    JSON, Math, Object, Array, String, Number, Boolean, Set, Map
  });
  new vm.Script(body, { filename: `node-${nodeId}.js` })
    .runInContext(vm.createContext(sandbox), { timeout: 5000 });
}

// ---------------------------------------------------------------------------
// Scoring-node routing — the six expression shapes this tree actually uses.
// Deliberately NOT a general JS-expression evaluator: every logic_expression in
// this export is enumerated below (verified against the real export), so this
// evaluates exactly what the tree contains rather than guessing at a superset.
// ---------------------------------------------------------------------------
function asStr(v) { return String(v === undefined || v === null ? "" : v); }

function evalLogicExpr(expr, session) {
  const e = expr.trim();

  let m = /^len\(transforms\.(\w+)\)\s*(>=|==)\s*(\d+)$/.exec(e);
  if (m) {
    const len = (session.transforms[m[1]] || []).length;
    return m[2] === ">=" ? len >= Number(m[3]) : len === Number(m[3]);
  }

  m = /^transforms\.(\w+)\s*==\s*(true|false)$/.exec(e);
  if (m) return asStr(session.transforms[m[1]]) === m[2];

  m = /^(\w+)\s*==\s*(true|false)$/.exec(e);
  if (m) return asStr(session.form[m[1]]) === m[2];

  // Compound OR of `IDENT ==  "quoted"` / `IDENT == bare_ident` clauses (node 75).
  if (e.includes("||")) {
    const clauses = e.replace(/^\(/, "").replace(/\)$/, "").split("||").map(s => s.trim());
    return clauses.some(c => {
      const cm = /^(\w+)\s*==\s*"?([^"]+?)"?$/.exec(c);
      if (!cm) throw new Error("unhandled OR clause: " + c);
      return asStr(session.form[cm[1]]) === cm[2];
    });
  }

  throw new Error("unhandled logic expression: " + expr);
}

function pickNextByScoring(nodeId, session) {
  const node = N[nodeId];
  const btns = Object.values(node.buttons || {});
  for (const b of btns) {
    if (b.logic_expression) {
      if (evalLogicExpr(b.logic_expression, session)) return String(b.button_link);
      continue;
    }
    if (b.op === "eq") {
      if (asStr(session.form[b.button_text]) === asStr(b.button_data)) return String(b.button_link);
      continue;
    }
    if (b.op === "def") return String(b.button_link);
  }
  return String(node.continuation_node_id || 0);
}

// ---------------------------------------------------------------------------
// Data-node stubs — keyed by node id, mutate session.actions the way the real
// Connected Object response would land, including SHARED aliases where two
// nodes reuse the same connected object.
// ---------------------------------------------------------------------------
function runData(nodeId, session, mocks) {
  const stub = (mocks.dataStubs || {})[nodeId];
  if (!stub) { session.path.push(`[data ${nodeId}: no stub, no-op]`); return; }
  stub(session);
}

// ---------------------------------------------------------------------------
// The walker itself.
// ---------------------------------------------------------------------------
// Content nodes that need a human decision, and how many real buttons they have
// (for reporting only — the scenario's `choose` fn does the actual picking).
const HUMAN_CONTENT = new Set(["1", "6", "8", "23", "25", "47", "49", "77", "78", "84", "85"]);
const TERMINAL_CONTENT = new Set(["48"]); // End Session — genuinely no continuation

function walk(startId, session, mocks, maxSteps = 400) {
  let id = String(startId);
  const trace = [];
  for (let step = 0; step < maxSteps; step++) {
    const node = N[id];
    if (!node) return { crashed: true, at: id, error: `missing node ${id}`, trace };
    trace.push(id);

    let type = node.type;
    try {
      if (type === "Script") {
        runScript(id, session);
        id = String(node.continuation_node_id || 0);
        continue;
      }
      if (type === "Data") {
        runData(id, session, mocks);
        id = String(node.continuation_node_id || 0);
        continue;
      }
      if (type === "Scoring") {
        id = pickNextByScoring(id, session);
        continue;
      }
      if (type === "Content") {
        if (TERMINAL_CONTENT.has(id)) return { endedAt: id, trace, session };
        if (HUMAN_CONTENT.has(id)) {
          const choice = mocks.choose(id, node, session);
          if (choice == null) return { stoppedAt: id, trace, session }; // scenario says stop here
          id = String(choice);
          continue;
        }
        // Informational/processing content node (no buttons) — auto-advances.
        id = String(node.continuation_node_id || 0);
        if (id === "0") return { endedAt: trace.at(-1), trace, session };
        continue;
      }
      if (type === "Tree") {
        // A linked-tree hop (e.g. node 76, VI Details) — not modeled; treat as a
        // pass-through to its continuation since we're not exercising VI here.
        id = String(node.continuation_node_id || 0);
        continue;
      }
      return { crashed: true, at: id, error: `unhandled node type ${type}`, trace };
    } catch (err) {
      return { crashed: true, at: id, node: node.page_title, error: err.message, trace, session };
    }
  }
  return { crashed: true, at: id, error: "did not terminate (possible loop)", trace };
}

// ---------------------------------------------------------------------------
// Intake helper: nodes 1(agent picks type)/2(script)/11(more?) loop, followed
// by node 12 (render table) -> 25 (agent posts selections). Mirrors exactly
// what node 12/27 actually name fields as, by rendering + parsing the real HTML
// node 12 produces, the same contract check run_full.js already validated.
// ---------------------------------------------------------------------------
function doIntake(session, mocks, selections) {
  // node 24 has already set transforms.channel/category (via node 46) before we
  // get here in the real graph; the caller drives us starting at node 1 per PNR.
  for (const sel of selections) {
    session.transforms.current_pnr = {
      pnr: sel.pnr,
      postSaleHandleType: sel.postSaleHandleType || "GDS",
      id: sel.id,
      passengers: sel.passengers || [{ passengerFirstName: "Test", passengerLastName: "Passenger" }],
      formatted_passengers: "<div>Test Passenger</div>"
    };
    session.form.type = sel.type.id;
    session.notes = sel.notes || "";
    runScript("2", session);
  }
  runScript("12", session);
  const html = session.transforms.customer_action_table_html || "";
  const selects = [...html.matchAll(/<select\b([^>]*)name="([^"]+)"/g)].map(m => m[2]);
  selects.forEach((name, i) => {
    const sel = selections[i];
    if (!sel || sel.post === "none") return;
    if (sel.post === "name") { session.form[name] = sel.action.name; return; }
    if (sel.post === "foreign") { session.form[name] = sel.foreignActionId; return; }
    session.form[name] = sel.action.id;
  });
  return { selectNames: selects, html };
}

// ---------------------------------------------------------------------------
// Scenario matrix
// ---------------------------------------------------------------------------
const T1 = { id: "1321", name: "Voluntary - Fare rules" };
const T2 = { id: "1320", name: "24 hour rule" };
const A_PROCEED_1 = { id: 9001, name: "Sent to ticketing", bucket: { id: 4, name: "Proceed" } };
const A_PROCEED_2 = { id: 9002, name: "Sent to support", bucket: { id: 4, name: "Proceed" } };
const A_NOACTION = { id: 9003, name: "Do not proceed", bucket: { id: 3, name: "No action" } };
const A_DIFFREQ = { id: 9004, name: "Different request", bucket: { id: 5, name: "Different request" } };
const A_UNRECOGNIZED_BUCKET_STRING = { id: 9005, name: "Weird status", bucket: "pending" };

const EDVIN_CONFIG = {
  channels: [{
    id: "CH1",
    categories: [{
      name: "Cancellation",
      types: [
        { id: T1.id, name: T1.name, actions: [A_PROCEED_1, A_PROCEED_2, A_NOACTION, A_DIFFREQ, A_UNRECOGNIZED_BUCKET_STRING] },
        { id: T2.id, name: T2.name, actions: [A_PROCEED_1, A_PROCEED_2, A_NOACTION, A_DIFFREQ] }
      ]
    }]
  }]
};

function baseMocks(overrides) {
  let childCreateCalls = 0, gcCreateCalls = 0, childDetailCalls = 0, gcDetailCalls = 0;
  const sideConvSeq = { n: 2000 };
  const defaults = {
    findOrder: { orderReference: "1105-235-659", orderId: "ORD-1", orderProviderBookingDetails: [], orderLinkedProviderReferences: [] },
    childCreateOutcome: () => ({ ok: true }),   // or {ok:false} to model a failed create response shape
    childDetailOutcome: () => ({ ok: true }),   // or {ok:false} to model "backing ticket never materialized"
    gcCreateOutcome: () => ({ ok: true }),
    gcDetailOutcome: () => ({ ok: true })
  };
  const cfg = Object.assign({}, defaults, overrides || {});

  const dataStubs = {
    "4": (s) => { s.actions.findorder = cfg.findOrder; },
    "42": (s) => {
      s.actions.edvin__errand_configuration = EDVIN_CONFIG;
      s.actions.get_edvin_prop_long_value = { value: "CH1" };
    },
    "22": (s) => { /* Add Internal Note — nothing downstream reads its response */ },
    "33": (s) => {
      childCreateCalls++;
      const outcome = cfg.childCreateOutcome(childCreateCalls);
      s.actions.create_child_ticket = outcome.ok
        ? { _zt_meta: { response: { code: 201 } }, side_conversation: { id: String(++sideConvSeq.n) } }
        : { _zt_meta: { response: { code: 500 } } }; // no .side_conversation — mirrors a real failed create
    },
    "63": (s) => {
      childDetailCalls++;
      const outcome = cfg.childDetailOutcome(childDetailCalls);
      const id = s.actions.create_child_ticket && s.actions.create_child_ticket.side_conversation
        ? s.actions.create_child_ticket.side_conversation.id : null;
      s.actions.get_side_conversation_detail = {
        side_conversations: outcome.ok && id ? [{ id, external_ids: { targetTicketId: "TT-" + id } }] : []
      };
    },
    "66": (s) => { /* Update Child Ticket — nothing downstream reads its response */ },
    "37": (s) => {
      gcCreateCalls++;
      const outcome = cfg.gcCreateOutcome(gcCreateCalls);
      // SAME alias as node 33 — verified from node 69's actual source.
      s.actions.create_child_ticket = outcome.ok
        ? { _zt_meta: { response: { code: 201 } }, side_conversation: { id: String(++sideConvSeq.n) } }
        : { _zt_meta: { response: { code: 500 } } };
    },
    "70": (s) => {
      gcDetailCalls++;
      const outcome = cfg.gcDetailOutcome(gcDetailCalls);
      const id = s.actions.create_child_ticket && s.actions.create_child_ticket.side_conversation
        ? s.actions.create_child_ticket.side_conversation.id : null;
      // SAME alias as node 63 — verified from node 71's actual source.
      s.actions.get_side_conversation_detail = {
        side_conversations: outcome.ok && id ? [{ id, external_ids: { targetTicketId: "TT-" + id } }] : []
      };
    },
    "72": (s) => { /* Update Grandchild Ticket — nothing downstream reads its response */ },
    "43": (s) => { s.actions.edvin__register_errand = { ok: true }; // confirmed by Brent 2026-08-25 (double underscore); was single-underscore, wrong
    }
  };
  return { dataStubs, counts: () => ({ childCreateCalls, gcCreateCalls, childDetailCalls, gcDetailCalls }) };
}

// Nodes where the driver must inject agent input (a view payload or a form
// value) BEFORE the click can be simulated — these always pause the walk.
// Everything else in HUMAN_CONTENT (47/49/77/78/84/85) is a plain single-button
// "Continue" confirmation screen with nothing for the driver to set, so it auto-
// advances like any other content node with exactly one button.
const DRIVER_INPUT_NODES = new Set(["1", "6", "8", "25"]);

function defaultChoose(closingChoice) {
  return (nodeId, node, session) => {
    const btns = Object.values(node.buttons || {});
    if (nodeId === "23") {
      const wanted = closingChoice || "End Session";
      const b = btns.find(x => (x.button_text || "").split("::")[0] === wanted);
      return b ? b.button_link : btns[0].button_link;
    }
    if (DRIVER_INPUT_NODES.has(nodeId)) return null; // caller drives these manually
    return btns[0] ? btns[0].button_link : null;
  };
}

// Runs the full order->PNR->intake->27->create-loop->note->errand-loop->closing arc.
function runFullRound(session, mocks, selections, closingChoice) {
  const choose = defaultChoose(closingChoice);
  // node 4 (find order) -> 61 -> 6 (select PNRs, human) -> 24 -> [7->8->9->42->46->1->2->11 loop] -> 12->25(agent posts)->27->...
  let r = walk("4", session, mocks);
  if (r.crashed) return r;
  // r stopped at a human content node — should be "6" (Select PNRs)
  if (r.stoppedAt !== "6") return { crashed: true, at: r.stoppedAt, error: `expected to stop at node 6, got ${r.stoppedAt}`, trace: r.trace };

  session.views.findorder = selections.map((s, i) => ({ pnr: s.pnr, postSaleHandleType: s.postSaleHandleType || "GDS", id: s.id != null ? s.id : 5551 + i }));
  r = walk("24", session, mocks); // -> 75 -> 7 -> 8(human, passengers) ...
  // Walk the per-PNR loop manually since node 8's passenger view and node 1's
  // type selection are both scenario-driven human inputs.
  let idx = 0;
  let cur = r.stoppedAt;
  while (cur === "8") {
    const sel = selections[idx];
    session.views.findorder = (sel.passengers || [{ passengerFirstName: "Test", passengerLastName: "Passenger" }]);
    let r2 = walk("9", session, mocks); // 9 -> 42 -> 46 -> 1(human: pick type)
    if (r2.crashed) return r2;
    if (r2.stoppedAt !== "1") return { crashed: true, at: r2.stoppedAt, error: `expected to stop at node 1, got ${r2.stoppedAt}`, trace: r2.trace };
    session.form.type = sel.type.id;
    session.notes = sel.notes || ""; // node 2 reads the sandbox `notes` global, not a form/transform value
    let r3 = walk("2", session, mocks); // 2 -> 11 -> (7 again, or 12)
    if (r3.crashed) return r3;
    idx++;
    cur = r3.stoppedAt;
  }
  if (cur !== "12" && !(N[cur] && cur === "25")) {
    // node 12 is a Script, not a human stop — walk should have run through it to 25
  }
  // We land here once node 11 says "no more PNRs" and falls through 12 -> 25.
  const { selectNames } = (function () {
    // node 12 already ran as part of the walk above (Script nodes auto-run); parse
    // its rendered HTML the same way a browser would.
    const html = session.transforms.customer_action_table_html || "";
    const names = [...html.matchAll(/<select\b([^>]*)name="([^"]+)"/g)].map(m => m[2]);
    names.forEach((name, i) => {
      const sel = selections[i];
      if (!sel || sel.post === "none") return;
      if (sel.post === "name") { session.form[name] = sel.action.name; return; }
      if (sel.post === "foreign") { session.form[name] = sel.foreignActionId; return; }
      session.form[name] = sel.action.id;
    });
    return { selectNames: names };
  })();

  // The agent has now set every customer_action_<pnr>_<i> select — that's the
  // click on node 25's "Continue" button, which links straight to 27. Walk from
  // there through ticket creation, auto-clicking every human confirmation
  // content node (84/85/78) and the requested Closing Call branch.
  const finalWalk = walk("27", session, mocks);
  return finalWalk;
}

const scenarios = {};

function scenario(name, fn) { scenarios[name] = fn; }

scenario("clean_single_pnr_proceed", () => {
  const session = makeSession({ zd_ticket_id: "999001", custom_field_29658558478738: "contact_reason__cancellation" });
  const { dataStubs } = baseMocks();
  const sel = [{ pnr: "9D89VM", type: T1, action: A_PROCEED_1 }];
  return { result: runFullRound(session, { dataStubs, choose: defaultChoose("End Session") }, sel, "End Session"), session, expect: { child: 1, grandchild: 0, silent: 0, errands: 1 } };
});

scenario("two_pnrs_diff_type_diff_action_proceed", () => {
  const session = makeSession({ zd_ticket_id: "999002", custom_field_29658558478738: "contact_reason__cancellation" });
  const { dataStubs } = baseMocks();
  const sel = [{ pnr: "9D89VM", type: T1, action: A_PROCEED_1 }, { pnr: "AUU84K", type: T2, action: A_PROCEED_2 }];
  return { result: runFullRound(session, { dataStubs, choose: defaultChoose("End Session") }, sel, "End Session"), session, expect: { child: 1, grandchild: 2, silent: 0, errands: 2 } };
});

scenario("mixed_proceed_and_no_action", () => {
  const session = makeSession({ zd_ticket_id: "999003", custom_field_29658558478738: "contact_reason__cancellation" });
  const { dataStubs } = baseMocks();
  const sel = [{ pnr: "9D89VM", type: T1, action: A_PROCEED_1 }, { pnr: "AUU84K", type: T1, action: A_NOACTION }];
  return { result: runFullRound(session, { dataStubs, choose: defaultChoose("End Session") }, sel, "End Session"), session, expect: { child: 1, grandchild: 0, silent: 1, errands: 2 } };
});

scenario("unrecognized_bucket_string_writes_false_silent", () => {
  const session = makeSession({ zd_ticket_id: "999004", custom_field_29658558478738: "contact_reason__cancellation" });
  const { dataStubs } = baseMocks();
  const sel = [{ pnr: "9D89VM", type: T1, action: A_UNRECOGNIZED_BUCKET_STRING }];
  // A truly invalid run should record NOTHING. If this scenario shows child/
  // silent/errand counts > 0, that IS finding #1 from the last regression pass,
  // now reproduced via the real graph instead of a reimplementation.
  return { result: runFullRound(session, { dataStubs, choose: defaultChoose("End Session") }, sel, "End Session"), session, expect: { child: 0, grandchild: 0, silent: 0, errands: 0 } };
});

scenario("nothing_selected_unresolved", () => {
  // Node 27 correctly puts an unposted/unrecognized selection into
  // unresolved_selections and leaves it OUT of both child_tickets and final_pnrs.
  // Node 3 (Scoring, "Any child tickets to create?") guards the ticket-creation
  // branch on len(child_tickets)>=1 and safely skips to 21 when there are none —
  // but there is NO equivalent guard before node 44 (Loop Errands to Register).
  // Node 22 -> 44 is an unconditional continuation, so when final_pnrs is empty
  // (every PNR unresolved), node 44 still runs `final_pnrs[0]` unguarded and
  // throws on `current_pnr.type` with current_pnr === undefined. Real, confirmed
  // via this exact node body — not a harness artifact. This crash is CORRECT/
  // expected per the walker; it documents a genuine unhandled path.
  const session = makeSession({ zd_ticket_id: "999005", custom_field_29658558478738: "contact_reason__cancellation" });
  const { dataStubs } = baseMocks();
  const sel = [{ pnr: "9D89VM", type: T1, action: A_PROCEED_1, post: "none" }];
  return { result: runFullRound(session, { dataStubs, choose: defaultChoose("End Session") }, sel, "End Session"), session, expectCrash: true };
});

scenario("CRASH_child_create_fails", () => {
  const session = makeSession({ zd_ticket_id: "999006", custom_field_29658558478738: "contact_reason__cancellation" });
  const { dataStubs } = baseMocks({ childCreateOutcome: () => ({ ok: false }) });
  const sel = [{ pnr: "9D89VM", type: T1, action: A_PROCEED_1 }];
  return { result: runFullRound(session, { dataStubs, choose: defaultChoose("End Session") }, sel, "End Session"), session, expectCrash: true };
});

scenario("CRASH_child_detail_never_resolves", () => {
  const session = makeSession({ zd_ticket_id: "999007", custom_field_29658558478738: "contact_reason__cancellation" });
  const { dataStubs } = baseMocks({ childDetailOutcome: () => ({ ok: false }) });
  const sel = [{ pnr: "9D89VM", type: T1, action: A_PROCEED_1 }];
  return { result: runFullRound(session, { dataStubs, choose: defaultChoose("End Session") }, sel, "End Session"), session, expectCrash: true };
});

scenario("CRASH_grandchild_create_fails", () => {
  const session = makeSession({ zd_ticket_id: "999008", custom_field_29658558478738: "contact_reason__cancellation" });
  const { dataStubs } = baseMocks({ gcCreateOutcome: (n) => ({ ok: n !== 1 }) }); // first grandchild's create fails
  const sel = [{ pnr: "9D89VM", type: T1, action: A_PROCEED_1 }, { pnr: "AUU84K", type: T2, action: A_PROCEED_2 }];
  return { result: runFullRound(session, { dataStubs, choose: defaultChoose("End Session") }, sel, "End Session"), session, expectCrash: true };
});

scenario("CRASH_grandchild_detail_never_resolves", () => {
  const session = makeSession({ zd_ticket_id: "999009", custom_field_29658558478738: "contact_reason__cancellation" });
  const { dataStubs } = baseMocks({ gcDetailOutcome: () => ({ ok: false }) });
  const sel = [{ pnr: "9D89VM", type: T1, action: A_PROCEED_1 }, { pnr: "AUU84K", type: T2, action: A_PROCEED_2 }];
  return { result: runFullRound(session, { dataStubs, choose: defaultChoose("End Session") }, sel, "End Session"), session, expectCrash: true };
});

scenario("additional_request_second_round_independent", () => {
  // Node 27 recomputes child_tickets/final_pnrs fresh each round from
  // transforms.customer_action_pnrs, which node 29 (Clear Data, the
  // Additional-Request re-entry path) resets to []. So round 2's *counts*
  // are standalone by construction, not cumulative — confirmed here.
  const session = makeSession({ zd_ticket_id: "999010", custom_field_29658558478738: "contact_reason__cancellation" });
  const { dataStubs } = baseMocks();
  const round1 = [{ pnr: "9D89VM", type: T1, action: A_PROCEED_1 }];
  const r1 = runFullRound(session, { dataStubs, choose: defaultChoose("Additional Request") }, round1, "Additional Request");
  if (r1.crashed) return { result: r1, session };
  // node 47 -> Continue -> 29 (Clear Data) -> 4 again for round 2
  const round2 = [{ pnr: "XX111X", type: T2, action: A_NOACTION }];
  const r2 = runFullRound(session, { dataStubs, choose: defaultChoose("End Session") }, round2, "End Session");
  return { result: r2, session, expect: { child: 0, grandchild: 0, silent: 1, errands: 1 } };
});

scenario("additional_request_same_key_reused_across_rounds", () => {
  // The specific historical defect node 29's comments name (Zendesk 334577 /
  // 334588 "duplicate-grandchild reports", v37 fix): if the idempotency guard
  // keys (registered_errand_keys / attempted_child_ticket_keys) leaked across
  // an Additional Request re-entry, a round 2 with the SAME (type + action)
  // pair as round 1 would be silently skipped as "already done". Node 29 is
  // supposed to clear those keys on this exact path. Reusing the identical
  // pnr/type/action pair in round 2 here proves whether that fix holds in the
  // current PRODUCTION export.
  const session = makeSession({ zd_ticket_id: "999011", custom_field_29658558478738: "contact_reason__cancellation" });
  const { dataStubs } = baseMocks();
  const round1 = [{ pnr: "9D89VM", type: T1, action: A_PROCEED_1 }];
  const r1 = runFullRound(session, { dataStubs, choose: defaultChoose("Additional Request") }, round1, "Additional Request");
  if (r1.crashed) return { result: r1, session };
  const round2 = [{ pnr: "AAAAAA", type: T1, action: A_PROCEED_1 }]; // same type+action pair, different PNR
  const r2 = runFullRound(session, { dataStubs, choose: defaultChoose("End Session") }, round2, "End Session");
  return { result: r2, session, expect: { child: 1, grandchild: 0, silent: 0, errands: 1 }, note: "if this comes back child:0/errands:0 instead, the v37 key-clearing fix has regressed and round 2 is being silently suppressed as a duplicate" };
});

scenario("legacy_display_name_submit", () => {
  // node 27's findAction matches on actionId, id, OR name — posting the label
  // text instead of the numeric id (an older client / stale cached dropdown)
  // should still resolve cleanly.
  const session = makeSession({ zd_ticket_id: "999012", custom_field_29658558478738: "contact_reason__cancellation" });
  const { dataStubs } = baseMocks();
  const sel = [{ pnr: "9D89VM", type: T1, action: A_PROCEED_1, post: "name" }];
  return { result: runFullRound(session, { dataStubs, choose: defaultChoose("End Session") }, sel, "End Session"), session, expect: { child: 1, grandchild: 0, silent: 0, errands: 1 } };
});

scenario("stale_action_id_from_other_type", () => {
  // Agent is in T1's context but the posted value is an action id that only
  // exists on T2's list (e.g. stale dropdown state from a prior render).
  // T1's actions_array is [PROCEED_1, PROCEED_2, NOACTION, DIFFREQ, UNRECOGNIZED]
  // (ids 9001-9005) — 9999 exists on neither list, simulating the foreign-id case.
  const session = makeSession({ zd_ticket_id: "999013", custom_field_29658558478738: "contact_reason__cancellation" });
  const { dataStubs } = baseMocks();
  const sel = [{ pnr: "9D89VM", type: T1, action: A_PROCEED_1, post: "foreign", foreignActionId: 9999 }];
  // A foreign id should NOT resolve — same as nothing posted. Expect the
  // no-guard-before-node-44 crash to reproduce here too, on a totally
  // different trigger (bad id, not blank), which is the point: any unresolved
  // selection at all hits the same unguarded node 44 path.
  return { result: runFullRound(session, { dataStubs, choose: defaultChoose("End Session") }, sel, "End Session"), session, expectCrash: true };
});

scenario("duplicate_pnrs_same_type_same_action", () => {
  const session = makeSession({ zd_ticket_id: "999014", custom_field_29658558478738: "contact_reason__cancellation" });
  const { dataStubs } = baseMocks();
  const sel = [
    { pnr: "9D89VM", id: 7001, type: T1, action: A_PROCEED_1 },
    { pnr: "9D89VM", id: 7001, type: T1, action: A_PROCEED_1 }
  ];
  return { result: runFullRound(session, { dataStubs, choose: defaultChoose("End Session") }, sel, "End Session"), session, expect: { child: 1, grandchild: 0, silent: 0, errands: 1 }, note: "duplicate PNR/id — joinPnrs de-dupes via a Set, so this should collapse to one PNR in the ticket title rather than double-counting" };
});

scenario("regex_unsafe_pnr_characters", () => {
  const session = makeSession({ zd_ticket_id: "999015", custom_field_29658558478738: "contact_reason__cancellation" });
  const { dataStubs } = baseMocks();
  const sel = [{ pnr: "AB-12/34", id: 7002, type: T1, action: A_PROCEED_1 }];
  return { result: runFullRound(session, { dataStubs, choose: defaultChoose("End Session") }, sel, "End Session"), session, expect: { child: 1, grandchild: 0, silent: 0, errands: 1 }, note: "PNR with punctuation — field-naming contract (node 12 -> 25/27) must survive the round trip; this is what run_full.js's engine.js already checked offline, now confirmed against the real node 12 render + node 27 parse" };
});

scenario("three_pnrs_two_share_pair_one_differs", () => {
  const session = makeSession({ zd_ticket_id: "999016", custom_field_29658558478738: "contact_reason__cancellation" });
  const { dataStubs } = baseMocks();
  const sel = [
    { pnr: "AAA111", id: 1, type: T1, action: A_PROCEED_1 },
    { pnr: "BBB222", id: 2, type: T1, action: A_PROCEED_1 },
    { pnr: "CCC333", id: 3, type: T1, action: A_PROCEED_2 }
  ];
  return { result: runFullRound(session, { dataStubs, choose: defaultChoose("End Session") }, sel, "End Session"), session, expect: { child: 1, grandchild: 2, silent: 0, errands: 2 } };
});

scenario("different_request_branch_no_stale_selection", () => {
  // node 23 -> "Different Request" -> 49 -> Continue -> 29 (Clear Data, same
  // reset as Additional Request) -> 77 -> 4. Confirms the second pass through
  // this branch doesn't inherit round 1's PNR/type/action.
  const session = makeSession({ zd_ticket_id: "999017", custom_field_29658558478738: "contact_reason__cancellation" });
  const { dataStubs } = baseMocks();
  const round1 = [{ pnr: "9D89VM", type: T1, action: A_PROCEED_1 }];
  const r1 = runFullRound(session, { dataStubs, choose: defaultChoose("Different Request") }, round1, "Different Request");
  if (r1.crashed) return { result: r1, session };
  const round2 = [{ pnr: "ZZ999Z", type: T2, action: A_NOACTION }];
  const r2 = runFullRound(session, { dataStubs, choose: defaultChoose("End Session") }, round2, "End Session");
  return { result: r2, session, expect: { child: 0, grandchild: 0, silent: 1, errands: 1 } };
});

scenario("notes_merge_across_shared_errand", () => {
  // The tree's own claude.md (node 5) logs a 2026-08-24 fix: buildFinalErrandRecord
  // (node 27) used to spread group[0] alone, so when 2+ PNRs collapse into one
  // errand, every PNR after the first had its agent notes silently dropped from the
  // Edvin "Agent Notes" line. The changelog entry explicitly flags this as "not yet
  // verified against etg-errand-regression's harness ... recommend a hand-repro
  // before this ships." This scenario is that verification, run for real.
  const session = makeSession({ zd_ticket_id: "999018", custom_field_29658558478738: "contact_reason__cancellation" });
  const { dataStubs } = baseMocks();
  const sel = [
    { pnr: "AAA111", id: 1, type: T1, action: A_PROCEED_1, notes: "agent note for AAA111" },
    { pnr: "BBB222", id: 2, type: T1, action: A_PROCEED_1, notes: "agent note for BBB222" }
  ];
  const result = runFullRound(session, { dataStubs, choose: defaultChoose("End Session") }, sel, "End Session");
  return {
    result, session,
    expect: { child: 1, grandchild: 0, silent: 0, errands: 1, notes: "AAA111: agent note for AAA111 | BBB222: agent note for BBB222" }
  };
});

// ---------------------------------------------------------------------------
// Run
// ---------------------------------------------------------------------------
const toRun = only ? [only] : Object.keys(scenarios);
let pass = 0, fail = 0, crashes = 0;
const report = [];

for (const name of toRun) {
  const fn = scenarios[name];
  if (!fn) { console.error("unknown scenario: " + name); process.exit(1); }
  let outcome;
  try {
    outcome = fn();
  } catch (e) {
    outcome = { result: { crashed: true, error: "scenario setup threw: " + e.message }, session: null };
  }
  const { result, session, expect, expectCrash, note } = outcome;
  const row = { name, note };

  if (result.crashed) {
    row.status = expectCrash ? "CRASH (expected — confirms a broken path)" : "CRASH (UNEXPECTED)";
    row.crashNode = result.at;
    row.crashNodeTitle = result.node;
    row.error = result.error;
    row.trace = result.trace;
    crashes++;
    if (!expectCrash) fail++; else pass++;
  } else if (expectCrash) {
    row.status = "FAIL — expected a crash but the walk completed cleanly";
    row.endedAt = result.endedAt || result.stoppedAt;
    fail++;
  } else {
    const note27 = session.transforms.child_tickets_note || "";
    const isProceed = ct => (ct.child_ticket.bucket || "").trim().toLowerCase() === "proceed";
    const cts = session.transforms.child_tickets || [];
    const finalPnrs = session.transforms.final_pnrs || [];
    const got = {
      child: cts.filter(isProceed).length,
      grandchild: cts.reduce((s, ct) => s + (ct.child_ticket.grandchild_tickets || []).length, 0),
      silent: cts.filter(ct => !isProceed(ct)).length,
      errands: finalPnrs.length
    };
    if (expect && "notes" in expect) got.notes = finalPnrs[0] && finalPnrs[0].notes;
    row.got = got;
    row.expect = expect;
    row.note27Header = note27.split("\n")[0];
    row.endedAt = result.endedAt || result.stoppedAt;
    const ok = expect && JSON.stringify(got) === JSON.stringify(expect);
    row.status = ok ? "PASS" : "FAIL";
    if (ok) pass++; else fail++;
  }
  report.push(row);
}

console.log(`\n${path.basename(treePath)} — ${toRun.length} scenario(s): ${pass} pass, ${fail} fail (${crashes} crash${crashes === 1 ? "" : "es"})\n`);
report.forEach(r => {
  console.log(`[${r.status}] ${r.name}`);
  if (r.got) console.log(`   got ${JSON.stringify(r.got)}  expected ${JSON.stringify(r.expect)}  ended at node ${r.endedAt}${r.note27Header ? "  note: " + r.note27Header : ""}`);
  else if (r.endedAt) console.log(`   walk completed cleanly, ended/stopped at node ${r.endedAt}`);
  if (r.crashNode) console.log(`   crashed at node ${r.crashNode} (${r.crashNodeTitle}): ${r.error}`);
  if (r.note) console.log(`   ${r.note}`);
});

fs.writeFileSync(path.join(path.dirname(process.argv[2]), "..", "scripts", "graph-walk-report.json"), JSON.stringify(report, null, 2));
process.exit(fail ? 1 : 0);
