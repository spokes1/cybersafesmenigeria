// Reusable building blocks, matching the approved homepage and article designs.
// Every restyled page composes from these, so a new article, threat or
// resource slots in without touching any layout.
import { icon } from './icons.mjs';
import { esc } from './layout.mjs';

/** Breadcrumb trail: [{label, href?}, ...] */
export function crumbs(trail = []) {
  if (!trail.length) return '';
  return `<nav class="crumbs" aria-label="Breadcrumb">${trail
    .map((step, i) => (i ? icon('chev') : '') + (step.href ? `<a href="${step.href}">${esc(step.label)}</a>` : `<span aria-current="page">${esc(step.label)}</span>`))
    .join('')}</nav>`;
}

/** Short titles get the gradient on their last word, as in the approved pages. */
export function headline(title) {
  const words = title.split(' ');
  if (words.length > 3) return esc(title);
  const last = words.pop();
  return `${words.length ? esc(words.join(' ')) + ' ' : ''}<em>${esc(last)}</em>`;
}

export function btn({ label, href, primary = false, arrow = false, iconName = '' }) {
  return `<a class="btn${primary ? ' p' : ''}" href="${href}">${iconName ? icon(iconName) : ''}${esc(label)}${arrow ? ' ' + icon('arrow') : ''}</a>`;
}

/* ---------- Homepage-style (pg-home) ---------- */

/** Hub hero: pill, large heading, lead. Same treatment as the homepage hero, one column. */
export function hubHero({ pill, pillIcon = 'shield', title, lead = '', trail = [], buttons = '' }) {
  return `<section class="hero hub"><div class="wrap"><div>${crumbs(trail)}<span class="pill">${icon(pillIcon)}${esc(pill)}</span>
<h1>${headline(title)}</h1>${lead ? `<p class="lead">${esc(lead)}</p>` : ''}${buttons ? `<div class="btns">${buttons}</div>` : ''}</div></div></section>`;
}

/** SectionHeader + body. `tint` alternates the band colour. */
export function section({ heading = '', sub = '', inner = '', tint = false, eyebrow = '', extraClass = '' }) {
  return `<section class="${[tint ? 't' : '', 'rv', extraClass].filter(Boolean).join(' ')}"><div class="wrap">${eyebrow ? `<p class="eyebrow">${esc(eyebrow)}</p>` : ''}${heading ? `<h2>${esc(heading)}</h2>` : ''}${sub ? `<p class="sub">${esc(sub)}</p>` : ''}${inner}</div></section>`;
}

/** CategoryCard / ResourceCard / ArticleCard: icon tile, heading, copy, "more" link. */
export function iconCard({ iconName = 'book', tone = '', title, copy = '', href = '', more = 'Open', tag = '', ext = false }) {
  const tile = iconName ? `<div class="ci ${tone}">${icon(iconName)}</div>` : '';
  const body = `${tile}${tag ? `<span class="tag">${esc(tag)}</span>` : ''}<h3>${esc(title)}</h3>${copy ? `<p>${copy}</p>` : ''}`;
  if (!href) return `<div class="card">${body}</div>`;
  const external = /^https?:/.test(href);
  return `<a class="card${ext ? ' lr' : ''}" href="${href}"${external ? ' target="_blank" rel="noopener noreferrer"' : ''}>${body}<span class="more">${esc(more)}${icon(external ? 'ext' : 'arrow')}${external ? '<span class="sr-only"> (opens in a new tab)</span>' : ''}</span></a>`;
}

/** ThreatCard: tinted thumbnail with a round icon, then name, one line and a link. */
export function threatCard({ iconName, tone = '', title, copy, href }) {
  return `<a class="card tc" href="${href}"><div class="th ${tone}"><span>${icon(iconName)}</span></div><div class="tb"><h3>${esc(title)}</h3><p>${esc(copy)}</p><span class="more">Read more${icon('arrow')}</span></div></a>`;
}

/** CTASection: the soft teal-to-blue closing panel. */
export function finalCta({ eyebrow = '', heading, sub = '', buttons }) {
  return `<section class="rv"><div class="wrap"><div class="final">${eyebrow ? `<p class="eyebrow">${esc(eyebrow)}</p>` : ''}<h2>${esc(heading)}</h2>${sub ? `<p class="sub">${esc(sub)}</p>` : ''}<div class="btns">${buttons}</div></div></div></section>`;
}

export const grid = (cards, g3 = true) => `<div class="grid${g3 ? ' g3' : ''}">${cards.join('')}</div>`;

/* ---------- Article-style (pg-art) ---------- */

/** Article hero without artwork: pill, title with gradient word, lead. */
export function artHero({ pill, pillIcon = 'clock', title, lead = '', trail = [] }) {
  return `<div class="hero solo" id="top"><div class="wrap"><div>${crumbs(trail)}<span class="pill">${icon(pillIcon)}${esc(pill)}</span>
<h1>${headline(title)}</h1>${lead ? `<p class="lead">${esc(lead)}</p>` : ''}</div></div></div>`;
}

/** Article section with the gradient icon tile beside its heading. */
export function artSection({ iconName, heading, inner, id = '', extraClass = '' }) {
  return `<section class="rv${extraClass ? ' ' + extraClass : ''}"${id ? ` id="${id}"` : ''}><div class="eyebrow"><span class="ic">${icon(iconName)}</span><div><h2>${esc(heading)}</h2></div></div>${inner}</section>`;
}

const SECTION_OF = [
  ['/learn', 'Learn', 'book'],
  ['/threats', 'Threats', 'alert'],
  ['/protect-your-business', 'Protect Your Business', 'shield'],
  ['/resources', 'Resources', 'folder'],
  ['/about', 'About', 'info'],
  ['/privacy', 'Legal', 'file'],
  ['/terms', 'Legal', 'file'],
];

const ICON_FOR = {
  'password-security': 'lock', 'email-security': 'mail', 'whatsapp-security': 'chat', 'whatsapp-hijacking': 'chat',
  'phishing-guide': 'mail', phishing: 'mail', 'fake-bank-alerts': 'bank', 'sim-swap-fraud': 'sim', malware: 'monitor',
  'social-engineering': 'users', ransomware: 'lock', 'business-email-compromise': 'receipt', 'account-security': 'key',
  'payment-security': 'money', 'device-security': 'laptop', 'incident-response': 'bolt', 'security-checklist': 'list',
  'backup-and-recovery': 'cloud', 'business-wifi': 'wifi', 'employee-security': 'users', 'cybersecurity-basics': 'book',
  organisations: 'building', tools: 'tools', external: 'ext', guides: 'book', contact: 'mail', team: 'users',
  mission: 'aim', terms: 'file', privacy: 'lock', threats: 'alert', learn: 'book',
};

export function sectionFor(href) {
  const hit = SECTION_OF.find(([prefix]) => href === prefix || href.startsWith(prefix + '/'));
  return hit ? hit[1] : 'CyberSafe';
}

export function iconFor(href) {
  const slug = href.split('/').filter(Boolean).pop() || '';
  return ICON_FOR[slug] || (SECTION_OF.find(([prefix]) => href.startsWith(prefix)) || [0, 0, 'arrow'])[2];
}

/** "Keep learning" cards: icon, title, section tag. Same as the approved articles. */
export function keepLearning(links, heading = 'Keep learning with CyberSafe') {
  if (!links.length) return '';
  const cards = links
    .map((l) => `<a class="card t" href="${l.href}"><div class="ci">${icon(iconFor(l.href))}</div><h3>${esc(l.label)}</h3><span class="tag">${esc(sectionFor(l.href))}</span></a>`)
    .join('');
  return artSection({ iconName: 'arrow', heading, inner: `<div class="grid">${cards}</div>`, extraClass: 'sec-end' });
}
