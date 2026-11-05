# Master INT 109029630 Test Mode: two scenarios for hc_business_personal_charges (Gemma Danks, 2 Nov).
import json, sys
src, out = sys.argv[1], sys.argv[2]
t = json.load(open(src)); N = t["nodes"]
f = N["44"]["formfields"]["0"]
a = "test_hc_resent_onboarding_email\n"
assert f["options"].count(a) == 1
f["options"] = f["options"].replace(a, a + "test_hc_business_personal_driver\ntest_hc_business_personal_fleet\n")

c = N["45"]["content"]
a = "  test_hc_fleet_requester: {\n"
assert c.count(a) == 1
c = c.replace(a, '''  test_hc_business_personal_driver: {
    subject: "Home charger for work and personal use",
    body: "Hi,\\n\\nI use my EV for business and personal and charge it at home. I need business charging separated from personal so I can claim only business charging.\\n\\nHow do I do this?\\n\\nThanks,\\nDaniel Hughes"
  },
  test_hc_business_personal_fleet: {
    subject: "Driver has two EVs at home",
    body: "Hello,\\n\\nI manage the fleet for Brookfield Services. One of our drivers, Amy Clarke, has two EVs at home and needs both vehicles linked to the account. She charges for work and personal use.\\n\\nCan you enable multi EV mode for her?\\n\\nKind regards,\\nMark Ellis\\nFleet Manager"
  },
''' + a)
N["45"]["content"] = c

c = N["47"]["content"]
a = 'contactId: test_intent === "test_hc_fleet_requester" ? "003Ad00000MOCK0001" : null'
assert c.count(a) == 1
c = c.replace(a, 'contactId: (test_intent === "test_hc_fleet_requester" || test_intent === "test_hc_business_personal_fleet") ? "003Ad00000MOCK0001" : null')
N["47"]["content"] = c

N["48"]["content"] = N["48"]["content"].replace("</pre>",
  "\n2026-11-02: Test Mode scenarios test_hc_business_personal_driver / test_hc_business_personal_fleet (44, 45; 47 mocks a Contact for the fleet one) for hc_business_personal_charges (Gemma Danks, 2 Nov).</pre>", 1)
json.dump(t, open(out, "w"), ensure_ascii=False, indent=1)
print("built", out)
