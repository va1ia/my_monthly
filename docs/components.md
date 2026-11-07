# 共享组件索引

## 目录
- 组件清单
- 新增与变更

## 组件清单
| 组件 | 说明 | 变体 | 状态 |
| --- | --- | --- | --- |
| Menu bar | [组件说明](../components/menu-bar/README.md) | 桌面 / 手机；当前页标记 | 已实现 |
| Pre-footer | [组件说明](../components/pre-footer/README.md) | 桌面双列 / 手机单列；视频 / 原始 JSON；同步叠加循环 | 普通页面由 Footer 默认挂载；文章 / 活动排除；手机暂用电脑版花园 |
| Footer | [组件说明](../components/footer/README.md) | brand / dark / light | 已实现；Supabase 名单收集已连接 |
| Home hero（页面专属） | [分区说明](../pages/home/sections/hero/README.md) | 桌面 / 平板 / 手机；减少动画 | 已实现背景视差、碰杯、tag 和 marquee；下载徽章使用原站左上位移及实色阴影 |
| Contact cards（页面专属） | [分区说明](../pages/contact/sections/cards/README.md) | 桌面 / 平板 / 手机 | 卡片、背景视差已实现；手机按截图排列，悬停变灰 |
| 共享 FAQ（Home / Contact / Download） | [分区说明](../pages/contact/sections/faq/README.md) | SVG 底图 + HTML 文案 / FAQ 链接预留；向下擦入与整页换色 | 已实现；Google Sheet Q&A: Preview 已连接 |
| Contact form（页面专属） | [分区说明](../pages/contact/sections/form/README.md) | 等待 / 成功 / 失败 | Supabase 已连接；表单按截图修正，Zapier 分流已连接 |
| Home user comments（页面专属） | [分区说明](../pages/home/sections/user-comments/README.md) | 桌面 / 手机；整组等高、弧线循环、非手机鼠标视差、减少动画 | 已实现；Home: user comments 已连接，每 60 秒同步 |
| Button | [组件说明](../components/button/README.md) | 待设计确认 | 目录预留 |

## 新增与变更
Pre-footer 手机布局：≤991px 三卡纵向排列，保留桌面文案和整卡链接，沿用 PC 最终版箭头入口和 Calm / Calendar 的视觉规则，云层使用 PC 完整原图并等比缩放。Loved 与花园沿用按可见性播放和暂停；手机版花园暂用桌面视频，替换入口为 components/pre-footer/media-sources.js 的 mobileGarden。

Pre-footer 默认规则：共享 Footer 自动在普通页面挂载一份，Home / Home / Contact / Download / Shop 已统一；文章 / 活动路径及 pageType:article / event 排除，技术预览通过 preFooter:false 关闭。首页不再单独重复渲染，销毁 Footer 时一并清理播放器。详见 Footer 说明和 docs/architecture.md。

共享 FAQ：仅收起背景色块时叠加 300ms 透明度淡出；展开不淡入，保留原有擦入。

共享 FAQ：色块收起时增加 360ms 反向擦出，展开保留 440ms 擦入；支持中途反向切换和减少动态效果。

共享 FAQ：回答正文增加对称左右内边距（12–28px 随屏宽调整），比问题标题进一步内缩，Home / Contact / Download 共用。

共享 FAQ：横线两端按色块圆角半径内缩至切点，Home / Contact / Download 和各屏宽同步，保留折叠交互及原行距。

Contact Form：背景 pattern 底部 30% 渐变淡出至透明，桌面 / 手机共用图片蒙版，保留面板及输入内容不透明。

Pre-footer：原始图片序列型 Lottie 保留，默认使用约 16.0 MB、3440×1080 的透明 WebM，约 6.1 MB 的 MP4 作为兼容后备；草坪为独立 SVG，与 Footer 共用 #3D8054；接近视口时加载、离开视口暂停，支持减少动态效果。已替换 2026-11-06 V2 主动画（480 帧 / 20 秒），叶子仍每 10 秒重复；测试页仅对照视频和原始 JSON。images/cards/ 与 images/garden/ 归类静态插画，source/ 保留唯一一套源文件，media/ 仅保留 garden.webm、garden.mp4、garden-poster.webp，删除旧版、顺序版、重复 .lottie 和闲置 Loved poster。云朵复用首页鼠标视差；三卡使用原站方向与颜色的实色悬停阴影，并支持键盘焦点。三卡现在整卡链接，内部 App Store 图案 / 箭头不单独交互；箭头圆形底色随卡片悬停滑入。新版 Loved / Calm / Bushes 直接引用上传素材，角色跟随 Ambassador，Calendar 按卡片圆角裁切。灌木及动画叶子可溢出到 Footer 上方，装饰 pointer-events:none。草坪路径已延伸画布两侧，移除接缝补色伪元素并将草坪底部背景设为同绿，消除边缘缺口 / 横线。云较上一版上移 1vw，Events 描边独立覆盖日历且保留在 Calm 图标下方。

Contact 表单移除字段聚焦时的外侧粗描边，保留原细边框、提交按钮键盘焦点与必填校验。

Footer 版权行缩短上方间距并增大字号，保持正常文档流；不增加垂直位移。

Footer 底部留白：桌面 80px、手机 64px，叠加底部安全区域。Contact 表单面板最大宽度 1000px，桌面内边距同步限制上限。

Home hero：Logo 按文件名数字前缀排序，目录扫描生成清单，新增、删除及替换后自动同步；轨道根据数量补足宽度并保持恒速；按参考 PNG 使用各 SVG 的视觉比例，取消等宽格子和圆形标志多余留白。见 [素材说明](../assets/images/home/logo-marquee/README.md)。
Menu bar 胶囊背景已按原站截图加入约 94.9% 不透明度和 3px 背景模糊；独立背景层保留手机全屏面板定位，不支持模糊的浏览器回退为实色。
Menu bar：桌面 Download 按钮支持左侧圆形色块扩散（9 倍覆盖），无下划线，使用 13px / 600 字体；普通导航当前页保留下划线，手机菜单支持上下滑动过渡及减少动画偏好。Footer：页面导航与法律链接使用 400 字重及悬停放大反馈；订阅输入框取消聚焦外框，键盘焦点使用底线提示；社交图标整组左移 2px，悬停放大至 1.1 倍。
先检索已有组件。新增时记录用途、接口、变体、使用方式、响应式行为和可访问性要求，更新此表。

Supabase 订阅接口已部署并通过本地预览真实提交验证，GitHub Pages 公开网页也已验证通过；接入步骤见 [部署说明](newsletter.md)。

交互分别维护：Menu bar 普通导航使用下划线展开，不缩放；Download 无下划线，保留圆形扩散。Footer 文字链接和社交图标以正中心为原点悬停放大至 1.1 倍（180ms），不显示下划线。

共享滚动背景：见 [配置与接入](../scripts/shared/README.md)，页面分区以 JSON 指定整页底色状态，Contact Q&A 已接入。

Shop 页面专属展示墙：[结构与网格说明](../pages/shop/sections/merch/README.md)。桌面 / 手机独立布局，共用网格定位圆点、架子与衣架；商品按编号 SVG 自动同步。

Shop 商品弹窗与本地购物车：[组件说明](../pages/shop/sections/product-dialog/README.md)。SVG 颜色变体、Sold out 标签、收藏、数量和本机持久化；Stripe 测试接口预留，真实付款未开启。

首页评论位置：桌面评论 group 相对手机 SVG 定位并整体上移，手机和锚点在超宽屏同步限制尺寸；手机端位置保持。详见评论区说明。

首页评论卡片：内部标题、评分 / 日期和正文整体纵向居中，保持左对齐及整组等高。

首页评论短内容变体：card--short 在标题、评分行与正文之间额外增加 .3em 间距，仍整体纵向居中。

Contact 表单 Get In Touch 按钮：与导航 Download 一致的左侧圆形扩散交互，支持键盘焦点、禁用状态与减少动画偏好。

共享 FAQ：[组件说明](../components/faq/README.md)，Home / Contact / Download 共用结构、样式与 Google Sheet 数据；原 Contact 入口兼容保留。Download 首屏：[分区说明](../pages/download/sections/hero/README.md)，双端素材、绿色背景与鼠标视差。

Menu bar：支持 hiddenInMenu 配置，About 与 Shop 暂时在所有设备顶部菜单隐藏；Footer 保留。

FAQ 前后的整页换色：Contact / Download 共用 content/shared/pre-footer-background.json：Pre-footer 顶部距离视口底部 80px 时开始由 picnic-date 过渡到 darker-linen，向下 2000ms、上滚恢复 700ms。桌面仍由 Pre-footer 触发；手机版（≤767px）由 FAQ 顶部进入同一触发线时开始换色，弥补 Pre-footer 隐藏时没有触发点的问题。Footer 保留独立绿色。

FAQ / Pre-footer 衔接：天空渐变以透明起步，启用整页换色时直接透出 body 的动画底色，避免 2s 过渡中固定浅色顶部产生分界线；独立组件仍保留浅色底。

首页 FAQ 使用 linen variant，固定 Darker Linen，不接入整页换色；与 Pre-footer 默认浅色顶部连续。Contact / Download 保留滚动换色。

Pre-footer Loved：使用镜像、裁剪对齐后的透明循环视频，角色及静态后备以 scale 1.045 显示并左移自身宽度的 4%，四个原有小装饰以不同节奏轻微上下漂浮；各自可见时播放、离屏暂停，支持减少动态效果和共享暂停控制。原始 MOV 归 source/，播放媒体归 media/cards/。

共享 FAQ 答案使用 .text-larger（--text-larger: 1.1rem），比常规正文 1rem 稍大；该工具类集中于 foundations/typography.css，可供其他分区复用。

首页手机版构图（2026-11-06）：Hero 背景按原比例定位，取消手臂底部横向遮挡，让素材尾端延伸到屏幕两侧；下载徽章宽度 35.5vw。评论卡片中心下移至 71%，宽度 52vw、间距 11vw，弧线同步读取 CSS 间距。详见 Hero / User comments 分区说明。

首页手机版碰杯：隐藏三条 tag；两个手机额外向内旋转，从初始 ±2° 随滚动至 ±5°，终点向外各偏移 2.95vw，使上角刚好接触，避免重叠。减少动画直接显示碰杯姿态，非手机版保留原标签与动画。

共享 FAQ 手机版布局：顶部便签缩窄并居中（列表容器 64%，最大 360px），标题、说明和问题字号按截图比例调整；问题列表保持较宽布局，优化便签下方留白、条目间距和正文内缩。仅 ≤767px 生效，Home / Contact / Download 共用，背景色保留。详见 [FAQ 说明](../components/faq/README.md)。

共享 FAQ 手机版上下留白改为 clamp(32px, 12vw, 60px)，左右为 0；全站 .text-larger 手机字号为 1rem，桌面为 1.1rem，由 tokens.css 统一维护。

Contact 手机卡片与表单（2026-11-06）：下移粉色 / 蓝色玩偶，文字按主体中心定位；表单使用单列、姓名同排 60/40、增加介绍下方留白、较高留言区和居中按钮。FAQ 补上手机换色触发点；Download 手机 FAQ 同步使用 clamp(32px, 12vw, 60px) 的上下留白。详见 Contact cards / form / FAQ 说明。

Contact 表单字号与描边：介绍段落改用 .text-larger，字段和按钮统一普通正文 --text-body；现有字段、按钮边框及下拉箭头加粗为 2px。

Contact 手机表单背景：图片高度贴合分区，蒙版仅覆盖最底部 clamp(40px, 12vw, 64px)，在实际底边完全透明，缩短渐变并消除提前裁切的硬边；桌面仍保留原 30% 淡出。

Contact 的 Get In Touch 按钮文字使用 .2px 同色描边，轻微增加字重。

Pre-footer 手机下方两卡以 PC 最终版为准：移除旧稿按钮和日历附加云，恢复箭头与圆形色块交互、角色比例及卡片内的日历圆角裁切；手机独立云层改为两朵，PC 保持原云组。

Pre-footer 移动端统一 PC 原图：取消手机云朵的截取与复制，整组云沿用 PC；Calm 继承 PC 定位，仅等比缩小 .9；Calendar 依 PC 卡片比例缩至 22.13%，保留原始宽高比与圆角裁切。

Pre-footer 手机人物与日历已恢复用户手动值：Calm width 62% / right -16%，无额外 scale；Calendar width 28%。

Pre-footer 手机三卡的两处纵向 gap 均在原基础上减少 4px，桌面间距不变。
