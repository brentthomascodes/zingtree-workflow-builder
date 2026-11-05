// Source session: "Reasonable suspicion testing logic" (local_619ca128-a688-4a63-851f-9dd24ad1cb47)
// Account/customer: Quest Diagnostics — Delta Air Lines drug & alcohol testing program
// Purpose: Fix for "isDot never evaluates correctly / always displays Accident /
//          Fatality". Brent's hybrid version required DOT role AND accident flag
//          (`&&`); on the accident path employee_role falls back to
//          "Accident / Fatality" (not in DOT_ROLES), so `false && (...)` was
//          always false. Fix: split into isDotRole OR isDotAccident.
//          Also fixes a stray `+` that mangled the testTitle ternary.

// ── BUGGY block (replace this) ────────────────────────────────────────────────
// var employeeRole = ZT.getVariableValue("employee_role", "Accident / Fatality")
// var symptoms     = g('suspicion_reason').trim();
// var suspect      = g('drugs_alcohol_suspicion').trim();
//
// var DOT_ROLES = ['pilot', 'flight attendant', 'mechanic', 'ground security coordinator'];
// var roleNorm  = employeeRole.toLowerCase();
// var isDot     = DOT_ROLES.indexOf(roleNorm) !== -1 && (g('major_accident').indexOf('yes') === 0
//   || g('aircraft_destroyed').indexOf('yes') === 0
//   || g('fatalities').indexOf('yes') === 0
//   || ZT.getVariableValue("is_manual_dot", "false") == "true");
// var isWFH     = roleNorm === 'work from home employee';
// var hotlineRequired = isDot || isWFH;

// ── FIXED block ───────────────────────────────────────────────────────────────
var employeeRole = ZT.getVariableValue("employee_role", "Accident / Fatality").trim();
var symptoms     = g('suspicion_reason').trim();
var suspect      = g('drugs_alcohol_suspicion').trim();

var DOT_ROLES = ['pilot', 'flight attendant', 'mechanic', 'ground security coordinator'];
var roleNorm  = employeeRole.toLowerCase();

var isDotRole = DOT_ROLES.indexOf(roleNorm) !== -1;
var isDotAccident =
     g('major_accident').indexOf('yes') === 0
  || g('aircraft_destroyed').indexOf('yes') === 0
  || g('fatalities').indexOf('yes') === 0
  || ZT.getVariableValue('is_manual_dot', 'false') == 'true';

var isDot = isDotRole || isDotAccident;   // DOT role OR accident/manual flag
var isWFH = roleNorm === 'work from home employee';
var hotlineRequired = isDot || isWFH;

// ── Title ternary fix ─────────────────────────────────────────────────────────
// BUGGY (stray `+` before isDot mangles the ternary):
//   + (isWFH ? ' (Work From Home)' :  + isDot ? ' (DOT: ' + employeeRole + ')' : ' (NON-DOT: ' + (employeeRole || 'Unspecified') + ')');
// FIXED:
//   + (isWFH ? ' (Work From Home)' : isDot ? ' (DOT: ' + employeeRole + ')' : ' (NON-DOT: ' + (employeeRole || 'Unspecified') + ')');

// Open decision from session: with isDotAccident in the mix, a WFH employee who
// also has an accident flag will be classed DOT (isDot is checked before isWFH
// in resultLine/routingText ternaries). Reorder if WFH should always win.
