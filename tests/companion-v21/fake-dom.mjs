// A minimal controlled DOM fixture for exercising the real widget module.
// It does not simulate browser layout, CSS painting or assistive technology.
export function createEnvironment({ reducedMotion=false, failImages=[], decodeRejectLoaded=[] }={}) {
  let now=0, nextId=1;
  const scheduled=new Map(), hosts=[], imageHistory=[];
  const makeTarget=()=>({listeners:new Map(),addEventListener(name,fn){if(!this.listeners.has(name))this.listeners.set(name,new Set());this.listeners.get(name).add(fn);},removeEventListener(name,fn){this.listeners.get(name)?.delete(fn);},dispatch(name,event={}){for(const fn of [...this.listeners.get(name)||[]])fn({target:this,...event});}});
  const doc=Object.assign(makeTarget(),{visibilityState:'visible',baseURI:'https://example.test/',activeElement:null});
  function element(selector='',shadow=null) {
    const classes=new Set(), attributes=new Map();
    const e=Object.assign(makeTarget(),{selector,shadow,children:[],dataset:{},style:{setProperty(name,value){this[name]=value;}},hidden:false,textContent:'',disabled:false,removed:false,open:false,
      classList:{toggle(name,force){const yes=force===undefined?!classes.has(name):force;if(yes)classes.add(name);else classes.delete(name);return yes;},contains:name=>classes.has(name),add(...names){for(const n of names)classes.add(n);},remove(...names){for(const n of names)classes.delete(n);}},
      setAttribute(name,value){attributes.set(name,String(value));},getAttribute(name){return attributes.get(name)??null;},removeAttribute(name){attributes.delete(name);},
      append(...nodes){for(const n of nodes){this.children.push(n);n.parentElement=this;if(n.tagName==='KENNY-COMPANION')hosts.push(n);}},
      appendChild(node){this.append(node);return node;},
      contains(node){if(!node)return false;if(node===this)return true;return this.children.some(c=>c.contains?.(node));},
      closest(query){return e.editable&&query.includes('input')?e:null;},
      matches(query){return query===':hover'?Boolean(e.hovered):false;},getClientRects(){return this.hidden?[]:[{width:100,height:40}];},
      focus(){doc.activeElement=shadow?.host??e;if(shadow)shadow.activeElement=e;},
      remove(){this.removed=true;const i=hosts.indexOf(this);if(i>=0)hosts.splice(i,1);},
      getRootNode(){return shadow??doc;},
    });
    let src='';
    Object.defineProperty(e,'src',{get:()=>src,set(value){const next=new URL(value,doc.baseURI).href;if(next!==src){src=next;imageHistory.push({at:now,selector,src:next});}}});
    Object.defineProperty(e,'innerHTML',{get:()=>'',set(value){e.template=value;}});
    return e;
  }
  doc.body=element('body');doc.activeElement=doc.body;
  doc.createElement=tag=>{
    const e=element(tag);e.tagName=tag.toUpperCase();
    e.attachShadow=()=>{
      const nodes=new Map();
      const s={host:e,activeElement:null,innerHTML:'',querySelector(selector){
        if(!nodes.has(selector)){
          const n=element(selector,s);nodes.set(selector,n);
          if(!['link','.companion','.edge','.peeker','.peeker img','.peeker-visual','.peeker-visual img','.peek-image','.sr-only.announcer','.announcer'].includes(selector)&&selector!=='.panel'){
            const p=s.querySelector('.panel');p.children.push(n);n.parentElement=p;
          }
        }
        return nodes.get(selector);
      },querySelectorAll(selector){return [...nodes.values()].filter(n=>n.selector===selector);},getSelection(){return {isCollapsed:true};}};
      e.shadowRoot=s;return s;
    };
    return e;
  };
  doc.querySelectorAll=selector=>selector==='kenny-companion'?[...hosts]:[];
  doc.querySelector=selector=>doc.querySelectorAll(selector)[0]??null;
  doc.getSelection=()=>({isCollapsed:true});
  const storage=()=>{const m=new Map();return {getItem:key=>m.get(key)??null,setItem:(key,value)=>m.set(key,String(value)),removeItem:key=>m.delete(key),clear:()=>m.clear()};};
  const media=Object.assign(makeTarget(),{matches:reducedMotion});
  const schedule=(fn,delay,repeat=0)=>{const id=nextId++;scheduled.set(id,{fn,at:now+Math.max(0,delay),repeat});return id;};
  const win=Object.assign(makeTarget(),{sessionStorage:storage(),localStorage:storage(),matchMedia:()=>media,getComputedStyle:()=>({visibility:'visible'}),
    setInterval:(fn,delay)=>schedule(fn,delay,delay),clearInterval:id=>scheduled.delete(id),
    setTimeout:(fn,delay)=>schedule(fn,delay),clearTimeout:id=>scheduled.delete(id),
    requestAnimationFrame:fn=>schedule(()=>fn(now),16),cancelAnimationFrame:id=>scheduled.delete(id),
    location:{assign(value){win.assigned=value;}},innerWidth:390,innerHeight:844});
  class FakeImage { set src(value){this._src=value;if(decodeRejectLoaded.some(name=>value.includes(name))){this.complete=true;this.naturalWidth=320;Promise.resolve().then(()=>this.onload?.());}}get src(){return this._src;}decode(){return [...failImages,...decodeRejectLoaded].some(name=>this.src.includes(name))?Promise.reject(Error('Image decode failed')):Promise.resolve();}}
  const previous=new Map();
  for(const [key,value] of Object.entries({document:doc,window:win,Image:FakeImage,performance:{now:()=>now},setTimeout:win.setTimeout,clearTimeout:win.clearTimeout,setInterval:win.setInterval,clearInterval:win.clearInterval,requestAnimationFrame:win.requestAnimationFrame,cancelAnimationFrame:win.cancelAnimationFrame})){
    previous.set(key,Object.getOwnPropertyDescriptor(globalThis,key));Object.defineProperty(globalThis,key,{configurable:true,writable:true,value});
  }
  async function flush(){for(let i=0;i<5;i++)await Promise.resolve();}
  async function advance(ms){
    const end=now+ms;
    for(let safety=0;safety<100000;safety++){
      let selected=null;
      for(const [id,task]of scheduled)if(task.at<=end&&(!selected||task.at<selected.task.at))selected={id,task};
      if(!selected)break;
      now=selected.task.at;
      if(selected.task.repeat)selected.task.at+=selected.task.repeat;else scheduled.delete(selected.id);
      selected.task.fn();await flush();
    }
    now=end;await flush();
  }
  return {document:doc,window:win,media,hosts,imageHistory,scheduled,flush,advance,get now(){return now;},get host(){return hosts[0];},get shadow(){return hosts[0]?.shadowRoot;},restore(){for(const [key,descriptor]of previous){if(descriptor)Object.defineProperty(globalThis,key,descriptor);else delete globalThis[key];}}};
}
