// Source session: "Reasonable suspicion testing logic" (local_619ca128-a688-4a63-851f-9dd24ad1cb47)
// Account/customer: Quest Diagnostics — Delta Air Lines drug & alcohol testing program
// Purpose: Delta Post-Accident "Sample Collection Instructions" summary + SFDC
//          payload Script Node. Airport-based routing (CA oral fluid, MN blood
//          confirmation, JFK/LGA + Concentra/Citimed provider sequencing), builds
//          final HTML + text summaries and sets sf_* SFDC fields.
// Note: Brent's pre-existing production code, pasted into the session verbatim.

function g(k) { return ZT.getVariableValue(k, ''); }
function set(k, v) { ZT.setFormData(k, v); ZT.setTransformData(k, v); }

function escapeHtml(v) {
  return String(v || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function infoRow(label, value) {
  return '<div style="display:flex;gap:10px;padding:8px 0;border-bottom:1px solid #eef2f7;">'
    + '<div style="width:190px;min-width:190px;font-weight:700;color:#111827;">' + escapeHtml(label) + '</div>'
    + '<div style="flex:1;color:#374151;">' + escapeHtml(value) + '</div></div>';
}

function card(title, body, tone) {
  var bg = tone === 'warning' ? '#fff7ed' : tone === 'action' ? '#fef2f2' : '#eef2ff';
  var border = tone === 'warning' ? '#fed7aa' : tone === 'action' ? '#fecaca' : '#c7d2fe';
  var tc = tone === 'warning' ? '#9a3412' : tone === 'action' ? '#991b1b' : '#3730a3';
  return '<div style="border:1px solid ' + border + ';background:' + bg + ';border-radius:12px;padding:12px;margin-top:10px;">'
    + '<div style="font-weight:800;color:' + tc + ';margin-bottom:4px;">' + escapeHtml(title) + '</div>'
    + '<div style="color:#374151;line-height:1.45;">' + escapeHtml(body) + '</div></div>';
}

// ── Inputs ────────────────────────────────────────────────────────────────────
var isDot = g('major_accident').indexOf('yes') === 0
         || g('aircraft_destroyed').indexOf('yes') === 0
         || g('fatalities').indexOf('yes') === 0;

var sfAccountNumber = isDot ? '80126730' : '80126731';
var sfAuthority     = isDot ? 'DOT' : 'NDOT';

var airportCode  = (g('sf_Airport_Code__c') || g('airport_code') || g('incident_location')).trim().toUpperCase();
var employeeRole = g('employee_role').trim();
var roleNorm     = employeeRole.toLowerCase();

var isPilot = roleNorm === 'yes - pilot'
           || roleNorm === 'yes - flight attendant'
           || roleNorm.indexOf('pilot') !== -1
           || roleNorm.indexOf('flight attendant') !== -1;

var deltaCallText = isPilot
  ? 'Yes — Call 866-217-8222 for Delta STP managers'
  : 'No Delta STP manager call required from employee role.';

// ── Airport routing ───────────────────────────────────────────────────────────
var supportedAirports = [
  'ATL','AUS','BNA','BOS','BWI','CLE','CLT','CMH','CVG','DAL','DCA','DEN','DFW','DTW',
  'EWR','FLL','HNL','HOU','IAD','IAH','IND','JAX','JFK','LAS','LAX','LGA','MCI','MCO',
  'MDW','MEM','MIA','MKE','MSP','MSY','OAK','ONT','ORD','PBI','PDX','PHL','PHX','PIT',
  'RDU','SAN','SAT','SAV','SEA','SFO','SJC','SLC','SMF','SNA','STL','TPA','TUS'
];
var caAirports        = ['LAX','OAK','ONT','SAN','SFO','SJC','SMF','SNA'];
var mnAirports        = ['MSP'];
var jfkLgaAirports    = ['JFK','LGA'];
var concentraAirports = ['ATL','DTW','LAX','PHX'];
var citimedAirports   = ['JFK'];

var baseNotes     = [];
var providerNotes = [];
var teamNotes     = [];

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

if (!baseNotes.length)     teamNotes.push('No base/city-specific drug or alcohol handling rule identified for this airport.');
if (!providerNotes.length) teamNotes.push('No special provider sequencing rule identified for this airport.');

var baseText     = baseNotes.length     ? baseNotes.join(' ')     : 'No base/city-specific drug or alcohol handling rule identified for this airport.';
var providerText = providerNotes.length ? providerNotes.join(' ') : 'No special provider sequencing rule identified for this airport.';
var teamText     = teamNotes.length     ? teamNotes.join(' ')     : 'No additional collection-team notes identified.';

// ── Testing summary passthrough from run(records) ─────────────────────────────
var testingHtml = ZT.getVariableValue('testing_summary_html', '').trim()
  || '<div style="border:1px solid #fecaca;border-radius:10px;background:#fef2f2;padding:10px 12px;margin-top:10px;font-size:14px;color:#111827;">'
   + '<div style="font-weight:700;margin-bottom:4px;">Testing Summary Unavailable</div>'
   + '<div>The testing determination script did not run or produced no output.</div></div>';

var testingText = ZT.getVariableValue('testing_summary_text', '').trim()
  || 'Testing Determination\nResult: Unavailable — testing determination script did not run or produced no output.\n';

// ── Build final HTML ──────────────────────────────────────────────────────────
var html = '<div style="font-family:Arial,sans-serif;max-width:760px;color:#111827;">'
  + testingHtml
  + '<div style="border:1px solid #e5e7eb;border-radius:16px;background:#ffffff;box-shadow:0 4px 14px rgba(15,23,42,0.06);padding:16px;box-sizing:border-box;">'
  + '<div style="display:flex;justify-content:space-between;align-items:center;gap:12px;margin-bottom:12px;">'
  + '<div style="font-size:18px;font-weight:800;color:#111827;">Sample Collection Instructions</div>'
  + '<div style="font-size:12px;font-weight:800;color:#3730a3;background:#eef2ff;border:1px solid #c7d2fe;border-radius:999px;padding:6px 10px;white-space:nowrap;">' + escapeHtml(airportCode || 'Airport Unknown') + '</div>'
  + '</div>'
  + '<div style="border:1px solid #eef2f7;border-radius:12px;padding:4px 12px;background:#fbfdff;">'
  + infoRow('Airport Code',   airportCode   || 'Not answered')
  + infoRow('Employee Role',  employeeRole  || 'Not answered')
  + infoRow('Account Number', sfAccountNumber)
  + infoRow('Authority Type', sfAuthority)
  + '<div style="display:flex;gap:10px;padding:8px 0;">'
  + '<div style="width:190px;min-width:190px;font-weight:700;color:#111827;">Delta STP Call</div>'
  + '<div style="flex:1;color:#374151;">' + escapeHtml(deltaCallText) + '</div></div>'
  + '</div>';

if (isPilot) html += card('Action Required', 'Call 866-217-8222 for Delta STP managers.', 'action');

html += card('Base / City Specifics', baseText,     baseNotes.length     ? 'warning' : 'info');
html += card('Provider Routing',      providerText, providerNotes.length ? 'warning' : 'info');
html += card('Collection Team Notes', teamText,     'info');
html += '</div></div>';

// ── Build final text ──────────────────────────────────────────────────────────
var text = testingText + '\n'
  + 'Sample Collection Instructions\n'
  + 'Airport Code: '        + (airportCode   || 'Not answered') + '\n'
  + 'Employee Role: '       + (employeeRole  || 'Not answered') + '\n'
  + 'Account Number: '      + sfAccountNumber + '\n'
  + 'Authority Type: '      + sfAuthority     + '\n'
  + 'Delta STP Call: '      + deltaCallText   + '\n'
  + 'Base / City Specifics: ' + baseText      + '\n'
  + 'Provider Routing: '    + providerText    + '\n'
  + 'Collection Team Notes: ' + teamText      + '\n';

// ── Outputs ───────────────────────────────────────────────────────────────────
set('sf_Account_Number__c',               sfAccountNumber);
set('sf_Delta_Post_Accident_Authority__c', sfAuthority);
set('sf_Airport_Code__c',                 airportCode);
set('delta_stp_call_required',            isPilot ? 'Yes' : 'No');
set('delta_stp_call_message',             isPilot ? 'Call 866-217-8222 for Delta STP managers' : '');
set('base_city_specific_instructions',    baseText);
set('provider_routing_instructions',      providerText);
set('collection_team_notes',              teamText);
set('testing_summary_html',               testingHtml);
set('testing_summary_text',               testingText);
set('sample_collection_summary_html',     html);
set('sample_collection_summary_text',     text);
set('final_print_summary_html',           html);
set('final_print_summary_text',           text);
