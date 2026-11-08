/** Batch 2 progressive article navigation. No autoplay or external dependency.
 * Existing responses/examples remain in the DOM; original email paths are complete without JS.
 * Batch 1 and Social Media Security are intentionally not modified.
 */
(() => {
  'use strict';
  const all = (root, selector) => Array.from(root.querySelectorAll(selector));
  const makeButton = (text, cls) => {
    const b = document.createElement('button');
    b.type = 'button'; b.className = cls; b.textContent = text;
    return b;
  };

  // Threat: native links navigate to the full, unchanged response; JS only marks the choice.
  const threat = document.querySelector('.ph-hero-threat');
  const response = threat && document.getElementById('already-clicked');
  if (response && !response.dataset.b2Initialised) {
    response.dataset.b2Initialised = 'true';
    const links = all(response, '.b2-response-link');
    function markResponse() {
      const hash = decodeURIComponent(location.hash || '');
      links.forEach(link => {
        const current = hash === link.getAttribute('href');
        link.classList.toggle('b2-chosen', current);
        if (current) link.setAttribute('aria-current','location');
        else link.removeAttribute('aria-current');
      });
    }
    window.addEventListener('hashchange', markResponse);
    links.forEach(link => link.addEventListener('click', () => {
      // Native anchor handles scrolling and focus; mark selection immediately.
      links.forEach(other => {
        other.classList.toggle('b2-chosen', other === link);
        if (other === link) other.setAttribute('aria-current','location');
        else other.removeAttribute('aria-current');
      });
    }));
    markResponse();
  }

  // Learn guide: direct deep links, visible complete examples and warning/safe cues.
  const guide = document.querySelector('.ph-hero-guide');
  const examples = guide && document.getElementById('worked-examples');
  if (examples && !examples.dataset.b2Initialised) {
    examples.dataset.b2Initialised = 'true';
    const links = all(examples, '.b2-example-nav a');
    const cards = all(examples, '.ph-example-card');
    function markExample() {
      const hash = decodeURIComponent(location.hash || '');
      links.forEach(link => {
        const selected = link.getAttribute('href') === hash;
        link.classList.toggle('b2-chosen', selected);
        if (selected) link.setAttribute('aria-current','location');
        else link.removeAttribute('aria-current');
      });
      cards.forEach(card => card.classList.toggle('b2-selected', '#'+card.id === hash));
    }
    window.addEventListener('hashchange', markExample);
    links.forEach(link => link.addEventListener('click', () => {
      links.forEach(other => {
        const chosen = other === link;
        other.classList.toggle('b2-chosen', chosen);
        if (chosen) other.setAttribute('aria-current','location');
        else other.removeAttribute('aria-current');
      });
      cards.forEach(card => card.classList.toggle('b2-selected', '#'+card.id === link.getAttribute('href')));
    }));
    markExample();
  }

  // Email: retain both lanes, spotlight one and optionally inspect individual existing nodes.
  const figure = document.querySelector('.em-forward-visual[data-b2-email]');
  if (figure && !figure.dataset.b2Initialised) {
    const grid = figure.querySelector('.em-forward-grid');
    const lanes = grid && all(grid, '.em-flow-lane');
    if (lanes && lanes.length === 2) {
      const steps = lanes.map(lane => all(lane, 'ol > li'));
      if (steps[0].length === 2 && steps[1].length === 3) {
        figure.dataset.b2Initialised = 'true';
        figure.classList.add('b2-enabled');
        let laneIndex = 0;
        const selectedSteps = [0,0];
        const picker = document.createElement('div');
        picker.className = 'b2-email-picker';
        picker.setAttribute('role','group');
        picker.setAttribute('aria-label','Compare email delivery routes');
        const names = ['Normal delivery', 'Suspicious forwarding'];
        const choices = names.map((name,i) => {
          const button = makeButton(name,'b2-email-choice');
          button.setAttribute('aria-label','Spotlight '+name.toLowerCase());
          button.addEventListener('click', () => show(i));
          picker.append(button);
          return button;
        });
        grid.before(picker);
        const stepButtons = steps.map((items,i) => items.map((item,j) => {
          const label = item.textContent.trim();
          const button = makeButton('', 'b2-email-node');
          button.append(...Array.from(item.childNodes));
          button.setAttribute('aria-label', `${names[i]}, step ${j+1}: ${label}`);
          button.addEventListener('click', () => {selectedSteps[i]=j;show(i);});
          item.append(button);
          return button;
        }));
        const controls = document.createElement('div');
        controls.className = 'b2-email-stepper';
        controls.setAttribute('role','group');
        controls.setAttribute('aria-label','Inspect selected email route step');
        const prev = makeButton('Previous', 'b2-email-nav');
        const next = makeButton('Next', 'b2-email-nav');
        const status = document.createElement('span');
        status.className = 'b2-email-status';
        status.setAttribute('role','status');
        status.setAttribute('aria-live','polite');
        controls.append(prev,status,next);
        grid.after(controls);
        function move(delta) {
          selectedSteps[laneIndex] = Math.max(0,Math.min(steps[laneIndex].length-1,selectedSteps[laneIndex]+delta));
          show(laneIndex);
        }
        prev.addEventListener('click', () => move(-1));
        next.addEventListener('click', () => move(1));
        function show(index) {
          laneIndex = index;
          choices.forEach((button,i) => button.setAttribute('aria-pressed',String(i === index)));
          lanes.forEach((lane,i) => lane.classList.toggle('b2-spotlight',i === index));
          steps.forEach((group,i) => group.forEach((item,j) => item.classList.toggle('b2-current-step', i === index && j === selectedSteps[i])));
          stepButtons.forEach((group,i) => group.forEach((button,j) => button.setAttribute('aria-pressed',String(i === index && j === selectedSteps[i]))));
          status.textContent = `${names[index]}, step ${selectedSteps[index]+1} of ${steps[index].length}`;
          prev.disabled = selectedSteps[index] === 0;
          next.disabled = selectedSteps[index] === steps[index].length-1;
        }
        show(0);
      }
    }
  }
})();
