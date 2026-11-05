# Penrose MH — commonalities across the 5 trees & how they consolidate

Sources (from `Selected_from_Penrose Health (2)_2026-07-13 (3).json`, the superset export):
Severe Mental Illness Review (11), Adult Mental Health (21), Depression Review (9),
Children & Young People MH & LD (46), MH Risk Assessment (20). Total **107 nodes**.

## Fields that are the same across all five trees

| Field | Type | In how many trees | Role |
|---|---|---|---|
| `outcome` | select (required, filterable) | **5 / 5** | The booking decision. Near-identical ~65-option list in every tree — normalized to one canonical master list. |
| `suggested_outcome` | hidden | **5 / 5** | Carries the recommended pathway for reporting. |
| `other_outcome` | multiline (required) | 4 / 5 | Free text, shown only when `outcome == 'Other'`. |
| risk / emergency checks | checkbox → select | conceptually all | SMI `feelsUnsafe/suicidal/harm`; CYP 5 non-verbal checks; MH Risk's full yes/no questionnaire. |

## The repeated structure (the real redundancy)

Every tree, whatever its clinical path, funnels into the **same 4-step tail**:

`Outcome screen (outcome select + suggested_outcome)` → `Other-outcome logic (Scoring, outcome=='Other')` → `Other outcome (multiline)` → `Safety Netting`

That tail is physically duplicated: **~24 outcome screens, ~6 other-outcome logic nodes, ~6 other-outcome screens, ~6 safety-netting screens** across the five trees.

## How it consolidates into one flow

- **One entry router.** `Init script` normalizes a `condition` value (launch via `?condition=smi|adult_mh|depression|cyp|risk`, or the picker screen) → `Route: valid condition?` router → the right condition lane.
- **Native fields for input.** Each condition's questions become Content screens using native `select` fields (Yes/No etc.), several questions combined per screen. No dynamic HTML for input.
- **Dynamic HTML for output.** All 24 outcome screens collapse into **one catalog script (node 88)** holding 21 keyed HTML entries. Each clinical endpoint sets `outcome_key`; the catalog stages `${transforms.outcome_html}` into **one shared Outcome content node**, then the shared Other-logic → Other outcome → Safety Netting.
- **Routing rule.** Every decision is eval-script → router; routers test only script-set booleans (`smi_is_risk`, `risk_is_moderate`, `outcome_is_other`, …). Checkbox risk scoring copied verbatim from the source trees.

**Result: 107 → 61 nodes.** Delivered as `Penrose MH Master Triage (Consolidated) v5.json`.

## Fixes folded in
- CYP Emergency/Paramedic outcomes previously reached an unrelated **physical-injury** safety-netting screen ("body part torn off / bite bleeding") copied from another template — remapped to the MH crisis safety-netting text.
- `merge_vars_not_fixed = 1` is set so the one shared Outcome/Safety screen re-renders per path (otherwise the first-rendered outcome sticks).

## Verification (v5, this pass)
Import lint clean: every `project_node_id` == its key and == `display_order`; no non-string scalar fields; all button/continuation links resolve; button graph is a DAG (no loops); single terminal (Safety Netting); every node reachable from root; all 5 conditions routed; 21 setters all map to catalog keys; 4 external subtrees (nav, panic, chasing referral, repeat medication) preserved as Tree nodes.
