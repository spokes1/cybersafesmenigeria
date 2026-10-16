import { hubHero, section, iconCard, btn, artSection, iconFor } from '../lib/components.mjs';
import { articlePage, faq } from '../lib/prose.mjs';

const trail = (label) => [{ label: 'Home', href: '/' }, { label: 'Learn', href: '/learn' }, { label }];

/* ------------------------------------------------------------
   Topic index. `live: false` renders a placeholder page instead
   of an article, so a new topic only needs its blocks written.
   ------------------------------------------------------------ */
export const LEARN_TOPICS = [
  { slug: 'cybersecurity-basics', name: 'Cybersecurity Basics', copy: 'The short version of what matters, plus straight answers to the questions owners ask most.', live: true },
  { slug: 'password-security', name: 'Password Security', copy: 'How to give every work account its own password without memorising twenty of them.', live: true },
  { slug: 'email-security', name: 'Email Security', copy: 'Email resets every other account you own. Lock it down first.', live: true },
  { slug: 'whatsapp-security', name: 'WhatsApp Security', copy: 'Protect the account your customers actually message.', live: true },
  { slug: 'employee-security', name: 'Employee Security', copy: 'What to tell a new staff member on day one, and what to do the day someone leaves.', live: true },
  { slug: 'backup-and-recovery', name: 'Backup & Recovery', copy: 'A backup routine a small business can genuinely keep up with.', live: true },
  { slug: 'mobile-security', name: 'Mobile Security', copy: 'Securing the phone you run the business from.', live: false },
  { slug: 'business-wifi', name: 'Business Wi-Fi', copy: 'Router settings, guest access and why one shared password is a problem.', live: true },
  { slug: 'social-media-security', name: 'Social Media Security', copy: 'Keeping business pages and admin access under control.', live: false },
  { slug: 'data-protection', name: 'Data Protection', copy: 'Handling customer information, and what the NDPA expects of you.', live: false },
];

const BASICS_FAQ = [
  {
    q: 'What is phishing and how do I recognise it?',
    a: 'Phishing is a message (email, SMS or WhatsApp) built to look like it came from a trusted source such as your bank, a supplier or a delivery company. The signs are urgency you did not expect, a request for a password or OTP, a link whose address does not match the text, and a sender address that is nearly but not exactly right. When in doubt, contact the organisation on a number you already have.',
  },
  {
    q: 'Can ransomware really affect a business as small as mine?',
    a: 'Yes. Most ransomware is not aimed at anyone in particular. It spreads to whatever it can reach. It usually arrives through an attachment, an infected USB drive or software that has not been updated. Offline backups, current software and staff who recognise a suspicious file are what keep it survivable.',
  },
  {
    q: 'How do I create a strong password I can actually remember?',
    a: 'Use a passphrase: three or four unrelated words with a number and a symbol, such as Coffee#Lagos7Bridge. Length matters more than complexity. Better still, let a password manager generate and store them, so the only one you memorise is the master password.',
  },
  {
    q: 'My business WhatsApp was taken over. What do I do right now?',
    a: 'Re-register the number on your own phone to log the attacker out, then open Settings → Linked devices and end every session. Re-enable two-step verification, and tell customers on another channel to ignore any payment request sent while you were locked out. Report the incident to ngCERT at cert.gov.ng.',
  },
  {
    q: 'How do I tell whether a bank alert is real?',
    a: 'Do not judge the notification. Check the balance. Open your own banking app, not a link, and confirm the credit, the exact amount and the time. Alert screenshots and SMS sender names are both easy to fake.',
  },
  {
    q: 'Do I need antivirus if I only use my phone for business?',
    a: 'Phones are safer by default but not immune. Keep the operating system updated, install apps only from the official store, review app permissions occasionally, and set a screen lock and a SIM PIN. On Android, a reputable security app from the Play Store adds a useful layer.',
  },
  {
    q: 'What is the 3-2-1 backup rule?',
    a: 'Three copies of your important data, on two different kinds of storage, with one copy kept offsite or offline. For a small business that can be as simple as your working files on the laptop, a weekly copy on an external drive, and an automatic sync to cloud storage.',
  },
  {
    q: 'How do I report a cybercrime in Nigeria?',
    a: 'ngCERT at cert.gov.ng handles cyber incidents and advisories. The EFCC at efcc.gov.ng handles online fraud and financial cybercrime. The Nigeria Police Force cybercrime unit can be reached through your nearest station. Preserve your evidence (screenshots, message threads and transaction records) before you report.',
  },
];

/* ---------- Articles ---------- */
export const LEARN_ARTICLES = {
  'cybersecurity-basics': {
    name: 'Cybersecurity Basics',
    lede: 'You do not need to understand everything. You need to understand the few things that cause most of the damage.',
    blocks: [
      ['p', 'Almost every incident that reaches a Nigerian small business comes down to one of four things: a password someone else now knows, a message someone believed, a payment nobody verified, or a device nobody updated. Get those four under control and you have dealt with the majority of realistic risk.'],
      ['h2', 'The four things'],
      ['h3', '1. Accounts'],
      ['p', 'Give every work account its own password, and turn on two-factor authentication starting with email. Email is the account that can reset all the others, which is why attackers go there first.'],
      ['h3', '2. Messages'],
      ['p', 'Treat any unexpected request that involves money, passwords or codes as unverified until you have confirmed it through a channel you chose. Not the number in the message, but the number you already had.'],
      ['h3', '3. Payments'],
      ['p', 'Confirm a credit in your own banking app before goods leave. Confirm any change of account details by phone. These two habits prevent the two most expensive frauds against SMEs here.'],
      ['h3', '4. Devices and data'],
      ['p', 'Install updates, use licensed software, lock screens, and keep a backup that is not permanently attached to the machine it protects.'],
      ['h2', 'Words you will keep meeting'],
      ['ul', [
        '**Two-factor authentication (2FA)**: a second proof of identity after your password, usually a code from an app.',
        '**OTP**: a one-time code sent to you. Never share it, with anyone, ever.',
        '**Phishing**: a fake message designed to make you hand over access or money.',
        '**Malware**: software running on your device for someone else\'s benefit.',
        '**Ransomware**: malware that locks your files and demands payment.',
        '**Social engineering**: manipulating a person instead of attacking a system.',
        '**Backup**: a separate copy of your data you can restore from.',
      ]],
      ['h2', 'What to do this week'],
      ['ol', [
        'Turn on 2FA for your business email.',
        'Turn on two-step verification for WhatsApp.',
        'Agree one payment-verification rule with your staff and say it out loud.',
        'Copy your most important folder to an external drive.',
      ]],
      ['p', 'That is four tasks and perhaps an hour. Then work through the [security checklist](/resources/security-checklist) to see what is left.'],
    ],
    extra: artSection({ iconName: 'chat', heading: 'Questions owners ask us most', inner: faq(BASICS_FAQ) }),
    related: [
      { label: 'Security checklist', href: '/resources/security-checklist' },
      { label: 'Password security', href: '/learn/password-security' },
      { label: 'Threats overview', href: '/threats' },
    ],
  },

  'email-security': {
    name: 'How to Secure Your Business Email',
    lede: 'Email is the master key to your business. Almost every other account can be reset from it.',
    blocks: [
      ['p', 'If an attacker gets one account from your business, they want this one. From inside your mailbox they can reset other services, read your invoices, learn your suppliers, and reply inside a real conversation about a real payment. Everything else on this page follows from that.'],
      ['h2', 'Do these five things first'],
      ['ol', [
        '**Turn on two-factor authentication.** In Gmail: Manage your Google Account → Security → 2-Step Verification. In Microsoft 365: Security info → Add sign-in method. Use an authenticator app rather than SMS where you can.',
        '**Give the account its own password.** Not a version of one you use elsewhere.',
        '**Check for mailbox rules you did not create.** This is the step almost everyone skips. Gmail: Settings → Filters and blocked addresses, and Settings → Forwarding. Microsoft 365: Settings → Mail → Rules, and Forwarding. Attackers leave a rule that quietly hides or copies messages about payments.',
        '**Review recent sign-in activity.** Both Google and Microsoft show where and on what device your account has been used. End anything unfamiliar.',
        '**Check your recovery email and phone number.** If either belongs to someone else, they own the account, password or not.',
      ]],
      ['h2', 'Use a business domain if you can'],
      ['p', 'A mailbox at your own domain (accounts@yourbusiness.com.ng rather than a free personal address) lets you control accounts centrally, remove access when staff leave, and set the DNS records (SPF, DKIM and DMARC) that make it harder for anyone to send email pretending to be you. Your domain registrar or hosting provider can set these up.'],
      ['h2', 'Reading email safely'],
      ['ul', [
        'Check the actual sender address, not the display name. The display name is free text and can say anything.',
        'Hover over links, or press and hold on mobile, and read the destination before tapping.',
        'Be suspicious of attachments you did not expect, especially anything that asks you to enable macros or content.',
        'A reply that arrives from a domain missing one letter is the single most expensive email trick used against Nigerian SMEs.',
      ]],
      ['h2', 'Rules for the team'],
      ['ul', [
        'Every staff member gets their own mailbox. No shared inbox passwords.',
        'Any change of bank details, from anyone, is confirmed by phone on a known number before payment.',
        'Report suspicious mail internally the same day. These campaigns hit several colleagues at once.',
        'When someone leaves: change the password, end all sessions, and remove their access the same day.',
      ]],
      ['h2', 'If an account was already compromised'],
      ['ol', [
        'Change the password from a device you trust, then sign out of all sessions.',
        'Delete any forwarding address or rule the attacker created.',
        'Reset the recovery email and phone number.',
        'Warn anyone who was in an active payment conversation with that mailbox.',
        'Report to [ngCERT](https://cert.gov.ng), and to your bank if payment details were discussed.',
      ]],
    ],
    related: [
      { label: 'Phishing guide', href: '/learn/phishing-guide' },
      { label: 'Business email compromise', href: '/threats/business-email-compromise' },
      { label: 'Incident response', href: '/protect-your-business/incident-response' },
    ],
  },

  'whatsapp-security': {
    name: 'How to Protect Your Business WhatsApp',
    lede: 'For a lot of businesses here, WhatsApp is the shop. Treat it with the same care as the cash box.',
    blocks: [
      ['p', 'Your WhatsApp holds order history, customer numbers, price lists and the trust of everyone you have ever sold to. That last part is what attackers are really after: a payment request from your own number gets paid.'],
      ['h2', 'Set-up that prevents most takeovers'],
      ['ol', [
        '**Two-step verification.** Settings → Account → Two-step verification. Set a six-digit PIN and add a recovery email you control. This alone blocks the common code-stealing takeover.',
        '**Never share the six-digit code.** No customer, courier, bank or "WhatsApp support" needs it. Anyone asking is taking your account.',
        '**Check linked devices weekly.** Settings → Linked devices. Log out anything you do not recognise, and after using WhatsApp Web on a shared computer.',
        '**Lock the phone.** A screen PIN or biometrics, plus a SIM PIN so a stolen phone cannot move your number to another handset.',
        '**Use WhatsApp Business on a dedicated line.** It separates business from personal, and gives you labels, catalogues and away messages.',
      ]],
      ['h2', 'Habits for the sales conversation'],
      ['ul', [
        'Publish your account details once, in your business profile, so customers have a fixed reference.',
        'Tell customers plainly, in your profile or a pinned message, that your account number never changes and that you will never ask them to send money to a different one.',
        'Confirm large or unusual orders with a phone call.',
        'Do not accept a payment screenshot as proof. Check your own balance.',
        'Be careful with group links. Anyone who joins can see the members list, which is a ready-made target list.',
      ]],
      ['h2', 'If your account is taken over'],
      ['ol', [
        'Re-register your number on your own phone. The new verification logs the attacker out.',
        'Open Settings → Linked devices and end every session.',
        'Re-enable two-step verification immediately.',
        'Post on Instagram, Facebook or SMS that your WhatsApp was compromised and that customers should ignore any payment request from it during that window.',
        'Report to [ngCERT](https://cert.gov.ng), and keep screenshots in case customers lost money.',
      ]],
      ['quote', 'The fastest way to lose a customer\'s money is a request that looks exactly like you. Give them one fixed account number and repeat it often.'],
    ],
    related: [
      { label: 'WhatsApp hijacking', href: '/threats/whatsapp-hijacking' },
      { label: 'SIM swap fraud', href: '/threats/sim-swap-fraud' },
      { label: 'Payment security steps', href: '/protect-your-business/payment-security' },
    ],
  },

  'employee-security': {
    name: 'Employee Security',
    lede: 'Your staff are not the weak link. They are the control that works, if you tell them what to expect.',
    blocks: [
      ['p', 'Most staff mistakes are reasonable decisions made with missing information. Someone paid an invoice because it looked normal. Someone read out a code because the caller sounded official. The fix is not suspicion. It is a small number of clear rules, and permission to slow down.'],
      ['h2', 'Day one, for every new person'],
      ['ul', [
        'Their own login for every system. No shared accounts.',
        'A standard user account, not an administrator account.',
        'The payment rule, said out loud: any change of account details is confirmed by phone on a known number.',
        'The code rule: nobody in this business ever asks you for an OTP or a password. Anyone who does is not us.',
        'Who to tell, immediately, if something feels wrong, and the assurance that reporting early is never punished.',
      ]],
      ['h2', 'The last day matters as much'],
      ['ol', [
        'Change passwords on anything they had access to, and sign out all sessions.',
        'Remove them from the business email, cloud storage, social page admins and payment platforms.',
        'Remove their WhatsApp Business linked devices and any group admin rights.',
        'Recover company phones, laptops and USB drives, and note what was returned.',
      ]],
      ['h2', 'Keeping awareness alive without a training budget'],
      ['ul', [
        'Once a quarter, spend ten minutes on a real message the business actually received. Recognition beats policy.',
        'When an attempt is caught, share it, including who caught it.',
        'Keep the rules to a single page and put it where people work, not in a shared drive nobody opens.',
        'Do not blame the person who clicked. The next person will hide it, and hidden incidents are the expensive ones.',
      ]],
      ['h2', 'Access, kept small on purpose'],
      ['p', 'Give each role the access it needs and no more. A sales assistant does not need the payment platform; a delivery rider does not need the customer database. When an account is compromised, the damage is limited to whatever that account could reach.'],
    ],
    related: [
      { label: 'Social engineering', href: '/threats/social-engineering' },
      { label: 'Security checklist', href: '/resources/security-checklist' },
      { label: 'Account security steps', href: '/protect-your-business/account-security' },
    ],
  },

  'phishing-guide': {
    name: 'Phishing: How Nigerian SMEs Are Targeted and What to Do About It',
    lede: 'That urgent message from your boss. The supplier asking for a new account number. The login page that looks exactly like Microsoft 365.',
    blocks: [
      ['p', 'Phishing is not a technical attack. It is a persuasion attack delivered by a message, and it remains the most common starting point for losses at small businesses in Nigeria, ahead of malware and ahead of anything involving code.'],
      ['p', 'It succeeds for a simple reason: the messages are ordinary. They do not look like crime. They look like work.'],
      ['h2', 'The four you are most likely to receive'],
      ['h3', 'The changed account number'],
      ['p', 'An email arrives inside a genuine invoice conversation. The supplier apologises: their old account is frozen, please pay into this new one. The thread is real, the tone is right, the amount matches. Only the account number is different.'],
      ['p', 'This is the most expensive version, and the defence is procedural rather than technical: **any change of payment details is confirmed by voice, on a number you already had, before anything is paid.**'],
      ['h3', 'The manager in a hurry'],
      ['p', 'A short message, apparently from the owner or MD, sent from an unfamiliar address or number. In a meeting. Cannot take calls. Needs a transfer or airtime now, will explain later. It targets the reluctance of a junior member of staff to question a senior one.'],
      ['p', 'The counter is a rule the whole team knows: no payment happens on a message alone, no matter who it appears to come from, and nobody is ever in trouble for checking.'],
      ['h3', 'The login page that is almost right'],
      ['p', 'A shared-document notification, a mailbox-full warning, a fake courier tracking page. The page it opens looks exactly like Microsoft 365 or Gmail, because it is a copy. Whatever you type goes straight to the attacker.'],
      ['p', 'Check the address bar before typing. Better still, do not reach login pages through links at all: type the address yourself or use a bookmark. A password manager helps here too, because it will not autofill on a domain that does not match.'],
      ['h3', 'The OTP request'],
      ['p', 'A call or message from "your bank", "WhatsApp support" or a customer with a payment problem, asking you to read out the code you just received. That code is the account.'],
      ['h2', 'Reading a message with cold eyes'],
      ['ul', [
        '**Was it expected?** Unexpected plus urgent is the combination that costs money.',
        '**Who actually sent it?** Read the address, not the display name. Watch for a missing or extra character in the domain.',
        '**Where does the link go?** Hover on a computer, press and hold on a phone.',
        '**What is it asking for?** Credentials, codes and payment changes are the three requests that deserve a phone call.',
        '**Does the pressure make sense?** Real deadlines rarely arrive with a threat attached.',
      ]],
      ['h2', 'The controls that reduce the damage'],
      ['ol', [
        'Two-factor authentication on business email, then banking, then everything else. A stolen password stops being enough.',
        'A written payment-verification rule, agreed and repeated, covering changed account details and any transfer above a threshold you choose.',
        'Unique passwords, so one captured login does not open five doors.',
        'A reporting habit: same day, no blame. Campaigns hit several colleagues, so the first report protects the rest.',
        'Ten minutes a quarter walking the team through a real message you received.',
      ]],
      ['h2', 'If someone has already clicked'],
      ['ol', [
        'Change that password immediately, from a different device, then sign out of all sessions.',
        'Check the mailbox for forwarding rules or filters the attacker may have added.',
        'If money moved, call the bank at once. Speed is the only thing that makes a trace or reversal possible.',
        'Preserve evidence: the message, headers, screenshots, transaction references.',
        'Report to [ngCERT](https://cert.gov.ng), and to the [EFCC](https://www.efcc.gov.ng) where funds are involved.',
        'Tell the team what the message looked like, the same day.',
      ]],
      ['quote', 'Verification is a two-minute phone call. Recovery, when it is possible at all, takes weeks.'],
    ],
    related: [
      { label: 'Phishing threat summary', href: '/threats/phishing' },
      { label: 'Business email compromise', href: '/threats/business-email-compromise' },
      { label: 'How to secure your business email', href: '/learn/email-security' },
      { label: 'Security checklist', href: '/resources/security-checklist' },
    ],
  },
};

// Routes served by the approved designs rather than the article blocks above.
export const APPROVED_LEARN = ['password-security', 'backup-and-recovery', 'business-wifi'];

const TONES = ['', 'b', 'g', 'o'];

export function learnIndexBody() {
  const live = LEARN_TOPICS.filter((topic) => topic.live);
  const soon = LEARN_TOPICS.filter((topic) => !topic.live);
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
      copy: 'The four phishing messages you are most likely to receive, and the rules that stop each one.',
      href: '/learn/phishing-guide',
      more: 'Read',
    })}${live.map((t, i) => card(t, i, 'Read')).join('')}</div>`,
  })}
${section({
    heading: 'Being written next',
    sub: 'These pages are on the way. The topics below already have outlines in place.',
    inner: `<div class="grid">${soon.map((t, i) => card(t, i + 1, 'Preview')).join('')}</div><p style="margin-top:28px">${btn({ label: 'Start the Security Checklist', href: '/resources/security-checklist', primary: true, arrow: true })}</p>`,
  })}`;
}

export function learnPages() {
  return Object.entries(LEARN_ARTICLES).map(([slug, article]) => ({
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
