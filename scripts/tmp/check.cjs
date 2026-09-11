const fs=require('fs'),path=require('path');
const root=path.join(__dirname,'..','..');
eval(fs.readFileSync(path.join(root,'js/data-dish.js'),'utf8'));
const names=JSON.parse(fs.readFileSync(path.join(__dirname,'dishnames.json'),'utf8'));
const miss=[]; const ok=[];
names.forEach(n=>{
  const r=resolveDish(n);
  if(!r||!r.item) { miss.push(n); return; }
  const body=dishBody(r.key);
  if(!body||!body.steps||!body.steps.length) miss.push(n+' (无步骤)');
  else ok.push(n+' -> '+r.key+(r.loose?' [模糊]':'')+' kw='+(body.kw||'无'));
});
console.log('总食材数',names.length,' 命中',ok.length,' 缺失',miss.length);
if(miss.length) console.log('缺失：\n'+miss.join('\n'));
console.log('---模糊匹配---');
console.log(ok.filter(x=>x.includes('[模糊]')).join('\n'));
