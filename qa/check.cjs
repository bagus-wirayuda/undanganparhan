const { chromium } = require('C:/Users/BAGUS-WIRAYUDA/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const path = require('path');
(async()=>{
 const browser=await chromium.launch({headless:true,channel:"msedge"});
 const page=await browser.newPage({viewport:{width:390,height:844},deviceScaleFactor:1});
 const errors=[];page.on('pageerror',e=>errors.push(e.message));
 const url='file:///'+path.resolve('index.html').replace(/\\/g,'/')+'?to=Bpk.%20Bagus%20Wirayuda';
 await page.goto(url); await page.waitForTimeout(1800);await page.screenshot({path:'qa/mobile-cover.png'});
 console.log('cover',await page.evaluate(()=>({guest:document.querySelector('[data-guest]').textContent,width:document.documentElement.scrollWidth,viewport:innerWidth,images:[...document.images].map(i=>({src:i.getAttribute('src'),ok:i.complete&&i.naturalWidth>0})),button:document.querySelector('#open-invitation').getBoundingClientRect().toJSON()})));
 await page.click('#open-invitation');await page.waitForTimeout(1100);await page.screenshot({path:'qa/transition.png'});await page.waitForTimeout(2600);await page.screenshot({path:'qa/mobile-home.png'});
 console.log('opened',await page.evaluate(()=>({open:document.body.classList.contains('is-open'),cover:document.querySelector('#cover').hidden,inert:document.querySelector('main').inert,focus:document.activeElement.id})));
 for(const id of ['mempelai','acara','lokasi','penutup']){await page.locator('#'+id).scrollIntoViewIfNeeded();await page.waitForTimeout(1100);await page.screenshot({path:'qa/mobile-'+id+'.png'});}
 const downloadPromise=page.waitForEvent('download');await page.click('#save-date');const d=await downloadPromise;await d.saveAs('qa/event.ics');
 await page.click('#music-toggle');await page.waitForTimeout(300);console.log('music',await page.locator('#music-toggle').getAttribute('aria-pressed'));await page.click('#music-toggle');
 await page.click('#copy-address');console.log('copy',await page.locator('#toast').textContent());
 await page.evaluate(()=>{document.querySelectorAll('.reveal').forEach(e=>e.classList.add('is-visible'));window.scrollTo(0,0)});await page.waitForTimeout(700);await page.screenshot({path:'qa/mobile-full.png',fullPage:true});
 await page.setViewportSize({width:1440,height:900});await page.goto(url);await page.waitForTimeout(1800);await page.screenshot({path:'qa/desktop-cover.png'});
 await page.setViewportSize({width:320,height:568});await page.goto(url);await page.waitForTimeout(1800);await page.screenshot({path:'qa/small-cover.png'});console.log('small',await page.evaluate(()=>({w:document.documentElement.scrollWidth,v:innerWidth,b:document.querySelector('#open-invitation').getBoundingClientRect().toJSON()})));
 console.log('errors',errors);await browser.close();
})().catch(e=>{console.error(e);process.exit(1)});

