/* Employee Security — isolated progressive enhancement for the approved Staff Security Journey. */
(() => {
  'use strict';
  const root = document.querySelector('.pg-art [data-es-journey]');
  if (!root || root.dataset.esReady === 'true') return;
  const stages = Array.from(root.querySelectorAll('.es-journey-stages > li'));
  const controls = root.querySelector('.es-journey-controls');
  if (!controls || stages.length !== 4) return;
  const picks = Array.from(controls.querySelectorAll('[data-es-choice]'));
  const previous = controls.querySelector('[data-es-previous]');
  const next = controls.querySelector('[data-es-next]');
  const status = controls.querySelector('[data-es-status]');
  if (picks.length !== 4 || !previous || !next || !status) return;
  root.dataset.esReady = 'true';
  let active = 0;
  function select(index) {
    active = Math.max(0, Math.min(index, stages.length - 1));
    stages.forEach((stage, i) => {
      stage.classList.toggle('es-active', i === active);
      if (i === active) stage.setAttribute('aria-current', 'step');
      else stage.removeAttribute('aria-current');
    });
    picks.forEach((button, i) => button.setAttribute('aria-pressed', String(i === active)));
    status.textContent = `Stage ${active + 1} of 4: ${stages[active].querySelector('h3')?.textContent || ''}`;
    previous.disabled = active === 0;
    next.disabled = active === stages.length - 1;
  }
  picks.forEach((button, i) => button.addEventListener('click', () => select(i)));
  previous.addEventListener('click', () => select(active - 1));
  next.addEventListener('click', () => select(active + 1));
  controls.hidden = false;
  select(0);
})();
