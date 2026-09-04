---
name: zingtree-workflow-builder
description: Expert Zingtree workflow builder and optimizer. Use this skill whenever the user uploads or references a Zingtree workflow/tree JSON export, asks to build, review, improve, test, or debug a Zingtree workflow or decision tree, or mentions Zingtree concepts like script nodes, logic nodes, content nodes, CX Actions, Connected Objects, Dynamic Views, transforms, Dynamic HTML, mock data / preview URLs, or zt./ZT. functions (setTransformData, setFormData, getVariableValue, setResponseData). Also trigger when the user is working through a workflow idea for a customer account (Quest, Delta, Experian, ETG, Corpay, Penrose, etc.) and needs agent-facing screens, API integrations, or a visualization of the flow — even if they don't say "Zingtree". Do not guess at Zingtree behavior from general knowledge; this skill has the authoritative rules.
---

# Zingtree Workflow Builder

Build, review, test and visualize Zingtree workflows as ETL pipelines: extract (query params,
Connected Objects, native form fields) → transform (one script per step) → load (API, email,
rendered screen). Outputs go straight into production trees, so the rules below are a
contract, not guidance. This repo is the single source of truth — there is no other copy of
these rules to consult.

## Read before anything else

1. `references/00-etl-design.md` — how a tree is shaped. Node adjacency, the linear spine,
   one data structure, the loop, reuse, what earns a node.
2. `references/01-scripting-standards.md` — the script-node contract with before/after from
   real slop. Every script you write or review is checked against its checklist.
3. `references/02-data-and-namespaces.md` — form data first (objects as JSON strings), the
   two remaining uses of transforms, `ZT.getVariableValue` always, naming.

Then `references/patterns.md` for platform-shape rules (routers, roots, import safety, the
claude.md node, multi-tree), and the topical references on demand (index at the end).

If a workspace is connected: `Zingtree Builder/Script Library/` holds reusable production
scripts — check it before writing from scratch — and `Zingtree Builder/Workflow JSONs/<Account>/`
holds exports, fixtures and diffs. There is no `Zingtree Builder/MEMORY.md` any more; its rules
live here.

## The six rules that decide most reviews

1. **Form data, once.** Every value is written once, to form data (`JSON.stringify` objects),
   read with `ZT.getVariableValue("name", default)` — one call, one default, never a chain.
   Transforms only for a native dynamic-select source or a merge field that must dot-path.
2. **No constants block, no shared blocks, no logging.** No `const LOG_*`/UUIDs/field ids in
   scripts; no helper pasted into two nodes; no `ZT.log`, execution log, arm/flush. If two
   nodes need the same code, the design is wrong.
3. **Never two of the same node type back to back.** Script→Script is one script;
   Content→Content is one screen; Scoring→Scoring means a script should have computed one
   boolean. Dynamic content is always Script → Content (`${x_html}`).
4. **One request, one node; the next script grades it.** A Connected Object sits on exactly one
   Data node. The following script sets one boolean from `_zt_meta.response.code`; one router;
   one failure screen per tree. Wait for an external system with a Content node's
   `escalate_after`, never a poll/retry.
5. **Every build ships with a fixture, a walk, and a preview URL.** `scripts/walk.mjs` runs the
   real script bodies over the real graph on mock responses; `scripts/preview_url.py` builds
   the `zv_`-prefixed launch URL; a mock Script node serves the fixture via
   `ZT.setResponseData` when `zv_mock=1`. No fixture, no delivery.
6. **Comments describe the code now; titles tell the story.** No dates, versions or node ids
   in comments — history lives in the `claude.md` node. Every node has a descriptive
   `page_title` and `node_name`.

## Workflow when a tree JSON is in hand

### 0. Baseline and the claude.md node

Save the untouched export as the baseline (`… (BEFORE baseline YYYY-MM-DD).json`); never edit a
JSON in place. Find the unlinked Content node titled `claude.md` and read it first — it is the
tree's own memory (purpose, node map, data dictionary, external systems, gotchas, changelog).
Create it if missing; update it at the end of every edit session. Template and rules:
`patterns.md` → "The claude.md node".

### 1. Inventory — run the lint, don't eyeball

```bash
python3 scripts/lint_tree.py "<tree.json>"
```

It reports import-safety errors, graph findings (same-type adjacency, duplicate Connected
Objects, blank or converging router buttons, unreachable nodes, id gaps, missing titles) and
script-standard findings per node (banned tokens, constants blocks, duplicate blocks across
nodes, history comments, writes never read, transforms use). Read the output as the review's
first draft. Then map the ETL: what arrives, what is fetched, what single structure the tree
walks, what the agent decides, what is loaded.

### 2. Ask the CX Actions question — once

> "Does this account need CX Actions — i.e., does this account want an API request?"

If yes: which systems, what comes back, what auth. Design the Data Source + Connected Objects
(`04-cx-actions-api-requests.md`, `06-connected-objects-dynamic-views.md`); scan for static
data or manual entry an API could replace. If no, note it and move on. Use AskUserQuestion when
available.

### 3. Design as an ETL, then price it in nodes

Redraw the tree as the spine in `00-etl-design.md`: seed → fetch → shape → select → transform →
loop(cursor → show → load → grade → more?) → summary. Consolidation levers, each with a node
delta: logic-node chains → one script; sibling screens → one script + one content node; per-item
branches → one structure + one loop; N same-shape terminals → a catalog; static tables → a
Connected Object; per-call status routers → the consuming script; duplicate reset scripts →
one reset node. Don't consolidate for its own sake — say when a plain logic node is clearer.

### 4. Visualize — always

Every build, review or idea session produces a diagram of the flow (current vs proposed when
recommending changes): nodes as boxes labeled by type, branches labeled with the boolean or
button, Data nodes and loops visually distinct. Use the environment's visualization tool for
the interactive view and save a `.mermaid`/`.html` copy to `Zingtree Builder/Visualizations/`
when the workspace is connected. Brent thinks in diagrams.

### 5. Build

- Scripts to the `01-scripting-standards.md` checklist; data placement per
  `02-data-and-namespaces.md`; node shapes per `patterns.md`.
- Native form fields for inputs (conditional fields for branching questionnaires; a native
  dynamic select for data-driven options); dynamic HTML for display and per-item inputs only.
- New nodes take the lowest unused id; `project_node_id` == `display_order` == key; every scalar
  a string; formfields use only proven keys; `predefined_vars` keys contiguous.
- Baseline stylesheet: top-level `css_include` =
  `https://assets.zingtree.com/managed/templates/zingtree_2026.css` on every tree in a family,
  unless the account has its own managed sheet (ETG: `managed/etraveli/etg_style_subtle.css`;
  any `custom-css.php?...` URL) — then leave it and say so. It provides Poppins,
  `--color-primary #502CFF`, `--border-radius 28px`, `.btn*`, `.panel*`, `.zt-content-block`.
- Anything touching auth, payments or PII: flag it and recommend teammate review.

### 6. Test — fixture, walk, preview URL

Write or update `<tree-slug>.fixture.json` next to the export (`03-testing-and-mock-data.md`):
query params, one captured response per Connected Object alias, the agent's inputs per
screen, and expectations. Then:

```bash
python3 scripts/lint_tree.py "<after.json>"
node scripts/walk.mjs "<after.json>" "<tree.fixture.json>" --verbose
python3 scripts/preview_url.py "<tree.fixture.json>"
python3 scripts/tree_diff.py "<before.json>" "<after.json>" -o "<tree-slug>-diff-<date>.md"
```

Walk the happy fixture and the failure fixture. The mock node in the tree serves the same
fixture data in the editor preview. State what these cannot see — required/conditional field
behaviour, merge-field rendering, the runtime invalid-loop guard, live API behaviour — and
hand Brent the preview URL and the list of live-only checks.

### 7. Deliver

- Plain change summary leading with the untouched count (`09-workflow-diff.md`); the saved
  diff report; the lint and walk output.
- The JSON as a new descriptively named file with the `claude.md` node updated (sections +
  changelog entry), to `Zingtree Builder/Workflow JSONs/<Account>/`.
- The fixture and the preview URL.
- Scripts as verbatim-usable node bodies; no separate "improved scripts" narrative — the
  diff is the narrative.

## Writing a workflow from scratch

Same steps, starting at 3: agree the ETL spine and the one data structure in a diagram, ask
the CX Actions question while requirements are on the table, write the fixture from captured
API samples *before* the scripts (the fixture is the spec for every response shape), then
build the smallest tree that runs the fixture end to end.

## Nothing gets built without a requirements doc

`Zingtree Builder/Requirements/<Account>/<tree-slug>-requirements.md` — numbered requirements,
change requests appended, agreed text never edited. A CR's "deliberately not fixed / needs a
live run" list is a boundary; a documented interim for a blocked requirement is a build
instruction. When the engine rejects a shape live, stop and bring the error back.

## References

- `references/00-etl-design.md` — design principles. **Read for every task.**
- `references/01-scripting-standards.md` — the script contract, before/after, checklist. **Read for every task.**
- `references/02-data-and-namespaces.md` — namespaces (platform), form-data-first (house), naming, seed script, reset. **Read for every task.**
- `references/03-testing-and-mock-data.md` — fixture format, walk harness, preview URL, mock node, what live-only proves.
- `references/04-cx-actions-api-requests.md` — Data Sources, `_zt_meta`, `.value` wrapping, alias naming, grading calls, one-object payloads, one request one node.
- `references/05-dynamic-html.md` — script → `*_html` → content node; `zt-data` per-item inputs; stitch-back.
- `references/06-connected-objects-dynamic-views.md` — setup steps, alias immutability, Dynamic View config, merge-field syntax.
- `references/07-transformation-functions.md` — `ZT.*` system function signatures, namespace access in scripts vs content.
- `references/08-troubleshooting.md` — Execution Insights, `##ALL DATA##`, session ids, the invalid-loop guard; house position on logging.
- `references/09-workflow-diff.md` — the before/after gate and the plain summary.
- `references/patterns.md` — platform-shape rules: routers, roots, claude.md node, inbound data, multi-tree, node titles, numbering, import safety, native field palette, proven consolidations.

## Scripts

- `scripts/lint_tree.py <tree.json> [--strict]` — import safety + house standard.
- `scripts/walk.mjs <tree.json> <fixture.json> [--start N] [--verbose]` — offline execution of the real tree on mock data.
- `scripts/preview_url.py <fixture.json> [--session id] [--set k=v]` — `zv_`-prefixed preview URL.
- `scripts/tree_diff.py BEFORE.json AFTER.json -o report.md` — mechanical change report.
- `fixtures/example.fixture.json` — the fixture shape, with invented data.

## Companion skills

- `companions/analyze-workflow-session/` — after a session Brent was happy with, captures what
  changed in the rules back into this repo. Runs only on explicit request. This builder reads
  the rules; the analyzer writes them.
- `etg-env-promote` (workspace, account-specific) — remaps ETG Zendesk field ids and Connected
  Object ids between sandbox and production. Invoke before any ETG promotion/demotion.
- `etg-errand-regression` (workspace, account-specific) — ETG's business-rule oracle on top of
  the walk pattern.
