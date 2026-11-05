# ETG Errands — Building Guide: 2 New Subflows (Christina's 9/1 Ask)

> **PARTIALLY SUPERSEDED (2026-09-04, CR-016 in `register-errands-dynamic-requirements.md`).** Section 3 (Orphan Errand — automatic registration via `orderReference = "-999"`) was reversed on today's ETG Collaboration Hour: Christina asked for a manual "go register this in Edvin" screen instead, "for now." Section 2 (Unconfirmed Booking) is unaffected and still reflects what's built. See CR-016 for the current, call-verified spec and the exact quotes.


**Source:** Spiky recording *"Zingtree - ETG Collaboration Hour"*, 2026-09-01 (~65 min), attendees Christina Zamenopoulou, Brent Thomas, Subrat Srivastava, Samuel Kling, Elis Taraj.
**Target tree:** `Register Errands - Dynamic` (tree ID 139367450, org 113/EU), currently v43.
**Owner / commitment:** Brent — *"I'm committing to right now... building out the two new subflows we discussed when certain parts of an order reference aren't available, like a timeout ticket."* Planned review: Thursday.

---

## 1. The problem (why 2 subflows)

The current dynamic tree assumes every ticket has an order **and** at least one PNR to select. Two real cases break that assumption, and Christina asked for a dedicated subflow for each:

- **Case A — order exists, but no PNR yet.** Cart/timed-out orders where the customer hasn't finished payment: Zendesk has an order reference, but Edvin's Find Order returns no PNR (airline never issued one). Agents are stuck because PNR selection is currently mandatory.
- **Case B — no order at all.** "Orphan" errands — the agent needs to log an errand that isn't tied to any order/PNR.

Christina's own words: *"We need actually, I think it's 2 sub flows. We need to work on [them] separately and connect them with the dynamic [tree]."*

---

## 2. Subflow 1 — "Unconfirmed Booking" (order ref present, no PNR)

**Trigger condition:** contact region = **"Unconfirmed booking"** (Christina: *"We do have a dedicated contact region for it called unconfirmed booking"*) — treat this as the primary signal, and cross-check against the Find Order (node 4) response returning zero PNRs.

Build steps:
- [ ] Add a branch right after node 4 (Edvin Find Order): if contact region = Unconfirmed booking → route into the new no-PNR path instead of the normal PNR-selection nodes.
- [ ] **Order reference must still be required/non-null** on this path — reuse the existing order-reference logic (custom field `33772689958162`, set at node 10, with Find Order as fallback per R20). Only PNR is optional here, not the order ref.
- [ ] Skip/replace the PNR-selection step — treat the ticket as a single implicit record with no PNR attached.
- [ ] Keep the same channel/category/type/action selection UX agents already use (nodes 1/2/12) — nothing changes there.
- [ ] On submit, call Edvin Register Errand (nodes 43–45) with PNR field blank/null but `orderReference` populated. **Confirm with Elis** whether the API accepts a null PNR on this call — this wasn't explicitly tested on the call, only agreed in principle ("we can definitely still have it register an errand... we just need to build a separate type of workflow/logic for this type of contact reason").
- [ ] Reconnect into the shared grouping/ticket-creation logic (node 27 → child/grandchild loop 32–41 → parent note node 22) so ticket creation and internal notes stay identical to the main flow — only the front-end PNR requirement changes.
- [ ] Build as a **draft/staged version first** — do not publish live. Brent: *"I feel like I have full understanding on this so I can build a draft of this and stage it, so we can test it without going live."*

---

## 3. Subflow 2 — "Orphan Errand" (no order reference)

**Trigger condition:** no order/PNR retrievable at all for the ticket — distinct from Subflow 1, which still has an order reference.

Christina's description of the agent experience: *"Agents to run Zingtree, select the type in action, write their notes, [create the] title ticket, internal note to be posted."*

Build steps:
- [ ] Same channel/category/type/action selection pattern as the main tree (sourced dynamically from Edvin config, nodes 1/2/12) — no PNR step, no order-reference requirement.
- [ ] Agent writes free-text notes → tree creates the child ticket + parent internal note as it does today (reuse node 22 logic).
- [ ] **Register the errand via the API using `orderReference = "-999"`, plus the registering agent's user ID** — Elis clarified late in the call that orphan errands *are* already supported this way: *"You need to send us the order reference minus 999 and it's going to get treated just the same way as an orphan... either way in the back end we're just going to get minus 999 if you don't send a value, but it's easier for you just to send minus 999."*
  - This **supersedes** Christina's earlier statement mid-call that the agent would need to log the errand manually outside Zingtree — reuse the existing Register Errand call (CO #160) rather than building a manual-log-only path. **Confirm this with Christina before building**, since her original ask assumed manual logging.

---

## 4. Shared / cross-cutting build notes

- Both subflows branch off the same decision point: right after node 4 (Find Order) / order-reference check, classify the case as **Normal** (has PNRs) / **Unconfirmed booking** (order ref, no PNR) / **Orphan** (no order ref).
- Both should reuse existing shared logic wherever possible — channel/category/type/action selection (1/2/12), grouping (27), ticket creation (32–41), parent note (22). The only genuinely new logic is (a) the branch/condition check and (b) how the PNR / orderReference fields get populated before the register-loop nodes (43–45).
- **Confirm exact field/value** for "Unconfirmed booking" contact region with Christina (she referenced it live in her own Zendesk/Zingtree screen; the tree's existing `CONTACT_REASON_BY_ZENDESK` map at nodes 2/46 is the likely place to check first).
- **Volume/urgency check pending** — Elis was checking daily volume of orphan-errand cases in Edvin admin to help prioritize; get that number before/while building.
- Sign-off path per Christina: business-process approval for anything beyond a technical decision routes through **Sofia and Carolina**, not just Christina/Olga.

### Related fix from the same call (touches the same area — consider bundling into the same publish)
- Update the **language field** on child tickets from the parent ticket's language custom field, so CC routing works correctly (Christina's ask; Brent committed to it same call).
- Fix **Genesis conversation ID/type showing "NA"** on some tickets (Subrat flagged a regression from Friday's fix; still open as of the call).

### Noted but NOT an action item yet (parking lot)
- Samuel raised a broader architecture question about `transform` data expiring after 60 minutes vs. `form` data being persistent, in case a subflow needs to survive a long agent handoff. No decision was made — Christina flagged that processing one PNR at a time (the alternative architecture) doesn't work operationally, since agents must check all PNRs before responding to the customer. Don't build around this; just be aware it's an open, unresolved discussion if either new subflow ends up needing longer-lived state.

---

## 5. Build & test plan

1. Build both subflows as **staged drafts** (not published live).
2. Review with the ETG team **Thursday** (per Brent's commitment on the call).
3. Add test cases to the ETG/ZT errand tracker:
   - Unconfirmed booking contact region, order ref present, 0 PNRs → confirm errand registers without a PNR.
   - No order reference (orphan) → confirm errand registers with `orderReference = -999` and the correct user ID.
4. Since both subflows feed into the shared node 27 grouping logic, run the `etg-errand-regression` harness against node 27 after wiring them in, before calling either change done.

---

## 6. Open questions before/while building

- [ ] Exact contact-region field/value for "Unconfirmed booking" (confirm with Christina).
- [ ] Does the Edvin Register Errand call accept a null PNR for Subflow 1? (confirm with Elis)
- [ ] Does Subflow 2 still need any manual/admin-side logging once `-999` is wired in, or does that fully replace it? (confirm with Christina — contradicts her original description)
- [ ] Orphan-errand daily volume, to help prioritize (Elis was checking)
