# AI Action edits — org 605565 — from the UAT standup, 2026-09-17

Two prompt changes that do not live in the tree JSON. Portal:
https://zingtree.com/author/605565/applications/ai-actions

**Status: APPLIED 2026-09-17.** Both Actions are saved in org 605565 (PUT /ai-agents-svc/ai-actions
returned 200 for each, and a re-read of both confirms the content below). The save control is a
**Save** button that only appears on the LAST wizard step (Clarifications) — every earlier step shows
Next, and the Preview step shows only Back, so edits are lost if you leave before stepping through to
Clarifications and clicking Save.

Verified after saving: Action 98 carries no reference to any of the four retired intents anywhere in
its context, instructions, constraints, examples or clarifications (3 context blocks, 9 instruction
blocks, 8 constraint blocks). Action 99's Octopus template now carries a blank line between every
paragraph, with "Kind regards," and the sign-off kept together, and no wording changed.

Action 99 still holds the approved templates for the four retired intents. Left deliberately — 98 no
longer returns those keys, so they are unreachable, and the copy is there when Charley re-releases
them one at a time.

The record below is what was applied, kept for the re-release.

---

## AI Action 99 — `automate_hc_email_generation_int`

**One change.** The approved **Octopus pairing pushback** template renders with no blank line
between paragraphs, so the drafted reply arrives as one block of text. Bailey showed it on the call;
both of you read it as a copy-paste artefact from when Corpay's approved copy was transferred in —
the other Homecharge templates are fine. Restore the paragraph breaks in that one template so the
generated reply carries a gap at every paragraph break, like the rest.

Nothing else in 99 changes.

---

## AI Action 98 — `automate_hc_email_intent_int`

Five edits, all removing the four intents cut from Phase 1: `hc_update_charger_details`,
`hc_compatible_chargers`, `hc_payment_query`, `hc_resent_onboarding_email`.

### 1. Context — block 2 "Possible Intents"

Replace the whole block with:

```
Possible Intents:
- hc_missing_charges
- hc_tariff_update
- hc_password_reset
- other
```

### 2. Context — block 3 "Possible Response Variants"

Replace the whole block with:

```
Possible Response Variants (hc_response_variant):
hc_tariff_update only:
- standard_driver_pushback
- octopus_pairing_pushback
- driver_struggling_response
Return "" for every other intent.
```

### 3. Instructions — delete four blocks

Delete these four instruction blocks outright (the trash icon on the right of each block):

- `Intent hc_update_charger_details definition`
- `Intent hc_compatible_chargers definition`
- `Intent hc_payment_query definition`
- `Intent hc_resent_onboarding_email definition`

Keep the `hc_missing_charges`, `hc_tariff_update` and `hc_password_reset` definitions as they are.

### 4. Instructions — the "Response Variant" block

Its first paragraph names hc_payment_query and the whole `hc_payment_query:` section at the bottom
goes. Replace the block with:

```
Response Variant
hc_response_variant applies to hc_tariff_update only. Return "" when hc_tariff_update is not one of the detected intents.

hc_tariff_update:
- standard_driver_pushback: the email matches the Group 1a wording - the tariff or energy supplier has changed, or the customer is asking for it to be updated.
- octopus_pairing_pushback: the email matches the Group 1b wording - the customer has moved, switched or joined Octopus. Octopus wording wins over Group 1a when both appear.
- driver_struggling_response: the email matches the Group 1c wording - submitting or uploading the tariff document, statement or attachment has failed or is not working. Group 1c wins over the other two groups when it appears, because the customer is already trying to self-serve.
```

### 5. Constraints — three blocks

**Block 3 (`hc_response_variant must be one of...`)** — replace with:

```
hc_response_variant must be one of standard_driver_pushback, octopus_pairing_pushback or driver_struggling_response when hc_tariff_update is detected, and "" for every other intent.
```

**Block 5 (`ESCALATION RULES`)** — two surgical edits, leave the rest verbatim:

- Under RULE 0, delete the paragraph beginning
  *"hc_compatible_chargers, hc_payment_query and hc_resent_onboarding_email are information replies
  and are also self-service overrides..."* and its blank line. The two remaining overrides
  (password reset, tariff Group 1c) are untouched, so the later phrase "the two overrides in Rule 0"
  still reads correctly.
- Under RULE 1, change
  `Applies to: hc_missing_charges and hc_update_charger_details. Does not apply to the two overrides in Rule 0.`
  to
  `Applies to: hc_missing_charges. Does not apply to the two overrides in Rule 0.`

**Block 7 (`WORKED EXAMPLES`)** — replace with:

```
WORKED EXAMPLES
"My home charging sessions are missing from my account" -> hc_missing_charges, no escalation
"None of my charges from last month are showing" -> hc_missing_charges, no escalation
"I've switched to Octopus, please update my tariff" -> hc_tariff_update, octopus_pairing_pushback, no escalation
"My energy supplier changed last month and the tariff is wrong" -> hc_tariff_update, standard_driver_pushback, no escalation
"I keep trying to upload my energy statement and it fails" -> hc_tariff_update, driver_struggling_response, no escalation
"I can't log in to my Homecharge account" -> hc_password_reset, no escalation
"The password reset link doesn't work" -> hc_password_reset, Escalation
"I want to make a complaint, my charges have been missing for three months" -> hc_missing_charges, Escalation
"Please cancel my fuel card" -> other, Intent does not match
"I've had a new charger installed and need to update my account" -> other, Intent does not match
"Which chargers work with Homecharge?" -> other, Intent does not match
"My direct debit has gone up since I started charging at home" -> other, Intent does not match
"I never received my Homecharge invitation, can it be resent?" -> other, Intent does not match
```

The last four examples are new: they pin the retired intents to `other / Intent does not match` so
the Action's own boundary matches the tree's.

**Nothing to change** in Examples (generic schema), Clarifications (empty), Model or General.

---

## Order of operations

The tree is safe either way — node 19 now treats an intent with no row in its map as out of scope,
so a retired key the Action still returns lands on the "case is not automated" screen rather than
throwing. Applying these makes the Action stop returning them at all, and gives the agent a better
`ai_exception_reason` sentence.

When a retired intent comes back through Charley's release cadence, it is one row in node 19's map,
one row in its check map, its Test Mode scenario on screens 44/45, and its lines back into 98.
