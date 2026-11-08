import { hubHero, section, iconCard, btn } from '../lib/components.mjs';
import { articlePage } from '../lib/prose.mjs';

const trail = (label) => [
  { label: 'Home', href: '/' },
  { label: 'Protect Your Business', href: '/protect-your-business' },
  { label },
];

export const PROTECT_AREAS = [
  {
    // Article body and SEO live in tools/content/approved/account-security.html
    // and tools/build.mjs. Keep this metadata for the Protect index card.
    slug: 'account-security',
    iconName: 'key',
    name: 'Account Security',
    card: 'Stop one stolen password from opening every door in your business.',
    ctaLabel: 'Secure Accounts',
  },
  {
    // Article body and SEO live in tools/content/approved/payment-security.html
    // and tools/build.mjs. Keep this metadata for the Protect index card.
    slug: 'payment-security',
    iconName: 'money',
    name: 'Payment Security',
    card: 'Verify incoming payments and supplier account details before you release goods or send money.',
    ctaLabel: 'Secure Payments',
  },
  {
    // Full approved article source: tools/content/approved/device-security.html.
    slug: 'device-security',
    iconName: 'laptop',
    name: 'Device Security',
    card: 'Protect shared computers, phones and work devices with supported updates, appropriate access and reliable recovery.',
    ctaLabel: 'Secure Devices',
  },
  {
    slug: 'incident-response',
    iconName: 'bolt',
    name: 'Incident Response',
    card: 'Find the safest first response to suspicious payments, account takeovers, malware and customer-data exposure.',
    ctaLabel: 'Find First Actions',
  },
];

const TONES = ['', 'g', 'b', 'o'];

export function protectIndexBody() {
  return `${hubHero({
    pill: `${PROTECT_AREAS.length} areas to work through`,
    pillIcon: 'shield',
    title: 'Protect Your Business',
    lead: 'The practical side: what to change, in what order, and what to do when something goes wrong.',
    trail: [{ label: 'Home', href: '/' }, { label: 'Protect Your Business' }],
  })}
${section({
    heading: 'Four areas that cover most of the risk',
    sub: 'You do not have to do all of this at once. Accounts first, then payments. Those two prevent most of what actually happens to businesses here.',
    tint: true,
    inner: `<div class="grid">${PROTECT_AREAS.map((area, i) =>
      iconCard({
        iconName: area.iconName,
        tone: TONES[i % TONES.length],
        title: area.name,
        copy: area.card,
        href: `/protect-your-business/${area.slug}`,
        more: area.ctaLabel,
      })
    ).join('')}</div>`,
  })}
${section({
    heading: 'Related topics',
    sub: 'These sit under Learn, but they belong to the same job of getting a business into reasonable shape.',
    inner: `<div class="grid g3">${[
      { label: 'Employee Security', href: '/learn/employee-security', copy: 'Day one and last day, and the rules in between.', iconName: 'users', tone: 'b' },
      { label: 'Business Wi-Fi', href: '/learn/business-wifi', copy: 'Router settings and guest access.', iconName: 'wifi', tone: '' },
      { label: 'Backup & Recovery', href: '/learn/backup-and-recovery', copy: 'A routine you can actually keep up with.', iconName: 'cloud', tone: 'g' },
    ]
      .map((item) => iconCard({ iconName: item.iconName, tone: item.tone, title: item.label, copy: item.copy, href: item.href }))
      .join('')}</div><p style="margin-top:28px">${btn({ label: 'Check Your Business Security', href: '/resources/security-checklist', primary: true, arrow: true })}</p>`,
  })}`;
}

export function protectPages() {
  return PROTECT_AREAS.filter((area) => !['payment-security', 'account-security', 'incident-response', 'device-security'].includes(area.slug)).map((area) => ({
    path: `/protect-your-business/${area.slug}`,
    title: `${area.name} | CyberSafe SME Nigeria`,
    description: area.card,
    kind: 'art',
    section: 'Protect Your Business',
    navLabel: area.name,
    keywords: `protect ${area.name}`,
    body: articlePage({
      section: 'Protect Your Business',
      title: area.name,
      lede: area.lede,
      trail: trail(area.name),
      blocks: area.blocks,
      related: area.related,
      relatedTitle: 'Read next',
    }),
  }));
}
