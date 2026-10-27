// 目录：1. 分区结构 2. 可访问折叠项与颜色
import { escapeHTML } from '../../scripts/shared/dom.js';
export function renderFAQ() {
  return `<section class="contact-faq" aria-labelledby="faq-title"><div class="contact-faq__inner"><div class="contact-faq__note"><h2 id="faq-title" class="contact-faq__title">Questions?<br>We’ve got you.</h2><p>Need more info? Head over to our <a href="./faq.html">FAQ page</a> for quick answers and more details.</p></div><div class="contact-faq__list"></div></div></section>`;
}
const safeColor = value => {
  const hex = typeof value === 'string' ? value.trim().replace(/^#/, '') : '';
  return /^[a-f\d]{6}$/i.test(hex) ? `#${hex}` : '#dae3c3';
};
export function renderFAQItems(items, palette) {
  return items.map((item, index) => `<details class="contact-faq__item" style="--faq-color:${safeColor(palette.colors?.[index] || palette.fallback)}"><summary><span>${escapeHTML(item.question)}</span><span class="contact-faq__icon" aria-hidden="true"></span></summary><div class="contact-faq__answer">${escapeHTML(item.answer)}</div></details>`).join('');
}
