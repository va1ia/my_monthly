// 目录：1. 联系卡片结构；原始 SVG 装饰与可访问文字分离
import { escapeHTML } from '../../../../scripts/shared/dom.js';
const asset = name => new URL(`../../../../assets/images/contact/${name}.svg`, import.meta.url).href;
export function renderCards({ cards }) {
  return `<section class="contact-cards" aria-label="Contact My Monthly">
    <div class="contact-cards__pattern" aria-hidden="true"><picture>
      <source media="(max-width: 767px)" srcset="${asset('bg-pattern-phone')}">
      <img src="${asset('bg-pattern-pc')}" alt="" fetchpriority="high">
    </picture></div>
    <div class="contact-cards__container">${cards.map(card => `<article class="contact-cards__card contact-cards__card--${escapeHTML(card.variant)}">
      <img class="contact-cards__illustration" src="${asset(card.variant)}" alt="" width="460" height="${card.variant === 'sad' ? 433 : 518}">
      <div class="contact-cards__text"><h2>${escapeHTML(card.title)}</h2><div class="contact-cards__copy">
        <p>${escapeHTML(card.description)}${card.variant === 'loved' ? ` <a href="mailto:${escapeHTML(card.email)}">${escapeHTML(card.email)}</a>${escapeHTML(card.afterEmail)}` : ''}</p>
        <p>${card.variant === 'sad' ? `Contact <a href="mailto:${escapeHTML(card.email)}?subject=Brand%20Collab%20Inquiry">${escapeHTML(card.email)}</a> to learn more.` : escapeHTML(card.note)}</p>
      </div></div>
    </article>`).join('')}</div>
  </section>`;
}
