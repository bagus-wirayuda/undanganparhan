const { chromium } = require('C:/Users/BAGUS-WIRAYUDA/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const path = require('path');
const fs = require('fs');

(async () => {
  const browser = await chromium.launch({ headless: true, channel: 'msedge' });
  const url = 'file:///' + path.resolve('index.html').replace(/\\/g, '/');
  const attack = '<img src=x onerror="window.__xss=1">';
  const guest = (attack + ' Bagus Wirayuda beserta keluarga besar yang berbahagia ').repeat(3).slice(0, 120);
  const cases = [
    { width: 320, height: 568, name: 'small-long-name', guest },
    { width: 390, height: 844, name: 'mobile-long-name', guest },
    { width: 430, height: 932, name: 'large-mobile-long-name', guest },
    { width: 844, height: 390, name: 'landscape', guest: 'Bpk. Bagus Wirayuda' },
  ];
  const results = [];
  for (const item of cases) {
    const page = await browser.newPage({ viewport: { width: item.width, height: item.height }, reducedMotion: 'reduce' });
    const errors = [];
    page.on('pageerror', e => errors.push(e.message));
    await page.goto(url + '?to=' + encodeURIComponent(item.guest));
    await page.evaluate(() => document.fonts.ready);
    const cover = await page.evaluate(() => {
      const rect = sel => document.querySelector(sel).getBoundingClientRect().toJSON();
      const button = document.querySelector('#open-invitation');
      const b = button.getBoundingClientRect();
      const cx = b.left + b.width / 2, cy = b.top + b.height / 2;
      const point = document.elementFromPoint(cx, cy);
      const focusable = [...document.querySelectorAll('button,a[href]')].filter(e => !e.closest('[inert]') && getComputedStyle(e).visibility !== 'hidden' && getComputedStyle(e).display !== 'none');
      return { viewport: { width: innerWidth, height: innerHeight }, documentWidth: document.documentElement.scrollWidth,
        guest: document.querySelector('[data-guest]').textContent, guestChildren: document.querySelector('[data-guest]').children.length,
        xss: window.__xss || false, button: rect('#open-invitation'), guestCard: rect('.guest-card'),
        couple: rect('.cover-couple'), heading: rect('.cover-heading'),
        buttonWithinViewport: b.top >= 0 && b.bottom <= innerHeight && b.left >= 0 && b.right <= innerWidth,
        buttonHit: !!point && (point === button || button.contains(point)), focusable: focusable.map(e => e.id || e.className) };
    });
    await page.screenshot({ path: 'qa/' + item.name + '.png' });
    let open = null;
    if (cover.buttonWithinViewport && cover.buttonHit) {
      await page.locator('#open-invitation').click({ timeout: 3000 });
      await page.waitForTimeout(150);
      open = await page.evaluate(() => ({ open: document.body.classList.contains('is-open'), hidden: document.querySelector('#cover').hidden,
        inert: document.querySelector('#invitation').inert, focus: document.activeElement.id,
        hiddenReveals: [...document.querySelectorAll('.reveal')].filter(e => getComputedStyle(e).opacity !== '1').length,
        documentWidth: document.documentElement.scrollWidth, viewport: innerWidth }));
    }
    results.push({ name: item.name, cover, open, errors });
    await page.close();
  }
  const page = await browser.newPage({ viewport: { width: 390, height: 844 }, reducedMotion: 'reduce' });
  await page.clock.install({ time: new Date('2026-10-25T01:59:00Z') });
  await page.clock.setFixedTime(new Date('2026-10-25T01:59:00Z'));
  await page.goto(url);
  const counts = () => page.evaluate(() => ({ parts: [...document.querySelectorAll('[data-count]')].map(e => e.textContent), label: document.querySelector('#countdown-label').textContent }));
  const before = await counts();
  await page.clock.setFixedTime(new Date('2026-10-25T02:00:00Z'));
  await page.clock.runFor(1100);
  const at = await counts();
  await page.clock.setFixedTime(new Date('2026-10-27T00:00:00Z'));
  await page.clock.runFor(1100);
  const after = await counts();
  const output = { results, date: { before, at, after } };
  fs.writeFileSync('qa/edge-cases-results.json', JSON.stringify(output, null, 2));
  console.log(JSON.stringify(output, null, 2));
  await browser.close();
})().catch(e => { console.error(e); process.exit(1); });
