"""Before/after visual evidence for the owner's reported theme defects."""
from pathlib import Path
from playwright.sync_api import sync_playwright
import argparse
p=argparse.ArgumentParser();p.add_argument('phase');p.add_argument('--output',type=Path,required=True);p.add_argument('--baseline-css',type=Path);a=p.parse_args();a.output.mkdir(parents=True,exist_ok=True)
items=[('/learn/employee-security','.es-story-figure','employee'),('/threats/phishing','.ph-response-panel','phishing'),('/threats/malware','.mw-hero-art','malware'),('/resources/external','.er-path-grid','resources'),('/resources/organisations','.org-selector','organisations'),('/resources/tools','.tr-needs','tools'),('/threats/social-engineering','.se-call-controls','numbers'),('/learn/employee-security','.es-related-card','related'),('/','header.top .logo','logo'),('/','footer .lg','footer-logo')]
with sync_playwright() as p:
 b=p.chromium.launch(executable_path='/usr/bin/chromium',args=['--no-sandbox'])
 combos=[('dark',1440)] if a.baseline_css else [('dark',1440),('light',1440),('dark',390),('light',390)]
 for theme,width in combos:
  ctx=b.new_context(color_scheme=theme,viewport={'width':width,'height':1000},reduced_motion='reduce');ctx.route('https://fonts.googleapis.com/**',lambda r:r.fulfill(content_type='text/css',body=''))
  if a.baseline_css:ctx.route('**/assets/css/theme.css',lambda r:r.fulfill(content_type='text/css',body=a.baseline_css.read_text()))
  page=ctx.new_page()
  for route,selector,name in items:
   page.goto('http://127.0.0.1:8788'+route);page.add_style_tag(content='.rv{opacity:1!important;transform:none!important}header.top{position:static!important}kenny-companion{display:none!important}*{animation:none!important;transition:none!important}')
   el=page.locator(selector).first
   if name=='related':el.hover()
   if name=='phishing':page.locator('.b2-response-link').first.hover()
   el.screenshot(path=str(a.output/(name+'-'+a.phase+'-'+theme+'-'+str(width)+'.png')))
  ctx.close()
 b.close()
print(a.phase,'screenshots saved.')
