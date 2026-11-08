/* WhatsApp Business Desk: no scripting required to read all three cards. */
(() => {
  'use strict';
  const desk = document.querySelector('[data-ws-desk]');
  if (!desk || desk.dataset.wsReady === 'true') return;
  const controls = desk.querySelector('.ws-desk-controls');
  const buttons = [...desk.querySelectorAll('[data-ws-select]')];
  const cards = [...desk.querySelectorAll('[data-ws-card]')];
  const note = desk.querySelector('[data-ws-message]');
  const stages = ['open', 'serve', 'close'];
  if (!controls || !note || buttons.length !== 3 || cards.length !== 3 || stages.some(stage => buttons.filter(x => x.dataset.wsSelect === stage).length !== 1 || cards.filter(x => x.dataset.wsCard === stage).length !== 1)) return;
  const select = (stage, announce = true) => {
    buttons.forEach(button => button.setAttribute('aria-pressed', String(button.dataset.wsSelect === stage)));
    cards.forEach(card => { card.dataset.wsActive = card.dataset.wsCard === stage ? 'true' : 'false'; });
    if (announce) note.textContent = `${stage.toUpperCase()} selected. Its daily security actions are highlighted. All three sets of actions remain visible.`;
  };
  buttons.forEach(button => button.addEventListener('click', () => select(button.dataset.wsSelect)));
  select('open', false);
  controls.hidden = false;
  desk.dataset.wsReady = 'true';
})();
