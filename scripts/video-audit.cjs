const fs=require('node:fs'),vm=require('node:vm');
const ctx=vm.createContext({});
for(const f of ['data-diet','data-dish','recipe-bv'])vm.runInContext(fs.readFileSync('js/'+f+'.js','utf8'),ctx);
const inventory=vm.runInContext(`({recipes:DIET.recipes.map(r=>({name:r.name,key:videoKey(r.kw||r.name)})),dishes:Object.keys(DISHES).map(k=>({name:k,key:videoKey(dishBody(k).kw||k),ready:!!dishBody(k).ready})),seed:RECIPE_BV})`.replace('({recipes:',`(function(){function videoKey(s){return s.replace(/[（(][^）)]*[）)]/g,'').replace(/\\s*做法.*$/,'').replace(/\\s+/g,'').trim();} return {recipes:`).replace('seed:RECIPE_BV})','seed:RECIPE_BV};})()'),ctx);
fs.mkdirSync('qa',{recursive:true});
fs.writeFileSync('qa/video-inventory.json',JSON.stringify(inventory,null,2));
if(process.argv.includes('--verify')){
 (async()=>{
  const file='qa/video-metadata.json';const cache=fs.existsSync(file)?JSON.parse(fs.readFileSync(file)):{};
  const extra=fs.existsSync('qa/video-candidates.json')?JSON.parse(fs.readFileSync('qa/video-candidates.json')):{};
  for(const bv of [...new Set([...Object.values(inventory.seed),...Object.values(extra).map(v=>typeof v==='string'?v:v.bv)])]){
   if(cache[bv]?.code===0)continue;
   try{const r=await fetch('https://api.bilibili.com/x/web-interface/view?bvid='+bv,{signal:AbortSignal.timeout(15000)});const o=await r.json();const d=o.data;
    cache[bv]=d?{code:o.code,bv,title:d.title,up:d.owner?.name,duration:d.duration,cid:d.cid,pic:d.pic,rights:d.rights,dimension:d.dimension,pages:d.pages?.map(p=>({page:p.page,title:p.part,cid:p.cid})),checked:'2026-09-10'}:{code:o.code,message:o.message};
    console.log(bv+' '+(d?.title||o.message));
   }catch(e){cache[bv]={error:e.message};console.log(bv+' ERROR '+e.message);}
   fs.writeFileSync(file,JSON.stringify(cache,null,2));await new Promise(r=>setTimeout(r,180));
  }
 })().catch(e=>{console.error(e);process.exit(1)});
}else{
 console.log(JSON.stringify({recipes:inventory.recipes.length,dishes:inventory.dishes.length,ready:inventory.dishes.filter(x=>x.ready).map(x=>x.name),keys:[...new Set([...inventory.recipes,...inventory.dishes.filter(x=>!x.ready)].map(x=>x.key))]},null,2));
}
