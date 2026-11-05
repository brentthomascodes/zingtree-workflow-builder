========================================================================
WORKFLOW DIFF — Underperformance Playbook
========================================================================

Before : Underperformance Playbook (BEFORE baseline 2026-10-05).json  (28 nodes)
After  : Underperformance Playbook (CR-1 feedback AB test 2026-10-05).json  (36 nodes)

## PLAIN SUMMARY

24 of 36 nodes are byte-for-byte identical to the original (67% untouched).
8 nodes added, 0 removed, 0 renumbered, 4 modified.

In plain terms:
  + NEW      node 29 — Assign the feedback test group (A/B test) [Scoring]
  + NEW      node 30 — Group A - in-flow feedback buttons [Script]
  + NEW      node 31 — Group B - email survey [Script]
  + NEW      node 32 — Wrap up this session [Content]
  + NEW      node 33 — Build wrap-up confirmation [Script]
  + NEW      node 34 — Feedback recorded - session complete [Content]
  + NEW      node 35 — Send the feedback survey? [Scoring]
  + NEW      node 36 — Email the feedback survey to the agent [Email]
  * CHANGED  node 1 — Extract agent first name [Script]
               - continuation_node_id: 2 → 29 — Extract agent first name
  * CHANGED  node 2 — Select the underperformance scenario [Content]
               - content changed (128 → 192 characters) — Select the underperformance scenario
  * CHANGED  node 24 — Email the session summary to the agent [Email]
               - continuation_node_id: 25 → 35 — Email the session summary to the agent
  * CHANGED  node 27 — claude.md [Content]
               - content changed (52 → 63 lines) — claude.md

## TREE SHAPE

  node type                before    after    delta
  Content                      12       14       +2
  Email                         1        2       +1
  Link                          1        1       +0
  Scoring                       5        7       +2
  Script                        9       12       +3
  TOTAL                        28       36       +8

  Root node unchanged (node 1).

## STRUCTURAL SANITY

  No broken links introduced.
  NEWLY UNREACHABLE FROM ROOT (3): 32 (Wrap up this session); 33 (Build wrap-up confirmation); 34 (Feedback recorded - session complete)
    (expected for the unlinked claude.md node — anything else is a stranded path)
  Pre-existing in the BEFORE tree (not caused by this edit): 0 broken link(s), 2 unreachable node(s).

## UNTOUCHED NODES (24)

  3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 25, 26, 28

## TREE-LEVEL SETTINGS CHANGED (3)

  description: Consolidated single-tree diagnostic playbook for merchant underperformance. All paths converge on one dynamic-HTML recommendation screen, then Email + Email Sent. No dead ends. → Consolidated single-tree diagnostic playbook for merchant underperformance. All paths converge on one dynamic-HTML recommendation screen, then Email + Email Sent. No dead ends. Feedback A/B test (CR-1): random 50/50 split between in-flow wrap-up buttons and an emailed survey.
  persistent_buttons: {"0": {"name": "Share feedback", "nodeId": 26}} → {"0": {"name": "Share feedback", "nodeId": 26}, "1": {"name": "Wrap up this session", "nodeId": 32}}
  script_code: <link rel="stylesheet" href="https://assets.zingtree.com/managed/adyen/styles.css">
<script src="https://assets.zingtree.com/managed/adyen/adyenLoader.js"></script>

<script>
form_data["session_id"] = session_id;

window.addEventListener('message', function(e) {
  if (e.data && e.data.type === 'inject-css') {
    var s = document.getElementById('injected-css');
    if (!s) {
      s = document.createElement('style');
      s.id = 'injected-css';
      document.head.appendChild(s);
    }
    s.textContent = e.data.css;
  }
});
</script>

<!-- <script>
(function(){
  function onFirstNode(){ return !!document.getElementById("zt-first-node-marker"); }
  function isNav(el){
    var id=(el.id||"").toLowerCase();
    var txt=(el.textContent||"").trim().toLowerCase();
    var back = /(?:^|[-_ ])back(?:[-_ ]?button)?$/.test(id) || txt==="back";
    var restart = id.indexOf("restart")>-1 || txt==="restart" || txt==="start over";
    return back || restart;
  }
  function apply(){
    var first=onFirstNode();
    var els=document.querySelectorAll("a,button");
    for(var i=0;i<els.length;i++){
      var el=els[i];
      if(!isNav(el)) continue;
      if(el.closest && (el.closest("#qa-area")||el.closest(".answers"))) continue;
      el.style.display = first ? "none" : "";
    }
  }
  function boot(){
    try{ new MutationObserver(apply).observe(document.body,{childList:true,subtree:true}); }catch(e){}
    apply(); setTimeout(apply,300); setTimeout(apply,1000);
  }
  if(document.body){ boot(); } else { document.addEventListener("DOMContentLoaded", boot); }
})();
</script> --> → <link rel="stylesheet" href="https://assets.zingtree.com/managed/adyen/styles.css">
<script src="https://assets.zingtree.com/managed/adyen/adyenLoader.js"></script>

<script>
form_data["session_id"] = session_id;

window.addEventListener('message', function(e) {
  if (e.data && e.data.type === 'inject-css') {
    var s = document.getElementById('injected-css');
    if (!s) {
      s = document.createElement('style');
      s.id = 'injected-css';
      document.head.appendChild(s);
    }
    s.textContent = e.data.css;
  }
});
</script>

<!-- <script>
(function(){
  function onFirstNode(){ return !!document.getElementById("zt-first-node-marker"); }
  function isNav(el){
    var id=(el.id||"").toLowerCase();
    var txt=(el.textContent||"").trim().toLowerCase();
    var back = /(?:^|[-_ ])back(?:[-_ ]?button)?$/.test(id) || txt==="back";
    var restart = id.indexOf("restart")>-1 || txt==="restart" || txt==="start over";
    return back || restart;
  }
  function apply(){
    var first=onFirstNode();
    var els=document.querySelectorAll("a,button");
    for(var i=0;i<els.length;i++){
      var el=els[i];
      if(!isNav(el)) continue;
      if(el.closest && (el.closest("#qa-area")||el.closest(".answers"))) continue;
      el.style.display = first ? "none" : "";
    }
  }
  function boot(){
    try{ new MutationObserver(apply).observe(document.body,{childList:true,subtree:true}); }catch(e){}
    apply(); setTimeout(apply,300); setTimeout(apply,1000);
  }
  if(document.body){ boot(); } else { document.addEventListener("DOMContentLoaded", boot); }
})();
</script> -->

<script>
// Feedback A/B test: the feedback persistent buttons show only for sessions in the
// "buttons" group. The group is rendered into the hidden #zt-ab-marker on the scenario
// picker and remembered for the session. Until a group is known the buttons stay hidden,
// so the email-survey group never sees them.
const AB_FEEDBACK_BUTTON_LABELS = ['wrap up this session', 'share feedback'];

function readAbFeedbackGroup() {
  const marker = document.getElementById('zt-ab-marker');
  const key = 'zt_ab_group_' + session_id;
  try {
    if (marker) sessionStorage.setItem(key, marker.textContent.trim());
    return sessionStorage.getItem(key) || '';
  } catch (e) {
    if (marker) window.ztAbGroup = marker.textContent.trim();
    return window.ztAbGroup || '';
  }
}

function applyAbFeedbackButtons() {
  const show = readAbFeedbackGroup() === 'buttons';
  document.querySelectorAll('a, button').forEach(el => {
    if (el.closest('#qa-area') || el.closest('.answers')) return;
    const label = (el.textContent || '').trim().toLowerCase();
    if (!AB_FEEDBACK_BUTTON_LABELS.includes(label)) return;
    if (show) el.style.removeProperty('display');
    else el.style.setProperty('display', 'none', 'important');
  });
}

whenEvent('render:finish', () => {
  setTimeout(applyAbFeedbackButtons, 0);
});
</script>

## COSMETIC / EDITOR-ONLY CHANGES (0) — ignore

  (none)

## LINE-LEVEL BODY DIFFS (2)

### node 2 — Select the underperformance scenario (content)

```diff
--- before/node 2 content
+++ after/node 2 content
@@ -1 +1 @@
-<p><span style="font-size:26px;">Hi ${agent_first_name} - what type of underperformance is the merchant experiencing?</span></p>
+<p><span style="font-size:26px;">Hi ${agent_first_name} - what type of underperformance is the merchant experiencing?</span></p><span id="zt-ab-marker" style="display:none;">${ab_group}</span>
```

### node 27 — claude.md (content)

```diff
--- before/node 27 content
+++ after/node 27 content
@@ -3,7 +3,7 @@
 ## Purpose
 Agent-facing diagnostic playbook for merchant payment underperformance. The agent picks a scenario, answers a short chain of questions, and receives a single Recommended Actions screen, then a summary email closes out the session. Runs in the Adyen agent tool (styles.css + adyenLoader.js loaded via script_code). `${agent}` is expected on the session URL.
 
-## Architecture (one tree, ~28 nodes)
+## Architecture (one tree, 36 nodes)
 Replaces the previous 7-tree hub-and-spoke export (Starting Workflow + 6 subtrees, ~70 nodes, ~50 dead ends). Every path now converges on: Build recommended actions (catalog Script) -> Recommended actions (Content, renders `${transforms.outcome_html}`) -> Build readable email summary (Script node 28, stages `${transforms.summary_html}`) -> Email the session summary (renders `${transforms.summary_html}`) -> Summary sent (single terminal). No dead ends.
 
 Flow:
@@ -42,10 +42,21 @@
 - Conditional fields (`config.conditional.simple`) collapse each branch's dependent questions onto one screen.
 - Protect ML uses two conditional hidden `outcome_key` fields (mutually exclusive) - dev-test the duplicate-name behavior once in Zingtree.
 
+## Feedback A/B test (CR-1)
+Requirements: `Zingtree Builder/Requirements/Adyen/underperformance-playbook-requirements.md` (CR-1).
+- Root Script 1 seeds `agent_first_name`, then continues to node 29, a Logic node in **A/B test** mode (random 50/50; continuation falls back to row A if the engine ever evaluates it as a plain logic node). Row A -> Script 30 sets `ab_group="buttons"`; row B -> Script 31 sets `ab_group="survey"`. Both continue to the picker (2).
+- Group A: persistent buttons "Wrap up this session" (-> 32) and "Share feedback" (-> 26) on every screen. Group B: both hidden by the script_code block below.
+- The picker renders `${ab_group}` into a hidden `#zt-ab-marker` span; script_code reads it on `render:finish`, stores it in sessionStorage keyed by `session_id`, and hides any non-answer button labelled "Wrap up this session" / "Share feedback" unless the group is `buttons`. Fails closed (hidden) when no group is known. If either persistent button is renamed, update `AB_FEEDBACK_BUTTON_LABELS`.
+- Wrap-up screen 32 (native select `wrapup_outcome` required + `wrapup_comment` optional, persistent buttons hidden) -> Script 33 stages `transforms.wrapup_thanks_html` -> Content 34 (terminal).
+- After the summary email (24) -> Router 35: `ab_group == "survey"` -> Email 36 (survey link to `/show/629304572?ab_group=survey#32`, recipient `${agent}`) -> 25; else -> 25.
+- Reading the test: per group, sessions started (`ab_group`) vs sessions with `wrapup_outcome` set. Group B survey sessions start at node 32 with `ab_group=survey` from the URL and carry no agent identity.
+- To end the test: point Script 1's continuation back to 2 (nodes 29-31, 35-36 become unreachable), or set node 29 to always pick one row.
+
 ## Back/Restart (front-end hide on first screen only)
 The per-node `hide_back_restart` field did not work in the 2026 Vue theme, so hiding is done with front-end JS in the tree `script_code`: the first content node carries a hidden `<span id="zt-first-node-marker">`, and a MutationObserver hides any Back/Restart control (matched by id pattern or button text `back`/`restart`/`start over`, excluding `#qa-area`/`.answers` answer buttons) whenever that marker is present, restoring them on every other node. Tree-wide `hide_back_button`/`show_restart_button` stay at defaults so the buttons remain on the diagnostic screens. `hide_back_restart="1"` is also left on the picker as a harmless belt-and-suspenders. If the theme's Back/Restart use different markup, widen `isNav()` in script_code.
 
 ## Changelog
+- 2026-10-05 - Feedback A/B test, CR-1 (prompt: "A/B node as the starting node; one group gets the current flow with a survey, the other gets persistent feedback buttons") - Added A/B Logic node 29 after the seed script with group scripts 30/31 (`ab_group`); marker span on picker 2; persistent button "Wrap up this session" -> new wrap-up screen 32 -> confirmation script 33 -> terminal 34; router 35 + survey Email 36 after the summary email for the survey group; script_code block hiding feedback persistent buttons outside group A. Node 1 continuation 2 -> 29, node 24 continuation 25 -> 35. Nodes 28 -> 36. New vars ab_group, wrapup_outcome, wrapup_comment; new transform wrapup_thanks_html.
 - 2026-07-30 - Email summary restored + made readable (prompt: "no more links / email summary missing; add a script to parse the transcript into a readable transforms var referenced in the email") - Root cause: the Email node used `<p>##TRANSCRIPT##</p>`, which does not capture the consolidated dynamic `${transforms.outcome_html}` recommendation, so the email arrived without the summary or its links (on-screen links were fine). Added Script node 28 "Build readable email summary" that rebuilds a clean scenario + Q/A table from the captured selects and appends the recommended-actions HTML (links intact) into `transforms.summary_html`; rewired Recommended actions (23) Finish button 24 -> 28 -> 24; set Email body to `${transforms.summary_html}`. Node 1 (agent-name script, now splits on `@` then `.`) and the settings `script_code` (hide Back/Restart) were left untouched per request. Nodes 27 -> 28. New transform summary_html.
 - 2026-07-22 - Hide Back/Restart on first screen via front-end JS (prompt: "buttons still visible; add css/js in settings code") - Per-node hide_back_restart didn't work in the 2026 Vue theme; added a marker span on the picker + a MutationObserver in script_code that hides Back/Restart only while that marker is on screen. Nodes unchanged (27).
 - 2026-07-22 - Agent-name entry, minimal (prompt: "root can be a Script node; just add one script node that pulls agent_first_name; hide back/restart on first node") - Made the root a Script node "Extract agent first name" (ZT.setFormData from `agent` split on ".") that flows into the picker; hid back/restart on the picker (first rendered screen). One node added vs. the consolidated tree. New var agent_first_name. Nodes now 27. (Superseded the prior verify-screen + script_code approach.)
```

## CHANGES THAT NEED AN EXPLANATION

Every line below must map to a requirement or an explicit request.
Anything unexplained is unintended drift — revert it before delivering.

  [ ] added node 29 (Assign the feedback test group (A/B test))
  [ ] added node 30 (Group A - in-flow feedback buttons)
  [ ] added node 31 (Group B - email survey)
  [ ] added node 32 (Wrap up this session)
  [ ] added node 33 (Build wrap-up confirmation)
  [ ] added node 34 (Feedback recorded - session complete)
  [ ] added node 35 (Send the feedback survey?)
  [ ] added node 36 (Email the feedback survey to the agent)
  [ ] node 1 — continuation_node_id: 2 → 29 — Extract agent first name
  [ ] node 2 — content changed (128 → 192 characters) — Select the underperformance scenario
  [ ] node 24 — continuation_node_id: 25 → 35 — Email the session summary to the agent
  [ ] node 27 — content changed (52 → 63 lines) — claude.md
  [ ] tree setting —  description: Consolidated single-tree diagnostic playbook for merchant underperformance. All paths converge on one dynamic-HTML recommendation screen, then Email + Email Sent. No dead ends. → Consolidated single-tree diagnostic playbook for merchant underperformance. All paths converge on one dynamic-HTML recommendation screen, then Email + Email Sent. No dead ends. Feedback A/B test (CR-1): random 50/50 split between in-flow wrap-up buttons and an emailed survey.
  [ ] tree setting —  persistent_buttons: {"0": {"name": "Share feedback", "nodeId": 26}} → {"0": {"name": "Share feedback", "nodeId": 26}, "1": {"name": "Wrap up this session", "nodeId": 32}}
  [ ] tree setting —  script_code: <link rel="stylesheet" href="https://assets.zingtree.com/managed/adyen/styles.css">
<script src="https://assets.zingtree.com/managed/adyen/adyenLoader.js"></script>

<script>
form_data["session_id"] = session_id;

window.addEventListener('message', function(e) {
  if (e.data && e.data.type === 'inject-css') {
    var s = document.getElementById('injected-css');
    if (!s) {
      s = document.createElement('style');
      s.id = 'injected-css';
      document.head.appendChild(s);
    }
    s.textContent = e.data.css;
  }
});
</script>

<!-- <script>
(function(){
  function onFirstNode(){ return !!document.getElementById("zt-first-node-marker"); }
  function isNav(el){
    var id=(el.id||"").toLowerCase();
    var txt=(el.textContent||"").trim().toLowerCase();
    var back = /(?:^|[-_ ])back(?:[-_ ]?button)?$/.test(id) || txt==="back";
    var restart = id.indexOf("restart")>-1 || txt==="restart" || txt==="start over";
    return back || restart;
  }
  function apply(){
    var first=onFirstNode();
    var els=document.querySelectorAll("a,button");
    for(var i=0;i<els.length;i++){
      var el=els[i];
      if(!isNav(el)) continue;
      if(el.closest && (el.closest("#qa-area")||el.closest(".answers"))) continue;
      el.style.display = first ? "none" : "";
    }
  }
  function boot(){
    try{ new MutationObserver(apply).observe(document.body,{childList:true,subtree:true}); }catch(e){}
    apply(); setTimeout(apply,300); setTimeout(apply,1000);
  }
  if(document.body){ boot(); } else { document.addEventListener("DOMContentLoaded", boot); }
})();
</script> --> → <link rel="stylesheet" href="https://assets.zingtree.com/managed/adyen/styles.css">
<script src="https://assets.zingtree.com/managed/adyen/adyenLoader.js"></script>

<script>
form_data["session_id"] = session_id;

window.addEventListener('message', function(e) {
  if (e.data && e.data.type === 'inject-css') {
    var s = document.getElementById('injected-css');
    if (!s) {
      s = document.createElement('style');
      s.id = 'injected-css';
      document.head.appendChild(s);
    }
    s.textContent = e.data.css;
  }
});
</script>

<!-- <script>
(function(){
  function onFirstNode(){ return !!document.getElementById("zt-first-node-marker"); }
  function isNav(el){
    var id=(el.id||"").toLowerCase();
    var txt=(el.textContent||"").trim().toLowerCase();
    var back = /(?:^|[-_ ])back(?:[-_ ]?button)?$/.test(id) || txt==="back";
    var restart = id.indexOf("restart")>-1 || txt==="restart" || txt==="start over";
    return back || restart;
  }
  function apply(){
    var first=onFirstNode();
    var els=document.querySelectorAll("a,button");
    for(var i=0;i<els.length;i++){
      var el=els[i];
      if(!isNav(el)) continue;
      if(el.closest && (el.closest("#qa-area")||el.closest(".answers"))) continue;
      el.style.display = first ? "none" : "";
    }
  }
  function boot(){
    try{ new MutationObserver(apply).observe(document.body,{childList:true,subtree:true}); }catch(e){}
    apply(); setTimeout(apply,300); setTimeout(apply,1000);
  }
  if(document.body){ boot(); } else { document.addEventListener("DOMContentLoaded", boot); }
})();
</script> -->

<script>
// Feedback A/B test: the feedback persistent buttons show only for sessions in the
// "buttons" group. The group is rendered into the hidden #zt-ab-marker on the scenario
// picker and remembered for the session. Until a group is known the buttons stay hidden,
// so the email-survey group never sees them.
const AB_FEEDBACK_BUTTON_LABELS = ['wrap up this session', 'share feedback'];

function readAbFeedbackGroup() {
  const marker = document.getElementById('zt-ab-marker');
  const key = 'zt_ab_group_' + session_id;
  try {
    if (marker) sessionStorage.setItem(key, marker.textContent.trim());
    return sessionStorage.getItem(key) || '';
  } catch (e) {
    if (marker) window.ztAbGroup = marker.textContent.trim();
    return window.ztAbGroup || '';
  }
}

function applyAbFeedbackButtons() {
  const show = readAbFeedbackGroup() === 'buttons';
  document.querySelectorAll('a, button').forEach(el => {
    if (el.closest('#qa-area') || el.closest('.answers')) return;
    const label = (el.textContent || '').trim().toLowerCase();
    if (!AB_FEEDBACK_BUTTON_LABELS.includes(label)) return;
    if (show) el.style.removeProperty('display');
    else el.style.setProperty('display', 'none', 'important');
  });
}

whenEvent('render:finish', () => {
  setTimeout(applyAbFeedbackButtons, 0);
});
</script>

