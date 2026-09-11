/* 对第一轮没搜到的关键词换词重试，并把结果合并进 videos.json */
const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');
const ROOT = path.join(__dirname, '..', '..');
const OUT = path.join(__dirname, 'videos.json');
const JAR = path.join(__dirname, 'cookie.txt');
const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/126.0 Safari/537.36';
const sleep = ms => new Promise(r => setTimeout(r, ms));

const ALT = { '藜麦饭 做法': ['藜麦 煮饭 做法', '藜麦饭 电饭煲'] };

const BLOCK = ['搞笑', '沙雕', '挑战', '吃播', 'vlog', 'VLOG', '短剧', '锦鲤', '带货', '直播回放', '猫', '狗', '恶搞', '鬼畜', '解说',
  '升糖', '血糖', '测评', '开箱', '探店', '二次元', '动漫', '沉浸式', '吐槽', '盘点', '仿做'];
const clean = h => String(h || '').replace(/<[^>]+>/g, '').replace(/&[a-z]+;/g, ' ').trim();
const parseDur = s => { const m = String(s || '').match(/(\d+):(\d+)/); return m ? +m[1] * 60 + +m[2] : 0; };

function api(url) {
  const referer = /search/.test(url) ? 'https://search.bilibili.com/' : 'https://www.bilibili.com/';
  const args = ['-s', '-m', '25', '-b', JAR, '-c', JAR, '-A', UA, '-H', 'Referer: ' + referer, '--compressed', url];
  const raw = execFileSync('curl', args, { encoding: 'buffer', maxBuffer: 4e7 }).toString('utf8');
  try { return JSON.parse(raw); } catch (e) { return null; }
}

function pick(kw, list) {
  const core = kw.replace(/\s*做法\s*$/, '').trim();
  const toks = core.split(/[\s,，、]+/).filter(Boolean);
  let best = null;
  (list || []).slice(0, 25).forEach(item => {
    const title = clean(item.title);
    if (!title) return;
    if (BLOCK.some(b => title.includes(b))) return;
    const dur = parseDur(item.duration);
    if (dur < 40 || dur > 1200) return;
    const hit = toks.some(t => t.length >= 2 && title.includes(t)) || title.includes(core);
    if (!hit) return;
    const score = (hit ? 60 : 0)
      + (/做法|教程|家常|怎么做|步骤|方法|教学|配方/.test(title) ? 25 : 0)
      + (title.startsWith(core) ? 15 : 0)
      + (dur >= 60 && dur <= 600 ? 15 : 0)
      + Math.min(20, Math.log10(Math.max(item.play || 0, 1)) * 4);
    if (!best || score > best.score) best = { bv: item.bvid, title, up: clean(item.author), dur: item.duration, score, kw };
  });
  return best;
}

(async () => {
  const out = JSON.parse(fs.readFileSync(OUT, 'utf8'));
  let fixed = 0;
  for (const [key, alts] of Object.entries(ALT)) {
    /* 强制重抓 */
    for (const kw of alts) {
      const j = api('https://api.bilibili.com/x/web-interface/search/type?search_type=video&keyword=' + encodeURIComponent(kw) + '&page=1');
      await sleep(1400);
      if (!j || j.code !== 0) continue;
      const best = pick(kw, j.data && j.data.result);
      if (best) {
        out[key] = { bv: best.bv, title: best.title, up: best.up, dur: best.dur, via: kw };
        fixed++;
        console.log('[补] ' + key + ' -> ' + best.title + ' @' + best.up);
        break;
      }
    }
    fs.writeFileSync(OUT, JSON.stringify(out, null, 2), 'utf8');
  }
  const ks = Object.keys(out).filter(k => k[0] !== '_');
  console.log('补回 ' + fixed + ' 条；目前有视频 ' + ks.filter(k => out[k]).length + '/' + ks.length);
  console.log('仍缺失：' + ks.filter(k => !out[k]).join(' | '));
})();
