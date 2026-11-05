# Corpay UK AI Action patches, 2026-10-09

Goes with `Email Automation - AI Actions INT (9 Oct quick texts + case status 2026-10-09).json`.
Apply to INT AI Action **15 `automate_email_generation_int`** (UK org 123) via GET /ai-agents-svc/ai-actions/ids/15
then PUT /ai-agents-svc/ai-actions. Save the GET response first. Re-read after saving. No change to 16 (detection
phrases and error escalation unchanged). PROD twin 12 gets the same patch only when this release is promoted.

Source: Charley Gunning, "Daily AI standup - 9th Oct", attachments "Allstar - Card groups PH1" and
"Allstar - Returned direct debit PH1". Copy verbatim; links as linked text (tracker 7), same markup as card_pins.

## returned_direct_debit template: replace the second paragraph

Old: If you wish to not be charged this fee, then you will need to ensure that all Direct debits are paid on time as per your agreed date.
New: Going forward, to avoid this fee, please ensure your Direct Debit payment is made on the agreed payment date.

## card_group_move template: replace in full

```
Hello,
Thank you for your email.
As an Authorised User on the account, you can use your Allstar Online Portal to move a card between card groups or from one sub-account to another.
To do this, [log in] to your portal and navigate to the 'Cards' section. Once you have found the relevant card, hover over the 3 dots:
<strong>To move a card between sub-accounts:</strong> Select 'Move Card' and follow the on-screen instructions.
<strong>Note</strong> - cards can only be moved between sub-accounts under the same top-level account. In addition, unless you select a different effective date, the card move will be completed overnight.
<strong>For card groups:</strong> Select 'Manage Card' and follow the on-screen instructions to choose the correct card group.
<strong>Note</strong> - you can only change card groups within the same account structure (all sub-accounts under the same top-level account). Once the change has been processed, this will appear in the correct card group the following day.
Should you require further support on how to do this, please go to our 'Help' section within your portal where you'll find further information. Alternatively, we've created a [short video] which explains how to manage your account with Allstar Online.
Kind regards,
Allstar Customer Support
```

[log in] -> http://www.allstaronline.co.uk ; [short video] -> https://premiercxvideo.wistia.com/s/5rq963zoeep2gdp
Each line is its own paragraph (no bullets inside this template).

## Multi-intent formatting: add to the PORTAL BLOCK / multi-intent instruction

```
When card_group_move is combined with other intents in one reply, its 'Note' lines are never part of a bullet
point. Write the card group step as its bullet (or paragraph), close the list, then put each Note as its own
separate paragraph directly underneath, before any further bullets or paragraphs.
```
