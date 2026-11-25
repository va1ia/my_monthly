// 目录：1. 表格映射和安全输出 2. 自动同步、删除、焦点与失败保留
import test from 'node:test';
import assert from 'node:assert/strict';
import { questionsFromCSV, mountFAQ } from '../shared/faq.js';
import { renderFAQ, renderFAQItems } from '../../components/faq/faq.js';

test('maps all complete rows and preserves multiline source text without executing HTML', () => {
  const rows = questionsFromCSV('Q,A\nFirst?,"Line one\n\nLine two"\nCOMING SOON,\nLast?,"<img src=x onerror=alert(1)>"');
  assert.equal(rows.length, 2);
  assert.equal(rows[0].answer, 'Line one\n\nLine two');
  assert.match(renderFAQItems(rows), /&lt;img/);
  assert.doesNotMatch(renderFAQItems(rows), /<img/);
  assert.match(renderFAQ({ variant: 'full' }), /<h1[^>]*>FAQ<\/h1>/);
  assert.doesNotMatch(renderFAQ({ variant: 'full' }), /contact-faq__note/);
});

test('excludes the configured section and everything below it without changing other FAQ sources', () => {
  const csv = 'Q,A\nPublished?,Ready\n" Coming   Soon ",\nDraft?,Not ready';
  assert.deepEqual(questionsFromCSV(csv, { stopBefore: 'COMING SOON' }), [{ question: 'Published?', answer: 'Ready' }]);
  assert.equal(questionsFromCSV(csv).length, 2);
});

test('refresh updates and removes rows, preserves open question and focus, and retains loaded content on failure', async () => {
  const originalDocument = globalThis.document, originalFetch = globalThis.fetch, originalSetInterval = globalThis.setInterval;
  let csv = 'Q,A\nFirst?,Original answer\nSecond?,Another answer', fail = false, interval;
  const decode = text => text.replaceAll('&#39;', "'").replaceAll('&amp;', '&').replaceAll('&lt;', '<').replaceAll('&gt;', '>').replaceAll('&quot;', '"');
  const document = { hidden: false, activeElement: null, addEventListener() {} };
  let details = [], markup = '';
  const list = {
    get innerHTML() { return markup; },
    set innerHTML(value) {
      markup = value;
      details = [...value.matchAll(/<summary><span>([\s\S]*?)<\/span>/g)].map(match => {
        const detail = { open: false, querySelector(selector) {
          return selector === 'summary span' ? { textContent: decode(match[1]) }
            : { focus() { document.activeElement = { closest: () => detail }; } };
        } };
        return detail;
      });
    },
    querySelectorAll(selector) { return selector === 'details[open]' ? details.filter(item => item.open) : details; }
  };
  const status = { textContent: '' }, retry = { hidden: true, addEventListener() {} };
  const section = { dataset: {}, querySelector(selector) {
    return selector === '.contact-faq__list' ? list : selector === '[data-faq-status]' ? status : retry;
  } };
  globalThis.setInterval = (callback, milliseconds) => { interval = { callback, milliseconds }; return 0; };
  globalThis.document = document;
  globalThis.fetch = async () => { if (fail) throw Error('offline'); return new Response(csv); };
  const instance = mountFAQ(section, { csvUrl: 'https://docs.google.com/spreadsheets/d/test/export?format=csv', refreshSeconds: 60, stopBefore: 'COMING SOON' });
  try {
    await new Promise(resolve => setImmediate(resolve));
    assert.equal(section.dataset.sourceState, 'connected'); assert.equal(details.length, 2);
    assert.equal(interval.milliseconds, 60000);
    details[0].open = true; document.activeElement = { closest: () => details[0] };
    csv = 'Q,A\nFirst?,Updated answer\nThird?,New answer\nCOMING SOON,\nDraft?,Not ready';
    await interval.callback();
    assert.equal(details.length, 2); assert.equal(details[0].open, true);
    assert.equal(document.activeElement.closest().querySelector('summary span').textContent, 'First?');
    assert.match(markup, /Updated answer/); assert.match(markup, /Third\?/); assert.doesNotMatch(markup, /Second\?/);
    fail = true; await instance.refresh();
    assert.equal(section.dataset.sourceState, 'unavailable'); assert.equal(retry.hidden, false); assert.match(markup, /Updated answer/);
    fail = false; csv = 'Q,A\n'; await instance.refresh();
    assert.equal(details.length, 0); assert.equal(section.dataset.sourceState, 'connected'); assert.match(status.textContent, /No questions/);
  } finally {
    instance.destroy(); globalThis.document = originalDocument; globalThis.fetch = originalFetch; globalThis.setInterval = originalSetInterval;
  }
});
