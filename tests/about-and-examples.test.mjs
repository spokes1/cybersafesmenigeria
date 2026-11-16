// DOM integration against generated pages, without a browser or rendering claims.
// npm install --prefix /tmp/cs-qa linkedom --no-save --package-lock=false
// CS_TEST_DEPS=/tmp/cs-qa/node_modules/linkedom node --test tests/about-and-examples.test.mjs
import test from 'node:test';import assert from 'node:assert/strict';import fs from 'node:fs';import path from 'node:path';import vm from 'node:vm';import {createRequire} from 'node:module';
import {ABOUT_REDIRECTS,updateAboutLinks} from '../tools/lib/about-routes.mjs';
const require=createRequire(import.meta.url);const {parseHTML}=require(process.env.CS_TEST_DEPS || 'linkedom');
const ROOT=new URL('../',import.meta.url).pathname;const code=fs.readFileSync(ROOT+'tools/assets/example-reveal.js','utf8');
const groups=[['responses','threats/phishing',4],['phishing','learn/phishing-guide',4],['engineering','threats/social-engineering',3],['malware','threats/malware',4],['bec','threats/business-email-compromise',2],['social','learn/social-media-security',2],['tools','resources/tools',4],['basics','learn/cybersecurity-basics',5],['device','protect-your-business/device-security',6],['organisations','resources/organisations',5],['incident','protect-your-business/incident-response',4],['whatsapp','learn/whatsapp-security',3],['ransomware','threats/ransomware',4]];
function load(route,hash='') {
 const {document,window}=parseHTML(fs.readFileSync(ROOT+'public/'+route+'/index.html','utf8'));
 const location={hash};const history={replaceState(_s,_t,value){location.hash=value;}};let focused;
 window.HTMLElement.prototype.focus=function(){focused=this;};
 vm.runInNewContext(code,{document,window,location,history,console});
 // Deferred page wrappers are deliberately exercised too, checking ordering and idempotence.
 for(const script of document.querySelectorAll('script[src]')){
  const src=script.getAttribute('src');if(src.endsWith('example-reveal.js')||src.endsWith('site.js')||script.getAttribute('type')==='module')continue;
  const legacy=fs.readFileSync(ROOT+'public'+src,'utf8');if(legacy.includes('CyberSafeExamples'))vm.runInNewContext(legacy,{document,window,location,history,console});
 }
 return {document,window,location,focused:()=>focused};
}
function keyEvent(window,key){const e=new window.Event('keydown',{bubbles:true,cancelable:true});e.key=key;return e;}
for(const [name,route,count] of groups){
 test(`${name}: starts unselected, opens each detail, preserves content and viewed history`,()=>{
  const {document,window,focused}=load(route);const root=document.querySelector('.cs-reveal-group');assert.ok(root,name+' did not initialise');
  const choices=[...root.querySelectorAll('.cs-reveal-choice')],panels=[...root.querySelectorAll('.cs-reveal-panel')];
  assert.equal(choices.length,count);assert.equal(panels.length,count);assert.equal(root.querySelectorAll('.cs-reveal-instruction').length,1);
  assert.ok(panels.every(p=>p.hidden));assert.ok(choices.every(c=>!c.hidden&&c.getAttribute('aria-expanded')==='false'));
  for(let i=0;i<count;i++){
   const panel=document.getElementById(choices[i].getAttribute('aria-controls'));const content=panel.textContent;
   choices[i].click();assert.equal(panels.filter(p=>!p.hidden).length,1);assert.equal(panel.hidden,false);assert.equal(panel.textContent,content);
   assert.equal(choices.filter(c=>c.getAttribute('aria-expanded')==='true').length,1);
   assert.equal(choices[i].getAttribute('aria-expanded'),'true');assert.equal(choices[i].querySelector('.cs-viewed').hidden,false);
   assert.match(choices[i].getAttribute('aria-label'),/viewed/);assert.match(root.querySelector('.cs-reveal-status').textContent,/opened/);
  }
  assert.ok(choices.every(c=>!c.querySelector('.cs-viewed').hidden));choices[0].click();assert.equal(panels.filter(p=>!p.hidden).length,1);
  choices[0].dispatchEvent(keyEvent(window,'ArrowRight'));assert.equal(focused(),choices[1]);choices[0].dispatchEvent(keyEvent(window,'End'));assert.equal(focused(),choices.at(-1));
  if(name==='ransomware')assert.ok(choices.every(c=>!c.parentElement.hidden),'ransomware choices must remain accessible');
 });
 test(`${name}: direct detail hash opens the corresponding panel`,()=>{
  const first=load(route);const id=first.document.querySelectorAll('.cs-reveal-panel')[count-1].id;
  const {document}=load(route,'#'+id);const panels=[...document.querySelectorAll('.cs-reveal-panel')];assert.equal(panels.filter(p=>!p.hidden).length,1);assert.equal(document.getElementById(id).hidden,false);
 });
}
test('phishing anchors accept Space; a hash change reveals a hidden descendant target',()=>{
 const {document,window,location}=load('learn/phishing-guide');const choices=[...document.querySelectorAll('.cs-reveal-choice')];choices[2].dispatchEvent(keyEvent(window,' '));assert.equal(choices[2].getAttribute('aria-expanded'),'true');
 location.hash='#'+choices[3].getAttribute('aria-controls');window.dispatchEvent(new window.Event('hashchange'));assert.equal(choices[3].getAttribute('aria-expanded'),'true');
});
test('About has one hero, three sections, two correct team cards, and original contact guidance',()=>{
 const {document}=parseHTML(fs.readFileSync(ROOT+'public/about/index.html','utf8'));assert.equal(document.querySelectorAll('h1').length,1);
 for(const id of ['mission','team','contact'])assert.ok(document.getElementById(id));
 const cards=[...document.querySelectorAll('.about-person')];assert.equal(cards.length,2);assert.match(cards[0].textContent,/Coker Kehinde.*Founder & Project Lead/s);assert.match(cards[1].textContent,/Collins Eyetu.*Content & Design/s);
 assert.match(document.querySelector('#contact').textContent,/contact your bank or payment provider immediately/);assert.doesNotMatch(document.querySelector('#contact').textContent,/Please do not send passwords|Social channels are not live yet/);
 assert.equal(document.querySelectorAll('.main .dd').length,4);assert.ok(document.querySelector('.main a[href="/about"]'));assert.equal(document.querySelector('.main a[href="/about"]').getAttribute('aria-current'),'page');
});
test('legacy About URLs are redirect shells and excluded from search and sitemap',()=>{
 for(const [old,target]of Object.entries(ABOUT_REDIRECTS)){
  const h=fs.readFileSync(ROOT+'public'+old+'/index.html','utf8');assert.ok(h.includes(`content="0;url=${target}"`));assert.ok(!h.includes('kenny-website.js'));
  assert.equal(updateAboutLinks(`<a href="${old}/">Open</a>`),`<a href="${target}">Open</a>`);
 }
 const idx=JSON.parse(fs.readFileSync(ROOT+'public/assets/search-index.json','utf8'));assert.equal(idx.filter(x=>x.url==='/about').length,1);assert.ok(idx.every(x=>!Object.hasOwn(ABOUT_REDIRECTS,x.url)));
 const sitemap=fs.readFileSync(ROOT+'public/sitemap.xml','utf8');assert.ok(!/\/about\/(mission|team|contact)/.test(sitemap));
});
test('all generated internal anchors and accessible references resolve; no visitor links point at retired About pages',()=>{
 function walk(p){return fs.readdirSync(p,{withFileTypes:true}).flatMap(e=>e.isDirectory()?walk(path.join(p,e.name)):[path.join(p,e.name)]);}
 let pages=0;
 for(const file of walk(ROOT+'public').filter(f=>f.endsWith('.html'))){
  const {document}=parseHTML(fs.readFileSync(file,'utf8'));const ids=[...document.querySelectorAll('[id]')].map(x=>x.id);assert.equal(ids.length,new Set(ids).size,file+' duplicate ID');
  for(const el of document.querySelectorAll('[aria-controls],[aria-labelledby],[aria-describedby]'))for(const attr of ['aria-controls','aria-labelledby','aria-describedby'])for(const id of (el.getAttribute(attr)||'').split(/\s+/).filter(Boolean))assert.ok(document.getElementById(id),file+' missing '+id);
  for(const a of document.querySelectorAll('a[href]')){
   const href=a.getAttribute('href');assert.ok(!/^\/about\/(mission|team|contact)(?:\/|#|$)/.test(href));
   if(href.startsWith('#')&&href.length>1)assert.ok(document.getElementById(href.slice(1)),file+' broken anchor '+href);
   if(href.startsWith('/about#'))assert.ok(['mission','team','contact'].includes(href.split('#')[1]));
  }
  pages++;
 }
 console.log('Validated '+pages+' HTML files including redirects and 404.');
});
function noticeHarness(seen=new Set()) {
 const {document,window:domWindow}=parseHTML(fs.readFileSync(ROOT+'public/about/index.html','utf8'));const window={addEventListener(){},Event:domWindow.Event};let now=0,visible='visible',busy=false,next=1;const timers=new Map(),messages=[];let config;
 Object.defineProperty(document,'visibilityState',{get:()=>visible});Object.defineProperty(document,'activeElement',{get:()=>busy?{tagName:'INPUT'}:null});
 const setTimeout=(fn,delay)=>{const id=next++;timers.set(id,{at:now+delay,fn});return id;};const clearTimeout=id=>timers.delete(id);
 const mountKenny=options=>{config=options;return {getState:()=>({panel:null}),showNotice:(text,title)=>messages.push({at:now,text,title}),destroy(){}};};
 const source=fs.readFileSync(ROOT+'tools/assets/kenny-website.js','utf8').replace(/^import .*;\n/gm,'');
 vm.runInNewContext(source,{document,window,location:{pathname:'/about',search:'',hash:'',assign(){}},performance:{now:()=>now},setTimeout,clearTimeout,getComputedStyle:()=>({visibility:'visible'}),mountKenny,hasCompletedActivity:()=>false,hasSeenPageNotice:path=>seen.has(path),markPageNoticeSeen:path=>seen.add(path),rememberReadingReturn(){}});
 const advance=ms=>{const end=now+ms;for(let limit=0;limit<1000;limit++){const entries=[...timers.entries()].filter(([,v])=>v.at<=end).sort((a,b)=>a[1].at-b[1].at);if(!entries.length)break;const [id,timer]=entries[0];now=timer.at;timers.delete(id);timer.fn();}now=end;};
 return {messages,seen,advance,config,visibility(value){visible=value;document.dispatchEvent(new window.Event('visibilitychange'));},busy(value){busy=value;}};
}
test('combined About notice opens at 10 visible seconds and is once per session across all sections',()=>{
 const h=noticeHarness();h.advance(9999);assert.equal(h.messages.length,0);h.advance(1);assert.equal(h.messages.length,1);assert.equal(h.messages[0].at,10000);assert.match(h.messages[0].text,/continuous development/);assert.equal(h.config.inviteDelay,30000);
 h.advance(50000);assert.equal(h.messages.length,1);assert.ok(h.seen.has('/about'));const reload=noticeHarness(h.seen);reload.advance(20000);assert.equal(reload.messages.length,0);
});
test('combined About notice excludes time in hidden tabs',()=>{
 const h=noticeHarness();h.advance(4000);h.visibility('hidden');h.advance(60000);assert.equal(h.messages.length,0);h.visibility('visible');h.advance(5999);assert.equal(h.messages.length,0);h.advance(1);assert.equal(h.messages.length,1);assert.equal(h.messages[0].at,70000);
});
test('combined About notice defers during text input and opens on the next short retry',()=>{
 const h=noticeHarness();h.busy(true);h.advance(10000);assert.equal(h.messages.length,0);h.busy(false);h.advance(200);assert.equal(h.messages.length,1);
});
const luminance=hex=>{const c=hex.replace('#','').match(/../g).map(v=>parseInt(v,16)/255).map(v=>v<=.04045?v/12.92:((v+.055)/1.055)**2.4);return .2126*c[0]+.7152*c[1]+.0722*c[2];};
test('declared example text/background pairs meet 4.5:1 contrast in both themes',()=>{
 for(const [fg,bg]of [['#075a50','#d9f1eb'],['#eff8fc','#23434f'],['#ffffff','#2b5159'],['#f3fcfa','#25574f'],['#a6f3e3','#193d38']]){const a=luminance(fg),b=luminance(bg);const ratio=(Math.max(a,b)+.05)/(Math.min(a,b)+.05);assert.ok(ratio>=4.5,`${fg} / ${bg}: ${ratio}`);console.log(`${fg} on ${bg}: ${ratio.toFixed(2)}:1`);}
 const css=fs.readFileSync(ROOT+'public/assets/css/theme.css','utf8');assert.match(css,/@media print\s*\{\s*body #main \.cs-reveal-panel\[hidden\] \{display:block!important;/);assert.ok(css.includes('background:#25574f;color:#f3fcfa;'));
});
test('all published canonical/sharing URLs, sitemap and robots use the approved www domain',()=>{
 const origin='https://www.cybersafesme.org';function walk(p){return fs.readdirSync(p,{withFileTypes:true}).flatMap(e=>e.isDirectory()?walk(path.join(p,e.name)):[path.join(p,e.name)]);}
 let canonicalCount=0,htmlCount=0;
 for(const file of walk(ROOT+'public').filter(f=>f.endsWith('.html'))){const text=fs.readFileSync(file,'utf8');const {document}=parseHTML(text);assert.ok(!text.includes('cybersafesmenigeria.netlify.app'));htmlCount++;
  for(const el of document.querySelectorAll('link[rel="canonical"]')){assert.ok(el.getAttribute('href').startsWith(origin+'/'),file);canonicalCount++;}
  for(const el of document.querySelectorAll('meta[property="og:url"],meta[property="og:image"],meta[name="twitter:image"]'))assert.ok(el.getAttribute('content').startsWith(origin+'/'),file);
 }
 assert.equal(htmlCount,41);assert.equal(canonicalCount,40);
 const sitemap=fs.readFileSync(ROOT+'public/sitemap.xml','utf8');const locations=[...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map(m=>m[1]);assert.equal(locations.length,36);assert.ok(locations.every(url=>url.startsWith(origin+'/')));
 assert.ok(fs.readFileSync(ROOT+'public/robots.txt','utf8').includes('Sitemap: '+origin+'/sitemap.xml'));
 const {document}=parseHTML(fs.readFileSync(ROOT+'public/about/index.html','utf8'));assert.ok(document.querySelector('#team').textContent.includes('CyberSafe is written and maintained by a small team working on cybersecurity awareness for SMEs.'));assert.ok(!document.querySelector('#team').textContent.includes('small Nigerian team'));
});
test('approved contact, Privacy retirement and footer/About removals apply across the generated site',()=>{
 function walk(p){return fs.readdirSync(p,{withFileTypes:true}).flatMap(e=>e.isDirectory()?walk(path.join(p,e.name)):[path.join(p,e.name)]);}
 for(const file of walk(ROOT+'public').filter(f=>f.endsWith('.html'))){const text=fs.readFileSync(file,'utf8');const {document}=parseHTML(text);assert.ok(!text.includes('hello@cybersafesmenigeria.ng'),file);assert.ok(!document.querySelector('a[href="/privacy"]'),file);assert.ok(!/CyberSafe SME Nigeria provides (?:general )?cybersecurity awareness/.test(document.querySelector('footer')?.textContent||''),file);
  if(document.querySelector('footer'))assert.ok(document.querySelector('footer a[href="mailto:learn@cybersafesme.org"]'),file);
 }
 const {document}=parseHTML(fs.readFileSync(ROOT+'public/about/index.html','utf8'));assert.doesNotMatch(document.querySelector('#contact').textContent,/Social channels are not live yet|Please do not send passwords/);
 const retired=fs.readFileSync(ROOT+'public/privacy/index.html','utf8');assert.ok(retired.includes('content="0;url=/about"'));assert.ok(!retired.includes('What we collect'));assert.ok(!fs.readFileSync(ROOT+'public/sitemap.xml','utf8').includes('/privacy'));
 const index=JSON.parse(fs.readFileSync(ROOT+'public/assets/search-index.json','utf8'));assert.ok(index.every(row=>row.url!='/privacy'&&row.url!='/learn/spot-the-scam'));
});
test('homepage topics use shared icon cards and the only static game entrypoints are the Learn menus',()=>{
 function walk(p){return fs.readdirSync(p,{withFileTypes:true}).flatMap(e=>e.isDirectory()?walk(path.join(p,e.name)):[path.join(p,e.name)]);}
 for(const file of walk(ROOT+'public').filter(f=>f.endsWith('.html'))){const {document}=parseHTML(fs.readFileSync(file,'utf8'));for(const a of document.querySelectorAll('a[href^="/learn/spot-the-scam"]'))assert.ok(a.closest('header.top'),file+' duplicate game promotion');}
 const {document}=parseHTML(fs.readFileSync(ROOT+'public/index.html','utf8'));const cards=[...document.querySelectorAll('.home-topic-card')];assert.equal(cards.length,6);assert.ok(cards.every(card=>card.querySelector('.ci')&&card.querySelector('h3')&&card.querySelector('p')&&card.querySelector('.more')));assert.ok(!document.querySelector('.th-ring,.home-topic-card .th'));assert.ok(document.querySelector('.main .dd .panel a[href="/learn/spot-the-scam"]'));
});
test('phishing response headings retain original deep links without a pale target rule',()=>{
 const {document}=load('threats/phishing','#credentials-response');const panels=[...document.querySelectorAll('[data-ph-response-panel]')];assert.equal(panels.length,4);assert.equal(panels.filter(p=>!p.hidden).length,1);assert.equal(document.getElementById('credentials-response').closest('.cs-reveal-panel').hidden,false);assert.ok(panels.every(p=>p.querySelector('h3[id]')));
 const {document:closed}=parseHTML(fs.readFileSync(ROOT+'public/threats/phishing/index.html','utf8'));assert.ok([...closed.querySelectorAll('[data-ph-response-panel]')].every(p=>!p.hidden),'without JavaScript all approved reference advice remains readable');
 const css=fs.readFileSync(ROOT+'public/assets/css/site.css','utf8');assert.ok(!css.includes('background:#e8f6f2; box-shadow:0 0 0 9px #e8f6f2'));assert.ok(css.includes('.ph-response-detail > h3[id]:target { background:transparent;'));
});
