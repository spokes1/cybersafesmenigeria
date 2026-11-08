/** Social Media Security article-only comparison. Both paths remain visible without JS. */
(() => {
  'use strict';
  const container = document.querySelector('[data-sm-dual]');
  if (!container) return;
  const controls = container.querySelector('.sm-switch');
  const buttons = [...container.querySelectorAll('[data-sm-select]')];
  const panels = [...container.querySelectorAll('[data-sm-panel]')];
  if (!controls || buttons.length !== 2 || panels.length !== 2) return;
  function select(key) {
    buttons.forEach(button => button.setAttribute('aria-pressed', String(button.dataset.smSelect === key)));
    panels.forEach(panel => { panel.hidden = panel.dataset.smPanel !== key; });
  }
  for (const button of buttons) {
    button.addEventListener('click', () => select(button.dataset.smSelect));
  }
  controls.hidden = false;
  select('hijack');
})();
