import { hubHero, section, threatCard, finalCta, btn } from '../lib/components.mjs';
import { articlePage } from '../lib/prose.mjs';

const trailFor = (name) => [{ label: 'Home', href: '/' }, { label: 'Threats', href: '/threats' }, { label: name }];

export const THREATS = [
  {
    slug: 'phishing',
    name: 'Phishing',
    card: 'Recognise suspicious messages, check unexpected requests and respond safely if an employee has already acted.',
    // The full approved article is generated from approved/phishing.html.
  },
  {
    slug: 'fake-bank-alerts',
    name: 'Fake bank alerts',
    card: 'A false payment notification can make staff release goods before a payment is actually confirmed.',
    // The published article is generated from approved/fake-bank-alerts.html.
  },
  {
    slug: 'whatsapp-hijacking',
    name: 'WhatsApp hijacking',
    card: 'Once an account is taken over, attackers can use familiar conversations to trick customers or colleagues.',
    lede: 'For many Nigerian businesses WhatsApp is the sales channel, the customer file and the payment desk. Losing it is a business incident.',
    blocks: [
      ['p', 'Account takeover usually starts with a six-digit code. Someone contacts you pretending to be a customer, a delivery agent or WhatsApp support, and asks you to read out the code you have just received. That code is the key to your account.'],
      ['p', 'The other common route is a linked device. An attacker gets a moment with your unlocked phone, or persuades you to scan a QR code, and quietly keeps a copy of your chats open elsewhere.'],
      ['h2', 'Why it hurts a business'],
      ['ul', [
        'Your customers trust the account. Requests for "a quick transfer to a new account" from your own number get paid.',
        'Order history, addresses and price lists are all sitting in the chats.',
        'Group broadcasts let one takeover reach hundreds of customers in minutes.',
      ]],
      ['h2', 'Prevent it'],
      ['ol', [
        'Turn on two-step verification: Settings → Account → Two-step verification. Add a recovery email you still control.',
        'Never read a verification code to anyone, for any reason.',
        'Check Settings → Linked devices weekly and log out anything you do not recognise.',
        'Lock the phone itself with a PIN or biometrics, and set a SIM PIN.',
        'Use WhatsApp Business with a dedicated line so a personal phone loss is not a business loss.',
      ]],
      ['h2', 'If the account is taken'],
      ['ol', [
        'Re-register the number on your own phone. Receiving a new code logs the attacker out.',
        'Open Linked devices and log out every session.',
        'Re-enable two-step verification straight away.',
        'Announce it on another channel (calls, SMS or Instagram) so customers ignore any payment request sent while you were locked out.',
        'Report the incident to [ngCERT](https://cert.gov.ng).',
      ]],
    ],
    related: [
      { label: 'Protect your business WhatsApp', href: '/learn/whatsapp-security' },
      { label: 'SIM swap fraud', href: '/threats/sim-swap-fraud' },
      { label: 'Account security steps', href: '/protect-your-business/account-security' },
    ],
  },
  {
    slug: 'sim-swap-fraud',
    name: 'SIM swap fraud',
    card: 'Someone takes control of your phone number and uses it to get into accounts.',
    lede: 'Your number is a password reset channel. Whoever controls it can start collecting your accounts.',
    blocks: [
      ['p', 'In a SIM swap, a fraudster convinces a mobile operator, or an agent working with them, to move your number onto a new SIM. Your phone loses service. Their phone starts receiving your OTPs, bank alerts and WhatsApp codes.'],
      ['p', 'The information they need to pass the operator\'s checks is often gathered first: your date of birth, your address, your last recharge amounts, sometimes your BVN details from an earlier scam.'],
      ['h2', 'The warning sign is silence'],
      ['ul', [
        'Your phone shows no service or "SIM not provisioned" without explanation.',
        'Calls and SMS stop arriving while data over Wi-Fi still works.',
        'You get an email about a SIM or account change you did not request.',
      ]],
      ['p', 'If your line goes dead unexpectedly, treat it as an emergency rather than a network problem.'],
      ['h2', 'Reduce the risk'],
      ['ul', [
        'Ask your operator to place a port-out or SIM-swap restriction on the line, and set a verbal password if offered.',
        'Move your critical accounts from SMS codes to an authenticator app. App codes do not travel with your number.',
        'Do not use one number for everything. A quiet, unpublished line for banking is harder to target than the number printed on your delivery bike.',
        'Keep your BVN, date of birth and answers to security questions out of chats and forms you did not initiate.',
      ]],
      ['h2', 'If it happens'],
      ['ol', [
        'Go to your operator in person with ID and have the line restored and locked.',
        'Call your bank to freeze transactions before you deal with anything else.',
        'Change email and banking passwords from a device that is not affected.',
        'Check for recovery emails or phone numbers that were added to your accounts while you were locked out.',
      ]],
    ],
    related: [
      { label: 'Account security steps', href: '/protect-your-business/account-security' },
      { label: 'Mobile security', href: '/learn/mobile-security' },
      { label: 'Incident response', href: '/protect-your-business/incident-response' },
    ],
  },
  {
    slug: 'malware',
    name: 'Malware',
    card: 'Understand harmful software, recognise suspicious device changes and respond safely without jumping to conclusions.',
    // The full approved article is generated from approved/malware.html.
  },
  {
    slug: 'social-engineering',
    name: 'Social engineering',
    card: 'Recognise convincing callers, familiar messages and unexpected requests for access, money or information. Learn how to verify them independently.',
    // The full owner-approved article is generated from approved/social-engineering.html.
  },
  {
    slug: 'ransomware',
    name: 'Ransomware',
    card: 'Understand locked records, safe response, separate backups and how essential work may continue during disruption.',
    // The complete approved article is generated from approved/ransomware.html.
  },
  {
    slug: 'business-email-compromise',
    name: 'Business email compromise',
    card: 'Fraudulent business emails can impersonate familiar contacts or change real payment instructions.',
    // The full owner-approved article is generated from approved/business-email-compromise.html.
  },
];

// Thumbnail icon and tint for each threat card, matching the homepage grid.
const CARD_STYLE = {
  phishing: ['mail', 'b'],
  'fake-bank-alerts': ['bank', 'o'],
  'whatsapp-hijacking': ['chat', 'g'],
  'sim-swap-fraud': ['sim', 'o'],
  malware: ['monitor', 'b'],
  'social-engineering': ['users', ''],
  ransomware: ['lock', 'o'],
  'business-email-compromise': ['receipt', 'b'],
};

// These routes use the approved page fragments; keep their cards in the threat index.
export const APPROVED_THREATS = ['phishing', 'fake-bank-alerts', 'sim-swap-fraud', 'whatsapp-hijacking', 'business-email-compromise', 'social-engineering', 'malware', 'ransomware'];

export function threatIndexBody() {
  return `${hubHero({
    pill: `${THREATS.length} threats explained`,
    pillIcon: 'alert',
    title: 'Threats',
    lead: 'How the attacks that reach Nigerian small businesses actually work: what they look like, and what to do if one lands.',
    trail: [{ label: 'Home', href: '/' }, { label: 'Threats' }],
  })}
${section({
    heading: 'Start with the ones you are most likely to meet',
    sub: 'Each page follows the same shape: how it works, what gives it away, and the steps to take.',
    tint: true,
    inner: `<div class="grid g3">${THREATS.map((t) => {
      const [iconName, tone] = CARD_STYLE[t.slug] || ['alert', ''];
      return threatCard({ iconName, tone, title: t.name, copy: t.card, href: `/threats/${t.slug}` });
    }).join('')}</div>`,
  })}
${finalCta({
    heading: 'Something already gone wrong?',
    sub: 'Work through the immediate steps first. Containing an incident in the first hour matters more than understanding it perfectly.',
    buttons: btn({ label: 'Incident Response Steps', href: '/protect-your-business/incident-response', primary: true, arrow: true }),
  })}`;
}

export function threatPages() {
  return THREATS.filter((t) => !APPROVED_THREATS.includes(t.slug)).map((threat) => ({
    path: `/threats/${threat.slug}`,
    title: `${threat.name} | Threats | CyberSafe SME Nigeria`,
    description: threat.card,
    kind: 'art',
    section: 'Threats',
    navLabel: threat.name,
    keywords: `${threat.name} scam fraud nigeria sme`,
    body: articlePage({
      section: 'Threats',
      title: threat.name,
      lede: threat.lede,
      trail: trailFor(threat.name),
      blocks: threat.blocks,
      related: threat.related,
    }),
  }));
}
