# Press 订阅与归档

## 目录
- 来源与结构
- 交互
- 响应式与可访问性
- 修改位置

## 来源与结构
入口为 `press.html`，设计对应 Figma `463:43733`（桌面）和 `463:41630`（手机）。页面保留订阅区、六张 newsletter 封面及分层文件夹。底部由共享 `mountFooter()` 自动挂载 Pre-footer 和 Footer，随其他普通页面同步，不复制组件。

## 交互
背景调用 `scripts/shared/pointer-parallax.js`，与 Home / Download 共用视口映射及平滑行为。卡片延续原站 200ms `cubic-bezier(.215,.61,.355,1)` 动效，悬停或键盘聚焦时统一上移 20px、相对初始角度逆时针旋转 3°；使用一条共享公式，避免单张卡片幅度不同。初始角度按 Figma。

卡片按 `publishedAt` 升序排序，再依次占据 slot-1 至 slot-6；布局与内容标识分开，方便换刊而不改定位。顺序为 2025-11、2026-01、2026-05、2026-06、2026-07、2026-10。旧刊在上方、同层旧刊在左，最新十月刊位于最下方偏右。六张卡片直接链接到已核对的 LinkedIn 文章，在新标签打开。三周年与 Version 2.5 封面替换原来的两周年、Hot Boyfriend Summer；来源为新提供的 Figma Team Workspace。

首屏复用 `createNewsletterSubscriber()` 与 `content/shared/newsletter.json` 的 Supabase 服务。提交状态与 Footer 共用 `mountNewsletterForm()`，保留 Press 自己的成功文案。邮箱使用浏览器原生校验；提交中禁用按钮并防止重复提交；仅服务成功时显示成功消息，失败允许重试。Footer 表单独立工作，状态不混用。

## 响应式与可访问性
桌面使用 1728px 设计画布比例，≤767px 使用 402px 手机排布及独立标题、背景素材。文件夹图层不接收指针事件，卡片为原生链接；键盘聚焦时卡片抬至前方，焦点可见。标题有替代文本，纯装饰隐藏于辅助技术；提交状态通过 `aria-live` 反馈。减少动态效果时停用背景视差及卡片位移旋转动画。

Summer Calling（slot-4）下移至下一层文件夹能覆盖其底边的位置；十月刊（slot-6）左移至桌面 48% / 手机 50%，靠近中间。Press 页局部覆盖 Pre-footer 背景底色为最前层文件夹 SVG 的原色 `#eeeee1`，沿用共享天空渐变，桌面与手机连续衔接；其他页面使用各自原有背景。

## 修改位置
弧形订阅标题宽度为订阅区的 90%，使用 margin-inline auto 居中；介绍小字上下各增加 --space-1（8px）内边距，桌面 / 手机共用。

介绍文字的实际上下留白由 --intro-space-extra 控制：桌面 clamp(20px, 2vw, 40px)，手机 clamp(16px, 4vw, 24px)。文字下移一份间距，文件夹与六张卡片整组下移两份，首屏同步增高两份。保留中屏 / 窄屏原有偏移及所有卡片之间的相对位置、遮挡关系，避免只加文字 padding 而下方固定定位内容不动。

介绍文字按原版强调 one 与 LinkedIn，使用已注册的 Graphik SemiBold Italic（600 / italic）；LinkedIn 常驻下划线，悬停时透明度降至 .65（180ms），继承介绍文字的灰绿色，在新标签打开公司主页。减少动画时取消透明度过渡。

后续微调：The Wait Is Almost Over（slot-1）再上移桌面 .5vw / 手机 1vw，Summer Calling（slot-4）再下移相同幅度。介绍文字恢复原站 `#999f88`，通过 `--color-press-intro` 集中定义，LinkedIn 文字链接继承同色。

- 结构：本目录 `archive.js`。
- 卡片标题、顺序、链接：`content/press/archive.json`。
- 布局与动效：`styles/press/index.css`。
- 挂载与订阅：`scripts/press/index.js`。
- 素材：`assets/images/press/archive/`。
- 页面字号：`styles/press/index.css` 中的订阅输入、提交按钮与介绍段落规则；仅为本页设计映射，不作为最终全站品牌规范。
