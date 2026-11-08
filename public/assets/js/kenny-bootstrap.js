// Single shared, page-limited controller. Both prompts share the same scheduler.
import { mountKennyInvitation } from './kenny-invitation.js';
const host=document.getElementById('stsKennyRoot');
if(host){
  const pathname=window.location.pathname.replace(/\/$/,'')||'/';
  const invitePages=new Set([
    '/', '/learn', '/threats/fake-bank-alerts', '/threats/whatsapp-hijacking',
    '/threats/business-email-compromise', '/threats/phishing', '/learn/phishing-guide',
    '/protect-your-business/payment-security'
  ]);
  const sensitivePaths=new Set([
    '/learn/spot-the-scam','/resources/security-checklist',
    '/protect-your-business/incident-response', '/resources/organisations',
    '/about/contact'
  ]);
  mountKennyInvitation(host, {
    enabled:true,
    gameUrl:'/learn/spot-the-scam',
    eligiblePrefixes:['/'],
    isEligible:({pathname})=>invitePages.has(pathname),
    excludedPaths:[...sensitivePaths],
    shouldSuppress:()=>Boolean(document.querySelector('[data-kenny-busy]')) ||
      Boolean(document.querySelector('form:focus-within')),
    timings:{first:20000,afterPlay:300000},
    // Friendly check-in once, after five minutes of active browsing following game completion.
    checkinEligible:()=>!sensitivePaths.has(pathname),
  });
}
