# ES Event Request Create (intake form) — Requirements

Tree: Quest - ES Event Request Create (MOCK), preview 966502799, org 582102. Creates ES_Event_Request__c (Delta Event Request record type) via Connected Object 505. Baseline: built 2026-10-15 after the Quest x Zingtree Project Sync; behaviour described in the tree's claude.md node.

## Change requests

### CR-001 — Fahim/Chris "ZingTree Observations" (10/28): call details, voicemail, pickers, specimens, supervisor/donor fields

| | |
| :---- | :---- |
| **Date agreed** | 2026-10-29 (Brent, direct) |
| **Source** | Gmail "RE: ZingTree Observations Update" (Chris, 10/28) |
| **Status** | **Built, pending Brent's review** — `Quest - ES Event Request Create (CR-001 call details + specimens, 2026-10-29).json`. Needs CO 505 field mapping added (Brent). |

- **R1** Call Date (date picker) and Call Time captured and written to SF (Brent: pickers, not a timestamp).
- **R2** Voicemail Received Yes/No; Voicemail Received Time when Yes; both written to SF.
- **R3** Date of Incident is a calendar picker; Time of Incident is a selection field (15-minute steps).
- **R4** "(9 digits)" on Supervisor OSM Number and Donor ID.
- **R5** Add Supervisor Job Title and Supervisor Department Number under Supervisor OSM Number; Donor Department Number under Donor Job Title.
- **R6** Specimens Requested captured (SF values: Hair, Phlebotomist Needed - MN Delta, BAT, Urine, Urine - Observation, Instant Urine, Instant Saliva, Saliva (Non-DOT: WA, CA Amazon or Delta LAX)) and written to Type_of_Specimen_Requested__c.
- **R7** What Happened on this form is the single narrative for the event (agent notes boxes removed, Post Accident CR-009).
- Donor Role stays in the Post Accident agent (Brent, 10/29).

**Open questions**
| # | Question | Blocking? | Asked of |
| :---- | :---- | :---- | :---- |
| Q1 | SF types of Voicemail_Received__c / Voicemail_Received_Time__c; is Type_of_Specimen_Requested__c multi-select? | No (CO mapping) | Brent (Object Manager) |
| Q2 | Event number + clickable link on the success screen (10/23 call) | No | Brent |

### CR-002 — 10/29 Project Sync

| | |
| :---- | :---- |
| **Date agreed** | 2026-10-29 (call) |
| **Status** | **Built, pending Brent's review** — `Quest - ES Event Request Create (CR-002 none option + SF button, 2026-10-30).json` |

- **R8** Additional Specimen fields default to "None" (not Hair).
- **R9** After submit, a button opens the new event in Salesforce (no copying the ID).
- **R10 (bug)** Every intake field reaches SF: CO 505 must map the CR-001 fields and the incident time zone.

## Document change log
| Date | Change | By |
| :---- | :---- | :---- |
| 2026-10-29 | Created; CR-001 logged and built | Requirements + build, this session |
| 2026-10-30 | CR-002 logged and built | Requirements + build, this session |

## CR-003 (2026-10-30): Voicemail = No create fix

Found in SF retest: with Voicemail Received = No, CO 505 sent a blank `Voicemail_Received_Time__c` and Salesforce rejected the create (HTTP 400 JSON_PARSER_ERROR, "Cannot deserialize instance of time from VALUE_STRING"). Voicemail = Yes created Event-00215537 (a37WE000003UM9RYAW) with every intake field landing.

- R-CR003-1: Node 2 stages `cr_create_route` = `vm` / `novm` / `invalid`.
- R-CR003-2: Node 9 routes `vm` to node 4 (CO 505), `novm` to new node 11 (CO 507), and everything else to node 3.
- R-CR003-3: CO 507 `create_sf_event_request_novm` is a copy of CO 505 without `Voicemail_Received_Time__c`. Node 5 reads the alias that matches the route.
- R-CR003-4: Voicemail Received Time gets a "Not set" first option, so it no longer defaults to 12:00 AM. Leaving it on Not set when Voicemail = Yes is a validation error.
- R-CR003-5: Retry on the failure screen goes back through the router (node 9).

## CR-004 (2026-11-05): Fahim's 11/4 observations

File: `Quest - ES Event Request Create (CR-004 sections + local incident time, 2026-11-05).json`

- R-CR004-1: Intake split into Quest's sections, one page each: Collection Information (node 1), Onsite Information (node 12), Donor Information + Notes (node 13), then Review. Zingtree has no proven in-form section header, so sections are pages.
- R-CR004-2: "Supervisor" relabelled "Contact" (Contact Name, Contact ID Number (9 digits), Contact Job Title, Contact Department Number). Variable names unchanged.
- R-CR004-3: Flight #, Ship #, Vehicle # added to the Donor page (req_flight / req_ship / req_vehicle). Station dropped.
- R-CR004-4: Time pickers are 5 minutes apart (pending Quest: 1 or 5 minutes).
- R-CR004-5: Time of Incident is saved as entered (no Central conversion). `cr_time_zone_sf` carries the Time_of_Incident_Time_Zone__c picklist value; Arizona maps to MST (no Arizona value in SF). Call and voicemail times stay Central.
- R-CR004-6: Review page uses MM/DD/YYYY and 12-hour times, grouped by section.
- CO changes due at import (not before): CO 505 and 507 Time_of_Incident_Time_Zone__c = `${cr_time_zone_sf}` (was the literal "Central Standard Time (CST)"); add Flight__c = `${req_flight}`, Ship_Number__c = `${req_ship}`, Vehicle_Number__c = `${req_vehicle}`.
- Open: intake specimen picks still cannot reach SF (multi-select); Quest decision pending.

## CR-005 (2026-11-05): Fahim's answers (published)

- 1-minute time steps (legal accuracy). Donor Role (required) under Donor ID; Donor Job Title shows only when Role = Other. SF has no role field: Donor_Job_Title__c = role, or the typed title when Other (`cr_donor_job_title`).
- "+ Add Secondary Contact" (No/Yes) on Onsite shows name/phone/email (`cr_secondary_*`).
- CO 505 + 507 updated at publish: Time_of_Incident_Time_Zone__c = ${cr_time_zone_sf}; Donor_Job_Title__c = ${cr_donor_job_title}; Flight__c, Ship_Number__c, Vehicle_Number__c; Scondary_Contact_Name__c, Secondary_Contact_Phone__c, Secondary_Contact_Email_Address__c. Create verified: a37WE000003WPzFYAW.
- Open: specimens on intake (no answer), voicemail time / Call Back TAT (Fahim: discuss), Appt_Scheduled_Time_Zone__c picklist values not yet checked.
