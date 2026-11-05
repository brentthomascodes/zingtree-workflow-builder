# Stage A Verification — Escalated Payments Dashboard - PPII Guide v1

**Account:** Corpay (Paymerang)
**Tree file:** `Escalated Payments Dashboard - PPII Guide v1.json`
**Built:** 2026-08-07, against confirmed edit list E1–E22 (`escalated-payments-dashboard-requirements.md`)

## Checks run (automated)

| Check | Result |
|---|---|
| JSON parses, schema matches production export shape (fields cross-checked against `Global Industrial/Vendor Communication (subroutine) v1.json` and `Debbi eLanguages (standardized).json`) | Pass |
| Exactly one root node, marked `is_root` | Pass — node 1 (`root_pick`) |
| Every `button_link` and `continuation_node_id` resolves to a real node or `"0"` | Pass — 0 broken links |
| Full-graph reachability from root | Pass — 56/57 nodes reachable; the 1 unreached node is `claude.md` (node 57), intentionally unlinked per house convention |
| No dead-end nodes (a non-`claude.md` node with neither buttons nor continuation) | Pass — 0 found |
| Script/Data nodes auto-continue (no buttons) and have a `continuation_node_id` | Pass |
| All 10 Script nodes: `node --check` syntax validation | Pass — 0 syntax errors |
| All 10 Script nodes: executed with empty/default inputs (`ZT`, `actions`, `transforms` stubbed) | Pass — 0 runtime errors, sane output on every script (see below) |
| ASCII-only script content (house rule — curly quotes/unicode break scripts) | Pass |
| Balanced braces/parens in every script | Pass |
| Every `${transforms.x}` merge field in a Content node is set by some upstream Script node | Pass — 0 orphaned references |

## Script smoke-test output (empty inputs)

| Node | Sets | Sample output |
|---|---|---|
| 2 (`u_prep_script`) | `working_vertical`, `dashboard_prep_html` | checklist HTML renders |
| 8 (`u_ladder_script`) | `ladder_escalate_reissue`, `ladder_html` | defaults to "1st" request, 3-day snooze message |
| 21 (`ns_script`) | `ns_row` | 7-field object, all blank (expected — no upstream form data in this smoke test) |
| 24 (`i_prep_script`) | `working_vertical`, `dashboard_prep_html` | iPay checklist HTML renders |
| 30 (`i_channel_script`) | `channel_ladder_html` | defaults to Online/IVR ladder message |
| 38 (`i_sp_mismatch`) | `mismatch_html` | 4-reason picklist HTML renders |
| 41 (`riq_script`) | `riq_stage_ready` | `true` |
| 43 (`riq_ai_draft`) | `riq_draft_text` | drafts with blank fields (expected — smoke test has no form input) |
| 51 (`mis_script`) | `action_taken`, `payment_lock_state` | `""`, `"locked"` |
| 53 (`mis_ai_draft`) | `mis_draft_text` | drafts with blank fields (expected) |

## Not covered by Stage A (needs Brent / a human pass)

- **No live BizPay, Teams, or ShareFile connection exists** — the 11 Data-type placeholder nodes have never made a real API call. Stage A can't verify anything past "the tree is structurally sound and the scripts don't throw."
- **AI Action nodes (`riq_ai_draft`, `mis_ai_draft`) are script-built stubs, not real Zingtree AI Action nodes** — that node type's configuration isn't documented in the `zingtree-workflow-builder` skill's references, so I didn't guess at it. Flagging for confirmation rather than shipping a fabricated config.
- **Payments/PII carve-out (per Zingtree policy and this account's house rules):** the following nodes touch payment cancel/de-escalate/unlock actions or client/vendor escalation data and are flagged for a teammate review pass before anything goes near a live BizPay connection: `u_action_taken`, `u_cpd_fetch`, `u_deescalate_action`, `u_unlock_action`, `ns_append`, `riq_content`/`riq_ai_draft`/`riq_send`, `mis_content`/`mis_ai_draft`/`mis_send`.
- **Content fidelity for the 3 companion-doc-dependent branches** (`u_makepay`, `u_cancel_reissue`, `u_deescalate_content`, `i_triage` reference the Participant Guide; `isf_content` references the ShareFile doc) — built as clearly-marked placeholders per Brent's 2026-08-07 call, not verified against real source material since those docs aren't in hand.
- **No real Zingtree import test** — this JSON has not been imported into a live or sandbox Zingtree org. Recommend importing to sandbox and clicking through all ~15 distinct paths (2 vertical branches × ~4-5 special cases each) before calling this done.

## Verdict

**Structurally clean, ready for Brent's review.** Not ready for a live BizPay integration or agent-facing rollout — that requires the placeholder Connected Objects to be wired, the AI Action node question resolved, and the flagged nodes to get a teammate's payments-review pass, per this account's carve-out.
