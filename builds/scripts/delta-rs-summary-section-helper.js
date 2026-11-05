// Source session: "Reasonable suspicion testing logic" (local_619ca128-a688-4a63-851f-9dd24ad1cb47)
// Account/customer: Quest Diagnostics — Delta Air Lines drug & alcohol testing program
// Purpose: Drop-in helper that folds the Reasonable Suspicion fields
//          (employee_role, suspicion_reason, drugs_alcohol_suspicion) into the
//          existing post-accident summary HTML. Depends on g() and box() from
//          delta-post-accident-testing-determination.js.

function reasonableSuspicionSection() {
  var role     = g('employee_role');              // Pilot | Flight Attendant | Mechanic | Ground Security Coordinator | Work From Home Employee | Other
  var symptoms = g('suspicion_reason');           // list/text of observed signs & symptoms
  var suspect  = g('drugs_alcohol_suspicion');    // Yes | No

  var DOT_ROLES = ['Pilot', 'Flight Attendant', 'Mechanic', 'Ground Security Coordinator'];
  var isWFH = role === 'Work From Home Employee';
  var isDOT = DOT_ROLES.indexOf(role) !== -1;
  var hasSymptoms = String(symptoms || '').trim() !== '';
  var suspected   = String(suspect || '').toLowerCase() === 'yes';

  var html = '';

  // Role / classification routing
  if (isWFH) {
    html += box('Reasonable Suspicion — Work From Home',
      '<div>Work-from-home employee. <strong>Do not self-administer.</strong></div>'
      + '<div>Contact Delta on-call via Hotline: <strong>866-217-8222</strong>.</div>',
      '#fef2f2', '#fecaca');
  } else if (isDOT) {
    html += box('Reasonable Suspicion — DOT-Covered Position (' + role + ')',
      '<div>DOT-covered position. <strong>Do not self-administer.</strong></div>'
      + '<div>Contact Delta on-call via Hotline: <strong>866-217-8222</strong> | DOT Account: <strong>80126730</strong>.</div>',
      '#fef2f2', '#fecaca');
  } else {
    // NON-DOT (Ramp / Gate / Reservation / Other) — proceed with RS checklist
    var testingWarranted = hasSymptoms && suspected;
    html += box('Reasonable Suspicion — NON-DOT (' + (role || 'Unspecified') + ')',
      '<div>Proceed with Delta Reasonable Suspicion checklist | DOT Account: <strong>80126731</strong>.</div>'
      + '<div>Checklist must be completed by <strong>two Delta managers</strong> (preferably one STP-trained).</div>'
      + '<div><strong>Determination:</strong> '
        + (testingWarranted
            ? 'Signs/symptoms present and use suspected — <strong>set up DRUG AND ALCOHOL testing (RS Non-DOT)</strong>.'
            : 'Testing NOT warranted — signs/symptoms and/or suspicion not confirmed.')
      + '</div>',
      testingWarranted ? '#eef2ff' : '#f9fafb',
      testingWarranted ? '#c7d2fe' : '#e5e7eb');
  }

  // Signs & symptoms detail
  html += box('Signs &amp; Symptoms Observed',
    (hasSymptoms ? symptoms : '<em>None recorded</em>')
    + '<div style="margin-top:6px;color:#6b7280;font-size:13px;">'
    + 'Reminder: signs/symptoms must be present for testing. Custody of drug paraphernalia alone '
    + '(e.g., THC vape pen) does <strong>not</strong> validate testing.</div>',
    '#f9fafb', '#e5e7eb');

  // Drug/alcohol suspicion
  html += box('Drug or Alcohol Use Suspected?',
    '<strong>' + (suspect || 'Not answered') + '</strong>',
    '#f9fafb', '#e5e7eb');

  return html;
}

// Integration (add right before the final setTransformData in run()):
//   html += reasonableSuspicionSection();
//   ZT.setTransformData('testing_summary_html', html);
