"""Small visual proof of the approved editorial layout and link labels."""
from pathlib import Path
from playwright.sync_api import sync_playwright
import argparse
p=argparse.ArgumentParser();p.add_argument('--output',type=Path,required=True);a=p.parse_args();a.output.mkdir(parents=True,exist_ok=True)
items=[('/resources/organisations','.cs-keep-learning','keep-learning'),('/resources/tools','#tools-accounts','named-links'),('/resources/organisations','.org-directory','organisation-links'),('/threats/social-engineering','.se-call-controls','action-controls')]
with sync_playwright() as p:
 b=p.chromium.launch(executable_path='/usr/bin/chromium',args=['--no-sandbox'])
 for theme in ['light','dark']:
  for width in [390,1440]:
   ctx=b.new_context(viewport={'width':width,'height':1000},color_scheme=theme,reduced_motion='reduce');ctx.route('https://fonts.googleapis.com/**',lambda r:r.fulfill(content_type='text/css',body=''));page=ctx.new_page()
   for route,selector,name in items:
    page.goto('http://127.0.0.1:8788'+route);page.add_style_tag(content='.rv{opacity:1!important;transform:none!important}header.top{position:static!important}kenny-companion{display:none!important}*{animation:none!important;transition:none!important}')
    page.locator(selector).first.screenshot(path=str(a.output/(name+'-'+theme+'-'+str(width)+'.png')))
   ctx.close()
 b.close()
print('Editorial screenshots saved.')
