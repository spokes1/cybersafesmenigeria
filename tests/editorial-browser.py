"""Whole-site editorial review: both themes, compact related cards and diagrams.
Requires tests/serve.py, Playwright and Chromium. Device controls use navigation-layout.py.
"""
from pathlib import Path
from playwright.sync_api import sync_playwright
import argparse,json
ROOT=Path(__file__).resolve().parents[1]
a=argparse.ArgumentParser();a.add_argument('--output',type=Path,required=True);a.add_argument('--routes',nargs='*');args=a.parse_args();args.output.mkdir(parents=True,exist_ok=True)
text_probe=(ROOT/'tests/theme-probe.js').read_text();card_probe=text_probe.replace('createTreeWalker(document.body,','createTreeWalker(window.__qaRoot||document.body,');surface_probe=(ROOT/'tests/theme-surface-probe.js').read_text();rows=[];errors=[]
routes=args.routes or sorted('/'+str(f.relative_to(ROOT/'public').parent) if f.parent!=ROOT/'public' else '/' for f in (ROOT/'public').rglob('index.html'))
routes=[r for r in routes if r not in ['/about/mission','/about/team','/about/contact']]

with sync_playwright() as p:
 b=p.chromium.launch(executable_path='/usr/bin/chromium',args=['--no-sandbox','--enable-unsafe-swiftshader'])
 for theme in ['light','dark']:
  for width in [390,1440]:
   ctx=b.new_context(viewport={'width':width,'height':1000},color_scheme=theme,reduced_motion='reduce');ctx.route('https://fonts.googleapis.com/**',lambda r:r.fulfill(content_type='text/css',body=''));page=ctx.new_page();page.on('pageerror',lambda e:errors.append(str(e)))
   for route in routes:
    page.goto('http://127.0.0.1:8788'+route)
    if route=='/learn/spot-the-scam':page.wait_for_selector('[data-action="hub"]')
    page.add_style_tag(content='.rv{opacity:1!important;transform:none!important}header.top{position:static!important}*{animation:none!important;transition:none!important}')
    def capture(state,card=None):
     page.evaluate('(e)=>window.__qaRoot=e',card.element_handle() if card else None)
     result=page.evaluate(card_probe if card else text_probe);result.pop('signatures');row={'route':route,'theme':theme,'width':width,'state':state,**result}
     if card is None:row.update(page.evaluate(surface_probe))
     rows.append(row)
    capture('default')
    page.locator('main details').evaluate_all('(ns)=>ns.forEach(n=>n.open=true)')
    cards=page.locator('.cs-learning-card')
    for i in range(cards.count()):
     card=cards.nth(i);assert card.locator('h3').count()==1 and card.locator('p').count()==1 and card.locator('.tag').count()==1
     style=card.evaluate('(n)=>({title:parseFloat(getComputedStyle(n.querySelector("h3")).fontSize),copy:parseFloat(getComputedStyle(n.querySelector("p")).fontSize),bg:getComputedStyle(n).backgroundColor})')
     assert style['title']==17 and style['copy']==14,(route,style)
     card.focus();capture('related card focus '+str(i+1),card);card.hover();capture('related card hover '+str(i+1),card);page.mouse.move(0,0)
    buttons=page.locator('main button[aria-pressed]')
    for i in range(buttons.count()):
     button=buttons.nth(i)
     if button.is_visible() and button.is_enabled():button.evaluate('(n)=>n.click()');capture('selected action '+str(i+1))
    # No numeric-only button replaces an action name; no numbered badges or headings.
    bad=page.locator('main').evaluate('''root=>[...root.querySelectorAll('h2,h3,legend,strong,button')].filter(n=>n.getClientRects().length&&!n.closest('.cs-game')&&(/^(?:\\d{1,2}[.)]\\s|(?:Step|Stage|Moment) \\d+[:.])/.test(n.textContent.trim())||(n.tagName==='BUTTON'&&/^\\d{1,2}$/.test(n.textContent.trim())))).map(n=>n.textContent.trim())''');assert not bad,(route,bad)
    counters=page.locator('main ol').evaluate_all("ns=>ns.filter(n=>getComputedStyle(n).listStyleType==='decimal').map(n=>n.className)");assert not counters,(route,counters)
    if route in ['/resources/organisations','/resources/tools','/resources/external','/threats/fake-bank-alerts'] and cards.count():page.locator('.cs-keep-learning').screenshot(path=str(args.output/(route.split('/')[-1]+'-'+theme+'-'+str(width)+'.png')))
    print(theme,width,route,'checked',flush=True)
   ctx.close()
 b.close()
report={'captures':rows,'pageErrors':errors,'limits':['Linux Chromium with virtual mobile widths, not physical Android/iOS or Safari.','Local Google Fonts CSS replaced by an empty response due environment certificate trust; production fonts unchanged.','Computed contrast/surface checks are triage, not a full WCAG audit.']}
(args.output/'editorial-browser.json').write_text(json.dumps(report,indent=2));bad=[r for r in rows if r['failures'] or r.get('icons') or r.get('surfaces') or r['overflow']];assert not errors,errors;assert not bad,bad[:3]
print('Passed',len(rows),'captures across',len(routes),'pages.')
