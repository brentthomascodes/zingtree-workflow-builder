---
name: zingtree-workflow-builder
description: Expert Zingtree workflow builder and optimizer. Use this skill whenever the user uploads or references a Zingtree workflow/tree JSON export, asks to build, review, improve, test, promote or debug a Zingtree workflow or decision tree, or mentions Zingtree concepts like script nodes, logic nodes, content nodes, CX Actions, Connected Objects, AI Actions, Dynamic Views, transforms, Dynamic HTML, Test Mode / mock data / preview URLs, or zt./ZT. functions (setTransformData, setFormData, getVariableValue, setResponseData). Also trigger when the user is working through a workflow idea for a customer account (Quest, Delta, Experian, ETG, Corpay, Penrose, etc.) and needs agent-facing screens, API integrations, or a visualization of the flow — even if they don't say "Zingtree". Do not guess at Zingtree behavior from general knowledge; this skill has the authoritative rules.
---

# Zingtree Workflow Builder

Build, review, test and visualize Zingtree workflows as ETL pipelines: extract (query params,
Connected Objects, AI Actions, native form fields) → transform (one script per step) → load
(API, email, rendered screen). Outputs go straight into production trees, so the rules below
are a contract, not guidance. This repo is the single source of truth — there is no other copy
of these rules to consult.

## Read before anything else

1. `references/00-etl-design.md` — how a tree is shaped. Node adjacency, the linear spine,
   one data structure, the loop and the loop detector, lanes, catalogue maps, reuse, what
   earns a node.
2. `references/01-scripting-standards.md` — the script-node contract with before/after from
   real slop. Every script you write or review is checked against its checklist.
3. `references/02-data-and-namespaces.md` — form data first for state, rendered HTML as
   transforms, the Connected Object owns its request body, `ZT.getVariableValue` always,
   naming.
4. `references/10-reference-builds.md` — the two gold-standard builds (Corpay UK Email AI,
   ETG Register Errands): what to copy from each, with node numbers, and what not to copy.
   When a build resembles either, open that tree's export and its `claude.md` too.

Then `references/patterns.md` for platform-shape rules (router shape, roots, import safety,
node shapes, the claude.md node, multi-tree), and the topical references on demand (index at
the end).

`builds/scripts/` holds reusable production scripts — check it before writing from scratch —
and `builds/workflows/<Account>/` holds exports, fixtures, contracts and diffs (both in this
repo since Nov 2026; pull first). There is no `Zingtree Builder/MEMORY.md` any
more; its rules live here.

## The seven rules that decide most reviews

1. **State in form data, once; screens in transforms.** Every value is written once, to form
   data (`JSON.stringify` objects), read with `ZT.getVariableValue("name", default)` — one
   call, one default, never a chain. Rendered HTML is `ZT.setTransformData("x_html", html)`
   collapsed to one line, shown as `${transforms.x_html}`. Other transforms only for a native
   dynamic-select source, a dot-path merge, or a value a Connected Object template merges
   pre-shaped. Never write the same fact under two names — grep every read before a second write.
2. **No constants block, no shared blocks, no logging, no secrets.** No `const LOG_*`/UUIDs/field
   ids in scripts; no helper pasted into two nodes; no `ZT.log` or execution log — the one
   sanctioned read-out is the API receipt; AI Actions explain their own decisions. No `Date`
   (the sandbox has none). No credential anywhere in a tree.
3. **Never two of the same node type back to back.** Script→Script is one script;
   Content→Content is one screen; Scoring→Scoring means a script should have computed one
   flag. Dynamic content is always Script → Content. Every loop pass renders a Content node
   (the loop detector counts ~30 automatic jumps).
4. **One request, one node; grade it, then read it.** A Connected Object sits on one Data node;
   the next script grades `_zt_meta.response.code` 2xx before reading anything, an AI Action is
   graded on its output field; one flag, one router. The Connected Object owns its request body
   (a per-value JSON template); record fields go through predefined `sf_*` / ticket variables.
   Wait for an external system with a Content node's `escalate_after`, never a poll/retry.
5. **Mocks copy real responses; they never add to them.** Every build ships with a fixture
   captured from real responses, a walk, a preview URL and — for anything with an agent entry
   screen — Test Mode. Nothing reads a field only a mock has (`totalSize` broke Corpay UK
   live while every mocked test passed). One live, unmocked run per lane before "done".
6. **Environments are remapped by tooling, never by hand.** Org-specific ids live in three
   places (seed read, write-back, `predefined_vars`); a manifest + remap script moves a tree;
   the diff must contain only the remapped categories; the live import is Brent's step.
7. **Comments describe the code now; titles tell the story.** No dates, versions or node ids
   in comments — history lives in the `claude.md` node's changelog. Every node has a
   descriptive `page_title` and `node_name`.

## Workflow when a tree JSON is in hand

### 0. Baseline and the claude.md node

Save the untouched export as the baseline (`… (BEFORE baseline YYYY-MM-DD).json`); never edit a
JSON in place. Find the unlinked Content node titled `claude.md` and read it first — it is the
tree's own memory (purpose, node map, data dictionary, external systems, gotchas, changelog).
Create it if missing; update it at the end of every edit session. Template and rules:
`patterns.md` → "The claude.md node".

### 1. Inventory — run the lint, don't eyeball

```bash
python3 scripts/lint_tree.py "<tree.json>" [--entry <Test Mode / Start node>]
```

It reports import-safety errors (root, router shape, AI Action config, CO `org_id`, credentials,
`Date`), graph findings (same-type adjacency, duplicate Connected Objects, converging router
buttons, unreachable nodes — persistent-button targets count as entries — id gaps, missing
titles) and script-standard findings per node (banned tokens, constants blocks, duplicate
blocks across nodes, history comments, HTML written to form data, transforms nobody reads,
writes never read). Read the output as the review's first draft. Then map the ETL: what arrives,
what is fetched, what single structure the tree walks, what the agent decides, what is loaded.

### 2. Ask the CX Actions question — once

> "Does this account need CX Actions — i.e., does this account want an API request?"

If yes: which systems, what comes back, what auth, and whether an AI Action decides or drafts
anything. Design the Data Source + Connected Objects (`04-cx-actions-api-requests.md`,
`06-connected-objects-dynamic-views.md`) and ask for a real captured response of each request
— it becomes the fixture and the response contract. Scan for static data or manual entry an
API could replace. If no, note it and move on. Use AskUserQuestion when available.

### 3. Design as an ETL, then price it in nodes

Redraw the tree as the spine in `00-etl-design.md`: seed → fetch → shape → select → transform →
loop(cursor → show → load → grade → more?) → summary. Consolidation levers, each with a node
delta: logic-node chains → one script; sibling screens → one script + one content node; per-item
branches → one structure + one loop; parallel trees that differ only in the middle → one tree
with lanes; N same-shape terminals → a catalog; static tables → a Connected Object; per-call
status routers → the consuming script; duplicate reset scripts → one reset node. Don't
consolidate for its own sake — say when a plain logic node is clearer.

### 4. Visualize — always

Every build, review or idea session produces a diagram of the flow (current vs proposed when
recommending changes): nodes as boxes labeled by type, branches labeled with the flag or
button, Data / AI nodes and loops visually distinct. Use the environment's visualization tool
for the interactive view and save a `.mermaid`/`.html` copy to `builds/visualizations/`. Brent thinks in diagrams. White / light theme only.

### 5. Build

- Scripts to the `01-scripting-standards.md` checklist; data placement per
  `02-data-and-namespaces.md`; node shapes and the router shape per `patterns.md`.
- Native form fields for every input (conditional fields for branching questionnaires; a native
  dynamic select for data-driven options, suggested option first); dynamic HTML for display
  and per-item inputs only.
- New nodes take the lowest unused id; `project_node_id` == key; every scalar a string;
  formfields use only proven keys; `predefined_vars` keys contiguous. A standalone import is the
  bare project object, never a `{"projects": [...]}` wrapper.
- Routers: `advanced_logic_node = "1"`, one explicit expression per button, the last button an
  empty-expression `op: "def"` else branch.
- Baseline stylesheet: top-level `css_include` =
  `https://assets.zingtree.com/managed/templates/zingtree_2026.css` on every tree in a family,
  unless the account has its own managed sheet (ETG: `managed/etraveli/etg_style_subtle.css`;
  Salesforce-embedded trees: `managed/templates/salesforce_2026.css`; any `custom-css.php?...`
  URL) — then leave it and say so.
- Anything touching auth, payments or PII: flag it and recommend teammate review.

### 6. Test — fixture, walk, contract, preview URL

Write or update `<tree-slug>.fixture.json` next to the export (`03-testing-and-mock-data.md`):
the raw inbound query params only, one captured response per Connected Object alias and per AI
Action alias, the agent's inputs per screen, and expectations. Then:

```bash
python3 scripts/lint_tree.py "<after.json>"
node scripts/walk.mjs "<after.json>" "<tree.fixture.json>" --verbose
python3 scripts/response_contract.py "<after.json>" "<account>.response-contract.json"
python3 scripts/preview_url.py "<tree.fixture.json>" [--node <Test Mode node>]
python3 scripts/tree_diff.py "<before.json>" "<after.json>" -o "<tree-slug>-diff-<date>.md"
```

Walk the happy fixture and the failure fixture (and the Test Mode path with `--start`). State
what these cannot see — required/conditional field behaviour, merge-field rendering, the
runtime loop detector, live API behaviour, fields the mocks might have invented — and hand
Brent the preview URL and the list of live-only checks, including one unmocked run per lane.

### 7. Deliver

- Plain change summary leading with the untouched count (`09-workflow-diff.md`); the saved
  diff report; the lint, walk and contract output.
- The JSON as a new descriptively named file with the `claude.md` node updated (sections +
  changelog entry), to `builds/workflows/<Account>/`.
- The fixture and the preview URL.
- Scripts as verbatim-usable node bodies; no separate "improved scripts" narrative — the
  diff is the narrative.
- A promote/demote is a separate deliverable from the account's remap tool
  (`11-environments-and-promotion.md`); importing into a live tree is always Brent's call.

## Writing a workflow from scratch

Same steps, starting at 3: agree the ETL spine and the one data structure in a diagram, ask
the CX Actions question while requirements are on the table, write the fixture and the response
contract from captured API samples *before* the scripts (they are the spec for every response
shape), then build the smallest tree that runs the fixture end to end. Start from the closest
reference build (`10-reference-builds.md`) rather than a blank canvas.

## Nothing gets built without a requirements doc

`builds/requirements/<Account>/<tree-slug>-requirements.md` — numbered requirements,
change requests appended, agreed text never edited. A CR's "deliberately not fixed / needs a
live run" list is a boundary; a documented interim for a blocked requirement is a build
instruction. When the engine rejects a shape live, stop and bring the error back.

## References

- `references/00-etl-design.md` — design principles, lanes, catalogue maps, agent-filled gaps, share tree, persistent buttons, re-entry. **Read for every task.**
- `references/01-scripting-standards.md` — the script contract, grading, never-in-a-tree, checklist. **Read for every task.**
- `references/02-data-and-namespaces.md` — namespaces, form-data-first, HTML as transforms, CO request bodies, marketplace-app record fields, naming, seed, reset. **Read for every task.**
- `references/03-testing-and-mock-data.md` — fixture format, walk harness, preview URL, Test Mode, the real-data contract, what live-only proves.
- `references/04-cx-actions-api-requests.md` — Data Sources, `_zt_meta`, `.value` wrapping, aliases, Salesforce responses, grading calls, AI Actions, the API receipt.
- `references/05-dynamic-html.md` — script → `*_html` transform → content node; `zt-data` per-item inputs; stitch-back.
- `references/06-connected-objects-dynamic-views.md` — setup steps, alias immutability, Dynamic View config, merge-field syntax.
- `references/07-transformation-functions.md` — `ZT.*` system function signatures, namespace access in scripts vs content.
- `references/08-troubleshooting.md` — Execution Insights, session ids, the loop detector, house diagnostics.
- `references/09-workflow-diff.md` — the before/after gate and the plain summary.
- `references/10-reference-builds.md` — the gold-standard builds and their verification status. **Read when a build resembles one.**
- `references/11-environments-and-promotion.md` — what differs per environment, the three-places rule, moving a tree, placeholders.
- `references/patterns.md` — platform-shape rules: router shape, roots, node shapes, claude.md node, inbound data, multi-tree, node titles, numbering, import safety, native field palette, proven consolidations.

## Scripts

- `scripts/lint_tree.py <tree.json> [--strict] [--entry N]` — import safety + house standard.
- `scripts/walk.mjs <tree.json> <fixture.json> [--start N] [--verbose]` — offline execution of the real tree on mock data (Data, AI Action and Email nodes; no `Date`, like the sandbox).
- `scripts/response_contract.py <tree.json> <contract.json>` — the real-data gate: every response read is a confirmed field.
- `scripts/preview_url.py <fixture.json> [--session id] [--set k=v] [--node N] [--show]` — `zv_`-prefixed preview / live URL (EU host by default).
- `scripts/tree_diff.py BEFORE.json AFTER.json -o report.md` — mechanical change report.
- `fixtures/example.fixture.json` — the fixture shape, with invented data.

## Companion skills

- `companions/analyze-workflow-session/` — after a session Brent was happy with, captures what
  changed in the rules back into this repo (and registers a new reference build in `10`). Runs
  only on explicit request. This builder reads the rules; the analyzer writes them.
- `etg-env-promote` (workspace, account-specific) — remaps ETG Zendesk field ids, option values,
  agent ids and Connected Object ids between dev and production. Invoke before any ETG
  promotion/demotion.
- `etg-errand-regression` (workspace, account-specific) — ETG's business-rule oracle on top of
  the walk pattern.
- `corpay-uk-env-promote` / `corpay-uk-int-to-prod` (account-specific) — Corpay UK sandbox ↔ UK
  org, and INT → PROD with the alias remap and the real-data gate.
