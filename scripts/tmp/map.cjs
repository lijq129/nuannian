const fs=require('fs'),path=require('path');
const root=path.join(__dirname,'..','..');
eval(fs.readFileSync(path.join(root,'js/data-dish.js'),'utf8'));
const names=JSON.parse(fs.readFileSync(path.join(__dirname,'dishnames.json'),'utf8'));
names.forEach(n=>{const r=resolveDish(n);const b=dishBody(r.key);console.log(n+'  =>  '+r.key+'  | kw: '+(b.kw||'（无视频）'));});
