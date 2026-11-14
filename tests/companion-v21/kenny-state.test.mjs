import test from 'node:test';
import assert from 'node:assert/strict';
import {
  DEFAULT_TIMING, normalizeTiming, createInitialState, advanceVisibleTime,
  requestPanel, dismissInvitation, closePanel, recordPlayed, revealPeek,
  hideForVisit, serializeState,
} from '../../tools/assets/kenny-companion/kenny-state.js';

function state(saved=null) { return createInitialState(saved, normalizeTiming({})); }

test('first invitation waits for 25 seconds of supplied visible time', () => {
  const s=state();
  assert.equal(advanceVisibleTime(s, 24_000), null);
  assert.equal(s.panel, null);
  const event=advanceVisibleTime(s, 1_000);
  assert.equal(event?.panel, 'invite');
  assert.equal(event?.automatic, true);
  assert.equal(s.panel, 'invite');
  assert.equal(s.invitationSeen, true);
});

test('dismissing the invitation keeps the peeker and does not automatically re-invite', () => {
  const s=state();
  advanceVisibleTime(s,25_000);
  dismissInvitation(s);
  assert.equal(s.panel,null);
  assert.equal(s.dismissed,true);
  assert.equal(s.revealed,true);
  for(let t=0;t<90;t++) {
    const event=advanceVisibleTime(s,1_000);
    assert.notEqual(event?.panel,'invite');
  }
});

test('visit serialization survives navigation without saving an open panel', () => {
  const s=state();
  advanceVisibleTime(s,25_000);
  dismissInvitation(s);
  advanceVisibleTime(s,33_000,{canAuto:false});
  const saved=serializeState(s);
  assert.equal('panel' in saved,false);
  assert.equal('timing' in saved,false);
  assert.equal('played' in saved,false);
  const restored=state(JSON.parse(JSON.stringify(saved)));
  assert.equal(restored.visibleMs,s.visibleMs);
  assert.equal(restored.dismissed,true);
  assert.equal(restored.panel,null);
  assert.notEqual(advanceVisibleTime(restored,1_000)?.panel,'invite');
});

test('a navigation away while the invitation is open does not repeat it automatically', () => {
  const s=state();
  advanceVisibleTime(s,25_000);
  const restored=state(serializeState(s));
  assert.equal(restored.panel,null);
  assert.equal(restored.invitationSeen,true);
  assert.notEqual(advanceVisibleTime(restored,1_000)?.panel,'invite');
});

test('already-played visitor gets a tip as the first automatic message', () => {
  const s=state();
  recordPlayed(s,true);
  const event=advanceVisibleTime(s,25_000,{played:true});
  assert.notEqual(event?.panel,'invite');
  assert.equal(s.revealed,true);
  assert.equal(s.panel,'tip');
});

test('manual request selects a tip after game completion and invitation before it', () => {
  const s=state();
  requestPanel(s,'invite');
  assert.equal(s.panel,'invite');
  closePanel(s);
  recordPlayed(s,true);
  requestPanel(s,'invite');
  assert.equal(s.panel,'tip');
  assert.equal(s.autoTipsShown,0);
});

test('due automatic tips defer during interaction, then open once the page is available', () => {
  const s=state();
  recordPlayed(s,true);
  advanceVisibleTime(s,25_000,{played:true});
  closePanel(s);
  let event=null;
  for(let t=0;t<400;t++) event=advanceVisibleTime(s,1_000,{played:true,canAuto:false});
  assert.equal(event,null);
  assert.equal(s.panel,null);
  assert.equal(s.autoTipsShown,1);
  event=advanceVisibleTime(s,1_000,{played:true,canAuto:true});
  assert.equal(event?.panel,'tip');
  assert.equal(s.autoTipsShown,2);
});

test('open panel suppresses automatic tips and closing grants a quiet interval', () => {
  const s=state();
  requestPanel(s,'invite');
  for(let t=0;t<300;t++) assert.equal(advanceVisibleTime(s,1_000),null);
  assert.equal(s.panel,'invite');
  assert.equal(s.autoTipsShown,0);
  closePanel(s);
  assert.equal(advanceVisibleTime(s,1_000),null);
  assert.equal(s.panel,null);
});

test('automatic tips respect five-minute cooldown and explicit three-tip session cap', () => {
  const s=createInitialState({},normalizeTiming({maxAutoTips:3}));
  recordPlayed(s,true);
  let previousTipTime=-Infinity, openings=0;
  for(let i=0;i<2400;i++) {
    const event=advanceVisibleTime(s,1_000,{played:true});
    if(event?.panel==='tip') {
      assert.ok(s.visibleMs-previousTipTime>=300_000,`cooldown shorter than five minutes: ${s.visibleMs-previousTipTime}`);
      previousTipTime=s.visibleMs;
      openings++;
      closePanel(s);
    }
  }
  assert.equal(openings,3);
  assert.equal(s.autoTipsShown,3);
});

test('manual tips do not consume automatic allowance and postpone the next automatic tip', () => {
  const s=state();
  recordPlayed(s,true);
  advanceVisibleTime(s,150_000,{played:true,canAuto:false});
  requestPanel(s,'tip');
  const manualTime=s.visibleMs;
  assert.equal(s.autoTipsShown,0);
  closePanel(s);
  for(let t=0;t<299;t++) assert.equal(advanceVisibleTime(s,1_000,{played:true}),null);
  assert.ok(s.nextAutoTipAt>=manualTime+300_000);
});

test('hide for this visit persists across navigation and suppresses every automatic panel', () => {
  const s=state();
  revealPeek(s);
  hideForVisit(s);
  const restored=state(serializeState(s));
  assert.equal(restored.hidden,true);
  for(let t=0;t<600;t++) assert.equal(advanceVisibleTime(restored,1_000),null);
  assert.equal(restored.panel,null);
});

test('saved input cannot forge an open panel or non-finite counters', () => {
  const s=state({version:1,panel:'invite',visibleMs:NaN,autoTipsShown:Infinity,nextAutoTipAt:NaN,tipIndex:-999});
  assert.equal(s.panel,null);
  for(const key of ['visibleMs','autoTipsShown','nextAutoTipAt','tipIndex']) assert.ok(Number.isFinite(s[key]),key);
  assert.ok(s.visibleMs>=0);
  assert.ok(s.autoTipsShown>=0);
});

test('automatic tips can be disabled independently of the initial invitation', () => {
  const s=createInitialState({},normalizeTiming({maxAutoTips:0}));
  assert.equal(advanceVisibleTime(s,25_000)?.panel,'invite');
  dismissInvitation(s);
  for(let t=0;t<1200;t++) assert.equal(advanceVisibleTime(s,1_000),null);
  assert.equal(s.autoTipsShown,0);
});

test('invalid timing is rejected instead of silently producing timer loops', () => {
  for(const options of [{inviteDelay:-1},{firstTipDelay:NaN},{tipCooldown:Infinity},{maxAutoTips:1.5},{maxAutoTips:-1}]) {
    assert.throws(()=>normalizeTiming(options),RangeError);
  }
  assert.equal(normalizeTiming({quietAfterClose:0}).quietAfterClose,0);
  assert.equal(DEFAULT_TIMING.inviteDelay,25_000);
});
