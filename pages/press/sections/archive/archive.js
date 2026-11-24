// 目录：1. 素材 2. 订阅区 3. 文件夹与 newsletter 卡片
import { escapeHTML, linkAttributes } from '../../../../scripts/shared/dom.js';
const asset = name => new URL(`../../../../assets/images/press/archive/${name}`, import.meta.url).href;

export function renderPressArchive({ items }) {
  const chronologicalItems = [...items].sort((a, b) => a.publishedAt.localeCompare(b.publishedAt));
  const folder = (name, layer) => `<div class="press-archive__folder press-archive__folder--${name}" aria-hidden="true" style="--layer:${layer}"><img src="${asset(`folder-${name}.svg`)}" alt=""></div>`;
  return `<section class="press-archive" aria-labelledby="press-title">
    <picture class="press-archive__backdrop" aria-hidden="true">
      <source media="(max-width: 767px)" srcset="${asset('backdrop-mobile.svg')}">
      <img src="${asset('backdrop-desktop.svg')}" alt="" width="1808" height="1006">
    </picture>
    <div class="press-archive__signup">
      <h1 id="press-title" class="press-archive__title"><picture>
        <source media="(max-width: 767px)" srcset="${asset('subscribe-title-mobile.svg')}">
        <img src="${asset('subscribe-title.svg')}" alt="Subscribe to Monthly newsletter" width="959" height="171" fetchpriority="high">
      </picture></h1>
      <form class="press-archive__form">
        <label class="visually-hidden" for="press-email">Email address</label>
        <input id="press-email" name="email" type="email" autocomplete="email" placeholder="Yourname@email.com" aria-describedby="press-status" required>
        <button type="submit" aria-label="Subscribe to newsletter"><span aria-hidden="true">→</span></button>
        <p class="press-archive__status text-small" id="press-status" role="status" aria-live="polite"></p>
      </form>
      <p class="press-archive__intro text-larger">Enjoy <strong>one</strong> monthly email of essentials (news, app updates, events) here, or catch us on <a href="https://www.linkedin.com/company/your-monthly/" target="_blank" rel="noopener noreferrer"><strong>LinkedIn</strong></a>!</p>
    </div>
    <div class="press-archive__collection" role="group" aria-label="My Monthly Scoop newsletters">
      ${folder('back', 1)}
      ${chronologicalItems.map((item, index) => `<a class="press-archive__card press-archive__card--slot-${index + 1}" data-newsletter="${escapeHTML(item.id)}" data-published-at="${escapeHTML(item.publishedAt)}" ${linkAttributes({ ...item, external: true })} aria-label="Read ${escapeHTML(item.title)} (opens in a new tab)"><img src="${asset(item.image)}" alt="${escapeHTML(item.title)}" width="864" height="486" decoding="async"></a>`).join('')}
      ${folder('blue', 3)}${folder('gold', 5)}${folder('pink', 7)}${folder('linen', 9)}
    </div>
  </section>`;
}
