from playwright.sync_api import sync_playwright
from pathlib import Path
import json,re,argparse
a=argparse.ArgumentParser();a.add_argument("--output",type=Path,required=True);args=a.parse_args();args.output.mkdir(parents=True,exist_ok=True)
rows=[]
with sync_playwright() as p:
 b=p.chromium.launch(executable_path='/usr/bin/chromium',args=['--no-sandbox'])
 for theme in ['light','dark']:
  ctx=b.new_context(viewport={'width':390,'height':900},color_scheme=theme,reduced_motion='reduce');ctx.route('https://fonts.googleapis.com/**',lambda r:r.fulfill(content_type='text/css',body=''));page=ctx.new_page();page.goto('http://127.0.0.1:8788/resources/security-checklist')
  page.locator('#sc2-form input[type=radio]').evaluate_all("ns=>{for(const n of ns)if(n.value==='not_yet')n.click()}");page.locator('#sc2-form button[type=submit]').click();page.locator('#sc2-result').wait_for();s=page.locator('#sc2-result').inner_text();assert not re.search('[A-Z][0-9]+[.]',s);assert '0%' in s and '15 of 15 answered' in s
  assert page.locator('#sc2-result ol').evaluate_all("ns=>ns.filter(n=>n.getClientRects().length).every(n=>getComputedStyle(n).listStyleType==='disc')")
  rows.append({'theme':theme,'questionIDsHidden':True,'factualProgressPreserved':True,'listsUnnumbered':True});ctx.close()
 b.close()
(args.output/'selfcheck-result.json').write_text(json.dumps(rows,indent=2));print('Both self-check result themes passed.')
