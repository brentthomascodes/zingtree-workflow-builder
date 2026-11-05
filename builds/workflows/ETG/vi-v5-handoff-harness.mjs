import fs from 'fs';
const vi  = JSON.parse(fs.readFileSync('vi_dynamic_v5.json','utf8')).nodes;
const dyn = JSON.parse(fs.readFileSync('/mnt/user-data/uploads/Claude Cowork - Zingtree/Zingtree Builder/Workflow JSONs/ETG/Register Errands - Dynamic (companion edit).json','utf8')).nodes;
const NONE = "None of the above is available";

function env(seed={}) {
  const form = Object.assign({}, seed.form);
  const transforms = JSON.parse(JSON.stringify(seed.transforms || {}));
  const views = seed.views || {};
  const ZT = { getVariableValue:(k,d)=> form[k]!==undefined?form[k]:d,
               setFormData:(k,v)=>{form[k]=v;}, setTransformData:(k,v)=>{transforms[k]=v;}, log:()=>{} };
  return {form, transforms, views, ZT};
}
// bare variables (notes, custom_field_*) are injected by the engine; mirror that
function run(src, e, bare={}) {
  const names = Object.keys(bare);
  const fn = new Function('ZT','transforms','views','actions', ...names, src);
  fn(e.ZT, e.transforms, e.views, e.actions || {}, ...names.map(n=>bare[n]));
}

// ---- mock Edvin errand config: two types, each with a proceed + a no_action action
const CATEGORY = { id: 7, name: "Schedule Change", types: [
  { id: 101, name: "Against Self Transfer Guarantee", actions: [
      { id: 9001, name: "Rebook alternative", bucket: { id: 4, name: "Proceed" } },
      { id: 9002, name: "No action needed",   bucket: { id: 3, name: "No action" } } ] },
  { id: 102, name: "Schedule Change", actions: [
      { id: 9003, name: "Refund", bucket: { id: 4, name: "Proceed" } } ] } ] };
const CHANNEL = { id: 2, name: "Email" };

function viRun({ partner, orderCreated, disruption, pnrs, declineAll=true }) {
  const e = env({ form:{ partner, disruption_type: disruption },
                  transforms:{ selected_pnrs: pnrs },
                  views:{ findorder: [{passengerFirstName:'A',passengerLastName:'B'}] } });
  run(vi['83'].content, e);
  run(vi['80'].content, e);
  run(vi['113'].content, e);
  let g=0;
  while (e.form.vi_more_rungs === true) {
    if (++g>20) throw new Error('ladder did not terminate');
    run(vi['115'].content, e);
    const os = e.transforms.vi_rung_options.map(o=>o.name);
    e.form[e.form.vi_rung_field] = declineAll && os.includes(NONE) ? NONE : os[0];
    run(vi['117'].content, e);
  }
  run(vi['118'].content, e);
  return e;
}

// ---- feed VI's output through Dynamic's REAL node 2 then node 27
function dynDownstream(e, { typeId, actionName }) {
  e.transforms.category = CATEGORY;
  e.transforms.channel  = CHANNEL;
  e.form.type = String(typeId);
  run(dyn['2'].content, e, { notes: 'agent note' });

  const recs = e.transforms.customer_action_pnrs;
  // node 11 gate
  const goesToLoop = e.transforms.isMorePNR === true;
  // node 12 builds the dropdown name; node 27 reads it back
  recs.forEach((r,i)=> { e.form['customer_action_'+r.pnr+'_'+i] = actionName; });
  run(dyn['27'].content, e);
  return { recs, goesToLoop,
           child_tickets: e.transforms.child_tickets,
           final_pnrs: e.transforms.final_pnrs,
           note: e.transforms.child_tickets_note };
}

const PNRS3 = [
  { pnr:'AAA111', id: 501, postSaleHandleType:'GDS' },
  { pnr:'BBB222', id: 502, postSaleHandleType:'LCC' },
  { pnr:'CCC333', id: 503, postSaleHandleType:'GDS' },
];

console.log('='.repeat(96));
console.log('HAND-OFF CONTRACT: VI node 118 -> Dynamic node 2 -> node 11 -> node 27');
console.log('='.repeat(96));

let fails = 0;
function check(label, cond, detail='') {
  if (!cond) { fails++; console.log(`  FAIL  ${label} ${detail}`); }
  else console.log(`  pass  ${label}${detail?'  '+detail:''}`);
}

for (const [label, cfg] of [
  ['3 PNRs, ETG post-cutoff, SC within 24h', {partner:'ETG', orderCreated:'2026-06-01T00:00:00Z', disruption:'Schedule change within 24 hour window', pnrs:PNRS3}],
  ['3 PNRs, Booking, trip delay',            {partner:'Booking', orderCreated:'2026-05-01T00:00:00Z', disruption:'Trip delay', pnrs:PNRS3}],
  ['3 PNRs, meal compensation (no ladder)',  {partner:'ETG', orderCreated:'2026-06-01T00:00:00Z', disruption:'Meal compensation', pnrs:PNRS3}],
  ['1 PNR (single-PNR VI order)',            {partner:'ETG', orderCreated:'2026-06-01T00:00:00Z', disruption:'Trip delay', pnrs:[PNRS3[0]]}],
]) {
  console.log(`\n-- ${label}`);
  const e = viRun(cfg);
  const cp = e.transforms.current_pnr;
  check('isMorePNR === false (node 11 skips the per-PNR loop)', e.transforms.isMorePNR === false);
  check('one collapsed pnr key', typeof cp.pnr === 'string', `-> "${cp.pnr}"`);
  check('providerPnrIds flat + complete', Array.isArray(cp.providerPnrIds) && cp.providerPnrIds.length === cfg.pnrs.length, JSON.stringify(cp.providerPnrIds));
  check('passengers carried from group selection', Array.isArray(cp.passengers) && cp.passengers.length === 1);

  // proceed bucket
  const r1 = dynDownstream(structuredClone_env(e), {typeId:101, actionName:'Rebook alternative'});
  check('exactly ONE customer_action_pnrs record', r1.recs.length === 1);
  check('exactly ONE child ticket', r1.child_tickets.length === 1, `title="${r1.child_tickets[0]?.child_ticket?.title}"`);
  check('ZERO grandchildren', (r1.child_tickets[0]?.child_ticket?.grandchild_tickets||[]).length === 0);
  check('bucket=proceed -> active child', r1.child_tickets[0]?.child_ticket?.title?.startsWith('Child Ticket'));
  check('exactly ONE final_pnrs (one Edvin errand)', r1.final_pnrs.length === 1);
  check('STG outcome survived into the record',
        cfg.disruption.includes('compensation') ? r1.final_pnrs[0].stg_outcome === '' : !!r1.final_pnrs[0].stg_outcome,
        `stg_outcome="${r1.final_pnrs[0].stg_outcome}"`);
  check('disruption answers survived', r1.final_pnrs[0].disruption_type === cfg.disruption);

  // non-proceed bucket -> silent ticket, still one, still no grandchildren
  const r2 = dynDownstream(structuredClone_env(e), {typeId:101, actionName:'No action needed'});
  check('non-proceed -> exactly ONE silent ticket', r2.child_tickets.length === 1,
        `title="${r2.child_tickets[0]?.child_ticket?.title}"`);
  check('silent ticket has no grandchildren', (r2.child_tickets[0]?.child_ticket?.grandchild_tickets||[]).length === 0);
}

function structuredClone_env(e) {
  const c = env({ form: JSON.parse(JSON.stringify(e.form)),
                  transforms: JSON.parse(JSON.stringify(e.transforms)) });
  return c;
}

console.log('\n' + '='.repeat(96));
console.log(fails === 0 ? 'ALL HAND-OFF CHECKS PASSED' : `${fails} CHECK(S) FAILED`);
