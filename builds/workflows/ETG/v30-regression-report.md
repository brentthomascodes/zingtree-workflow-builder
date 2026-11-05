# ETG "Register Errands - Dynamic" — v30 offline regression

Export tested: `Register Errands  Dynamic_1785886263686.json` (uploaded 2026-08-04)
Config: `config.assumed.json` (buckets **inferred** — no live Edvin `errand-configuration`
response is in the workspace, so bucket assignments remain a caveat)

## 1. Structure — PASS

`validate_tree.js`: 45 nodes (17 script), root 10, **0 problems**, 1 note
(node 5 `claude.md` unlinked by design). Safe to import.

## 2. Full matrix — 64 cases, 64 pass, 0 fail

| Group | Pass | Fail |
|---|---|---|
| tracker anchors T1–T8 (incl. 6a/6b) | 9 | 0 |
| sweep same-type/diff-action | 15 | 0 |
| sweep diff-type | 16 | 0 |
| sweep same-type/same-action | 4 | 0 |
| single PNR | 4 | 0 |
| 3 PNRs | 4 | 0 |
| failure mode | 12 | 0 |

All 5 invalid-run cases are correctly **blocked and flagged, recording nothing**
(0 child / 0 grandchild / 0 silent / 0 Edvin errands):

| Case | Scenario | Reason surfaced |
|---|---|---|
| C053 | Neither selection posted (ZD 334703 repro) | `selection_unreadable` ×2 |
| C054 | One selection posted, one lost | `selection_unreadable` |
| C056 | Stale action id from another type | `lookup_failed` |
| C058 | Bucket in an unreadable shape | `bucket_missing` |
| C059 | Bucket string nobody routes on (`pending`) | `bucket_unrecognized` |

That closes known-defects 1–3 as previously written: the v24 routing guard
(27 → 50 → 51 → 12) means an unread selection no longer becomes a false silent
ticket. Tolerant paths still resolve correctly: legacy display-name submit,
`{code:'proceed'}`, `"Proceed"`, `" proceed "`, regex-unsafe PNR, duplicate PNR.

## 3. Delta vs v29 — where v30 actually earns its number

The forward-pass matrix is **identical** for v29 and v30 (both 64/64), because
run_full makes one clean pass through node 27. The v30 fix only shows up on
re-entry, which the re-entry probe exercises:

| Pass through node 27 | v29 | v30 |
|---|---|---|
| 1 — normal forward run | resolves, 1 child / 2 PNRs | resolves, 1 child / 2 PNRs |
| 2 — Back-nav or `?session_id=` resume at node 25 | **both PNRs flagged `lookup_failed`**, 0 child, 0 final PNRs | resolves, 1 child / 2 PNRs |
| 3 — node 51 → 12 re-select loop | **both PNRs flagged again**, 0 child | resolves, 1 child / 2 PNRs |

Cause: in v29 the per-record `actions_array` is empty after the first pass
(lengths `0, 0`), so the second lookup of an already-valid action id fails and the
guard sends the agent to the re-pick screen — which re-renders selects with no
options and cannot recover. v30's options-catalog fallback keeps the catalog on
the records (lengths `7, 6`), so replays resolve, stay idempotent, and report
stable counts. Combined with the node 13/14/15/16 create guards, a replay does not
double-post tickets.

## 4. Export housekeeping

The uploaded export is behaviourally identical to
`Register Errands - Dynamic (v30 node27 idempotent + options catalog fallback 2026-08-04).json`.
The only differences are truncated `node_name` annotation text on nodes 13, 14, 15,
16, 50, 51 (Zingtree clips the field on export) — no script or logic changes.
Node 27 is byte-identical.

## 5. Not covered offline — needs the live sandbox

- Zendesk actually received the child/silent tickets (the note is written before
  the create calls fire — known-defect 4).
- The real `<select>` → `ZT.getVariableValue` round trip in the browser, which is
  what produced the ZD 334703 report in the first place.
- Real Edvin buckets. Drop the live `errand-configuration` GET response in as
  `scripts/config.json` and re-run to remove the inferred-bucket caveat.
