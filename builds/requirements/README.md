# Requirements

One document per workflow. Not per call, not per request.

```
Requirements/{Account}/{tree-slug}-requirements.md
```

The slug matches the account's folder in `../Workflow JSONs/{Account}/` so the spec and the build sit together.

## The rule that makes this work
A workflow's requirements doc is a permanent ledger of everything ever agreed for that tree, in the order it was agreed.

- **New workflow** → new doc, requirements numbered R1, R2, R3…
- **Change to an existing workflow** → a numbered change request (CR-001, CR-002…) appended to §12 of that tree's existing doc. Never a new file.
- Agreed requirement text is **never edited**. Superseding a requirement means marking it `~~superseded by CR-00n~~` in §4 and restating it inside the CR.

That history is the reason the doc exists. Six months from now the question is never "what does this tree do" (the `claude.md` node answers that) — it's "who asked for this, when, and what did we agree it would do."

## Status flow
`Draft` → `Ready for build` (no blocking questions) → `In build` → `Built, pending Brent's approval` → `Approved`

## Who touches what
| Role | Does |
| :---- | :---- |
| Mira (`cos-requirements`) | Writes and amends these docs |
| Workflow Factory (`cos-workflow-factory`) | Translates requirements → numbered edits |
| Wes (`zingtree-workflow-builder`) | Builds the JSON against the edits |
| Verification (`cos-build-verification`) | Tests every requirement and every path, reports coverage |
| Brent | Approves, then does the real testing |

Templates live in `.claude/skills/cos-requirements/templates/`.
