import fs from "fs";
const [, , f188, f200] = process.argv;
const src188 = fs.readFileSync(f188, "utf8"), src200 = fs.readFileSync(f200, "utf8");
function run(src, form, actions) {
  const out = { form: { ...form }, transforms: {} };
  const ZT = {
    getVariableValue: (k, d) => (k in out.form ? out.form[k] : d),
    setFormData: (k, v) => { out.form[k] = v; },
    setTransformData: (k, v) => { out.transforms[k] = v; },
  };
  new Function("ZT", "actions", "Date", src)(ZT, actions, undefined);
  return out;
}
const ok = rows => ({ _zt_meta: { response: { code: 200 } }, insurance_list: rows });
let pass = 0, fail = 0;
function check(name, cond, detail) { if (cond) pass++; else { fail++; console.log("FAIL", name, detail ?? ""); } }
function build(rows, clinic = "UT901", resp) {
  try { return run(src188, { clinic_raintree_code: clinic }, { alias_35: resp ?? ok(rows) }); }
  catch (e) { return { error: e.message }; }
}
function pick(b, sel, using = "Yes", typed) {
  const form = { ...b.form, is_using_insurance: using, insurance_selection: sel };
  if (typed) form.patient_insurance_other = typed;
  return run(src200, form, {}).form;
}
const cat = b => JSON.parse(b.form.insurance_catalog);
const opts = b => b.transforms.insurance_selection_list;

// 1. status variants an Ivy editor might type
const variants = {
  "Accepted": "accepted", "accepted": "accepted", "ACCEPTED": "accepted", " Accepted ": "accepted",
  "Not Accepted - Medicaid": "not_accepted_medicaid", "not accepted - medicaid": "not_accepted_medicaid",
  "Not Accepted – Medicaid": "not_accepted_medicaid", "Not Accepted -Medicaid": "not_accepted_medicaid", "Not Accepted-Medicaid": "not_accepted_medicaid",
  "Not Accepted - All Other": "not_accepted_other", "Not Accepted – All Other": "not_accepted_other", "Not Accepted": "not_accepted_other", "Not Accepted - Insurance": "not_accepted_other", "not accepted-insurance": "not_accepted_other",
  "Managed": "managed", "managed": "managed",
};
for (const [s, want] of Object.entries(variants)) {
  const b = build([`Plan X; 10001; ${s};`]);
  if (b.error) { check(`status "${s}"`, false, b.error); continue; }
  const e = cat(b).find(x => x.label === "Plan X");
  check(`status "${s}" -> ${want}`, e && e.status === want, JSON.stringify(e));
}
// 2. cell shapes
const shapes = [
  ["trailing ; missing", "Aetna; 10001; Accepted", { label: "Aetna", code: "10001" }],
  ["extra spaces", "  Aetna  ;  10001  ;  Accepted  ;  ", { label: "Aetna", code: "10001" }],
  ["empty code", "Aetna; ; Accepted;", { label: "Aetna", code: "" }],
  ["empty code no space", "Aetna;;Accepted;", { label: "Aetna", code: "" }],
  ["name with slash/hyphen", "UHC/United Healthcare/Community Plan/Medicaid; ; Not Accepted - Medicaid;", { label: "UHC/United Healthcare/Community Plan/Medicaid", code: "" }],
];
for (const [n, cell, want] of shapes) {
  const b = build([cell]); if (b.error) { check(n, false, b.error); continue; }
  const e = cat(b).find(x => x.label === want.label);
  check(`shape: ${n}`, e && e.code === want.code, JSON.stringify(e));
}
for (const [n, cell] of [["old name-only", "Aetna - Commercial"], ["unknown status", "Aetna; 10001; Pending;"], ["blank name", " ; 10001; Accepted;"], ["empty string", ""]]) {
  const b = build([cell]); if (b.error) { check(n, false, b.error); continue; }
  check(`skip: ${n}`, cat(b).length === 14 && b.form.is_display_insurance_dropdown === "false", `catalog ${cat(b).length}`);
}
// 3. duplicate codes across plans (several Aetna plans share one Raintree code)
{
  const b = build(["Aetna - Commercial; 10001; Accepted;", "Aetna - Meritain Health; 10001; Accepted;"]);
  const values = opts(b).map(o => o.value);
  check("duplicate codes -> unique dropdown values", new Set(values).size === values.length, JSON.stringify(values));
  const meritain = opts(b).find(o => o.name === "Aetna - Meritain Health");
  const r = pick(b, meritain.value);
  check("duplicate codes -> picked name kept", r.patient_insurance_other === "Aetna - Meritain Health", r.patient_insurance_other);
  check("duplicate codes -> code sent", r.patient_insurance_rt_code === "10001", r.patient_insurance_rt_code);
}
// 4. duplicate blank-code names
{
  const b = build(["Aetna; ; Accepted;", "Aetna; ; Accepted;"]);
  check("duplicate blank rows don't crash", !b.error);
}
// 5. Other (10005) from SharePoint keeps the typed-name field trigger
{
  const b = build(["Other; 10005; Accepted;", "Aetna; 10001; Accepted;"]);
  const other = opts(b).find(o => o.name === "Other");
  check("Other value is \"Other\" (199 field condition)", other && other.value === "Other", JSON.stringify(other));
  const r = pick(b, "Other", "Yes", "Oscar");
  check("Other typed name kept", r.patient_insurance_other === "Oscar" && r.patient_insurance_rt_code === "10005", JSON.stringify(r));
}
// 6. response shapes
for (const [n, resp, clinic, wantDisplay] of [
  ["500", { _zt_meta: { response: { code: 500, body: "x" } } }, "UT901", "false"],
  ["404", { _zt_meta: { response: { code: 404, body: "x" } } }, "NY181", "true"],
  ["200 no insurance_list", { _zt_meta: { response: { code: 200 } } }, "UT901", "false"],
  ["200 empty list", ok([]), "NY181", "true"],
  ["code 0 (not called)", { _zt_meta: { response: { code: 0 } } }, "ZZZ", "true"],
]) {
  const b = build(null, clinic, resp);
  check(`response ${n} no crash`, !b.error, b.error);
  if (!b.error) {
    check(`response ${n} display=${wantDisplay}`, b.form.is_display_insurance_dropdown === wantDisplay, b.form.is_display_insurance_dropdown);
    check(`response ${n} falls back to static`, cat(b).some(x => x.code === "10012" && x.value === "UHC"));
  }
}
// 7. every route from SharePoint data
{
  const rows = ["A; 1; Accepted;", "B; ; Accepted;", "C; ; Not Accepted - Medicaid;", "D; ; Not Accepted - All Other;", "E; ; Managed;"];
  const b = build(rows);
  const v = name => opts(b).find(o => o.name === name).value;
  const cases = [["A", "accepted", "1"], ["B", "accepted", ""], ["C", "not_accepted_medicaid", ""], ["D", "not_accepted_other", ""], ["E", "managed", ""]];
  for (const [name, route, code] of cases) {
    const r = pick(b, v(name));
    check(`route ${name}`, r.insurance_route === route && r.patient_insurance_rt_code === code, JSON.stringify([r.insurance_route, r.patient_insurance_rt_code]));
  }
  const r = pick(b, "", "No");
  check("route No -> self_pay, nothing written", r.insurance_route === "self_pay" && r.patient_insurance_rt_code === "");
  check("secondary list only coded accepted", JSON.stringify(b.transforms.insurance_list) === JSON.stringify([{ name: "A", value: "1" }]), JSON.stringify(b.transforms.insurance_list));
  check("SP clinic: no hardcoded catch-alls added", !opts(b).some(o => o.value === "medicaid_not_listed" || o.value === "other_not_listed"));
}
// 8. clinic code gate
for (const [c, want] of [["ny181", "true"], [" NY181 ", "true"], ["zzz", "true"], ["UT901", "false"], ["", "false"]]) {
  const b = build(["Aetna - Commercial"], c);
  check(`gate "${c}" (old-format SP) = ${want}`, b.form.is_display_insurance_dropdown === want, b.form.is_display_insurance_dropdown);
}
// 9. mixed old + new rows in one clinic
{
  const b = build(["Aetna - Commercial", "Wellcare; ; Not Accepted - All Other;"]);
  check("mixed rows: new rows used, old skipped", cat(b).length === 1, cat(b).length);
}
// 10. real 48-row payload shape converted
{
  const names = JSON.parse(fs.readFileSync(process.argv[4], "utf8"));
  const rows = names.map((n, i) => `${n}; ${i % 3 ? "1000" + (i % 9 + 1) : ""}; ${["Accepted", "Not Accepted - All Other", "Managed", "Not Accepted - Medicaid"][i % 4]};`);
  const b = build(rows);
  check("real payload: all rows parsed", cat(b).length === names.length, cat(b).length);
  const values = opts(b).map(o => o.value);
  check("real payload: unique values", new Set(values).size === values.length, `${values.length - new Set(values).size} dupes`);
}
// 11. real SharePoint response, cost code UT84737 (Kelsie's test, 10/21)
{
  const real = JSON.parse(fs.readFileSync(process.argv[5], "utf8"));
  const b = build(null, "UT84737", real);
  const c = cat(b);
  const by = s => c.filter(x => x.status === s).map(x => x.label);
  check("real: dropdown shown", b.form.is_display_insurance_dropdown === "true");
  check("real: 7 accepted", by("accepted").length === 7, JSON.stringify(by("accepted")));
  check("real: Medicaid only (no hardcoded catch-all)", by("not_accepted_medicaid").join("|") === "Medicaid", JSON.stringify(by("not_accepted_medicaid")));
  check("real: 6 Not Accepted - Insurance", by("not_accepted_other").length === 6, JSON.stringify(by("not_accepted_other")));
  check("real: old-format rows skipped", !c.some(x => /\(INN\)|NOT ACC/.test(x.label)));
  const r = pick(b, "Humana Gold");
  check("real: Humana Gold -> self-pay screen", r.insurance_route === "not_accepted_other" && r.patient_insurance_rt_code === "");
  const a = pick(b, "Cigna (Priority Health or HAP)");
  check("real: Cigna accepted, no code, name kept", a.insurance_route === "accepted" && a.patient_insurance_rt_code === "" && a.patient_insurance_other === "Cigna (Priority Health or HAP)");
  check("real: secondary list empty (no codes)", b.transforms.insurance_list.length === 0);
}
console.log(`\n${pass} passed, ${fail} failed`);
