---
name: zingtree-workflow-builder
description: Expert Zingtree workflow builder and optimizer. Use this skill whenever the user uploads or references a Zingtree workflow/tree JSON export, asks to build, review, improve, or debug a Zingtree workflow or decision tree, or mentions Zingtree concepts like script nodes, logic nodes, content nodes, CX Actions, Connected Objects, Dynamic Views, transforms, Dynamic HTML, or zt./ZT. functions (setTransformData, setFormData, getVariableValue). Also trigger when the user is working through a workflow idea for a customer account (Quest, Delta, Experian, ETG, Corpay, etc.) and needs agent-facing screens, API integrations, or a visualization of the flow — even if they don't say "Zingtree". Do not guess at Zingtree behavior from general knowledge; this skill has the authoritative rules.
---

# Zingtree Workflow Builder

Parse, improve, and visualize Zingtree workflow JSONs; write production-ready script-node code; design CX Actions integrations. The user is a Zingtree expert builder — outputs go straight into production trees, so precision on the rules below matters more than speed.

## Before anything else

1. Read `references/patterns.md` — the canonical data-setting rules, counter-loop pattern, ES5 constraints, and HTML style. Every script you write or review is checked against it.
2. If a workspace folder is connected, also read `Zingtree Builder/MEMORY.md` and check `Zingtree Builder/Script Library/` for reusable production scripts before writing anything from scratch.
3. Load the topical reference only when needed (see "References" below).

**After a session the user was happy with**, they may run the companion `analyze-workflow-session` skill to capture what was learned back into MEMORY.md / patterns.md / Script Library. That skill only runs on explicit request — don't invoke it mid-build. This builder skill *reads* the knowledge base; the analyzer *writes* to it.

## The three data-setting rules (memorize)

- HTML built as a stringified value → `ZT.setTransformData("name_html", html)`
- Simple scalars (strings, booleans, numbers) → `ZT.setFormData("name", value)`
- Objects, arrays, everything else → `ZT.setTransformData("name", value)`

Misplacing data breaks downstream nodes silently. When reviewing existing scripts, flag violations of these rules first.

## Five things that got a build thrown out (read before you add a node)

Every one of these was learned by shipping the mistake on ETG "Register Errands - Dynamic" (v36 → v38.1, Aug 2026). Brent hand-fixed the tree from 46 nodes to 37. Full case study: `references/patterns.md`.

1. **Never call the same API from two nodes to re-check something.** One Connected Object, one Data node. A three-node poll chain calling the same endpoint three times is the specific thing Brent called out as a terrible Zingtree pattern. At most you loop back to the one node — usually you don't even need that.
2. **To wait on an external system, use a Content node with `escalate_after` (seconds) — not a retry.** One node, one field, auto-advances, tells the agent what's happening. Zingtree has no poll primitive; do not build one.
3. **When Zingtree's engine rejects a shape, stop and bring it back to Brent.** *"The last action triggered an invalid loop"* is a design verdict. Unrolling the loop into copies of the same nodes to defeat the guard makes it worse.
4. **Don't build what the requirements doc deliberately deferred.** A CR's "not fixed here, deliberately / needs a live run" list is a boundary. Building it anyway spends nodes on a problem no one asked you to close.
5. **Machinery must earn its node count, and script comments are not a changelog.** Guard nodes, bookkeeping arrays and version-history comment blocks all got deleted. Price structure in nodes before adding it; put history in the `claude.md` node.

## Node titles must tell the story (always)

Every node title, of every type, must be descriptive and succinct — abbreviations only where genuinely needed — so that reading the titles down the tree tells the story of what the workflow does, as easy to follow as a children's book. Someone skimming the tree in Zingtree should understand exactly what it does from the titles alone, without opening a node. Title the action/decision/screen, not the mechanism (`Look up account in Salesforce`, `DOT-regulated?`, `No matching account found` — never `Script 3`, `Logic node`, `Untitled`). Apply this when building new trees, and when reviewing, flag and rename every generic or cryptic title (`Content N`, `Copy of …`, bare aliases) before delivering. Full rules and per-type examples: `references/patterns.md` → "Node titles — the tree must read like a story".

## Baseline stylesheet — every workflow (Brent's rule, Aug 2026)

Every tree gets Zingtree's 2026 baseline stylesheet in its style settings. It's the house default that makes any workflow look presentable without per-tree design work.

```
https://assets.zingtree.com/managed/templates/zingtree_2026.css
```

- In a tree JSON export this is the **top-level `css_include`** key — set it when building a new tree, and set it on an existing tree that has none (or that still points at `zingtree_2025.css`, the superseded version).
- **Don't overwrite an account's own managed stylesheet.** ETG runs `assets.zingtree.com/managed/etraveli/etg_style_subtle.css`; a `custom-css.php?...` URL with brand colors is also a deliberate account theme. Where one is already set, leave it and say so in the delivery note rather than swapping in the baseline.
- What it provides, so custom HTML can lean on it instead of re-inventing: Poppins (400/500), CSS vars `--color-primary: #502CFF`, `--color-body`, `--color-secondary/light/danger/success/info/warning/dark`, `--font-size: 18px`, `--border-radius: 28px`; classes `.btn`/`.btn-primary`/`.btn-secondary`/`.btn-danger`/`.btn-zingtree`, `.panel`/`.panel-heading`/`.panel-title`/`.panel-body`, `.list-group-item`, `.breadcrumb`, `.persistent-buttons`, `.zt-confirmation`, `.zt-content-block` (script/action/note/alert tones); responsive breakpoints at 767/640/400px. Prefer these over hand-rolled inline styling for buttons, panels, and content blocks.
- Style settings are per-tree, so on a multi-tree family set `css_include` on **every** tree in the family, not just the hub.

## Workflow when a Zingtree JSON is uploaded

Work through these steps in order — each builds on the last.

### 0. The claude.md node — read first, always maintain

Every workflow carries its own memory as an unlinked Content node titled `claude.md`. Before touching anything else, search the JSON for a node whose title (page_title/node_name) is `claude.md` (case-insensitive).

- **If it exists**: read its content FIRST — it is the authoritative context for this tree (purpose, node map, data dictionary, conventions, history). Trust it over re-derivation; verify against the JSON only where the tree has clearly drifted from it.
- **If it doesn't exist**: create it after the inventory (step 1) — a Content node, not linked from any other node (no inbound buttons/continuations, excluded from the flow), whose `content` holds markdown.

This exists so any author can vibe-code edits: they prompt Claude, Claude reads the node, understands the whole tree, makes the change, and updates the node. The user re-imports the JSON into Zingtree, so the node travels with the workflow itself. Full structure and maintenance rules: `references/patterns.md` → "The claude.md node".

**Every session that edits a workflow ends by updating the claude.md node**: reflect the change in the relevant sections and append a changelog entry (date · author/prompt gist · what changed · which nodes). Deliver the JSON with the node included.

### 1. Parse and inventory

Load the JSON programmatically (don't eyeball large files). Build an inventory: node count by type (content, logic, script, data-connected), button/branch fan-out per node, variables set and read, merge fields used, existing Connected Objects. Map the graph: which nodes point where, entry points, dead ends, unreachable nodes. Reconcile with the claude.md node if one existed.

### 2. Ask the CX Actions question — always

Before recommending anything, ask the user:

> "Does this account need CX Actions — i.e., does this account want an API request?"

If yes, follow up: which services are involved, what data comes back, what auth type. Then scan the tree for spots where an API request replaces static content or manual entry (lookups, record fetches, ticket/incident creation, status checks) and design the Data Source + Connected Objects (read `references/02-cx-actions-api-requests.md` and `references/05-external-sources-connected-objects-dynamic-views.md` first). If no, note it and move on — don't force it.

Use AskUserQuestion when available; otherwise ask in chat. Ask once per workflow/account, not repeatedly.

### 3. Analyze for consolidation

The core optimization theme — hunt for these:

- **Logic-node chains → one script node.** Several logic nodes evaluating related conditions (or buttons branching to different destinations by data that's already known) can usually become one script node that computes the route. The Delta determination script in the Script Library replaced what would have been dozens of logic nodes.
- **Multiple UI/UX screens → one script node + one content node.** Sequences of content nodes showing variations of the same information collapse into a script that builds the right HTML (`ZT.setTransformData("custom_html", html)`) rendered by a single content node (`${transforms.custom_html}`). Different screens become different strings, not different nodes.
- **Per-item branches → counter loop.** One branch per account/company/item becomes a dictionary or a rendered `option_0…option_(n-1)` input set with a `*_count` variable and a downstream loop (pattern in `references/patterns.md`).
- **Static data → CX Actions.** Hardcoded arrays/dictionaries that mirror an external system should read from `actions.<alias>` instead (like ETG's 17 static arrays → one Connected Object).
- **Many trees → one; collapse the shared tail into a catalog.** Merge trees that share an ending; replace the repeated tail with one shared tail fed by a catalog script (`OUTCOMES[key]` lookup) rendered by one content node.
- **Group script nodes — unified eval-route-setup.** Never `init → router → N per-branch setup scripts`; fold init + evaluation + all per-branch setup + next-screen HTML into ONE titled script, followed by exactly ONE router (scripts can't branch).
- **Thin setter scripts → conditional hidden fields.** A script that only sets one form value becomes a hidden form field (conditional or plain) on the preceding content node.
- **Combine adjacent eval→router→sibling-screens→scripts** into one conditional-field content node + one `if(driving_var)` script.

For each finding, state: what exists now, what replaces it, node-count delta, and what the agent experience gains. Don't consolidate for its own sake — if a logic node is clearer for tree maintainers than a script, say so. Full node-reduction levers + the import-safety checklist: `references/patterns.md` → "Node-reduction playbook" and "Import safety & verification".

### 4. Visualize — always

Every workflow build, review, or idea session produces a visual of the flow. This is non-negotiable — the user thinks in diagrams. Show current vs. proposed side by side (or two diagrams) when recommending changes: nodes as boxes labeled by type, branches labeled with button text/conditions, script nodes and CX Action calls visually distinct. Use the environment's visualization tool (widget/artifact) for the interactive view, and save a `.mermaid` or `.html` copy to `Zingtree Builder/Visualizations/` when the workspace is connected so it persists.

### 5. Deliver

- **Review report**: inventory summary, findings ordered by impact, each with node-count delta and effort.
- **Improved scripts**: production-ready ES5 (see `references/patterns.md` constraints), verbatim-usable, one file per script node with a header comment naming the node and its inputs/outputs.
- **Improved workflow JSON** when the user wants it applied, preserving IDs and structure the tree editor expects — change only what the recommendation requires. Ensure every node title is descriptive and succinct so the tree reads like a story (see "Node titles must tell the story"); rename generic/cryptic titles as part of delivery. Prefer NATIVE form fields for inputs (they inherit Zingtree styling and enforce `required`); use dynamic HTML only for display content or genuinely dynamic datasets — not for standard inputs.
- **Verify before delivering (non-negotiable for generated/edited JSON).** Run the import-safety + graph lint in `references/patterns.md` → "Import safety & verification": exactly one `is_root`; formfields use only proven schema keys (no `value`); `project_node_id`==`display_order`==key; `predefined_vars` keys contiguous from 0; all scalars are strings; every link resolves; button graph is a DAG; all nodes reachable; single terminal; no Connected Object on two nodes; top-level `css_include` carries the baseline stylesheet (or the account's own — see "Baseline stylesheet"). Syntax-check every script with `node --check` and a stubbed-`ZT` runtime smoke test. A tree that won't import is worse than no tree — **and note what the lint cannot see**: runtime loop-guard trips and anything that only fails against the live API. Say so rather than reporting a clean lint as a clean build.
- Save deliverables to `Zingtree Builder/Workflow JSONs/<account>/` when the workspace is connected.

## Writing new workflows from scratch

Same principles, reversed: start with the visualization (step 4) to agree on the flow, ask the CX Actions question (step 2) while requirements are on the table, then write scripts and node structure. Prefer the smallest tree that works: script nodes for computation and routing, content nodes only where an agent actually reads or inputs something.

## References

Read on demand — each is short:

- `references/patterns.md` — canonical rules, loops, HTML style, ES5 constraints, proven consolidation examples. **Read for every task.**
- `references/01-troubleshooting-debugging.md` — ZT.log rules, Execution Insights, `${...}` interpolation, `##ALL DATA##`, session IDs.
- `references/02-cx-actions-api-requests.md` — Data Sources, auth types, `_zt_meta`, `value`-wrapping, whitelist IPs, Connected Object verbs.
- `references/03-namespaces-data-access.md` — the four namespaces (form/default, transforms, actions, views), TTLs, the immutable `this`.
- `references/04-dynamic-html.md` — script node → `custom_html` → content node pattern, `zt-data` form inputs, stitching values back.
- `references/05-external-sources-connected-objects-dynamic-views.md` — setup steps, alias immutability, Dynamic View config, merge-field syntax table.
- `references/06-transformation-functions-script-node.md` — system function signatures, user functions via `ZT.` prefix, namespace access in scripts vs content nodes.

## Account-specific companion skills

- **ETG environment promotion** (`etg-env-promote`) — ETG's Zendesk custom fields have different ids per environment (sandbox vs. production). Any time an ETG tree is promoted (sandbox→production) or demoted (production→sandbox), invoke that skill first to remap field ids via its maintained `field-map.json` — don't hand-translate ids from memory.
