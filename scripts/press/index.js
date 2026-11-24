// 目录：1. 数据加载 2. 页面和共享组件 3. 订阅反馈
import { mountMenuBar } from '../../components/menu-bar/menu-bar.js';
import { mountFooter } from '../../components/footer/footer.js';
import { createNewsletterSubscriber } from '../shared/newsletter.js';
import { mountPointerParallax } from '../shared/pointer-parallax.js';
import { renderPressArchive } from '../../pages/press/sections/archive/archive.js';

async function readJSON(path) {
  const response = await fetch(new URL(path, import.meta.url));
  if (!response.ok) throw new Error(`Could not load ${path}`);
  return response.json();
}
const [navigation, archive, newsletter] = await Promise.all([
  readJSON('../../content/shared/navigation.json'),
  readJSON('../../content/press/archive.json'),
  readJSON('../../content/shared/newsletter.json').catch(() => ({ enabled: false }))
]);
const subscribe = createNewsletterSubscriber(newsletter);
document.querySelector('#main').innerHTML = renderPressArchive(archive);
mountMenuBar(document.querySelector('#site-header'), { items: navigation.items, currentPage: 'news' });
mountFooter(document.querySelector('#site-footer'), { ...navigation, subscribe });
mountPointerParallax(document.querySelector('.press-archive'));

const form = document.querySelector('.press-archive__form');
const status = document.querySelector('#press-status');
let submitting = false;
form.addEventListener('submit', async event => {
  event.preventDefault();
  if (submitting) return;
  if (!subscribe) { status.textContent = 'Newsletter signup is not connected yet. Please try again later.'; return; }
  submitting = true;
  const button = form.querySelector('button');
  button.disabled = true;
  form.setAttribute('aria-busy', 'true');
  status.textContent = 'Submitting…';
  try {
    await subscribe(form.elements.email.value);
    status.textContent = 'Thanks for joining! Keep an eye on your inbox.';
    form.reset();
  } catch {
    status.textContent = 'Oops! Something went wrong. Please try again.';
  } finally {
    submitting = false;
    button.disabled = false;
    form.removeAttribute('aria-busy');
  }
});
