# Changelog

Rule changes, newest first. One line per rule: date, file, the rule in a few words, the build
that proved it. Brent rolls **Unreleased** into a dated entry on each push. See
`CONTRIBUTING.md` for how an entry gets here.

## Unreleased

_(empty)_

## 2026-11-05 — builds move into the repo

Brent's `Zingtree Builder/` workspace (Workflow JSONs, Script Library, Requirements,
Visualizations, Platform) now lives under `builds/` (`workflows/`, `scripts/`, `requirements/`,
`visualizations/`, `platform/`). This reverses the Oct 27 "customer exports stay local" rule:
CONTRIBUTING principle 3 now bans only credentials. Every `Zingtree Builder/...` path in
`SKILL.md`, `references/` and the companion skill points at `builds/`. One Zingtree session API
key (Ivy Rehab Incoming Call launch URL) is `REDACTED_ZINGTREE_APIKEY` in all eight copies.
Left out: a raw Zendesk session dump (`ETG/data.rtf`), a 9 MB upload test file, a `.pyc`.

## 2026-10-27 — two repos merged into one

The July `zingtree-builder` repo (a public snapshot of Brent's `Zingtree Builder/` workspace
folder: skill copy, customer exports, Script Library, Visualizations) is retired. Its skill
content was diffed against this repo and every rule the September rewrite had dropped without
a supersede note was restored, attributed `restored Oct 2026 from the retired zingtree-builder
repo`. Customer exports stay local in the workspace and were never meant to be here.

Restored rules:

- `05-dynamic-html.md` — the per-item input contract: indexed names + staged array + count,
  checkboxes submit only when ticked (exact-value compare), fixed option last with a literal
  value, radios share one name, action buttons only navigate (Experian, ETG Rebooking).
- `00-etl-design.md` — question flows route on buttons, never on a script engine (looped
  endlessly live, twice); the `notice_html` pattern instead of silent re-prompt loops (Penrose).
- `patterns.md` → Import safety — the button graph is a DAG and every path terminates; a
  cloned prototype carries its `project_node_id` and fails the import silently (Penrose v4).
- `patterns.md` → Router shape — score-calculator Scoring nodes keep `advanced_logic_node="0"`;
  the "always 1" rule and the lint apply to `logic_expression` routers only.
- `patterns.md` → Logic placement — router expressions may address transforms directly; seen
  in older trees, not a defect.
- `patterns.md` → Native form fields — a static `select` submits the option text; the full
  proven dynamic-select field shape (`label_type`, `required`, config string, optional
  `score`); the same field name on mutually exclusive conditional hidden fields works.
- `patterns.md` → Back / Restart — the default values and the first-screen note (Adyen).
- `02-data-and-namespaces.md` — checkbox Scoring resolves unticked `0` / ticked `1`; copy source
  checkbox routers verbatim when consolidating (Penrose); the Connected Object Log Activity
  toggle governs persistence.
- `08-troubleshooting.md` — the `JSON.parse` nil error text and the one-off `let is undefined`
  sighting (Quest), as diagnostics, not as licence for `try` or `var`.
- `10-reference-builds.md` — pointers to the three older masters (ETG Cancellation, Returns
  Multi-Tree, ETG Rebooking) and the Experian native-select script set.

Repo additions: `CONTRIBUTING.md` (the change process, PR template, approval table),
`HANDOVER.md` (Brent's side of the merge with Charchit Rajput's builder, agreed on the 2026-10-26 call), this file. `README.md` updated.

### Needs Brent's call — contradictions the merge surfaced, left unresolved

The diff also found places where the old rules and the current ones disagree with no supersede
note, or where the current references disagree with each other. None were changed; each needs
a live check or a decision, then a one-line edit in the owning file.

1. **User transformation functions.** `07-transformation-functions.md` says org user functions
   are "not available to us"; `patterns.md` → Multi-tree still cites `ZT.isOlderThan30Days(...)`
   and the July rule was "check the org's function library before reimplementing". Which is
   true for the orgs we build in?
2. **Nested loops.** `00-etl-design.md` says one flattened queue, never two cursors and a gate
   router; `patterns.md` → ETG Rebooking still recommends nested re-runnable cursor loops.
   Mark one as superseded.
3. **Value-map router.** Old: buttons whose `button_text` equals each value of a scalar. New:
   one explicit expression per button. The new shape is the rule; add a supersede note so an
   older tree built the old way is read as old, not wrong.
4. **Dynamic HTML styling and escaping.** Old master pattern: a `<style>` block with `:root`
   variables and `escapeHtml()` on all data. New `05`: no `<style>` blocks, escape only external
   free text. The new rule replaces the old; it needs the supersede note.
5. **Copy-to-clipboard.** `patterns.md` keeps the `onclick="copy_to_clipboard();"` button and
   the same file says `onclick` inside rendered content does nothing after the Vue release. One
   live check decides it.
6. **`JSON.parse` guard.** The old set kept a `try` around parsing external payloads as a proven
   live fix; the new standard bans `try`. The Manager Review tree parses JSON-string `zv_`
   params at the read. If a seeded default is always enough, say so in `01` §2; if not, name
   the one exception.

## 2026-09-29

- `10-reference-builds.md` — Corpay UK Email AI and ETG Register Errands adopted as the two
  gold-standard builds; rules in `00`–`09` rewritten against them.

## 2026-09-04

- `02-data-and-namespaces.md` — no-duplicate-storage house rule: one write, one name, grep
  every read before mirroring.
- Repo rewritten as the single source of truth: ETL design (`00`), the script standard (`01`),
  form-data-first namespaces (`02`), fixture / walk / preview testing (`03`), `lint_tree.py`.
  `Zingtree Builder/MEMORY.md`, `Skill Source/` and `Docs/` retired from the workspace.

## 2026-08-25

- Extracted from the chief-of-staff workspace into its own repo.
