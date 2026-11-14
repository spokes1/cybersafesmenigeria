import { mountKenny } from '../kenny-companion/kenny-companion.js';
import { hasCompletedActivity,hasSeenPageNotice,markPageNoticeSeen,rememberReadingReturn } from './kenny-session.js';
const path=location.pathname.replace(/\/$/,'')||'/';
const excluded=new Set(['/learn/spot-the-scam','/resources/security-checklist','/protect-your-business/incident-response','/resources/organisations','/404']);
const noticePages=new Set(['/about']);
const NOTICE_DELAY=10000;
const NOTICE='CyberSafe SME Nigeria is in continuous development. We’re regularly updating our guidance and resources to better support your business.';
function hostBusy(){
 const modal=[...document.querySelectorAll('dialog[open],[aria-modal="true"]')].some(el=>!el.hidden&&el.getAttribute('aria-hidden')!=='true'&&el.getClientRects().length>0&&getComputedStyle(el).visibility!=='hidden');
 return modal||Boolean(document.querySelector('#mnav.open,[data-kenny-busy]'))||['INPUT','TEXTAREA','SELECT'].includes(document.activeElement?.tagName)||Boolean(document.activeElement?.isContentEditable);
}
if(!excluded.has(path)&&!window.__cybersafeKenny){
 let noticePending=noticePages.has(path)&&!hasSeenPageNotice(path),visibleMs=0,last=performance.now();
 let wasVisible=document.visibilityState==='visible',noticeTimer;
 const widget=mountKenny({
  assetBase:'/assets/kenny-companion/assets/',storageKey:'cybersafe.kenny.visit.v21',side:'right',
  inviteDelay:30000,inviteDuration:7000,autoTipDuration:6000,firstTipDelay:180000,tipCooldown:300000,quietAfterClose:60000,maxAutoTips:null,
  noticeDuration:8000,quietAfterNotice:12000,
  hasPlayed:hasCompletedActivity,isBusy:()=>hostBusy()||noticePending,
  onPlay:()=>{rememberReadingReturn(location.pathname+location.search+location.hash);location.assign('/learn/spot-the-scam');}
 });
 function checkNotice(){
  const now=performance.now();
  if(wasVisible)visibleMs+=Math.max(0,now-last);
  last=now;wasVisible=document.visibilityState==='visible';
  if(noticePending&&hasSeenPageNotice(path))noticePending=false;
  if(!noticePending)return;
  if(wasVisible&&visibleMs>=NOTICE_DELAY&&!hostBusy()&&!widget.getState().panel){
   noticePending=false;markPageNoticeSeen(path);widget.showNotice(NOTICE,'Continually improving CyberSafe SME Nigeria');
   return;
  }
  // Sleep until the exact visible-time deadline. Only deferred interactions
  // need a short retry; hidden tabs have no active notice timer.
  if(wasVisible)noticeTimer=setTimeout(checkNotice,visibleMs<NOTICE_DELAY?NOTICE_DELAY-visibleMs:200);
 }
 const resumeClock=()=>{clearTimeout(noticeTimer);checkNotice();};
 document.addEventListener('visibilitychange',resumeClock);window.addEventListener('pageshow',resumeClock);
 checkNotice();
 // Completion is re-read from session storage on every widget tick, including history restoration.
 window.__cybersafeKenny=Object.freeze({getState:widget.getState});
 window.addEventListener('pagehide',e=>{
  clearTimeout(noticeTimer);
  if(wasVisible)visibleMs+=Math.max(0,performance.now()-last);
  last=performance.now();wasVisible=false;
  if(!e.persisted)widget.destroy();
 });
}
