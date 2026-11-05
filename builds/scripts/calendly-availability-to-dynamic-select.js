// Source session: Vermasoft workflow streamlining (2026-07-21)
// Account: Vermasoft  ·  Tree: Basic Receptionist (862603108) node 9
// Purpose: Turn a Calendly Connected Object response (actions.calendly.collection) into a native dynamic-select source: transforms.calendly_slots = [{label,value}], calendly_has_slots boolean for the router, and an empty-state notice. Degrades gracefully when the Connected Object is not yet wired.
// House rules embodied: lean code (ZT.getVariableValue fallback, no normalization/over-guarding),
//   only-referenced variables, script-before-router (sets a boolean the router tests).

// Node 89 - Turn the Calendly response into a list of selectable slots for node 91's
// dropdown. Stages calendly_slots, the boolean the router (node 92) tests, and an
// empty-state notice for when no times came back.
var times = (actions.calendly && actions.calendly.collection) || [];

var slots = [];
for (var i = 0; i < times.length; i++) {
  var t = times[i];
  var value = t.start_time || t.scheduling_url;
  if (value) slots.push({ label: t.start_time || value, value: value });
}

ZT.setTransformData("calendly_slots", slots);
ZT.setFormData("calendly_has_slots", slots.length > 0);
ZT.setTransformData("calendly_notice_html", slots.length ? "" :
  '<div style="border:1px solid #fed7aa;background:#fff7ed;border-radius:8px;padding:12px;color:#9a3412;font-size:14px;">No open Calendly times came back. Offer to take a preferred day/time and follow up.</div>');
