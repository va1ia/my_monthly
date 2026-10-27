// 目录：1. 同一网格定位圆点与架子 2. 商品和双端展示场景
import { escapeHTML } from '../../../../scripts/shared/dom.js';
const asset = path => new URL(`../../../../assets/images/shop/${path}`, import.meta.url).href;
const percent = (value, total) => `${value / total * 100}%`;
export function renderScene(layout, products, labels, variant, catalog) {
  const { grid: g, width: w, height: h } = layout;
  const placed = layout.products.filter(item => products.some(p => p.slot === item.slot));
  const dots = Array.from({ length: g.rows * g.columns }, (_, i) => {
    const col = i % g.columns, row = Math.floor(i / g.columns);
    const hanger = placed.some(p => p.hanger && p.col === col && p.row === row);
    return `<i class="shop-merch__dot${hanger ? ' shop-merch__dot--hanger' : ''}" style="left:${percent(g.x + col * g.dx,w)};top:${percent(g.y + row * g.dy,h)};width:${percent(g.radius * 2,w)}" aria-hidden="true"></i>`;
  }).join('');
  const shelves = layout.shelves.map(s => `<i class="shop-merch__shelf" style="left:${percent(g.x + s.from * g.dx - g.radius,w)};top:${percent(g.y + s.row * g.dy - g.radius,h)};width:${percent((s.to-s.from)*g.dx+g.radius*2,w)};height:${percent(g.radius*2,h)}" aria-hidden="true"></i>`).join('');
  const images = placed.map(item => {
    const product = products.find(p => p.slot === item.slot);
    const soldOut = catalog?.products.some(p=>p.soldOut && p.variants.some(v=>v.slot===item.slot));
    const height = item.width * product.height / product.width;
    const y = g.y + item.row * g.dy + (item.offsetY || 0) - (item.anchor === 'bottom' ? height : 0);
    return `<button type="button" class="shop-merch__product" data-product-slot="${item.slot}" aria-label="View ${escapeHTML(labels[item.slot] || product.file)}${soldOut?', sold out':''}" style="left:${percent(g.x + item.col*g.dx-item.width/2,w)};top:${percent(y,h)};width:${percent(item.width,w)}"><img src="${asset(`products/${encodeURIComponent(product.file)}`)}?v=${product.version}" alt="" width="${product.width}" height="${product.height}" decoding="async">${soldOut?'<span class="shop-sold-out">Sold out</span>':''}</button>`;
  }).join('');
  return `<div class="shop-merch__scene shop-merch__scene--${variant}" style="aspect-ratio:${w}/${h}">${dots}${shelves}${images}</div>`;
}
export function renderMerch(config, manifest, catalog) {
  const message = escapeHTML(config.announcement);
  return `<section class="shop-merch" aria-labelledby="merch-title"><a class="shop-merch__announcement" href="${escapeHTML(config.announcementUrl)}" target="_blank" rel="noopener noreferrer"><span class="visually-hidden">Follow My Monthly on Instagram for early access</span><span class="shop-merch__announcement-track" aria-hidden="true">${Array.from({length:4},()=>`<span>✦ &nbsp; ${message} &nbsp; </span>`).join('')}</span></a><picture class="shop-merch__awning"><source media="(max-width: 767px)" srcset="${asset('awning-mobile.svg')}"><img src="${asset('awning-desktop.svg')}" width="1728" height="170" alt=""></picture><h1 id="merch-title" class="shop-merch__title">${escapeHTML(config.title)}</h1>${renderScene(config.desktop,manifest.products,config.labels,'desktop',catalog)}${renderScene(config.mobile,manifest.products,config.labels,'mobile',catalog)}</section>`;
}
