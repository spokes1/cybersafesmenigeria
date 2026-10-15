import { hubHero, section, iconCard, btn } from '../lib/components.mjs';
import { articlePage } from '../lib/prose.mjs';

const trail = (label) => [
  { label: 'Home', href: '/' },
  { label: 'Protect Your Business', href: '/protect-your-business' },
  { label },
];

export const PROTECT_AREAS = [
  {
    slug: 'account-security',
    iconName: 'key',
    name: 'Account Security',
    card: 'Stop one stolen password from opening every door in your business.',
    ctaLabel: 'Secure Accounts',
    lede: 'Accounts are where almost every incident begins. This is the order to work in.',
    blocks: [
      ['h2', 'Work in this order'],
      ['p', 'Not all accounts are equal. Email can reset the others, so it comes first. Then money, then the channels your customers see.'],
      ['ol', [
        '**Business email** — unique password, two-factor authentication, no unknown forwarding rules.',
        '**Banking and payment platforms** — 2FA, transaction alerts on, and a second approver for larger transfers.',
        '**WhatsApp Business** — two-step verification and a weekly check of linked devices.',
        '**Social media pages** — 2FA on every admin, and only current staff listed as admins.',
        '**Cloud storage** — 2FA, and a look at what is shared with "anyone with the link".',
      ]],
      ['h2', 'Two-factor authentication, briefly'],
      ['p', 'A password proves you know something. A second factor proves you have something — usually a phone with an authenticator app. Prefer an app over SMS codes, because a SIM swap steals SMS but not the app.'],
      ['p', 'Save the backup codes each service offers when you enable 2FA. Print them and keep them where you keep other business documents. They are how you get back in when a phone is lost.'],
      ['h2', 'Things to check once a month'],
      ['ul', [
        'Active sessions and connected devices on email, WhatsApp and cloud storage.',
        'Recovery email addresses and phone numbers — these are quietly changed after a compromise.',
        'Admin lists on your social pages and payment platforms.',
        'Whether anyone who left still has access to anything.',
      ]],
      ['h2', 'Shared logins'],
      ['p', 'Where a platform supports multiple users, create one per person. Where it does not, share the password through a password manager rather than a chat message, change it when the team changes, and accept that you cannot audit who did what on a shared account.'],
    ],
    related: [
      { label: 'Password security', href: '/learn/password-security' },
      { label: 'Email security', href: '/learn/email-security' },
      { label: 'SIM swap fraud', href: '/threats/sim-swap-fraud' },
    ],
  },
  {
    slug: 'payment-security',
    iconName: 'money',
    name: 'Payment Security',
    card: 'Two habits prevent the two most expensive frauds against Nigerian SMEs.',
    ctaLabel: 'Secure Payments',
    lede: 'Almost all payment fraud against small businesses here comes down to unverified confirmations and changed account details.',
    blocks: [
      ['h2', 'Rule one: confirm the credit, not the notification'],
      ['p', 'Goods do not leave until the money is visible in your own account, checked by you in your own banking app. A screenshot is an image. An SMS sender name is text. Neither is proof.'],
      ['ul', [
        'Match the exact amount and the exact time, not just "a credit today".',
        'Watch for reused screenshots from earlier legitimate transactions.',
        'Expect pressure at closing time and during rushes — that is when this is attempted.',
      ]],
      ['h2', 'Rule two: verify every change of account details'],
      ['p', 'A request to pay into a different account is confirmed by phone, on a number you already had, with a person you know. Not the number in the email. Not a WhatsApp reply. A call you place.'],
      ['p', 'This single rule defeats business email compromise, supplier impersonation and most invoice fraud. It costs two minutes.'],
      ['h2', 'Set up the business so the rules hold'],
      ['ol', [
        'Name one person who confirms incoming payments, and make it clear no staff member is blamed for making a customer wait.',
        'Require a second approver for transfers above a threshold you set.',
        'Keep a written list of supplier account details, and treat any change as an exception requiring a call.',
        'Turn on transaction alerts for every business account so unexpected activity is visible immediately.',
        'Reconcile weekly. Fraud found in seven days is sometimes recoverable; fraud found in a month usually is not.',
      ]],
      ['h2', 'If a fraudulent payment has gone out'],
      ['ol', [
        'Call your bank immediately and ask them to flag and attempt a recall. Hours matter.',
        'Preserve the invoice, the email thread, the account details and the transaction reference.',
        'Report to the [EFCC](https://www.efcc.gov.ng) with your evidence, and to the police.',
        'Then look at how the request arrived — if it came from inside an email thread, assume the mailbox is compromised and secure it.',
      ]],
    ],
    related: [
      { label: 'Fake bank alerts', href: '/threats/fake-bank-alerts' },
      { label: 'Business email compromise', href: '/threats/business-email-compromise' },
      { label: 'Incident response', href: '/protect-your-business/incident-response' },
    ],
  },
  {
    slug: 'device-security',
    iconName: 'laptop',
    name: 'Device Security',
    card: 'Laptops, phones and the shared computer in the corner all need the same basics.',
    ctaLabel: 'Secure Devices',
    lede: 'Most device compromise comes from software nobody updated and files nobody questioned.',
    blocks: [
      ['h2', 'The basics, on every device'],
      ['ul', [
        'Automatic updates on for the operating system, browser and business apps.',
        'A screen lock with a PIN or biometrics, and a short auto-lock timeout.',
        'Reputable antivirus with real-time protection enabled — Microsoft Defender is sufficient on current Windows.',
        'Disk encryption where available: BitLocker on Windows Pro, FileVault on Mac, and on by default on modern phones.',
        'Standard user accounts for staff, administrator rights only where genuinely needed.',
      ]],
      ['h2', 'Software'],
      ['p', 'Cracked software is the most reliable way to invite malware into a business. The licence fee is almost always cheaper than a compromise. Install apps from official stores and vendor sites only.'],
      ['h2', 'USB drives and the business centre'],
      ['p', 'A USB drive that moves between a customer\'s laptop, a business centre and your office computer will eventually carry something. Use cloud folders for file transfer instead. If you must accept a drive, scan the files with [VirusTotal](https://www.virustotal.com) before opening them.'],
      ['h2', 'The shared computer'],
      ['ul', [
        'Separate accounts per person, so browser sessions and saved passwords are not shared.',
        'No saved banking passwords in the browser of a shared machine.',
        'Sign out of everything at the end of a shift — WhatsApp Web especially.',
      ]],
      ['h2', 'Phones you run the business from'],
      ['ul', [
        'SIM PIN on, so a stolen handset cannot move your number.',
        'Review app permissions occasionally and remove apps you no longer use.',
        'Turn on Find My iPhone or Find My Device so a lost phone can be located and wiped.',
        'Do not carry out banking on public Wi-Fi. Mobile data is safer.',
      ]],
      ['h2', 'When a device is lost or stolen'],
      ['ol', [
        'Report the line to your operator and have the SIM blocked.',
        'Sign out of all sessions on email, WhatsApp and cloud storage from another device.',
        'Change passwords for anything that was signed in on it.',
        'Use remote wipe if the device was enrolled for it.',
      ]],
    ],
    related: [
      { label: 'Malware', href: '/threats/malware' },
      { label: 'Backup and recovery', href: '/learn/backup-and-recovery' },
      { label: 'Recommended tools', href: '/resources/tools' },
    ],
  },
  {
    slug: 'incident-response',
    iconName: 'bolt',
    name: 'Incident Response',
    card: 'What to do in the first hour, in order, when something has gone wrong.',
    ctaLabel: 'See the Steps',
    lede: 'The first hour matters more than a perfect understanding of what happened. Contain, then investigate.',
    blocks: [
      ['p', 'This page is for the moment you realise something is wrong: an account is behaving oddly, money has left, files will not open, or a customer says they received a strange message from you.'],
      ['h2', 'First hour, in order'],
      ['ol', [
        '**Contain.** Disconnect an affected computer from the network. Do not switch it off if ransomware is involved and you may need evidence, but take it off Wi-Fi and unplug any external drives.',
        '**Cut access.** Change the password for the affected account from a device you trust, then sign out of all sessions. Do this for email first.',
        '**Stop the money.** If any payment is involved, call your bank now and ask them to flag or recall it. Speed is the only advantage you have.',
        '**Preserve evidence.** Screenshots, message threads, email headers, transaction references, times. Do not delete the messages.',
        '**Tell the people affected.** Staff, and any customer or supplier in an active payment conversation. A short honest message on another channel prevents a second loss.',
      ]],
      ['h2', 'Then, the same day'],
      ['ol', [
        'Check the compromised mailbox for forwarding rules, filters and new recovery addresses.',
        'Reset passwords anywhere the same password was used.',
        'Turn on two-factor authentication if it was not already on.',
        'Review who else has access, and remove anyone who should not.',
        'Restore from backup if data was lost, working on a clean device.',
      ]],
      ['h2', 'Where to report in Nigeria'],
      ['ul', [
        '[ngCERT](https://cert.gov.ng) — the national computer emergency response team, for cyber incidents and advisories.',
        '[EFCC](https://www.efcc.gov.ng) — for online fraud and financial cybercrime.',
        'Nigeria Police Force cybercrime unit — through your nearest station, with your evidence prepared.',
        '[NDPC](https://ndpc.gov.ng) — if personal data belonging to customers or staff was exposed, there are notification duties under the NDPA.',
        'Your bank\'s fraud desk — as early as possible, in writing as well as by phone.',
      ]],
      ['h2', 'Write it down afterwards'],
      ['p', 'One page: what happened, how it got in, what you changed, what you would do differently. Businesses that do this rarely get caught by the same method twice. Keep the contacts above, plus your bank\'s fraud line, on a printed sheet — during an incident is the worst time to look them up.'],
      ['quote', 'Nobody should be punished for reporting an incident early. Hidden incidents are the ones that become expensive.'],
    ],
    related: [
      { label: 'Cybersecurity organisations', href: '/resources/organisations' },
      { label: 'Ransomware', href: '/threats/ransomware' },
      { label: 'Security checklist', href: '/resources/security-checklist' },
    ],
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
    sub: 'You do not have to do all of this at once. Accounts first, then payments — those two prevent most of what actually happens to businesses here.',
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
  return PROTECT_AREAS.map((area) => ({
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
