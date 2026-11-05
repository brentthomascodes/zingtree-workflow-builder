# ETG "Italian Law" AI Action — Requirements & Change List

**Source:** Spiky call *"Review AI actions ETG"* — Monday, Aug 17, 2026, 16:00 UTC (~32 min). Attendees: George Kasidis (Giorgos), John Ruberto, Brent Thomas; Charchit Rajput joined ~12 minutes in.
[Spiky recording & transcript](https://app.spiky.ai/meetings/67f228cc-15c8-4f59-a6b9-fbafdf7469d2)

**Workflow reviewed:** "Italian Law Crises" (tree ID 274768699, org 113) — the JSON you attached, last modified 2026-08-17 16:29 UTC, i.e. edited live on this call.

---

## 1. Current state of the workflow (verified against your JSON)

The tree already reflects a chunk of what was built live on the call:

- **Node 7 "Edvin – Find Order"** (root, Data node) fires automatically on load and calls a real Edvin order-lookup Connected Object — this replaced manual test-variable entry.
- **Node 8 "Map Edvin Data"** (Script) pulls `phoneNumber` from the Edvin response and `order_number` from the Zendesk custom field, then:
  - Sets `billing_country` to "Italy" only if the phone number contains `+39` — this is intentionally George's stopgap ("let's go with the phone number for testing purposes").
  - Hardcodes `agent_country = "Greece"`. The script literally contains the unfinished 3-step plan you and George worked out live: *query Zendesk agents where email = dynamic agent email → extract country → set as variable.* That query isn't built yet.
- **Node 4 "Italy – EU Agent Region Disclosure"** (AI Action, action ID 14, alias `italy_region_compliance`) has a **blank instruction** — none of George's four scenario-specific scripts are wired in.
- **Node 5** (Script) turns the AI Action's output into the styled HTML card agents see — this includes the CSS cleanup Charchit made live on the call (the "gray box with quotes" he removed).
- **Nodes 3 ("Set Info") and 6 ("Use transformed data")** are the old manual-entry test path (type in phone/billing country/order number by hand, click Next). Node 7/8 has superseded this — nothing in the tree routes into node 3 anymore, so it's currently dead weight.

---

## 2. Requirements gathered on the call

1. **Validate with real order data, not test variables.** George: *"we need to make sure that once an agent picks up a ticket which has specific order reference, then we can read the details of this specific ticket... his billing address, his phone number, his name."* — name is not currently captured anywhere.
2. **Four distinct disclosure scripts, not one generic message.** George has a document (shared mid-call after a permissions hiccup) with four scenario scripts, each needing `brand`, `city`, and `agent name` variables inserted.
3. **No agent click required.** For Italian cases, the script must be the first thing that runs, fully automatic — George is coordinating this with **Christina Zamenopoulou** on the Zendesk-trigger side.
4. **A reliable customer-nationality signal.** Phone country code was agreed as a *testing-only* stand-in; George flagged it isn't reliable long-term (an Italian customer could carry a foreign number, or vice versa) and said he'd ask ETG's business team for something better.
5. **Agent-location lookup from Zendesk**, not hardcoded. Brent's plan on the call: query Zendesk agents by `agent_email` (already available in the workflow), extract the agent's stored location/country, set it as `agent_country`. George wasn't sure which Zendesk field holds this ("no idea, to be honest... but I think there should be a location... in their profile").
6. **Billing country still unresolved.** George couldn't find a usable billing-country field in the Edvin response during the call and committed to sending a method "by tomorrow" (Aug 18).
7. **Multi-region test coverage.** Thursday's (Aug 20) session should include an EU-based agent and an India-based agent to confirm the logic holds across locations.

---

## 3. Changes still needed, mapped to the tree

| # | Change | Node(s) affected | Status |
|---|--------|-------------------|--------|
| 1 | Add customer name extraction from the Edvin response | Node 8 | Not started — field name in Edvin's response wasn't identified on the call |
| 2 | Insert the four scenario scripts (with brand/city/agent-name variables) | Node 5 (selection logic) + Node 8 (new `brand`/`agent_first_name`/`agent_city` variables) | **Resolved 2026-08-19** — wired into v2 JSON using Giorgos' script doc. `brand`/`agent_city`/`agent_first_name` are still placeholders (see item 3) |
| 3 | Build Zendesk agent-email → agent-country lookup | New Data Connected Object + edit to Node 8 | Blocked — waiting on confirmed Zendesk field name |
| 4 | Replace phone-prefix heuristic with reliable nationality method | Node 8 | **Resolved 2026-08-19** — Giorgos confirmed phone +39 and order market field "IT" as the best signals; both wired in (OR'd together) |
| 5 | Confirm real billing-country field/method | Node 8 | **Resolved 2026-08-19** — see #4. Exact key for the market field still a best-guess (`siteMarket`/`site_market`/`market`/`site`); confirm real key next test pass |
| 6 | Confirm auto-launch (no click) is honored on Zendesk's side | External (Zendesk trigger config, with Christina) | Structurally already true in the tree (7→8→4→5→1 has no buttons); needs ETG-side confirmation |
| 7 | Decide fate of orphaned manual-test nodes (3, 6) | Nodes 3, 6 | Your call — keep for manual QA or remove |

---

## 4. Why I didn't build the new JSON myself

I pulled the full transcript and cross-checked it against your uploaded JSON and the Zingtree Builder workspace (including the ETG folders and MEMORY.md — no prior notes on this specific tree exist there). Three of the seven changes above depend on information that was **not resolved on the call and isn't available to me**:

- **The four scenario scripts** are Italian legal-disclosure language that George was going to share via a doc he created mid-call — I don't have that text, and this isn't something I'm comfortable drafting from scratch given it's customer-facing compliance copy.
- **The Zendesk field for agent country** is unconfirmed — George himself said "no idea, to be honest." Guessing a field name risks silently breaking the flow.
- **The billing-country method** is still pending from George's business team.

Rather than guess at any of these and hand you a JSON that looks finished but silently breaks in production, I've written up the actionable list below instead.

---

## 5. Actionable checklist for you

- [x] ~~**Get the four-scenario script doc from George**~~ — **Done 2026-08-19**, wired into node 5 (v2 JSON).
- [ ] **Confirm the Zendesk field for agent location/country** with George or Christina, so I can build the agent-email → agent-country lookup (Connected Object + script).
- [x] ~~**Follow up with George on the billing-country method** he owed "by tomorrow" (Aug 18)~~ — **Done 2026-08-19**: Giorgos confirmed phone +39 and order market field "IT". Wired into node 8 (v3 JSON). Still need the exact market-field key confirmed against a real Edvin response.
- [ ] **Confirm with Christina Zamenopoulou** that the Zendesk trigger auto-opens this tree for Italian cases without an agent click (the tree itself is already structured for this).
- [ ] **Decide on nodes 3 and 6** — delete as dead weight, or keep as a manual-test harness.
- [ ] **Confirm the India-based agent** for Thursday's (Aug 20) test session, per George's offer.
- [ ] Once you have the script doc + confirmed field names, send them my way — I'll wire in the four scripts, build the agent-lookup node, finalize the billing-country logic, and hand back a production-ready JSON.

---

## 6. Reference: outstanding commitments from the call (Spiky action items)

- George: provide the four scenario scripts (done mid-call, in a new doc) and the billing-country method ("by tomorrow").
- George: check with the business team on a more reliable nationality signal than phone number.
- George: arrange an India-based agent for Thursday testing.
- George (with Christina): confirm the script auto-initializes with no agent click.
- Brent: build the Zendesk agent-email → agent-country query and wire in the four scripts by Thursday.
- John: moved the Tuesday AI-alignment meeting to Thursday to accommodate this testing session.
