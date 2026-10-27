# Contact 实现与接入

## 目录
- 范围与证据
- 文件与预览
- Supabase
- Zapier 工作流
- 验证与边界

## 范围与证据
还原 https://mymonthly.io/contact 的 contact-cards、contact-form，不包含 FAQ / Pre-footer。沿用共享 Menu bar / Footer。已查看用户提供的 https://github.com/morluto/rea；本次直接检查公开 HTML、CSS、Webflow ix2 配置，无需安装额外工具。

原表单名 Website Contact Form，element ID 87ea687c-2c12-0fa9-7c10-5775458538e5。公开源码只有 Webflow 提交入口，没有 Supabase 或 Zapier 配置，不能据此确认旧 Zap 后台的触发器。下拉选项 value 保留原值。

鼠标 a-31：视口 X -2→2vw、Y 0→4vw，smoothing/restingState 50。尺寸为原站测量，待 Figma 确认。卡片和首屏背景使用用户上传 SVG；form/bg-pattern-pc.svg、form/bg-pattern-phone.svg 补自原站公开 CDN，原色保留。

## 文件与预览
入口 contact.html，导航 Contact 指向 ./contact.html，支持静态预览和 GitHub Pages 子路径。访问 http://127.0.0.1:4173/contact.html。结构在 pages/contact/sections/{cards,form}/，数据在 content/contact/，样式入口 styles/contact/index.css，脚本 scripts/contact/。未新增框架或依赖。

## Supabase
2026-10-23：现有项目 gfeutgwgqjsgegravjxk 已创建 contact_submissions，开启 RLS，撤销 anon/authenticated 表权限。表由后端 service_role 写入。schema 见 supabase/migrations/202610230001_contact.sql；不要在已建表项目重复执行。

contact-submit 已部署，legacy JWT 关闭，函数内部使用 @supabase/server auth:publishable 检查公开 key。源文件在 supabase/functions/contact-submit/。浏览器部署将 handler.js 内联到 index.ts 对应 import 位置；CLI 可直接部署本地两文件版本。

CONTACT_ALLOWED_ORIGINS 可覆盖默认允许列表：localhost:4173、127.0.0.1:4173、https://va1ia.github.io、https://mymonthly.io。只填 origin 不含路径。content/contact/form.json 已启用，不含服务端私密 key。

字段：submission_id、first_name、last_name、email、question_type、message、source、created_at。submission_id 唯一，超时重试不会重复新增。请求上限 32KiB，姓名各 256 字符、邮箱 254 字符、留言 5000 字符。honeypot 拒绝明显机器人填写。此入口不订阅 newsletter，不发送邮件。

## Zapier 工作流
2026-10-26：在已登录账号中确认旧有 8 条 Zap 未包含 Contact，故新建并发布 [New Site Contact - inquiry email routing](https://zapier.com/editor/384817268)（ID 384817268，v1）。现有 Footer Newsletter Zap（384458125）未修改。

链路：Contact 表单 → contact-submit → contact_submissions INSERT → Supabase Database Webhook → Zapier Catch Hook → Formatter Lookup Table → Email by Zapier。Webhook 名为 contact-submissions-to-zapier，仅监听 public.contact_submissions 的 INSERT，不监听 UPDATE / DELETE。重复 submission_id 的 upsert 不新增记录，因此不触发第二封邮件。Webhook 在 Supabase Integrations / Database Webhooks 界面维护，不包含在建表迁移中。私有接收 URL 只保存在后台，不写入前端或仓库。

| 原始类型值 | 网页显示 | 收件人 |
| --- | --- | --- |
| First | Press / Collaboration | hello@mymonthly.co |
| Second | Technical Support | support@mymonthly.co |
| Third | Feedback / Suggestions | hello@mymonthly.co |
| Another option | Other | hello@mymonthly.co |
| 空值 / 兜底 | 未选择类型 | hello@mymonthly.co |

邮件来自 My Monthly Contact（Zapier 邮件服务地址），Reply-To 使用留言者邮箱。邮件包含姓名、邮箱、咨询类型、原始留言、提交编号和时间，不会将留言者加入 Newsletter。新流程使用真实 Webhook 样本中的 Record 字段，收件人使用 Formatter 的 Output，避免 Copilot 初始占位字段导致内容缺失或统一走兜底。

2026-10-26 已通过网页完成联调：先提交 1 条草稿映射样本，再发布后分别提交 1 条合作与 1 条支持留言。两次正式运行均显示 Successful；合作 run ID 01a8ceb9-2c91-a547-271b-1f636bf541e4，支持 run ID 01a8ceb9-7dd4-a5ce-e003-178542f11814。所有记录均明确标记 TEST ONLY，邮箱使用 example.com，不是真实用户。未在编辑器点击邮件 Test step（该测试可能转发给账号邮箱），而是核对发布后的真实运行。Zapier 显示发送成功不等同于已核实目标邮箱收件箱或垃圾箱。

后续维护：在 Zap runs 查看执行与收件地址；数据库 Webhook 的网络结果由 Supabase pg_net 管理。Webhook HTTP 失败后应核对记录并人工重放，不能把表单保存成功当成邮件必达；发送频率也受 Email by Zapier 账号限额约束。网站页面本身仍未由本任务发布至正式域名。

2026-10-23 设计调整：以用户两张截图修正手机卡片位置、姓名同排、表单比例；输入提示用灰色，填写文字用绿色；下拉边框改为同色绿色，自定义箭头向内留白。卡片悬停轻微变灰、邮箱悬停降低透明度。截图旧版卡片文案未替换当前 Brand Collab / Help Center 文案。

## 验证与边界
本地网页真实提交 contact-test-20261023@example.com，留言注明 TEST ONLY；接口 HTTP 200 / ok:true，网页显示成功。测试记录不是真实用户。数据库查询确认只有 1 条；使用同一 submission_id 重试返回成功且仍只有 1 条。公开 key 读取留言表返回 HTTP 401。

浏览器检查 390、768、1440px 无页面横向溢出，已查看桌面和手机截图。手机菜单 Escape 关闭并恢复按钮焦点。浏览器分发 pointermove 验证了背景左右移动，减少动画恢复 0/0vw；后台标签原生鼠标事件未送达，不能冒称实鼠手测。

模拟 HTTP 503 后表单保留输入、恢复按钮并显示失败提示。运行 `node scripts/contact/tests/contact.test.mjs` 可复查处理器与适配器。

本地处理器验证字段清洗、非法输入、超长请求、honeypot、存储失败与方法限制；适配器验证成功、失败、禁用状态。Zapier 连接及发送验证见上节；未直接读取目标邮箱收件箱。反滥用当前为字段校验和 honeypot，尚未迁移原站 Webflow Turnstile；若需加强可使用自有域名的机器人校验。

官方参考：[函数认证](https://supabase.com/docs/guides/functions/auth)、[RLS](https://supabase.com/docs/guides/database/postgres/row-level-security)。
