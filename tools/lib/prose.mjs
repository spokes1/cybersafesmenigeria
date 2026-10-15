// Long-form article renderer. Content files stay readable prose; this turns
// them into the approved article layout: hero, intro, icon-headed sections,
// tick lists, numbered step cards, takeaway callouts and "Keep learning".
// Blocks: ['p', text] ['h2', text] ['h3', text] ['ul', [..]] ['ol', [..]] ['quote', text] ['note', text]
import { esc } from './layout.mjs';
import { icon } from './icons.mjs';
import { artHero, artSection, keepLearning } from './components.mjs';

// Inline markup allowed inside block text: **bold** and [label](href).
export function inline(text) {
  return esc(text)
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, (_m, label, href) => {
      const blank = /^https?:/.test(href);
      return `<a href="${href}"${blank ? ' target="_blank" rel="noopener noreferrer"' : ''}>${label}${blank ? '<span class="sr-only"> (opens in a new tab)</span>' : ''}</a>`;
    });
}

// A numbered step that opens with a bold phrase shows it as the step title.
function step(item) {
  const m = item.match(/^\*\*(.+?)\*\*\s*(?:[—–-]\s*)?(.*)$/);
  return m ? `<li><b>${inline(m[1])}</b>${inline(m[2])}</li>` : `<li>${inline(item)}</li>`;
}

function block([kind, value]) {
  switch (kind) {
    case 'p':
      return `<p>${inline(value)}</p>`;
    case 'h3':
      return `<h3 class="sub">${esc(value)}</h3>`;
    case 'ul':
      return `<ul class="dots">${value.map((item) => `<li>${inline(item)}</li>`).join('')}</ul>`;
    case 'ol':
      return `<ol class="steps">${value.map(step).join('')}</ol>`;
    case 'quote':
      return `<div class="lesson">${inline(value)}</div>`;
    case 'note':
      return `<div class="note">${icon('info')}<div>${inline(value)}</div></div>`;
    default:
      throw new Error(`Unknown prose block: ${kind}`);
  }
}

// Section icons follow what the heading is about.
const HEADING_ICONS = [
  [/if (it|the account|your account|an account|someone|money)|already|recover|when you need|what to do|if it happens|right now/i, 'bolt'],
  [/sign|gives it away|look like|tell|recognis|spot|warning/i, 'eye'],
  [/rule|habit|team|staff|day one|last day|people/i, 'users'],
  [/prevent|reduce|protect|control|defen|stop|set-up|setup|secure|preparation/i, 'shield'],
  [/how (it|the)|arrive|plays out|patterns|gets in|works|setup works/i, 'aim'],
  [/why|hurts|matters|honest/i, 'alert'],
  [/word|what (we|it)|mission|publish|built|decide/i, 'book'],
  [/password|2fa|two-factor|manager/i, 'key'],
  [/email|domain|reading email/i, 'mail'],
  [/phone|mobile/i, 'phone'],
  [/backup|3-2-1|copy/i, 'cloud'],
  [/access|account/i, 'lock'],
  [/collect|privacy|data|cookies/i, 'lock'],
  [/link|external|tools|fonts|hosting/i, 'ext'],
  [/contact|question|correction|email us/i, 'mail'],
  [/liab|accuracy|terms|content|general/i, 'file'],
  [/checklist|week|routine|order|first/i, 'list'],
];

export function headingIcon(text) {
  const hit = HEADING_ICONS.find(([re]) => re.test(text));
  return hit ? hit[1] : 'info';
}

export function readingTime(blocks) {
  const words = blocks
    .flatMap(([, v]) => (Array.isArray(v) ? v : [v]))
    .join(' ')
    .split(/\s+/).length;
  return Math.max(2, Math.round(words / 200));
}

export function prose(blocks) {
  const intro = [];
  const groups = [];
  for (const b of blocks) {
    if (b[0] === 'h2') groups.push({ heading: b[1], blocks: [] });
    else if (groups.length) groups[groups.length - 1].blocks.push(b);
    else intro.push(b);
  }
  return (
    (intro.length ? `<div class="read intro rv">${intro.map(block).join('')}</div>` : '') +
    groups.map((g) => artSection({ iconName: headingIcon(g.heading), heading: g.heading, inner: g.blocks.map(block).join('') })).join('')
  );
}

export function faq(items) {
  return `<div class="faq">${items
    .map((item) => `<details><summary>${esc(item.q)}${icon('chev')}</summary><div><p>${inline(item.a)}</p></div></details>`)
    .join('')}</div>`;
}

/** Article page: hero, prose sections, optional extra HTML, then related cards. */
export function articlePage({ section, title, lede, trail, blocks, related = [], relatedTitle = 'Related', extra = '', pillIcon = 'clock' }) {
  const minutes = readingTime(blocks);
  return `${artHero({ pill: `${section} · ${minutes}-minute read`, pillIcon, title, lead: lede, trail })}
<div class="wrap art-main">
${prose(blocks)}
${extra}
${keepLearning(related, relatedTitle)}
</div>`;
}
