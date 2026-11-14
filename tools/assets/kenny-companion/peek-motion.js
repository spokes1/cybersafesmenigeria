/** Deterministic decorative motion. Time advances only while the widget is visible. */
export const PEEK_CYCLE_MS = 10500;
export const BLINK_STARTS_MS = Object.freeze([1000, 3400]);
export const BLINK_PHASE_MS = Object.freeze({ halfClose: 80, closed: 300, halfOpen: 80 });
export const RETREAT_MS = 600;
export const EMERGE_MS = 850;
function smooth(value) {
  const t = Math.max(0, Math.min(1, value));
  return t * t * t * (10 + t * (-15 + 6 * t));
}
export function samplePeekMotion(milliseconds, { reducedMotion = false, holdVisible = false } = {}) {
  if (!Number.isFinite(milliseconds) || milliseconds < 0) throw new RangeError('Motion time must be finite and non-negative.');
  if (reducedMotion) return { phase: 'static', pose: 'open', reveal: 1, cycleTime: 0 };
  const time = milliseconds % PEEK_CYCLE_MS;
  let phase = 'hold', reveal = 1, pose = 'open';
  if (time < 850) { phase = 'emerging'; reveal = smooth(time / 850); }
  else if (time >= 7050 && time < 7900) { phase = 'retreating'; reveal = 1 - smooth((time - 7050) / 850); }
  else if (time >= 7900) { phase = 'hidden'; reveal = 0; }
  for (const start of BLINK_STARTS_MS) {
    const elapsed = time - start;
    if (elapsed >= 0 && elapsed < 460) {
      phase = 'blinking';
      pose = elapsed < 80 || elapsed >= 380 ? 'half' : 'blink';
      break;
    }
  }
  if (!holdVisible && time < 650) pose = time < 350 ? 'reach' : 'touch';
  if (pose === 'open' && time >= 2500 && time < 4300) pose = 'curious';
  if (holdVisible) reveal = 1;
  return { phase, pose, reveal, cycleTime: time };
}

/** Functional dismissal persists until a message or explicit preview opens Kenny. */
export function sampleRetreatMotion(milliseconds, { fromReveal = 1, reducedMotion = false } = {}) {
  if (!Number.isFinite(milliseconds) || milliseconds < 0 || !Number.isFinite(fromReveal) || fromReveal < 0 || fromReveal > 1) throw new RangeError('Retreat time and reveal must be finite and in range.');
  const finished = reducedMotion || milliseconds >= RETREAT_MS;
  return { phase: finished ? 'tucked' : 'retreating', pose: 'open', reveal: finished ? 0 : fromReveal * (1 - smooth(milliseconds / RETREAT_MS)), cycleTime: milliseconds };
}

export function sampleEmergence(milliseconds, fromReveal = 0) {
  return fromReveal + (1 - fromReveal) * smooth(milliseconds / EMERGE_MS);
}
