const fs=require('node:fs'),assert=require('node:assert/strict');
const selections=JSON.parse(fs.readFileSync('qa/video-candidates.json'));
const metadata=JSON.parse(fs.readFileSync('qa/video-metadata.json'));
const inventory=JSON.parse(fs.readFileSync('qa/video-inventory.json'));
const map={};
for(const [key,selection] of Object.entries(selections)){
 const m=metadata[selection.bv];
 assert.equal(m?.code,0,key+': metadata unavailable');
 assert.ok(!m.rights?.no_share&&!m.rights?.pay&&!m.rights?.ugc_pay&&!m.rights?.arc_pay,key+': sharing/payment restriction');
 assert.ok(/^BV[0-9A-Za-z]{10}$/.test(m.bv));
 assert.ok(m.title&&m.up&&m.cid&&m.duration>0,key+': incomplete metadata');
 map[key]={bv:m.bv,title:m.title,up:m.up,dur:Math.floor(m.duration/60)+':'+String(m.duration%60).padStart(2,'0'),page:1,portrait:m.dimension?.height>m.dimension?.width,checked:m.checked,...(selection.note?{note:selection.note}:{})};
}
// 显式菜名别名，使详情中的展示名与做法关键词使用同一来源。
for(const row of [...inventory.recipes,...inventory.dishes.filter(x=>!x.ready)]){
 assert.ok(map[row.key],row.key+': missing video');
 const name=row.name.replace(/[（(][^）)]*[）)]/g,'').replace(/\s+/g,'').trim();
 if(!map[name])map[name]=map[row.key];
}
const code='/* 公开烹饪视频目录 · 核验日期 2026-09-10\n * 来源为哔哩哔哩公开页面和公开元数据，使用官方播放器，不下载或转载视频。\n * 标题/作者/时长已核对；不代表逐条完整观看或医疗适用性审核。\n * 平台的登录、清晰度、地域及外链播放政策仍可能限制播放。\n * 更新流程与核验边界见 VIDEO_NOTES.md。\n */\nconst VIDEO_MAP = '+JSON.stringify(map,null,2)+';\n\n// 兼容旧的只读取 BVID 的调用，不再使用旧的未核验链接。\nconst RECIPE_BV = Object.fromEntries(Object.entries(VIDEO_MAP).map(([key,v]) => [key,v.bv]));\n';
if(process.argv.includes('--patch')){
 const target='js/recipe-bv.js',old=fs.readFileSync(target,'utf8').replace(/\r\n/g,'\n').trimEnd();
 process.stdout.write('*** Begin Patch\n*** Update File: '+target+'\n@@\n'+old.split('\n').map(x=>'-'+x).join('\n')+'\n'+code.trimEnd().split('\n').map(x=>'+'+x).join('\n')+'\n*** End Patch');
}else console.log(JSON.stringify({keys:Object.keys(selections).length,entries:Object.keys(map).length,uniqueVideos:new Set(Object.values(map).map(x=>x.bv)).size,recipes:inventory.recipes.length,preparedDishes:inventory.dishes.filter(x=>!x.ready).length,readyDishes:inventory.dishes.filter(x=>x.ready).length},null,2));
