// 目录：1. 共享 Pre-footer 结构 2. 电脑版媒体延迟加载标记
import { linkAttributes } from '../../scripts/shared/dom.js';
const asset = name => new URL(`./${name}`, import.meta.url).href;
const downloadPage = new URL('../../download.html', import.meta.url).href;
const arrow = '<span class="pre-footer__arrow" aria-hidden="true"><span>→</span></span>';
const appBadge = new URL('../../assets/images/home/hero/apple-download.svg', import.meta.url).href;
export function renderPreFooter() {
  return `<section class="pre-footer" aria-label="Explore My Monthly">
    <div class="pre-footer__cards">
      <a class="pre-footer__download-card" href="${downloadPage}" aria-label="Understand Your Rhythm — Download My Monthly">
        <div class="pre-footer__loved-art" aria-hidden="true"><img data-pre-footer-src="${asset('loved.svg')}" alt=""><img class="pre-footer__loved-deco" data-pre-footer-src="${asset('loved-deco.svg')}" alt=""></div>
        <h2>Understand Your<br>Rhythm</h2>
        <span class="pre-footer__app" aria-hidden="true"><img data-pre-footer-src="${appBadge}" width="179" height="60" alt=""></span>
      </a>
      <div class="pre-footer__right">
        <a class="pre-footer__ambassador-card" ${linkAttributes({href:'https://o092eqv9xj4.typeform.com/to/OndLKDi7',external:true})} aria-label="Join To Be One Of Our Ambassador — Apply Here"><h2>Join To Be One Of<br>Our Ambassador!</h2>${arrow}<img class="pre-footer__calm" data-pre-footer-src="${asset('calm.svg')}" alt="" aria-hidden="true"></a>
        <a class="pre-footer__events-card" ${linkAttributes({href:'https://luma.com/user/my_monthly',external:true})} aria-label="Check Our Ongoing Events — Luma Page"><h2>Check Our<br>Ongoing Events!</h2>${arrow}<img class="pre-footer__calendar" data-pre-footer-src="${asset('calendar.svg')}" alt="" aria-hidden="true"></a>
      </div>
    </div>
    <img class="pre-footer__clouds" data-pre-footer-src="${asset('cloud.svg')}" alt="" aria-hidden="true">
    <div class="pre-footer__garden" role="group" aria-label="My Monthly garden lettering, characters and drifting leaves">
      <img class="pre-footer__ground" data-pre-footer-src="${asset('ground.svg')}" alt="" aria-hidden="true">
      <video class="pre-footer__video" muted loop playsinline preload="none" aria-hidden="true" tabindex="-1"></video>
      <div class="pre-footer__raw" hidden aria-hidden="true"><div data-lottie-part="1"></div><div data-lottie-part="2"></div></div>
      <img class="pre-footer__bushes pre-footer__bushes--left" data-pre-footer-src="${asset('bushes.svg')}" alt="" aria-hidden="true">
      <img class="pre-footer__bushes pre-footer__bushes--right" data-pre-footer-src="${asset('bushes.svg')}" alt="" aria-hidden="true">
      <button class="pre-footer__motion-toggle" type="button" aria-pressed="false" aria-label="Pause garden animation">Pause animation</button>
    </div>
    <p class="pre-footer__status visually-hidden" role="status" aria-live="polite"></p>
  </section>`;
}
