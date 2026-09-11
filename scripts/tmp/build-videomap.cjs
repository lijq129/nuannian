/* 由 videos.json 生成 js/recipe-bv.js（菜品 / 菜谱 → 真人做法视频） */
const fs = require('fs');
const path = require('path');
const ROOT = path.join(__dirname, '..', '..');
const src = JSON.parse(fs.readFileSync(path.join(__dirname, 'videos.json'), 'utf8'));

/* 人工核对后判定为"对不上菜名"的条目：宁可没有视频，也不给错的 */
const REJECT = ['苹果怎么洗', '小番茄怎么洗', '坚果挑选 保存', '生菜沙拉 做法', '藜麦饭 做法'];

/* 键名规则必须与 js/data-video.js 的 videoKey 完全一致 */
const videoKey = raw => String(raw || '')
  .replace(/[（(][^）)]*[）)]/g, '')
  .replace(/\s*做法.*$/, '')
  .replace(/\s+/g, '')
  .trim();

const map = {};
const collisions = [];
Object.keys(src).forEach(k => {
  if (k[0] === '_') return;
  if (REJECT.includes(k)) return;
  const v = src[k];
  if (!v || !v.bv) return;
  const key = videoKey(k);
  if (!key) return;
  if (map[key]) collisions.push(key + ' <- ' + k);
  map[key] = { bv: v.bv, title: v.title || '', up: v.up || '', dur: v.dur || '' };
});
if (collisions.length) console.log('键冲突（后者覆盖前者）：' + collisions.join(' | '));

const esc = s => String(s || '').replace(/\\/g, '\\\\').replace(/"/g, '\\"').replace(/\n/g, ' ');

let out = '';
out += '/*\n * 菜谱 / 菜品「看做法」视频映射\n * 每条视频按菜名精确检索并人工核对过标题，打开前请再确认菜名一致。\n * 未检到可靠视频的条目不写入映射，界面会退回"在网上找这个做法"。\n */\n\n';
out += 'const VIDEO_MAP = {\n';
out += Object.keys(map).map(k => {
  const v = map[k];
  return `  "${esc(k)}": { bv: "${esc(v.bv)}", title: "${esc(v.title)}", up: "${esc(v.up)}", dur: "${esc(v.dur)}" }`;
}).join(',\n');
out += '\n};\n\n/* 旧版按菜名索引的映射，保留兼容 */\nconst RECIPE_BV = {\n';
const old = require(path.join(__dirname, 'oldbv.cjs'));
out += Object.keys(old).map(k => `  "${esc(k)}": "${esc(old[k])}"`).join(',\n');
out += '\n};\n';

fs.writeFileSync(path.join(ROOT, 'js/recipe-bv.js'), out, 'utf8');
console.log('已写入 js/recipe-bv.js，条目数：' + Object.keys(map).length + '，剔除：' + REJECT.length);
