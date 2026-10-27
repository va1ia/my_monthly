// 目录：1. 首屏结构 2. Marquee 无障碍副本
import { escapeHTML, linkAttributes } from '../../../../scripts/shared/dom.js';
const asset = name => new URL(`../../../../assets/images/home/${name}`, import.meta.url).href;
export function renderMarqueeLogos(logos) {
  return logos.map(logo => {
    const width = Number.isFinite(logo.width) && logo.width > 0 ? logo.width : 120;
    const height = Number.isFinite(logo.height) && logo.height > 0 ? logo.height : 44;
    // 用户已调整过的 SVG 尺寸直接作为视觉比例，大尺寸新增素材限制在标志带内。
    const scale = Math.min(1, 180 / width, 82 / height);
    return `<li style="--logo-width:${width * scale};--logo-height:${height * scale}"><img src="${asset(`logo-marquee/${encodeURIComponent(logo.file)}`)}?v=${encodeURIComponent(logo.version)}" alt="${escapeHTML(logo.name)}" width="${width}" height="${height}"></li>`;
  }).join('');
}
export function renderHero(content, logos = []) {
  return `<section class="home-hero" aria-labelledby="hero-title">
    <div class="home-hero__scene">
      <picture class="home-hero__pattern" aria-hidden="true">
        <source media="(max-width: 767px)" srcset="${asset('hero/bg-pattern-phone.svg')}">
        <img src="${asset('hero/bg-pattern-pc.svg')}" alt="" width="1728" height="1214" fetchpriority="high">
      </picture>
      <h1 class="home-hero__title" id="hero-title">${content.title.map(line => `<span>${escapeHTML(line)}</span>`).join('')}</h1>
      <a class="home-hero__download" ${linkAttributes({href:content.downloadHref, external:true})} aria-label="Download My Monthly on the App Store"><img src="${asset('hero/apple-download.svg')}" alt="Download on the App Store" width="179" height="60"></a>
      <div class="home-hero__phones" role="img" aria-label="Two hands raising phones together, showing the My Monthly app for both partners">
        <img class="home-hero__phone home-hero__phone--left" src="${asset('hero/phone-left.svg')}" alt="" width="643" height="698" fetchpriority="high">
        <img class="home-hero__phone home-hero__phone--right" src="${asset('hero/phone-right.svg')}" alt="" width="640" height="701" fetchpriority="high">
      </div>
      <ul class="home-hero__tags" aria-label="My Monthly benefits">${content.tags.map((tag, i) => `<li class="home-hero__tag home-hero__tag--${i + 1}">${escapeHTML(tag)}</li>`).join('')}</ul>
    </div>
    <div class="home-hero__marquee" aria-label="Press and community"${logos.length ? '' : ' hidden'}>
      <div class="home-hero__marquee-track"><ul class="home-hero__logos">${renderMarqueeLogos(logos)}</ul></div>
      <button class="home-hero__marquee-toggle" type="button" aria-label="Pause logo animation" aria-pressed="false"><span aria-hidden="true">Ⅱ</span></button>
    </div>
  </section>`;
}
