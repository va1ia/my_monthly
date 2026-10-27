// 目录：1. 原站关键帧映射 2. 滚动与鼠标平滑 3. 生命周期及 marquee 暂停
const clamp = value => Math.max(0, Math.min(1, value));
export function mountHeroMotion(hero) {
  const controller = new AbortController();
  const options = {signal:controller.signal};
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const desktopPointer = matchMedia('(min-width: 992px) and (hover: hover) and (pointer: fine)');
  const tags = [...hero.querySelectorAll('.home-hero__tag')];
  const marquee = hero.querySelector('.home-hero__marquee');
  const toggle = hero.querySelector('.home-hero__marquee-toggle');
  let frame = 0, previousTime = 0, progress = 0, targetProgress = 0;
  let x = 0, y = 0, targetX = 0, targetY = 0, start = 0, travel = 1, paused = false;
  function render() {
    const p = reduced.matches ? 1 : progress;
    hero.style.setProperty('--phone-progress', clamp(p / .16));
    hero.style.setProperty('--pattern-x', `${x}vw`);
    hero.style.setProperty('--pattern-y', `${y}vw`);
    // 原站 tags：0–8%、3–11%、8–15%；手机合拢在 16% 完成。
    [[0,.08],[.03,.11],[.08,.15]].forEach(([from,to], i) => {
      const opacity = clamp((p - from) / (to - from));
      tags[i].style.setProperty('--tag-opacity', opacity);
      tags[i].style.setProperty('--tag-y', `${16 * (1 - opacity)}px`);
    });
  }
  function tick(now) {
    const factor = 1 - Math.exp(-Math.min(now - (previousTime || now - 16), 64) / 80);
    previousTime = now;
    progress += (targetProgress - progress) * factor;
    x += (targetX - x) * factor; y += (targetY - y) * factor;
    render();
    if (Math.abs(targetProgress - progress) > .0001 || Math.abs(targetX - x) > .001 || Math.abs(targetY - y) > .001) frame = requestAnimationFrame(tick);
    else { progress = targetProgress; x = targetX; y = targetY; render(); frame = 0; previousTime = 0; }
  }
  function schedule() { if (!frame) frame = requestAnimationFrame(tick); }
  function onScroll() { targetProgress = clamp((window.scrollY - start) / travel); schedule(); }
  function measure() {
    start = hero.getBoundingClientRect().top + window.scrollY;
    // 原站触发器在 100vh；完整进度对应约一个视口的滚动。
    const available = Math.max(1, document.documentElement.scrollHeight - window.innerHeight - start);
    travel = Math.min(Math.max(400, window.innerHeight), available * .8 / .16);
    if (!desktopPointer.matches || reduced.matches) targetX = targetY = 0;
    hero.classList.toggle('is-animated', !reduced.matches);
    onScroll();
  }
  window.addEventListener('scroll', onScroll, {...options, passive:true});
  window.addEventListener('resize', measure, options);
  reduced.addEventListener('change', measure, options);
  desktopPointer.addEventListener('change', measure, options);
  window.addEventListener('pointermove', event => {
    if (!desktopPointer.matches || reduced.matches || window.scrollY > start + hero.offsetHeight) return;
    targetX = (event.clientX / window.innerWidth - .5) * 4;
    targetY = event.clientY / window.innerHeight * 4;
    schedule();
  }, {...options, passive:true});
  document.documentElement.addEventListener('pointerleave', () => { targetX = targetY = 0; schedule(); }, options);
  toggle.addEventListener('click', () => {
    paused = !paused; marquee.classList.toggle('is-paused', paused);
    toggle.setAttribute('aria-pressed', String(paused));
    toggle.setAttribute('aria-label', `${paused ? 'Resume' : 'Pause'} logo animation`);
    toggle.firstElementChild.textContent = paused ? '▶' : 'Ⅱ';
  }, options);
  measure(); progress = targetProgress; render();
  return {destroy() { controller.abort(); cancelAnimationFrame(frame); hero.classList.remove('is-animated'); }};
}
