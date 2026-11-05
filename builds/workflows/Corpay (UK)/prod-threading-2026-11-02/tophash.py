import json,hashlib,sys
t=json.load(open(sys.argv[1])); t.pop("nodes")
print(json.dumps({k:hashlib.sha256(json.dumps(v,sort_keys=True,ensure_ascii=False,separators=(',',':')).encode()).hexdigest()[:12] for k,v in sorted(t.items())},sort_keys=True))
