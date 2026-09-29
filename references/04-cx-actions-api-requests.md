# CX Actions: API Requests in Zingtree

Source: https://help.zingtree.com/hc/en-us/articles/40969425099291-CX-Actions-API-Requests-in-Zingtree

## Overview

**CX Actions** connect Zingtree to any publicly available API or third-party service.

CX Actions make it possible to:
- Create a **Data Source** to define API authentication and token management.
- Build a **Connected Object** (endpoint) to perform valid **CRUD** (Create, Read, Update, Delete) operations against a RESTful API.

Primary goal: provide **re-usable, scalable resources** that connect workflows to external data sources. From the **Apps & Integrations** tab, you define one Data Source and one Endpoint, and reuse them across multiple workflows and trees.

CX Actions is a gated feature — access requires contacting a Zingtree Account Manager or Support.

## Core Features

1. **Data Source (Authentication)**
   - Defines how to connect to your API.
   - Supported Authentication types:
     - API Key
     - Basic Auth
     - Bearer Token
     - JWT Bearer
     - OAuth2 Password Credentials
     - OAuth2 Client Credentials
2. **Connected Object (Endpoint & Request Configuration)**
   - Defines the endpoint and how requests will be sent.
   - Supports CRUD operations.

## Data Source Types

Out-of-the-box connectors:

1. **Salesforce Connector** — uses your Salesforce credentials; all objects (including custom objects) become available for CRUD operations.
2. **Universal Connector (HTTP Connector)** — connects to any API endpoint using supported authentication methods.

## Creating a Data Source

1. **Identify API Documentation**
2. **Determine Authentication Type** (from the list above)
3. **Gather Authentication Credentials** (client ID, client secret, etc.)
4. **Configure the Data Source** in Zingtree

**Tip:** When using OAuth2, ensure the expiration time is set correctly to avoid authentication failures.

House notes (Sep 2026):

- **OAuth2 Client Credentials** fields: Name, Description, Active, Authentication Type, Access
  Token URL, Expiration Time (seconds), Client ID, Client Secret, Audience, optional Scope and
  Client Authentication method (e.g. "Send as Basic Auth header"). It calls the token URL with
  the client id/secret whenever it needs a token; there is no field for an externally obtained
  refresh token.
- **Data Source auth cannot take session variables** (asked for `${zd_agent_email}/token`,
  ETG; "not currently possible", feature request ZT-9109). Do not work around it by building an
  auth header in a script from a literal token — that puts a credential in every export
  (`01-scripting-standards.md` §8b).
- A sandbox org that cannot reach the customer's systems gets placeholder Data Sources
  (API-key auth, random characters, `placeholder.invalid` endpoints carrying the intended
  query) so the tree imports and Test Mode runs; they never travel to the customer's org.

## Creating a Connected Object

Once a Data Source is configured, create Connected Objects to interact with API endpoints.

- Supported HTTP Methods: **GET, POST, PUT, PATCH, DELETE**
- Optional information: **Headers, Parameters, Payload**

**Tip:** Use environment variables or Zingtree variables in payloads to make requests dynamic and reusable across workflows.

## How it Works (3-Step Flow)

1. **Connect External Data Source** — choose authentication method and provide credentials.
2. **Create Connected Object** — configure endpoints and HTTP method; add headers, parameters, or payloads if needed.
3. **Use Data Connected Node in Workflows** — reference static or dynamic values in your workflow nodes.

**Important:** Variable names are passed into the Connected Object automatically, provided the variable names in both the workflow (session) and the Connected Object are the **exact same**.

Create a node & select **Data Connected Node** to use the Connected Object in a workflow.

## Accessing Response Metadata (`_zt_meta`)

Every Actions API response is decorated with a special metadata key named `_zt_meta`, giving access to technical details about the API request directly within the response variable, alongside your actual data.

Particularly useful for building logic branches based on the success or failure of a call (e.g., distinguishing a `200 OK` from a `404 Not Found`).

### Available Metadata Fields

- `response.code` *(Integer)*: The HTTP status code returned by the API (e.g., `200`, `404`, `500`).
- `response.body` *(String)*: The raw response body, **only set** when there is a request error (non-2xx response).

### The Metadata Structure

The metadata object is automatically injected at the root of your action variable:

```
"_zt_meta": { "response": { "code": 200 } }
```

### How to use it in Logic

Reference the status code in Logic Nodes, Expression Nodes, or Scripts using standard dot notation:

- **Syntax:** `actions.[alias]._zt_meta.response.code`
- **Example:** `actions.get_products._zt_meta.response.code`

### Important Note on Key Collisions

Because `_zt_meta` is injected directly into your response payload, **ensure your upstream API does not use `_zt_meta` as a key.** If the external API returns a key with this exact name, it may be overwritten by the system metadata.

## API Response Structure & Object Wrapping

All API responses must be formatted as a **JSON Object** at the root level for consistent access to response data and metadata. Because many external APIs return Lists (Arrays) or simple values (Strings/Integers) as their root response, Zingtree automatically applies a **standard wrapper** to any response that is not already an object.

### How it works

When your Action receives a response:

1. **If the Root is an Object:** The data is passed through as-is.
2. **If the Root is an Array or Primitive:** The data is wrapped inside a parent object using the key `value`.

### Examples

**Scenario A: The API returns an Object (No change)**
- **Raw API Response:** `{"id": 123, "name": "Alice"}`
- **Variable Access:** `actions.get_user.name` returns `"Alice"`

**Scenario B: The API returns an Array (Wrapped)** — you must include `.value` in your path to access the array.
- **Raw API Response:** `[{"id": 1}, {"id": 2}]`
- **System Transformation:**
  ```
  { "value": [{"id": 1}, {"id": 2}], "_zt_meta": { ... } }
  ```
- **Variable Access:**
  - `actions.get_list.value[0].id` returns `1`
  - *Incorrect:* `actions.get_list[0].id` (errors because the root is now an object)

**Scenario C: The API returns a Primitive (Wrapped)**
- **Raw API Response:** `"Success"`
- **System Transformation:**
  ```
  { "value": "Success", "_zt_meta": { ... } }
  ```
- **Variable Access:** `actions.get_status.value` returns `"Success"`

## House rules for Connected Objects

### Alias naming: `system__verb_object`

Aliases are immutable once created, so new ones follow one shape: `edvin__get_errand_configuration`, `edvin__register_errand`, `zendesk__create_child_ticket`, `zendesk__get_side_conversation`, `salesforce__update_case`. Scripts read `actions.<alias>.field` directly — no wrapper, no `typeof` guard. Existing aliases stay as they are (renaming means a new object); record them in the tree's `claude.md` data dictionary and in the fixture's `connected_objects` map.

**Use the exact alias everywhere a request is named** — `actions.<alias>` reads, router
expressions, a "last request" variable, a receipt's step catalogue, failure screens, mock seeds.
Zingtree truncates an alias at its length limit (ETG's `zingtree_redesign__update_side_conversation_via_pr`);
the truncated string *is* the alias. When a request moves to a new Connected Object (ETG's
Zendesk calls moved onto proxy objects, Sep 2026), everything that names it moves in the same
edit, or the tree reads an `actions` entry that no longer exists. Keep aliases short enough
not to truncate.

**Salesforce Connected Object responses** are `{ records: [...], _zt_meta }` — no
`totalSize`, `done` or `attributes`. A Salesforce query is only as wide as its SELECT list: a
field the tree reads must be in it (Corpay UK routed every case to "Queue not in scope" until
the queue field was added). Read `records[0].<Field>` with the field's exact API-name casing.

### Grading a call: the next script, one flag

No dedicated status-check node after each Data node in a new build. The script that consumes the response grades it — status code 2xx first, then the data — and the router after it routes on one flag:

```javascript
let create = actions.zendesk__create_child_ticket;
let code = create._zt_meta.response.code;
let created = code >= 200 && code < 300;
let current_ticket = JSON.parse(ZT.getVariableValue("current_ticket", "{}"));
current_ticket.zendesk_id = created ? create.ticket.id : "";
ZT.setFormData("current_ticket", JSON.stringify(current_ticket));
ZT.setFormData("ticket_created", created);
ZT.setFormData("api_error_message", created ? "" : `HTTP ${code}: ${create._zt_meta.response.body}`);
```

Router: `ticket_created == true` → continue the loop · else → the tree's failure screen (prints `${api_error_message}`, offers Retry → back to the single Data node, or End). No failure "engine" script, no retry bookkeeping, no execution log (ETG v46 spent 16 of 59 nodes on exactly this plumbing). Corpay UK's send is the reference: grade script → `emailSent == 'true'` → success screen, else an Email node notifying the team → failure screen.

Where a response has no consuming script at all (a note post, an update), ETG routes on the code directly in the Scoring node after the Data node — `(actions.<alias>._zt_meta.response.code == 200 || ... == 201)` with an `op: "def"` else branch. That is the ETG production baseline, one node per call; it is acceptable there and not the default for a new build.

### Request bodies: the Connected Object owns the template

The Connected Object's body is a JSON template with one merge per value — scalars in quotes, arrays/objects bare — and the tree stages only what the template reads that nothing else produces (an array as JSON text, `[]` when empty; free text escaped for its quoted slot). A whole body in one variable does not work. Full rules and the failures behind them: `02-data-and-namespaces.md` → "Connected Object request bodies". Record fields never ride in a request: `02` → "Record fields go through the marketplace app".

### Passing inputs by name

A Connected Object auto-receives any form-data variable whose name matches its placeholder exactly. Name the tree's variables to match the CO's placeholders (or vice-versa when creating the CO) so no mapping script is needed. Variables consumed only by a CO body are invisible to the export — list them in `claude.md` so the "written but never read" lint has an answer.

### Mocking for tests

`ZT.setResponseData("<alias>", data)` writes the `actions` namespace; the Test Mode seed script uses it to serve each alias a response shaped exactly like the real one — `_zt_meta` with the right code included, no field the real response lacks. Full pattern, and the real-data contract that keeps mocks honest: `03-testing-and-mock-data.md`.

## AI Actions (Sep 2026 — Corpay UK)

An **AI_Action node** runs a Zingtree AI Action and writes its JSON output to `actions.<the Action's alias>`, then follows `continuation_node_id` — like a Data node.

- **One `ai_action_id` per node.** Two journeys with two prompts need two AI nodes each (detect + generate); that is the only reason Corpay UK's lanes exist. They converge after the draft.
- **Node `config` is the JSON *string* `"{\"mode\":\"api\",\"instruction\":\"\"}"`.** `mode: "api"` is the one-shot call; any other mode renders an interactive chat panel and waits for the agent, whatever output format the Action is set to. Written as an object instead of a string (a hand-authored file), the node also opened a conversation after import. Diff a suspect node's config against a genuine export.
- **Set the Action's output to JSON** and read named fields: `actions.automate_email_intent_int.email_intent`.
- **Grade on the output field**, not `_zt_meta` — live AI Action responses have arrived without it (`01-scripting-standards.md` §8).
- **The Action explains itself.** Give the decision-making Action a reason field (`ai_exception_reason`: empty when it mapped an in-scope intent, otherwise one sentence naming what the customer actually asked for). The tree stages and prints it; it never infers a reason from its own routing. If the wording is wrong, the prompt changes.
- **Values that must be exact never go through the model.** A reply template keeps a token (`[INSERT UNIT RATE EXCLUDING VAT]`, `_NAMES_`); the agent supplies the value on a native field before generation; the tree replaces the token afterwards (case-insensitive, flexible spacing) and forces a manual-edit screen if any token survives.
- **Context the Action reads** (`Customer Sentiment: ${sentiment}`) lives in the Action, outside the export — a variable only an Action reads looks unread to the lint. Record it in claude.md.
- **Editing prompts:** the author portal's internal service API is faster and safer than the multi-step wizard for long prompts — `GET /ai-agents-svc/ai-actions/ids/<id>`, then `PUT /ai-agents-svc/ai-actions` with the full object, headers `X-Org-Id` and `Authorization: Bearer <token from POST /v2/token.php>`. Save the GET response first; never write the token into a file. The prompt editor rejects some characters (`&amp;`, some CSS) — templates use a bare `&` and no inline styles.
- **Swapped ids fail at the next script, not at the AI node.** Both ids are valid and both nodes run; the symptom is `cannot read property '<field>' of undefined` in the grading script, with the draft sitting under the *other* alias in the data going into it. Swap the ids; never patch the script.

## The API receipt — the one sanctioned "log" (Brent, Sep 2026 — ETG)

Brent wants an agent-visible read-out of every API request a run made. The approved shape:

- **One append-only form variable** (`api_trail`), cleared only by the seed script. At each call site, next to the line that names the request, append one entry: alias + a readable subject (the ticket title, the PNR). Where a script reads the response, it appends the result (OK/FAIL, code, short detail) at that moment, so a later call to the same alias cannot overwrite the evidence.
- **One catalogue** alias → readable step name, seeded once.
- **One renderer** grades each entry — from the recorded result, or, for a call no script reads, from `actions[alias]._zt_meta` at the end (flagged as read back) — and renders failures first, then completed, as a transform on the closing screen and on the failure path.
- No timestamps (no `Date`); rows are numbered in append order.
- Not this: an arm/flush helper block pasted into every API-adjacent script, `ZT.log`, per-step breadcrumbs, or a debug flag gating it.

## One Connected Object, one Data node (house rule — Aug 2026, ETG)

**A Connected Object belongs on exactly one Data node in a tree.** Never place the same `data_connected_object_id` on a second node so the tree can "check again" whether something exists yet. If a call has to run more than once, it is the same node re-entered by a cursor loop — not a copy.

**There is no retry or poll primitive in Zingtree, and building one is a defect, not a workaround.** When a downstream system needs time to settle before the next call (async record creation, eventual consistency), the supported pattern is a single **Content node with `escalate_after`** placed before the fetch:

```json
{ "type": "Content", "content": "<p>Committing child ticket...</p>",
  "escalate_after": "3", "escalate_after_unit": "SEC", "continuation_node_id": "<fetch node>" }
```

It renders a status line, auto-advances after n seconds, and costs one node. Tune the number, don't add nodes. Full case study and lint rules: `patterns.md` → "ONE REQUEST, ONE NODE — never re-issue an API call to re-check something".

**Lint:** count `data_connected_object_id` occurrences across the tree; more than one node per id is a finding unless the two calls genuinely differ in purpose and inputs (ETG posts its errand note and its transfer note through one note Connected Object from two nodes — two different notes, not a retry).

## White Listing

To whitelist Zingtree API requests to your own APIs, all requests from Zingtree come from these Static IPs:

- 54.85.52.170/32
- 52.0.160.217/32
- 3.233.140.192/32

## Limitations

- The base domain must be a **valid domain URL** (no IP addresses).
- Zingtree does **not** support XML.
