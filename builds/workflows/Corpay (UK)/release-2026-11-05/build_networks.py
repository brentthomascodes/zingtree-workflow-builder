"""2026-11-05 Networks General pushback wording (Gemma Danks, 'Daily AI standup - 5th Nov',
'Networks - PROD feedback - please implement today in PROD'): 'invoice amount' -> 'payment amount'
in node 110's general line. INT 547469427 and PROD 124295894, same edit. 48 changelog."""
import json
OLD='If you have not received this, please confirm the invoice amount and your Merchant Number.'
NEW='If you have not received this, please confirm the payment amount and your Merchant Number.'
for src,out in (('3 BRANCH - Networks INT 547469427 (BEFORE baseline 2026-11-05).json','3 BRANCH - Networks INT 547469427 (payment amount 2026-11-05).json'),
                ('3 BRANCH - Networks PROD 124295894 (BEFORE baseline 2026-11-05).json','3 BRANCH - Networks PROD 124295894 (payment amount 2026-11-05).json')):
    t=json.load(open(src,encoding='utf-8')); n=t['nodes']
    c=n['110']['content']; assert c.count(OLD)==1; n['110']['content']=c.replace(OLD,NEW)
    n['48']['content']+='<p>2026-11-05: General pushback line now "If you have not received this, please confirm the payment amount and your Merchant Number." (110) (Gemma Danks, 5 Nov, PROD feedback).</p>'
    json.dump(t,open(out,'w',encoding='utf-8'),ensure_ascii=False,indent=1)
print('built')
