/* Social Engineering: select one annotated moment, without hiding approved advice. */
(() => {
  'use strict';
  const root = document.querySelector('[data-se-call]');
  if (!root || root.dataset.seInitialised === 'true') return;
  const controls = root.querySelector('.se-call-controls');
  const buttons = [...root.querySelectorAll('button[data-se-pick]')];
  const moments = [...root.querySelectorAll('.se-moment[data-se-moment]')];
  if (!controls || buttons.length !== 3 || moments.length !== 3) return;

  const choose = (number) => {
    buttons.forEach((button) => button.setAttribute('aria-pressed', String(button.dataset.sePick === number)));
    moments.forEach((moment) => moment.classList.toggle('se-active', moment.dataset.seMoment === number));
  };
  buttons.forEach((button) => button.addEventListener('click', () => choose(button.dataset.sePick)));
  root.dataset.seInitialised = 'true';
  choose('1');
  controls.hidden = false;
})();
