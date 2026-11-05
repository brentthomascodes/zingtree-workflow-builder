# Samuel Kling code review — findings, verdicts, and what shipped

**Date:** 2026-09-01
**Source:** Slack DM thread with Samuel Kling (channel `D09JPGE9HFB`), messages at
2026-08-27 23:32 MDT and 2026-08-27 23:46 MDT.
**Scope reviewed:** node 44 ("Loop Errands to Register") in the **Register Errands –
Dynamic** tree (id `518765124`). Cross-checked against node 21 ("Format Internal
Note") and against the **Register Errands – VI Dynamic** tree (id `542096854`) for
the same anti-patterns, per Brent's request to standardize across both.
**Delivered as:** two new, separate draft files — nothing in the PRODUCTION exports
was touched. See "What shipped" below.

---

## Samuel's messages, verbatim

**Message 1 (23:32 MDT):**

> Claude is really not doing you a favor with the scripting.
>
> `// ZT.getVariableValue already has a fallback parameter so this is redundant`
> `function g(name, fallback) { return ZT.getVariableValue(name, "") || fallback || ""; }`
>
> `// requester_name and requester_email should not be mixed with agent, requester is the customer.`
> `// I also dont understand why we dont know what variable to look for, it should just be one and not a list of variables and hope we get lucky`
> `const agentName = firstOf(["agent_name", "current_user_name", "zendesk_agent_name", "requester_name"]);`
> `const agentEmail = firstOf(["agent_email", "current_user_email", "zendesk_agent_email", "requester_email"]);`
>
> `// some values default to "N/A" and some to empty string "". I would default all to null, defaulting to "N/A" or "" is an anti pattern,`
> `const ctx = { ... }`
>
> `// AI slop. Your building an array of arrays, then filter that by "N/A" which wouldnt catch the orderReference or channel that you default to "" above btw, then joining them with newlines, and then!! later on stringify it to escape it and remove the outer quotes. You also use some values from rec that is passed in, and since its passed in and named rec in the function its not that easy to see that its actually current_pnr, and others from ctx above.`
> `function buildErrandMessage(rec) { ... }`
>
> `// Using JSON.stringify() to escape a string, and then manually slicing off the outer double quotes (slice(1, -1)), is an incredibly hacky and brittle workaround. If the message starts or ends with characters that change stringification behavior, or if it is empty, this can break or leave trailing escape characters.`
> `let errandMessage = JSON.stringify(buildErrandMessage(current_pnr)).slice(1, -1);`

**Message 2 (23:46 MDT):**

> In the register errand payload you have this. and thats probably also why you do `.slice(1, -1)`, to get rid of the quotes.
> `"message": "${transforms.errand_message}"`
>
> [pasted the CO #184 request body template — see below]
>
> I never manage to get it to work without quotes... So what I did for the forms I made was just do `${transforms.payload}` as the payload in the connected object and build out the entire payload from the script and stringify it. This way I can also log exactly what im sending in the payload.

---

## Verdicts

| # | Finding | Verdict | Notes |
|---|---|---|---|
| 1 | `g(name, fallback)` wrapper is redundant | **Valid** | `ZT.getVariableValue(name, fallback)` already does exactly this. Zero behavior change to remove it — pure noise. Same pattern also existed in node 21; fixed there too for consistency. |
| 2 | `agentName`/`agentEmail` fallback chains mix customer identity (`requester_name`/`requester_email`) into the agent lookup | **Valid, and it's a correctness bug, not just style** | This isn't AI carelessness — it's a *documented, deliberate interim measure* (claude.md, "AGENT IDENTITY", tracker #73): the real Zendesk variable for the handling agent was never confirmed live, so the script tries several candidates. But two of those candidates (`requester_name`, `requester_email`) are the **customer's** identity, not the agent's — if every true agent variable comes back blank, the errand's "Handled By" field silently shows the *customer's* name instead of an honest "unknown." Fixed by dropping those two from the candidate list; an unresolved agent now correctly shows nothing rather than guessing. |
| 3 | Mixing `"N/A"` and `""` as two different "empty" sentinels is an anti-pattern; use `null` uniformly | **Valid** | Two sentinels for the same concept means every consumer has to remember to check both. Fixed: every `ctx` field defaults to `null`; `buildErrandMessage`'s filter collapsed from `row[1] && row[1] !== "N/A"` to a single `row[1]` truthy check. **Correction to the specific claim, for the record:** the *old* filter (`row[1] && row[1] !== "N/A"`) actually did already exclude the `""`-defaulted fields (`orderReference`, `channel`) — `"" && anything` is falsy, so those rows were dropped correctly before this fix too. The underlying complaint (two sentinels is confusing and fragile) is still right and worth fixing; the specific bug claimed on top of it doesn't hold up under inspection. Flagging this so the review record is accurate, not because it changes the recommendation. |
| 4 | `buildErrandMessage`'s array-of-arrays → filter → join, "AI slop" | **Partially valid** | The shape itself (rows, filter, join) is a normal and fairly readable way to build a labeled key:value block, and it stays in the simplified version — rewriting it as something more "clever" would work against the standardize-and-simplify goal. What *is* fixed: the single-condition filter from #3, and the `rec` vs. `current_pnr` naming ambiguity Samuel called out (the function's parameter is still named `rec`, matching the original — renaming risks nothing functionally, but wasn't touched this pass since it's cosmetic and not worth another diff on its own; call it out if you want it done in a follow-up). |
| 5 | `JSON.stringify(...).slice(1, -1)` to strip the outer quotes is brittle | **Technically the mechanism is safe, but the *reason it's needed* is the real problem** | `JSON.stringify(anyString)` always produces exactly `"<escaped>"`, so slicing the first/last char always removes exactly the wrapping quotes — for any string content, including one that starts/ends with a quote or backslash, since those get escaped, not left bare. So this line, on its own, was not going to break the way the comment worried it might. **The actual fix Samuel's second message points at is upstream of this line entirely** — see the payload-consolidation change below. Once the whole Edvin request body is built as one object and stringified once, this line disappears completely, which is a better outcome than defending it. |
| 6 | CO #184's payload should be built as one object in script + one `${transforms.payload}` merge field, not a hand-authored per-field JSON template | **Valid — the highest-value recommendation in the review** | This is the actual root cause behind #5's hack: `errand_message` needed the quote-strip specifically because it had to sit *inside quotes* in a template where `providerBookingIds` deliberately sits *outside* quotes (because it's already a stringified array). Getting per-field quoting right in a hand-typed template is exactly the kind of thing that breaks the next time a field is added. Implemented — see below. Also matches Samuel's point about being able to log the exact outgoing payload: `ZT.log` can now print `edvinRegisterErrandPayload` directly instead of reconstructing it from six separate merge fields. |

**Two things found while implementing this that neither of us flagged going in** (surfaced by
cross-referencing Samuel's pasted CO #184 body against what this tree's own scripts
actually set):

- **`orderReference` mismatch.** CO #184's live template reads `${custom_field_33772689958162}` directly. That's a *third*, different source from the two `ctx.orderReference` already falls back through (`orderReference`, then `custom_field_27823498043154`). The new consolidated payload uses `current_pnr.orderReference` — the value the rest of the tree (internal note, agent-facing cards) already treats as authoritative — so Edvin can no longer register a different order reference than what the agent sees on screen.
- **`subCategoryId` has never been populated.** It's in CO #184's template, but no script in this tree (node 2, 27, or 46) has ever set a `subCategoryId` on any PNR record. Every `registerErrand` call to date has sent this field blank. Preserved as `""` for wire compatibility in the new payload; worth a quick confirmation with ETG/Edvin on whether that field is actually consumed on their side.

---

## What shipped

Delivered as **two new files**, matching this repo's existing versioning convention —
nothing in the current PRODUCTION exports was edited:

- `Register Errands - Dynamic (v44 code-review simplification draft, 2026-09-01).json`
  — only nodes **44**, **21**, and **5** (claude.md) differ from the source export;
  all 78 nodes and tree config are otherwise identical.
- `Register Errands - VI Dynamic (v14 code-review parity, 2026-09-01).json` — checked
  this tree's own PNR/payload code (nodes 83, 84) for the same three anti-patterns;
  none are present (node 84 already uses a single, non-redundant `getVariableValue`
  fallback, and `providerBookingIds` is already a real array built once, not
  assembled field-by-field). Only node 5 (claude.md) changed, to record the review
  and the "no functional change needed" verdict. Delivered as a new file for parity,
  per the request that changes land in both trees as a new/separate entity.

Both new files' node 44/21 bodies were syntax-checked (`node --check`) and
executed against representative and edge-case inputs (fully-resolved fields,
all-blank fields, a request-only-customer-identity-available case) confirming:
no exceptions, `providerBookingIds` serializes as a real JSON array (not
double-encoded into a string) in the new consolidated payload, and
`agentName`/`agentEmail` never resolve to a `requester_*` value.

### Node 44 changes, concretely

1. Removed the redundant `g()` wrapper; calls now go straight to `ZT.getVariableValue`.
2. `firstOf(["agent_name", "current_user_name", "zendesk_agent_name"])` /
   `firstOf(["agent_email", "current_user_email", "zendesk_agent_email"])` — `requester_name`/`requester_email` dropped.
3. Every `ctx` field defaults to `null`; `buildErrandMessage`'s filter is one truthy check.
4. **New:** `edvinRegisterErrandPayload` — the full Edvin `registerErrand` request body,
   built as one object (same 13 fields as the live CO #184 template, cross-checked
   field-by-field against Samuel's pasted copy) and `JSON.stringify`'d once into a new
   transform, `edvin_register_errand_payload`. `providerBookingIds` is `JSON.parse`'d
   back into a real array first, specifically so it serializes as `[...]` inside the
   outer stringify rather than double-encoding into `"[...]"`.
5. `errand_message` (plain text, unchanged consumers) is still set on both
   `transforms.errand_message` and form data, exactly as before — nothing that reads
   it today breaks.

### The one manual step this can't do from a tree JSON

**CO #184's Data Source request body is not part of this tree's export** — it lives in
the Zingtree admin UI. The new `edvin_register_errand_payload` transform is inert
until someone points CO #184 at it. Recommended change, in the admin UI:

**Before** (current, per Samuel's pasted copy):
```
{
  "orderReference": "${custom_field_33772689958162}",
  "userUuid": "4871857e-d411-4594-a2de-25f6c4fb1ffa",
  "channelId": "${transforms.current_pnr.channelId}",
  "categoryId": "${transforms.current_pnr.categoryId}",
  "subCategoryId": "${transforms.current_pnr.subCategoryId}",
  "typeId": "${transforms.current_pnr.typeId}",
  "actionId": "${transforms.current_pnr.actionId}",
  "message": "${transforms.errand_message}",
  "genesysExternalId": "${custom_field_31975964556050}",
  "bucketId": "${transforms.current_pnr.bucket_id}",
  "zdTicketId": "${transforms.current_pnr.zd_ticket_id}",
  "zdParentTicketId": "${transforms.current_pnr.parent_zd_ticket_id}",
  "providerBookingIds": ${transforms.current_pnr.providerBookingIds}
}
```

**After:**
```
${transforms.edvin_register_errand_payload}
```

Do this in **sandbox first**, against the draft file above, before touching production.

## Recommended before promoting

1. Run the `etg-errand-regression` skill's offline harness against the draft file —
   it exercises node 44 directly and will catch any regression the hand-run cases
   above didn't cover.
2. Import the draft into sandbox, flip CO #184's body to the single merge field
   there, and run at least the "2 PNRs, same type+action" and "no agent identity
   resolvable" cases live — those are the two paths this change touches most.
3. Only then promote alongside a CO #184 change in production, together (the new
   transform and the new CO body are a matched pair — don't ship one without the
   other, or `registerErrand` calls will use whichever half is out of sync).
4. Node 21's own `JSON.stringify(...).slice(1, -1)` (the Add Internal Note CO body)
   almost certainly has the same fix available, but its CO's request body wasn't
   visible in this session the way CO #184's was — confirm that CO's actual field
   template before applying the same consolidation there.
