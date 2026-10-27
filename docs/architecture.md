# 目录与模块规范

## 目录
- 品牌页面
- 活动与文章
- 共享边界
- 命名与入口

## 品牌页面
类型目录下直接用页面名，不设 branding 中间层。每页样式入口放在自己的目录中：`styles/<page>/index.css`。

以首页 hero 为例，各类型保持同一页面/分区路径：
- 结构：`pages/home/sections/hero/`
- 样式：`styles/home/hero.css`
- 交互：`scripts/home/hero.js`（实际需要时创建）
- 数据：`content/home/hero.json`（实际需要时创建）
- 图片：`assets/images/home/hero/`

现有 hero 已按原站公开动画配置和用户截图实现；精确设计值待 Figma 确认。根 index.html 为首页入口，scripts/home/index.js 负责挂载，components 仍由共享入口加载；原组件预览保留为 component-preview.html。Hero 的 Logo 素材独立放在 assets/images/home/logo-marquee/，不作为全站共享组件。其文件名数字前缀决定显示顺序；scripts/tools/sync-marquee.py 生成 content/home/logo-marquee.json，本地自动预览与 GitHub Actions 共用该生成逻辑。前端 scripts/home/marquee.js 根据素材数量和容器宽度生成足量副本并按轨道长度调整时长。新增品牌页面参照 `templates/branding/README.md`。

Contact 入口为 contact.html；类型目录直接使用 contact/，两个分区为 cards 与 form，样式入口 styles/contact/index.css，数据和公开服务配置在 content/contact/。Supabase 函数及迁移放 supabase/；详见 [Contact 接入](contact.md)。

## 活动与文章
复制 `templates/event/` 到 `event/<slug>/`，或 `templates/article/` 到 `article/<slug>/`。模板内 `page.html` 是非完整结构片段，待选定框架后转换为对应页面模块；不得直接当作完成的网页发布。所有页面专属文件留在这个目录，包括只为该页使用的组件、字体或下载文件。创建专属组件时也配 README。

## 共享边界
真正跨页面复用的代码提取到 components/ 或 scripts/shared/；公共基础样式放 styles/foundations/。event/article 可以引用共享代码，但它们的专属文件不混入品牌页面的类型目录。素材避免为每个页面重复复制。页面目录本身不定义发布路由，后续由框架配置路由与资源路径。

## 命名与入口
文件和目录统一 kebab-case，如 `customer-stories`。分区样式使用页面前缀，如 `.home-hero`；共享组件使用 `.site-footer`。全站引入 `styles/shared.css`，首页再引入 `styles/home/index.css`；活动/文章在共享入口之后加载自己的 `styles/page.css`。框架引入后由构建工具处理资源路径，避免使用依赖部署根目录的硬编码路径。

颜色统一在 styles/foundations/tokens.css 定义；组件、页面和预览直接使用色板新名称（如 --color-picnic-date、--color-linen-sheet），不再保留旧颜色别名。阴影值也集中在该文件；Footer 的 --footer-bg / --footer-fg 仅用于组件背景变体。SVG 原始素材保留原文件色值，不按最近颜色重染。
