// 目录：1. 请求与清洗 2. 无效报名拒绝 3. 存储失败与请求边界
import test from 'node:test';
import assert from 'node:assert/strict';
import { handleEventRegistration } from '../../../supabase/functions/event-register/handler.js';

const valid = { name: ' TEST ONLY ', role: 'Founder', email: ' EVENT-TEST@EXAMPLE.COM ', social: '@test-only', event: 'the-state-of-the-period', submissionId: '06960f6e-5e2b-4bd5-9cfe-abedbe9c665d', contactConsent: true, website: '' };
const request = data => new Request('https://example.com', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) });

test('saves normalized registration only after validation', async () => {
  let saved;
  const result = await handleEventRegistration(request(valid), async data => { saved = data; });
  assert.equal(result.status, 200);
  assert.deepEqual(await result.json(), { ok: true });
  assert.equal(saved.name, 'TEST ONLY'); assert.equal(saved.email, 'event-test@example.com');
  assert.equal(saved.contactConsent, true);
});
test('rejects unknown event, invalid roles, missing consent, invalid email, honeypot and overlong fields', async () => {
  for (const change of [{ event: 'another-event' }, { role: 'Admin' }, { contactConsent: false }, { email: 'invalid' }, { website: 'spam' }, { name: ' ' }, { social: 'x'.repeat(501) }, { submissionId: 'invalid' }]) {
    let saved = false;
    const result = await handleEventRegistration(request({ ...valid, ...change }), async () => { saved = true; });
    assert.equal(result.status, 400); assert.equal(saved, false);
  }
});
test('does not report success when persistence fails', async () => {
  const result = await handleEventRegistration(request(valid), async () => { throw Error('unavailable'); });
  assert.equal(result.status, 503); assert.deepEqual(await result.json(), { ok: false });
});
test('rejects oversized requests and unsupported methods', async () => {
  assert.equal((await handleEventRegistration(request({ data: 'x'.repeat(4097) }), async () => {})).status, 413);
  assert.equal((await handleEventRegistration(new Request('https://example.com'), async () => {})).status, 405);
});
