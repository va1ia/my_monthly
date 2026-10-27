# FAQ
## 目录
- 文件与复用
- 来源与交互
## 文件与复用
faq.js / faq.css 为 Contact 与 Download 共用结构和样式；scripts/shared/faq.js 管理 CSV 同步。保留 contact-faq 类名，旧 Contact 结构、脚本和样式入口均转发到这里，兼容现有调用。便签图共用 assets/images/contact/faq/text-frame.svg。
## 来源与交互
两页共用 content/contact/faq.json 与 faq-colors.json，连接 Q&A: Preview；保留原生 details、键盘焦点、展开擦入及减少动画支持。mountFAQ 返回 refresh()/destroy()；标题说明与链接统一维护在 faq.js。
