import { icon } from './icons.mjs';
import { NAV, FOOTER, LEGAL, SITE } from '../content/nav.mjs';

const YEAR = 2026;

export function esc(value = '') {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

/** Marks the top-level menu that owns the current route. */
function owns(item, path) {
  return path === item.href || path.startsWith(item.href + '/');
}

const MENUS = NAV.filter((item) => item.columns);

function link(href, label, path) {
  return `<a href="${href}"${href === path ? ' aria-current="page"' : ''}>${esc(label)}</a>`;
}

function header(path, progress) {
  const menu = MENUS.map((item) => {
    const links = item.columns.flat().map((l) => link(l.href, l.label, path)).join('');
    const current = owns(item, path) ? ' aria-current="true"' : '';
    return `<li class="dd"><a class="l" href="${item.href}"${current}>${esc(item.label)}${icon('chev')}</a><div class="panel">${links}</div></li>`;
  }).join('');

  const mobile = MENUS.map((item) => {
    const links = item.columns.flat().map((l) => link(l.href, l.label, path)).join('');
    return `<details${owns(item, path) ? ' open' : ''}><summary>${esc(item.label)}${icon('chev')}</summary>${link(item.href, `All ${item.label}`, path)}${links}</details>`;
  }).join('');

  return `<header class="top"><div class="wrap"><a class="logo" href="/" aria-label="${esc(SITE.name)}, home"><span class="lg" role="img" aria-label="${esc(SITE.name)}"></span></a>
<nav class="main" aria-label="Main"><ul>${menu}</ul></nav>
<button class="sbtn" data-search type="button" aria-label="Search the site"><svg class="i" aria-hidden="true"><use href="/assets/icons.svg#search"/></svg><span>Search</span><kbd>/</kbd></button>
<a class="btn p cta-s" href="${SITE.ctaHref}">${esc(SITE.ctaLabel)}</a>
<button class="burger" id="bg" type="button" aria-label="Open menu" aria-expanded="false" aria-controls="mnav">${icon('menu')}</button></div>
<nav id="mnav" aria-label="Mobile">${mobile}<div class="mcta"><a class="btn p" href="${SITE.ctaHref}">${esc(SITE.ctaLabel)}</a></div></nav>${progress ? '<div id="prog"></div>' : ''}</header>`;
}

function footer(note) {
  const columns = FOOTER.map(
    (group) => `<div><h4>${esc(group.heading)}</h4><ul>${group.links.map((l) => `<li><a href="${l.href}">${esc(l.label)}</a></li>`).join('')}</ul></div>`
  ).join('');

  return `<footer><div class="wrap"><div class="fg"><div><span class="lg ft" role="img" aria-label="${esc(SITE.name)}"></span><p style="color:var(--muted);max-width:22em">${esc(SITE.tagline)}</p><p><a class="pw" href="https://www.go2cyber.org" target="_blank" rel="noopener noreferrer"><img src="/go2cyber-logo.png" width="24" height="24" alt="Go2Cyber logo" loading="lazy" decoding="async">Powered by Go2Cyber</a></p></div>${columns}<div><h4>Connect</h4><ul><li><a href="mailto:${SITE.email}">${SITE.email}</a></li></ul></div></div>
${note ? `<div class="fnote">${note}</div>` : ''}<div class="fb"><span>&copy; ${YEAR} ${esc(SITE.name)}</span><nav aria-label="Legal">${LEGAL.map((l) => `<a href="${l.href}">${esc(l.label)}</a>`).join('')}</nav></div></div></footer>`;
}

function search() {
  return `<div class="sr" id="sr" role="dialog" aria-modal="true" aria-label="Search" aria-hidden="true"><div class="sd"><div class="si">${icon('search')}<input id="q" type="search" placeholder="Search topics, threats and guides" autocomplete="off" spellcheck="false" aria-label="Search"><button id="sx" type="button" aria-label="Close search">Esc</button></div>
<div class="sb" id="sb"></div><div class="sf"><span>&uarr;&darr; to move</span><span>Enter to open</span><span>Esc to close</span></div></div></div>`;
}

/**
 * Wraps page body HTML in the shared document shell.
 * @param {{path:string,title:string,description:string,body:string,kind?:'home'|'art',progress?:boolean,footerNote?:string,preload?:string}} page
 */
export function document_({ path, title, description, body, kind = 'home', progress = false, footerNote = '', preload = '', canonical = true }) {
  const url = `${SITE.origin}${path === '/' ? '/' : path}`;
  const image = `${SITE.origin}/assets/og-image.png`;
  return `<!DOCTYPE html>
<html lang="en-GB">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>${esc(title)}</title>
<meta name="description" content="${esc(description)}">
<meta name="theme-color" content="#ffffff">
${canonical ? `<link rel="canonical" href="${url}">\n` : ''}<link rel="icon" type="image/png" href="/assets/logo/favicon.png">
<link rel="apple-touch-icon" href="/assets/logo/apple-touch-icon.png">
<meta property="og:type" content="${kind === 'art' ? 'article' : 'website'}">
<meta property="og:site_name" content="${esc(SITE.name)}">
<meta property="og:title" content="${esc(title)}">
<meta property="og:description" content="${esc(description)}">
<meta property="og:url" content="${url}">
<meta property="og:image" content="${image}">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:image:alt" content="${esc(SITE.name)} logo">
<meta property="og:locale" content="en_GB">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${esc(title)}">
<meta name="twitter:description" content="${esc(description)}">
<meta name="twitter:image" content="${image}">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&amp;display=swap">
<link rel="stylesheet" href="/assets/css/site.css">
${preload}<script src="/assets/js/site.js" defer></script>
</head>
<body class="pg-${kind}">
<a class="skip" href="#main">Skip to content</a>
${header(path, progress)}
<main id="main">
${body.trim()}
</main>
${footer(footerNote)}
${search()}
</body>
</html>
`;
}
