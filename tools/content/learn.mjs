import { hubHero, section, iconCard, btn, artSection, iconFor } from '../lib/components.mjs';
import { articlePage } from '../lib/prose.mjs';

const trail = (label) => [{ label: 'Home', href: '/' }, { label: 'Learn', href: '/learn' }, { label }];

/* ------------------------------------------------------------
   Topic index. `live: false` renders a placeholder page instead
   of an article, so a new topic only needs its blocks written.
   ------------------------------------------------------------ */
export const LEARN_TOPICS = [
  { slug: 'cybersecurity-basics', name: 'Cybersecurity Basics', copy: 'Understand the five parts of your digital business, choose a first security action and build five safer habits in one week.', live: true },
  { slug: 'password-security', name: 'Password Security', copy: 'How to give every work account its own password without memorising twenty of them.', live: true },
  { slug: 'email-security', name: 'Email Security', copy: 'Email resets every other account you own. Lock it down first.', live: true },
  { slug: 'whatsapp-security', name: 'WhatsApp Security', copy: 'Secure your business number, messages and linked devices with a safer opening-to-closing routine.', live: true },
  { slug: 'employee-security', name: 'Employee Security', copy: 'What to tell a new staff member on day one, and what to do the day someone leaves.', live: true },
  { slug: 'backup-and-recovery', name: 'Backup & Recovery', copy: 'A backup routine a small business can genuinely keep up with.', live: true },
  { slug: 'mobile-security', name: 'Mobile Security', copy: 'Set up safer iPhone and Android settings and prepare for a lost or stolen business phone.', live: true },
  { slug: 'business-wifi', name: 'Business Wi-Fi', copy: 'Router settings, guest access and why one shared password is a problem.', live: true },
  { slug: 'social-media-security', name: 'Social Media Security', copy: 'Secure Facebook, Instagram and WhatsApp Business, manage access and recognise fake business profiles.', live: true },
  { slug: 'data-protection', name: 'Data Protection', copy: 'Collect, use, store and share customer information responsibly and understand the Nigeria Data Protection Act.', live: true },
];

/* ---------- Articles ---------- */
export const LEARN_ARTICLES = {
  // The approved Phishing Guide is generated from approved/phishing-guide.html.

};

// Routes served by the approved designs rather than the article blocks above.
export const APPROVED_LEARN = ['cybersecurity-basics', 'whatsapp-security', 'password-security', 'backup-and-recovery', 'business-wifi', 'phishing-guide', 'email-security', 'mobile-security', 'social-media-security', 'employee-security', 'data-protection'];

const TONES = ['', 'b', 'g', 'o'];

export function learnIndexBody() {
  const live = LEARN_TOPICS.filter((topic) => topic.live);
  const card = (topic, i, more) =>
    iconCard({ iconName: iconFor(`/learn/${topic.slug}`), tone: TONES[i % TONES.length], title: topic.name, copy: topic.copy, href: `/learn/${topic.slug}`, more });

  return `${hubHero({
    pill: `${LEARN_TOPICS.length} topics`,
    pillIcon: 'book',
    title: 'Learn',
    lead: 'Plain-language explanations of the security topics that affect how a small business runs day to day.',
    trail: [{ label: 'Home', href: '/' }, { label: 'Learn' }],
  })}
${section({
    heading: 'Available now',
    sub: 'Written for owners and staff, not for IT departments. Each topic ends with something you can do the same day.',
    tint: true,
    inner: `<div class="grid g3">${iconCard({
      iconName: 'mail',
      tone: 'b',
      tag: 'Featured guide',
      title: 'Phishing: How Nigerian SMEs Are Targeted and What to Do About It',
      copy: 'Four worked business examples and a short exercise for recognising and verifying suspicious requests.',
      href: '/learn/phishing-guide',
      more: 'Read',
    })}${iconCard({ iconName: 'shield', tone: 'g', tag: 'Interactive practice', title: 'Spot the Scam with Kenny', copy: 'Try five short scam scenarios, check your choices and follow real CyberSafe guides. No timer or sign-in.', href: '/learn/spot-the-scam', more: 'Play' })}${live.map((t, i) => card(t, i, 'Read')).join('')}</div>`,
  })}
${section({
    heading: 'New to cybersecurity? Start here.',
    sub: 'Three guides to help you understand your risks, secure an important account and recognise a suspicious message.',
    inner: `<ol class="beginner-path"><li><span class="beginner-path-num" aria-hidden="true">1</span><div><a href="/learn/cybersecurity-basics">Cybersecurity Basics</a><p>Understand the everyday parts of your digital business.</p></div></li><li><span class="beginner-path-num" aria-hidden="true">2</span><div><a href="/learn/password-security">Password Security</a><p>Make your account sign-ins safer with unique passwords and added verification.</p></div></li><li><span class="beginner-path-num" aria-hidden="true">3</span><div><a href="/learn/phishing-guide">Phishing Guide</a><p>Practise checking messages and verifying unexpected requests.</p></div></li></ol><p class="beginner-path-cta">${btn({ label: 'Start the Security Self-Check', href: '/resources/security-checklist', primary: true, arrow: true })}</p>`,
  })}`;
}

export function learnPages() {
  return Object.entries(LEARN_ARTICLES).filter(([slug]) => !APPROVED_LEARN.includes(slug)).map(([slug, article]) => ({
    path: `/learn/${slug}`,
    title: `${article.name} | CyberSafe SME Nigeria`,
    description: article.lede,
    kind: 'art',
    section: 'Learn',
    navLabel: article.name,
    keywords: `learn ${article.name}`,
    body: articlePage({
      section: 'Learn',
      title: article.name,
      lede: article.lede,
      trail: trail(article.name),
      blocks: article.blocks,
      related: article.related,
      extra: article.extra || '',
    }),
  }));
}
