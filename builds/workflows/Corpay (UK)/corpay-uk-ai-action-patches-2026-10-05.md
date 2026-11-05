# Corpay UK AI Action patches, 2026-10-05

These patches go with the tree `Email Automation - AI Actions INT (new FAST use cases + guardrail 2026-10-05).json`. Apply them to the INT AI Actions in UK org 123, through PUT /ai-agents-svc/ai-actions or the wizard, in the same sitting as that import:

- 16 `automate_email_intent_int`
- 15 `automate_email_generation_int`
- 19 `automate_hc_email_intent_int`
- 18 `automate_hc_email_generation_int`

**Order matters.** Import the tree only after Thursday's INT to PROD promote, then apply these patches straight away.

- **If you patch the prompts while the 6 Oct tree is still in INT**, a partly-recognised email reaches the dashboard and the unrecognised part is dropped. That tree has no screen 62.
- **If you import the tree before you patch**, nothing breaks. Screen 62 just never shows, because the intent Actions still escalate a partial match under RULE 3.

Re-read each Action after you save it.

The PROD twins need the same patches when this release is promoted:

- 13 `automate_email_intent_prod`
- 12 `automate_email_generation_prod`
- 20 `automate_hc_email_intent_prod`
- 21 `automate_hc_email_generation_prod`

Use the `_prod` aliases in the context merges.

Sources:

- "Allstar - Returned direct debit PH1" and "Allstar - Card groups PH1" (Charley Gunning, 5 Oct)
- "Managing Multi-Intent Requests with Unrecognised Intents" (same email)

---

## 16 `automate_email_intent_int` (FAST Admin intent)

### Context: Possible Intents block

Add two lines above `- other`:

```
- card_group_move
- returned_direct_debit
```

### Instructions: two new intent definitions

```
Intent returned_direct_debit definition
Scan customer email for the following words/phrases or similar ones:
- "Incurred a returned direct debit fee"
- "Explain my returned direct debit fee"
- "Why is there a £99 fee added to my account"
- "What has triggered a £99 fee on my account"
```

```
Intent card_group_move definition
Scan customer email for the following words/phrases or similar ones:
- "Move my card group"
- "Change a card in my card groups"
- "Move a card from one group to another"
```

### Constraint 4 (ESCALATION RULES): three edits

**(a)** Add this to RULE 1, after its "Applies to" line:

```
   Card groups: "Error moving a card group", "Issue moving card group online", or any report that
   moving a card between groups failed -> escalate. Set escalate_to_agent = true, escalate_reason = "Escalation".
```

Also add `Card Group/Moves` to RULE 1's "Applies to" list.

**(b)** Replace RULE 3 in full with the following. This is the guardrail.

```
   RULE 3 — NO INTENT MATCH
   Escalate only when NO request in the email reasonably matches a value in the Possible Intents list.
   Set escalate_to_agent = true
   Set escalate_reason = "Intent does not match"

   PARTIAL MATCH (not an escalation)
   When at least one request matches the Possible Intents list and one or more other requests do not:
   - Return ONLY the matched intents in email_intent.
   - Set escalate_to_agent = false and escalate_reason = "".
   - Set ai_exception_reason to one sentence naming exactly what the customer asked for that is not
     on the list, e.g. "The customer also asked why the diesel price at a Leeds site was higher than
     the site locator showed."
   A request must never be silently dropped: anything not matched is named in ai_exception_reason
   for the agent to complete. RULE 1 and RULE 2 still win: if any request triggers them, escalate
   the whole email as before.
```

**(c)** SCOPE: change "One qualifying request escalates the entire email" so it reads "One request that triggers RULE 1 or RULE 2 escalates the entire email". A partial match does not escalate.

### ai_exception_reason instruction / constraint

Change the definition so it reads:

```
ai_exception_reason is "" only when EVERY request in the email mapped to an intent and nothing
escalated. On a partial match it names the request(s) that did not map. On any escalation or
no-match it names what the customer actually asked for.
```

### Worked examples: add

```
   "Why is there a £99 fee on my account?" -> no escalation, returned_direct_debit
   "Please move a card from one group to another" -> no escalation, card_group_move
   "I get an error moving a card group online" -> Escalation
   "Send a PIN reminder, and why was the diesel price higher than the site locator?" -> no escalation,
     email_intent ["card_pins"], ai_exception_reason names the diesel price question
```

---

## 15 `automate_email_generation_int` (FAST Admin reply)

### Context: new block

```
Additional request added by the agent (may be empty): ${agent_added_request}
```

### Instructions: new block

```
If "Additional request added by the agent" is not empty, the customer also asked for something the
intent list does not cover, and the agent has written the information to give them. Answer it in the
same email, as its own paragraph before the closing, using ONLY the agent's information. Do not add
facts, links or steps the agent did not give. If it is empty, ignore it.
```

### Instructions: two approved templates

These are Corpay's copy verbatim. Following tracker item 7, links are written as linked text, never as raw URLs.

**returned_direct_debit**

```
Hello,
Thank you for your email.
The Returned Direct Debit Charge (RDD) for £99 is applicable to any Allstar accounts which bounce a direct debit against their account.
If you wish to not be charged this fee, then you will need to ensure that all Direct debits are paid on time as per your agreed date.
Please let us know if you require anymore information.
Kind regards,
Allstar Customer Support
```

**card_group_move**

The source text reads "log in to your portal (www.allstaronline.co.uk)". Here it is written as "[log in]" linked to `http://www.allstaronline.co.uk`, the same pattern as card_pins. The video link is "[short video]" linked to `https://premiercxvideo.wistia.com/s/5rq963zoeep2gdp`.

```
Hello,
Thank you for your email.
As you are an Authorised User on the account, you can move a card from one group to another through your Allstar Online Portal.
To do this, [log in] to your portal and navigate to the 'Cards' section. Once you have found the relevant card, hover over the 3 dots and select 'Manage Card'. You will then be able to select the correct card group.
<strong>Note</strong> - you can only change card groups within the same account number. Once the change has been processed, this will appear in the correct card group the following day.
Should you require further support on how to do this, please go to our 'Help' section within your portal where you'll find further information. Alternatively, we've created a [short video] which explains how to manage your account with Allstar Online.
Kind regards,
Allstar Customer Support
```

### Constraint 4 (TOPIC CLASSES)

- Add `card_group_move` to Portal topics.
- Add this line:

```
Information topics (no portal action): returned_direct_debit. In a multi-intent email, put its
paragraph after the PORTAL BLOCK and before the closing.
```

---

## 19 `automate_hc_email_intent_int` (Homecharge intent)

Replace the rule that escalates `Intent does not match` when any request in the email is unmatched with the same split as 16's RULE 3:

- Escalate only when NO request matches.
- On a partial match, return only the matched intents, set escalate_to_agent = false, and name the unmatched request(s) in ai_exception_reason.

RULE 0, RULE 1 and the complaint rule still take precedence. Make the same ai_exception_reason definition change as in 16.

Add one worked example:

```
"I've forgotten my password, and can my charger be moved to my new house?" -> no escalation,
email_intent ["hc_password_reset"], ai_exception_reason names the charger move question
```

## 18 `automate_hc_email_generation_int` (Homecharge reply)

Add the same context block and instruction as 15:

- Context: `Additional request added by the agent (may be empty): ${agent_added_request}`
- Instruction: answer it as its own paragraph before the closing, using only the agent's information

---

## Confirm with Corpay before go-live

1. **Salesforce picklist spellings.** Topic `Fee` with Sub Topic `Returned direct debit` comes from the use-case doc. Check both against Gemma's matrix: Topic__c and Sub_Topic__c are restricted picklists, so a spelling difference fails the save. `Not Online` / `Card Group/Moves` is already a matrix row.
2. **Guardrail "Input fields for each intent recognised by the AI".** Screen 62 lists the recognised intents and gives one free-text field for the unrecognised part. It does not give a separate field per recognised intent. Confirm that reading.
3. **Guardrail scope.** The doc does not name a queue. The tree supports both lanes, and these patches apply it to FAST Admin (16) and Homecharge (19). If Corpay wants FAST only, skip the 19 patch.

---

## Applied 2026-10-05

- **16 `automate_email_intent_int`: applied.** Both intents are in Possible Intents, with definitions inserted after add_update_contact_details. RULE 1 now includes Card Group/Moves and its error wordings. RULE 3 is split into no-match and partial match. SCOPE and the worked examples are updated. Saved with PUT /ai-agents-svc/ai-actions and verified by re-reading the action. The ai_exception_reason instruction already had a "Partly matched" form, so it was left as is.
- **15 `automate_email_generation_int`: applied.** The agent_added_request context block, the returned_direct_debit and card_group_move templates (same link markup as card_pins), and the agent-added instruction are in, and TOPIC CLASSES now has an information topic. Verified by re-reading.
- **19 `automate_hc_email_intent_int`: applied (Brent approved the change).** RULE 3 is split into no-match and partial match, RULE 4 and SCOPE are adjusted, and a worked example is added. Verified by re-reading.
- **18 `automate_hc_email_generation_int`: applied.** The agent_added_request context block and the "additional request added by the agent" instruction are in. Verified by re-reading.
- **Rollback.** The before-state of 16, 15, 19 and 18 is in the author-portal tab's localStorage as `claude_uk<id>_before_20261005`.
- **Tree dependency.** With 16 patched, INT must run the "new FAST use cases + guardrail" tree. The 30 Sep tree has no map rows for the two new intents and no screen 62.
