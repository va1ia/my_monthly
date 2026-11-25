// 目录：1. 挂载共享组件 2. 动画模式对照
import { readJSON } from '../shared/data.js';
import { mountMenuBar } from '../../components/menu-bar/menu-bar.js';
import { mountFooter } from '../../components/footer/footer.js';
import { renderPreFooter } from '../../components/pre-footer/pre-footer.js';
import { mountPreFooter } from '../../components/pre-footer/player.js';
const navigation = await readJSON('content/shared/navigation.json');
mountMenuBar(document.querySelector('#site-header'), {items:navigation.items,currentPage:'home'});
mountFooter(document.querySelector('#site-footer'), { ...navigation, preFooter: false });
document.querySelector('#pre-footer-demo').innerHTML = renderPreFooter();
const section = document.querySelector('.pre-footer');
const player = mountPreFooter(section);
const source = document.querySelector('#animation-source');
const state = document.querySelector('#animation-state');
const states = {idle:'靠近分区时加载', loading:'正在加载素材…', ready:'已准备好', playing:'播放中', paused:'已暂停', error:'加载失败，保留预览图'};
section.addEventListener('prefooterstate', event => {
  const detail = event.detail;
  state.textContent = `${source.selectedOptions[0].textContent} / ${detail.duration} 秒循环 / ${states[detail.state]}${detail.loops ? ` / 已循环 ${detail.loops} 次` : ''}`;
});
function select() { player.select(source.value); }
source.addEventListener('change', select);
document.querySelector('#animation-restart').addEventListener('click', () => player.restart());
