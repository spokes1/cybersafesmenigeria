"""Catch pale dark-theme panels, faint SVGs and link hover/focus regressions.
Requires tests/serve.py, Playwright and /usr/bin/chromium.
Approved game evidence mockups, photographs, PNG artwork and print-only pages
are outside this surface check. Game text and flows use theme-extra-states.py.
"""
from pathlib import Path
from playwright.sync_api import sync_playwright
import argparse,json
ROOT=Path(__file__).resolve().parents[1]
a=argparse.ArgumentParser();a.add_argument('phase');a.add_argument('--output',type=Path,required=True);a.add_argument('--baseline-css',type=Path);a.add_argument('--states',action='store_true');a.add_argument('--routes',nargs='*');a.add_argument('--widths',default='390,1440');args=a.parse_args();args.output.mkdir(parents=True,exist_ok=True)
text_probe=(ROOT/'tests/theme-probe.js').read_text();surface_probe=(ROOT/'tests/theme-surface-probe.js').read_text();rows=[]
routes=args.routes or sorted('/'+str(f.relative_to(ROOT/'public').parent) if f.parent!=ROOT/'public' else '/' for f in (ROOT/'public').rglob('index.html'))
with sync_playwright() as p:
 b=p.chromium.launch(executable_path='/usr/bin/chromium',args=['--no-sandbox','--enable-unsafe-swiftshader'])
 for theme in ['light','dark']:
  for width in map(int,args.widths.split(',')):
   ctx=b.new_context(viewport={'width':width,'height':1000},color_scheme=theme,reduced_motion='reduce');ctx.route('https://fonts.googleapis.com/**',lambda r:r.fulfill(content_type='text/css',body=''))
   if args.baseline_css:ctx.route('**/assets/css/theme.css',lambda r:r.fulfill(content_type='text/css',body=args.baseline_css.read_text()))
   page=ctx.new_page()
   for route in routes:
    page.goto('http://127.0.0.1:8788'+route)
    if route=='/learn/spot-the-scam':page.wait_for_selector('[data-action="hub"]')
    page.add_style_tag(content='.rv{opacity:1!important;transform:none!important}header.top{position:static!important}*{animation:none!important;transition:none!important}')
    def capture(state):
     text=page.evaluate(text_probe);text.pop('signatures');row={'route':route,'theme':theme,'width':width,'state':state,**text,**page.evaluate(surface_probe)};rows.append(row)
    capture('default')
    if args.states:
     page.locator('main details').evaluate_all('(ns)=>ns.forEach(n=>n.open=true)');capture('expanded')
     # All visibly styled links, including every related/Keep learning card.
     links=page.locator('main a[class]')
     for i in range(links.count()):
      link=links.nth(i)
      if not link.is_visible():continue
      link.focus();capture('link focus '+str(i+1));link.hover();capture('link hover '+str(i+1));page.mouse.move(0,0)
     buttons=page.locator('main button[aria-pressed],main button[role="tab"]')
     for i in range(buttons.count()):
      button=buttons.nth(i)
      if not button.is_visible() or not button.is_enabled():continue
      button.evaluate('(n)=>n.click()');button.focus();capture('choice focus '+str(i+1));button.hover();capture('choice hover '+str(i+1));page.mouse.move(0,0)
    batch=[r for r in rows if r['route']==route and r['theme']==theme and r['width']==width];print(theme,width,route,len(batch),'states; flags',sum(len(r['surfaces'])+len(r['icons'])+len(r['failures'])+r['overflow'] for r in batch),flush=True)
   ctx.close()
 b.close()
(args.output/(args.phase+'-consistency.json')).write_text(json.dumps(rows,indent=2))
