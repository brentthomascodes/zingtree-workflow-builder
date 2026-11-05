// Offline replay of the VI hand-off chain: node 80 -> 1(form) -> 2 -> 12 -> 25(agent picks)
// -> 27 -> 81, against a mock Edvin errand-configuration shaped like the real one
// (bucket as {id, name} with HUMAN LABELS).
import fs from "fs";

const tree = JSON.parse(fs.readFileSync("/tmp/zt/Register Errands - VI Dynamic (v6 dropdowns + combined-PNR hand-off 2026-08-21).json", "utf8"));
const src = id => tree.nodes[id].content;

const BUCKETS = {
  proceed: { id: 4, name: "Proceed" },
  no_action: { id: 3, name: "No action" },
  different_request: { id: 5, name: "Different request" }
};

const edvinCategory = {
  id: 11,
  name: "Self Transfer Guarantee",
  types: [
    {
      id: 501,
      name: "Against Self Transfer Guarantee",
      actions: [
        { id: 9001, name: "Rebooking - alternative offered & accepted", bucket: BUCKETS.proceed, edvin_actions: { a: 1 } },
        { id: 9002, name: "Refund of the directly affected flight", bucket: BUCKETS.proceed },
        { id: 9003, name: "Customer declined / no action", bucket: BUCKETS.no_action },
        { id: 9004, name: "Ancillaries & Services / Products", bucket: BUCKETS.different_request },
        { id: 9005, name: "Bucket arrives blank", bucket: null }
      ]
    }
  ]
};
const edvinChannel = { id: 2, name: "Phone", categories: [edvinCategory] };

function makeCtx(vars, transforms) {
  const logs = [];
  const ZT = {
    getVariableValue: (k, d) => (vars[k] === undefined || vars[k] === null || vars[k] === "" ? d : vars[k]),
    setFormData: (k, v) => { vars[k] = v; },
    setTransformData: (k, v) => { transforms[k] = v; },
    setResponseData: () => {},
    log: m => logs.push(m)
  };
  return { ZT, logs };
}

function run(nodeId, vars, transforms, actions, views) {
  const { ZT, logs } = makeCtx(vars, transforms);
  const fn = new Function("ZT", "transforms", "actions", "views", '"use strict";' + src(nodeId));
  fn(ZT, transforms, actions, views);
  return logs;
}

function scenario(name, pickLabel, selectedPnrs) {
  console.log("\n================ " + name);
  const vars = {
    // VI screen answers (dropdowns)
    partner: "ETG",
    disruption_type: "Schedule change within 24 hour window",
    flight_affected: "Directly affected flight",
    stg_alternatives_sameday_sc: "Alternative for the directly affected flight",
    // node 1
    type: "501",
    notes: "Pax at the airport, rebooked on the 18:40.",
    zd_ticket_id: "334999"
  };
  const transforms = {
    selected_pnrs: selectedPnrs,
    channel: edvinChannel,
    category: edvinCategory
  };
  const actions = { edvin__errand_configuration: { channels: [edvinChannel] }, get_edvin_prop_long_value: { value: 2 } };
  const views = { findorder: selectedPnrs };

  run("80", vars, transforms, actions, views);
  console.log("80 | combined_pnr        :", JSON.stringify(transforms.combined_pnr));
  console.log("80 | current_pnr.pnr     :", JSON.stringify(transforms.current_pnr.pnr), "count", transforms.current_pnr.pnr_count);
  console.log("80 | cleared partner?    :", JSON.stringify(vars.partner));

  // node 80 clears the VI answers, so the agent's picks arrive AFTER it (the real flow
  // collects them on nodes 48-76, which come after node 80).
  vars.partner = "ETG";
  vars.disruption_type = "Schedule change within 24 hour window";
  vars.flight_affected = "Directly affected flight";
  vars.stg_alternatives_sameday_sc = "Alternative for the directly affected flight";

  run("2", vars, transforms, actions, views);
  const rec = transforms.customer_action_pnrs[0];
  console.log("2  | rows                :", transforms.customer_action_pnrs.length);
  console.log("2  | buckets mapped      :", JSON.stringify(transforms.actions_array.map(a => a.bucket)));
  console.log("2  | bucketIds           :", JSON.stringify(transforms.actions_array.map(a => a.bucketId)));
  console.log("2  | type / category     :", rec.type, "/", rec.category);
  console.log("2  | vi_details_text     :", JSON.stringify(transforms.vi_details_text));
  console.log("2  | notes on record     :", JSON.stringify(rec.notes));

  run("12", vars, transforms, actions, views);
  const html = transforms.customer_action_table_html;
  const names = [...html.matchAll(/<select\s+name="([^"]+)"/g)].map(m => m[1]);
  const opts = [...html.matchAll(/<option value="([^"]*)"/g)].map(m => m[1]);
  console.log("12 | select field name   :", JSON.stringify(names));
  console.log("12 | option values       :", JSON.stringify(opts));

  // agent picks on node 25 -> the select posts into that field name
  vars[names[0]] = pickLabel;

  run("27", vars, transforms, actions, views);
  const stitched = transforms.customer_action_pnrs[0];
  console.log("27 | customer_action     :", JSON.stringify(stitched.customer_action));
  console.log("27 | bucket / bucketId   :", JSON.stringify(stitched.bucket), "/", JSON.stringify(stitched.bucketId));
  console.log("27 | child_tickets       :", transforms.child_tickets.map(ct => ct.child_ticket.title + " [" + ct.child_ticket.bucket + "]"));
  console.log("27 | grandchildren       :", transforms.child_tickets.map(ct => (ct.child_ticket.grandchild_tickets || []).length));
  console.log("27 | final_pnrs (node 27):", transforms.final_pnrs.length);
  console.log("27 | unresolved          :", vars.unresolved_selections_count, JSON.stringify(transforms.unresolved_selections));

  run("81", vars, transforms, actions, views);
  console.log("81 | final_pnrs          :", transforms.final_pnrs.length, "-> pnr", JSON.stringify(transforms.final_pnrs[0].pnr));
  console.log("81 | current_pnr         :", JSON.stringify({
    pnr: transforms.current_pnr.pnr,
    type: transforms.current_pnr.type,
    customer_action: transforms.current_pnr.customer_action,
    bucket: transforms.current_pnr.bucket,
    bucketId: transforms.current_pnr.bucketId
  }));
  console.log("81 | form scalars        :", JSON.stringify({
    combined_pnr: vars.combined_pnr,
    customer_action: vars.customer_action,
    customer_action_id: vars.customer_action_id,
    bucket: vars.bucket,
    bucket_id: vars.bucket_id,
    errand_type: vars.errand_type,
    type_untouched: vars.type
  }));
  console.log("81 | final notes         :", JSON.stringify(transforms.final_pnrs[0].notes));
  return { vars, transforms };
}

const TWO_PNRS = [
  { pnr: "9D89VM", postSaleHandleType: "GDS", providerSystem: "AMADEUS", id: "2540249316685", passengerFirstName: "Tayna", passengerLastName: "Santiago" },
  { pnr: "AUU84K", postSaleHandleType: "Linked", providerSystem: "Linked", id: "2540249316690", passengerFirstName: "Ana", passengerLastName: "Reis" }
];

scenario("A. proceed action, 2 combined PNRs", "Rebooking - alternative offered & accepted", TWO_PNRS);
scenario("B. no_action action (label 'No action')", "Customer declined / no action", TWO_PNRS);
scenario("C. different_request action", "Ancillaries & Services / Products", TWO_PNRS);
scenario("D. blank bucket from Edvin", "Bucket arrives blank", TWO_PNRS);
scenario("E. nothing selected", "", TWO_PNRS);
scenario("F. single PNR", "Rebooking - alternative offered & accepted", [TWO_PNRS[0]]);
