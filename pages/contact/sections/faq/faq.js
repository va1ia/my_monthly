// 目录：1. 分区结构 2. 可访问折叠项与颜色
import { escapeHTML } from '../../../../scripts/shared/dom.js';
const title = new URL('../../../../assets/images/contact/faq/title.svg', import.meta.url).href;
export function renderFAQ() {
  return `<section class="contact-faq" aria-labelledby="faq-title"><div class="contact-faq__inner"><h2 id="faq-title" class="contact-faq__title"><img src="${title}" alt="Frequently asked questions"><span>Common FAQ</span></h2><div class="contact-faq__list"></div></div></section>`;
}
const safeColor = value => /^#[a-f\d]{6}$/i.test(value || '') ? value : '#dae3c3';
export function renderFAQItems(items, palette) {
  return items.map((item, index) => `<details class="contact-faq__item" style="--faq-color:${safeColor(palette.colors?.[index] || palette.fallback)}"><summary><span>${escapeHTML(item.question)}</span><span class="contact-faq__icon" aria-hidden="true"></span></summary><div class="contact-faq__answer">${escapeHTML(item.answer)}</div></details>`).join('');
}
