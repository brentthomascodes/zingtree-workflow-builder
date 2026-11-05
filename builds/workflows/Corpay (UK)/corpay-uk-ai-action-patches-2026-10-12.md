# Corpay UK AI Action patches, 2026-10-12

There are two parts to this document, and they ship at different times.

| Part | What | Where | When |
|---|---|---|---|
| A | Sentiment split: negative tone still gets a reply, complaints still escalate | AI Action 16 `automate_email_intent_int` | INT today (Gemma, 12 Oct). Corpay tests Tue 13 Oct. Goes to PROD 13 `automate_email_intent_prod` with Thursday's release once approved. |
| B | New FAST use cases: Ecopoint, Extended Payment Terms, Zero Liability | AI Actions 16 and 15 (INT only) | After Thursday's INT-to-PROD promote, together with the master-tree split. Corpay UAT next week (Charley, 12 Oct). |

Sources:

- Gemma Danks, "Daily AI standup - 12th Oct" email.
- Spiky "Daily stand ups - UAT testing feedback", 12 Oct.
- Charley Gunning, "New use cases to be built", 12 Oct. Attachments:
  - Allstar - Ecopoint PH1
  - Allstar - EPT PH1
  - Allstar - Zero liability PH1
  - master tree request

Before each save, keep the Action's before-state. After each save, re-read the Action to confirm it saved.

---

## Part A: AI Action 16 `automate_email_intent_int`, the sentiment split

**Gemma, 12 Oct:**

- "If negative tone but still asking for help/action, follow BAU response journey."
- "If a complaint / pure anger etc etc, stick as the exclusion rule routing."

On the call, Alex said a negative-but-asking email "can handle an apology", and Gemma agreed: "the apology route plus the BAU instructions". The apology line is in A.3 as an optional change to Action 15.

The Sentiment Detection instruction (7) is unchanged. A frustrated email still returns `sentiment = "negative"`. What changes is that negative tone on its own no longer escalates.

### A.1 Constraint 4 (ESCALATION RULES): replace RULE 2 in full

```
   RULE 2 — HUMAN SUPPORT REQUIRED
   Escalate when any of these is true:
   - The customer is making a complaint: they say they want to complain or raise a formal
     complaint, threaten to leave, cancel or take legal action, or say they have chased the same
     issue repeatedly without a reply.
   - The customer is angry or abusive: insults, threats, offensive language, or anger aimed at
     Allstar or its staff rather than a question.
   - The customer reports an error, failure, or problem that requires an agent to investigate or
     take action.
   - The request concerns more than 10 cards (i.e. 11 or more), regardless of the email's intent.
   Set escalate_to_agent = true
   Set escalate_reason = "Escalation"

   NEGATIVE TONE IS NOT A COMPLAINT
   A customer who sounds annoyed, unhappy, surprised or frustrated (for example about a fee or a
   charge) but is still asking a question or asking for help with a request on the Possible
   Intents list is NOT escalated under this rule. Return the matched intent(s), set
   escalate_to_agent = false and escalate_reason = "", and still set sentiment = "negative".
   Only the complaint, anger/abuse, error and card-count signals above escalate.
```

### A.2 WORKED EXAMPLES: add these lines

```
   "Why on earth have I been charged £99? Nobody told me. Please explain this fee." -> no escalation,
     returned_direct_debit, sentiment negative
   "I'm really annoyed - what is this returned direct debit charge for?" -> no escalation,
     returned_direct_debit, sentiment negative
   "I want to make a formal complaint about the £99 fee" -> Escalation
   "This is the third time I've written about this charge with no reply. Your service is a
     disgrace." -> Escalation
```

### A.3 Optional: AI Action 15 `automate_email_generation_int`, an apology line

This is Brent's call. Gemma's email asks only for the BAU journey, so skip this if Corpay wants the template exactly as written.

Add to the Instructions:

```
If Customer Sentiment is "negative", open with ONE short sentence that acknowledges the customer's
frustration and apologises for any inconvenience (for example "We're sorry for any frustration this
has caused."), placed straight after "Thank you for your email.". Do not admit fault, do not offer
refunds or goodwill, and do not change any other part of the approved template.
```

**Test Mode (in the Thursday tree):**

- `test_fast_admin_rdd_frustrated`: expect the dashboard with the RDD reply, not escalation.
- `test_fast_admin_rdd_complaint`: expect the escalation notice.

**PROD:** once Corpay approves on Tuesday, apply the same A.1 and A.2 (and A.3 if used) to 13 `automate_email_intent_prod` (and 12) in Thursday's release.

**Homecharge (19 / 20):** this change is not applied there. The call and the email were about FAST fees. Ask before mirroring it.

---

## Part B: three new FAST use cases (INT, after Thursday)

Intent keys and Salesforce mapping, which is node 17's catalog map in the FAST Admin branch:

| Intent | Topic | Sub Topic |
|---|---|---|
| `ecopoint` | Fee | Ecopoint |
| `extended_payment_terms` | Fee | Extended Payment Terms |
| `zero_liability` | Fee | Zero Liability |

### B.1 AI Action 16 `automate_email_intent_int`

**Possible Intents:** add these above `- other`:

```
- ecopoint
- extended_payment_terms
- zero_liability
```

**Instructions:** add three definitions, after returned_direct_debit.

```
Intent ecopoint definition
Scan customer email for the following words/phrases or similar ones:
- "Can you remove Ecopoint from my account"
- "Opt out of Ecopoint"
- "What is Ecopoint?"
- "Explain the Ecopoint fee"
```

```
Intent extended_payment_terms definition
Scan customer email for the following words/phrases or similar ones:
- "What are extended payment terms?"
- "I'd like to revert back to our original payment terms"
- "Can you remove extended payment terms from my account"
- "Opt out of extended payment terms"
- "Explain the extended payment terms fee"
```

```
Intent zero_liability definition
Scan customer email for the following words/phrases or similar ones:
- "Can you remove zero liability from my account"
- "Opt out of zero liability"
- "What is zero liability?"
- "Explain the zero liability fee"
```

**Constraint 4, RULE 1:** add after the card-groups lines.

```
   Opt-out already requested (Ecopoint, Extended Payment Terms, Zero Liability): "still hasn't been
   removed off my account", "issue opting out of ...", or any report that an opt-out the customer
   already asked for has not happened -> escalate. Set escalate_to_agent = true,
   escalate_reason = "Escalation".
```

Also add Ecopoint, Extended Payment Terms and Zero Liability to RULE 1's "Applies to" list.

**WORKED EXAMPLES:** add these lines.

```
   "What is Ecopoint and can you remove it?" -> no escalation, ecopoint
   "Ecopoint still hasn't been removed off my account" -> Escalation
   "Can you explain the extended payment terms fee?" -> no escalation, extended_payment_terms
   "Issue opting out of extended payment terms" -> Escalation
   "Opt out of zero liability please" -> no escalation, zero_liability
```

### B.2 AI Action 15 `automate_email_generation_int`: three approved templates

These are Corpay's copy, verbatim. Following tracker item 7, links are written as linked text and never as raw URLs.

**ecopoint**

- "[our website]" links to `https://allstarecopoint.co.uk/`.
- "[Allstar Business Solutions EcoPoint - Opt Out]" links to `https://lp.constantcontactpages.com/sv/gt2HFES/ASEcoPoint2024`.

```
Hello,
Thank you for your email.
Ecopoint is a partnership scheme between Allstar and PDI Sustainability Solutions. It works by supporting a portfolio of CO2 reduction initiatives around the world including forestry creation and protection, renewable energy projects, industrial process improvements, transportation efficiencies and landfill gas capture projects – that all support local and global communities and their environments. All projects meet recognised quality assurance standards.
You can find further information about Ecopoint on [our website].
As Ecopoint is an optional service, you can remove this from your account at any time. Please complete the relevant details using this link: [Allstar Business Solutions EcoPoint - Opt Out]
Once submitted, requests can take up to 10 working days to process during which time you will still be liable for any charges as per our terms and conditions.
Kind regards,
Allstar Customer Support
```

**extended_payment_terms**

- "[this link]" links to `https://lp.constantcontactpages.com/sv/5SslgOL/ASExtendedTerms2024`.

```
Hello,
Thank you for your email.
Extended Payment Terms allows you to have the flexibility to extend your billing frequency from the standard weekly invoice to monthly invoicing. In some cases, you will have the option for your payment terms to be extended from the standard 7 days or 37 days.
As Extended Payment Terms is an optional service, you can remove this from your account and revert back to your original payment terms at any time. Please complete the relevant details using [this link].
Once submitted, requests can take up to 10 working days to process during which time you will still be liable for any charges as per our terms and conditions.
Kind regards,
Allstar Customer Support
```

**zero_liability**

- "[Allstar Business Solutions Zero Liability - Opt Out]" links to `https://lp.constantcontactpages.com/sv/qWERGFq/ASZeroLiability2024`.

```
Hello,
Thank you for your email.
Zero Liability is an optional security benefit for your fuel cards, protecting yourself from financial risk if your cards are lost or stolen.
In the unfortunate event that your fuel card(s) are lost, stolen or cloned, you won't be held liable for any fraudulent transactions on your account from the point you notify us.
As Zero Liability is an optional service, you can remove this from your account at any time. Please complete the relevant details using this link: [Allstar Business Solutions Zero Liability - Opt Out]
Once submitted, requests can take up to 10 working days to process during which time you will still be liable for any charges as per our terms and conditions.
Kind regards,
Allstar Customer Support
```

**Constraint 4 (TOPIC CLASSES):** add the three keys to the information topics, next to returned_direct_debit:

```
Information topics (no portal action): returned_direct_debit, ecopoint, extended_payment_terms,
zero_liability. In a multi-intent email, put each one's paragraph(s) after the PORTAL BLOCK and
before the closing; keep each opt-out link with its own topic.
```

**PROD:** none of Part B goes to 13 or 12 until Corpay approves the use cases. New intents stay out of PROD by staying out of the PROD AI Actions.

---

## Confirm with Corpay

1. **Picklist spellings.** Sub Topic `Ecopoint`, `Extended Payment Terms` and `Zero Liability` under Topic `Fee`. These are the use-case docs' spelling. Sub_Topic__c is a restricted picklist, so check it against Gemma's matrix. (Returned direct debit is lower case in Salesforce.)
2. **EPT copy.** "extended from the standard 7 days or 37 days" reads like it may mean "to 37 days". It is kept verbatim until Corpay says otherwise.
3. **Ecopoint website link.** The doc shows the raw address. It is written here as "[our website]" per tracker item 7.
4. **Apology line (A.3).** Do they want it?
