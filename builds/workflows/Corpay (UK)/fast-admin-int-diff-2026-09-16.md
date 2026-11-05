========================================================================
WORKFLOW DIFF — Fast Admin - INT
========================================================================

Before : Fast Admin - INT (BEFORE baseline 2026-09-16).json  (48 nodes)
After  : Fast Admin - INT (provider picklists + feedback fix 2026-09-16).json  (51 nodes)

## PLAIN SUMMARY

45 of 51 nodes are byte-for-byte identical to the original (88% untouched).
3 nodes added, 0 removed, 0 renumbered, 3 modified.

In plain terms:
  + NEW      node 49 — Homecharge lane? [Scoring]
  + NEW      node 50 — Load provider picklists [Script]
  + NEW      node 51 — Confirm energy and data provider [Content]
  * CHANGED  node 26 — Build case review dashboard [Script]
               - script code changed (259 → 243 lines) — Build case review dashboard
  * CHANGED  node 30 — Case review dashboard [Content]
               - button added/changed: "Yes - send email response" → node 49
               - button removed/replaced: "Yes - send email response" → node 31
  * CHANGED  node 48 — claude.md [Content]
               - content changed (439 → 474 lines) — claude.md

## TREE SHAPE

  node type                before    after    delta
  AI_Action                     4        4       +0
  Content                      15       16       +1
  Data                          4        4       +0
  Email                         1        1       +0
  Scoring                      10       11       +1
  Script                       14       15       +1
  TOTAL                        48       51       +3

  Root node unchanged (node 1).

## STRUCTURAL SANITY

  No broken links introduced.
  No nodes became unreachable.
  Pre-existing in the BEFORE tree (not caused by this edit): 0 broken link(s), 1 unreachable node(s).

## UNTOUCHED NODES (45)

  1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 27, 28, 29, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47

## TREE-LEVEL SETTINGS CHANGED (2)

  predefined_vars: {"0": {"checkbox_score": 1, "config": null, "custom_regex": "", "hidden_value": "", "id": 33997428, "inline": 0, "label": "", "label_type": "", "name": "ai_account_eligibility", "options": "", "project_id": 783808640, "project_node_id": 0, "rank": 0, "required": false, "score_var": "", "scores": "", "type": "predefined"}, "1": {"checkbox_score": 1, "config": null, "custom_regex": "", "hidden_value": "", "id": 33997429, "inline": 0, "label": "", "label_type": "", "name": "ai_bypass_reason", "options": "", "project_id": 783808640, "project_node_id": 0, "rank": 0, "required": false, "score_var": "", "scores": "", "type": "predefined"}, "10": {"checkbox_score": 1, "config": null, "custom_regex": "", "hidden_value": "", "id": 33997438, "inline": 0, "label": "", "label_type": "", "name": "email_analysis_route", "options": "", "project_id": 783808640, "project_node_id": 0, "rank": 0, "required": false, "score_var": "", "scores": "", "type": "predefined"}, "11": {"checkbox_score": 1, "config": null, "custom_regex": "", "hidden_value": "", "id": 33997439, "inline": 0, "label": "", "label_type": "", "name": "sf_Topic__c", "options": "", "project_id": 783808640, "project_node_id": 0, "rank": 0, "required": false, "score_var": "", "scores": "", "type": "predefined"}, "12": {"checkbox_score": 1, "config": null, "custom_regex": "", "hidden_value": "", "id": 33997440, "inline": 0, "label": "", "label_type": "", "name": "sf_Sub_Topic__c", "options": "", "project_id": 783808640, "project_node_id": 0, "rank": 0, "required": false, "score_var": "", "scores": "", "type": "predefined"}, "13": {"checkbox_score": 1, "config": null, "custom_regex": "", "hidden_value": "", "id": 33997441, "inline": 0, "label": "", "label_type": "", "name": "email_intent", "options": "", "project_id": 783808640, "project_node_id": 0, "rank": 0, "required": false, "score_var": "", "scores": "", "type": "predefined"}, "14": {"checkbox_score": 1, "config": null, "custom_regex": "", "hidden_value": "", "id": 33997442, "inline": 0, "label": "", "label_type": "", "name": "escalate_reason", "options": "", "project_id": 783808640, "project_node_id": 0, "rank": 0, "required": false, "score_var": "", "scores": "", "type": "predefined"}, "15": {"checkbox_score": 1, "config": null, "custom_regex": "", "hidden_value": "", "id": 33997443, "inline": 0, "label": "", "label_type": "", "name": "sentiment", "options": "", "project_id": 783808640, "project_node_id": 0, "rank": 0, "required": false, "score_var": "", "scores": "", "type": "predefined"}, "16": {"checkbox_score": 1, "config": null, "custom_regex": "", "hidden_value": "", "id": 33997444, "inline": 0, "label": "", "label_type": "", "name": "confidence_score", "options": "", "project_id": 783808640, "project_node_id": 0, "rank": 0, "required": false, "score_var": "", "scores": "", "type": "predefined"}, "17": {"checkbox_score": 1, "config": null, "custom_regex": "", "hidden_value": "", "id": 33997445, "inline": 0, "label": "", "label_type": "", "name": "unmatched_summary", "options": "", "project_id": 783808640, "project_node_id": 0, "rank": 0, "required": false, "score_var": "", "scores": "", "type": "predefined"}, "18": {"checkbox_score": 1, "config": null, "custom_regex": "", "hidden_value": "", "id": 33997446, "inline": 0, "label": "", "label_type": "", "name": "hc_requester_type", "options": "", "project_id": 783808640, "project_node_id": 0, "rank": 0, "required": false, "score_var": "", "scores": "", "type": "predefined"}, "19": {"checkbox_score": 1, "config": null, "custom_regex": "", "hidden_value": "", "id": 33997447, "inline": 0, "label": "", "label_type": "", "name": "hc_response_variant", "options": "", "project_id": 783808640, "project_node_id": 0, "rank": 0, "required": false, "score_var": "", "scores": "", "type": "predefined"}, "2": {"checkbox_score": 1, "config": null, "custom_regex": "", "hidden_value": "", "id": 33997430, "inline": 0, "label": "", "label_type": "", "name": "queue_source_value", "options": "", "project_id": 783808640, "project_node_id": 0, "rank": 0, "required": false, "score_var": "", "scores": "", "type": "predefined"}, "20": {"checkbox_score": 1, "config": null, "custom_regex": "", "hidden_value": "", "id": 33997448, "inline": 0, "label": "", "label_type": "", "name": "hc_template_key", "options": "", "project_id": 783808640, "project_node_id": 0, "rank": 0, "required": false, "score_var": "", "scores": "", "type": "predefined"}, "21": {"checkbox_score": 1, "config": null, "custom_regex": "", "hidden_value": "", "id": 33997449, "inline": 0, "label": "", "label_type": "", "name": "hc_agent_required", "options": "", "project_id": 783808640, "project_node_id": 0, "rank": 0, "required": false, "score_var": "", "scores": "", "type": "predefined"}, "22": {"checkbox_score": 1, "config": null, "custom_regex": "", "hidden_value": "", "id": 33997450, "inline": 0, "label": "", "label_type": "", "name": "hc_energy_supplier", "options": "", "project_id": 783808640, "project_node_id": 0, "rank": 0, "required": false, "score_var": "", "scores": "", "type": "predefined"}, "23": {"checkbox_score": 1, "config": null, "custom_regex": "", "hidden_value": "", "id": 33997451, "inline": 0, "label": "", "label_type": "", "name": "hc_data_provider", "options": "", "project_id": 783808640, "project_node_id": 0, "rank": 0, "required": false, "score_var": "", "scores": "", "type": "predefined"}, "3": {"checkbox_score": 1, "config": null, "custom_regex": "", "hidden_value": "", "id": 33997431, "inline": 0, "label": "", "label_type": "", "name": "queue_route", "options": "", "project_id": 783808640, "project_node_id": 0, "rank": 0, "required": false, "score_var": "", "scores": "", "type": "predefined"}, "4": {"checkbox_score": 1, "config": null, "custom_regex": "", "hidden_value": "", "id": 33997432, "inline": 0, "label": "", "label_type": "", "name": "queue_route_label", "options": "", "project_id": 783808640, "project_node_id": 0, "rank": 0, "required": false, "score_var": "", "scores": "", "type": "predefined"}, "5": {"checkbox_score": 1, "config": null, "custom_regex": "", "hidden_value": "", "id": 33997433, "inline": 0, "label": "", "label_type": "", "name": "sf_Id", "options": "", "project_id": 783808640, "project_node_id": 0, "rank": 0, "required": false, "score_var": "", "scores": "", "type": "predefined"}, "6": {"checkbox_score": 1, "config": null, "custom_regex": "", "hidden_value": "", "id": 33997434, "inline": 0, "label": "", "label_type": "", "name": "sf_Subject", "options": "", "project_id": 783808640, "project_node_id": 0, "rank": 0, "required": false, "score_var": "", "scores": "", "type": "predefined"}, "7": {"checkbox_score": 1, "config": null, "custom_regex": "", "hidden_value": "", "id": 33997435, "inline": 0, "label": "", "label_type": "", "name": "sf_CaseNumber", "options": "", "project_id": 783808640, "project_node_id": 0, "rank": 0, "required": false, "score_var": "", "scores": "", "type": "predefined"}, "8": {"checkbox_score": 1, "config": null, "custom_regex": "", "hidden_value": "", "id": 33997436, "inline": 0, "label": "", "label_type": "", "name": "sf_ContactId", "options": "", "project_id": 783808640, "project_node_id": 0, "rank": 0, "required": false, "score_var": "", "scores": "", "type": "predefined"}, "9": {"checkbox_score": 1, "config": null, "custom_regex": "", "hidden_value": "", "id": 33997437, "inline": 0, "label": "", "label_type": "", "name": "intent_in_scope", "options": "", "project_id": 783808640, "project_node_id": 0, "rank": 0, "required": false, "score_var": "", "scores": "", "type": "predefined"}} → {"0": {"checkbox_score": 1, "config": null, "custom_regex": "", "hidden_value": "", "id": 33997428, "inline": 0, "label": "", "label_type": "", "name": "ai_account_eligibility", "options": "", "project_id": 783808640, "project_node_id": 0, "rank": 0, "required": false, "score_var": "", "scores": "", "type": "predefined"}, "1": {"checkbox_score": 1, "config": null, "custom_regex": "", "hidden_value": "", "id": 33997429, "inline": 0, "label": "", "label_type": "", "name": "ai_bypass_reason", "options": "", "project_id": 783808640, "project_node_id": 0, "rank": 0, "required": false, "score_var": "", "scores": "", "type": "predefined"}, "10": {"checkbox_score": 1, "config": null, "custom_regex": "", "hidden_value": "", "id": 33997438, "inline": 0, "label": "", "label_type": "", "name": "email_analysis_route", "options": "", "project_id": 783808640, "project_node_id": 0, "rank": 0, "required": false, "score_var": "", "scores": "", "type": "predefined"}, "11": {"checkbox_score": 1, "config": null, "custom_regex": "", "hidden_value": "", "id": 33997439, "inline": 0, "label": "", "label_type": "", "name": "sf_Topic__c", "options": "", "project_id": 783808640, "project_node_id": 0, "rank": 0, "required": false, "score_var": "", "scores": "", "type": "predefined"}, "12": {"checkbox_score": 1, "config": null, "custom_regex": "", "hidden_value": "", "id": 33997440, "inline": 0, "label": "", "label_type": "", "name": "sf_Sub_Topic__c", "options": "", "project_id": 783808640, "project_node_id": 0, "rank": 0, "required": false, "score_var": "", "scores": "", "type": "predefined"}, "13": {"checkbox_score": 1, "config": null, "custom_regex": "", "hidden_value": "", "id": 33997441, "inline": 0, "label": "", "label_type": "", "name": "email_intent", "options": "", "project_id": 783808640, "project_node_id": 0, "rank": 0, "required": false, "score_var": "", "scores": "", "type": "predefined"}, "14": {"checkbox_score": 1, "config": null, "custom_regex": "", "hidden_value": "", "id": 33997442, "inline": 0, "label": "", "label_type": "", "name": "escalate_reason", "options": "", "project_id": 783808640, "project_node_id": 0, "rank": 0, "required": false, "score_var": "", "scores": "", "type": "predefined"}, "15": {"checkbox_score": 1, "config": null, "custom_regex": "", "hidden_value": "", "id": 33997443, "inline": 0, "label": "", "label_type": "", "name": "sentiment", "options": "", "project_id": 783808640, "project_node_id": 0, "rank": 0, "required": false, "score_var": "", "scores": "", "type": "predefined"}, "16": {"checkbox_score": 1, "config": null, "custom_regex": "", "hidden_value": "", "id": 33997444, "inline": 0, "label": "", "label_type": "", "name": "confidence_score", "options": "", "project_id": 783808640, "project_node_id": 0, "rank": 0, "required": false, "score_var": "", "scores": "", "type": "predefined"}, "17": {"checkbox_score": 1, "config": null, "custom_regex": "", "hidden_value": "", "id": 33997445, "inline": 0, "label": "", "label_type": "", "name": "unmatched_summary", "options": "", "project_id": 783808640, "project_node_id": 0, "rank": 0, "required": false, "score_var": "", "scores": "", "type": "predefined"}, "18": {"checkbox_score": 1, "config": null, "custom_regex": "", "hidden_value": "", "id": 33997446, "inline": 0, "label": "", "label_type": "", "name": "hc_requester_type", "options": "", "project_id": 783808640, "project_node_id": 0, "rank": 0, "required": false, "score_var": "", "scores": "", "type": "predefined"}, "19": {"checkbox_score": 1, "config": null, "custom_regex": "", "hidden_value": "", "id": 33997447, "inline": 0, "label": "", "label_type": "", "name": "hc_response_variant", "options": "", "project_id": 783808640, "project_node_id": 0, "rank": 0, "required": false, "score_var": "", "scores": "", "type": "predefined"}, "2": {"checkbox_score": 1, "config": null, "custom_regex": "", "hidden_value": "", "id": 33997430, "inline": 0, "label": "", "label_type": "", "name": "queue_source_value", "options": "", "project_id": 783808640, "project_node_id": 0, "rank": 0, "required": false, "score_var": "", "scores": "", "type": "predefined"}, "20": {"checkbox_score": 1, "config": null, "custom_regex": "", "hidden_value": "", "id": 33997448, "inline": 0, "label": "", "label_type": "", "name": "hc_template_key", "options": "", "project_id": 783808640, "project_node_id": 0, "rank": 0, "required": false, "score_var": "", "scores": "", "type": "predefined"}, "21": {"checkbox_score": 1, "config": null, "custom_regex": "", "hidden_value": "", "id": 33997449, "inline": 0, "label": "", "label_type": "", "name": "hc_agent_required", "options": "", "project_id": 783808640, "project_node_id": 0, "rank": 0, "required": false, "score_var": "", "scores": "", "type": "predefined"}, "22": {"checkbox_score": 1, "config": null, "custom_regex": "", "hidden_value": "", "id": 33997450, "inline": 0, "label": "", "label_type": "", "name": "sf_Energy_Provider__c", "options": "", "project_id": 783808640, "project_node_id": 0, "rank": 0, "required": false, "score_var": "", "scores": "", "type": "predefined"}, "23": {"checkbox_score": 1, "config": null, "custom_regex": "", "hidden_value": "", "id": 33997451, "inline": 0, "label": "", "label_type": "", "name": "sf_Data_Provider__c", "options": "", "project_id": 783808640, "project_node_id": 0, "rank": 0, "required": false, "score_var": "", "scores": "", "type": "predefined"}, "3": {"checkbox_score": 1, "config": null, "custom_regex": "", "hidden_value": "", "id": 33997431, "inline": 0, "label": "", "label_type": "", "name": "queue_route", "options": "", "project_id": 783808640, "project_node_id": 0, "rank": 0, "required": false, "score_var": "", "scores": "", "type": "predefined"}, "4": {"checkbox_score": 1, "config": null, "custom_regex": "", "hidden_value": "", "id": 33997432, "inline": 0, "label": "", "label_type": "", "name": "queue_route_label", "options": "", "project_id": 783808640, "project_node_id": 0, "rank": 0, "required": false, "score_var": "", "scores": "", "type": "predefined"}, "5": {"checkbox_score": 1, "config": null, "custom_regex": "", "hidden_value": "", "id": 33997433, "inline": 0, "label": "", "label_type": "", "name": "sf_Id", "options": "", "project_id": 783808640, "project_node_id": 0, "rank": 0, "required": false, "score_var": "", "scores": "", "type": "predefined"}, "6": {"checkbox_score": 1, "config": null, "custom_regex": "", "hidden_value": "", "id": 33997434, "inline": 0, "label": "", "label_type": "", "name": "sf_Subject", "options": "", "project_id": 783808640, "project_node_id": 0, "rank": 0, "required": false, "score_var": "", "scores": "", "type": "predefined"}, "7": {"checkbox_score": 1, "config": null, "custom_regex": "", "hidden_value": "", "id": 33997435, "inline": 0, "label": "", "label_type": "", "name": "sf_CaseNumber", "options": "", "project_id": 783808640, "project_node_id": 0, "rank": 0, "required": false, "score_var": "", "scores": "", "type": "predefined"}, "8": {"checkbox_score": 1, "config": null, "custom_regex": "", "hidden_value": "", "id": 33997436, "inline": 0, "label": "", "label_type": "", "name": "sf_ContactId", "options": "", "project_id": 783808640, "project_node_id": 0, "rank": 0, "required": false, "score_var": "", "scores": "", "type": "predefined"}, "9": {"checkbox_score": 1, "config": null, "custom_regex": "", "hidden_value": "", "id": 33997437, "inline": 0, "label": "", "label_type": "", "name": "intent_in_scope", "options": "", "project_id": 783808640, "project_node_id": 0, "rank": 0, "required": false, "score_var": "", "scores": "", "type": "predefined"}}
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
   * Supports both:
   *
   * 1. Standard Request Details form
   *    - sf_Topic__c
   *    - sf_Sub_Topic__c
   *
   * 2. Multiple Subtopics form
   *    - sf_Sub_Topic__c only
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

/* Thumbs-down comments section */
.ai-feedback-comments {
  display: none;
  margin-top: 16px;
  padding: 16px;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 10px;
}

.ai-feedback-comments.is-visible {
  display: block;
}

.ai-feedback-comments-label {
  display: block;
  margin-bottom: 8px;
  font-size: 14px;
  font-weight: 600;
  color: #374151;
}

.ai-feedback-comments-input {
  box-sizing: border-box;
  width: 100%;
  min-height: 110px;
  padding: 10px 12px;
  font-family: inherit;
  font-size: 14px;
  line-height: 1.5;
  color: #111827;
  background: #ffffff;
  border: 1px solid #cbd5e1;
  border-radius: 8px;
  resize: vertical;
}

.ai-feedback-comments-input:focus {
  outline: none;
  border-color: #2563eb;
  box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.15);
}

.ai-feedback-comments-error {
  min-height: 18px;
  margin-top: 6px;
  font-size: 12px;
  color: #b91c1c;
}

.ai-feedback-submit {
  margin-top: 8px;
  min-height: 42px;
  padding: 9px 16px;
  color: #ffffff;
  font-size: 14px;
  font-weight: 600;
  background: #1f2937;
  border: 0;
  border-radius: 8px;
  cursor: pointer;
}

.ai-feedback-submit:hover {
  background: #111827;
}

.ai-feedback-submit:focus {
  outline: none;
  box-shadow: 0 0 0 3px rgba(31, 41, 55, 0.2);
}

</style>

<script>
(function () {
  /**
   * Shows or hides the thumbs-down comments section.
   */
  function setCommentsVisibility($widget, shouldShow) {
    var $comments = $widget.find('.ai-feedback-comments');

    $comments
      .toggleClass('is-visible', shouldShow)
      .attr('aria-hidden', shouldShow ? 'false' : 'true');

    if (shouldShow) {
      window.setTimeout(function () {
        $comments.find('.ai-feedback-comments-input').trigger('focus');
      }, 0);
    }
  }

  whenEvent('render:finish', function () {
    var $widgets = jQuery('.ai-feedback-wrap');

    if (!$widgets.length) return;

    $widgets.each(function () {
      var $widget = jQuery(this);

      if ($widget.data('ai-feedback-bound')) return;
      $widget.data('ai-feedback-bound', true);

      /*
       * Handle thumbs-up and thumbs-down selection.
       */
      $widget.on('click', '.ai-feedback-btn', function () {
        var $btn = jQuery(this);
        var feedbackValue = $btn.attr('data-feedback');
        var $hidden = $widget.find(
          'input[name="ai_feedback"]'
        );
        var $commentsInput = $widget.find(
          'textarea[name="ai_feedback_comments"]'
        );
        var $error = $widget.find(
          '.ai-feedback-comments-error'
        );

        // Highlight the selected thumb.
        $widget
          .find('.ai-feedback-btn')
          .removeClass('selected');

        $btn.addClass('selected');

        // Update the hidden Zingtree form-data field.
        $hidden.val(feedbackValue);

        // Clear any previous validation message.
        $error.text('');

        if (feedbackValue === 'thumbs_down') {
          /*
           * Stay on this screen and allow the user to explain
           * why the generated email was not helpful.
           */
          setCommentsVisibility($widget, true);
        } else {
          /*
           * Hide and clear comments if the user changes their
           * selection from thumbs-down to thumbs-up.
           */
          setCommentsVisibility($widget, false);
          $commentsInput.val('');

          assignSessionVar(
            'ai_feedback_comments',
            ''
          );
        }

        assignSessionVar(
          'ai_feedback',
          feedbackValue
        );
      });

      /*
       * Keep ai_feedback_comments synchronized while typing.
       */
      $widget.on(
        'input',
        '.ai-feedback-comments-input',
        function () {
          var comments = jQuery(this).val();

          assignSessionVar(
            'ai_feedback_comments',
            comments
          );

          $widget
            .find('.ai-feedback-comments-error')
            .text('');
        }
      );

      /*
       * Submit the thumbs-down feedback after comments
       * have been entered.
       */
      $widget.on(
        'click',
        '.ai-feedback-submit',
        function () {
          var comments = String(
            $widget
              .find('.ai-feedback-comments-input')
              .val() || ''
          ).trim();

          var $error = $widget.find(
            '.ai-feedback-comments-error'
          );

          /*
           * Remove this validation block if comments should
           * be optional.
           */
          if (!comments) {
            $error.text(
              'Please enter a comment before submitting.'
            );

            $widget
              .find('.ai-feedback-comments-input')
              .trigger('focus');

            return;
          }

          $error.text('');

          assignSessionVar(
            'ai_feedback',
            'thumbs_down'
          );

          assignSessionVar(
            'ai_feedback_comments',
            comments
          );

          do_button_click(
            8,
            null,
            'AI feedback submitted',
            'thumbs_down'
          );
        }
      );
    });
  });

  whenEvent('formDataUpdated', function (changes) {
    if (!changes || typeof changes !== 'object') return;

    if (
      !Object.prototype.hasOwnProperty.call(
        changes,
        'ai_feedback'
      )
    ) {
      return;
    }

    var feedbackValue = changes.ai_feedback;

    /*
     * Thumbs-up can continue immediately.
     *
     * Thumbs-down remains on the current screen so the user
     * can enter ai_feedback_comments. Navigation occurs from
     * the Submit feedback button instead.
     */
    if (feedbackValue === 'thumbs_up') {
      do_button_click(
        8,
        null,
        'AI feedback',
        feedbackValue
      );
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
   * Supports both:
   *
   * 1. Standard Request Details form
   *    - sf_Topic__c
   *    - sf_Sub_Topic__c
   *
   * 2. Multiple Subtopics form
   *    - sf_Sub_Topic__c only
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

.ai-feedback-thankyou {
  margin-top: 4px;
  font-size: 15px;
  font-weight: 600;
  line-height: 1.4;
  color: #166534;
}

/* Thumbs-down comments section */
.ai-feedback-comments {
  display: none;
  margin-top: 16px;
  padding: 16px;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 10px;
}

.ai-feedback-comments.is-visible {
  display: block;
}

.ai-feedback-comments-label {
  display: block;
  margin-bottom: 8px;
  font-size: 14px;
  font-weight: 600;
  color: #374151;
}

.ai-feedback-comments-input {
  box-sizing: border-box;
  width: 100%;
  min-height: 110px;
  padding: 10px 12px;
  font-family: inherit;
  font-size: 14px;
  line-height: 1.5;
  color: #111827;
  background: #ffffff;
  border: 1px solid #cbd5e1;
  border-radius: 8px;
  resize: vertical;
}

.ai-feedback-comments-input:focus {
  outline: none;
  border-color: #2563eb;
  box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.15);
}

.ai-feedback-comments-error {
  min-height: 18px;
  margin-top: 6px;
  font-size: 12px;
  color: #b91c1c;
}

.ai-feedback-submit {
  margin-top: 8px;
  min-height: 42px;
  padding: 9px 16px;
  color: #ffffff;
  font-size: 14px;
  font-weight: 600;
  background: #1f2937;
  border: 0;
  border-radius: 8px;
  cursor: pointer;
}

.ai-feedback-submit:hover {
  background: #111827;
}

.ai-feedback-submit:focus {
  outline: none;
  box-shadow: 0 0 0 3px rgba(31, 41, 55, 0.2);
}

</style>

<script>
(function () {
  /**
   * Shows or hides the thumbs-down comments section.
   */
  function setCommentsVisibility($widget, shouldShow) {
    var $comments = $widget.find('.ai-feedback-comments');

    $comments
      .toggleClass('is-visible', shouldShow)
      .attr('aria-hidden', shouldShow ? 'false' : 'true');

    if (shouldShow) {
      window.setTimeout(function () {
        $comments.find('.ai-feedback-comments-input').trigger('focus');
      }, 0);
    }
  }

  /**
   * Swaps the widget into its thank-you state in place. The agent stays
   * on the screen they were on and the send buttons below are untouched.
   * The hidden ai_feedback input and the comments textarea are hidden
   * rather than removed, so their zt-data values still submit with the
   * screen.
   */
  function showThankYou($widget, feedbackValue) {
    var message =
      feedbackValue === 'thumbs_up'
        ? '&#128077; Thanks for your feedback!'
        : '&#128078; Thanks for your feedback - we\'ll use it to improve.';

    $widget
      .find('.ai-feedback-label, .ai-feedback-buttons')
      .hide();

    $widget
      .find('.ai-feedback-comments')
      .removeClass('is-visible')
      .attr('aria-hidden', 'true')
      .hide();

    var $thanks = $widget.find('.ai-feedback-thankyou');

    if (!$thanks.length) {
      $thanks = jQuery(
        '<div class="ai-feedback-thankyou"></div>'
      ).appendTo($widget);
    }

    $thanks.html(message);
  }

  whenEvent('render:finish', function () {
    var $widgets = jQuery('.ai-feedback-wrap');

    if (!$widgets.length) return;

    $widgets.each(function () {
      var $widget = jQuery(this);

      if ($widget.data('ai-feedback-bound')) return;
      $widget.data('ai-feedback-bound', true);

      /*
       * Handle thumbs-up and thumbs-down selection.
       */
      $widget.on('click', '.ai-feedback-btn', function () {
        var $btn = jQuery(this);
        var feedbackValue = $btn.attr('data-feedback');
        var $hidden = $widget.find(
          'input[name="ai_feedback"]'
        );
        var $commentsInput = $widget.find(
          'textarea[name="ai_feedback_comments"]'
        );
        var $error = $widget.find(
          '.ai-feedback-comments-error'
        );

        // Highlight the selected thumb.
        $widget
          .find('.ai-feedback-btn')
          .removeClass('selected');

        $btn.addClass('selected');

        // Update the hidden Zingtree form-data field.
        $hidden.val(feedbackValue);

        // Clear any previous validation message.
        $error.text('');

        if (feedbackValue === 'thumbs_down') {
          /*
           * Stay on this screen and allow the user to explain
           * why the generated email was not helpful.
           */
          setCommentsVisibility($widget, true);
        } else {
          /*
           * Hide and clear comments if the user changes their
           * selection from thumbs-down to thumbs-up.
           */
          setCommentsVisibility($widget, false);
          $commentsInput.val('');

          assignSessionVar(
            'ai_feedback_comments',
            ''
          );
        }

        assignSessionVar(
          'ai_feedback',
          feedbackValue
        );

        if (feedbackValue === 'thumbs_up') {
          showThankYou($widget, feedbackValue);
        }
      });

      /*
       * Keep ai_feedback_comments synchronized while typing.
       */
      $widget.on(
        'input',
        '.ai-feedback-comments-input',
        function () {
          var comments = jQuery(this).val();

          assignSessionVar(
            'ai_feedback_comments',
            comments
          );

          $widget
            .find('.ai-feedback-comments-error')
            .text('');
        }
      );

      /*
       * Submit the thumbs-down feedback after comments
       * have been entered.
       */
      $widget.on(
        'click',
        '.ai-feedback-submit',
        function () {
          var comments = String(
            $widget
              .find('.ai-feedback-comments-input')
              .val() || ''
          ).trim();

          var $error = $widget.find(
            '.ai-feedback-comments-error'
          );

          /*
           * Remove this validation block if comments should
           * be optional.
           */
          if (!comments) {
            $error.text(
              'Please enter a comment before submitting.'
            );

            $widget
              .find('.ai-feedback-comments-input')
              .trigger('focus');

            return;
          }

          $error.text('');

          assignSessionVar(
            'ai_feedback',
            'thumbs_down'
          );

          assignSessionVar(
            'ai_feedback_comments',
            comments
          );

          showThankYou($widget, 'thumbs_down');
        }
      );
    });
  });
})();
</script>

## COSMETIC / EDITOR-ONLY CHANGES (0) — ignore

  (none)

## LINE-LEVEL BODY DIFFS (2)

### node 26 — Build case review dashboard (script code)

```diff
--- before/node 26 content
+++ after/node 26 content
@@ -11,8 +11,6 @@
 let requester_type = ZT.getVariableValue("hc_requester_type", "driver");
 let response_variant = ZT.getVariableValue("hc_response_variant", "");
 let copy_approved = ZT.getVariableValue("hc_copy_approved", true);
-let energy_supplier = ZT.getVariableValue("sf_Energy_Supplier__c", "");
-let data_provider = ZT.getVariableValue("sf_Data_Provider__c", "");
 let manual_changes_reason = ZT.getVariableValue("hc_manual_changes_reason", "");
 
 // --- shared helpers -----------------------------------------------------------
@@ -162,20 +160,6 @@
             <h3 class="case-review-card-title">Subtopics found</h3>
             ${renderIntentPills()}
           </div>
-          <div class="case-review-card">
-            <h3 class="case-review-card-title">Salesforce fields to set</h3>
-            <div class="zt-form-grid">
-              <div class="zt-form-field">
-                <label for="sf_Energy_Supplier__c" class="zt-form-label">Energy supplier</label>
-                <input type="text" id="sf_Energy_Supplier__c" name="sf_Energy_Supplier__c" data-name="sf_Energy_Supplier__c" class="zt-data zt-form-control" value="${escapeHtml(energy_supplier)}" />
-              </div>
-              <div class="zt-form-field">
-                <label for="sf_Data_Provider__c" class="zt-form-label">Data provider</label>
-                <input type="text" id="sf_Data_Provider__c" name="sf_Data_Provider__c" data-name="sf_Data_Provider__c" class="zt-data zt-form-control" value="${escapeHtml(data_provider)}" />
-              </div>
-            </div>
-            <div class="zt-form-help">These post to the case on the same request that sends the reply. The API names are placeholders until Corpay confirms them (OPEN ITEM #4).</div>
-          </div>
         </div>
         <div class="case-review-col case-review-col-right">
           ${renderManualEditNotice()}
```

### node 48 — claude.md (content)

```diff
--- before/node 48 content
+++ after/node 48 content
@@ -139,9 +139,11 @@
 - sf_Origin ("Zingtree AI"), hc_template_key, hc_copy_approved - nodes 15 / 24.
 - hc_manual_changes_required (bool), hc_manual_changes_reason - node 24. The boolean is router
   31's first test; the reason is printed on the dashboard by node 26.
-- sf_Energy_Supplier__c, sf_Data_Provider__c - dashboard inputs on screen 30 (Homecharge lane
-  only). Named for the Salesforce field so the send-email composite picks them up the way every
-  other sf_* field does. The API names are placeholders - OPEN ITEM #4.
+- sf_Energy_Provider__c, sf_Data_Provider__c - native selects on screen 51 (Homecharge lane
+  only), seeded by node 50 from the case. Named for the Salesforce fields Energy_Provider__c and
+  Data_Provider__c, confirmed by Corpay UK 2026-09-16, so the Case update picks them up the way
+  every other sf_* field does. They were free-text boxes on the dashboard named
+  sf_Energy_Supplier__c / sf_Data_Provider__c until then.
 - escalation_html - node 27 -> screen 28.
 - HtmlBody, sf_Topic__c, sf_Sub_Topic__c, has_multiple_intents, case_review_html,
   request_form_html, multiple_subtopics_form_html - node 17 or 26. The first three are overwritten
@@ -243,11 +245,16 @@
   field name at [line:1, column:3]" (org 123, 2026-09-15). The sandbox never caught it because
   the placeholder endpoint never parsed anything.
 - OPEN ITEM #9 - the Case update does NOT ride in this request. CO 187's template carries no
-  caseId and no caseFields, so Topic__c, Sub_Topic__c, Origin, Energy_Supplier__c and
-  Data_Provider__c are collected on the dashboard and then dropped. The caseFieldRegistry that
-  used to live in node 36 fed nothing and has been removed. Decide with Corpay UK whether those
-  fields get added to CO 187's template or a separate Case update Connected Object, then put the
-  registry back wherever that lands. Until then the send works and the Case fields do not update.
+  caseId and no caseFields, so Topic__c, Sub_Topic__c, Origin, Energy_Provider__c and
+  Data_Provider__c are collected and then dropped. The caseFieldRegistry that used to live in
+  node 36 fed nothing and has been removed. Two Connected Object edits close this, both outside
+  the tree: CO 187's template needs caseId plus a caseFields block reading ${sf_Topic__c},
+  ${sf_Sub_Topic__c}, ${sf_Origin}, ${sf_Energy_Provider__c} and ${sf_Data_Provider__c} (or a
+  separate Case update object carrying the same), and CO 1263's SOQL needs Energy_Provider__c and
+  Data_Provider__c added so node 50 can pre-select them. Corpay UK also has to restore field-level
+  access on both provider fields - Alex Godfrey, 2026-09-16, pending Joanna. Until all three land
+  the send works, the selects open empty and the Case fields do not update. Nothing in the tree
+  breaks in the meantime.
 - An AI Action node carries its own config, separate from the AI Action it points at:
   config "{\"mode\":\"api\",\"instruction\":\"\"}". mode "api" is the one-shot call that writes to
   actions.<alias> and follows the continuation; any other mode renders an interactive panel and
@@ -291,10 +298,15 @@
 - Scoring nodes carry advanced_logic_node "1" and mark their else branch with op "def". With
   advanced_logic_node "0" the editor opens the node in Simple mode, shows empty
   Variable / Operator / Value fields and ignores logic_expression entirely.
-- Client-side JS in script_code (request-details validation, rich editor sync, AI feedback widget)
-  was byte-identical in all three source trees and is carried over unchanged. It calls
-  do_button_click(8, ...) for the AI feedback widget - a source-tree button reference that has
-  never been verified live, and node numbers moved in this merge. Check it on the dashboard screen.
+- THE AI FEEDBACK WIDGET NEVER NAVIGATES. Recording feedback is a client-side state change on
+  the dashboard screen: the thumb writes ai_feedback through assignSessionVar, the widget swaps
+  itself for the thank-you line, and the Yes / No send buttons below it stay live. The ported
+  source called do_button_click(8, ...) on both thumbs, which in this merged tree jumped to node
+  8 (Resolve queue route) and restarted the journey - reported live by Corpay UK on 2026-09-16.
+  Do not reintroduce a node id here: the dashboard is reached from two lanes (17 and 26) and a
+  single hardcoded target is wrong for one of them. The hidden ai_feedback input and the comments
+  textarea are hidden rather than removed so their zt-data values still submit with the screen,
+  and nodes 17 / 26 render the same thank-you server-side when the screen is genuinely rebuilt.
 - The Email node (42) really sends to ZingtreeTeam@allstarcard.co.uk on a failed send. Test Mode
   never reaches it (the mocked send succeeds).
 - Only driver Homecharge copy has been signed off. A fleet run is re-framed by the generation
@@ -326,11 +338,34 @@
   cannot be reached without an edit. Today that is underpayment_response, whose template leaves
   [INSERT UNIT RATE EXCLUDING VAT] for the driver's kWh rate. Nothing is lost by skipping screen
   32: screen 33 carries the Topic and Sub Topic selects too.
+- BOTH PROVIDER FIELDS ARE RESTRICTED PICKLISTS. Salesforce rejects a value that does not match
+  its own list character for character, so node 50 carries the 27 energy and 25 data values
+  verbatim - including the two that read as typos, "SSE Airticity" and "Uknown / Unspecified".
+  Correct either one and the save fails. Source: Corpay UK, 2026-09-16.
+- Screen 51 sits behind router 49 so only the Homecharge lane sees it, and it is reached from
+  "Yes - send email response" on the dashboard, NOT from "No - make manual changes" - Bailey
+  Britton's ask on 2026-09-16 was for it to appear after the send decision, the way Topic and
+  Sub Topic appear after the manual-changes decision. The forced-manual path still passes through
+  it, because router 31 sits after screen 51.
+- Node 50 pre-selects from actions.sfdc_int__case_email_ai.records[0].Energy_Provider__c /
+  .Data_Provider__c. Connected Object 1263's SOQL does not select those two fields yet, so both
+  selects open empty until it does - see OPEN ITEM #9.
 - Bypass gate (node 6) field mapping is OPEN ITEM #1 - confirm with Corpay UK.
 - This tree replaces the router, so import it over the tree id the Salesforce page layout already
   points at. Importing it as a new tree means updating the layout.
 
 ## Changelog
+- 2026-09-16 Claude - the two provider fields moved off the dashboard onto their own screen and
+  became restricted picklists. New nodes: 49 (router, Homecharge lane only), 50 (script, the two
+  option lists plus pre-selection from the case) and 51 (screen, two required native dynamic
+  selects). The dashboard's "Salesforce fields to set" card and its two zt-data text inputs are
+  gone from node 26, and sf_Energy_Supplier__c is renamed sf_Energy_Provider__c to match the real
+  Salesforce field. Node 30's "Yes - send email response" now points at 49 instead of 31.
+- 2026-09-16 Claude - AI feedback no longer restarts the journey. Both do_button_click(8, ...)
+  calls in script_code are gone, along with the formDataUpdated handler that existed only to
+  fire the thumbs-up one; a showThankYou helper swaps the widget in place instead, and
+  .ai-feedback-thankyou is styled. Behaviour now matches FAST Admin: one click, a thank-you
+  line, agent stays on the dashboard with the send buttons.
 - 2026-09-16 Claude - Test Mode mock scope is now a choice. Screen 44 carries test_mock_scope
   (mock_all_requests, the default and the only setting the sandbox can run, or
   mock_case_fetch_only) plus optional test_sf_case_id / test_sf_account_id. Node 47 always
```

## CHANGES THAT NEED AN EXPLANATION

Every line below must map to a requirement or an explicit request.
Anything unexplained is unintended drift — revert it before delivering.

  [ ] added node 49 (Homecharge lane?)
  [ ] added node 50 (Load provider picklists)
  [ ] added node 51 (Confirm energy and data provider)
  [ ] node 26 — script code changed (259 → 243 lines) — Build case review dashboard
  [ ] node 30 — button added/changed: "Yes - send email response" → node 49
  [ ] node 30 — button removed/replaced: "Yes - send email response" → node 31
  [ ] node 48 — content changed (439 → 474 lines) — claude.md
  [ ] tree setting —  predefined_vars: {"0": {"checkbox_score": 1, "config": null, "custom_regex": "", "hidden_value": "", "id": 33997428, "inline": 0, "label": "", "label_type": "", "name": "ai_account_eligibility", "options": "", "project_id": 783808640, "project_node_id": 0, "rank": 0, "required": false, "score_var": "", "scores": "", "type": "predefined"}, "1": {"checkbox_score": 1, "config": null, "custom_regex": "", "hidden_value": "", "id": 33997429, "inline": 0, "label": "", "label_type": "", "name": "ai_bypass_reason", "options": "", "project_id": 783808640, "project_node_id": 0, "rank": 0, "required": false, "score_var": "", "scores": "", "type": "predefined"}, "10": {"checkbox_score": 1, "config": null, "custom_regex": "", "hidden_value": "", "id": 33997438, "inline": 0, "label": "", "label_type": "", "name": "email_analysis_route", "options": "", "project_id": 783808640, "project_node_id": 0, "rank": 0, "required": false, "score_var": "", "scores": "", "type": "predefined"}, "11": {"checkbox_score": 1, "config": null, "custom_regex": "", "hidden_value": "", "id": 33997439, "inline": 0, "label": "", "label_type": "", "name": "sf_Topic__c", "options": "", "project_id": 783808640, "project_node_id": 0, "rank": 0, "required": false, "score_var": "", "scores": "", "type": "predefined"}, "12": {"checkbox_score": 1, "config": null, "custom_regex": "", "hidden_value": "", "id": 33997440, "inline": 0, "label": "", "label_type": "", "name": "sf_Sub_Topic__c", "options": "", "project_id": 783808640, "project_node_id": 0, "rank": 0, "required": false, "score_var": "", "scores": "", "type": "predefined"}, "13": {"checkbox_score": 1, "config": null, "custom_regex": "", "hidden_value": "", "id": 33997441, "inline": 0, "label": "", "label_type": "", "name": "email_intent", "options": "", "project_id": 783808640, "project_node_id": 0, "rank": 0, "required": false, "score_var": "", "scores": "", "type": "predefined"}, "14": {"checkbox_score": 1, "config": null, "custom_regex": "", "hidden_value": "", "id": 33997442, "inline": 0, "label": "", "label_type": "", "name": "escalate_reason", "options": "", "project_id": 783808640, "project_node_id": 0, "rank": 0, "required": false, "score_var": "", "scores": "", "type": "predefined"}, "15": {"checkbox_score": 1, "config": null, "custom_regex": "", "hidden_value": "", "id": 33997443, "inline": 0, "label": "", "label_type": "", "name": "sentiment", "options": "", "project_id": 783808640, "project_node_id": 0, "rank": 0, "required": false, "score_var": "", "scores": "", "type": "predefined"}, "16": {"checkbox_score": 1, "config": null, "custom_regex": "", "hidden_value": "", "id": 33997444, "inline": 0, "label": "", "label_type": "", "name": "confidence_score", "options": "", "project_id": 783808640, "project_node_id": 0, "rank": 0, "required": false, "score_var": "", "scores": "", "type": "predefined"}, "17": {"checkbox_score": 1, "config": null, "custom_regex": "", "hidden_value": "", "id": 33997445, "inline": 0, "label": "", "label_type": "", "name": "unmatched_summary", "options": "", "project_id": 783808640, "project_node_id": 0, "rank": 0, "required": false, "score_var": "", "scores": "", "type": "predefined"}, "18": {"checkbox_score": 1, "config": null, "custom_regex": "", "hidden_value": "", "id": 33997446, "inline": 0, "label": "", "label_type": "", "name": "hc_requester_type", "options": "", "project_id": 783808640, "project_node_id": 0, "rank": 0, "required": false, "score_var": "", "scores": "", "type": "predefined"}, "19": {"checkbox_score": 1, "config": null, "custom_regex": "", "hidden_value": "", "id": 33997447, "inline": 0, "label": "", "label_type": "", "name": "hc_response_variant", "options": "", "project_id": 783808640, "project_node_id": 0, "rank": 0, "required": false, "score_var": "", "scores": "", "type": "predefined"}, "2": {"checkbox_score": 1, "config": null, "custom_regex": "", "hidden_value": "", "id": 33997430, "inline": 0, "label": "", "label_type": "", "name": "queue_source_value", "options": "", "project_id": 783808640, "project_node_id": 0, "rank": 0, "required": false, "score_var": "", "scores": "", "type": "predefined"}, "20": {"checkbox_score": 1, "config": null, "custom_regex": "", "hidden_value": "", "id": 33997448, "inline": 0, "label": "", "label_type": "", "name": "hc_template_key", "options": "", "project_id": 783808640, "project_node_id": 0, "rank": 0, "required": false, "score_var": "", "scores": "", "type": "predefined"}, "21": {"checkbox_score": 1, "config": null, "custom_regex": "", "hidden_value": "", "id": 33997449, "inline": 0, "label": "", "label_type": "", "name": "hc_agent_required", "options": "", "project_id": 783808640, "project_node_id": 0, "rank": 0, "required": false, "score_var": "", "scores": "", "type": "predefined"}, "22": {"checkbox_score": 1, "config": null, "custom_regex": "", "hidden_value": "", "id": 33997450, "inline": 0, "label": "", "label_type": "", "name": "hc_energy_supplier", "options": "", "project_id": 783808640, "project_node_id": 0, "rank": 0, "required": false, "score_var": "", "scores": "", "type": "predefined"}, "23": {"checkbox_score": 1, "config": null, "custom_regex": "", "hidden_value": "", "id": 33997451, "inline": 0, "label": "", "label_type": "", "name": "hc_data_provider", "options": "", "project_id": 783808640, "project_node_id": 0, "rank": 0, "required": false, "score_var": "", "scores": "", "type": "predefined"}, "3": {"checkbox_score": 1, "config": null, "custom_regex": "", "hidden_value": "", "id": 33997431, "inline": 0, "label": "", "label_type": "", "name": "queue_route", "options": "", "project_id": 783808640, "project_node_id": 0, "rank": 0, "required": false, "score_var": "", "scores": "", "type": "predefined"}, "4": {"checkbox_score": 1, "config": null, "custom_regex": "", "hidden_value": "", "id": 33997432, "inline": 0, "label": "", "label_type": "", "name": "queue_route_label", "options": "", "project_id": 783808640, "project_node_id": 0, "rank": 0, "required": false, "score_var": "", "scores": "", "type": "predefined"}, "5": {"checkbox_score": 1, "config": null, "custom_regex": "", "hidden_value": "", "id": 33997433, "inline": 0, "label": "", "label_type": "", "name": "sf_Id", "options": "", "project_id": 783808640, "project_node_id": 0, "rank": 0, "required": false, "score_var": "", "scores": "", "type": "predefined"}, "6": {"checkbox_score": 1, "config": null, "custom_regex": "", "hidden_value": "", "id": 33997434, "inline": 0, "label": "", "label_type": "", "name": "sf_Subject", "options": "", "project_id": 783808640, "project_node_id": 0, "rank": 0, "required": false, "score_var": "", "scores": "", "type": "predefined"}, "7": {"checkbox_score": 1, "config": null, "custom_regex": "", "hidden_value": "", "id": 33997435, "inline": 0, "label": "", "label_type": "", "name": "sf_CaseNumber", "options": "", "project_id": 783808640, "project_node_id": 0, "rank": 0, "required": false, "score_var": "", "scores": "", "type": "predefined"}, "8": {"checkbox_score": 1, "config": null, "custom_regex": "", "hidden_value": "", "id": 33997436, "inline": 0, "label": "", "label_type": "", "name": "sf_ContactId", "options": "", "project_id": 783808640, "project_node_id": 0, "rank": 0, "required": false, "score_var": "", "scores": "", "type": "predefined"}, "9": {"checkbox_score": 1, "config": null, "custom_regex": "", "hidden_value": "", "id": 33997437, "inline": 0, "label": "", "label_type": "", "name": "intent_in_scope", "options": "", "project_id": 783808640, "project_node_id": 0, "rank": 0, "required": false, "score_var": "", "scores": "", "type": "predefined"}} → {"0": {"checkbox_score": 1, "config": null, "custom_regex": "", "hidden_value": "", "id": 33997428, "inline": 0, "label": "", "label_type": "", "name": "ai_account_eligibility", "options": "", "project_id": 783808640, "project_node_id": 0, "rank": 0, "required": false, "score_var": "", "scores": "", "type": "predefined"}, "1": {"checkbox_score": 1, "config": null, "custom_regex": "", "hidden_value": "", "id": 33997429, "inline": 0, "label": "", "label_type": "", "name": "ai_bypass_reason", "options": "", "project_id": 783808640, "project_node_id": 0, "rank": 0, "required": false, "score_var": "", "scores": "", "type": "predefined"}, "10": {"checkbox_score": 1, "config": null, "custom_regex": "", "hidden_value": "", "id": 33997438, "inline": 0, "label": "", "label_type": "", "name": "email_analysis_route", "options": "", "project_id": 783808640, "project_node_id": 0, "rank": 0, "required": false, "score_var": "", "scores": "", "type": "predefined"}, "11": {"checkbox_score": 1, "config": null, "custom_regex": "", "hidden_value": "", "id": 33997439, "inline": 0, "label": "", "label_type": "", "name": "sf_Topic__c", "options": "", "project_id": 783808640, "project_node_id": 0, "rank": 0, "required": false, "score_var": "", "scores": "", "type": "predefined"}, "12": {"checkbox_score": 1, "config": null, "custom_regex": "", "hidden_value": "", "id": 33997440, "inline": 0, "label": "", "label_type": "", "name": "sf_Sub_Topic__c", "options": "", "project_id": 783808640, "project_node_id": 0, "rank": 0, "required": false, "score_var": "", "scores": "", "type": "predefined"}, "13": {"checkbox_score": 1, "config": null, "custom_regex": "", "hidden_value": "", "id": 33997441, "inline": 0, "label": "", "label_type": "", "name": "email_intent", "options": "", "project_id": 783808640, "project_node_id": 0, "rank": 0, "required": false, "score_var": "", "scores": "", "type": "predefined"}, "14": {"checkbox_score": 1, "config": null, "custom_regex": "", "hidden_value": "", "id": 33997442, "inline": 0, "label": "", "label_type": "", "name": "escalate_reason", "options": "", "project_id": 783808640, "project_node_id": 0, "rank": 0, "required": false, "score_var": "", "scores": "", "type": "predefined"}, "15": {"checkbox_score": 1, "config": null, "custom_regex": "", "hidden_value": "", "id": 33997443, "inline": 0, "label": "", "label_type": "", "name": "sentiment", "options": "", "project_id": 783808640, "project_node_id": 0, "rank": 0, "required": false, "score_var": "", "scores": "", "type": "predefined"}, "16": {"checkbox_score": 1, "config": null, "custom_regex": "", "hidden_value": "", "id": 33997444, "inline": 0, "label": "", "label_type": "", "name": "confidence_score", "options": "", "project_id": 783808640, "project_node_id": 0, "rank": 0, "required": false, "score_var": "", "scores": "", "type": "predefined"}, "17": {"checkbox_score": 1, "config": null, "custom_regex": "", "hidden_value": "", "id": 33997445, "inline": 0, "label": "", "label_type": "", "name": "unmatched_summary", "options": "", "project_id": 783808640, "project_node_id": 0, "rank": 0, "required": false, "score_var": "", "scores": "", "type": "predefined"}, "18": {"checkbox_score": 1, "config": null, "custom_regex": "", "hidden_value": "", "id": 33997446, "inline": 0, "label": "", "label_type": "", "name": "hc_requester_type", "options": "", "project_id": 783808640, "project_node_id": 0, "rank": 0, "required": false, "score_var": "", "scores": "", "type": "predefined"}, "19": {"checkbox_score": 1, "config": null, "custom_regex": "", "hidden_value": "", "id": 33997447, "inline": 0, "label": "", "label_type": "", "name": "hc_response_variant", "options": "", "project_id": 783808640, "project_node_id": 0, "rank": 0, "required": false, "score_var": "", "scores": "", "type": "predefined"}, "2": {"checkbox_score": 1, "config": null, "custom_regex": "", "hidden_value": "", "id": 33997430, "inline": 0, "label": "", "label_type": "", "name": "queue_source_value", "options": "", "project_id": 783808640, "project_node_id": 0, "rank": 0, "required": false, "score_var": "", "scores": "", "type": "predefined"}, "20": {"checkbox_score": 1, "config": null, "custom_regex": "", "hidden_value": "", "id": 33997448, "inline": 0, "label": "", "label_type": "", "name": "hc_template_key", "options": "", "project_id": 783808640, "project_node_id": 0, "rank": 0, "required": false, "score_var": "", "scores": "", "type": "predefined"}, "21": {"checkbox_score": 1, "config": null, "custom_regex": "", "hidden_value": "", "id": 33997449, "inline": 0, "label": "", "label_type": "", "name": "hc_agent_required", "options": "", "project_id": 783808640, "project_node_id": 0, "rank": 0, "required": false, "score_var": "", "scores": "", "type": "predefined"}, "22": {"checkbox_score": 1, "config": null, "custom_regex": "", "hidden_value": "", "id": 33997450, "inline": 0, "label": "", "label_type": "", "name": "sf_Energy_Provider__c", "options": "", "project_id": 783808640, "project_node_id": 0, "rank": 0, "required": false, "score_var": "", "scores": "", "type": "predefined"}, "23": {"checkbox_score": 1, "config": null, "custom_regex": "", "hidden_value": "", "id": 33997451, "inline": 0, "label": "", "label_type": "", "name": "sf_Data_Provider__c", "options": "", "project_id": 783808640, "project_node_id": 0, "rank": 0, "required": false, "score_var": "", "scores": "", "type": "predefined"}, "3": {"checkbox_score": 1, "config": null, "custom_regex": "", "hidden_value": "", "id": 33997431, "inline": 0, "label": "", "label_type": "", "name": "queue_route", "options": "", "project_id": 783808640, "project_node_id": 0, "rank": 0, "required": false, "score_var": "", "scores": "", "type": "predefined"}, "4": {"checkbox_score": 1, "config": null, "custom_regex": "", "hidden_value": "", "id": 33997432, "inline": 0, "label": "", "label_type": "", "name": "queue_route_label", "options": "", "project_id": 783808640, "project_node_id": 0, "rank": 0, "required": false, "score_var": "", "scores": "", "type": "predefined"}, "5": {"checkbox_score": 1, "config": null, "custom_regex": "", "hidden_value": "", "id": 33997433, "inline": 0, "label": "", "label_type": "", "name": "sf_Id", "options": "", "project_id": 783808640, "project_node_id": 0, "rank": 0, "required": false, "score_var": "", "scores": "", "type": "predefined"}, "6": {"checkbox_score": 1, "config": null, "custom_regex": "", "hidden_value": "", "id": 33997434, "inline": 0, "label": "", "label_type": "", "name": "sf_Subject", "options": "", "project_id": 783808640, "project_node_id": 0, "rank": 0, "required": false, "score_var": "", "scores": "", "type": "predefined"}, "7": {"checkbox_score": 1, "config": null, "custom_regex": "", "hidden_value": "", "id": 33997435, "inline": 0, "label": "", "label_type": "", "name": "sf_CaseNumber", "options": "", "project_id": 783808640, "project_node_id": 0, "rank": 0, "required": false, "score_var": "", "scores": "", "type": "predefined"}, "8": {"checkbox_score": 1, "config": null, "custom_regex": "", "hidden_value": "", "id": 33997436, "inline": 0, "label": "", "label_type": "", "name": "sf_ContactId", "options": "", "project_id": 783808640, "project_node_id": 0, "rank": 0, "required": false, "score_var": "", "scores": "", "type": "predefined"}, "9": {"checkbox_score": 1, "config": null, "custom_regex": "", "hidden_value": "", "id": 33997437, "inline": 0, "label": "", "label_type": "", "name": "intent_in_scope", "options": "", "project_id": 783808640, "project_node_id": 0, "rank": 0, "required": false, "score_var": "", "scores": "", "type": "predefined"}}
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
   * Supports both:
   *
   * 1. Standard Request Details form
   *    - sf_Topic__c
   *    - sf_Sub_Topic__c
   *
   * 2. Multiple Subtopics form
   *    - sf_Sub_Topic__c only
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

/* Thumbs-down comments section */
.ai-feedback-comments {
  display: none;
  margin-top: 16px;
  padding: 16px;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 10px;
}

.ai-feedback-comments.is-visible {
  display: block;
}

.ai-feedback-comments-label {
  display: block;
  margin-bottom: 8px;
  font-size: 14px;
  font-weight: 600;
  color: #374151;
}

.ai-feedback-comments-input {
  box-sizing: border-box;
  width: 100%;
  min-height: 110px;
  padding: 10px 12px;
  font-family: inherit;
  font-size: 14px;
  line-height: 1.5;
  color: #111827;
  background: #ffffff;
  border: 1px solid #cbd5e1;
  border-radius: 8px;
  resize: vertical;
}

.ai-feedback-comments-input:focus {
  outline: none;
  border-color: #2563eb;
  box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.15);
}

.ai-feedback-comments-error {
  min-height: 18px;
  margin-top: 6px;
  font-size: 12px;
  color: #b91c1c;
}

.ai-feedback-submit {
  margin-top: 8px;
  min-height: 42px;
  padding: 9px 16px;
  color: #ffffff;
  font-size: 14px;
  font-weight: 600;
  background: #1f2937;
  border: 0;
  border-radius: 8px;
  cursor: pointer;
}

.ai-feedback-submit:hover {
  background: #111827;
}

.ai-feedback-submit:focus {
  outline: none;
  box-shadow: 0 0 0 3px rgba(31, 41, 55, 0.2);
}

</style>

<script>
(function () {
  /**
   * Shows or hides the thumbs-down comments section.
   */
  function setCommentsVisibility($widget, shouldShow) {
    var $comments = $widget.find('.ai-feedback-comments');

    $comments
      .toggleClass('is-visible', shouldShow)
      .attr('aria-hidden', shouldShow ? 'false' : 'true');

    if (shouldShow) {
      window.setTimeout(function () {
        $comments.find('.ai-feedback-comments-input').trigger('focus');
      }, 0);
    }
  }

  whenEvent('render:finish', function () {
    var $widgets = jQuery('.ai-feedback-wrap');

    if (!$widgets.length) return;

    $widgets.each(function () {
      var $widget = jQuery(this);

      if ($widget.data('ai-feedback-bound')) return;
      $widget.data('ai-feedback-bound', true);

      /*
       * Handle thumbs-up and thumbs-down selection.
       */
      $widget.on('click', '.ai-feedback-btn', function () {
        var $btn = jQuery(this);
        var feedbackValue = $btn.attr('data-feedback');
        var $hidden = $widget.find(
          'input[name="ai_feedback"]'
        );
        var $commentsInput = $widget.find(
          'textarea[name="ai_feedback_comments"]'
        );
        var $error = $widget.find(
          '.ai-feedback-comments-error'
        );

        // Highlight the selected thumb.
        $widget
          .find('.ai-feedback-btn')
          .removeClass('selected');

        $btn.addClass('selected');

        // Update the hidden Zingtree form-data field.
        $hidden.val(feedbackValue);

        // Clear any previous validation message.
        $error.text('');

        if (feedbackValue === 'thumbs_down') {
          /*
           * Stay on this screen and allow the user to explain
           * why the generated email was not helpful.
           */
          setCommentsVisibility($widget, true);
        } else {
          /*
           * Hide and clear comments if the user changes their
           * selection from thumbs-down to thumbs-up.
           */
          setCommentsVisibility($widget, false);
          $commentsInput.val('');

          assignSessionVar(
            'ai_feedback_comments',
            ''
          );
        }

        assignSessionVar(
          'ai_feedback',
          feedbackValue
        );
      });

      /*
       * Keep ai_feedback_comments synchronized while typing.
       */
      $widget.on(
        'input',
        '.ai-feedback-comments-input',
        function () {
          var comments = jQuery(this).val();

          assignSessionVar(
            'ai_feedback_comments',
            comments
          );

          $widget
            .find('.ai-feedback-comments-error')
            .text('');
        }
      );

      /*
       * Submit the thumbs-down feedback after comments
       * have been entered.
       */
      $widget.on(
        'click',
        '.ai-feedback-submit',
        function () {
          var comments = String(
            $widget
              .find('.ai-feedback-comments-input')
              .val() || ''
          ).trim();

          var $error = $widget.find(
            '.ai-feedback-comments-error'
          );

          /*
           * Remove this validation block if comments should
           * be optional.
           */
          if (!comments) {
            $error.text(
              'Please enter a comment before submitting.'
            );

            $widget
              .find('.ai-feedback-comments-input')
              .trigger('focus');

            return;
          }

          $error.text('');

          assignSessionVar(
            'ai_feedback',
            'thumbs_down'
          );

          assignSessionVar(
            'ai_feedback_comments',
            comments
          );

          do_button_click(
            8,
            null,
            'AI feedback submitted',
            'thumbs_down'
          );
        }
      );
    });
  });

  whenEvent('formDataUpdated', function (changes) {
    if (!changes || typeof changes !== 'object') return;

    if (
      !Object.prototype.hasOwnProperty.call(
        changes,
        'ai_feedback'
      )
    ) {
      return;
    }

    var feedbackValue = changes.ai_feedback;

    /*
     * Thumbs-up can continue immediately.
     *
     * Thumbs-down remains on the current screen so the user
     * can enter ai_feedback_comments. Navigation occurs from
     * the Submit feedback button instead.
     */
    if (feedbackValue === 'thumbs_up') {
      do_button_click(
        8,
        null,
        'AI feedback',
        feedbackValue
      );
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
   * Supports both:
   *
   * 1. Standard Request Details form
   *    - sf_Topic__c
   *    - sf_Sub_Topic__c
   *
   * 2. Multiple Subtopics form
   *    - sf_Sub_Topic__c only
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

.ai-feedback-thankyou {
  margin-top: 4px;
  font-size: 15px;
  font-weight: 600;
  line-height: 1.4;
  color: #166534;
}

/* Thumbs-down comments section */
.ai-feedback-comments {
  display: none;
  margin-top: 16px;
  padding: 16px;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 10px;
}

.ai-feedback-comments.is-visible {
  display: block;
}

.ai-feedback-comments-label {
  display: block;
  margin-bottom: 8px;
  font-size: 14px;
  font-weight: 600;
  color: #374151;
}

.ai-feedback-comments-input {
  box-sizing: border-box;
  width: 100%;
  min-height: 110px;
  padding: 10px 12px;
  font-family: inherit;
  font-size: 14px;
  line-height: 1.5;
  color: #111827;
  background: #ffffff;
  border: 1px solid #cbd5e1;
  border-radius: 8px;
  resize: vertical;
}

.ai-feedback-comments-input:focus {
  outline: none;
  border-color: #2563eb;
  box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.15);
}

.ai-feedback-comments-error {
  min-height: 18px;
  margin-top: 6px;
  font-size: 12px;
  color: #b91c1c;
}

.ai-feedback-submit {
  margin-top: 8px;
  min-height: 42px;
  padding: 9px 16px;
  color: #ffffff;
  font-size: 14px;
  font-weight: 600;
  background: #1f2937;
  border: 0;
  border-radius: 8px;
  cursor: pointer;
}

.ai-feedback-submit:hover {
  background: #111827;
}

.ai-feedback-submit:focus {
  outline: none;
  box-shadow: 0 0 0 3px rgba(31, 41, 55, 0.2);
}

</style>

<script>
(function () {
  /**
   * Shows or hides the thumbs-down comments section.
   */
  function setCommentsVisibility($widget, shouldShow) {
    var $comments = $widget.find('.ai-feedback-comments');

    $comments
      .toggleClass('is-visible', shouldShow)
      .attr('aria-hidden', shouldShow ? 'false' : 'true');

    if (shouldShow) {
      window.setTimeout(function () {
        $comments.find('.ai-feedback-comments-input').trigger('focus');
      }, 0);
    }
  }

  /**
   * Swaps the widget into its thank-you state in place. The agent stays
   * on the screen they were on and the send buttons below are untouched.
   * The hidden ai_feedback input and the comments textarea are hidden
   * rather than removed, so their zt-data values still submit with the
   * screen.
   */
  function showThankYou($widget, feedbackValue) {
    var message =
      feedbackValue === 'thumbs_up'
        ? '&#128077; Thanks for your feedback!'
        : '&#128078; Thanks for your feedback - we\'ll use it to improve.';

    $widget
      .find('.ai-feedback-label, .ai-feedback-buttons')
      .hide();

    $widget
      .find('.ai-feedback-comments')
      .removeClass('is-visible')
      .attr('aria-hidden', 'true')
      .hide();

    var $thanks = $widget.find('.ai-feedback-thankyou');

    if (!$thanks.length) {
      $thanks = jQuery(
        '<div class="ai-feedback-thankyou"></div>'
      ).appendTo($widget);
    }

    $thanks.html(message);
  }

  whenEvent('render:finish', function () {
    var $widgets = jQuery('.ai-feedback-wrap');

    if (!$widgets.length) return;

    $widgets.each(function () {
      var $widget = jQuery(this);

      if ($widget.data('ai-feedback-bound')) return;
      $widget.data('ai-feedback-bound', true);

      /*
       * Handle thumbs-up and thumbs-down selection.
       */
      $widget.on('click', '.ai-feedback-btn', function () {
        var $btn = jQuery(this);
        var feedbackValue = $btn.attr('data-feedback');
        var $hidden = $widget.find(
          'input[name="ai_feedback"]'
        );
        var $commentsInput = $widget.find(
          'textarea[name="ai_feedback_comments"]'
        );
        var $error = $widget.find(
          '.ai-feedback-comments-error'
        );

        // Highlight the selected thumb.
        $widget
          .find('.ai-feedback-btn')
          .removeClass('selected');

        $btn.addClass('selected');

        // Update the hidden Zingtree form-data field.
        $hidden.val(feedbackValue);

        // Clear any previous validation message.
        $error.text('');

        if (feedbackValue === 'thumbs_down') {
          /*
           * Stay on this screen and allow the user to explain
           * why the generated email was not helpful.
           */
          setCommentsVisibility($widget, true);
        } else {
          /*
           * Hide and clear comments if the user changes their
           * selection from thumbs-down to thumbs-up.
           */
          setCommentsVisibility($widget, false);
          $commentsInput.val('');

          assignSessionVar(
            'ai_feedback_comments',
            ''
          );
        }

        assignSessionVar(
          'ai_feedback',
          feedbackValue
        );

        if (feedbackValue === 'thumbs_up') {
          showThankYou($widget, feedbackValue);
        }
      });

      /*
       * Keep ai_feedback_comments synchronized while typing.
       */
      $widget.on(
        'input',
        '.ai-feedback-comments-input',
        function () {
          var comments = jQuery(this).val();

          assignSessionVar(
            'ai_feedback_comments',
            comments
          );

          $widget
            .find('.ai-feedback-comments-error')
            .text('');
        }
      );

      /*
       * Submit the thumbs-down feedback after comments
       * have been entered.
       */
      $widget.on(
        'click',
        '.ai-feedback-submit',
        function () {
          var comments = String(
            $widget
              .find('.ai-feedback-comments-input')
              .val() || ''
          ).trim();

          var $error = $widget.find(
            '.ai-feedback-comments-error'
          );

          /*
           * Remove this validation block if comments should
           * be optional.
           */
          if (!comments) {
            $error.text(
              'Please enter a comment before submitting.'
            );

            $widget
              .find('.ai-feedback-comments-input')
              .trigger('focus');

            return;
          }

          $error.text('');

          assignSessionVar(
            'ai_feedback',
            'thumbs_down'
          );

          assignSessionVar(
            'ai_feedback_comments',
            comments
          );

          showThankYou($widget, 'thumbs_down');
        }
      );
    });
  });
})();
</script>

