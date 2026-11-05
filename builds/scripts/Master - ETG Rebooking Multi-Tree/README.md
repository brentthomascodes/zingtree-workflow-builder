# Master Workflow — ETG "Rebooking" Multi-Tree Family

**This is a reference implementation (the large multi-tree one).** Exported folder `Selected_from_ETraveli Group` (15 trees), exported Jul 2026. JSON: `Workflow JSONs/ETG/Rebooking Multi-Tree (master).json`. When building a large hub-and-spoke workflow that dispatches to many outcome subtrees and juggles complex data (arrays of objects, grouped buckets), match these patterns.

Complements the other two masters: the **ETG Cancellation Errand** (single-tree depth) and the **Returns Multi-Tree (SFDC)** (5-tree bucket-per-subtree orchestration). This one is the **routing-hub** shape — one hub dispatches to many outcome/handling subtrees, and grouping happens by an agent-chosen *handling type* rather than by a data attribute.

## The tree family (15 trees)

Hub: **`1. Rebooking`** (id 359750132, 35 nodes) — the only entry point; orchestrates everything.

Handling subtrees dispatched by the hub (each a `Tree` node with `open_tree_id` + `return_tree_node_id` back into the hub):

- `2. GDS` (id 428897840, 45 nodes) — GDS post-sale handling; itself dispatches shared outcome subtrees `2a. Escalate to Support` and `2b. Refer to airline`.
- `3. LCC` (id 443454934, 24 nodes) — low-cost-carrier handling; returns to hub.
- `4. Portals` (id 578331418, 67 nodes) — external-portal handling; the deepest subtree, dispatches `4a. Portals - Escalate to Support Outcome` and `4b. Portals - Refer to Airline Outcome`, and can hand into `3. LCC`.
- `5. Take Payment` (id 197593321, 11 nodes) — payment capture (Data/Connected Object).
- `6. Escalate to Support` (id 823264706, 6 nodes).
- `7. GDPR Docs` (id 316841739, 6 nodes).
- `8. No Action` (id 608739423, 3 nodes).
- `9. Different Request` (id 903581947, 16 nodes) — a **dispatcher tree**: 10 `Tree` nodes fanning out to per-category request trees that live elsewhere in the org (Cancellation, Refund, Add passenger, Personal-info change, Document/Travel info, Payment questions, Ancillaries, Name correction, Other).
- `10. Refund Flex` (id 559884173, 6 nodes).

Shared outcome subtrees (reused by more than one parent): `2a`, `2b`, `4a`, `4b` — small (6–7 nodes), each collects a few native form fields then Tree-links back to the caller.

Utility subtree: **`Persistent Buttons`** (id 921515801, 10 nodes) — attached globally via the hub's project setting `show_subtree_persistent_buttons = "1"`, so Escalate / Supervisor Callback / Channel Disconnected are reachable from any screen without wiring them into every node.

## Why it qualifies as a master

- 15 coherent trees, one clear entry point, consistent `Tree` + `return_tree_node_id` handoff throughout — a textbook **hub-and-spoke** at larger scale than the Returns master.
- Rich **complex data structures**, exactly the thing Zingtree wasn't originally built for: `selected_pnrs` (array of PNR objects), `grouped_pnrs` (array of arrays — buckets of PNR objects), grouping via `Array.prototype.reduce` with composite keys, membership tests via `Set`, object spread to enrich items.
- **Nested cursor loops** with re-runnable counter reset: an outer PNR loop and an inner grouped-bucket loop.
- Correct data-setting discipline: arrays/objects → `setTransformData`, scalar route → `setFormData` (`groupedPNR_Route`), HTML → `*_html` transforms.
- Dynamic View (`views.findorder`) → transform, dynamic-HTML card rendering, heavy **native form fields** (GDS 16, Portals 26, LCC 10 nodes), and clean **script-before-router** Scoring nodes.

## Hub node graph (`1. Rebooking`, by node id)

```
2  Content Display PNR [ROOT]  — findorder Dynamic View grid, agent selects PNRs
41 Script  Set Selected PNR's  — selected_pnrs = views.findorder; is_linked_pnr_selected guard
42 Scoring Use transformed data — is_linked_pnr_selected == true -> 43 | else -> 22
43 Content Linked PNR Selected
22 Script  Iterate Selected PNR's — PNR CURSOR: current_pnr, pnr_index (reset to 0 at end),
                                    isMorePNR, pnr_banner
5  Content Display Passengers
30 Script  Format Passengers    — merge passenger detail into current_pnr
34 Script  Store Current PNR
6  Scoring Post Sale Handling Type Route — routes on transforms.current_pnr.postSaleHandleType:
             "GDS" -> 7 GDS | "LCC"/"EXCEPTION_LCC"/"EXCEPTION_GDS" -> 8 LCC
             | "EXTERNAL_PORTAL" -> 9 External Portal | empty fallback
7/8/9 Tree  GDS / LCC / External Portal  (return_tree_node_id = 39, back to hub)
33 Scoring Is more PNR selected? — transforms.isMorePNR == true -> 22 (next PNR) | else -> 40
40 Script  Format Customer Action Table — dynamic HTML: per-PNR <select> named
                                          customer_action_<pnr>
36 Content Customer Action       — renders the table
37 Script  Set Grouped PNR's     — STITCH per-PNR selects (ZT.getVariableValue("customer_action_"+pnr));
                                    reduce() into grouped_pnrs buckets keyed by
                                    proceed|<handling> / doNotProceed / changes;
                                    count CHILD_TICKET_HANDLINGS Set members -> isCreateChildTicket
35 Script  Grouped PNR Buckets    — BUCKET CURSOR: current_pnr_bucket, grouped_count (reset to 0),
                                    isMoreGroupedPnrs; set groupedPNR_Route (scalar) via setFormData;
                                    build grouped_pnr_bucket_details HTML
11 Scoring Proceed - Proceed Handling — VALUE-MAP router: 8 buttons all keyed on groupedPNR_Route
                                        value + empty fallback -> handling subtrees
14/15/16/17/18 Tree Take Payment / Escalate / GDPR Docs / No Action / Refund Flex (return -> 38)
21 Scoring Is more PNR selected? — transforms.isMoreGroupedPnrs == true -> 35 | else -> 20
20 Script  Format Internal Note
25 Data    Create Internal Note - No Group ID
53/54/55 Tree Escalate to Support / Supervisor Callback / Channel Disconnected (Persistent Buttons)
56 Tree    Changes -> 9. Different Request
```

## Distinctive patterns to reuse from this master

1. **Route on an agent-chosen handling type, then group by it.** Unlike the Returns master (buckets from a data attribute), here the agent picks a *customer action / handling* per PNR in a dynamic-HTML table; a stitch script (`37`) reads each `customer_action_<pnr>` select and `reduce()`s the PNRs into buckets keyed `proceed|<handling>` / `doNotProceed` / `changes`. This is the keyed per-item native-read counter-loop applied to routing, not just data collection.

2. **Value-map router (Scoring node 11).** Eight buttons whose `button_text` each equals a `groupedPNR_Route` value, plus one empty fallback — routing by matching a single scalar variable to button text instead of eight boolean expressions. Use when a script has already reduced the decision to one enum-like string; use boolean expression routers (`flag == true`) when the decision is a computed boolean. Both are one-thing-per-button routers with an empty else.

3. **Nested re-runnable cursor loops.** Outer PNR loop (`22`, `isMorePNR`) and inner grouped-bucket loop (`35`, `isMoreGroupedPnrs`), each incrementing its own counter and **resetting it to 0 when exhausted** so the whole hub can run again for the next order without leaked transforms.

4. **Shared outcome subtrees.** `2a/2b/4a/4b` are tiny (few native form fields + a Tree link home) and reused by multiple parents — extract an outcome subtree when the same "capture reason + return" screen appears under several handlings, instead of duplicating it per parent.

5. **Persistent-button subtree, wired once at the project level.** Set `show_subtree_persistent_buttons = "1"` on the hub and keep global actions (Escalate, Supervisor Callback, Channel Disconnected) in one `Persistent Buttons` tree, rather than adding them to every node.

6. **Project-level predefined vars.** The hub declares `proceedHandling`, `isMorePNR`, `payment_method`, `groupedPNR_Route`, `isSelectedPNRCustomerAction`, and a Zendesk custom field as `predefined` vars so they resolve everywhere from the first render.

7. **Guard before you loop.** `Set Selected PNR's` (`41`) computes `is_linked_pnr_selected` with optional-chaining guards (`views?.findorder[0]?.providerReference`) before the cursor starts.

## Honest caveats (why this is a reference, not gospel)

- **No `claude.md` memory node** in any of the 15 trees — this is a customer export and predates Brent's house convention. Do not treat its absence as approval to skip the node; a rebuild of this family should add one per tree.
- All trees are **dev versions** (`live = 0`) and `merge_vars_not_fixed = "0"`; if a shared downstream node is ever made to render script-staged `${transforms.*}`, flip that per the Penrose lesson.
- A couple of node titles drifted generic (`Handle response`, `New Node (57)`) — the "reads like a story" title lint still applies; most titles here are exemplary (`Iterate Selected PNR's`, `Grouped PNR Buckets`, `Is more PNR selected?`).
- Several `Tree` links point to trees **outside this folder** (the `9. Different Request` category trees, and a couple of `open_tree_id="1"` "Return" placeholders) — expected for a partial folder export; they resolve inside the full org.
