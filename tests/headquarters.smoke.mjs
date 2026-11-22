import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import { test } from 'node:test';

const html = readFileSync('index.html','utf8');
const css = readFileSync('headquarters.css','utf8');
const js = readFileSync('headquarters.js','utf8');

test('homepage has essential sections and unique anchors', () => {
  const ids = [...html.matchAll(/\bid="([^"]+)"/g)].map(m=>m[1]);
  assert.equal(new Set(ids).size, ids.length, 'duplicate DOM id');
  for (const id of ['content','home','about','ecosystem','solutions','contact','product-carousel']) {
    assert.ok(ids.includes(id), 'missing anchor '+id);
  }
  assert.equal([...html.matchAll(/<h1\b/g)].length, 1);
  for (const href of [...html.matchAll(/href="#([^"]+)"/g)].map(m=>m[1])) {
    assert.ok(ids.includes(href), 'broken anchor '+href);
  }
});
test('all local assets referenced by homepage exist', () => {
  const local = [...html.matchAll(/(?:src|href)="(\/[^"#?]+)(?:[?#][^"]*)?"/g)].map(m=>m[1]);
  for (const path of local) assert.ok(existsSync('.'+path), 'missing '+path);
});
test('logo variants and brand tokens available', () => {
  for (const part of ['primary-light','primary-dark','symbol-light','symbol-dark','wordmark-light','wordmark-dark']) {
    const svg = readFileSync('assets/brand/yuosant-'+part+'.svg','utf8');
    assert.match(svg, /<svg/);
  }
  assert.ok(existsSync('assets/brand/yuosant-app-icon.svg'));
  assert.match(css, /#00c99b/i);
  const premium = readFileSync('headquarters-premium.css','utf8');
  assert.match(premium, /Manrope/);
  assert.match(premium, /Plus Jakarta Sans/);
  assert.match(html, /Plus\+Jakarta\+Sans/);
  assert.match(css, /prefers-reduced-motion/);
});
test('FinLab and Digital Store retain their destinations and Journal and Tools use legacy routes', () => {
  const outbound = [...html.matchAll(/<a[^>]*href="(https?:[^"]+)"/g)].map(match => match[1]);
  assert.deepEqual(outbound, [
    'https://finlab.yuosant.com/',
    'https://yuosant-digital-hacks.vercel.app/#harga'
  ]);
  assert.ok(html.includes('class="product-card card-store"'));
  assert.ok(html.includes('src="/yuosant-digital-store-crystal.webp"'));
  assert.ok(html.includes('Temukan e-book, materi belajar, template, dan sumber daya digital yang dirancang untuk langsung digunakan.'));
  // Payments remain the responsibility of the existing Digital Store application.
  assert.ok(!html.includes('myscalev.com'));
  assert.ok(html.includes('AIKOBO SHOWCASE'));
  assert.ok(html.includes('YUOSANT AI SHOWCASE'));
  assert.ok(!html.includes('/auth/?service='));
  assert.ok(!html.includes('href="/auth/"'));
  for (const tag of html.match(/<a\b[^>]+target="_blank"[^>]*>/g) ?? []) {
    assert.match(tag,/rel="noopener noreferrer"/);
  }
});
test('accessible navigation and carousel controls exist', () => {
  assert.match(html, /class="skip-link"/);
  assert.match(html, /aria-expanded="false"/);
  assert.match(html, /aria-label="Navigasi utama"/);
  assert.match(html, /id="carousel-prev"/);
  assert.match(html, /id="carousel-next"/);
  assert.match(js, /addEventListener\('keydown'/);
  assert.match(css, /focus-visible/);
});

test('each product has a distinct original artwork and the hero has an illustration', () => {
  const paths = [
    'hero-digital-atmosphere.svg',
    'aikobo-creative.svg',
    'yuosant-ai-neural.svg',
    'finlab-markets.svg',
    'ycc-orchestra.svg',
  ];
  for (const filename of paths) {
    const file = 'assets/showcase/' + filename;
    assert.ok(existsSync(file), 'missing artwork ' + file);
    const svg = readFileSync(file, 'utf8');
    assert.match(svg, /^<svg\b/);
    assert.match(svg, /<\/svg>$/);
    assert.ok(html.includes('/' + file), 'artwork not referenced in homepage: ' + file);
  }
  assert.equal([...html.matchAll(/class="product-illustration"/g)].length, 7);
  assert.ok(html.includes('class="hero-atmosphere"'));
});

test('carousel order, legacy artwork and destination links stay consistent', () => {
  assert.deepEqual([...html.matchAll(/class="product-card card-([a-z]+)"/g)].map(match => match[1]), [
    'aikobo', 'ai', 'finlab', 'store', 'journal', 'tools', 'ycc'
  ]);
  assert.match(html, /id="carousel-count">01 \/ 07/);
  assert.doesNotMatch(html, /choco[ -]?house/i);
  for (const [name, artwork] of [
    ['journal', '/yuosant-journal-crystal.webp'],
    ['tools', '/assets/yuosant-tools-1536x1024-green-1.jpg']
  ]) {
    const card = html.split('class="product-card card-' + name + '"')[1].split('</article>')[0];
    assert.ok(card.includes('src="' + artwork + '"'));
    assert.ok(card.includes('href="/' + name + '/"'));
  }
});
