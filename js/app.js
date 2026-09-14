/* ============ 健康生活工作台 V1.0 ============ */
const KEY = 'nuannian_v2';
const APP_DATA_VERSION = 3;
const $ = s => document.querySelector(s);
const $$ = s => Array.from(document.querySelectorAll(s));

const DEFAULTS = {
  profile: null,          // 见 PROFILE_DEFAULT
  settings: { font: 1, voice: true },
  med: { drugTime: '06:30', calciumTime: '12:30', calciumEnabled: false, lowIodine: false },
  checks: {}, healthChecks: {}, dietOff: {}, logs: [], myVideos: [], shop: {}, mealOverride: {}, confirmed: {},
  dataMeta: { version: APP_DATA_VERSION, lastImportedAt: '' },
  favs: { recipe: [], course: [], care: [] }
};

let S = load();
function normalizeState(input) {
  const raw = input && typeof input === 'object' ? input : {};
  const s = Object.assign(JSON.parse(JSON.stringify(DEFAULTS)), raw);
  s.profile = Object.assign(JSON.parse(JSON.stringify(PROFILE_DEFAULT)), raw.profile || {});
  s.settings = Object.assign({}, DEFAULTS.settings, raw.settings || {});
  s.med = Object.assign({}, DEFAULTS.med, raw.med || {});
  s.favs = Object.assign({ recipe: [], course: [], care: [] }, raw.favs || {});
  s.healthChecks = raw.healthChecks && typeof raw.healthChecks === 'object' ? raw.healthChecks : {};
  s.dataMeta = Object.assign({}, DEFAULTS.dataMeta, raw.dataMeta || {}, { version:APP_DATA_VERSION });
  return s;
}
function load() {
  try {
    const raw = localStorage.getItem(KEY);
    const o = raw ? JSON.parse(raw) : {};
    return normalizeState(o);
  } catch (e) {
    return normalizeState({});
  }
}
function save() { localStorage.setItem(KEY, JSON.stringify(S)); }
function exportUserData() {
  collectForm(); save();
  const payload = { product:'nuannian', schemaVersion:APP_DATA_VERSION, exportedAt:new Date().toISOString(), data:S };
  const blob = new Blob([JSON.stringify(payload, null, 2)], { type:'application/json' });
  const a = document.createElement('a'); a.href = URL.createObjectURL(blob);
  a.download = `暖年数据备份-${today()}.json`; a.click();
  setTimeout(() => URL.revokeObjectURL(a.href), 1000);
  toast('数据备份已导出');
}
function cleanImportedValue(value, depth = 0) {
  if (depth > 8) return null;
  if (typeof value === 'string') return value.replace(/[<>]/g, '').slice(0, 2000);
  if (typeof value === 'number') return Number.isFinite(value) ? value : 0;
  if (typeof value === 'boolean' || value == null) return value;
  if (Array.isArray(value)) return value.slice(0, 1000).map(v => cleanImportedValue(v, depth + 1));
  if (typeof value === 'object') {
    const out = {};
    Object.keys(value).filter(k => /^[\w\u4e00-\u9fa5-]{1,50}$/.test(k) && k !== '__proto__').slice(0, 500)
      .forEach(k => { out[k] = cleanImportedValue(value[k], depth + 1); });
    return out;
  }
  return null;
}
async function importUserData(file) {
  if (!file || file.size > 5 * 1024 * 1024) throw new Error('请选择小于 5MB 的暖年 JSON 备份文件');
  const parsed = JSON.parse(await file.text());
  if (parsed.product !== 'nuannian' || !parsed.data || typeof parsed.data !== 'object') throw new Error('这不是有效的暖年数据备份');
  if (!confirm('导入后将用备份内容替换当前档案和记录。是否继续？')) return false;
  const incoming = cleanImportedValue(parsed.data);
  S = normalizeState(incoming);
  S.dataMeta.lastImportedAt = new Date().toISOString();
  save(); editingProfile = false; navigationStack.length = 0;
  applyFont(); showPage(); toast('数据已更新，可以继续使用');
  return true;
}
const P0 = () => S.profile;
const escapeHTML = value => String(value).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));

/* ---------- 工具 ---------- */
function today() { const d = new Date(); return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0'); }
function dayIndex() { const d = new Date(); return Math.floor((d - new Date(d.getFullYear(), 0, 0)) / 86400000); }
function todayChecks() { const t = today(); if (!S.checks[t]) S.checks[t] = {}; return S.checks[t]; }
function todayHealth() {
  const t = today();
  if (!S.healthChecks[t]) S.healthChecks[t] = { status:'unknown', symptom:'', updatedAt:'' };
  return S.healthChecks[t];
}
const HEALTH_ALERTS = {
  dizzy: '今天有头晕、视物异常或走路不稳',
  leg: '今天有单侧腿突然肿痛、发热或皮肤变色',
  chest: '今天有胸痛、呼吸困难、晕厥或咳血'
};
function healthStatusHTML() {
  const h = todayHealth();
  /* 只有真正记录了警示症状时才醒目提示，其余情况收成一行，不再占屏 */
  if (h.status === 'alert') return `<section class="daily-safety is-alert" id="daily-safety"><div><b>${icon('warning')} 今天先歇一歇</b><p>${escapeHTML(HEALTH_ALERTS[h.symptom] || '今天记录了不舒服')}。${h.symptom === 'chest' ? '请立即呼叫 120。' : '先别活动，及时联系家人或就医；若同时胸痛或呼吸困难，立即呼叫 120。'}</p></div><button class="btn ghost sm" data-act="healthreset">重新填写</button></section>`;
  if (h.status === 'clear') return `<div class="health-strip is-clear" id="daily-safety">${icon('check')}<span>今天状态不错，量力做就好</span><button class="link" data-act="healthreset">重填</button></div>`;
  return `<details class="health-strip" id="daily-safety"><summary>${icon('shield')}<span>身体不舒服的那几天，先歇一歇</span><em>看情况</em></summary><div class="safety-choices"><button class="btn sm" data-act="healthclear">今天没有这些情况</button><button class="btn ghost sm" data-act="healthalert" data-kind="dizzy">有头晕或走路不稳</button><button class="btn ghost sm" data-act="healthalert" data-kind="leg">单侧腿突发肿痛</button><button class="btn ghost sm" data-act="healthalert" data-kind="chest">胸痛或呼吸困难</button></div><p class="health-strip-note">只用来判断今天适不适合活动，不是诊断。平时不用管它。</p></details>`;
}
function exerciseReady() {
  /* 只有记录到警示症状才拦；没确认过也照常开始，练习前的提醒与每条动作的注意已经覆盖 */
  const h = todayHealth();
  if (h.status === 'alert') {
    toast('今天记了不舒服的情况，先休息，别勉强活动', 3200);
    setTimeout(() => document.querySelector('#daily-safety')?.scrollIntoView({ block:'center', behavior:'smooth' }), 40);
    return false;
  }
  return true;
}
function mmss(s) { return String(Math.floor(s / 60)).padStart(2, '0') + ':' + String(s % 60).padStart(2, '0'); }
function greet() { const h = new Date().getHours(); return h < 6 ? '夜深了' : h < 11 ? '早上好' : h < 14 ? '中午好' : h < 18 ? '下午好' : '晚上好'; }
function weekDates() {
  const out = []; const now = new Date(); const dow = (now.getDay() + 6) % 7;
  for (let i = 0; i < 7; i++) {
    const d = new Date(now.getFullYear(), now.getMonth(), now.getDate() - dow + i);
    out.push({ key: d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0'), label: '一二三四五六日'[i], day: d.getDate() });
  }
  return out;
}
let toastTimer;
function toast(msg, ms) { const t = $('#toast'); t.textContent = msg; t.classList.add('show'); clearTimeout(toastTimer); toastTimer = setTimeout(() => t.classList.remove('show'), ms || 1900); }
function currentBuild() { const m = document.querySelector('meta[name="build-version"]'); return (m && m.content) ? m.content : (location.protocol === 'file:' ? '本地' : '未知'); }
function speak(text) {
  if (!S.settings.voice || !window.speechSynthesis) return;
  try { const u = new SpeechSynthesisUtterance(text); u.lang = 'zh-CN'; u.rate = .92; speechSynthesis.cancel(); speechSynthesis.speak(u); } catch (e) { }
}
// 把单个动作的「目标 + 全部步骤 + 安全提醒」用自然语言连贯播报，避免只念第一步的机械感
function speakItem(it) {
  if (!it) return;
  const cn = ['一', '二', '三', '四', '五', '六', '七', '八'];
  let text = `下面我们开始做${it.name}。`;
  if (it.target) text += `这一项的目标是 ${it.target}。`;
  (it.steps || []).forEach((s, i) => { text += `第${cn[i] || (i + 1)}步，${s}`; });
  if (it.caution) text += `最后提醒您，${it.caution}`;
  speak(text);
}
Object.assign(EX.SVG, CARE.SVG);

/* ============ 专业线性图标库（替换 emoji，统一视觉） ============ */
const ICONS = {
  home: '<path d="M4 11l8-6 8 6"/><path d="M6 10v9h12v-9"/><path d="M10 19v-5h4v5"/>',
  diet: '<path d="M3 10h18"/><path d="M4 10a8 8 0 0 0 16 0"/><path d="M9 5c0-1 .8-1.2 1-2M12 4.2c0-1 .8-1.2 1-2M15 5c0-1 .8-1.2 1-2"/>',
  pair: '<path d="M12 4v16"/><path d="M5 7h14"/><path d="M5 7l-2.4 4.8a2.4 2.4 0 0 0 4.8 0z"/><path d="M19 7l-2.4 4.8a2.4 2.4 0 0 0 4.8 0z"/><path d="M8.5 20h7"/>',
  recipe: '<path d="M6 4a2 2 0 0 1 2-2h12v15H8a2 2 0 0 0-2 2z"/><path d="M6 4a2 2 0 0 0-2 2v13a2 2 0 0 1 2-2"/><path d="M9.5 6.5h7M9.5 9.5h7"/>',
  exercise: '<path d="M3 9v6M6 6.5v11M18 6.5v11M21 9v6"/><path d="M6 12h12"/>',
  care: '<path d="M5 19c0-7 5-12 14-12 0 9-5 14-14 12z"/><path d="M6 18c3.5-4 6.5-6 9.5-7"/>',
  video: '<rect x="3" y="6" width="13" height="12" rx="2.5"/><path d="M16 10l5-3v10l-5-3z"/>',
  water: '<path d="M12 3.5c3 4 6 7 6 10a6 6 0 0 1-12 0c0-3 3-6 6-10z"/>',
  med: '<rect x="3" y="9" width="18" height="6" rx="3"/><path d="M12 9v6"/>',
  neck: '<circle cx="12" cy="6.5" r="2.8"/><path d="M5 20c0-4.2 3-6.5 7-6.5s7 2.3 7 6.5"/>',
  leg: '<ellipse cx="10.5" cy="15" rx="4" ry="6"/><circle cx="16" cy="7.5" r="2.2"/><circle cx="13.6" cy="6.4" r="1.7"/><circle cx="18.4" cy="6.4" r="1.5"/>',
  waist: '<circle cx="12" cy="12" r="7.5"/><circle cx="12" cy="12" r="3.2"/>',
  eye: '<path d="M2 12c3-5 7-7 10-7s7 2 10 7c-3 5-7 7-10 7S5 17 2 12z"/><circle cx="12" cy="12" r="2.6"/>',
  posture: '<circle cx="12" cy="4.6" r="2"/><path d="M12 6.6v6"/><path d="M12 8l-4 2M12 8l4 2"/><path d="M12 12.6l-3 7M12 12.6l3 7"/>',
  sleep: '<path d="M20 14.5A8 8 0 1 1-9.5 10 6.3 6.3 0 0 0 20 14.5z"/>',
  walk: '<path d="M3 16h13.5a3 3 0 0 0 3-3c0-1.1-1-1.6-2-2.1l-2-1-3-3a2 2 0 0 0-1.7-1H7.2A2 2 0 0 0 5.2 6.5v9.5z"/><path d="M3 16.2v2.3h17"/>',
  breakfast: '<path d="M3 18h18"/><path d="M8 18a4 4 0 0 1 8 0"/><path d="M12 4v4M5.5 9l1.4 1.4M18.5 9l-1.4 1.4"/>',
  lunch: '<circle cx="12" cy="12" r="3.6"/><path d="M12 3v2.4M12 18.6V21M3 12h2.4M18.6 12H21M5.4 5.4l1.7 1.7M17 17l1.7 1.7M18.6 5.4L17 7M7 17l-1.7 1.7"/>',
  dinner: '<path d="M20 14.5A8 8 0 1 1-9.5 10 6.3 6.3 0 0 0 20 14.5z"/>',
  snack: '<path d="M12 7c-1-3.2-5.2-3.2-6 0-1 3.2 2 5.3 4 5.3 1 0 2 0 3 0 2 0 5-2.1 4-5.3-1-3.2-5-3.2-6 0z"/><path d="M12 7V4"/>',
  check: '<path d="M5 13l4 4 10-11"/>',
  play: '<path d="M8 5.5l11 6.5-11 6.5z" fill="currentColor" stroke="none"/>',
  swap: '<path d="M7 8h11l-3-3M17 16H6l3 3"/>',
  plus: '<path d="M12 5v14M5 12h14"/>',
  heart: '<path d="M12 20s-7-4.4-9-8.8A4.4 4.4 0 0 1 12 6.6a4.4 4.4 0 0 1 9 4.6C18.5 15.6 12 20 12 20z"/>',
  user: '<circle cx="12" cy="8" r="3.6"/><path d="M5 20c0-3.8 3.1-6 7-6s7 2.2 7 6"/>',
  /* 目标图标 */
  maintain: '<path d="M12 4v16"/><path d="M5 8h14"/><path d="M5 8l-2.4 4.8a2.4 2.4 0 0 0 4.8 0z"/><path d="M19 8l-2.4 4.8a2.4 2.4 0 0 0 4.8 0z"/>',
  lose: '<path d="M12 3c3 4 5 6 5 9a5 5 0 0 1-10 0c0-1.6.7-2.8 1.5-3.7C9 9 9.6 10.2 11 10.6 11.7 8.4 10 5 12 3z"/>',
  muscle: '<path d="M3 8v8M5 6v12M19 6v12M21 8v8"/><path d="M5 12h14"/>',
  stomach: '<path d="M4 11h16a8 8 0 0 1-16 0z"/><path d="M3.5 11h17"/>',
  sugar: '<path d="M12 3.5c3 4 6 7 6 10a6 6 0 0 1-12 0c0-3 3-6 6-10z"/>',
  thyroid: '<path d="M12 3l7 3v6c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V6z"/><path d="M12 7v9"/>',
  hand: '<path d="M8 11V5.4a1.4 1.4 0 0 1 2.8 0V11"/><path d="M10.8 11V4.4a1.4 1.4 0 0 1 2.8 0V11"/><path d="M13.6 11V6.4a1.4 1.4 0 0 1 2.8 0V13c0 3.3-2 5.7-5.4 5.7S7 16.3 7 13"/>',
  pill: '<rect x="3" y="8" width="18" height="8" rx="4"/><path d="M12 8v8" stroke-width="2.2"/>',
  bone: '<path d="M7 9.5a2 2 0 1 0-2 2c1 .6 1.4 1.6 1 2.7-.4 1 .6 2 1.6 1.6 1-.4 1.4-1.4 1-2.7A2 2 0 1 0 10 11c-.4 1.3-1.4 1.7-2.7 1.3-1-.4-2 .6-1.6 1.6"/><path d="M17 14.5a2 2 0 1 1 2-2c-1-.6-1.4-1.6-1-2.7.4-1-.6-2-1.6-1.6-1 .4-1.4 1.4-1 2.7a2 2 0 1 1-3 1.5c.4-1.3 1.4-1.7 2.7-1.3 1 .4 2-.6 1.6-1.6"/>',
  shield: '<path d="M12 3l7 3v6c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V6z"/><path d="M9 12l2 2 4-4.5"/>'
};
function icon(name, cls) {
  const p = ICONS[name]; if (!p) return '';
  return `<svg class="ic ${cls || ''}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${p}</svg>`;
}
function icBtn(name) { return icon(name); }

/* 暖年统一图标：24px 网格、圆角线条、随字号缩放。 */
Object.assign(ICONS, {
  exercise: '<circle cx="14" cy="4" r="2"/><path d="m7 12 3-4 4 1 3 4h3M10 8l-1 7-4 5m4-5 5 1 1 5"/>',
  leg: '<path d="m9 3-1 8 4 6-1 3H5M16 3l-1 8 4 6v3h-5"/>',
  sleep: '<path d="M20.8 13A9 9 0 0 1 11 3.2 9 9 0 1 0 20.8 13Z"/>',
  dinner: '<path d="M20.8 13A9 9 0 0 1 11 3.2 9 9 0 1 0 20.8 13Z"/>',
  heart: '<path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8L12 21l8.8-8.6a5.5 5.5 0 0 0 0-7.8Z"/>',
  bookmark: '<path d="M6 21V5a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v16l-6-4Z"/>',
  search: '<circle cx="10.5" cy="10.5" r="6.5"/><path d="m16 16 5 5"/>',
  info: '<circle cx="12" cy="12" r="9"/><path d="M12 11v6m0-10v.01"/>',
  warning: '<path d="m10.3 4-8 14a2 2 0 0 0 1.7 3h16a2 2 0 0 0 1.7-3l-8-14a2 2 0 0 0-3.4 0Z"/><path d="M12 9v4m0 4v.01"/>',
  lock: '<rect x="4" y="10" width="16" height="11" rx="2"/><path d="M8 10V6a4 4 0 0 1 8 0v4m-4 5v2"/>',
  document: '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z"/><path d="M14 2v6h6M8 13h8m-8 4h6"/>',
  close: '<path d="m6 6 12 12M6 18 18 6"/>',
  sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2m0 16v2M2 12h2m16 0h2M5 5l1.5 1.5m11 11L19 19M5 19l1.5-1.5m11-11L19 5"/>',
  calendar: '<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M7 3v4m10-4v4M3 11h18m-14 4h3m4 0h3"/>',
  volume: '<path d="m11 4-6 5H2v6h3l6 5Zm4 4a6 6 0 0 1 0 8m3-11a10 10 0 0 1 0 14"/>',
  bone: '<path d="M17 10a3 3 0 1 0-3-3l-7 7a3 3 0 1 0 3 3Z"/>',
  snow: '<path d="M12 2v20M3.3 7l17.4 10M3.3 17 20.7 7M9 4l3 3 3-3M9 20l3-3 3 3"/>'
});
function pageHeading(title, sub) {
  return `<header class="page-heading"><div><span class="eyebrow">暖年 · 每日养护</span><h1>${title}</h1><p>${sub}</p></div><span class="brand-mark" aria-hidden="true">${icon('care')}</span></header>`;
}
/* 旧内容库中的装饰符号统一转换为矢量图标，不改变健康文案。 */
function finishView(root) {
  const symbols = { '🍽':'diet','🍳':'recipe','📖':'recipe','🏃':'exercise','🔍':'search','💡':'info','📄':'document','🔒':'lock','⚠':'warning','🧣':'neck','🦵':'leg','😴':'sleep','🌙':'sleep','🌅':'breakfast','🌱':'care','☀':'sun','🍂':'care','❄':'snow','🌿':'care','🪑':'posture','👀':'eye','✋':'hand','🧘':'care','🌬':'care','🕯':'care','🚫':'close','❌':'close','⛔':'close','✅':'check','✓':'check','★':'bookmark','☆':'bookmark','▶':'play','💊':'pill','💧':'water','🛒':'diet','🍎':'snack','🥛':'diet','🥚':'diet','🫘':'diet','🦐':'diet','🥜':'diet','🌾':'diet','🥩':'diet','🥬':'care' };
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
  const nodes = []; while (walker.nextNode()) nodes.push(walker.currentNode);
  nodes.forEach(node => {
    if (node.parentElement.closest('svg,script,style,pre')) return;
    const re = /[\p{Extended_Pictographic}✓★☆▶]\uFE0F?/gu;
    if (!re.test(node.textContent)) return;
    re.lastIndex = 0;
    const fragment = document.createDocumentFragment(); let last = 0;
    for (const match of node.textContent.matchAll(re)) {
      fragment.append(node.textContent.slice(last, match.index));
      const span = document.createElement('span'); span.className = 'inline-icon';
      span.innerHTML = icon(symbols[match[0].replace(/\uFE0F/g, '')] || 'info');
      fragment.append(span); last = match.index + match[0].length;
    }
    fragment.append(node.textContent.slice(last)); node.replaceWith(fragment);
  });
  root.querySelectorAll('.seg button,.chip').forEach(b => b.setAttribute('aria-pressed', b.classList.contains('on')));
  root.querySelectorAll('.switch').forEach(b => { b.setAttribute('role','switch'); b.setAttribute('aria-checked',b.classList.contains('on')); if (!b.getAttribute('aria-label')) b.setAttribute('aria-label','语音提示'); });
  root.querySelectorAll('.field input,.field select,.field textarea').forEach(i => i.setAttribute('aria-label',i.closest('.field').querySelector('.fl')?.firstChild.textContent || '设置'));
  root.querySelectorAll('.chk').forEach(b => b.setAttribute('aria-pressed',b.classList.contains('on')));
}

/* ---------- 动态打卡项 ---------- */
function buildChecks() {
  const p = P0(), f = p.focus || [];
  const list = [{ id: 'water', ico: 'water', name: '喝水', desc: '小口多次' }];
  if (f.includes('thyroid') || p.goal === 'thyroid') {
    list.push({ id: 'med', ico: 'med', name: '服甲状腺素', desc: '空腹服' });
    if (medSchedule().calciumEnabled) list.push({ id: 'calcium', ico: 'bone', name: '补钙 / 维 D', desc: '按处方服用' });
  }
  if (f.includes('waist')) list.push({ id: 'waist', ico: 'waist', name: '腰背放松', desc: '10 分钟' });
  if (f.includes('eye')) list.push({ id: 'eye', ico: 'eye', name: '眼部放松', desc: '2 分钟' });
  if (f.includes('posture')) list.push({ id: 'posture', ico: 'posture', name: '体态矫正', desc: '10 分钟' });
  if (f.includes('sleep')) list.push({ id: 'sleep', ico: 'sleep', name: '按时睡', desc: '23 点前' });
  /* 肩背放松、腿部活动、短时走动已移到「活动养护」页，进度仍与首页联动 */
  return list.slice(0, 8);
}
const CHK = () => buildChecks();
function isDone(c, id) { return id === 'water' ? (c.water || 0) >= (+P0().waterGoal || 8) : !!c[id]; }
/* 进度 = 打卡项 + 活动养护页的今日三项 */
function allChecks() { return CHK().concat(actTasks().map(t => ({ id: t.id }))); }
function doneCount(c) { return allChecks().filter(x => isDone(c, x.id)).length; }

/* ---------- 饮食推荐 ---------- */
function mealHasBlockedContent(m, av) {
  const has = m.has || [], text = [m.name].concat((m.foods || []).map(f => f[0])).join('');
  if (av.includes('seafood') && has.includes('seafood')) return true;
  if (av.includes('lactose') && has.includes('dairy')) return true;
  if (av.includes('soy') && has.includes('soy')) return true;
  if (av.includes('pork') && has.includes('pork')) return true;
  if (av.includes('vegetarian') && (has.includes('meat') || has.includes('seafood'))) return true;
  if (av.includes('spicy') && /辣椒|辣酱|麻辣|香辣|酸辣/.test(text)) return true;
  if (medSchedule().lowIodine && /海带|紫菜|虾皮|海藻|昆布/.test(text)) return true;
  return false;
}
function noMealMatch(type) {
  const label = { breakfast:'早餐', lunch:'午餐', dinner:'晚餐', snack:'加餐' }[type];
  return { name:`${label}暂不自动推荐`, kcal:0, pro:0, unavailable:true, foods:[], has:[],
    tip:'没有找到同时符合全部忌口或当前低碘要求的预设搭配。系统不会忽略限制，请在“我的”核对设置，必要时咨询医生或营养师。' };
}
function pickMeal(type, targetKcal, off, seed) {
  const p = P0(), av = p.avoids || [];
  const pool = DIET.meals[type].filter(m => !mealHasBlockedContent(m, av));
  if (!pool.length) return noMealMatch(type);
  const byGoal = pool.filter(m => (m.goals || []).includes(p.goal));
  const cand = (byGoal.length ? byGoal : pool);
  const sorted = cand.slice().sort((a, b) => Math.abs(a.kcal - targetKcal) - Math.abs(b.kcal - targetKcal));
  const top = sorted.slice(0, 5);   // 取最接近目标的 5 个，按日期轮换，保证每天都不同
  return top[(dayIndex() + (seed || 0) + (off || 0)) % top.length];  // seed: 明日推荐 +1，与今日错开一档
}
function nextDayKey() { const d = new Date(); d.setDate(d.getDate() + 1); return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0'); }
function nextDayLabel() { const d = new Date(); d.setDate(d.getDate() + 1); return (d.getMonth() + 1) + '月' + d.getDate() + '日'; }
function recipeToMeal(r) {
  return { name: r.name, kcal: r.kcal || 0, pro: 0, override: true,
    foods: r.ing.map(i => [i[0], i[1]]),
    tip: '已应用你选择的菜谱（' + (r.tags || []).slice(0, 2).join('/') + '）：按菜谱步骤制作即可。' };
}
function mealOverride(type, key = today()) {
  const o = (S.mealOverride || {})[key] || {};
  if (o[type]) { const r = DIET.recipes.find(x => x.id === o[type]); if (r) return recipeToMeal(r); }
  return null;
}
function dayPlan(isNext) {
  const key = isNext ? nextDayKey() : today();
  const p = P0(), t = calcTarget(p), sp = mealSplit(t.kcal);
  const off = (S.dietOff[key] || {});
  const get = type => mealOverride(type, key) || pickMeal(type, sp[type], off[type], isNext ? 1 : 0);
  if (S.confirmed && S.confirmed[key]) {
    const plan = JSON.parse(JSON.stringify(S.confirmed[key]));
    ['breakfast','lunch','dinner','snack'].forEach(type => {
      if (!plan[type] || mealHasBlockedContent(plan[type], p.avoids || [])) plan[type] = get(type);
    });
    plan.target = t; plan.split = sp;
    return plan;
  }
  return { target: t, split: sp, breakfast: get('breakfast'), lunch: get('lunch'), dinner: get('dinner'), snack: get('snack') };
}
function todayPlan() { return dayPlan(false); }
function tomorrowPlan() { return dayPlan(true); }
function buildShop(plan) {
  const keys = [['breakfast', '🌅 早餐'], ['lunch', '☀️ 午餐'], ['dinner', '🌙 晚餐'], ['snack', '🍎 加餐']];
  const list = [];
  keys.forEach(([k, label]) => {
    const seen = {};                                   // 食材名 → 用量数组（同餐去重合并）
    (plan[k].foods || []).forEach(([food, amt]) => {
      const ings = (MEAL_FOOD_ING && MEAL_FOOD_ING[food]) || [[food, amt || '']];   // 菜品 → 真实采购材料；未收录则保留原名
      ings.forEach(([ing, a]) => { if (ing) (seen[ing] = seen[ing] || []).push(a || ''); });
    });
    Object.keys(seen).forEach(ing => {
      const amts = [...new Set(seen[ing].filter(Boolean))];
      list.push({ meal: label, name: ing, amt: amts.join('、') });
    });
  });
  return list;
}

/* 是否处于甲状腺术后场景（决定用药提醒与冲突提示是否显示） */
function isThyContext() { const p = P0(); return (p.focus || []).includes('thyroid') || p.goal === 'thyroid'; }

/* 用药时间表（优先取用户设置） */
function medSchedule() { return Object.assign({}, MED.default, S.med || {}); }

/* 套餐与甲状腺用药的冲突提醒（仅甲状腺场景触发） */
function mealConflicts(it, mealType) {
  const p = P0();
  if (p.goal !== 'thyroid' && !(p.focus || []).includes('thyroid')) return [];
  const out = [];
  if (mealType === 'breakfast') {
    (it.has || []).forEach(h => {
      if ((h === 'dairy' || h === 'soy') && MED.conflicts[h] && out.indexOf(MED.conflicts[h]) < 0) out.push(MED.conflicts[h]);
    });
  }
  if (medSchedule().lowIodine) {
    const text = [it.name].concat((it.foods || []).map(f => f[0])).join('');
    if (/海带|紫菜|虾皮|海藻|昆布/.test(text)) out.push(MED.conflicts.lowIodine);
  }
  return out;
}

/* 套餐 → 代表菜谱（用于"看做法"展示真实步骤） */
function mealRecipeOf(it) { const id = (typeof MEAL_RECIPE !== 'undefined') && MEAL_RECIPE[it.name]; return id ? (DIET.recipes.find(r => r.id === id) || null) : null; }

/* 单个菜名 → 菜谱（用于「明日推荐」跳转到菜谱看做法）：
   先按原名精确匹配，再去掉括号里的备注后匹配。匹配不到返回 null（主食/配菜无独立菜谱）。 */
function dishRecipeOf(name) {
  const raw = String(name || '').trim();
  if (!raw) return null;
  let r = DIET.recipes.find(x => x.name === raw);
  if (r) return r;
  const clean = raw.replace(/（[^）]*）|\([^)]*\)/g, '').replace(/\s/g, '');
  if (!clean || clean === raw) return null;
  return DIET.recipes.find(x => x.name === clean) || null;
}

/* 菜名 → 菜谱搜索关键词：去括号/标点、去烹饪动词，必要时去「汤羹粥」等后缀，尽量命中一条菜谱 */
function dishSearchKey(name) {
  const strip = String(name || '').replace(/（[^）]*）|\([^)]*\)/g, '').replace(/[\s·、,，()（）]/g, '');
  const k = strip
    .replace(/^(低盐|低脂|无糖|少油|少盐|新鲜|自制|现成|焯拌|凉拌|清炒|清蒸|水煮|红烧|香煎|干煸|清炖|炒|蒸|煮|炖|煎|烤|拌|焯|焖|卤)/, '')
    .replace(/^(低盐|低脂|无糖|少油|少盐|新鲜|自制|现成)/, '');
  const hits = q => { const t = q.toLowerCase(); return DIET.recipes.some(r => (r.name + r.tags.join('') + r.scene + (r.kw || '')).toLowerCase().includes(t)); };
  const cands = [k];
  const short = k.replace(/(汤|羹|粥|饭|糊|汁|泥|块|片|丝)$/, '');
  if (short && short !== k) cands.push(short);
  /* 按连接词拆分逐段尝试（如「芹菜拌花生米」→ 芹菜 / 花生米） */
  k.split(/[拌炒炖煮蒸焖卤烩烤煎]/).forEach(seg => {
    const s = seg.replace(/(汤|羹|粥|饭|糊|汁|泥)$/, '');
    if (s.length >= 2) cands.push(s);
  });
  const tail = k.slice(-2);
  if (tail.length >= 2) cands.push(tail);
  for (const c of cands) { if (c.length >= 2 && hits(c)) return c; }
  return k || String(name || '');
}

/* 生成 HTML 属性用转义 */
function escAttr(s) { return String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/'/g, '&#39;').replace(/</g, '&lt;').replace(/>/g, '&gt;'); }

/* 只在展开做法后加载官方播放器；离开或收起时销毁，避免后台播放。 */
function cookingVideoHTML(name, info, ready = false) {
  if (ready) return '<p class="video-ready">即食食材，按上方说明处理即可，无需烹饪视频。</p>';
  if (!info || !info.bv) return '<p class="video-ready">这道菜的视频暂未收录，请先参考上方文字做法。</p>';
  const url = `https://www.bilibili.com/video/${info.bv}/`;
  const src = `https://player.bilibili.com/player.html?bvid=${info.bv}&page=${info.page || 1}&autoplay=0&danmaku=0`;
  return `<section class="cooking-video" aria-label="${escAttr(name)}做法视频">
    <div class="video-heading"><b>跟着视频做</b><span>哔哩哔哩 · ${escAttr(info.dur || '')}</span></div>
    <div class="video-stage${info.portrait ? ' is-portrait' : ''}" data-player-src="${escAttr(src)}" data-player-title="${escAttr(name + '做法视频')}">
      <button class="video-load" data-act="loadcooking">加载做法视频<span>需要联网，不会自动播放</span></button>
    </div>
    <div class="video-credit"><span>${escAttr(info.title)}<br>作者：${escAttr(info.up)}</span><a href="${url}" target="_blank" rel="noopener noreferrer">原站观看</a></div>
    ${info.note ? `<p class="video-note">${escAttr(info.note)}</p>` : ''}
    <p class="video-note">视频仅参考烹饪手法，食材用量与饮食注意事项以上方文字为准。若无法加载，可在原站观看；清晰度、登录及播放限制由平台决定。</p>
  </section>`;
}
function stopCookingVideos(root = document) {
  root.querySelectorAll('.video-stage iframe').forEach(frame => {
    const parent = frame.parentElement;
    const lb = parent.querySelector('.video-load'); if (lb) lb.hidden = false;
    const fb = parent.querySelector('.stage-fs-btn'); if (fb) fb.remove();
    parent.classList.remove('has-video');
    frame.remove();
  });
}
function loadCookingVideo(stage) {
  if (!stage || stage.querySelector('iframe')) return;
  stopCookingVideos();
  const frame = document.createElement('iframe');
  frame.src = stage.dataset.playerSrc;
  frame.title = stage.dataset.playerTitle;
  frame.allow = 'fullscreen; picture-in-picture';
  frame.allowFullscreen = true;
  frame.setAttribute('webkitallowfullscreen', 'true');
  frame.referrerPolicy = 'strict-origin-when-cross-origin';
  const lb = stage.querySelector('.video-load'); if (lb) lb.hidden = true;
  if (!stage.querySelector('.stage-fs-btn')) {
    const b = document.createElement('button');
    b.className = 'stage-fs-btn'; b.dataset.act = 'stagefs'; b.type = 'button';
    b.setAttribute('aria-label', '全屏放大'); b.textContent = '放大';
    stage.appendChild(b);
  }
  stage.classList.add('has-video');
  stage.appendChild(frame);
}

/* 单个菜品（食材行）的做法面板：文字做法 + 真人视频 */
function dishStepHTML(name, amt) {
  const hit = (typeof resolveDish === 'function') ? resolveDish(name) : null;
  const body = hit ? dishBody(hit.key) : null;
  const v = videoInfo((body && body.kw) || name);
  const label = (body && body.ready) ? '处理 / 食用' : '做法';
  const meta = [];
  if (body && body.time) meta.push(body.time);
  if (body && body.level) meta.push(body.level);
  if (body && body.cat) meta.push(body.cat);

  let html = `<div class="dp">`;
  if (amt) html += `<div class="mm-row"><b>份量：</b>${amt}</div>`;
  if (meta.length) html += `<div class="mm-row"><b>参考：</b>${meta.join(' · ')}</div>`;
  html += `<div class="mm-row mm-steps"><b>${label}：</b></div>`;
  if (body && (body.steps || []).length) {
    html += body.steps.map((s, i) => `<p>${i + 1}) ${s}</p>`).join('');
  } else {
    html += `<p>这道菜暂时没有单独的文字做法。按家常方式处理：少油少盐、先焯后炒，口味以清淡为主。</p>`;
  }
  if (body && body.tip) html += `<p class="mm-tip"><b>小贴士：</b>${body.tip}</p>`;
  html += cookingVideoHTML(name, v, body && body.ready);
  html += `</div>`;
  return html;
}

/* ---------- 导航 ---------- */
let currentView = 'home';
const navigationStack = [];
let restoringPage = false, navigationTimer;
function pageState() {
  return { currentView, dietTab, recipeFilter, recipeOpen, recipeQuery, recipeCat, moveTab, exCat, meTab, editingProfile, homeQuery: window.__q || '' };
}
function pageLabel(s) {
  if (s.currentView === 'home') return s.homeQuery ? '首页搜索' : '今日';
  if (s.currentView === 'diet') return { menu:'今日三餐', tmrw:'明日推荐', recipe:'家常菜谱' }[s.dietTab] || '饮食';
  if (s.currentView === 'move') return { course:'养护课程', video:'跟练视频', routine:'作息', safe:'安全须知' }[s.moveTab] || '活动养护';
  return { plan:'我的', fav:'收藏', record:'打卡', legal:'协议' }[s.meTab] || '我的';
}
function capturePage() {
  collectForm();
  const root = $('#view-' + currentView);
  return { state:pageState(), scroll:window.scrollY,
    expanded:Array.from(root.querySelectorAll('[data-acc]')).map(e => e.classList.contains('open')),
    dishes:Array.from(root.querySelectorAll('.dish-b')).map(e => !e.hidden) };
}
function setPageState(s) {
  ({ currentView, dietTab, recipeFilter, recipeOpen, recipeQuery, recipeCat, moveTab, exCat, meTab, editingProfile } = s);
  window.__q = s.homeQuery;
}
function renderBackNavigation() {
  const nav = $('#back-nav'), origin = navigationStack[navigationStack.length - 1];
  nav.classList.toggle('hidden', !origin);
  $('#page-back').textContent = origin ? '‹ 返回 · ' + pageLabel(origin.state) : '返回原页面';
}
function showPage() {
  stopCookingVideos();
  $$('.view').forEach(x => x.classList.add('hidden'));
  $('#view-' + currentView).classList.remove('hidden');
  $$('.tab').forEach(b => { b.classList.toggle('active', b.dataset.view === currentView); if (b.dataset.view === currentView) b.setAttribute('aria-current','page'); else b.removeAttribute('aria-current'); });
  renderBackNavigation();
  render();
}
// 必须先记录来源，再修改目标标签或筛选；同页内联动也走此入口。
function go(v, changes = {}) {
  const next = { ...pageState(), ...changes, currentView:v };
  if (JSON.stringify(next) === JSON.stringify(pageState())) { showPage(); return; }
  clearTimeout(navigationTimer);
  navigationStack.push(capturePage());
  setPageState(next);
  showPage();
  window.scrollTo(0, 0);
}
function selectPage(v, changes = {}, resetHistory = false) {
  clearTimeout(navigationTimer); collectForm();
  if (resetHistory) navigationStack.length = 0;
  setPageState({ ...pageState(), ...changes, currentView:v });
  showPage(); window.scrollTo(0, 0);
}
function restorePage(origin) {
  clearTimeout(navigationTimer);
  collectForm();
  setPageState(origin.state);
  restoringPage = true;
  try { showPage(); } finally { restoringPage = false; }
  const root = $('#view-' + currentView);
  root.querySelectorAll('[data-acc]').forEach((box, i) => {
    const open = !!origin.expanded[i];
    box.classList.toggle('open', open);
    box.querySelector('.acc-h')?.setAttribute('aria-expanded', String(open));
  });
  root.querySelectorAll('.dish-b').forEach((box, i) => {
    box.hidden = !origin.dishes[i];
    box.previousElementSibling?.classList.toggle('on', !box.hidden);
    box.previousElementSibling?.setAttribute('aria-expanded', String(!box.hidden));
  });
  // 重建文字状态，不恢复第三方 iframe，避免返回时重新播放。
  const heading = root.querySelector('h1');
  if (heading) { heading.tabIndex = -1; heading.focus({ preventScroll:true }); }
  window.scrollTo(0, origin.scroll);
}
function goBack() {
  const origin = navigationStack.pop();
  if (origin) restorePage(origin);
}
$$('.tab').forEach(b => b.addEventListener('click', () => selectPage(b.dataset.view, {}, true)));
$$('.tab-ico').forEach(e => e.innerHTML = icon(e.dataset.ico));

/* ================= 首页工作台 ================= */
const MODULES = [
  { id: 'diet', ico: 'diet', color: '#31584A', name: '今日三餐', desc: '今天吃什么', to: 'diet', tab: 'menu' },
  { id: 'recipe', ico: 'recipe', color: '#94634A', name: '家常菜谱', desc: '翻翻菜谱', to: 'diet', tab: 'recipe' },
  { id: 'exercise', ico: 'exercise', color: '#C2622E', name: '温和活动', desc: '松松筋骨', to: 'move', tab: 'course' },
  { id: 'care', ico: 'care', color: '#B5832E', name: '日常养护', desc: '生活小细节', to: 'move', tab: 'course' }
];

function ringSVG(done, total) {
  const R = 32, C = 2 * Math.PI * R;
  return `<svg class="ring" viewBox="0 0 80 80">
    <defs><linearGradient id="rg" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#FFB36B"/><stop offset="100%" stop-color="#FF6F91"/></linearGradient></defs>
    <circle cx="40" cy="40" r="${R}" fill="none" stroke="#F6E4D6" stroke-width="8"/>
    <circle cx="40" cy="40" r="${R}" fill="none" stroke="url(#rg)" stroke-width="8" stroke-linecap="round"
      stroke-dasharray="${C}" stroke-dashoffset="${C * (1 - done / total)}" transform="rotate(-90 40 40)"/>
  </svg>`;
}

function renderHome() {
  const p = P0(), c = todayChecks(), plan = todayPlan(), t = plan.target, b = bmi(p);
  const goal = GOALS.find(g => g.id === p.goal) || GOALS[0];
  const chk = CHK(), done = doneCount(c), allLen = allChecks().length;
  const q = window.__q || '';

  let html = `<div class="brandbar"><span class="wordmark">${icon('care')} 暖年</span><span>${new Date().getMonth()+1}月${new Date().getDate()}日 · 周${'日一二三四五六'[new Date().getDay()]}</span></div><div class="hero">
    <div class="hero-top">
      <div>
        <span class="eyebrow">把日子过得松快一点</span>
        <h1 class="hi">${greet()}，${escapeHTML(p.name)}</h1>
        <div class="dt">吃好一点，动一动，<br>把今天过得松快些。</div>
      </div>
      <img class="hero-photo" src="assets/photos/hero-cartoon.webp" alt="晨光下开心舒展的卡通人物" width="733" height="1100">
    </div>
  </div>
    <div class="search"><input type="search" id="q" aria-label="搜索菜谱、课程、养护知识" placeholder="搜索菜谱、课程、养护知识" value="${escapeHTML(q)}"></div>
  `;

  if (q.trim()) { $('#home-body').innerHTML = html + searchResults(q.trim()); bindSearch(); finishView($('#home-body')); return; }

  /* 功能模块小图标（搜索框下方，薄荷健康风：彩色圆角方块） */
  html += `<div class="featgrid">${MODULES.map(m => `<button class="feat" data-act="goto" data-view="${m.to}" data-tab="${m.tab}">
      <span class="feat-ic" style="background:${m.color}1a;color:${m.color}">${icon(m.ico)}</span><span class="feat-lb">${m.name}</span></button>`).join('')}</div>`;

  /* 用药记录：只记录已确认的处方，不根据“术后”自行增加补充剂。 */
  const isThy = (p.focus || []).includes('thyroid') || p.goal === 'thyroid';
  if (isThy) {
    const ms = medSchedule(), cmed = isDone(c, 'med'), ccal = isDone(c, 'calcium');
    html += `<div class="medtip">
      <div class="mt-head"><span class="mt-ico">${icon('pill')}</span><b>今日处方记录</b><span class="tag g">按医生方案</span></div>
      <div class="mt-rows">
        <div class="mt-row"><span class="mt-time">${ms.drugTime}</span><span class="mt-name">左甲状腺素（空腹服）</span>
          <button class="mt-btn ${cmed ? 'on' : ''}" data-act="medmark" data-id="med">${cmed ? '已服' : '服药'}</button></div>
        ${ms.calciumEnabled ? `<div class="mt-row"><span class="mt-time">${ms.calciumTime}</span><span class="mt-name">钙剂 / 维生素 D（按处方）</span>
          <button class="mt-btn ${ccal ? 'on' : ''}" data-act="medmark" data-id="calcium">${ccal ? '已服' : '记录'}</button></div>` : ''}
      </div>
      <div class="mt-note">固定时间用清水服药；通常早餐前 30~60 分钟。钙剂、铁剂与药间隔至少 4 小时。${ms.lowIodine ? '当前已开启医生要求的低碘期。' : '日常不默认限制碘。'}</div>
    </div>`;
  }

  /* 首页不再放“开始前状态检查”提示：需要时在「活动养护」页确认即可，减少打扰 */

  /* 今日打卡：生活打卡 + 运动活动合并展示，明细条数与进度环分母保持一致 */
  const tasks = actTasks();
  const fin = tasks.filter(t => isDone(c, t.id)).length;
  html += `<div class="card">
    <div class="progress-card">
      <div class="ringbox">${ringSVG(done, allLen)}<div class="ringnum"><b>${done}<i>/${allLen}</i></b></div></div>
      <div style="flex:1;min-width:0">
        <div class="pg-title">今日打卡</div>
        <div class="ring-sub">${done === allLen ? '今天全打卡啦，真棒！' : done ? '还差 ' + (allLen - done) + ' 项，慢慢来' : '点一下就算打卡'}</div>
      </div>
    </div>
    <div class="checks">${chk.map(x => {
    const on = isDone(c, x.id);
    const label = x.id === 'water' ? `${c.water || 0}/${p.waterGoal} 杯` : (on ? '已完成' : x.desc);
    return `<button class="chk ${on ? 'on' : ''}" data-act="chk" data-id="${x.id}">
        <span class="ci">${icon(x.ico)}</span><span class="cn">${x.name}</span><span class="cd">${label}</span></button>`;
  }).join('')}</div>
    <div class="card-h subhead"><span class="ct">今天动一动</span><span class="tag o">${fin}/${tasks.length} 已完成</span></div>
    <div class="actlist">${tasks.map(actRowHTML).join('')}</div>
    <p class="dish-hint">跟着做完会自动打卡，也可以直接点「直接打卡」。<button class="more" data-act="goact">去练习 →</button></p>
  </div>`;

  /* 今日饮食搭配 */
  html += `<div class="sec"><h2>今日饮食搭配</h2><button class="more" data-act="goto" data-view="diet" data-tab="menu">查看详情 →</button></div>
  <div class="card">
    ${[['breakfast', 'breakfast', '早餐'], ['lunch', 'lunch', '午餐'], ['dinner', 'dinner', '晚餐']].map(m => {
    const it = plan[m[0]];
    return `<div class="food"><span style="flex:none;width:28px;display:flex;align-items:center">${icon(m[1])}</span>
      <span style="flex:1;min-width:0"><b>${m[2]}</b>　${it.name}</span>
      <span class="fa">${it.kcal} 千卡</span></div>`;
  }).join('')}
    <button class="btn block sm" style="margin-top:12px" data-act="goto" data-view="diet" data-tab="menu">翻翻完整食谱与做法</button>
  </div>`;

  html += `<div class="disclaimer">${LEGAL.disclaimer}</div>`;
  $('#home-body').innerHTML = html;
  finishView($('#home-body'));
  bindSearch();
}

function bindSearch() {
  bindLiveSearch('#q', value => { window.__q = value; }, renderHome);
}

/* 输入法组词期间保留原输入节点，提交选字后再刷新结果。 */
function bindLiveSearch(selector, update, paintView) {
  const el = $(selector); if (!el) return;
  let composing = false;
  const refresh = () => {
    if (!el.isConnected) return;
    const value = el.value, start = el.selectionStart, end = el.selectionEnd;
    update(value); paintView();
    const next = $(selector);
    if (next) { next.focus({ preventScroll:true }); next.setSelectionRange(start, end); }
  };
  el.addEventListener('compositionstart', () => { composing = true; });
  el.addEventListener('compositionend', () => { composing = false; refresh(); });
  el.addEventListener('input', event => { if (!composing && !event.isComposing) refresh(); });
}

function searchResults(q) {
  const k = q.toLowerCase();
  const out = [];
  DIET.recipes.forEach(r => { if ((r.name + r.tags.join('') + r.scene).toLowerCase().includes(k)) out.push({ type: 'recipe', ico: '📖', t: r.name, d: `${r.time} · ${r.level} · ${r.tags.slice(0, 2).join('/')}`, id: r.id }); });
  EX.courses.forEach(c => { if ((c.name + c.sub + (c.tags || []).join('')).toLowerCase().includes(k)) out.push({ type: 'course', ico: '🏃', t: c.name, d: `约 ${c.minutes} 分钟 · ${(c.tags || []).slice(0, 2).join('/')}`, id: c.id }); });
  CARE.routine.forEach(r => { if ((r.name + r.points.join('')).toLowerCase().includes(k)) out.push({ type: 'routine', ico: r.icon, t: r.name, d: r.points[0], id: r.id }); });
  CARE.relax.forEach(r => { if ((r.name + r.level).toLowerCase().includes(k)) out.push({ type: 'relax', ico: r.icon, t: r.name, d: `${r.min} 分钟 · ${r.level}`, id: r.id }); });

  if (!out.length) return `<div class="card"><div class="empty"><span class="e-ico">🔍</span>没找到「${escapeHTML(q)}」<br>换个词试试，比如：肩背、番茄、散步</div></div>`;
  return `<div class="sec"><h2>搜索结果 ${out.length}</h2></div><div class="list">${out.map(o => `<div class="item" data-act="open${o.type}" data-id="${o.id}">
    <span class="ico">${o.ico}</span><span class="txt"><span class="t1">${o.t}</span><br><span class="t2">${o.d}</span></span><span class="arw">›</span></div>`).join('')}</div>`;
}

/* ================= 饮食页 ================= */
let dietTab = 'menu', recipeFilter = '全部', recipeOpen = null, recipeQuery = '', recipeCat = '全部';
const RECIPE_CATS = [['全部', '全部'], ['家常菜肴', '菜肴'], ['中式面点', '中式面点'], ['西式面点', '西式面点']];
/* 菜谱归类：新版数据自带 cat，旧数据按性质推断 */
function recipeCatOf(r) {
  if (r.cat) return r.cat;
  if (/面|饼|馒头|包子|饺子|馄饨|汤圆|发糕/.test(r.name)) return '中式面点';
  return '菜肴';
}
function mealCards(plan, target, editable) {
  return [['breakfast', 'breakfast', '早餐', '7:00~8:30'], ['lunch', 'lunch', '午餐', '11:30~12:30'], ['dinner', 'dinner', '晚餐', '18:00~19:00'], ['snack', 'snack', '加餐', '上午或下午']].map(g => {
    const it = plan[g[0]];
    const conflicts = mealConflicts(it, g[0]);
    return `<div class="meal">
      <div class="meal-h"><span class="mi">${icon(g[1])}</span><span class="mn">${g[2]}</span>
        <span class="mt">${g[3]} · ${it.unavailable ? '需要人工确认' : it.kcal + ' 千卡'}${it.override ? ' · 已应用菜谱' : ''}</span></div>
      <div class="meal-b">
        <div class="dishlist">${(it.foods || []).map(f => `<div class="dish">
          <button class="dish-h" data-act="dish" aria-expanded="false"><span class="dn">${f[0]}</span><span class="fa">${f[1]}</span><span class="arw">›</span></button>
          <div class="dish-b" hidden>${dishStepHTML(f[0], f[1])}</div>
        </div>`).join('')}</div>
        ${it.unavailable ? '' : '<p class="dish-hint">点菜名就能看做法和演示视频。</p>'}
        <div class="meal-tip ${it.unavailable ? 'meal-unavailable' : ''}"><b>${it.unavailable ? '未生成推荐：' : '搭配说明：'}</b>${it.override ? it.tip : it.unavailable ? it.tip : '本餐估算约 ' + it.kcal + ' 千卡、蛋白质 ' + it.pro + ' 克；' + it.tip}</div>
        ${conflicts.length ? `<div class="meal-cf"><span class="cf-warn"><span class="cf-ico">${icon('shield')}</span>需要留意</span>${conflicts.map(c => `<div class="cf-line"><b>${c.label}：</b>${c.warn}</div>`).join('')}</div>` : ''}
        ${editable ? `<div class="meal-act">
          <button class="btn ghost sm" data-act="swap" data-m="${g[0]}">换一换</button>
          <button class="btn sm" data-act="eat" data-m="${g[0]}" ${it.unavailable ? 'disabled' : ''}>打卡</button>
        </div>` : ''}
      </div></div>`;
  }).join('');
}
function renderDiet() {
  let html = pageHeading('好好吃饭', '今天想吃点什么？') + `<div class="seg">
    <button class="${dietTab === 'menu' ? 'on' : ''}" data-act="dtab" data-t="menu">今日三餐</button>
    <button class="${dietTab === 'tmrw' ? 'on' : ''}" data-act="dtab" data-t="tmrw">明日推荐</button>
    <button class="${dietTab === 'recipe' ? 'on' : ''}" data-act="dtab" data-t="recipe">家常菜谱</button>
  </div>`;

  if (dietTab === 'menu') {
    const plan = todayPlan(), t = plan.target, p = P0(), c = todayChecks();
    html += `<div class="card">
      <div class="card-h"><span class="ct">今天的大致搭配</span><span class="tag o">${(GOALS.find(g => g.id === p.goal) || {}).name}</span></div>
      <div class="macro">
        <div class="mc"><b>${t.kcal}</b><span>千卡</span></div>
        <div class="mc"><b>${t.protein}</b><span>克蛋白质</span></div>
        <div class="mc"><b>${t.carb}</b><span>克碳水</span></div>
        <div class="mc"><b>${t.fat}</b><span>克脂肪</span></div>
      </div>
      <div class="note" style="margin-top:10px">这些数字是按你的身高体重估的日常参考，不是营养处方，看看就好。${DIET.goalNotes[p.goal] || ''}</div>
    </div>`;

    html += mealCards(plan, t, true);

    /* 甲状腺术后：服药与饮食间隔指南（避免冲突） */
    if (isThyContext()) {
      html += `<div class="card medguide">
        <div class="card-h"><span class="ct"><span class="ct-ico">${icon('pill')}</span>服药与饮食间隔</span><span class="tag o">避免冲突</span></div>
        <ul class="mg-list">
          <li>按处方固定时间、用清水服药；通常空腹服，早餐前 <b>30~60 分钟</b>。</li>
          <li>钙剂、铁剂与左甲状腺素间隔 <b>至少 4 小时</b>。</li>
          <li>不要用咖啡、牛奶或豆浆送服；早餐含奶豆时保持稳定间隔。</li>
          <li>${medSchedule().lowIodine ? '当前处于医生要求的低碘期，限制海带、紫菜、虾皮等高碘食物。' : '日常不因甲状腺手术自动低碘；只有医生为指定检查或放射性碘治疗明确要求时才开启低碘期。'}</li>
          <li>服法或复查指标有变化时，以医生、药师的新要求为准。</li>
        </ul>
      </div>`;
    }

    html += `<div class="card">
      <div class="card-h"><span class="ct">换着吃，不单调</span><span class="tag o">每天自动更新</span></div>
      <p class="h-sub">已按你的资料和忌口提供今日搭配参考，每天自动轮换；觉得不合适可点「换一换」。这不是个体化营养处方。忌口全局生效（当前：${(p.avoids || []).length ? p.avoids.map(a => (AVOIDS.find(x => x.id === a) || {}).name).join('、') : '无'}）。</p>
    </div>`;
  }

  if (dietTab === 'tmrw') {
    const tp = tomorrowPlan(), tt = tp.target;
    const tShop = buildShop(tp), shopDone = (S.shop[nextDayKey()] || []);
    const shopIdx = tShop.map((s, i) => Object.assign({ _i: i }, s));
    const MEALS = [['breakfast', '早餐'], ['lunch', '午餐'], ['dinner', '晚餐'], ['snack', '加餐']];

    html += `<div class="card">
      <div class="card-h"><span class="ct">${nextDayLabel()} · 明日三餐</span><span class="tag o">提前备菜</span></div>
      <div class="macro">
        <div class="mc"><b>${tt.kcal}</b><span>千卡</span></div>
        <div class="mc"><b>${tt.protein}</b><span>克蛋白质</span></div>
        <div class="mc"><b>${tt.carb}</b><span>克碳水</span></div>
        <div class="mc"><b>${tt.fat}</b><span>克脂肪</span></div>
      </div>
      <div class="note" style="margin-top:10px">照清单备好食材，明早就省事；想吃别的就逐餐「换一换」。</div>
    </div>`;

    /* 采购清单（上方，按餐分组、可换、可确认） */
    html += `<div class="card">
      <div class="card-h"><span class="ct">🛒 明日采购清单</span><span class="tag g" id="shopcnt">${shopDone.length}/${tShop.length}</span></div>
      <p class="h-sub" style="margin:0 0 10px">已按明日菜式展开成食材；点一下划掉已买的，想换菜就点「换一换」。</p>
      ${MEALS.map(([mk, nm]) => {
        const items = shopIdx.filter(s => s.meal.endsWith(nm));
        if (!items.length) return '';
        return `<div class="shp-group">
          <div class="shp-ghead"><span class="shp-gl">${icon(mk)} ${nm}</span>
            <button class="btn ghost xs" data-act="tmswap" data-m="${mk}">换一换</button></div>
          <div class="shoplist">${items.map(s => `<button class="shopitem ${shopDone.includes(s._i) ? 'done' : ''}" data-act="shoptick" data-i="${s._i}">
            <span class="box">${shopDone.includes(s._i) ? '✓' : ''}</span>
            <span class="si"><b>${s.name}</b> <span class="samt">${s.amt}</span></span></button>`).join('')}</div>
        </div>`;
      }).join('')}
      <button class="btn block sm confirmshop-btn" data-act="confirmshop" style="margin-top:14px">✓ 确认备菜（明早自动呈现菜品搭配与做法）</button>
    </div>`;

    /* 可做的菜式（下方）：只列菜名，做法到菜谱里看 */
    html += `<div class="card">
      <div class="card-h"><span class="ct">🍳 明日可做的菜式</span><span class="tag o">做法见菜谱</span></div>
      <p class="h-sub" style="margin:0 0 10px">明天要做的菜都在这儿，点一下跳去菜谱看做法。</p>
      ${MEALS.map(([mk, nm]) => {
        const it = tp[mk] || {}, foods = it.foods || [];
        if (!foods.length) return '';
        return `<div class="shp-group">
          <div class="shp-ghead"><span class="shp-gl">${icon(mk)} ${nm}</span></div>
          <div class="picklist">${foods.map(f => {
            const r = dishRecipeOf(f[0]);
            const attr = r
              ? `data-act="openrecipe" data-id="${r.id}"`
              : `data-act="dishfind" data-q="${escAttr(dishSearchKey(f[0]))}"`;
            return `<button class="pickitem has" ${attr}><span class="pi-n">${f[0]}</span><span class="pi-m">${f[1]}</span><span class="pi-a">›</span></button>`;
          }).join('')}</div>
        </div>`;
      }).join('')}
      <button class="btn ghost block sm" data-act="dtab" data-t="recipe" style="margin-top:6px">去「家常菜谱」看全部做法 ›</button>
    </div>`;
  }

  if (dietTab === 'recipe') {
    html += `<div class="photo-banner"><img src="assets/photos/table.jpg" alt="木桌上的新鲜蔬菜" width="1000" height="737"><div><span class="eyebrow">厨房里的小日常</span><h2>认真做一餐<br>平常的好味道</h2></div></div>`;
    /* 大类：家常菜肴 / 中式面点 / 西式面点 */
    const catCount = c => c === '全部' ? DIET.recipes.length : DIET.recipes.filter(r => recipeCatOf(r) === c).length;
    html += `<div class="chips catseg">${RECIPE_CATS.map(([label, val]) =>
      `<button class="chip ${recipeCat === val ? 'on' : ''}" data-act="rcat" data-t="${val}">${label} ${catCount(val)}</button>`).join('')}</div>`;
    const inCat = DIET.recipes.filter(r => recipeCat === '全部' || recipeCatOf(r) === recipeCat);
    const tags = ['全部']; const set = {};
    inCat.forEach(r => r.tags.forEach(t => set[t] = 1));
    Object.keys(set).slice(0, 8).forEach(t => tags.push(t));
    html += `<div class="search sm" style="margin-bottom:10px"><input type="search" id="recipe-q" aria-label="搜索家常菜谱" placeholder="搜索菜谱：番茄 / 减脂 / 馒头…" value="${escapeHTML(recipeQuery)}"></div>`;
    html += `<div class="chips">${tags.map(t => `<button class="chip ${recipeFilter === t ? 'on' : ''}" data-act="rtag" data-t="${t}">${t}</button>`).join('')}</div>`;
    const q = recipeQuery.trim().toLowerCase();
    const list = inCat.filter(r => (recipeFilter === '全部' || r.tags.includes(recipeFilter)) && (!q || (r.name + r.tags.join('') + r.scene + (r.kw || '')).toLowerCase().includes(q)));
    if (!list.length) html += `<div class="card"><div class="empty"><span class="e-ico">🔍</span>没找到「${escapeHTML(recipeQuery)}」，换个词，或切回「全部」看看</div></div>`;
    html += list.map(r => {
      const open = recipeOpen === r.id;
      const fav = (S.favs.recipe || []).includes(r.id);
      const vinfo = videoInfo(r.kw || r.name);
      return `<div class="acc ${open ? 'open' : ''}" data-acc>
        <button class="acc-h"><span class="aico">${recipeCatOf(r) === '菜肴' ? '🍽️' : recipeCatOf(r) === '中式面点' ? '🥟' : '🍞'}</span>
          <span style="flex:1;min-width:0"><span style="display:block">${r.name}</span>
          <span style="font-weight:400;font-size:.82rem;color:var(--ink3)">${r.time} · ${r.level} · ${r.kcal} 千卡</span></span>
          <span class="arw">›</span></button>
        <div class="acc-b">
          <div class="tags" style="margin-bottom:8px">${r.tags.map(t => `<span class="tag g">${t}</span>`).join(' ')}</div>
          <p><b>食材：</b>${r.ing.map(i => `${i[0]} ${i[1]}`).join('、')}</p>
          <p><b>做法：</b></p>${r.steps.map((s, i) => `<p>${i + 1}) ${s}</p>`).join('')}
          <p style="color:var(--brand)"><b>小贴士：</b>${r.tips}</p>
          ${cookingVideoHTML(r.name, vinfo)}
          <div class="vact">
            <button class="btn ghost sm" data-act="fav" data-type="recipe" data-id="${r.id}">${fav ? '★ 已收藏' : '☆ 收藏'}</button>
          </div>
          <div class="note" style="margin-top:10px">${recipeCatOf(r) === '菜肴'
        ? '这是一道菜的做法参考，不能单独替代完整一餐。搭配时仍需包含适量主食、蛋白质和蔬菜。'
        : '面点属于主食，精制碳水含量较高。一次吃一个拳头大小的量，并搭配蛋白质和蔬菜，血糖更平稳。'}</div>
        </div></div>`;
    }).join('');
    html += `<div class="note">菜谱用于家庭烹饪参考，不按单道菜热量替代整餐。中式面点包含馒头、包子、饺子、饼类等家常主食；西式面点为常见的面包、司康、玛芬等家常做法。展开做法后可直接观看第三方烹饪视频，需要联网。</div>`;
  }
  $('#diet-body').innerHTML = html;
  finishView($('#diet-body'));
  bindAcc();
  bindRecipeSearch();
}

function bindRecipeSearch() {
  bindLiveSearch('#recipe-q', value => { recipeQuery = value; }, renderDiet);
}

/* ================= 活动养护页（活动 + 养护合并） ================= */
let moveTab = 'course', exCat = 'all';

/* 今日三项：与首页进度环、首页打卡双向联动 */
function actTasks() {
  const f = P0().focus || [];
  const list = [];
  if (f.includes('neck')) list.push({ id: 'neck', ico: 'neck', name: '肩背放松', desc: '无头晕时做 5 分钟', act: 'start', cid: 'neck' });
  if (f.includes('leg')) list.push({ id: 'leg', ico: 'leg', name: '腿部活动', desc: '无突发肿痛时做 10 分钟', act: 'start', cid: 'leg' });
  list.push({ id: 'walk', ico: 'walk', name: '短时走动', desc: '平地慢走，按耐受分次完成', act: 'walkstart', cid: 'walk' });
  return list;
}

/* 一行今日活动：已完成 / 开始 + 直接打卡 */
function actRowHTML(t) {
  const c = todayChecks(), done = isDone(c, t.id);
  return `<div class="actrow ${done ? 'done' : ''}">
    <span class="ri">${icon(t.ico)}</span>
    <span class="rx"><span class="rn">${t.name}</span><span class="rr">${t.desc}</span></span>
    <span class="actbtns">
      ${done
    ? `<span class="tag g">已完成</span><button class="btn ghost xs" data-act="chk" data-id="${t.id}">撤销</button>`
    : `<button class="btn sm" data-act="${t.act}" data-id="${t.cid}">开始</button><button class="btn ghost xs" data-act="chk" data-id="${t.id}">直接打卡</button>`}
    </span></div>`;
}

const MOVE_TABS = [['course', '课程'], ['video', '跟练视频'], ['routine', '作息'], ['safe', '安全须知']];

function fitCollectionCard(col) {
  return `<section class="fitcol" data-fit-collection="${escAttr(col.id)}">
    <div class="fitcol-h"><span class="fitava">${icon('video')}</span><span class="fitcol-x"><span class="fitcol-n">${escAttr(col.name)}</span><span class="fitcol-t">${escAttr(col.tag)} · 原分类</span></span><span class="tag g">${col.videos.length} 段可播放</span></div>
    <p class="fitcol-d">${escAttr(col.desc)}</p>
    <div class="fitlist">${col.videos.map(v => fitVideoCard({
      ...v, original: true, name: v.title, title: v.sourceTitle,
      desc: v.matchNote, format: '完整视频 · 页面内播放',
      caution: v.level === '进阶' ? '这是高强度训练，不因无跳跃就适合当前身体情况。请先看示范，经专业人员确认适用后再跟练；不追求跟满全程。'
        : '原有名称和分类不代表个体适用性。颈肩、腿部不适或反复眩晕时，先由专业人员确认动作是否适合；观看不等于需要跟练。'
    }, false)).join('')}</div>
  </section>`;
}

function fitVideoCard(v, first) {
  const duration = Math.floor(v.duration / 60) + ':' + String(v.duration % 60).padStart(2, '0');
  const highRisk = v.level === '进阶' || /瑜伽|高低肩|直角肩|瘦小腿|下半身体态|沙漏腰/.test(`${v.name || ''}${v.focus || ''}`);
  const lvlClass = v.level === '进阶' ? 'r' : v.level === '适中' ? 'o' : 'g';
  const lvlText = v.level === '进阶' ? '高强度' : v.level === '适中' ? '中强度' : '低强度';
  const lvlBadge = `<span class="tag ${lvlClass}" style="margin-left:4px">${lvlText}</span>`;
  return `<section class="acc fit-video-card ${first ? 'open' : ''}" data-acc data-fit-id="${escAttr(v.id)}" ${v.original ? 'data-restored-fit' : ''}>
    <button class="acc-h"><span class="aico">${icon('play')}</span><span style="flex:1;min-width:0">${escAttr(v.name)}${lvlBadge}${highRisk ? ' <span class="tag r">强度偏高·先问医生</span>' : ''}<span class="fit-meta">${escAttr(v.focus)} · 全片 ${duration}${v.original ? ` · 原标注 ${v.minutes} 分钟` : ''}</span></span><span class="arw">›</span></button>
    <div class="acc-b">
      <p>${escAttr(v.desc)}</p>
      <p class="fit-caution"><b>跟练前：</b>${escAttr(v.caution)}</p>
      <div class="video-heading"><b>${escAttr(v.format)}</b><span>默认不自动播放</span></div>
      <div class="video-stage" data-player-src="https://player.bilibili.com/player.html?bvid=${v.bv}&page=1&autoplay=0&danmaku=0" data-player-title="${escAttr(v.name)}" data-fit-risk="${highRisk ? 'high' : 'standard'}">
        <button class="video-load" data-act="loadfit">${highRisk ? '加载跟练视频（强度偏高）' : '加载跟练视频'}<span>在本页播放，需要联网；加载后会连接哔哩哔哩</span></button>
      </div>
      <div class="fit-player-actions"><button class="btn ghost sm" data-act="stopfit">停止并收起</button><button class="btn ghost sm" data-act="retryfit">重新加载</button></div>
      <p class="video-note">来源：哔哩哔哩 · 上传者 ${escAttr(v.up)}<br>原片：${escAttr(v.title)}</p>
      <p class="video-note">可在播放器中暂停或全屏，无需跟满全片，也不会自动记为完成。加载失败可在本页重试；源平台可能限制清晰度或要求登录。</p>
    </div>
  </section>`;
}

function renderMove() {
  let html = pageHeading('动一动，心情也亮起来', '挑一项顺眼的开始，累了就停。') + `<div class="chips mtab">${MOVE_TABS.map(([id, nm]) =>
    `<button class="chip ${moveTab === id ? 'on' : ''}" data-act="movetab" data-t="${id}">${nm}</button>`).join('')}</div>`;

  if (moveTab === 'course' || moveTab === 'video') {
    html += healthStatusHTML();
    if (P0().movementLimits) html += `<div class="profile-limit"><b>需要留意的动作</b><p>${escapeHTML(P0().movementLimits)}</p></div>`;
  }

  /* ---------- 课程（养护课程） ---------- */
  if (moveTab === 'course') {
    html += `<div class="chips">${EX.cats.map(c => `<button class="chip ${exCat === c.id ? 'on' : ''}" data-act="ecat" data-c="${c.id}">${c.name}</button>`).join('')}</div>`;
    html += EX.courses.filter(c => exCat === 'all' || c.cat === exCat).map(courseCard).join('');
  }

  /* ---------- 跟练视频：具体来源、页面内嵌、按需加载 ---------- */
  if (moveTab === 'video') {
    html += `<div class="card">
      <div class="card-h"><span class="ct">${icon('video')} 跟练视频合集</span><span class="tag o">全部页面内播放</span></div>
      <p class="h-sub" style="margin:0">按博主整理好了，展开任一条就能在本页播放，不用跳出去搜。先看示范，请专业人员确认后再跟练。</p>
      <p class="fit-caution"><b>今天不舒服，先不练。</b>有头晕、视物异常、走路不稳，或单侧腿突然肿痛、发热时，不要跟练并及时就医；伴胸痛、呼吸困难时立即呼叫 120。</p>
    </div>`;
    html += (typeof FIT_COLLECTIONS !== 'undefined' ? FIT_COLLECTIONS : []).map(fitCollectionCard).join('');
    html += `<h2 class="fit-extra-heading">补充：可在本页播放</h2>`;
    html += (typeof FIT_VIDEOS !== 'undefined' ? FIT_VIDEOS : []).map(v => fitVideoCard(v, false)).join('');
    html += `<div class="note">原有条目均已保留；涉及颈部转动、后仰、抗阻或高强度的内容，需先由专业人员判断是否适用，不因"护膝""低冲击"等标题自行判断。课程页图文动作与视频库独立，不作一一配套。视频强度以标签标明（低/中/高），高强度仅作提示、不限制播放，是否跟练请结合自身情况。</div>`;
  }

  /* ---------- 作息 ---------- */
  if (moveTab === 'routine') {
    html += CARE.routine.map(r => `<div class="card">
      <div class="pg-title" style="margin-bottom:8px">${r.icon} ${r.name}</div>
      <div class="list">${r.points.map(p => `<div class="item" style="padding:8px 0"><span class="ico" style="color:var(--brand)">•</span><span class="txt"><span class="t2" style="color:var(--ink);font-size:.95rem">${p}</span></span></div>`).join('')}</div>
    </div>`).join('');
  }

  /* ---------- 安全须知 ---------- */
  if (moveTab === 'safe') {
    ['neck', 'leg'].forEach(k => {
      const s = EX.safety[k];
      html += `<div class="card">
        <div class="pg-title" style="margin-bottom:10px">${s.title}</div>
        <div class="list">${s.bans.map(b => `<div class="item" style="padding:9px 0"><span class="ico">${icon('warning')}</span>
          <span class="txt"><span class="t1" style="color:var(--warn)">${b[1]}</span><br><span class="t2">${b[2]}</span></span></div>`).join('')}</div>
      </div>
      <div class="card">
        <div class="pg-title" style="margin-bottom:8px">✓ 要这样做</div>
        <div class="list">${s.rules.map(r => `<div class="item" style="padding:8px 0"><span class="ico" style="color:var(--green)">✓</span><span class="txt"><span class="t2" style="color:var(--ink);font-size:.95rem">${r}</span></span></div>`).join('')}</div>
      </div>
      <div class="card">
        <div class="pg-title" style="margin-bottom:8px">⚠️ 出现这些，马上停止</div>
        <div style="display:flex;flex-wrap:wrap;gap:8px;margin-bottom:12px">${s.stop.map(x => `<span class="tag r" style="font-size:.86rem;padding:6px 12px">${x}</span>`).join('')}</div>
        <div class="alert" style="margin:0"><div class="at">怎么办</div><div class="ac">${s.emergency}</div></div>
      </div>`;
    });
  }

  html += `<div class="disclaimer">本页内容为生活养护建议，不涉及疾病诊断与治疗。</div>`;
  $('#move-body').innerHTML = html;
  finishView($('#move-body'));
  bindAcc();
}

/* 兼容旧入口：锻炼页 / 养护页的渲染统一走上面 */
function renderExercise() { renderMove(); }
function renderCare() { renderMove(); }

/* ================= 课程卡片 ================= */
const COURSE_PHOTO = { neck: 'chair', leg: 'walk', whole: 'walk', morning: 'window-light', aftermeal: 'table', posture: 'chair', activate: 'walk', balance: 'walk', office: 'chair', waistback: 'chair', knee: 'chair', sleep: 'window-light', strength: 'chair', kneecare: 'chair', sitrelax: 'chair', breathe: 'window-light', balancecare: 'walk', nightstretch: 'window-light' };
function courseCard(cs) {
  const done = (S.logs || []).some(l => l.d === today() && l.t === cs.id);
  const needsApproval = ['whole','activate','strength','balance'].includes(cs.id);
  const art = { neck: 'shoulderSqueeze', leg: 'anklePump', whole: 'raiseArms', morning: 'march', aftermeal: 'breath', posture: 'shoulderSqueeze', activate: 'march' }[cs.id] || 'raiseArms';
  const fav = (S.favs.course || []).includes(cs.id);
  const photo = COURSE_PHOTO[cs.id] || 'walk';
  return `<div class="course-card">
    <div class="course-art ${cs.cls}">
      <span class="badge">${cs.minutes} 分钟</span>
      <button class="fav ${fav ? 'is-saved' : ''}" aria-label="${fav ? '取消收藏' : '收藏'}${cs.name}" aria-pressed="${fav}" data-act="fav" data-type="course" data-id="${cs.id}">${icon('bookmark')}</button>
      <img class="course-photo" src="assets/photos/${photo}.jpg" alt="${cs.name} 生活场景封面" width="1000" height="667" loading="lazy">
      <span class="dyn-badge">${cs.items.length} 个动作 · 图文引导</span>
    </div>
    <div class="course-body">
      <h3>${cs.name}</h3>
      <p>${cs.sub}</p>
      <div class="tags" style="margin:8px 0 0">${(cs.tags || []).map(t => `<span class="tag gray">${t}</span>`).join('')}${needsApproval ? ' <span class="tag o">先问医生</span>' : ''}${done ? ' <span class="tag g">今天已完成</span>' : ''}</div>
      <div class="course-foot">
        <button class="btn ${done ? 'ghost' : ''} sm" data-act="start" data-id="${cs.id}" data-needs-approval="${needsApproval}">${needsApproval && !P0().exerciseApproved ? '先问医生再练' : done ? '再来一次' : '开始练习'}</button>
        <span class="tag gray">累了就停</span>
      </div>
    </div>
  </div>`;
}

/* ================= 我的 ================= */
let meTab = 'plan';
function renderMe() {
  const sy = window.scrollY;
  collectForm();
  const p = P0(), b = bmi(p), t = calcTarget(p);
  let html = pageHeading('我的小日子', '每一点小坚持，都算数。') + `<div class="seg">
    <button class="${meTab === 'plan' ? 'on' : ''}" data-act="mtab" data-t="plan">我的</button>
    <button class="${meTab === 'fav' ? 'on' : ''}" data-act="mtab" data-t="fav">收藏</button>
    <button class="${meTab === 'record' ? 'on' : ''}" data-act="mtab" data-t="record">打卡</button>
    <button class="${meTab === 'legal' ? 'on' : ''}" data-act="mtab" data-t="legal">协议</button>
  </div>`;

  if (meTab === 'plan') {
    html += `<div class="card">
      <div class="profile-intro"><div class="avatar">${escapeHTML((p.name || '朋')[0])}</div><div><h2>${escapeHTML(p.name)}</h2><p>你的专属养护档案</p></div><button class="btn ghost sm" data-act="editp">${editingProfile ? '正在编辑' : '编辑'}</button></div>
      <div class="kv"><span class="k">称呼</span><span class="v">${escapeHTML(p.name)}</span></div>
      <div class="kv"><span class="k">性别 / 年龄</span><span class="v">${p.sex === 'f' ? '女' : '男'} · ${p.age} 岁</span></div>
      <div class="kv"><span class="k">身高 / 体重</span><span class="v">${p.height} cm · ${p.weight} kg</span></div>
      <div class="kv"><span class="k">BMI</span><span class="v">${b.v}（${b.label}）</span></div>
      <div class="kv"><span class="k">健康目标</span><span class="v">${(GOALS.find(g => g.id === p.goal) || {}).name}</span></div>
      <div class="kv"><span class="k">每日估算参考</span><span class="v">${t.kcal} 千卡 · ${t.protein}g 蛋白</span></div>
      <div class="kv"><span class="k">日常活动量</span><span class="v">${(ACTIVITY.find(a => +a.v === +p.act) || ACTIVITY[0]).name}</span></div>
      <div class="kv"><span class="k">忌口</span><span class="v">${(p.avoids || []).length ? p.avoids.map(a => (AVOIDS.find(x => x.id === a) || {}).name).join('、') : '无'}</span></div>
      <div class="kv"><span class="k">健康关注</span><span class="v">${(p.focus || []).map(f => (FOCUS.find(x => x.id === f) || {}).name).join('、') || '无'}</span></div>
      <div class="kv"><span class="k">甲状腺手术</span><span class="v">${escapeHTML(p.thyroidSurgery)}</span></div>
      <div class="kv"><span class="k">运动相关情况</span><span class="v">${p.vertigoHistory ? '有眩晕史' : '未记录眩晕史'} · ${p.chronicLegPain ? '长期腿痛' : '未记录长期腿痛'}</span></div>
      <div class="kv"><span class="k">居家活动</span><span class="v">${p.exerciseApproved ? '医生/康复师已确认' : '还没问过医生'}</span></div>
      <div class="kv kv-block"><span class="k">动作限制</span><span class="v">${escapeHTML(p.movementLimits || '未填写')}</span></div>
    </div>`;

    if (editingProfile) {
      html += `<div class="card">
        <div class="pg-title" style="margin-bottom:10px">编辑档案</div>
        <div class="field"><span class="fl">称呼</span><input type="text" id="e-name" value="${escAttr(p.name)}" maxlength="12"></div>
        <div class="field"><span class="fl">性别</span><div class="seg" style="width:150px">
          <button class="${p.sex === 'f' ? 'on' : ''}" data-act="setsex" data-v="f">女</button>
          <button class="${p.sex === 'm' ? 'on' : ''}" data-act="setsex" data-v="m">男</button></div></div>
        <div class="field"><span class="fl">年龄</span><input type="number" id="e-age" value="${p.age}" min="12" max="95"></div>
        <div class="field"><span class="fl">身高 cm</span><input type="number" id="e-h" value="${p.height}" min="130" max="220"></div>
        <div class="field"><span class="fl">体重 kg</span><input type="number" id="e-w" value="${p.weight}" min="30" max="200"></div>
        <div class="field"><span class="fl">甲状腺手术情况<span class="fh">按病历填写，不确定可保留“范围待确认”</span></span><select id="e-thyroid"><option ${p.thyroidSurgery === '全切' ? 'selected' : ''}>全切</option><option ${p.thyroidSurgery === '部分切除' ? 'selected' : ''}>部分切除</option><option ${p.thyroidSurgery === '已切除（范围待确认）' ? 'selected' : ''}>已切除（范围待确认）</option></select></div>
        <div class="field"><span class="fl">有反复眩晕史<span class="fh">用于加强活动前提示</span></span><button class="switch ${p.vertigoHistory ? 'on' : ''}" data-act="toggleprofile" data-k="vertigoHistory" aria-label="有反复眩晕史"></button></div>
        <div class="field"><span class="fl">长期腿痛 / 静脉不适<span class="fh">用于加强腿部警示</span></span><button class="switch ${p.chronicLegPain ? 'on' : ''}" data-act="toggleprofile" data-k="chronicLegPain" aria-label="长期腿痛或静脉不适"></button></div>
        <div class="field"><span class="fl">专业人员已确认常规居家运动<span class="fh">只有医生或康复师明确确认后开启</span></span><button class="switch ${p.exerciseApproved ? 'on' : ''}" data-act="toggleprofile" data-k="exerciseApproved" aria-label="专业人员已确认常规居家运动"></button></div>
        <label class="field field-stack"><span class="fl">动作限制<span class="fh">写下医生或康复师明确要求避免的动作</span></span><textarea id="e-limits" rows="3" maxlength="300">${escapeHTML(p.movementLimits || '')}</textarea></label>
        <label class="field field-stack"><span class="fl">医生 / 康复师备注<span class="fh">可填写复查要求、弹力袜方案等；不要写证件号</span></span><textarea id="e-clinician" rows="3" maxlength="500">${escapeHTML(p.clinicianNote || '')}</textarea></label>
        <div class="pg-title" style="margin:12px 0 6px">日常活动量</div>
        <div class="chips">${ACTIVITY.map(a => `<button class="chip ${+p.act === +a.v ? 'on' : ''}" data-act="setact" data-v="${a.v}">${a.name}</button>`).join('')}</div>
        <div class="pg-title" style="margin:12px 0 6px">健康目标</div>
        <div class="chips">${GOALS.map(g => `<button class="chip ${p.goal === g.id ? 'on' : ''}" data-act="setgoal" data-v="${g.id}"><span class="chip-ic">${icon(g.ico)}</span>${g.name}</button>`).join('')}</div>
        <div class="pg-title" style="margin:12px 0 6px">忌口</div>
        <div class="chips">${AVOIDS.map(a => `<button class="chip ${(p.avoids || []).includes(a.id) ? 'on' : ''}" data-act="toggleavoid" data-v="${a.id}">${a.ico} ${a.name}</button>`).join('')}</div>
        <div class="pg-title" style="margin:12px 0 6px">健康关注（决定给你推荐什么）</div>
        <div class="chips">${FOCUS.map(f => `<button class="chip ${(p.focus || []).includes(f.id) ? 'on' : ''}" data-act="togglefocus" data-v="${f.id}"><span class="chip-ic">${icon(f.ico)}</span>${f.name}</button>`).join('')}</div>
        <button class="btn block" style="margin-top:14px" data-act="savep">保存档案</button>
      </div>`;
    }

    html += `<div class="card">
      <div class="pg-title" style="margin-bottom:8px">显示与记录设置</div>
      <div class="field"><span class="fl">字号<span class="fh">看不清可调大</span></span>
        <div class="seg" style="width:170px">
          <button class="${S.settings.font === 0 ? 'on' : ''}" data-act="font" data-v="0">标准</button>
          <button class="${S.settings.font === 1 ? 'on' : ''}" data-act="font" data-v="1">大</button>
          <button class="${S.settings.font === 2 ? 'on' : ''}" data-act="font" data-v="2">特大</button></div></div>
      <div class="field"><span class="fl">语音提示<span class="fh">跟练时播报动作</span></span>
        <button class="switch ${S.settings.voice ? 'on' : ''}" data-act="toggle" data-k="voice"></button></div>
      <div class="field"><span class="fl">每日喝水杯数</span><input type="number" id="e-water" value="${p.waterGoal}" min="4" max="12"></div>
    </div>`;

    /* 用药设置：只开启医生已经确认的项目。 */
    if (isThyContext()) {
      const ms = medSchedule();
      html += `<div class="card">
        <div class="pg-title" style="margin-bottom:8px"><span class="ct-ico">${icon('pill')}</span> 医生确认的方案</div>
        <div class="field"><span class="fl">左甲状腺素<span class="fh">按处方；通常早餐前 30~60 分钟</span></span>
          <input type="time" id="e-meddrug" value="${ms.drugTime}"></div>
        <div class="field"><span class="fl">医生已开具钙剂 / 维 D<span class="fh">未开具时不要自行开启</span></span>
          <button class="switch ${ms.calciumEnabled ? 'on' : ''}" data-act="togglecalcium" aria-label="医生已开具钙剂或维生素D"></button></div>
        ${ms.calciumEnabled ? `<div class="field"><span class="fl">钙剂 / 维 D 时间<span class="fh">与左甲状腺素间隔至少 4 小时</span></span>
          <input type="time" id="e-medcal" value="${ms.calciumTime}"></div>` : ''}
        <div class="field"><span class="fl">医生当前要求低碘<span class="fh">仅用于指定检查或放射性碘治疗准备期</span></span>
          <button class="switch ${ms.lowIodine ? 'on' : ''}" data-act="toggleiodine" aria-label="医生当前要求低碘饮食"></button></div>
        <p class="h-sub" style="margin:2px 0 0">这里只记录已经确认的方案；剂量和停药问题请联系医生或药师。</p>
      </div>`;
    }
    html += `<div class="card data-card">
      <div class="pg-title">数据备份与更新</div>
      <p class="h-sub">档案、打卡、收藏和每日状态保存在当前浏览器。可导出 JSON 备份，也可导入暖年备份继续使用。</p>
      <div class="data-actions"><button class="btn sm" data-act="exportdata">导出数据备份</button><button class="btn ghost sm" data-act="chooseimport">导入数据更新</button></div>
      <input class="visually-hidden" type="file" id="data-import" accept="application/json,.json">
      <div class="data-actions" style="margin-top:10px;align-items:center">
        <span class="ver-line">当前版本 <b id="ver-no">${escapeHTML(currentBuild())}</b></span>
        <button class="btn ghost sm" data-act="checkupdate">检查更新</button>
      </div>
      <p class="data-meta">数据格式 v${APP_DATA_VERSION}${S.dataMeta.lastImportedAt ? ' · 最近导入 ' + new Date(S.dataMeta.lastImportedAt).toLocaleString('zh-CN') : ''}</p>
    </div>`;
    html += `<button class="btn ghost block" data-act="reset">清空全部数据</button>`;
  }

  if (meTab === 'fav') {
    const fr = (S.favs.recipe || []).map(id => DIET.recipes.find(r => r.id === id)).filter(Boolean);
    const fc = (S.favs.course || []).map(id => EX.courses.find(c => c.id === id)).filter(Boolean);
    html += `<div class="sec"><h2>收藏的菜谱 ${fr.length}</h2></div>`;
    html += fr.length ? fr.map(r => `<div class="item" data-act="openrecipe" data-id="${r.id}"><span class="ico">📖</span>
      <span class="txt"><span class="t1">${r.name}</span><br><span class="t2">${r.time} · ${r.kcal} 千卡</span></span>
      <button class="btn ghost sm" data-act="fav" data-type="recipe" data-id="${r.id}">取消</button></div>`).join('')
      : `<div class="card"><div class="empty"><span class="e-ico">📖</span>还没有收藏菜谱</div></div>`;
    html += `<div class="sec"><h2>收藏的课程 ${fc.length}</h2></div>`;
    html += fc.length ? fc.map(c => `<div class="item" data-act="start" data-id="${c.id}"><span class="ico">🏃</span>
      <span class="txt"><span class="t1">${c.name}</span><br><span class="t2">${c.minutes} 分钟</span></span>
      <button class="btn ghost sm" data-act="fav" data-type="course" data-id="${c.id}">取消</button></div>`).join('')
      : `<div class="card"><div class="empty"><span class="e-ico">🏃</span>还没有收藏课程</div></div>`;
  }

  if (meTab === 'record') {
    const wd = weekDates(), tk = today(), chk = CHK();
    let streak = 0;
    for (let i = 0; i < 400; i++) {
      const d = new Date(); d.setDate(d.getDate() - i);
      const k = d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
      if (Object.keys(S.checks[k] || {}).some(x => S.checks[k][x])) streak++; else if (i > 0) break;
    }
    html += `<div class="card">
      <div class="pg-title" style="margin-bottom:10px">本周打卡</div>
      <div class="week">${wd.map(x => {
      const c = S.checks[x.key] || {};
      return `<div class="wd ${x.key === tk ? 'today' : ''}"><div class="wn">${x.label}</div><div class="wdd">${x.day}</div>
        <div class="dots">${chk.slice(0, 6).map(cc => `<span class="dot ${isDone(c, cc.id) ? 'on' : ''}"></span>`).join('')}</div></div>`;
    }).join('')}</div></div>
    <div class="stat-row">
      <div class="stat"><div class="sv">${streak}</div><div class="sl">连续打卡（天）</div></div>
      <div class="stat"><div class="sv">${(S.logs || []).length}</div><div class="sl">完成课程（次）</div></div>
      <div class="stat"><div class="sv">${Object.keys(S.checks).length}</div><div class="sl">有记录天数</div></div>
    </div>
    <div class="card">
      <div class="pg-title" style="margin-bottom:8px">本周身体状态</div>
      ${wd.map(x => { const h = (S.healthChecks || {})[x.key]; return `<div class="health-log"><span>${x.key === tk ? '今天' : '周' + x.label}</span><b class="${h?.status === 'alert' ? 'is-alert' : ''}">${!h || h.status === 'unknown' ? '未填写' : h.status === 'clear' ? '未记录警示症状' : escapeHTML(HEALTH_ALERTS[h.symptom] || '记录了不适')}</b></div>`; }).join('')}
      <p class="h-sub">只记录你自己选的状态，不能代替诊断；如果总是不舒服，可以带着记录去问问医生。</p>
    </div>
    <div class="card">
      <div class="pg-title" style="margin-bottom:6px">最近的练习</div>
      ${(S.logs || []).length ? (S.logs).slice(-12).reverse().map(l => `<div class="item"><span class="ico">✓</span><span class="txt"><span class="t1">${l.name}</span><br><span class="t2">${l.d}</span></span></div>`).join('')
        : '<div class="empty"><span class="e-ico">🏃</span>还没有练习记录</div>'}
    </div>`;
  }

  if (meTab === 'legal') {
    html += `<div class="card">
      <div class="pg-title" style="margin-bottom:8px">内容免责声明</div>
      <div class="alert" style="margin:0"><div class="ac">${LEGAL.disclaimer}</div></div>
    </div>
    <div class="acc" data-acc><button class="acc-h"><span class="aico">📄</span><span style="flex:1">用户协议</span><span class="arw">›</span></button>
      <div class="acc-b"><pre class="legal">${LEGAL.terms}</pre></div></div>
    <div class="acc" data-acc><button class="acc-h"><span class="aico">🔒</span><span style="flex:1">隐私政策</span><span class="arw">›</span></button>
      <div class="acc-b"><pre class="legal">${LEGAL.privacy}</pre></div></div>
    <div class="note">健康档案和记录保存在本机浏览器，应用不会主动上传；加载第三方视频时会连接视频平台。清理浏览器数据会一并清除本地记录，建议定期导出备份。</div>`;
  }
  $('#me-body').innerHTML = html;
  finishView($('#me-body'));
  bindAcc();
  const w = $('#e-water'); if (w) w.onchange = e => { P0().waterGoal = Math.max(4, Math.min(12, +e.target.value || 8)); save(); render(); };
  const md = $('#e-meddrug'); if (md) md.onchange = e => { S.med.drugTime = e.target.value || '06:30'; save(); render(); };
  const mc = $('#e-medcal'); if (mc) mc.onchange = e => { S.med.calciumTime = e.target.value || '12:30'; save(); render(); };
  const imp = $('#data-import'); if (imp) imp.onchange = async e => {
    try { await importUserData(e.target.files[0]); } catch (err) { toast(err.message || '导入失败，请检查文件', 3600); }
    e.target.value = '';
  };
  if (editingProfile && sy) window.scrollTo(0, sy);
}
let editingProfile = false;
function bindAcc() {
  $$('[data-acc] .acc-h').forEach(h => {
    const box = h.parentElement;
    h.setAttribute('aria-expanded', box.classList.contains('open'));
    h.onclick = () => {
      const open = box.classList.toggle('open');
      h.setAttribute('aria-expanded', open);
      if (open && !box.classList.contains('fit-video-card')) loadCookingVideo(box.querySelector('.video-stage'));
      else stopCookingVideos(box);
    };
  });
  const openVideo = document.querySelector('.view:not(.hidden) .acc.open:not(.fit-video-card) .video-stage');
  if (openVideo && !restoringPage) loadCookingVideo(openVideo);
}

/* 编辑档案时，任何重渲染前先把输入框的值收回来，避免已填内容被重置 */
function collectForm() {
  if (!editingProfile) return;
  const p = P0();
  const n = $('#e-name'); if (n) p.name = (n.value || '胜兰').trim();
  const a = $('#e-age'); if (a) p.age = +a.value || p.age;
  const h = $('#e-h'); if (h) p.height = +h.value || p.height;
  const wt = $('#e-w'); if (wt) p.weight = +wt.value || p.weight;
  const wg = $('#e-water'); if (wg) p.waterGoal = Math.max(4, Math.min(12, +wg.value || 8));
  const thyroid = $('#e-thyroid'); if (thyroid) p.thyroidSurgery = thyroid.value;
  const limits = $('#e-limits'); if (limits) p.movementLimits = limits.value.trim();
  const clinician = $('#e-clinician'); if (clinician) p.clinicianNote = clinician.value.trim();
}

function loadFitVideo(stage) {
  if (!stage || !exerciseReady()) return;
  if (stage.dataset.fitRisk === 'high') {
    /* 超强度不限制播放，仅做强度提示（按需求：不阻断、只提醒） */
    toast('强度提示：该视频强度偏高。请先看示范、量力而行；出现头晕、疼痛或胸闷立即停止，不追求跟满全程。', 4800);
  }
  loadCookingVideo(stage);
}

/* ================= 跟练播放器 ================= */
const P = { obj: null, i: 0, left: 0, timer: null, running: false, elapsed: 0, total: 0, single: false, tag: '' };
let sessionOrigin = null;
function startSession(obj, tag, onlyIndex) {
  sessionOrigin = capturePage();
  stopCookingVideos();
  P.obj = obj; P.tag = tag || ''; P.single = (typeof onlyIndex === 'number'); P.i = onlyIndex || 0; P.elapsed = 0;
  P.total = P.single ? obj.items[onlyIndex].dur : obj.items.reduce((a, b) => a + b.dur, 0);
  $('#player').classList.remove('hidden');
  $('#p-voice').textContent = S.settings.voice ? '语音提示：开' : '语音提示：关';
  loadItem(); play();
  preScreenToast(tag);
}
function loadItem() {
  const it = P.obj.items[P.i];
  P.left = it.dur;
  $('#p-svg').innerHTML = actImg(it.svg);
  $('#p-name').textContent = it.name;
  $('#p-step').textContent = it.steps.join(' ');
  $('#p-sets').textContent = '目标：' + it.target;
  $('#p-caution').textContent = it.caution;
  $('#p-count').textContent = (P.i + 1) + '/' + (P.single ? 1 : P.obj.items.length);
  speakItem(it);
  paint();
}
function paint() {
  $('#p-timer').textContent = mmss(P.left);
  const passed = P.elapsed + (P.obj.items[P.i].dur - P.left);
  $('#p-progress').style.width = Math.min(100, passed / P.total * 100) + '%';
}
function play() { P.running = true; $('#p-toggle').textContent = '暂停'; clearInterval(P.timer); P.timer = setInterval(() => { P.left--; if (P.left <= 0) { next(true); return; } paint(); }, 1000); }
function pause() { P.running = false; $('#p-toggle').textContent = '继续'; clearInterval(P.timer); }
function next(auto) {
  clearInterval(P.timer);
  P.elapsed += P.obj.items[P.i].dur;
  if (P.single || P.i >= P.obj.items.length - 1) { finish(); return; }
  P.i++; loadItem();
  if (auto) play(); else { P.running = false; $('#p-toggle').textContent = '开始'; }
}
function finish() {
  pause(); const o = P.obj;
  if (!P.single) {
    S.logs = S.logs || []; S.logs.push({ d: today(), t: P.tag || o.id || o.name, name: o.name });
    const c = todayChecks();
    if (P.tag === 'neck') { c.neck = 1; if (P0().focus.includes('neck')) c.neck = 1; }
    if (P.tag === 'leg') { c.leg = 1; c.legup = 1; }
    if (P.tag === 'waist') c.waist = 1;
    if (P.tag === 'eye') c.eye = 1;
    if (P.tag === 'posture') c.posture = 1;
    if (P.tag === 'walk') c.walk = 1;
    if (P.tag === 'relax') c.sleep = 1;
    save(); speak(`您今天的 ${o.name} 练习已经做完了，辛苦您了，记得喝口温水、慢慢休息一下。`);
  }
  $('#player').classList.add('hidden');
  toast(P.single ? '完成' : o.name + ' 完成！已打卡');
  if (sessionOrigin) { restorePage(sessionOrigin); sessionOrigin = null; } else render();
}
$('#p-toggle').onclick = () => P.running ? pause() : play();
$('#p-next').onclick = () => next(false);
$('#p-prev').onclick = () => { clearInterval(P.timer); if (P.i > 0) { P.elapsed -= P.obj.items[P.i - 1].dur; P.i--; loadItem(); } if (P.running) play(); };
$('#p-close').onclick = () => {
  pause(); window.speechSynthesis?.cancel(); $('#player').classList.add('hidden');
  if (sessionOrigin) { restorePage(sessionOrigin); sessionOrigin = null; } else render();
};
$('#p-voice').onclick = () => { S.settings.voice = !S.settings.voice; save(); $('#p-voice').textContent = S.settings.voice ? '语音提示：开' : '语音提示：关'; toast(S.settings.voice ? '已开启语音' : '已关闭语音'); };

/* 视频弹窗关闭 */
const vClose = $('#vm-close'); if (vClose) vClose.onclick = closeVideo;
const vModal = $('#vmodal'); if (vModal) vModal.addEventListener('click', e => { if (e.target === vModal) closeVideo(); });
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeVideo(); });

/* 检测到新版本：显示更新横幅 */
window.addEventListener('sw-update-ready', () => {
  const b = $('#update-banner'); if (b) b.classList.remove('hidden');
});

/* 旧视频弹窗兼容函数；平台播放/登录限制由第三方决定。跟练库使用页面内播放器。 */
function actImg(key, cls) {
  /* 真人示范图（assets/img/ex/*.png、assets/img/care/*.png）优先显示；
     若 ACT_IMG 没有对应图，再退回可核对的 SVG 线性示意图，保证旧动作/新动作都不白屏。 */
  if (typeof ACT_IMG !== 'undefined' && ACT_IMG[key]) {
    return `<img class="act-photo ${cls || ''}" src="${ACT_IMG[key]}" alt="${key} 真人示范">`;
  }
  return (typeof EX !== 'undefined' && EX.SVG[key]) ? EX.SVG[key] : '';
}

/* 练习前安全提醒：非阻塞 toast，且同一类每天只温和提醒一次，避免每次点「开始」都跳出来。
   完整的安全要点仍保留在播放器每条动作的 caution 区，随时可看。 */
function preScreenToast(tag) {
  const key = (tag === 'leg' || tag === 'walk') ? 'leg' : (tag === 'neck' ? 'neck' : 'other');
  const t = today();
  S.prescreen = S.prescreen || {};
  if (S.prescreen[key] === t) return;
  S.prescreen[key] = t; save();
  let msg = '';
  if (tag === 'neck') msg = '开始前留意一下：今天如果头晕、看东西发花、走路发飘，或者手脚发麻、突然很头痛，就先停下来歇着，别勉强，需要时问问医生。';
  else if (tag === 'leg' || tag === 'walk') msg = '开始前留意一下：如果一条腿突然肿起来、发热、按着疼、颜色变了或出血，就先别动、尽快就医；要是同时胸口疼或喘不上气，马上打 120。';
  else msg = '中间如果头晕、胸口疼、喘不上气，或者哪里越来越疼，就先停下来歇一歇。';
  if (msg) toast(msg, 4200);
}
function openVideo(bv, title) {
  if (!bv) { toast('暂时没有可用视频'); return; }
  const f = $('#vm-frame');
  if (f) { f.classList.remove('dy'); f.innerHTML = `<iframe src="https://player.bilibili.com/player.html?bvid=${bv}&page=1&high_quality=1&danmaku=0" scrolling="no" framespacing="0" allowfullscreen="true" webkitallowfullscreen="true" allow="fullscreen; picture-in-picture" referrerpolicy="no-referrer"></iframe>`; }
  const t = $('#vm-title'); if (t) t.textContent = title || '真人教练视频 · 点击即可观看';
  const o = $('#vm-open'); if (o) o.href = 'https://www.bilibili.com/video/' + bv;
  const m = $('#vmodal'); if (m) m.classList.remove('hidden');
}
/* 抖音官方播放器（站内嵌入）：vid 为空则不挂播放器，仅提供「在原平台打开」的兜底。 */
function openDyVideo(vid, title, url) {
  const f = $('#vm-frame');
  if (f) {
    if (vid) {
      f.classList.add('dy');
      f.innerHTML = `<iframe src="https://open.douyin.com/player/video?vid=${encodeURIComponent(vid)}&autoplay=0" scrolling="no" frameborder="0" referrerpolicy="unsafe-url" allowfullscreen webkitallowfullscreen allow="fullscreen; picture-in-picture"></iframe>`;
    } else {
      f.classList.remove('dy'); f.innerHTML = '';
    }
  }
  const t = $('#vm-title'); if (t) t.textContent = title || '跟练视频';
  const o = $('#vm-open'); if (o) o.href = url || ('https://www.douyin.com/search/' + encodeURIComponent(title || '居家锻炼'));
  const m = $('#vmodal'); if (m) m.classList.remove('hidden');
  if (!vid) toast('这条视频暂未配置站内播放，请在原平台观看');
}
function closeVideo() {
  const f = $('#vm-frame'); if (f) { f.innerHTML = ''; f.classList.remove('dy'); }
  const m = $('#vmodal'); if (m) { m.classList.add('hidden'); m.classList.remove('css-fs'); }
  document.body.classList.remove('noscroll');
}
/* 安卓微信等 X5 内核里，跨域 iframe 自带的「全屏」按钮经常被静默拦截，
   因此在父页面（同源）提供一个可靠的「放大」按钮：由父页面请求全屏。 */
function toggleVideoFullscreen() {
  const m = document.getElementById('vmodal');
  if (!m) return;
  const fsEl = document.fullscreenElement || document.webkitFullscreenElement || document.mozFullScreenElement;
  const exit = document.exitFullscreen || document.webkitExitFullscreen || document.mozCancelFullScreen || document.msExitFullscreen;
  const on = !!(fsEl || (m.classList.contains('css-fs')));
  if (on) {
    /* 退出：系统级全屏与 CSS 兜底都撤掉 */
    if (fsEl && exit) { try { exit.call(document); } catch (e) {} }
    m.classList.remove('css-fs');
    document.body.classList.remove('noscroll');
    syncVmodalFs();
    return;
  }
  /* 进入：优先用「CSS 兜底全屏」——由父页面把浮层铺满整个视口、隐藏顶/底多余元素，
     不依赖系统 Fullscreen API，因此在华为 / 微信 X5 / 老安卓 WebView 等环境下都能稳定生效；
     若浏览器支持真正的系统全屏（可隐藏系统状态栏），再并行尝试一次作为增强。 */
  m.classList.add('css-fs');
  document.body.classList.add('noscroll');
  syncVmodalFs();
  const req = m.requestFullscreen || m.webkitRequestFullscreen || m.mozRequestFullScreen || m.msRequestFullscreen;
  if (req) { try { const p = req.call(m); if (p && p.catch) p.catch(() => {}); } catch (e) {} }
}
function syncVmodalFs() {
  const b = document.getElementById('vm-fs');
  if (!b) return;
  const realFs = !!(document.fullscreenElement || document.webkitFullscreenElement || document.mozFullScreenElement);
  const cssFs = document.getElementById('vmodal') && document.getElementById('vmodal').classList.contains('css-fs');
  const on = realFs || cssFs;
  b.textContent = on ? '退出' : '放大';
  b.setAttribute('aria-pressed', String(on));
}
function syncStageFs(stage) {
  if (!stage) return;
  const b = stage.querySelector('.stage-fs-btn'); if (!b) return;
  const on = !!(document.fullscreenElement || document.webkitFullscreenElement || document.mozFullScreenElement || stage.classList.contains('css-fs'));
  b.textContent = on ? '退出' : '放大';
  b.setAttribute('aria-label', on ? '退出全屏' : '全屏放大');
}
function syncAllFs() { syncVmodalFs(); document.querySelectorAll('.video-stage.css-fs').forEach(syncStageFs); }
document.addEventListener('fullscreenchange', syncAllFs);
document.addEventListener('webkitfullscreenchange', syncAllFs);
document.addEventListener('mozfullscreenchange', syncAllFs);
/* 跟练 / 烹饪视频内嵌播放器的「放大」：与 vmodal 同思路——以 CSS 兜底全屏为主，
   不依赖系统 Fullscreen API，在华为 / 微信 X5 / 老安卓 WebView 上也能稳定铺满整屏。 */
function toggleStageFullscreen(stage) {
  if (!stage) return;
  const fsEl = document.fullscreenElement || document.webkitFullscreenElement || document.mozFullScreenElement;
  const exit = document.exitFullscreen || document.webkitExitFullscreen || document.mozCancelFullScreen || document.msExitFullscreen;
  const on = !!(fsEl || stage.classList.contains('css-fs'));
  if (on) {
    if (fsEl && exit) { try { exit.call(document); } catch (e) {} }
    stage.classList.remove('css-fs');
    if (!document.querySelector('.vmodal.css-fs') && !document.querySelector('.video-stage.css-fs')) document.body.classList.remove('noscroll');
    syncStageFs(stage);
    return;
  }
  stage.classList.add('css-fs');
  document.body.classList.add('noscroll');
  syncStageFs(stage);
  const req = stage.requestFullscreen || stage.webkitRequestFullscreen || stage.mozRequestFullScreen || stage.msRequestFullscreen;
  if (req) { try { const p = req.call(stage); if (p && p.catch) p.catch(() => {}); } catch (e) {} }
}

/* ================= 事件委托 ================= */
document.addEventListener('click', e => {
  const el = e.target.closest('[data-act]'); if (!el) return;
  const a = el.dataset.act;
  /* 应用更新：顶部横幅的「刷新 / 忽略」与「我的」页的检查更新 */
  if (a === 'swrefresh') { if (window.__applySWUpdate) window.__applySWUpdate(); return; }
  if (a === 'swclose') { const b = $('#update-banner'); if (b) b.classList.add('hidden'); return; }
  if (a === 'vmfs') { toggleVideoFullscreen(); return; }
  if (a === 'stagefs') { toggleStageFullscreen(el.closest('.video-stage')); return; }
  if (a === 'checkupdate') {
    toast('正在检查更新…');
    if (!('serviceWorker' in navigator)) { toast('当前环境不支持自动更新'); return; }
    const doCheck = reg => {
      if (!reg) { toast('暂时无法检查，请稍后再试'); return; }
      reg.update().then(r => {
        if (r && r.waiting) { window.dispatchEvent(new CustomEvent('sw-update-ready')); toast('发现新版本，点击刷新'); }
        else toast('已是最新版本 ' + currentBuild());
      }).catch(() => toast('检查更新失败，请稍后再试'));
    };
    navigator.serviceWorker.getRegistration().then(reg => {
      if (reg) doCheck(reg);
      else navigator.serviceWorker.register('./service-worker.js').then(doCheck).catch(() => toast('当前环境不支持自动更新'));
    }).catch(() => toast('检查更新失败，请稍后再试'));
    return;
  }
  if (a === 'back') { goBack(); return; }
  if (a === 'healthclear') {
    const h = todayHealth(); h.status = 'clear'; h.symptom = ''; h.updatedAt = new Date().toISOString();
    save(); render(); toast('今日状态已记录'); return;
  }
  if (a === 'healthalert') {
    const h = todayHealth(); h.status = 'alert'; h.symptom = el.dataset.kind || 'dizzy'; h.updatedAt = new Date().toISOString();
    save(); render(); toast(h.symptom === 'chest' ? '请立即呼叫 120' : '今天先暂停活动并及时就医', 4800); return;
  }
  if (a === 'healthreset') {
    S.healthChecks[today()] = { status:'unknown', symptom:'', updatedAt:'' }; save(); render(); return;
  }

  if (a === 'goto') {
    const v = el.dataset.view, t = el.dataset.tab;
    if (v === 'diet') go('diet', { dietTab:t || 'menu' });
    else if (v === 'move') go('move', { moveTab:t || 'course' });
    else go(v);
  }
  if (a === 'chk') {
    const id = el.dataset.id, c = todayChecks();
    if (id === 'water') { c.water = (c.water || 0) + 1; if (c.water > 12) c.water = 0; }
    else if (id === 'med') { c.med = c.med ? 0 : 1; toast(c.med ? '已记录服药' : '已取消'); }
    else { c[id] = c[id] ? 0 : 1; if (c[id]) toast('打卡成功'); }
    save(); render();
  }
  if (a === 'eat') { const c = todayChecks(); c[el.dataset.m] = 1; save(); toast('已打卡'); render(); }
  if (a === 'medmark') { const id = el.dataset.id, c = todayChecks(); c[id] = c[id] ? 0 : 1; save(); toast(c[id] ? (id === 'med' ? '已记录服药' : '已记录补钙') : '已取消'); render(); }
  /* 逐个菜品展开文字做法 */
  if (a === 'dish') {
    const box = el.nextElementSibling;
    if (box && box.classList.contains('dish-b')) {
      box.hidden = !box.hidden;
      el.classList.toggle('on', !box.hidden);
      el.setAttribute('aria-expanded', box.hidden ? 'false' : 'true');
      if (box.hidden) stopCookingVideos(box);
      else loadCookingVideo(box.querySelector('.video-stage'));
    }
  }
  if (a === 'dtab') selectPage('diet', { dietTab:el.dataset.t });
  if (a === 'loadcooking') loadCookingVideo(el.closest('.video-stage'));
  if (a === 'rcat') { recipeCat = el.dataset.t; recipeFilter = '全部'; renderDiet(); }
  /* 活动养护页：内部切换与跳转（原「活动」「养护」两页已合并） */
  if (a === 'movetab') selectPage('move', { moveTab:el.dataset.t });
  if (a === 'movetabgo') selectPage('move', { moveTab:el.dataset.t || el.dataset.part || 'course' });
  if (a === 'etab') selectPage('move', { moveTab:el.dataset.t === 'safe' ? 'safe' : 'course' });
  if (a === 'ctab') selectPage('move', { moveTab:el.dataset.t });
  if (a === 'mtab') selectPage('me', { meTab:el.dataset.t });
  if (a === 'ecat') { exCat = el.dataset.c; renderMove(); }
  if (a === 'rtag') { recipeFilter = el.dataset.t; renderDiet(); }
  if (a === 'openrecipe') {
    /* 清掉分类/标签/搜索筛选，确保目标菜谱一定出现在列表里 */
    go('diet', { dietTab:'recipe', recipeCat:'全部', recipeFilter:'全部', recipeQuery:'', recipeOpen:el.dataset.id });
    navigationTimer = setTimeout(() => { const o = document.querySelector('#diet-body .acc.open'); if (o) o.scrollIntoView({ block: 'center' }); }, 80);
  }
  if (a === 'dishfind') {
    /* 菜式没有独立菜谱时，跳到「家常菜谱」并按关键词搜索 */
    go('diet', { dietTab:'recipe', recipeCat:'全部', recipeFilter:'全部', recipeQuery:el.dataset.q || '', recipeOpen:null });
    toast('在「家常菜谱」中搜索：' + (el.dataset.q || ''));
  }
  if (a === 'opencourse') go('move', { moveTab:'course' });
  if (a === 'openroutine') go('move', { moveTab:'routine' });
  /* 首页「今天动一动」→ 活动养护 · 课程 */
  if (a === 'goact') go('move', { moveTab:'course' });

  if (a === 'swap') {
    const t = today(); if (!S.dietOff[t]) S.dietOff[t] = {};
    S.dietOff[t][el.dataset.m] = (S.dietOff[t][el.dataset.m] || 0) + 1;
    save(); renderDiet(); toast('换好了');
  }
  if (a === 'tmswap') {
    const t = nextDayKey(); if (!S.dietOff[t]) S.dietOff[t] = {};
    S.dietOff[t][el.dataset.m] = (S.dietOff[t][el.dataset.m] || 0) + 1;
    save(); renderDiet(); toast('已换一餐');
  }
  if (a === 'confirmshop') {
    const k = nextDayKey(); S.confirmed = S.confirmed || {};
    S.confirmed[k] = JSON.parse(JSON.stringify(tomorrowPlan()));
    save(); toast('已确认备菜，明早自动呈现');
  }
  if (a === 'start') {
    const cs = EX.courses.find(c => c.id === el.dataset.id);
    if (cs && ['whole','activate','strength','balance'].includes(cs.id) && !P0().exerciseApproved) { toast('这套有平衡和全身动作，先请医生或康复师看看适不适合，再开始吧', 4200); return; }
    if (cs && exerciseReady()) startSession(cs, cs.id);
  }
  if (a === 'walkstart' && exerciseReady()) { startSession(EX.walkSession, 'walk'); }
  if (a === 'loadfit') loadFitVideo(el.closest('.video-stage'));
  if (a === 'retryfit') {
    const card = el.closest('.fit-video-card');stopCookingVideos(card);loadFitVideo(card.querySelector('.video-stage'));
  }
  if (a === 'stopfit') {
    const card = el.closest('.fit-video-card');
    stopCookingVideos(card);card.classList.remove('open');
    const header = card.querySelector('.acc-h');header.setAttribute('aria-expanded', 'false');header.focus();
  }

  if (a === 'vplay' || a === 'demo') openVideo(el.dataset.bv, el.dataset.title);
  if (a === 'webfind') {
    const kw = encodeURIComponent(el.dataset.kw || '家常菜做法');
    const url = 'https://search.bilibili.com/all?keyword=' + kw;
    const win = window.open(url, '_blank', 'noopener');
    if (!win) toast('请允许弹出窗口后再试，或在搜索引擎里搜「' + el.dataset.kw + '」');
  }
  if (a === 'shoptick') {
    const k = nextDayKey(); if (!S.shop[k]) S.shop[k] = [];
    const i = +el.dataset.i, arr = S.shop[k];
    const idx = arr.indexOf(i); if (idx >= 0) arr.splice(idx, 1); else arr.push(i);
    save();
    const cnt = $('#shopcnt'); if (cnt) cnt.textContent = arr.length + '/' + buildShop(tomorrowPlan()).length;
    el.classList.toggle('done');
    const box = el.querySelector('.box'); if (box) box.textContent = arr.includes(i) ? '✓' : '';
  }
  if (a === 'applymeal') {
    const id = el.dataset.id, m = el.dataset.m;
    if (!S.mealOverride[today()]) S.mealOverride[today()] = {};
    const cur = S.mealOverride[today()][m];
    if (cur === id) { delete S.mealOverride[today()][m]; toast('已取消应用'); }
    else {
      S.mealOverride[today()][m] = id;
      const r = DIET.recipes.find(x => x.id === id);
      toast('已把「' + (r ? r.name : '菜谱') + '」设为今日' + ({ breakfast: '早餐', lunch: '午餐', dinner: '晚餐' }[m]));
    }
    save(); renderDiet();
  }

  if (a === 'fav') {
    const k = el.dataset.type, id = el.dataset.id, arr = S.favs[k] || (S.favs[k] = []);
    const i = arr.indexOf(id); if (i >= 0) { arr.splice(i, 1); toast('已取消收藏'); } else { arr.push(id); toast('已收藏'); }
    save(); render();
  }
  if (a === 'editp') { editingProfile = true; renderMe(); }
  if (a === 'exportdata') exportUserData();
  if (a === 'chooseimport') $('#data-import')?.click();
  if (a === 'savep') {
    collectForm();
    editingProfile = false; save(); render(); toast('档案已保存');
  }
  if (a === 'setsex') { P0().sex = el.dataset.v; save(); renderMe(); }
  if (a === 'setgoal') { P0().goal = el.dataset.v; save(); renderMe(); }
  if (a === 'setact') { P0().act = +el.dataset.v; save(); renderMe(); }
  if (a === 'toggleavoid') { const p = P0(), i = (p.avoids || []).indexOf(el.dataset.v); if (i >= 0) p.avoids.splice(i, 1); else p.avoids.push(el.dataset.v); save(); renderMe(); }
  if (a === 'togglefocus') { const p = P0(), i = (p.focus || []).indexOf(el.dataset.v); if (i >= 0) p.focus.splice(i, 1); else p.focus.push(el.dataset.v); save(); renderMe(); }
  if (a === 'toggleprofile') { collectForm(); const k = el.dataset.k; if (['vertigoHistory','chronicLegPain','exerciseApproved'].includes(k)) P0()[k] = !P0()[k]; save(); renderMe(); }
  if (a === 'font') { S.settings.font = +el.dataset.v; save(); applyFont(); render(); }
  if (a === 'toggle') { S.settings[el.dataset.k] = !S.settings[el.dataset.k]; save(); render(); }
  if (a === 'togglecalcium') { S.med.calciumEnabled = !S.med.calciumEnabled; save(); render(); }
  if (a === 'toggleiodine') { S.med.lowIodine = !S.med.lowIodine; save(); render(); }
  if (a === 'reset') {
    if (confirm('确定清空全部数据（档案、打卡、收藏）？此操作不可恢复。')) {
      S = normalizeState({});
      save(); applyFont(); render(); toast('已清空');
    }
  }
});

/* ================= 启动引导页 ================= */
const ONBOARD_KEY = 'nuannian_onboarded';
function maybeOnboard() {
  try { if (localStorage.getItem(ONBOARD_KEY) === '1') return; } catch (e) { return; }
  showOnboarding();
}
function showOnboarding() {
  const ICON = {
    heart: '<svg viewBox="0 0 24 24" width="36" height="36" fill="none" stroke="#E85C86" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20.5S4.5 15.6 2.7 11.2C1.5 8.4 3.2 5 6.5 5c2 0 3.2 1.2 4 2.4C11.3 6.2 12.5 5 14.5 5c3.3 0 5 3.4 3.8 6.2C16.5 15.6 12 20.5 12 20.5z"/></svg>',
    bowl: '<svg viewBox="0 0 24 24" width="36" height="36" fill="none" stroke="#E8854C" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 11h18a9 9 0 0 1-18 0z"/><path d="M8 7c0-1.4 1-2 1-3M12 7c0-1.4 1-2 1-3M16 7c0-1.4 1-2 1-3"/></svg>',
    shield: '<svg viewBox="0 0 24 24" width="36" height="36" fill="none" stroke="#C2622E" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3l7 3v5c0 4.5-3 7.8-7 9-4-1.2-7-4.5-7-9V6z"/><path d="M9 12l2 2 4-4"/></svg>'
  };
  const slides = [
    { ico: ICON.heart, t: '欢迎来到暖年', d: '甲状腺术后日常养护的小帮手，陪你温和地动一动、好好吃饭、慢慢恢复。' },
    { ico: ICON.bowl, t: '它能为你做什么', d: '温和活动跟练 · 200 道家常菜谱 · 每日健康打卡 · 用药与安全提醒，都在一个 App 里。' },
    { ico: ICON.shield, t: '先记住一句', d: '本应用仅作日常养护参考；如有不适或异常，请及时就医或拨打急救电话 120。' }
  ];
  let idx = 0;
  const root = document.createElement('div');
  root.id = 'onboard';
  root.className = 'onboard';
  root.innerHTML =
    '<div class="ob-card">' +
      '<div class="ob-art"><img src="assets/photos/hero-cartoon.webp" alt="暖年卡通形象"></div>' +
      '<div class="ob-brand">暖年</div>' +
      '<div class="ob-track">' + slides.map((s, i) =>
        '<div class="ob-slide' + (i === 0 ? ' on' : '') + '" data-i="' + i + '">' +
          '<div class="ob-ico">' + s.ico + '</div>' +
          '<div class="ob-t">' + s.t + '</div>' +
          '<div class="ob-d">' + s.d + '</div>' +
        '</div>').join('') + '</div>' +
      '<div class="ob-dots">' + slides.map((_, i) => '<i class="' + (i === 0 ? 'on' : '') + '"></i>').join('') + '</div>' +
      '<div class="ob-acts">' +
        '<button class="ob-skip" type="button">跳过</button>' +
        '<button class="ob-next btn" type="button">下一步</button>' +
      '</div>' +
    '</div>';
  document.body.appendChild(root);
  document.body.style.overflow = 'hidden';
  const slidesEls = Array.from(root.querySelectorAll('.ob-slide'));
  const dots = Array.from(root.querySelectorAll('.ob-dots i'));
  const nextBtn = root.querySelector('.ob-next');
  const skipBtn = root.querySelector('.ob-skip');
  function paint() {
    slidesEls.forEach((el, i) => el.classList.toggle('on', i === idx));
    dots.forEach((d, i) => d.classList.toggle('on', i === idx));
    nextBtn.textContent = idx === slides.length - 1 ? '开始使用' : '下一步';
  }
  function close() {
    try { localStorage.setItem(ONBOARD_KEY, '1'); } catch (e) {}
    root.remove(); document.body.style.overflow = '';
  }
  nextBtn.addEventListener('click', () => {
    if (idx === slides.length - 1) close(); else { idx++; paint(); }
  });
  skipBtn.addEventListener('click', close);
  let x0 = null;
  const track = root.querySelector('.ob-track');
  track.addEventListener('touchstart', e => { x0 = e.touches[0].clientX; }, { passive: true });
  track.addEventListener('touchend', e => {
    if (x0 === null) return;
    const dx = e.changedTouches[0].clientX - x0; x0 = null;
    if (Math.abs(dx) < 40) return;
    if (dx < 0 && idx < slides.length - 1) { idx++; paint(); }
    else if (dx > 0 && idx > 0) { idx--; paint(); }
  });
}

/* ================= 渲染 ================= */
function render() {
  if (currentView === 'home') renderHome();
  if (currentView === 'diet') renderDiet();
  if (currentView === 'move') renderMove();
  if (currentView === 'me') renderMe();
  applyFont();
}
function applyFont() { document.documentElement.style.fontSize = [16, 19, 22][S.settings.font || 0] + 'px'; }

applyFont();
render();
maybeOnboard();
