// 目录：1. 原始素材 2. 首屏 3. 文件夹 4. Perks 与固定入口
import { escapeHTML } from '../../scripts/shared/dom.js';
const asset = (section, name) => new URL(`../../assets/images/ambassador/${section}/${name}.svg`, import.meta.url).href;
const image = (section, name, className = '', style = '') => `<img src="${asset(section, name)}" class="${className}" style="${style}" alt="" aria-hidden="true" draggable="false">`;
const external = 'target="_blank" rel="noopener noreferrer"';

function renderHero(data) {
  // Figma 原标题画布 1007 × 831；插画保持原比例，位置相对标题画布。
  const title = [
    ['title-backdrop',58.87,67.34,889.8,0], ['title-character',706.9,58,218.778,9.45],
    ['title-label',15,40,453.683,-10.84], ['title-wordmark',81,131,310.012,-10.97],
    ['title-ray-1',946.59,314.11,48.513,0], ['title-ray-2',927.46,294.58,29.605,0],
    ['title-ray-3',951.4,362.86,51.44,0], ['title-spark-back',611.68,740.77,89.698,0],
    ['title-spark-front',621.96,751.4,68.13,0], ['title-cloud',705.85,633.63,222.689,0],
    ['title-lettering',61.46,177.09,857.19,0], ['title-flower',41.69,290.47,91.389,0],
    ['title-plane',64.78,676.38,182.128,0], ['title-star',574,54,118.174,-20.04]
  ].map(([name,x,y,width,rotate]) => image('hero',name,'amb-hero__part',`left:${x/10.07}%;top:${y/8.31}%;width:${width/10.07}%;transform:rotate(${rotate}deg)`)).join('');
  return `<section class="amb-hero" aria-labelledby="amb-title">
    <h1 id="amb-title" class="visually-hidden">My Monthly College Ambassador Program</h1>
    ${image('hero','cloud-right-top','amb-hero__cloud amb-hero__cloud--top')}
    ${image('hero','cloud-left','amb-hero__cloud amb-hero__cloud--left')}
    ${image('hero','cloud-right-bottom','amb-hero__cloud amb-hero__cloud--bottom')}
    <div class="amb-hero__title" aria-hidden="true">${title}</div>
    <div class="amb-hero__friend" aria-hidden="true">${image('hero','cloud-eye-body','amb-hero__friend-body')}<span class="amb-hero__eyes">${image('hero','cloud-eyes')}</span></div>
    <a class="amb-apply amb-hero__apply" href="${escapeHTML(data.applyUrl)}" ${external}>Apply Here</a>
  </section>
  <div class="amb-marquee"><a href="${escapeHTML(data.instagramUrl)}" ${external}><span class="visually-hidden">${escapeHTML(data.marquee)}</span><span class="amb-marquee__track" aria-hidden="true">${Array.from({length:2},()=>`<span class="amb-marquee__group">${Array.from({length:3},()=>`${image('perks','marquee-star')}<span>${escapeHTML(data.marquee)}</span>`).join('')}</span>`).join('')}</span></a><button class="amb-marquee__pause" type="button" aria-label="Pause scrolling announcement" aria-pressed="false">Ⅱ</button></div>`;
}

function renderProgram(data) {
  const learning = data.learning.map(item=>`<li><strong>${escapeHTML(item.title)}:</strong> ${escapeHTML(item.body)}</li>`);
  return `<section class="amb-program" aria-label="About the ambassador program">
    <div class="amb-program__sticky">
      <div class="amb-program__track">
        <div class="amb-dossier">
          <div class="amb-dossier__pink" aria-hidden="true"></div><div class="amb-dossier__green" aria-hidden="true"></div>
          ${image('program','clip-back','amb-dossier__clip')}
          <article class="amb-dossier__cover" aria-labelledby="amb-intro">${image('program','folder-cover','amb-dossier__cover-art')}<div class="amb-dossier__cover-copy"><h2 id="amb-intro">${escapeHTML(data.introTitle)}</h2><p>${escapeHTML(data.intro)}</p></div></article>
          <article class="amb-dossier__paper" aria-labelledby="amb-eligibility"><h2 id="amb-eligibility">${escapeHTML(data.eligibilityTitle)}</h2><ul>${data.eligibility.map(item=>`<li>${escapeHTML(item)}</li>`).join('')}</ul></article>
          ${image('program','clip-front','amb-dossier__clip-front')}
        </div>
        <article class="amb-learning" aria-labelledby="amb-learning-title">
          ${image('program','folder-open-left','amb-learning__folder amb-learning__folder--left')}${image('program','folder-open-right','amb-learning__folder amb-learning__folder--right')}
          <div class="amb-learning__sheet"><h2 id="amb-learning-title">${escapeHTML(data.learningTitle)}</h2><ul>${learning.slice(0,2).join('')}</ul></div>
          <div class="amb-learning__sheet"><ul>${learning.slice(2).join('')}</ul><p class="amb-learning__end">${escapeHTML(data.learningEnd)}</p></div>
        </article>
      </div>
    </div>
  </section>`;
}

function renderPerks(data) {
  const cards = data.perks.map((perk,i)=>`<div class="amb-perk amb-perk--${i}"><article class="amb-perk__paper" tabindex="0" aria-labelledby="amb-perk-${i}">${image('perks',perk.icon,'amb-perk__icon')}<h3 id="amb-perk-${i}">${escapeHTML(perk.title)}</h3><p>${escapeHTML(perk.body)}</p></article>${image('perks',`pin-${perk.pin}`,'amb-perk__pin')}</div>`).join('');
  return `<section class="amb-perks" aria-labelledby="amb-perks-title">${image('perks','perks-pattern','amb-perks__pattern')}<div class="amb-perks__board"><h2 id="amb-perks-title">Program Perks</h2><div class="amb-perks__notes">${cards}</div></div>${image('perks','perks-ground','amb-perks__ground')}${image('perks','character-blue','amb-perks__blue')}${image('perks','character-green','amb-character')}</section>`;
}

export function renderAmbassador(data) {
  return `${renderHero(data)}<div class="amb-content">${renderProgram(data)}${renderPerks(data)}</div>`;
}

export function renderAmbassadorActions(data) {
  return `<nav class="amb-actions" aria-label="Ambassador application links"><a class="amb-apply" href="${escapeHTML(data.applyUrl)}" ${external}>Apply Here</a><a class="amb-apply amb-apply--linen" href="${escapeHTML(data.instagramUrl)}" ${external}>Explore on Instagram</a></nav>`;
}
