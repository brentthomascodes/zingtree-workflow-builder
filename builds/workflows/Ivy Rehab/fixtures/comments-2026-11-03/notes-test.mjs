import fs from 'fs';
import './helper-global.mjs'; const summaryHtmlToText = globalThis.summaryHtmlToText;
const html = `<p style="text-align:center;"><u><strong>CALL SUMMARY</strong></u></p><p><u><strong>Caller Info</strong></u><br><strong>First Name:</strong> PEC</p></div></div></div><!-- end SUMMARY INFO -->`;
const cases = [["notes", {notes:'Pt asked "AM only" & prefers text\nCall back Fri'}], ["404 none", {code:404,message:"not found"}], ["missing", undefined], ["blank", {notes:"   "}]];
let ok=0;
for (const [name, res] of cases) {
  const fd={}; const ZT={setFormData:(k,v)=>fd[k]=v,getVariableValue:(k,d="")=>fd[k]??d,getSessionId:()=>"W_test"};
  const actions = { zt__get_session_notes: res };
  // node 128
  function stage128(html){ let comment_json = JSON.stringify(summaryHtmlToText(html)).slice(1, -1); ZT.setFormData("comment_json", comment_json); ZT.setFormData("comment_base_json", comment_json); ZT.setFormData("notes_session_id", ZT.getSessionId()); ZT.setFormData("notes_master_tree_id", "632727963"); ZT.setFormData("notes_request_ts", String(Date.now())); }
  stage128(html);
  // node 2 (run twice to check no doubling)
  for (let i=0;i<2;i++){ let session_notes = String(actions.zt__get_session_notes?.notes || "").trim(); ZT.setFormData("comment_json", ZT.getVariableValue("comment_base_json", "") + (session_notes !== "" ? JSON.stringify("\nSession Notes\n" + session_notes).slice(1, -1) : "")); }
  // node 138
  function stage138(html) { let session_notes = String(actions.zt__get_session_notes?.notes || "").trim(); let text = summaryHtmlToText(html) + (session_notes !== "" ? "\nSession Notes\n" + session_notes : ""); ZT.setFormData("appointment_comment_json", JSON.stringify(text).slice(1, -1)); }
  stage138(html);
  const lead = JSON.parse(`{"comm":"${fd.comment_json}"}`).comm, appt = JSON.parse(`{"comments":"${fd.appointment_comment_json}"}`).comments;
  const notes = String(res?.notes||"").trim();
  const want = "CALL SUMMARY\nCaller Info\nFirst Name: PEC" + (notes ? "\nSession Notes\n"+notes : "");
  const pass = lead===want && appt===want; ok+=pass; console.log(pass?'pass':'FAIL', name); if(!pass) console.log(JSON.stringify({lead,appt,want}));
}
console.log(ok+'/'+cases.length);
