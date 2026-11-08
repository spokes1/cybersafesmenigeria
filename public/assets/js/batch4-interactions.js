/* CyberSafe SME Nigeria — Batch 4, scoped to two original threat diagrams. */
(function () {
  'use strict';
  document.querySelectorAll('.pg-art .b4-primary-flow[data-cs-steps]').forEach(function (flow) {
    if (flow.dataset.b4Ready === 'true') return;
    var key = flow.getAttribute('data-cs-steps');
    if (key !== 'sim-swap' && key !== 'whatsapp') return;
    var controls = document.querySelector('[data-b4-controls="' + key + '"]');
    if (!controls || controls.parentElement !== flow.parentElement) return;
    var stages = Array.from(flow.querySelectorAll(':scope > .st'));
    var arrows = Array.from(flow.querySelectorAll(':scope > .ar'));
    var picks = Array.from(controls.querySelectorAll('[data-b4-index]'));
    var previous = controls.querySelector('[data-b4-prev]');
    var next = controls.querySelector('[data-b4-next]');
    var status = controls.querySelector('[data-b4-status]');
    if (stages.length !== 4 || picks.length !== 4 || !previous || !next || !status) return;
    flow.dataset.b4Ready = 'true';
    var active = 0;
    function choose(index) {
      active = Math.max(0, Math.min(index, stages.length - 1));
      stages.forEach(function (stage, i) {
        stage.classList.toggle('b4-active', i === active);
        if (i === active) stage.setAttribute('aria-current', 'step');
        else stage.removeAttribute('aria-current');
      });
      arrows.forEach(function (arrow, i) { arrow.classList.toggle('b4-connector-active', i === active - 1); });
      picks.forEach(function (pick, i) { pick.setAttribute('aria-pressed', String(i === active)); });
      status.textContent = 'Stage ' + (active + 1) + ' of 4';
      previous.disabled = active === 0;
      next.disabled = active === stages.length - 1;
    }
    picks.forEach(function (pick, i) {
      pick.addEventListener('click', function () { choose(i); });
    });
    previous.addEventListener('click', function () { choose(active - 1); });
    next.addEventListener('click', function () { choose(active + 1); });
    controls.hidden = false;
    choose(0);
  });
})();
