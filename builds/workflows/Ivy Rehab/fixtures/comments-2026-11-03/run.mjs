import "./helper-global.mjs";
import fs from 'fs';
const node=process.argv[2];
const src=fs.readFileSync(`node${node}.export.js`,'utf8');
const helper=fs.readFileSync('helper.js','utf8');
const vars={name:"Ivy Rehab Physical Therapy - Parowan",clinic_raintree_code:"ZZZ",disposition_type:"PEC - Appointment Scheduled IE",rt_task_subtype:"PEC - No Referral",
caller_first_name:"PEC",caller_last_name:"Test128",caller_phone_number:"8015555555",patient_first_name:"PEC",patient_last_name:"Test128",patient_relationship_to_caller:"self",
patient_dob:"01-01-1999",patient_birth_sex:"Female",patient_pronouns:"[not offered]",patient_phone_number:"8015555555",patient_email_address:"kelsie.brimhall@ivyrehab.com",
patient_address_line_1:"1311 Mamaroneck Ave",patient_city:"White Plains",patient_state:"NY",patient_zipcode:"10605",therapy_type:"PT",how_did_you_hear_about_us:"Online",
body_part:"Knee",additional_treatment_notes:'Patient fell and hurt knee. Recommended for "therapy" & rest',specialty_needed_name:"None",referring_physician_last_name:"Tester",
referred_to_ivy:"Specifically referred to Ivy",is_private_pay_patient:"true",appt_ie_pricing:"125",appt_dv_pricing:"100",new_appointment_clinic:"",appt_clinic:"Ivy Rehab Physical Therapy - Parowan",appt_clinic_raintree_code:"ZZZ",appt_date:"11/06/2026",appt_time:"8:00 AM",
appt_provider:"Test",scheduled_out_reason:"Patient unable to come in prior Friday in the morning. Prefers AM appointments",disposition_tag:"Original Clinic"};
Object.assign(globalThis,vars);
const fd={},td={};
globalThis.ZT={getVariableValue:(k,d="")=>vars[k]??d,setFormData:(k,v)=>fd[k]=v,setTransformData:(k,v)=>td[k]=v};
globalThis.openClinicInfoModal=()=>{};
try{ new Function(src+"\n"+helper)(); }catch(e){console.log('script error',e.message)}
const txt=summaryHtmlToText(td.Summary_HTML);
console.log(txt);
const body=`{"comm":"${JSON.stringify(txt).slice(1,-1)}"}`; console.log('JSON ok:', JSON.parse(body).comm===txt);
