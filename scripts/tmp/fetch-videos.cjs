/*
 * 批量获取「真人做法」视频：
 * 1. 校验已有 BV 是否仍有效
 * 2. 为尚未配有视频的菜品/菜谱搜索并挑选合适的演示视频
 * 结果写入 scripts/tmp/videos.json
 */
const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');
const ROOT = path.join(__dirname, '..', '..');
const OUT = path.join(__dirname, 'videos.json');
const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36';

const JAR = path.join(__dirname, 'cookie.txt');
let reqCount = 0;

const sleep = ms => new Promise(r => setTimeout(r, ms));

async function boot() {
  try {
    execFileSync('curl', ['-s', '-m', '20', '-c', JAR, '-b', JAR, '-o', path.join(__dirname, 'warm.html'),
      '-A', UA, 'https://www.bilibili.com'], { stdio: 'ignore' });
    execFileSync('curl', ['-s', '-m', '20', '-c', JAR, '-b', JAR, '-o', path.join(__dirname, 'warm.html'),
      '-A', UA, 'https://api.bilibili.com/x/frontend/finger/spi'], { stdio: 'ignore' });
  } catch (e) { /* 忽略 */ }
}

/* 用 curl + Cookie 罐请求，绕开 Node 端的风控 */
function curl(url, referer) {
  const args = ['-s', '-m', '25', '-b', JAR, '-c', JAR, '-A', UA,
    '-H', 'Referer: ' + referer, '-H', 'Accept: application/json, text/plain, */*',
    '-H', 'Accept-Language: zh-CN,zh;q=0.9', '--compressed', url];
  return execFileSync('curl', args, { encoding: 'buffer', maxBuffer: 40 * 1024 * 1024 }).toString('utf8');
}

/* 返回 {state:'ok',data} | {state:'limit'} | {state:'gone'} | {state:'retry'} */
async function api(url, tries = 5) {
  const referer = /search/.test(url) ? 'https://search.bilibili.com/' : 'https://www.bilibili.com/';
  for (let i = 0; i < tries; i++) {
    reqCount++;
    if (reqCount % 20 === 0) await sleep(10000);
    try {
      const raw = curl(url, referer);
      let j = null;
      try { j = JSON.parse(raw); } catch (e) { j = null; }
      if (!j) { await boot(); await sleep(4000 * (i + 1)); continue; }
      if (j.code === 0) return { state: 'ok', data: j.data };
      if (j.code === -404 || j.code === -403 || j.code === 62002) return { state: 'gone' };
      await sleep([3000, 8000, 15000, 25000, 35000][Math.min(i, 4)]); continue;
    } catch (e) {
      try { fs.appendFileSync(path.join(__dirname, 'trace.log'), '  throw: ' + String(e && e.message || e).slice(0, 200) + '\n', 'utf8'); } catch (x) { }
      await sleep(5000 * (i + 1));
    }
  }
  return { state: 'retry' };
}

async function viewInfo(bvid) {
  const r = await api('https://api.bilibili.com/x/web-interface/view?bvid=' + bvid);
  if (r.state !== 'ok') return { state: r.state };
  const d = r.data;
  const total = d.duration || 0;
  const dur = Math.floor(total / 60) + ':' + String(total % 60).padStart(2, '0');
  return { state: 'ok', info: { bv: bvid, title: d.title, up: d.owner && d.owner.name, dur: dur, play: d.stat && d.stat.view, pub: d.pubdate } };
}

function clean(html) { return String(html || '').replace(/<[^>]+>/g, '').replace(/&[a-z]+;/g, ' ').trim(); }
function parseDur(s) {
  const m = String(s || '').match(/(\d+):(\d+)/);
  if (!m) return null;
  return +m[1] * 60 + +m[2];
}
const BLOCK = ['搞笑', '沙雕', '挑战', '吃播', 'vlog', 'VLOG', '短剧', '抽', '锦鲤', '带货', '直播回放', '猫', '狗', '哈士奇', '恶搞', '鬼畜', '解说', 'reaction', ' Reaction',
  '升糖', '血糖', '测评', '开箱', '探店', '二次元', '动漫', '史莱姆', '沉浸式', '吐槽', '盘点', '合集', '仿做'];

async function searchBest(kw) {
  const core = kw.replace(/\s*做法\s*$/, '').trim();
  const coreTokens = core.split(/[\s,，、]+/).filter(Boolean);
  const primary = coreTokens[0] || core;
  const url = 'https://api.bilibili.com/x/web-interface/search/type?search_type=video&keyword=' + encodeURIComponent(kw) + '&page=1';
  const r = await api(url);
  if (r.state !== 'ok') return { state: r.state };
  const list = r.data.result || [];
  let fallback = null;
  for (const item of list.slice(0, 25)) {
    const title = clean(item.title);
    if (!title) continue;
    if (BLOCK.some(b => title.includes(b))) continue;
    const dur = parseDur(item.duration) || 0;
    if (dur < 40 || dur > 1200) continue;
    const includesCore = coreTokens.some(t => t.length >= 2 && title.includes(t)) || title.includes(core);
    const includesPrimary = primary.length >= 2 && title.includes(primary);
    const looksRecipe = /做法|教程|家常|怎么做|步骤|方法|教学|配方|一学就会|详细/.test(title);
    if (!(includesCore || includesPrimary)) continue;
    const info = { bv: item.bvid, title: title, up: clean(item.author), dur: item.duration, durSec: dur, play: item.play, kw: kw, score: 0 };
    info.score = (includesCore ? 60 : 20)
      + (looksRecipe ? 25 : 0)
      + (title.indexOf(core) === 0 || title.indexOf(primary) === 0 ? 15 : 0)
      + (dur >= 60 && dur <= 600 ? 15 : 0)
      + (dur > 900 ? -20 : 0)
      + (title.includes('#') ? -25 : 0)
      + (title.length > 38 ? -10 : 0)
      + Math.min(20, Math.log10(Math.max(item.play || 0, 1)) * 4);
    if (!fallback || info.score > fallback.score) fallback = info;
  }
  if (!fallback) return { state: 'none' };
  return { state: 'ok', info: fallback };
}

async function main() {
  const TRACE = path.join(__dirname, 'trace.log');
  const log = m => { try { fs.appendFileSync(TRACE, m + '\n', 'utf8'); } catch (e) { } console.log(m); };
  log('--- start ---');
  await boot();
  log('boot done');
  const dishMod = path.join(__dirname, 'dishmod.cjs');
  fs.writeFileSync(dishMod, fs.readFileSync(path.join(ROOT, 'js/data-dish.js'), 'utf8') +
    '\nmodule.exports = { DISHES: DISHES, dishBody: dishBody, resolveDish: resolveDish };\n', 'utf8');
  const { DISHES, dishBody } = require(dishMod);
  const dietMod = path.join(__dirname, 'dietmod.cjs');
  fs.writeFileSync(dietMod, fs.readFileSync(path.join(ROOT, 'js/data-diet.js'), 'utf8')
    .replace(/^\/\*[\s\S]*?\*\//, '').replace(/const DIET =/, 'module.exports ='), 'utf8');
  const DIET = require(dietMod);
  const oldBv = require(path.join(__dirname, 'oldbv.cjs'));

  /* 需要视频的关键词清单 */
  const jobs = [];
  const seen = new Set();
  Object.keys(DISHES).forEach(k => {
    const b = dishBody(k);
    if (b && b.kw && !seen.has(b.kw)) { seen.add(b.kw); jobs.push({ kind: 'dish', name: k, kw: b.kw }); }
  });
  DIET.recipes.forEach(r => {
    if (!r.kw || seen.has(r.kw)) return;
    seen.add(r.kw);
    jobs.push({ kind: 'recipe', name: r.name, kw: r.kw, old: oldBv[r.name] || null });
  });

  let out = (fs.existsSync(OUT) && Object.keys(JSON.parse(fs.readFileSync(OUT, 'utf8'))).length)
    ? JSON.parse(fs.readFileSync(OUT, 'utf8')) : {};
  out._failed = out._failed || [];
  console.log('待处理关键词：' + jobs.length + '，已完成：' + Object.keys(out).length);

  const LIMIT = +(process.env.LIMIT || 0);
  let acted = 0;

  /* 1. 已有 BV 直接沿用（详情接口限流时不额外校验，播放器端仍可打开） */
  for (const j of jobs) {
    if (out[j.kw] !== undefined || !j.old) continue;
    out[j.kw] = { bv: j.old, source: 'old' };
  }
  fs.writeFileSync(OUT, JSON.stringify(out, null, 2), 'utf8');
  log('沿用旧链接：' + jobs.filter(j => j.old).length + ' 条');

  /* 2. 搜索缺失项 */
  for (const j of jobs) {
    if (LIMIT && acted >= LIMIT) break;
    if (out[j.kw] !== undefined) continue;
    acted++;
    const r = await searchBest(j.kw);
    if (r.state === 'ok') out[j.kw] = r.info;
    else if (r.state === 'none') out[j.kw] = null;
    else { out._failed.push(j.kw); }
    fs.writeFileSync(OUT, JSON.stringify(out, null, 2), 'utf8');
    console.log((r.state === 'ok' ? '[OK] ' : r.state === 'none' ? '[--] ' : '[后补] ') + j.kw +
      (r.state === 'ok' ? ' -> ' + r.info.title + ' @' + r.info.up + ' ' + r.info.dur : ''));
    await sleep(1100);
  }
  const done = Object.keys(out).filter(k => k[0] !== '_');
  console.log('完成：' + done.filter(k => out[k]).length + '/' + done.length + ' 有视频；待补：' + out._failed.length);
}

main().catch(e => { console.error(e); process.exit(1); });
