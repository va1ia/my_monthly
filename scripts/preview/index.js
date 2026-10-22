import { createNewsletterSubscriber } from '../shared/newsletter.js';
// 目录：1. 加载共享配置 2. 挂载组件 3. 预览切换
import { mountMenuBar } from '../../components/menu-bar/menu-bar.js';
import { mountFooter } from '../../components/footer/footer.js';
const response = await fetch(new URL('../../content/shared/navigation.json', import.meta.url));
if (!response.ok) throw new Error('Navigation configuration could not be loaded');
const config = await response.json();
const pageControl = document.querySelector('#preview-page');
const requestedPage = new URL(location.href).searchParams.get('page') || 'home';
pageControl.value = [...pageControl.options].some(option => option.value === requestedPage) ? requestedPage : 'home';
const menu = mountMenuBar(document.querySelector('#site-header'), { items: config.items, currentPage: pageControl.value });
const newsletterResponse = await fetch(new URL('../../content/shared/newsletter.json', import.meta.url));
const newsletterConfig = newsletterResponse.ok ? await newsletterResponse.json() : { enabled: false };
const footer = mountFooter(document.querySelector('#site-footer'), { ...config, subscribe: createNewsletterSubscriber(newsletterConfig) });
pageControl.addEventListener('change', () => {
  menu.setCurrentPage(pageControl.value);
  const url = new URL(location.href); url.searchParams.set('page', pageControl.value); history.replaceState(null, '', url);
});
document.querySelector('#preview-footer').addEventListener('change', event => footer.setVariant(event.target.value));
