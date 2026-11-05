# FAST (17) / Homecharge (26), "Daily AI standup - 29th Oct" (Gemma Danks) + standup 29 Oct:
# "Multi intent - missing intent content text box - keep the notification banner and still allow the
#  'make manual changes' option." INT & PROD. Screen 62 (text box) is no longer reached; the banner
# sits on top of the normal dashboard (54 / 30), whose buttons include "No - make manual changes".
import json, sys
src, out, node = sys.argv[1], sys.argv[2], sys.argv[3]
t = json.load(open(src)); N = t["nodes"]
c = N[node]["content"]
old = 'let unrecognised_review_needed = ai_exception_reason !== "" && agent_added_request === "";\n'
new = ('// Half rollback (Gemma Danks, 29 Oct): screen 62 and its text box are no longer used. A partly\n'
       '// unrecognised request goes to the normal dashboard with the banner on top; the agent edits\n'
       '// through "No - make manual changes".\n'
       'let unrecognised_review_needed = false;\n'
       'let unrecognised_banner = ai_exception_reason !== "";\n')
assert c.count(old) == 1; c = c.replace(old, new)
anchor = '${case_review_html}`;\n'
assert c.count(anchor) == 1
c = c.replace(anchor, anchor + 'if (unrecognised_banner) case_review_html = unrecognised_review_html;\n')
N[node]["content"] = c
N["48"]["content"] += f"<p>2026-10-29: multi-intent half rollback (Gemma Danks, 29 Oct): node {node} no longer routes to text-box screen 62; the 'Part of this request was not recognised' banner sits on top of the dashboard, agent uses 'No - make manual changes'.</p>"
json.dump(t, open(out, "w"), ensure_ascii=False, indent=1)
print("built", out)
