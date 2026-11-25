# FAQ
## 目录
- 文件与复用
- 来源与交互
- 手机版布局与验证
## 文件与复用
faq.js / faq.css 为 Home、Contact 与 Download 共用结构和样式；scripts/shared/faq.js 管理 CSV 同步。保留 contact-faq 类名，旧 Contact 结构、脚本和样式入口均转发到这里，兼容现有调用。便签图共用 assets/images/contact/faq/text-frame.svg。

`renderFAQ({variant:'full'})` 供独立 faq.html 使用：左侧 h1 FAQ，无便签与装饰文案，右侧复用同一问题列表。页面专属布局位于 styles/faq/index.css，页面背景为 article-cream，完整页所有问题均不显示展开背景色，答案直接透出页面底色。完整页独立读取 Q&A: All，通过 stopBefore:COMING SOON 排除该分区及以下全部问答，不影响 Home / Contact / Download 的 Q&A: Preview。

共享读取器支持可选 `[data-faq-status]` 和 `[data-faq-retry]`：提供加载、空表、失败保留与手动重试提示；旧版便签无需添加这些节点。相同问题刷新时继续保留展开及键盘焦点。

分隔线两端按 --faq-divider-inset（12px）内缩，桌面 / 手机及展开 / 收起状态一致。保留原分隔线占位厚度，末项不显示分隔线。

回答正文在卡片原有内边距之内再增加对称的左右留白：clamp(12px, 2vw, 28px)，让正文比问题标题进一步内缩；手机到桌面保持左右一致，标题与图标位置不变。
## 来源与交互
三页共用 content/contact/faq.json，连接 Q&A: Preview；保留原生 details、键盘焦点、折叠高度及图标过渡和减少动画支持。mountFAQ 返回 refresh()/destroy()；标题说明与链接统一维护在 faq.js。

所有简略与完整 FAQ 均不再生成展开色块。已删除背景伪元素、clip-path 擦入 / 擦出、透明度淡出、答案入场关键帧、--faq-color 内联变量、颜色校验和独立颜色配置文件；renderFAQItems(items) / mountFAQ(section, config) 不再接收调色板。

页面底色仍由原整页换色独立管理：Contact / Download 共用 content/shared/pre-footer-background.json：Pre-footer 顶部距离视口底部 80px 时开始由 picnic-date 过渡到 darker-linen，向下 2000ms、上滚恢复 700ms。桌面仍由 Pre-footer 触发；手机版（≤767px）由 FAQ 顶部进入同一触发线时开始换色，弥补 Pre-footer 隐藏时没有触发点的问题。Footer 保留独立绿色。

首页使用 renderFAQ({ variant: 'linen' })：contact-faq--linen 固定使用 --color-darker-linen，桌面与手机均不从绿色渐变；默认 variant 仍透明，供 Contact / Download 整页换色使用。条目保持透明。

FAQ 答案复用全站 .text-larger 文字工具类：字号由 tokens.css 的 --text-larger 管理，桌面 1.1rem、手机（≤767px）1rem；保持组件原有 1.5 行高和内边距，问题标题与便签正文不受影响。Home / Contact / Download 同步使用。

## 手机版布局与验证
2026-11-06 按用户截图调整 ≤767px：顶部便签居中，宽度为列表容器的 64%（最大 360px），保留两行标题、较小的说明文字、胶带与折角。便签内边距和段间距随屏宽调整，下方间距 9vw；问题列表保持容器全宽，条目内边距 4vw / 3.5vw，标题与图标间距 4vw；答案两侧额外内缩 5vw。字号集中在 tokens.css 的 --text-faq-note-title-mobile / --text-faq-note-body-mobile / --text-faq-question-mobile，数值依据截图暂定，不作为最终品牌规范。背景色及桌面样式保留。

Home / Contact / Download 同步使用。Tabbit Chromium 实际检查 Home 320、390、767、768、1440px，以及 Contact / Download 390px，无横向溢出、便签内容或答案横向裁切；Enter 可展开、收起第三条问题，键盘焦点描边可见，页面 JavaScript 错误为 0。查看 390px 展开截图。390px 便签约 230×166px，标题和问题 23.4px、说明 12px；答案继续沿用 .text-larger。验证使用减少动画模式，原有擦入动效未修改，未验证实体 iOS Safari。

手机版留白跟进：FAQ 分区 padding 使用 clamp(32px, 12vw, 60px) 0；全站 .text-larger 通过手机端 token 调小为 1rem，桌面维持 1.1rem。

手机版换色复核：Contact 在 320、390、767px、Download 在 390px 进入 FAQ 后，body 从 picnic-date 切为 darker-linen；上滚回顶部恢复绿色。检查正常动效为下滚 2000ms / 上滚 700ms，减少动画即时切换；另检查 768 / 1440px 的既有 Pre-footer 触发规则。页面 JavaScript 错误为 0。
