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

## One Connected Object, one Data node (house rule — Aug 2026, ETG)

**A Connected Object belongs on exactly one Data node in a tree.** Never place the same `data_connected_object_id` on a second node so the tree can "check again" whether something exists yet. If a call has to run more than once, it is the same node re-entered by a cursor loop — not a copy.

**There is no retry or poll primitive in Zingtree, and building one is a defect, not a workaround.** When a downstream system needs time to settle before the next call (async record creation, eventual consistency), the supported pattern is a single **Content node with `escalate_after`** placed before the fetch:

```json
{ "type": "Content", "content": "<p>Committing child ticket...</p>",
  "escalate_after": "3", "escalate_after_unit": "SEC", "continuation_node_id": "<fetch node>" }
```

It renders a status line, auto-advances after n seconds, and costs one node. Tune the number, don't add nodes. Full case study and lint rules: `patterns.md` → "ONE REQUEST, ONE NODE — never re-issue an API call to re-check something".

**Lint:** count `data_connected_object_id` occurrences across the tree; more than one node per id is a finding unless the two calls genuinely differ in purpose and inputs.

## White Listing

To whitelist Zingtree API requests to your own APIs, all requests from Zingtree come from these Static IPs:

- 54.85.52.170/32
- 52.0.160.217/32
- 3.233.140.192/32

## Limitations

- The base domain must be a **valid domain URL** (no IP addresses).
- Zingtree does **not** support XML.
