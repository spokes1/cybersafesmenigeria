from pathlib import Path
from pypdf import PdfReader
import re,json,hashlib
import argparse
root=Path(__file__).resolve().parents[1]
a=argparse.ArgumentParser();a.add_argument('--output',type=Path,required=True);args=a.parse_args();args.output.mkdir(parents=True,exist_ok=True)
origin=json.loads((root/'tools/content/site-config.json').read_text())['origin'];domain=origin.split('://')[1];rows=[]
approved=json.loads((root/'tests/fixtures/pdf-approved-content.json').read_text())
def normalise(text):return re.sub(r'\s+',' ',text.replace(domain,'')).strip()
for path in sorted((root/'public/downloads').glob('*.pdf')):
 new=PdfReader(path);expected=approved[path.name];assert len(new.pages)==len(expected),path.name
 links=[]
 for i,(a,b) in enumerate(zip(new.pages,expected),1):
  text=a.extract_text();assert domain in text;assert 'netlify.app' not in text
  assert normalise(text)==b,(path.name,i,'Approved printed content changed')
  uris=[]
  for ref in a.get('/Annots',[]):
   annotation=ref.get_object();action=annotation.get('/A',{});uri=action.get('/URI')
   if uri:
    assert uri==origin or uri.startswith(origin+'/'),(path.name,uri)
    route=uri[len(origin):].split('#')[0]
    if route:assert (root/'public'/route.strip('/')/'index.html').is_file(),uri
    x0,y0,x1,y1=map(float,annotation['/Rect']);assert 0<=x0<x1<=float(a.mediabox.width) and 0<=y0<y1<=float(a.mediabox.height)
    uris.append(uri)
  assert origin in uris,(path.name,i,'Footer is not clickable');links+=uris
 rows.append({'file':path.name,'pages':len(new.pages),'approvedTextPreserved':True,'uriAnnotations':len(links),'links':links,'sha256':hashlib.sha256(path.read_bytes()).hexdigest()})
(args.output/'pdf-verification.json').write_text(json.dumps(rows,indent=2)+'\n')
print('Verified',len(rows),'PDFs,',sum(r['pages']for r in rows),'pages and',sum(r['uriAnnotations']for r in rows),'clickable links; approved text preserved.')
