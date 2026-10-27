// 目录：1. 数据加载 2. 首页及共享组件挂载
import { mountMenuBar } from '../../components/menu-bar/menu-bar.js';
import { mountFooter } from '../../components/footer/footer.js';
import { createNewsletterSubscriber } from '../shared/newsletter.js';
import { renderHero } from '../../pages/home/sections/hero/hero.js';
import { mountHeroMotion } from './hero.js';
import { loadMarqueeLogos, mountMarquee } from './marquee.js';
async function readJSON(path) {
  const response = await fetch(new URL(path, import.meta.url));
  if (!response.ok) throw new Error(`Could not load ${path}`);
  return response.json();
}
const [navigation, hero, newsletter, logos] = await Promise.all([
  readJSON('../../content/shared/navigation.json'),
  readJSON('../../content/home/hero.json'),
  readJSON('../../content/shared/newsletter.json').catch(() => ({enabled:false})),
  loadMarqueeLogos().catch(() => [])
]);
document.querySelector('#main').innerHTML = renderHero(hero, logos);
mountMenuBar(document.querySelector('#site-header'), {items:navigation.items, currentPage:'home'});
mountFooter(document.querySelector('#site-footer'), {...navigation, subscribe:createNewsletterSubscriber(newsletter)});
mountHeroMotion(document.querySelector('.home-hero'));
mountMarquee(document.querySelector('.home-hero__marquee'), logos);
