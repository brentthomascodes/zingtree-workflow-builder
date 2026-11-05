S2 = r'''// Starts every attempt: counts it, picks the mock scope and seeds the mocked responses.
// mock_all_requests     - nothing leaves Zingtree. The only setting that works in sandbox 605565,
//                         whose Data Sources hold placeholder keys.
// mock_salesforce_only  - the vault link and delete run live (needs the real Zingtree API key);
//                         the Salesforce upload is mocked.
// mock_none             - every request is live.
// Failure scenarios fail on the first attempt only, so Retry shows the recovery.
// Mocked error bodies are illustrative; no real non-2xx body has been captured yet.

// --- inputs -----------------------------------------------------------------
let vault_attempt = Number(ZT.getVariableValue("vault_attempt", 0)) + 1;
let test_scenario = ZT.getVariableValue("test_scenario", "test_success");
let test_mock_scope = ZT.getVariableValue("test_mock_scope", "mock_all_requests");
let test_case_id = ZT.getVariableValue("test_case_id", "");
let vault_file_uid = ZT.getVariableValue("vault_file_uid", "");

// --- file check ---------------------------------------------------------------
// The vault field's required flag is not enforced, and a failed upload leaves it empty.
let has_file = vault_file_uid !== "";
let no_file_error = "No file was uploaded. The upload field rejects blocked file types and files over 35 MB. Upload the file again.";

// --- scope and scenario -------------------------------------------------------
let mock_vault = test_mock_scope === "mock_all_requests";
let mock_salesforce = test_mock_scope !== "mock_none";
let failing = vault_attempt === 1 ? test_scenario : "test_success";
let case_id = test_case_id === "" ? "500Ad00000MOCK0001" : test_case_id;

// --- mocked responses ---------------------------------------------------------
// A data: URL stands in for the presigned S3 link so the browser read runs for real.
// The fragment makes each attempt's link unique so the browser reads it again on retry.
let mock_link = `data:text/plain;base64,TW9jayB2YXVsdCBmaWxlIC0gQ29ycGF5IFVLIHRlc3QgbW9kZS4K#attempt-${vault_attempt}`;
const linkByScenario = {
  test_vault_link_404: { _zt_meta: { response: { code: 404, body: "File not found" } } },
  test_link_expired: { _zt_meta: { response: { code: 200 } }, download_url: "https://zingtree.com/api/v1/vault_files/expired-link-test" }
};
const salesforceByScenario = {
  test_sf_file_too_large: { _zt_meta: { response: { code: 413, body: "Request Entity Too Large" } } },
  test_sf_bad_case_id: { _zt_meta: { response: { code: 400, body: `[{"message":"Field FirstPublishLocationId: id value of incorrect type: ${case_id}","errorCode":"FIELD_INTEGRITY_EXCEPTION"}]` } } }
};
const deleteByScenario = {
  test_delete_fails: { _zt_meta: { response: { code: 500, body: "Internal Server Error" } } }
};
if (mock_vault) {
  ZT.setResponseData("zingtree__get_vault_file", linkByScenario[failing] || { _zt_meta: { response: { code: 200 } }, download_url: mock_link });
  ZT.setResponseData("zingtree__delete_vault_file", deleteByScenario[failing] || { _zt_meta: { response: { code: 204 } } });
}
if (mock_salesforce) {
  ZT.setResponseData("sfdc__create_content_version", salesforceByScenario[failing] || { _zt_meta: { response: { code: 201 } }, id: "068Ad00000MOCK0001", success: true, errors: [] });
}

// --- outputs ----------------------------------------------------------------
ZT.setFormData("vault_attempt", vault_attempt);
ZT.setFormData("mock_vault", mock_vault ? "true" : "false");
ZT.setFormData("mock_salesforce", mock_salesforce ? "true" : "false");
ZT.setFormData("case_id", case_id);
// Cleared so the browser sees the new link as a change and reads the file again.
ZT.setFormData("vault_download_url", "");
ZT.setFormData("file_base64", "");
ZT.setFormData("file_read_error", "");
ZT.setFormData("has_file", has_file ? "true" : "false");
ZT.setFormData("vault_upload_status", has_file ? "in_progress" : "failed_no_file");
ZT.setFormData("vault_upload_error", has_file ? "" : no_file_error);
'''

S5 = r'''// --- inputs -----------------------------------------------------------------
let link = actions.zingtree__get_vault_file;
let vault_file_uid = ZT.getVariableValue("vault_file_uid", "");

// --- grade the call -----------------------------------------------------------
let response_code = link._zt_meta.response.code;
let is_link_ok = response_code >= 200 && response_code < 300;
let download_url = is_link_ok ? link.download_url : "";
let error = is_link_ok ? "" : `Getting the download link failed: Zingtree returned ${response_code}. ${link._zt_meta.response.body}`;

// The vault keeps only the file id; the original name rides in the link's
// response-content-disposition parameter.
let name_match = decodeURIComponent(download_url).match(/filename="([^"]+)"/);
let file_name = name_match ? name_match[1] : `vault-file-${vault_file_uid}`;

// --- outputs ----------------------------------------------------------------
// The tree's browser script reads the file as soon as vault_download_url changes.
ZT.setFormData("vault_download_url", download_url);
ZT.setFormData("file_name", file_name);
ZT.setFormData("is_link_ok", is_link_ok ? "true" : "false");
ZT.setFormData("vault_upload_status", is_link_ok ? "in_progress" : "failed_link");
ZT.setFormData("vault_upload_error", error);
'''

S8 = r'''// --- inputs -----------------------------------------------------------------
// file_base64 and file_read_error are written by the tree's browser script.
let file_base64 = ZT.getVariableValue("file_base64", "");
let file_read_error = ZT.getVariableValue("file_read_error", "");
let file_name = ZT.getVariableValue("file_name", "");
let mock_salesforce = ZT.getVariableValue("mock_salesforce", "true");

// --- route --------------------------------------------------------------------
let is_file_ready = file_base64 !== "";
let sf_route = "live";
if (!is_file_ready) sf_route = "error";
else if (mock_salesforce === "true") sf_route = "mock";
let read_problem = file_read_error === "" ? "The file was not ready yet. Large files take a few seconds to read." : file_read_error;
let error = is_file_ready ? "" : `Reading the file failed: ${read_problem} Retry with the same file.`;

// --- outputs ----------------------------------------------------------------
// Both transforms are read by the sfdc__create_content_version body template.
// file_name_json is escaped for its quoted slot in that template.
ZT.setTransformData("file_base64", file_base64);
ZT.setTransformData("file_name_json", JSON.stringify(file_name).slice(1, -1));
// The file contents and the signed link leave form data here, so neither stays in session data.
ZT.setFormData("file_base64", "");
ZT.setFormData("vault_download_url", "");
ZT.setFormData("sf_route", sf_route);
ZT.setFormData("vault_upload_status", is_file_ready ? "in_progress" : "failed_read");
ZT.setFormData("vault_upload_error", error);
'''

S11 = r'''// --- inputs -----------------------------------------------------------------
let upload = actions.sfdc__create_content_version;
let mock_vault = ZT.getVariableValue("mock_vault", "true");

// --- grade the call -----------------------------------------------------------
let response_code = upload._zt_meta.response.code;
let is_attached = response_code >= 200 && response_code < 300 && upload.success === true;
let content_version_id = is_attached ? upload.id : "";
let error = is_attached ? "" : `Uploading to Salesforce failed: Salesforce returned ${response_code}. ${upload._zt_meta.response.body}`;
let delete_route = "live";
if (!is_attached) delete_route = "error";
else if (mock_vault === "true") delete_route = "mock";

// --- outputs ----------------------------------------------------------------
// The upload is done either way; the file contents are dropped now instead of at the 1-hour expiry.
ZT.setTransformData("file_base64", "");
ZT.setFormData("content_version_id", content_version_id);
ZT.setFormData("delete_route", delete_route);
ZT.setFormData("vault_upload_status", is_attached ? "in_progress" : "failed_salesforce");
ZT.setFormData("vault_upload_error", error);
'''

S15 = r'''// --- inputs -----------------------------------------------------------------
let removal = actions.zingtree__delete_vault_file;
let file_name = ZT.getVariableValue("file_name", "");
let case_id = ZT.getVariableValue("case_id", "");
let content_version_id = ZT.getVariableValue("content_version_id", "");
let vault_attempt = Number(ZT.getVariableValue("vault_attempt", 1));

// --- grade the call -----------------------------------------------------------
// A failed delete does not undo the attach: the file stays in the vault for the scheduled cleanup.
let response_code = removal._zt_meta.response.code;
let is_deleted = response_code >= 200 && response_code < 300;
let status = is_deleted ? "attached" : "attached_delete_failed";
let error = is_deleted ? "" : `The file is on the case, but deleting it from the vault failed: Zingtree returned ${response_code}. ${removal._zt_meta.response.body} The scheduled cleanup will remove it.`;
let vault_line = is_deleted ? "Deleted" : `<span style="color:#b45309;font-weight:600;">Still in the vault</span>`;

// --- result screen ------------------------------------------------------------
let rows = [
  ["File", file_name],
  ["Salesforce case", case_id],
  ["ContentVersion", content_version_id],
  ["Vault copy", vault_line],
  ["Attempts", vault_attempt]
];
let rows_html = "";
for (let i = 0; i < rows.length; i++) {
  rows_html += `<tr><th style="text-align:left;padding:6px 12px 6px 0;color:#555;font-weight:600;">${rows[i][0]}</th><td style="padding:6px 0;">${rows[i][1]}</td></tr>`;
}
let note_html = is_deleted ? "" : `<p style="color:#b45309;">${error}</p>`;
let html = `
  <p style="color:#15803d;font-weight:600;">The file is attached to the Salesforce case.</p>
  <table style="border-collapse:collapse;">${rows_html}</table>
  ${note_html}`;

// --- outputs ----------------------------------------------------------------
ZT.setFormData("vault_upload_status", status);
ZT.setFormData("vault_upload_error", error);
ZT.setTransformData("vault_result_html", html.replace(/\s*\n\s*/g, " "));
'''

SCRIPT_CODE = r'''<script>
// Vault File Upload - browser behaviour, two jobs.
//
// 1. Upload screen (node 1): Continue is disabled until the vault field holds a file id, with a
//    hint under it. A click while disabled is blocked too. The vault field's own required flag
//    is not enforced, and a failed upload (blocked type, over 35 MB) leaves no file id.
//    "Start the attempt" checks the id again on the server as the backstop.
//
// 2. Reading the file: "Grade the download link" publishes the 60-second presigned link as
//    vault_download_url. As soon as it changes, this downloads the file and hands the contents
//    back as base64 in file_base64 (or the reason in file_read_error). "Stage the file for
//    Salesforce" moves the contents to a transform and blanks both form values, so the file
//    never stays in session data.
const uploadScreenNodeIds = ["1"];
let lastReadUrl = "";

function isUploadScreen() {
  return uploadScreenNodeIds.includes(String(this_node_id));
}

function hasUploadedFile() {
  return Boolean(form_data && form_data.vault_file_uid);
}

function findContinueButton() {
  return [...document.querySelectorAll(".answers a.btn")].find(a => a.innerText.trim() === "Continue");
}

function gateUploadContinue() {
  const button = findContinueButton();
  if (!isUploadScreen() || !button) return;
  const ready = hasUploadedFile();
  button.classList.toggle("disabled", !ready);
  button.setAttribute("aria-disabled", ready ? "false" : "true");
  button.style.pointerEvents = ready ? "" : "none";
  button.style.opacity = ready ? "" : "0.5";
  let hint = document.getElementById("vault-upload-hint");
  if (!hint) {
    hint = document.createElement("p");
    hint.id = "vault-upload-hint";
    hint.style.cssText = "margin:8px 0 0;font-size:13px;color:#b45309;text-align:center;";
    button.insertAdjacentElement("afterend", hint);
  }
  hint.textContent = ready ? "" : "Upload a file to continue. Blocked file types and files over 35 MB are rejected by the upload field.";
}

async function readVaultFile(url) {
  const response = await fetch(url);
  if (!response.ok) throw new Error(`The download returned status ${response.status}.`);
  const bytes = new Uint8Array(await response.arrayBuffer());
  let binary = "";
  for (let i = 0; i < bytes.length; i += 0x8000) {
    binary += String.fromCharCode.apply(null, bytes.subarray(i, i + 0x8000));
  }
  return btoa(binary);
}

document.addEventListener("click", (event) => {
  const button = findContinueButton();
  if (!isUploadScreen() || !button || hasUploadedFile() || !button.contains(event.target)) return;
  event.preventDefault();
  event.stopPropagation();
  gateUploadContinue();
}, true);

whenEvent("render:finish", gateUploadContinue);

whenEvent("formDataUpdated", async (changes) => {
  gateUploadContinue();
  const url = changes ? changes.vault_download_url : "";
  if (!url || url === lastReadUrl) return;
  lastReadUrl = url;
  try {
    const contents = await readVaultFile(url);
    assignSessionVar("file_read_error", "");
    assignSessionVar("file_base64", contents);
  } catch (error) {
    assignSessionVar("file_base64", "");
    assignSessionVar("file_read_error", error.message);
  }
});
</script>'''
