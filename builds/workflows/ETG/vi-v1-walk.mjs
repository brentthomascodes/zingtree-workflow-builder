// Stubbed-ZT smoke test / every-path stress test for the VI tree.
// Executes the REAL node bodies (via vm) with mocked ZT/transforms/actions/views,
// walking representative scenarios end to end and asserting key invariants.
//
//   node walk.mjs "<tree.json>"

import fs from "node:fs";
import vm from "node:vm";

const treePath = process.argv[2];
const tree = JSON.parse(fs.readFileSync(treePath, "utf8"));
const N = tree.nodes;

const EDVIN_CONFIG = {
  channels: [{
    id: "CH1",
    categories: [{
      id: "CAT-VI", name: "Virtual Interlining",
      types: [
        {
          id: "T1", name: "SC-VI - Alternative flight",
          actions: [
            { id: "A1", name: "Rebook onto alternative", bucket: { id: 4, name: "Proceed" } },
            { id: "A2", name: "Do not proceed", bucket: { id: 3, name: "No action" } },
          ],
        },
        {
          id: "T2", name: "SC-VI - New ticket sell",
          actions: [
            { id: "A3", name: "Issue new ticket", bucket: { id: 4, name: "Proceed" } },
          ],
        },
      ],
    }],
  }],
};

function freshSession() {
  return {
    form: {
      zd_ticket_id: "999001",
      custom_field_33772689958162: "ORDER-REF-1",
      custom_field_29559177650834: "contact_reason__virtual_interlining",
      custom_field_31975964556050: "GEN-CONV-1",
      custom_field_31213052370194: "chat",
      custom_field_28137345621650: "en",
    },
    transforms: {},
    logs: [],
  };
}

function makeGlobals(session, actionResponses, viewResponses) {
  const ZT = {
    getVariableValue(name, def) {
      if (name in session.form) return session.form[name];
      return def;
    },
    setFormData(name, val) { session.form[name] = val; },
    setTransformData(name, val) { session.transforms[name] = val; },
    log(msg) { session.logs.push(String(msg)); },
  };
  return {
    ZT,
    transforms: session.transforms,
    actions: actionResponses || {},
    views: viewResponses || {},
    console,
  };
}

function runScript(nodeId, session, actionResponses, viewResponses) {
  const body = N[String(nodeId)].content;
  const ctx = makeGlobals(session, actionResponses, viewResponses);
  vm.runInNewContext(body, ctx, { filename: `node_${nodeId}.js` });
  return ctx;
}

function assert(cond, msg) {
  if (!cond) throw new Error("ASSERTION FAILED: " + msg);
}

function chooseType(session, typeId) { session.form["vi_type_id"] = typeId; }
function chooseAction(session, actionId) { session.form["vi_action_id"] = actionId; }

let scenariosRun = 0;
let scenariosPassed = 0;

function scenario(name, fn) {
  scenariosRun++;
  try {
    fn();
    scenariosPassed++;
    console.log(`PASS: ${name}`);
  } catch (e) {
    console.log(`FAIL: ${name}`);
    console.log("  " + e.stack.split("\n").slice(0, 4).join("\n  "));
  }
}

// ---------------------------------------------------------------------------
// Scenario 1: Outside window, alternative flight available, PROCEED, 1 PNR.
// ---------------------------------------------------------------------------
scenario("Outside window / alt flight available / proceed / 1 PNR", () => {
  const s = freshSession();
  runScript(1, s, {}, {});
  runScript(4, s, {}, { findorder: [{ pnr: "AAA111" }] });
  s.form.disruption_type = "Schedule change outside the Operational Window";
  runScript(7, s, {}, {});
  assert(s.form.is_outside_window === true, "is_outside_window should be true");
  assert(s.form.is_within_window === false, "is_within_window should be false");
  // ladder: node 9 "Alternative flight available" -> node 15 (setter: resolved)
  runScript(15, s, {}, {});
  assert(s.form.vi_ladder_outcome === "resolved", "outcome should be resolved");
  runScript(19, s, { edvin__errand_configuration: EDVIN_CONFIG, get_edvin_prop_long_value: { value: "CH1" } }, {});
  assert(s.transforms.vi_type.length === 2, "vi_type should have 2 types");
  chooseType(s, "T1");
  runScript(21, s, {}, {});
  assert(s.transforms.vi_actions_array.length === 2, "T1 should have 2 actions");
  chooseAction(s, "A1");
  runScript(23, s, {}, {});
  assert(s.form.vi_resolved_type === "SC-VI - Alternative flight", "resolved type");
  assert(s.form.vi_resolved_action === "Rebook onto alternative", "resolved action");
  assert(s.form.vi_resolved_bucket === "proceed", "resolved bucket");
  assert(s.transforms.child_tickets.length === 1, "exactly one child ticket entry");
  assert(s.transforms.child_tickets[0].child_ticket.title === "Child Ticket: AAA111", "child ticket title");
  assert(s.transforms.child_tickets[0].child_ticket.grandchild_tickets.length === 0, "no grandchildren for plain 'resolved'");
  assert(s.transforms.vi_final_pnrs.length === 1, "one errand-to-register entry");

  // child ticket loop (single item, runs once)
  runScript(25, s, {}, {}); // Loop Child Tickets
  assert(s.form.child_ticket_already_created === false, "not yet created");
  assert(s.form.is_grandchild_tickets === false, "no grandchildren");
  runScript(27, s, {}, {}); // Mark child ticket created (node 14 body — runs after "create")
  runScript(39, s, {}, {}); // Format Internal Note
  assert(s.transforms.internal_note_details.includes("AAA111"), "note mentions PNR");

  // errand loop (1 entry)
  runScript(41, s, {}, { findorder: { orderReference: "ORDER-REF-1" } });
  assert(s.form.is_more_vi_errands === false, "single-PNR errand loop should not repeat");
  assert(s.form.skip_errand_registration === false, "first pass should not skip");
});

// ---------------------------------------------------------------------------
// Scenario 2: Outside window, accommodation needed -> follow_up -> grandchild;
// non-proceed bucket via action A2; 3 PNRs.
// ---------------------------------------------------------------------------
scenario("Outside window / accommodation follow-up / no_action bucket / 3 PNRs", () => {
  const s = freshSession();
  runScript(1, s, {}, {});
  runScript(4, s, {}, { findorder: [{ pnr: "P1" }, { pnr: "P2" }, { pnr: "P3" }] });
  assert(s.transforms.selected_pnrs.length === 3, "3 PNRs selected");
  s.form.disruption_type = "Schedule change outside the Operational Window";
  runScript(7, s, {}, {});
  runScript(16, s, {}, {}); // "requiring accomodation" -> follow_up setter
  assert(s.form.vi_ladder_outcome === "follow_up", "outcome should be follow_up");
  runScript(19, s, { edvin__errand_configuration: EDVIN_CONFIG, get_edvin_prop_long_value: { value: "CH1" } }, {});
  chooseType(s, "T1");
  runScript(21, s, {}, {});
  chooseAction(s, "A2"); // "Do not proceed" -> no_action bucket
  runScript(23, s, {}, {});
  assert(s.form.vi_resolved_bucket === "no_action", "bucket should be no_action");
  assert(s.transforms.child_tickets[0].child_ticket.title === "Silent Ticket: P1, P2, P3", "silent ticket, all 3 PNRs");
  assert(s.transforms.child_tickets[0].child_ticket.grandchild_tickets.length === 0,
         "R11 AC-11.2: non-proceed buckets get NO grandchildren even if follow_up");
  // R10 (Q1 answered, Brent 2026-08-05): vi_final_pnrs is deduped by node 23 using
  // the parent's exact node-27 groupByErrand(type+action) logic. Every PNR here
  // shares the same type+action (R8), so this collapses to exactly ONE entry
  // regardless of how many PNRs were selected - the same behavior the parent
  // tree already has whenever multiple PNRs happen to share a type+action.
  assert(s.transforms.vi_final_pnrs.length === 1, "vi_final_pnrs dedupes to exactly 1 entry (shared type+action, R10)");
  assert(s.transforms.vi_final_pnrs[0].pnr === "P1", "the representative entry is the first selected PNR");

  // errand loop should run exactly ONCE (one distinct type+action pair) even
  // though 3 PNRs were selected - proves removing the intake cursor (R2) did not
  // break the source array feeding node 41 (Brent's stress-test ask).
  let iterations = 0;
  do {
    runScript(41, s, {}, { findorder: { orderReference: "ORDER-REF-1" } });
    iterations++;
  } while (s.form.is_more_vi_errands === true && iterations < 10);
  assert(iterations === 1, `expected exactly 1 errand-loop iteration for a shared type+action, got ${iterations}`);
  assert(s.transforms.registered_errand_keys.length === 1, "1 distinct registered errand key (type|action)");
});

// ---------------------------------------------------------------------------
// Scenario 3: proceed + follow_up -> grandchild IS created (proceed bucket).
// ---------------------------------------------------------------------------
scenario("Proceed bucket + follow_up outcome -> exactly one grandchild", () => {
  const s = freshSession();
  runScript(1, s, {}, {});
  runScript(4, s, {}, { findorder: [{ pnr: "Q1" }, { pnr: "Q2" }] });
  s.form.disruption_type = "Trip delay within the Operational Window";
  s.form.delay_reason = "Baggage delay or loss";
  runScript(7, s, {}, {});
  assert(s.form.is_within_window === true, "trip delay within window routes Within");
  runScript(16, s, {}, {}); // follow_up
  runScript(19, s, { edvin__errand_configuration: EDVIN_CONFIG, get_edvin_prop_long_value: { value: "CH1" } }, {});
  chooseType(s, "T2");
  runScript(21, s, {}, {});
  chooseAction(s, "A3"); // proceed
  runScript(23, s, {}, {});
  assert(s.form.vi_resolved_bucket === "proceed", "proceed bucket");
  const gcs = s.transforms.child_tickets[0].child_ticket.grandchild_tickets;
  assert(gcs.length === 1, "exactly one grandchild ticket for a proceed + follow_up outcome");
  assert(gcs[0].title === "Grandchild Ticket: Q1, Q2", "grandchild titled with all PNRs");
});

// ---------------------------------------------------------------------------
// Scenario 4: idempotency guard - re-running node 25/26-equivalent script twice
// with the same title must not double-create (attempted_child_ticket_keys).
// ---------------------------------------------------------------------------
scenario("Child-ticket idempotency guard blocks a replay", () => {
  const s = freshSession();
  runScript(1, s, {}, {});
  runScript(4, s, {}, { findorder: [{ pnr: "R1" }] });
  s.form.disruption_type = "Schedule change outside the Operational Window";
  runScript(7, s, {}, {});
  runScript(15, s, {}, {});
  runScript(19, s, { edvin__errand_configuration: EDVIN_CONFIG, get_edvin_prop_long_value: { value: "CH1" } }, {});
  chooseType(s, "T1"); runScript(21, s, {}, {}); chooseAction(s, "A1"); runScript(23, s, {}, {});
  runScript(25, s, {}, {}); // Loop Child Tickets — first pass
  assert(s.form.child_ticket_already_created === false, "first pass not yet created");
  runScript(25, s, {}, {}); // replay (Back + Continue) — same title
  assert(s.form.child_ticket_already_created === true, "replay should be caught by attempted_child_ticket_keys guard");
});

// ---------------------------------------------------------------------------
// Scenario 5: Last resort placeholder path still reaches the type/action screen.
// ---------------------------------------------------------------------------
scenario("Within window / no alternative / no new ticket / cancellation / last resort", () => {
  const s = freshSession();
  runScript(1, s, {}, {});
  runScript(4, s, {}, { findorder: [{ pnr: "Z1" }] });
  s.form.disruption_type = "Schedule change within the Operational Window";
  runScript(7, s, {}, {});
  assert(s.form.is_within_window === true, "within window");
  // 13 (no alt) -> 14 (no new ticket) -> 11 (cancellation, "Last resort") -> 12 -> 17
  runScript(17, s, {}, {});
  assert(s.form.vi_ladder_outcome === "last_resort", "last_resort outcome recorded");
  runScript(19, s, { edvin__errand_configuration: EDVIN_CONFIG, get_edvin_prop_long_value: { value: "CH1" } }, {});
  chooseType(s, "T1"); runScript(21, s, {}, {}); chooseAction(s, "A2"); runScript(23, s, {}, {});
  assert(s.transforms.child_tickets.length === 1, "last-resort path still produces exactly one ticket entry");
});

// ---------------------------------------------------------------------------
// Scenario 6: "Additional Request" re-entry (node 48 Clear Data) resets VI state.
// ---------------------------------------------------------------------------
scenario("Additional Request re-entry clears VI-specific state", () => {
  const s = freshSession();
  runScript(1, s, {}, {});
  runScript(4, s, {}, { findorder: [{ pnr: "X1" }] });
  s.form.disruption_type = "Schedule change outside the Operational Window";
  runScript(7, s, {}, {});
  runScript(15, s, {}, {});
  runScript(19, s, { edvin__errand_configuration: EDVIN_CONFIG, get_edvin_prop_long_value: { value: "CH1" } }, {});
  chooseType(s, "T1"); runScript(21, s, {}, {}); chooseAction(s, "A1"); runScript(23, s, {}, {});
  assert(s.form.vi_resolved_type, "resolved type set before reset");
  runScript(48, s, {}, {}); // Clear Data (Additional Request path)
  assert(s.form.vi_resolved_type === "", "vi_resolved_type cleared");
  assert(s.form.vi_resolved_action === "", "vi_resolved_action cleared");
  assert(s.transforms.vi_final_pnrs.length === 0, "vi_final_pnrs cleared");
  assert(s.transforms.child_tickets.length === 0, "child_tickets cleared");
  assert(s.form.is_more_vi_errands === false, "errand loop flag cleared");
  // registered_errand_keys is intentionally NOT cleared (mirrors parent R17 vs R10 tension,
  // flagged open in claude.md) - assert it is untouched by node 48.
});

// ---------------------------------------------------------------------------
// Scenario 7: errand-loop replay safety - re-running node 41 for the SAME PNR
// after it already registered must skip on the second pass.
// ---------------------------------------------------------------------------
scenario("Errand-loop replay safety (Back + Continue) skips a duplicate registration", () => {
  const s = freshSession();
  runScript(1, s, {}, {});
  runScript(4, s, {}, { findorder: [{ pnr: "Y1" }] });
  s.form.disruption_type = "Schedule change outside the Operational Window";
  runScript(7, s, {}, {});
  runScript(15, s, {}, {});
  runScript(19, s, { edvin__errand_configuration: EDVIN_CONFIG, get_edvin_prop_long_value: { value: "CH1" } }, {});
  chooseType(s, "T1"); runScript(21, s, {}, {}); chooseAction(s, "A1"); runScript(23, s, {}, {});
  runScript(41, s, {}, { findorder: { orderReference: "ORDER-REF-1" } });
  assert(s.form.skip_errand_registration === false, "first registration not skipped");
  // Simulate Back + Continue: node 23 re-runs (re-resolves the SAME pick), then the
  // errand loop re-enters at node 41 with the cursor reset to 0 by node 23.
  runScript(23, s, {}, {});
  runScript(41, s, {}, { findorder: { orderReference: "ORDER-REF-1" } });
  assert(s.form.skip_errand_registration === true, "replay for the same PNR must be skipped (registered_errand_keys survives node 23)");
});

console.log(`\n${scenariosPassed}/${scenariosRun} scenarios passed.`);
if (scenariosPassed !== scenariosRun) process.exit(1);

// ---------------------------------------------------------------------------
// Scenario 8 (Brent's explicit stress-test ask, 2026-08-05 correction): removing
// the intake PNR loop (R2) must not break the array feeding the UNCHANGED
// errand-registration loop (node 41) for either a 1-PNR or a 3-PNR VI order.
// ---------------------------------------------------------------------------
function runToRegistration(pnrList) {
  const s = freshSession();
  runScript(1, s, {}, {});
  runScript(4, s, {}, { findorder: pnrList.map(pnr => ({ pnr })) });
  s.form.disruption_type = "Schedule change outside the Operational Window";
  runScript(7, s, {}, {});
  runScript(15, s, {}, {});
  runScript(19, s, { edvin__errand_configuration: EDVIN_CONFIG, get_edvin_prop_long_value: { value: "CH1" } }, {});
  chooseType(s, "T1"); runScript(21, s, {}, {}); chooseAction(s, "A1"); runScript(23, s, {}, {});
  let iterations = 0;
  do {
    runScript(41, s, {}, { findorder: { orderReference: "ORDER-REF-1" } });
    iterations++;
  } while (s.form.is_more_vi_errands === true && iterations < 10);
  return { s, iterations };
}

scenario("1-PNR order registers exactly one errand", () => {
  const { s, iterations } = runToRegistration(["SOLO1"]);
  assert(iterations === 1, `expected 1 iteration, got ${iterations}`);
  assert(s.transforms.registered_errand_keys.length === 1, "1 registered errand key");
  assert(s.form.skip_errand_registration === false, "the single PNR's errand was actually registered, not skipped");
});

scenario("3-PNR order (shared type+action) also registers exactly one errand", () => {
  const { s, iterations } = runToRegistration(["TRI1", "TRI2", "TRI3"]);
  assert(iterations === 1, `expected 1 iteration (dedup collapses 3 PNRs sharing one type+action), got ${iterations}`);
  assert(s.transforms.registered_errand_keys.length === 1, "1 registered errand key");
  assert(s.transforms.vi_final_pnrs.length === 1, "vi_final_pnrs fed node 41 with exactly the deduped entry");
});

console.log(`\n${scenariosPassed}/${scenariosRun} scenarios passed.`);
if (scenariosPassed !== scenariosRun) process.exit(1);
