"""Contrast/layout triage in both themes, including expanded and selected states.
Requires local Chromium, Playwright and `python tests/serve.py`.
This checks computed text colours against ancestor solid/gradient stop colours;
transparent/image/gradient typography still needs visual review, not WCAG certification.
"""
from playwright.sync_api import sync_playwright
from pathlib import Path
import argparse,json,hashlib
ROOT=Path(__file__).resolve().parents[1]
parser=argparse.ArgumentParser();parser.add_argument('phase');parser.add_argument('--output',type=Path,default=ROOT/'docs/THEME_QA_2026-11-12');parser.add_argument('--baseline-css',type=Path);parser.add_argument('--widths',default='390,1440');parser.add_argument('--states',action='store_true');parser.add_argument('--routes',nargs='*');args=parser.parse_args()
OUT=args.output;OUT.mkdir(parents=True,exist_ok=True);probe=(ROOT/'tests/theme-probe.js').read_text()
routes=args.routes or sorted('/'+str(f.relative_to(ROOT/'public').parent) if f.parent!=ROOT/'public' else '/' for f in (ROOT/'public').rglob('index.html'))
records=[]
with sync_playwright() as p:
 browser=p.chromium.launch(executable_path='/usr/bin/chromium',headless=True,args=['--no-sandbox','--enable-unsafe-swiftshader'])
 for theme in ['light','dark']:
  for width in map(int,args.widths.split(',')):
   context=browser.new_context(viewport={'width':width,'height':1000},color_scheme=theme,reduced_motion='reduce')
   context.route('https://fonts.googleapis.com/**',lambda route:route.fulfill(content_type='text/css',body=''))
   if args.baseline_css:context.route('**/assets/css/theme.css',lambda route:route.fulfill(content_type='text/css',body=args.baseline_css.read_text()))
   page=context.new_page()
   for route in routes:
    page.goto('http://127.0.0.1:8788'+route);page.wait_for_load_state('domcontentloaded')
    if route=='/learn/spot-the-scam':page.wait_for_selector('[data-action="hub"]')
    page.add_style_tag(content='.rv{opacity:1!important;transform:none!important}*{animation:none!important;transition:none!important}')
    def capture(state):
     result=page.evaluate(probe);signature=hashlib.sha256(json.dumps(result.pop('signatures'),sort_keys=True).encode()).hexdigest();records.append({'route':route,'theme':theme,'width':width,'state':state,'signature':signature,**result})
    capture('default')
    if args.states:
     details=page.locator('main details');count=details.count()
     if count:
      details.evaluate_all('(nodes)=>nodes.forEach(n=>n.open=true)');capture('expanded details')
     buttons=page.locator('main button[aria-pressed],main button[role="tab"]');count=min(buttons.count(),60)
     for index in range(count):
      button=buttons.nth(index)
      if button.is_visible() and button.is_enabled():
       button.evaluate('(node)=>node.click()');capture('choice '+str(index+1))
       if not args.baseline_css:
        button.focus();capture('focus '+str(index+1));button.hover();capture('hover '+str(index+1));page.mouse.move(0,0)
    current=[r for r in records if r['route']==route and r['theme']==theme and r['width']==width]
    print(theme,width,route,'states',len(current),'flags',sum(len(r['failures']) for r in current),flush=True)
   context.close()
 browser.close()
(OUT/(args.phase+'.json')).write_text(json.dumps(records,indent=2))
