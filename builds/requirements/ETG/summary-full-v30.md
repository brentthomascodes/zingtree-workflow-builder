# ETG dynamic-errand full-flow test

Tree: `v30.json` &middot; Edvin config: `config.assumed.json`

**74 cases - 74 pass, 0 fail**

Node bodies are executed from the export itself (nodes 2, 12, 27, 21) with the
node 12 -> browser -> node 27 select round trip simulated. Expected values come
from the business rules in `oracle.js`, not from the tree's code.

## By group

| Group | Pass | Fail |
|---|---|---|
| tracker T1 | 1 | 0 |
| tracker T2 | 1 | 0 |
| tracker T3 | 1 | 0 |
| tracker T4 | 1 | 0 |
| tracker T5 | 1 | 0 |
| tracker T6a | 1 | 0 |
| tracker T6b | 1 | 0 |
| tracker T7 | 1 | 0 |
| tracker T8 | 1 | 0 |
| sweep same-type/diff-action | 15 | 0 |
| sweep diff-type | 16 | 0 |
| sweep same-type/same-action | 4 | 0 |
| single PNR | 4 | 0 |
| 3 PNRs | 4 | 0 |
| failure mode | 12 | 0 |
| re-entry | 10 | 0 |

## Failures

None.
