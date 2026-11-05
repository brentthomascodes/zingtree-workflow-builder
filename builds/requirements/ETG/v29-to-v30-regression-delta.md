# ETG dynamic-errand regression - v29 -> v30 delta

Harness: `run_full.js` executes nodes 2, 12, 27, 21 out of each export; expected values come from `oracle.js` (the written business rules), not the tree's code.
Config: `config.assumed.json` (buckets INFERRED) - re-run confirmed identical against `config.numericids.json`.

| | v29 | v30 |
|---|---|---|
| Cases | 74 | 74 |
| Pass | 67 | 74 |
| Fail | 7 | 0 |

## Changed verdicts

| Case | Group | Scenario | v29 | v30 | Expected c/g/s/e | v29 actual |
|---|---|---|---|---|---|---|
| C065 | re-entry | Clean 2-PNR pass, then node 27 re-entered with nothing re-picked | FAIL | PASS | 1/2/0/2 | 0/0/0/0 |
| C066 | re-entry | Clean 2-PNR pass, then re-entered twice | FAIL | PASS | 1/2/0/2 | 0/0/0/0 |
| C067 | re-entry | Clean single-PNR pass, then re-entered | FAIL | PASS | 1/0/0/1 | 0/0/0/0 |
| C068 | re-entry | Mixed proceed + do-not-proceed, then re-entered | FAIL | PASS | 1/0/1/2 | 0/0/0/0 |
| C069 | re-entry | 3 PNRs, 2 distinct combos, then re-entered | FAIL | PASS | 1/2/0/2 | 0/0/0/0 |
| C070 | re-entry | Clean pass, then the agent re-picks one PNR to a different action | FAIL | PASS | 1/2/0/2 | 0/0/0/0 |
| C071 | re-entry | Clean pass, then the agent re-picks a PNR from proceed to do-not-proceed | FAIL | PASS | 1/0/1/2 | 0/0/0/0 |

No case regressed. Every v29 failure is `valid_run=yes` with actual counts 0/0/0/0 - a clean run that recorded nothing and blocked the agent, rather than a run that recorded a wrong fact against the order (`valid_run=no`). There are no `valid_run=no` failures in either version.

## What the new group covers

The `re-entry` group runs node 12 -> browser -> node 27 -> node 50 more than once before the ticket loop, because a single forward pass cannot see a defect where node 27 damages state it needs later. Two cases in the group pass on v29 as well - a run whose FIRST pass failed still has its original `actions_array`, which is why v25's re-select repair looked correct and why this went unnoticed until a clean pass was followed by a re-entry.
