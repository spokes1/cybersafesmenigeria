import { icon } from '../lib/icons.mjs';
import { hubHero, section, iconCard, btn, grid } from '../lib/components.mjs';
import { articlePage } from '../lib/prose.mjs';
import { SITE } from './nav.mjs';

const trail = (label) => [{ label: 'Home', href: '/' }, { label: 'About', href: '/about' }, { label }];

const TEAM = [
  { name: 'Coker Kehinde', initials: 'CK', role: 'Team lead' },
  { name: 'Collins Eyetu', initials: 'CE', role: 'Content' },
  { name: 'Dada Damilare', initials: 'DD', role: 'Content' },
  { name: 'Ehigiator Peter', initials: 'EP', role: 'Research' },
  { name: 'Adebakin Ifeoluwa', initials: 'AI', role: 'Research' },
  { name: 'Ekere Gideon', initials: 'EG', role: 'Design' },
];

export function aboutIndexBody() {
  return `${hubHero({
    pill: 'About',
    pillIcon: 'info',
    title: 'About CyberSafe',
    lead: 'A cybersecurity knowledge hub for Nigerian small and medium businesses. Free to read, and built for people who do not have a security team.',
    trail: [{ label: 'Home', href: '/' }, { label: 'About' }],
  })}
<section class="t rv"><div class="wrap split"><div><h2>Most security advice is written for organisations that have staff to implement it.</h2></div><div class="body"><p>Nigerian SMEs are dealing with the same fraud and account takeovers as large companies, with none of the same support. CyberSafe was put together to close part of that gap: plain explanations, steps that fit a small business, and the local reporting routes in one place.</p><p>We publish knowledge. We do not sell security services, monitor your systems or audit your business.</p></div></div></section>
${section({
    heading: 'What CyberSafe is, and what it is not',
    inner: `${grid([
      iconCard({ iconName: 'book', title: 'What it is', copy: 'A free knowledge hub: explanations of common threats, practical steps for accounts, payments and devices, a security self-check, and links to the Nigerian bodies that handle incidents and data protection.' }),
      iconCard({ iconName: 'info', tone: 'o', title: 'What it is not', copy: 'Not a consultancy, a managed security provider, a security operations centre or a penetration-testing firm. Nothing here replaces professional advice where a business genuinely needs it, and we will say so where that is the case.' }),
    ], false)}<div class="btns" style="margin-top:28px">${btn({ label: 'Read Our Mission', href: '/about/mission', primary: true, arrow: true })}${btn({ label: 'Meet the Team', href: '/about/team' })}</div>`,
  })}
${section({
    heading: 'Where to go next',
    tint: true,
    inner: grid([
      { title: 'Our Mission', copy: 'Why this exists and how the content is chosen.', href: '/about/mission', iconName: 'aim', tone: '' },
      { title: 'Meet the Team', copy: 'The people writing and maintaining CyberSafe.', href: '/about/team', iconName: 'users', tone: 'b' },
      { title: 'Contact', copy: 'Corrections, questions and suggestions for topics.', href: '/about/contact', iconName: 'mail', tone: 'g' },
    ].map((item) => iconCard(item))),
  })}`;
}

export function missionBody() {
  return articlePage({
    section: 'About',
    title: 'Our Mission',
    lede: 'To make cybersecurity understandable and actionable for Nigerian businesses that do not have anyone whose job it is.',
    trail: trail('Our Mission'),
    blocks: [
      ['p', 'A shop in Ikeja, a logistics firm in Aba and a two-person agency in Port Harcourt all face the same fraud as a bank: fake credit alerts, hijacked WhatsApp accounts, invoices with altered account numbers, phishing aimed at the one mailbox that resets everything else. What they do not have is a security team, a training budget, or time to read a forty-page framework.'],
      ['p', 'CyberSafe exists to translate. We take the security practices that genuinely reduce risk, strip out the vocabulary that gets in the way, and write them as steps a business owner can act on the same day.'],
      ['h2', 'How we decide what to publish'],
      ['ul', [
        '**Local first.** If a threat is common against Nigerian businesses, it gets covered before something that is merely interesting.',
        '**Actionable over complete.** Five steps someone will actually take beat forty they will not.',
        '**Plain language before terminology.** Where a technical term is unavoidable, we explain it in the same sentence.',
        '**No invented numbers.** We do not publish statistics, percentages or claims we cannot support. If we do not know, we leave it out.',
        '**Free and open.** No paywall, no account, no email capture before you can read something.',
      ]],
      ['h2', 'What we will not do'],
      ['p', 'We will not present ourselves as a security vendor, recommend a product because someone paid us, or use fear to push a business into a purchase. Where a business needs professional help, such as a real audit, incident response or compliance work, the honest answer is to say so, and we will.'],
      ['h2', 'How this is built'],
      ['p', 'CyberSafe is developed in phases. The published pages cover threats, account and payment security, incident response, a security self-check and a set of vetted external resources. More topics are being written, and each one is listed in the [Learn](/learn) index whether it is finished or not, so you can see what is coming rather than guessing.'],
      ['h2', 'Corrections welcome'],
      ['p', 'Security guidance goes out of date, and settings menus move. If something here is wrong, unclear or no longer matches what you see on screen, tell us at [' + SITE.email + '](mailto:' + SITE.email + ') and we will fix it.'],
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
    inner: `<div class="grid g3">${TEAM.map(
      (person) => `<div class="card person"><span class="ci" aria-hidden="true">${person.initials}</span><div><h3>${person.name}</h3><p>${person.role}</p></div></div>`
    ).join('')}</div><p class="fine">The platform is supported by <a href="https://www.go2cyber.org" target="_blank" rel="noopener noreferrer">Go2Cyber<span class="sr-only"> (opens in a new tab)</span></a>, which runs cybersecurity awareness training.</p>`,
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
<div class="card"><div class="ci o">${icon('bolt')}</div><h2 style="font-size:21px">Reporting an incident</h2><p>If something has already happened, report it to ngCERT and, where money is involved, your bank and the EFCC. Our incident page lists the steps in order.</p><a class="more" href="/protect-your-business/incident-response">Incident response steps${icon('arrow')}</a></div>
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
      ['p', 'Nothing. This site has no sign-up, no contact form, no newsletter and no analytics or advertising scripts. We do not set tracking cookies and we do not build a profile of you.'],
      ['h2', 'The security checklist'],
      ['p', 'When you tick items on the [security checklist](/resources/security-checklist), your ticks are saved in your own browser using local storage so the page remembers them on your next visit. That data never leaves your device and we cannot see it. Clearing your browser data removes it, and the page has a "Clear all ticks" button.'],
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
      ['p', 'The checklist is a self-assessment to help you see gaps. A full score does not mean your business is secure, and it is not a certification or a compliance statement.'],
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
