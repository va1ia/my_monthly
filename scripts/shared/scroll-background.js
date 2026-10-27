// 目录：1. 配置与状态 2. 滚动、布局变化与清理
// 每个分区顶部越过视口 triggerLine 后，应用该分区状态；上滚自动回退。
export function mountScrollBackground(target, config, { onChange = () => {} } = {}) {
  const controller = new AbortController();
  const options = { signal: controller.signal, passive: true };
  const sections = config.sections.map(state => ({ state, element: document.querySelector(state.selector) })).filter(entry => entry.element);
  const line = Math.min(1, Math.max(0, config.triggerLine ?? .75));
  const originalBackground = target.style.getPropertyValue('--page-background');
  const originalDuration = target.style.getPropertyValue('--page-background-duration');
  const hadClass = target.classList.contains('scroll-background');
  let frame = 0, current;
  target.classList.add('scroll-background');
  target.style.setProperty('--page-background-duration', `${Math.max(0, config.transitionMs ?? 400)}ms`);
  function update() {
    frame = 0;
    let next = config.default;
    for (const entry of sections) {
      if (entry.element.getBoundingClientRect().top <= innerHeight * line) next = entry.state;
    }
    if (next === current) return;
    current = next;
    target.style.setProperty('--page-background', `var(${next.colorToken})`);
    onChange(next);
  }
  function schedule() { if (!frame) frame = requestAnimationFrame(update); }
  window.addEventListener('scroll', schedule, options);
  window.addEventListener('resize', schedule, options);
  window.addEventListener('pageshow', schedule, options);
  const observer = new ResizeObserver(schedule);
  observer.observe(target);
  document.fonts.ready.then(() => { if (!controller.signal.aborted) schedule(); });
  update();
  return { refresh: schedule, destroy() {
    controller.abort(); observer.disconnect(); cancelAnimationFrame(frame);
    target.style.setProperty('--page-background', originalBackground);
    target.style.setProperty('--page-background-duration', originalDuration);
    if (!hadClass) target.classList.remove('scroll-background');
  } };
}
