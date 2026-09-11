const { chromium, devices } = require('playwright');
const assert = require('node:assert/strict');
const fs = require('node:fs');

(async () => {
  const baseUrl = process.env.TEST_URL || 'http://127.0.0.1:4173/';
  const browser = await chromium.launch({ executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe', headless:true });
  try {
    const context = await browser.newContext({ ...devices['iPhone 13'], deviceScaleFactor:1, serviceWorkers:'allow' });
    const page = await context.newPage();
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    await page.goto(baseUrl, { waitUntil:'networkidle' });
    await page.evaluate(() => navigator.serviceWorker.ready);
    await page.reload({ waitUntil:'networkidle' });

    assert.equal(await page.evaluate(() => !!navigator.serviceWorker.controller), true);
    assert.equal(await page.evaluate(() => getComputedStyle(document.querySelector('#q')).fontSize), '16px');
    assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true);
    assert.equal(await page.evaluate(() => [...document.querySelectorAll('.tab')].every(x => x.getBoundingClientRect().height >= 44)), true);
    await page.locator('#q').fill('番茄');
    await page.evaluate(() => { S.settings.voice = false; save(); });
    await page.reload({ waitUntil:'networkidle' });
    assert.equal(await page.evaluate(() => typeof localStorage.getItem(KEY) === 'string'), true);

    await page.locator('.tab[data-view="move"]').click();
    await page.locator('#move-body [data-act="healthclear"]').click();
    await page.locator('.course-card [data-act="start"]').first().click();
    assert.equal(await page.locator('#player').isVisible(), true);
    assert.equal(await page.evaluate(() => document.querySelector('#player').scrollWidth <= innerWidth), true);
    assert.ok((await page.locator('#p-svg img').getAttribute('src')).endsWith('.webp'));
    await page.locator('#p-close').click();

    await page.screenshot({ path:'qa/mobile-iphone13.png' });
    await page.setViewportSize({ width:844, height:390 });
    assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true);
    await page.screenshot({ path:'qa/mobile-landscape.png' });

    await context.setOffline(true);
    await page.reload({ waitUntil:'domcontentloaded' });
    assert.equal(await page.locator('#app').isVisible(), true);
    assert.equal(await page.locator('.tab').count(), 4);
    await context.setOffline(false);

    assert.deepEqual(errors, []);
    const original = fs.readdirSync('assets/img/ex').filter(x => x.endsWith('.png'));
    const mobile = fs.readdirSync('assets/img/ex').filter(x => x.endsWith('.webp'));
    const report = { serviceWorker:true, offlineShell:true, inputFontPx:16, touchTargets:true, portrait:true, landscape:true, originalImagesPreserved:original.length, optimizedImages:mobile.length, errors };
    fs.writeFileSync('qa/mobile-results.json', JSON.stringify(report, null, 2));
    console.log(JSON.stringify(report));
  } finally { await browser.close(); }
})().catch(error => { console.error(error); process.exit(1); });
