// 目录：1. Sheet 映射 2. 弧线布局与动画 3. 生命周期与背景视差 4. 来源同步
import { mountPointerParallax } from '../shared/pointer-parallax.js';
import { parseCSV } from '../shared/csv.js';
import { renderCommentCards, renderAccessibleComments } from '../../pages/home/sections/user-comments/user-comments.js';

export function commentsFromCSV(text) {
  const rows = parseCSV(text);
  const headers = rows.shift()?.map(value => value.trim().toLowerCase());
  const columns = ['title', 'date', 'rating', 'body'].map(key => headers?.indexOf(key) ?? -1);
  if (columns.some(index => index < 0)) throw new Error('Expected title,date,rating,body columns');
  const items = rows.filter(row => row.some(value => value.trim())).map(row => {
    const [title, date, ratingText, body] = columns.map(index => row[index]?.trim() || '');
    const rating = Number(ratingText);
    if (!title || !body || !Number.isInteger(rating) || rating < 1 || rating > 5) throw new Error('Invalid review row');
    return { title, date, rating, body };
  });
  if (!items.length || items.length > 100) throw new Error('Expected 1–100 reviews');
  return items;
}

export function mountUserComments(section, source = {}) {
  const track = section.querySelector('.home-comments__group');
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const controller = new AbortController();
  let originals, cards, count, spacing, radius, offset = 0, frame = 0, lastTime = 0;
  let visible = false, busy = false, timer, signature = '';
  const parallax = mountPointerParallax(section);

  // 2. 在圆弧顶点显示 First ever?!?，左右两边随圆的切线倾斜。
  function collect() {
    track.querySelectorAll('[data-copy]').forEach(card => card.remove());
    originals = [...track.children];
    count = originals.length;
    // 少量评论同样补足整个视口；副本不重复读给屏幕阅读器。
    const repeats = Math.max(1, Math.ceil(8 / count));
    for (let repeat = 1; repeat < repeats; repeat++) {
      for (const original of originals) {
        const copy = original.cloneNode(true);
        copy.dataset.copy = '';
        copy.setAttribute('aria-hidden', 'true');
        track.append(copy);
      }
    }
    cards = [...track.children];
    offset = Math.min(2, count - 1);
    layout();
  }
  function layout() {
    const width = section.clientWidth;
    spacing = originals[0].offsetWidth + width * (width < 768 ? .065 : .027);
    radius = width < 768 ? width * 2.4 : width * 1.5;
    draw();
  }
  function draw() {
    const length = cards.length * spacing;
    cards.forEach((card, index) => {
      const distance = (index - offset) * spacing;
      const x = ((distance + length / 2) % length + length) % length - length / 2;
      const angle = Math.asin(Math.max(-.85, Math.min(.85, x / radius)));
      const y = radius * (1 - Math.cos(angle));
      // Flex group 统一卡片高度；减去流内横坐标后映射到圆弧。
      card.style.transform = `translate(${x - index * spacing - originals[0].offsetWidth / 2}px, ${y}px) rotate(${angle * 180 / Math.PI}deg)`;
      card.style.visibility = Math.abs(x) > section.clientWidth / 2 + spacing ? 'hidden' : 'visible';
    });
  }
  function canAnimate() { return !reduced.matches && visible && !document.hidden; }
  function tick(time) {
    frame = 0;
    if (!canAnimate()) { lastTime = 0; return; }
    if (lastTime) offset = (offset + Math.min(time - lastTime, 50) * 22 / 1000 / spacing) % cards.length;
    lastTime = time;
    draw();
    frame = requestAnimationFrame(tick);
  }
  function sync() {
    cancelAnimationFrame(frame); frame = 0; lastTime = 0;
    if (canAnimate()) frame = requestAnimationFrame(tick);
  }
  // 3. 评论持续滚动；仅后台、离开视口及减少动画偏好时停止。
  const listen = (target, type, listener) => target.addEventListener(type, listener, { signal: controller.signal });
  listen(document, 'visibilitychange', sync);
  listen(reduced, 'change', sync);
  const resize = new ResizeObserver(layout);
  const intersection = new IntersectionObserver(entries => { visible = entries[0].isIntersecting; sync(); });
  collect(); sync(); resize.observe(section); intersection.observe(section);

  // 4. 空链接不请求；失败保留已有内容，成功后替换初始快照。
  async function refresh() {
    if (!source.csvUrl || busy || document.hidden) return;
    busy = true;
    try {
      const url = new URL(source.csvUrl);
      if (url.protocol !== 'https:' || url.hostname !== 'docs.google.com' || !url.pathname.startsWith('/spreadsheets/')) throw new Error('Expected Google Sheets CSV URL');
      const response = await fetch(url, { cache: 'no-store', signal: AbortSignal.any([controller.signal, AbortSignal.timeout(15000)]) });
      if (!response.ok) throw new Error('Review source unavailable');
      const csv = await response.text();
      if (csv.length > 1000000 || csv.trimStart().startsWith('<')) throw new Error('Invalid CSV');
      const items = commentsFromCSV(csv);
      const next = JSON.stringify(items);
      if (next !== signature) {
        track.innerHTML = renderCommentCards(items);
        section.querySelector('[data-comments-accessible]').innerHTML = renderAccessibleComments(items);
        collect(); signature = next;
      }
      section.dataset.sourceState = 'connected';
    } catch {
      if (!controller.signal.aborted) section.dataset.sourceState = 'unavailable';
    } finally { busy = false; }
  }
  if (source.csvUrl) {
    refresh();
    timer = setInterval(refresh, Math.max(30, Number(source.refreshSeconds) || 60) * 1000);
    listen(document, 'visibilitychange', refresh);
  }
  return { refresh, destroy() { controller.abort(); clearInterval(timer); cancelAnimationFrame(frame); parallax.destroy(); resize.disconnect(); intersection.disconnect(); } };
}
