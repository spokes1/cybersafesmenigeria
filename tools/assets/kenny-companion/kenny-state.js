/** Pure, deterministic visible-time state machine. No DOM, clock, or storage. */
export const DEFAULT_TIMING = Object.freeze({
  inviteDelay: 25000, firstTipDelay: 180000, tipCooldown: 300000,
  maxAutoTips: null, quietAfterClose: 60000
});

export function normalizeTiming(options = {}) {
  const timing = {};
  for (const [key, fallback] of Object.entries(DEFAULT_TIMING)) {
    const value = options[key] === undefined ? fallback : options[key];
    if (key === 'maxAutoTips' && value === null) { timing[key] = null; continue; }
    if (!Number.isFinite(value) || value < 0 || (key === 'maxAutoTips' && !Number.isSafeInteger(value))) {
      throw new RangeError(`${key} must be a finite non-negative ${key === 'maxAutoTips' ? 'integer, or null for no cap' : 'number of milliseconds'}.`);
    }
    timing[key] = value;
  }
  return Object.freeze(timing);
}

const finite = (value, fallback = 0) => Number.isFinite(value) && value >= 0 ? Math.min(value, 31536000000) : fallback;

export function createInitialState(saved = {}, timing = DEFAULT_TIMING) {
  timing = normalizeTiming(timing);
  if (!saved || typeof saved !== 'object' || saved.version !== 1) saved = {};
  // Preserve an explicit false: completed visitors may navigate before their first
  // 25-second tip. invitationSeen/counter inference is only for older saved visits.
  const firstMessageSeen = typeof saved.firstMessageSeen === 'boolean' ? saved.firstMessageSeen : saved.invitationSeen === true || (Number.isSafeInteger(saved.autoTipsShown) && saved.autoTipsShown > 0);
  return {
    version: 1, visibleMs: finite(saved.visibleMs),
    revealed: saved.revealed === true, invitationSeen: saved.invitationSeen === true,
    dismissed: saved.dismissed === true, hidden: saved.hidden === true,
    firstMessageSeen,
    tucked: saved.tucked === true || (saved.revealed === true && firstMessageSeen),
    autoTipsShown: Number.isSafeInteger(saved.autoTipsShown) ? Math.max(0, saved.autoTipsShown) : 0,
    nextAutoTipAt: finite(saved.nextAutoTipAt, timing.firstTipDelay),
    quietUntil: finite(saved.quietUntil),
    tipIndex: Number.isInteger(saved.tipIndex) && saved.tipIndex >= -1 && saved.tipIndex < 10000 ? saved.tipIndex : -1,
    panel: null, played: false, timing
  };
}

export function serializeState(state) {
  const { version, visibleMs, revealed, invitationSeen, dismissed, hidden, firstMessageSeen, tucked, autoTipsShown, nextAutoTipAt, quietUntil, tipIndex } = state;
  return { version, visibleMs, revealed, invitationSeen, dismissed, hidden, firstMessageSeen, tucked, autoTipsShown, nextAutoTipAt, quietUntil, tipIndex };
}

export function requestPanel(state, type = 'invite', { automatic = false, tipIndex } = {}) {
  if (type !== 'invite' && type !== 'tip' && type !== 'notice') throw new TypeError('Panel must be invite or tip.');
  if (state.played && type === 'invite') type = 'tip';
  state.hidden = false; state.revealed = true; state.tucked = false; state.panel = type; if (type !== 'notice') state.firstMessageSeen = true;
  if (type === 'invite') state.invitationSeen = true;
  else if (type === 'tip') {
    state.tipIndex = Number.isInteger(tipIndex) && tipIndex >= 0 ? tipIndex : state.tipIndex + 1;
    state.nextAutoTipAt = state.visibleMs + state.timing.tipCooldown;
    if (automatic) state.autoTipsShown += 1;
  }
  return state;
}

export function advanceVisibleTime(state, deltaMs, { canAuto = true, played = state.played } = {}) {
  if (!Number.isFinite(deltaMs) || deltaMs < 0) throw new RangeError('Visible-time delta must be finite and non-negative.');
  state.visibleMs += deltaMs;
  recordPlayed(state, played);
  if (state.hidden) return null;
  if (state.visibleMs >= state.timing.inviteDelay && !state.revealed) { state.revealed = true; state.tucked = true; }
  if (!canAuto || state.panel || state.visibleMs < state.quietUntil) return null;
  const tipsAllowed = state.timing.maxAutoTips === null || state.autoTipsShown < state.timing.maxAutoTips;
  if (!state.firstMessageSeen && state.visibleMs >= state.timing.inviteDelay) {
    state.firstMessageSeen = true;
    if (!state.played || tipsAllowed) {
      const panel = state.played ? 'tip' : 'invite';
      requestPanel(state, panel, { automatic: true });
      return { type: 'open', panel, automatic: true };
    }
  }
  if (state.revealed && tipsAllowed && state.visibleMs >= state.nextAutoTipAt) {
    requestPanel(state, 'tip', { automatic: true });
    return { type: 'open', panel: 'tip', automatic: true };
  }
  return null;
}

export function closePanel(state) {
  const hadPanel = state.panel !== null;
  if (state.panel === 'invite') state.dismissed = true;
  state.panel = null;
  if (hadPanel) state.tucked = true;
  state.quietUntil = state.visibleMs + state.timing.quietAfterClose;
  return state;
}

export function dismissInvitation(state) {
  state.invitationSeen = true; state.dismissed = true; state.revealed = true;
  return closePanel(state);
}

export function recordPlayed(state, played = true) {
  state.played = Boolean(played);
  if (state.played) {
    state.invitationSeen = true;
    if (state.panel === 'invite') closePanel(state);
  }
  return state;
}

export function revealPeek(state) {
  state.hidden = false; state.revealed = true; state.invitationSeen = true;
  state.firstMessageSeen = true;
  closePanel(state); state.tucked = false;
  return state;
}

export function hideForVisit(state) {
  closePanel(state); state.hidden = true;
  return state;
}
