// Offline replay of the FULL v7 VI path: 83 -> 48(form) -> 82 -> 49 -> STG answers
// -> 80(Data, mocked) -> 81 -> 1(form) -> 2 -> 12 -> 25(agent picks) -> 27 -> 84 -> 79.
import fs from "fs";

const tree = JSON.parse(fs.readFileSync("/tmp/zt/Register Errands - VI Dynamic (v7 dropdowns + combined-PNR hand-off 2026-08-21).json","utf8"));
const src = id => tree.nodes[id].content;

const BUCKETS = {
  proceed: { id: 4, name: "Proceed" },
  no_action: { id: 3, name: "No action" },
  different_request: { id: 5, name: "Different request" }
};
const CATEGORY = {
  id: 11, name: "Self Transfer Guarantee (VI) - SC",
  types: [{ id: 501, name: "Against Self Transfer Guarantee", actions: [
    { id: 9001, name: "Rebooking - alternative offered & accepted", bucket: BUCKETS.proceed, edvin_actions: { a: 1 } },
    { id: 9002, name: "Refund of the directly affected flight", bucket: BUCKETS.proceed },
    { id: 9003, name: "Customer declined / no action", bucket: BUCKETS.no_action },
    { id: 9004, name: "Ancillaries & Services / Products", bucket: BUCKETS.different_request },
    { id: 9005, name: "Bucket arrives blank", bucket: null }
  ]}]
};
const CHANNEL = { id: 2, name: "Phone", categories: [CATEGORY] };

function ctx(vars, transforms, actions, views) {
  const logs = [];
  const ZT = {
    getVariableValue: (k,d) => (vars[k] === undefined || vars[k] === null || vars[k] === "" ? d : vars[k]),
    setFormData: (k,v) => { vars[k] = v; },
    setTransformData: (k,v) => { transforms[k] = v; },
    setResponseData: () => {},
    log: m => logs.push(m)
  };
  return { ZT, logs };
}
function run(id, vars, transforms, actions, views) {
  const { ZT, logs } = ctx(vars, transforms, actions, views);
  new Function("ZT","transforms","actions","views",'"use strict";'+src(id))(ZT, transforms, actions, views);
  return logs;
}
function optionsOf(nid, field) {
  const ff = Object.values(tree.nodes[nid].formfields).find(f => f.name === field);
  return ff.options.split("\n");
}
let fails = 0;
function check(label, cond, detail) { if (!cond) { fails++; console.log("  FAIL " + label + " " + (detail||"")); } else console.log("  ok   " + label + (detail?" "+detail:"")); }

function walkLadder(vars, transforms) {
  // node 49 routes on `route`; each screen's logic node is followed until we reach 80
  const at = { node: "49" };
  const link = (nid) => {
    const nd = tree.nodes[nid];
    if (nd.type === "Scoring") {
      for (const b of Object.values(nd.buttons)) {
        if (b.op === "eq") { if (String(vars[b.button_text]) === String(b.button_data)) return b.button_link; continue; }
        if (b.op === "def" || !b.logic_expression) return b.button_link || nd.continuation_node_id;
        // evaluate the expression against form vars
        const expr = b.logic_expression.replace(/([a-zA-Z_][a-zA-Z0-9_]*)\s*==/g, (m,v)=>JSON.stringify(String(vars[v]??""))+" ==");
        if (eval(expr)) return b.button_link;
      }
      return nd.continuation_node_id;
    }
    // content node: single Continue button
    const b = Object.values(nd.buttons)[0];
    return b ? b.button_link : nd.continuation_node_id;
  };
  const path = [];
  let cur = "49", guard = 0;
  while (cur !== "80" && cur !== "0" && guard++ < 30) { path.push(cur); cur = link(cur); }
  path.push(cur);
  return path;
}

function scenario(name, { partner, orderCreated, apiOrderCreated, disruption, flight, pick, pnrs, answers = {} }) {
  console.log("\n================ " + name);
  const vars = { type: "501", notes: "Pax at the airport, rebooked on the 18:40.", zd_ticket_id: "334999",
                 custom_field_29559177650834: "contact_reason_sc__self_transfer_guarantee_vi_sc" };
  const transforms = { selected_pnrs: pnrs };
  const actions = { findorder: { orderCreated: apiOrderCreated, orderReference: "ORD-1" },
                    edvin__errand_configuration: { channels: [CHANNEL] },
                    get_edvin_prop_long_value: { value: 2 } };
  const views = { findorder: pnrs };

  run("83", vars, transforms, actions, views);
  check("83 combined pnr", transforms.combined_pnr === pnrs.map(p=>p.pnr).join(", "), JSON.stringify(transforms.combined_pnr));
  check("83 clears VI answers", vars.partner === "" && vars.route === "", "");
  check("83 isMorePNR false", transforms.isMorePNR === false, "");

  // node 48 form
  vars.partner = partner; vars.orderCreated = orderCreated;
  const r82 = run("82", vars, transforms, actions, views);
  console.log("  82 log: " + r82.join(" / "));

  // STG answers, then walk the real logic nodes from 49 to 80
  vars.disruption_type = disruption; vars.flight_affected = flight;
  Object.assign(vars, answers);
  const path = walkLadder(vars, transforms);
  check("49->80 path ends at 80", path[path.length-1] === "80", path.join(" -> "));

  run("81", vars, transforms, actions, views);
  check("81 category resolved", !!transforms.category, transforms.category && transforms.category.name);
  check("81 actions_by_type[501] buckets", JSON.stringify((transforms.actions_by_type["501"]||[]).map(a=>a.bucket)) ===
        JSON.stringify(["proceed","proceed","no_action","different_request",""]),
        JSON.stringify((transforms.actions_by_type["501"]||[]).map(a=>a.bucket)));

  run("2", vars, transforms, actions, views);
  const rec = transforms.customer_action_pnrs[0];
  check("2 one row", transforms.customer_action_pnrs.length === 1, "");
  check("2 buckets are routing keys", JSON.stringify(transforms.actions_array.map(a=>a.bucket)) ===
        JSON.stringify(["proceed","proceed","no_action","different_request",""]),
        JSON.stringify(transforms.actions_array.map(a=>a.bucket)));
  check("2 vi_details captured", (transforms.vi_details_text||"").includes("Partner: "+partner), JSON.stringify(transforms.vi_details_text));
  check("2 notes carry VI details", (rec.notes||"").includes("VI / STG details"), "");

  run("12", vars, transforms, actions, views);
  const html = transforms.customer_action_table_html;
  const field = [...html.matchAll(/<select\s+name="([^"]+)"/g)].map(m=>m[1])[0];
  check("12 field name matches combined pnr", field === "customer_action_" + pnrs.map(p=>p.pnr).join(", ").replace(/[^a-zA-Z0-9_-]/g,"_") + "_0", field);
  vars[field] = pick;

  run("27", vars, transforms, actions, views);
  const st = transforms.customer_action_pnrs[0];
  console.log("  27 bucket=" + JSON.stringify(st.bucket) + " bucketId=" + JSON.stringify(st.bucketId) +
              " tickets=" + JSON.stringify(transforms.child_tickets.map(ct=>ct.child_ticket.title+" ["+ct.child_ticket.bucket+"]")) +
              " unresolved=" + vars.unresolved_selections_count);

  run("84", vars, transforms, actions, views);
  check("84 final_pnrs length 1", transforms.final_pnrs.length === 1, "");
  check("84 final_pnrs pnr == combined", transforms.final_pnrs[0].pnr === transforms.combined_pnr, JSON.stringify(transforms.final_pnrs[0].pnr));
  check("84 current_pnr === final record", transforms.current_pnr.pnr === transforms.final_pnrs[0].pnr, "");
  check("84 bucket scalar published", vars.bucket === st.bucket, JSON.stringify(vars.bucket)+" / bucket_id "+JSON.stringify(vars.bucket_id));
  check("84 type var untouched", vars.type === "501", "");
  check("84 providerBookingIds flat", transforms.final_pnrs[0].providerBookingIds === JSON.stringify(pnrs.map(p=>p.id)), transforms.final_pnrs[0].providerBookingIds);
  console.log("  84 stg_outcome=" + JSON.stringify(vars.stg_outcome) + " errand_type=" + JSON.stringify(vars.errand_type));
  return { vars, transforms };
}

const TWO = [
  { pnr:"9D89VM", postSaleHandleType:"GDS", providerSystem:"AMADEUS", id:"2540249316685", passengerFirstName:"Tayna", passengerLastName:"Santiago" },
  { pnr:"AUU84K", postSaleHandleType:"Linked", providerSystem:"Linked", id:"2540249316690", passengerFirstName:"Ana", passengerLastName:"Reis" }
];
const SC = "Schedule change within 24 hour window";

scenario("A. ETG, order after cutoff, SC direct, offer accepted, proceed", {
  partner:"ETG", orderCreated:"", apiOrderCreated:"2026-07-02T09:14:00Z", disruption:SC, flight:"Directly affected flight",
  answers:{ stg_alternatives_sameday_sc:"Alternative for the directly affected flight" },
  pick:"Rebooking - alternative offered & accepted", pnrs:TWO });

scenario("B. Booking partner -> node 50 branch, no_action", {
  partner:"Booking", orderCreated:"", apiOrderCreated:"2026-07-02T09:14:00Z", disruption:SC, flight:"Directly affected flight",
  answers:{ stg_alternatives_sameday_sc:"Alternative for the directly affected flight" },
  pick:"Customer declined / no action", pnrs:TWO });

scenario("C. ETG, order BEFORE cutoff (API date) -> node 50 branch", {
  partner:"ETG", orderCreated:"", apiOrderCreated:"2026-04-30T23:50:00Z", disruption:SC, flight:"Directly affected flight",
  answers:{ stg_alternatives_sameday_sc:"Alternative for the directly affected flight" },
  pick:"Ancillaries & Services / Products", pnrs:TWO });

scenario("D. agent-entered orderCreated overrides the API value", {
  partner:"ETG", orderCreated:"2026-01-15", apiOrderCreated:"2026-07-02T09:14:00Z", disruption:SC, flight:"Directly affected flight",
  answers:{ stg_alternatives_sameday_sc:"Alternative for the directly affected flight" },
  pick:"Rebooking - alternative offered & accepted", pnrs:TWO });

scenario("E. trip delay ladder, all offers declined -> refund screen", {
  partner:"ETG", orderCreated:"", apiOrderCreated:"2026-07-02T09:14:00Z", disruption:"Trip delay", flight:"",
  answers:{ stg_alternatives_sameday_td:"None of the above is available",
            stg_alternatives_overnight_td:"None of the above is available",
            stg_refund:"Last resort" },
  pick:"Refund of the directly affected flight", pnrs:TWO });

scenario("F. nothing selected on the action table", {
  partner:"ETG", orderCreated:"", apiOrderCreated:"2026-07-02T09:14:00Z", disruption:SC, flight:"Directly affected flight",
  answers:{ stg_alternatives_sameday_sc:"Alternative for the directly affected flight" },
  pick:"", pnrs:TWO });

scenario("G. single PNR", {
  partner:"ETG", orderCreated:"", apiOrderCreated:"2026-07-02T09:14:00Z", disruption:SC, flight:"Directly affected flight",
  answers:{ stg_alternatives_sameday_sc:"Alternative for the directly affected flight" },
  pick:"Rebooking - alternative offered & accepted", pnrs:[TWO[0]] });

// placeholder must not match any branch: an untouched partner dropdown
console.log("\n================ H. untouched dropdowns (placeholder posted)");
{
  const ph = optionsOf("48","partner")[0];
  console.log("  node 48 partner options:", JSON.stringify(optionsOf("48","partner")));
  check("placeholder is first option", ph === "- Select -", ph);
  const vars = { partner: ph, orderCreated: "" };
  const transforms = {};
  const actions = { findorder: {} };
  run("82", vars, transforms, actions, {});
  check("no partner + no date -> route 66 (ETG rules), never a silent 'Booking'", vars.route === "66", "route="+vars.route);
}

console.log("\n" + (fails ? fails + " CHECK(S) FAILED" : "ALL CHECKS PASSED"));
