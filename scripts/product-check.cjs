const { chromium } = require('playwright');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

(async () => {
  const browser = await chromium.launch({ executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe', headless:true });
  try {
    const page = await browser.newPage({ viewport:{ width:390, height:844 } });
    const errors = [], passed = [];
    page.on('pageerror', e => errors.push(e.message));
    await page.route('https://player.bilibili.com/**', r => r.fulfill({ contentType:'text/html', body:'Offline player test' }));
    await page.goto('file:///' + path.resolve('index.html').replace(/\\/g, '/'));
    await page.evaluate(() => localStorage.removeItem(KEY));
    await page.reload({ waitUntil:'load' });

    // 旧数据打开后自动补齐新版档案字段，不丢失原称呼。
    await page.evaluate(() => localStorage.setItem(KEY, JSON.stringify({ profile:{ name:'旧档案', age:59 }, favs:{ recipe:['x'] } })));
    await page.reload({ waitUntil:'load' });
    assert.equal(await page.evaluate(() => P0().name), '旧档案');
    assert.equal(await page.evaluate(() => typeof P0().vertigoHistory), 'boolean');
    assert.equal(await page.evaluate(() => S.dataMeta.version), 3);
    passed.push('旧版数据迁移并补齐可编辑健康档案');

    // 忌口、素食和低碘必须真正参与推荐，不可静默退回完整餐库。
    const diet = await page.evaluate(() => {
      P0().avoids = ['lactose']; S.med.lowIodine = false;
      const lactose = ['breakfast','lunch','dinner','snack'].map(t => pickMeal(t, 400, 0));
      P0().avoids = ['vegetarian'];
      const vegetarian = ['breakfast','lunch','dinner','snack'].map(t => pickMeal(t, 400, 0));
      P0().avoids = []; S.med.lowIodine = true;
      const iodine = ['breakfast','lunch','dinner','snack'].map(t => pickMeal(t, 400, 0));
      const original = DIET.meals.breakfast.map(m => m.has); DIET.meals.breakfast.forEach(m => m.has = ['dairy']);
      P0().avoids = ['lactose']; const none = pickMeal('breakfast', 400, 0); DIET.meals.breakfast.forEach((m,i) => m.has = original[i]);
      return { lactose, vegetarian, iodine, none };
    });
    assert.ok(diet.lactose.every(m => !(m.has || []).includes('dairy')));
    assert.ok(diet.vegetarian.every(m => !(m.has || []).some(x => x === 'meat' || x === 'seafood')));
    assert.ok(diet.iodine.every(m => !/海带|紫菜|虾皮|海藻|昆布/.test(JSON.stringify(m.foods || []))));
    assert.equal(diet.none.unavailable, true);
    passed.push('乳糖、素食、低碘和无匹配兜底规则有效');

    const nextUsesToday = await page.evaluate(() => {
      S.med.lowIodine = false; P0().avoids = []; S.mealOverride = {}; S.mealOverride[today()] = { breakfast:DIET.recipes[0].id };
      return { today:todayPlan().breakfast.override, tomorrow:tomorrowPlan().breakfast.override };
    });
    assert.equal(nextUsesToday.today, true); assert.notEqual(nextUsesToday.tomorrow, true);
    passed.push('今日菜谱选择不会污染明日推荐');

    // 未确认状态时阻止课程；确认后低风险课程可用；高风险内容保留但需要专业确认。
    await page.evaluate(() => { S.healthChecks = {}; P0().exerciseApproved = false; moveTab='course'; selectPage('move'); });
    await page.locator('.course-card [data-act="start"]').first().click();
    assert.equal(await page.locator('#player').isVisible(), false);
    await page.locator('#move-body [data-act="healthclear"]').click();
    await page.locator('.course-card [data-act="start"]').first().click();
    assert.equal(await page.locator('#player').isVisible(), true); await page.locator('#p-close').click();
    const highCourse = page.locator('.course-card [data-needs-approval="true"]').first();
    await highCourse.click(); assert.equal(await page.locator('#player').isVisible(), false);
    await page.locator('[data-act="movetab"][data-t="video"]').click();
    const highVideo = page.locator('.video-stage[data-fit-risk="high"]').first();
    await highVideo.locator('xpath=ancestor::section[1]').locator('.acc-h').click();
    await highVideo.locator('[data-act="loadfit"]').click(); assert.equal(await highVideo.locator('iframe').count(), 0);
    await page.evaluate(() => { P0().exerciseApproved = true; save(); renderMove(); });
    const approved = page.locator('.video-stage[data-fit-risk="high"]').first();
    await approved.locator('xpath=ancestor::section[1]').locator('.acc-h').click();
    await approved.locator('[data-act="loadfit"]').click(); assert.equal(await approved.locator('iframe').count(), 1);
    passed.push('每日安全确认和高风险专业确认门槛有效');

    // 档案字段可编辑并保存。
    await page.evaluate(() => { stopCookingVideos(); meTab='plan'; selectPage('me'); });
    await page.locator('[data-act="editp"]').click();
    await page.locator('#e-name').fill('测试用户');
    await page.locator('#e-thyroid').selectOption({ label:'全切' });
    await page.locator('#e-limits').fill('避免快速转头；腿痛加重停止。');
    await page.locator('#e-clinician').fill('复查时携带最近状态记录。');
    await page.locator('[data-act="savep"]').click();
    assert.deepEqual(await page.evaluate(() => [P0().name,P0().thyroidSurgery,P0().movementLimits,P0().clinicianNote]), ['测试用户','全切','避免快速转头；腿痛加重停止。','复查时携带最近状态记录。']);
    passed.push('个人档案新增字段可编辑、保存和回显');

    // 导出文件可被应用重新导入；缺失的新字段会按当前数据版本补齐。
    const [download] = await Promise.all([page.waitForEvent('download'), page.locator('[data-act="exportdata"]').click()]);
    const exported = JSON.parse(fs.readFileSync(await download.path(), 'utf8'));
    assert.equal(exported.product, 'nuannian'); assert.equal(exported.schemaVersion, 3);
    const update = { product:'nuannian', schemaVersion:2, exportedAt:new Date().toISOString(), data:{ profile:{ name:'导入后的用户', age:60 }, favs:{ recipe:[],course:[],care:[] } } };
    page.once('dialog', d => d.accept());
    await page.locator('#data-import').setInputFiles({ name:'nuannian-update.json', mimeType:'application/json', buffer:Buffer.from(JSON.stringify(update)) });
    await page.waitForFunction(() => P0().name === '导入后的用户');
    assert.equal(await page.evaluate(() => S.dataMeta.version), 3);
    assert.equal(await page.evaluate(() => typeof P0().exerciseApproved), 'boolean');
    passed.push('JSON 数据导出、导入更新与版本迁移可用');
    await page.waitForFunction(() => !document.querySelector('#toast')?.classList.contains('show'), null, { timeout:5000 }).catch(() => {});

    for (const width of [320,390,768,1280]) {
      await page.setViewportSize({ width, height:900 });
      await page.evaluate(() => { S.settings.font=2; applyFont(); meTab='plan'; selectPage('me'); });
      assert.equal(await page.evaluate(() => document.documentElement.scrollWidth), width);
      await page.screenshot({ path:`qa/product-${width}.png`, fullPage:true });
    }
    assert.deepEqual(errors, []);
    const report = { passed, preserved:{ courses:await page.evaluate(() => EX.courses.length), fitnessVideos:await page.evaluate(() => FIT_COLLECTIONS.flatMap(c=>c.videos).length + FIT_VIDEOS.length), recipes:await page.evaluate(() => DIET.recipes.length) }, layouts:[320,390,768,1280], errors };
    fs.writeFileSync('qa/product-results.json', JSON.stringify(report, null, 2));
    console.log(JSON.stringify(report));
    await page.goto('about:blank');
  } finally { await browser.close(); }
})().catch(e => { console.error(e); process.exit(1); });
