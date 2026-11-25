// 目录：1. CSV 解析 2. 两列映射 3. 自动更新与保留展开状态 4. 可选加载状态与重试
import { renderFAQItems } from '../../components/faq/faq.js';
import { parseCSV } from './csv.js';
export { parseCSV } from './csv.js';
export function questionsFromCSV(text, { stopBefore } = {}) {
  const rows = parseCSV(text);
  const headers = rows.shift()?.map(v => v.trim().toLowerCase());
  if (!headers || !['问题', 'question', 'q'].includes(headers[0]) || !['回答', 'answer', 'a'].includes(headers[1])) throw new Error('Expected 问题/回答, Question/Answer or Q/A headers');
  const normalize = value => value.trim().replace(/\s+/g, ' ').toLowerCase();
  const boundary = stopBefore ? rows.findIndex(row => normalize(row[0] || '') === normalize(stopBefore)) : -1;
  const visibleRows = boundary === -1 ? rows : rows.slice(0, boundary);
  const items = visibleRows.filter(row => row[0]?.trim() && row[1]?.trim()).map(row => ({ question: row[0].trim(), answer: row[1].trim() }));
  if (items.length > 200) throw new Error('FAQ row limit exceeded');
  return items;
}
export function mountFAQ(section, config) {
  const list = section.querySelector('.contact-faq__list');
  const status = section.querySelector('[data-faq-status]');
  const retry = section.querySelector('[data-faq-retry]');
  const controller = new AbortController(); let previous = '', busy = false, timer;
  let itemCount = 0;
  function setState(state) {
    section.dataset.sourceState = state;
    if (retry) retry.hidden = state !== 'unavailable';
    if (!status) return;
    if (state === 'loading') status.textContent = 'Loading questions…';
    else if (state === 'unavailable') status.textContent = itemCount
      ? 'We couldn’t check for updates. The last loaded answers are shown below.'
      : 'We couldn’t load the questions. Please try again or contact us below.';
    else status.textContent = itemCount ? '' : 'No questions are available right now. Please contact us below.';
  }
  function display(items) {
    itemCount = items.length;
    const signature = JSON.stringify(items); if (signature === previous) return;
    const open = new Set([...list.querySelectorAll('details[open]')].map(e => e.querySelector('summary span').textContent));
    const focused = document.activeElement?.closest('.contact-faq__item')?.querySelector('summary span').textContent;
    list.innerHTML = renderFAQItems(items);
    for (const detail of list.querySelectorAll('details')) {
      const question = detail.querySelector('summary span').textContent;
      detail.open = open.has(question);
      if (focused === question) detail.querySelector('summary').focus({ preventScroll: true });
    }
    previous = signature;
  }
  display(config.items || []);
  setState(config.csvUrl ? 'loading' : 'connected');
  async function refresh() {
    if (!config.csvUrl || busy || document.hidden) return;
    busy = true;
    try {
      const url = new URL(config.csvUrl);
      if (url.protocol !== 'https:' || url.hostname !== 'docs.google.com' || !url.pathname.startsWith('/spreadsheets/')) throw new Error('Expected Google Sheets CSV URL');
      const response = await fetch(url, { cache: 'no-store', signal: AbortSignal.any([controller.signal, AbortSignal.timeout(15000)]) });
      if (!response.ok) throw new Error('FAQ source unavailable');
      const csv = await response.text(); if (csv.length > 1000000 || csv.trimStart().startsWith('<')) throw new Error('Invalid FAQ CSV');
      display(questionsFromCSV(csv, { stopBefore: config.stopBefore }));
      setState('connected');
    } catch (error) {
      if (!controller.signal.aborted) { setState('unavailable'); console.warn('FAQ refresh failed; keeping last available content.'); }
    } finally { busy = false; }
  }
  if (config.csvUrl) {
    refresh(); timer = setInterval(refresh, Math.max(30, Number(config.refreshSeconds) || 60) * 1000);
    document.addEventListener('visibilitychange', refresh, { signal: controller.signal });
    retry?.addEventListener('click', refresh, { signal: controller.signal });
  }
  return { refresh, destroy() { controller.abort(); clearInterval(timer); } };
}
