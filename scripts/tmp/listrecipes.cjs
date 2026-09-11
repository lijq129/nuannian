const fs=require('fs'),path=require('path');
const root=path.join(__dirname,'..','..');
let src=fs.readFileSync(path.join(root,'js/data-diet.js'),'utf8');
src=src.replace(/^\/\*[\s\S]*?\*\//,'').replace(/const DIET =/,'module.exports =');
fs.writeFileSync(path.join(__dirname,'dietmod.cjs'),src,'utf8');
const DIET=require(path.join(__dirname,'dietmod.cjs'));
console.log(DIET.recipes.length);
console.log(DIET.recipes.map(r=>r.id+' | '+r.name+' | '+r.tags.join('/')+' | '+r.scene).join('\n'));
