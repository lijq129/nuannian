// Local visual QA. Uses an isolated browser context and never changes user browser data.
const {chromium}=require('playwright');
const fs=require('fs');
const path=require('path');
const sharp=require('sharp');
(async()=>{
  const out=path.resolve('qa');fs.mkdirSync(out,{recursive:true});
  const browser=await chromium.launch({executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',headless:true});
  const context=await browser.newContext({viewport:{width:390,height:844},deviceScaleFactor:1});
  const page=await context.newPage();const errors=[];const results=[];
  page.on('pageerror',e=>errors.push(e.message));
  page.on('response',r=>{if(r.status()>=400)errors.push(r.status()+' '+r.url());});
  await page.goto('file:///'+path.resolve('index.html').replace(/\\/g,'/'));await page.waitForTimeout(200);
  async function shot(name){
    await page.evaluate(()=>document.fonts.ready);await page.waitForTimeout(180);
    await page.screenshot({path:path.join(out,name+'.png'),fullPage:true});
    results.push({name,...await page.evaluate(()=>({
      width:innerWidth,scrollWidth:document.documentElement.scrollWidth,
      overflow:[...document.querySelectorAll('.view:not(.hidden) *')].filter(e=>{const r=e.getBoundingClientRect();return r.width>0&&(r.right>innerWidth+1||r.left< -1)&&!e.closest('.chips,.seg');}).map(e=>e.className).slice(0,12),
      brokenImages:[...document.images].filter(e=>e.offsetWidth&&(!e.complete||!e.naturalWidth)).map(e=>e.src),
      emoji:/\p{Extended_Pictographic}/u.test(document.querySelector('.view:not(.hidden)').innerText)
    }))});
  }
  await shot('01-home');
  for(const [view,tabs] of [['diet',['menu','tmrw','recipe']],['exercise',['course','safe']],['care',['part','routine','season']],['me',['plan','fav','record','legal']]]){
    await page.locator('.tab[data-view="'+view+'"]').click();
    for(const tab of tabs){
      await page.locator('.view:not(.hidden) .seg [data-t="'+tab+'"]').click();
      await shot(view+'-'+tab);
      if(view==='exercise'&&tab==='course'){await page.locator('.safety-intro summary').click();await shot('exercise-preflight');await page.locator('.safety-intro summary').click();}
      if(['recipe','part','legal'].includes(tab)){
        await page.locator('.view:not(.hidden) .acc-h').first().click();await shot(view+'-'+tab+'-expanded');
      }
    }
  }
  // Large font and narrow-screen layout are high-risk points for this user.
  for(const width of [320,390,768,1280]){
    await page.setViewportSize({width,height:900});
    await page.evaluate(()=>{S.settings.font=2;applyFont();go('home');});
    await shot('large-'+width+'-home');
    await page.evaluate(()=>{meTab='plan';go('me');});await shot('large-'+width+'-me');
    if(width===320){
      for(const view of ['diet','exercise','care']){await page.evaluate(v=>go(v),view);await shot('large-320-'+view);}
    }
  }
  // Preview player paused; no completed exercise or medication log is written.
  await page.setViewportSize({width:390,height:844});
  await page.evaluate(()=>{S.settings.font=1;S.settings.voice=false;applyFont();startSession(EX.courses[0],'neck');pause();});
  await page.screenshot({path:path.join(out,'player.png'),fullPage:true});
  await page.evaluate(()=>{document.querySelector('#p-close').click();go('me');meTab='plan';editingProfile=true;renderMe();});
  await shot('me-edit');
  await page.evaluate(()=>{editingProfile=false;S.settings.font=1;applyFont();go('home');});
  await page.setViewportSize({width:1280,height:1000});await shot('desktop');
  await page.evaluate(()=>{moveTab='course';go('move');});await shot('desktop-exercise');
  console.log('Design diagnostics',await page.evaluate(()=>({font:getComputedStyle(document.body).fontFamily,nav:[...document.querySelectorAll('.tab')].map(e=>({height:e.offsetHeight,flex:getComputedStyle(e).flex})),navGap:getComputedStyle(document.querySelector('.tabbar')).gap})));
  const thumbs=[];
  for(const name of ['01-home','diet-menu','diet-recipe','exercise-course','care-part','me-plan']){
    const img=await sharp(path.join(out,name+'.png')).extract({left:0,top:0,width:390,height:844}).resize(312,675).toBuffer();
    thumbs.push({input:img,left:thumbs.length*328,top:0});
  }
  await sharp({create:{width:328*6-16,height:675,channels:3,background:'#EDEFE8'}}).composite(thumbs).png().toFile(path.join(out,'overview.png'));
  const secondary=[];
  for(const name of ['diet-tmrw','exercise-safe','care-routine','care-season','me-fav','me-record','me-legal','player']){
    const img=await sharp(path.join(out,name+'.png')).extract({left:0,top:0,width:390,height:844}).resize(273,591).toBuffer();
    secondary.push({input:img,left:(secondary.length%4)*289,top:Math.floor(secondary.length/4)*607});
  }
  await sharp({create:{width:1140,height:1198,channels:3,background:'#EDEFE8'}}).composite(secondary).png().toFile(path.join(out,'secondary.png'));
  fs.writeFileSync(path.join(out,'results.json'),JSON.stringify({errors,results},null,2));
  console.log(JSON.stringify({errors,results}));await browser.close();
})().catch(e=>{console.error(e);process.exit(1);});
