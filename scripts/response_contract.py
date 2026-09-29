#!/usr/bin/env python3
"""Real-data contract gate: the tree may only read response fields confirmed in a REAL response.

    python3 scripts/response_contract.py <tree.json> <contract.json>

contract.json (lives with the account's exports, never in this repo):

    {
      "sfdc_int__case_email_ai": {
        "top": ["records", "_zt_meta"],
        "record_fields": ["Id", "AccountId", "Subject", "Last_Owner_Queue_Name__c"],
        "confirmed": "2026-09-29, Brent, real CO 10 response"
      }
    }

`top` lists the response's top-level keys; `record_fields` the keys of each entry of
`records` (or of `value`) - omit it for a response without a list. Every alias the tree
reads that is listed in the contract is checked for direct reads
(`actions.<alias>.records[0].Field`) and reads through a variable
(`let sfCase = actions.<alias>.records[0]; sfCase.Field`). The claude.md node is skipped
(its changelog may name a field when it describes a bug).

It cannot follow destructuring, helpers that take the response as an argument, or a
variable re-assigned to another variable: it prints every variable it followed so those
nodes get read by hand. It does not read mock seeds either - open the seed script and check
each seeded key against the contract (a seed may copy a real shape, never add to it).

Why: a mock seed that carried `totalSize` let a guard read it; the real Connected Object
response has no `totalSize`, every automated test passed and every live case failed
(Corpay UK, Sep 2026). Exit 1 on any finding. Never widen a contract to make it pass - only
add a field after seeing it in a real response.
"""
import json
import re
import sys

CHAIN = r"((?:\??\s*(?:\.\s*\w+|\[[^\]]*\]))+)"
TIGHT = r"((?:\??(?:\.\w+|\[[^\]]*\]))+)"   # for local variables: no whitespace, so prose ("account. Please") never matches
LIST_KEYS = ("records", "value")


def strings(o):
    if isinstance(o, dict):
        if any(str(o.get(k, "")).strip().lower().startswith("claude.md") for k in ("page_title", "node_name", "title")):
            return
        for v in o.values():
            yield from strings(v)
    elif isinstance(o, list):
        for v in o:
            yield from strings(v)
    elif isinstance(o, str):
        yield o


def keys_of(chain):
    return [a or b for a, b in re.findall(r"\.\s*(\w+)|\[\s*['\"](\w+)['\"]\s*\]", chain)]


def main(argv):
    if len(argv) < 3:
        print(__doc__)
        return 2
    tree = json.load(open(argv[1], encoding="utf-8"))
    contract = json.load(open(argv[2], encoding="utf-8"))
    text = "\n".join(strings(tree))
    findings, followed = set(), set()

    for alias, spec in contract.items():
        top = set(spec.get("top", [])) | {"_zt_meta"}
        fields = set(spec.get("record_fields", []))

        def check(label, keys, is_record):
            if not keys:
                return
            if is_record:
                if fields and keys[0] not in fields | {"length"}:
                    findings.add(f"{label}: .{keys[0]} is not a confirmed field of {alias}")
            elif keys[0] not in top:
                findings.add(f"{label}: top-level key '{keys[0]}' is not in the confirmed response of {alias}")
            elif keys[0] in LIST_KEYS and len(keys) > 1 and fields and keys[1] not in fields | {"length"}:
                findings.add(f"{label}: {keys[0]}[].{keys[1]} is not a confirmed field of {alias}")

        for m in re.finditer(r"\b" + re.escape(alias) + CHAIN, text):
            check(alias, keys_of(m.group(1)), False)
        for m in re.finditer(r"(?:const|let|var)\s+(\w+)\s*=\s*([^;\n]*\b" + re.escape(alias) + r"\b[^;\n]*)", text):
            var, rhs = m.group(1), m.group(2)
            is_record = any(k in rhs for k in LIST_KEYS)
            followed.add(f"{alias} -> '{var}' ({'a record' if is_record else 'the response'})")
            for r in re.finditer(r"\b" + re.escape(var) + TIGHT, text):
                check(f"{alias} via {var}", keys_of(r.group(1)), is_record)

    print("\n".join(sorted(findings)) or "OK: every contracted response read is a confirmed field")
    if followed:
        print("\nFollowed through variables (read these nodes by hand for destructuring / helpers):")
        print("\n".join("  " + f for f in sorted(followed)))
    return 1 if findings else 0


if __name__ == "__main__":
    sys.exit(main(sys.argv))
