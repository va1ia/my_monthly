# FAQ
## 目录
- 文件与复用
- 来源与交互
## 文件与复用
faq.js / faq.css 为 Home、Contact 与 Download 共用结构和样式；scripts/shared/faq.js 管理 CSV 同步。保留 contact-faq 类名，旧 Contact 结构、脚本和样式入口均转发到这里，兼容现有调用。便签图共用 assets/images/contact/faq/text-frame.svg。

分隔线两端按 --faq-item-radius（12px）内缩，与展开色块的圆角切点对齐；线段和色块共用同一半径，桌面 / 手机及展开 / 收起状态一致。保留原分隔线占位厚度，末项不显示分隔线。

回答正文在卡片原有内边距之内再增加对称的左右留白：clamp(12px, 2vw, 28px)，让正文比问题标题进一步内缩；手机到桌面保持左右一致，标题与图标位置不变。
## 来源与交互
三页共用 content/contact/faq.json 与 faq-colors.json，连接 Q&A: Preview；保留原生 details、键盘焦点、展开擦入及减少动画支持。mountFAQ 返回 refresh()/destroy()；标题说明与链接统一维护在 faq.js。

背景色块通过 clip-path 双向过渡：展开 440ms 自上而下擦入，收起 360ms 向上退回；快速反复切换会从当前位置反向过渡，不重启关键帧。减少动态效果偏好下即时切换。

仅收起时叠加 300ms opacity 淡出；展开时 opacity 立即为 1，只执行原有擦入，不做淡入。

整页换色与条目色块动画独立：Contact / Download 共用 content/shared/pre-footer-background.json：Pre-footer 顶部距离视口底部 80px 时开始由 picnic-date 过渡到 darker-linen，向下 2000ms、上滚恢复 700ms。FAQ 本身不再触发换色。手机上 Pre-footer 隐藏，不触发此过渡；Footer 保留独立绿色。

首页使用 renderFAQ({ variant: 'linen' })：contact-faq--linen 固定使用 --color-darker-linen，桌面与手机均不从绿色渐变；默认 variant 仍透明，供 Contact / Download 整页换色使用。条目自身展开 / 收起动画不受影响。
