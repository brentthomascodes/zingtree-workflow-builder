# claude.md — React App Example (Order Manager)

Unlinked memory node. Read first before editing this tree.

## Purpose
Reference implementation of the "React app inside Zingtree" pattern: fetch data
from an API, format it in a script, render a React app in a content node, drive
it from the tree's Settings custom code, take actions via Zingtree action
buttons that each hit a different data source, then reformat and pipe the result
back into the same React UI. All APIs are MOCKED with `ZT.setResponseData` so the
tree runs standalone while still reading through the `actions` namespace exactly
as a real Connected Object would.

## Node map
- 1 Script (root) — Seed `customer_id` from query param; mock GET → `ZT.setResponseData("get_orders", {customer_id, orders})`; reset `action_log`. → 2
- 2 Script — Read `actions.get_orders`, build view model, embed JSON data island + zt-data inputs + mount in `transforms.app_html`. → 3
- 3 Content — Renders `${transforms.app_html}`. Native buttons: Submit Refund→4, Submit Reship→5, Finish→6. App (in script_code) hides the native buttons and proxy-clicks them.
- 4 Script — Read selection, format refund body, mock `post_refund`, refreshed `get_orders` (order→Refunded), append to `action_log`. → 2 (rebuild + re-render)
- 5 Script — Same for reship: mock `post_reship`, refreshed `get_orders` (new tracking), append to `action_log`. → 2
- 6 Script — Finish/submit: read `action_log` + final `get_orders`, mock `submit_session` POST, build `transforms.done_html` confirmation + `case_note_text`. → 7
- 7 Content — "All done" confirmation: renders `${transforms.done_html}` + copy-for-case-notes button. Terminal.
- 8 Content — this claude.md node (unlinked).

## Action log
`transforms.action_log` accumulates one entry per refund/reship
(`{action, order_id, item, detail, result_id, at}`). Reset in node 1, appended in
nodes 4/5, consumed by node 6 to show everything captured on the confirmation.

## Data dictionary
- Query param in: `customer_id`.
- actions.get_orders `{customer_id, orders:[{order_id,placed_on,item,qty,amount,status,tracking}]}` — the mocked API.
- transforms.app_html — the React shell rendered by node 3.
- transforms.orders_json — the view model (debug/merge convenience).
- Form data written by React (zt-data hidden inputs on node 3): `selected_order_id`, `selected_action` (refund|reship), `action_payload` (JSON string).
- actions.post_refund / actions.post_reship — mocked POST responses.
- Form data: `last_action_summary`.

## Where the app lives
Tree Settings > Custom Code (`project.script_code`). Lightweight vanilla JS —
NO framework, NO external CDN (an earlier React+CDN version got stuck on the
loading screen because the CDN load raced the code). It watches the DOM (content
re-renders on every navigation), reads the `#zt-order-data` island, renders into
`#zt-order-app`, and — because you can't navigate from inside transform HTML —
writes the zt-data inputs then clicks the matching native Zingtree button to
advance. Loop-guarded by `data.generated_at` so its own innerHTML writes don't
re-trigger the MutationObserver. Native buttons are hidden by text-match and
proxied, so if the JS ever fails the native buttons remain usable.

## Mental model (why there's no fetch())
The browser never calls an API. Every "API request" is a *navigation* to a
Script/Data Connected Node. The app only holds UI state and clicks a Zingtree
action button; nodes 4/5 are where the request/format/post actually happens.

## Conventions / gotchas
- `merge_vars_not_fixed = "1"` is REQUIRED: node 3 re-renders `transforms.app_html`
  every loop; without it the first render would be frozen.
- To mock an API: `ZT.setResponseData("<alias>", data)` → read as `actions.<alias>`.
  A real Connected Object returning a bare array would appear as `actions.<alias>.value`.
- Each React action button = its own format+post script (a different data source).
  Add a third action by cloning node 4/5, adding a native button on node 3, and a
  React button that calls `runAction(...)` with the new button text.

## Changelog
- 2026-07-23 · Claude/Brent prompt (build React-app example) · created tree (nodes 1-7), script_code app, claude.md node.
- 2026-07-23 · Brent (stuck on loading screen) · replaced React+CDN with self-contained vanilla state app; observer-first + try/catch + generated_at loop-guard; native buttons hidden-by-text and proxied so failures degrade gracefully. Marker renamed zt-app-marker.
- 2026-07-23 · Brent (Finish = real submit) · added session action_log (reset node1, append nodes 4/5); new node 6 submit script (mock submit_session POST + build done_html confirmation + case_note_text); node 7 now the "all done" confirmation screen with copy-for-case-notes; claude.md moved to node 8.
