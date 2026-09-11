const fs=require('node:fs');
const ids=['BV1Hu4y1v7sL','BV1PV411v7Ej','BV1pu411f75A','BV16A411Y7bu','BV1yW411N7uG','BV1vU4y1g7Pg','BV1AV41167Pr','BV1ofKEzjEUd','BV17f4y117hL','BV1GS4y197g2','BV1pUbQzkEje','BV1iJcMzvESC','BV1YzYDzeEZm','BV1JcgzzHEUx'];
(async()=>{const out=fs.existsSync('qa/fit-collection-metadata.json')?JSON.parse(fs.readFileSync('qa/fit-collection-metadata.json')):{};
 for(const bv of [...ids,...process.argv.slice(2)]){
  if(out[bv])continue;
  const o=await(await fetch('https://api.bilibili.com/x/web-interface/view?bvid='+bv,{signal:AbortSignal.timeout(20000)})).json();if(o.code!==0)throw Error(bv+o.message);
  const d=o.data;out[bv]={bv,title:d.title,desc:d.desc,up:d.owner.name,mid:d.owner.mid,duration:d.duration,rights:d.rights,dimension:d.dimension,pages:d.pages.map(p=>({page:p.page,title:p.part,duration:p.duration})),checked:'2026-09-11'};
  fs.writeFileSync('qa/fit-collection-metadata.json',JSON.stringify(out,null,2));console.log(JSON.stringify(out[bv]));
 }
})().catch(e=>{console.error(e);process.exit(1)});
