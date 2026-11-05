// SOURCE: Cowork session 'API data migration for actions arrays' (local_13dc0e72)
// ACCOUNT: eTraveli Group (ETG) - Cancellation Errand Register
// PURPOSE: Zingtree Script Node. Builds actions_array from Edvin API response (actions_api_response) by navigating channel -> Cancellation category -> type; rebuilds tags, adds channelId/categoryId/typeId/actionId + prebuilt message; accumulates current_pnr onto customer_action_pnrs.

/**
 * Build `actions_array` dynamically from the API payload instead of static arrays.
 *
 * Inputs already in scope:
 *   - actions_array_name : the DDL selection (e.g. "before_ticket_issuance_actions_array")
 *   - channel            : "Email" | "Phone" | "Chat"
 *   - actions_api_response : the full API response (channels -> categories -> types -> actions)
 *
 * Every DDL name maps to a type inside the "Cancellation" category.
 * Output shape stays the same as before: { name, tags, bucket, edvin_actions }.
 */

const CANCELLATION_CATEGORY = "Cancellation";

// DDL selection -> the matching type name inside the Cancellation category.
const cancellationTypeByArrayName = {
  before_ticket_issuance_actions_array:                 "Before ticket issuance",
  void_actions_array:                                   "Void",
  twenty_four_hour_rule_actions_array:                  "24 hour rule",
  voluntary_fare_rules_actions_array:                   "Voluntary - Fare rules",
  voluntary_voucher_credit_refund_actions_array:        "Voluntary - Voucher/Credit refund",
  force_majeure_actions_array:                          "Force Majeure",
  confirmed_crisis_actions_array:                       "Confirmed Crisis",
  gdpr_actions_array:                                   "GDPR",
  dupe_actions_array:                                   "Dupe",
  against_cancellation_protection_actions_array:        "Against Cancellation Protection",
  against_cancellation_guarantee_actions_array:         "Against Cancellation Guarantee",
  against_cfar_actions_array:                           "Against CFAR",
  against_xcover_cover_genius_actions_array:            "Against Xcover (Cover Genius)",
  against_manulife_actions_array:                       "Against Manulife",
  schedule_change_actions_array:                        "Schedule Change",
  against_self_transfer_guarantee_actions_array:        "Against Self Transfer Guarantee",
  chargeback_br_lawsuit_in_progress_lost_actions_array: "Chargeback/BR lawsuit in progress/lost"
};

// The API doesn't send edvin_actions, so we keep them here, keyed by action id.
// Seeded from the old "Before ticket issuance" data — port the rest from the other arrays.
const edvinActionsByActionId = {
  1846: { category: "2: Cancellation / refund", type: "1: Ask about cxnl rules", action: "1: Cnxl reservation" },
  1869: { category: "2: Cancellation / refund", type: "1: Ask about cxnl rules", action: "3: Not cxnl reservation" },
  1868: { category: "2: Cancellation / refund", type: "1: Ask about cxnl rules", action: "2: New ticket sell" },
  1934: { category: "NEW", type: "", action: "" },
  1971: { category: "2: Cancellation / refund", type: "4: Call transfer/Callback (SOD/TL/Manager)", action: "1: Pax requested call transfer/callback" },
  1863: { category: "41: Call disconnected / 26: Booking.com phase 1 - No order in Edvin / 43: No response", type: "1: Customer not reached / 4: Customer disconnected during call", action: "1: E-mail sent / 1: No action / 1: Chat disconnected" },
  1913: { category: "13: Language problem", type: "1: Language problem", action: "1: Did not speak customer language" },
  1862: { category: "2: Cancellation / refund", type: "1: Ask about cxnl rules", action: "1: Cnxl reservation" }
};

// Find the Cancellation type for a given channel and type name.
// Drill down to the channel, Cancellation category, and type objects for a selection.
function findCancellation(channelName, typeName) {
  const channel = actions_api_response.channels.find(c => c.name === channelName);
  const category = channel.categories.find(c => c.name === CANCELLATION_CATEGORY);
  const type = category.types.find(t => t.name === typeName);
  return { channel, category, type };
}

// List the channels ("Email"/"Phone"/"Chat") that offer this action for this type,
// which rebuilds the old `tags` array.
function channelsOfferingAction(typeName, actionId) {
  return actions_api_response.channels
    .filter(channel => findCancellation(channel.name, typeName).type.actions.some(action => action.id === actionId))
    .map(channel => channel.name);
}

// Turn one API action into the old object shape, plus the ids and message
// a later node needs to stitch the errand together.
// The API sends the bucket; default to "proceed" until every action has one.
function toActionItem(action, typeName, ids) {
  return {
    name: action.name,
    tags: channelsOfferingAction(typeName, action.id),
    bucket: action.bucket || "proceed",
    edvin_actions: edvinActionsByActionId[action.id],
    channelId: ids.channelId,
    categoryId: ids.categoryId,
    typeId: ids.typeId,
    actionId: action.id,
    message: `${channel} - ${CANCELLATION_CATEGORY} - ${typeName} - ${action.name}`
  };
}

const typeName = cancellationTypeByArrayName[actions_array_name];
const selection = findCancellation(channel, typeName);

const ids = {
  channelId: selection.channel.id,
  categoryId: selection.category.id,
  typeId: selection.type.id
};

const actions_array = selection.type.actions.map(action => toActionItem(action, typeName, ids));

ZT.setTransformData("actions_array", actions_array);

// Record this errand on the running list of customer-action PNRs.
let current_pnr = {
  ...transforms.current_pnr,
  channel,
  channelId: ids.channelId,
  category,
  categoryId: ids.categoryId,
  type,
  typeId: ids.typeId,
  notes,
  actions_array
  // customer_action,
  // customer_action_bucket
};

let customer_action_pnrs = transforms.customer_action_pnrs || [];
customer_action_pnrs.push(current_pnr);
ZT.setTransformData("customer_action_pnrs", customer_action_pnrs);
