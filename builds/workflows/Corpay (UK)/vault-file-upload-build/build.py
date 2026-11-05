import json, copy, sys
sys.path.insert(0, sys.argv[1])
from scripts import S2, S5, S8, S11, S15, SCRIPT_CODE
BASE = sys.argv[2]
OUT = sys.argv[3]
src = json.load(open(BASE))
tmpl = copy.deepcopy(src['nodes']['6'])
ORG = "605565"

def node(nid, typ, title, name, content="", cont="0", buttons=None, formfields=None, dco=None, adv="0", y=0, x=600):
    n = copy.deepcopy(tmpl)
    n.update({"type": typ, "is_root": "1" if nid == 1 else "0", "page_title": title, "node_name": name,
              "content": content, "project_node_id": str(nid), "display_order": str(nid),
              "continuation_node_id": str(cont), "advanced_logic_node": adv,
              "x": str(x), "y": str(y), "formfields": {}, "buttons": {}, "data_connected_objects": {}, "app_messages": {}})
    for i, b in enumerate(buttons or []):
        text, link, expr, op = b
        n["buttons"][str(i)] = {"button_text": text, "hover_text": "", "button_link": str(link), "rank": str(i+1),
                                "button_data": "", "logic_expression": expr, "wizard_skip": "0", "value": "0", "op": op, "updated": "0"}
    for i, f in enumerate(formfields or []):
        ff = {"type": f[0], "name": f[1], "label": f[2], "label_type": "L", "options": f[3] if len(f) > 3 else "",
              "hidden_value": "", "custom_regex": "", "inline": "0", "required": f[4] if len(f) > 4 else "0",
              "score_var": "", "checkbox_score": "1", "scores": "", "rank": str(i+1), "config": ""}
        n["formfields"][str(i)] = ff
    if dco:
        n["data_connected_objects"] = {"0": {"org_id": ORG, "data_connected_object_id": str(dco), "data_connected_object_type": "http"}}
    return n

def router(nid, title, name, branches, default, y):
    btns = [(e, link, e, "") for e, link in branches] + [("", default, "", "def")]
    return node(nid, "Scoring", title, name, cont=default, buttons=btns, adv="1", y=y)

SCENARIOS = "test_success\ntest_vault_link_404\ntest_link_expired\ntest_sf_file_too_large\ntest_sf_bad_case_id\ntest_delete_fails"
SCOPES = "mock_all_requests\nmock_salesforce_only\nmock_none"

C1 = ("<p><strong>Vault File Upload: test and maintenance.</strong> Upload a file into the Zingtree vault, "
      "attach it to a Salesforce case and delete the vault copy, with every failure graded.</p>"
      "<p>Pick a scenario to see a failure path. Failure scenarios fail on the first attempt and succeed on "
      "Retry, without uploading the file again. Native upload errors (blocked type, over 35 MB) show on the field.</p>")
C7 = ("<p>File received: <strong>${file_name}</strong></p><p>Salesforce case: <strong>${case_id}</strong></p>"
      "<p>The file is read in the background. Select <strong>Attach to case</strong> to upload it to Salesforce.</p>")
C14 = ("<p style=\"color:#b91c1c;font-weight:600;\">The file was not attached.</p>"
       "<p>${vault_upload_error}</p><p>Status: <code>${vault_upload_status}</code> &middot; attempt ${vault_attempt}</p>"
       "<p>The uploaded file is still in the vault, so Retry fetches a fresh link for the same file.</p>")
C16 = "${transforms.vault_result_html}"

CLAUDE = open(sys.argv[4]).read()

N = {}
N["1"] = node(1, "Content", "Upload a file for the case", "Agent uploads the file (required vault field) and, for testing, picks a scenario and mock scope", C1, cont="0",
    buttons=[("Continue", 2, "", "")],
    formfields=[("vault_file", "vault_file_uid", "File", "", "1"),
                ("text", "test_case_id", "Salesforce Case Id (blank uses the mock case)"),
                ("select", "test_scenario", "Test scenario", SCENARIOS, "1"),
                ("select", "test_mock_scope", "API requests", SCOPES, "1")], y=40)
N["2"] = node(2, "Script", "Start the attempt", "Counts the attempt, sets the case id and mock scope, seeds mocked responses for the chosen scenario", S2, cont=3, y=140)
N["3"] = router(3, "File uploaded? Fetch the link live?", "No file goes to the failure screen; mocked runs skip the vault call (the seed already filled zingtree__get_vault_file)", [("has_file == 'false'", 14), ("mock_vault == 'true'", 5)], 4, 240)
N["4"] = node(4, "Data", "Get the vault download link", "GET /api/v1/vault_files/{file_uid}: a presigned S3 link valid for 60 seconds", cont=5, dco=1301, y=340)
N["5"] = node(5, "Script", "Grade the download link", "Grades the GET, publishes the link for the browser script and pulls the file name out of the link", S5, cont=6, y=440)
N["6"] = router(6, "Download link received?", "A failed link goes to the failure screen", [("is_link_ok == 'true'", 7)], 14, 540)
N["7"] = node(7, "Content", "Ready to attach", "Shows the file and case while the browser reads the file", C7, buttons=[("Attach to case", 8, "", "")], y=640)
N["8"] = node(8, "Script", "Stage the file for Salesforce", "Moves the base64 contents to a transform for the Salesforce template and blanks the form data copy", S8, cont=9, y=740)
N["9"] = router(9, "Send to Salesforce?", "Unread file to the failure screen; mocked runs skip the Salesforce call", [("sf_route == 'error'", 14), ("sf_route == 'mock'", 11)], 10, 840)
N["10"] = node(10, "Data", "Attach the file to the Salesforce case", "POST ContentVersion with FirstPublishLocationId = case id", cont=11, dco=1303, y=940)
N["11"] = node(11, "Script", "Grade the Salesforce upload", "Grades the ContentVersion create, drops the file contents and picks the delete route", S11, cont=12, y=1040)
N["12"] = router(12, "Delete the vault copy?", "Delete only after Salesforce confirms; mocked runs skip the delete call", [("delete_route == 'error'", 14), ("delete_route == 'mock'", 15)], 13, 1140)
N["13"] = node(13, "Data", "Delete the file from the vault", "DELETE /api/v1/vault_files/{file_uid}: 204 on success", cont=15, dco=1302, y=1240)
N["14"] = node(14, "Content", "File not attached", "One failure screen for every step: reason, status, retry with the same file or upload another", C14,
    buttons=[("Retry with the same file", 2, "", ""), ("Upload a different file", 1, "", "")], y=640, x=900)
N["15"] = node(15, "Script", "Grade the delete and build the result", "A failed delete keeps the attach and flags the vault copy for cleanup", S15, cont=16, y=1340)
N["16"] = node(16, "Content", "File attached to the case", "Result: file, case, ContentVersion id, vault copy state, attempts", C16, y=1440)
N["17"] = node(17, "Content", "claude.md", "In-tree memory for this workflow. Not linked.", CLAUDE, y=40, x=1200)
N["17"]["hide_from_search"] = "1"

tree = {k: v for k, v in src.items() if k not in ("nodes", "predefined_vars")}
tree.update({"id": "0", "name": "Vault File Upload - Test and Maintenance",
             "description": "Corpay UK vault file upload: vault field, download link, browser read, Salesforce ContentVersion, vault delete. Every step graded, one failure screen with retry, Test Mode scenarios.",
             "root_node_id": "1", "org_id": ORG, "script_code": SCRIPT_CODE, "live": "0",
             "create_date": "", "last_opened": "", "last_modified": "", "hide_back_button": "1", "show_restart_button": "1",
             "merge_vars_not_fixed": "1", "css_include": "https://assets.zingtree.com/managed/templates/salesforce_2026.css"})
tree["nodes"] = N
tree["predefined_vars"] = {}
json.dump(tree, open(OUT, "w"), indent=1)
print("written", OUT, len(N))
