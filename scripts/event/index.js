// 目录：1. 共享数据 2. 页面挂载
import { readJSON } from '../shared/data.js';
import { mountMenuBar } from '../../components/menu-bar/menu-bar.js';
import { mountFooter } from '../../components/footer/footer.js';
import { createNewsletterSubscriber } from '../shared/newsletter.js';
import { renderEventPage } from '../../pages/event/event.js';
const [navigation, newsletter] = await Promise.all([
  readJSON('content/shared/navigation.json'),
  readJSON('content/shared/newsletter.json').catch(() => ({ enabled: false }))
]);
document.querySelector('#main').innerHTML = renderEventPage();
mountMenuBar(document.querySelector('#site-header'), { items: navigation.items, currentPage: 'event' });
mountFooter(document.querySelector('#site-footer'), { ...navigation, pageType: 'event', subscribe: createNewsletterSubscriber(newsletter) });
