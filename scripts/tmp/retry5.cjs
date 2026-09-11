/* 对第一轮没搜到的关键词换词重试，并把结果合并进 videos.json */
const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');
const ROOT = path.join(__dirname, '..', '..');
const OUT = path.join(__dirname, 'videos2.json');
const JAR = path.join(__dirname, 'cookie.txt');
const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/126.0 Safari/537.36';
const sleep = ms => new Promise(r => setTimeout(r, ms));

const ALT = {
  '山药小米粥 做法': ['山药小米粥', '小米山药粥 做法'],
  '水蒸蛋羹 做法': ['水蒸蛋', '蒸水蛋 做法'],
  '胡萝卜炒蛋 做法': ['胡萝卜炒鸡蛋', '胡萝卜炒蛋'],
  '手撕鸡丝 做法': ['手撕鸡丝', '鸡胸肉 手撕 凉拌'],
  '清蒸肉饼 做法': ['蒸肉饼 做法', '瘦肉蒸饼'],
  '清炖鱼汤 做法': ['鱼汤 做法', '清炖鱼汤'],
  '胡萝卜炒木耳 做法': ['胡萝卜木耳', '木耳炒胡萝卜'],
  '木耳拌黄瓜 做法': ['木耳黄瓜', '黄瓜拌木耳'],
  '核桃怎么处理 好吃': ['核桃仁 吃法', '核桃 家常做法'],
  '苹果怎么洗': ['水果 清洗 方法'],
  '蓝莓怎么洗': ['蓝莓 清洗', '蓝莓 保存'],
  '小番茄怎么洗': ['小番茄 清洗'],
  '红薯饭 做法': ['红薯米饭 做法', '红薯饭'],
  '牛油果 吃法': ['牛油果 怎么吃', '牛油果 简单吃法'],
  '韭菜鸡蛋饺子 做法': ['韭菜鸡蛋饺子 做法 家常', '素饺子 韭菜鸡蛋'],
  '生菜沙拉 做法': ['蔬菜沙拉 做法'],
  '藜麦饭 做法': ['藜麦 煮饭 做法']
};

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
    /* 强制重抓（除首次补缺外，覆盖已判为跑偏的条目） */
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
