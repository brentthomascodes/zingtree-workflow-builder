# Environments — promote, demote, and keeping one tree correct in each

Most accounts run the same tree in two or more places: a dev/sandbox org and production
(ETG), or Brent's sandbox org, the customer's INT tree and their PROD tree (Corpay UK). What
differs between them is a short, knowable list. The rules here keep that list in one place
and make moving a tree a mechanical, verifiable step. Account-specific maps live in the
account skills (`etg-env-promote`, `corpay-uk-env-promote`, `corpay-uk-int-to-prod`) — this
file is the pattern they share.

## What differs between environments

| Category | Where it hides in an export | Example |
|---|---|---|
| Zendesk custom field ids | seed script reads, write-back script writes, `predefined_vars.name`, a form field's `name` / `score_var` / `hidden_value` / `config.conditional` | `custom_field_<digits>` is auto-generated per Zendesk org |
| Option values | router expressions, script lookup maps | one ETG option has a doubled underscore in prod only |
| Agent / user ids | Connected Object bodies, `predefined_vars` (a literal in a script is a lint finding) | the same person has a different Zendesk id per org |
| Connected Object ids + type | Data node `data_connected_objects[i]`: `data_connected_object_id`, `data_connected_object_type`, `org_id` | Corpay UK sandbox COs are `http` placeholders, the UK org's are `salesforce` |
| Connected Object / AI Action **aliases** | every `actions.<alias>` read, router expressions, seed `setResponseData` calls, node names, claude.md | Corpay UK INT `sfdc_int__case_email_ai` is `get_case_details__prod` in PROD; the PROD AI Actions carry no suffix at all |
| AI Action ids | AI_Action node `ai_action_id` | four per lane pair |
| `org_id` | top level and on every Connected Object entry | a CO whose `org_id` differs from the tree's is a half-done move |
| Tree ids that are URLs | a script that builds a link to another tree | ETG's Manager Review tree id is set in the seed script |
| Root node | `root_node_id` + the one `is_root` | Corpay UK sandbox roots on the Start screen (Test Mode visible); the UK org roots on the case fetch |
| Tree id and name | top level + every `predefined_vars[*].project_id` | an INT → PROD promote retargets the export at the live tree so the import lands on it |

## The environment-field rule: three places, one id each

Brent's standard for org-specific field ids (Sep 2026, ETG). It replaces the dual-environment
table that read the prod id with the dev id as a fallback and fanned values out to both —
that made a stray reference to the wrong org's field resolve to a real value, which is how a
cross-environment value becomes a stale reference nobody can see.

1. **Read once, in the seed script.** `let order_reference = ZT.getVariableValue("custom_field_<this org>", "");`
   → `ZT.setFormData("order_reference", order_reference);`. Every other node reads the
   snake_case name.
2. **Write back once, after the screen that can change it**, and only when non-empty, so a
   blank never clears what the ticket already holds.
3. **Declare it in `predefined_vars`** so the integration app reads it in and writes it out.

Nothing else in the tree may name a `custom_field_` id. A promote or demote then touches exactly
those three places, and `lint_tree.py` flags a raw field read anywhere else.

Session-only sentinels (ETG's orphan order reference `-999`) are never written back.

## Moving a tree

1. **Confirm the direction out loud.** Promote = toward production; demote = back to dev /
   sandbox. "Push this over" is ambiguous — ask which is the source.
2. **Export the target's live tree first and keep it.** It is the only rollback.
3. **Run the account's remap tool — never hand-edit.** Each account keeps one manifest of what
   exists per environment (fields, option values, agent ids, CO ids + types, AI Action ids,
   aliases, the root) and one script that rewrites an export from one column to the other.
   The manifest is the single source of truth; a table in a skill is only its mirror.
   - Resolve Connected Object ids by **(tree, node)**, not by id alone — two nodes can share an
     alias but not an id (ETG dev kept two create-ticket COs where prod has one).
   - Never raw-text-replace a numeric id: CO ids collide with coordinates, ranks and node ids.
   - Alias renames are **word-boundary anchored** — one PROD alias can be a prefix of an INT one.
   - `formfields`, `buttons` and `data_connected_objects` appear as arrays in some exports and as
     `"0"`-keyed objects in others; a structural walk normalises both or silently skips half.
4. **Check both ends.** Source check (the export still matches its own environment), target
   check (every id and alias now resolves in the target), then a diff that must contain
   **only** the remapped categories. Anything else in the diff means the tool touched
   something it should not have — stop.
5. **Stop on mixed signals.** Both environments' ids for one field in the same file, or a tree
   whose `org_id` says one environment while its field ids say the other, means an earlier
   half-remap or hand edit. Reconcile by hand before remapping; a remap makes it worse silently.
6. **Run the real-data gate** where the account has one (`03-testing-and-mock-data.md` →
   "Real-data contract").
7. **Deliver a local file.** The import into a live tree is always a separate, explicit step
   Brent takes after reading the report. Append one changelog line to claude.md (direction,
   date, ids used, placeholders) and change nothing else in it during a promote — its prose
   reading prod while its tables read INT is expected.

## Placeholders that fail loudly

When a target environment is missing an asset (Corpay UK PROD had no Homecharge AI Actions),
point the node at a valid id so the file imports, but rewrite the scripts to an alias that does
not exist yet. The lane errors in production instead of quietly answering a Homecharge case with
another lane's prompt. A broken lane is recoverable; a wrong customer email is not. Finishing it
later is an id swap in the manifest and a re-promote.

## Test Mode across environments

Test Mode ships to every environment intact. What changes is only the root: the sandbox roots on
the Start screen (live or Test Mode), the customer org roots on the first real node, and QA reaches
the picker with `#<node>` on the URL. Mocking also differs by org: an org that cannot make real
requests (Brent's sandbox) mocks every request; an org that can (the UK org) may mock only the
case fetch so the rest runs on real data. Make that a choice on the picker, not two trees.

## Asset ids from a conversation are provisional

An id or alias pairing that came from a chat answer or a verbal handover, rather than the admin
UI or an export, is recorded as provisional until confirmed. Read ids off the alias in the
target org, never off node order.
