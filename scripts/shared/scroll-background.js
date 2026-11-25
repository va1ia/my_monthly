// 目录：1. 配置与状态 2. 滚动、布局变化与清理
// 每个可见分区顶部越过视口触发线后应用状态；分区可覆盖默认触发线，上滚自动回退。
export function mountScrollBackground(target, config, { onChange = () => {} } = {}) {
  const controller = new AbortController();
  const options = { signal: controller.signal, passive: true };
  const sections = config.sections.map(state => ({ state }));
  const line = Math.min(1, Math.max(0, config.triggerLine ?? .75));
  const offset = config.triggerOffsetPx ?? 0;
  const originalBackground = target.style.getPropertyValue('--page-background');
  const originalDuration = target.style.getPropertyValue('--page-background-duration');
  const hadClass = target.classList.contains('scroll-background');
  let frame = 0, current, currentIndex = -1, previousScrollY = window.scrollY || 0;
  target.classList.add('scroll-background');
  target.style.setProperty('--page-background-duration', `${Math.max(0, config.transitionMs ?? 400)}ms`);
  function update() {
    frame = 0;
    const scrollY = window.scrollY || 0;
    const movingUp = scrollY < previousScrollY;
    previousScrollY = scrollY;
    let next = config.default;
    let nextIndex = -1;
    for (const [index, entry] of sections.entries()) {
      // FAQ 同步会替换条目；每次读取当前节点，避免引用已移除的 summary。
      entry.element = document.querySelector(entry.state.selector);
      // 隐藏或尚未出现的节点不触发。
      if (!entry.element || !entry.element.getClientRects().length || (entry.state.media && !matchMedia(entry.state.media).matches)) continue;
      const sectionLine = Math.min(1, Math.max(0, entry.state.triggerLine ?? line));
      const sectionOffset = entry.state.triggerOffsetPx ?? offset;
      if (entry.element.getBoundingClientRect().top <= innerHeight * sectionLine + sectionOffset) { next = entry.state; nextIndex = index; }
    }
    // 展开上方答案会把第二题推下去；只有真正上滚才允许此状态回退。
    if (nextIndex < currentIndex && current?.preserveOnLayoutChange && !movingUp &&
        (!current.media || matchMedia(current.media).matches) &&
        document.querySelector(current.selector)?.getClientRects().length) return;
    if (next === current) return;
    const duration = nextIndex < currentIndex ? (config.returnTransitionMs ?? config.transitionMs ?? 400) : (config.transitionMs ?? 400);
    target.style.setProperty('--page-background-duration', `${Math.max(0, duration)}ms`);
    currentIndex = nextIndex;
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
