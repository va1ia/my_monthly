// 目录：1. 共享导航与页脚 2. 报名表单状态与接口
import { mountMenuBar } from '../../../components/menu-bar/menu-bar.js';
import { mountFooter } from '../../../components/footer/footer.js';
import { createNewsletterSubscriber } from '../../../scripts/shared/newsletter.js';

const root = new URL('../../../', import.meta.url);
async function readJSON(path) {
  const response = await fetch(new URL(path, root));
  if (!response.ok) throw new Error(`Could not load ${path}`);
  return response.json();
}

const navigation = await readJSON('content/shared/navigation.json');
for (const group of ['items', 'legal', 'social']) {
  navigation[group] = navigation[group].map(item => ({ ...item, href: new URL(item.href, root).href }));
}
const newsletter = await readJSON('content/shared/newsletter.json').catch(() => ({ enabled: false }));
mountMenuBar(document.querySelector('#site-header'), { items: navigation.items, currentPage: 'event', homeHref: root.href });
mountFooter(document.querySelector('#site-footer'), { ...navigation, homeHref: root.href, variant: 'period', pageType: 'event', subscribe: createNewsletterSubscriber(newsletter) });

const form = document.querySelector('.period-registration__form');
const status = document.querySelector('.period-registration__status');
const button = form.querySelector('button');
const config = await readJSON('event/the-state-of-the-period/form.json').catch(() => ({ enabled: false }));
let busy = false, submissionId = crypto.randomUUID(), previousPayload = '';
form.addEventListener('submit', async event => {
  event.preventDefault();
  if (busy || !form.reportValidity()) return;
  if (!config.enabled || !config.endpoint) {
    status.textContent = 'Registration is not available yet. Please contact hello@mymonthly.co for event information.';
    status.focus();
    return;
  }
  busy = true; button.disabled = true; button.textContent = 'Please wait...';
  form.setAttribute('aria-busy', 'true'); status.textContent = '';
  try {
    const payload = Object.fromEntries([...new FormData(form)].map(([key, value]) => [key, value.trim()]));
    const serialized = JSON.stringify(payload);
    if (previousPayload && previousPayload !== serialized) submissionId = crypto.randomUUID();
    previousPayload = serialized;
    const response = await fetch(config.endpoint, {
      method: 'POST', headers: { 'Content-Type': 'application/json', apikey: config.publishableKey },
      body: JSON.stringify({ ...payload, event: 'the-state-of-the-period', submissionId, contactConsent: true }), signal: AbortSignal.timeout(15000)
    });
    const result = await response.json();
    if (!response.ok || result.ok !== true) throw new Error('Registration failed');
    form.hidden = true;
    status.textContent = 'Thank you! Your submission has been received!';
  } catch {
    status.textContent = 'Oops! Something went wrong while submitting the form. Please try again or contact hello@mymonthly.co.';
  } finally {
    busy = false; button.disabled = false; button.textContent = 'Submit'; form.removeAttribute('aria-busy'); status.focus();
  }
});

// 接口配置和提交拦截就绪后启用，避免加载阶段回退为原生 GET 提交。
button.disabled = false;
