# 品牌首页

## 目录
- 分区登记
- 对应文件

## 分区登记
| 分区 ID | 用途 | 状态 |
| --- | --- | --- |
| user-comments | 手机 SVG、等高评论 group 弧线循环、非手机鼠标视差、Google Sheet 来源接口 | 已实现；Home: user comments 已连接 |
| hero | 标题、下载、手机碰杯、背景视差、产品价值 tag 和 Logo marquee | 已按原站及截图实现；Figma 数值待确认 |

FAQ 复用 components/faq/，位于 User comments 之后、自动挂载的 Pre-footer 之前；与 Contact / Download 共用 Sheet 数据、条目颜色及折叠交互。首页分区底色固定为 Darker Linen，使用 linen variant，不接入整页滚动换色。

## 对应文件
根 `index.html` 为首页入口；`scripts/home/index.js` 挂载共享导航、Hero 和 Footer。结构放 `sections/hero/`；数据在 `content/home/hero.json`；交互在 `scripts/home/hero.js`；样式在 `styles/home/`；图片在 `assets/images/home/hero/` 和 `assets/images/home/logo-marquee/`。原组件预览保留在根 `component-preview.html`。
