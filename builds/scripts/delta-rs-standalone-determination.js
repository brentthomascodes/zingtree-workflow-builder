// Source session: "Reasonable suspicion testing logic" (local_619ca128-a688-4a63-851f-9dd24ad1cb47)
// Account/customer: Quest Diagnostics — Delta Air Lines drug & alcohol testing program
// Purpose: Standalone Reasonable Suspicion determination Script Node. Testing is
//          always "needed"; the 3 RS variables (employee_role, suspicion_reason,
//          drugs_alcohol_suspicion) drive routing + summary only. Writes
//          rs_testing_classification and rs_testing_summary_html.

function g(k) { return ZT.getVariableValue(k, ''); }

function box(title, body, bg, border) {
  return '<div style="border:1px solid ' + border + ';border-radius:10px;background:' + bg + ';padding:10px 12px;margin-top:10px;font-size:14px;line-height:1.45;color:#111827;">'
    + '<div style="font-weight:700;margin-bottom:4px;">' + title + '</div>'
    + '<div>' + body + '</div></div>';
}

function runReasonableSuspicion() {
  var role     = g('employee_role');            // Pilot | Flight Attendant | Mechanic | Ground Security Coordinator | Work From Home Employee | Other
  var symptoms = g('suspicion_reason');         // list/text of observed signs & symptoms
  var suspect  = g('drugs_alcohol_suspicion');  // Yes | No

  var DOT_ROLES = ['Pilot', 'Flight Attendant', 'Mechanic', 'Ground Security Coordinator'];
  var isWFH = role === 'Work From Home Employee';
  var isDOT = DOT_ROLES.indexOf(role) !== -1;

  // ── Classification + routing (testing is always needed) ───────────────────
  var classification, routingBox;

  if (isWFH) {
    classification = 'RS_WFH_HOTLINE';
    routingBox = box('Testing Determination — Testing Needed (Work From Home)',
      '<div>Work-from-home employee. <strong>Do not self-administer.</strong></div>'
      + '<div>Contact Delta on-call via Hotline: <strong>866-217-8222</strong>.</div>',
      '#fef2f2', '#fecaca');
  } else if (isDOT) {
    classification = 'RS_DOT_HOTLINE';
    routingBox = box('Testing Determination — Testing Needed (DOT: ' + role + ')',
      '<div>DOT-covered position. <strong>Do not self-administer.</strong></div>'
      + '<div>Contact Delta on-call via Hotline: <strong>866-217-8222</strong> | DOT Account: <strong>80126730</strong>.</div>',
      '#fef2f2', '#fecaca');
  } else {
    classification = 'RS_NON_DOT_TESTING';
    routingBox = box('Testing Determination — Testing Needed (NON-DOT: ' + (role || 'Unspecified') + ')',
      '<div>Set up <strong>DRUG AND ALCOHOL testing (RS Non-DOT)</strong> | DOT Account: <strong>80126731</strong>.</div>'
      + '<div>Checklist must be completed by <strong>two Delta managers</strong> (preferably one STP-trained).</div>',
      '#eef2ff', '#c7d2fe');
  }

  ZT.setTransformData('rs_testing_classification', classification);

  // ── Summary HTML ──────────────────────────────────────────────────────────
  var html = routingBox;

  html += box('Signs &amp; Symptoms Observed',
    (String(symptoms || '').trim() ? symptoms : '<em>None recorded</em>')
    + '<div style="margin-top:6px;color:#6b7280;font-size:13px;">'
    + 'Reminder: signs/symptoms must be present for testing. Custody of drug paraphernalia alone '
    + '(e.g., THC vape pen) does <strong>not</strong> validate testing.</div>',
    '#f9fafb', '#e5e7eb');

  html += box('Drug or Alcohol Use Suspected?',
    '<strong>' + (suspect || 'Not answered') + '</strong>',
    '#f9fafb', '#e5e7eb');

  ZT.setTransformData('rs_testing_summary_html', html);
}

runReasonableSuspicion();
