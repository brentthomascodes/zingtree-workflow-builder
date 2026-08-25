# zingtree-workflow-builder

The authoritative Claude skill for building, reviewing, and debugging Zingtree
workflows — tree JSONs, script nodes, logic nodes, CX Actions, Connected Objects,
Dynamic Views, transforms, and Dynamic HTML.

Zingtree's semantics are exacting and don't match what a model infers from general
knowledge. This skill carries the real rules so builds go straight into production
trees without a correction pass.

## Contents

| File | What it covers |
| :---- | :---- |
| `SKILL.md` | Trigger conditions, the build/review workflow, delivery and verification standards |
| `references/01-troubleshooting-debugging.md` | Failure modes and how to diagnose them |
| `references/02-cx-actions-api-requests.md` | CX Actions and outbound API request patterns |
| `references/03-namespaces-data-access.md` | `zt.` / `ZT.` namespaces and variable access |
| `references/04-dynamic-html.md` | Dynamic HTML rules and when not to use it |
| `references/05-external-sources-connected-objects-dynamic-views.md` | External data sources, Connected Objects, Dynamic Views |
| `references/06-transformation-functions-script-node.md` | Transformation functions and script-node runtime |
| `references/patterns.md` | Node titling, node-reduction playbook, import safety and lint checklist |

## Install

Clone into a Claude Code skills directory — user-level:

```bash
git clone https://github.com/brentthomascodes/zingtree-workflow-builder.git ~/.claude/skills/zingtree-workflow-builder
```

Or project-level, from the repo root you want it available in:

```bash
git clone https://github.com/brentthomascodes/zingtree-workflow-builder.git .claude/skills/zingtree-workflow-builder
```

The skill activates on Zingtree work automatically; no invocation needed.

## Scope

This repo holds the skill only. It carries no customer tree exports, no credentials,
and no account payloads — those live in their own private workspaces and must never
be committed here.
