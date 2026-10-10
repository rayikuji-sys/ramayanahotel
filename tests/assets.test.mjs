import test from 'node:test';
import assert from 'node:assert/strict';
import {mkdtempSync,mkdirSync,writeFileSync,readFileSync,rmSync} from 'node:fs';
import {resolve,join} from 'node:path';
import {tmpdir} from 'node:os';
import sharp from 'sharp';
const sandbox=mkdtempSync(join(tmpdir(),'ramayana-assets-'));
process.env.HOTEL_PROJECT_ROOT=sandbox;
process.env.HOTEL_ASSET_DIR=join(sandbox,'registry');
mkdirSync(join(sandbox,'public/media'),{recursive:true});
mkdirSync(join(sandbox,'booking-engine/public/assets'),{recursive:true});
const original=await sharp({create:{width:30,height:20,channels:4,background:'#ffffff'}}).png().toBuffer();
for(const path of ['public/media/ramayana-logo.png','booking-engine/public/assets/ramayana-official.png','public/media/room.webp'])writeFileSync(join(sandbox,path),original);
writeFileSync(join(sandbox,'public/media/hero.mp4'),Buffer.from('0123456789'));
const store=await import('../lib/asset-store.mjs');
const {assetResponse}=await import('../lib/asset-response.mjs');
test('asset registry: atomic cross-system replacement, revision conflict, optimization and restoration',async()=>{
 const logo=store.assetCatalog().find(a=>a.brand);assert.equal(logo.aliases.length,2);
 const before=await store.optimizedAsset(logo.key,64,75);
 const replacement=await sharp({create:{width:50,height:25,channels:4,background:'#b38742'}}).jpeg().toBuffer();
 const version=await store.replaceAsset(logo.key,replacement,'new-logo.jpg','staff','original');
 for(const alias of logo.aliases){const asset=store.assetFile(alias.key);assert.equal(asset.version,version);assert.equal(asset.mime,'image/png');assert.equal((await sharp(store.assetBytes(alias.key)).metadata()).width,50);}
 assert.deepEqual(readFileSync(join(sandbox,'public/media/ramayana-logo.png')),original);
 assert.notEqual((await store.optimizedAsset(logo.key,64,75)).etag,before.etag);
 await assert.rejects(store.replaceAsset(logo.key,replacement,'stale.jpg','staff','original'),{status:409});
 assert.equal(store.assetFile(logo.key).version,version);
 store.restoreAsset(logo.key,'original','staff',version);
 assert.deepEqual(store.assetBytes(logo.key),original);
 store.restoreAsset(logo.key,version,'staff','original');
 assert.equal(store.assetFile('website:ramayana-logo.png').version,version);
 assert.ok(store.assetHistory(logo.key).some(v=>v.id===version));
});
test('invalid paths, undecodable uploads and cross-asset restoration rejected',async()=>{
 for(const key of ['website:../secret.png','website:/secret.png','other:room.webp'])assert.throws(()=>store.assetFile(key));
 await assert.rejects(store.replaceAsset('website:room.webp',Buffer.from('<svg/>'),'fake.png','staff','original'),{status:400});
 assert.throws(()=>store.restoreAsset('website:room.webp',store.assetFile('website:ramayana-logo.png').version,'staff','original'),{status:404});
});
test('media serves browser byte ranges, HEAD and cache revalidation',async()=>{
 const req=headers=>new Request('http://localhost/media/hero.mp4',{headers});
 const partial=assetResponse(req({range:'bytes=2-5'}),'website:hero.mp4');assert.equal(partial.status,206);assert.equal(await partial.text(),'2345');assert.equal(partial.headers.get('content-range'),'bytes 2-5/10');
 const suffix=assetResponse(req({range:'bytes=-3'}),'website:hero.mp4');assert.equal(await suffix.text(),'789');
 assert.equal(assetResponse(req({range:'bytes=12-15'}),'website:hero.mp4').status,416);
 const head=assetResponse(new Request('http://localhost',{method:'HEAD'}),'website:hero.mp4');assert.equal(await head.text(),'');assert.equal(head.headers.get('content-length'),'10');
 assert.equal(assetResponse(req({'if-none-match':head.headers.get('etag')}),'website:hero.mp4').status,304);
});
test.after(()=>{store.closeAssetStore();assert.ok(resolve(sandbox).startsWith(resolve(tmpdir())+requireSeparator()));rmSync(sandbox,{recursive:true,force:true});});
function requireSeparator(){return process.platform==='win32'?'\\':'/';}
