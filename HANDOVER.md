# Handover — Brent's builder, ready to merge with Charchit's

**For:** Charchit Rajput (co-builder) · cc Debbie McCormick (facilitator)
**From:** Brent Thomas
**Date:** 2026-10-29
**Repo:** `github.com/brentthomascodes/zingtree-workflow-builder`
**Source:** the 2026-10-26 builder sync (Brent, Charchit, Debbie; Dana suggested it)

## Why this exists

Zingtree has had three internal flow builders: Brent's, Charchit's, and an older one of GT's.
On the 2026-10-26 call we agreed to merge Brent's and Charchit's into **one approved Zingtree
internal flow builder**. GT's is older and is not part of the merge. Debbie facilitates; Brent
and Charchit do the build.

This doc is Brent's side of the deal from that call: his repo, cleaned up into one place, with
what it does well, what it's missing, and the open questions the merge has to answer.

## The plan we agreed

1. **Each of us cleans up our own repo.** Brent's was in two places and is now one (this repo,
   2026-10-27). Charchit pushes his to GitHub and sends Brent the link.
2. **Each of us builds our own combined version.** Brent combines his + Charchit's; Charchit
   combines his + Brent's. Two independent merges, on purpose, so neither one's defaults win by
   accident.
3. **AI merges the two combined versions** into one final builder.
4. **We evaluate the final version together.** Debbie is booking a Thursday and a Friday call:
   the first to confirm we're each looking at the right repos, the second to review the
   combined versions.

## What Brent's builder brings

| Strength | Where |
| :---- | :---- |
| A written design standard: every tree is an ETL pipeline (seed, fetch, shape, loop, load) | `references/00-etl-design.md` |
| A script-node standard with before/after examples from real trees | `references/01-scripting-standards.md` |
| Where every value lives (form data, transforms, actions, views), naming, reset | `references/02-data-and-namespaces.md` |
| Platform shapes learned from live import failures: router shape, roots, import safety, the native field palette incl. dynamic selects and conditional fields | `references/patterns.md` |
| CX Actions, Connected Objects, AI Actions, Dynamic HTML, transforms, troubleshooting, environment promotion | `references/04` to `08`, `11` |
| Two gold-standard production builds to copy from (Corpay UK Email AI, ETG Register Errands) | `references/10-reference-builds.md` |
| Offline tooling: a lint, a walk that runs the tree's real scripts on fixture data, a response-contract check, preview URLs, a tree diff | `scripts/` |
| A companion skill that writes learnings back after a good build | `companions/analyze-workflow-session/` |

It runs as a Claude Code skill. No API key, no UI: the scripts are plain Node 18+ and
Python 3.9+.

## What Charchit's builder brings (from the call)

- **A sandbox simulator.** After a build, the flow runs in a browser. `zt.log` output appears in
  a console panel and every transform variable appears in a variables panel. You can troubleshoot
  before deploying to Zingtree instead of digging through Execution Insights. Brent's builder has
  nothing like this; `walk.mjs` is the closest thing, and it's command-line only.
- **A knowledge-source angle.** Charchit's original scope was troubleshooting, debugging and
  documentation: an all-round Zingtree expert, not only a builder.
- **A UI-first build style** (see the first open question).
- Runs with an Anthropic API key.

## Open questions the merge has to answer

1. **One dynamic screen or several plain ones.** Brent builds one content node rendered by a
   script, because Zingtree builds and maintains these trees, not the customer. Charchit keeps
   separate content nodes when there are only a few, because it's simpler and keeps the UI/UX
   clear. We agreed neither is the right answer in general. Brent's suggestion on the call was
   that the merged builder should know both and pick by customer: a non-technical customer gets
   separate content nodes; a technical customer gets script-built screens. Today this repo's
   rules mandate Brent's style (`00-etl-design.md` → "Dynamic content is always Script →
   Content"), so this is the first rule the merge would rewrite.
2. **Logging.** This repo bans `ZT.log` in delivered trees. Charchit's simulator is built around
   `zt.log`. The likely answer is that logging is fine in the sandbox and stripped before
   delivery, but we should decide it explicitly.
3. **Where the final builder lives.** It could be one of our two repos, a new repo, or something
   inside Zingtree itself. Debbie mentioned that "auto flows" may land in the product. It also
   affects who approves rule changes; today that's Brent alone (`CONTRIBUTING.md`).
4. **Delivery shape.** This repo is a Claude Code skill with no key. Charchit's is an app with a
   key. The final version could be either or both.

## Known gaps in Brent's builder

- **Logic-node comparison operators.** Charchit's builder initially didn't know logic nodes have
  operators beyond equals / not equals. This repo documents `eq`, `>=` in expressions, and the
  `op: "def"` else branch, but not the full operator list. A real export using each one would
  close it.
- **No interactive preview.** Testing is lint + offline walk + preview URL. A visual sandbox is
  Charchit's strength.
- **Six unresolved contradictions** between the old and current rules, listed in
  `CHANGELOG.md` → "Needs Brent's call".

## Getting it

```bash
git clone https://github.com/brentthomascodes/zingtree-workflow-builder.git
python3 zingtree-workflow-builder/scripts/lint_tree.py "<any tree export>.json"
```

If the lint prints findings, it works. To use it as a skill, clone it into a Claude Code
`.claude/skills/` folder. The README covers the companion-skill symlink.

What's deliberately **not** in the repo: customer tree exports, fixtures with real ids,
response contracts, credentials. The merged builder should keep that rule.
