// 目录：1. 站点相对路径 2. 读取失败
import test from 'node:test';
import assert from 'node:assert/strict';
import { readJSON } from './data.js';

test('reads shared and nested page data relative to the site directory', async () => {
  const original = globalThis.fetch;
  const urls = [];
  globalThis.fetch = async url => { urls.push(url.href); return Response.json({ loaded: true }); };
  try {
    for (const path of ['content/shared/navigation.json', 'event/the-state-of-the-period/form.json']) {
      assert.deepEqual(await readJSON(path), { loaded: true });
      assert.equal(urls.at(-1), new URL(`../../${path}`, import.meta.url).href);
    }
  } finally { globalThis.fetch = original; }
});

test('rejects missing or malformed data so callers keep their existing fallback', async () => {
  const original = globalThis.fetch;
  try {
    globalThis.fetch = async () => new Response('', { status: 404 });
    await assert.rejects(readJSON('missing.json'), /Could not load missing.json/);
    globalThis.fetch = async () => new Response('invalid JSON');
    await assert.rejects(readJSON('broken.json'), SyntaxError);
  } finally { globalThis.fetch = original; }
});
