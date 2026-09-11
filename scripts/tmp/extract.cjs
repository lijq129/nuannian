const fs = require('fs');
const path = require('path');
const root = path.join(__dirname, '..', '..');
let src = fs.readFileSync(path.join(root, 'js/data-diet.js'), 'utf8');
const start = src.indexOf('meals: {');
const end = src.indexOf('pairing: [');
let body = src.slice(start, end).replace(/^[\s\S]*?meals:\s*/, 'meals: ').replace(/,?\s*$/, '');
const _m = eval('({' + body + '})');
const set = new Map();
for (const k of Object.keys(_m.meals)) {
  _m.meals[k].forEach(m => (m.foods || []).forEach(f => {
    const raw = f[0];
    set.set(raw, (set.get(raw) || 0) + 1);
  }));
}
const arr = [...set.keys()].sort((a, b) => set.get(b) - set.get(a));
fs.writeFileSync(path.join(__dirname, 'dishnames.json'), JSON.stringify(arr, null, 0), 'utf8');
console.log('unique:', arr.length);
console.log(arr.map((n, i) => (i + 1) + '. ' + n + '  x' + set.get(n)).join('\n'));
