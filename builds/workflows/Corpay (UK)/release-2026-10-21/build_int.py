import json
src='1 BRANCH - FAST Admin INT 474162496 (BEFORE baseline 2026-10-21).json'
out='1 BRANCH - FAST Admin INT 474162496 (card group topic 2026-10-21).json'
j=json.load(open(src,encoding='utf-8'))
c=j['nodes']['17']['content']
old='  card_group_move:             { topic: "Not Online", subtopic: "Card Group/Moves" },'
assert c.count(old)==1
j['nodes']['17']['content']=c.replace(old,old.replace('"Not Online"','"Online"'))
n=j['nodes']['48']['content']; assert n.endswith('</pre>')
j['nodes']['48']['content']=n[:-6]+'\n2026-10-21: node 17 card_group_move Topic "Online" (matches the live PROD value).</pre>'
json.dump(j,open(out,'w',encoding='utf-8'),ensure_ascii=False,indent=1)
print('ok')
