// Read the per-PNR action selections back from the action table (nodes 12/25),
// resolve each PNR's Edvin bucket, then group by DISTINCT (type + action) to build
// the Zendesk child/silent tickets, grandchild tickets, Edvin errand list, and note.
//
// Grouping rule (confirmed 2026-07-28 against the ETG errand-tracker test matrix,
// re-confirmed 2026-08-04 by the 62-case offline harness):
//   distinct errand = (type + customer_action) TOGETHER, never action alone.
//   PROCEED         -> exactly ONE active child ticket; one grandchild per distinct
//                      (type+action), only when 2+ distinct combos exist.
//   DO-NOT-PROCEED  -> ONE silent ticket covering all non-proceed PNRs.
//   Edvin errands   -> one per distinct (type+action) (final_pnrs feeds node 44).
//
// v24 (2026-08-04) - UNUSABLE SELECTIONS ARE NO LONGER RECORDED.
//   Up to v23, a PNR whose selection could not be read came out of here with
//   bucket "". isProceed("") is false, so it fell into the non-proceed branch and
//   was written as a SILENT TICKET - the same visible outcome as a genuine "Do not
//   proceed", from a completely different cause. The run then carried on: the note
//   posted, and node 44 registered an Edvin errand with a blank action against the
//   customer's order. The summary warned about it in prose, but by the time anyone
//   read that warning the errand existed.
//   Reproduced live on ZD sandbox 334703 (2026-08-04) and by three harness cases
//   (selection not posted; one of two lost; a stale action id from another type).
//
//   Now: anything we cannot turn into a real (action, known bucket) pair is a
//   PROBLEM, not an outcome. This node reports the problems, writes EMPTY ticket
//   and errand lists, and sets has_unresolved_selections so node 50 can route the
//   agent back to re-pick before anything is written anywhere. Empty lists are the
//   belt-and-braces half: even if the routing guard is ever bypassed, there is
//   nothing for nodes 32/44 to create.

const KNOWN_BUCKETS = ["proceed", "no_action", "escalate", "different_request"];

let customer_action_pnrs = transforms.customer_action_pnrs || [];

// Reconstruct the EXACT select name node 12 rendered. Node 12 sanitizes the PNR
// (safePnr) before naming the field; read it back the same way so the lookup never
// misses and silently drops a proceed PNR into the "default" bucket.
function safePnr(pnr) {
  return String(pnr || "").replace(/[^a-zA-Z0-9_-]/g, "_");
}

// Resolve the agent's dropdown pick to its Edvin action.
// Node 12 renders the option VALUE as the action id, but tolerate a display name
// too: a select rendered before a node-12 edit, or a PNR record left over from an
// older run (transforms persist ~1h), can still submit a name.
// Match order: actionId, then the action's own `id`, then display name.
function actionIdOf(action) {
  if (!action) return null;
  if (action.actionId != null) return action.actionId;
  if (action.id != null) return action.id;
  return null;
}

function findActionForSelection(item, selectedValue) {
  const empty = { name: "", bucket: "", edvin_actions: {}, actionId: null, resolved: false };
  if (selectedValue === null || selectedValue === undefined || String(selectedValue).trim() === "") return empty;
  const wanted = String(selectedValue).trim();
  const actionsArray = Array.isArray(item.actions_array) ? item.actions_array : [];

  let match = actionsArray.find(a => a && actionIdOf(a) != null && String(actionIdOf(a)) === wanted);
  if (!match) match = actionsArray.find(a => a && a.name && String(a.name).trim() === wanted);
  if (!match) return empty;

  return {
    name: match.name || "",
    bucket: match.bucket || "",
    edvin_actions: match.edvin_actions || {},
    actionId: actionIdOf(match),
    resolved: true
  };
}

// Why a selection is unusable, in the words the agent needs to hear. Three distinct
// causes, one shared consequence - keep them apart in the log, because they point at
// different fixes: a blank read is the form round trip (node 12/25), an unknown
// bucket is the Edvin payload (node 2's bucketKey), a missed lookup is stale state.
const PROBLEM_TEXT = {
  selection_unreadable: "no action came back from the dropdown for this PNR",
  options_missing: "the list of available actions for this PNR was lost before this step - re-select and continue",
  lookup_failed: "the submitted value did not match any action offered for this type",
  bucket_missing: "the action resolved but Edvin sent no routing bucket for it",
  bucket_unrecognized: "the action resolved but its bucket is not one Zingtree routes on"
};

// Collected fresh every run and passed DOWN by argument. Never read back via
// transforms.* in this same script: ZT.setTransformData does not update the local
// `transforms` snapshot mid-execution, so a read would return the PREVIOUS run's
// value (transforms persist ~1h) and warn on a perfectly good run.
let unresolved_selections = [];

let bucket_stitch = customer_action_pnrs.map((item, index) => {
  const variableName = `customer_action_${safePnr(item.pnr)}_${index}`;
  const rawSelection = ZT.getVariableValue(variableName, "");
  const selectedAction = findActionForSelection(item, rawSelection);
  const bucketNorm = String(selectedAction.bucket || "").trim().toLowerCase();

  let problem = "";
  if (!selectedAction.resolved) {
    // Three different failures, three different fixes - do not collapse them.
    //   blank read            -> the form round trip (node 12/25)
    //   value + NO options    -> this node's own record lost its actions_array (v34)
    //   value + options       -> genuinely stale/foreign value (the v33 type-change ghost)
    if (String(rawSelection).trim() === "") {
      problem = "selection_unreadable";
    } else if (!(Array.isArray(item.actions_array) && item.actions_array.length)) {
      problem = "options_missing";
    } else {
      problem = "lookup_failed";
    }
  } else if (!bucketNorm) {
    problem = "bucket_missing";
  } else if (KNOWN_BUCKETS.indexOf(bucketNorm) === -1) {
    problem = "bucket_unrecognized";
  }

  // Diagnostic: field name, raw submitted value, options available, outcome.
  // Distinguishes "the READ returned nothing" from "the LOOKUP found nothing".
  ZT.log("action resolve | field=" + variableName +
         " | raw=" + JSON.stringify(rawSelection) +
         " | options=" + JSON.stringify((item.actions_array || []).map(a => actionIdOf(a) + ":" + (a && a.name))) +
         " | resolved=" + selectedAction.resolved +
         " | bucket=" + JSON.stringify(selectedAction.bucket) +
         " | problem=" + (problem || "none"));

  if (problem) {
    unresolved_selections.push({
      pnr: item.pnr,
      field: variableName,
      raw: rawSelection,
      reason: problem,
      reason_text: PROBLEM_TEXT[problem],
      bucket: selectedAction.bucket,
      type: item.type || ""
    });
  }

  // v34: actions_array is KEPT on the stored record. See the note below the map.
  return {
    ...item,
    customer_action: selectedAction.name, // resolved from the matched action, not the raw select value
    actionId: selectedAction.actionId,
    bucket: selectedAction.bucket,
    edvin_actions: selectedAction.edvin_actions
  };
});

// --- the routing decision (v24) --------------------------------------------
// One scalar boolean for node 50's logic expression - form data, per the
// data-setting rules. The detail stays in transforms for the agent screen.
const has_unresolved_selections = unresolved_selections.length > 0;

// v34 - ALWAYS carry actions_array forward. Read this before "tidying" it away again.
//
// Up to v33 this node stripped actions_array from the records it wrote back, on the
// reasoning that nothing downstream of a CLEAN run needs it and it bloats the
// transform. v25 then restored it on FLAGGED runs only, so the node 51 re-select loop
// had options to rebuild.
//
// That made node 27 NON-IDEMPOTENT, and it is re-entered routinely. Node 25 is a
// content node with hide_back_restart = 0, so Back is on the page; Back returns the
// agent to node 25 and Continue fires this script a SECOND time. Node 12 does not
// re-run in between (it sits before 25), so nothing rebuilds what was stripped. With
// keep_vars_on_back = 1 the posted action ids are all still there - so pass 2 read a
// perfectly good id against an EMPTY option list and reported lookup_failed on every
// PNR at once. Reproduced 2026-08-05 with t8back.mjs against v33:
//     pass 1  raw="1868" options=7  -> 0 unresolved, 2 silent, 2 errands
//     pass 2  raw="1868" options=0  -> 2 unresolved, 0 tickets, 0 errands
// which is exactly the screen reported for tracker Test 8 ("Nothing has been recorded
// for this order yet"), on BOTH PNRs, under the one type they share.
//
// Keeping the array costs a few KB in the transform. Losing it costs the run.
const persisted_pnrs = bucket_stitch;

ZT.setTransformData("customer_action_pnrs", persisted_pnrs);
ZT.log("bucket_stitch: " + JSON.stringify(bucket_stitch));
if (has_unresolved_selections) {
  ZT.log("re-select prep | node 12 will rebuild the dropdowns from these option counts=" +
         JSON.stringify(persisted_pnrs.map(p => (p.actions_array || []).length)) +
         " | any 0 here means the record lost its actions_array upstream, not that the " +
         "agent picked badly");
}
ZT.setFormData("has_unresolved_selections", has_unresolved_selections);
ZT.setFormData("unresolved_selections_count", unresolved_selections.length);
ZT.setTransformData("unresolved_selections", unresolved_selections);

function escapeHtml(value) {
  if (value === null || value === undefined) return "";
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

// The agent-facing explanation for node 51. Warning tone, not error tone: nothing
// is broken from the customer's point of view and nothing has been recorded - the
// selection just has to be made again.
function buildUnresolvedHtml(rows) {
  // v30: inline style attributes only - no <style> block. This string is rendered by
  // node 51 through the same merge-field path as the action table, so it fails the
  // same way: a sanitizer that refuses <style> drops the markup after it and the
  // agent gets a blank screen at the exact moment they need an explanation.
  const BOX = "font-family:Arial,sans-serif;background:#fff7ed;border:1px solid #fed7aa;" +
              "border-radius:14px;padding:16px 18px;";
  const H = "margin:0 0 6px;font-size:16px;color:#7c2d12;";
  const P = "margin:0 0 12px;font-size:14px;line-height:1.5;color:#7c2d12;";
  const UL = "margin:0;padding-left:18px;";
  const LI = "font-size:14px;line-height:1.6;color:#7c2d12;";
  const PNR = "font-weight:700;";
  const WHY = "color:#9a3412;";

  let html = `<div style="${BOX}">` +
             `<h3 style="${H}">The customer action did not come through</h3>` +
             `<p style="${P}">Nothing has been recorded for this order yet - no tickets, ` +
             `no errand in Edvin. Pick the action again for the PNR(s) below and continue.</p>` +
             `<ul style="${UL}">`;
  rows.forEach(row => {
    html += `<li style="${LI}"><span style="${PNR}">${escapeHtml(row.pnr)}</span>` +
            (row.type ? ` (${escapeHtml(row.type)})` : "") +
            ` &ndash; <span style="${WHY}">${escapeHtml(row.reason_text || "the selection could not be read")}</span></li>`;
  });
  html += `</ul></div>`;
  return html;
}

ZT.setTransformData("unresolved_note_html", buildUnresolvedHtml(unresolved_selections));

if (has_unresolved_selections) {
  ZT.log("WARNING unresolved action selections (run halted at node 50): " +
         JSON.stringify(unresolved_selections));

  // Write EMPTY lists so a bypassed guard still creates nothing, and clear the
  // summary note so no stale text from a previous pass can reach node 21.
  ZT.setTransformData("child_tickets", []);
  ZT.setTransformData("final_pnrs", []);
  ZT.setTransformData("final_pnrs_count", 0);
  ZT.setTransformData("child_tickets_note", ``);
  ZT.setTransformData("planned_ticket_titles", []);
}

// Everything below runs only on a clean run. Guarded with an `if` rather than an
// early `return` on purpose - a Zingtree script node is a plain single-pass script,
// not a function body, so top-level `return` is not something to rely on.
if (!has_unresolved_selections) {

// GROUP //

// The distinct-errand key: type + action together.
const errandKey = it => `${it.type || ""}|${it.customer_action || ""}`;
const isProceed = it => (it.bucket || "").trim().toLowerCase() === "proceed";
const joinPnrs = items => [...new Set(items.map(i => i.pnr).filter(Boolean))].join(", ");

// Group PNR items into arrays keyed by (type+action), preserving first-seen order.
function groupByErrand(items) {
  const map = new Map();
  items.forEach(item => {
    const key = errandKey(item);
    if (!map.has(key)) map.set(key, []);
    map.get(key).push(item);
  });
  return [...map.values()];
}

//// Child Ticket Logic
function buildChildTickets(pnrs) {
  const childTickets = [];

  const toGrandchild = (item, pnrList) => ({
    title: `Grandchild Ticket: ${pnrList}`,
    pnr: pnrList,
    bucket: item.bucket,
    category: item.category,
    customer_action: item.customer_action || "",
    type: item.type || "",
    channel: item.channel || "",
    contact_reason: item.category || "",
    genesys_interaction_type: item.genesys_interaction_type || "N/A",
    formatted_passengers: item.formatted_passengers || ""
  });

  const proceed = pnrs.filter(isProceed);
  const nonProceed = pnrs.filter(item => !isProceed(item));

  // PROCEED: one active child for all proceeding PNRs. Grandchildren are one per
  // distinct (type+action), and only when there are 2+ distinct combos (a single
  // combo is fully described by the child ticket and needs no grandchildren).
  if (proceed.length) {
    const combos = groupByErrand(proceed);
    const child_ticket = {
      title: `Child Ticket: ${joinPnrs(proceed)}`,
      pnr: joinPnrs(proceed),
      bucket: proceed[0].bucket,
      category: proceed[0].category,
      customer_action: proceed[0].customer_action || "",
      type: proceed[0].type || "",
      formatted_passengers: proceed.map(i => i.formatted_passengers || "").join(""),
      grandchild_tickets: []
    };
    if (combos.length > 1) {
      child_ticket.grandchild_tickets = combos.map(group => {
        const pnrList = joinPnrs(group);
        const gc = toGrandchild(group[0], pnrList);
        gc.formatted_passengers = group.map(i => i.formatted_passengers || "").join("");
        return gc;
      });
    }
    childTickets.push({ child_ticket });
  }

  // DO NOT PROCEED: ONE silent ticket per distinct (type + customer action) among the
  // non-proceed PNRs, each covering every PNR that shares that pair. Never any
  // grandchildren. Scales to N - three non-proceed PNRs spanning three distinct pairs
  // produce three silent tickets; spanning one pair, one.
  //
  // CHANGED 2026-08-05 (Brent, tracker "Testing 3"). v18 consolidated these into a
  // SINGLE silent ticket covering all non-proceed PNRs, which is what the earlier
  // "Testing 2" matrix recorded. The tracker now expects:
  //   Test 5  - different type, different action, both do-not-proceed  -> 2 silent
  //   Test 6a - same type,      different action, both do-not-proceed  -> 2 silent
  //   Test 6b - same type,      same action,      both do-not-proceed  -> 1 silent
  //   Test 8  - same type,      different action, Different request + DNP -> 2 silent
  // That is exactly the (type + action) key already used for grandchildren and Edvin
  // errands, so silent tickets now group by the same rule as everything else here.
  // Do not re-consolidate without changing the tracker and oracle.js together.
  groupByErrand(nonProceed).forEach(group => {
    childTickets.push({
      child_ticket: {
        title: `Silent Ticket: ${joinPnrs(group)}`,
        pnr: joinPnrs(group),
        bucket: group[0].bucket,
        category: group[0].category,
        customer_action: group[0].customer_action || "",
        type: group[0].type || "",
        formatted_passengers: group.map(i => i.formatted_passengers || "").join(""),
        grandchild_tickets: []
      }
    });
  });

  // Keep actual child tickets (bucket = proceed) last (unchanged ordering contract).
  const isProceedTicket = ct => (ct.child_ticket.bucket || "").trim().toLowerCase() === "proceed";
  childTickets.sort((a, b) => Number(isProceedTicket(a)) - Number(isProceedTicket(b)));

  return childTickets;
}

let child_tickets = buildChildTickets(bucket_stitch);
ZT.setTransformData("child_tickets", child_tickets);

// v24: the titles this run INTENDS to create, so node 21 can reconcile them against
// created_child_ticket_keys / created_grandchild_ticket_keys (nodes 14/16) and stop
// the note promising a ticket that a failed create never made (ZD 334468).
let planned_ticket_titles = [];
child_tickets.forEach(ct => {
  planned_ticket_titles.push(ct.child_ticket.title);
  (ct.child_ticket.grandchild_tickets || []).forEach(gc => planned_ticket_titles.push(gc.title));
});
ZT.setTransformData("planned_ticket_titles", planned_ticket_titles);

// Edvin errand-registration list: one entry per distinct (type+action) so node 44
// registers exactly one errand per distinct errand. Built fresh each run (never
// appended) so a Back-nav re-entry cannot double the list.
// FIX 2026-08-13 (Brent, Olga report on 1134-295-788 / 1136-636-661 / 1125-140-358):
// group[0] alone drops every PNR after the first in a shared (type+action) group -
// the Edvin errand for that pair showed only ONE pnr ("should be pnr1, pnr2") and
// only that PNR's free-text notes, because rec.pnr / rec.notes in node 44's
// buildErrandMessage read straight off this record. buildChildTickets (above) already
// joins the group correctly with joinPnrs()/formatted_passengers - final_pnrs never did.
// Now every final_pnrs entry carries the FULL group: joined pnr list, every PNR's notes
// (each kept, pnr-labeled, so two different free-text notes both survive), and every
// PNR's passengers concatenated - same treatment child/silent tickets already get.
let final_pnrs = groupByErrand(bucket_stitch).map(group => {
  const base = group[0];
  const notes = group
    .filter(i => i.notes && String(i.notes).trim() !== "")
    .map(i => `${i.pnr}: ${String(i.notes).trim()}`)
    .join(" | ");
  return {
    ...base,
    pnr: joinPnrs(group),
    notes,
    formatted_passengers: group.map(i => i.formatted_passengers || "").join("")
  };
});
ZT.setTransformData("final_pnrs", final_pnrs);


//// Child Tickets Summary Note (Zendesk ticket update)
function buildChildTicketsNote(childTickets) {
  const isProceedTicket = (ct) =>
    (ct.child_ticket.bucket || "").trim().toLowerCase() === "proceed";

  const childCount = childTickets.filter(isProceedTicket).length;
  const silentCount = childTickets.filter(ct => !isProceedTicket(ct)).length;
  const grandchildCount = childTickets.reduce((sum, ct) => {
    const gcs = ct.child_ticket.grandchild_tickets;
    return sum + (Array.isArray(gcs) ? gcs.length : 0);
  }, 0);

  let note = `(Child Tickets: ${childCount}, Grand Child Tickets: ${grandchildCount}, Silent Tickets: ${silentCount})\n\n`;

  // v24: no unresolved-selection warning here any more. It cannot happen on a run
  // that reaches this line - node 50 turns those runs back at node 51 instead of
  // recording them and apologizing in prose.

  childTickets.forEach(ct => {
    const t = ct.child_ticket;
    const label = isProceedTicket(ct) ? "Child Ticket" : "Silent Ticket";

    // v19 (R-A): Bucket removed from the SUMMARY - the per-PNR blocks in node 21
    // carry it now (v23), where it sits next to the action it came from.
    note += `**${label}**: ${t.pnr},
  **Contact Reason**: ${t.category || ""},
  **Type**: ${t.type || ""},
  **Customer Action**: ${t.customer_action || ""}
`;

    const gcs = Array.isArray(t.grandchild_tickets) ? t.grandchild_tickets : [];
    gcs.forEach(gc => {
      note += `  - **Grandchild Ticket**: ${gc.pnr}, Action: ${gc.customer_action || ""}, Contact Reason: ${gc.contact_reason || ""}, Genesys Interaction Type: ${gc.genesys_interaction_type || "N/A"}\n`;
    });

    note += `\n`;
  });

  return note.trim();
}

let child_tickets_note = buildChildTicketsNote(child_tickets);
ZT.setTransformData("child_tickets_note", child_tickets_note);
ZT.log("child_tickets_note: " + child_tickets_note);

} // end: clean-run branch