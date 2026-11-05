// Offline decision-table test for the Cancel Card Dashboard tree: runs the real node 3 and node 10 scripts.
// node route_cases.mjs "<tree.json>"
import fs from "node:fs"; import vm from "node:vm";
const tree = JSON.parse(fs.readFileSync(process.argv[2], "utf8"));
const run = (id, s) => vm.runInNewContext(tree.nodes[id].content, { ...s.form, actions: s.actions, ZT: {
  getVariableValue: (n, d) => (s.form[n] === undefined || s.form[n] === null || s.form[n] === "") ? d : s.form[n],
  setFormData: (k, v) => { s.form[k] = v; }, setTransformData: (k, v) => { s.transforms[k] = v; } } });
const get = (p) => ({ _zt_meta: { response: { code: 200 } }, client_name: "iPay Test", card_status: "Created", card_status_date: "2026-10-01",
  payment_amount: 100, service_fee: 3, funding_amount: 103, manual_value_load_amount: 0, ...p });
const cases = [
  ["approve: Refund, no RPPS, fee+reason match", {}, { requested_action: "Refund", dashboard_fee: 3, has_comdata: "No", avail_to_spend: 103, rpps_available: "No" }, "approve"],
  ["resubmit RPPS: Refund but RPPS available", {}, { requested_action: "Refund", dashboard_fee: 3, has_comdata: "No", avail_to_spend: 103, rpps_available: "Yes" }, "resubmit Reissue RPPS fee 3.00"],
  ["resubmit Refund: RPPS requested, not available", {}, { requested_action: "Reissue RPPS", dashboard_fee: 3, has_comdata: "No", avail_to_spend: 103, rpps_available: "No" }, "resubmit Refund fee 3.00"],
  ["resubmit as requested: fee mismatch", {}, { requested_action: "Refund", dashboard_fee: 5, has_comdata: "No", avail_to_spend: 103, rpps_available: "No" }, "resubmit Refund fee 3.00"],
  ["resubmit as requested: reason changed", {}, { requested_action: "Refund", dashboard_fee: 3, has_comdata: "No", avail_to_spend: 103, rpps_available: "No", resubmit_reason: "Unable to reach vendor" }, "resubmit Refund fee 3.00"],
  ["settled credit most recent, funds = payment, RPPS req -> Refund", {}, { requested_action: "Reissue RPPS", dashboard_fee: 3, has_settled_credit: "Yes", settled_credit_is_most_recent: "Yes", has_comdata: "No", avail_to_spend: 100 }, "resubmit Refund fee 3.00"],
  ["MVL approve: dashboard fee = SF + MVL", { manual_value_load_amount: 2 }, { requested_action: "Refund", dashboard_fee: 5, has_comdata: "No", avail_to_spend: 105, rpps_available: "No" }, "approve"],
  ["MVL fee mismatch (MVL only) -> resubmit SF+MVL", { manual_value_load_amount: 2 }, { requested_action: "Refund", dashboard_fee: 2, has_comdata: "No", avail_to_spend: 105, rpps_available: "No" }, "resubmit Refund fee 5.00"],
  ["funds = funding + MVL is full funds", { manual_value_load_amount: 2 }, { requested_action: "Reissue RPPS", dashboard_fee: 5, has_comdata: "No", avail_to_spend: 105, rpps_available: "No" }, "resubmit Refund fee 5.00"],
  ["fee only: funds = MVL -> fee = funds", { manual_value_load_amount: 2 }, { requested_action: "Refund", dashboard_fee: 5, has_comdata: "No", avail_to_spend: 2 }, "resubmit Fee Cancellation fee 2.00"],
  ["fee only: funds = service fee", {}, { requested_action: "Refund", dashboard_fee: 3, has_comdata: "No", avail_to_spend: 3 }, "resubmit Fee Cancellation fee 3.00"],
  ["fee only: funds - SF = MVL -> SF+MVL", { manual_value_load_amount: 2 }, { requested_action: "Refund", dashboard_fee: 3, has_comdata: "No", avail_to_spend: 5 }, "resubmit Fee Cancellation fee 5.00"],
  ["partial refund via Comdata calc", {}, { requested_action: "Refund", dashboard_fee: 3, has_comdata: "Yes", pending_auth_total: 10, posted_total: 50, credits_total: 0, has_payment_activity: "Yes", correct_vendor: "Yes" }, "resubmit Partial Refund fee 3.00"],
  ["zero funds -> deny", {}, { requested_action: "Refund", dashboard_fee: 3, has_comdata: "No", avail_to_spend: 0 }, "deny"],
  ["negative funds -> escalate", {}, { requested_action: "Refund", has_comdata: "Yes", pending_auth_total: 0, posted_total: 110, credits_total: 0, has_payment_activity: "Yes", correct_vendor: "Yes" }, "escalate"],
  ["decline auth -> hold", {}, { requested_action: "Refund", has_comdata: "No", avail_to_spend: 103, decline_auth: "Yes" }, "hold"],
  ["wrong vendor -> escalate", {}, { requested_action: "Refund", has_comdata: "No", avail_to_spend: 50, has_payment_activity: "Yes", correct_vendor: "No" }, "escalate"],
];
let fails = 0;
for (const [name, getp, ans, want] of cases) {
  const s = { form: { payment_id: "1", requested_cancel_reason: "Vendor does not accept card payments", has_settled_credit: "No", has_payment_activity: "No", decline_auth: "No" }, transforms: {}, actions: { bizpay__get_payment_by_id: get(getp) } };
  run("3", s);
  const asked = [];
  const answers = { correct_vendor: ans.correct_vendor, rpps_available: ans.rpps_available };
  Object.assign(s.form, Object.fromEntries(Object.entries(ans).filter(([k]) => !["correct_vendor", "rpps_available", "resubmit_reason"].includes(k))));
  for (let i = 0; i < 6; i++) {
    run("10", s);
    if (s.form.route === "check_vendor") { asked.push("vendor"); s.form.correct_vendor = answers.correct_vendor; continue; }
    if (s.form.route === "rpps_check") { asked.push("rpps"); s.form.rpps_available = answers.rpps_available; continue; }
    if (s.form.route === "confirm_reason") { asked.push("reason:" + s.form.reason_lane); if (ans.resubmit_reason) s.form.resubmit_reason = ans.resubmit_reason; s.form.reason_confirmed = "Yes"; continue; }
    break;
  }
  const html = s.transforms.outcome_html || "";
  const fee = (html.match(/Fee: <strong>\$([\d.]+)/) || [])[1];
  const action = (html.match(/Action: <strong>([^<]+)/) || [])[1];
  const got = s.form.decision === "resubmit" ? `resubmit ${action} fee ${fee}` : s.form.decision;
  const ok = got === want; if (!ok) fails++;
  console.log(`${ok ? "PASS" : "FAIL"}  ${name}  -> ${got}  [asked: ${asked.join(", ") || "-"}; funds ${s.form.funds_remaining}]`);
}
console.log(fails ? `${fails} failed` : "all passed"); process.exit(fails ? 1 : 0);
