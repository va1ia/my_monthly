// 目录：1. Supabase 适配器 2. 提交与重试状态 3. 生命周期
export function createContactSubmitter(config, request = fetch) {
  if (!config.enabled) return undefined;
  return async (data, { signal } = {}) => {
    const response = await request(`${config.url}/functions/v1/contact-submit`, {
      method: 'POST', signal: AbortSignal.any([AbortSignal.timeout(15000), ...(signal ? [signal] : [])]),
      headers: { 'Content-Type': 'application/json', apikey: config.publishableKey },
      body: JSON.stringify(data)
    });
    const result = await response.json();
    if (!response.ok || result.ok !== true) throw new Error('Contact submission failed');
  };
}
export function mountContactForm(section, submit) {
  const controller = new AbortController();
  const form = section.querySelector('form');
  const button = form.querySelector('button[type="submit"]');
  const status = section.querySelector('[role="status"]');
  let busy = false, submissionId = crypto.randomUUID(), previousPayload = '';
  form.addEventListener('submit', async event => {
    event.preventDefault();
    if (busy || !form.reportValidity()) return;
    status.textContent = '';
    if (!submit) {
      status.textContent = 'The form is not available yet. Please email hello@mymonthly.co.';
      status.focus(); return;
    }
    const data = Object.fromEntries(new FormData(form));
    for (const key of Object.keys(data)) data[key] = data[key].trim();
    if (!data.firstName || !data.lastName || !data.message) {
      status.textContent = 'Please enter your name and message.'; status.focus(); return;
    }
    const payload = JSON.stringify(data);
    if (previousPayload && payload !== previousPayload) submissionId = crypto.randomUUID();
    previousPayload = payload;
    busy = true; button.disabled = true; button.textContent = 'Please wait...';
    form.setAttribute('aria-busy', 'true');
    try {
      await submit({ ...data, submissionId }, { signal: controller.signal });
      form.hidden = true;
      status.textContent = 'Thank you! Your submission has been received!';
      status.focus();
    } catch {
      if (!controller.signal.aborted) {
        status.textContent = 'Oops! Something went wrong while submitting the form. Please try again or email hello@mymonthly.co.';
        status.focus();
      }
    } finally {
      busy = false; button.disabled = false; button.textContent = 'Get In Touch';
      form.removeAttribute('aria-busy');
    }
  }, { signal: controller.signal });
  return { destroy() { controller.abort(); } };
}
