# PROD master 417189428 (from the INT 29 Oct build)  -- Master INT 109029630, Charley Gunning "Networks INT tree issue" 28 Oct 13:49 / 14:47 GMT:
#  "the AI is reading first email, we want ... read all in the thread but base the response on the
#   more recent email and use the rest of the email for context" -> INT for testing.
# Tree side: fetch the case's inbound EmailMessages (CO 23, now with TextBody + MessageDate) right
# after the case fetch, and stage latest_customer_email / thread_context_emails as form data for
# the five INT AI Actions (16, 15, 19, 18, 23). Test Mode stages the edited test email as the latest.
import json, copy, sys
src, out = sys.argv[1], sys.argv[2]
t = json.load(open(src)); N = t["nodes"]
assert "83" not in N and "84" not in N

# --- 83: CO 23 fetch, right after the case fetch -----------------------------------------
n83 = copy.deepcopy(N["35"])
n83.update({"project_node_id": "83", "node_name": "Inbound EmailMessages on the case (thread for the AI Actions)",
            "page_title": "Get email thread", "continuation_node_id": "84", "display_order": "83",
            "x": str(int(N["2"]["x"]) + 200), "y": N["2"]["y"]})
N["83"] = n83

script84 = r'''// --- inputs -----------------------------------------------------------------
let thread = actions.get_incoming_email_addresses_prod;
let caseFetch = actions.get_case_details__prod;
// Same grading as node 58: a launch with no case (bare preview, bad Id) carries on to screen 4 / 11.
let caseCode = caseFetch._zt_meta.response.code;
let caseRead = caseCode >= 200 && caseCode < 300 && Array.isArray(caseFetch.records) && caseFetch.records.length > 0;
let caseDescription = caseRead ? (caseFetch.records[0].Description || "") : "";

// --- the thread -----------------------------------------------------------------
// CO 23 returns the case's inbound EmailMessages (up to 10, no fixed order). The AI Actions
// answer the most recent one and read the rest as context (Charley Gunning, 28 Oct).
// MessageDate is ISO 8601, so a string sort orders it. A case with no inbound EmailMessage
// (web form) or a failed fetch falls back to Case.Description, the first email, as before.
let threadCode = thread._zt_meta.response.code;
let fetched = threadCode >= 200 && threadCode < 300 && Array.isArray(thread.records);
let emails = fetched ? thread.records.filter(e => String(e.TextBody || "").trim() !== "") : [];
emails.sort((a, b) => String(b.MessageDate).localeCompare(String(a.MessageDate)));

let latest_customer_email = emails.length > 0 ? emails[0].TextBody : caseDescription;
// Earlier emails are context only: each is capped so ten long emails stay inside the prompt.
let thread_context_emails = emails.slice(1)
  .map(e => "Received " + e.MessageDate + ":\n" + String(e.TextBody).slice(0, 4000))
  .join("\n\n---\n\n");

// --- outputs ----------------------------------------------------------------
ZT.setFormData("latest_customer_email", latest_customer_email);
ZT.setFormData("thread_context_emails", thread_context_emails);
ZT.setFormData("thread_email_count", String(emails.length));
'''
n84 = copy.deepcopy(N["58"])
n84.update({"project_node_id": "84", "node_name": "Latest customer email + earlier thread for the AI Actions",
            "page_title": "Stage email thread", "content": script84, "continuation_node_id": "58",
            "display_order": "84", "x": str(int(N["2"]["x"]) + 400), "y": N["2"]["y"]})
N["84"] = n84
assert N["2"]["continuation_node_id"] == "58"
N["2"]["continuation_node_id"] = "83"

# --- 47: Test Mode stages the edited test email as the latest, no earlier thread ----------
c = N["47"]["content"]
anchor = 'ZT.setFormData("sf_Subject", test_subject);\n'
assert c.count(anchor) == 1
c = c.replace(anchor, anchor +
  '// Test Mode has no EmailMessages: the edited test email is the latest email, with no earlier thread (node 84 does this on a live case).\n'
  'ZT.setFormData("latest_customer_email", description);\n'
  'ZT.setFormData("thread_context_emails", "");\n'
  'ZT.setFormData("thread_email_count", "0");\n')
N["47"]["content"] = c

log = ("\n2026-11-02: email threading to PROD (INT 29 Oct build, approved Alex Godfrey / Gemma Danks standup 2 Nov): "
       "2 -> new Data 83 (CO 24, SELECT + TextBody, MessageDate) -> new script 84 -> 58. 84 stages latest_customer_email / thread_context_emails "
       "for AI Actions 13 / 12 / 20 / 21. Test Mode 47 stages the test email as latest.")
assert N["48"]["content"].count("</pre>") == 1
N["48"]["content"] = N["48"]["content"].replace("</pre>", log + "</pre>")
json.dump(t, open(out, "w"), ensure_ascii=False, indent=1)
print("built", out)
