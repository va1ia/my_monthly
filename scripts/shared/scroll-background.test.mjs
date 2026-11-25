// 目录：1. 布局夹具 2. 展开回归 3. 响应式触发与清理
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { mountScrollBackground } from './scroll-background.js';
const config = JSON.parse(readFileSync(new URL('../../content/shared/pre-footer-background.json', import.meta.url)));

function layout(t, width, height = 1000) {
  const names = ['window', 'document', 'innerHeight', 'matchMedia', 'ResizeObserver', 'requestAnimationFrame', 'cancelAnimationFrame'];
  const originals = new Map(names.map(name => [name, Object.getOwnPropertyDescriptor(globalThis, name)]));
  t.after(() => { for (const [name, descriptor] of originals) {
    if (descriptor) Object.defineProperty(globalThis, name, descriptor); else delete globalThis[name];
  } });
  const faq = { top: 450, visible: true, getClientRects() { return this.visible ? [{}] : []; }, getBoundingClientRect() { return { top: this.top }; } };
  let second = { ...faq, top: 750 };
  const footer = { ...faq, top: 1070 };
  const properties = new Map();
  const classes = new Set();
  const target = { style: {
    getPropertyValue: key => properties.get(key) ?? '',
    setProperty: (key, value) => properties.set(key, String(value)),
  }, classList: { contains: key => classes.has(key), add: key => classes.add(key), remove: key => classes.delete(key) } };
  let resize, disconnected = false, nextFrame = 0;
  const frames = new Map();
  Object.assign(globalThis, {
    window: Object.assign(new EventTarget(), {scrollY:0}), innerHeight: height,
    document: { querySelector: selector => selector === '.contact-faq' ? faq : selector === '.pre-footer' ? footer : selector === '.contact-faq__item:nth-child(2) > summary' ? second : null, fonts: { ready: Promise.resolve() } },
    matchMedia: query => ({ matches: query.includes('min-width') ? width >= 768 : width <= 767 }),
    ResizeObserver: class { constructor(callback) { resize = callback; } observe() {} disconnect() { disconnected = true; } },
    requestAnimationFrame: callback => { frames.set(++nextFrame, callback); return nextFrame; },
    cancelAnimationFrame: id => frames.delete(id),
  });
  const flush = () => { const pending = [...frames.values()]; frames.clear(); pending.forEach(callback => callback()); };
  return { target, faq, footer, anchor: width <= 767 ? second : faq, replaceSecond: element => { second = element; }, color: () => target.style.getPropertyValue('--page-background'),
    resize: () => { resize(); flush(); }, scroll: (delta = 1) => { window.scrollY += delta; window.dispatchEvent(new Event('scroll')); flush(); },
    disconnected: () => disconnected };
}

test('FAQ expansion moved the old footer trigger; the FAQ trigger stays linen through expansion and collapse', t => {
  const view = layout(t, 1440);
  const oldConfig = { ...config, sections: [{ selector: '.pre-footer', colorToken: '--color-darker-linen' }] };
  const old = mountScrollBackground(view.target, oldConfig);
  assert.equal(view.color(), 'var(--color-darker-linen)');
  view.footer.top += 300;
  view.resize();
  assert.equal(view.color(), 'var(--color-picnic-date)', 'old rule reproduces the unwanted green background');
  old.destroy();
  view.footer.top = 1070;
  const fixed = mountScrollBackground(view.target, config);
  for (const top of [1370, 1670, 1070, 2000, 1070]) {
    view.footer.top = top;
    view.resize();
    assert.equal(view.color(), 'var(--color-darker-linen)', 'answer height must not affect background');
  }
  fixed.destroy();
});

for (const width of [390, 767, 768, 820, 1440]) {
  test(`${width}px: correct trigger, reverse scrolling, hidden section and cleanup`, t => {
    const view = layout(t, width);
    const threshold = width <= 767 ? 1000 : 500;
    view.anchor.top = threshold + 1;
    view.target.style.setProperty('--page-background', 'original');
    const fixed = mountScrollBackground(view.target, config);
    assert.equal(view.color(), 'var(--color-picnic-date)');
    view.anchor.top = threshold;
    view.scroll();
    assert.equal(view.color(), 'var(--color-darker-linen)');
    assert.equal(view.target.style.getPropertyValue('--page-background-duration'), '2000ms');
    view.anchor.top = threshold + 1;
    view.scroll(-1);
    assert.equal(view.color(), 'var(--color-picnic-date)');
    assert.equal(view.target.style.getPropertyValue('--page-background-duration'), '700ms');
    view.anchor.top = 0; view.anchor.visible = false;
    view.resize();
    assert.equal(view.color(), 'var(--color-picnic-date)');
    fixed.destroy();
    assert.equal(view.color(), 'original');
    assert.equal(view.target.classList.contains('scroll-background'), false);
    assert.equal(view.disconnected(), true);
  });
}


test('mobile waits for question two, retains linen during answer expansion and resolves refreshed question nodes', t => {
  const view = layout(t, 390);
  view.faq.top = 100;
  view.anchor.top = 1001;
  const fixed = mountScrollBackground(view.target, config);
  assert.equal(view.color(), 'var(--color-picnic-date)');
  view.anchor.top = 999; view.scroll();
  assert.equal(view.color(), 'var(--color-darker-linen)');
  view.anchor.top = 1300; view.resize(); view.scroll();
  assert.equal(view.color(), 'var(--color-darker-linen)', 'layout changes and downward scrolling do not reverse the color');
  view.scroll(-1);
  assert.equal(view.color(), 'var(--color-picnic-date)');
  view.replaceSecond({ ...view.anchor, top: 990 }); view.resize();
  assert.equal(view.color(), 'var(--color-darker-linen)', 'uses the replacement summary after FAQ refresh');
  fixed.destroy();
});
