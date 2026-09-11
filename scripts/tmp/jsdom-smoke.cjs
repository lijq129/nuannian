/* 离线运行验证：用 jsdom 注入真实脚本（runScripts:'dangerously'），
   使各脚本顶层 const/let 成为全局词法绑定，确认合并页渲染与联动逻辑无异常 */
const fs = require('fs');
const path = require('path');
const ROOT = path.resolve(__dirname, '..', '..');
const jsdomPath = 'C:/Users/毛豆/.workbuddy/binaries/node/workspace/node_modules/jsdom';
const { JSDOM, VirtualConsole } = require(jsdomPath);

const html = fs.readFileSync(path.join(ROOT, 'index.html'), 'utf8');
const errors = [];
const vc = new VirtualConsole();
vc.on('jsdomError', e => errors.push('JSDOM:' + (e && (e.detail && e.detail.message || e.message || e))));
vc.on('error', (...a) => errors.push('CONSOLE.error:' + a.join(' ')));

const dom = new JSDOM(html, {
  runScripts: 'dangerously',
  pretendToBeVisual: true,
  url: 'http://localhost/',
  virtualConsole: vc
});
const { window } = dom;

// 补齐 jsdom 未实现的 API，避免脚本在加载时抛错
window.scrollTo = () => {};
window.speechSynthesis = undefined;
window.matchMedia = window.matchMedia || (() => ({ matches: false, addListener(){}, removeListener(){}, addEventListener(){}, removeEventListener(){} }));
window.confirm = () => true;

// 依次注入 index.html 中引用的脚本（与页面顺序一致）。
// 用 <script> 元素注入（而非 window.eval），让顶层 const/let 成为全局词法绑定，
// 后续脚本与 window.eval 断言都能访问 EX/CARE/DIET 等。
const scripts = ['js/data-exercise.js','js/data-care.js','js/data-core.js','js/data-diet.js','js/data-recipes-extra.js','js/data-dish.js','js/data-video.js','js/data-fit-video.js','js/recipe-bv.js','js/app.js'];
for (const s of scripts) {
  const code = fs.readFileSync(path.join(ROOT, s), 'utf8');
  try {
    const sc = window.document.createElement('script');
    sc.textContent = code;
    window.document.body.appendChild(sc);
  } catch (e) {
    errors.push('INJECT ' + s + ': ' + (e && e.message));
  }
}

const out = [];
const log = (k, v) => out.push(`${v === true ? 'PASS' : 'FAIL'}  ${k}` + (v === true ? '' : ` -> ${JSON.stringify(v)}`));

function txt(sel){ const el = window.document.querySelector(sel); return el ? el.textContent : ''; }
function body(sel){ const el = window.document.querySelector(sel); return el ? el.innerHTML : ''; }
const ev = code => window.eval(code);

// 1) 全局就绪
const g = ev('({EX:typeof EX,CARE:typeof CARE,DIET:typeof DIET,resolveDish:typeof resolveDish,videoInfo:typeof videoInfo,recipeCount:DIET.recipes.length,pastry:DIET.recipes.filter(r=>r.cat==="中式面点"||r.cat==="西式面点").length})');
log('数据/函数就绪', g.EX==='object' && g.CARE==='object' && g.DIET==='object' && g.resolveDish==='function' && g.videoInfo==='function' && g.recipeCount>50 && g.pastry>15 ? true : g);

// 1b) 动作指导优先使用真人示范图
const actImgTag = ev('actImg("shoulderSqueeze")');
log('动作指导优先使用真人图片', typeof actImgTag==='string' && actImgTag.includes('<img') && actImgTag.includes('assets/img/ex/shoulderSqueeze.png'));

// 1c) 家常菜谱扩充至 200 道，含中式菜与面点（按界面实际归类 recipeCatOf 统计）
const recStat = ev('(function(){const R=DIET.recipes;const c=k=>R.filter(r=>recipeCatOf(r)===k).length;return {total:R.length, dish:c("菜肴"), cz:c("中式面点"), xz:c("西式面点"), withSteps:R.filter(r=>Array.isArray(r.steps)&&r.steps.length>=2).length};})()');
log('菜谱总量达 200 道', recStat.total >= 200);
log('含中式菜(菜肴>=100)', recStat.dish >= 100);
log('含中式面点(>=40)', recStat.cz >= 40);
log('含西式面点(>=35)', recStat.xz >= 35);
log('每条菜谱带做法步骤', recStat.withSteps === recStat.total);

// 2) 首页宫格目标（合并后为 move；今日子页已去除，宫格统一指向课程）
const feat = ev('[...document.querySelectorAll("#home-body .feat")].map(f=>f.dataset.view+"|"+f.dataset.tab)');
log('宫格温和活动/日常养护→move|course', feat.filter(x => x === 'move|course').length >= 2);
log('宫格不再指向 move|today', !feat.includes('move|today'));

// 3) 首页保留三项运动打卡（活动养护页的「今日」子页已去除）
ev('go("home")');
const ht = txt('#home-body');
log('首页含「肩背放松」', ht.includes('肩背放松'));
log('首页含「腿部活动」', ht.includes('腿部活动'));
log('首页含「短时走动」', ht.includes('短时走动'));

// 3b) 合并页子页结构：已去除 今日 / 部位养护 / 四季；课程已扩充；含跟练视频
ev('moveTab="course"; go("move");');
const chips = ev('[...document.querySelectorAll("#move-body .chips.mtab .chip")].map(c=>c.textContent)');
log('合并页子页含 课程/视频/作息/安全须知', ['课程','视频','作息','安全须知'].every(t=>chips.includes(t)));
log('已去除「今日」子页', !chips.includes('今日'));
log('已去除「部位养护」', !chips.includes('部位养护'));
log('已去除「四季」', !chips.includes('四季'));
const courseCount = ev('EX.courses.length');
log('养护课程已扩充(>=12)', courseCount >= 12);
ev('moveTab="course"; go("move");');
const hasVideoBtn = ev('!!document.querySelector("#move-body .course-card [data-act=\\"coursevideo\\"]")');
log('课程含跟练视频按钮', hasVideoBtn);
const vidBv = ev('(function(){const b=document.querySelector("#move-body .course-card [data-act=\\"coursevideo\\"]");return b?EX.courses.find(c=>c.id===b.dataset.id).video.bv:null;})()');
log('跟练视频含 BV 号', typeof vidBv==='string' && vidBv.indexOf('BV')===0);

// 3c) 点击「开始练习」直接进入播放器，不再阻塞确认框
ev('moveTab="course"; go("move");');
const playerOpened = ev('(function(){const b=document.querySelector("#move-body .course-card [data-act=\\"start\\"]");if(!b)return "no-start-btn";b.click();const p=document.querySelector("#player");return p&&!p.classList.contains("hidden");})()');
log('点击练习直接进入播放器(无确认框)', playerOpened === true);
ev('document.querySelector("#p-close") && document.querySelector("#p-close").click();');

// 4) 联动：首页运动打卡 → 进度环变化并回显已完成
ev('go("home")');
const beforeRing = txt('.ringnum b');
ev('(function(){const b=[...document.querySelectorAll("#home-body .actrow button")].find(b=>b.dataset.id==="neck"&&b.dataset.act==="chk"); if(b)b.click();})()');
const afterRing = txt('.ringnum b');
const neckDone = ev('!!todayChecks().neck');
log('首页打卡使进度环变化', beforeRing !== afterRing);
log('写入 neck 打卡', neckDone === true);
const rowTxt = ev('(function(){const r=[...document.querySelectorAll("#home-body .actrow")].find(r=>r.textContent.includes("肩背放松"));return r?r.textContent:"";})()');
log('首页活动同步显示已完成', rowTxt.includes('已完成'));

// 5) 饮食页菜品展开含文字做法 + 视频/处理说明
ev('go("diet")');
const hasDish = ev('!!document.querySelector(".dish-h")');
log('三餐存在可点击菜品', hasDish);
ev('document.querySelector(".dish-h").click()');
const dishHTML = ev('(function(){const b=document.querySelector(".dish-b:not([hidden])");return b?b.innerHTML:"";})()');
log('菜品展开文字做法', dishHTML.includes('mm-steps'));
log('菜品含视频/处理说明', dishHTML.includes('cooking-video') || dishHTML.includes('video-ready'));

// 5b) 明日推荐：只展示采购清单 + 可做的菜式，不含做法；可跳菜谱看做法
ev('dietTab="tmrw"; go("diet");');
const tmrwTab = ev('(function(){const b=[...document.querySelectorAll("#diet-body .seg button")].find(b=>b.dataset.t==="tmrw");return b?b.textContent:"";})()');
const tmrwTxt = txt('#diet-body');
log('明日标签改为「明日推荐」', tmrwTab === '明日推荐');
log('明日推荐含采购清单', tmrwTxt.includes('明日采购清单'));
log('明日推荐含可做的菜式', tmrwTxt.includes('明日可做的菜式'));
log('明日推荐不再展示做法', !ev('!!document.querySelector("#diet-body .dish-h")') && !ev('!!document.querySelector("#diet-body .mm-steps")') && !tmrwTxt.includes('明日做法推荐'));
const pickCount = ev('document.querySelectorAll("#diet-body .pickitem").length');
const tappable = ev('document.querySelectorAll("#diet-body .pickitem[data-act=\\"openrecipe\\"], #diet-body .pickitem[data-act=\\"dishfind\\"]").length');
log('可做的菜式已列出菜名(>=10)', pickCount >= 10);
log('每道菜式都可跳菜谱', pickCount > 0 && tappable === pickCount);
const jumped = ev('(function(){const b=document.querySelector("#diet-body .pickitem");if(!b)return "none";b.click();return dietTab;})()');
log('点菜式跳转「家常菜谱」', jumped === 'recipe');
ev('dietTab="tmrw"; renderDiet();');
const bottomJump = ev('(function(){const b=[...document.querySelectorAll("#diet-body button")].find(b=>b.dataset.act==="dtab"&&b.dataset.t==="recipe");if(!b)return "none";b.click();return dietTab;})()');
log('底部「去家常菜谱」按钮跳转', bottomJump === 'recipe');
log('菜名可对应到菜谱(番茄炒蛋)', ev('(function(){const r=dishRecipeOf("番茄炒蛋");return !!(r&&r.name==="番茄炒蛋");})()'));

// 5c) 视频页：抖音跟练合集（按博主）
ev('moveTab="video"; go("move");');
const vt = txt('#move-body');
log('视频页含博主「周六野」', vt.includes('周六野'));
log('视频页含博主「欧阳春晓」', vt.includes('欧阳春晓'));
log('视频页含低冲击合集', vt.includes('低冲击'));
const colCount = ev('document.querySelectorAll("#move-body .fitcol").length');
log('视频合集数量>=3', colCount >= 3);
const rowCount = ev('document.querySelectorAll("#move-body .fitrow").length');
log('视频条目>=10', rowCount >= 10);
const playable = ev('document.querySelectorAll("#move-body .fitrow [data-act=\\"fitvideo\\"], #move-body .fitrow [data-act=\\"dyfind\\"]").length');
log('每条视频都有播放/跳转入口', rowCount > 0 && playable === rowCount);
// 抖音官方播放器（站内嵌入）URL 正确
const dySrc = ev('(function(){openDyVideo("7123456789012345678","测试");const f=document.querySelector("#vm-frame iframe");return f?f.getAttribute("src"):"";})()');
log('抖音官方播放器地址正确', typeof dySrc === 'string' && dySrc.indexOf('open.douyin.com/player/video?vid=7123456789012345678') >= 0);
const modalOpen = ev('!document.querySelector("#vmodal").classList.contains("hidden")');
log('嵌入后弹窗打开', modalOpen === true);
ev('closeVideo();');
// 未配置视频ID时不挂播放器（退化为跳转）
const noSrc = ev('(function(){openDyVideo("","x");const f=document.querySelector("#vm-frame iframe");return f?"has-iframe":"";})()');
log('未配置ID时不挂播放器', noSrc === '');
ev('closeVideo();');

// 6) 菜谱中西面点分类
const cats = ev('(function(){document.querySelector("[data-act=\\"dtab\\"][data-t=\\"recipe\\"]").click();return [...document.querySelectorAll("[data-act=\\"rcat\\"]")].map(c=>c.dataset.t);})()');
log('菜谱含中西面点分类', cats.includes('中式面点') && cats.includes('西式面点'));

// 7) 进度环分母 = 全部今日可打卡项（含活动），不再只是首页网格
const allLen = ev('allChecks().length');
const ringDen = ev('(function(){const m=document.querySelector(".ringnum b i");return m?+m.textContent.replace("/","")||+m.textContent:null;})()');
const chkLen = ev('CHK().length');
const ringData = ev('(function(){const b=document.querySelector(".ringnum b");return b?b.textContent:null;})()');
log('进度环分母=allChecks (allLen='+allLen+', chkLen='+chkLen+', ringDen='+ringDen+', ring='+ringData+')', allLen === ringDen);

console.log(out.join('\n'));
console.log('\nERRORS:', errors.length ? '\n'+errors.join('\n') : '无');
process.exit(errors.length || out.some(l => l.startsWith('FAIL')) ? 2 : 0);
