/* BEC invoice verification: opt-in emphasis, no hidden content or automatic animation. */
(() => {
  const root = document.querySelector('[data-bec-decision]');
  if (!root || root.dataset.becInitialised === 'true') return;
  const controls = root.querySelector('.bec-dec-controls');
  const buttons = [...root.querySelectorAll('button[data-bec-choice]')];
  const paths = [...root.querySelectorAll('[data-bec-route]')];
  if (!controls || buttons.length !== 2 || paths.length !== 2) return;
  root.dataset.becInitialised = 'true';
  const choose = (route) => {
    buttons.forEach((button) => {
      button.setAttribute('aria-pressed', String(button.dataset.becChoice === route));
    });
    paths.forEach((path) => {
      path.classList.toggle('bec-active', path.dataset.becRoute === route);
    });
  };
  buttons.forEach((button) => {
    button.addEventListener('click', () => choose(button.dataset.becChoice));
  });
  controls.hidden = false;
})();
