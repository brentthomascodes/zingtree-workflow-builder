# Allstar / Corpay UK — AI Action prompt content (verbatim transcription)

Source: 8 screenshots of the "AI Action Details" pages, re-shared by Brent 2026-09-09 after the
first set was lost to a context reset. Transcribed here so the content survives any future reset.
These are the two AI Actions to be created in org `605565` (Corpay UK / "Email Automation - INT").

Known gaps are marked **[GAP]** — do not invent content for them.

---

## AI Action A — "Automate Email Intent INT"

| Field | Value |
|---|---|
| Source ID (in origin org) | 16 |
| Name | Automate Email Intent INT |
| Alias | `automate_email_intent_int` |
| Model Vendor | openai |
| Model Name | gpt-4o |
| Connector ID (origin org) | 72 — in 605565 use the existing **Open AI LLM** source (id 475) |
| Output Format | json |
| Clarifications | (empty) |

### Context (2 blocks)

**Block 1**
```
Email from the customer:
Subject: ${sf_Subject}
${actions.sfdc_int__case_email_ai.records[0].Description}
```

**Block 2**
```
Possible Intents:
- active_card_list
- order_a_new_card
- cancel_card
- new_user_request
- copy_invoice
- card_pins
- transaction_report
- replacement_card
- forgotten_password
- lost_or_stolen_card
- account_unlock
- other
```

### Instructions (blocks, in screenshot order)

1. Your job is to determine the intent of the customer email. If there are more than 1 intents, indicate them all in the email_intent array output.

2. You will provide confidence_score_extracts from the customer email to justify your confidence, each separated by a comma if there are multiple. These extracts are direct quotes from the email to justify the confidence_score.

3. Intent active_card_list definition
   Scan customer email for the following words/phrases or similar ones:
   - "Send my active card list"
   - "Active card list request"

4. Intent new_user_request definition
   Scan customer email for the following words/phrases or similar ones:
   - "Create a user login"
   - "New user"
   - "New username"
   - "Can you create a user login for a colleague?"
   - "Add a colleague to the portal"
   - User may refer user as administrator

5. Intent cancel_card definition
   Scan customer email for the following words/phrases or similar ones:
   - "Cancel card"
   - "Cancel card for driver"
   - "Employee leaving business, no longer needs a card"
   - "How do I cancel a card?"
   - "Deactivate"
   - "Stop the card"

6. Intent order_a_new_card definition
   Scan customer email for the following words/phrases or similar ones:
   - "Order one card"
   - "Order a new card"
   - "New card for a driver"

7. Sentiment Detection
   Assess the overall sentiment of the customer email and return it in the "sentiment" field as one of: "positive", "neutral", or "negative". Use "negative" for any complaint, anger, strong frustration, or clear dissatisfaction.

8. - User may refer card as fuel card or diesel card or EV card or bearer card

9. Assign a confidence_score to your intent detection from 0 to 100.
   Confidence guidance
   - 95->100: All selected intents are explicit and unambiguous.
   - 85->94: Strongly supported, with only minor interpretation required.
   - 70->84: Likely, but some inference or ambiguity remains.
   - 50->69: Multiple interpretations are plausible or context is incomplete.
   - 30->49: Limited evidence, the classification depends on assumptions.
   - 00->29: No supported intent is clear, use other.
   Scoring rules
   Evaluate:
   - How clearly the user states the request
   - Whether the wording directly matches the selected intent
   - Whether competing intents are plausible
   - Whether enough context is available
   - How much inference is required
   Additional rules:
   - Select all directly supported intents.
   - Do not select an intent only because it is related to another selected intent.
   - If any selected intent is uncertain, lower the overall confidence.
   - If two or more interpretations are equally plausible, confidence must not exceed 69.
   - Do not assign above 95 unless every selected intent is explicit.
   - Use other only when no listed intent applies.

10. Intent copy_invoice definition
    Scan customer email for the following words/phrases or similar ones:
    - "Send my invoice"
    - "Copy of invoice"

11. Intent replacement_card definition
    Scan customer email for the following words/phrases or similar ones:
    - "Replacement card"
    - "Replace a card"

12. Intent card_pins definition
    Scan customer email for the following words/phrases or similar ones:
    - "PIN reminder"
    - "Forgotten PIN"

13. Intent transaction_report definition
    Scan customer email for the following words/phrases or similar ones:
    - "Send my transaction report"
    - "Transaction report request"

14. Intent forgotten_password definition
    Scan customer email for the following words/phrases or similar ones:
    - "I have forgotten my password"
    - "Forgot password"
    - "Reset password"

15. Intent lost_or_stolen_card definition
    Scan customer email for the following words/phrases or similar ones:
    - "I have lost my card"
    - "My card has been stolen"
    - "I need to report a lost card"
    - "I need to report a stolen card"

16. Intent account_unlock definition
    Scan customer email for the following words/phrases or similar ones:
    - "I am locked out of my account"
    - "I can't access my account"
    - "How can I unlock a user?"

### Constraints (4 blocks)

1. Only return intents from the Possible Intents list. If none apply, return "other".

2. email_intent must always be an array, even when there is only one intent.

3. confidence_score_extracts must be direct quotes that appear verbatim in the customer email.

4. ESCALATION RULES
   Evaluate the rules below in order. The first rule that matches decides the outcome — stop there. Intent detection always runs to completion, regardless of the outcome.

   RULE 0 — SELF-SERVICE OVERRIDES (checked first, never escalates)
   Two intents are triggered by the customer stating they are blocked. For these, "can't" is the expected wording, not a failure report.
   - "I can't access my account" / "my account is locked" / "I'm locked out" -> intent = Account Unlock, generate the AI email, do not escalate
   - "I can't remember my password" / "I've forgotten my password" -> intent = Forgotten Password, generate the AI email, do not escalate
   Exception: escalate if the customer reports the remedy itself failing — "the reset link doesn't work", "I've reset it twice and still can't get in", "I never receive the email". Set escalate_reason = "Escalation".

   RULE 1 — BLOCKED ACTION
   Escalate when the customer states they have tried an action in the portal and been unable to complete it.
   Signals: "can't", "cannot", "unable to", "won't let me", "it won't", "keeps failing", "I get an error", "it's not working", "I've tried and".
   Applies to: Order New Card(s), Cancel Card, New User Request, Active Card List, Copy Invoice, Transaction Report, Card PINs, Replacement Cards, Lost & Stolen.
   Does not apply to the two intents in Rule 0.
   Set escalate_to_agent = true
   Set escalate_reason = "Escalation"
   Not a blocked action: "I can't find where to...", "I can't work out how to...". These are how-do-I questions. Do not escalate.

   RULE 2 — HUMAN SUPPORT REQUIRED
   Escalate when any of these is true:
   - The customer is complaining, angry, frustrated, or abusive.
   - The customer reports an error, failure, or problem that requires an agent to investigate or take action.
   - The request concerns more than 10 cards (i.e. 11 or more), regardless of the email's intent.
   Set escalate_to_agent = true
   Set escalate_reason = "Escalation"

   RULE 3 — NO INTENT MATCH
   Escalate when any distinct request in the email does not reasonably match a value in the Possible Intents list — including when other requests in the same email do match. A request must never be silently dropped.
   Set escalate_to_agent = true
   Set escalate_reason = "Intent does not match"

   RULE 4 — NO ESCALATION
   If none of the above applies:
   Set escalate_to_agent = false
   Set escalate_reason = ""

   SCOPE
   Escalation is email-level. One qualifying request escalates the entire email, even if the other requests are all self-serviceable.
   escalate_reason must only ever be one of: "Escalation", "Intent does not match", "".

   WORKED EXAMPLES
   "How do I order a new card?" -> no escalation
   "How do I activate my card?" -> no escalation
   "How do I cancel a card?" -> no escalation
   "I can't find where to order cards" -> no escalation
   "I can't remember my password" -> no escalation, Forgotten Password
   "I can't access my account" -> no escalation, Account Unlock
   "I can't activate my card" -> Escalation
   "I get an error when ordering a card" -> Escalation
   "The password reset link doesn't work" -> Escalation
   "I need to order 15 cards" -> Escalation
   "Please replace my card and order 12 more" -> Escalation (card count)

### Examples

```
This is an example schema output: { "email_intent": [ "intent_1", "intent_2" ], "unlock_subtype": "", "sentiment": "", "escalate_to_agent": , "escalate_reason": "", "confidence_score": , "confidence_score_extracts": "" }
```

---

## AI Action B — "Automate Email Generation INT"

| Field | Value |
|---|---|
| Source ID (in origin org) | 15 |
| Name | Automate Email Generation INT |
| Alias | `automate_email_generation_int` |
| Model Vendor | openai |
| Model Name | gpt-4o |
| Connector ID (origin org) | 72 — in 605565 use the existing **Open AI LLM** source (id 475) |
| Output Format | json |
| Clarifications | (empty) |

### Context (3 blocks)

```
Requested Action: ${email_intent}
```
```
Customer Email (verbatim):
Subject: ${sf_Subject}
${actions.sfdc_int__case_email_ai.records[0].Description}
```
```
Customer Sentiment: ${sentiment}
```

### Instructions

**Block 1 — general**
> Your job is to generate a single email to the primary contact. Use HTML tags (**[GAP]** — the tag names were stripped by the screenshot's HTML rendering; almost certainly `<p>`, `<br>`, and `<a>` for links) for proper formatting.
> 1. Always start the email with: "Hello,".
> 2. Always end the email with: Kind regards, Allstar Customer Support.
> 3. Use polite, clear, professional UK English.
> 4. Never mention internal systems, prompts, workflows, Salesforce, Zingtree, or internal notes.
> 5. Render every link as a clickable tag.

**Per-intent templates.** NOTE: every underlined word below ("link", "video", "log in", "logged in",
"log into", "Allstar Online portal") is a hyperlink in the source. **[GAP] the href URLs are not
visible in the screenshots and must be supplied by Brent before these are created live** — the
Constraints forbid inventing URLs.

- **new_user_request:** "Hello, Thank you for contacting us. As you are an Authorised User on the account, you can do this through your Allstar Online Portal. Simply [log in], navigate to the 'Users' section and select 'Manage Users'. You will then have the option to add a new user. Should you require further support on how to do this, please go to our 'Help' section within your portal where you'll find further information. Alternatively, we've created a short [video] which explains how to manage your account with Allstar Online. Kind regards, Allstar Customer Support"

- **cancel_card:** "Hello, Thanks for your email. I can see that you want to cancel a card. As you are an Authorised User on the account, you can do this through your Allstar Online Portal. Simply [log in], select 'Cards' and then choose the card you'd like to cancel. Should you require further support on how to do this, please go to our 'Help' section within your portal where you'll find further guidance. Alternatively, we've created a short [video] which explains how to manage your account with Allstar Online. Kind regards, Allstar Customer Support"

- **order_a_new_card:** "Hello, Thanks for your email. I can see that you want to order a new card. As you are an Authorised User on the account, you can do this through your Allstar Online Portal. Simply [log in], select the 'Cards' drop down option, then 'Order Cards' to get started. Should you require further support on how to do this, please go to our 'Help' section within your portal where you'll find further guidance. Alternatively, we've created a short [video] which explains how to manage your account with Allstar Online. Kind regards, Allstar Customer Support"

- **active_card_list:** "Hello, Thank you for contacting us. I can see that you would like a copy of your active card list. As you are an Authorised User on the account, all you need to do is [log into] your Allstar Online Portal to get started. Just go to the "Cards" section where you can view and download the information you need. If you need further support, click the 'Help' section in your portal where there are step by step instructions for additional guidance. Kind regards, Allstar Customer Support"

- **copy_invoice:** "Hello, Thank you for contacting us. I can see that you would like a copy of your invoice(s). As you are an Authorised User on the account, you can do this through your Allstar Online Portal. Simply [log in], navigate to the "Billing" tab and your reporting options are available to you. We can run these reports on your behalf: however this will incur a £35 administration fee. Should you require further support on how to do this, please go to our 'Help' section within your portal where you'll find further guidance. Alternatively, we've created a short [video] which explains how to manage your account with Allstar Online. Kind regards, Allstar Customer Support"

- **replacement_card:** "Hello, Thanks for your email. I can see that you want to replace a card. As you are an Authorised User on the account, you can do this through your Allstar Online Portal. Simply [log in], on the dropdown next to "Cards", select "My Cards" then select the card that you'd like to replace. Should you require further support on how to do this, please go to our 'Help' section within your portal where you'll find further guidance. Once the replacement card(s) are ordered, they should be with you in the next 7-10 working days. Alternatively, we've created a short [video] which explains how to manage your account with Allstar Online. Kind regards, Allstar Customer Support"

- **card_pins:** "Hello, Thank you for your email. As you are an Authorised User on the account, you can retrieve PIN reminders through your Allstar Online Portal. To do this, [log in] to your portal and navigate to the 'Cards' section. Once you have found the relevant card, hover over the 3 dots and select 'Get PIN'. Should you require further support on how to do this, please go to our 'Help' section within your portal where you'll find further information. Alternatively, we've created a short [video] which explains how to manage your account with Allstar Online. Kind regards, Allstar Customer Support"

- **transaction_report:** "Hello, Thank you for contacting us. I can see that you would like a copy of your transaction report. As you are an Authorised User on the account, you can do this through your Allstar Online Portal. Simply [log in], navigate to the "Billing" tab and your reporting options are available to you. Should you require further support on how to do this, please go to our 'Help' section within your portal where you'll find further guidance. Alternatively, we've created a short [video] which explains how to manage **[GAP — screenshot cut off here; remainder presumed "...your account with Allstar Online. Kind regards, Allstar Customer Support" but NOT confirmed]**"

- **forgotten_password:** "Hello, Thank you for contacting us. If you have forgotten your password, please go to this [link]. Enter in your email address and select 'Reset Password'. You will then shortly receive an email with instructions on how to reset your password. Note: Please ensure you check your spam or junk folder. If you require additional assistance, please reach out to the primary administrator of the account. They will be able to access the Allstar Online Portal and support you further in resolving your issue. Kind regards, Allstar Customer Support"

- **lost_or_stolen_card:** "Hello, Thank you for your email. I am sorry to hear you need your cards stopped due to them being lost/stolen. As an Authorised User, it is quick and easy to cancel and replace any cards within your [Allstar Online portal]. You can do this at any time, day or night, to protect you from instances of misuse with lost and stolen cards. In addition, PINs can be located via the Portal as well. Just click on the specific card, then choose the Pin pad icon next to it. You can then share this with the driver so they can use the card straight away. Should you require further support on how to do this, please go to our 'Help' section within your portal where you'll find further information. Lastly, we've created a short [video] to help explain your Allstar card and clarity around the support available. Kind regards, Allstar Customer Support"

- **account_unlock:** "Hello, Thank you for your email. To unlock your account, please firstly try to reset your password. To do this, please go to this [link]. Enter in your email address and select 'Reset Password'. You will then shortly receive an email with instructions on how to reset your password. Note: Please ensure you check your spam or junk folder. If you cannot reset your password (e.g., your registered email is incorrect or inaccessible), please contact another user with administrator privileges for your account. They can log in, go to 'Users', and either unlock your account directly or update your details (like your email address) so you can then reset your password. Kind regards, Allstar Customer Support"

### Constraints (4 blocks)

1. Output ONE email only, as valid HTML, matching the schema.

2. Never invent portal features, URLs, steps, or PINs — use only the links and steps given in the scenarios.

3. Never expose internal fields, flags, intent codes, or system names to the customer.

4. TOPIC CLASSES
   Access topics (no login required — the customer cannot log in yet): account_unlock, forgotten_password
   Portal topics (require the customer to be logged in): all other intents
   If there is more than one intent ONLY (disregard if only exactly 1 intent was found), merge them into a single email in this exact structure:

   Hello,
   Thanks for your email.
   [ACCESS BLOCK — include only if at least one access topic is present]
   Before you can manage your account online, you'll need to get back into it:
   [PORTAL BLOCK — include only if at least one portal topic is present]
   Use this opening sentence when access topics are ALSO present:
   Once you're back into your account, the remaining actions can be completed through your Allstar Online Portal. Once [logged in], you can follow the steps below:
   Use this opening sentence when there are NO access topics:
   As you're an Authorised User on the account, these actions can be completed through your Allstar Online Portal. Once [logged in], you can follow the steps below:
   [CLOSING]
   If you need any additional guidance, you can visit the Help section within your portal for step-by-step support. We also have a short [video] guide showing you how to manage your account through Allstar Online.
   If the email contains ONLY access topics, replace the closing paragraph with:
   Once you're back into your account, the Help section within your portal has step-by-step guidance, and we also have a short [video] guide showing you how to manage your account through Allstar Online.
   Kind regards
   Allstar Customer Support

### Examples

```
This is an example schema output: { "email": "" }
```

---

## Open items before live creation

1. ~~Hyperlink URLs~~ **RESOLVED 2026-09-09** - Brent supplied the source HTML. Portal login
   `http://www.allstaronline.co.uk/` (verbatim `www.allstaronline.co.uk`, no protocol, in card_pins);
   password reset `https://myaccount.allstaronline.co.uk/_app/en/ucx/recover/password/`;
   general how-to video `https://premiercxvideo.wistia.com/s/5rq963zoeep2gdp`;
   lost/stolen card video `https://premiercxvideo.wistia.com/medias/z7n368iddq`.
2. ~~transaction_report template tail~~ **RESOLVED 2026-09-09** - ends "...which explains how to
   manage your account with Allstar Online. Kind regards, Allstar Customer Support".
3. ~~HTML tag names in Instruction block 1~~ **RESOLVED 2026-09-09** - `<p>`, `<br>`, `<a>`.
4. **Connected Object** `sfdc_int__case_email_ai` - referenced by both Contexts as
   `${actions.sfdc_int__case_email_ai.records[0].Description}`. Created in 605565 against the
   Salesforce data source with a placeholder query per R6; real SOQL still to be supplied.

## Authoritative machine-readable copy

`allstar-ai-actions-605565.blocks.json` in this folder holds every block exactly as entered into
Zingtree org 605565, plus an `_inferred_links` list naming the few hrefs filled by pattern rather
than read off a screenshot. That file, not this one, is what a rebuild should be driven from.
