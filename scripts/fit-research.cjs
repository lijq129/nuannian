const fs=require('node:fs');
(async()=>{
 if(process.argv.includes('--metadata')){
  const out={};
  for(const bv of ['BV12DbH6UEfS','BV193UGBVE3P','BV18p4y1V7zB','BV12m4y1A731','BV1WF411v7jg','BV1Cv411H79n','BV1Sz4y1S7pb']){
   const o=await(await fetch('https://api.bilibili.com/x/web-interface/view?bvid='+bv,{signal:AbortSignal.timeout(20000)})).json();
   if(o.code!==0)throw Error(bv+': '+o.message);
   const d=o.data;out[bv]={bv,title:d.title,desc:d.desc,owner:d.owner,duration:d.duration,rights:d.rights,dimension:d.dimension,pages:d.pages,checked:'2026-09-11'};
   console.log(JSON.stringify(out[bv]));
  }
  fs.writeFileSync('qa/fit-metadata.json',JSON.stringify(out,null,2));return;
 }
 const out={};
 for(const q of ['踝泵 跟练','踝泵 运动 医院','坐姿 跟练 康复','手指操 医院','坐式 运动 卫生署','呼吸 放松 跟练 不屏息']){
  const r=await fetch('https://search.bilibili.com/all?keyword='+encodeURIComponent(q),{signal:AbortSignal.timeout(20000)});
  if(!r.ok)throw Error(r.status);
  const items=[];
  for(const part of (await r.text()).split('bili-video-card__wrap').slice(1)){
   const bv=part.match(/\/video\/(BV[0-9A-Za-z]+)\//)?.[1],title=part.match(/<img[^>]*\balt="([^"]+)"/)?.[1];
   if(bv&&title&&!items.some(x=>x.bv===bv))items.push({bv,title});if(items.length===6)break;
  }
  out[q]=items;console.log(q+' '+JSON.stringify(items));
 }
 fs.writeFileSync('qa/fit-search.json',JSON.stringify(out,null,2));
})().catch(e=>{console.error(e);process.exit(1)});
