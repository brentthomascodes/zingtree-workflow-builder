// SOURCE: Cowork session "Edvin API data comparison" (local_128ffcda); also pasted in sessions local_13dc0e72 and local_08259f0a
// ACCOUNT: eTraveli Group (ETG) - Cancellation Errand Register (Errands Template project)
// PURPOSE: Zingtree Script Node (tree transform) - the ORIGINAL static/working version being replaced by the Edvin API.
//          Selects 1 of 17 hardcoded actions arrays by DDL selection (actions_array_name), filters items by channel
//          (Email/Phone/Chat) via tags, and outputs actions_array via ZT.setTransformData.

let before_ticket_issuance_actions_array = [
  {
    name: "Cancellation completed - Sent for refund",
    tags: ["Email", "Phone", "Chat"],
    bucket: "proceed",
    edvin_actions: {
      category: "2: Cancellation / refund",
      type: "1: Ask about cxnl rules",
      action: "1: Cnxl reservation"
    }
  },
  {
    name: "Do not proceed",
    tags: ["Email", "Phone", "Chat"],
    bucket: "no_action",
    edvin_actions: {
      category: "2: Cancellation / refund",
      type: "1: Ask about cxnl rules",
      action: "3: Not cxnl reservation"
    }
  },
  {
    name: "Different request",
    tags: ["Email", "Phone", "Chat"],
    bucket: "different_request",
    edvin_actions: {
      category: "2: Cancellation / refund",
      type: "1: Ask about cxnl rules",
      action: "2: New ticket sell"
    }
  },
  {
    name: "Referred to airline",
    tags: ["Email", "Phone", "Chat"],
    bucket: "no_action",
    edvin_actions: {
      category: "NEW",
      type: "",
      action: ""
    }
  },
  {
    name: "Collect fee due to CC2C",
    tags: ["Email", "Phone", "Chat"],
    bucket: "proceed",
    edvin_actions: {
      category: "2: Cancellation / refund",
      type: "4: Call transfer/Callback (SOD/TL/Manager)",
      action: "1: Pax requested call transfer/callback"
    }
  },
  {
    name: "Customer requested Supervisor - Escalated",
    tags: ["Email", "Phone", "Chat"],
    bucket: "escalate",
    edvin_actions: {
      category: "41: Call disconnected / 26: Booking.com phase 1 - No order in Edvin / 43: No response",
      type: "1: Customer not reached / 4: Customer disconnected during call",
      action: "1: E-mail sent / 1: No action / 1: Chat disconnected"
    }
  },
  {
    name: "Interaction disconnected - no response",
    tags: ["Phone", "Chat"],
    bucket: "no_action",
    edvin_actions: {
      category: "13: Language problem",
      type: "1: Language problem",
      action: "1: Did not speak customer language"
    }
  },
  {
    name: "Customer language issue - transferred",
    tags: ["Phone", "Chat"],
    bucket: "no_action",
    edvin_actions: {
      category: "2: Cancellation / refund",
      type: "1: Ask about cxnl rules",
      action: "1: Cnxl reservation"
    }
  }
];

let void_actions_array = [
  {
    name: "Void completed",
    tags: ["Email", "Phone", "Chat"],
    bucket: "proceed",
    edvin_actions: {
      category: "2: Cancellation / refund",
      type: "1: Ask about cxnl rules",
      action: "3: Not cxnl reservation"
    }
  },
  {
    name: "Void not permitted",
    tags: ["Email", "Phone", "Chat"],
    bucket: "no_action",
    edvin_actions: {
      category: "2: Cancellation / refund",
      type: "1: Ask about cxnl rules",
      action: "3: Not cxnl reservation"
    }
  },
  {
    name: "Do not proceed",
    tags: ["Email", "Phone", "Chat"],
    bucket: "no_action",
    edvin_actions: {
      category: "2: Cancellation / refund",
      type: "1: Ask about cxnl rules",
      action: "2: New ticket sell"
    }
  },
  {
    name: "Different request",
    tags: ["Email", "Phone", "Chat"],
    bucket: "different_request",
    edvin_actions: {
      category: "2: Cancellation / refund",
      type: "1: Ask about cxnl rules",
      action: "4: Info provided via e-mail"
    }
  },
  {
    name: "Info provided - Pending pax decision",
    tags: ["Email"],
    bucket: "no_action",
    edvin_actions: {
      category: "2: Cancellation / refund",
      type: "1: Ask about cxnl rules",
      action: "6: Send to support"
    }
  },
  {
    name: "Sent to Support",
    tags: ["Email", "Phone", "Chat"],
    bucket: "proceed",
    edvin_actions: {
      category: "2: Cancellation / refund",
      type: "1: Ask about cxnl rules",
      action: "5: Referred to airline"
    }
  },
  {
    name: "Referred to airline",
    tags: ["Email", "Phone", "Chat"],
    bucket: "no_action",
    edvin_actions: {
      category: "NEW",
      type: "",
      action: ""
    }
  },
  {
    name: "Collect fee due to CC2C",
    tags: ["Email", "Phone", "Chat"],
    bucket: "proceed/take_payment",
    edvin_actions: {
      category: "2: Cancellation / refund",
      type: "1: Ask about cxnl rules",
      action: "7: Already on support"
    }
  },
  {
    name: "Follow up - Information provided",
    tags: ["Email", "Phone", "Chat"],
    bucket: "no_action",
    edvin_actions: {
      category: "2: Cancellation / refund",
      type: "4: Call transfer/Callback (SOD/TL/Manager)",
      action: "1: Pax requested call transfer/callback"
    }
  },
  {
    name: "Customer requested Supervisor - Escalated",
    tags: ["Email", "Phone", "Chat"],
    bucket: "escalate",
    edvin_actions: {
      category: "41: Call disconnected / 26: Booking.com phase 1 - No order in Edvin / 43: No response",
      type: "1: Customer not reached / 4: Customer disconnected during call",
      action: "1: E-mail sent / 1: No action / 1: Chat disconnected"
    }
  },
  {
    name: "Interaction disconnected - no response",
    tags: ["Phone", "Chat"],
    bucket: "no_action",
    edvin_actions: {
      category: "13: Language problem",
      type: "1: Language problem",
      action: "1: Did not speak customer language"
    }
  },
  {
    name: "Customer language issue - transferred",
    tags: ["Phone", "Chat"],
    bucket: "no_action",
    edvin_actions: {
      category: "2: Cancellation / refund",
      type: "17: Already handled",
      action: "1: Closed email"
    }
  }
];

let twenty_four_hour_rule_actions_array = [
    { name: "24 hour rule completed", tags: ["Email", "Phone", "Chat"] },
    { name: "24 hour rule not permitted", tags: ["Email", "Phone", "Chat"] },
    { name: "Do not proceed", tags: ["Email", "Phone", "Chat"] },
    { name: "Different request", tags: ["Email", "Phone", "Chat"] },
    { name: "Info provided - Pending pax decision", tags: ["Email"] },
    { name: "Sent to Support", tags: ["Email", "Phone", "Chat"] },
    { name: "Referred to airline", tags: ["Email", "Phone", "Chat"] },
    { name: "Collect fee due to CC2C", tags: ["Email", "Phone", "Chat"] },
    { name: "Follow up - Information provided", tags: ["Email", "Phone", "Chat"] },
    { name: "Customer requested Supervisor - Escalated", tags: ["Email", "Phone", "Chat"] },
    { name: "Interaction disconnected - no response", tags: ["Phone", "Chat"] },
    { name: "Customer language issue - transferred", tags: ["Phone", "Chat"] }
];

let voluntary_fare_rules_actions_array = [
    { name: "Cancellation processed", tags: ["Email", "Phone", "Chat"] },
    { name: "Ticket is not refundable", tags: ["Email", "Phone", "Chat"] },
    { name: "Do not proceed", tags: ["Email", "Phone", "Chat"] },
    { name: "Different request", tags: ["Email", "Phone", "Chat"] },
    { name: "Info provided - Pending pax decision", tags: ["Email"] },
    { name: "Sent to Support", tags: ["Email", "Phone", "Chat"] },
    { name: "Referred to airline", tags: ["Email", "Phone", "Chat"] },
    { name: "Collect fee due to CC2C", tags: ["Email", "Phone", "Chat"] },
    { name: "Follow up - Information provided", tags: ["Email", "Phone", "Chat"] },
    { name: "Customer requested Supervisor - Escalated", tags: ["Email", "Phone", "Chat"] },
    { name: "Interaction disconnected - no response", tags: ["Phone", "Chat"] },
    { name: "Customer language issue - transferred", tags: ["Phone", "Chat"] }
];

let voluntary_voucher_credit_refund_actions_array = [
    { name: "Cancellation processed", tags: ["Email", "Phone", "Chat"] },
    { name: "Voucher/credit not permitted - No refund", tags: ["Email", "Phone", "Chat"] },
    { name: "Do not proceed", tags: ["Email", "Phone", "Chat"] },
    { name: "Different request", tags: ["Email", "Phone", "Chat"] },
    { name: "Info provided - Pending pax decision", tags: ["Email"] },
    { name: "Sent to Support", tags: ["Email", "Phone", "Chat"] },
    { name: "Referred to airline", tags: ["Email", "Phone", "Chat"] },
    { name: "Collect fee due to CC2C", tags: ["Email", "Phone", "Chat"] },
    { name: "Follow up - Information provided", tags: ["Email", "Phone", "Chat"] },
    { name: "Customer requested Supervisor - Escalated", tags: ["Email", "Phone", "Chat"] },
    { name: "Interaction disconnected - no response", tags: ["Phone", "Chat"] },
    { name: "Customer language issue - transferred", tags: ["Phone", "Chat"] }
];

let force_majeure_actions_array = [
    { name: "Cancellation processed", tags: ["Email", "Phone", "Chat"] },
    { name: "Cancellation is not permitted", tags: ["Email", "Phone", "Chat"] },
    { name: "Do not proceed", tags: ["Email", "Phone", "Chat"] },
    { name: "Different request", tags: ["Email", "Phone", "Chat"] },
    { name: "Info provided - Pending pax decision", tags: ["Email"] },
    { name: "Sent to Support", tags: ["Email", "Phone", "Chat"] },
    { name: "Referred to airline", tags: ["Email", "Phone", "Chat"] },
    { name: "Follow up - Information provided", tags: ["Email", "Phone", "Chat"] },
    { name: "Customer requested Supervisor - Escalated", tags: ["Email", "Phone", "Chat"] },
    { name: "Interaction disconnected - no response", tags: ["Phone", "Chat"] },
    { name: "Customer language issue - transferred", tags: ["Phone", "Chat"] }
];

let confirmed_crisis_actions_array = [
    { name: "Cancellation processed", tags: ["Email", "Phone", "Chat"] },
    { name: "Cancellation is not permitted", tags: ["Email", "Phone", "Chat"] },
    { name: "Do not proceed", tags: ["Email", "Phone", "Chat"] },
    { name: "Different request", tags: ["Email", "Phone", "Chat"] },
    { name: "Info provided - Pending pax decision", tags: ["Email"] },
    { name: "Sent to Support", tags: ["Email", "Phone", "Chat"] },
    { name: "Referred to airline", tags: ["Email", "Phone", "Chat"] },
    { name: "Follow up - Information provided", tags: ["Email", "Phone", "Chat"] },
    { name: "Customer requested Supervisor - Escalated", tags: ["Email", "Phone", "Chat"] },
    { name: "Interaction disconnected - no response", tags: ["Phone", "Chat"] },
    { name: "Customer language issue - transferred", tags: ["Phone", "Chat"] }
];

let gdpr_actions_array = [
    { name: "Requested docs", tags: ["Email", "Phone", "Chat"] },
    { name: "Not permitted", tags: ["Email", "Phone", "Chat"] },
    { name: "Do not proceed", tags: ["Email", "Phone", "Chat"] },
    { name: "Different request", tags: ["Email", "Phone", "Chat"] },
    { name: "Referred to airline", tags: ["Email", "Phone", "Chat"] },
    { name: "Follow up - Information provided", tags: ["Email", "Phone", "Chat"] },
    { name: "Customer requested Supervisor - Escalated", tags: ["Email", "Phone", "Chat"] },
    { name: "Interaction disconnected - no response", tags: ["Phone", "Chat"] },
    { name: "Customer language issue - transferred", tags: ["Phone", "Chat"] }
];

let dupe_actions_array = [
    { name: "Cancellation processed", tags: ["Email", "Phone", "Chat"] },
    { name: "Cancellation is not permitted", tags: ["Email", "Phone", "Chat"] },
    { name: "Do not proceed", tags: ["Email", "Phone", "Chat"] },
    { name: "Different request", tags: ["Email", "Phone", "Chat"] },
    { name: "Info provided - Pending pax decision", tags: ["Email"] },
    { name: "Sent to Support", tags: ["Email", "Phone", "Chat"] },
    { name: "Referred to airline", tags: ["Email", "Phone", "Chat"] },
    { name: "Collect fee due to CC2C", tags: ["Email", "Phone", "Chat"] },
    { name: "Follow up - Information provided", tags: ["Email", "Phone", "Chat"] },
    { name: "Customer requested Supervisor - Escalated", tags: ["Email", "Phone", "Chat"] },
    { name: "Interaction disconnected - no response", tags: ["Phone", "Chat"] },
    { name: "Customer language issue - transferred", tags: ["Phone", "Chat"] }
];

let against_cancellation_protection_actions_array = [
    { name: "Cancellation processed - Requested docs", tags: ["Email", "Phone", "Chat"] },
    { name: "Not eligible for the product", tags: ["Email", "Phone", "Chat"] },
    { name: "Do not proceed", tags: ["Email", "Phone", "Chat"] },
    { name: "Different request", tags: ["Email", "Phone", "Chat"] },
    { name: "Info provided - Pending pax decision", tags: ["Email"] },
    { name: "Sent to Support", tags: ["Email", "Phone", "Chat"] },
    { name: "Follow up - Information provided", tags: ["Email", "Phone", "Chat"] },
    { name: "Customer requested Supervisor - Escalated", tags: ["Email", "Phone", "Chat"] },
    { name: "Interaction disconnected - no response", tags: ["Phone", "Chat"] },
    { name: "Customer language issue - transferred", tags: ["Phone", "Chat"] }
];

let against_cancellation_guarantee_actions_array = [
    { name: "Cancellation processed", tags: ["Email", "Phone", "Chat"] },
    { name: "Not eligible for the product", tags: ["Email", "Phone", "Chat"] },
    { name: "Do not proceed", tags: ["Email", "Phone", "Chat"] },
    { name: "Different request", tags: ["Email", "Phone", "Chat"] },
    { name: "Info provided - Pending pax decision", tags: ["Email"] },
    { name: "Sent to Support", tags: ["Email", "Phone", "Chat"] },
    { name: "Follow up - Information provided", tags: ["Email", "Phone", "Chat"] },
    { name: "Customer requested Supervisor - Escalated", tags: ["Email", "Phone", "Chat"] },
    { name: "Interaction disconnected - no response", tags: ["Phone", "Chat"] },
    { name: "Customer language issue - transferred", tags: ["Phone", "Chat"] }
];

let against_cfar_actions_array = [
    { name: "Cancellation processed", tags: ["Email", "Phone", "Chat"] },
    { name: "Not eligible for the product", tags: ["Email", "Phone", "Chat"] },
    { name: "Do not proceed", tags: ["Email", "Phone", "Chat"] },
    { name: "Different request", tags: ["Email", "Phone", "Chat"] },
    { name: "Info provided - Pending pax decision", tags: ["Email"] },
    { name: "Sent to Support", tags: ["Email", "Phone", "Chat"] },
    { name: "Follow up - Information provided", tags: ["Email", "Phone", "Chat"] },
    { name: "Customer requested Supervisor - Escalated", tags: ["Email", "Phone", "Chat"] },
    { name: "Interaction disconnected - no response", tags: ["Phone", "Chat"] },
    { name: "Customer language issue - transferred", tags: ["Phone", "Chat"] }
];

let against_xcover_cover_genius_actions_array = [
    { name: "Cancellation processed", tags: ["Email", "Phone", "Chat"] },
    { name: "Do not proceed", tags: ["Email", "Phone", "Chat"] },
    { name: "Different request", tags: ["Email", "Phone", "Chat"] },
    { name: "Info provided - Pending pax decision", tags: ["Email"] },
    { name: "Customer requested Supervisor - Escalated", tags: ["Email", "Phone", "Chat"] },
    { name: "Interaction disconnected - no response", tags: ["Phone", "Chat"] },
    { name: "Customer language issue - transferred", tags: ["Phone", "Chat"] }
];

let against_manulife_actions_array = [
    { name: "Cancellation processed", tags: ["Email", "Phone", "Chat"] },
    { name: "Do not proceed", tags: ["Email", "Phone", "Chat"] },
    { name: "Different request", tags: ["Email", "Phone", "Chat"] },
    { name: "Info provided - Pending pax decision", tags: ["Email"] },
    { name: "Customer requested Supervisor - Escalated", tags: ["Email", "Phone", "Chat"] },
    { name: "Interaction disconnected - no response", tags: ["Phone", "Chat"] },
    { name: "Customer language issue - transferred", tags: ["Phone", "Chat"] }
];

let schedule_change_actions_array = [
    { name: "Transferred to SC", tags: ["Email", "Phone", "Chat"] }
];

let against_self_transfer_guarantee_actions_array = [
    { name: "Transferred to SC", tags: ["Email", "Phone", "Chat"] }
];

let chargeback_br_lawsuit_in_progress_lost_actions_array = [
    { name: "Chargeback info provided - Referred to Bank", tags: ["Email", "Phone", "Chat"] },
    { name: "BR lawsuit informed to wait for outcome", tags: ["Email", "Phone", "Chat"] }
];

const actionsArrayMap = {
  before_ticket_issuance_actions_array,
  void_actions_array,
  twenty_four_hour_rule_actions_array,
  voluntary_fare_rules_actions_array,
  voluntary_voucher_credit_refund_actions_array,
  force_majeure_actions_array,
  confirmed_crisis_actions_array,
  gdpr_actions_array,
  dupe_actions_array,
  against_cancellation_protection_actions_array,
  against_cancellation_guarantee_actions_array,
  against_cfar_actions_array,
  against_xcover_cover_genius_actions_array,
  against_manulife_actions_array,
  schedule_change_actions_array,
  against_self_transfer_guarantee_actions_array,
  chargeback_br_lawsuit_in_progress_lost_actions_array
};

let actions_array = (actionsArrayMap[actions_array_name] || []).filter(item => item?.tags?.includes(channel));;
ZT.setTransformData("actions_array", actions_array)
