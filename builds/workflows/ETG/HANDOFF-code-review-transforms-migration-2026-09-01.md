# Handoff: Samuel Kling code review + transforms→form-data migration (ETG Register Errands)

**Written:** 2026-09-01, by Claude (Cowork), for whichever session picks this up
next. No memory carries over between threads — everything you need to continue
should be in this doc or the files it points to. If something here turns out to
be wrong once you inspect the live trees, trust the trees and correct this doc.

## 1. What this thread was

Samuel Kling (ETG stakeholder taking over these workflows from Brent) sent Slack
DMs code-reviewing node 44 of the Register Errands tree. Brent asked for three
things:

1. Determine whether Samuel's findings are valid and worth implementing.
2. Standardize/simplify the code generally ("fewer complex structures").
3. Implement as **new, separate draft files** — never touch the live/production
   trees directly.
4. Separately, write a document on removing `transforms` namespace usage in
   favor of form data, because transforms/actions have a fixed 1-hour TTL and
   form data doesn't. Brent asked this be remembered as a general Zingtree fact,
   not just tree-specific — it now lives in `Zingtree Builder/MEMORY.md`'s
   territory conceptually, though I didn't write it there myself this session
   (worth doing if a future session wants it captured at the house level).

All four deliverables were completed and delivered this session (see §3).
**Nothing in production was touched.**

## 2. The two trees involved

| | Register Errands (Errands) | Register Errands - VI |
|---|---|---|
| Tree id | `518765124` | `542096854` |
| Source file this session worked from | `Selected_from_ETraveli_Group_20260901.json` (Brent's upload, both trees in one `{"projects":[...]}` bundle) | same file |
| Latest PRODUCTION export on disk before this session | `Register Errands - Dynamic (PRODUCTION, 2026-08-27 v2).json` — spot-checked, node 44 byte-identical to the uploaded file's node 44, confirming the upload was current | `Register Errands - VI Dynamic (PRODUCTION, 2026-08-27 v2).json` |

Note: this thread's source tree ids (`518765124` / `542096854`) are a **different
pair of tree ids** than the ones in the 2026-08-20 VI handoff doc
(`595124299` / `756760393`) sitting in the same folder — ETG appears to have
re-exported/re-imported these trees at some point between then and now. If a
future session is confused about which ids are current, check the most recent
PRODUCTION export's `id` field, not either handoff doc.

## 3. What shipped, and where it lives

All four files are in `Zingtree Builder/Workflow JSONs/ETG/`:

- **`Register Errands - Dynamic (v44 code-review simplification draft, 2026-09-01).json`**
  — draft. Only nodes **44**, **21**, and **5** (claude.md) differ from the
  source export; 78 nodes total, unchanged count, verified by programmatic diff.
- **`Register Errands - VI Dynamic (v14 code-review parity, 2026-09-01).json`**
  — draft. VI's own PNR/payload code (nodes 83, 84) was checked for the same
  anti-patterns and is already clean — only node 5 (claude.md) changed, to
  record the review and the "no functional change needed" verdict.
- **`ETG-code-review-samuel-kling-2026-09-01.md`** — the full review: Samuel's
  messages verbatim, a verdict on each of his 6 points (5 valid, 1 partially,
  with one specific technical claim of his corrected — the old `"N/A"` filter
  already excluded the `""`-defaulted fields, contrary to what he said, though
  his underlying complaint about two sentinels being confusing was still
  right), two additional issues found while implementing that neither of us
  flagged going in (an `orderReference` third-source mismatch, and
  `subCategoryId` which no script has ever populated), and the exact
  before/after for the one change that has to happen in the **Zingtree admin
  UI** (Connected Object #184's request body — not in the JSON export, can't be
  changed from a tree file).
- **`ETG-transforms-to-formdata-migration-2026-09-01.md`** — the TTL-risk
  document. Key finding: this isn't a blanket find-and-replace, because merge
  fields (`${transforms.x.y}`) can dot-path traverse into transform objects but
  form data can't be traversed at all. Split into 4 tiers by risk/effort:
  - **Tier 1 (do first, not yet done):** 7 idempotency-guard arrays
    (`registered_errand_keys`, `ticket_ids_by_errand_key`,
    `parent_ticket_ids_by_errand_key`, `attempted_child_ticket_keys`,
    `attempted_grandchild_ticket_keys`, `created_child_ticket_keys`,
    `created_grandchild_ticket_keys`) — confirmed (grepped, not estimated) to be
    set/read only inside scripts (nodes 10, 29, 32, 36, 44, 65, 71), never by a
    merge field. Purely mechanical to move: `setTransformData` +
    `JSON.stringify` → `setFormData`; `transforms.x` reads →
    `JSON.parse(ZT.getVariableValue(...))`. This is the actual fix for the
    actual risk Brent named (these guards are what past duplicate-ticket bugs,
    v12/v20/v35, were fixed by).
  - **Tier 2:** 6 HTML-string transforms, safe in principle but house
    convention routes HTML to transforms on purpose (a form-field storage-size
    limit was flagged by Luciano in an earlier thread) — confirm that limit
    before moving the two that scale with PNR count.
  - **Tier 3:** `current_pnr.pnr` / `.postSaleHandleType` — the only two fields
    reached by nested dot-path merge field (Errands nodes 1, 8; 13 VI content
    nodes). Requires flattening into separate flat form variables; recommended
    only if there's a live incident of these expiring, not as a precaution.
  - **Tier 4:** CO #184's body reads 6 `current_pnr` sub-fields externally —
    outside this session's reach (admin UI only); mostly resolved once the
    code-review doc's payload-consolidation change ships.

## 4. Pending / not yet done

Nothing below has been started:

1. **Run the `etg-errand-regression` skill's offline harness** against the new
   Errands draft — this session only ran ad-hoc Node.js harnesses (custom
   stubs simulating `ZT`/`transforms`/`actions`, 4 test cases each for nodes
   44 and 21, all passing), not the house's own regression suite. Do this
   before calling the draft "verified" in the fullest sense.
2. **CO #184's admin-UI body change** — not doable from a tree JSON. Needs a
   human (or a session with browser/admin access) to go into the Zingtree
   admin UI, sandbox first, and swap the 13-field hand-typed template for
   `${transforms.edvin_register_errand_payload}` (exact before/after is in the
   code-review doc). This and the new payload transform are a matched pair —
   don't ship one without the other.
3. **Sandbox live-test** — import the draft into sandbox, flip CO #184's body
   there, run at least "2 PNRs, same type+action" and "no agent identity
   resolvable" live.
4. **Node 21's own CO** (Add Internal Note) likely has the same
   `.slice(1,-1)` root cause as node 44 did, but its CO body wasn't visible in
   this session — confirm the live template before applying the same fix.
5. **Tier 1 of the transforms migration** (see §3) — recommended as the next
   concrete piece of work, separate from the code-review draft, its own file
   and its own verification pass.
6. Only after Tier 1 has run clean in production for a normal cycle: **Tier
   1.5** — the same mechanical treatment for `final_pnrs`, `customer_action_pnrs`,
   `child_tickets`, `unresolved_selections`, `planned_ticket_titles` (same
   script-only profile as Tier 1, just deliberately not bundled into the first
   pass so the diff stays easy to verify).

## 5. Where to pick this back up

Read, in this order:
1. This doc.
2. `ETG-code-review-samuel-kling-2026-09-01.md` and
   `ETG-transforms-to-formdata-migration-2026-09-01.md` (both in this folder) —
   full reasoning behind everything above.
3. The `claude.md` node (node id `5`) inside the new draft JSON itself — it now
   has a changelog entry for this session's changes and is the
   most-authoritative, tree-internal source if this doc and the tree ever
   disagree.
4. `zingtree-workflow-builder` skill, if not already loaded — the data-setting
   rules and claude.md convention this whole session followed.

Most natural next step: pick one of §4's pending items — Tier 1 of the
migration is probably the highest-value next unit of work, since it's
self-contained, mechanical, and directly addresses the TTL risk Brent raised.
