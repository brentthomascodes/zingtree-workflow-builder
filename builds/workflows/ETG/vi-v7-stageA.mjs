// Stage A: static checks + every-path replay of the PATCHED node 27 code,
// extracted verbatim from the built JSON and executed against a scenario matrix.
import fs from 'fs';
const FILE = './Register Errands - VI Dynamic (v7 combined-PNR errand data 2026-08-21).json';
const BASE = '/tmp/tree.json';
const tree = JSON.parse(fs.readFileSync(FILE, 'utf8'));
const base = JSON.parse(fs.readFileSync(BASE, 'utf8'));

let fails = 0, passes = 0;
const check = (ok, msg) => { ok ? passes++ : (fails++, console.log('  FAIL ' + msg)); if (ok) console.log('  ok   ' + msg); };

console.log('--- STATIC ---');
// 1. only node 27 changed
const changed = Object.keys(tree.nodes).filter(k => JSON.stringify(tree.nodes[k]) !== JSON.stringify(base.nodes[k]));
check(changed.length === 1 && changed[0] === '27', 'exactly one node changed, and it is 27 (changed: ' + changed.join(',') + ')');
// 2. node counts / root identical
check(Object.keys(tree.nodes).length === Object.keys(base.nodes).length, 'node count unchanged (' + Object.keys(tree.nodes).length + ')');
check(tree.root_node_id === base.root_node_id, 'root_node_id unchanged (' + tree.root_node_id + ')');
const roots = Object.keys(tree.nodes).filter(k => tree.nodes[k].is_root == 1);
check(roots.length === 1 && String(roots[0]) === String(tree.root_node_id), 'exactly one is_root and it matches root_node_id');
// 3. no dangling targets
const ids = new Set(Object.keys(tree.nodes));
let dangling = [];
for (const [k, n] of Object.entries(tree.nodes)) {
  const c = n.continuation_node_id;
  if (c && String(c) !== '0' && !ids.has(String(c))) dangling.push(`${k}.continuation->${c}`);
  for (const b of Object.values(n.buttons || {})) {
    const l = b.button_link;
    if (l && String(l) !== '0' && !ids.has(String(l))) dangling.push(`${k}.button->${l}`);
  }
}
check(dangling.length === 0, 'no dangling continuation/button targets (' + (dangling.join(', ') || 'none') + ')');
// 4. node 27 still continues to 79 (hand-off to parent)
check(String(tree.nodes['27'].continuation_node_id) === '79', 'node 27 still continues to 79 (parent hand-off)');
// 5. grouping key untouched
const c27 = tree.nodes['27'].content;
check(c27.includes('const errandKey = it => `${it.type || ""}|${it.customer_action || ""}`;'), 'grouping key (type + action) byte-identical');
check(c27.includes('let child_tickets = buildChildTickets(bucket_stitch);'), 'child/silent/grandchild builder untouched');
check(c27.includes('let child_tickets_note = buildChildTicketsNote(child_tickets);'), 'summary-note builder untouched');
check(!c27.includes('.map(group => group[0])'), 'the group[0] PNR-dropping line is gone');
// 6. code parses
try { new Function('transforms','actions','ZT','notes','partner', c27); check(true, 'node 27 parses as valid JS'); }
catch (e) { check(false, 'node 27 parses as valid JS: ' + e.message); }

console.log('\n--- REPLAY (real node 27 code, all paths) ---');
const mkAction = (id, name, bucket) => ({ id, actionId: id, name, bucket, edvin_actions: { x: id } });
const ACTIONS = [ mkAction(91,'Sent to ticketing','proceed'), mkAction(92,'Sent to support','proceed'),
                  mkAction(93,'No action taken','no_action'), mkAction(94,'Different request','different_request') ];

function run(pnrRows) {
  const VARS = {}, T = { customer_action_pnrs: [] }, FORM = {};
  VARS.zd_ticket_id = '337619'; VARS.orderReference = '1029-995-166';
  pnrRows.forEach((r, i) => { VARS[`customer_action_${String(r.pnr).replace(/[^a-zA-Z0-9_-]/g,'_')}_${i}`] = r.pick; });
  T.customer_action_pnrs = pnrRows.map(r => ({
    pnr: r.pnr, id: r.id, channel: 'Chat', channelId: 3, category: 'Rebooking', categoryId: 11,
    type: r.type, typeId: r.typeId, notes: r.notes,
    passengers: [{ passengerFirstName: r.pax, passengerLastName: 'Grzybowski' }],
    formatted_passengers: `<p>${r.pax}</p>`, actions_array: ACTIONS
  }));
  const ZT = {
    getVariableValue: (k, d='') => (VARS[k] !== undefined && VARS[k] !== '' ? VARS[k] : d),
    setTransformData: (k,v) => { T[k] = v; }, setFormData: (k,v) => { FORM[k] = v; }, log: () => {}
  };
  new Function('transforms','actions','ZT','notes','partner', c27)(T, {}, ZT, '', '');
  return { T, FORM };
}

// parent v40 node 44 free-text builder, verbatim field list
function errandMessage(e, vars) {
  const f = [['Type',e.type],['Customer Action',e.customer_action],['PNR',e.pnr],
    ['Passengers',e.passenger_names],['Channel',e.channel],['Contact Reason',e.category],
    ['Order Reference',e.orderReference],['Zendesk Ticket',e.zendesk_parent_ticket_id],
    ['Agent Notes',e.free_text]];
  return f.filter(x => x[1]).map(x => x[0]+': '+x[1]).join('\n');
}

const S = [
 { name:'1 PNR, proceed',
   rows:[{pnr:'IFVLYF',id:5551,type:'Force Majeure',typeId:812,notes:'note A',pax:'Igor',pick:'Sent to ticketing'}],
   exp:{errands:1, pnrs:['IFVLYF'], ids:[[5551]], child:1, silent:0, gc:0} },
 { name:'2 PNRs, same type + SAME action  <-- ticket 337619',
   rows:[{pnr:'IFVLYF',id:5551,type:'Force Majeure',typeId:812,notes:'note A',pax:'Igor',pick:'Sent to ticketing'},
         {pnr:'PN6WPN',id:5552,type:'Force Majeure',typeId:812,notes:'note B',pax:'Igor',pick:'Sent to ticketing'}],
   exp:{errands:1, pnrs:['IFVLYF, PN6WPN'], ids:[[5551,5552]], child:1, silent:0, gc:0} },
 { name:'2 PNRs, same type + DIFFERENT action  <-- Brent\'s paste',
   rows:[{pnr:'IFVLYF',id:5551,type:'Force Majeure',typeId:812,notes:'note A',pax:'Igor',pick:'Sent to ticketing'},
         {pnr:'PN6WPN',id:5552,type:'Force Majeure',typeId:812,notes:'note B',pax:'Igor',pick:'Sent to support'}],
   exp:{errands:2, pnrs:['IFVLYF','PN6WPN'], ids:[[5551],[5552]], child:1, silent:0, gc:2} },
 { name:'3 PNRs, 2 share a pair + 1 differs',
   rows:[{pnr:'AAA111',id:1,type:'Force Majeure',typeId:812,notes:'n1',pax:'Ann',pick:'Sent to ticketing'},
         {pnr:'BBB222',id:2,type:'Force Majeure',typeId:812,notes:'n2',pax:'Bob',pick:'Sent to ticketing'},
         {pnr:'CCC333',id:3,type:'Force Majeure',typeId:812,notes:'n3',pax:'Cal',pick:'Sent to support'}],
   exp:{errands:2, pnrs:['AAA111, BBB222','CCC333'], ids:[[1,2],[3]], child:1, silent:0, gc:2} },
 { name:'2 PNRs share pair, both no_action (silent)',
   rows:[{pnr:'AAA111',id:1,type:'Force Majeure',typeId:812,notes:'n1',pax:'Ann',pick:'No action taken'},
         {pnr:'BBB222',id:2,type:'Force Majeure',typeId:812,notes:'n2',pax:'Bob',pick:'No action taken'}],
   exp:{errands:1, pnrs:['AAA111, BBB222'], ids:[[1,2]], child:0, silent:1, gc:0} },
 { name:'mixed: 2 proceed (same pair) + 1 different_request',
   rows:[{pnr:'AAA111',id:1,type:'Force Majeure',typeId:812,notes:'n1',pax:'Ann',pick:'Sent to ticketing'},
         {pnr:'BBB222',id:2,type:'Force Majeure',typeId:812,notes:'n2',pax:'Bob',pick:'Sent to ticketing'},
         {pnr:'CCC333',id:3,type:'Force Majeure',typeId:812,notes:'n3',pax:'Cal',pick:'Different request'}],
   exp:{errands:2, pnrs:['AAA111, BBB222','CCC333'], ids:[[1,2],[3]], child:1, silent:1, gc:0} },
 { name:'2 PNRs, DIFFERENT type + same action',
   rows:[{pnr:'AAA111',id:1,type:'Force Majeure',typeId:812,notes:'n1',pax:'Ann',pick:'Sent to ticketing'},
         {pnr:'BBB222',id:2,type:'Schedule Change',typeId:813,notes:'n2',pax:'Bob',pick:'Sent to ticketing'}],
   exp:{errands:2, pnrs:['AAA111','BBB222'], ids:[[1],[2]], child:1, silent:0, gc:2} },
 { name:'nothing selected (unreadable)',
   rows:[{pnr:'AAA111',id:1,type:'Force Majeure',typeId:812,notes:'n1',pax:'Ann',pick:''}],
   exp:{errands:1, pnrs:['AAA111'], ids:[[1]], child:0, silent:1, gc:0} },
 { name:'PNR with punctuation (safePnr round-trip)',
   rows:[{pnr:'AB-12/34',id:7,type:'Force Majeure',typeId:812,notes:'n1',pax:'Ann',pick:'Sent to ticketing'}],
   exp:{errands:1, pnrs:['AB-12/34'], ids:[[7]], child:1, silent:0, gc:0} },
];

let matrixFails = 0;
for (const s of S) {
  const { T, FORM } = run(s.rows);
  const e = T.errands_to_register || [];
  const fin = T.final_pnrs || [];
  const cts = T.child_tickets || [];
  const isP = ct => (ct.child_ticket.bucket||'').trim().toLowerCase() === 'proceed';
  const child = cts.filter(isP).length, silent = cts.length - child;
  const gc = cts.reduce((a,ct)=>a+(ct.child_ticket.grandchild_tickets||[]).length,0);
  const got = { errands: e.length, pnrs: e.map(x=>x.pnr), ids: e.map(x=>x.orderProviderBookingDetails), child, silent, gc };
  const ok = JSON.stringify(got) === JSON.stringify(s.exp);
  const sameRef = JSON.stringify(fin) === JSON.stringify(e);
  if (!ok || !sameRef) matrixFails++;
  console.log(`\n[${ok && sameRef ? 'PASS' : 'FAIL'}] ${s.name}`);
  console.log(`   errands=${got.errands} pnrs=${JSON.stringify(got.pnrs)} bookingIds=${JSON.stringify(got.ids)} child=${child} silent=${silent} grandchild=${gc}`);
  if (!ok) console.log(`   EXPECTED ${JSON.stringify(s.exp)}`);
  if (!sameRef) console.log('   FAIL final_pnrs !== errands_to_register');
  if (T.final_pnrs_count !== 0 || FORM.errands_index !== 0) { matrixFails++; console.log('   FAIL cursors not reset'); }
  if (s.exp.errands >= 1) {
    console.log('   --- errand 1 message ---');
    console.log(errandMessage(e[0]).split('\n').map(l=>'     '+l).join('\n'));
  }
}
console.log(`\n--- RESULT ---\nstatic: ${passes} ok, ${fails} failed\nmatrix: ${S.length - matrixFails}/${S.length} scenarios passed`);
process.exit(fails + matrixFails ? 1 : 0);
