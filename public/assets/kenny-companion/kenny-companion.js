import { normalizeTiming, createInitialState, serializeState, advanceVisibleTime, requestPanel, closePanel, recordPlayed, revealPeek, hideForVisit } from './kenny-state.js?v=3';
import { samplePeekMotion, sampleRetreatMotion, sampleEmergence, EMERGE_MS, RETREAT_MS } from './peek-motion.js?v=3';
import { INVITATION, CYBER_TIPS, UI_COPY } from './card-copy.js?v=3';
export { CYBER_TIPS } from './card-copy.js?v=3';

const PREFIX = 'kenny-companion-v1';
const storageRead = (kind, key) => { try { return JSON.parse(window[kind].getItem(key)); } catch { return null; } };
const storageWrite = (kind, key, value) => { try { window[kind].setItem(key, JSON.stringify(value)); } catch { /* Works in memory when storage is unavailable. */ } };
const editable = element => Boolean(element?.closest?.('input,textarea,select,[contenteditable]:not([contenteditable="false"]),[role="textbox"]'));

/** Mount once per document. All elapsed-time scheduling uses foreground time. */
export function mountKenny(options = {}) {
  if (typeof document === 'undefined' || !document.body) throw new Error('Mount Kenny after document.body is available.');
  const timing = normalizeTiming(options);
  const autoTipDuration = options.autoTipDuration ?? 6000;
  const inviteDuration = options.inviteDuration ?? 7000;
  const noticeDuration = options.noticeDuration ?? 8000;
  const quietAfterNotice = options.quietAfterNotice ?? 12000;
  for (const value of [noticeDuration,quietAfterNotice]) if (!Number.isFinite(value)||value<0) throw new RangeError("Invalid page notice duration.");
  let noticeMessage={title:"Website update",body:""};
  if (!Number.isFinite(autoTipDuration) || autoTipDuration < 0) throw new RangeError('autoTipDuration must be finite, non-negative milliseconds; 0 disables automatic dismissal.');
  if (!Number.isFinite(inviteDuration) || inviteDuration < 0) throw new RangeError('inviteDuration must be finite, non-negative milliseconds; 0 disables invitation timeout.');
  const side = options.side ?? 'right';
  if (!['left', 'right'].includes(side)) throw new TypeError('side must be left or right.');
  if (options.hasPlayed !== undefined && typeof options.hasPlayed !== 'boolean' && typeof options.hasPlayed !== 'function') throw new TypeError('hasPlayed must be a boolean or synchronous function.');
  if (options.onPlay !== undefined && typeof options.onPlay !== 'function') throw new TypeError('onPlay must be a function.');
  if (options.onStateChange !== undefined && typeof options.onStateChange !== 'function') throw new TypeError('onStateChange must be a function.');
  if (options.isBusy !== undefined && typeof options.isBusy !== 'function') throw new TypeError('isBusy must be a function.');
  const assetBase = new URL(options.assetBase ?? './assets/', import.meta.url);
  if (!assetBase.pathname.endsWith('/')) assetBase.pathname += '/';
  if (!['http:', 'https:', 'file:'].includes(assetBase.protocol)) throw new TypeError('assetBase must be a file or HTTP(S) URL.');
  const gameUrl = options.gameUrl ? new URL(options.gameUrl, document.baseURI) : null;
  if (gameUrl && !['http:', 'https:'].includes(gameUrl.protocol)) throw new TypeError('gameUrl must use HTTP(S).');
  const key = options.storageKey ?? PREFIX;
  if (typeof key !== 'string' || !key || key.length > 120) throw new TypeError('storageKey must be a non-empty string, at most 120 characters.');
  if ([...document.querySelectorAll('kenny-companion')].some(node => node.dataset.storageKey === key)) throw new Error('Kenny is already mounted with this storageKey.');
  let state = createInitialState(storageRead('sessionStorage', key), timing);
  let enabled = storageRead('sessionStorage', `${key}:enabled`) !== false;
  let fallbackPlayed = typeof options.hasPlayed === 'boolean' ? options.hasPlayed : storageRead('sessionStorage', `${key}:played`) === true;
  let destroyed = false, lastTick = performance.now(), lastBusy = -Infinity, lastSaved = -Infinity, lastNotified = '', lastContent = '';
  let motionMs = 0, motionFrame = samplePeekMotion(0), messageRemaining = null;
  let openingMs = EMERGE_MS, openingFromReveal = 0, retreatMs = state.tucked ? RETREAT_MS : null, retreatFromReveal = 1;
  const readyAssets = new Set();
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  let motionPaused = Boolean(options.motionPaused);
  const motionIsReduced = () => reduced.matches || motionPaused;
  const host = document.createElement('kenny-companion');
  host.dataset.storageKey = key;
  const shadow = host.attachShadow({ mode: 'open' });
  // This markup is constant. Configurable text always uses textContent.
  shadow.innerHTML = '<link rel="stylesheet"><div class="companion"><button type="button" class="peeker" aria-label="Open Kenny’s game invitation" aria-expanded="false"><img alt="" draggable="false"></button><section class="panel" role="region" aria-label="A message from Kenny" hidden><button type="button" class="close" aria-label="Close Kenny’s message">×</button><p class="body"></p><button type="button" class="primary"></button></section><div class="sr-only announcer" role="status" aria-live="polite" aria-atomic="true"></div></div>';
  const stylesheet = new URL('./kenny-companion.css', import.meta.url);
  stylesheet.searchParams.set('v', '5');
  shadow.querySelector('link').href = stylesheet.href;
  const $ = selector => shadow.querySelector(selector);
  const root = $('.companion'), peeker = $('.peeker'), image = $('.peeker img'), panel = $('.panel');
  root.dataset.side = side;
  const body = $('.body'), primary = $('.primary'), announcer = $('.announcer');
  $('.close').setAttribute('aria-label', UI_COPY.closeLabel);
  const paths = Object.fromEntries(['reach', 'touch', 'open', 'half', 'blink', 'curious'].map(name => {
    const url = new URL('kenny-peek-' + name + '.webp', assetBase);
    url.searchParams.set('v', '3');
    return [name, url.href];
  }));
  image.src = paths.open;
  image.dataset.pose = 'open';
  // Decode every eye frame first so a blink never switches to an empty image.
  for (const [name, src] of Object.entries(paths)) {
    const preload = new Image();
    const decoded = new Promise((resolve, reject) => {
      // Some browsers reject decode() for an otherwise successfully loaded image.
      // A real load event with pixels is also safe to display; a broken image is not.
      preload.onload = () => { if (preload.naturalWidth > 0) resolve(); else reject(new Error('Image contains no pixels.')); };
      preload.onerror = reject;
      preload.src = src;
      if (preload.decode) preload.decode().then(resolve).catch(() => {
        if (preload.complete && preload.naturalWidth > 0) resolve();
        // Otherwise the load/error handlers determine readiness.
      });
    });
    decoded.then(() => { readyAssets.add(name); if (!destroyed) render(); }).catch(() => { /* Preserve the current frame if an optional image cannot load. */ });
  }
  document.body.append(host);
  const cleanup = [];
  function listen(target, name, callback, settings) { target.addEventListener(name, callback, settings); cleanup.push(() => target.removeEventListener(name, callback, settings)); }
  function persist(force = false) {
    if (force || state.visibleMs - lastSaved >= 1000) { storageWrite('sessionStorage', key, serializeState(state)); lastSaved = state.visibleMs; }
  }
  function snapshot() { return { ...serializeState(state), panel: state.panel, played: state.played, enabled, side, reducedMotion: motionIsReduced(), motion: { ...motionFrame }, messageTiming: { type: state.panel, remainingMs: messageRemaining, entering: Boolean(state.panel) && openingMs < EMERGE_MS }, assets: { ready: [...readyAssets] }, timing: { ...timing, autoTipDuration, inviteDuration } }; }
  function notify() {
    const data = snapshot();
    const current = JSON.stringify({ ...data, motion: { phase: data.motion.phase, pose: data.motion.pose }, messageTiming: { ...data.messageTiming, remainingMs: data.messageTiming.remainingMs === null ? null : Math.ceil(data.messageTiming.remainingMs / 1000) * 1000 }, visibleMs: Math.floor(state.visibleMs / 1000) * 1000 });
    if (current !== lastNotified) {
      lastNotified = current;
      try { options.onStateChange?.(snapshot()); } catch { /* A host status hook must not stop the companion's lifecycle. */ }
    }
  }
  function syncPlayed() {
    let played = fallbackPlayed;
    if (typeof options.hasPlayed === 'function') {
      try { const result = options.hasPlayed(); if (typeof result === 'boolean') played = result; } catch { /* Keep last known state if host state is temporarily unavailable. */ played = state.played; }
    }
    recordPlayed(state, played);
  }
  function render(announce = false) {
    if (destroyed) return;
    root.classList.toggle('is-visible', enabled && state.revealed && !state.hidden);
    root.classList.toggle('is-present', Boolean(state.panel));
    motionFrame = samplePeekMotion(motionMs, { reducedMotion: motionIsReduced(), holdVisible: Boolean(state.panel) || shadow.activeElement === peeker });
    if (state.tucked) {
      motionFrame = sampleRetreatMotion(retreatMs ?? RETREAT_MS, { fromReveal: retreatFromReveal, reducedMotion: motionIsReduced() });
    } else if (state.panel && openingMs < EMERGE_MS && !motionIsReduced()) {
      motionFrame = { ...motionFrame, phase: 'emerging', reveal: sampleEmergence(openingMs, openingFromReveal), pose: openingMs < 350 ? 'reach' : openingMs < 650 ? 'touch' : 'open' };
    }
    root.classList.toggle('is-retreating', motionFrame.reveal < 0.999);
    root.style.setProperty('--peek-reveal', String(motionFrame.reveal));
    root.style.setProperty('--peek-hidden', String(1 - motionFrame.reveal));
    root.dataset.motion = motionFrame.phase;
    panel.hidden = !enabled || !state.panel || state.hidden;
    peeker.setAttribute('aria-expanded', String(!panel.hidden));
    peeker.setAttribute('aria-label', state.played ? UI_COPY.tipAria : UI_COPY.inviteAria);
    // An invitation never replaces the edge-gripping head with a static full-body render.
    const eyeFramesReady = ['open', 'half', 'blink'].every(name => readyAssets.has(name));
    const handFramesReady = ['open', 'reach', 'touch'].every(name => readyAssets.has(name));
    const isEyeFrame = motionFrame.pose === 'half' || motionFrame.pose === 'blink';
    const isHandFrame = motionFrame.pose === 'reach' || motionFrame.pose === 'touch';
    const pose = (isEyeFrame && !eyeFramesReady) || (isHandFrame && !handFramesReady) ? 'open' : motionFrame.pose;
    if (readyAssets.has(pose) && image.src !== paths[pose]) image.src = paths[pose];
    if (readyAssets.has(pose)) image.dataset.pose = pose;
    if (!panel.hidden) {
      const invite = state.panel === 'invite', notice = state.panel === 'notice';
      const tip = CYBER_TIPS[((state.tipIndex % CYBER_TIPS.length) + CYBER_TIPS.length) % CYBER_TIPS.length];
      const contentKey = invite ? 'invite' : notice ? 'notice:'+noticeMessage.body : 'tip:' + state.tipIndex;
      if (contentKey !== lastContent) {
        lastContent = contentKey;
        body.textContent = invite ? INVITATION.body : notice ? noticeMessage.body : tip.body;
        panel.setAttribute('aria-label', 'Kenny: ' + (invite ? INVITATION.title : notice ? noticeMessage.title : tip.title));
        panel.dataset.kind = invite ? 'invite' : notice ? 'notice' : 'tip';
        primary.hidden = !invite;
        primary.textContent = INVITATION.primary;
        primary.disabled = invite && !options.onPlay && !gameUrl;
        primary.title = primary.disabled ? UI_COPY.setupHelp : '';
      }
      if (announce) announcer.textContent = 'Kenny: ' + (invite ? INVITATION.title : notice ? noticeMessage.title : tip.title) + '. ' + body.textContent;
    } else announcer.textContent = '';
    notify();
  }
  function canAutomate() {
    let hostBusy = false;
    try { hostBusy = Boolean(options.isBusy?.()); } catch { hostBusy = true; }
    const modalOpen = [...document.querySelectorAll('dialog[open],[aria-modal="true"]')].some(modal => !modal.hidden && modal.getAttribute('aria-hidden') !== 'true' && modal.getClientRects().length > 0 && window.getComputedStyle(modal).visibility !== 'hidden');
    return enabled && !hostBusy && !modalOpen && document.visibilityState === 'visible' && performance.now() - lastBusy >= 4000 && !editable(document.activeElement) && !editable(shadow.activeElement);
  }
  function restartMotion() { motionMs = 0; openingMs = EMERGE_MS; retreatMs = null; }
  function beginMessage(fromReveal) {
    restartMotion(); openingFromReveal = Math.max(0, Math.min(1, fromReveal));
    openingMs = motionIsReduced() || openingFromReveal >= .999 ? EMERGE_MS : 0;
    const duration = state.panel === 'invite' ? inviteDuration : state.panel === 'notice' ? noticeDuration : autoTipDuration;
    messageRemaining = duration > 0 ? duration : null;
  }
  function beginRetreat(fromReveal) {
    messageRemaining = null; retreatFromReveal = Math.max(0, Math.min(1, fromReveal)); retreatMs = motionIsReduced() ? RETREAT_MS : 0;
    openingMs = EMERGE_MS;
  }
  function panelEngaged() {
    if (panel.matches(':hover') || panel.contains(shadow.activeElement)) return true;
    const selection = shadow.getSelection?.() ?? document.getSelection();
    return Boolean(selection && !selection.isCollapsed && (panel.contains(selection.anchorNode) || panel.contains(selection.focusNode)));
  }
  function open() { if (destroyed) return; const from = state.revealed ? motionFrame.reveal : 0; syncPlayed(); requestPanel(state, state.played ? 'tip' : 'invite'); beginMessage(from); persist(true); render(true); }
  function showTip(index) { if (destroyed) return; const from = state.revealed ? motionFrame.reveal : 0; syncPlayed(); requestPanel(state, 'tip', { tipIndex: index }); beginMessage(from); persist(true); render(true); }
  function showNotice(body, title="Website update") { if (destroyed) return; const from=state.revealed ? motionFrame.reveal : 0; noticeMessage={body:String(body),title:String(title)}; requestPanel(state,"notice"); beginMessage(from); persist(true); render(true); }
  function commitClose(action) {
    messageRemaining = null;
    const focusedInside = panel.contains(shadow.activeElement);
    const hadPanel = Boolean(state.panel), wasNotice = state.panel === 'notice';
    const from = motionFrame.reveal;
    action(); if (wasNotice) state.quietUntil=state.visibleMs+quietAfterNotice; if (hadPanel && state.tucked) beginRetreat(from); persist(true); render();
    if (focusedInside && enabled && state.revealed && !state.hidden) peeker.focus({ preventScroll: true });
  }
  function close() { if (destroyed) return; commitClose(() => closePanel(state)); }
  function peek() { if (destroyed) return; messageRemaining = null; revealPeek(state); restartMotion(); persist(true); render(); }
  function hide() { if (destroyed) return; messageRemaining = null; hideForVisit(state); persist(true); render(); }
  function setEnabled(value) { if (destroyed) return; messageRemaining = null; enabled = Boolean(value); storageWrite('sessionStorage', `${key}:enabled`, enabled); if (!enabled) closePanel(state); lastTick = performance.now(); persist(true); render(); }
  function setMotionPaused(value) { if (destroyed || motionPaused === Boolean(value)) return; motionPaused = Boolean(value); restartMotion(); render(); }
  function markPlayed(value = true) {
    if (destroyed) return; const hadPanel = Boolean(state.panel), from = motionFrame.reveal; fallbackPlayed = Boolean(value);
    if (typeof options.hasPlayed !== 'function') storageWrite('sessionStorage', `${key}:played`, fallbackPlayed);
    recordPlayed(state, value); if (hadPanel && !state.panel) beginRetreat(from); persist(true); render();
  }
  function resetVisit() { if (destroyed) return; messageRemaining = null; state = createInitialState({}, timing); syncPlayed(); lastTick = performance.now(); restartMotion(); persist(true); render(); }
  listen(peeker, 'click', () => { syncPlayed(); if (state.played && state.panel === 'tip') showTip(); else state.panel ? close() : open(); });
  listen($('.close'), 'click', close);
  listen(primary, 'click', () => {
    if (state.panel !== 'invite') return;
    close();
    if (options.onPlay) options.onPlay();
    else if (gameUrl) window.location.assign(gameUrl.href);
  });
  listen(document, 'keydown', event => {
    if (event.key === 'Escape' && state.panel) {
      const wasInside = host === document.activeElement;
      close(); if (wasInside) peeker.focus({ preventScroll: true });
    }
    if (editable(event.target)) lastBusy = performance.now();
  });
  listen(document, 'scroll', () => { lastBusy = performance.now(); }, { passive: true, capture: true });
  listen(document, 'pointerdown', event => { if (!event.composedPath().includes(host)) lastBusy = performance.now(); }, { passive: true });
  listen(document, 'input', () => { lastBusy = performance.now(); }, { passive: true });
  listen(document, 'visibilitychange', () => { lastTick = performance.now(); persist(true); render(); });
  listen(window, 'pagehide', () => persist(true));
  listen(window, 'pageshow', () => { lastTick=performance.now(); render(); });
  listen(reduced, 'change', () => { restartMotion(); render(); });
  listen(window, 'storage', event => {
    if (event.key === `${key}:enabled`) { enabled = storageRead('sessionStorage', `${key}:enabled`) !== false; render(); }
    if (event.key === `${key}:played` && typeof options.hasPlayed !== 'function') { fallbackPlayed = storageRead('sessionStorage', `${key}:played`) === true; syncPlayed(); render(); }
  });
  const interval = window.setInterval(() => {
    if (destroyed) return;
    const now = performance.now(), elapsed = Math.max(0, Math.min(2000, now - lastTick)); lastTick = now;
    if (document.visibilityState !== 'visible' || !enabled) return;
    const before = state.panel, wasRevealed = state.revealed, fromReveal = motionFrame.reveal; syncPlayed();
    if (before && !state.panel) beginRetreat(fromReveal);
    let readingElapsed = 0;
    if (state.revealed && !state.hidden) {
      if (state.tucked) {
        retreatMs = Math.min(RETREAT_MS, (retreatMs ?? RETREAT_MS) + elapsed);
      } else {
        motionMs = wasRevealed ? motionMs + elapsed : 0;
        if (state.panel) {
          readingElapsed = motionIsReduced() ? elapsed : Math.max(0, openingMs + elapsed - EMERGE_MS);
          openingMs = Math.min(EMERGE_MS, openingMs + elapsed);
        }
      }
    }
    if (messageRemaining !== null && state.panel) {
      // Every message can be read before withdrawing, including manually opened tips.
      // Hover, keyboard focus or selected text counts as an active response.
      if (!panelEngaged()) messageRemaining -= readingElapsed;
      if (messageRemaining <= 0) {
        const wasNotice=state.panel==='notice'; closePanel(state); if(wasNotice)state.quietUntil=state.visibleMs+quietAfterNotice; beginRetreat(fromReveal); persist(true);
      }
    }
    const event = advanceVisibleTime(state, elapsed, { canAuto: canAutomate(), played: state.played });
    if (event) beginMessage(wasRevealed ? fromReveal : 0);
    persist(); render(Boolean(event) || (!before && Boolean(state.panel)));
  }, 40);
  syncPlayed(); render();
  return Object.freeze({ open, showTip, showNotice, peek, close, markPlayed, resetVisit, hideForVisit: hide, setEnabled, getState: snapshot, setMotionPaused, destroy() { if (destroyed) return; persist(true); destroyed = true; messageRemaining = null; clearInterval(interval); for (const stop of cleanup) stop(); host.remove(); } });
}
