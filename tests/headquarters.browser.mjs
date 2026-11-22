import assert from 'node:assert/strict';
import { chromium } from 'playwright';

const browser = await chromium.launch({channel:'chrome',headless:true,args:['--no-sandbox']});
try {
  for (const size of [{width:1440,height:900,label:'desktop'},{width:360,height:800,label:'mobile'}]) {
    const page = await browser.newPage({viewport:size});
    const errors = [];
    page.on('pageerror',error=>errors.push(error.message));
    await page.goto('http://127.0.0.1:4173/',{waitUntil:'domcontentloaded'});
    assert.match(await page.title(),/Yuosant/);
    assert.equal(await page.locator('h1').count(),1);
    assert.equal(await page.locator('.product-card').count(),5);
    const width = await page.evaluate(() => ({
      scroll:document.documentElement.scrollWidth,
      viewport:window.innerWidth
    }));
    assert.ok(width.scroll <= width.viewport + 2, size.label+' horizontal overflow '+JSON.stringify(width));
    const hrefs=await page.locator('.product-card a.card-foot').evaluateAll(nodes=>nodes.map(n=>n.href));
    assert.deepEqual(hrefs, ['https://finlab.yuosant.com/']);
    if (size.label==='mobile') {
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
    assert.notEqual(current.trim(),'01 / 05',size.label+' carousel did not advance');
    assert.deepEqual(errors,[],size.label+' runtime errors');
    await page.screenshot({path:'headquarters-'+size.label+'.png',fullPage:true,animations:'disabled'});
    console.log('PASS '+size.label+'; carousel '+current.trim());
    await page.close();
  }
} finally {
  await browser.close();
}
