# Contributing — how this repo stays alive

This repo is the only copy of the rules the builder runs on. It is maintained, not finished:
every shipped build either confirms the rules or changes them, and the change lands here the
same week. Nothing lives in a second place.

**Maintainer:** Brent Thomas (owner, approves every rule change).
**Contributors:** anyone on the Zingtree team with access to this repo.

## The three principles

1. **A rule is proven by a build, not by an opinion.** Every change to `SKILL.md` or
   `references/` names the tree that proved it. If no shipped tree demonstrates it, it is a
   proposal, not a rule, and it waits.
2. **Each rule lives in exactly one file.** `README.md` maps the files. When a rule changes,
   rewrite it in place with a supersede note (`supersedes … (Mon YYYY)`); never add a second
   version somewhere else.
3. **No customer material.** No tree exports, no fixtures with real ids, no response contracts,
   no org ids, no credentials. Those stay in each person's own workspace. Rules and invented
   examples only.

## Before every build session

```bash
git -C .claude/skills/zingtree-workflow-builder pull --ff-only
```

Someone else's learning from last week may already be merged. A session that builds on stale
rules re-learns a lesson the repo already holds.

## How a change gets in

There are three paths. Pick the one that matches who you are and what changed.

### Path A — after a build Brent was happy with (the main path)

Run the companion skill `analyze-workflow-session` at the end of the session. It reconstructs
the final shipped version, diffs it against the references, proposes the exact edits grouped
by file, and (after approval) commits and pushes. It is the only skill that writes here.
Procedure: `companions/analyze-workflow-session/SKILL.md`.

### Path B — a teammate proposes a change (pull request)

1. Pull `main`, branch as `<yourname>/<topic>`.
2. Make the change in the one file that owns the rule (see the map in `README.md`).
3. Open a PR using the template below. Brent reviews within two business days.
4. On approval Brent merges to `main`. No merge without the template filled in.

PR template (paste into the description):

```
**What changed** — one sentence.
**Which build proved it** — account + tree name + date it shipped. Not the export.
**Rule or correction?** — new rule / supersedes an existing one (name it) / sharper example.
**Before / after** — the script or node shape, if it is a script rule.
**Lint** — if the rule is mechanical, the check added to scripts/lint_tree.py, or "not mechanical".
```

### Path C — a typo, a broken link, a clearer sentence

Brent commits straight to `main`. Anyone else: a PR with "docs:" in the subject, no template.

## What needs Brent's approval, and what does not

| Change | Who approves |
| :---- | :---- |
| Anything in `SKILL.md` or `references/` (a rule, an example, a supersede) | Brent, always |
| Anything in `scripts/` that changes what the lint or walk reports | Brent, with the script run on a real tree before and after |
| `companions/`, `README.md`, `CONTRIBUTING.md`, `HANDOVER.md` wording | Brent |
| A reusable production script | Not a repo change. It goes in your workspace `Zingtree Builder/Script Library/` |
| An account fact (field ids, aliases, contacts, environments) | Not a repo change. It goes in that account's `MEMORY.md` or its promote-skill map |

## Minimum check before any push

```bash
python3 -m py_compile scripts/*.py && node --check scripts/walk.mjs && echo OK
```

Then run `scripts/lint_tree.py` on at least one real tree export in your workspace and confirm
the output is what the changed rule says it should be. If a reference example was changed,
read it once in the voice of `references/01-scripting-standards.md`: no logging, no constants
block, no defensive wrappers, no dates in comments.

## Changelog

Every rule change adds one line to `CHANGELOG.md` under **Unreleased**: date, file, the rule
in a few words, the account that proved it. Brent rolls Unreleased into a dated entry whenever
a batch is pushed.

## Commit messages

Imperative subject, sentence case, no prefixes. Name the account or tree that proved the change
when it helps future search.

```
Add grading rule for AI Action output fields (Corpay UK Email AI)
Supersede the per-item branch pattern with one structure + one loop (ETG Register Errands)
```

## Never

- Commit a customer export, a fixture with real ids, a response contract, an org id, or a
  credential. If one slips into history, tell Brent the same day; a secret in history is
  compromised even after it is removed.
- Add a rule a shipped build has not demonstrated.
- Write the same rule in two files, or keep an old version next to the new one.
- Install or edit from any other copy of this skill. If you find one, delete it and clone
  this repo.
