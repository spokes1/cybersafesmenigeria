import fs from 'node:fs';import assert from 'node:assert/strict';
import {GLTFLoader} from '../tools/assets/kenny-game/vendor/three/examples/jsm/loaders/GLTFLoader.js';
import {verifyKennyMaterials} from '../tools/assets/kenny-game/material-check.js';
const policy=fs.readFileSync(new URL('../netlify.toml',import.meta.url),'utf8');
assert.match(policy,/connect-src\s+'self'\s+blob:/);assert.match(policy,/script-src 'self';/);
const bytes=fs.readFileSync(new URL('../tools/assets/kenny-game/kenny/Kenny_Animated.glb',import.meta.url));
// Use the actual loader and actual Blob fetch transport. Only the browser image decoder is stubbed.
const originalFetch=globalThis.fetch;globalThis.self={URL};let blobFetches=0;
globalThis.createImageBitmap=async blob=>({width:2048,height:2048,close(){},decodedByteLength:blob.size});
let blockBlob=true;
globalThis.fetch=(url,opts)=>{if(String(url).startsWith('blob:')){blobFetches++;if(blockBlob)return Promise.reject(new Error('Simulated old CSP blocked blob: texture transport'));}return originalFetch(url,opts);};
const parse=()=>new GLTFLoader().parseAsync(bytes.buffer.slice(bytes.byteOffset,bytes.byteOffset+bytes.byteLength),'');
const originalError=console.error;console.error=()=>{};
const broken=await parse();console.error=originalError;assert.throws(()=>verifyKennyMaterials(broken),/texture missing/);assert.ok(blobFetches>=3);
blockBlob=false;const fixed=await parse();assert.ok(verifyKennyMaterials(fixed)>0);
let map;fixed.scene.traverse(o=>{if(o.material?.name==='Material.002')map=o.material.map;});assert.equal(map.colorSpace,'srgb');assert.equal(map.flipY,false);
const minimal={scene:{traverse(fn){fn({isMesh:true,material:{name:'Material.002'}});}}};assert.throws(()=>verifyKennyMaterials(minimal),/texture missing/);
console.log('Texture regression passed: reproduced old blob-policy failure, rejected white untextured model, fetched all 3 embedded texture images under fixed policy, verified material maps/sRGB/flipY. Image decoder stubbed; rendered colours still need browser review.');
