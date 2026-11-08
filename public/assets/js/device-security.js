/* Shared-computer walkthrough: selection is optional and text is fully visible without JavaScript. */
(() => {
  'use strict';
  const root = document.querySelector('[data-ds-inspector]');
  if (!root || root.dataset.dsInitialised === 'true') return;

  const buttons = [...root.querySelectorAll('[data-ds-choose]')];
  const items = [...root.querySelectorAll('[data-ds-check]')];
  const status = root.querySelector('[data-ds-current]');
  const names = buttons.map((button) => button.dataset.dsChoose);
  if (buttons.length !== 6 || items.length !== 6 || !status || new Set(names).size !== 6 ||
      items.some((item) => !names.includes(item.dataset.dsCheck))) return;

  function select(key, announce = true) {
    buttons.forEach((button) => button.setAttribute('aria-pressed', String(button.dataset.dsChoose === key)));
    items.forEach((item) => { item.hidden = item.dataset.dsCheck !== key; });
    const label = buttons.find((button) => button.dataset.dsChoose === key)?.textContent.trim().replace(/^\d+\s*/, '') || '';
    status.textContent = `${announce ? 'Showing' : 'Selected'}: ${label}. Choose another check to compare practical actions.`;
  }
  for (const button of buttons) button.addEventListener('click', () => select(button.dataset.dsChoose));
  select(names[0], false);
  root.dataset.dsInitialised = 'true';
  buttons.forEach((button) => { button.hidden = false; });
  status.hidden = false;
  root.classList.add('ds-enhanced');
})();
