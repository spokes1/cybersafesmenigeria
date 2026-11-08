/* CyberSafe SME Nigeria, Batch 3. Page-scoped progressive enhancements only. */
(function () {
  'use strict';
  const find = (root, sel) => root.querySelector(sel);
  const many = (root, sel) => Array.from(root.querySelectorAll(sel));

  const map = document.querySelector('[data-b3-map]');
  if (map && !map.dataset.b3Ready) {
    const controls = find(map, '.b3-map-controls');
    if (controls && many(map, '.ac-map-card').length === 3 && find(map, '.ac-map-check')) {
      map.dataset.b3Ready = 'true';
      controls.hidden = false;
      const choices = many(controls, '[data-b3-map-choice]');
      function choose(kind) {
        map.dataset.b3Focus = kind;
        choices.forEach(choice => choice.setAttribute('aria-pressed', String(choice.dataset.b3MapChoice === kind)));
      }
      choices.forEach(choice => choice.addEventListener('click', () => choose(choice.dataset.b3MapChoice)));
      choose('person');
    }
  }

  many(document, '[data-b3-step-flow]').forEach(flow => {
    if (flow.dataset.b3Ready) return;
    const identity = flow.dataset.b3StepFlow;
    const stageSelector = identity === 'exit' ? ':scope > li' : ':scope > .st';
    const stages = many(flow, stageSelector);
    const controls = flow.parentElement && find(flow.parentElement, `[data-b3-step-controls="${identity}"]`);
    if (!controls || stages.length !== 4) return;
    const picks = many(controls, '[data-b3-pick]');
    const prev = find(controls, '[data-b3-prev]');
    const next = find(controls, '[data-b3-next]');
    if (picks.length !== stages.length || !prev || !next) return;
    flow.dataset.b3Ready = 'true';
    controls.hidden = false;
    let active = 0;
    function choose(i) {
      active = Math.max(0, Math.min(i, stages.length - 1));
      stages.forEach((stage, n) => {
        stage.classList.toggle('b3-stage-active', n === active);
        if (n === active) stage.setAttribute('aria-current', 'step');
        else stage.removeAttribute('aria-current');
      });
      picks.forEach((pick, n) => pick.setAttribute('aria-pressed', String(n === active)));
      prev.disabled = active === 0;
      next.disabled = active === stages.length - 1;
    }
    picks.forEach((pick, i) => pick.addEventListener('click', () => choose(i)));
    prev.addEventListener('click', () => choose(active - 1));
    next.addEventListener('click', () => choose(active + 1));
    choose(0);
  });

  const wifi = document.querySelector('[data-b3-wifi-hero]');
  if (wifi && !wifi.dataset.b3Ready) {
    const controls = find(wifi, '.b3-wifi-controls');
    const svg = find(wifi, '#b3-wifi-graphic');
    if (controls && svg && many(svg, '[data-b3-wifi-side]').length === 2) {
      wifi.dataset.b3Ready = 'true';
      controls.hidden = false;
      const choices = many(controls, '[data-b3-wifi-choice]');
      function choose(side) {
        wifi.dataset.b3WifiFocus = side;
        choices.forEach(choice => choice.setAttribute('aria-pressed', String(choice.dataset.b3WifiChoice === side)));
      }
      choices.forEach(choice => choice.addEventListener('click', () => choose(choice.dataset.b3WifiChoice)));
      choose('business');
    }
  }
})();
