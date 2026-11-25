# 目录与模块规范

## 目录
- 品牌页面
- 活动与文章
- 共享边界
- 命名与入口

## 品牌页面
Ambassador Program 入口为 `ambassador.html`，结构 `pages/ambassador/page.js`、样式 `styles/ambassador/index.css`、入口 `scripts/ambassador/index.js`、数据 `content/ambassador/page.json`，素材按 `assets/images/ambassador/{hero,program,perks}/` 分区。复用 Menu bar / Footer；本页按 Figma 使用专属 Perks 人物结尾，显式关闭通用 Pre-footer，避免重复花园。全站 Pre-footer 的 Ambassador 卡片进入本页；申请表地址保留在本页配置。

完整 FAQ 入口为 `faq.html`，结构 pages/faq/page.js、样式 styles/faq/index.css、脚本 scripts/faq/index.js、来源 content/faq/source.json。复用共享 FAQ 的 full 变体与读取器，独立绑定 Q&A: All；底部复用默认 Pre-footer / Footer，与法律页面共用 --pre-footer-base-bg 设置奶油色顶部衔接。简略 FAQ 保持原 Q&A: Preview 数据源。

法律页入口为 `terms-of-service.html` / `privacy-policy.html`，各自使用 `styles/<page>/index.css`、`scripts/<page>/index.js`、`content/<page>/page.json`。跨页面结构与排版封装于 `components/legal-document/`，共享挂载逻辑位于 `scripts/shared/legal-page.js`，复用现有 Menu bar / Pre-footer / Footer。文案为用户指定 Google Sheet 的完整快照，来源与字段见相邻 README；未加入 Share 功能。

Press 入口为 `press.html`；结构 `pages/press/sections/archive/`，样式 `styles/press/index.css`，脚本 `scripts/press/index.js`，数据 `content/press/archive.json`，素材 `assets/images/press/archive/`。首屏与 Footer 共用订阅适配器，背景复用 pointer-parallax；Pre-footer 由共享 Footer 自动挂载。

类型目录下直接用页面名，不设 branding 中间层。每页样式入口放在自己的目录中：`styles/<page>/index.css`。

以首页 hero 为例，各类型保持同一页面/分区路径：
- 结构：`pages/home/sections/hero/`
- 样式：`styles/home/hero.css`
- 交互：`scripts/home/hero.js`（实际需要时创建）
- 数据：`content/home/hero.json`（实际需要时创建）
- 图片：`assets/images/home/hero/`

现有 hero 已按原站公开动画配置和用户截图实现；精确设计值待 Figma 确认。根 index.html 为首页入口，scripts/home/index.js 负责挂载，components 仍由共享入口加载；原组件预览保留为 component-preview.html。Hero 的 Logo 素材独立放在 assets/images/home/logo-marquee/，不作为全站共享组件。其文件名数字前缀决定显示顺序；scripts/tools/sync-marquee.py 生成 content/home/logo-marquee.json，本地自动预览与 GitHub Actions 共用该生成逻辑。前端 scripts/home/marquee.js 根据素材数量和容器宽度生成足量副本并按轨道长度调整时长。新增品牌页面参照 `templates/branding/README.md`。

Contact 入口为 contact.html；类型目录直接使用 contact/，分区为 cards、form、faq，样式入口 styles/contact/index.css，数据和公开服务配置在 content/contact/。Q&A 的内容来源位于 content/contact/faq.json，问答条目透明，不再加载颜色配置。Supabase 函数及迁移放 supabase/；详见 [Contact 接入](contact.md)。

Shop 入口 shop.html，分区 merch、product-dialog。结构 pages/shop/sections/merch/，样式 styles/shop/index.css，入口 scripts/shop/index.js，布局与清单 content/shop/，素材 assets/images/shop/。products/ 为可替换编号 SVG，scripts/tools/sync-shop-products.py 生成清单；本地预览按请求同步，GitHub 工作流按素材变化同步。商品文本和价格由 content/shop/catalog.json 管理；scripts/shop/shopping.js 挂载弹窗/收藏/本地购物车，cart.js 供前端和预留服务端共同校验。Supabase shop-checkout 仅有测试接口源码，未部署或开放付款，详见 docs/shop-checkout.md。

首页 user-comments 分区按相同类型目录组织，素材 assets/images/home/user-comments/；来源地址在 content/home/user-comments-source.js，评论由 Google Sheet CSV 覆盖结构模块初始快照，无本地 JSON。CSV 解析共用 scripts/shared/csv.js，Contact FAQ 保持原导出接口。

## 活动与文章
`event/the-state-of-the-period/` 为已接入的独立活动页，入口 index.html，专属 scripts/、styles/、images/ 和 form.json 全部封装于该目录。复用全站 Menu bar / Footer，pageType 明确为 event；导航数据按项目根目录转换链接，Footer homeHref 支持嵌套页面返回首页。详情见活动目录 README。

复制 `templates/event/` 到 `event/<slug>/`，或 `templates/article/` 到 `article/<slug>/`。模板内 `page.html` 是非完整结构片段，待选定框架后转换为对应页面模块；不得直接当作完成的网页发布。所有页面专属文件留在这个目录，包括只为该页使用的组件、字体或下载文件。创建专属组件时也配 README。

## 共享边界
Pre-footer 采用桌面双列与 ≤991px 单列三卡，桌面 / 手机均按可见性播放。手机花园使用独立两行构图，components/pre-footer/media-sources.js 集中管理桌面 garden 与手机 mobileGarden；图片与花园视频分别在接近自身视口时加载。

Pre-footer 为 components/pre-footer/ 中的共享组件，结构、样式、播放控制、source/ 中的新版原始 JSON、media/ 中桌面与手机各三份花园播放资源及 media/cards/ 中的 Loved 视频、images/cards/ 与 images/garden/ 分类静态插画及 Lottie Canvas vendor 均封装在组件内。普通页面默认由共享 mountFooter 自动挂载，Home / Contact / Download / Shop 已接入；文章和活动页面（包括 event.html 及 event/、article/ 路径）排除。page-policy.js 为统一判定入口；自定义文章 / 活动 URL 须传 `pageType: 'article'` / `'event'`，新普通页面不得再独立追加一份 Pre-footer。pre-footer-preview.html 和 component-preview.html 作为技术预览通过 preFooter:false 关闭自动挂载，前者保留手动实例用于对照。素材转换器位于 scripts/tools/prepare-pre-footer.py，原文件不修改。

滚动整页换色由 scripts/shared/scroll-background.js 与 styles/scroll-background.css 复用；Contact / Download 共用 content/shared/pre-footer-background.json，以 Pre-footer 接近视口底部（提前 80px）触发，隐藏分区不触发；其他场景可在页面数据目录配置。分区背景透明，不以渐变模拟换色。详见 scripts/shared/README.md。

真正跨页面复用的代码提取到 components/ 或 scripts/shared/；公共基础样式放 styles/foundations/。event/article 可以引用共享代码，但它们的专属文件不混入品牌页面的类型目录。素材避免为每个页面重复复制。页面目录本身不定义发布路由，后续由框架配置路由与资源路径。

## 命名与入口
文件和目录统一 kebab-case，如 `customer-stories`。分区样式使用页面前缀，如 `.home-hero`；共享组件使用 `.site-footer`。全站引入 `styles/shared.css`，首页再引入 `styles/home/index.css`；活动/文章在共享入口之后加载自己的 `styles/page.css`。框架引入后由构建工具处理资源路径，避免使用依赖部署根目录的硬编码路径。

颜色统一在 styles/foundations/tokens.css 定义；组件、页面和预览直接使用色板新名称（如 --color-picnic-date、--color-linen-sheet），不再保留旧颜色别名。阴影值也集中在该文件；Footer 的 --footer-bg / --footer-fg 仅用于组件背景变体。SVG 原始素材保留原文件色值，不按最近颜色重染。

Download 入口 download.html，结构 pages/download/sections/hero/，样式 styles/download/index.css，脚本 scripts/download/index.js，素材 assets/images/download/。首页 pattern 与 App Store 直接复用。FAQ 已提至 components/faq/ 与 scripts/shared/faq.js，Contact 原入口保留兼容转发，Home / Contact / Download 三页共用 content/contact/faq.json；首页在评论区之后、Pre-footer 之前挂载 FAQ。

Event 活动索引入口 event.html，结构 pages/event/event.js、样式 styles/event/index.css、脚本 scripts/event/index.js；具体活动继续使用 event/<slug>/，不与索引混放。

文字工具类集中于 styles/foundations/typography.css，字号由 tokens.css 管理；.text-body 桌面为 1rem、手机（≤767px）为 0.8rem；.text-larger 桌面为 1.1rem、手机为 0.9rem（FAQ 答案使用），.text-small 为 0.875rem。页面复用工具类，不重复定义通用字号。
