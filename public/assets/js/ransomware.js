/* Ransomware Business Continuity Board: user-controlled spotlight, static if JS is absent. */
(() => {
  'use strict';
  const board = document.querySelector('[data-rw-board]');
  if (!board || board.dataset.rwInitialised === 'true') return;
  const cards = [...board.querySelectorAll('[data-rw-area]')];
  const buttons = [...board.querySelectorAll('[data-rw-select]')];
  const status = board.querySelector('[data-rw-status]');
  if (cards.length !== 4 || buttons.length !== 4 || !status) return;
  const select = (key, announce = true) => {
    cards.forEach((card) => card.classList.toggle('rw-selected', card.dataset.rwArea === key));
    buttons.forEach((button) => button.setAttribute('aria-pressed', String(button.dataset.rwSelect === key)));
    const card = cards.find((c) => c.dataset.rwArea === key);
    const title = card?.querySelector('h3')?.textContent.trim() || key;
    status.textContent = announce ? `Focused on ${title}` : `Current focus: ${title}`;
  };
  buttons.forEach((button) => button.addEventListener('click', () => select(button.dataset.rwSelect)));
  board.dataset.rwInitialised = 'true';
  board.classList.add('rw-enhanced');
  select('orders', false);
})();
