#!/usr/bin/env python3
"""Substitute the real Connected Object ids into the Incoming Call build.

Create the three objects in Zingtree (Apps & Integrations > Connected Objects), note their
ids from the list page, then:

    python3 apply_co_ids.py --find-leads 1301 --disciplines 1302 --case-types 1303

It rewrites the tree JSON and the two fixtures in place and refuses to run if any placeholder
is left behind.
"""
import argparse, json, pathlib, sys

HERE = pathlib.Path(__file__).resolve().parent
TREE = HERE / "Incoming Call (lead pre-check + therapy type 2026-09-17) [DO NOT IMPORT - needs CO ids].json"
FIXTURES = [
    HERE / "fixtures" / "incoming-call.fixture.json",
    HERE / "fixtures" / "incoming-call.fixture.existing-lead.json",
]

PLACEHOLDERS = {
    "__FIND_LEADS_ID__": "find_leads",
    "__DISCIPLINES_ID__": "disciplines",
    "__CASE_TYPES_ID__": "case_types",
}

p = argparse.ArgumentParser()
p.add_argument("--find-leads", required=True, help="id of raintree__find_leads")
p.add_argument("--disciplines", required=True, help="id of raintree__get_disciplines")
p.add_argument("--case-types", required=True, help="id of raintree__get_case_types")
a = p.parse_args()

ids = {"__FIND_LEADS_ID__": str(a.find_leads),
       "__DISCIPLINES_ID__": str(a.disciplines),
       "__CASE_TYPES_ID__": str(a.case_types)}

for path in [TREE, *FIXTURES]:
    if not path.exists():
        sys.exit(f"missing: {path}")
    text = path.read_text()
    for token, value in ids.items():
        text = text.replace(token, value)
    leftover = [t for t in PLACEHOLDERS if t in text]
    if leftover:
        sys.exit(f"{path.name}: placeholders still present: {leftover}")
    json.loads(text)                      # refuse to write anything that is not valid JSON
    path.write_text(text)
    print(f"updated {path.name}")

clean = TREE.with_name(TREE.name.replace(" [DO NOT IMPORT - needs CO ids]", ""))
TREE.rename(clean)
print(f"renamed -> {clean.name}")

print("\nDone. Re-run the lint and the walk before importing:")
print('  python3 scripts/lint_tree.py "<tree>"')
print('  node scripts/walk.mjs "<tree>" "<fixture>" --start 105')
