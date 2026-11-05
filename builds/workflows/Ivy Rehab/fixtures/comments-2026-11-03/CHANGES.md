# Incoming Call (632727963) - comments + Session Notes (2026-11-03/04)

Session Notes are stored in Zingtree's notes service (GET /rev2-svc/session-notes, headers
X-Org-Id / X-Session-Id / X-Tree-Id), not in a session variable, so scripts can't read them directly.

- CO 1308 "Zingtree - Get Session Notes" (zt__get_session_notes), GET, No Auth, TTL 300.
  URL carries ?sid=${notes_session_id}&t=${notes_request_ts} so the cache is per session + request.
  Returns {"notes": "..."}; 404 when the session has no notes.
- Node 128: summary text -> comment_json + comment_base_json; stages notes_session_id (ZT.getSessionId()),
  notes_master_tree_id (632727963), notes_request_ts.
- Data node 1: + zt__get_session_notes. Node 2 (end): comment_json = comment_base_json + "Session Notes" block.
- Node 133 (end): refresh notes_request_ts. Data node 135: + zt__get_session_notes.
- Node 138: appointment_comment_json = summary text + "Session Notes" block.
- CO 1067 comm = ${comment_json}; CO 1068 comments = ${appointment_comment_json}.

Tests: run.mjs (format vs Kelsie's sample, nodes 128/138), notes-test.mjs (notes / 404 / missing / blank, no doubling).
Notes are captured when each call runs: lead at node 107, appointment at node 135 -> 141.
