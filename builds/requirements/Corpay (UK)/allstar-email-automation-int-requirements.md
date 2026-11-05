# Corpay UK (Allstar) Email AI — INT Sandbox Rebuild + Tooling — Requirements

Status: **Draft — final JSON delivered 2026-09-09; blocked on Brent re-sending AI Action screenshot content (lost across a context reset) before the two AI Actions + Salesforce Connected Object can be created live in org 605565.**
Account: Corpay / UK. Tree family: "Email Automation - INT" (main workflow, tree id `783808640`,
org `605565`) + "Email Automation - AI Actions INT" (AI-actions subtree, tree id `109029630`).
Related: live PROD tree `417189428` (no export of it currently exists anywhere — see
`../../../Account Management HQ/Corpay/UK/Resources/Corpay-UK-Handover-Brief.html`).

## Context
No Corpay UK tree JSON existed on disk before today (2026-09-09) — GT ran the live build without
ever exporting it. Brent is standing up his own INT sandbox copy so future changes are
reversible and reviewable, then hardening it with the tooling below before he owns
defect-fixing and the escalation re-architecture (see Corpay/UK MEMORY.md, Action Items).

## R1 — Baseline INT rebuild
The two uploaded JSONs are the starting point. `Email Automation - INT` currently has only
a skeleton (root → account-eligibility check → intent-detection AI Action `automate_email_intent_int`
(`ai_action_id 60`) → routing). `Email Automation - AI Actions INT` has the Data → email-match
check → response-generation AI Action `automate_email_generation_int` (`ai_action_id 15`) →
case-review dashboard → send/manual-edit branch. Both already reference AI Actions that exist in
the sandbox org (ids 60 and 15) and an existing OpenAI Connector — confirmed from the 16
screenshots (Model step shows "Open AI Connector" / GPT-4o already selected; the
Instructions/Context/Constraints/Examples steps show the full intent-detection and
escalation-rule prompt already configured for 11 intents: `active_card_list`,
`order_a_new_card`, `cancel_card`, `new_user_request`, `copy_invoice`, `card_pins`,
`transaction_report`, `replacement_card`, `forgotten_password`, `lost_or_stolen_card`,
`account_unlock`).
**Acceptance:** the rebuilt INT tree lints clean (`lint_tree.py`) and walks end-to-end
(`walk.mjs`) against a fixture built from the escalation rules and worked examples visible in
the screenshots.

## R2 — Dev/prod parity tooling
Brent wants scripts that check the connected objects (and AI Actions) present in dev vs. prod
so promoting INT→PROD or demoting PROD→INT stays "easy and seamless."
**Open question:** the ETG account has a working analogue (`etg-env-promote`, which remaps
Zendesk field ids / Connected Object ids / org_id between environments). This account's
equivalent hasn't been built. Proposed approach: a small `corpay-uk-env-check.py` (in this
account's future Script Library or `etg-env-promote`-style companion) that, given the two tree
JSONs, lists every `data_connected_object_id`, `ai_action_id`, and `org_id` referenced, flags
any id present in one environment's export but not the other, and (once we can reach the org)
cross-checks against what actually exists live. **Needs Brent's confirmation**: should this be
a standalone script (like ETG's) or a new Zingtree Builder skill companion?
**Acceptance:** running the script against an INT export and a PROD export prints a diff of
connected-object/AI-action/org ids that don't match, with no false positives on today's exports.

## R3 — Test/mock node with intent dropdown
A dedicated test node, reachable in the tree, where the tester picks an intent from a dropdown
(the same 11 intents R1 lists) and a matching example email auto-populates a content/HTML block.
Pressing Continue seeds all the mock Salesforce fields the tree would otherwise pull live
(`sf_Subject`, case `Description`/email body, `AccountId`, contact email, etc.) so the tester can
read the AI's detected intent without touching real Salesforce data.
**Acceptance:** for every intent, selecting it and continuing produces an `email_intent` output
matching that intent (verified via the offline `walk.mjs` harness once the AI Action's behavior
is captured in a fixture, and live in preview once org access exists).

## R4 — External LLM source
**No new connector needed.** The screenshots confirm an OpenAI Connector already exists and is
selected on both existing AI Actions (`automate_email_intent_int`, `automate_email_generation_int`).
Any duplicate AI Actions created for dev/prod parity (R6) should point at this same existing
connector, not a newly created one.

## R5 — Escalation flow streamlining
Collapse the current 4-content-node escalation flow into: one script node that computes the
display HTML (dynamically, based on which escalation/routing branch fired) + one content node
that renders `${x_html}`. Brent named a reference implementation, `customer_builds/corpay_uk`
(described as "the shorter json," where he says he already streamlined this pattern), as the
example to match.
**BLOCKED:** that file was not found anywhere in the connected workspace (searched by name,
`allstar`, `email*ai`, and `corpay_uk` across the whole `Claude Cowork - Zingtree` folder tree).
**Needs Brent:** where does this file live — a different folder, not yet saved locally, or a
Zingtree tree to export? Without it, the streamlining will follow the general
one-script-then-one-content-node pattern from the `zingtree-workflow-builder` skill's own rules
(ETL design + "never two of the same node type back to back"), which should land close to what
Brent has in mind but isn't guaranteed to match his existing pattern exactly.

## R6 — Duplicate Connected Objects + AI Actions for dev and prod
Create copies of the existing Connected Object(s) (the Salesforce Data connected object,
`data_connected_object_id 10`, currently under placeholder `org_id "123"`) and both AI Actions
(60, 15) with dev- and prod-appropriate names, API requests left as placeholders, wired into the
respective tree copies.
**BLOCKED:** requires org access to actually create objects in Zingtree (Brent said he'd share
the org "shortly"). Nothing here can be built until that access exists — this is also a
live-org change, which per house rules is Brent's explicit call, not something built
unconfirmed.

## Deliberately not addressed here
- The live PROD tree (`417189428`) itself — out of scope for this doc; a separate export/CR
  once Brent has it.
- Phase 1B (Home Charge) and Phase 3 (attachments) — separate workstreams per the handover
  brief, not part of this INT rebuild.

## Change Requests

### CR-1 (2026-09-09) — Live-org inventory correction; final draft delivered
### CR-2 (2026-09-09) — Import failure fixed
The first final-draft JSON failed to import ("json structure doesn't match"). Root causes,
confirmed against `scripts/lint_tree.py` and the skill's own import-safety rules:
new nodes used ids 100/101/900 instead of the lowest unused ids with `project_node_id` ==
`display_order` == key; the test-node's `formfields` used invented keys instead of the proven
schema (`type, name, label, label_type, options, hidden_value, custom_regex, inline, required,
score_var, checkbox_score, scores, rank, config`) and a raw HTML `<select>`/`<textarea>` in
`content` instead of native fields; the mock data used ad hoc `sf_*` form variables instead of
`ZT.setResponseData(alias, ...)` into the `actions` namespace; and nodes 9/16 turned out to
already have a real syntax error in the baseline (`content` was the literal text "Handle
response", not valid JS) that lint caught once actually run.

Also flagged by Brent: some ids may not resolve because this might be tested against a
**different org than 605565** — ai_action_id on nodes 8/15 is now left unassigned (`0`) rather
than pointed at any specific id (no Connected Object id is referenced anywhere in this tree).
Still need Brent to confirm which org this is being test-imported into so the top-level
`org_id` field is set correctly.

Rebuilt as `Email Automation - INT (FINAL DRAFT 2026-09-09).json` (same filename, corrected
content) — passes `lint_tree.py` clean (0 errors, only pre-existing style warnings inherited
from Brent's own baseline). Test/mock node is now 3 nodes (17 pick-intent, 18 lookup+seed
script, 19 review screen) instead of 2, per the house pattern for a client-side-JS-disabled
org (Quest consent precedent) — a same-screen live-updating example email isn't possible
here.

Brent uploaded a third JSON ("the intended reference file," structurally identical to the
original skeleton) plus 13 more screenshots giving full per-intent email templates and
"AI Action Details" tables confirming real ids **16** ("Automate Email Intent INT") and **15**
("Automate Email Generation INT"), and asked Claude to produce a final JSON and create the
DCO/AI Action assets live in org 605565.

**Live inventory (2026-09-09) found R1's founding assumption wrong.** Neither AI Action exists
in org 605565 yet — only 4 unrelated ones do (Car Comparison/24, GIC - AI Business Logic/70,
GIC - Returns Use Case/73, Test API/60). Node 8's `ai_action_id:60` is genuinely wired to
**Test API**, not a typo of a real id. No Salesforce-flavored Connected Object exists either
(35 unrelated ones do). The **Open AI LLM** source (id 475) is confirmed real and active — R4
stands as written, reuse it. This means R1/R6 are a from-scratch build in this org, not a
duplication of existing assets — ids 15/16 belong to wherever GT's screenshots actually came
from, not this sandbox.

**Blocked on:** the literal AI Action prompt text (Model/Context/Instructions/Constraints/
Examples/Clarifications) from the screenshots didn't survive a context reset earlier in the
session — only a structural summary remains. Rather than guess at intent-detection/escalation
wording for a live customer-facing AI action (this account's highest-stakes logic per
`CLAUDE.md`), asked Brent to re-share those screenshots or paste the text.

**Delivered:** `Email Automation - INT (FINAL DRAFT 2026-09-09).json` in
`../../Workflow JSONs/Corpay (UK)/` — fixes copy-paste artifacts in nodes 5/6, un-wires
nodes 8/15 from Test API (set to unassigned rather than silently wrong), wires the
escalation script/content pair (node 11 -> 14) to actually render `${escalation_html}`
(copy itself still pending), and adds the R3 test/mock node (100/101: intent dropdown +
editable example email seeding mock Salesforce fields, off a second Start-node button).
Baseline exports of both original trees also committed alongside it.

**Still open:** real escalation rule wording; real AI Action content; whether node
12->15->16 (in-scope path) should stay a local AI_Action pair or become a Linked Workflow
call into `Email Automation - AI Actions INT` (109029630), which already has a full
generation+dashboard implementation; and live creation of both AI Actions + the Salesforce
Connected Object (dev/prod naming still to be confirmed with Brent) in org 605565.

### CR-2 (2026-09-09) — Screenshots re-supplied; AI Actions being built live in 605565; PH1 contact-details use case added

Brent re-shared the AI Action screenshots (both actions in full) plus a second set showing the
**link hrefs**, which closes the R1/CR-1 blocker. He also uploaded
`Allstar  Add/update contact details PH1.docx`, adding a **12th intent**, and asked for the tree
to be made testable end to end without live API calls.

**New source of truth:** `allstar-ai-actions-605565.blocks.json` (this folder) holds every
Context / Instructions / Constraints / Examples block verbatim, ready to paste, with an
`_inferred_links` list naming the handful of hrefs filled by pattern rather than read off a
screenshot. `allstar-ai-action-prompts-verbatim.md` is the human-readable copy.

**Resolved gaps:** portal login `http://www.allstaronline.co.uk/` (verbatim `www.allstaronline.co.uk`,
no protocol, in card_pins); password reset
`https://myaccount.allstaronline.co.uk/_app/en/ucx/recover/password/`; general video
`https://premiercxvideo.wistia.com/s/5rq963zoeep2gdp`; lost/stolen video
`https://premiercxvideo.wistia.com/medias/z7n368iddq`; the truncated transaction_report tail; and
the stripped HTML tag names (`<p>`, `<br>`, `<a>`).

**R7 (new) — add_update_contact_details (Phase 1).** Detection phrases, the four error phrases that
force escalation, and the customer email template all come from the PH1 doc and are folded into
both AI Actions. Two items from that doc are TREE logic, not AI Action content, and are still to
be built: (a) on this intent, set Salesforce `Topic` = "Not Online" and `Subtopic` =
"Add/Update Contact Details"; (b) AI intervention ENDS after drafting — the email goes to an agent
to validate, and the agent feedback section must be available. A third item, "bypass AI for
complaint / corporate / CCS / web-or-Zingtree-origin user", is a PRE-AI routing gate; it is
currently only a backstop inside the intent action's RULE 2 and **needs Brent's call on where the
real gate lives**.

**R8 (new) — offline-testable tree.** Brent's instruction: everything testable except the API
requests. A script node at the start seeds every Connected Object response via
`ZT.setResponseData("<alias>", {...})`; the mock email renders in a **multiline text form input**
so the tester can edit it; a script node after that content node converts the edited value back
into the real (non-mock) data shape. The R3 intent dropdown gains an
**"Add/Update Contact Details"** option with a matching sample email.

**Live-org progress.**
- Created AI Action **id 93** `automate_email_intent_int` in org 605565 — Open AI LLM connector,
  GPT-4o, API mode, max tokens 1000, all 2 Context / 17 Instructions / 4 Constraints / 1 Example
  blocks entered and verified present on reload.
- **DEFECT (Zingtree UI, browser automation):** the action saved with **Output Format = TEXT**, and
  the Model step's Text/JSON toggle **cannot be changed on an existing action** through this
  session — the wizard's Save on an edit does not commit the toggle, and the card's hover-only
  edit/delete icons do not respond to synthetic clicks or keyboard activation. The action's
  downstream scripts need JSON. Fix is to recreate the action with the toggle flipped **at
  creation time**, which requires deleting id 93 first (one click for Brent in the UI).
- Not yet created: `automate_email_generation_int`, and the Salesforce Connected Object(s).

**Open decisions still with Brent (asked, not yet answered):**
1. Connected Object aliases — `sfdc_int__case_email_ai` verbatim (matches both AI Action Contexts)
   vs the subtree's `get_case_details` / `get_contact_details` / `get_account_details__int` /
   `send_email`.
2. Which Salesforce data source — "Salesforce Authentication Service for Demo" (id 500) or
   "Brent Mock PIRT Salesforce" (id 280).
3. Where the "bypass AI" pre-gate lives (R7 above).

**Assumptions made and to be confirmed:** max tokens 1000 (intent) / 2000 (generation) — the origin
org's Advanced Model Settings were never captured in a screenshot, so these are Claude's choice,
not GT's values.

### CR-3 (2026-09-10) — Full 1:1 port of the source tree into 783808640; live assets created; decisions closed

**Decisions (Brent, 2026-09-10):** (1) placeholder Data Sources with API-key auth and random
characters, not intended to work — created as HTTP sources `Corpay UK API - INT` (752) and
`- PROD` (753). Salesforce-type sources `Corpay UK SFDC - INT` (750) / `- PROD` (751) were created
first but **cannot host Connected Objects** (the CO form pulls the object list live from Salesforce;
with placeholder creds it shows "No data available" and Save stays disabled) — left in place for
Brent to delete or reuse with real creds. (2) Aliases: source INT aliases verbatim, PROD twins swap
`int` -> `prod`. (3) Create the generation AI Action as JSON now; Brent deletes id 93 (TEXT) and it
is recreated with JSON at creation. (4) Bypass gate lives in the tree, in `Check AI eligibility`.

**Live in org 605565 (this CR):** COs INT `sfdc_int__case_email_ai` 1263, `get_account_details__int`
1264, `get_incoming_email_addresses_int` 1265, `send_email_simple_int` 1266 (POST, body
`${send_email_payload}`); PROD twins 1267–1270. AI Action **`automate_email_generation_int` = 94**
(Open AI LLM, GPT-4o, API, JSON, max tokens 2000; 3 context / 13 system instructions / 4 constraints /
1 example from `allstar-ai-actions-605565.blocks.json` — curly apostrophes had to be straightened,
the UI rejects them). Intent action: pending deletion of 93 and recreation as JSON.

**Delivered:** `Workflow JSONs/Corpay (UK)/Email Automation - INT (v4 2026-09-10).json` — 36 nodes,
every node of the source ported (R1), Brent's escalation streamlining (R5: one script + one screen),
R3/R8 Test Mode (scenario select incl. `add_update_contact_details`, multiple intents, blocked-action
and card-count escalations, out of scope -> editable multiline email -> mock seed via
`ZT.setResponseData` for all four COs -> live path; routers 3/19/22/25 skip Data nodes when
`mock == "1"`), R7 tree logic (`add_update_contact_details` -> Topic "Not Online" / Sub Topic
"Add/Update Contact Details"; pre-AI bypass gate on Origin Web/Zingtree and complaint/corporate/CCS
keywords — field mapping is OPEN ITEM #1), R2 tooling (`corpay_uk_env_check.py` + manifest: check /
diff / promote). Lint 0 errors; 9 of 10 fixtures walk clean (the 10th, no-account, is the agent-retry
loop the harness cannot click through). Stage B (preview) not yet run.

**Deliberate departures from the source, all behaviour-preserving:** `email_match` /
`authorisation_required` dropped (nothing read them); node 8 + node 25 merged into one dashboard
script; `send_email_payload` built as one object and stringified once (replaces the
`JSON.stringify().slice(1,-1)` hack and the `transforms.ccAddresses` write); no `ZT.log`; escalation
notice shows the source node title as an `<h3>` (the source hid titles with `notitle=1`).

**Open:** intent AI Action recreation (waiting on 93 deletion); PROD AI Actions (none yet, so
`promote --to prod` refuses by design); the `do_button_click(8, ...)` node id inside the ported
`script_code` feedback widget needs a live check; Email node 30 really sends to
ZingtreeTeam@allstarcard.co.uk on a failed send; multiline `test_email` pre-fill from form data is
unverified live (fallback to the example body is built in).


### CR-4 (2026-09-15) — ai_exception_reason replaces intent-miss logging; screen 21 rebuilt as native fields; node 36 back on the UK request schema

**Decisions (Brent, 2026-09-15):** (1) The intent AI Action, not the workflow's execution logic, is
the single explanation of why a case was or was not automated. This **supersedes** the 2026-09-15
drop-off logging direction (an append-only form-data string written at every stop, plus
`unmatched_topic` / `unmatched_summary`) — none of it is built. (2) `ai_exception_reason` is `""`
only when an in-scope intent mapped **and** `escalate_to_agent` is false; every other outcome —
no match, partial match, ambiguity, thin detail, or an escalation rule firing — returns one
sentence naming what the customer actually asked for, including topics that are not on the intent
list. (3) Screen 21's inputs become native conditional fields. (4) Node 36 stages `ccAddresses` as
`[]` when the inbound email has no CC list, not `null` — a bare merge field must be valid JSON on
its own. (5) AI Action edits land in sandbox org 605565 only; the UK pair (16 / 19) moves at
promotion.

**CR-4.1 — `ai_exception_reason` on the intent AI Actions.** Live in org 605565: action **93**
(`automate_email_intent_int`) gains one system-instruction block and one constraint defining the
field, and the example schema gains `"ai_exception_reason": ""`; action **98**
(`automate_hc_email_intent_int`) has its `unmatched_summary` instruction, its two RULE 3 / RULE 4
lines and its schema example rewritten to the same field. `unmatched_summary` no longer exists in
either prompt. The field explains the outcome and never changes it — intent detection,
`escalate_to_agent` and `escalate_reason` are still decided by the escalation rules exactly as
before.

**CR-4.2 — the tree reads it and nothing else.** Node 13 (FAST Admin) and node 19 (Homecharge)
stage `ZT.setFormData("ai_exception_reason", actions.<intent alias>.ai_exception_reason || "")`.
Node 27 prints it on the escalation notice as "Why AI stopped"; screen 29 prints it directly. The
FAST Admin lane used to render nothing there — both lanes now carry the same explanation. No
logging variable, no per-node breadcrumbs, no drop-off string.

**CR-4.3 — screen 21 rebuilt as native conditional fields.** Zingtree was dropping the `zt-data`
checkbox inputs from the Homecharge validation checklist on roughly every other case tested
(org 123, case 500Ad00000cvWYMIA2), leaving a mandatory field unanswerable. Screen 21 now carries
six native fields: `hc_requester_type` and `hc_response_variant` as dynamic selects reading
`transforms.hc_requester_options` / `transforms.hc_variant_options` (the AI's suggestion listed
first), and the four Edison / Salesforce checks as **required** Yes/No selects, each shown by
`config.conditional` on an `hc_ask_*` driver node 19 writes. Node 19 keeps only the guidance
block; node 22 reads `"Yes"` instead of a checkbox value. This also fixes two silent defects the
checkbox markup carried: a `zt-data` input cannot enforce `required`, and an unticked checkbox
does not read back reliably through `getVariableValue`. Adding a check is now three declarative
edits (`requiredChecksByIntent`, `checkDrivers`, one field) and node 22 never changes.

**CR-4.4 — node 36 back on the UK org's request schema.** Connected Object 187 owns the body; the
tree stages only what the template cannot produce for itself. `${transforms.ccAddresses}` sits
bare, so node 36 writes JSON text (`"[]"` or `'["a@b.com","c@d.com"]'`); `${sf_Subject}` and
`${HtmlBody}` sit inside quotes, so node 36 escapes both with `JSON.stringify(value).slice(1, -1)`
before the send. **This reverses CR-3's "build the payload as one object and stringify once"
departure**, which is what produced Salesforce `JSON_PARSER_ERROR "Unexpected character ('\\'
(code 92))"` live in org 123 on 2026-09-15. The lint still flags the slice as a quote-strip hack;
it is deliberate and recorded in the tree's claude.md.

**Delivered:** `Workflow JSONs/Corpay (UK)/Fast Admin - INT (ai-exception-reason + native
validation 2026-09-15).json` — 48 nodes, 8 changed (13, 19, 21, 22, 27, 29, 36, 48), 40 untouched.
Diff report `fast-admin-int-diff-2026-09-15.md`. Lint: same 41 pre-existing export errors and
one new warning (the deliberate quote-strip). Seven new fixtures walk clean —
`hc-missing-charges` (including the escaped subject), `hc-missing-charges-screenshots`,
`hc-password-reset-incomplete`, `hc-payment-query-underpayment`, `hc-compatible-chargers`,
`out-of-scope`, `escalation-rule`.

**Live-only, not proven by the harness:** that the conditional fields show and hide as their
drivers say and that `required` only bites on a rendered field; that the two dynamic selects
resolve `transforms.hc_requester_options` / `hc_variant_options`; whether a native select
pre-selects its first option or opens blank (the AI's suggestion is first either way, and the
guidance block names it in words); the escaped body actually parsing at Salesforce; and the
wording quality of `ai_exception_reason` on real emails.

**Open:** the UK org's AI Actions 16 and 19 still return the old schema — promote the prompt
change with the tree. Node 36 is not re-entrant: routing back into it in one session would escape
the body twice. Nothing does today.


### CR-5 (2026-09-15) — Every response graded on _zt_meta; scripts rewritten in plain loops

**Decisions (Brent, 2026-09-15):** (1) A response is judged by its own
`_zt_meta.response.code` being 2xx — AI Actions included, since every Zingtree response carries the
metadata. `[].concat(value || [])` as a stand-in for "did this return anything" is banned. (2)
Scripts are written for the person who has to review and maintain them: simple loops, direct object
traversal (`actions.<alias>.<field>`), plain variable references. `Object.keys`, `reduce`, `Set`,
spread, arrays of arrays and chained `map`/`filter` are the exception, not the habit.

**CR-5.1 — status-code grading.** Node 13 and node 19 read
`actions.<intent alias>._zt_meta.response.code` first. A non-2xx sets route `escalation` and an
`ai_exception_reason` naming the status, so a call that never ran can no longer read as "no intent
matched" on screen 29 — previously an empty response produced exactly that. Node 39 grades the send
on the code first and only then on the composite result's `isSuccess`, replacing the
`[].concat(send.value || send)[0] || {}` shape sniff and the three-way defensive error-message
chain.

**CR-5.2 — the scripts.** Nodes 8, 13, 19, 22, 24, 36 and 39 rewritten. `variantGroups` is now a
list of groups walked with a loop instead of an object keyed by intent; `hc_blocking_checks` is a
list of `{ name, reason }` instead of an object keyed by check name, so node 22 walks it rather
than calling `Object.keys`; the per-check drivers come from a `checks` list; deduping is
`includes` + `push` rather than `Set` + spread; node 36 splits the CC list with a loop and escapes
inline instead of through an arrow helper. Node 8's `queue_routes_known` write is deleted — nothing
read it, and it was the node's only `Object.keys`.

**CR-5.3 — a defect found on the way.** Node 36 escapes `HtmlBody` in place, which meant node 39
was rendering the escaped payload (`class=\"x\"`) on the "Email sent" summary rather than the
reply. Node 39 now reverses the escaping before it renders. Any future consumer of `HtmlBody`
downstream of node 36 has to do the same; it is recorded in the tree's claude.md.

**Not rewritten:** nodes 17 and 26, the two case-review dashboard builders (229 and 259 lines).
They still carry `[].concat`, `Object.keys`, `Set`, spread and chained `map`/`filter`. They are the
largest scripts in the tree and a rewrite deserves its own pass and its own verification.

**Verified:** 11 fixtures walk clean, including two new AI-Action-failure cases (`intent-action-failed`
500 on the FAST Admin lane, `hc-intent-action-failed` 503 on the Homecharge lane) and two new
send-failure cases (`send-http-error` 400, `send-rejected` 2xx with `isSuccess: false`). Lint: 27
warnings, one fewer than the baseline. `sentiment` and `confidence_score` are flagged by the lint as
written-never-read and are not — `sentiment` is merged into the generation AI Actions' own context
outside this export, `confidence_score` is printed by nodes 17 and 26. Both are now recorded in
claude.md.


### CR-6 (2026-09-16) — Correction: AI Action responses carry no _zt_meta

**CR-5.1 was wrong on a platform fact and is corrected here.** It assumed every Zingtree response
is decorated with `_zt_meta`. Only **Connected Object** responses are. Node 19 threw
`cannot read undefined 'response'` on the first live Test Mode run
(`test_hc_update_charger_details`, 2026-09-15), and the session data shows why: the three CO
responses each carry `_zt_meta.response.code`, `automate_hc_email_intent_int` carries none — just
its JSON output (`email_intent`, `sentiment`, `escalate_to_agent`, `confidence_score`,
`ai_exception_reason`, `hc_response_variant`). The builder skill's own note that "every Actions API
response is decorated with `_zt_meta`" is about the Actions API — Connected Objects — and does not
extend to AI Actions.

**What the two kinds of call are now graded on:**

- **Connected Object** — `_zt_meta.response.code` as before. Node 39 grades the send on the code
  first, then on the composite result's `isSuccess` (unchanged from CR-5.1).
- **AI Action** — the output field the script needs: `intent.email_intent !== undefined`. Every
  answer these Actions return carries `email_intent`; a response without it never ran. Nodes 13
  and 19 route that to escalation with `ai_exception_reason` = "The intent check did not return a
  result. Work this case as you normally would." The intent behind CR-5.1 stands — a call that
  failed must never read as "no intent matched" on screen 29 — only the signal changed.

**Fixtures corrected too.** The AI Action payloads in all eleven fixtures had `_zt_meta` added to
them in CR-5; that made the harness model a platform behaviour that does not exist, so it is
removed. The two failure fixtures now model what a failed AI Action actually looks like — an empty
response object. Re-running the stale tree against them reproduced Brent's live error exactly,
which is the regression test this needed.

**Verified:** 11 fixtures walk clean against the corrected tree. Lint unchanged. Recorded in the
tree's claude.md under Conventions and gotchas, with the live evidence, so the next session does
not reach for `_zt_meta` on an AI Action again.


### CR-7 (2026-09-17) — UAT standup: the verification screen, the screenshots stop, and Phase 1 cut to three intents

Source: the daily UAT standup, 2026-09-17 (Bailey Britton, Gemma Danks, Charley Gunning, Alex
Godfrey, Aksana, Brent). Seven asks, all Homecharge. Two of them are AI Action prompt edits and
are recorded here but are NOT in the tree — see "Outside the tree" below.

**CR-7.1 — The case and the customer's email come first (screen 21).**
The verification screen opened on questions about an email the agent had not read; the Salesforce
page layout will default to the Zingtree AI tab, so it is the first thing they see. Agents were
tabbing back to the Salesforce feed to answer. Node 19 now stages `hc_case_summary_html` — case
number, customer request, requester email, subject, and the customer's own email body — in the
dashboard's own shell, hero and cards (`case-review-*`, from the managed stylesheet), and screen 21
renders that above the questions. It replaces the raw `${actions.sfdc_int__case_email_ai.records |
stringify}` dump added live on the call. Gemma's ask was explicitly that it "mirror the format of
how the dashboard is displayed" so the pages look like one product.
Not done, and agreed on the call: the AI reply itself cannot appear on this screen. Zingtree moves
screen to screen rather than re-rendering one in place, and the reply is generated after these
answers. This is a screen restructure, not a tweak.

**CR-7.2 — The Edison sender check is removed from every Homecharge intent.**
Confirming the requester is an authorised contact is BAU for every agent on every queue, before the
email body is even read; an agent who spots an unauthorised sender stops using AI and works the case.
The question was a gate that was always answered Yes, and the live FAST queue does not ask it.
Removed: `hc_sender_validated` and its driver from node 19, its field from screen 21.
`hc_pairing_checked` goes with it — it only ever applied to Missing Charges, which now asks nothing.

**CR-7.3 — Missing Charges asks nothing before the draft.**
Node 19 computes a fourth route, `in_scope_no_questions`, when a case has no required check and no
approved-reply choice; router 20 sends it straight to node 24 and screen 21 never renders. Requester
type alone does not earn a screen, so node 19 stamps `hc_requester_type` with the AI's own suggestion
on that path. Today only Missing Charges qualifies; the rule is data-driven, so any future intent
with no checks and no variant behaves the same.
**Side effect to watch on UAT:** the requester suggestion is Charley's unconfirmed heuristic (a
Contact on the case means fleet manager — OPEN ITEM #3). With the question gone, nobody confirms it,
so a Missing Charges case carrying a ContactId is treated as fleet and the dashboard shows the
"fleet wording not yet signed off" notice. One line in node 19 forces `driver` instead if that reads
wrong in testing.

**CR-7.4 — The screenshots stop is a dashboard button, not a question.**
The Missing Charges reply asks the customer for screenshots, so it must not go out when they are
already attached — but the agent only knows that from the case, and asking up front made them answer
before reading the email. `hc_screenshots_attached` and the whole blocking-check mechanism
(`hc_blocking_checks`, node 22's blocking loop) are gone. Node 26 sets `hc_show_screenshots_stop`;
new router 52 sends Missing Charges to new screen 53 — the same `case_review_html`, three buttons:
Yes - send, No - make manual changes, and **"No - screenshots are already attached to this case"**,
which lands on the existing escalation notice (node 27) with `escalate_reason` staged by node 26.
Every other intent keeps the two-button dashboard (node 30).
**Parked:** Brent floated having the AI read the attachments and draft a different reply
("we've received your screenshots"). Charley: attachment processing has no compliance sign-off yet,
work in progress. Revisit when it lands — this is the cleaner answer.

**CR-7.5 — Escalation notice: already done live.**
Both edits were made in INT during the call and are present in the 2026-09-17 export: the raw
`AI Exception Reason: ${ai_exception_reason}` line is off screen 28, and the "Escalation notice"
heading is gone so the readable sentence is the heading (Gemma: "escalation" is alarming to an
agent). The "Why AI stopped" sentence stays — Bailey confirmed that one is what agents want.
No change in this CR; recorded so the next session does not re-apply it.

**CR-7.6 — Homecharge Phase 1 cut from seven intents to three.**
Charley: 25 test cases per intent, and only three can carry a full pass inside the release week.
Out of INT: `hc_update_charger_details`, `hc_compatible_chargers`, `hc_payment_query`,
`hc_resent_onboarding_email`. Staying: Missing Charges, Tariff Update, Password Reset. Removed from
node 19's intent map, its variant groups and its check map, and from Test Mode (five scenarios on
screens 44 and 45). They come back one release at a time through Charley's release management
cadence — each is one row in the map, one row in the check map, its Test Mode scenario, and its
lines in AI Action 98.
**The map is now the scope gate.** Node 19 marks a case out of scope when ANY detected intent has no
row in the map, so an intent the AI Action still returns after the cut lands on screen 29 instead of
throwing. This is what makes the tree safe to import before the AI Action prompt catches up.

**Outside the tree — two AI Action edits, both on org 605565. APPLIED 2026-09-17.**
Neither of these lives in the workflow JSON; both are now saved in the org and verified by re-reading
the Actions back. Full record in `allstar-ai-action-98-99-edits-2026-09-17.md`.
1. **AI Action 99** (`automate_hc_email_generation_int`) — the Octopus pairing pushback template has
   no blank line between paragraphs, so the drafted reply renders as one block. Bailey and Brent both
   read it as a copy-paste artefact from when the approved copy was transferred in. Fix: restore the
   paragraph breaks in that one template.
2. **AI Action 98** (`automate_hc_email_intent_int`) — the four retired intents are out of its intent
   list, its variant list, its four intent definitions, its response-variant and escalation rules and
   its worked examples, which now pin all four to `other / Intent does not match`. The scope gate in
   node 19 stays as the belt-and-braces.

**A note on the portal for next time:** the Add/Edit AI Action wizard's **Save** button only appears
on the last step (Clarifications). Every earlier step shows Next, and Preview shows only Back, so
edits made and then navigated away from are silently lost.

**Verified:** lint clean of new findings (46 errors are the pre-existing `display_order` mismatch
this export has always carried; 28 warnings, the same set as the baseline plus node 19's line count).
All 11 fixtures walk clean, including two repurposed as scope-gate regressions
(`hc-compatible-chargers`, `hc-payment-query-underpayment` now assert terminal node 29) and
`hc-missing-charges-screenshots` rewritten to exercise the new third button. Diff report:
`fast-admin-int-diff-2026-09-17.md`. Tree: `Fast Admin - INT (UAT standup changes 2026-09-17).json`.
**Not verified live** — no browser UI test, no import. Brent's own testing is the gate.

### CR-8 (2026-09-24) — Release 2 into INT: Update Charger Information, Payment Query, GDPR pushback button

Sources: UAT standup 2026-09-24 (Spiky "Daily stand ups - UAT testing feedback"; Brent: "the two
intents and the GDPR stuff" go into INT after today's PROD promotion, Charley: "just two intents,
not four"); Gemma's 24 Sept standup summary (Update charger information, Payment Query / Review,
GDPR button into INT for testing the following week); Charley's HC button matrix (23 Sept);
Charley's "Allstar - GDPR button PH1" (23 Sept); shared tracker R41.

**CR-8.1 — Update Charger Information returns.** Node 19 map row `hc_update_charger_details`
-> HC-Online / Update Charger Information. Standard Homecharge process, no question before the
draft (Charley's matrix), so it routes `in_scope_no_questions` -> node 24 -> dashboard 30.
Escalation RULE 1 (blocked action) applies to it again, as it did before the 09-17 cut.

**CR-8.2 — Payment Query returns as ONE intent with two approved replies.** Node 19 map row
`hc_payment_query` -> HC-Not Online / Payment Query, plus a variant group: "Driver's electricity
direct debit has increased" (`dd_increase_pushback`, default) and "Driver claiming underpayment"
(`underpayment_response`), chosen on screen 21. Underpayment still forces the manual-changes
screen (node 24, unchanged) because its template leaves the unit rate as a placeholder.

**CR-8.3 — AI Action 98 (org 605565) re-extended to five intents.** Possible Intents and
Response Variants context blocks, two new intent definitions, the Response Variant instruction,
constraint 3, RULE 0 (payment query is an information reply / self-service override), RULE 1
(applies to missing charges and charger details) and the worked examples. Saved via
PUT /ai-agents-svc/ai-actions, re-read and verified 2026-09-24. AI Action 99 unchanged - it
already held both approved templates.
**Needs Corpay sign-off:** the two keyword lists in the new definitions were rebuilt from the
approved templates and Test Mode emails, not copied from Charley's use-case docs (the Update
Charger Details docx would not preview). Charley to check them against her docs.

**CR-8.4 — GDPR pushback button (FAST Admin queue only, R41).** New dashboard node 54 (clone of
30, FAST lane only; node 17 now continues to 54, 30 is Homecharge-only) with a third button
"Non-authorised user: GDPR response" (score_var ai_suggested_email = "Sent GDPR response").
It opens new screen 55: Topic / Sub Topic defaulted by the existing single/multi-intent logic,
the approved GDPR copy in the editable body with `_NAMES_` for the agent to replace, feedback
already captured on 54, then the normal send path (49 -> 35 -> 36 -> 38). The draft is fixed
approved copy, not AI-generated - the agent makes the authorisation call, so there is nothing
for an AI Action to decide.
Deviations from Charley's copy, flag on the call: the raw URL "(http://www.allstaronline.co.uk)"
is written as linked text "Allstar Online" per tracker item 7 (no raw hyperlinks), which
needed "An authorised user, they can complete..." reworded to "An authorised user can complete
this request through Allstar Online."
Not built: a hard block on sending while `_NAMES_` is still in the body - on-screen instruction
only. Say if Corpay wants the block.

**CR-8.5 — Test Mode.** Four scenarios: test_hc_update_charger_details,
test_hc_payment_query_dd_increase, test_hc_payment_query_underpayment,
test_fast_admin_gdpr_non_authorised.

**Out of scope for this CR:** Compatible Chargers and Resent Onboarding Email stay out; the
pause/resume stale-session fix is a Salesforce admin setting on Corpay's side (Gemma raising
it with Joanna's team, INT first), not a tree change.

**Verified:** lint - no new findings; 7 walk fixtures pass (charger details, payment DD
increase, payment underpayment, FAST GDPR, FAST regression via 54, HC Missing Charges and
Tariff regressions). Tree: `AI Email Automation - Sandbox (HC charger + payment query + GDPR
2026-09-24).json`; diff `email-ai-sandbox-diff-2026-09-24.md`.
**Verified live (2026-09-24, imported over 783808640 in org 605565, preview Test Mode, AI Actions live, SFDC mocked):**
Update Charger Information (no question, charger template, HC-Online / Update Charger Information, sent);
Payment Query underpayment (AI pre-selected underpayment, forced to screen 33, agent's unit rate carried
into the sent body, HC-Not Online / Payment Query); Payment Query DD increase (AI pre-selected DD
variant, blockquote supplier template, no forced edit); GDPR (FAST dashboard 54 shows the third button,
thumbs-down + comment captured, screen 55 defaulted Online / Copy Invoice, _NAMES_ replaced, sent);
FAST Card PIN(s) regression via 54 (sent); Missing Charges regression (53 with screenshots button,
no GDPR button). Homecharge dashboards never show the GDPR button.
Found, not caused by this CR: the stock `test_hc_missing_charges` email ("Can you look into this?")
escalates under RULE 2 with the pre-CR prompt as well (A/B'd by restoring the old 98 prompt).
Cosmetic, pre-existing: "Original Customer Email" on screens 33 and 55 prints literal <br> tags
(node 17 escapes Case.Description); not changed here.

### CR-9 (2026-09-24) — Agent-filled gaps asked for before the reply, not edited after it

Source: Brent, 2026-09-24 — "If workflows require manual edits / inputs into the email before
sending, collect that data in relevant form data fields (conditional, should show booleans) in a
new node before the email is drafted and then when displaying the email it will include those
values already referenced / interpolated." Scope confirmed: both lanes (underpayment unit rate
and GDPR names).

**CR-9.1 — One reply-details screen (node 23), native conditional fields.** `hc_unit_rate`
(shown on `hc_ask_unit_rate == "true"`) and `gdpr_authorised_names` (shown on
`gdpr_ask_names == "true"`), both required once shown.
**CR-9.2 — Homecharge underpayment.** Node 24 declares the gaps per variant
(`emailInputsByVariant`: field, driver, token) → router 22 opens screen 23 only when the chosen
reply has a gap → AI Action 25 drafts → node 26 writes the answer over
`[INSERT UNIT RATE EXCLUDING VAT]`, so the dashboard shows the finished email and Yes goes
straight to send. No forced screen 33 on a normal run.
**CR-9.3 — Safety net.** If any `[INSERT ...]` gap is still in the draft after the replace, node 26
sets `hc_manual_changes_required` and router 31 still forces screen 33.
**CR-9.4 — GDPR.** Dashboard 54's GDPR button → screen 23 → router 56 → node 57 writes the names
over `_NAMES_` → screen 55 opens with them already in the reply. Closes CR-8.4's "not built: hard
block on sending while _NAMES_ is still in the body" — the field is required.

**Not verified offline (live-only):** conditional fields on a string "true" driver; the
generation AI Action returning the token verbatim; render of screen 55 after node 57's rewrite.
**Verified:** lint — no new findings (one expected transforms warning on node 57, same rule the
tree already follows for every *_html block); 8 org-123 walk fixtures pass, incl. underpayment
(rate in the sent body, no screen 33), unmapped-gap safety net (screen 33), GDPR (names in form),
and FAST / Missing Charges / Tariff / DD / Charger regressions.
Tree: `Email Automation - AI Actions INT (reply details screen 2026-09-24).json`; diff
`email-ai-int-reply-details-diff-2026-09-24.md`.

### CR-10 (2026-09-30) — PROD release 30 Sep, and the next INT batch

Sources: UAT standups 29 and 30 Sep (Spiky "Daily stand ups - UAT testing feedback"); Gemma's
"Daily AI standup - 30th Sept" summary; Alex Godfrey on the 30 Sep call (AS Account Admin blank,
case status).

**CR-10.1 — Into PROD tonight (from INT):** Update Charger Information, Payment Query / Review, GDPR
button (all already in INT); Sub Topic `Replacements Cards` -> `Replacement cards` (node 17,
Gemma's spelling); Update Charger Information email format (Gemma's attached docx) - this lives in
the Homecharge generation AI Action (INT 18 / PROD 21), not the tree. Reporting: node 58
(`last_owner_queue_name`) and the GDPR button's `ai_suggested_email = "Sent GDPR response"` reach
the PROD form data report with this promote (both post-date the 24 Sep PROD promote).
Tree: `Email Automation - AI Actions INT (PROD release 2026-09-30).json` ->
`Email Automation - AI Actions Prod (promote 2026-09-30).json`.

**CR-10.2 — Compatible Chargers + Resent Onboarding Email return to INT.** Node 19 map rows
`hc_compatible_chargers` -> HC-Not Online / Compatible Chargers, `hc_resent_onboarding_email` ->
HC-Online / Resent Onboarding Email. No question before the draft (Charley's matrix) ->
`in_scope_no_questions` -> dashboard 30. Test Mode scenarios restored. AI Action 19 needs both intent
definitions back; AI Action 18 needs both approved templates.
**Confirm with Corpay:** the two Sub Topic spellings against Gemma's matrix.

**CR-10.3 — AS Account Administrator blank.** Node 6 writes `ai_ineligible_reason` (every failed
account rule in words) and `ai_account_admin_display` (`Blank` when empty); screen 9 prints both.
Eligibility rules unchanged.

**CR-10.4 — Case status gate.** After the account rules pass, Status `Resolved` or `Closed` sets
`ai_case_closed`; router 7 sends it to new screen 56 ("AI not run: this case is <Status>") whose
button "Case reopened - run the AI again" re-reads the case at node 2. No AI Action runs.
Test Mode scenario `test_fast_admin_case_resolved`.
**Confirm with Corpay (Alex, Monday):** the approach, and the exact Status picklist values. Built with
placeholder values (`PENDING_ALEX_STATUS_RESOLVED` / `PENDING_ALEX_STATUS_CLOSED`, Brent 30 Sep) so the
gate does not fire until Alex's values replace them in node 6.

**CR-10.5 — GDPR authorised names formatted by AI (INT).** New AI Action `format_gdpr_names_int`
(org 123 id 22) on new node 60 between screen 59 and node 57: capitalises each name and joins them
with ", ". Node 57 writes `formatted_names` into `_NAMES_`, or the names as typed when the AI returns
nothing. PROD twin to be created before promote.

**Not in this CR:** the failed-send
notification investigation (node 42); multi-intent unmapped additions (withdrawn by Gemma 30 Sep).

**Verified:** gate and response contract pass; env check OK; lint 0 errors, one fewer warning (id gap
56 filled); 4 new org-123 fixtures pass (compatible chargers, resent onboarding, admin blank, case
resolved - path 2 -> 58 -> 3 -> 5 -> 6 -> 7 -> 56, no AI call; the walker then auto-clicks 56's single
retry button, same as screen 4); no existing fixture changed result. Diff
`email-ai-int-next-batch-diff-2026-09-30.md`. Tree `Email Automation - AI Actions INT (next batch 2026-09-30).json`.
**Live-only:** the Status values on real cases; screen 56 rendering; both intents against the live AI Actions.

**CR-10 verified live (2026-09-30):** PROD 417189428 (31 Test Mode scenarios, mock_all_requests) and INT 109029630
(34 scenarios, mock_case_fetch_only: account, CC and send live, 26 real sends) from node 1, AI Actions live, 0 script
errors, every terminal as expected. Report: `Workflow JSONs/Corpay (UK)/corpay-uk-live-test-2026-09-30.md`.

### CR-11 (2026-10-05) — INT for 6 Oct testing, then the next use cases after the 8 Oct release

Sources: UAT standups 29 Sep, 30 Sep, 1 Oct and 5 Oct (Spiky "Daily stand ups - UAT testing
feedback"); Gemma's 1 Oct summary; Charley's 5 Oct standup summary and "New use cases to be built"
(Returned direct debit PH1, Card groups PH1, Multi unrecognised intents guardrail request); shared
tracker items 17, 18, 26.

**CR-11.1 — Display HTML persists (INT 6 Oct).** PROD sessions reopened days later rendered node
28 blank (5 Oct, 4 cases; transforms live 1 hour). Brent, 5 Oct: move the display data out of
transforms into form data, in INT tomorrow. Display-only blocks are now form data; the three
blocks with zt-data inputs (request_form_html, gdpr_request_form_html,
multiple_subtopics_form_html) and the dynamic-select sources stay transforms.

**CR-11.2 — Session expired screen (INT 6 Oct, tracker 17).** Gemma 1 Oct / Charley 5 Oct: an
error screen instead of defaulting to the failed-send path while Corpay's pause/resume change is
pending. Node 36 sets session_expired when the dashboard is over an hour old
(transforms.request_form_html gone), the case response is gone, or HtmlBody is empty; router 37
-> new screen 61: nothing sent, no failure alert, Start again re-reads the case. A genuine
Salesforce rejection on a fresh session still takes the failed-send path (42 / 43).

**CR-11.3 — AI feedback Submit restored (INT 6 Oct, tracker 26).** Gemma 1 Oct: revert to the
original thumbs + comments + Submit feedback, plus a form-data Yes/No for whether Submit was
clicked; comments box hides and a thank-you shows after Submit. Thumbs up submits at once,
thumbs down needs a comment (the original behaviour). ai_feedback_submitted defaults "No".

**CR-11.4 — FAST Admin: Returned direct debit and Card groups (INT after the 8 Oct release).**
returned_direct_debit -> Fee / Returned direct debit; card_group_move -> Not Online / Card
Group/Moves; card-group errors escalate (AI Action RULE 1). Approved copy and detection
phrases in corpay-uk-ai-action-patches-2026-10-05.md.
**Confirm with Corpay:** "Fee" / "Returned direct debit" against the Topic / Sub Topic matrix.

**CR-11.5 — Guardrail: multi-intent requests with an unrecognised part (INT after the 8 Oct
release, tracker 18).** Intent AI Actions return the matched intents and name the rest in
ai_exception_reason instead of escalating; the tree shows Corpay's agent prompt verbatim, the
recognised intents and the draft on new screen 62 with one free-text field
(agent_added_request); Generate re-drafts one complete reply (router 63 -> the lane's generation
AI Action, which reads agent_added_request), or the agent continues with the draft (node 64).
**Confirm with Corpay:** whether "input fields for each intent recognised" means more than a
list of the recognised intents; whether the guardrail applies to Homecharge as well as FAST.

**Not in this CR:** Compatible Chargers list-in-Zingtree enhancement (Gemma to confirm the
approach); pause/resume options write-up (Brent owes, 5 Oct); agent rerun on a new in-scope
request in the same thread (Alex, undecided); case status Status values (still with Alex);
vault file in AI emails (Brent to test); Networks queue (spec pending).

**Verified offline:** lint 0 errors on both trees; all 26 org-123 and converted fixtures walk
identically against the 30 Sep INT tree and the 6 Oct tree; 5 new fixtures (session expired,
feedback return x4) and 4 more for the next batch (returned direct debit, card group move, FAST
and Homecharge partial match) pass; response contract and CO 10 gate OK; env check OK.
Trees: `Email Automation - AI Actions INT (6 Oct INT release 2026-10-05).json`,
`Email Automation - AI Actions INT (new FAST use cases + guardrail 2026-10-05).json`.
**Live-only:** form-data HTML rendering on every converted screen; the feedback widget, the
hidden Submit button and the thank-you re-render; screen 61 on a real reopened session; screen
62 and the regenerate once the AI Action patches are in.

### CR-12 (2026-10-09) — Standup 9 Oct: updated quick texts, multi-intent Note paragraph, case status gate live

Sources: Spiky "Daily stand ups - UAT testing feedback" (9 Oct); Charley Gunning "Daily AI standup - 9th Oct"
email with "Allstar - Card groups PH1" and "Allstar - Returned direct debit PH1" attached. Wanted in INT for
Corpay testing Monday 12 Oct AM UK.

**CR-12.1 — Card groups quick text (AI Action 15).** Replace the card_group_move template with the 9 Oct
doc: covers both moving a card between sub-accounts ('Move Card') and between card groups ('Manage Card'),
each followed by its own Note. Links as linked text (tracker 7). Detection phrases and the error-wording
escalation are unchanged.

**CR-12.2 — Returned direct debit quick text (AI Action 15).** Second paragraph becomes "Going forward, to
avoid this fee, please ensure your Direct Debit payment is made on the agreed payment date."

**CR-12.3 — Multi-intent formatting (AI Action 15).** When card groups is merged with other intents, the Note
sits as its own paragraph under the bullet list, never inside a bullet.

**CR-12.4 — Topic for card groups.** card_group_move -> Not Online / Card Group/Moves (Charley, 9 Oct, and the
updated doc). Supersedes the 7 Oct Online row (Gemma); Brent confirmed Not Online. Node 17.

**CR-12.5 — Case status gate live.** Status values from Corpay: "Resolve status" / "Close status" (Charley, in
writing, "as they appear in the picklist") and "Resolved" / "Closed" (Alex, on the call). All four stop the AI
(Brent's call); screen 56 shows only "This case is resolved" / "This case is closed" (Alex / Charley) plus the
re-run button. Node 6, screen 56, Test Mode node 47.
**Confirm with Corpay:** which spelling is the real picklist value, so the other pair can be dropped.

**Not in this CR:** new intents, guardrails and the master-tree split (Charley to send before Monday's call);
GDPR template rewrite (Compliance, Monday); "most recent email in the thread" (Corpay scoping).

### CR-13 (2026-10-12) — Standup 12 Oct, new FAST use cases, master tree split

Sources: Gemma Danks "Daily AI standup - 12th Oct"; Charley Gunning "New use cases to be built" (Ecopoint, EPT,
Zero liability PH1 docs + "master tree request"); Spiky standups 9/9, 9/28, 9/29, 10/12.

**CR-13.1 — Blank admin wording (INT today, Thursday release).** Node 6: "AS Account Administrator is blank -
Please work this case as you normally would." (Gemma).

**CR-13.2 — Sentiment split (INT today, Thursday release).** AI Action 16 RULE 2: negative tone but still asking
for help -> BAU reply; complaint / pure anger -> escalation as now (Gemma). Test Mode scenarios
test_fast_admin_rdd_frustrated / _rdd_complaint. Optional apology line in AI 15 (Alex/Gemma on the call) is
Brent's call. Homecharge not changed.

**CR-13.3 — Ecopoint, Extended Payment Terms, Zero Liability (INT after Thursday, UAT next week).** Intents
ecopoint / extended_payment_terms / zero_liability -> Fee / Ecopoint | Extended Payment Terms | Zero Liability.
"Still not removed" / "issue opting out" escalates (RULE 1). Templates verbatim, links as linked text.
**Confirm:** Sub Topic spellings against the matrix; EPT "7 days or 37 days".

**CR-13.4 — Master tree split (INT after Thursday).** 109029630 keeps its id and becomes the master: case fetch,
Last Owner Queue Name routing, Test Mode and the shared outcomes (send / sent / failed / expired, escalation, not
automated). Branch trees in a new INT folder: FAST Admin, Homecharge, Networks (scaffold, off). Eligibility lives
in each branch (Gemma, 12 Oct). Routing now runs before eligibility. Files and runbook:
Workflow JSONs/Corpay (UK)/master-split 2026-10-12/.
