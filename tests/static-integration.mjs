import fs from 'node:fs';import path from 'node:path';import assert from 'node:assert/strict';import {createHash} from 'node:crypto';
const root=new URL('../',import.meta.url).pathname;
const hash=p=>createHash('sha256').update(fs.readFileSync(p)).digest('hex');
const walk=p=>fs.readdirSync(p,{withFileTypes:true}).flatMap(e=>e.isDirectory()?walk(path.join(p,e.name)):[path.join(p,e.name)]);
for(const dir of ['kenny-game','kenny-companion'])for(const source of walk(root+'tools/assets/'+dir))assert.equal(hash(source),hash(root+'public/assets/'+dir+source.split('/tools/assets/'+dir)[1]));
for(const name of ['kenny-session.js','kenny-website.js','example-reveal.js'])assert.equal(hash(root+'tools/assets/'+name),hash(root+'public/assets/js/'+name));
for(const name of ['kenny-bootstrap.js','kenny-invitation.js','spot-the-scam-bootstrap.js','spot-the-scam-game.js','mascot.js','scenarios.js'])assert.equal(fs.existsSync(root+'public/assets/js/'+name),false);
for(const file of walk(root+'public').filter(f=>f.endsWith('.html'))){const text=fs.readFileSync(file,'utf8');assert.ok(!text.includes('stsKennyRoot'));assert.ok(!text.includes('/assets/js/kenny-bootstrap.js'));assert.ok(!text.includes('spot-the-scam-bootstrap.js'));for(const script of text.matchAll(/<script[^>]*src="([^"]+)"/g))assert.ok(script[1].startsWith('/assets/'));}
assert.ok(fs.readFileSync(root+'public/about/index.html','utf8').includes('/assets/js/kenny-website.js'));
for(const name of ['mission','team','contact'])assert.ok(fs.readFileSync(root+'public/about/'+name+'/index.html','utf8').includes('content="0;url=/about#'+name+'"'));

assert.ok(!fs.readFileSync(root+'public/learn/spot-the-scam/index.html','utf8').includes('/assets/js/kenny-website.js'));
let moduleCount=0;for(const file of [...walk(root+'public/assets/kenny-game'),...walk(root+'public/assets/kenny-companion'),root+'public/assets/js/kenny-session.js',root+'public/assets/js/kenny-website.js'].filter(f=>f.endsWith('.js'))){const code=fs.readFileSync(file,'utf8');for(const m of [...code.matchAll(/^import[\s\S]*?\bfrom\s*(['"])([^'"]+)\1/gm),...code.matchAll(/\bimport\s*\(\s*(['"])([^'"]+)\1/g)]){assert.ok(m[2].startsWith('.'));assert.ok(fs.existsSync(path.resolve(path.dirname(file),m[2].split('?')[0])),file+' -> '+m[2]);moduleCount++;}}
const before=JSON.parse(fs.readFileSync(root+'tests/preserved-assets.json','utf8'));for(const [name,digest]of Object.entries(before))assert.equal(hash(root+name),digest,name+' changed');
console.log(`Integration static checks passed: source/output parity, legacy removal, About page enrollment, ${moduleCount} module dependencies, preserved PDFs/self-check/brand images.`);
