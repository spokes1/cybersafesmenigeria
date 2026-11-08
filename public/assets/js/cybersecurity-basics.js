/* Your Digital Business Map: all five details are plain HTML when scripting is unavailable. */
(() => {
  'use strict';
  const root = document.querySelector('[data-cb-map]');
  if (!root || root.dataset.cbInitialised === 'true') return;
  const buttons = [...root.querySelectorAll('button[data-cb-area]')];
  const details = [...root.querySelectorAll('[data-cb-detail]')];
  const announcements = root.querySelector('[data-cb-map-announcement]');
  const keys = ['accounts', 'payments', 'information', 'devices', 'people'];
  if (buttons.length !== 5 || details.length !== 5 || !announcements ||
      keys.some(key => buttons.filter(button => button.dataset.cbArea === key).length !== 1 ||
                       details.filter(detail => detail.dataset.cbDetail === key).length !== 1)) return;

  function choose(key, announce = true) {
    buttons.forEach(button => {
      const selected = button.dataset.cbArea === key;
      button.setAttribute('aria-pressed', String(selected));
      button.querySelector('small').textContent = selected ? 'Selected area' : 'Explore area';
    });
    details.forEach(detail => { detail.hidden = detail.dataset.cbDetail !== key; });
    if (announce) {
      const title = buttons.find(button => button.dataset.cbArea === key).querySelector('span').textContent;
      announcements.textContent = `${title} selected. Why it matters, what to check first and a detailed guide link are shown below.`;
    }
  }
  buttons.forEach(button => { button.addEventListener('click', () => choose(button.dataset.cbArea)); });
  choose(keys[0], false);
  buttons.forEach(button => { button.hidden = false; });
  root.classList.add('cb-map-enhanced');
  root.dataset.cbInitialised = 'true';
})();
