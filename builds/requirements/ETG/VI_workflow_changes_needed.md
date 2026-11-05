# Register Errands - VI: changes needed to match the parent tree's v43

This documents what to change in **Register Errands - VI** (tree 343115089) so it
matches the three changes just made to **Import from Register Errands - Dynamic**
(tree 856352556, sandbox-demoted copy), delivered as `Register Errands - Dynamic
(v43 - node25 guard, loop counters, debug print).json`. Nothing in the VI export
has been modified yet — this is a spec to apply by hand (or hand to Claude) in a
follow-up pass, per your request to identify and document rather than edit it now.

Of the three parent-tree changes, **two apply to VI** (the selection guard and the
debug printing) and **one does not** (loop counters) — VI has no loops of its own.

---

## 1. Customer action selection guard — APPLIES

VI has its own node 25 ("Display PNR Action Table") feeding its own node 27
("Stitch & Group PNR Action Selections"), structurally identical to the parent's
25→27 pair, so it needs the identical guard: if the agent clicks Continue with no
customer action picked for the row, redisplay node 25 instead of letting node 27
stitch an empty selection.

**One important difference from the parent tree — do not copy the parent's guard
script verbatim.** The two trees build the selection's variable name differently:

| Tree | Node 12 builds the name as | Node 27 reads it back as |
|---|---|---|
| Parent (Dynamic) | `"customer_action_" + item.pnr + "_" + rowIndex` (raw PNR, unsanitized) | same, raw |
| **VI** | `` `customer_action_${safePnr(item.pnr)}_${rowIndex}` `` where `safePnr` strips to `[a-zA-Z0-9_-]` | same, via its own `safePnr()` helper |

VI's own node 27 already carries a `safePnr()` function and a comment warning
about exactly this ("Reconstruct the EXACT select name node 12 rendered... read
it back the same way so the lookup never misses"). The new guard script must
reuse that same sanitization or it will never find a match and will always
report "nothing selected," even when the agent picked one.

### New nodes (suggested IDs: 9, 10, 11 — VI's lowest currently-unused IDs)

**Node 9 — Script — "Check Customer Action Selections"**
Continuation → 10.

```javascript
// Guard between node 25 (Display PNR Action Table) and node 27 (Stitch & Group).
// Mirrors the parent tree's node 58 (v43, corrected 2026-08-27), adapted for VI's
// sanitized variable naming - see node 27's own safePnr() comment for why this
// can't reuse the raw PNR the parent tree uses.
//
// Uses .filter() for "which rows are still blank" + a length check, NOT .some()
// ("is at least one row picked"). The parent's first cut of this guard used
// .some() and it let a partial submission through - use every()/filter() so
// EVERY row must have a pick. VI's own table only ever renders one row, so
// .some() vs .every() happened to be equivalent here, but keep the same
// (correct) pattern as the parent rather than reintroducing the bug shape.
function safePnr(pnr) {
  return String(pnr || "").replace(/[^a-zA-Z0-9_-]/g, "_");
}

let customer_action_pnrs = transforms.customer_action_pnrs || [];

let missing_customer_action_pnrs = customer_action_pnrs.filter((item, index) => {
  const variableName = `customer_action_${safePnr(item.pnr)}_${index}`;
  return String(ZT.getVariableValue(variableName, "")).trim() === "";
});

let has_customer_action_selection = customer_action_pnrs.length > 0 &&
  missing_customer_action_pnrs.length === 0;

ZT.setFormData("has_customer_action_selection", has_customer_action_selection);
ZT.setTransformData("missing_customer_action_pnrs", missing_customer_action_pnrs.map(item => item.pnr));

ZT.log("node 9 | has_customer_action_selection=" + has_customer_action_selection +
       " | rows=" + customer_action_pnrs.length +
       " | missing=" + JSON.stringify(missing_customer_action_pnrs.map(item => item.pnr)));
```

**Node 10 — Scoring — "Customer Action Selection Made?"**
Continuation → 11 (else branch, matching the house convention where a Scoring
node's `continuation_node_id` mirrors its default button).

- Button 1: text/`logic_expression` = `has_customer_action_selection == true` → link **27**
- Button 2 (default, `op:"def"`): → link **11**

**Node 11 — Content — "Please Make a Selection - Customer Action"**
Same `zt-cb-type-alert` styling as VI's own node 8 ("Please Make a Selection -
Passengers"):

```html
<div class="zt-content-block zt-cb-type-alert"><div class="zt-cb-title"><i class="zt-cb-icon" contenteditable="false"></i><h3>Please Make a Selection</h3></div><div class="zt-cb-body"><p>Please select a customer action to continue.</p><p>Missing: ${transforms.missing_customer_action_pnrs | stringify}</p></div></div>
```

- Button "Try Again" → link **25**

(VI's node 25 only ever renders one row — the combined PNR — so the copy says
"a customer action," singular, unlike the parent's "for every PNR.")

### Rewire node 25

Node 25's existing button (`"Continue"` → `27`) changes to → **9**. No other
change to node 25 itself.

---

## 2. Loop counters — DOES NOT APPLY

The parent tree's three loop counters (child ticket, grandchild ticket, errand
registration) live on nodes 32/84, 36/85, and 44/78 — none of which exist in VI.
Per VI's own claude.md ("ONE COMBINED PNR, NEVER GRANDCHILDREN" and "VI never
produces a grandchild ticket"), this subtree hands its single combined-PNR record
back to the parent at node 79 ("Return Parent"), and the parent owns every
ticket-creation and errand-registration loop. There is nothing to count here —
no change needed.

---

## 3. Debug-print API response on error/retry nodes — APPLIES

VI has exactly one "Request Failed" retry screen: **node 4**, "Get Errand
Configurations - Request Failed," gated by node 3's status check, which tests
both `actions.edvin__errand_configuration` and `actions.get_edvin_prop_long_value`.
Add both, same pattern as the parent tree's node 28 (which checks the same two
aliases):

Current node 4 content:
```html
<div class="zt-content-block zt-cb-type-alert"><div class="zt-cb-title"><i class="zt-cb-icon" contenteditable="false"></i><h3>Request Failed</h3></div><div class="zt-cb-body"><p>The <strong>Get Errand Configurations</strong> request did not complete successfully (expected a 200 or 201 response).</p><p>You can try the request again, or end this session.</p></div></div>
```

New content (insert before the closing `</div></div>`, after the existing copy):
```html
<div class="zt-content-block zt-cb-type-alert"><div class="zt-cb-title"><i class="zt-cb-icon" contenteditable="false"></i><h3>Request Failed</h3></div><div class="zt-cb-body"><p>The <strong>Get Errand Configurations</strong> request did not complete successfully (expected a 200 or 201 response).</p><p>You can try the request again, or end this session.</p><p><strong>API Response (debug):</strong></p><p>edvin__errand_configuration: ${actions.edvin__errand_configuration | stringify}</p><p>get_edvin_prop_long_value: ${actions.get_edvin_prop_long_value | stringify}</p></div></div>
```

Same production-readiness caveat as the parent tree: this exposes the raw API
response on-screen, which may include fields not meant for agent eyes. Fine for
sandbox/testing; gate or remove before this reaches agents in production.

---

## claude.md updates VI will need (node 5)

VI's claude.md is currently at v13 (2026-08-25, "Request status-check &
selection guard"). Applying the above should add a **v14** entry and section
following the same format as v13, covering:

- New nodes 9, 10, 11 and their purpose (mirrors the parent's v43 section, minus
  the loop-counter part, plus the `safePnr()` divergence callout above so a
  future author doesn't reintroduce the raw-PNR bug).
- A new Data dictionary bullet for `has_customer_action_selection` (form data),
  distinguishing it from `transforms.unresolved_selections` /
  `has_unresolved_selections` (node 27, existing per-row diagnostic that nothing
  currently routes on here either — same open item as the parent tree).
- Architecture flow line: `... -> 12 Create PNR Action Table -> 25 Display PNR
  Action Table -> 9 Check Selections -> 10 Guard -> [11 Please Make a Selection
  -> back to 25] else -> 27 Stitch & Group -> 84 Set VI Finals -> 79 Return
  Parent.`
- Changelog entry crediting this as the VI-side follow-up to the parent tree's
  v43 pass, with the node list: 5 (entry), 9(new), 10(new), 11(new), 25, 4.

---

## Summary of node touches if applied

| Tree | New nodes | Edited nodes |
|---|---|---|
| Parent (Dynamic) — **already applied** | 58, 59, 60 | 5, 14, 16, 18, 20, 25, 28, 31, 32, 36, 40, 44, 45, 50, 52, 78, 84, 85 |
| VI — **not yet applied, spec above** | 9, 10, 11 | 5, 4, 25 |
