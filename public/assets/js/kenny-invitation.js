import { svgRobot } from './mascot.js';
import {readKennySession,saveKennySession,recordKennyOfferAccepted,DEFAULT_TIMES} from './kenny-session.js';

// Mount once through the shared website layout, never from the game itself.
let singleton=null;
export function mountKennyInvitation(root, options={}) {
  if(!(root instanceof HTMLElement)) throw new Error('Kenny invitation root element required');
  if(singleton) singleton.destroy();
  const $=id=>root.querySelector('#'+id);
  const gameUrl=options.gameUrl||'/learn/spot-the-scam';
  const allowed=options.eligiblePrefixes||['/learn/','/threats/','/protect-your-business/'];
  const excluded=options.excludedPaths||['/resources/security-checklist','/resources/downloads','/learn/spot-the-scam'];
  const times={...DEFAULT_TIMES,...options.timings};
  const blockedSelectors=options.blockedSelectors||[
    '#sr[aria-hidden="false"]', '#mnav.open','#mnav[aria-hidden="false"]',
    '[aria-modal="true"]:not([aria-hidden="true"]):not([hidden])',
    '[data-kenny-busy]','[data-spot-game]','[data-self-check-active]'
  ];
  let enabled=options.enabled===true;
  let s=readKennySession();
  // If navigation interrupted an offer or welcome page, count it as a deferral only once.
  if(!s.played && (s.pendingOffer||s.acceptedWithoutPlay)) {
    s.declines=Math.min(2,s.declines+1);s.activeMs=0;
    s.pendingOffer=false;s.acceptedWithoutPlay=false;saveKennySession(s);
  }
  const reduceMotion=window.matchMedia('(prefers-reduced-motion: reduce)');
  let lastActivity=0,active=false,kind='',timeouts=[],focusBefore=null,destroyed=false;
  const persist=()=>saveKennySession(s);
  const clearJobs=()=>{timeouts.forEach(clearTimeout);timeouts=[];};
  const later=(fn,ms)=>timeouts.push(setTimeout(fn,ms));
  const path=()=>window.location.pathname.replace(/\/$/,'')||'/';
  function isEligible(){
    if(!enabled || path()===gameUrl.replace(/\/$/,'') || excluded.includes(path()))return false;
    if(!allowed.some(prefix=>path().startsWith(prefix)))return false;
    if(typeof options.isEligible==='function' && !options.isEligible({pathname:path()}))return false;
    return true;
  }
  function isBlocked(checkin=false){
    if((checkin ? (excluded.includes(path()) || (typeof options.checkinEligible==='function' && !options.checkinEligible({pathname:path()}))) : !isEligible()) || document.hidden || !document.hasFocus()) return true;
    if(blockedSelectors.some(sel=>{try{return !!document.querySelector(sel);}catch(_){return false;}}))return true;
    const focus=document.activeElement;
    if(focus && focus.matches?.('input,textarea,select,[contenteditable="true"]'))return true;
    if(typeof options.shouldSuppress==='function' && options.shouldSuppress())return true;
    return false;
  }
  const activity=()=>{lastActivity=Date.now();};
  const activityEvents=['pointerdown','scroll','keydown','touchstart','wheel'];
  activityEvents.forEach(event=>window.addEventListener(event,activity,{passive:true}));
  function resetActive(){s.activeMs=0;lastActivity=0;persist();}
  function hide(reason='dismiss'){
    if(!active)return;
    const wasInside=root.contains(document.activeElement),prior=focusBefore;
    clearJobs();active=false;
    root.classList.add('hidden');root.querySelector('.kenny-pop')?.classList.remove('is-waving');
    $('kennyAnnouncement').textContent='';
    if(kind==='invitation'){
      s.pendingOffer=false;
      if(reason==='dismiss'||reason==='not-now')s.declines=Math.min(2,s.declines+1);
      if(reason==='accepted')s.acceptedWithoutPlay=true;
    }
    if(reason==='defer'){
      if(kind==='invitation'||kind==='helloOnly')s.appearance=Math.max(0,s.appearance-1);
      if(kind==='checkin')s.checkinShown=false;
      s.activeMs=Math.max(0,s.activeMs-6000);
    }
    persist();
    if(reason!=='defer' && reason!=='accepted') resetActive();
    if(wasInside && prior?.isConnected && !prior.closest('[hidden],.hidden'))prior.focus({preventScroll:true});
    else if(wasInside && document.activeElement?.blur)document.activeElement.blur();
    kind='';focusBefore=null;
  }
  function showWords(){
    if(!active)return;
    const words=$('kennyScript');
    if(kind==='invitation'){
      words.innerHTML='<span class="kenny-line">I’m Kenny, your Cyber Guide.</span><span class="kenny-subline">Think you can spot a scam?</span>';
      words.classList.remove('hidden');
      later(()=>{
        if(!active)return;
        words.innerHTML='<span class="kenny-line">Ready for a challenge?</span><span class="kenny-subline">Five quick scam-spotting situations.</span>';
        later(()=>{if(active){$('kennyActions').classList.remove('hidden');$('kennyAnnouncement').textContent='Kenny invites you to play five quick scam-spotting challenges. Choose Play now, Not now, or Dismiss Kenny.';}},reduceMotion.matches?0:600);
      },reduceMotion.matches?0:2500);
    }else{
      words.innerHTML=kind==='checkin' ? '<span class="kenny-line">Just checking in!</span><span class="kenny-subline">Hope these security tips are helpful. Keep going at your own pace.</span>' : '<span class="kenny-line">Nice to see you!</span><span class="kenny-subline">Hope you’re enjoying what you’re learning.</span>';
      words.classList.remove('hidden');$('kennyAnnouncement').textContent=words.textContent;
      later(()=>hide('auto'),reduceMotion.matches?5000:5200);
    }
  }
  function show(nextKind){
    if(active || isBlocked(nextKind==='checkin'))return false;
    kind=nextKind;active=true;clearJobs();
    focusBefore=document.activeElement&&document.activeElement!==document.body?document.activeElement:null;
    if(kind==='invitation'||kind==='helloOnly')s.appearance=Math.min(3,s.appearance+1);
    if(kind==='invitation')s.pendingOffer=true;
    if(kind==='checkin')s.checkinShown=true;
    resetActive();
    root.classList.remove('hidden');
    const popup=root.querySelector('.kenny-pop');popup.classList.add('is-waving');
    $('kennyGreeting').classList.remove('hidden');$('kennyScript').classList.add('hidden');
    $('kennyActions').classList.add('hidden');$('kennyScript').innerHTML='';$('kennyAnnouncement').textContent='';
    if(reduceMotion.matches){
      $('kennyGreeting').classList.add('hidden');popup.classList.remove('is-waving');
      if(kind==='invitation'){
        $('kennyScript').innerHTML='<span class="kenny-line">I’m Kenny, your Cyber Guide.</span><span class="kenny-subline">Ready for five quick scam-spotting challenges?</span>';
        $('kennyScript').classList.remove('hidden');$('kennyActions').classList.remove('hidden');
        $('kennyAnnouncement').textContent='Kenny invites you to play five quick scam-spotting challenges. Choose Play now, Not now, or Dismiss Kenny.';
      }else showWords();
    }else later(()=>{$('kennyGreeting').classList.add('hidden');popup.classList.remove('is-waving');showWords();},2000);
    return true;
  }
  const tick=()=>{
    if(!enabled || destroyed)return;
    if(active){if(isBlocked(kind==='checkin'))hide('defer');return;}
    if(!lastActivity||Date.now()-lastActivity>11000)return;
    const canCheckin=!isBlocked(true);
    const canInvite=!isBlocked(false);
    if(!canCheckin && !canInvite)return;
    if(canCheckin && s.completed)s.globalActiveMs=Math.min(600000,s.globalActiveMs+1000);
    if(canInvite)s.activeMs=Math.min(600000,s.activeMs+1000);
    persist();
    if(canCheckin && s.completed && !s.checkinShown && s.globalActiveMs>=times.afterPlay){show('checkin');return;}
    if(!canInvite||s.played)return;
    if(s.appearance===0 && s.activeMs>=times.first)show('invitation');
    else if(s.appearance===1 && s.declines>=1 && s.activeMs>=times.helloAfterDecline)show('helloOnly');
    else if(s.appearance===2 && s.declines>=1 && s.activeMs>=times.retryAfterHello)show('invitation');
  };
  const interval=setInterval(tick,1000);
  const onKey=(event)=>{if(event.key==='Escape'&&active)hide('dismiss');};
  const onPlayed=()=>{s=readKennySession(); if(active)hide('defer');};
  const onPlay=()=>{
    hide('accepted');recordKennyOfferAccepted();
    if(typeof options.onPlay==='function') options.onPlay(gameUrl);
    else window.location.assign(gameUrl);
  };
  const onClose=()=>hide('dismiss');const onNotNow=()=>hide('not-now');
  $('inviteRobot').innerHTML=svgRobot('Kenny, your Cyber Guide','encourage');
  $('invitePlay').addEventListener('click',onPlay);$('inviteNotNow').addEventListener('click',onNotNow);
  $('inviteClose').addEventListener('click',onClose);
  document.addEventListener('keydown',onKey);
  window.addEventListener('cybersafe:kenny-played',onPlayed);
  const api={
    enable(){enabled=true;},
    disable(){enabled=false;if(active)hide('defer');},
    refresh(){s=readKennySession();if(active && isBlocked())hide('defer');},
    getStatus(){return {enabled,active,eligible:isEligible(),blocked:isBlocked(),session:{...s}};},
    destroy(){if(destroyed)return;destroyed=true;clearInterval(interval);clearJobs();
      activityEvents.forEach(e=>window.removeEventListener(e,activity));
      document.removeEventListener('keydown',onKey);
      window.removeEventListener('cybersafe:kenny-played',onPlayed);
      $('invitePlay').removeEventListener('click',onPlay);
      $('inviteNotNow').removeEventListener('click',onNotNow);
      $('inviteClose').removeEventListener('click',onClose);
      root.classList.add('hidden');singleton=null;}
  };
  singleton=api;
  return api;
}
