# Shop 商品 SVG

## 目录
- 替换商品
- 新增商品与摆放
- 编号对照

## 替换商品
此目录专门存放产品 SVG，顶棚装饰放上一级目录。直接覆盖同名文件即可；也可保留编号前缀、更换后半段描述，例如 01-new-visor.svg。一个编号只留一个 SVG，旧图需移出此目录，禁止重复编号。保留 SVG viewBox，尺寸会自动识别，按宽度等比显示。

本地通过 scripts/tools/preview.py 预览时，读取 content/shop/products.json 会自动扫描此目录。文件内容变化生成版本号以刷新图片缓存；替换为同比例图片不改变位置，比例不同则保留宽度和支撑点。普通静态服务器不会生成清单，需运行 python3 scripts/tools/sync-shop-products.py。GitHub 推送后新工作流负责更新清单；本次没有推送或验证云端工作流。

## 新增商品与摆放
新商品仍使用编号文件名。content/shop/merch.json 的 labels 和 desktop/mobile.products 分别设置商品说明、双端摆放。只有配置过位置的编号会展示；放入新编号不会猜测商品类型或覆盖旧位置。用户提供新设计稿后调整布局。替换已有编号不需要修改位置配置；商品标题、价格、颜色和售罄须另在 content/shop/catalog.json 更新，新增编号也需对应 catalog 变体才能打开详情。

## 编号对照
01 绿色空顶帽；02 米色空顶帽；03 米色棒球帽；04 绿色棒球帽；05 米色 T-shirt；06 绿色 T-shirt；07 米色 tote；08 绿色 tote；09 粉色人物 pin；10 绿色人物 pin。当前 SVG 均来自用户上传，仅重命名与移动，没有改动矢量内容。
