import test from 'node:test';
import assert from 'node:assert/strict';
import {samplePeekMotion,PEEK_CYCLE_MS} from '../../tools/assets/kenny-companion/peek-motion.js';

test('each emergence has a readable blink and another blink before retreat',()=>{
  const samples=[[0,'reach'],[349,'reach'],[350,'touch'],[649,'touch'],[650,'open'],[999,'open'],[1000,'half'],[1080,'blink'],[1379,'blink'],[1380,'half'],[1460,'open'],[3400,'half'],[3480,'blink'],[3780,'half'],[3860,'curious']];
  for(const [at,pose]of samples)assert.equal(samplePeekMotion(at).pose,pose,`at ${at}ms`);
});

test('retreat follows both blinks and the next return repeats the same blink timing',()=>{
  assert.equal(samplePeekMotion(7050).phase,'retreating');
  assert.equal(samplePeekMotion(7900).phase,'hidden');
  assert.equal(samplePeekMotion(PEEK_CYCLE_MS-1).phase,'hidden');
  assert.equal(samplePeekMotion(PEEK_CYCLE_MS).phase,'emerging');
  assert.equal(samplePeekMotion(PEEK_CYCLE_MS+1080).pose,'blink');
  assert.equal(samplePeekMotion(PEEK_CYCLE_MS+3480).pose,'blink');
});

test('all timeline poses are finite, bounded and continuous through emergence and retreat',()=>{
  let previous=samplePeekMotion(0);
  for(let at=20;at<=PEEK_CYCLE_MS*3;at+=20){
    const current=samplePeekMotion(at);
    assert.ok(Number.isFinite(current.reveal));
    assert.ok(current.reveal>=0&&current.reveal<=1);
    assert.ok(['open','half','blink','curious','reach','touch'].includes(current.pose));
    assert.ok(Math.abs(current.reveal-previous.reveal)<.08,`visibility jump at ${at}`);
    previous=current;
  }
});

test('a focused button or an open bubble keeps Kenny visible without suppressing blinking',()=>{
  assert.equal(samplePeekMotion(8500,{holdVisible:true}).reveal,1);
  assert.equal(samplePeekMotion(1080,{holdVisible:true}).pose,'blink');
  assert.equal(samplePeekMotion(3480,{holdVisible:true}).pose,'blink');
});

test('reduced-motion preference freezes all image changes and retreat movement',()=>{
  for(let at=0;at<PEEK_CYCLE_MS*2;at+=40){
    const current=samplePeekMotion(at,{reducedMotion:true});
    assert.equal(current.pose,'open');
    assert.equal(current.reveal,1);
  }
});
