import assert from 'node:assert/strict';
import { chromium } from 'playwright';

const browser = await chromium.launch({
  ...(process.env.CHROMIUM_PATH ? {executablePath: process.env.CHROMIUM_PATH} : {channel: 'chrome'}),
  headless: true, args: ['--no-sandbox']
});
try {
  for (const size of [{width:1440,height:900,label:'desktop'},{width:1024,height:768,label:'laptop'},{width:768,height:1024,label:'tablet'},{width:390,height:844,label:'phone-390'},{width:360,height:800,label:'mobile'}]) {
    const page = await browser.newPage({viewport:size, hasTouch: size.width < 800});
    const errors = [];
    page.on('pageerror',error=>errors.push(error.message));
    await page.goto('http://127.0.0.1:4173/',{waitUntil:'domcontentloaded'});
    assert.match(await page.title(),/Yuosant/);
    assert.equal(await page.locator('h1').count(),1);
    assert.equal(await page.locator('.product-card').count(),7);
    assert.equal(await page.locator('.overview-grid dd').count(), 4);
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
    const hrefs=await page.locator('.product-card a.card-foot').evaluateAll(nodes=>nodes.map(n=>n.href));
    assert.deepEqual(hrefs, ['https://finlab.yuosant.com/', 'https://yuosant-digital-hacks.vercel.app/#harga',
      'http://127.0.0.1:4173/journal/', 'http://127.0.0.1:4173/tools/']);
    assert.equal(await page.locator('.card-store img').getAttribute('src'), '/yuosant-digital-store-crystal.webp');
    assert.equal(await page.locator('.card-aikobo a.card-foot').count(), 0);
    if (size.width <= 760) {
      const menu=page.locator('#menu-toggle');
      assert.equal(await menu.getAttribute('aria-expanded'),'false');
      await menu.click();
      assert.equal(await menu.getAttribute('aria-expanded'),'true');
      assert.equal(await page.locator('#main-nav').isVisible(),true);
      await page.locator('#main-nav a[href="#ecosystem"]').click();
      assert.equal(await menu.getAttribute('aria-expanded'),'false');
    }
    const imageChecks = await page.locator('.product-illustration, .hero-atmosphere').evaluateAll(async (imgs) => {
      await Promise.all(imgs.map(async (img) => {
        img.loading = 'eager';
        try { await img.decode(); } catch {}
      }));
      return imgs.map(img => ({
        src: img.getAttribute('src'), ok: img.complete && img.naturalWidth > 0
      }));
    });
    assert.ok(imageChecks.every(img => img.ok), size.label + ' artwork failed ' + JSON.stringify(imageChecks));
    const carousel = page.locator('#product-carousel');
    const next = page.locator('#carousel-next');
    const previous = page.locator('#carousel-prev');
    const waitForCard = index => page.getByText(
      String(index).padStart(2, '0') + ' / 07', {exact: true}
    ).waitFor();

    const selector = page.getByRole('group', {name: 'Pilih produk'});
    assert.deepEqual(await selector.getByRole('button').allTextContents(),
      ['AiKobo', 'Yuosant AI', 'FinLab', 'Digital Store', 'Journal', 'Tools', 'YCC']);
    const digitalStore = selector.getByRole('button', {name: 'Digital Store'});
    await digitalStore.click();
    await waitForCard(4);
    assert.equal(await digitalStore.getAttribute('aria-pressed'), 'true');
    await carousel.press('Home');
    await waitForCard(1);
    await next.click();
    await waitForCard(2);
    await page.emulateMedia({reducedMotion: 'reduce'});
    assert.equal(await page.locator('.hero-atmosphere').evaluate(el => getComputedStyle(el).animationName), 'none');
    for (let index = 3; index <= 7; index++) {
      await next.click();
      await waitForCard(index);
    }
    assert.equal(await next.getAttribute('aria-disabled'), 'true');
    await previous.click();
    await waitForCard(6);
    await carousel.press('ArrowLeft');
    await waitForCard(5);
    await carousel.press('End');
    await waitForCard(7);
    await carousel.press('Home');
    await waitForCard(1);
    assert.equal(await previous.getAttribute('aria-disabled'), 'true');
    await carousel.press('ArrowRight');
    await waitForCard(2);
    await carousel.press('Home');
    await waitForCard(1);

    if (size.width < 800) {
      await carousel.evaluate(el => el.scrollIntoView({block: 'center'}));
      const box = await carousel.boundingBox();
      const client = await page.context().newCDPSession(page);
      const x = Math.round(box.x + Math.min(300, box.width - 15));
      const y = Math.round(box.y + 100);
      await client.send('Input.dispatchTouchEvent', {type: 'touchStart', touchPoints: [{x, y}]});
      for (let distance = 25; distance <= 250; distance += 25) {
        await client.send('Input.dispatchTouchEvent', {type: 'touchMove', touchPoints: [{x: x - distance, y}]});
      }
      await client.send('Input.dispatchTouchEvent', {type: 'touchEnd', touchPoints: []});
      await page.getByText(/0[2-7] \/ 07/).waitFor();
      await client.detach();
    }

    const faq = page.locator('.faq-items details').first();
    await faq.locator('summary').click();
    assert.equal(await faq.locator('p').isVisible(), true);
    await faq.locator('summary').press('Enter');
    assert.equal(await faq.locator('p').isVisible(), false);
    assert.deepEqual(errors, [], size.label + ' runtime errors');
    // Capture the actual top-of-page layout; full-page screenshots otherwise
    // place the fixed header at the final scroll position.
    await page.locator('#product-carousel').evaluate(el => el.scrollTo({left:0,behavior:'instant'}));
    await page.evaluate(() => window.scrollTo({top:0,behavior:'instant'}));
    await page.waitForTimeout(220);
    if (size.label === 'mobile' || size.label === 'desktop') {
      await page.screenshot({path:'headquarters-'+size.label+'.png',fullPage:true,animations:'disabled'});
    }
    if (size.width === 1440) {
      for (const [name, title] of [['journal', /Yuosant Journal/], ['tools', /Yuosant Tools/]]) {
        const responsePromise = page.waitForResponse(response => response.url().endsWith('/' + name + '/'));
        await page.locator('.card-' + name + ' a.card-foot').click();
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
