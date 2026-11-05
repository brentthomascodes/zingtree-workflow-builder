# Transforms → form data migration — what's safe, what isn't, and why

**Date:** 2026-09-01
**Scope:** Register Errands – Dynamic (`518765124`) and Register Errands – VI Dynamic
(`542096854`), the same two trees covered in the code-review doc.
**Why this exists:** transforms (and actions) data has a **fixed 1-hour TTL** — it
silently disappears if an agent sits on a screen too long. Form data
(`ZT.setFormData`) has **no TTL** — once set, it persists for the life of the
session. This tree's own claude.md already documents the failure mode ("Transforms
expire after 1 hour; node 29 Clear Data resets loop state"), and it's the exact
mechanism Brent asked to eliminate risk from. **This is a durable fact about how
Zingtree works, not specific to this tree** — worth carrying into every future
workflow, not just this one.

The request as given — "remove all references to transforms namespaces" — turns out
not to be a mechanical find-and-replace. Some of what's stored in transforms today
is there because it genuinely has to be (Zingtree's merge-field syntax can't reach
into a form-data object the way it can a transform), and some of it is there simply
because nobody had a reason to move it. This document separates the two, so the
migration that happens is the one that actually removes TTL risk instead of trading
one bug for a different one.

---

## The rule that decides everything here

Merge fields (`${...}` in Content nodes and Connected Object bodies) can do
**dot-path traversal** into `transforms` and `actions`: `${transforms.current_pnr.pnr}`
walks into an object and pulls one field out. **Form data can't do that** — a form
variable is always a flat scalar; there's no `${formdata.foo.bar}`. That single
constraint is why this can't be a blanket conversion:

- Anything that's only ever touched **inside scripts** (`transforms.x` read/write,
  never `${transforms.x...}` in a Content node or CO body) can move to form data
  with zero loss — script code reads/writes named variables either way, and
  `ZT.getVariableValue`/`ZT.setFormData` handle objects and arrays fine as long as
  you `JSON.stringify`/`JSON.parse` them yourself (form data itself is just string
  storage under the hood, same as it is for transforms).
- Anything that's read via **nested merge-field dot-path** in a Content node or CO
  body has to either (a) get flattened into several separate flat form variables
  (one per sub-field actually interpolated), or (b) stay a transform. There's no
  third option that keeps today's templates working unchanged.

---

## The scan (verified against the uploaded export, not estimated)

| | Errands (`518765124`) | VI (`542096854`) |
|---|---|---|
| `setTransformData` calls | 126 | 38 |
| `setFormData` calls | 79 | 21 |
| `transforms.` references (script + merge-field) | 94 | 115 |
| Distinct transform vars reached via nested `${transforms.X.Y}` | 2 (`current_pnr.pnr`, `current_pnr.postSaleHandleType`) | 2 (same two) |
| Distinct transform vars reached via bare `${transforms.X}` (whole-value interpolation, no traversal) | 6 (`errand_message`, `pnr_banner`, `customer_action_table_html`, `edvin_errand_card_html`, `child_ticket_html`, `unresolved_note_html`) | 2 (`pnr_banner`, `customer_action_table_html`) |

Everything else set via `setTransformData` in both trees — and it's the majority of
those 126 / 38 calls — is read back only from inside other scripts, never from a
Content node or CO body. That's the population this migration should actually touch.

---

## Tier 1 — migrate now: the idempotency-guard state (highest value, lowest risk)

This is the reason the 60-minute TTL matters in practice, not just in theory. These
arrays are how node 44 (and node 65/71's ticket-creation logic) avoid creating a
**duplicate** Zendesk ticket or Edvin errand when a script re-runs over the same
loop. The tree's own changelog (v12, v20, v35) documents real duplicate-ticket bugs
that were fixed by getting this guard logic right — and every one of those guards
is currently sitting in a namespace that can vanish out from under a long-running
session with no warning.

Confirmed (grepped against the actual node scripts, not the claude.md's description
of them) — **set only in scripts, read only in scripts, never touched by a merge
field anywhere in either tree:**

| Variable | Set in nodes | Read in nodes |
|---|---|---|
| `registered_errand_keys` | 10, 29, 44 | 5*, 44 |
| `ticket_ids_by_errand_key` | 10, 29, 65, 71 | 44, 65, 71 |
| `parent_ticket_ids_by_errand_key` | 10, 29, 36 | 36, 44 |
| `attempted_child_ticket_keys` | 10, 29, 32 | 5*, 32 |
| `attempted_grandchild_ticket_keys` | 10, 29 | (write-only guard state) |
| `created_child_ticket_keys` | 10, 29 | 5* |
| `created_grandchild_ticket_keys` | 10, 29 | (write-only guard state) |

*node 5 is claude.md — documentation reference, not a runtime read.

**The fix is mechanical and safe:** everywhere one of these is set with
`ZT.setTransformData("name", arrayOrObject)`, change it to
`ZT.setFormData("name", JSON.stringify(arrayOrObject))`; everywhere it's read with
`transforms.name` (or `ZT.getVariableValue("name", ...)` — check which style each
call site uses), parse it back with `JSON.parse(ZT.getVariableValue("name", "[]"))`.
Nothing outside these scripts ever needed the raw object form, so nothing outside
these scripts needs to change. Node 29 ("Clear Data") already resets this same state
for the loop-reset case — that reset logic doesn't change, it just resets a form
variable instead of a transform.

**Do this one first.** It's the actual fix for the actual risk Brent flagged, it
touches nothing an agent or a CO ever sees, and it's the same shape of change
repeated seven times.

---

## Tier 2 — safe to migrate, lower urgency: the HTML strings

`pnr_banner`, `customer_action_table_html`, `edvin_errand_card_html`,
`child_ticket_html`, `unresolved_note_html` are plain strings (already-built HTML)
interpolated **whole** — `${transforms.pnr_banner}` — never traversed by sub-field.
Nothing stops these from being `ZT.setFormData("pnr_banner", html)` and
`${pnr_banner}` instead.

Two things worth knowing before doing this one, though:

- **House convention explicitly routes HTML to transforms** (`Zingtree Builder/MEMORY.md`'s
  canonical data-setting rules: "HTML built as a stringified value →
  `setTransformData`"). That's not an arbitrary style choice — Luciano flagged in an
  earlier ETG thread that form fields have a **storage-size limit** form data can hit
  that transforms don't. These HTML blocks (especially `customer_action_table_html`
  and `edvin_errand_card_html`, which grow with PNR count) are exactly the kind of
  value that convention is protecting against. Worth confirming the actual limit
  before moving these, since a form-data write that silently truncates a large HTML
  table is a worse failure mode than a transform that expires after an hour (at
  least the TTL failure is consistent and documented).
- These render on-screen while the agent is actively looking at that step, so the
  practical TTL exposure is lower than Tier 1's — an agent isn't going to sit on the
  PNR summary screen for an hour before clicking through it the way they might leave
  an errand-registration loop mid-session.

Recommendation: hold this tier until the form-field size limit is confirmed with
Zingtree/Luciano's thread, then migrate the smaller ones (`pnr_banner`,
`unresolved_note_html`) first as a test before touching the two that scale with PNR
count.

---

## Tier 3 — requires flattening, moderate effort: `current_pnr`

`current_pnr.pnr` and `current_pnr.postSaleHandleType` are the only two fields of any
transform object reached by nested merge-field dot-path in either tree — in Errands
nodes **1** and **8**, and in 13 separate VI content nodes (**1, 50, 53, 59, 61, 62,
64, 66, 69, 71, 73, 75, 87**). `current_pnr` itself is a large object (it's one
record out of `final_pnrs`, built by node 27's `buildFinalErrandRecord` — pnr,
passengers, orderReference, providerBookingIds, notes, plus everything spread in
from the original PNR item) that scripts also read many other fields off of
(`current_pnr.channelId`, `.categoryId`, `.actionId`, `.bucket_id`, etc. — see node
44's payload-building code).

This can't move to form data as one JSON-stringified blob without breaking those 15
content nodes, because form data has no dot-path traversal — `${current_pnr}` would
render `[object Object]` or the raw JSON string, not `.pnr` alone. The only way to
keep those 15 templates working is to **flatten the two fields those templates
actually use into their own top-level form variables** — e.g.
`ZT.setFormData("current_pnr_pnr", current_pnr.pnr)` and
`ZT.setFormData("current_pnr_post_sale_handle_type", current_pnr.postSaleHandleType)`
— alongside whatever internal representation the scripts keep using for everything
else `current_pnr` carries.

This is a real trade-off, not a free win: it adds two new named variables and 15
content-node template edits (`${transforms.current_pnr.pnr}` →
`${current_pnr_pnr}`, etc.) in exchange for removing the TTL risk on exactly two
fields — while `current_pnr` as a whole (all its other fields) stays a transform
either way, because scripts still need the full object and re-flattening every field
on it "just in case" adds exactly the kind of complexity Brent's "fewer complex
structures" goal is pushing against. **Net assessment: worth doing only if these two
specific fields have actually been seen expiring mid-session** — i.e., if there's a
live incident to point to, not as a precaution. Flag as a candidate, don't treat as
required.

---

## Tier 4 — outside this session's reach: Connected Object bodies

CO #184's request body (`registerErrand`, covered in the code-review doc) reads
`${transforms.current_pnr.channelId}`, `.categoryId}`, `.subCategoryId}`, `.typeId}`,
`.actionId}`, `.bucket_id}`, `.zd_ticket_id}`, `.parent_zd_ticket_id}`, and
`.providerBookingIds}` directly — six of `current_pnr`'s fields, by nested dot-path,
from *outside* the tree JSON entirely (CO bodies live in the Zingtree admin UI, not
in the export). The code-review doc's recommended fix — consolidate the whole
payload into one `edvin_register_errand_payload` transform and point the CO at
`${transforms.edvin_register_errand_payload}` as a single value — actually makes
this tier moot for CO #184 specifically: once the CO reads one whole-value transform
instead of six nested fields, `current_pnr`'s other fields no longer need
flattening for that CO's sake. Node 21's CO (Add Internal Note) likely has the same
shape of dependency; its body wasn't visible in this session to confirm.

Nothing here can be changed from a tree JSON edit — it needs the same "confirm the
live CO body, then edit it in the admin UI, sandbox first" treatment as CO #184 in
the code-review doc.

---

## What this migration deliberately does NOT do

It does not touch `final_pnrs`, `customer_action_pnrs`, `child_tickets`,
`unresolved_selections`, or `planned_ticket_titles` — all set via
`setTransformData` and read only in scripts (confirmed, same grep as Tier 1), so by
the same logic as Tier 1 they *could* move too. They're left out of this pass on
purpose: they're large, actively-growing-during-the-loop objects (one is rebuilt
every iteration), and Tier 1's seven guard arrays are the ones with a documented
history of causing real incidents when they misbehave. Moving everything at once
in one pass makes the diff hard to verify and the regression risk hard to isolate.
**Recommended as a Tier 1.5 follow-up** once Tier 1 has been live in production for
a normal business cycle with no surprises — same mechanical pattern
(`JSON.stringify`/`setFormData` in, `JSON.parse`/`getVariableValue` out), just a
second, separately-verified pass.

---

## Recommended order of work

1. **Tier 1** (idempotency guards) — mechanical, script-only, no content-node or CO
   changes, directly fixes the risk Brent named. Do this first, as its own draft/PR,
   separate from the code-review changes already shipped.
2. **Tier 4 / CO #184** — already recommended in the code-review doc; doing it
   removes six of `current_pnr`'s fields from the "reached externally" list, which
   narrows what Tier 3 would even need to cover.
3. **Tier 3** (`current_pnr.pnr` / `.postSaleHandleType` flattening) — only if a
   live incident shows these two fields actually expiring mid-session; otherwise
   leave as a documented, low-priority candidate.
4. **Tier 2** (HTML strings) — after confirming the form-field storage-size limit
   with Zingtree/Luciano's thread; migrate the two smallest first as a test.
5. **Tier 1.5** (`final_pnrs` and friends) — once Tier 1 has run clean in production
   for a normal cycle.

Each tier should land as its own draft file and its own verification pass (harness
tests plus, ideally, the `etg-errand-regression` skill), the same way the code-review
changes did — not as one combined "remove transforms" edit, since the tiers carry
very different amounts of risk and are trivial to bisect if kept separate.
