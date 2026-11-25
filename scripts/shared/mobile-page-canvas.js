// 目录：1. 页面边缘底色 2. 手机视口变化与清理
// 只管理 html 画布，保留 body 的 FAQ 换色及每个分区原有背景。
export function mountMobilePageCanvas(footer) {
  const document = footer.ownerDocument;
  const window = document.defaultView;
  const root = document.documentElement;
  const mobile = window.matchMedia('(max-width: 767px)');
  const controller = new AbortController();
  const options = {signal:controller.signal, passive:true};
  const property = '--mobile-page-background';
  const original = root.style.getPropertyValue(property);
  let frame = 0;
  const color = element => element ? window.getComputedStyle(element).backgroundColor : '';
  const opaque = value => value && value !== 'transparent' && value !== 'rgba(0, 0, 0, 0)';
  function restore() {
    if (original) root.style.setProperty(property, original);
    else root.style.removeProperty(property);
  }
  function update() {
    frame = 0;
    if (!mobile.matches) { restore(); return; }
    const menu = document.querySelector('.site-header.is-open .menu-bar__panel');
    let background;
    if (menu) background = color(menu);
    else if (window.scrollY > 0 && footer.getBoundingClientRect().top < window.innerHeight) background = color(footer);
    else {
      const sections = [...(document.querySelector('#main')?.children || [])];
      const surface = sections.find(section => {
        const rect = section.getBoundingClientRect();
        return rect.top <= window.innerHeight / 2 && rect.bottom > window.innerHeight / 2;
      }) || sections[0];
      background = color(surface);
      if (!opaque(background)) background = color(document.body);
      if (!opaque(background)) background = window.getComputedStyle(root).getPropertyValue('--color-picnic-date').trim();
    }
    if (background && root.style.getPropertyValue(property) !== background) root.style.setProperty(property, background);
  }
  function schedule() { if (!frame) frame = window.requestAnimationFrame(update); }
  window.addEventListener('scroll', schedule, options);
  window.addEventListener('resize', schedule, options);
  window.addEventListener('pageshow', schedule, options);
  mobile.addEventListener('change', schedule, options);
  window.visualViewport?.addEventListener('resize', schedule, options);
  window.visualViewport?.addEventListener('scroll', schedule, options);
  const resize = new ResizeObserver(schedule);
  resize.observe(document.body);
  const changes = new MutationObserver(schedule);
  changes.observe(document.body, {attributes:true, attributeFilter:['class','style']});
  const header = document.querySelector('.site-header');
  if (header) changes.observe(header, {attributes:true, attributeFilter:['class']});
  changes.observe(footer, {attributes:true, attributeFilter:['data-variant','style']});
  document.fonts?.ready.then(() => { if (!controller.signal.aborted) schedule(); });
  update();
  return {refresh:schedule, destroy() {
    controller.abort(); resize.disconnect(); changes.disconnect(); window.cancelAnimationFrame(frame); restore();
  }};
}
