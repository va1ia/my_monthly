// 目录：1. 后端输入与失败 2. 前端适配器
import assert from 'node:assert/strict';
import { handleContact } from '../../../supabase/functions/contact-submit/handler.js';
import { createContactSubmitter } from '../form.js';
const valid = { firstName: ' Val ', lastName: ' Test ', email: ' TEST@example.com ', questionType: 'First', message: 'Test', submissionId: '4200a862-8caa-424a-9e93-b88f3a0d7310', website: '' };
const request = data => new Request('https://test/contact', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) });
let saved, calls = 0;
assert.equal((await handleContact(request(valid), async data => { saved = data; calls++; })).status, 200);
assert.equal(saved.email, 'test@example.com');
assert.equal(saved.firstName, 'Val');
for (const change of [{ email: 'wrong' }, { message: ' ' }, { firstName: '' }, { lastName: 3 }, { questionType: 'fake' }, { submissionId: 'fake' }, { website: 'spam' }, { message: 'x'.repeat(5001) }]) {
  assert.equal((await handleContact(request({ ...valid, ...change }), async () => calls++)).status, 400);
}
assert.equal(calls, 1);
assert.equal((await handleContact(request(valid), async () => { throw Error(); })).status, 503);
assert.equal((await handleContact(request({ ...valid, message: 'x'.repeat(33000) }), async () => calls++)).status, 413);
assert.equal((await handleContact(new Request('https://test'), async () => {})).status, 405);
let captured;
const config = { enabled: true, url: 'https://test', publishableKey: 'public' };
await createContactSubmitter(config, async (url, options) => { captured = { url, options }; return Response.json({ ok: true }); })({ message: 'hello' });
assert.equal(captured.url, 'https://test/functions/v1/contact-submit');
assert.equal(JSON.parse(captured.options.body).message, 'hello');
await assert.rejects(createContactSubmitter(config, async () => Response.json({ ok: false }, { status: 503 }))({}));
assert.equal(createContactSubmitter({ enabled: false }), undefined);
console.log('Contact handler and adapter checks passed.');
