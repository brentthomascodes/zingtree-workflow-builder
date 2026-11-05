# v2: the multi-fee layout text only reaches AI 15 when the email has 2+ of Ecopoint / Zero Liability /
# Extended Payment Terms (node 13 writes fee_layout_instructions; AI 15 context merges it). A single-fee
# email never sees the layout, so it cannot be applied by mistake.
import json
t = json.load(open("1 BRANCH - FAST Admin 474162496 (fee layout 2026-10-19).json"))
c = t["nodes"]["13"]["content"]
o = 'let fee_layout = intents.filter(name => multiFeeIntents.includes(name)).length >= 2 ? "multi_fee" : "standard";\n'
assert c.count(o) == 1
layout = [
  'MULTI-FEE LAYOUT (approved by Corpay, Gemma Danks, 19 Oct). This email has two or more of Ecopoint, Zero Liability and Extended Payment Terms. Write those fees as ONE section, in this structure:',
  '  Please see below an explanation of the fees that you have queried:',
  '  <p><u><strong>Zero Liability</strong></u></p> then the zero_liability template text, word for word, WITHOUT its "Once submitted, requests can take up to 10 working days..." line',
  '  <p><u><strong>Ecopoint</strong></u></p> then the ecopoint template text, word for word, WITHOUT its "Once submitted..." line',
  '  <p><u><strong>Extended Payment Terms</strong></u></p> then the extended_payment_terms template text, word for word, WITHOUT its "Once submitted..." line',
  '  (only the fees that are in this email)',
  '  Then this line ONCE, after the last fee: Once submitted for either or both fees, requests can take up to 10 working days to process during which time you will still be liable for any charges as per our terms and conditions.',
  'Never repeat "Thank you for your email." or the "Once submitted..." line. Keep every link with its own fee.',
  'If the email has ONLY fee topics, the whole email is: Hello, / Thank you for your email. / [this section] / Kind regards, / Allstar Customer Support'
]
add = ("// The approved multi-fee layout, passed to the reply AI Action (15) only when fee_layout is multi_fee.\n"
       "const multiFeeLayoutLines = " + json.dumps(layout, ensure_ascii=False, indent=2) + ";\n"
       "let fee_layout_instructions = fee_layout === \"multi_fee\" ? multiFeeLayoutLines.join(\"\\n\") : \"\";\n")
c = c.replace(o, o + add)
o2 = 'ZT.setFormData("fee_layout", fee_layout);\n'
assert c.count(o2) == 1
c = c.replace(o2, o2 + 'ZT.setFormData("fee_layout_instructions", fee_layout_instructions);\n')
t["nodes"]["13"]["content"] = c
c48 = t["nodes"]["48"]["content"]
note = " fee_layout_instructions carries the approved multi-fee layout to AI 15 only for 2+ fees."
t["nodes"]["48"]["content"] = c48[:-6] + note + "</pre>" if c48.endswith("</pre>") else c48 + note
json.dump(t, open("1 BRANCH - FAST Admin 474162496 (fee layout v2 2026-10-19).json", "w"), ensure_ascii=False)
open("/tmp/n13.js","w").write(c)
