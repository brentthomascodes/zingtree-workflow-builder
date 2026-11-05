// Source session: Delta Post Accident CR-001 unification, 2026-07-29 (Quest
//   Diagnostics account).
// Account/customer: Quest Diagnostics — Delta Air Lines drug & alcohol testing program
// Purpose: Node 19 "Finalize Determination & Stage SF Payload" — the single shared
//   finalize engine consumed by BOTH the accident/damage branch (fed by
//   delta-post-accident-guarded-classification-router.js, node 18) and the
//   reasonable-suspicion branch (fed by node 7). Computes the canonical DOT/
//   account-number rule once, runs the shared airport-routing tables once, and
//   stages the final summary + SF payload once — instead of each branch
//   duplicating all of that verbatim.
// Supersedes: delta-rs-collection-sfdc-payload.js, delta-post-accident-collection-
//   sfdc-payload.js, delta-rs-collection-selfcontained.js — the old per-branch
//   finalize scripts this consolidation replaced. Keep those for historical
//   reference only; new work should build on this file.
// Data-setting note (fixed 2026-07-29): outputs are split HTML -> setTransformData
//   only, scalars -> setFormData only, per the house rule in Zingtree Builder/
//   MEMORY.md. An earlier draft of this script dual-wrote everything through both
//   stores via a shared set() helper inherited verbatim from the old node 32/51
//   scripts; that legacy pattern predates this build and was corrected here.
// Depends on the idempotency-guard + trigger-set-mirroring rules documented in
//   Zingtree Builder/MEMORY.md (Jul 2026 — Quest/Delta Post Accident) and
//   Skill Source/references/patterns.md, Node-reduction playbook, levers 6-7 —
//   see delta-post-accident-guarded-classification-router.js for the producer
//   half of this pair.

// Inputs expected already captured upstream (node 2, before the branch fork):
//   employee_role, sf_Airport_Code__c, sf_Member_ID_Number__c, sf_Internal_Notes__c
// Inputs from the classification producers (node 18 or node 7):
//   testing_summary_html, testing_summary_text

function g(k) { return ZT.getVariableValue(k, ''); }

function escapeHtml(v) {
  return String(v || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function infoRow(label, value) {
  return '<div style="display:flex;gap:10px;padding:8px 0;border-bottom:1px solid #eef2f7;">'
    + '<div style="width:190px;min-width:190px;font-weight:700;color:#111827;">' + escapeHtml(label) + '</div>'
    + '<div style="flex:1;color:#374151;">' + escapeHtml(value) + '</div></div>';
}

function card(title, body, tone) {
  const bg = tone === 'warning' ? '#fff7ed' : tone === 'action' ? '#fef2f2' : '#eef2ff';
  const border = tone === 'warning' ? '#fed7aa' : tone === 'action' ? '#fecaca' : '#c7d2fe';
  const tc = tone === 'warning' ? '#9a3412' : tone === 'action' ? '#991b1b' : '#3730a3';
  return '<div style="border:1px solid ' + border + ';background:' + bg + ';border-radius:12px;padding:12px;margin-top:10px;">'
    + '<div style="font-weight:800;color:' + tc + ';margin-bottom:4px;">' + escapeHtml(title) + '</div>'
    + '<div style="color:#374151;line-height:1.45;">' + escapeHtml(body) + '</div></div>';
}

// ── Canonical DOT rule (R13) — one rule, both branches ────────────────────────
const DOT_ROLES = ['pilot', 'flight attendant', 'mechanic', 'ground security coordinator'];
const employeeRole = g('employee_role').trim();
const roleNorm = employeeRole.toLowerCase();

const isDotRole = DOT_ROLES.indexOf(roleNorm) !== -1;
const isDotAccident = g('sf_Specimen_Requested__c') === 'Yes'
  || g('sf_Is_the_aircraft_destroyed__c') === 'Yes'
  || g('sf_Are_there_any_fatalities__c') === 'Yes'
  || g('is_manual_dot') === 'true';

const isDot = isDotRole || isDotAccident;
const isWFH = roleNorm === 'work from home employee';
const hotlineRequired = isDot || isWFH;

const sfAccountNumber = hotlineRequired ? '80126730' : '80126731';
const sfAuthority = isDot ? 'DOT' : 'NDOT';

// "Call Delta STP" messaging now driven by the canonical isDot flag (was node 32's
// narrower pilot/flight-attendant-only substring match). WFH keeps its own hotline
// text; WFH is checked first so an employee flagged both WFH and DOT-accident sees
// the WFH hotline message (Assumption A2 — preserves node 51's existing precedence).
const deltaCallText = isWFH
  ? 'Yes — Call 866-217-8222 for Delta on-call (Work From Home)'
  : isDot
    ? 'Yes — Call 866-217-8222 for Delta STP managers'
    : 'No Delta STP manager call required from employee role.';

const actionRoutingText = isWFH
  ? 'Work-from-home employee. Call 866-217-8222 for Delta on-call. Do not self-administer.'
  : isDot
    ? 'DOT-covered position (' + (employeeRole || 'DOT') + '). Call 866-217-8222 for Delta STP managers. Do not self-administer.'
    : 'NON-DOT. Complete the Reasonable Suspicion checklist with two Delta managers (preferably one STP-trained) when applicable. Account ' + sfAccountNumber + '.';

const airportCode = g('sf_Airport_Code__c').trim().toUpperCase();
const internalNotes = g('sf_Internal_Notes__c').trim();

// ── Airport routing (shared — was duplicated verbatim in nodes 32 & 51) ───────
const supportedAirports = [
  'ATL','AUS','BNA','BOS','BWI','CLE','CLT','CMH','CVG','DAL','DCA','DEN','DFW','DTW',
  'EWR','FLL','HNL','HOU','IAD','IAH','IND','JAX','JFK','LAS','LAX','LGA','MCI','MCO',
  'MDW','MEM','MIA','MKE','MSP','MSY','OAK','ONT','ORD','PBI','PDX','PHL','PHX','PIT',
  'RDU','SAN','SAT','SAV','SEA','SFO','SJC','SLC','SMF','SNA','STL','TPA','TUS'
];
const caAirports = ['LAX','OAK','ONT','SAN','SFO','SJC','SMF','SNA'];
const mnAirports = ['MSP'];
const jfkLgaAirports = ['JFK','LGA'];
const concentraAirports = ['ATL','DTW','LAX','PHX'];
const citimedAirports = ['JFK'];

const baseNotes = [];
const providerNotes = [];
const teamNotes = [];

if (airportCode && supportedAirports.indexOf(airportCode) === -1)
  teamNotes.push('Airport code was not found in the supported Delta airport list. Review manually.');
if (caAirports.indexOf(airportCode) !== -1)
  baseNotes.push('California: Use Non-DOT oral fluid drug test rather than urine.');
if (mnAirports.indexOf(airportCode) !== -1)
  baseNotes.push('Minnesota: For Non-DOT alcohol testing, screening test is Breath Alcohol. If positive, the confirmation test is a blood draw and a phlebotomist is needed.');
if (jfkLgaAirports.indexOf(airportCode) !== -1)
  providerNotes.push('JFK/LGA base: Exam One is preferred, ADTS is second choice, and Citimed clinic is the last alternative.');
if (concentraAirports.indexOf(airportCode) !== -1)
  providerNotes.push(airportCode + ': Use Concentra services before dispatching a mobile collector.');
if (citimedAirports.indexOf(airportCode) !== -1)
  providerNotes.push('JFK: Use Citimed services before dispatching a mobile collector.');
if (!baseNotes.length) teamNotes.push('No base/city-specific drug or alcohol handling rule identified for this airport.');
if (!providerNotes.length) teamNotes.push('No special provider sequencing rule identified for this airport.');

const baseText = baseNotes.length ? baseNotes.join(' ') : 'No base/city-specific drug or alcohol handling rule identified for this airport.';
const providerText = providerNotes.length ? providerNotes.join(' ') : 'No special provider sequencing rule identified for this airport.';
const teamText = teamNotes.length ? teamNotes.join(' ') : 'No additional collection-team notes identified.';

// ── Classification producer passthrough (node 18 accident engine or node 7 suspicion engine) ──
const testingHtml = g('testing_summary_html').trim()
  || '<div style="border:1px solid #fecaca;border-radius:10px;background:#fef2f2;padding:10px 12px;margin-top:10px;font-size:14px;color:#111827;">'
   + '<div style="font-weight:700;margin-bottom:4px;">Testing Summary Unavailable</div>'
   + '<div>The testing determination script did not run or produced no output.</div></div>';

const testingText = g('testing_summary_text').trim()
  || 'Testing Determination\nResult: Unavailable — testing determination script did not run or produced no output.\n';

// ── Build final HTML ───────────────────────────────────────────────────────────
let html = '<div style="font-family:Arial,sans-serif;max-width:760px;color:#111827;">'
  + testingHtml
  + '<div style="border:1px solid #e5e7eb;border-radius:16px;background:#ffffff;box-shadow:0 4px 14px rgba(15,23,42,0.06);padding:16px;box-sizing:border-box;">'
  + '<div style="display:flex;justify-content:space-between;align-items:center;gap:12px;margin-bottom:12px;">'
  + '<div style="font-size:18px;font-weight:800;color:#111827;">Sample Collection Instructions</div>'
  + '<div style="font-size:12px;font-weight:800;color:#3730a3;background:#eef2ff;border:1px solid #c7d2fe;border-radius:999px;padding:6px 10px;white-space:nowrap;">' + escapeHtml(airportCode || 'Airport Unknown') + '</div>'
  + '</div>'
  + '<div style="border:1px solid #eef2f7;border-radius:12px;padding:4px 12px;background:#fbfdff;">'
  + infoRow('Airport Code', airportCode || 'Not answered')
  + infoRow('Employee Role', employeeRole || 'Not answered')
  + infoRow('Account Number', sfAccountNumber)
  + infoRow('Authority Type', sfAuthority)
  + infoRow('Delta STP Call', deltaCallText)
  + '</div>';

html += hotlineRequired
  ? card('Action Required', actionRoutingText, 'action')
  : card('NON-DOT Checklist', actionRoutingText, 'info');

html += card('Base / City Specifics', baseText, baseNotes.length ? 'warning' : 'info');
html += card('Provider Routing', providerText, providerNotes.length ? 'warning' : 'info');
html += card('Collection Team Notes', teamText, 'info');
if (internalNotes) html += card('Internal Notes', internalNotes, 'info');
html += '</div></div>';

// ── Build final text ───────────────────────────────────────────────────────────
let text = testingText + '\n'
  + 'Sample Collection Instructions\n'
  + 'Airport Code: ' + (airportCode || 'Not answered') + '\n'
  + 'Employee Role: ' + (employeeRole || 'Not answered') + '\n'
  + 'Account Number: ' + sfAccountNumber + '\n'
  + 'Authority Type: ' + sfAuthority + '\n'
  + 'Delta STP Call: ' + deltaCallText + '\n'
  + 'Base / City Specifics: ' + baseText + '\n'
  + 'Provider Routing: ' + providerText + '\n'
  + 'Collection Team Notes: ' + teamText + '\n'
  + (internalNotes ? 'Internal Notes: ' + internalNotes + '\n' : '');

// ── Outputs — sf_*__c fields are the SFDC payload, read back out-of-band by the
// Salesforce embed after the session (no in-tree Connected Object; see claude.md).
// Per house rule (Zingtree Builder/MEMORY.md): HTML -> setTransformData only;
// simple string/number/boolean scalars -> setFormData only. (Fixed 2026-07-29 --
// the prior draft dual-wrote everything through both stores via a shared set()
// helper inherited verbatim from the pre-existing node 32/51 scripts; that
// legacy pattern predates this build and isn't the house rule for NEW code.)
ZT.setFormData('sf_Account_Number__c', sfAccountNumber);
ZT.setFormData('sf_Delta_Post_Accident_Authority__c', sfAuthority);
ZT.setFormData('sf_Reasonable_Suspicion_Authority__c', sfAuthority);
ZT.setFormData('sf_Airport_Code__c', airportCode);
ZT.setFormData('sf_Employee_Role__c', employeeRole);
ZT.setFormData('sf_Suspicion_Reason__c', g('suspicion_reason').trim());
ZT.setFormData('sf_Drug_Alcohol_Suspected__c', g('drugs_alcohol_suspicion').trim());
ZT.setFormData('base_city_specific_instructions', baseText);
ZT.setFormData('provider_routing_instructions', providerText);
ZT.setFormData('collection_team_notes', teamText);
ZT.setFormData('testing_summary_text', testingText);
ZT.setFormData('sample_collection_summary_text', text);
ZT.setFormData('final_print_summary_text', text);

ZT.setTransformData('testing_summary_html', testingHtml);
ZT.setTransformData('sample_collection_summary_html', html);
ZT.setTransformData('final_print_summary_html', html);
