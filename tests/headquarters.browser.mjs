import assert from 'node:assert/strict';
import { chromium } from 'playwright';

const browser = await chromium.launch({channel:'chrome',headless:true,args:['--no-sandbox']});
try {
  for (const size of [{width:1440,height:900,label:'desktop'},{width:1024,height:768,label:'laptop'},{width:768,height:1024,label:'tablet'},{width:390,height:844,label:'phone-390'},{width:360,height:800,label:'mobile'}]) {
    const page = await browser.newPage({viewport:size});
    const errors = [];
    page.on('pageerror',error=>errors.push(error.message));
    await page.goto('http://127.0.0.1:4173/',{waitUntil:'domcontentloaded'});
    assert.match(await page.title(),/Yuosant/);
    assert.equal(await page.locator('h1').count(),1);
    assert.equal(await page.locator('.product-card').count(),6);
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
    assert.deepEqual(hrefs, ['https://finlab.yuosant.com/', 'https://yuosant-digital-hacks.vercel.app/#harga']);
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
    await page.locator('#ecosystem').scrollIntoViewIfNeeded();
    await page.locator('#carousel-next').click();
    await page.waitForTimeout(450);
    const current=await page.locator('#carousel-count').innerText();
    assert.ok(current.endsWith("/ 06"), "carousel total must be six: "+current);
    assert.notEqual(current.trim(),'01 / 06',size.label+' carousel did not advance');
    assert.deepEqual(errors,[],size.label+' runtime errors');
    // Capture the actual top-of-page layout; full-page screenshots otherwise
    // place the fixed header at the final scroll position.
    await page.locator('#product-carousel').evaluate(el => el.scrollTo({left:0,behavior:'instant'}));
    await page.evaluate(() => window.scrollTo({top:0,behavior:'instant'}));
    await page.waitForTimeout(220);
    if (size.label === 'mobile' || size.label === 'desktop') {
      await page.screenshot({path:'headquarters-'+size.label+'.png',fullPage:true,animations:'disabled'});
    }
    console.log('PASS '+size.label+'; carousel '+current.trim());
    await page.close();
  }
} finally {
  await browser.close();
}
