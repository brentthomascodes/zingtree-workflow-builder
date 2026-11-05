========================================================================
WORKFLOW DIFF — Register Errands
========================================================================

Before : Register Errands - Dynamic (BEFORE baseline 2026-09-04).json  (77 nodes)
After  : Register Errands - Dynamic (v53 single-env fields + execution log removed, 2026-09-04).json  (76 nodes)

## PLAIN SUMMARY

47 of 76 nodes are byte-for-byte identical to the original (62% untouched).
0 nodes added, 1 removed, 0 renumbered, 29 modified.

In plain terms:
  - GONE     node 89 — Render Execution Log [Script] (was reachable from nodes 83, 100)
  * CHANGED  node 5 — claude.md [Content]
               - content changed (1809 → 1876 lines) — claude.md
  * CHANGED  node 9 — Format Passengers [Script]
               - script code changed (97 → 40 lines) — Format Passengers
  * CHANGED  node 10 — Clear Session & Seed Zendesk Intake [Script]
               - page_title: "Clear session and start fresh order" → "Clear Session & Seed Zendesk Intake"
               - node_name: "Clear session state, then start a fresh order lookup" → "Clear session state, seed the Zendesk intake values"
               - script code changed (242 → 109 lines) — Clear Session & Seed Zendesk Intake
  * CHANGED  node 14 — Edvin - Find Order - Request Failed [Content]
               - content changed (486 → 447 characters) — Edvin - Find Order - Request Failed
  * CHANGED  node 16 — Zendesk - Add Internal Note - Request Failed [Content]
               - content changed (519 → 480 characters) — Zendesk - Add Internal Note - Request Failed
  * CHANGED  node 18 — ZD - Create Child Ticket - Request Failed [Content]
               - content changed (504 → 465 characters) — ZD - Create Child Ticket - Request Failed
  * CHANGED  node 21 — Format Internal Note [Script]
               - script code changed (152 → 83 lines) — Format Internal Note
  * CHANGED  node 27 — Stitch & Group PNR Action Selections [Script]
               - script code changed (239 → 238 lines) — Stitch & Group PNR Action Selections
  * CHANGED  node 28 — GET Edvin Errands - Request Failed [Content]
               - content changed (614 → 575 characters) — GET Edvin Errands - Request Failed
  * CHANGED  node 29 — Clear Data [Script]
               - script code changed (221 → 61 lines) — Clear Data
  * CHANGED  node 31 — Edvin - Register Errand - Request Failed [Content]
               - content changed (504 → 465 characters) — Edvin - Register Errand - Request Failed
  * CHANGED  node 32 — Loop Tickets (child + grand child) [Script]
               - script code changed (267 → 206 lines) — Loop Tickets (child + grand child)
  * CHANGED  node 40 — Get Child Ticket Details - Request Failed [Content]
               - content changed (513 → 474 characters) — Get Child Ticket Details - Request Failed
  * CHANGED  node 44 — Loop Errands to Register [Script]
               - script code changed (366 → 286 lines) — Loop Errands to Register
  * CHANGED  node 45 — Update Child Ticket - Request Failed [Content]
               - content changed (523 → 484 characters) — Update Child Ticket - Request Failed
  * CHANGED  node 46 — Format Types [Script]
               - script code changed (188 → 128 lines) — Format Types
  * CHANGED  node 48 — End Session [Content]
               - content changed (84 → 45 characters) — End Session
  * CHANGED  node 53 — Session Ended - Request Failed [Content]
               - content changed (366 → 327 characters) — Session Ended - Request Failed
  * CHANGED  node 58 — Check Customer Action Selections [Script]
               - script code changed (28 → 26 lines) — Check Customer Action Selections
  * CHANGED  node 61 — Insert Linked PNR's [Script]
               - script code changed (87 → 27 lines) — Insert Linked PNR's
  * CHANGED  node 64 — Set Side Conversation Id [Script]
               - script code changed (68 → 10 lines) — Set Side Conversation Id
  * CHANGED  node 65 — Resolve Ticket Id [Script]
               - script code changed (92 → 34 lines) — Resolve Ticket Id
  * CHANGED  node 83 — Is More PNR's? [Scoring]
               - continuation_node_id: 89 → 23 — Is More PNR's?
               - button added/changed: "" → node 23
               - button removed/replaced: "" → node 89
  * CHANGED  node 86 — API Failure - Log & Render [Script]
               - script code changed (162 → 49 lines) — API Failure - Log & Render
  * CHANGED  node 87 — Request Failed [Content]
               - content changed (72 → 33 characters) — Request Failed
  * CHANGED  node 93 — No-PNR Bridge (Unconfirmed Booking / Orphan) [Script]
               - script code changed (136 → 73 lines) — No-PNR Bridge (Unconfirmed Booking / Orphan)
  * CHANGED  node 95 — Validate Order Reference & Sync Zendesk Fields [Script]
               - page_title: "Check Order Reference Provided" → "Validate Order Reference & Sync Zendesk Fields"
               - node_name: "Check Order Reference Provided" → "Validate order reference, write back to Zendesk"
               - script code changed (76 → 33 lines) — Validate Order Reference & Sync Zendesk Fields
  * CHANGED  node 99 — Build Manual Errand Registration Card [Script]
               - script code changed (78 → 57 lines) — Build Manual Errand Registration Card
  * CHANGED  node 100 — Register This Errand in Edvin Manually [Content]
               - button added/changed: "I have registered this in Edvin::zt_manual_errand_registered" → node 23
               - button removed/replaced: "I have registered this in Edvin::zt_manual_errand_registered" → node 89

## TREE SHAPE

  node type                before    after    delta
  Content                      27       27       +0
  Data                          7        7       +0
  Scoring                      20       20       +0
  Script                       22       21       -1
  Tree                          1        1       +0
  TOTAL                        77       76       -1

  Root node unchanged (node 10).

## STRUCTURAL SANITY

  No broken links introduced.
  No nodes became unreachable.
  Pre-existing in the BEFORE tree (not caused by this edit): 0 broken link(s), 1 unreachable node(s).

## UNTOUCHED NODES (47)

  1, 2, 3, 4, 6, 7, 8, 11, 12, 13, 15, 17, 22, 23, 24, 25, 26, 30, 33, 34, 39, 41, 42, 43, 47, 54, 55, 56, 57, 59, 60, 62, 63, 66, 75, 76, 77, 78, 84, 88, 90, 91, 94, 96, 97, 98, 101

## TREE-LEVEL SETTINGS CHANGED (0)

  (none)

## COSMETIC / EDITOR-ONLY CHANGES (0) — ignore

  (none)

## LINE-LEVEL BODY DIFFS (27)

### node 5 — claude.md (content)

```diff
--- before/node 5 content
+++ after/node 5 content
@@ -37,15 +37,13 @@
   21 Format Internal Note -> 22 Add Internal Note (CO #57) -> 15 status
   15 -> 44 Loop Errands to Register (cursor) -> 78 Validate Errand Details
      -> 43 Register Errand (CO #160) -> 30 status
-  30 -> 83 Is More PNRs? -> loop to 44, else 89
+  30 -> 83 Is More PNRs? -> loop to 44, else 23
 
 CLOSE
-  89 Render Execution Log -> 23 Closing Call
+  23 Closing Call
   23 -> [47 Additional/Different Request -> 29 Clear Data -> 77] | [48 End Session]
-  48 End Session prints ${transforms.execution_log_html} - the run's read-out lands
-  at the end of the session, not on the Closing Call.
-
-FAILURE (shared - v45)
+
+FAILURE (shared)
   Every status check's failure branch (13, 15, 17, 26, 30, 39, 41) -> 86 API Failure -
   Log & Render -> 87 Request Failed -> [Retry: 88 Retry Router -> the Data node that
   failed, chosen by last_api_alias] | [End Session: 53]
@@ -72,11 +70,9 @@
   notes (node 12's existing per-row notes field), same ticket + errand loops.
 
 Both subflows are intentionally thin: node 93 is the only node that knows
-either exists. Everything from 42 through 89 is the exact same code normal
+either exists. Everything from node 42 onward is the exact same code normal
 orders run, driven off one synthetic customer_action_pnrs entry instead of
-one-per-real-PNR. See Changelog entry below for the fixes shipped alongside
-this (dev/prod field-id drift, node 89's plan-vs-receipt summary, node 27's
-blank-PNR ticket title).
+one-per-real-PNR.
 
 STILL OPEN before go-live (build guide section 6, unchanged by this session):
   - Confirm "Unconfirmed booking" contact reason IS Christina's "contact
@@ -162,13 +158,12 @@
   58 is byte-identical to production apart from a removed ZT.log, and still uses
   the every-row test from the 2026-08-27 fix. Verified, not assumed.
 
-DELIBERATE, DO NOT "FIX": node 29 (Clear Data) does not reset execution_log /
-  execution_log_html / failure_html, while node 10 does. validate_tree.js flags
-  that asymmetry, but it is correct: node 10 is a fresh session (Restart), node
-  29 is an Additional/Different Request CONTINUATION of the same session, and the
-  log is meant to span the whole session - node 89's "Run finished" line
-  delimits one run from the next. Resetting it there would throw away the first
-  request's history mid-session.
+DELIBERATE, DO NOT "FIX": node 29 (Clear Data) resets loop and reconciliation
+  state but NOT the Zendesk intake values, and not `contact_reason`. Node 10 is a
+  fresh session (Restart) and re-seeds everything from the ticket; node 29 is an
+  Additional/Different Request CONTINUATION of the same session, and node 47's
+  select has just written the agent's new contact reason through its score_var.
+  Re-seeding there would throw that pick away before node 95 can write it back.
 
 STILL OPEN (not touched in v48, needs its own pass): the unresolved-selection
   guard. Node 27 still sets has_unresolved_selections and builds
@@ -228,9 +223,7 @@
   fields she listed: Channel, Category, Type, Action, Notes, Genesys Interaction
   ID - plus the Zendesk ticket for traceability. Genesys interaction TYPE is
   deliberately NOT shown: she confirmed "it's not mandatory because it's the
-  channel". Node 99 also writes one INFO line to the execution log, so a run with
-  no "Edvin Register Errand" OK rows reads as intentional rather than as a
-  registration that vanished.
+  channel".
   Node 100's button carries ::zt_manual_errand_registered, so these sessions are
   countable in analytics.
 
@@ -297,9 +290,16 @@
   created_grandchild_ticket_keys, registered_errand_keys, and the
   ticket_already_created / skip_errand_registration flags. See "THIS TREE IS AN ETL"
   under Conventions before reintroducing any of them.
-- execution_log (FORM data) - see "EXECUTION LOG" under Conventions.
-  Companions: execution_log_seq, pending_api_node/step/alias/ref, last_api_alias,
-  transforms.execution_log_html, transforms.failure_html.
+- last_api_alias (FORM data) - the Connected Object alias of the request that is
+  about to fire, or that most recently fired. Set by one explicit
+  ZT.setFormData("last_api_alias", "<alias>") line in the script immediately
+  before each Data node (9, 21, 29, 32, 44, 64, 65, 93, 95); cleared only by node
+  10. Nodes 94 and 86 use it to name the failure, node 88 to pick the retry
+  target. See "ENVIRONMENT FIELDS" and "SHARED FAILURE SCREEN" under Conventions.
+- transforms.failure_html - the failure card node 86 builds, printed by node 87.
+- The five Zendesk intake values - order_reference, language, contact_reason,
+  genesys_conversation_id, genesys_interaction_type - see "ENVIRONMENT FIELDS"
+  under Conventions for where each one is read and written.
 
 - transforms.channel / transforms.category: full Edvin errand-config OBJECTS {id,name,categories}. Set in node 46. Store only .name on PNR items (see node 2).
 - transforms.customer_action_pnrs: array of PNR items {pnr, channel(name), channelId, category(name), categoryId, type, typeId, notes, actions_array}. Built in node 2, restitched in node 27.
@@ -363,45 +363,49 @@
 
 ## Conventions & gotchas
 
-- EXECUTION LOG (v46). Every API call this tree makes writes one line to the
-  `execution_log` FORM variable - form data, so it outlives the 1-hour transforms
-  TTL and a deep resume. It is a flat string with two delimiters so a parser needs
-  exactly two split() calls:
-      entries  split on  ~||~
-      fields   split on  ~:~   ->  seq, ts, node, step, status, code, ref, detail
-  status is OK | FAIL | SKIP | INFO. Anything a value could contain that looks like
-  a delimiter is neutralised by logClean() (tildes become hyphens, newlines become
-  spaces, 300-char cap per field). The whole string is capped at 20000 chars and
-  trims WHOLE entries off the front, never a partial one.
-  Mechanism, three functions, defined in a block that is byte-identical in every
-  script that logs (nodes 9, 10, 21, 29, 32, 44, 46, 61, 64, 65, 86, 89):
-      logArm(node, step, alias, ref)  the script immediately BEFORE a Data node
-                                      names the call that is about to happen
-      logFlush()                      first line of every script that can follow a
-                                      Data node - grades the armed call off
-                                      actions.<alias>._zt_meta and appends one entry
-      logWrite(...)                   direct append, for SKIP and INFO lines
-  A call is armed only when it is actually going to fire: node 32 and node 44 write
-  a SKIP line instead of arming when their idempotency guard says the work is done,
-  because arming a call that never fires would leave the PREVIOUS response under
-  the same alias for the next script to grade as this one's success.
-  Node 86 flushes the failure BEFORE the agent sees the retry screen and then
-  re-arms the same call, so a request that failed once and succeeded on retry
-  leaves both lines behind. That was the whole point of centralising the failure
-  screen - the per-request screens could not do it.
-  Node 89 renders the log grouped failures-first into transforms.execution_log_html
-  (nodes 23 and 53 print it; node 86 prints it on the failure screen too).
-  NOTHING ROUTES ON THE LOG. It is a read-out, not state.
-  DUPLICATION IS DELIBERATE BUT NOT FREE: the block is copied into 12 scripts
-  because Zingtree User Functions (ZT.<yourFunction>) are defined in the admin UI,
-  not in a tree export, so a tree-only change cannot centralise it. If someone
-  registers logArm/logFlush/logWrite as User Functions, every one of those blocks
-  collapses to a single ZT.logFlush() line. Until then, a change to the block is a
-  change to 12 nodes - the same drift hazard already documented for BUCKET_BY_ID
-  in nodes 2 and 46.
-  ZT.log() was removed tree-wide in the same pass (Brent, 2026-09-02): it wrote to
-  Execution Insights, which is a separate store nobody was reading, and this log
-  covers the same ground where it can actually be seen.
+- ENVIRONMENT FIELDS - THREE PLACES, ONE ID EACH. This tree runs against ONE
+  Zendesk org at a time. Five values arrive as inbound query parameters named
+  after that org's ticket-field ids, and the tree standardises them immediately:
+
+      Zendesk field             this export (dev, org 116)      tree name
+      Order_Reference           custom_field_33772689958162     order_reference
+      Language                  custom_field_28137345621650     language
+      Contact_Reason            custom_field_29559177650834     contact_reason
+      Genesys_Conversation_ID   custom_field_31975964556050     genesys_conversation_id
+      Genesys_Interaction_Type  custom_field_31213052370194     genesys_interaction_type
+
+  READ once, in node 10 (root). WRITE BACK in node 95, and only for the two the
+  agent can change on node 77 - order_reference and contact_reason - and only when
+  the value is non-empty, so a blank never clears a field the ticket already
+  holds. DECLARE in predefined_vars. Nothing else in the tree may name a
+  custom_field_ id: every other node reads the tree name.
+
+  A promote or demote therefore touches exactly those three places, and the
+  `etg-env-promote` skill's remapper is what does it. Do NOT reintroduce the
+  dual-id table that read the prod id with the dev id as a fallback and then fanned
+  the resolved value back out to both: it makes a stray reference to the WRONG
+  org's field resolve to a real value instead of an empty one, which is how a
+  cross-environment value becomes a stale reference nobody can see.
+
+  orderReference (camelCase) is a deliberate mirror of order_reference, kept only
+  because at least one Connected Object request body in the admin UI reads that
+  name. Retire it once every CO body is confirmed to read order_reference.
+
+  Node 93 sets order_reference to the orphan sentinel "-999" for Edvin. That is
+  session state and is deliberately NOT written back to the Zendesk field.
+
+- NO EXECUTION LOG, NO SHARED BLOCKS. The tree had an `execution_log` form
+  variable with logArm/logFlush/logWrite pasted byte-identically into 12 scripts
+  and a node 89 that rendered it. All of it is gone. What survives is the one
+  thing that actually routed: `last_api_alias`, now written by a single explicit
+  ZT.setFormData line in the script before each Data node. Nothing else in this
+  tree may reintroduce a helper block copied into two nodes - if two nodes need
+  the same code, the design is wrong.
+  WHAT WENT WITH IT, if it is ever wanted back: the per-step OK/FAIL read-out that
+  nodes 23, 48, 53 and the failure screens printed, and node 89's end-of-run
+  "actual vs planned" receipt (tickets created and errands registered against what
+  node 27 planned). Rebuild the receipt from tree state - work_queue,
+  resolved_ticket_ids_by_queue_index, final_pnrs - not from a log.
 
 - UNIFIED TICKET LOOP (v46). Child, silent and grand child tickets all run through
   ONE loop body: 32 -> 84 -> 33 -> 17 -> 62 -> 64 -> 63 -> 39 -> 65 -> 66 ->
@@ -438,19 +442,20 @@
   pretended to be a safety net, and a replay they suppressed silently was worse to
   debug than one that shows up in the log.
   What actually protects a run now: every API call is status-checked, every failure
-  routes to the shared failure screen (86/87/88), and every call - success, failure
-  and retry - is written to the execution log. A Back-nav replay of node 27 DOES
-  re-run the ETL and DOES create a second set of tickets. That is accepted, and it
-  is visible: walk_v46.mjs's "replay node 27" scenario asserts exactly that, and
-  asserts the log contains all six creates with no SKIP lines hiding any of them.
+  routes to the shared failure screen (86 -> 94 -> per-request screen, or 87/88).
+  A Back-nav replay of node 27 DOES re-run the ETL and DOES create a second set of
+  tickets. That is accepted rather than suppressed: a replay that shows up in
+  Zendesk is easier to debug than one a key list silently swallowed.
   If duplicates ever become a real operational problem, the fix is upstream - stop
   node 25's Back from re-entering node 27 - not a key list inside the loop.
 
-- SHARED FAILURE SCREEN (v46). Nodes 14, 16, 18, 28, 31, 40 and 45 - seven
-  near-identical "Request Failed" content nodes - are replaced by 86 (script: log
-  the failure, build the screen) -> 87 (content) -> 88 (retry router). 88 branches
-  on last_api_alias, a form variable logArm() sets and never clears, back to the
-  Data node that failed. ADDING A NEW API CALL MEANS ADDING A BUTTON TO NODE 88.
+- SHARED FAILURE SCREEN. Every status check's failure branch goes to 86 (script:
+  grade the call from actions[last_api_alias]._zt_meta, build failure_html) -> 94
+  (screen router) -> the per-request screen for that alias, or 87 -> 88 (retry
+  router) as the fallback. Both routers branch on last_api_alias.
+  ADDING A NEW API CALL MEANS ADDING A BUTTON TO NODE 94 *AND* NODE 88, AND A
+  ZT.setFormData("last_api_alias", "<alias>") LINE TO THE SCRIPT BEFORE ITS DATA
+  NODE.
   If you forget, its Retry falls through node 88's default straight to node 53
   (Session Ended) - the run ends safely, but the agent cannot retry.
 
@@ -1807,3 +1812,65 @@
 Not touched, still open, out of scope for this pass: the unresolved-selection guard (node 27),
 silent-ticket auto-resolve, the generic Edvin errand creator, and the CO #181 caching question -
 see claude.md history above, none of these were part of today's ask.
+
+## v53 (2026-09-04) - single-environment field handling; execution log removed
+
+TWO CHANGES, BOTH REQUESTED BY BRENT.
+
+(1) ENV_FIELDS RETIRED - BACK TO A STANDARD PROMOTE/DEMOTE TREE.
+    Nodes 10, 29, 93 and 95 each carried a byte-identical ENV FIELD RESOLUTION
+    block: a table pairing the PROD and DEV id for all five Zendesk intake
+    fields, a resolver that read the prod id with the dev id as a fallback, and
+    a fan-out that wrote the resolved value back to BOTH ids.
+    Why it is gone: the fan-out is what made it dangerous. Writing a value to the
+    other environment's field id means a stray reference to that id - in a CO
+    body, a merge field, a paste from the other org - resolves to a real value
+    instead of an empty one, so a cross-environment mistake reads as correct and
+    becomes a stale reference nobody can see. It also defeated the
+    `etg-env-promote` remapper, which is built to move ONE set of ids.
+    What replaced it, per the "ENVIRONMENT FIELDS" convention above:
+      node 10  reads each dev id ONCE and writes the tree name (order_reference,
+               language, contact_reason, genesys_conversation_id,
+               genesys_interaction_type), plus the orderReference mirror
+      node 77  form fields already bind the tree name (contact_reason)
+      node 95  writes order_reference and contact_reason back to their dev ids,
+               guarded so a blank never clears a populated Zendesk field
+      node 93  reads the tree names; the -999 orphan sentinel is NOT written back
+      node 29  no longer re-seeds - node 47's fresh contact-reason pick survives
+    predefined_vars keeps its five dev declarations, unchanged. Promotion is now
+    the `etg-env-promote` script's job again: three places to remap, not four
+    duplicated tables.
+
+(2) EXECUTION LOG REMOVED IN FULL.
+    The shared logging block (LOG_VAR/logClean/logWrite/logArm/logFlush) is gone
+    from all 12 scripts, node 89 (Render Execution Log) is deleted, node 99's
+    inline log append is gone, and ${transforms.execution_log_html} is stripped
+    from nodes 14, 16, 18, 28, 31, 40, 45, 48, 53 and 87.
+    last_api_alias survives as a plain form variable, written by one explicit
+    ZT.setFormData line in each script that precedes a Data node, so nodes 88, 94
+    and 86 route exactly as before.
+    Node 86 was rewritten to grade the failed call from
+    actions[last_api_alias]._zt_meta and label it from a local alias->name map,
+    instead of from the log's pending_api_* variables.
+    Rewiring: 83's else and node 100's button now go straight to 23 (Closing
+    Call). Node 10 no longer resets execution_log / execution_log_seq /
+    pending_api_* / execution_log_html.
+    LOST, DELIBERATELY: the per-step OK/FAIL read-out, and node 89's actual-vs-
+    planned receipt. See "NO EXECUTION LOG" under Conventions for how to rebuild
+    the receipt from tree state if it is wanted back.
+
+(3) BUG FIXED IN PASSING. Node 93 reaches node 42 (GET Edvin Errands) but never
+    armed it, so a failure there was blamed on findorder - node 94 showed the
+    Find Order screen and node 88 retried node 4. Node 93 now sets
+    last_api_alias to edvin__errand_configuration.
+
+(4) DEAD CODE AND COMMENTS. Node 29's ~30-line commented-out copy of node 10 is
+    gone. Every comment naming a version (v19/v24/v35/v37/v45/v50/v51), a dated
+    review, a Slack DM or a removed node has been rewritten to describe the code
+    as it now stands. Business-rule attributions with no version in them (Elis on
+    the -999 sentinel, Christina on the manual-registration card and child-ticket
+    language) were kept, minus their dates. History lives in this node.
+
+NOT DONE, STILL OPEN: node 10 and node 29 still write most loop state to
+transforms rather than form data, which the house rule now says should be form
+data. That is its own pass.
```

### node 9 — Format Passengers (script code)

```diff
--- before/node 9 content
+++ after/node 9 content
@@ -1,63 +1,3 @@
-// ===== EXECUTION LOG (shared block - keep IDENTICAL in every script that logs) =====
-// One growing string in FORM data. Form data has no TTL, so this survives the
-// 1-hour transforms expiry and a deep resume. Two delimiters, so a parser only
-// ever needs two split() calls:
-//     entries   split on  ~||~
-//     fields    split on  ~:~   ->  seq, ts, node, step, status, code, ref, detail
-// status is one of OK | FAIL | SKIP | INFO. Node 89 renders it; nothing routes on it.
-const LOG_VAR = "execution_log";
-const LOG_REC = "~||~";
-const LOG_FLD = "~:~";
-const LOG_MAX = 20000;
-
-function logClean(v) {
-  if (v === null || v === undefined) return "";
-  return String(v).replace(/~/g, "-").replace(/[\r\n\t]+/g, " ").trim().slice(0, 300);
-}
-
-function logWrite(node, step, status, code, ref, detail) {
-  const seq = parseInt(ZT.getVariableValue("execution_log_seq", 0), 10) + 1;
-  const entry = [seq, new Date().toISOString(), node, step, status, code, ref, detail]
-    .map(logClean).join(LOG_FLD);
-  let entries = ZT.getVariableValue(LOG_VAR, "");
-  entries = entries ? entries.split(LOG_REC) : [];
-  entries.push(entry);
-  // Trim whole entries off the front, never a partial one.
-  while (entries.join(LOG_REC).length > LOG_MAX && entries.length > 1) entries.shift();
-  ZT.setFormData(LOG_VAR, entries.join(LOG_REC));
-  ZT.setFormData("execution_log_seq", seq);
-}
-
-// Called by the script immediately BEFORE a Data node fires, naming the call that
-// is about to happen. Whoever runs next - the success-path script, or node 86 on
-// the failure path - grades it from actions.<alias>._zt_meta.
-function logArm(node, step, alias, ref) {
-  ZT.setFormData("pending_api_node", node);
-  ZT.setFormData("pending_api_step", step);
-  ZT.setFormData("pending_api_alias", alias);
-  ZT.setFormData("pending_api_ref", ref || "");
-  ZT.setFormData("last_api_alias", alias); // never cleared - node 88 retries on it
-}
-
-// First line of EVERY script that can follow a Data node. Appends exactly one
-// OK/FAIL entry for the armed call, then disarms so it is never double-counted.
-function logFlush() {
-  const alias = ZT.getVariableValue("pending_api_alias", "");
-  if (!alias) return;
-  const res = (typeof actions !== "undefined" && actions[alias]) ? actions[alias] : null;
-  const meta = (res && res._zt_meta && res._zt_meta.response) ? res._zt_meta.response : {};
-  const code = meta.code || meta.status || "";
-  const ok = String(code).charAt(0) === "2";
-  const detail = ok ? "" : (meta.message || meta.error ||
-    (res ? JSON.stringify(res.errors || res.error || res.description || res) : "no response captured"));
-  logWrite(ZT.getVariableValue("pending_api_node", ""), ZT.getVariableValue("pending_api_step", ""),
-    ok ? "OK" : "FAIL", code, ZT.getVariableValue("pending_api_ref", ""), detail);
-  ZT.setFormData("pending_api_alias", "");
-}
-
-logFlush();
-// ===== END EXECUTION LOG BLOCK =====
-
 let selected_passengers = views.findorder || [];
 let is_selected_passengers = selected_passengers[0]?.passengerFirstName != "" && selected_passengers[0]?.passengerId != null
 ZT.setFormData("is_selected_passengers", is_selected_passengers);
@@ -94,4 +34,7 @@
 
 ZT.setViewData("findorder", [])
 
-logArm("node 42", "GET Edvin Errands", "edvin__errand_configuration", ZT.getVariableValue("orderReference", ""));
+// Node 42 (GET Edvin Errands) fires next. Names the call so the failure screen router
+// (node 94) and the retry router (node 88) know which request to blame and
+// which Data node to re-fire.
+ZT.setFormData("last_api_alias", "edvin__errand_configuration");
```

### node 10 — Clear Session & Seed Zendesk Intake (script code)

```diff
--- before/node 10 content
+++ after/node 10 content
@@ -1,73 +1,11 @@
-// ===== EXECUTION LOG (shared block - keep IDENTICAL in every script that logs) =====
-// One growing string in FORM data. Form data has no TTL, so this survives the
-// 1-hour transforms expiry and a deep resume. Two delimiters, so a parser only
-// ever needs two split() calls:
-//     entries   split on  ~||~
-//     fields    split on  ~:~   ->  seq, ts, node, step, status, code, ref, detail
-// status is one of OK | FAIL | SKIP | INFO. Node 89 renders it; nothing routes on it.
-const LOG_VAR = "execution_log";
-const LOG_REC = "~||~";
-const LOG_FLD = "~:~";
-const LOG_MAX = 20000;
+// Tree ROOT. Runs on a fresh launch and on every native Restart (Restart returns
+// to the root). A ?session_id= deep resume re-enters at the last content node and
+// skips this script, so an in-progress session keeps its state.
+//
+// Two jobs: clear everything a previous run left behind, then seed the Zendesk
+// intake values under the names the rest of the tree reads.
 
-function logClean(v) {
-  if (v === null || v === undefined) return "";
-  return String(v).replace(/~/g, "-").replace(/[\r\n\t]+/g, " ").trim().slice(0, 300);
-}
-
-function logWrite(node, step, status, code, ref, detail) {
-  const seq = parseInt(ZT.getVariableValue("execution_log_seq", 0), 10) + 1;
-  const entry = [seq, new Date().toISOString(), node, step, status, code, ref, detail]
-    .map(logClean).join(LOG_FLD);
-  let entries = ZT.getVariableValue(LOG_VAR, "");
-  entries = entries ? entries.split(LOG_REC) : [];
-  entries.push(entry);
-  // Trim whole entries off the front, never a partial one.
-  while (entries.join(LOG_REC).length > LOG_MAX && entries.length > 1) entries.shift();
-  ZT.setFormData(LOG_VAR, entries.join(LOG_REC));
-  ZT.setFormData("execution_log_seq", seq);
-}
-
-// Called by the script immediately BEFORE a Data node fires, naming the call that
-// is about to happen. Whoever runs next - the success-path script, or node 86 on
-// the failure path - grades it from actions.<alias>._zt_meta.
-function logArm(node, step, alias, ref) {
-  ZT.setFormData("pending_api_node", node);
-  ZT.setFormData("pending_api_step", step);
-  ZT.setFormData("pending_api_alias", alias);
-  ZT.setFormData("pending_api_ref", ref || "");
-  ZT.setFormData("last_api_alias", alias); // never cleared - node 88 retries on it
-}
-
-// First line of EVERY script that can follow a Data node. Appends exactly one
-// OK/FAIL entry for the armed call, then disarms so it is never double-counted.
-function logFlush() {
-  const alias = ZT.getVariableValue("pending_api_alias", "");
-  if (!alias) return;
-  const res = (typeof actions !== "undefined" && actions[alias]) ? actions[alias] : null;
-  const meta = (res && res._zt_meta && res._zt_meta.response) ? res._zt_meta.response : {};
-  const code = meta.code || meta.status || "";
-  const ok = String(code).charAt(0) === "2";
-  const detail = ok ? "" : (meta.message || meta.error ||
-    (res ? JSON.stringify(res.errors || res.error || res.description || res) : "no response captured"));
-  logWrite(ZT.getVariableValue("pending_api_node", ""), ZT.getVariableValue("pending_api_step", ""),
-    ok ? "OK" : "FAIL", code, ZT.getVariableValue("pending_api_ref", ""), detail);
-  ZT.setFormData("pending_api_alias", "");
-}
-
-logFlush();
-// ===== END EXECUTION LOG BLOCK =====
-
-// Clear session and start a fresh order.
-// This node is the tree ROOT, so it runs on a fresh launch AND whenever the
-// agent presses Restart (native Restart returns to the root node). A valid
-// ?session_id= deep-resume re-enters at the last content node and SKIPS this
-// script, so an in-progress session is preserved.
-// Clears all intake + child/grandchild loop STATE so a new run starts clean.
-// Inbound query params (order id, custom_field_29559177650834,
-// zendeskChannelIdentifier, errand_api_path) are NOT touched here.
-
-// Intake-loop transforms
+// --- Intake-loop state ---------------------------------------------------------
 ZT.setTransformData("customer_action_pnrs", []);
 ZT.setTransformData("final_pnrs", []);
 ZT.setTransformData("final_pnrs_count", 0);
@@ -79,42 +17,28 @@
 ZT.setTransformData("actions_array", []);
 ZT.setTransformData("customer_action_table_html", ``);
 ZT.setTransformData("internal_note_details", ``);
+ZT.setFormData("is_more_pnrs", false);
 
-// Child / grandchild ticket loop transforms
-ZT.setTransformData("child_ticket", {});
-ZT.setTransformData("pnr_buckets", {});
-// v35 - the duplicate guards read these; nodes 14/16's confirmed-only lists above are
-// reconciliation input for node 21. Both must clear together or a genuinely new pass
-// over the same PNRs is suppressed.
+// --- Reconciliation state read by node 21 --------------------------------------
+// unresolved_selections and its rendered list are node 21's reconciliation input,
+// and the duplicate guards read the same values. They clear together or a
+// genuinely new pass over the same PNRs is suppressed as a duplicate.
 ZT.setTransformData("unresolved_selections", []);
-// v24 state: the routing guard's inputs and the reconciliation list.
 ZT.setTransformData("unresolved_note_html", ``);
 ZT.setTransformData("planned_ticket_titles", []);
 ZT.setFormData("has_unresolved_selections", false);
 ZT.setFormData("unresolved_selections_count", 0);
 
-// Loop counters / flags (form data)
-ZT.setFormData("is_more_pnrs", false);
-ZT.setFormData("side_conversation_id", "");
-ZT.setTransformData("ticket_ids_by_errand_key", {});
-ZT.setTransformData("parent_ticket_ids_by_errand_key", {});
-// update_ticket_tag reset removed in v24: node 31 "Update Tags" was retired and
-// nothing reads this variable. Tagging is the ::tag_name button-text convention.
-
-// v37 - the unrolled resolve-chain's routing flags, plus the distinct BLOCKED
-// reconciliation lists node 21 reads. Must clear together with everything else
-// here or stale state leaks into a fresh session. (v36's child_ticket_resolve_attempts
-// counter is gone - v37 replaced the counted retry loop with distinct nodes; the
-// engine flagged the counted loop as an "invalid loop" on live import.)
-
-// orderReference is resolved and mirrored by the ENV FIELD RESOLUTION block below.
-
-// --- v45 unified ticket loop state -----------------------------------------
+// --- Unified ticket loop state (node 32) ---------------------------------------
 ZT.setTransformData("work_queue", []);
 ZT.setTransformData("current_ticket", {});
 ZT.setTransformData("child_ticket", {});
+ZT.setTransformData("pnr_buckets", {});
 ZT.setTransformData("ticket_card_html", ``);
 ZT.setTransformData("resolved_ticket_ids_by_queue_index", {});
+ZT.setTransformData("ticket_ids_by_errand_key", {});
+ZT.setTransformData("parent_ticket_ids_by_errand_key", {});
+ZT.setFormData("side_conversation_id", "");
 ZT.setFormData("queue_index", 0);
 ZT.setFormData("grandchild_index", -1);
 ZT.setFormData("current_queue_index", 0);
@@ -124,24 +48,36 @@
 ZT.setFormData("ticket_display_index", 0);
 ZT.setFormData("tickets_total", 0);
 
-// --- execution log ----------------------------------------------------------
-// Wiped ONLY here (fresh start / Restart). An Additional or Different Request
-// goes through node 29, which deliberately leaves the log alone so one Zendesk
-// ticket's whole session reads as one log.
-ZT.setFormData("execution_log", "");
-ZT.setFormData("execution_log_seq", 0);
-ZT.setFormData("pending_api_alias", "");
-ZT.setFormData("pending_api_node", "");
-ZT.setFormData("pending_api_step", "");
-ZT.setFormData("pending_api_ref", "");
+// --- Failure-path state --------------------------------------------------------
+ZT.setTransformData("failure_html", ``);
 ZT.setFormData("last_api_alias", "");
-ZT.setTransformData("execution_log_html", ``);
-ZT.setTransformData("failure_html", ``);
 
-logArm("node 4", "Edvin Find Order", "findorder", ZT.getVariableValue("orderReference", ""));
+// --- Zendesk intake ------------------------------------------------------------
+// These five values arrive as inbound query parameters named after THIS org's
+// Zendesk ticket-field ids. This is the only place in the tree that reads them;
+// every other node reads the snake_case name written here. The ids are
+// environment-specific, so promoting or demoting this tree only has to be correct
+// in three places: this block, node 95's write-back, and predefined_vars.
+//
+// Seeded, not merged: on a fresh launch and on Restart the ticket's current values
+// are the right starting point, so any pick a previous run left in these names is
+// overwritten here rather than inherited.
+const order_reference = ZT.getVariableValue("custom_field_33772689958162", "");
 
-// Format Zendesk Contact Reasons
+ZT.setFormData("order_reference", order_reference);
+ZT.setFormData("language", ZT.getVariableValue("custom_field_28137345621650", ""));
+ZT.setFormData("contact_reason", ZT.getVariableValue("custom_field_29559177650834", ""));
+ZT.setFormData("genesys_conversation_id", ZT.getVariableValue("custom_field_31975964556050", ""));
+ZT.setFormData("genesys_interaction_type", ZT.getVariableValue("custom_field_31213052370194", ""));
 
+// orderReference (camelCase) is the name at least one Connected Object request
+// body uses. Those bodies live in the Zingtree admin UI, not in this export, so
+// the mirror stays until every one of them is confirmed to read order_reference.
+ZT.setFormData("orderReference", order_reference);
+
+// --- Contact Reason options ----------------------------------------------------
+// Source for the two dynamic selects on nodes 77 and 47. A dynamic list source
+// addresses a transform by path, so this one has to be a transform.
 let contact_reasons_dynamic = {
   fl_paths: [
     { label: "Contact Reason Rebooking", value: "contact_reason__rebooking" },
@@ -170,73 +106,4 @@
   ]
 };
 
-ZT.setTransformData("contact_reasons_dynamic", contact_reasons_dynamic)
-
-// Clear the standardized env names BEFORE resolving, so a Restart re-reads them
-// from the inbound Zendesk parameters instead of inheriting the previous
-// session's agent picks. Mid-session (nodes 95 / 93 / 29) the pick SHOULD win,
-// which is what the precedence in the block below does.
-["order_reference", "language", "contact_reason",
- "genesys_conversation_id", "genesys_interaction_type"]
-  .forEach(function (name) { ZT.setFormData(name, ""); });
-
-// ===== ENV FIELD RESOLUTION (shared block - keep IDENTICAL in nodes 10, 29, 93, 95) =====
-// Zendesk custom-field ids differ per org, so referencing custom_field_<id>
-// throughout the tree is what made promote/demote risky: every script, merge
-// field and payload had to be rewritten, and one missed reference reads a field
-// the target org does not have (that is exactly how the Genesys "NA" bug and the
-// contact-reason reader/writer split happened - see the changelog).
-// This block is the ONE place that knows those ids. It resolves each field once,
-// PROD id first with the DEV id as the fallback, and publishes a stable
-// snake_case name the rest of the tree reads. A promote or demote now only has to
-// be correct here.
-//
-// Both ids are tried on every run in BOTH environments on purpose: whichever org
-// this tree is running in populates one and leaves the other empty, so this block
-// is correct in dev and in prod with no edit at all.
-//
-// PRECEDENCE: the standardized name wins, then the prod id, then the dev id.
-// The standardized name is FIRST because it is where the agent's answer lands -
-// node 6's two Contact Reason selects post directly to `contact_reason` and node
-// 47's re-select writes it through score_var (v50). The custom_field_ ids behind
-// it are the inbound-parameter fallback: they seed the value at the start of a
-// session and are what a fresh Zendesk ticket supplies.
-// Node 10 clears the standardized names before it resolves, so a Restart re-reads
-// the inbound parameters instead of inheriting the previous session's picks; a
-// deep resume (?session_id=) skips node 10 and therefore keeps them, which is the
-// behaviour you want in both cases.
-const ENV_FIELDS = {
-  order_reference:          ["custom_field_27823498043154", "custom_field_33772689958162"],
-  language:                 ["custom_field_27659659178002", "custom_field_28137345621650"],
-  contact_reason:           ["custom_field_29658558478738", "custom_field_29559177650834"],
-  genesys_conversation_id:  ["custom_field_30866832265234", "custom_field_31975964556050"],
-  genesys_interaction_type: ["custom_field_30555623661842", "custom_field_31213052370194"]
-};
-
-function resolveEnvFields() {
-  const resolved = {};
-  Object.keys(ENV_FIELDS).forEach(function (name) {
-    const ids = ENV_FIELDS[name];
-    let value = String(ZT.getVariableValue(name, "") || "").trim();
-    for (let i = 0; i < ids.length && !value; i++) {
-      value = String(ZT.getVariableValue(ids[i], "") || "").trim();
-    }
-    ZT.setFormData(name, value);
-    // Fan the resolved value back out to BOTH orgs' ids (v50, Brent). Anything
-    // that still names one of them - a Connected Object request body in the admin
-    // UI, a merge field, a future edit, a paste from the other environment - then
-    // reads the right value instead of an empty one. This is what makes a stray
-    // custom_field_ reference SAFE rather than silently wrong, in either org.
-    ids.forEach(function (id) { ZT.setFormData(id, value); });
-    resolved[name] = value;
-  });
-  // orderReference (camelCase) stays as a MIRROR of order_reference: the Connected
-  // Object request bodies live in the Zingtree admin UI, not in this export, and
-  // at least one reads ${orderReference}. Dropping it would empty that payload
-  // silently - same reasoning as transforms.child_ticket keeping its name.
-  ZT.setFormData("orderReference", resolved.order_reference);
-  return resolved;
-}
-
-const env = resolveEnvFields();
-// ===== END ENV FIELD RESOLUTION BLOCK =====
+ZT.setTransformData("contact_reasons_dynamic", contact_reasons_dynamic);
```

### node 14 — Edvin - Find Order - Request Failed (content)

```diff
--- before/node 14 content
+++ after/node 14 content
@@ -1 +1 @@
-<div class="zt-content-block zt-cb-type-alert"><div class="zt-cb-title"><i class="zt-cb-icon" contenteditable="false"></i><h3>Request Failed</h3></div><div class="zt-cb-body"><p>The <strong>Edvin - Find Order</strong> request did not complete successfully (expected a 200 or 201 response).</p><p>You can try the request again, or end this session.</p><p><strong>API Response (debug):</strong></p><p>${actions.findorder | stringify}</p></div></div><p>${transforms.execution_log_html}</p>
+<div class="zt-content-block zt-cb-type-alert"><div class="zt-cb-title"><i class="zt-cb-icon" contenteditable="false"></i><h3>Request Failed</h3></div><div class="zt-cb-body"><p>The <strong>Edvin - Find Order</strong> request did not complete successfully (expected a 200 or 201 response).</p><p>You can try the request again, or end this session.</p><p><strong>API Response (debug):</strong></p><p>${actions.findorder | stringify}</p></div></div>
```

### node 16 — Zendesk - Add Internal Note - Request Failed (content)

```diff
--- before/node 16 content
+++ after/node 16 content
@@ -1 +1 @@
-<div class="zt-content-block zt-cb-type-alert"><div class="zt-cb-title"><i class="zt-cb-icon" contenteditable="false"></i><h3>Request Failed</h3></div><div class="zt-cb-body"><p>The <strong>Zendesk - Add Internal Note</strong> request did not complete successfully (expected a 200 or 201 response).</p><p>You can try the request again, or end this session.</p><p><strong>API Response (debug):</strong></p><p>${actions.create_internal_note__no_group_id | stringify}</p></div></div><p>${transforms.execution_log_html}</p>
+<div class="zt-content-block zt-cb-type-alert"><div class="zt-cb-title"><i class="zt-cb-icon" contenteditable="false"></i><h3>Request Failed</h3></div><div class="zt-cb-body"><p>The <strong>Zendesk - Add Internal Note</strong> request did not complete successfully (expected a 200 or 201 response).</p><p>You can try the request again, or end this session.</p><p><strong>API Response (debug):</strong></p><p>${actions.create_internal_note__no_group_id | stringify}</p></div></div>
```

### node 18 — ZD - Create Child Ticket - Request Failed (content)

```diff
--- before/node 18 content
+++ after/node 18 content
@@ -1 +1 @@
-<div class="zt-content-block zt-cb-type-alert"><div class="zt-cb-title"><i class="zt-cb-icon" contenteditable="false"></i><h3>Request Failed</h3></div><div class="zt-cb-body"><p>The <strong>ZD - Create ${ticket_kind}</strong> request did not complete successfully (expected a 200 or 201 response).</p><p>You can try the request again, or end this session.</p><p><strong>API Response (debug):</strong></p><p>${actions.create_child_ticket | stringify}</p></div></div><p>${transforms.execution_log_html}</p>
+<div class="zt-content-block zt-cb-type-alert"><div class="zt-cb-title"><i class="zt-cb-icon" contenteditable="false"></i><h3>Request Failed</h3></div><div class="zt-cb-body"><p>The <strong>ZD - Create ${ticket_kind}</strong> request did not complete successfully (expected a 200 or 201 response).</p><p>You can try the request again, or end this session.</p><p><strong>API Response (debug):</strong></p><p>${actions.create_child_ticket | stringify}</p></div></div>
```

### node 21 — Format Internal Note (script code)

```diff
--- before/node 21 content
+++ after/node 21 content
@@ -1,75 +1,6 @@
-// ===== EXECUTION LOG (shared block - keep IDENTICAL in every script that logs) =====
-// One growing string in FORM data. Form data has no TTL, so this survives the
-// 1-hour transforms expiry and a deep resume. Two delimiters, so a parser only
-// ever needs two split() calls:
-//     entries   split on  ~||~
-//     fields    split on  ~:~   ->  seq, ts, node, step, status, code, ref, detail
-// status is one of OK | FAIL | SKIP | INFO. Node 89 renders it; nothing routes on it.
-const LOG_VAR = "execution_log";
-const LOG_REC = "~||~";
-const LOG_FLD = "~:~";
-const LOG_MAX = 20000;
-
-function logClean(v) {
-  if (v === null || v === undefined) return "";
-  return String(v).replace(/~/g, "-").replace(/[\r\n\t]+/g, " ").trim().slice(0, 300);
-}
-
-function logWrite(node, step, status, code, ref, detail) {
-  const seq = parseInt(ZT.getVariableValue("execution_log_seq", 0), 10) + 1;
-  const entry = [seq, new Date().toISOString(), node, step, status, code, ref, detail]
-    .map(logClean).join(LOG_FLD);
-  let entries = ZT.getVariableValue(LOG_VAR, "");
-  entries = entries ? entries.split(LOG_REC) : [];
-  entries.push(entry);
-  // Trim whole entries off the front, never a partial one.
-  while (entries.join(LOG_REC).length > LOG_MAX && entries.length > 1) entries.shift();
-  ZT.setFormData(LOG_VAR, entries.join(LOG_REC));
-  ZT.setFormData("execution_log_seq", seq);
-}
-
-// Called by the script immediately BEFORE a Data node fires, naming the call that
-// is about to happen. Whoever runs next - the success-path script, or node 86 on
-// the failure path - grades it from actions.<alias>._zt_meta.
-function logArm(node, step, alias, ref) {
-  ZT.setFormData("pending_api_node", node);
-  ZT.setFormData("pending_api_step", step);
-  ZT.setFormData("pending_api_alias", alias);
-  ZT.setFormData("pending_api_ref", ref || "");
-  ZT.setFormData("last_api_alias", alias); // never cleared - node 88 retries on it
-}
-
-// First line of EVERY script that can follow a Data node. Appends exactly one
-// OK/FAIL entry for the armed call, then disarms so it is never double-counted.
-function logFlush() {
-  const alias = ZT.getVariableValue("pending_api_alias", "");
-  if (!alias) return;
-  const res = (typeof actions !== "undefined" && actions[alias]) ? actions[alias] : null;
-  const meta = (res && res._zt_meta && res._zt_meta.response) ? res._zt_meta.response : {};
-  const code = meta.code || meta.status || "";
-  const ok = String(code).charAt(0) === "2";
-  const detail = ok ? "" : (meta.message || meta.error ||
-    (res ? JSON.stringify(res.errors || res.error || res.description || res) : "no response captured"));
-  logWrite(ZT.getVariableValue("pending_api_node", ""), ZT.getVariableValue("pending_api_step", ""),
-    ok ? "OK" : "FAIL", code, ZT.getVariableValue("pending_api_ref", ""), detail);
-  ZT.setFormData("pending_api_alias", "");
-}
-
-logFlush();
-// ===== END EXECUTION LOG BLOCK =====
-
 // Builds the internal note posted to the Zendesk parent ticket by node 22.
-//
-// SIMPLIFIED 2026-09-01 alongside the node 44 code-review response (see
-// claude.md changelog + the accompanying review document). Only the redundant
-// fallback wrapper below was touched - everything else is unchanged.
-
-// Removed: a local g(name, fallback) wrapper that just called
-// ZT.getVariableValue(name, "") || fallback - ZT.getVariableValue already
-// takes a fallback argument directly, so the wrapper added a layer of
-// indirection with no behavior of its own (the same redundant-helper pattern
-// Samuel Kling's review flagged in node 44). Call sites below now call
-// ZT.getVariableValue directly.
+// Every value is read straight from ZT.getVariableValue with its own default -
+// no local wrapper, since getVariableValue already takes the fallback.
 const genesys_conversation_id = ZT.getVariableValue("genesys_conversation_id", "N/A");
 const genesys_interaction_type = ZT.getVariableValue("genesys_interaction_type", "N/A");
 const contact_reason = ZT.getVariableValue("contact_reason", "N/A");
@@ -133,20 +64,20 @@
   ${transforms.child_tickets_note || ""}
   `;
 
-// NOT changed in this pass: same JSON.stringify(...).slice(1, -1) quote-strip
-// shape Samuel flagged in node 44, here escaping internal_note_details for
-// whatever CO builds the Add Internal Note request (alias
-// create_internal_note__no_group_id per claude.md - CO id/template not
-// visible in this session, unlike CO #184 which Samuel pasted directly). The
-// same payload-consolidation fix applied to node 44 below almost certainly
-// applies here too, but doing it blind without seeing that CO's actual
-// request body risks guessing a field name wrong. Flagged in the review
-// document as a follow-up once that CO's body is confirmed - do not copy
-// node 44's payload object here without confirming it first.
+// The Add Internal Note Connected Object (create_internal_note__no_group_id)
+// drops this note into a hand-authored JSON body, so it is escaped here and the
+// outer quotes JSON.stringify adds are sliced back off.
+//
+// The same single-object-then-stringify shape node 44 uses for its Edvin payload
+// would fit here too, but this CO's request body lives in the admin UI and is not
+// visible in this export. Confirm its field names there before changing this.
 let stringified_note_details = JSON.stringify(internal_note_details).slice(1, -1);
 ZT.setTransformData("internal_note_details", stringified_note_details);
 
 // No tag write here by design - Zendesk tagging runs off the ::tag_name suffix on
 // button text, not a tag API call from a script.
 
-logArm("node 22", "Zendesk Add Internal Note", "create_internal_note__no_group_id", ZT.getVariableValue("zd_ticket_id", ""));
+// Node 22 (Zendesk - Add Internal Note) fires next. Names the call so the failure screen router
+// (node 94) and the retry router (node 88) know which request to blame and
+// which Data node to re-fire.
+ZT.setFormData("last_api_alias", "create_internal_note__no_group_id");
```

### node 27 — Stitch & Group PNR Action Selections (script code)

```diff
--- before/node 27 content
+++ after/node 27 content
@@ -82,7 +82,7 @@
 // agent notes have to carry all N too. PNR-prefixed so Edvin/the agent can tell
 // whose note is whose; de-duped so two PNRs with identical text (or both blank)
 // don't repeat. See buildFinalErrandRecord below - this is the same "notes"
-// field the 2026-08-21 fix (ZD 337619) missed, reported again 2026-08-24.
+// field buildFinalErrandRecord below carries across the whole group.
 function mergeNotes(items) {
   const seen = new Set();
   const parts = [];
@@ -106,11 +106,10 @@
   return [...map.values()];
 }
 
-// ERRAND RECORD (fixed 2026-08-21, ZD 337619; notes field fixed 2026-08-24):
-// group[0] alone used to become the Edvin errand record, so when 2+ PNRs share
-// the same (type + customer_action) pair and collapse into ONE errand, every PNR
-// after the first silently disappeared from that errand's message. An errand
-// covering N PNRs must carry all N, the same way the ticket built below does.
+// ERRAND RECORD. When 2+ PNRs share the same (type + customer_action) pair they
+// collapse into ONE Edvin errand, so the record has to be built from the whole
+// group, never from group[0] alone - an errand covering N PNRs carries all N, the
+// same way the ticket built below does.
 function buildFinalErrandRecord(group) {
   const orderReferences = [...new Set(group.map(item => item.orderReference).filter(Boolean))];
   return {
@@ -132,7 +131,7 @@
 //   errand_key  type|customer_action - the join key to final_pnrs / node 44
 
 function buildTicket(kind, titlePrefix, group, grandChildren) {
-  // Subflows 1 & 2 (Unconfirmed Booking / Orphan, 2026-09-02): joinPnrs(group)
+  // Unconfirmed Booking and Orphan paths: joinPnrs(group)
   // is "" when there is no real PNR. Fall back to the no_pnr_label the bridge
   // node (93) set on the synthetic record, so the ticket title reads
   // "Child Ticket: Orphan Errand" instead of "Child Ticket: " with nothing
```

### node 28 — GET Edvin Errands - Request Failed (content)

```diff
--- before/node 28 content
+++ after/node 28 content
@@ -1 +1 @@
-<div class="zt-content-block zt-cb-type-alert"><div class="zt-cb-title"><i class="zt-cb-icon" contenteditable="false"></i><h3>Request Failed</h3></div><div class="zt-cb-body"><p>The <strong>GET Edvin Errands</strong> request did not complete successfully (expected a 200 or 201 response).</p><p>You can try the request again, or end this session.</p><p><strong>API Response (debug):</strong></p><p>edvin__errand_configuration: ${actions.edvin__errand_configuration | stringify}</p><p>get_edvin_prop_long_value: ${actions.get_edvin_prop_long_value | stringify}</p></div></div><p>${transforms.execution_log_html}</p>
+<div class="zt-content-block zt-cb-type-alert"><div class="zt-cb-title"><i class="zt-cb-icon" contenteditable="false"></i><h3>Request Failed</h3></div><div class="zt-cb-body"><p>The <strong>GET Edvin Errands</strong> request did not complete successfully (expected a 200 or 201 response).</p><p>You can try the request again, or end this session.</p><p><strong>API Response (debug):</strong></p><p>edvin__errand_configuration: ${actions.edvin__errand_configuration | stringify}</p><p>get_edvin_prop_long_value: ${actions.get_edvin_prop_long_value | stringify}</p></div></div>
```

### node 29 — Clear Data (script code)

```diff
--- before/node 29 content
+++ after/node 29 content
@@ -1,153 +1,48 @@
-// ===== EXECUTION LOG (shared block - keep IDENTICAL in every script that logs) =====
-// One growing string in FORM data. Form data has no TTL, so this survives the
-// 1-hour transforms expiry and a deep resume. Two delimiters, so a parser only
-// ever needs two split() calls:
-//     entries   split on  ~||~
-//     fields    split on  ~:~   ->  seq, ts, node, step, status, code, ref, detail
-// status is one of OK | FAIL | SKIP | INFO. Node 89 renders it; nothing routes on it.
-const LOG_VAR = "execution_log";
-const LOG_REC = "~||~";
-const LOG_FLD = "~:~";
-const LOG_MAX = 20000;
+// Mid-ticket restart for Additional / Different Request (node 47 -> here -> node
+// 77). Re-enters the flow without passing through the root, so anything the root
+// resets and this node does not will leak into the second pass.
+//
+// Resets loop and reconciliation state ONLY. Two things it deliberately leaves
+// alone: the inbound Zendesk intake values (order reference, language, Genesys
+// ids), and `contact_reason`, which node 47's select has just rewritten through
+// its score_var. Node 95 writes the agent's pick back to Zendesk on the way past.
 
-function logClean(v) {
-  if (v === null || v === undefined) return "";
-  return String(v).replace(/~/g, "-").replace(/[\r\n\t]+/g, " ").trim().slice(0, 300);
-}
-
-function logWrite(node, step, status, code, ref, detail) {
-  const seq = parseInt(ZT.getVariableValue("execution_log_seq", 0), 10) + 1;
-  const entry = [seq, new Date().toISOString(), node, step, status, code, ref, detail]
-    .map(logClean).join(LOG_FLD);
-  let entries = ZT.getVariableValue(LOG_VAR, "");
-  entries = entries ? entries.split(LOG_REC) : [];
-  entries.push(entry);
-  // Trim whole entries off the front, never a partial one.
-  while (entries.join(LOG_REC).length > LOG_MAX && entries.length > 1) entries.shift();
-  ZT.setFormData(LOG_VAR, entries.join(LOG_REC));
-  ZT.setFormData("execution_log_seq", seq);
-}
-
-// Called by the script immediately BEFORE a Data node fires, naming the call that
-// is about to happen. Whoever runs next - the success-path script, or node 86 on
-// the failure path - grades it from actions.<alias>._zt_meta.
-function logArm(node, step, alias, ref) {
-  ZT.setFormData("pending_api_node", node);
-  ZT.setFormData("pending_api_step", step);
-  ZT.setFormData("pending_api_alias", alias);
-  ZT.setFormData("pending_api_ref", ref || "");
-  ZT.setFormData("last_api_alias", alias); // never cleared - node 88 retries on it
-}
-
-// First line of EVERY script that can follow a Data node. Appends exactly one
-// OK/FAIL entry for the armed call, then disarms so it is never double-counted.
-function logFlush() {
-  const alias = ZT.getVariableValue("pending_api_alias", "");
-  if (!alias) return;
-  const res = (typeof actions !== "undefined" && actions[alias]) ? actions[alias] : null;
-  const meta = (res && res._zt_meta && res._zt_meta.response) ? res._zt_meta.response : {};
-  const code = meta.code || meta.status || "";
-  const ok = String(code).charAt(0) === "2";
-  const detail = ok ? "" : (meta.message || meta.error ||
-    (res ? JSON.stringify(res.errors || res.error || res.description || res) : "no response captured"));
-  logWrite(ZT.getVariableValue("pending_api_node", ""), ZT.getVariableValue("pending_api_step", ""),
-    ok ? "OK" : "FAIL", code, ZT.getVariableValue("pending_api_ref", ""), detail);
-  ZT.setFormData("pending_api_alias", "");
-}
-
-logFlush();
-// ===== END EXECUTION LOG BLOCK =====
-
+// --- Intake-loop state ---------------------------------------------------------
+ZT.setTransformData("customer_action_pnrs", []);
+ZT.setTransformData("final_pnrs", []);
+// final_pnrs_count is the dangerous one: node 44 uses it as its cursor, so a stale
+// value makes the second pass start mid-array and skip Edvin registrations.
+ZT.setTransformData("final_pnrs_count", 0);
 ZT.setTransformData("selected_pnrs", []);
-ZT.setTransformData("customer_action_pnrs", []);
-ZT.setTransformData("actions_array", []);
-ZT.setTransformData("final_pnrs", []);
-ZT.setTransformData("internal_note_details", ``);
-
-ZT.setTransformData("pnr_buckets", {});
-ZT.setTransformData("child_ticket", {});
-// v24: node 10 clears these on a fresh start; without them here a second errand
-// pass on the same ticket inherits the previous pass's staged request payloads.
-// R17 (CR-007) - additional-request restart must reset everything node 10
-// (full Restart) resets, minus the inbound query params (order id, etc.),
-// which this mid-ticket restart must NOT touch. Without these, a second
-// errand pass on the same ticket can inherit stale loop/cursor state from
-// the first pass (Zendesk 334577 / 334588 duplicate-grandchild reports).
 ZT.setTransformData("current_pnr", {});
 ZT.setTransformData("pnr_index", 0);
 ZT.setTransformData("isMorePNR", false);
 ZT.setTransformData("pnr_banner", ``);
+ZT.setTransformData("actions_array", []);
 ZT.setTransformData("customer_action_table_html", ``);
+ZT.setTransformData("internal_note_details", ``);
+ZT.setTransformData("child_tickets_note", ``);
 ZT.setFormData("is_more_pnrs", false);
 
-// v19 (2026-08-04): the Additional / Different Request loop re-enters at node 4
-// without passing through node 10, so anything node 10 resets and this node does
-// not will leak into the second pass. final_pnrs_count is the dangerous one -
-// node 44 uses it as its cursor, so a stale value makes the second pass start
-// mid-array and skip Edvin errand registrations entirely.
-ZT.setTransformData("final_pnrs_count", 0);
-ZT.setTransformData("child_tickets_note", ``);
+// --- Reconciliation state read by node 21 --------------------------------------
+// If these leak across a re-entry, a clean second pass can be turned back for a
+// problem that belonged to the first one.
 ZT.setTransformData("unresolved_selections", []);
-// v24 state: the routing guard's inputs and the reconciliation list. If these leak
-// across a re-entry, a clean second pass can be turned back at node 50 for a problem
-// that belonged to the first one.
 ZT.setTransformData("unresolved_note_html", ``);
 ZT.setTransformData("planned_ticket_titles", []);
 ZT.setFormData("has_unresolved_selections", false);
 ZT.setFormData("unresolved_selections_count", 0);
-// v35 - the duplicate guards read these; nodes 14/16's confirmed-only lists above are
-// reconciliation input for node 21. Both must clear together or a genuinely new pass
-// over the same PNRs is suppressed.
-ZT.setFormData("side_conversation_id", "");
-ZT.setTransformData("ticket_ids_by_errand_key", {});
-ZT.setTransformData("parent_ticket_ids_by_errand_key", {});
 
-// v37 - the unrolled resolve-chain's routing flags, plus the distinct BLOCKED
-// reconciliation lists node 21 reads. Node 10 resets these on a fresh start; this
-// mid-ticket restart (Additional/Different Request) must reset them too, or stale
-// state from the first pass leaks into the second. (v36's child_ticket_resolve_attempts
-// counter is gone - see node 18's comment.)
-
-
-// // Clear session and start a fresh order.
-// // This node is the tree ROOT, so it runs on a fresh launch AND whenever the
-// // agent presses Restart (native Restart returns to the root node). A valid
-// // ?session_id= deep-resume re-enters at the last content node and SKIPS this
-// // script, so an in-progress session is preserved.
-// // Clears all intake + child/grandchild loop STATE so a new run starts clean.
-// // Inbound query params (order id, custom_field_29559177650834,
-// // zendeskChannelIdentifier, errand_api_path) are NOT touched here.
-
-// // Intake-loop transforms
-// ZT.setTransformData("customer_action_pnrs", []);
-// ZT.setTransformData("final_pnrs", []);
-// ZT.setTransformData("final_pnrs_count", 0);
-// ZT.setTransformData("selected_pnrs", []);
-// ZT.setTransformData("current_pnr", {});
-// ZT.setTransformData("pnr_index", 0);
-// ZT.setTransformData("isMorePNR", false);
-// ZT.setTransformData("pnr_banner", ``);
-// ZT.setTransformData("actions_array", []);
-// ZT.setTransformData("customer_action_table_html", ``);
-// ZT.setTransformData("internal_note_details", ``);
-
-// // Child / grandchild ticket loop transforms
-// ZT.setTransformData("child_ticket", {});
-// ZT.setTransformData("pnr_buckets", {});
-
-// // Loop counters / flags (form data)
-// ZT.setFormData("is_more_pnrs", false);
-// ZT.setFormData("side_conversation_id", "");
-// ZT.setFormData("update_ticket_tag", "");
-
-logWrite("node 29", "Additional / Different request", "INFO", "", ZT.getVariableValue("zd_ticket_id", ""), "loop state cleared, log continues");
-
-// --- v45 unified ticket loop state -----------------------------------------
+// --- Unified ticket loop state (node 32) ---------------------------------------
 ZT.setTransformData("work_queue", []);
 ZT.setTransformData("current_ticket", {});
 ZT.setTransformData("child_ticket", {});
+ZT.setTransformData("pnr_buckets", {});
 ZT.setTransformData("ticket_card_html", ``);
 ZT.setTransformData("resolved_ticket_ids_by_queue_index", {});
+ZT.setTransformData("ticket_ids_by_errand_key", {});
+ZT.setTransformData("parent_ticket_ids_by_errand_key", {});
+ZT.setFormData("side_conversation_id", "");
 ZT.setFormData("queue_index", 0);
 ZT.setFormData("grandchild_index", -1);
 ZT.setFormData("current_queue_index", 0);
@@ -157,65 +52,10 @@
 ZT.setFormData("ticket_display_index", 0);
 ZT.setFormData("tickets_total", 0);
 
-logArm("node 4", "Edvin Find Order", "findorder", ZT.getVariableValue("orderReference", ""));
+// --- Failure-path state --------------------------------------------------------
+ZT.setTransformData("failure_html", ``);
 
-// ===== ENV FIELD RESOLUTION (shared block - keep IDENTICAL in nodes 10, 29, 93, 95) =====
-// Zendesk custom-field ids differ per org, so referencing custom_field_<id>
-// throughout the tree is what made promote/demote risky: every script, merge
-// field and payload had to be rewritten, and one missed reference reads a field
-// the target org does not have (that is exactly how the Genesys "NA" bug and the
-// contact-reason reader/writer split happened - see the changelog).
-// This block is the ONE place that knows those ids. It resolves each field once,
-// PROD id first with the DEV id as the fallback, and publishes a stable
-// snake_case name the rest of the tree reads. A promote or demote now only has to
-// be correct here.
-//
-// Both ids are tried on every run in BOTH environments on purpose: whichever org
-// this tree is running in populates one and leaves the other empty, so this block
-// is correct in dev and in prod with no edit at all.
-//
-// PRECEDENCE: the standardized name wins, then the prod id, then the dev id.
-// The standardized name is FIRST because it is where the agent's answer lands -
-// node 6's two Contact Reason selects post directly to `contact_reason` and node
-// 47's re-select writes it through score_var (v50). The custom_field_ ids behind
-// it are the inbound-parameter fallback: they seed the value at the start of a
-// session and are what a fresh Zendesk ticket supplies.
-// Node 10 clears the standardized names before it resolves, so a Restart re-reads
-// the inbound parameters instead of inheriting the previous session's picks; a
-// deep resume (?session_id=) skips node 10 and therefore keeps them, which is the
-// behaviour you want in both cases.
-const ENV_FIELDS = {
-  order_reference:          ["custom_field_27823498043154", "custom_field_33772689958162"],
-  language:                 ["custom_field_27659659178002", "custom_field_28137345621650"],
-  contact_reason:           ["custom_field_29658558478738", "custom_field_29559177650834"],
-  genesys_conversation_id:  ["custom_field_30866832265234", "custom_field_31975964556050"],
-  genesys_interaction_type: ["custom_field_30555623661842", "custom_field_31213052370194"]
-};
-
-function resolveEnvFields() {
-  const resolved = {};
-  Object.keys(ENV_FIELDS).forEach(function (name) {
-    const ids = ENV_FIELDS[name];
-    let value = String(ZT.getVariableValue(name, "") || "").trim();
-    for (let i = 0; i < ids.length && !value; i++) {
-      value = String(ZT.getVariableValue(ids[i], "") || "").trim();
-    }
-    ZT.setFormData(name, value);
-    // Fan the resolved value back out to BOTH orgs' ids (v50, Brent). Anything
-    // that still names one of them - a Connected Object request body in the admin
-    // UI, a merge field, a future edit, a paste from the other environment - then
-    // reads the right value instead of an empty one. This is what makes a stray
-    // custom_field_ reference SAFE rather than silently wrong, in either org.
-    ids.forEach(function (id) { ZT.setFormData(id, value); });
-    resolved[name] = value;
-  });
-  // orderReference (camelCase) stays as a MIRROR of order_reference: the Connected
-  // Object request bodies live in the Zingtree admin UI, not in this export, and
-  // at least one reads ${orderReference}. Dropping it would empty that payload
-  // silently - same reasoning as transforms.child_ticket keeping its name.
-  ZT.setFormData("orderReference", resolved.order_reference);
-  return resolved;
-}
-
-const env = resolveEnvFields();
-// ===== END ENV FIELD RESOLUTION BLOCK =====
+// Node 4 (Edvin - Find Order) fires next on this path. Names the call so the
+// failure screen router (node 94) and the retry router (node 88) know which
+// request to blame and which Data node to re-fire.
+ZT.setFormData("last_api_alias", "findorder");
```

### node 31 — Edvin - Register Errand - Request Failed (content)

```diff
--- before/node 31 content
+++ after/node 31 content
@@ -1 +1 @@
-<div class="zt-content-block zt-cb-type-alert"><div class="zt-cb-title"><i class="zt-cb-icon" contenteditable="false"></i><h3>Request Failed</h3></div><div class="zt-cb-body"><p>The <strong>Edvin - Register Errand</strong> request did not complete successfully (expected a 200 or 201 response).</p><p>You can try the request again, or end this session.</p><p><strong>API Response (debug):</strong></p><p>${actions.edvin__register_errand | stringify}</p></div></div><p>${transforms.execution_log_html}</p>
+<div class="zt-content-block zt-cb-type-alert"><div class="zt-cb-title"><i class="zt-cb-icon" contenteditable="false"></i><h3>Request Failed</h3></div><div class="zt-cb-body"><p>The <strong>Edvin - Register Errand</strong> request did not complete successfully (expected a 200 or 201 response).</p><p>You can try the request again, or end this session.</p><p><strong>API Response (debug):</strong></p><p>${actions.edvin__register_errand | stringify}</p></div></div>
```

### node 32 — Loop Tickets (child + grand child) (script code)

```diff
--- before/node 32 content
+++ after/node 32 content
@@ -1,68 +1,7 @@
-// ===== EXECUTION LOG (shared block - keep IDENTICAL in every script that logs) =====
-// One growing string in FORM data. Form data has no TTL, so this survives the
-// 1-hour transforms expiry and a deep resume. Two delimiters, so a parser only
-// ever needs two split() calls:
-//     entries   split on  ~||~
-//     fields    split on  ~:~   ->  seq, ts, node, step, status, code, ref, detail
-// status is one of OK | FAIL | SKIP | INFO. Node 89 renders it; nothing routes on it.
-const LOG_VAR = "execution_log";
-const LOG_REC = "~||~";
-const LOG_FLD = "~:~";
-const LOG_MAX = 20000;
-
-function logClean(v) {
-  if (v === null || v === undefined) return "";
-  return String(v).replace(/~/g, "-").replace(/[\r\n\t]+/g, " ").trim().slice(0, 300);
-}
-
-function logWrite(node, step, status, code, ref, detail) {
-  const seq = parseInt(ZT.getVariableValue("execution_log_seq", 0), 10) + 1;
-  const entry = [seq, new Date().toISOString(), node, step, status, code, ref, detail]
-    .map(logClean).join(LOG_FLD);
-  let entries = ZT.getVariableValue(LOG_VAR, "");
-  entries = entries ? entries.split(LOG_REC) : [];
-  entries.push(entry);
-  // Trim whole entries off the front, never a partial one.
-  while (entries.join(LOG_REC).length > LOG_MAX && entries.length > 1) entries.shift();
-  ZT.setFormData(LOG_VAR, entries.join(LOG_REC));
-  ZT.setFormData("execution_log_seq", seq);
-}
-
-// Called by the script immediately BEFORE a Data node fires, naming the call that
-// is about to happen. Whoever runs next - the success-path script, or node 86 on
-// the failure path - grades it from actions.<alias>._zt_meta.
-function logArm(node, step, alias, ref) {
-  ZT.setFormData("pending_api_node", node);
-  ZT.setFormData("pending_api_step", step);
-  ZT.setFormData("pending_api_alias", alias);
-  ZT.setFormData("pending_api_ref", ref || "");
-  ZT.setFormData("last_api_alias", alias); // never cleared - node 88 retries on it
-}
-
-// First line of EVERY script that can follow a Data node. Appends exactly one
-// OK/FAIL entry for the armed call, then disarms so it is never double-counted.
-function logFlush() {
-  const alias = ZT.getVariableValue("pending_api_alias", "");
-  if (!alias) return;
-  const res = (typeof actions !== "undefined" && actions[alias]) ? actions[alias] : null;
-  const meta = (res && res._zt_meta && res._zt_meta.response) ? res._zt_meta.response : {};
-  const code = meta.code || meta.status || "";
-  const ok = String(code).charAt(0) === "2";
-  const detail = ok ? "" : (meta.message || meta.error ||
-    (res ? JSON.stringify(res.errors || res.error || res.description || res) : "no response captured"));
-  logWrite(ZT.getVariableValue("pending_api_node", ""), ZT.getVariableValue("pending_api_step", ""),
-    ok ? "OK" : "FAIL", code, ZT.getVariableValue("pending_api_ref", ""), detail);
-  ZT.setFormData("pending_api_alias", "");
-}
-
-logFlush();
-// ===== END EXECUTION LOG BLOCK =====
-
-// UNIFIED TICKET LOOP (v45). One cursor node for child, silent AND grand child
-// tickets. The old grandchild body - nodes 36, 37, 38, 68-72, 85 and their three
-// status checks - called the SAME connected objects as this one (#20 create,
-// #158 get details, #207 update), so it was a verbatim clone of this loop with a
-// different target_ticket_id. It is gone; this node walks both levels.
+// UNIFIED TICKET LOOP. One cursor node for child, silent AND grand child
+// tickets - all three kinds call the same Connected Objects (create child ticket,
+// get ticket details, update ticket) and differ only in target_ticket_id, so one
+// depth-first walk covers both levels.
 //
 // transforms.work_queue (node 27):
 //   [ { ticket: { ..., grand_child_tickets: [ ... ] }, errands: [ ... ] }, ... ]
@@ -114,14 +53,12 @@
 ZT.setFormData("current_is_grand_child", is_grand_child);
 
 // --- agent-facing counters (node 84's heading) ------------------------------
-// PER KIND, NOT PER RUN (Brent, 2026-09-02). The heading used to count every
-// ticket the run creates, so the second grand child under one child ticket read
-// "Grand Child Ticket 3 of 3" - which tells the agent nothing about how many
-// grand children are actually coming. Count within the kind being created:
-// "Child Ticket 1 of 1", "Grand Child Ticket 2 of 2", "Silent Ticket 1 of 2".
-// Production got this for free (child and grand child were separate loops with
-// their own counters); the unified loop derives it from the same depth-first
-// walk, so the order the agent sees still matches the order things are created.
+// PER KIND, NOT PER RUN. Counting every ticket the run creates would make the
+// second grand child under one child ticket read "Grand Child Ticket 3 of 3",
+// which tells the agent nothing about how many grand children are coming. Count
+// within the kind being created instead: "Child Ticket 1 of 1", "Grand Child
+// Ticket 2 of 2", "Silent Ticket 1 of 2". Derived from the same depth-first walk,
+// so the order the agent sees matches the order things are created.
 function kindOf(ticket, isGrandChild) {
   if (isGrandChild) return "grand_child";
   return ticket.kind === "silent" ? "silent" : "child";
@@ -176,12 +113,11 @@
 // ${transforms.child_ticket.*} and lives in the admin UI, not in this export.
 const child_ticket = {
   subject: current_ticket.title,
-  // Christina, 2026-09-01 call: child/grandchild tickets need the PARENT
-  // ticket's language so CC routing (which reads language) still works on
-  // them. NOT WIRED UP YET, same as CO #184's payload below (claude.md
-  // "EDVIN ERRAND MESSAGE"): CO #20's admin-UI request body has to add a
-  // language field reading ${transforms.child_ticket.language} for this to
-  // actually reach Zendesk - that config change is outside this JSON.
+  // Christina (ETG): child and grand child tickets need the PARENT ticket's
+  // language so CC routing, which reads language, still works on them.
+  // NOT WIRED UP YET - the create-child-ticket Connected Object's request body
+  // has to add a language field reading ${transforms.child_ticket.language}
+  // before this reaches Zendesk. That change is in the admin UI, not this JSON.
   language: ZT.getVariableValue("language", ""),
   body: "Order Reference: " + (orderReference || "N/A") +
     ", Bucket: " + current_ticket.bucket +
@@ -264,4 +200,7 @@
   conversation_type: ZT.getVariableValue("genesys_interaction_type", "")
 }));
 
-logArm("node 33", "Create " + ticket_kind_label, "create_child_ticket", current_ticket.title);
+// Node 33 (ZD - Create Child Ticket) fires next. Names the call so the failure screen router
+// (node 94) and the retry router (node 88) know which request to blame and
+// which Data node to re-fire.
+ZT.setFormData("last_api_alias", "create_child_ticket");
```

### node 40 — Get Child Ticket Details - Request Failed (content)

```diff
--- before/node 40 content
+++ after/node 40 content
@@ -1 +1 @@
-<div class="zt-content-block zt-cb-type-alert"><div class="zt-cb-title"><i class="zt-cb-icon" contenteditable="false"></i><h3>Request Failed</h3></div><div class="zt-cb-body"><p>The <strong>Get ${ticket_kind} Details</strong> request did not complete successfully (expected a 200 or 201 response).</p><p>You can try the request again, or end this session.</p><p><strong>API Response (debug):</strong></p><p>${actions.get_side_conversation_detail | stringify}</p></div></div><p>${transforms.execution_log_html}</p>
+<div class="zt-content-block zt-cb-type-alert"><div class="zt-cb-title"><i class="zt-cb-icon" contenteditable="false"></i><h3>Request Failed</h3></div><div class="zt-cb-body"><p>The <strong>Get ${ticket_kind} Details</strong> request did not complete successfully (expected a 200 or 201 response).</p><p>You can try the request again, or end this session.</p><p><strong>API Response (debug):</strong></p><p>${actions.get_side_conversation_detail | stringify}</p></div></div>
```

### node 44 — Loop Errands to Register (script code)

```diff
--- before/node 44 content
+++ after/node 44 content
@@ -1,81 +1,15 @@
-// ===== EXECUTION LOG (shared block - keep IDENTICAL in every script that logs) =====
-// One growing string in FORM data. Form data has no TTL, so this survives the
-// 1-hour transforms expiry and a deep resume. Two delimiters, so a parser only
-// ever needs two split() calls:
-//     entries   split on  ~||~
-//     fields    split on  ~:~   ->  seq, ts, node, step, status, code, ref, detail
-// status is one of OK | FAIL | SKIP | INFO. Node 89 renders it; nothing routes on it.
-const LOG_VAR = "execution_log";
-const LOG_REC = "~||~";
-const LOG_FLD = "~:~";
-const LOG_MAX = 20000;
-
-function logClean(v) {
-  if (v === null || v === undefined) return "";
-  return String(v).replace(/~/g, "-").replace(/[\r\n\t]+/g, " ").trim().slice(0, 300);
-}
-
-function logWrite(node, step, status, code, ref, detail) {
-  const seq = parseInt(ZT.getVariableValue("execution_log_seq", 0), 10) + 1;
-  const entry = [seq, new Date().toISOString(), node, step, status, code, ref, detail]
-    .map(logClean).join(LOG_FLD);
-  let entries = ZT.getVariableValue(LOG_VAR, "");
-  entries = entries ? entries.split(LOG_REC) : [];
-  entries.push(entry);
-  // Trim whole entries off the front, never a partial one.
-  while (entries.join(LOG_REC).length > LOG_MAX && entries.length > 1) entries.shift();
-  ZT.setFormData(LOG_VAR, entries.join(LOG_REC));
-  ZT.setFormData("execution_log_seq", seq);
-}
-
-// Called by the script immediately BEFORE a Data node fires, naming the call that
-// is about to happen. Whoever runs next - the success-path script, or node 86 on
-// the failure path - grades it from actions.<alias>._zt_meta.
-function logArm(node, step, alias, ref) {
-  ZT.setFormData("pending_api_node", node);
-  ZT.setFormData("pending_api_step", step);
-  ZT.setFormData("pending_api_alias", alias);
-  ZT.setFormData("pending_api_ref", ref || "");
-  ZT.setFormData("last_api_alias", alias); // never cleared - node 88 retries on it
-}
-
-// First line of EVERY script that can follow a Data node. Appends exactly one
-// OK/FAIL entry for the armed call, then disarms so it is never double-counted.
-function logFlush() {
-  const alias = ZT.getVariableValue("pending_api_alias", "");
-  if (!alias) return;
-  const res = (typeof actions !== "undefined" && actions[alias]) ? actions[alias] : null;
-  const meta = (res && res._zt_meta && res._zt_meta.response) ? res._zt_meta.response : {};
-  const code = meta.code || meta.status || "";
-  const ok = String(code).charAt(0) === "2";
-  const detail = ok ? "" : (meta.message || meta.error ||
-    (res ? JSON.stringify(res.errors || res.error || res.description || res) : "no response captured"));
-  logWrite(ZT.getVariableValue("pending_api_node", ""), ZT.getVariableValue("pending_api_step", ""),
-    ok ? "OK" : "FAIL", code, ZT.getVariableValue("pending_api_ref", ""), detail);
-  ZT.setFormData("pending_api_alias", "");
-}
-
-logFlush();
-// ===== END EXECUTION LOG BLOCK =====
-
 // Cursor over transforms.final_pnrs (one entry per distinct type+action). Node 43
 // fires the Edvin registerErrand request right after this node.
 //
-// SIMPLIFIED 2026-09-01 in response to Samuel Kling's code review (Slack DM,
-// 2026-08-27/28). See claude.md changelog for the full findings + verdicts.
-// Loop/cursor/idempotency-guard logic below is UNCHANGED from the reviewed
-// version - only the per-errand formatting section (helper functions,
-// buildErrandMessage, and the Edvin payload hand-off) was rewritten. Do not
-// re-touch the loop mechanics without reading the "EVERY CURSOR LOOP CLAMPS ON
-// ENTRY" convention above first.
+// Do not re-touch the loop mechanics without reading the "EVERY CURSOR LOOP
+// CLAMPS ON ENTRY" convention above first.
 
 const EDVIN_MESSAGE_KEY = "errand_message";
 const EDVIN_PAYLOAD_KEY = "edvin_register_errand_payload";
 
 // Edvin records every errand against this fixed generic user until ETG's admin
-// API accepts a real agent id (tracked: Olga's Jira, confirmed open by John
-// Spanidis 2026-08-04 - see claude.md "ERRAND CREATOR"). Named here so the
-// day that Jira closes, there is exactly one place to change.
+// API accepts a real agent id (tracked in Olga's Jira, still open). Named here
+// so the day that Jira closes, there is exactly one place to change.
 const EDVIN_GENERIC_USER_UUID = "4871857e-d411-4594-a2de-25f6c4fb1ffa";
 
 let final_pnrs = transforms.final_pnrs || [];
@@ -104,11 +38,10 @@
 // never been confirmed against a live log (claude.md: "once the correct
 // Zendesk variable is confirmed from the log, trim firstOf() to just that
 // name"). Until then this checks the candidates IN ORDER and uses the first
-// one that resolves. Samuel's review flagged mixing requester_name/
-// requester_email into this list: those are the CUSTOMER's identity, not the
-// agent's, so including them here can silently mislabel the customer as
-// "Handled By" if none of the true agent variables are populated. Removed -
-// an unresolved agent now correctly shows "N/A" instead of guessing.
+// one that resolves. requester_name and requester_email stay OUT of this list:
+// they are the CUSTOMER's identity, not the agent's, and including them would
+// silently label the customer as "Handled By" whenever no true agent variable is
+// populated. An unresolved agent shows "N/A" rather than a guess.
 function firstOf(names) {
   for (let i = 0; i < names.length; i++) {
     const v = ZT.getVariableValue(names[i], "");
@@ -122,7 +55,7 @@
 
 // --- Errand context ---------------------------------------------------------
 // Every field defaults to null uniformly (never "" and never "N/A" - two
-// different empty sentinels was the anti-pattern Samuel called out). A single
+// different empty sentinels is the anti-pattern this avoids). A single
 // truthy check downstream then catches "missing" in one place, however the
 // field arrived at null.
 const ctx = {
@@ -210,39 +143,23 @@
 ZT.setTransformData("current_pnr", current_pnr);
 
 // --- Edvin registerErrand payload, built and stringified ONCE --------------
-// This is the structural fix from Samuel's second message: CO #184's request
-// body used to be a hand-authored JSON template with ${transforms.current_pnr.x}
-// merge fields dropped into it field-by-field - most wrapped in quotes,
-// providerBookingIds deliberately not, and errand_message needing the
-// JSON.stringify(...).slice(1, -1) hack specifically because IT also had to
-// sit inside quotes in that template. Getting the quoting right per-field is
-// exactly the kind of fragile, easy-to-break-on-the-next-field-added pattern
-// this session is trying to simplify away.
-//
-// Instead: build the whole request body as one plain JS object, in the SAME
-// field order and with the SAME sources CO #184 already reads (cross-checked
-// against Samuel's pasted CO body, 2026-08-27), then JSON.stringify it once.
-// CO #184's request body can then be just the single merge field
-// ${transforms.edvin_register_errand_payload} - no per-field quoting for
-// anyone to get wrong. errand_message flows through this same single
-// stringify call, so it no longer needs any escaping logic of its own.
-//
-// NOT WIRED UP YET: this only takes effect once CO #184's Data Source body is
-// changed to that single merge field in the Zingtree admin UI - a config
-// change outside this tree JSON. Until that happens this transform is inert
-// (nothing reads it) and the existing per-field CO body keeps working exactly
-// as before, unaffected. See the accompanying review document for the exact
-// before/after CO body text and a migration checklist.
-//
-// BONUS FIX found while building this: the reviewed CO body sourced
-// orderReference from ${custom_field_33772689958162} directly - a THIRD
-// source, distinct from both of the two this script already falls back
-// through above (orderReference / custom_field_33772689958162). Since
-// current_pnr.orderReference is already the one resolved value the rest of
-// this tree (internal note, agent-facing cards) treats as the source of
-// truth, the consolidated payload below uses that instead, so Edvin, the
-// internal note, and the confirmation card can no longer disagree about which
-// order reference was sent.
+// The whole request body is one plain JS object, serialized by a single
+// JSON.stringify. The Edvin register-errand Connected Object's request body can
+// then be the single merge field ${transforms.edvin_register_errand_payload},
+// instead of a hand-authored JSON template with per-field quoting to get right.
+// errand_message flows through the same stringify, so it needs no escaping of
+// its own.
+//
+// orderReference comes from current_pnr.orderReference - the one resolved value
+// the internal note and the agent-facing cards already treat as the source of
+// truth - so Edvin, the note and the confirmation card cannot disagree about
+// which order reference was sent. It is never read from a custom_field id here;
+// node 10 is the only place those are read.
+//
+// NOT WIRED UP YET: this takes effect once that Connected Object's Data Source
+// body is changed to the single merge field in the Zingtree admin UI, which is
+// outside this JSON. Until then the transform is inert - nothing reads it - and
+// the existing per-field body keeps working unchanged.
 // providerBookingIds arrives on current_pnr as a STRING - node 27 already
 // JSON.stringify'd it (JSON.stringify(group.map(item => item.id))) so it could
 // sit unquoted in the old per-field template. Parsed back into a real array
@@ -363,4 +280,7 @@
 let edvin_errand_card_html = buildEdvinErrandCardHtml(current_pnr);
 ZT.setTransformData("edvin_errand_card_html", edvin_errand_card_html);
 
-logArm("node 43", "Edvin Register Errand", "edvin__register_errand", errand_key);
+// Node 43 (Edvin - Register Errand) fires next. Names the call so the failure screen router
+// (node 94) and the retry router (node 88) know which request to blame and
+// which Data node to re-fire.
+ZT.setFormData("last_api_alias", "edvin__register_errand");
```

### node 45 — Update Child Ticket - Request Failed (content)

```diff
--- before/node 45 content
+++ after/node 45 content
@@ -1 +1 @@
-<div class="zt-content-block zt-cb-type-alert"><div class="zt-cb-title"><i class="zt-cb-icon" contenteditable="false"></i><h3>Request Failed</h3></div><div class="zt-cb-body"><p>The <strong>Update ${ticket_kind}</strong> request did not complete successfully (expected a 200 or 201 response).</p><p>You can try the request again, or end this session.</p><p><strong>API Response (debug):</strong></p><p>${actions.zingtree_redesign__update_side_conversation | stringify}</p></div></div><p>${transforms.execution_log_html}</p>
+<div class="zt-content-block zt-cb-type-alert"><div class="zt-cb-title"><i class="zt-cb-icon" contenteditable="false"></i><h3>Request Failed</h3></div><div class="zt-cb-body"><p>The <strong>Update ${ticket_kind}</strong> request did not complete successfully (expected a 200 or 201 response).</p><p>You can try the request again, or end this session.</p><p><strong>API Response (debug):</strong></p><p>${actions.zingtree_redesign__update_side_conversation | stringify}</p></div></div>
```

### node 46 — Format Types (script code)

```diff
--- before/node 46 content
+++ after/node 46 content
@@ -1,63 +1,3 @@
-// ===== EXECUTION LOG (shared block - keep IDENTICAL in every script that logs) =====
-// One growing string in FORM data. Form data has no TTL, so this survives the
-// 1-hour transforms expiry and a deep resume. Two delimiters, so a parser only
-// ever needs two split() calls:
-//     entries   split on  ~||~
-//     fields    split on  ~:~   ->  seq, ts, node, step, status, code, ref, detail
-// status is one of OK | FAIL | SKIP | INFO. Node 89 renders it; nothing routes on it.
-const LOG_VAR = "execution_log";
-const LOG_REC = "~||~";
-const LOG_FLD = "~:~";
-const LOG_MAX = 20000;
-
-function logClean(v) {
-  if (v === null || v === undefined) return "";
-  return String(v).replace(/~/g, "-").replace(/[\r\n\t]+/g, " ").trim().slice(0, 300);
-}
-
-function logWrite(node, step, status, code, ref, detail) {
-  const seq = parseInt(ZT.getVariableValue("execution_log_seq", 0), 10) + 1;
-  const entry = [seq, new Date().toISOString(), node, step, status, code, ref, detail]
-    .map(logClean).join(LOG_FLD);
-  let entries = ZT.getVariableValue(LOG_VAR, "");
-  entries = entries ? entries.split(LOG_REC) : [];
-  entries.push(entry);
-  // Trim whole entries off the front, never a partial one.
-  while (entries.join(LOG_REC).length > LOG_MAX && entries.length > 1) entries.shift();
-  ZT.setFormData(LOG_VAR, entries.join(LOG_REC));
-  ZT.setFormData("execution_log_seq", seq);
-}
-
-// Called by the script immediately BEFORE a Data node fires, naming the call that
-// is about to happen. Whoever runs next - the success-path script, or node 86 on
-// the failure path - grades it from actions.<alias>._zt_meta.
-function logArm(node, step, alias, ref) {
-  ZT.setFormData("pending_api_node", node);
-  ZT.setFormData("pending_api_step", step);
-  ZT.setFormData("pending_api_alias", alias);
-  ZT.setFormData("pending_api_ref", ref || "");
-  ZT.setFormData("last_api_alias", alias); // never cleared - node 88 retries on it
-}
-
-// First line of EVERY script that can follow a Data node. Appends exactly one
-// OK/FAIL entry for the armed call, then disarms so it is never double-counted.
-function logFlush() {
-  const alias = ZT.getVariableValue("pending_api_alias", "");
-  if (!alias) return;
-  const res = (typeof actions !== "undefined" && actions[alias]) ? actions[alias] : null;
-  const meta = (res && res._zt_meta && res._zt_meta.response) ? res._zt_meta.response : {};
-  const code = meta.code || meta.status || "";
-  const ok = String(code).charAt(0) === "2";
-  const detail = ok ? "" : (meta.message || meta.error ||
-    (res ? JSON.stringify(res.errors || res.error || res.description || res) : "no response captured"));
-  logWrite(ZT.getVariableValue("pending_api_node", ""), ZT.getVariableValue("pending_api_step", ""),
-    ok ? "OK" : "FAIL", code, ZT.getVariableValue("pending_api_ref", ""), detail);
-  ZT.setFormData("pending_api_alias", "");
-}
-
-logFlush();
-// ===== END EXECUTION LOG BLOCK =====
-
 // Resolves the Edvin channel + category for this contact, and builds the
 // type -> actions groupings the downstream action selects read from.
 //
```

### node 48 — End Session (content)

```diff
--- before/node 48 content
+++ after/node 48 content
@@ -1 +1 @@
-<p>Session ended successfully. Thank you!</p><p>${transforms.execution_log_html}</p>
+<p>Session ended successfully. Thank you!</p>
```

### node 53 — Session Ended - Request Failed (content)

```diff
--- before/node 53 content
+++ after/node 53 content
@@ -1 +1 @@
-<div class="zt-content-block zt-cb-type-alert"><div class="zt-cb-title"><i class="zt-cb-icon" contenteditable="false"></i><h3>Session Ended</h3></div><div class="zt-cb-body"><p>This session was ended because a request could not be completed. No further action was taken. Please start a new session to try again.</p></div></div><p>${transforms.execution_log_html}</p>
+<div class="zt-content-block zt-cb-type-alert"><div class="zt-cb-title"><i class="zt-cb-icon" contenteditable="false"></i><h3>Session Ended</h3></div><div class="zt-cb-body"><p>This session was ended because a request could not be completed. No further action was taken. Please start a new session to try again.</p></div></div>
```

### node 58 — Check Customer Action Selections (script code)

```diff
--- before/node 58 content
+++ after/node 58 content
@@ -4,14 +4,12 @@
 // unresolved_selections and the run produces no ticket/errand for that PNR. Catch
 // any incomplete submission here (before stitching runs) and send the agent back
 // to the same table instead of letting a partial run reach node 27.
-// FIX (2026-08-27): originally used .some() (passes once ANY row has a pick),
-// which let a 1-of-2 submission through. Every PNR needs its own customer action,
-// so this now uses .every() - see the v43 correction entry in claude.md.
+// EVERY row, not any row: a 1-of-2 submission must be turned back, so the test
+// below is .every() over the table's rows.
 //
-// Deliberately a lighter check than node 27's own has_unresolved_selections (which
-// runs AFTER stitching and flags a selection that doesn't resolve to a known
-// action/bucket - e.g. stale). This guard only asks "did EVERY row get picked" -
-// see claude.md v43 for how the two relate.
+// Deliberately a lighter check than node 27's own has_unresolved_selections, which
+// runs AFTER stitching and flags a selection that does not resolve to a known
+// action or bucket. This guard only asks "did every row get picked".
 
 let customer_action_pnrs = transforms.customer_action_pnrs || [];
 
```

### node 61 — Insert Linked PNR's (script code)

```diff
--- before/node 61 content
+++ after/node 61 content
@@ -1,63 +1,3 @@
-// ===== EXECUTION LOG (shared block - keep IDENTICAL in every script that logs) =====
-// One growing string in FORM data. Form data has no TTL, so this survives the
-// 1-hour transforms expiry and a deep resume. Two delimiters, so a parser only
-// ever needs two split() calls:
-//     entries   split on  ~||~
-//     fields    split on  ~:~   ->  seq, ts, node, step, status, code, ref, detail
-// status is one of OK | FAIL | SKIP | INFO. Node 89 renders it; nothing routes on it.
-const LOG_VAR = "execution_log";
-const LOG_REC = "~||~";
-const LOG_FLD = "~:~";
-const LOG_MAX = 20000;
-
-function logClean(v) {
-  if (v === null || v === undefined) return "";
-  return String(v).replace(/~/g, "-").replace(/[\r\n\t]+/g, " ").trim().slice(0, 300);
-}
-
-function logWrite(node, step, status, code, ref, detail) {
-  const seq = parseInt(ZT.getVariableValue("execution_log_seq", 0), 10) + 1;
-  const entry = [seq, new Date().toISOString(), node, step, status, code, ref, detail]
-    .map(logClean).join(LOG_FLD);
-  let entries = ZT.getVariableValue(LOG_VAR, "");
-  entries = entries ? entries.split(LOG_REC) : [];
-  entries.push(entry);
-  // Trim whole entries off the front, never a partial one.
-  while (entries.join(LOG_REC).length > LOG_MAX && entries.length > 1) entries.shift();
-  ZT.setFormData(LOG_VAR, entries.join(LOG_REC));
-  ZT.setFormData("execution_log_seq", seq);
-}
-
-// Called by the script immediately BEFORE a Data node fires, naming the call that
-// is about to happen. Whoever runs next - the success-path script, or node 86 on
-// the failure path - grades it from actions.<alias>._zt_meta.
-function logArm(node, step, alias, ref) {
-  ZT.setFormData("pending_api_node", node);
-  ZT.setFormData("pending_api_step", step);
-  ZT.setFormData("pending_api_alias", alias);
-  ZT.setFormData("pending_api_ref", ref || "");
-  ZT.setFormData("last_api_alias", alias); // never cleared - node 88 retries on it
-}
-
-// First line of EVERY script that can follow a Data node. Appends exactly one
-// OK/FAIL entry for the armed call, then disarms so it is never double-counted.
-function logFlush() {
-  const alias = ZT.getVariableValue("pending_api_alias", "");
-  if (!alias) return;
-  const res = (typeof actions !== "undefined" && actions[alias]) ? actions[alias] : null;
-  const meta = (res && res._zt_meta && res._zt_meta.response) ? res._zt_meta.response : {};
-  const code = meta.code || meta.status || "";
-  const ok = String(code).charAt(0) === "2";
-  const detail = ok ? "" : (meta.message || meta.error ||
-    (res ? JSON.stringify(res.errors || res.error || res.description || res) : "no response captured"));
-  logWrite(ZT.getVariableValue("pending_api_node", ""), ZT.getVariableValue("pending_api_step", ""),
-    ok ? "OK" : "FAIL", code, ZT.getVariableValue("pending_api_ref", ""), detail);
-  ZT.setFormData("pending_api_alias", "");
-}
-
-logFlush();
-// ===== END EXECUTION LOG BLOCK =====
-
 let { orderProviderBookingDetails, orderLinkedProviderReferences } = actions.findorder;
 
 let mapped = orderLinkedProviderReferences.forEach(x => {
```

### node 64 — Set Side Conversation Id (script code)

```diff
--- before/node 64 content
+++ after/node 64 content
@@ -1,68 +1,10 @@
-// ===== EXECUTION LOG (shared block - keep IDENTICAL in every script that logs) =====
-// One growing string in FORM data. Form data has no TTL, so this survives the
-// 1-hour transforms expiry and a deep resume. Two delimiters, so a parser only
-// ever needs two split() calls:
-//     entries   split on  ~||~
-//     fields    split on  ~:~   ->  seq, ts, node, step, status, code, ref, detail
-// status is one of OK | FAIL | SKIP | INFO. Node 89 renders it; nothing routes on it.
-const LOG_VAR = "execution_log";
-const LOG_REC = "~||~";
-const LOG_FLD = "~:~";
-const LOG_MAX = 20000;
-
-function logClean(v) {
-  if (v === null || v === undefined) return "";
-  return String(v).replace(/~/g, "-").replace(/[\r\n\t]+/g, " ").trim().slice(0, 300);
-}
-
-function logWrite(node, step, status, code, ref, detail) {
-  const seq = parseInt(ZT.getVariableValue("execution_log_seq", 0), 10) + 1;
-  const entry = [seq, new Date().toISOString(), node, step, status, code, ref, detail]
-    .map(logClean).join(LOG_FLD);
-  let entries = ZT.getVariableValue(LOG_VAR, "");
-  entries = entries ? entries.split(LOG_REC) : [];
-  entries.push(entry);
-  // Trim whole entries off the front, never a partial one.
-  while (entries.join(LOG_REC).length > LOG_MAX && entries.length > 1) entries.shift();
-  ZT.setFormData(LOG_VAR, entries.join(LOG_REC));
-  ZT.setFormData("execution_log_seq", seq);
-}
-
-// Called by the script immediately BEFORE a Data node fires, naming the call that
-// is about to happen. Whoever runs next - the success-path script, or node 86 on
-// the failure path - grades it from actions.<alias>._zt_meta.
-function logArm(node, step, alias, ref) {
-  ZT.setFormData("pending_api_node", node);
-  ZT.setFormData("pending_api_step", step);
-  ZT.setFormData("pending_api_alias", alias);
-  ZT.setFormData("pending_api_ref", ref || "");
-  ZT.setFormData("last_api_alias", alias); // never cleared - node 88 retries on it
-}
-
-// First line of EVERY script that can follow a Data node. Appends exactly one
-// OK/FAIL entry for the armed call, then disarms so it is never double-counted.
-function logFlush() {
-  const alias = ZT.getVariableValue("pending_api_alias", "");
-  if (!alias) return;
-  const res = (typeof actions !== "undefined" && actions[alias]) ? actions[alias] : null;
-  const meta = (res && res._zt_meta && res._zt_meta.response) ? res._zt_meta.response : {};
-  const code = meta.code || meta.status || "";
-  const ok = String(code).charAt(0) === "2";
-  const detail = ok ? "" : (meta.message || meta.error ||
-    (res ? JSON.stringify(res.errors || res.error || res.description || res) : "no response captured"));
-  logWrite(ZT.getVariableValue("pending_api_node", ""), ZT.getVariableValue("pending_api_step", ""),
-    ok ? "OK" : "FAIL", code, ZT.getVariableValue("pending_api_ref", ""), detail);
-  ZT.setFormData("pending_api_alias", "");
-}
-
-logFlush();
-// ===== END EXECUTION LOG BLOCK =====
-
 // Captures the side conversation id Zendesk just handed back, so node 65 can pick
 // this ticket out of node 63's list response. Runs for parent and grand child
 // tickets alike - one body, one alias.
 const side_conversation_id = actions.create_child_ticket.side_conversation.id;
 ZT.setFormData("side_conversation_id", side_conversation_id);
 
-logArm("node 63", "Get Ticket Details", "get_side_conversation_detail",
-  (transforms.current_ticket || {}).title || "");
+// Node 63 (Get Child Ticket Details) fires next. Names the call so the failure screen router
+// (node 94) and the retry router (node 88) know which request to blame and
+// which Data node to re-fire.
+ZT.setFormData("last_api_alias", "get_side_conversation_detail");
```

### node 65 — Resolve Ticket Id (script code)

```diff
--- before/node 65 content
+++ after/node 65 content
@@ -1,63 +1,3 @@
-// ===== EXECUTION LOG (shared block - keep IDENTICAL in every script that logs) =====
-// One growing string in FORM data. Form data has no TTL, so this survives the
-// 1-hour transforms expiry and a deep resume. Two delimiters, so a parser only
-// ever needs two split() calls:
-//     entries   split on  ~||~
-//     fields    split on  ~:~   ->  seq, ts, node, step, status, code, ref, detail
-// status is one of OK | FAIL | SKIP | INFO. Node 89 renders it; nothing routes on it.
-const LOG_VAR = "execution_log";
-const LOG_REC = "~||~";
-const LOG_FLD = "~:~";
-const LOG_MAX = 20000;
-
-function logClean(v) {
-  if (v === null || v === undefined) return "";
-  return String(v).replace(/~/g, "-").replace(/[\r\n\t]+/g, " ").trim().slice(0, 300);
-}
-
-function logWrite(node, step, status, code, ref, detail) {
-  const seq = parseInt(ZT.getVariableValue("execution_log_seq", 0), 10) + 1;
-  const entry = [seq, new Date().toISOString(), node, step, status, code, ref, detail]
-    .map(logClean).join(LOG_FLD);
-  let entries = ZT.getVariableValue(LOG_VAR, "");
-  entries = entries ? entries.split(LOG_REC) : [];
-  entries.push(entry);
-  // Trim whole entries off the front, never a partial one.
-  while (entries.join(LOG_REC).length > LOG_MAX && entries.length > 1) entries.shift();
-  ZT.setFormData(LOG_VAR, entries.join(LOG_REC));
-  ZT.setFormData("execution_log_seq", seq);
-}
-
-// Called by the script immediately BEFORE a Data node fires, naming the call that
-// is about to happen. Whoever runs next - the success-path script, or node 86 on
-// the failure path - grades it from actions.<alias>._zt_meta.
-function logArm(node, step, alias, ref) {
-  ZT.setFormData("pending_api_node", node);
-  ZT.setFormData("pending_api_step", step);
-  ZT.setFormData("pending_api_alias", alias);
-  ZT.setFormData("pending_api_ref", ref || "");
-  ZT.setFormData("last_api_alias", alias); // never cleared - node 88 retries on it
-}
-
-// First line of EVERY script that can follow a Data node. Appends exactly one
-// OK/FAIL entry for the armed call, then disarms so it is never double-counted.
-function logFlush() {
-  const alias = ZT.getVariableValue("pending_api_alias", "");
-  if (!alias) return;
-  const res = (typeof actions !== "undefined" && actions[alias]) ? actions[alias] : null;
-  const meta = (res && res._zt_meta && res._zt_meta.response) ? res._zt_meta.response : {};
-  const code = meta.code || meta.status || "";
-  const ok = String(code).charAt(0) === "2";
-  const detail = ok ? "" : (meta.message || meta.error ||
-    (res ? JSON.stringify(res.errors || res.error || res.description || res) : "no response captured"));
-  logWrite(ZT.getVariableValue("pending_api_node", ""), ZT.getVariableValue("pending_api_step", ""),
-    ok ? "OK" : "FAIL", code, ZT.getVariableValue("pending_api_ref", ""), detail);
-  ZT.setFormData("pending_api_alias", "");
-}
-
-logFlush();
-// ===== END EXECUTION LOG BLOCK =====
-
 // Resolves the side conversation's BACKING Zendesk ticket id and files it under
 // both keys the rest of the tree needs it by:
 //   ticket_ids_by_errand_key[errand_key]      -> node 44's registerErrand payload
@@ -88,5 +28,7 @@
   ZT.setTransformData("resolved_ticket_ids_by_queue_index", resolved_ticket_ids_by_queue_index);
 }
 
-logArm("node 66", "Update " + ZT.getVariableValue("ticket_kind", "Ticket"),
-  "zingtree_redesign__update_side_conversation", current_ticket.title || "");
+// Node 66 (Update Child Ticket) fires next. Names the call so the failure screen router
+// (node 94) and the retry router (node 88) know which request to blame and
+// which Data node to re-fire.
+ZT.setFormData("last_api_alias", "zingtree_redesign__update_side_conversation");
```

### node 86 — API Failure - Log & Render (script code)

```diff
--- before/node 86 content
+++ after/node 86 content
@@ -1,153 +1,41 @@
-// SHARED FAILURE HANDLER (v45). Every API status-check node in this tree routes
-// its failure branch here instead of to its own bespoke "Request Failed" screen.
-// It replaces nodes 14, 16, 18, 28, 31, 40 and 45 - seven near-identical content
-// nodes whose only real difference was which Data node their Retry button went
-// back to. That routing now lives in node 88, keyed off last_api_alias.
-//
-// This node also guarantees the one thing per-request screens could not: a
-// failure is written to the execution log BEFORE the agent gets the chance to
-// retry, so a call that failed once and succeeded on retry leaves both entries
-// behind instead of only the success.
+// Shared failure handler. Every API status-check node routes its failure branch
+// here. It grades the call that just failed and renders one card; node 94 then
+// picks the failure screen and node 88 the retry target, both keyed off
+// last_api_alias, which the script before each Data node sets.
+const failed_alias = ZT.getVariableValue("last_api_alias", "");
 
-// Captured before logFlush() clears the armed call - a Retry re-fires the very
-// same request, so the same call has to be re-armed afterwards.
-const failed_node = ZT.getVariableValue("pending_api_node", "");
-const failed_step = ZT.getVariableValue("pending_api_step", "");
-const failed_alias = ZT.getVariableValue("pending_api_alias", "") || ZT.getVariableValue("last_api_alias", "");
-const failed_ref = ZT.getVariableValue("pending_api_ref", "");
+// Readable name for the request, so the card says "Edvin - Register Errand"
+// rather than an alias. Anything not listed falls back to the alias itself.
+const stepLabels = {
+  findorder: "Edvin - Find Order",
+  edvin__errand_configuration: "GET Edvin Errands",
+  edvin__register_errand: "Edvin - Register Errand",
+  create_internal_note__no_group_id: "Zendesk - Add Internal Note",
+  create_child_ticket: "ZD - Create " + ZT.getVariableValue("ticket_kind", "Child Ticket"),
+  get_side_conversation_detail: "Get Ticket Details",
+  zingtree_redesign__update_side_conversation: "Update Ticket"
+};
+const failed_step = stepLabels[failed_alias] || failed_alias;
 
-// ===== EXECUTION LOG (shared block - keep IDENTICAL in every script that logs) =====
-// One growing string in FORM data. Form data has no TTL, so this survives the
-// 1-hour transforms expiry and a deep resume. Two delimiters, so a parser only
-// ever needs two split() calls:
-//     entries   split on  ~||~
-//     fields    split on  ~:~   ->  seq, ts, node, step, status, code, ref, detail
-// status is one of OK | FAIL | SKIP | INFO. Node 89 renders it; nothing routes on it.
-const LOG_VAR = "execution_log";
-const LOG_REC = "~||~";
-const LOG_FLD = "~:~";
-const LOG_MAX = 20000;
+// What the run was working on when it failed, so the agent can tell one PNR or
+// ticket apart from another in a long session.
+const failed_ref = (transforms.current_ticket || {}).title ||
+  ZT.getVariableValue("order_reference", "");
 
-function logClean(v) {
-  if (v === null || v === undefined) return "";
-  return String(v).replace(/~/g, "-").replace(/[\r\n\t]+/g, " ").trim().slice(0, 300);
-}
-
-function logWrite(node, step, status, code, ref, detail) {
-  const seq = parseInt(ZT.getVariableValue("execution_log_seq", 0), 10) + 1;
-  const entry = [seq, new Date().toISOString(), node, step, status, code, ref, detail]
-    .map(logClean).join(LOG_FLD);
-  let entries = ZT.getVariableValue(LOG_VAR, "");
-  entries = entries ? entries.split(LOG_REC) : [];
-  entries.push(entry);
-  // Trim whole entries off the front, never a partial one.
-  while (entries.join(LOG_REC).length > LOG_MAX && entries.length > 1) entries.shift();
-  ZT.setFormData(LOG_VAR, entries.join(LOG_REC));
-  ZT.setFormData("execution_log_seq", seq);
-}
-
-// Called by the script immediately BEFORE a Data node fires, naming the call that
-// is about to happen. Whoever runs next - the success-path script, or node 86 on
-// the failure path - grades it from actions.<alias>._zt_meta.
-function logArm(node, step, alias, ref) {
-  ZT.setFormData("pending_api_node", node);
-  ZT.setFormData("pending_api_step", step);
-  ZT.setFormData("pending_api_alias", alias);
-  ZT.setFormData("pending_api_ref", ref || "");
-  ZT.setFormData("last_api_alias", alias); // never cleared - node 88 retries on it
-}
-
-// First line of EVERY script that can follow a Data node. Appends exactly one
-// OK/FAIL entry for the armed call, then disarms so it is never double-counted.
-function logFlush() {
-  const alias = ZT.getVariableValue("pending_api_alias", "");
-  if (!alias) return;
-  const res = (typeof actions !== "undefined" && actions[alias]) ? actions[alias] : null;
-  const meta = (res && res._zt_meta && res._zt_meta.response) ? res._zt_meta.response : {};
-  const code = meta.code || meta.status || "";
-  const ok = String(code).charAt(0) === "2";
-  const detail = ok ? "" : (meta.message || meta.error ||
-    (res ? JSON.stringify(res.errors || res.error || res.description || res) : "no response captured"));
-  logWrite(ZT.getVariableValue("pending_api_node", ""), ZT.getVariableValue("pending_api_step", ""),
-    ok ? "OK" : "FAIL", code, ZT.getVariableValue("pending_api_ref", ""), detail);
-  ZT.setFormData("pending_api_alias", "");
-}
-
-logFlush();
-// ===== END EXECUTION LOG BLOCK =====
-
-logArm(failed_node, failed_step, failed_alias, failed_ref);
-
-// ===== EXECUTION LOG RENDERER (shared block - keep IDENTICAL in nodes 86 and 89) =====
-// Parses the flat execution_log string back into rows and renders two grouped
-// cards: everything that failed, then everything that succeeded. Read-only -
-// it never writes to the log.
-function renderExecutionLog() {
-  const raw = ZT.getVariableValue(LOG_VAR, "");
-  const rows = (raw ? raw.split(LOG_REC) : [])
-    .map(line => line.split(LOG_FLD))
-    .filter(f => f.length >= 8)
-    .map(f => ({ seq: f[0], ts: f[1], node: f[2], step: f[3], status: f[4], code: f[5], ref: f[6], detail: f[7] }));
-
-  const failed = rows.filter(r => r.status === "FAIL");
-  const passed = rows.filter(r => r.status !== "FAIL");
-
-  function esc(s) {
-    return String(s === null || s === undefined ? "" : s)
-      .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
-  }
-
-  function clockOf(ts) {
-    const t = String(ts).split("T")[1] || "";
-    return t.split(".")[0];
-  }
-
-  function rowHtml(r, accent) {
-    return '<div style="padding:8px 10px;border-left:3px solid ' + accent + ';background:#ffffff;' +
-      'border-radius:4px;margin:6px 0;font-size:13px;line-height:1.45;">' +
-      '<div style="color:#111827;font-weight:600;">' + esc(r.step) +
-      '<span style="color:#9ca3af;font-weight:400;"> - ' + esc(r.node) + '</span></div>' +
-      '<div style="color:#6b7280;font-family:monospace;font-size:11px;">' + esc(clockOf(r.ts)) +
-      (r.code ? ' - HTTP ' + esc(r.code) : '') + (r.ref ? ' - ' + esc(r.ref) : '') + '</div>' +
-      (r.detail ? '<div style="color:#7f1d1d;margin-top:4px;">' + esc(r.detail) + '</div>' : '') +
-      '</div>';
-  }
-
-  function card(title, tone, border, bg, items, accent, emptyText) {
-    let html = '<div style="border:1px solid ' + border + ';background:' + bg +
-      ';border-radius:10px;padding:12px 14px;margin:10px 0;">' +
-      '<div style="font-weight:700;font-size:13px;color:' + tone +
-      ';text-transform:uppercase;letter-spacing:0.03em;margin-bottom:4px;">' +
-      esc(title) + ' (' + items.length + ')</div>';
-    html += items.length
-      ? items.map(r => rowHtml(r, accent)).join("")
-      : '<div style="font-size:13px;color:#6b7280;font-style:italic;">' + esc(emptyText) + '</div>';
-    return html + '</div>';
-  }
-
-  if (!rows.length) return "";
-
-  return '<div style="font-family:Arial,Helvetica,sans-serif;max-width:560px;">' +
-    card("Failures", "#7f1d1d", "#fecaca", "#fef2f2", failed, "#dc2626", "None - every request came back 2xx.") +
-    card("Completed", "#065f46", "#bbf7d0", "#f0fdf4", passed, "#16a34a", "Nothing recorded yet.") +
-    '</div>';
-}
-// ===== END EXECUTION LOG RENDERER =====
+const response = actions[failed_alias] || null;
+const meta = (response && response._zt_meta && response._zt_meta.response) ? response._zt_meta.response : {};
 
 function escHtml(s) {
   return String(s === null || s === undefined ? "" : s)
     .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
 }
 
-const response = (typeof actions !== "undefined" && actions[failed_alias]) ? actions[failed_alias] : null;
-const meta = (response && response._zt_meta && response._zt_meta.response) ? response._zt_meta.response : {};
-
 const failure_html =
   '<div style="font-family:Arial,Helvetica,sans-serif;max-width:560px;border:1px solid #fecaca;' +
   'background:#fef2f2;border-radius:10px;padding:14px 16px;">' +
   '<div style="font-size:15px;font-weight:700;color:#7f1d1d;margin-bottom:4px;">Request failed</div>' +
   '<div style="font-size:13px;color:#7f1d1d;line-height:1.5;">The <strong>' +
-  escHtml(failed_step || failed_alias) + '</strong> request did not come back with a 200 or 201' +
+  escHtml(failed_step) + '</strong> request did not come back with a 200 or 201' +
   (meta.code ? ' (received HTTP ' + escHtml(meta.code) + ')' : '') + '.</div>' +
   (failed_ref ? '<div style="font-size:12px;color:#991b1b;margin-top:6px;">Working on: ' + escHtml(failed_ref) + '</div>' : '') +
   '<div style="font-size:13px;color:#7f1d1d;margin-top:8px;">Nothing further has been written for this step. ' +
@@ -159,4 +47,3 @@
   '</div></div>';
 
 ZT.setTransformData("failure_html", failure_html);
-ZT.setTransformData("execution_log_html", renderExecutionLog());
```

### node 87 — Request Failed (content)

```diff
--- before/node 87 content
+++ after/node 87 content
@@ -1 +1 @@
-<p>${transforms.failure_html}</p><p>${transforms.execution_log_html}</p>
+<p>${transforms.failure_html}</p>
```

### node 93 — No-PNR Bridge (Unconfirmed Booking / Orphan) (script code)

```diff
--- before/node 93 content
+++ after/node 93 content
@@ -1,101 +1,33 @@
-// ===== ENV FIELD RESOLUTION (shared block - keep IDENTICAL in nodes 10, 29, 93, 95) =====
-// Zendesk custom-field ids differ per org, so referencing custom_field_<id>
-// throughout the tree is what made promote/demote risky: every script, merge
-// field and payload had to be rewritten, and one missed reference reads a field
-// the target org does not have (that is exactly how the Genesys "NA" bug and the
-// contact-reason reader/writer split happened - see the changelog).
-// This block is the ONE place that knows those ids. It resolves each field once,
-// PROD id first with the DEV id as the fallback, and publishes a stable
-// snake_case name the rest of the tree reads. A promote or demote now only has to
-// be correct here.
+// Shared bridge for the two PNR-less paths: Unconfirmed Booking (node 101) and
+// Orphan Errand (node 77's "No Order Reference" button). Both skip the PNR
+// selection screens (6/54/55/7/8/9/56/57) entirely, so this node's only job is to
+// hand node 2 the same record shape node 7 would build for a real PNR.
 //
-// Both ids are tried on every run in BOTH environments on purpose: whichever org
-// this tree is running in populates one and leaves the other empty, so this block
-// is correct in dev and in prod with no edit at all.
-//
-// PRECEDENCE: the standardized name wins, then the prod id, then the dev id.
-// The standardized name is FIRST because it is where the agent's answer lands -
-// node 6's two Contact Reason selects post directly to `contact_reason` and node
-// 47's re-select writes it through score_var (v50). The custom_field_ ids behind
-// it are the inbound-parameter fallback: they seed the value at the start of a
-// session and are what a fresh Zendesk ticket supplies.
-// Node 10 clears the standardized names before it resolves, so a Restart re-reads
-// the inbound parameters instead of inheriting the previous session's picks; a
-// deep resume (?session_id=) skips node 10 and therefore keeps them, which is the
-// behaviour you want in both cases.
-const ENV_FIELDS = {
-  order_reference:          ["custom_field_27823498043154", "custom_field_33772689958162"],
-  language:                 ["custom_field_27659659178002", "custom_field_28137345621650"],
-  contact_reason:           ["custom_field_29658558478738", "custom_field_29559177650834"],
-  genesys_conversation_id:  ["custom_field_30866832265234", "custom_field_31975964556050"],
-  genesys_interaction_type: ["custom_field_30555623661842", "custom_field_31213052370194"]
-};
+// Orphan-ness is DERIVED here from the actual condition - no order reference
+// resolved - rather than being set by an upstream node that has to remember to do
+// it. That removes the failure mode where the classification silently falls back
+// to "normal" and the errand registers against a blank order reference.
+const order_reference = ZT.getVariableValue("order_reference", "");
+const genesys_interaction_type = ZT.getVariableValue("genesys_interaction_type", "");
 
-function resolveEnvFields() {
-  const resolved = {};
-  Object.keys(ENV_FIELDS).forEach(function (name) {
-    const ids = ENV_FIELDS[name];
-    let value = String(ZT.getVariableValue(name, "") || "").trim();
-    for (let i = 0; i < ids.length && !value; i++) {
-      value = String(ZT.getVariableValue(ids[i], "") || "").trim();
-    }
-    ZT.setFormData(name, value);
-    // Fan the resolved value back out to BOTH orgs' ids (v50, Brent). Anything
-    // that still names one of them - a Connected Object request body in the admin
-    // UI, a merge field, a future edit, a paste from the other environment - then
-    // reads the right value instead of an empty one. This is what makes a stray
-    // custom_field_ reference SAFE rather than silently wrong, in either org.
-    ids.forEach(function (id) { ZT.setFormData(id, value); });
-    resolved[name] = value;
-  });
-  // orderReference (camelCase) stays as a MIRROR of order_reference: the Connected
-  // Object request bodies live in the Zingtree admin UI, not in this export, and
-  // at least one reads ${orderReference}. Dropping it would empty that payload
-  // silently - same reasoning as transforms.child_ticket keeping its name.
-  ZT.setFormData("orderReference", resolved.order_reference);
-  return resolved;
-}
-
-const env = resolveEnvFields();
-// ===== END ENV FIELD RESOLUTION BLOCK =====
-
-// Shared bridge for Subflow 1 (Unconfirmed Booking) and Subflow 2 (Orphan
-// Errand) - build guide, "Shared / cross-cutting build notes": both branch
-// off the same decision point and reuse the same downstream nodes
-// (channel/category/type/action selection 1/2/12, grouping 27, ticket loop
-// 32-41, errand loop 44). This node's only job is to stand in for the
-// PNR-selection screens (6/54/55/7/8/9/56/57) that a PNR-less contact skips
-// entirely, by handing node 2 the same shape node 7 would for a real PNR.
-// ORPHAN IS DERIVED HERE, NOT PASSED IN (v51). Node 92 ("Orphan Entry") used to
-// set errand_path_kind and the -999 order reference, but it was removed when the
-// intake moved to node 77 and that node's "No Order Reference" button now routes
-// straight here. Deriving orphan-ness from the ACTUAL condition - no order
-// reference resolved - means there is no node in between that has to remember to
-// set a flag, and the classification cannot silently fall back to "normal" (which
-// is what it did between node 92's removal and this change: the orphan path took
-// the else-branch below and registered against a BLANK order reference instead of
-// -999).
-const isOrphan = ZT.getVariableValue("errand_path_kind", "") === "orphan" || !env.order_reference;
+const isOrphan = ZT.getVariableValue("errand_path_kind", "") === "orphan" || !order_reference;
 ZT.setFormData("errand_path_kind", isOrphan ? "orphan" : "unconfirmed_booking");
 
-let orderReference;
+let resolved_order_reference;
 if (isOrphan) {
-  // Elis (Edvin), 2026-09-01: "send us the order reference minus 999 and it's
-  // going to get treated just the same way as an orphan."
-  orderReference = "-999";
+  // Elis (Edvin): send the order reference as -999 and it is treated the same way
+  // as an orphan on their side.
+  resolved_order_reference = "-999";
 } else {
-  // Unconfirmed Booking: a REAL order reference, resolved by the ENV block above.
-  // Only the PNR is optional on this path - the order reference stays required.
-  orderReference = env.order_reference ||
+  // Unconfirmed Booking: a REAL order reference. Only the PNR is optional on this
+  // path - the order reference stays required.
+  resolved_order_reference = order_reference ||
     (actions.findorder && actions.findorder.orderReference) || "";
 }
 
-// zendeskChannelIdentifier normally comes from node 61, which neither
-// subflow passes through (Orphan skips node 4/61 entirely; Unconfirmed
-// Booking skips 61's PNR-mapping half but still needs this). Small, cheap
-// duplication rather than restructuring node 61 - see claude.md's execution
-// -log block for the precedent of duplicating a short block across nodes
-// when there is no Zingtree User Function to centralize it in.
+// zendeskChannelIdentifier normally comes from node 61, which neither path passes
+// through (Orphan skips nodes 4 and 61 entirely; Unconfirmed Booking skips 61's
+// PNR-mapping half but still needs the channel).
 function mapGenesysInteractionType(value) {
   const interactionTypeMap = {
     "genesys_interaction_type__call": "Phone",
@@ -104,25 +36,23 @@
   };
   return `Zingtree.Channels.${interactionTypeMap[value]}`;
 }
-const contactType = env.genesys_interaction_type || "genesys_interaction_type__call";
+const contactType = genesys_interaction_type || "genesys_interaction_type__call";
 ZT.setFormData("zendeskChannelIdentifier", mapGenesysInteractionType(contactType));
 
-// no_pnr_label feeds node 27's buildTicket fallback (v47 fix) so the ticket
-// title reads "Child Ticket: Orphan Errand" / "Child Ticket: Unconfirmed
-// Booking - <order ref>" instead of blank after the colon.
-const noPnrLabel = isOrphan ? "Orphan Errand" : ("Unconfirmed Booking - " + orderReference);
+// no_pnr_label feeds node 27's buildTicket fallback so the ticket title reads
+// "Child Ticket: Orphan Errand" / "Child Ticket: Unconfirmed Booking - <order
+// ref>" instead of stopping blank after the colon.
+const noPnrLabel = isOrphan ? "Orphan Errand" : ("Unconfirmed Booking - " + resolved_order_reference);
 
-// Same shape node 7 hands to node 2 via transforms.current_pnr for a real
-// PNR - node 2 merges in channel/category/type/notes/actions_array exactly
-// the same way regardless of which path produced this record.
-// pnr stays "" ON PURPOSE (build guide open question #2): Elis has not yet
-// confirmed the Edvin registerErrand call accepts a null PNR. Leave it
-// blank here rather than guessing a placeholder into the field Edvin
-// actually stores against the order.
+// Same shape node 7 hands node 2 via transforms.current_pnr for a real PNR - node
+// 2 merges in channel/category/type/notes/actions_array identically either way.
+// pnr stays "" ON PURPOSE: Edvin has not confirmed that registerErrand accepts a
+// null PNR, so leave it blank rather than guessing a placeholder into the field
+// Edvin stores against the order.
 const current_pnr = {
   pnr: "",
   no_pnr_label: noPnrLabel,
-  orderReference: orderReference,
+  orderReference: resolved_order_reference,
   orderId: (actions.findorder && actions.findorder.orderId) || "",
   passengers: [],
   formatted_passengers: "",
@@ -132,5 +62,12 @@
 ZT.setTransformData("current_pnr", current_pnr);
 ZT.setFormData("isMorePNR", false);
 ZT.setFormData("pnr_index", 0);
-ZT.setFormData("order_reference", orderReference);
-ZT.setFormData("orderReference", orderReference); // mirror - see the ENV block
+
+// The resolved reference is session state only. The orphan sentinel (-999) is
+// deliberately NOT written back to the Zendesk order-reference field - it is a
+// value Edvin understands, not something to stamp on the ticket.
+ZT.setFormData("order_reference", resolved_order_reference);
+ZT.setFormData("orderReference", resolved_order_reference);
+
+// Node 42 (GET Edvin Errands) fires next on this path.
+ZT.setFormData("last_api_alias", "edvin__errand_configuration");
```

### node 95 — Validate Order Reference & Sync Zendesk Fields (script code)

```diff
--- before/node 95 content
+++ after/node 95 content
@@ -1,76 +1,33 @@
-// ===== ENV FIELD RESOLUTION (shared block - keep IDENTICAL in nodes 10, 29, 93, 95) =====
-// Zendesk custom-field ids differ per org, so referencing custom_field_<id>
-// throughout the tree is what made promote/demote risky: every script, merge
-// field and payload had to be rewritten, and one missed reference reads a field
-// the target org does not have (that is exactly how the Genesys "NA" bug and the
-// contact-reason reader/writer split happened - see the changelog).
-// This block is the ONE place that knows those ids. It resolves each field once,
-// PROD id first with the DEV id as the fallback, and publishes a stable
-// snake_case name the rest of the tree reads. A promote or demote now only has to
-// be correct here.
+// Order reference gate, and the write-back point for everything the agent can
+// change on node 77.
 //
-// Both ids are tried on every run in BOTH environments on purpose: whichever org
-// this tree is running in populates one and leaves the other empty, so this block
-// is correct in dev and in prod with no edit at all.
+// Node 77 renders "Order Reference*" as a merge field rather than an input, so
+// the asterisk is not enforced by the form. This node is the enforcement: a blank
+// reference is routed by node 96 to node 97 ("add it to the ticket and try
+// again") instead of reaching Edvin Find Order and coming back as an API failure
+// screen, which would read like an outage rather than a missing field.
 //
-// PRECEDENCE: the standardized name wins, then the prod id, then the dev id.
-// The standardized name is FIRST because it is where the agent's answer lands -
-// node 6's two Contact Reason selects post directly to `contact_reason` and node
-// 47's re-select writes it through score_var (v50). The custom_field_ ids behind
-// it are the inbound-parameter fallback: they seed the value at the start of a
-// session and are what a fresh Zendesk ticket supplies.
-// Node 10 clears the standardized names before it resolves, so a Restart re-reads
-// the inbound parameters instead of inheriting the previous session's picks; a
-// deep resume (?session_id=) skips node 10 and therefore keeps them, which is the
-// behaviour you want in both cases.
-const ENV_FIELDS = {
-  order_reference:          ["custom_field_27823498043154", "custom_field_33772689958162"],
-  language:                 ["custom_field_27659659178002", "custom_field_28137345621650"],
-  contact_reason:           ["custom_field_29658558478738", "custom_field_29559177650834"],
-  genesys_conversation_id:  ["custom_field_30866832265234", "custom_field_31975964556050"],
-  genesys_interaction_type: ["custom_field_30555623661842", "custom_field_31213052370194"]
-};
+// DELIBERATE custom_field_ USE. The house rule is that only the root reads a raw
+// Zendesk field id; this node WRITES two of them, which is the other half of the
+// pair. It has to happen after node 77 - that is the screen the agent changes
+// them on. Node 10 and predefined_vars are the only other places an id appears.
+const order_reference = String(ZT.getVariableValue("order_reference", "")).trim();
+const contact_reason = String(ZT.getVariableValue("contact_reason", "")).trim();
 
-function resolveEnvFields() {
-  const resolved = {};
-  Object.keys(ENV_FIELDS).forEach(function (name) {
-    const ids = ENV_FIELDS[name];
-    let value = String(ZT.getVariableValue(name, "") || "").trim();
-    for (let i = 0; i < ids.length && !value; i++) {
-      value = String(ZT.getVariableValue(ids[i], "") || "").trim();
-    }
-    ZT.setFormData(name, value);
-    // Fan the resolved value back out to BOTH orgs' ids (v50, Brent). Anything
-    // that still names one of them - a Connected Object request body in the admin
-    // UI, a merge field, a future edit, a paste from the other environment - then
-    // reads the right value instead of an empty one. This is what makes a stray
-    // custom_field_ reference SAFE rather than silently wrong, in either org.
-    ids.forEach(function (id) { ZT.setFormData(id, value); });
-    resolved[name] = value;
-  });
-  // orderReference (camelCase) stays as a MIRROR of order_reference: the Connected
-  // Object request bodies live in the Zingtree admin UI, not in this export, and
-  // at least one reads ${orderReference}. Dropping it would empty that payload
-  // silently - same reasoning as transforms.child_ticket keeping its name.
-  ZT.setFormData("orderReference", resolved.order_reference);
-  return resolved;
+ZT.setFormData("order_reference", order_reference);
+ZT.setFormData("orderReference", order_reference); // Connected Object bodies read this name
+ZT.setFormData("has_order_reference", order_reference !== "");
+
+// Write the agent-facing values back to THIS org's Zendesk ticket fields, so the
+// ticket and the tree agree from here on. Env-specific ids - the only other place
+// they appear is node 10's intake block and predefined_vars.
+// Blank is never written back: it would clear a value the ticket already holds.
+if (order_reference) {
+  ZT.setFormData("custom_field_33772689958162", order_reference);
+}
+if (contact_reason) {
+  ZT.setFormData("custom_field_29559177650834", contact_reason);
 }
 
-const env = resolveEnvFields();
-// ===== END ENV FIELD RESOLUTION BLOCK =====
-
-// Order Reference validation (Brent, 2026-09-02: "every form data input field
-// and dynamic view has a value provided"). Node 77 renders "Order Reference*"
-// as a merge field, not an input, so the asterisk was never enforced by
-// anything - a blank reference went straight into Edvin Find Order and came
-// back as an API failure screen, which reads like an outage rather than a
-// missing field.
-//
-// Same resolution order the rest of the tree uses (nodes 32/44/93), so a value
-// that arrived as an inbound query param, was set by node 10, or is already on
-// the Zendesk ticket all count as provided.
-const orderReference = String(env.order_reference || "").trim();
-
-ZT.setFormData("has_order_reference", orderReference !== "");
-ZT.setFormData("order_reference", orderReference);
-ZT.setFormData("orderReference", orderReference); // mirror - see the ENV block
+// Node 4 (Edvin - Find Order) fires next once node 96 passes this gate.
+ZT.setFormData("last_api_alias", "findorder");
```

### node 99 — Build Manual Errand Registration Card (script code)

```diff
--- before/node 99 content
+++ after/node 99 content
@@ -1,7 +1,7 @@
 // Builds the manual-registration card for the no-order-reference (orphan) case.
-// Christina, 2026-09-04 ETG Collaboration Hour: there is no order to register an
-// errand against, so the automatic Edvin call is replaced by a screen telling the
-// agent to register it by hand, showing exactly the fields Edvin will ask for.
+// Christina (ETG): there is no order to register an errand against, so the
+// automatic Edvin call is replaced by a screen telling the agent to register it
+// by hand, showing exactly the fields Edvin will ask for.
 // Her list, verbatim: "We need channel category type and action. And the notes.
 // And genesis interaction ID." Genesys interaction TYPE is intentionally absent -
 // "it's not mandatory because it's the channel".
@@ -55,24 +55,3 @@
 
 ZT.setTransformData("manual_errand_registration_html", html);
 ZT.setFormData("manual_errand_count", errands.length);
-
-// The run's read-out must not look like a registration silently went missing.
-// Node 89's summary counts OK rows for "Edvin Register Errand"; on this path
-// there are none by design, so say so explicitly.
-const LOG_VAR = "execution_log";
-const LOG_REC = "~||~";
-const LOG_FLD = "~:~";
-
-function logClean(v) {
-  if (v === null || v === undefined) return "";
-  return String(v).replace(/~/g, "-").replace(/[\r\n\t]+/g, " ").trim().slice(0, 300);
-}
-
-const seq = parseInt(ZT.getVariableValue("execution_log_seq", 0), 10) + 1;
-const entry = [seq, new Date().toISOString(), "node 100", "Manual Errand Registration", "INFO", "",
-  ZT.getVariableValue("zd_ticket_id", ""),
-  "No order reference - " + errands.length + " errand(s) handed to the agent to register in Edvin"]
-  .map(logClean).join(LOG_FLD);
-const existing = ZT.getVariableValue(LOG_VAR, "");
-ZT.setFormData(LOG_VAR, existing ? existing + LOG_REC + entry : entry);
-ZT.setFormData("execution_log_seq", seq);
```

## CHANGES THAT NEED AN EXPLANATION

Every line below must map to a requirement or an explicit request.
Anything unexplained is unintended drift — revert it before delivering.

  [ ] removed node 89 (Render Execution Log)
  [ ] node 5 — content changed (1809 → 1876 lines) — claude.md
  [ ] node 9 — script code changed (97 → 40 lines) — Format Passengers
  [ ] node 10 — page_title: "Clear session and start fresh order" → "Clear Session & Seed Zendesk Intake"
  [ ] node 10 — node_name: "Clear session state, then start a fresh order lookup" → "Clear session state, seed the Zendesk intake values"
  [ ] node 10 — script code changed (242 → 109 lines) — Clear Session & Seed Zendesk Intake
  [ ] node 14 — content changed (486 → 447 characters) — Edvin - Find Order - Request Failed
  [ ] node 16 — content changed (519 → 480 characters) — Zendesk - Add Internal Note - Request Failed
  [ ] node 18 — content changed (504 → 465 characters) — ZD - Create Child Ticket - Request Failed
  [ ] node 21 — script code changed (152 → 83 lines) — Format Internal Note
  [ ] node 27 — script code changed (239 → 238 lines) — Stitch & Group PNR Action Selections
  [ ] node 28 — content changed (614 → 575 characters) — GET Edvin Errands - Request Failed
  [ ] node 29 — script code changed (221 → 61 lines) — Clear Data
  [ ] node 31 — content changed (504 → 465 characters) — Edvin - Register Errand - Request Failed
  [ ] node 32 — script code changed (267 → 206 lines) — Loop Tickets (child + grand child)
  [ ] node 40 — content changed (513 → 474 characters) — Get Child Ticket Details - Request Failed
  [ ] node 44 — script code changed (366 → 286 lines) — Loop Errands to Register
  [ ] node 45 — content changed (523 → 484 characters) — Update Child Ticket - Request Failed
  [ ] node 46 — script code changed (188 → 128 lines) — Format Types
  [ ] node 48 — content changed (84 → 45 characters) — End Session
  [ ] node 53 — content changed (366 → 327 characters) — Session Ended - Request Failed
  [ ] node 58 — script code changed (28 → 26 lines) — Check Customer Action Selections
  [ ] node 61 — script code changed (87 → 27 lines) — Insert Linked PNR's
  [ ] node 64 — script code changed (68 → 10 lines) — Set Side Conversation Id
  [ ] node 65 — script code changed (92 → 34 lines) — Resolve Ticket Id
  [ ] node 83 — continuation_node_id: 89 → 23 — Is More PNR's?
  [ ] node 83 — button added/changed: "" → node 23
  [ ] node 83 — button removed/replaced: "" → node 89
  [ ] node 86 — script code changed (162 → 49 lines) — API Failure - Log & Render
  [ ] node 87 — content changed (72 → 33 characters) — Request Failed
  [ ] node 93 — script code changed (136 → 73 lines) — No-PNR Bridge (Unconfirmed Booking / Orphan)
  [ ] node 95 — page_title: "Check Order Reference Provided" → "Validate Order Reference & Sync Zendesk Fields"
  [ ] node 95 — node_name: "Check Order Reference Provided" → "Validate order reference, write back to Zendesk"
  [ ] node 95 — script code changed (76 → 33 lines) — Validate Order Reference & Sync Zendesk Fields
  [ ] node 99 — script code changed (78 → 57 lines) — Build Manual Errand Registration Card
  [ ] node 100 — button added/changed: "I have registered this in Edvin::zt_manual_errand_registered" → node 23
  [ ] node 100 — button removed/replaced: "I have registered this in Edvin::zt_manual_errand_registered" → node 89

