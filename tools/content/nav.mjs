// Single source of truth for navigation, footer and the search index.
// Add a route here and it appears in the header, the drawer, the footer
// and search without touching any page template.
import { readFileSync } from 'node:fs';
const { origin } = JSON.parse(readFileSync(new URL('./site-config.json', import.meta.url), 'utf8'));
if (new URL(origin).origin !== origin || !origin.startsWith('https://')) throw new Error('Site origin must be an HTTPS origin without a trailing slash');

export const SITE = {
  name: 'CyberSafe SME Nigeria',
  short: 'CyberSafe',
  tagline: 'Practical cybersecurity guidance for Nigerian SMEs.',
  email: 'hello@cybersafesmenigeria.ng',
  ctaLabel: 'Check Your Business Security',
  ctaHref: '/resources/security-checklist',
  origin,
};

// Every published topic has one menu home. Related reading may cross sections;
// the build rejects duplicate menu destinations or an incorrect section owner.
export const NAV = [
  { label: 'Home', href: '/' },
  {
    label: 'Learn',
    href: '/learn',
    columns: [
      [
        { label: 'Cybersecurity Basics', href: '/learn/cybersecurity-basics' },
        { label: 'Password Security', href: '/learn/password-security' },
        { label: 'Email Security', href: '/learn/email-security' },
        { label: 'WhatsApp Security', href: '/learn/whatsapp-security' },
        { label: 'Mobile Security', href: '/learn/mobile-security' },
        { label: 'Business Wi-Fi', href: '/learn/business-wifi' },
      ],
      [
        { label: 'Social Media Security', href: '/learn/social-media-security' },
        { label: 'Employee Security', href: '/learn/employee-security' },
        { label: 'Data Protection', href: '/learn/data-protection' },
        { label: 'Backup & Recovery', href: '/learn/backup-and-recovery' },
        { label: 'Phishing Guide', href: '/learn/phishing-guide' },
        { label: 'Cyber Practice', href: '/learn/spot-the-scam' },
      ],
    ],
  },
  {
    label: 'Threats',
    href: '/threats',
    columns: [
      [
        { label: 'Phishing', href: '/threats/phishing' },
        { label: 'Fake Bank Alerts', href: '/threats/fake-bank-alerts' },
        { label: 'SIM Swap Fraud', href: '/threats/sim-swap-fraud' },
        { label: 'Malware', href: '/threats/malware' },
      ],
      [
        { label: 'WhatsApp Hijacking', href: '/threats/whatsapp-hijacking' },
        { label: 'Social Engineering', href: '/threats/social-engineering' },
        { label: 'Ransomware', href: '/threats/ransomware' },
        { label: 'Business Email Compromise', href: '/threats/business-email-compromise' },
      ],
    ],
  },
  {
    label: 'Protect Your Business',
    href: '/protect-your-business',
    columns: [
      [
        { label: 'Account Security', href: '/protect-your-business/account-security' },
        { label: 'Payment Security', href: '/protect-your-business/payment-security' },
        { label: 'Device Security', href: '/protect-your-business/device-security' },
      ],
      [
        { label: 'Incident Response', href: '/protect-your-business/incident-response' },
      ],
    ],
  },
  {
    label: 'Resources',
    href: '/resources',
    columns: [
      [
        { label: 'Security Self-Check', href: '/resources/security-checklist' },
        { label: 'Downloads', href: '/resources/downloads' },
        { label: 'Cybersecurity Organisations', href: '/resources/organisations' },
        { label: 'External Resources', href: '/resources/external' },
        { label: 'Tools', href: '/resources/tools' },
      ],
    ],
  },
  {
    label: 'About',
    href: '/about',
  },
];

export const FOOTER = [
  {
    heading: 'Explore',
    links: [
      { label: 'Home', href: '/' },
      { label: 'Learn', href: '/learn' },
      { label: 'Threats', href: '/threats' },
      { label: 'Protect Your Business', href: '/protect-your-business' },
      { label: 'Resources', href: '/resources' },
    ],
  },
  {
    heading: 'Resources',
    links: [
      { label: 'Security Self-Check', href: '/resources/security-checklist' },
      { label: 'Downloads', href: '/resources/downloads' },
      { label: 'Organisations', href: '/resources/organisations' },
      { label: 'External Resources', href: '/resources/external' },
      { label: 'Tools', href: '/resources/tools' },
    ],
  },
  {
    heading: 'Company',
    links: [
      { label: 'About', href: '/about' },
      { label: 'Mission', href: '/about#mission' },
      { label: 'Team', href: '/about#team' },
      { label: 'Contact', href: '/about#contact' },
    ],
  },
];

export const LEGAL = [
  { label: 'Privacy Policy', href: '/privacy' },
  { label: 'Terms of Use', href: '/terms' },
  { label: 'Contact', href: '/about#contact' },
];
