# Corpay UK INT build 2026-10-19: external links open in a new tab (all 4 INT trees, script_code),
# Networks sender address (master node 8). Sources: Gemma Danks "Re: Daily AI standup - 19th Oct"
# 19 Oct 14:59 UTC (links open inside the widget, ask: new tab); Gemma 19 Oct 09:58 UTC
# (Networks replies send from networksupport@allstarcard.co.uk).
import json, copy
W = ".."
SRC = {
  "master": (f"{W}/networks-2026-10-16/0 MASTER 109029630 (AFTER import re-export 2026-10-16).json", "0 MASTER - Email Automation - AI Actions INT 109029630"),
  "fast":   (f"{W}/master-split 2026-10-12/1 BRANCH - FAST Admin 474162496 (GDPR v2 2026-10-13).json", "1 BRANCH - FAST Admin 474162496"),
  "hc":     (f"{W}/master-split 2026-10-12/2 BRANCH - Homecharge 2026-10-12.json", "2 BRANCH - Homecharge 698599608"),
  "net":    (f"{W}/networks-2026-10-16/3 BRANCH - Networks 547469427 (AFTER import re-export 2026-10-16).json", "3 BRANCH - Networks 547469427"),
}
LINK_JS = """
<script>
/**
 * ========================================================
 * EXTERNAL LINKS OPEN IN A NEW TAB
 * ========================================================
 * Links in the reply preview loaded inside the Salesforce widget; pages that refuse to load
 * in a frame then errored with no way back (Corpay UK, 19 Oct). Any http(s) link to another
 * site opens in a new tab. If the browser blocks the new tab, the click behaves as before.
 */
(function () {
  document.addEventListener(
    'click',
    function (event) {
      var link = event.target.closest('a[href]');
      if (!link) {
        return;
      }
      var href = link.getAttribute('href') || '';
      if (!/^https?:\\/\\//i.test(href) || link.hostname === window.location.hostname) {
        return;
      }
      var opened = window.open(href, '_blank');
      if (!opened) {
        return;
      }
      opened.opener = null;
      event.preventDefault();
      event.stopPropagation();
    },
    true
  );
})();
</script>
"""
NOTE = "\n2026-10-19: tree script: external http(s) links open in a new tab instead of inside the widget (Gemma Danks, 19 Oct)."
live79 = {"open_tree_id": "1", "open_tree_node_id": "0"}  # portal-assigned values on the live HC branch
for key, (src, stem) in SRC.items():
    t = json.load(open(src))
    before = copy.deepcopy(t)
    json.dump(before, open(f"{stem} (BEFORE baseline 2026-10-19).json", "w"), ensure_ascii=False)  # replaced below for hc
    if key == "hc":
        t["nodes"]["79"].update(live79)
        before["nodes"]["79"].update(live79)
        json.dump(before, open(f"{stem} (BEFORE baseline 2026-10-19).json", "w"), ensure_ascii=False)
    assert "EXTERNAL LINKS OPEN IN A NEW TAB" not in t["script_code"]
    t["script_code"] = t["script_code"].rstrip("\n") + "\n" + LINK_JS
    note = NOTE
    if key == "master":
        n8 = t["nodes"]["8"]
        old = '  networks: ""   // Networks reply address: Corpay to confirm before the branch is switched on\n'
        assert n8["content"].count(old) == 1
        n8["content"] = n8["content"].replace(old, '  networks: "networksupport@allstarcard.co.uk"   // Gemma Danks, 19 Oct\n')
        note += " Node 8: Networks sender address networksupport@allstarcard.co.uk (Gemma Danks, 19 Oct)."
    c48 = t["nodes"]["48"]["content"]
    if c48.endswith("</pre>"):
        t["nodes"]["48"]["content"] = c48[:-6] + note + "</pre>"
    else:
        t["nodes"]["48"]["content"] = c48 + note
    json.dump(t, open(f"{stem} (links new tab 2026-10-19).json", "w"), ensure_ascii=False)
    print(key, "ok", len(t["nodes"]))
