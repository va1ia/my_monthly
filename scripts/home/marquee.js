// 目录：1. 素材清单 2. 自动填充与恒速循环 3. 清单更新和清理
import { renderMarqueeLogos } from '../../pages/home/sections/hero/hero.js';
const manifestURL = new URL('../../content/home/logo-marquee.json', import.meta.url);

export async function loadMarqueeLogos() {
  const response = await fetch(manifestURL, {cache:'no-store'});
  if (!response.ok) throw new Error('Logo manifest could not be loaded');
  const {logos} = await response.json();
  if (!Array.isArray(logos) || logos.some(logo => typeof logo.file !== 'string' ||
      !/^[^/\\]+\.(svg|png|jpe?g|webp|avif|gif)$/i.test(logo.file) ||
      typeof logo.name !== 'string' || typeof logo.version !== 'string')) {
    throw new Error('Invalid logo manifest');
  }
  return logos;
}

export function mountMarquee(marquee, initialLogos = []) {
  const controller = new AbortController();
  const track = marquee.querySelector('.home-hero__marquee-track');
  let logos = initialLogos, signature = JSON.stringify(logos), width = -1, pending = false;

  function layout() {
    marquee.hidden = logos.length === 0;
    if (!logos.length) { track.replaceChildren(); return; }
    const group = document.createElement('ul');
    group.className = 'home-hero__logos';
    group.innerHTML = renderMarqueeLogos(logos);
    track.replaceChildren(group);
    const originals = [...group.children];
    const unitWidth = group.getBoundingClientRect().width;
    // 至少铺满一个视口；一个 logo 也能无空档循环。
    const repeats = Math.max(1, Math.ceil(marquee.clientWidth / Math.max(1, unitWidth)));
    for (let repeat = 1; repeat < repeats; repeat++) {
      originals.forEach(item => {
        const copy = item.cloneNode(true);
        copy.setAttribute('aria-hidden', 'true');
        copy.querySelector('img').alt = '';
        group.append(copy);
      });
    }
    const copy = group.cloneNode(true);
    copy.setAttribute('aria-hidden', 'true');
    copy.querySelectorAll('img').forEach(img => { img.alt = ''; });
    track.append(copy);
    // 素材增减时调整一圈时长，保持约 48px/s 的速度。
    marquee.style.setProperty('--marquee-duration', `${group.getBoundingClientRect().width / 48}s`);
  }

  async function refresh() {
    if (pending || document.hidden) return;
    pending = true;
    try {
      const next = await loadMarqueeLogos();
      if (controller.signal.aborted) return;
      const nextSignature = JSON.stringify(next);
      if (nextSignature !== signature) { logos = next; signature = nextSignature; layout(); }
    } catch (error) {
      // 临时网络或写入错误保留当前轨道，下次自动重试。
      console.warn('Logo refresh postponed:', error.message);
    } finally { pending = false; }
  }
  const observer = new ResizeObserver(entries => {
    const nextWidth = entries[0].contentRect.width;
    if (nextWidth !== width) { width = nextWidth; layout(); }
  });
  observer.observe(marquee);
  window.addEventListener('focus', refresh, {signal:controller.signal});
  document.addEventListener('visibilitychange', refresh, {signal:controller.signal});
  const timer = setInterval(refresh, 15000);
  layout();
  return {refresh, destroy() { controller.abort(); clearInterval(timer); observer.disconnect(); }};
}
