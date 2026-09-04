---
name: analyze-workflow-session
description: Reflect on a Zingtree workflow-building session and capture what was learned back into the zingtree-workflow-builder repo (references, patterns, scripts). Use ONLY when the user explicitly asks to analyze/learn from a session, or invokes this skill by name ("analyze workflow builder session", "capture learnings from that session", "what did we learn building X"). Running it MEANS the last workflow version produced in the analyzed session was viable, correct, and shipped — treat it as the gold standard to learn FROM, never to critique. This is a maintenance skill — it WRITES to the knowledge base. Do NOT use it to build, review, or debug a workflow (that's zingtree-workflow-builder).
---

# Analyze Workflow Builder Session

The builder skill reads the rules; this skill writes them. It runs only when Brent asks, after
a session whose final workflow he used and liked. The output is knowledge in the repo — never
an edited tree.

## The premise

The last workflow version delivered in the analyzed session is gold. Every rule, script shape
and decision embodied in it is validated. If it contradicts something in the references, the
workflow wins — capture the change as a supersede, don't "fix" the workflow.

## Where the knowledge lives (one place)

This skill lives inside the `zingtree-workflow-builder` repo (`companions/analyze-workflow-session/`),
cloned at `.claude/skills/zingtree-workflow-builder/`. Everything it writes goes into that clone:

| Learning | File |
|---|---|
| Design-shape rule (adjacency, loops, reuse, what earns a node) | `references/00-etl-design.md` |
| Script-level rule or a new before/after example | `references/01-scripting-standards.md` |
| Where a value lives, naming, seed/reset | `references/02-data-and-namespaces.md` |
| Fixture / walk / preview / mock learning | `references/03-testing-and-mock-data.md` (+ `scripts/` if the harness needs a change) |
| Platform behaviour, router/root/import rule, proven consolidation | `references/patterns.md` |
| Connected Object / API behaviour | `references/04-cx-actions-api-requests.md` |
| Reusable production script | the workspace `Zingtree Builder/Script Library/` (not the repo — the repo carries no customer payloads) |
| Account fact (systems, aliases, contacts, env ids) | the account's `Account Management HQ/<Account>/MEMORY.md` or `etg-env-promote` maps |

There is no `Zingtree Builder/MEMORY.md` and no `Skill Source/` — both are retired. Never write
to either.

## Step 1 — Get the session

Cowork has no session-transcript tool. Work from, in order of preference: the current
conversation (when Brent asks at the end of the session); a transcript or notes file he points
to; or the before/after JSONs plus the diff report in `Workflow JSONs/<Account>/`. If none of
those pins down what the final version was, ask — don't guess.

## Step 2 — Reconstruct the gold standard

Identify the LAST delivered version: its JSON, fixture, walk output, diff report. Note the
final tree shape, the final script shapes (not intermediate drafts), every explicit correction
Brent made mid-session ("no, do it this way", "that's wrong") — those are the highest-value
learnings — and any account facts.

## Step 3 — Diff against the references

Read the three always-read references and `patterns.md`. Classify each candidate learning:

- **New rule** — not written anywhere. Add it.
- **Correction / supersede** — contradicts an existing rule; the workflow is right. Rewrite
  the rule in place with a one-line supersede note (`supersedes … (Mon YYYY)`).
- **Reinforcement** — already captured. Skip, unless the session gives a sharper
  before/after example than the one on file — then swap the example, don't add a second.
- **Harness gap** — the walk/lint/fixture missed something the live run caught. Fix the script
  and record the limitation in `03-testing-and-mock-data.md`.
- **Account fact** — belongs with the account, not the repo.

Discard anything with no reuse value. Durable rules and examples, not a session diary.

## Step 4 — Propose before writing

Show the exact edits, grouped by file, in the house voice: descriptive heading, attributed
`(Brent's rule, <Mon YYYY> — <Account>)`, before/after code where it's a script rule, a lint
bullet where the rule implies a check `scripts/lint_tree.py` should make. Let Brent cut or
reword. Then apply.

## Step 5 — Apply and publish

Edit the files in the clone. If a rule implies a mechanical check, add it to
`scripts/lint_tree.py` and run the lint on the session's final JSON to confirm it fires (or
stays quiet) the way the rule says. Then:

```bash
cd ".claude/skills/zingtree-workflow-builder" && git add -A && git commit -m "<what changed>" && git push
```

Brent's standing instruction is commit and push to `main`. Say what was pushed.

## Never

- Edit, re-open or "improve" the analyzed workflow.
- Invent a rule the session didn't demonstrate.
- Duplicate an existing rule; keep each rule in one file.
- Write without showing the proposal first.
- Add logging, defensive wrappers, or config constants to any example — the standard in
  `01-scripting-standards.md` applies to the examples in the references too.
