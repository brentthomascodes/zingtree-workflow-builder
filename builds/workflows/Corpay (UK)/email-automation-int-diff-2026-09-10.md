========================================================================
WORKFLOW DIFF — Email Automation - INT
========================================================================

Before : brent_int_baseline.json  (20 nodes)
After  : Email Automation - INT (v4 draft).json  (36 nodes)

## PLAIN SUMMARY

0 of 36 nodes are byte-for-byte identical to the original (0% untouched).
16 nodes added, 0 removed, 0 renumbered, 20 modified.

In plain terms:
  + NEW      node 21 — Make manual changes [Content]
  + NEW      node 22 — Mock mode? [Scoring]
  + NEW      node 23 — Get incoming email addresses [Data]
  + NEW      node 24 — Build email payload [Script]
  + NEW      node 25 — Mock mode before send? [Scoring]
  + NEW      node 26 — Send email to customer [Data]
  + NEW      node 27 — Grade email send [Script]
  + NEW      node 28 — Email sent? [Scoring]
  + NEW      node 29 — Email sent [Content]
  + NEW      node 30 — Notify team of failed send [Email]
  + NEW      node 31 — Email to customer failed [Content]
  + NEW      node 32 — Test mode - pick a scenario [Content]
  + NEW      node 33 — Load example email [Script]
  + NEW      node 34 — Test mode - review or edit the email [Content]
  + NEW      node 35 — Seed mocked Salesforce data [Script]
  + NEW      node 36 — claude.md [Content]
  * CHANGED  node 1 — Start [Content]
               - page_title: "Start Node" → "Start"
               - node_name: "" → "Entry point: run against Salesforce, or open Test Mode to run on mocked data"
               - content changed (0 → 169 characters) — Start
               - button added/changed: "Process this case" → node 2
               - button added/changed: "Test Mode (QA)" → node 32
               - button removed/replaced: "No Title" → node 2
               - button removed/replaced: "Test Mode (QA)" → node 17
  * CHANGED  node 2 — Get case and inbound email [Data]
               - Script → Data (Get case and inbound email)
               - page_title: "New Node" → "Get case and inbound email"
               - node_name: "" → "Fetch the Salesforce Case (subject, description = inbound email, account, contact)"
  * CHANGED  node 3 — Account linked to case? [Scoring]
               - page_title: "New Node" → "Account linked to case?"
               - node_name: "" → "Mock mode skips the account fetch; a case with no AccountId stops here"
               - continuation_node_id: 0 → 4 — Account linked to case?
               - button added/changed: "mock == "1"" → node 6 [logic: mock == "1"]
               - button added/changed: "actions.sfdc_int__case_email_ai.records[0].AccountId != null" → node 5 [logic: actions.sfdc_int__case_email_ai.records[0].AccountId != null]
               - button added/changed: "" → node 4
               - button removed/replaced: "actions.ALIAS?.records[0]?.AccountId != null" → node 4
               - button removed/replaced: "" → node 0
  * CHANGED  node 4 — No account linked to the case [Content]
               - Data → Content (No account linked to the case)
               - page_title: "Get Account Details" → "No account linked to the case"
               - node_name: "" → "Agent links the Account in Salesforce and retries the fetch"
               - content changed (44 → 36 characters) — No account linked to the case
               - continuation_node_id: 5 → 0 — No account linked to the case
               - button added/changed: "Account was linked - try again" → node 2
  * CHANGED  node 5 — Get account details [Data]
               - Script → Data (Get account details)
               - page_title: "Check AI Eligibility for Acct" → "Get account details"
               - node_name: "" → "Fetch Framework__c, Account_Segment__c and AS_Account_Administrator__c for the eligibility check"
               - content changed (93 → 0 characters) — Get account details
  * CHANGED  node 6 — Check AI eligibility [Script]
               - Scoring → Script (Check AI eligibility)
               - page_title: "Is Acct AI Eligible?" → "Check AI eligibility"
               - node_name: "" → "Account rules (framework, segment, administrator) plus the Phase 1 bypass gate; sets ai_account_eligibility"
               - script code changed (0 → 32 lines) — Check AI eligibility
               - button removed/replaced: "ai_account_eligibility" → node 8
               - button removed/replaced: "" → node 7
  * CHANGED  node 7 — Account AI eligible? [Scoring]
               - Content → Scoring (Account AI eligible?)
               - page_title: "Not AI Eligible" → "Account AI eligible?"
               - node_name: "" → "Route eligible cases to intent detection, everything else to the not-eligible screen"
               - content changed (12 → 0 characters) — Account AI eligible?
               - continuation_node_id: 0 → 8 — Account AI eligible?
               - button added/changed: "ai_account_eligibility == true" → node 9 [logic: ai_account_eligibility == true]
               - button added/changed: "ai_account_eligibility == false" → node 8 [logic: ai_account_eligibility == false]
               - button added/changed: "" → node 8
               - advanced_logic_node: 0 → 1
  * CHANGED  node 8 — Account not eligible for AI [Content]
               - AI_Action → Content (Account not eligible for AI)
               - page_title: "Determin Email Intent" → "Account not eligible for AI"
               - node_name: "" → "Terminal: shows why the case is not handled by the AI"
               - content changed (0 → 472 characters) — Account not eligible for AI
               - continuation_node_id: 9 → 0 — Account not eligible for AI
               - config: {"mode": "api", "instruction": ""} → (empty)
  * CHANGED  node 9 — Detect email intent [AI_Action]
               - Script → AI_Action (Detect email intent)
               - page_title: "Intent Automation" → "Detect email intent"
               - node_name: "" → "AI Action automate_email_intent_int: intents, sentiment, confidence, escalation"
               - content changed (120 → 0 characters) — Detect email intent
               - ai_action_id: 0 → 93
               - config: (empty) → {"mode": "api", "instruction": ""}
  * CHANGED  node 10 — Grade intent result [Script]
               - Scoring → Script (Grade intent result)
               - page_title: "Email Analysis Logic" → "Grade intent result"
               - node_name: "" → "Reads the intent AI Action; sets email_intent, sentiment, escalate_reason and email_analysis_route"
               - script code changed (0 → 16 lines) — Grade intent result
               - continuation_node_id: 13 → 11 — Grade intent result
               - button removed/replaced: "email_analysis_route" → node 11
               - button removed/replaced: "email_analysis_route" → node 12
               - button removed/replaced: "" → node 13
  * CHANGED  node 11 — Email analysis route [Scoring]
               - Script → Scoring (Email analysis route)
               - page_title: "Escalation Logic" → "Email analysis route"
               - node_name: "" → "escalation -> notice, in_scope -> generate the reply, anything else -> not automated"
               - content changed (4 → 0 lines) — Email analysis route
               - button added/changed: "email_analysis_route == "escalation"" → node 12 [logic: email_analysis_route == "escalation"]
               - button added/changed: "email_analysis_route == "in_scope"" → node 15 [logic: email_analysis_route == "in_scope"]
               - button added/changed: "" → node 14
               - advanced_logic_node: 0 → 1
  * CHANGED  node 12 — Build escalation notice [Script]
               - page_title: "Set Variables" → "Build escalation notice"
               - node_name: "" → "One notice per escalate_reason (replaces four content nodes); sets escalation_html"
               - script code changed (0 → 18 lines) — Build escalation notice
               - continuation_node_id: 15 → 13 — Build escalation notice
  * CHANGED  node 13 — Escalation notice [Content]
               - page_title: "Case Is Not Automated" → "Escalation notice"
               - node_name: "" → "Terminal: agent works the case by hand; text staged by the previous script"
               - content changed (128 → 18 characters) — Escalation notice
  * CHANGED  node 14 — Case is not automated [Content]
               - page_title: "Escalation Notice" → "Case is not automated"
               - node_name: "" → "Terminal: detected intent is out of scope for AI email generation"
               - content changed (18 → 129 characters) — Case is not automated
  * CHANGED  node 15 — Set case origin [Script]
               - AI_Action → Script (Set case origin)
               - page_title: "New Node" → "Set case origin"
               - node_name: "" → "Stamps sf_Origin = Zingtree AI before the reply is generated"
               - script code changed (0 → 2 lines) — Set case origin
               - config: {"mode": "api", "instruction": ""} → (empty)
  * CHANGED  node 16 — Generate email response [AI_Action]
               - Script → AI_Action (Generate email response)
               - page_title: "Handle response" → "Generate email response"
               - node_name: "" → "AI Action automate_email_generation_int: drafts the customer reply as HTML"
               - content changed (107 → 0 characters) — Generate email response
               - continuation_node_id: 0 → 17 — Generate email response
               - ai_action_id: 0 → 94
               - config: (empty) → {"mode": "api", "instruction": ""}
  * CHANGED  node 17 — Build case review dashboard [Script]
               - Content → Script (Build case review dashboard)
               - page_title: "Test Mode - Select Intent" → "Build case review dashboard"
               - node_name: "Test mode - pick an intent to preview" → "Maps intent -> Topic/Sub Topic, sets HtmlBody, has_multiple_intents, and the dashboard / manual-edit / multi-subtopic HTML"
               - script code changed (1 → 216 lines) — Build case review dashboard
               - continuation_node_id: 0 → 18 — Build case review dashboard
               - button removed/replaced: "Continue" → node 18
               - form field removed: test_intent (select)
  * CHANGED  node 18 — Case review dashboard [Content]
               - Script → Content (Case review dashboard)
               - page_title: "Load Example + Seed Mock Data" → "Case review dashboard"
               - node_name: "Test mode - load example email and seed mock data" → "Agent reviews the AI reply and approves it or edits it"
               - content changed (14 → 1 lines) — Case review dashboard
               - continuation_node_id: 19 → 0 — Case review dashboard
               - button added/changed: "Yes - send email response" → node 19
               - button added/changed: "No - make manual changes" → node 21
  * CHANGED  node 19 — Multiple intents? [Scoring]
               - Content → Scoring (Multiple intents?)
               - page_title: "Test Mode - Review Example Email" → "Multiple intents?"
               - node_name: "Test mode - review example email before continuing" → "Several intents -> agent picks the Sub Topic; mock mode skips the Salesforce fetch"
               - content changed (26 → 0 characters) — Multiple intents?
               - continuation_node_id: 0 → 23 — Multiple intents?
               - button added/changed: "has_multiple_intents == "true"" → node 20 [logic: has_multiple_intents == "true"]
               - button added/changed: "mock == "1"" → node 24 [logic: mock == "1"]
               - button added/changed: "" → node 23
               - button removed/replaced: "Continue to Intent Detection" → node 5
               - advanced_logic_node: 0 → 1
  * CHANGED  node 20 — Choose the Sub Topic [Content]
               - page_title: "claude.md" → "Choose the Sub Topic"
               - node_name: "Build history (claude.md)" → "Agent picks one Salesforce Sub Topic when several intents were detected"
               - content changed (7 → 1 lines) — Choose the Sub Topic
               - button added/changed: "Send Email" → node 22
               - button added/changed: "Make Manual Changes" → node 21

## TREE SHAPE

  node type                before    after    delta
  AI_Action                     2        2       +0
  Content                       7       13       +6
  Data                          1        4       +3
  Email                         0        1       +1
  Scoring                       3        7       +4
  Script                        7        9       +2
  TOTAL                        20       36      +16

  Root node unchanged (node 1).

## STRUCTURAL SANITY

  No broken links introduced.
  NEWLY UNREACHABLE FROM ROOT (1): 36 (claude.md)
    (expected for the unlinked claude.md node — anything else is a stranded path)
  Pre-existing in the BEFORE tree (not caused by this edit): 0 broken link(s), 1 unreachable node(s).

## UNTOUCHED NODES (0)

  (none — every node was modified; if that was not the intent, stop here)

## TREE-LEVEL SETTINGS CHANGED (8)

  css_include: https://zingtree.com/css/custom-css.php?template=default-v2&body_text=44325E&primary=6200EE&secondary=EFE7FC&complement=f5f5f5 → https://assets.zingtree.com/managed/templates/salesforce_2026.css
  data_cache_ttl: 3600 → 36000
  enable_data_logging: 0 → 1
  hide_back_button: 0 → 1
  merge_vars_not_fixed: 0 → 1
  notitle: 0 → 1
  predefined_vars: {"0": {"checkbox_score": 1, "config": null, "custom_regex": "", "hidden_value": "", "id": 33875431, "inline": 0, "label": "", "label_type": "", "name": "ai_account_eligibility", "options": "", "project_id": 783808640, "project_node_id": 0, "rank": 0, "required": false, "score_var": "", "scores": "", "type": "predefined"}, "1": {"checkbox_score": 1, "config": null, "custom_regex": "", "hidden_value": "", "id": 33875784, "inline": 0, "label": "", "label_type": "", "name": "intent_in_scope", "options": "", "project_id": 783808640, "project_node_id": 0, "rank": 0, "required": false, "score_var": "", "scores": "", "type": "predefined"}, "2": {"checkbox_score": 1, "config": null, "custom_regex": "", "hidden_value": "", "id": 33875801, "inline": 0, "label": "", "label_type": "", "name": "email_analysis_route", "options": "", "project_id": 783808640, "project_node_id": 0, "rank": 0, "required": false, "score_var": "", "scores": "", "type": "predefined"}} → {"0": {"checkbox_score": 1, "config": null, "custom_regex": "", "hidden_value": "", "id": 33875431, "inline": 0, "label": "", "label_type": "", "name": "ai_account_eligibility", "options": "", "project_id": 783808640, "project_node_id": 0, "rank": 0, "required": false, "score_var": "", "scores": "", "type": "predefined"}, "1": {"checkbox_score": 1, "config": null, "custom_regex": "", "hidden_value": "", "id": 33875784, "inline": 0, "label": "", "label_type": "", "name": "intent_in_scope", "options": "", "project_id": 783808640, "project_node_id": 0, "rank": 0, "required": false, "score_var": "", "scores": "", "type": "predefined"}, "2": {"checkbox_score": 1, "config": null, "custom_regex": "", "hidden_value": "", "id": 33875801, "inline": 0, "label": "", "label_type": "", "name": "email_analysis_route", "options": "", "project_id": 783808640, "project_node_id": 0, "rank": 0, "required": false, "score_var": "", "scores": "", "type": "predefined"}, "3": {"checkbox_score": 1, "config": null, "custom_regex": "", "hidden_value": "", "id": 785567, "inline": 0, "label": "", "label_type": "", "name": "sf_ContactId", "options": "", "project_id": 783808640, "project_node_id": 0, "rank": 0, "required": false, "score_var": "", "scores": "", "type": "predefined"}, "4": {"checkbox_score": 1, "config": null, "custom_regex": "", "hidden_value": "", "id": 785568, "inline": 0, "label": "", "label_type": "", "name": "sf_CaseNumber", "options": "", "project_id": 783808640, "project_node_id": 0, "rank": 0, "required": false, "score_var": "", "scores": "", "type": "predefined"}, "5": {"checkbox_score": 1, "config": null, "custom_regex": "", "hidden_value": "", "id": 785569, "inline": 0, "label": "", "label_type": "", "name": "sf_Topic__c", "options": "", "project_id": 783808640, "project_node_id": 0, "rank": 0, "required": false, "score_var": "", "scores": "", "type": "predefined"}, "6": {"checkbox_score": 1, "config": null, "custom_regex": "", "hidden_value": "", "id": 785570, "inline": 0, "label": "", "label_type": "", "name": "sf_Sub_Topic__c", "options": "", "project_id": 783808640, "project_node_id": 0, "rank": 0, "required": false, "score_var": "", "scores": "", "type": "predefined"}, "7": {"checkbox_score": 1, "config": null, "custom_regex": "", "hidden_value": "", "id": 785571, "inline": 0, "label": "", "label_type": "", "name": "sf_Id", "options": "", "project_id": 783808640, "project_node_id": 0, "rank": 0, "required": false, "score_var": "", "scores": "", "type": "predefined"}, "8": {"checkbox_score": 1, "config": null, "custom_regex": "", "hidden_value": "", "id": 785572, "inline": 0, "label": "", "label_type": "", "name": "sf_Subject", "options": "", "project_id": 783808640, "project_node_id": 0, "rank": 0, "required": false, "score_var": "", "scores": "", "type": "predefined"}}
  script_code: (empty) → <style>
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
</script>

## COSMETIC / EDITOR-ONLY CHANGES (1) — ignore

  (canvas x/y, sizes, display_order, updated flags on 1 node reference)

## LINE-LEVEL BODY DIFFS (18)

### node 1 — Start (content)

```diff
--- before/node 1 content
+++ after/node 1 content
@@ -0,0 +1 @@
+<p>Email Automation (Allstar / Corpay UK). Continue to process the current case, or open Test Mode to run the workflow on a sample email with mocked Salesforce data.</p>
```

### node 4 — No account linked to the case (content)

```diff
--- before/node 4 content
+++ after/node 4 content
@@ -1 +1 @@
-actions.ALIAS?.records[0]?.AccountId != null
+<p>No Account linked to the Case</p>
```

### node 5 — Get account details (content)

```diff
--- before/node 5 content
+++ after/node 5 content
@@ -1 +0,0 @@
-// Evaluate ai_account_eligibility for the account fetched in node 4; set via ZT.setFormData.
```

### node 6 — Check AI eligibility (script code)

```diff
--- before/node 6 content
+++ after/node 6 content
@@ -0,0 +1,32 @@
+// --- inputs -----------------------------------------------------------------
+let sfCase = actions.sfdc_int__case_email_ai.records[0];
+let account = actions.get_account_details__int.records[0];
+
+// --- account eligibility: no framework, SME/Keyfuels/blank segment, approved admin ---
+const eligibleAdministrators = [
+  "SME Unmanaged", "AS New CMT", "TFC CMT", "TFC NEW CMT", "Fuelcards4u",
+  "TFC 1", "TFC 2", "TFC 3", "TFC 4", "TFC 5", "TFC 6",
+  "TL AS", "TL TFC", "AS HC1", "AS HC2", "AS HC3", "AS HC4", "AS HC5"
+];
+let frameworkEligible = account.Framework__c == null;
+let segmentEligible = account.Account_Segment__c == null
+  || account.Account_Segment__c === "SME"
+  || account.Account_Segment__c === "Keyfuels";
+let administratorEligible = eligibleAdministrators.includes(account.AS_Account_Administrator__c);
+
+// --- pre-AI bypass gate: complaint / corporate / CCS / web or Zingtree origin ---------
+// OPEN ITEM #1: confirm which Case fields carry these flags in Corpay UK Salesforce.
+const bypassOrigins = ["Web", "Zingtree"];
+const bypassKeywords = ["complaint", "corporate", "ccs"];
+let caseText = [sfCase.Origin, sfCase.Business_Process__c, sfCase.Initial_Case_Queue_Name__c, sfCase.Topic__c, sfCase.Sub_Topic__c]
+  .join(" ").toLowerCase();
+let bypassKeyword = bypassKeywords.find(keyword => caseText.includes(keyword));
+let ai_bypass_reason = bypassOrigins.includes(sfCase.Origin)
+  ? `Case origin is ${sfCase.Origin} - AI handling is bypassed in Phase 1`
+  : (bypassKeyword ? `Case is flagged "${bypassKeyword}" - AI handling is bypassed in Phase 1` : "");
+
+let ai_account_eligibility = frameworkEligible && segmentEligible && administratorEligible && ai_bypass_reason === "";
+
+// --- outputs ----------------------------------------------------------------
+ZT.setFormData("ai_account_eligibility", ai_account_eligibility);
+ZT.setFormData("ai_bypass_reason", ai_bypass_reason);
```

### node 7 — Account AI eligible? (content)

```diff
--- before/node 7 content
+++ after/node 7 content
@@ -1 +0,0 @@
-New Node (7)
```

### node 8 — Account not eligible for AI (content)

```diff
--- before/node 8 content
+++ after/node 8 content
@@ -0,0 +1 @@
+<p>Account Not eligible for AI</p><p><strong>Framework</strong>: ${actions.get_account_details__int.records[0].Framework__c}</p><p><strong>Account Segment</strong>: ${actions.get_account_details__int.records[0].Account_Segment__c}</p><p><strong>Account Admin</strong>: ${actions.get_account_details__int.records[0].AS_Account_Administrator__c}</p><p><strong>Acct Eligibility</strong>: ${ai_account_eligibility}</p><p><strong>Bypass reason</strong>: ${ai_bypass_reason}</p>
```

### node 9 — Detect email intent (content)

```diff
--- before/node 9 content
+++ after/node 9 content
@@ -1 +0,0 @@
-// TODO(pending Brent): parse the intent-detection AI Action's response and ZT.setFormData('email_analysis_route', ...).
```

### node 10 — Grade intent result (script code)

```diff
--- before/node 10 content
+++ after/node 10 content
@@ -0,0 +1,16 @@
+// --- inputs -----------------------------------------------------------------
+let intent = actions.automate_email_intent_int;
+let email_intents = [].concat(intent.email_intent || []);
+
+// --- transform: one route for the router --------------------------------------
+let intentInScope = email_intents.length > 0 && !email_intents.includes("other");
+let email_analysis_route = intent.escalate_to_agent === true
+  ? "escalation"
+  : (intentInScope ? "in_scope" : "out_of_scope");
+
+// --- outputs ----------------------------------------------------------------
+ZT.setFormData("email_intent", email_intents.join(", "));
+ZT.setFormData("sentiment", intent.sentiment || "");
+ZT.setFormData("escalate_reason", intent.escalate_reason || "");
+ZT.setFormData("confidence_score", intent.confidence_score == null ? "" : intent.confidence_score);
+ZT.setFormData("email_analysis_route", email_analysis_route);
```

### node 11 — Email analysis route (content)

```diff
--- before/node 11 content
+++ after/node 11 content
@@ -1,4 +0,0 @@
-// Compute the escalation display HTML for this case and store it as escalation_html.
-// TODO(pending Brent): real per-intent escalation rule wording from the AI Action screenshots.
-// var html = '<p>' + /* escalation copy based on detected intent / routing reason */ '</p>';
-// ZT.setFormData('escalation_html', html);
```

### node 12 — Build escalation notice (script code)

```diff
--- before/node 12 content
+++ after/node 12 content
@@ -0,0 +1,18 @@
+// --- inputs -----------------------------------------------------------------
+let escalate_reason = ZT.getVariableValue("escalate_reason", "");
+
+// --- one notice per escalation reason (was four content nodes) ----------------
+const noticeTitleByReason = {
+  "Escalation": "AI support needs your help with this. It looks like the customer has a problem that needs to be investigated.",
+  "Out of scope": "AI support needs your help with this",
+  "Intent does not match": "AI doesn't recognise what the request is from the customer",
+  "Internal request": "AI support needs your help. This is an internal request."
+};
+let title = noticeTitleByReason[escalate_reason] || "AI support needs your help with this";
+
+let escalation_html = `<h3>${title}</h3>`
+  + `<p>This case requires you to action the request. Please work this case as you normally would.</p>`
+  + `<p>For further guidance, refer to the Zingtree pop up over to the right.</p>`;
+
+// --- outputs ----------------------------------------------------------------
+ZT.setFormData("escalation_html", escalation_html);
```

### node 13 — Escalation notice (content)

```diff
--- before/node 13 content
+++ after/node 13 content
@@ -1 +1 @@
-<p>Please work this case as you normally would the intent detected is not in scope for AI email generation automation.&nbsp;</p>
+${escalation_html}
```

### node 14 — Case is not automated (content)

```diff
--- before/node 14 content
+++ after/node 14 content
@@ -1 +1 @@
-${escalation_html}
+<p>Please work this case as you normally would, the intent detected is not in scope for AI email generation automation.&nbsp;</p>
```

### node 15 — Set case origin (script code)

```diff
--- before/node 15 content
+++ after/node 15 content
@@ -0,0 +1,2 @@
+// Salesforce Case Origin stamped on every AI-handled case.
+ZT.setFormData("sf_Origin", "Zingtree AI");
```

### node 16 — Generate email response (content)

```diff
--- before/node 16 content
+++ after/node 16 content
@@ -1 +0,0 @@
-// TODO(pending Brent): parse the generation AI Action's response and hand it to the case-review dashboard.
```

### node 17 — Build case review dashboard (script code)

```diff
--- before/node 17 content
+++ after/node 17 content
@@ -1 +1,216 @@
-<p><strong>Test mode:</strong> pick an intent below, then Continue to see the matching example email and seed mock Salesforce data -- no real case is touched.</p>
+// --- inputs -----------------------------------------------------------------
+let intentResult = actions.automate_email_intent_int;
+let sfCase = actions.sfdc_int__case_email_ai.records[0];
+let email_response = actions.automate_email_generation_int.email || "";
+let email_intent = ZT.getVariableValue("email_intent", "");
+let sf_CaseNumber = ZT.getVariableValue("sf_CaseNumber", "");
+let ai_feedback = ZT.getVariableValue("ai_feedback", "");
+let ai_feedback_comments = ZT.getVariableValue("ai_feedback_comments", "");
+let selected_topic = ZT.getVariableValue("sf_Topic__c", "");
+let selected_subtopic = ZT.getVariableValue("sf_Sub_Topic__c", "");
+
+// --- shared helpers -----------------------------------------------------------
+const escapeHtml = value => String(value == null ? "" : value)
+  .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
+  .replace(/"/g, "&quot;").replace(/'/g, "&#39;");
+const muted = cls => `<span class="${cls}">&mdash;</span>`;
+const formatValue = value => {
+  if (value == null || value === "") return muted("case-review-muted");
+  if (value === true || value === false) return value ? "Yes" : "No";
+  if (value instanceof Array) return value.length ? escapeHtml(value.join(", ")) : muted("case-review-muted");
+  if (value instanceof Object) return escapeHtml(JSON.stringify(value));
+  return escapeHtml(value);
+};
+const normalizeIntentKey = value => String(value || "").trim().toLowerCase().replace(/\s+/g, "_");
+
+// intent key -> Salesforce Topic / Sub Topic (also the dashboard label)
+const salesforceByIntent = {
+  active_card_list:            { topic: "Online",     subtopic: "Active Card List" },
+  order_a_new_card:            { topic: "Online",     subtopic: "Order New Card(s)" },
+  cancel_card:                 { topic: "Online",     subtopic: "Cancel card" },
+  visa_card_activation:        { topic: "Online",     subtopic: "VISA Card activation" },
+  new_user_request:            { topic: "Online",     subtopic: "New User Request" },
+  copy_invoice:                { topic: "Online",     subtopic: "Copy Invoice" },
+  replacement_card:            { topic: "Online",     subtopic: "Replacement cards" },
+  card_pins:                   { topic: "Online",     subtopic: "Card PIN(s)" },
+  transaction_report:          { topic: "Online",     subtopic: "Transaction Report" },
+  forgotten_password:          { topic: "Online",     subtopic: "Forgotten Password" },
+  lost_or_stolen_card:         { topic: "Online",     subtopic: "Lost & Stolen" },
+  account_unlock:              { topic: "Online",     subtopic: "Account Unlock" },
+  add_update_contact_details:  { topic: "Not Online", subtopic: "Add/Update Contact Details" }
+};
+const intentKeys = Object.keys(salesforceByIntent);
+const subtopicOptions = intentKeys.filter(key => key !== "visa_card_activation").map(key => salesforceByIntent[key].subtopic);
+const topicOptions = ["Online", "Not Online", "Other"];
+
+// --- detected intents ---------------------------------------------------------
+let rawIntents = [].concat(intentResult.email_intent || []);
+let detectedIntents = rawIntents
+  .map(item => normalizeIntentKey(item instanceof Object ? (item.intent || item.name || item.key || item.value || "") : item))
+  .filter(Boolean);
+let detectedLabels = [...new Set(detectedIntents.map(key => salesforceByIntent[key] ? salesforceByIntent[key].subtopic : key))];
+let has_multiple_intents = detectedIntents.length > 1 ? "true" : "false";
+
+// --- Salesforce Topic / Sub Topic for a single detected intent ------------------
+let salesforce = salesforceByIntent[email_intent] || { topic: "Online", subtopic: "" };
+
+// --- dashboard ----------------------------------------------------------------
+const renderRow = (label, value) => `
+  <div class="case-review-row">
+    <div class="case-review-row-label">${escapeHtml(label)}</div>
+    <div class="case-review-row-value">${formatValue(value)}</div>
+  </div>`;
+
+const renderIntentPills = () => `
+  <div class="case-review-intent-grid">
+    ${intentKeys.map(key => {
+      let isPresent = detectedIntents.includes(key);
+      let theme = isPresent
+        ? { cardBg: "#e8f5ec", border: "#d3eadb", valueColor: "#16803d", text: "Yes" }
+        : { cardBg: "#fae9e9", border: "#f2d2d2", valueColor: "#c62525", text: "No" };
+      return `
+      <div class="case-review-intent-simple-card" style="background:${theme.cardBg};border-color:${theme.border};">
+        <div class="case-review-intent-simple-title">${escapeHtml(salesforceByIntent[key].subtopic)}</div>
+        <div class="case-review-intent-simple-value" style="color:${theme.valueColor};">${theme.text}</div>
+      </div>`;
+    }).join("")}
+  </div>`;
+
+const renderAiFeedback = () => {
+  if (ai_feedback === "thumbs_up") {
+    return `<div class="ai-feedback-wrap"><div class="ai-feedback-thankyou">&#128077; Thanks for your feedback!</div></div>`;
+  }
+  if (ai_feedback === "thumbs_down" && ai_feedback_comments.trim() !== "") {
+    return `<div class="ai-feedback-wrap"><div class="ai-feedback-thankyou">&#128078; Thanks for your feedback - we'll use it to improve.</div></div>`;
+  }
+  let showComments = ai_feedback === "thumbs_down";
+  return `
+  <div class="ai-feedback-wrap">
+    <div class="ai-feedback-label">Was this helpful?</div>
+    <input type="hidden" class="zt-data ai-feedback-value" id="ai_feedback" name="ai_feedback" data-name="ai_feedback" value="${escapeHtml(ai_feedback)}" />
+    <div class="ai-feedback-buttons">
+      <button type="button" class="ai-feedback-btn ${ai_feedback === "thumbs_up" ? "selected" : ""}" data-feedback="thumbs_up" aria-label="Helpful" title="Helpful">&#128077;</button>
+      <button type="button" class="ai-feedback-btn ${ai_feedback === "thumbs_down" ? "selected" : ""}" data-feedback="thumbs_down" aria-label="Not helpful" title="Not helpful">&#128078;</button>
+    </div>
+    <div class="ai-feedback-comments ${showComments ? "is-visible" : ""}" aria-hidden="${showComments ? "false" : "true"}">
+      <label for="ai_feedback_comments" class="ai-feedback-comments-label">What could be improved?</label>
+      <textarea id="ai_feedback_comments" name="ai_feedback_comments" data-name="ai_feedback_comments" class="zt-data ai-feedback-comments-input" rows="4" placeholder="Tell us what was incorrect or could be improved...">${escapeHtml(ai_feedback_comments)}</textarea>
+      <div class="ai-feedback-comments-error" role="alert" aria-live="polite"></div>
+      <button type="button" class="ai-feedback-submit">Submit feedback</button>
+    </div>
+  </div>`;
+};
+
+let case_review_html = `
+<div class="case-review-shell">
+  <div class="case-review-panel">
+    <div class="case-review-hero">
+      <div class="case-review-hero-top">
+        <div class="case-review-hero-copy">
+          <div class="case-review-eyebrow">Case Review</div>
+          <h2 class="case-review-main-title">Email Response Summary</h2>
+          <div class="case-review-subtitle">Case <strong>${formatValue(sf_CaseNumber)}</strong>
+            <span class="case-review-subtitle-separator">&middot;</span> ${formatValue(detectedLabels.join(", "))}</div>
+        </div>
+        <div class="case-review-hero-metrics-card">
+          <div class="case-review-hero-metric">
+            <div class="case-review-hero-metric-label">Confidence Score</div>
+            <div class="case-review-hero-metric-value">${formatValue(intentResult.confidence_score)}</div>
+          </div>
+          <div class="case-review-hero-metric">
+            <div class="case-review-hero-metric-label">Confidence Explanation</div>
+            <div class="case-review-hero-metric-text">${formatValue(intentResult.confidence_score_extracts)}</div>
+          </div>
+        </div>
+      </div>
+    </div>
+    <div class="case-review-body">
+      <div class="case-review-grid">
+        <div class="case-review-col case-review-col-left">
+          <div class="case-review-card">
+            <h3 class="case-review-card-title">Case Details</h3>
+            ${renderRow("Case Number", sf_CaseNumber)}
+            ${renderRow("Customer Request", detectedLabels.join(", "))}
+            ${renderRow("Requester Email", sfCase.SuppliedEmail)}
+          </div>
+          <div class="case-review-card">
+            <h3 class="case-review-card-title">Subtopics found</h3>
+            ${renderIntentPills()}
+          </div>
+        </div>
+        <div class="case-review-col case-review-col-right">
+          <div class="case-review-card">
+            <h3 class="case-review-card-title">Original Customer Email</h3>
+            <div class="case-review-html-card-body">${sfCase.Description && String(sfCase.Description).trim() !== "" ? sfCase.Description : muted("case-review-muted")}</div>
+          </div>
+          <div class="case-review-card case-review-response-card">
+            <h3 class="case-review-card-title">Email Response</h3>
+            <div class="case-review-html-card-body">${email_response.trim() !== "" ? email_response : muted("case-review-muted")}</div>
+            ${renderAiFeedback()}
+          </div>
+        </div>
+      </div>
+    </div>
+  </div>
+</div>`.trim();
+
+// --- manual-changes form (Topic + Subtopic + editable HTML body) -----------------
+const buildOptions = (options, selectedValue, placeholder) =>
+  `<option value="">${escapeHtml(placeholder)}</option>` + options.map(option =>
+    `<option value="${escapeHtml(option)}"${option === selectedValue ? ' selected="selected"' : ""}>${escapeHtml(option)}</option>`).join("");
+
+let request_form_html = `
+<div class="zt-form-card">
+  <div class="zt-form-header">
+    <h2 class="zt-form-title">Original Customer Email</h2>
+    <p class="zt-form-subtitle">${escapeHtml(sfCase.Description)}</p>
+  </div>
+  <div class="zt-form-header">
+    <h2 class="zt-form-title">Request Details</h2>
+    <p class="zt-form-subtitle">Complete the fields below.</p>
+  </div>
+  <div class="zt-form-grid">
+    <div class="zt-form-field">
+      <label for="sf_Topic__c" class="zt-form-label">Topic <span class="zt-required">*</span></label>
+      <select id="sf_Topic__c" name="sf_Topic__c" data-name="sf_Topic__c" class="zt-data zt-form-control" required>
+        ${buildOptions(topicOptions, selected_topic || salesforce.topic, "Select Topic")}
+      </select>
+    </div>
+    <div class="zt-form-field">
+      <label for="sf_Sub_Topic__c" class="zt-form-label">Subtopic <span class="zt-required">*</span></label>
+      <select id="sf_Sub_Topic__c" name="sf_Sub_Topic__c" data-name="sf_Sub_Topic__c" class="zt-data zt-form-control" required>
+        ${buildOptions(subtopicOptions, selected_subtopic || salesforce.subtopic, "Select Subtopic")}
+      </select>
+    </div>
+  </div>
+  <div class="zt-form-field zt-form-field-full">
+    <label class="zt-form-label">HTML Body</label>
+    <div id="htmlBodyEditor" class="zt-rich-editor" contenteditable="true">${email_response || "<p>Start typing...</p>"}</div>
+    <textarea id="HtmlBody" name="HtmlBody" data-name="HtmlBody" class="zt-data" style="display:none;">${escapeHtml(email_response)}</textarea>
+    <div class="zt-form-help">Format text visually (bold, line breaks, etc.)</div>
+  </div>
+</div>`.trim();
+
+// --- multiple-subtopics form (agent picks the one Salesforce Sub Topic) ---------
+let multiple_subtopics_form_html = `
+<div class="zt-form-card">
+  <div class="zt-form-header">
+    <h2 class="zt-form-title">Multiple Subtopics Detected</h2>
+    <p class="zt-form-subtitle">Multiple Subtopics were detected, please choose from the following:</p>
+  </div>
+  <div class="zt-form-field">
+    <label for="sf_Sub_Topic__c" class="zt-form-label">Subtopic <span class="zt-required">*</span></label>
+    <select id="sf_Sub_Topic__c" name="sf_Sub_Topic__c" data-name="sf_Sub_Topic__c" class="zt-data zt-form-control" required>
+      ${buildOptions(detectedLabels, selected_subtopic, "Select Subtopic")}
+    </select>
+  </div>
+</div>`.trim();
+
+// --- outputs ----------------------------------------------------------------
+ZT.setFormData("HtmlBody", email_response);
+ZT.setFormData("sf_Topic__c", salesforce.topic);
+ZT.setFormData("sf_Sub_Topic__c", salesforce.subtopic);
+ZT.setFormData("has_multiple_intents", has_multiple_intents);
+ZT.setFormData("case_review_html", case_review_html);
+ZT.setFormData("request_form_html", request_form_html);
+ZT.setFormData("multiple_subtopics_form_html", multiple_subtopics_form_html);
```

### node 18 — Case review dashboard (content)

```diff
--- before/node 18 content
+++ after/node 18 content
@@ -1,14 +1 @@
-// Look up the example email for the intent picked in node 17, and seed the mocked
-// Salesforce response into actions.ALIAS so nodes 3/6 (which read actions.ALIAS.*)
-// see the same shape a real Connected Object call would return.
-// TODO(pending Brent): swap placeholder example-email strings for the real per-intent
-// templates from his screenshots; swap 'ALIAS' for the real DCO alias once it's created.
-//
-// var intent = ZT.getVariableValue('test_intent', '');
-// var examples = { active_card_list: '...', order_a_new_card: '...', /* ...11 total... */ };
-// ZT.setFormData('test_example_email_html', '<pre>' + (examples[intent] || '') + '</pre>');
-// ZT.setFormData('ai_account_eligibility', true);
-// ZT.setResponseData('ALIAS', {
-//   _zt_meta: { response: { code: 200 } },
-//   records: [{ AccountId: 'MOCK-ACCOUNT-001', SuppliedEmail: 'test.contact@example.com' }]
-// });
+${case_review_html}
```

### node 19 — Multiple intents? (content)

```diff
--- before/node 19 content
+++ after/node 19 content
@@ -1 +0,0 @@
-${test_example_email_html}
```

### node 20 — Choose the Sub Topic (content)

```diff
--- before/node 20 content
+++ after/node 20 content
@@ -1,7 +1 @@
-<pre># Email Automation - INT -- build history
-
-2026-09-09: Brent built the initial skeleton. Claude (Dudley) confirmed via live inventory that neither 'Automate Email Intent INT' nor 'Automate Email Generation INT' AI Actions exist in org 605565 yet (only Car Comparison/24, GIC - AI Business Logic/70, GIC - Returns Use Case/73, Test API/60 do -- node 8's ai_action_id had been left pointed at Test API). No Salesforce Connected Object exists there either. Open AI LLM source (id 475) is real/active and reusable.
-
-First JSON delivery failed import (invented formfields keys, non-sequential new-node ids/display_order, hardcoded ai_action_id that may not resolve in whatever org this gets test-imported into). This v2 fixes all three: new nodes 17-20 use lowest-unused ids with project_node_id==display_order==key, formfields use only the proven key set, ai_action_id left unassigned (0) rather than pointed at any specific id, and the test/mock node (17-19) seeds mock data via ZT.setResponseData into the actions namespace per the house pattern instead of ad hoc form variables.
-
-Pending: real AI Action instructions/context/constraints and escalation rule wording (screenshots need re-sharing), the real DCO alias (currently 'ALIAS' placeholder), confirmation of which org this is being test-imported into, and whether node 12->15->16 should become a Linked Workflow call into 'Email Automation - AI Actions INT' (109029630) instead of a local AI_Action.</pre>
+${multiple_subtopics_form_html}
```

## CHANGES THAT NEED AN EXPLANATION

Every line below must map to a requirement or an explicit request.
Anything unexplained is unintended drift — revert it before delivering.

  [ ] added node 21 (Make manual changes)
  [ ] added node 22 (Mock mode?)
  [ ] added node 23 (Get incoming email addresses)
  [ ] added node 24 (Build email payload)
  [ ] added node 25 (Mock mode before send?)
  [ ] added node 26 (Send email to customer)
  [ ] added node 27 (Grade email send)
  [ ] added node 28 (Email sent?)
  [ ] added node 29 (Email sent)
  [ ] added node 30 (Notify team of failed send)
  [ ] added node 31 (Email to customer failed)
  [ ] added node 32 (Test mode - pick a scenario)
  [ ] added node 33 (Load example email)
  [ ] added node 34 (Test mode - review or edit the email)
  [ ] added node 35 (Seed mocked Salesforce data)
  [ ] added node 36 (claude.md)
  [ ] node 1 — page_title: "Start Node" → "Start"
  [ ] node 1 — node_name: "" → "Entry point: run against Salesforce, or open Test Mode to run on mocked data"
  [ ] node 1 — content changed (0 → 169 characters) — Start
  [ ] node 1 — button added/changed: "Process this case" → node 2
  [ ] node 1 — button added/changed: "Test Mode (QA)" → node 32
  [ ] node 1 — button removed/replaced: "No Title" → node 2
  [ ] node 1 — button removed/replaced: "Test Mode (QA)" → node 17
  [ ] node 2 — Script → Data (Get case and inbound email)
  [ ] node 2 — page_title: "New Node" → "Get case and inbound email"
  [ ] node 2 — node_name: "" → "Fetch the Salesforce Case (subject, description = inbound email, account, contact)"
  [ ] node 3 — page_title: "New Node" → "Account linked to case?"
  [ ] node 3 — node_name: "" → "Mock mode skips the account fetch; a case with no AccountId stops here"
  [ ] node 3 — continuation_node_id: 0 → 4 — Account linked to case?
  [ ] node 3 — button added/changed: "mock == "1"" → node 6 [logic: mock == "1"]
  [ ] node 3 — button added/changed: "actions.sfdc_int__case_email_ai.records[0].AccountId != null" → node 5 [logic: actions.sfdc_int__case_email_ai.records[0].AccountId != null]
  [ ] node 3 — button added/changed: "" → node 4
  [ ] node 3 — button removed/replaced: "actions.ALIAS?.records[0]?.AccountId != null" → node 4
  [ ] node 3 — button removed/replaced: "" → node 0
  [ ] node 4 — Data → Content (No account linked to the case)
  [ ] node 4 — page_title: "Get Account Details" → "No account linked to the case"
  [ ] node 4 — node_name: "" → "Agent links the Account in Salesforce and retries the fetch"
  [ ] node 4 — content changed (44 → 36 characters) — No account linked to the case
  [ ] node 4 — continuation_node_id: 5 → 0 — No account linked to the case
  [ ] node 4 — button added/changed: "Account was linked - try again" → node 2
  [ ] node 5 — Script → Data (Get account details)
  [ ] node 5 — page_title: "Check AI Eligibility for Acct" → "Get account details"
  [ ] node 5 — node_name: "" → "Fetch Framework__c, Account_Segment__c and AS_Account_Administrator__c for the eligibility check"
  [ ] node 5 — content changed (93 → 0 characters) — Get account details
  [ ] node 6 — Scoring → Script (Check AI eligibility)
  [ ] node 6 — page_title: "Is Acct AI Eligible?" → "Check AI eligibility"
  [ ] node 6 — node_name: "" → "Account rules (framework, segment, administrator) plus the Phase 1 bypass gate; sets ai_account_eligibility"
  [ ] node 6 — script code changed (0 → 32 lines) — Check AI eligibility
  [ ] node 6 — button removed/replaced: "ai_account_eligibility" → node 8
  [ ] node 6 — button removed/replaced: "" → node 7
  [ ] node 7 — Content → Scoring (Account AI eligible?)
  [ ] node 7 — page_title: "Not AI Eligible" → "Account AI eligible?"
  [ ] node 7 — node_name: "" → "Route eligible cases to intent detection, everything else to the not-eligible screen"
  [ ] node 7 — content changed (12 → 0 characters) — Account AI eligible?
  [ ] node 7 — continuation_node_id: 0 → 8 — Account AI eligible?
  [ ] node 7 — button added/changed: "ai_account_eligibility == true" → node 9 [logic: ai_account_eligibility == true]
  [ ] node 7 — button added/changed: "ai_account_eligibility == false" → node 8 [logic: ai_account_eligibility == false]
  [ ] node 7 — button added/changed: "" → node 8
  [ ] node 7 — advanced_logic_node: 0 → 1
  [ ] node 8 — AI_Action → Content (Account not eligible for AI)
  [ ] node 8 — page_title: "Determin Email Intent" → "Account not eligible for AI"
  [ ] node 8 — node_name: "" → "Terminal: shows why the case is not handled by the AI"
  [ ] node 8 — content changed (0 → 472 characters) — Account not eligible for AI
  [ ] node 8 — continuation_node_id: 9 → 0 — Account not eligible for AI
  [ ] node 8 — config: {"mode": "api", "instruction": ""} → (empty)
  [ ] node 9 — Script → AI_Action (Detect email intent)
  [ ] node 9 — page_title: "Intent Automation" → "Detect email intent"
  [ ] node 9 — node_name: "" → "AI Action automate_email_intent_int: intents, sentiment, confidence, escalation"
  [ ] node 9 — content changed (120 → 0 characters) — Detect email intent
  [ ] node 9 — ai_action_id: 0 → 93
  [ ] node 9 — config: (empty) → {"mode": "api", "instruction": ""}
  [ ] node 10 — Scoring → Script (Grade intent result)
  [ ] node 10 — page_title: "Email Analysis Logic" → "Grade intent result"
  [ ] node 10 — node_name: "" → "Reads the intent AI Action; sets email_intent, sentiment, escalate_reason and email_analysis_route"
  [ ] node 10 — script code changed (0 → 16 lines) — Grade intent result
  [ ] node 10 — continuation_node_id: 13 → 11 — Grade intent result
  [ ] node 10 — button removed/replaced: "email_analysis_route" → node 11
  [ ] node 10 — button removed/replaced: "email_analysis_route" → node 12
  [ ] node 10 — button removed/replaced: "" → node 13
  [ ] node 11 — Script → Scoring (Email analysis route)
  [ ] node 11 — page_title: "Escalation Logic" → "Email analysis route"
  [ ] node 11 — node_name: "" → "escalation -> notice, in_scope -> generate the reply, anything else -> not automated"
  [ ] node 11 — content changed (4 → 0 lines) — Email analysis route
  [ ] node 11 — button added/changed: "email_analysis_route == "escalation"" → node 12 [logic: email_analysis_route == "escalation"]
  [ ] node 11 — button added/changed: "email_analysis_route == "in_scope"" → node 15 [logic: email_analysis_route == "in_scope"]
  [ ] node 11 — button added/changed: "" → node 14
  [ ] node 11 — advanced_logic_node: 0 → 1
  [ ] node 12 — page_title: "Set Variables" → "Build escalation notice"
  [ ] node 12 — node_name: "" → "One notice per escalate_reason (replaces four content nodes); sets escalation_html"
  [ ] node 12 — script code changed (0 → 18 lines) — Build escalation notice
  [ ] node 12 — continuation_node_id: 15 → 13 — Build escalation notice
  [ ] node 13 — page_title: "Case Is Not Automated" → "Escalation notice"
  [ ] node 13 — node_name: "" → "Terminal: agent works the case by hand; text staged by the previous script"
  [ ] node 13 — content changed (128 → 18 characters) — Escalation notice
  [ ] node 14 — page_title: "Escalation Notice" → "Case is not automated"
  [ ] node 14 — node_name: "" → "Terminal: detected intent is out of scope for AI email generation"
  [ ] node 14 — content changed (18 → 129 characters) — Case is not automated
  [ ] node 15 — AI_Action → Script (Set case origin)
  [ ] node 15 — page_title: "New Node" → "Set case origin"
  [ ] node 15 — node_name: "" → "Stamps sf_Origin = Zingtree AI before the reply is generated"
  [ ] node 15 — script code changed (0 → 2 lines) — Set case origin
  [ ] node 15 — config: {"mode": "api", "instruction": ""} → (empty)
  [ ] node 16 — Script → AI_Action (Generate email response)
  [ ] node 16 — page_title: "Handle response" → "Generate email response"
  [ ] node 16 — node_name: "" → "AI Action automate_email_generation_int: drafts the customer reply as HTML"
  [ ] node 16 — content changed (107 → 0 characters) — Generate email response
  [ ] node 16 — continuation_node_id: 0 → 17 — Generate email response
  [ ] node 16 — ai_action_id: 0 → 94
  [ ] node 16 — config: (empty) → {"mode": "api", "instruction": ""}
  [ ] node 17 — Content → Script (Build case review dashboard)
  [ ] node 17 — page_title: "Test Mode - Select Intent" → "Build case review dashboard"
  [ ] node 17 — node_name: "Test mode - pick an intent to preview" → "Maps intent -> Topic/Sub Topic, sets HtmlBody, has_multiple_intents, and the dashboard / manual-edit / multi-subtopic HTML"
  [ ] node 17 — script code changed (1 → 216 lines) — Build case review dashboard
  [ ] node 17 — continuation_node_id: 0 → 18 — Build case review dashboard
  [ ] node 17 — button removed/replaced: "Continue" → node 18
  [ ] node 17 — form field removed: test_intent (select)
  [ ] node 18 — Script → Content (Case review dashboard)
  [ ] node 18 — page_title: "Load Example + Seed Mock Data" → "Case review dashboard"
  [ ] node 18 — node_name: "Test mode - load example email and seed mock data" → "Agent reviews the AI reply and approves it or edits it"
  [ ] node 18 — content changed (14 → 1 lines) — Case review dashboard
  [ ] node 18 — continuation_node_id: 19 → 0 — Case review dashboard
  [ ] node 18 — button added/changed: "Yes - send email response" → node 19
  [ ] node 18 — button added/changed: "No - make manual changes" → node 21
  [ ] node 19 — Content → Scoring (Multiple intents?)
  [ ] node 19 — page_title: "Test Mode - Review Example Email" → "Multiple intents?"
  [ ] node 19 — node_name: "Test mode - review example email before continuing" → "Several intents -> agent picks the Sub Topic; mock mode skips the Salesforce fetch"
  [ ] node 19 — content changed (26 → 0 characters) — Multiple intents?
  [ ] node 19 — continuation_node_id: 0 → 23 — Multiple intents?
  [ ] node 19 — button added/changed: "has_multiple_intents == "true"" → node 20 [logic: has_multiple_intents == "true"]
  [ ] node 19 — button added/changed: "mock == "1"" → node 24 [logic: mock == "1"]
  [ ] node 19 — button added/changed: "" → node 23
  [ ] node 19 — button removed/replaced: "Continue to Intent Detection" → node 5
  [ ] node 19 — advanced_logic_node: 0 → 1
  [ ] node 20 — page_title: "claude.md" → "Choose the Sub Topic"
  [ ] node 20 — node_name: "Build history (claude.md)" → "Agent picks one Salesforce Sub Topic when several intents were detected"
  [ ] node 20 — content changed (7 → 1 lines) — Choose the Sub Topic
  [ ] node 20 — button added/changed: "Send Email" → node 22
  [ ] node 20 — button added/changed: "Make Manual Changes" → node 21
  [ ] tree setting —  css_include: https://zingtree.com/css/custom-css.php?template=default-v2&body_text=44325E&primary=6200EE&secondary=EFE7FC&complement=f5f5f5 → https://assets.zingtree.com/managed/templates/salesforce_2026.css
  [ ] tree setting —  data_cache_ttl: 3600 → 36000
  [ ] tree setting —  enable_data_logging: 0 → 1
  [ ] tree setting —  hide_back_button: 0 → 1
  [ ] tree setting —  merge_vars_not_fixed: 0 → 1
  [ ] tree setting —  notitle: 0 → 1
  [ ] tree setting —  predefined_vars: {"0": {"checkbox_score": 1, "config": null, "custom_regex": "", "hidden_value": "", "id": 33875431, "inline": 0, "label": "", "label_type": "", "name": "ai_account_eligibility", "options": "", "project_id": 783808640, "project_node_id": 0, "rank": 0, "required": false, "score_var": "", "scores": "", "type": "predefined"}, "1": {"checkbox_score": 1, "config": null, "custom_regex": "", "hidden_value": "", "id": 33875784, "inline": 0, "label": "", "label_type": "", "name": "intent_in_scope", "options": "", "project_id": 783808640, "project_node_id": 0, "rank": 0, "required": false, "score_var": "", "scores": "", "type": "predefined"}, "2": {"checkbox_score": 1, "config": null, "custom_regex": "", "hidden_value": "", "id": 33875801, "inline": 0, "label": "", "label_type": "", "name": "email_analysis_route", "options": "", "project_id": 783808640, "project_node_id": 0, "rank": 0, "required": false, "score_var": "", "scores": "", "type": "predefined"}} → {"0": {"checkbox_score": 1, "config": null, "custom_regex": "", "hidden_value": "", "id": 33875431, "inline": 0, "label": "", "label_type": "", "name": "ai_account_eligibility", "options": "", "project_id": 783808640, "project_node_id": 0, "rank": 0, "required": false, "score_var": "", "scores": "", "type": "predefined"}, "1": {"checkbox_score": 1, "config": null, "custom_regex": "", "hidden_value": "", "id": 33875784, "inline": 0, "label": "", "label_type": "", "name": "intent_in_scope", "options": "", "project_id": 783808640, "project_node_id": 0, "rank": 0, "required": false, "score_var": "", "scores": "", "type": "predefined"}, "2": {"checkbox_score": 1, "config": null, "custom_regex": "", "hidden_value": "", "id": 33875801, "inline": 0, "label": "", "label_type": "", "name": "email_analysis_route", "options": "", "project_id": 783808640, "project_node_id": 0, "rank": 0, "required": false, "score_var": "", "scores": "", "type": "predefined"}, "3": {"checkbox_score": 1, "config": null, "custom_regex": "", "hidden_value": "", "id": 785567, "inline": 0, "label": "", "label_type": "", "name": "sf_ContactId", "options": "", "project_id": 783808640, "project_node_id": 0, "rank": 0, "required": false, "score_var": "", "scores": "", "type": "predefined"}, "4": {"checkbox_score": 1, "config": null, "custom_regex": "", "hidden_value": "", "id": 785568, "inline": 0, "label": "", "label_type": "", "name": "sf_CaseNumber", "options": "", "project_id": 783808640, "project_node_id": 0, "rank": 0, "required": false, "score_var": "", "scores": "", "type": "predefined"}, "5": {"checkbox_score": 1, "config": null, "custom_regex": "", "hidden_value": "", "id": 785569, "inline": 0, "label": "", "label_type": "", "name": "sf_Topic__c", "options": "", "project_id": 783808640, "project_node_id": 0, "rank": 0, "required": false, "score_var": "", "scores": "", "type": "predefined"}, "6": {"checkbox_score": 1, "config": null, "custom_regex": "", "hidden_value": "", "id": 785570, "inline": 0, "label": "", "label_type": "", "name": "sf_Sub_Topic__c", "options": "", "project_id": 783808640, "project_node_id": 0, "rank": 0, "required": false, "score_var": "", "scores": "", "type": "predefined"}, "7": {"checkbox_score": 1, "config": null, "custom_regex": "", "hidden_value": "", "id": 785571, "inline": 0, "label": "", "label_type": "", "name": "sf_Id", "options": "", "project_id": 783808640, "project_node_id": 0, "rank": 0, "required": false, "score_var": "", "scores": "", "type": "predefined"}, "8": {"checkbox_score": 1, "config": null, "custom_regex": "", "hidden_value": "", "id": 785572, "inline": 0, "label": "", "label_type": "", "name": "sf_Subject", "options": "", "project_id": 783808640, "project_node_id": 0, "rank": 0, "required": false, "score_var": "", "scores": "", "type": "predefined"}}
  [ ] tree setting —  script_code: (empty) → <style>
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
</script>

