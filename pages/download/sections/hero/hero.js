// 目录：1. 下载首屏（双端插画、共享背景和 App Store）
import { escapeHTML, linkAttributes } from '../../../../scripts/shared/dom.js';
const asset = name => new URL(`../../../../assets/images/${name}`, import.meta.url).href;
export function renderDownloadHero(downloadHref, version) {
  return `<section class="download-hero" aria-labelledby="download-title">
    <picture class="download-hero__pattern" aria-hidden="true">
      <source media="(max-width: 767px)" srcset="${asset('home/hero/bg-pattern-phone.svg')}">
      <img src="${asset('home/hero/bg-pattern-pc.svg')}" alt="" width="1728" height="1214">
    </picture>
    <div class="download-hero__copy">
      <h1 id="download-title">Download My Monthly<br>For Free!</h1>
      <a class="download-hero__badge" ${linkAttributes({ href: downloadHref, external: true })}><img src="${asset('home/hero/apple-download.svg')}" alt="Download on the App Store" width="179" height="60"></a>
      <p class="download-hero__version">Ver ${escapeHTML(version)}</p>
    </div>
    <picture class="download-hero__phones">
      <source media="(max-width: 767px)" srcset="${asset('download/phones-mobile.svg')}">
      <img src="${asset('download/phones-desktop.svg')}" alt="Two partners holding phones with My Monthly cycle tracking and daily insights" width="717" height="602" fetchpriority="high">
    </picture>
  </section>`;
}
