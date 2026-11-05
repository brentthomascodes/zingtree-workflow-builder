# Order Verification Workflow — v2 → v2.1 hotfix diff report (2026-09-09)

```
========================================================================
WORKFLOW DIFF — Order Verification Workflow
========================================================================

Before : Order Verification Workflow (v2 rebuild - loop fixes + ETL redesign, 2026-09-09).json  (67 nodes)
After  : gic_order_verification_v2.json  (67 nodes)

## PLAIN SUMMARY

62 of 67 nodes are byte-for-byte identical to the original (93% untouched).
0 nodes added, 0 removed, 0 renumbered, 5 modified.

In plain terms:
  * CHANGED  node 7 — Collect the reason for contact [Content]
               - form field added: orderKey (text)
               - form field added: case_id (text)
               - form field added: GINumber (text)
               - form field added: deliveryPO (text)
               - form field added: trackingNumber (text)
               - form field removed: order_key_input (text)
               - form field removed: case_number_input (text)
               - form field removed: gi_load_number (text)
               - form field removed: delivery_po (text)
               - form field removed: tracking_number (text)
  * CHANGED  node 8 — Resolve order key and division [Script]
               - node_name: "Prefers a typed order number over the case's own order; normalizes division once. Replaces four separate scripts (original nodes 40/58/70/71) that each recomputed the same US/CA fallback." → "Prefers a typed order number over the case's own order; normalizes division once. Replaces four separate scripts (original nodes 40/58/70/71) that each recomputed the same US/CA fallback. BUG FOUND AND FIXED (2026-09-09, caught by Brent testing the delivered v2 build): the findorder Connected Object's request body dot-paths into `transforms.orderKey` / `transforms.division` / `transforms.startDate` / `transforms.endDate` (confirmed against the actual body template Brent pasted in), which this tree never wrote at all -- every search went out with those fields empty. Also, several native fields on the intake and search screens were renamed to snake_case per house style, but that broke this DCO's own bare `${accountKey}` / `${shipToZip}` / etc. merges, which need the exact field names the account's Connected Object config already expects. Both are fixed here: fields renamed back to the DCO's exact names, and this script (the one place that always runs before either search entry point) now stages the transforms fields too, with a broad 180-day default date window for the known-key path since it never visits the search screen where the agent could pick a narrower one."
               - script code changed (20 → 29 lines) — Resolve order key and division
  * CHANGED  node 11 — Search for the order [Content]
               - form field added: orderKey (text)
               - form field added: accountKey (text)
               - form field added: shipToZip (text)
               - form field added: billToZip (text)
               - form field added: deliveryPO (text)
               - form field added: buyerPO (text)
               - form field added: GINumber (text)
               - form field added: trackingNumber (text)
               - form field added: invoiceKey (text)
               - form field added: rmaKey (text)
               - form field added: dateRange (select)
               - form field removed: order_key_input (text)
               - form field removed: account_key_input (text)
               - form field removed: ship_to_zip (text)
               - form field removed: bill_to_zip (text)
               - form field removed: delivery_po (text)
               - form field removed: buyer_po (text)
               - form field removed: gi_load_number (text)
               - form field removed: tracking_number (text)
               - form field removed: invoice_key (text)
               - form field removed: rma_key (text)
               - form field removed: date_range (select)
  * CHANGED  node 12 — Stage the criteria search [Script]
               - node_name: "Builds the search date window once; replaces the original's duplicated date-window and division logic (nodes 58/70/71 folded together here)." → "Builds the search date window once; replaces the original's duplicated date-window and division logic (nodes 58/70/71 folded together here). Re-derives order key and division from the search screen's own fields (the agent may have refined them here, separately from the intake screen) and re-stages the findorder Connected Object's transforms fields with the agent's actual date-range/division choice, overwriting route_intake's broad 180-day default -- see route_intake's bug-fix note."
               - script code changed (14 → 20 lines) — Stage the criteria search
  * CHANGED  node 67 — claude.md [Content]
               - content changed (185 → 214 lines) — claude.md

## TREE SHAPE

  node type                before    after    delta
  Content                      22       22       +0
  Data                         14       14       +0
  Scoring                       9        9       +0
  Script                       21       21       +0
  Tree                          1        1       +0
  TOTAL                        67       67       +0

  Root node unchanged (node 1).

## STRUCTURAL SANITY

  No broken links introduced.
  No nodes became unreachable.
  Pre-existing in the BEFORE tree (not caused by this edit): 0 broken link(s), 1 unreachable node(s).

## UNTOUCHED NODES (62)

  1, 2, 3, 4, 5, 6, 9, 10, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, 62, 63, 64, 65, 66

## TREE-LEVEL SETTINGS CHANGED (0)

  (none)

## COSMETIC / EDITOR-ONLY CHANGES (0) — ignore

  (none)

## CHANGES THAT NEED AN EXPLANATION

Every line below must map to a requirement or an explicit request.
Anything unexplained is unintended drift — revert it before delivering.

  [ ] node 7 — form field added: orderKey (text)
  [ ] node 7 — form field added: case_id (text)
  [ ] node 7 — form field added: GINumber (text)
  [ ] node 7 — form field added: deliveryPO (text)
  [ ] node 7 — form field added: trackingNumber (text)
  [ ] node 7 — form field removed: order_key_input (text)
  [ ] node 7 — form field removed: case_number_input (text)
  [ ] node 7 — form field removed: gi_load_number (text)
  [ ] node 7 — form field removed: delivery_po (text)
  [ ] node 7 — form field removed: tracking_number (text)
  [ ] node 8 — node_name: "Prefers a typed order number over the case's own order; normalizes division once. Replaces four separate scripts (original nodes 40/58/70/71) that each recomputed the same US/CA fallback." → "Prefers a typed order number over the case's own order; normalizes division once. Replaces four separate scripts (original nodes 40/58/70/71) that each recomputed the same US/CA fallback. BUG FOUND AND FIXED (2026-09-09, caught by Brent testing the delivered v2 build): the findorder Connected Object's request body dot-paths into `transforms.orderKey` / `transforms.division` / `transforms.startDate` / `transforms.endDate` (confirmed against the actual body template Brent pasted in), which this tree never wrote at all -- every search went out with those fields empty. Also, several native fields on the intake and search screens were renamed to snake_case per house style, but that broke this DCO's own bare `${accountKey}` / `${shipToZip}` / etc. merges, which need the exact field names the account's Connected Object config already expects. Both are fixed here: fields renamed back to the DCO's exact names, and this script (the one place that always runs before either search entry point) now stages the transforms fields too, with a broad 180-day default date window for the known-key path since it never visits the search screen where the agent could pick a narrower one."
  [ ] node 8 — script code changed (20 → 29 lines) — Resolve order key and division
  [ ] node 11 — form field added: orderKey (text)
  [ ] node 11 — form field added: accountKey (text)
  [ ] node 11 — form field added: shipToZip (text)
  [ ] node 11 — form field added: billToZip (text)
  [ ] node 11 — form field added: deliveryPO (text)
  [ ] node 11 — form field added: buyerPO (text)
  [ ] node 11 — form field added: GINumber (text)
  [ ] node 11 — form field added: trackingNumber (text)
  [ ] node 11 — form field added: invoiceKey (text)
  [ ] node 11 — form field added: rmaKey (text)
  [ ] node 11 — form field added: dateRange (select)
  [ ] node 11 — form field removed: order_key_input (text)
  [ ] node 11 — form field removed: account_key_input (text)
  [ ] node 11 — form field removed: ship_to_zip (text)
  [ ] node 11 — form field removed: bill_to_zip (text)
  [ ] node 11 — form field removed: delivery_po (text)
  [ ] node 11 — form field removed: buyer_po (text)
  [ ] node 11 — form field removed: gi_load_number (text)
  [ ] node 11 — form field removed: tracking_number (text)
  [ ] node 11 — form field removed: invoice_key (text)
  [ ] node 11 — form field removed: rma_key (text)
  [ ] node 11 — form field removed: date_range (select)
  [ ] node 12 — node_name: "Builds the search date window once; replaces the original's duplicated date-window and division logic (nodes 58/70/71 folded together here)." → "Builds the search date window once; replaces the original's duplicated date-window and division logic (nodes 58/70/71 folded together here). Re-derives order key and division from the search screen's own fields (the agent may have refined them here, separately from the intake screen) and re-stages the findorder Connected Object's transforms fields with the agent's actual date-range/division choice, overwriting route_intake's broad 180-day default -- see route_intake's bug-fix note."
  [ ] node 12 — script code changed (14 → 20 lines) — Stage the criteria search
  [ ] node 67 — content changed (185 → 214 lines) — claude.md

