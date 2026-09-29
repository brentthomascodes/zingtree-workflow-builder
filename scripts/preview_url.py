#!/usr/bin/env python3
"""Build a Zingtree preview URL from a fixture file.

    python3 scripts/preview_url.py <tree.fixture.json> [--session <id>] [--set key=value ...]
                                   [--node <nodeId>] [--show]

Every entry in the fixture's `query_params` becomes a `zv_<name>=<value>` parameter on
<preview_host><tree_id>. `preview_host` defaults to the EU host
(https://eu.zingtree.com/preview/) because every org this repo is used on today is EU;
a US org sets "preview_host": "https://zingtree.com/preview/" in its fixture.

- `query_params` holds ONLY the raw inbound names the launching system sends (ticket id,
  sf_Id, the org's custom_field_<id> params). Never the tree's standardized names or derived
  values - those are set by the seed script or a form field, and seeding them hides a break
  in the code that derives them.
- `--node N` appends `#N`, which opens the tree at that node (e.g. a Test Mode picker a
  promote left unlinked on purpose).
- `--show` builds the live `/show/<tree_id>` URL instead of the editor preview. zv_ params
  work there too (Zingtree strips the prefix).
- `--session <id>` reuses/replays a specific session (`zv_session_id` on preview, bare
  `session_id` on `--show`).
- `--set` overrides or adds a param for one run.
"""
import json
import sys
from urllib.parse import urlencode

DEFAULT_HOST = "https://eu.zingtree.com/preview/"


def build(fixture, session_id=None, overrides=None, node=None, show=False):
    params = dict(fixture.get("query_params", {}))
    params.update(overrides or {})
    if session_id:
        params["session_id"] = session_id
    host = fixture.get("preview_host", DEFAULT_HOST).rstrip("/") + "/"
    if show:
        host = host.replace("/preview/", "/show/")
    # session_id rides bare on a live /show/ URL (confirmed on ETG's Manager Review share
    # link); on the editor preview it keeps the zv_ prefix like every other param.
    query = urlencode({(k if show and k == "session_id" else f"zv_{k}"): v for k, v in params.items() if v is not None})
    url = f"{host}{fixture['tree_id']}"
    if query:
        url += f"?{query}"
    if node:
        url += f"#{node}"
    return url


def main(argv):
    if len(argv) < 2:
        print(__doc__)
        return 2
    fixture = json.load(open(argv[1]))
    session_id, node, show = None, None, False
    overrides = {}
    args = argv[2:]
    while args:
        flag = args.pop(0)
        if flag == "--session":
            session_id = args.pop(0)
        elif flag == "--node":
            node = args.pop(0)
        elif flag == "--show":
            show = True
        elif flag == "--set":
            key, _, value = args.pop(0).partition("=")
            overrides[key] = value
    print(build(fixture, session_id, overrides, node, show))
    return 0


if __name__ == "__main__":
    sys.exit(main(sys.argv))
