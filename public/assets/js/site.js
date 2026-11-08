/* ============================================================
   CyberSafe SME Nigeria — site behaviour (one file, every page).
   Progressive: every page is fully readable with this file absent.
   ============================================================ */
(function () {
  'use strict';

  document.documentElement.classList.add('js');

  var $ = function (sel, root) { return (root || document).querySelector(sel); };
  var $$ = function (sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); };

  function esc(s) {
    return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/"/g, '&quot;');
  }

  /* ---------- Mobile menu ---------- */
  var burger = $('#bg');
  var mnav = $('#mnav');
  function setMenu(open) {
    if (!burger || !mnav) return;
    mnav.classList.toggle('open', open);
    burger.setAttribute('aria-expanded', String(open));
    burger.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
  }
  if (burger && mnav) {
    burger.addEventListener('click', function () { setMenu(!mnav.classList.contains('open')); });
    window.addEventListener('resize', function () { if (window.innerWidth > 1120) setMenu(false); });
  }

  /* ---------- Site-wide search (one local static index, no query transmission) ---------- */
  var sr = $('#sr');
  var q = $('#q');
  var sb = $('#sb');
  var status = $('#sr-status');
  var IDX = null;
  var loading = null;
  var loadFailed = false;
  var cur = 0;
  var res = [];
  var lastFocus = null;
  var announceTimer = null;
  var CH = ['Fake bank alert', 'WhatsApp hacked', 'Report fraud', 'Lost phone'];
  var STOP = { what:1, is:1, are:1, how:1, do:1, i:1, my:1, the:1, a:1, an:1, for:1, to:1, of:1, with:1, can:1, your:1, our:1, we:1, should:1, on:1, in:1, it:1, about:1, tips:1, advice:1 };
  var SYN = {
    scammed: 'fraud', otp: 'verification code',
    '2fa': 'two factor authentication', wifi: 'router wireless',
    virus: 'malware', staff: 'employee', pos: 'payment sale',
    invoice: 'supplier payment', lost: 'missing stolen', restore: 'backup recovery',
    phone: 'mobile', fraud: 'scam', signin: 'login', hacked: 'compromised takeover',
    locked: 'ransomware', screenshot: 'receipt payment', customer: 'client'
  };

  function norm(value) {
    return String(value || '').toLowerCase().normalize('NFKD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/\bwi[\s-]?fi\b/g, 'wifi')
      .replace(/\btwo[\s-]?factor\b/g, '2fa')
      .replace(/\b2[\s-]?factor\b/g, '2fa')
      .replace(/\bone[\s-]?time\b/g, 'otp')
      .replace(/&/g, ' and ').replace(/[^a-z0-9]+/g, ' ').trim().replace(/\s+/g, ' ');
  }

  function validRoute(route) {
    return typeof route === 'string' && /^\/(?:[a-z0-9]+(?:-[a-z0-9]+)*\/)*[a-z0-9]+(?:-[a-z0-9]+)*$/.test(route) || route === '/';
  }

  function prepare(rows) {
    if (!Array.isArray(rows)) throw new Error('Invalid search index');
    return rows.filter(function (row) {
      return row && typeof row.title === 'string' && validRoute(row.url) && typeof row.section === 'string';
    }).map(function (row, i) {
      var section = row.section === 'Protect' || row.section === 'Protect Your Business' ? 'Protect'
        : row.section === 'Threats' ? 'Threats' : row.section === 'Resources' ? 'Resources' : 'Learn';
      return {
        title: row.title, summary: String(row.summary || ''), url: row.url, section: section,
        idx: i, t: norm(row.title), k: norm(row.keywords), s: norm(row.summary),
        primary: (row.primaryPhrases || []).map(norm), secondary: (row.secondaryPhrases || []).map(norm)
      };
    });
  }

  function load() {
    if (IDX) return Promise.resolve(IDX);
    if (loading) return loading;
    loadFailed = false;
    loading = fetch('/assets/search-index.json')
      .then(function (response) { if (!response.ok) throw new Error('Index not available'); return response.json(); })
      .then(function (rows) { IDX = prepare(rows); if (!IDX.length) throw new Error('Empty index'); return IDX; })
      .catch(function () { loadFailed = true; IDX = null; return null; })
      .then(function (rows) { loading = null; if (isOpen()) render(); return rows; });
    return loading;
  }

  function baseScore(row, tokens, query) {
    var score = 0, hits = 0;
    tokens.forEach(function (token) {
      var terms = [token].concat((SYN[token] || '').split(' ').filter(Boolean));
      var best = 0;
      terms.forEach(function (term, index) {
        var weight = index ? 0.55 : 1;
        var p = 0;
        if (row.t === term) p = 42;
        else if (row.t.indexOf(term) === 0) p = 28;
        else if (term.length > 1 && row.t.indexOf(term) > -1) p = 20;
        else if (term.length > 1 && (' ' + row.k + ' ').indexOf(' ' + term + ' ') > -1) p = 12;
        else if (term.length > 1 && row.k.indexOf(term) > -1) p = 7;
        else if (term.length > 1 && row.s.indexOf(term) > -1) p = 4;
        best = Math.max(best, p * weight);
      });
      if (best) { score += best; hits++; }
    });
    if (hits < Math.ceil(tokens.length * 0.6)) return 0;
    if (hits === tokens.length) score += 12;
    if (row.t === query) score += 50;
    return score;
  }

  function rank(query) {
    var value = norm(query);
    if (!value || !IDX) return [];
    var tokens = value.split(' ').filter(function (token) { return !STOP[token]; });
    if (!tokens.length) tokens = value.split(' ');
    return IDX.map(function (row) {
      var score = baseScore(row, tokens, value);
      // Exact approved intent aliases outrank broad keyword matches.
      if (row.primary.indexOf(value) > -1) score = 3000;
      else if (row.secondary.indexOf(value) > -1) score = 1500;
      return { row: row, score: score };
    }).filter(function (item) { return item.score > 0; })
      .sort(function (a, b) { return b.score - a.score || a.row.idx - b.row.idx; })
      .slice(0, 6).map(function (item) { return item.row; });
  }

  function announce(value) {
    if (!status) return;
    clearTimeout(announceTimer);
    announceTimer = setTimeout(function () { status.textContent = value; }, 220);
  }

  function chips() {
    return '<div class="sl">Popular searches</div><div class="chips">' + CH.map(function (phrase) {
      return '<button type="button" data-query="' + esc(phrase) + '">' + esc(phrase) + '</button>';
    }).join('') + '</div>';
  }

  function render() {
    if (!q || !sb) return;
    var value = norm(q.value);
    if (!value) {
      res = []; cur = 0;
      sb.innerHTML = chips();
      announce('');
      return;
    }
    if (!IDX) {
      res = [];
      sb.innerHTML = loadFailed
        ? '<p class="search-message">Search is unavailable right now. Please try again.</p><button type="button" class="search-retry">Retry search</button>'
        : '<p class="search-message">Searching…</p>';
      announce(loadFailed ? 'Search unavailable. Retry available.' : 'Searching');
      return;
    }
    res = rank(value); cur = 0;
    sb.innerHTML = res.length
      ? '<nav class="rs" aria-label="Search results"><ul>' + res.map(function (row, i) {
          return '<li><a href="' + esc(row.url) + '" class="' + (i === 0 ? 'on' : '') + '"><span class="search-result-copy"><b>'
            + esc(row.title) + '</b><small>' + esc(row.summary) + '</small></span><em>' + esc(row.section) + '</em></a></li>';
        }).join('') + '</ul></nav>'
      : '<p class="search-message">No matching pages. Try a different phrase.</p>';
    announce(res.length ? res.length + (res.length === 1 ? ' result' : ' results') : 'No matching pages');
  }

  function mark() {
    $$('.rs a', sb).forEach(function (link, i) {
      link.classList.toggle('on', i === cur);
    });
    var link = $$('.rs a', sb)[cur];
    if (link) {
      link.scrollIntoView({ block: 'nearest' });
      announce('Selected: ' + res[cur].title);
    }
  }

  function isOpen() { return !!(sr && sr.classList.contains('open')); }

  function openSearch() {
    if (!sr || isOpen()) return;
    lastFocus = document.activeElement;
    setMenu(false);
    sr.classList.add('open');
    sr.setAttribute('aria-hidden', 'false');
    document.body.classList.add('no-scroll');
    q.value = '';
    render();
    q.focus();
    // Load the local index once. No visitor query is transmitted.
    load();
  }

  function closeSearch() {
    if (!isOpen()) return;
    sr.classList.remove('open');
    sr.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('no-scroll');
    clearTimeout(announceTimer);
    if (status) status.textContent = '';
    if (lastFocus && lastFocus.focus) lastFocus.focus();
  }

  if (sr && q && sb) {
    $$('[data-search]').forEach(function (button) { button.addEventListener('click', openSearch); });
    $('#sx').addEventListener('click', closeSearch);
    sr.addEventListener('click', function (event) { if (event.target === sr) closeSearch(); });
    sb.addEventListener('click', function (event) {
      var chip = event.target.closest('[data-query]');
      if (chip) { q.value = chip.getAttribute('data-query'); render(); q.focus(); return; }
      if (event.target.closest('.search-retry')) { loadFailed = false; render(); load(); }
    });
    q.addEventListener('input', function () { render(); if (!IDX && !loading && !loadFailed) load(); });
  }

  document.addEventListener('keydown', function (event) {
    var tag = (event.target.tagName || '').toLowerCase();
    var typing = tag === 'input' || tag === 'textarea' || tag === 'select' || event.target.isContentEditable;
    var commandK = (event.ctrlKey || event.metaKey) && (event.key || '').toLowerCase() === 'k';
    var slash = event.key === '/' && !event.ctrlKey && !event.metaKey && !event.altKey;
    if ((slash || commandK) && (!typing || event.target === q) && !event.altKey) {
      event.preventDefault();
      if (isOpen()) q.focus(); else openSearch();
      return;
    }
    if (event.key === 'Escape' && mnav && mnav.classList.contains('open') && !isOpen()) {
      setMenu(false); burger.focus(); return;
    }
    if (!isOpen()) return;
    if (event.key === 'Escape') { event.preventDefault(); closeSearch(); return; }
    if ((event.key === 'ArrowDown' || event.key === 'ArrowUp') && res.length &&
        (event.target === q || event.target.closest('.rs'))) {
      event.preventDefault();
      cur = (cur + (event.key === 'ArrowDown' ? 1 : -1) + res.length) % res.length;
      mark();
      return;
    }
    if (event.key === 'Enter' && event.target === q && res[cur]) {
      event.preventDefault(); window.location.assign(res[cur].url); return;
    }
    if (event.key === 'Tab') {
      // Only the first/last *visible* focusable nodes form the dialog boundary.
      var nodes = $$('input:not([disabled]), button:not([disabled]), a[href]', sr).filter(function (node) {
        return node.getClientRects().length > 0;
      });
      if (!nodes.length) return;
      var first = nodes[0], last = nodes[nodes.length - 1];
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
    }
  });

  /* ---------- Reading progress (article pages) ---------- */
  var bar = $('#prog');
  if (bar) {
    var tick = false;
    var paint = function () {
      var h = document.documentElement;
      var max = h.scrollHeight - h.clientHeight;
      bar.style.width = (max > 0 ? (h.scrollTop / max) * 100 : 0) + '%';
      tick = false;
    };
    window.addEventListener('scroll', function () {
      if (!tick) { tick = true; window.requestAnimationFrame(paint); }
    }, { passive: true });
    paint();
  }

  /* ---------- Fade-up on scroll, once per block ---------- */
  var els = $$('.rv');
  if ('IntersectionObserver' in window) {
    var o = new IntersectionObserver(function (es) {
      es.forEach(function (i) {
        if (i.isIntersecting) { i.target.classList.add('in'); o.unobserve(i.target); }
      });
    }, { threshold: 0.06 });
    els.forEach(function (e) {
      // Anything already on screen shows at once, so there is no fade race with first paint.
      if (e.getBoundingClientRect().top < window.innerHeight * 0.9) e.classList.add('in');
      else o.observe(e);
    });
  } else {
    els.forEach(function (e) { e.classList.add('in'); });
  }

  /* ---------- Article checklists: tick what you already do ---------- */
  var chk = $('#chk');
  if (chk) {
    var b = $$('input', chk);
    var c = $('#count'), r = $('#rg'), p = $('#pc'), m = $('#msg');
    var u = function () {
      var n = b.filter(function (x) { return x.checked; }).length;
      c.textContent = n + ' of ' + b.length + ' checks completed';
      p.textContent = n;
      r.style.strokeDashoffset = 201 - (201 * n) / b.length;
      m.textContent = n === b.length ? 'Well done. Review this list again every few months.' : '';
    };
    b.forEach(function (x) { x.addEventListener('change', u); });
    $('#reset').addEventListener('click', function () { b.forEach(function (x) { x.checked = false; }); u(); });
    u();
  }

})();

/* Homepage Cyber Tips: one seven-second rotation updates the hero tip and
   the five-slide carousel; no duplicated timers or unsolicited announcements. */
(function(){
  'use strict';
  var root=document.getElementById('tipc');
  if(!root)return;
  if(root.__tips)root.__tips.destroy();
  var slides=Array.prototype.slice.call(root.querySelectorAll('.slide'));
  var dots=Array.prototype.slice.call(root.querySelectorAll('#tipdots button'));
  var hero=document.getElementById('heroCyberTip');
  var live=document.getElementById('tipslides');
  var count=document.getElementById('tipcount');
  var play=document.getElementById('tipplay');
  var controls=root.querySelector('.ctl');
  var N=slides.length,i=0,timer=null,INTERVAL=7000,subs=[];
  var mq=window.matchMedia?window.matchMedia('(prefers-reduced-motion: reduce)'):null;
  var st={hover:false,focus:false,hidden:!!document.hidden,paused:!!(mq&&mq.matches)};
  function on(t,e,f,o){if(!t)return;t.addEventListener(e,f,o);subs.push([t,e,f,o]);}
  function show(n){
    i=(n+N)%N;
    slides.forEach(function(slide,k){
      var current=k===i;
      slide.classList.toggle('on',current);
      slide.setAttribute('aria-hidden',current?'false':'true');
      slide.setAttribute('inert',current?'false':'');
      if(current)slide.removeAttribute('inert');
    });
    dots.forEach(function(dot,k){if(k===i)dot.setAttribute('aria-current','true');else dot.removeAttribute('aria-current');});
    if(count)count.textContent=(i+1)+' of '+N;
    if(hero)hero.textContent=slides[i].getAttribute('data-hero-tip')||slides[i].querySelector('h3').textContent;
  }
  function running(){return !(st.paused||st.hover||st.focus||st.hidden);}
  function clear(){if(timer!==null){clearTimeout(timer);timer=null;}}
  function schedule(){
    clear();if(live)live.setAttribute('aria-live',running()?'off':'polite');
    if(!running() || N<2)return;
    timer=setTimeout(function(){timer=null;show(i+1);schedule();},INTERVAL);
  }
  function manual(n){show(n);schedule();}
  function setPlay(){
    if(!play)return;
    play.setAttribute('aria-label',st.paused?'Resume automatic rotation':'Pause automatic rotation');
    play.setAttribute('aria-pressed',String(st.paused));
    play.innerHTML='<svg class="i" aria-hidden="true"><use href="/assets/icons.svg#'+(st.paused?'play':'pause')+'"/></svg>';
  }
  on(document.getElementById('tipprev'),'click',function(){manual(i-1);});
  on(document.getElementById('tipnext'),'click',function(){manual(i+1);});
  dots.forEach(function(dot,k){on(dot,'click',function(){manual(k);});});
  on(play,'click',function(){st.paused=!st.paused;setPlay();schedule();});
  // Pause when someone is using the controls, rather than whenever the mouse
  // happens to rest over the entire tip card.
  on(controls,'pointerenter',function(e){if(e.pointerType==='mouse'){st.hover=true;schedule();}});
  on(controls,'pointerleave',function(e){if(e.pointerType==='mouse'){st.hover=false;schedule();}});
  on(root,'focusin',function(){st.focus=true;schedule();});
  on(root,'focusout',function(e){if(!root.contains(e.relatedTarget)){st.focus=false;schedule();}});
  on(root,'keydown',function(e){
    if(e.key==='ArrowLeft'){e.preventDefault();manual(i-1);}
    else if(e.key==='ArrowRight'){e.preventDefault();manual(i+1);}
  });
  on(document,'visibilitychange',function(){st.hidden=!!document.hidden;schedule();});
  if(mq&&mq.addEventListener)on(mq,'change',function(){if(mq.matches){st.paused=true;setPlay();schedule();}});
  function destroy(){clear();subs.forEach(function(s){s[0].removeEventListener(s[1],s[2],s[3]);});subs=[];root.__tips=null;}
  on(window,'pagehide',destroy);
  root.__tips={destroy:destroy};
  show(0);setPlay();schedule();
})();
