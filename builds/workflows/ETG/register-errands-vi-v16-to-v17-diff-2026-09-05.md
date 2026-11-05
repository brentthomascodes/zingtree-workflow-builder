========================================================================
WORKFLOW DIFF — Register Errands - VI Dynamic (v16 variable dedup, 2026-09-05)
========================================================================

Before : vi_before.json  (43 nodes)
After  : vi_after.json  (43 nodes)

## PLAIN SUMMARY

41 of 43 nodes are byte-for-byte identical to the original (95% untouched).
0 nodes added, 0 removed, 0 renumbered, 2 modified.

In plain terms:
  * CHANGED  node 5 — claude.md [Content]
               - content changed (594 → 646 lines) — claude.md
  * CHANGED  node 81 — Format Types [Script]
               - script code changed (152 → 127 lines) — Format Types

## TREE SHAPE

  node type                before    after    delta
  Content                      19       19       +0
  Data                          1        1       +0
  Scoring                      14       14       +0
  Script                        8        8       +0
  Tree                          1        1       +0
  TOTAL                        43       43       +0

  Root node unchanged (node 83).

## STRUCTURAL SANITY

  No broken links introduced.
  No nodes became unreachable.
  Pre-existing in the BEFORE tree (not caused by this edit): 0 broken link(s), 1 unreachable node(s).

## UNTOUCHED NODES (41)

  1, 2, 3, 4, 6, 7, 8, 12, 25, 27, 49, 50, 52, 53, 58, 59, 60, 61, 62, 63, 64, 65, 66, 67, 69, 70, 71, 72, 73, 74, 75, 76, 79, 80, 82, 83, 84, 85, 86, 87, 88

## TREE-LEVEL SETTINGS CHANGED (0)

  (none)

## COSMETIC / EDITOR-ONLY CHANGES (0) — ignore

  (none)

## LINE-LEVEL BODY DIFFS (2)

### node 5 — claude.md (content)

```diff
--- before/node 5 content
+++ after/node 5 content
@@ -322,6 +322,17 @@
 
 ## Changelog
 
+- 2026-09-05 (v17: contact-reason catalogue read from the parent) - Claude
+  (Cowork)/Brent - Node 81's 21-entry contact-reason map is deleted; it parses the
+  stringified `contact_reasons` catalogue the parent tree's root seeds into form
+  data and finds its row by value. Fixes five Edvin category names this copy had
+  spelled differently from Edvin's own configuration (Name correction/change, Add
+  passenger/New ticket sell, Document & Travel info x2, Payment Questions) - each
+  was throwing "No Edvin category match" for that contact reason. The ZT.log in
+  that branch is gone, its detail folded into the thrown message. See the v17
+  section above. Built on v16; v16 itself is still pending Brent's approval.
+  nodes: 5 (this entry), 81
+
 - 2026-08-25 (correction: create_child_ticket alias, no override needed) - Claude
   (Cowork)/Brent - The previous entry above assumed sandbox's grandchild-ticket
   Connected Object (#180) reports under a DIFFERENT alias than the child-ticket
@@ -592,3 +603,44 @@
 verified consumer exists on each side - never as a defensive "mirror it in case something
 needs it" habit. Before adding a second write of an existing value under a new name, grep for
 every read of the value first.
+
+## v17 (2026-09-05) - contact-reason catalogue read from the parent, not restated
+
+Brent, this session: "in node 46 [of the parent tree], I shouldn't have to
+maintain the list in multiple places (in VI flow and node 2 above). Instead I
+want to save this array of contact reasons as a stringified form data variable
+and then parse on reference in the other locations." This subtree held the third
+copy. Requirements: CR-018 in the parent's requirements doc.
+
+WHAT CHANGED. Node 81's 21-entry CONTACT_REASON_BY_ZENDESK literal is deleted.
+It now parses `contact_reasons` - a JSON string the parent tree's root seeds into
+form data, one row per contact reason carrying `value`, `label`, `edvin` and
+`path` - and finds the row by `value`. Form data has no TTL and crosses the
+Tree-node boundary, which is why the copy could be retired rather than merely
+corrected. If the catalogue is missing the node throws naming that, instead of
+falling through to a silent no-match.
+
+THE BUG THIS FIXES. Checked against Edvin's own errand configuration, this node's
+copy was WRONG on five rows and the parent's node 46 was right:
+
+    Zendesk value                            this node said        Edvin actually has
+    contact_reason__name_correction_change   Name Correction/Change  Name correction/change
+    contact_reason__add_passenger            Add Passenger/New ...   Add passenger/New ...
+    contact_reason__document_travel_info     Document & Travel Info  Document & Travel info
+    contact_reason__document_travel_info_sc  Document & Travel Info  Document & Travel info
+    contact_reason__payment_question         Payment Question        Payment Questions
+
+`categories.find(c => c.name === CONTACT_REASON)` is a case-sensitive match, so
+each of those five contact reasons was reaching the `if (!category)` branch and
+throwing "No Edvin category match" - a hard stop for the agent. Reading the
+catalogue fixes all five at once. Cancellation, Rebooking, Refund and the rest
+were spelled correctly and are unaffected.
+
+ALSO REMOVED. The `ZT.log` call in the no-category branch, per the house
+no-logging rule. Its detail - the categories the channel actually offered - is
+now part of the thrown message, where it is more likely to be seen.
+
+STILL OPEN, UNCHANGED. Whether every contact_reason value the parent's node 75
+routes into this subtree has a catalogue row, and which leaf category the bare
+Self Transfer Guarantee (VI) values map to. That is an ETG decision, not a code
+one; the throw now names the value and the options when it happens.
```

### node 81 — Format Types (script code)

```diff
--- before/node 81 content
+++ after/node 81 content
@@ -16,42 +16,21 @@
 let errand_configuration = actions.edvin__errand_configuration;
 let edvin_prop_long_val = actions.get_edvin_prop_long_value;
 
-// Maps the Zendesk contact-reason field to the Edvin category name, until Edvin
-// returns a value that matches the Zendesk field directly.
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
-// v15 fix: was hardcoded to the DEV org's Contact Reason field id, which reads
-  // empty/wrong in production. This subtree only ever runs after the parent
-  // "Register Errands - Dynamic" tree has already resolved contact_reason to a
-  // standard name (its ENV FIELD RESOLUTION block, nodes 10/29/93/95) and handed
-  // off into this subtree in the same session, so read the standard name directly -
-  // never a raw custom_field_<id> in a consuming node. See parent claude.md
-  // Conventions for why duplicating that resolution block here instead would be
-  // its own drift hazard.
-  const ZENDESK_VALUE = ZT.getVariableValue("contact_reason", "");
-const CONTACT_REASON = CONTACT_REASON_BY_ZENDESK[ZENDESK_VALUE] || "";
+// Edvin category name for this contact reason. The catalogue is a stringified
+// array the PARENT tree's root seeds into form data (contact_reasons), carrying
+// one row per Zendesk contact-reason value with its Edvin category name. This
+// subtree only ever runs after that root has run and handed off in the same
+// session, and form data crosses the Tree-node boundary, so it is read here
+// rather than restated - a second copy is exactly how this node ended up with
+// five category names Edvin does not use.
+const contact_reasons = JSON.parse(ZT.getVariableValue("contact_reasons", "[]"));
+const ZENDESK_VALUE = ZT.getVariableValue("contact_reason", "");
+const contact_reason_row = contact_reasons.find(r => r.value === ZENDESK_VALUE);
+const CONTACT_REASON = contact_reason_row ? contact_reason_row.edvin : "";
+
+if (!contact_reasons.length) {
+  throw new Error("contact_reasons is empty - this subtree was entered without the parent tree's root seeding the contact-reason catalogue");
+}
 
 function findCancellation() {
   const channel = errand_configuration.channels.find(c => c.id === edvin_prop_long_val.value);
@@ -60,17 +39,13 @@
   }
   const category = channel.categories.find(c => c.name === CONTACT_REASON);
   if (!category) {
-    // Log the options BEFORE throwing - the thrown message alone does not tell you whether
-    // the Zendesk value is unmapped above or the Edvin category was renamed.
-    // KNOWN GAP: the parent tree's node 75 also routes the bare
-    // contact_reason_sc__self_transfer_guarantee_vi into this subtree, and that value has
-    // no entry in CONTACT_REASON_BY_ZENDESK, so it lands here. Decide with ETG which leaf
-    // category it means before this reaches more agents.
-    ZT.log("node 81 | no category match | zendesk=" + JSON.stringify(ZENDESK_VALUE) +
-           " | resolved=" + JSON.stringify(CONTACT_REASON) +
-           " | channel=" + JSON.stringify(channel.name) +
-           " | categories offered=" + JSON.stringify(channel.categories.map(c => c.name)));
-    throw new Error(`No Edvin category match for Zendesk value "${ZENDESK_VALUE}" (resolved name: "${CONTACT_REASON}") in channel "${channel.name}"`);
+    // The message carries the options, so it says whether the Zendesk value is
+    // missing from the catalogue or the Edvin category was renamed - which the
+    // bare "no match" wording never did.
+    // KNOWN GAP: the parent's node 75 also routes contact_reason values into this
+    // subtree that the catalogue may not carry a row for; that lands here. Decide
+    // with ETG which leaf category each means.
+    throw new Error(`No Edvin category match for Zendesk value "${ZENDESK_VALUE}" (resolved name: "${CONTACT_REASON}") in channel "${channel.name}" - categories offered: ${JSON.stringify(channel.categories.map(c => c.name))}`);
   }
   return { channel, category };
 }
```

## CHANGES THAT NEED AN EXPLANATION

Every line below must map to a requirement or an explicit request.
Anything unexplained is unintended drift — revert it before delivering.

  [ ] node 5 — content changed (594 → 646 lines) — claude.md
  [ ] node 81 — script code changed (152 → 127 lines) — Format Types

