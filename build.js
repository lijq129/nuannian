// 构建脚本：清空重建 dist/，并用全部资源的内容哈希生成 Service Worker 缓存键。
// 这样改任意文件 → 哈希变 → 客户端 SW 自动拉取新版，无需手动升版本号。
// 用法：node build.js   或   npm run build
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const ROOT = __dirname;
const DIST = path.join(ROOT, 'dist');

// 需要同步进 dist/ 的顶层条目（不碰 scripts/ qa/ .workbuddy/ node_modules/.git）
const ENTRIES = ['index.html', 'manifest.json', 'service-worker.js', 'css', 'js', 'assets'];
function rootIcons() {
  return fs.readdirSync(ROOT).filter(f => /^icon\.(svg|png)$/.test(f));
}

function rmrf(p) {
  if (!fs.existsSync(p)) return;
  for (const e of fs.readdirSync(p)) {
    const fp = path.join(p, e);
    try {
      if (fs.statSync(fp).isDirectory()) rmrf(fp); else fs.unlinkSync(fp);
    } catch (e) { /* 忽略个别文件删除失败，继续重建 */ }
  }
}
function copyEntry(src, dst) {
  const st = fs.statSync(src);
  if (st.isDirectory()) {
    fs.mkdirSync(dst, { recursive: true });
    for (const e of fs.readdirSync(src)) copyEntry(path.join(src, e), path.join(dst, e));
  } else {
    fs.mkdirSync(path.dirname(dst), { recursive: true });
    fs.copyFileSync(src, dst);
  }
}

// 1. 清空并重建 dist/
rmrf(DIST);
fs.mkdirSync(DIST, { recursive: true });
for (const e of ENTRIES) {
  const s = path.join(ROOT, e);
  if (fs.existsSync(s)) copyEntry(s, path.join(DIST, e));
}
for (const ic of rootIcons()) fs.copyFileSync(path.join(ROOT, ic), path.join(DIST, ic));

// 2. 计算 dist/ 全部文件内容哈希（短哈希作为缓存键）
const hash = crypto.createHash('sha256');
function walk(p) {
  for (const e of fs.readdirSync(p)) {
    const fp = path.join(p, e);
    if (fs.statSync(fp).isDirectory()) walk(fp);
    else hash.update(fs.readFileSync(fp));
  }
}
walk(DIST);
const short = hash.digest('hex').slice(0, 10);

// 3. 写入 SW 缓存键 + 版本文件 + index.html 构建版本 meta
let sw = fs.readFileSync(path.join(DIST, 'service-worker.js'), 'utf8');
sw = sw.replace(/const CACHE = '[^']*'/, `const CACHE = 'nuannian-shell-${short}-mobile'`);
fs.writeFileSync(path.join(DIST, 'service-worker.js'), sw);

fs.writeFileSync(path.join(DIST, 'version.json'), JSON.stringify({ hash: short, builtAt: new Date().toISOString() }, null, 2));

let html = fs.readFileSync(path.join(DIST, 'index.html'), 'utf8');
if (/name="build-version"/.test(html)) {
  html = html.replace(/<meta name="build-version" content="[^"]*">/, `<meta name="build-version" content="${short}">`);
} else {
  html = html.replace(/<head>/, `<head>\n  <meta name="build-version" content="${short}">`);
}
fs.writeFileSync(path.join(DIST, 'index.html'), html);

console.log('build done → dist/ 已重建，SW 缓存键 = nuannian-shell-' + short + '-mobile');
