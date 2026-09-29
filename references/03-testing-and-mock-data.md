# Testing with mock data

Every build ships with a way to run it end to end **without a live API and without an agent
clicking through**. Three layers, cheapest first. All three read the same fixture file, so
the data the offline harness proves is the data the preview URL seeds and the mock node
returns.

| Layer | Runs where | Proves |
|---|---|---|
| 1. Offline walk (`scripts/walk.mjs`) | node, seconds | Every script body executes over the real continuation graph; outputs match the fixture's expectations; the loop terminates; every Data node is reached with the right inputs |
| 2. Preview URL + Test Mode | Zingtree editor preview | Native form fields, conditional fields, merge fields, routers and Data-node wiring behave in the real engine — with `actions.<alias>` seeded from real-shaped responses instead of the API |
| 3. Sandbox / live | Customer INT org, real Connected Objects | What only the real API shows: auth, payload acceptance, async timing, the invalid-loop guard — and whether the tree reads anything the mocks invented |

Layer 3 is Brent's. Layers 1 and 2 are the builder's, on every build, before delivery.

## The fixture file

One JSON file per tree, next to the tree export:
`Workflow JSONs/<Account>/<tree-slug>.fixture.json`. It has three sections.

```json
{
  "tree_id": "518765124",
  "preview_host": "https://eu.zingtree.com/preview/",
  "query_params": {
    "zd_ticket_id": "334818",
    "custom_field_29559177650834": "contact_reason__cancellation",
    "zendeskChannelIdentifier": "Phone",
    "mock": "1"
  },
  "actions": {
    "edvin__find_order": {
      "_zt_meta": { "response": { "code": 200 } },
      "orderReference": "1122-047-131",
      "pnrs": [ { "id": "P1", "pnr": "ABC123", "passengers": [ { "passengerFirstName": "Aslan", "passengerLastName": "Yilmaz" } ] } ]
    },
    "edvin__get_errand_configuration": { "_zt_meta": { "response": { "code": 200 } }, "channels": [ "..." ] },
    "zendesk__create_child_ticket": { "_zt_meta": { "response": { "code": 201 } }, "ticket": { "id": 900001 } }
  },
  "form_inputs": {
    "6":  { "selected_pnr_ids": "P1" },
    "25": { "customer_action_ABC123": "1973" }
  },
  "expect": {
    "data_node_calls": { "zendesk__create_child_ticket": 1, "edvin__register_errand": 1 },
    "form_data": { "is_more_pnrs": false },
    "terminal_node": "23"
  }
}
```

- `query_params` — every inbound variable the tree reads in its seed script, by its **raw
  inbound name** (the ticket id, `sf_Id`, the org's `custom_field_<id>` params) and nothing
  else. Never seed the tree's standardized names or derived values (`order_reference`,
  `channel`): the seed script or a form field sets those, and seeding them hides a break in
  the code that derives them. `mock: "1"` turns a query-param mock node on, for trees that use
  one (below).
- `connected_objects` — Connected Object id → alias; `ai_action_aliases` — AI_Action **node
  id** → the Action's alias (the export carries only the numeric `ai_action_id`).
- `actions` — one entry per alias the tree calls, shaped exactly like the real response
  including `_zt_meta`. **Capture these from a real call** (Execution Insights → Connected
  Objects, or the INT org) and paste them in; never invent a shape, never add a field.
  Salesforce responses are `records` + `_zt_meta` — no `totalSize` / `done`. AI Action
  entries carry the Action's JSON output and no `_zt_meta`. For failure cases add a second
  fixture (`<slug>.fixture.fail-send.json`) with a 4xx/5xx code and `_zt_meta.response.body`.
- `form_inputs` — what the agent submits on each content node, keyed by node id, using the
  field `name`s the node renders. For generated `zt-data` inputs use the exact generated name.
- `expect` — what a passing run looks like. Counts of Data-node hits per alias, a few
  form-data values, and the node the run ends on.

The fixture is part of the deliverable. It is also the mock node's data (below), so the
fixture and the mock never disagree.

## Layer 1 — the offline walk

```bash
node scripts/walk.mjs "<tree.json>" "<tree.fixture.json>"
```

`walk.mjs` (in this repo) does what an offline harness has to do to be worth trusting:

- Executes the **real Script node bodies out of the export** in a `vm` sandbox — no
  hand-copied replica to drift out of date.
- Stubs `ZT` faithfully: `getVariableValue` reads form data only and returns the default on
  missing/empty; `setFormData` / `setTransformData` / `setResponseData` write their
  namespaces; `transforms` / `actions` / `views` are exposed as the engine exposes them.
- Walks the **real continuation graph**: Script → `continuation_node_id`; Content → the
  fixture's `form_inputs[node]` then the node's single Continue button (or the button named
  in the fixture); Scoring → evaluates each button's `logic_expression` against the current
  namespaces in order, then the default; Data → records the call and loads
  `fixture.actions[alias]` into `actions`.
- Stops on a terminal node, on a Tree link, or when the same node is visited more than N
  times without the loop cursor changing (that is the shape Zingtree's invalid-loop guard
  kills — surface it here first).
- Prints the path, every Data-node hit with the form data it would have been sent, the final
  form data, and a pass/fail against `expect`.

Run it on the previous version too; the delta is the useful report. Attach the output to
the Stage A verification.

Limits, say them out loud: it cannot see native-field `required`, conditional-field
visibility, merge-field rendering, or anything the live API does. A clean walk is a clean
walk, not a verified build.

## Layer 2 — preview URL + Test Mode

### The preview URL

```bash
python3 scripts/preview_url.py "<tree.fixture.json>"
# https://eu.zingtree.com/preview/518765124?zv_zd_ticket_id=334818&zv_custom_field_29559177650834=contact_reason__cancellation&zv_zendeskChannelIdentifier=Phone&zv_mock=1
```

Rules:

- Host: `https://eu.zingtree.com/preview/<tree_id>` for EU orgs (every org in use today);
  `https://zingtree.com/preview/<tree_id>` for US. The fixture's `preview_host` decides.
- Every param prefixed `zv_`, values URL-encoded; only the raw inbound names (above).
- `#<node_id>` on the end opens the tree at that node — how QA reaches a Test Mode picker a
  promote left unlinked (`--node 44`).
- `zv_` params also work on the live `/show/<tree_id>` URL (Zingtree strips the prefix;
  `--show`), where `session_id=` rides bare. Keep a generated link under ~8,000 characters.
- `zv_session_id=<value>` on preview reuses/replays a specific session (`--session`). The help
  article (`08-troubleshooting.md`) shows it bare; if the zv_ form doesn't resume, use bare.

Paste the URL into the delivery note. If a mid-tree screen is what needs testing, the params
still go on the launch URL — the seed script carries them forward.

### Test Mode — the reference pattern (Corpay UK, Sep 2026)

A Test Mode path inside the real tree, not a second tree and not stubbed Data nodes:

```
Start (Content, sandbox root) ─ Process this case ─────────────▶ first real node (live)
                              └ Test Mode ▶ Pick a scenario (native select, test_* keys,
                                            mock scope: all requests | case fetch only)
                                          ▶ Load example email (Script: scenario → example)
                                          ▶ Review or edit the email (native multiline)
                                          ▶ Seed mocked data (Script) ──▶ the same node the
                                            live fetch continues into
```

- **The seed script** writes each mocked alias with `ZT.setResponseData(alias, response)` —
  real shape, correct `_zt_meta` code, confirmed fields only — sets the inbound variables the
  live launch would carry (`sf_Id`, `caseId`), sets `is_mock_run` and `mock_downstream`, and
  joins the live graph exactly where the live fetch does, so everything downstream runs the
  same code on either path.
- **Routers skip Data nodes on `mock_downstream == true`** — a `mock_downstream == true` button
  in the router that already sits before the call (or one router placed there) sends the path
  past the Data node. That is the one place a mock check is allowed, and it is a router
  expression, not script logic.
- **Mock scope is a choice on the picker.** An org that cannot make real requests (Brent's
  sandbox) mocks every request; an org that can mocks only the fetch that supplies the case,
  so the rest of the run uses real data (the UK org's original pattern). AI Actions run live
  in both.
- **Scenario keys start with `test_`** and never collide with a real intent/value key; the
  prefix can also select the journey (`test_hc_` → Homecharge lane).
- **Test Mode ships to every environment intact.** A promote moves only the root off the Start
  screen; QA opens the picker with `#<node>`. Strip nothing.

### The query-param mock node (lighter alternative)

For a tree without an agent-facing entry screen, the seed script (or, where the root is a
Content node, the one Script after it) serves the fixture into `actions` when `zv_mock=1` is on
the launch URL — fold it into the seed rather than adding a Script → Script hop:

```javascript
// Mock API responses for preview testing. Off unless the launch URL carries zv_mock=1.
// Data is the tree's fixture file, pasted verbatim. Remove nothing else to go live -
// with mock unset this node does nothing.
let mock = ZT.getVariableValue("mock", "");
if (mock === "1") {
  ZT.setResponseData("edvin__find_order", { _zt_meta: { response: { code: 200 } }, orderReference: "1122-047-131", pnrs: [ /* ... */ ] });
  ZT.setResponseData("edvin__get_errand_configuration", { /* ... */ });
}
```

`ZT.setResponseData(alias, data)` writes the `actions` namespace, so every downstream read
of `actions.<alias>` is unchanged. Two things to keep straight:

- **The mock node runs before the Data nodes.** A Data node that fires later overwrites the
  mocked alias with the real response — which is what you want when only some calls are
  being mocked, and exactly why, in a full mock run, the Data nodes must be bypassed. Give
  each Data node's preceding router an explicit `mock == "1"` button to its continuation
  target, so the real call is skipped in mock mode. As with Test Mode's `mock_downstream`, that
  router button is the one place a mock check is allowed — a tree uses one of the two
  patterns, never both.
- `setResponseData` seeding `actions.<alias>` is proven in the EU orgs (Corpay UK Test Mode,
  Sep 2026); on a new org, confirm it once in Execution Insights → Transformations. The
  Returns master used it for `dynamic_view__` aliases; the same call is what makes a
  script-built Dynamic View possible.

For write calls (create ticket, register errand) the fixture's mocked response is a
plausible 200/201 body with an id; the harness's call counts are what verify the loop fired
them the right number of times.

### What to click through

Drive the preview once on the happy path and once on the failure fixture. Check what the
walk cannot: required fields block Continue; conditional fields show for the right driver
value; every `${transforms.x_html}` renders (not the literal token, and inputs inside it survive); the dynamic select lists the
options the transform holds; routers land where the walk said they would.

## Real-data contract — mocks may copy a real response, never add to it (Brent, Sep 2026 — Corpay UK)

On 29 Sep 2026 a guard read `totalSize` off the case fetch to check a case came back. The
Test Mode seed carried `totalSize`; the real Salesforce Connected Object response does not.
Every offline walk and every Test Mode run passed; every live case went to "Queue not in
scope", and the customer lost a morning of UAT. The mock let the tree depend on data only the
mock had.

The rule: every value a tree reads, compares, branches on, displays or sends comes from

1. a field confirmed in a **real** response of that request,
2. a record field inherited through the marketplace app (a predefined `sf_*` / ticket variable), or
3. a value the tree itself creates from 1 or 2 (a form field, a script output, an AI Action's
   declared output).

Mock data is never a source. A seed or fixture may copy a confirmed shape; it may not add a
field, a wrapper key or a count. Keep a **response contract** per account (alias → confirmed
top-level keys and record fields, with who confirmed it and when) next to the exports, and run

```bash
python3 scripts/response_contract.py "<tree.json>" "<account>.response-contract.json"
```

before every promote and after any script edit that reads a response. It reports every read
outside the contract (direct and through a variable) and lists the variables it followed so
destructuring and helpers get read by hand. Open the seed script and check each seeded key
against the contract too — the gate does not parse seeds. Never widen a contract to make it
pass; a field is added only after someone has seen it in a real response.

## Layer 3 — sandbox and live

Brent runs these. **At least one live, unmocked run per lane** from the normal entry point
is required before a change is called done — Test Mode cannot prove the real-data contract,
because its seeds are what hide the problem. The builder's job is to hand over: the fixture (so the sandbox inputs are
known), the walk output, the preview URL, and a short list of what only the live run can
prove for this build (async timing on a create→fetch pair, the invalid-loop guard on any
cycle, auth on a new Connected Object, the CO template rendering valid JSON with real values).

The walk handles AI_Action nodes (from `ai_action_aliases`) and Email nodes (recorded as a
call, then continued), runs scripts without `Date` like the real sandbox, and warns on an
AI_Action node whose `config` is not the `mode: "api"` string.

Account-specific harnesses (e.g. `etg-errand-regression`) live with the account, not here.
They should be built on `walk.mjs` plus an oracle file that derives expected outcomes from
the written business rules, never from the tree's own code.

## Verification lint (every build)

`scripts/lint_tree.py <tree.json>` runs the import-safety and graph checks
(`patterns.md` → "Import safety & verification") and the script-standard checks
(`01-scripting-standards.md` → checklist): the router shape, AI Action node config,
Connected Object `org_id`, credentials, `Date`, banned tokens, duplicate blocks across nodes,
constants blocks, comment dates/versions, HTML written to form data, transforms nothing reads,
writes never read, same node type back to back, a Connected Object on two nodes, merge fields
inside attributes. Pass `--entry <node>` for a Test Mode / Start screen a promote leaves
unlinked; persistent-button targets are entries automatically. Non-zero exit means don't
deliver. Run it on the reference builds after any change to the lint — their known findings
are listed in `10-reference-builds.md`, and a new finding on either is either a real defect or
a lint rule that is wrong.
