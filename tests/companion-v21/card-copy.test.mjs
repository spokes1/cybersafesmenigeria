import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {INVITATION,CYBER_TIPS,ENCOURAGEMENTS,UI_COPY} from '../../tools/assets/kenny-companion/card-copy.js';

test('every message fits the compact-bubble copy budget and is plain text',()=>{
  assert.equal(CYBER_TIPS.length,10);
  assert.equal(ENCOURAGEMENTS.length,4);
  for(const message of [INVITATION,...CYBER_TIPS,...ENCOURAGEMENTS]){
    assert.ok(typeof message.title==='string'&&message.title.trim());
    assert.ok(typeof message.body==='string'&&message.body.trim());
    assert.ok(message.title.length<=32,message.title);
    assert.ok(message.body.length<=90,message.body);
    assert.ok(!/[<>]/.test(message.title+message.body));
  }
});

test('the handoff contains the exact card and button strings exported to the widget',()=>{
  const doc=fs.readFileSync(new URL('../../docs/companion-v21/Card_Copy.md',import.meta.url),'utf8');
  for(const message of [INVITATION,...CYBER_TIPS,...ENCOURAGEMENTS]){
    assert.ok(doc.includes(message.title),`missing title ${message.title}`);
    assert.ok(doc.includes(message.body),`missing body ${message.body}`);
  }
  for(const value of [INVITATION.primary,...Object.values(UI_COPY)])assert.ok(doc.includes(value),`missing UI text ${value}`);
});
