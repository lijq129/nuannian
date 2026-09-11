const { chromium } = require('playwright');
const assert = require('node:assert/strict');
const path = require('node:path');
const fs = require('node:fs');
(async () => {
  const browser = await chromium.launch({ executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe', headless:true });
  try {
    const page = await browser.newPage({ viewport:{ width:390, height:844 } });
    const errors = [], passed = [];
    page.on('pageerror', e => errors.push(e.message));
    await page.route('https://player.bilibili.com/**', r => r.fulfill({ contentType:'text/html', body:'Offline player test' }));
    const reset = async () => {
      await page.goto('file:///' + path.resolve('index.html').replace(/\\/g, '/'));
      await page.evaluate(() => { S.settings.voice = false; });
    };
    const state = () => page.evaluate(() => pageState());
    const back = () => page.locator('#page-back').click();
    await reset();
    assert.equal(await page.locator('#back-nav').isVisible(), false);
    await page.locator('.feat[data-tab="recipe"]').click();
    assert.equal((await state()).dietTab, 'recipe');
    await back(); assert.equal((await state()).currentView, 'home');
    assert.equal(await page.locator('#back-nav').isVisible(), false);
    passed.push('首页快捷入口原路返回，无来源时隐藏按钮');

    await page.locator('#q').fill('番茄');
    await page.locator('[data-act="openrecipe"]').first().click();
    await back();
    assert.equal(await page.locator('#q').inputValue(), '番茄');
    assert.ok(await page.locator('[data-act="openrecipe"]').count());
    await page.waitForTimeout(150); // 延迟定位不能在返回后把来源页再次滚走。
    assert.equal((await state()).currentView, 'home');
    passed.push('搜索结果返回保留中文关键词和结果');

    await reset();
    await page.locator('.tab[data-view="diet"]').click();
    await page.evaluate(() => {
      const plan = JSON.parse(JSON.stringify(tomorrowPlan()));
      plan.breakfast.foods = [[DIET.recipes[0].name, '一份'], ['测试无匹配菜式', '一份']];
      S.confirmed[nextDayKey()] = plan;
    });
    await page.locator('[data-act="dtab"][data-t="tmrw"]').click();
    const dish = page.locator('#diet-body [data-act="openrecipe"]').first();
    await dish.scrollIntoViewIfNeeded();
    const originY = await page.evaluate(() => scrollY);
    await dish.click(); await page.waitForTimeout(150);
    assert.equal((await state()).dietTab, 'recipe');
    await back();
    assert.equal((await state()).dietTab, 'tmrw');
    assert.ok(Math.abs(await page.evaluate(() => scrollY) - originY) < 5);
    await page.locator('#diet-body [data-act="dishfind"]').first().click();
    assert.equal((await state()).dietTab, 'recipe');
    await back(); assert.equal((await state()).dietTab, 'tmrw');
    assert.equal(await page.locator('#back-nav').isVisible(), false);
    passed.push('明日推荐到具体菜谱并恢复滚动位置；普通标签不堆积返回层级');

    await page.evaluate(() => { S.favs.recipe = [DIET.recipes[0].id]; save(); });
    await page.locator('.tab[data-view="me"]').click();
    await page.locator('[data-act="mtab"][data-t="fav"]').click();
    await page.locator('#me-body [data-act="openrecipe"]').click();
    await page.locator('#diet-body .acc.open [data-act="fav"]').click();
    await back();
    assert.equal((await state()).meTab, 'fav');
    assert.equal(await page.locator('#me-body [data-act="openrecipe"]').count(), 0);
    passed.push('收藏进入详情后返回收藏，新操作不被导航快照回滚');

    await reset();
    await page.locator('.feat[data-tab="recipe"]').click();
    await page.locator('[data-act="rcat"][data-t="菜肴"]').click();
    await page.locator('#recipe-q').fill('番茄');
    await page.locator('#diet-body .acc-h').first().click();
    const before = await state();
    await page.evaluate(() => go('move', { moveTab:'course' }));
    assert.equal(await page.locator('.video-stage iframe').count(), 0);
    await back();
    assert.deepEqual(await state(), before);
    assert.equal(await page.locator('#diet-body .acc.open').count(), 1);
    assert.equal(await page.locator('.video-stage iframe').count(), 0);
    passed.push('保留分类、筛选、搜索与展开状态，返回不自动载入视频');

    await page.locator('.tab[data-view="home"]').click();
    await page.locator('.feat[data-tab="course"]').first().click();
    await page.locator('[data-act="movetab"][data-t="video"]').click();
    await page.locator('.fit-video-card .acc-h').first().click();
    await page.locator('[data-act="movetab"][data-t="safe"]').click();
    await back();
    assert.equal((await state()).currentView, 'home');
    assert.equal(await page.locator('.video-stage iframe').count(), 0);
    assert.equal(await page.locator('[data-act="coursevideo"]').count(), 0);
    passed.push('活动养护内部标签不堆栈，仍可返回联动来源；课程与视频无无关联动');

    await page.locator('.feat[data-tab="course"]').first().click();
    await page.locator('#move-body [data-act="healthclear"]').click();
    const start = page.locator('.course-card [data-act="start"]').first();
    await start.scrollIntoViewIfNeeded();
    const courseY = await page.evaluate(() => scrollY);
    await start.click(); await page.locator('#p-close').click();
    assert.equal(await page.locator('#player').isVisible(), false);
    assert.equal(await page.evaluate(() => P.running), false);
    assert.ok(Math.abs(await page.evaluate(() => scrollY) - courseY) < 5);
    passed.push('图文跟练退出返回原课程位置并停止计时');

    for (const width of [320,390,768,1280]) {
      await page.setViewportSize({ width, height:900 });
      await page.evaluate(() => { S.settings.font = 2; applyFont(); });
      assert.equal(await page.evaluate(() => document.documentElement.scrollWidth), width);
      await page.screenshot({ path:`qa/navigation-${width}.png` });
    }
    assert.deepEqual(errors, []);
    const report = { passed, layouts:[320,390,768,1280], errors };
    fs.writeFileSync('qa/navigation-results.json', JSON.stringify(report, null, 2));
    console.log(JSON.stringify(report));
    await page.evaluate(() => stopCookingVideos());
    await page.goto('about:blank');
  } finally { await browser.close(); }
})().catch(e => { console.error(e); process.exit(1); });
