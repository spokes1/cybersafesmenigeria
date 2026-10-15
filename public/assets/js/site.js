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

  /* ---------- Search ---------- */
  var sr = $('#sr');
  var q = $('#q');
  var sb = $('#sb');
  var IDX = null;
  var loading = null;
  var cur = 0;
  var res = [];
  var lastFocus = null;

  // Everyday words people type, mapped to the vocabulary the pages use.
  var SYN = {
    hacked: 'incident breach account', scam: 'fraud phishing', scammed: 'fraud phishing',
    otp: 'sim swap whatsapp verification', alert: 'fake bank payment', invoice: 'business email compromise payment',
    lost: 'backup stolen recovery', virus: 'malware', staff: 'employee training', police: 'report nccc',
    pos: 'payment wifi', transfer: 'payment fake bank', password: 'password 2fa', pin: 'whatsapp verification',
    listen: 'audio', privacy: 'privacy data', router: 'wifi'
  };
  var CH = ['fake bank alert', 'WhatsApp', 'SIM swap', 'password', 'ransomware', 'backup', 'staff training', 'report fraud'];

  function load() {
    if (IDX) return Promise.resolve(IDX);
    if (!loading) {
      loading = fetch('/assets/search-index.json')
        .then(function (r) { return r.json(); })
        .then(function (rows) {
          IDX = rows.map(function (e) { return [e.title, e.section, e.url, e.keywords || '', e.summary || '']; });
          return IDX;
        })
        .catch(function () { IDX = []; return IDX; });
    }
    return loading;
  }

  function score(e, toks) {
    var tot = 0;
    var hay = [e[0].toLowerCase(), e[3].toLowerCase(), e[4].toLowerCase(), e[1].toLowerCase()];
    for (var i = 0; i < toks.length; i++) {
      var alts = [toks[i]].concat((SYN[toks[i]] || '').split(' ').filter(Boolean));
      var best = 0;
      alts.forEach(function (a, ai) {
        var w = ai ? 0.6 : 1, s = 0;
        if (hay[0].indexOf(a) === 0) s = 6;
        else if (hay[0].indexOf(a) > -1) s = 5;
        else if (hay[1].indexOf(a) > -1) s = 3;
        else if (hay[2].indexOf(a) > -1) s = 1.5;
        else if (hay[3].indexOf(a) > -1) s = 1;
        best = Math.max(best, s * w);
      });
      if (!best) return 0;
      tot += best;
    }
    return tot;
  }

  function chips() {
    return '<div class="chips">' + CH.map(function (c) {
      return '<button type="button" data-c="' + esc(c) + '">' + esc(c) + '</button>';
    }).join('') + '</div>';
  }

  function render() {
    var v = q.value.trim().toLowerCase();
    if (!v) {
      res = [];
      sb.innerHTML = '<div class="sl">Try searching for</div>' + chips() +
        '<p class="hint">Search by topic (password, backup), by threat (SIM swap, phishing) or by situation (hacked, lost phone, changed bank details).</p>';
      return;
    }
    var toks = v.split(/\s+/).filter(Boolean);
    res = (IDX || [])
      .map(function (e) { return [score(e, toks), e]; })
      .filter(function (x) { return x[0] > 0; })
      .sort(function (a, b) { return b[0] - a[0]; })
      .slice(0, 7)
      .map(function (x) { return x[1]; });
    cur = 0;
    sb.innerHTML = res.length
      ? '<div class="rs" role="listbox" aria-label="Results">' + res.map(function (e, i) {
          return '<a href="' + esc(e[2]) + '" class="' + (i ? '' : 'on') + '"><div><b>' + esc(e[0]) + '</b><small>' + esc(e[4]) + '</small></div><em>' + esc(e[1]) + '</em></a>';
        }).join('') + '</div>'
      : '<p class="none">No match for &ldquo;' + esc(v) + '&rdquo;.</p><div class="sl">Try</div>' + chips();
  }

  function mark() {
    var a = $$('.rs a', sb);
    a.forEach(function (x, i) { x.classList.toggle('on', i === cur); });
    if (a[cur]) a[cur].scrollIntoView({ block: 'nearest' });
  }

  function isOpen() { return sr && sr.classList.contains('open'); }

  function openSearch() {
    if (!sr) return;
    lastFocus = document.activeElement;
    setMenu(false);
    sr.classList.add('open');
    sr.setAttribute('aria-hidden', 'false');
    document.body.classList.add('no-scroll');
    q.value = '';
    render();
    load().then(function () { if (q.value) render(); });
    setTimeout(function () { q.focus(); }, 30);
  }

  function closeSearch() {
    if (!sr) return;
    sr.classList.remove('open');
    sr.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('no-scroll');
    if (lastFocus && lastFocus.focus) lastFocus.focus();
  }

  if (sr && q && sb) {
    $$('[data-search]').forEach(function (b) { b.addEventListener('click', openSearch); });
    $('#sx').addEventListener('click', closeSearch);
    sr.addEventListener('click', function (e) { if (e.target === sr) closeSearch(); });
    sb.addEventListener('click', function (e) {
      var c = e.target.getAttribute && e.target.getAttribute('data-c');
      if (c) { q.value = c; load().then(render); q.focus(); }
    });
    q.addEventListener('input', function () { load().then(render); });
  }

  document.addEventListener('keydown', function (e) {
    var t = (e.target.tagName || '').toLowerCase();
    var typing = t === 'input' || t === 'textarea' || t === 'select' || e.target.isContentEditable;
    if ((e.key === '/' && !typing && !isOpen()) || ((e.ctrlKey || e.metaKey) && (e.key || '').toLowerCase() === 'k')) {
      e.preventDefault();
      if (isOpen()) q.focus(); else openSearch();
      return;
    }
    if (e.key === 'Escape' && mnav && mnav.classList.contains('open') && !isOpen()) {
      setMenu(false);
      burger.focus();
      return;
    }
    if (!isOpen()) return;
    if (e.key === 'Escape') closeSearch();
    else if (e.key === 'ArrowDown' && res.length) { e.preventDefault(); cur = (cur + 1) % res.length; mark(); }
    else if (e.key === 'ArrowUp' && res.length) { e.preventDefault(); cur = (cur - 1 + res.length) % res.length; mark(); }
    else if (e.key === 'Enter' && res[cur] && e.target === q) { e.preventDefault(); window.location.href = res[cur][2]; }
    else if (e.key === 'Tab') {
      // Keep focus inside the dialog while it is open.
      var f = $$('input, button, a[href]', sr);
      if (!f.length) return;
      var first = f[0], last = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
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

  /* ---------- Security self-check (16 items, saved in this browser only) ---------- */
  var form = $('#checklist');
  if (form) {
    var boxes = $$('input[type="checkbox"]', form);
    var count = $('#score-count');
    var label = $('#score-label');
    var ring = $('#score-ring');
    var STORE = 'cybersafe.checklist.v1';
    var saved = {};
    try { saved = JSON.parse(window.localStorage.getItem(STORE) || '{}'); } catch (err) { saved = {}; }

    var update = function (persist) {
      var done = boxes.filter(function (box) { return box.checked; }).length;
      count.textContent = done;
      if (ring) ring.style.strokeDashoffset = 201 - (201 * done) / boxes.length;
      if (label) {
        label.textContent =
          done === 0
            ? 'Nothing ticked yet. Work down the list at your own pace.'
            : done === boxes.length
              ? 'Every basic covered. Revisit this list each quarter.'
              : 'Unticked items are the gaps worth looking at first.';
      }
      if (!persist) return;
      var state = {};
      boxes.forEach(function (box) { state[box.value] = box.checked; });
      try { window.localStorage.setItem(STORE, JSON.stringify(state)); } catch (err) { /* not remembered */ }
    };

    boxes.forEach(function (box) {
      if (saved[box.value]) box.checked = true;
      box.addEventListener('change', function () { update(true); });
    });
    update(false);

    var reset = $('#score-reset');
    if (reset) {
      reset.addEventListener('click', function () {
        boxes.forEach(function (box) { box.checked = false; });
        update(true);
      });
    }
  }
})();
