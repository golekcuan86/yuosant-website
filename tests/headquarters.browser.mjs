import assert from 'node:assert/strict';
import { chromium } from 'playwright';

const browser = await chromium.launch({
  ...(process.env.CHROMIUM_PATH ? {executablePath: process.env.CHROMIUM_PATH} : {channel: 'chrome'}),
  headless: true, args: ['--no-sandbox']
});
try {
  for (const size of [{width:1440,height:900,label:'desktop'},{width:1024,height:768,label:'laptop'},{width:768,height:1024,label:'tablet'},{width:430,height:900,label:'phone-430'},{width:390,height:844,label:'phone-390'},{width:360,height:800,label:'mobile'}]) {
    const page = await browser.newPage({viewport:size, hasTouch: size.width < 800});
    const errors = [];
    page.on('pageerror',error=>errors.push(error.message));
    await page.goto('http://127.0.0.1:4173/',{waitUntil:'domcontentloaded'});
    assert.match(await page.title(),/Yuosant/);
    assert.equal(await page.locator('h1').count(),1);
    assert.equal(await page.locator('.bento-card').count(),7);
    const stats = page.locator('.overview-grid');
    assert.deepEqual(await stats.locator('dd [aria-label]').evaluateAll(nodes => nodes.map(node => node.ariaLabel)),
      ['250 or more', '500 or more', '2.4 million', '98 percent']);
    if (size.width === 390) {
      await stats.evaluate(el => el.scrollIntoView({block: 'center', behavior: 'instant'}));
      await page.waitForFunction(() => {
        const value = Number(document.querySelector('.overview-grid [data-count]').textContent);
        return value > 0 && value < 250;
      });
    }
    await stats.scrollIntoViewIfNeeded();
    await page.waitForFunction(() => {
      return Array.from(document.querySelectorAll('.overview-grid dd'), node => node.textContent).join(',')
        === '250+,500+,2.4M,98%';
    });
    assert.equal(await page.locator('.ticker-track ul:not([aria-hidden]) li').count(), 7);
    const motionState = selector => page.locator(selector).evaluate(el => getComputedStyle(el).animationName);
    assert.equal(await motionState('.ticker-track'), 'product-marquee');
    assert.equal(await motionState('.contact-symbol'), 'contact-symbol-drift');
    const pause = page.getByRole('checkbox', {name: 'Jeda animasi'});
    await pause.check();
    assert.equal(await page.locator('.ticker-track').evaluate(el => getComputedStyle(el).animationPlayState), 'paused');
    await pause.uncheck();
    assert.ok((await page.request.get(new URL('/assets/showcase/yuosant-story-portraits.webp', page.url()).href)).ok());
    assert.match(await page.locator('.story-disclosure').innerText(), /fictional profiles/);
    assert.equal(await page.locator('.audience-grid article').count(), 6);
    assert.equal(await page.locator('.use-case-grid article').count(), 3);
    assert.equal(await page.locator('.footer-directory nav').count(), 4);
    assert.match(await page.locator('.contact-actions .primary').getAttribute('href'), /^mailto:hello@yuosant\.com\?/);
    const header = await page.locator('.header').boundingBox();
    assert.ok(header.x > 0 && header.x + header.width < size.width && header.y > 0,
      size.label + ' navigation should float inside the viewport');
    const width = await page.evaluate(() => ({
      scroll:document.documentElement.scrollWidth,
      viewport:window.innerWidth
    }));
    assert.ok(width.scroll <= width.viewport + 2, size.label+' horizontal overflow '+JSON.stringify(width));
    const introLayout = await page.locator('.intro-grid').evaluate(grid => {
      const heading = grid.querySelector('h2').getBoundingClientRect();
      const copy = grid.querySelector(':scope > div').getBoundingClientRect();
      return {
        headingLeft: heading.left, headingRight: heading.right, headingBottom: heading.bottom,
        copyLeft: copy.left, copyTop: copy.top, copyWidth: copy.width,
        columns: getComputedStyle(grid).gridTemplateColumns
      };
    });
    if (size.width <= 760) {
      assert.ok(introLayout.copyTop >= introLayout.headingBottom - 3,
        'About must stack vertically on mobile: ' + JSON.stringify(introLayout));
      assert.ok(introLayout.copyWidth >= 300,
        'About text too narrow for 360px phones: ' + JSON.stringify(introLayout));
    } else {
      assert.ok(introLayout.copyLeft >= introLayout.headingRight - 4,
        'About should use two editorial columns on desktop: ' + JSON.stringify(introLayout));
    }
    const hrefs=await page.locator('.bento-card a.bento-cta').evaluateAll(nodes=>nodes.map(n=>n.href));
    assert.deepEqual(hrefs, ['https://finlab.yuosant.com/', 'https://yuosant-digital-hacks.vercel.app/#harga',
      'http://127.0.0.1:4173/journal/', 'http://127.0.0.1:4173/tools/']);
    assert.equal(await page.locator('.showcase-bento .card-store img').getAttribute('src'), '/yuosant-digital-store-crystal.webp');
    assert.equal(await page.locator('.card-aikobo a.bento-cta').count(), 0);
    if (size.width <= 760) {
      const menu=page.locator('#menu-toggle');
      assert.equal(await menu.getAttribute('aria-expanded'),'false');
      await menu.click();
      assert.equal(await menu.getAttribute('aria-expanded'),'true');
      assert.equal(await page.locator('#main-nav').isVisible(),true);
      await page.locator('#main-nav a[href="#ecosystem"]').click();
      assert.equal(await menu.getAttribute('aria-expanded'),'false');
    }
    const imageChecks = await page.locator('.showcase-bento .bento-art, .hero-atmosphere').evaluateAll(async (imgs) => {
      await Promise.all(imgs.map(async (img) => {
        img.loading = 'eager';
        try { await img.decode(); } catch {}
      }));
      return imgs.map(img => ({
        src: img.getAttribute('src'), ok: img.complete && img.naturalWidth > 0
      }));
    });
    assert.ok(imageChecks.every(img => img.ok), size.label + ' artwork failed ' + JSON.stringify(imageChecks));
    const feature = page.locator('#showcase-feature');
    const stage = page.locator('#showcase-stage');
    const next = page.locator('#carousel-next');
    const previous = page.locator('#carousel-prev');
    const assertCard = async index => {
      const count = String(index).padStart(2, '0') + ' / 07';
      assert.equal(await page.locator('#carousel-count').textContent(), count);
      await feature.locator('.spotlight-scene').evaluate(img => img.decode());
      assert.ok(await feature.locator('.spotlight-visual .bento-art').evaluate(async img => {
        await img.decode();
        return img.naturalWidth > 0;
      }));
    };
    const store = page.locator('.bento-card.card-store .bento-select');
    await store.click();
    await assertCard(4);
    assert.equal(await store.getAttribute('aria-pressed'), 'true');
    assert.equal(await feature.locator('a').getAttribute('href'), hrefs[1]);
    await feature.press('Home');
    await assertCard(1);
    await previous.click();
    await assertCard(7);
    await next.click();
    await assertCard(1);
    await stage.locator('.showcase-thumbs button').first().click();
    await assertCard(2);
    assert.equal(await motionState('.spotlight-copy'), 'bento-copy-in');
    await page.emulateMedia({reducedMotion: 'reduce'});
    assert.equal(await motionState('.ticker-track'), 'none');
    assert.equal(await motionState('.contact-symbol'), 'none');
    assert.equal(await motionState('.spotlight-copy'), 'none');
    assert.equal(await motionState('.hero-atmosphere'), 'none');
    for (let index = 3; index <= 7; index++) {
      await next.click();
      await assertCard(index);
    }
    await feature.press('ArrowRight');
    await assertCard(1);

    if (size.width < 800) {
      await feature.evaluate(el => el.scrollIntoView({block: 'center', behavior: 'instant'}));
      const box = await feature.boundingBox();
      const client = await page.context().newCDPSession(page);
      const x = Math.round(box.x + box.width * .8);
      const y = Math.round(box.y + 75);
      await client.send('Input.dispatchTouchEvent', {type: 'touchStart', touchPoints: [{x, y}]});
      for (let distance = 25; distance <= 175; distance += 25) {
        await client.send('Input.dispatchTouchEvent', {type: 'touchMove', touchPoints: [{x: x - distance, y}]});
      }
      await client.send('Input.dispatchTouchEvent', {type: 'touchEnd', touchPoints: []});
      await assertCard(2);
      await client.detach();
    }

    const grid = page.locator('.showcase-bento');
    const columns = await grid.evaluate(el => getComputedStyle(el).gridTemplateColumns.split(' ').length);
    assert.equal(columns, size.width >= 980 ? 12 : size.width >= 640 ? 2 : 1);
    if ([390, 1440].includes(size.width)) {
      await feature.press('Home');
      await assertCard(1);
      const showcase = page.locator('#ecosystem > .shell');
      await showcase.screenshot({path:'headquarters-'+(size.width === 1440 ? 'desktop' : 'mobile')+'.png',
        animations:'disabled', style:'.header { visibility: hidden; }'});
    }
    const faq = page.locator('.faq-items details').first();
    await faq.locator('summary').click();
    assert.equal(await faq.locator('p').isVisible(), true);
    await faq.locator('summary').press('Enter');
    assert.equal(await faq.locator('p').isVisible(), false);
    assert.deepEqual(errors, [], size.label + ' runtime errors');
    if (size.width === 1440) {
      for (const [name, title] of [['journal', /Yuosant Journal/], ['tools', /Yuosant Tools/]]) {
        const responsePromise = page.waitForResponse(response => response.url().endsWith('/' + name + '/'));
        await page.locator('.card-' + name + ' a.bento-cta').click();
        assert.ok((await responsePromise).ok(), name + ' route must return HTTP 2xx');
        assert.match(await page.title(), title);
        await page.goBack();
      }
    }
    console.log('PASS ' + size.label + ' — artwork, controls and layout');
    await page.close();
  }
} finally {
  await browser.close();
}
