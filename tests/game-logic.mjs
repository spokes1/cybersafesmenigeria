import assert from 'node:assert/strict';
import fs from 'node:fs';
import { createHash } from 'node:crypto';
import {initialState,transition,items} from '../tools/assets/kenny-game/state.js';
import {questions} from '../tools/assets/kenny-game/scenarios.js';
import {ransomware} from '../tools/assets/kenny-game/content.js';
const start=game=>transition(transition(initialState(),{type:'INTRO',game}),{type:'START'});
const choose=(s,ids)=>ids.reduce((p,id)=>transition(p,{type:'SELECT',id}),s);
let checks=0;
for(let score=0;score<=5;score++){
 let s=start('scam');
 for(let i=0;i<5;i++){
  const q=questions[i],ids=i<score?q.correct:q.options.filter(o=>!q.correct.includes(o[0])).slice(0,q.mode==='multi'?2:1).map(o=>o[0]);
  assert.equal(s.screen,'play');s=choose(s,ids);s=transition(s,{type:'SUBMIT'});
  assert.equal(s.screen,'feedback');assert.equal(s.correct,i<score);
  assert.deepEqual(transition(s,{type:'SUBMIT'}),s);s=transition(s,{type:'NEXT'});
 }
 assert.equal(s.screen,'results');assert.equal(s.responses.filter(r=>r.correct).length,score);checks++;
 for(let i=0;i<5;i++){const lesson=transition(s,{type:'LESSON',index:i});assert.equal(lesson.screen,'lesson');assert.deepEqual(transition(lesson,{type:'RESULTS'}),{...s,lesson:i});}
 const replay=transition(s,{type:'START'});assert.equal(replay.responses.length,0);assert.equal(replay.index,0);assert.equal(replay.game,'scam');
}
let multi=start('scam');multi.index=2;multi=choose(multi,['a','b','c']);assert.deepEqual(multi.selected,['a','b']);multi=choose(multi,['a','c']);assert.deepEqual(multi.selected,['b','c']);checks++;
for(let wrongIndex=0;wrongIndex<3;wrongIndex++){
 let s=start('ransom');
 for(let i=0;i<3;i++){
  const q=ransomware[i];
  if(i===wrongIndex){for(const [id] of q.options.filter(([id])=>!q.correct.includes(id))){s=transition(choose(s,[id]),{type:'SUBMIT'});assert.equal(s.correct,false);assert.ok(q.wrong[id]);assert.equal(s.responses.length,i);assert.deepEqual(transition(s,{type:'NEXT'}),s);s=transition(s,{type:'RETRY'});assert.equal(s.screen,'play');assert.equal(s.selected.length,0);}}
  s=transition(choose(s,q.correct),{type:'SUBMIT'});assert.equal(s.correct,true);assert.equal(s.responses[i].first,i!==wrongIndex);s=transition(s,{type:'NEXT'});
 }
 assert.equal(s.screen,'results');assert.equal(s.responses.filter(r=>r.first).length,2);assert.equal(s.responses.length,3);checks++;
}
let clean=start('ransom');for(const q of ransomware){clean=transition(choose(clean,q.correct),{type:'SUBMIT'});clean=transition(clean,{type:'NEXT'});}assert.equal(clean.responses.filter(r=>r.first).length,3);checks++;
const fresh=start('scam');assert.deepEqual(transition(fresh,{type:'SUBMIT'}),fresh);assert.deepEqual(transition(fresh,{type:'SELECT',id:'invalid'}),fresh);assert.deepEqual(transition(fresh,{type:'NEXT'}),fresh);checks++;
const digest=createHash('sha256').update(fs.readFileSync(new URL('../tools/assets/kenny-game/scenarios.js',import.meta.url))).digest('hex');
assert.equal(digest,fs.readFileSync(new URL('original-scenarios.sha256',import.meta.url),'utf8').trim());
console.log(`${checks} gameplay paths passed; all score totals, recovery, multi-select, lesson return, replay, guards and unchanged V5.1 scenario data verified.`);
