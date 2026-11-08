import { icon } from '../lib/icons.mjs';
import { hubHero, section, iconCard, btn, grid } from '../lib/components.mjs';
import { articlePage, inline } from '../lib/prose.mjs';
import { SITE } from './nav.mjs';

const trail = (label) => [{ label: 'Home', href: '/' }, { label: 'About', href: '/about' }, { label }];

const TEAM = [
  { name: 'Coker Kehinde', initials: 'CK', role: 'Team lead' },
  { name: 'Collins Eyetu', initials: 'CE', role: 'Content' },
];

export function aboutIndexBody() {
  const benefits = [
    '**Understand common threats.** Learn how phishing, fake bank alerts, account hijacking and other scams work.',
    '**Protect everyday business activities.** Find practical steps for accounts, payments, phones, computers and important records.',
    '**Review your security habits.** Use our free 15-question Security Self-Check to identify practices to improve or verify.',
    '**Use practical resources.** Access printable security cards, templates and trusted external learning materials.',
    '**Know where to turn.** Find general incident-response guidance and links to appropriate Nigerian organisations.',
  ];
  return `${hubHero({
    pill: 'About',
    pillIcon: 'info',
    title: 'About CyberSafe SME Nigeria',
    lead: 'Practical cybersecurity knowledge for Nigerian businesses.',
    trail: [{ label: 'Home', href: '/' }, { label: 'About' }],
  })}
<section class="t rv"><div class="wrap about-intro"><p>Running a business involves more than serving customers and managing daily operations. It also means protecting payments, business accounts, customer information and the digital tools people rely on.</p><p>CyberSafe SME Nigeria is a free cybersecurity awareness and learning platform created to make that responsibility easier to understand.</p><p>We help small-business owners and their teams recognise common online threats, develop safer everyday habits and find practical guidance when something goes wrong.</p></div></section>
${section({
    heading: 'Why CyberSafe exists',
    inner: `<div class="about-prose"><p>Not every business has an IT department or a cybersecurity specialist. Yet a small shop, online seller, growing company or independent professional may depend on digital payments, WhatsApp, email and connected devices every day.</p><p>CyberSafe helps bridge the knowledge gap by making cybersecurity information easier to access, understand and apply.</p></div>`,
  })}
${section({
    heading: 'What you can do with CyberSafe',
    tint: true,
    inner: `<ul class="about-benefits">${benefits.map((item) => `<li>${inline(item)}</li>`).join('')}</ul><div class="btns about-actions">${btn({ label: 'Start the Security Self-Check', href: '/resources/security-checklist', primary: true, arrow: true })}${btn({ label: 'Read Our Mission', href: '/about/mission' })}${btn({ label: 'Meet the Team', href: '/about/team' })}</div>`,
  })}
${section({
    heading: 'A resource built for learning',
    inner: `<div class="about-prose"><p>CyberSafe focuses on education, not selling cybersecurity products or services.</p><p>We do not monitor businesses, conduct security audits, investigate incidents or guarantee protection. Where specialist assistance is needed, we encourage businesses to seek qualified support.</p><p><strong>Our goal is simple: help Nigerian businesses make more informed cybersecurity decisions, one practical step at a time.</strong></p></div>`,
  })}
${section({
    heading: 'Where to go next',
    tint: true,
    inner: grid([
      { title: 'Our Mission', copy: 'Why this exists and how we approach cybersecurity education.', href: '/about/mission', iconName: 'aim', tone: '' },
      { title: 'Meet the Team', copy: 'The people maintaining CyberSafe.', href: '/about/team', iconName: 'users', tone: 'b' },
      { title: 'Contact', copy: 'Corrections, questions and suggestions for topics.', href: '/about/contact', iconName: 'mail', tone: 'g' },
    ].map((item) => iconCard(item))),
  })}`;
}

export function missionBody() {
  return articlePage({
    section: 'About',
    title: 'Our Mission',
    lede: 'Making cybersecurity knowledge accessible, practical and relevant to Nigerian SMEs.',
    trail: trail('Our Mission'),
    blocks: [
      ['p', 'Our mission is to help Nigerian small and medium-sized businesses understand digital threats, adopt safer everyday practices and make informed decisions when cybersecurity incidents occur.'],
      ['p', 'We believe useful cybersecurity knowledge should not depend on the size of a business, its technical expertise or its ability to pay for specialist advice.'],
      ['h2', 'Why this matters'],
      ['p', 'Digital tools help businesses communicate, receive payments, manage customers and deliver services. They also introduce risks that are not always easy to recognise.'],
      ['p', 'A suspicious WhatsApp message, altered supplier invoice or compromised business email account can create serious difficulties for a small business.'],
      ['p', 'Business owners and employees need guidance they can understand and apply without first becoming cybersecurity professionals.'],
      ['h2', 'How we approach cybersecurity education'],
      ['ul', [
        '**Relevant to Nigeria.** We prioritise situations that Nigerian businesses can recognise, while drawing on reliable local and international guidance.',
        '**Practical, not complicated.** We explain what can go wrong, what to look out for and which reasonable steps people can take.',
        '**Clear and responsible.** We avoid unsupported statistics, exaggerated claims, unnecessary fear and promises of guaranteed protection.',
        '**Free to access.** Visitors can read our educational content and use our available resources without creating an account or paying a subscription.',
        '**Open to correction.** Cybersecurity guidance evolves. We aim to review our content, verify important sources and correct information when necessary.',
      ]],
      ['h2', 'What we hope to achieve'],
      ['p', 'We want CyberSafe to become a useful starting point for Nigerian businesses looking to strengthen their cybersecurity awareness.'],
      ['p', 'That means helping more business owners recognise suspicious requests, verify payments, protect important accounts, safeguard business information and know the appropriate first actions when something goes wrong.'],
      ['p', 'We will continue improving our guidance and learning resources as the platform develops.'],
      ['h2', 'Our commitment'],
      ['p', 'CyberSafe SME Nigeria is an independent educational initiative, not a cybersecurity consultancy, incident-response provider or certification body.'],
      ['p', 'We aim to provide trustworthy starting guidance while recognising that some problems require qualified technical, financial or legal assistance.'],
      ['p', '**Safer business practices begin with better understanding and consistent action.**'],
    ],
    related: [
      { label: 'About CyberSafe', href: '/about' },
      { label: 'Meet the team', href: '/about/team' },
      { label: 'Contact', href: '/about/contact' },
    ],
  });
}

export function teamBody() {
  return `${hubHero({
    pill: 'About',
    pillIcon: 'users',
    title: 'Meet the Team',
    lead: 'CyberSafe is written and maintained by a small Nigerian team working on cybersecurity awareness for SMEs.',
    trail: trail('Meet the Team'),
  })}
${section({
    tint: true,
    inner: `<div class="grid about-team-grid">${TEAM.map(
      (person) => `<div class="card person"><span class="ci" aria-hidden="true">${person.initials}</span><div><h3>${person.name}</h3><p>${person.role}</p></div></div>`
    ).join('')}</div>`,
  })}`;
}

export function contactBody() {
  return `${hubHero({
    pill: 'About',
    pillIcon: 'mail',
    title: 'Contact',
    lead: 'Questions, corrections and suggestions for topics are all welcome. CyberSafe is a knowledge hub, so we cannot take on incident response for you, but we can point you to the right place.',
    trail: trail('Contact'),
  })}
${section({
    tint: true,
    inner: `<div class="grid">
<div class="card"><div class="ci">${icon('mail')}</div><h2 style="font-size:21px">Email us</h2><p>For corrections, questions about the content, or a topic you would like covered.</p><a class="mail" href="mailto:${SITE.email}">${SITE.email}</a></div>
<div class="card"><div class="ci o">${icon('bolt')}</div><h2 style="font-size:21px">Reporting an incident</h2><p>If you suspect a security incident, start with our <a href="/protect-your-business/incident-response">Incident Response guide</a>. For suspected payment fraud, contact your bank or payment provider immediately through an official channel. Use our <a href="/resources/organisations">Cybersecurity Organisations directory</a> to find the right reporting route for your situation.</p><p>CyberSafe does not receive or investigate incident reports. Please do not send us sensitive information.</p></div>
</div><p class="fine">Please do not send passwords, OTPs, BVN details, card numbers or customer records to us. We never need them, and no legitimate organisation will ask you for them by email.</p>`,
  })}
${section({
    heading: 'Social channels are not live yet',
    sub: 'When LinkedIn, X and Instagram accounts are set up, they will be linked in the footer. Until then, email is the reliable route.',
  })}`;
}

export function privacyBody() {
  return articlePage({
    section: 'Legal',
    title: 'Privacy Policy',
    lede: 'CyberSafe is a static website. It has no accounts, no forms and no analytics, so there is very little to tell you.',
    trail: [{ label: 'Home', href: '/' }, { label: 'Privacy Policy' }],
    blocks: [
      ['h2', 'What we collect'],
      ['p', 'We do not require a visitor account and we do not use analytics or advertising scripts. The site has no online contact-submission form. The Security Self-Check is an optional assessment that works in your browser. We do not set tracking cookies or create behavioural profiles. Ordinary hosting and font requests still involve technical data such as IP addresses, as explained below.'],
      ['h2', 'The security checklist'],
      ['p', 'The [15-question Business Security Self-Check](/resources/security-checklist) stores your selected answers and any optional business or team name in this browser using local storage (`cybersafe.selfcheck.v2`) so you can return to your assessment. These responses are processed locally to display your self-reported checklist-practice progress and printable action plan; they are not submitted to CyberSafe. The page has a "Clear my answers on this device" button, or you can remove the data through browser storage settings. The earlier 16-item checklist used a separate v1 storage entry: it is not imported into the new assessment or automatically deleted. If browser storage is disabled, the assessment still works during the open page session but will not be saved. Do not enter passwords, verification codes or private customer details.'],
      ['h2', 'Fonts and hosting'],
      ['p', 'Typefaces are loaded from Google Fonts, which means your browser makes a request to Google\'s servers and they will see your IP address as part of serving that file. The site is hosted on Netlify, whose servers process standard request logs. Neither is used by us for tracking.'],
      ['h2', 'Links out'],
      ['p', 'We link to government agencies, security bodies and tools. Once you follow a link, that organisation\'s own privacy policy applies. We are not affiliated with any of them.'],
      ['h2', 'Email'],
      ['p', 'If you email us, we will have your message and your address, and we will use them only to reply. Please do not send passwords, OTPs, BVN details, card numbers or customer records.'],
      ['h2', 'Questions'],
      ['p', 'Write to [' + SITE.email + '](mailto:' + SITE.email + '). If this policy changes, the updated version will appear on this page.'],
    ],
    related: [
      { label: 'Terms of use', href: '/terms' },
      { label: 'Contact', href: '/about/contact' },
    ],
    relatedTitle: 'Also see',
  });
}

export function termsBody() {
  return articlePage({
    section: 'Legal',
    title: 'Terms of Use',
    lede: 'What CyberSafe is for, and the limits of what you should rely on it for.',
    trail: [{ label: 'Home', href: '/' }, { label: 'Terms of Use' }],
    blocks: [
      ['h2', 'General information, not professional advice'],
      ['p', 'Everything on CyberSafe is general cybersecurity awareness information for small and medium businesses. It is not a security audit, an incident response service or professional advice about your specific systems. Where the stakes are high, such as a live incident, a regulatory question or a significant loss, get qualified help.'],
      ['h2', 'The security checklist'],
      ['p', 'The 15-question Self-Check reports self-reported checklist-practice progress and suggests practical improvements. It does not measure overall security risk, grade the business, certify compliance or guarantee protection.'],
      ['h2', 'External links and tools'],
      ['p', 'We link to third-party organisations and tools because we think they are useful. We do not control them, we are not affiliated with them, we receive nothing for linking to them, and we cannot be responsible for their content, availability or terms.'],
      ['h2', 'Accuracy'],
      ['p', 'We work to keep pages correct and current, but software menus change and threats evolve. Content is provided as-is, without warranty. If you spot something wrong, please tell us so we can correct it.'],
      ['h2', 'Liability'],
      ['p', 'CyberSafe SME Nigeria is not liable for loss or damage arising from actions taken on the basis of information on this site. You remain responsible for decisions about your own business.'],
      ['h2', 'Content'],
      ['p', 'You are welcome to read, print and share these pages with your staff, with attribution. Please do not republish them as your own work.'],
      ['h2', 'Contact'],
      ['p', 'Questions about these terms: [' + SITE.email + '](mailto:' + SITE.email + ').'],
    ],
    related: [
      { label: 'Privacy policy', href: '/privacy' },
      { label: 'Contact', href: '/about/contact' },
    ],
    relatedTitle: 'Also see',
  });
}
