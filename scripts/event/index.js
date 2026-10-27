// 目录：1. 共享数据 2. 页面挂载
import { mountMenuBar } from '../../components/menu-bar/menu-bar.js';
import { mountFooter } from '../../components/footer/footer.js';
import { createNewsletterSubscriber } from '../shared/newsletter.js';
import { renderEventPage } from '../../pages/event/event.js';
async function readJSON(path) {
  const response = await fetch(new URL(path, import.meta.url));
  if (!response.ok) throw new Error(`Could not load ${path}`);
  return response.json();
}
const [navigation, newsletter] = await Promise.all([
  readJSON('../../content/shared/navigation.json'),
  readJSON('../../content/shared/newsletter.json').catch(() => ({ enabled: false }))
]);
document.querySelector('#main').innerHTML = renderEventPage();
mountMenuBar(document.querySelector('#site-header'), { items: navigation.items, currentPage: 'event' });
mountFooter(document.querySelector('#site-footer'), { ...navigation, subscribe: createNewsletterSubscriber(newsletter) });
