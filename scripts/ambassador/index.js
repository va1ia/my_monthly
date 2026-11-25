// 目录：1. 页面与共享组件 2. 云朵眼神与视差 3. 文件夹滚动与 Footer 停靠 4. 跑马灯
import { readJSON } from '../shared/data.js';
import { mountMenuBar } from '../../components/menu-bar/menu-bar.js';
import { mountFooter } from '../../components/footer/footer.js';
import { createNewsletterSubscriber } from '../shared/newsletter.js';
import { renderAmbassador, renderAmbassadorActions } from '../../pages/ambassador/page.js';
const [navigation, data, newsletter] = await Promise.all([
  readJSON('content/shared/navigation.json'), readJSON('content/ambassador/page.json'),
  readJSON('content/shared/newsletter.json').catch(()=>({enabled:false}))
]);
document.querySelector('#main').innerHTML = renderAmbassador(data);
const actionsAnchor = document.querySelector('#ambassador-actions');
actionsAnchor.innerHTML = renderAmbassadorActions(data);
const actions = actionsAnchor.querySelector('.amb-actions');
mountMenuBar(document.querySelector('#site-header'), { items:navigation.items, currentPage:'ambassador' });
// 本页使用原稿专属人物结尾；不重复加入通用花园。
mountFooter(document.querySelector('#site-footer'), { ...navigation, preFooter:false, subscribe:createNewsletterSubscriber(newsletter) });

const reduced = matchMedia('(prefers-reduced-motion: reduce)');
const finePointer = matchMedia('(hover: hover) and (pointer: fine)');
const hero = document.querySelector('.amb-hero');
const friend = document.querySelector('.amb-hero__friend');
const eyes = document.querySelector('.amb-hero__eyes');
let pointer = null;
document.addEventListener('pointermove', event => {
  if (event.pointerType !== 'touch' && finePointer.matches && !reduced.matches) {
    pointer = {x:event.clientX,y:event.clientY}; schedule();
  }
}, {passive:true});
document.documentElement.addEventListener('pointerleave', ()=>{pointer=null; schedule();});
window.addEventListener('blur', ()=>{pointer=null; schedule();});

const section = document.querySelector('.amb-program');
const track = document.querySelector('.amb-program__track');
const dossier = document.querySelector('.amb-dossier');
const cover = document.querySelector('.amb-dossier__cover');
const learning = document.querySelector('.amb-learning');
let start = 0, dropDistance = 0, slideDistance = 0, tail = 0, frame = 0;
const clamp = (value,min=0,max=1)=>Math.max(min,Math.min(max,value));

function measure() {
  actionsAnchor.style.height=`${actions.offsetHeight}px`;
  if (reduced.matches) {
    section.style.removeProperty('height');
    track.style.removeProperty('transform'); cover.style.removeProperty('transform');
    cover.style.removeProperty('opacity');
    schedule();
    return;
  }
  const viewport = document.documentElement.clientWidth;
  const panel = dossier.offsetWidth;
  const inset = (viewport-panel)/2;
  track.style.columnGap=`${Math.max(viewport*.1,inset+24)}px`;
  const gap = parseFloat(getComputedStyle(track).columnGap) || 0;
  track.style.setProperty('--track-inset', `${inset}px`);
  dropDistance = Math.max(400, innerHeight*.82);
  const finalInset = Math.max(16,(viewport-learning.offsetWidth)/2);
  slideDistance = Math.max(0, inset+panel+gap+learning.offsetWidth-viewport+finalInset);
  tail = innerHeight*.24;
  section.style.height = `${innerHeight+dropDistance+slideDistance+tail}px`;
  start = section.getBoundingClientRect().top+scrollY;
  schedule();
}
function update() {
  frame=0;
  const moving = !reduced.matches;
  const heroRect=hero.getBoundingClientRect();
  actions.classList.toggle('is-docked',actionsAnchor.getBoundingClientRect().top<=innerHeight-actions.offsetHeight);
  friend.style.setProperty('--cloud-drift', `${moving?clamp(-heroRect.top,0,heroRect.height)*.16:0}px`);
  if (pointer && moving && heroRect.bottom>0) {
    // 从整个视口映射，不在鼠标靠近云朵时突然切换方向；计算不依赖眼睛自身位移。
    const reach=Math.min(7,friend.offsetWidth*.045);
    eyes.style.setProperty('--eye-x', `${(clamp(pointer.x/innerWidth)*2-1)*reach}px`);
    eyes.style.setProperty('--eye-y', `${(clamp(pointer.y/innerHeight)*2-1)*reach*.65}px`);
  } else { eyes.style.setProperty('--eye-x','0px');eyes.style.setProperty('--eye-y','0px'); }
  if (!moving) return;
  const travelled=clamp(scrollY-start,0,dropDistance+slideDistance+tail);
  const drop=clamp(travelled/dropDistance);
  // 覆盖文件夹先落下，再移动纸张与完整展开的右侧文件夹。
  cover.style.transform=`translate3d(${drop*2}%,${drop*drop*(innerHeight+dossier.offsetHeight)}px,0) rotate(${drop*8}deg)`;
  cover.style.opacity=String(1-clamp((drop-.72)/.28));
  const slide=clamp(travelled-dropDistance,0,slideDistance);
  track.style.transform=`translate3d(${-slide}px,0,0)`;
}
function schedule() {if(!frame) frame=requestAnimationFrame(update);}
window.addEventListener('scroll',schedule,{passive:true});
window.addEventListener('resize',measure,{passive:true});
reduced.addEventListener('change',measure);
const observer=new ResizeObserver(measure);observer.observe(dossier);observer.observe(learning);
document.fonts.ready.then(measure);measure();

const marquee=document.querySelector('.amb-marquee');
const pause=marquee.querySelector('button');
pause.addEventListener('click',()=>{
  const paused=pause.getAttribute('aria-pressed')!=='true';
  pause.setAttribute('aria-pressed',String(paused));
  pause.setAttribute('aria-label',`${paused?'Play':'Pause'} scrolling announcement`);
  pause.textContent=paused?'▶':'Ⅱ';marquee.classList.toggle('is-paused',paused);
});
