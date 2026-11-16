from pathlib import Path
from pypdf import PdfReader
from PIL import Image
import re,json,hashlib
import argparse
root=Path(__file__).resolve().parents[1]
a=argparse.ArgumentParser();a.add_argument('--output',type=Path,required=True);args=a.parse_args();args.output.mkdir(parents=True,exist_ok=True)
origin=json.loads((root/'tools/content/site-config.json').read_text())['origin'];domain=origin.split('://')[1];rows=[]
approved=json.loads((root/'tests/fixtures/pdf-approved-content.json').read_text())
def normalise(text):
 text=re.sub(r'\s+',' ',text.replace(domain,'')).strip()
 # The owner replaced the old separately typeset name/tagline with the full PNG lockup.
 return text.removeprefix('CyberSafe SME Nigeria Practical cybersecurity guidance for Nigerian SMEs ').strip()
for path in sorted((root/'public/downloads').glob('*.pdf')):
 new=PdfReader(path);expected=approved[path.name];assert len(new.pages)==len(expected),path.name
 links=[]
 original_logo=Image.open(root/'public/assets/logo/cybersafe-logo-white.png').convert('LA')
 for i,(a,b) in enumerate(zip(new.pages,expected),1):
  text=a.extract_text();assert domain in text;assert 'netlify.app' not in text
  logos=[ref.get_object() for ref in a['/Resources'].get('/XObject',{}).values() if ref.get_object().get('/Subtype')=='/Image' and ref.get_object().get('/Width')==640 and ref.get_object().get('/Height')==176]
  assert len(logos)==1 and logos[0].get('/SMask'),(path.name,i,'Full transparent logo missing')
  assert logos[0].get_data()==original_logo.getchannel('L').tobytes()
  assert logos[0]['/SMask'].get_object().get_data()==original_logo.getchannel('A').tobytes()
  logo_names={name for name,ref in a['/Resources']['/XObject'].items() if ref.get_object() is logos[0]}
  operations=a.get_contents().operations
  assert any(op==b'Do' and vals[0] in logo_names for vals,op in operations),(path.name,i,'Logo is not drawn')
  assert any(op==b'cm' and abs(float(vals[0])/float(vals[3])-640/176)<0.001 and float(vals[5])>740 for vals,op in operations if op==b'cm' and vals[3]),(path.name,i,'Logo placement/aspect changed')
  assert not text.startswith('CyberSafe SME Nigeria'),(path.name,i,'Duplicate written brand name remains')
  assert normalise(text)==normalise(b),(path.name,i,'Approved printed content changed')
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
