import fs from 'fs';
const tree=JSON.parse(fs.readFileSync(process.argv[2]||'v32.json','utf8'));
const cfg=JSON.parse(fs.readFileSync('edvin_real.json','utf8'));
const KNOWN=["proceed","no_action","escalate","different_request"];
let fail=0; const t=(c,m)=>{console.log((c?'PASS':'FAIL')+' '+m); if(!c)fail=1;};

function run(node, store, form, extra){
  const logs=[];
  const ZT={setTransformData:(k,v)=>{store[k]=v},setFormData:(k,v)=>{form[k]=v},
    getVariableValue:(k,d)=>(k in form?form[k]:(k in store?store[k]:d)),log:m=>logs.push(m)};
  new Function('ZT','transforms','actions','notes',tree.nodes[node].content)
    (ZT,{...store},extra||{},form.notes||'');
  return logs;
}
const category={id:140,name:'Cancellation',types:cfg.types};
const channel={id:80,name:'Phone',categories:[category]};
const acts={edvin__errand_configuration:{channels:[channel]},get_edvin_prop_long_value:{value:80}};
const FORM={custom_field_29559177650834:'contact_reason__cancellation'};

// ---- node 46: the whole category in one pass -------------------------------
const s46={}, f46={...FORM};
const logs46=run('46',s46,f46,acts);
const flat=s46.actions_flat;
t(flat.length===137, `node 46 mapped every action slot in the real Cancellation category (${flat.length}/137)`);
// Apply node 27's OWN normalization before judging - it trims and lowercases before
// testing KNOWN_BUCKETS, so "Proceed" passes there even with no mapping at all. Only
// the labels that survive that step and still miss are real rejects.
const norm=v=>String(v||'').trim().toLowerCase();
const bad46=flat.filter(a=>KNOWN.indexOf(norm(a.bucket))===-1);
t(bad46.length===0, `every one survives node 27's KNOWN_BUCKETS check (${bad46.length} of ${flat.length} rejected)`
  + (bad46.length?'\n        rejected labels: '+JSON.stringify([...new Set(bad46.map(a=>a.bucket))]):''));
t(!logs46.some(l=>l.includes('WARNING bucket')), 'no unmapped-bucket warnings across the whole category');

// ---- node 2: every type, one at a time -------------------------------------
let checked=0, mismatches=[];
cfg.types.forEach(ty=>{
  const s2={category,channel,current_pnr:{pnr:'9D89VM'},customer_action_pnrs:[]};
  run('2',s2,{...FORM,type:ty.id},acts);
  s2.actions_array.forEach(a=>{
    checked++;
    const ref=flat.find(x=>x.id===a.id && x.type_id===ty.id);
    if(!ref || ref.bucket!==a.bucket) mismatches.push({type:ty.name,action:a.name,n2:a.bucket,n46:ref&&ref.bucket});
  });
});
t(checked===137, `node 2 mapped all ${checked} slots across all ${cfg.types.length} real types`);
t(mismatches.length===0, `nodes 2 and 46 agree on every action (${mismatches.length} mismatches)`
  + (mismatches.length?': '+JSON.stringify(mismatches.slice(0,3)):''));

// ---- distribution, so the numbers are visible ------------------------------
const dist={}; flat.forEach(a=>dist[a.bucket]=(dist[a.bucket]||0)+1);
console.log('\n  routing distribution across the real Cancellation category:', JSON.stringify(dist));
console.log('  distinct Edvin buckets seen:',
  JSON.stringify([...new Set(cfg.types.flatMap(t=>t.actions.map(a=>a.bucket.id+':'+a.bucket.name)))]));
console.log('\n  ' + logs46.filter(l=>l.startsWith('edvin bucket labels seen:'))[0]);
process.exitCode=fail;
