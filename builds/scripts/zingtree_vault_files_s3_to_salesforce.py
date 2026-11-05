# SOURCE: Cowork session "Zingtree S3 files to Salesforce" (local_2be5e437)
# ACCOUNT: (internal / general Zingtree platform question)
# PURPOSE: External integration script (not a Zingtree Script Node). Uses the Zingtree vault_files API:
#          GET /api/v1/vault_files/{file_uid} returns a pre-signed S3 download_url valid for 60 seconds;
#          downloads the file, uploads it to a Salesforce Case as a ContentVersion, then
#          DELETE /api/v1/vault_files/{file_uid} (expects 204). file_uid comes from session form data.

import requests

ZINGTREE_API_KEY = "YOUR_ORG_API_KEY"
SF_INSTANCE_URL = "https://yourorg.salesforce.com"
SF_ACCESS_TOKEN = "YOUR_SF_ACCESS_TOKEN"
SF_CASE_ID = "500XXXXXXXXXXXX"

def migrate_file_to_salesforce(file_uid, filename):
    zt_headers = {"X-Api-Key": ZINGTREE_API_KEY}

    # Step 1: Get pre-signed S3 URL (valid 60s)
    resp = requests.get(
        f"https://zingtree.com/api/v1/vault_files/{file_uid}",
        headers=zt_headers
    )
    resp.raise_for_status()
    download_url = resp.json()["download_url"]

    # Step 2: Download the file bytes immediately
    file_bytes = requests.get(download_url).content

    # Step 3: Upload to Salesforce as a ContentVersion
    sf_headers = {
        "Authorization": f"Bearer {SF_ACCESS_TOKEN}",
        "Content-Type": "application/json"
    }
    import base64
    cv_payload = {
        "Title": filename,
        "PathOnClient": filename,
        "VersionData": base64.b64encode(file_bytes).decode("utf-8"),
        "FirstPublishLocationId": SF_CASE_ID  # links directly to the case
    }
    cv_resp = requests.post(
        f"{SF_INSTANCE_URL}/services/data/v59.0/sobjects/ContentVersion",
        headers=sf_headers,
        json=cv_payload
    )
    cv_resp.raise_for_status()

    # Step 4: Delete from Zingtree
    del_resp = requests.delete(
        f"https://zingtree.com/api/v1/vault_files/{file_uid}",
        headers=zt_headers
    )
    del_resp.raise_for_status()  # expects 204

    print(f"Done. SF ContentVersion ID: {cv_resp.json()['id']}")
