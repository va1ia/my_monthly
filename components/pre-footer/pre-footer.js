// 目录：1. 共享 Pre-footer 结构 2. 响应式媒体延迟加载标记
import { linkAttributes } from '../../scripts/shared/dom.js';
const asset = name => new URL(`./${name}`, import.meta.url).href;
const downloadPage = new URL('../../download.html', import.meta.url).href;
const arrow = '<span class="pre-footer__arrow" aria-hidden="true"><span>→</span></span>';
const lovedDecorations = `<svg class="pre-footer__loved-deco" viewBox="0 0 509 185" fill="none" aria-hidden="true"><g class="pre-footer__loved-spark"><path d="M482.664 89.0561C470.566 88.3692 461.294 78.3957 461.953 66.7796C462.613 55.1634 472.955 46.3035 485.052 46.9903C497.15 47.6772 506.422 57.6507 505.763 69.2669C505.103 80.883 494.761 89.7429 482.664 89.0561Z" fill="#F1BF75" stroke-width="2.67305" stroke-linecap="round" stroke-linejoin="round" stroke="#282828"/></g><g class="pre-footer__loved-spark"><path d="M405.32 179.595C398.407 179.202 393.109 173.503 393.486 166.865C393.863 160.227 399.772 155.165 406.685 155.557C413.598 155.95 418.896 161.649 418.52 168.286C418.143 174.924 412.233 179.987 405.32 179.595Z" fill="#E972AA" stroke-width="2.67305" stroke-linecap="round" stroke-linejoin="round" stroke="#282828"/></g><g class="pre-footer__loved-spark"><path d="M20.0055 25.3954C13.0926 25.0029 7.79414 19.3037 8.17101 12.6659C8.54788 6.02815 14.4574 0.965329 21.3703 1.35782C28.2832 1.75031 33.5816 7.44948 33.2048 14.0873C32.8279 20.7251 26.9184 25.7879 20.0055 25.3954Z" fill="#E5E9D9" stroke-width="2.67305" stroke-linecap="round" stroke-linejoin="round" stroke="#282828"/></g><g class="pre-footer__loved-spark"><path d="M55.3188 138.275L76.8073 139.495L75.6347 160.149L54.1461 158.929L55.3188 138.275Z" fill="#B0D2EB" stroke-width="2.67305" stroke-linecap="round" stroke-linejoin="round" stroke="#282828"/></g></svg>`;
const appBadge = new URL('../../assets/images/home/hero/apple-download.svg', import.meta.url).href;
export function renderPreFooter() {
  return `<section class="pre-footer" aria-label="Explore My Monthly">
    <div class="pre-footer__cards">
      <a class="pre-footer__download-card" href="${downloadPage}" aria-label="Understand Your Rhythm — Download My Monthly">
        <div class="pre-footer__loved-art" aria-hidden="true"><img class="pre-footer__loved-poster" data-pre-footer-src="${asset('images/cards/loved.svg')}" alt=""><video class="pre-footer__loved-video" muted loop playsinline preload="none" tabindex="-1"></video>${lovedDecorations}</div>
        <h2>Understand Your<br>Rhythm</h2>
        <span class="pre-footer__app" aria-hidden="true"><img data-pre-footer-src="${appBadge}" width="179" height="60" alt=""></span>
      </a>
      <div class="pre-footer__right">
        <a class="pre-footer__ambassador-card" ${linkAttributes({href:'https://o092eqv9xj4.typeform.com/to/OndLKDi7',external:true})} aria-label="Join To Be One Of Our Ambassador — Apply Here"><h2>Join To Be One Of<br>Our Ambassador!</h2>${arrow}<img class="pre-footer__calm" data-pre-footer-src="${asset('images/cards/calm.svg')}" alt="" aria-hidden="true"></a>
        <a class="pre-footer__events-card" ${linkAttributes({href:'https://luma.com/user/my_monthly',external:true})} aria-label="Check Our Ongoing Events — Luma Page"><h2>Check Our<br>Ongoing Events!</h2>${arrow}<img class="pre-footer__calendar" data-pre-footer-src="${asset('images/cards/calendar.svg')}" alt="" aria-hidden="true"></a>
      </div>
    </div>
    <img class="pre-footer__clouds" data-pre-footer-src="${asset('images/garden/cloud.svg')}" alt="" aria-hidden="true">
    <div class="pre-footer__garden" role="group" aria-label="My Monthly garden lettering, characters and drifting leaves">
      <img class="pre-footer__ground" data-pre-footer-src="${asset('images/garden/ground.svg')}" alt="" aria-hidden="true">
      <video class="pre-footer__video" muted loop playsinline preload="none" aria-hidden="true" tabindex="-1"></video>
      <div class="pre-footer__raw" hidden aria-hidden="true"><div data-lottie-part="1"></div><div data-lottie-part="2"></div></div>
      <img class="pre-footer__bushes pre-footer__bushes--left" data-pre-footer-src="${asset('images/garden/bushes.svg')}" alt="" aria-hidden="true">
      <img class="pre-footer__bushes pre-footer__bushes--right" data-pre-footer-src="${asset('images/garden/bushes.svg')}" alt="" aria-hidden="true">
      <button class="pre-footer__motion-toggle" type="button" aria-pressed="false" aria-label="Pause garden animation">Pause animation</button>
    </div>
    <p class="pre-footer__status visually-hidden" role="status" aria-live="polite"></p>
  </section>`;
}
