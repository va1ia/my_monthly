// 目录：1. 顶部购物入口 2. 原生模态弹窗容器
export function renderShopDialogs() {
  return `<div class="shop-tools" aria-label="Shopping tools"><button type="button" data-open-favorites>Saved <span data-saved-count>0</span></button><button type="button" data-open-cart>Bag <span data-cart-count>0</span></button></div>
  <dialog class="shop-dialog" data-product-dialog aria-labelledby="product-dialog-title"></dialog>
  <dialog class="shop-dialog shop-dialog--bag" data-bag-dialog aria-labelledby="bag-dialog-title"></dialog>
  <p class="shop-notice" role="status" aria-live="polite"></p>`;
}
