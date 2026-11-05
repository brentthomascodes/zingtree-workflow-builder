import fs from 'fs';
const tree=JSON.parse(fs.readFileSync('v30.json','utf8'));
let fail=0; const t=(c,m)=>{console.log((c?'PASS':'FAIL')+' '+m); if(!c)fail=1;};

function render(nodeId, seed){
  const form={},store=seed;
  const ZT={setTransformData:(k,v)=>{store[k]=v},setFormData:(k,v)=>{form[k]=v},
    getVariableValue:(k,d)=>(k in form?form[k]:(k in store?store[k]:d)),log:()=>{}};
  new Function('ZT','transforms','actions',tree.nodes[nodeId].content)(ZT,{...store},{});
  return store;
}
const ACT=[{id:'A1',actionId:'A1',name:'Void completed',bucket:'proceed'},
           {id:'A2',actionId:'A2',name:'Do not proceed',bucket:'no_action'}];
const pnrs=[{pnr:'9D89VM',type:'Void',channel:'Chat',category:'Cancellation',notes:'a note',
  formatted_passengers:'<div><strong>First Name:</strong> A</div>',passengers:[],actions_array:ACT},
  {pnr:'AUU84K',type:'Void',channel:'Chat',category:'Cancellation',notes:'',
  formatted_passengers:'',passengers:[],actions_array:ACT}];

const HOSTILE={'<style> block':/<style[\s>]/i,'<script>':/<script/i,'event handler':/\son[a-z]+\s*=/i,
  'javascript: URI':/javascript:/i,'<link>':/<link/i,'@media':/@media/i,'CSS var()':/var\(--/i,
  ':root':/:root/i,'<iframe>':/<iframe/i,'@import':/@import/i,'expression(':/expression\(/i,
  'data-* attribute':/\sdata-[a-z-]+=/i,'srcdoc':/srcdoc/i};

function audit(label, html){
  console.log(`\n--- ${label} (${html.length} chars) ---`);
  let clean=true;
  for(const [k,re] of Object.entries(HOSTILE)){
    const n=(html.match(new RegExp(re.source,'gi'))||[]).length;
    if(n){clean=false; console.log(`   PRESENT x${n}  ${k}`);}
  }
  t(clean, `${label}: contains none of the 13 sanitizer-hostile constructs`);
  t(/\sstyle="/.test(html), `${label}: styled with inline style= attributes`);
  return html;
}

const s1=render('12',{customer_action_pnrs:pnrs});
const table=audit('node 12 action table', s1.customer_action_table_html);
t(/class="zt-data"/.test(table), 'node 12: zt-data capture hook preserved on every select');
t((table.match(/<select/g)||[]).length===2, 'node 12: one select per PNR');
t(/<option value="A1"/.test(table), 'node 12: option values are action ids');
t(table.trim().startsWith('<div style="'), 'node 12: string opens with a plain styled div, not a <style> tag');

// selection persistence must survive the rewrite
const s2=render('12',{customer_action_pnrs:pnrs, __x:0});
const withPick={...s2}; 
const form2={'customer_action_9D89VM_0':'A2'};
const ZT2={setTransformData:(k,v)=>{withPick[k]=v},setFormData:()=>{},
  getVariableValue:(k,d)=>(k in form2?form2[k]:(k in withPick?withPick[k]:d)),log:()=>{}};
new Function('ZT','transforms','actions',tree.nodes['12'].content)(ZT2,{customer_action_pnrs:pnrs},{});
t(/<option value="A2" selected>/.test(withPick.customer_action_table_html),
  'node 12: previously submitted pick is still preselected after the rewrite');

// node 27's agent screen
const s3=render('27',{customer_action_pnrs:pnrs});
audit('node 27 unresolved screen', s3.unresolved_note_html);

// Nothing else in the tree EMITS a <style> block. Comments are stripped first -
// several nodes now document the constraint in prose, and node 5 is claude.md, which
// is never rendered to an agent.
function strip(js){
  return js.replace(/\/\*[\s\S]*?\*\//g,'').split('\n').map(l=>l.replace(/\/\/.*$/,'')).join('\n');
}
const live=Object.entries(tree.nodes).filter(([k,n])=>k!=='5');
const offenders=live.filter(([k,n])=>/<style[\s>]/i.test(strip(n.content||'')));
t(offenders.length===0, `no node body still emits a <style> block ${offenders.map(o=>o[0])}`);
const scripts=live.filter(([k,n])=>/<script|\son[a-z]+\s*=\s*"/i.test(strip(n.content||'')));
t(scripts.length===0, `no node body emits a <script> or event handler ${scripts.map(o=>o[0])}`);
const contentNodes=live.filter(([k,n])=>n.type==='Content' && /<style[\s>]|<script/i.test(n.content||''));
t(contentNodes.length===0, `no Content node hardcodes a <style> or <script> ${contentNodes.map(o=>o[0])}`);
process.exitCode=fail;
