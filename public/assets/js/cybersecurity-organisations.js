/* Cybersecurity Organisations: an accessible, progressive incident-route selector.
   No information is requested, collected or sent. The static HTML contains all five cases. */
(() => {
  const root = document.querySelector('[data-org-selector]');
  if (!root || root.dataset.orgReady === 'true') return;
  const controls = root.querySelector('[data-org-choice-buttons]');
  const buttons = [...root.querySelectorAll('[data-org-choose]')];
  const panels = [...root.querySelectorAll('[data-org-case]')];
  if (!controls || buttons.length !== 5 || panels.length !== 5) return;
  const keys = new Set(panels.map((p) => p.dataset.orgCase));
  if (buttons.some((b) => !keys.has(b.dataset.orgChoose))) return;
  function select(key) {
    buttons.forEach((button) => {
      button.setAttribute('aria-pressed', String(button.dataset.orgChoose === key));
    });
    panels.forEach((panel) => {
      panel.hidden = panel.dataset.orgCase !== key;
    });
  }
  buttons.forEach((button) => {
    button.addEventListener('click', () => select(button.dataset.orgChoose));
  });
  select('payment');
  root.dataset.orgReady = 'true';
  controls.hidden = false;
})();
