========================================================================
WORKFLOW DIFF — AI Email Automation - Sandbox
========================================================================

Before : before.json  (51 nodes)
After  : after.json  (53 nodes)

## PLAIN SUMMARY

46 of 53 nodes are byte-for-byte identical to the original (87% untouched).
2 nodes added, 0 removed, 0 renumbered, 5 modified.

In plain terms:
  + NEW      node 54 — Case review dashboard - FAST Admin [Content]
  + NEW      node 55 — GDPR response - non-authorised contact [Content]
  * CHANGED  node 17 — Build case review dashboard [Script]
               - script code changed (256 → 312 lines) — Build case review dashboard
               - continuation_node_id: 30 → 54 — Build case review dashboard
  * CHANGED  node 19 — Grade intent and build validation screen [Script]
               - script code changed (185 → 197 lines) — Grade intent and build validation screen
  * CHANGED  node 44 — Test mode - pick a scenario [Content]
               - form field settings changed (same field names)
  * CHANGED  node 45 — Load example email [Script]
               - script code changed (130 → 146 lines) — Load example email
  * CHANGED  node 48 — claude.md [Content]
               - content changed (595 → 614 lines) — claude.md

## TREE SHAPE

  node type                before    after    delta
  AI_Action                     4        4       +0
  Content                      17       19       +2
  Data                          4        4       +0
  Email                         1        1       +0
  Scoring                      11       11       +0
  Script                       14       14       +0
  TOTAL                        51       53       +2

  Root node unchanged (node 1).

## STRUCTURAL SANITY

  No broken links introduced.
  No nodes became unreachable.
  Pre-existing in the BEFORE tree (not caused by this edit): 0 broken link(s), 1 unreachable node(s).

## UNTOUCHED NODES (46)

  1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 18, 20, 21, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 46, 47, 49, 50, 51, 52, 53

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
   * AI FEEDBACK (screens 30, 53 and 54)
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

## LINE-LEVEL BODY DIFFS (4)

### node 17 — Build case review dashboard (script code)

```diff
--- before/node 17 content
+++ after/node 17 content
@@ -221,6 +221,61 @@
   </div>
 </div>`.trim();
 
+// --- GDPR pushback form (FAST Admin only: the sender is not an authorised contact) ----
+// Corpay UK's approved GDPR pushback copy, "Allstar - GDPR button PH1" (Charley Gunning).
+// The agent decides the sender is not authorised, so the draft is fixed copy rather than
+// an AI reply, and _NAMES_ is left for the agent to replace with the authorised contacts
+// before it goes out. Same Topic / Sub Topic selects and the same editor ids as the
+// manual-changes form, so script_code's editor sync and field validation apply unchanged.
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
+let gdpr_request_form_html = `
+<div class="zt-form-card">
+  <div class="zt-form-header">
+    <h2 class="zt-form-title">Non-authorised contact: GDPR response</h2>
+    <p class="zt-form-subtitle">Replace <strong>_NAMES_</strong> with the authorised contacts on the account before you send.</p>
+  </div>
+  <div class="zt-form-header">
+    <h2 class="zt-form-title">Original Customer Email</h2>
+    <p class="zt-form-subtitle">${escapeHtml(sfCase.Description)}</p>
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
+        ${buildSubtopicOptions(subtopicChoices, selected_subtopic || salesforce.subtopic)}
+      </select>
+    </div>
+  </div>
+  <div class="zt-form-field zt-form-field-full">
+    <label class="zt-form-label">HTML Body</label>
+    <div id="htmlBodyEditor" class="zt-rich-editor" contenteditable="true">${gdpr_email_body}</div>
+    <textarea id="HtmlBody" name="HtmlBody" data-name="HtmlBody" class="zt-data" style="display:none;">${escapeHtml(gdpr_email_body)}</textarea>
+    <div class="zt-form-help">Format text visually (bold, line breaks, etc.)</div>
+  </div>
+</div>`.trim();
+
 // --- multiple-subtopics form (agent picks the one Salesforce Sub Topic) ---------
 let multiple_subtopics_form_html = `
 <div class="zt-form-card">
@@ -254,3 +309,4 @@
 ZT.setTransformData("case_review_html", compact(case_review_html));
 ZT.setTransformData("request_form_html", compact(request_form_html));
 ZT.setTransformData("multiple_subtopics_form_html", compact(multiple_subtopics_form_html));
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
+  hc_payment_query:   { topic: "HC-Not Online", subtopic: "Payment Query" }
 };
 
 // An intent with a variant group asks the agent which approved reply fits; an intent
-// without one has a single template and no select.
+// without one has a single template and no select. Payment Query is one intent with two
+// approved replies, not two intents.
 const variantGroups = [
   {
     intent: "hc_tariff_update",
@@ -26,6 +29,14 @@
       { value: "standard_driver_pushback", label: "Standard driver pushback" },
       { value: "octopus_pairing_pushback", label: "Octopus pairing pushback" },
       { value: "driver_struggling_response", label: "Driver struggling response" }
+    ]
+  },
+  {
+    intent: "hc_payment_query",
+    fallback: "dd_increase_pushback",
+    options: [
+      { value: "dd_increase_pushback", label: "Driver's electricity direct debit has increased" },
+      { value: "underpayment_response", label: "Driver claiming underpayment" }
     ]
   }
 ];
@@ -104,8 +115,9 @@
 
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

### node 48 — claude.md (content)

```diff
--- before/node 48 content
+++ after/node 48 content
@@ -18,6 +18,9 @@
 
 Use cases: FAST Admin (13 intents, ported 1:1 from GT's "Email Automation - AI Actions INT"
 109029630 org 123) and Homecharge Phase 1 - Missing Charges, Tariff Update, Password Reset.
+Release 2 (INT, 2026-09-24 standup): Update Charger Information and Payment Query are back,
+plus the FAST Admin GDPR pushback button (tracker R41). Compatible Chargers and Resent
+Onboarding Email stay out.
 Phase 1 ran to seven intents; Charley Gunning cut it to the three that can carry a full
 25-case test pass inside one release week. Update Charger Information, Compatible Chargers,
 Payment Query and Resent Onboarding Email are OUT of INT and come back through the release
@@ -46,7 +49,11 @@
 14 Scoring  Email analysis route         escalation -> 27; in_scope -> 15; else 29
 15 Script   Set case origin              sf_Origin -> 16
 16 AI       Generate email response      automate_email_generation_int (94) -> 17
-17 Script   Build case review dashboard  -> 30
+17 Script   Build case review dashboard  also stages gdpr_request_form_html -> 54
+54 Content  Dashboard - FAST Admin       clone of 30 + third button "Non-authorised user: GDPR
+                                         response" (button_data "Sent GDPR response") -> 55
+55 Content  GDPR response                ${transforms.gdpr_request_form_html}: Topic/Sub Topic +
+                                         editable approved GDPR copy with _NAMES_ -> 49
 
 Homecharge lane
 18 AI       Detect Homecharge intent     automate_hc_email_intent_int (98) -> 19
@@ -69,7 +76,7 @@
 
 Shared tail - both lanes converge here
 52 Scoring  Screenshots option needed?   hc_show_screenshots_stop == true -> 53; else 30
-30 Content  Case review dashboard        score_var ai_suggested_email; native ai_feedback +
+30 Content  Case review dashboard        Homecharge only since 2026-09-24; score_var ai_suggested_email; native ai_feedback +
                                          ai_feedback_comments; Yes -> 31; No (manual) -> 33
 53 Content  Dashboard - missing charges  same score_var and feedback fields as 30;
                                          Yes -> 31; No (manual) -> 33;
@@ -209,9 +216,13 @@
   hc_missing_charges         HC-Not Online / Missing Charges
   hc_tariff_update           HC-Online     / Update Energy/Tariff Information
   hc_password_reset          HC-Not Online / Password Reset
+  hc_update_charger_details  HC-Online     / Update Charger Information   (back 2026-09-24)
+  hc_payment_query           HC-Not Online / Payment Query                (back 2026-09-24)
 One intent carries response variants, pre-selected by the intent AI Action and confirmed by the
 agent on screen 21:
   hc_tariff_update  standard_driver_pushback, octopus_pairing_pushback, driver_struggling_response
+  hc_payment_query  dd_increase_pushback, underpayment_response (underpayment forces screen 33:
+                    its template leaves [INSERT UNIT RATE EXCLUDING VAT] for the agent - node 24)
 Retired from INT with the Phase 1 cut, in the map's own words - each comes back as one row here,
 one row in requiredChecksByIntent, its Test Mode scenario and its line in AI Action 98's prompt:
   hc_update_charger_details  HC-Online     / Update Charger Information
@@ -404,6 +415,14 @@
   points at. Importing it as a new tree means updating the layout.
 
 ## Changelog
+- 2026-09-24 Claude (UAT standup 24 Sept: "two intents + GDPR into INT") - node 19: map rows
+  hc_update_charger_details and hc_payment_query, Payment Query variant group. Nodes 44/45: four
+  Test Mode scenarios (test_hc_update_charger_details, test_hc_payment_query_dd_increase,
+  test_hc_payment_query_underpayment, test_fast_admin_gdpr_non_authorised). GDPR pushback (Charley's
+  "Allstar - GDPR button PH1", FAST Admin queue only): node 17 stages gdpr_request_form_html, new
+  dashboard 54 (FAST lane, 17 -> 54) with the third button, new screen 55 -> 49. Screen 30 is now
+  the Homecharge dashboard. AI Action 98 re-extended to five intents in org 605565 (99 already held
+  both templates). The GDPR draft is fixed approved copy, not AI-generated.
 - 2026-09-23 Claude - DEMOTE UK org 123 -> sandbox 605565. org_id 123->605565; COs 10->1263, 20->1264, 23->1265 (salesforce->http), 187->1266; AI Actions node 12 16->93, node 16 15->94, node 18 19->98, node 25 18->99; root_node_id 2->1.
 - 2026-09-23 Brent / Claude - ai_feedback_comments now appears ONLY on thumbs_down; thumbs_up hides it and clears any text (field + session var). Thumbs-up status line no longer invites a comment. script_code, 48.
 - 2026-09-23 Claude - PROMOTE sandbox 605565 -> UK org 123. org_id 605565->123; COs 1263->10 (salesforce), 1264->20 (salesforce), 1265->23 (salesforce), 1266->187 (http); AI Actions node 12 93->16, node 16 94->15, node 18 98->19, node 25 99->18; root_node_id 1->2.
```

## CHANGES THAT NEED AN EXPLANATION

Every line below must map to a requirement or an explicit request.
Anything unexplained is unintended drift — revert it before delivering.

  [ ] added node 54 (Case review dashboard - FAST Admin)
  [ ] added node 55 (GDPR response - non-authorised contact)
  [ ] node 17 — script code changed (256 → 312 lines) — Build case review dashboard
  [ ] node 17 — continuation_node_id: 30 → 54 — Build case review dashboard
  [ ] node 19 — script code changed (185 → 197 lines) — Grade intent and build validation screen
  [ ] node 44 — form field settings changed (same field names)
  [ ] node 45 — script code changed (130 → 146 lines) — Load example email
  [ ] node 48 — content changed (595 → 614 lines) — claude.md
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
   * AI FEEDBACK (screens 30, 53 and 54)
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

