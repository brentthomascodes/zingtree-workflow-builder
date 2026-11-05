// ETG Rebooking (single tree) - node 8 "Work out the next question or outcome for this PNR"
//
// THIS IS THE ONLY PLACE THE REBOOKING BUSINESS LOGIC LIVES.
// It replaces the GDS (45), LCC (24) and Portals (67) decision trees plus the
// four outcome-text trees (2a/2b/4a/4b) - 163 nodes of button expressions.
//
// HOW TO EDIT IT (read this before changing anything):
//   * Add / remove a portal            -> edit PORTALS
//   * Add / remove a dropdown option   -> edit OPTIONS
//   * Change what a screen asks for    -> edit that step's "fields" array
//   * Change what a screen says        -> edit that step's "guidance"
//   * Change where an answer leads     -> add or reorder a row in that step's "next"
//   * Change an outcome's wording      -> edit OUTCOMES / ESCALATE_TEXT / REFER_TEXT
//   Rules are FIRST MATCH WINS, top to bottom - same as the button order in the
//   old Scoring nodes. Keys in "when" are ANDed; the array of values is ORed.
//
// Inputs:  transforms.current_pnr, views.findorder (passenger selection),
//          form vars listed in FIELDS, isShowFlexibleTicket / isSpecialCarrier /
//          isWenrix / cc2c / actions.findorder.hasChargeback
// Outputs: step, step_is_final (form) - drive node 9's router
//          need_<field> = "yes"|"no" (form) - drive node 10's conditional fields
//          <field>_options (transform) - drive node 10's dynamic selects
//          step_html, outcome_html, notice_html, pnr_details_banner (transform)
//          outcome, proceedHandling, new_flights (form) - consumed by node 13

const g = (name, fallback) => ZT.getVariableValue(name, fallback);

/* ------------------------------------------------------------------ *
 * 1. REFERENCE DATA                                                   *
 * ------------------------------------------------------------------ */

const PORTALS = {
  // Portals handled like a GDS (NDC screens)
  ndc: ["Amadeus NDC-X", "Farelogix/SPRK", "AgentconnectBiz (AF/KL)", "Turkish (TK)",
        "Latam (LA/JJ)", "Pegasus (PC)", "Agent 360 (SQ)", "TAP (TP)", "FAST (AY)",
        "Ajet (VF)", "Gulfairndc"],
  // Portals where void & rebook is supported
  void_ok: ["Amadeus NDC-X", "AgentconnectBiz (AF/KL)", "Latam (LA/JJ)", "Agent 360 (SQ)",
            "TAP (TP)", "FAST (AY)", "Farelogix/SPRK", "Pegasus (PC)", "Ajet (VF)", "Gulfairndc"],
  // NDC portals excluding Farelogix (Farelogix always has its own rule first)
  ndc_no_farelogix: ["Amadeus NDC-X", "AgentconnectBiz (AF/KL)", "Turkish (TK)", "Latam (LA/JJ)",
                     "Pegasus (PC)", "Agent 360 (SQ)", "TAP (TP)", "FAST (AY)", "Ajet (VF)", "Gulfairndc"],
  // NDC portals excluding AgentconnectBiz
  ndc_no_acb: ["Amadeus NDC-X", "Farelogix/SPRK", "Turkish (TK)", "Latam (LA/JJ)", "Pegasus (PC)",
               "Agent 360 (SQ)", "TAP (TP)", "FAST (AY)", "Ajet (VF)", "Gulfairndc"],
  lcc_like: ["AC Connex (AC)", "IAG (BA/IB)"],
  airline_site: ["Letsfly", "NOK Air", "myTUI"],
  support_only: ["FR24", "PKFARE"],
  consolid_escalate: ["2I", "VE", "9A", "4A", "AV"]
};

PORTALS.all = ["AC Connex (AC)", "Agent 360 (SQ)", "AgentconnectBiz (AF/KL)", "Ajet (VF)",
  "Amadeus NDC-X", "Consolid", "FAST (AY)", "FR24", "Farelogix/SPRK", "Gulfairndc",
  "IAG (BA/IB)", "Latam (LA/JJ)", "Letsfly", "NOK Air", "PKFARE", "Pegasus (PC)",
  "TAP (TP)", "Turkish (TK)", "myTUI"];

const OPTIONS = {
  ticket_status_gds: ["Open for use", "Checked-in", "Suspended", "Exchanged by airline",
                      "Refunded (NSR)", "Ticket not issued"],
  ticket_status_portal: ["Open for use", "Checked-in", "Suspended", "Exchanged by airline",
                         "Refunded (NSR)", "Not issued yet"],
  reason_gds: ["Void & Rebook", "Voluntary", "Force Majeure", "Schedule Change", "GDPR", "STG"],
  reason_lcc: ["Voluntary", "Force Majeure", "Schedule Change", "GDPR",
               "Against Self Transfer Guarantee (VI)"],
  reason_portal: ["Void & Rebook", "Voluntary", "Force Majeure", "Schedule Change", "GDPR",
                  "Against Self Transfer Guarantee"],
  fm_policy: ["FM policy is applicable", "FM policy is not applicable", "No FM policy available",
              "Schedule Change policy applicable"],
  fm_rebook: ["FM rebooking is permitted", "FM rebooking is not permitted",
              "Refer the customer to airline",
              "Contact with Supplier (only if stated in Edvin docs)"],
  calc_gds: ["ATC", "Manual rebooking", "Changes not permitted"],
  calc_portal: ["Price received in the portal", "No rebooking option available",
                "Need supplier contact"],
  calc_method_lcc: ["Rebooking", "New Ticket", "No Rebooking or New Ticket"],
  flex_alternative: ["GDS flight with a different carrier", "Refund the rebooking fee",
                     "Refund Air amount"],
  consolid: ["2I", "VE", "9A", "4A", "AV", "Other"]
};

// Every answer variable the engine owns. Node 6 clears them, node 13 harvests them.
const FIELDS = ["hasFlexibleTicket", "ticket_status", "rebooking_reason", "portal", "retrieve_pnr",
  "consolid_exceptions", "fm_policy", "fm_rebook", "changes_permitted", "cancel_checkin",
  "gdpr_waiver", "calculation_way", "calculation_method", "flex_alternative", "who_rebook",
  "reb_permitted", "man_rebooking", "new_flights", "system_command", "system_cost", "air_edvin",
  "cost_to_pax", "currency", "emd", "waiver", "fare_difference", "tax_difference",
  "yy_reb_penalty", "farebase"];

// Which fields use a script-staged option list (node 10's dynamic selects)
const DYNAMIC_OPTION_FIELDS = ["ticket_status", "rebooking_reason", "portal", "fm_policy",
  "fm_rebook", "calculation_way", "calculation_method", "flex_alternative", "consolid_exceptions"];

const ACTION = (title, body) =>
  '<div class="zt-content-block zt-cb-type-action"><div class="zt-cb-title"><h3>' + title +
  '</h3></div><div class="zt-cb-body">' + body + '</div></div>';
const ALERT = (title, body) =>
  '<div class="zt-content-block zt-cb-type-alert"><div class="zt-cb-title"><h3>' + title +
  '</h3></div><div class="zt-cb-body">' + body + '</div></div>';
const NOTE = (title, body) =>
  '<div class="zt-content-block zt-cb-type-note"><div class="zt-cb-title"><h3>' + title +
  '</h3></div><div class="zt-cb-body">' + body + '</div></div>';

const FLEX_NOTE = ALERT("Flexible ticket",
  "<p>The system detects if a Flexible Ticket is available. If it exists and has not been used, " +
  "you will be asked whether it applies based on the customer's request and the Flexible Ticket " +
  "terms and conditions. If there is no valid Flexible Ticket you will not see any related field.</p>");
const STG_NOTE = ALERT("Against Self-Transfer Guarantee",
  "<p>Select this only when the Self-Transfer Guarantee is applicable and the customer wants to " +
  "use it. For a voluntary rebooking on a VI order select \"Voluntary\".</p>");
const ATC_NOTE = ALERT("Always try ATC first",
  "<p>Use ATC first and double-check that the ATC price is guaranteed. If ATC is not working or " +
  "not guaranteed, check the fare rules and continue.</p>");
const VOID_NOTE = ALERT("VOID",
  "<p>Use the claimability feature to check whether void is permitted. Do NOT modify the order " +
  "in any case.</p>");
const CC2C_NOTE = ALERT("Attention - CC2C",
  "<p>The customer pays the full system price plus our fees (if any) because this is a CC2C " +
  "order. The original payment is unblocked or refunded once we void it.</p>");
const NO_PENALTY_NOTE = NOTE("Flexible Ticket",
  "<p>Do NOT charge the airline's rebooking penalty - the Flexible Ticket service covers it.</p>");
const PENALTY_NOTE = NOTE("Penalty", "<p>The airline's rebooking penalty is paid by the customer.</p>");

/* ------------------------------------------------------------------ *
 * 2. THE STEP GRAPH - the whole rebooking decision tree               *
 *    kind: "ask" (render fields) | "route" (decide silently)          *
 *          "notice" (explain, then re-ask) | "outcome" (done)         *
 * ------------------------------------------------------------------ */

const STEPS = {

  /* ---------------- GDS ---------------- */

  q_gds_entry: {
    kind: "ask",
    title: "Validate the ticket in the GDS",
    guidance: ACTION("Action", "<p>Go to the respective GDS and validate the flights and the " +
      "ticket status.</p>") + FLEX_NOTE + STG_NOTE,
    fields: ["hasFlexibleTicket", "ticket_status", "rebooking_reason"],
    options: { ticket_status: "ticket_status_gds", rebooking_reason: "reason_gds" },
    next: [
      { when: { ticket_status: ["Open for use"], rebooking_reason: ["Void & Rebook"] }, go: "r_gds_void" },
      { when: { hasFlexibleTicket: ["true"], ticket_status: ["Open for use"], rebooking_reason: ["Voluntary"] }, go: "q_calc_gds_flex" },
      { when: { hasFlexibleTicket: ["false"], ticket_status: ["Open for use"], rebooking_reason: ["Voluntary"] }, go: "q_calc_gds_noflex" },
      { when: { ticket_status: ["Open for use", "Checked-in", "Suspended", "Refunded (NSR)"], rebooking_reason: ["Force Majeure"] }, go: "q_fm_policy_gds" },
      { when: { ticket_status: ["Open for use", "Checked-in", "Suspended", "Refunded (NSR)"], rebooking_reason: ["Schedule Change"] }, go: "out_transfer_sc" },
      { when: { ticket_status: ["Open for use", "Suspended", "Refunded (NSR)"], rebooking_reason: ["GDPR"] }, go: "q_gdpr_waiver_gds" },
      { when: { ticket_status: ["Checked-in"], rebooking_reason: ["Void & Rebook"] }, go: "q_cancel_checkin_gds" },
      { when: { ticket_status: ["Checked-in", "Suspended", "Refunded (NSR)"], rebooking_reason: ["Voluntary"] }, go: "q_fare_rules_gds" },
      { when: { hasFlexibleTicket: ["true"], ticket_status: ["Exchanged by airline"], rebooking_reason: ["Voluntary"] }, go: "cap_gds_new_ticket_flex" },
      { when: { ticket_status: ["Suspended", "Exchanged by airline", "Refunded (NSR)"], rebooking_reason: ["Void & Rebook"] }, go: "notice_void_not_possible" },
      { when: { hasFlexibleTicket: ["false"], ticket_status: ["Exchanged by airline"], rebooking_reason: ["Voluntary"] }, go: "out_refer_airline" },
      { when: { ticket_status: ["Exchanged by airline"], rebooking_reason: ["Force Majeure", "Schedule Change", "GDPR"] }, go: "out_refer_airline" },
      { when: { ticket_status: ["Checked-in"], rebooking_reason: ["GDPR"] }, go: "out_refer_airline" },
      { when: { ticket_status: ["Ticket not issued"] }, go: "r_gds_wenrix" },
      { when: { rebooking_reason: ["STG"] }, go: "out_transfer_sc" }
    ]
  },

  r_gds_void: {
    kind: "route",
    next: [
      { when: { cc2c: ["Yes"] }, go: "cap_gds_cc2c_void" },
      { when: { cc2c: ["No", ""] }, go: "cap_gds_void_rebook" }
    ]
  },

  r_gds_wenrix: {
    kind: "route",
    next: [
      { when: { isWenrix: ["Yes", "true"] }, go: "r_gds_cc2c_not_issued" },
      { when: {} , go: "out_wait_ticket" }
    ]
  },

  r_gds_cc2c_not_issued: {
    kind: "route",
    next: [
      { when: { has_chargeback: ["Yes"] }, go: "cap_gds_cc2c_before_issue" },
      { when: {} , go: "cap_gds_before_issue" }
    ]
  },

  q_calc_gds_flex: {
    kind: "ask",
    title: "Book the new flights and price them",
    guidance: "<p>Book the new flights and check the pricing.</p>" + ATC_NOTE,
    fields: ["calculation_way"],
    options: { calculation_way: "calc_gds" },
    next: [
      { when: { calculation_way: ["ATC"] }, go: "cap_gds_atc_flex" },
      { when: { calculation_way: ["Manual rebooking"] }, go: "q_manual_gds" },
      { when: { calculation_way: ["Changes not permitted"] }, go: "cap_gds_new_ticket_flex" }
    ]
  },

  q_calc_gds_noflex: {
    kind: "ask",
    title: "Book the new flights and price them",
    guidance: "<p>Book the new flights and check the pricing.</p>" + ATC_NOTE,
    fields: ["calculation_way"],
    options: { calculation_way: "calc_gds" },
    next: [
      { when: { calculation_way: ["ATC"] }, go: "cap_gds_atc_noflex" },
      { when: { calculation_way: ["Manual rebooking"] }, go: "q_manual_gds" },
      { when: { calculation_way: ["Changes not permitted"] }, go: "out_changes_not_permitted" }
    ]
  },

  q_manual_gds: {
    kind: "ask",
    title: "Are you trained on manual rebooking?",
    guidance: ACTION("Action", "<p>A manual calculation is needed. Confirm whether you are " +
      "trained to do it - if not, the case goes to Support.</p>"),
    fields: ["man_rebooking"],
    next: [
      { when: { man_rebooking: ["Yes"] }, go: "cap_gds_manual" },
      { when: { man_rebooking: ["No"] }, go: "out_escalate" }
    ]
  },

  q_fm_policy_gds: {
    kind: "ask",
    title: "Check the Force Majeure policy",
    guidance: ACTION("Action", "<p>Check Edvin docs for the FM policy.</p>"),
    fields: ["fm_policy"],
    options: { fm_policy: "fm_policy" },
    next: [
      { when: { fm_policy: ["Schedule Change policy applicable"] }, go: "out_transfer_sc" },
      { when: { ticket_status: ["Open for use"], fm_policy: ["FM policy is applicable"] }, go: "cap_gds_fm_rebook" },
      { when: { hasFlexibleTicket: ["true"], ticket_status: ["Open for use"], fm_policy: ["FM policy is not applicable"] }, go: "q_calc_gds_flex" },
      { when: { hasFlexibleTicket: ["false"], ticket_status: ["Open for use"], fm_policy: ["FM policy is not applicable"] }, go: "q_calc_gds_noflex" },
      { when: { ticket_status: ["Open for use"], fm_policy: ["No FM policy available"] }, go: "out_escalate" },
      { when: { ticket_status: ["Checked-in"], fm_policy: ["FM policy is applicable"] }, go: "q_cancel_checkin_gds" },
      { when: { ticket_status: ["Checked-in", "Suspended", "Refunded (NSR)"], fm_policy: ["FM policy is not applicable"] }, go: "q_fare_rules_gds" },
      { when: { ticket_status: ["Checked-in", "Suspended"], fm_policy: ["No FM policy available"] }, go: "out_refer_airline" },
      { when: { ticket_status: ["Refunded (NSR)"], fm_policy: ["FM policy is applicable"] }, go: "cap_gds_nsr_fm_new_ticket" },
      { when: { ticket_status: ["Refunded (NSR)"], fm_policy: ["No FM policy available"] }, go: "q_fare_rules_gds" },
      { when: { ticket_status: ["Suspended"], fm_policy: ["FM policy is applicable"] }, go: "out_escalate" }
    ]
  },

  q_fare_rules_gds: {
    kind: "ask",
    title: "Do the fare rules permit changes?",
    guidance: ACTION("Action", "<p>Read the fare rules to see whether changes are permitted.</p>"),
    fields: ["changes_permitted"],
    next: [
      { when: { ticket_status: ["Checked-in"], fm_policy: ["FM policy is not applicable"], changes_permitted: ["Yes"] }, go: "q_cancel_checkin_gds" },
      { when: { ticket_status: ["Suspended"], fm_policy: ["FM policy is not applicable"], changes_permitted: ["Yes"] }, go: "out_escalate" },
      { when: { ticket_status: ["Refunded (NSR)"], fm_policy: ["FM policy is not applicable", "No FM policy available"], changes_permitted: ["Yes"] }, go: "cap_gds_nsr_new_ticket" },
      { when: { ticket_status: ["Checked-in"], rebooking_reason: ["Voluntary"], changes_permitted: ["Yes"] }, go: "q_cancel_checkin_gds" },
      { when: { ticket_status: ["Suspended"], rebooking_reason: ["Voluntary"], changes_permitted: ["Yes"] }, go: "out_escalate" },
      { when: { ticket_status: ["Refunded (NSR)"], rebooking_reason: ["Voluntary"], changes_permitted: ["Yes"] }, go: "cap_gds_nsr_new_ticket" },
      { when: { ticket_status: ["Refunded (NSR)"], gdpr_waiver: ["No"], changes_permitted: ["Yes"] }, go: "cap_gds_nsr_new_ticket" },
      { when: { hasFlexibleTicket: ["true"], ticket_status: ["Checked-in", "Suspended"], changes_permitted: ["No"] }, go: "cap_gds_new_ticket_flex" },
      { when: { changes_permitted: ["No"] }, go: "out_changes_not_permitted" }
    ]
  },

  q_cancel_checkin_gds: {
    kind: "ask",
    title: "Could you cancel the check-in?",
    guidance: ACTION("Action", "<p>Go to the airline's website and try to cancel the check-in.</p>"),
    fields: ["cancel_checkin"],
    next: [
      { when: { cancel_checkin: ["No"] }, go: "out_refer_airline" },
      { when: { ticket_status: ["Checked-in"], fm_policy: ["FM policy is applicable"], cancel_checkin: ["Yes"] }, go: "cap_gds_fm_rebook" },
      { when: { hasFlexibleTicket: ["true"], ticket_status: ["Checked-in"], fm_policy: ["FM policy is not applicable"], cancel_checkin: ["Yes"] }, go: "q_calc_gds_flex" },
      { when: { hasFlexibleTicket: ["false"], ticket_status: ["Checked-in"], fm_policy: ["FM policy is not applicable"], cancel_checkin: ["Yes"] }, go: "q_calc_gds_noflex" },
      { when: { hasFlexibleTicket: ["true"], ticket_status: ["Checked-in"], rebooking_reason: ["Voluntary"], cancel_checkin: ["Yes"] }, go: "q_calc_gds_flex" },
      { when: { hasFlexibleTicket: ["false"], ticket_status: ["Checked-in"], rebooking_reason: ["Voluntary"], cancel_checkin: ["Yes"] }, go: "q_calc_gds_noflex" },
      { when: { ticket_status: ["Checked-in"], rebooking_reason: ["Void & Rebook"], cancel_checkin: ["Yes"], cc2c: ["Yes"] }, go: "cap_gds_cc2c_void" },
      { when: { ticket_status: ["Checked-in"], rebooking_reason: ["Void & Rebook"], cancel_checkin: ["Yes"] }, go: "cap_gds_void_rebook" }
    ]
  },

  q_gdpr_waiver_gds: {
    kind: "ask",
    title: "Is there a GDPR waiver?",
    guidance: ACTION("Action", "<p>Check the fare rules for a GDPR waiver.</p>"),
    fields: ["gdpr_waiver"],
    next: [
      { when: { ticket_status: ["Open for use", "Suspended"], gdpr_waiver: ["Yes"] }, go: "out_gdpr" },
      { when: { ticket_status: ["Open for use", "Suspended"], gdpr_waiver: ["No"] }, go: "out_refer_airline" },
      { when: { ticket_status: ["Refunded (NSR)"], gdpr_waiver: ["Yes"] }, go: "out_escalate" },
      { when: { ticket_status: ["Refunded (NSR)"], gdpr_waiver: ["No"] }, go: "q_fare_rules_gds" }
    ]
  },

  /* ---------------- LCC ---------------- */

  q_lcc_entry: {
    kind: "ask",
    title: "Check the airline's special handling",
    guidance: ACTION("Action", "<p>Check Edvin docs and Shelf for special handling.</p>") +
      FLEX_NOTE + STG_NOTE,
    fields: ["hasFlexibleTicket", "rebooking_reason"],
    options: { rebooking_reason: "reason_lcc" },
    next: [
      { when: { hasFlexibleTicket: ["true"], rebooking_reason: ["Voluntary"] }, go: "q_lcc_flex_method" },
      { when: { hasFlexibleTicket: ["false"], rebooking_reason: ["Voluntary"] }, go: "q_lcc_noflex" },
      { when: { rebooking_reason: ["Force Majeure"] }, go: "q_fm_rebook_lcc" },
      { when: { hasFlexibleTicket: ["false"], rebooking_reason: ["GDPR"], isSpecialCarrier: ["true"] }, go: "notice_lcc_dy_gdpr" },
      { when: { rebooking_reason: ["GDPR"] }, go: "out_refer_airline" },
      { when: { rebooking_reason: ["Schedule Change", "Against Self Transfer Guarantee (VI)"] }, go: "out_transfer_sc" }
    ]
  },

  q_lcc_flex_method: {
    kind: "ask",
    title: "How will the rebooking be calculated?",
    guidance: ACTION("Action", "<p>Follow the routines in Edvin docs and/or Shelf to calculate " +
      "the rebooking for this airline.</p>"),
    fields: ["calculation_method"],
    options: { calculation_method: "calc_method_lcc" },
    next: [
      { when: { calculation_method: ["Rebooking", "New Ticket"] }, go: "cap_lcc_new_ticket_flex" },
      { when: { calculation_method: ["No Rebooking or New Ticket"] }, go: "q_flex_alt" }
    ]
  },

  q_lcc_noflex: {
    kind: "ask",
    title: "Who will do the rebooking?",
    guidance: ACTION("Action", "<p>Confirm whether ETG can rebook, and whether the airline " +
      "permits it.</p>"),
    fields: ["who_rebook", "reb_permitted"],
    next: [
      { when: { who_rebook: ["Customer"] }, go: "out_refer_airline" },
      { when: { reb_permitted: ["No"] }, go: "out_refer_airline" },
      { when: { reb_permitted: ["Yes"] }, go: "cap_lcc_new_ticket_noflex" }
    ]
  },

  q_fm_rebook_lcc: {
    kind: "ask",
    title: "How should we rebook for Force Majeure?",
    guidance: ACTION("Action", "<p>Check the Force Majeure policy in Edvin docs.</p>"),
    fields: ["fm_rebook"],
    options: { fm_rebook: "fm_rebook" },
    next: [
      { when: { fm_rebook: ["FM rebooking is permitted"] }, go: "cap_lcc_fm_rebook" },
      { when: { fm_rebook: ["FM rebooking is not permitted"], hasFlexibleTicket: ["true"] }, go: "q_lcc_flex_method" },
      { when: { fm_rebook: ["FM rebooking is not permitted"], hasFlexibleTicket: ["false"] }, go: "q_lcc_noflex" },
      { when: { fm_rebook: ["Refer the customer to airline"], isSpecialCarrier: ["true"] }, go: "notice_special_carrier" },
      { when: { fm_rebook: ["Refer the customer to airline"] }, go: "out_refer_airline" },
      { when: { fm_rebook: ["Contact with Supplier (only if stated in Edvin docs)"], post_sale_type: ["EXCEPTION_LCC"] }, go: "notice_special_carrier" },
      { when: { fm_rebook: ["Contact with Supplier (only if stated in Edvin docs)"] }, go: "out_escalate" },
      { when: { isSpecialCarrier: ["true"] }, go: "notice_special_carrier" }
    ]
  },

  q_flex_alt: {
    kind: "ask",
    title: "Which Flexible Ticket alternative applies?",
    guidance: ACTION("Action",
      "<ol><li>Check whether a GDS flight can be offered instead. If not, see option 2.</li>" +
      "<li>Check Edvin documents for the airline's rebooking fee. If it is listed, send it for " +
      "refund. If not, see option 3.</li>" +
      "<li>Refund the Air amount from Edvin.</li></ol>"),
    fields: ["flex_alternative"],
    options: { flex_alternative: "flex_alternative" },
    next: [
      { when: { flex_alternative: ["GDS flight with a different carrier"], channel: ["lcc"] }, go: "cap_lcc_new_ticket_flex" },
      { when: { flex_alternative: ["GDS flight with a different carrier"] }, go: "cap_gds_new_ticket_portal" },
      { when: { flex_alternative: ["Refund the rebooking fee", "Refund Air amount"] }, go: "out_refund_flex" }
    ]
  },

  /* ---------------- External portals ---------------- */

  q_portal_entry: {
    kind: "ask",
    title: "Which portal is the booking in?",
    guidance: ACTION("Steps",
      "<p>1. Select the portal.<br>2. Check Shelf for that portal's guidelines.</p>") + FLEX_NOTE,
    fields: ["portal", "hasFlexibleTicket"],
    options: { portal: "portals_all" },
    next: [
      { when: { portal_group: ["ndc"] }, go: "q_portal_gdslike" },
      { when: { portal_group: ["lcc_like"] }, go: "q_portal_lcclike" },
      { when: { portal_group: ["airline_site"] }, go: "q_lcc_entry" },
      { when: { portal_group: ["support_only"] }, go: "out_escalate" },
      { when: { portal: ["Consolid"] }, go: "q_consolid" }
    ]
  },

  q_consolid: {
    kind: "ask",
    title: "Which Consolid carrier is it?",
    guidance: ALERT("Consolid restricted carriers",
      "<p>Consolid prohibits referring the customer directly and rebooking on the airline's own " +
      "site for 2I, VE, 9A, 4A and AV. Raise a request to the Consolid portal for those carriers." +
      "</p>"),
    fields: ["consolid_exceptions"],
    options: { consolid_exceptions: "consolid" },
    next: [
      { when: { consolid_exceptions: ["2I", "VE", "9A", "4A", "AV"] }, go: "out_escalate" },
      { when: { consolid_exceptions: ["Other"] }, go: "q_lcc_entry" }
    ]
  },

  q_portal_gdslike: {
    kind: "ask",
    title: "Check the ticket status in the portal",
    guidance: ACTION("Steps", "<p>1. Check the ticket status in the portal.<br>2. Check Shelf " +
      "for that portal's guidelines.</p>") + STG_NOTE,
    fields: ["ticket_status", "rebooking_reason"],
    options: { ticket_status: "ticket_status_portal", rebooking_reason: "reason_portal" },
    next: [
      { when: { rebooking_reason: ["Against Self Transfer Guarantee"] }, go: "out_transfer_sc" },
      { when: { ticket_status: ["Open for use"], rebooking_reason: ["Void & Rebook"], portal_void_ok: ["yes"], cc2c: ["Yes"] }, go: "cap_ndc_cc2c_void" },
      { when: { ticket_status: ["Open for use"], rebooking_reason: ["Void & Rebook"], portal_void_ok: ["yes"] }, go: "cap_ndc_void_rebook" },
      { when: { ticket_status: ["Open for use"], rebooking_reason: ["Voluntary"], portal: ["Farelogix/SPRK"] }, go: "q_calc_farelogix" },
      { when: { ticket_status: ["Open for use"], rebooking_reason: ["Voluntary"] }, go: "q_calc_portal" },
      { when: { ticket_status: ["Open for use", "Checked-in", "Suspended"], rebooking_reason: ["Force Majeure"] }, go: "q_fm_policy_ndc" },
      { when: { ticket_status: ["Open for use", "Suspended"], rebooking_reason: ["Schedule Change"] }, go: "out_transfer_sc" },
      { when: { ticket_status: ["Open for use", "Suspended"], rebooking_reason: ["GDPR"] }, go: "q_gdpr_waiver_ndc" },
      { when: { ticket_status: ["Exchanged by airline", "Suspended"], rebooking_reason: ["Void & Rebook"] }, go: "notice_void_not_possible" },
      { when: { hasFlexibleTicket: ["true"], ticket_status: ["Exchanged by airline"], rebooking_reason: ["Voluntary"], portal: ["AgentconnectBiz (AF/KL)"] }, go: "q_flex_alt" },
      { when: { hasFlexibleTicket: ["true"], ticket_status: ["Exchanged by airline"], rebooking_reason: ["Voluntary"] }, go: "cap_ndc_new_ticket_flex" },
      { when: { hasFlexibleTicket: ["false"], ticket_status: ["Exchanged by airline"], rebooking_reason: ["Voluntary"] }, go: "out_refer_airline" },
      { when: { ticket_status: ["Exchanged by airline"], rebooking_reason: ["Force Majeure", "Schedule Change", "GDPR"] }, go: "out_refer_airline" },
      { when: { ticket_status: ["Suspended", "Checked-in"], rebooking_reason: ["Voluntary"] }, go: "q_fare_rules_ndc" },
      { when: { ticket_status: ["Open for use", "Checked-in"], rebooking_reason: ["Void & Rebook"], portal: ["Turkish (TK)"] }, go: "notice_void_not_permitted_tk" },
      { when: { ticket_status: ["Checked-in"], rebooking_reason: ["Void & Rebook"], portal_void_ok: ["yes"] }, go: "q_cancel_checkin_ndc" },
      { when: { ticket_status: ["Checked-in"], rebooking_reason: ["Schedule Change", "GDPR"] }, go: "out_refer_airline" },
      { when: { ticket_status: ["Not issued yet"] }, go: "out_not_issued_yet" },
      { when: { ticket_status: ["Refunded (NSR)"], portal: ["Farelogix/SPRK"], rebooking_reason: ["Force Majeure"] }, go: "q_fm_policy_ndc" },
      { when: { ticket_status: ["Refunded (NSR)"], portal: ["Farelogix/SPRK"], rebooking_reason: ["Schedule Change"] }, go: "out_transfer_sc" },
      { when: { ticket_status: ["Refunded (NSR)"], portal: ["Farelogix/SPRK"], rebooking_reason: ["GDPR"] }, go: "q_gdpr_waiver_ndc" },
      { when: { ticket_status: ["Refunded (NSR)"], portal: ["Farelogix/SPRK"], rebooking_reason: ["Void & Rebook"] }, go: "notice_void_not_possible" },
      { when: { ticket_status: ["Refunded (NSR)"], portal: ["Farelogix/SPRK"], rebooking_reason: ["Voluntary"] }, go: "q_fare_rules_ndc" },
      { when: { ticket_status: ["Refunded (NSR)"] }, go: "notice_nsr_not_supported" }
    ]
  },

  q_portal_lcclike: {
    kind: "ask",
    title: "Can you retrieve the PNR in the portal?",
    guidance: ACTION("Steps", "<p>Check Shelf for that portal's guidelines.</p>") + STG_NOTE,
    fields: ["retrieve_pnr", "rebooking_reason"],
    options: { rebooking_reason: "reason_portal" },
    next: [
      { when: { rebooking_reason: ["Schedule Change", "Against Self Transfer Guarantee"] }, go: "out_transfer_sc" },
      { when: { retrieve_pnr: ["No"] }, go: "out_escalate" },
      { when: { retrieve_pnr: ["Yes"], rebooking_reason: ["Void & Rebook"] }, go: "cap_ndc_void_rebook" },
      { when: { retrieve_pnr: ["Yes"], rebooking_reason: ["Voluntary"] }, go: "q_portal_changes" },
      { when: { retrieve_pnr: ["Yes"], rebooking_reason: ["Force Majeure"] }, go: "q_fm_policy_lcclike" },
      { when: { retrieve_pnr: ["Yes"], rebooking_reason: ["GDPR"] }, go: "q_gdpr_waiver_lcclike" }
    ]
  },

  q_calc_farelogix: {
    kind: "ask",
    title: "How did the Farelogix pricing go?",
    guidance: ALERT("Attention", "<p>Always use ATC first. If ATC is not available, check the " +
      "fare rules to see whether changes are permitted.</p>"),
    fields: ["calculation_way"],
    options: { calculation_way: "calc_gds" },
    next: [
      { when: { calculation_way: ["ATC"], hasFlexibleTicket: ["true"] }, go: "cap_portal_atc_flex" },
      { when: { calculation_way: ["ATC"] }, go: "cap_portal_atc_noflex" },
      { when: { calculation_way: ["Changes not permitted"], hasFlexibleTicket: ["true"] }, go: "cap_ndc_new_ticket_flex" },
      { when: { calculation_way: ["Changes not permitted"] }, go: "out_changes_not_permitted" },
      { when: { calculation_way: ["Manual rebooking"] }, go: "q_manual_portal" }
    ]
  },

  q_calc_portal: {
    kind: "ask",
    title: "Did the portal give a rebooking quote?",
    guidance: ACTION("Action", "<p>Log in to the portal and check for rebooking. For some " +
      "carriers, if rebooking is not permitted the option will not appear in the portal.</p>"),
    fields: ["calculation_way"],
    options: { calculation_way: "calc_portal" },
    next: [
      { when: { calculation_way: ["No rebooking option available"], hasFlexibleTicket: ["true"], portal: ["AgentconnectBiz (AF/KL)"] }, go: "q_flex_alt" },
      { when: { calculation_way: ["No rebooking option available"], hasFlexibleTicket: ["true"] }, go: "cap_ndc_new_ticket_flex" },
      { when: { calculation_way: ["No rebooking option available"] }, go: "out_changes_not_permitted" },
      { when: { calculation_way: ["Price received in the portal"], hasFlexibleTicket: ["true"] }, go: "cap_portal_atc_flex" },
      { when: { calculation_way: ["Price received in the portal"] }, go: "cap_portal_atc_noflex" },
      { when: { calculation_way: ["Need supplier contact"] }, go: "out_escalate" }
    ]
  },

  q_manual_portal: {
    kind: "ask",
    title: "Are you trained on manual rebooking?",
    guidance: ACTION("Action", "<p>A manual calculation is needed. Confirm whether you are " +
      "trained to do it - if not, the case goes to Support.</p>"),
    fields: ["man_rebooking"],
    next: [
      { when: { man_rebooking: ["Yes"] }, go: "cap_farelogix_manual" },
      { when: { man_rebooking: ["No"] }, go: "out_escalate" }
    ]
  },

  q_fm_policy_ndc: {
    kind: "ask",
    title: "Check the Force Majeure policy",
    guidance: ACTION("Action", "<p>Check Edvin docs for the FM policy.</p>"),
    fields: ["fm_policy"],
    options: { fm_policy: "fm_policy" },
    next: [
      { when: { fm_policy: ["Schedule Change policy applicable"] }, go: "out_transfer_sc" },
      { when: { ticket_status: ["Open for use"], fm_policy: ["FM policy is applicable"] }, go: "cap_portal_fm_rebook" },
      { when: { ticket_status: ["Open for use"], fm_policy: ["FM policy is not applicable"], portal: ["Farelogix/SPRK"] }, go: "q_calc_farelogix" },
      { when: { ticket_status: ["Open for use"], fm_policy: ["FM policy is not applicable"] }, go: "q_calc_portal" },
      { when: { ticket_status: ["Open for use"], fm_policy: ["No FM policy available"] }, go: "out_escalate" },
      { when: { ticket_status: ["Checked-in"], fm_policy: ["FM policy is applicable"] }, go: "q_cancel_checkin_ndc" },
      { when: { ticket_status: ["Checked-in", "Suspended", "Refunded (NSR)"], fm_policy: ["FM policy is not applicable"] }, go: "q_fare_rules_ndc" },
      { when: { ticket_status: ["Checked-in", "Suspended"], fm_policy: ["No FM policy available"] }, go: "out_refer_airline" },
      { when: { ticket_status: ["Refunded (NSR)"], fm_policy: ["FM policy is applicable"], portal: ["AgentconnectBiz (AF/KL)"] }, go: "cap_nsr_fm_gds" },
      { when: { ticket_status: ["Refunded (NSR)"], fm_policy: ["FM policy is applicable"] }, go: "cap_nsr_fm_ndc" },
      { when: { ticket_status: ["Refunded (NSR)"], fm_policy: ["No FM policy available"] }, go: "q_fare_rules_ndc" },
      { when: { ticket_status: ["Suspended"], fm_policy: ["FM policy is applicable"] }, go: "out_escalate" }
    ]
  },

  q_fm_policy_lcclike: {
    kind: "ask",
    title: "Check the Force Majeure policy",
    guidance: ACTION("Action", "<p>Check the FM policy in Edvin docs.</p>"),
    fields: ["fm_policy"],
    options: { fm_policy: "fm_policy" },
    next: [
      { when: { fm_policy: ["FM policy is applicable"] }, go: "cap_portal_fm_rebook" },
      { when: { fm_policy: ["FM policy is not applicable"] }, go: "q_portal_changes" },
      { when: { fm_policy: ["No FM policy available"] }, go: "out_escalate" },
      { when: { fm_policy: ["Schedule Change policy applicable"] }, go: "out_transfer_sc" }
    ]
  },

  q_fare_rules_ndc: {
    kind: "ask",
    title: "Do the fare rules permit changes?",
    guidance: ACTION("Action", "<p>Check the fare rules of the ticket to see whether changes are " +
      "permitted.</p>") + NOTE("Note", "<p>If you cannot retrieve the booking in the portal, " +
      "you may look the fare rules up in the GDS.</p>"),
    fields: ["changes_permitted"],
    next: [
      { when: { hasFlexibleTicket: ["true"], ticket_status: ["Checked-in"], changes_permitted: ["No"], portal: ["AgentconnectBiz (AF/KL)"] }, go: "q_flex_alt" },
      { when: { hasFlexibleTicket: ["true"], ticket_status: ["Checked-in"], changes_permitted: ["No"] }, go: "cap_ndc_new_ticket_flex" },
      { when: { changes_permitted: ["No"] }, go: "out_changes_not_permitted" },
      { when: { ticket_status: ["Checked-in"], changes_permitted: ["Yes"] }, go: "q_cancel_checkin_ndc" },
      { when: { ticket_status: ["Suspended"], changes_permitted: ["Yes"] }, go: "out_escalate" },
      { when: { ticket_status: ["Refunded (NSR)"], portal: ["Farelogix/SPRK"], rebooking_reason: ["Voluntary"], changes_permitted: ["Yes"] }, go: "cap_nsr_new_ticket" },
      { when: { ticket_status: ["Refunded (NSR)"], fm_policy: ["FM policy is not applicable"], portal: ["Farelogix/SPRK"], changes_permitted: ["Yes"] }, go: "cap_nsr_new_ticket" },
      { when: { ticket_status: ["Refunded (NSR)"], fm_policy: ["No FM policy available"], changes_permitted: ["Yes"] }, go: "cap_nsr_new_ticket" },
      { when: { ticket_status: ["Refunded (NSR)"], gdpr_waiver: ["No"], changes_permitted: ["Yes"] }, go: "cap_nsr_new_ticket" }
    ]
  },

  q_portal_changes: {
    kind: "ask",
    title: "Can you make changes inside the portal?",
    guidance: ACTION("Action", "<p>Check whether you can make changes within the portal.</p>"),
    fields: ["changes_permitted"],
    next: [
      { when: { hasFlexibleTicket: ["true"], changes_permitted: ["Yes"] }, go: "cap_portal_atc_flex" },
      { when: { hasFlexibleTicket: ["false"], changes_permitted: ["Yes"] }, go: "cap_portal_atc_noflex" },
      { when: { hasFlexibleTicket: ["true"], changes_permitted: ["No"] }, go: "cap_portal_flex_new_ticket" },
      { when: { hasFlexibleTicket: ["false"], changes_permitted: ["No"] }, go: "out_changes_not_permitted" }
    ]
  },

  q_cancel_checkin_ndc: {
    kind: "ask",
    title: "Could you cancel the check-in?",
    guidance: ACTION("Action", "<p>Go to the airline's website and try to cancel the check-in.</p>"),
    fields: ["cancel_checkin"],
    next: [
      { when: { cancel_checkin: ["No"] }, go: "out_refer_airline" },
      { when: { rebooking_reason: ["Void & Rebook"], cancel_checkin: ["Yes"], portal_void_ok: ["yes"], cc2c: ["Yes"] }, go: "cap_ndc_cc2c_void" },
      { when: { rebooking_reason: ["Void & Rebook"], cancel_checkin: ["Yes"], portal_void_ok: ["yes"] }, go: "cap_ndc_void_rebook" },
      { when: { fm_policy: ["FM policy is applicable"], cancel_checkin: ["Yes"] }, go: "cap_portal_fm_rebook" },
      { when: { cancel_checkin: ["Yes"], portal: ["Farelogix/SPRK"] }, go: "q_calc_farelogix" },
      { when: { cancel_checkin: ["Yes"] }, go: "q_calc_portal" }
    ]
  },

  q_gdpr_waiver_ndc: {
    kind: "ask",
    title: "Is there a GDPR waiver?",
    guidance: ACTION("Action", "<p>Check the fare rules, Shelf and Edvin docs for a GDPR " +
      "waiver.</p>"),
    fields: ["gdpr_waiver"],
    next: [
      { when: { ticket_status: ["Open for use"], gdpr_waiver: ["Yes"] }, go: "out_gdpr" },
      { when: { ticket_status: ["Suspended", "Refunded (NSR)"], gdpr_waiver: ["Yes"] }, go: "out_escalate" },
      { when: { ticket_status: ["Open for use", "Suspended"], gdpr_waiver: ["No"] }, go: "out_refer_airline" },
      { when: { ticket_status: ["Refunded (NSR)"], gdpr_waiver: ["No"] }, go: "q_fare_rules_ndc" }
    ]
  },

  q_gdpr_waiver_lcclike: {
    kind: "ask",
    title: "Is there a GDPR waiver?",
    guidance: ACTION("Check the airline's GDPR waiver policy",
      "<p>Search the fare rules, Edvin documents and the Shelf page for the portal.</p>"),
    fields: ["gdpr_waiver"],
    next: [
      { when: { gdpr_waiver: ["Yes"] }, go: "out_gdpr" },
      { when: { gdpr_waiver: ["No"] }, go: "q_portal_changes" }
    ]
  },

  /* ---------------- Data capture screens ---------------- *
   * Each one lists the fields the agent must fill in. All of them lead to
   * "take payment", which is what every capture screen did in the old trees. */

  cap_gds_void_rebook: {
    kind: "ask", title: "Void and rebook - enter the new booking",
    guidance: ACTION("Steps", "<p>1. Make sure the ticket is within the void window.<br>" +
      "2. Create a new PNR with the new flights and calculate the cost.</p>") + VOID_NOTE,
    fields: ["new_flights", "system_command", "system_cost", "air_edvin", "cost_to_pax", "currency"],
    next: [{ when: {}, go: "out_take_payment" }]
  },
  cap_gds_cc2c_void: {
    kind: "ask", title: "CC2C void and rebook - enter the new booking",
    guidance: ACTION("Steps", "<p>1. Make sure the ticket is within the void window.<br>" +
      "2. Create a new PNR with the new flights and calculate the cost.</p>") + VOID_NOTE + CC2C_NOTE,
    fields: ["new_flights", "system_command", "system_cost", "cost_to_pax", "currency"],
    next: [{ when: {}, go: "out_take_payment" }]
  },
  cap_gds_before_issue: {
    kind: "ask", title: "Rebook before ticket issuance - enter the new booking",
    guidance: ACTION("Action", "<p>Create a new PNR in the GDS with the new flights and " +
      "calculate the cost.</p>"),
    fields: ["new_flights", "system_command", "system_cost", "air_edvin", "cost_to_pax", "currency"],
    next: [{ when: {}, go: "out_take_payment" }]
  },
  cap_gds_cc2c_before_issue: {
    kind: "ask", title: "CC2C rebook before ticket issuance - enter the new booking",
    guidance: ACTION("Action", "<p>Create a new PNR in the GDS with the new flights and " +
      "calculate the cost.</p>") + CC2C_NOTE,
    fields: ["new_flights", "system_command", "system_cost", "cost_to_pax", "currency"],
    next: [{ when: {}, go: "out_take_payment" }]
  },
  cap_gds_atc_flex: {
    kind: "ask", title: "ATC pricing with Flexible Ticket - enter the new booking",
    guidance: NO_PENALTY_NOTE,
    fields: ["new_flights", "system_command", "system_cost", "cost_to_pax", "emd", "currency"],
    next: [{ when: {}, go: "out_take_payment" }]
  },
  cap_gds_atc_noflex: {
    kind: "ask", title: "ATC pricing - enter the new booking",
    guidance: PENALTY_NOTE,
    fields: ["new_flights", "system_command", "system_cost", "cost_to_pax", "emd", "currency"],
    next: [{ when: {}, go: "out_take_payment" }]
  },
  cap_gds_manual: {
    kind: "ask", title: "Manual calculation - enter the pricing breakdown",
    guidance: ACTION("Action", "<p>Enter the manual rebooking calculation.</p>"),
    fields: ["new_flights", "system_command", "yy_reb_penalty", "fare_difference",
             "tax_difference", "farebase", "cost_to_pax", "emd", "currency"],
    next: [{ when: {}, go: "out_take_payment" }]
  },
  cap_gds_new_ticket_flex: {
    kind: "ask", title: "New ticket due to Flexible Ticket - enter the new booking",
    guidance: NO_PENALTY_NOTE,
    fields: ["new_flights", "system_command", "system_cost", "cost_to_pax", "emd", "currency"],
    next: [{ when: {}, go: "out_take_payment" }]
  },
  cap_gds_new_ticket_portal: {
    kind: "ask", title: "New GDS ticket with a different carrier - enter the new booking",
    guidance: NOTE("Note", "<p>A new ticket bought against the Flexible Ticket service must be " +
      "issued in the GDS with a different carrier.</p>"),
    fields: ["new_flights", "system_command", "system_cost", "cost_to_pax", "emd", "currency"],
    next: [{ when: {}, go: "out_take_payment" }]
  },
  cap_gds_fm_rebook: {
    kind: "ask", title: "Force Majeure rebooking - enter the pricing",
    guidance: ACTION("Action", "<p>Calculate the rebooking according to the Force Majeure " +
      "policy.</p>"),
    fields: ["new_flights", "fare_difference", "tax_difference", "cost_to_pax", "waiver", "currency"],
    next: [{ when: {}, go: "out_take_payment" }]
  },
  cap_gds_nsr_new_ticket: {
    kind: "ask", title: "NSR new ticket - enter the new booking",
    guidance: ACTION("Create a new ticket and calculate the cost",
      "<p>Also charge the customer the rebooking penalty of the original ticket.</p>"),
    fields: ["new_flights", "system_command", "system_cost", "cost_to_pax", "emd", "currency"],
    next: [{ when: {}, go: "out_take_payment" }]
  },
  cap_gds_nsr_fm_new_ticket: {
    kind: "ask", title: "NSR Force Majeure new ticket - enter the new booking",
    guidance: ACTION("Action", "<p>Create a new ticket and calculate the cost according to the " +
      "FM policy.</p>"),
    fields: ["new_flights", "system_command", "system_cost", "cost_to_pax", "waiver", "emd", "currency"],
    next: [{ when: {}, go: "out_take_payment" }]
  },
  cap_lcc_new_ticket_flex: {
    kind: "ask", title: "New ticket with Flexible Ticket - enter the new booking",
    guidance: ACTION("Action", "<p>Proceed with a new ticket calculation.</p>"),
    fields: ["new_flights", "system_cost", "air_edvin", "cost_to_pax", "currency"],
    next: [{ when: {}, go: "out_take_payment" }]
  },
  cap_lcc_new_ticket_noflex: {
    kind: "ask", title: "New ticket - enter the new booking",
    guidance: ACTION("Action", "<p>Proceed with a new ticket calculation.</p>"),
    fields: ["new_flights", "system_cost", "cost_to_pax", "currency"],
    next: [{ when: {}, go: "out_take_payment" }]
  },
  cap_lcc_fm_rebook: {
    kind: "ask", title: "Force Majeure rebooking - enter the pricing",
    guidance: ACTION("Action", "<p>Calculate the Force Majeure rebooking for this airline.</p>"),
    fields: ["new_flights", "cost_to_pax", "currency"],
    next: [{ when: {}, go: "out_take_payment" }]
  },
  cap_ndc_void_rebook: {
    kind: "ask", title: "Void and rebook in the portal - enter the new booking",
    guidance: ACTION("Steps", "<p>1. Make sure the ticket is not issued and/or is within the " +
      "void window.<br>2. Create a new PNR with the new flights and calculate the cost.</p>") +
      ALERT("VOID", "<p>If the ticket has already been issued, use the claimability feature to " +
      "check whether void is permitted. Do NOT modify the order in any case.</p>"),
    fields: ["new_flights", "system_cost", "air_edvin", "cost_to_pax", "currency"],
    next: [{ when: {}, go: "out_take_payment" }]
  },
  cap_ndc_cc2c_void: {
    kind: "ask", title: "CC2C void and rebook in the portal - enter the new booking",
    guidance: ACTION("Steps", "<p>1. Make sure the ticket is within the void window.<br>" +
      "2. Create a new PNR with the new flights and calculate the cost.</p>") + VOID_NOTE + CC2C_NOTE,
    fields: ["new_flights", "system_cost", "cost_to_pax", "currency"],
    next: [{ when: {}, go: "out_take_payment" }]
  },
  cap_ndc_new_ticket_flex: {
    kind: "ask", title: "New booking due to Flexible Ticket - enter the new booking",
    guidance: ACTION("Action", "<p>Create a new booking due to the Flexible Ticket.</p>") +
      NO_PENALTY_NOTE,
    fields: ["new_flights", "system_cost", "cost_to_pax", "emd", "currency"],
    next: [{ when: {}, go: "out_take_payment" }]
  },
  cap_portal_atc_flex: {
    kind: "ask", title: "Portal pricing with Flexible Ticket - enter the new booking",
    guidance: NO_PENALTY_NOTE,
    fields: ["new_flights", "system_cost", "cost_to_pax", "emd", "currency"],
    next: [{ when: {}, go: "out_take_payment" }]
  },
  cap_portal_atc_noflex: {
    kind: "ask", title: "Portal pricing - enter the new booking",
    guidance: PENALTY_NOTE,
    fields: ["new_flights", "system_cost", "cost_to_pax", "emd", "currency"],
    next: [{ when: {}, go: "out_take_payment" }]
  },
  cap_portal_flex_new_ticket: {
    kind: "ask", title: "New ticket due to Flexible Ticket - enter the new booking",
    guidance: ACTION("Action", "<p>Create a new booking due to the Flexible Ticket.</p>"),
    fields: ["new_flights", "system_cost", "cost_to_pax", "emd", "currency"],
    next: [{ when: {}, go: "out_take_payment" }]
  },
  cap_farelogix_manual: {
    kind: "ask", title: "Manual calculation - enter the pricing breakdown",
    guidance: NO_PENALTY_NOTE,
    fields: ["new_flights", "yy_reb_penalty", "fare_difference", "tax_difference",
             "cost_to_pax", "emd", "currency"],
    next: [{ when: {}, go: "out_take_payment" }]
  },
  cap_portal_fm_rebook: {
    kind: "ask", title: "Force Majeure rebooking - enter the pricing",
    guidance: ACTION("Action", "<p>Calculate the Force Majeure rebooking according to the " +
      "airline's guidelines.</p>"),
    fields: ["new_flights", "fare_difference", "tax_difference", "cost_to_pax", "waiver", "currency"],
    next: [{ when: {}, go: "out_take_payment" }]
  },
  cap_nsr_fm_ndc: {
    kind: "ask", title: "NSR Force Majeure new ticket - enter the new booking",
    guidance: ACTION("Action", "<p>Create a new ticket and calculate the cost according to the " +
      "FM policy.</p>"),
    fields: ["new_flights", "system_cost", "cost_to_pax", "waiver", "emd", "currency"],
    next: [{ when: {}, go: "out_take_payment" }]
  },
  cap_nsr_fm_gds: {
    kind: "ask", title: "NSR Force Majeure new GDS ticket - enter the new booking",
    guidance: ACTION("Action", "<p>Create a new ticket and calculate the cost according to the " +
      "FM policy.</p>"),
    fields: ["new_flights", "system_command", "system_cost", "cost_to_pax", "waiver", "emd", "currency"],
    next: [{ when: {}, go: "out_take_payment" }]
  },
  cap_nsr_new_ticket: {
    kind: "ask", title: "NSR new ticket - enter the new booking",
    guidance: ACTION("Create a new ticket and calculate the cost",
      "<p>Also charge the customer the rebooking penalty of the original ticket.</p>"),
    fields: ["new_flights", "system_cost", "cost_to_pax", "emd", "currency"],
    next: [{ when: {}, go: "out_take_payment" }]
  },

  /* ---------------- Notices: explain, clear the answer, ask again ----- */

  notice_review_selection: {
    kind: "notice", reask: "entry",
    text: "That combination is not handled by the workflow. Please review and change your selection."
  },
  notice_void_not_possible: {
    kind: "notice", reask: "entry",
    text: "Void & Rebook is not an option when the ticket status is Suspended, Exchanged by " +
      "airline or Refunded (NSR). Please select a different rebooking reason."
  },
  notice_void_not_permitted_tk: {
    kind: "notice", reask: "q_portal_gdslike",
    text: "VOID is not possible for the Turkish (TK) portal. Please select a different rebooking " +
      "reason."
  },
  notice_nsr_not_supported: {
    kind: "notice", reask: "q_portal_gdslike",
    text: "We do not handle NSR for this portal. Please change your selection."
  },
  notice_special_carrier: {
    kind: "notice", reask: "q_fm_rebook_lcc",
    text: "DY/D8: we are not allowed to refer the customer to the airline, and we are not allowed " +
      "to contact the airline for this booking. Please change your selection."
  },
  notice_lcc_dy_gdpr: {
    kind: "notice", reask: "q_lcc_noflex",
    text: "DY/D8: do not refer the customer to the airline. We have no LCC rebooking policy for " +
      "GDPR cases - we can offer a voluntary rebooking instead."
  },

  /* ---------------- Outcomes ---------------- */

  out_take_payment: { kind: "outcome", handling: "Take Payment" },
  out_escalate: { kind: "outcome", handling: "Escalate to support" },
  out_refer_airline: { kind: "outcome", handling: "Refer to airline" },
  out_gdpr: { kind: "outcome", handling: "GDPR Docs" },
  out_refund_flex: { kind: "outcome", handling: "Refund Flex" },
  out_changes_not_permitted: { kind: "outcome", handling: "Changes are not permitted" },
  out_wait_ticket: { kind: "outcome", handling: "Changes are not permitted" },
  out_not_issued_yet: { kind: "outcome", handling: "Changes are not permitted" },
  out_transfer_sc: { kind: "outcome", handling: "Transfer to SC" }
};

/* ------------------------------------------------------------------ *
 * 3. OUTCOME TEXT                                                     *
 * ------------------------------------------------------------------ */

const OUTCOMES = {
  out_take_payment: {
    text: "Proceed with taking payment for this PNR.",
    guidance: ACTION("Next", "<p>The cost has been recorded. Payment is collected once every " +
      "PNR has been decided.</p>")
  },
  out_gdpr: {
    text: "Request GDPR docs from customer by sending the appropriate template from Edvin",
    guidance: ACTION("Outcome", "<p>We can request the medical documents from the customer and " +
      "ask the airline for an exceptional rebooking. Inform the customer once every PNR is " +
      "finalised.</p>")
  },
  out_refund_flex: {
    text: "Refund the price of Flexible Ticket",
    guidance: ACTION("Outcome", "<p>We will refund the airline's penalty or the air amount from " +
      "Edvin because we cannot provide the Flexible Ticket service.</p>")
  },
  out_changes_not_permitted: {
    text: "Changes are not permitted. You may offer a New ticket sell or cancellation to the " +
      "customer. If the customer confirms, select \"Different request\".",
    guidance: ACTION("Outcome", "<p>Changes are not permitted for this PNR. You may offer a new " +
      "ticket sale or a cancellation.</p>")
  },
  out_wait_ticket: {
    text: "Customer has to wait for the ticket to be issued and contact us again within void window",
    guidance: ACTION("Outcome", "<p>The customer must wait for the ticket to be issued and " +
      "contact us again within the void window.</p>")
  },
  out_not_issued_yet: {
    text: "The ticket is not issued yet. The customer must wait until it is issued, or you may " +
      "offer a cancellation before ticketing.",
    guidance: ALERT("Outcome", "<p>Inform the customer to wait until the ticket is issued. " +
      "Otherwise you may offer a cancellation before ticketing.</p>")
  },
  out_transfer_sc: {
    text: "Transferred to the Schedule Change team",
    guidance: ACTION("Action", "<p>1. Select macro: Action -> \"Transferred\"<br>" +
      "2. Write the internal note.<br>3. Submit as \"Open\" status.<br>" +
      "4. Transfer the interaction through the Genesys widget.<br>" +
      "5. Register the appropriate errand in the Edvin order.</p>")
  },
  out_escalate: {
    guidance: ACTION("Outcome", "<p>This PNR goes to Support. You will pick the escalation " +
      "reason once every PNR has been decided.</p>")
  },
  out_refer_airline: {
    guidance: ACTION("Outcome", "<p>Refer the customer to contact the airline directly.</p>")
  }
};

// Escalation wording - replaces the whole "2a. Escalate to Support" and
// "4a. Portals - Escalate to Support Outcome" trees. First match wins.
const ESCALATE_TEXT = [
  { when: { ticket_status: ["Refunded (NSR)"], gdpr_waiver: ["Yes"] },
    text: "We need to investigate internally and approve the medical rebooking. Tell the customer " +
      "that Support will handle the request and revert. Reason for escalation to select on the " +
      "next step: GDPR rebooking & Status of Ticket Refunded (NSR)." },
  { when: { ticket_status: ["Open for use"], fm_policy: ["No FM policy available"] },
    text: "We need to contact the airline because we have no FM policy for this incident. Reason " +
      "for escalation to select on the next step: Request FM policy from Airline/Consolidator." },
  { when: { ticket_status: ["Suspended"], fm_policy: ["FM policy is applicable"] },
    text: "We need to contact the airline to open the ticket status so we can calculate a " +
      "rebooking. Reason for escalation to select on the next step: Suspended Ticket." },
  { when: { ticket_status: ["Suspended"], fm_policy: ["FM policy is not applicable"], changes_permitted: ["Yes"] },
    text: "FM policy is not applicable, but we can proceed with a voluntary rebooking. We first " +
      "need to contact the airline to open the ticket status. Reason for escalation to select on " +
      "the next step: Suspended Ticket." },
  { when: { ticket_status: ["Suspended"], rebooking_reason: ["Voluntary"], changes_permitted: ["Yes"] },
    text: "We need to contact the airline to open the ticket status so we can calculate a " +
      "rebooking. Reason for escalation to select on the next step: Suspended Ticket." },
  { when: { man_rebooking: ["No"] },
    text: "Support will calculate the rebooking and revert to the customer with a cost. Reason " +
      "for escalation to select on the next step: Manual rebooking not trained." },
  { when: { fm_policy: ["No FM policy available"] },
    text: "We need to contact the airline because we have no FM policy for this incident. Reason " +
      "for escalation to select on the next step: Request FM policy from Airline/Consolidator." },
  { when: {},
    text: "Support will communicate with the airline and revert to the customer regarding the " +
      "rebooking and any possible cost." }
];

// Refer-to-airline wording - replaces "2b. Refer to airline" and
// "4b. Portals - Refer to Airline Outcome". First match wins.
const REFER_TEXT = [
  { when: { channel: ["lcc"], fm_rebook: ["Refer the customer to airline"] },
    text: "The customer needs to contact the airline to proceed with the rebooking due to the " +
      "Force Majeure situation." },
  { when: { channel: ["lcc"], who_rebook: ["Customer"] },
    text: "We cannot assist with the rebooking due to technical limitations. The customer should " +
      "contact the airline directly." },
  { when: { channel: ["lcc"], reb_permitted: ["No"] },
    text: "Rebooking is not permitted. The customer may contact the airline directly." },
  { when: { ticket_status: ["Exchanged by airline"] },
    text: "The airline has exchanged the ticket, so we have lost the authority to make any " +
      "changes. The customer should contact the airline directly for all requests except " +
      "cancellation." },
  { when: { ticket_status: ["Checked-in"], rebooking_reason: ["GDPR", "Schedule Change"] },
    text: "There is not enough time for us to request an exception from the airline, as all " +
      "communication has to be in writing. Please refer the customer to the airline directly." },
  { when: { gdpr_waiver: ["No"] },
    text: "There is no GDPR waiver provided by the airline. The customer may contact them " +
      "directly to proceed with the rebooking request." },
  { when: { ticket_status: ["Checked-in", "Suspended"], fm_policy: ["FM policy is not applicable", "No FM policy available"] },
    text: "We have no Force Majeure policy, so we cannot proceed given the ticket status. Please " +
      "refer the customer to the airline." },
  { when: { cancel_checkin: ["No"] },
    text: "We cannot cancel the check-in to proceed with the customer's request. Advise the " +
      "customer to contact the airline directly and revert so we can calculate the rebooking." },
  { when: { rebooking_reason: ["GDPR"] },
    text: "We cannot assist with the rebooking due to GDPR for this booking. The customer has to " +
      "contact the airline directly." },
  { when: {}, text: "Please refer the customer to contact the airline directly." }
];

/* ------------------------------------------------------------------ *
 * 4. READ THE CURRENT STATE                                           *
 * ------------------------------------------------------------------ */

let current_pnr = transforms.current_pnr || {};

// First pass for this PNR: attach the passengers the agent just selected.
if (!current_pnr.passengers) {
  const passengers = views.findorder || [];
  current_pnr = {
    ...current_pnr,
    passengers,
    formatted_passengers: passengers
      .map(p => "<div><strong>" + p.passengerFirstName + " " + p.passengerLastName + "</strong></div>")
      .join("")
  };
  ZT.setTransformData("current_pnr", current_pnr);
}

const CHANNEL_BY_TYPE = {
  GDS: "gds",
  LCC: "lcc",
  EXCEPTION_LCC: "lcc",
  EXCEPTION_GDS: "lcc",
  EXTERNAL_PORTAL: "portal"
};
const ENTRY_STEP = { gds: "q_gds_entry", lcc: "q_lcc_entry", portal: "q_portal_entry" };

const post_sale_type = current_pnr.postSaleHandleType || "GDS";
const channel = CHANNEL_BY_TYPE[post_sale_type] || "gds";
const showFlex = g("isShowFlexibleTicket", "") === "true";
const portal = g("portal", "");

const answers = {
  channel,
  post_sale_type,
  portal,
  portal_group: Object.keys(PORTALS).find(k => k !== "all" && PORTALS[k].indexOf(portal) > -1) || "",
  portal_void_ok: PORTALS.void_ok.indexOf(portal) > -1 ? "yes" : "no",
  // Without a valid Flexible Ticket the field is hidden, so treat it as "false"
  hasFlexibleTicket: showFlex ? g("hasFlexibleTicket", "false") : "false",
  cc2c: g("cc2c", ""),
  isWenrix: g("isWenrix", ""),
  isSpecialCarrier: String(g("isSpecialCarrier", "false")),
  has_chargeback: (g("cc2c", "") === "Yes" || String((actions.findorder || {}).hasChargeback) === "true") ? "Yes" : "No"
};
FIELDS.forEach(f => { answers[f] = g(f, ""); });

/* ------------------------------------------------------------------ *
 * 5. THE INTERPRETER                                                  *
 * ------------------------------------------------------------------ */

const matches = when =>
  Object.keys(when).every(key => when[key].indexOf(answers[key] || "") > -1);

const firstMatch = rules => {
  const hit = (rules || []).find(r => matches(r.when));
  return hit ? hit.go : "notice_review_selection";
};

const answered = step => (step.fields || []).every(f => {
  if (f === "hasFlexibleTicket" && !showFlex) return true;
  if (f === "reb_permitted") return answers.who_rebook !== "ETG" || answers.reb_permitted !== "";
  return answers[f] !== "";
});

let step = g("step", "") || ENTRY_STEP[channel];
let notice = "";
let guard = 0;

while (guard++ < 50) {
  const s = STEPS[step];
  if (s.kind === "outcome") break;
  if (s.kind === "route") { step = firstMatch(s.next); continue; }
  if (s.kind === "notice") {
    notice = s.text;
    const target = s.reask === "entry" ? ENTRY_STEP[channel] : s.reask;
    (STEPS[target].fields || []).forEach(f => { ZT.setFormData(f, ""); answers[f] = ""; });
    step = target;
    break;
  }
  if (!answered(s)) break;                 // waiting on the agent
  step = firstMatch(s.next);
}

/* ------------------------------------------------------------------ *
 * 6. STAGE THE SCREEN                                                 *
 * ------------------------------------------------------------------ */

const banner = "<p>" + (transforms.pnr_banner || "") + "</p>" +
  "<p><strong>PNR</strong>: " + (current_pnr.pnr || "") + "</p>" +
  "<p><strong>Handling</strong>: " + post_sale_type +
  (portal ? " / " + portal : "") + "</p>" +
  (answers.ticket_status ? "<p><strong>Ticket status</strong>: " + answers.ticket_status + "</p>" : "") +
  (answers.rebooking_reason ? "<p><strong>Rebooking reason</strong>: " + answers.rebooking_reason + "</p>" : "") +
  "<p><strong>Passengers</strong>: " + (current_pnr.formatted_passengers || "") + "</p>";

ZT.setTransformData("pnr_details_banner", banner);
ZT.setTransformData("notice_html", notice
  ? ALERT("Please change your selection", "<p>" + notice + "</p>")
  : "");

const current = STEPS[step];
const isFinal = current.kind === "outcome";

ZT.setFormData("step", step);
ZT.setTransformData("step_is_final", isFinal);

// Which of the 29 answer fields node 10 should show. The Flexible Ticket question
// is only shown when the order actually has an unused Flexible Ticket product.
const shownFields = isFinal ? [] : (current.fields || []);
FIELDS.forEach(f => {
  const show = shownFields.indexOf(f) > -1 && (f !== "hasFlexibleTicket" || showFlex);
  ZT.setFormData("need_" + f, show ? "yes" : "no");
});

// Option lists for the dynamic selects on node 10
DYNAMIC_OPTION_FIELDS.forEach(f => {
  const listName = (current.options || {})[f];
  const values = listName === "portals_all" ? PORTALS.all : (OPTIONS[listName] || []);
  ZT.setTransformData(f + "_options", values.map(v => ({ label: v, value: v })));
});

if (isFinal) {
  const text = step === "out_escalate" ? ESCALATE_TEXT.find(r => matches(r.when)).text
    : step === "out_refer_airline" ? REFER_TEXT.find(r => matches(r.when)).text
    : step === "out_take_payment" ? answers.cost_to_pax
    : OUTCOMES[step].text;

  ZT.setFormData("outcome", text);
  ZT.setFormData("proceedHandling", current.handling);
  ZT.setFormData("new_flights", answers.new_flights || "N/A");

  ZT.setTransformData("outcome_html", banner + (OUTCOMES[step].guidance || "") +
    '<div class="zt-content-block zt-cb-type-script"><div class="zt-cb-title"><h3>Outcome</h3>' +
    '</div><div class="zt-cb-body"><p>' + text + "</p><p>Continue to the next PNR, or on to the " +
    "customer's decision if this was the last one.</p></div></div>");
  ZT.setTransformData("step_html", "");
} else {
  ZT.setTransformData("step_html",
    banner + (notice ? ALERT("Please change your selection", "<p>" + notice + "</p>") : "") +
    "<h3>" + current.title + "</h3>" + (current.guidance || ""));
  ZT.setTransformData("outcome_html", "");
}

ZT.log("engine: channel=" + channel + " step=" + step + " final=" + isFinal);
