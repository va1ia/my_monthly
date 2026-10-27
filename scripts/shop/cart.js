// 目录：1. 商品识别与金额 2. 可信行项目校验（前端和服务端共用）
export const money = (amount, currency = 'USD') => new Intl.NumberFormat('en-US', { style: 'currency', currency, maximumFractionDigits: amount % 100 ? 2 : 0 }).format(amount / 100);
export function findVariant(catalog, slot) {
  for (const product of catalog.products) {
    const variant = product.variants.find(v => v.slot === slot);
    if (variant) return { product, variant };
  }
  throw new Error('This item is no longer available.');
}
export function quoteCart(catalog, input) {
  if (!Array.isArray(input) || input.length > 20) throw new Error('Please check your cart.');
  const merged = new Map();
  for (const line of input) {
    const { product, variant } = findVariant(catalog, line.slot);
    if (product.soldOut) throw new Error(`${product.name} is sold out.`);
    if (!Number.isInteger(line.quantity) || line.quantity < 1 || line.quantity > 10) throw new Error('Choose a quantity between 1 and 10.');
    const size = product.requiresSize ? line.size : '';
    if (product.requiresSize && !product.sizes.includes(size)) throw new Error('Please choose an available T-shirt size.');
    const key = `${variant.slot}:${size}`;
    const previous = merged.get(key);
    const quantity = (previous?.quantity || 0) + line.quantity;
    if (quantity > 10) throw new Error('You can add up to 10 of each item.');
    merged.set(key, { key, slot: variant.slot, size, quantity, product, variant });
  }
  const lines = [...merged.values()];
  if (lines.reduce((n,l)=>n+l.quantity,0) > 50) throw new Error('Please limit your cart to 50 items.');
  const subtotal = lines.filter(l=>!l.product.gift).reduce((n,l)=>n+l.product.priceCents*l.quantity,0);
  const gifts = lines.filter(l=>l.product.gift);
  if (gifts.reduce((n,l)=>n+l.quantity,0) > 1) throw new Error('Please choose one complimentary tote per order.');
  if (gifts.length && subtotal <= catalog.giftThresholdCents) throw new Error('Your complimentary tote needs a merchandise subtotal over $50.');
  return { lines, subtotal };
}
