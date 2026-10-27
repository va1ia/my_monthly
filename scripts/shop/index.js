// 目录：1. 页面数据 2. 展示墙和共享组件
import { mountMenuBar } from '../../components/menu-bar/menu-bar.js';
import { mountFooter } from '../../components/footer/footer.js';
import { createNewsletterSubscriber } from '../shared/newsletter.js';
import { mountShopping } from './shopping.js';
import { renderMerch } from '../../pages/shop/sections/merch/merch.js';
async function readJSON(path) {
  const response = await fetch(new URL(path, import.meta.url));
  if (!response.ok) throw new Error(`Could not load ${path}`);
  return response.json();
}
const [navigation, config, manifest, newsletter, catalog, checkout] = await Promise.all([
  readJSON('../../content/shared/navigation.json'), readJSON('../../content/shop/merch.json'),
  readJSON('../../content/shop/products.json'), readJSON('../../content/shared/newsletter.json').catch(()=>({enabled:false})),
  readJSON('../../content/shop/catalog.json'), readJSON('../../content/shop/checkout.json')
]);
document.querySelector('#main').innerHTML = renderMerch(config, manifest, catalog);
mountMenuBar(document.querySelector('#site-header'), { items: navigation.items, currentPage: 'shop' });
mountFooter(document.querySelector('#site-footer'), { ...navigation, subscribe: createNewsletterSubscriber(newsletter) });

mountShopping(document.querySelector('#main'), catalog, manifest, checkout);
