========================================================================
WORKFLOW DIFF — Register Errands
========================================================================

Before : before.json  (76 nodes)
After  : after.json  (77 nodes)

## PLAIN SUMMARY

47 of 77 nodes are byte-for-byte identical to the original (61% untouched).
1 node added, 0 removed, 0 renumbered, 29 modified.

In plain terms:
  + NEW      node 19 — Render API Receipt [Script]
  * CHANGED  node 2 — Dynamic Actions List Options [Script]
               - script code changed (96 → 74 lines) — Dynamic Actions List Options
  * CHANGED  node 5 — claude.md [Content]
               - content changed (1876 → 2055 lines) — claude.md
  * CHANGED  node 9 — Format Passengers [Script]
               - script code changed (43 → 46 lines) — Format Passengers
  * CHANGED  node 10 — Clear Session & Seed Zendesk Intake [Script]
               - script code changed (109 → 144 lines) — Clear Session & Seed Zendesk Intake
  * CHANGED  node 14 — Edvin - Find Order - Request Failed [Content]
               - content changed (447 → 477 characters) — Edvin - Find Order - Request Failed
  * CHANGED  node 16 — Zendesk - Add Internal Note - Request Failed [Content]
               - content changed (480 → 510 characters) — Zendesk - Add Internal Note - Request Failed
  * CHANGED  node 18 — ZD - Create Child Ticket - Request Failed [Content]
               - content changed (465 → 495 characters) — ZD - Create Child Ticket - Request Failed
  * CHANGED  node 21 — Format Internal Note [Script]
               - script code changed (83 → 86 lines) — Format Internal Note
  * CHANGED  node 23 — Closing Call [Content]
               - content changed (268 → 298 characters) — Closing Call
  * CHANGED  node 28 — GET Edvin Errands - Request Failed [Content]
               - content changed (575 → 605 characters) — GET Edvin Errands - Request Failed
  * CHANGED  node 29 — Clear Data [Script]
               - script code changed (61 → 65 lines) — Clear Data
  * CHANGED  node 31 — Edvin - Register Errand - Request Failed [Content]
               - content changed (465 → 495 characters) — Edvin - Register Errand - Request Failed
  * CHANGED  node 32 — Loop Tickets (child + grand child) [Script]
               - script code changed (206 → 209 lines) — Loop Tickets (child + grand child)
  * CHANGED  node 40 — Get Child Ticket Details - Request Failed [Content]
               - content changed (474 → 504 characters) — Get Child Ticket Details - Request Failed
  * CHANGED  node 44 — Loop Errands to Register [Script]
               - script code changed (286 → 289 lines) — Loop Errands to Register
  * CHANGED  node 45 — Update Child Ticket - Request Failed [Content]
               - content changed (484 → 514 characters) — Update Child Ticket - Request Failed
  * CHANGED  node 46 — Format Types [Script]
               - script code changed (128 → 112 lines) — Format Types
  * CHANGED  node 48 — End Session [Content]
               - content changed (45 → 75 characters) — End Session
  * CHANGED  node 53 — Session Ended - Request Failed [Content]
               - content changed (327 → 357 characters) — Session Ended - Request Failed
  * CHANGED  node 64 — Set Side Conversation Id [Script]
               - script code changed (10 → 17 lines) — Set Side Conversation Id
  * CHANGED  node 65 — Resolve Ticket Id [Script]
               - script code changed (34 → 40 lines) — Resolve Ticket Id
  * CHANGED  node 83 — Is More PNR's? [Scoring]
               - continuation_node_id: 23 → 19 — Is More PNR's?
               - button added/changed: "" → node 19
               - button removed/replaced: "" → node 23
  * CHANGED  node 86 — API Failure - Log & Render [Script]
               - script code changed (49 → 140 lines) — API Failure - Log & Render
  * CHANGED  node 87 — Request Failed [Content]
               - content changed (33 → 63 characters) — Request Failed
  * CHANGED  node 90 — Classify - Unconfirmed Booking Check [Script]
               - script code changed (29 → 33 lines) — Classify - Unconfirmed Booking Check
  * CHANGED  node 93 — No-PNR Bridge (Unconfirmed Booking / Orphan) [Script]
               - script code changed (74 → 77 lines) — No-PNR Bridge (Unconfirmed Booking / Orphan)
  * CHANGED  node 95 — Validate Order Reference & Sync Zendesk Fields [Script]
               - script code changed (33 → 36 lines) — Validate Order Reference & Sync Zendesk Fields
  * CHANGED  node 100 — Register This Errand in Edvin Manually [Content]
               - button added/changed: "I have registered this in Edvin::zt_manual_errand_registered" → node 19
               - button removed/replaced: "I have registered this in Edvin::zt_manual_errand_registered" → node 23
  * CHANGED  node 101 — No PNRs Available for This Order [Content]
               - content changed (817 → 1838 characters) — No PNRs Available for This Order

## TREE SHAPE

  node type                before    after    delta
  Content                      27       27       +0
  Data                          7        7       +0
  Scoring                      20       20       +0
  Script                       21       22       +1
  Tree                          1        1       +0
  TOTAL                        76       77       +1

  Root node unchanged (node 10).

## STRUCTURAL SANITY

  No broken links introduced.
  No nodes became unreachable.
  Pre-existing in the BEFORE tree (not caused by this edit): 0 broken link(s), 1 unreachable node(s).

## UNTOUCHED NODES (47)

  1, 3, 4, 6, 7, 8, 11, 12, 13, 15, 17, 22, 24, 25, 26, 27, 30, 33, 34, 39, 41, 42, 43, 47, 54, 55, 56, 57, 58, 59, 60, 61, 62, 63, 66, 75, 76, 77, 78, 84, 88, 91, 94, 96, 97, 98, 99

## TREE-LEVEL SETTINGS CHANGED (0)

  (none)

## COSMETIC / EDITOR-ONLY CHANGES (0) — ignore

  (none)

## LINE-LEVEL BODY DIFFS (27)

### node 2 — Dynamic Actions List Options (script code)

```diff
--- before/node 2 content
+++ after/node 2 content
@@ -1,30 +1,8 @@
 // Builds actions_array for the currently selected type from the Edvin API payload.
 
-const CONTACT_REASON_BY_ZENDESK = {
-  "contact_reason__rebooking": "Rebooking",
-  "contact_reason__cancellation": "Cancellation",
-  "contact_reason__refund": "Refund",
-  "contact_reason__name_correction_change": "Name Correction/Change",
-  "contact_reason__add_passenger": "Add Passenger/New ticket sell",
-  "contact_reason__change_customers_personal_information": "Change customer's personal information",
-  "contact_reason__document_travel_info": "Document & Travel Info",
-  "contact_reason__payment_question": "Payment Question",
-  "contact_reason__ancillaries_products": "Ancillaries/Services & Products",
-  "contact_reason__unconfirmed_booking": "Unconfirmed booking",
-  "contact_reason__site_support": "Site support",
-  "contact_reason__ongoing_issues": "Ongoing issues",
-  "contact_reason__other": "Other",
-  // SCHEDULE CHANGE //
-  "contact_reason__schedule_change": "Rebooking",
-  "contact_reason__cancellation_sc": "Cancellation",
-  "contact_reason__self_transfer_guarantee_vi_sc": "Self Transfer Guarantee (VI) - SC",
-  "contact_reason__self_transfer_guarantee_vi_passengers_at_the_airport": "Self Transfer Guarantee (VI) - Passengers at the airport",
-  "contact_reason__refund_sc": "Refund",
-  "contact_reason__ancillaries_products_sc": "Ancillaries/Services & Products",
-  "contact_reason__document_travel_info_sc": "Document & Travel Info",
-  "contact_reason__other_sc": "Other"
-};
-const CONTACT_REASON = CONTACT_REASON_BY_ZENDESK[ZT.getVariableValue("contact_reason", "Cancellation")] || "";
+// No contact-reason mapping here on purpose. This node reads the channel, category
+// and type the type resolver already put in transforms, so it never needs the Edvin
+// category name at all. The one catalogue of those names is seeded by the root.
 
 let type_id = ZT.getVariableValue("type", "");
 let selected_type = transforms.category.types.find(x => x.id == type_id);
```

### node 5 — claude.md (content)

```diff
--- before/node 5 content
+++ after/node 5 content
@@ -958,6 +958,27 @@
    ?debug=1 query param seeded a form variable).
 
 ## Changelog
+
+- 2026-09-05 (v54: one contact-reason catalogue, API receipt, no-PNR screen) -
+  Claude (Cowork)/Brent - Brent asked for three things: stop maintaining the
+  contact-reason list in more than one place (save it as a stringified form-data
+  variable and parse it on reference), bring back the custom API request log and
+  its display (his stated exception to the no-logging rule), and restyle the
+  no-PNR-for-this-order screen with a yellow warning label and real spacing.
+  (1) Node 10 now declares the 21-row contact-reason catalogue once as a
+  stringified form variable; nodes 2 and 46 and VI node 81 parse it instead of
+  restating it, and transforms.contact_reasons_dynamic is derived from it rather
+  than hand-typed a second time. Found in passing and fixed: the three copies had
+  drifted on five Edvin category names, and VI node 81 - the one that matches on
+  them live - had the wrong spelling, so five contact reasons were throwing there.
+  (2) New form variable api_trail, one append per API call site (nodes 9, 21, 29,
+  32, 44, 64, 65, 93, 95), and new Script node 19 renders api_receipt_html on
+  nodes 23 and 48. Node 86 prints the run's call sequence on the failure card and
+  reads its step names from a shared api_steps catalogue instead of its own map.
+  No arm/flush blocks and no ZT.log - the rest of the no-logging rule stands.
+  (3) Node 101 restyled: yellow WARNING pill, label/value rows, next-steps list.
+  nodes: 2, 5 (this entry), 9, 10, 19(new), 21, 23, 29, 32, 44, 46, 48, 64, 65,
+  83, 86, 93, 95, 100, 101
 
 - 2026-09-02 (v46: unified ticket loop, execution log, straight ETL) - Claude
   (Cowork)/Brent - Brent asked for fewer nodes, a permanent form-data log recording
@@ -1874,3 +1895,161 @@
 NOT DONE, STILL OPEN: node 10 and node 29 still write most loop state to
 transforms rather than form data, which the house rule now says should be form
 data. That is its own pass.
+
+
+## v54 (2026-09-05) - ONE CONTACT-REASON CATALOGUE, API RECEIPT BACK, NO-PNR SCREEN
+
+THREE CHANGES, ALL REQUESTED BY BRENT. Requirements: CR-018 in
+`Zingtree Builder/Requirements/ETG/register-errands-dynamic-requirements.md`.
+
+(1) ONE CONTACT-REASON CATALOGUE, SEEDED ONCE, PARSED EVERYWHERE.
+    The Zendesk-value -> Edvin-category-name mapping used to be written out three
+    times: node 46, node 2, and node 81 of the VI subtree - plus a fourth partial
+    copy in node 10, which listed the same 21 values again as select options with
+    their own labels. Four hand-maintained lists of the same 21 rows.
+    They had already drifted. Node 46 said "Payment Questions", "Document &
+    Travel info", "Name correction/change", "Add passenger/New ticket sell";
+    node 2 and VI node 81 said "Payment Question", "Document & Travel Info",
+    "Name Correction/Change", "Add Passenger/New ticket sell". Checked against
+    Edvin's own errand configuration, node 46 was right and the other two were
+    wrong on five rows. In node 2 that was harmless - it computed the name and
+    never read it, dead code - but VI node 81 matches on it live, so those five
+    contact reasons were throwing "No Edvin category match" in the VI flow.
+    THE SHAPE NOW. Node 10 declares the catalogue once: one row per contact
+    reason carrying `value` (what the Zendesk field holds), `label` (what the
+    agent sees), `edvin` (the Edvin category name) and `path` (fl or sc). It is
+    written to FORM data as a JSON string:
+        ZT.setFormData("contact_reasons", JSON.stringify(contact_reasons));
+    and read anywhere with
+        JSON.parse(ZT.getVariableValue("contact_reasons", "[]"))
+    then `.find(r => r.value === <the contact_reason value>)`.
+    Form data, not transforms, on purpose: form data has no TTL and it crosses
+    the Tree-node boundary into the VI subtree, which is the whole reason the VI
+    copy could be retired rather than just corrected.
+    `transforms.contact_reasons_dynamic` STILL EXISTS and is still the source
+    the two native dynamic selects on nodes 77 and 47 address by path
+    (contact_reasons_dynamic.fl_paths / .sc_paths) - that is transforms
+    exception 1 and it cannot move. It is now DERIVED from the catalogue with
+    two filter/map calls instead of being a second hand-typed list. Verified
+    byte-identical to v53's output, order included: the agent sees exactly the
+    same options in the same order.
+    Node 2's map and its unused CONTACT_REASON line are deleted outright.
+    Node 46 resolves `edvin_category_name` from the catalogue.
+    ADDING A CONTACT REASON IS NOW ONE EDIT: append a row in node 10.
+
+(2) API RECEIPT - THE ONE LOGGING EXCEPTION BRENT WANTS (his call, 2026-09-05).
+    v53 removed the execution log in full, and the house rule says no logging.
+    Brent's exception, stated this session: logging and DISPLAYING api requests
+    is worth keeping - "that custom display was very helpful". Everything else
+    about the no-logging rule stands. No ZT.log, no per-step breadcrumbs, no
+    arm/flush blocks pasted into twelve scripts. That last part is what v46's
+    design got wrong and it is not coming back.
+    THE SHAPE. Two pieces, neither of them a shared block:
+    - `api_trail` (form data, append-only for the run). ONE growing string that IS
+      the log - not a set of pointers into `actions`. Two entry kinds, two
+      delimiters, so a parser needs two split() calls:
+          A~:~<alias>~:~<subject>               armed, a call is about to fire
+          R~:~<alias>~:~OK|FAIL~:~<code>~:~<detail>   result, where it is known
+      No timestamps. The script sandbox does not expose `Date` - the offline
+      harness models that explicitly, and nothing else in this tree constructs one.
+      Append order IS the sequence, and node 19 numbers the rows as it renders.
+      Nine ARM sites - nodes 9, 21, 29, 32, 44, 64, 65, 93, 95, one line each next
+      to the `last_api_alias` line already there. Nodes 9 and 93 arm two calls,
+      because node 42 fires two Connected Objects.
+      Five RESULT sites, each one line in a script that ALREADY reads that
+      response, so nothing new is looked up: node 90 (findorder), node 46 (both of
+      node 42's calls), node 64 (create_child_ticket), node 65
+      (get_side_conversation_detail), and node 86 for whatever failed.
+    - Node 19 (Script, "Render API Receipt"). Splits the trail, attaches each R to
+      the most recent still-open A for that alias, and renders one row per
+      ATTEMPT - nothing collapsed - as two cards, failures first then completed,
+      in the same visual language as the old node 89. Nothing routes on it.
+    WHY THE RECORD LIVES IN THE STRING (Brent's call, 2026-09-05). `actions` holds
+    ONE response per alias. In the ticket loop `create_child_ticket` fires once per
+    ticket, so by the end of the run the only surviving response is the last one:
+    grading from `actions` at render time cannot tell four creates from one, and a
+    first attempt that failed 500 before a retry succeeded leaves no trace at all.
+    Writing OK/FAIL and the code into the trail at the moment the outcome is known
+    fixes both - four creates leave four graded rows, and the failed attempt keeps
+    its own code and message. It also survives the Connected Object cache expiring.
+    THREE CALLS STILL FALL BACK. Nothing in this tree reads back the responses of
+    `create_internal_note__no_group_id`, `zingtree_redesign__update_side_conversation`
+    or `edvin__register_errand` - that is why their aliases were never derivable
+    from the export. On the success path their A entry has no R, so node 19 grades
+    them from `actions` and labels the row "read back at end of run" rather than
+    passing a late read off as a contemporaneous one. On the failure path node 86
+    records them properly. Giving them real R entries would mean a write in a script
+    that does not otherwise touch them, at a node with two possible successors -
+    worth doing only if that end-of-run read ever proves misleading.
+    WHERE IT SHOWS - EVERY SCREEN A RUN CAN END ON, WHICHEVER WAY IT ENDS.
+    Success: node 19 sits immediately before node 23 (Closing Call) - node 83's
+    default branch and node 100's button go to 19, and 19 continues to 23. That
+    also removed a pre-existing Content-to-Content adjacency (100 -> 23).
+    Failure: node 86 runs on EVERY failure, before node 94 picks a screen, so it
+    renders the log too. That covers the eight Request Failed screens (14, 16, 18,
+    28, 31, 40, 45, 87) and node 53 (Session Ended - Request Failed) - the one an
+    agent reaches by pressing End Session on a failed call, which is exactly where
+    the read-out is most wanted and where an end-of-run-only renderer showed
+    nothing at all. Eleven screens print `${transforms.api_receipt_html}` in total:
+    those nine, plus 23 and 48.
+    THE RENDERER IS DUPLICATED IN NODES 19 AND 86, DELIBERATELY, and it is the only
+    duplicated block this tree allows. Both copies carry an
+    "API LOG RENDERER (keep IDENTICAL in nodes 19 and 86)" banner and are verified
+    byte-identical by the build's own harness. Why the house no-shared-blocks rule
+    yields here: the log has to render at the end of a successful run and at an
+    aborted one, those are two different paths ending at two different terminals
+    (23/48 vs 53), and routing both through one renderer needs a script-to-script
+    hop plus a router that cannot tell which way it was entered. The earlier
+    execution log kept its renderer in its own nodes 86 and 89 for the same reason.
+    `lint_tree.py` reports it as 75 shared 8-line windows between 19 and 86 -
+    expected, and the reason the banner exists.
+    Node 86 also stopped carrying its own alias->name map: both it and node 19
+    read `api_steps`, a second small catalogue node 10 seeds the same way. Node
+    86 keeps a one-line refinement for the create call, which labels itself from
+    `ticket_kind`. Its own failure card is unchanged and still prints the failing
+    call's raw response above the log.
+    THE RECEIPT IS AGENT-VISIBLE. Brent's call, 2026-09-05: always on, not gated
+    behind a debug flag. It prints alias, HTTP code, subject and, on a failure,
+    the response message - not a full body dump. The unscoped raw-response dumps
+    on the Request Failed screens are a separate, still-open item (see Open
+    items under v43).
+    STATE LIFECYCLE. `api_trail` clears in node 10 only - on a fresh launch and
+    on Restart - so an Additional/Different Request pass keeps accumulating onto
+    the same receipt, which is what you want when reading one session's history.
+    `api_receipt_html` clears in both node 10 and node 29; node 19 rebuilds it
+    before either screen renders it. It is a TRANSFORM, not form data: the house
+    rule prefers form data for rendered HTML, but every one of the eight blocks
+    that demonstrably renders in this tree - failure_html, ticket_card_html,
+    customer_action_table_html, edvin_errand_card_html,
+    manual_errand_registration_html, unresolved_note_html - is a transform, and
+    Zingtree's own Dynamic HTML article uses ${transforms.custom_html}. Nothing
+    in this tree has ever proven a form-data merge field renders markup rather
+    than escaping it, so this follows what works. The trail itself stays in form
+    data, where the no-TTL guarantee actually matters.
+
+(3) NO-PNR SCREEN (node 101) RESTYLED.
+    Was one wall of text with the order details run together on `<br>`s. Now: a
+    yellow WARNING pill next to the title, the intake values in the same
+    label/value row pattern nodes 12/32/44/99 use, boxed on the amber ground the
+    zt-cb-type-warning block already implies, and a "What happens next" list
+    instead of a third paragraph. Same words, same merge fields, same single
+    Continue button to node 93 - only the markup changed.
+
+TWO KNOWN VALIDATOR FINDINGS, BOTH DELIBERATE. `validate_tree.js` enforces
+"everything node 10 resets, node 29 resets too" and now flags `contact_reasons`
+and `api_steps`. Both are immutable reference data seeded once, not per-run
+state: clearing them in node 29 would blank the catalogue on the Additional
+Request path and break node 46 and node 86. The validator wants a CATALOGUE
+exclusion set alongside its INBOUND one - that is a change to the
+etg-errand-regression harness, not to this tree.
+
+HARNESS NOTE, NOT A DEFECT IN THIS BUILD. `walk.mjs` detects a non-advancing
+loop by hashing all of form data, and `api_trail` grows on every pass through a
+call site, so a loop that crosses one no longer looks identical to the harness.
+Excluding `api_trail` and `api_receipt_html` from that hash restores it exactly.
+Zingtree's own runtime guard counts node revisits, not form data, so live
+behaviour is unaffected. Separately, `etg-errand-regression`'s `run_full.js`
+reports 0 of 64 cases passing on the v53 baseline as well as on this build - its
+oracle still expects node 27 to emit `child_tickets`/`silent_tickets`, which the
+v46 unified `work_queue` replaced. Its verdict is not usable until it is updated;
+the before/after delta (byte-identical CSVs) is.
```

### node 9 — Format Passengers (script code)

```diff
--- before/node 9 content
+++ after/node 9 content
@@ -41,3 +41,6 @@
 // (node 94) and the retry router (node 88) know which request to blame and
 // which Data node to re-fire.
 ZT.setFormData("last_api_alias", "edvin__errand_configuration");
+// Arms the log for the call about to fire. Its outcome is appended as a
+// separate R entry where that outcome is known.
+ZT.setFormData("api_trail", ZT.getVariableValue("api_trail", "") + "A~:~edvin__errand_configuration~:~" + ZT.getVariableValue("contact_reason", "") + "~||~A~:~get_edvin_prop_long_value~:~" + ZT.getVariableValue("contact_reason", "") + "~||~");
```

### node 10 — Clear Session & Seed Zendesk Intake (script code)

```diff
--- before/node 10 content
+++ after/node 10 content
@@ -52,6 +52,12 @@
 ZT.setTransformData("failure_html", ``);
 ZT.setFormData("last_api_alias", "");
 
+// --- API receipt state ---------------------------------------------------------
+// api_trail is append-only for the life of a run; it clears here and on Restart
+// only, so an Additional Request pass keeps accumulating onto the same receipt.
+ZT.setFormData("api_trail", "");
+ZT.setTransformData("api_receipt_html", ``);
+
 // --- Zendesk intake ------------------------------------------------------------
 // These five values arrive as inbound query parameters named after THIS org's
 // Zendesk ticket-field ids. This is the only place in the tree that reads them;
@@ -75,35 +81,64 @@
 // the mirror stays until every one of them is confirmed to read order_reference.
 ZT.setFormData("orderReference", order_reference);
 
-// --- Contact Reason options ----------------------------------------------------
-// Source for the two dynamic selects on nodes 77 and 47. A dynamic list source
-// addresses a transform by path, so this one has to be a transform.
-let contact_reasons_dynamic = {
-  fl_paths: [
-    { label: "Contact Reason Rebooking", value: "contact_reason__rebooking" },
-    { label: "Contact Reason Cancellation", value: "contact_reason__cancellation" },
-    { label: "Contact Reason Refund", value: "contact_reason__refund" },
-    { label: "Contact Reason Name Correction Change", value: "contact_reason__name_correction_change" },
-    { label: "Contact Reason Add Passenger", value: "contact_reason__add_passenger" },
-    { label: "Contact Reason Change Customers Personal Information", value: "contact_reason__change_customers_personal_information" },
-    { label: "Contact Reason Document Travel Info", value: "contact_reason__document_travel_info" },
-    { label: "Contact Reason Payment Question", value: "contact_reason__payment_question" },
-    { label: "Contact Reason Ancillaries Products", value: "contact_reason__ancillaries_products" },
-    { label: "Contact Reason Unconfirmed Booking", value: "contact_reason__unconfirmed_booking" },
-    { label: "Contact Reason Site Support", value: "contact_reason__site_support" },
-    { label: "Contact Reason Other", value: "contact_reason__other" },
-    { label: "Contact Reason Ongoing Issues", value: "contact_reason__ongoing_issues" }
-  ],
-  sc_paths: [
-    { label: "Contact Reason SC Rebooking", value: "contact_reason__schedule_change" },
-    { label: "Contact Reason SC Cancellation", value: "contact_reason__cancellation_sc" },
-    { label: "Contact Reason SC Self Transfer Guarantee VI SC", value: "contact_reason__self_transfer_guarantee_vi_sc" },
-    { label: "Contact Reason SC Self Transfer Guarantee VI Passengers At The Airport", value: "contact_reason__self_transfer_guarantee_vi_passengers_at_the_airport" },
-    { label: "Contact Reason SC Refund", value: "contact_reason__refund_sc" },
-    { label: "Contact Reason SC Ancillaries Products", value: "contact_reason__ancillaries_products_sc" },
-    { label: "Contact Reason SC Document Travel Info", value: "contact_reason__document_travel_info_sc" },
-    { label: "Contact Reason SC Other", value: "contact_reason__other_sc" }
-  ]
-};
+// --- Contact Reason catalogue ---------------------------------------------------
+// SINGLE SOURCE OF TRUTH for contact reasons. One row per Zendesk contact-reason
+// value: `value` is what the Zendesk field holds, `label` is what the agent sees
+// in the selects on nodes 77 and 47, `edvin` is the Edvin category name the type
+// resolvers match against, `path` is the agent group the reason belongs to.
+// The Edvin names are case-sensitive and match Edvin's own errand configuration -
+// "Payment Questions" and "Document & Travel info" really are spelled that way.
+// This is the tree's only copy of the mapping and no other node may restate it,
+// in this tree or in the VI subtree. Read it with
+//   JSON.parse(ZT.getVariableValue("contact_reasons", "[]"))
+// and find the row by `value`.
+const contact_reasons = [
+  { value: "contact_reason__rebooking", label: "Contact Reason Rebooking", edvin: "Rebooking", path: "fl" },
+  { value: "contact_reason__cancellation", label: "Contact Reason Cancellation", edvin: "Cancellation", path: "fl" },
+  { value: "contact_reason__refund", label: "Contact Reason Refund", edvin: "Refund", path: "fl" },
+  { value: "contact_reason__name_correction_change", label: "Contact Reason Name Correction Change", edvin: "Name correction/change", path: "fl" },
+  { value: "contact_reason__add_passenger", label: "Contact Reason Add Passenger", edvin: "Add passenger/New ticket sell", path: "fl" },
+  { value: "contact_reason__change_customers_personal_information", label: "Contact Reason Change Customers Personal Information", edvin: "Change customer's personal information", path: "fl" },
+  { value: "contact_reason__document_travel_info", label: "Contact Reason Document Travel Info", edvin: "Document & Travel info", path: "fl" },
+  { value: "contact_reason__payment_question", label: "Contact Reason Payment Question", edvin: "Payment Questions", path: "fl" },
+  { value: "contact_reason__ancillaries_products", label: "Contact Reason Ancillaries Products", edvin: "Ancillaries/Services & Products", path: "fl" },
+  { value: "contact_reason__unconfirmed_booking", label: "Contact Reason Unconfirmed Booking", edvin: "Unconfirmed booking", path: "fl" },
+  { value: "contact_reason__site_support", label: "Contact Reason Site Support", edvin: "Site support", path: "fl" },
+  { value: "contact_reason__other", label: "Contact Reason Other", edvin: "Other", path: "fl" },
+  { value: "contact_reason__ongoing_issues", label: "Contact Reason Ongoing Issues", edvin: "Ongoing issues", path: "fl" },
+  { value: "contact_reason__schedule_change", label: "Contact Reason SC Rebooking", edvin: "Rebooking", path: "sc" },
+  { value: "contact_reason__cancellation_sc", label: "Contact Reason SC Cancellation", edvin: "Cancellation", path: "sc" },
+  { value: "contact_reason__self_transfer_guarantee_vi_sc", label: "Contact Reason SC Self Transfer Guarantee VI SC", edvin: "Self Transfer Guarantee (VI) - SC", path: "sc" },
+  { value: "contact_reason__self_transfer_guarantee_vi_passengers_at_the_airport", label: "Contact Reason SC Self Transfer Guarantee VI Passengers At The Airport", edvin: "Self Transfer Guarantee (VI) - Passengers at the airport", path: "sc" },
+  { value: "contact_reason__refund_sc", label: "Contact Reason SC Refund", edvin: "Refund", path: "sc" },
+  { value: "contact_reason__ancillaries_products_sc", label: "Contact Reason SC Ancillaries Products", edvin: "Ancillaries/Services & Products", path: "sc" },
+  { value: "contact_reason__document_travel_info_sc", label: "Contact Reason SC Document Travel Info", edvin: "Document & Travel info", path: "sc" },
+  { value: "contact_reason__other_sc", label: "Contact Reason SC Other", edvin: "Other", path: "sc" }
+];
 
-ZT.setTransformData("contact_reasons_dynamic", contact_reasons_dynamic);
+ZT.setFormData("contact_reasons", JSON.stringify(contact_reasons));
+
+// Transforms exception 1 (native dynamic select source): the two contact-reason
+// selects on nodes 77 and 47 address their options by transform path
+// (contact_reasons_dynamic.fl_paths / .sc_paths), so that shape has to exist as a
+// transform. It is DERIVED from the catalogue above, never typed out again -
+// filter() preserves the order the rows are declared in, which is the order the
+// agent sees.
+ZT.setTransformData("contact_reasons_dynamic", {
+  fl_paths: contact_reasons.filter(r => r.path === "fl").map(r => ({ label: r.label, value: r.value })),
+  sc_paths: contact_reasons.filter(r => r.path === "sc").map(r => ({ label: r.label, value: r.value }))
+});
+
+// --- API request catalogue -----------------------------------------------------
+// alias -> the readable request name the failure card and the end-of-run receipt
+// both label it with. Seeded once here so neither of them carries its own copy.
+ZT.setFormData("api_steps", JSON.stringify({
+  findorder: "Edvin - Find Order",
+  edvin__errand_configuration: "GET Edvin Errands",
+  get_edvin_prop_long_value: "Edvin - Get Channel Id",
+  edvin__register_errand: "Edvin - Register Errand",
+  create_internal_note__no_group_id: "Zendesk - Add Internal Note",
+  create_child_ticket: "ZD - Create Ticket",
+  get_side_conversation_detail: "Get Ticket Details",
+  zingtree_redesign__update_side_conversation: "Update Ticket"
+}));
```

### node 14 — Edvin - Find Order - Request Failed (content)

```diff
--- before/node 14 content
+++ after/node 14 content
@@ -1 +1 @@
-<div class="zt-content-block zt-cb-type-alert"><div class="zt-cb-title"><i class="zt-cb-icon" contenteditable="false"></i><h3>Request Failed</h3></div><div class="zt-cb-body"><p>The <strong>Edvin - Find Order</strong> request did not complete successfully (expected a 200 or 201 response).</p><p>You can try the request again, or end this session.</p><p><strong>API Response (debug):</strong></p><p>${actions.findorder | stringify}</p></div></div>
+<div class="zt-content-block zt-cb-type-alert"><div class="zt-cb-title"><i class="zt-cb-icon" contenteditable="false"></i><h3>Request Failed</h3></div><div class="zt-cb-body"><p>The <strong>Edvin - Find Order</strong> request did not complete successfully (expected a 200 or 201 response).</p><p>You can try the request again, or end this session.</p><p><strong>API Response (debug):</strong></p><p>${actions.findorder | stringify}</p>${transforms.api_receipt_html}</div></div>
```

### node 16 — Zendesk - Add Internal Note - Request Failed (content)

```diff
--- before/node 16 content
+++ after/node 16 content
@@ -1 +1 @@
-<div class="zt-content-block zt-cb-type-alert"><div class="zt-cb-title"><i class="zt-cb-icon" contenteditable="false"></i><h3>Request Failed</h3></div><div class="zt-cb-body"><p>The <strong>Zendesk - Add Internal Note</strong> request did not complete successfully (expected a 200 or 201 response).</p><p>You can try the request again, or end this session.</p><p><strong>API Response (debug):</strong></p><p>${actions.create_internal_note__no_group_id | stringify}</p></div></div>
+<div class="zt-content-block zt-cb-type-alert"><div class="zt-cb-title"><i class="zt-cb-icon" contenteditable="false"></i><h3>Request Failed</h3></div><div class="zt-cb-body"><p>The <strong>Zendesk - Add Internal Note</strong> request did not complete successfully (expected a 200 or 201 response).</p><p>You can try the request again, or end this session.</p><p><strong>API Response (debug):</strong></p><p>${actions.create_internal_note__no_group_id | stringify}</p>${transforms.api_receipt_html}</div></div>
```

### node 18 — ZD - Create Child Ticket - Request Failed (content)

```diff
--- before/node 18 content
+++ after/node 18 content
@@ -1 +1 @@
-<div class="zt-content-block zt-cb-type-alert"><div class="zt-cb-title"><i class="zt-cb-icon" contenteditable="false"></i><h3>Request Failed</h3></div><div class="zt-cb-body"><p>The <strong>ZD - Create ${ticket_kind}</strong> request did not complete successfully (expected a 200 or 201 response).</p><p>You can try the request again, or end this session.</p><p><strong>API Response (debug):</strong></p><p>${actions.create_child_ticket | stringify}</p></div></div>
+<div class="zt-content-block zt-cb-type-alert"><div class="zt-cb-title"><i class="zt-cb-icon" contenteditable="false"></i><h3>Request Failed</h3></div><div class="zt-cb-body"><p>The <strong>ZD - Create ${ticket_kind}</strong> request did not complete successfully (expected a 200 or 201 response).</p><p>You can try the request again, or end this session.</p><p><strong>API Response (debug):</strong></p><p>${actions.create_child_ticket | stringify}</p>${transforms.api_receipt_html}</div></div>
```

### node 21 — Format Internal Note (script code)

```diff
--- before/node 21 content
+++ after/node 21 content
@@ -81,3 +81,6 @@
 // (node 94) and the retry router (node 88) know which request to blame and
 // which Data node to re-fire.
 ZT.setFormData("last_api_alias", "create_internal_note__no_group_id");
+// Arms the log for the call about to fire. Its outcome is appended as a
+// separate R entry where that outcome is known.
+ZT.setFormData("api_trail", ZT.getVariableValue("api_trail", "") + "A~:~create_internal_note__no_group_id~:~Ticket " + ZT.getVariableValue("zd_ticket_id", "") + "~||~");
```

### node 23 — Closing Call (content)

```diff
--- before/node 23 content
+++ after/node 23 content
@@ -1 +1 @@
-<div class="zt-content-block zt-cb-type-action"><div class="zt-cb-title"><i class="zt-cb-icon" contenteditable="false"></i><h3>Success</h3></div><div class="zt-cb-body"><p id="isPasted">All PNR's are resolved into child tickets or customer resolutions.</p></div></div>
+<div class="zt-content-block zt-cb-type-action"><div class="zt-cb-title"><i class="zt-cb-icon" contenteditable="false"></i><h3>Success</h3></div><div class="zt-cb-body"><p id="isPasted">All PNR's are resolved into child tickets or customer resolutions.</p>${transforms.api_receipt_html}</div></div>
```

### node 28 — GET Edvin Errands - Request Failed (content)

```diff
--- before/node 28 content
+++ after/node 28 content
@@ -1 +1 @@
-<div class="zt-content-block zt-cb-type-alert"><div class="zt-cb-title"><i class="zt-cb-icon" contenteditable="false"></i><h3>Request Failed</h3></div><div class="zt-cb-body"><p>The <strong>GET Edvin Errands</strong> request did not complete successfully (expected a 200 or 201 response).</p><p>You can try the request again, or end this session.</p><p><strong>API Response (debug):</strong></p><p>edvin__errand_configuration: ${actions.edvin__errand_configuration | stringify}</p><p>get_edvin_prop_long_value: ${actions.get_edvin_prop_long_value | stringify}</p></div></div>
+<div class="zt-content-block zt-cb-type-alert"><div class="zt-cb-title"><i class="zt-cb-icon" contenteditable="false"></i><h3>Request Failed</h3></div><div class="zt-cb-body"><p>The <strong>GET Edvin Errands</strong> request did not complete successfully (expected a 200 or 201 response).</p><p>You can try the request again, or end this session.</p><p><strong>API Response (debug):</strong></p><p>edvin__errand_configuration: ${actions.edvin__errand_configuration | stringify}</p><p>get_edvin_prop_long_value: ${actions.get_edvin_prop_long_value | stringify}</p>${transforms.api_receipt_html}</div></div>
```

### node 29 — Clear Data (script code)

```diff
--- before/node 29 content
+++ after/node 29 content
@@ -54,8 +54,12 @@
 
 // --- Failure-path state --------------------------------------------------------
 ZT.setTransformData("failure_html", ``);
+ZT.setTransformData("api_receipt_html", ``);
 
 // Node 4 (Edvin - Find Order) fires next on this path. Names the call so the
 // failure screen router (node 94) and the retry router (node 88) know which
 // request to blame and which Data node to re-fire.
 ZT.setFormData("last_api_alias", "findorder");
+// Arms the log for the call about to fire. Its outcome is appended as a
+// separate R entry where that outcome is known.
+ZT.setFormData("api_trail", ZT.getVariableValue("api_trail", "") + "A~:~findorder~:~" + ZT.getVariableValue("order_reference", "") + "~||~");
```

### node 31 — Edvin - Register Errand - Request Failed (content)

```diff
--- before/node 31 content
+++ after/node 31 content
@@ -1 +1 @@
-<div class="zt-content-block zt-cb-type-alert"><div class="zt-cb-title"><i class="zt-cb-icon" contenteditable="false"></i><h3>Request Failed</h3></div><div class="zt-cb-body"><p>The <strong>Edvin - Register Errand</strong> request did not complete successfully (expected a 200 or 201 response).</p><p>You can try the request again, or end this session.</p><p><strong>API Response (debug):</strong></p><p>${actions.edvin__register_errand | stringify}</p></div></div>
+<div class="zt-content-block zt-cb-type-alert"><div class="zt-cb-title"><i class="zt-cb-icon" contenteditable="false"></i><h3>Request Failed</h3></div><div class="zt-cb-body"><p>The <strong>Edvin - Register Errand</strong> request did not complete successfully (expected a 200 or 201 response).</p><p>You can try the request again, or end this session.</p><p><strong>API Response (debug):</strong></p><p>${actions.edvin__register_errand | stringify}</p>${transforms.api_receipt_html}</div></div>
```

### node 32 — Loop Tickets (child + grand child) (script code)

```diff
--- before/node 32 content
+++ after/node 32 content
@@ -204,3 +204,6 @@
 // (node 94) and the retry router (node 88) know which request to blame and
 // which Data node to re-fire.
 ZT.setFormData("last_api_alias", "create_child_ticket");
+// Arms the log for the call about to fire. Its outcome is appended as a
+// separate R entry where that outcome is known.
+ZT.setFormData("api_trail", ZT.getVariableValue("api_trail", "") + "A~:~create_child_ticket~:~" + (current_ticket.title || "") + "~||~");
```

### node 40 — Get Child Ticket Details - Request Failed (content)

```diff
--- before/node 40 content
+++ after/node 40 content
@@ -1 +1 @@
-<div class="zt-content-block zt-cb-type-alert"><div class="zt-cb-title"><i class="zt-cb-icon" contenteditable="false"></i><h3>Request Failed</h3></div><div class="zt-cb-body"><p>The <strong>Get ${ticket_kind} Details</strong> request did not complete successfully (expected a 200 or 201 response).</p><p>You can try the request again, or end this session.</p><p><strong>API Response (debug):</strong></p><p>${actions.get_side_conversation_detail | stringify}</p></div></div>
+<div class="zt-content-block zt-cb-type-alert"><div class="zt-cb-title"><i class="zt-cb-icon" contenteditable="false"></i><h3>Request Failed</h3></div><div class="zt-cb-body"><p>The <strong>Get ${ticket_kind} Details</strong> request did not complete successfully (expected a 200 or 201 response).</p><p>You can try the request again, or end this session.</p><p><strong>API Response (debug):</strong></p><p>${actions.get_side_conversation_detail | stringify}</p>${transforms.api_receipt_html}</div></div>
```

### node 44 — Loop Errands to Register (script code)

```diff
--- before/node 44 content
+++ after/node 44 content
@@ -284,3 +284,6 @@
 // (node 94) and the retry router (node 88) know which request to blame and
 // which Data node to re-fire.
 ZT.setFormData("last_api_alias", "edvin__register_errand");
+// Arms the log for the call about to fire. Its outcome is appended as a
+// separate R entry where that outcome is known.
+ZT.setFormData("api_trail", ZT.getVariableValue("api_trail", "") + "A~:~edvin__register_errand~:~" + (current_pnr.pnr || ZT.getVariableValue("order_reference", "")) + "~||~");
```

### node 45 — Update Child Ticket - Request Failed (content)

```diff
--- before/node 45 content
+++ after/node 45 content
@@ -1 +1 @@
-<div class="zt-content-block zt-cb-type-alert"><div class="zt-cb-title"><i class="zt-cb-icon" contenteditable="false"></i><h3>Request Failed</h3></div><div class="zt-cb-body"><p>The <strong>Update ${ticket_kind}</strong> request did not complete successfully (expected a 200 or 201 response).</p><p>You can try the request again, or end this session.</p><p><strong>API Response (debug):</strong></p><p>${actions.zingtree_redesign__update_side_conversation | stringify}</p></div></div>
+<div class="zt-content-block zt-cb-type-alert"><div class="zt-cb-title"><i class="zt-cb-icon" contenteditable="false"></i><h3>Request Failed</h3></div><div class="zt-cb-body"><p>The <strong>Update ${ticket_kind}</strong> request did not complete successfully (expected a 200 or 201 response).</p><p>You can try the request again, or end this session.</p><p><strong>API Response (debug):</strong></p><p>${actions.zingtree_redesign__update_side_conversation | stringify}</p>${transforms.api_receipt_html}</div></div>
```

### node 46 — Format Types (script code)

```diff
--- before/node 46 content
+++ after/node 46 content
@@ -16,39 +16,23 @@
 let errand_configuration = actions.edvin__errand_configuration;
 let edvin_prop_long_val = actions.get_edvin_prop_long_value;
 
-// Maps the Zendesk contact-reason field to the Edvin category name, until Edvin
-// returns a value that matches the Zendesk field directly.
-const CONTACT_REASON_BY_ZENDESK = {
-  "contact_reason__rebooking": "Rebooking",
-  "contact_reason__cancellation": "Cancellation",
-  "contact_reason__refund": "Refund",
-  "contact_reason__name_correction_change": "Name correction/change",
-  "contact_reason__add_passenger": "Add passenger/New ticket sell",
-  "contact_reason__change_customers_personal_information": "Change customer's personal information",
-  "contact_reason__document_travel_info": "Document & Travel info",
-  "contact_reason__payment_question": "Payment Questions",
-  "contact_reason__ancillaries_products": "Ancillaries/Services & Products",
-  "contact_reason__unconfirmed_booking": "Unconfirmed booking",
-  "contact_reason__site_support": "Site support",
-  "contact_reason__ongoing_issues": "Ongoing issues",
-  "contact_reason__other": "Other",
-  // SCHEDULE CHANGE //
-  "contact_reason__schedule_change": "Rebooking",
-  "contact_reason__cancellation_sc": "Cancellation",
-  "contact_reason__self_transfer_guarantee_vi_sc": "Self Transfer Guarantee (VI) - SC",
-  "contact_reason__self_transfer_guarantee_vi_passengers_at_the_airport": "Self Transfer Guarantee (VI) - Passengers at the airport",
-  "contact_reason__refund_sc": "Refund",
-  "contact_reason__ancillaries_products_sc": "Ancillaries/Services & Products",
-  "contact_reason__document_travel_info_sc": "Document & Travel info",
-  "contact_reason__other_sc": "Other"
-};
-const CONTACT_REASON = CONTACT_REASON_BY_ZENDESK[ZT.getVariableValue("contact_reason", "")] || "";
+// Node 42's two calls, recorded where their responses are read.
+ZT.setFormData("api_trail", ZT.getVariableValue("api_trail", "") + "R~:~edvin__errand_configuration~:~" + (String(errand_configuration._zt_meta.response.code).charAt(0) === "2" ? "OK" : "FAIL") + "~:~" + errand_configuration._zt_meta.response.code + "~||~");
+ZT.setFormData("api_trail", ZT.getVariableValue("api_trail", "") + "R~:~get_edvin_prop_long_value~:~" + (String(edvin_prop_long_val._zt_meta.response.code).charAt(0) === "2" ? "OK" : "FAIL") + "~:~" + edvin_prop_long_val._zt_meta.response.code + "~||~");
+
+// Edvin category name for this contact reason, read from the catalogue the root
+// seeds. The mapping lives there and only there - it is the same catalogue the
+// contact-reason selects and the VI subtree resolve against.
+const contact_reasons = JSON.parse(ZT.getVariableValue("contact_reasons", "[]"));
+const contact_reason_value = ZT.getVariableValue("contact_reason", "");
+const contact_reason_row = contact_reasons.find(r => r.value === contact_reason_value);
+const edvin_category_name = contact_reason_row ? contact_reason_row.edvin : "";
 
 function findCancellation() {
   // NEED TO PROVIDE A FALLBACK for Genesys Interaction Type
   // If no type == null => 80, 81, ....
   const channel = errand_configuration.channels.find(c => c.id === edvin_prop_long_val.value);
-  const category = channel.categories.find(c => c.name === CONTACT_REASON);
+  const category = channel.categories.find(c => c.name === edvin_category_name);
   return { channel, category };
 }
 
```

### node 48 — End Session (content)

```diff
--- before/node 48 content
+++ after/node 48 content
@@ -1 +1 @@
-<p>Session ended successfully. Thank you!</p>
+<p>Session ended successfully. Thank you!</p>${transforms.api_receipt_html}
```

### node 53 — Session Ended - Request Failed (content)

```diff
--- before/node 53 content
+++ after/node 53 content
@@ -1 +1 @@
-<div class="zt-content-block zt-cb-type-alert"><div class="zt-cb-title"><i class="zt-cb-icon" contenteditable="false"></i><h3>Session Ended</h3></div><div class="zt-cb-body"><p>This session was ended because a request could not be completed. No further action was taken. Please start a new session to try again.</p></div></div>
+<div class="zt-content-block zt-cb-type-alert"><div class="zt-cb-title"><i class="zt-cb-icon" contenteditable="false"></i><h3>Session Ended</h3></div><div class="zt-cb-body"><p>This session was ended because a request could not be completed. No further action was taken. Please start a new session to try again.</p>${transforms.api_receipt_html}</div></div>
```

### node 64 — Set Side Conversation Id (script code)

```diff
--- before/node 64 content
+++ after/node 64 content
@@ -1,6 +1,10 @@
 // Captures the side conversation id Zendesk just handed back, so node 65 can pick
 // this ticket out of node 63's list response. Runs for parent and grand child
 // tickets alike - one body, one alias.
+// This ticket's create outcome. Recorded per pass, so a run that creates four
+// tickets leaves four graded rows - actions only ever holds the last one.
+ZT.setFormData("api_trail", ZT.getVariableValue("api_trail", "") + "R~:~create_child_ticket~:~" + (String(actions.create_child_ticket._zt_meta.response.code).charAt(0) === "2" ? "OK" : "FAIL") + "~:~" + actions.create_child_ticket._zt_meta.response.code + "~||~");
+
 const side_conversation_id = actions.create_child_ticket.side_conversation.id;
 ZT.setFormData("side_conversation_id", side_conversation_id);
 
@@ -8,3 +12,6 @@
 // (node 94) and the retry router (node 88) know which request to blame and
 // which Data node to re-fire.
 ZT.setFormData("last_api_alias", "get_side_conversation_detail");
+// Arms the log for the call about to fire. Its outcome is appended as a
+// separate R entry where that outcome is known.
+ZT.setFormData("api_trail", ZT.getVariableValue("api_trail", "") + "A~:~get_side_conversation_detail~:~" + ZT.getVariableValue("side_conversation_id", "") + "~||~");
```

### node 65 — Resolve Ticket Id (script code)

```diff
--- before/node 65 content
+++ after/node 65 content
@@ -5,6 +5,9 @@
 // Runs for parent and grand child tickets alike.
 
 const current_ticket = transforms.current_ticket || {};
+
+// This ticket's details lookup. Recorded per pass, same reason as the create.
+ZT.setFormData("api_trail", ZT.getVariableValue("api_trail", "") + "R~:~get_side_conversation_detail~:~" + (String(actions.get_side_conversation_detail._zt_meta.response.code).charAt(0) === "2" ? "OK" : "FAIL") + "~:~" + actions.get_side_conversation_detail._zt_meta.response.code + "~||~");
 
 const side_conversation_ticket_id = actions.get_side_conversation_detail.side_conversations
   .find(x => x.id == ZT.getVariableValue("side_conversation_id", ""))
@@ -32,3 +35,6 @@
 // (node 94) and the retry router (node 88) know which request to blame and
 // which Data node to re-fire.
 ZT.setFormData("last_api_alias", "zingtree_redesign__update_side_conversation");
+// Arms the log for the call about to fire. Its outcome is appended as a
+// separate R entry where that outcome is known.
+ZT.setFormData("api_trail", ZT.getVariableValue("api_trail", "") + "A~:~zingtree_redesign__update_side_conversation~:~" + ZT.getVariableValue("side_conversation_id", "") + "~||~");
```

### node 86 — API Failure - Log & Render (script code)

```diff
--- before/node 86 content
+++ after/node 86 content
@@ -5,17 +5,13 @@
 const failed_alias = ZT.getVariableValue("last_api_alias", "");
 
 // Readable name for the request, so the card says "Edvin - Register Errand"
-// rather than an alias. Anything not listed falls back to the alias itself.
-const stepLabels = {
-  findorder: "Edvin - Find Order",
-  edvin__errand_configuration: "GET Edvin Errands",
-  edvin__register_errand: "Edvin - Register Errand",
-  create_internal_note__no_group_id: "Zendesk - Add Internal Note",
-  create_child_ticket: "ZD - Create " + ZT.getVariableValue("ticket_kind", "Child Ticket"),
-  get_side_conversation_detail: "Get Ticket Details",
-  zingtree_redesign__update_side_conversation: "Update Ticket"
-};
-const failed_step = stepLabels[failed_alias] || failed_alias;
+// rather than an alias. The catalogue is seeded by the root and shared with the
+// end-of-run receipt; only the create call refines its label, from ticket_kind.
+const api_steps = JSON.parse(ZT.getVariableValue("api_steps", "{}"));
+const failed_step = (failed_alias === "create_child_ticket"
+  ? "ZD - Create " + ZT.getVariableValue("ticket_kind", "Child Ticket")
+  : api_steps[failed_alias]) || failed_alias;
+
 
 // What the run was working on when it failed, so the agent can tell one PNR or
 // ticket apart from another in a long session.
@@ -46,4 +42,99 @@
   escHtml(response ? JSON.stringify(response, null, 2).slice(0, 2000) : "No response body was captured.") +
   '</div></div>';
 
+// The failed call goes into the log as a graded entry. Node 86 is the only place
+// a failure is known for the calls no success-path script reads back.
+ZT.setFormData("api_trail", ZT.getVariableValue("api_trail", "") + "R~:~" + failed_alias + "~:~FAIL~:~" + (meta.code || "") + "~:~" + String(meta.message || meta.error || "").replace(/[~|]/g, "-").slice(0, 200) + "~||~");
+
 ZT.setTransformData("failure_html", failure_html);
+
+// ===== API LOG RENDERER (keep IDENTICAL in nodes 19 and 86) =====
+// The one duplicated block this tree allows, and only because the alternative is
+// worse: the log has to render at the end of a SUCCESSFUL run (node 19 -> 23/48)
+// and at an ABORTED one (node 86 -> the Request Failed screens -> 53), and those
+// are two different paths with two different terminals. Routing both through one
+// renderer needs a script-to-script hop and a router that cannot tell how it was
+// entered.
+// If this block changes, change it in BOTH nodes.
+const trail = ZT.getVariableValue("api_trail", "");
+const log_steps = JSON.parse(ZT.getVariableValue("api_steps", "{}"));
+
+const rows = [];
+trail.split("~||~").filter(entry => entry !== "").forEach(entry => {
+  const f = entry.split("~:~");
+  if (f[0] === "A") {
+    rows.push({ seq: rows.length + 1, alias: f[1], subject: f[2] || "", status: "", code: "", detail: "" });
+  } else {
+    // Attach to the most recent still-open attempt of this alias.
+    for (let i = rows.length - 1; i >= 0; i--) {
+      if (rows[i].alias === f[1] && rows[i].status === "") {
+        rows[i].status = f[2];
+        rows[i].code = f[3] || "";
+        rows[i].detail = f[4] || "";
+        break;
+      }
+    }
+  }
+});
+
+// Fallback for the calls no script reads back - the internal note, the ticket
+// update and the errand registration. Graded from the response still in session,
+// and flagged so the row is not mistaken for one recorded at the time.
+rows.forEach(row => {
+  row.step = log_steps[row.alias] || row.alias;
+  if (row.status) return;
+  const response = actions[row.alias];
+  const meta = (response && response._zt_meta && response._zt_meta.response) ? response._zt_meta.response : {};
+  const code = meta.code || meta.status || "";
+  row.code = code;
+  row.derived = true;
+  row.status = !code ? "UNKNOWN" : (String(code).charAt(0) === "2" ? "OK" : "FAIL");
+  row.detail = row.status === "FAIL" ? String(meta.message || meta.error || "").slice(0, 200) : "";
+});
+
+function escHtml(s) {
+  return String(s === null || s === undefined ? "" : s)
+    .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
+}
+
+function rowHtml(row, accent) {
+  return '<div style="padding:8px 10px;border-left:3px solid ' + accent + ';background:#ffffff;' +
+    'border-radius:4px;margin:6px 0;font-size:13px;line-height:1.45;">' +
+    '<div style="color:#111827;font-weight:600;"><span style="color:#9ca3af;font-weight:400;">' +
+    row.seq + '. </span>' + escHtml(row.step) + '</div>' +
+    '<div style="color:#6b7280;font-family:monospace;font-size:11px;word-break:break-all;">' +
+    escHtml(row.alias) +
+    (row.code ? ' - HTTP ' + escHtml(row.code) : ' - no response captured') +
+    (row.derived ? ' - read back at end of run' : '') + '</div>' +
+    (row.subject ? '<div style="color:#6b7280;font-size:12px;margin-top:2px;">' + escHtml(row.subject) + '</div>' : '') +
+    (row.detail ? '<div style="color:#7f1d1d;margin-top:4px;">' + escHtml(row.detail) + '</div>' : '') +
+    '</div>';
+}
+
+function card(title, tone, border, bg, items, accent, empty_text) {
+  return '<div style="border:1px solid ' + border + ';background:' + bg +
+    ';border-radius:10px;padding:12px 14px;margin:10px 0;">' +
+    '<div style="font-weight:700;font-size:12px;color:' + tone +
+    ';text-transform:uppercase;letter-spacing:0.03em;margin-bottom:6px;">' +
+    escHtml(title) + ' (' + items.length + ')</div>' +
+    (items.length
+      ? items.map(row => rowHtml(row, accent)).join("")
+      : '<div style="font-size:13px;color:#6b7280;font-style:italic;">' + escHtml(empty_text) + '</div>') +
+    '</div>';
+}
+
+const failed = rows.filter(row => row.status === "FAIL");
+const completed = rows.filter(row => row.status !== "FAIL");
+
+// Transforms exception (HTML a content-node merge field renders): every other
+// rendered block in this tree goes through transforms and this one matches them.
+ZT.setTransformData("api_receipt_html", rows.length
+  ? '<div style="font-family:Arial,Helvetica,sans-serif;max-width:560px;">' +
+    '<div style="font-weight:700;font-size:12px;color:#374151;text-transform:uppercase;' +
+    'letter-spacing:0.03em;">API requests this session (' + rows.length + ')</div>' +
+    card("Failures", "#7f1d1d", "#fecaca", "#fef2f2", failed, "#dc2626", "None - every request came back 2xx.") +
+    card("Completed", "#065f46", "#bbf7d0", "#f0fdf4", completed, "#16a34a", "Nothing recorded yet.") +
+    '</div>'
+  : ``);
+// ===== END API LOG RENDERER =====
+
```

### node 87 — Request Failed (content)

```diff
--- before/node 87 content
+++ after/node 87 content
@@ -1 +1 @@
-<p>${transforms.failure_html}</p>
+<p>${transforms.failure_html}</p>${transforms.api_receipt_html}
```

### node 90 — Classify - Unconfirmed Booking Check (script code)

```diff
--- before/node 90 content
+++ after/node 90 content
@@ -18,6 +18,10 @@
 // relying on this branch alone in production.
 const CONTACT_REASON_UNCONFIRMED_BOOKING = "contact_reason__unconfirmed_booking";
 
+// Node 4's outcome, recorded now rather than read back later: nothing else in
+// the run overwrites actions.findorder, but the log is the record either way.
+ZT.setFormData("api_trail", ZT.getVariableValue("api_trail", "") + "R~:~findorder~:~" + (String(actions.findorder._zt_meta.response.code).charAt(0) === "2" ? "OK" : "FAIL") + "~:~" + actions.findorder._zt_meta.response.code + "~||~");
+
 const contactReason = ZT.getVariableValue("contact_reason", "");
 const bookingDetails = (actions.findorder && actions.findorder.orderProviderBookingDetails) || [];
 const linkedRefs = (actions.findorder && actions.findorder.orderLinkedProviderReferences) || [];
```

### node 93 — No-PNR Bridge (Unconfirmed Booking / Orphan) (script code)

```diff
--- before/node 93 content
+++ after/node 93 content
@@ -71,4 +71,7 @@
 
 // Node 42 (GET Edvin Errands) fires next on this path.
 ZT.setFormData("last_api_alias", "edvin__errand_configuration");
+// Arms the log for the call about to fire. Its outcome is appended as a
+// separate R entry where that outcome is known.
+ZT.setFormData("api_trail", ZT.getVariableValue("api_trail", "") + "A~:~edvin__errand_configuration~:~" + resolved_order_reference + "~||~A~:~get_edvin_prop_long_value~:~" + resolved_order_reference + "~||~");
 ZT.setFormData("dynamic_provider_booking_id", "")
```

### node 95 — Validate Order Reference & Sync Zendesk Fields (script code)

```diff
--- before/node 95 content
+++ after/node 95 content
@@ -31,3 +31,6 @@
 
 // Node 4 (Edvin - Find Order) fires next once node 96 passes this gate.
 ZT.setFormData("last_api_alias", "findorder");
+// Arms the log for the call about to fire. Its outcome is appended as a
+// separate R entry where that outcome is known.
+ZT.setFormData("api_trail", ZT.getVariableValue("api_trail", "") + "A~:~findorder~:~" + order_reference + "~||~");
```

### node 101 — No PNRs Available for This Order (content)

```diff
--- before/node 101 content
+++ after/node 101 content
@@ -1 +1 @@
-<div class="zt-content-block zt-cb-type-warning"><div class="zt-cb-title"><i class="zt-cb-icon" contenteditable="false"></i><h3>No PNRs available for this order</h3></div><div class="zt-cb-body"><p>Edvin found this order, but it has <strong>no PNRs available to select</strong> - the airline never issued one. This is normal for an unconfirmed booking, where the customer did not complete payment.</p><p><strong>Order Reference</strong>: ${order_reference}<br><strong>Contact Reason</strong>: ${contact_reason}<br><strong>Channel</strong>: ${zendeskChannelIdentifier}</p><p>Continue to register the errand against the order without a PNR. You will still pick the type, action and notes on the next screens, and the child ticket and internal note are created exactly as they are for an order with PNRs.</p></div></div>
+<div class="zt-content-block zt-cb-type-warning"><div class="zt-cb-title"><i class="zt-cb-icon" contenteditable="false"></i><h3>No PNRs available for this order<span style="display:inline-block;margin-left:8px;padding:3px 9px;border-radius:999px;background:#fef3c7;border:1px solid #fcd34d;color:#92400e;font-size:10px;font-weight:700;letter-spacing:0.08em;text-transform:uppercase;vertical-align:middle;white-space:nowrap;">Warning</span></h3></div><div class="zt-cb-body"><p style="margin:0 0 14px;line-height:1.6;">Edvin found this order, but it has <strong>no PNRs available to select</strong> - the airline never issued one. This is normal for an unconfirmed booking, where the customer did not complete payment.</p><div style="border:1px solid #fcd34d;background:#fffbeb;border-radius:8px;padding:10px 12px;margin:0 0 14px;"><div style="margin:6px 0;font-size:13px;"><span style="color:#6b7280;font-weight:600;">Order Reference:</span> <span style="color:#111827;">${order_reference}</span></div><div style="margin:6px 0;font-size:13px;"><span style="color:#6b7280;font-weight:600;">Contact Reason:</span> <span style="color:#111827;">${contact_reason}</span></div><div style="margin:6px 0;font-size:13px;"><span style="color:#6b7280;font-weight:600;">Channel:</span> <span style="color:#111827;">${zendeskChannelIdentifier}</span></div></div><div style="font-weight:700;font-size:11px;color:#374151;text-transform:uppercase;letter-spacing:0.04em;margin:0 0 6px;">What happens next</div><ul style="margin:0;padding-left:20px;line-height:1.7;font-size:13px;color:#111827;"><li>Continue to register the errand against the order without a PNR.</li><li>You still pick the type, action and notes on the next screens.</li><li>The child ticket and internal note are created exactly as they are for an order with PNRs.</li></ul></div></div>
```

## CHANGES THAT NEED AN EXPLANATION

Every line below must map to a requirement or an explicit request.
Anything unexplained is unintended drift — revert it before delivering.

  [ ] added node 19 (Render API Receipt)
  [ ] node 2 — script code changed (96 → 74 lines) — Dynamic Actions List Options
  [ ] node 5 — content changed (1876 → 2055 lines) — claude.md
  [ ] node 9 — script code changed (43 → 46 lines) — Format Passengers
  [ ] node 10 — script code changed (109 → 144 lines) — Clear Session & Seed Zendesk Intake
  [ ] node 14 — content changed (447 → 477 characters) — Edvin - Find Order - Request Failed
  [ ] node 16 — content changed (480 → 510 characters) — Zendesk - Add Internal Note - Request Failed
  [ ] node 18 — content changed (465 → 495 characters) — ZD - Create Child Ticket - Request Failed
  [ ] node 21 — script code changed (83 → 86 lines) — Format Internal Note
  [ ] node 23 — content changed (268 → 298 characters) — Closing Call
  [ ] node 28 — content changed (575 → 605 characters) — GET Edvin Errands - Request Failed
  [ ] node 29 — script code changed (61 → 65 lines) — Clear Data
  [ ] node 31 — content changed (465 → 495 characters) — Edvin - Register Errand - Request Failed
  [ ] node 32 — script code changed (206 → 209 lines) — Loop Tickets (child + grand child)
  [ ] node 40 — content changed (474 → 504 characters) — Get Child Ticket Details - Request Failed
  [ ] node 44 — script code changed (286 → 289 lines) — Loop Errands to Register
  [ ] node 45 — content changed (484 → 514 characters) — Update Child Ticket - Request Failed
  [ ] node 46 — script code changed (128 → 112 lines) — Format Types
  [ ] node 48 — content changed (45 → 75 characters) — End Session
  [ ] node 53 — content changed (327 → 357 characters) — Session Ended - Request Failed
  [ ] node 64 — script code changed (10 → 17 lines) — Set Side Conversation Id
  [ ] node 65 — script code changed (34 → 40 lines) — Resolve Ticket Id
  [ ] node 83 — continuation_node_id: 23 → 19 — Is More PNR's?
  [ ] node 83 — button added/changed: "" → node 19
  [ ] node 83 — button removed/replaced: "" → node 23
  [ ] node 86 — script code changed (49 → 140 lines) — API Failure - Log & Render
  [ ] node 87 — content changed (33 → 63 characters) — Request Failed
  [ ] node 90 — script code changed (29 → 33 lines) — Classify - Unconfirmed Booking Check
  [ ] node 93 — script code changed (74 → 77 lines) — No-PNR Bridge (Unconfirmed Booking / Orphan)
  [ ] node 95 — script code changed (33 → 36 lines) — Validate Order Reference & Sync Zendesk Fields
  [ ] node 100 — button added/changed: "I have registered this in Edvin::zt_manual_errand_registered" → node 19
  [ ] node 100 — button removed/replaced: "I have registered this in Edvin::zt_manual_errand_registered" → node 23
  [ ] node 101 — content changed (817 → 1838 characters) — No PNRs Available for This Order

