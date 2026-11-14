import fs from 'node:fs';
import assert from 'node:assert/strict';
import * as THREE from '../tools/assets/kenny-game/vendor/three/build/three.module.js';
import {GLTFLoader} from '../tools/assets/kenny-game/vendor/three/examples/jsm/loaders/GLTFLoader.js';
import {KennyAnimator,KENNY_CLIPS} from '../tools/assets/kenny-game/kenny-animator.js';
const bytes=fs.readFileSync(new URL('../tools/assets/kenny-game/kenny/Kenny_Animated.glb',import.meta.url));
const loader=new GLTFLoader();
loader.register(parser=>{parser.loadTexture=()=>Promise.resolve(null);return {name:'HEADLESS_RIG_TEST'};});
const gltf=await loader.parseAsync(bytes.buffer.slice(bytes.byteOffset,bytes.byteOffset+bytes.byteLength),'');
assert.deepEqual([...gltf.animations.map(c=>c.name)].sort(),[...KENNY_CLIPS].sort());
const bounds=new THREE.Box3().setFromObject(gltf.scene),center=bounds.getCenter(new THREE.Vector3()),height=bounds.max.y-bounds.min.y;
const wrapper=new THREE.Group();wrapper.position.set(-center.x,-bounds.min.y,-center.z);wrapper.add(gltf.scene);
const animator=new KennyAnimator(gltf.scene,gltf.animations);let samples=0;const cameraChecks=[];
for(const clip of gltf.animations){
 animator.neutral();animator.play(clip.name,{fade:0});
 for(const fraction of [0,.2,.5,.8,1]){
  animator.seek(clip.duration*fraction);wrapper.updateMatrixWorld(true);
  gltf.scene.traverse(obj=>{assert.ok(obj.matrixWorld.elements.every(Number.isFinite));});
  const box=new THREE.Box3().setFromObject(wrapper,true);
  for(const aspect of [.64,.87,1,1.5]){
   const camera=new THREE.PerspectiveCamera(33,aspect,height/100,height*100);camera.position.set(height*.025,height*.57,height*(aspect<.85?2.8:2.35));camera.lookAt(0,height*.51,0);camera.updateMatrixWorld();
   let maxXY=0;
   for(const x of [box.min.x,box.max.x])for(const y of [box.min.y,box.max.y])for(const z of [box.min.z,box.max.z]){const p=new THREE.Vector3(x,y,z).project(camera);maxXY=Math.max(maxXY,Math.abs(p.x),Math.abs(p.y));}
   if(maxXY>.99)cameraChecks.push({clip:clip.name,fraction,aspect,maxXY});
  }
  samples++;
 }
}
animator.neutral();animator.play('Wave',{fade:0});for(let i=0;i<40;i++)animator.update(.1);assert.equal(animator.active.getClip().name,'Idle_Loop');
animator.dispose();assert.equal(cameraChecks.length,0,JSON.stringify(cameraChecks));
console.log(JSON.stringify({clips:KENNY_CLIPS.length,poseSamples:samples,finiteTransforms:true,cameraFramingChecks:samples*4,framingFailures:cameraChecks.length,waveReturnsToIdle:true,limits:'Textures skipped; no WebGL, screenshot, device performance or visual QA.'},null,2));
