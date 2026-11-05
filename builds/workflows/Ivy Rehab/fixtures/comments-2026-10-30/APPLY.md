# Ivy Incoming Call: lead + appointment comments (2026-10-30)

Edit live in the Incoming Call editor (the 10/23 export is stale: node 2 and the failed-lead routing changed on 10/28).

## 1. Node 128 "Format Lead Comments" (append at end)
```js
// --- stage the lead comment -------------------------------------------------
// raintree__create_lead (107) reads "comm": "${comment_json}". Raintree removed the comment
// length limit, so the full call summary goes on the lead. JSON.stringify escapes quotes,
// backslashes and line breaks; .slice(1, -1) drops its outer quotes (the body supplies them).
ZT.setFormData("comment_json", JSON.stringify(String(summary_text)).slice(1, -1));
```
Flow is 105 -> 128 -> 1 -> ... -> 107 Create Lead, so 128 sets comment_json before the lead call
(and overrides the empty value node 105 stages from the unused `comment` variable).
CO 1067 already has `"comm": "${comment_json}"` - no CO change needed. Confirm that in the CO.

## 2. Node 138 "Format Appointment Details" (append at end)
```js
// --- stage the appointment comment ------------------------------------------
// raintree__update_appointment_by_id (141) reads the call summary from appointment_comment_json,
// escaped for a quoted JSON slot the same way as the lead comment.
ZT.setFormData("appointment_comment_json", JSON.stringify(String(summary_text)).slice(1, -1));
```

## 3. CO 1068 raintree__update_appointment_by_id body
Add the appointment comment key (field name per Raintree appointment PATCH docs, likely `comments`):
`"comments": "${appointment_comment_json}"`
CO edits go live immediately. Until the tree is published this value is empty, so check the
Raintree update does not blank existing appointment comments when it's sent "" . If it does,
make this CO edit at publish time, or leave the key out until then.

## Test (preview)
Run a new-patient call with a note containing: He said "call me at 5" & it's urgent!
Check Execution Insights for 107 (comm) and 141 (comments) request bodies, then the lead and
appointment in Raintree. Offline escaping test: 5/5 (quotes, &, @, $, %, <tags>, backslash, tab, unicode, 5000 chars).
