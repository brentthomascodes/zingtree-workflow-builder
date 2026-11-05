# Requirements — Adyen: Underperformance Playbook

**Account:** Adyen
**Workflow:** Underperformance Playbook (tree 629304572, org 605705) — live since ~2026-08-03
**Owner:** Brent Thomas
**Created:** 2026-10-05
**Baseline export:** `Zingtree Builder/Workflow JSONs/Adyen/Underperformance Playbook (BEFORE baseline 2026-10-05).json` (export last modified 2026-08-12)
**Status:** CR-1 built offline for review. **Customer approval pending** — Ryan Goldberg committed to bring his team's feedback by EOD 2026-09-30; none received as of 2026-10-05. Marcus's recap went to Ryan 2026-10-05. Nothing is imported to the live tree until Adyen approves and Brent imports.

## Baseline (as built before this doc)
No requirements doc existed for this tree. The as-built behaviour is described in the tree's own `claude.md` node (node 27): scenario picker → branch questions → one Recommended Actions screen → readable summary email → "Summary sent". Tree-level persistent button "Share feedback" (node 26, Google Form link) shows on every screen for every session. That description is the baseline; it is not re-specified here.

---

## CR-1 — Exit / feedback A/B test (2026-10-05)

**Source:** Spiky, "Ayden x Zingtree", Wed 2026-09-30 (Ryan Goldberg, Marcus Torres, Brent). https://app.spiky.ai/meetings/cd5b677a-793b-47f1-8a15-f8d47933ab21
Follow-up: Gmail "Zingtree: Exit Node Reporting A/B Testing Plan", Marcus → Ryan, 2026-10-05.

**Problem (Ryan):** account managers drop out mid-flow (close the browser at node 3 of 5) and Adyen gets no signal on why. Zingtree can't intercept a browser close, so feedback has to be asked for. Ryan doubts agents will click a feedback button voluntarily, so he wants to measure it: run an A/B test, no control group — one group gets in-UI feedback buttons, the other gets an email survey — and see which gets more responses.

| # | Requirement | Source |
|---|---|---|
| R1 | Every session is randomly assigned to exactly one group at the start of the flow using Zingtree's native **A/B test Logic node**, placed before the first rendered screen. | Ryan 12:05 "is there a way to run an AB test"; Brent 12:25 "we have a node that is effectively A-B testing and we would just place that at the beginning" |
| R2 | **Group A — in-flow buttons:** a wrap-up/feedback button is available on every screen of the flow. Clicking it lets the agent say how the session ended: resolved using the playbook, resolved outside the playbook, escalating, not helpful, just exploring/testing. Optional free-text comment. | Brent 8:17–9:20; Ryan 15:23 "was your problem resolved? Resolved outside of the flow, escalated, not helpful" |
| R3 | **Group B — email survey:** Group B sees no in-UI feedback buttons. When the flow is completed, the agent receives an email asking how it went. | Brent 16:43 "If you go down B, you don't see these buttons, but once the flow is done, you get an email that says, how did you like it?"; Ryan 16:52 "I think that's a good way to look at that" |
| R4 | The survey responses are captured in Zingtree (not as email replies) so Adyen gets a reporting view instead of parsing emails. | Brent 18:21 "have a link where they can open up a … workflow that asks the questions … it'll automatically create a nice reporting view" |
| R5 | Each session records its group (`ab_group`) so results can be split in Zingtree reporting. | Implied by R1 — needed to read the test |
| R6 | The test is always on from go-live until Zingtree turns it off. | Brent 17:49 "it'll just be always on. Then we can just turn it off" |
| R7 | The rest of the flow (questions, Recommended Actions, summary email) is unchanged for both groups. | Ryan: only the feedback mechanism is under test |

### Build decisions (Dudley, for Brent to confirm)
- **D1 — Split 50/50.** Ryan floated 90/10 and asked for advice. Adyen's AM population is small; a 10% arm won't produce enough responses to compare. 50/50 is also all the help article documents (the A/B node picks randomly among its rows; no weight setting is documented).
- **D2 — Same questions in both arms.** The email links to the same wrap-up screen Group A uses, opened with `ab_group=survey`. One instrument, so the comparison is response rate, not question wording.
- **D3 — Group B does not see the existing "Share feedback" button either** (same mechanism hides it), otherwise B has in-UI feedback and the test is contaminated. Group A keeps it alongside the new wrap-up button.
- **D4 — Per-session button visibility is front-end JS.** Persistent buttons are a tree-level setting with no per-session switch, so `script_code` hides them unless the session's group is `buttons` (read from a hidden marker on the scenario picker, remembered for the session). Fails closed: if the group can't be read, the buttons stay hidden.

### Open questions (non-blocking for the offline build, blocking for go-live)
1. **Adyen approval** of the approach (Ryan's team feedback, promised EOD 9/30).
2. **Abandoners in Group B get no survey.** Per R3 the email only fires on completion, so B can never capture the drop-outs this test is about. Brent's call idea — a weekly survey email to everyone who should be using the tool — would cover it, outside the tree. Confirm with Ryan whether that's in scope.
3. **Published URL host** for the survey link (built as `https://eu.zingtree.com/show/629304572?ab_group=survey#32`). Confirm EU vs US host.
4. **Keep or retire the Google Form "Share feedback" button** once the wrap-up screen exists.

### Not built here, deliberately
- The weekly adoption survey email (open question 2).
- Linking a Group B survey response back to its originating session (would need a merge field in a link; the email links to a fresh survey session instead).

### Live-only checks (Stage B)
- The imported Logic node opens in the editor as **A/B test** with two rows (export shape for that mode was not available to copy from — if it opens as a normal logic node, switch the dropdown to A/B test).
- Group A: wrap-up and Share feedback buttons visible on every screen, including after the picker. Group B: neither visible on any screen.
- `#32` deep link opens the wrap-up screen on the published URL behind SSO and records `ab_group=survey`.
- Group B completion sends both the summary email and the survey email.
