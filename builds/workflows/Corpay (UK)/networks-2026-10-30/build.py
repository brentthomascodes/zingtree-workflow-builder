# Networks branch 547469427, Gemma Danks:
#  1) "Daily AI standup - 29th Oct" 15:18 GMT: help text 'If not applicable, please leave blank' on the two optional questions
#  2) same thread 30 Oct 13:33 GMT: General pushback body line -> "If you have not received this, please confirm the invoice amount and your Merchant Number."
import json, sys
src, out = sys.argv[1], sys.argv[2]
t = json.load(open(src)); g = {v["project_node_id"]: v for v in t["nodes"].values()}
HELP = " If not applicable, please leave blank."
for n, name in (("97", "remittance_sent_date"), ("98", "invoice_amount")):
    f = [f for f in g[n]["formfields"].values() if f["name"] == name]
    assert len(f) == 1 and f[0]["required"] == "0"
    assert HELP not in f[0]["label"]
    f[0]["label"] = f[0]["label"].rstrip() + HELP
c = g["110"]["content"]
old = '"<p>If you can confirm that you have not received this, please send us the amount received and your Merchant Number.</p>",'
new = '"<p>If you have not received this, please confirm the invoice amount and your Merchant Number.</p>",'
assert c.count(old) == 1
g["110"]["content"] = c.replace(old, new).replace(
    '// --- approved copy: "Phase 1 - Remittance auto email pushback" (Gemma Danks, 16 Oct) ---',
    '// --- approved copy: "Phase 1 - Remittance auto email pushback" (Gemma Danks, 16 Oct; general line 4 updated 30 Oct) ---')
g["48"]["content"] += "<p>2026-10-30: help text 'If not applicable, please leave blank' on optional date (97) and invoice amount (98); General pushback line 'If you have not received this, please confirm the invoice amount and your Merchant Number.' (110) (Gemma Danks, 29 / 30 Oct).</p>"
json.dump(t, open(out, "w"), ensure_ascii=False, indent=1)
print("built")
