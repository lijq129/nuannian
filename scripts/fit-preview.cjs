const {chromium}=require('playwright'),sharp=require('sharp'),fs=require('node:fs');
(async()=>{
 const b=await chromium.launch({executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',headless:true});
 const results=[];
 try{
  for(const bv of ['BV12DbH6UEfS','BV1WF411v7jg','BV1Cv411H79n']){
   const p=await b.newPage({viewport:{width:800,height:500}});
   await p.goto('https://player.bilibili.com/player.html?bvid='+bv+'&autoplay=0&danmaku=0',{waitUntil:'domcontentloaded'});
   await p.waitForFunction(()=>document.querySelector('video')?.readyState>=2,{},{timeout:40000});
   const v=p.locator('video').first(),duration=await v.evaluate(v=>v.duration),shots=[];
   const play=await v.evaluate(async v=>{v.muted=true;await v.play();return true});
   await p.waitForTimeout(1200);
   const time=await v.evaluate(v=>v.currentTime);
   for(const ratio of [0.06,.22,.38,.54,.7,.9]){
    await v.evaluate((v,t)=>{v.pause();v.currentTime=t;},duration*ratio);await p.waitForTimeout(1500);
    shots.push(await sharp(await p.screenshot()).resize(400,250).png().toBuffer());
   }
   await sharp({create:{width:1200,height:500,channels:3,background:'#fff'}}).composite(shots.map((input,i)=>({input,left:i%3*400,top:Math.floor(i/3)*250}))).png().toFile('qa/fit-preview-'+bv+'.png');
   results.push({bv,duration,play,time});console.log(JSON.stringify(results.at(-1)));
   await p.goto('about:blank');await p.close();
  }
  fs.writeFileSync('qa/fit-preview-results.json',JSON.stringify(results,null,2));
 }finally{await b.close();}
})().catch(e=>{console.error(e);process.exit(1)});
