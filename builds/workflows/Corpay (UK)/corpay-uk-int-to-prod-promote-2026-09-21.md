# Corpay UK (Allstar) — INT → PROD promote, 2026-09-21

**Source** `Email Automation - AI Actions INT (export 2026-09-21).json` — tree 109029630, org 123,
51 nodes, 24 predefined vars, last modified 2026-09-18 13:34:42.
**Output** `Email Automation - AI Actions Prod (promote 2026-09-21).json` — retargeted at tree
**417189428**, renamed *Email Automation - AI Actions Prod*, org_id and root node unchanged (123 / 2).

Produced with `corpay_uk_env_check.py promote --from eu --to eu_prod`. Not hand-edited except for the
two changes recorded under "Homecharge" below, both asserted in the verification run.

## Ids remapped

| Node | Asset | INT | PROD | Type |
|---|---|---|---|---|
| 2  | case + inbound email | CO 10 `sfdc_int__case_email_ai` | CO **22** `get_case_details__prod` | salesforce |
| 5  | account details | CO 20 `get_account_details__int` | CO **21** `get_account_details__prod` | salesforce |
| 35 | incoming email addresses | CO 23 `get_incoming_email_addresses_int` | CO **24** `get_incoming_email_addresses_prod` | salesforce |
| 38 | send email (composite) | CO 187 `send_email_simple_int` | CO **203** `send_email_simple_prod` | http |
| 12 | FAST Admin intent | AI 16 `automate_email_intent_int` | AI **13** `automate_email_responses` | — |
| 16 | FAST Admin generation | AI 15 `automate_email_generation_int` | AI **12** `automate_email_generation` | — |
| 18 | Homecharge intent | AI 19 `automate_hc_email_intent_int` | AI **13** (stand-in, lane closed) | — |
| 25 | Homecharge generation | AI 18 `automate_hc_email_generation_int` | AI **12** (stand-in, lane closed) | — |

All 24 `predefined_vars` repointed at 417189428. Zero `_int` aliases remain anywhere in the file.

## Homecharge — closed at the router for this release

Prod has no Homecharge AI Actions, and this release carries no Homecharge use cases. Rather than
leave the lane wired to a stand-in, router **node 10's `queue_route == "homecharge"` button now goes
to node 11 ("Queue not in scope") instead of node 18**. A Homecharge case is handed to the agent to
work manually; no AI reply is generated for it.

This matters because nothing in the tree decides whether Homecharge cases arrive — node 8 maps
`Last_Owner_Queue_Name__c` (`Allstar_Chargepass` → `homecharge`), so that is Salesforce queue routing.
Closing the lane at 10 means a misrouted case cannot be answered with a FAST Admin prompt.

Nodes **18–26** are now unreachable as a clean block; nothing on the FAST Admin path dropped out.
Node 49 (the provider-picklist router on the shared path) always takes its default to 31 while
`queue_route` can never be `homecharge` at that point — no change needed, and it self-restores.

**To reopen Homecharge:** create the two AI Actions in org 123 with aliases
`automate_hc_email_intent_prod` and `automate_hc_email_generation_prod`, put their ids in the
manifest's `eu_prod.ai_actions`, drop the `ai_action_placeholders` entries, point node 10's
homecharge button back at 18, and re-promote. Nothing else changes.

One changelog line was appended to node 48's claude.md. Its architecture prose and id table were not
touched — after the alias rename the prose reads prod while the id table still reads INT. Expected.

## Verification — 47 checks, 0 failures

- `check --env eu` on the source: clean. `check --env eu_prod` on the output: clean.
- `diff` source vs output: exactly the 8 id changes above, nothing else.
- Structural node diff: zero unexpected changes beyond the alias swap, node 10's button and node 48's
  changelog line.
- All four Data nodes carry the prod CO id, the right type and org 123.
- All four AI Action nodes carry a non-zero id; `config` is the JSON **string** `{"mode":"api","instruction":""}`.
- Every `button_link` / `continuation_node_id` resolves; no dangling edges.
- Unreachable from root 2: 1 (Start), 18–26 (HC lane, intentional), 44–47 (Test Mode), 48 (claude.md).
- All 11 Scoring nodes keep `advanced_logic_node: "1"` and an empty-expression `op: "def"` last button.
- Top-level scalars are strings, as a genuine Zingtree export has them.

Test Mode ships intact — picker, example emails, `setResponseData` seeds. QA opens it at
`https://eu.zingtree.com/preview/417189428#44`. The `test_hc_*` scenarios will now land on
"Queue not in scope", which is correct for this release.

## Open before import — two pre-flight items I could not clear

1. **No rollback export of live tree 417189428 exists on disk.** The only prod-side file here is the
   2026-09-17 dry-run output, which is generated, not an export. Export the live tree and keep the
   file before importing over it.
2. **CO 22's SELECT list is unverified.** Prod's case object was built for GT's old tree, which read
   only `AccountId` and `SuppliedEmail`. This tree reads thirteen fields off `records[0]`:
   `AccountId`, `Account`, `SuppliedEmail`, `Origin`, `Business_Process__c`,
   `Initial_Case_Queue_Name__c`, `Last_Owner_Queue_Name__c`, `Topic__c`, `Sub_Topic__c`,
   `Description`, `ContactId`, `Energy_Provider__c`, `Data_Provider__c`. Missing
   `Last_Owner_Queue_Name__c` sends every live case to "Queue not in scope"; missing
   `Energy_Provider__c` / `Data_Provider__c` breaks the provider picklists on node 50/51. Open CO 22
   in Zingtree, read the SOQL, add what is missing before importing.

Also worth a look while you are in there: CO 203's payload template must match what node 36 stages
(`caseId`, `caseFields`, `inputs[0]` with `emailAddresses` / `ccAddresses`); CO 21 must return
`Framework__c`, `Account_Segment__c`, `AS_Account_Administrator__c`; CO 24 must return `CcAddress`.
All three matched as of 2026-09-17.

## After import

Confirm all 24 predefined variables are listed on the prod tree. Then run
`test_fast_admin_active_card_list` from the Test Mode picker and a real case end to end — static
checks cannot catch a swapped AI Action id, since both ids are valid and both nodes run. The symptom
would be a script error at node 13 reading `email_intent` off `undefined`.

The live import and the customer-facing test are yours to call.
