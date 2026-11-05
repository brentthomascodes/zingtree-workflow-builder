# Penrose MH Master Triage (Consolidated) — v3.5

## v3.5 — condition drop-down is the starting node

Root is now node 3: a content node with the required condition drop-down (5 use cases) and one Continue button. Continue -> Init script (maps the selection to its condition key + booleans) -> validity check (invalid/blank loops back to the drop-down; required=1 prevents blank natively) -> condition router -> entry. The `?condition=` query param still works as data (Init reads the same variable), but the drop-down is always the first screen.

## v3.4 fix — SMI/CYP checkbox evaluation copied verbatim from the source tree

The v3.3 assertion cross-check misrouted (no ticks + "No" still hit the Error screen): a script heuristic decided whether a checkbox was ticked, and live Zingtree does not return unticked checkboxes as ""/"0" through `ZT.getVariableValue`. v3.4 evaluates EXACTLY like the source tree: the SMI screen keeps its two verbatim assertion action buttons ("Yes/No - patient has ... emergency symptoms"), each leading to the source's own scoring node copied verbatim — `(feelsUnsafe == 0) && (suicidal == 0) && (harm == 0)` — where unticked resolves to 0 natively. No script touches the checkboxes. CYP's non-verbal path is likewise restored to the source's exact screens and scoring nodes (41/24/44/45 → nodes 45/46/57/58). The verifier evaluates these expressions with 0/1 checkbox semantics; the reported case (no ticks + No button → MHN outcome) is a named regression test.

## v3.3 — full SMI/CYP validation functionality restored (Brent, Jul 14)

The merged SMI/CYP checkbox screens had dropped the trees' core interaction: the explicit Yes/No symptom assertion cross-validated against the ticked boxes, with error screens on mismatch. Restored, keeping the one-screen pattern:

- SMI screen now carries the verbatim assertion as a required select ("Yes - patient has some emergency symptoms" / "No - patient has no emergency symptoms") plus the 3 checkboxes. The eval script cross-checks: assert-yes with no ticks -> verbatim Error-YES screen (node 15); assert-no with ticks -> Error-NO (node 16); assert-yes with ticks -> risk assessment; assert-no clean -> MHN outcome. Error screens are Back-button dead ends exactly like the source tree — no agent can now reach the MHN outcome without explicitly asserting "no emergency symptoms".
- CYP non-verbal screen gets the same treatment (optional assert select; blank falls back to tick-driven routing; verbatim error screens on nodes 17/18).
- SMI content now sourced from the fresher Jul 14 export (includes the updated "call 111 and press 2" safety netting).

## v3.2 fix — logic nodes evaluate script-computed booleans only

Live testing showed logic buttons doing raw string comparisons on select values (`(new_symptoms == 'Yes')`) always fell through to default (depression always landed on MHN + its netting). Every decision now uses the house pattern: content screen (native fields) → eval Script node (reads values via `ZT.getVariableValue`, normalizes, sets booleans like `dep_go_postcard`) → logic node whose buttons each check one boolean (`dep_go_postcard == true`). Six eval scripts added (SMI emergency, Adult seen/safety, Depression, CYP non-verbal / condition / meds); the condition router now checks Init-computed `cond_*` booleans. Eval scripts `ZT.log` their inputs for Execution Insights debugging. The verifier lints that every logic expression is a `flag == true` boolean (exception: the org-proven `(outcome== 'Other')`) and functionally simulates select/checkbox values through the real scripts and logic buttons.

Note: the text "There is no specific safety netting advice for this condition..." is Depression's own verbatim netting copy from the source tree — after this fix it appears only on the two Depression outcome paths, and the new-symptoms path correctly exits to the Navigation tree.


One importable tree replacing the 5 Penrose Health MH trees (107 nodes -> 70), built from the Jul 13 2026 exports and the Jun 29 Penrose call (Marcus/Frances: "replace 150 workflows with one dynamic workflow").

## v3.1 — one screen, many values (core building theme)

No stacked content nodes: one content screen captures multiple values via native form fields, then a logic node routes. Nine merges applied: Depression new-symptoms + medication (one screen, logic 33 routes to postcard/Pharmacist/MHN); SMI purpose + emergency checkboxes; Adult seen-before + safety check (default branch = risk assessment, the safe failure mode); CYP crisis-lines + risk-intro, non-verbal check + symptom checkboxes, undiagnosed + worsening, start-meds + urgent-script, school + SENCO guidance; Risk consent + text-resources and the three dependents checks (one screen, three selects). The risk suicide/harm chain deliberately stays one-at-a-time: its native short-circuit (any high-risk answer skips ahead) is already the fewest-click design. Merged screens capture answers as named variables (`new_symptoms`, `non_verbal`, `cares_for_children`, ...) — more session data for Power BI than the originals recorded. The verifier now lints for stacked content nodes so the pattern can't regress.

## v3 architecture (after live testing of v1/v2, Jul 13)

v1/v2 routed answers through script-managed state on shared re-rendered nodes — unproven mechanics that looped live (v2's logic nodes were also missing `advanced_logic_node="1"`, which every proven Penrose logic node has). v3 uses ONLY mechanics present in Penrose's own production trees:

- **Questions route on action buttons.** All 42 question/info screens are verbatim copies of the original nodes (content, question, form fields, score fields untouched) — only button targets are remapped into the single tree. The button graph is a DAG: endless loops are structurally impossible; every one of 5,540 distinct paths terminates at an outcome, safety netting, or a linked tree.
- **Scripts only stage data.** Init (condition param + picker mapping), 5 per-condition entry scripts (safety netting text), 21 tiny outcome-setter scripts (suggested outcome + display HTML for the shared Outcome screen). No engine, no CONFIG in transforms.
- **Risk scoring is the native mechanism** copied verbatim: `score_var="risk_score"` + button values (7/1/0) + the original op-based calculator node (gte 7 -> Emergency, eq 0 -> routine MHN, default -> moderate).
- **Checkbox screens route via advanced-logic Scoring nodes** using the originals' expression style (`(feelsUnsafe == 1) || ...`) — the old Yes/No-button + error-node mismatch pattern is gone.
- **Consolidation kept:** one tree, `?condition=` entry with picker fallback, ONE Outcome screen holding the single canonical 69-option Final outcome select, ONE Other/Safety-Netting tail, origin-following safety netting (crisis handoffs jump into the risk questions past the risk entry script, so the origin condition's netting text stays staged).

## Files

- `Penrose MH Master Triage (Consolidated).json` — the import file
- `init_config.js` — the Init script; `entry_and_setters_sample.js` — sample entry/setter scripts (all 27 scripts are embedded in the JSON)
- `build_master_tree.py` — regenerates the JSON from fresh Penrose exports (re-run when their content changes)
- `verify_master_tree.js` — verification harness (`node verify_master_tree.js`): DAG/no-cycle proof over 5,540 paths, verbatim-copy diff of all 42 question nodes against sources, execution of all scripts, native risk-score simulation
- `engine.js` / `build_outcome.js` — deprecated v2 leftovers, ignore

## How it works

Node 1 (Script) normalizes `condition` (query param or picker) and node 4 routes to the condition's entry script, which stages that condition's safety-netting text. From there the agent walks ordinary Penrose question nodes wired button-to-button. Reaching a resolution passes through one of 21 outcome-setter scripts (3 lines each: suggested outcome code/text/title + display HTML) into the shared Outcome screen (node 90), which holds the one canonical Final outcome select, then the Other check and Safety Netting.

Drive it by query parameter on the session URL — no param shows a picker screen:

- `?condition=smi` — Severe Mental Illness Review
- `?condition=depression` — Depression Review
- `?condition=adult_mh` — Adult Mental Health
- `?condition=cyp` — Children & Young People MH & LD
- `?condition=risk` — MH Risk Assessment (standalone)

Cross-tree jumps became data: crisis paths hand off to the risk flow in-tree and safety netting follows the origin condition (mirrors the old `return_tree_node_id` behaviour). Risk scoring reproduced exactly (>=7 emergency, 0 routine MHN, 1-6 moderate). Links to the 4 trees outside this set (Navigation 570364802, Panic Attack 812674825, Repeat Medication 416535224, Referral Chasing 848053525) remain Tree nodes.

## Test checklist after import

1. Preview with `?condition=depression` (shortest flow) — both outcomes.
2. `?condition=smi` — tick an emergency symptom -> risk assessment -> confirm SMI safety netting at the end.
3. No param -> picker appears.
4. Confirm `outcome`, `suggested_outcome`, `other_outcome` land in session data (Power BI names preserved).
5. Confirm the `[[COPY-AREA]]` block on the Outcome node copies correctly.

## Findings to flag to Penrose

- The Final outcome select had drifted into 5 variants (44-68 options). This tree uses one canonical 69-option list; Depression's older short labels (e.g. "GP F2F") map to canonical ones ("GP routine F2F") — Power BI reports on Depression outcomes will see the new labels.
- CYP tree: 14 unreachable legacy nodes (5-9, 11-16, 19, 20, 46 — incl. the whole Addiction/previously-known subgraph). Excluded; Penrose should confirm it's dead.
- CYP Emergency + Paramedic outcomes led to safety netting about animal bites (copy-paste from another tree). Replaced with the standard CYP netting — worth telling Frances.
- SMI/CYP checkbox "error" nodes (mismatched Yes/No button) are gone: the engine computes the route from ticks alone.

## Phase 2 (discussed, not built)

CX Actions: clinician restrictions currently iframe from penroseportal.co.uk; a Notion Data Source + Connected Object could feed them as data instead. Deferred per Jul 13 decision.
