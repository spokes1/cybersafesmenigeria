"""Real Chromium, virtual-time proof of the 10-visible-second page notice."""
from pathlib import Path
from playwright.sync_api import sync_playwright
import argparse,datetime,json,math
parser=argparse.ArgumentParser();parser.add_argument('--output',type=Path,required=True);args=parser.parse_args();args.output.mkdir(parents=True,exist_ok=True);rows=[]
ROOT=Path(__file__).resolve().parents[1]
INIT="window.__qaVisible=true;Object.defineProperty(document,'visibilityState',{get:()=>window.__qaVisible?'visible':'hidden'});"
# Wrap only the module's scheduling call, without changing its deadline/guards.
# Keeping instrumentation in the same-origin module also respects the real CSP.
MODULE="""window.__qaSchedule=(callback,delay)=>{
 if(delay>9000&&delay<=10000)window.__qaDeadline=performance.now()+delay;
 return setTimeout(()=>{callback();if(window.__cybersafeKenny?.getState().panel==='notice')window.__qaNoticeAt=performance.now();},delay);
};"""+(ROOT/'tools/assets/kenny-website.js').read_text().replace('noticeTimer=setTimeout(checkNotice,','noticeTimer=window.__qaSchedule(checkNotice,')
with sync_playwright() as p:
 b=p.chromium.launch(executable_path='/usr/bin/chromium',args=['--no-sandbox'])
 def fresh(theme='dark',width=390):
  ctx=b.new_context(viewport={'width':width,'height':900},color_scheme=theme,reduced_motion='reduce');ctx.route('https://fonts.googleapis.com/**',lambda r:r.fulfill(content_type='text/css',body=''));ctx.add_init_script(INIT);ctx.route('**/assets/js/kenny-website.js',lambda r:r.fulfill(content_type='text/javascript',body=MODULE));page=ctx.new_page();fixed=datetime.datetime(2026,11,12,tzinfo=datetime.timezone.utc);page.clock.install(time=fixed);page.clock.pause_at(fixed+datetime.timedelta(seconds=1));return ctx,page
 def panel(page):return page.evaluate('window.__cybersafeKenny.getState().panel')
 for theme in ['light','dark']:
  for width in [390,1440]:
   for route in ['/about#mission','/about#team','/about#contact']:
    ctx,page=fresh(theme,width);page.goto('http://127.0.0.1:8788'+route);page.wait_for_selector('kenny-companion', state='attached');assert page.evaluate('Boolean(window.__qaDeadline)');remaining=page.evaluate('window.__qaDeadline-performance.now()');page.clock.run_for(max(0,math.floor(remaining)-1));assert panel(page) is None
    page.clock.run_for(2);assert panel(page)=='notice';assert page.locator('kenny-companion .panel').is_visible();assert 'continuous development' in page.locator('kenny-companion .body').inner_text();assert not page.locator('kenny-companion .primary').is_visible()
    timing=page.evaluate('({deadline:window.__qaDeadline,openedAt:window.__qaNoticeAt})');assert abs(timing['openedAt']-timing['deadline'])<1,timing
    page.screenshot(path=str(args.output/(route.split('#')[-1]+'-'+theme+'-'+str(width)+'.png')),full_page=True)
    page.locator('kenny-companion .close').click();page.reload();page.wait_for_selector('kenny-companion', state='attached');page.clock.run_for(10100);assert panel(page)!='notice'
    rows.append({'route':route,'theme':theme,'width':width,'opensAtScheduledDeadline':True,'oncePerPageSession':True,**timing});ctx.close()
 ctx,page=fresh();page.goto('http://127.0.0.1:8788/about#contact');page.wait_for_selector('kenny-companion', state='attached');assert page.evaluate('Boolean(window.__qaDeadline)');page.locator('[data-search]').click();page.clock.run_for(10100);assert panel(page) is None;page.keyboard.press('Escape');page.clock.run_for(200);assert panel(page)=='notice';rows.append({'case':'search defers notice, then opens within 200 ms after closing','passed':True});ctx.close()
 for event in ['visibility','history']:
  ctx,page=fresh();page.goto('http://127.0.0.1:8788/about#team');page.wait_for_selector('kenny-companion', state='attached');assert page.evaluate('Boolean(window.__qaDeadline)');page.clock.run_for(4000)
  if event=='visibility':page.evaluate("window.__qaVisible=false;document.dispatchEvent(new Event('visibilitychange'))")
  else:page.evaluate("window.dispatchEvent(new PageTransitionEvent('pagehide',{persisted:true}))")
  page.clock.run_for(60000);assert panel(page) is None
  if event=='visibility':page.evaluate("window.__qaVisible=true;document.dispatchEvent(new Event('visibilitychange'))")
  else:page.evaluate("window.dispatchEvent(new PageTransitionEvent('pageshow',{persisted:true}))")
  page.clock.run_for(5999);assert panel(page) is None;page.clock.run_for(1);assert panel(page)=='notice';rows.append({'case':event+' suspension does not count towards 10 visible seconds','passed':True});ctx.close()
 b.close()
(args.output/'notice-deadline.json').write_text(json.dumps(rows,indent=2));print('All',len(rows),'deadline/session/visibility checks passed.')
