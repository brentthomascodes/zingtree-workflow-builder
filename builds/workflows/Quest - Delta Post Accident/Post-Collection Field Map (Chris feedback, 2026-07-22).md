# Post-Collection Field Map — Chris LeDoux feedback (Quest call 2026-07-22)

Source: "Quest x Zingtree: Delta Workflow" call, 2026-07-22 (Spiky id `57a61c80-9208-42da-b343-0854c1065cd8`).
Speakers: Brent Thomas, Christopher LeDoux (Chris), Emily James, Marcus Torres.

Chris screen-shared a completed collector submission and compared it against what the **Post-Collection Flow** (tree `173598167`, entry node `910`) captures. He called out **eight new fields that are missing and must be represented in the Zingtree workflow**, plus one broken field to fix. Three other items belong to the **Post-Accident tree** (`683028422`), not this flow.

---

## ⭐ THE EIGHT NEW FIELDS (must be added to the Post-Collection Flow)

| # | New field | Type | Proposed SF variable | Notes / verbatim |
|---|---|---|---|---|
| 1 | **Breath alcohol time** | time | `sf_BAT_Time__c` | Chris: *"But it also needs breath alcohol time."* [141] — flagged as the most important missing item |
| 2 | **Time zone** (for the breath alcohol time) | select | `sf_BAT_Time_Zone__c` | Chris: *"And time zone. It's not listed."* [142–143]; *"the only thing that's important is this breath alcohol... time and time zone."* [145–146] |
| 3 | **BAT positive? (yes/no)** | select | `sf_BAT_Positive__c` | Chris: *"the confirmation of if the bat was positive as well needs to be on there... yes or no... if it's yes then the rest of these activate that we need, that is required."* [178–180] — this field gates #4–#6 |
| 4 | **DER notified? (yes/no)** | select | `sf_DER_Notified__c` | Chris: *"a notification of yes or no."* [170–172]; *"did we notify DER?"* [181]. DER = Designated Employee Representative (confirmed by Emily [167]). Shown/required only when #3 = Yes |
| 5 | **DER notify date** | date | `sf_DER_Notify_Date__c` | Chris: *"a day in time that you notify them... if there was like a positive."* [172–173]; *"what time and date did we notify them?"* [182]. Conditional on #3 = Yes |
| 6 | **DER notify time** | time | `sf_DER_Notify_Time__c` | Same source as #5 — Chris asks for both date **and** time. Conditional on #3 = Yes |
| 7 | **Specimen ID / CCF number** | text | `sf_Specimen_ID__c` (aka CCF #) | Chris: *"Another thing that needs to be added... is the specimen ID number... this is the CCF number... It is a specimen. So CCF number used to be added on there."* [222–226] |
| 8 | **"Paperwork sent to Delta" checkbox** | checkbox | `sf_Paperwork_Sent_to_Delta__c` | Chris: *"there's like a check mark saying paperwork sent to Delta for the collector... And that's not on here as well."* [293–295]. Distinct from the existing `additional_paperwork` file upload |

**Conditional logic:** fields **#4, #5, #6** should be shown and required only when **#3 (BAT positive?) = Yes** — Chris: *"if it's yes then the rest of these activate that... is required"* [180]. Use native `config.conditional.simple` keyed on `sf_BAT_Positive__c`.

**Salesforce names are proposals** — confirm the exact API names with Rachel Kendrick before wiring (the Connected Object `447` on node 911 passes variables by exact name match; new SF fields likely need creating in the sandbox first).

---

## Also on the Post-Collection Flow

**Fix (present but broken):** the **Test number** field (`sf_BAT_Test_Number__c`, "Test # on Printout") — value doesn't persist on Next / doesn't reach Salesforce. Chris: *"test number is not appearing on there."* [200]; Brent: *"if you type in there and then press next, it does not update... I will look at that."* [206, 219]

**Already correct (keep):** Arrival Time (`sf_Collector_Arrival_Time_Actual__c`), End Time (`sf_End_Time_Actual__c`), FedEx Tracking # (`sf_FedEx_Tracking_for_ES_24_7__c`), ATF # (`sf_ATF_Number__c`), BAT Results (`sf_BAT_Result__c`), Additional Paperwork file (`additional_paperwork`), Salesforce Event ID (`sf_Id`).

Current node 910 SF write-back path: node **911** (Data / Connected Object `447`, salesforce) auto-passes by name match; node **913** only converts the two time fields to SF time format.

---

## NOT the post-collection flow — Post-Accident tree (683028422)

| Item | Status |
|---|---|
| Damage notes joined by pipe `\|` between multiple damages read awkwardly in the email → change join to a period ("Just a period" [252–253]) | **Open** — small change to today's rebuilt tree (`sf_Additional_Notes__c` join) |
| "How many hours has it been since the incident?" — does nothing, wrong location, not needed [259–272] | ✅ already removed in today's rebuild |
| Email subject "testing required" [275–276] | ✅ already changed in today's rebuild |

---

## Brent's action items from this call
1. Add the **eight new fields** above to the post-collection flow, with the BAT-positive conditional gating DER #4–#6.
2. **Fix** the test-number field not saving/reaching Salesforce.
3. Change damage-notes join from pipe to period (post-accident tree).
4. Confirm exact Salesforce API names for the new fields with Rachel; create them in the sandbox if needed.
5. Deliver before the next sync (Tuesday next week) — Marcus: *"Brent, you have your tasks between now and next week."*
