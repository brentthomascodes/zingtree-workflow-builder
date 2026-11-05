# ETG dynamic-errand full-flow test

Tree: `Register Errands - Dynamic (PRODUCTION, 2026-08-24).json` &middot; Edvin config: `config.assumed.json`

**74 cases - 0 pass, 74 fail**

Node bodies are executed from the export itself (nodes 2, 12, 27, 21) with the
node 12 -> browser -> node 27 select round trip simulated. Expected values come
from the business rules in `oracle.js`, not from the tree's code.

## By group

| Group | Pass | Fail |
|---|---|---|
| tracker T1 | 0 | 1 |
| tracker T2 | 0 | 1 |
| tracker T3 | 0 | 1 |
| tracker T4 | 0 | 1 |
| tracker T5 | 0 | 1 |
| tracker T6a | 0 | 1 |
| tracker T6b | 0 | 1 |
| tracker T7 | 0 | 1 |
| tracker T8 | 0 | 1 |
| sweep same-type/diff-action | 0 | 15 |
| sweep diff-type | 0 | 16 |
| sweep same-type/same-action | 0 | 4 |
| single PNR | 0 | 4 |
| 3 PNRs | 0 | 4 |
| failure mode | 0 | 12 |
| re-entry | 0 | 10 |

## Failures

### C001 - tracker T1: Different type, different action, both proceed

- Inputs: 9D89VM/Before ticket issuance/Cancellation completed - Sent for refund/proceed || AUU84K/Void/Void completed/proceed
- Expected c/g/s/e: 1/2/0/2 (rules R3-R5)
- Actual c/g/s/e: 1/2/0/2, guard_blocked=no, unresolved=0
- Invariant: internal note is missing the per-PNR bucket row
- 1 child + 2 grandchildren + 2 errands

### C002 - tracker T2: Different type, same action, both proceed

- Inputs: 9D89VM/Before ticket issuance/Cancellation completed - Sent for refund/proceed || AUU84K/Void/Cancellation completed - Sent for refund/proceed
- Expected c/g/s/e: 1/2/0/2 (rules R3-R5)
- Actual c/g/s/e: 1/2/0/2, guard_blocked=no, unresolved=0
- Invariant: internal note is missing the per-PNR bucket row
- 1 child + 2 grandchildren

### C003 - tracker T3: Same type, different action, both proceed

- Inputs: 9D89VM/Before ticket issuance/Cancellation completed - Sent for refund/proceed || AUU84K/Before ticket issuance/Sent Payment Link - fee due to CC2C/proceed
- Expected c/g/s/e: 1/2/0/2 (rules R3-R5)
- Actual c/g/s/e: 1/2/0/2, guard_blocked=no, unresolved=0
- Invariant: internal note is missing the per-PNR bucket row
- 1 child + 2 grandchildren

### C004 - tracker T4: Same type, same action, both proceed

- Inputs: 9D89VM/Before ticket issuance/Cancellation completed - Sent for refund/proceed || AUU84K/Before ticket issuance/Cancellation completed - Sent for refund/proceed
- Expected c/g/s/e: 1/0/0/1 (rules R3-R5)
- Actual c/g/s/e: 1/0/0/1, guard_blocked=no, unresolved=0
- Invariant: internal note is missing the per-PNR bucket row
- 1 child, 1 errand

### C005 - tracker T5: Different type, different action, both do-not-proceed

- Inputs: 9D89VM/Before ticket issuance/Do not proceed/no_action || AUU84K/Void/Do not proceed/no_action
- Expected c/g/s/e: 0/0/2/2 (rules R3-R5)
- Actual c/g/s/e: 0/0/2/2, guard_blocked=no, unresolved=0
- Invariant: internal note is missing the per-PNR bucket row
- 1 silent, 2 errands

### C006 - tracker T6a: Same type, different action, both do-not-proceed

- Inputs: 9D89VM/Before ticket issuance/Do not proceed/no_action || AUU84K/Before ticket issuance/Interaction disconnected - no response/no_action
- Expected c/g/s/e: 0/0/2/2 (rules R3-R5)
- Actual c/g/s/e: 0/0/2/2, guard_blocked=no, unresolved=0
- Invariant: internal note is missing the per-PNR bucket row
- 1 silent, 2 errands

### C007 - tracker T6b: Same type, same action, both do-not-proceed

- Inputs: 9D89VM/Before ticket issuance/Do not proceed/no_action || AUU84K/Before ticket issuance/Do not proceed/no_action
- Expected c/g/s/e: 0/0/1/1 (rules R3-R5)
- Actual c/g/s/e: 0/0/1/1, guard_blocked=no, unresolved=0
- Invariant: internal note is missing the per-PNR bucket row
- 1 silent, 1 errand

### C008 - tracker T7: Same type, same action, both proceed (errand dedup)

- Inputs: 9D89VM/Before ticket issuance/Cancellation completed - Sent for refund/proceed || AUU84K/Before ticket issuance/Cancellation completed - Sent for refund/proceed
- Expected c/g/s/e: 1/0/0/1 (rules R3-R5)
- Actual c/g/s/e: 1/0/0/1, guard_blocked=no, unresolved=0
- Invariant: internal note is missing the per-PNR bucket row
- 1 child, 1 errand

### C009 - tracker T8: Same type, different action, Different request + do-not-proceed

- Inputs: 9D89VM/Before ticket issuance/Different request/different_request || AUU84K/Before ticket issuance/Do not proceed/no_action
- Expected c/g/s/e: 0/0/2/2 (rules R3-R5)
- Actual c/g/s/e: 0/0/2/2, guard_blocked=no, unresolved=0
- Invariant: internal note is missing the per-PNR bucket row
- 1 silent, 2 errands

### C010 - sweep same-type/diff-action: proceed + proceed

- Inputs: 9D89VM/Before ticket issuance/Sent Payment Link - fee due to CC2C/proceed || AUU84K/Before ticket issuance/Cancellation completed - Sent for refund/proceed
- Expected c/g/s/e: 1/2/0/2 (rules R3-R5)
- Actual c/g/s/e: 1/2/0/2, guard_blocked=no, unresolved=0
- Invariant: internal note is missing the per-PNR bucket row

### C011 - sweep diff-type: proceed + proceed

- Inputs: 9D89VM/Before ticket issuance/Sent Payment Link - fee due to CC2C/proceed || AUU84K/Void/Void completed/proceed
- Expected c/g/s/e: 1/2/0/2 (rules R3-R5)
- Actual c/g/s/e: 1/2/0/2, guard_blocked=no, unresolved=0
- Invariant: internal note is missing the per-PNR bucket row

### C012 - sweep same-type/same-action: proceed x2

- Inputs: 9D89VM/Before ticket issuance/Sent Payment Link - fee due to CC2C/proceed || AUU84K/Before ticket issuance/Sent Payment Link - fee due to CC2C/proceed
- Expected c/g/s/e: 1/0/0/1 (rules R3-R5)
- Actual c/g/s/e: 1/0/0/1, guard_blocked=no, unresolved=0
- Invariant: internal note is missing the per-PNR bucket row

### C013 - sweep same-type/diff-action: proceed + no_action

- Inputs: 9D89VM/Before ticket issuance/Sent Payment Link - fee due to CC2C/proceed || AUU84K/Before ticket issuance/Do not proceed/no_action
- Expected c/g/s/e: 1/0/1/2 (rules R3-R5)
- Actual c/g/s/e: 1/0/1/2, guard_blocked=no, unresolved=0
- Invariant: internal note is missing the per-PNR bucket row

### C014 - sweep diff-type: proceed + no_action

- Inputs: 9D89VM/Before ticket issuance/Sent Payment Link - fee due to CC2C/proceed || AUU84K/Void/Do not proceed/no_action
- Expected c/g/s/e: 1/0/1/2 (rules R3-R5)
- Actual c/g/s/e: 1/0/1/2, guard_blocked=no, unresolved=0
- Invariant: internal note is missing the per-PNR bucket row

### C015 - sweep same-type/diff-action: proceed + escalate

- Inputs: 9D89VM/Before ticket issuance/Sent Payment Link - fee due to CC2C/proceed || AUU84K/Before ticket issuance/Customer language issue - transferred/escalate
- Expected c/g/s/e: 1/0/1/2 (rules R3-R5)
- Actual c/g/s/e: 1/0/1/2, guard_blocked=no, unresolved=0
- Invariant: internal note is missing the per-PNR bucket row

### C016 - sweep diff-type: proceed + escalate

- Inputs: 9D89VM/Before ticket issuance/Sent Payment Link - fee due to CC2C/proceed || AUU84K/Void/Customer requested Supervisor - Escalated/escalate
- Expected c/g/s/e: 1/0/1/2 (rules R3-R5)
- Actual c/g/s/e: 1/0/1/2, guard_blocked=no, unresolved=0
- Invariant: internal note is missing the per-PNR bucket row

### C017 - sweep same-type/diff-action: proceed + different_request

- Inputs: 9D89VM/Before ticket issuance/Sent Payment Link - fee due to CC2C/proceed || AUU84K/Before ticket issuance/Different request/different_request
- Expected c/g/s/e: 1/0/1/2 (rules R3-R5)
- Actual c/g/s/e: 1/0/1/2, guard_blocked=no, unresolved=0
- Invariant: internal note is missing the per-PNR bucket row

### C018 - sweep diff-type: proceed + different_request

- Inputs: 9D89VM/Before ticket issuance/Sent Payment Link - fee due to CC2C/proceed || AUU84K/Void/Different request/different_request
- Expected c/g/s/e: 1/0/1/2 (rules R3-R5)
- Actual c/g/s/e: 1/0/1/2, guard_blocked=no, unresolved=0
- Invariant: internal note is missing the per-PNR bucket row

### C019 - sweep same-type/diff-action: no_action + proceed

- Inputs: 9D89VM/Before ticket issuance/Do not proceed/no_action || AUU84K/Before ticket issuance/Sent Payment Link - fee due to CC2C/proceed
- Expected c/g/s/e: 1/0/1/2 (rules R3-R5)
- Actual c/g/s/e: 1/0/1/2, guard_blocked=no, unresolved=0
- Invariant: internal note is missing the per-PNR bucket row

### C020 - sweep diff-type: no_action + proceed

- Inputs: 9D89VM/Before ticket issuance/Do not proceed/no_action || AUU84K/Void/Void completed/proceed
- Expected c/g/s/e: 1/0/1/2 (rules R3-R5)
- Actual c/g/s/e: 1/0/1/2, guard_blocked=no, unresolved=0
- Invariant: internal note is missing the per-PNR bucket row

### C021 - sweep same-type/diff-action: no_action + no_action

- Inputs: 9D89VM/Before ticket issuance/Do not proceed/no_action || AUU84K/Before ticket issuance/Interaction disconnected - no response/no_action
- Expected c/g/s/e: 0/0/2/2 (rules R3-R5)
- Actual c/g/s/e: 0/0/2/2, guard_blocked=no, unresolved=0
- Invariant: internal note is missing the per-PNR bucket row

### C022 - sweep diff-type: no_action + no_action

- Inputs: 9D89VM/Before ticket issuance/Do not proceed/no_action || AUU84K/Void/Do not proceed/no_action
- Expected c/g/s/e: 0/0/2/2 (rules R3-R5)
- Actual c/g/s/e: 0/0/2/2, guard_blocked=no, unresolved=0
- Invariant: internal note is missing the per-PNR bucket row

### C023 - sweep same-type/same-action: no_action x2

- Inputs: 9D89VM/Before ticket issuance/Do not proceed/no_action || AUU84K/Before ticket issuance/Do not proceed/no_action
- Expected c/g/s/e: 0/0/1/1 (rules R3-R5)
- Actual c/g/s/e: 0/0/1/1, guard_blocked=no, unresolved=0
- Invariant: internal note is missing the per-PNR bucket row

### C024 - sweep same-type/diff-action: no_action + escalate

- Inputs: 9D89VM/Before ticket issuance/Do not proceed/no_action || AUU84K/Before ticket issuance/Customer language issue - transferred/escalate
- Expected c/g/s/e: 0/0/2/2 (rules R3-R5)
- Actual c/g/s/e: 0/0/2/2, guard_blocked=no, unresolved=0
- Invariant: internal note is missing the per-PNR bucket row

### C025 - sweep diff-type: no_action + escalate

- Inputs: 9D89VM/Before ticket issuance/Do not proceed/no_action || AUU84K/Void/Customer requested Supervisor - Escalated/escalate
- Expected c/g/s/e: 0/0/2/2 (rules R3-R5)
- Actual c/g/s/e: 0/0/2/2, guard_blocked=no, unresolved=0
- Invariant: internal note is missing the per-PNR bucket row

### C026 - sweep same-type/diff-action: no_action + different_request

- Inputs: 9D89VM/Before ticket issuance/Do not proceed/no_action || AUU84K/Before ticket issuance/Different request/different_request
- Expected c/g/s/e: 0/0/2/2 (rules R3-R5)
- Actual c/g/s/e: 0/0/2/2, guard_blocked=no, unresolved=0
- Invariant: internal note is missing the per-PNR bucket row

### C027 - sweep diff-type: no_action + different_request

- Inputs: 9D89VM/Before ticket issuance/Do not proceed/no_action || AUU84K/Void/Different request/different_request
- Expected c/g/s/e: 0/0/2/2 (rules R3-R5)
- Actual c/g/s/e: 0/0/2/2, guard_blocked=no, unresolved=0
- Invariant: internal note is missing the per-PNR bucket row

### C028 - sweep same-type/diff-action: escalate + proceed

- Inputs: 9D89VM/Before ticket issuance/Customer language issue - transferred/escalate || AUU84K/Before ticket issuance/Sent Payment Link - fee due to CC2C/proceed
- Expected c/g/s/e: 1/0/1/2 (rules R3-R5)
- Actual c/g/s/e: 1/0/1/2, guard_blocked=no, unresolved=0
- Invariant: internal note is missing the per-PNR bucket row

### C029 - sweep diff-type: escalate + proceed

- Inputs: 9D89VM/Before ticket issuance/Customer language issue - transferred/escalate || AUU84K/Void/Void completed/proceed
- Expected c/g/s/e: 1/0/1/2 (rules R3-R5)
- Actual c/g/s/e: 1/0/1/2, guard_blocked=no, unresolved=0
- Invariant: internal note is missing the per-PNR bucket row

### C030 - sweep same-type/diff-action: escalate + no_action

- Inputs: 9D89VM/Before ticket issuance/Customer language issue - transferred/escalate || AUU84K/Before ticket issuance/Do not proceed/no_action
- Expected c/g/s/e: 0/0/2/2 (rules R3-R5)
- Actual c/g/s/e: 0/0/2/2, guard_blocked=no, unresolved=0
- Invariant: internal note is missing the per-PNR bucket row

### C031 - sweep diff-type: escalate + no_action

- Inputs: 9D89VM/Before ticket issuance/Customer language issue - transferred/escalate || AUU84K/Void/Do not proceed/no_action
- Expected c/g/s/e: 0/0/2/2 (rules R3-R5)
- Actual c/g/s/e: 0/0/2/2, guard_blocked=no, unresolved=0
- Invariant: internal note is missing the per-PNR bucket row

### C032 - sweep same-type/diff-action: escalate + escalate

- Inputs: 9D89VM/Before ticket issuance/Customer language issue - transferred/escalate || AUU84K/Before ticket issuance/Customer requested Supervisor - Escalated/escalate
- Expected c/g/s/e: 0/0/2/2 (rules R3-R5)
- Actual c/g/s/e: 0/0/2/2, guard_blocked=no, unresolved=0
- Invariant: internal note is missing the per-PNR bucket row

### C033 - sweep diff-type: escalate + escalate

- Inputs: 9D89VM/Before ticket issuance/Customer language issue - transferred/escalate || AUU84K/Void/Customer requested Supervisor - Escalated/escalate
- Expected c/g/s/e: 0/0/2/2 (rules R3-R5)
- Actual c/g/s/e: 0/0/2/2, guard_blocked=no, unresolved=0
- Invariant: internal note is missing the per-PNR bucket row

### C034 - sweep same-type/same-action: escalate x2

- Inputs: 9D89VM/Before ticket issuance/Customer language issue - transferred/escalate || AUU84K/Before ticket issuance/Customer language issue - transferred/escalate
- Expected c/g/s/e: 0/0/1/1 (rules R3-R5)
- Actual c/g/s/e: 0/0/1/1, guard_blocked=no, unresolved=0
- Invariant: internal note is missing the per-PNR bucket row

### C035 - sweep same-type/diff-action: escalate + different_request

- Inputs: 9D89VM/Before ticket issuance/Customer language issue - transferred/escalate || AUU84K/Before ticket issuance/Different request/different_request
- Expected c/g/s/e: 0/0/2/2 (rules R3-R5)
- Actual c/g/s/e: 0/0/2/2, guard_blocked=no, unresolved=0
- Invariant: internal note is missing the per-PNR bucket row

### C036 - sweep diff-type: escalate + different_request

- Inputs: 9D89VM/Before ticket issuance/Customer language issue - transferred/escalate || AUU84K/Void/Different request/different_request
- Expected c/g/s/e: 0/0/2/2 (rules R3-R5)
- Actual c/g/s/e: 0/0/2/2, guard_blocked=no, unresolved=0
- Invariant: internal note is missing the per-PNR bucket row

### C037 - sweep same-type/diff-action: different_request + proceed

- Inputs: 9D89VM/Before ticket issuance/Different request/different_request || AUU84K/Before ticket issuance/Sent Payment Link - fee due to CC2C/proceed
- Expected c/g/s/e: 1/0/1/2 (rules R3-R5)
- Actual c/g/s/e: 1/0/1/2, guard_blocked=no, unresolved=0
- Invariant: internal note is missing the per-PNR bucket row

### C038 - sweep diff-type: different_request + proceed

- Inputs: 9D89VM/Before ticket issuance/Different request/different_request || AUU84K/Void/Void completed/proceed
- Expected c/g/s/e: 1/0/1/2 (rules R3-R5)
- Actual c/g/s/e: 1/0/1/2, guard_blocked=no, unresolved=0
- Invariant: internal note is missing the per-PNR bucket row

### C039 - sweep same-type/diff-action: different_request + no_action

- Inputs: 9D89VM/Before ticket issuance/Different request/different_request || AUU84K/Before ticket issuance/Do not proceed/no_action
- Expected c/g/s/e: 0/0/2/2 (rules R3-R5)
- Actual c/g/s/e: 0/0/2/2, guard_blocked=no, unresolved=0
- Invariant: internal note is missing the per-PNR bucket row

### C040 - sweep diff-type: different_request + no_action

- Inputs: 9D89VM/Before ticket issuance/Different request/different_request || AUU84K/Void/Do not proceed/no_action
- Expected c/g/s/e: 0/0/2/2 (rules R3-R5)
- Actual c/g/s/e: 0/0/2/2, guard_blocked=no, unresolved=0
- Invariant: internal note is missing the per-PNR bucket row

### C041 - sweep same-type/diff-action: different_request + escalate

- Inputs: 9D89VM/Before ticket issuance/Different request/different_request || AUU84K/Before ticket issuance/Customer language issue - transferred/escalate
- Expected c/g/s/e: 0/0/2/2 (rules R3-R5)
- Actual c/g/s/e: 0/0/2/2, guard_blocked=no, unresolved=0
- Invariant: internal note is missing the per-PNR bucket row

### C042 - sweep diff-type: different_request + escalate

- Inputs: 9D89VM/Before ticket issuance/Different request/different_request || AUU84K/Void/Customer requested Supervisor - Escalated/escalate
- Expected c/g/s/e: 0/0/2/2 (rules R3-R5)
- Actual c/g/s/e: 0/0/2/2, guard_blocked=no, unresolved=0
- Invariant: internal note is missing the per-PNR bucket row

### C043 - sweep diff-type: different_request + different_request

- Inputs: 9D89VM/Before ticket issuance/Different request/different_request || AUU84K/Void/Different request/different_request
- Expected c/g/s/e: 0/0/2/2 (rules R3-R5)
- Actual c/g/s/e: 0/0/2/2, guard_blocked=no, unresolved=0
- Invariant: internal note is missing the per-PNR bucket row

### C044 - sweep same-type/same-action: different_request x2

- Inputs: 9D89VM/Before ticket issuance/Different request/different_request || AUU84K/Before ticket issuance/Different request/different_request
- Expected c/g/s/e: 0/0/1/1 (rules R3-R5)
- Actual c/g/s/e: 0/0/1/1, guard_blocked=no, unresolved=0
- Invariant: internal note is missing the per-PNR bucket row

### C045 - single PNR: one PNR, proceed

- Inputs: 9D89VM/Before ticket issuance/Sent Payment Link - fee due to CC2C/proceed
- Expected c/g/s/e: 1/0/0/1 (rules R3-R5)
- Actual c/g/s/e: 1/0/0/1, guard_blocked=no, unresolved=0
- Invariant: internal note is missing the per-PNR bucket row

### C046 - single PNR: one PNR, no_action

- Inputs: 9D89VM/Before ticket issuance/Do not proceed/no_action
- Expected c/g/s/e: 0/0/1/1 (rules R3-R5)
- Actual c/g/s/e: 0/0/1/1, guard_blocked=no, unresolved=0
- Invariant: internal note is missing the per-PNR bucket row

### C047 - single PNR: one PNR, escalate

- Inputs: 9D89VM/Before ticket issuance/Customer language issue - transferred/escalate
- Expected c/g/s/e: 0/0/1/1 (rules R3-R5)
- Actual c/g/s/e: 0/0/1/1, guard_blocked=no, unresolved=0
- Invariant: internal note is missing the per-PNR bucket row

### C048 - single PNR: one PNR, different_request

- Inputs: 9D89VM/Before ticket issuance/Different request/different_request
- Expected c/g/s/e: 0/0/1/1 (rules R3-R5)
- Actual c/g/s/e: 0/0/1/1, guard_blocked=no, unresolved=0
- Invariant: internal note is missing the per-PNR bucket row

### C049 - 3 PNRs: 3 proceed, 2 distinct combos

- Inputs: 9D89VM/Before ticket issuance/Cancellation completed - Sent for refund/proceed || AUU84K/Before ticket issuance/Cancellation completed - Sent for refund/proceed || XX111X/Void/Void completed/proceed
- Expected c/g/s/e: 1/2/0/2 (rules R3-R5)
- Actual c/g/s/e: 1/2/0/2, guard_blocked=no, unresolved=0
- Invariant: internal note is missing the per-PNR bucket row

### C050 - 3 PNRs: 2 proceed + 1 do-not-proceed

- Inputs: 9D89VM/Before ticket issuance/Cancellation completed - Sent for refund/proceed || AUU84K/Before ticket issuance/Sent Payment Link - fee due to CC2C/proceed || XX111X/Before ticket issuance/Do not proceed/no_action
- Expected c/g/s/e: 1/2/1/3 (rules R3-R5)
- Actual c/g/s/e: 1/2/1/3, guard_blocked=no, unresolved=0
- Invariant: internal note is missing the per-PNR bucket row

### C051 - 3 PNRs: 3 do-not-proceed, 3 distinct combos

- Inputs: 9D89VM/Before ticket issuance/Do not proceed/no_action || AUU84K/Before ticket issuance/Interaction disconnected - no response/no_action || XX111X/Void/Do not proceed/no_action
- Expected c/g/s/e: 0/0/3/3 (rules R3-R5)
- Actual c/g/s/e: 0/0/3/3, guard_blocked=no, unresolved=0
- Invariant: internal note is missing the per-PNR bucket row

### C052 - 3 PNRs: 1 proceed + 1 escalate + 1 different_request

- Inputs: 9D89VM/Before ticket issuance/Cancellation completed - Sent for refund/proceed || AUU84K/Before ticket issuance/Customer requested Supervisor - Escalated/escalate || XX111X/Before ticket issuance/Different request/different_request
- Expected c/g/s/e: 1/0/2/3 (rules R3-R5)
- Actual c/g/s/e: 1/0/2/3, guard_blocked=no, unresolved=0
- Invariant: internal note is missing the per-PNR bucket row

### C053 - failure mode: Neither selection posted (ZD 334703 repro)

- Inputs: 9D89VM/Before ticket issuance/Cancellation completed - Sent for refund/proceed [lost] || AUU84K/Void/Void completed/proceed [lost]
- Expected c/g/s/e: 0/0/0/0 (R1/R2: 2 action selection(s) unreadable - run is invalid, agent must re-run)
- Actual c/g/s/e: 0/0/0/0, guard_blocked=no, unresolved=2
- Invariant: problem run not blocked by the guard
- The live 334703 run: both actions picked, node 27 read nothing.

### C054 - failure mode: One selection posted, one lost

- Inputs: 9D89VM/Before ticket issuance/Cancellation completed - Sent for refund/proceed || AUU84K/Void/Void completed/proceed [lost]
- Expected c/g/s/e: 0/0/0/0 (R1/R2: 1 action selection(s) unreadable - run is invalid, agent must re-run)
- Actual c/g/s/e: 1/0/0/1, guard_blocked=no, unresolved=1
- Invariant: problem run not blocked by the guard

### C055 - failure mode: Legacy submit: display name instead of action id

- Inputs: 9D89VM/Before ticket issuance/Cancellation completed - Sent for refund/proceed || AUU84K/Void/Void completed/proceed
- Expected c/g/s/e: 1/2/0/2 (rules R3-R5)
- Actual c/g/s/e: 1/2/0/2, guard_blocked=no, unresolved=0
- Invariant: internal note is missing the per-PNR bucket row
- node 27's tolerant name fallback should resolve these.

### C056 - failure mode: Stale submit: an action id from another type

- Inputs: 9D89VM/Before ticket issuance/Cancellation completed - Sent for refund/proceed [lost] || AUU84K/Void/Void completed/proceed
- Expected c/g/s/e: 0/0/0/0 (R1/R2: 1 action selection(s) unreadable - run is invalid, agent must re-run)
- Actual c/g/s/e: 1/0/0/1, guard_blocked=no, unresolved=1
- Invariant: problem run not blocked by the guard

### C057 - failure mode: bucket arrives as {code:'proceed'}

- Inputs: 9D89VM/Before ticket issuance/Cancellation completed - Sent for refund/proceed || AUU84K/Void/Void completed/proceed
- Expected c/g/s/e: 1/2/0/2 (rules R3-R5)
- Actual c/g/s/e: 1/2/0/2, guard_blocked=no, unresolved=0
- Invariant: internal note is missing the per-PNR bucket row

### C058 - failure mode: bucket arrives in a shape nothing can read

- Inputs: 9D89VM/Before ticket issuance/Cancellation completed - Sent for refund/(blank) || AUU84K/Void/Void completed/proceed
- Expected c/g/s/e: 0/0/0/0 (R1/R2: 1 PNR(s) carry an unrecognized bucket - run is invalid)
- Actual c/g/s/e: 1/0/0/1, guard_blocked=no, unresolved=1
- Invariant: problem run not blocked by the guard

### C059 - failure mode: bucket is a string nobody routes on ('pending')

- Inputs: 9D89VM/Before ticket issuance/Cancellation completed - Sent for refund/pending || AUU84K/Void/Void completed/proceed
- Expected c/g/s/e: 0/0/0/0 (R1/R2: 1 PNR(s) carry an unrecognized bucket - run is invalid)
- Actual c/g/s/e: 1/0/1/2, guard_blocked=no, unresolved=0
- Invariant: problem run not flagged | problem run not blocked by the guard

### C060 - failure mode: bucket arrives capitalized ('Proceed')

- Inputs: 9D89VM/Before ticket issuance/Cancellation completed - Sent for refund/Proceed || AUU84K/Void/Void completed/proceed
- Expected c/g/s/e: 1/2/0/2 (rules R3-R5)
- Actual c/g/s/e: 1/2/0/2, guard_blocked=no, unresolved=0
- Invariant: internal note is missing the per-PNR bucket row

### C061 - failure mode: bucket arrives padded (' proceed ')

- Inputs: 9D89VM/Before ticket issuance/Cancellation completed - Sent for refund/ proceed  || AUU84K/Void/Void completed/proceed
- Expected c/g/s/e: 1/2/0/2 (rules R3-R5)
- Actual c/g/s/e: 1/2/0/2, guard_blocked=no, unresolved=0
- Invariant: internal note is missing the per-PNR bucket row

### C062 - failure mode: PNR with a regex-unsafe character

- Inputs: 9D/89VM/Before ticket issuance/Cancellation completed - Sent for refund/proceed || AUU84K/Void/Void completed/proceed
- Expected c/g/s/e: 1/2/0/2 (rules R3-R5)
- Actual c/g/s/e: 1/2/0/2, guard_blocked=no, unresolved=0
- Invariant: internal note is missing the per-PNR bucket row
- nodes 12 and 27 must sanitize identically.

### C063 - failure mode: Same PNR twice (node 2 upsert)

- Inputs: 9D89VM/Before ticket issuance/Sent Payment Link - fee due to CC2C/proceed
- Expected c/g/s/e: 1/0/0/1 (rules R3-R5)
- Actual c/g/s/e: 1/0/0/1, guard_blocked=no, unresolved=0
- Invariant: internal note is missing the per-PNR bucket row
- node 2 upserts by pnr, so the second overwrites the first.

### C064 - failure mode: Child-ticket create fails at Zendesk

- Inputs: 9D89VM/Before ticket issuance/Cancellation completed - Sent for refund/proceed || AUU84K/Void/Void completed/proceed
- Expected c/g/s/e: 1/2/0/2 (rules R3-R5)
- Actual c/g/s/e: 1/2/0/2, guard_blocked=no, unresolved=0
- Invariant: internal note is missing the per-PNR bucket row | failed create not surfaced in the note
- note must not silently promise a ticket Zendesk never confirmed (ZD 334468).

### C065 - re-entry: Clean 2-PNR pass, then node 27 re-entered with nothing re-picked

- Inputs: 9D89VM/Before ticket issuance/Cancellation completed - Sent for refund/proceed || AUU84K/Void/Void completed/proceed
- Expected c/g/s/e: 1/2/0/2 (rules R3-R5)
- Actual c/g/s/e: 1/2/0/2, guard_blocked=no, unresolved=0
- Invariant: internal note is missing the per-PNR bucket row
- v29 flagged BOTH PNRs lookup_failed here - node 27 had stripped actions_array off its own output.

### C066 - re-entry: Clean 2-PNR pass, then re-entered twice

- Inputs: 9D89VM/Before ticket issuance/Cancellation completed - Sent for refund/proceed || AUU84K/Void/Void completed/proceed
- Expected c/g/s/e: 1/2/0/2 (rules R3-R5)
- Actual c/g/s/e: 1/2/0/2, guard_blocked=no, unresolved=0
- Invariant: internal note is missing the per-PNR bucket row

### C067 - re-entry: Clean single-PNR pass, then re-entered

- Inputs: 9D89VM/Before ticket issuance/Cancellation completed - Sent for refund/proceed
- Expected c/g/s/e: 1/0/0/1 (rules R3-R5)
- Actual c/g/s/e: 1/0/0/1, guard_blocked=no, unresolved=0
- Invariant: internal note is missing the per-PNR bucket row

### C068 - re-entry: Mixed proceed + do-not-proceed, then re-entered

- Inputs: 9D89VM/Before ticket issuance/Cancellation completed - Sent for refund/proceed || AUU84K/Before ticket issuance/Do not proceed/no_action
- Expected c/g/s/e: 1/0/1/2 (rules R3-R5)
- Actual c/g/s/e: 1/0/1/2, guard_blocked=no, unresolved=0
- Invariant: internal note is missing the per-PNR bucket row
- the silent-ticket branch must survive re-entry too.

### C069 - re-entry: 3 PNRs, 2 distinct combos, then re-entered

- Inputs: 9D89VM/Before ticket issuance/Cancellation completed - Sent for refund/proceed || AUU84K/Before ticket issuance/Cancellation completed - Sent for refund/proceed || XX111X/Void/Void completed/proceed
- Expected c/g/s/e: 1/2/0/2 (rules R3-R5)
- Actual c/g/s/e: 1/2/0/2, guard_blocked=no, unresolved=0
- Invariant: internal note is missing the per-PNR bucket row

### C070 - re-entry: Clean pass, then the agent re-picks one PNR to a different action

- Inputs: 9D89VM/Before ticket issuance/Sent Payment Link - fee due to CC2C/proceed || AUU84K/Void/Void completed/proceed
- Expected c/g/s/e: 1/2/0/2 (rules R3-R5)
- Actual c/g/s/e: 1/2/0/2, guard_blocked=no, unresolved=0
- Invariant: internal note is missing the per-PNR bucket row
- the fresh form read must WIN over the stored resolution, or a re-pick is silently ignored.

### C071 - re-entry: Clean pass, then the agent re-picks a PNR from proceed to do-not-proceed

- Inputs: 9D89VM/Before ticket issuance/Do not proceed/no_action || AUU84K/Void/Void completed/proceed
- Expected c/g/s/e: 1/0/1/2 (rules R3-R5)
- Actual c/g/s/e: 1/0/1/2, guard_blocked=no, unresolved=0
- Invariant: internal note is missing the per-PNR bucket row
- the riskiest re-pick: it must not keep recording the proceed outcome.

### C072 - re-entry: One selection lost, then the agent re-picks it on the node 51 -> 12 round trip

- Inputs: 9D89VM/Before ticket issuance/Cancellation completed - Sent for refund/proceed || AUU84K/Void/Void completed/proceed
- Expected c/g/s/e: 1/2/0/2 (rules R3-R5)
- Actual c/g/s/e: 1/0/0/1, guard_blocked=no, unresolved=0
- Invariant: internal note is missing the per-PNR bucket row | internal note omits PNR AUU84K
- the re-select loop must be escapable - v29 rendered an empty dropdown here.

### C073 - re-entry: One selection lost and still not posted on the re-pick

- Inputs: 9D89VM/Before ticket issuance/Cancellation completed - Sent for refund/proceed || AUU84K/Void/Void completed/proceed [lost]
- Expected c/g/s/e: 0/0/0/0 (R1/R2: 1 action selection(s) unreadable - run is invalid, agent must re-run)
- Actual c/g/s/e: 1/0/0/1, guard_blocked=no, unresolved=0
- Invariant: problem run not flagged | problem run not blocked by the guard
- must STAY flagged and blocked - the stored-resolution fallback must not paper over a real failure.

### C074 - re-entry: Both selections lost, then re-entered

- Inputs: 9D89VM/Before ticket issuance/Cancellation completed - Sent for refund/proceed [lost] || AUU84K/Void/Void completed/proceed [lost]
- Expected c/g/s/e: 0/0/0/0 (R1/R2: 2 action selection(s) unreadable - run is invalid, agent must re-run)
- Actual c/g/s/e: 0/0/0/0, guard_blocked=no, unresolved=0
- Invariant: problem run not flagged | problem run not blocked by the guard
- nothing was ever resolved, so there is no state to fall back on - still blocked.

