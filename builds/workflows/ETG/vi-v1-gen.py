#!/usr/bin/env python3
"""Generate the ETG VI (Virtual Interlining) Errand Registration tree JSON.

Forked from Register Errands - Dynamic (v35 replay idempotency 2026-08-05).json,
tree 595124299. Built per Zingtree Builder/Requirements/ETG/
vi-errand-registration-requirements.md (R1-R11).
"""
import json

BASE_PATH = "/Users/brentthomas/Desktop/Software_Engineering/Claude Cowork - Zingtree/Zingtree Builder/Workflow JSONs/ETG/Register Errands - Dynamic (v35 replay idempotency 2026-08-05).json"
OUT_PATH = "/Users/brentthomas/Desktop/Software_Engineering/Claude Cowork - Zingtree/Zingtree Builder/Workflow JSONs/ETG/Register Errands - VI (v1 fork 2026-08-05).json"
CLAUDE_MD_PATH = "/private/tmp/claude-501/-Users-brentthomas-Desktop-Software-Engineering-Claude-Cowork---Zingtree/dee9cfd4-7814-48fa-b1c5-334f950815db/scratchpad/vi_build/claude_md.txt"

with open(BASE_PATH) as f:
    base = json.load(f)

base_nodes = base["nodes"]

# ---------------------------------------------------------------------------
# Node builder helpers
# ---------------------------------------------------------------------------

NODE_DEFAULTS = {
    "is_root": "0", "content": "", "question": "", "keywords": "", "confirmation_text": "",
    "notes": "", "score_var": "", "x": "0", "y": "0", "width": "0", "height": "0", "level": "0",
    "buttons_across": "0", "resolution_state": "", "hide_back_restart": "0",
    "hide_persistent_buttons": "0", "hide_from_search": "0", "repeat_form": "0",
    "form_columns": "0", "email": "", "email_bcc": "", "email_return_url": "",
    "email_subject": "", "email_preheader": "", "email_reply_to": "", "email_sender_name": "",
    "email_body": "", "email_send_now": "0", "email_include_session_data": "0",
    "email_data_privacy": "0", "link": "", "link_new_tab": "0", "link_direct": "0",
    "open_tree_id": "0", "open_tree_node_id": "0", "return_tree_node_id": "0",
    "randomize_scoring": "0", "advanced_logic_node": "0", "tag": "", "jsmessage": "",
    "value": "0", "probability": "0", "updated": "0", "score_running_total": "0",
    "continuation_node_id": "0", "continuation_button_text": "", "allow_pdf_download": "0",
    "doc_node_type": "", "pdf_url_variable": "", "escalate_after": "0",
    "escalate_after_unit": "", "search_scope": "", "ai_action_id": "0",
    "formfields": {}, "buttons": {}, "data_connected_objects": {}, "app_messages": {},
}

def node(node_id, ntype, page_title, node_name, **kw):
    d = dict(NODE_DEFAULTS)
    d["type"] = ntype
    d["page_title"] = page_title
    d["node_name"] = node_name
    d["project_node_id"] = str(node_id)
    d["display_order"] = str(node_id)
    for k, v in kw.items():
        d[k] = v
    return d

def btn(button_text, button_link, logic_expression="", op="", button_data="", rank=1, hover_text=""):
    return {
        "button_text": button_text, "hover_text": hover_text, "button_link": str(button_link),
        "rank": str(rank), "button_data": button_data, "logic_expression": logic_expression,
        "wizard_skip": "0", "value": "0", "op": op, "updated": "0",
    }

def buttons(*items):
    out = {}
    for i, b in enumerate(items):
        b = dict(b)
        b["rank"] = str(i + 1)
        out[str(i)] = b
    return out

def ff(ftype, name, label, options="", required="0", config="", label_type="L"):
    return {
        "type": ftype, "name": name, "label": label, "label_type": label_type,
        "options": options, "hidden_value": "", "custom_regex": "", "inline": "0",
        "required": required, "score_var": "", "checkbox_score": "1", "scores": "",
        "rank": "1", "config": config,
    }

def formfields(*items):
    out = {}
    for i, item in enumerate(items):
        item = dict(item)
        item["rank"] = str(i + 1)
        out[str(i)] = item
    return out

def dco(*ids, org_id="116"):
    return {str(i): {"org_id": org_id, "data_connected_object_id": str(cid), "data_connected_object_type": "http"} for i, cid in enumerate(ids)}

nodes = {}

# ===========================================================================
# 1. Root Script - Clear session and start fresh order
# ===========================================================================
SCRIPT_1 = r'''// Clear session and start a fresh VI order.
// This node is the tree ROOT, so it runs on a fresh launch AND whenever the agent
// presses Restart (native Restart returns to the root node). A valid ?session_id=
// deep-resume re-enters at the last content node and SKIPS this script, so an
// in-progress session is preserved. Inbound query params are NOT touched here.
//
// Ported from the parent tree's node 10 (Register Errands - Dynamic v35). The
// per-PNR intake-loop resets (pnr_index, isMorePNR, current_pnr, pnr_banner,
// customer_action_table_html) are dropped - R2 removes that loop entirely, so
// those variables do not exist in this tree. The child/grandchild ticket loop
// state and its idempotency-guard key lists are inherited unmodified per R1.

// VI intake
ZT.setTransformData("selected_pnrs", []);
ZT.setFormData("partner_routing", "");
ZT.setFormData("disruption_type", "");
ZT.setFormData("delay_reason", "");
ZT.setFormData("vi_ladder_outcome", "");
ZT.setFormData("vi_type_id", "");
ZT.setFormData("vi_action_id", "");
ZT.setFormData("notes", "");
ZT.setTransformData("vi_type", []);
ZT.setTransformData("actions_by_type", {});
ZT.setTransformData("vi_actions_array", []);
ZT.setFormData("vi_resolved_type", "");
ZT.setFormData("vi_resolved_action", "");
ZT.setFormData("vi_resolved_bucket", "");
ZT.setTransformData("customer_action_pnrs", []);
ZT.setTransformData("vi_final_pnrs", []);
ZT.setTransformData("final_pnrs_count", 0);
ZT.setTransformData("internal_note_details", ``);

// Child / grandchild ticket loop transforms (inherited from parent tree)
ZT.setTransformData("child_tickets", []);
ZT.setTransformData("child_ticket", {});
ZT.setTransformData("current_child_ticket", {});
ZT.setTransformData("created_child_ticket_keys", []);
ZT.setTransformData("created_grandchild_ticket_keys", []);
ZT.setTransformData("attempted_child_ticket_keys", []);
ZT.setTransformData("attempted_grandchild_ticket_keys", []);
ZT.setTransformData("registered_errand_keys", []);
ZT.setTransformData("planned_ticket_titles", []);
ZT.setTransformData("child_tickets_note", ``);
ZT.setFormData("skip_errand_registration", false);
ZT.setFormData("child_ticket_already_created", false);
ZT.setFormData("grandchild_ticket_already_created", false);

// Loop counters / flags (form data)
ZT.setFormData("child_tickets_count", 0);
ZT.setFormData("grandchild_tickets_count", 0);
ZT.setFormData("is_more_vi_errands", false);
ZT.setFormData("is_more_child_tickets", false);
ZT.setFormData("is_grandchild_tickets", false);
ZT.setFormData("is_more_grandchild_tickets", false);
ZT.setFormData("grandchild_parent_id", "");
ZT.setFormData("side_conversation_id", "");

ZT.setFormData("orderReference", ZT.getVariableValue("custom_field_33772689958162", ""));
'''
nodes["1"] = node(1, "Script", "Clear session and start fresh order",
                   "Clear session state, then start a fresh VI order lookup",
                   is_root="1", content=SCRIPT_1, continuation_node_id="2")

# ===========================================================================
# 2. Data - Edvin - Find Order (CO 176, verbatim)
# ===========================================================================
nodes["2"] = node(2, "Data", "Edvin - Find Order", "Calls Edvin to look up the order for this VI-flagged ticket",
                   content="", continuation_node_id="3", data_connected_objects=dco(176))

# ===========================================================================
# 3. Content - Select PNR's for this VI order (multi-select, R2)
# ===========================================================================
content_3 = base_nodes["6"]["content"].replace(
    "<p><br></p>",
    "<p><br></p><p><strong>Select every PNR that belongs to this VI order.</strong> "
    "Multi-select on the grid above &ndash; VI PNRs are segments of one trip, so this "
    "run treats every PNR you select as one unit sharing one disruption type, one "
    "resolved action, and one child ticket.</p>",
    1,
)
nodes["3"] = node(3, "Content", "Select PNR's for this VI order", "Agent multi-selects every PNR belonging to this VI order (R2 - no per-PNR loop)",
                   content=content_3,
                   formfields=dict(base_nodes["6"]["formfields"]),
                   buttons=buttons(btn("Continue::zt_started", 4)))

# ===========================================================================
# 4. Script - Set order context & channel
# ===========================================================================
SCRIPT_4 = r'''// Set order context & channel.
// Captures the agent's multi-select from the Find Order grid (R2 - no per-PNR
// loop; every selected PNR shares one downstream flow) plus the channel/agent
// group picked on node 3. Ported from the parent tree's node 24.

ZT.setTransformData("customer_action_pnrs", []);
ZT.setTransformData("child_tickets", []);

// Full Find Order row objects (pnr, postSaleHandleType, provider, id, ...) are kept
// intact - not flattened to bare PNR strings - matching the parent tree's node 24
// convention. Any Connected Object payload that expects a field beyond the human
// PNR code (e.g. Edvin's internal id) keeps working unchanged.
let selected_pnrs = views.findorder || [];
ZT.setTransformData("selected_pnrs", selected_pnrs);

ZT.setFormData("category", ZT.getVariableValue("custom_field_29559177650834", ""));
ZT.setFormData("channel", ZT.getVariableValue("zendeskChannelIdentifier", ""));

let val = ZT.getVariableValue("errand_api_path", "fl_paths");
ZT.setFormData("errand_api_path", val);
'''
nodes["4"] = node(4, "Script", "Set order context & channel",
                   "Captures the multi-selected PNRs and channel before the VI-specific screens",
                   content=SCRIPT_4, continuation_node_id="6")

# ===========================================================================
# 5. claude.md (unlinked) - filled near the end
# ===========================================================================
with open(CLAUDE_MD_PATH) as f:
    CLAUDE_MD_CONTENT = f.read()
nodes["5"] = node(5, "Content", "claude.md", "claude.md",
                   content=CLAUDE_MD_CONTENT, hide_from_search="1")

# ===========================================================================
# 6. Content - Booking partner, STG eligibility & disruption type (R4, R5, R9)
# ===========================================================================
STG_ALERT = ("Before proceeding, confirm that the order is eligible for STG offers by "
             "reviewing the applicability based on the &#39;order date in site time&#39; "
             "displayed in Edvin.")
content_6 = (
    '<div class="zt-content-block zt-cb-type-alert"><div class="zt-cb-title">'
    '<i class="zt-cb-icon" contenteditable="false"></i><h3>STG eligibility - confirm manually</h3></div>'
    f'<div class="zt-cb-body"><p>{STG_ALERT}</p></div></div>'
)
nodes["6"] = node(6, "Content", "Booking partner, STG eligibility & disruption type",
                   "Captures partner_routing (R9, interim manual), shows the STG alert (R4), "
                   "and captures disruption_type + conditional delay_reason (R5)",
                   content=content_6,
                   formfields=formfields(
                       ff("select", "partner_routing", "Booking partner:",
                          "booking.com\nother", required="1",
                          config='{"filterable":true}'),
                       ff("radio", "disruption_type", "Select disruption type:",
                          "Schedule change within the Operational Window\n"
                          "Schedule change outside the Operational Window\n"
                          "Trip delay within the Operational Window",
                          required="1"),
                       ff("radio", "delay_reason", "What caused delay:",
                          "Baggage delay or loss\nCustoms or immigration processes\n"
                          "Last minute flight delay",
                          required="1",
                          config='{"conditional":{"simple":[{"variable":"disruption_type",'
                                 '"op":"eq","value":"Trip delay within the Operational Window"}]}}'),
                   ),
                   buttons=buttons(btn("Continue", 7)))

# ===========================================================================
# 7. Script - Route by operational window (R6 eval)
# ===========================================================================
SCRIPT_7 = r'''// Route by operational window (R6).
// Evaluates the disruption_type radio (R5) into two exhaustive, mutually
// exclusive script-set booleans so the router at node 8 never tests a raw form
// string - the house rule the reference demo's node 33 violated (defect #2).

let disruption_type = ZT.getVariableValue("disruption_type", "");

let is_outside_window = disruption_type === "Schedule change outside the Operational Window";
let is_within_window = disruption_type === "Schedule change within the Operational Window" ||
                        disruption_type === "Trip delay within the Operational Window";

ZT.setFormData("is_outside_window", is_outside_window);
ZT.setFormData("is_within_window", is_within_window);
'''
nodes["7"] = node(7, "Script", "Route by operational window",
                   "Turns disruption_type into is_outside_window / is_within_window booleans for node 8",
                   content=SCRIPT_7, continuation_node_id="8")

# ===========================================================================
# 8. Scoring - Outside or within the Operational Window?
# ===========================================================================
nodes["8"] = node(8, "Scoring", "Outside or within the Operational Window?",
                   "Routes to the Outside ladder (9) or Within ladder (13) on the node 7 booleans",
                   advanced_logic_node="1",
                   buttons=buttons(
                       btn("is_outside_window == true", 9, logic_expression="is_outside_window == true"),
                       btn("is_within_window == true", 13, logic_expression="is_within_window == true"),
                   ),
                   continuation_node_id="9")

# ===========================================================================
# Outside-the-Operational-Window ladder (R7)
# ===========================================================================
def action_block(title_html_free_text_action):
    return (
        '<div class="zt-content-block zt-cb-type-action"><div class="zt-cb-title">'
        '<i class="zt-cb-icon" contenteditable="false"></i><h3>Action</h3></div>'
        f'<div class="zt-cb-body"><p>{title_html_free_text_action}</p></div></div>'
    )

def note_block(text):
    return (
        '<div class="zt-content-block zt-cb-type-note"><div class="zt-cb-title">'
        '<i class="zt-cb-icon" contenteditable="false"></i><h3>Note</h3></div>'
        f'<div class="zt-cb-body"><p>{text}</p></div></div>'
    )

def alert_block(title, text):
    return (
        '<div class="zt-content-block zt-cb-type-alert"><div class="zt-cb-title">'
        f'<i class="zt-cb-icon" contenteditable="false"></i><h3>{title}</h3></div>'
        f'<div class="zt-cb-body"><p>{text}</p></div></div>'
    )

ALT_FLIGHT_ACTION = ("Find a valid flight alternative for the flight directly or indirectly "
                      "affected by the SC within the same-day VI connection that complies with "
                      "minimum connection time requirements, without impacting other flights in "
                      "the itinerary.")
NEW_TICKET_ACTION = ("Book new tickets with the same or a different airline for directly or "
                      "indirectly affected PNR(s) and accept the proposed alternative by the "
                      "airline on the directly affected PNR by SC within VI orders if available.")
NEW_TICKET_NOTE = ("New ticket sell for directly or indirectly affected PNR(s) by SC, with "
                    "Overnight Stay and Hotel accommodation compensation comes as the next option.")

# 9. Outside window - find an alternative flight
nodes["9"] = node(9, "Content", "Outside window: find an alternative flight",
                   "R7 Outside ladder, step 1 - alternative flight",
                   content=action_block(ALT_FLIGHT_ACTION),
                   buttons=buttons(
                       btn("Alternative flight available", 15),
                       btn("Alternative flight requiring accomodation available", 16),
                       btn("Alternative flight is not available", 10),
                   ))

# 10. Outside window - sell a new ticket
nodes["10"] = node(10, "Content", "Outside window: sell a new ticket",
                    "R7 Outside ladder, step 2 - new ticket sell",
                    content=action_block(NEW_TICKET_ACTION) + note_block(NEW_TICKET_NOTE),
                    buttons=buttons(
                        btn("New ticket sell available", 16),
                        btn("New ticket sell requiring accomodation available", 16),
                        btn("No new ticket sell option", 11),
                    ))

# 11. Cancellation (SHARED between both ladders, AC-7.4)
nodes["11"] = node(11, "Content", "Cancellation: refund the remaining flights",
                    "R7 step 3, shared by both ladders (AC-7.4)",
                    content=action_block("Refund of the rest flights remaining on the bound.") +
                            alert_block("Refund all the rest of the flights in the order",
                                        "This is only applicable if the entire order is a VI or the "
                                        "remaining flights are within the VI part of the trip."),
                    buttons=buttons(
                        btn("Refund offer", 15),
                        btn("Last resort", 12),
                    ))

# 12. Last resort (placeholder - Mira flagged this has no real content in the demo)
LAST_RESORT_CONTENT = (
    '<div class="zt-content-block zt-cb-type-alert"><div class="zt-cb-title">'
    '<i class="zt-cb-icon" contenteditable="false"></i><h3>Last resort &ndash; PLACEHOLDER, content needed</h3></div>'
    '<div class="zt-cb-body">'
    '<p><strong>No business content is defined for this step.</strong> Olga Gerothanasi&#39;s VI demo '
    '(tree 915692749, node 38 &quot;Last resort&quot;) titles this step but supplies no Action/Note/Alert '
    'text - the requirements doc (Zingtree Builder/Requirements/ETG/vi-errand-registration-requirements.md, '
    '&sect;10 Assumption A5) flags it as needing real content from Brent or Olga before this ships.</p>'
    '<p>Until that content is supplied, click Continue to record this VI order as resolved via last resort.</p>'
    '</div></div>'
)
nodes["12"] = node(12, "Content", "Last resort (PLACEHOLDER — content needed)",
                    "Terminal escalation step of the alternative ladder; content is a placeholder, see claude.md",
                    content=LAST_RESORT_CONTENT,
                    buttons=buttons(btn("Continue", 17)))

# ===========================================================================
# Within-the-Operational-Window ladder (R7)
# ===========================================================================

# 13. Within window - find an alternative flight (same Action copy as node 9)
nodes["13"] = node(13, "Content", "Within window: find an alternative flight",
                    "R7 Within ladder, step 1 - alternative flight (same copy as the Outside ladder)",
                    content=action_block(ALT_FLIGHT_ACTION),
                    buttons=buttons(
                        btn("Alternative flight available", 15),
                        btn("Alternative flight is not available", 14),
                    ))

# 14. Within window - 24h new ticket sell
REBOOKING_ALERT = ("If the flight disruption is within the Operational Window (24 hours before "
                    "the start of the first segment), New Ticket Sell needs to be done using the "
                    "Rebooking Pass. Follow the guidelines as described in VI Rebooking Pass - "
                    "Shelf Pages.")
nodes["14"] = node(14, "Content", "Within window: 24h new ticket sell",
                    "R7 Within ladder, step 2 - new ticket sell via Rebooking Pass",
                    content=action_block(NEW_TICKET_ACTION) +
                            alert_block("Rebooking Pass required", REBOOKING_ALERT) +
                            note_block(NEW_TICKET_NOTE),
                    buttons=buttons(
                        btn("New ticket rebooking pass", 16),
                        btn("New ticket sell requiring accomodation Rebooking pass available", 16),
                        btn("No new ticket sell option", 11),
                    ))

# ===========================================================================
# 15/16/17 - tiny setter scripts parameterizing the shared R8 screen (node 20)
# (Zingtree-idiomatic pattern per patterns.md "Import safety & verification":
#  a tiny setter script is how several outcomes share one downstream screen.)
# ===========================================================================
def setter_script(outcome_code, comment):
    return (
        f'// {comment}\n'
        f'ZT.setFormData("vi_ladder_outcome", "{outcome_code}");\n'
    )

nodes["15"] = node(15, "Script", "Mark VI outcome: resolved, no follow-up",
                    "Sets vi_ladder_outcome=resolved for the ladder's plain-available buttons",
                    content=setter_script("resolved",
                        "Mark VI outcome: resolved, no follow-up.\n"
                        "// Reached from: Outside/Within \"Alternative flight available\", and\n"
                        "// Cancellation \"Refund offer\" - none of these need a grandchild (R11)."),
                    continuation_node_id="18")

nodes["16"] = node(16, "Script", "Mark VI outcome: resolved, follow-up needed",
                    "Sets vi_ladder_outcome=follow_up so node 23 adds one grandchild ticket (R11)",
                    content=setter_script("follow_up",
                        "Mark VI outcome: resolved, follow-up needed.\n"
                        "// Reached from every accommodation / new-ticket-sell / rebooking-pass\n"
                        "// button on both ladders - R11 [inferred]: these need a grandchild ticket."),
                    continuation_node_id="18")

nodes["17"] = node(17, "Script", "Mark VI outcome: last resort",
                    "Sets vi_ladder_outcome=last_resort",
                    content=setter_script("last_resort",
                        "Mark VI outcome: last resort (placeholder step, node 12)."),
                    continuation_node_id="18")

print("Nodes 1-17 built OK")

# ===========================================================================
# 18. Data - GET Edvin Errands (CO 182/183, verbatim, called once)
# ===========================================================================
nodes["18"] = node(18, "Data", "GET Edvin Errands", "Fetches the Edvin errand configuration once for the whole order (not per PNR)",
                    content="Continue", continuation_node_id="19",
                    data_connected_objects=dco(182, 183))

# ===========================================================================
# 19. Script - Resolve VI category & type groupings (adapted from parent node 46)
# ===========================================================================
SCRIPT_19 = r'''// Resolve VI category & type groupings.
// Adapted from the parent tree's node 46. Resolves the Edvin channel + category
// for this contact, then builds a type -> actions lookup so the two screens that
// follow (node 20 type select, node 22 action select) can be simple native
// dynamic selects with no cascading-select trick (see the OPEN QUESTION in the
// parent tree's claude.md - untested, so this build avoids it entirely).
//
// R3: the VI type list is never hardcoded here - types and their actions come
// straight from actions.edvin__errand_configuration for whichever category this
// contact reason maps to.
//
// ASSUMPTION (flag for Olga - mirrors parent doc Q2): "contact_reason__virtual_
// interlining" -> Edvin category "Virtual Interlining" is not yet confirmed by
// ETG. If Edvin's real category is named differently, only this map needs to
// change - nothing else in the tree hardcodes a category name.
const CONTACT_REASON_BY_ZENDESK = {
  "contact_reason__rebooking": "Rebooking",
  "contact_reason__cancellation": "Cancellation",
  "contact_reason__refund": "Refund",
  "contact_reason__name_correction_change": "Name correction/change",
  "contact_reason__add_passenger": "Add passenger/New ticket sell",
  "contact_reason__change_customers_personal_information": "Change customer's personal information",
  "contact_reason__document_travel_info": "Document & Travel info",
  "contact_reason__payment_question": "Payment Questions",
  "contact_reason__ancillaries_products": "Ancillaries/Services & Products",
  "contact_reason__unconfirmed_booking": "Unconfirmed booking",
  "contact_reason__site_support": "Site support",
  "contact_reason__ongoing_issues": "Ongoing issues",
  "contact_reason__other": "Other",
  "contact_reason__schedule_change": "Schedule Change",
  "contact_reason__virtual_interlining": "Virtual Interlining"
};
const CONTACT_REASON = CONTACT_REASON_BY_ZENDESK[ZT.getVariableValue("custom_field_29559177650834", "")] || "Virtual Interlining";

let errand_configuration = actions.edvin__errand_configuration;
let edvin_prop_long_val = actions.get_edvin_prop_long_value;

function findViCategory() {
  const channel = errand_configuration.channels.find(c => c.id === edvin_prop_long_val.value);
  const category = channel.categories.find(c => c.name === CONTACT_REASON);
  return { channel, category };
}

let result = findViCategory();
ZT.setTransformData("category", result.category);
ZT.setTransformData("channel", result.channel);

// Bucket normalization - identical to the parent tree's nodes 2/46 (KEEP IDENTICAL,
// same note applies: the id is the contract, the label is display text).
const BUCKET_BY_ID = { 3: "no_action", 4: "proceed", 5: "different_request" };
const BUCKET_BY_NAME = {
  "no action": "no_action", "no_action": "no_action", "do not proceed": "no_action",
  "proceed": "proceed",
  "different request": "different_request", "different_request": "different_request"
};
function bucketKey(b) {
  if (b && typeof b === "object" && b.id != null && BUCKET_BY_ID[b.id]) return BUCKET_BY_ID[b.id];
  const raw = typeof b === "string" ? b : (b && b.name) || "";
  if (!raw) return "";
  return BUCKET_BY_NAME[String(raw).trim().toLowerCase()] || raw;
}

const types = (result.category && result.category.types) || [];
const vi_type = [];
const actions_by_type = {};

types.forEach(type => {
  const typeId = String(type.id);
  vi_type.push({ id: type.id, name: type.name || "" });
  actions_by_type[typeId] = (type.actions || []).map(action => Object.assign({}, action, {
    bucket: bucketKey(action.bucket),
    actionId: action.id
  }));
});

ZT.setTransformData("vi_type", vi_type);
ZT.setTransformData("actions_by_type", actions_by_type);

ZT.log("VI type grouping | category=" + JSON.stringify(CONTACT_REASON) +
       " | types=" + types.length +
       " | actions_total=" + types.reduce((n, t) => n + (t.actions || []).length, 0));

const emptyTypes = vi_type.filter(t => !(actions_by_type[String(t.id)] || []).length);
if (emptyTypes.length) {
  ZT.log("WARNING VI type grouping: types with no actions from Edvin: " + JSON.stringify(emptyTypes.map(t => t.name)));
}
'''
nodes["19"] = node(19, "Script", "Resolve VI category & type groupings",
                    "Resolves the Edvin VI category, builds transforms.vi_type and actions_by_type (R3)",
                    content=SCRIPT_19, continuation_node_id="20")

# ===========================================================================
# 20. Content - Select VI type (native dynamic select, R3)
# ===========================================================================
nodes["20"] = node(20, "Content", "Select VI type",
                    "Native select sourced from transforms.vi_type (R3) - never hardcoded",
                    content="<p>Select the errand type for this VI order.</p>",
                    formfields=formfields(
                        ff("select", "vi_type_id", "Type:", required="1",
                           config='{"filterable":true,"list_source_type":"dynamic",'
                                  '"list_dynamic_source":{"type":"transforms","variable":"vi_type",'
                                  '"attributes":{"label":"name","value":"id"}}}'),
                    ),
                    buttons=buttons(btn("Continue", 21)))

# ===========================================================================
# 21. Script - Build VI action options for selected type
# ===========================================================================
SCRIPT_21 = r'''// Build VI action options for selected type.
// Plain lookup into node 19's actions_by_type grouping - avoids the untested
// same-node cascading-select trick noted in the parent tree's claude.md by
// doing the narrowing on its OWN node, in between two content nodes, instead.

let vi_type_id = ZT.getVariableValue("vi_type_id", "");
let actions_by_type = transforms.actions_by_type || {};
let vi_actions_array = actions_by_type[vi_type_id] || [];

ZT.setTransformData("vi_actions_array", vi_actions_array);

if (!vi_actions_array.length) {
  ZT.log("WARNING VI action options: no actions found for vi_type_id=" + JSON.stringify(vi_type_id));
}
'''
nodes["21"] = node(21, "Script", "Build VI action options for selected type",
                    "Sets transforms.vi_actions_array = actions_by_type[vi_type_id]",
                    content=SCRIPT_21, continuation_node_id="22")

# ===========================================================================
# 22. Content - Select customer action for this VI order (R8)
# ===========================================================================
nodes["22"] = node(22, "Content", "Select customer action for this VI order",
                    "Native select sourced from transforms.vi_actions_array; ONE action for the whole order (R8)",
                    content="<p>Select the customer action for the type you just chose. This action "
                            "applies to every PNR selected "
                            "on this order - if a PNR genuinely needs a different action, finish this "
                            "pass and use \"Register an additional request\" for it (R8).</p>",
                    formfields=formfields(
                        ff("select", "vi_action_id", "Customer action:", required="1",
                           config='{"filterable":true,"list_source_type":"dynamic",'
                                  '"list_dynamic_source":{"type":"transforms","variable":"vi_actions_array",'
                                  '"attributes":{"label":"name","value":"actionId"}}}'),
                        ff("multiline_full", "notes", "Agent notes:"),
                    ),
                    buttons=buttons(btn("Continue::zt_customer_action_selected", 23)))

# ===========================================================================
# 23. Script - Resolve VI type + action; build ticket & errand plan
#     (replaces the parent tree's node 27 - drastically simplified per R8/R11:
#      exactly one type+action for the whole order, so there is no per-PNR
#      grouping left to do.)
# ===========================================================================
SCRIPT_23 = r'''// Resolve VI type + action; build the ticket & errand plan.
// Replaces the parent tree's node 27. R8 forces exactly one type+action for the
// whole order, so there is no per-PNR grouping to do (R11 [inferred]) - this
// script just resolves the two picks, then builds ONE child/silent ticket and
// one Edvin-errand entry via the parent's exact node 27 dedup logic (R10, node 41).

function resolveName(list, id) {
  const match = (list || []).find(x => String(x.id) === String(id));
  return match ? match.name : "";
}

const selected_pnrs = transforms.selected_pnrs || [];
const vi_type_id = ZT.getVariableValue("vi_type_id", "");
const vi_action_id = ZT.getVariableValue("vi_action_id", "");
const vi_actions_array = transforms.vi_actions_array || [];

const vi_resolved_type = resolveName(transforms.vi_type, vi_type_id);
const selected_action = vi_actions_array.find(a => String(a.actionId) === String(vi_action_id)) || {};
const vi_resolved_action = selected_action.name || "";
const vi_resolved_bucket = selected_action.bucket || "";

ZT.setFormData("vi_resolved_type", vi_resolved_type);
ZT.setFormData("vi_resolved_action", vi_resolved_action);
ZT.setFormData("vi_resolved_bucket", vi_resolved_bucket);

const notes = ZT.getVariableValue("notes", "");
const partner_routing = ZT.getVariableValue("partner_routing", "");
const disruption_type = ZT.getVariableValue("disruption_type", "");
const delay_reason = ZT.getVariableValue("delay_reason", "");
const vi_ladder_outcome = ZT.getVariableValue("vi_ladder_outcome", "");
const channel = transforms.channel || {};
const category = transforms.category || {};

// selected_pnrs holds the FULL Find Order row objects (node 4), not bare PNR
// strings - joinPnrs reads the row's own .pnr field for display/titling.
const joinPnrs = pnrs => pnrs.map(p => p.pnr).join(", ");
const isProceed = vi_resolved_bucket === "proceed";

// One row per selected PNR, all sharing the same type+action (R8). Spreads the
// original Find Order row FIRST (so .id/.postSaleHandleType/.provider survive
// for any CX Action payload that needs them, matching the parent tree's node 2
// convention) then layers the VI-specific fields on top. Node 39's internal
// note reuses this shape unchanged from the parent tree's node 21.
const customer_action_pnrs = selected_pnrs.map(pnr => ({
  ...pnr,
  channel: channel.name || "",
  category: category.name || "",
  type: vi_resolved_type,
  customer_action: vi_resolved_action,
  bucket: vi_resolved_bucket,
  notes,
  partner_routing,
  disruption_type,
  delay_reason
}));
ZT.setTransformData("customer_action_pnrs", customer_action_pnrs);

// R11 [inferred]: a follow-up-flagged ladder outcome (accommodation / new ticket
// sell / rebooking pass) gets one grandchild against the single child ticket.
// Flag for Brent's sign-off - see claude.md and the requirements doc's A4.
const needs_followup = vi_ladder_outcome === "follow_up";
const grandchild_tickets = (isProceed && needs_followup) ? [{
  title: `Grandchild Ticket: ${joinPnrs(selected_pnrs)}`,
  pnr: joinPnrs(selected_pnrs),
  bucket: vi_resolved_bucket,
  category: category.name || "",
  customer_action: vi_resolved_action,
  type: vi_resolved_type,
  contact_reason: category.name || "",
  genesys_interaction_type: "N/A"
}] : [];

// R11 AC-11.1/AC-11.2: exactly one child (proceed) or one silent (anything else)
// ticket for the whole order, titled with every selected PNR.
const child_tickets = [{
  child_ticket: {
    title: `${isProceed ? "Child" : "Silent"} Ticket: ${joinPnrs(selected_pnrs)}`,
    pnr: joinPnrs(selected_pnrs),
    bucket: vi_resolved_bucket,
    category: category.name || "",
    customer_action: vi_resolved_action,
    type: vi_resolved_type,
    grandchild_tickets: grandchild_tickets
  }
}];
ZT.setTransformData("child_tickets", child_tickets);

const planned_ticket_titles = [child_tickets[0].child_ticket.title]
  .concat(grandchild_tickets.map(gc => gc.title));
ZT.setTransformData("planned_ticket_titles", planned_ticket_titles);

// R10 (Q1 answered 2026-08-05 - Brent: "register errand should work as it does
// in the existing register errand workflow"): feed node 41 EXACTLY the way the
// parent tree's node 27 feeds its node 44 - build one row per selected PNR, then
// dedupe to one representative row per DISTINCT (type + customer_action) pair,
// verbatim (groupByErrand / errandKey below are byte-identical to node 27's).
// No VI-specific errand logic exists here at all. Because R8 forces every PNR in
// a VI order onto the SAME type+action, this naturally collapses to exactly one
// entry - i.e. exactly one Edvin errand per order - using the parent's existing
// same-type+action-collapses-to-one-errand behavior, not a bespoke VI rule.
const errandKey = it => `${it.type || ""}|${it.customer_action || ""}`;
function groupByErrand(items) {
  const map = new Map();
  items.forEach(item => {
    const key = errandKey(item);
    if (!map.has(key)) map.set(key, []);
    map.get(key).push(item);
  });
  return [...map.values()];
}
const vi_final_pnrs = groupByErrand(customer_action_pnrs).map(group => group[0]);
ZT.setTransformData("vi_final_pnrs", vi_final_pnrs);
ZT.setTransformData("final_pnrs_count", 0);

const childCount = isProceed ? 1 : 0;
const silentCount = isProceed ? 0 : 1;
const child_tickets_note =
  `(Child Tickets: ${childCount}, Grand Child Tickets: ${grandchild_tickets.length}, Silent Tickets: ${silentCount})\n\n` +
  `**${isProceed ? "Child Ticket" : "Silent Ticket"}**: ${joinPnrs(selected_pnrs)},\n` +
  `  **Contact Reason**: ${category.name || ""},\n` +
  `  **Type**: ${vi_resolved_type},\n` +
  `  **Customer Action**: ${vi_resolved_action}`;
ZT.setTransformData("child_tickets_note", child_tickets_note);

ZT.log("VI plan | pnrs=" + JSON.stringify(selected_pnrs) +
       " | type=" + JSON.stringify(vi_resolved_type) +
       " | action=" + JSON.stringify(vi_resolved_action) +
       " | bucket=" + JSON.stringify(vi_resolved_bucket) +
       " | ladder_outcome=" + JSON.stringify(vi_ladder_outcome) +
       " | grandchildren=" + grandchild_tickets.length);
'''
nodes["23"] = node(23, "Script", "Resolve VI type + action; build ticket & errand plan",
                    "Simplifies the parent's node 27 for R8's one-shared-type+action-per-order rule; "
                    "the R10 errand plan reuses the parent's exact node 27 dedup-by-type+action logic",
                    content=SCRIPT_23, continuation_node_id="24")

print("Nodes 18-23 built OK")

# ===========================================================================
# 24-38: child/grandchild ticket-creation subsystem.
# Ported VERBATIM (script bodies unchanged) from the parent tree's nodes
# 3,13,14,32,33,35,36,37,38,39,40,41,15,16,34 - renumbered only. None of these
# scripts reference passengers, so removing per-PNR passenger capture (R2)
# required no changes here. This is the safest possible port: every CR-007
# through CR-012 idempotency fix (attempted_*_keys guards, clamp+reset cursors)
# carries over unmodified per R1/AC-1.1.
# ===========================================================================

# 24. Scoring - Any child tickets to create? (verbatim parent node 3)
nodes["24"] = node(24, "Scoring", "Any child tickets to create?", "Any child tickets to create?",
                    advanced_logic_node="1",
                    buttons=buttons(
                        btn("len(transforms.child_tickets) >= 1", 25, logic_expression="len(transforms.child_tickets) >= 1"),
                        btn("", 39, op="def"),
                    ),
                    continuation_node_id="39")

# 25. Script - Loop Child Tickets (verbatim parent node 32)
nodes["25"] = node(25, "Script", "Loop child tickets", "Cursor over transforms.child_tickets (always exactly one entry in this tree)",
                    content=base_nodes["32"]["content"], continuation_node_id="26")

# 26. Scoring - Ticket already created? (verbatim parent node 13)
nodes["26"] = node(26, "Scoring", "Ticket already created?",
                    "Idempotency guard (v12): skip the create call if child_ticket_already_created is true",
                    advanced_logic_node="1",
                    buttons=buttons(
                        btn("child_ticket_already_created == true", 29, logic_expression="child_ticket_already_created == true"),
                        btn("", 28, op="def"),
                    ),
                    continuation_node_id="28")

# 27. Script - Mark child ticket created (verbatim parent node 14)
nodes["27"] = node(27, "Script", "Mark child ticket created",
                    "Records current_child_ticket.title in attempted_child_ticket_keys before the create call",
                    content=base_nodes["14"]["content"], continuation_node_id="29")

# 28. Data - ZD - Create Child Ticket (CO 157, verbatim)
nodes["28"] = node(28, "Data", "ZD - Create Child Ticket", "Creates the order's single child or silent ticket from transforms.child_ticket",
                    content="Use transformed data", continuation_node_id="27",
                    data_connected_objects=dco(157))

# 29. Scoring - Is Grand Children? (verbatim parent node 35 - op:eq style)
nodes["29"] = node(29, "Scoring", "Is Grand Children?", "Gates the grandchild-creation branch on is_grandchild_tickets",
                    buttons=buttons(
                        btn("is_grandchild_tickets", 30, button_data="true", op="eq"),
                        btn("", 38, op="def"),
                    ),
                    continuation_node_id="38")

# 30. Script - Set Side Conversation Parent Id (verbatim parent node 39)
nodes["30"] = node(30, "Script", "Set Side Conversation Parent Id", "Reads the side conversation id from node 28's create response",
                    content=base_nodes["39"]["content"], continuation_node_id="31")

# 31. Content - Child ticket created - creating grandchildren (verbatim parent node 41)
nodes["31"] = node(31, "Content", "Child ticket created - creating grandchildren",
                    "Child ticket created - creating grandchildren",
                    content=base_nodes["41"]["content"], continuation_node_id="32")

# 32. Data - Get Side Conversations (CO 181, verbatim)
nodes["32"] = node(32, "Data", "Get Side Conversations", "Polls Zendesk for the child ticket's backing side conversation",
                    content="is_grandchild_tickets eq true", continuation_node_id="33",
                    data_connected_objects=dco(181))

# 33. Script - Loop Grand Child Tickets (verbatim parent node 36)
nodes["33"] = node(33, "Script", "Loop Grand Child Tickets", "Cursor over the single child ticket's grandchild_tickets array",
                    content=base_nodes["36"]["content"], continuation_node_id="34")

# 34. Scoring - Grandchild ticket already created? (verbatim parent node 15)
nodes["34"] = node(34, "Scoring", "Grandchild ticket already created?",
                    "Idempotency guard (v12): skip the create call if grandchild_ticket_already_created is true",
                    advanced_logic_node="1",
                    buttons=buttons(
                        btn("grandchild_ticket_already_created == true", 37, logic_expression="grandchild_ticket_already_created == true"),
                        btn("grandchild_ticket_already_created == false", 36, logic_expression="grandchild_ticket_already_created == false"),
                    ),
                    continuation_node_id="36")

# 35. Script - Mark grandchild ticket created (verbatim parent node 16)
nodes["35"] = node(35, "Script", "Mark grandchild ticket created",
                    "Records current_grandchild_ticket.title in attempted_grandchild_ticket_keys before the create call",
                    content=base_nodes["16"]["content"], continuation_node_id="37")

# 36. Data - ZD - Create Grandchild Ticket (CO 180, verbatim)
nodes["36"] = node(36, "Data", "ZD - Create Grandchild Ticket", "Creates the follow-up grandchild ticket against the child ticket's side conversation",
                    content="Use transformed data", continuation_node_id="35",
                    data_connected_objects=dco(180))

# 37. Scoring - Is More Grand Child tickets? (verbatim parent node 38 - op:eq style)
nodes["37"] = node(37, "Scoring", "Is More Grand Child tickets?", "Loops node 33 until every grandchild in the array is created",
                    buttons=buttons(
                        btn("is_more_grandchild_tickets", 33, button_data="true", op="eq"),
                        btn("", 38, op="def"),
                    ),
                    continuation_node_id="38")

# 38. Scoring - Is More Child Tickets? (verbatim parent node 34)
nodes["38"] = node(38, "Scoring", "Is More Child Tickets?", "Loops node 25 until every entry in child_tickets is created (always 1 in this tree)",
                    advanced_logic_node="1",
                    buttons=buttons(
                        btn("is_more_child_tickets == true", 25, logic_expression="is_more_child_tickets == true"),
                        btn("", 39, op="def"),
                    ),
                    continuation_node_id="39")

print("Nodes 24-38 built OK")

# ===========================================================================
# 39. Script - Format Internal Note (adapted from parent node 21 - no passengers,
#     adds VI-specific fields: disruption_type, delay_reason, partner_routing)
# ===========================================================================
SCRIPT_39 = r'''// Format Internal Note - builds the internal note posted to the Zendesk parent
// ticket by node 40. Adapted from the parent tree's node 21: no passenger
// capture in this tree (R2 drops the per-PNR passenger screen), and three
// VI-specific fields are added (Disruption Type, Delay Reason, Booking Partner).
// The reconciliation-against-created-titles logic is unchanged from the parent.

const SHOW_CHILD_TICKET_SUMMARY = true;
const SHOW_ACTION_BUCKET = true;

const BUCKET_LABELS = {
  proceed: "Proceed",
  no_action: "Do not proceed",
  escalate: "Escalate to support",
  different_request: "Different request"
};

function bucketLabel(raw) {
  const key = String(raw || "").trim().toLowerCase();
  if (!key) return "UNRESOLVED - action selection did not resolve.";
  return BUCKET_LABELS[key] || raw;
}

function g(name, fallback) {
  const v = ZT.getVariableValue(name, "");
  return v === "" || v === null || v === undefined ? fallback : v;
}

const genesys_conversation_id = g("custom_field_31975964556050", "N/A");
const genesys_interaction_type = g("custom_field_31213052370194", "N/A");
const contact_reason = g("custom_field_29559177650834", "N/A");
const language = g("custom_field_28137345621650", "N/A");
const zendesk_ticket_id = g("zd_ticket_id", "N/A");
const order_reference = g("orderReference", g("custom_field_33772689958162", "N/A"));

const pnr_records = transforms.customer_action_pnrs || [];

const PNR_FIELDS = [
  { label: "Channel", key: "channel" },
  { label: "Category", key: "category" },
  { label: "Type", key: "type" },
  { label: "Customer Action", key: "customer_action" },
  { label: "Disruption Type", key: "disruption_type" },
  { label: "Delay Reason", key: "delay_reason" },
  { label: "Booking Partner", key: "partner_routing" },
  { label: "Notes", key: "notes" }
];

let internal_note_details = "";

pnr_records.forEach(record => {
  let block = `**PNR**: ${record.pnr}\n`;
  const lines = [];
  PNR_FIELDS.forEach(({ label, key }) => {
    if (record[key] != null && record[key] !== "") {
      lines.push(`**${label}**: ${record[key]}`);
    }
    if (key === "customer_action" && SHOW_ACTION_BUCKET) {
      lines.push(`**Customer Action Bucket**: ${bucketLabel(record.bucket)}`);
    }
  });
  block += lines.join("\n");
  internal_note_details += block + "\n\n";
});

if (!pnr_records.length) {
  internal_note_details += "_No PNR actions were recorded for this session._\n\n";
  ZT.log("WARNING internal-note: customer_action_pnrs was empty at node 39.");
}

internal_note_details += `
  **Order Reference**: ${order_reference},
  **Genesys Conversation ID**: ${genesys_conversation_id},
  **Genesys Interaction Type**: ${genesys_interaction_type},
  **Ticket ID**: ${zendesk_ticket_id}
`;

if (SHOW_CHILD_TICKET_SUMMARY) {
  internal_note_details += `
  **Child Ticket Summary**:

  ${transforms.child_tickets_note || ""}
  `;
}

const planned_titles = transforms.planned_ticket_titles || [];
const created_titles = (transforms.created_child_ticket_keys || [])
  .concat(transforms.created_grandchild_ticket_keys || []);
const missing_titles = planned_titles.filter(t => created_titles.indexOf(t) === -1);

if (missing_titles.length) {
  internal_note_details += `
  > **WARNING - ${missing_titles.length} ticket(s) in the summary above were not confirmed created by Zendesk**: ${missing_titles.join("; ")}. Check the ticket list before relying on them, and report this with the ticket id.
  `;
  ZT.log("WARNING internal-note: planned tickets not confirmed created: " + JSON.stringify(missing_titles));
}

ZT.setTransformData("internal_note_details", internal_note_details);
ZT.log("internal-note | pnr_blocks=" + pnr_records.length +
       " | pnrs=" + JSON.stringify(pnr_records.map(r => r.pnr)) +
       " | bucket_shown=" + SHOW_ACTION_BUCKET);
'''
nodes["39"] = node(39, "Script", "Format Internal Note",
                    "Builds the internal note text (no passengers - R2; adds disruption/delay/partner fields)",
                    content=SCRIPT_39, continuation_node_id="40")

# ===========================================================================
# 40. Data - Zendesk - Add Internal Note (CO 178, verbatim)
# ===========================================================================
nodes["40"] = node(40, "Data", "Zendesk - Add Internal Note", "Posts node 39's formatted note to the Zendesk parent ticket",
                    content="", continuation_node_id="41", data_connected_objects=dco(178))

# ===========================================================================
# 41. Script - Loop VI errands to register. R10, unblocked 2026-08-05 (Q1
#     answered - Brent: "register errand should work as it does in the
#     existing register errand workflow"). Verbatim port of the parent
#     tree's node 44 - same type|action idempotency key, unmodified.
# ===========================================================================
SCRIPT_41 = r'''// Loop VI errands to register.
// Cursor over transforms.vi_final_pnrs - built by node 23 using the parent
// tree's EXACT node 27 dedup (one representative row per distinct type+action).
// Node 43 fires the Edvin registerErrand request (CO #184) immediately after.
//
// R10 (Q1 answered 2026-08-05 - Brent, quoting ETG: "register errand should
// work as it does in the existing register errand workflow"). This script is
// the parent tree's node 44, UNCHANGED in mechanism - same clamp+reset cursor,
// same registered_errand_keys idempotency guard keyed on type|customer_action,
// same message fields. No VI-specific errand logic exists here. Because R8
// forces every selected PNR onto one shared type+action, node 23's dedup always
// hands this loop exactly one entry per VI order - so this naturally registers
// exactly one Edvin errand per order, the same way the parent tree already
// collapses to one errand whenever multiple PNRs happen to share a type+action.
// AC-10.1 (one errand payload naming every PNR) is NOT built - Q1 confirmed
// Edvin's registerErrand does not support that; only the errand-per-distinct-
// pair shape the parent tree already has is used here.

let vi_final_pnrs = transforms.vi_final_pnrs || [];
let final_pnrs_count = transforms.final_pnrs_count || 0;
if (final_pnrs_count >= vi_final_pnrs.length) final_pnrs_count = 0;
let current_pnr = vi_final_pnrs[final_pnrs_count];
let is_more_vi_errands = true;

final_pnrs_count++;
if (final_pnrs_count >= vi_final_pnrs.length) {
  is_more_vi_errands = false;
  final_pnrs_count = 0;
}

// Idempotency guard - IDENTICAL key to the parent tree's node 44 (type +
// customer_action), not the PNR. Recorded BEFORE node 43 fires, cleared only by
// node 1 (fresh start) and node 48 (additional/different request), never by
// node 23 - a Back-nav replay must not re-register an errand Edvin already holds.
let registered_errand_keys = transforms.registered_errand_keys || [];
let errand_key = current_pnr ? `${current_pnr.type || ""}|${current_pnr.customer_action || ""}` : "";
let skip_errand_registration = !current_pnr || registered_errand_keys.includes(errand_key);
ZT.setFormData("skip_errand_registration", skip_errand_registration);

if (!skip_errand_registration) {
  registered_errand_keys.push(errand_key);
  ZT.setTransformData("registered_errand_keys", registered_errand_keys);
}

function g(name, fallback) {
  const v = ZT.getVariableValue(name, "");
  return v === "" || v === null || v === undefined ? (fallback || "") : v;
}

function firstOf(names) {
  for (let i = 0; i < names.length; i++) {
    const v = ZT.getVariableValue(names[i], "");
    if (v) return { name: names[i], value: v };
  }
  return { name: null, value: "" };
}

const agentName = firstOf(["agent_name", "current_user_name", "zendesk_agent_name", "requester_name"]);
const agentEmail = firstOf(["agent_email", "current_user_email", "zendesk_agent_email", "requester_email"]);

const ctx = {
  orderReference: g("orderReference") || g("custom_field_33772689958162") ||
                  ((actions.findorder && actions.findorder.orderReference) || ""),
  zendeskTicketId: g("zd_ticket_id", "N/A"),
  genesysConversationId: g("custom_field_31975964556050", "N/A"),
  genesysInteractionType: g("custom_field_31213052370194", "N/A"),
  contactReason: g("custom_field_29559177650834", "N/A"),
  language: g("custom_field_28137345621650", "N/A"),
  channel: g("channel", ""),
  agentName: agentName.value || "N/A",
  agentEmail: agentEmail.value || "N/A",
  partnerRouting: g("partner_routing", "N/A"),
  disruptionType: g("disruption_type", "N/A"),
  delayReason: g("delay_reason", "N/A"),
  ladderOutcome: g("vi_ladder_outcome", "N/A")
};

// Passengers are not captured in this tree (R2 drops the per-PNR passenger
// screen) - passengerLines is kept anyway, verbatim from the parent tree's
// node 44, so this script needs no further edit if passenger capture ever
// comes back. It always resolves to "" here and the row is dropped below.
function passengerLines(pnrRecord) {
  return ((pnrRecord && pnrRecord.passengers) || [])
    .map(p => [p.passengerFirstName, p.passengerLastName].filter(Boolean).join(" "))
    .filter(Boolean)
    .join("; ");
}

function buildErrandMessage(pnrRecord) {
  const rec = pnrRecord || {};
  const rows = [
    ["Type", rec.type],
    ["Customer Action", rec.customer_action],
    ["PNR", rec.pnr],
    ["Passengers", passengerLines(rec)],
    ["Channel", rec.channel || ctx.channel],
    ["Contact Reason", rec.category || ctx.contactReason],
    ["Language", ctx.language],
    ["Order Reference", ctx.orderReference],
    ["Booking Partner", ctx.partnerRouting],
    ["Disruption Type", ctx.disruptionType],
    ["Delay Reason", ctx.delayReason],
    ["Ladder Outcome", ctx.ladderOutcome],
    ["Agent Notes", rec.notes ? String(rec.notes).trim() : ""],
    ["Handled By", ctx.agentName === "N/A" ? "" : ctx.agentName + (ctx.agentEmail === "N/A" ? "" : " <" + ctx.agentEmail + ">")],
    ["Zendesk Ticket", ctx.zendeskTicketId],
    ["Genesys Conversation ID", ctx.genesysConversationId],
    ["Genesys Interaction Type", ctx.genesysInteractionType]
  ].filter(row => row[1] !== null && row[1] !== undefined && String(row[1]).trim() !== "" && row[1] !== "N/A");

  return rows.map(row => row[0] + ": " + row[1]).join("\n");
}

const errandMessage = buildErrandMessage(current_pnr);
const EDVIN_MESSAGE_KEY = "errand_message";

if (current_pnr && typeof current_pnr === "object") {
  current_pnr = Object.assign({}, current_pnr, {
    orderReference: ctx.orderReference,
    orderId: current_pnr.orderId || ((actions.findorder && actions.findorder.orderId) || "")
  });
  current_pnr[EDVIN_MESSAGE_KEY] = errandMessage;
}

if (!ctx.orderReference) {
  ZT.log("WARNING register-vi-errand: no orderReference available for PNR " + (current_pnr && current_pnr.pnr));
}

ZT.log("register-vi-errand item | pnr=" + (current_pnr && current_pnr.pnr) +
       " | skip=" + skip_errand_registration +
       " | key=" + JSON.stringify(errand_key) +
       " | type=" + JSON.stringify(current_pnr && current_pnr.type) +
       " | action=" + JSON.stringify(current_pnr && current_pnr.customer_action) +
       " | bucket=" + JSON.stringify(current_pnr && current_pnr.bucket));

ZT.setTransformData("final_pnrs_count", final_pnrs_count);
ZT.setFormData("is_more_vi_errands", is_more_vi_errands);
ZT.setFormData("orderReference", ctx.orderReference);
ZT.setTransformData(EDVIN_MESSAGE_KEY, errandMessage);
ZT.setFormData(EDVIN_MESSAGE_KEY, errandMessage);
ZT.setFormData("genesys_conversation_id", ctx.genesysConversationId);
ZT.setFormData("genesys_interaction_type", ctx.genesysInteractionType);
ZT.setFormData("zendesk_ticket_id", ctx.zendeskTicketId);
ZT.setFormData("language", ctx.language);
ZT.setTransformData("current_pnr", current_pnr);
'''
nodes["41"] = node(41, "Script", "Loop VI errands to register",
                    "Verbatim port of the parent's node 44 (same clamp/reset cursor, same type+action "
                    "idempotency key) - R10, unblocked 2026-08-05",
                    content=SCRIPT_41, continuation_node_id="42")

# 42. Scoring - Errand already registered? (adapted parent node 17 - same shape)
nodes["42"] = node(42, "Scoring", "Errand already registered?",
                    "Skips node 43 when this type+action pair was already registered on an earlier pass",
                    advanced_logic_node="1",
                    buttons=buttons(
                        btn("skip_errand_registration == true", 44, logic_expression="skip_errand_registration == true"),
                        btn("skip_errand_registration == false", 43, logic_expression="skip_errand_registration == false"),
                    ),
                    continuation_node_id="43")

# 43. Data - Edvin - Register Errand (CO 184, verbatim)
nodes["43"] = node(43, "Data", "Edvin - Register Errand", "Registers the current errand in node 41's loop - R10, unblocked, unmodified from the parent tree",
                    content="Handle response", continuation_node_id="44",
                    data_connected_objects=dco(184))

# 44. Scoring - More errands to register? (adapted parent node 45 - op:eq style)
nodes["44"] = node(44, "Scoring", "More errands to register?", "Loops node 41 until every selected PNR has its own errand registered",
                    buttons=buttons(
                        btn("is_more_vi_errands", 41, button_data="true", op="eq"),
                        btn("", 45, op="def"),
                    ),
                    continuation_node_id="45")

print("Nodes 39-44 built OK")

# ===========================================================================
# 45-49: closing block. Ported verbatim from the parent tree's nodes 23,47,49,29,48.
# ===========================================================================

# 45. Content - Closing Call (verbatim parent node 23)
nodes["45"] = node(45, "Content", "Closing Call", "Offers Additional Request / Different Request / End Session, same as the parent tree",
                    content=base_nodes["23"]["content"],
                    buttons=buttons(
                        btn("Additional Request::zt_additional_request", 46),
                        btn("Different Request::zt_different_request", 47),
                        btn("End Session::zt_completed", 49),
                    ))

# 46. Content - Additional request (verbatim parent node 47)
nodes["46"] = node(46, "Content", "Additional request", "Agent picks a new contact reason, then Continue re-enters at node 48",
                    content=base_nodes["47"]["content"],
                    formfields=dict(base_nodes["47"]["formfields"]),
                    buttons=buttons(btn("Continue", 48)))

# 47. Content - Different request (verbatim parent node 49)
nodes["47"] = node(47, "Content", "Different request", "Agent picks a new contact reason for an unrelated request, then re-enters at node 48",
                    content=base_nodes["49"]["content"],
                    formfields=dict(base_nodes["49"]["formfields"]),
                    buttons=buttons(btn("Continue", 48)))

# 48. Script - Clear Data (adapted from parent node 29 - VI-specific resets)
SCRIPT_48 = r'''// Clear Data - re-entry reset for "Additional Request" / "Different Request".
// Adapted from the parent tree's node 29. Re-enters at node 2 (Find Order)
// without passing through node 1's root reset, so anything node 1 resets and
// this node does not will leak into the second pass. Mirrors node 1 exactly
// except it must NOT touch inbound query params (same restriction as the
// parent tree's node 29 vs node 10).

ZT.setTransformData("selected_pnrs", []);
ZT.setFormData("partner_routing", "");
ZT.setFormData("disruption_type", "");
ZT.setFormData("delay_reason", "");
ZT.setFormData("vi_ladder_outcome", "");
ZT.setFormData("vi_type_id", "");
ZT.setFormData("vi_action_id", "");
ZT.setFormData("notes", "");
ZT.setTransformData("vi_type", []);
ZT.setTransformData("actions_by_type", {});
ZT.setTransformData("vi_actions_array", []);
ZT.setFormData("vi_resolved_type", "");
ZT.setFormData("vi_resolved_action", "");
ZT.setFormData("vi_resolved_bucket", "");
ZT.setTransformData("customer_action_pnrs", []);
ZT.setTransformData("vi_final_pnrs", []);
ZT.setTransformData("final_pnrs_count", 0);
ZT.setTransformData("internal_note_details", ``);

ZT.setTransformData("child_tickets", []);
ZT.setTransformData("child_ticket", {});
ZT.setTransformData("current_child_ticket", {});
ZT.setTransformData("created_child_ticket_keys", []);
ZT.setTransformData("created_grandchild_ticket_keys", []);
// v35-inherited guard lists (see claude.md): must clear together with the
// created_* lists above or a genuinely new pass over the same PNRs is
// suppressed.
ZT.setTransformData("attempted_child_ticket_keys", []);
ZT.setTransformData("attempted_grandchild_ticket_keys", []);
ZT.setTransformData("registered_errand_keys", []);
ZT.setTransformData("planned_ticket_titles", []);
ZT.setTransformData("child_tickets_note", ``);
ZT.setFormData("skip_errand_registration", false);
ZT.setFormData("child_ticket_already_created", false);
ZT.setFormData("grandchild_ticket_already_created", false);

ZT.setFormData("child_tickets_count", 0);
ZT.setFormData("grandchild_tickets_count", 0);
ZT.setFormData("is_more_vi_errands", false);
ZT.setFormData("is_more_child_tickets", false);
ZT.setFormData("is_grandchild_tickets", false);
ZT.setFormData("is_more_grandchild_tickets", false);
ZT.setFormData("grandchild_parent_id", "");
ZT.setFormData("side_conversation_id", "");
'''
nodes["48"] = node(48, "Script", "Clear Data", "Clear session state, then start a fresh order lookup",
                    content=SCRIPT_48, continuation_node_id="2")

# 49. Content - End Session (verbatim parent node 48)
nodes["49"] = node(49, "Content", "End Session", "Terminal node - session complete",
                    content=base_nodes["48"]["content"])

print("Nodes 45-49 built OK. Total nodes:", len(nodes))

# ===========================================================================
# Assemble the tree object
# ===========================================================================

predefined_vars = {}
pv_names = [
    "is_grandchild_tickets", "is_more_grandchild_tickets", "is_more_child_tickets",
    "is_more_vi_errands", "skip_errand_registration", "child_ticket_already_created",
    "grandchild_ticket_already_created", "is_outside_window", "is_within_window",
    "custom_field_29559177650834", "custom_field_33772689958162",
    "custom_field_31975964556050", "custom_field_31213052370194",
    "custom_field_28137345621650",
]
for i, name in enumerate(pv_names):
    predefined_vars[str(i)] = {
        "id": 0, "project_id": 0, "project_node_id": 0, "type": "predefined",
        "name": name, "label": "", "label_type": "", "options": "", "hidden_value": "",
        "custom_regex": "", "inline": 0, "required": False, "score_var": "",
        "checkbox_score": 1, "scores": "", "rank": 0, "config": None,
    }

tree = dict(base)
for k in ("nodes", "predefined_vars"):
    pass
tree["id"] = ""  # left blank deliberately - see delivery note: import as a NEW tree
tree["name"] = "Register Errands - VI"
tree["description"] = ("VI (Virtual Interlining) errand registration. Forked from Register Errands - "
                        "Dynamic (v35 replay idempotency 2026-08-05), tree 595124299, with the PNR loop "
                        "removed per the 2026-08-04 ETG call. See the claude.md node (5) for full detail.")
tree["tags"] = "vi_errand_testing"
tree["root_node_id"] = "1"
tree["live"] = "0"
tree["active"] = "1"
tree["create_date"] = "2026-08-05T00:00:00.000000Z"
tree["last_opened"] = "2026-08-05T00:00:00.000000Z"
tree["last_modified"] = "2026-08-05 00:00:00"
tree["persist_names"] = "Clear Data"
tree["persist_node_ids"] = "48"
tree["nodes"] = nodes
tree["predefined_vars"] = predefined_vars
# css_include, org_id, template, keep_vars_on_back, merge_vars_not_fixed,
# hide_back_button, show_restart_button, show_subtree_persistent_buttons, etc.
# are all inherited unchanged from the base tree via dict(base) above.

with open(OUT_PATH, "w") as fh:
    json.dump(tree, fh, indent=1)

print("WROTE", OUT_PATH)
print("Total node count:", len(nodes))
