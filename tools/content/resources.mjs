import { icon } from '../lib/icons.mjs';
import { hubHero, section, iconCard, btn, artHero, artSection, keepLearning } from '../lib/components.mjs';
import { RESOURCE_CATEGORIES, CHECKLIST, CHECKLIST_TOTAL } from './catalog.mjs';

const trail = (label) => [{ label: 'Home', href: '/' }, { label: 'Resources', href: '/resources' }, { label }];

const ORGANISATIONS = [
  {
    mark: 'NITDA',
    title: 'National Information Technology Development Agency',
    copy: 'Publishes Nigeria\'s IT standards and cybersecurity guidelines, including guidance aimed at MSMEs.',
    href: 'https://nitda.gov.ng',
  },
  {
    mark: 'ngCERT',
    title: 'Nigeria Computer Emergency Response Team',
    copy: 'The national body for cyber incident reporting and advisories. This is where you report an incident.',
    href: 'https://cert.gov.ng',
    linkLabel: 'Report an incident',
  },
  {
    mark: 'NDPC',
    title: 'Nigeria Data Protection Commission',
    copy: 'Oversees the Nigeria Data Protection Act. Relevant to any business holding customer or staff records.',
    href: 'https://ndpc.gov.ng',
  },
  {
    mark: 'CBN',
    title: 'Central Bank of Nigeria',
    copy: 'Consumer protection guidance, e-payment directives and fraud notices affecting business banking.',
    href: 'https://www.cbn.gov.ng',
  },
  {
    mark: 'EFCC',
    title: 'Economic and Financial Crimes Commission',
    copy: 'Handles online fraud and financial cybercrime, including fraudulent transfers.',
    href: 'https://www.efcc.gov.ng',
  },
  {
    mark: 'NCC',
    title: 'Nigerian Communications Commission',
    copy: 'Regulates mobile operators. Relevant for SIM registration disputes and telecoms complaints.',
    href: 'https://www.ncc.gov.ng',
  },
];

const TOOLS = [
  {
    mark: 'BW',
    title: 'Bitwarden',
    copy: 'Password manager with a free tier that covers a small team. Stores every login behind one master passphrase.',
    href: 'https://bitwarden.com',
  },
  {
    mark: 'HIBP',
    title: 'Have I Been Pwned',
    copy: 'Check whether a business email address has appeared in a known data breach. Free, no sign-up needed.',
    href: 'https://haveibeenpwned.com',
  },
  {
    mark: 'VT',
    title: 'VirusTotal',
    copy: 'Scan a suspicious file or link against dozens of engines before you open it.',
    href: 'https://www.virustotal.com',
  },
  {
    mark: 'AUTH',
    title: 'Authy',
    copy: 'Authenticator app for two-factor codes, with encrypted backup if you change phones.',
    href: 'https://authy.com',
  },
  {
    mark: 'GA',
    title: 'Google Authenticator',
    copy: 'Free authenticator app. Generates 2FA codes on the device, so a SIM swap cannot intercept them.',
    href: 'https://support.google.com/accounts/answer/1066447',
  },
];

const EXTERNAL = [
  {
    mark: 'NCSC',
    title: 'UK NCSC — Small Business Guide',
    copy: 'Short, practical guidance written for organisations without security staff. Applies well outside the UK.',
    href: 'https://www.ncsc.gov.uk/collection/small-business-guide',
  },
  {
    mark: 'CISA',
    title: 'CISA — Cybersecurity for Small Business',
    copy: 'US government resources, including free tools and plain-language explainers.',
    href: 'https://www.cisa.gov/cybersecurity-best-practices',
  },
  {
    mark: 'NIST',
    title: 'NIST Small Business Cybersecurity Corner',
    copy: 'Reference material and planning guides from the US standards body.',
    href: 'https://www.nist.gov/itl/smallbusinesscyber',
  },
  {
    mark: 'APWG',
    title: 'Anti-Phishing Working Group',
    copy: 'Reports and reference material on phishing trends, plus an address for reporting phishing messages.',
    href: 'https://apwg.org',
  },
  {
    mark: 'NPR',
    title: 'No More Ransom',
    copy: 'A joint law-enforcement project offering free decryption tools for some ransomware families.',
    href: 'https://www.nomoreransom.org',
  },
];

/* ---------- Pages ---------- */
const TONES = ['', 'g', 'b'];

/** Organisation, tool or reference link: the short name as a tag, then title and copy. */
const linkCard = (item, i) =>
  iconCard({ iconName: '', tag: item.mark, title: item.title, copy: item.copy, href: item.href, more: item.linkLabel || 'Visit site', ext: true });

export function resourcesIndexBody() {
  return `${hubHero({
    pill: `${RESOURCE_CATEGORIES.length} categories`,
    pillIcon: 'folder',
    title: 'Resources',
    lead: 'Guides, checklists, downloads and links to the organisations that can help — gathered so you are not searching for them mid-incident.',
    trail: [{ label: 'Home', href: '/' }, { label: 'Resources' }],
  })}
${section({
    heading: 'Browse by category',
    tint: true,
    inner: `<div class="grid g3">${RESOURCE_CATEGORIES.map((c, i) =>
      iconCard({ iconName: c.iconName, tone: TONES[i % TONES.length], title: c.name, copy: c.copy, href: c.href })
    ).join('')}</div>`,
  })}
<section class="rv"><div class="wrap split"><div><h2>The security self-check</h2><p class="sub">${CHECKLIST_TOTAL} questions about the basics. Your answers stay in your browser — nothing is submitted anywhere.</p><div class="btns">${btn({ label: 'Start the Security Checklist', href: '/resources/security-checklist', primary: true })}</div></div>
<div>${iconCard({
    iconName: 'headphones',
    tone: 'b',
    title: 'Prefer to listen?',
    copy: 'A short audio briefing on the security steps that matter most for a small business.',
    href: '/resources/audio-guide',
    more: 'Open the Audio Guide',
  })}</div></div></section>`;
}

export function checklistPageBody() {
  const groups = CHECKLIST.map(
    (group) => `<fieldset class="chk"><legend class="sr-only">${group.group}</legend><h2>${group.group}</h2>${group.items
      .map((item) => `<label><input type="checkbox" value="${item.id}"><span>${item.text}</span></label>`)
      .join('')}</fieldset>`
  ).join('');

  return `${artHero({
    pill: `Resources · ${CHECKLIST_TOTAL} items`,
    pillIcon: 'list',
    title: 'Security Checklist',
    lead: 'Work down the list and see where the gaps are. This is an awareness self-check, not a professional security audit.',
    trail: trail('Security Checklist'),
  })}
<div class="wrap art-main">
<div class="chk-grid rv">
<form id="checklist">${groups}</form>
<aside class="score chk" aria-label="Your progress">
<div class="ph"><div class="ring"><svg viewBox="0 0 76 76" aria-hidden="true"><circle cx="38" cy="38" r="32" stroke="var(--line)"/><circle id="score-ring" class="rg" cx="38" cy="38" r="32"/></svg><b><span id="score-count">0</span></b></div><div><strong>of ${CHECKLIST_TOTAL}</strong><span>Items ticked</span></div></div>
<p id="score-label" aria-live="polite">Nothing ticked yet. Work down the list at your own pace.</p>
<p class="priv">Your ticks are saved in this browser only. Nothing is sent to us, and there is no account to create.</p>
${btn({ label: 'Download the Checklist', href: '/resources/downloads', iconName: 'download' })}
<button type="button" class="btn q" id="score-reset">Clear all ticks</button>
</aside>
</div>
${artSection({
    iconName: 'arrow',
    heading: 'Unticked items are your reading list',
    extraClass: 'sec-end',
    inner: `<p>Take the first one you left blank and start there.</p><div class="grid">${[
      { title: 'Account Security', href: '/protect-your-business/account-security', copy: 'Passwords, 2FA and who has access.', iconName: 'key' },
      { title: 'Payment Security', href: '/protect-your-business/payment-security', copy: 'Confirming credits and account changes.', iconName: 'money' },
      { title: 'Backup & Recovery', href: '/learn/backup-and-recovery', copy: 'The 3-2-1 rule, applied to a small business.', iconName: 'cloud' },
    ]
      .map((item) => `<a class="card" href="${item.href}"><div class="ci"><svg class="i" aria-hidden="true"><use href="/assets/icons.svg#${item.iconName}"/></svg></div><h3>${item.title}</h3><p>${item.copy}</p><span class="more">Open<svg class="i" aria-hidden="true"><use href="/assets/icons.svg#arrow"/></svg></span></a>`)
      .join('')}</div>`,
  })}
</div>`;
}

export function guidesIndexBody() {
  return `${hubHero({
    pill: 'Resources',
    pillIcon: 'book',
    title: 'Guides',
    lead: 'Longer, step-by-step explanations of the topics that come up most often.',
    trail: trail('Guides'),
  })}
${section({
    heading: 'Published guides',
    tint: true,
    inner: `<div class="grid g3">${[
      { title: 'Phishing: How Nigerian SMEs Are Targeted and What to Do About It', category: 'Featured guide', copy: 'The four phishing messages you are most likely to receive, and the rule that stops each one.', href: '/learn/phishing-guide', iconName: 'mail', tone: 'b' },
      { title: 'How to Secure Your Business Email', category: 'Email', copy: 'Five settings to change today, including the mailbox rule check almost everyone skips.', href: '/learn/email-security', iconName: 'mail', tone: '' },
      { title: 'How to Protect Your Business WhatsApp', category: 'Accounts', copy: 'Two-step verification, linked devices, and what to do if the account is taken.', href: '/learn/whatsapp-security', iconName: 'chat', tone: 'g' },
      { title: 'Password Security Without Memorising Twenty Passwords', category: 'Accounts', copy: 'Why reuse is the real problem, and how a password manager fixes it for a small team.', href: '/learn/password-security', iconName: 'lock', tone: '' },
      { title: 'Backup & Recovery for a Small Business', category: 'Data', copy: 'The 3-2-1 rule, a routine that survives a busy month, and testing a restore.', href: '/learn/backup-and-recovery', iconName: 'cloud', tone: 'b' },
      { title: 'What to Do in the First Hour of an Incident', category: 'Response', copy: 'Contain, cut access, stop the money, preserve evidence, tell the people affected.', href: '/protect-your-business/incident-response', iconName: 'bolt', tone: 'o' },
    ]
      .map((g) => iconCard({ iconName: g.iconName, tone: g.tone, tag: g.category, title: g.title, copy: g.copy, href: g.href, more: 'Read' }))
      .join('')}</div>`,
  })}
<section class="rv" style="padding-top:0;margin-top:72px"><div class="wrap"><div class="tip"><div class="big"><svg class="i" aria-hidden="true"><use href="/assets/icons.svg#bulb"/></svg></div><div><h2>One tip worth repeating</h2><p>Changed bank details? Call the supplier on a number you already have and confirm before you pay. Two minutes, and it defeats the most expensive fraud aimed at Nigerian SMEs.</p></div>${btn({ label: 'Read the Phishing Guide', href: '/learn/phishing-guide', arrow: true })}</div></div></section>`;
}

function linkListPage({ title, lead, items, fine }) {
  return `${hubHero({ pill: 'Resources', pillIcon: 'ext', title, lead, trail: trail(title) })}
${section({ tint: true, inner: `<div class="grid">${items.map(linkCard).join('')}</div><p class="fine">${fine}</p>` })}`;
}

export function organisationsBody() {
  return linkListPage({
    title: 'Cybersecurity Organisations',
    lead: 'Nigerian bodies with a role in cybersecurity, fraud and data protection — and what each one is actually useful for.',
    items: ORGANISATIONS,
    fine: 'CyberSafe is not affiliated with any of these organisations. The links are provided because these are the official channels a Nigerian business would use.',
  });
}

export function externalBody() {
  return linkListPage({
    title: 'External Resources',
    lead: 'Reference material from established security bodies. Useful when you want more depth than a summary page.',
    items: EXTERNAL,
    fine: 'Some of this guidance is written for other countries. The technical advice carries over; the reporting routes do not — use the <a href="/resources/organisations">Nigerian organisations</a> page for those.',
  });
}

export function toolsBody() {
  return linkListPage({
    title: 'Tools',
    lead: 'Free and low-cost tools worth knowing about. Nothing here is sponsored, and CyberSafe earns nothing from these links.',
    items: TOOLS,
    fine: 'Tools help, but they are the second step. A password manager only pays off once you stop reusing passwords, and an authenticator app only helps once 2FA is switched on.',
  });
}

export function audioGuideBody() {
  return `${hubHero({
    pill: 'Resources',
    pillIcon: 'headphones',
    title: 'Audio Guide',
    lead: 'A short spoken briefing on the security steps that matter most for a small business, prepared by the CyberSafe team.',
    trail: trail('Audio Guide'),
  })}
${section({
    tint: true,
    inner: `<div class="card audio"><div class="ci b"><svg class="i" aria-hidden="true"><use href="/assets/icons.svg#headphones"/></svg></div><h2 style="font-size:24px">Cybersecurity basics for Nigerian SMEs</h2><p>Roughly three minutes. Useful to play for staff who would rather listen than read.</p>
<audio controls preload="metadata"><source src="/audio_file.mp4" type="audio/mp4">Your browser cannot play this audio file. You can download it and play it in another app.</audio>
<p class="fine" style="margin:0">Prefer to read? The same ground is covered in <a href="/learn/cybersecurity-basics">Cybersecurity Basics</a>.</p></div>`,
  })}`;
}
