# Workflow design — every tree is an ETL pipeline

Read this before drawing a single node. It is the design half of the standard; the script
half is `01-scripting-standards.md`, the data half is `02-data-and-namespaces.md`.

## The shape

Every Zingtree workflow is Extract → Transform → Load, and usually several of them in a row:

| Stage | Node type | What it does | Example |
|---|---|---|---|
| **Extract** | Query params, Data node, Content node (native form fields) | Get data into the session | Ticket id from the launch URL; `edvin__find_order`; the agent picks PNRs |
| **Transform** | Script node | Map it to the shape the next step needs; enrich it (add/derive fields); validate it | Group PNRs by type + action; attach passengers; compute `is_more_pnrs` |
| **Load** | Data node, Email node, Content node | Send it somewhere or show it | `zendesk__create_child_ticket`; render the ticket card; the internal note |

A whole workflow reads top to bottom as a chain of these:

```
Seed (Script)          read query params once, write canonical names, reset state
  ↓
Fetch (Data)           edvin__find_order
  ↓
Grade + shape (Script) check _zt_meta; build the selection list / options
  ↓
Select (Content)       agent picks PNRs (native dynamic select / Dynamic View)
  ↓
Transform (Script)     group, enrich, validate; build the work queue; stage the first card
  ↓
Loop  ┌ Cursor (Script)     next item → current_*; is_more_*
      │ Show (Content)      one shared card screen; agent confirms
      │ Load (Data)         zendesk__create_child_ticket
      │ Grade (Script)      one boolean from _zt_meta; record the id on the item
      └ More? (Scoring)     is_more_* == true → cursor · == false → exit
  ↓
Summary (Script → Content)   what happened, rendered once
```

Design questions, in order, for any new build or redesign:

1. **What arrives?** Everything the launching system already knows comes in as query params.
   Any agent-entered value that the launcher could supply is a node you don't build.
2. **What has to be fetched, and once?** One Connected Object, one Data node. Fetch early,
   fetch once, keep the response.
3. **What ONE data structure does the rest of the tree walk?** Build it in one Transform
   script — an array of objects, each object carrying everything downstream needs (ids,
   labels, the payload fields, its computed route). Readable nesting beats flat arrays that
   are cheaper to loop. Everything after this node is a loop over that structure.
4. **What does the agent actually decide?** Only those screens exist. Everything else is
   computed.
5. **What gets loaded, per item?** The loop body: cursor → (show) → Data → grade → more?
6. **What does the agent see at the end?** One summary screen rendered from the same
   structure.

## Rules the shape implies

**Never two of the same node type back to back.** Script → Script means one script;
Content → Content means one screen with more fields (or a catalog screen); Scoring → Scoring
means the first script should have computed one boolean. Two exceptions: a Data node that
needs time between two calls to the same system (put a Content node with `escalate_after`
between them — that is a different type anyway), and a script immediately before a loop plus
a script immediately after it (they bracket the loop; they are not adjacent in the walk).

**Dynamic content is always Script → Content.** The script builds the string and writes it
to form data (`*_html`); the content node renders `${*_html}` and nothing else. Never hand-write
per-case text into N content nodes when a script can build it from data. N terminal screens
that differ only in words are a catalog: one script with a `key → {title, body}` map, one
shared content node.

**Linear spine, minimal branching.** The best tree reads straight down. A menu of N answers is
one native field on one screen feeding one script — not N buttons to N nodes. Real branching
is reserved for genuinely divergent downstream *processes* (a subtree call; a booking path vs
a no-availability path). Every router is a Scoring node testing one script-set boolean with
explicit `== true` / `== false` buttons and `continuation_node_id` as the structural
fallback. Never chain routers; never hang a setter script off each branch.

**Native inputs, dynamic display.** Standard inputs (select, radio, text, date, number,
checkbox) are native form fields — they inherit the theme, enforce `required`, and become
first-class variables. A select whose options come from data is a native *dynamic* select fed
by a transform (`02-data-and-namespaces.md`). Dynamic HTML (`zt-data` inputs) is only for
per-item datasets that need an input per row. Conditional fields (`config.conditional`) put a
branching questionnaire on one screen.

**Content nodes reuse within a loop.** A loop has one card screen; every pass re-enters it
with a new `*_html`. Don't cross-wire unrelated paths into one content node to save a node —
a shared screen that serves two different stories is harder to read than two screens. Set
`merge_vars_not_fixed = "1"` on any tree where a shared node renders values staged per pass.

**Machinery earns its nodes.** Guard nodes, bookkeeping arrays, idempotency checks inside
loops, per-call status routers, retry chains, execution logs: each costs nodes and variables,
and each one shipped on ETG was deleted by hand. The safeguards are: API error handling
(`04-cx-actions-api-requests.md`), `required` on native fields, and the walk harness before
delivery. When the engine rejects a shape (*"The last action triggered an invalid loop"*) that
is a design verdict — bring it back, don't unroll it.

**One reset node.** State lives in form data and survives the session, so every re-entry path
(Restart, "another request", a re-run loop) goes through one Script node that sets every state
variable back to its empty shape. One, reached from everywhere — not a copy per entry point.

## The loop, in form data

```javascript
// --- inputs -----------------------------------------------------------------
let work_queue = JSON.parse(ZT.getVariableValue("work_queue", "[]"));
let queue_index = Number(ZT.getVariableValue("queue_index", 0));

// --- next item --------------------------------------------------------------
let current_ticket = work_queue[queue_index];
queue_index += 1;
let is_more_tickets = queue_index < work_queue.length;
if (!is_more_tickets) queue_index = 0;                 // re-runnable

// --- outputs ----------------------------------------------------------------
ZT.setFormData("current_ticket", JSON.stringify(current_ticket));
ZT.setFormData("queue_index", queue_index);
ZT.setFormData("is_more_tickets", is_more_tickets);
ZT.setFormData("ticket_card_html", `<h3>${current_ticket.title}</h3><p>${current_ticket.pnr}</p>`);
```

Nested work (a parent with children) is one flattened queue built by the Transform script
— `[{parent}, {child of parent}, {child of parent}, {next parent} …]` with each entry carrying
its `parent_ref` — walked by one cursor. Not two loops with two cursors and a gate router.

Writing results back onto the structure: the grade script after the Data node reads
`current_ticket`, sets `current_ticket.zendesk_id = actions.zendesk__create_child_ticket.ticket.id`,
writes it back into `work_queue[queue_index - 1]`, and stores the queue again. The structure
is the record; there are no side arrays.

## Multi-tree (hub-and-spoke)

When distinct data subsets each need different business logic, the hub fetches once and builds
the structure; single-purpose subtrees handle one subset each and return
(`open_tree_id` + `return_tree_node_id`). Each subtree's root is a guard router on
`len(...) >= 1` so empty buckets cost nothing. Reusable subroutine trees take their input via
an agreed variable and are called from many places. Cross-tree flags are declared as
`predefined_vars` on the hub. Full shapes: `patterns.md` → "Multi-tree orchestration".

## Titles tell the story

Every node has a `page_title` (short, agent/editor-facing) and a `node_name` (what it does and
why). Reading the titles down the canvas must explain the workflow without opening a node:
`Next ticket` → `Show ticket details` → `Create Zendesk ticket` → `More tickets?`. Title the
action or decision, not the mechanism. Rules and per-type examples: `patterns.md` → "Node
titles".

## Redesign means rebuild

A redesign tears down the old topology, states the use case as an ETL, and rebuilds. Porting
an N-node question chain to `intake → script → router → the same N static outcome nodes` is
step one only; the outcome nodes are part of the redesign. If the canvas looks like a spider
web, the design is wrong even when it works.
