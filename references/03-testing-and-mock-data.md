# Testing with mock data

Every build ships with a way to run it end to end **without a live API and without an agent
clicking through**. Three layers, cheapest first. All three read the same fixture file, so
the data the offline harness proves is the data the preview URL seeds and the mock node
returns.

| Layer | Runs where | Proves |
|---|---|---|
| 1. Offline walk (`scripts/walk.mjs`) | node, seconds | Every script body executes over the real continuation graph; outputs match the fixture's expectations; the loop terminates; every Data node is reached with the right inputs |
| 2. Preview URL + mock node | Zingtree editor preview | Native form fields, conditional fields, merge fields, routers and Data-node wiring behave in the real engine — with `actions.<alias>` served from the fixture instead of the API |
| 3. Sandbox / live | Zendesk sandbox, real Connected Objects | What only the real API shows: auth, payload acceptance, async timing, the invalid-loop guard |

Layer 3 is Brent's. Layers 1 and 2 are the builder's, on every build, before delivery.

## The fixture file

One JSON file per tree, next to the tree export:
`Workflow JSONs/<Account>/<tree-slug>.fixture.json`. It has three sections.

```json
{
  "tree_id": "518765124",
  "preview_host": "https://zingtree.com/preview/",
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

- `query_params` — every inbound variable the tree reads in its seed script, by its raw
  inbound name. `mock: "1"` turns the mock node on.
- `actions` — one entry per Connected Object alias the tree calls, shaped exactly like the
  real response including `_zt_meta`. **Capture these from a real call** (Execution Insights →
  Connected Objects, or the sandbox) and paste them in; never invent a shape. For failure
  cases add a second fixture (`<slug>.fixture.fail-create.json`) with a 4xx/5xx code and
  `_zt_meta.response.body`.
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

## Layer 2 — preview URL + mock node

### The preview URL

```bash
python3 scripts/preview_url.py "<tree.fixture.json>"
# https://zingtree.com/preview/518765124?zv_zd_ticket_id=334818&zv_custom_field_29559177650834=contact_reason__cancellation&zv_zendeskChannelIdentifier=Phone&zv_mock=1
```

Rules: host `https://zingtree.com/preview/<tree_id>`; every param prefixed `zv_`; values
URL-encoded; `zv_session_id=<value>` when you want to reuse/replay a specific session.
Paste the URL into the delivery note. If a mid-tree screen is what needs testing, the params
still go on the launch URL — the seed script and mock node carry them forward.

### The mock node

Rather than swap Data nodes for stubs (a second tree to maintain), one Script node right
after the seed script serves the fixture into `actions` when `mock` is set:

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
  target, so the real call is skipped in mock mode. That is the one place a `mock` check is
  allowed in a tree, and it is a router expression, not script logic.
- **Confirm `setResponseData` seeds `actions.<alias>` in the current engine** the first time
  you use it on a new org (Execution Insights → Transformations will show the write). The
  Returns master used it for `dynamic_view__` aliases; the same call is what makes a
  script-built Dynamic View possible.

For write calls (create ticket, register errand) the fixture's mocked response is a
plausible 200/201 body with an id; the harness's call counts are what verify the loop fired
them the right number of times.

### What to click through

Drive the preview once on the happy path and once on the failure fixture. Check what the
walk cannot: required fields block Continue; conditional fields show for the right driver
value; every `${x_html}` renders (not the literal token); the dynamic select lists the
options the transform holds; routers land where the walk said they would.

## Layer 3 — sandbox and live

Brent runs these. The builder's job is to hand over: the fixture (so the sandbox inputs are
known), the walk output, the preview URL, and a short list of what only the live run can
prove for this build (async timing on a create→fetch pair, the invalid-loop guard on any
cycle, auth on a new Connected Object, the CO body accepting the stringified payload).

Account-specific harnesses (e.g. `etg-errand-regression`) live with the account, not here.
They should be built on `walk.mjs` plus an oracle file that derives expected outcomes from
the written business rules, never from the tree's own code.

## Verification lint (every build)

`scripts/lint_tree.py <tree.json>` runs the import-safety and graph checks
(`patterns.md` → "Import safety & verification") and the script-standard checks
(`01-scripting-standards.md` → checklist): banned tokens, duplicate blocks across nodes,
constants blocks, comment dates/versions, writes never read, `setTransformData` outside the
two allowed cases, same node type back to back, a Connected Object on two nodes. Non-zero
exit means don't deliver.
