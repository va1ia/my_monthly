// 目录：1. 独立表单与重复提交 2. 失败重试 3. 组件销毁
import test from 'node:test';
import assert from 'node:assert/strict';
import { mountNewsletterForm } from './newsletter.js';
function fixture(subscribe, options) {
  const form = new EventTarget(), button = { disabled: false }, status = { textContent: '' };
  form.elements = { email: { value: 'reader@example.com' } };
  form.querySelector = () => button;
  const attributes = new Map();
  form.setAttribute = (name, value) => attributes.set(name, value);
  form.removeAttribute = name => attributes.delete(name);
  form.reset = () => { form.elements.email.value = ''; };
  mountNewsletterForm(form, status, subscribe, options);
  return { form, button, status, attributes, submit: () => form.dispatchEvent(new Event('submit', { cancelable: true })) };
}
const settle = () => new Promise(resolve => setImmediate(resolve));

test('locks only the submitting form, ignores repeat submissions and keeps custom success copy', async () => {
  let resolve, calls = 0;
  const first = fixture(() => { calls++; return new Promise(r => { resolve = r; }); }, { successMessage: 'Press success' });
  const other = fixture(async () => {});
  first.submit(); first.submit();
  assert.equal(calls, 1); assert.equal(first.button.disabled, true);
  assert.equal(first.attributes.get('aria-busy'), 'true');
  assert.equal(other.button.disabled, false);
  resolve(); await settle();
  assert.equal(first.status.textContent, 'Press success'); assert.equal(first.form.elements.email.value, '');
  assert.equal(first.button.disabled, false); assert.equal(first.attributes.has('aria-busy'), false);
  other.submit(); await settle();
  assert.match(other.status.textContent, /pinky promise/);
});

test('disconnected and failed submissions preserve the email and permit retry', async () => {
  const disconnected = fixture(undefined); disconnected.submit();
  assert.match(disconnected.status.textContent, /not connected/);
  let fail = true;
  const instance = fixture(async () => { if (fail) throw new Error('offline'); });
  instance.submit(); await settle();
  assert.match(instance.status.textContent, /Something went wrong/);
  assert.equal(instance.form.elements.email.value, 'reader@example.com'); assert.equal(instance.button.disabled, false);
  fail = false; instance.submit(); await settle(); assert.equal(instance.form.elements.email.value, '');
});

test('destroying the footer cancels its listener and prevents late success updates', async () => {
  const controller = new AbortController(); let resolve, signal, calls = 0;
  const instance = fixture((email, options) => { calls++; signal = options.signal; return new Promise(r => { resolve = r; }); }, { signal: controller.signal });
  instance.submit(); controller.abort(); resolve(); await settle();
  assert.equal(signal.aborted, true); assert.equal(instance.form.elements.email.value, 'reader@example.com');
  assert.doesNotMatch(instance.status.textContent, /Thanks/);
  instance.submit(); assert.equal(calls, 1);
});
