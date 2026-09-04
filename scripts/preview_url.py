#!/usr/bin/env python3
"""Build a Zingtree preview URL from a fixture file.

    python3 scripts/preview_url.py <tree.fixture.json> [--session <id>] [--set key=value ...]

Every entry in the fixture's `query_params` becomes a `zv_<name>=<value>` parameter on
https://zingtree.com/preview/<tree_id>. `--set` overrides or adds a param for one run
(e.g. `--set mock=0` to hit the live API with the same seed data).
"""
import json
import sys
from urllib.parse import urlencode


def build(fixture, session_id=None, overrides=None):
    params = dict(fixture.get("query_params", {}))
    params.update(overrides or {})
    if session_id:
        params["session_id"] = session_id
    host = fixture.get("preview_host", "https://zingtree.com/preview/").rstrip("/") + "/"
    query = urlencode({f"zv_{k}": v for k, v in params.items() if v is not None})
    return f"{host}{fixture['tree_id']}?{query}"


def main(argv):
    if len(argv) < 2:
        print(__doc__)
        return 2
    fixture = json.load(open(argv[1]))
    session_id = None
    overrides = {}
    args = argv[2:]
    while args:
        flag = args.pop(0)
        if flag == "--session":
            session_id = args.pop(0)
        elif flag == "--set":
            key, _, value = args.pop(0).partition("=")
            overrides[key] = value
    print(build(fixture, session_id, overrides))
    return 0


if __name__ == "__main__":
    sys.exit(main(sys.argv))
