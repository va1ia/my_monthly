// 目录：1. 结构与当前页 2. 开关及背景锁定 3. 键盘与尺寸变化 4. 清理接口
import { escapeHTML, linkAttributes } from '../../scripts/shared/dom.js';
const logo = new URL('../../assets/icons/wordmark-beige.svg', import.meta.url).href;
const illustration = new URL('./hamburger-img.svg', import.meta.url).href;
const focusArt = new URL('./hamburger-focus.svg', import.meta.url).href;

export function mountMenuBar(host, { items, currentPage = 'home', homeHref = './' }) {
  const controller = new AbortController();
  const options = { signal: controller.signal };
  const id = `site-navigation-${crypto.randomUUID()}`;
  host.innerHTML = `<header class="site-header"><div class="menu-bar">
    <a class="menu-bar__brand" ${linkAttributes({href:homeHref})} aria-label="My Monthly home"><img src="${logo}" alt="My Monthly" width="207" height="45"></a>
    <button class="menu-bar__toggle" type="button" aria-label="Open menu" aria-expanded="false" aria-controls="${id}"><span class="menu-bar__hamburger" aria-hidden="true"><span></span><span></span><span></span></span></button>
    <nav class="menu-bar__panel" id="${id}" aria-label="Main navigation">
      <img class="menu-bar__illustration" src="${illustration}" alt="" aria-hidden="true" width="402" height="483">
      <ul class="menu-bar__links">${items.filter(item => !item.hiddenInMenu).map(item => `<li><a class="menu-bar__link${item.id === 'download' ? ' menu-bar__link--download' : ''}" data-page="${escapeHTML(item.id)}" ${linkAttributes(item)}><img class="menu-bar__focus" src="${focusArt}" alt="" aria-hidden="true" width="212" height="77"><span>${escapeHTML(item.label)}</span></a></li>`).join('')}</ul>
    </nav></div></header>`;
  const header = host.querySelector('header');
  const panel = host.querySelector('nav');
  const button = host.querySelector('button');
  const mobile = matchMedia('(max-width: 991px)');
  let open = false, scrollY = 0, savedBodyStyle, savedScrollBehavior, background = [];
  function setCurrentPage(page) {
    host.querySelectorAll('[data-page]').forEach(link => {
      if (link.dataset.page === page) link.setAttribute('aria-current', 'page');
      else link.removeAttribute('aria-current');
    });
  }
  function setOpen(next, restoreFocus = true) {
    next = Boolean(next && mobile.matches);
    if (next === open) return;
    open = next;
    panel.inert = mobile.matches && !open;
    header.classList.toggle('is-open', open);
    button.setAttribute('aria-expanded', String(open));
    button.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    if (open) {
      scrollY = window.scrollY;
      savedBodyStyle = document.body.getAttribute('style');
      savedScrollBehavior = document.documentElement.style.scrollBehavior;
      document.body.style.position = 'fixed'; document.body.style.top = `-${scrollY}px`;
      document.body.style.width = '100%'; document.body.style.overflow = 'hidden';
      // 锁定 header 宿主之外的内容，保留原有 inert 状态。
      background = [...document.body.children].filter(el => el !== host && !['SCRIPT','STYLE'].includes(el.tagName)).map(el => [el, el.inert]);
      background.forEach(([el]) => { el.inert = true; });
      panel.querySelector('[aria-current="page"]')?.focus({preventScroll:true});
    } else {
      if (savedBodyStyle === null) document.body.removeAttribute('style');
      else document.body.setAttribute('style', savedBodyStyle);
      background.forEach(([el, previous]) => { el.inert = previous; });
      document.documentElement.style.scrollBehavior = 'auto';
      window.scrollTo(0, scrollY);
      document.documentElement.style.scrollBehavior = savedScrollBehavior;
      if (restoreFocus) button.focus({preventScroll:true});
    }
  }
  button.addEventListener('click', () => setOpen(!open), options);
  panel.addEventListener('click', event => { if (event.target.closest('a')) setOpen(false); }, options);
  document.addEventListener('keydown', event => {
    if (!open) return;
    if (event.key === 'Escape') { event.preventDefault(); setOpen(false); }
    if (event.key === 'Tab') {
      const stops = [...header.querySelectorAll('a, button')];
      const first = stops[0], last = stops.at(-1);
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
    }
  }, options);
  mobile.addEventListener('change', () => { setOpen(false, false); panel.inert = mobile.matches; }, options);
  panel.inert = mobile.matches;
  setCurrentPage(currentPage);
  return { setCurrentPage, close: () => setOpen(false), destroy() { setOpen(false, false); controller.abort(); host.replaceChildren(); } };
}
