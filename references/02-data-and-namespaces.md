# Data and namespaces — where every value lives

Two layers here: what the platform provides (from the help-center article, kept verbatim
where it matters), then the house rules for which namespace a value goes in. The house rules
win when the two disagree about *practice*; the platform section wins about *behaviour*.

Platform source: https://help.zingtree.com/hc/en-us/articles/41014766094491-CX-Actions-Namespaces-Accessing-Data-in-Zingtree
(article last edited 2025-12-24).

## The four namespaces (platform)

| Namespace | Holds | Written by | Read in scripts | Read in content / CO bodies | TTL |
|---|---|---|---|---|---|
| Form data (default) | Query params, native form fields, `ZT.setFormData` | The launch URL, content nodes, scripts | `ZT.getVariableValue("name", default)` | `${name}` / `#name#` | **none** — lives for the session |
| `transforms` | `ZT.setTransformData` | Scripts | `transforms.name` | `${transforms.name}`, `${transforms.obj.field}`, `${transforms.obj \| stringify}` | **fixed 1 hour** |
| `actions` | Connected Object responses | Data nodes (and `ZT.setResponseData`) | `actions.alias.field` | `${actions.alias.field}` | Connected Object cache TTL |
| `views` | Dynamic View selections | The agent, in a content node | `views.alias.field` / `views.alias.records[i].field` | `${views.alias.field}` | Connected Object cache TTL |

- Every namespace is also on the immutable `this` object (`ZT.log(this)` dumps it; you cannot
  assign into it).
- Form fields cannot be pre-set with a default value by the editor.
- Query parameters become form data as-is. On the editor preview URL they carry a `zv_`
  prefix: `https://zingtree.com/preview/<tree_id>?zv_zd_ticket_id=334818&zv_channel=Phone`
  arrives in the tree as `zd_ticket_id` and `channel`.
- Connected Objects auto-receive any form-data variable whose name exactly matches a
  placeholder in their request config.
- `_zt_meta.response.code` is injected into every `actions.<alias>`; `_zt_meta.response.body`
  only on a non-2xx. Array/primitive JSON roots are wrapped under `value`.

## House rule: form data first (Brent, Sep 2026)

Form data has no TTL and is reachable by name from every node type, so it is the default home
for everything a workflow produces. This supersedes the earlier "scalars → form data,
objects → transforms" split.

| Value | Write | Read |
|---|---|---|
| Scalar (string, number, boolean) | `ZT.setFormData("is_more_pnrs", true)` | `ZT.getVariableValue("is_more_pnrs", false)`; router: `is_more_pnrs == true` |
| Object or array | `ZT.setFormData("work_queue", JSON.stringify(work_queue))` | `JSON.parse(ZT.getVariableValue("work_queue", "[]"))` |
| HTML for a content node | `ZT.setFormData("ticket_card_html", html)` | Content node: `${ticket_card_html}` |
| Loop state (cursor index, current item) | `ZT.setFormData("pnr_index", i)`, `ZT.setFormData("current_pnr", JSON.stringify(pnr))` | as above |

Why: the 1-hour transforms TTL is a real production failure mode (an agent parks on a
screen, comes back, and the loop state is gone). Putting state in form data removes the
class of bug instead of adding reset machinery around it.

### The two places transforms are still required

1. **A native dynamic `select` reading its options from a variable.** The field's
   `list_dynamic_source` addresses `{type: "transforms", variable: "<name>"}`, so the
   `[{label, value}]` array must be a transform:
   `ZT.setTransformData("action_options", options)`.
2. **An object a merge field must dot-path into.** `${transforms.current_pnr.pnr}` in a
   content node or a Connected Object body works; there is no `${current_pnr.pnr}` for a
   JSON string in form data. Prefer flattening the one or two fields you actually
   interpolate into scalars (`ZT.setFormData("current_pnr_pnr", pnr.pnr)`); keep the
   transform only when a CO body genuinely needs the whole object.

Mark either use with a one-line comment naming which exception it is. Anything else in
`setTransformData` is a lint finding.

### Payloads to Connected Objects

Build the whole request body as one object in the script and stringify it once; the
Connected Object's body is then the single merge field. This is the fix Samuel Kling's
review pointed at (ETG, Aug 2026) — a hand-authored per-field JSON template with some
fields quoted and some not is what forced the `JSON.stringify(...).slice(1, -1)` hack.

```javascript
let payload = {
  orderReference: pnr.orderReference,
  channelId: pnr.channelId,
  message: errandMessage,
  providerBookingIds: pnr.providerBookingIds   // a real array, serialized once below
};
ZT.setFormData("edvin_register_errand_payload", JSON.stringify(payload));
```

Connected Object body: `${edvin_register_errand_payload}`. (Form data, no dot-path needed —
the whole string is the body.) Confirm in sandbox that the CO accepts a form-data merge
field as its entire body; if the platform insists on `${transforms.x}` there, that is
exception 2 above and the single stringify still holds.

## Reading — always `ZT.getVariableValue`

- One call, one default, the default in the type you want back (`""`, `0`, `false`, `"[]"`,
  `"{}"`). Never bare identifiers, never `this.x`, never `getVariableValue(...) || other`.
- Quoted first argument = that literal name. Unquoted = the name held in a JS variable —
  the only correct form inside a loop over generated field names:
  `let picked = ZT.getVariableValue("customer_action_" + pnr.pnr, "")`.
- Checkbox fields do not read back reliably through `getVariableValue` (an unticked box can
  read as ticked). Use a `select` for anything a script must read; evaluate checkboxes only
  with Scoring-node expressions (`(flag == 1)`), which Zingtree resolves correctly.

## Naming

- Zingtree variables (form data, transforms, `zt-data` input names): `snake_case`, noun
  phrases, suffixed by kind where it helps the reader: `*_html` (rendered), `*_index`
  (cursor), `is_*` / `has_*` (booleans), `*_payload` (stringified request body),
  `*_options` (dynamic select source).
- One name per fact across the whole tree. If `order_reference` exists, nothing else is
  allowed to call it `orderReference`, `orderRef` or `custom_field_33772689958162` — the
  seed script reads the raw inbound name once and writes the tree's name.
- Connected Object aliases (immutable once created): `system__verb_object` —
  `edvin__get_errand_configuration`, `zendesk__create_child_ticket`. Scripts read
  `actions.edvin__get_errand_configuration.channels` directly.
- JS-only identifiers: `camelCase` (`bucketByEdvinId`, `groupByErrandKey`).

## Inbound data — the seed script

Any data the launching system already knows (Zendesk/SFDC/Genesys record ids, agent,
channel, customer identifiers) arrives as query params and is form data from the first node.
The tree's root is a Script node that reads each inbound name once and writes the tree's
canonical names:

```javascript
// --- inputs (raw inbound names, read exactly once in the whole tree) --------
let zendesk_ticket_id = ZT.getVariableValue("ticket_id", "");
let contact_reason = ZT.getVariableValue("custom_field_29559177650834", "");
let channel = ZT.getVariableValue("zendeskChannelIdentifier", "");

// --- outputs (the names every later node uses) ------------------------------
ZT.setFormData("zd_ticket_id", zendesk_ticket_id);
ZT.setFormData("contact_reason", contact_reason);
ZT.setFormData("channel", channel);
```

Sanitize only what has been seen to arrive dirty (a quoted email address on Adyen, Jul
2026): `raw.replace(/[^a-zA-Z0-9]/g, "")`. Not reflexively.

Every inbound param is listed in the tree's `claude.md` node → Data dictionary, and in the
mock fixture (`03-testing-and-mock-data.md`) so a preview URL can be generated from it.

## Reset and re-entry

Because state is in form data, a second pass over the same session (Restart, "additional
request", a loop that re-runs) sees the first pass's values. One reset Script node, reached
from every re-entry path, sets every loop/state variable back to its empty shape
(`"[]"`, `"{}"`, `0`, `false`). Exactly one such node per tree — v46 had two that drifted
apart. It never touches inbound query params.

## What the old rules said, for anyone reading an older tree

- "Scalars → form data, objects → transforms" — superseded (this file).
- The `set(k, v)` dual-write helper and the `g(k)` shorthand — retired; one namespace, one
  call, no wrappers.
- "Transforms have a fixed 1-hour TTL; add a Clear Data script before restart" — still true
  for any transform you keep; the answer now is to keep almost none.
