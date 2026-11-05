# VI v1 — Stage A verification

**Correction applied 2026-08-05 (mid-build, before delivery):** Q1 is now answered — Brent, quoting
ETG: "register errand should work as it does in the existing register errand workflow." R10 is no
longer blocked. AC-10.1 (a single errand payload naming every PNR) is dropped; what ships is the
parent tree's EXISTING mechanism, applied unmodified — node 23 dedupes selected PNRs by
`type|customer_action` using the parent's exact node-27 `groupByErrand` logic, and node 41 is a
verbatim port of the parent's node 44 (same idempotency key, same clamp/reset cursor). No
VI-specific errand logic exists. Because R8 forces every PNR onto one shared type+action, this
always registers exactly one Edvin errand per order. All rows below reflect this corrected build.

Built from: `Register Errands - Dynamic (v35 replay idempotency 2026-08-05).json` (tree 595124299,
46 nodes) — forked, not edited in place. Output: `Register Errands - VI (v1 fork 2026-08-05).json`
(49 nodes, tree `id` deliberately blank — see the delivery note for import steps).
**Not imported anywhere. Live publish remains Brent's call.**

Requirements: `Zingtree Builder/Requirements/ETG/vi-errand-registration-requirements.md` (R1–R11).

## Edit list as built

| # | Nodes (new/mine) | Change |
| :-- | :-- | :-- |
| 1 | 1 | Root Script "Clear session and start fresh order" — ported from base node 10, dropped PNR-loop resets, added VI-specific resets |
| 2 | 2 | "Edvin - Find Order" — CO 176, verbatim from base node 4 |
| 3 | 3 | "Select PNR's for this VI order" — base node 6's grid/formfields, copy updated for explicit multi-select (R2) |
| 4 | 4 | "Set order context & channel" — adapted base node 24; `selected_pnrs` keeps full Find Order row objects, not flattened to strings |
| 5 | 5 | `claude.md` — full rewrite for this tree (see node 5) |
| 6 | 6 | **NEW** — combined booking-partner (R9) / STG-eligibility alert (R4) / disruption-type + conditional delay-reason (R5) screen |
| 7 | 7, 8 | **NEW** — script-before-router pair: R6 operational-window eval + Scoring router |
| 8 | 9, 10, 11, 12 | **NEW** — Outside-the-Operational-Window ladder (R7), verbatim Action/Note/Alert copy from the demo; node 12 "Last resort" is a marked PLACEHOLDER (Assumption A5) |
| 9 | 13, 14 | **NEW** — Within-the-Operational-Window ladder (R7), sharing node 11's Cancellation screen (AC-7.4) |
| 10 | 15, 16, 17 | **NEW** — three tiny setter scripts parameterizing the shared type/action entry (`vi_ladder_outcome`) |
| 11 | 18 | "GET Edvin Errands" — CO 182/183, verbatim, called ONCE per order (not per PNR) |
| 12 | 19 | **NEW**, adapted from base node 46 — resolves the VI category, builds `vi_type` / `actions_by_type` (R3) |
| 13 | 20, 21, 22 | **NEW** — native type select → narrowing script → native action select (R8); replaces the base's per-PNR tile-table mechanism entirely |
| 14 | 23 | **NEW**, replaces base node 27 — resolves `vi_resolved_type/action/bucket`, builds `child_tickets` (always 1 entry) and `vi_final_pnrs` via the parent's EXACT `groupByErrand(type\|action)` dedup (R10, unblocked — see correction note above), grandchild trigger (R11 [inferred]) |
| 15 | 24–38 | Ticket-creation subsystem — **ported verbatim** (script bodies byte-identical) from base nodes 3,13,14,32,33,35,36,37,38,39,40,41,15,16,34, renumbered only |
| 16 | 39 | "Format Internal Note" — adapted from base node 21: passenger block removed (R2), disruption/delay/partner fields added |
| 17 | 40 | "Zendesk - Add Internal Note" — CO 178, verbatim |
| 18 | 41 | **Verbatim port** of base node 44 (R10, unblocked) — same clamp/reset cursor, same `type\|customer_action` idempotency key, unmodified; only cosmetic renames (`vi_final_pnrs`/`is_more_vi_errands`) and VI fields added to the errand message |
| 19 | 42, 43, 44 | Adapted/verbatim from base nodes 17, 43(CO184), 45 |
| 20 | 45, 46, 47, 48, 49 | Closing block — ported verbatim from base nodes 23, 47, 49, 29(adapted resets), 48 |

**Removed entirely, not ported:** base nodes 7, 8, 9, 11 (per-PNR cursor + passenger selection loop,
R2); base nodes 12, 25, 27(role replaced), 50, 51, 52, 53 (the per-PNR action-table + unresolved-
selection escalate mechanism — structurally unreachable once R8 forces one required action select
for the whole order).

Node-count delta: **46 → 49** (net +3), but composition changed substantially: ~14 base nodes
removed, ~14 new nodes added, ~24 ported verbatim or lightly adapted with unchanged script bodies.

## Stage A results

**A1 Structural integrity** — `vi-v1-lint.py`: 0 problems. Root is node 1 (Script) — the
"Content-only root" rule is explicitly superseded by patterns.md's "Root node — Content OR
Script" note; `is_root="1"` matches `root_node_id`. All 48 non-`claude.md` nodes reachable from
root. Exactly one true dead end (node 49, End Session) — the sole terminal. Back-edges found:
`37→33`, `38→25`, `44→41` (proven cursor loops, ported from the base tree) and `48→2`
(Additional/Different-Request re-entry, also ported). No unexpected cycles.

**A2 Data-flow** — every `ZT.getVariableValue` call across all 17 scripts carries an explicit
default (`grep` swept clean). Every `transforms.*` read used as an array/object falls back
(`|| []` / `|| {}`) except two bare `.title` reads in the verbatim-ported nodes 27/35 — inherited
from the base tree's nodes 14/16, safe because the producing node (25/33) always writes at least
`{}`, never `undefined`. `disruption_type`/`delay_reason`/`partner_routing` (node 6),
`vi_ladder_outcome` (15/16/17), `vi_type_id`/`vi_action_id` (20/22) are each written on every path
that reaches their one downstream reader — confirmed by the graph (single producer per variable,
no path skips it).

**A3 Script review** — `node --check`: 17/17 clean. No undefined-variable references. No silent
`catch` blocks (none needed — no new try/catch introduced, matching house style). Idempotent on
back-nav — proven for both the child-ticket loop (scenario 4) and the errand loop (scenario 7).

**A4 Integration failure modes** — Edvin Find Order / GET Errands / Register Errand, and Zendesk
Add Internal Note, have no agent-facing error/timeout branch — this is an **inherited gap from the
base tree** (its own claude.md and the parent requirements doc's Q6 flag the same thing as
unspecified by ETG), not introduced by this build. Zendesk Create Child/Grandchild Ticket have the
inherited attempt-before-create idempotency guard (logs, not agent-facing screens) — same as base.

**A5/A6 Path stress test & requirements coverage**

| Req | AC | Evidence | Result |
| :-- | :-- | :-- | :-- |
| R1 | AC-1.1 | Nodes 24-38 code-diffed byte-identical to base 3,13,14,32,33,35,36,37,38,39,40,41,15,16,34; scenarios 4 & 7 (idempotency guards fire) | ✅ pass |
| R1 | AC-1.2 | Direct inspection against the 5 catalogued demo defects — none present | ✅ pass |
| R2 | AC-2.1 | Scenario 2 (3 PNRs, single pass through the whole flow) | ✅ pass |
| R2 | AC-2.2 | Grep: no `pnr_index`/`isMorePNR` in any of the 17 scripts; no passenger-selection node exists | ✅ pass |
| R2 | AC-2.3 | Scenarios 1 (1 PNR) and 2/3 (multi-PNR) walk the identical node sequence | ✅ pass |
| R3 | AC-3.1 | Node 20's `config` sources `transforms.vi_type` (built node 19 from `actions.edvin__errand_configuration`); no literal option list anywhere in the tree | ✅ pass |
| R3 | AC-3.2 | Same mechanism — fully data-driven, no Zingtree edit needed for a config change | ✅ pass (by construction) |
| R4 | AC-4.1 | Verbatim text diff confirms the STG alert precedes the disruption-type field on node 6 | ✅ pass |
| R4 | AC-4.2 | No eligibility logic anywhere in nodes 6/7; alert is instructional only | ✅ pass |
| R5 | AC-5.1 | Node 6's conditional tests the REAL option value `"Trip delay within the Operational Window"` (fixes demo defect #1) | ✅ pass (config-level); ⚠️ live conditional-render behavior needs Stage B |
| R5 | AC-5.2 | Same conditional mechanism, inverse case | ✅ pass (config-level); ⚠️ Stage B |
| R5 | AC-5.3 | Depends on Zingtree's live required-when-visible enforcement | ⚠️ untestable statically — flagged in claude.md, dev-test before go-live |
| R6 | AC-6.1/6.2 | Scenarios 1,2 (outside) and 3,5 (within) | ✅ pass |
| R6 | AC-6.3 | Node 8's buttons test only `is_outside_window`/`is_within_window`; node 7 does the one string comparison | ✅ pass |
| R6 | AC-6.4 | `continuation_node_id="9"` (a real node, never `"0"`); lint confirms all links resolve | ✅ pass |
| R7 | AC-7.1/7.2 | Verbatim diff: all 5 Action/Note/Alert blocks + all 13 button labels match the requirements doc text exactly | ✅ pass |
| R7 | AC-7.3 | Graph inspection: 9→10→11→12 and 13→14→11 are strictly forward, no back-edges in the ladder | ✅ pass |
| R7 | AC-7.4 | Node 11 has two inbound edges (from 10 and 14) — one shared Cancellation screen | ✅ pass |
| R8 | AC-8.1 | No per-PNR action control exists; additional-request path (46→48→2) is the documented escape hatch | ✅ pass |
| R8 | AC-8.2 | Node 22's select posts one value for the whole session — structurally impossible to split | ✅ pass |
| R8 | AC-8.3 | Scenario 6 asserts full reset (`vi_resolved_type/action`, `vi_final_pnrs`, `child_tickets` all cleared) | ✅ pass |
| R9 | AC-9.1 | Native select posts its own option text directly to `partner_routing` (no score_var remap) | ✅ pass |
| R9 | AC-9.2 | Only one line in node 23 reads `partner_routing`; documented in claude.md | ✅ pass (by design) |
| R10 | AC-10.1 | Correctly NOT built — Q1 answered "no" (registerErrand works like the existing workflow, one PNR/pair at a time); dropped per Brent's 2026-08-05 correction | N/A, dropped |
| R10 | (shipped shape) | Node 41 verbatim-ported from base node 44 (same `type\|action` idempotency key). Scenarios 8 & 9: a 1-PNR order and a 3-PNR order (all sharing one type+action) both dedupe to exactly one `vi_final_pnrs` entry and register exactly one errand — proving R2's intake-loop removal didn't break the array feeding node 41 | ✅ pass |
| R11 | AC-11.1 | Scenarios 1, 3 (proceed → exactly one child ticket, titled with all PNRs) | ✅ pass |
| R11 | AC-11.2 | Scenario 2 (non-proceed + follow_up outcome → one silent ticket, all PNRs, **zero** grandchildren) | ✅ pass |
| R11 | AC-11.3 | Scenario 3 (proceed + follow_up → exactly one grandchild, titled with all PNRs) | ✅ pass (as inferred — flagged for Brent's sign-off per the doc's A4) |

**A7 Pre-delivery lint** (`Zingtree Builder/MEMORY.md` checklist):
1. Root is a Content **or Script** node (Script root explicitly proven/allowed) — ✅
2. `project_node_id`==`display_order`==key on all 49 nodes; every scalar field a string — ✅ (0 violations)
3. Formfields use only the proven schema keys, no `value` key; every Scoring router with
   `logic_expression` buttons carries `advanced_logic_node="1"` and a `continuation_node_id` — ✅
4. All 49+ button/continuation links resolve; graph is a DAG except the 4 expected loops; all
   nodes reachable; single terminal (node 49) — ✅
5. Routers test only script-set booleans (plus the base-inherited `op:eq` value-match style on
   ported nodes) — ✅
6. `node --check` clean on all 17 scripts; 9/9 stubbed-ZT scenarios pass (`vi-v1-walk.mjs`), including the 1-PNR/3-PNR errand-registration stress test — ✅
7. Import envelope: bare single project object, no `projects` wrapper — ✅
8. `claude.md` (node 5) rewritten for this tree with a changelog entry, included in the delivered
   JSON — ✅

## What Stage A cannot verify (Stage B / human items)

- Live rendering of the conditional `delay_reason` field and its required-when-visible enforcement
  (R5/AC-5.3).
- Live rendering and required-enforcement of the two native dynamic selects (nodes 20, 22) sourced
  from `transforms.vi_type` / `transforms.vi_actions_array`.
- Whether `contact_reason__virtual_interlining` → Edvin category `"Virtual Interlining"` (node 19)
  is the real mapping — flagged assumption, mirrors the parent doc's Q2, needs Olga.
- The actual Zendesk/Edvin Connected Object request-body templates (CO 157/176/178/180/181/182/
  183/184) — configured in the Zingtree dashboard, outside this JSON's scope; unchanged from the
  base tree, so should already be correct, but not re-verified here since nothing about the
  request templates changed.
- Whether the Find Order grid widget (id 50) is genuinely configured for multi-row selection in
  the live dashboard — inferred from the base tree already reading `views.findorder` as an array,
  not independently confirmed.

## Reusable harness

`vi-v1-lint.py` and `vi-v1-walk.mjs` (this folder) run directly against the delivered JSON:
```
python3 "vi-v1-lint.py"
node "vi-v1-walk.mjs" "Register Errands - VI (v1 fork 2026-08-05).json"
```
`vi-v1-gen.py` is the generator that produced the JSON — kept for audit/history; its file paths
point at the build session's scratch directory and it is not meant to be re-run as-is.
