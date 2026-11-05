// ETG Rebooking (single tree) - node 1 (root) "Start the rebooking session and clear the previous run"
// Transforms live for 1 hour, so a second interaction in the same hour would
// otherwise inherit the previous run's PNRs, buckets and counters.

["selected_pnrs", "selected_pnrs_customer_action", "selected_pnrs_final", "grouped_pnrs",
 "current_pnr", "current_pnr_bucket", "current_pnr_in_bucket", "child_ticket"]
  .forEach(name => ZT.setTransformData(name, []));

["pnr_index", "grouped_count", "current_pnr_bucket_index"]
  .forEach(name => ZT.setTransformData(name, 0));

["internal_note_details", "notice_html", "step_html", "outcome_html", "bucket_html",
 "finalise_html", "customer_action_table_html", "pnr_details_banner", "pnr_banner"]
  .forEach(name => ZT.setTransformData(name, ""));

ZT.setFormData("step", "");
ZT.setFormData("zd_ticket_id", ZT.getVariableValue("zd_ticket_id", ""));
ZT.setFormData("genesys_interaction_id",
  ZT.getVariableValue("custom_field_30866832265234", "N/A"));
