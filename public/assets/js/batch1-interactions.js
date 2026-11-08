/** Batch 1: scoped, progressive enhancements for three approved article diagrams.
 * All original steps are present in HTML; UI controls are created only when JS runs.
 * No autoplay, interval, external dependency, or data collection.
 */
(() => {
  'use strict';

  function all(root, selector) { return [...root.querySelectorAll(selector)]; }
  function button(text, className) {
    const b = document.createElement('button');
    b.type = 'button';
    b.textContent = text;
    b.className = className;
    return b;
  }
  function makeStepper(root, title, items, setActive, currentStep) {
    const controls = document.createElement('div');
    controls.className = 'b1-step-controls';
    controls.setAttribute('role', 'group');
    controls.setAttribute('aria-label', title + ' steps');
    const previous = button('Previous', 'b1-nav');
    const next = button('Next', 'b1-nav');
    const status = document.createElement('span');
    status.className = 'b1-step-status';
    status.setAttribute('role', 'status');
    status.setAttribute('aria-live', 'polite');
    controls.append(previous, status, next);
    previous.addEventListener('click', () => setActive(Math.max(0, currentStep() - 1)));
    next.addEventListener('click', () => setActive(Math.min(items.length - 1, currentStep() + 1)));
    root.append(controls);
    return (index) => {
      status.textContent = 'Step ' + (index + 1) + ' of ' + items.length;
      previous.disabled = index === 0;
      next.disabled = index === items.length - 1;
    };
  }
  function enhanceSteps(elements, className, clickHandler) {
    return elements.map((element, index) => {
      // Keep the source HTML semantic and static for non-JS readers.
      const hit = button('', className);
      hit.replaceChildren(...[...element.childNodes]);
      const spoken = [...hit.children].filter(child => child.getAttribute('aria-hidden') !== 'true').map(child => child.textContent.trim()).filter(Boolean).join('. ');
      hit.setAttribute('aria-label', 'Step ' + (index + 1) + ': ' + spoken);
      hit.addEventListener('click', () => clickHandler(index));
      element.append(hit);
      return hit;
    });
  }

  // Fake Bank Alerts: highlight exactly one of the existing three nodes.
  const fake = document.querySelector('[data-b1-fake]');
  if (fake && !fake.dataset.b1Initialised) {
    const nodes = all(fake, '.st');
    if (nodes.length === 3) {
      fake.dataset.b1Initialised = 'true';
      let active = 0;
      let updateControls = () => {};
      const hits = nodes.map((node, index) => {
        const hit = button('', node.className + ' b1-fake-node');
        hit.innerHTML = node.innerHTML;
        const iconBox = hit.querySelector('.ci');
        if (iconBox) { const span = document.createElement('span'); span.className = iconBox.className; span.innerHTML = iconBox.innerHTML; iconBox.replaceWith(span); }
        hit.setAttribute('aria-label', 'Step ' + (index + 1) + ': ' + node.textContent.trim());
        hit.addEventListener('click', () => select(index));
        node.replaceWith(hit);
        return hit;
      });
      function select(index) {
        active = index;
        hits.forEach((hit, i) => {
          hit.classList.toggle('b1-active', i === index);
          hit.setAttribute('aria-pressed', String(i === index));
        });
        all(fake, '.ar').forEach((arrow, i) => arrow.classList.toggle('b1-link-active', i === index - 1));
        updateControls(index);
      }
      updateControls = makeStepper(fake.parentElement, 'Payment confirmation', hits, select, () => active);
      select(0);
    }
  }

  // Payment Security: both lanes remain visible, with one spotlight and one active step.
  const money = document.querySelector('[data-b1-money]');
  if (money && !money.dataset.b1Initialised) {
    const lanes = all(money, '.money-map-lane');
    if (lanes.length === 2) {
      money.dataset.b1Initialised = 'true';
      money.classList.add('b1-enhanced');
      let selected = 0;
      const stepIndexes = [0, 0];
      const selector = document.createElement('div');
      selector.className = 'b1-money-select';
      selector.setAttribute('role', 'group');
      selector.setAttribute('aria-label', 'Spotlight a payment process');
      const choice = ['Money coming in', 'Money going out'].map((label, index) => {
        const b = button(label, 'b1-choice');
        b.setAttribute('aria-controls', index === 0 ? 'money-in-lane' : 'money-out-lane');
        b.addEventListener('click', () => selectLane(index));
        selector.append(b);
        return b;
      });
      const grid = money.querySelector('.money-map-grid');
      grid.before(selector);
      const stepHits = lanes.map((lane, laneIndex) => {
        const steps = all(lane, '.money-map-path > li');
        return enhanceSteps(steps, 'b1-money-step', (index) => {
          stepIndexes[laneIndex] = index;
          selectLane(laneIndex);
        });
      });
      const footer = document.createElement('div');
      footer.className = 'b1-step-controls';
      footer.setAttribute('role', 'group');
      footer.setAttribute('aria-label', 'Selected payment process step');
      const prev = button('Previous', 'b1-nav');
      const next = button('Next', 'b1-nav');
      const status = document.createElement('span');
      status.className = 'b1-step-status';
      status.setAttribute('role', 'status');
      status.setAttribute('aria-live', 'polite');
      prev.addEventListener('click', () => changeStep(-1));
      next.addEventListener('click', () => changeStep(1));
      footer.append(prev, status, next);
      grid.after(footer);
      function changeStep(delta) {
        const n = stepIndexes[selected] + delta;
        stepIndexes[selected] = Math.max(0, Math.min(3, n));
        selectLane(selected);
      }
      function selectLane(index) {
        selected = index;
        choice.forEach((b, i) => b.setAttribute('aria-pressed', String(i === index)));
        lanes.forEach((lane, laneIndex) => {
          lane.classList.toggle('b1-lane-selected', laneIndex === index);
          all(lane, '.money-map-path > li').forEach((li, i) => li.classList.toggle('b1-active', i === stepIndexes[laneIndex] && laneIndex === index));
          stepHits[laneIndex].forEach((b, i) => b.setAttribute('aria-pressed', String(i === stepIndexes[laneIndex] && laneIndex === index)));
        });
        status.textContent = (index === 0 ? 'Money coming in' : 'Money going out') + ': step ' + (stepIndexes[index] + 1) + ' of 4';
        prev.disabled = stepIndexes[index] === 0;
        next.disabled = stepIndexes[index] === 3;
      }
      selectLane(0);
    }
  }

  // Mobile Security quick setup: mobile-only switch; desktop retains two columns.
  const quick = document.querySelector('[data-b1-mobile-platform]');
  if (quick && !quick.dataset.b1Initialised) {
    const controls = quick.querySelector('.b1-platform-controls');
    const status = quick.querySelector('.b1-platform-status');
    const deviceButtons = all(controls, '[data-b1-device]');
    const media = window.matchMedia('(max-width: 640px)');
    if (deviceButtons.length === 2) {
      quick.dataset.b1Initialised = 'true';
      let device = 'ios';
      function showDevice(value) {
        device = value;
        quick.dataset.b1SelectedDevice = device;
        deviceButtons.forEach(b => b.setAttribute('aria-pressed', String(b.dataset.b1Device === device)));
        status.textContent = 'Showing five ' + (device === 'ios' ? 'iPhone (iOS)' : 'Android') + ' settings. Full instructions for both devices follow below.';
      }
      function updateLayout() {
        const mobile = media.matches;
        quick.classList.toggle('b1-mobile-mode', mobile);
        controls.hidden = !mobile;
        status.hidden = !mobile;
        showDevice(device);
      }
      deviceButtons.forEach(b => b.addEventListener('click', () => showDevice(b.dataset.b1Device)));
      if (media.addEventListener) media.addEventListener('change', updateLayout);
      else if (media.addListener) media.addListener(updateLayout);
      updateLayout();
    }
  }

  // Missing-phone flow: user-controlled emphasis, safety notes and links stay visible.
  const lost = document.querySelector('[data-b1-lost]');
  if (lost && !lost.dataset.b1Initialised) {
    const steps = all(lost, ':scope > ol > li');
    if (steps.length === 6) {
      lost.dataset.b1Initialised = 'true';
      let active = 0;
      let updateControls = () => {};
      const hits = enhanceSteps(steps, 'b1-lost-step', select);
      function select(index) {
        active = index;
        steps.forEach((li, i) => li.classList.toggle('b1-active', i === index));
        hits.forEach((hit, i) => hit.setAttribute('aria-pressed', String(i === index)));
        updateControls(index);
      }
      const actions = lost.querySelector('.ms-device-actions');
      const anchor = document.createElement('div');
      actions.before(anchor);
      updateControls = makeStepper(anchor, 'Lost business phone response', hits, select, () => active);
      select(0);
    }
  }
})();
