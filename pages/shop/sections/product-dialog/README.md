# Shop 商品弹窗与购物车

## 目录
- 用户交互
- 商品与状态
- 存储
- 付款接口
- 验证

## 用户交互
结构 product-dialog.js，逻辑 scripts/shop/shopping.js，金额与行项目校验 scripts/shop/cart.js，样式 styles/shop/shopping.css。展示墙商品是可键盘操作的按钮；hover/focus 轻微上移并加投影，减少动态效果偏好下取消位移。原生 dialog 居中、限制高度并内部滚动，支持 Escape、关闭按钮、点击外部关闭，背景不可操作。点击颜色切换 SVG 和选中状态，Save 切换收藏；Bag 修改数量、移除并更新小计。

## 商品与状态
content/shop/catalog.json 为唯一文案和基础价格来源（美元分），前端与预留服务端共用，不信任浏览器提交价格。10 个 SVG slot 归为 5 款商品，颜色有各自 slot。T-shirt / Tote 按用户要求 soldOut:true、event:true：展示墙右上角和弹窗图左上角显示胶囊标签，加入购物车禁用，仍可收藏。event 是线下活动属性，目前不控制导航或结账。T-shirt 尺码未提供，sizes 为空；将来解除售罄还需先填写尺码。

Tote 保留“Free with purchase over $50”信息，当前售罄不宣传可领取。规则恢复后按商品小计严格大于 5000 分、一单一只；价格合计不含运费和税。每行数量 1–10，单车最多 50 件，重复变体合并。

## 存储
收藏与购物车仅保存在当前浏览器 localStorage，不是账号跨设备同步。购物车存 slot/quantity/size，不存支付信息；刷新时按当前 catalog 校验。浏览器禁用存储时本次访问仍可操作并提示。购物车与弹窗关闭不丢已添加商品；测试产生的购物车及收藏已通过 UI 清理。

## 付款接口
content/shop/checkout.json 当前 enabled:false，按钮显示 Checkout coming soon。Supabase shop-checkout 源码仅预留测试接口，尚未部署、未连接 Stripe、未产生付款；不得将购物车本地成功描述为真实订单。具体接入、公司账号、美国运费及上线前库存/回调工作见 docs/shop-checkout.md。

## 验证
浏览器已验证颜色切换、真实本地收藏列表、加入、数量 1→2 小计 $35→$70、刷新保留、移除、Escape 关闭、T-shirt 售罄按钮禁用，320/390/768/1440px 页面与弹窗无横向溢出。程序测试覆盖售罄、金额篡改、数量、赠品 $50 边界与结账失败保留；命令 node scripts/tools/test-shop.mjs。真实 Stripe 交易未测试。
