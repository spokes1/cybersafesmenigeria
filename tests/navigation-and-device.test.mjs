import test from 'node:test';
import assert from 'node:assert/strict';
import { isMobileDevice } from '../tools/assets/kenny-game/device.js';
import { assertNavigationOwnership } from '../tools/lib/navigation-check.mjs';

test('device identity distinguishes phones/tablets from narrow or touch desktops', () => {
  for (const device of [
    {userAgent:'Mozilla/5.0 (Linux; Android 14; Pixel 7) Mobile'},
    {userAgent:'Mozilla/5.0 (iPhone; CPU iPhone OS 17)'},
    {userAgent:'Mozilla/5.0 (Linux; Android 13; Tablet)'},
    {userAgent:'Mozilla/5.0 Macintosh',platform:'MacIntel',maxTouchPoints:5},
    {userAgent:'',userAgentData:{mobile:true}},
  ]) assert.equal(isMobileDevice(device),true);
  for (const device of [
    {userAgent:'Mozilla/5.0 (Windows NT 10.0)',maxTouchPoints:10},
    {userAgent:'Mozilla/5.0 (X11; Linux x86_64)'},
    {userAgent:'Mozilla/5.0 Macintosh',platform:'MacIntel',maxTouchPoints:0},
  ]) assert.equal(isMobileDevice(device),false);
});

function fixture() {return {
  pages:[{path:'/learn/topic',section:'Learn'},{path:'/resources/check',section:'Resources'}],
  nav:[{label:'Learn',href:'/learn',columns:[[{label:'Topic',href:'/learn/topic'}]]},{label:'Resources',href:'/resources',columns:[[{label:'Check',href:'/resources/check'}]]}],
  search:[{url:'/learn/topic',section:'Learn'},{url:'/resources/check',section:'Resources'}],
  footer:[{heading:'Resources',links:[{href:'/resources/check'}]}],
};}
test('ownership guard accepts one home per published topic',()=>assert.equal(assertNavigationOwnership(fixture()).size,2));
test('ownership guard rejects cross-menu duplicates, including URL variants',()=>{
  const f=fixture();f.nav[1].columns[0].push({label:'Another name',href:'/learn/topic/?source=menu'});
  assert.throws(()=>assertNavigationOwnership(f),/Duplicate menu topic/);
});
test('ownership guard catches misclassification and omitted live topics',()=>{
  const f=fixture();f.search[0].section='Resources';assert.throws(()=>assertNavigationOwnership(f),/Wrong search owner/);
  const g=fixture();g.nav[0].columns=[[]];assert.throws(()=>assertNavigationOwnership(g),/Published topic missing/);
  const h=fixture();h.footer[0].links=[{href:'/learn/topic'}];assert.throws(()=>assertNavigationOwnership(h),/Wrong footer owner/);
  const i=fixture();i.search[0].section='Hub';assert.throws(()=>assertNavigationOwnership(i),/Wrong search owner/);
});
