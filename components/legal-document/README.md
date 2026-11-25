# Legal document

## 目录
- 用途与接口
- 排版与可访问性
- 文案来源
- 验证记录

## 用途与接口
Terms of Service / Privacy Policy 共用 `renderLegalDocument({ title, updated, body })`，返回经过 HTML 转义的文章结构。共享挂载入口为 `scripts/shared/legal-page.js`，页面分别使用自己的 scripts / styles 入口。复用全站 Menu bar、默认 Pre-footer、brand Footer 和订阅适配器，不提供 Share 按钮、社交分享链接或分享脚本。

## 排版与可访问性
参考原站：浅奶油背景、居中绿色标题、深色更新时间胶囊、640px 单栏正文、加粗条款名。手机两侧留白 7%，正文使用 16px 保证阅读；原站手机版为 15px。字号集中于 foundations/tokens.css，排版测量值待 Figma 确认，不新增最终品牌规范。

两个法律页通过同一份 legal-document.css，将 Pre-footer 的 background-color 设为正文使用的 --color-article-cream。复用原组件从透明到天空蓝的渐变和动画素材，使顶部与正文自然衔接，无需复制文件或修改其他页面。

文档用 article、单个 h1、段落和有序列表；保留表格中的字母及罗马编号作为列表项原文。仅移除无视觉含义的零宽连接符和段落边缘空白。Privacy Policy 的文内链接指向新版页面，支持邮箱链接、跳过导航及键盘焦点。正文与颜色复用现有字体和色板；列表和长文字可在窄屏换行。

## 文案来源
`content/terms-of-service/page.json` / `content/privacy-policy/page.json` 各保存用户指定 Google Sheet 的完整文案及来源。为核对后的固定快照，页面不自动订阅表格变更；字段见各目录 README。加载失败显示重新加载及联系支持提示。

## 验证记录
2026-11-24：两个页面均在浏览器检查 390px、820px、1440px 宽度，无横向溢出。确认文内隐私政策链接、Footer 法律链接、手机菜单打开与 Escape 关闭和焦点恢复；浏览器无错误日志，图片均有 alt 属性，未发现 Share 分享链接。渲染后的完整文字与表格快照在忽略零宽连接符和空白差异后完全一致。正文 / 奶油背景对比度 14.47:1，绿色标题 / 背景 7.52:1。未提交订阅表单，未发布线上网站。
