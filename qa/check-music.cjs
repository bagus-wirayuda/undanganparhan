const {chromium}=require('C:/Users/BAGUS-WIRAYUDA/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const fs=require('fs'),path=require('path'),assert=require('assert');
const fileURL=f=>'file:///'+path.resolve(f).replace(/\\/g,'/')+'?to=Bpk.%20Bagus%20Wirayuda';
(async()=>{
 const browser=await chromium.launch({headless:true,channel:'msedge',args:['--autoplay-policy=user-gesture-required']});
 const results=[];
 for(const file of ['index.html','Undangan-Lili-Parhan.html']){
  const page=await browser.newPage({viewport:{width:390,height:844},reducedMotion:'reduce'});
  const errors=[];page.on('pageerror',e=>errors.push(e.message));await page.route('http**/*',r=>r.abort());
  await page.goto(fileURL(file));assert.equal(await page.locator('audio').count(),1);
  assert(await page.locator('#wedding-audio').evaluate(a=>a.paused&&a.currentTime===0));
  assert.equal(await page.locator('#music-toggle').getAttribute('aria-pressed'),'false');
  await page.click('#open-invitation');
  await page.waitForFunction(()=>{const a=document.querySelector('#wedding-audio');return !a.paused&&a.currentTime>.2});
  assert.equal(await page.locator('#music-toggle').getAttribute('aria-pressed'),'true');assert.equal(await page.locator('#music-status').innerText(),'Jeda lagu');
  const info=await page.locator('#wedding-audio').evaluate(a=>({duration:a.duration,loop:a.loop,ready:a.readyState,embedded:a.currentSrc.startsWith('data:audio/mpeg;base64,')}));
  assert(info.duration>0&&Number.isFinite(info.duration));assert(info.loop);
  await page.click('#music-toggle');assert(await page.locator('#wedding-audio').evaluate(a=>a.paused));
  const atPause=await page.locator('#wedding-audio').evaluate(a=>a.currentTime);await page.waitForTimeout(350);
  assert(Math.abs(await page.locator('#wedding-audio').evaluate(a=>a.currentTime)-atPause)<.05);
  assert.equal(await page.locator('#music-status').innerText(),'Putar lagu');
  await page.click('#music-toggle');await page.waitForFunction(t=>document.querySelector('#wedding-audio').currentTime>t+.15,atPause);
  if(file==='index.html'){await page.screenshot({path:'qa/music-playing-mobile.png'});await page.locator('#wedding-audio').evaluate(a=>{a.currentTime=a.duration-.3});await page.waitForFunction(()=>{const a=document.querySelector('#wedding-audio');return a.currentTime<3&&!a.paused});}
  for(let i=0;i<4;i++)await page.click('#music-toggle');
  await page.click('#music-toggle');assert(await page.locator('#wedding-audio').evaluate(a=>a.paused));
  assert.deepEqual(errors,[]);results.push({file,...info,verified:'no sound before opening, actual MP3 playback on opening, pause/resume position, rapid toggle, zero errors'});await page.close();
 }
 const denied=await browser.newPage({viewport:{width:320,height:568},reducedMotion:'reduce'});const rejectionErrors=[];denied.on('pageerror',e=>rejectionErrors.push(e.message));
 await denied.addInitScript(()=>{const original=HTMLMediaElement.prototype.play;let first=true;HTMLMediaElement.prototype.play=function(){if(first){first=false;return Promise.reject(new DOMException('Simulated browser policy','NotAllowedError'))}return original.call(this)}});
 await denied.goto(fileURL('index.html'));await denied.click('#open-invitation');await denied.waitForTimeout(250);
 assert(await denied.locator('#cover').evaluate(e=>e.hidden));assert.equal(await denied.locator('#music-toggle').getAttribute('aria-pressed'),'false');
 assert((await denied.locator('#toast').innerText()).length>0);await denied.click('#music-toggle');await denied.waitForFunction(()=>!document.querySelector('#wedding-audio').paused&&document.querySelector('#wedding-audio').currentTime>.1);
 assert.deepEqual(rejectionErrors,[]);assert(await denied.evaluate(()=>document.documentElement.scrollWidth===innerWidth));
 results.push({verified:'blocked autoplay leaves opening working; manual play retry succeeds at 320px'});
 fs.writeFileSync('qa/music-results.json',JSON.stringify(results,null,2));console.log(JSON.stringify(results,null,2));await browser.close();
})().catch(e=>{console.error(e);process.exit(1)});
