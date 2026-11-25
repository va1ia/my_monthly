// 目录：1. 分区结构 2. 可访问折叠项
import { escapeHTML } from '../../scripts/shared/dom.js';
export function renderFAQ({ variant = 'default' } = {}) {
  if (variant === 'full') {
    return `<section class="contact-faq contact-faq--full" aria-labelledby="faq-title"><div class="contact-faq__inner"><h1 id="faq-title" class="full-faq__title">FAQ</h1><div class="full-faq__questions"><p class="full-faq__status text-body" data-faq-status role="status" aria-live="polite">Loading questions…</p><button class="full-faq__retry" data-faq-retry type="button" hidden>Try again</button><div class="contact-faq__list"></div></div></div></section>`;
  }
  return `<section class="contact-faq${variant === 'linen' ? ' contact-faq--linen' : ''}" aria-labelledby="faq-title"><div class="contact-faq__inner"><div class="contact-faq__note"><h2 id="faq-title" class="contact-faq__title">Questions?<br>We’ve got you.</h2><p>Need more info? Head over to our <a href="./faq.html">FAQ page</a> for quick answers and more details.</p></div><div class="contact-faq__list"></div></div></section>`;
}
export function renderFAQItems(items) {
  return items.map(item => `<details class="contact-faq__item"><summary><span>${escapeHTML(item.question)}</span><span class="contact-faq__icon" aria-hidden="true"></span></summary><div class="contact-faq__answer text-larger">${escapeHTML(item.answer)}</div></details>`).join('');
}
