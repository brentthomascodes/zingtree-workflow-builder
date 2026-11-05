# Post Collection Flow — CR-002 build diff (2026-09-17)

**Tree:** Post Collection Flow, export `173598167` (live tree is `458535399`)
**Baseline:** `Post Collection Flow (BEFORE baseline 2026-09-17).json` — from `Selected_from_Quest Diagnostics 11_2026-09-17.json`, last modified 2026-09-08
**Output:** `Post Collection Flow (CR-002 conditionals + free-text times, 2026-09-17).json`
**Requirements:** `Zingtree Builder/Requirements/Quest Diagnostics/post-collection-flow-requirements.md` → CR-002
**Status:** Built, Stage A passed, **pending Brent's approval + teammate review** (PII/PHI tree — not imported live)

---

## Edits applied

| # | Node | Change | Req |
| :-- | :-- | :-- | :-- |
| 1 | 910 | `sf_DER_Notified__c` — removed `Positive BAT == Yes` conditional | R14 |
| 2 | 910 | `DER_Notified_Date_and_Time__c` — removed same conditional | R14 |
| 3 | 910 | `sf_Paperwork_Sent_Date_Time__c` — removed `Paperwork Sent == Yes` conditional | R17 |
| 4 | 910 | `sf_BAT_Collection_Time_Actual__c` — select (96 options) → text, help `e.g. 2:04 PM` | R16 |
| 5 | 910 | `sf_Collector_Arrival_Time_Actual__c` — same | R16 |
| 6 | 910 | `sf_End_Time_Actual__c` — same | R16 |
| 7 | 910 | `sf_BAT_Confirmation_Time_Actual__c` — same; **positive-BAT conditional kept** | R16 / Q5 |
| 8 | 913 | `toSalesforceTime()` hardened for free-typed input | R16 |
| 9 | 913 | DER date/time captured to `_display`, blanked before Connected Object 447 | R13 (deferred) |
| 10 | `script_code` | Recap row for DER now reads `DER_Notified_Date_and_Time__c_display` | R13 (deferred) |
| 11 | 914 | `claude.md` node updated — field list, time-conversion section, new DER WITHHOLDING section, changelog | house rule |

## Not changed, deliberately

- **Field order and the two-column pairing.** CR-007 (2026-09-03) already built Chris's layout from his whiteboard photo, and the spreadsheet he re-sent on 9/15 is the same layout. R12 needed no edit. The grid is produced by project-level `script_code` pairing fields in **rank order**, not by `form_columns` — so reordering silently re-pairs the whole form and desynchronises the node 912 recap. Left alone.
- **Every `required` flag.** Chris's "Make mandatory to fill all of the sections?" is still unanswered (open since 2026-08-20).
- **CR-001 R8** (remove duplicate `sf_Test_Number__c`) — already done in CR-007.

## The DER field — unfinished work, not a design choice

Salesforce stores the DER notification as **two** fields (a Date and a Time). This form captures one free-text value, so sending it fails serialization on Connected Object 447 — and one failed field fails the **entire** payload. That is the root cause of every "nothing posts to Salesforce" report from 2026-08-20 through 2026-09-15, and why removing the field live on the 9/15 call made BAT results, collection time, ATF # and CCF # all start populating.

This build withholds the value rather than splitting it, per Brent's call to get the business logic working first. The collector still fills the field and the recap still shows it; Salesforce does not receive it.

**To finish (CR-002 R13):** get the two Salesforce API names, then replace the withholding block in node 913 with a split — date to the SF date field's variable, time through `toSalesforceTime()` to the SF time field's variable.

**Watch:** `sf_Paperwork_Sent_Date_Time__c` is very likely the same shape, and edit 3 just made it always visible, so collectors will start filling it. If it also splits, it becomes the next payload-killer (CR-002 Q10).

---

## Stage A results

**Static — 27/27 passed.** Standalone project shape per the tree's own IMPORT NOTE (not wrapped in `projects`); node set, routing `910 → 913 → 911 → 912`, Connected Object 447, and the `claude.md` node all intact; field order, ranks and labels unchanged; exactly the four confirmation fields remain conditional; no `required` flag moved.

**Time parser — 21/21 passed**, replayed verbatim from node 913:

| Input | Output | Covers |
| :-- | :-- | :-- |
| `2:04 PM` | `14:04:00.000Z` | AC-16.1, Chris's example |
| `14:04` | `14:04:00.000Z` | AC-16.2 |
| `2:04pm` · `02:04 PM` · `2:04 p.m.` · `2 PM` | `14:04` / `14:00` | free-text tolerance |
| `12:00 AM` · `12:15 PM` · `11:45 PM` | `00:00` / `12:15` / `23:45` | midnight & noon boundaries |
| `09:07` | `09:07:00.000Z` | AC-16.4, off the 15-minute grid |
| `2:04` | `02:04:00.000Z` | A3 — read as 24-hour, never assumed PM |
| `this afternoon` · `25:00` · `2:75 PM` · `13:00 PM` | `""` | AC-16.3 — empty, never a guess |
| `""` · `"   "` | `""` | AC-13.4 |
| `01:00:00.000Z` | unchanged | idempotent on re-submit |

`2:04` resolving to 02:04 rather than 14:04 is deliberate. Assuming PM can misstate a legally-reportable time by twelve hours, and the help text prompts the meridiem. Confirm with Chris (Q6).

## Stage B — not run

Browser UI testing in the Zingtree app is attended. Say the word and I'll drive it.

## Before this goes live

1. Brent's approval of this JSON, plus teammate review (PII/PHI policy).
2. Import is the gated step — nothing has been pushed to `458535399`.
3. End-to-end sandbox submit. R13's whole history is a tree that looked structurally correct while one value failed the request; static analysis would not have caught it and does not confirm the fix.
