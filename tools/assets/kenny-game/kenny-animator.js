import * as THREE from './vendor/three/build/three.module.js';

export const KENNY_CLIPS = Object.freeze([
  'Idle_Loop', 'Blink', 'Wave', 'Talk_Loop', 'Thinking', 'Point',
  'Happy', 'Encourage', 'Celebrate', 'Peek', 'Goodbye', 'CheckIn'
]);

/** A single mixer for Kenny's shared rig. Call update(deltaSeconds) each frame. */
export class KennyAnimator {
  constructor(model, clips, { fadeSeconds = 0.22, returnToIdle = true } = {}) {
    this.mixer = new THREE.AnimationMixer(model);
    this.actions = new Map(clips.map(clip => [clip.name, this.mixer.clipAction(clip)]));
    this.active = null;
    this.fadeSeconds = fadeSeconds;
    this.returnToIdle = returnToIdle;
    this.paused = false;
    this.speed = 1;
    this.onChange = null;
    this._finished = ({ action }) => {
      if (action !== this.active) return;
      if (this.returnToIdle && this.actions.has('Idle_Loop')) this.play('Idle_Loop');
    };
    this.mixer.addEventListener('finished', this._finished);
  }

  play(name, { fade = name === 'Blink' ? Math.min(this.fadeSeconds, 0.03) : this.fadeSeconds, repeat = /^(Idle_Loop|Talk_Loop)$/.test(name) } = {}) {
    const next = this.actions.get(name);
    if (!next) throw new Error(`Kenny animation is missing: ${name}`);
    const previous = this.active;
    next.reset();
    next.enabled = true;
    next.clampWhenFinished = !repeat;
    next.setLoop(repeat ? THREE.LoopRepeat : THREE.LoopOnce, repeat ? Infinity : 1);
    next.setEffectiveTimeScale(1);
    next.setEffectiveWeight(1);
    next.play();
    if (previous && previous !== next && fade > 0) next.crossFadeFrom(previous, fade, false);
    else if (previous && previous !== next) previous.stop();
    this.active = next;
    this.onChange?.(name);
    return next;
  }

  update(deltaSeconds) {
    if (!this.paused) this.mixer.update(Math.min(deltaSeconds, 0.1) * this.speed);
  }

  seek(seconds) {
    if (!this.active) return;
    // Freeze outgoing fades while inspecting one exact pose.
    for (const action of this.actions.values()) if (action !== this.active) action.stop();
    this.active.stopFading();
    this.active.enabled = true;
    this.active.paused = false;
    this.active.setEffectiveWeight(1);
    this.active.time = THREE.MathUtils.clamp(seconds, 0, this.active.getClip().duration);
    this.mixer.update(0);
  }

  neutral() {
    this.mixer.stopAllAction();
    this.mixer.update(0);
    this.active = null;
    this.onChange?.(null);
  }

  dispose() {
    this.mixer.removeEventListener('finished', this._finished);
    this.mixer.stopAllAction();
  }
}
