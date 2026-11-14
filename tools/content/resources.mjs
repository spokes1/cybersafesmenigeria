import { readFileSync } from 'node:fs';
import SELF_CHECK_V2 from './selfcheck-v2.json' with { type: 'json' };
import { icon } from '../lib/icons.mjs';
import { hubHero, section, iconCard, btn, artHero, artSection, keepLearning } from '../lib/components.mjs';
import { RESOURCE_CATEGORIES } from './catalog.mjs';

const trail = (label) => [{ label: 'Home', href: '/' }, { label: 'Resources', href: '/resources' }, { label }];

const TOOLS = [
  {
    mark: 'BW',
    title: 'Bitwarden',
    copy: 'Password manager with a free tier that covers a small team. Stores every login behind one master passphrase.',
    href: 'https://bitwarden.com',
  },
  {
    mark: 'HIBP',
    title: 'Have I Been Pwned',
    copy: 'Check whether a business email address has appeared in a known data breach. Free, no sign-up needed.',
    href: 'https://haveibeenpwned.com',
  },
  {
    mark: 'VT',
    title: 'VirusTotal',
    copy: 'Scan a suspicious file or link against dozens of engines before you open it.',
    href: 'https://www.virustotal.com',
  },
  {
    mark: 'AUTH',
    title: 'Authy',
    copy: 'Authenticator app for two-factor codes, with encrypted backup if you change phones.',
    href: 'https://authy.com',
  },
  {
    mark: 'GA',
    title: 'Google Authenticator',
    copy: 'Free authenticator app. Generates 2FA codes on the device, so a SIM swap cannot intercept them.',
    href: 'https://support.google.com/accounts/answer/1066447',
  },
];



/* ---------- Pages ---------- */
const TONES = ['', 'g', 'b'];

/** Organisation, tool or reference link: the short name as a tag, then title and copy. */
const linkCard = (item, i) =>
  iconCard({ iconName: '', tag: item.mark, title: item.title, copy: item.copy, href: item.href, more: item.linkLabel || 'Visit site', ext: true });

export function resourcesIndexBody() {
  return `${hubHero({
    pill: `${RESOURCE_CATEGORIES.length} categories`,
    pillIcon: 'folder',
    title: 'Resources',
    lead: 'Printable downloads, Nigerian reporting contacts, carefully selected external learning resources and practical security tools, all in one place.',
    trail: [{ label: 'Home', href: '/' }, { label: 'Resources' }],
  })}
${section({
    heading: 'Browse by category',
    tint: true,
    inner: `<div class="grid resource-four-grid">${RESOURCE_CATEGORIES.map((c, i) =>
      iconCard({ iconName: c.iconName, tone: TONES[i % TONES.length], title: c.name, copy: c.copy, href: c.href })
    ).join('')}</div>`,
  })}
<section class="rv"><div class="wrap"><div class="resource-self-check"><h2>The security self-check</h2><p class="sub">15 questions about the basics. Your answers stay in your browser. Nothing is submitted anywhere.</p><div class="btns">${btn({ label: 'Start the Security Self-Check', href: '/resources/security-checklist', primary: true })}</div></div></div></section>`;
}

const escCheck = (s) => String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');

export function checklistPageBody() {
 const data = SELF_CHECK_V2;
 const groups = [...new Set(data.questions.map(q=>q.group))];
 const questions = groups.map((g,i)=>`<fieldset class="sc2-group"><legend>${i+1}. ${escCheck(g)}</legend><div class="sc2-questions">${data.questions.filter(q=>q.group===g).map(q=>`<div class="sc2-question" data-question="${q.id}"><h3>${q.id}. ${escCheck(q.statement)}</h3><p>${escCheck(q.help)}</p><div class="sc2-choices" role="group" aria-label="Answer ${q.id}">${data.answers.filter(a=>a.id!=='na'||q.allow_na).map(a=>`<label><input type="radio" name="${q.id}" value="${a.id}"> <span>${escCheck(a.label)}</span></label>`).join('')}</div><a class="sc2-learn" href="${q.article}">Read related guidance</a></div>`).join('')}</div></fieldset>`).join('');
 return `${artHero({pill:'Resources · 15 questions · 5 areas',pillIcon:'list',title:'Business Security Self-Check',lead:'Fifteen practical questions. One useful next step. Review what is in place and what to improve next.',trail:trail('Security Self-Check')})}
 <div class="wrap art-main sc2" id="sc2-root"><p class="sub">Review habits around accounts, payments, devices, records and people. This is an awareness and planning exercise, not a security audit, risk grade, compliance assessment or security guarantee.</p>
 <p class="sc2-privacy">Your answers stay in this browser. Nothing is submitted to CyberSafe. You can use the check even if browser storage is unavailable. Never enter passwords, OTPs or private account details.</p>
 <form id="sc2-form"><div class="sc2-top"><label for="sc2-business">Business name for your printed action plan (optional)</label><input id="sc2-business" type="text" autocomplete="off" maxlength="70" placeholder="Your business or team"></div>${questions}
 <div class="sc2-footer"><p id="sc2-progress" role="status" aria-live="polite">0 of 15 questions answered.</p><button class="btn p" type="submit">Show my action plan</button><button class="btn" type="button" id="sc2-reset">Clear my answers on this device</button></div></form>
 <section id="sc2-result" class="sc2-result" hidden aria-live="polite"></section>
 <div class="sc2-nojs"><h2>Prefer a paper version?</h2><p>All 15 questions are readable without JavaScript. To calculate results privately in this browser, enable JavaScript. Otherwise print the blank form, choose one answer per question and make a short action plan.</p><a class="btn" href="/downloads/business-security-self-check-blank.pdf">Download blank 15-question form (PDF)</a></div>
 </div><script src="/assets/js/selfcheck-v2.js" defer></script>`;
}

export function downloadsPageBody() {
 const files = [
 ['Payment Verification Desk Card','payment-verification-desk-card.pdf','Quick card','Money coming in and going out, for payment staff and approvers.',[['Payment Security','/protect-your-business/payment-security'],['Fake Bank Alerts','/threats/fake-bank-alerts']]],
 ['Suspicious Message Staff Card','suspicious-message-staff-card.pdf','Quick card','Pause, Check, Report for WhatsApp, SMS and email.',[['Phishing','/threats/phishing'],['Social Engineering','/threats/social-engineering']]],
 ['First-Hour Incident Record','first-hour-incident-record.pdf','Working record','Record facts, decisions, contacts and follow-up during an incident.',[['Incident Response','/protect-your-business/incident-response'],['Organisations','/resources/organisations']]],
 ['Account and Device Access Register','account-device-access-register.pdf','Working record','Review employee access, devices, roles and offboarding.',[['Account Security','/protect-your-business/account-security'],['Device Security','/protect-your-business/device-security']]],
 ['Backup and Restore Test Log','backup-restore-test-log.pdf','Working record','Record backup copies and actual restoration tests.',[['Backup & Recovery','/learn/backup-and-recovery']]],
 ['15-Question Business Security Self-Check','business-security-self-check-blank.pdf','Printable companion','Blank paper copy of the same 15 approved online questions. Not your personalised results.',[['Interactive Self-Check','/resources/security-checklist']]],
 ];
 return `${artHero({pill:'Resources · Six printable PDFs',pillIcon:'download',title:'Downloads: free security cards and templates',lead:'Small security habits, ready to print and use.',trail:trail('Downloads')})}<div class="wrap art-main sc2-downloads"><p class="sub">Free cards and simple records for payments, suspicious messages, access and recovery. No account. No payment. No uploads to CyberSafe.</p><p>Choose a quick card for staff or a blank record for a manager. Save it, print it if helpful, agree an owner and review it when circumstances change.</p>
 <div class="sc2-download-grid">${files.map((f,i)=>`<article class="sc2-download"><span class="tag">${escCheck(f[2])}</span><h2>${i+1}. ${escCheck(f[0])}</h2><p>${escCheck(f[3])}</p><a class="btn p" href="/downloads/${f[1]}" download>Download PDF</a><p class="sc2-linkrow">Related: ${f[4].map(l=>`<a href="${l[1]}">${escCheck(l[0])}</a>`).join(' · ')}</p></article>`).join('')}</div>
 <h2>Use these documents safely</h2><p>Completed records may contain sensitive business or personal information. Keep them private. Never record passwords, PINs, one-time codes, recovery keys, full card details or private encryption keys.</p><p>If fraud is happening now, contact the relevant bank or provider through its official channel. These templates are not emergency services, bank-issued instructions or proof of compliance.</p></div>`;
}

function linkListPage({ title, lead, items, fine }) {
  return `${hubHero({ pill: 'Resources', pillIcon: 'ext', title, lead, trail: trail(title) })}
${section({ tint: true, inner: `<div class="grid">${items.map(linkCard).join('')}</div><p class="fine">${fine}</p>` })}`;
}

export function organisationsBody() {
  // Approved Nigeria-first organisations guide; maintained at source, not generated HTML.
  return readFileSync(new URL('./approved/organisations.html', import.meta.url), 'utf8');
}

export function externalBody() {
  // Owner-approved editorial library maintained in source, not generated HTML.
  return readFileSync(new URL('./approved/external.html', import.meta.url), 'utf8');
}

export function toolsBody() {
  // Owner-approved Nigeria-first resource guide, maintained in the source fragment.
  return readFileSync(new URL('./approved/tools-nigeria.html', import.meta.url), 'utf8');
}
