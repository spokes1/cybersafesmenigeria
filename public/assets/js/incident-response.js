/* First-Response Switchboard. Progressive enhancement; all reference content is visible without scripting. */
(() => {
  'use strict';
  const board = document.querySelector('[data-ir-switchboard]');
  if (!board || board.dataset.irInitialised === 'true') return;
  const choices = [...board.querySelectorAll('[data-ir-choose]')];
  const panels = [...board.querySelectorAll('[data-ir-panel]')];
  const status = board.querySelector('[data-ir-status]');
  if (choices.length !== 4 || panels.length !== 4 || !status) return;
  const keys = choices.map((choice) => choice.dataset.irChoose);
  if (new Set(keys).size !== 4 || panels.some((panel) => !keys.includes(panel.dataset.irPanel))) return;
  const select = (key, announce = true) => {
    choices.forEach((button) => button.setAttribute('aria-pressed', String(button.dataset.irChoose === key)));
    panels.forEach((panel) => { panel.hidden = panel.dataset.irPanel !== key; });
    const label = choices.find((button) => button.dataset.irChoose === key)?.textContent.trim() || '';
    status.textContent = `${announce ? 'Showing' : 'Selected'} ${label.toLowerCase()} first-response guidance`;
  };
  choices.forEach((button) => button.addEventListener('click', () => select(button.dataset.irChoose)));
  // Only reveal controls after all listeners have been registered and a panel is selected.
  board.dataset.irInitialised = 'true';
  select('money', false);
  choices.forEach((button) => { button.hidden = false; });
  status.hidden = false;
  board.classList.add('ir-enhanced');

  const printButton = document.querySelector('[data-ir-print]');
  if (printButton && typeof window.print === 'function') {
    printButton.addEventListener('click', () => window.print());
    printButton.hidden = false;
  }
})();
