// Exercises the real game event handlers against generated HTML; no browser rendering claim.
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import {createRequire} from 'node:module';
import {questions,learning} from '../tools/assets/kenny-game/scenarios.js';
import {activities,ransomware} from '../tools/assets/kenny-game/content.js';
import {initialState,transition,items} from '../tools/assets/kenny-game/state.js';
const require=createRequire(import.meta.url),{parseHTML}=require(process.env.CS_TEST_DEPS||'linkedom');
const root=new URL('../',import.meta.url);
function harness(game,mobile=false){
 const {document,window}=parseHTML(fs.readFileSync(new URL('public/learn/spot-the-scam/index.html',root),'utf8'));
 const cues=[];let paused=false,completed=0;
 window.scrollTo=()=>{};window.HTMLElement.prototype.focus=()=>{};
 const source=fs.readFileSync(new URL('tools/assets/kenny-game/app.js',root),'utf8').replace(/^import .*;\n/gm,'');
 vm.runInNewContext(source,{document,window,console,location:{search:'?activity='+game},URLSearchParams,requestAnimationFrame:fn=>fn(),questions,learning,activities,ransomware,initialState,transition,items,placeKenny:(_el,c)=>cues.push(c),setPaused:v=>paused=v,isPaused:()=>paused,markActivityCompleted:()=>completed++,returnToReading:()=>'/learn',isMobileDevice:()=>mobile});
 const click=selector=>{const el=document.querySelector(selector);assert.ok(el,selector);el.click();};
 return {document,cues,completed:()=>completed,click,answer(ids){for(const id of ids)click(`[data-choice="${id}"]`);click('#submit');},checkNoReplay(){assert.equal(document.querySelectorAll('[data-reaction],[data-move],.replay-reaction').length,0);assert.doesNotMatch(document.querySelector('#kennyGameApp').textContent,/Replay Kenny|Replay the celebration/);}};
}
const firstHeads=['You’ve taken the right first step.','You’ve reached trusted help.','You’ve chosen the right recovery steps.'];
test('first-attempt correct mission decisions get positive debriefs and keep automatic animations and Play again',()=>{
 const h=harness('ransom');h.click('[data-action="start"]');
 for(let i=0;i<3;i++){h.answer(ransomware[i].correct);assert.equal(h.document.querySelector('.feedback-copy>.eyebrow').textContent,'GOOD DECISION');assert.equal(h.document.querySelector('h1[data-heading]').textContent,firstHeads[i]);assert.equal(h.cues.at(-1).clip,'Happy');h.checkNoReplay();h.click('[data-action="next"]');}
 assert.match(h.document.querySelector('.score-card').textContent,/3 \/ 3/);assert.equal(h.completed(),1);h.checkNoReplay();assert.equal(h.cues.at(-1).clip,'Celebrate');h.click('[data-action="start"]');assert.ok(h.document.querySelector('.play-page'));
});
test('wrong answers and guided recovery retain their debriefs and first-attempt scoring',()=>{
 const h=harness('ransom');h.click('[data-action="start"]');
 const guidedHeads=['You have taken a useful first step.','You have reached trusted help.','The shop has a safer recovery plan.'];
 for(let i=0;i<3;i++){
  const q=ransomware[i],wrong=q.options.find(([id])=>!q.correct.includes(id))[0];h.answer([wrong]);assert.equal(h.document.querySelector('h1[data-heading]').textContent,'There’s a safer next step.');assert.match(h.document.querySelector('.feedback-copy>.eyebrow').textContent,/LET’S LEARN/);assert.equal(h.cues.at(-1).clip,'Encourage');h.checkNoReplay();h.click('[data-action="retry"]');h.answer(q.correct);assert.equal(h.document.querySelector('.feedback-copy>.eyebrow').textContent,'A SAFER DECISION');assert.equal(h.document.querySelector('h1[data-heading]').textContent,guidedHeads[i]);h.click('[data-action="next"]');
 }
 assert.match(h.document.querySelector('.score-card').textContent,/0 \/ 3/);assert.match(h.document.querySelector('.score-card').textContent,/3 of 3 steps completed with guided recovery/);
});
test('scam correct answers get GOOD DECISION; incorrect answers retain teaching feedback',()=>{
 const h=harness('scam');h.click('[data-action="start"]');
 for(let i=0;i<5;i++){
  const q=questions[i],correct=i!==1,ids=correct?q.correct:q.options.filter(([id])=>!q.correct.includes(id)).slice(0,q.mode==='multi'?2:1).map(([id])=>id);h.answer(ids);assert.equal(h.document.querySelector('.feedback-copy>.eyebrow').textContent,correct?'GOOD DECISION':'LET’S LEARN FROM THIS');assert.equal(h.document.querySelector('h1[data-heading]').textContent,correct?'Sharp thinking.':'A safer move to remember.');h.checkNoReplay();h.click('[data-action="next"]');
 }
 assert.match(h.document.querySelector('.score-card').textContent,/4 \/ 5/);assert.match(h.document.querySelector('.takeaway-state').textContent,/Correct answer chosen/);h.checkNoReplay();
});
test('motion pause remains mobile-only and works independently of removed replay buttons',()=>{
 assert.equal(harness('ransom').document.querySelector('#motionToggle').hidden,true);
 const h=harness('ransom',true),button=h.document.querySelector('#motionToggle');assert.equal(button.hidden,false);assert.equal(button.textContent,'Pause motion');h.click('#motionToggle');assert.equal(button.textContent,'Resume motion');
});
test('all full page shells and Kenny shadow styles disable optional ligatures',()=>{
 function walk(dir){return fs.readdirSync(dir,{withFileTypes:true}).flatMap(e=>e.isDirectory()?walk(new URL(e.name+'/',dir)):[new URL(e.name,dir)]);}
 let count=0;
 for(const file of walk(new URL('public/',root)).filter(u=>u.pathname.endsWith('.html'))){const {document}=parseHTML(fs.readFileSync(file,'utf8'));if(!document.querySelector('#main'))continue;assert.ok(document.querySelector('link[href="/assets/css/typography.css"]'),file.pathname);count++;}
 assert.equal(count,37);
 for(const name of ['tools/assets/typography.css','tools/assets/kenny-companion/kenny-companion.css']){const css=fs.readFileSync(new URL(name,root),'utf8');assert.match(css,/font-variant-ligatures:none!important/);assert.match(css,/font-feature-settings:"liga" 0,"clig" 0!important/);}
 assert.equal(fs.readFileSync(new URL('tools/assets/typography.css',root),'utf8'),fs.readFileSync(new URL('public/assets/css/typography.css',root),'utf8'));
});
