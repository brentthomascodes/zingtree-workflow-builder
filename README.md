# zingtree-workflow-builder

The single source of truth for how Zingtree workflows are designed, scripted, tested and
reviewed — a Claude skill plus the scripts it runs. Trees are built as ETL pipelines
(extract → transform → load), scripts follow one written standard, and every build ships with
a fixture, an offline walk and a preview URL.

Zingtree's semantics are exacting and don't match what a model infers from general
knowledge. This repo carries the real rules so builds go straight into production trees
without a correction pass.

## Contents

| Path | What it is |
| :---- | :---- |
| `SKILL.md` | Triggers, the six rules, the build/review/test workflow, delivery standard |
| `references/00-etl-design.md` | Design principles: the ETL spine, node adjacency, the loop, reuse, what earns a node |
| `references/01-scripting-standards.md` | The script-node contract, with before/after from real slop, and the checklist |
| `references/02-data-and-namespaces.md` | Platform namespaces; house rule: form data first, transforms for two cases only; naming; seed and reset |
| `references/03-testing-and-mock-data.md` | Fixture format, offline walk, preview URL (`zv_` params), in-tree mock node |
| `references/04-cx-actions-api-requests.md` | CX Actions, `_zt_meta`, alias naming, grading calls, one-object payloads |
| `references/05-dynamic-html.md` | Script → `*_html` → content node; per-item `zt-data` inputs |
| `references/06-connected-objects-dynamic-views.md` | Data Sources, Connected Objects, Dynamic Views setup |
| `references/07-transformation-functions.md` | `ZT.*` function signatures and namespace access |
| `references/08-troubleshooting.md` | Execution Insights, session ids, the invalid-loop guard |
| `references/09-workflow-diff.md` | The before/after gate and the plain change summary |
| `references/patterns.md` | Platform-shape rules: routers, roots, claude.md node, multi-tree, titles, import safety |
| `scripts/lint_tree.py` | Import-safety + house-standard lint for a tree export |
| `scripts/walk.mjs` | Runs the real script bodies over the real graph on fixture data |
| `scripts/preview_url.py` | Builds the preview URL from a fixture |
| `scripts/tree_diff.py` | Mechanical before/after change report |
| `fixtures/example.fixture.json` | The fixture shape, invented data |
| `companions/analyze-workflow-session/` | Companion skill that writes learnings back into this repo |

## Install

Clone into a Claude Code / Cowork skills directory:

```bash
git clone https://github.com/brentthomascodes/zingtree-workflow-builder.git .claude/skills/zingtree-workflow-builder
ln -s zingtree-workflow-builder/companions/analyze-workflow-session .claude/skills/analyze-workflow-session
```

The builder activates on Zingtree work automatically. The symlink makes the companion skill
discoverable while keeping one clone.

## Using the scripts

```bash
python3 scripts/lint_tree.py "<tree.json>"                       # before anything else
node scripts/walk.mjs "<tree.json>" "<tree.fixture.json>" --verbose
python3 scripts/preview_url.py "<tree.fixture.json>"
python3 scripts/tree_diff.py "<before.json>" "<after.json>" -o report.md
```

Node 18+ and Python 3.9+. No dependencies.

## Scope

This repo holds the skill, its references and its scripts. It carries no customer tree
exports, fixtures with real ids, credentials, or account payloads — those live in their own
private workspaces and must never be committed here.
