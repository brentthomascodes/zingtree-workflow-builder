# ETG "Register Errands - Dynamic" — Fix Tracker

*Tree ID 595124299 ("Register Errands - Dynamic", not live — tag `dynamic_errand_testing`). Updated 2026-08-13, pass 3 — scope correction: child/silent ticket creation (nodes 32/33) is confirmed working and is explicitly OUT of scope for this fix. The fix is scoped strictly to the errand-count-determination logic: how many Edvin errands get created from the agent's per-PNR action inputs (node 27 grouping + node 44/43 registration gate).*

## Where the context came from

- **Tue 2026-08-11 "ETG | Zingtree Sync"** (Spiky): background only — Olga asked for "Handled By: Alice" removed from errand free text (done), asked Brent to test free text, and at that point believed errand counts were fine. Go-live discussed as Aug 25 (originally 17th).
- **Wed 2026-08-12 "ETG | Zingtree Sync"** (Spiky — the recording that failed last pass, now processed): this is where every one of Olga's specific bug reports comes from. Full read below.
- **Olga's tracker CSV** (`ETG requirements and defect tracker - Open Items.csv`, uploaded 2026-08-13): the authoritative, numbered log. The four rows relevant to this fix pass, quoted verbatim:
  - *"Edvin errand same type/action 1 errand - but both pnrs and both 'free texts' 1125-140-358"* — **In progress**
  - *"both 'free texts' for the above example 1091-107-475"* — **In progress**
  - *"1136-636-661 // ZD 335866 — both pnrs same type/same action (do not proceed) correctly 1 silent ticket for both pnrs but 2 different errands in edvin, it should be 1 errand"* — no status set
  - *"Single PNR - different request bucket - errand in Edvin is duplicate - there should be one errand 1136-004-133 // ZD 335943 — different request silent ticket errand logged twice in Edvin"* — no status set

The single-PNR case (1136-004-133) is the important confirming data point: a lone PNR can't hit a *grouping* bug (there's only one type+action to group), so whatever's duplicating it has to be something that re-runs the registration step itself — which is exactly the missing-guard bug below, not a grouping/bucket-specific code path. Good corroboration for the fix already shipped.

## Scope correction (2026-08-13, pass 3)

Brent's call: child/silent ticket duplication (nodes 32→33→34/35) is **not an actual issue** — that pipeline is working correctly and must not be touched or gated. The node 13 "Ticket already created?" addition proposed in pass 2 (below) was based on a code-inspection observation, not a reported symptom, and is **withdrawn**. It should not be added, and if the v39 JSON export is ever revisited, node 13 and the node-32 rewiring should be removed from it, keeping only the node 27 fix and the node 17 restoration.

The actual fix is scoped to exactly one thing: **the logic that determines how many Edvin errands get created from the agent's per-PNR action inputs.** That logic lives in two places only — node 27 (groups PNRs into distinct errands by type+action) and node 44/43 (the gate that actually registers each errand in Edvin). Nothing in the child-ticket loop (32/33/34/35) is part of this fix.

## Fixed last pass — now corroborated by the CSV and the Aug 12 call

| # | Issue | Tracker row(s) | Root cause | Fix |
|---|---|---|---|---|
| 1 | Errand shows only 1 PNR + only that PNR's free text when 2 PNRs share type+action | `1125-140-358`, `1091-107-475` | Node 27's `final_pnrs` kept only `group[0]` per errand group, discarding every other PNR (and its notes) | `final_pnrs` now joins the full group — every PNR, every PNR's own notes, concatenated passengers |
| 2 | Same type+action, 2 PNRs, do-not-proceed → 1 correct silent ticket but 2 errands | `1136-636-661` / ZD 335866 | Node 44 computes `skip_errand_registration` but the Scoring node that reads it (old node 17) was missing — node 43 fired unconditionally on every replay | Re-insert node 17 between 44 and 43 |
| 3 | **Single PNR**, different-request bucket → errand duplicated | `1136-004-133` / ZD 335943 | Same as #2 — proves it's not a grouping/bucket bug, it's the missing replay guard | Same fix as #2 |

~~4. Same dead-guard shape on child/silent ticket creation (node 32→33) — re-insert node 13 between 32 and 33~~ — **withdrawn per Brent's correction above.** Child/silent ticket creation is working and out of scope.

Files from that pass are already in your workspace: `Workflow JSONs/ETG/Register Errands - Dynamic (v39 ...).json` (note: that export still contains the withdrawn node 13/node-32 change — treat it as superseded until re-exported without it), `Script Library/node27_stitch_group_FIXED_2026-08-13.js`.

## New from the Aug 12 call — not yet actioned

1. **Child ticket group assignment is wrong.** Olga: tickets land in a "Brand request..." support group instead of staying with the agent who created them. Brent needs a new Group ID from **Somik or Samuel** — external dependency, can't fix without it. *(Tracker: not yet a numbered row — worth adding.)*
2. **Grandchild tickets don't get the parent-detail copy that child tickets now have** (order reference, contact reason, booking/rebooking info). Brent, live on the call: *"I still need to get this working for grandchildren as well."* — **Flag:** the CSV row *"child ticket/grandchildren ticket fields, copy from parent"* is marked **Completed**, but that's contradicted by Brent's own statement on this call. Worth confirming with Olga whether that row was only ever scoped to child tickets, or whether it needs reopening.
3. **Agent identity for Edvin errand creator (tracker row 73, "In progress")** has a concrete plan now, not just "blocked on ETG": install the updated Zendesk/Zingtree package → get agent email → resolve agent's Edvin user ID → use that instead of the current hardcoded "Ellis" user ID that all errands show today. Brent said on the call he has everything he needs to do this.
4. **VI (virtual interlining) sub-tree** needs an API connection + small routing logic (booking date vs. order-created date, routing to node 50 or 66). Brent committed to finishing this "tomorrow," which per the call's own dating lands **today (2026-08-13)**. Matches CSV row *"ETG/Bcom API" — Not Started* and *"Remove PNR loop" — Not Started*.
5. **Intermittent "taken back to PNR selection" glitch.** Both Olga and Brent have seen it; Brent's working theory is a Zendesk tag-refresh race (adding the `zt_started` tag reloads the page and re-lands on the starting tree). Not root-caused, no fix attempted yet — worth a dedicated investigation pass since Brent's own explanation is a guess.
6. **`zingtree_completed` tag not firing reliably on ticket resolve.** Olga saw a resolved ticket without it; **Samik/Somek** is investigating on ETG's side, not a Zingtree-side fix (per CSV: *"Mandatory zingtree usage" — In progress, owner Somik*).
7. **Agent Roles feature (FL / SC / etc.)** — in progress per both the 8/11 call and the CSV, unrelated to the errand bugs but worth keeping visible since it's active this week.

## Open Issues carried over from last pass — still not fixed

- [ ] **Internal note (node 22) posts twice** — Olga confirmed this again live on the 8/12 call ("I was getting internal notes twice. PNR1, PNR2, PNR1 again"). No idempotency guard exists for it (a note has no title to dedupe against). Restoring node 17 stops the *errand* from doubling on a replay of this segment; it does not stop the *note*. Needs its own guard or, better, root-causing why the 21→44 segment replays at all — pull Zingtree Execution Insights for one of the affected tickets to see whether it's a same-session Back-nav or a fresh `session_id`.
- [ ] **Grandchild ticket creation (nodes 36/37) has zero idempotency protection** — not reported live, and per the scope correction above this falls under "child tickets logic," which is confirmed working. Leaving as-is; do not touch unless Brent/Olga actually report a grandchild duplication symptom.
- [ ] **Re-run `etg-errand-regression`** (offline + live) against the v39 fix before calling it shipped.

## Suggested tracker updates (for Olga's CSV — not edited automatically, flagging for her/your call)

- Mark `1125-140-358`, `1091-107-475`, and the ZD 335866 / ZD 335943 rows **Fixed, pending re-test** rather than leaving them blank/in-progress, once v39 is live and re-tested.
- Re-open or clarify the *"child ticket/grandchildren ticket fields, copy from parent"* row per item #2 above.
- Add a new row for the child-ticket group-assignment issue (item #1 above) — currently undocumented in the tracker.
