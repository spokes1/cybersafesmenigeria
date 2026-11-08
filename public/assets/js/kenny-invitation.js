import { svgRobot } from './mascot.js';
import { readKennySession, saveKennySession, recordKennyOfferAccepted, DEFAULT_TIMES } from './kenny-session.js';

// Website-only controller; game questions and scoring remain in the V5.1 module.
// One timer for the targeted offer and the five-minute, post-completion greeting.
let singleton = null;
export function mountKennyInvitation(root, options = {}) {
  if (!(root instanceof HTMLElement)) throw new Error('Kenny invitation root required');
  if (singleton) singleton.destroy();
  const $ = id => root.querySelector('#' + id);
  const gameUrl = options.gameUrl || '/learn/spot-the-scam';
  const times = {...DEFAULT_TIMES, ...options.timings};
  const allowed = options.eligiblePrefixes || ['/'];
  const excluded = options.excludedPaths || ['/learn/spot-the-scam', '/resources/security-checklist', '/protect-your-business/incident-response'];
  const blockedSelectors = options.blockedSelectors || [
    '#sr.open', '#mnav.open', '[aria-modal="true"]:not([aria-hidden="true"]):not([hidden])',
    '[data-kenny-busy]', '[data-spot-game]', '[data-self-check-active]'
  ];
  const peek = $('kennyPeek');
  const popup = $('kennyPanel');
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  let s = readKennySession();
  let enabled = options.enabled === true;
  let active = false, kind = '', destroyed = false, timeouts = [], focusBefore = null;
  let lastTick = performance.now();
  // An interrupted invitation is not a fresh chance to automatically interrupt.
  if (!s.played && (s.pendingOffer || s.acceptedWithoutPlay)) {
    s.pendingOffer = false; s.acceptedWithoutPlay = false;
    s.appearance = Math.max(1, s.appearance);
    saveKennySession(s);
  }
  const persist = () => saveKennySession(s);
  const path = () => window.location.pathname.replace(/\/$/, '') || '/';
  const clearJobs = () => {timeouts.forEach(clearTimeout);timeouts = [];};
  const later = (fn, ms) => timeouts.push(setTimeout(fn, ms));
  function isEligible() {
    if (!enabled || excluded.includes(path()) || path() === gameUrl) return false;
    if (!allowed.some(prefix => path().startsWith(prefix))) return false;
    return typeof options.isEligible !== 'function' || options.isEligible({pathname: path()});
  }
  function isBlocked(checkin = false) {
    if (!enabled || excluded.includes(path()) || document.hidden || !document.hasFocus()) return true;
    if (checkin && typeof options.checkinEligible === 'function' && !options.checkinEligible({pathname: path()})) return true;
    if (blockedSelectors.some(sel => { try {return !!document.querySelector(sel);} catch (_) {return false;} })) return true;
    const focus = document.activeElement;
    if (focus && focus.matches?.('input,textarea,select,[contenteditable="true"]')) return true;
    if (typeof options.shouldSuppress === 'function' && options.shouldSuppress()) return true;
    return false;
  }
  function updatePeek() {
    peek.setAttribute('aria-label', s.played ? 'Say hello to Kenny' : 'Meet Kenny and learn about Spot the Scam');
    peek.setAttribute('aria-expanded', String(active));
  }
  function hide(reason = 'close') {
    if (!active) return;
    const wasInside = popup.contains(document.activeElement);
    const prior = focusBefore;
    clearJobs();
    active = false; popup.hidden = true;
    popup.classList.remove('is-waving'); root.classList.remove('is-open');
    $('kennyAnnouncement').textContent = '';
    if (kind === 'invitation') {
      s.pendingOffer = false;
      if (reason === 'not-now' || reason === 'close') s.declines = Math.min(2, s.declines + 1);
      if (reason === 'accepted') s.acceptedWithoutPlay = true;
    }
    if (kind === 'checkin' && reason === 'defer') s.checkinShown = false;
    if (kind === 'checkin' && reason === 'defer') s.globalActiveMs = Math.max(0, s.globalActiveMs - 2000);
    kind = '';
    focusBefore = null;
    persist(); updatePeek();
    if (wasInside) {
      const target = prior && prior.isConnected && !prior.closest('[hidden],.hidden') ? prior : peek;
      target.focus({preventScroll: true});
    }
  }
  function showWords() {
    if (!active) return;
    const words = $('kennyScript');
    if (kind === 'invitation') {
      words.innerHTML = '<span class="kenny-line">I’m Kenny, your Cyber Guide.</span><span class="kenny-subline">Ready to try five quick scam-spotting situations?</span>';
      words.classList.remove('hidden');
      $('kennyActions').classList.remove('hidden');
      $('kennyAnnouncement').textContent = 'Kenny invites you to play Spot the Scam. Choose Play now, Not now, or close.';
      later(() => hide('auto'), 16000);
    } else {
      words.innerHTML = kind === 'checkin'
        ? '<span class="kenny-line">Just checking in!</span><span class="kenny-subline">Hope the guidance is useful. Enjoy learning at your own pace.</span>'
        : '<span class="kenny-line">Hello again!</span><span class="kenny-subline">Hope you’re enjoying the CyberSafe guides. Keep learning at your own pace.</span>';
      words.classList.remove('hidden');
      $('kennyAnnouncement').textContent = words.textContent;
      later(() => hide('auto'), reduceMotion.matches ? 5500 : 6500);
    }
  }
  function show(nextKind, manual = false) {
    if (active || isBlocked(true)) return false;
    kind = nextKind; active = true; clearJobs();
    focusBefore = document.activeElement !== document.body ? document.activeElement : null;
    if (kind === 'invitation') {
      s.appearance = Math.max(1, s.appearance);
      s.pendingOffer = true;
      s.activeMs = 0;
    }
    if (kind === 'checkin') s.checkinShown = true;
    persist(); updatePeek();
    popup.hidden = false; root.classList.add('is-open');
    $('kennyGreeting').classList.toggle('hidden', reduceMotion.matches || manual);
    $('kennyScript').classList.add('hidden');
    $('kennyActions').classList.add('hidden');
    $('kennyScript').textContent = ''; $('kennyAnnouncement').textContent = '';
    popup.classList.toggle('is-waving', !reduceMotion.matches);
    if (reduceMotion.matches || manual) showWords();
    else later(() => {if (active) {$('kennyGreeting').classList.add('hidden');popup.classList.remove('is-waving');showWords();}}, 1600);
    if (manual) $('inviteClose').focus({preventScroll: true});
    return true;
  }
  const tick = () => {
    const now = performance.now();
    const elapsed = Math.max(0, Math.min(2000, now - lastTick));
    lastTick = now;
    if (!enabled || destroyed) return;
    if (active) {if (isBlocked(true)) hide('defer'); return;}
    // A visitor reading without touching their mouse is still actively viewing
    // the page. Hidden tabs, unfocused windows, forms, search and menus do not count.
    const canGreet = !isBlocked(true);
    const canInvite = isEligible() && canGreet;
    if (canGreet && s.completed && !s.checkinShown) {
      s.globalActiveMs = Math.min(times.afterPlay + 2000, s.globalActiveMs + elapsed);
    }
    if (canInvite && !s.played && s.appearance === 0) {
      s.activeMs = Math.min(times.first + 2000, s.activeMs + elapsed);
    }
    if (canGreet || canInvite) persist();
    if (canGreet && s.completed && !s.checkinShown && s.globalActiveMs >= times.afterPlay) {
      show('checkin');return;
    }
    if (canInvite && !s.played && s.appearance === 0 && s.activeMs >= times.first) show('invitation');
  };
  function onPeeker() {
    s = readKennySession();
    if (active) {hide('close');return;}
    show(s.played ? 'helloOnly' : 'invitation', true);
  }
  const onPlayed = () => {s = readKennySession();if (active) hide('defer');updatePeek();};
  const onCompleted = () => {s = readKennySession();updatePeek();lastTick = performance.now();};
  const onPlay = () => {
    hide('accepted');recordKennyOfferAccepted();
    if (typeof options.onPlay === 'function') options.onPlay(gameUrl);
    else window.location.assign(gameUrl);
  };
  const onNotNow = () => hide('not-now');
  const onClose = () => hide('close');
  const onKey = event => {if (event.key === 'Escape' && active) hide('close');};
  const onResume = () => {lastTick = performance.now();};
  $('inviteRobot').innerHTML = svgRobot('Kenny, your Cyber Guide', 'encourage');
  $('kennyPeekRobot').innerHTML = svgRobot('Kenny', 'encourage');
  peek.addEventListener('click', onPeeker);
  $('invitePlay').addEventListener('click', onPlay);
  $('inviteNotNow').addEventListener('click', onNotNow);
  $('inviteClose').addEventListener('click', onClose);
  document.addEventListener('keydown', onKey);
  document.addEventListener('visibilitychange', onResume);
  window.addEventListener('focus', onResume);
  window.addEventListener('pageshow', onResume);
  window.addEventListener('cybersafe:kenny-played', onPlayed);
  window.addEventListener('cybersafe:kenny-completed', onCompleted);
  updatePeek();root.classList.add('is-ready');
  const interval = setInterval(tick, 1000);
  const api = {
    enable(){enabled = true;},
    disable(){enabled = false;if(active) hide('defer');},
    refresh(){s = readKennySession();updatePeek();if(active && isBlocked(true)) hide('defer');},
    getStatus(){return {enabled,active,kind,eligible:isEligible(),blocked:isBlocked(true),session:{...s}};},
    destroy(){
      if (destroyed) return;destroyed = true;clearInterval(interval);clearJobs();
      peek.removeEventListener('click', onPeeker);
      $('invitePlay').removeEventListener('click', onPlay);
      $('inviteNotNow').removeEventListener('click', onNotNow);
      $('inviteClose').removeEventListener('click', onClose);
      document.removeEventListener('keydown', onKey);
      document.removeEventListener('visibilitychange', onResume);
      window.removeEventListener('focus', onResume);
      window.removeEventListener('pageshow', onResume);
      window.removeEventListener('cybersafe:kenny-played', onPlayed);
      window.removeEventListener('cybersafe:kenny-completed', onCompleted);
      popup.hidden = true;singleton = null;
    }
  };
  singleton = api;
  return api;
}
