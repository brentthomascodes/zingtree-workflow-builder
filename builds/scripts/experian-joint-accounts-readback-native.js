// Source session: Experian joint accounts NATIVE read-back (Jul 2026, Brent)
// Account/customer: Experian (CVT credit report / credit_expert)
// Purpose: EVAL SCRIPT (runs on the node AFTER the native-select Content node).
//          The native select stores its choice as a first-class variable, so
//          read-back is one getVariableValue - no HTML, no loop. Sets the
//          routing booleans a downstream ROUTER node tests (house rule: route
//          on script-set booleans, never on raw form-field comparisons).
//
// INPUT (native select field name):
//   joint_account_choice - the chosen value ("na" for None; "" only if not required)
//
// OUTPUTS:
//   transforms.selected_joint_account   - the chosen account .value ("" when None)
//   has_selected_joint_accounts (bool)  - a real account was chosen
//   none_joint_accounts_apply   (bool)  - "None of these apply" was chosen
//
// ROUTING (Scoring/router node, NOT here):
//   none_joint_accounts_apply == true   -> "No joint value accounts apply here"
//   has_selected_joint_accounts == true -> proceed
//   (field is required:"1", so "nothing chosen" cannot occur; keep an empty
//    fallback button anyway as the structural else.)
// ---------------------------------------------------------------------------

let choice = String(ZT.getVariableValue("joint_account_choice", "")).trim();

let none_apply = (choice === "na");
let has_selected = (choice !== "" && !none_apply);

ZT.setTransformData("selected_joint_account", has_selected ? choice : "");
ZT.setFormData("has_selected_joint_accounts", has_selected);
ZT.setFormData("none_joint_accounts_apply", none_apply);

ZT.log("joint account native select: choice=" + choice + " none_apply=" + none_apply);
