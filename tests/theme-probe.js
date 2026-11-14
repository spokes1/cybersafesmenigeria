() => {
 const rgba=s=>{const m=s.match(/[\d.]+/g);return m?[+m[0],+m[1],+m[2],m[3]===undefined?1:+m[3]]:[0,0,0,0];};
 const blend=(front,back)=>{const a=front[3];return front.slice(0,3).map((v,i)=>v*a+back[i]*(1-a)).concat(1);};
 const luminance=c=>c.slice(0,3).map(v=>{v/=255;return v<=.04045?v/12.92:((v+.055)/1.055)**2.4;}).reduce((a,v,i)=>a+v*[.2126,.7152,.0722][i],0);
 const ratio=(a,b)=>{let x=luminance(a),y=luminance(b);return (Math.max(x,y)+.05)/(Math.min(x,y)+.05);};
 function bg(el){let chain=[],c=el;while(c){chain.unshift(c);c=c.parentElement;}let candidates=[[255,255,255,1]],gradient=false;for(const node of chain){const cs=getComputedStyle(node),solid=rgba(cs.backgroundColor);if(solid[3]===1)gradient=false;candidates=candidates.map(base=>blend(solid,base));if(cs.backgroundImage!=='none'){gradient=true;const stops=[...cs.backgroundImage.matchAll(/rgba?\([^)]+\)/g)].map(m=>rgba(m[0]));if(stops.length){const mixed=[];for(const stop of stops)for(const base of candidates)mixed.push(blend(stop,base));candidates=mixed.filter((v,i,all)=>all.findIndex(x=>x.slice(0,3).join(',')===v.slice(0,3).join(','))===i).slice(0,24);}}}return {colors:candidates,gradient};}
 function visible(el){const cs=getComputedStyle(el);if(cs.visibility==='hidden'||cs.display==='none'||!el.getClientRects().length)return false;for(let n=el;n;n=n.parentElement){if(getComputedStyle(n).opacity==='0'||n.hidden)return false;}return true;}
 const tree=document.createTreeWalker(document.body,NodeFilter.SHOW_TEXT);let node,items=[],signatures=[];
 while(node=tree.nextNode()){
  const text=node.textContent.trim().replace(/\s+/g,' ');if(!text||/^[·/|→←↗✓–—•]+$/.test(text))continue;const el=node.parentElement;if(!el||['SCRIPT','STYLE','NOSCRIPT','OPTION','SVG','PATH','TITLE'].includes(el.tagName)||!visible(el)||el.closest('[aria-hidden="true"]'))continue;
  const cs=getComputedStyle(el),back=bg(el),front=rgba(cs.color);if(cs.backgroundClip==='text'||cs.webkitBackgroundClip==='text'||!front[3]||cs.webkitTextFillColor==='rgba(0, 0, 0, 0)')continue;
  const ranked=back.colors.map(color=>({color,ratio:ratio(blend(front,color),color)})).sort((a,b)=>a.ratio-b.ratio);const r=ranked[0].ratio,large=parseFloat(cs.fontSize)>=24||(parseFloat(cs.fontSize)>=18.66&&+cs.fontWeight>=700),threshold=large?3:4.5;
  const disabled=Boolean(el.closest(':disabled,[aria-disabled="true"]'));
  const selector=el.tagName.toLowerCase()+(el.className&&typeof el.className==='string'?'.'+el.className.trim().split(/\s+/).join('.'):'');
  const parent=el.parentElement?.className;
  signatures.push([selector,text,cs.color,cs.backgroundColor,cs.borderColor,cs.fontSize,cs.fontWeight]);
  if(r<threshold-.02)items.push({selector,parent:typeof parent==='string'?parent:'',text:text.slice(0,140),fg:cs.color,bg:ranked[0].color.map(v=>Math.round(v)),ratio:+r.toFixed(2),threshold,gradient:back.gradient,disabled});
 }
 return {failures:items,signatures,overflow:document.documentElement.scrollWidth>innerWidth+1};
}
