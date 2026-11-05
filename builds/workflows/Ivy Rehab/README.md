# Ivy Rehab — what's in this folder

## Import into Zingtree

Only these two are tree exports. Both are standalone single-project JSON (bare `id` /
`nodes` / `root_node_id`, no `projects` wrapper) — verified against the import-safety rules.

| File | Import now? |
| :--- | :---------- |
| `Schedule New Patient Appointment (Azure insurance dropdown 2026-09-17).json` | **Yes.** Needs no new Connected Objects — it reuses `alias_35`, which already exists. |
| `Incoming Call (lead picker + therapy type 2026-09-17).json` | **Yes, once the three Connected Objects have their `client` header.** Ids 1288 / 1289 / 1290 are already wired in. Node 9 is an empty screen until you insert the Dynamic View on it from the editor toolbar. |

The two `(BEFORE baseline ...)` files are untouched copies of what you exported, kept so the
diff reports mean something. Don't import those either — they'd roll back the change.

## Not importable — everything else

- **`fixtures/*.json`** — mock data for the offline walk harness, not trees. They hold
  `tree_id`, `query_params`, `actions`, `form_inputs` and `expect`. Zingtree will reject them.
  They're consumed by `node scripts/walk.mjs <tree> <fixture>`.
- **`*-diff-*.md`** — before/after change reports.
- **`stage-a-verification-2026-09-17.md`** — lint, walk and containment results.
- **`connected-objects-to-create.md`** — specs for the three new Connected Objects and the
  Create Lead body edit.

## Order of operations

1. Import **Schedule New Patient Appointment** — safe on its own, needs nothing else.
2. Add the `client: Zingtree_9892` header to Connected Objects **1288, 1289 and 1290**, and set
   **1288's Cache TTL to 0**. Raintree requires `client`; a cached lead search re-creates the
   duplicate bug.
3. Update the **Raintree - Create Lead** (1067) body **and** import the Incoming Call tree in the
   same window — `"disciplines": ${lead_disciplines_json}` is unquoted, so an updated object
   against the old tree produces invalid JSON and every lead creation fails.
4. Create the **Dynamic View** on Connected Object 1288 (grid, Selectable on, Multi-Select off;
   fields firstName, lastName, dob, location, primaryReason, disciplines, createDateTime) and
   insert it on **node 9, "Select Existing Lead"**. The view only becomes selectable after 1288
   has run once in a published workflow, so this follows step 3.
