# Penrose — 6 Disparate Triage Trees: Improvement Plans

_Analysis date: 2026-07-16 · Source: `Selected_from_Penrose Health (2)_2026-07-17 (5).json` (all 6 trees, latest export)._

These six trees are **clinically disparate** (different presentations, different red flags, different questions). They are **not** consolidation candidates the way the 5 Mental-Health trees were — merging them into one flow would hurt clarity, not help it. So the plan below improves **each tree on its own**, then calls out the **one** shared component that _is_ worth extracting across all of them (and across Penrose's wider triage estate).

Every recommendation here is a pattern Penrose already proved in the MH Master Triage consolidation (`Penrose MH Master Triage (Consolidated) v5.json`) — this just applies those same sub-patterns per tree.

---

## The one problem all six share: the duplicated Outcome screen

Every tree ends each path on a near-identical **Outcome** content node holding the same three fields (`outcome` — the ~60-option disposition select, `suggested_outcome` — a hidden code like `1.AEor999`, and `other_outcome` — free text). The nodes differ only in (a) the staged `suggested_outcome` code and (b) a small block of per-disposition advice HTML.

| Tree | Total nodes | Duplicated Outcome screens | Distinct outcome codes | Est. nodes after fix |
|---|---:|---:|---:|---:|
| Rash | 330 | **129** | 38 | ~200 |
| Women's Health | 101 | 34 | 29 | ~66 |
| Contraception | 37 | 17 | 11 | ~21 |
| Paediatric Cough, Cold & Fever | 40 | 10 | 8 | ~28 |
| Pharmacy First | 24 | 8 | 8 | ~17 |
| NHS Health Check | 10 | 3 | 3 | ~7 |
| **Total** | **542** | **201** | **97** | **~339** |

**201 near-duplicate Outcome screens** across the six trees. The 60-option disposition list is copy-pasted 201 times — so renaming or adding one disposition today means editing up to 201 nodes (and, as the MH review found, the list had already drifted into 5 inconsistent variants).

### The fix (same pattern as MH v3–v5)

Replace each tree's N Outcome screens with **one shared Outcome node** driven by a small **outcome catalog**:

1. **One `OUTCOMES` catalog map** in a script node: `OUTCOMES[outcome_key] = { code: "1.AEor999", title: "...", advice_html: "..." }`. Every disposition's code + advice HTML lives here, in one table, instead of scattered across content nodes.
2. Each terminal path sets a single `outcome_key` — folded into the eval/route script that path already runs (no new node in most cases), or a 1-line setter where an action button is the terminal.
3. **One shared Outcome content node** renders `${transforms.outcome_advice_html}` + the native `outcome` select + the hidden `suggested_outcome` + the `(outcome == 'Other')` → `other_outcome` tail.
4. Set the tree's **`merge_vars_not_fixed = "1"`** so the shared node re-renders per path (all six currently have it `"0"` — the trap that makes a shared node "show the first outcome for every path").

**Authoring win:** the disposition list and every advice snippet become a single table you edit once, and the Outcome/Other/Safety-netting tail is one screen instead of 3–129.

---

## Grouping recommendation: share the Outcome tail, not the flows

Keep the six flows separate. The **only** thing genuinely identical across all of them (and across the ~150-workflow estate Penrose described) is the **Outcome + disposition list + Other/Safety-netting tail**. Extract that once and reuse it:

- **Best (data-backed):** a single **canonical disposition list** fed by a **CX Action / Notion Data Source** so the `outcome` select is dynamic (`list_source_type: "dynamic"`). One edit in Notion updates every triage tree — this is the estate-wide manageability lever, and it directly answers the "manage 150 workflows" goal. (This is the Phase-2 CX Actions idea already floated for the MH build.)
- **Good (no infra):** a shared **"Outcome & Disposition" subtree** each triage tree dispatches to via a `Tree` node + `return_tree_node_id`, passing `outcome_key`. The tail lives in one tree; the six triage trees own only their clinical questions.
- **Minimum:** keep the tail in each tree but standardise it to one canonical `outcome` list + one catalog script (copy-paste-maintained), so at least each tree is internally consistent.

_CX Actions question (per build process): the only API opportunity here is feeding the disposition list (and, later, clinician-availability restrictions currently iframed from penroseportal.co.uk) from Notion. No other external data is needed for these triage flows._

---

## Cross-cutting fixes (apply to all six)

- **Add a `claude.md` memory node to each tree** — none of the six has one today. This is the biggest pure _authoring_ win: it lets any author (or Claude) open a tree and understand/extend it from prompts. Seed it from the inventory: purpose, node map, the outcome catalog, data dictionary, conventions.
- **Keep the safety-netting scoring verbatim.** All six already use the org-proven checkbox scoring pattern correctly (`(seizure==0)&&(blue_lips_or_tongue==0)&&…`, `advanced_logic_node="1"`, 0 misconfigured nodes). Do **not** rewrite red-flag logic into scripts — copy it as-is. Any change to clinical red-flag logic must go to a clinician for review.
- **Collapse info→question content chains** where a pure info screen feeds a single question screen (a few per tree) into one screen — the "one screen, many values" pattern.
- **Node titles as a story.** Several terminal nodes are titled only by disposition; after the Outcome collapse, titles read cleanly (`Assess red flags` → `Ask symptom detail` → `Outcome`).

---

## Per-workflow plans

### 1. Rash (id 838263148) — 330 nodes → ~200
Biggest offender: **129** duplicated Outcome screens (39% of the tree), 38 distinct codes. It also has 74 Scoring nodes and age-gated branches (`age_button` + red-flag checklists).
- **Priority 1 — Outcome collapse.** 129 Outcome screens → 1 shared node + a 38-entry `OUTCOMES` catalog. Single largest node reduction in the estate.
- Keep all red-flag Scoring nodes (`seizure`, `blue_lips_or_tongue`, `rapid_swelling_of_face`, `stiff_neck`, `light_sensitivity`, …) verbatim.
- Audit for unreachable legacy nodes (the MH review found 14 dead CYP nodes; a 330-node tree very likely carries similar cruft) — flag to Penrose before deleting.
- Add `claude.md`; set `merge_vars_not_fixed="1"`.

### 2. Women's Health (id 425104046) — 101 nodes → ~66
Entry is a required `concern` select (18 options) fanning into per-concern branches; 34 Outcome screens, 29 codes; 12 Tree links out to sibling flows (incl. Contraception).
- **Priority 1 — Outcome collapse.** 34 → 1 + 29-entry catalog.
- Its 12 `Tree` nodes are cross-references (e.g. into Contraception) — good; keep as links, don't inline.
- The `concern` select is the natural entry; confirm each of the 18 options routes somewhere live (fan-out this wide is where dead branches hide).
- Add `claude.md`; set `merge_vars_not_fixed="1"`.

### 3. Contraception (id 967774271) — 37 nodes → ~21
Highest _duplication ratio_: 17 of 37 nodes (46%) are Outcome screens, 11 codes. Entry is a `Reason` select; 6 Tree links out.
- **Priority 1 — Outcome collapse.** 17 → 1 + 11-entry catalog — nearly halves the tree.
- Otherwise clean; mostly button-routed content. Add `claude.md`; set `merge_vars_not_fixed="1"`.

### 4. Paediatric Cough, Cold & Fever (id 693614196) — 40 nodes → ~28
Strong red-flag design already: layered checklists (`drowsy`, `floppy`, `bulging_on_head`, `seizure_or_shaking`, `cold_hands_or_feet`, `sucking_in_when_breathing`, `rapid_breathing`, then a second tier `temp_39_plus`, `peeing_less`, `drinking_less`, `barking_cough`, …). 10 Outcome screens, 8 codes.
- **Priority 1 — Outcome collapse.** 10 → 1 + 8-entry catalog.
- Merge the 3 pure-info intro screens into the first question screen.
- Keep the two-tier red-flag Scoring verbatim. Add `claude.md`; set `merge_vars_not_fixed="1"`.

### 5. Pharmacy First (id 824824140) — 24 nodes → ~17
Compact. Single red-flag screen (`chest_pain`, `shortness_of_breath`, `fever`, `vomiting`, `not_peeing`, `confusion`) → Scoring → outcomes. 8 Outcome screens, 8 codes (1:1, no repeats).
- **Priority 1 — Outcome collapse.** 8 → 1 + 8-entry catalog.
- Smallest lift; good candidate to pilot the shared-Outcome refactor and validate live before applying to Rash. Add `claude.md`; set `merge_vars_not_fixed="1"`.

### 6. NHS Health Check (id 892463490) — 10 nodes → ~7
Smallest, mostly linear info + one Scoring node; no red-flag checkboxes (it's a wellness check, not acute triage). 3 Outcome screens, 3 codes.
- **Priority 1 — Outcome collapse.** 3 → 1 + 3-entry catalog.
- Merge the pure-info screen into its question. Add `claude.md`; set `merge_vars_not_fixed="1"`.

---

## Suggested sequence

1. **Pilot on Pharmacy First** (24 nodes, 8 clean outcomes) — build the shared Outcome node + catalog + `merge_vars_not_fixed="1"`, import, live-test the copy-area and that each path stages the right disposition.
2. **Roll the same refactor** to NHS Health Check → Contraception → Paediatric → Women's Health → Rash (smallest to largest).
3. **Then** decide on the estate-wide share: promote the canonical disposition list to a Notion-backed CX Action (or a shared Outcome subtree) so all triage trees draw from one source.
4. Add the `claude.md` node to each tree as you touch it.

_Clinical caveat: none of the above changes clinical red-flag logic or question wording — it restructures duplicated plumbing only. Any change that would alter routing on clinical answers should be reviewed by a Penrose clinician before going live._
