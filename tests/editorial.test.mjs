import test from 'node:test';import assert from 'node:assert/strict';
import { refineEditorial } from '../tools/lib/editorial.mjs';
test('descriptive labels preserve verified destinations, tab behaviour and accessible names',()=>{
 const h=refineEditorial('<p><a href="https://cert.gov.ng/rfc2350" target="_blank" rel="noopener noreferrer" aria-label="https://cert.gov.ng/rfc2350">https://cert.gov.ng/rfc2350</a></p>');
 assert.match(h,/href="https:\/\/cert.gov.ng\/rfc2350"/);assert.match(h,/aria-label="ngCERT incident-reporting guidance \(opens in a new tab\)"/);assert.match(h,/>ngCERT incident-reporting guidance<span/);assert.match(h,/rel="noopener noreferrer"/);
 assert.throws(()=>refineEditorial('<a href="https://unknown.example/">https://unknown.example/</a>'),/Add a descriptive label/);
});
test('related cards preserve deep links and section anchors while using short descriptive titles',()=>{
 const h=refineEditorial('<section id="related-guides"><h2 id="related-title">Keep exploring</h2><p><a href="/learn/mobile-security?source=guide&amp;topic=lost#what-to-do">/learn/mobile-security</a></p></section>');
 assert.match(h,/cs-keep-learning wrap/);assert.match(h,/id="related-guides"/);assert.match(h,/href="\/learn\/mobile-security\?source=guide&amp;topic=lost#what-to-do"/);assert.match(h,/<h2 id="related-title">Keep learning<\/h2>/);assert.match(h,/<h3>Mobile Security<\/h3>/);
});
test('presentation numbering disappears without changing interaction identities or factual numbers',()=>{
 const h=refineEditorial('<section><h2 id="heading">6. Useful guidance</h2><h3 id="example-title">Example 1: Supplier change</h3><span class="org-num">06</span><button data-b3-pick="2" aria-label="Stage 3: Revoke permissions">3</button><strong>Step 2: Protect the account</strong><p>Call 112. Use a six-digit code. Review within 72 hours.</p><b id="pc">0</b><ol><li>Preserve evidence</li></ol></section>');
 assert.match(h,/<h2 id="heading">Useful guidance/);assert.match(h,/<h3 id="example-title">Supplier change/);assert.doesNotMatch(h,/org-num|Step 2:/);assert.match(h,/data-b3-pick="2"[^>]*>Revoke permissions/);assert.match(h,/Call 112/);assert.match(h,/within 72 hours/);assert.match(h,/<b id="pc">0/);assert.match(h,/cs-plain-list/);
});
test('source markup that needs no change survives byte-for-byte',()=>{
 const h='<section id="a"><h2>Why protection matters</h2><p>Keep <strong>₦85,000</strong> and the <a href="https://cert.gov.ng/">ngCERT website</a> meaningful.</p><svg class="i" aria-hidden="true"><use href="/assets/icons.svg#lock"/></svg></section>';
 assert.equal(refineEditorial(h),h);
});

test('related reading preserves a separate primary action instead of turning it into another guide card',()=>{
 const h=refineEditorial('<section><h2>Related learning guides</h2><a class="card" href="/learn/mobile-security">Mobile Security</a><p><a class="btn p" href="/resources/security-checklist">Check Your Business Security</a></p></section>');
 assert.equal((h.match(/class="card cs-learning-card"/g)||[]).length,1);assert.match(h,/cs-learning-actions/);assert.match(h,/class="btn p" href="\/resources\/security-checklist">Check Your Business Security/);
});
