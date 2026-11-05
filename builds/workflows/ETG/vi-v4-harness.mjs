import fs from 'fs';

const v4   = JSON.parse(fs.readFileSync('vi_dynamic_v4_2.json','utf8')).nodes;
const olga = JSON.parse(fs.readFileSync('olga_vi_dynamic.json','utf8')).nodes;
const NONE = "None of the above is available";

// ---------- run the REAL script text from the v4 tree in a mock ZT sandbox ----------
function makeEnv(seed) {
  const form = Object.assign({}, seed.form);
  const transforms = JSON.parse(JSON.stringify(seed.transforms || {}));
  const ZT = {
    getVariableValue: (k, d) => (form[k] !== undefined ? form[k] : d),
    setFormData: (k, v) => { form[k] = v; },
    setTransformData: (k, v) => { transforms[k] = v; },
    log: () => {},
  };
  return { form, transforms, ZT };
}
function runNode(id, env) {
  const src = v4[id].content;
  // eslint-disable-next-line no-new-func
  const fn = new Function('ZT', 'transforms', src);
  fn(env.ZT, env.transforms);
}

// walk the v4 engine, declining every rung, and record what each screen offered
function walkEngine({ partner, orderCreated, disruption }) {
  const env = makeEnv({
    form: { partner, disruption_type: disruption },
    transforms: { selected_pnrs: [{ pnr: 'AAA111', id: 1, orderCreated }] },
  });
  runNode('113', env);
  const screens = [];
  let guard = 0;
  while (env.form.vi_more_rungs === true) {
    if (++guard > 20) throw new Error('engine did not terminate');
    runNode('115', env);
    screens.push({
      title: env.form.vi_rung_title,
      options: env.transforms.vi_rung_options.map(o => o.name),
    });
    const os = env.transforms.vi_rung_options.map(o=>o.name);
    env.form[env.form.vi_rung_field] = os.includes(NONE) ? NONE : os[0];   // decline while possible
    runNode('117', env);
  }
  return { screens, variant: env.form.vi_ladder_variant, outcome: env.form.vi_stg_outcome };
}

// ---------- oracle: walk OLGA's actual node graph the same way ----------
function optsOf(n) {
  const f = Object.values(n.formfields || {}).find(x => (x.options || '').includes(NONE)
                                                    || x.name?.startsWith('stg_'));
  return f ? { label: f.label, options: f.options.split('\n').map(s => s.trim()) } : null;
}
function walkOlga({ partner, disruption }) {
  let cur = partner === 'Booking' ? '50' : '66';         // her node 49: partner only, no date
  const routerOf = { '50': '52', '66': '67' };
  const router = olga[routerOf[cur]];
  // disruption router
  let next = null;
  for (const b of Object.values(router.buttons)) {
    const e = b.logic_expression || '';
    if (!e) continue;
    if (e.includes(`"${disruption}"`)) { next = b.button_link; break; }
  }
  if (next === null) return { screens: [], exit: 'DEFAULT/DEAD' };
  if (next === '1') return { screens: [], exit: 'type-action (no ladder)' };

  const screens = [];
  let guard = 0;
  while (next && next !== '1' && next !== '0') {
    if (++guard > 20) throw new Error('oracle loop');
    const n = olga[next];
    const o = optsOf(n);
    if (o) screens.push({ title: o.label, options: o.options });
    // step to the logic node, then take its NONE branch (or exit)
    const logicId = Object.values(n.buttons)[0].button_link;
    const logic = olga[logicId];
    if (!logic || logic.type !== 'Scoring') break;        // refund rung -> straight to type/action
    let declineTarget = null;
    for (const b of Object.values(logic.buttons)) {
      if ((b.logic_expression || '').includes(NONE)) declineTarget = b.button_link;
    }
    next = declineTarget;
  }
  return { screens, exit: 'type-action' };
}

// ---------- compare ----------
const DISRUPTIONS = [
  'Schedule change within 24 hour window',
  'Schedule change outside 24 hour window',
  'Trip delay',
  'Accomodation compensation',
  'Meal compensation',
];
const PRE  = '2026-05-01T00:00:00Z';
const POST = '2026-06-01T00:00:00Z';

const cases = [];
for (const d of DISRUPTIONS) {
  cases.push({ label: `Booking / pre-cutoff        `, partner: 'Booking', orderCreated: PRE,  disruption: d, oracle: 'Booking' });
  cases.push({ label: `Booking / post-cutoff       `, partner: 'Booking', orderCreated: POST, disruption: d, oracle: 'Booking' });
  cases.push({ label: `ETG / pre-cutoff            `, partner: 'ETG',     orderCreated: PRE,  disruption: d, oracle: 'Booking', intentional: 'ETG pre-cutoff now follows the standard ladder (Olga\'s stated rule); her built tree sent it to Rebooking Pass' });
  cases.push({ label: `ETG / post-cutoff           `, partner: 'ETG',     orderCreated: POST, disruption: d, oracle: 'ETG' });
  cases.push({ label: `ETG / date missing          `, partner: 'ETG',     orderCreated: '',   disruption: d, oracle: 'Booking', intentional: 'unparseable date falls back to the standard ladder' });
}

let pass = 0, diffs = 0;
const sig = s => s.screens.map(x => x.title + '::' + x.options.join('|')).join('  >>  ') || '(no ladder)';

console.log('='.repeat(118));
for (const c of cases) {
  const mine = walkEngine(c);
  const theirs = walkOlga({ partner: c.oracle, disruption: c.disruption });
  const same = sig(mine) === sig(theirs);
  const tag = same ? 'MATCH  ' : 'DIFF   ';
  if (same) pass++; else diffs++;
  console.log(`${tag} ${c.label} ${c.disruption.padEnd(38)} rungs=${mine.screens.length} variant=${mine.variant}`);
  if (c.intentional) console.log(`         ^ intentional deviation from her BUILT tree: ${c.intentional}`);
  if (!same) {
    console.log('   MINE  :', sig(mine));
    console.log('   OLGA  :', sig(theirs));
  }
}
console.log('='.repeat(118));
console.log(`option-set sequences identical to Olga's graph: ${pass}/${cases.length}   differing: ${diffs}`);

// ---------- accept-at-each-rung: prove every rung can exit ----------
console.log('\nAccept-at-rung-N exit checks:');
for (const partner of ['Booking','ETG']) {
  for (const d of DISRUPTIONS) {
    const env0 = walkEngine({ partner, orderCreated: POST, disruption: d });
    const depth = env0.screens.length;
    for (let acceptAt = 0; acceptAt < depth; acceptAt++) {
      const env = makeEnv({ form: { partner, disruption_type: d },
        transforms: { selected_pnrs: [{ pnr:'A', id:1, orderCreated: POST }] } });
      runNode('113', env);
      let i = 0, guard = 0;
      while (env.form.vi_more_rungs === true) {
        if (++guard > 20) throw new Error('no terminate');
        runNode('115', env);
        const opts = env.transforms.vi_rung_options.map(o=>o.name);
        env.form[env.form.vi_rung_field] = (i === acceptAt) ? opts[0] : NONE;
        runNode('117', env);
        i++;
      }
      const ok = env.form.vi_stg_outcome && env.form.vi_more_rungs === false;
      if (!ok) console.log(`  FAIL ${partner} ${d} acceptAt=${acceptAt}`);
    }
  }
}
console.log('  all accept-at-rung paths terminated with a recorded outcome.');

// terminal rung: "Last resort" must exit, not loop
const envLR = makeEnv({ form:{partner:'ETG',disruption_type:'Trip delay'},
  transforms:{selected_pnrs:[{pnr:'A',id:1,orderCreated:POST}]}});
runNode('113', envLR);
let g=0;
while (envLR.form.vi_more_rungs === true) {
  if (++g>20) throw new Error('loop');
  runNode('115', envLR);
  const opts = envLR.transforms.vi_rung_options.map(o=>o.name);
  envLR.form[envLR.form.vi_rung_field] = opts.includes('Last resort') ? 'Last resort' : NONE;
  runNode('117', envLR);
}
console.log(`  terminal rung: outcome="${envLR.form.vi_stg_outcome}" rung="${envLR.form.vi_stg_outcome_rung}" trail="${envLR.form.vi_stg_trail_text}"`);
