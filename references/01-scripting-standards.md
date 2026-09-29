# Script node standard

This is the house standard for every Script node. It replaces every earlier note about
"minimal", "plain", or "defensive" code — those were aspirations; this is the contract.
Every rule below was written against a real script that shipped the wrong way on the ETG
"Register Errands - Dynamic" tree (v46, Sep 2026), so each one carries the before/after.

The target reader is a competent junior engineer. They should read a script once, top to
bottom, and be able to say what goes in, what comes out, and what the next node will see.

## 1. Shape of every script

A script node is one ETL step. It reads its inputs, transforms them, writes its outputs.
In that order, visibly, without helpers standing between the reader and the data.

```javascript
// --- inputs -----------------------------------------------------------------
let selected_pnrs = JSON.parse(ZT.getVariableValue("selected_pnrs", "[]"));
let pnr_index = Number(ZT.getVariableValue("pnr_index", 0));

// --- transform --------------------------------------------------------------
let current_pnr = selected_pnrs[pnr_index];
pnr_index += 1;
let is_more_pnrs = pnr_index < selected_pnrs.length;
if (!is_more_pnrs) pnr_index = 0;

// --- outputs ----------------------------------------------------------------
ZT.setFormData("current_pnr", JSON.stringify(current_pnr));
ZT.setFormData("pnr_index", pnr_index);
ZT.setFormData("is_more_pnrs", is_more_pnrs);
ZT.setTransformData("pnr_banner_html", `<h3>PNR ${pnr_index} of ${selected_pnrs.length}</h3>`);
```

That is the whole cursor node. Sixteen lines. If a script needs more than one screen of
code, it is doing two nodes' work or carrying scaffolding — split it or delete it.

## 2. Reading data — one call, one default, no chains

- **Every read of a workflow variable is `ZT.getVariableValue("name", default)`.** No bare
  identifiers, no `this.name`, no wrappers around it. It already returns the default when the
  variable is missing or empty. Pass the one default you want and move on.
- **Objects and arrays stored as JSON strings are parsed at the read site**, with the empty
  shape as the default: `JSON.parse(ZT.getVariableValue("work_queue", "[]"))`,
  `JSON.parse(ZT.getVariableValue("current_pnr", "{}"))`. No try/catch — the value was written
  by our own `JSON.stringify` one node earlier.
- **Numbers**: `Number(ZT.getVariableValue("pnr_index", 0))`. Not `parseInt(..., 10)`.
- **API responses**: `actions.<alias>.field` and `actions.<alias>._zt_meta.response.code`
  directly. The Data node that filled it is the immediately preceding node; if it ran, the
  object exists. Array/primitive roots are under `.value`. Read only fields confirmed in a
  real response — never one only a mock seed has (`03-testing-and-mock-data.md` →
  "Real-data contract"). A Salesforce Connected Object response is `records` + `_zt_meta`;
  there is no `totalSize`.
- **AI Action responses**: `actions.<ai action alias>.<output field>` — the fields the Action's
  JSON output declares.
- **Dynamic View selections**: `views.<alias>` (single) / `views.<alias>.records` (multi).

Banned, with what replaced them on ETG:

```javascript
// BEFORE (node 44) — four sources OR'd together, so nobody knows which one is real
orderReference: ZT.getVariableValue("orderReference", null) ||
  ZT.getVariableValue("custom_field_27823498043154", null) ||
  (actions.findorder && actions.findorder.orderReference) || null,

// AFTER — the tree decided where orderReference comes from in the seed script; read that
let order_reference = ZT.getVariableValue("order_reference", "");
```

```javascript
// BEFORE (node 44) — "try these names and hope one resolves"
function firstOf(names) { for (...) { const v = ZT.getVariableValue(names[i], ""); if (v) return v; } return ""; }
const AGENT_NAME_CANDIDATES = ["agent_name", "current_user_name", "zendesk_agent_name"];
agentName: firstOf(AGENT_NAME_CANDIDATES) || null,

// AFTER — one variable, agreed with the account, named in the tree's claude.md
let agent_name = ZT.getVariableValue("agent_name", "");
```

If you don't know which variable carries a value, that is a **requirements gap**, not a
reason to read five. Write it in the requirements doc as an open question and read one.

```javascript
// BEFORE (node 44 log block) — the runtime is not undefined; actions always exists
const res = (typeof actions !== "undefined" && actions[alias]) ? actions[alias] : null;
const meta = (res && res._zt_meta && res._zt_meta.response) ? res._zt_meta.response : {};

// AFTER
let status = actions.edvin__register_errand._zt_meta.response.code;
```

## 3. Writing data — form data, JSON strings, once

The namespace rules live in `02-data-and-namespaces.md`; the script-level consequences:

- Scalars: `ZT.setFormData("is_more_pnrs", is_more_pnrs)`.
- Objects/arrays: `ZT.setFormData("work_queue", JSON.stringify(work_queue))`.
- HTML for a content node: `ZT.setTransformData("ticket_card_html", html.replace(/\s*\n\s*/g, " "))`,
  rendered as `${transforms.ticket_card_html}` — one line, always a transform
  (`02-data-and-namespaces.md` → "Rendered HTML goes to transforms").
- `ZT.setTransformData` otherwise only for a native dynamic `select` source, an object a merge
  field must dot-path into, or a value a Connected Object template merges pre-shaped. Say
  which in a one-line comment.
- **Write each value once, to one place.** Never mirror a value into two namespaces "so it's
  reachable either way" (v46 node 44 wrote `errand_message` to both). Never write a variable
  nothing downstream reads. Never write the same fact under two names (`orderReference` and
  `order_reference`; `zd_ticket_id` and `zendesk_ticket_id` — both happened).
- **One data structure per concept, not one per access path.** v46 node 46 stored the same
  actions five ways (`types_list`, `types_by_id`, `actions_by_type`, `actions_by_type_name`,
  `actions_flat`) because nobody tested which path the dynamic select could read. Test it,
  then store one.

## 4. No constants block, no env variables

Scripts do not open with a config section. Ids, UUIDs, endpoints, field ids, delimiters and
size caps are not script constants.

```javascript
// BEFORE (node 44)
const LOG_VAR = "execution_log";
const LOG_REC = "~||~";
const LOG_FLD = "~:~";
const LOG_MAX = 20000;
const EDVIN_MESSAGE_KEY = "errand_message";
const EDVIN_PAYLOAD_KEY = "edvin_register_errand_payload";
const EDVIN_GENERIC_USER_UUID = "4871857e-d411-4594-a2de-25f6c4fb1ffa";
```

Where these belong instead:

| Kind of value | Lives in |
|---|---|
| System ids the tree needs at launch (ticket id, agent, channel, record ids) | Query params → form data, read by the seed script |
| Account/environment constants (a generic user UUID, a Zendesk field id) | The Connected Object's request body or a tree `predefined_vars` entry — never a script literal |
| A variable's own name | The string literal at the one `setFormData` / `getVariableValue` that uses it |
| Business lookup tables (bucket id → route key, contact reason → category) | A plain-object map, named for its content, defined right above its one use |

Lookup maps are the one allowed "table" in a script, and only when the data is genuinely
static business mapping that no API returns:

```javascript
const bucketByEdvinId = { 3: "no_action", 4: "proceed", 5: "different_request" };
let bucket = bucketByEdvinId[action.bucket.id];
```

Not this — a map plus a second map plus a key-hunting helper for a shape the API documents:

```javascript
// BEFORE (nodes 2 and 46, pasted identically into both)
const BUCKET_BY_NAME = { "no action": "no_action", "do not proceed": "no_action", ... };
const BUCKET_NAME_KEYS = ["name", "value", "key", "label", "code", "slug", "type", "bucketKey"];
function rawBucketName(b) { if (typeof b === "string") return b; for (...) {...} return ""; }
function bucketKey(b) { if (b.id != null && BUCKET_BY_ID[b.id]) return BUCKET_BY_ID[b.id]; ... }
```

Edvin returns `bucket: { id, name }`. Read `bucket.id`. If a response shape is uncertain,
mock it from a real captured payload (`03-testing-and-mock-data.md`) — don't program around
eight guesses.

## 5. No shared helper blocks, no per-node redefinitions

There are no org-level shared functions available to us. Therefore:

- **If two script nodes need the same helper, the design is wrong.** Either the two nodes
  are one node, or the helper is doing something the tree shouldn't be doing. v46 pasted a
  55-line execution-log block into six scripts with the comment "keep IDENTICAL in every
  script that logs". Nodes 10 and 29 were two 140-line reset scripts that had already drifted
  apart. Neither survives this standard: one reset node, reached from both entry points; no
  log block at all.
- **No logging.** Zingtree's logging is weak and nothing routes on it. Do not build an
  execution log, do not call `ZT.log`, do not arm/flush/grade calls. Diagnose from the inputs
  (query params, form data), the Connected Object's request/response in Execution Insights,
  and the outputs on the next screen. `08-troubleshooting.md` covers what to look at.
  **One sanctioned exception: the API receipt** — one append-only form variable, one line at
  each call site, one renderer (`04-cx-actions-api-requests.md` → "The API receipt"). Where an
  AI Action made a decision, the Action returns its own reason field; the tree never builds a
  diagnostics string explaining why a path stopped.
- **Escaping is for external free text, in the one node that renders it.** Values from our
  own APIs and forms go into template literals as they are (v46 defined `esc` in four nodes
  for no reason). A customer's email body, an API error body or anything a person typed that
  is shown *as text* gets escaped — by a small `escapeHtml` defined in the renderer that needs
  it, not pasted into every script. Escaping a value for a quoted slot in a Connected Object
  template is a different job: `JSON.stringify(value).slice(1, -1)`, staged once
  (`02-data-and-namespaces.md`).
- **Small named functions are fine when they hide a real step** (`groupByErrandKey`,
  `buildTicketCard`). They are defined once, right above their use, take the data they
  need as arguments, and return a value. They do not read or write ZT state — that happens
  in the inputs/outputs sections so the node's contract stays visible.

## 6. Comments describe the code now

```javascript
// BEFORE (node 58)
// FIX (2026-08-27): originally used .some() (passes once ANY row has a pick),
// which let a 1-of-2 submission through. Every PNR needs its own customer action,
// so this now uses .every() - see the v43 correction entry in claude.md.

// AFTER
// Every PNR row needs a customer action before we can group.
```

- One comment per section (`// --- inputs`, `// --- group by type + action`), and a one-liner
  only where the *why* isn't obvious from the code.
- No dates, version tokens, node ids, reviewer names, Jira references, or "previously".
  History lives in the `claude.md` node's changelog. Node 44 in v46 carried ~115 comment
  lines in a 367-line script; the shipped version of the same requirement was 29 lines.
- Unknowns are marked, briefly, so they can be found: `// OPEN ITEM #4: no Chat channel in
  API yet` (Brent's convention). They are removed when resolved.

## 7. Language and style

Modern JS, the way Brent writes it (reference: `brentthomascodes/SOTC_V3_API`; in-tree:
node 7 "Set Selected PNR's", `etg-errand-transform-api.js`).

- `let` / `const` only. Never `var`. Never mix all three in one node (node 44 did).
- snake_case for every Zingtree variable name (`selected_pnrs`, `is_more_pnrs`,
  `ticket_card_html`). camelCase for JS-only locals, functions and lookup maps
  (`bucketByEdvinId`, `groupByErrandKey`). The name tells you which world it belongs to.
- **Simple loops, direct object traversal, plain variable references** (Brent, Sep 2026 —
  Corpay UK; supersedes "`.map`/`.filter`/`reduce` over hand-rolled loops"). Code is written
  at the level of an intermediate engineer who will review and maintain it themselves. A
  `for` loop with a push, `.map` / `.filter` / `.find` / `.includes` where they read as plainly
  as the loop. `Object.keys`, `reduce`, `Set`, spreads, destructuring and arrays of arrays are
  the exception, used only when the plain version is genuinely harder to read.
- Data-driven over branchy: a lookup map or an array of row definitions instead of a switch.
  A map is declared once, named for its content, right above its one use (`routeByQueue`,
  `senderByRoute`); if a second node needs it, it moves to the seed script as form data.
- Template literals for strings and HTML. String concatenation with `+` only when a
  template literal would be less readable.
- No try/catch (the only external parse we do is our own stringify; a Connected Object
  response is already parsed). No `typeof`, no `Array.isArray` ladders, no
  `String(x).trim() === ""`, no `x !== null && x !== undefined`.
- ASCII only. Curly quotes and non-ASCII break the script.
- **No `Date`.** The Zingtree script sandbox does not expose it (`new Date()` throws live).
  Order rows by append order and number them at render time instead of timestamping them.
- Trust the engine: a missing variable returns your default; a Data node that ran left
  `actions.<alias>` populated. Code for the path the tree guarantees.

## 8. The one thing scripts route on

A script sets booleans and data; a Scoring node routes. When a script follows a Data node, it
grades the call in one line and moves on:

```javascript
let send = actions.send_email_simple_int;
let responseCode = send._zt_meta.response.code;
let emailSent = false;
let errorEmailMessage = "Salesforce returned status " + responseCode + ". " + send._zt_meta.response.body;
if (responseCode >= 200 && responseCode < 300) {
  let result = send.value[0];
  emailSent = result.isSuccess === true;
  errorEmailMessage = emailSent ? "" : result.errors[0].message;
}
ZT.setFormData("emailSent", emailSent ? "true" : "false");
ZT.setFormData("errorEmailMessage", errorEmailMessage);
```

(Corpay UK's send grade, verbatim. `emailSent` / `errorEmailMessage` are legacy camelCase
names carried from the source tree; a new variable is snake_case — `email_sent`.)

- **A Connected Object call is graded on its status code, 2xx, before anything in it is read**
  (`>= 200 && < 300`, not `=== 200` — creates answer 201). Only a 2xx carries data to read; a
  non-2xx carries `_zt_meta.response.body`.
- **An AI Action is graded on its output field** (`intent.email_intent !== undefined`). Live AI
  Action responses have arrived without `_zt_meta`, and reading it threw. A response that never
  arrived must route to the agent with a reason ("the check did not return a result"), never
  read as "nothing matched".
- **No shape-sniffing as a stand-in for the status code** — no `[].concat(x || [])`, no
  `Array.isArray` on a response. The code is the test.
- **Pick one flag type per variable and route on it.** A boolean is tested `flag == true`; a
  string flag (`"true"` / `"false"` — conditional-field drivers compare text) is tested
  `flag == "true"`. Mixing the two on one variable is how a router silently takes its default.

No dedicated status-check node, no shared failure engine, no retry bookkeeping in a new build
(ETG keeps its per-call status routers as a production baseline — `10-reference-builds.md`).
The router after the script tests the flag; the false branch shows the tree's failure screen
with the reason. Details in `04-cx-actions-api-requests.md`.

## 8b. Never in a tree

- **Credentials.** No token, API key, password or `Basic` header value in a script, a content
  node or `script_code` — auth belongs to the Data Source. A Zendesk token was found in an ETG
  seed script (Sep 2026); an export carries it to everyone who opens the file. Rotate it.
- **A hardcoded node id in navigation.** `do_button_click(8, ...)` in a dashboard widget jumped
  to whatever node 8 was after a merge and restarted the journey (Corpay UK, Sep 2026). Screens
  reached from two paths make any single id wrong for one of them; UI state changes stay on the
  screen.
- **A merge field inside an HTML attribute** of a content node. Zingtree wraps merge output in a
  `<span>`, so `href="${manager_share_url}"` rendered as `href="<span class=...`. Build the whole
  tag in the script and merge it once (ETG, Sep 2026). (Inside a script's template literal,
  `${x}` is JavaScript and fine.)

## 9. Pre-delivery checklist for every script

Run this against each Script node before it reaches Brent:

- [ ] Reads: every workflow variable via `ZT.getVariableValue("name", default)`; JSON-string
      variables parsed at the read with `"[]"` / `"{}"` defaults; no `||` chains of sources.
- [ ] Writes: state to form data (JSON strings for objects); rendered HTML to transforms, one
      line; each value written once; every output read somewhere downstream;
      `setTransformData` otherwise only for the allowed cases in `02`.
- [ ] Grading: CO calls on `_zt_meta.response.code` 2xx before any read; AI Actions on their
      output field; no field read that only a mock has; no `totalSize`.
- [ ] No `const` config block, no literal ids/UUIDs/endpoints, no delimiter/cap constants.
- [ ] No block that also appears in another node. No `esc`, `g`, `set`, `firstOf`, `logX`.
- [ ] No `ZT.log`, no execution log, no arm/flush.
- [ ] No `var`, `typeof`, `try`, `parseInt`, `Array.isArray`, `.trim().toLowerCase()`, `Date`
      unless a documented live failure requires it (`Date` never).
- [ ] No credential, no hardcoded node id in navigation, no merge field inside an attribute.
- [ ] Comments: section markers + why-only; zero dates, versions, node ids, names.
- [ ] `node --check` passes; a stubbed-ZT run over the mock fixture produces the expected
      outputs (`03-testing-and-mock-data.md`).
- [ ] A junior engineer could read it once and state inputs → outputs.
