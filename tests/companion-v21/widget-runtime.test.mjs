import test from 'node:test';
import assert from 'node:assert/strict';
import {createEnvironment} from './fake-dom.mjs';
import {mountKenny} from '../../tools/assets/kenny-companion/kenny-companion.js';
import {INVITATION,CYBER_TIPS,ENCOURAGEMENTS} from '../../tools/assets/kenny-companion/card-copy.js';

const imageEvents=e=>e.imageHistory.filter(entry=>entry.selector!=='.portrait'&&/kenny-peek-(open|half|blink|curious|reach|touch)\.webp/.test(entry.src));
const frame=entry=>entry.src.match(/kenny-peek-(open|half|blink|curious|reach|touch)\.webp/)?.[1];
const PEEK_RETURN_TEST_MS=12000;
async function setup(options={},environment={}){
  const env=createEnvironment(environment);
  const widget=mountKenny({maxAutoTips:0,onPlay(){},...options});
  await env.flush();
  return {env,widget,cleanup(){widget.destroy();env.restore();}};
}

test('actual peeker image changes half → closed → half → open after a manual peek',async()=>{
  const {env,widget,cleanup}=await setup();
  try{
    widget.peek();await env.advance(1600);
    const events=imageEvents(env),sequence=events.map(frame).filter(Boolean);
    assert.ok(sequence.join(',').includes('half,blink,half,open'),sequence.join(','));
    const closed=events.find(e=>frame(e)==='blink');
    const following=events.find(e=>e.at>closed.at&&frame(e)!=='blink');
    assert.ok(following.at-closed.at>=280,`closed for only ${following.at-closed.at}ms`);
    assert.ok(events.every(e=>e.src.includes('?v=3')),'new frame URLs must bypass old cached artwork');
  }finally{cleanup();}
});

test('invitation panel leaves the blinking peek image active rather than selecting a static wave',async()=>{
  const {env,widget,cleanup}=await setup();
  try{
    widget.open();await env.advance(1600);
    assert.equal(widget.getState().panel,'invite');
    const events=imageEvents(env);
    assert.ok(events.some(e=>frame(e)==='blink'));
    assert.ok(!events.some(e=>e.src.includes('kenny-invite.webp')));
  }finally{cleanup();}
});

test('minimal invitation has Play and X, and tips have only their message and X',async()=>{
  const {env,widget,cleanup}=await setup({hasPlayed:true});
  try{
    const markup=env.shadow.innerHTML;
    assert.ok(!/class="[^"]*\b(?:secondary|options|hide-visit|disable|portrait|panel-header|help|title)\b[^"]*"/.test(markup),'legacy card controls or heading');
    assert.ok(!/<h[1-6]\b/i.test(markup),'heading markup should be absent');
    widget.markPlayed(false);widget.open();
    assert.equal(env.shadow.querySelector('.primary').hidden,false);
    assert.equal(env.shadow.querySelector('.close').hidden,false);
    widget.markPlayed();widget.open();
    assert.equal(widget.getState().panel,'tip');
    assert.equal(env.shadow.querySelector('.primary').hidden,true);
    assert.equal(env.shadow.querySelector('.close').hidden,false);
    const firstTip=env.shadow.querySelector('.body').textContent;
    env.shadow.querySelector('.peeker').dispatch('click');
    assert.equal(widget.getState().panel,'tip');
    assert.notEqual(env.shadow.querySelector('.body').textContent,firstTip);
    const secondTip=env.shadow.querySelector('.body').textContent;
    env.shadow.querySelector('.close').dispatch('click');
    env.shadow.querySelector('.peeker').dispatch('click');
    assert.equal(widget.getState().panel,'tip');
    assert.notEqual(env.shadow.querySelector('.body').textContent,secondTip);
  }finally{cleanup();}
});

test('actual emerge and return show reach → touch → folded grip before the first blink',async()=>{
  const {env,widget,cleanup}=await setup();
  try{
    widget.peek();await env.advance(1600);
    assert.ok(imageEvents(env).map(frame).join(',').includes('reach,touch,open,half,blink'));
    await env.advance(PEEK_RETURN_TEST_MS-1600);
    const afterReturn=imageEvents(env).filter(e=>e.at>=10500).map(frame).join(',');
    assert.ok(afterReturn.includes('reach,touch,open,half,blink'),afterReturn);
  }finally{cleanup();}
});

test('Close X persistently tucks Kenny instead of restarting the decorative cycle',async()=>{
  const {env,widget,cleanup}=await setup();
  try{
    widget.open();await env.advance(1600);env.shadow.querySelector('.close').focus();
    env.shadow.querySelector('.close').dispatch('click');
    assert.equal(widget.getState().tucked,true);
    await env.advance(600);
    assert.equal(widget.getState().motion.reveal,0);
    assert.equal(env.shadow.activeElement,env.shadow.querySelector('.peeker'));
    await env.advance(20000);
    assert.equal(widget.getState().motion.reveal,0);
    env.shadow.querySelector('.peeker').dispatch('click');
    assert.equal(widget.getState().panel,'invite');
    assert.equal(widget.getState().tucked,false);
    await env.advance(1600);
    assert.ok(widget.getState().motion.reveal>.99);
  }finally{cleanup();}
});

test('hidden tab freezes foreground time and image changes, then resumes without a time jump',async()=>{
  const {env,widget,cleanup}=await setup();
  try{
    widget.peek();await env.advance(500);
    env.document.visibilityState='hidden';env.document.dispatch('visibilitychange');
    const time=widget.getState().visibleMs,events=imageEvents(env).length;
    await env.advance(5000);
    assert.equal(widget.getState().visibleMs,time);
    assert.equal(imageEvents(env).length,events);
    env.document.visibilityState='visible';env.document.dispatch('visibilitychange');
    await env.advance(120);
    assert.ok(widget.getState().visibleMs-time<=160);
  }finally{cleanup();}
});

test('closing a long-read invitation retreats smoothly from its current visible pose',async()=>{
  const {env,widget,cleanup}=await setup();
  try{
    widget.open();env.shadow.querySelector('.panel').hovered=true;await env.advance(8500);
    assert.equal(widget.getState().panel,'invite');
    env.shadow.querySelector('.close').dispatch('click');
    const from=widget.getState().motion.reveal;await env.advance(300);
    assert.ok(widget.getState().motion.reveal<from);
    await env.advance(320);
    assert.equal(widget.getState().panel,null);
    assert.equal(widget.getState().motion.reveal,0);
  }finally{cleanup();}
});

test('reduced-motion runtime remains on the open frame throughout a full cycle',async()=>{
  const {env,widget,cleanup}=await setup({}, {reducedMotion:true});
  try{
    widget.peek();await env.advance(14000);
    assert.ok(imageEvents(env).every(e=>frame(e)==='open'));
    assert.equal(Number(env.shadow.querySelector('.companion').style['--peek-reveal']),1);
  }finally{cleanup();}
});

test('an unavailable closed frame never replaces the image with a failed URL',async()=>{
  const {env,widget,cleanup}=await setup({}, {failImages:['peek-blink']});
  try{
    widget.peek();await env.advance(6500);
    assert.ok(!imageEvents(env).some(e=>frame(e)==='blink'));
    assert.ok(imageEvents(env).every(e=>Boolean(frame(e))));
  }finally{cleanup();}
});

test('an unavailable reaching frame falls back to a loaded grip without using its failed URL',async()=>{
  const {env,widget,cleanup}=await setup({}, {failImages:['peek-reach']});
  try{
    widget.peek();await env.advance(1600);
    assert.ok(!imageEvents(env).some(e=>frame(e)==='reach'));
    assert.ok(imageEvents(env).some(e=>frame(e)==='blink'));
  }finally{cleanup();}
});

test('the widget does not enter a closed-eye sequence if its open frame cannot decode',async()=>{
  const {env,widget,cleanup}=await setup({}, {failImages:['peek-open']});
  try{
    widget.peek();await env.advance(6500);
    assert.ok(!imageEvents(env).some(e=>['half','blink'].includes(frame(e))));
  }finally{cleanup();}
});

test('completion updates survive subsequent ticks and change the click response to a tip',async()=>{
  const {env,widget,cleanup}=await setup({hasPlayed:false});
  try{
    widget.markPlayed();await env.advance(200);
    assert.equal(widget.getState().played,true);
    widget.open();assert.equal(widget.getState().panel,'tip');
  }finally{cleanup();}
});

test('the actual bubble displays the supplied invitation and all cyber tips without encouragement substitution',async()=>{
  const {env,widget,cleanup}=await setup();
  try{
    widget.open();
    assert.equal(env.shadow.querySelector('.body').textContent,INVITATION.body);
    assert.ok(env.shadow.querySelector('.announcer').textContent.includes(INVITATION.title));
    assert.equal(env.shadow.querySelector('.primary').textContent,INVITATION.primary);
    for(const [i,message]of CYBER_TIPS.entries()){
      widget.showTip(i);
      assert.equal(env.shadow.querySelector('.body').textContent,message.body);
      assert.ok(env.shadow.querySelector('.announcer').textContent.includes(message.title));
    }
    widget.markPlayed();
    for(let i=0;i<12;i++){
      widget.showTip(i);
      assert.equal(widget.getState().panel,'tip');
      assert.equal(env.shadow.querySelector('.body').textContent,CYBER_TIPS[i%CYBER_TIPS.length].body);
      assert.ok(!ENCOURAGEMENTS.some(m=>m.body===env.shadow.querySelector('.body').textContent));
    }
  }finally{cleanup();}
});

test('destroy cancels animation scheduling and removes event listeners and host',async()=>{
  const {env,widget,cleanup}=await setup();
  try{
    widget.peek();await env.advance(1100);widget.destroy();
    const count=env.imageHistory.length;
    await env.advance(12000);
    assert.equal(env.imageHistory.length,count);
    assert.equal(env.hosts.length,0);
    assert.equal(env.scheduled.size,0);
    assert.ok([...env.document.listeners.values()].every(set=>set.size===0));
  }finally{cleanup();}
});
