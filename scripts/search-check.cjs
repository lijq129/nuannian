const {chromium}=require('playwright');
const assert=require('node:assert/strict');
const path=require('node:path');
(async()=>{
 const browser=await chromium.launch({executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',headless:true});
 const page=await browser.newPage({viewport:{width:390,height:844}});
 const errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto('file:///'+path.resolve('index.html').replace(/\\/g,'/'));
 const cdp=await page.context().newCDPSession(page);
 for(const selector of ['#q','#recipe-q']){
  if(selector==='#recipe-q')await page.evaluate(()=>{go('diet');dietTab='recipe';renderDiet();});
  await page.locator(selector).focus();
  await page.evaluate(s=>window.__imeInput=document.querySelector(s),selector);
  for(const text of ['f','fan','番茄']){
   await cdp.send('Input.imeSetComposition',{text,selectionStart:text.length,selectionEnd:text.length});
   assert.equal(await page.evaluate(s=>window.__imeInput===document.querySelector(s),selector),true,'IME must retain original input node');
   assert.equal(await page.locator(selector).inputValue(),text);
  }
  await cdp.send('Input.insertText',{text:'番茄'});
  assert.equal(await page.locator(selector).inputValue(),'番茄');
  assert.equal(await page.locator(selector).evaluate(e=>document.activeElement===e),true);
  assert.ok((await page.locator('.view:not(.hidden)').innerText()).includes('番茄炒蛋'));
  await page.locator(selector).evaluate(e=>e.setSelectionRange(1,1));
  await cdp.send('Input.imeSetComposition',{text:'汤',selectionStart:1,selectionEnd:1});
  await cdp.send('Input.insertText',{text:'汤'});
  assert.equal(await page.locator(selector).inputValue(),'番汤茄');
  assert.equal(await page.locator(selector).evaluate(e=>e.selectionStart),2);
  await page.keyboard.press('Backspace');
  assert.equal(await page.locator(selector).inputValue(),'番茄');
  await page.locator(selector).fill('');await cdp.send('Input.insertText',{text:'鸡蛋'});
  assert.equal(await page.locator(selector).inputValue(),'鸡蛋');
  await page.locator(selector).fill('"<番茄>&');assert.equal(await page.locator(selector).inputValue(),'"<番茄>&');
  await page.locator(selector).fill('番茄 ');assert.equal(await page.locator(selector).inputValue(),'番茄 ');
  await page.locator(selector).fill('');
  console.log(selector+': Chinese IME composition, commit, caret, deletion, paste and special characters passed');
 }
 assert.deepEqual(errors,[]);await browser.close();
})().catch(e=>{console.error(e);process.exit(1);});
