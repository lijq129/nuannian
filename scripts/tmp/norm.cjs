const fs=require('fs'),path=require('path');
const names=JSON.parse(fs.readFileSync(path.join(__dirname,'dishnames.json'),'utf8'));
const norm=s=>(s||'').replace(/[（(][^）)]*[）)]/g,'').replace(/（.*$/,'') .replace(/[（(].*$/,'').replace(/\s+/g,'').trim();
const set=[];
names.forEach(n=>{const k=norm(n); if(!set.includes(k)) set.push(k);});
console.log(set.length);
console.log(set.join(' / '));
