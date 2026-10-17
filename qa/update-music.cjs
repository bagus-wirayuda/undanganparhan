const fs=require('fs');
let html=fs.readFileSync('index.html','utf8');
const oldControl=/<button id="music-toggle"[\s\S]*?<\/button>/;
if(!oldControl.test(html))throw new Error('Existing music control not found');
const control=`<audio id="wedding-audio" src="assets/wedding-song.mp3" preload="metadata" loop hidden></audio>
    <button id="music-toggle" class="music-toggle" type="button" aria-label="Putar lagu" title="Putar lagu" aria-pressed="false" aria-controls="wedding-audio">
      <svg class="icon music-icon-play" viewBox="0 0 24 24" aria-hidden="true"><path d="m8 5 11 7-11 7Z"/></svg>
      <svg class="icon music-icon-pause" viewBox="0 0 24 24" aria-hidden="true"><path d="M8 5v14M16 5v14"/></svg>
      <span id="music-status">Putar lagu</span>
    </button>`;
html=html.replace(oldControl,()=>control);fs.writeFileSync('index.html',html);
let pack=fs.readFileSync('qa/package.cjs','utf8');
pack=pack.replace("'.ttf':'font/ttf'","'.ttf':'font/ttf','.mp3':'audio/mpeg'");
pack=pack.replace("['moment-01.webp'","['wedding-song.mp3','moment-01.webp'");
fs.writeFileSync('qa/package.cjs',pack);
let preview=fs.readFileSync('qa/preview.cjs','utf8');
preview=preview.replace("'.ttf':'font/ttf'","'.ttf':'font/ttf','.mp3':'audio/mpeg'");
fs.writeFileSync('qa/preview.cjs',preview);
