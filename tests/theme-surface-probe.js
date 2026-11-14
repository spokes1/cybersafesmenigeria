() => {
 const rgba=s=>{const m=s.match(/[\d.]+/g);return m?[+m[0],+m[1],+m[2],m[3]===undefined?1:+m[3]]:[0,0,0,0];};
 const blend=(a,b)=>a.slice(0,3).map((v,i)=>v*a[3]+b[i]*(1-a[3])).concat(1);
 const lum=c=>c.slice(0,3).map(v=>{v/=255;return v<=.04045?v/12.92:((v+.055)/1.055)**2.4;}).reduce((a,v,i)=>a+v*[.2126,.7152,.0722][i],0);
 const contrast=(a,b)=>(Math.max(lum(a),lum(b))+.05)/(Math.min(lum(a),lum(b))+.05);
 const visible=e=>{if(!e.getClientRects().length)return false;for(let n=e;n;n=n.parentElement){const s=getComputedStyle(n);if(n.hidden||s.display==='none'||s.visibility==='hidden'||+s.opacity===0)return false;}return true;};
 function backgrounds(e){let chain=[],n=e,candidates=[[255,255,255,1]];while(n){chain.unshift(n);n=n.parentElement;}for(n of chain){const s=getComputedStyle(n),solid=rgba(s.backgroundColor);candidates=candidates.map(b=>blend(solid,b));const stops=[...s.backgroundImage.matchAll(/rgba?\([^)]+\)/g)].map(m=>rgba(m[0]));if(stops.length)candidates=stops.flatMap(a=>candidates.map(b=>blend(a,b))).slice(0,24);}return candidates;}
 const id=e=>e.tagName.toLowerCase()+(typeof e.className==='string'&&e.className.trim()?'.'+e.className.trim().split(/\s+/).join('.'):''),surfaces=[],icons=[];
 for(const e of document.querySelectorAll('main *')){
  if(!visible(e)||e.closest('.cs-game')||['IMG','SVG','PATH','USE','CANVAS'].includes(e.tagName))continue;
  const s=getComputedStyle(e),r=e.getBoundingClientRect();
  if(r.width<=70||r.height<=22)continue;
  const fills=[rgba(s.backgroundColor),...[...s.backgroundImage.matchAll(/rgba?\([^)]+\)/g)].map(m=>rgba(m[0]))];
  if(matchMedia('(prefers-color-scheme:dark)').matches&&fills.some(c=>c[3]>.8&&Math.min(...c.slice(0,3))>175))surfaces.push({selector:id(e),parent:id(e.parentElement),bg:s.backgroundColor,image:s.backgroundImage,text:e.textContent.trim().slice(0,65)});
 }
 // Decorative SVGs are deliberately included: their visibility was part of
 // the reported defect even when their adjacent text already names the action.
 for(const e of document.querySelectorAll('main svg.i')){
  if(!visible(e)||e.closest('.cs-game'))continue;
  const s=getComputedStyle(e),fg=rgba(s.color),candidates=backgrounds(e),ratio=Math.min(...candidates.map(b=>contrast(blend(fg,b),b)));
  if(ratio<3)icons.push({parent:id(e.parentElement),trail:[e,e.parentElement,e.parentElement.parentElement,e.parentElement.parentElement.parentElement].map(id).join(" < "),symbol:e.querySelector('use')?.getAttribute('href'),fg:s.color,ratio:+ratio.toFixed(2)});
 }
 return {surfaces,icons,overflow:document.documentElement.scrollWidth>innerWidth+1};
}
