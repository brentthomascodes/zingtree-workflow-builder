# ETG Rebooking — Consolidation Requirements & Build Record

**Tree:** ETG Rebooking (Consolidated) — hub id `359750132`
**Source:** `Selected_from_ETraveli Group_2026-07-27.json` (15 trees, 256 nodes)
**Deliverable:** `Zingtree Builder/Workflow JSONs/ETG/Rebooking Consolidated (v1 merged 2026-07-27).json`
**Opened:** 2026-07-27 · Owner: Brent · Builder: Wes (via Dudley) · Skill: zingtree-workflow-builder

## Goal
Convert the 15-tree ETG Rebooking hub-and-spoke system into ONE lean tree, apply house best
practices, favor dynamic HTML + scripting, remove duplication. Decisions confirmed by Brent:
- **Forms:** native conditional fields for input; dynamic HTML for display only (Penrose v8 rule).
- **Scope:** these 15 trees only. The 9 `Different Request` handlers stay as external Tree calls
  (not in the export). Persistent Buttons merged in (not kept separate).
- **Gate:** build now, Brent reviews the output.

## Source inventory
15 trees, 256 nodes. Hub `1. Rebooking` (359750132) dispatches to GDS(45), LCC(24), Portals(67),
Take Payment(11), Escalate(6), GDPR(6), No Action(3), Refund Flex(6), Different Request(16),
outcome subtrees 2a/2b/4a/4b(26), Persistent Buttons(10). CX Actions live: `findorder` (Edvin),
Connected Objects org 113 — id 20 (child ticket), 54 (flow tags), 57 (internal note).

## Confirmed defects in the source (fixed in v1 where noted)
1. **merge_vars_not_fixed = "0" on all 15 trees.** Shared screens render `${transforms.*}` staged
   per PNR iteration → every PNR after the first shows PNR 1's data (Penrose v4 rule). **FIXED → "1".**
2. **Persistent Buttons return points to tree 301173830** (an old copy of the hub), nodes 22/40.
   **FIXED → current hub 22/40.**
3. **Dead nodes:** `New Node (57)`, PB `Start Node`, Portals `91`/`100`/`144` (all 0 inbound in
   source; Portals 100's own button went to `-1`). **REMOVED.**
4. **css_include inconsistent** — Refund Flex / Different Request / Persistent Buttons used the
   eu.zingtree default; other 12 used the managed ETG sheet. **NORMALIZED to the ETG sheet.**
5. ~20 Scoring routers carry a blank-expression fallback button → `0`; duplicate visible+hidden
   fields sharing a name on ~15 form nodes. **Preserved verbatim in v1** (policy-bearing); addressed
   in the collapse pass (below) so routing behavior is never changed unseen.

## v1 — faithful merge (BUILT, lint PASS, 256 → 220 nodes)
- All 15 trees inlined into one project namespace, sequential ids, hub root = Content node `2`.
- Every cross-tree Tree/Return hop replaced by a direct link. Return targets resolved **statically**
  (each subtree has exactly one caller; LCC returns to hub 39 explicitly; PB → hub 22/40).
- 9 `Different Request` handlers kept as external Tree calls (unchanged).
- Defects 1–4 fixed. `claude.md` in-tree memory node added (id 221).
- **Verification:** import-safety lint PASS (root is Content; only proven formfield keys; pnid ==
  display_order == key; all links resolve; graph reachable except intentional unlinked = claude.md +
  3 persistent-button entries; single namespace). All 37 script bodies pass `node --check`.

### One required post-import UI step
Global persistent buttons (Escalate / Supervisor Callback / Interaction Disconnected) were an
**externally-attached** persistent-button subtree — that attachment is a tree/org **Settings** value,
not node JSON. The three screens are merged in (nodes marked hide_from_search) and their loop-return
is wired to the hub. **After import, re-attach them as this tree's persistent buttons in the UI.**

## Collapse plan — the "lean" pass (PROPOSED, not yet built)
Each rewrites live payment/policy/ticket screens, so each ships as its own verified pass with a
Stage B UI test. Estimated landing after all four: **~90 nodes.**

| # | Lever | Now | After | Notes / risk |
|---|---|---|---|---|
| C1 | 22 pricing-form variants → 1 native-conditional screen keyed on a script-set `form_variant`; one gather script | ~32 | ~3 | **Touches payment/cost fields (`cost_to_pax`, `system_cost`, `payment_method`).** Flag for team review before live. |
| C2 | Outcome subtrees 2a/2b/4a/4b → keep verbatim policy routers, replace the 5 near-identical screens each with 1 screen + a catalog script (scenario→outcome text) | 26 | ~8 | Router expressions preserved verbatim. |
| C3 | Child-ticket loop tail (Take Payment / Escalate / GDPR / No Action / Refund Flex) → one shared tail fed by per-handling staged fields | ~20 | ~5 | Touches Zendesk child-ticket Connected Object (id 20). |
| C4 | 16 thin `Assign Outcome to Var` setters → conditional hidden fields on the pricing screens; 3 duplicate `Create PNR Details Banner` scripts → 1 | ~19 | ~2 | `proceedHandling` route value must be preserved exactly. |
| — | Node-title story pass: rename generic titles (`Error`, `Continue`, `esc_sup`, `New Node`) | — | — | Cosmetic; do alongside C1–C4. |

## Open questions for Brent
- OK to proceed with C1–C4 as sequential verified passes? C1 needs team review (payment).
- Confirm v1 imports cleanly and routes on your side before I start the collapse pass.

## Changelog
- 2026-07-27 · v1 faithful merge built, lint PASS (220 nodes), saved to Workflow JSONs/ETG/. Collapse
  plan C1–C4 proposed.
- 2026-07-27 · **v2 collapse pass** — `Rebooking Consolidated (v2 collapsed 2026-07-27).json`.
  Executed **C3** (unify 4 child-ticket tails → 1 shared tail; corrects a latent bulk-push duplicate
  in the GDPR/Refund-Flex cursors) + removed 2 no-op scripts + compacted ids. **220 → 206 nodes.**
  Lint PASS, 33/33 scripts parse, CO 20/54/57 retained. **Needs Brent's Sandbox UI test** (ticket-loop
  behavior change). CX Actions rebuild spec written: `rebooking-connected-objects-sandbox-spec.md`.
  Still deferred: **C1** pricing-form consolidation (touches payment fields — team review), **C2**
  outcome catalog, **C4** thin-setter → hidden fields.
