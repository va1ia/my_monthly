# The State of the Period

## 目录
- 入口与文件
- 排版来源
- 素材来源
- 表单与订阅
- 修改位置
- 验证

## 入口与文件
入口 `event/the-state-of-the-period/index.html`，本地地址 `/event/the-state-of-the-period/`。活动专属结构、样式、脚本、配置和图片全部留在本目录；全站导航、Footer、订阅适配器、字体与设计变量复用现有文件。不挂载 Pre-footer。

## 排版来源
严格参照 https://mymonthly.io/event/the-state-of-the-period 的当前公开网页，不使用 Figma 的整页布局。桌面左照片、右标题 / 表单；≤479px 与原站相同改为上方标题 / 表单、下方方形裁切照片，照片顶部对齐。品牌组合与双段说明跟随照片之后，接深红 Footer。桌面表单宽度为右栏 72%，说明宽度为整页 72%；手机版标题 80%、品牌组合 72%、说明 86%。布局值为原网页测量值，不扩展为全站品牌规范。

## 素材来源
Figma 文件 `xKlCUK40XPwLkxbY9JOWIZ`，页面 `5:6`，活动分区 `39:140961`。

- images/title.svg：用户最新选中版本 `683:28951`（603.29 × 167.14，THE $TATE OF / THE PERIOD:），由 Figma 直接导出为纯路径 SVG，尺寸 604 × 168。完整保留原导出的 viewBox，不重排字、不裁切。替换同名 title.svg，桌面 / 手机共用同一素材；页面标题容器保留原站占位，避免替换素材影响表单纵向位置。
- images/brand-lockup.svg：Figma `241:33250`，完整三品牌组合及说明。
- images/my-monthly.svg、monthly.svg、sunny.svg：分别导出自 Figma `241:33216`、`241:33231`、`241:33241` 的独立标识，供后续复用；页面直接引用完整组合。
- images/hero.jpg：与 Figma `17:449559`（image 573）及原网页相同的人物照片。Figma 临时下载接口本次返回空文件，故保存原站公开 CDN 的同图文件；不依赖临时 Figma URL。公开来源为 `https://cdn.prod.website-files.com/68efe11db54fa842b5a0b701/6ab2b220d887eb261cb45830_image%20573.jpg`。
- Bona Nova：原站使用的开源字体，集中注册于 styles/foundations/fonts.css，文件与 OFL 授权位于 assets/fonts/bona-nova/。不在标题 SVG 中嵌入字体。

## 表单与订阅
报名表单保留 Name、身份（Investor / Founder / Influencer / Other）、Email、Social Handle 四项及原文同意说明，加入必填验证、辅助标签、键盘焦点和提交状态。`form.json` 的 enabled 控制报名接口是否启用，endpoint 为接收 JSON POST 的 URL，publishableKey 为现有项目公开 key；响应须为 `{ "ok": true }` 才显示成功。字段为 name、role、email、social、event、submissionId、contactConsent 和机器人诱捕字段 website；未配置接口时不发送、不保存报名信息，也不显示成功提示。活动报名与 newsletter 为独立流程。

已按用户要求在现有 Supabase 项目部署 event-register，报名独立保存于 public.event_registrations，表开启 RLS，撤销 anon / authenticated 的直接表权限，仅由后端 service_role 写入。迁移见 supabase/migrations/202611240001_event_registrations.sql，处理器见 supabase/functions/event-register/。同一活动与邮箱唯一，重试不会新增重复报名；保存原文同意说明对应的 contact_consent / consent_version。不加入 newsletter，也不触发 Contact 的邮件工作流。共享 Footer newsletter 继续复用现有 Supabase 名单服务。

允许来源为 mymonthly.io、www.mymonthly.io、va1ia.github.io 与本地 4173 / 4175 端口，可通过 EVENT_ALLOWED_ORIGINS 覆盖。与现有函数相同，使用 @supabase/server 的 publishable key 认证，不使用 legacy JWT 网关检查。浏览器编辑器部署时将 handler.js 内联于 index.ts；仓库源码保持分文件便于验证。

## 修改位置
- 页面文案、图片替代文本：index.html。
- 主图、标题和 Logo：images/。
- 桌面 / 手机布局：styles/page.css。
- 报名交互与共享组件挂载：scripts/page.js。
- 字体注册：styles/foundations/fonts.css；活动与 Footer 共用颜色：tokens.css；活动专属字体选择和字号：本目录 styles/page.css。
- Footer：共享组件的 period 变体；通过 homeHref 支持嵌套活动路径，导航链接按站点根目录解析，兼容仓库子路径部署。

## 验证
已检查 320 / 390 / 820 / 1440px，无横向溢出，所有图片均有 alt，活动页不挂载 Pre-footer。手机导航可打开、Escape 关闭并恢复焦点；新版标题手机表单顶部约 384.84px（390×844），与原站约 384.85px 一致。嵌套路径下首页和法律链接解析正确，浏览器无错误日志。

报名端到端验证：测试邮箱 period-page-test-20261125@example.com，姓名明确标记 TEST ONLY，两次通过网页提交均显示成功；数据库查询确认该活动 / 邮箱仍只有 1 条，contact_consent 为 true。测试记录保留用于核验，不是真实报名；未订阅 newsletter 或发送邮件。公开 key 直接读取报名表返回 401，无 key 调用函数返回 401，未允许来源返回 403。

处理器验证：`node --test event/the-state-of-the-period/scripts/registration.test.mjs`，4 项通过，覆盖清洗、无效输入、请求大小及方法、持久化失败。`git diff --check` 通过。报名接口已部署，网站文件尚未发布。
