// 目录：1. 数据加载 2. 页面和共享组件 3. 订阅反馈
import { readJSON } from '../shared/data.js';
import { mountMenuBar } from '../../components/menu-bar/menu-bar.js';
import { mountFooter } from '../../components/footer/footer.js';
import { createNewsletterSubscriber, mountNewsletterForm } from '../shared/newsletter.js';
import { mountPointerParallax } from '../shared/pointer-parallax.js';
import { renderPressArchive } from '../../pages/press/sections/archive/archive.js';

const [navigation, archive, newsletter] = await Promise.all([
  readJSON('content/shared/navigation.json'),
  readJSON('content/press/archive.json'),
  readJSON('content/shared/newsletter.json').catch(() => ({ enabled: false }))
]);
const subscribe = createNewsletterSubscriber(newsletter);
document.querySelector('#main').innerHTML = renderPressArchive(archive);
mountMenuBar(document.querySelector('#site-header'), { items: navigation.items, currentPage: 'news' });
mountFooter(document.querySelector('#site-footer'), { ...navigation, subscribe });
mountPointerParallax(document.querySelector('.press-archive'));

const form = document.querySelector('.press-archive__form');
const status = document.querySelector('#press-status');
mountNewsletterForm(form, status, subscribe, { successMessage: 'Thanks for joining! Keep an eye on your inbox.' });
