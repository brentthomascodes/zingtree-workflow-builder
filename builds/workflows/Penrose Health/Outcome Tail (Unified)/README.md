# Penrose Outcome Tail (Unified) — v2

One importable tree that all six disparate triage trees (Women's Health, Paediatric Cough/Cold/Fever, Pharmacy First, Rash, NHS Health Check, Contraception) route to via Tree nodes as their shared outcome tail. **Any outcome edit in any tree is made here, in one script.**

## v2 — flattened to 6 nodes (Brent's restructure, Jul 16)

v1's router + six catalog scripts (nodes 2–8) merged into ONE script; the screen-variant router, both P1-referral screens, and the unknown-key screen (9/11/12/20) replaced by ONE dynamic content node; the 10→13→16→17 snake (outcome select → Other check → Other details → netting) collapsed — `other_outcome` now sits on the same screen and Safety Netting is the single terminal. Every node has a title.

```
1 (Script, root)  Resolve outcome and build screen     -> 2
     THE script: OUTCOMES catalog (147 entries), NETTING map, legacy
     CODE_TO_KEY map, resolver, screen-HTML builder, alt_* staging
2 (Content)       Outcome                              Submit -> 3
     ${transforms.outcome_screen_html} + copy area     Already trialled P1 -> 4
     fields: outcome (canonical select, required)      P1 not possible -> 5
             other_outcome (optional multiline)
3 (Content)       Safety Netting                       ${transforms.source_netting_html}, end
4 (Tree)          Open Pharmacy First tree             824824140
5 (Script)        Swap to alternate outcome            -> 2 (safe no-op notice if none)
6 (Content)       claude.md                            unlinked in-tree memory
```

Replaces 201 duplicated Outcome screens (+ 6 Other-logic + 6 Other + 6 Safety Netting nodes) across the six source trees. Node 2's screen covers every case as HTML variations built by node 1: standard advice, P1-referral advice + escape guidance, unknown-key notice.

## Files

- `Penrose Outcome Tail (Unified).json` — the import file (single workflow dict, ~700 KB — the unified script carries the verbatim clinical copy)
- `build_outcome_tail.py` — regenerates from a fresh six-tree export (edit `SRC`, rerun)
- `verify_outcome_tail.js` — `node verify_outcome_tail.js`: executes the real scripts for all 147 keys, 9 variant + swap paths, double-click no-op, legacy fallback per tree, unknown-key/empty-session notices, structural lint
- `key_registry.md` — every `outcome_key` per tree (also in the claude.md node)

## Integrating a source tree

1. At each terminal path, fold `ZT.setFormData("outcome_key", "<key from key_registry.md>")` into the path's existing eval script (or a 3-line setter), then route to a single shared Tree node pointing at this tree (set `open_tree_id` after import assigns the ID; no return — this tail ends the session).
2. Delete the tree's Outcome screens, Other-outcome logic/screen, and Safety Netting node.
3. Legacy bridge (zero-script first step): retarget each outcome node's Continue to the Tree node — the tail falls back to the already-set `suggested_outcome` hidden-field code + a `source_tree` variable set once at tree entry.

## Design notes / caveats

- The two escape buttons are static, so they render on every outcome. The screen HTML tells agents when they apply, hover text reinforces it, and pressing the swap on a non-P1 outcome shows a "no alternate defined" notice and changes nothing.
- `other_outcome` is optional-not-conditional in the generated JSON (no org-proven conditional config existed in the exports). Flip it to a conditional field in the editor (show when `outcome` = Other) if desired.
- The 5→2 edge is the one intentional revisit (escape rebuilds the screen); everything else is forward-only.
- The unified script is ~650 KB. If the editor balks at a script node this large, the fallback is v1's shape (six per-tree catalog scripts) — regenerate from git/v1 build.
- Canonical `outcome` select = 104-option superset of the six trees' drifted lists; near-duplicates (e.g. "Advise local pharmacy" vs "Advise pt to visit Local Pharmacy") worth rationalizing with Penrose.

## Test checklist after import

1. `?outcome_key=nhs_<key>` (see registry) — advice + netting render, submit works.
2. A `variant` key (Rash catalog) — escape guidance box renders; "P1 not possible" swaps to the alternate; pressing it again shows the no-op notice; "already trialled" opens the Pharmacy First tree.
3. No params — "Outcome not recognized" notice; manual outcome still submits.
4. `outcome`, `suggested_outcome`, `other_outcome` land in session data (Power BI names preserved).
5. Copy area copies title + suggested-outcome text.
