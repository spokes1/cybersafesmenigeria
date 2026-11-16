import { verifyKennyMaterials } from './material-check.js';
import { isMobileDevice } from './device.js';
// One shared renderer, loaded only when motion is enabled. Gameplay never waits for it.
const root=document.createElement('div');
root.className='kenny-stage';root.setAttribute('role','img');root.setAttribute('aria-label','Kenny, your friendly cyber guide');
root.innerHTML='<div class="stage-glow"></div><img class="kenny-still" src="/assets/kenny-game/kenny/Kenny_Neutral.webp" alt="" width="600" height="600"><span class="stage-status" aria-live="polite">Kenny is getting ready…</span>';
const reduce=matchMedia('(prefers-reduced-motion: reduce)');
let paused=reduce.matches||(isMobileDevice()&&Boolean(navigator.connection?.saveData)),loading=null,runtime=null,failed=false,visible=true,frame=0,last=0,cue='Wave',reading=false,quietAfter=false,selectedName='Idle_Loop',cueSequence=[],nextQueue=[],blinkTimer;
const status=t=>root.querySelector('.stage-status').textContent=t;
function stop(){cancelAnimationFrame(frame);clearTimeout(blinkTimer);frame=0;last=0;}
function draw(time){frame=0;if(!runtime||paused||!visible||document.hidden||!root.isConnected)return;const {renderer,scene,camera,animator}=runtime;const dt=last?Math.min((time-last)/1000,.05):0;last=time;
 if(!reading)animator.update(dt);renderer.render(scene,camera);
 if(!reading&&!(quietAfter&&selectedName==='Idle_Loop'))frame=requestAnimationFrame(draw);
 else if(!reading&&quietAfter)blinkTimer=setTimeout(()=>{if(!paused&&visible&&!document.hidden&&root.isConnected){runtime.animator.play('Blink');refresh();}},5500);
}
function refresh(){stop();if(runtime&&!paused&&visible&&!document.hidden&&root.isConnected)frame=requestAnimationFrame(draw);}
function resize(){if(!runtime||!root.isConnected)return;const width=root.clientWidth,height=root.clientHeight;if(!width||!height)return;const {renderer,camera,modelHeight}=runtime;
 renderer.setSize(width,height,false);camera.aspect=width/height;
 const distance=modelHeight*(camera.aspect<.85?2.8:2.35);
 camera.position.set(modelHeight*.025,modelHeight*.57,distance);camera.lookAt(0,modelHeight*.51,0);camera.updateProjectionMatrix();refresh();
}
async function load(){if(runtime||failed||paused)return;if(loading)return loading;
 loading=(async()=>{
  let renderer;
  try{
   const [THREE,{GLTFLoader},{RoomEnvironment},{KennyAnimator}]=await Promise.all([import('./vendor/three/build/three.module.js'),import('./vendor/three/examples/jsm/loaders/GLTFLoader.js'),import('./vendor/three/examples/jsm/RoomEnvironment.js'),import('./kenny-animator.js')]);
   if(paused)return;
   renderer=new THREE.WebGLRenderer({alpha:true,antialias:true,powerPreference:'low-power'});
   renderer.setPixelRatio(Math.min(devicePixelRatio||1,1.5));renderer.setClearColor(0x000000,0);renderer.outputColorSpace=THREE.SRGBColorSpace;renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=.95;
   renderer.domElement.setAttribute('aria-hidden','true');
   const scene=new THREE.Scene();const environment=new RoomEnvironment();const pmrem=new THREE.PMREMGenerator(renderer);const env=pmrem.fromScene(environment,.04);scene.environment=env.texture;environment.dispose();pmrem.dispose();
   const camera=new THREE.PerspectiveCamera(33,1,.01,1000);
   scene.add(new THREE.HemisphereLight(0xe5f5ff,0x829c90,2.1));
   const gltf=await new GLTFLoader().loadAsync(new URL('./kenny/Kenny_Animated.glb',import.meta.url).href);
   verifyKennyMaterials(gltf);
   const bounds=new THREE.Box3().setFromObject(gltf.scene),center=bounds.getCenter(new THREE.Vector3()),height=bounds.max.y-bounds.min.y;
   const wrapper=new THREE.Group();wrapper.position.set(-center.x,-bounds.min.y,-center.z);wrapper.add(gltf.scene);scene.add(wrapper);
   for(const [color,intensity,x,y,z] of [[0xfff5e9,3.2,2,3,3],[0xe4f4ff,1.3,-3,1.7,2],[0xffffff,1.6,.5,2.5,-2]]){const light=new THREE.DirectionalLight(color,intensity);light.position.set(x*height,y*height,z*height);light.target.position.set(0,height*.5,0);scene.add(light,light.target);}
   const animator=new KennyAnimator(gltf.scene,gltf.animations);animator.onChange=name=>{selectedName=name;if(name==='Idle_Loop'&&nextQueue.length)animator.play(nextQueue.shift());};
   runtime={renderer,scene,camera,animator,modelHeight:height,env};
   camera.near=height/100;camera.far=height*100;
   root.append(renderer.domElement);root.classList.add('has-model');status('');
   renderer.domElement.addEventListener('webglcontextlost',e=>{e.preventDefault();stop();root.classList.remove('has-model');failed=true;status('Kenny’s illustration is available.');});
   renderer.domElement.addEventListener('webglcontextrestored',()=>{failed=false;root.classList.add('has-model');status('');resize();applyCue();});
   resize();applyCue();
  }catch(error){renderer?.dispose();failed=true;root.classList.remove('has-model');status('Kenny’s illustration is available.');console.warn('Kenny 3D unavailable; static fallback active.',error);}
 })().finally(()=>{loading=null;});return loading;
}
function applyCue(){if(!runtime||paused||failed)return;try{nextQueue=[...cueSequence];if(reading){runtime.animator.neutral();selectedName=null;}else runtime.animator.play(cue,{repeat:!quietAfter&&/^(Idle_Loop|Talk_Loop)$/.test(cue)});resize();}catch{status('Kenny’s illustration is available.');root.classList.remove('has-model');}}
export function placeKenny(host,{clip='Wave',calm=false,settle=false,sequence=[]}={}){stop();cue=clip;cueSequence=sequence;reading=calm;quietAfter=settle;host.append(root);root.classList.toggle('motion-paused',paused);if(paused){status('Motion paused');}else{status(failed?'Kenny’s illustration is available.':runtime?'':'Kenny is getting ready…');if(runtime)applyCue();else load();}resize();}
export function setPaused(value){paused=value;root.classList.toggle('motion-paused',paused);if(paused){stop();status('Motion paused');}else{status(failed?'Kenny’s illustration is available.':runtime?'':'Kenny is getting ready…');if(runtime)applyCue();else load();}return paused;}
export const isPaused=()=>paused;
new ResizeObserver(resize).observe(root);
if('IntersectionObserver'in window)new IntersectionObserver(entries=>{visible=Boolean(entries[0]?.isIntersecting);visible?refresh():stop();}).observe(root);
document.addEventListener('visibilitychange',()=>document.hidden?stop():refresh());
reduce.addEventListener('change',e=>{if(e.matches||!isMobileDevice()){setPaused(e.matches);document.dispatchEvent(new CustomEvent('kenny-motion-change'));}});
window.addEventListener('pagehide',stop);window.addEventListener('pageshow',refresh);
