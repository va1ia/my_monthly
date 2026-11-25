// 目录：1. 页面结构与共享 FAQ 2. 全站导航与 Footer
import { renderFAQPage } from '../../pages/faq/page.js';
import { mountFAQ } from '../shared/faq.js';
import { mountMenuBar } from '../../components/menu-bar/menu-bar.js';
import { mountFooter } from '../../components/footer/footer.js';
import { createNewsletterSubscriber } from '../shared/newsletter.js';

async function readJSON(path) {
  const response = await fetch(new URL(path, import.meta.url));
  if (!response.ok) throw new Error(`Could not load ${path}`);
  return response.json();
}

document.querySelector('#main').innerHTML = renderFAQPage();
const config = await readJSON('../../content/faq/source.json');
mountFAQ(document.querySelector('.contact-faq'), config);

const [navigation, newsletter] = await Promise.all([
  readJSON('../../content/shared/navigation.json'),
  readJSON('../../content/shared/newsletter.json').catch(() => ({ enabled: false }))
]);
mountMenuBar(document.querySelector('#site-header'), { items: navigation.items, currentPage: 'faq' });
mountFooter(document.querySelector('#site-footer'), { ...navigation, subscribe: createNewsletterSubscriber(newsletter) });
