// Node 128 - Five9 Handoff: stage BH warm-transfer payload
// Fires invisibly between node 63 (Transfer to BH Counselor) and node 64 (BH Welcome).
// Feeds node 129 -> Connected Object 1096 (Five9 - Add to List).
// A second, complete record is written at wrap-up by nodes 124/125. By design the
// GUIDs differ, so Five9 receives two distinct records for one BH call.

function generateGuid() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    var r = Math.random() * 16 | 0,
        v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

function truncate(value) {
  if (!value) return value;
  return value.toString().substring(0, 245);
}

// Read-and-rewrite. Never blanks a value, so a NurseLine -> Internal Transfer -> BH
// path keeps anything already captured upstream.
function stage(name) {
  ZT.setFormData(name, truncate(ZT.getVariableValue(name, "")));
}

ZT.setFormData("guid", generateGuid());

// Populated by the time the agent reaches node 63 - this is the payload that
// actually matters to the receiving BH counselor.
var AT_TRANSFER = [
  "guid",
  "List_Name",
  "Campaign_Name",
  "call_id",
  "session_id",
  "Member_First_Name",
  "Member_Last_Name",
  "Member_ID",
  "Member_Number",
  "Member_Phone",
  "date_of_birth",
  "Street_Address",
  "Zip_Code",
  "Language",
  "Caller_Identity",
  "Call_Reason",
  "Other_Reason",
  "CC_Need",
  "Chief_Complaint",
  "Initial_Assessment"
];

// Collected downstream of node 63 (nodes 25, 27, 28, 71, 72, 80-82, 87, 92-100).
// Staged anyway so the Five9 payload carries no unreplaced #tokens#.
var PENDING_AT_TRANSFER = [
  "Treatment_Notes",
  "MRTNS",
  "Additional_Needs",
  "Call_Narrative",
  "Call_Resolution",
  "Followup_Question",
  "Reason_for_Followup",
  "NPI_1",
  "NPI_2",
  "Prov_First_Name1",
  "Prov_Last_Name1",
  "Specialty1",
  "Prov_First_Name2",
  "Prov_Last_Name2",
  "Specialty2"
];

AT_TRANSFER.concat(PENDING_AT_TRANSFER).forEach(stage);
