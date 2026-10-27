// 目录：1. 服务端行项目校验 2. 幂等 Stripe 测试结账接口
import { quoteCart } from '../../../scripts/shop/cart.js';
export async function handleCheckout(request, { catalog, createSession }) {
  if (request.method !== 'POST') return Response.json({message:'Method not allowed.'},{status:405});
  let data, quote;
  try {
    const text = await request.text();
    if (text.length > 12000) throw new Error('Cart request is too large.');
    data = JSON.parse(text);
    if (!/^[0-9a-f-]{36}$/i.test(data.requestId || '')) throw new Error('Please refresh your cart.');
    quote = quoteCart(catalog, data.lines);
    if (!quote.lines.length || !quote.subtotal) throw new Error('Your bag is empty.');
  } catch(error) { return Response.json({message:error.message || 'Invalid cart.'},{status:400}); }
  try {
    // 金额、名称和赠品资格全部由服务端 catalog 重算；不接受客户端价格。
    const session = await createSession(quote, data.requestId);
    return Response.json({url:session.url});
  } catch { return Response.json({message:'Checkout is unavailable. Your bag is still saved.'},{status:503}); }
}
