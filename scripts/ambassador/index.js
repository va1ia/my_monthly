// 目录：1. 页面与共享组件 2. 云朵眼神与视差 3. 文件夹滚动 4. 跑马灯
import { mountMenuBar } from '../../components/menu-bar/menu-bar.js';
import { mountFooter } from '../../components/footer/footer.js';
import { createNewsletterSubscriber } from '../shared/newsletter.js';
import { renderAmbassador } from '../../pages/ambassador/page.js';
const readJSON = async path => {
  const response = await fetch(new URL(path, import.meta.url));
  if (!response.ok) throw new Error(`Could not load ${path}`);
  return response.json();
};
const [navigation, data, newsletter] = await Promise.all([
  readJSON('../../content/shared/navigation.json'), readJSON('../../content/ambassador/page.json'),
  readJSON('../../content/shared/newsletter.json').catch(()=>({enabled:false}))
]);
document.querySelector('#main').innerHTML = renderAmbassador(data);
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
const steps = [...document.querySelectorAll('[data-program-step]')];
let start = 0, dropDistance = 0, slideDistance = 0, tail = 0, frame = 0;
const clamp = (value,min=0,max=1)=>Math.max(min,Math.min(max,value));

function measure() {
  if (reduced.matches) {
    section.style.removeProperty('height');
    track.style.removeProperty('transform'); cover.style.removeProperty('transform');
    cover.style.removeProperty('opacity');
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
  friend.style.setProperty('--cloud-drift', `${moving?clamp(-heroRect.top,0,heroRect.height)*.16:0}px`);
  if (pointer && moving && heroRect.bottom>0) {
    const r=eyes.getBoundingClientRect(), dx=pointer.x-(r.left+r.width/2),dy=pointer.y-(r.top+r.height/2);
    const length=Math.hypot(dx,dy)||1, reach=Math.min(3.5,r.width*.10);
    eyes.style.setProperty('--eye-x', `${dx/length*reach}px`);
    eyes.style.setProperty('--eye-y', `${dy/length*reach}px`);
  } else { eyes.style.setProperty('--eye-x','0px');eyes.style.setProperty('--eye-y','0px'); }
  if (!moving) return;
  const travelled=clamp(scrollY-start,0,dropDistance+slideDistance+tail);
  const drop=clamp(travelled/dropDistance);
  // 覆盖文件夹先落下，再移动纸张与完整展开的右侧文件夹。
  cover.style.transform=`translate3d(${drop*2}%,${drop*drop*(innerHeight+dossier.offsetHeight)}px,0) rotate(${drop*8}deg)`;
  cover.style.opacity=String(1-clamp((drop-.72)/.28));
  const slide=clamp(travelled-dropDistance,0,slideDistance);
  track.style.transform=`translate3d(${-slide}px,0,0)`;
  const active=drop<.95?0:slide<slideDistance*.3?1:2;
  steps.forEach((button,i)=>button.setAttribute('aria-current',String(i===active?'step':'false')));
}
function schedule() {if(!frame) frame=requestAnimationFrame(update);}
steps.forEach((button,index)=>button.addEventListener('click',()=>{
  if (reduced.matches) {
    (index===2?learning:index===1?document.querySelector('.amb-dossier__paper'):cover).scrollIntoView({block:'center'});
  } else {
    const offset=index===0?0:index===1?dropDistance:dropDistance+slideDistance;
    window.scrollTo({top:start+offset,behavior:'smooth'});
  }
}));
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
