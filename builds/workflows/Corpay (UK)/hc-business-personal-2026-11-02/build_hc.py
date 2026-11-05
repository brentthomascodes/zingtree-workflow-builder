# Homecharge branch INT 698599608: new intent hc_business_personal_charges
# Source: Gemma Danks, "Daily AI standup - 2nd Nov" 15:34 GMT, attachment
# "Phase 1 Allstar Homecharge - Business Personal Charges.docx" -> INT Thu 5 Nov.
# Topic HC-Online / Sub Topic Business/Personal Charges. Two approved replies (4a driver, 4b fleet manager),
# chosen on screen 21 with the AI pre-selecting from who sent the email.
import json, sys
src, out = sys.argv[1], sys.argv[2]
t = json.load(open(src)); N = t["nodes"]

c = N["19"]["content"]
a = '  hc_resent_onboarding_email: { topic: "HC-Online",     subtopic: "Resent Onboarding Email" }\n'
assert c.count(a) == 1
c = c.replace(a, '  hc_resent_onboarding_email: { topic: "HC-Online",     subtopic: "Resent Onboarding Email" },\n'
                 '  hc_business_personal_charges: { topic: "HC-Online", subtopic: "Business/Personal Charges" }\n')
a = '''      { value: "underpayment_response", label: "Driver claiming underpayment" }
    ]
  }
];'''
assert c.count(a) == 1
c = c.replace(a, '''      { value: "underpayment_response", label: "Driver claiming underpayment" }
    ]
  },
  {
    intent: "hc_business_personal_charges",
    fallback: "driver_multi_ev_pushback",
    options: [
      { value: "driver_multi_ev_pushback", label: "Driver Multi EV Mode (Pushback)" },
      { value: "fleet_manager_multi_ev_response", label: "Fleet Manager enabling Multi EV Mode response" }
    ]
  }
];''')
N["19"]["content"] = c

c = N["24"]["content"]
a = 'let hc_copy_approved = requester_type === "driver";\n'
assert c.count(a) == 1
c = c.replace(a, '// Business/Personal Charges has approved copy for both audiences; the reply choice on screen 21 picks it.\n'
                 'let hc_copy_approved = requester_type === "driver" || base === "hc_business_personal_charges";\n')
N["24"]["content"] = c

c = N["48"]["content"]
c = c + "<p>2026-11-02: new intent hc_business_personal_charges (Gemma Danks, 2 Nov use case): node 19 map row HC-Online / Business/Personal Charges + variant group (Driver Multi EV Mode (Pushback) / Fleet Manager enabling Multi EV Mode response); node 24 marks both replies as approved copy. AI Actions 19 / 18.</p>"
N["48"]["content"] = c
json.dump(t, open(out, "w"), ensure_ascii=False, indent=1)
print("built", out)
