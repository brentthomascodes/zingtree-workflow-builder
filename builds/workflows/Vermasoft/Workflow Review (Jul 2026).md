# Workflow Review — Basic Receptionist & Main Intake

*Reviewed against the Zingtree Workflow Builder skill patterns and workspace MEMORY. Jul 21, 2026.*

Two trees reviewed as uploaded (current/live state): **Basic Receptionist** (id 862603108, hub) and **Main Intake** (id 142849578, subtree it calls). Note: rebuilt/consolidated versions of both already exist in this workspace (`Workflow JSONs/…`); this review scores the *uploaded* versions and points at those rebuilds as the target.

---

## Scores

| Tree | Score | Verdict |
|---|---|---|
| Basic Receptionist | **58 / 100** | Functional but has a hard break; heavy consolidation debt |
| Main Intake | **62 / 100** | No errors, but all logic sits in buttons — the core anti-pattern |
| **Combined system** | **60 / 100** | Solid intent, mid-tier execution |

Where 100 = the house masters (ETG, Returns, Penrose consolidated) and ~30 = a raw button-only tree with breaks. Both land in the "clear improvement path, nothing catastrophic except one dead end" band.

---

## Dead ends & things that will error

**Basic Receptionist — critical**

- **Node 20 "API Calendly: Pull Available Times" continues to node 89, which does not exist.** This is a broken link. Nine paths (every "Schedule consultation" branch: nodes 8–15, 27) funnel into node 20 and hit a dead end / error. This is the single most important fix.
- **Node 20 is an unconfigured Data node** — `data_connected_objects` is empty, so it isn't actually wired to a Calendly Connected Object. Even if node 89 existed, nothing is fetched.
- **Both Tree nodes return to 0.** Node 3 "PNC" and node 26 "New Matter" open Main Intake with `return_tree_node_id = 0` (and node 26 also has `open_tree_node_id = 0`). Control won't return to the hub — the call ends inside the subtree instead of coming back to wrap up.
- **Unset merge fields:** `${attorney_name}` (node 40 "Take Message") and `${law_firm}` (node 21 "End Call Script") are never set in the tree. Unless passed in as URL params, they render blank. Seed them as inbound query params or set them in a script.

**Main Intake**

- No broken links, no unreachable nodes, all paths terminate cleanly (92 Appointment Confirmed / 93 Callback / 99 End of Call are legit terminals). Clean on this axis.

---

## Recommendations (by impact)

**1. Fix the Calendly break (Basic Receptionist) — do first.**
Create the missing node 89 as a script that maps the Calendly response, then route 89 → a "book a time" screen. Wire node 20 to a real Calendly Connected Object (CX Actions) so it actually pulls availability. The consolidated version in `Workflow JSONs/Basic Receptionist/` already does this — lift node 89 from there.

**2. Move logic out of buttons (Main Intake) — biggest structural win.**
Main Intake is 26 content nodes with zero script/logic nodes; every decision is encoded in button links. The four case-type branches (auto / slip / med-mal / workers-comp) each ask the same shape of questions — *when did it happen, were you injured, treatment, fault* — as separate one-question screens. Collapse to the house pattern: **one intake screen with native conditional fields → one eval script → one router.** The rebuilt version already does this (26 → 9 nodes). Fewer clicks for the agent, one place to change logic.

**3. Consolidate single-field screens (Basic Receptionist).**
Many menu buttons lead to a node holding one form field (deadline, docs, notes…). Merge clusters into one screen with native conditional fields (e.g. one "consultation reason & details" screen, one "billing issue" screen, one "other caller" screen), driven by a `select` + `config.conditional`. Target ~44 → ~26 nodes.

**4. Fix the tree-return contract.**
Set `return_tree_node_id` on nodes 3 and 26 to the hub node that should resume after intake (e.g. the schedule/collect step), and set node 26's `open_tree_node_id` to Main Intake's root (2). Otherwise the hub-and-spoke hand-off is broken.

**5. Rename cryptic nodes so the tree reads like a story.**
Basic Receptionist has `PNC`, `EC`, `RC`, `Other`, bare `Yes`/`No`, `Upsell`, and a typo "Attoney's acquaintance". Retitle to the action/decision (e.g. "Possible new client", "Existing client — does a case exist?", "Attorney reachable?"). Main Intake's titles are already good.

**6. Add a claude.md memory node to each tree.**
Neither tree carries one. Add an unlinked Content node titled `claude.md` (purpose, node map, data dictionary, changelog) so future edits can be vibe-coded and the memory travels with the JSON on re-import.

**7. CX Actions opportunities.**
Beyond Calendly on node 20: the existing-client / case-lookup paths (Basic Receptionist nodes 4, 7, 42) are natural spots for an API lookup against your case system instead of manual agent entry, and the "collect caller info" step could create/update a CRM record. Worth deciding per account — tell me the services + auth and I'll design the Connected Objects.

---

## What's already good (don't lose it)

- Main Intake's branch-on-answer routing to statute-of-limitations (95), no-injury (96) and liability-unclear (97) screens is genuinely smart intake triage.
- Shared "Collect Caller Information" (node 90, 19 inbounds) and shared "End Call" (node 21, 22 inbounds) are the right instinct — reuse over duplication.
- Native `required` form fields throughout; no ugly dynamic-HTML inputs.
- Basic Receptionist's fan-out menus (call reason, billing, other-caller) are clean multi-button content nodes — correct use of buttons for real branching.

---

## Scoring detail

**Basic Receptionist — 58**
- Correctness: broken node 20→89 + unconfigured Data node + tree-return 0 + unset merge fields (−22)
- Consolidation: one-field-per-node debt (−12)
- Titles/readability: cryptic + typo (−6)
- No claude.md (−2)
- Credit: good menus, terminals, native fields, sensible hub design

**Main Intake — 62**
- Correctness: clean (no deduction)
- Consolidation: all logic in buttons, 4 duplicated branches, high click count (−26)
- No script/logic layer at all (−8)
- No claude.md (−2)
- Credit: smart routing, shared nodes, story-readable titles
