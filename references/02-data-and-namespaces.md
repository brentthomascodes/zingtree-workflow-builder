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
  prefix: `https://eu.zingtree.com/preview/<tree_id>?zv_zd_ticket_id=334818&zv_channel=Phone`
  arrives in the tree as `zd_ticket_id` and `channel` (EU orgs; US orgs use `zingtree.com`).
- Connected Objects auto-receive any form-data variable whose name exactly matches a
  placeholder in their request config.
- `_zt_meta.response.code` is injected into every `actions.<alias>`; `_zt_meta.response.body`
  only on a non-2xx. Array/primitive JSON roots are wrapped under `value`.

## House rule: form data first (Brent, Sep 2026)

Form data has no TTL and is reachable by name from every node type, so it is the default home
for the *state* a workflow produces. This supersedes the earlier "scalars → form data,
objects → transforms" split.

| Value | Write | Read |
|---|---|---|
| Scalar (string, number, boolean) | `ZT.setFormData("is_more_pnrs", true)` | `ZT.getVariableValue("is_more_pnrs", false)`; router: `is_more_pnrs == true` |
| Object or array | `ZT.setFormData("work_queue", JSON.stringify(work_queue))` | `JSON.parse(ZT.getVariableValue("work_queue", "[]"))` |
| Loop state (cursor index, current item) | `ZT.setFormData("pnr_index", i)`, `ZT.setFormData("current_pnr", JSON.stringify(pnr))` | as above |
| Reference list used in more than one place | declared once in the seed script: `ZT.setFormData("contact_reasons", JSON.stringify(list))` | `JSON.parse(ZT.getVariableValue("contact_reasons", "[]"))` — form data also crosses the Tree-node boundary into subtrees |
| Plain text printed on a screen (a reason, a raw field value) | `ZT.setFormData("ai_exception_reason", reason)` | `${ai_exception_reason}` |
| **HTML for a content node** | **`ZT.setTransformData("ticket_card_html", html)`** — see below | Content node: `${transforms.ticket_card_html}` |

Why: the 1-hour transforms TTL is a real production failure mode (an agent parks on a
screen, comes back, and the loop state is gone — ETG's Transfer pick-up needs an "expired"
branch because its ticket loop still lives in transforms). Putting state in form data removes
the class of bug instead of adding reset machinery around it.

### Rendered HTML goes to transforms (supersedes "HTML to form data", Sep 2026 — Corpay UK, ETG)

Every HTML block a content node renders is written with `ZT.setTransformData("x_html", html)`
and rendered as `${transforms.x_html}`. A form-data merge field does not reliably render
markup: on the Corpay UK validation screen the select survived but the checkbox inputs were
dropped, leaving the checklist as one run of text and a required field unanswerable (live,
Sep 2026, roughly every other case), and form-data merges turn newlines into `<br>`. Every
block that demonstrably renders in both reference trees is a transform, as in Zingtree's own
Dynamic HTML article. The earlier form-data rule was asserted, never demonstrated live.

- **Collapse the string to one line before storing it** — `html.replace(/\s*\n\s*/g, " ")`.
  Newlines in a merge field have rendered as `<br>` and broken grid layouts.
- A value that is a *payload*, not a screen (the email body a send template reads), stays
  form data even when it contains HTML.
- Open question: a block that must outlive the 1-hour TTL (ETG's share link, read by a
  receiving agent hours later) was put in form data as an experiment. If it renders as text,
  move it to a transform and accept the expiry.

### Where transforms are still required

1. **Rendered HTML** (above).
2. **A native dynamic `select` reading its options from a variable.** The field's
   `list_dynamic_source` addresses `{type: "transforms", variable: "<name>"}`, so the
   `[{label, value}]` array must be a transform: `ZT.setTransformData("action_options", options)`.
   Derive it from the canonical list, never retype the list. Put the suggested option first.
3. **An object a merge field must dot-path into.** `${transforms.current_pnr.pnr}` works;
   there is no `${current_pnr.pnr}` for a JSON string in form data. Prefer flattening the one
   or two fields you interpolate into scalars; keep the transform only when a template
   genuinely needs the whole object.
4. **A value a Connected Object template merges that must be pre-shaped** — an array as JSON
   text, or a free-text value escaped for a quoted slot (next section).

Mark cases 3 and 4 with a one-line comment naming the consumer. `lint_tree.py` flags any
transform nothing in the export reads as `transforms.<name>`; a CO template is invisible to
it, so record that consumer in claude.md.

### Connected Object request bodies — the Connected Object owns the body (supersedes "one object, stringified once", Sep 2026 — Corpay UK, ETG)

The Connected Object's body is a literal JSON template with **one merge per value**. The tree
never builds the whole body. A script's only job is to stage the values the template reads
that nothing else in the session already produces.

```
{"inputs":[{"emailAddresses":"${actions.<case alias>.records[0].SuppliedEmail}",
 "ccAddresses":${transforms.ccAddresses},
 "emailSubject":"${transforms.email_subject_json}",
 "emailBody":"${transforms.email_body_json}",
 "relatedRecordId":"${caseId}",
 "senderAddress":"${ai_email_from_address}"}]}
```

- **Scalars sit inside quotes; arrays and objects sit bare.** A template reads any namespace
  directly, including `${actions.<alias>.records[0].<Field>}`.
- **Zingtree does not escape merge values.** A free-text value with quotes, backslashes or
  line breaks (an HTML body always has them) makes the rendered body invalid JSON, and
  Zingtree then sends the whole body as an escaped string — Salesforce answers
  `JSON_PARSER_ERROR ... at [line:1, column:3]`. Stage each free-text value escaped for its
  quoted slot: `ZT.setTransformData("email_body_json", JSON.stringify(html_body).slice(1, -1))`.
  That is the only legitimate use of `.slice(1, -1)`; say so in a comment.
- **A bare merge must always resolve to valid JSON on its own.** Stage an array as JSON
  *text*, `"[]"` when empty: a real empty array merges as nothing (`"ccAddresses": ,`), and a
  quoted array double-quotes its contents.
- **The whole body in one variable failed every way it was tried** (Corpay UK, three live
  failures in one day): a `JSON.stringify`'d string arrived escaped (`{\"inputs\":...}`), a bare
  object arrived as Go map syntax (`map[inputs:[map[...]]]`), and `${x | stringify}` was
  escaped again. ETG's errand-register call landed in the same place: its whole-payload builder
  was never wired up, and the CO still reads a per-field template with the message escaped for
  its slot.
- To isolate a failing request, take Zingtree out of the loop: send the rendered payload from
  the target's own tool (Salesforce Workbench as the integration user) and add inputs back one
  at a time. That is how a Corpay UK `UNKNOWN_EXCEPTION` was traced to one case id.

### Record fields go through the marketplace app, not a request (Brent, Sep 2026 — Corpay UK)

The Zingtree Salesforce / Zendesk marketplace apps move record fields in and out. A record
field declared as a predefined variable (`sf_Topic__c`, `sf_Origin`, `sf_Energy_Provider__c`;
the record id arrives as `sf_Id`) is read into form data at launch, and when the session sets
it the app writes it back to that field on the record. A case/ticket field *update* therefore
never belongs in a Connected Object template or SOQL: predefine the variable and set it in the
tree. The record id appears in a template only where the API itself needs it as a key (the
send's `relatedRecordId`, a query's `WHERE Id =`). A new record field is one predefined variable. The lint treats
predefined variables as read — the app is their consumer.

Restricted picklists are matched character for character, typos included. Carry the values
verbatim from the customer's list and never "correct" one.

### No duplicate storage — one write, one name, verify before mirroring

Don't write the same conceptual value under two names, and don't mirror a value into both
form data and transforms "just in case" or out of habit. Every extra write costs a reader
the job of figuring out which copy is current — and the two *will* drift the day one path
updates one copy and not the other.

(Found live in the VI Dynamic tree, Sep 2026: a node wrote `combined_pnr_record` to
`transforms`, then wrote `current_pnr` right after it with the same value, then a *third*
node wrote a `combined_pnr` transform and mirrored that into form data too — three names for
one fact, only one of which anything downstream actually read. All retired to the single
name that was genuinely consumed.)

- One variable, one write site, one name, for the life of the tree. If a later node needs a
  different *shape* of the same fact (say, the whole record vs. just its `pnr` string),
  derive the derived value at the point that needs it — don't pre-compute and store both
  copies "in case something needs it."
- Before adding a second write of an existing value under a new name, grep the whole tree
  for every read of the existing name first (`getVariableValue("name"`, `transforms.name`,
  `${name}`, `${transforms.name...}`). If nothing downstream reads the old name, delete it
  instead of adding a new one alongside it.
- A value is only allowed to live in both namespaces (form data *and* transforms) when a
  real, verified consumer needs it in each — e.g. a Connected Object body reads the
  form-data copy while a content node dot-paths into the transform copy. "Might need it
  later" is not a verified consumer. Mark a genuine mirror with a one-line comment naming
  the specific consumer on each side, so the next person doesn't mistake it for the same
  anti-pattern and either "fix" it or copy it elsewhere.
- Same discipline applies to plain renaming: if `current_pnr` already holds a fact, nothing
  else in the tree gets to also call it `combined_pnr_record`, `pnr_snapshot`, or any other
  alias. This is the write-side twin of "One name per fact" above — that rule covers reads
  colliding on inconsistent names; this one covers a single fact being written under more
  than one name in the first place.

## Reading — always `ZT.getVariableValue`

The engine also exposes form data as bare globals inside scripts (`agent_email` resolves),
which is why older trees read that way. Don't: a missing bare name throws, and the read is
invisible to anyone grepping for `getVariableValue`.

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
  phrases, suffixed by kind where it helps the reader: `*_html` (rendered, a transform),
  `*_index` (cursor), `is_*` / `has_*` (booleans), `*_json` (a value escaped for a quoted slot
  in a Connected Object template), `*_options` (dynamic select source). `*_payload` (a whole
  stringified body) is retired with the whole-body pattern.
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

Environment-specific inbound names (a Zendesk org's `custom_field_<id>`) are read here and
nowhere else; the write-back after the intake screen and `predefined_vars` are the other two
places they appear (`11-environments-and-promotion.md`).

A value the first agent to open the record should own (the assignee of every record the
session creates) is set once and never overwritten by a later viewer:
`if (ZT.getVariableValue("initial_agent_id", "") === "") ZT.setFormData("initial_agent_id", ZT.getVariableValue("zd_agent_id", ""));`
(ETG, Sep 2026).

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
- "HTML to form data, rendered as `${x_html}`" (early Sep 2026) — superseded: HTML is a transform.
- "Build the whole CO body as one object, stringify once, merge it as the body" — superseded:
  the Connected Object owns a per-value template.
- The `set(k, v)` dual-write helper and the `g(k)` shorthand — retired; one namespace, one
  call, no wrappers.
- "Transforms have a fixed 1-hour TTL; add a Clear Data script before restart" — still true
  for any transform you keep; the answer now is to keep almost none.
