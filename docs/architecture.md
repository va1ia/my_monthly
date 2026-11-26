# 目录与模块规范

## 目录
- 品牌页面
- 活动与文章
- 共享边界
- 数据与交互入口
- 命名与入口
- 样式维护

## 品牌页面
Ambassador Program 入口为 `ambassador.html`，结构 `pages/ambassador/page.js`、样式 `styles/ambassador/index.css`、入口 `scripts/ambassador/index.js`、数据 `content/ambassador/page.json`，素材按 `assets/images/ambassador/{hero,program,perks}/` 分区。复用 Menu bar / Footer；本页按 Figma 使用专属 Perks 人物结尾，显式关闭通用 Pre-footer，避免重复花园。两个申请入口挂载到 main 与 Footer 之间的 ambassador-actions 占位区域，在 Footer 顶部停靠；人物绿色角色使用单个整组 SVG。全站 Pre-footer 的 Ambassador 卡片进入本页；申请表地址保留在本页配置。

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

Contact 入口为 contact.html；类型目录直接使用 contact/，分区为 cards、form、faq，样式入口 styles/contact/index.css，数据和公开服务配置在 content/contact/。Q&A 的内容来源位于 content/shared/faq.json，问答条目透明，不再加载颜色配置。Supabase 函数及迁移放 supabase/；详见 [Contact 接入](contact.md)。

Shop 入口 shop.html，分区 merch、product-dialog。结构 pages/shop/sections/merch/，样式 styles/shop/index.css，入口 scripts/shop/index.js，布局与清单 content/shop/，素材 assets/images/shop/。products/ 为可替换编号 SVG，scripts/tools/sync-shop-products.py 生成清单；本地预览按请求同步，GitHub 工作流按素材变化同步。商品文本和价格由 content/shop/catalog.json 管理；scripts/shop/shopping.js 挂载弹窗/收藏/本地购物车，cart.js 供前端和预留服务端共同校验。Supabase shop-checkout 仅有测试接口源码，未部署或开放付款，详见 docs/shop-checkout.md。

首页 user-comments 分区按相同类型目录组织，素材 assets/images/home/user-comments/；来源地址在 content/home/user-comments-source.js，评论由 Google Sheet CSV 覆盖结构模块初始快照，无本地 JSON。CSV 解析共用 scripts/shared/csv.js；Contact 直接引用共享 FAQ 和鼠标视差工具。

## 活动与文章
`event/the-state-of-the-period/` 为已接入的独立活动页，入口 index.html，专属 scripts/、styles/、images/ 和 form.json 全部封装于该目录。复用全站 Menu bar / Footer，pageType 明确为 event；导航数据按项目根目录转换链接，Footer homeHref 支持嵌套页面返回首页。详情见活动目录 README。

复制 `templates/event/` 到 `event/<slug>/`，或 `templates/article/` 到 `article/<slug>/`。模板内 `page.html` 是非完整结构片段，待选定框架后转换为对应页面模块；不得直接当作完成的网页发布。所有页面专属文件留在这个目录，包括只为该页使用的组件、字体或下载文件。创建专属组件时也配 README。

## 共享边界
Pre-footer 采用桌面双列与 ≤991px 单列三卡，桌面 / 手机均按可见性播放。手机花园使用独立两行构图，components/pre-footer/media-sources.js 集中管理桌面 garden 与手机 mobileGarden；图片与花园视频分别在接近自身视口时加载。

Pre-footer 为 components/pre-footer/ 中的共享组件，结构、样式、播放控制、source/ 中的新版原始 JSON、media/ 中桌面与手机各三份花园播放资源及 media/cards/ 中的 Loved 视频、images/cards/ 与 images/garden/ 分类静态插画及 Lottie Canvas vendor 均封装在组件内。普通页面默认由共享 mountFooter 自动挂载，Home / Contact / Download / Shop 已接入；文章和活动页面（包括 event.html 及 event/、article/ 路径）排除。page-policy.js 为统一判定入口；自定义文章 / 活动 URL 须传 `pageType: 'article'` / `'event'`，新普通页面不得再独立追加一份 Pre-footer。pre-footer-preview.html 和 component-preview.html 作为技术预览通过 preFooter:false 关闭自动挂载，前者保留手动实例用于对照。素材转换器位于 scripts/tools/prepare-pre-footer.py，原文件不修改。

滚动整页换色由 scripts/shared/scroll-background.js 与 styles/scroll-background.css 复用；Contact / Download 共用 content/shared/pre-footer-background.json，桌面以 FAQ 顶部为稳定判断点，越过视口中线触发，手机延后到第二题进入视窗底边时触发；展开答案不影响判断，隐藏分区不触发；Footer 进入视窗后整页恢复绿色，上滚离开后回到 FAQ 浅色；其他场景可在页面数据目录配置。分区背景透明，不以渐变模拟换色。详见 scripts/shared/README.md。

真正跨页面复用的代码提取到 components/ 或 scripts/shared/；公共基础样式放 styles/foundations/。event/article 可以引用共享代码，但它们的专属文件不混入品牌页面的类型目录。素材避免为每个页面重复复制。页面目录本身不定义发布路由，后续由框架配置路由与资源路径。

## 数据与交互入口
页面入口保留各自内容加载与挂载顺序，JSON 统一经 `scripts/shared/data.js` 读取；路径以站点目录为基准，兼容子目录部署。没有独立行为的转发文件直接删除，引用指向实际实现。组件专属交互留在组件或所属页面，不为统一入口再套一层页面框架。

Home / Contact / Download 的 FAQ 来源统一在 `content/shared/faq.json`；完整 FAQ 的 All 来源继续由 `content/faq/source.json` 管理。Newsletter 的服务适配和表单状态共同维护于 `scripts/shared/newsletter.js`，Press 与 Footer 保留各自成功文案。共享 Footer 还统一管理 `scripts/shared/mobile-page-canvas.js`：≤767px 的 html 画布匹配首屏 / 页脚 / 菜单，保留各分区和 body 的原底色；桌面不启用。首页通过 body.home-page 预设手机首屏深色。

只在有实际实现时创建组件目录，尚未实现的 Button 不保留空目录；未来需要时按组件规范新增。保留页面样式 index.css 入口，即使它只负责引入共享样式，方便独立调整和直接定位。

## 命名与入口
文件和目录统一 kebab-case，如 `customer-stories`。分区样式使用页面前缀，如 `.home-hero`；共享组件使用 `.site-footer`。全站引入 `styles/shared.css`，首页再引入 `styles/home/index.css`；活动/文章在共享入口之后加载自己的 `styles/page.css`。框架引入后由构建工具处理资源路径，避免使用依赖部署根目录的硬编码路径。

颜色统一在 styles/foundations/tokens.css 定义；组件、页面和预览直接使用色板新名称（如 --color-picnic-date、--color-linen-sheet），不再保留旧颜色别名。阴影值也集中在该文件；Footer 的 --footer-bg / --footer-fg 仅用于组件背景变体。SVG 原始素材保留原文件色值，不按最近颜色重染。

Download 入口 download.html，结构 pages/download/sections/hero/，样式 styles/download/index.css，脚本 scripts/download/index.js，素材 assets/images/download/。首页 pattern 与 App Store 直接复用。FAQ 位于 components/faq/ 与 scripts/shared/faq.js，各页面直接引用，Home / Contact / Download 三页共用 content/shared/faq.json；首页在评论区之后、Pre-footer 之前挂载 FAQ。

Event 活动索引入口 event.html，结构 pages/event/event.js、样式 styles/event/index.css、脚本 scripts/event/index.js；具体活动继续使用 event/<slug>/，不与索引混放。

## 样式维护
通用文字样式位于 `styles/foundations/typography.css`，变量位于 `tokens.css`：正文 1rem / 手机 0.8rem、较大正文 1.1rem / 手机 0.9rem、小字 0.875rem、辅助字 0.75rem，以及现有通用标题。可通过工具类或 CSS 变量复用；工具类只控制字号，不捆绑颜色、字重、间距与布局。

新增文字先复用这套尺寸。同用途且足够接近的尺寸优先归并，避免为每一个文案位置新增命名。确有构图需要的标题、插画内文字和特定阅读字号直接写在所属 CSS，响应式值紧邻该组件的媒体查询，不再在全站表里定义一个名称又只引用一次。完全相同的规则用局部分组选择器合并；同一个数值碰巧出现在不同构图中，不强行绑定。

字体文件继续只在 `fonts.css` 注册；通用字体栈全站共享，特殊字体的选择变量限定在对应页面。颜色与阴影暂保留原表，本次不改素材或重新匹配色板。

目录继续按文件类型和页面 / 分区组织，不为了整理增加框架、依赖或中间目录。`docs/components.md` 是当前组件入口，组件细节以各自 README 为准；旧的逐次修改记录移入 `docs/history/`，不再混入当前规范。
