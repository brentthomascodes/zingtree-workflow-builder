========================================================================
WORKFLOW DIFF — 3 BRANCH - Networks scaffold
========================================================================

Before : 3 BRANCH - Networks INT 547469427 (optional fields 2026-10-29).json  (30 nodes)
After  : 3 BRANCH - Networks INT 547469427 (prompt text + general line 2026-10-30).json  (30 nodes)

## PLAIN SUMMARY

26 of 30 nodes are byte-for-byte identical to the original (87% untouched).
0 nodes added, 0 removed, 0 renumbered, 4 modified.

In plain terms:
  * CHANGED  node 48 — claude.md [Content]
               - content changed (18 → 18 lines) — claude.md
  * CHANGED  node 97 — General pushback - details [Content]
               - form field settings changed (same field names)
  * CHANGED  node 98 — Service department pushback - details [Content]
               - form field settings changed (same field names)
  * CHANGED  node 110 — Build remittance reply and dashboard [Script]
               - script code changed (94 → 94 lines) — Build remittance reply and dashboard

## TREE SHAPE

  node type                before    after    delta
  AI_Action                     1        1       +0
  Content                       9        9       +0
  Data                          1        1       +0
  Scoring                       4        4       +0
  Script                       14       14       +0
  Tree                          1        1       +0
  TOTAL                        30       30       +0

  Root node unchanged (node 3).

## STRUCTURAL SANITY

  No broken links introduced.
  No nodes became unreachable.
  Pre-existing in the BEFORE tree (not caused by this edit): 0 broken link(s), 1 unreachable node(s).

## UNTOUCHED NODES (26)

  3, 4, 5, 6, 7, 9, 56, 70, 71, 72, 73, 79, 91, 92, 93, 94, 95, 96, 112, 113, 114, 115, 116, 117, 118, 119

## TREE-LEVEL SETTINGS CHANGED (0)

  (none)

## COSMETIC / EDITOR-ONLY CHANGES (0) — ignore

  (none)

## LINE-LEVEL BODY DIFFS (2)

### node 48 — claude.md (content)

```diff
--- before/node 48 content
+++ after/node 48 content
@@ -15,4 +15,4 @@
 - 2026-10-12 scaffold (master split).
 - 2026-10-16 remittance MVP: nodes 91-98, 110, 112-117; 90 removed; Merchant Request on 4 / 9; 7 -> 91.
   Source: Gemma Danks "Daily AI standup - Fri 16th Oct" + "Networks AI tree setup" + "Phase 1 - Remittance auto email pushback".
-2026-10-19: tree script: external http(s) links open in a new tab instead of inside the widget (Gemma Danks, 19 Oct).</pre><p>2026-10-27: invoice amount always shown with a pound sign in the service department reply (110); response-choice screen 96 now shows the case dashboard (Case Details + Original Customer Email) built by new script 118 (Gemma Danks, Networks UAT feedback 26 Oct).</p><p>2026-10-29: response-choice screen 96 gets a third button, 'I need to add an attachment', -> new script 119 -> hand back not_automated (master screen 29, work the case as normal) (Gemma Danks, 28 Oct).</p><p>2026-10-29: date (97) and invoice amount (98) questions optional; SMR / Fuel stays required. 117 accepts a blank date; 110 drops the 'on [date]' / 'relating to [amount]' clause when blank (Gemma Danks, 29 Oct).</p>
+2026-10-19: tree script: external http(s) links open in a new tab instead of inside the widget (Gemma Danks, 19 Oct).</pre><p>2026-10-27: invoice amount always shown with a pound sign in the service department reply (110); response-choice screen 96 now shows the case dashboard (Case Details + Original Customer Email) built by new script 118 (Gemma Danks, Networks UAT feedback 26 Oct).</p><p>2026-10-29: response-choice screen 96 gets a third button, 'I need to add an attachment', -> new script 119 -> hand back not_automated (master screen 29, work the case as normal) (Gemma Danks, 28 Oct).</p><p>2026-10-29: date (97) and invoice amount (98) questions optional; SMR / Fuel stays required. 117 accepts a blank date; 110 drops the 'on [date]' / 'relating to [amount]' clause when blank (Gemma Danks, 29 Oct).</p><p>2026-10-30: help text 'If not applicable, please leave blank' on optional date (97) and invoice amount (98); General pushback line 'If you have not received this, please confirm the invoice amount and your Merchant Number.' (110) (Gemma Danks, 29 / 30 Oct).</p>
```

### node 110 — Build remittance reply and dashboard (script code)

```diff
--- before/node 110 content
+++ after/node 110 content
@@ -14,14 +14,14 @@
   .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
   .replace(/"/g, "&quot;").replace(/'/g, "&#39;");
 
-// --- approved copy: "Phase 1 - Remittance auto email pushback" (Gemma Danks, 16 Oct) ---
+// --- approved copy: "Phase 1 - Remittance auto email pushback" (Gemma Danks, 16 Oct; general line 4 updated 30 Oct) ---
 // The template's [sender name] stays out: the case read carries no sender name (CO 10 schema).
 const replyByType = {
   general: [
     "<p>Hello,</p>",
     "<p>Thank you for your email.</p>",
     "<p>We sent you your remittance via email" + (String(remittance_sent_date).trim() === "" ? "" : " on <strong>" + escapeHtml(remittance_sent_date) + "</strong>") + ". Please make sure that you have also checked your spam/junk folders.</p>",
-    "<p>If you can confirm that you have not received this, please send us the amount received and your Merchant Number.</p>",
+    "<p>If you have not received this, please confirm the invoice amount and your Merchant Number.</p>",
     "<p>Kind regards,<br>Allstar Networks Support</p>"
   ],
   service_department: [
```

## CHANGES THAT NEED AN EXPLANATION

Every line below must map to a requirement or an explicit request.
Anything unexplained is unintended drift — revert it before delivering.

  [ ] node 48 — content changed (18 → 18 lines) — claude.md
  [ ] node 97 — form field settings changed (same field names)
  [ ] node 98 — form field settings changed (same field names)
  [ ] node 110 — script code changed (94 → 94 lines) — Build remittance reply and dashboard

