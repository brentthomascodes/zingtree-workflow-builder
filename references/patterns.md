# Brent's Zingtree Build Patterns

Structural rules and proven shapes, extracted from real production trees (Quest/Delta, Experian, ETG, Corpay, Penrose, Vermasoft) and three **master reference implementations** (see `Zingtree Builder/Script Library/` when the workspace is connected). Design principles are in `00-etl-design.md`, the script standard in `01-scripting-standards.md`, data placement in `02-data-and-namespaces.md` — this file holds the platform-shape rules those three rely on: the ETG "Register Errand: Cancellations" single tree (loops, dynamic HTML, ticket automation); the Returns multi-tree family (hub-and-spoke, bucket-per-subtree across 5 trees); and the ETG "Rebooking" multi-tree family (large hub-and-spoke across 15 trees — one hub routing to many handling/outcome subtrees, with the richest complex-data handling: arrays of objects, array-of-arrays buckets via `reduce`, `Set`, nested cursor loops). There is no single dogma — these are the common themes every master shares. Follow them when writing or reviewing any Zingtree work.

## Multi-tree orchestration (hub-and-spoke)

When a workflow handles distinct data subsets that each need different business logic, split it: one **hub tree** organizes the data, single-responsibility **subtrees** perform each subset's logic.

- The hub fetches once, then one script maps/filters everything downstream needs — e.g. bucket line items by policy (status checks, `ZT.isOlderThan30Days(...)`), store the buckets (a JSON string in form data; a transform only where a Dynamic View or merge field must read it) and expose each bucket as a Dynamic View: `ZT.setResponseData("dynamic_view__alias", { records: array })` (selections read back via `views.dynamic_view__alias`).
- Tree nodes dispatch subtrees sequentially, each with `open_tree_id` + `return_tree_node_id` so control returns to the hub, which dispatches the next bucket.
- Every subtree's root is a **guard logic node** — `len(views.dynamic_view__X) >= 1` → run, else → Tree node straight back to the hub. Subtrees are safe to call unconditionally; empty buckets cost nothing.
- **Subroutine trees**: a small generic tree (e.g. "Add Order Line Items": cursor loop POSTing each item) takes input via an agreed variable (`current_items_group`) and is called from many places with different return nodes. Extract one when the same loop-and-POST shape appears in multiple subtrees.
- Logic-node expressions may use `len()` over transforms/views — still exactly one expression per button.
- Group-then-loop: `Map` keyed by a field → `Array.from(map.values())` → cursor loop over groups; set the group's key (`vendor_key`) as form data so the next Connected Object auto-receives it by exact name match. One iteration script can advance the cursor, build the display HTML, and stage the next API payload's form data together.

### Two hub-and-spoke shapes

- **Bucket-per-subtree (Returns master).** Buckets come from a *data attribute*; each subtree owns one bucket's logic; subtree roots guard on `len(views.dynamic_view__X) >= 1`.
- **Routing-hub at scale (ETG Rebooking master, 15 trees).** The hub dispatches to many single-purpose handling/outcome subtrees and grouping is by an **agent-chosen handling type**, not a data attribute. Distinctive reusable pieces:
  - **Agent-chosen grouping via keyed native reads.** A dynamic-HTML table renders one `<select>` per item named `customer_action_<key>`; a stitch script reads each with `ZT.getVariableValue("customer_action_"+key, null)` and `reduce()`s items into buckets keyed by the chosen handling (`proceed|<handling>` / `doNotProceed` / `changes`). Buckets are an **array of arrays of objects** (`grouped_pnrs`) stored as one JSON string in form data; the scalar route per bucket is its own form variable (`groupedPNR_Route`).
  - **Nested re-runnable cursor loops.** Outer loop over items, inner loop over buckets; each counter resets to 0 when exhausted so the whole hub re-runs cleanly.
  - **Value-map router.** A Scoring node whose buttons' `button_text` each equal one value of a scalar the script staged (`groupedPNR_Route`), routing by matching a single scalar to button text. Use it when a script has reduced the decision to one enum-like string; use a boolean-expression router (`flag == true` / `flag == false`) when the decision is a computed boolean. Every button carries an explicit match/expression and `continuation_node_id` is the structural else — no blank fallback button (Brent's rule, Jul 2026).
  - **Shared outcome subtrees.** Tiny subtrees (a few native form fields + a Tree link home) reused by multiple parents — extract one when the same "capture reason + return" screen appears under several handlings.
  - **Persistent-button subtree, wired once.** Set `show_subtree_persistent_buttons = "1"` on the hub and keep global actions (Escalate, Supervisor Callback, Channel Disconnected) in one `Persistent Buttons` tree instead of on every node.
  - **Project-level predefined vars.** Declare cross-tree flags/scalars (`proceedHandling`, `isMorePNR`, `groupedPNR_Route`, inbound ZD custom fields) as `predefined` vars on the hub so they resolve from the first render.

When it's one linear process, prefer the single-tree shape below instead.

## ONE REQUEST, ONE NODE — never re-issue an API call to re-check something (Brent's rule, Aug 2026 — ETG)

**In Zingtree we never make the same API request from more than one node in order to retest whether something exists yet.** A Connected Object belongs on exactly ONE Data node. If a value has to be read again, you route back to that one node — you do not clone it. And in practice you almost never need to route back either: see the wait primitive below.

This is the single most expensive mistake made on the ETG "Register Errands - Dynamic" tree (v36 → v38.1, Aug 2026). The problem was real — Zendesk creates a side conversation's backing ticket asynchronously, so `targetTicketId` may not exist the instant the create returns 201. The wrong answers, in order:

- **v36 — a counted retry loop.** Poll node 40, check, and on a miss route back through the same four nodes, up to 10 times. Zingtree refused it live: *"Workflow execution paused — The last action triggered an invalid loop."*
- **v37 — unrolled the loop into three copies.** Connected Object #181 (`Get Side Conversations`) placed on three separate Data nodes (40, 26, 54), each with its own copy of the check script and its own router. 46 → 56 nodes to poll one endpoint three times.
- **What actually shipped** — Brent deleted all of it and changed **one field**: the Content node that sits between the create and the fetch had its `escalate_after` raised from `1` to `3` seconds. 37 nodes. Same fetch, once.

### The wait primitive: a Content node with `escalate_after`

**This is how you wait for an external system in Zingtree. There is no retry or poll primitive, and you must not build one.**

```json
{ "type": "Content", "page_title": "Commit Child Ticket",
  "content": "<p>Committing child ticket...</p>",
  "escalate_after": "3", "escalate_after_unit": "SEC",
  "buttons": {}, "continuation_node_id": "40" }
```

A Content node with `escalate_after: "<n>"` + `escalate_after_unit: "SEC"` renders a brief status message and auto-advances after n seconds. It gives the downstream system time to settle, tells the agent what is happening, and costs one node. Tune the number; do not add nodes. (ETG node 60, production, Aug 2026 — `1 SEC` was too tight for Zendesk, `3 SEC` holds.)

### Zingtree's runtime invalid-loop guard

Zingtree counts node revisits at runtime and halts a session that revisits the same node set too many times. Two consequences:

- **Array-cursor loops are safe** — each pass advances a counter and the array bounds the revisit count (ETG nodes 32/36/44 have always been fine).
- **A wait/poll loop is not** — the same nodes, revisited with no data advancing, is exactly the shape the guard exists to kill.
- **No static validator can see this.** It surfaces only on a real import + live run, so "the lint passed" proves nothing about it.

### When the engine rejects your shape, stop — do not escalate machinery

v36's rejection was the platform telling us the design was wrong. Unrolling it into three copies of the same request defeated the guard and made the build worse. **A guardrail refusal is a design signal, not an obstacle to route around.** Take it back to Brent with the error text and the shape that caused it.

### Lint (every build/review)

- Flag any `data_connected_object_id` that appears on more than one node. Legitimate only if the calls genuinely differ in purpose and inputs — never as a retry.
- Flag any cycle that does not advance a cursor/counter on each pass.
- Flag any "check → route back → check again" cluster; replace with one wait node + one call.

## Machinery must earn its node count (Brent's rule, Aug 2026 — ETG)

The same ETG session added a guard/bookkeeping layer that Brent deleted wholesale when he took the tree to production: 9 of the 46 nodes, plus the accumulator arrays and reconciliation that fed them. Before adding defensive structure to a tree, price it in nodes and say the price out loud.

- **A guard node per protected call is usually the wrong trade.** Idempotency guards for the child, grandchild and errand loops cost 5 nodes (2 routers + 2 bookkeeping scripts + 1 router) and 5 transform arrays. Brent removed all five rather than maintain them by hand. If a guard cannot ride inside a script node that already exists, say what it costs and let Brent choose.
- **Reconciliation that reports on your own bookkeeping goes with the bookkeeping.** Node 21's "planned vs. confirmed created" warning was commented out the moment its input arrays stopped being written.
- **Removing a consumer means removing its producers, in the same edit.** Production still writes eight variables nothing reads (`grandchild_parent_resolved`, `grandchild_parent_blocked`, `side_conversation_id`, `attempted_*`/`created_*`/`blocked_*` keys, `has_unresolved_selections`) across nodes 10/29/32/39 — residue from deleted consumers. This is the existing "only create variables that are referenced elsewhere" rule failing at deletion time, not creation time. Sweep both directions.
- **The correction to the underlying defect can be free.** The one piece of v36/v37 worth keeping was behavioural, not structural: on a failed resolve, skip rather than create against a *guessed* parent id. No node, no counter, no wait.

## Script comments describe the code as it is NOW — history lives in claude.md (Brent's rule, Aug 2026 — ETG)

**Never narrate version history inside a script node.** The `claude.md` node's Changelog is the changelog; that is the whole reason it exists.

ETG node 36, same requirement, both shipping code:

```javascript
// what shipped (production, 29 lines total)
let grandchild_parent_id = actions.get_side_conversation_detail.side_conversations
  .find(x => x.id == actions.create_child_ticket.side_conversation.id)
  .external_ids.targetTicketId;
ZT.setFormData("grandchild_parent_id", grandchild_parent_id)
```

versus what was delivered — 135 lines, of which ~45 were a prose account of v19 → v36 → v37 → v38 and a `resolveTargetTicketId()` helper wrapping the same expression in three fallbacks and `String()` coercion on both sides of a comparison that `==` already handles. Same behaviour on the happy path; 78% more code to read.

- Comments explain *why this code is shaped this way*, in the present tense. No version tokens, no dates, no "previously this did X".
- **Stale comments outlive the code they describe.** Production node 39 still carries a v37 comment mapping a resolve chain (`41/40/18 -> 20/26/28 -> 31/54/55`) whose nodes no longer exist — actively misleading to the next reader.
- Reinforces "Write plain, minimal script code" below. That rule was already in this file when the 135-line version was written; the failure was not knowing the rule, it was not applying it under pressure to look thorough.
- **Lint:** flag any script comment containing a version token (`v12`, `v37 (2026-…)`), a date, or a node ID that does not exist in the tree.

## Logic placement (core principle)

Logic lives in scripts; logic nodes make simple routing decisions only. Every logic node evaluates exactly one boolean a script already computed — button with `logic_expression` like `is_more_tickets == true` for the true branch, and an explicit complementary expression (`flag == false`) for the else branch, with `continuation_node_id` as the structural fallback. **Never a blank/empty-expression button — every logic button evaluates something explicit (Brent's rule, Jul 2026).** Never house complex logic (multi-condition chains, data comparisons) in logic nodes.

**A logic node's branches must never converge on the same node (Brent's rule, Jul 2026).** Two evaluated buttons routing to the same destination means the split is meaningless — the node isn't making a real decision and could be built better. Fix it one of two ways: (a) move the evaluation UPSTREAM into a script node (compute the boolean/route there, stage it, continue straight down), or (b) if the branching genuinely needs multi-condition/complex logic, rebuild it as an **advanced logic node** (`advanced_logic_node="1"`) with a proper complex expression instead of a simple logic node splitting on a trivial flag. Exception: `continuation_node_id` pointing at the same target as the `== false` button is the required structural fallback, not a duplicate evaluated path — the rule is about two evaluated `logic_expression` buttons sharing a destination. Lint on every build/review.

## Root node — Content OR Script (Script root for seeding)

The root can be a **Script node**, not just a Content node — and often should be. Zingtree runs the Script root, then continues to the first content screen. The canonical use is seeding initial data before anything renders: pull query params into form/transform data (`agent` → `agent_first_name`, Zendesk/SFDC/Genesys record IDs, channel, customer identifiers), normalize them, or stage the first screen's HTML. Exactly one node has `is_root="1"` and it equals `root_node_id`.

- Because a Script root does not render, per-node UI settings (`hide_back_restart`, etc.) take effect on the first *rendered* screen, not the invisible Script root.
- Supersedes any earlier "root must be a Content node" guidance — that was wrong; a Script root imports and runs fine (Brent's correction, Jul 2026 — Adyen).

## The claude.md node (in-tree memory file)

Each workflow carries its own memory: an **unlinked Content node titled `claude.md`** whose `content` field holds static markdown. It works exactly like a project MEMORY/CLAUDE.md, but lives inside the tree JSON so it travels with the workflow through export → edit → re-import. It is never part of the execution flow: no inbound buttons, no continuation into it, hidden from agents (set hide_from_search where available).

Read it first on every task; update it at the end of every edit session. It must contain everything a brand-new author (or a fresh Claude context) needs to manage, build, edit, and maintain the workflow from prompts alone:

```markdown
# claude.md — <Tree Name> (tree <id>)

## Purpose
What this workflow does, for whom, and where it runs (Zendesk app, agent portal, etc.)

## Architecture
Flow summary + node map: every node ID → type, title, what it does, where it routes.
Loops (cursor node, body, logic node, exit), subtree calls (open_tree_id / return_tree_node_id).

## Data dictionary
- Inbound query params expected at launch
- Form variables (name → set where, read where, meaning)
- Transforms (name → shape, producer node, consumer nodes)
- actions.* aliases (Connected Object, endpoint, key response fields)
- views.* aliases (Dynamic View source, what selection feeds)

## External systems
Data Sources, Connected Objects (IDs + aliases), auth notes, payload conventions (sf_* fields etc.)

## Conventions & gotchas
Tree-specific rules, known constraints, things that broke before and why.

## Changelog
- YYYY-MM-DD · <author or prompt gist> · what changed · nodes touched
```

Maintenance rules: keep it accurate over exhaustive — stale instructions are worse than short ones. When an edit changes routing, variables, or node behavior, update the affected sections, then append the changelog entry. When creating the node in a tree that lacks one, derive content from the full inventory (step 1) and confirm intent with the user where the JSON alone is ambiguous. Preserve the node (and its ID) verbatim in every improved JSON you deliver.

## Inbound data — passing data INTO a workflow

Any data — string values or any standard query-param data — can be passed into a Zingtree workflow on the session URL (`?var_name=value&other=123`) and is immediately available inside the workflow as a variable: in logic expressions, in scripts via `ZT.getVariableValue("var_name", "")`, in merge fields, and auto-passed to Connected Objects on exact name match. Design for this: seed context from the embedding system (Zendesk/Genesys/SFDC record IDs, channel, customer identifiers) so the tree can define logic and execution flow from launch — skip intake screens the launcher already answered, pre-route to the right branch, or feed the first API call. `?session_id=` creates/reuses a specific session. When reviewing a tree, ask what the launching system already knows: any agent-entered value that could arrive as a query param is a candidate node deletion.

**Sanitize inbound param values before deriving from them (Brent's rule, Jul 2026 — Adyen).** Query-param values can arrive wrapped in quotes or stray punctuation — a value can come through as `"brent.thomas@...` (leading double-quote), so a naive `split(".")[0]` yields `"brent`. In the Script-root seeder, strip and normalize before use: `raw.replace(/[^a-zA-Z0-9]/g, "")`, then capitalize for display (`Brent`). Treat any raw param as untrusted text, not a clean token.

## Copy-to-clipboard area (content nodes)

To give agents a one-click copy region in a content node, wrap the copyable content between `[[COPY-AREA]]` and `[[/COPY-AREA]]` markers (each marker in its own `<p>`), then add a button that calls Zingtree's built-in `copy_to_clipboard()`:

```html
<p>[[COPY-AREA]]</p>
<p>...the content agents will copy (merge fields like ${summary_text} work here)...</p>
<p>[[/COPY-AREA]]</p>
<p><a class="btn btn-success" style="cursor:pointer;" onclick="copy_to_clipboard();">Copy to Clipboard</a></p>
```

Use this whenever a workflow produces text the agent pastes elsewhere (case notes, customer replies, ticket summaries) — pair it with a script-generated `*_text` transform rendered inside the copy area.

## Hiding Back/Restart on one screen (front-end JS, 2026 Vue theme)

Tree-wide controls (`hide_back_button`, `show_restart_button`) are the only *proven* levers. The per-node `hide_back_restart="1"` field does NOT work in the 2026 Vue/Vuetify theme (confirmed live, Jul 2026 — Adyen). To hide Back/Restart on ONE screen only, use front-end JS in the tree `script_code`:

**Preferred method (confirmed live, Jul 2026 — ETG tree 319861160): `#restart_button` / `#back_button` ARE stable ids** — no marker span or MutationObserver needed. Key a lookup map by tree id → array of node ids, and toggle on Zingtree's `render:finish` event using the tree's `this_tree_id` / `this_node_id` globals:

```html
<script>
// treeId: [node numbers to hide Back/Restart on]
const REMOVE_RESTART_BACK_FROM = {
  '319861160': ['2']
};

function renderFinishCb2() {
  const nodes = REMOVE_RESTART_BACK_FROM[this_tree_id];
  const shouldHide = nodes && nodes.map(String).includes(String(this_node_id));
  document.querySelectorAll('#restart_button, #back_button').forEach(el => {
    if (shouldHide) {
      el.style.setProperty('display', 'none', 'important');
    } else {
      el.style.removeProperty('display');
    }
  });
}

whenEvent('render:finish', () => {
  setTimeout(renderFinishCb2, 0);
});
</script>
```

Add the tree to the map once and list every node id where Back/Restart should be hidden — the callback re-runs on every node render, so it also restores the buttons on nodes not listed. This is simpler than the marker/MutationObserver approach below and should be tried first; fall back to the marker approach only if `#restart_button`/`#back_button` prove unstable on a given tree/theme.

Fallback method (marker span + MutationObserver, use only if the ids above don't hold):
- Put a hidden marker in that node's content: `<span id="zt-first-node-marker" style="display:none"></span>`.
- A `MutationObserver` on `document.body` hides nav controls **only while the marker is present**, and restores them otherwise. Match controls by id pattern OR button text (`back` / `restart` / `start over`) — text-matching was needed under this approach because `#restart_button`/`#back_button` weren't being targeted directly — and exclude answer buttons (`el.closest("#qa-area") || el.closest(".answers")`).
- Run `apply()` on load plus a couple of delayed retries to catch async Vue render.

## Ideal workflow shape: LINEAR top-to-bottom, minimize branching (Brent's rule, Jul 2026 — Vermasoft)

**The best workflow is linear and reads top to bottom. Branching adds complexity and maintenance cost — use as few branch/logic nodes as possible.** Streamlined = `content → (API/script) → content → (minimal) logic → content → content → script → ...` flowing straight down, not a fan of parallel branches.

House shape for capturing condition-dependent input on a linear path:

1. **One script** computes what's needed and stages display/guidance HTML (`ZT.setFormData("screen_html", ...)`) + the fields to ask.
2. **One content node** renders `${screen_html}` and captures answers via **native conditional form fields** (`config.conditional.simple` shows only the fields we need). Dynamic HTML is for *display*; native conditional fields are for *input*.
3. **One follow-up script** gathers the values, sets them as form data, continues down.
4. Only insert a logic/router where a decision truly can't be avoided (e.g. Calendly "any times?").

**Collapse per-option detail screens into this pattern**: a menu fanning out to one screen per choice (call-reason → follow-up/deadline/docs/interpreter; billing → each issue; other-caller → vendor/press/SPAM) becomes one choice screen → one deciding script → one conditional-field content node → one gather script → onward. Many branches become one data-driven linear spine.

Reserve real branching for genuinely divergent downstream processes (subtree calls, Calendly booking vs. no-times). When in doubt, make it linear.

## Node numbering — sequential, lowest available (Brent's rule, Jul 2026)

**When adding a node, always give it the lowest unused integer ID.** Node IDs stay sequential and compact — no gaps, no jumping to `100`/`1000`. This includes the unlinked `claude.md` node: it takes the next sequential number like any other node.

- `project_node_id` and `display_order` must both equal the node's dict key, so the "lowest available number" is the key you file it under.
- When renumbering, every reference moves with the node: `root_node_id`, the single `is_root`, every `button_link` and `continuation_node_id`, and cross-tree `open_tree_node_id` / `return_tree_node_id` (a hub references a subtree's root/return IDs by number — renumbering a subtree can silently break the caller). Renumber the whole tree family together, then re-lint links across all trees.
- Lint: flag any gap in the ID sequence, and offer to compact.

## Naming

snake_case for Zingtree variables (`selected_pnrs`, `is_more_pnrs`, `ticket_card_html`); camelCase for JS-only locals, functions and lookup maps (`bucketByEdvinId`, `groupByErrandKey`). One name per fact across the tree. Connected Object aliases `system__verb_object`. Full rules: `02-data-and-namespaces.md` → "Naming".

### Node titles — the tree must read like a story (always)

Every node title (page_title / node_name), of every type, must be descriptive and succinct so that reading the node titles top to bottom tells the story of what the workflow does — as plain and easy to follow as a children's book. Someone skimming the tree in Zingtree should understand exactly what it does from the titles alone, without opening a single node.

- **Describe the action or moment, not the mechanism.** Title says what happens at that step; the node type already tells the reader how. Good: `Ask customer for policy number`, `Look up account in Salesforce`, `No matching account found`, `More tickets to process?`, `Copy summary for case notes`. Bad: `Script 3`, `Logic node`, `Content 12`, `Untitled`, `node_copy`.
- **Succinct — a short phrase, not a sentence.** Aim for a handful of words. Trim filler ("this", "the step where we"). If you can drop a word and keep the meaning, drop it.
- **Abbreviations only where necessary.** Spell things out by default; use an abbreviation only when it's universally understood (SFDC, PNR, API, ID) or the name would otherwise be unwieldy. Never invent cryptic shorthand.
- **Match the title to the type's job:** Content = the screen the agent sees or the question asked (`Confirm cancellation reason`); Script = the work being done (`Bucket line items by policy`); Logic = the decision as a question (`DOT-regulated?`, `More PNRs?`); Data/CX Action = the fetch or write (`Create Zendesk ticket`); Tree = the subtree's job (`Handle returnable items`).
- **Loops read as a loop:** cursor (`Next ticket`), body (`Show ticket details`), gate (`More tickets?`) so the cycle is obvious from titles.
- **Both fields, always (Brent's rule, Jul 2026 — Vermasoft).** Every node carries BOTH a `page_title` (short, agent/editor-facing) and an informative `node_name` (what it does, and *why* where useful, e.g. `Classify the caller and stage the details screen; sets go_subtree`). Do NOT leave `page_title` empty on agent-facing nodes — supersedes the earlier "page_title may be empty" guidance. The tree must read from titles alone and from names.
- The one exception is the unlinked `claude.md` memory node, which keeps that literal title.
- **Lint rule for generated / reviewed trees:** flag any node whose title is generic (`Script N`, `Content N`, `Logic`, `Untitled`, `Copy of …`), a bare variable/alias, or otherwise non-descriptive. Rename to describe the step before delivering.

## Node-reduction playbook (Penrose MH family, 2026-07)

Proven end-to-end on the Penrose MH Master Triage build (five source trees, 107 nodes → one tree, 44 nodes). Apply these in order; each is a distinct reduction lever.

1. **Many trees → one; collapse the duplicated tail.** When several trees share the same ending (e.g. Outcome screen → other-outcome logic → other-outcome → safety netting repeated in every tree), merge the trees and replace the repeated tail with ONE shared tail. Store each variant's display content in a single **catalog script** as a keyed lookup (`outcomes[outcome_key] = { title, body }`), staged into ONE shared content node via `${*_html}`. Each decision just sets `outcome_key`. (Emoji/non-ASCII in catalog HTML: embed via `JSON.stringify(map)` with ASCII escaping so the script stays ASCII — `\uXXXX` renders correctly at runtime.) Set `merge_vars_not_fixed = "1"` whenever one shared content node renders values staged per-path.

2. **Unified eval-route-setup script — group script nodes.** Never `init script → router → N per-branch setup scripts`. Collapse the whole cluster into ONE titled script that does init, evaluation, ALL per-branch variable/default setting, and builds the next screen's HTML (`ZT.setFormData("screen_html", ...)`) — then set the routing boolean(s). A Zingtree **Script node has a single continuation and cannot branch**, so exactly ONE router (Scoring) follows it to perform the physical N-way branch. Group any adjacent script nodes on the same path into one.

3. **Combine adjacent `content → eval → router → {screenA→scriptA}|{screenB→scriptB}`** into `content → eval → ONE content (conditional fields) → ONE script (`if (driving_var==A){…}else{…}`)`. The router disappears — conditional fields + the `if` do the branching, sectioned by the variable that drove the old router.

4. **Conditional hidden field replaces a thin setter script.** A script whose only job is `setFormData("outcome_key", "...")` should be deleted and the value carried by a hidden form field on the preceding content node (read downstream by the catalog script by name). Native conditional-field config (verbatim shape): `config` = stringified `{"conditional":{"simple":[{"variable":"<field>","op":"eq","value":"<match>"}]}}`.
   - *Convergent branches* (all answers reach the catalog, e.g. a Yes/No that both proceed): make it a native `select` + one conditional hidden `outcome_key` per answer; delete the setters and router.
   - *Single-outcome button branch* (can't condition on a field): a PLAIN hidden field is **overwrite-safe** when every other branch out of the node re-sets the key downstream before the catalog — verify that first.
   - *Other-outcome check*: no script — the router tests the org-proven verbatim `(outcome== 'Other')` directly.
   - Guard: this is for values read by a downstream script or the one blessed `(outcome=='Other')` router. Do NOT feed arbitrary hidden-field values into other router logic expressions (raw form-field comparisons in routers fail live).

5. **Native inputs beat dynamic-HTML inputs — even on a merged screen.** Dynamic-HTML `zt-data` `<select>`s render un-styled (not "native Zingtree" looking) and **cannot enforce `required`**. To keep several conditions' questions on ONE screen, use NATIVE form fields with `config.conditional` keyed on a script-set driver variable (e.g. `condition`), and render only the per-condition **guidance text** via `${*_html}`. Reserve dynamic HTML for genuinely dynamic per-item datasets and for display content — never for standard inputs.

6. **Audit every inbound edge before rewiring a shared node.** Collapsing duplicated tails (lever 1) means a node can become a convergence point for structurally unrelated branches — not just the one you're actively fixing. Before rerouting any node's outbound button/continuation, grep for every OTHER node whose `button_link`/`continuation_node_id` already targets it; don't assume the branch in front of you is the only caller. When a shared producer script becomes reachable from a path where a sibling producer may already have run, make it idempotent — guard its entry with `if (g('result_var')) return;` before recomputing, so the consolidation can reuse one script safely across multiple entry points without breaking a caller that already has a valid result staged. (Learned live, Jul 2026 — Quest/Delta Post Accident: rerouting a shared DOT screen to fix one caller's missing determination would have made a second, already-correct caller silently overwrite its own valid result.)

7. **A downstream classification script must test the SAME trigger set as the router that sent it there.** When a router ORs several conditions to reach a branch, any downstream script re-deriving "why was I routed here" must test the identical condition set, not a subset — otherwise the case that only matched the untested condition gets silently misclassified once it arrives. Lint: whenever a router ORs N conditions to reach a branch, confirm every downstream script re-evaluating that same question tests all N.

## Import safety & verification (learned from live import failures)

Run these as a pre-delivery lint on any generated/edited tree JSON — each corresponds to a real failure:

- **Exactly one node has `is_root="1"` and it equals `root_node_id`.** A Content root or a **Script root** both import and run fine — see "Root node — Content OR Script" above, which supersedes the older "root must be Content" claim that used to live here.
- **Form fields carry ONLY proven schema keys:** `type, name, label, label_type, options, hidden_value, custom_regex, inline, required, score_var, checkbox_score, scores, rank, config`. No `value` key (use `hidden_value`). An unknown key breaks import.
- **`project_node_id` AND `display_order` equal the node's dict key; every scalar field is a string** (`"0"` not `0`, `"1"`/`"0"` not booleans).
- **`predefined_vars` keys must be a contiguous `0..n-1` sequence, same as nodes.** Deleting an entry and leaving a gap makes the whole file fail to import with no usable error — the graph lint never sees it, because validators read `Object.values(predefined_vars)` and never the keys. Re-index after any delete, and keep each entry's `project_id` a **number**, not the string form of the top-level project id. (Learned live, Aug 2026 — ETG v38 failed to import over a single missing key `14`; v38.1 was the re-index.)
- **Scoring routers** with `logic_expression` buttons need `advanced_logic_node="1"` + an empty-expression fallback button; op-based score calculators keep `"0"`.
- **Import envelope:** a single tree imports as a bare project object (top-level `id`/`nodes`/`template`/`root_node_id`, no `projects` wrapper). The `{"projects":[…]}` wrapper is the multi-tree transfer format; if used, include exactly ONE project.
- **Verify programmatically before delivering:** `scripts/lint_tree.py` (all of the above plus the script standard), `scripts/walk.mjs` against the tree's fixture (every script body executes over the real graph; loops terminate; Data-node call counts match `expect`), and `scripts/tree_diff.py` against the baseline. Routers test only script-set booleans (or the blessed `(outcome=='Other')`).

## Proven consolidation examples (from the Script Library)

- **Delta post-accident/reasonable-suspicion**: a large DOT/NON-DOT/exemption decision tree (would have been dozens of logic nodes and buttons) collapsed into one determination script emitting a boxed HTML summary for a single content node. Later unified further (CR-001, Jul 2026): the accident branch's and the suspicion branch's separate determination-then-payload script pairs merged into ONE shared finalize engine consumed by both branches — surfacing the inbound-edge-audit and trigger-set-mirroring lessons above (levers 6–7).
- **Experian joint accounts**: webhook JSON → filter active joint accounts → stringified HTML checkbox multi-select (`option_N` + count), replacing per-account button screens.
- **ETG cancellation**: 17 hardcoded static arrays replaced by one transform reading `actions.edvin__errand_configuration` (CX Actions), then a bucket-routing script (`proceed` / `no_action` / `escalate` / `different_request`, normalized with `.trim().toLowerCase()`) building child/silent Zendesk tickets.
- **Quest consent**: per-company content stored as one `var dictionary = {...}` keyed by exact strings, `dictionary[ZT.getVariableValue("company", "")] || ""` → `setFormData` for a content node — instead of one branch per company.
- **Corpay ServiceNow**: field-registry loop pulling `ZT.getVariableValue(name, "")`, dropping blanks and unreplaced `#tokens#`, building capped `short_description` — one payload-builder script instead of a chain of logic nodes.
- **Penrose MH Master Triage**: five review trees (SMI, Adult MH, Depression, CYP, MH Risk; 107 nodes) → one tree (44 nodes). Shared outcome tail → one catalog script + one Outcome screen; unified entry script (init + route eval + all per-condition setup + first-screen HTML) → one router; merged first screen using native conditional fields per `condition`; thin `outcome_key` setters replaced by conditional/plain hidden fields; CYP condition cluster collapsed to one conditional-field content + one `if(cyp_route)` script. See "Node-reduction playbook" above and `Workflow JSONs/Penrose Health/`.

## Only create variables that are referenced elsewhere (Brent's rule, Jul 2026 — Vermasoft)

Never write a variable nothing reads. Valid consumers: a router expression, a merge field in a content node, a later script's `ZT.getVariableValue`, or a Connected Object that auto-receives it by name. If none applies, don't write it — dead outputs make the tree read as if it has more behaviour than it does. Reporting-only fields are the one exception and Brent will say so explicitly ("this field is for reporting"). Deleting a consumer means deleting its producers in the same edit. `scripts/lint_tree.py` flags writes with no read in the export; a Connected Object body consuming a variable is invisible to it — record those in `claude.md`.

## One screen, many values (Brent, Jul 2026 — Penrose)

Consecutive content nodes are a smell. One content node captures several values with native fields, then one script evaluates and one router routes. Two sequential yes/no questions → one screen with two selects. Info screen → question screen → merge the info into the question screen. Chains with zero branching → one screen, no router. Legitimate exceptions: a real branching decision; a single-button hand-off into a *shared* node; a deliberate one-at-a-time clinical sequence where short-circuiting saves clicks. Lint: any single-button Content → Content edge whose target has one inbound edge.

## Script-before-router — the house routing pattern (Brent's rule, Jul 2026 — Penrose)

Every routing decision is EVAL SCRIPT → ROUTER. The script reads the native field values, applies the business logic, and writes booleans (`is_risk`, `go_postcard`, `outcome_is_other`); it may also stage the downstream data. The router (Scoring, `advanced_logic_node="1"`, `continuation_node_id` set) tests only those booleans with explicit `flag == true` / `flag == false` buttons. Routers never compare raw form-field strings (those failed live) — the one org-proven exception is the verbatim `(outcome== 'Other')`. Anti-patterns this kills: evaluating in a logic node; chaining logic nodes; a setter script hanging off each branch (fold it into the eval script or one shared consumer).

## Native form fields — the full palette (Jul 2026 — Penrose, from Brent's sample node)

`select` (newline-separated options; `config:{"filterable":true}` for type-ahead), `select` **dynamic from a transforms array** (`config.list_source_type:"dynamic"` + `list_dynamic_source:{type:"transforms",variable:"<name>_options",attributes:{label,value}}` — the one case that requires a transform), `radio`, `checkbox`, `text`, `multiline`, `number`, `date`, `email`, `hidden` (constant via `hidden_value`). Conditional fields: `config` = stringified `{"conditional":{"simple":[{"variable":"<driver>","op":"eq","value":"<x>"}]}}`. `config` is always a JSON *string*. Prefer a Yes/No `select` over a checkbox when a script must read the answer — an unticked checkbox does not read back reliably through `getVariableValue`; evaluate checkboxes only with Scoring expressions (`(flag == 1)`).

**A required conditional field is safe** (Brent's correction, Aug 2026 — ETG VI): `required: 1` only enforces once the field renders; hidden-by-condition fields never block Continue. Do not "fix" a required conditional field by stripping `required`.

## Shared node rendering per-path values → `merge_vars_not_fixed = "1"` (learned live, Jul 2026 — Penrose)

Zingtree's default fixes a merge variable to the value it had the first time it rendered. Any shared content node that renders values staged per path (`${outcome_html}`, `${ticket_card_html}` inside a loop) needs the tree setting `merge_vars_not_fixed = "1"`, or every pass shows the first pass's text. Note it in `claude.md`.

## Back / Restart controls (Jul 2026 — Adyen)

Tree-wide `hide_back_button` / `show_restart_button` are the proven levers. Per-node `hide_back_restart="1"` does not work in the 2026 Vue theme. For one screen, use the `render:finish` + `#restart_button`/`#back_button` script in "Hiding Back/Restart on one screen" above. A Script root never renders, so first-screen settings belong on the first *rendered* node.

## Client-side JS is disabled org-wide — style with CSS only (Brent's rule, Jul 2026 — ETG)

An org-wide release disabled client-side JS in rendered content. Dynamic-HTML `<select>`s need `appearance: none` plus a wrapper `::after` arrow to look intentional; the open options list is OS chrome and cannot be restyled. Don't promise a JS widget.

## Requirements docs bound the build (Brent's rules, Jul–Aug 2026 — ETG)

- A CR's "not fixed here, deliberately / needs a live run" list is a boundary. Don't build past it; ask for the measurement instead.
- When a crash traces to a requirement that is explicitly *blocked* and the doc already names an agreed interim behaviour, apply the interim (through the normal confirmation gate) rather than stopping at diagnosis.
The doc's own status text is the discriminator: documented interim = build it; documented deferral = don't.

## Temporary breakpoint nodes inside a loop (Brent's technique, Aug 2026 — ETG)

To watch a loop run live, drop a throwaway Content node in the body printing the cursor (`<p>Ticket loop: ${queue_index}</p>`) and delete it before publishing. This is the one thing the offline walk cannot show. A Content node inside a loop is also the wait primitive (`escalate_after`) — see "ONE REQUEST, ONE NODE".
