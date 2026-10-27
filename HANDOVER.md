# Handover — the Zingtree workflow builder, one repo, three of us

**For:** Debbie McCormick, Charchit Rajput
**From:** Brent Thomas
**Date:** 2026-10-27
**Repo:** `github.com/brentthomascodes/zingtree-workflow-builder`

## What this is

This repo is the builder. It is a Claude skill: the rules for how a Zingtree tree is designed,
scripted, tested and reviewed, plus the scripts that check a tree against those rules. Claude
reads it at the start of every build session and the output goes straight into production
trees, so the rules are a contract, not suggestions.

Until today the builder's knowledge lived in two GitHub repos and several copies on disk. As of
2026-10-27 there is one: this one. The older `zingtree-builder` repo is retired, its skill
content is folded in here, and its customer exports stay in Brent's local workspace where they
belong. Everything below assumes that single copy.

## What is in it

| Path | What it is |
| :---- | :---- |
| `SKILL.md` | When the skill triggers, the seven rules, the build/review/test workflow |
| `references/00` to `03` | The always-read set: ETL design, the script standard, where data lives, how to test |
| `references/04` to `11`, `patterns.md` | Topic references: CX Actions, Dynamic HTML, Connected Objects, transforms, troubleshooting, diffs, the two reference builds, environments, platform shapes |
| `scripts/` | `lint_tree.py` (import safety + house standard), `walk.mjs` (runs the real scripts on fixture data), `response_contract.py`, `preview_url.py`, `tree_diff.py` |
| `fixtures/example.fixture.json` | The fixture shape, invented data |
| `companions/analyze-workflow-session/` | The skill that writes learnings back here after a good session |
| `CONTRIBUTING.md` | How a change gets in, who approves what |
| `CHANGELOG.md` | What changed in the rules, and which build proved it |

What is **not** in it, on purpose: customer tree exports, fixtures with real ids, response
contracts, credentials, org ids. Each of us keeps those in our own workspace. The two gold
standard builds (Corpay UK Email AI, ETG Register Errands) are described in
`references/10-reference-builds.md` and live in Brent's workspace as exports.

## Getting set up

1. Get access to the repo from Brent (it should be private before anyone else is added, see
   "Decisions we still owe" below).
2. Clone it into your Claude Code or Cowork skills folder and link the companion:

```bash
git clone https://github.com/brentthomascodes/zingtree-workflow-builder.git .claude/skills/zingtree-workflow-builder
ln -s zingtree-workflow-builder/companions/analyze-workflow-session .claude/skills/analyze-workflow-session
```

3. Node 18+ and Python 3.9+, no dependencies.
4. Prove it works: export any tree you own and run the lint.

```bash
python3 .claude/skills/zingtree-workflow-builder/scripts/lint_tree.py "<tree.json>"
```

If it prints findings, the skill is installed. Read them; they are the review's first draft.

## How a build session goes

The skill triggers on its own when a tree JSON or a Zingtree concept comes up. The shape of a
session is in `SKILL.md`, and it is the same for all of us:

- **Baseline first.** Save the untouched export, read the tree's `claude.md` node (its own
  memory), run the lint.
- **Ask the CX Actions question once.** Does this account want an API request? If yes, get a
  real captured response before writing a line of script.
- **Design as an ETL spine**, draw it, and price the change in nodes.
- **Build to the standard.** State in form data once, screens as transforms, one request per
  node graded before it is read, never two of the same node type back to back.
- **Test offline, then live.** Fixture, walk, response contract, preview URL. One unmocked run
  per lane before "done".
- **Deliver the diff**, the new JSON with its `claude.md` node updated, the fixture, the preview
  URL. Importing into a live tree is always a human step.

Nothing gets built without a requirements doc. That rule holds for all three of us.

## How we keep it alive

The repo only stays the source of truth if the learning from each build lands here within the
week. `CONTRIBUTING.md` has the full process. The short version:

- **Pull before every build.** `git pull --ff-only` in the clone.
- **After a build you are happy with**, run `analyze-workflow-session`. It proposes the exact
  edits and, once approved, commits and pushes.
- **A rule needs a build that proved it.** The PR template asks which tree, which account,
  which date. No proof, no merge.
- **Brent approves every change to the rules.** Script library additions and account facts are
  not repo changes and need no approval; they go in your workspace.
- **One line in `CHANGELOG.md`** per rule change.

## Roles

| Who | Owns |
| :---- | :---- |
| Brent | Maintainer. Approves rule changes, rolls the changelog, keeps the repo private and clean |
| Debbie | Managed Services lead. Brings the builds her team ships as proof for new rules, and the cases where the rules got in the way |
| Charchit | Builder. Runs the skill on managed-services builds, files the first PRs, and tells us where the rules are unclear in practice |

Adjust these if the call agreed something different; the table is a starting point, not a
decision record.

## Decisions we still owe

These came out of the two-repo cleanup and the direction we set on the 2026-10-26 call. Brent to
confirm the call outcomes in this section; nothing here is recorded from the call itself.

1. **Repo visibility.** Both builder repos are public on GitHub today. This one carries no
   customer exports but it does name accounts and quote Zendesk field ids. Make it private, then
   add collaborators. The retired `zingtree-builder` repo carries full customer exports and
   should be deleted, not just hidden.
2. **Branch model.** Today Brent commits straight to `main`. With three contributors the
   proposal is: Brent still commits to `main`, everyone else goes through a PR with the
   template. Say if you want it stricter.
3. **Account-specific skills.** `etg-env-promote`, `etg-errand-regression` and the Corpay UK
   promote skills live outside this repo because they hold environment ids. Decide whether
   Managed Services needs them, and if so where they live.
4. **Review turnaround.** The proposal is two business days on a PR. Say if that is too slow
   for a managed-services queue.
5. **The longer game.** There is a draft architecture for exposing the builder to the wider
   internal team as an app (Brent's workspace, `Zingtree Builder/Platform/`). It depends on this
   repo being the one copy, which is done as of today. Worth a separate conversation once the
   three of us have shipped a few builds from the same rules.

## Where to ask

Slack, Brent directly. If a rule is wrong, say which tree showed it; that is the start of a PR.
