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
      └ More? (Scoring)     is_more_* == true → cursor · else (op "def") → exit
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
means the first script should have computed one boolean. Exceptions: a Data node that
needs time between two calls to the same system (put a Content node with `escalate_after`
between them — that is a different type anyway); a script immediately before a loop plus
a script immediately after it (they bracket the loop; they are not adjacent in the walk); a
re-prompt screen that sends the agent back to the one input screen it guards (only needed for
a Dynamic View or `zt-data` selection — a native field uses `required` instead); and a QA-only
Test Mode seed script that joins the live graph at a script (Corpay UK).

**Dynamic content is always Script → Content.** The script builds the string, collapses it to
one line and writes it as a transform (`ZT.setTransformData("x_html", html)`); the content
node renders `${transforms.x_html}` and nothing else (`02-data-and-namespaces.md`). Never hand-write
per-case text into N content nodes when a script can build it from data. N terminal screens
that differ only in words are a catalog: one script with a `key → {title, body}` map, one
shared content node.

**Linear spine, minimal branching.** The best tree reads straight down. A menu of N answers is
one native field on one screen feeding one script — not N buttons to N nodes. Real branching
is reserved for genuinely divergent downstream *processes* (a subtree call; a booking path vs
a no-availability path). Every router is a Scoring node testing one script-set flag or route
value: `advanced_logic_node = "1"`, one explicit expression per button, and an empty-expression
`op: "def"` button as the else branch (`patterns.md` → "The router shape"). Never chain
routers; never hang a setter script off each branch.

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
ZT.setTransformData("ticket_card_html", `<h3>${current_ticket.title}</h3><p>${current_ticket.pnr}</p>`);
```

Nested work (a parent with children) is one flattened queue built by the Transform script
— `[{parent}, {child of parent}, {child of parent}, {next parent} …]` with each entry carrying
its `parent_ref` — walked by one cursor. Not two loops with two cursors and a gate router.

Writing results back onto the structure: the grade script after the Data node reads
`current_ticket`, sets `current_ticket.zendesk_id = actions.zendesk__create_child_ticket.ticket.id`,
writes it back into `work_queue[queue_index - 1]`, and stores the queue again. The structure
is the record; there are no side arrays.

A loop that creates parents and their children walks **depth-first** — the parent, then each
of its children, then the next parent — and that order is the contract: a child reads its
parent's id from a map keyed by queue position, which only exists because the parent was
created and resolved first (ETG's unified ticket loop: child, silent and grand-child tickets
through one body). Display counters per kind ("Grand Child Ticket 1 of 2") come from the same
walk, not from a second counter.

**Zingtree's loop detector** halts a session after about **30 consecutive automatic node jumps**
— Script, Scoring and Data nodes with no rendered screen between them — counting revisits, not
real iterations (ETG tripped it after three PNRs, Aug 2026; a higher ceiling and a proper
loop-start/loop-end concept were requested as ZT-9107 — design so the number doesn't matter).
An array-cursor loop that never
renders will trip it on a long enough array. Put a Content node in every loop pass — the card
the agent confirms, or an `escalate_after` status line (`Updating ticket...`, 3 s) that doubles
as the settle time before a fetch. A wait/poll loop that revisits nodes without advancing data
is the shape it exists to kill. No offline check sees it; `walk.mjs` only catches a pass that
advances nothing.

## Lanes — one tree, a router, a shared tail (Brent, Sep 2026 — Corpay UK)

When two journeys share their front end and their ending and differ only in the middle
(different AI Action prompts, a different intent map), build **one tree**: shared front end →
one routing script (the only place the routing map lives) → one Scoring node → a lane per
journey → the lanes converge on one shared tail. Corpay UK merged a router tree and two child
trees this way (86 nodes → 48): the router's Tree nodes became one Scoring node pointing
straight at each lane's first node, the child tree's duplicated front end and its case
re-fetch disappeared, and one escalation script, one Test Mode and one seed served both. Lanes
share variable names (`email_intent`, `escalate_reason`) because only one lane runs per
session — one writer per session is not duplicate storage. A lane keeps its own script only
where it reads a different alias; do not merge those into one script with a dynamic alias
lookup.

Use subtrees (below) when the middle is a genuinely separate process called from several
places, or when a subset needs its own tree lifecycle.

## Catalog maps are the scope gate

A use-case catalogue — intent → Salesforce Topic / Sub Topic, contact reason → Edvin category,
queue → journey — is declared **once**, as a plain object or array of rows, in the one script
that owns it (or in the seed script as form data when more than one node reads it). Every
screen and every option list reads the catalogue. That makes it the scope gate: a value with no
row is out of scope and routes to the out-of-scope screen instead of throwing, so a use case cut
from a release (or one the AI still returns after its prompt changes) fails safely, and adding a
use case is one row plus its Test Mode scenario — nothing else in the tree changes. Corpay UK's
Homecharge Phase 1 went from seven intents to three and back to five this way without touching
routing.

## Agent-filled gaps come before the draft (Brent, Sep 2026 — Corpay UK)

When an approved reply has a value only the agent can supply (a unit rate, authorised contact
names), ask for it **before** generation: one screen, one native conditional field per gap, each
shown by its own driver; the script after generation writes each answer over its token. A
safety-net boolean forces the manual-edit screen when a token is still in the draft (the model
reworded it, or a template gained a gap no row maps), and the send-path router tests it first. A
new gap is one row (field, driver, token) plus one field. Ask no question before a draft except
the ones the reply genuinely needs — every extra gate is a click agents answer the same way
every time.

## Read-only share tree (Brent, Sep 2026 — ETG)

Zingtree has no session lock or read-only mode, and a Zendesk-bound session is shared by
everyone who opens the ticket, so a second person in it duplicates API calls. To let a manager
(or anyone) see a session without entering it: a snapshot script in the working tree builds
every value the viewer needs and a link to a **separate tree with no Data nodes** — a Script
root that renders one page from `zv_` params, one Content node, `claude.md` — opened on a new
session id. Its safety is structural: nothing in it can write anywhere. Keep the link under
~8,000 characters (truncate free text per item). Adding a field is one param in the snapshot
plus one line in the viewer.

## Persistent buttons and resume (Brent, Sep 2026 — ETG)

Global actions that must be available on every screen (Restart, Share, Transfer) are
`persistent_buttons` on the tree (`show_subtree_persistent_buttons = "1"` to carry them into
subtrees), each pointing at one node. Hide them where a click would interrupt a write chain
(`hide_persistent_buttons = "1"` on an auto-advancing status screen or a splash).

A hand-off to another agent ends the sender's session on a screen that is also the receiver's
entry: the Zendesk app reopens a ticket's session at its last node, so that screen's one button
("Pick up this ticket") goes to a resume script and one router on a `workflow_stage` marker
written as the run progresses (`intake → tickets → errands → complete`). Resume targets are the
"about to fire" screens of each stage, never the middle of a write chain. State that lives in
transforms may have expired by pick-up (1-hour TTL) — give that its own branch, or keep the
state in form data. Button `button_data` tags like `::zt_transferred` make these sessions
countable in Zendesk triggers and views.

## Re-entry through Back

With `keep_vars_on_back = "1"`, Back + Continue re-runs every script after the screen the agent
backed into — including the grouping script and the write loops after it. A tree accepts that a
replay shows up as a visible duplicate rather than suppressing it with key lists inside the loop
(`patterns.md` → "Machinery must earn its node count"); if duplicates become a real problem, the
fix is upstream — hide Back where it would replay writes.

## Multi-tree (hub-and-spoke)

When distinct data subsets each need different business logic, the hub fetches once and builds
the structure; single-purpose subtrees handle one subset each and return
(`open_tree_id` + `return_tree_node_id`). Each subtree's root is a guard router on
`len(...) >= 1` (a Scoring root is fine) so empty buckets cost nothing. Reusable subroutine trees take their input via
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
