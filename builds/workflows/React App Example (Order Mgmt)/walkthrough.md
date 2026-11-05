# React App in Zingtree — Order Manager (reference build)

A working example of the pattern: **fetch → format/build a React app → render it in a
content node → drive it from the tree's settings code → act via Zingtree action
buttons that each hit a different data source → reformat → pipe the result back
into the same React UI.** Every API is mocked with `ZT.setResponseData` and read
back through the `actions` namespace, so the tree runs standalone but behaves
exactly as it would against real Connected Objects.

## `setResponseData` — verified

From the CX Actions docs (Transformation Functions and Script Node):

> **Setting Response Data** — Sets the response data with the given alias.
> `ZT.setResponseData("customerInfo", { name: "John Doe", age: 30 });`
> Signature: `setResponseData(alias: string, data: any): void`

And from the Namespaces article, the actions namespace "stores all data returned
from a CX Action (API Response)," read as `actions.<alias>` in scripts or
`${actions.<alias>.x}` in content. So `ZT.setResponseData("get_orders", data)`
followed by `actions.get_orders` is a faithful stand-in for a real API call — the
canonical casing is `setResponseData` (your `zt.setresponseData` was right in
spirit). Note: a real Connected Object returning a *bare array/primitive* gets
wrapped under `value` (`actions.get_orders.value`); when you set the data
yourself you control the shape, so this example uses an object and reads
`actions.get_orders.orders`.

## The seven steps, mapped to nodes

| Step | Node | What it does |
|---|---|---|
| 1. API request to get data | **1 · Script (root)** | Mocks the GET: `ZT.setResponseData("get_orders", {customer_id, orders})`. In production this is a **Data / Connected Object** node. |
| 2. Format data & build the React app | **2 · Script** | Reads `actions.get_orders`, builds a view model, writes `transforms.app_html` — a *shell* (mount div + hidden JSON data island + hidden `zt-data` inputs). |
| 3. Content node displays the app | **3 · Content** | Renders `${transforms.app_html}`. |
| 4. Settings code manages state/functionality | **Settings > Custom Code** (`script_code`) | The app itself: **self-contained vanilla JS — no framework, no CDN**. Watches the DOM, reads the data island, renders, holds selection + param state. |
| 5. Zingtree action buttons in the app add different data sources | **3 · Content** buttons `Submit Refund`→4, `Submit Reship`→5, `Finish`→6 | The app draws its own buttons; on click it writes the `zt-data` inputs and **clicks the matching native Zingtree button** to navigate. Each button routes to a different post script = a different data source. |
| 6. Script formats it, then posts / gets new data | **4 · Script** (refund) / **5 · Script** (reship) | Reads the selection, formats the POST body, mocks the POST (`post_refund` / `post_reship`), mocks a refreshed GET into `actions.get_orders`, and appends the action to `transforms.action_log`. |
| 7. Load data back, format it, pipe it into the UI | back to **2 → 3** | Nodes 4/5 continue to node 2, which reformats the updated `actions.get_orders` and re-renders the same screen. |

### Finish = a real submit
The app's **Submit & finish** button routes to **6 · Script**, which gathers the
whole session — `transforms.action_log` (every refund/reship) plus the final
`actions.get_orders` — formats a submit body, mocks the POST
(`actions.submit_session`, your real "save session" API / DCN), and builds a
self-contained **confirmation screen** (`transforms.done_html`) plus a plain-text
`case_note_text`. **7 · Content** renders that congratulations screen with the
confirmation id, every action taken, the final order states, and a Copy-for-case-notes
button.

## No fetch(), no framework — the model

The browser never calls an API. Every "API request" is a **navigation to a
Script / Data Connected Node**. The front-end is just state + UI. Two reasons the
app is plain vanilla JS in `script_code` (not React, not in the transform HTML):

- **No CDN to race or fail.** The first cut loaded React from a CDN and read
  `React.createElement` at startup before the CDN finished — it threw, the
  observer never attached, and the screen sat on "Loading." Self-contained
  vanilla JS can't have that failure.
- **`script_code` runs in the content document and survives navigation.** The
  transform HTML is re-rendered every time the node is shown and you **cannot
  navigate from inside it**. So node 2 owns the *data + shell* (JSON island +
  mount), and `script_code` owns the *runtime*: a `MutationObserver` re-renders
  the app each time the screen reappears (loop-guarded by `generated_at`).

Native buttons are hidden by text-match and proxied, so if the JS ever fails the
native Zingtree buttons stay visible and usable — it degrades gracefully instead
of getting stuck.

## The action-button bridge (step 5, the important bit)

You can't leave a node from transform HTML, so the app proxies through the real
Zingtree buttons:

1. The app writes the agent's choice into hidden `zt-data` inputs on node 3
   (`selected_order_id`, `selected_action`, `action_payload`). Those inputs carry
   `class="zt-data"`, so Zingtree captures them as form data on the next click.
2. The app finds the native Zingtree answer button by its text
   (`Submit Refund`) and clicks it.
3. Zingtree navigates to the matching post script (node 4 or 5), which reads the
   inputs with `ZT.getVariableValue` and posts to *its* data source.

Adding a third action = clone node 4/5, add a native button on node 3, and add an
entry to the `ACTIONS` array in `script_code` with the new button's text.

## Gotchas baked in
- **`merge_vars_not_fixed = "1"`** is set on the tree. Node 3 re-renders
  `${transforms.app_html}` on every loop; Zingtree's default freezes merge fields
  to their first value, which would show a stale table forever.
- The data island escapes `<` to `<` so the JSON can't break out of its
  element.
- Node 1 is a **Script root** (allowed and recommended for seeding data before
  the first screen renders).

## Files
- `Order Manager React App.json` — import this into Zingtree (single bare project object).
- `settings_script_code.html` — the React app; also embedded in the JSON's `script_code`. Paste into Settings > Custom Code if importing the nodes separately.
- `node1..node6 *.js` — the script-node bodies, standalone and commented (node 6 = the Finish/submit step).
- `claude_md_node.md` — the tree's memory node (node 7), included in the JSON.

## Verification run
Two passes. **Stubbed `ZT`:** `node --check` on all six scripts; full data
round-trip — seed → mock GET (3 orders) → build shell → refund a Shipped order
(flips to `Refunded`) → reship a Processing order (status/tracking update) →
**Submit & finish**: `action_log` holds both actions, `submit_session` is mocked,
and `done_html` shows the confirmation id, both actions, and the final order
states. **JSDOM (front-end):** the app mounts (loading text replaced), renders 3
rows, hides the native buttons, row selection sets `selected_order_id`, Refund
writes `selected_action`/`action_payload` and fires the native "Submit Refund"
click, and Submit & finish fires the native "Finish" click. Data path and UI path
both proven.
