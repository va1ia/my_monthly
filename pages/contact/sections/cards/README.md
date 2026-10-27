# Contact cards

## 目录
- 文件与接口
- 交互和适配
- 来源

## 文件与接口
cards.js 的 renderCards(content) 接收 content/contact/page.json，样式在 styles/contact/cards.css，交互在 scripts/contact/motion.js。仅 Contact 使用；复用 assets/images/contact/ 的用户上传 SVG。

## 交互和适配
桌面为两张 460px 插画，左卡下移 10vw；平板重叠；手机按用户 2026-10-23 截图排列：粉色右上、蓝色左下，插画允许边缘裁切，HTML 正文与邮箱保留在视口内。文案和邮件为 HTML，装饰为空 alt。原站 a-31 动画：X -2→2vw、Y 0→4vw、restingState 50、smoothing 50。768px 以上精细悬停指针启用，触屏及减少动画静止。mountContactMotion 返回 destroy 清理监听与动画。

卡片悬停轻微降低饱和度和亮度，邮箱悬停透明度降至 .65；邮箱键盘焦点同样反馈。减少动画时取消过渡。

## 来源
https://mymonthly.io/contact 的公开 HTML、CSS、Webflow ix2 数据。布局为测量值，待 Figma 确认。
