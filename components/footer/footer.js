// 目录：1. Footer 结构 2. 订阅适配接口 3. 背景变体与清理
import { escapeHTML, linkAttributes } from '../../scripts/shared/dom.js';
const asset = name => new URL(`../../assets/icons/${name}.svg`, import.meta.url).href;
export function mountFooter(host, { items, legal, social, variant = 'brand', subscribe, year = new Date().getFullYear() }) {
  const controller = new AbortController();
  const id = `newsletter-${crypto.randomUUID()}`;
  host.innerHTML = `<footer class="site-footer" data-variant="brand"><div class="site-footer__main">
    <div class="site-footer__newsletter"><h2>Subscribe to<br>our newsletter</h2>
      <form class="site-footer__form"><label class="visually-hidden" for="${id}">Email address</label><input id="${id}" type="email" name="email" autocomplete="email" placeholder="Yourname@email.com" required aria-describedby="${id}-status"><button type="submit" aria-label="Subscribe to newsletter">→</button></form>
      <p class="site-footer__status" id="${id}-status" role="status" aria-live="polite"></p>
      <a class="site-footer__brand" href="./" aria-label="My Monthly home"><img width="207" height="45" alt="My Monthly"></a>
    </div>
    <nav class="site-footer__navigation" aria-label="Footer navigation">${items.map(item=>`<a ${linkAttributes(item)}>${escapeHTML(item.label)}</a>`).join('')}</nav>
    <div class="site-footer__right"><nav class="site-footer__legal" aria-label="Legal">${legal.map(item=>`<a ${linkAttributes(item)}>${escapeHTML(item.label)}</a>`).join('')}</nav>
    <div class="site-footer__social">${social.map(item=>`<a ${linkAttributes({...item,external:true})} aria-label="${escapeHTML(item.label)}"><span class="site-footer__social-icon" style="--social-icon: url('${asset(item.icon)}')" aria-hidden="true"></span></a>`).join('')}</div></div>
    </div><p class="site-footer__copyright">© Copyright My Monthly ${escapeHTML(year)}. All Rights Reserved.</p></footer>`;
  const footer = host.querySelector('footer');
  const form = host.querySelector('form');
  const status = host.querySelector('[role="status"]');
  form.addEventListener('submit', async event => {
    event.preventDefault();
    if (!subscribe) { status.textContent = 'Newsletter signup is not connected yet. Please try again later.'; return; }
    const button = form.querySelector('button');
    button.disabled = true; status.textContent = 'Submitting…';
    try {
      await subscribe(form.elements.email.value, {signal:controller.signal});
      if (controller.signal.aborted) return;
      status.textContent = 'Thanks for joining! We’ll only send you things we’d want to read ourselves, pinky promise.';
      form.reset();
    } catch { if (!controller.signal.aborted) status.textContent = 'Oops! Something went wrong. Please try again.'; }
    finally { button.disabled = false; }
  }, {signal:controller.signal});
  function setVariant(value) {
    if (!['brand','dark','light'].includes(value)) throw new Error('Unknown footer variant');
    footer.dataset.variant = value;
    host.querySelector('.site-footer__brand img').src = asset(value === 'light' ? 'wordmark-green' : 'wordmark-beige');
  }
  setVariant(variant);
  return { setVariant, destroy() { controller.abort(); host.replaceChildren(); } };
}
