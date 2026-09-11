const fs=require('fs'),vm=require('vm'),path=require('path');
const ctx={console};vm.createContext(ctx);
vm.runInContext(fs.readFileSync('js/data-dish.js','utf8'),ctx);
vm.runInContext(fs.readFileSync('js/recipe-bv.js','utf8'),ctx);
vm.runInContext(fs.readFileSync('js/data-video.js','utf8'),ctx);
const names=JSON.parse(fs.readFileSync(path.join(__dirname,'dishnames.json'),'utf8'));
ctx.NAMES=names;
const r=vm.runInContext(`
(function(){
  var miss=[], ready=[], ok=0;
  NAMES.forEach(function(n){
    var hit=resolveDish(n), b=hit?dishBody(hit.key):null;
    if(!b){miss.push(n+'（无做法条目）');return;}
    var v=videoInfo((b&&b.kw)||n);
    if(v&&v.bv) ok++;
    else if(b.ready) ready.push(n);
    else miss.push(n+'  kw='+(b.kw||'(空)'));
  });
  return {ok:ok, ready:ready, miss:miss};
})()
`,ctx);
console.log('有视频',r.ok,' 免开火无视频',r.ready.length,' 缺失',r.miss.length);
console.log('免开火：'+r.ready.join('、'));
console.log('缺失：\n'+r.miss.join('\n'));
