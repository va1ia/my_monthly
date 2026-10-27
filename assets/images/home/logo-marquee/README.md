# Marquee Logo 素材

## 目录
- 显示顺序
- 更新方法
- 自动同步
- 视觉大小与间距

## 显示顺序
文件名前的数字决定顺序，按数值而非字符串排序，编号可以跳号。当前按用户截图由左至右：

| 编号 | 文件 | 品牌 |
| --- | --- | --- |
| 01 | 01-accesswire.svg | Accesswire |
| 02 | 02-digital-journal.svg | Digital Journal |
| 03 | 03-yahoo-finance.svg | Yahoo Finance |
| 04 | 04-abc-news.svg | ABC News |
| 05 | 05-smearcase.svg | Smearcase |
| 06 | 06-two-moons.svg | Two Moons |
| 07 | 07-hottie.svg | Hottie Co |
| 08 | 08-monthly.svg | Monthly |
| 09 | 09-at-the-table.svg | At the Table |
| 10 | 10-lost-draft.svg | The Lost Draft |
| 11 | 11-birdies-sports.svg | Birdie’s Sporting Club |
| 12 | 12-birdies-lattes.svg | Birdies & Lattes |
| 13 | 13-duo.svg | DUO |

## 更新方法
- 添加：把图片放入本目录，例如 `14-new-brand.svg`。
- 调序：修改文件名前面的数字；重复编号按文件名排序，建议使用唯一编号。
- 替换：直接覆盖原文件，清单携带内容指纹，浏览器自动更新图片缓存。
- 删除：移出或删除对应图片，轨道自动移除。
- 支持 SVG、PNG、JPG/JPEG、WebP、AVIF、GIF；忽略隐藏文件、子目录及符号链接。优先继续使用 SVG，保持 kebab-case 命名。未编号图片也会加入，排在编号图片之后。
- 无需修改 hero.json 或另写 Logo 列表；替代文本由去掉编号后的文件名生成。

## 自动同步
本地使用 `python3 scripts/tools/preview.py` 启动预览。每次读取素材清单都会重新扫描目录，已打开的页面最多约 15 秒内同步，切回页面也会检查。普通 `python3 -m http.server` 只提供静态文件，不会扫描更新。

素材 push 到 GitHub 后，`.github/workflows/sync-marquee.yml` 自动生成并提交清单（需仓库允许 Actions 写入 contents）。该工作流只同步仓库文件，不部署网站；手动静态发布前运行 `python3 scripts/tools/sync-marquee.py`，并将清单与素材一起发布。公开网站不会也不能直接读取本机目录；线上变化在新的静态内容发布后生效。

## 视觉大小与间距
以用户提供的整条 PNG 为视觉参考，SVG 的 width/height（缺失时用 viewBox）参与自动生成清单。各标志按导出尺寸比例缩放，不再塞进等宽/等高格子：圆形徽章保持较大直径，长条文字保留较低高度，左右留白只来自统一的图形间距。新增 SVG 同样自动识别，特别大的素材限制为 180×82 的比例边界。非 SVG 或无有效尺寸时使用 120×44 默认值。响应式缩放与间距统一维护在 styles/home/hero.css，不修改 SVG 内容。
