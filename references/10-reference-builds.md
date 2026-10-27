# Reference builds — the two trees to build from

Two production workflows are the house's gold standard (Brent, Sep 2026). When a new build
looks like either of them — an AI-assisted email/case journey, a Zendesk/Salesforce-bound
agent workflow, a loop that creates records per item, anything that promotes between
environments — open the matching reference first and copy its shapes. The rules in `00`–`09`
were rewritten against these two trees; where an older rule disagreed, the tree won.

Neither tree is copied into this repo (no customer exports here). They live in the workspace:

| Reference | Workspace path (latest export) | Companion skills |
|---|---|---|
| **Corpay UK — Email Automation - AI Actions INT** (58 nodes, one tree, two AI lanes) | `Zingtree Builder/Workflow JSONs/Corpay (UK)/` — newest `Email Automation - AI Actions INT (...).json`; runbook in `Account Management HQ/Corpay/UK/corpay-uk-email-ai-runbook/` | `corpay-uk-env-promote` (sandbox ↔ UK org), `corpay-uk-int-to-prod` (INT → PROD, real-data gate) |
| **ETG — Register Errands** (89 nodes, hub with two subtrees, persistent Share / Transfer) + **Register Errands - Manager Review** (3 nodes) | `Account Management HQ/ETG (Etraveli)/Register Errands/` — newest `Register Errands (...) <date>.json` and `Register Errands - Manager Review (...)` | `etg-env-promote` (dev ↔ prod), `etg-errand-regression` (business-rule oracle) |

Each tree's own `claude.md` node is the authority on that tree. Read it before this file's
summary of it.

## What each one teaches

### Corpay UK Email AI — the cleanest end-to-end shape

The closest thing to a textbook build. Copy it for any AI Action journey, any Salesforce
case workflow, and for Test Mode.

- **Three trees merged into one** (86 nodes → 48 at the merge). A router that only opened one
  of two child trees became one Scoring node in front of two AI lanes; the duplicated front
  ends and the case re-fetch in the child tree disappeared. `00-etl-design.md` → "Lanes".
- **Shared front end, two lanes, one shared tail.** Fetch case (Data, root) → capture the
  routing field (Script) → account linked? → fetch account → eligibility (Script) → eligible? →
  resolve route (Script, the one map) → route (Scoring) → lane: detect intent (AI) → grade
  intent (Script) → route → generate reply (AI) → build dashboard (Script) → the shared tail:
  review → send path → provider fields → mock? → fetch CC list → prepare request → send →
  grade send → sent?.
- **The map is the scope gate.** Each lane declares its intent → Salesforce Topic / Sub Topic
  map once; a detected intent with no row is out of scope. Adding a use case is one row
  plus its Test Mode scenario — nothing else changes. `00-etl-design.md` → "Catalog maps".
- **AI Actions explain themselves.** The intent Action returns `ai_exception_reason`; the tree
  stages and prints it on the escalation and out-of-scope screens and never infers a reason
  from its own routing. `04-cx-actions-api-requests.md` → "AI Actions".
- **Grading, both kinds.** Connected Object calls graded on `_zt_meta.response.code` 2xx before
  anything is read (send grade node, case-capture node); AI Actions graded on their output
  field (`intent.email_intent !== undefined`). A response that never arrived goes to
  escalation with a reason, never to "no intent matched".
- **The Connected Object owns the request body.** The send CO is a JSON template with one
  merge per value; the prepare-request script stages only what the template reads that nothing
  else produces (the CC list as JSON text, `[]` when empty; the HTML body and subject escaped
  for their quoted slots). Case fields never ride in a request — predefined `sf_*` variables and
  the Salesforce marketplace app write them back. `02-data-and-namespaces.md` → "Connected
  Object request bodies".
- **Agent-filled gaps before the draft.** A reply template with a gap only the agent can fill
  (a unit rate, authorised contact names) gets one native conditional field per gap on one
  screen before generation; the tree replaces the token after generation; a safety-net boolean
  forces the manual-edit screen if a token survives. `00-etl-design.md` → "Agent-filled gaps".
- **Native fields for every input.** The approved-reply choice and the provider picklists are
  native dynamic selects (`list_dynamic_source` → transforms); required Yes/No checks are
  native selects shown by `config.conditional`. The one screen that used `zt-data` checkboxes
  lost its tick boxes on about every other live case.
- **Rendered HTML is always a transform, collapsed to one line.** Every `*_html` block is
  `ZT.setTransformData` + `${transforms.x_html}`; plain scalars printed on a screen stay form
  data.
- **Test Mode as a first-class entry.** Start screen → live, or Test Mode → scenario picker →
  editable example email → seed script (`ZT.setResponseData` per alias, correct `_zt_meta`,
  a mock-scope choice) → rejoins the live graph at the same node the live fetch reaches. Routers
  before each Data node skip it on `mock_downstream == true`. On promote the root moves to the
  first real node and Test Mode ships intact, opened with `#<picker node>`.
  `03-testing-and-mock-data.md` → "Test Mode".
- **Feedback and reporting in native fields.** `score_var` on every dashboard button (the
  clicked button's `button_data` is the report value); thumbs feedback written by tree
  `script_code` into a hidden native text field. Feedback UI never navigates (no
  `do_button_click(<id>)`).
- **Promotion is tooling, not editing.** A manifest of assets per environment, a remap script,
  a check on both ends, a diff that must contain only the remapped categories, and a real-data
  gate. `11-environments-and-promotion.md`.

Not to copy (known deviations, tolerated in the reference, flagged by `lint_tree.py`):
dated comments in the dashboard and intent scripts; the two dashboard scripts sharing most of
their renderer (kept apart on purpose — they read different lane aliases, see its claude.md);
`Array.isArray` in the case-capture script; one terminal screen without a `page_title`; the
Test Mode seed still carrying `totalSize` / `done`; case reads outside the confirmed schema
(`Business_Process__c` casing, `ContactId`, `records[0].Account`) that the real-data gate
reports. Fix these in the source when touched; never reproduce them in a new build.

### ETG Register Errands — the loop, the environment discipline, the multi-agent answer

The richest production tree. Copy its architecture, not every script body — it carries
history the standard has since retired (see "Not to copy").

- **ETL spine with one structure and one loop.** Intake → find order → PNR / passenger /
  channel / type selection → per-PNR customer action table → one stitch-and-group script builds
  `work_queue` (every Zendesk ticket, grand children nested, each entry carrying its errands)
  → **one** ticket loop for child, silent and grand-child tickets (create → settle → get details
  → resolve id → update → more?) → internal note → errand loop → close. The unified loop
  replaced a verbatim clone of the child body for grand children. `00-etl-design.md` → "The
  loop".
- **The walk order is the contract.** Depth-first: a parent is created and resolved before its
  grand children, which is the only reason a grand child can read its parent's id from the
  queue-index map. Per-kind display counters ("Grand Child Ticket 1 of 2") come from the same
  walk.
- **Environment fields in three places, one id each.** The seed script reads each org-specific
  `custom_field_<id>` once and writes a snake_case name; a write-back script after the intake
  screen writes the agent's changes to that one id (non-empty only); `predefined_vars` declares
  them. Nothing else names a `custom_field_`. Promote/demote touches exactly those three.
  `11-environments-and-promotion.md`.
- **One catalogue, seeded in the root.** The contact-reason catalogue (Zendesk value, agent
  label, Edvin category, agent group) is declared once in the seed script, stored as a JSON
  string in form data (crosses into subtrees, no TTL), and the dynamic-select transform is
  *derived* from it with `filter`/`map`, never retyped. It replaced four drifted copies.
- **The API receipt — the one sanctioned "log".** An append-only `api_trail` form variable
  gets one line at each call site (alias + subject, and the result where a script reads it);
  one renderer grades each entry from `actions[alias]._zt_meta` and prints failures-first /
  completed cards at the end of the run and on the failure path. Agent-visible, no debug flag.
  `04-cx-actions-api-requests.md` → "The API receipt".
- **Exact aliases everywhere.** When the Zendesk calls moved onto proxy Connected Objects, every
  place that *named* a request (retry and failure routers, the receipt, the step catalogue,
  failure screens) had to move with it — including an alias Zingtree truncated at its length
  limit, which is then the alias.
- **Multi-agent safety without a lock.** The Zendesk app binds one session to a ticket and
  Zingtree has no read-only mode, so a second person in the session duplicates API calls. The
  answer shipped as persistent buttons: **Share with Manager** builds a snapshot and a link to a
  separate read-only tree (no Data nodes, opened on a new session id, every value a `zv_`
  param); **Transfer Ticket** posts a handover note, ends the session for the sender, and the
  receiver resumes from a `workflow_stage` marker through one resume router. `00-etl-design.md`
  → "Read-only share tree" and "Persistent buttons and resume".
- **Merge fields never inside attributes.** Zingtree wraps merge output in a `<span>`, so
  `href="${url}"` became `href="<span ...`. The script builds the whole `<a>` tag and the screen
  merges it once.
- **Orphan / no-data paths are one bridge node.** Unconfirmed bookings and orphan errands build
  one synthetic item in a single bridge script and then run the exact normal path from there;
  the path kind is *derived* from the data (no reference → orphan), never set by a flag node.
- **Re-entry is expected.** Back with `keep_vars_on_back = 1` re-fires the grouping script and
  everything after it; the tree accepts a visible duplicate over a silent guard, and the fix
  for real duplicates is upstream (hide Back where it replays writes), not a key list.
- **Wait for Zendesk with a Content node** (`escalate_after` 3 s) between create and fetch,
  never a poll.

Not to copy (production baseline or history the standard supersedes): a status-check Scoring
node after every Data node feeding a shared failure script and a screen router (the baseline
Brent kept for this tree — new builds grade in the consuming script, `04`); loop state held in
transforms (1-hour TTL — the Transfer pick-up has an "expired" branch because of it; new
builds keep loop state in form data); the duplicated receipt renderer in the end-of-run and
failure scripts (the one duplicate the tree allows, documented in its claude.md); the
`orderReference` camelCase mirror kept for a CO body; the inert whole-payload builder in the
errand-register script (the CO still uses its per-field template); `var`, `try`, `parseInt`,
`||` fallback chains and a literal UUID in the errand-register script; empty `node_name`s;
id gaps; an unreachable Content node titled with an expression; the "Is More PNR's?" router
saved with `advanced_logic_node = "0"`; and a Zendesk API token written into the seed script
(a credential in a tree export — rotate it and move auth to the Data Source). `lint_tree.py`
reports every one of these.

### ETG Register Errands - Manager Review — the smallest correct tree

Script root (builds one `manager_one_pager_html` transform from inbound `zv_` params) →
Content (renders it, print / save-as-PDF) → `claude.md`. Hard rule in its claude.md: **no Data
nodes, ever** — its safety is that nothing in it can write anywhere. Values arrive by bare name
(Zingtree strips `zv_`), JSON-string params are parsed at the read, the link stays under
~8,000 characters (notes cut to 200 characters per item). Adding a field is one param in the
sender's snapshot script plus one render line here.

## Verification status (as of the Sep 2026 refresh)

| Check | Corpay UK INT | ETG Register Errands |
|---|---|---|
| `lint_tree.py` | 0 errors (`--entry 1` for the Start / Test Mode screen) | 2 errors: node 83 `advanced_logic_node`, credential in the seed script |
| `walk.mjs` | Homecharge Payment Query / underpayment fixture passes from root 2 to "Email sent"; Test Mode path walks from `--start 44` | use `etg-errand-regression` (Dynamic View inputs, grouping oracle) |
| `response_contract.py` | 3 findings: `Business_Process__c` casing, `ContactId`, `records[0].Account` | no contract on file |

Re-run these after every edit to either tree and update this table when a finding closes.

## Older masters (Jul 2026) — still worth opening for their shapes

Three earlier reference trees predate the two gold standards. The rules were rewritten against
the gold standards, so where an older master disagrees, the newer rule wins; open these for the
shapes they show, not for their scripts. All live in Brent's workspace. (restored Oct 2026 from the retired zingtree-builder repo)

| Older master | Where | What it shows | Caveats |
|---|---|---|---|
| ETG Cancellation Errand (tree 139367450) | `Zingtree Builder/Workflow JSONs/ETG/`, scripts in `Script Library/Master - ETG Cancellation Errand/` | The single-tree loop before Register Errands: cursor loops, dynamic-HTML screens, bucket → map → loop ticket creation | Superseded by Register Errands for every rule |
| Returns Multi-Tree (SFDC, 5 trees) | `Workflow JSONs/Returns Redesign (SFDC)/`, scripts in `Script Library/Master - Returns Multi-Tree (SFDC)/` | Hub-and-spoke by *data attribute*: the hub fetches once and buckets, Tree nodes dispatch one subtree per bucket, `return_tree_node_id` hands back; subtree roots are guards | Pre-dates the lanes pattern; read `00-etl-design.md` → "Lanes" first |
| ETG Rebooking Multi-Tree (15 trees, hub 359750132) | `Workflow JSONs/ETG/Rebooking Multi-Tree (master).json`, README in `Script Library/Master - ETG Rebooking Multi-Tree/` | Hub-and-spoke by *agent-chosen handling type*; a globally attached Persistent Buttons subtree; the richest data structures | No `claude.md` node, dev versions, generic titles — a reference, not gospel |

The Experian joint-accounts set (`Script Library/experian-joint-accounts-build-options.js`,
`-native-select-field.json`, `-readback-native.js`) is the proven native dynamic select,
start to finish.

## Registering a new reference build

When Brent names another build as a reference (usually through `analyze-workflow-session`):
add a section here — what it teaches, with node numbers; what not to copy; where it lives;
its companion skills — and a row in the verification table. Keep the rules themselves in
`00`–`09`; this file points at examples of them.
