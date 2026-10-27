// 目录：1. 本机存储和计数 2. 商品弹窗 3. 购物车与收藏 4. Stripe 入口与清理
import { escapeHTML as e } from '../shared/dom.js';
import { findVariant, quoteCart, money } from './cart.js';
import { renderShopDialogs } from '../../pages/shop/sections/product-dialog/product-dialog.js';
export function mountShopping(host, catalog, manifest, checkout) {
  host.insertAdjacentHTML('afterbegin', renderShopDialogs());
  const controller = new AbortController(), options = { signal: controller.signal };
  const productDialog = host.querySelector('[data-product-dialog]'), bagDialog = host.querySelector('[data-bag-dialog]');
  const notice = host.querySelector('.shop-notice');
  let cart = [], saved = [], selected, selectedSize = '', busy = false, revision = crypto.randomUUID();
  function read(key, fallback) { try { return JSON.parse(localStorage.getItem(key)) ?? fallback; } catch { return fallback; } }
  const storedCart = read('monthly-shop-cart-v1', []);
  try { cart = quoteCart(catalog, storedCart).lines.map(compact); } catch { cart = []; }
  const storedSaved = read('monthly-shop-saved-v1', []);
  if (Array.isArray(storedSaved)) saved = [...new Set(storedSaved.filter(s=>manifest.products.some(p=>p.slot===s)))];
  function compact(line) { return { slot: line.slot, quantity: line.quantity, size: line.size || '' }; }
  function persist() {
    revision = crypto.randomUUID();
    try { localStorage.setItem('monthly-shop-cart-v1', JSON.stringify(cart)); localStorage.setItem('monthly-shop-saved-v1', JSON.stringify(saved)); }
    catch { notice.textContent = 'Your browser can’t save these items between visits.'; }
    host.querySelector('[data-cart-count]').textContent = cart.reduce((n,l)=>n+l.quantity,0);
    host.querySelector('[data-saved-count]').textContent = saved.length;
  }
  function image(slot) {
    const item = manifest.products.find(p=>p.slot===slot);
    return new URL(`../../assets/images/shop/products/${encodeURIComponent(item.file)}?v=${item.version}`, import.meta.url).href;
  }
  function announce(text) { notice.textContent = text; }
  function show(dialog) { dialog.showModal(); document.documentElement.classList.add('shop-modal-open'); }
  const closeButton = '<button type="button" class="shop-dialog__close" data-close aria-label="Close dialog">×</button>';
  function renderProduct() {
    const { product: p, variant: v } = findVariant(catalog, selected);
    const { subtotal } = quoteCart(catalog, cart);
    const eligible = subtotal > catalog.giftThresholdCents;
    const needsSize = p.requiresSize && !p.sizes.length;
    const unavailable = p.soldOut || needsSize;
    productDialog.innerHTML = `${closeButton}<div class="shop-dialog__image">${p.soldOut?'<span class="shop-sold-out">Sold out</span>':''}<img src="${image(v.slot)}" alt="${e(p.name)} — ${e(v.label)}"></div><div class="shop-dialog__body"><h2 id="product-dialog-title">${e(p.name)}</h2><p class="shop-dialog__price">${p.gift ? 'Free with purchase over $50' : money(p.priceCents,catalog.currency)}</p><fieldset class="shop-dialog__colors"><legend>Color: ${e(v.label)}</legend>${p.variants.map(color=>`<label class="shop-swatch" style="--swatch:${color.color}"><input type="radio" name="product-color" value="${color.slot}" aria-label="${e(color.label)}" ${v.slot===color.slot?'checked':''}><span aria-hidden="true"></span></label>`).join('')}</fieldset><p class="shop-dialog__description">${e(p.description)}</p>${p.requiresSize && !p.soldOut ? `<label class="shop-dialog__size">Size<select data-size ${needsSize?'disabled':''}><option value="">${needsSize?'Sizes coming soon':'Choose a size'}</option>${p.sizes.map(s=>`<option ${s===selectedSize?'selected':''}>${e(s)}</option>`).join('')}</select></label>`:''}<div class="shop-dialog__actions"><button type="button" class="shop-action shop-action--primary" data-add ${unavailable||(p.gift&&!eligible)?'disabled':''}>${p.soldOut?'Sold out':p.gift?'Choose complimentary tote':'Add to bag'}</button><button type="button" class="shop-action" data-save aria-pressed="${saved.includes(v.slot)}">${saved.includes(v.slot)?'♥ Saved':'♡ Save'}</button></div><p class="shop-dialog__status" role="status">${p.soldOut?'This item is currently sold out. Save it for later.':needsSize?'T-shirt sizes will be available soon.':p.gift&&!eligible?'Add more than $50 in merchandise to choose your complimentary tote.':''}</p></div>`;
  }
  function openProduct(slot) { selected = slot; selectedSize = ''; renderProduct(); show(productDialog); }
  function addSelected() {
    const { product } = findVariant(catalog, selected);
    let next = product.gift ? cart.filter(l=>!findVariant(catalog,l.slot).product.gift) : [...cart];
    try {
      next = quoteCart(catalog, [...next,{slot:selected,size:selectedSize,quantity:1}]).lines.map(compact);
      cart = next; persist(); productDialog.querySelector('.shop-dialog__status').textContent = product.gift ? 'Your complimentary tote is in your bag.' : 'Added to your bag. Looking good!';
    } catch (error) { productDialog.querySelector('.shop-dialog__status').textContent = error.message; }
  }
  function renderBag(mode = 'cart') {
    bagDialog.dataset.mode = mode;
    const quote = quoteCart(catalog, cart);
    const lines = mode==='saved' ? saved.map(slot=>({...findVariant(catalog,slot),slot,quantity:1})) : quote.lines;
    bagDialog.innerHTML = `${closeButton}<div class="shop-dialog__body"><h2 id="bag-dialog-title" tabindex="-1">${mode==='saved'?'Your saved finds':'Your bag'}</h2><div class="shop-bag__items">${lines.map(l=>`<div class="shop-bag__item"><button type="button" class="shop-bag__preview" data-view="${l.slot}" aria-label="View ${e(l.product.name)}"><img src="${image(l.slot)}" alt=""></button><div><h3>${e(l.product.name)}</h3><p>${e(l.variant.label)}${l.size?` · ${e(l.size)}`:''}</p><p>${l.product.gift?'Complimentary':money(l.product.priceCents,catalog.currency)}</p>${mode==='cart'&&!l.product.gift?`<label>Quantity <input type="number" min="1" max="10" value="${l.quantity}" data-quantity="${e(l.key)}" aria-label="Quantity for ${e(l.product.name)} — ${e(l.variant.label)}"></label>`:''}<button type="button" class="shop-bag__remove" data-remove="${e(mode==='saved'?l.slot:l.key)}">Remove</button></div></div>`).join('')||'<p>A little empty for now. Find something you love on the shelf.</p>'}</div>${mode==='cart'?`<p class="shop-bag__gift">${catalog.products.find(p=>p.gift)?.soldOut?'Our complimentary event totes are currently sold out.':quote.subtotal>catalog.giftThresholdCents?'Your order qualifies for one complimentary tote. Choose your color on the shelf.':'Receive a complimentary tote with merchandise purchases over $50.'}</p><div class="shop-bag__total"><span>Subtotal</span><strong>${money(quote.subtotal,catalog.currency)}</strong></div><p class="shop-bag__fine">US shipping only. Shipping rates will be available when checkout opens.</p><button type="button" class="shop-action shop-action--primary" data-checkout ${!lines.length||!checkout.enabled?'disabled':''}>Checkout</button>${!checkout.enabled?'<p class="shop-bag__fine">Checkout is coming soon. Your bag is saved for your next visit.</p>':''}`:''}<p class="shop-dialog__status" role="status"></p></div>`;
  }
  function removeIneligibleGift(lines) {
    const subtotal = lines.filter(l=>!findVariant(catalog,l.slot).product.gift).reduce((n,l)=>n+findVariant(catalog,l.slot).product.priceCents*l.quantity,0);
    return subtotal>catalog.giftThresholdCents ? lines : lines.filter(l=>!findVariant(catalog,l.slot).product.gift);
  }
  host.addEventListener('click', async event => {
    const button = event.target.closest('button'); if (!button) return;
    if (button.matches('[data-product-slot]')) openProduct(button.dataset.productSlot);
    if (button.matches('[data-open-cart],[data-open-favorites]')) { renderBag(button.matches('[data-open-cart]')?'cart':'saved'); show(bagDialog); }
    if (button.matches('[data-close]')) button.closest('dialog').close();
    if (button.matches('[data-add]')) addSelected();
    if (button.matches('[data-save]')) { saved = saved.includes(selected)?saved.filter(s=>s!==selected):[...saved,selected]; persist(); button.setAttribute('aria-pressed',String(saved.includes(selected))); button.textContent = saved.includes(selected)?'♥ Saved':'♡ Save'; }
    if (button.matches('[data-view]')) { bagDialog.close(); openProduct(button.dataset.view); }
    if (button.matches('[data-remove]')) {
      const mode = bagDialog.dataset.mode;
      if (mode==='saved') saved = saved.filter(s=>s!==button.dataset.remove);
      else cart = removeIneligibleGift(quoteCart(catalog,cart).lines.filter(l=>l.key!==button.dataset.remove).map(compact));
      persist(); renderBag(mode); bagDialog.querySelector('h2').focus();
    }
    if (button.matches('[data-checkout]') && !busy && checkout.enabled) {
      busy = true; button.disabled = true;
      const status = bagDialog.querySelector('.shop-dialog__status'); status.textContent = 'Getting your checkout ready…';
      try {
        const response = await fetch(checkout.url,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({lines:cart,requestId:revision}),signal:AbortSignal.any([controller.signal,AbortSignal.timeout(20000)])});
        const result = await response.json();
        if (!response.ok) throw new Error(result.message || 'Checkout is unavailable. Please try again.');
        const url = new URL(result.url);
        if (url.protocol!=='https:'||url.hostname!=='checkout.stripe.com') throw new Error('Checkout could not be opened.');
        window.location.assign(url.href);
      } catch(error) { status.textContent = error.message; button.disabled = false; }
      finally { busy = false; }
    }
  }, options);
  host.addEventListener('change',event=>{
    if (event.target.name==='product-color') { selected = event.target.value; renderProduct(); productDialog.querySelector('input:checked').focus(); }
    if (event.target.matches('[data-size]')) selectedSize = event.target.value;
  },options);
  host.addEventListener('input',event=>{
    if (!event.target.matches('[data-quantity]')) return;
    try {
      const next=cart.map(l=>`${l.slot}:${l.size}`===event.target.dataset.quantity?{...l,quantity:Number(event.target.value)}:l);
      const quote=quoteCart(catalog,removeIneligibleGift(next));
      cart=quote.lines.map(compact);persist();
      bagDialog.querySelector('.shop-bag__total strong').textContent=money(quote.subtotal,catalog.currency);
      bagDialog.querySelector('.shop-dialog__status').textContent='';
      bagDialog.querySelector('[data-checkout]').disabled=!checkout.enabled || !quote.lines.length;
    } catch(error) {
      bagDialog.querySelector('.shop-dialog__status').textContent=error.message;
      bagDialog.querySelector('[data-checkout]').disabled=true;
    }
  },options);
  for (const dialog of [productDialog,bagDialog]) {
    dialog.addEventListener('close',()=>{ if(!host.querySelector('dialog[open]'))document.documentElement.classList.remove('shop-modal-open'); },options);
    dialog.addEventListener('click',event=>{if(event.target===dialog){const b=dialog.getBoundingClientRect();if(event.clientX<b.left||event.clientX>b.right||event.clientY<b.top||event.clientY>b.bottom)dialog.close();}},options);
  }
  persist();
  const returned = new URLSearchParams(location.search).get('checkout');
  if (returned==='return') announce('Thanks for stopping by! Your payment status will be confirmed by email.');
  if (returned==='cancel') announce('Your bag is still here whenever you’re ready.');
  return {destroy(){controller.abort();productDialog.close();bagDialog.close();}};
}
