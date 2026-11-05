// Node 1 - Init (ROOT). Penrose MH Master Triage v3.
// Normalizes the `condition` query param / picker choice, and defaults all
// display transforms to empty strings so nothing renders until set.
const LABEL_MAP = {"smi": "smi", "depression": "depression", "adult_mh": "adult_mh", "cyp": "cyp", "risk": "risk", "Severe Mental Illness Review": "smi", "Adult Mental Health": "adult_mh", "Depression Review": "depression", "Children and Young People Mental Health and Learning Disability": "cyp", "MH Risk Assessment": "risk"};

ZT.setTransformData("outcome_html", "");
ZT.setTransformData("sn_html", "");

let raw = ZT.getVariableValue("condition", "").trim();
let key = LABEL_MAP[raw] || LABEL_MAP[raw.toLowerCase()] || "";

let needsPicker = true;
if (key) {
    needsPicker = false;
    ZT.setFormData("condition", key);
}
ZT.setFormData("needs_picker", needsPicker);
// house pattern: logic nodes evaluate exactly one script-computed boolean
ZT.setFormData("cond_smi", key === "smi");
ZT.setFormData("cond_adult_mh", key === "adult_mh");
ZT.setFormData("cond_depression", key === "depression");
ZT.setFormData("cond_cyp", key === "cyp");
ZT.setFormData("cond_risk", key === "risk");
ZT.setFormData("risk_score", 0);
ZT.log("init: condition=" + key + " needsPicker=" + needsPicker);
