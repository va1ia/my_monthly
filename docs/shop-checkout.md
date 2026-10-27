# Shop 收款接入

## 目录
- 当前状态
- 预留接口
- 公司账号接入
- 正式上线前

## 当前状态
用户已选择自建购物车 + Stripe，明确不使用 Shopify。商品、价格与描述以用户提供的产品信息图片为准。T-shirt、Tote 当前 sold out，event:true；只允许美国配送，运费和公司 Stripe 账号后续提供。前端交互已可用，真实结账关闭。没有创建 Stripe 账号、商品或支付链接，没有部署此函数，也没有使用 Shopify 商品或价格。

## 预留接口
POST /functions/v1/shop-checkout 接受 {lines:[{slot,quantity,size}],requestId:UUID}。返回 {url:StripeCheckoutURL} 或 {message}；浏览器仅接受 https://checkout.stripe.com。服务端重算 catalog 价格、合并行、拒绝售罄和超量。requestId 与行项目摘要用作 Stripe 幂等键。接口不会接受客户端设置的价格、回跳域名、运费或国家。错误不清空购物车。

源码目前仅支持 Stripe 测试密钥，默认返回 503；不会因前端打开按钮就开始收取真实款项。Stripe Session 创建属于真实账户操作，当前仅验证了注入适配器的金额和失败路径，未对 Stripe 发起请求。服务端 gate 保持关闭，直到账号与运费齐备。

## 公司账号接入
通过公司 Stripe Dashboard 配置测试环境，密钥仅保存 Supabase Secrets，不写前端或 Git。
- STRIPE_SECRET_KEY：sk_test_ 测试密钥。
- STRIPE_US_SHIPPING_RATE_ID：公司确认的测试运费规则，不能把未知运费默认为免费。
- SHOP_SITE_URL：允许的本站来源，不带尾部斜线，用于 shop.html 回跳。
- SHOP_ALLOWED_ORIGINS：允许的本站 origin，包含 SHOP_SITE_URL；本地默认 4173、4174。
- SHOP_TEST_CHECKOUT_ENABLED：完成上述配置后才设置 true。

部署 shop-checkout 并测试接口后，才打开 content/shop/checkout.json 的 enabled。Shipping address collection 固定 US。外部 stripe.com 付款返回页只显示等待确认，不能根据 URL 宣布付款成功或清空购物车。

## 正式上线前
测试接口不等于完整实物订单系统。后续需完成：公司确认库存及尺寸、服务端原子库存预留/支付失败与过期释放、带签名校验和幂等处理的 Stripe 支付回调、订单落库及订单邮件/发货流程、税务配置、测试支付/取消/重试/售罄与运费验证。完成这些后才能另行实现和开启 live 模式；当前源码主动拒绝 live 密钥。

参考官方接口：[Checkout Session](https://docs.stripe.com/api/checkout/sessions/create)、[履约与支付确认](https://docs.stripe.com/checkout/fulfillment)。
