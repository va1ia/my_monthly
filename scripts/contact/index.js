// 目录：1. 数据加载 2. 页面及共享组件挂载
import { readJSON } from '../shared/data.js';
import { mountMenuBar } from '../../components/menu-bar/menu-bar.js';
import { mountFooter } from '../../components/footer/footer.js';
import { createNewsletterSubscriber } from '../shared/newsletter.js';
import { renderCards } from '../../pages/contact/sections/cards/cards.js';
import { renderContactForm } from '../../pages/contact/sections/form/form.js';
import { renderFAQ } from '../../components/faq/faq.js';
import { mountFAQ } from '../shared/faq.js';
import { mountScrollBackground } from '../shared/scroll-background.js';
import { mountPointerParallax } from '../shared/pointer-parallax.js';
import { createContactSubmitter, mountContactForm } from './form.js';
const [navigation, content, form, newsletter, faq, background] = await Promise.all([
  readJSON('content/shared/navigation.json'), readJSON('content/contact/page.json'),
  readJSON('content/contact/form.json').catch(() => ({ enabled: false })),
  readJSON('content/shared/newsletter.json').catch(() => ({ enabled: false })),
  readJSON('content/shared/faq.json'), readJSON('content/shared/pre-footer-background.json')
]);
document.querySelector('#main').innerHTML = renderCards(content) + renderContactForm(content.form) + renderFAQ();
mountMenuBar(document.querySelector('#site-header'), { items: navigation.items, currentPage: 'contact' });
mountFooter(document.querySelector('#site-footer'), { ...navigation, subscribe: createNewsletterSubscriber(newsletter) });
mountPointerParallax(document.querySelector('.contact-cards'));
mountContactForm(document.querySelector('.contact-form'), createContactSubmitter(form));

mountFAQ(document.querySelector('.contact-faq'), faq);

mountScrollBackground(document.body, background);
