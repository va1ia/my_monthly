# 首页内容

## 目录
- 分区数据
- Hero
- Logo marquee

## 分区数据
按分区添加 `<section>.json`，字段说明放在此处，JSON 中不加入注释。

## Hero
`hero.json`：title 为两段标题；downloadHref 为 App Store 地址；tags 按蓝、浅粉、粉顺序。文案与目标网站当前三条产品价值 tag 一致；tag 目的地待确认。

## Logo marquee
`logo-marquee.json` 为自动生成文件，不手动编辑。logos 数组由 assets/images/home/logo-marquee/ 扫描生成：file 为含编号的图片文件名，name 为去掉编号后的替代文本，version 为文件内容 SHA-256 前 12 位，width/height 为 SVG 导出尺寸（无效或非 SVG 时默认 120×44），用于保留各 Logo 的视觉比例。添加、删除、排序只需改素材文件；替换图片自动更新缓存标识。具体用法见素材目录 README。
