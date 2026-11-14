import test from 'node:test';
import assert from 'node:assert/strict';
import {createEnvironment} from './fake-dom.mjs';
import {mountKenny} from '../../tools/assets/kenny-companion/kenny-companion.js';
import {createInitialState,normalizeTiming,advanceVisibleTime,closePanel,serializeState,recordPlayed,requestPanel,revealPeek} from '../../tools/assets/kenny-companion/kenny-state.js';
import {sampleRetreatMotion} from '../../tools/assets/kenny-companion/peek-motion.js';

async function setup(options={},environment={}){
 const env=createEnvironment(environment);const widget=mountKenny({onPlay(){},maxAutoTips:0,...options});await env.flush();
 return {env,widget,cleanup(){widget.destroy();env.restore();}};
}
const reveal=widget=>widget.getState().motion.reveal;

test('default automatic tips are unlimited; explicit finite cap and zero remain available',()=>{
 assert.equal(normalizeTiming().maxAutoTips,null);
 const s=createInitialState();let openings=0,last=-Infinity;
 for(let i=0;i<2000;i++){
  const e=advanceVisibleTime(s,1000,{played:true});
  if(e){assert.equal(e.panel,'tip');assert.ok(s.visibleMs-last>=300000);last=s.visibleMs;openings++;closePanel(s);}
 }
 assert.ok(openings>3);assert.equal(s.autoTipsShown,openings);
 const disabled=createInitialState({},normalizeTiming({maxAutoTips:0}));
 assert.equal(advanceVisibleTime(disabled,25000,{played:true}),null);assert.equal(disabled.panel,null);
});

test('unplayed initial invitation never repeats automatically; later automatic messages are tips',()=>{
 const s=createInitialState();assert.equal(advanceVisibleTime(s,25000)?.panel,'invite');closePanel(s);
 assert.equal(s.tucked,true);
 assert.equal(advanceVisibleTime(s,154000),null);
 assert.equal(advanceVisibleTime(s,1000)?.panel,'tip');
 closePanel(s);assert.equal(advanceVisibleTime(s,300000)?.panel,'tip');
 requestPanel(s,'invite');assert.equal(s.panel,'invite');
});

test('explicit unseen first-message state survives played navigation before25seconds',()=>{
 const s=createInitialState();recordPlayed(s,true);advanceVisibleTime(s,10000,{played:true});
 const restored=createInitialState(serializeState(s));
 assert.equal(restored.firstMessageSeen,false);
 assert.equal(advanceVisibleTime(restored,15000,{played:true})?.panel,'tip');
});

test('tucked state survives visit serialization and explicit peek clears it',()=>{
 const s=createInitialState();requestPanel(s,'invite');closePanel(s);
 const restored=createInitialState(serializeState(s));assert.equal(restored.tucked,true);
 revealPeek(restored);assert.equal(restored.tucked,false);
});

test('functional retreat is smooth and remains tucked past600ms, including reduced motion',()=>{
 assert.equal(sampleRetreatMotion(0).reveal,1);
 assert.ok(sampleRetreatMotion(300).reveal>0&&sampleRetreatMotion(300).reveal<1);
 assert.equal(sampleRetreatMotion(600).reveal,0);
 assert.equal(sampleRetreatMotion(30000).reveal,0);
 assert.equal(sampleRetreatMotion(0,{reducedMotion:true}).reveal,0);
});

test('ignored first automatic invitation expires after7readingseconds, tucks, then later offers only tips',async()=>{
 const {env,widget,cleanup}=await setup({maxAutoTips:null});
 try{
  await env.advance(24960);assert.equal(widget.getState().panel,null);
  await env.advance(40);assert.equal(widget.getState().panel,'invite');
  await env.advance(840);assert.equal(widget.getState().messageTiming.remainingMs,7000);
  await env.advance(7000);assert.equal(widget.getState().panel,'invite');
  await env.advance(80);assert.equal(widget.getState().panel,null);assert.equal(widget.getState().tucked,true);
  await env.advance(600);assert.equal(reveal(widget),0);
  await env.advance(20000);assert.equal(widget.getState().panel,null);assert.equal(reveal(widget),0);
  await env.advance(180000-env.now);assert.equal(widget.getState().panel,'tip');
 }finally{cleanup();}
});

test('played visitor first automatic message is a six-second tip and never an invitation',async()=>{
 const {env,widget,cleanup}=await setup({maxAutoTips:null,hasPlayed:true});
 try{
  await env.advance(25000);assert.equal(widget.getState().panel,'tip');
  await env.advance(840);assert.equal(widget.getState().messageTiming.remainingMs,6000);
  await env.advance(6080);assert.equal(widget.getState().panel,null);
  await env.advance(600);assert.equal(reveal(widget),0);
  env.shadow.querySelector('.peeker').dispatch('click');assert.equal(widget.getState().panel,'tip');
 }finally{cleanup();}
});

test('manual tips also expire after six seconds and automatic close does not move focus',async()=>{
 const {env,widget,cleanup}=await setup();
 try{
  widget.showTip(0);await env.advance(850+6000+80);
  assert.equal(widget.getState().panel,null);assert.equal(env.document.activeElement,env.document.body);
  await env.advance(600);assert.equal(reveal(widget),0);
 }finally{cleanup();}
});

test('invitation and tip reading timers pause during hover and resume afterward',async()=>{
 const {env,widget,cleanup}=await setup();
 try{
  for(const open of [()=>widget.open(),()=>widget.showTip(0)]){
   open();await env.advance(1000);env.shadow.querySelector('.panel').hovered=true;
   const before=widget.getState().messageTiming.remainingMs;await env.advance(9000);
   assert.equal(widget.getState().messageTiming.remainingMs,before);assert.ok(widget.getState().panel);
   env.shadow.querySelector('.panel').hovered=false;await env.advance(before+80);
   assert.equal(widget.getState().panel,null);await env.advance(600);assert.equal(reveal(widget),0);
  }
 }finally{cleanup();}
});

test('hidden tabs pause message lifetime and functional retreat',async()=>{
 const {env,widget,cleanup}=await setup();
 try{
  widget.open();await env.advance(1500);
  env.document.visibilityState='hidden';env.document.dispatch('visibilitychange');
  const remaining=widget.getState().messageTiming.remainingMs;await env.advance(15000);
  assert.equal(widget.getState().messageTiming.remainingMs,remaining);
  env.document.visibilityState='visible';env.document.dispatch('visibilitychange');widget.close();await env.advance(200);
  const before=reveal(widget);env.document.visibilityState='hidden';env.document.dispatch('visibilitychange');await env.advance(9000);
  assert.equal(reveal(widget),before);env.document.visibilityState='visible';env.document.dispatch('visibilitychange');await env.advance(440);
  assert.equal(reveal(widget),0);
 }finally{cleanup();}
});

test('reduced-motion close instantly tucks but keeps a clickable peeker and click reopens',async()=>{
 const {env,widget,cleanup}=await setup({}, {reducedMotion:true});
 try{
  widget.open();assert.equal(reveal(widget),1);env.shadow.querySelector('.close').dispatch('click');
  assert.equal(reveal(widget),0);assert.equal(widget.getState().tucked,true);
  env.shadow.querySelector('.peeker').dispatch('click');assert.equal(widget.getState().panel,'invite');assert.equal(reveal(widget),1);
 }finally{cleanup();}
});

test('remounting the actual widget preserves the tucked state instead of showing a full character',async()=>{
 const env=createEnvironment();let widget;
 try{
  widget=mountKenny({maxAutoTips:0,onPlay(){}});await env.flush();widget.open();await env.advance(1500);widget.close();await env.advance(600);widget.destroy();
  widget=mountKenny({maxAutoTips:0,onPlay(){}});await env.flush();assert.equal(widget.getState().tucked,true);assert.equal(reveal(widget),0);
 }finally{widget?.destroy();env.restore();}
});

test('Play calls the host game hook without recording completion',async()=>{
 let plays=0;const {env,widget,cleanup}=await setup({onPlay(){plays++;}});
 try{
  widget.open();env.shadow.querySelector('.primary').dispatch('click');
  assert.equal(plays,1);assert.equal(widget.getState().played,false);assert.equal(widget.getState().tucked,true);
 }finally{cleanup();}
});

test('a valid loaded image still blinks when decode rejects',async()=>{
 const {env,widget,cleanup}=await setup({}, {decodeRejectLoaded:['peek-blink']});
 try{
  widget.peek();await env.advance(1600);
  assert.ok(env.imageHistory.some(e=>e.src.includes('peek-blink')));
 }finally{cleanup();}
});
