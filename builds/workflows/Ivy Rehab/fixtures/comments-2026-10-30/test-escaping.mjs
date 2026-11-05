const cases={plain:"disposition_type: PEC - Appointment Scheduled\n\nbody_part: Knee",
quotes:'final_notes: Pt said "call me at 5" & it\'s urgent!',
specials:"notes: @home #2 $50 50% <b>tag</b> back\\slash\ttab",
unicode:"notes: café – naïve 😊",
long:"x".repeat(5000)};
let ok=0;
for(const [k,v] of Object.entries(cases)){
  const fd={}; const ZT={setFormData:(a,b)=>fd[a]=b};
  const summary_text=v;
  ZT.setFormData("comment_json", JSON.stringify(String(summary_text)).slice(1, -1));
  const body=`{"firstName":"T","comm":"${fd.comment_json}","disciplines":["PT"]}`;
  let p; try{p=JSON.parse(body)}catch(e){console.log('FAIL',k,e.message);continue}
  const pass=p.comm===v; ok+=pass; console.log(pass?'pass':'FAIL',k);
}
console.log(ok+'/5');
