import { hubHero, section, threatCard, finalCta, btn } from '../lib/components.mjs';
import { articlePage } from '../lib/prose.mjs';

const trailFor = (name) => [{ label: 'Home', href: '/' }, { label: 'Threats', href: '/threats' }, { label: name }];

export const THREATS = [
  {
    slug: 'phishing',
    name: 'Phishing',
    card: 'A message that looks genuine but is designed to steal information or money.',
    lede: 'The most common way a small business gets compromised is still a message that someone believed.',
    blocks: [
      ['p', 'Phishing is a message built to look like it came from somewhere you trust — your bank, a supplier, a courier, or your own manager. The goal is to get you to hand over a password or a one-time code, approve a payment, or open a file.'],
      ['p', 'It works because it does not feel like an attack. It feels like a normal Tuesday morning request that you are slightly late replying to.'],
      ['h2', 'How it usually arrives'],
      ['ul', [
        'An email that copies a familiar login page. You type your password into a page that is not the real one.',
        'A WhatsApp or SMS message with a shortened link and a deadline: "confirm before 5pm or your account is restricted".',
        'An attachment named like an invoice, a waybill or a bank statement.',
        'A call that follows the message, from someone who already knows your name and your company.',
      ]],
      ['h2', 'What gives it away'],
      ['ul', [
        'Urgency you did not expect. Real institutions rarely give you fifteen minutes.',
        'A reply address that is close but not right — a swapped letter, an extra word, a different domain ending.',
        'A request for an OTP, a PIN or a password. **No bank and no legitimate service ever needs these from you.**',
        'A link whose destination does not match the text. On a phone, press and hold to preview it before tapping.',
        'A tone that does not match the person. A manager who never says "kindly treat as urgent" suddenly does.',
      ]],
      ['h2', 'What to do'],
      ['ol', [
        'Do not reply in the same thread. Contact the person on a number or address you already had.',
        'If a password was entered, change it immediately on the real site, then change it anywhere else it was reused.',
        'Turn on two-factor authentication on email first. It is the account that resets all the others.',
        'Tell your team the same day. Phishing runs usually hit several people in one company.',
        'Report it to [ngCERT](https://cert.gov.ng) so the campaign can be tracked.',
      ]],
      ['quote', 'If a message pressures you to act before you can verify it, the pressure is the attack.'],
    ],
    related: [
      { label: 'Full phishing guide for SMEs', href: '/learn/phishing-guide' },
      { label: 'How to secure your business email', href: '/learn/email-security' },
      { label: 'Business email compromise', href: '/threats/business-email-compromise' },
    ],
  },
  {
    slug: 'fake-bank-alerts',
    name: 'Fake bank alerts',
    card: 'A false payment notification can make staff release goods before a payment is actually confirmed.',
    lede: 'A credit alert on a screen is a claim, not a confirmation. Only your account balance is proof.',
    blocks: [
      ['p', 'A customer shows a debit alert, a transfer receipt or an SMS that looks exactly like your bank\'s. The goods leave the shop. The money never arrives.'],
      ['p', 'This is one of the most costly frauds against Nigerian retail and wholesale businesses, and it does not need any hacking at all. Alert screenshots are trivial to fake, and so are SMS sender names.'],
      ['h2', 'How it plays out'],
      ['ul', [
        'A screenshot of a successful transfer, sometimes edited from a real earlier transaction.',
        'An SMS that appears to come from your bank\'s usual sender ID.',
        'A "network delay" story: the money is on the way, the bank is slow today, the customer is in a hurry.',
        'Pressure applied at closing time, during a rush, or when the owner is not on site.',
      ]],
      ['h2', 'The rule that stops it'],
      ['p', 'Nothing leaves the premises until the credit appears in your own account, checked by you, in your own banking app or on your own alert channel.'],
      ['ul', [
        'Check the balance, not the notification. Open the app yourself and confirm the new balance.',
        'Match the amount and the exact time. Partial or older transactions get reused.',
        'Give one person the authority to confirm payments, and make it clear that no staff member is ever in trouble for making a customer wait.',
        'Be extra careful with transfers just under your usual approval threshold.',
      ]],
      ['h2', 'If it already happened'],
      ['ol', [
        'Preserve everything: the screenshot, the phone number, the CCTV time, the order record.',
        'Report to your bank immediately — some transfers can still be traced or reversed if flagged early.',
        'Report the fraud to the [EFCC](https://www.efcc.gov.ng) and to the police, with your evidence attached.',
        'Brief every staff member on exactly how the request was framed, so the next attempt is recognised.',
      ]],
    ],
    related: [
      { label: 'Payment security steps', href: '/protect-your-business/payment-security' },
      { label: 'Security checklist', href: '/resources/security-checklist' },
      { label: 'Social engineering', href: '/threats/social-engineering' },
    ],
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
        'Announce it on another channel — calls, SMS, Instagram — so customers ignore any payment request sent while you were locked out.',
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
      ['p', 'In a SIM swap, a fraudster convinces a mobile operator — or an agent working with them — to move your number onto a new SIM. Your phone loses service. Their phone starts receiving your OTPs, bank alerts and WhatsApp codes.'],
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
    card: 'Malicious software can steal information, damage systems or interrupt business operations.',
    lede: 'Malware rarely announces itself. It arrives as a normal file and behaves like a slow computer.',
    blocks: [
      ['p', 'Malware is software running on your device for someone else\'s benefit — recording what you type, copying files, mining cryptocurrency with your electricity, or waiting quietly for a chance to do something worse.'],
      ['h2', 'Common ways it gets in'],
      ['ul', [
        'A shared USB drive passed between a business centre, a customer\'s laptop and your office machine.',
        'Cracked or "activated" software downloaded to avoid a licence fee. The crack is usually the payload.',
        'An attachment or download from a phishing message.',
        'An old operating system or browser that has not been updated in years.',
      ]],
      ['h2', 'What it looks like'],
      ['ul', [
        'The machine slows down, fans run constantly, storage fills up with no explanation.',
        'Browser home page or search engine changes on its own; new toolbars appear.',
        'Antivirus is disabled and will not turn back on.',
        'Colleagues receive messages from your accounts that you did not send.',
      ]],
      ['h2', 'Practical defence'],
      ['ol', [
        'Install operating system and browser updates when they appear. Most malware relies on a hole that was patched months ago.',
        'Use licensed software, and Microsoft Defender or another reputable antivirus with real-time protection on.',
        'Stop sharing USB drives between business and personal machines. Use a cloud folder instead.',
        'Give staff standard accounts, not administrator accounts. Malware inherits the permissions of the user who ran it.',
        'Keep backups that are not permanently connected to the machine they back up.',
      ]],
      ['p', 'If you suspect an infection, disconnect the machine from the network before you start investigating, and change passwords from a different device — not from the affected one.'],
    ],
    related: [
      { label: 'Device security steps', href: '/protect-your-business/device-security' },
      { label: 'Ransomware', href: '/threats/ransomware' },
      { label: 'Backup and recovery', href: '/learn/backup-and-recovery' },
    ],
  },
  {
    slug: 'social-engineering',
    name: 'Social engineering',
    card: 'Instead of breaking into a system, criminals may simply try to convince someone to let them in.',
    lede: 'The cheapest way into a business is to ask a helpful person a confident question.',
    blocks: [
      ['p', 'Social engineering is manipulation aimed at people rather than systems. There is no software flaw involved. Someone borrows authority, urgency or familiarity, and a member of staff does something reasonable that turns out to be costly.'],
      ['h2', 'The patterns to recognise'],
      ['ul', [
        '**Authority.** A caller presents themselves as the MD, an auditor, a bank official or an engineer sent to fix the network.',
        '**Urgency.** A deadline that removes the time you would have used to check.',
        '**Familiarity.** They already know names, roles and recent events, usually harvested from your own social media and website.',
        '**Reciprocity.** A small favour first, a request second.',
      ]],
      ['h2', 'Where businesses get caught'],
      ['ul', [
        'A "supplier" calls to say their account number has changed, just before an invoice is due.',
        'Someone asks a junior member of staff for the owner\'s personal number, then uses it to make a request look internal.',
        'A visitor in branded workwear is let into the server or stock area without anyone checking who booked the visit.',
      ]],
      ['h2', 'What actually helps'],
      ['ol', [
        'Agree one rule: **any change to payment details is confirmed by phone on a previously known number.** No exceptions for urgency.',
        'Make it acceptable to say "let me call you back". Staff comply with pressure when they fear being blamed for delay.',
        'Do not treat internal information as harmless. Names, absences and travel plans are the raw material of a convincing story.',
        'Run through two or three real scenarios with your team every quarter. Recognition is what stops this, not policy documents.',
      ]],
    ],
    related: [
      { label: 'Employee security', href: '/learn/employee-security' },
      { label: 'Business email compromise', href: '/threats/business-email-compromise' },
      { label: 'Payment security steps', href: '/protect-your-business/payment-security' },
    ],
  },
  {
    slug: 'ransomware',
    name: 'Ransomware',
    card: 'Files are locked and a payment is demanded to release them. Backups decide how bad this gets.',
    lede: 'Ransomware does not care how small your business is. It cares whether you can restore without paying.',
    blocks: [
      ['p', 'Ransomware encrypts your files and leaves a demand for payment, usually in cryptocurrency. Records, invoices, customer data and photographs all become unreadable at once, and the business stops.'],
      ['p', 'It typically arrives through a malicious attachment, an infected USB drive, or unpatched software exposed to the internet. Increasingly, attackers also copy data before locking it and threaten to publish it.'],
      ['h2', 'The honest position on paying'],
      ['p', 'Paying funds the next attack and does not guarantee a working key. It is also not a recovery plan. The businesses that come through this well are the ones that can rebuild from a backup the attacker could not reach.'],
      ['h2', 'Preparation that works'],
      ['ol', [
        'Follow the 3-2-1 rule: three copies of important data, on two kinds of storage, with one kept offsite or offline.',
        'Test a restore. An untested backup is a hope, not a backup. Restore one folder this month and confirm it opens.',
        'Keep at least one backup disconnected. Anything permanently mounted gets encrypted along with the original.',
        'Patch operating systems and business software promptly.',
        'Limit administrator accounts and remove access for staff who have left.',
      ]],
      ['h2', 'If it happens'],
      ['ol', [
        'Disconnect affected machines from the network and from any external drives, but do not wipe them.',
        'Do not pay, and do not delete the ransom note — it helps identify the variant.',
        'Report to [ngCERT](https://cert.gov.ng); in some cases a free decryptor exists for the specific family.',
        'Rebuild from a clean backup, and change every password afterwards.',
      ]],
    ],
    related: [
      { label: 'Backup and recovery', href: '/learn/backup-and-recovery' },
      { label: 'Incident response', href: '/protect-your-business/incident-response' },
      { label: 'Malware', href: '/threats/malware' },
    ],
  },
  {
    slug: 'business-email-compromise',
    name: 'Business email compromise',
    card: 'An attacker inside an email thread redirects a real payment to their own account.',
    lede: 'The most expensive attacks on SMEs are usually quiet, patient and grammatically correct.',
    blocks: [
      ['p', 'Business email compromise, often shortened to BEC, is what happens after someone gets into a business email account and decides to read rather than shout. They watch a genuine conversation about a genuine invoice, then step in at the right moment with new account details.'],
      ['p', 'There is no malware to detect and no obvious warning. The email arrives in the correct thread, signed off the way that person always signs off.'],
      ['h2', 'How the setup works'],
      ['ol', [
        'A password is captured through phishing, or reused from a breach elsewhere.',
        'The attacker logs in and creates a quiet mailbox rule that hides or forwards certain messages.',
        'They wait for a payment discussion — a supplier invoice, a rent payment, a project milestone.',
        'They reply with updated bank details, sometimes from a near-identical domain instead of the real one.',
      ]],
      ['h2', 'Signs worth checking'],
      ['ul', [
        'Bank details that change late in a transaction, especially with an apology about a "frozen" old account.',
        'Replies that arrive from a domain missing or adding one character.',
        'Mailbox rules, forwarding addresses or recovery emails nobody remembers creating.',
        'Sign-in activity from unfamiliar locations or devices in your email security settings.',
      ]],
      ['h2', 'Controls that stop it'],
      ['ol', [
        'Two-factor authentication on every business email account, without exception.',
        'Verbal confirmation on a known number for **every** change of payment details.',
        'A second approver for transfers above a threshold you set.',
        'A monthly look at mailbox rules, forwarding and connected devices.',
        'Immediate password changes and session sign-outs when staff leave.',
      ]],
    ],
    related: [
      { label: 'How to secure your business email', href: '/learn/email-security' },
      { label: 'Payment security steps', href: '/protect-your-business/payment-security' },
      { label: 'Phishing guide', href: '/learn/phishing-guide' },
    ],
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

// These two routes are served by the approved designs instead of the prose below.
export const APPROVED_THREATS = ['sim-swap-fraud', 'whatsapp-hijacking'];

export function threatIndexBody() {
  return `${hubHero({
    pill: `${THREATS.length} threats explained`,
    pillIcon: 'alert',
    title: 'Threats',
    lead: 'How the attacks that reach Nigerian small businesses actually work — what they look like, and what to do if one lands.',
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
    sub: 'Work through the immediate steps first — containing an incident in the first hour matters more than understanding it perfectly.',
    buttons: btn({ label: 'Incident Response Steps', href: '/protect-your-business/incident-response', primary: true, arrow: true }),
  })}`;
}

export function threatPages() {
  return THREATS.filter((t) => !APPROVED_THREATS.includes(t.slug)).map((threat) => ({
    path: `/threats/${threat.slug}`,
    title: `${threat.name} — Threats | CyberSafe SME Nigeria`,
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
