"""Run after `node tools/build.mjs` and `python tests/serve.py`. Uses local Chromium."""
from playwright.sync_api import sync_playwright
from pathlib import Path
import json,datetime
ROOT=Path(__file__).resolve().parents[1];OUT=ROOT/'docs/KENNY_INTEGRATION_2026-11-12';OUT.mkdir(exist_ok=True)
BASE='http://127.0.0.1:8788';report={'checks':[],'page_errors':[],'failed_local_requests':[],'limits':['Chromium on Linux with software WebGL; mobile viewports are not physical Android/iOS devices.','Google Fonts is replaced with an empty CSS response in local QA because this Chromium does not trust the environment font endpoint certificate. Production font URLs are unchanged.']}
GOOD=[['b'],['c'],['a','b'],['b'],['c']];BAD=[['a'],['a'],['c','d'],['a'],['a']]
def checkpoint(label):report['checks'].append(label);print(label,flush=True)
with sync_playwright() as p:
 browser=p.chromium.launch(executable_path='/usr/bin/chromium',headless=True,args=['--no-sandbox','--enable-unsafe-swiftshader','--use-angle=swiftshader'])
 def context(**kw):
  ctx=browser.new_context(**kw)
  ctx.route('https://fonts.googleapis.com/**',lambda route:route.fulfill(status=200,content_type='text/css',body=''))
  ctx.on('page',lambda pg:pg.on('pageerror',lambda e:report['page_errors'].append(str(e))))
  ctx.on('response',lambda r:report['failed_local_requests'].append({'url':r.url,'status':r.status}) if r.url.startswith(BASE) and r.status>=400 else None)
  return ctx
 # Crawl every generated route under the real CSP; check one article heading and game isolation.
 ctx=context(viewport={'width':1440,'height':1000},reduced_motion='reduce');page=ctx.new_page()
 routes=['/'+str(f.relative_to(ROOT/'public').parent).replace('\\','/') for f in (ROOT/'public').rglob('index.html')];routes=[('/' if x=='/.' else x) for x in routes]
 for route in sorted(routes):
  response=page.goto(BASE+route);assert response.status==200,route
  if route=='/learn/spot-the-scam':page.wait_for_selector('[data-action="hub"]')
  assert page.locator('header.top').count()==1 and page.locator('footer').count()==1,route
  assert not page.evaluate('document.documentElement.scrollWidth>innerWidth'),route
  assert page.locator('#stsKennyRoot').count()==0,route
 checkpoint(f'All {len(routes)} generated pages loaded with the real shell, no legacy widget or desktop overflow')
 # All score totals and full article destinations.
 for score in range(6):
  page.goto(BASE+'/learn/spot-the-scam/');page.locator('[data-action="hub"]').click();page.locator('[data-intro="scam"]').click();page.locator('[data-action="start"]').click()
  for i in range(5):
   for option in (GOOD[i] if i<score else BAD[i]):page.locator('[data-choice="'+option+'"]').click()
   page.locator('#submit').click();assert page.locator('.article-action').get_attribute('href') in ['/threats/fake-bank-alerts','/threats/whatsapp-hijacking','/threats/business-email-compromise','/learn/phishing-guide','/protect-your-business/payment-security'];page.locator('[data-action="next"]').click()
  assert page.locator('.score-card>strong').inner_text().split('/')[0].strip()==str(score)
  assert page.locator('.result-actions a[href="/"]').last.is_visible()
  if score==5:page.screenshot(path=str(OUT/'game-results-desktop.png'),full_page=True)
 checkpoint('All Spot the Scam score totals 0–5, article destinations and results navigation passed')
 # Ransomware guided recovery, direct article entry and return target.
 page.goto(BASE+'/threats/ransomware/');page.locator('a[href="/learn/spot-the-scam?activity=ransom"]').click();page.locator('[data-action="start"]').click()
 assert page.locator('#gameReturn').get_attribute('href').rstrip('/')=='/threats/ransomware'
 page.locator('[data-choice="b"]').click();page.locator('#submit').click();assert page.locator('[data-action="retry"]').is_visible();page.locator('[data-action="retry"]').click()
 for choice in ['a','b','a']:
  page.locator('[data-choice="'+choice+'"]').click();page.locator('#submit').click();page.locator('[data-action="next"]').click()
 assert page.locator('.score-card>strong').inner_text().startswith('2');page.locator('[data-lesson="0"]').first.click();assert page.locator('a[href="/threats/ransomware"]').count()>0;page.locator('[data-action="results"]').first.click()
 assert page.evaluate("JSON.parse(sessionStorage.getItem('cybersafe.kenny.completed'))") is True
 checkpoint('Ransomware entry, 2/3 first-attempt recovery, completion event and return to reading passed')
 # Search classification bug regression, mobile menu and untouched self-check.
 page.goto(BASE+'/');page.locator('[data-search]').click();page.locator('#q').fill('our mission');page.wait_for_selector('#sb a[href="/about/mission"]');assert page.locator('#sb a[href="/about/mission"] em').text_content()=='About';page.keyboard.press('Escape')
 page.goto(BASE+'/resources/security-checklist/');assert page.locator('#sc2-form input[type=radio]').evaluate_all('(nodes)=>new Set(nodes.map(n=>n.name)).size')==15;assert page.locator('kenny-companion').count()==0
 assert len(list((ROOT/'public/downloads').glob('*.pdf')))==6
 checkpoint('Search About badges corrected; 15-question self-check and six downloads preserved')
 ctx.close()
 # Mobile/theme coverage on welcome, selector, intro, decision, feedback and article/host navigation.
 for theme in ['light','dark']:
  for width in [320,390,768]:
   ctx=context(viewport={'width':width,'height':900},color_scheme=theme,reduced_motion='reduce');pg=ctx.new_page();pg.goto(BASE+'/learn/spot-the-scam/');pg.wait_for_selector('[data-action="hub"]')
   for action in ['[data-action="hub"]','[data-intro="ransom"]','[data-action="start"]','[data-choice="a"]','#submit']:
    assert not pg.evaluate('document.documentElement.scrollWidth>innerWidth'),(theme,width,action);pg.locator(action).click()
   assert not pg.evaluate('document.documentElement.scrollWidth>innerWidth');pg.screenshot(path=str(OUT/f'feedback-{theme}-{width}.png'),full_page=True)
   pg.goto(BASE+'/');pg.locator('#bg').click() if width<1121 else None
   if width<1121:assert pg.locator('#mnav').get_attribute('class')=='open';pg.keyboard.press('Escape');assert pg.locator('#bg').get_attribute('aria-expanded')=='false'
   ctx.close()
 checkpoint('Light/dark game flows at 320/390/768 px, mobile menu and overflow checks passed')
 # Virtual foreground time tests use actual browser timers and the deployed runtime.
 def timed_page():
  c=context(viewport={'width':390,'height':844},reduced_motion='reduce');pg=c.new_page();fixed=datetime.datetime(2026,11,12,0,0,tzinfo=datetime.timezone.utc);pg.clock.install(time=fixed);pg.clock.pause_at(fixed+datetime.timedelta(seconds=1));return c,pg
 c,pg=timed_page();pg.goto(BASE+'/learn/');pg.wait_for_function('Boolean(window.__cybersafeKenny)');pg.clock.run_for(29960);assert pg.evaluate('window.__cybersafeKenny.getState().panel') is None;pg.clock.run_for(80);assert pg.evaluate('window.__cybersafeKenny.getState().panel')=='invite';pg.clock.run_for(7040);assert pg.evaluate('window.__cybersafeKenny.getState().tucked') is True
 pg.locator('kenny-companion .peeker').click();assert pg.locator('kenny-companion .primary').is_visible();pg.locator('kenny-companion .primary').click();pg.wait_for_selector('[data-action="hub"]');assert pg.evaluate("sessionStorage.getItem('cybersafe.kenny.completed')") is None
 assert pg.locator('#gameReturn').get_attribute('href').rstrip('/')=='/learn';c.close();checkpoint('Real-browser 30-second invitation, timeout/tuck, edge click and Play without false completion passed')
 for route in ['/about/mission','/about/team','/about/contact']:
  c,pg=timed_page();pg.goto(BASE+route);pg.wait_for_function('Boolean(window.__cybersafeKenny)');pg.clock.run_for(9800);assert pg.evaluate('window.__cybersafeKenny.getState().panel') is None;pg.clock.run_for(400);assert pg.evaluate('window.__cybersafeKenny.getState().panel')=='notice';assert 'continuous development' in pg.locator('kenny-companion .body').inner_text();assert not pg.locator('kenny-companion .primary').is_visible();pg.screenshot(path=str(OUT/(route.split('/')[-1]+'-notice.png')),full_page=True)
  pg.locator('kenny-companion .close').click();pg.reload();pg.wait_for_function('Boolean(window.__cybersafeKenny)');pg.clock.run_for(11000);assert pg.evaluate('window.__cybersafeKenny.getState().panel')!='notice';c.close()
 checkpoint('All three 10-second page notices passed; once per page/session and no overlapping invitation')
 # Deferred messages while search is open.
 c,pg=timed_page();pg.goto(BASE+'/about/contact');pg.wait_for_function('Boolean(window.__cybersafeKenny)');pg.locator('[data-search]').click();pg.clock.run_for(12000);assert pg.evaluate('window.__cybersafeKenny.getState().panel') is None;pg.keyboard.press('Escape');pg.clock.run_for(2000);assert pg.evaluate('window.__cybersafeKenny.getState().panel')=='notice';c.close();checkpoint('Search interaction suppresses the page notice until closed')
 # Actual WebGL texture/material load under the Netlify CSP and a rendered colour screenshot.
 ctx=context(viewport={'width':1440,'height':1000},color_scheme='dark');pg=ctx.new_page();pg.goto(BASE+'/learn/spot-the-scam/');pg.wait_for_selector('.kenny-stage.has-model',timeout=60000);assert pg.locator('.kenny-stage canvas').count()==1;pg.screenshot(path=str(OUT/'kenny-3d-colour-desktop.png'),full_page=True);ctx.close();checkpoint('Actual WebGL model and validated textured materials loaded under site CSP')
 browser.close()
assert not report['page_errors'],report['page_errors'];assert not report['failed_local_requests'],report['failed_local_requests']
(OUT/'browser-report.json').write_text(json.dumps(report,indent=2));print('BROWSER QA PASSED',flush=True)
