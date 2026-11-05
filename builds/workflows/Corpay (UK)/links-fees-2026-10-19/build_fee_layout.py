# Node 13 (FAST branch): fee_layout = "multi_fee" when 2+ of Ecopoint / Zero Liability / EPT, else "standard".
# AI 15 reads it so the multi-fee layout (Gemma Danks, 19 Oct) never lands on a single-fee email.
import json
src = "1 BRANCH - FAST Admin 474162496 (links new tab 2026-10-19).json"
t = json.load(open(src))
c = t["nodes"]["13"]["content"]
o1 = "// --- outputs ----------------------------------------------------------------\n"
assert c.count(o1) == 1
add = ("// --- fee layout: Corpay's multi-fee reply layout is only for 2+ of these fees (Gemma Danks, 19 Oct)\n"
       "const multiFeeIntents = [\"ecopoint\", \"zero_liability\", \"extended_payment_terms\"];\n"
       "let fee_layout = intents.filter(name => multiFeeIntents.includes(name)).length >= 2 ? \"multi_fee\" : \"standard\";\n\n")
c = c.replace(o1, add + o1)
o2 = 'ZT.setFormData("email_intent", intents.join(", "));\n'
assert c.count(o2) == 1
c = c.replace(o2, o2 + 'ZT.setFormData("fee_layout", fee_layout);\n')
t["nodes"]["13"]["content"] = c
c48 = t["nodes"]["48"]["content"]
note = "\n2026-10-19: node 13 sets fee_layout (multi_fee when 2+ of Ecopoint / Zero Liability / Extended Payment Terms, else standard); AI 15 reads it for the multi-fee reply layout (Gemma Danks, 19 Oct)."
t["nodes"]["48"]["content"] = c48[:-6] + note + "</pre>" if c48.endswith("</pre>") else c48 + note
json.dump(t, open("1 BRANCH - FAST Admin 474162496 (fee layout 2026-10-19).json", "w"), ensure_ascii=False)
print(t["nodes"]["13"]["content"][-900:])
