// 目录：1. Supabase 订阅适配器 2. 表单状态与清理
export function createNewsletterSubscriber(config, request = fetch) {
  if (!config.enabled) return undefined;
  return async (email, { signal } = {}) => {
    const response = await request(`${config.url}/functions/v1/newsletter-subscribe`, {
      method: 'POST', signal: AbortSignal.any([AbortSignal.timeout(15000), ...(signal ? [signal] : [])]),
      headers: { 'Content-Type': 'application/json', apikey: config.publishableKey },
      body: JSON.stringify({ email })
    });
    const result = await response.json();
    if (!response.ok || result.ok !== true) throw new Error('Newsletter subscription failed');
  };
}

// Press 与 Footer 复用；状态和锁定只属于传入的这一份表单。
export function mountNewsletterForm(form, status, subscribe, {
  signal,
  successMessage = 'Thanks for joining! We’ll only send you things we’d want to read ourselves, pinky promise.'
} = {}) {
  let submitting = false;
  form.addEventListener('submit', async event => {
    event.preventDefault();
    if (submitting) return;
    if (!subscribe) {
      status.textContent = 'Newsletter signup is not connected yet. Please try again later.';
      return;
    }
    submitting = true;
    const button = form.querySelector('button');
    button.disabled = true;
    form.setAttribute('aria-busy', 'true');
    status.textContent = 'Submitting…';
    try {
      await subscribe(form.elements.email.value, { signal });
      if (signal?.aborted) return;
      status.textContent = successMessage;
      form.reset();
    } catch {
      if (!signal?.aborted) status.textContent = 'Oops! Something went wrong. Please try again.';
    } finally {
      submitting = false;
      button.disabled = false;
      form.removeAttribute('aria-busy');
    }
  }, { signal });
}
