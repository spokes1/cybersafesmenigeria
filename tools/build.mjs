/**
 * Static page generator.
 *
 * Netlify publishes `public/` as-is, so this script runs locally and commits
 * its output. There is deliberately no build step in the deploy pipeline.
 *
 *   node tools/build.mjs
 *
 * It also validates that every internal link and every search result resolves
 * to a page it generated, which is the only guard a site with no router has.
 */
import { mkdir, writeFile, readdir, readFile, rm, stat } from 'node:fs/promises';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import { document_ } from './lib/layout.mjs';
import { hubHero, section, btn } from './lib/components.mjs';
import { icon } from './lib/icons.mjs';
import { esc } from './lib/layout.mjs';
import { SITE, NAV, LEGAL, FOOTER } from './content/nav.mjs';
import { SEARCH } from './content/search.mjs';
import { learnIndexBody, learnPages, LEARN_TOPICS } from './content/learn.mjs';
import { threatIndexBody, threatPages } from './content/threats.mjs';
import { protectIndexBody, protectPages } from './content/protect.mjs';
import {
  resourcesIndexBody,
  checklistPageBody,
  guidesIndexBody,
  organisationsBody,
  externalBody,
  toolsBody,
  audioGuideBody,
} from './content/resources.mjs';
import { aboutIndexBody, missionBody, teamBody, contactBody, privacyBody, termsBody } from './content/about.mjs';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const OUT = join(ROOT, 'public');
const APPROVED = join(ROOT, 'tools/content/approved');

/* ------------------------------------------------------------
   Approved designs. Body fragments copied from /_reference with
   icons pointed at the shared sprite and photos at real files.
   ------------------------------------------------------------ */
async function fragment(name) {
  const html = await readFile(join(APPROVED, name), 'utf8');
  // Icons are decorative: hide them from assistive technology.
  return html.replace(/<svg class="i">/g, '<svg class="i" aria-hidden="true">');
}

async function approvedPages() {
  const articles = [
    {
      path: '/learn/password-security',
      file: 'password-security',
      title: 'Password Security | CyberSafe SME Nigeria',
      description: 'One leaked password can put more than one account at risk. Learn how to protect your business accounts with unique passwords and an extra layer of protection.',
      section: 'Learn',
      navLabel: 'Password Security',
    },
    {
      path: '/learn/backup-and-recovery',
      file: 'backup-and-recovery',
      title: 'Backup & Recovery | CyberSafe SME Nigeria',
      description: 'Backup and recovery for Nigerian small businesses: what to back up, how to keep a separate protected copy, how to test recovery, and what to do after ransomware or device loss.',
      section: 'Learn',
      navLabel: 'Backup & Recovery',
    },
    {
      path: '/learn/business-wifi',
      file: 'business-wifi',
      title: 'Business Wi-Fi Security | CyberSafe SME Nigeria',
      description: 'Business Wi-Fi security for Nigerian small businesses: keep customer devices off your business network, secure your router and know what to check.',
      section: 'Learn',
      navLabel: 'Business Wi-Fi',
    },
    {
      path: '/threats/sim-swap-fraud',
      file: 'sim-swap-fraud',
      title: 'SIM Swap Fraud | CyberSafe SME Nigeria',
      description: 'SIM swap fraud explained for Nigerian business owners: how it works, the warning signs, what to do immediately and how to reduce the risk.',
      section: 'Threats',
      navLabel: 'SIM Swap Fraud',
    },
    {
      path: '/threats/whatsapp-hijacking',
      file: 'whatsapp-hijacking',
      title: 'WhatsApp Hijacking | CyberSafe SME Nigeria',
      description: 'WhatsApp hijacking explained for Nigerian business owners: how scammers take over accounts, the warning signs, what to do and how to protect your business chats.',
      section: 'Threats',
      navLabel: 'WhatsApp Hijacking',
    },
  ];

  const home = {
    path: '/',
    title: 'CyberSafe SME Nigeria | Cybersecurity made practical for Nigerian businesses',
    description:
      'A free cybersecurity knowledge hub for Nigerian small and medium businesses: understand common threats, protect accounts and payments, and know what to do when something goes wrong.',
    kind: 'home',
    section: SITE.short,
    navLabel: 'Home',
    preload: '<link rel="preload" as="image" href="/assets/photos/hero-shop-owner.webp" fetchpriority="high">\n',
    body: await fragment('home.html'),
  };

  const pages = await Promise.all(
    articles.map(async (a) => ({
      ...a,
      kind: 'art',
      progress: true,
      body: await fragment(`${a.file}.html`),
      footerNote: (await fragment(`${a.file}.footer.html`)).replace(/^<div[^>]*>|<\/div>\s*$/g, '').trim(),
    }))
  );
  return [home, ...pages];
}

/* ------------------------------------------------------------
   PlaceholderPage: full header and footer, page name as heading,
   one honest sentence, and routes onward. No "coming soon" artwork.
   ------------------------------------------------------------ */
function placeholderBody({ title, section: sectionName, sectionHref, suggestions }) {
  const trail = [{ label: 'Home', href: '/' }];
  if (sectionName) trail.push({ label: sectionName, href: sectionHref });
  trail.push({ label: title });

  const links = suggestions && suggestions.length
    ? `<h3 style="margin-top:26px">Published pages on nearby topics</h3><ul>${suggestions
        .map((item) => `<li><a href="${item.href}">${esc(item.label)}${icon('arrow')}</a></li>`)
        .join('')}</ul>`
    : '';

  return `${hubHero({ pill: sectionName || SITE.short, pillIcon: 'clock', title, trail })}
${section({
    tint: true,
    inner: `<div class="card soon"><div class="ci">${icon('clock')}</div><h2>We're still working on this section. Check back soon.</h2><p>This page is planned but not written yet. Rather than publish something thin, we have left it empty until it is worth reading.</p><div class="btns">${btn({ label: 'Back to Home', href: '/', primary: true })}${sectionName ? btn({ label: `All ${sectionName}`, href: sectionHref }) : ''}</div>${links}</div>`,
  })}`;
}

function placeholder({ path, title, section: sectionName, sectionHref, description, suggestions }) {
  return {
    path,
    title: `${title} | ${SITE.name}`,
    description: description || `${title}: page in progress at ${SITE.name}.`,
    kind: 'home',
    section: sectionName || SITE.short,
    navLabel: title,
    body: placeholderBody({ title, section: sectionName, sectionHref, suggestions }),
  };
}

/* ---------- Assemble the site ---------- */
const LEARN_SUGGESTIONS = [
  { label: 'Cybersecurity Basics', href: '/learn/cybersecurity-basics' },
  { label: 'Password Security', href: '/learn/password-security' },
  { label: 'Security Checklist', href: '/resources/security-checklist' },
];

const hub = (path, title, description, sectionName, body) => ({ path, title, description, kind: 'home', section: sectionName, navLabel: sectionName, body });
const art = (path, title, description, sectionName, navLabel, body) => ({ path, title, description, kind: 'art', section: sectionName, navLabel, body });

const pages = [
  ...(await approvedPages()),

  /* Learn */
  hub('/learn', 'Learn | CyberSafe SME Nigeria', 'Plain-language cybersecurity topics for Nigerian business owners and their staff.', 'Learn', learnIndexBody()),
  ...learnPages(),
  ...LEARN_TOPICS.filter((topic) => !topic.live).map((topic) =>
    placeholder({
      path: `/learn/${topic.slug}`,
      title: topic.name,
      section: 'Learn',
      sectionHref: '/learn',
      description: topic.copy,
      suggestions: LEARN_SUGGESTIONS,
    })
  ),

  /* Threats */
  hub('/threats', 'Threats | CyberSafe SME Nigeria', 'How phishing, fake bank alerts, WhatsApp hijacking, SIM swap fraud and other attacks on Nigerian SMEs actually work.', 'Threats', threatIndexBody()),
  ...threatPages(),

  /* Protect your business */
  hub('/protect-your-business', 'Protect Your Business | CyberSafe SME Nigeria', 'Practical steps for securing the accounts, payments, devices and data a small business runs on.', 'Protect Your Business', protectIndexBody()),
  ...protectPages(),

  /* Resources */
  hub('/resources', 'Resources | CyberSafe SME Nigeria', 'Guides, checklists, downloads, tools and the Nigerian organisations that handle cyber incidents and data protection.', 'Resources', resourcesIndexBody()),
  art('/resources/security-checklist', 'Security Checklist | CyberSafe SME Nigeria', 'A 16-point security self-check for Nigerian small businesses. Your answers stay in your browser.', 'Resources', 'Security Checklist', checklistPageBody()),
  hub('/resources/guides', 'Guides | CyberSafe SME Nigeria', 'Step-by-step cybersecurity guides written for Nigerian small businesses.', 'Resources', guidesIndexBody()),
  hub('/resources/organisations', 'Cybersecurity Organisations | CyberSafe SME Nigeria', 'NITDA, ngCERT, NDPC, CBN, EFCC and NCC — what each one does and when to contact them.', 'Resources', organisationsBody()),
  hub('/resources/external', 'External Resources | CyberSafe SME Nigeria', 'Reference material from established international security bodies, useful when you want more depth.', 'Resources', externalBody()),
  hub('/resources/tools', 'Tools | CyberSafe SME Nigeria', 'Free and low-cost security tools worth knowing about — password managers, breach checks and authenticator apps.', 'Resources', toolsBody()),
  hub('/resources/audio-guide', 'Audio Guide | CyberSafe SME Nigeria', 'A short spoken briefing on the cybersecurity steps that matter most for a Nigerian small business.', 'Resources', audioGuideBody()),
  placeholder({
    path: '/resources/checklists',
    title: 'Checklists',
    section: 'Resources',
    sectionHref: '/resources',
    description: 'Printable quick-reference checklists for your team.',
    suggestions: [
      { label: 'Security Checklist', href: '/resources/security-checklist' },
      { label: 'Incident Response', href: '/protect-your-business/incident-response' },
    ],
  }),
  placeholder({
    path: '/resources/downloads',
    title: 'Downloads',
    section: 'Resources',
    sectionHref: '/resources',
    description: 'Documents you can save and share with your staff.',
    suggestions: [
      { label: 'Security Checklist', href: '/resources/security-checklist' },
      { label: 'Guides', href: '/resources/guides' },
      { label: 'Audio Guide', href: '/resources/audio-guide' },
    ],
  }),

  /* About and legal */
  hub('/about', 'About | CyberSafe SME Nigeria', 'CyberSafe is a free cybersecurity knowledge hub for Nigerian SMEs — not a consultancy, MSSP or security vendor.', 'About', aboutIndexBody()),
  art('/about/mission', 'Our Mission | CyberSafe SME Nigeria', 'Why CyberSafe exists, how content is chosen, and what we will not do.', 'About', 'Our Mission', missionBody()),
  hub('/about/team', 'Meet the Team | CyberSafe SME Nigeria', 'The Nigerian team writing and maintaining CyberSafe.', 'About', teamBody()),
  hub('/about/contact', 'Contact | CyberSafe SME Nigeria', 'Email CyberSafe with corrections, questions or topic suggestions.', 'About', contactBody()),
  art('/privacy', 'Privacy Policy | CyberSafe SME Nigeria', 'CyberSafe collects no personal data. No accounts, no forms, no analytics.', 'Legal', 'Privacy Policy', privacyBody()),
  art('/terms', 'Terms of Use | CyberSafe SME Nigeria', 'What CyberSafe is for, and the limits of what to rely on it for.', 'Legal', 'Terms of Use', termsBody()),
];

/* ---------- Checks ---------- */
const routes = new Set(pages.map((page) => page.path));

function assertUnique() {
  const seen = new Set();
  for (const page of pages) {
    if (seen.has(page.path)) throw new Error(`Two pages generated for ${page.path}`);
    seen.add(page.path);
  }
}

function assertNavRoutesExist() {
  const missing = [];
  const check = (href, where) => {
    if (href.startsWith('/') && !routes.has(href)) missing.push(`${where}: ${href}`);
  };
  NAV.forEach((item) => {
    check(item.href, `nav "${item.label}"`);
    (item.columns || []).flat().forEach((link) => check(link.href, `nav "${item.label}" → "${link.label}"`));
  });
  FOOTER.forEach((group) => group.links.forEach((link) => check(link.href, `footer "${link.label}"`)));
  LEGAL.forEach((link) => check(link.href, `legal "${link.label}"`));
  SEARCH.forEach((entry) => check(entry.url, `search "${entry.title}"`));
  if (missing.length) throw new Error(`Navigation or search points at pages that are not generated:\n  ${missing.join('\n  ')}`);
}

const IGNORED_LINKS = new Set(['/audio_file.mp4', '/go2cyber-logo.png']);

async function assertInternalLinksResolve(rendered) {
  const problems = [];
  for (const [path, html] of rendered) {
    const refs = [...html.matchAll(/(?:href|src)="([^"]+)"/g)].map((match) => match[1]);
    const ids = new Set([...html.matchAll(/\sid="([^"]+)"/g)].map((match) => match[1]));
    for (const ref of refs) {
      if (ref.startsWith('#')) {
        if (ref.length > 1 && !ids.has(ref.slice(1))) problems.push(`${path} → ${ref} (no such anchor)`);
        continue;
      }
      if (!ref.startsWith('/') || ref.startsWith('//')) continue;
      const target = ref.split('#')[0].split('?')[0];
      if (target.startsWith('/assets/') || IGNORED_LINKS.has(target)) {
        try {
          await stat(join(OUT, target));
        } catch {
          problems.push(`${path} → ${ref} (missing file)`);
        }
        continue;
      }
      const route = target.replace(/\/$/, '') || '/';
      if (!routes.has(route)) problems.push(`${path} → ${ref}`);
    }
  }
  if (problems.length) throw new Error(`Dead internal links:\n  ${[...new Set(problems)].join('\n  ')}`);
}

/* ---------- Emit ---------- */
async function cleanGenerated() {
  // Remove previously generated directories so renamed routes do not linger.
  const keep = new Set(['assets', 'audio_file.mp4', 'go2cyber-logo.png']);
  const entries = await readdir(OUT, { withFileTypes: true });
  await Promise.all(
    entries
      .filter((entry) => !keep.has(entry.name))
      .map((entry) => rm(join(OUT, entry.name), { recursive: true, force: true }))
  );
  // The search index moved from /assets/js/ to /assets/.
  await rm(join(OUT, 'assets/js/search-index.json'), { force: true });
}

function outputPath(routePath) {
  return routePath === '/' ? join(OUT, 'index.html') : join(OUT, routePath.slice(1), 'index.html');
}

function render(page) {
  return document_({
    path: page.path,
    title: page.title,
    description: page.description,
    body: page.body,
    kind: page.kind,
    progress: page.progress || false,
    footerNote: page.footerNote || '',
    preload: page.preload || '',
  });
}

async function build() {
  assertUnique();
  assertNavRoutesExist();

  const rendered = pages.map((page) => [page.path, render(page)]);

  /* 404: same shell, no canonical route of its own. */
  const notFound = document_({
    path: '/404',
    canonical: false,
    title: `Page not found | ${SITE.name}`,
    description: 'That page does not exist on CyberSafe SME Nigeria.',
    body: `${hubHero({
      pill: 'Page not found',
      pillIcon: 'search',
      title: 'That page does not exist.',
      lead: 'The link may be old, or the page may have moved as the site grows.',
    })}
${section({
      heading: 'Try one of these instead',
      tint: true,
      inner: `<div class="btns">${btn({ label: 'Back to Home', href: '/', primary: true })}${btn({ label: 'Browse Threats', href: '/threats' })}${btn({ label: 'Browse Resources', href: '/resources' })}</div>`,
    })}`,
  });

  await assertInternalLinksResolve([...rendered, ['/404', notFound]]);
  await cleanGenerated();

  for (const [path, html] of rendered) {
    const file = outputPath(path);
    await mkdir(dirname(file), { recursive: true });
    await writeFile(file, html, 'utf8');
  }
  await writeFile(join(OUT, '404.html'), notFound, 'utf8');

  /* Search index consumed by the header search panel. */
  await writeFile(join(OUT, 'assets/search-index.json'), JSON.stringify(SEARCH), 'utf8');

  /* Sitemap and robots. */
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${pages.map((page) => `  <url><loc>${SITE.origin}${page.path}</loc></url>`).join('\n')}
</urlset>
`;
  await writeFile(join(OUT, 'sitemap.xml'), sitemap, 'utf8');
  await writeFile(join(OUT, 'robots.txt'), `User-agent: *\nAllow: /\n\nSitemap: ${SITE.origin}/sitemap.xml\n`, 'utf8');

  const bytes = await Promise.all(rendered.map(([path]) => stat(outputPath(path)).then((info) => info.size)));
  const total = bytes.reduce((sum, size) => sum + size, 0);
  console.log(`Generated ${pages.length} pages + 404 (${Math.round(total / 1024)} KB of HTML)`);
  console.log(`Search index: ${SEARCH.length} entries, all resolving`);
}

build().catch((error) => {
  console.error(`\nBuild failed: ${error.message}\n`);
  process.exit(1);
});
