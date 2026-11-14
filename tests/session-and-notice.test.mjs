import test from 'node:test';import assert from 'node:assert/strict';
import {createEnvironment} from './companion-v21/fake-dom.mjs';
import {mountKenny} from '../tools/assets/kenny-companion/kenny-companion.js';
import {createInitialState,requestPanel} from '../tools/assets/kenny-companion/kenny-state.js';

test('page notice does not consume the initial invitation or tip rotation',()=>{
 const s=createInitialState();requestPanel(s,'notice');assert.equal(s.panel,'notice');assert.equal(s.firstMessageSeen,false);assert.equal(s.tipIndex,-1);assert.equal(s.autoTipsShown,0);
});
test('notice closes after eight reading seconds and gives the initial invitation priority only after its quiet gap',async()=>{
 const env=createEnvironment();let widget;try{
  widget=mountKenny({inviteDelay:30000,noticeDuration:8000,quietAfterNotice:12000,onPlay(){}});await env.flush();await env.advance(10000);widget.showNotice('We’re continually improving CyberSafe SME Nigeria.','Website update');assert.equal(widget.getState().panel,'notice');assert.equal(env.shadow.querySelector('.primary').hidden,true);
  await env.advance(9000);assert.equal(widget.getState().panel,null);assert.equal(widget.getState().firstMessageSeen,false);await env.advance(13000);assert.equal(widget.getState().panel,'invite');
 }finally{widget?.destroy();env.restore();}
});
test('completion and page notices use session storage only; reading returns reject outside origins',async()=>{
 const env=createEnvironment();let previous=globalThis.location;try{
  globalThis.location={origin:'https://example.test'};env.window.dispatchEvent=e=>env.window.dispatch(e.type,e);let localReads=0;env.window.localStorage={getItem(){localReads++;return 'true';},setItem(){throw Error('must not write');}};
  const s=await import('../tools/assets/kenny-session.js?normal');assert.equal(s.hasCompletedActivity(),false);s.markActivityCompleted();assert.equal(s.hasCompletedActivity(),true);s.markPageNoticeSeen('/about/team');assert.equal(s.hasSeenPageNotice('/about/team'),true);assert.equal(s.hasSeenPageNotice('/about/contact'),false);
  assert.equal(s.safeReadingPath(''),'');assert.equal(s.safeReadingPath(null),'');assert.equal(s.safeReadingPath('https://other.test/steal'),'');assert.equal(s.safeReadingPath('/assets/anything'),'');assert.equal(s.safeReadingPath('/learn/spot-the-scam'),'');assert.equal(s.safeReadingPath('/threats/ransomware#what-is-ransomware'),'/threats/ransomware#what-is-ransomware');assert.equal(localReads,0);
  const reload=await import('../tools/assets/kenny-session.js?reload');assert.equal(reload.hasCompletedActivity(),true);env.window.sessionStorage.clear();const fresh=await import('../tools/assets/kenny-session.js?fresh');assert.equal(fresh.hasCompletedActivity(),false);
 }finally{globalThis.location=previous;env.restore();}
});
