// 目录：1. 数据加载 2. 页面及共享组件挂载
import { mountMenuBar } from '../../components/menu-bar/menu-bar.js';
import { mountFooter } from '../../components/footer/footer.js';
import { createNewsletterSubscriber } from '../shared/newsletter.js';
import { renderCards } from '../../pages/contact/sections/cards/cards.js';
import { renderContactForm } from '../../pages/contact/sections/form/form.js';
import { renderFAQ } from '../../pages/contact/sections/faq/faq.js';
import { mountFAQ } from './faq.js';
import { mountScrollBackground } from '../shared/scroll-background.js';
import { mountContactMotion } from './motion.js';
import { createContactSubmitter, mountContactForm } from './form.js';
async function readJSON(path) {
  const response = await fetch(new URL(path, import.meta.url));
  if (!response.ok) throw new Error(`Could not load ${path}`);
  return response.json();
}
const [navigation, content, form, newsletter, faq, faqColors, background] = await Promise.all([
  readJSON('../../content/shared/navigation.json'), readJSON('../../content/contact/page.json'),
  readJSON('../../content/contact/form.json').catch(() => ({ enabled: false })),
  readJSON('../../content/shared/newsletter.json').catch(() => ({ enabled: false })),
  readJSON('../../content/contact/faq.json'), readJSON('../../content/contact/faq-colors.json'), readJSON('../../content/contact/background.json')
]);
document.querySelector('#main').innerHTML = renderCards(content) + renderContactForm(content.form) + renderFAQ();
mountMenuBar(document.querySelector('#site-header'), { items: navigation.items, currentPage: 'contact' });
mountFooter(document.querySelector('#site-footer'), { ...navigation, subscribe: createNewsletterSubscriber(newsletter) });
mountContactMotion(document.querySelector('.contact-cards'));
mountContactForm(document.querySelector('.contact-form'), createContactSubmitter(form));

mountFAQ(document.querySelector('.contact-faq'), faq, faqColors);

mountScrollBackground(document.body, background);
