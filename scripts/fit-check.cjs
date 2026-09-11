const {chromium}=require('playwright'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
(async()=>{
 const live=process.argv.includes('--live'),b=await chromium.launch({executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',headless:true});
 try{
  const p=await b.newPage({viewport:{width:390,height:844}}),errors=[],report={live,players:[],layouts:[]};p.on('pageerror',e=>errors.push(e.message));
  if(!live)await p.route('https://player.bilibili.com/**',r=>r.fulfill({contentType:'text/html',body:'<body style="background:#172720;color:white">离线播放器测试</body>'}));
  await p.goto('file:///'+path.resolve('index.html').replace(/\\/g,'/'));
  await p.evaluate(()=>{S.healthChecks[today()]={status:'clear',symptom:'',updatedAt:new Date().toISOString()};P0().exerciseApproved=true;moveTab='video';go('move')});
  assert.equal(await p.locator('.fit-video-card').count(),16);
  assert.equal(await p.locator('[data-fit-collection]').count(),3);
  assert.equal(await p.locator('[data-restored-fit]').count(),14);
  assert.deepEqual(await p.evaluate(()=>FIT_COLLECTIONS.map(c=>[c.name,c.videos.length])),[['周六野 Zoey',5],['欧阳春晓 Aurora',4],['低冲击博主合集',5]]);
  assert.ok((await p.locator('#move-body').innerText()).includes('Eleni Fit · 45 分钟站立 HIIT'));
  assert.ok((await p.locator('#move-body').innerText()).includes('少女背 · 直角肩'));
  assert.equal(await p.locator('#move-body a[href*="search"]').count(),0);
  assert.equal(await p.locator('#move-body a[target="_blank"]').count(),0);
  assert.equal(await p.locator('.video-stage iframe').count(),0);
  assert.equal(await p.locator('#move-body [data-act="dyfind"]').count(),0);
  assert.equal(await p.locator('#vmodal').evaluate(e=>e.classList.contains('hidden')),true);
  const before=await p.evaluate(()=>JSON.stringify(S.logs));
  const ids=await p.evaluate(()=>[...FIT_COLLECTIONS.flatMap(c=>c.videos),...FIT_VIDEOS].map(v=>v.id));
  for(const id of ids){
   const card=p.locator('[data-fit-id="'+id+'"]');
   if(!await card.evaluate(e=>e.classList.contains('open')))await card.locator('.acc-h').click();
   assert.equal(await p.locator('.video-stage iframe').count(),0,'opening fitness details must not contact the third party');
   await card.locator('[data-act="loadfit"]').click();
   assert.equal(await p.locator('.video-stage iframe').count(),1);
   const src=await card.locator('iframe').getAttribute('src');assert.ok(src.includes('autoplay=0'));
   if(live){
    await card.locator('.video-stage').evaluate(e=>e.scrollIntoView({block:'center'}));
    const frame=await card.locator('iframe').elementHandle().then(e=>e.contentFrame());
    try { await frame.waitForFunction(()=>document.querySelector('video')?.readyState>=2,{},{timeout:40000}); }
    catch(e){console.log(id,frame.url(),await frame.locator('body').innerText());await p.screenshot({path:'qa/fit-live-failure.png'});throw e;}
    const v=frame.locator('video').first();assert.equal(await v.evaluate(v=>v.paused),true);
    await v.evaluate(async v=>{v.muted=true;await v.play()});await p.waitForTimeout(1600);
    const state=await v.evaluate(v=>({time:v.currentTime,paused:v.paused,duration:v.duration}));assert.ok(state.time>0&&!state.paused);
    report.players.push({id,src,...state});
    await card.locator('.video-stage').evaluate(e=>e.scrollIntoView({block:'center'}));await p.screenshot({path:'qa/fit-live-'+id+'.png'});
    console.log(id+' playing '+state.duration+'s');
   }
   await card.locator('[data-act="stopfit"]').click();assert.equal(await p.locator('.video-stage iframe').count(),0);
  }
  assert.equal(await p.evaluate(()=>JSON.stringify(S.logs)),before,'watching must not mark workout complete');
  await p.locator('[data-fit-id="ankle"] .acc-h').click();await p.locator('[data-fit-id="hands"] .acc-h').click();assert.equal(await p.locator('.video-stage iframe').count(),0);
  await p.locator('[data-fit-id="ankle"] [data-act="loadfit"]').click();assert.equal(await p.locator('[data-fit-id="ankle"] iframe').count(),1);
  await p.locator('[data-fit-id="hands"] [data-act="loadfit"]').click();assert.equal(await p.locator('[data-fit-id="hands"] iframe').count(),1);assert.equal(await p.locator('[data-fit-id="ankle"] iframe').count(),0);
  await p.locator('[data-fit-id="ankle"] [data-act="loadfit"]').click();
  await p.locator('[data-fit-id="ankle"] [data-act="retryfit"]').click();assert.equal(await p.locator('[data-fit-id="ankle"] iframe').count(),1);
  await p.locator('[data-act="movetab"][data-t="routine"]').click();assert.equal(await p.locator('.video-stage iframe').count(),0);
  await p.locator('[data-act="movetab"][data-t="course"]').click();
  assert.equal(await p.locator('[data-act="coursevideo"]').count(),0,'unrelated courses must not link to the video library');
  assert.equal(await p.locator('.course-card').count(),await p.evaluate(()=>EX.courses.length));
  assert.equal(await p.locator('.course-card [data-act="start"]').count(),await p.evaluate(()=>EX.courses.length));
  assert.equal(await p.locator('.course-card .video-stage').count(),0);
  assert.equal(await p.evaluate(()=>moveTab),'course');
  report.courseVideoIndependent=true;
  await p.locator('[data-act="movetab"][data-t="video"]').click();assert.equal(await p.locator('[data-restored-fit]').count(),14);
  await p.locator('[data-fit-id="ankle"] .acc-h').click();await p.locator('[data-fit-id="ankle"] [data-act="loadfit"]').click();assert.equal(await p.locator('.video-stage iframe').count(),1);
  await p.evaluate(()=>go('home'));assert.equal(await p.locator('.video-stage iframe').count(),0);
  if(!live){
   for(const width of [320,390,768,1280]){
    await p.setViewportSize({width,height:900});await p.evaluate(()=>{S.settings.font=2;applyFont();moveTab='video';go('move')});
    assert.equal(await p.evaluate(()=>document.documentElement.scrollWidth),width);
    report.layouts.push({width,overflow:false});await p.screenshot({path:'qa/fit-layout-'+width+'.png',fullPage:true});
   }
   // 饮食内嵌视频仍可创建与停止，避免共享播放器生命周期回归。
   await p.evaluate(()=>{dietTab='recipe';go('diet')});await p.locator('#diet-body .acc-h').first().click();assert.equal(await p.locator('#diet-body iframe').count(),1);
   await p.evaluate(()=>go('move'));assert.equal(await p.locator('#diet-body iframe').count(),0);
  }
  report.errors=errors;assert.deepEqual(errors,[]);fs.writeFileSync(live?'qa/fit-live-results.json':'qa/fit-results.json',JSON.stringify(report,null,2));
  await p.evaluate(()=>stopCookingVideos());await p.goto('about:blank');await p.close();console.log(JSON.stringify(report));
 }finally{await b.close()}
})().catch(e=>{console.error(e);process.exit(1)});
