// Build-time presentation normalisation. Work on element ranges so unrelated
// source markup, verified destinations and interaction data attributes survive.
import { SEARCH } from '../content/search.mjs';
import { NAV } from '../content/nav.mjs';
import { LINK_LABELS } from '../content/link-labels.mjs';
import { icon } from './icons.mjs';
const esc=s=>String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/"/g,'&quot;');
const decode=s=>s.replace(/&(?:amp|lt|gt|quot|apos|nbsp|#x[\da-f]+|#\d+);/gi,x=>({ '&amp;':'&','&lt;':'<','&gt;':'>','&quot;':'"','&apos;':"'",'&nbsp;':' ' }[x]??String.fromCodePoint(x.startsWith('&#x')?parseInt(x.slice(3,-1),16):parseInt(x.slice(2,-1),10))));
const text=s=>decode(s.replace(/<[^>]*>/g,'')).replace(/\s+/g,' ').trim();
const voids=new Set('area base br col embed hr img input link meta param source track wbr'.split(' '));
export function elements(html){
 const nodes=[],stack=[];
 const tokens=html.matchAll(/<!--[\s\S]*?-->|<\/?[a-zA-Z](?:[^<>"']|"[^"]*"|'[^']*')*>/g);
 for(const m of tokens){const token=m[0];if(token.startsWith('<!--'))continue;const tag=token.match(/^<\/?([\w:-]+)/)[1].toLowerCase();
  if(token.startsWith('</')){const i=stack.findLastIndex(n=>n.tag===tag);if(i<0)continue;const n=stack[i];n.close=m.index;n.end=m.index+token.length;stack.length=i;continue;}
  const attrs=Object.fromEntries([...token.matchAll(/([\w:-]+)\s*=\s*(?:"([^"]*)"|'([^']*)')/g)].map(a=>[a[1],decode(a[2]??a[3])]));
  const n={tag,attrs,start:m.index,open:m.index+token.length,close:m.index+token.length,end:m.index+token.length,parent:stack.at(-1)};nodes.push(n);
  if(!voids.has(tag)&&!token.endsWith('/>'))stack.push(n);
 }
 return nodes;
}
const classes=n=>(n?.attrs.class||'').split(/\s+/);
const ancestor=(n,p)=>{for(let a=n?.parent;a;a=a.parent)if(p(a))return a;};
const replace=(html,edits)=>{
 const kept=[];let end=-1;for(const e of edits.sort((a,b)=>a.start-b.start||b.end-a.end)){if(e.start<end)continue;kept.push(e);end=e.end;}
 for(const e of kept.reverse())html=html.slice(0,e.start)+e.value+html.slice(e.end);return html;
};
const routeOf=href=>href.split(/[?#]/)[0].replace(/\/$/,'')||'/';
const titles=new Map(SEARCH.map(x=>[x.url,x.title]));for(const menu of NAV)for(const l of (menu.columns||[]).flat())titles.set(l.href,l.label);
const COPY={
 '/threats/fake-bank-alerts':'Confirm transfers through your own bank before releasing goods or cash.',
 '/threats/phishing':'Recognise deceptive messages that seek your information or account access.',
 '/learn/password-security':'Protect important accounts with strong, different passwords and extra sign-in protection.',
 '/protect-your-business/payment-security':'Build safer habits for receiving payments and approving transfers.',
 '/protect-your-business/incident-response':'Choose useful first actions after a suspected cyber incident.',
 '/threats/sim-swap-fraud':'Protect your number and accounts when unexpected service loss occurs.',
 '/learn/data-protection':'Handle customer and employee information responsibly.',
 '/resources/organisations':'Find the Nigerian organisation that handles your reporting or support need.',
 '/learn/cybersecurity-basics':'Understand the everyday accounts, devices and information your business relies on.',
 '/learn/employee-security':'Help your team recognise risks, verify requests and report concerns.',
 '/learn/backup-and-recovery':'Keep separate backups and check that important files can be restored.',
 '/learn/whatsapp-security':'Review access, linked devices and recovery protection for WhatsApp Business.',
 '/learn/email-security':'Secure business email and recognise suspicious account or payment changes.',
 '/learn/mobile-security':'Protect work phones, review permissions and prepare for loss or theft.',
 '/learn/business-wifi':'Separate guest access from the network your business devices use.',
 '/learn/social-media-security':'Protect business profiles, permissions and account recovery details.',
 '/protect-your-business/account-security':'Review access controls and recovery options for important business accounts.',
 '/protect-your-business/device-security':'Keep work computers updated, locked and ready for safe recovery.',
 '/threats/business-email-compromise':'Verify unusual supplier or payment instructions through a trusted contact.',
 '/threats/whatsapp-hijacking':'Recognise account-takeover attempts and know the first recovery actions.',
 '/threats/malware':'Recognise warning signs and arrange trusted help for a suspected infection.',
 '/threats/ransomware':'Understand file-locking attacks and safer steps for business recovery.',
 '/threats/social-engineering':'Recognise pressure, impersonation and requests that bypass normal checks.',
 '/learn/phishing-guide':'Practise checking suspicious business messages before taking action.',
 '/resources/tools':'Choose practical security features and tools that suit your business.',
 '/resources/external':'Explore official cybersecurity learning resources and guidance.',
 '/resources/security-checklist':'Review your business habits and create a practical action plan.',
 '/learn/spot-the-scam':'Practise safer decisions with Kenny in fictional business situations.',
};
const symbol=href=>({'fake-bank-alerts':'bank','phishing':'mail','password-security':'lock','payment-security':'money','incident-response':'bolt','sim-swap-fraud':'sim','data-protection':'shield','organisations':'building','employee-security':'users','backup-and-recovery':'cloud','whatsapp-security':'chat','email-security':'mail','mobile-security':'phone','business-wifi':'wifi','device-security':'laptop','account-security':'key'}[href.split('/').at(-1)]||'book');
export function relatedCards(links,id='keep-learning',wrap=false){
 const cards=links.map(href=>{const route=routeOf(href),entry=SEARCH.find(x=>x.url===route);const section=entry?.section==='Protect'?'Protect Your Business':entry?.section||'Learn';const copy=COPY[route]||entry?.summary||'Explore practical guidance for your business.';
  return `<a class="card cs-learning-card" href="${esc(href)}"><span class="ci">${icon(symbol(route))}</span><h3>${esc(titles.get(route)||'CyberSafe guide')}</h3><p>${esc(copy)}</p><span class="tag">${esc(section)}</span></a>`;
 }).join('');
 return `<section class="cs-keep-learning${wrap?' wrap':''}" id="${esc(id)}"><div class="cs-learning-heading"><span class="ic">${icon('arrow')}</span><h2>Keep learning</h2></div><div class="grid cs-learning-grid">${cards}</div></section>`;
}
function unifyRelated(html){
 const nodes=elements(html),roots=new Set(nodes.filter(n=>classes(n).includes('er-related')));
 for(const n of nodes)if(/^h[2-3]$/.test(n.tag)&&/^(?:keep (?:learning|exploring).*|related(?: learning guides)?|continue (?:learning |with )?.*cybersafe.*)$/i.test(text(html.slice(n.open,n.close)))){
  const root=ancestor(n,a=>classes(a).some(c=>/(?:^|-)related(?:-|$)|^sec-end$/.test(c))||a.tag==='section');
  if(root)roots.add(root);
 }
 const edits=[];
 for(const root of roots){const anchors=nodes.filter(n=>n.tag==='a'&&n.start>=root.open&&n.end<root.end);
  const ctas=anchors.filter(n=>classes(n).includes('btn'));
  const links=[...new Set(anchors.filter(n=>!ctas.includes(n)).map(n=>n.attrs.href||'').filter(h=>titles.has(routeOf(h))))];
  if(links.length){let value=relatedCards(links,root.attrs.id||'keep-learning',!ancestor(root,a=>classes(a).includes('wrap'))&&!classes(root).includes('wrap'));
   const heading=nodes.find(n=>/^h[2-3]$/.test(n.tag)&&n.start>=root.open&&n.end<root.end);
   if(heading?.attrs.id)value=value.replace('<h2>',`<h2 id="${esc(heading.attrs.id)}">`);
   if(ctas.length)value=value.replace('</section>','<div class="cs-learning-actions">'+ctas.map(n=>html.slice(n.start,n.end)).join('')+'</div></section>');
   edits.push({start:root.start,end:root.end,value});
  }
 }
 return replace(html,edits);
}
const isRaw=(s,href)=>Boolean(s)&&(/^https?:\/\/|^www\.|^\/[a-z]/i.test(s)||s===href.replace(/^https?:\/\//,'').replace(/\/$/,''));
function labelFor(href){
 if(href.startsWith('mailto:'))return 'Email CyberSafe SME Nigeria';
 if(href.startsWith('/')){const label=titles.get(routeOf(href));if(label)return label;}
 if(/^https?:/.test(href)){const u=new URL(href);const label=LINK_LABELS[(u.host+u.pathname).replace(/\/$/,'')];if(label)return label;}
 throw new Error(`Add a descriptive label for ${href}`);
}
function labelLinks(html){const edits=[];
 for(const n of elements(html))if(n.tag==='a'&&n.attrs.href){const inner=html.slice(n.open,n.close),label=text(inner).replace(/\s*\(opens in a new tab\)$/,'');
  if(!isRaw(label,n.attrs.href)&&!n.attrs.href.startsWith('mailto:'))continue;
  const replacement=labelFor(n.attrs.href),external=n.attrs.target==='_blank';
  edits.push({start:n.open,end:n.close,value:esc(replacement)+(external?'<span class="sr-only"> (opens in a new tab)</span>':'')});
  if(n.attrs['aria-label']){const opening=html.slice(n.start,n.open).replace(/aria-label=(?:"[^"]*"|'[^']*')/,`aria-label="${esc(replacement+(external?' (opens in a new tab)':''))}"`);edits.push({start:n.start,end:n.open,value:opening});}
 }
 html=replace(html,edits);
 return replace(html,elements(html).filter(n=>n.tag==='code'&&/^\s*<a\b[\s\S]*<\/a>\s*$/.test(html.slice(n.open,n.close))).map(n=>({start:n.start,end:n.end,value:html.slice(n.open,n.close)})));
}
function removeNumbering(html){const edits=[];
 for(const n of elements(html)){
  const inner=html.slice(n.open,n.close),s=text(inner),cl=classes(n);
  if(n.tag==='button'&&/^\d{1,2}$/.test(s)&&n.attrs['aria-label']){
   const label=n.attrs['aria-label'].replace(/^(?:Focus\s+)?(?:Step|Stage)\s+\d+[:.]\s*/i,'');
   if(label!==n.attrs['aria-label'])edits.push({start:n.open,end:n.close,value:esc(label)});
  }
  if(cl.includes('b4-step-status')&&/^Stage \d+ of \d+$/.test(s))edits.push({start:n.open,end:n.close,value:'Choose an action to explore'});
  if(['span','div','b','strong'].includes(n.tag)&&/^[\d\s/·.-]+$/.test(s)&&/\d/.test(s)){
   const badge=cl.some(c=>/(?:number|index|(?:^|-)num(?:$|-)|^cb-step-number$|^ds-btn-num$|^ds-item-index$|^ir-card-number$|^er-group-marker$)/.test(c));
   const sequence=ancestor(n,a=>classes(a).some(c=>['bec-route','org-report-steps','org-hero-aside'].includes(c)));
   if(badge||sequence||Object.keys(n.parent?.attrs||{}).some(k=>['data-mw-pick','data-se-pick'].includes(k))){edits.push({start:n.start,end:n.end,value:''});continue;}
  }
  if(/^h[1-6]$/.test(n.tag)||['legend','strong','b'].includes(n.tag)||cl.includes('ds-shift-num')||(n.tag==='span'&&classes(n.parent).includes('tr-need-card-head'))){
   const clean=inner.replace(/^(?:\d{1,2}[.)]\s+|[A-Z]\d{1,2}\.\s+|(?:Example|Moment|Stage|Step)\s+\d{1,2}[:.]\s*|0?\d{1,2}\s*[·:]\s*)/,'');
   if(clean!==inner)edits.push({start:n.open,end:n.close,value:clean});
  }
  if(n.tag==='ol'){const opening=html.slice(n.start,n.open);const name=n.attrs.class?'cs-unumbered-list':'cs-unumbered-list cs-plain-list';edits.push({start:n.start,end:n.open,value:n.attrs.class?opening.replace(/class="/,`class="${name} `):opening.replace(/<ol\b/,`<ol class="${name}"`)});}
 }
 return replace(html,edits);
}
export function refineEditorial(html){return removeNumbering(labelLinks(unifyRelated(html)));}
