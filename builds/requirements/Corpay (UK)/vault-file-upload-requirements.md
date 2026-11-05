# Corpay UK Vault File Upload: Test and Maintenance Tree: Requirements

Status: **Ready for build** (2026-10-19)
Account: Corpay / UK. Tree: "Vault File Upload - Test and Maintenance" (new), org `605565`
(Brent Thomas - Sandbox, US host). Source pattern: GT's demo "test doc upload sfdc"
(tree `324193954`, org `605481`, 4 nodes: vault field, `get_vault_file` CO 1253, a script that
copies `download_url` to form data, tree `script_code` that downloads and base64-encodes it).

## Context
Corpay UK (Salesforce, development and IT compliance teams) asked how vault file uploads fail,
how failures are identified, monitored and recovered, and for a sandbox walkthrough. GT's demo
covers the happy path only. Brent wants the same flow in his own org with the failure handling,
for testing, demos and maintenance. Brief: Google Doc "Corpay UK Vault File Upload: Call Brief".

## Findings from GT's demo (tested 2026-10-19)
- A blocked type (.exe) is rejected by `rev2-svc/upload-file` with 400; the widget shows a toast
  "File upload failed" and the field shows "This file type is not allowed for security reasons."
- Over 35 MB is blocked in the browser before upload: "File size exceeds the maximum size: 35 MB".
- 9 MB and 30 MB uploads succeed (about 8 and 10 seconds).
- After a failed upload the field is empty (an earlier good upload is cleared too). The field is
  not required in GT's tree, so Next continues with an empty `file` and the GET runs with no id.
- The GET response is `download_url` only (presigned S3, 60 seconds). The file name is only in
  the URL's `response-content-disposition` parameter.
- GT's tree stores the base64 file contents in form data (`download_url_temp`), so the contents
  sit in session data for the org retention period.

## R1: Upload screen blocks progress without a file
The vault field is required, so a failed or missing upload cannot continue. Native platform
errors (type, size) are left to the widget.

## R2: Every step is graded, and every failure lands on one error screen
Steps: get download link, read the file in the browser, create the Salesforce ContentVersion
(`FirstPublishLocationId` = case id), delete the vault file. Each Connected Object call is
graded on `_zt_meta.response.code` 2xx. The error screen shows which step failed and why.

## R3: Recovery without re-upload
The error screen offers "Retry with the same file" (re-fetches a fresh link with the same
`file_uid`) and "Upload a different file".

## R4: Status is recorded for monitoring
`vault_upload_status` (one of `attached`, `attached_delete_failed`, `failed_link`,
`failed_read`, `failed_salesforce`) and `vault_upload_error` (text) in form data, for the form
data report.

## R5: File contents never stay in form data
The browser writes the base64 to form data (the only channel tree `script_code` has). The next
script moves it to a transform (1 hour TTL, read by the Salesforce CO template) and blanks the
form data copy in the same step.

## R6: The vault file is deleted only after Salesforce confirms
A failed delete does not fail the attach. Status `attached_delete_failed`, file left for the
scheduled cleanup.

## R7: Test Mode with failure toggles
Org 605565 cannot make real requests. A scenario picker seeds responses with
`ZT.setResponseData` and routers skip the Data nodes. Scenarios: success, vault link 404, link
expired (the browser download fails), Salesforce file too large, Salesforce bad case id, delete
fails. Mock scope: all requests (default), Salesforce only (vault calls live once the real key
is in), none. Mocked failure scenarios fail on the first attempt and succeed on retry, to demo R3.

## R8: Placeholder credentials
Data Sources use placeholder keys ("123"); Brent replaces them. No credential in the tree.

## Out of scope
Scheduled cleanup job (Corpay UK owns it). Production Salesforce embedding (`sf_Id` predefined
var) beyond a case id input on the test screen.

## Open questions (non-blocking)
- Real non-2xx response bodies of the vault API are not documented; mocks use a plain message
  until one is captured.
- Salesforce ContentVersion responses are standard REST shapes, not yet captured in a Corpay org.

## Change requests
(none yet)
