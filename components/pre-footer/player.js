// 目录：1. 懒加载播放器 2. 视频与原始 Lottie 对照 3. 可见性、暂停与清理
import { mountPointerParallax } from '../../scripts/shared/pointer-parallax.js';
const resource = path => new URL(path, import.meta.url).href;
let libraryPromise;
function lottieLibrary() {
  if (window.lottie) return Promise.resolve(window.lottie);
  if (!libraryPromise) libraryPromise = new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = resource('./vendor/lottie-light-canvas.min.js');
    script.onload = () => resolve(window.lottie);
    script.onerror = () => { libraryPromise = null; script.remove(); reject(new Error('Lottie player could not be loaded')); };
    document.head.append(script);
  });
  return libraryPromise;
}

export function mountPreFooter(section) {
  const parallax = mountPointerParallax(section);
  const controller = new AbortController();
  const options = {signal:controller.signal};
  const desktop = matchMedia('(min-width: 992px)');
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const video = section.querySelector('video');
  const raw = section.querySelector('.pre-footer__raw');
  const toggle = section.querySelector('.pre-footer__motion-toggle');
  const status = section.querySelector('.pre-footer__status');
  let source = 'video', mode = 'overlay', ready = false, loading = false, failed = false;
  let visible = false, near = false, paused = false, allowMotion = false, generation = 0;
  let format = video.canPlayType('video/webm; codecs="vp9"') ? 'webm' : 'mp4';
  let players = [], activePart = 0, loops = 0, rawController;

  function canPlay() { return desktop.matches && visible && !document.hidden && !paused && (!reduced.matches || allowMotion); }
  function emit() {
    const playing = ready && canPlay();
    const state = failed ? 'error' : loading ? 'loading' : ready ? (playing ? 'playing' : 'paused') : 'idle';
    section.dataset.animationSource = source;
    section.dataset.animationMode = mode;
    section.dataset.animationFormat = source === 'video' ? format : 'canvas';
    section.dataset.animationState = state;
    section.dataset.animationPart = source === 'lottie' ? String(activePart + 1) : 'combined';
    section.dataset.animationLoops = loops;
    toggle.setAttribute('aria-pressed', String(!playing));
    toggle.setAttribute('aria-label', playing ? 'Pause garden animation' : 'Play garden animation');
    toggle.textContent = playing ? 'Pause animation' : 'Play animation';
    section.dispatchEvent(new CustomEvent('prefooterstate', {detail:{source,mode,state,loops,part:activePart + 1}}));
  }
  function update() {
    const play = canPlay() && ready;
    if (source === 'video') {
      if (play) video.play().catch(() => { paused = true; emit(); });
      else video.pause();
    } else {
      players.forEach((player, index) => {
        const show = mode === 'overlay' || activePart === index;
        raw.children[index].hidden = !show;
        if (play && show) player.play(); else player.pause();
      });
    }
    emit();
  }
  function hydrate() {
    section.querySelectorAll('[data-pre-footer-src]').forEach(image => {
      if (!image.getAttribute('src')) image.src = image.dataset.preFooterSrc;
    });
    video.poster = resource('./media/garden-poster.webp');
  }
  function clearRaw() {
    rawController?.abort();
    rawController = null;
    players.forEach(player => player.destroy());
    players = [];
    [...raw.children].forEach(host => { host.replaceChildren(); host.hidden = false; });
  }
  function completed(index) {
    if (source !== 'lottie') return;
    if (mode === 'overlay') {
      if (index !== 0) return;
      loops++;
      players.forEach(player => player.goToAndStop(0, true));
    } else {
      if (index !== activePart) return;
      activePart = activePart === 0 ? 1 : 0;
      if (activePart === 0) loops++;
      players[activePart].goToAndStop(0, true);
    }
    update();
  }
  async function loadRaw(token) {
    rawController = new AbortController();
    const signal = rawController.signal;
    const [library, ...data] = await Promise.all([
      lottieLibrary(),
      ...['default1.json','default2.json'].map(async file => {
        const response = await fetch(resource(`./${file}`), {signal});
        if (!response.ok) throw new Error(`${file} could not be loaded`);
        return response.json();
      })
    ]);
    if (token !== generation || signal.aborted) return;
    players = data.map((animationData, index) => library.loadAnimation({
      container:raw.children[index], renderer:'canvas', animationData,
      loop:false, autoplay:false,
      rendererSettings:{clearCanvas:true, dpr:1, preserveAspectRatio:'xMidYMid meet'}
    }));
    await Promise.all(players.map((player, index) => new Promise((resolve,reject) => {
      const timeout = setTimeout(() => reject(new Error('Lottie image decoding timed out')), 45000);
      const finish = callback => { clearTimeout(timeout); callback(); };
      player.addEventListener('DOMLoaded', () => finish(resolve));
      player.addEventListener('data_failed', () => finish(() => reject(new Error('Lottie data could not be decoded'))));
      player.addEventListener('error', () => finish(() => reject(new Error('Lottie rendering failed'))));
      player.addEventListener('complete', () => completed(index));
      signal.addEventListener('abort', () => finish(resolve), {once:true});
      if (player.isLoaded) finish(resolve);
    })));
    if (token !== generation || signal.aborted) return;
    players.forEach(player => { player.setSubframe(false); player.goToAndStop(0, true); });
    activePart = 0;
    video.hidden = true;
    raw.hidden = false;
    ready = true; loading = false;
    status.textContent = '';
    update();
  }
  function ensureLoaded() {
    if (!desktop.matches || !near || ready || loading) return;
    hydrate();
    failed = false; loading = true;
    const token = generation;
    if (source === 'video') {
      raw.hidden = true; video.hidden = false;
      video.src = resource(`./media/garden-${mode}.${format}`);
      video.load();
    } else {
      video.pause();
      status.textContent = 'Loading original animation files.';
      loadRaw(token).catch(error => {
        if (token !== generation || controller.signal.aborted) return;
        clearRaw(); loading = false; failed = true;
        status.textContent = 'Animation unavailable. The preview image remains visible.';
        console.warn('Pre-footer animation:', error.message);
        emit();
      });
    }
    emit();
  }
  function select(nextSource, nextMode) {
    if (!['video','lottie'].includes(nextSource) || !['overlay','sequential'].includes(nextMode)) throw new Error('Unknown pre-footer playback mode');
    source = nextSource; mode = nextMode;
    generation++; clearRaw(); video.pause();
    lastVideoTime = 0;
    ready = false; loading = false; failed = false; activePart = 0; loops = 0;
    raw.hidden = true; video.hidden = false;
    ensureLoaded(); emit();
  }
  function fallbackVideo() {
    if (format !== 'webm') return false;
    format = 'mp4';
    ready = false; loading = true; lastVideoTime = 0;
    video.src = resource(`./media/garden-${mode}.mp4`);
    video.load(); emit();
    return true;
  }
  video.addEventListener('loadeddata', () => {
    if (source !== 'video' || controller.signal.aborted) return;
    if (format === 'webm') {
      // 有些浏览器能解码 VP9，但忽略 alpha；这时使用带底色的 MP4。
      const canvas = document.createElement('canvas');
      canvas.width = canvas.height = 1;
      const context = canvas.getContext('2d', {willReadFrequently:true});
      try {
        context.drawImage(video, 0, 0, 1, 1, 0, 0, 1, 1);
        if (context.getImageData(0, 0, 1, 1).data[3] > 0 && fallbackVideo()) return;
      } catch { if (fallbackVideo()) return; }
    }
    ready = true; loading = false; update();
  }, options);
  video.addEventListener('error', () => {
    if (source !== 'video' || !desktop.matches) return;
    if (fallbackVideo()) return;
    ready = false; loading = false; failed = true;
    status.textContent = 'Animation unavailable. The preview image remains visible.';
    emit();
  }, options);
  let lastVideoTime = 0;
  video.addEventListener('timeupdate', () => {
    if (video.currentTime + .5 < lastVideoTime) { loops++; emit(); }
    lastVideoTime = video.currentTime;
  }, options);
  const loadObserver = new IntersectionObserver(entries => {
    near = entries[0].isIntersecting;
    ensureLoaded();
  }, {rootMargin:'400px 0px'});
  const playObserver = new IntersectionObserver(entries => {
    visible = entries[0].isIntersecting;
    update();
  }, {threshold:0});
  loadObserver.observe(section); playObserver.observe(section.querySelector('.pre-footer__garden'));
  desktop.addEventListener('change', () => {
    if (desktop.matches) { ensureLoaded(); players.forEach(player => player.resize()); }
    else { if (loading && source === 'lottie') { generation++; clearRaw(); loading = false; } }
    update();
  }, options);
  reduced.addEventListener('change', () => { allowMotion = false; update(); }, options);
  document.addEventListener('visibilitychange', update, options);
  toggle.addEventListener('click', () => {
    const willPause = ready && canPlay();
    paused = willPause; allowMotion = !willPause;
    ensureLoaded(); update();
  }, options);
  emit();
  return {
    select,
    restart() {
      loops = 0; activePart = 0; lastVideoTime = 0;
      if (source === 'video') video.currentTime = 0;
      else players.forEach(player => player.goToAndStop(0, true));
      update();
    },
    destroy() {
      generation++; controller.abort(); parallax.destroy(); clearRaw();
      loadObserver.disconnect(); playObserver.disconnect();
      video.pause(); video.removeAttribute('src'); video.load();
    }
  };
}
