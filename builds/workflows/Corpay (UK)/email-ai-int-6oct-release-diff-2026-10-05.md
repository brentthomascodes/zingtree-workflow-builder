========================================================================
WORKFLOW DIFF — Email Automation - AI Actions INT
========================================================================

Before : Email Automation - AI Actions INT (next batch 2026-09-30).json  (60 nodes)
After  : Email Automation - AI Actions INT (6 Oct INT release 2026-10-05).json  (61 nodes)

## PLAIN SUMMARY

41 of 61 nodes are byte-for-byte identical to the original (67% untouched).
1 node added, 0 removed, 0 renumbered, 19 modified.

In plain terms:
  + NEW      node 61 — This AI session has expired [Content]
  * CHANGED  node 17 — Build case review dashboard [Script]
               - script code changed (292 → 288 lines) — Build case review dashboard
  * CHANGED  node 19 — Grade intent and build validation screen [Script]
               - script code changed (204 → 204 lines) — Grade intent and build validation screen
  * CHANGED  node 21 — Choose the approved reply [Content]
               - content changed (80 → 58 characters) — Choose the approved reply
  * CHANGED  node 26 — Build case review dashboard [Script]
               - script code changed (297 → 290 lines) — Build case review dashboard
  * CHANGED  node 27 — Build escalation notice [Script]
               - script code changed (24 → 24 lines) — Build escalation notice
  * CHANGED  node 28 — Terminal: agent works the case by hand; text staged by the escal [Content]
               - content changed (36 → 25 characters) — Terminal: agent works the case by hand; text staged by the escal
  * CHANGED  node 30 — Case review dashboard [Content]
               - content changed (59 → 48 characters) — Case review dashboard
               - button added/changed: "Submit feedback" → node 52
               - form field added: ai_feedback_submitted (text)
  * CHANGED  node 36 — Prepare email request [Script]
               - script code changed (35 → 46 lines) — Prepare email request
  * CHANGED  node 37 — Session expired or mock mode? [Scoring]
               - page_title: "Mock mode before send?" → "Session expired or mock mode?"
               - node_name: "Test scaffolding: skip the real send when running on mocked data" → "Stale session -> screen 61; Test Mode -> skip the send; else send"
               - button added/changed: "session_expired == true" → node 61 [logic: session_expired == true]
               - button added/changed: "is_mock_run == true" → node 39 [logic: mock_downstream == true]
               - button added/changed: "" → node 38
               - button removed/replaced: "is_mock_run == true" → node 39
               - button removed/replaced: "" → node 38
  * CHANGED  node 39 — Grade email send [Script]
               - script code changed (58 → 59 lines) — Grade email send
  * CHANGED  node 41 — Email sent [Content]
               - content changed (37 → 26 characters) — Email sent
  * CHANGED  node 48 — claude.md [Content]
               - content changed (710 → 742 lines) — claude.md
  * CHANGED  node 50 — Load provider picklists [Script]
               - script code changed (85 → 85 lines) — Load provider picklists
  * CHANGED  node 51 — Confirm energy and data provider [Content]
               - content changed (34 → 23 characters) — Confirm energy and data provider
  * CHANGED  node 52 — Which dashboard? [Scoring]
               - page_title: "Screenshots option needed?" → "Which dashboard?"
               - node_name: "Only the Missing Charges dashboard carries the screenshots-alrea" → "Picks the dashboard for the reply: after node 26, and when the feedback Submit returns the agent to the screen they were on. GDPR -> 55, FAST -> 54, missing charges -> 53, else 30"
               - button added/changed: "ai_reply_is_gdpr == true" → node 55 [logic: ai_reply_is_gdpr == true]
               - button added/changed: "queue_route == "fast_admin"" → node 54 [logic: queue_route == "fast_admin"]
               - button added/changed: "hc_show_screenshots_stop == true" → node 53 [logic: hc_show_screenshots_stop == true]
               - button added/changed: "" → node 30
               - button removed/replaced: "hc_show_screenshots_stop == true" → node 53
               - button removed/replaced: "" → node 30
  * CHANGED  node 53 — Case review dashboard - missing charges [Content]
               - content changed (30 → 19 characters) — Case review dashboard - missing charges
               - button added/changed: "Submit feedback" → node 52
               - form field added: ai_feedback_submitted (text)
  * CHANGED  node 54 — Case review dashboard - FAST Admin [Content]
               - content changed (59 → 48 characters) — Case review dashboard - FAST Admin
               - button added/changed: "Submit feedback" → node 52
               - form field added: ai_feedback_submitted (text)
  * CHANGED  node 55 — GDPR response - non-authorised contact [Content]
               - content changed (59 → 48 characters) — GDPR response - non-authorised contact
               - button added/changed: "Submit feedback" → node 52
               - form field added: ai_feedback_submitted (text)
  * CHANGED  node 57 — Write authorised contacts into GDPR reply [Script]
               - script code changed (25 → 26 lines) — Write authorised contacts into GDPR reply

## TREE SHAPE

  node type                before    after    delta
  AI_Action                     5        5       +0
  Content                      22       23       +1
  Data                          4        4       +0
  Email                         1        1       +0
  Scoring                      12       12       +0
  Script                       16       16       +0
  TOTAL                        60       61       +1

  Root node unchanged (node 2).

## STRUCTURAL SANITY

  No broken links introduced.
  No nodes became unreachable.
  Pre-existing in the BEFORE tree (not caused by this edit): 0 broken link(s), 6 unreachable node(s).

## UNTOUCHED NODES (41)

  1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 18, 20, 22, 23, 24, 25, 29, 31, 32, 33, 34, 35, 38, 40, 42, 43, 44, 45, 46, 47, 49, 56, 58, 59, 60

## TREE-LEVEL SETTINGS CHANGED (1)

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

.ai-feedback-comments {
  display: none;
  margin-top: 12px;
}

.ai-feedback-comments.is-visible {
  display: block;
}

.ai-feedback-comments-label {
  display: block;
  margin-bottom: 6px;
  font-size: 14px;
  font-weight: 600;
  color: #374151;
}

.ai-feedback-comments-input {
  width: 100%;
  min-height: 96px;
  padding: 10px 12px;
  font-size: 14px;
  line-height: 1.5;
  color: #111827;
  background: #ffffff;
  border: 1px solid #cbd5e1;
  border-radius: 8px;
  resize: vertical;
  box-sizing: border-box;
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

.ai-feedback-thankyou {
  margin-top: 4px;
  font-size: 14px;
  font-weight: 600;
  color: #16803d;
}
</style>

<script>
(function () {
  /**
   * AI FEEDBACK (dashboards 30, 53, 54 and 55)
   *
   * The widget is built here, not in the dashboard HTML, and placed inside the Email Response
   * card. Thumbs up submits straight away. Thumbs down opens the comments box and its
   * Submit feedback button; a comment is required before it submits.
   *
   * Storage is three native fields on each dashboard, hidden from view: ai_feedback,
   * ai_feedback_comments (the widget's comments box copies into it as the agent types) and
   * ai_feedback_submitted ("No" until Submit). Native fields submit with whichever button the
   * agent clicks, so they are what reaches form data. Submit clicks the screen's hidden native
   * "Submit feedback" button, so the values reach form data at that moment. Router 52 returns
   * the agent to the same dashboard, where the widget shows the thank-you instead.
   */
  var SUBMIT_BUTTON_TEXT = 'Submit feedback';

  function nativeField(name) {
    return document.querySelector(
      'input[name="' + name + '"], textarea[name="' + name + '"]'
    );
  }

  // The wrapper that holds a native field and its label: walk up while the parent holds
  // only this one control, so nothing else on the screen moves.
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

  function hideNativeField(name) {
    var wrapper = nativeWrapper(name);
    if (wrapper) wrapper.style.display = 'none';
  }

  function setNativeValue(name, value) {
    var field = nativeField(name);
    if (field) {
      field.value = value;
      field.dispatchEvent(new Event('input', { bubbles: true }));
      field.dispatchEvent(new Event('change', { bubbles: true }));
    }
    assignSessionVar(name, value);
  }

  // The screen's own native "Submit feedback" button (it routes back to this dashboard).
  function nativeSubmitButton() {
    var controls = document.querySelectorAll(
      'button, a, input[type="button"], input[type="submit"]'
    );
    for (var i = 0; i < controls.length; i++) {
      var control = controls[i];
      if (control.closest('.ai-feedback-wrap')) continue;
      var label = (control.value || control.textContent || '').trim();
      if (label === SUBMIT_BUTTON_TEXT) return control;
    }
    return null;
  }

  var thankYouText = {
    thumbs_up: '&#128077; Thanks for your feedback!',
    thumbs_down: '&#128078; Thanks for your feedback - we will use it to improve.'
  };

  function buildWidget() {
    var widget = document.createElement('div');
    widget.className = 'ai-feedback-wrap';
    widget.innerHTML =
      '<div class="ai-feedback-label">Was this helpful?</div>' +
      '<div class="ai-feedback-buttons">' +
      '<button type="button" class="ai-feedback-btn" data-feedback="thumbs_up" aria-label="Helpful" title="Helpful">&#128077;</button>' +
      '<button type="button" class="ai-feedback-btn" data-feedback="thumbs_down" aria-label="Not helpful" title="Not helpful">&#128078;</button>' +
      '</div>' +
      '<div class="ai-feedback-comments" aria-hidden="true">' +
      '<label class="ai-feedback-comments-label">What could be improved?</label>' +
      '<textarea class="ai-feedback-comments-input" rows="4" placeholder="Tell us what was incorrect or could be improved..."></textarea>' +
      '<div class="ai-feedback-comments-error" role="alert" aria-live="polite"></div>' +
      '<button type="button" class="ai-feedback-submit">Submit feedback</button>' +
      '</div>' +
      '<div class="ai-feedback-thankyou" role="status" aria-live="polite"></div>';
    return widget;
  }

  function showThankYou(widget, feedbackValue) {
    widget.querySelector('.ai-feedback-label').style.display = 'none';
    widget.querySelector('.ai-feedback-buttons').style.display = 'none';
    widget.querySelector('.ai-feedback-comments').classList.remove('is-visible');
    widget.querySelector('.ai-feedback-thankyou').innerHTML =
      thankYouText[feedbackValue] || thankYouText.thumbs_up;
  }

  function showComments(widget, shouldShow) {
    var comments = widget.querySelector('.ai-feedback-comments');
    if (shouldShow) {
      comments.classList.add('is-visible');
    } else {
      comments.classList.remove('is-visible');
    }
    comments.setAttribute('aria-hidden', shouldShow ? 'false' : 'true');
    if (shouldShow) {
      var box = widget.querySelector('.ai-feedback-comments-input');
      window.setTimeout(function () { box.focus(); }, 0);
    }
  }

  function submitFeedback(feedbackValue, comments) {
    setNativeValue('ai_feedback', feedbackValue);
    setNativeValue('ai_feedback_comments', comments);
    setNativeValue('ai_feedback_submitted', 'Yes');
    var button = nativeSubmitButton();
    if (button) button.click();
  }

  whenEvent('render:finish', function () {
    if (!nativeField('ai_feedback') || !nativeField('ai_feedback_submitted')) return;
    if (document.querySelector('.ai-feedback-wrap')) return;

    hideNativeField('ai_feedback');
    hideNativeField('ai_feedback_comments');
    hideNativeField('ai_feedback_submitted');
    var submitButton = nativeSubmitButton();
    if (submitButton) submitButton.style.display = 'none';

    if (nativeField('ai_feedback_submitted').value === '') {
      setNativeValue('ai_feedback_submitted', 'No');
    }

    var widget = buildWidget();
    var responseCard = document.querySelector('.case-review-response-card');
    if (responseCard) {
      responseCard.appendChild(widget);
    } else {
      var feedbackWrapper = nativeWrapper('ai_feedback');
      feedbackWrapper.parentElement.insertBefore(widget, feedbackWrapper);
    }

    // The widget's comments box writes through to the native ai_feedback_comments field.
    var commentsBox = widget.querySelector('.ai-feedback-comments-input');
    commentsBox.value = nativeField('ai_feedback_comments') ? nativeField('ai_feedback_comments').value : '';
    commentsBox.addEventListener('input', function () {
      setNativeValue('ai_feedback_comments', commentsBox.value);
      widget.querySelector('.ai-feedback-comments-error').textContent = '';
    });

    var currentFeedback = nativeField('ai_feedback').value;
    if (nativeField('ai_feedback_submitted').value === 'Yes') {
      showThankYou(widget, currentFeedback);
      return;
    }
    if (currentFeedback === 'thumbs_down') {
      widget.querySelector('.ai-feedback-btn[data-feedback="thumbs_down"]').classList.add('selected');
      showComments(widget, true);
    }

    widget.addEventListener('click', function (event) {
      var thumb = event.target.closest('.ai-feedback-btn');
      if (thumb) {
        var value = thumb.getAttribute('data-feedback');
        var thumbs = widget.querySelectorAll('.ai-feedback-btn');
        for (var i = 0; i < thumbs.length; i++) thumbs[i].classList.remove('selected');
        thumb.classList.add('selected');
        widget.querySelector('.ai-feedback-comments-error').textContent = '';

        if (value === 'thumbs_up') {
          showThankYou(widget, value);
          submitFeedback(value, '');
        } else {
          setNativeValue('ai_feedback', value);
          showComments(widget, true);
        }
        return;
      }

      if (event.target.closest('.ai-feedback-submit')) {
        var comments = commentsBox.value.trim();
        if (comments === '') {
          widget.querySelector('.ai-feedback-comments-error').textContent =
            'Please enter a comment before submitting.';
          commentsBox.focus();
          return;
        }
        showThankYou(widget, 'thumbs_down');
        submitFeedback('thumbs_down', comments);
      }
    });
  });
})();
</script>


## COSMETIC / EDITOR-ONLY CHANGES (0) — ignore

  (none)

## LINE-LEVEL BODY DIFFS (17)

### node 17 — Build case review dashboard (script code)

```diff
--- before/node 17 content
+++ after/node 17 content
@@ -116,19 +116,6 @@
     }).join("")}
   </div>`;
 
-// The thumbs buttons are the only writer of ai_feedback: script_code writes the click into the
-// native ai_feedback field on screens 30 / 53, which is what reaches form data. Comments go in
-// the native ai_feedback_comments box on the same screen.
-const renderAiFeedback = () => `
-  <div class="ai-feedback-wrap">
-    <div class="ai-feedback-label">Was this helpful?</div>
-    <div class="ai-feedback-buttons">
-      <button type="button" class="ai-feedback-btn" data-feedback="thumbs_up" aria-label="Helpful" title="Helpful">&#128077;</button>
-      <button type="button" class="ai-feedback-btn" data-feedback="thumbs_down" aria-label="Not helpful" title="Not helpful">&#128078;</button>
-    </div>
-    <div class="ai-feedback-status" role="status" aria-live="polite"></div>
-  </div>`;
-
 const renderCaseReview = responseHtml => `
 <div class="case-review-shell">
   <div class="case-review-panel">
@@ -174,7 +161,6 @@
           <div class="case-review-card case-review-response-card">
             <h3 class="case-review-card-title">Email Response</h3>
             <div class="case-review-html-card-body">${responseHtml.trim() !== "" ? responseHtml : muted("case-review-muted")}</div>
-            ${renderAiFeedback()}
           </div>
         </div>
       </div>
@@ -281,12 +267,22 @@
 ZT.setFormData("sf_Topic__c", salesforce.topic);
 ZT.setFormData("sf_Sub_Topic__c", salesforce.subtopic);
 ZT.setFormData("has_multiple_intents", has_multiple_intents);
-// Form-data merge fields render newlines as <br>, so the HTML is written on one line.
+// Every block is written on one line: merge fields render newlines as <br>. The dashboard and
+// the GDPR dashboard are display only, so they are form data and survive a session reopened
+// after the 1-hour transforms TTL. The two forms carry zt-data inputs and stay transforms.
 const compact = html => html.replace(/\s*\n\s*/g, " ");
-ZT.setTransformData("case_review_html", compact(case_review_html));
+ZT.setFormData("case_review_html", compact(case_review_html));
 ZT.setTransformData("request_form_html", compact(request_form_html));
 ZT.setTransformData("multiple_subtopics_form_html", compact(multiple_subtopics_form_html));
 // GDPR templates, still carrying _NAMES_; node 57 fills them only if the agent picks GDPR.
 ZT.setFormData("gdpr_email_body", gdpr_email_body);
-ZT.setTransformData("gdpr_review_html", compact(gdpr_review_html));
+ZT.setFormData("gdpr_review_html", compact(gdpr_review_html));
+// Router 52 sends the feedback Submit back to the GDPR dashboard only after node 57 ran.
+ZT.setFormData("ai_reply_is_gdpr", false);
+// A new draft starts with no feedback recorded. script_code's feedback widget writes the
+// agent's thumbs, comment and Submit into the native fields on the dashboard.
+ZT.setFormData("ai_feedback", "");
+ZT.setFormData("ai_feedback_comments", "");
+ZT.setFormData("ai_feedback_submitted", "No");
+
 ZT.setTransformData("gdpr_request_form_html", compact(gdpr_request_form_html));
```

### node 19 — Grade intent and build validation screen (script code)

```diff
--- before/node 19 content
+++ after/node 19 content
@@ -200,5 +200,5 @@
 ZT.setFormData("hc_requester_type", hc_requester_type);
 
 ZT.setTransformData("hc_variant_options", variantOptions);
-ZT.setTransformData("hc_case_summary_html", hc_case_summary_html);
-ZT.setTransformData("hc_validation_html", hc_validation_html);
+ZT.setFormData("hc_case_summary_html", hc_case_summary_html);
+ZT.setFormData("hc_validation_html", hc_validation_html);
```

### node 21 — Choose the approved reply (content)

```diff
--- before/node 21 content
+++ after/node 21 content
@@ -1 +1 @@
-<p>${transforms.hc_case_summary_html}</p><p>${transforms.hc_validation_html}</p>
+<p>${hc_case_summary_html}</p><p>${hc_validation_html}</p>
```

### node 26 — Build case review dashboard (script code)

```diff
--- before/node 26 content
+++ after/node 26 content
@@ -138,19 +138,6 @@
     <p>${escapeHtml(manual_changes_reason)}</p>
   </div>`;
 
-// The thumbs buttons are the only writer of ai_feedback: script_code writes the click into the
-// native ai_feedback field on screens 30 / 53, which is what reaches form data. Comments go in
-// the native ai_feedback_comments box on the same screen.
-const renderAiFeedback = () => `
-  <div class="ai-feedback-wrap">
-    <div class="ai-feedback-label">Was this helpful?</div>
-    <div class="ai-feedback-buttons">
-      <button type="button" class="ai-feedback-btn" data-feedback="thumbs_up" aria-label="Helpful" title="Helpful">&#128077;</button>
-      <button type="button" class="ai-feedback-btn" data-feedback="thumbs_down" aria-label="Not helpful" title="Not helpful">&#128078;</button>
-    </div>
-    <div class="ai-feedback-status" role="status" aria-live="polite"></div>
-  </div>`;
-
 let case_review_html = `
 <div class="case-review-shell">
   <div class="case-review-panel">
@@ -200,7 +187,6 @@
           <div class="case-review-card case-review-response-card">
             <h3 class="case-review-card-title">Email Response</h3>
             <div class="case-review-html-card-body">${email_response.trim() !== "" ? email_response : muted("case-review-muted")}</div>
-            ${renderAiFeedback()}
           </div>
         </div>
       </div>
@@ -281,9 +267,16 @@
 ZT.setFormData("hc_manual_changes_required", manual_changes_reason !== "");
 // Form-data merge fields render newlines as <br>, so the HTML is written on one line.
 const compact = html => html.replace(/\s*\n\s*/g, " ");
-ZT.setTransformData("case_review_html", compact(case_review_html));
+// Display only, so form data: it survives a session reopened after the 1-hour transforms TTL.
+ZT.setFormData("case_review_html", compact(case_review_html));
 ZT.setTransformData("request_form_html", compact(request_form_html));
 ZT.setTransformData("multiple_subtopics_form_html", compact(multiple_subtopics_form_html));
+// A new draft starts with no feedback recorded. script_code's feedback widget writes the
+// agent's thumbs, comment and Submit into the native fields on the dashboard.
+ZT.setFormData("ai_feedback", "");
+ZT.setFormData("ai_feedback_comments", "");
+ZT.setFormData("ai_feedback_submitted", "No");
+
 
 // --- the missing-charges stop ---------------------------------------------------
 // Missing Charges is the one approved reply that asks the customer for screenshots, so its
```

### node 27 — Build escalation notice (script code)

```diff
--- before/node 27 content
+++ after/node 27 content
@@ -21,4 +21,4 @@
   + `<p>For further guidance, refer to the Zingtree pop up over to the right.</p>`;
 
 // --- outputs ----------------------------------------------------------------
-ZT.setTransformData("escalation_html", escalation_html);
+ZT.setFormData("escalation_html", escalation_html);
```

### node 28 — Terminal: agent works the case by hand; text staged by the escal (content)

```diff
--- before/node 28 content
+++ after/node 28 content
@@ -1 +1 @@
-<p>${transforms.escalation_html}</p>
+<p>${escalation_html}</p>
```

### node 30 — Case review dashboard (content)

```diff
--- before/node 30 content
+++ after/node 30 content
@@ -1 +1 @@
-<p>${transforms.case_review_html}</p><p><br></p><p><br></p>
+<p>${case_review_html}</p><p><br></p><p><br></p>
```

### node 36 — Prepare email request (script code)

```diff
--- before/node 36 content
+++ after/node 36 content
@@ -2,6 +2,16 @@
 let inboundEmail = actions.get_incoming_email_addresses_int.records[0];
 let htmlBody = ZT.getVariableValue("HtmlBody", "");
 let subject = ZT.getVariableValue("sf_Subject", "");
+
+// --- stale session ---------------------------------------------------------------
+// Zingtree keeps transforms for 1 hour and the case response for the Connected Object cache
+// TTL. A case reopened after that resumes on a screen whose data is gone, and a send from it
+// fails or goes out from a form the agent never saw. request_form_html is written by every
+// dashboard builder, so it missing here means the dashboard is more than an hour old.
+// Router 37 sends a stale session to screen 61 (start again) instead of the send.
+let session_expired = transforms.request_form_html === undefined
+  || actions.sfdc_int__case_email_ai === undefined
+  || htmlBody.trim() === "";
 
 // Zingtree drops merge results into the send Connected Object's JSON template as-is, with no
 // escaping. Any value with quotes, backslashes or line breaks (an HTML body always has them)
@@ -30,6 +40,7 @@
 // Template reads: "emailSubject": "${transforms.email_subject_json}",
 //                 "emailBody": "${transforms.email_body_json}"
 // HtmlBody and sf_Subject themselves stay untouched.
+ZT.setFormData("session_expired", session_expired);
 ZT.setTransformData("ccAddresses", JSON.stringify(ccAddresses));
 ZT.setTransformData("email_body_json", jsonText(htmlBody));
 ZT.setTransformData("email_subject_json", jsonText(subject));
```

### node 39 — Grade email send (script code)

```diff
--- before/node 39 content
+++ after/node 39 content
@@ -54,5 +54,6 @@
 // --- outputs ----------------------------------------------------------------
 ZT.setFormData("emailSent", emailSent ? "true" : "false");
 ZT.setFormData("errorEmailMessage", errorEmailMessage);
-// Form-data merge fields render newlines as <br>, so the HTML is written on one line.
-ZT.setTransformData("email_sent_summary_html", email_sent_summary_html.replace(/\s*\n\s*/g, " "));
+// Display HTML is form data so the screen still renders when a session is reopened after the
+// 1-hour transforms TTL. Form-data merges render newlines as <br>, so it is written on one line.
+ZT.setFormData("email_sent_summary_html", email_sent_summary_html.replace(/\s*\n\s*/g, " "));
```

### node 41 — Email sent (content)

```diff
--- before/node 41 content
+++ after/node 41 content
@@ -1 +1 @@
-${transforms.email_sent_summary_html}
+${email_sent_summary_html}
```

### node 48 — claude.md (content)

```diff
--- before/node 48 content
+++ after/node 48 content
@@ -26,7 +26,7 @@
 Payment Query and Resent Onboarding Email are OUT of INT and come back through the release
 management cadence, one release at a time.
 
-## Architecture (55 nodes + this one)
+## Architecture (56 nodes + this one)
 
 Shared front end - runs once, whichever journey follows
 1  Content  Start (root)                -> 2 live / 44 Test Mode
@@ -97,7 +97,9 @@
 29 Content  Case is not automated        terminal
 
 Shared tail - both lanes converge here
-52 Scoring  Screenshots option needed?   hc_show_screenshots_stop == true -> 53; else 30
+52 Scoring  Which dashboard?             ai_reply_is_gdpr -> 55; fast_admin -> 54;
+                                         hc_show_screenshots_stop -> 53; else 30. Reached from 26 and
+                                         from every dashboard's hidden "Submit feedback" button
 30 Content  Case review dashboard        Homecharge only since 2026-09-24; score_var ai_suggested_email; native ai_feedback +
                                          ai_feedback_comments; Yes -> 31; No (manual) -> 33
 53 Content  Dashboard - missing charges  same score_var and feedback fields as 30;
@@ -113,7 +115,9 @@
 34 Scoring  Mock mode?                   mock_downstream == true -> 36; else 35
 35 Data     Get incoming email addresses get_incoming_email_addresses_int (1265) -> 36
 36 Script   Prepare email request        transforms.ccAddresses, email_body_json, email_subject_json -> 37
-37 Scoring  Mock mode before send?       mock_downstream == true -> 39; else 38
+37 Scoring  Session expired or mock?     session_expired == true -> 61; mock_downstream == true -> 39;
+                                         else 38
+61 Content  This AI session has expired  nothing sent, no alert; Start again -> 2
 38 Data     Send email to customer       send_email_simple_int (1266) -> 39
 39 Script   Grade email send             emailSent, errorEmailMessage, email_sent_summary_html -> 40
 40 Scoring  Email sent?                  'true' -> 41; else 42
@@ -172,11 +176,14 @@
 - ai_suggested_email - score_var on screens 30, 53, 54, 32 and 33 (33 always records "Made manual changes"); the clicked button's button_data
   ("Sent AI suggested email" / "Made manual changes"). Corpay UK's reporting reads it. It went
   missing from node 30 on 2026-09-22 (restored by Brent 2026-09-23); 53 and 32 never had it.
-- ai_feedback ("thumbs_up" | "thumbs_down" | "") - written ONLY by the thumbs buttons, into a
-  native text field of that name on screens 30 and 53 that script_code hides from view.
-- ai_feedback_comments - a native multiline field on screens 30 and 53, below the dashboard,
-  shown only on thumbs_down (scrolled to and focused). thumbs_up hides it and clears its text,
-  so it submits empty. Optional.
+- ai_feedback ("thumbs_up" | "thumbs_down" | ""), ai_feedback_comments, ai_feedback_submitted
+  ("No" | "Yes") - three hidden native fields on dashboards 30, 53, 54 and 55, reset to "", "",
+  "No" by nodes 17 / 26 with each new draft. script_code builds the widget (thumbs, comments box,
+  Submit feedback) inside the Email Response card and writes through to the native fields.
+  Thumbs up submits at once; thumbs down needs a comment, then Submit. Submit sets
+  ai_feedback_submitted "Yes" and clicks the dashboard's hidden native "Submit feedback" button
+  (-> router 52 -> the same dashboard), so the values reach form data at that moment, and the
+  widget shows the thank-you on the re-render. Corpay UK, 1 Oct standup (tracker 26).
 - hc_blocking_checks is gone. The one blocking check, screenshots already attached, is now a
   button on the dashboard (node 53), not a question on screen 21, so node 22 no longer has a
   blocking loop to run.
@@ -213,7 +220,11 @@
   values into them (so the selects open pre-selected) and writes the agent's choice back to
   Energy_Provider__c and Data_Provider__c, confirmed by Corpay UK 2026-09-16. They were free-text boxes on the dashboard named
   sf_Energy_Supplier__c / sf_Data_Provider__c until then.
-- escalation_html - node 27 -> screen 28.
+- escalation_html - node 27 -> screen 28 (form data, survives a reopened session).
+- session_expired (bool) - node 36: transforms.request_form_html gone (the dashboard is over an
+  hour old), the case response gone from actions, or HtmlBody empty. Router 37 -> screen 61.
+- ai_reply_is_gdpr (bool) - false from node 17, true from node 57; router 52 reads it to send
+  the feedback Submit back to the GDPR dashboard (55) rather than 54.
 - HtmlBody, sf_Topic__c, sf_Sub_Topic__c, has_multiple_intents, case_review_html,
   request_form_html, multiple_subtopics_form_html - node 17 or 26. The first three are overwritten
   by the zt-data inputs on screens 32/33. Both screens carry a visible Topic select and a Sub
@@ -333,7 +344,17 @@
   hand-authored file that used a real object is what made nodes open a conversation after import
   (seen 2026-09-14 on the Homecharge tree's nodes 4 and 13). Diff a suspect tree's config against
   a genuine export before assuming the mode itself is wrong.
-- Every *_html string a content node renders goes to ZT.setTransformData and is rendered as
+- DISPLAY HTML IS FORM DATA, FORMS STAY TRANSFORMS (2026-10-05, supersedes the rule below for
+  display-only blocks). PROD sessions reopened days after they started rendered node 28 as a
+  blank screen with the Zingtree logo: transforms live 1 hour, form data for the session.
+  Display-only blocks are now form data: escalation_html, case_review_html, gdpr_review_html,
+  hc_case_summary_html, hc_validation_html, provider_fields_html, email_sent_summary_html.
+  None of them carries an input any more (the feedback widget is built by script_code), which
+  is what the 2026-09-15 failure below was about. request_form_html, gdpr_request_form_html and
+  multiple_subtopics_form_html carry zt-data inputs and stay transforms, as do the dynamic
+  select sources and the send template's staged values. LIVE CHECK: if a form-data block ever
+  renders as text or loses markup, move that one block back to a transform.
+- (Older rule, still true for blocks with inputs) Every *_html string a content node renders goes to ZT.setTransformData and is rendered as
   ${transforms.<name>} - NEVER setFormData with a bare ${<name>} merge field. A form-data merge
   field does not reliably render markup: on the Homecharge validation screen (21) the select
   survived but the checkbox inputs were dropped, leaving the three checklist labels as one run
@@ -460,6 +481,17 @@
   points at. Importing it as a new tree means updating the layout.
 
 ## Changelog
+- 2026-10-05 Claude - INT release for 6 Oct testing (standups 1 + 5 Oct, Charley's 5 Oct summary).
+  (1) Display HTML moved from transforms to form data so reopened sessions still render (PROD
+  blank node 28): nodes 17, 19, 26, 27, 39, 50, 57 write it; screens 21, 28, 30, 41, 51, 53, 54,
+  55 read it. (2) Session expired: node 36 sets session_expired, router 37 -> new screen 61
+  (nothing sent, no failure alert, Start again -> 2) instead of a send that fails or goes out
+  from a screen the agent never saw. Interim until Corpay disables pause/resume. (3) AI feedback
+  reverted to the thumbs + comments + Submit feedback widget (tracker 26): built in script_code,
+  native ai_feedback / ai_feedback_comments / new ai_feedback_submitted (No|Yes), hidden native
+  Submit feedback button on 30/53/54/55 -> router 52 (now Which dashboard?) -> same dashboard.
+  renderAiFeedback removed from 17 and 26. Nodes 17, 19, 21, 26, 27, 28, 30, 36, 37, 39, 41, 50,
+  51, 52, 53, 54, 55, 57, 61 (new), script_code, 48.
 - 2026-09-30 Claude - next INT batch (standup 30 Sep, Gemma's summary): Compatible Chargers (HC-Not Online /
   Compatible Chargers) and Resent Onboarding Email (HC-Online / Resent Onboarding Email) back in node 19's map,
   with Test Mode scenarios test_hc_compatible_chargers / test_hc_resent_onboarding_email. Node 6 writes
```

### node 50 — Load provider picklists (script code)

```diff
--- before/node 50 content
+++ after/node 50 content
@@ -82,4 +82,4 @@
   + " Salesforce picklists - pick Unknown / Unspecified rather than guessing.</p>"
   + "</div>";
 
-ZT.setTransformData("provider_fields_html", provider_fields_html);
+ZT.setFormData("provider_fields_html", provider_fields_html);
```

### node 51 — Confirm energy and data provider (content)

```diff
--- before/node 51 content
+++ after/node 51 content
@@ -1 +1 @@
-${transforms.provider_fields_html}
+${provider_fields_html}
```

### node 53 — Case review dashboard - missing charges (content)

```diff
--- before/node 53 content
+++ after/node 53 content
@@ -1 +1 @@
-${transforms.case_review_html}
+${case_review_html}
```

### node 54 — Case review dashboard - FAST Admin (content)

```diff
--- before/node 54 content
+++ after/node 54 content
@@ -1 +1 @@
-<p>${transforms.case_review_html}</p><p><br></p><p><br></p>
+<p>${case_review_html}</p><p><br></p><p><br></p>
```

### node 55 — GDPR response - non-authorised contact (content)

```diff
--- before/node 55 content
+++ after/node 55 content
@@ -1 +1 @@
-<p>${transforms.gdpr_review_html}</p><p><br></p><p><br></p>
+<p>${gdpr_review_html}</p><p><br></p><p><br></p>
```

### node 57 — Write authorised contacts into GDPR reply (script code)

```diff
--- before/node 57 content
+++ after/node 57 content
@@ -7,7 +7,7 @@
   names = String(formattedNames).trim();
 }
 let gdpr_email_body = ZT.getVariableValue("gdpr_email_body", "");
-let review_html = transforms.gdpr_review_html;
+let review_html = ZT.getVariableValue("gdpr_review_html", "");
 let form_html = transforms.gdpr_request_form_html;
 
 // --- transform ----------------------------------------------------------------
@@ -21,5 +21,6 @@
 // behind its manual-changes button. script_code copies the editor into the HtmlBody
 // textarea on render, so the one replacement covers both copies of the body on screen 33.
 ZT.setFormData("HtmlBody", fillNames(gdpr_email_body));
-ZT.setTransformData("gdpr_review_html", fillNames(review_html));
+ZT.setFormData("gdpr_review_html", fillNames(review_html));
+ZT.setFormData("ai_reply_is_gdpr", true);
 ZT.setTransformData("request_form_html", fillNames(form_html));
```

## CHANGES THAT NEED AN EXPLANATION

Every line below must map to a requirement or an explicit request.
Anything unexplained is unintended drift — revert it before delivering.

  [ ] added node 61 (This AI session has expired)
  [ ] node 17 — script code changed (292 → 288 lines) — Build case review dashboard
  [ ] node 19 — script code changed (204 → 204 lines) — Grade intent and build validation screen
  [ ] node 21 — content changed (80 → 58 characters) — Choose the approved reply
  [ ] node 26 — script code changed (297 → 290 lines) — Build case review dashboard
  [ ] node 27 — script code changed (24 → 24 lines) — Build escalation notice
  [ ] node 28 — content changed (36 → 25 characters) — Terminal: agent works the case by hand; text staged by the escal
  [ ] node 30 — content changed (59 → 48 characters) — Case review dashboard
  [ ] node 30 — button added/changed: "Submit feedback" → node 52
  [ ] node 30 — form field added: ai_feedback_submitted (text)
  [ ] node 36 — script code changed (35 → 46 lines) — Prepare email request
  [ ] node 37 — page_title: "Mock mode before send?" → "Session expired or mock mode?"
  [ ] node 37 — node_name: "Test scaffolding: skip the real send when running on mocked data" → "Stale session -> screen 61; Test Mode -> skip the send; else send"
  [ ] node 37 — button added/changed: "session_expired == true" → node 61 [logic: session_expired == true]
  [ ] node 37 — button added/changed: "is_mock_run == true" → node 39 [logic: mock_downstream == true]
  [ ] node 37 — button added/changed: "" → node 38
  [ ] node 37 — button removed/replaced: "is_mock_run == true" → node 39
  [ ] node 37 — button removed/replaced: "" → node 38
  [ ] node 39 — script code changed (58 → 59 lines) — Grade email send
  [ ] node 41 — content changed (37 → 26 characters) — Email sent
  [ ] node 48 — content changed (710 → 742 lines) — claude.md
  [ ] node 50 — script code changed (85 → 85 lines) — Load provider picklists
  [ ] node 51 — content changed (34 → 23 characters) — Confirm energy and data provider
  [ ] node 52 — page_title: "Screenshots option needed?" → "Which dashboard?"
  [ ] node 52 — node_name: "Only the Missing Charges dashboard carries the screenshots-alrea" → "Picks the dashboard for the reply: after node 26, and when the feedback Submit returns the agent to the screen they were on. GDPR -> 55, FAST -> 54, missing charges -> 53, else 30"
  [ ] node 52 — button added/changed: "ai_reply_is_gdpr == true" → node 55 [logic: ai_reply_is_gdpr == true]
  [ ] node 52 — button added/changed: "queue_route == "fast_admin"" → node 54 [logic: queue_route == "fast_admin"]
  [ ] node 52 — button added/changed: "hc_show_screenshots_stop == true" → node 53 [logic: hc_show_screenshots_stop == true]
  [ ] node 52 — button added/changed: "" → node 30
  [ ] node 52 — button removed/replaced: "hc_show_screenshots_stop == true" → node 53
  [ ] node 52 — button removed/replaced: "" → node 30
  [ ] node 53 — content changed (30 → 19 characters) — Case review dashboard - missing charges
  [ ] node 53 — button added/changed: "Submit feedback" → node 52
  [ ] node 53 — form field added: ai_feedback_submitted (text)
  [ ] node 54 — content changed (59 → 48 characters) — Case review dashboard - FAST Admin
  [ ] node 54 — button added/changed: "Submit feedback" → node 52
  [ ] node 54 — form field added: ai_feedback_submitted (text)
  [ ] node 55 — content changed (59 → 48 characters) — GDPR response - non-authorised contact
  [ ] node 55 — button added/changed: "Submit feedback" → node 52
  [ ] node 55 — form field added: ai_feedback_submitted (text)
  [ ] node 57 — script code changed (25 → 26 lines) — Write authorised contacts into GDPR reply
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

.ai-feedback-comments {
  display: none;
  margin-top: 12px;
}

.ai-feedback-comments.is-visible {
  display: block;
}

.ai-feedback-comments-label {
  display: block;
  margin-bottom: 6px;
  font-size: 14px;
  font-weight: 600;
  color: #374151;
}

.ai-feedback-comments-input {
  width: 100%;
  min-height: 96px;
  padding: 10px 12px;
  font-size: 14px;
  line-height: 1.5;
  color: #111827;
  background: #ffffff;
  border: 1px solid #cbd5e1;
  border-radius: 8px;
  resize: vertical;
  box-sizing: border-box;
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

.ai-feedback-thankyou {
  margin-top: 4px;
  font-size: 14px;
  font-weight: 600;
  color: #16803d;
}
</style>

<script>
(function () {
  /**
   * AI FEEDBACK (dashboards 30, 53, 54 and 55)
   *
   * The widget is built here, not in the dashboard HTML, and placed inside the Email Response
   * card. Thumbs up submits straight away. Thumbs down opens the comments box and its
   * Submit feedback button; a comment is required before it submits.
   *
   * Storage is three native fields on each dashboard, hidden from view: ai_feedback,
   * ai_feedback_comments (the widget's comments box copies into it as the agent types) and
   * ai_feedback_submitted ("No" until Submit). Native fields submit with whichever button the
   * agent clicks, so they are what reaches form data. Submit clicks the screen's hidden native
   * "Submit feedback" button, so the values reach form data at that moment. Router 52 returns
   * the agent to the same dashboard, where the widget shows the thank-you instead.
   */
  var SUBMIT_BUTTON_TEXT = 'Submit feedback';

  function nativeField(name) {
    return document.querySelector(
      'input[name="' + name + '"], textarea[name="' + name + '"]'
    );
  }

  // The wrapper that holds a native field and its label: walk up while the parent holds
  // only this one control, so nothing else on the screen moves.
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

  function hideNativeField(name) {
    var wrapper = nativeWrapper(name);
    if (wrapper) wrapper.style.display = 'none';
  }

  function setNativeValue(name, value) {
    var field = nativeField(name);
    if (field) {
      field.value = value;
      field.dispatchEvent(new Event('input', { bubbles: true }));
      field.dispatchEvent(new Event('change', { bubbles: true }));
    }
    assignSessionVar(name, value);
  }

  // The screen's own native "Submit feedback" button (it routes back to this dashboard).
  function nativeSubmitButton() {
    var controls = document.querySelectorAll(
      'button, a, input[type="button"], input[type="submit"]'
    );
    for (var i = 0; i < controls.length; i++) {
      var control = controls[i];
      if (control.closest('.ai-feedback-wrap')) continue;
      var label = (control.value || control.textContent || '').trim();
      if (label === SUBMIT_BUTTON_TEXT) return control;
    }
    return null;
  }

  var thankYouText = {
    thumbs_up: '&#128077; Thanks for your feedback!',
    thumbs_down: '&#128078; Thanks for your feedback - we will use it to improve.'
  };

  function buildWidget() {
    var widget = document.createElement('div');
    widget.className = 'ai-feedback-wrap';
    widget.innerHTML =
      '<div class="ai-feedback-label">Was this helpful?</div>' +
      '<div class="ai-feedback-buttons">' +
      '<button type="button" class="ai-feedback-btn" data-feedback="thumbs_up" aria-label="Helpful" title="Helpful">&#128077;</button>' +
      '<button type="button" class="ai-feedback-btn" data-feedback="thumbs_down" aria-label="Not helpful" title="Not helpful">&#128078;</button>' +
      '</div>' +
      '<div class="ai-feedback-comments" aria-hidden="true">' +
      '<label class="ai-feedback-comments-label">What could be improved?</label>' +
      '<textarea class="ai-feedback-comments-input" rows="4" placeholder="Tell us what was incorrect or could be improved..."></textarea>' +
      '<div class="ai-feedback-comments-error" role="alert" aria-live="polite"></div>' +
      '<button type="button" class="ai-feedback-submit">Submit feedback</button>' +
      '</div>' +
      '<div class="ai-feedback-thankyou" role="status" aria-live="polite"></div>';
    return widget;
  }

  function showThankYou(widget, feedbackValue) {
    widget.querySelector('.ai-feedback-label').style.display = 'none';
    widget.querySelector('.ai-feedback-buttons').style.display = 'none';
    widget.querySelector('.ai-feedback-comments').classList.remove('is-visible');
    widget.querySelector('.ai-feedback-thankyou').innerHTML =
      thankYouText[feedbackValue] || thankYouText.thumbs_up;
  }

  function showComments(widget, shouldShow) {
    var comments = widget.querySelector('.ai-feedback-comments');
    if (shouldShow) {
      comments.classList.add('is-visible');
    } else {
      comments.classList.remove('is-visible');
    }
    comments.setAttribute('aria-hidden', shouldShow ? 'false' : 'true');
    if (shouldShow) {
      var box = widget.querySelector('.ai-feedback-comments-input');
      window.setTimeout(function () { box.focus(); }, 0);
    }
  }

  function submitFeedback(feedbackValue, comments) {
    setNativeValue('ai_feedback', feedbackValue);
    setNativeValue('ai_feedback_comments', comments);
    setNativeValue('ai_feedback_submitted', 'Yes');
    var button = nativeSubmitButton();
    if (button) button.click();
  }

  whenEvent('render:finish', function () {
    if (!nativeField('ai_feedback') || !nativeField('ai_feedback_submitted')) return;
    if (document.querySelector('.ai-feedback-wrap')) return;

    hideNativeField('ai_feedback');
    hideNativeField('ai_feedback_comments');
    hideNativeField('ai_feedback_submitted');
    var submitButton = nativeSubmitButton();
    if (submitButton) submitButton.style.display = 'none';

    if (nativeField('ai_feedback_submitted').value === '') {
      setNativeValue('ai_feedback_submitted', 'No');
    }

    var widget = buildWidget();
    var responseCard = document.querySelector('.case-review-response-card');
    if (responseCard) {
      responseCard.appendChild(widget);
    } else {
      var feedbackWrapper = nativeWrapper('ai_feedback');
      feedbackWrapper.parentElement.insertBefore(widget, feedbackWrapper);
    }

    // The widget's comments box writes through to the native ai_feedback_comments field.
    var commentsBox = widget.querySelector('.ai-feedback-comments-input');
    commentsBox.value = nativeField('ai_feedback_comments') ? nativeField('ai_feedback_comments').value : '';
    commentsBox.addEventListener('input', function () {
      setNativeValue('ai_feedback_comments', commentsBox.value);
      widget.querySelector('.ai-feedback-comments-error').textContent = '';
    });

    var currentFeedback = nativeField('ai_feedback').value;
    if (nativeField('ai_feedback_submitted').value === 'Yes') {
      showThankYou(widget, currentFeedback);
      return;
    }
    if (currentFeedback === 'thumbs_down') {
      widget.querySelector('.ai-feedback-btn[data-feedback="thumbs_down"]').classList.add('selected');
      showComments(widget, true);
    }

    widget.addEventListener('click', function (event) {
      var thumb = event.target.closest('.ai-feedback-btn');
      if (thumb) {
        var value = thumb.getAttribute('data-feedback');
        var thumbs = widget.querySelectorAll('.ai-feedback-btn');
        for (var i = 0; i < thumbs.length; i++) thumbs[i].classList.remove('selected');
        thumb.classList.add('selected');
        widget.querySelector('.ai-feedback-comments-error').textContent = '';

        if (value === 'thumbs_up') {
          showThankYou(widget, value);
          submitFeedback(value, '');
        } else {
          setNativeValue('ai_feedback', value);
          showComments(widget, true);
        }
        return;
      }

      if (event.target.closest('.ai-feedback-submit')) {
        var comments = commentsBox.value.trim();
        if (comments === '') {
          widget.querySelector('.ai-feedback-comments-error').textContent =
            'Please enter a comment before submitting.';
          commentsBox.focus();
          return;
        }
        showThankYou(widget, 'thumbs_down');
        submitFeedback('thumbs_down', comments);
      }
    });
  });
})();
</script>

