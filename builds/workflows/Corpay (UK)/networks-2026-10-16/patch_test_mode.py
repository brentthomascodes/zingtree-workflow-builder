# Test Mode: Networks scenarios in the master (44 dropdown, 45 example emails, 47 queue seed).
# Runs on the master output of build_networks.py.
import json
P = "0 MASTER - Email Automation - AI Actions INT 109029630 (Networks route 2026-10-16).json"
master = json.load(open(P)); MN = master["nodes"]
ff = MN["44"]["formfields"]["0"]
for key in ["test_networks_remittance_copy", "test_networks_remittance_wrong", "test_networks_other_out_of_scope", "test_networks_merchant_ineligible"]:
    if key not in ff["options"].split("\n"):
        ff["options"] += "\n" + key
EX = (
 '  test_networks_remittance_copy: {\n    subject: "Remittance request",\n'
 '    body: "Hello,\\n\\nPlease can you send me my remittance for the payment made last week? I need a copy of my remittance for our accounts.\\n\\nThanks,\\nGary Lowe\\nLowe Motors"\n  },\n'
 '  test_networks_remittance_wrong: {\n    subject: "Remittance query",\n'
 '    body: "Hi,\\n\\nThe remittance I have received is wrong. The amount does not match what was paid into our account.\\n\\nRegards,\\nGary Lowe\\nLowe Motors"\n  },\n'
 '  test_networks_merchant_ineligible: {\n    subject: "Remittance copy please",\n'
 '    body: "Hello,\\n\\nCan you send me my remittance for last month please? I need a copy of my remittance for our books.\\n\\nThanks,\\nPriya Nair\\nNair Service Station"\n  },\n'
 '  test_networks_other_out_of_scope: {\n    subject: "Card terminal question",\n'
 '    body: "Hello,\\n\\nOur card terminal stopped accepting Allstar cards this morning. Who do we speak to?\\n\\nThanks,\\nGary Lowe"\n  },\n')
a45 = '  test_hc_other_out_of_scope: {'
c45 = MN["45"]["content"]; assert c45.count(a45) == 1
MN["45"]["content"] = c45.replace(a45, EX + a45)
c47 = MN["47"]["content"]
a47 = 'let route = test_intent.indexOf("test_hc_") === 0 ? "homecharge" : "fast_admin";'
assert c47.count(a47) == 1
c47 = c47.replace(a47, 'let route = test_intent.indexOf("test_hc_") === 0 ? "homecharge"\n  : (test_intent.indexOf("test_networks_") === 0 ? "networks" : "fast_admin");')
a47b = '  homecharge: {\n    queue: "Allstar_Chargepass",'
assert c47.count(a47b) == 1
c47 = c47.replace(a47b, '  networks: {\n    queue: "Networks_General", caseNumber: "02716248",\n    suppliedEmail: "test.merchant@example.co.uk",\n    toAddress: "networks@allstarcard.co.uk",\n    ccAddress: null,\n    accountAdmin: "SME Unmanaged", contactId: null\n  },\n' + a47b)
old_c = "// The scenario key carries it: test_hc_ scenarios mock a Homecharge case, everything else a\n// FAST Admin one."
assert old_c in c47
c47 = c47.replace(old_c, "// The scenario key carries it: test_hc_ scenarios mock a Homecharge case, test_networks_ a\n// Networks case, everything else a FAST Admin one.")
a47c = 'Account_Segment__c: "SME", AS_Account_Administrator__c: mockCase.accountAdmin }]'
assert c47.count(a47c) == 1
# test_networks_merchant_ineligible: a Corporate account fails eligibility (screen 9), so QA can
# test the Networks-only Merchant Request button before Salesforce sends real Networks cases.
c47 = c47.replace(a47c, 'Account_Segment__c: test_intent === "test_networks_merchant_ineligible" ? "Corporate" : "SME", AS_Account_Administrator__c: mockCase.accountAdmin }]')
MN["47"]["content"] = c47
mc = MN["48"]
mc["content"] = mc["content"].replace("Networks sender address still blank: Corpay to confirm.</pre>", "Test Mode: test_networks_remittance_copy / _remittance_wrong / _other_out_of_scope / _merchant_ineligible (44/45/47). Networks sender address still blank: Corpay to confirm.</pre>")
json.dump(master, open(P, "w"), indent=1, ensure_ascii=False)
print("test mode patched")
