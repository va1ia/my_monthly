# Shop 数据

## 目录
- 文案与布局
- 自动商品清单
- 商品目录与收款

## 文案与布局
merch.json：title 为 Limited Edition Merch 招牌，announcement / announcementUrl 为早鸟公告及入口，labels 按商品编号提供替代文字，desktop / mobile 为两套展示位置。布局字段说明见 ../../pages/shop/sections/merch/README.md。

## 自动商品清单
products.json 由 scripts/tools/sync-shop-products.py 生成，请勿手工编辑。包含 slot、文件名、SVG 尺寸及内容版本号；商品只从 assets/images/shop/products/ 扫描。已有编号换图会自动沿用位置；新增编号需在 merch.json 配置位置和说明。

## 商品目录与收款
catalog.json 是 5 款商品文案、价格（美元分）、颜色 slot 与状态的单一来源；前端与预留服务端共用。soldOut 禁止购买；event 为活动属性，T-shirt / Tote 当前均为 true，按用户最新要求售罄。requiresSize / sizes 控制尺码，未提供的 T-shirt 尺码不推测。checkout.json enabled 当前 false，url 为未来 Supabase 结账接口；只有完成账户、运费和服务端配置后才能开放。说明见 ../../docs/shop-checkout.md。
