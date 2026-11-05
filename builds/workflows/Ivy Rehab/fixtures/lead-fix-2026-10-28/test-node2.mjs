import fs from 'fs';
const code = fs.readFileSync(new URL('./node2.js', import.meta.url), 'utf8');
const caset = [["ABA","Applied Behavior Analysis","AB"],["AUTIS","Autism","AB"],["BEHAV","Behavior","AB"],["ANKLE","Ankle","OT"],["ANKLE","Ankle","PT"],["BACK","Back","PT"],["BACK","Back","OT"],["TMJ","TMJ","PT"],["KNEE","Knee","PT"],["WRK","Work Conditioning","PT"],["HAND","Hand","OT"],["HAND","Hand","PT"]].map(([code,description,filter])=>({code,description,filter}));
const dpay = [["AB","Applied Behavioral Analysis"],["OT","Occupational Therapy"],["PT","Physical Therapy"],["SP","Speech Therapy"],["WC","Work Conditioning"],["WP","Work Conditioning PT"]].map(([code,description])=>({code,description}));
const cases = [
 {name:"721170936261 WC + Left ankle", v:{therapy_type:"PT",discipline_selection:"WC",body_part:"Left ankle"}, exp:['["PT"]','ANKLE']},
 {name:"721103162665 AB + TMJ", v:{therapy_type:"PT",discipline_selection:"AB",body_part:"TMJ"}, exp:['["PT"]','TMJ']},
 {name:"721102961414 AB + Back", v:{therapy_type:"PT",discipline_selection:"AB",body_part:"Back"}, exp:['["PT"]','BACK']},
 {name:"PT pick + knee", v:{therapy_type:"PT",discipline_selection:"PT",body_part:"knee"}, exp:['["PT"]','KNEE']},
 {name:"no pick, PT,OT + hand", v:{therapy_type:"PT,OT",discipline_selection:"",body_part:"hand"}, exp:['["PT","OT"]','HAND']},
 {name:"real ABA + autism", v:{therapy_type:"PT",discipline_selection:"AB",body_part:"Autism"}, exp:['["AB"]','AUTIS']},
 {name:"OT pick + ankle", v:{therapy_type:"PT",discipline_selection:"OT",body_part:"ankle"}, exp:['["OT"]','ANKLE']},
 {name:"Back/L calf (9/29 regression)", v:{therapy_type:"PT",discipline_selection:"",body_part:"Back/L calf"}, exp:['["PT"]','BACK']},
];
let fail=0;
for (const c of cases){
  const out={};
  const ZT={getVariableValue:(n,d)=> (n in c.v ? c.v[n] : d), setFormData:(k,v)=>{out[k]=v}, log:()=>{}};
  const actions={raintree__find_leads:{records:[]},raintree__get_disciplines:{tables:dpay},raintree__get_case_types:{tables:caset}};
  new Function('ZT','actions',code)(ZT,actions);
  const ok = out.lead_disciplines_json===c.exp[0] && out.lead_primary_reason===c.exp[1];
  if(!ok) fail++;
  console.log(ok?'PASS':'FAIL', c.name, out.lead_disciplines_json, out.lead_primary_reason);
}
console.log(fail? fail+' failed':'all pass');
