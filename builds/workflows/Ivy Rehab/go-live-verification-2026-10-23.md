# Ivy go-live verification (Mon 2026-10-26) — run 2026-10-22

Tested the live exports (2026-10-23 UTC): SNPA 227319134, Insurance Inquiry 718637140, Incoming Call 632727963.
Live SNPA and II match the last builds node for node; Incoming Call unchanged since 10/13 (CO edits sit outside the export).

| Area | Result |
| :-- | :-- |
| SNPA routes (SharePoint clinic, static rollout clinic, non-rollout 119, API 500, no list) | 27/27 pass (fixtures/golive-snpa-matrix.py) |
| SNPA/II catalogue script (status spellings, cell shapes, dup codes, real UT84737 + 48-name payloads) | 70/70 pass (fixtures/golive-parser-stress.mjs) |
| Disposition: every path from 199/119 to Confirm Appointment (53) | all set disposition_type, none write 0 |
| Case type on 173 (159 -> 193 -> 173 -> 174 -> 175) | pass |
| Insurance Inquiry routes from Incoming Call entry (node 1 / 43) | 13/13 pass (fixtures/golive-ii-matrix.py) |
| Incoming Call 162 POST gate (code + member id only) | 4/4 pass (fixtures/golive-ic162.mjs) |
| Lint | no new errors in any tree (all existing errors are -1 links on unused nodes, IC Date) |

Open before go-live: see chat summary 2026-10-22.
