import json,hashlib,sys
for f in sys.argv[1:]:
    t=json.load(open(f))
    h={k:hashlib.sha256(json.dumps(v,sort_keys=True,ensure_ascii=False,separators=(',',':')).encode()).hexdigest()[:12] for k,v in t["nodes"].items()}
    s=";".join(f"{k}={h[k]}" for k in sorted(h,key=int))
    print(hashlib.sha256(s.encode()).hexdigest()[:16], len(h), json.dumps(t.get("script_code","")!="" and hashlib.sha256(t["script_code"].encode()).hexdigest()[:12]), f[-70:])
