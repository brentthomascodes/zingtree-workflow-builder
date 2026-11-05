# Register Errand: Cancellations — Agent Guide

This workflow walks you through registering a cancellation errand for an order. You pick the PNRs and the action taken for each, and the workflow handles the rest automatically — creating the Zendesk tickets, posting the internal note, and registering the errand in Edvin.

## Before you start

The workflow opens against the order already in context from the ticket. You don't need to look anything up first.

## Step by step

**1. Select the PNR(s).** The first screen lists the PNRs on the order. Tick the one(s) this errand applies to and continue.

> **Testing only:** during testing you'll also see a **Contact reason** dropdown on this screen (Rebooking, Cancellation, Refund, etc.). Pick the reason that matches the case. **In Zendesk this is not shown** — the contact reason is passed in automatically from the ticket, so live agents won't select it.

**2. Select the passenger(s).** Choose the passengers the errand covers, then continue.

**3. Select the type and confirm the channel.** Pick the specific type for the request. The channel (Phone / Chat / Email) comes from the ticket automatically.

**4. Choose the action per PNR.** You'll see a card for each PNR with its details. For each one, pick the **customer action** you took from the dropdown. Repeat until every PNR has an action.

**5. Review and submit.** Once actions are set for all PNRs, submit. From here everything is automatic.

## What happens automatically after you submit

- **Tickets are created in Zendesk** — a child ticket for actions that proceed, silent tickets for the rest, and grandchild tickets where a single PNR needs more than one action.
- **An internal note is posted** to the ticket summarizing every PNR, its contact reason, action, and the tickets created.
- **The errand is registered in Edvin** for each PNR.
- **The ticket is tagged** to mark the errand as completed.

## Handling more than one request

After the errand is registered you'll reach a closing screen. If the customer has **another request**, choose to start again — the workflow resets and returns you to the order so you can register a second errand on the same ticket.

## Tips

- If a PNR shows no selectable actions, make sure the correct type was chosen on the earlier screen.
- Pick an action for **every** PNR before submitting — PNRs left blank are treated as "no action" (a silent ticket), not skipped.
- You can register multiple errands on one ticket using the "additional request" path — you don't need to reopen the app.

## Notes for the build team (not agent-facing)

- The **Contact reason** dropdown (field `contact_reason` on the first screen) exists for testing only. In production it is supplied by Zendesk (`custom_field_29658558478738`) and the dropdown should be hidden. See the open mapping issue between the Zendesk contact-reason values and Edvin's category names before going live.
