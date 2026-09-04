# Input → output diff (the change report)

Brent's standing rule: **he never accepts an edited tree without seeing what changed.** The
point isn't audit theatre — it's proving the workflow he already trusts is still the same
workflow, and that the edit touched only what it was supposed to touch.

Zingtree trees are large JSONs where a stray key or a rerouted button is invisible to the eye.
So the diff is **mechanical, never narrated from memory**. Run the script. Read its output.
Then explain it in plain words.

---

## The two artifacts, every time

1. **A plain-text summary in chat** — what changed, in the fewest words that are still true.
   Node numbers and titles, one line each. No JSON, no jargon.
2. **A saved change report** next to the delivered JSON:
   `Zingtree Builder/Workflow JSONs/<account>/<tree-slug>-diff-<YYYY-MM-DD>.md`
   Full report including line-level script diffs. This is the record.

---

## The baseline rule

A diff needs a *before*. Capture it **before making any edit**:

- The uploaded/exported JSON is the baseline. Save it unmodified as
  `<tree-name> (BEFORE baseline YYYY-MM-DD).json` in the account folder.
- **Never edit a JSON in place.** Write the output to a new, descriptively named file
  (`… (v13 short_description per-form 2026-07-30).json`) so both sides survive.
- Building from scratch → no baseline exists. Say so explicitly and skip the diff; a new
  tree has nothing to drift from.
- Chaining edits in one session → diff each version against the version before it, and give
  Brent a cumulative diff (original baseline → final) at the end. Both matter: the
  step diffs explain the reasoning, the cumulative one is what he's actually approving.

---

## Running it

```bash
python3 scripts/tree_diff.py BEFORE.json AFTER.json \
  -o "Zingtree Builder/Workflow JSONs/<Account>/<tree-slug>-diff-2026-08-04.md"
```

Options: `--no-bodies` (node-level only, for a quick check), `--context N` (script diff
context lines, default 3), `--max-diff-lines N` (truncate long script diffs; `0` = unlimited).

Exit code `0` = trees identical, `1` = differences found, `2` = couldn't read the input.
Exit `1` is the normal case, not a failure.

What the report contains:

| Section | What it proves |
| :---- | :---- |
| PLAIN SUMMARY | Nodes untouched vs. added / removed / renumbered / modified, each with title and reason |
| TREE SHAPE | Node counts by type, before → after → delta; root node changed or not |
| STRUCTURAL SANITY | Broken links or newly-unreachable nodes **introduced by this edit** (pre-existing ones listed separately so the edit isn't blamed for them) |
| UNTOUCHED NODES | The bulk — the evidence the tree survived intact |
| TREE-LEVEL SETTINGS | Project settings that moved (`persistent_buttons`, `css_include`, verification flags…) |
| COSMETIC CHANGES | Canvas x/y, sizes, `display_order`, `updated` — counted, then ignored |
| LINE-LEVEL BODY DIFFS | Unified diff per changed script/content body |
| CHANGES THAT NEED AN EXPLANATION | Flat checklist — one line per change, to be annotated |

Node identity: matched on node key first, then on exact `(type, page_title, node_name)` for
leftovers, so a renumber reads as **MOVED**, not as a delete plus an add. If a whole-tree
renumber makes the report read as "everything changed," that itself is the finding — say so
plainly rather than burying it.

---

## The gate (hard — do not deliver without clearing it)

1. Run the script. Diff produced, report saved.
2. Walk **CHANGES THAT NEED AN EXPLANATION** line by line. Every line must trace to a
   requirement, a CR, or something Brent asked for in this session.
3. Anything that traces to nothing is **unintended drift**. Revert it and re-diff. Do not
   deliver it with an apology attached — revert first.
4. If a change is drift but must stay (a dependency of the real fix), keep it and label it
   `COLLATERAL — required by <change>, not requested` in the summary. Never silent.
5. `STRUCTURAL SANITY` reporting broken links or new orphans → **not deliverable**. Fix, re-diff.
6. Any change touching **auth, payments, or PII handling** → surface it at the top of the
   summary and recommend teammate review before it goes anywhere near a live tree.

The diff runs before the import-safety lint, not instead of it (`patterns.md` →
"Import safety & verification"). Diff answers *did I change only what I meant to*; the lint
answers *will this import at all*. Both must pass.

---

## Writing the plain summary

Plain means plain. Node numbers, titles, and what it does differently now.

**Good:**

```
34 of 36 nodes are untouched. Two script nodes changed, nothing added or removed.

- Node 27 (Stitch & Group PNR Action Selections): do-not-proceed PNRs now produce ONE
  silent ticket instead of one per type+action combo. Matches tests 5, 6a, 6b, 8.
- Node 44 (Loop Errands to Register): attaches orderReference to each PNR before the
  Edvin call, fixing the "OrderReference should not be null/empty" rejection.

Routing, screens, form fields, and tree settings are all unchanged.
```

**Bad:** "Updated the ticket grouping logic and added some data handling improvements."
(Which nodes? What is different at runtime? Did anything else move?)

Rules for the summary:

- Lead with the untouched count. That's the reassurance he's looking for.
- One bullet per changed node: number, title, what it now does differently — behaviour, not code.
- State the negative explicitly when it's true: "no nodes added or removed", "routing
  unchanged", "no tree settings touched". Silence reads as *I didn't check*.
- Never say "minor" or "cleanup". Name it or revert it.
- Keep it short enough to read on a phone. The saved report holds the detail.

---

## When there is no clean before/after

- **Only the after exists** (tree was edited live in Zingtree, no export kept): say so, don't
  fabricate a diff. Ask for a fresh export to use as a baseline going forward.
- **Different tree ids** on the two sides: still diff — the report just reads as a
  wholesale replacement. Flag it: comparing across trees is a rebuild, not an edit.
- **Multi-tree envelope** (`{"projects":[…]}`): the script pairs trees by id, then by name,
  and reports added/removed trees. Cross-tree renumbering breaks hub references
  (`open_tree_node_id` / `return_tree_node_id`) — diff every tree in the family, not just the
  one edited.
