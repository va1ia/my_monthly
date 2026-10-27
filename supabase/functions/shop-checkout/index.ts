// 目录：1. 来源与测试开关 2. Stripe Checkout 适配器（仅测试模式）
import catalog from '../../../content/shop/catalog.json' with { type: 'json' };
import { handleCheckout } from './handler.js';
Deno.serve(async request => {
  const origin = request.headers.get('origin') || '';
  const allowed = (Deno.env.get('SHOP_ALLOWED_ORIGINS') || 'http://127.0.0.1:4173,http://127.0.0.1:4174').split(',').map(s=>s.trim());
  if (!allowed.includes(origin)) return new Response('Origin not allowed',{status:403});
  const headers = {'Access-Control-Allow-Origin':origin,'Access-Control-Allow-Headers':'content-type','Access-Control-Allow-Methods':'POST, OPTIONS','Vary':'Origin'};
  if (request.method === 'OPTIONS') return new Response(null,{status:204,headers});
  const key = Deno.env.get('STRIPE_SECRET_KEY') || '';
  const shippingRate = Deno.env.get('STRIPE_US_SHIPPING_RATE_ID') || '';
  const site = Deno.env.get('SHOP_SITE_URL') || '';
  // 目前仅预留测试连接；正式开放前必须补齐库存预留、签名支付回调和履约流程。
  if (Deno.env.get('SHOP_TEST_CHECKOUT_ENABLED') !== 'true' || !key.startsWith('sk_test_') || !shippingRate || !allowed.includes(site)) {
    return Response.json({message:'Checkout is coming soon. Your bag is saved.'},{status:503,headers});
  }
  const response = await handleCheckout(request,{catalog,createSession:async (quote,requestId)=>{
    const params = new URLSearchParams({mode:'payment',success_url:`${site}/shop.html?checkout=return`,cancel_url:`${site}/shop.html?checkout=cancel`});
    params.set('shipping_address_collection[allowed_countries][0]','US');
    params.set('shipping_options[0][shipping_rate]',shippingRate);
    params.set('payment_method_types[0]','card');
    for (const [i,line] of quote.lines.entries()) {
      params.set(`line_items[${i}][price_data][currency]`,catalog.currency.toLowerCase());
      params.set(`line_items[${i}][price_data][unit_amount]`,String(line.product.priceCents));
      params.set(`line_items[${i}][price_data][product_data][name]`,`${line.product.name} — ${line.variant.label}${line.size?` / ${line.size}`:''}`);
      params.set(`line_items[${i}][quantity]`,String(line.quantity));
    }
    const digest = await crypto.subtle.digest('SHA-256',new TextEncoder().encode(JSON.stringify(quote.lines.map(l=>({slot:l.slot,size:l.size,quantity:l.quantity,price:l.product.priceCents})))));
    const hash = [...new Uint8Array(digest)].map(v=>v.toString(16).padStart(2,'0')).join('');
    const result = await fetch('https://api.stripe.com/v1/checkout/sessions',{method:'POST',headers:{Authorization:`Bearer ${key}`,'Content-Type':'application/x-www-form-urlencoded','Idempotency-Key':`monthly-${requestId}-${hash}`},body:params,signal:AbortSignal.timeout(15000)});
    if (!result.ok) throw new Error('Stripe checkout failed');
    return result.json();
  }});
  for (const [name,value] of Object.entries(headers)) response.headers.set(name,value);
  return response;
});
