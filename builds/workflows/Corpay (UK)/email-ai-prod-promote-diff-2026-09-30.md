========================================================================
WORKFLOW DIFF — Email Automation - AI Actions Prod
========================================================================

Before : Email Automation - AI Actions Prod (promote 2026-09-24).json  (51 nodes)
After  : Email Automation - AI Actions Prod (promote 2026-09-30).json  (58 nodes)

## PLAIN SUMMARY

36 of 58 nodes are byte-for-byte identical to the original (62% untouched).
7 nodes added, 0 removed, 0 renumbered, 15 modified.

In plain terms:
  + NEW      node 22 — Reply details needed? [Scoring]
  + NEW      node 23 — Add the details the reply needs [Content]
  + NEW      node 54 — Case review dashboard - FAST Admin [Content]
  + NEW      node 55 — GDPR response - non-authorised contact [Content]
  + NEW      node 57 — Write authorised contacts into GDPR reply [Script]
  + NEW      node 58 — Capture last owner queue [Script]
  + NEW      node 59 — Provide the authorised contacts for this account [Content]
  * CHANGED  node 2 — Get case and inbound email [Data]
               - continuation_node_id: 3 → 58 — Get case and inbound email
  * CHANGED  node 3 — Account linked to case? [Scoring]
               - button added/changed: "actions.get_case_details__prod.records[0].AccountId != null" → node 5 [logic: actions.get_case_details__prod.records[0].AccountId != null]
               - button removed/replaced: "actions.get_case_details__prod.records[0].Account" → node 5
  * CHANGED  node 6 — Check AI eligibility [Script]
               - script code changed (32 → 33 lines) — Check AI eligibility
  * CHANGED  node 8 — Resolve queue route [Script]
               - script code changed (28 → 27 lines) — Resolve queue route
  * CHANGED  node 11 — Queue not in scope [Content]
               - content changed (240 → 243 characters) — Queue not in scope
  * CHANGED  node 17 — Build case review dashboard [Script]
               - script code changed (256 → 292 lines) — Build case review dashboard
               - continuation_node_id: 30 → 54 — Build case review dashboard
  * CHANGED  node 19 — Grade intent and build validation screen [Script]
               - script code changed (185 → 201 lines) — Grade intent and build validation screen
  * CHANGED  node 24 — Set case origin and template key [Script]
               - node_name: "Stamps sf_Origin and resolves the template key the generation ac" → "Stamps sf_Origin, resolves the template key and which reply deta"
               - script code changed (35 → 47 lines) — Set case origin and template key
               - continuation_node_id: 25 → 22 — Set case origin and template key
  * CHANGED  node 26 — Build case review dashboard [Script]
               - node_name: "Maps intent -> Topic/Sub Topic, sets HtmlBody, has_multiple_inte" → "Writes screen 23's answers into the draft, then builds the dashb"
               - script code changed (279 → 297 lines) — Build case review dashboard
  * CHANGED  node 32 — Choose the Topic and Sub Topic [Content]
               - content changed (42 → 49 characters) — Choose the Topic and Sub Topic
  * CHANGED  node 33 — Make manual changes [Content]
               - score_var: (empty) → ai_suggested_email
  * CHANGED  node 44 — Test mode - pick a scenario [Content]
               - form field settings changed (same field names)
  * CHANGED  node 45 — Load example email [Script]
               - script code changed (130 → 146 lines) — Load example email
  * CHANGED  node 47 — Seed mocked Salesforce data [Script]
               - script code changed (101 → 103 lines) — Seed mocked Salesforce data
               - continuation_node_id: 3 → 58 — Seed mocked Salesforce data
  * CHANGED  node 48 — claude.md [Content]
               - content changed (595 → 694 lines) — claude.md

## TREE SHAPE

  node type                before    after    delta
  AI_Action                     4        4       +0
  Content                      17       21       +4
  Data                          4        4       +0
  Email                         1        1       +0
  Scoring                      11       12       +1
  Script                       14       16       +2
  TOTAL                        51       58       +7

  Root node unchanged (node 2).

## STRUCTURAL SANITY

  No broken links introduced.
  No nodes became unreachable.
  Pre-existing in the BEFORE tree (not caused by this edit): 0 broken link(s), 6 unreachable node(s).

## UNTOUCHED NODES (36)

  1, 4, 5, 7, 9, 10, 12, 13, 14, 15, 16, 18, 20, 21, 25, 27, 28, 29, 30, 31, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 46, 49, 50, 51, 52, 53

## TREE-LEVEL SETTINGS CHANGED (2)

  predefined_vars: {"0": {"checkbox_score": 1, "config": null, "custom_regex": "", "hidden_value": "", "id": 810336, "inline": 0, "label": "", "label_type": "", "name": "ai_account_eligibility", "options": "", "project_id": 417189428, "project_node_id": 0, "rank": 0, "required": false, "score_var": "", "scores": "", "type": "predefined"}, "1": {"checkbox_score": 1, "config": null, "custom_regex": "", "hidden_value": "", "id": 810337, "inline": 0, "label": "", "label_type": "", "name": "ai_bypass_reason", "options": "", "project_id": 417189428, "project_node_id": 0, "rank": 0, "required": false, "score_var": "", "scores": "", "type": "predefined"}, "10": {"checkbox_score": 1, "config": null, "custom_regex": "", "hidden_value": "", "id": 810346, "inline": 0, "label": "", "label_type": "", "name": "email_analysis_route", "options": "", "project_id": 417189428, "project_node_id": 0, "rank": 0, "required": false, "score_var": "", "scores": "", "type": "predefined"}, "11": {"checkbox_score": 1, "config": null, "custom_regex": "", "hidden_value": "", "id": 810347, "inline": 0, "label": "", "label_type": "", "name": "sf_Topic__c", "options": "", "project_id": 417189428, "project_node_id": 0, "rank": 0, "required": false, "score_var": "", "scores": "", "type": "predefined"}, "12": {"checkbox_score": 1, "config": null, "custom_regex": "", "hidden_value": "", "id": 810348, "inline": 0, "label": "", "label_type": "", "name": "sf_Sub_Topic__c", "options": "", "project_id": 417189428, "project_node_id": 0, "rank": 0, "required": false, "score_var": "", "scores": "", "type": "predefined"}, "13": {"checkbox_score": 1, "config": null, "custom_regex": "", "hidden_value": "", "id": 810349, "inline": 0, "label": "", "label_type": "", "name": "email_intent", "options": "", "project_id": 417189428, "project_node_id": 0, "rank": 0, "required": false, "score_var": "", "scores": "", "type": "predefined"}, "14": {"checkbox_score": 1, "config": null, "custom_regex": "", "hidden_value": "", "id": 810350, "inline": 0, "label": "", "label_type": "", "name": "escalate_reason", "options": "", "project_id": 417189428, "project_node_id": 0, "rank": 0, "required": false, "score_var": "", "scores": "", "type": "predefined"}, "15": {"checkbox_score": 1, "config": null, "custom_regex": "", "hidden_value": "", "id": 810351, "inline": 0, "label": "", "label_type": "", "name": "sentiment", "options": "", "project_id": 417189428, "project_node_id": 0, "rank": 0, "required": false, "score_var": "", "scores": "", "type": "predefined"}, "16": {"checkbox_score": 1, "config": null, "custom_regex": "", "hidden_value": "", "id": 810352, "inline": 0, "label": "", "label_type": "", "name": "confidence_score", "options": "", "project_id": 417189428, "project_node_id": 0, "rank": 0, "required": false, "score_var": "", "scores": "", "type": "predefined"}, "17": {"checkbox_score": 1, "config": null, "custom_regex": "", "hidden_value": "", "id": 810353, "inline": 0, "label": "", "label_type": "", "name": "unmatched_summary", "options": "", "project_id": 417189428, "project_node_id": 0, "rank": 0, "required": false, "score_var": "", "scores": "", "type": "predefined"}, "18": {"checkbox_score": 1, "config": null, "custom_regex": "", "hidden_value": "", "id": 810354, "inline": 0, "label": "", "label_type": "", "name": "hc_requester_type", "options": "", "project_id": 417189428, "project_node_id": 0, "rank": 0, "required": false, "score_var": "", "scores": "", "type": "predefined"}, "19": {"checkbox_score": 1, "config": null, "custom_regex": "", "hidden_value": "", "id": 810355, "inline": 0, "label": "", "label_type": "", "name": "hc_response_variant", "options": "", "project_id": 417189428, "project_node_id": 0, "rank": 0, "required": false, "score_var": "", "scores": "", "type": "predefined"}, "2": {"checkbox_score": 1, "config": null, "custom_regex": "", "hidden_value": "", "id": 810338, "inline": 0, "label": "", "label_type": "", "name": "queue_source_value", "options": "", "project_id": 417189428, "project_node_id": 0, "rank": 0, "required": false, "score_var": "", "scores": "", "type": "predefined"}, "20": {"checkbox_score": 1, "config": null, "custom_regex": "", "hidden_value": "", "id": 810356, "inline": 0, "label": "", "label_type": "", "name": "hc_template_key", "options": "", "project_id": 417189428, "project_node_id": 0, "rank": 0, "required": false, "score_var": "", "scores": "", "type": "predefined"}, "21": {"checkbox_score": 1, "config": null, "custom_regex": "", "hidden_value": "", "id": 810357, "inline": 0, "label": "", "label_type": "", "name": "hc_agent_required", "options": "", "project_id": 417189428, "project_node_id": 0, "rank": 0, "required": false, "score_var": "", "scores": "", "type": "predefined"}, "22": {"checkbox_score": 1, "config": null, "custom_regex": "", "hidden_value": "", "id": 810358, "inline": 0, "label": "", "label_type": "", "name": "sf_Energy_Provider__c", "options": "", "project_id": 417189428, "project_node_id": 0, "rank": 0, "required": false, "score_var": "", "scores": "", "type": "predefined"}, "23": {"checkbox_score": 1, "config": null, "custom_regex": "", "hidden_value": "", "id": 810359, "inline": 0, "label": "", "label_type": "", "name": "sf_Data_Provider__c", "options": "", "project_id": 417189428, "project_node_id": 0, "rank": 0, "required": false, "score_var": "", "scores": "", "type": "predefined"}, "24": {"checkbox_score": 1, "config": null, "custom_regex": "", "hidden_value": "", "id": 810360, "inline": 0, "label": "", "label_type": "", "name": "sf_Origin", "options": "", "project_id": 417189428, "project_node_id": 0, "rank": 0, "required": false, "score_var": "", "scores": "", "type": "predefined"}, "3": {"checkbox_score": 1, "config": null, "custom_regex": "", "hidden_value": "", "id": 810339, "inline": 0, "label": "", "label_type": "", "name": "queue_route", "options": "", "project_id": 417189428, "project_node_id": 0, "rank": 0, "required": false, "score_var": "", "scores": "", "type": "predefined"}, "4": {"checkbox_score": 1, "config": null, "custom_regex": "", "hidden_value": "", "id": 810340, "inline": 0, "label": "", "label_type": "", "name": "queue_route_label", "options": "", "project_id": 417189428, "project_node_id": 0, "rank": 0, "required": false, "score_var": "", "scores": "", "type": "predefined"}, "5": {"checkbox_score": 1, "config": null, "custom_regex": "", "hidden_value": "", "id": 810341, "inline": 0, "label": "", "label_type": "", "name": "sf_Id", "options": "", "project_id": 417189428, "project_node_id": 0, "rank": 0, "required": false, "score_var": "", "scores": "", "type": "predefined"}, "6": {"checkbox_score": 1, "config": null, "custom_regex": "", "hidden_value": "", "id": 810342, "inline": 0, "label": "", "label_type": "", "name": "sf_Subject", "options": "", "project_id": 417189428, "project_node_id": 0, "rank": 0, "required": false, "score_var": "", "scores": "", "type": "predefined"}, "7": {"checkbox_score": 1, "config": null, "custom_regex": "", "hidden_value": "", "id": 810343, "inline": 0, "label": "", "label_type": "", "name": "sf_CaseNumber", "options": "", "project_id": 417189428, "project_node_id": 0, "rank": 0, "required": false, "score_var": "", "scores": "", "type": "predefined"}, "8": {"checkbox_score": 1, "config": null, "custom_regex": "", "hidden_value": "", "id": 810344, "inline": 0, "label": "", "label_type": "", "name": "sf_ContactId", "options": "", "project_id": 417189428, "project_node_id": 0, "rank": 0, "required": false, "score_var": "", "scores": "", "type": "predefined"}, "9": {"checkbox_score": 1, "config": null, "custom_regex": "", "hidden_value": "", "id": 810345, "inline": 0, "label": "", "label_type": "", "name": "intent_in_scope", "options": "", "project_id": 417189428, "project_node_id": 0, "rank": 0, "required": false, "score_var": "", "scores": "", "type": "predefined"}} → {"0": {"checkbox_score": 1, "config": null, "custom_regex": "", "hidden_value": "", "id": 818258, "inline": 0, "label": "", "label_type": "", "name": "ai_account_eligibility", "options": "", "project_id": 417189428, "project_node_id": 0, "rank": 0, "required": false, "score_var": "", "scores": "", "type": "predefined"}, "1": {"checkbox_score": 1, "config": null, "custom_regex": "", "hidden_value": "", "id": 818259, "inline": 0, "label": "", "label_type": "", "name": "ai_bypass_reason", "options": "", "project_id": 417189428, "project_node_id": 0, "rank": 0, "required": false, "score_var": "", "scores": "", "type": "predefined"}, "10": {"checkbox_score": 1, "config": null, "custom_regex": "", "hidden_value": "", "id": 818268, "inline": 0, "label": "", "label_type": "", "name": "email_analysis_route", "options": "", "project_id": 417189428, "project_node_id": 0, "rank": 0, "required": false, "score_var": "", "scores": "", "type": "predefined"}, "11": {"checkbox_score": 1, "config": null, "custom_regex": "", "hidden_value": "", "id": 818269, "inline": 0, "label": "", "label_type": "", "name": "sf_Topic__c", "options": "", "project_id": 417189428, "project_node_id": 0, "rank": 0, "required": false, "score_var": "", "scores": "", "type": "predefined"}, "12": {"checkbox_score": 1, "config": null, "custom_regex": "", "hidden_value": "", "id": 818270, "inline": 0, "label": "", "label_type": "", "name": "sf_Sub_Topic__c", "options": "", "project_id": 417189428, "project_node_id": 0, "rank": 0, "required": false, "score_var": "", "scores": "", "type": "predefined"}, "13": {"checkbox_score": 1, "config": null, "custom_regex": "", "hidden_value": "", "id": 818271, "inline": 0, "label": "", "label_type": "", "name": "email_intent", "options": "", "project_id": 417189428, "project_node_id": 0, "rank": 0, "required": false, "score_var": "", "scores": "", "type": "predefined"}, "14": {"checkbox_score": 1, "config": null, "custom_regex": "", "hidden_value": "", "id": 818272, "inline": 0, "label": "", "label_type": "", "name": "escalate_reason", "options": "", "project_id": 417189428, "project_node_id": 0, "rank": 0, "required": false, "score_var": "", "scores": "", "type": "predefined"}, "15": {"checkbox_score": 1, "config": null, "custom_regex": "", "hidden_value": "", "id": 818273, "inline": 0, "label": "", "label_type": "", "name": "sentiment", "options": "", "project_id": 417189428, "project_node_id": 0, "rank": 0, "required": false, "score_var": "", "scores": "", "type": "predefined"}, "16": {"checkbox_score": 1, "config": null, "custom_regex": "", "hidden_value": "", "id": 818274, "inline": 0, "label": "", "label_type": "", "name": "confidence_score", "options": "", "project_id": 417189428, "project_node_id": 0, "rank": 0, "required": false, "score_var": "", "scores": "", "type": "predefined"}, "17": {"checkbox_score": 1, "config": null, "custom_regex": "", "hidden_value": "", "id": 818275, "inline": 0, "label": "", "label_type": "", "name": "unmatched_summary", "options": "", "project_id": 417189428, "project_node_id": 0, "rank": 0, "required": false, "score_var": "", "scores": "", "type": "predefined"}, "18": {"checkbox_score": 1, "config": null, "custom_regex": "", "hidden_value": "", "id": 818276, "inline": 0, "label": "", "label_type": "", "name": "hc_requester_type", "options": "", "project_id": 417189428, "project_node_id": 0, "rank": 0, "required": false, "score_var": "", "scores": "", "type": "predefined"}, "19": {"checkbox_score": 1, "config": null, "custom_regex": "", "hidden_value": "", "id": 818277, "inline": 0, "label": "", "label_type": "", "name": "hc_response_variant", "options": "", "project_id": 417189428, "project_node_id": 0, "rank": 0, "required": false, "score_var": "", "scores": "", "type": "predefined"}, "2": {"checkbox_score": 1, "config": null, "custom_regex": "", "hidden_value": "", "id": 818260, "inline": 0, "label": "", "label_type": "", "name": "last_owner_queue_name", "options": "", "project_id": 417189428, "project_node_id": 0, "rank": 0, "required": false, "score_var": "", "scores": "", "type": "predefined"}, "20": {"checkbox_score": 1, "config": null, "custom_regex": "", "hidden_value": "", "id": 818278, "inline": 0, "label": "", "label_type": "", "name": "hc_template_key", "options": "", "project_id": 417189428, "project_node_id": 0, "rank": 0, "required": false, "score_var": "", "scores": "", "type": "predefined"}, "21": {"checkbox_score": 1, "config": null, "custom_regex": "", "hidden_value": "", "id": 818279, "inline": 0, "label": "", "label_type": "", "name": "hc_agent_required", "options": "", "project_id": 417189428, "project_node_id": 0, "rank": 0, "required": false, "score_var": "", "scores": "", "type": "predefined"}, "22": {"checkbox_score": 1, "config": null, "custom_regex": "", "hidden_value": "", "id": 818280, "inline": 0, "label": "", "label_type": "", "name": "sf_Energy_Provider__c", "options": "", "project_id": 417189428, "project_node_id": 0, "rank": 0, "required": false, "score_var": "", "scores": "", "type": "predefined"}, "23": {"checkbox_score": 1, "config": null, "custom_regex": "", "hidden_value": "", "id": 818281, "inline": 0, "label": "", "label_type": "", "name": "sf_Data_Provider__c", "options": "", "project_id": 417189428, "project_node_id": 0, "rank": 0, "required": false, "score_var": "", "scores": "", "type": "predefined"}, "24": {"checkbox_score": 1, "config": null, "custom_regex": "", "hidden_value": "", "id": 818282, "inline": 0, "label": "", "label_type": "", "name": "sf_Origin", "options": "", "project_id": 417189428, "project_node_id": 0, "rank": 0, "required": false, "score_var": "", "scores": "", "type": "predefined"}, "3": {"checkbox_score": 1, "config": null, "custom_regex": "", "hidden_value": "", "id": 818261, "inline": 0, "label": "", "label_type": "", "name": "queue_route", "options": "", "project_id": 417189428, "project_node_id": 0, "rank": 0, "required": false, "score_var": "", "scores": "", "type": "predefined"}, "4": {"checkbox_score": 1, "config": null, "custom_regex": "", "hidden_value": "", "id": 818262, "inline": 0, "label": "", "label_type": "", "name": "queue_route_label", "options": "", "project_id": 417189428, "project_node_id": 0, "rank": 0, "required": false, "score_var": "", "scores": "", "type": "predefined"}, "5": {"checkbox_score": 1, "config": null, "custom_regex": "", "hidden_value": "", "id": 818263, "inline": 0, "label": "", "label_type": "", "name": "sf_Id", "options": "", "project_id": 417189428, "project_node_id": 0, "rank": 0, "required": false, "score_var": "", "scores": "", "type": "predefined"}, "6": {"checkbox_score": 1, "config": null, "custom_regex": "", "hidden_value": "", "id": 818264, "inline": 0, "label": "", "label_type": "", "name": "sf_Subject", "options": "", "project_id": 417189428, "project_node_id": 0, "rank": 0, "required": false, "score_var": "", "scores": "", "type": "predefined"}, "7": {"checkbox_score": 1, "config": null, "custom_regex": "", "hidden_value": "", "id": 818265, "inline": 0, "label": "", "label_type": "", "name": "sf_CaseNumber", "options": "", "project_id": 417189428, "project_node_id": 0, "rank": 0, "required": false, "score_var": "", "scores": "", "type": "predefined"}, "8": {"checkbox_score": 1, "config": null, "custom_regex": "", "hidden_value": "", "id": 818266, "inline": 0, "label": "", "label_type": "", "name": "sf_ContactId", "options": "", "project_id": 417189428, "project_node_id": 0, "rank": 0, "required": false, "score_var": "", "scores": "", "type": "predefined"}, "9": {"checkbox_score": 1, "config": null, "custom_regex": "", "hidden_value": "", "id": 818267, "inline": 0, "label": "", "label_type": "", "name": "intent_in_scope", "options": "", "project_id": 417189428, "project_node_id": 0, "rank": 0, "required": false, "score_var": "", "scores": "", "type": "predefined"}}
  script_code: <style>
@import url('https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,400;0,500;1,400;1,500&display=swap');

:root {
  --font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif;
}
</style>

<style>
/* =========================================================
REQUIRED REQUEST DETAILS
========================================================= */

.zt-required {
margin-left: 3px;
color: #b91c1c;
}

/* Invalid Topic / Subtopic */
.zt-form-control.zt-required-invalid {
border-color: #b91c1c;
box-shadow: 0 0 0 3px rgba(185, 28, 28, 0.12);
}

/* Validation message */
.zt-request-validation-error {
display: none;
grid-column: 1 / -1;
margin-top: -4px;
padding: 10px 12px;
color: #991b1b;
font-size: 13px;
font-weight: 500;
background: #fef2f2;
border: 1px solid #fecaca;
border-radius: 8px;
}

.zt-request-validation-error.is-visible {
display: block;
}
</style>

<style>
.email-summary-card-shell {
  max-width: 900px;
  margin: 20px auto;
  padding: 24px;
  background: #ffffff;
  border: 1px solid #d9e2ec;
  border-radius: 14px;
  box-shadow: 0 8px 24px rgba(15, 23, 42, 0.06);
}

.email-summary-header {
  display: flex;
  align-items: flex-start;
  gap: 16px;
  margin-bottom: 20px;
}

.email-summary-icon {
  width: 42px;
  height: 42px;
  border-radius: 999px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #dcfce7;
  color: #166534;
  font-size: 22px;
  font-weight: 700;
  flex: 0 0 42px;
}

.email-summary-header-copy {
  min-width: 0;
}

.email-summary-title {
  margin: 0 0 6px;
  font-size: 24px;
  font-weight: 700;
  line-height: 1.2;
  color: #1f2937;
}

.email-summary-subtitle {
  margin: 0;
  font-size: 14px;
  color: #6b7280;
  line-height: 1.5;
}

.email-summary-card {
  margin-top: 18px;
  padding: 20px;
  background: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 14px;
}

.email-summary-card-title {
  margin: 0 0 16px;
  font-size: 18px;
  font-weight: 700;
  color: #0f172a;
}

.email-summary-row {
  display: grid;
  grid-template-columns: 160px 1fr;
  gap: 14px;
  align-items: start;
  padding: 10px 0;
  border-top: 1px solid #f1f5f9;
}

.email-summary-row:first-of-type {
  border-top: 0;
  padding-top: 0;
}

.email-summary-row-label {
  font-size: 13px;
  font-weight: 700;
  color: #475569;
}

.email-summary-row-value {
  font-size: 14px;
  line-height: 1.55;
  color: #0f172a;
  word-break: break-word;
}

.email-summary-html-body {
  padding: 16px;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  font-size: 14px;
  line-height: 1.6;
  color: #0f172a;
  word-break: break-word;
}

.email-summary-html-body p:first-child {
  margin-top: 0;
}

.email-summary-html-body p:last-child {
  margin-bottom: 0;
}

.email-summary-muted {
  color: #94a3b8;
}

@media (max-width: 768px) {
  .email-summary-card-shell {
    padding: 18px;
  }

  .email-summary-row {
    grid-template-columns: 1fr;
    gap: 6px;
  }
}
</style>

<style>
.zt-rich-editor {
  min-height: 220px;
  padding: 12px;
  border: 1px solid #cbd5e1;
  border-radius: 10px;
  background: #ffffff;
  font-size: 14px;
  line-height: 1.6;
  outline: none;
}

.zt-rich-editor:focus {
  border-color: #2563eb;
  box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.15);
}

.zt-rich-editor p {
  margin: 0 0 10px;
}
</style>

<script>
(function () {

  /**
   * ========================================================
   * REQUEST DETAILS VALIDATION
   *
   * Both forms (screen 33 Request Details and screen 32
   * Multiple Subtopics) carry:
   *    - sf_Topic__c
   *    - sf_Sub_Topic__c
   * ========================================================
   */

  function getRequestFields() {
    return {
      topic: document.getElementById('sf_Topic__c'),
      subtopic: document.getElementById('sf_Sub_Topic__c')
    };
  }


  /**
   * Determine whether the current node contains
   * one of our forms.
   */
  function hasRequestForm() {
    var fields = getRequestFields();

    return !!fields.subtopic;
  }


  /**
   * Validate whichever fields exist on the node.
   */
  function requestDetailsAreValid() {
    var fields = getRequestFields();

    /*
     * No relevant form on this node.
     */
    if (!fields.subtopic) {
      return true;
    }

    var subtopicValue =
      String(fields.subtopic.value || '').trim();

    /*
     * Multiple Subtopics form:
     * only Subtopic exists.
     */
    if (!fields.topic) {
      return subtopicValue !== '';
    }

    /*
     * Standard Request Details form:
     * Topic + Subtopic both exist.
     */
    var topicValue =
      String(fields.topic.value || '').trim();

    return (
      topicValue !== '' &&
      subtopicValue !== ''
    );
  }


  /**
   * Create the validation message.
   */
  function ensureValidationMessage() {
    var fields = getRequestFields();

    if (!fields.subtopic) {
      return null;
    }

    /*
     * Standard Request Details form has a grid.
     */
    var container =
      document.querySelector('.zt-form-grid');

    /*
     * Multiple Subtopics form does not use the grid,
     * so use the Subtopic field wrapper instead.
     */
    if (!container) {
      container =
        fields.subtopic.closest('.zt-form-field');
    }

    if (!container) {
      return null;
    }

    var existing =
      container.querySelector(
        '.zt-request-validation-error'
      );

    if (existing) {
      return existing;
    }

    var error =
      document.createElement('div');

    error.className =
      'zt-request-validation-error';

    error.setAttribute(
      'role',
      'alert'
    );

    error.setAttribute(
      'aria-live',
      'polite'
    );

    /*
     * Different message depending on form type.
     */
    if (fields.topic) {
      error.textContent =
        'Please select both Topic and Subtopic before continuing.';
    } else {
      error.textContent =
        'Please select a Subtopic before continuing.';
    }

    container.appendChild(error);

    return error;
  }


  /**
   * Show validation errors.
   */
  function showValidationErrors() {
    var fields = getRequestFields();

    if (!fields.subtopic) {
      return;
    }

    var error =
      ensureValidationMessage();

    var subtopicMissing =
      String(
        fields.subtopic.value || ''
      ).trim() === '';

    /*
     * Topic only needs validation if it exists.
     */
    var topicMissing = false;

    if (fields.topic) {
      topicMissing =
        String(
          fields.topic.value || ''
        ).trim() === '';
    }


    if (fields.topic) {
      fields.topic.classList.toggle(
        'zt-required-invalid',
        topicMissing
      );

      fields.topic.setAttribute(
        'aria-invalid',
        topicMissing
          ? 'true'
          : 'false'
      );
    }


    fields.subtopic.classList.toggle(
      'zt-required-invalid',
      subtopicMissing
    );

    fields.subtopic.setAttribute(
      'aria-invalid',
      subtopicMissing
        ? 'true'
        : 'false'
    );


    if (error) {
      error.classList.toggle(
        'is-visible',
        topicMissing || subtopicMissing
      );
    }


    /*
     * Focus first missing field.
     */
    if (
      fields.topic &&
      topicMissing
    ) {
      fields.topic.focus();
    } else if (subtopicMissing) {
      fields.subtopic.focus();
    }
  }


  /**
   * Refresh validation after the user changes
   * one of the dropdowns.
   */
  function refreshValidationState() {
    var fields = getRequestFields();

    if (!fields.subtopic) {
      return;
    }

    var subtopicMissing =
      String(
        fields.subtopic.value || ''
      ).trim() === '';

    var topicMissing = false;

    if (fields.topic) {
      topicMissing =
        String(
          fields.topic.value || ''
        ).trim() === '';

      fields.topic.classList.toggle(
        'zt-required-invalid',
        topicMissing
      );
    }


    fields.subtopic.classList.toggle(
      'zt-required-invalid',
      subtopicMissing
    );


    var error =
      document.querySelector(
        '.zt-request-validation-error'
      );

    if (error) {
      error.classList.toggle(
        'is-visible',
        topicMissing || subtopicMissing
      );
    }
  }


  /**
   * Bind fields after node render.
   */
  whenEvent(
    'render:finish',
    function () {

      var fields =
        getRequestFields();

      /*
       * Neither supported form is present.
       */
      if (!fields.subtopic) {
        return;
      }


      ensureValidationMessage();


      /**
       * Bind Topic if this is the standard form.
       */
      if (
        fields.topic &&
        !fields.topic.dataset
          .requiredValidationBound
      ) {

        fields.topic.addEventListener(
          'change',
          function () {

            assignSessionVar(
              'sf_Topic__c',
              fields.topic.value
            );

            refreshValidationState();
          }
        );

        fields.topic.dataset
          .requiredValidationBound =
          'true';
      }


      /**
       * Bind Subtopic for both form types.
       */
      if (
        !fields.subtopic.dataset
          .requiredValidationBound
      ) {

        fields.subtopic.addEventListener(
          'change',
          function () {

            assignSessionVar(
              'sf_Sub_Topic__c',
              fields.subtopic.value
            );

            refreshValidationState();
          }
        );

        fields.subtopic.dataset
          .requiredValidationBound =
          'true';
      }


      /*
       * Don't show errors immediately when the
       * node first loads.
       */
      if (fields.topic) {
        fields.topic.classList.remove(
          'zt-required-invalid'
        );
      }

      fields.subtopic.classList.remove(
        'zt-required-invalid'
      );
    }
  );


  /**
   * ========================================================
   * NAVIGATION GUARD
   * ========================================================
   */
  document.addEventListener(
    'click',
    function (event) {

      var fields =
        getRequestFields();

      /*
       * No supported form on this node.
       */
      if (!fields.subtopic) {
        return;
      }


      /*
       * Allow the user to interact with the form itself.
       */
      if (
        event.target.closest(
          '.zt-form-card'
        )
      ) {
        return;
      }


      /*
       * Only inspect clickable navigation controls.
       */
      var navigationControl =
        event.target.closest(
          'button, a, input[type="button"], input[type="submit"]'
        );

      if (!navigationControl) {
        return;
      }


      /*
       * Valid form: allow navigation.
       */
      if (requestDetailsAreValid()) {
        return;
      }


      /*
       * Invalid form: stop navigation.
       */
      event.preventDefault();
      event.stopPropagation();
      event.stopImmediatePropagation();

      showValidationErrors();

    },
    true
  );

})();
</script>

<script>
whenEvent('render:finish', () => {
  const editor = document.getElementById('htmlBodyEditor');
  const hidden = document.getElementById('HtmlBody');

  if (!editor || !hidden) return;

  hidden.value = editor.innerHTML;

  if (!editor.dataset.boundHtmlSync) {
    editor.addEventListener('input', () => {
      hidden.value = editor.innerHTML;
    });
    editor.dataset.boundHtmlSync = 'true';
  }
});
</script>

<script>
/* =========================================================
TOPIC -> SUBTOPIC FILTER (screens 32 and 33)

Every subtopic <option> carries data-topic, written by nodes
17 / 26 from the lane's own intent map. Both screens carry a
Topic and a Subtopic select: the subtopic list shows only the
options whose data-topic matches the chosen Topic, and a
subtopic that no longer fits is cleared, so the pair saved on
the Case is always one Salesforce accepts.
========================================================= */
whenEvent('render:finish', function () {
  var topic = document.getElementById('sf_Topic__c');
  var subtopic = document.getElementById('sf_Sub_Topic__c');

  if (!topic || !subtopic || subtopic.dataset.topicFilterBound) return;
  subtopic.dataset.topicFilterBound = 'true';

  // keep every option once, then rebuild the list for the chosen Topic
  var allOptions = [];
  for (var i = 0; i < subtopic.options.length; i++) {
    allOptions.push(subtopic.options[i]);
  }

  function filterSubtopics() {
    var topicValue = topic.value;
    var keepValue = subtopic.value;
    var keepStillFits = false;

    subtopic.innerHTML = '';
    for (var i = 0; i < allOptions.length; i++) {
      var option = allOptions[i];
      var optionTopic = option.getAttribute('data-topic') || '';
      // the placeholder has no topic and always stays
      if (optionTopic === '' || optionTopic === topicValue) {
        subtopic.appendChild(option);
        if (keepValue !== '' && option.value === keepValue) keepStillFits = true;
      }
    }

    subtopic.value = keepStillFits ? keepValue : '';
    if (!keepStillFits && keepValue !== '') {
      assignSessionVar('sf_Sub_Topic__c', '');
    }
  }

  filterSubtopics();
  topic.addEventListener('change', filterSubtopics);
});
</script>

<style>
.zt-form-card {
  max-width: 900px;
  margin: 20px auto;
  padding: 24px;
  background: #ffffff;
  border: 1px solid #d9e2ec;
  border-radius: 14px;
  box-shadow: 0 8px 24px rgba(15, 23, 42, 0.06);
}

.zt-form-header {
  margin-bottom: 20px;
}

.zt-form-title {
  margin: 0 0 6px;
  font-size: 24px;
  font-weight: 700;
  line-height: 1.2;
  color: #1f2937;
}

.zt-form-subtitle {
  margin: 0;
  font-size: 14px;
  color: #6b7280;
}

.zt-form-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(240px, 1fr));
  gap: 18px;
  margin-bottom: 18px;
}

.zt-form-field {
  display: flex;
  flex-direction: column;
}

.zt-form-field-full {
  margin-top: 4px;
}

.zt-form-label {
  margin-bottom: 8px;
  font-size: 14px;
  font-weight: 600;
  color: #374151;
}

.zt-form-control {
  width: 100%;
  min-height: 44px;
  padding: 10px 12px;
  font-size: 14px;
  line-height: 1.4;
  color: #111827;
  background: #fff;
  border: 1px solid #cbd5e1;
  border-radius: 10px;
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
  box-sizing: border-box;
}

.zt-form-control:focus {
  outline: none;
  border-color: #2563eb;
  box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.15);
}

.zt-form-textarea {
  min-height: 220px;
  resize: vertical;
  font-family: Consolas, Monaco, monospace;
}

.zt-form-help {
  margin-top: 8px;
  font-size: 12px;
  color: #6b7280;
}

@media (max-width: 768px) {
  .zt-form-grid {
    grid-template-columns: 1fr;
  }

  .zt-form-card {
    padding: 18px;
  }
}
</style>

<style>
/* =========================================================
CASE REVIEW DASHBOARD
Matches the supplied reference layout.
========================================================= */

.case-review-shell {
width: 100%;
margin: 0;
padding: 0;
box-sizing: border-box;
font-family:
-apple-system,
BlinkMacSystemFont,
"Segoe UI",
Roboto,
Arial,
sans-serif;
color: #172033;
}

.case-review-shell *,
.case-review-shell *::before,
.case-review-shell *::after {
box-sizing: border-box;
}


/* =========================================================
OUTER PANEL
========================================================= */

.case-review-panel {
width: 100%;
margin: 0;
overflow: hidden;
background: #f8fafc;
border: 1px solid #e5eaf1;
border-radius: 28px;
}


/* =========================================================
HEADER
========================================================= */

.case-review-hero {
min-height: 210px;
padding: 27px 28px 29px;
color: #ffffff;

background:
linear-gradient(
100deg,
#091735 0%,
#102345 56%,
#203957 100%
);
}

.case-review-hero-top {
display: flex;
align-items: flex-start;
justify-content: space-between;
gap: 36px;
}

.case-review-hero-copy {
flex: 1 1 auto;
min-width: 0;
padding-top: 2px;
}

.case-review-eyebrow {
margin: 0 0 10px;

font-size: 12px;
line-height: 1.2;
font-weight: 700;
letter-spacing: 0.15em;
text-transform: uppercase;

color: rgba(255, 255, 255, 0.63);
}

.case-review-main-title {
margin: 0 0 9px;

font-size: 24px;
line-height: 1.22;
font-weight: 700;

color: #ffffff;
}

.case-review-subtitle {
font-size: 16px;
line-height: 1.5;
font-weight: 400;

color: rgba(255, 255, 255, 0.86);
}

.case-review-subtitle strong {
font-weight: 700;
color: #ffffff;
}

.case-review-subtitle-separator {
display: inline-block;
margin: 0 4px;
}


/* =========================================================
CONFIDENCE CARD
========================================================= */

.case-review-hero-metrics-card {
flex: 0 0 32%;
max-width: 355px;
min-width: 285px;

padding: 17px 18px;

background: rgba(255, 255, 255, 0.13);
border: 1px solid rgba(255, 255, 255, 0.13);
border-radius: 20px;

box-shadow:
inset 0 1px 0
rgba(255, 255, 255, 0.04);
}

.case-review-hero-metric + .case-review-hero-metric {
margin-top: 13px;
padding-top: 13px;

border-top:
1px solid
rgba(255, 255, 255, 0.14);
}

.case-review-hero-metric-label {
margin-bottom: 5px;

font-size: 11px;
line-height: 1.3;
font-weight: 700;
letter-spacing: 0.13em;
text-transform: uppercase;

color: rgba(255, 255, 255, 0.62);
}

.case-review-hero-metric-value {
font-size: 24px;
line-height: 1.2;
font-weight: 700;
color: #ffffff;
}

.case-review-hero-metric-text {
font-size: 14px;
line-height: 1.5;
color: rgba(255, 255, 255, 0.9);

overflow-wrap: anywhere;
}


/* =========================================================
BODY
========================================================= */

.case-review-body {
padding: 24px;
background: #f8fafc;
}


/*
* Reference screenshot uses:
*
* left ~44%
* right ~56%
*/
.case-review-grid {
display: grid;

grid-template-columns:
minmax(0, 44fr)
minmax(0, 56fr);

gap: 22px;

align-items: start;
}

.case-review-col {
min-width: 0;
}

.case-review-col .case-review-card +
.case-review-card {
margin-top: 22px;
}


/* =========================================================
STANDARD CARD
========================================================= */

.case-review-card {
width: 100%;

padding: 19px 20px 20px;

background: #ffffff;
border: 1px solid #dde5ed;
border-radius: 24px;

box-shadow:
0 1px 3px
rgba(15, 23, 42, 0.035);
}

.case-review-card-title {
margin: 0 0 17px;

font-size: 16px;
line-height: 1.35;
font-weight: 700;

color: #25334a;
}


/* =========================================================
CASE DETAIL ROWS
========================================================= */

.case-review-row {
display: grid;

grid-template-columns:
minmax(120px, 42%)
minmax(0, 58%);

gap: 18px;

align-items: center;

min-height: 51px;
padding: 12px 0;

border-top: 1px solid #e8ecf0;
}

.case-review-row:first-of-type {
padding-top: 3px;
border-top: 0;
}

.case-review-row:last-child {
padding-bottom: 2px;
}

.case-review-row-label {
font-size: 12px;
line-height: 1.4;
font-weight: 700;

text-transform: uppercase;
letter-spacing: 0.09em;

color: #58677b;
}

.case-review-row-value {
min-width: 0;

font-size: 15px;
line-height: 1.45;
font-weight: 400;

text-align: right;

color: #263248;

overflow-wrap: anywhere;
}


/* =========================================================
EMAIL CONTENT
========================================================= */

.case-review-html-card-body {
font-size: 15px;
line-height: 1.62;
font-weight: 400;

color: #283344;

overflow-wrap: anywhere;
}

.case-review-html-card-body p {
margin-top: 0;
margin-bottom: 15px;
}

.case-review-html-card-body p:last-child {
margin-bottom: 0;
}

.case-review-html-card-body a {
font-weight: 600;
color: #233f73;
text-decoration: none;
}

.case-review-html-card-body a:hover {
text-decoration: underline;
}

.case-review-muted {
color: #94a3b8;
font-style: italic;
}


/*
* Give the response card enough visual presence
* to match the taller card shown in the reference.
*/
.case-review-response-card {
min-height: 500px;
}


/* =========================================================
POLICY FLAGS
========================================================= */

.case-review-flag-card {
padding: 14px 15px 12px;

border: 1px solid;
border-radius: 18px;
}

.case-review-flag-top {
display: flex;
align-items: center;
justify-content: space-between;

gap: 12px;
}

.case-review-flag-title {
font-size: 12px;
line-height: 1.4;
font-weight: 600;

color: #627085;
}

.case-review-flag-pill {
display: inline-flex;
align-items: center;
justify-content: center;

min-width: 24px;
min-height: 24px;

padding: 2px 8px;

border-radius: 999px;

font-size: 12px;
line-height: 1;
font-weight: 700;

color: #ffffff;
}

.case-review-flag-value {
margin-top: 8px;

font-size: 17px;
line-height: 1.2;
font-weight: 700;
}


/* =========================================================
INTENT CARDS
========================================================= */

.case-review-intent-grid {
display: grid;

grid-template-columns:
repeat(2, minmax(0, 1fr));

gap: 15px;

margin-top: 3px;
}

.case-review-intent-simple-card {
min-height: 102px;

padding: 17px 18px;

display: flex;
flex-direction: column;
justify-content: flex-start;

border: 1px solid;
border-radius: 20px;
}

.case-review-intent-simple-title {
font-size: 11px;
line-height: 1.4;
font-weight: 500;

color: #718096;

overflow-wrap: break-word;
}

.case-review-intent-simple-value {
margin-top: 9px;

font-size: 16px;
line-height: 1.2;
font-weight: 700;
}


/* =========================================================
FEEDBACK WIDGET ALIGNMENT
========================================================= */

.case-review-response-card .ai-feedback-wrap {
margin-top: 18px;
}

.case-review-response-card .ai-feedback-label {
margin: 0 0 9px;

font-size: 16px;
line-height: 1.35;
font-weight: 700;

color: #283344;
}

.case-review-response-card .ai-feedback-buttons {
gap: 10px;
}

.case-review-response-card .ai-feedback-btn {
width: 56px;
min-width: 56px;
height: 48px;
min-height: 48px;

padding: 0;

display: inline-flex;
align-items: center;
justify-content: center;

background: #ffffff;
border: 1px solid #d7dde5;
border-radius: 8px;

font-size: 21px;

box-shadow:
0 1px 2px
rgba(15, 23, 42, 0.04);
}


/* =========================================================
RESPONSIVE
========================================================= */

@media (max-width: 1000px) {

.case-review-grid {
grid-template-columns:
minmax(0, 42fr)
minmax(0, 58fr);

gap: 18px;
}

.case-review-intent-grid {
gap: 12px;
}

.case-review-intent-simple-card {
padding: 15px;
}
}


@media (max-width: 820px) {

.case-review-hero {
min-height: 0;
}

.case-review-hero-top {
flex-direction: column;
}

.case-review-hero-metrics-card {
width: 100%;
max-width: none;
min-width: 0;
flex-basis: auto;
}

.case-review-grid {
grid-template-columns: 1fr;
}

.case-review-response-card {
min-height: 0;
}
}


@media (max-width: 520px) {

.case-review-panel {
border-radius: 20px;
}

.case-review-hero {
padding: 23px 20px;
}

.case-review-body {
padding: 15px;
}

.case-review-card {
padding: 17px;
border-radius: 20px;
}

.case-review-main-title {
font-size: 22px;
}

.case-review-row {
grid-template-columns: 1fr;
gap: 4px;
}

.case-review-row-value {
text-align: left;
}

.case-review-intent-grid {
grid-template-columns: 1fr;
}

.case-review-intent-simple-card {
min-height: 86px;
}
}
</style>
<style>
.ai-feedback-wrap {
  margin-top: 12px;
}

.ai-feedback-label {
  margin-bottom: 8px;
  font-weight: 600;
}

.ai-feedback-buttons {
  display: flex;
  gap: 10px;
}

.ai-feedback-btn {
  min-width: 52px;
  min-height: 44px;
  padding: 8px 12px;
  border: 1px solid #cfcfcf;
  border-radius: 8px;
  background: #fff;
  cursor: pointer;
  font-size: 22px;
  line-height: 1;
}

.ai-feedback-btn:hover {
  border-color: #999;
}

.ai-feedback-btn.selected {
  border-color: #222;
  box-shadow: inset 0 0 0 2px #222;
}

.ai-feedback-status {
  min-height: 18px;
  margin-top: 8px;
  font-size: 13px;
  color: #374151;
}


/* Thumbs-down comments section */









</style>

<script>
(function () {
  /**
   * AI FEEDBACK (screens 30 and 53)
   *
   * The thumbs buttons are the ONLY writer of ai_feedback. They write it into a
   * native hidden-from-view text field of the same name, because native fields
   * always submit with the button the agent clicks and so always reach form data.
   * ai_feedback_comments is a native textarea on the same screen, shown and
   * focused only on thumbs_down. thumbs_up hides it and clears any text in it,
   * so a comment typed before switching to thumbs up never submits.
   */
  function nativeField(name) {
    return document.querySelector(
      'input[name="' + name + '"], textarea[name="' + name + '"]'
    );
  }

  // The wrapper that holds a native field and its label: walk up while the
  // parent holds only this one control, so nothing else on the screen moves.
  function nativeWrapper(name) {
    var field = nativeField(name);
    if (!field) return null;
    var wrapper = field;
    while (
      wrapper.parentElement &&
      wrapper.parentElement.querySelectorAll('input, select, textarea').length === 1
    ) {
      wrapper = wrapper.parentElement;
    }
    return wrapper;
  }

  function setNativeFieldVisible(name, visible) {
    var wrapper = nativeWrapper(name);
    if (wrapper) wrapper.style.display = visible ? '' : 'none';
  }

  function recordFeedback(value) {
    var field = nativeField('ai_feedback');
    if (field) {
      field.value = value;
      field.dispatchEvent(new Event('change', { bubbles: true }));
    }
    assignSessionVar('ai_feedback', value);
  }

  var statusText = {
    thumbs_up: '&#128077; Thanks for the feedback!',
    thumbs_down: '&#128078; Thanks - please say what was wrong in the AI feedback comments box below.'
  };

  function showComments() {
    setNativeFieldVisible('ai_feedback_comments', true);
    var comments = nativeField('ai_feedback_comments');
    if (comments) {
      comments.scrollIntoView({ behavior: 'smooth', block: 'center' });
      comments.focus();
    }
  }

  function hideComments() {
    var comments = nativeField('ai_feedback_comments');
    if (comments && comments.value !== '') {
      comments.value = '';
      comments.dispatchEvent(new Event('change', { bubbles: true }));
    }
    assignSessionVar('ai_feedback_comments', '');
    setNativeFieldVisible('ai_feedback_comments', false);
  }

  whenEvent('render:finish', function () {
    var widgets = document.querySelectorAll('.ai-feedback-wrap');
    if (!widgets.length) return;

    setNativeFieldVisible('ai_feedback', false);
    var ratedDown = nativeField('ai_feedback') && nativeField('ai_feedback').value === 'thumbs_down';
    setNativeFieldVisible('ai_feedback_comments', ratedDown);

    for (var i = 0; i < widgets.length; i++) {
      var widget = widgets[i];
      if (widget.dataset.aiFeedbackBound) continue;
      widget.dataset.aiFeedbackBound = 'true';

      var current = nativeField('ai_feedback');
      if (current && current.value) {
        var preselected = widget.querySelector('.ai-feedback-btn[data-feedback="' + current.value + '"]');
        if (preselected) preselected.classList.add('selected');
      }

      widget.addEventListener('click', function (event) {
        var btn = event.target.closest('.ai-feedback-btn');
        if (!btn) return;
        var value = btn.getAttribute('data-feedback');
        var buttons = this.querySelectorAll('.ai-feedback-btn');
        for (var j = 0; j < buttons.length; j++) buttons[j].classList.remove('selected');
        btn.classList.add('selected');
        recordFeedback(value);

        var status = this.querySelector('.ai-feedback-status');
        if (status) status.innerHTML = statusText[value] || '';

        if (value === 'thumbs_down') {
          showComments();
        } else {
          hideComments();
        }
      });
    }
  });
})();
</script> → <style>
@import url('https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,400;0,500;1,400;1,500&display=swap');

:root {
  --font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif;
}
</style>

<style>
/* =========================================================
REQUIRED REQUEST DETAILS
========================================================= */

.zt-required {
margin-left: 3px;
color: #b91c1c;
}

/* Invalid Topic / Subtopic */
.zt-form-control.zt-required-invalid {
border-color: #b91c1c;
box-shadow: 0 0 0 3px rgba(185, 28, 28, 0.12);
}

/* Validation message */
.zt-request-validation-error {
display: none;
grid-column: 1 / -1;
margin-top: -4px;
padding: 10px 12px;
color: #991b1b;
font-size: 13px;
font-weight: 500;
background: #fef2f2;
border: 1px solid #fecaca;
border-radius: 8px;
}

.zt-request-validation-error.is-visible {
display: block;
}
</style>

<style>
.email-summary-card-shell {
  max-width: 900px;
  margin: 20px auto;
  padding: 24px;
  background: #ffffff;
  border: 1px solid #d9e2ec;
  border-radius: 14px;
  box-shadow: 0 8px 24px rgba(15, 23, 42, 0.06);
}

.email-summary-header {
  display: flex;
  align-items: flex-start;
  gap: 16px;
  margin-bottom: 20px;
}

.email-summary-icon {
  width: 42px;
  height: 42px;
  border-radius: 999px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #dcfce7;
  color: #166534;
  font-size: 22px;
  font-weight: 700;
  flex: 0 0 42px;
}

.email-summary-header-copy {
  min-width: 0;
}

.email-summary-title {
  margin: 0 0 6px;
  font-size: 24px;
  font-weight: 700;
  line-height: 1.2;
  color: #1f2937;
}

.email-summary-subtitle {
  margin: 0;
  font-size: 14px;
  color: #6b7280;
  line-height: 1.5;
}

.email-summary-card {
  margin-top: 18px;
  padding: 20px;
  background: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 14px;
}

.email-summary-card-title {
  margin: 0 0 16px;
  font-size: 18px;
  font-weight: 700;
  color: #0f172a;
}

.email-summary-row {
  display: grid;
  grid-template-columns: 160px 1fr;
  gap: 14px;
  align-items: start;
  padding: 10px 0;
  border-top: 1px solid #f1f5f9;
}

.email-summary-row:first-of-type {
  border-top: 0;
  padding-top: 0;
}

.email-summary-row-label {
  font-size: 13px;
  font-weight: 700;
  color: #475569;
}

.email-summary-row-value {
  font-size: 14px;
  line-height: 1.55;
  color: #0f172a;
  word-break: break-word;
}

.email-summary-html-body {
  padding: 16px;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  font-size: 14px;
  line-height: 1.6;
  color: #0f172a;
  word-break: break-word;
}

.email-summary-html-body p:first-child {
  margin-top: 0;
}

.email-summary-html-body p:last-child {
  margin-bottom: 0;
}

.email-summary-muted {
  color: #94a3b8;
}

@media (max-width: 768px) {
  .email-summary-card-shell {
    padding: 18px;
  }

  .email-summary-row {
    grid-template-columns: 1fr;
    gap: 6px;
  }
}
</style>

<style>
.zt-rich-editor {
  min-height: 220px;
  padding: 12px;
  border: 1px solid #cbd5e1;
  border-radius: 10px;
  background: #ffffff;
  font-size: 14px;
  line-height: 1.6;
  outline: none;
}

.zt-rich-editor:focus {
  border-color: #2563eb;
  box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.15);
}

.zt-rich-editor p {
  margin: 0 0 10px;
}
</style>

<script>
(function () {

  /**
   * ========================================================
   * REQUEST DETAILS VALIDATION
   *
   * Both forms (screen 33 Request Details and screen 32
   * Multiple Subtopics) carry:
   *    - sf_Topic__c
   *    - sf_Sub_Topic__c
   * ========================================================
   */

  function getRequestFields() {
    return {
      topic: document.getElementById('sf_Topic__c'),
      subtopic: document.getElementById('sf_Sub_Topic__c')
    };
  }


  /**
   * Determine whether the current node contains
   * one of our forms.
   */
  function hasRequestForm() {
    var fields = getRequestFields();

    return !!fields.subtopic;
  }


  /**
   * Validate whichever fields exist on the node.
   */
  function requestDetailsAreValid() {
    var fields = getRequestFields();

    /*
     * No relevant form on this node.
     */
    if (!fields.subtopic) {
      return true;
    }

    var subtopicValue =
      String(fields.subtopic.value || '').trim();

    /*
     * Multiple Subtopics form:
     * only Subtopic exists.
     */
    if (!fields.topic) {
      return subtopicValue !== '';
    }

    /*
     * Standard Request Details form:
     * Topic + Subtopic both exist.
     */
    var topicValue =
      String(fields.topic.value || '').trim();

    return (
      topicValue !== '' &&
      subtopicValue !== ''
    );
  }


  /**
   * Create the validation message.
   */
  function ensureValidationMessage() {
    var fields = getRequestFields();

    if (!fields.subtopic) {
      return null;
    }

    /*
     * Standard Request Details form has a grid.
     */
    var container =
      document.querySelector('.zt-form-grid');

    /*
     * Multiple Subtopics form does not use the grid,
     * so use the Subtopic field wrapper instead.
     */
    if (!container) {
      container =
        fields.subtopic.closest('.zt-form-field');
    }

    if (!container) {
      return null;
    }

    var existing =
      container.querySelector(
        '.zt-request-validation-error'
      );

    if (existing) {
      return existing;
    }

    var error =
      document.createElement('div');

    error.className =
      'zt-request-validation-error';

    error.setAttribute(
      'role',
      'alert'
    );

    error.setAttribute(
      'aria-live',
      'polite'
    );

    /*
     * Different message depending on form type.
     */
    if (fields.topic) {
      error.textContent =
        'Please select both Topic and Subtopic before continuing.';
    } else {
      error.textContent =
        'Please select a Subtopic before continuing.';
    }

    container.appendChild(error);

    return error;
  }


  /**
   * Show validation errors.
   */
  function showValidationErrors() {
    var fields = getRequestFields();

    if (!fields.subtopic) {
      return;
    }

    var error =
      ensureValidationMessage();

    var subtopicMissing =
      String(
        fields.subtopic.value || ''
      ).trim() === '';

    /*
     * Topic only needs validation if it exists.
     */
    var topicMissing = false;

    if (fields.topic) {
      topicMissing =
        String(
          fields.topic.value || ''
        ).trim() === '';
    }


    if (fields.topic) {
      fields.topic.classList.toggle(
        'zt-required-invalid',
        topicMissing
      );

      fields.topic.setAttribute(
        'aria-invalid',
        topicMissing
          ? 'true'
          : 'false'
      );
    }


    fields.subtopic.classList.toggle(
      'zt-required-invalid',
      subtopicMissing
    );

    fields.subtopic.setAttribute(
      'aria-invalid',
      subtopicMissing
        ? 'true'
        : 'false'
    );


    if (error) {
      error.classList.toggle(
        'is-visible',
        topicMissing || subtopicMissing
      );
    }


    /*
     * Focus first missing field.
     */
    if (
      fields.topic &&
      topicMissing
    ) {
      fields.topic.focus();
    } else if (subtopicMissing) {
      fields.subtopic.focus();
    }
  }


  /**
   * Refresh validation after the user changes
   * one of the dropdowns.
   */
  function refreshValidationState() {
    var fields = getRequestFields();

    if (!fields.subtopic) {
      return;
    }

    var subtopicMissing =
      String(
        fields.subtopic.value || ''
      ).trim() === '';

    var topicMissing = false;

    if (fields.topic) {
      topicMissing =
        String(
          fields.topic.value || ''
        ).trim() === '';

      fields.topic.classList.toggle(
        'zt-required-invalid',
        topicMissing
      );
    }


    fields.subtopic.classList.toggle(
      'zt-required-invalid',
      subtopicMissing
    );


    var error =
      document.querySelector(
        '.zt-request-validation-error'
      );

    if (error) {
      error.classList.toggle(
        'is-visible',
        topicMissing || subtopicMissing
      );
    }
  }


  /**
   * Bind fields after node render.
   */
  whenEvent(
    'render:finish',
    function () {

      var fields =
        getRequestFields();

      /*
       * Neither supported form is present.
       */
      if (!fields.subtopic) {
        return;
      }


      ensureValidationMessage();


      /**
       * Bind Topic if this is the standard form.
       */
      if (
        fields.topic &&
        !fields.topic.dataset
          .requiredValidationBound
      ) {

        fields.topic.addEventListener(
          'change',
          function () {

            assignSessionVar(
              'sf_Topic__c',
              fields.topic.value
            );

            refreshValidationState();
          }
        );

        fields.topic.dataset
          .requiredValidationBound =
          'true';
      }


      /**
       * Bind Subtopic for both form types.
       */
      if (
        !fields.subtopic.dataset
          .requiredValidationBound
      ) {

        fields.subtopic.addEventListener(
          'change',
          function () {

            assignSessionVar(
              'sf_Sub_Topic__c',
              fields.subtopic.value
            );

            refreshValidationState();
          }
        );

        fields.subtopic.dataset
          .requiredValidationBound =
          'true';
      }


      /*
       * Don't show errors immediately when the
       * node first loads.
       */
      if (fields.topic) {
        fields.topic.classList.remove(
          'zt-required-invalid'
        );
      }

      fields.subtopic.classList.remove(
        'zt-required-invalid'
      );
    }
  );


  /**
   * ========================================================
   * NAVIGATION GUARD
   * ========================================================
   */
  document.addEventListener(
    'click',
    function (event) {

      var fields =
        getRequestFields();

      /*
       * No supported form on this node.
       */
      if (!fields.subtopic) {
        return;
      }


      /*
       * Allow the user to interact with the form itself.
       */
      if (
        event.target.closest(
          '.zt-form-card'
        )
      ) {
        return;
      }


      /*
       * Only inspect clickable navigation controls.
       */
      var navigationControl =
        event.target.closest(
          'button, a, input[type="button"], input[type="submit"]'
        );

      if (!navigationControl) {
        return;
      }


      /*
       * Valid form: allow navigation.
       */
      if (requestDetailsAreValid()) {
        return;
      }


      /*
       * Invalid form: stop navigation.
       */
      event.preventDefault();
      event.stopPropagation();
      event.stopImmediatePropagation();

      showValidationErrors();

    },
    true
  );

})();
</script>

<script>
whenEvent('render:finish', () => {
  const editor = document.getElementById('htmlBodyEditor');
  const hidden = document.getElementById('HtmlBody');

  if (!editor || !hidden) return;

  hidden.value = editor.innerHTML;

  if (!editor.dataset.boundHtmlSync) {
    editor.addEventListener('input', () => {
      hidden.value = editor.innerHTML;
    });
    editor.dataset.boundHtmlSync = 'true';
  }
});
</script>

<script>
/* =========================================================
TOPIC -> SUBTOPIC FILTER (screens 32 and 33)

Every subtopic <option> carries data-topic, written by nodes
17 / 26 from the lane's own intent map. Both screens carry a
Topic and a Subtopic select: the subtopic list shows only the
options whose data-topic matches the chosen Topic, and a
subtopic that no longer fits is cleared, so the pair saved on
the Case is always one Salesforce accepts.
========================================================= */
whenEvent('render:finish', function () {
  var topic = document.getElementById('sf_Topic__c');
  var subtopic = document.getElementById('sf_Sub_Topic__c');

  if (!topic || !subtopic || subtopic.dataset.topicFilterBound) return;
  subtopic.dataset.topicFilterBound = 'true';

  // keep every option once, then rebuild the list for the chosen Topic
  var allOptions = [];
  for (var i = 0; i < subtopic.options.length; i++) {
    allOptions.push(subtopic.options[i]);
  }

  // Zingtree can restore the saved Topic after render:finish without firing change, which
  // left the Subtopic list built for an empty Topic until the agent toggled Topic away and
  // back (25 Sep standup). So the list is rebuilt whenever the Topic it was built for no
  // longer matches the Topic on screen: on the next tick, on Topic change, and just before
  // the agent opens the Subtopic list.
  var builtForTopic = null;

  function filterSubtopics() {
    var topicValue = topic.value;
    if (topicValue === builtForTopic) return;
    builtForTopic = topicValue;

    var keepValue = subtopic.value;
    var keepStillFits = false;

    subtopic.innerHTML = '';
    for (var i = 0; i < allOptions.length; i++) {
      var option = allOptions[i];
      var optionTopic = option.getAttribute('data-topic') || '';
      // the placeholder has no topic and always stays; no Topic yet shows every option
      if (optionTopic === '' || topicValue === '' || optionTopic === topicValue) {
        subtopic.appendChild(option);
        if (keepValue !== '' && option.value === keepValue) keepStillFits = true;
      }
    }

    subtopic.value = keepStillFits ? keepValue : '';
    if (!keepStillFits && keepValue !== '') {
      assignSessionVar('sf_Sub_Topic__c', '');
    }
  }

  filterSubtopics();
  setTimeout(filterSubtopics, 0);
  topic.addEventListener('change', filterSubtopics);
  subtopic.addEventListener('mousedown', filterSubtopics);
  subtopic.addEventListener('focus', filterSubtopics);
});
</script>

<style>
.zt-form-card {
  max-width: 900px;
  margin: 20px auto;
  padding: 24px;
  background: #ffffff;
  border: 1px solid #d9e2ec;
  border-radius: 14px;
  box-shadow: 0 8px 24px rgba(15, 23, 42, 0.06);
}

.zt-form-header {
  margin-bottom: 20px;
}

.zt-form-title {
  margin: 0 0 6px;
  font-size: 24px;
  font-weight: 700;
  line-height: 1.2;
  color: #1f2937;
}

.zt-form-subtitle {
  margin: 0;
  font-size: 14px;
  color: #6b7280;
}

.zt-form-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(240px, 1fr));
  gap: 18px;
  margin-bottom: 18px;
}

.zt-form-field {
  display: flex;
  flex-direction: column;
}

.zt-form-field-full {
  margin-top: 4px;
}

.zt-form-label {
  margin-bottom: 8px;
  font-size: 14px;
  font-weight: 600;
  color: #374151;
}

.zt-form-control {
  width: 100%;
  min-height: 44px;
  padding: 10px 12px;
  font-size: 14px;
  line-height: 1.4;
  color: #111827;
  background: #fff;
  border: 1px solid #cbd5e1;
  border-radius: 10px;
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
  box-sizing: border-box;
}

.zt-form-control:focus {
  outline: none;
  border-color: #2563eb;
  box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.15);
}

.zt-form-textarea {
  min-height: 220px;
  resize: vertical;
  font-family: Consolas, Monaco, monospace;
}

.zt-form-help {
  margin-top: 8px;
  font-size: 12px;
  color: #6b7280;
}

@media (max-width: 768px) {
  .zt-form-grid {
    grid-template-columns: 1fr;
  }

  .zt-form-card {
    padding: 18px;
  }
}
</style>

<style>
/* =========================================================
CASE REVIEW DASHBOARD
Matches the supplied reference layout.
========================================================= */

.case-review-shell {
width: 100%;
margin: 0;
padding: 0;
box-sizing: border-box;
font-family:
-apple-system,
BlinkMacSystemFont,
"Segoe UI",
Roboto,
Arial,
sans-serif;
color: #172033;
}

.case-review-shell *,
.case-review-shell *::before,
.case-review-shell *::after {
box-sizing: border-box;
}


/* =========================================================
OUTER PANEL
========================================================= */

.case-review-panel {
width: 100%;
margin: 0;
overflow: hidden;
background: #f8fafc;
border: 1px solid #e5eaf1;
border-radius: 28px;
}


/* =========================================================
HEADER
========================================================= */

.case-review-hero {
min-height: 210px;
padding: 27px 28px 29px;
color: #ffffff;

background:
linear-gradient(
100deg,
#091735 0%,
#102345 56%,
#203957 100%
);
}

.case-review-hero-top {
display: flex;
align-items: flex-start;
justify-content: space-between;
gap: 36px;
}

.case-review-hero-copy {
flex: 1 1 auto;
min-width: 0;
padding-top: 2px;
}

.case-review-eyebrow {
margin: 0 0 10px;

font-size: 12px;
line-height: 1.2;
font-weight: 700;
letter-spacing: 0.15em;
text-transform: uppercase;

color: rgba(255, 255, 255, 0.63);
}

.case-review-main-title {
margin: 0 0 9px;

font-size: 24px;
line-height: 1.22;
font-weight: 700;

color: #ffffff;
}

.case-review-subtitle {
font-size: 16px;
line-height: 1.5;
font-weight: 400;

color: rgba(255, 255, 255, 0.86);
}

.case-review-subtitle strong {
font-weight: 700;
color: #ffffff;
}

.case-review-subtitle-separator {
display: inline-block;
margin: 0 4px;
}


/* =========================================================
CONFIDENCE CARD
========================================================= */

.case-review-hero-metrics-card {
flex: 0 0 32%;
max-width: 355px;
min-width: 285px;

padding: 17px 18px;

background: rgba(255, 255, 255, 0.13);
border: 1px solid rgba(255, 255, 255, 0.13);
border-radius: 20px;

box-shadow:
inset 0 1px 0
rgba(255, 255, 255, 0.04);
}

.case-review-hero-metric + .case-review-hero-metric {
margin-top: 13px;
padding-top: 13px;

border-top:
1px solid
rgba(255, 255, 255, 0.14);
}

.case-review-hero-metric-label {
margin-bottom: 5px;

font-size: 11px;
line-height: 1.3;
font-weight: 700;
letter-spacing: 0.13em;
text-transform: uppercase;

color: rgba(255, 255, 255, 0.62);
}

.case-review-hero-metric-value {
font-size: 24px;
line-height: 1.2;
font-weight: 700;
color: #ffffff;
}

.case-review-hero-metric-text {
font-size: 14px;
line-height: 1.5;
color: rgba(255, 255, 255, 0.9);

overflow-wrap: anywhere;
}


/* =========================================================
BODY
========================================================= */

.case-review-body {
padding: 24px;
background: #f8fafc;
}


/*
* Reference screenshot uses:
*
* left ~44%
* right ~56%
*/
.case-review-grid {
display: grid;

grid-template-columns:
minmax(0, 44fr)
minmax(0, 56fr);

gap: 22px;

align-items: start;
}

.case-review-col {
min-width: 0;
}

.case-review-col .case-review-card +
.case-review-card {
margin-top: 22px;
}


/* =========================================================
STANDARD CARD
========================================================= */

.case-review-card {
width: 100%;

padding: 19px 20px 20px;

background: #ffffff;
border: 1px solid #dde5ed;
border-radius: 24px;

box-shadow:
0 1px 3px
rgba(15, 23, 42, 0.035);
}

.case-review-card-title {
margin: 0 0 17px;

font-size: 16px;
line-height: 1.35;
font-weight: 700;

color: #25334a;
}


/* =========================================================
CASE DETAIL ROWS
========================================================= */

.case-review-row {
display: grid;

grid-template-columns:
minmax(120px, 42%)
minmax(0, 58%);

gap: 18px;

align-items: center;

min-height: 51px;
padding: 12px 0;

border-top: 1px solid #e8ecf0;
}

.case-review-row:first-of-type {
padding-top: 3px;
border-top: 0;
}

.case-review-row:last-child {
padding-bottom: 2px;
}

.case-review-row-label {
font-size: 12px;
line-height: 1.4;
font-weight: 700;

text-transform: uppercase;
letter-spacing: 0.09em;

color: #58677b;
}

.case-review-row-value {
min-width: 0;

font-size: 15px;
line-height: 1.45;
font-weight: 400;

text-align: right;

color: #263248;

overflow-wrap: anywhere;
}


/* =========================================================
EMAIL CONTENT
========================================================= */

.case-review-html-card-body {
font-size: 15px;
line-height: 1.62;
font-weight: 400;

color: #283344;

overflow-wrap: anywhere;
}

.case-review-html-card-body p {
margin-top: 0;
margin-bottom: 15px;
}

.case-review-html-card-body p:last-child {
margin-bottom: 0;
}

.case-review-html-card-body a {
font-weight: 600;
color: #233f73;
text-decoration: none;
}

.case-review-html-card-body a:hover {
text-decoration: underline;
}

.case-review-muted {
color: #94a3b8;
font-style: italic;
}


/*
* Give the response card enough visual presence
* to match the taller card shown in the reference.
*/
.case-review-response-card {
min-height: 500px;
}


/* =========================================================
POLICY FLAGS
========================================================= */

.case-review-flag-card {
padding: 14px 15px 12px;

border: 1px solid;
border-radius: 18px;
}

.case-review-flag-top {
display: flex;
align-items: center;
justify-content: space-between;

gap: 12px;
}

.case-review-flag-title {
font-size: 12px;
line-height: 1.4;
font-weight: 600;

color: #627085;
}

.case-review-flag-pill {
display: inline-flex;
align-items: center;
justify-content: center;

min-width: 24px;
min-height: 24px;

padding: 2px 8px;

border-radius: 999px;

font-size: 12px;
line-height: 1;
font-weight: 700;

color: #ffffff;
}

.case-review-flag-value {
margin-top: 8px;

font-size: 17px;
line-height: 1.2;
font-weight: 700;
}


/* =========================================================
INTENT CARDS
========================================================= */

.case-review-intent-grid {
display: grid;

grid-template-columns:
repeat(2, minmax(0, 1fr));

gap: 15px;

margin-top: 3px;
}

.case-review-intent-simple-card {
min-height: 102px;

padding: 17px 18px;

display: flex;
flex-direction: column;
justify-content: flex-start;

border: 1px solid;
border-radius: 20px;
}

.case-review-intent-simple-title {
font-size: 11px;
line-height: 1.4;
font-weight: 500;

color: #718096;

overflow-wrap: break-word;
}

.case-review-intent-simple-value {
margin-top: 9px;

font-size: 16px;
line-height: 1.2;
font-weight: 700;
}


/* =========================================================
FEEDBACK WIDGET ALIGNMENT
========================================================= */

.case-review-response-card .ai-feedback-wrap {
margin-top: 18px;
}

.case-review-response-card .ai-feedback-label {
margin: 0 0 9px;

font-size: 16px;
line-height: 1.35;
font-weight: 700;

color: #283344;
}

.case-review-response-card .ai-feedback-buttons {
gap: 10px;
}

.case-review-response-card .ai-feedback-btn {
width: 56px;
min-width: 56px;
height: 48px;
min-height: 48px;

padding: 0;

display: inline-flex;
align-items: center;
justify-content: center;

background: #ffffff;
border: 1px solid #d7dde5;
border-radius: 8px;

font-size: 21px;

box-shadow:
0 1px 2px
rgba(15, 23, 42, 0.04);
}


/* =========================================================
RESPONSIVE
========================================================= */

@media (max-width: 1000px) {

.case-review-grid {
grid-template-columns:
minmax(0, 42fr)
minmax(0, 58fr);

gap: 18px;
}

.case-review-intent-grid {
gap: 12px;
}

.case-review-intent-simple-card {
padding: 15px;
}
}


@media (max-width: 820px) {

.case-review-hero {
min-height: 0;
}

.case-review-hero-top {
flex-direction: column;
}

.case-review-hero-metrics-card {
width: 100%;
max-width: none;
min-width: 0;
flex-basis: auto;
}

.case-review-grid {
grid-template-columns: 1fr;
}

.case-review-response-card {
min-height: 0;
}
}


@media (max-width: 520px) {

.case-review-panel {
border-radius: 20px;
}

.case-review-hero {
padding: 23px 20px;
}

.case-review-body {
padding: 15px;
}

.case-review-card {
padding: 17px;
border-radius: 20px;
}

.case-review-main-title {
font-size: 22px;
}

.case-review-row {
grid-template-columns: 1fr;
gap: 4px;
}

.case-review-row-value {
text-align: left;
}

.case-review-intent-grid {
grid-template-columns: 1fr;
}

.case-review-intent-simple-card {
min-height: 86px;
}
}
</style>
<style>
.ai-feedback-wrap {
  margin-top: 12px;
}

.ai-feedback-label {
  margin-bottom: 8px;
  font-weight: 600;
}

.ai-feedback-buttons {
  display: flex;
  gap: 10px;
}

.ai-feedback-btn {
  min-width: 52px;
  min-height: 44px;
  padding: 8px 12px;
  border: 1px solid #cfcfcf;
  border-radius: 8px;
  background: #fff;
  cursor: pointer;
  font-size: 22px;
  line-height: 1;
}

.ai-feedback-btn:hover {
  border-color: #999;
}

.ai-feedback-btn.selected {
  border-color: #222;
  box-shadow: inset 0 0 0 2px #222;
}

.ai-feedback-status {
  min-height: 18px;
  margin-top: 8px;
  font-size: 13px;
  color: #374151;
}


/* Thumbs-down comments section */









</style>

<script>
(function () {
  /**
   * AI FEEDBACK (screens 30, 53, 54 and 55)
   *
   * The thumbs buttons are the ONLY writer of ai_feedback. They write it into a
   * native hidden-from-view text field of the same name, because native fields
   * always submit with the button the agent clicks and so always reach form data.
   * ai_feedback_comments is a native textarea on the same screen, shown and
   * focused only on thumbs_down. thumbs_up hides it and clears any text in it,
   * so a comment typed before switching to thumbs up never submits.
   */
  function nativeField(name) {
    return document.querySelector(
      'input[name="' + name + '"], textarea[name="' + name + '"]'
    );
  }

  // The wrapper that holds a native field and its label: walk up while the
  // parent holds only this one control, so nothing else on the screen moves.
  function nativeWrapper(name) {
    var field = nativeField(name);
    if (!field) return null;
    var wrapper = field;
    while (
      wrapper.parentElement &&
      wrapper.parentElement.querySelectorAll('input, select, textarea').length === 1
    ) {
      wrapper = wrapper.parentElement;
    }
    return wrapper;
  }

  function setNativeFieldVisible(name, visible) {
    var wrapper = nativeWrapper(name);
    if (wrapper) wrapper.style.display = visible ? '' : 'none';
  }

  function recordFeedback(value) {
    var field = nativeField('ai_feedback');
    if (field) {
      field.value = value;
      field.dispatchEvent(new Event('change', { bubbles: true }));
    }
    assignSessionVar('ai_feedback', value);
  }

  var statusText = {
    thumbs_up: '&#128077; Thanks for the feedback!',
    thumbs_down: '&#128078; Thanks - please say what was wrong in the AI feedback comments box below.'
  };

  function showComments() {
    setNativeFieldVisible('ai_feedback_comments', true);
    var comments = nativeField('ai_feedback_comments');
    if (comments) {
      comments.scrollIntoView({ behavior: 'smooth', block: 'center' });
      comments.focus();
    }
  }

  function hideComments() {
    var comments = nativeField('ai_feedback_comments');
    if (comments && comments.value !== '') {
      comments.value = '';
      comments.dispatchEvent(new Event('change', { bubbles: true }));
    }
    assignSessionVar('ai_feedback_comments', '');
    setNativeFieldVisible('ai_feedback_comments', false);
  }

  whenEvent('render:finish', function () {
    var widgets = document.querySelectorAll('.ai-feedback-wrap');
    if (!widgets.length) return;

    setNativeFieldVisible('ai_feedback', false);
    var ratedDown = nativeField('ai_feedback') && nativeField('ai_feedback').value === 'thumbs_down';
    setNativeFieldVisible('ai_feedback_comments', ratedDown);

    for (var i = 0; i < widgets.length; i++) {
      var widget = widgets[i];
      if (widget.dataset.aiFeedbackBound) continue;
      widget.dataset.aiFeedbackBound = 'true';

      var current = nativeField('ai_feedback');
      if (current && current.value) {
        var preselected = widget.querySelector('.ai-feedback-btn[data-feedback="' + current.value + '"]');
        if (preselected) preselected.classList.add('selected');
      }

      widget.addEventListener('click', function (event) {
        var btn = event.target.closest('.ai-feedback-btn');
        if (!btn) return;
        var value = btn.getAttribute('data-feedback');
        var buttons = this.querySelectorAll('.ai-feedback-btn');
        for (var j = 0; j < buttons.length; j++) buttons[j].classList.remove('selected');
        btn.classList.add('selected');
        recordFeedback(value);

        var status = this.querySelector('.ai-feedback-status');
        if (status) status.innerHTML = statusText[value] || '';

        if (value === 'thumbs_down') {
          showComments();
        } else {
          hideComments();
        }
      });
    }
  });
})();
</script>

## COSMETIC / EDITOR-ONLY CHANGES (0) — ignore

  (none)

## LINE-LEVEL BODY DIFFS (11)

### node 6 — Check AI eligibility (script code)

```diff
--- before/node 6 content
+++ after/node 6 content
@@ -2,7 +2,7 @@
 let sfCase = actions.get_case_details__prod.records[0];
 let account = actions.get_account_details__prod.records[0];
 
-// --- account eligibility: no framework, SME/Keyfuels/blank segment, approved admin ---
+// --- account eligibility: no framework, SME/SMB/Keyfuels/blank segment, approved admin ---
 const eligibleAdministrators = [
   "SME Unmanaged", "AS New CMT", "TFC CMT", "TFC NEW CMT", "Fuelcards4u",
   "TFC 1", "TFC 2", "TFC 3", "TFC 4", "TFC 5", "TFC 6",
@@ -11,6 +11,7 @@
 let frameworkEligible = account.Framework__c == null;
 let segmentEligible = account.Account_Segment__c == null
   || account.Account_Segment__c === "SME"
+  || account.Account_Segment__c === "SMB"
   || account.Account_Segment__c === "Keyfuels";
 let administratorEligible = eligibleAdministrators.includes(account.AS_Account_Administrator__c);
 
@@ -18,7 +19,7 @@
 // OPEN ITEM #1: confirm which Case fields carry these flags in Corpay UK Salesforce.
 const bypassOrigins = ["Web", "Zingtree"];
 const bypassKeywords = ["complaint", "corporate", "ccs"];
-let caseText = [sfCase.Origin, sfCase.Business_Process__c, sfCase.Initial_Case_Queue_Name__c, sfCase.Topic__c, sfCase.Sub_Topic__c]
+let caseText = [sfCase.Origin, sfCase.Business_process__c, sfCase.Initial_Case_Queue_Name__c, sfCase.Topic__c, sfCase.Sub_Topic__c]
   .join(" ").toLowerCase();
 let bypassKeyword = bypassKeywords.find(keyword => caseText.includes(keyword));
 let ai_bypass_reason = bypassOrigins.includes(sfCase.Origin)
```

### node 8 — Resolve queue route (script code)

```diff
--- before/node 8 content
+++ after/node 8 content
@@ -1,5 +1,6 @@
 // --- inputs -----------------------------------------------------------------
-let sfCase = actions.get_case_details__prod.records[0];
+// Captured by node 58 straight after the case is read.
+let last_owner_queue_name = ZT.getVariableValue("last_owner_queue_name", "");
 
 // --- the one mapping: Salesforce queue API value -> child journey ----------------
 // Declared here only. Router 10 branches on queue_route; screen 11 prints the raw value.
@@ -18,11 +19,9 @@
   homecharge: "Allstar Homecharge / Chargepass"
 };
 
-let queue_source_value = sfCase.Last_Owner_Queue_Name__c || "";
-let queue_route = routeByQueue[queue_source_value] || "";
+let queue_route = routeByQueue[last_owner_queue_name] || "";
 
 // --- outputs ----------------------------------------------------------------
-ZT.setFormData("queue_source_value", queue_source_value);
 ZT.setFormData("queue_route", queue_route);
 ZT.setFormData("queue_route_label", labelByRoute[queue_route] || "Not in scope");
 ZT.setFormData("ai_email_from_address", senderByRoute[queue_route] || "");
```

### node 11 — Queue not in scope (content)

```diff
--- before/node 11 content
+++ after/node 11 content
@@ -1 +1 @@
-<p>This case is not handled by the AI.</p><p><strong>Queue on the case</strong>: ${queue_source_value}</p><p>Please work this case as you normally would. If this queue should have an AI journey, send the queue name to the Zingtree team.</p>
+<p>This case is not handled by the AI.</p><p><strong>Queue on the case</strong>: ${last_owner_queue_name}</p><p>Please work this case as you normally would. If this queue should have an AI journey, send the queue name to the Zingtree team.</p>
```

### node 17 — Build case review dashboard (script code)

```diff
--- before/node 17 content
+++ after/node 17 content
@@ -11,6 +11,9 @@
 const escapeHtml = value => String(value == null ? "" : value)
   .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
   .replace(/"/g, "&quot;").replace(/'/g, "&#39;");
+// Case.Description is the inbound email as PLAIN TEXT (confirmed on live CO 10 responses,
+// 2026-09-29): escape it and keep its line breaks before it goes into any HTML block.
+const emailBodyHtml = value => escapeHtml(value).replace(/\r?\n/g, "<br>");
 const muted = cls => `<span class="${cls}">&mdash;</span>`;
 const formatValue = value => {
   if (value == null || value === "") return muted("case-review-muted");
@@ -29,7 +32,7 @@
   visa_card_activation:        { topic: "Online",     subtopic: "VISA Card Activation" },
   new_user_request:            { topic: "Online",     subtopic: "New User Request" },
   copy_invoice:                { topic: "Online",     subtopic: "Copy Invoice" },
-  replacement_card:            { topic: "Online",     subtopic: "Replacements Cards" },
+  replacement_card:            { topic: "Online",     subtopic: "Replacement cards" },
   card_pins:                   { topic: "Online",     subtopic: "Card PIN(s)" },
   transaction_report:          { topic: "Online",     subtopic: "Transaction Report" },
   forgotten_password:          { topic: "Online",     subtopic: "Forgotten Password" },
@@ -126,7 +129,7 @@
     <div class="ai-feedback-status" role="status" aria-live="polite"></div>
   </div>`;
 
-let case_review_html = `
+const renderCaseReview = responseHtml => `
 <div class="case-review-shell">
   <div class="case-review-panel">
     <div class="case-review-hero">
@@ -166,11 +169,11 @@
         <div class="case-review-col case-review-col-right">
           <div class="case-review-card">
             <h3 class="case-review-card-title">Original Customer Email</h3>
-            <div class="case-review-html-card-body">${sfCase.Description && String(sfCase.Description).trim() !== "" ? sfCase.Description : muted("case-review-muted")}</div>
+            <div class="case-review-html-card-body">${sfCase.Description && String(sfCase.Description).trim() !== "" ? emailBodyHtml(sfCase.Description) : muted("case-review-muted")}</div>
           </div>
           <div class="case-review-card case-review-response-card">
             <h3 class="case-review-card-title">Email Response</h3>
-            <div class="case-review-html-card-body">${email_response.trim() !== "" ? email_response : muted("case-review-muted")}</div>
+            <div class="case-review-html-card-body">${responseHtml.trim() !== "" ? responseHtml : muted("case-review-muted")}</div>
             ${renderAiFeedback()}
           </div>
         </div>
@@ -178,6 +181,7 @@
     </div>
   </div>
 </div>`.trim();
+let case_review_html = renderCaseReview(email_response);
 
 // --- manual-changes form (Topic + Subtopic + editable HTML body) -----------------
 const buildOptions = (options, selectedValue, placeholder) =>
@@ -189,11 +193,11 @@
   `<option value="" data-topic="">Select Subtopic</option>` + choices.map(choice =>
     `<option value="${escapeHtml(choice.subtopic)}" data-topic="${escapeHtml(choice.topic)}"${choice.subtopic === selectedValue ? ' selected="selected"' : ""}>${escapeHtml(choice.subtopic)}</option>`).join("");
 
-let request_form_html = `
+const renderRequestForm = bodyHtml => `
 <div class="zt-form-card">
   <div class="zt-form-header">
     <h2 class="zt-form-title">Original Customer Email</h2>
-    <p class="zt-form-subtitle">${escapeHtml(sfCase.Description)}</p>
+    <div class="zt-form-subtitle case-review-html-card-body">${sfCase.Description && String(sfCase.Description).trim() !== "" ? emailBodyHtml(sfCase.Description) : "&mdash;"}</div>
   </div>
   <div class="zt-form-header">
     <h2 class="zt-form-title">Request Details</h2>
@@ -215,11 +219,39 @@
   </div>
   <div class="zt-form-field zt-form-field-full">
     <label class="zt-form-label">HTML Body</label>
-    <div id="htmlBodyEditor" class="zt-rich-editor" contenteditable="true">${email_response || "<p>Start typing...</p>"}</div>
-    <textarea id="HtmlBody" name="HtmlBody" data-name="HtmlBody" class="zt-data" style="display:none;">${escapeHtml(email_response)}</textarea>
+    <div id="htmlBodyEditor" class="zt-rich-editor" contenteditable="true">${bodyHtml || "<p>Start typing...</p>"}</div>
+    <textarea id="HtmlBody" name="HtmlBody" data-name="HtmlBody" class="zt-data" style="display:none;">${escapeHtml(bodyHtml)}</textarea>
     <div class="zt-form-help">Format text visually (bold, line breaks, etc.)</div>
   </div>
 </div>`.trim();
+let request_form_html = renderRequestForm(email_response);
+
+// --- GDPR pushback reply (FAST Admin only: the sender is not an authorised contact) ----
+// Corpay UK's approved GDPR pushback copy, "Allstar - GDPR button PH1" (Charley Gunning).
+// The agent decides the sender is not authorised, so the draft is fixed copy rather than
+// an AI reply. _NAMES_ is the token node 57 replaces with the authorised contacts the agent
+// types on screen 59. The reply then opens on screen 55, the same dashboard as every other
+// reply (thumbs included), and its manual-changes button opens screen 33 with this copy in
+// the editor (tracker 13 / 14, 25 Sep standup).
+const gdpr_email_body = [
+  "<p>Hello,</p>",
+  "<p>Thank you for your email.</p>",
+  "<p>Due to GDPR data protection requirements, we're unable to process this request or disclose account information, as you are not currently listed as an authorised contact or registered for access to the Allstar Online portal.</p>",
+  "<p>The authorised contacts on the account are: <strong>_NAMES_</strong></p>",
+  "<p>If you require access, one of the authorised contacts above can add you as a portal user.</p>",
+  "<p>An authorised user can complete this request through <a href=\"http://www.allstaronline.co.uk\">Allstar Online</a>. The portal allows users to:</p>",
+  "<ul>",
+  "<li>Manage purchase orders</li>",
+  "<li>Manage cards, including ordering, cancelling, replacing, and viewing PINs</li>",
+  "<li>Access reports, including active card lists and transactions</li>",
+  "<li>Manage users, including creating, updating, deactivating, locking/unlocking accounts, and resetting passwords</li>",
+  "<li>View and download invoices and statements</li>",
+  "</ul>",
+  "<p>Kind regards,<br>Allstar Customer Support</p>"
+].join("");
+
+let gdpr_review_html = renderCaseReview(gdpr_email_body);
+let gdpr_request_form_html = renderRequestForm(gdpr_email_body);
 
 // --- multiple-subtopics form (agent picks the one Salesforce Sub Topic) ---------
 let multiple_subtopics_form_html = `
@@ -254,3 +286,7 @@
 ZT.setTransformData("case_review_html", compact(case_review_html));
 ZT.setTransformData("request_form_html", compact(request_form_html));
 ZT.setTransformData("multiple_subtopics_form_html", compact(multiple_subtopics_form_html));
+// GDPR templates, still carrying _NAMES_; node 57 fills them only if the agent picks GDPR.
+ZT.setFormData("gdpr_email_body", gdpr_email_body);
+ZT.setTransformData("gdpr_review_html", compact(gdpr_review_html));
+ZT.setTransformData("gdpr_request_form_html", compact(gdpr_request_form_html));
```

### node 19 — Grade intent and build validation screen (script code)

```diff
--- before/node 19 content
+++ after/node 19 content
@@ -13,11 +13,14 @@
 const salesforceByIntent = {
   hc_missing_charges: { topic: "HC-Not Online", subtopic: "Missing Charges" },
   hc_tariff_update:   { topic: "HC-Online",     subtopic: "Update Energy/Tariff Information" },
-  hc_password_reset:  { topic: "HC-Not Online", subtopic: "Password Reset" }
+  hc_password_reset:  { topic: "HC-Not Online", subtopic: "Password Reset" },
+  hc_update_charger_details: { topic: "HC-Online", subtopic: "Update Charger Information" },
+  hc_payment_query:   { topic: "HC-Not Online", subtopic: "Payment Query / Review" }
 };
 
 // An intent with a variant group asks the agent which approved reply fits; an intent
-// without one has a single template and no select.
+// without one has a single template and no select. Payment Query is one intent with two
+// approved replies, not two intents.
 const variantGroups = [
   {
     intent: "hc_tariff_update",
@@ -27,6 +30,14 @@
       { value: "octopus_pairing_pushback", label: "Octopus pairing pushback" },
       { value: "driver_struggling_response", label: "Driver struggling response" }
     ]
+  },
+  {
+    intent: "hc_payment_query",
+    fallback: "dd_increase_pushback",
+    options: [
+      { value: "dd_increase_pushback", label: "Driver's electricity direct debit has increased" },
+      { value: "underpayment_response", label: "Driver claiming underpayment" }
+    ]
   }
 ];
 
@@ -100,12 +111,13 @@
 // Charley's assumption: an empty Contact on the case points to a driver rather than a
 // fleet manager. OPEN ITEM #3. It is not asked on screen 21 - Charley's Homecharge matrix
 // (2026-09-23) allows no question before a reply except the approved-reply choice.
-let hc_requester_type = sfCase.ContactId ? "fleet" : "driver";
+let hc_requester_type = ZT.getVariableValue("sf_ContactId", "") ? "fleet" : "driver";
 
 // --- does screen 21 have anything to ask? ---------------------------------------
 // Per Charley's matrix, the only question asked before a reply is generated is which
-// approved reply fits (Update Tariff / Energy Supplier today). Every other intent -
-// Missing Charges, Password Reset - goes straight to the drafted reply.
+// approved reply fits (Update Tariff / Energy Supplier and Payment Query). Every other
+// intent - Missing Charges, Password Reset, Update Charger Information - goes straight to
+// the drafted reply.
 if (email_analysis_route === "in_scope" && variantOptions.length === 0) {
   email_analysis_route = "in_scope_no_questions";
 }
@@ -124,7 +136,11 @@
 
 let customerEmailBody = "<span class=\"case-review-muted\">&mdash;</span>";
 if (sfCase.Description && String(sfCase.Description).trim() !== "") {
-  customerEmailBody = sfCase.Description;
+  // Case.Description is plain text on live cases: escape it and keep its line breaks.
+  customerEmailBody = String(sfCase.Description)
+    .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
+    .replace(/"/g, "&quot;").replace(/'/g, "&#39;")
+    .replace(/\r?\n/g, "<br>");
 }
 
 let hc_case_summary_html = "<div class=\"case-review-shell\"><div class=\"case-review-panel\">"
```

### node 24 — Set case origin and template key (script code)

```diff
--- before/node 24 content
+++ after/node 24 content
@@ -18,18 +18,30 @@
 hc_template_key = hc_template_key + ":" + requester_type;
 let hc_copy_approved = requester_type === "driver";
 
-// Some approved templates ship with a placeholder only the agent can fill, so the draft
-// cannot go out untouched. Router 31 sends these to the manual-changes screen instead of
-// the send path.
-const manualEditByVariant = {
-  underpayment_response: "The approved underpayment reply leaves the unit rate as [INSERT UNIT RATE EXCLUDING VAT] - put the driver's rate in before this goes out."
+// Some approved templates carry a gap only the agent can fill. Each row names the native
+// field on screen 23 that asks for it, the driver that shows that field, and the token node
+// 26 replaces with the answer, so the draft arrives on the dashboard already filled in.
+// A new placeholder is one row here plus one conditional field on screen 23.
+const emailInputsByVariant = {
+  underpayment_response: [
+    { field: "hc_unit_rate", driver: "hc_ask_unit_rate", token: "[INSERT UNIT RATE EXCLUDING VAT]" }
+  ]
 };
-let hc_manual_changes_reason = manualEditByVariant[response_variant] || "";
+const allDrivers = ["hc_ask_unit_rate"];
+let hc_email_inputs = emailInputsByVariant[response_variant] || [];
+let askedDrivers = [];
+for (let i = 0; i < hc_email_inputs.length; i++) {
+  askedDrivers.push(hc_email_inputs[i].driver);
+}
 
 // --- outputs ----------------------------------------------------------------
 // Salesforce Case Origin stamped on every AI-handled case.
 ZT.setFormData("sf_Origin", "Zingtree AI");
 ZT.setFormData("hc_template_key", hc_template_key);
 ZT.setFormData("hc_copy_approved", hc_copy_approved);
-ZT.setFormData("hc_manual_changes_required", hc_manual_changes_reason !== "");
-ZT.setFormData("hc_manual_changes_reason", hc_manual_changes_reason);
+// Screen 23's conditional fields test these drivers as the strings "true" / "false".
+for (let i = 0; i < allDrivers.length; i++) {
+  ZT.setFormData(allDrivers[i], askedDrivers.indexOf(allDrivers[i]) !== -1 ? "true" : "false");
+}
+ZT.setFormData("hc_email_inputs", JSON.stringify(hc_email_inputs));
+ZT.setFormData("hc_email_inputs_required", hc_email_inputs.length > 0);
```

### node 26 — Build case review dashboard (script code)

```diff
--- before/node 26 content
+++ after/node 26 content
@@ -9,12 +9,15 @@
 let requester_type = ZT.getVariableValue("hc_requester_type", "driver");
 let response_variant = ZT.getVariableValue("hc_response_variant", "");
 let copy_approved = ZT.getVariableValue("hc_copy_approved", true);
-let manual_changes_reason = ZT.getVariableValue("hc_manual_changes_reason", "");
+let email_inputs = JSON.parse(ZT.getVariableValue("hc_email_inputs", "[]"));
 
 // --- shared helpers -----------------------------------------------------------
 const escapeHtml = value => String(value == null ? "" : value)
   .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
   .replace(/"/g, "&quot;").replace(/'/g, "&#39;");
+// Case.Description is the inbound email as PLAIN TEXT (confirmed on live CO 10 responses,
+// 2026-09-29): escape it and keep its line breaks before it goes into any HTML block.
+const emailBodyHtml = value => escapeHtml(value).replace(/\r?\n/g, "<br>");
 const muted = cls => `<span class="${cls}">&mdash;</span>`;
 const formatValue = value => {
   if (value == null || value === "") return muted("case-review-muted");
@@ -24,6 +27,20 @@
   return escapeHtml(value);
 };
 const normalizeIntentKey = value => String(value || "").trim().toLowerCase().replace(/\s+/g, "_");
+
+// --- the details the agent gave on screen 23, written into the draft ------------------
+// Each token is matched case-insensitively with flexible spacing, in case the generation
+// AI Action reflows it. A gap still open afterwards (the AI reworded the token, or a new
+// template gained one nobody mapped) sends the case to screen 33 through router 31.
+for (let i = 0; i < email_inputs.length; i++) {
+  let pattern = email_inputs[i].token.replace(/[.*+?^${}()|[\]\\]/g, "\\$&").replace(/\s+/g, "\\s+");
+  let answer = escapeHtml(String(ZT.getVariableValue(email_inputs[i].field, "")).trim());
+  email_response = email_response.replace(new RegExp(pattern, "gi"), function () { return answer; });
+}
+let unfilledGap = email_response.match(/\[\s*INSERT[^\]]*\]/i);
+let manual_changes_reason = unfilledGap
+  ? "The reply still contains " + unfilledGap[0] + " - fill it in before this goes out."
+  : "";
 
 // intent key -> Salesforce Topic / Sub Topic (also the dashboard label). The map is declared
 // once, in node 19; this is that same map read back. Homecharge has its own Topic namespace:
@@ -113,8 +130,8 @@
     <p>The approved Homecharge templates are written for drivers. This reply was re-framed for a fleet manager, so read it in full before sending.</p>
   </div>`;
 
-// Some approved templates carry a placeholder only the agent can fill, so router 31 sends
-// the case to the manual-changes screen. Say so here - the dashboard still shows a Send button.
+// A placeholder that survived screen 23's answers: router 31 sends the case to the
+// manual-changes screen. Say so here - the dashboard still shows a Send button.
 const renderManualEditNotice = () => manual_changes_reason === "" ? `` : `
   <div class="case-review-card" style="background:#fef2f2;border-color:#fecaca;">
     <h3 class="case-review-card-title">This reply has to be edited before it is sent</h3>
@@ -178,7 +195,7 @@
           ${renderCopyNotice()}
           <div class="case-review-card">
             <h3 class="case-review-card-title">Original Customer Email</h3>
-            <div class="case-review-html-card-body">${sfCase.Description && String(sfCase.Description).trim() !== "" ? sfCase.Description : muted("case-review-muted")}</div>
+            <div class="case-review-html-card-body">${sfCase.Description && String(sfCase.Description).trim() !== "" ? emailBodyHtml(sfCase.Description) : muted("case-review-muted")}</div>
           </div>
           <div class="case-review-card case-review-response-card">
             <h3 class="case-review-card-title">Email Response</h3>
@@ -205,7 +222,7 @@
 <div class="zt-form-card">
   <div class="zt-form-header">
     <h2 class="zt-form-title">Original Customer Email</h2>
-    <p class="zt-form-subtitle">${escapeHtml(sfCase.Description)}</p>
+    <div class="zt-form-subtitle case-review-html-card-body">${sfCase.Description && String(sfCase.Description).trim() !== "" ? emailBodyHtml(sfCase.Description) : "&mdash;"}</div>
   </div>
   <div class="zt-form-header">
     <h2 class="zt-form-title">Request Details</h2>
@@ -261,6 +278,7 @@
 ZT.setFormData("sf_Topic__c", salesforce.topic);
 ZT.setFormData("sf_Sub_Topic__c", salesforce.subtopic);
 ZT.setFormData("has_multiple_intents", has_multiple_intents);
+ZT.setFormData("hc_manual_changes_required", manual_changes_reason !== "");
 // Form-data merge fields render newlines as <br>, so the HTML is written on one line.
 const compact = html => html.replace(/\s*\n\s*/g, " ");
 ZT.setTransformData("case_review_html", compact(case_review_html));
```

### node 32 — Choose the Topic and Sub Topic (content)

```diff
--- before/node 32 content
+++ after/node 32 content
@@ -1 +1 @@
-${transforms.multiple_subtopics_form_html}
+<p>${transforms.multiple_subtopics_form_html}</p>
```

### node 45 — Load example email (script code)

```diff
--- before/node 45 content
+++ after/node 45 content
@@ -71,6 +71,10 @@
     subject: "Fuel price query",
     body: "Hello,\n\nCould you tell me what the fuel price will be at the Moto services on the M1 next week, and whether your network covers Northern Ireland?\n\nThanks,\nEllie Marsh"
   },
+  test_fast_admin_gdpr_non_authorised: {
+    subject: "Invoices for our account",
+    body: "Hi,\n\nI've just joined the finance team at Northgate Plumbing. Please can you send me copies of the last three invoices for our Allstar account?\n\nThanks,\nPriya Shah\nFinance Assistant"
+  },
   test_hc_password_reset: {
     subject: "Can't log in to my Homecharge account",
     body: "Hi,\n\nI can't log in to my Homecharge account, it says my password is wrong every time. I've forgotten password and don't know how to reset password.\n\nCan you help?\n\nThanks,\nDavid Elliott"
@@ -98,6 +102,18 @@
   test_hc_missing_charges_with_screenshots: {
     subject: "Missing charges - screenshots attached",
     body: "Hello,\n\nAs requested, please find attached the screenshots of my home charging sessions from my charger app showing the kWh figures. My session data is missing from the Homecharge portal.\n\nThanks,\nPriya Raval"
+  },
+  test_hc_update_charger_details: {
+    subject: "New charger installed",
+    body: "Good morning,\n\nWe have had a new charger installed at my home last week, the old one was faulty so the charger has been replaced. I need to update charger details on my account so my sessions come through again.\n\nThe new unit is a Zappi.\n\nThanks,\nStephen Ward"
+  },
+  test_hc_payment_query_dd_increase: {
+    subject: "My direct debit has gone up",
+    body: "Hi,\n\nWhy has my direct debit increased? My energy supplier increased my direct debit this month and my monthly payment has gone up by quite a lot since I started charging the car at home.\n\nIs that right?\n\nThanks,\nGraham Poole"
+  },
+  test_hc_payment_query_underpayment: {
+    subject: "Reimbursement lower than expected",
+    body: "Hello,\n\nI think I have been underpaid. The payment amount seems low - my reimbursement is lower than expected for last month and I expected more money given how much I charged.\n\nPlease can you check the amount paid is correct?\n\nThanks,\nHannah Ridley"
   },
   test_hc_multiple_intents: {
     subject: "Two things please",
```

### node 47 — Seed mocked Salesforce data (script code)

```diff
--- before/node 47 content
+++ after/node 47 content
@@ -8,6 +8,9 @@
 //                           against the Case Id and Account Id typed on screen 44. UK org 123
 //                           only, and the send at node 38 is a real email.
 // mock_downstream carries that choice to the routers. Nothing here runs on the live path.
+// Real-data contract (2026-09-29): every seed copies the confirmed response shape only -
+// records + _zt_meta, confirmed fields only. Never add a field here that the workflow could
+// start reading; if a node needs a field, confirm it in a real response first.
 
 // --- inputs -----------------------------------------------------------------
 let test_subject = ZT.getVariableValue("test_subject", "Testing Case");
@@ -27,8 +30,9 @@
   accountId = test_sf_account_id.trim() !== "" ? test_sf_account_id.trim() : "001Ad000010Va2fIAC";
 }
 let emailBody = test_email.trim() !== "" ? test_email : example_body;
-// Salesforce stores the inbound email as HTML in Case.Description.
-let description = emailBody.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/\n/g, "<br>");
+// Case.Description arrives as the plain-text email body (confirmed on live CO 10 responses,
+// 2026-09-29), so the seed carries it unchanged. Nodes 17, 19 and 26 escape it for display.
+let description = emailBody;
 
 // --- the journey under test -----------------------------------------------------
 // The scenario key carries it: test_hc_ scenarios mock a Homecharge case, everything else a
@@ -64,16 +68,17 @@
 ZT.setFormData("caseId", caseId);
 ZT.setFormData("sf_CaseNumber", mockCase.caseNumber);
 ZT.setFormData("sf_Subject", test_subject);
+// Live launches carry the case Contact as sf_ContactId (Salesforce app); node 19 reads it.
+ZT.setFormData("sf_ContactId", mockCase.contactId || "");
 
 // --- outputs: mocked Connected Object responses ---------------------------------
 ZT.setResponseData("get_case_details__prod", {
   _zt_meta: { response: { code: 200 } },
-  totalSize: 1, done: true,
   records: [{
     Id: caseId, CaseNumber: mockCase.caseNumber, Subject: test_subject, Description: description,
-    SuppliedEmail: mockCase.suppliedEmail, AccountId: accountId, ContactId: mockCase.contactId,
+    SuppliedEmail: mockCase.suppliedEmail, AccountId: accountId,
     Origin: "Email", Status: "New", Topic__c: "Please select one", Sub_Topic__c: "Please select one",
-    Business_Process__c: "Operations", RecordTypeId: "0124J000000Cv1rQAA", OwnerId: "00G4J000000jcvjUAA",
+    Business_process__c: "Operations", RecordTypeId: "0124J000000Cv1rQAA", OwnerId: "00G4J000000jcvjUAA",
     Initial_Case_Queue_Name__c: mockCase.queue, Last_Owner_Queue_Name__c: mockCase.queue, Queue_Email__c: null,
     CreatedDate: "2026-09-11T09:15:32.000+0000", Last_Email_Date__c: "2026-09-11T09:15:18.000+0000"
   }]
@@ -84,15 +89,12 @@
 if (mock_all) {
   ZT.setResponseData("get_account_details__prod", {
     _zt_meta: { response: { code: 200 } },
-    totalSize: 1, done: true,
-    records: [{ Id: accountId, Name: "Northgate Plumbing Ltd", Framework__c: null,
+      records: [{ Framework__c: null,
       Account_Segment__c: "SME", AS_Account_Administrator__c: mockCase.accountAdmin }]
   });
   ZT.setResponseData("get_incoming_email_addresses_prod", {
     _zt_meta: { response: { code: 200 } },
-    totalSize: 1, done: true,
-    records: [{ Id: "02sAd00000MOCK0001", FromAddress: mockCase.suppliedEmail, ToAddress: mockCase.toAddress,
-      CcAddress: mockCase.ccAddress, BccAddress: null, Incoming: true, MessageDate: "2026-09-11T09:15:18.000+0000" }]
+      records: [{ CcAddress: mockCase.ccAddress }]
   });
   ZT.setResponseData("send_email_simple_prod", {
     _zt_meta: { response: { code: 200 } },
```

### node 48 — claude.md (content)

```diff
--- before/node 48 content
+++ after/node 48 content
@@ -18,22 +18,27 @@
 
 Use cases: FAST Admin (13 intents, ported 1:1 from GT's "Email Automation - AI Actions INT"
 109029630 org 123) and Homecharge Phase 1 - Missing Charges, Tariff Update, Password Reset.
+Release 2 (INT, 2026-09-24 standup): Update Charger Information and Payment Query are back,
+plus the FAST Admin GDPR pushback button (tracker R41). Compatible Chargers and Resent
+Onboarding Email stay out.
 Phase 1 ran to seven intents; Charley Gunning cut it to the three that can carry a full
 25-case test pass inside one release week. Update Charger Information, Compatible Chargers,
 Payment Query and Resent Onboarding Email are OUT of INT and come back through the release
 management cadence, one release at a time.
 
-## Architecture (50 nodes + this one)
+## Architecture (55 nodes + this one)
 
 Shared front end - runs once, whichever journey follows
 1  Content  Start (root)                -> 2 live / 44 Test Mode
-2  Data     Get case + inbound email     get_case_details__prod (1263) -> 3
+2  Data     Get case + inbound email     get_case_details__prod (1263) -> 58
+58 Script   Capture last owner queue     last_owner_queue_name (for the form data report,
+                                         before any account check) -> 3
 3  Scoring  Account linked to case?      mock_downstream == true -> 6; AccountId != null -> 5; else 4
 4  Content  No account linked            button -> 2
 5  Data     Get account details          get_account_details__prod (1264) -> 6
 6  Script   Check AI eligibility         ai_account_eligibility, ai_bypass_reason -> 7
 7  Scoring  Account AI eligible?         true -> 8; false -> 9
-8  Script   Resolve queue route          queue_source_value, queue_route, queue_route_label,
+8  Script   Resolve queue route          reads last_owner_queue_name; queue_route, queue_route_label,
                                          ai_email_from_address -> 10
 9  Content  Account not eligible         terminal
 10 Scoring  Queue route                  fast_admin -> 12; homecharge -> 18; else 11
@@ -46,7 +51,20 @@
 14 Scoring  Email analysis route         escalation -> 27; in_scope -> 15; else 29
 15 Script   Set case origin              sf_Origin -> 16
 16 AI       Generate email response      automate_email_generation (94) -> 17
-17 Script   Build case review dashboard  -> 30
+17 Script   Build case review dashboard  one renderer for every dashboard (renderCaseReview) and
+                                         every manual form (renderRequestForm); also stages the GDPR
+                                         templates gdpr_email_body, gdpr_review_html,
+                                         gdpr_request_form_html (all carry _NAMES_) -> 54
+54 Content  Dashboard - FAST Admin       clone of 30 + third button "Non-authorised user: GDPR
+                                         response" (button_data "Sent GDPR response") -> 59
+59 Content  Provide the authorised       Corpay's wording (tracker 15); native gdpr_authorised_names
+            contacts                     -> 57
+57 Script   Write contacts into GDPR     fills _NAMES_; sets HtmlBody, gdpr_review_html and
+                                         request_form_html (screen 33's editor gets the GDPR copy) -> 55
+55 Content  GDPR response dashboard      ${transforms.gdpr_review_html}: the standard dashboard with
+                                         the GDPR reply, thumbs, native ai_feedback fields, score_var
+                                         ai_suggested_email; Yes ("Sent GDPR response") -> 31;
+                                         No - manual changes -> 33
 
 Homecharge lane
 18 AI       Detect Homecharge intent     automate_hc_email_intent_prod (98) -> 19
@@ -58,9 +76,17 @@
 21 Content  Choose the approved reply    case summary + email, one native select
                                          hc_response_variant -> 24 (Tariff only)
 24 Script   Set origin + template key    sf_Origin, hc_template_key, hc_copy_approved,
-                                         hc_manual_changes_required -> 25
+                                         hc_email_inputs, hc_email_inputs_required, hc_ask_* -> 22
+22 Scoring  Reply details needed?        hc_email_inputs_required == true -> 23; else 25
 25 AI       Generate email response      automate_hc_email_generation_prod (99) -> 26
-26 Script   Build case review dashboard  hc_show_screenshots_stop -> 52
+26 Script   Build case review dashboard  writes screen 23's answers into the draft,
+                                         hc_manual_changes_required (a gap survived),
+                                         hc_show_screenshots_stop -> 52
+
+Reply details - Homecharge, before the reply the agent reviews
+23 Content  Add the details the reply    one native conditional field per agent-filled gap:
+            needs                        hc_unit_rate (hc_ask_unit_rate) -> 25
+            (GDPR moved to its own screen 59 on 2026-09-28; router 56 deleted)
 
 Shared escalation / out of scope
 27 Script   Build escalation notice      escalation_html, all seven reasons -> 28
@@ -69,7 +95,7 @@
 
 Shared tail - both lanes converge here
 52 Scoring  Screenshots option needed?   hc_show_screenshots_stop == true -> 53; else 30
-30 Content  Case review dashboard        score_var ai_suggested_email; native ai_feedback +
+30 Content  Case review dashboard        Homecharge only since 2026-09-24; score_var ai_suggested_email; native ai_feedback +
                                          ai_feedback_comments; Yes -> 31; No (manual) -> 33
 53 Content  Dashboard - missing charges  same score_var and feedback fields as 30;
                                          Yes -> 31; No (manual) -> 33;
@@ -111,7 +137,9 @@
 - sentiment and confidence_score look unread to the lint and are not. sentiment is merged into
   the GENERATION AI Actions' own context ("Customer Sentiment: ${sentiment}"), outside this
   export; confidence_score is printed by the dashboard scripts 17 and 26. Neither is dead.
-- queue_source_value - the raw Last_Owner_Queue_Name__c value, printed on screen 11.
+- last_owner_queue_name - the raw Last_Owner_Queue_Name__c value; node 58, right after the case
+  is read, so it reaches the form data report on every case. Read by node 8, printed on screen 11.
+  Was queue_source_value, written by node 8 only after eligibility (renamed 2026-09-28).
 - queue_route - "fast_admin" | "homecharge" | "" - the only thing router 10 branches on.
 - queue_route_label - node 8, display. queue_routes_known is gone; nothing read it.
 - ai_email_from_address - node 8, from senderByRoute: fast_admin -> fast.admin@allstarcard.co.uk,
@@ -138,7 +166,7 @@
   a case out of scope when ANY detected intent is missing a row, so an intent the AI Action still
   returns after it was cut from Phase 1 lands on screen 29 instead of throwing.
 - hc_variant_labels - flat variant key -> label map, declared in node 19, parsed by node 26.
-- ai_suggested_email - score_var on screens 30, 53 and 32; the clicked button's button_data
+- ai_suggested_email - score_var on screens 30, 53, 54, 32 and 33 (33 always records "Made manual changes"); the clicked button's button_data
   ("Sent AI suggested email" / "Made manual changes"). Corpay UK's reporting reads it. It went
   missing from node 30 on 2026-09-22 (restored by Brent 2026-09-23); 53 and 32 never had it.
 - ai_feedback ("thumbs_up" | "thumbs_down" | "") - written ONLY by the thumbs buttons, into a
@@ -165,8 +193,18 @@
   of the detected intents, which is the only dashboard that carries the third button.
 - sf_Origin ("Zingtree AI"), hc_template_key, hc_copy_approved - nodes 15 / 24. sf_Origin is a
   predefined variable, so the marketplace app writes it to Case Origin.
-- hc_manual_changes_required (bool), hc_manual_changes_reason - node 24. The boolean is router
-  31's first test; the reason is printed on the dashboard by node 26.
+- hc_email_inputs (JSON string [{field, driver, token}]), hc_email_inputs_required (bool),
+  hc_ask_unit_rate ("true"/"false") - node 24, from emailInputsByVariant: the agent-filled gaps
+  of the chosen approved reply. Router 22 opens screen 23 on hc_email_inputs_required; the
+  driver shows its field there; node 26 replaces each token with the field's answer.
+- hc_unit_rate - native text on screen 23 (underpayment_response), written into the draft by 26.
+- gdpr_authorised_names - native text on screen 59, written over _NAMES_ by node 57.
+- gdpr_email_body (form, HTML payload with _NAMES_) - node 17; node 57 fills it into HtmlBody.
+- gdpr_review_html, gdpr_request_form_html (transforms) - node 17 templates; 57 renders the
+  first for screen 55 and writes the second over request_form_html for screen 33.
+- hc_manual_changes_required (bool) - node 26: true only when a [INSERT ...] gap is still in the
+  draft after screen 23's answers are written in (the AI reworded a token, or a template gained
+  a gap no row maps). Router 31's first test; node 26 prints why on the dashboard.
 - sf_Energy_Provider__c, sf_Data_Provider__c - native selects on screen 51 (Homecharge lane
   only). Predefined variables: the Zingtree Salesforce marketplace app loads the Case's current
   values into them (so the selects open pre-selected) and writes the agent's choice back to
@@ -209,9 +247,14 @@
   hc_missing_charges         HC-Not Online / Missing Charges
   hc_tariff_update           HC-Online     / Update Energy/Tariff Information
   hc_password_reset          HC-Not Online / Password Reset
+  hc_update_charger_details  HC-Online     / Update Charger Information   (back 2026-09-24)
+  hc_payment_query           HC-Not Online / Payment Query                (back 2026-09-24)
 One intent carries response variants, pre-selected by the intent AI Action and confirmed by the
 agent on screen 21:
   hc_tariff_update  standard_driver_pushback, octopus_pairing_pushback, driver_struggling_response
+  hc_payment_query  dd_increase_pushback, underpayment_response (underpayment asks for the unit
+                    rate on screen 23 before the draft; node 26 writes it over
+                    [INSERT UNIT RATE EXCLUDING VAT])
 Retired from INT with the Phase 1 cut, in the map's own words - each comes back as one row here,
 one row in requiredChecksByIntent, its Test Mode scenario and its line in AI Action 98's prompt:
   hc_update_charger_details  HC-Online     / Update Charger Information
@@ -300,7 +343,7 @@
   than a screen, is form data. The three-tree merge moved all seven of this tree's blocks to
   form data; 2026-09-15 moved them back. The seven pairs: 17/26 -> 30, 17/26 -> 33, 17/26 -> 32,
   19 -> 21, 27 -> 28, 39 -> 41, 45 -> 46. Plain scalars printed on a screen
-  (queue_source_value, ai_bypass_reason, ai_exception_reason, errorEmailMessage) stay form data.
+  (last_owner_queue_name, ai_bypass_reason, ai_exception_reason, errorEmailMessage) stay form data.
 - HOW EACH CALL IS GRADED, and why the two kinds differ:
     Connected Object - the response code, e.g. send._zt_meta.response.code on node 39, which
     only reads the composite result on a 2xx. In Test Mode node 47 seeds all four SFDC
@@ -380,11 +423,21 @@
   early is safe and costs no setter node. Corpay has no compliance sign-off for AI reading
   attachments (Charley Gunning), so the AI cannot decide this itself; revisit when it does.
 - Screen 21 is skipped unless the case has an approved-reply choice.
-- A response variant whose approved template carries a placeholder sets hc_manual_changes_required
-  in node 24, and router 31 tests it FIRST - ahead of the multi-intent branch - so the send path
-  cannot be reached without an edit. Today that is underpayment_response, whose template leaves
-  [INSERT UNIT RATE EXCLUDING VAT] for the driver's kWh rate. Nothing is lost by skipping screen
-  32: screen 33 carries the Topic and Sub Topic selects too.
+- AGENT-FILLED GAPS ARE ASKED FOR BEFORE THE REPLY, NOT EDITED AFTER IT. Any approved reply
+  with a gap only the agent can fill gets it asked on screen 23 - one native conditional field
+  per gap, shown by its own driver - and the answer is written into the email before the agent
+  sees it. Homecharge: node 24's emailInputsByVariant row (field, driver, token), node 26 does
+  the replace after AI Action 25. GDPR: node 17 keeps _NAMES_ as a token, node 57 does the
+  replace. A new gap is one row (or one token) plus one field on screen 23.
+- The tokens are replaced in the tree, not by the AI Action: the rate is a value the reply must
+  carry exactly, so it never goes through the model. The generation Action still returns the
+  token verbatim; node 26 matches it case-insensitively with flexible spacing.
+- Safety net: if a [INSERT ...] gap is still in the draft after the replace, node 26 sets
+  hc_manual_changes_required and router 31 tests it FIRST - ahead of the multi-intent branch -
+  so the send path cannot be reached without an edit on screen 33 (which carries the Topic and
+  Sub Topic selects too). Normal underpayment runs no longer reach screen 33.
+- Screen 23's drivers are strings "true"/"false" (the conditional compares text); each lane
+  sets only its own, and the other lane's field stays hidden because its driver is unset.
 - BOTH PROVIDER FIELDS ARE RESTRICTED PICKLISTS. Salesforce rejects a value that does not match
   its own list character for character, so node 50 carries the 27 energy and 25 data values
   verbatim - including the two that read as typos, "SSE Airticity" and "Uknown / Unspecified".
@@ -404,7 +457,53 @@
   points at. Importing it as a new tree means updating the layout.
 
 ## Changelog
-- 2026-09-24 Claude - PROMOTE INT 109029630 -> PROD 417189428 (org 123). COs 10->22, 20->21, 23->24, 187->203; AI Actions node 12 16->13, node 16 15->12, node 18 19->20, node 25 18->21 (Homecharge prod actions created 2026-09-24, no placeholders). Aliases renamed to prod.
+- 2026-09-30 Claude - PROD release prep (standup 30 Sep): node 17's replacement_card Sub Topic spelled
+  "Replacement cards" (Gemma's matrix; "Replacements Cards" did not map onto the Case). Node 3's AccountId
+  button label now matches its expression (the label read records[0].Account, not a real CO 10 field).
+- 2026-09-29 Claude - live test pass (real CO 10 responses): Case.Description is plain text, not HTML.
+  Nodes 17, 19 and 26 now escape it and keep its line breaks (it was dropped into the dashboards raw, so
+  paragraphs collapsed and any < or & in a customer email rendered as markup); node 47 seeds it as plain
+  text like the real response instead of pre-escaping it.
+- 2026-09-29 Claude - real-data contract pass: node 6 reads Business_process__c (CO 10 schema spelling;
+  Business_Process__c came back undefined live, so the business-process bypass never fired); node 19
+  reads sf_ContactId instead of CO 10 ContactId (not in the response, so every live case was 'driver');
+  node 47 seeds cut to confirmed fields only (no totalSize/done, no ContactId, account and CC seeds
+  reduced to the fields the tree reads) and seeds sf_ContactId for the fleet scenario.
+- 2026-09-29 Claude - node 58 no longer reads totalSize: the Salesforce Connected Object response carries only records + _zt_meta, so every live case graded as 'no case' and landed on screen 11 (Queue not in scope, blank queue). Now graded on _zt_meta.response.code and records. Edited live in UK INT 109029630. Node 58, 48.
+- 2026-09-28 Claude (live INT test) - node 58 grades the case fetch on _zt_meta.response.code and totalSize before reading records[0]; a launch with no case (bare preview, bad Id) threw 'Script node execution failed' and left the workflow unrecoverable instead of reaching screen 4. Edited live in UK INT 109029630 and mirrored here. Node 58, 48.
+- 2026-09-28 Claude - PROMOTE sandbox 605565 -> UK org 123. org_id 605565->123; COs 1263->10, 1264->20, 1265->23 (http->salesforce), 1266->187; AI Actions node 12 93->16, node 16 94->15, node 18 98->19, node 25 99->18; root_node_id 1->2. Tree id/name set to the UK INT tree (109029630, Email Automation - AI Actions INT).
+- 2026-09-28 Claude (Corpay UK standups 25 + 28 Sept, tracker 13/14/15/20/21 + subtopic delay) -
+  node 6: Account_Segment__c "SMB" eligible alongside "SME". New script 58 (2 -> 58 -> 3, and
+  Test Mode 47 -> 58) writes last_owner_queue_name at the start; node 8 reads it; screen 11 prints
+  it; predefined var renamed from queue_source_value. GDPR: dashboard 54's button -> new screen
+  59 (Corpay's authorised-contacts wording) -> 57 -> 55, and 55 is now the standard dashboard
+  (thumbs + Yes/send + No/manual changes) instead of the manual-changes form. Node 17 renders
+  every dashboard and manual form through renderCaseReview / renderRequestForm; gdpr_ask_names
+  gone; screen 23 Homecharge-only and -> 25; router 56 deleted. script_code: the Topic ->
+  Subtopic filter now rebuilds whenever the Topic on screen differs from the one the list was
+  built for (next tick, Topic change, Subtopic mousedown/focus) - fixes the empty Subtopic list
+  until Topic was toggled. Test Mode path 47 -> 58 is Script -> Script by necessity (QA only).
+  Nodes 6, 8, 11, 17, 23, 54, 55, 56 (deleted), 57, 58 (new), 59 (new), script_code, 48.
+- 2026-09-28 Claude - DEMOTE UK org 123 -> sandbox 605565. org_id 123->605565; COs 10->1263, 20->1264, 23->1265 (salesforce->http), 187->1266; AI Actions node 12 16->93, node 16 15->94, node 18 19->98, node 25 18->99; root_node_id 2->1. Source: UK INT export 2026-09-28 (already carried Payment Query / Review and the <p> wrap on screen 32).
+- 2026-09-24 Claude (Brent: collect manual inputs before the draft) - new screen 23 "Add the
+  details the reply needs" with native conditional fields hc_unit_rate / gdpr_authorised_names;
+  router 22 (24 -> 22 -> 23|25) and router 56 (23 -> 25 Homecharge | 57 FAST); script 57 writes
+  the names over _NAMES_. Node 24's manualEditByVariant became emailInputsByVariant; node 26
+  writes the answers into the draft and only sets hc_manual_changes_required if a gap survives;
+  node 17's GDPR subtitle no longer asks the agent to replace _NAMES_; dashboard 54's GDPR button
+  -> 23. hc_manual_changes_reason is now local to node 26. Nodes 17, 22, 23, 24, 26, 54, 56, 57, 48.
+- 2026-09-24 Claude - PROMOTE sandbox 605565 -> UK org 123. org_id 605565->123; COs 1263->10, 1264->20, 1265->23 (http->salesforce), 1266->187; AI Actions node 12 93->16, node 16 94->15, node 18 98->19, node 25 99->18; root_node_id 1->2.
+- 2026-09-24 Claude - screen 33 now carries score_var ai_suggested_email with button_data "Made manual changes". Before, an underpayment reply that router 31 forced onto screen 33 kept the "Sent AI suggested email" value from the dashboard Yes button, so reporting counted an agent-edited email as unedited.
+- 2026-09-24 Claude - "Original Customer Email" on screens 33 (both lanes) and 55 rendered Case.Description escaped inside a <p>, so its HTML showed as literal <br> tags. Nodes 17 and 26 now render it as HTML in a div, the same way the dashboards (30/53/54) and screen 21 already do.
+- 2026-09-24 Claude (UAT standup 24 Sept: "two intents + GDPR into INT") - node 19: map rows
+  hc_update_charger_details and hc_payment_query, Payment Query variant group. Nodes 44/45: four
+  Test Mode scenarios (test_hc_update_charger_details, test_hc_payment_query_dd_increase,
+  test_hc_payment_query_underpayment, test_fast_admin_gdpr_non_authorised). GDPR pushback (Charley's
+  "Allstar - GDPR button PH1", FAST Admin queue only): node 17 stages gdpr_request_form_html, new
+  dashboard 54 (FAST lane, 17 -> 54) with the third button, new screen 55 -> 49. Screen 30 is now
+  the Homecharge dashboard. AI Action 98 re-extended to five intents in org 605565 (99 already held
+  both templates). The GDPR draft is fixed approved copy, not AI-generated.
+- 2026-09-23 Claude - DEMOTE UK org 123 -> sandbox 605565. org_id 123->605565; COs 10->1263, 20->1264, 23->1265 (salesforce->http), 187->1266; AI Actions node 12 16->93, node 16 15->94, node 18 19->98, node 25 18->99; root_node_id 2->1.
 - 2026-09-23 Brent / Claude - ai_feedback_comments now appears ONLY on thumbs_down; thumbs_up hides it and clears any text (field + session var). Thumbs-up status line no longer invites a comment. script_code, 48.
 - 2026-09-23 Claude - PROMOTE sandbox 605565 -> UK org 123. org_id 605565->123; COs 1263->10 (salesforce), 1264->20 (salesforce), 1265->23 (salesforce), 1266->187 (http); AI Actions node 12 93->16, node 16 94->15, node 18 98->19, node 25 99->18; root_node_id 1->2.
 - 2026-09-23 Brent / Claude - send still JSON_PARSER_ERROR col 3: merges are NOT escaped, so HtmlBody's quotes broke the body, and a real [] merged as nothing. Node 36 now stages ccAddresses as JSON text and adds email_body_json / email_subject_json; send CO template reads those two. Nodes 36, 48.
```

## CHANGES THAT NEED AN EXPLANATION

Every line below must map to a requirement or an explicit request.
Anything unexplained is unintended drift — revert it before delivering.

  [ ] added node 22 (Reply details needed?)
  [ ] added node 23 (Add the details the reply needs)
  [ ] added node 54 (Case review dashboard - FAST Admin)
  [ ] added node 55 (GDPR response - non-authorised contact)
  [ ] added node 57 (Write authorised contacts into GDPR reply)
  [ ] added node 58 (Capture last owner queue)
  [ ] added node 59 (Provide the authorised contacts for this account)
  [ ] node 2 — continuation_node_id: 3 → 58 — Get case and inbound email
  [ ] node 3 — button added/changed: "actions.get_case_details__prod.records[0].AccountId != null" → node 5 [logic: actions.get_case_details__prod.records[0].AccountId != null]
  [ ] node 3 — button removed/replaced: "actions.get_case_details__prod.records[0].Account" → node 5
  [ ] node 6 — script code changed (32 → 33 lines) — Check AI eligibility
  [ ] node 8 — script code changed (28 → 27 lines) — Resolve queue route
  [ ] node 11 — content changed (240 → 243 characters) — Queue not in scope
  [ ] node 17 — script code changed (256 → 292 lines) — Build case review dashboard
  [ ] node 17 — continuation_node_id: 30 → 54 — Build case review dashboard
  [ ] node 19 — script code changed (185 → 201 lines) — Grade intent and build validation screen
  [ ] node 24 — node_name: "Stamps sf_Origin and resolves the template key the generation ac" → "Stamps sf_Origin, resolves the template key and which reply deta"
  [ ] node 24 — script code changed (35 → 47 lines) — Set case origin and template key
  [ ] node 24 — continuation_node_id: 25 → 22 — Set case origin and template key
  [ ] node 26 — node_name: "Maps intent -> Topic/Sub Topic, sets HtmlBody, has_multiple_inte" → "Writes screen 23's answers into the draft, then builds the dashb"
  [ ] node 26 — script code changed (279 → 297 lines) — Build case review dashboard
  [ ] node 32 — content changed (42 → 49 characters) — Choose the Topic and Sub Topic
  [ ] node 33 — score_var: (empty) → ai_suggested_email
  [ ] node 44 — form field settings changed (same field names)
  [ ] node 45 — script code changed (130 → 146 lines) — Load example email
  [ ] node 47 — script code changed (101 → 103 lines) — Seed mocked Salesforce data
  [ ] node 47 — continuation_node_id: 3 → 58 — Seed mocked Salesforce data
  [ ] node 48 — content changed (595 → 694 lines) — claude.md
  [ ] tree setting —  predefined_vars: {"0": {"checkbox_score": 1, "config": null, "custom_regex": "", "hidden_value": "", "id": 810336, "inline": 0, "label": "", "label_type": "", "name": "ai_account_eligibility", "options": "", "project_id": 417189428, "project_node_id": 0, "rank": 0, "required": false, "score_var": "", "scores": "", "type": "predefined"}, "1": {"checkbox_score": 1, "config": null, "custom_regex": "", "hidden_value": "", "id": 810337, "inline": 0, "label": "", "label_type": "", "name": "ai_bypass_reason", "options": "", "project_id": 417189428, "project_node_id": 0, "rank": 0, "required": false, "score_var": "", "scores": "", "type": "predefined"}, "10": {"checkbox_score": 1, "config": null, "custom_regex": "", "hidden_value": "", "id": 810346, "inline": 0, "label": "", "label_type": "", "name": "email_analysis_route", "options": "", "project_id": 417189428, "project_node_id": 0, "rank": 0, "required": false, "score_var": "", "scores": "", "type": "predefined"}, "11": {"checkbox_score": 1, "config": null, "custom_regex": "", "hidden_value": "", "id": 810347, "inline": 0, "label": "", "label_type": "", "name": "sf_Topic__c", "options": "", "project_id": 417189428, "project_node_id": 0, "rank": 0, "required": false, "score_var": "", "scores": "", "type": "predefined"}, "12": {"checkbox_score": 1, "config": null, "custom_regex": "", "hidden_value": "", "id": 810348, "inline": 0, "label": "", "label_type": "", "name": "sf_Sub_Topic__c", "options": "", "project_id": 417189428, "project_node_id": 0, "rank": 0, "required": false, "score_var": "", "scores": "", "type": "predefined"}, "13": {"checkbox_score": 1, "config": null, "custom_regex": "", "hidden_value": "", "id": 810349, "inline": 0, "label": "", "label_type": "", "name": "email_intent", "options": "", "project_id": 417189428, "project_node_id": 0, "rank": 0, "required": false, "score_var": "", "scores": "", "type": "predefined"}, "14": {"checkbox_score": 1, "config": null, "custom_regex": "", "hidden_value": "", "id": 810350, "inline": 0, "label": "", "label_type": "", "name": "escalate_reason", "options": "", "project_id": 417189428, "project_node_id": 0, "rank": 0, "required": false, "score_var": "", "scores": "", "type": "predefined"}, "15": {"checkbox_score": 1, "config": null, "custom_regex": "", "hidden_value": "", "id": 810351, "inline": 0, "label": "", "label_type": "", "name": "sentiment", "options": "", "project_id": 417189428, "project_node_id": 0, "rank": 0, "required": false, "score_var": "", "scores": "", "type": "predefined"}, "16": {"checkbox_score": 1, "config": null, "custom_regex": "", "hidden_value": "", "id": 810352, "inline": 0, "label": "", "label_type": "", "name": "confidence_score", "options": "", "project_id": 417189428, "project_node_id": 0, "rank": 0, "required": false, "score_var": "", "scores": "", "type": "predefined"}, "17": {"checkbox_score": 1, "config": null, "custom_regex": "", "hidden_value": "", "id": 810353, "inline": 0, "label": "", "label_type": "", "name": "unmatched_summary", "options": "", "project_id": 417189428, "project_node_id": 0, "rank": 0, "required": false, "score_var": "", "scores": "", "type": "predefined"}, "18": {"checkbox_score": 1, "config": null, "custom_regex": "", "hidden_value": "", "id": 810354, "inline": 0, "label": "", "label_type": "", "name": "hc_requester_type", "options": "", "project_id": 417189428, "project_node_id": 0, "rank": 0, "required": false, "score_var": "", "scores": "", "type": "predefined"}, "19": {"checkbox_score": 1, "config": null, "custom_regex": "", "hidden_value": "", "id": 810355, "inline": 0, "label": "", "label_type": "", "name": "hc_response_variant", "options": "", "project_id": 417189428, "project_node_id": 0, "rank": 0, "required": false, "score_var": "", "scores": "", "type": "predefined"}, "2": {"checkbox_score": 1, "config": null, "custom_regex": "", "hidden_value": "", "id": 810338, "inline": 0, "label": "", "label_type": "", "name": "queue_source_value", "options": "", "project_id": 417189428, "project_node_id": 0, "rank": 0, "required": false, "score_var": "", "scores": "", "type": "predefined"}, "20": {"checkbox_score": 1, "config": null, "custom_regex": "", "hidden_value": "", "id": 810356, "inline": 0, "label": "", "label_type": "", "name": "hc_template_key", "options": "", "project_id": 417189428, "project_node_id": 0, "rank": 0, "required": false, "score_var": "", "scores": "", "type": "predefined"}, "21": {"checkbox_score": 1, "config": null, "custom_regex": "", "hidden_value": "", "id": 810357, "inline": 0, "label": "", "label_type": "", "name": "hc_agent_required", "options": "", "project_id": 417189428, "project_node_id": 0, "rank": 0, "required": false, "score_var": "", "scores": "", "type": "predefined"}, "22": {"checkbox_score": 1, "config": null, "custom_regex": "", "hidden_value": "", "id": 810358, "inline": 0, "label": "", "label_type": "", "name": "sf_Energy_Provider__c", "options": "", "project_id": 417189428, "project_node_id": 0, "rank": 0, "required": false, "score_var": "", "scores": "", "type": "predefined"}, "23": {"checkbox_score": 1, "config": null, "custom_regex": "", "hidden_value": "", "id": 810359, "inline": 0, "label": "", "label_type": "", "name": "sf_Data_Provider__c", "options": "", "project_id": 417189428, "project_node_id": 0, "rank": 0, "required": false, "score_var": "", "scores": "", "type": "predefined"}, "24": {"checkbox_score": 1, "config": null, "custom_regex": "", "hidden_value": "", "id": 810360, "inline": 0, "label": "", "label_type": "", "name": "sf_Origin", "options": "", "project_id": 417189428, "project_node_id": 0, "rank": 0, "required": false, "score_var": "", "scores": "", "type": "predefined"}, "3": {"checkbox_score": 1, "config": null, "custom_regex": "", "hidden_value": "", "id": 810339, "inline": 0, "label": "", "label_type": "", "name": "queue_route", "options": "", "project_id": 417189428, "project_node_id": 0, "rank": 0, "required": false, "score_var": "", "scores": "", "type": "predefined"}, "4": {"checkbox_score": 1, "config": null, "custom_regex": "", "hidden_value": "", "id": 810340, "inline": 0, "label": "", "label_type": "", "name": "queue_route_label", "options": "", "project_id": 417189428, "project_node_id": 0, "rank": 0, "required": false, "score_var": "", "scores": "", "type": "predefined"}, "5": {"checkbox_score": 1, "config": null, "custom_regex": "", "hidden_value": "", "id": 810341, "inline": 0, "label": "", "label_type": "", "name": "sf_Id", "options": "", "project_id": 417189428, "project_node_id": 0, "rank": 0, "required": false, "score_var": "", "scores": "", "type": "predefined"}, "6": {"checkbox_score": 1, "config": null, "custom_regex": "", "hidden_value": "", "id": 810342, "inline": 0, "label": "", "label_type": "", "name": "sf_Subject", "options": "", "project_id": 417189428, "project_node_id": 0, "rank": 0, "required": false, "score_var": "", "scores": "", "type": "predefined"}, "7": {"checkbox_score": 1, "config": null, "custom_regex": "", "hidden_value": "", "id": 810343, "inline": 0, "label": "", "label_type": "", "name": "sf_CaseNumber", "options": "", "project_id": 417189428, "project_node_id": 0, "rank": 0, "required": false, "score_var": "", "scores": "", "type": "predefined"}, "8": {"checkbox_score": 1, "config": null, "custom_regex": "", "hidden_value": "", "id": 810344, "inline": 0, "label": "", "label_type": "", "name": "sf_ContactId", "options": "", "project_id": 417189428, "project_node_id": 0, "rank": 0, "required": false, "score_var": "", "scores": "", "type": "predefined"}, "9": {"checkbox_score": 1, "config": null, "custom_regex": "", "hidden_value": "", "id": 810345, "inline": 0, "label": "", "label_type": "", "name": "intent_in_scope", "options": "", "project_id": 417189428, "project_node_id": 0, "rank": 0, "required": false, "score_var": "", "scores": "", "type": "predefined"}} → {"0": {"checkbox_score": 1, "config": null, "custom_regex": "", "hidden_value": "", "id": 818258, "inline": 0, "label": "", "label_type": "", "name": "ai_account_eligibility", "options": "", "project_id": 417189428, "project_node_id": 0, "rank": 0, "required": false, "score_var": "", "scores": "", "type": "predefined"}, "1": {"checkbox_score": 1, "config": null, "custom_regex": "", "hidden_value": "", "id": 818259, "inline": 0, "label": "", "label_type": "", "name": "ai_bypass_reason", "options": "", "project_id": 417189428, "project_node_id": 0, "rank": 0, "required": false, "score_var": "", "scores": "", "type": "predefined"}, "10": {"checkbox_score": 1, "config": null, "custom_regex": "", "hidden_value": "", "id": 818268, "inline": 0, "label": "", "label_type": "", "name": "email_analysis_route", "options": "", "project_id": 417189428, "project_node_id": 0, "rank": 0, "required": false, "score_var": "", "scores": "", "type": "predefined"}, "11": {"checkbox_score": 1, "config": null, "custom_regex": "", "hidden_value": "", "id": 818269, "inline": 0, "label": "", "label_type": "", "name": "sf_Topic__c", "options": "", "project_id": 417189428, "project_node_id": 0, "rank": 0, "required": false, "score_var": "", "scores": "", "type": "predefined"}, "12": {"checkbox_score": 1, "config": null, "custom_regex": "", "hidden_value": "", "id": 818270, "inline": 0, "label": "", "label_type": "", "name": "sf_Sub_Topic__c", "options": "", "project_id": 417189428, "project_node_id": 0, "rank": 0, "required": false, "score_var": "", "scores": "", "type": "predefined"}, "13": {"checkbox_score": 1, "config": null, "custom_regex": "", "hidden_value": "", "id": 818271, "inline": 0, "label": "", "label_type": "", "name": "email_intent", "options": "", "project_id": 417189428, "project_node_id": 0, "rank": 0, "required": false, "score_var": "", "scores": "", "type": "predefined"}, "14": {"checkbox_score": 1, "config": null, "custom_regex": "", "hidden_value": "", "id": 818272, "inline": 0, "label": "", "label_type": "", "name": "escalate_reason", "options": "", "project_id": 417189428, "project_node_id": 0, "rank": 0, "required": false, "score_var": "", "scores": "", "type": "predefined"}, "15": {"checkbox_score": 1, "config": null, "custom_regex": "", "hidden_value": "", "id": 818273, "inline": 0, "label": "", "label_type": "", "name": "sentiment", "options": "", "project_id": 417189428, "project_node_id": 0, "rank": 0, "required": false, "score_var": "", "scores": "", "type": "predefined"}, "16": {"checkbox_score": 1, "config": null, "custom_regex": "", "hidden_value": "", "id": 818274, "inline": 0, "label": "", "label_type": "", "name": "confidence_score", "options": "", "project_id": 417189428, "project_node_id": 0, "rank": 0, "required": false, "score_var": "", "scores": "", "type": "predefined"}, "17": {"checkbox_score": 1, "config": null, "custom_regex": "", "hidden_value": "", "id": 818275, "inline": 0, "label": "", "label_type": "", "name": "unmatched_summary", "options": "", "project_id": 417189428, "project_node_id": 0, "rank": 0, "required": false, "score_var": "", "scores": "", "type": "predefined"}, "18": {"checkbox_score": 1, "config": null, "custom_regex": "", "hidden_value": "", "id": 818276, "inline": 0, "label": "", "label_type": "", "name": "hc_requester_type", "options": "", "project_id": 417189428, "project_node_id": 0, "rank": 0, "required": false, "score_var": "", "scores": "", "type": "predefined"}, "19": {"checkbox_score": 1, "config": null, "custom_regex": "", "hidden_value": "", "id": 818277, "inline": 0, "label": "", "label_type": "", "name": "hc_response_variant", "options": "", "project_id": 417189428, "project_node_id": 0, "rank": 0, "required": false, "score_var": "", "scores": "", "type": "predefined"}, "2": {"checkbox_score": 1, "config": null, "custom_regex": "", "hidden_value": "", "id": 818260, "inline": 0, "label": "", "label_type": "", "name": "last_owner_queue_name", "options": "", "project_id": 417189428, "project_node_id": 0, "rank": 0, "required": false, "score_var": "", "scores": "", "type": "predefined"}, "20": {"checkbox_score": 1, "config": null, "custom_regex": "", "hidden_value": "", "id": 818278, "inline": 0, "label": "", "label_type": "", "name": "hc_template_key", "options": "", "project_id": 417189428, "project_node_id": 0, "rank": 0, "required": false, "score_var": "", "scores": "", "type": "predefined"}, "21": {"checkbox_score": 1, "config": null, "custom_regex": "", "hidden_value": "", "id": 818279, "inline": 0, "label": "", "label_type": "", "name": "hc_agent_required", "options": "", "project_id": 417189428, "project_node_id": 0, "rank": 0, "required": false, "score_var": "", "scores": "", "type": "predefined"}, "22": {"checkbox_score": 1, "config": null, "custom_regex": "", "hidden_value": "", "id": 818280, "inline": 0, "label": "", "label_type": "", "name": "sf_Energy_Provider__c", "options": "", "project_id": 417189428, "project_node_id": 0, "rank": 0, "required": false, "score_var": "", "scores": "", "type": "predefined"}, "23": {"checkbox_score": 1, "config": null, "custom_regex": "", "hidden_value": "", "id": 818281, "inline": 0, "label": "", "label_type": "", "name": "sf_Data_Provider__c", "options": "", "project_id": 417189428, "project_node_id": 0, "rank": 0, "required": false, "score_var": "", "scores": "", "type": "predefined"}, "24": {"checkbox_score": 1, "config": null, "custom_regex": "", "hidden_value": "", "id": 818282, "inline": 0, "label": "", "label_type": "", "name": "sf_Origin", "options": "", "project_id": 417189428, "project_node_id": 0, "rank": 0, "required": false, "score_var": "", "scores": "", "type": "predefined"}, "3": {"checkbox_score": 1, "config": null, "custom_regex": "", "hidden_value": "", "id": 818261, "inline": 0, "label": "", "label_type": "", "name": "queue_route", "options": "", "project_id": 417189428, "project_node_id": 0, "rank": 0, "required": false, "score_var": "", "scores": "", "type": "predefined"}, "4": {"checkbox_score": 1, "config": null, "custom_regex": "", "hidden_value": "", "id": 818262, "inline": 0, "label": "", "label_type": "", "name": "queue_route_label", "options": "", "project_id": 417189428, "project_node_id": 0, "rank": 0, "required": false, "score_var": "", "scores": "", "type": "predefined"}, "5": {"checkbox_score": 1, "config": null, "custom_regex": "", "hidden_value": "", "id": 818263, "inline": 0, "label": "", "label_type": "", "name": "sf_Id", "options": "", "project_id": 417189428, "project_node_id": 0, "rank": 0, "required": false, "score_var": "", "scores": "", "type": "predefined"}, "6": {"checkbox_score": 1, "config": null, "custom_regex": "", "hidden_value": "", "id": 818264, "inline": 0, "label": "", "label_type": "", "name": "sf_Subject", "options": "", "project_id": 417189428, "project_node_id": 0, "rank": 0, "required": false, "score_var": "", "scores": "", "type": "predefined"}, "7": {"checkbox_score": 1, "config": null, "custom_regex": "", "hidden_value": "", "id": 818265, "inline": 0, "label": "", "label_type": "", "name": "sf_CaseNumber", "options": "", "project_id": 417189428, "project_node_id": 0, "rank": 0, "required": false, "score_var": "", "scores": "", "type": "predefined"}, "8": {"checkbox_score": 1, "config": null, "custom_regex": "", "hidden_value": "", "id": 818266, "inline": 0, "label": "", "label_type": "", "name": "sf_ContactId", "options": "", "project_id": 417189428, "project_node_id": 0, "rank": 0, "required": false, "score_var": "", "scores": "", "type": "predefined"}, "9": {"checkbox_score": 1, "config": null, "custom_regex": "", "hidden_value": "", "id": 818267, "inline": 0, "label": "", "label_type": "", "name": "intent_in_scope", "options": "", "project_id": 417189428, "project_node_id": 0, "rank": 0, "required": false, "score_var": "", "scores": "", "type": "predefined"}}
  [ ] tree setting —  script_code: <style>
@import url('https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,400;0,500;1,400;1,500&display=swap');

:root {
  --font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif;
}
</style>

<style>
/* =========================================================
REQUIRED REQUEST DETAILS
========================================================= */

.zt-required {
margin-left: 3px;
color: #b91c1c;
}

/* Invalid Topic / Subtopic */
.zt-form-control.zt-required-invalid {
border-color: #b91c1c;
box-shadow: 0 0 0 3px rgba(185, 28, 28, 0.12);
}

/* Validation message */
.zt-request-validation-error {
display: none;
grid-column: 1 / -1;
margin-top: -4px;
padding: 10px 12px;
color: #991b1b;
font-size: 13px;
font-weight: 500;
background: #fef2f2;
border: 1px solid #fecaca;
border-radius: 8px;
}

.zt-request-validation-error.is-visible {
display: block;
}
</style>

<style>
.email-summary-card-shell {
  max-width: 900px;
  margin: 20px auto;
  padding: 24px;
  background: #ffffff;
  border: 1px solid #d9e2ec;
  border-radius: 14px;
  box-shadow: 0 8px 24px rgba(15, 23, 42, 0.06);
}

.email-summary-header {
  display: flex;
  align-items: flex-start;
  gap: 16px;
  margin-bottom: 20px;
}

.email-summary-icon {
  width: 42px;
  height: 42px;
  border-radius: 999px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #dcfce7;
  color: #166534;
  font-size: 22px;
  font-weight: 700;
  flex: 0 0 42px;
}

.email-summary-header-copy {
  min-width: 0;
}

.email-summary-title {
  margin: 0 0 6px;
  font-size: 24px;
  font-weight: 700;
  line-height: 1.2;
  color: #1f2937;
}

.email-summary-subtitle {
  margin: 0;
  font-size: 14px;
  color: #6b7280;
  line-height: 1.5;
}

.email-summary-card {
  margin-top: 18px;
  padding: 20px;
  background: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 14px;
}

.email-summary-card-title {
  margin: 0 0 16px;
  font-size: 18px;
  font-weight: 700;
  color: #0f172a;
}

.email-summary-row {
  display: grid;
  grid-template-columns: 160px 1fr;
  gap: 14px;
  align-items: start;
  padding: 10px 0;
  border-top: 1px solid #f1f5f9;
}

.email-summary-row:first-of-type {
  border-top: 0;
  padding-top: 0;
}

.email-summary-row-label {
  font-size: 13px;
  font-weight: 700;
  color: #475569;
}

.email-summary-row-value {
  font-size: 14px;
  line-height: 1.55;
  color: #0f172a;
  word-break: break-word;
}

.email-summary-html-body {
  padding: 16px;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  font-size: 14px;
  line-height: 1.6;
  color: #0f172a;
  word-break: break-word;
}

.email-summary-html-body p:first-child {
  margin-top: 0;
}

.email-summary-html-body p:last-child {
  margin-bottom: 0;
}

.email-summary-muted {
  color: #94a3b8;
}

@media (max-width: 768px) {
  .email-summary-card-shell {
    padding: 18px;
  }

  .email-summary-row {
    grid-template-columns: 1fr;
    gap: 6px;
  }
}
</style>

<style>
.zt-rich-editor {
  min-height: 220px;
  padding: 12px;
  border: 1px solid #cbd5e1;
  border-radius: 10px;
  background: #ffffff;
  font-size: 14px;
  line-height: 1.6;
  outline: none;
}

.zt-rich-editor:focus {
  border-color: #2563eb;
  box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.15);
}

.zt-rich-editor p {
  margin: 0 0 10px;
}
</style>

<script>
(function () {

  /**
   * ========================================================
   * REQUEST DETAILS VALIDATION
   *
   * Both forms (screen 33 Request Details and screen 32
   * Multiple Subtopics) carry:
   *    - sf_Topic__c
   *    - sf_Sub_Topic__c
   * ========================================================
   */

  function getRequestFields() {
    return {
      topic: document.getElementById('sf_Topic__c'),
      subtopic: document.getElementById('sf_Sub_Topic__c')
    };
  }


  /**
   * Determine whether the current node contains
   * one of our forms.
   */
  function hasRequestForm() {
    var fields = getRequestFields();

    return !!fields.subtopic;
  }


  /**
   * Validate whichever fields exist on the node.
   */
  function requestDetailsAreValid() {
    var fields = getRequestFields();

    /*
     * No relevant form on this node.
     */
    if (!fields.subtopic) {
      return true;
    }

    var subtopicValue =
      String(fields.subtopic.value || '').trim();

    /*
     * Multiple Subtopics form:
     * only Subtopic exists.
     */
    if (!fields.topic) {
      return subtopicValue !== '';
    }

    /*
     * Standard Request Details form:
     * Topic + Subtopic both exist.
     */
    var topicValue =
      String(fields.topic.value || '').trim();

    return (
      topicValue !== '' &&
      subtopicValue !== ''
    );
  }


  /**
   * Create the validation message.
   */
  function ensureValidationMessage() {
    var fields = getRequestFields();

    if (!fields.subtopic) {
      return null;
    }

    /*
     * Standard Request Details form has a grid.
     */
    var container =
      document.querySelector('.zt-form-grid');

    /*
     * Multiple Subtopics form does not use the grid,
     * so use the Subtopic field wrapper instead.
     */
    if (!container) {
      container =
        fields.subtopic.closest('.zt-form-field');
    }

    if (!container) {
      return null;
    }

    var existing =
      container.querySelector(
        '.zt-request-validation-error'
      );

    if (existing) {
      return existing;
    }

    var error =
      document.createElement('div');

    error.className =
      'zt-request-validation-error';

    error.setAttribute(
      'role',
      'alert'
    );

    error.setAttribute(
      'aria-live',
      'polite'
    );

    /*
     * Different message depending on form type.
     */
    if (fields.topic) {
      error.textContent =
        'Please select both Topic and Subtopic before continuing.';
    } else {
      error.textContent =
        'Please select a Subtopic before continuing.';
    }

    container.appendChild(error);

    return error;
  }


  /**
   * Show validation errors.
   */
  function showValidationErrors() {
    var fields = getRequestFields();

    if (!fields.subtopic) {
      return;
    }

    var error =
      ensureValidationMessage();

    var subtopicMissing =
      String(
        fields.subtopic.value || ''
      ).trim() === '';

    /*
     * Topic only needs validation if it exists.
     */
    var topicMissing = false;

    if (fields.topic) {
      topicMissing =
        String(
          fields.topic.value || ''
        ).trim() === '';
    }


    if (fields.topic) {
      fields.topic.classList.toggle(
        'zt-required-invalid',
        topicMissing
      );

      fields.topic.setAttribute(
        'aria-invalid',
        topicMissing
          ? 'true'
          : 'false'
      );
    }


    fields.subtopic.classList.toggle(
      'zt-required-invalid',
      subtopicMissing
    );

    fields.subtopic.setAttribute(
      'aria-invalid',
      subtopicMissing
        ? 'true'
        : 'false'
    );


    if (error) {
      error.classList.toggle(
        'is-visible',
        topicMissing || subtopicMissing
      );
    }


    /*
     * Focus first missing field.
     */
    if (
      fields.topic &&
      topicMissing
    ) {
      fields.topic.focus();
    } else if (subtopicMissing) {
      fields.subtopic.focus();
    }
  }


  /**
   * Refresh validation after the user changes
   * one of the dropdowns.
   */
  function refreshValidationState() {
    var fields = getRequestFields();

    if (!fields.subtopic) {
      return;
    }

    var subtopicMissing =
      String(
        fields.subtopic.value || ''
      ).trim() === '';

    var topicMissing = false;

    if (fields.topic) {
      topicMissing =
        String(
          fields.topic.value || ''
        ).trim() === '';

      fields.topic.classList.toggle(
        'zt-required-invalid',
        topicMissing
      );
    }


    fields.subtopic.classList.toggle(
      'zt-required-invalid',
      subtopicMissing
    );


    var error =
      document.querySelector(
        '.zt-request-validation-error'
      );

    if (error) {
      error.classList.toggle(
        'is-visible',
        topicMissing || subtopicMissing
      );
    }
  }


  /**
   * Bind fields after node render.
   */
  whenEvent(
    'render:finish',
    function () {

      var fields =
        getRequestFields();

      /*
       * Neither supported form is present.
       */
      if (!fields.subtopic) {
        return;
      }


      ensureValidationMessage();


      /**
       * Bind Topic if this is the standard form.
       */
      if (
        fields.topic &&
        !fields.topic.dataset
          .requiredValidationBound
      ) {

        fields.topic.addEventListener(
          'change',
          function () {

            assignSessionVar(
              'sf_Topic__c',
              fields.topic.value
            );

            refreshValidationState();
          }
        );

        fields.topic.dataset
          .requiredValidationBound =
          'true';
      }


      /**
       * Bind Subtopic for both form types.
       */
      if (
        !fields.subtopic.dataset
          .requiredValidationBound
      ) {

        fields.subtopic.addEventListener(
          'change',
          function () {

            assignSessionVar(
              'sf_Sub_Topic__c',
              fields.subtopic.value
            );

            refreshValidationState();
          }
        );

        fields.subtopic.dataset
          .requiredValidationBound =
          'true';
      }


      /*
       * Don't show errors immediately when the
       * node first loads.
       */
      if (fields.topic) {
        fields.topic.classList.remove(
          'zt-required-invalid'
        );
      }

      fields.subtopic.classList.remove(
        'zt-required-invalid'
      );
    }
  );


  /**
   * ========================================================
   * NAVIGATION GUARD
   * ========================================================
   */
  document.addEventListener(
    'click',
    function (event) {

      var fields =
        getRequestFields();

      /*
       * No supported form on this node.
       */
      if (!fields.subtopic) {
        return;
      }


      /*
       * Allow the user to interact with the form itself.
       */
      if (
        event.target.closest(
          '.zt-form-card'
        )
      ) {
        return;
      }


      /*
       * Only inspect clickable navigation controls.
       */
      var navigationControl =
        event.target.closest(
          'button, a, input[type="button"], input[type="submit"]'
        );

      if (!navigationControl) {
        return;
      }


      /*
       * Valid form: allow navigation.
       */
      if (requestDetailsAreValid()) {
        return;
      }


      /*
       * Invalid form: stop navigation.
       */
      event.preventDefault();
      event.stopPropagation();
      event.stopImmediatePropagation();

      showValidationErrors();

    },
    true
  );

})();
</script>

<script>
whenEvent('render:finish', () => {
  const editor = document.getElementById('htmlBodyEditor');
  const hidden = document.getElementById('HtmlBody');

  if (!editor || !hidden) return;

  hidden.value = editor.innerHTML;

  if (!editor.dataset.boundHtmlSync) {
    editor.addEventListener('input', () => {
      hidden.value = editor.innerHTML;
    });
    editor.dataset.boundHtmlSync = 'true';
  }
});
</script>

<script>
/* =========================================================
TOPIC -> SUBTOPIC FILTER (screens 32 and 33)

Every subtopic <option> carries data-topic, written by nodes
17 / 26 from the lane's own intent map. Both screens carry a
Topic and a Subtopic select: the subtopic list shows only the
options whose data-topic matches the chosen Topic, and a
subtopic that no longer fits is cleared, so the pair saved on
the Case is always one Salesforce accepts.
========================================================= */
whenEvent('render:finish', function () {
  var topic = document.getElementById('sf_Topic__c');
  var subtopic = document.getElementById('sf_Sub_Topic__c');

  if (!topic || !subtopic || subtopic.dataset.topicFilterBound) return;
  subtopic.dataset.topicFilterBound = 'true';

  // keep every option once, then rebuild the list for the chosen Topic
  var allOptions = [];
  for (var i = 0; i < subtopic.options.length; i++) {
    allOptions.push(subtopic.options[i]);
  }

  function filterSubtopics() {
    var topicValue = topic.value;
    var keepValue = subtopic.value;
    var keepStillFits = false;

    subtopic.innerHTML = '';
    for (var i = 0; i < allOptions.length; i++) {
      var option = allOptions[i];
      var optionTopic = option.getAttribute('data-topic') || '';
      // the placeholder has no topic and always stays
      if (optionTopic === '' || optionTopic === topicValue) {
        subtopic.appendChild(option);
        if (keepValue !== '' && option.value === keepValue) keepStillFits = true;
      }
    }

    subtopic.value = keepStillFits ? keepValue : '';
    if (!keepStillFits && keepValue !== '') {
      assignSessionVar('sf_Sub_Topic__c', '');
    }
  }

  filterSubtopics();
  topic.addEventListener('change', filterSubtopics);
});
</script>

<style>
.zt-form-card {
  max-width: 900px;
  margin: 20px auto;
  padding: 24px;
  background: #ffffff;
  border: 1px solid #d9e2ec;
  border-radius: 14px;
  box-shadow: 0 8px 24px rgba(15, 23, 42, 0.06);
}

.zt-form-header {
  margin-bottom: 20px;
}

.zt-form-title {
  margin: 0 0 6px;
  font-size: 24px;
  font-weight: 700;
  line-height: 1.2;
  color: #1f2937;
}

.zt-form-subtitle {
  margin: 0;
  font-size: 14px;
  color: #6b7280;
}

.zt-form-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(240px, 1fr));
  gap: 18px;
  margin-bottom: 18px;
}

.zt-form-field {
  display: flex;
  flex-direction: column;
}

.zt-form-field-full {
  margin-top: 4px;
}

.zt-form-label {
  margin-bottom: 8px;
  font-size: 14px;
  font-weight: 600;
  color: #374151;
}

.zt-form-control {
  width: 100%;
  min-height: 44px;
  padding: 10px 12px;
  font-size: 14px;
  line-height: 1.4;
  color: #111827;
  background: #fff;
  border: 1px solid #cbd5e1;
  border-radius: 10px;
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
  box-sizing: border-box;
}

.zt-form-control:focus {
  outline: none;
  border-color: #2563eb;
  box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.15);
}

.zt-form-textarea {
  min-height: 220px;
  resize: vertical;
  font-family: Consolas, Monaco, monospace;
}

.zt-form-help {
  margin-top: 8px;
  font-size: 12px;
  color: #6b7280;
}

@media (max-width: 768px) {
  .zt-form-grid {
    grid-template-columns: 1fr;
  }

  .zt-form-card {
    padding: 18px;
  }
}
</style>

<style>
/* =========================================================
CASE REVIEW DASHBOARD
Matches the supplied reference layout.
========================================================= */

.case-review-shell {
width: 100%;
margin: 0;
padding: 0;
box-sizing: border-box;
font-family:
-apple-system,
BlinkMacSystemFont,
"Segoe UI",
Roboto,
Arial,
sans-serif;
color: #172033;
}

.case-review-shell *,
.case-review-shell *::before,
.case-review-shell *::after {
box-sizing: border-box;
}


/* =========================================================
OUTER PANEL
========================================================= */

.case-review-panel {
width: 100%;
margin: 0;
overflow: hidden;
background: #f8fafc;
border: 1px solid #e5eaf1;
border-radius: 28px;
}


/* =========================================================
HEADER
========================================================= */

.case-review-hero {
min-height: 210px;
padding: 27px 28px 29px;
color: #ffffff;

background:
linear-gradient(
100deg,
#091735 0%,
#102345 56%,
#203957 100%
);
}

.case-review-hero-top {
display: flex;
align-items: flex-start;
justify-content: space-between;
gap: 36px;
}

.case-review-hero-copy {
flex: 1 1 auto;
min-width: 0;
padding-top: 2px;
}

.case-review-eyebrow {
margin: 0 0 10px;

font-size: 12px;
line-height: 1.2;
font-weight: 700;
letter-spacing: 0.15em;
text-transform: uppercase;

color: rgba(255, 255, 255, 0.63);
}

.case-review-main-title {
margin: 0 0 9px;

font-size: 24px;
line-height: 1.22;
font-weight: 700;

color: #ffffff;
}

.case-review-subtitle {
font-size: 16px;
line-height: 1.5;
font-weight: 400;

color: rgba(255, 255, 255, 0.86);
}

.case-review-subtitle strong {
font-weight: 700;
color: #ffffff;
}

.case-review-subtitle-separator {
display: inline-block;
margin: 0 4px;
}


/* =========================================================
CONFIDENCE CARD
========================================================= */

.case-review-hero-metrics-card {
flex: 0 0 32%;
max-width: 355px;
min-width: 285px;

padding: 17px 18px;

background: rgba(255, 255, 255, 0.13);
border: 1px solid rgba(255, 255, 255, 0.13);
border-radius: 20px;

box-shadow:
inset 0 1px 0
rgba(255, 255, 255, 0.04);
}

.case-review-hero-metric + .case-review-hero-metric {
margin-top: 13px;
padding-top: 13px;

border-top:
1px solid
rgba(255, 255, 255, 0.14);
}

.case-review-hero-metric-label {
margin-bottom: 5px;

font-size: 11px;
line-height: 1.3;
font-weight: 700;
letter-spacing: 0.13em;
text-transform: uppercase;

color: rgba(255, 255, 255, 0.62);
}

.case-review-hero-metric-value {
font-size: 24px;
line-height: 1.2;
font-weight: 700;
color: #ffffff;
}

.case-review-hero-metric-text {
font-size: 14px;
line-height: 1.5;
color: rgba(255, 255, 255, 0.9);

overflow-wrap: anywhere;
}


/* =========================================================
BODY
========================================================= */

.case-review-body {
padding: 24px;
background: #f8fafc;
}


/*
* Reference screenshot uses:
*
* left ~44%
* right ~56%
*/
.case-review-grid {
display: grid;

grid-template-columns:
minmax(0, 44fr)
minmax(0, 56fr);

gap: 22px;

align-items: start;
}

.case-review-col {
min-width: 0;
}

.case-review-col .case-review-card +
.case-review-card {
margin-top: 22px;
}


/* =========================================================
STANDARD CARD
========================================================= */

.case-review-card {
width: 100%;

padding: 19px 20px 20px;

background: #ffffff;
border: 1px solid #dde5ed;
border-radius: 24px;

box-shadow:
0 1px 3px
rgba(15, 23, 42, 0.035);
}

.case-review-card-title {
margin: 0 0 17px;

font-size: 16px;
line-height: 1.35;
font-weight: 700;

color: #25334a;
}


/* =========================================================
CASE DETAIL ROWS
========================================================= */

.case-review-row {
display: grid;

grid-template-columns:
minmax(120px, 42%)
minmax(0, 58%);

gap: 18px;

align-items: center;

min-height: 51px;
padding: 12px 0;

border-top: 1px solid #e8ecf0;
}

.case-review-row:first-of-type {
padding-top: 3px;
border-top: 0;
}

.case-review-row:last-child {
padding-bottom: 2px;
}

.case-review-row-label {
font-size: 12px;
line-height: 1.4;
font-weight: 700;

text-transform: uppercase;
letter-spacing: 0.09em;

color: #58677b;
}

.case-review-row-value {
min-width: 0;

font-size: 15px;
line-height: 1.45;
font-weight: 400;

text-align: right;

color: #263248;

overflow-wrap: anywhere;
}


/* =========================================================
EMAIL CONTENT
========================================================= */

.case-review-html-card-body {
font-size: 15px;
line-height: 1.62;
font-weight: 400;

color: #283344;

overflow-wrap: anywhere;
}

.case-review-html-card-body p {
margin-top: 0;
margin-bottom: 15px;
}

.case-review-html-card-body p:last-child {
margin-bottom: 0;
}

.case-review-html-card-body a {
font-weight: 600;
color: #233f73;
text-decoration: none;
}

.case-review-html-card-body a:hover {
text-decoration: underline;
}

.case-review-muted {
color: #94a3b8;
font-style: italic;
}


/*
* Give the response card enough visual presence
* to match the taller card shown in the reference.
*/
.case-review-response-card {
min-height: 500px;
}


/* =========================================================
POLICY FLAGS
========================================================= */

.case-review-flag-card {
padding: 14px 15px 12px;

border: 1px solid;
border-radius: 18px;
}

.case-review-flag-top {
display: flex;
align-items: center;
justify-content: space-between;

gap: 12px;
}

.case-review-flag-title {
font-size: 12px;
line-height: 1.4;
font-weight: 600;

color: #627085;
}

.case-review-flag-pill {
display: inline-flex;
align-items: center;
justify-content: center;

min-width: 24px;
min-height: 24px;

padding: 2px 8px;

border-radius: 999px;

font-size: 12px;
line-height: 1;
font-weight: 700;

color: #ffffff;
}

.case-review-flag-value {
margin-top: 8px;

font-size: 17px;
line-height: 1.2;
font-weight: 700;
}


/* =========================================================
INTENT CARDS
========================================================= */

.case-review-intent-grid {
display: grid;

grid-template-columns:
repeat(2, minmax(0, 1fr));

gap: 15px;

margin-top: 3px;
}

.case-review-intent-simple-card {
min-height: 102px;

padding: 17px 18px;

display: flex;
flex-direction: column;
justify-content: flex-start;

border: 1px solid;
border-radius: 20px;
}

.case-review-intent-simple-title {
font-size: 11px;
line-height: 1.4;
font-weight: 500;

color: #718096;

overflow-wrap: break-word;
}

.case-review-intent-simple-value {
margin-top: 9px;

font-size: 16px;
line-height: 1.2;
font-weight: 700;
}


/* =========================================================
FEEDBACK WIDGET ALIGNMENT
========================================================= */

.case-review-response-card .ai-feedback-wrap {
margin-top: 18px;
}

.case-review-response-card .ai-feedback-label {
margin: 0 0 9px;

font-size: 16px;
line-height: 1.35;
font-weight: 700;

color: #283344;
}

.case-review-response-card .ai-feedback-buttons {
gap: 10px;
}

.case-review-response-card .ai-feedback-btn {
width: 56px;
min-width: 56px;
height: 48px;
min-height: 48px;

padding: 0;

display: inline-flex;
align-items: center;
justify-content: center;

background: #ffffff;
border: 1px solid #d7dde5;
border-radius: 8px;

font-size: 21px;

box-shadow:
0 1px 2px
rgba(15, 23, 42, 0.04);
}


/* =========================================================
RESPONSIVE
========================================================= */

@media (max-width: 1000px) {

.case-review-grid {
grid-template-columns:
minmax(0, 42fr)
minmax(0, 58fr);

gap: 18px;
}

.case-review-intent-grid {
gap: 12px;
}

.case-review-intent-simple-card {
padding: 15px;
}
}


@media (max-width: 820px) {

.case-review-hero {
min-height: 0;
}

.case-review-hero-top {
flex-direction: column;
}

.case-review-hero-metrics-card {
width: 100%;
max-width: none;
min-width: 0;
flex-basis: auto;
}

.case-review-grid {
grid-template-columns: 1fr;
}

.case-review-response-card {
min-height: 0;
}
}


@media (max-width: 520px) {

.case-review-panel {
border-radius: 20px;
}

.case-review-hero {
padding: 23px 20px;
}

.case-review-body {
padding: 15px;
}

.case-review-card {
padding: 17px;
border-radius: 20px;
}

.case-review-main-title {
font-size: 22px;
}

.case-review-row {
grid-template-columns: 1fr;
gap: 4px;
}

.case-review-row-value {
text-align: left;
}

.case-review-intent-grid {
grid-template-columns: 1fr;
}

.case-review-intent-simple-card {
min-height: 86px;
}
}
</style>
<style>
.ai-feedback-wrap {
  margin-top: 12px;
}

.ai-feedback-label {
  margin-bottom: 8px;
  font-weight: 600;
}

.ai-feedback-buttons {
  display: flex;
  gap: 10px;
}

.ai-feedback-btn {
  min-width: 52px;
  min-height: 44px;
  padding: 8px 12px;
  border: 1px solid #cfcfcf;
  border-radius: 8px;
  background: #fff;
  cursor: pointer;
  font-size: 22px;
  line-height: 1;
}

.ai-feedback-btn:hover {
  border-color: #999;
}

.ai-feedback-btn.selected {
  border-color: #222;
  box-shadow: inset 0 0 0 2px #222;
}

.ai-feedback-status {
  min-height: 18px;
  margin-top: 8px;
  font-size: 13px;
  color: #374151;
}


/* Thumbs-down comments section */









</style>

<script>
(function () {
  /**
   * AI FEEDBACK (screens 30 and 53)
   *
   * The thumbs buttons are the ONLY writer of ai_feedback. They write it into a
   * native hidden-from-view text field of the same name, because native fields
   * always submit with the button the agent clicks and so always reach form data.
   * ai_feedback_comments is a native textarea on the same screen, shown and
   * focused only on thumbs_down. thumbs_up hides it and clears any text in it,
   * so a comment typed before switching to thumbs up never submits.
   */
  function nativeField(name) {
    return document.querySelector(
      'input[name="' + name + '"], textarea[name="' + name + '"]'
    );
  }

  // The wrapper that holds a native field and its label: walk up while the
  // parent holds only this one control, so nothing else on the screen moves.
  function nativeWrapper(name) {
    var field = nativeField(name);
    if (!field) return null;
    var wrapper = field;
    while (
      wrapper.parentElement &&
      wrapper.parentElement.querySelectorAll('input, select, textarea').length === 1
    ) {
      wrapper = wrapper.parentElement;
    }
    return wrapper;
  }

  function setNativeFieldVisible(name, visible) {
    var wrapper = nativeWrapper(name);
    if (wrapper) wrapper.style.display = visible ? '' : 'none';
  }

  function recordFeedback(value) {
    var field = nativeField('ai_feedback');
    if (field) {
      field.value = value;
      field.dispatchEvent(new Event('change', { bubbles: true }));
    }
    assignSessionVar('ai_feedback', value);
  }

  var statusText = {
    thumbs_up: '&#128077; Thanks for the feedback!',
    thumbs_down: '&#128078; Thanks - please say what was wrong in the AI feedback comments box below.'
  };

  function showComments() {
    setNativeFieldVisible('ai_feedback_comments', true);
    var comments = nativeField('ai_feedback_comments');
    if (comments) {
      comments.scrollIntoView({ behavior: 'smooth', block: 'center' });
      comments.focus();
    }
  }

  function hideComments() {
    var comments = nativeField('ai_feedback_comments');
    if (comments && comments.value !== '') {
      comments.value = '';
      comments.dispatchEvent(new Event('change', { bubbles: true }));
    }
    assignSessionVar('ai_feedback_comments', '');
    setNativeFieldVisible('ai_feedback_comments', false);
  }

  whenEvent('render:finish', function () {
    var widgets = document.querySelectorAll('.ai-feedback-wrap');
    if (!widgets.length) return;

    setNativeFieldVisible('ai_feedback', false);
    var ratedDown = nativeField('ai_feedback') && nativeField('ai_feedback').value === 'thumbs_down';
    setNativeFieldVisible('ai_feedback_comments', ratedDown);

    for (var i = 0; i < widgets.length; i++) {
      var widget = widgets[i];
      if (widget.dataset.aiFeedbackBound) continue;
      widget.dataset.aiFeedbackBound = 'true';

      var current = nativeField('ai_feedback');
      if (current && current.value) {
        var preselected = widget.querySelector('.ai-feedback-btn[data-feedback="' + current.value + '"]');
        if (preselected) preselected.classList.add('selected');
      }

      widget.addEventListener('click', function (event) {
        var btn = event.target.closest('.ai-feedback-btn');
        if (!btn) return;
        var value = btn.getAttribute('data-feedback');
        var buttons = this.querySelectorAll('.ai-feedback-btn');
        for (var j = 0; j < buttons.length; j++) buttons[j].classList.remove('selected');
        btn.classList.add('selected');
        recordFeedback(value);

        var status = this.querySelector('.ai-feedback-status');
        if (status) status.innerHTML = statusText[value] || '';

        if (value === 'thumbs_down') {
          showComments();
        } else {
          hideComments();
        }
      });
    }
  });
})();
</script> → <style>
@import url('https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,400;0,500;1,400;1,500&display=swap');

:root {
  --font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif;
}
</style>

<style>
/* =========================================================
REQUIRED REQUEST DETAILS
========================================================= */

.zt-required {
margin-left: 3px;
color: #b91c1c;
}

/* Invalid Topic / Subtopic */
.zt-form-control.zt-required-invalid {
border-color: #b91c1c;
box-shadow: 0 0 0 3px rgba(185, 28, 28, 0.12);
}

/* Validation message */
.zt-request-validation-error {
display: none;
grid-column: 1 / -1;
margin-top: -4px;
padding: 10px 12px;
color: #991b1b;
font-size: 13px;
font-weight: 500;
background: #fef2f2;
border: 1px solid #fecaca;
border-radius: 8px;
}

.zt-request-validation-error.is-visible {
display: block;
}
</style>

<style>
.email-summary-card-shell {
  max-width: 900px;
  margin: 20px auto;
  padding: 24px;
  background: #ffffff;
  border: 1px solid #d9e2ec;
  border-radius: 14px;
  box-shadow: 0 8px 24px rgba(15, 23, 42, 0.06);
}

.email-summary-header {
  display: flex;
  align-items: flex-start;
  gap: 16px;
  margin-bottom: 20px;
}

.email-summary-icon {
  width: 42px;
  height: 42px;
  border-radius: 999px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #dcfce7;
  color: #166534;
  font-size: 22px;
  font-weight: 700;
  flex: 0 0 42px;
}

.email-summary-header-copy {
  min-width: 0;
}

.email-summary-title {
  margin: 0 0 6px;
  font-size: 24px;
  font-weight: 700;
  line-height: 1.2;
  color: #1f2937;
}

.email-summary-subtitle {
  margin: 0;
  font-size: 14px;
  color: #6b7280;
  line-height: 1.5;
}

.email-summary-card {
  margin-top: 18px;
  padding: 20px;
  background: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 14px;
}

.email-summary-card-title {
  margin: 0 0 16px;
  font-size: 18px;
  font-weight: 700;
  color: #0f172a;
}

.email-summary-row {
  display: grid;
  grid-template-columns: 160px 1fr;
  gap: 14px;
  align-items: start;
  padding: 10px 0;
  border-top: 1px solid #f1f5f9;
}

.email-summary-row:first-of-type {
  border-top: 0;
  padding-top: 0;
}

.email-summary-row-label {
  font-size: 13px;
  font-weight: 700;
  color: #475569;
}

.email-summary-row-value {
  font-size: 14px;
  line-height: 1.55;
  color: #0f172a;
  word-break: break-word;
}

.email-summary-html-body {
  padding: 16px;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  font-size: 14px;
  line-height: 1.6;
  color: #0f172a;
  word-break: break-word;
}

.email-summary-html-body p:first-child {
  margin-top: 0;
}

.email-summary-html-body p:last-child {
  margin-bottom: 0;
}

.email-summary-muted {
  color: #94a3b8;
}

@media (max-width: 768px) {
  .email-summary-card-shell {
    padding: 18px;
  }

  .email-summary-row {
    grid-template-columns: 1fr;
    gap: 6px;
  }
}
</style>

<style>
.zt-rich-editor {
  min-height: 220px;
  padding: 12px;
  border: 1px solid #cbd5e1;
  border-radius: 10px;
  background: #ffffff;
  font-size: 14px;
  line-height: 1.6;
  outline: none;
}

.zt-rich-editor:focus {
  border-color: #2563eb;
  box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.15);
}

.zt-rich-editor p {
  margin: 0 0 10px;
}
</style>

<script>
(function () {

  /**
   * ========================================================
   * REQUEST DETAILS VALIDATION
   *
   * Both forms (screen 33 Request Details and screen 32
   * Multiple Subtopics) carry:
   *    - sf_Topic__c
   *    - sf_Sub_Topic__c
   * ========================================================
   */

  function getRequestFields() {
    return {
      topic: document.getElementById('sf_Topic__c'),
      subtopic: document.getElementById('sf_Sub_Topic__c')
    };
  }


  /**
   * Determine whether the current node contains
   * one of our forms.
   */
  function hasRequestForm() {
    var fields = getRequestFields();

    return !!fields.subtopic;
  }


  /**
   * Validate whichever fields exist on the node.
   */
  function requestDetailsAreValid() {
    var fields = getRequestFields();

    /*
     * No relevant form on this node.
     */
    if (!fields.subtopic) {
      return true;
    }

    var subtopicValue =
      String(fields.subtopic.value || '').trim();

    /*
     * Multiple Subtopics form:
     * only Subtopic exists.
     */
    if (!fields.topic) {
      return subtopicValue !== '';
    }

    /*
     * Standard Request Details form:
     * Topic + Subtopic both exist.
     */
    var topicValue =
      String(fields.topic.value || '').trim();

    return (
      topicValue !== '' &&
      subtopicValue !== ''
    );
  }


  /**
   * Create the validation message.
   */
  function ensureValidationMessage() {
    var fields = getRequestFields();

    if (!fields.subtopic) {
      return null;
    }

    /*
     * Standard Request Details form has a grid.
     */
    var container =
      document.querySelector('.zt-form-grid');

    /*
     * Multiple Subtopics form does not use the grid,
     * so use the Subtopic field wrapper instead.
     */
    if (!container) {
      container =
        fields.subtopic.closest('.zt-form-field');
    }

    if (!container) {
      return null;
    }

    var existing =
      container.querySelector(
        '.zt-request-validation-error'
      );

    if (existing) {
      return existing;
    }

    var error =
      document.createElement('div');

    error.className =
      'zt-request-validation-error';

    error.setAttribute(
      'role',
      'alert'
    );

    error.setAttribute(
      'aria-live',
      'polite'
    );

    /*
     * Different message depending on form type.
     */
    if (fields.topic) {
      error.textContent =
        'Please select both Topic and Subtopic before continuing.';
    } else {
      error.textContent =
        'Please select a Subtopic before continuing.';
    }

    container.appendChild(error);

    return error;
  }


  /**
   * Show validation errors.
   */
  function showValidationErrors() {
    var fields = getRequestFields();

    if (!fields.subtopic) {
      return;
    }

    var error =
      ensureValidationMessage();

    var subtopicMissing =
      String(
        fields.subtopic.value || ''
      ).trim() === '';

    /*
     * Topic only needs validation if it exists.
     */
    var topicMissing = false;

    if (fields.topic) {
      topicMissing =
        String(
          fields.topic.value || ''
        ).trim() === '';
    }


    if (fields.topic) {
      fields.topic.classList.toggle(
        'zt-required-invalid',
        topicMissing
      );

      fields.topic.setAttribute(
        'aria-invalid',
        topicMissing
          ? 'true'
          : 'false'
      );
    }


    fields.subtopic.classList.toggle(
      'zt-required-invalid',
      subtopicMissing
    );

    fields.subtopic.setAttribute(
      'aria-invalid',
      subtopicMissing
        ? 'true'
        : 'false'
    );


    if (error) {
      error.classList.toggle(
        'is-visible',
        topicMissing || subtopicMissing
      );
    }


    /*
     * Focus first missing field.
     */
    if (
      fields.topic &&
      topicMissing
    ) {
      fields.topic.focus();
    } else if (subtopicMissing) {
      fields.subtopic.focus();
    }
  }


  /**
   * Refresh validation after the user changes
   * one of the dropdowns.
   */
  function refreshValidationState() {
    var fields = getRequestFields();

    if (!fields.subtopic) {
      return;
    }

    var subtopicMissing =
      String(
        fields.subtopic.value || ''
      ).trim() === '';

    var topicMissing = false;

    if (fields.topic) {
      topicMissing =
        String(
          fields.topic.value || ''
        ).trim() === '';

      fields.topic.classList.toggle(
        'zt-required-invalid',
        topicMissing
      );
    }


    fields.subtopic.classList.toggle(
      'zt-required-invalid',
      subtopicMissing
    );


    var error =
      document.querySelector(
        '.zt-request-validation-error'
      );

    if (error) {
      error.classList.toggle(
        'is-visible',
        topicMissing || subtopicMissing
      );
    }
  }


  /**
   * Bind fields after node render.
   */
  whenEvent(
    'render:finish',
    function () {

      var fields =
        getRequestFields();

      /*
       * Neither supported form is present.
       */
      if (!fields.subtopic) {
        return;
      }


      ensureValidationMessage();


      /**
       * Bind Topic if this is the standard form.
       */
      if (
        fields.topic &&
        !fields.topic.dataset
          .requiredValidationBound
      ) {

        fields.topic.addEventListener(
          'change',
          function () {

            assignSessionVar(
              'sf_Topic__c',
              fields.topic.value
            );

            refreshValidationState();
          }
        );

        fields.topic.dataset
          .requiredValidationBound =
          'true';
      }


      /**
       * Bind Subtopic for both form types.
       */
      if (
        !fields.subtopic.dataset
          .requiredValidationBound
      ) {

        fields.subtopic.addEventListener(
          'change',
          function () {

            assignSessionVar(
              'sf_Sub_Topic__c',
              fields.subtopic.value
            );

            refreshValidationState();
          }
        );

        fields.subtopic.dataset
          .requiredValidationBound =
          'true';
      }


      /*
       * Don't show errors immediately when the
       * node first loads.
       */
      if (fields.topic) {
        fields.topic.classList.remove(
          'zt-required-invalid'
        );
      }

      fields.subtopic.classList.remove(
        'zt-required-invalid'
      );
    }
  );


  /**
   * ========================================================
   * NAVIGATION GUARD
   * ========================================================
   */
  document.addEventListener(
    'click',
    function (event) {

      var fields =
        getRequestFields();

      /*
       * No supported form on this node.
       */
      if (!fields.subtopic) {
        return;
      }


      /*
       * Allow the user to interact with the form itself.
       */
      if (
        event.target.closest(
          '.zt-form-card'
        )
      ) {
        return;
      }


      /*
       * Only inspect clickable navigation controls.
       */
      var navigationControl =
        event.target.closest(
          'button, a, input[type="button"], input[type="submit"]'
        );

      if (!navigationControl) {
        return;
      }


      /*
       * Valid form: allow navigation.
       */
      if (requestDetailsAreValid()) {
        return;
      }


      /*
       * Invalid form: stop navigation.
       */
      event.preventDefault();
      event.stopPropagation();
      event.stopImmediatePropagation();

      showValidationErrors();

    },
    true
  );

})();
</script>

<script>
whenEvent('render:finish', () => {
  const editor = document.getElementById('htmlBodyEditor');
  const hidden = document.getElementById('HtmlBody');

  if (!editor || !hidden) return;

  hidden.value = editor.innerHTML;

  if (!editor.dataset.boundHtmlSync) {
    editor.addEventListener('input', () => {
      hidden.value = editor.innerHTML;
    });
    editor.dataset.boundHtmlSync = 'true';
  }
});
</script>

<script>
/* =========================================================
TOPIC -> SUBTOPIC FILTER (screens 32 and 33)

Every subtopic <option> carries data-topic, written by nodes
17 / 26 from the lane's own intent map. Both screens carry a
Topic and a Subtopic select: the subtopic list shows only the
options whose data-topic matches the chosen Topic, and a
subtopic that no longer fits is cleared, so the pair saved on
the Case is always one Salesforce accepts.
========================================================= */
whenEvent('render:finish', function () {
  var topic = document.getElementById('sf_Topic__c');
  var subtopic = document.getElementById('sf_Sub_Topic__c');

  if (!topic || !subtopic || subtopic.dataset.topicFilterBound) return;
  subtopic.dataset.topicFilterBound = 'true';

  // keep every option once, then rebuild the list for the chosen Topic
  var allOptions = [];
  for (var i = 0; i < subtopic.options.length; i++) {
    allOptions.push(subtopic.options[i]);
  }

  // Zingtree can restore the saved Topic after render:finish without firing change, which
  // left the Subtopic list built for an empty Topic until the agent toggled Topic away and
  // back (25 Sep standup). So the list is rebuilt whenever the Topic it was built for no
  // longer matches the Topic on screen: on the next tick, on Topic change, and just before
  // the agent opens the Subtopic list.
  var builtForTopic = null;

  function filterSubtopics() {
    var topicValue = topic.value;
    if (topicValue === builtForTopic) return;
    builtForTopic = topicValue;

    var keepValue = subtopic.value;
    var keepStillFits = false;

    subtopic.innerHTML = '';
    for (var i = 0; i < allOptions.length; i++) {
      var option = allOptions[i];
      var optionTopic = option.getAttribute('data-topic') || '';
      // the placeholder has no topic and always stays; no Topic yet shows every option
      if (optionTopic === '' || topicValue === '' || optionTopic === topicValue) {
        subtopic.appendChild(option);
        if (keepValue !== '' && option.value === keepValue) keepStillFits = true;
      }
    }

    subtopic.value = keepStillFits ? keepValue : '';
    if (!keepStillFits && keepValue !== '') {
      assignSessionVar('sf_Sub_Topic__c', '');
    }
  }

  filterSubtopics();
  setTimeout(filterSubtopics, 0);
  topic.addEventListener('change', filterSubtopics);
  subtopic.addEventListener('mousedown', filterSubtopics);
  subtopic.addEventListener('focus', filterSubtopics);
});
</script>

<style>
.zt-form-card {
  max-width: 900px;
  margin: 20px auto;
  padding: 24px;
  background: #ffffff;
  border: 1px solid #d9e2ec;
  border-radius: 14px;
  box-shadow: 0 8px 24px rgba(15, 23, 42, 0.06);
}

.zt-form-header {
  margin-bottom: 20px;
}

.zt-form-title {
  margin: 0 0 6px;
  font-size: 24px;
  font-weight: 700;
  line-height: 1.2;
  color: #1f2937;
}

.zt-form-subtitle {
  margin: 0;
  font-size: 14px;
  color: #6b7280;
}

.zt-form-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(240px, 1fr));
  gap: 18px;
  margin-bottom: 18px;
}

.zt-form-field {
  display: flex;
  flex-direction: column;
}

.zt-form-field-full {
  margin-top: 4px;
}

.zt-form-label {
  margin-bottom: 8px;
  font-size: 14px;
  font-weight: 600;
  color: #374151;
}

.zt-form-control {
  width: 100%;
  min-height: 44px;
  padding: 10px 12px;
  font-size: 14px;
  line-height: 1.4;
  color: #111827;
  background: #fff;
  border: 1px solid #cbd5e1;
  border-radius: 10px;
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
  box-sizing: border-box;
}

.zt-form-control:focus {
  outline: none;
  border-color: #2563eb;
  box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.15);
}

.zt-form-textarea {
  min-height: 220px;
  resize: vertical;
  font-family: Consolas, Monaco, monospace;
}

.zt-form-help {
  margin-top: 8px;
  font-size: 12px;
  color: #6b7280;
}

@media (max-width: 768px) {
  .zt-form-grid {
    grid-template-columns: 1fr;
  }

  .zt-form-card {
    padding: 18px;
  }
}
</style>

<style>
/* =========================================================
CASE REVIEW DASHBOARD
Matches the supplied reference layout.
========================================================= */

.case-review-shell {
width: 100%;
margin: 0;
padding: 0;
box-sizing: border-box;
font-family:
-apple-system,
BlinkMacSystemFont,
"Segoe UI",
Roboto,
Arial,
sans-serif;
color: #172033;
}

.case-review-shell *,
.case-review-shell *::before,
.case-review-shell *::after {
box-sizing: border-box;
}


/* =========================================================
OUTER PANEL
========================================================= */

.case-review-panel {
width: 100%;
margin: 0;
overflow: hidden;
background: #f8fafc;
border: 1px solid #e5eaf1;
border-radius: 28px;
}


/* =========================================================
HEADER
========================================================= */

.case-review-hero {
min-height: 210px;
padding: 27px 28px 29px;
color: #ffffff;

background:
linear-gradient(
100deg,
#091735 0%,
#102345 56%,
#203957 100%
);
}

.case-review-hero-top {
display: flex;
align-items: flex-start;
justify-content: space-between;
gap: 36px;
}

.case-review-hero-copy {
flex: 1 1 auto;
min-width: 0;
padding-top: 2px;
}

.case-review-eyebrow {
margin: 0 0 10px;

font-size: 12px;
line-height: 1.2;
font-weight: 700;
letter-spacing: 0.15em;
text-transform: uppercase;

color: rgba(255, 255, 255, 0.63);
}

.case-review-main-title {
margin: 0 0 9px;

font-size: 24px;
line-height: 1.22;
font-weight: 700;

color: #ffffff;
}

.case-review-subtitle {
font-size: 16px;
line-height: 1.5;
font-weight: 400;

color: rgba(255, 255, 255, 0.86);
}

.case-review-subtitle strong {
font-weight: 700;
color: #ffffff;
}

.case-review-subtitle-separator {
display: inline-block;
margin: 0 4px;
}


/* =========================================================
CONFIDENCE CARD
========================================================= */

.case-review-hero-metrics-card {
flex: 0 0 32%;
max-width: 355px;
min-width: 285px;

padding: 17px 18px;

background: rgba(255, 255, 255, 0.13);
border: 1px solid rgba(255, 255, 255, 0.13);
border-radius: 20px;

box-shadow:
inset 0 1px 0
rgba(255, 255, 255, 0.04);
}

.case-review-hero-metric + .case-review-hero-metric {
margin-top: 13px;
padding-top: 13px;

border-top:
1px solid
rgba(255, 255, 255, 0.14);
}

.case-review-hero-metric-label {
margin-bottom: 5px;

font-size: 11px;
line-height: 1.3;
font-weight: 700;
letter-spacing: 0.13em;
text-transform: uppercase;

color: rgba(255, 255, 255, 0.62);
}

.case-review-hero-metric-value {
font-size: 24px;
line-height: 1.2;
font-weight: 700;
color: #ffffff;
}

.case-review-hero-metric-text {
font-size: 14px;
line-height: 1.5;
color: rgba(255, 255, 255, 0.9);

overflow-wrap: anywhere;
}


/* =========================================================
BODY
========================================================= */

.case-review-body {
padding: 24px;
background: #f8fafc;
}


/*
* Reference screenshot uses:
*
* left ~44%
* right ~56%
*/
.case-review-grid {
display: grid;

grid-template-columns:
minmax(0, 44fr)
minmax(0, 56fr);

gap: 22px;

align-items: start;
}

.case-review-col {
min-width: 0;
}

.case-review-col .case-review-card +
.case-review-card {
margin-top: 22px;
}


/* =========================================================
STANDARD CARD
========================================================= */

.case-review-card {
width: 100%;

padding: 19px 20px 20px;

background: #ffffff;
border: 1px solid #dde5ed;
border-radius: 24px;

box-shadow:
0 1px 3px
rgba(15, 23, 42, 0.035);
}

.case-review-card-title {
margin: 0 0 17px;

font-size: 16px;
line-height: 1.35;
font-weight: 700;

color: #25334a;
}


/* =========================================================
CASE DETAIL ROWS
========================================================= */

.case-review-row {
display: grid;

grid-template-columns:
minmax(120px, 42%)
minmax(0, 58%);

gap: 18px;

align-items: center;

min-height: 51px;
padding: 12px 0;

border-top: 1px solid #e8ecf0;
}

.case-review-row:first-of-type {
padding-top: 3px;
border-top: 0;
}

.case-review-row:last-child {
padding-bottom: 2px;
}

.case-review-row-label {
font-size: 12px;
line-height: 1.4;
font-weight: 700;

text-transform: uppercase;
letter-spacing: 0.09em;

color: #58677b;
}

.case-review-row-value {
min-width: 0;

font-size: 15px;
line-height: 1.45;
font-weight: 400;

text-align: right;

color: #263248;

overflow-wrap: anywhere;
}


/* =========================================================
EMAIL CONTENT
========================================================= */

.case-review-html-card-body {
font-size: 15px;
line-height: 1.62;
font-weight: 400;

color: #283344;

overflow-wrap: anywhere;
}

.case-review-html-card-body p {
margin-top: 0;
margin-bottom: 15px;
}

.case-review-html-card-body p:last-child {
margin-bottom: 0;
}

.case-review-html-card-body a {
font-weight: 600;
color: #233f73;
text-decoration: none;
}

.case-review-html-card-body a:hover {
text-decoration: underline;
}

.case-review-muted {
color: #94a3b8;
font-style: italic;
}


/*
* Give the response card enough visual presence
* to match the taller card shown in the reference.
*/
.case-review-response-card {
min-height: 500px;
}


/* =========================================================
POLICY FLAGS
========================================================= */

.case-review-flag-card {
padding: 14px 15px 12px;

border: 1px solid;
border-radius: 18px;
}

.case-review-flag-top {
display: flex;
align-items: center;
justify-content: space-between;

gap: 12px;
}

.case-review-flag-title {
font-size: 12px;
line-height: 1.4;
font-weight: 600;

color: #627085;
}

.case-review-flag-pill {
display: inline-flex;
align-items: center;
justify-content: center;

min-width: 24px;
min-height: 24px;

padding: 2px 8px;

border-radius: 999px;

font-size: 12px;
line-height: 1;
font-weight: 700;

color: #ffffff;
}

.case-review-flag-value {
margin-top: 8px;

font-size: 17px;
line-height: 1.2;
font-weight: 700;
}


/* =========================================================
INTENT CARDS
========================================================= */

.case-review-intent-grid {
display: grid;

grid-template-columns:
repeat(2, minmax(0, 1fr));

gap: 15px;

margin-top: 3px;
}

.case-review-intent-simple-card {
min-height: 102px;

padding: 17px 18px;

display: flex;
flex-direction: column;
justify-content: flex-start;

border: 1px solid;
border-radius: 20px;
}

.case-review-intent-simple-title {
font-size: 11px;
line-height: 1.4;
font-weight: 500;

color: #718096;

overflow-wrap: break-word;
}

.case-review-intent-simple-value {
margin-top: 9px;

font-size: 16px;
line-height: 1.2;
font-weight: 700;
}


/* =========================================================
FEEDBACK WIDGET ALIGNMENT
========================================================= */

.case-review-response-card .ai-feedback-wrap {
margin-top: 18px;
}

.case-review-response-card .ai-feedback-label {
margin: 0 0 9px;

font-size: 16px;
line-height: 1.35;
font-weight: 700;

color: #283344;
}

.case-review-response-card .ai-feedback-buttons {
gap: 10px;
}

.case-review-response-card .ai-feedback-btn {
width: 56px;
min-width: 56px;
height: 48px;
min-height: 48px;

padding: 0;

display: inline-flex;
align-items: center;
justify-content: center;

background: #ffffff;
border: 1px solid #d7dde5;
border-radius: 8px;

font-size: 21px;

box-shadow:
0 1px 2px
rgba(15, 23, 42, 0.04);
}


/* =========================================================
RESPONSIVE
========================================================= */

@media (max-width: 1000px) {

.case-review-grid {
grid-template-columns:
minmax(0, 42fr)
minmax(0, 58fr);

gap: 18px;
}

.case-review-intent-grid {
gap: 12px;
}

.case-review-intent-simple-card {
padding: 15px;
}
}


@media (max-width: 820px) {

.case-review-hero {
min-height: 0;
}

.case-review-hero-top {
flex-direction: column;
}

.case-review-hero-metrics-card {
width: 100%;
max-width: none;
min-width: 0;
flex-basis: auto;
}

.case-review-grid {
grid-template-columns: 1fr;
}

.case-review-response-card {
min-height: 0;
}
}


@media (max-width: 520px) {

.case-review-panel {
border-radius: 20px;
}

.case-review-hero {
padding: 23px 20px;
}

.case-review-body {
padding: 15px;
}

.case-review-card {
padding: 17px;
border-radius: 20px;
}

.case-review-main-title {
font-size: 22px;
}

.case-review-row {
grid-template-columns: 1fr;
gap: 4px;
}

.case-review-row-value {
text-align: left;
}

.case-review-intent-grid {
grid-template-columns: 1fr;
}

.case-review-intent-simple-card {
min-height: 86px;
}
}
</style>
<style>
.ai-feedback-wrap {
  margin-top: 12px;
}

.ai-feedback-label {
  margin-bottom: 8px;
  font-weight: 600;
}

.ai-feedback-buttons {
  display: flex;
  gap: 10px;
}

.ai-feedback-btn {
  min-width: 52px;
  min-height: 44px;
  padding: 8px 12px;
  border: 1px solid #cfcfcf;
  border-radius: 8px;
  background: #fff;
  cursor: pointer;
  font-size: 22px;
  line-height: 1;
}

.ai-feedback-btn:hover {
  border-color: #999;
}

.ai-feedback-btn.selected {
  border-color: #222;
  box-shadow: inset 0 0 0 2px #222;
}

.ai-feedback-status {
  min-height: 18px;
  margin-top: 8px;
  font-size: 13px;
  color: #374151;
}


/* Thumbs-down comments section */









</style>

<script>
(function () {
  /**
   * AI FEEDBACK (screens 30, 53, 54 and 55)
   *
   * The thumbs buttons are the ONLY writer of ai_feedback. They write it into a
   * native hidden-from-view text field of the same name, because native fields
   * always submit with the button the agent clicks and so always reach form data.
   * ai_feedback_comments is a native textarea on the same screen, shown and
   * focused only on thumbs_down. thumbs_up hides it and clears any text in it,
   * so a comment typed before switching to thumbs up never submits.
   */
  function nativeField(name) {
    return document.querySelector(
      'input[name="' + name + '"], textarea[name="' + name + '"]'
    );
  }

  // The wrapper that holds a native field and its label: walk up while the
  // parent holds only this one control, so nothing else on the screen moves.
  function nativeWrapper(name) {
    var field = nativeField(name);
    if (!field) return null;
    var wrapper = field;
    while (
      wrapper.parentElement &&
      wrapper.parentElement.querySelectorAll('input, select, textarea').length === 1
    ) {
      wrapper = wrapper.parentElement;
    }
    return wrapper;
  }

  function setNativeFieldVisible(name, visible) {
    var wrapper = nativeWrapper(name);
    if (wrapper) wrapper.style.display = visible ? '' : 'none';
  }

  function recordFeedback(value) {
    var field = nativeField('ai_feedback');
    if (field) {
      field.value = value;
      field.dispatchEvent(new Event('change', { bubbles: true }));
    }
    assignSessionVar('ai_feedback', value);
  }

  var statusText = {
    thumbs_up: '&#128077; Thanks for the feedback!',
    thumbs_down: '&#128078; Thanks - please say what was wrong in the AI feedback comments box below.'
  };

  function showComments() {
    setNativeFieldVisible('ai_feedback_comments', true);
    var comments = nativeField('ai_feedback_comments');
    if (comments) {
      comments.scrollIntoView({ behavior: 'smooth', block: 'center' });
      comments.focus();
    }
  }

  function hideComments() {
    var comments = nativeField('ai_feedback_comments');
    if (comments && comments.value !== '') {
      comments.value = '';
      comments.dispatchEvent(new Event('change', { bubbles: true }));
    }
    assignSessionVar('ai_feedback_comments', '');
    setNativeFieldVisible('ai_feedback_comments', false);
  }

  whenEvent('render:finish', function () {
    var widgets = document.querySelectorAll('.ai-feedback-wrap');
    if (!widgets.length) return;

    setNativeFieldVisible('ai_feedback', false);
    var ratedDown = nativeField('ai_feedback') && nativeField('ai_feedback').value === 'thumbs_down';
    setNativeFieldVisible('ai_feedback_comments', ratedDown);

    for (var i = 0; i < widgets.length; i++) {
      var widget = widgets[i];
      if (widget.dataset.aiFeedbackBound) continue;
      widget.dataset.aiFeedbackBound = 'true';

      var current = nativeField('ai_feedback');
      if (current && current.value) {
        var preselected = widget.querySelector('.ai-feedback-btn[data-feedback="' + current.value + '"]');
        if (preselected) preselected.classList.add('selected');
      }

      widget.addEventListener('click', function (event) {
        var btn = event.target.closest('.ai-feedback-btn');
        if (!btn) return;
        var value = btn.getAttribute('data-feedback');
        var buttons = this.querySelectorAll('.ai-feedback-btn');
        for (var j = 0; j < buttons.length; j++) buttons[j].classList.remove('selected');
        btn.classList.add('selected');
        recordFeedback(value);

        var status = this.querySelector('.ai-feedback-status');
        if (status) status.innerHTML = statusText[value] || '';

        if (value === 'thumbs_down') {
          showComments();
        } else {
          hideComments();
        }
      });
    }
  });
})();
</script>

