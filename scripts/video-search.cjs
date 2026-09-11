const fs=require('node:fs');
(async()=>{
 const inv=JSON.parse(fs.readFileSync('qa/video-inventory.json'));
 const extra=process.argv.includes('--extra');
 const queries={'银耳百合羹':'银耳 百合 莲子 汤','红枣桂圆银耳':'桂圆 银耳汤','猪肉白菜包子':'白菜肉包','白粥':'大米粥 熬粥','红薯小米粥':'红薯 小米 粥','蔬菜鸡蛋羹':'蔬菜 蒸蛋','手撕鸡丝':'黄瓜 凉拌鸡丝','清炒芥蓝':'清炒芥兰','水煮玉米':'煮玉米 教程','鸡胸肉片':'水煮 鸡胸肉 清水','蒸米饭':'电饭煲 煮米饭','刀切馒头':'刀切馒头 教程'};
 const file=extra?'qa/video-search-extra.json':'qa/video-search.json',out=fs.existsSync(file)?JSON.parse(fs.readFileSync(file)):{};
 const keys=extra?Object.keys(queries):[...new Set([...inv.recipes,...inv.dishes.filter(x=>!x.ready)].map(x=>x.key))];
 for(const key of keys){
  if(out[key]?.length)continue;
  try{
   const r=await fetch('https://search.bilibili.com/all?keyword='+encodeURIComponent(extra?queries[key]:key+' 做法'),{signal:AbortSignal.timeout(20000)});
   if(!r.ok)throw Error('HTTP '+r.status);
   const html=await r.text(),items=[];
   for(const part of html.split('bili-video-card__wrap').slice(1)){
    const bv=part.match(/\/video\/(BV[0-9A-Za-z]+)\//)?.[1];
    const title=part.match(/<img[^>]*\balt="([^"]+)"/)?.[1];
    if(bv&&title&&!items.some(x=>x.bv===bv))items.push({bv,title:title.replace(/&amp;/g,'&').replace(/&quot;/g,'"')});
    if(items.length===(extra?10:5))break;
   }
   out[key]=items;console.log(key+' '+JSON.stringify(items));
  }catch(e){console.log(key+' ERROR '+e.message);}
  fs.writeFileSync(file,JSON.stringify(out,null,2));
  await new Promise(r=>setTimeout(r,450));
 }
})().catch(e=>{console.error(e);process.exit(1)});
