// 目录：1. 数据加载 2. 页面与共享组件
import { mountMenuBar } from '../../components/menu-bar/menu-bar.js';
import { mountFooter } from '../../components/footer/footer.js';
import { renderFAQ } from '../../components/faq/faq.js';
import { mountFAQ } from '../shared/faq.js';
import { mountScrollBackground } from '../shared/scroll-background.js';
import { downloadContent } from '../../content/download/page.js';
import { mountPointerParallax } from '../shared/pointer-parallax.js';
import { createNewsletterSubscriber } from '../shared/newsletter.js';
import { renderDownloadHero } from '../../pages/download/sections/hero/hero.js';
async function readJSON(path) {
  const response = await fetch(new URL(path, import.meta.url));
  if (!response.ok) throw new Error(`Could not load ${path}`);
  return response.json();
}
const [navigation, hero, faq, colors, newsletter] = await Promise.all([
  readJSON('../../content/shared/navigation.json'), readJSON('../../content/home/hero.json'),
  readJSON('../../content/contact/faq.json'), readJSON('../../content/contact/faq-colors.json'),
  readJSON('../../content/shared/newsletter.json').catch(() => ({ enabled: false }))
]);
document.querySelector('#main').innerHTML = renderDownloadHero(hero.downloadHref, downloadContent.version) + renderFAQ();
mountMenuBar(document.querySelector('#site-header'), { items: navigation.items, currentPage: 'download' });
mountFooter(document.querySelector('#site-footer'), { ...navigation, subscribe: createNewsletterSubscriber(newsletter) });
mountPointerParallax(document.querySelector('.download-hero'));
mountFAQ(document.querySelector('.contact-faq'), faq, colors);

mountScrollBackground(document.body, { triggerLine: .65, transitionMs: 2000, returnTransitionMs: 700, default: { colorToken: '--color-picnic-date' }, sections: [{ selector: '.contact-faq__inner', colorToken: '--color-darker-linen' }] });
