/* Nigeria-first Tools directory: progressive enhancement, no data collection. */
(() => {
  const root = document.querySelector('[data-tr-needs]');
  if (!root || root.dataset.initialised === 'yes') return;
  root.dataset.initialised = 'yes';
  const controls = root.querySelector('.tr-need-controls');
  const buttons = [...root.querySelectorAll('[data-tr-choose]')];
  const cards = [...root.querySelectorAll('[data-tr-card]')];
  if (!controls || buttons.length !== 4 || cards.length !== 4) return;
  function choose(key, announce = false) {
    buttons.forEach(b => b.setAttribute('aria-pressed', String(b.dataset.trChoose === key)));
    cards.forEach(card => card.classList.toggle('is-selected', card.dataset.trCard === key));
    const feedback = root.querySelector('[data-tr-feedback]');
    if (feedback && announce) {
      const button = buttons.find(b => b.dataset.trChoose === key);
      feedback.textContent = button ? button.textContent.trim() + ' highlighted. Follow its Explore this category link for official resources.' : '';
    }
  }
  buttons.forEach(button => button.addEventListener('click', () => choose(button.dataset.trChoose, true)));
  root.classList.add('tr-enhanced');
  controls.hidden = false;
  choose('accounts');
})();
