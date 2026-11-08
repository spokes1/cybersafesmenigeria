// Compact state only: invitation progress, no scores, answers or visitor identity.
export const STORAGE_KEY='cybersafe_spot_kenny_session_v5';
export const DEFAULT_TIMES=Object.freeze({first:20000,helloAfterDecline:180000,retryAfterHello:300000,afterPlay:300000});
const DEFAULT=()=>({appearance:0,declines:0,played:false,completed:false,checkinShown:false,activeMs:0,globalActiveMs:0,pendingOffer:false,acceptedWithoutPlay:false});
const bounded=(v,max)=>Math.max(0,Math.min(max,Number.isFinite(Number(v))?Number(v):0));
let memory=DEFAULT();
export function readKennySession(){
  let saved=null;
  try{saved=JSON.parse(window.sessionStorage.getItem(STORAGE_KEY)||'null');}catch(_){}
  if(!saved||typeof saved!=='object') saved=memory;
  return {appearance:bounded(saved.appearance,3),declines:bounded(saved.declines,2),played:saved.played===true,completed:saved.completed===true,checkinShown:saved.checkinShown===true,activeMs:bounded(saved.activeMs,600000),globalActiveMs:bounded(saved.globalActiveMs,600000),pendingOffer:saved.pendingOffer===true,acceptedWithoutPlay:saved.acceptedWithoutPlay===true};
}
export function saveKennySession(s){
  memory={...DEFAULT(),...s};
  try{window.sessionStorage.setItem(STORAGE_KEY,JSON.stringify(memory));}catch(_){}
}
export function recordKennyGameStarted(){
  const s=readKennySession(); s.played=true;s.pendingOffer=false;s.acceptedWithoutPlay=false;s.activeMs=0;
  saveKennySession(s);
  try{window.dispatchEvent(new CustomEvent('cybersafe:kenny-played'));}catch(_){}
}
// Start the five-minute post-game clock only when all five questions are finished.
export function recordKennyGameCompleted(){
  const s=readKennySession();
  if(!s.completed){s.completed=true;s.globalActiveMs=0;s.checkinShown=false;saveKennySession(s);}
  try{window.dispatchEvent(new CustomEvent('cybersafe:kenny-completed'));}catch(_){}
}
// Used only when returning from the game's unopened welcome page or after navigation away.
export function recordKennyOfferAccepted(){
  const s=readKennySession();s.pendingOffer=false;s.acceptedWithoutPlay=true;
  saveKennySession(s);
}
