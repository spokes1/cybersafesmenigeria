/* Shared, visitor-controlled examples. All approved advice stays readable without JS.
   Viewed means opened in this page only; no persistence, tracking or completion claim. */
(() => {
  'use strict';
  const SPECS = {
    responses: ['#already-clicked', '.b2-response-link', '[data-ph-response-panel]', 'href', 'data-ph-response-panel', '.ph-response-panel'],
    phishing: ['#worked-examples', '.b2-example-nav a', '.ph-example-card', 'href', 'id', '.b2-example-nav'],
    engineering: ['[data-se-call]', '[data-se-pick]', '[data-se-moment]', 'data-se-pick', 'data-se-moment', '.se-call-controls'],
    malware: ['[data-mw-desk]', '[data-mw-pick]', '[data-mw-signal]', 'data-mw-pick', 'data-mw-signal', '.mw-desk-controls'],
    bec: ['[data-bec-decision]', '[data-bec-choice]', '[data-bec-route]', 'data-bec-choice', 'data-bec-route', '.bec-dec-controls'],
    social: ['[data-sm-dual]', '[data-sm-select]', '[data-sm-panel]', 'data-sm-select', 'data-sm-panel', '.sm-switch'],
    tools: ['[data-tr-needs]', '[data-tr-choose]', '[data-tr-card]', 'data-tr-choose', 'data-tr-card', '.tr-need-controls'],
    basics: ['[data-cb-map]', '[data-cb-area]', '[data-cb-detail]', 'data-cb-area', 'data-cb-detail', '.cb-map-buttons'],
    device: ['[data-ds-inspector]', '[data-ds-choose]', '[data-ds-check]', 'data-ds-choose', 'data-ds-check', '.ds-inspect-buttons'],
    organisations: ['[data-org-selector]', '[data-org-choose]', '[data-org-case]', 'data-org-choose', 'data-org-case', '[data-org-choice-buttons]'],
    incident: ['[data-ir-switchboard]', '[data-ir-choose]', '[data-ir-panel]', 'data-ir-choose', 'data-ir-panel', '[data-ir-selector]'],
    whatsapp: ['[data-ws-desk]', '[data-ws-select]', '[data-ws-card]', 'data-ws-select', 'data-ws-card', '.ws-desk-controls'],
    ransomware: ['[data-rw-board]', '[data-rw-select]', '[data-rw-area]', 'data-rw-select', 'data-rw-area', null],
  };
  const clean = value => String(value || '').replace(/\s+/g, ' ').trim();
  function mount(name) {
    const spec = SPECS[name];
    if (!spec) return false;
    const [selector, chooseSelector, cardSelector, chooseAttr, cardAttr, controlsSelector] = spec;
    const root = document.querySelector(selector);
    if (!root || root.dataset.csRevealReady) return false;
    const choices = [...root.querySelectorAll(chooseSelector)];
    const cards = [...root.querySelectorAll(cardSelector)];
    const keyOf = el => clean(el.getAttribute(chooseAttr)).replace(/^#/, '');
    const keys = choices.map(keyOf);
    const items = cards.map(card => ({key:clean(card.getAttribute(cardAttr)), card,
      panel:name === 'ransomware' ? card.querySelector('.rw-board-content') : card}));
    // Fail open: a malformed group remains fully readable.
    if (choices.length < 2 || cards.length !== choices.length || new Set(keys).size !== keys.length ||
        items.some(item => !item.panel || !keys.includes(item.key)) || new Set(items.map(item=>item.key)).size !== keys.length) return false;
    const controls = controlsSelector && root.querySelector(controlsSelector);
    const note = document.createElement('p');
    note.className = 'cs-reveal-instruction';
    note.textContent = 'Select a topic to view its example or guidance. Open each topic to explore all the information.';
    const status = document.createElement('p');
    status.className = 'sr-only cs-reveal-status';status.setAttribute('role','status');status.setAttribute('aria-live','polite');status.setAttribute('aria-atomic','true');
    root.classList.add('cs-reveal-group');root.dataset.csRevealReady = 'true';
    if (controls) {controls.hidden = false;controls.before(note);} else root.prepend(note);
    root.append(status);
    // Replace old automatic-selection messages with the shared instruction.
    root.querySelectorAll('[data-tr-feedback],[data-cb-map-announcement],[data-ds-current],[data-ir-status],[data-ws-message],[data-rw-status]').forEach(el=>{el.hidden=true;});
    const labels = choices.map(choice => clean(choice.getAttribute('aria-label') || choice.querySelector('strong')?.textContent || choice.querySelector('span')?.textContent || choice.textContent).replace(/^Focus on /i,''));
    const viewed = new Set();
    const badges = choices.map((choice,i) => {
      const item = items.find(item => item.key === keys[i]);
      if (!item.panel.id) item.panel.id = `cs-example-${name}-${keys[i]}`;
      item.panel.classList.add('cs-reveal-panel');item.panel.hidden = true;
      if (!item.panel.hasAttribute('aria-label') && !item.panel.hasAttribute('aria-labelledby')) item.panel.setAttribute('aria-label',labels[i]);
      choice.hidden=false;choice.classList.add('cs-reveal-choice');choice.setAttribute('aria-controls',item.panel.id);choice.setAttribute('aria-expanded','false');
      if (choice.tagName === 'BUTTON') choice.setAttribute('aria-pressed','false');
      choice.removeAttribute('aria-current');choice.classList.remove('b2-chosen');
      choice.setAttribute('aria-label',labels[i]);
      const small = choice.querySelector('small');if (name==='basics' && small) small.textContent = 'Explore area';
      const badge = document.createElement('span');badge.className='cs-viewed';badge.textContent='Viewed';badge.hidden=true;badge.setAttribute('aria-hidden','true');choice.append(badge);return badge;
    });
    function show(key, announce = true) {
      const index = keys.indexOf(key);if(index < 0) return;
      viewed.add(key);
      choices.forEach((choice,i) => {
        const selected = keys[i] === key;
        choice.setAttribute('aria-expanded',String(selected));
        if (choice.tagName === 'BUTTON') choice.setAttribute('aria-pressed',String(selected));
        if (selected && choice.tagName === 'A') choice.setAttribute('aria-current','location');else choice.removeAttribute('aria-current');
        choice.classList.toggle('cs-choice-selected',selected);badges[i].hidden=!viewed.has(keys[i]);
        choice.setAttribute('aria-label',labels[i]+(viewed.has(keys[i])?' (viewed)':''));
        const small=choice.querySelector('small');if(name==='basics'&&small)small.textContent=selected?'Selected area':'Explore area';
      });
      items.forEach(item => {item.panel.hidden = item.key !== key;item.card.classList.toggle('cs-panel-selected',item.key===key);});
      if (announce) status.textContent = `${labels[index]} opened. Topics marked Viewed have been opened during this page visit.`;
    }
    const fromHash = () => {
      let hash;try{hash=decodeURIComponent(location.hash.slice(1));}catch{return;}
      const target=document.getElementById(hash);
      const item=items.find(item=>item.panel.id===hash || (target && item.panel.contains(target)));
      if(item)show(item.key,false);
    };
    choices.forEach((choice,i) => {
      choice.addEventListener('click',event => {
        event.preventDefault();show(keys[i]);
        const panel=items.find(item=>item.key===keys[i]).panel;
        if (choice.tagName==='A') history.replaceState(null,'',choice.getAttribute('href'));
      });
      choice.addEventListener('keydown',event => {
        if(event.key===' '&&choice.tagName==='A'){event.preventDefault();choice.click();return;}
        let next;
        if(event.key==='ArrowRight'||event.key==='ArrowDown')next=(i+1)%choices.length;
        if(event.key==='ArrowLeft'||event.key==='ArrowUp')next=(i+choices.length-1)%choices.length;
        if(event.key==='Home')next=0;if(event.key==='End')next=choices.length-1;
        if(next!==undefined){event.preventDefault();choices[next].focus();}
      });
    });
    window.addEventListener('hashchange',fromHash);fromHash();return true;
  }
  window.CyberSafeExamples = Object.freeze({mount});
  const init = () => Object.keys(SPECS).forEach(mount);
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
})();
