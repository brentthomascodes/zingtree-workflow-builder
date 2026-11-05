import json, re, sys

CO10_FIELDS = {"AccountId","Business_process__c","Id","CaseNumber","Origin","CreatedDate",
    "Description","SuppliedEmail","Initial_Case_Queue_Name__c","Last_Email_Date__c","OwnerId",
    "Queue_Email__c","RecordTypeId","Status","Sub_Topic__c","Subject","Topic__c",
    "Last_Owner_Queue_Name__c"}
CO10_ALIASES = ("sfdc_int__case_email_ai", "get_case_details__prod")

def strings(o):
    # every string value in the export, skipping the claude.md documentation node
    if isinstance(o, dict):
        if any(str(o.get(k, "")).strip().startswith("claude.md") for k in ("title", "node_name", "name")):
            return
        for v in o.values():
            yield from strings(v)
    elif isinstance(o, list):
        for v in o:
            yield from strings(v)
    elif isinstance(o, str):
        yield o

text = "\n".join(strings(json.load(open(sys.argv[1], encoding="utf-8"))))
findings, review = set(), set()

CHAIN = r"((?:\??\s*(?:\.\s*\w+|\[[^\]]*\]))+)"

def keys_of(chain):
    parts = re.findall(r"\.\s*(\w+)|\[\s*['\"](\w+)['\"]\s*\]", chain)
    return [a or b for a, b in parts]

def check(label, keys, is_record):
    if not keys:
        return
    if is_record:                                    # keys[0] is a field on records[0]
        if keys[0] not in CO10_FIELDS:
            findings.add(f"{label}: .{keys[0]} not in the CO 10 schema")
    elif keys[0] not in ("records", "_zt_meta"):
        findings.add(f"{label}: top-level key '{keys[0]}' (only records / _zt_meta are confirmed)")
    elif keys[0] == "records" and len(keys) > 1 and keys[1] not in CO10_FIELDS | {"length"}:
        findings.add(f"{label}: records[].{keys[1]} not in the CO 10 schema")

for alias in CO10_ALIASES:
    # direct reads: actions.<alias>.records[0].Field  or  ["Field"]
    for m in re.finditer(re.escape(alias) + CHAIN, text):
        check(alias, keys_of(m.group(1)), False)
    # reads through a variable: const sfCase = ...<alias>...records[0]  ->  sfCase.Field
    for m in re.finditer(r"(?:const|let|var)\s+(\w+)\s*=\s*([^;\n]*" + re.escape(alias) + r"[^;\n]*)", text):
        var, rhs = m.group(1), m.group(2)
        is_record = "records" in rhs
        review.add(f"{alias} -> '{var}' ({'a record' if is_record else 'the response'})")
        for r in re.finditer(r"\b" + re.escape(var) + CHAIN, text):
            check(f"{alias} via {var}", keys_of(r.group(1)), is_record)

if "totalSize" in text:
    findings.add("'totalSize' appears in the tree. Response metadata is not confirmed")

print("\n".join(sorted(findings)) or "OK: every CO 10 reference is in the confirmed schema")
if review:
    print("\nChecked through variables (also read these by hand for helpers / destructuring):")
    print("\n".join("  " + r for r in sorted(review)))
sys.exit(1 if findings else 0)
