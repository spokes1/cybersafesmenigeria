"""Browser proof for unique topic menus, transparent branding and mobile motion.
Run with tests/serve.py. Uses installed Playwright and Linux Chromium.
"""
from pathlib import Path
from playwright.sync_api import sync_playwright
import argparse,json
ROOT=Path(__file__).resolve().parents[1]
p=argparse.ArgumentParser();p.add_argument('--output',type=Path,required=True);a=p.parse_args();a.output.mkdir(parents=True,exist_ok=True)
routes=sorted('/'+str(f.relative_to(ROOT/'public').parent) if f.parent!=ROOT/'public' else '/' for f in (ROOT/'public').rglob('index.html'))
rows=[];errors=[]
routes=[r for r in routes if r not in ['/about/mission','/about/team','/about/contact']]

with sync_playwright() as p:
 b=p.chromium.launch(executable_path='/usr/bin/chromium',args=['--no-sandbox','--enable-unsafe-swiftshader','--use-angle=swiftshader'])
 def context(**kw):
  c=b.new_context(**kw);c.route('https://fonts.googleapis.com/**',lambda r:r.fulfill(content_type='text/css',body=''));c.on('page',lambda pg:pg.on('pageerror',lambda e:errors.append(str(e))));return c
 for theme in ['light','dark']:
  c=context(viewport={'width':1440,'height':900},color_scheme=theme,reduced_motion='reduce');page=c.new_page()
  for route in routes:
   page.goto('http://127.0.0.1:8788'+route)
   if route=='/learn/spot-the-scam':page.wait_for_selector('[data-action="hub"]')
   menu=page.locator('header.top .dd').evaluate_all("ns=>ns.map(n=>({root:n.querySelector('a.l').getAttribute('href'),links:[...n.querySelectorAll('.panel a')].map(a=>({href:a.getAttribute('href'),label:a.textContent.trim()}))}))")
   leaves=[link for section in menu for link in section['links']];assert len(leaves)==29 and len({x['href'] for x in leaves})==29,route
   for section in menu:assert all(link['href'].startswith(section['root']+'/') for link in section['links']),route
   assert all(x['label']!='Games with Kenny' for x in leaves)
   game=[x for x in leaves if x['href']=='/learn/spot-the-scam'];assert game==[{'href':'/learn/spot-the-scam','label':'Cyber Practice'}]
   desktop=sorted((x['href'],x['label']) for x in leaves);mobile=page.locator('#mnav details').evaluate_all("ns=>ns.flatMap(n=>[...n.querySelectorAll('a')].slice(1).map(a=>[a.getAttribute('href'),a.textContent.trim()]))");assert desktop==sorted(tuple(x) for x in mobile)
   brand=page.locator('.lg').evaluate_all("ns=>ns.map(n=>({color:getComputedStyle(n).backgroundColor,mask:getComputedStyle(n).maskImage,before:getComputedStyle(n,'::before').content,after:getComputedStyle(n,'::after').content}))")
   assert len(brand)==2 and all(x['color']==('rgb(255, 255, 255)' if theme=='dark' else 'rgb(15, 118, 110)') and 'cybersafe-logo-white.png' in x['mask'] and x['before'] in ['none','normal'] and x['after'] in ['none','normal'] for x in brand),(route,brand)
   assert not page.evaluate('document.documentElement.scrollWidth>innerWidth'),route
   rows.append({'case':'page navigation and branding','route':route,'theme':theme,'passed':True})
  page.goto('http://127.0.0.1:8788/learn');page.locator('.dd>a.l[href="/learn"]').hover();page.locator('.dd .panel a[href="/learn/spot-the-scam"]').scroll_into_view_if_needed();page.screenshot(path=str(a.output/('learn-menu-'+theme+'.png')))
  page.locator('header.top .logo').screenshot(path=str(a.output/('logo-'+theme+'.png')));page.locator('footer .lg').screenshot(path=str(a.output/('footer-logo-'+theme+'.png')))
  page.goto('http://127.0.0.1:8788/protect-your-business');assert page.locator('main .grid').first.locator('a').count()==4;assert page.locator('main .grid').nth(1).locator('.tag').all_text_contents()==['Learn']*3
  page.locator('.dd>a.l[href="/protect-your-business"]').hover();page.screenshot(path=str(a.output/('protect-menu-'+theme+'.png')))
  page.goto('http://127.0.0.1:8788/');page.locator('[data-search]').click();page.locator('#q').fill('cyber practice');result=page.locator('#sb a[href="/learn/spot-the-scam"]');result.wait_for();assert result.locator('b').inner_text()=='Cyber Practice';assert result.locator('em').text_content()=='Learn';page.locator('#q').fill('privacy policy');legal=page.locator('#sb a[href="/privacy"]');legal.wait_for();assert legal.locator('em').text_content()=='Legal';c.close()
 # No desktop pause control, even on narrow or touch-capable desktop windows.
 c=context(viewport={'width':1440,'height':900},reduced_motion='no-preference',color_scheme='dark');page=c.new_page();page.goto('http://127.0.0.1:8788/learn/spot-the-scam');page.wait_for_selector('.kenny-stage.has-model',timeout=60000);assert not page.locator('#motionToggle').is_visible();assert page.locator('html').get_attribute('data-kenny-motion')=='on';assert page.locator('.topic-location strong').inner_text()=='Cyber Practice';page.screenshot(path=str(a.output/'desktop-game.png'))
 page.set_viewport_size({'width':390,'height':900});assert not page.locator('#motionToggle').is_visible();page.emulate_media(reduced_motion='reduce');page.wait_for_selector('html[data-kenny-motion=off]',state='attached');page.emulate_media(reduced_motion='no-preference');page.wait_for_selector('html[data-kenny-motion=on]',state='attached');rows.append({'case':'desktop motion on, desktop resize and live reduced-motion preference','passed':True});c.close()
 c=context(viewport={'width':1280,'height':900},has_touch=True,reduced_motion='reduce',user_agent='Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/131.0.0.0 Safari/537.36');page=c.new_page();page.goto('http://127.0.0.1:8788/learn/spot-the-scam');page.wait_for_selector('[data-action="hub"]');assert not page.locator('#motionToggle').is_visible();rows.append({'case':'touch-capable desktop has no mobile control','passed':True});c.close()
 for name in ['Pixel 7','iPhone 13','iPad Pro 11']:
  settings=p.devices[name].copy();settings.pop('default_browser_type',None);c=context(**settings,reduced_motion='no-preference',color_scheme='dark');page=c.new_page();page.goto('http://127.0.0.1:8788/learn/spot-the-scam');page.wait_for_selector('[data-action="hub"]');toggle=page.locator('#motionToggle');assert toggle.is_visible() and toggle.inner_text()=='Pause motion';toggle.click();assert toggle.inner_text()=='Resume motion';assert page.locator('html').get_attribute('data-kenny-motion')=='off';toggle.click();assert toggle.inner_text()=='Pause motion';assert page.locator('html').get_attribute('data-kenny-motion')=='on';page.wait_for_selector('.kenny-stage.has-model',timeout=60000)
  if name=='Pixel 7':
   page.screenshot(path=str(a.output/'mobile-game.png'));page.locator('#bg').click();assert page.locator('#mnav').get_attribute('class')=='open';page.screenshot(path=str(a.output/'mobile-menu.png'));page.keyboard.press('Escape')
  page.set_viewport_size({'width':1366,'height':768});assert toggle.is_visible();rows.append({'case':name+' mobile pause/resume and landscape visibility','passed':True});c.close()
 b.close()
assert not errors,errors
report={'checks':rows,'pageErrors':errors,'limits':['Linux Chromium device emulation, not physical mobile devices or Safari.','Local font CSS is replaced by an empty response because of environment certificate trust. Production fonts are unchanged.']}
(a.output/'navigation-layout.json').write_text(json.dumps(report,indent=2));print('Passed',len(rows),'page/device checks with no page errors.')
