// 目录：1. 原站视口鼠标映射 2. 平滑和生命周期
// Webflow a-31：X -2→2vw，Y 0→4vw，resting 50%，smoothing 50。
export function mountPointerParallax(section) {
  const controller = new AbortController();
  const options = { signal: controller.signal };
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const pointer = matchMedia('(min-width: 768px) and (hover: hover) and (pointer: fine)');
  let frame = 0, lastTime = 0, x = 0, y = 2, targetX = 0, targetY = 2;
  const active = () => pointer.matches && !reduced.matches;
  function render() {
    section.style.setProperty('--pattern-x', `${x}vw`);
    section.style.setProperty('--pattern-y', `${y}vw`);
  }
  function tick(now) {
    const factor = 1 - Math.exp(-Math.min(now - (lastTime || now - 16), 64) / 80);
    lastTime = now;
    x += (targetX - x) * factor; y += (targetY - y) * factor;
    render();
    if (Math.abs(targetX - x) + Math.abs(targetY - y) > .001) frame = requestAnimationFrame(tick);
    else { x = targetX; y = targetY; render(); frame = 0; lastTime = 0; }
  }
  function schedule() { if (!frame) frame = requestAnimationFrame(tick); }
  function reset() { targetX = 0; targetY = active() ? 2 : 0; schedule(); }
  window.addEventListener('pointermove', event => {
    if (!active() || event.pointerType === 'touch') return;
    targetX = (event.clientX / innerWidth - .5) * 4;
    targetY = event.clientY / innerHeight * 4;
    schedule();
  }, { ...options, passive: true });
  document.documentElement.addEventListener('pointerleave', reset, options);
  pointer.addEventListener('change', reset, options);
  reduced.addEventListener('change', reset, options);
  reset();
  return { destroy() { controller.abort(); cancelAnimationFrame(frame); } };
}
