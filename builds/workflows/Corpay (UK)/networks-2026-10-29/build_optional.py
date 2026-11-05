# Gemma Danks "Daily AI standup - 29th Oct" 14:43 GMT + standup 29 Oct: make the date (97, General pushback)
# and invoice amount (98, Service department pushback) questions optional. SMR / Fuel stays required.
# A blank answer drops only its clause from the approved reply; no new wording.
import json, sys
src, out = sys.argv[1], sys.argv[2]
t = json.load(open(src)); N = t["nodes"]
def ff(n, name):
    return next(f for f in N[n]["formfields"].values() if f["name"] == name)
ff("97", "remittance_sent_date")["required"] = "0"
ff("98", "invoice_amount")["required"] = "0"
assert ff("97", "remittance_type")["required"] == "1" and ff("98", "remittance_type")["required"] == "1"

c = N["117"]["content"]
old = 'let remittance_date_valid = parts !== null'
assert c.count(old) == 1
c = c.replace(old, '// The date is optional (Gemma Danks, 29 Oct): blank passes, a typed date must be a real DD/MM/YYYY day.\nlet remittance_date_valid = remittance_sent_date === "" || parts !== null')
N["117"]["content"] = c

c = N["110"]["content"]
old1 = '"<p>We sent you your remittance via email on <strong>" + escapeHtml(remittance_sent_date) + "</strong>. Please make sure'
new1 = '"<p>We sent you your remittance via email" + (String(remittance_sent_date).trim() === "" ? "" : " on <strong>" + escapeHtml(remittance_sent_date) + "</strong>") + ". Please make sure'
old2 = 'request that they upload the invoice relating to " + escapeHtml(invoice_amount_gbp) + " to the 1Link platform.</p>"'
new2 = 'request that they upload the invoice" + (String(invoice_amount).trim() === "" ? "" : " relating to " + escapeHtml(invoice_amount_gbp)) + " to the 1Link platform.</p>"'
assert c.count(old1) == 1 and c.count(old2) == 1
c = c.replace(old1, new1).replace(old2, new2)
c = c.replace('// The reply always shows the amount in pounds', '// The amount and the date are optional (Gemma Danks, 29 Oct): a blank one drops its clause from the reply.\n// The reply always shows the amount in pounds', 1)
N["110"]["content"] = c
N["48"]["content"] += "<p>2026-10-29: date (97) and invoice amount (98) questions optional; SMR / Fuel stays required. 117 accepts a blank date; 110 drops the 'on [date]' / 'relating to [amount]' clause when blank (Gemma Danks, 29 Oct).</p>"
json.dump(t, open(out, "w"), ensure_ascii=False, indent=1)
print("built")
