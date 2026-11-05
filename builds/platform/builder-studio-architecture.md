# Builder Studio — Architecture Plan

**Exposing the Zingtree Workflow Builder to the internal team, with Brent as the single source of truth.**

Author: Dudley (chief of staff) for Brent Thomas · 2026-08-03 · **Draft 2** · Internal / Confidential

*Draft 2 changes: no Zingtree authoring API is coming — Tier 3 live testing is cut and the simulation tier is promoted to the answer (§8). Audience fixed at seven named people, which shrinks the infrastructure and the governance machinery (§5.1, §7.2, §10). Front door is greenfield — no existing internal app to mount inside (§6). Data sign-off is Brent's (§9). And the biggest correction: **the validator and regression harness already exist**, in `etg-errand-regression` — Phase 0 is generalizing working code, not writing it (§3, §8, §11).*

---

## 1. The recommendation in one box

Build **Builder Studio**: a standalone Next.js app on Vercel with Google Workspace SSO, backed by Supabase (Postgres + Storage + Realtime), where every build runs as a queued job inside an **ephemeral Modal container running the Claude Agent SDK headlessly**. Scale it for what it actually is — **seven people** (you, Guillaume, Vebhav, Debby, Charchit, Monica, Adib), on the order of tens of builds a month, all of them trusted internal colleagues. That's small enough that the interesting risk isn't load or abuse; it's whether anyone uses it instead of Slacking you. The container image bakes in a *versioned corpus* — the builder skill plus the knowledge it actually depends on — so the image tag **is** the version of "how the builder operates." Teammates upload tree JSONs and a prompt, watch a live trace, and download a versioned, statically-verified JSON. Change proposals go into an in-app queue where Claude turns each one into a concrete diff against the corpus plus a regression case; Brent approves in the UI; the merge triggers a new corpus version and a regression run.

Ship the core in four phases (0 through 3) over roughly seven focused weeks; the clickable preview and the session-replay loop (Phase 4) are open-ended and start after. And ship a **zero-infrastructure private plugin marketplace in week one** so the team has the builder in their hands while the app is still being written.

Four things to internalize before reading further:

1. **The skill is not the asset. The corpus is.** Handing out `zingtree-workflow-builder.skill` gets people maybe 40% of your quality. (§3)
2. **You have already built the hard part of the testing story.** `etg-errand-regression` is a working static validator, a Zingtree script-node engine, a generated case matrix, and — the part most people never build — an oracle written from business rules and deliberately kept separate from the code being graded. It's ETG-specific and it lives outside the workspace. Generalizing it is Phase 0's centerpiece. (§8)
3. **The regression suite is the load-bearing piece of the governance model**, not the approval queue. Without it, `patterns.md` accretes into 200KB of contradictory rules and quality decays invisibly. (§7)
4. **There is no Zingtree authoring API and there won't be one.** So "test the actual build in the UI" means simulation — permanently, by design, not as a stopgap. The good news is that your harness already runs *the tree's own node bodies* rather than a reimplementation, which is what makes simulation trustworthy. (§8)

---

## 2. What you actually asked for, restated as four separate problems

You described one product. It's four problems, and conflating them is the most common way this kind of project stalls.

| # | Problem | Hardest part | Can it ship alone? |
|---|---|---|---|
| **A. Distribution** | Get the builder's knowledge into teammates' hands | The knowledge is scattered across your workspace, not inside the skill | **Yes — days, not weeks** |
| **B. Governance** | One source of truth; proposals flow to you; you approve | Preventing knowledge rot as N people contribute | Yes, but only meaningful once A exists |
| **C. Execution** | A hosted runtime that builds on demand for people without your workspace | Long-running jobs, corpus versioning, cost control | Needs A first |
| **D. Verification** | Prove the build is good before someone imports it | No authoring/preview API, ever — so simulation is the ceiling | **Yes, and it's furthest along** — working code exists |

Sequencing: **A → D → C → B.** Distribution first because it's nearly free and it validates demand. **Verification second, not last** — that's a change from Draft 1, because the code mostly exists and because a validator improves your own sessions the day it lands, with or without an app. Execution third, since it's the biggest build. Governance last: a suggestion queue with no users is theater, and with seven users you can run governance out of a shared doc for a while.

---

## 3. The finding that changes the plan

I inventoried what the builder skill actually reaches for at runtime:

| Dependency | Size | In the `.skill` package? |
|---|---|---|
| `.claude/skills/zingtree-workflow-builder/SKILL.md` | 11 KB | ✅ |
| `references/` (7 files, incl. `patterns.md` at 36 KB) | 77 KB | ✅ |
| `Zingtree Builder/MEMORY.md` — house patterns, gotchas, prior decisions | **59 KB** | ❌ |
| `Zingtree Builder/Script Library/` — ~50 proven production scripts | ~large | ❌ |
| `Account Management HQ/{Account}/CLAUDE.md` + `MEMORY.md` | 1–80 KB each | ❌ |
| `Zingtree Builder/Requirements/{Account}/…` — the spec a build is judged against | up to 56 KB | ❌ |
| `Zingtree Builder/Workflow JSONs/{Account}/` — 75+ versioned exports as precedent | ~MBs | ❌ |
| `cos-workflow-factory`, `cos-build-verification`, Wes's and Mira's agent definitions | ~25 KB | ❌ |
| **`etg-errand-regression`** — validator, engine, oracle, case runner, defect ledger | **50 KB of working code** | ❌ — *and it isn't even in the workspace* |

Your own SKILL.md tells the model to read `Zingtree Builder/MEMORY.md` before building, and to check the Script Library for reusable production scripts before writing anything from scratch. Neither travels with the packaged skill. There's also a mirrored copy at `Zingtree Builder/Skill Source/` kept in sync **by hand** — your MEMORY.md notes that a `patterns.md` change requires re-packaging the skill to take effect. That's a drift generator, and it will bite worse with an audience.

And note the third location the corpus is scattered across: `etg-errand-regression` lives in your **claude.ai account skills**, not in the workspace and not in the builder skill. It's the most operationally valuable code you have — a real validator plus a real engine — and right now it's reachable only from sessions where your account skills are synced, versioned by nothing, and invisible to anyone else. Bringing it into the repo is not tidying; it's the difference between the app having a testing story and not having one.

**So Phase 0 is not "set up hosting." Phase 0 is closing the skill** — turning a workspace-shaped body of knowledge into a self-contained, versioned artifact, with the harness pulled in alongside it. Call it two weeks of mostly unglamorous consolidation, and everything else depends on it. If you only do one thing from this plan, do this one; it improves your *own* sessions immediately, independent of any app.

### Phase 0 deliverable: the `zingtree-builder-corpus` repo

A single private GitHub repo, Brent as sole `CODEOWNER`:

```
zingtree-builder-corpus/
├── .claude-plugin/plugin.json          # so it installs as a plugin
├── skills/
│   ├── zingtree-workflow-builder/      # SKILL.md + references/ (the one true copy)
│   ├── cos-workflow-factory/
│   ├── cos-build-verification/
│   └── cos-requirements/
├── knowledge/
│   ├── house-patterns.md               # from Zingtree Builder/MEMORY.md, de-personalized
│   ├── script-library/                 # the ~50 proven scripts, indexed
│   └── precedents/                     # a curated ~15 exemplar tree JSONs, NOT all 75
├── harness/                            # §8 — generalized out of etg-errand-regression
│   ├── validate/                       #   ← validate_tree.js, made tree-agnostic
│   ├── engine/                         #   ← engine.js: ZT shims, <select> parser
│   ├── run.mjs                         #   ← run_full.js, config-driven
│   └── trees/{tree-slug}/              #   per-tree: oracle.js + config.json + cases
├── regression/                         # §7 — corpus-level, distinct from per-tree
│   ├── cases/{case-id}/{input, prompt, expectations.yaml}
│   └── run.mjs
├── agents/                             # wes.md, mira.md — behavior, model tiering
├── CHANGELOG.md                        # every approved change, dated, with rationale
└── VERSION                             # semver; the app pins this
```

Three rules that make this durable:

- **One copy.** Delete `Zingtree Builder/Skill Source/` and the packaged `.skill` from the workspace; symlink or git-submodule the repo into your local `.claude/skills/` so your sessions and the app read literally the same bytes. No more manual re-packaging.
- **De-personalize on the way in.** Strip anything keyed to `brent@zingtree.com`, `America/Denver`, your Chrome profile, your Gmail. Account-specific context becomes a *parameter* the app supplies, not a hardcoded path.
- **Sanitize precedents.** Those 75 tree exports include customer configuration and, in places, realistic test data. Curate ~15 exemplars, scrub them, and ship only those. The rest stay in your workspace. (See §9 — this is the confidentiality boundary of the whole project.)
- **Pull the harness in and split it.** `etg-errand-regression` currently fuses three things: generic Zingtree machinery (the validator, the ZT shims, the `<select>` parser), ETG-specific truth (`oracle.js`, `config.assumed.json`, the tracker layout), and an attended browser procedure. Separate them. The generic half becomes `harness/` and serves every tree; the ETG half becomes `harness/trees/etg-register-errands/`; the browser procedure stays a skill and stays yours. Keep the discipline the skill already states — *"the whole value of the harness is that the answer key was not written by the code being graded"* — as a written rule in the repo, because it's the thing a well-meaning contributor will break first.

---

## 4. Track A — Distribution, shippable this week

The corpus repo doubles as a **Claude Code / Cowork plugin** distributed through a private marketplace. Add a `marketplace.json`, and teammates run:

```
/plugin marketplace add https://github.com/zingtree/zingtree-builder-corpus
/plugin install zingtree-builder@zingtree
/plugin marketplace update      # pulls your latest approved version
```

Cost: zero. Infrastructure: zero. Governance: GitHub's, with you as sole CODEOWNER. And critically, **it's the same artifact the app consumes**, so the work isn't throwaway.

Two caveats, both honest:

- The docs are **silent** on how private-repo plugin installation behaves specifically for Cowork/desktop users. Test with one teammate — Guillaume — before you announce it. If it doesn't work for desktop users, the app path becomes the only path and Phase 1 gets more urgent.
- Anyone who installs the plugin can also read and locally edit it. The plugin gives you a *source of truth*, not enforcement. Enforcement — "the only sanctioned way to produce a build is the app" — arrives with Track B. Frame Track A internally as "the current build kit," not "the governed system."

---

## 5. Track B — Builder Studio, the application

### 5.1 Stack

| Layer | Choice | Why this and not the obvious alternative |
|---|---|---|
| Frontend + BFF | **Next.js on Vercel**, standalone | Greenfield — there's no existing internal tools app to mount inside. But you already have a Next.js 15 app in the workspace: `Zing - BT/` ("zing-studio"), with skills, knowledge, guardrails and connections pages scaffolded and vitest/eslint/tsc wired up. Start there; it saves a week of shell-building. |
| Auth | **Google Workspace SSO, `@zingtree.com` only** (Auth.js or Clerk) | Seven known people. You need identity for attribution and per-user budgets, not a permission matrix — resist building roles you don't need yet. Hosted-domain restriction is one config line. ⚠️ *Auth code gets a second pair of eyes before it ships — see §9.* |
| Data + files + realtime | **Supabase** (Postgres, Storage, Realtime) | One vendor for three needs. Row-level security gives you per-account tenancy cheaply. Neon + S3 + Pusher is three bills and three failure modes. |
| Job queue | **Postgres `jobs` table + worker poll** | Don't reach for SQS/Temporal at this scale. A table with `status`, `attempts`, `locked_at` handles tens of builds a month with room to spare, and you can read it with SQL when something breaks. |
| Account assignment | **A `user_accounts` table you maintain** | With seven trusted colleagues this is for *attribution and context selection* — which account's CLAUDE.md and MEMORY.md a job loads — not for keeping people out. It also scopes RLS. One admin-maintained table; no roles hierarchy, no Salesforce sync. |
| Build runtime | **Claude Agent SDK, headless, in an ephemeral Modal container** | ⚠️ Builds run 5–20+ minutes. That's fatal to Vercel serverless functions. Modal (or Fly Machines) gives per-job containers, sub-second cold starts, and pay-per-second. This is the one place you must not cut corners. |
| Model access | **Anthropic API key** (Claude Platform), not subscription OAuth | Anthropic's own guidance: subscription credits are sized for individual experimentation; shared production automation should use an API key for predictable pay-as-you-go billing. |
| Testing | **Your existing harness, generalized** — validator + real-node-body simulation | No live import path exists, so this *is* the testing story, not a placeholder for one. See §8. |

### 5.2 Request lifecycle

```
Teammate                Next.js / Vercel          Supabase              Modal container
   │                          │                      │                        │
   ├─ upload JSONs + prompt ─▶│                      │                        │
   │                          ├─ files → Storage ───▶│                        │
   │                          ├─ INSERT job(queued) ─▶│                        │
   │                          │                      │◀── worker claims ──────┤
   │◀── job page, subscribed ─┤                      │                        │
   │      to Realtime         │                      │   ┌────────────────────┴────┐
   │                          │                      │   │ /work/{jobId}           │
   │◀═══ live trace ══════════╪══════════════════════╪═══│  + /corpus @ v1.4.2 (ro)│
   │     (phase labels)       │                      │   │  Agent SDK, maxTurns    │
   │                          │                      │   └────────────────────┬────┘
   │                          │                      │                        │
   │◀── EDIT LIST: confirm? ──┤◀─── job(awaiting) ───┤◀─── pause at the gate ─┤
   ├─ confirm ───────────────▶│──── job(resumed) ────▶│─── resume(sessionId) ─▶│
   │                          │                      │                        │
   │                          │                      │◀─ artifact + Stage A ──┤
   │◀── diff view + download ─┤                      │                        │
   │      (signed URL)        │                      │                        │
```

Notes that matter:

- **Stream phase labels, not raw tool output.** A teammate watching `Read(patterns.md)` learns nothing and may see internals you'd rather keep tidy. Map SDK messages to five or six human phases: *reading your tree → checking house patterns → drafting the edit list → building → verifying → done.* This is a small mapping layer and it's the difference between the app feeling professional and feeling like a debug console.
- **Resume, don't restart.** The SDK's `resume: sessionId` with a session store (Supabase or S3) is what makes the human confirmation gate cheap — the container can die while waiting and rehydrate on confirm. Note the documented limit: **transcripts** are mirrored; working-directory artifacts are not. Snapshot `/work/{jobId}` to Storage at the pause.
- **Bound every job.** No top-level timeout exists in the SDK, so set `maxTurns`, a wall-clock kill, and a token ceiling per job. A runaway build with a 3MB tree JSON (you have one — Penrose at 3.0MB) is a real bill.

### 5.3 Agent SDK worker configuration — the specifics

```js
// worker/build.mjs — the shape, not final code
const result = query({
  prompt: renderJobPrompt(job),          // §5.4
  options: {
    cwd: `/work/${job.id}`,              // per-job isolation
    settingSources: [],                  // ← no ambient user/project settings leak in
    plugins: [{ type: "local", path: "/corpus" }],   // pinned, read-only mount
    skills: ["zingtree-workflow-builder", "cos-workflow-factory",
             "cos-build-verification"],  // explicit allowlist
    allowedTools: ["Read", "Write", "Edit", "Glob", "Grep", "Bash"],
    model: "claude-sonnet-4-5",          // matches your tiering: Wes = sonnet/high
    permissionMode: "default",           // the allowlist above is what denies; see note
    maxTurns: 120,
    resume: job.session_id ?? undefined,
  },
});
```

Confirm exact `permissionMode` enum values against current SDK docs at implementation time — the denial behavior you want comes from `allowedTools` being an explicit allowlist, not from a special mode, and you do *not* want a permissive mode here.

Plus, at the container level:

- `CLAUDE_CODE_DISABLE_AUTO_MEMORY=1` and a per-job `CLAUDE_CONFIG_DIR` — the documented pattern for preventing cross-tenant leakage. You have 13 customer accounts in one workspace; job A must not be able to read job B's tree.
- Corpus mounted **read-only** (`/corpus:ro`). Writable space is `/work/{jobId}` on a tmpfs with `noexec,nosuid`.
- `--cap-drop ALL`, `--security-opt no-new-privileges`. Egress restricted to `api.anthropic.com` only — the builder skill makes no outbound calls of its own, so a locked-down network costs you nothing and removes an exfiltration path for customer tree JSONs.
- `Bash` is on the allowlist because your own tooling needs it (`build_master_tree.py`, `verify_master_tree.js`, `remap-fields.js`). With no network and no egress, that's an acceptable trade. Revisit if you ever loosen egress.

### 5.4 Corpus versioning — the idea that makes this reproducible

**The container image tag is the corpus version.**

```
zingtree-builder-corpus @ git tag v1.4.2
        │  (GitHub Action on tag)
        ▼
ghcr.io/zingtree/builder-worker:v1.4.2      ← immutable
        │
        ▼
every job row stores corpus_version = "v1.4.2"
```

Which buys you, nearly for free:

- **Reproducibility.** "This build came out wrong" → you know exactly which corpus produced it and can re-run it against a newer one.
- **Rollback in one revert.** A bad `patterns.md` change is `git revert` + retag, not archaeology.
- **A real changelog.** Every approved change is a commit with your rationale attached. That *is* the audit trail Guillaume will eventually ask for.
- **Honest A/B.** Run the regression suite against v1.4.2 and v1.5.0 and see what moved.

### 5.5 The four job types

| Job | Input | What runs | Output | Gate |
|---|---|---|---|---|
| **`build`** | 0–n reference JSONs + prompt | **requirements doc (written first, Mira's lane)** → edit list → builder → Stage A | requirements doc + new tree JSON + verification report | doc reaches `Ready for build` with zero blocking questions; then edit list confirmed |
| **`edit`** | base tree JSON + prompt | **numbered CR appended to the tree's existing doc** → edit list → builder → Stage A | CR + new JSON + **node-level diff vs. base** | same |
| **`intake`** | transcript / Spiky meeting ID / pasted notes | `cos-call-review` + `cos-requirements` lanes | a requirements doc **and a pre-filled build request** — *never* an automatic build | none needed; it writes no tree |
| **`verify`** | any artifact (+ optional requirements doc) | Stage A only | pass/fail report with path table | none |

**No build without a requirements doc — including from the app.** Your CLAUDE.md is categorical: *"A build with no written requirement has nothing to be judged against,"* requirements live in exactly one doc per workflow at `Requirements/{Account}/{tree-slug}-requirements.md`, and only Mira writes them. Don't let the app invent a lighter-weight path. A `build` job's *first* step is producing a real doc under that path (tagged `[app-generated]`, attributed to Mira's lane); an `edit` job appends a numbered CR to the existing doc rather than creating a second file. If the doc can't reach `Ready for build` because the prompt left blocking questions, the job stops there and hands the requester the questions — which is a genuinely useful outcome, not a failure.

Making `intake` produce a *build request* rather than a build is the same principle from the other direction. Transcript-derived requirements are the highest-ambiguity input in the system; your offline pipeline already refuses to build from them without a `Ready for build` doc and zero blocking questions. Preserve that.

### 5.6 Preserve the gate. This is the part people will want to cut.

Your offline system is trustworthy because of a hard gate: requirements marked *Ready for build*, zero blocking questions, one tree in scope, local JSON present, nothing touching auth / payments / PII. Wes does not build unconfirmed edit lists. That gate is not bureaucracy — it's the reason the output can be trusted by someone who wasn't in the room.

In the app it becomes:

1. Job pauses and renders the **numbered edit list** to the requester, who confirms it.

   Be clear-eyed about what that swap costs. Today it isn't you confirming routine edit lists — it's *Dudley*, on your behalf, holding the result to house standards before it reaches you. A teammate confirming their own edit list is not equivalent to either of those; it's a lower trust bar, because the confirming human is the one who wrote the ask rather than the one who knows the house patterns. Two ways to close some of that gap, and you want at least one: run the edit list through the Layer 1 validator's rule set *before* the requester ever sees it (mechanical house-pattern lint, cheap), and have the finished build's verification report include an explicit "deviations from house patterns" section that the requester has to acknowledge. Neither replaces Dudley. Don't describe them as if they do.
2. **Auto-park to Brent's queue, never auto-build**, if the job trips any carve-out: anything touching **auth, payments, or PII handling**; more than one tree in scope; requirements with unresolved blocking questions; or — the one worth adding now — **a tree that has a per-tree oracle whose regression run fails.** For a tree like ETG's register-errands, where a wrong outcome writes a false fact against a customer's order, a failing oracle should stop the job dead rather than hand someone a downloadable JSON with a red badge next to it. An account mismatch is worth *flagging* on the job, but with seven trusted colleagues it shouldn't block.
3. **Nothing publishes.** The app's terminal state is *a file you download*. No live import, no send, no push to a running tree. With no authoring API that's also the only option available — but it would be the right design even if an import endpoint existed, and it's the same boundary your scheduled pipeline already respects.

A parked job shows the requester *why* it parked, which teaches the constraint instead of just blocking them.

---

## 6. Where this lives

Greenfield — there's no internal tools app to mount inside, so Builder Studio is its own deployment with its own SSO. That costs you a few days of auth work you'd otherwise have inherited, and buys you clean ownership and an app that stays independently deployable. Fine trade at this size.

Two consequences worth planning around:

**You are now the internal-tools precedent.** The first internal app at a company tends to become the template for the next three. Spend a little more than feels necessary on the boring parts — SSO, a `users` table, structured logs, a health endpoint, a README someone else could deploy from. Not because Builder Studio needs it, but because "the thing Brent built" will get pointed at as the pattern, and it's cheaper to do that once than to retrofit it.

**Build it so it could be extracted.** The strategic read is that this is a prototype of a Zingtree product feature — self-serve workflow generation is something customers would plausibly pay for, and the dormant `Zing - BT/zing-studio` prototype in your workspace suggests that thought has already occurred to someone. Keep the corpus, the harness, and the job runner as libraries with clean boundaries rather than app internals, so the product conversation is a lift-and-shift rather than a rewrite. You're a solutions architect showing what the product could do for customers, using yourself as customer zero — that's a stronger internal story than "I built a tool," and it costs nothing extra if the seams are in the right places from the start.

---

## 7. Governance — the suggestion queue, done so it doesn't rot

You chose: an in-app queue that summarizes asks to you and turns them into proper prompts your builder understands. I'd extend that in one specific way, and the extension is the whole ballgame.

### 7.1 The flow

```
Teammate hits "Propose a change"
    │  free text + optionally: the job that went wrong, the tree, the expected vs. actual
    ▼
`curator` job — Claude, against the current corpus, produces a structured Change Proposal:
    • Intent, in one sentence
    • Classification: pattern rule │ script library addition │ reference doc fix │
                      agent behavior │ new skill │ out of scope
    • Is this already covered? ← kills most duplicates before they reach you
    • The exact unified diff against corpus files
    • ⭐ A REGRESSION CASE: input tree + prompt + expected behavior
    • Blast radius: which existing regression cases could this change
    ▼
Brent's review queue — side-by-side diff, approve / edit-then-approve / reject-with-reason
    ▼
Approve → commit to the corpus repo → CI runs the FULL regression suite
    ▼
Green → tag vNEXT, build image, new jobs pick it up. Red → back to the queue with the failures.
```

**Who owns the curator.** Give it to **Mira's lane at `sonnet`/high** and add a row for it to the tiering table in CLAUDE.md. Rule-change judgment is requirements work, and every other judgment job in your system has a named owner and a pinned model — an unowned job that can propose edits to Wes's own operating rules is exactly the ownership gap your exclusivity rule exists to prevent. Note the one thing the curator may never do: propose a change and merge it. It drafts; you approve; CI merges.

Three design choices worth defending:

**Every proposal must ship a regression case.** No case, no merge. This is the difference between a knowledge base and a landfill. Your `patterns.md` is already 36KB and it's had one careful author; at ten contributors it becomes internally contradictory within a quarter, and you will not notice, because the failure mode is *builds get subtly worse*, not *builds error*. A suite of stored cases — each an input tree, a prompt, and assertions about the output — is the only thing that makes "Brent is the source of truth" survive volume. Seed **5 cases in Phase 0** (enough to prove the harness runs), grow to **15–20 by the end of Phase 2**, then let the queue feed it from there. Your existing requirements docs and their known-good builds are the source: the ETG register-errands lineage alone (18 versions, 56KB of requirements) is a goldmine of "this specific thing must keep working."

**Rejections are data, not deletions.** Keep them with your reasoning. They become the curator's few-shot examples for "here's what Brent turns down and why," and the accept rate climbs on its own.

**Auto-approve exactly one lane.** A *new script added to the Script Library* that nothing else references can't break an existing build — let those through with notification-only, and spot-check monthly. Everything that changes a *rule* (SKILL.md, patterns.md, references/) is yours. This keeps you from becoming the bottleneck on the highest-volume, lowest-risk contribution type.

### 7.2 The bottleneck problem, named out loud

You are deliberately designing yourself into the critical path. That's correct for correctness and wrong for throughput, so put guardrails on it now rather than after the first complaint:

- **A stated SLA** — 48 business hours to a decision. Publish it. Reviewing in batch twice a week beats reviewing continuously.
- **A second reviewer eventually.** Guillaume for non-semantic changes (doc clarity, script library, reference fixes); semantic rules stay yours. Six contributors won't overwhelm you, so this genuinely isn't a v1 problem — but leave a `reviewer` column on the users table so it's a config change rather than a refactor when it becomes one.
- **A visible queue depth metric.** If it trends up for three weeks, the model is failing and you need the second reviewer, not more discipline.
- **A bus-factor note.** Right now this knowledge lives with you and in your workspace. The corpus repo is the first time it's institutional. That's worth saying to Guillaume plainly — it's the strongest business case for spending the eight weeks.

---

## 8. Testing the build — what "test it in the UI" actually means

Two facts frame this section, and together they're better news than Draft 1 assumed.

**Fact one: there is no Zingtree authoring API, and there won't be.** The public API is read-oriented — `get_trees`, `get_tree_structure`, `get_tree_variables`, plus a solid set of session/form/event endpoints — and offers webhooks. No create, import, update, or export; two help articles describe JSON import/export as manual UI actions. You've confirmed internally that this isn't a gap that's going to close. So live import into a scratch tree is off the table permanently, and the app's terminal state is a file a human imports through the Zingtree UI — the same last mile as today.

**Fact two: you already built the thing that makes that acceptable.** `etg-errand-regression` is not a sketch. It is:

| Piece | What it does | Why it matters here |
|---|---|---|
| `validate_tree.js` (7.4 KB) | Every Script body parses, ASCII-only, `ZT.log` arity, every button and continuation target exists, no unreachable nodes, logic nodes carry one expression plus a default, generated HTML isn't `<p>`-wrapped, guard-node placement, reset symmetry between nodes 10 and 29. Non-zero exit means don't import. | This is a real static validator. Most of it is already tree-agnostic. |
| `engine.js` (3.1 KB) | Zingtree script-node shims plus a `<select>` parser, faithful on the two details that bite: `ZT.getVariableValue` sees form/session variables only, and `transforms` is a snapshot taken when the script starts. | This is the semantics layer — the part I wrongly assumed would need writing. |
| `run_full.js` (19.7 KB) | Generates the case matrix, **executes the real node bodies out of the export**, parses the `<select>`s node 12 rendered and posts values back the way a browser would, writes `results-full.csv` and `summary-full.md`. | Tests the field-naming contract between nodes rather than assuming it. |
| `oracle.js` (3.0 KB) | Expected outcomes, written from the business rules — R1 through R5, sourced from the `claude.md` grouping contract, the tracker matrix, and Olga's call notes. | The answer key, deliberately not written by the code being graded. |
| `references/known-defects.md` | A defect ledger. | Institutional memory about failure modes. |

The design choice that makes all of this trustworthy is worth stating plainly, because it's the opposite of what most people build: **you don't reimplement Zingtree's logic, you run the tree's own JavaScript in a shimmed sandbox.** That collapses the usual "my simulator drifts from the real engine" risk down to a much smaller surface — *are the shims faithful?* — which is a handful of well-understood behaviors rather than an ever-growing reimplementation. With no live-import oracle available, this is the single most important property the testing story has, and you already have it.

So the plan isn't "build a validator." It's **generalize a working one**, in three layers.

### Layer 1 — Universal static validation. Every job, every tree, free.

Lift `validate_tree.js` into `harness/validate/`, tree-agnostic, no ETG assumptions. It runs on every job's output, takes seconds, costs nothing, and is deterministic. Add to what's already there:

- Variable and namespace resolution — every `getVariableValue` / `setTransformData` reference resolves to something set on at least one path that reaches it
- CX Action config sanity — endpoint present, auth type set, response mapping targets exist
- Full path enumeration → a table of path × outcome × variables-set, combinatorial explosion capped and the cap *reported*
- Node-level diff against the input tree

In the UI this is a pass/fail panel plus the path table, and it gates the download button — with an override that records who overrode and why. Ship this in Phase 1, not Phase 2: it's the cheapest quality win available and it works in your own local sessions the day it exists, app or no app.

### Layer 2 — Behavioral simulation against a per-tree oracle. The real answer to "test the build."

This is `run_full.js` generalized: shared engine, shared runner, per-tree oracle and config under `harness/trees/{tree-slug}/`. A tree with an oracle gets its whole case matrix re-run on every build, with a FAIL table in the UI and — as the ETG skill already prescribes — *invalid-run* failures surfaced above count mismatches, because recording a wrong fact against a customer's order is a different severity than getting a number wrong.

The constraint to be honest about: **an oracle can't be generated, only written.** It encodes what the business rules say *should* happen, independently of the code. That's precisely why it catches things. Which produces the most important structural insight in this plan:

> **The requirements doc is the oracle spec.** §5.5 requires every build to have a requirements doc because a build needs something to be judged against. That same document is what a human reads to write `oracle.js`. So "no build without a requirements doc" and "no behavioral testing without an oracle" are the same rule, seen from two ends — and the app should make that visible: when a tree has a requirements doc but no oracle, say so, and offer to scaffold one from the doc for a human to complete.

Practically, for seven users: expect two or three trees to earn an oracle in the first year — ETG's register-errands already has one, and the highest-traffic Quest and Corpay flows are the likely next. Everything else gets Layer 1 only, and that's a legitimate answer, provided the UI says which layer ran rather than showing a generic green check.

### Layer 3 — Clickable preview. Nice, and now much cheaper than I thought.

Because `engine.js` already executes node bodies and parses rendered HTML, a click-through preview is largely a *rendering and state-inspection shell* around machinery you have: walk the tree, render the agent-facing screen, evaluate logic nodes, run script nodes through the existing shims, show variables mutating in a side panel. Label it "Simulated" without apology. It's how someone who didn't author a flow builds confidence in it before importing, and for non-technical teammates it's probably the single most persuasive feature in the app.

Do it after Layers 1 and 2 are earning their keep. And keep treating shim divergences as the highest-priority bug class — they're the one thing that can turn simulation into false confidence.

### The one true oracle still available to you: production sessions

You can't test *before* import, but Zingtree's read APIs are well documented for what happens *after*: `get_session_data`, `get_session_data_pure`, `tree_sessions`, `agent_sessions`, `event_log`, `get_form_data` — with the docs explicitly framing them for post-session batch use, which is exactly this. Per-org admin-issued API key, 6,000 calls/day.

That gives you a genuinely valuable loop, and it's the best available substitute for the sandbox import you can't have:

```
real agent sessions on a live tree
        │  (get_session_data / event_log, nightly batch)
        ▼
replay each recorded session's inputs through harness/engine
        ▼
does the harness reproduce the path and outcomes the live tree produced?
        │
        ├── yes  → the shims are faithful; simulation confidence goes up
        └── no   → a shim divergence, found by reality rather than by guessing
```

This is the mechanism that keeps Layers 2 and 3 honest over time without an authoring API. It's also a nice second-order win: the same session data tells you which paths agents actually take, which is what should drive where you invest oracle-writing effort. Worth building in Phase 4 — after the app is real, but don't lose the idea, because it's the only external check the system will ever have.

### What about browser automation?

Your ETG skill already does attended live testing this way — Chrome MCP tools driving the Zingtree panel on a sandbox Zendesk ticket, reading the child-ticket counts off the internal note, logging to the tracker. That's the right shape for *you*, on a tree that matters, when it matters. Don't productize it: it needs your session, it breaks on UI changes, and automating it for seven people means storing service-account credentials and pretending brittle is reliable. Keep it a skill, keep it attended, keep it yours.

## 9. Security, data, and what needs a second pair of eyes

**The confidentiality boundary is the thing to get right.** Customer tree JSONs contain workflow logic, endpoint configuration, credential *references*, and in places realistic test data. Today they live on your laptop. This project moves them to a third-party PaaS and a third-party sandbox provider. That's a legitimate change in data posture and it needs to be a deliberate decision, not a side effect:

- **You own the sign-off — so write the decision down.** That's genuinely simpler than routing it through someone else, and it removes a calendar dependency from the critical path. But a decision only you remember isn't a decision anyone can audit later, and this is exactly the kind of call that gets questioned after something goes wrong rather than before. One page in the repo: which vendors touch customer tree JSONs, what data classes are in scope, the retention window, and who approved it (you, dated). Ten minutes now, and it's the artifact that makes this defensible.
- **The healthcare accounts are the live question.** Quest, Penrose Health, Ivy Rehab, and Corpay Healthcare Provider Support are healthcare-adjacent, and this plan does not establish BAA availability for Vercel, Supabase, or Modal. On the Anthropic side, the Managed Agents beta docs indicate it is *not* currently ZDR or HIPAA-BAA eligible — verify directly rather than taking it from this document, since that status changes. Self-hosting the Agent SDK sidesteps that specific gap but relocates the question to your three PaaS vendors rather than closing it. Confirm before any healthcare-account tree goes near the system. If BAAs are a problem, the clean fallback is a tenancy rule: healthcare accounts stay on your local workflow, everything else uses the app. Worth deciding deliberately rather than discovering — you know Zingtree's customer commitments better than any doc I can read.
- Row-level security scoped by account. Job A cannot read job B's uploads. Enforce in Postgres RLS *and* by per-job container isolation — belt and braces, because this is the failure that would actually hurt.
- A retention policy with a number in it. Uploaded tree JSONs and generated artifacts purge after N days (30 is defensible) unless pinned. Unbounded retention of customer configuration is the kind of thing that reads badly later.
- Redaction on intake. Transcripts are the highest-PII input in the system. Strip emails, phone numbers, and account identifiers before they enter a prompt or get stored.

**Get a second pair of eyes on the auth surface before it ships.** Specifically: the SSO/session implementation and the hosted-domain restriction; the RLS policies; the signed-URL download path; and secrets handling for the Anthropic API key. None of it is exotic — all of it is the category where a solo-built mistake is expensive and silent. You're building alone here, so "review" means asking someone at Zingtree who does auth work to spend thirty minutes on those four things, not a formal process. Guillaume is the obvious first ask. Do it once, before the first non-Brent user logs in.

**Two things found in the workspace that need attention independent of this project:**

- `guidecx_logger/CLAUDE.md` documents a previously-used GuideCX API token as **compromised**, with an instruction to confirm rotation before running the tool again. If that rotation hasn't been confirmed, do it now. If the token was ever committed to a git history in the workspace, rotation alone isn't enough.
- Your post-call pipeline notes explicitly warn that **Spiky's `owners` filter leaks other people's calls.** In your single-user workspace that's a nuisance; in a multi-user app it's a data leak with your name on it. If the app touches Spiky, it must fetch by explicit meeting ID that the requester supplies — never "list my meetings" — and it must verify the requester was an attendee before returning a transcript. Treat this as a hard requirement on the `intake` job.

**Deliberately out of scope for v1**, per your answer: per-user Gmail and Calendar OAuth. That's the right call — it's the largest security surface in the original vision and the smallest share of the value. The `intake` job takes an uploaded transcript or an explicit Spiky meeting ID and stops there.

---

## 10. Cost

At seven users this is cheap enough that cost is a footnote rather than a constraint — but instrument it anyway, because the *shape* of the spend is what tells you whether the thing is being used.

**Fixed, monthly:** Vercel Pro ~$20, Supabase Pro ~$25, Modal compute in the single-to-low-double digits at tens of builds a month, GitHub private repo $0 on existing seats. Call it **$50–75/month**. You could start on free tiers for everything but Modal and still be fine; upgrade when a limit actually bites.

**Variable — the model, and the only line that can surprise you.** Rough shape per build: the corpus is ~150–250KB of context (≈40–70k tokens), a large tree JSON is another ~35k (your ETG v18 is 132KB; Penrose is 3.0MB and needs chunking, not a single prompt), and a multi-turn build with verification lands somewhere in the low hundreds of thousands to ~1M input tokens with 30–80k output. At Sonnet-class pricing that's **low single-digit dollars per build**, but treat that as a shape, not a quote — [check current pricing](https://platform.claude.com/docs/en/about-claude/pricing) before you promise anyone a budget number.

Three levers, in order of impact:

1. **Prompt-cache the fixed prefix.** SKILL.md plus whatever reference files every job deterministically reads first are identical at a given corpus version — cache those. Be careful not to overclaim here: the worker reads the corpus through `Read`/`Glob`/`Grep` on demand rather than stuffing the whole repo into the initial prompt, so if the read *set* varies job to job, the cacheable prefix is much shorter than "the corpus" and the savings shrink accordingly. Measure the real cache-hit rate on the first fifty jobs before treating this as the biggest lever.
2. **Sonnet, not Opus.** Your tiering pins Wes to `sonnet`/high because Zingtree semantics are exacting and technical; separately, it reasons that *no* agent needs Opus because the Stage A/B verification plus approval chain is the real safety net rather than model tier. Both point the same direction here, and it's a multiple on cost.
3. **Hard per-job ceilings**, plus a per-user monthly budget visible in the UI. Seven people is not a runaway-spend risk the way twenty would be, but a single unbounded agent run on the 3MB Penrose export is, and it costs you nothing to cap it on day one. Retrofitting budget enforcement after a surprise invoice is a bad week regardless of headcount.

Instrument spend per job, per user, per account from the first deployed build. At this size the number that matters isn't the total — it's the distribution. If six of the seven users have spent nothing by week eight, that's your adoption signal arriving early, in a form you can't argue with.

---

## 11. Phasing

| Phase | Weeks | Deliverable | Done when |
|---|---|---|---|
| **0. Close the skill** | 1–2 | Corpus repo; one canonical copy; de-personalized; ~15 sanitized precedents; **`etg-errand-regression` pulled in and split generic-vs-ETG**; 5 seed regression cases | Your own local sessions read from the repo, and `harness/validate` runs clean against a tree that isn't ETG's |
| **A. Distribution** | 1 (parallel) | Private plugin marketplace | Guillaume installs it and ships a build without you in the loop |
| **1. App skeleton + Layer 1** | 3–5 | SSO, upload, jobs table, Modal worker, live trace, versioned download, **static validation gating the download**. `build` + `edit` only | A teammate with no Claude workspace ships a correct, validated tree JSON end to end |
| **2. Layer 2 + intake** | 6 | Per-tree oracle runs in-app with a FAIL table; ETG wired up as the first tree with an oracle; `intake` and `verify` jobs | The harness catches something in a fresh build that you'd have missed by eye |
| **3. Governance** | 7 | Suggestion queue, curator job, review UI, regression CI, corpus versioning end to end | A teammate's proposal reaches production through the queue with zero manual git work by you |
| **4. Preview + replay** | 8+ | Layer 3 clickable preview; session-replay loop against `get_session_data` | Someone clicks through a built flow before importing it — and a shim divergence gets caught by real session data |

Three scheduling notes. **Phase 0 is now two weeks, not one** — pulling in and splitting the harness is real work and it's the highest-value work in the plan, so don't compress it. **Layer 1 validation moved forward into Phase 1** because it's mostly written and because gating downloads on it from day one sets the expectation that builds get verified, rather than bolting verification on later as an optional extra. And **Phase 3 can slip without much pain**: with seven users and you as sole reviewer, a shared doc plus Slack handles change proposals for a good while. If time gets tight, cut governance before you cut verification.

---

## 12. How this fails

Ranked by likelihood, with the counter for each.

| Risk | Why it happens | Counter |
|---|---|---|
| **Nobody uses it** ← *the top risk, and it went up in Draft 2* | Six colleagues who all know you personally will Slack you rather than fill out a form. A public tool with 500 strangers gets adoption by default; a tool with six friendly users has to beat "just ask Brent," which is a genuinely high bar | Instrument adoption from day one. Success metric: *builds shipped by non-Brent humans without Brent's involvement.* If that's under 3/month by week 12, the problem is UX or trust, and features won't fix it. Two cheap counters: pick **one** of the six as a design partner from Phase 1 rather than launching to all of them at once, and make the app strictly better than asking you at something specific — the validated download and the FAIL table are that something, since you can't hand those over in Slack. |
| **Corpus quality decays** | N contributors, no objective quality bar | The regression suite (§7). This is why it's mandatory rather than nice-to-have. |
| **Output quality is visibly worse than Brent's sessions** | Missing corpus, missing account context, no requirements doc | Phase 0. Then be explicit in the UI about what context a job had — "no account context supplied" is honest and teaches people to supply it. |
| **Brent becomes the bottleneck and the queue dies** | Reviewer of record for everything, with a day job | SLA + auto-approve lane + second reviewer path (§7.2). Watch queue depth. |
| **False confidence from simulation** ← *went down in Draft 2* | Shims drift from real Zingtree semantics | Much smaller than I first assumed, because the harness runs the tree's own node bodies rather than a reimplementation — the exposure is a handful of shims, not a growing clone. Label simulated results plainly, treat shim divergences as the top bug class, and build the session-replay loop (§8) as the external check. |
| **Cost surprise** | Unbounded agent run on a 3MB export | Per-job and per-user ceilings in code on day one (§10). Low risk at seven users. |
| **A data incident** | Customer tree JSONs on third-party infra without a written decision | You own the sign-off — so write it down before Phase 1, and settle the healthcare-account question explicitly (§9). |
| **The harness stays ETG-shaped** | Generalizing is harder than it looks; ETG assumptions are load-bearing in places | Prove it in Phase 0 against a non-ETG tree before declaring the phase done. If genuine generalization turns out to be a month of work, ship Layer 1 generic and leave Layer 2 per-tree bespoke — still valuable, just less leverage. |
| **You build it and Zingtree product wants to own it** | It's genuinely a plausible product feature | Not really a risk — that's the *good* outcome. Just keep it extractable (§6). |

---

## 13. Decisions — resolved, and what's left

**Resolved in Draft 2:** no existing internal tools app, so it's greenfield and standalone (§6). No Zingtree authoring API, now or later, so simulation is the permanent testing model (§8). You own the data sign-off (§9). The audience is seven people — you, Guillaume, Vebhav, Debby, Charchit, Monica, Adib — and Charchit is a user, not a builder, so this is a solo build (§5.1, §10, §12).

**Still open, roughly in order of how much they'd change the plan:**

1. **How technical are the six?** This is the one that most affects design, and I can't infer it. §5.6 has the requester confirming their own numbered edit list — that's reasonable for someone who reads Zingtree logic fluently and much weaker for someone who doesn't. If most of the six are non-technical, the edit-list step needs to become a plain-language summary with the mechanical house-pattern lint running underneath, and Layer 3's clickable preview jumps from "nice" to "the feature that makes the app usable at all."
2. **Anthropic billing** — which Claude Platform org and API key does the worker use, and what monthly ceiling do you want enforced in code? Small decision, but it blocks Phase 1's first real job.
3. **Is Guillaume a co-owner or a user?** He's in the conversation that started this, which reads like more than "user." If he's a co-owner, he's your auth reviewer (§9), your Phase 1 design partner (§12), and eventually your second approver for non-semantic changes (§7.2). If he's a user, you're genuinely solo and Phase 3's timeline should be treated as optimistic.
4. **The healthcare-account question** (§9) — do Quest, Penrose Health, Ivy Rehab and Corpay Healthcare Provider Support trees go through a third-party PaaS at all, or do those stay local? Decide it deliberately in Phase 0, because retrofitting a tenancy split later is much worse than designing for it now.
5. **Which tree gets the second oracle?** ETG's register-errands has one. The second is the highest-value Phase 2 decision, and it should be driven by which flow's failures are most expensive rather than which is most convenient. Once the session-replay loop exists (§8), real path data answers this for you — until then it's your judgment.
6. **Your build budget** — seven focused weeks of your evenings is not the same project as seven weeks with real time carved out. If it's evenings, do Phase 0 + A + 1 and stop there. That's the corpus consolidated, the harness generalized, the plugin distributed, and a working upload-to-validated-download loop. It's most of the value, and it's a coherent place to stop rather than a half-built thing.

---

## 14. Appendix — verified vs. assumed

**Verified against the workspace** (a subagent read the tree and the skill files): the builder skill's size and reference structure; that it depends on `Zingtree Builder/MEMORY.md` and the Script Library, neither of which is packaged; the manual sync between `Skill Source/` and the packaged `.skill`; 75+ tree exports across 15 account folders; the existing Next.js `zing-studio` prototype; the personal couplings (your Gmail, `America/Denver` calendar gate, your Chrome profile, Spiky); the GuideCX compromised-token note.

**Verified by reading `etg-errand-regression` directly** — its SKILL.md, `validate_tree.js`, `engine.js`, `run_full.js`, `oracle.js`, `config.assumed.json`, and `references/known-defects.md`, with sizes as quoted in §8. Draft 1 claimed "no automated validator or test suite exists anywhere in the workspace." That was **wrong** — the validator exists, it's good, and it isn't in the workspace, which is why the workspace sweep missed it. Corrected in §3 and §8, and it's the single largest change between drafts.

**Verified against Anthropic docs** (URLs below): Agent SDK hosting patterns, `settingSources`/`skills`/`allowedTools` semantics, session resume + store limits (transcripts only), container hardening guidance, multi-tenant isolation via `CLAUDE_CONFIG_DIR` + `CLAUDE_CODE_DISABLE_AUTO_MEMORY`, absence of a top-level session timeout, plugin/marketplace mechanics and `plugins: [{type:"local"}]`, API-key-vs-subscription guidance for shared production automation, Managed Agents pricing at $0.08/session-hour and its beta ZDR/HIPAA status.

**Verified against Zingtree docs:** no tree-authoring API; import/export are UI-only; per-org admin-issued API keys at 6,000 calls/day with no documented scoping; session/form/event API is well covered; webhooks exist; embed via `zingtree.com/live/{treeId}`; no Terraform provider and no separate "Studio" developer surface. **Confirmed by you from the inside** that no authoring API is coming, which is why Draft 2 treats simulation as permanent rather than as a stopgap.

**Documented as silent — assume nothing:** the exact `permissionMode` enum (check at implementation time; the allowlist is what enforces denial); whether Managed Agents supports custom Skills (assume no until confirmed); the custom-Skills-upload API's versioning and size limits; whether private plugin marketplaces install cleanly for Cowork/desktop users (**test this in week 1**); per-user usage granularity in the Usage & Cost API; Agent SDK skill hot-reload in a running container (assume you restart, which the image-tag model already handles).

**My assumptions, flagged as such:** tens of builds per month as the design point, seven users (both now given rather than assumed); Modal over Fly on cold-start and per-second billing (either is fine, and Fly is the better pick if Zingtree already runs there); Supabase over Neon+S3 on vendor count; that per-build cost lands in low single-digit dollars, which needs measuring, not trusting; that `validate_tree.js` is mostly generalizable — I read it but did not run it against a non-ETG tree, and that's the assumption Phase 0 has to test first.

**Sources**

- [Hosting the Agent SDK](https://code.claude.com/docs/en/agent-sdk/hosting) · [Agent Skills in the SDK](https://code.claude.com/docs/en/agent-sdk/skills) · [Secure Deployment](https://code.claude.com/docs/en/agent-sdk/secure-deployment) · [Plugins in the SDK](https://code.claude.com/docs/en/agent-sdk/plugins)
- [Managed Agents Overview](https://platform.claude.com/docs/en/managed-agents/overview) · [Agent Skills Overview](https://platform.claude.com/docs/en/agents-and-tools/agent-skills/overview) · [Pricing](https://platform.claude.com/docs/en/about-claude/pricing)
- [Plugin Marketplaces](https://code.claude.com/docs/en/plugin-marketplaces) · [Claude Code GitHub Actions](https://code.claude.com/docs/en/github-actions) · [Authentication](https://code.claude.com/docs/en/authentication)
- [Zingtree API](https://help.zingtree.com/hc/en-us/articles/5048766502043-Zingtree-API) · [REST API](https://help.zingtree.com/hc/en-us/articles/4766652584475-API-REST-API) · [Importing Trees from JSON](https://help.zingtree.com/hc/en-us/articles/6181594602523-Importing-Trees-from-a-Previously-Exported-Zingtree-JSON-File) · [Exporting to JSON/CSV](https://help.zingtree.com/hc/en-us/articles/4901710729371-How-to-Export-your-Workflows-to-JSON-or-CSV) · [Embedding Trees](https://help.zingtree.com/hc/en-us/articles/4563541061147-How-to-Embed-Trees-on-your-Website) · [Webhooks](https://zingtree.com/en/webhooks)
- Workspace files: `CLAUDE.md`, `.claude/skills/zingtree-workflow-builder/`, `Zingtree Builder/MEMORY.md`, `Call Reviews/_automation/post-call-pipeline.md`, `guidecx_logger/CLAUDE.md`
