const fs=require('fs'),path=require('path');
let html=fs.readFileSync('index.html','utf8');
let css=fs.readFileSync('style.css','utf8');
const mime={'.webp':'image/webp','.svg':'image/svg+xml','.ttf':'font/ttf'};
function data(file){return 'data:'+mime[path.extname(file)]+';base64,'+fs.readFileSync(file).toString('base64')}
css=css.replace(/url\('([^']+)'\)/g,(_,file)=>'url("'+data(file)+'")');
html=html.replace(/<link rel="preload"[^>]+>\s*/g,'').replace('<link rel="stylesheet" href="style.css">','<style>'+css+'</style>');
html=html.replace('<script src="script.js" defer></script>','');
html=html.replace(/(?:src|href)="(assets\/[^\"]+)"/g,(match,file)=>match.replace(file,data(file)));
html=html.replace('</body>',()=>'<script>'+fs.readFileSync('script.js','utf8').replace(/<\/script/gi,'<\\/script')+'</script>\n</body>');
html=html.replace('<head>','<head>\n<!--\n'+fs.readFileSync('assets/FONT-LICENSES.txt','utf8')+'\n-->');
fs.writeFileSync('Undangan-Lili-Parhan.html',html);
fs.mkdirSync('ready-to-upload/assets',{recursive:true});
for(const file of ['index.html','style.css','script.js','README.md'])fs.copyFileSync(file,path.join('ready-to-upload',file));
for(const file of ['garden.webp','couple.webp','cormorant-regular.ttf','cormorant-italic.ttf','manrope-regular.ttf','manrope-semibold.ttf','favicon.svg','FONT-LICENSES.txt','ARTWORK.md'])fs.copyFileSync(path.join('assets',file),path.join('ready-to-upload/assets',file));
console.log('Standalone HTML: '+fs.statSync('Undangan-Lili-Parhan.html').size+' bytes. Ready to upload folder created.');

