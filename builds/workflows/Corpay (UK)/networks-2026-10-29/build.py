# Networks branch 547469427, Gemma Danks "Networks INT tree issue" 28 Oct 16:50 GMT, item 1:
#  'I need to add an attachment' button on the response-choice page (96), next to General / Service
#  department pushback, that takes the agent to the out of scope "work the case as you normally would" screen.
import json, copy, sys
src, out = sys.argv[1], sys.argv[2]
t = json.load(open(src)); N = t["nodes"]
node = lambda n: N[n]
assert "119" not in N

script119 = '''// The agent needs to add an attachment, which the AI reply cannot carry: hand the case back.
// Master "Main end" (100) routes not_automated to screen 29, which prints ai_exception_reason
// under "Please work this case as you normally would" (Gemma Danks, 28 Oct).
ZT.setFormData("ai_exception_reason", "Attachment needed: add the attachment and reply from Salesforce.");
ZT.setFormData("branch_outcome", "not_automated");
'''
new = copy.deepcopy(node("112"))
new.update({"project_node_id": "119", "node_name": "Attachment needed: hand back to the agent",
            "page_title": "Attachment needed", "content": script119, "continuation_node_id": "79",
            "display_order": "119", "x": str(int(node("113")["x"]) + 300), "y": node("113")["y"]})
N["119"] = new

b = node("96")["buttons"]
assert len(b) == 2
btn = copy.deepcopy(b["1"])
btn.update({"button_text": "I need to add an attachment", "button_data": "I need to add an attachment",
            "button_link": "119", "rank": "3"})
b["2"] = btn

node("48")["content"] += "<p>2026-10-29: response-choice screen 96 gets a third button, 'I need to add an attachment', -> new script 119 -> hand back not_automated (master screen 29, work the case as normal) (Gemma Danks, 28 Oct).</p>"
json.dump(t, open(out, "w"), ensure_ascii=False, indent=1)
print("built", out)
