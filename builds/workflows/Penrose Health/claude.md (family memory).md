# claude.md — Penrose Triage Family (Hub tree 999100001 + 6 spokes)

## Purpose
Call handlers at Penrose Health (NHS GP practice) triage inbound patient calls. This is a
CONSOLIDATED family: one **Hub** tree is the single launch point and menu; it dispatches to six
single-responsibility **spoke** trees, one per clinical pathway. Each spoke asks its own clinical
questions, runs its own red-flag safety checks, records an outcome (disposition), and gives
safety-netting advice, then returns to the Hub. Runs in the Zingtree agent portal / Zendesk-style
call-handler view. No API (static decision logic only).

## Architecture — hub-and-spoke
- **Hub `0. Penrose Triage Hub` (id 999100001)** — 9 nodes:
  - n1 Content (root) `Start triage` — intake note + pathway menu (6 buttons → n2..n7).
  - n2..n7 Tree — dispatch to each spoke at its root; `return_tree_node_id = 8` (back to Hub close).
  - n8 Content `Triage complete` — shared close-out + generic safety-net fallback.
  - n9 Content `claude.md` — this memory node (unlinked, `hide_from_search=1`).
- **Spokes** (kept verbatim; clinical logic unchanged):
  | Menu label | Tree | id | root node | nodes |
  |---|---|---|---|---|
  | Contraception | Contraception V2 | 202495357 | 1 | 42 |
  | Women's Health | Women's Health | 425104046 | 1 | 105 |
  | Paediatric Cough, Cold & Fever | Paediatric Cough, Cold & Fever | 693614196 | 52 | 40 |
  | Pharmacy First | Pharmacy First | 824824140 | 1 | 24 |
  | Rash | Rash | 838263148 | 2 | 330 |
  | NHS Health Check | NHS Health Check | 892463490 | 1 | 10 |
- **Pharmacy First is also a shared subtree**: Contraception, Women's Health, Paediatric and Rash
  call into it (open_tree_id 824824140). Those cross-calls are preserved.
- **External trees referenced by spokes but NOT in this family** (live in the Penrose account, called
  by id): Menopause 218784462, Contraception 967774271, Navigation page 570364802, Breast lump
  249155721, Vaginal lump 741337648, Pregnancy 596543290, Period 651160027, Miscarriage 105235481,
  Medication 416535224. Renumbering a spoke would break these references — do NOT renumber spokes.

## Shared building blocks (the commonalities across all 6 disparate pathways)
Every spoke is built from the SAME small set of patterns. Learn these once; they repeat everywhere.
1. **Outcome / disposition capture.** A Content node with a `select` named `outcome` (the canonical
   disposition list, below) + a hidden `suggested_outcome` (the pre-filled recommended disposition
   for that path) + a `[[COPY-AREA]]` for case notes. Followed by a Scoring router
   `(outcome== 'Other')` → free-text `other_outcome` capture; else → safety-netting. The
   `(outcome== 'Other')` expression is the org-blessed verbatim form-field expression — never
   rewrite it.
2. **Red-flag / emergency-symptom safety check.** A Content node with `checkbox` fields (one per
   red-flag symptom), then a PAIR of advanced-logic Scoring nodes: a YES-path and a NO-path, each
   testing `(sx_a==0)&&(sx_b==0)&&...` (all clear → continue) vs `||` (any flag → escalate to
   999/111/urgent). Zingtree resolves ticked=1 / unticked=0. Symptom lists differ per condition;
   the STRUCTURE is identical. Copy these nodes verbatim when editing — do not re-derive tick logic
   in a script.
3. **Age banding.** `age_button` (1/2/3 bands) routes Rash and Paediatric. Scoring buttons key on it
   (`age_button==2`, `age_button>=2`, etc.).
4. **Safety-netting close-out.** Terminal Content node with condition-specific advice; a generic
   fallback ("no specific advice… if symptoms worsen, call 111 / 999") is reused for several paths
   and is the text on the Hub's n8 close-out.

## Data dictionary
- `outcome` (form) — the chosen disposition; read by the `(outcome== 'Other')` routers.
- `other_outcome` (form, multiline) — free text when outcome == Other.
- `suggested_outcome` (form, hidden) — per-path recommended disposition, shown to the handler.
- `age_button` (form) — age band 1/2/3 (Rash, Paediatric).
- Red-flag checkbox vars — per condition (e.g. `chest_pain, shortness_of_breath, fever, vomiting,
  not_peeing, confusion` in Pharmacy First; `seizure, rapid_swelling_of_face, drowsy, wheezy,
  blue_lips_or_tongue, pale_skin` in Rash; etc.). Named per symptom; consumed only by that
  condition's Scoring nodes.
- `consultation_notes` (form, Hub n1) — optional free text logged at the start.

## Canonical disposition list (SINGLE SOURCE OF TRUTH)
The ~68-item disposition list below is the ONE list. It was previously duplicated ~181 times across
the family (Rash x129, Women's x34, Paediatric x10, Pharmacy First x8). Those copies are now
normalised to this exact list. **To add/rename/remove a disposition: edit this list here, then
propagate** — prompt: "update the Penrose disposition list to match claude.md and rewrite every
master-list `outcome` select across the family." Keep `Other` in the list (the `(outcome== 'Other')`
routers depend on the value `Other`).

<!-- CANONICAL_DISPOSITIONS_START -->
Paramedic within 24 hrs F2F | GP within 24 hrs F2F | Signposted to A&E or 999 | Signposted to MECS |
Advise local pharmacy | Advise pt to visit Sexual Health Clinic | Advise pt to visit Urgent Care
centre | Advise pt to call 111 | Accurx text message sent | Added to Reception Lead books | Care
Coordinator (routine/same-day, F2F/tel) | Contact / visit external service | Direct patient to
website / NHS app | Discuss with Community Midwife / Health Visitor / Clinical Oversight | Duty
Doctor list | District Nurse referral | Email surgery generic inbox | FCP Physiotherapist
(routine, F2F/tel) | GPEA / GP hub appt | GP (routine/same-day, F2F/tel) | HCA (routine/same-day,
F2F/tel) | Home visit | Information/reassurance given | MHN (routine/same-day, F2F/tel) | Nurse hub
| Nurse (routine/same-day F2F) | Paramedic (routine/same-day, F2F/tel/triage) | Pharmacist
(routine/same-day, F2F/tel) | Pharmacy First referral | PA (routine/same-day, F2F/tel) | Task sent
to (Care Coordinator/Clinical Admin/GP/Nurse/Paramedic/Pharmacist/other on EMIS) | Swiftqueue
online booking | No appointment booked / no action taken | Other
<!-- CANONICAL_DISPOSITIONS_END -->
(The full newline-separated list with every variant lives inside each master-list `outcome` select's
`options`; the summary above is for humans. The exact strings are what the routers match.)

## Conventions & gotchas
- **Preserve clinical logic verbatim.** When editing, change routing/questions only where explicitly
  asked. Copy Scoring nodes (buttons, `logic_expression`, `advanced_logic_node`, `continuation_node_id`)
  exactly; only remap targets.
- **Routers evaluate script-set booleans or the blessed `(outcome== 'Other')` only** — never raw
  form-field string comparisons (fails live). Checkbox red-flag math uses the source trees' proven
  `(x==0)&&...` Scoring expressions.
- **`merge_vars_not_fixed`**: set `1` on any tree whose shared node renders staged merge fields.
  Hub is set to `1`. Spokes render static per-node content so they keep their original value.
- **Do NOT renumber spoke nodes** — external trees reference spoke node ids by number.
- **Two items intentionally left verbatim (review later):**
  - *Contraception V2* outcome selects are deliberately CURATED (2–3 options each) — NOT normalised
    to the canonical list, on purpose.
  - *NHS Health Check* uses a slightly different disposition vocabulary ("GP tel" vs "GP routine
    telephone", "GP red slot", etc.) — left verbatim; reconcile with the canonical list if Penrose
    wants one vocabulary everywhere.
- **Launch from the Hub.** The family is designed to be entered at the Hub so navigation/return work.
- **Import envelope:** this file is the multi-tree `{"projects":[...]}` transfer format (Hub first,
  then the 6 spokes). Re-import into Zingtree preserves tree ids, so cross-tree calls stay valid.

## Outcome-tail collapse (v2 — the shared disposition tail)
Each spoke's duplicated Outcome screens are collapsed onto ONE catalog-driven tail per tree:
- **Catalog script** (`type:"Script"`, code in `content`): holds `var C = { outcome_key: {suggested_outcome,
  advice_html, safetynet_html} }`. Reads `outcome_key`, stages `transforms.outcome_advice_html`,
  `transforms.safetynet_html`, and `suggested_outcome`. To edit an outcome's advice/suggested
  disposition/safety-net, edit its entry in this ONE catalog (prompt-driven).
- **Shared Outcome node**: `[[COPY-AREA]]${transforms.outcome_advice_html}[[/COPY-AREA]]` + Copy button +
  the ONE canonical `outcome` select + hidden `suggested_outcome`. → Other-logic.
- **Other-logic** (Scoring, cloned verbatim from the tree's own `(outcome== 'Other')` node) → Other-capture
  (`other_outcome` multiline) or → Safety-netting.
- **Safety-netting**: renders `${transforms.safetynet_html}` + generic fallback.
- **Setters**: each former non-chained Outcome screen is now a 1-line Script setter
  (`ZT.setFormData("outcome_key","<key>")`, code in `content`) → catalog. Inbound clinical edges
  unchanged (setters keep the original node id).
- **`outcome_key` naming**: `k_<sanitised suggested_outcome>_<origNodeId>` — unique per former screen.
- **Chained fallback outcomes kept VERBATIM** (42 screens: Rash 24, Contraception 14, Women's 2,
  Paediatric 2): where one Outcome screen leads to another ("if first option unavailable, use next"),
  both are left as-is so the fallback sequence is preserved. Do not flatten these without re-modelling.
- Script nodes store code in **`content`** (Zingtree has no `script` key). Node key set MUST equal the
  proven 62-key schema exactly — no extra/missing keys, or import fails silently.
- **Unreachable old-tail nodes**: collapsing orphaned some original Other-logic/safety-net nodes (now
  unreferenced). Left in place (harmless); flag to Penrose before deleting, alongside any pre-existing
  dead nodes (Rash likely carries cruft).
- **File variants:** `Penrose_Consolidated_Triage_Family.json` (v1 — hub + unified list, tails
  untouched) and `..._v2.json` (v1 + tail collapse). Per-tree single-file bare-object versions in
  `single-tree files/` for one-at-a-time import.

## Import rules (learned from a live failure, Jul 2026)
- **Multi-tree file** uses the `{"projects":[hub, ...6 spokes]}` wrapper (same as Penrose "export
  selected"). Single tree = a bare project object (no wrapper) — see `single-tree files/`.
- **The hub must NOT carry another tree's `predefined_vars`.** v1's first build cloned Pharmacy First
  as the hub prototype and dragged PF's `predefined_vars` (with PF's own `id`/`project_id`) into the
  hub → duplicate predefined-var id across two trees in one file → **import failed**. Fix: hub
  `predefined_vars = []`. Lint: assert predefined-var ids are unique across all projects in the file.
- Every node's key set must exactly equal the 62-key schema; Script code lives in `content`.

## Changelog
- 2026-07-23 (v2) · Outcome-tail collapse across all 6 spokes: shared catalog-driven Outcome tail per
  tree (catalog Script in `content` → Outcome node → cloned Other-logic → Other-capture → Safety-net);
  167/209 Outcome screens converted to `outcome_key` setters, 42 chained fallback screens kept verbatim.
  Fixed import blocker (hub `predefined_vars` duplicated Pharmacy First's ids → set to []). Clinical
  question graph + red-flag scoring provably unchanged. Dev-test before live (esp. Rash) per plan.
- 2026-07-23 · Consolidation (Brent prompt: merge 6 disparate Penrose trees into one manageable,
  prompt-editable workflow) · Built Hub tree 999100001 (n1 intake+menu, n2–n7 dispatch, n8 close-out,
  n9 claude.md). Normalised 181 duplicated master-list `outcome` selects to one canonical list across
  Women's/Paediatric/Pharmacy First/Rash. Left Contraception (curated) and NHS (variant vocab)
  verbatim. No clinical decision logic changed. Nodes touched: Hub (new, 9); outcome selects only in
  the 4 normalised spokes.
