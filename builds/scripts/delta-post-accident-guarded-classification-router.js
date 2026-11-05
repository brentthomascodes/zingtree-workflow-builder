// Source session: Delta Post Accident live bugfix, 2026-07-29 (Quest Diagnostics
//   account; follows the CR-001 unification session).
// Account/customer: Quest Diagnostics — Delta Air Lines drug & alcohol testing program
// Purpose: Node 18 "Testing Determination Routing" — the accident/damage-branch
//   classification producer, fixed after a live bug where two entry paths (the
//   immediate-DOT shortcut and the "No Testing Required" shortcut) reached the
//   final summary (node 19) without running ANY classification script, showing a
//   hardcoded "did not run" fallback instead of a real determination.
// Supersedes: delta-post-accident-testing-determination.js (missing DOT trigger +
//   no records fallback). Generalizes the isDot fix pattern from
//   delta-rs-isdot-bugfix-patch.js (a prior, narrower isDot fix in the suspicion
//   branch) into this branch's classification script.
// Fixes applied here (see Zingtree Builder/MEMORY.md, Jul 2026 — Quest/Delta Post
//   Accident, for the generalized rules these come from):
//   1. Idempotency guard at the top of run() — this script is now reachable from
//      a second inbound path (node 4, shared with the suspicion branch's "Is DOT
//      Employee?" fallback) where a sibling producer (node 7) may already have
//      staged a correct result. Without the guard, that path's valid result would
//      get silently recomputed and overwritten.
//   2. DOT trigger now tests all three conditions the upstream router ORs to reach
//      this branch (aircraft destroyed, fatalities, AND specimen requested) — the
//      prior version silently missed the third, misclassifying a
//      specimen-requested-only case as non-DOT.
//   3. `run(transforms.final_records || [])` — the prior call had no fallback;
//      `records[0]` throws on `undefined` (not just an empty array), which is
//      exactly the state on the two bypass paths above, since neither ever runs
//      the damage-type loop that populates that transform.

function g(k) { return ZT.getVariableValue(k, ''); }

function box(title, body, bg, border) {
  return '<div style="border:1px solid ' + border + ';border-radius:10px;background:' + bg + ';padding:10px 12px;margin-top:10px;font-size:14px;line-height:1.45;color:#111827;">'
    + '<div style="font-weight:700;margin-bottom:4px;">' + title + '</div>'
    + '<div>' + body + '</div></div>';
}

function run(records) {
  // Guard: if a classification producer already ran (node 7, reasonable-suspicion
  // branch) and staged a determination, don't recompute/overwrite it. Node 18 is now
  // reachable both from the accident branch (17) and from node 4's shared suspicion/
  // DOT-role inbound edge (8 -> 4 -> 18) after the node-4/12 reroute below.
  if (g('testing_summary_html')) {
    return;
  }

  // ── Step 1: DOT classification ────────────────────────────────────────────
  var dotTrigger = g('sf_Is_the_aircraft_destroyed__c') === 'Yes' ? 'Aircraft is destroyed.'
    : g('sf_Are_there_any_fatalities__c') === 'Yes' ? 'Fatalities reported.'
    : g('sf_Specimen_Requested__c') === 'Yes' ? 'Specimen requested for testing.'
    : null;

  if (dotTrigger) {
    ZT.setTransformData('testing_classification', 'DOT');
    ZT.setTransformData('testing_summary_html',
      box('DOT Classification — Immediate Action Required',
        '<div>This incident qualifies as a <strong>DOT case</strong>.</div>'
        + '<div><strong>Trigger:</strong> ' + dotTrigger + '</div>'
        + '<div>Call Delta STP: <strong>866-217-8222</strong> | Account: <strong>80126730</strong></div>',
        '#fef2f2', '#fecaca')
    );
    return;
  }

  // ── Step 2: Aggregate fields across all records ───────────────────────────
  // For fields that appear across multiple records, we take the first truthy value.
  // hours_elapsed and fault are incident-level, so read once from the first record.

  var rec0 = records[0] || {};

  var hours = parseFloat(rec0.elapsed_hours) || 0;
  var drugOnly = hours >= 8 && hours <= 32;

  // ── Step 3: "No Testing" exemptions (incident-level, not per damage type) ──
  var noTestReason = g('sf_Over_32_hours_since_incident__c') === 'Yes' ? 'More than 32 hours have elapsed — testing window has closed.'
    : g('sf_Incident_caused_by_weather__c') === 'Yes' ? 'Weather caused the incident.'
    : g('sf_Fault_due_to_mechanical_equipment_fail__c') === 'Yes' ? 'Employee not at fault — mechanical/equipment failure or another person\'s actions (verified by maintenance).'
    : g('sf_Minor_or_cosmetic_damage__c') === 'Yes' ? 'Damage was only minor/cosmetic and equipment was not taken out of service.'
    : null;

  if (noTestReason) {
    ZT.setTransformData('testing_classification', 'NON_DOT_NO_TESTING');
    ZT.setTransformData('testing_summary_html', box('No Testing Required', noTestReason, '#f9fafb', '#e5e7eb'));
    return;
  }

  // ── Step 4: Medical care deferral ─────────────────────────────────────────
  for (var m = 0; m < records.length; m++) {
    var r = records[m];
    if (r.sf_Personal_Injury__c === 'Yes' && r.injury_medical_care === 'Yes - Seeking Medical Care') {
      ZT.setTransformData('testing_classification', 'DEFERRED');
      ZT.setTransformData('testing_summary_html',
        box('Testing Deferred — Medical Care',
          'Employee is seeking medical care. Delta will contact back to request testing if employee returns within 32 hours.',
          '#fff7ed', '#fed7aa')
      );
      return;
    }
  }

  // ── Step 5: Evaluate qualifying damage types across all records ────────────
  var qualifying = [];

  for (var i = 0; i < records.length; i++) {
    var rec = records[i];

    if (rec.sf_Aircraft_Ground_Damage_Requires_Maint__c === 'Yes' && rec.sf_Aircraft_Out_of_Service__c === 'Yes')
      qualifying.push({ cat: 'Aircraft', rec: rec });

    if (rec.sf_Equip_removed_from_Service__c === 'Yes' && rec.sf_Shear_Pin_Damage__c !== 'Yes')
      qualifying.push({ cat: 'GSE (Ground Service Equipment)', rec: rec });

    if (rec.sf_Vehicle_Damage__c === 'Yes')
      qualifying.push({ cat: 'Vehicles', rec: rec });

    if (rec.sf_Airport_Property_Structural_Damage__c === 'Yes' || rec.sf_Extensive_Prop_Damage_Disrupts_Ops__c === 'Yes')
      qualifying.push({ cat: 'Property/Structure Damage', rec: rec });

    if (rec.sf_Personal_Injury__c === 'Yes')
      qualifying.push({ cat: 'Injuries', rec: rec });

    if (rec.sf_Flight_Delays__c === 'Yes')
      qualifying.push({ cat: 'Flight Delay', rec: rec });
  }

  // ── Step 6: Build summary HTML ────────────────────────────────────────────
  var isTesting = qualifying.length > 0;
  ZT.setTransformData('testing_classification', isTesting ? 'NON_DOT_TESTING' : 'NON_DOT_NO_TESTING');

  var title = isTesting
    ? (drugOnly ? 'Testing Required (Drug Only — No Alcohol)' : 'Testing Required')
    : 'Testing Not Required — No Qualifying Damage';

  var html = box('Testing Determination', '<strong>' + title + '</strong>',
    isTesting ? '#eef2ff' : '#f9fafb',
    isTesting ? '#c7d2fe' : '#e5e7eb');

  if (drugOnly && isTesting)
    html += box('Timing Notice', 'Elapsed time is 8–32 hours: <strong>drug test only</strong>, no alcohol test.', '#ecfeff', '#a5f3fc');

  var damageDetails = {
    'Aircraft': function(r) { return [
      ['Damage requires maintenance action', r.sf_Aircraft_Ground_Damage_Requires_Maint__c],
      ['Aircraft taken out of service',      r.sf_Aircraft_Out_of_Service__c],
      ['Employee at fault',                  r.aircraft_employee_fault],
    ]; },
    'GSE (Ground Service Equipment)': function(r) { return [
      ['GSE removed from service',              r.sf_Equip_removed_from_Service__c],
      ['Underwent maintenance inspection',      r.sf_Equipment_Undergo_Maintenance_Inspection__c],
      ['Only shear pin damaged',                r.sf_Shear_Pin_Damage__c],
    ]; },
    'Vehicles': function(r) { return [
      ['Vehicles damaged', r.sf_Vehicle_Damage__c],
    ]; },
    'Property/Structure Damage': function(r) { return [
      ['Airport property/structural damage',       r.sf_Airport_Property_Structural_Damage__c],
      ['Damage extensive enough to disrupt ops',   r.sf_Extensive_Prop_Damage_Disrupts_Ops__c],
    ]; },
    'Injuries': function(r) { return [
      ['Injuries involved',   r.sf_Personal_Injury__c],
      ['Medical care status', r.injury_medical_care],
    ]; },
    'Flight Delay': function(r) { return [
      ['Flight delayed due to damage', r.sf_Flight_Delays__c],
    ]; },
  };

  for (var q = 0; q < qualifying.length; q++) {
    var cat = qualifying[q].cat;
    var rec = qualifying[q].rec;
    var rows = damageDetails[cat](rec).map(function(r) {
      return '<div><strong>' + r[0] + ':</strong> ' + (r[1] || 'Not answered') + '</div>';
    }).join('');
    html += box(cat, rows, '#f9fafb', '#e5e7eb');
  }

  var notes = records
    .map(function (r) { return String(r.sf_Additional_Notes__c || '').trim(); })
    .filter(Boolean)
    .join(' | ');
    if (notes) {
        html += box('Additional Notes', notes, '#f9fafb', '#e5e7eb');
        ZT.setFormData("sf_Additional_Notes__c", notes)
    }


  ZT.setTransformData('testing_summary_html', html);
}

run(transforms.final_records || []);
