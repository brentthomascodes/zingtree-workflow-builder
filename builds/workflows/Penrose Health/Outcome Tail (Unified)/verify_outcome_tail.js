// Functional verification of Penrose Outcome Tail (Unified) v2 (6-node shape)
// Executes the REAL unified script (node 1) and swap script (node 5) for every
// catalog key, all variants, legacy fallback per tree, unknown key, empty session.
const fs = require("fs");
const tree = JSON.parse(fs.readFileSync("Penrose Outcome Tail (Unified).json"));
const nodes = tree.nodes;

function makeSession(seed) {
  const form = Object.assign({}, seed), transforms = {};
  const ZT = {
    getVariableValue: (k, d) => (k in form ? form[k] : d),
    setFormData: (k, v) => { form[k] = v; },
    setTransformData: (k, v) => { transforms[k] = v; },
    log: () => {},
  };
  return { form, transforms, ZT };
}
const run = (nid, s) => new Function("ZT", "transforms", nodes[nid].content)(s.ZT, s.transforms);

const OUT = JSON.parse(nodes["1"].content.match(/var OUTCOMES = ([\s\S]*?);\n\n\/\/ -+ DATA: per-tree safety netting/)[1]);
let keys = 0, variants = 0, fails = 0;
const err = (...a) => { console.error(...a); fails++; };

for (const [key, e] of Object.entries(OUT)) {
  keys++;
  const s = makeSession({ outcome_key: key });
  run("1", s);
  if (s.form.outcome_found !== true) { err("NOT FOUND", key); continue; }
  if (s.form.suggested_outcome !== e.code) err("CODE MISMATCH", key);
  if (!s.transforms.outcome_screen_html.includes(e.html)) err("HTML MISSING", key);
  if (!s.transforms.source_netting_html) err("NO NETTING", key);
  if (e.variant) {
    variants++;
    if (!s.transforms.outcome_screen_html.includes("Pharmacy First referral")) err("NO ESCAPE GUIDANCE", key);
    const alt = OUT[e.alt];
    if (s.form.alt_code !== alt.code) err("ALT NOT STAGED", key);
    run("5", s);                                   // swap
    if (s.form.suggested_outcome !== alt.code) err("SWAP CODE FAIL", key);
    if (s.transforms.outcome_screen_html !== alt.html) err("SWAP HTML FAIL", key);
    run("5", s);                                   // second click = safe no-op notice
    if (!s.transforms.outcome_screen_html.includes("No alternate outcome defined")) err("SWAP NOOP FAIL", key);
  } else {
    if (s.form.alt_code !== "") err("UNEXPECTED ALT", key);
    run("5", s);                                   // escape misuse on standard outcome
    if (!s.transforms.outcome_screen_html.includes("No alternate outcome defined")) err("NOOP NOTICE FAIL", key);
  }
}
// legacy fallback per tree
const LEGACY = { womens_health: "Women's Health triage", paeds: "Paediatric Cough",
                 pharmacy_first: "Pharmacy First", rash: "Rash", nhs_check: "NHS Health Check",
                 contraception: "Contraception" };
const C2K = JSON.parse(nodes["1"].content.match(/var CODE_TO_KEY = ([\s\S]*?);\n\n\/\/ -+ LOGIC/)[1]);
for (const [src, name] of Object.entries(LEGACY)) {
  const code = Object.keys(C2K[src])[0];
  const s = makeSession({ source_tree: name, suggested_outcome: code });
  run("1", s);
  if (s.form.outcome_found !== true || s.form.outcome_key !== C2K[src][code]) err("LEGACY FAIL", src);
}
// unknown key and empty session -> not-recognized notice, everything defaults safe
for (const seed of [{ outcome_key: "wh_does_not_exist" }, {}]) {
  const s = makeSession(seed);
  run("1", s);
  if (s.form.outcome_found !== false) err("UNKNOWN SHOULD NOT RESOLVE", seed);
  if (!s.transforms.outcome_screen_html.includes("Outcome not recognized")) err("NO NOTICE", seed);
}
// known prefix + unknown key keeps the source tree's netting; empty session has none
{
  const s = makeSession({ outcome_key: "wh_does_not_exist" });
  run("1", s);
  if (!s.transforms.source_netting_html) err("KNOWN-PREFIX NETTING MISSING");
  const s2 = makeSession({});
  run("1", s2);
  if (s2.transforms.source_netting_html !== "") err("EMPTY-SESSION NETTING SHOULD BE EMPTY");
}
// structural: node 2 fields + buttons; titles on every node; script is ASCII
const n2 = nodes["2"];
if (n2.formfields.map(f => f.name).join() !== "outcome,other_outcome") err("N2 FIELDS");
if (n2.formfields[0].required !== "1") err("OUTCOME NOT REQUIRED");
if (n2.buttons.map(b => b.button_link).join() !== "3,4,5") err("N2 BUTTONS");
for (const [k, n] of Object.entries(nodes))
  if (!n.node_name || !n.page_title) err("MISSING TITLE", k);
for (const nid of ["1", "5"])
  if (!/^[\x00-\x7F]*$/.test(nodes[nid].content)) err("NON-ASCII IN SCRIPT", nid);
if (tree.merge_vars_not_fixed !== "1") err("merge_vars_not_fixed");
if (Array.isArray(tree.projects)) err("MUST BE SINGLE WORKFLOW DICT");

console.log(`keys: ${keys} | variant swaps: ${variants} | failures: ${fails}`);
if (fails) process.exit(1);
console.log("ALL CHECKS PASSED (v2)");
