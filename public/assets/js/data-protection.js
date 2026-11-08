/* Data Protection: progressive enhancement for the Customer Data Journey only. */
(() => {
  'use strict';
  const root = document.querySelector('.pg-art [data-dp-journey]');
  if (!root || root.dataset.dpReady === 'true') return;
  const stages = Array.from(root.querySelectorAll('.dp-journey-stages > li'));
  const controls = root.querySelector('.dp-journey-controls');
  if (!controls || stages.length !== 5) return;
  const picks = Array.from(controls.querySelectorAll('[data-dp-choice]'));
  const previous = controls.querySelector('[data-dp-prev]');
  const next = controls.querySelector('[data-dp-next]');
  const status = controls.querySelector('[data-dp-status]');
  if (picks.length !== 5 || !previous || !next || !status) return;
  root.dataset.dpReady = 'true';
  let selected = 0;
  function select(index) {
    selected = Math.max(0, Math.min(index, stages.length - 1));
    stages.forEach((stage, i) => {
      stage.classList.toggle('dp-active', i === selected);
      if (i === selected) stage.setAttribute('aria-current', 'step');
      else stage.removeAttribute('aria-current');
    });
    picks.forEach((button, i) => button.setAttribute('aria-pressed', String(i === selected)));
    status.textContent = `Stage ${selected + 1} of 5: ${stages[selected].querySelector('h3')?.textContent || ''}`;
    previous.disabled = selected === 0;
    next.disabled = selected === stages.length - 1;
  }
  picks.forEach((button, i) => button.addEventListener('click', () => select(i)));
  previous.addEventListener('click', () => select(selected - 1));
  next.addEventListener('click', () => select(selected + 1));
  controls.hidden = false;
  select(0);
})();
