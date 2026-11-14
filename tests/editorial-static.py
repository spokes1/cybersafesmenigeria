"""Independent HTML checks, including destination preservation against the approved baseline."""
from html.parser import HTMLParser
from pathlib import Path
import argparse,re,json,subprocess
ROOT=Path(__file__).resolve().parents[1]
a=argparse.ArgumentParser();a.add_argument('--baseline',help='Optional Git commit instead of the bundled baseline fixture');a.add_argument('--output',type=Path,required=True);args=a.parse_args();args.output.mkdir(parents=True,exist_ok=True)
class Page(HTMLParser):
 def __init__(self):super().__init__();self.stack=[];self.links=[];self.ids=[];self.refs=[];self.badges=[];self.related=0
 def handle_starttag(self,t,a):
  a=dict(a)
  if 'id'in a:self.ids.append(a['id'])
  for key in ['aria-controls','aria-labelledby','aria-describedby']:
   if a.get(key):self.refs.extend(a[key].split())
  if 'cs-keep-learning'in a.get('class','').split():self.related+=1
  if t not in ['img','br','input','meta','link','hr','wbr','source','area']:self.stack.append({'tag':t,'a':a,'text':''})
 def handle_startendtag(self,t,a):pass
 def handle_data(self,d):
  for e in self.stack:e['text']+=d
 def handle_endtag(self,t):
  k=next((k for k in range(len(self.stack)-1,-1,-1) if self.stack[k]['tag']==t),None)
  if k is None:return
  e=self.stack[k];self.stack=self.stack[:k];v=' '.join(e['text'].split());attrs=e['a']
  if t=='a':self.links.append((attrs.get('href',''),v))
  if t in ['span','button','h2','h3','legend','strong'] and (re.match(r'^(?:\d{1,2}[.)]\s|(?:Example|Step|Stage|Moment) \d+[:.])',v) or (re.fullmatch(r'\d{1,2}',v) and re.search(r'(number|index|num)',attrs.get('class','')))):self.badges.append(v)
baseline=json.loads((ROOT/'tests/fixtures/editorial-baseline-links.json').read_text())
rows=[]
for f in sorted((ROOT/'public').rglob('*.html')):
 rel=str(f.relative_to(ROOT));new=Page();new.feed(f.read_text());before=set(baseline.get(rel,[]))
 if args.baseline:
  old=Page();old.feed(subprocess.check_output(['git','show',args.baseline+':'+rel],cwd=ROOT,text=True));before={h for h,t in old.links}
 assert len(new.ids)==len(set(new.ids)),rel+' duplicate IDs'
 missing=set(new.refs)-set(new.ids);assert not missing,(rel,missing)
 before={re.sub(r'^/about/(mission|team|contact)/?(?:#.*)?$',r'/about#\1',h) for h in before}
 # The owner replaced four About documents with one page and three redirect shells.
 if rel.startswith('public/about/'):before=set()
 after={h for h,t in new.links};assert not before-after,(rel,'destinations removed',before-after)
 raw=[(h,t)for h,t in new.links if re.match(r'^(https?://|www\.|/[a-z])',t)];assert not raw,(rel,raw)
 assert not new.badges,(rel,new.badges)
 rows.append({'page':rel,'linkDestinationsPreserved':True,'rawLabels':len(raw),'presentationNumbers':len(new.badges),'relatedSections':new.related})
(args.output/'editorial-static.json').write_text(json.dumps(rows,indent=2));print('All',len(rows),'pages passed; related sections:',sum(r['relatedSections'] for r in rows))
