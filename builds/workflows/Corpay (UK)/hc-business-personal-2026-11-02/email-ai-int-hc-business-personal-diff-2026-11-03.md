========================================================================
WORKFLOW DIFF — Email Automation - AI Actions INT - Homecharge
========================================================================

Before : 2 BRANCH - Homecharge INT 698599608 (BEFORE baseline 2026-11-03).json  (33 nodes)
After  : 2 BRANCH - Homecharge INT 698599608 (business personal charges 2026-11-03).json  (33 nodes)

## PLAIN SUMMARY

30 of 33 nodes are byte-for-byte identical to the original (91% untouched).
0 nodes added, 0 removed, 0 renumbered, 3 modified.

In plain terms:
  * CHANGED  node 19 — Grade intent and build validation screen [Script]
               - script code changed (205 → 214 lines) — Grade intent and build validation screen
  * CHANGED  node 24 — Set case origin and template key [Script]
               - script code changed (47 → 48 lines) — Set case origin and template key
  * CHANGED  node 48 — claude.md [Content]
               - content changed (7 → 7 lines) — claude.md

## TREE SHAPE

  node type                before    after    delta
  AI_Action                     2        2       +0
  Content                      12       12       +0
  Data                          1        1       +0
  Scoring                       7        7       +0
  Script                       10       10       +0
  Tree                          1        1       +0
  TOTAL                        33       33       +0

  Root node unchanged (node 3).

## STRUCTURAL SANITY

  No broken links introduced.
  No nodes became unreachable.
  Pre-existing in the BEFORE tree (not caused by this edit): 0 broken link(s), 1 unreachable node(s).

## UNTOUCHED NODES (30)

  3, 4, 5, 6, 7, 9, 18, 20, 21, 22, 23, 25, 26, 30, 31, 32, 33, 50, 51, 52, 53, 56, 62, 63, 64, 70, 71, 72, 73, 79

## TREE-LEVEL SETTINGS CHANGED (0)

  (none)

## COSMETIC / EDITOR-ONLY CHANGES (0) — ignore

  (none)

## LINE-LEVEL BODY DIFFS (3)

### node 19 — Grade intent and build validation screen (script code)

```diff
--- before/node 19 content
+++ after/node 19 content
@@ -16,7 +16,8 @@
   hc_password_reset:  { topic: "HC-Not Online", subtopic: "Password Reset" },
   hc_update_charger_details: { topic: "HC-Online", subtopic: "Update Charger Information" },
   hc_payment_query:   { topic: "HC-Not Online", subtopic: "Payment Query / Review" },
-  hc_resent_onboarding_email: { topic: "HC-Online",     subtopic: "Resent Onboarding Email" }
+  hc_resent_onboarding_email: { topic: "HC-Online",     subtopic: "Resent Onboarding Email" },
+  hc_business_personal_charges: { topic: "HC-Online", subtopic: "Business/Personal Charges" }
 };
 
 // An intent with a variant group asks the agent which approved reply fits; an intent
@@ -38,6 +39,14 @@
     options: [
       { value: "dd_increase_pushback", label: "Driver's electricity direct debit has increased" },
       { value: "underpayment_response", label: "Driver claiming underpayment" }
+    ]
+  },
+  {
+    intent: "hc_business_personal_charges",
+    fallback: "driver_multi_ev_pushback",
+    options: [
+      { value: "driver_multi_ev_pushback", label: "Driver Multi EV Mode (Pushback)" },
+      { value: "fleet_manager_multi_ev_response", label: "Fleet Manager enabling Multi EV Mode response" }
     ]
   }
 ];
```

### node 24 — Set case origin and template key (script code)

```diff
--- before/node 24 content
+++ after/node 24 content
@@ -16,7 +16,8 @@
   hc_template_key = hc_template_key + ":" + response_variant;
 }
 hc_template_key = hc_template_key + ":" + requester_type;
-let hc_copy_approved = requester_type === "driver";
+// Business/Personal Charges has approved copy for both audiences; the reply choice on screen 21 picks it.
+let hc_copy_approved = requester_type === "driver" || base === "hc_business_personal_charges";
 
 // Some approved templates carry a gap only the agent can fill. Each row names the native
 // field on screen 23 that asks for it, the driver that shows that field, and the token node
```

### node 48 — claude.md (content)

```diff
--- before/node 48 content
+++ after/node 48 content
@@ -4,4 +4,4 @@
 52 -> 62 unrecognised | 53 missing charges (screenshots -> 72) | 30 dashboard; 63 regenerate -> 25; 64 keep draft
 31 send path: manual -> 33, multi -> 32, else -> 50; 32/33 -> 50 -> 51 provider picklists -> 71
 Hand-back: 70-73 set branch_outcome -> 79 Tree -> master 100 Main end.
-2026-10-19: tree script: external http(s) links open in a new tab instead of inside the widget (Gemma Danks, 19 Oct).</pre><p>2026-10-29: multi-intent half rollback (Gemma Danks, 29 Oct): node 26 no longer routes to text-box screen 62; the 'Part of this request was not recognised' banner sits on top of the dashboard, agent uses 'No - make manual changes'.</p>
+2026-10-19: tree script: external http(s) links open in a new tab instead of inside the widget (Gemma Danks, 19 Oct).</pre><p>2026-10-29: multi-intent half rollback (Gemma Danks, 29 Oct): node 26 no longer routes to text-box screen 62; the 'Part of this request was not recognised' banner sits on top of the dashboard, agent uses 'No - make manual changes'.</p><p>2026-11-02: new intent hc_business_personal_charges (Gemma Danks, 2 Nov use case): node 19 map row HC-Online / Business/Personal Charges + variant group (Driver Multi EV Mode (Pushback) / Fleet Manager enabling Multi EV Mode response); node 24 marks both replies as approved copy. AI Actions 19 / 18.</p>
```

## CHANGES THAT NEED AN EXPLANATION

Every line below must map to a requirement or an explicit request.
Anything unexplained is unintended drift — revert it before delivering.

  [ ] node 19 — script code changed (205 → 214 lines) — Grade intent and build validation screen
  [ ] node 24 — script code changed (47 → 48 lines) — Set case origin and template key
  [ ] node 48 — content changed (7 → 7 lines) — claude.md

