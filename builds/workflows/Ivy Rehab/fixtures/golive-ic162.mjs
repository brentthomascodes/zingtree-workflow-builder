import fs from "fs";
const src = fs.readFileSync("ic162.js","utf8");
const cases = [
  ["accepted w/ code + member id", {patient_insurance_rt_code:"10001", subscriber_id:"W123", subscriber_dob:"01/05/1980", subscriber_relationship_to_patient:"Self", patient_address_line_1:"1 Main", patient_phone_number:"(801) 555-5555", appointment_carestart_dateonly:"2026-10-26"}, "true"],
  ["empty code (comments-only clinic)", {patient_insurance_rt_code:"", subscriber_id:"W123", appointment_carestart_dateonly:"2026-10-26"}, "false"],
  ["code, no member id (no card)", {patient_insurance_rt_code:"10001", subscriber_id:"", appointment_carestart_dateonly:"2026-10-26"}, "false"],
  ["code, member id spaces", {patient_insurance_rt_code:"10001", subscriber_id:"  ", appointment_carestart_dateonly:"2026-10-26"}, "false"],
];
for (const [n, form, want] of cases) {
  const f = {...form};
  const ZT = { getVariableValue:(k,d)=> k in f ? f[k] : d, setFormData:(k,v)=>{f[k]=v}, setTransformData:()=>{} };
  try { new Function("ZT", src)(ZT); console.log((f.is_create_patient_insurance===want?"pass ":"FAIL ")+n.padEnd(36), "is_create="+f.is_create_patient_insurance, "dob="+(f.subscriber_dob_iso??""), "phone="+(f.subscriber_phone??""), "rel="+(f.subscriber_relationship??"")); }
  catch(e){ console.log("FAIL "+n+" threw "+e.message); }
}
