import { icon } from '../lib/icons.mjs';
import { hubHero, btn } from '../lib/components.mjs';
import { articlePage, prose } from '../lib/prose.mjs';
import { SITE } from './nav.mjs';

const TEAM = [
  { name: 'Coker Kehinde', initials: 'CK', role: 'Founder & Project Lead', photo: '/assets/photos/coker-kehinde.png' },
  { name: 'Collins Eyetu', initials: 'CE', role: 'Content & Design', photo: '/assets/photos/collins-eyetu.jpg' },
];
// Owner-supplied portraits from pics.zip; original pixels retained.
const MISSION_BLOCKS = [
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
    ];

export function aboutIndexBody() {
  return `${hubHero({
    pill: 'About', pillIcon: 'info', title: 'About CyberSafe SME Nigeria',
    lead: 'Practical cybersecurity knowledge for Nigerian businesses.',
    trail: [{ label: 'Home', href: '/' }, { label: 'About' }],
    buttons: btn({label:'Our Mission',href:'#mission'}) + btn({label:'Meet the Team',href:'#team'}) + btn({label:'Contact',href:'#contact'}),
  })}
<section id="mission" class="about-section rv" aria-labelledby="about-mission-title"><div class="wrap">
<div class="about-section-heading"><span class="ci" aria-hidden="true">${icon('aim')}</span><h2 id="about-mission-title">Our Mission</h2></div>
<div class="about-mission-copy">${prose(MISSION_BLOCKS).replace(/<h2>/g,'<h3>').replace(/<\/h2>/g,'</h3>')}</div>
</div></section>
<section id="team" class="about-section t rv" aria-labelledby="about-team-title"><div class="wrap">
<div class="about-section-heading"><span class="ci b" aria-hidden="true">${icon('users')}</span><h2 id="about-team-title">Our Team</h2></div>
<p>CyberSafe is written and maintained by a small team working on cybersecurity awareness for SMEs.</p>
<div class="about-people">${TEAM.map(person => `<article class="card about-person">${person.photo ? `<img class="about-portrait" src="${person.photo}" alt="${person.name}" width="420" height="448" loading="lazy">` : `<div class="about-initials" aria-hidden="true">${person.initials}</div>`}<div class="about-person-copy"><h3>${person.name}</h3><p class="about-role">${person.role}</p></div></article>`).join('')}</div>
</div></section>
<section id="contact" class="about-section rv" aria-labelledby="about-contact-title"><div class="wrap">
<div class="about-section-heading"><span class="ci" aria-hidden="true">${icon('mail')}</span><h2 id="about-contact-title">Contact</h2></div>
<p>Questions, corrections and suggestions for topics are all welcome. CyberSafe is a knowledge hub, so we cannot take on incident response for you, but we can point you to the right place.</p>
<div class="about-contact-grid">
<div class="card"><div class="ci">${icon('mail')}</div><h3>Email us</h3><p>For corrections, questions about the content, or a topic you would like covered.</p><a class="mail" href="mailto:${SITE.email}">Email CyberSafe SME Nigeria</a></div>
<div class="card"><div class="ci o">${icon('bolt')}</div><h3>Reporting an incident</h3><p>If you suspect a security incident, start with our <a href="/protect-your-business/incident-response">Incident Response guide</a>. For suspected payment fraud, contact your bank or payment provider immediately through an official channel. Use our <a href="/resources/organisations">Cybersecurity Organisations directory</a> to find the right reporting route for your situation.</p><p>CyberSafe does not receive or investigate incident reports. Please do not send us sensitive information.</p></div>
</div>
</div></section>`;
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
      { label: 'Contact', href: '/about/contact' },
    ],
    relatedTitle: 'Also see',
  });
}
