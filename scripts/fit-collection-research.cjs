const fs=require('node:fs'),vm=require('node:vm');
(async()=>{
 const ctx=vm.createContext({});vm.runInContext(fs.readFileSync('js/data-fit-video.js','utf8'),ctx);
 const extra=process.argv.includes('--extra');
 const groups=extra?[{videos:['周六野 八段锦','周六野 15分钟 瑜伽','周六野 全身解压','欧阳春晓 12分钟 下肢力线','欧阳春晓 根本性 瘦小腿','MIZI 30分钟 无跳跃','10分钟 站立 热身'].map(q=>({q}))}]:vm.runInContext('FIT_COLLECTIONS',ctx),out={};
 for(const group of groups)for(const v of group.videos){
  const html=await(await fetch('https://search.bilibili.com/all?keyword='+encodeURIComponent(v.q),{signal:AbortSignal.timeout(20000)})).text();
  const items=[];
  for(const part of html.split('bili-video-card__wrap').slice(1)){
   const bv=part.match(/\/video\/(BV[0-9A-Za-z]+)\//)?.[1],title=part.match(/<img[^>]*\balt="([^"]+)"/)?.[1];
   if(bv&&title&&!items.some(x=>x.bv===bv))items.push({bv,title});if(items.length===8)break;
  }
  out[v.q]=items;console.log(v.q+' '+JSON.stringify(items));
 }
 fs.writeFileSync(extra?'qa/fit-collection-extra.json':'qa/fit-collection-search.json',JSON.stringify(out,null,2));
})().catch(e=>{console.error(e);process.exit(1)});
