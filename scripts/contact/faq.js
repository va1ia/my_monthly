// 目录：1. CSV 解析 2. 两列映射 3. 自动更新与保留展开状态
import { renderFAQItems } from '../../pages/contact/sections/faq/faq.js';
import { parseCSV } from '../shared/csv.js';
export { parseCSV } from '../shared/csv.js';
export function questionsFromCSV(text) {
  const rows = parseCSV(text);
  const headers = rows.shift()?.map(v => v.trim().toLowerCase());
  if (!headers || !['问题', 'question', 'q'].includes(headers[0]) || !['回答', 'answer', 'a'].includes(headers[1])) throw new Error('Expected 问题/回答, Question/Answer or Q/A headers');
  const items = rows.filter(row => row[0]?.trim() && row[1]?.trim()).map(row => ({ question: row[0].trim(), answer: row[1].trim() }));
  if (items.length > 200) throw new Error('FAQ row limit exceeded');
  return items;
}
export function mountFAQ(section, config, palette) {
  const list = section.querySelector('.contact-faq__list');
  const controller = new AbortController(); let previous = '', busy = false, timer;
  function display(items) {
    const signature = JSON.stringify(items); if (signature === previous) return;
    const open = new Set([...list.querySelectorAll('details[open]')].map(e => e.querySelector('summary span').textContent));
    const focused = document.activeElement?.closest('.contact-faq__item')?.querySelector('summary span').textContent;
    list.innerHTML = renderFAQItems(items, palette);
    for (const detail of list.querySelectorAll('details')) {
      const question = detail.querySelector('summary span').textContent;
      detail.open = open.has(question);
      if (focused === question) detail.querySelector('summary').focus({ preventScroll: true });
    }
    previous = signature;
  }
  display(config.items || []);
  async function refresh() {
    if (!config.csvUrl || busy || document.hidden) return;
    busy = true;
    try {
      const url = new URL(config.csvUrl);
      if (url.protocol !== 'https:' || url.hostname !== 'docs.google.com' || !url.pathname.startsWith('/spreadsheets/')) throw new Error('Expected Google Sheets CSV URL');
      const response = await fetch(url, { cache: 'no-store', signal: AbortSignal.any([controller.signal, AbortSignal.timeout(15000)]) });
      if (!response.ok) throw new Error('FAQ source unavailable');
      const csv = await response.text(); if (csv.length > 1000000 || csv.trimStart().startsWith('<')) throw new Error('Invalid FAQ CSV');
      display(questionsFromCSV(csv));
      section.dataset.sourceState = 'connected';
    } catch (error) {
      if (!controller.signal.aborted) { section.dataset.sourceState = 'unavailable'; console.warn('FAQ refresh failed; keeping last available content.'); }
    } finally { busy = false; }
  }
  if (config.csvUrl) {
    refresh(); timer = setInterval(refresh, Math.max(30, Number(config.refreshSeconds) || 60) * 1000);
    document.addEventListener('visibilitychange', refresh, { signal: controller.signal });
  }
  return { refresh, destroy() { controller.abort(); clearInterval(timer); } };
}
