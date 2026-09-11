const {chromium}=require('playwright');
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
(async()=>{
 const live=process.argv.includes('--live');
 const browser=await chromium.launch({executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',headless:true});
 try{
  const page=await browser.newPage({viewport:{width:390,height:844}}),errors=[],report={live};
  page.on('pageerror',e=>errors.push(e.message));
  if(!live)await page.route('https://player.bilibili.com/**',route=>route.fulfill({contentType:'text/html',body:'<!doctype html><html lang="zh"><body style="background:#172720;color:white;text-align:center">播放器占位（自动化离线测试）</body></html>'}));
  await page.goto('file:///'+path.resolve('index.html').replace(/\\/g,'/'));
  await page.evaluate(()=>{go('diet');dietTab='recipe';recipeCat='全部';renderDiet();});
  if(live){
   report.samples=[];
   for(const name of ['番茄炒蛋','刀切馒头','蓝莓玛芬']){
    await page.evaluate(name=>{recipeOpen=null;recipeQuery=name;recipeCat='全部';renderDiet();},name);
    await page.locator('#diet-body .acc-h').first().click();
    await page.locator('.video-stage').first().scrollIntoViewIfNeeded();
    await page.waitForTimeout(14000);
    const frame=page.frames().find(f=>f.url().includes('player.bilibili.com'));
    const item={name,frameUrl:frame?.url(),text:frame?await frame.locator('body').innerText().catch(()=>'<unavailable>'):'<no frame>'};
    if(frame){
     item.before=await frame.locator('video').evaluateAll(vs=>vs.map(v=>({duration:v.duration,readyState:v.readyState,paused:v.paused,error:v.error?.code})));
     if(item.before.length){
      item.play=await frame.locator('video').first().evaluate(async v=>{v.muted=true;try{await v.play();return 'started';}catch(e){return e.message;}});
      await page.waitForTimeout(2500);
      item.after=await frame.locator('video').first().evaluate(v=>({currentTime:v.currentTime,paused:v.paused,readyState:v.readyState,error:v.error?.code}));
     }
    }
    await page.locator('#diet-body .acc.open').screenshot({path:'qa/video-live-'+name+'.png'});
    report.samples.push(item);console.log(JSON.stringify(item));
   }
  }else{
   report.coverage=await page.evaluate(()=>({recipes:DIET.recipes.length,missingRecipes:DIET.recipes.filter(r=>!videoInfo(r.kw||r.name)).map(r=>r.name),missingDishes:Object.keys(DISHES).filter(k=>!dishBody(k).ready&&!videoInfo(dishBody(k).kw||k)),unknown:videoInfo('不存在的番茄炒蛋变体'),ready:document.createElement('div').innerHTML=dishStepHTML('牛奶','200ml')}));
   assert.deepEqual(report.coverage.missingRecipes,[]);assert.deepEqual(report.coverage.missingDishes,[]);assert.equal(report.coverage.unknown,null);assert.ok(!report.coverage.ready.includes('data-player-src'));
   assert.equal(await page.locator('.video-stage iframe').count(),0,'closed accordions must not load players');
   assert.equal(await page.locator('#diet-body .cooking-video').count(),68);
   assert.equal(await page.locator('#diet-body [data-act="webfind"]').count(),0);
   const headers=page.locator('#diet-body .acc-h');
   for(let i=0;i<68;i++){
    await headers.nth(i).click();
    const frame=page.locator('.video-stage iframe');assert.equal(await frame.count(),1);
    assert.ok((await frame.getAttribute('src')).includes('autoplay=0'));
    assert.ok(await frame.getAttribute('title'));
    await headers.nth(i).click();assert.equal(await frame.count(),0);
   }
   await headers.nth(0).click();await headers.nth(1).click();assert.equal(await page.locator('.video-stage iframe').count(),1);
   await page.locator('#diet-body .acc').nth(0).locator('[data-act="loadcooking"]').click();assert.equal(await page.locator('#diet-body .acc').nth(0).locator('iframe').count(),1);
   await page.evaluate(()=>go('home'));assert.equal(await page.locator('.video-stage iframe').count(),0);
   await page.evaluate(()=>{go('diet');dietTab='menu';renderDiet();});
   // 食材按钮的文本由菜名和份量组成，选择一个有烹饪视频的面板。
   const dishIndex=await page.locator('[data-act="dish"]').evaluateAll(es=>es.findIndex(e=>e.nextElementSibling?.querySelector('.video-stage')));
   assert.ok(dishIndex>=0);await page.locator('[data-act="dish"]').nth(dishIndex).click();assert.equal(await page.locator('.video-stage iframe').count(),1);
   await page.locator('[data-act="dish"]').nth(dishIndex).click();assert.equal(await page.locator('.video-stage iframe').count(),0);
   report.layouts=[];
   for(const width of [320,390,768,1280]){
    await page.setViewportSize({width,height:900});
    await page.evaluate(()=>{S.settings.font=2;applyFont();dietTab='recipe';recipeQuery='番茄炒蛋';recipeOpen=null;renderDiet();});
    await page.locator('#diet-body .acc-h').first().click();
    const layout=await page.evaluate(()=>({width:innerWidth,scrollWidth:document.documentElement.scrollWidth,frameWidth:document.querySelector('.video-stage').getBoundingClientRect().width}));
    assert.ok(layout.scrollWidth<=width,JSON.stringify(layout));assert.ok(layout.frameWidth>180);report.layouts.push(layout);
    await page.locator('#diet-body .acc.open').screenshot({path:'qa/video-layout-'+width+'.png'});
   }
   report.accordions=68;report.lifecycle='passed';
  }
  report.errors=errors;fs.writeFileSync(live?'qa/video-live-results.json':'qa/video-results.json',JSON.stringify(report,null,2));
  if(!live)assert.deepEqual(errors,[]);
  console.log(live?'Live checks recorded':'68 recipe players, all dish mappings, ready foods, single-player lifecycle, 4 responsive widths passed');
  // 先卸载跨站媒体，再退出浏览器，避免播放器连接拖住测试进程。
  await page.evaluate(()=>stopCookingVideos());
  await page.goto('about:blank');
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exit(1);});
