/* 冒烟检查：页面无报错、菜品可点开、视频按钮有效、菜谱分类正常 */
const path = require('path');
const { chromium } = require('playwright');

(async () => {
  const root = path.join(__dirname, '..', '..');
  const browser = await chromium.launch({ executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe', headless: true });
  const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
  const errors = [];
  page.on('pageerror', e => errors.push('JS: ' + e.message));
  page.on('console', m => { if (m.type() === 'error') errors.push('CONSOLE: ' + m.text()); });
  await page.goto('file:///' + path.resolve(root, 'index.html').replace(/\\/g, '/'));
  await page.waitForTimeout(400);

  /* 进入饮食 → 今日三餐 */
  await page.locator('.tab[data-view="diet"]').click();
  await page.waitForTimeout(200);
  const meals = await page.locator('#diet-body .meal').count();
  const dishRows = await page.locator('#diet-body .dish-h').count();
  console.log('餐次卡片:', meals, '可点菜品行:', dishRows);

  /* 展开前 4 个菜 */
  const sample = [];
  for (let i = 0; i < Math.min(4, dishRows); i++) {
    const btn = page.locator('#diet-body .dish-h').nth(i);
    await btn.click();
    await page.waitForTimeout(80);
    const info = await page.locator('#diet-body .dish-b').nth(i).evaluate(el => ({
      hidden: el.hidden,
      name: (el.closest('.dish').querySelector('.dn') || {}).textContent,
      steps: el.querySelectorAll('.dp > p').length,
      hasVideoBtn: !!el.querySelector('[data-act="loadcooking"]'),
      player: (el.querySelector('.video-stage') || {}).dataset ? el.querySelector('.video-stage').dataset.playerSrc.slice(0, 70) : null,
      emptyNote: (el.querySelector('.video-ready') || {}).textContent || ''
    }));
    sample.push({ i, ...info });
    await btn.click();
  }
  console.log('展开样例:', JSON.stringify(sample, null, 1));

  /* 家常菜谱：分类 */
  for (const cat of ['全部', '菜肴', '中式面点', '西式面点']) {
    await page.locator('#diet-body .seg [data-t="recipe"]').click().catch(() => {});
    await page.locator('#diet-body .seg [data-t="recipe"]').click();
    await page.locator('#diet-body .chips [data-act="rcat"][data-t="' + cat + '"]').click();
    await page.waitForTimeout(150);
    const n = await page.locator('#diet-body .acc').count();
    console.log('分类', cat, '=>', n, '条');
  }
  await page.locator('#diet-body .chips [data-act="rcat"][data-t="中式面点"]').click();
  await page.locator('#diet-body .acc-h').first().click();
  await page.waitForTimeout(150);
  const capText = await page.locator('#diet-body .acc-b').first().evaluate(el => el.innerText.slice(-120));
  console.log('面点详情尾部:', capText.replace(/\n/g, ' / '));

  /* 明日三餐也应有菜品做法 */
  await page.locator('#diet-body .seg [data-t="tmrw"]').click();
  await page.waitForTimeout(200);
  console.log('明日页可点菜品行:', await page.locator('#diet-body .dish-h').count());

  console.log(errors.length ? '【错误】\n' + errors.join('\n') : '无 JS 报错');
  await browser.close();
})();
