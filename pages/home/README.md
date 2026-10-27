# 品牌首页

## 目录
- 分区登记
- 对应文件

## 分区登记
| 分区 ID | 用途 | 状态 |
| --- | --- | --- |
| hero | 标题、下载、手机碰杯、背景视差、产品价值 tag 和 Logo marquee | 已按原站及截图实现；Figma 数值待确认 |

## 对应文件
根 `index.html` 为首页入口；`scripts/home/index.js` 挂载共享导航、Hero 和 Footer。结构放 `sections/hero/`；数据在 `content/home/hero.json`；交互在 `scripts/home/hero.js`；样式在 `styles/home/`；图片在 `assets/images/home/hero/` 和 `assets/images/home/logo-marquee/`。原组件预览保留在根 `component-preview.html`。
